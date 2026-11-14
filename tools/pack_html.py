"""Losslessly compress inline scripts, including JSON, into one offline HTML.
No CDN/network dependency. Re-running is idempotent. Sources remain readable.
"""
from pathlib import Path
import re,json,gzip,base64,html
LOADER=r'''<script id="wzw-offline-loader">
(async()=>{const nodes=[...document.querySelectorAll('script[data-wzw-packed]')];if(!nodes.length)return;try{
 const payload=document.getElementById('wzw-script-pack').textContent.trim();
 const bytes=Uint8Array.from(atob(payload),c=>c.charCodeAt(0));
 const scripts=JSON.parse(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text());
 // Restore non-executable JSON before the first consumer executes.
 for(const [i,entry]of scripts.entries()){const [attrs,code]=entry;if(attrs.type&&!['text/javascript','application/javascript','module'].includes(attrs.type)){const old=nodes[i],n=document.createElement('script');for(const [k,v]of Object.entries(attrs))n.setAttribute(k,v);n.textContent=code;old.replaceWith(n);}}
 for(const [i,entry]of scripts.entries()){const [attrs,code]=entry;if(attrs.type&&!['text/javascript','application/javascript','module'].includes(attrs.type))continue;const n=document.createElement('script');for(const [k,v]of Object.entries(attrs))n.setAttribute(k,v);n.textContent=code;nodes[i].replaceWith(n);}
 document.documentElement.dataset.offlineReady='true';
}catch(error){document.documentElement.dataset.offlineReady='error';const p=document.createElement('p');p.setAttribute('role','alert');p.style.cssText='position:fixed;inset:20px 20px auto;z-index:99999;background:#fff2d5;color:#662c22;padding:20px';p.textContent='Không mở được bản đồ: '+error.message+'. Hãy mở bằng Chrome, Edge hoặc Firefox mới.';document.body.append(p);console.error(error);}})();
</script>'''
def pack(path):
 p=Path(path);s=p.read_text()
 if 'id="wzw-script-pack"'in s:return
 entries=[]
 def replace(m):
  attrs=dict((key,html.unescape(a or b or ''))for key,a,b in re.findall(r'([\w:-]+)\s*=\s*(?:"([^"]*)"|\x27([^\x27]*)\x27)',m[1]))
  if 'src'in attrs:raise ValueError('Offline page still requests script '+attrs['src'])
  i=len(entries);entries.append([attrs,m[2]])
  return '<script type="application/x-wzw-packed" data-wzw-packed="'+str(i)+'"></script>'
 s=re.sub(r'<script\b([^>]*)>(.*?)</script\s*>',replace,s,flags=re.S|re.I)
 payload=base64.b64encode(gzip.compress(json.dumps(entries,ensure_ascii=False,separators=(',',':')).encode(),compresslevel=9,mtime=0)).decode()
 # Only a single text payload and one boot sequence; cloned editor exports contain
 # restored scripts so loader intentionally does nothing on exported HTML.
 s+='\n<script type="application/octet-stream" id="wzw-script-pack">'+payload+'</script>'+LOADER
 p.write_text(s)
 print(p.name,len(s.encode()),'bytes compressed offline')
if __name__=='__main__':
 import sys
 for path in sys.argv[1:]:pack(path)
