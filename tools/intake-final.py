"""Read-only audit of user final sources; no production/catalog mutations."""
from pathlib import Path
import json,re,gzip,base64,hashlib,collections,csv,xml.etree.ElementTree as E
ROOT=Path('assets/intake/final-2026-11-14');OUT=Path('docs/final-intake');OUT.mkdir(exist_ok=True)
# Reuse canonical path parser only, without running the old selection tool.
ns={};exec(Path('tools/catalog-dedupe.py').read_text().split('items=json.load')[0],ns);pathcanon=ns['pathcanon']
def unpack(p):
 s=p.read_text();m=re.search(r'<script[^>]*type="application/octet-stream"[^>]*>(.*?)</script>',s,re.S)
 return json.loads(gzip.decompress(base64.b64decode(m[1])))
a=unpack(ROOT/'WIZAMAP_ASSETS_FINAL.html')['assets'];layout=unpack(ROOT/'WIZAMAP_LAYOUTS_FINAL.html');browser=json.load(open('work/final-intake/WIZAMAP_LAYOUTS_FINAL.html.browser.json'))['pack'];l=list(browser['assets'].values());old=json.load(open('examples/asset-review-data.json'))['assets']
def sig(s,geometry=False):
 r=E.fromstring(s);ids={n.get('id'):str(i)for i,n in enumerate(r.iter())if n.get('id')}
 def walk(n):
  tag=n.tag.split('}')[-1]
  if tag in ['title','desc','metadata']:return None
  attrs={}
  for k,v in n.attrib.items():
   k=k.split('}')[-1]
   if k=='id'or k.startswith('data-'):continue
   if geometry and k in ['fill','stroke','stop-color','opacity','fill-opacity','stroke-opacity','style','class']:continue
   if k=='d':v=pathcanon(v)
   v=re.sub(r'url\(#([^)]*)\)',lambda m:'url(#'+ids.get(m[1],m[1])+')',v)
   if k=='href'and v.startswith('#'):v='#'+ids.get(v[1:],v[1:])
   attrs[k]=v
  return[tag,sorted(attrs.items()),(n.text or '').strip(),[x for c in n if(x:=walk(c))is not None]]
 return hashlib.sha256(json.dumps(walk(r),sort_keys=True).encode()).hexdigest()
issues=[];records=[]
for source,items in [('final-assets',a),('layout-data',l)]:
 counts=collections.Counter(x['id']for x in items)
 for id,n in counts.items():
  if n>1:issues.append({'source':source,'id':id,'issue':'duplicate asset ID','detail':n})
 for x in items:
  row={'source':source,'id':x['id'],'name':x.get('name',''),'view':x.get('view',''),'category':x.get('category','')}
  try:
   svg=x['svg'];r=E.fromstring(svg);ids=[n.get('id')for n in r.iter()if n.get('id')]
   refs=re.findall(r'url\(\s*[\"\']?#([^\s)\"\']+)',svg)+re.findall(r'(?:href)=[\"\']#([^\"\']+)',svg)
   for id,n in collections.Counter(ids).items():
    if n>1:issues.append({'source':source,'id':x['id'],'issue':'duplicate local SVG ID','detail':id})
   for ref in set(refs)-set(ids):issues.append({'source':source,'id':x['id'],'issue':'missing local reference','detail':ref})
   if not r.get('viewBox'):issues.append({'source':source,'id':x['id'],'issue':'missing viewBox','detail':''})
   row.update(paintHash=sig(svg),geometryHash=sig(svg,True),collisionReady=x.get('occupancy',{}).get('collisionReady','unspecified'))
  except Exception as e:issues.append({'source':source,'id':x['id'],'issue':'parse','detail':str(e)})
  records.append(row)
def write(name,rows):
 if not rows:return
 with(OUT/name).open('w')as f:
  w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
write('inventory.csv',records);write('issues.csv',issues)
groups=collections.defaultdict(list)
for r in records:groups[r['geometryHash']].append(r)
write('geometry-groups.csv',[{'geometryHash':h,'members':' | '.join(r['source']+':'+r['id']for r in rs),'decision':'REVIEW_SAME_GEOMETRY_KEEP_PAINT_VARIANTS'}for h,rs in groups.items()if len(rs)>1])
newg=collections.defaultdict(list);newid={x['id']:x for x in a}
for x in a:newg[sig(x['svg'],True)].append(x['id'])
mapping=[]
for x in old:
 matches=newg.get(sig(x['svg'],True),[]);aliases=set(x.get('aliases',[])+[x.get('originalId',''),x['id']]);named=sorted(aliases&newid.keys())
 mapping.append({'oldId':x['id'],'oldName':x.get('name',''),'newIds':' | '.join(matches or named),'status':'GEOMETRY_MATCH'if matches else'ID_ONLY_REVIEW_CHANGED_DRAWING'if named else'NO_AUTOMATIC_MATCH','note':'proposal only; no runtime references changed'})
write('old-to-new.csv',mapping)
summary={'baseCommit':'9213f03cea84910b7f96d9e272f7f4255666d373','files':[{'file':p.name,'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}for p in sorted(ROOT.glob('*.html'))],'finalAssets':len(a),'layoutInitialDataAssets':len(layout['data']['assets']),'layoutEffectiveAssets':len(l),'layouts':len(browser['rooms']),'issues':len(issues),'geometryGroupsWithMultipleRecords':sum(len(v)>1 for v in groups.values()),'mapping':dict(collections.Counter(r['status']for r in mapping)),'initialCollisionNotReady':sum(x.get('occupancy',{}).get('collisionReady')is False for x in layout['data']['assets'].values()),'effectiveCollisionUnspecified':sum('collisionReady'not in x.get('occupancy',{}) for x in l),'layoutOnlyIds':sorted(set(browser['assets'])-set(newid)),'scope':'intake only; no artwork/layout/runtime changes'}
(OUT/'baseline.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2));print(json.dumps(summary,ensure_ascii=False,indent=2))

write('layouts.csv',[{'id':r['id'],'name':r['name'],'width':r.get('w'),'height':r.get('h'),'variants':json.dumps(r.get('variants',[]),ensure_ascii=False),'door':json.dumps(r.get('door',{}),ensure_ascii=False)}for r in browser['rooms']])
