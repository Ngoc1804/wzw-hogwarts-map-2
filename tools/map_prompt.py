"""Generate one /map system-instruction block using native IDs and the standard loader."""
from pathlib import Path
import json,re,sys
sys.path.insert(0,str(Path(__file__).resolve().parent))
from loader import loader
root=Path(__file__).resolve().parents[1]
release=json.loads((root/'assets/runtime-release.json').read_text());base='https://cdn.jsdelivr.net/gh/'+release['repository']+'@'+release['runtimeCommit']+'/dist/'
recipes=json.loads((root/'assets/recipes.json').read_text());catalog=json.loads((root/'assets/catalog.json').read_text());atlas=json.loads((root/'assets/atlas.json').read_text())
def wrap(keys,width=100):
 lines=[];line=''
 for key in keys:
  if len(line)+len(key)+1>width:lines.append(line);line=''
  line+=((' 'if line else'')+key)
 if line:lines.append(line)
 return '\n'.join(lines)
out=(root/'docs/MAP_INSTRUCTIONS.md').read_text()+'## 3. NATIVE ID LOOKUP\n\n'
out+='Owner→atlasAnchor; place ID/name→pcPlace/placeId/placeName (use configured Atlas for rooms, never guess numbered IDs).\n```text\n'+wrap(list(atlas['fixed'])+list(atlas['clusters'])+['custom'])+'\n```\n'
out+='Geometry→layoutType\n```text\nhorizontal vertical windows ell tee cross court cloister curved tower\n```\n'
out+='Recipe/function→places[].type; do not add its automatic furniture again.\n```text\n'+wrap(recipes)+'\n```\n'
out+='Individual furniture→props[].item. Prefix+suffix gives the exact native ID; this is lookup notation, not an engine alias. Other verified native assets may be used; missing items may be generated.\n```text\n'
for prefix in ['seat.','table.','storage.','bed.','fixture.','object.','extra.','wizard.','decor.','unique.','new.','detail.','layout.']:
 keys=[key[len(prefix):]for key in catalog if key.startswith(prefix)]
 out+=prefix+'\n'+wrap(keys)+'\n\n'
out+='```\nWhole premade interiors→props[].item. Prefix: cluster.layout-. No tabletop-detail/component workflow.\n```text\n'
keys=[key.removeprefix('cluster.layout-')for key in catalog if key.startswith('cluster.layout-')and not re.search(r'_(notes|cards|writing|scroll|flowers|painting)$',key)]
out+=wrap(keys)+'\n```\n'
data={'schemaVersion':'2.0.0','meta':{'date':'','time':'','areaName':'','quote':''},'atlasAnchor':'','pcPlace':'','pcSpot':'','places':[],'actors':[{'name':'','isPC':True,'tagType':'','footstep':'hidden'}],'events':[]}
html=loader(base,json.dumps(data,ensure_ascii=False,indent=2))
out+='\n## 4. HTML OUTPUT\n\nFill map-data; add only supported optional fields. Keep loader and release URLs unchanged. No unresolved required values in emitted HTML.\n```html\n'+html+'\n```\n'
(root/'docs/MAP_PROMPT.md').write_text(out)
print('MAP_PROMPT:',len(out.encode()),'bytes;',len(out),'characters; native loader; no story settings in payload.')
