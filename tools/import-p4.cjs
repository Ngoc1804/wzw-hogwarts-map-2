// Compile supplied artwork/bounds once; reference viewers are never loaded at runtime.
const {chromium}=require('playwright'),fs=require('fs'),zlib=require('zlib'),http=require('http');
(async()=>{
 const source=fs.readFileSync('assets/intake/final-2026-11-14/WIZAMAP_LAYOUTS_FINAL.html','utf8');
 const payload=source.match(/<script[^>]*id="pack"[^>]*>([\s\S]*?)<\/script>/)[1];
 const pack=JSON.parse(zlib.gunzipSync(Buffer.from(payload,'base64')));
 const html='<!doctype html><meta charset="utf-8"><style>'+pack.css+'</style>'+pack.body+'<script>window.WIZAMAP_DATA='+JSON.stringify(pack.data).replace(/</g,'\\u003c')+';</script><script>'+pack.code+'</script>';
 const server=http.createServer((q,r)=>{r.setHeader('Content-Type','text/html;charset=utf-8');r.end(html)});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const p=await b.newPage();
 await p.goto('http://127.0.0.1:'+server.address().port);await p.waitForFunction(()=>window.WIZAMAP_PACK);
 const result=await p.evaluate(()=>{
  const out={},recipes={},catalog={...WIZAMAP_PACK.assets};
  for(const room of WIZAMAP_PACK.rooms){
   const id=room.id;
   document.querySelectorAll('svg').forEach(n=>n.remove());
   const raw=WIZAMAP_PACK.renderRoom(id);let mount=document.getElementById('compile-mount');if(!mount){mount=document.createElement('div');mount.id='compile-mount';document.body.append(mount)}mount.innerHTML=raw.svg;
   const root=document.querySelector('#compile-mount svg');
   const objects=[...root.querySelectorAll(id.startsWith('OUT_')?'[data-element-id]':'[data-object]')].map((node,i)=>({node,id:id+':final:'+(i+1)})).filter(x=>!x.node.closest('defs,symbol')&&!x.node.parentElement.closest('[data-object]'));
   const definitions=new Map([...root.children].filter(x=>x.localName==='defs').flatMap(x=>[...x.children]).filter(x=>x.id).map(x=>[x.id,x]));
   const required=new Set(['atelier-floor']),queue=objects.map(x=>x.node.outerHTML);
   while(queue.length){const markup=queue.pop();for(const m of markup.matchAll(/(?:url\(#|href=["']#)([^)"' ]+)/g))if(!required.has(m[1])){required.add(m[1]);if(definitions.has(m[1]))queue.push(definitions.get(m[1]).outerHTML);}}
   const defs='<defs>'+[...required].filter(id=>definitions.has(id)).map(id=>definitions.get(id).outerHTML).join('')+'</defs>';
   out[id]={source:'FINAL',width:raw.report.width,height:raw.report.height,defs,objects:objects.map(({id,node})=>{
    const parent=root.getCTM().inverse().multiply(node.parentElement.getCTM());
    // Wall projection belongs to architecture. Retain the upright orientation of
    // wall-mounted art but remove its wall shear before compiling local geometry.
    if(Math.abs(parent.b)<.001&&parent.d<0)parent.c=0;
    const matrix=`matrix(${parent.a} ${parent.b} ${parent.c} ${parent.d} ${parent.e} ${parent.f})`;
    const measuring=document.createElementNS('http://www.w3.org/2000/svg','g');
    measuring.innerHTML='<g transform="'+matrix+'">'+node.outerHTML+'</g>';root.append(measuring);
    const box=measuring.getBBox(),svg=measuring.innerHTML;measuring.remove();
    return {id,item:node.dataset.elementId,name:node.dataset.object||catalog[node.dataset.elementId]?.name||node.dataset.elementId,bounds:[box.x,box.y,box.width,box.height],svg};
   })};
   if(id.startsWith('OUT_')){out[id].sceneSvg=raw.svg;for(const o of out[id].objects)if(!catalog[o.item])catalog[o.item]={id:o.item,name:o.name,view:'top',svg:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${o.bounds.join(' ')}">${defs}${o.svg}</svg>`};}
   recipes[id]={...room,instances:out[id].objects.map(o=>({id:o.id,item:o.item,name:o.name,count:1}))};
  }return {art:out,recipes,catalog};
 });
 fs.writeFileSync('assets/p4-art.json',JSON.stringify(result.art));fs.writeFileSync('assets/recipes.json',JSON.stringify(result.recipes));
 const assetsHTML=fs.readFileSync('assets/intake/final-2026-11-14/WIZAMAP_ASSETS_FINAL.html','utf8');const ap=assetsHTML.match(/<script[^>]*id="asset-pack"[^>]*>([\s\S]*?)<\/script>/)[1];const supplied=JSON.parse(zlib.gunzipSync(Buffer.from(ap,'base64'))).assets;
 const catalog=Object.fromEntries(supplied.map(a=>[a.id,a]));for(const [id,a]of Object.entries(result.catalog))catalog[id]={...catalog[id],...a};
 const measured=await p.evaluate(catalog=>{document.querySelectorAll('svg').forEach(n=>n.remove());const host=document.createElement('div');document.body.append(host);const out={};for(const [id,a]of Object.entries(catalog)){host.innerHTML=a.svg;const svg=host.querySelector('svg');const b=svg.getBBox();out[id]={x:b.x,y:b.y,width:b.width,height:b.height};}host.remove();return out;},catalog);
 for(const [id,bounds]of Object.entries(measured))if(bounds.width>0&&bounds.height>0)catalog[id].occupancy={...bounds,type:'geometry-bbox',collisionReady:false};
 fs.writeFileSync('assets/catalog.json',JSON.stringify(catalog));console.log('FINAL recipes',Object.keys(result.recipes).length,'catalog',Object.keys(catalog).length,'objects',Object.values(result.art).reduce((n,a)=>n+a.objects.length,0));
 await b.close();await new Promise(r=>server.close(r));
})().catch(e=>{console.error(e);process.exit(1)});
