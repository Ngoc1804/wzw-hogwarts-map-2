"""Compile the human Atlas master tables into one runtime index. No network or viewers."""
from pathlib import Path
import json,re,unicodedata
ROOT=Path(__file__).resolve().parents[1]
SOURCE='docs/WZW_MAP2_ATLAS_GITHUB_MASTER.md'
s=(ROOT/SOURCE).read_text()
def cells(line):return [c.strip() for c in line.strip().strip('|').split('|')]
def ident(cell):
 m=re.fullmatch(r'`([^`]+)`',cell);return m[1] if m else None
def slug(v):
 v=unicodedata.normalize('NFKD',v).encode('ascii','ignore').decode().lower()
 return re.sub(r'[^a-z0-9]+','-',v).strip('-')
fixed={};clusters={}
# Fixed sections own exactly their anchor table.
for m in re.finditer(r'^### 2\.\d+\. `([^`]+)`[^\n]*\n(.*?)(?=^### |^## |\Z)',s,re.M|re.S):
 places=[]
 for line in m[2].splitlines():
  if not line.startswith('| `'):continue
  c=cells(line);pid=ident(c[0])
  if pid:places.append({'id':pid,'name':c[1]})
 fixed[m[1]]={'places':places}
# Explicit cluster metadata + table; prose never drives IDs/pointers.
for m in re.finditer(r'<!-- atlas-cluster (.*?) -->(.*?)(?=^#{2,4} |\Z)',s,re.M|re.S):
 c=json.loads(m[1]);c['name']=c['id'];c['rooms']=[]
 for line in m[2].splitlines():
  if not line.startswith('| `'):continue
  row=cells(line);pid=ident(row[0])
  if not pid:continue
  name=row[1];level=re.search(r' \[([^\]]+)\]$',name)
  recipe=re.search(r'`([^`]+)`',row[2])
  c['rooms'].append({'id':pid,'name':re.sub(r' \[[^\]]+\]$','',name),'owner':c['id'],'level':level[1] if level else '', 'type':recipe[1] if recipe else None})
 clusters[c['id']]=c
# World region summaries and focus-building room tables share this same source.
world=s.split('## 5.',1)[1].split('## 6.',1)[0]
for scope,body in re.findall(r'^### 5\.[123]\. `([^`]+)`[^\n]*\n(.*?)(?=^### |\Z)',world,re.M|re.S):
 sites=[]
 for line in body.splitlines():
  if not line.startswith('| **'):continue
  row=cells(line);name=row[0].strip('*');base=name.split(' · ')[0]
  site=next((x for x in sites if x['name']==base),None)
  if not site:
   site={'id':scope+':'+slug(base),'name':base,'aliases':[base], 'rooms':[], 'components':[]};sites.append(site)
  site['components'].append({'name':name,'source':row[1],'recipes':re.findall(r'`([^`]+)`',row[3])})
 clusters[scope]={'id':scope,'name':scope,'layout':'horizontal','rooms':[],'pointers':[],'rpScope':True,'sites':sites}
# Source grouped lists expand to distinct houses, never one combined building.
expansion=json.loads(re.search(r'<!-- atlas-world-expansion (.*?) -->',s).group(1))
for region in clusters.values():
 if not region.get('sites'):continue
 expanded=[]
 for site in region['sites']:
  if site['name'] not in expansion:expanded.append(site);continue
  for name in expansion[site['name']]:
   expanded.append({**site,'id':region['id']+':'+slug(name),'name':name,'aliases':[name]})
 region['sites']=expanded
# Focus buildings are explicitly scoped; generated room IDs are internal, never new atlasAnchor values.
regions=json.loads(re.search(r'<!-- atlas-regions (.*?) -->',s).group(1))
extra_aliases=json.loads(re.search(r'<!-- atlas-extra-aliases (.*?) -->',s).group(1))
for m in re.finditer(r'^#### ([^\n]+) — thành phần phòng/không gian\n(.*?)(?=^#### |^## |\Z)',world,re.M|re.S):
 name=m[1];scope=regions[name];pool=clusters[scope]['sites']
 aliases=[name,*extra_aliases.get(name,[])]
 site=next((x for x in pool if x['name'] in aliases or any(x['name'].startswith(a+' ·')for a in aliases)),None)
 if not site:site={'id':scope+':'+slug(name),'name':name,'aliases':[],'rooms':[],'components':[]};pool.append(site)
 site['aliases']=list(dict.fromkeys([*site['aliases'],*aliases]));site['rooms']=[]
 for line in m[2].splitlines():
  if not line.startswith('| ')or line.startswith('| Phạm')or line.startswith('|---'):continue
  row=cells(line)
  if len(row)!=4:continue
  recipe=re.search(r'`([^`]+)`',row[2]);label=row[1]
  site['rooms'].append({'id':site['id']+':'+slug(label),'name':label,'owner':site['id'],'level':row[0],'type':recipe[1] if recipe else None, 'conditional':bool(re.search(r'nếu RP|Other Bedrooms|Bedrooms$|Cells$|Family/Guest',label,re.I))})
# Known English aliases bind only verified anchors, never guessed coordinates.
anchor_aliases=json.loads(re.search(r'<!-- atlas-anchor-aliases (.*?) -->',s).group(1))
for fid,bindings in anchor_aliases.items():
 for pid,aliases in bindings.items():
  hit=next((p for p in fixed[fid]['places']if p['id']==pid),None)
  if not hit:raise ValueError('Unknown alias anchor '+pid)
  hit['aliases']=aliases
assert len(fixed)==13 and sum(len(c['rooms'])for c in clusters.values())==285
assert len(clusters)==59
ids=[p['id']for c in clusters.values()for p in c['rooms']]
assert len(ids)==len(set(ids))
known=set(clusters)|set(fixed)
assert all(p in known for c in clusters.values() for p in c['pointers'])
recipes=json.loads((ROOT/'assets/recipes.json').read_text())
assert all(not p['type']or p['type']in recipes for c in clusters.values()for p in c['rooms'])
result={'clusters':clusters,'fixed':fixed,'source':SOURCE}
(ROOT/'assets/atlas.json').write_text(json.dumps(result,ensure_ascii=False,separators=(',',':')))
print(f"{len(fixed)} Fixed / {sum(len(x['places'])for x in fixed.values())} anchors; {len(clusters)} scopes / {len(ids)} cluster rooms; {sum(len(c.get('sites',[]))for c in clusters.values())} World sites / {sum(len(x['rooms'])for c in clusters.values()for x in c.get('sites',[]))} World focus rooms")
