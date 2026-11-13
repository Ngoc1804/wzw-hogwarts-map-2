"""Apply explicit paint decisions; source intake and Fixed remain untouched."""
import json
from pathlib import Path
r=Path(__file__).resolve().parents[1]
edits=json.loads((r/'assets/paint-edits.json').read_text())
p=r/'assets/catalog.json';cat=json.loads(p.read_text())
for id,changes in edits.items():
 a=cat[id]
 for old,new in changes:a['svg']=a['svg'].replace(old,new)
 a['paintEdits']=changes
p.write_text(json.dumps(cat,ensure_ascii=False,separators=(',',':')))
# Same artwork fragments in recipes use the same decisions.
p=r/'assets/p4-art.json';s=p.read_text();data=json.loads(s)
for a in data.values():
 for field in ['defs','sceneSvg']:
  if field in a:
   for changes in edits.values():
    for old,new in changes:a[field]=a[field].replace(old,new)
 for o in a['objects']:
  for changes in edits.values():
   for old,new in changes:o['svg']=o['svg'].replace(old,new)
p.write_text(json.dumps(data,ensure_ascii=False,separators=(',',':')))
print('Explicit stroke-only paint:',len(edits),'assets')
