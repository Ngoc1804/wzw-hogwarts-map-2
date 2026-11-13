import json,csv,xml.etree.ElementTree as E
from pathlib import Path
rows=[]
for id,a in json.load(open('assets/catalog.json')).items():
 try:
  root=E.fromstring(a['svg']);shapes=[n for n in root.iter() if n.tag.split('}')[-1] in ['path','rect','circle','ellipse','polygon','polyline','line']]
  missing=sum(n.get('fill') is None and n.get('style','').find('fill:')<0 for n in shapes)
  black=sum(n.get('fill','').lower() in ['black','#000','#000000'] for n in shapes)
  none=sum(n.get('fill')=='none' for n in shapes)
  status='REVIEW_INHERITANCE' if missing else 'REVIEW_BLACK' if black else 'EXPLICIT_PAINT'
  rows.append([id,a.get('name',id),status,len(shapes),missing,black,none,len(a.get('colorSlots',[]))])
 except Exception as e:rows.append([id,a.get('name',id),'PARSE_ERROR',0,0,0,0,0])
with open('docs/ASSET_COLOR_AUDIT.csv','w') as f:
 w=csv.writer(f);w.writerow(['id','name','status','shapes','fill_unspecified','explicit_black','fill_none','color_slots']);w.writerows(rows)
from collections import Counter
print(dict(Counter(r[2] for r in rows)))
