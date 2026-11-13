"""One approved HTML source; deterministic distribution, no runtime patches."""
from pathlib import Path
import re,json,gzip,base64,hashlib
r=Path(__file__).resolve().parents[1];s=(r/'examples/template-review.html').read_text()
packed=re.search(r'<script[^>]*id="wzw-embedded-atlas"[^>]*>(.*?)</script>',s,re.S)[1]
data=json.loads(gzip.decompress(base64.b64decode(packed)))
assert len(data['maps'])==13
# Remove JSON whitespace inside compressed transport; preserve every map/vector.
raw=json.dumps(data,ensure_ascii=False,separators=(',',':')).encode();payload=base64.b64encode(gzip.compress(raw,compresslevel=9,mtime=0)).decode()
s=s.replace(packed,payload)
(r/'examples/template-review.html').write_text(s)
css=re.search(r'<style>(.*?)</style>',s,re.S)[1]
body=re.search(r'<body>(.*?)</body>',s,re.S)[1];scripts=re.findall(r'<script([^>]*)>(.*?)</script>',body,re.S);code=scripts[-1][1]
body=re.sub(r'<script\b[^>]*>.*?</script>','',body,flags=re.S)
code=code[:code.index('async function boot()')]
# Offline-only picker is not shipped to RP runtime.
code=re.sub(r'function mountTemplatePicker\(\)\{.*?\n\}', '', code, flags=re.S)
pack='window.WZW_TEMPLATE_PACK='+json.dumps(payload)+';\n'
# Runtime consumes recipe identities/inventory only; reference transforms/descriptions stay in source.
recipes=json.loads((r/'assets/recipes.json').read_text())
compact_recipes={rid:{'instances':[{k:x[k] for k in ['id','name','item','count'] if k in x} for x in recipe['instances']]} for rid,recipe in recipes.items()}
atlas=json.loads((r/'assets/atlas.json').read_text());atlas.pop('fixed',None) # Fixed metadata already packed once.
# Reuse the supplied architecture core, excluding the reference editor UI/startup.
# Patterns, wall projection and openings have one active implementation.
corridors=(r/'assets/source/corridors.js').read_text()
corridors=corridors[:corridors.index('function Q(')]
corridors=re.sub(r'try\{const t=JSON.parse\(e\("saved-state"\).textContent\);.*?\}catch\{\}', '', corridors)
architecture='const CORRIDORS=(()=>{'+corridors+';return {build:V,draw:q,defaults:s,templates:t,decor:Z,decorate:A};})();\n'
catalog=json.loads(gzip.decompress((r/'assets/source/catalog.json.gz').read_bytes()))['data']['assets']
scenery={k:{'svg':v['svg'],'bounds':v['occupancy']} for k,v in catalog.items() if k.startswith(('house.','tree.','terrain.','plant.','landscape.'))}
scenery.update(json.loads((r/'assets/outdoor-extra.json').read_text()))
entry='const SCENERY='+json.dumps(scenery,ensure_ascii=False,separators=(',',':'))+';\n'+architecture+'const P4_ART='+(r/'assets/p4-art.json').read_text()+';\nconst VOCAB='+(r/'assets/vocabulary.json').read_text()+';\nconst RECIPES='+json.dumps(compact_recipes,ensure_ascii=False,separators=(',',':'))+';\nconst ATLAS='+json.dumps(atlas,ensure_ascii=False,separators=(',',':'))+';\n'+'\n'.join((r/'src'/name).read_text() for name in ['contract.js','props.js','resolver.js','draw.js','build.js','index.js'])
bundle='(()=>{\nif(window.WZW_BOOT)return;\n'+"const root=document.getElementById('wzw-map');if(!root)throw Error('Missing wzw-map root');root.innerHTML="+json.dumps(body,ensure_ascii=False)+';\n'+code+'\n'+entry+'\n})();\n'
for name,content in [('shell.css',css),('templates-pack.js',pack),('bundle.js',bundle)]: (r/'dist'/name).write_text(content)
report={p.name:{'bytes':len(p.read_bytes()),'gzipBytes':len(gzip.compress(p.read_bytes(),mtime=0)),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in [r/'examples/template-review.html',*sorted((r/'dist').glob('*'))]}
(r/'docs/build-metrics.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
