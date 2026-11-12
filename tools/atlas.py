"""Generate cluster index from the single human-readable Atlas source."""
from pathlib import Path
import re,json
r=Path(__file__).resolve().parents[1];text=(r/'docs/ATLAS_W4.md').read_text();clusters={};floor=None
for line in text.splitlines():
 if line.startswith('### '):
  title=line[4:];floor=next((k for k in ['SUB-DUNGEONS','DUNGEONS','KITCHENS',*['F'+str(i) for i in range(1,9)]] if title==k or title.startswith(k+' ')),None)
 m=re.match(r'- ([NESW]) (.*?) \[(\w+)\]: (.*)',line)
 if floor and m:
  direction,name,layout,items=m.groups();cid=f'{floor}-{direction}';rooms=[];pointers=[]
  for item in items.rstrip('.').split('; '):
   if item.startswith('→'):pointers.append(item[1:]);continue
   rooms.append({'id':f'{cid}:{len(rooms)+1:02}','name':item,'owner':cid})
  clusters[cid]={'id':cid,'floor':floor,'direction':direction,'name':name,'layout':layout,'rooms':rooms,'pointers':pointers}
(r/'assets/atlas.json').write_text(json.dumps({'clusters':clusters,'source':'docs/ATLAS_W4.md'},ensure_ascii=False,separators=(',',':')))
print(len(clusters),'clusters',sum(len(c['rooms']) for c in clusters.values()),'rooms')
