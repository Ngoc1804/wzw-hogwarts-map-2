// P1 runtime transport and invalid payload smoke without stale JS globals between page loads.
const {chromium}=require('playwright'),fs=require('fs'),assert=require('assert'),fixture=require('./runtime-fixture.cjs');
(async()=>{fs.mkdirSync('work',{recursive:true});const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});try{
for(const [i,input] of [undefined,null,{schemaVersion:'9.0.0',atlasAnchor:'hall',pcPlace:'gf-staff',actors:[{name:'PC',isPC:true}],places:[],events:[]},{}].entries()){
 const p=await b.newPage({viewport:{width:1280,height:900}}),errors=[];
 p.on('pageerror',e=>errors.push(e.message));
 await p.setContent(input===undefined?fixture():fixture(input));
 await p.waitForFunction(()=>['ready','invalid-data','incomplete','text-fallback'].includes(document.querySelector('#wzw-map')?.dataset.status),{timeout:60000});
 const status=await p.locator('#wzw-map').getAttribute('data-status');
 if(i===0){assert.equal(status,'ready');assert(await p.evaluate(()=>Boolean(window.WZW_SCENE?.places?.length)));
 await p.screenshot({path:'work/p1-desktop.png'});await p.setViewportSize({width:390,height:844});await p.screenshot({path:'work/p1-mobile.png'});
 }else assert.notEqual(status,'ready','invalid input must not render');
 assert.deepStrictEqual(errors,[]);await p.close();
}
console.log('PASS P1 valid boot, mobile, invalid-data diagnostics');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
