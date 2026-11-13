"""User-directed catalog cleanup; never touches Fixed artwork or intake HTML."""
import json,re,hashlib,colorsys,xml.etree.ElementTree as ET
from pathlib import Path
r=Path(__file__).resolve().parents[1]
def read(p):return json.loads((r/p).read_text())
def save(p,x):(r/p).write_text(json.dumps(x,ensure_ascii=False,separators=(',',':')))
c=read('assets/catalog.json');removed=[k for k in c if k.startswith('tabletop.')]
recipes=read('assets/recipes.json');assert not any(i['item'] in removed for v in recipes.values() for i in v['instances'])
for k in removed:del c[k]
def fingerprint(s):
 root=ET.fromstring(s);ids={n.get('id'):'id'+str(i) for i,n in enumerate(root.iter()) if n.get('id')}
 def walk(n):
  attrs={}
  for k,v in n.attrib.items():
   if k in ['id','role','aria-label'] or k.startswith('data-'):continue
   for old,new in sorted(ids.items(),key=lambda x:-len(x[0])):v=v.replace('url(#'+old+')','url(#'+new+')');v=('#'+new) if v=='#'+old else v
   attrs[k]=v
  return [n.tag,sorted(attrs.items()),(n.text or '').strip(),[walk(ch) for ch in n]]
 return json.dumps(walk(root),ensure_ascii=False)
seen={};aliases={};groups=[]
for k,a in list(c.items()):
 if not k.startswith('cluster.layout-'):continue
 sig=fingerprint(a['svg'])
 if sig in seen:
  target=seen[sig];aliases[k]=target;c[target]['aliases']=sorted(set(c[target].get('aliases',[])+[k,a.get('name',k)]));groups.append([k,target]);del c[k]
 else:seen[sig]=k
# Material-specific muted walnut, aged brass, burgundy; preserve gradients and source geometry.
bases={'wood':'#916849','timber':'#916849','fabric':'#793D48','metal':'#A68A53','paper':'#DACAA5','stone':'#A9A394','ceramic':'#A6B29E','glass':'#88AAA5'}
changes=[]
def paint(svg):
 def tag(m):
  s=m[0];mat=re.search(r'data-material="([^"]+)"',s)
  if not mat or mat[1] not in bases:return s
  def color(m):
   rgb=[int(m[2][i:i+2],16)/255 for i in (1,3,5)];l=sum(rgb)/3;target=bases[mat[1]];factor=.62+l*.55
   new='#'+''.join(f'{min(255,round(int(target[i:i+2],16)*factor)):02x}' for i in (1,3,5))
   return m[1]+'="'+new+'"'
  return re.sub(r'(fill|stop-color)="(#[0-9a-fA-F]{6})"',color,s)
 return re.sub(r'<[^>]+>',tag,svg)
for k,a in c.items():
 if a.get('corridorSource') or a.get('paletteVersion')=='hogwarts-1':continue
 old=a['svg'];a['svg']=paint(old)
 if a['svg']!=old:changes.append(k);a['paletteVersion']='hogwarts-1'
for rec in recipes.values():
 for i in rec['instances']:i['item']=aliases.get(i['item'],i['item'])
art=read('assets/p4-art.json')
for v in art.values():
 if v.get('paletteVersion')=='hogwarts-1':continue
 v['paletteVersion']='hogwarts-1'
 for field in ['defs','sceneSvg']:
  if field in v:v[field]=paint(v[field])
 for o in v['objects']:o['svg']=paint(o['svg']);o['item']=aliases.get(o['item'],o['item'])
vocab=read('assets/vocabulary.json');vocab.setdefault('itemAliases',{}).update(aliases)
save('assets/catalog.json',c);save('assets/recipes.json',recipes);save('assets/p4-art.json',art);save('assets/vocabulary.json',vocab)
save('docs/CATALOG_STYLE_CLEANUP.json',{'removedTabletop':removed,'exactSvgAliases':aliases,'styledAssets':changes,'palette':bases,'remaining':len(c),'dedupe':'XML geometry/fills/transforms/viewBox retained; IDs and descriptive labels normalized; no name-only dedupe','Fixed':'unchanged'})
print('removed',len(removed),'SVG duplicates',len(aliases),'styled',len(changes),'remaining',len(c))
