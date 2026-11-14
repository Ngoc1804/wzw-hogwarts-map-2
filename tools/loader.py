"""One loader shape for local example and SHA-pinned Gemini instructions."""
import json

def loader(base, payload):
 data=json.dumps(payload,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c') if not isinstance(payload,str) else payload
 return '''<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="data:,"><title>WIZAMAP</title><link rel="stylesheet" href="'''+base+'''shell.css" onerror="window.WZW_LOAD_FAILED=true;document.getElementById('wzw-map')?.setAttribute('data-status','load-error')"><div id="wzw-map"><p role="status">Đang mở bản đồ…</p></div><script type="application/json" id="map-data">'''+data+'''</script><script>window.WZW_START=performance.now();window.wzwLoadError=function(){window.WZW_LOAD_FAILED=true;const r=document.getElementById('wzw-map');r.replaceChildren();let d={};try{d=JSON.parse(document.getElementById('map-data').textContent)||{}}catch{}for(const v of [d.meta?.areaName,...[d.places,d.actors,d.events].flatMap(a=>Array.isArray(a)?a.map(x=>[x?.name||x?.title,x?.description||x?.activity||x?.detail].filter(Boolean).join(' — ')):[])])if(v){const p=document.createElement('p');p.textContent=v;r.append(p)}if(!r.childNodes.length)r.textContent='Bản đồ RP';r.dataset.status='text-fallback'};</script><script src="'''+base+'''templates-pack.js" onerror="wzwLoadError()"></script><script src="'''+base+'''bundle.js" onerror="wzwLoadError()"></script></html>'''

if __name__=='__main__':
 from pathlib import Path
 root=Path(__file__).resolve().parents[1]
 data={'schemaVersion':'2.0.0','meta':{'date':'','time':'','areaName':'Đại Sảnh','quote':''},'atlasAnchor':'hall','pcPlace':'gf-staff','pcSpot':'inside','places':[],'actors':[{'name':'PC','isPC':True,'placeId':'gf-staff','spot':'inside'}],'events':[]}
 (root/'examples/minimal.html').write_text(loader('../dist/',data))
 release=root/'assets/runtime-release.json'
 if release.exists():
  config=json.loads(release.read_text());commit=config['runtimeCommit']
  import re
  if not re.fullmatch('[a-f0-9]{40}',commit):raise ValueError('runtimeCommit must be a published full SHA')
  base='https://cdn.jsdelivr.net/gh/'+config['repository']+'@'+commit+'/dist/'
  (root/'examples/loader-cdn.html').write_text(loader(base,data))
