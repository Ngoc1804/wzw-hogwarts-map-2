// P1 transport and runtime smoke test from in-memory HTML, no retired examples.
const {chromium}=require('playwright'),fs=require('fs'),assert=require('assert'),fixture=require('./runtime-fixture.cjs');
(async()=>{fs.mkdirSync('work',{recursive:true});const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const p=await b.newPage({viewport:{width:1280,height:900}});let errors=[];p.on('pageerror',e=>errors.push(e.message));try{
 await p.setContent(fixture());await p.waitForFunction(()=>document.querySelector('#wzw-map')?.dataset.status==='ready');assert(await p.locator('#mapmount svg').count()===1);await p.screenshot({path:'work/p1-desktop.png'});
 await p.setViewportSize({width:390,height:844});await p.screenshot({path:'work/p1-mobile.png'});
 for(const invalid of [null,{schemaVersion:'9.0.0',atlasAnchor:'hall',pcPlace:'gf-staff',actors:[{name:'PC',isPC:true}],places:[],events:[]},{}]){await p.setContent(fixture(invalid));await p.waitForFunction(()=>['invalid-data','incomplete','text-fallback'].includes(document.querySelector('#wzw-map')?.dataset.status));}
 assert.deepStrictEqual(errors,[]);console.log('PASS P1 runtime, mobile and invalid-data safety');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1)});
