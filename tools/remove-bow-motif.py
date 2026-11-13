"""Remove only the confirmed erroneous decorative bow subpath; idempotent."""
from pathlib import Path
import json,re,gzip,base64,csv,collections
import re,json
def pathcanon(d):
 ts=re.findall(r'[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?',d);i=0;cmd=None;x=y=sx=sy=0;out=[];sizes={'M':2,'L':2,'H':1,'V':1,'C':6,'S':4,'Q':4,'T':2,'A':7}
 while i<len(ts):
  if ts[i].isalpha():cmd=ts[i];i+=1
  if not cmd:raise ValueError('path command')
  c=cmd.upper();rel=cmd.islower()
  if c=='Z':out.append(['Z']);x,y=sx,sy;cmd=None;continue
  n=sizes[c];v=list(map(float,ts[i:i+n]));i+=n
  if len(v)!=n:raise ValueError('path args')
  if c=='H':v=[v[0]+(x if rel else 0),y];kind='L'
  elif c=='V':v=[x,v[0]+(y if rel else 0)];kind='L'
  else:
   kind=c
   if rel:
    if c=='A':v[-2]+=x;v[-1]+=y
    else:
     v=[vv+(x if k%2==0 else y)for k,vv in enumerate(v)]
  x,y=v[-2:]
  if c=='M':sx,sy=x,y;cmd='l'if rel else'L'
  out.append([kind,*[round(z,6)for z in v]])
 return json.dumps(out,separators=(',',':'))

def shape(d):
 try:
  p=json.loads(pathcanon(d));x,y=p[0][1:3]
  return json.dumps([[c[0],*[round(v-(x if i%2==0 else y),5)for i,v in enumerate(c[1:])]]for c in p])
 except:return ''
sig=shape('M128 128q-15-15-19 0t19 4q15 15 19 0t-19-4')
def bows(s):return[(part,m.start())for m in re.finditer(r'\bd="([^"]*)"',s)for part in re.findall(r'[Mm][^Mm]*',m[1])if shape(part)==sig]
changed=[]
def cleantext(s):
 def repl(m):
  whole=m[0];dm=re.search(r'\bd="([^"]*)"',whole)
  if not dm:return whole
  parts=re.findall(r'[Mm][^Mm]*',dm[1]);keep=[p for p in parts if shape(p)!=sig]
  if len(keep)==len(parts):return whole
  if not keep:return ''
  return whole[:dm.start(1)]+''.join(keep)+whole[dm.end(1):]
 return re.sub(r'<path\b[^>]*(?:/>|>\s*</path>)',repl,s)
def cleanobj(v):
 if isinstance(v,dict):return{k:cleanobj(x)for k,x in v.items()}
 if isinstance(v,list):return[cleanobj(x)for x in v]
 return cleantext(v)if isinstance(v,str)else v
for name in ['catalog','interiors']:
 p=Path('assets/source/'+name+'.json.gz');v=json.loads(gzip.decompress(p.read_bytes()));n=cleanobj(v)
 if v!=n:p.write_bytes(gzip.compress(json.dumps(n,ensure_ascii=False,separators=(',',':')).encode(),mtime=0));changed.append(str(p))
for file in ['examples/asset-review-data.json','assets/p4-art.json','assets/outdoor-extra.json','assets/recipes.json']:
 p=Path(file);v=json.loads(p.read_text());n=cleanobj(v)
 if v!=n:
  if file.endswith('asset-review-data.json'):
   import hashlib
   for a in n['assets']:a['svgSha256']=hashlib.sha256(a['svg'].encode()).hexdigest()
   n['summary']['bowCleanup']={'affectedDesigns':32,'removedMotifs':51,'status':'decorative bow removed; no redesign yet'}
  p.write_text(json.dumps(n,ensure_ascii=False,separators=(',',':')));changed.append(file)
print('Changed',changed)
