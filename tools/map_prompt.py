"""Generate short Gemini instruction + SHA-pinned standard loader."""
from pathlib import Path
import json,re,sys
sys.path.insert(0,str(Path(__file__).resolve().parent))
from loader import loader
root=Path(__file__).resolve().parents[1]
release=json.loads((root/'assets/runtime-release.json').read_text());sha=release['runtimeCommit']
assert re.fullmatch('[0-9a-f]{40}',sha)
base='https://cdn.jsdelivr.net/gh/'+release['repository']+'@'+sha+'/dist/'
example={'schemaVersion':'2.0.0','meta':{'date':'','time':'','areaName':'','quote':''},'atlasAnchor':'','pcPlace':'','pcSpot':'','places':[],'actors':[{'name':'','isPC':True,'spot':'inside'}],'events':[]}
out='\n\n'.join([(root/'prompts/MAP_RULES.txt').read_text(),(root/'prompts/ATLAS_GEMINI_MIN.txt').read_text(),'HTML OUTPUT — fill required fields from RP:',loader(base,json.dumps(example,ensure_ascii=False,separators=(',',':')))])
(root/'prompts/MAP_PROMPT.txt').write_text(out)
print('MAP prompt',len(out.encode()),'bytes')
