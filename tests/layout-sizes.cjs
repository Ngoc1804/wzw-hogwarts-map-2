const fs=require('fs'),http=require('http'),path=require('path'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 fs.mkdirSync('work',{recursive:true});
 const server=http.createServer((q,r)=>{if(q.url.split('?')[0]==='/__runtime_fixture__'){r.setHeader('Content-Type','text/html');r.end(require('./runtime-fixture.cjs')());return;}const file=path.resolve('.'+decodeURIComponent(q.url.split('?')[0]));if(!file.startsWith(process.cwd()+path.sep)){r.writeHead(403).end();return}try{const ext=path.extname(file);r.setHeader('Content-Type',ext==='.html'?'text/html; charset=utf-8':ext==='.js'?'text/javascript':ext==='.css'?'text/css':'application/json');r.end(fs.readFileSync(file))}catch{r.writeHead(404).end()}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:'+server.address().port+'/__runtime_fixture__');
  await page.waitForFunction(()=>document.querySelector('#wzw-map').dataset.status==='ready');
  const recipes=JSON.parse(fs.readFileSync('assets/recipes.json'));
  const report=await page.evaluate(async recipes=>{
   const rows=[],check=(value,label)=>{if(!value)throw Error(label)};
   const payload=(type,size)=>({schemaVersion:'2.0.0',meta:{},atlasAnchor:'custom',pcPlace:'room',pcSpot:'inside',places:[{id:'room',name:'Room',type,size}],actors:[{name:'PC',isPC:true}],events:[]});
   for(const [id,recipe]of Object.entries(recipes).filter(([id])=>!id.startsWith('OUT_'))){
    for(const size of ['S','M','L']){
     await WZWMap.render(payload(id,size));
     check(document.querySelector('#wzw-map').dataset.status==='ready',id+' '+size+' ready');
     const room=WZW_SCENE.exact('room'),geometry=room.geometry.room,expected=recipe.sizeProfiles[size];
     check(Math.abs(geometry.w-expected.width)<.01&&Math.abs(geometry.h-expected.height)<.01,id+' '+size+' exact reviewed dimensions');
     check(WZW_SCENE.rendered.geometry.cfg.height===40,id+' H40');
     const expectedInstances=recipe.instancesBySize?.[size]||recipe.instances;const rendered=[...document.querySelectorAll('[data-instance]')].map(n=>n.dataset.instance);
     check(expectedInstances.every(i=>rendered.includes(i.id)),id+' '+size+' all instances');
     check(rendered.length===expectedInstances.length,id+' '+size+' no extra instances');
     check([...document.querySelectorAll('[data-footprint]')].every(n=>n.dataset.footprint.split(' ').map(Number).every(Number.isFinite)),id+' finite bounds');
     check(!!document.querySelector('[data-approved-shell="'+id+'"][data-layout-size="'+size+'"]'),id+' '+size+' approved floor/wall shell retained');
     rows.push({id,size,width:geometry.w,height:geometry.h,instances:rendered.length});
    }
   }
   for(const [alias,size]of [['small','S'],['medium','M'],['large','L'],[undefined,'M']]){
    await WZWMap.render(payload('OFFICE',alias));check(WZW_SCENE.exact('room').bounds[2]===recipes.OFFICE.sizeProfiles[size].width,'alias '+alias);
   }
   for(const size of ['S','L']){
    const data=payload('POTIONS_LAB',size),target=recipes.POTIONS_LAB.instancesBySize[size][0];data.places[0].props=[{id:target.id,name:target.name,state:'removed'}];
    await WZWMap.render(data);check(!document.querySelector('[data-instance="'+target.id+'"]'),'remove exact instance '+size);
   }
   const fixed={...payload('OFFICE','S'),atlasAnchor:'hall',pcPlace:'gf-staff'};await WZWMap.render(fixed);const before=document.querySelector('#mapmount>svg').outerHTML;
   fixed.places[0].size='L';await WZWMap.render(fixed);check(document.querySelector('#mapmount>svg').outerHTML===before,'Fixed unchanged across sizes');
   return{rows,aliases:true,exactInstanceRemoval:true,fixedUnchanged:true};
  },recipes);
  assert.deepEqual(errors,[]);fs.writeFileSync('work/layout-sizes-qa.json',JSON.stringify({...report,errors,targetPreview:'NOT RUN'},null,2));console.log('PASS',report.rows.length,'indoor runtime renders; aliases, instance removal, Fixed unchanged; no page errors.');
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
})().catch(error=>{console.error(error);process.exit(1)});
