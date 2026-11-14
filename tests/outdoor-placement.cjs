const fs=require('fs'),assert=require('assert'),{chromium}=require('playwright');
(async()=>{fs.mkdirSync('work',{recursive:true});const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']}),p=await b.newPage({viewport:{width:1400,height:950}});const errors=[];p.on('pageerror',e=>errors.push(e.message));try{
 await p.setContent(require('./runtime-fixture.cjs')());await p.waitForFunction(()=>window.WZWMap&&document.querySelector('#wzw-map').dataset.status==='ready');
 const result=await p.evaluate(async()=>{
  const out=[],ok=(v,m)=>{if(!v)throw Error(m);out.push(m)};
  const input=(type,props=[],actors=[{name:'PC',isPC:true,placeId:'o',spot:'outdoor'}])=>({schemaVersion:'2.0.0',forceSandbox:true,mapMode:'outdoor',meta:{areaName:type},pcPlace:'o',pcSpot:actors[0].spot,places:[{id:'o',name:'Sân RP',type,props}],actors,events:[]});
  const point=()=>{const t=document.querySelector('.npc-tag');return{x:+t.dataset.anchorX,y:+t.dataset.anchorY}};
  for(const type of ['OUT_COURTYARD','OUT_GARDEN','OUT_LAWN','OUT_WOODLAND','OUT_WATERSIDE','OUT_BUILDING_YARD','OUT_CAMP','OUT_SERVICE_GARDEN']){
   const data=input(type,[{id:'chairs',name:'Ghế RP',item:'seat.dining',count:8,op:'add',zone:'left'}]);await WZWMap.render(data);
   const before=[...document.querySelectorAll('[data-rp-instance]')].map(n=>n.dataset.footprint),extra=WZW_SCENE.rendered.footprints.filter(f=>f.sourceId==='chairs');
   ok(extra.length===8,type+' exact count within scene');const base=WZW_SCENE.rendered.footprints.filter(f=>!f.sourceId.startsWith('chairs'));ok(extra.every(f=>!base.some(b=>f.bounds[0]<b.bounds[0]+b.bounds[2]&&f.bounds[0]+f.bounds[2]>b.bounds[0]&&f.bounds[1]<b.bounds[1]+b.bounds[3]&&f.bounds[1]+f.bounds[3]>b.bounds[1])),type+' props avoid existing objects');ok(extra.every(f=>f.bounds[0]>=30&&f.bounds[1]>=30&&f.bounds[0]+f.bounds[2]<=970&&f.bounds[1]+f.bounds[3]<=730),type+' no inventory strip');
   const a=point();ok(WZWTemplateUI.state.pointSafe(a.x,a.y,5),type+' PC ground safe');
   await WZWMap.render(data);ok(JSON.stringify(before)===JSON.stringify([...document.querySelectorAll('[data-rp-instance]')].map(n=>n.dataset.footprint)),type+' stable rerender');
  }
  await WZWMap.render(input('OUT_LAWN',[{id:'left',name:'Thùng trái',item:'object.barrel',op:'add',zone:'left'},{id:'right',name:'Thùng phải',item:'object.barrel',op:'add',zone:'right'}]));let f=WZW_SCENE.rendered.footprints;ok(f.find(x=>x.sourceId==='left').bounds[0]<f.find(x=>x.sourceId==='right').bounds[0],'props honor zones');
  await WZWMap.render(input('OUT_LAWN',[],[{name:'PC',isPC:true,placeId:'o',spot:'outdoor',zone:'right'}]));ok(point().x>600,'actor honors zone');
  await WZWMap.render(input('OUT_BUILDING_YARD'));const building=WZW_SCENE.rendered.footprints.find(f=>f.kind==='building');ok(!WZWTemplateUI.state.pointSafe(building.bounds[0]+building.bounds[2]/2,building.bounds[1]+building.bounds[3]/2,1),'building excluded without RP exception');
  await WZWMap.render(input('OUT_WATERSIDE'));ok(!WZWTemplateUI.state.pointSafe(850,300,1),'lake forbidden by default');ok(WZWTemplateUI.state.pointSafe(750,440,1),'deck is walkable over water');
  const wall=input('OUT_BUILDING_YARD',[],[{name:'PC',isPC:true,placeId:'o',spot:'outdoor',placement:'in_wall',supportId:'terrain:wall:0'}]);await WZWMap.render(wall);ok(point().y<100||point().x<100||point().x>900,'explicit wall anchor follows actual fence instead of bbox center');
  const explicit=input('OUT_WATERSIDE',[],[{name:'PC',isPC:true,placeId:'o',spot:'outdoor',placement:'on_landscape',supportId:'terrain:water:0'}]);await WZWMap.render(explicit);ok(point().x>600,'explicit water support accepted');
  const missing=input('OUT_WATERSIDE',[],[{name:'PC',isPC:true,placeId:'o',spot:'outdoor',placement:'on_landscape',supportId:'missing'}]);await WZWMap.render(missing);ok(WZW_SCENE.exact('o').inventory.diagnostics.includes('unresolved-support:missing')&&document.querySelector('.npc-tag').dataset.placement==='anchor','missing support diagnosed as informational anchor');
  await WZWMap.render(input('OUT_LAWN',[{id:'table',name:'Bàn RP',item:'table.round',op:'add',zone:'center'},{id:'cup',name:'Ly RP',visual:{shapes:[{kind:'rect',x:10,y:10,width:40,height:40}]},op:'add',mount:'surface',parentId:'table'}]));f=WZW_SCENE.rendered.footprints;ok(f.some(x=>x.sourceId==='cup'),'surface props bind to explicit table');
  await WZWMap.render(input('OUT_LAWN',[{name:'Ghế',item:'seat.dining',count:5000,op:'add'}]));ok(WZW_SCENE.exact('o').inventory.objects.some(x=>x.count===5000),'large count retained');ok(WZW_SCENE.exact('o').inventory.diagnostics.some(x=>x.startsWith('outdoor-count-summary:')),'overflow summarized instead of appended grid');
  return out;
 });
 assert.deepEqual(errors,[]);await p.screenshot({path:'work/outdoor-placement.png'});fs.writeFileSync('work/outdoor-placement-qa.json',JSON.stringify({checks:result,errors,targetPreview:'NOT RUN'},null,2));console.log('PASS Outdoor',result.length,'checks');
 }finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
