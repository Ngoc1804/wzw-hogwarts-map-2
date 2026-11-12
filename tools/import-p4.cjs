// Compile supplied artwork/bounds once; reference viewers are never loaded at runtime.
const {chromium}=require('playwright'),fs=require('fs'),zlib=require('zlib'),http=require('http');
(async()=>{
 const pack=JSON.parse(zlib.gunzipSync(fs.readFileSync('assets/source/interiors.json.gz')));
 const html='<!doctype html><meta charset="utf-8"><style>'+pack.css+'</style>'+pack.body+'<script>window.WIZAMAP_DATA='+JSON.stringify(pack.data).replace(/</g,'\\u003c')+';</script><script>'+pack.code+'</script>';
 const server=http.createServer((q,r)=>{r.setHeader('Content-Type','text/html;charset=utf-8');r.end(html)});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const p=await b.newPage();
 await p.goto('http://127.0.0.1:'+server.address().port);await p.waitForFunction(()=>window.WIZAMAP_PACK);
 const result=await p.evaluate(()=>{
  d.height=36;const out={};
  for(const id of ['POTIONS_LAB','OFFICE','STORAGE','CLASSROOM']){
   const raw=WIZAMAP_PACK.renderRoom(id);document.getElementById('mount').innerHTML=raw.svg;
   const root=document.querySelector('#mount svg');
   const objects=[...root.querySelectorAll('[data-object]')].map((node,i)=>({node,id:id+':'+(i+1)})).filter(x=>!x.node.closest('defs,symbol')&&!x.node.parentElement.closest('[data-object]'));
   const definitions=new Map([...root.children].filter(x=>x.localName==='defs').flatMap(x=>[...x.children]).filter(x=>x.id).map(x=>[x.id,x]));
   const required=new Set(['atelier-floor']),queue=objects.map(x=>x.node.outerHTML);
   while(queue.length){const markup=queue.pop();for(const m of markup.matchAll(/(?:url\(#|href=["']#)([^)"' ]+)/g))if(!required.has(m[1])){required.add(m[1]);if(definitions.has(m[1]))queue.push(definitions.get(m[1]).outerHTML);}}
   const defs='<defs>'+[...required].filter(id=>definitions.has(id)).map(id=>definitions.get(id).outerHTML).join('')+'</defs>';
   out[id]={width:raw.report.width,height:raw.report.height,defs,objects:objects.map(({id,node})=>{
    const parent=root.getCTM().inverse().multiply(node.parentElement.getCTM());
    // Wall projection belongs to architecture. Retain the upright orientation of
    // wall-mounted art but remove its wall shear before compiling local geometry.
    if(Math.abs(parent.b)<.001&&parent.d<0)parent.c=0;
    const matrix=`matrix(${parent.a} ${parent.b} ${parent.c} ${parent.d} ${parent.e} ${parent.f})`;
    const measuring=document.createElementNS('http://www.w3.org/2000/svg','g');
    measuring.innerHTML='<g transform="'+matrix+'">'+node.outerHTML+'</g>';root.append(measuring);
    const box=measuring.getBBox(),svg=measuring.innerHTML;measuring.remove();
    return {id,item:node.dataset.elementId,name:node.dataset.object,bounds:[box.x,box.y,box.width,box.height],svg};
   })};
  }return out;
 });
 fs.writeFileSync('assets/p4-art.json',JSON.stringify(result));console.log(Object.fromEntries(Object.entries(result).map(([k,v])=>[k,v.objects.length])));
 await b.close();await new Promise(r=>server.close(r));
})().catch(e=>{console.error(e);process.exit(1)});
