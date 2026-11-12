"""Compile canonical ID tables in ATLAS_W4.md. No independent location source."""
from pathlib import Path
import re,json
r=Path(__file__).resolve().parents[1];s=(r/'docs/ATLAS_W4.md').read_text();fixed={};clusters={}
fixed_text=s.split('### 6.2.',1)[1].split('### 6.3.',1)[0]
for cid,body in re.findall(r'#### `([^`]+)`\n(.*?)(?=\n#### |\Z)',fixed_text,re.S):
 fixed[cid]={'places':[{'id':pid,'name':name.strip().rstrip('.')} for pid,name in re.findall(r'`([^`]+)`=([^;\n]+)',body)]}
for cid,layout,status,body in re.findall(r'#### `([^`]+)` \[(\w+)\](?: (ACTIVE|LOCKED))?(?: — [^\n]*)?\n(.*?)(?=\n#{2,4} |\Z)',s,re.S):
 rooms=[]
 for pid,name,level,recipe in re.findall(r'`([^`]+)`=(.*?)(?: \[([^\]]+)\])? → (?:`([^`]+)`|—)(?=;|\.\n)',body):
  rooms.append({'id':pid,'name':name,'owner':cid,'level':level,'type':recipe})
 pointers=re.search(r'Pointers: (.*?)\.\n',body);ptr=pointers[1].split(', ') if pointers else []
 clusters[cid]={'id':cid,'name':cid,'layout':layout,'rooms':rooms,'pointers':ptr}
 if status:clusters[cid]['status']=status
 if not rooms and not ptr:clusters[cid]['rpScope']=True
(r/'assets/atlas.json').write_text(json.dumps({'clusters':clusters,'fixed':fixed,'source':'docs/ATLAS_W4.md'},ensure_ascii=False,separators=(',',':')))
print(len(fixed),'Fixed',sum(len(v['places']) for v in fixed.values()),'anchors;',len(clusters),'scopes',sum(len(v['rooms']) for v in clusters.values()),'rooms')
