const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),assert=require('assert'),crypto=require('crypto');
(async()=>{fs.mkdirSync('work',{recursive:true});const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});let checks=[],errors=[],network=[];try{
 const manifest=JSON.parse(fs.readFileSync('docs/CLEANUP_MANIFEST.json')),catalog=JSON.parse(fs.readFileSync('assets/catalog.json'));
 assert.equal(Object.keys(catalog).length,443);for(const[id,a]of Object.entries(catalog))assert.equal(crypto.createHash('sha256').update(a.svg).digest('hex'),manifest.assetSvgHashesBefore[id],id+' artwork changed');checks.push('443 IDs and all approved SVG bytes unchanged');
 for(const f of manifest.removed)assert(!fs.existsSync(f.path),'Deleted path returned: '+f.path);
 for(const name of ['ASSETS','FIXED_UI','LAYOUTS_H40_SML','RUNTIME_CHECK','MECHANISMS_CHECK']){
  const p=await b.newPage({viewport:{width:1280,height:900}});p.on('pageerror',e=>errors.push(name+': '+e.message));p.on('request',r=>{if(/^https?:/.test(r.url()))network.push(r.url())});
  await p.setContent(fs.readFileSync('examples/WIZAMAP_'+name+'.html','utf8'));
  if(['ASSETS','RUNTIME_CHECK','MECHANISMS_CHECK'].includes(name))await p.waitForFunction(()=>document.documentElement.dataset.offlineReady==='true');
  if(name==='ASSETS'){
   assert.equal(await p.evaluate(()=>DATA.assets.length),443);assert.equal(await p.evaluate(()=>DATA.assets.filter(a=>a.svgRef).length),3);
   await p.locator('[data-id="seat.dining"]').click();assert(await p.locator('#paint-swatches input').count()>0);await p.locator('#close').click();
  }else if(name==='FIXED_UI'){
   await p.waitForFunction(()=>window.WZWTemplateUI?.state);assert.equal(await p.evaluate(()=>Object.keys(DATA.maps).length),13);
  }else if(name==='LAYOUTS_H40_SML'){
   await p.waitForFunction(()=>window.WIZAMAP_REVIEW);
   const result=await p.evaluate(()=>{let n=0;for(const room of WIZAMAP_PACK.rooms)for(const size of ['S','M','L']){const s=WIZAMAP_REVIEW.render(room.id,size).svg;if(new DOMParser().parseFromString(s,'image/svg+xml').querySelector('parsererror'))throw Error(room.id+size);n++;}return n});assert.equal(result,147);checks.push('49 layouts × S/M/L parse and render');
  }else{
   await p.waitForFunction(()=>window.WZWMap&&window.WZWTemplateUI?.state&&document.querySelector('.viewport svg'));
   if(name==='MECHANISMS_CHECK'){
    for(const id of ['demo-state','demo-count','demo-visual','demo-xray','demo-clear']){await p.locator('#'+id).click();await p.waitForFunction(()=>![...document.querySelectorAll('section button')].some(b=>b.disabled));const result=await p.locator('#demo-result').innerText();assert(!/FAIL|Lỗi kiểm/.test(result),result);checks.push(id+': '+result);}
   }else{await p.locator('#review-controls summary').click();await p.selectOption('#review-scene','outdoor-yard');await p.waitForFunction(()=>!document.querySelector('#review-scene').disabled);checks.push('runtime switches Indoor → Outdoor');}
  }
  await p.screenshot({path:'work/cleanup-'+name+'.png'});await p.setViewportSize({width:390,height:844});
  if(name==='ASSETS')assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await p.screenshot({path:'work/cleanup-'+name+'-mobile.png'});checks.push(name+' opens from HTML content without external requests, desktop + mobile');await p.close();
 }
 assert.deepEqual(errors,[]);assert.deepEqual(network,[]);const report={baseline:manifest.baseline,checks,errors,network,targetPreview:'NOT RUN',fileProtocol:'NOT RUN: managed Chromium blocks file:// with ERR_BLOCKED_BY_ADMINISTRATOR; HTML content loaded with setContent, zero HTTP requests',scope:'File cleanup; no decor/recolor/shop naming changes. Browser checks are not full runtime acceptance.'};fs.writeFileSync('docs/CLEANUP_QA.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 }finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
