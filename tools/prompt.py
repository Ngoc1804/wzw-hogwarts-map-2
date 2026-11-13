"""Build the English ATLAS-ONLY system-instruction fragment. Never writes /map instructions or loader."""
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
a=json.loads((ROOT/'assets/atlas.json').read_text())
import re
master=(ROOT/'docs/WZW_MAP2_ATLAS_GITHUB_MASTER.md').read_text()
fixed=re.search(r'```atlas-english-prefix\n(.*?)```',master,re.S).group(1)
parts=[fixed]
for floor in ['SUB-DUNGEONS','DUNGEONS','KITCHENS',*[f'F{i}'for i in range(1,9)]]:
 parts.append('- '+floor+':')
 for direction in 'NESW':
  c=a['clusters'][floor+'-'+direction]
  names=[p['name']for p in c['rooms']]+['→'+x for x in c['pointers']]
  parts.append('  '+direction+': '+'; '.join(names)+'.')
parts.append('\n### Towers\nGryffindor/Ravenclaw → their Fixed; Owlery → h2. Alias IDs below; Entry/Base/Mid/Top are source levels.')
v=json.loads((ROOT/'assets/vocabulary.json').read_text())
for alias,cid in v['scopes'].items():
 if not alias.startswith('tower-'):continue
 c=a['clusters'][cid];levels={}
 for p in c['rooms']:levels.setdefault(p['level'],[]).append(p['name'])
 parts.append('- '+alias+': '+'; '.join(level+' ['+', '.join(names)+']'for level,names in levels.items())+(' →'+','.join(c['pointers'])if c['pointers']else '')+'.')
parts.append('\n## 4. AU\nStatus is source context, not a visualizer ban when RP places PC there. AU names inside known regions retain their region.')
for alias in ['au-home','au-ccc','au-liad','au-whitecap']:
 c=a['clusters'][v['scopes'][alias]];levels={}
 for p in c['rooms']:levels.setdefault(p['level'],[]).append(p['name'])
 context={'au-home':'PC Home, London','au-ccc':'CCC 07.18, Hogwarts F8W','au-liad':"Liad's Attic, Hogwarts",'au-whitecap':'Whitecap Estate, Isle of Wight (source LOCKED/UNBUILT)'}[alias]
 parts.append('- '+alias+' ('+context+'): '+'; '.join((level+' 'if level else '')+'['+', '.join(names)+']'for level,names in levels.items())+'.')
parts.append('- Other named AU: 7 Rowan Mews/London, WzW House/Soho, Loft 5A/Fitzrovia, Grayhaven Estate/California. Use current region or custom; rooms follow RP.\n')
out='\n'.join(parts)
(ROOT/'docs/WZW_MAP2_ATLAS_GEMINI_MIN.md').write_text(out)
# Legacy paths redirect rather than maintaining a parallel Atlas/prompt.
(ROOT/'docs/W4_1.md').write_text('# Atlas routing fragment\n\nUse [English Atlas-only fragment](WZW_MAP2_ATLAS_GEMINI_MIN.md). /map contract and loader instructions are separate and will be combined into one system prompt at P8. This file contains no second routing table.\n')
print('Atlas-only English:',len(out.encode()),'bytes,',len(out),'characters;',len(out.splitlines()),'lines')
