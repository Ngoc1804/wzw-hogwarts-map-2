"""Candidate selection from the audited SVG inventory; never edits production assets."""
from pathlib import Path
import json,re,hashlib,xml.etree.ElementTree as E,collections,csv
E.register_namespace('','http://www.w3.org/2000/svg');E.register_namespace('xlink','http://www.w3.org/1999/xlink')
import re,json
def pathcanon(d):
 ts=re.findall(r'[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?',d);i=0;cmd=None;x=y=sx=sy=0;out=[];sizes={'M':2,'L':2,'H':1,'V':1,'C':6,'S':4,'Q':4,'T':2,'A':7}
 while i<len(ts):
  if ts[i].isalpha():cmd=ts[i];i+=1
  if not cmd:raise ValueError('path command')
  c=cmd.upper();rel=cmd.islower()
  if c=='Z':out.append(['Z']);x,y=sx,sy;cmd=None;continue
  n=sizes[c];v=list(map(float,ts[i:i+n]));i+=n
  if len(v)!=n:raise ValueError('path args')
  if c=='H':v=[v[0]+(x if rel else 0),y];kind='L'
  elif c=='V':v=[x,v[0]+(y if rel else 0)];kind='L'
  else:
   kind=c
   if rel:
    if c=='A':v[-2]+=x;v[-1]+=y
    else:
     v=[vv+(x if k%2==0 else y)for k,vv in enumerate(v)]
  x,y=v[-2:]
  if c=='M':sx,sy=x,y;cmd='l'if rel else'L'
  out.append([kind,*[round(z,6)for z in v]])
 return json.dumps(out,separators=(',',':'))

items=json.load(open('work/svg-audit/render-input.json'))
# Same drawing geometry, including drawing order and inherited transforms. No name key.
geom={'path':['d'],'rect':['x','y','width','height','rx','ry'],'circle':['cx','cy','r'],'ellipse':['cx','cy','rx','ry'],'line':['x1','y1','x2','y2'],'polygon':['points'],'polyline':['points'],'text':['x','y'],'use':['href','x','y','width','height']}
def fingerprint(a):
 root=E.fromstring(a['svg']);out=[]
 def walk(n,anc=()):
  tag=n.tag.split('}')[-1]
  if tag in ['defs','title','desc','metadata','style']:return
  transforms=anc+((n.get('transform'),)if n.get('transform')else())
  if tag in geom:
   attrs=[]
   for key in geom[tag]:
    val=n.get(key,n.get('{http://www.w3.org/1999/xlink}'+key,''))
    if key=='href':val='LOCAL_REF'if val.startswith('#')else val
    if key=='d' and val:val=pathcanon(val)
    if val:attrs.append((key,' '.join(re.sub(r',',' ',val).split())))
   out.append((tag,attrs,transforms,(n.text or '').strip()if tag=='text'else''))
  for c in n:walk(c,transforms)
 walk(root)
 # Pattern and clipping geometry is part of the design, not merely a color.
 for n in root.iter():
  tag=n.tag.split('}')[-1]
  if tag in ['pattern','clipPath']:
   out.append(('paint-region',tag,sorted((k,v)for k,v in n.attrib.items()if k not in ['id','fill','stroke'])))
   walk(n)
 # use-heavy drawings require exact reference structure to avoid false merges.
 if any(n.tag.split('}')[-1]=='use'for n in root.iter()):return 'ref:'+hashlib.sha256(a['svg'].encode()).hexdigest()
 return hashlib.sha256(json.dumps([root.get('viewBox'),a.get('view'),out],sort_keys=True).encode()).hexdigest()
def colorScore(a):
 s=a['svg'];return len(re.findall(r'(?:fill|stop-color)="(?:#[0-9a-fA-F]+|url\()',s))-len(re.findall(r'fill="var\([^\"]*none\)',s))
priority={'C4':100,'runtime-catalog':85,'runtime-interiors':80,'259':50,'repo-catalog':40,'repo-interiors':30,'repo-outdoor-extract':70}
groups=collections.defaultdict(list);excluded=[]
for a in items:
 if a['id'].startswith('tree.')and a['id']not in ['tree.ancient','tree.willow']and a['source']!='259':excluded.append(a);continue
 groups[fingerprint(a)].append(a)
selected=[];mapping=[]
for h,rows in groups.items():
 rows.sort(key=lambda a:(colorScore(a)>0,priority.get(a['source'],0),colorScore(a)),reverse=True);win=rows[0]
 slug=re.sub(r'[^a-z0-9]+','-',win['id'].lower()).strip('-');cid='wm.'+slug+'.'+h[-8:]
 a={**win,'id':cid,'originalId':win['id'],'designHash':h,'aliases':sorted(set(r['id']for r in rows)),'sources':sorted(set(r['source']for r in rows))}
 a['coloredBy']='source'if colorScore(win)>0 else 'material palette'
 root=E.fromstring(a['svg']);ids={n.get('id'):'wm-'+h[-12:]+'-'+str(i)for i,n in enumerate(root.iter())if n.get('id')}
 for n in root.iter():
  for k,v in list(n.attrib.items()):
   if k=='id':n.set(k,ids[v]);continue
   v=re.sub(r'url\(\s*[\"\']?#([^\s)\"\']+)[\"\']?\s*\)',lambda m:'url(#'+ids.get(m[1],m[1])+')',v)
   if k.split('}')[-1]=='href'and v.startswith('#'):v='#'+ids.get(v[1:],v[1:])
   n.set(k,v)
  if n.tag.split('}')[-1]=='style'and n.text:n.text=re.sub(r'#([\w-]+)',lambda m:'#'+ids.get(m[1],m[1]),n.text)
 palette={'--base':'#bea27b','--surface':'#e7d9b9','--wall':'#d3c5a7','--wood':'#95734f','--roof':'#657e72','--glass':'#b6cdc6','--foliage':'#879b69','--foliage-dark':'#5e7951','--ink':'#68553e','--shadow':'#8c997b','--metal':'#b5a16e','--fabric':'#9aa88c','--accent':'#927b50'}
 root.set('style',(root.get('style','')+';'+''.join(k+':'+v+';'for k,v in palette.items())))
 a['svg']=E.tostring(root,encoding='unicode');a.pop('role',None);selected.append(a)
 for r in rows:mapping.append({'source':r['source'],'oldId':r['id'],'name':r.get('name',''),'action':'KEEP_COLORED'if r is win else 'SHARE_SAME_DESIGN','canonicalId':cid,'selectedSource':win['source'],'selectedOriginalId':win['id'],'designHash':h,'reason':'same geometry/view/order; prefer colored source, no name-only merge'})
for a in excluded:mapping.append({'source':a['source'],'oldId':a['id'],'name':a.get('name',''),'action':'REMOVE_OLD_TREE_CANDIDATE','canonicalId':'','selectedSource':'259','selectedOriginalId':'','designHash':fingerprint(a),'reason':'replace ordinary tree library; not special ancient/willow; production unchanged pending review'})
# Composition geometry comes from actual painted bounds measured in a browser next.
Path('work/catalog-selection.json').write_text(json.dumps(selected,ensure_ascii=False));Path('work/catalog-mapping.json').write_text(json.dumps(mapping,ensure_ascii=False))
print('input',len(items),'excluded ordinary tree copies',len(excluded),'selected designs',len(selected),'same-design copies',sum(r['action']=='SHARE_SAME_DESIGN'for r in mapping))
