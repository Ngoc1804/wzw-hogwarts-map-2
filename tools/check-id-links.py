import math,json,re,base64,gzip,collections,xml.etree.ElementTree as E,hashlib
from pathlib import Path
load=lambda p:json.loads(Path(p).read_text())
c=load('assets/catalog.json');r=load('assets/recipes.json');a=load('assets/atlas.json');art=load('assets/p4-art.json');v=load('assets/vocabulary.json');s=Path('examples/WIZAMAP_FIXED_UI.html').read_text();pack=json.loads(gzip.decompress(base64.b64decode(re.search(r'id="wzw-embedded-atlas"[^>]*>(.*?)</script>',s,re.S)[1])))
issues=[];counts={};checks={};coordinateAnchors=[]
def issue(kind,owner,ref):issues.append({'kind':kind,'owner':owner,'ref':ref})
for rid,recipe in r.items():
 ids=[i['id'] for i in recipe['instances']]
 for id,n in collections.Counter(ids).items():
  if n>1:issue('duplicate-instance',rid,id)
 for i in recipe['instances']:
  if i['item'] not in c:issue('missing-item',rid,i['item'])
  if i.get('parentId') and i['parentId'] not in ids:issue('missing-parent',rid,i['parentId'])
 if rid not in art:issue('missing-art',rid,rid)
for rid,data in art.items():
 recipeids={i['id']:i['item'] for i in r.get(rid,{}).get('instances',[])}
 for o in data['objects']:
  if o['id'] not in recipeids:issue('orphan-art-instance',rid,o['id'])
  elif o['item']!=recipeids[o['id']]:issue('art-item-mismatch',rid,o['id'])
for kind in ['recipes','legacyRecipes','scopes','itemAliases']:
 target=r if kind in ['recipes','legacyRecipes'] else c if kind=='itemAliases' else {**a['clusters'],**a['fixed'],'custom':{}}
 for word,id in v[kind].items():
  if id not in target:issue('vocab-'+kind,word,id)
allrooms=[]
for scope,z in a['clusters'].items():
 for p in z['rooms']+ [p for site in z.get('sites',[]) for p in site['rooms']]:
  allrooms.append(p['id'])
  if p.get('type') and p['type'] not in r:issue('atlas-recipe',scope,p['type'])
 for ref in z.get('pointers',[]):
  if ref not in a['fixed'] and ref not in a['clusters']:issue('atlas-pointer',scope,ref)
for id,n in collections.Counter(allrooms).items():
 if n>1:issue('duplicate-room-id','atlas',id)
for fid,z in a['fixed'].items():
 actual={p['id'] for p in pack['maps'][fid]['places']};svgids=set(re.findall(r'data-id=[\"\']([^\"\']+)',pack['maps'][fid]['svg']))
 for p in z['places']:
  if p['id'] not in actual:issue('fixed-place-binding',fid,p['id'])
 for p in pack['maps'][fid]['places']:
  if p['id'] not in svgids:
   if all(isinstance(p.get(k),(int,float)) and math.isfinite(p[k]) for k in ['x','y']):coordinateAnchors.append({'map':fid,'id':p['id'],'x':p['x'],'y':p['y'],'binding':'presentation anchor from source coordinates'})
   else:issue('fixed-svg-anchor',fid,p['id'])
for id,data in c.items():
 try:root=E.fromstring(data['svg'])
 except Exception as e:issue('svg-parse',id,str(e));continue
 ids=[n.get('id') for n in root.iter() if n.get('id')];refs=re.findall(r'(?:url\([\"\']?#|(?:href|xlink:href)=[\"\']#)([^\"\')\s]+)',data['svg'])
 for ref in set(refs)-set(ids):issue('catalog-svg-ref',id,ref)
 for ref,n in collections.Counter(ids).items():
  if n>1:issue('catalog-svg-duplicate-id',id,ref)
bundle=Path('dist/bundle.js').read_text();decoder=json.JSONDecoder()
for name,obj in [('CATALOG',c),('RECIPES',r),('P4_ART',art),('ATLAS',a)]:
 runtime=decoder.raw_decode(bundle.split('const '+name+'=',1)[1])[0]
 checks['runtime-'+name+'-keys']=set(runtime)==set(obj)
counts.update(catalog=len(c),recipes=len(r),instances=sum(len(x['instances']) for x in r.values()),clusters=len(a['clusters']),fixed=len(a['fixed']),atlasRoomsIncludingWorld=len(allrooms))
result={'counts':counts,'checks':checks,'issues':issues,'issueCounts':dict(collections.Counter(i['kind'] for i in issues)),'coordinatePresentationAnchors':coordinateAnchors}
Path('work').mkdir(parents=True,exist_ok=True)
Path('work/id-audit.json').write_text(json.dumps(result,ensure_ascii=False,indent=2));print(json.dumps({**counts,'checks':checks,'issueCounts':result['issueCounts'],'examples':issues[:12]},ensure_ascii=False,indent=2))
