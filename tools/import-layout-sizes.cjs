// Compile the reviewed sizes once. The reference editor never runs in RP.
const fs=require('fs'),http=require('http'),{chromium}=require('playwright');
(async()=>{
 const server=http.createServer((q,r)=>{r.setHeader('Content-Type','text/html; charset=utf-8');r.end(fs.readFileSync('examples/WIZAMAP_LAYOUTS.html'))});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  const page=await browser.newPage();
  await page.goto('http://127.0.0.1:'+server.address().port);
  await page.waitForFunction(()=>window.WIZAMAP_PACK?.sizeProfiles);
  const recipes=JSON.parse(fs.readFileSync('assets/recipes.json'));
  const result=await page.evaluate(recipes=>{
   const compiled={},profiles={};
   for(const room of WIZAMAP_PACK.rooms){
    profiles[room.id]=room.sizeProfiles;
    if(room.id.startsWith('OUT_'))continue;
    compiled[room.id]={};
    for(const size of ['S','M','L']){
     const raw=WIZAMAP_REVIEW.render(room.id,size);
     let mount=document.getElementById('compile-mount');if(!mount){mount=document.createElement('div');mount.id='compile-mount';document.body.append(mount)}
     mount.innerHTML=raw.svg;const root=mount.querySelector('svg');
     const nodes=[...root.querySelectorAll('[data-object]')].filter(n=>!n.closest('defs,symbol')&&!n.parentElement.closest('[data-object]')&&n.dataset.elementId&&!n.dataset.elementId.startsWith('review.'));
     const expected=recipes[room.id].instances;
     if(nodes.length!==expected.length)throw Error(room.id+' '+size+': instance count '+nodes.length+' != '+expected.length);
     const definitions=new Map([...root.children].filter(n=>n.localName==='defs').flatMap(n=>[...n.children]).filter(n=>n.id).map(n=>[n.id,n]));
     const required=new Set(),queue=nodes.map(n=>n.outerHTML);
     while(queue.length)for(const m of queue.pop().matchAll(/(?:url\(#|href=["']#)([^)"' ]+)/g))if(!required.has(m[1])){required.add(m[1]);if(definitions.has(m[1]))queue.push(definitions.get(m[1]).outerHTML)}
     const defs='<defs>'+[...required].filter(id=>definitions.has(id)).map(id=>definitions.get(id).outerHTML).join('')+'</defs>';
     const remaining=[...nodes];
     const objects=expected.map(instance=>{
      const index=remaining.findIndex(n=>n.dataset.elementId===instance.item);
      if(index<0)throw Error(room.id+' '+size+': missing instance '+instance.id);
      const node=remaining.splice(index,1)[0];
      const matrix=root.getCTM().inverse().multiply(node.parentElement.getCTM());if(Math.abs(matrix.b)<.001&&matrix.d<0)matrix.c=0;
      const g=document.createElementNS('http://www.w3.org/2000/svg','g');g.innerHTML='<g transform="matrix('+[matrix.a,matrix.b,matrix.c,matrix.d,matrix.e,matrix.f].join(' ')+')">'+node.outerHTML+'</g>';root.append(g);const box=g.getBBox(),svg=g.innerHTML;g.remove();
      return{id:instance.id,item:instance.item,name:instance.name,bounds:[box.x,box.y,box.width,box.height],svg};
     });
     compiled[room.id][size]={source:'FINAL',width:raw.report.width,height:raw.report.height,defs,objects};
    }
   }return{compiled,profiles};
  },recipes);
  for(const [id,profiles]of Object.entries(result.profiles))recipes[id].sizeProfiles=profiles;
  fs.writeFileSync('assets/layout-sizes.json',JSON.stringify(result.compiled));
  fs.writeFileSync('assets/recipes.json',JSON.stringify(recipes));
  console.log('Compiled',Object.keys(result.compiled).length,'indoor layouts × 3 sizes; existing instance IDs preserved.');
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
})().catch(error=>{console.error(error);process.exit(1)});
