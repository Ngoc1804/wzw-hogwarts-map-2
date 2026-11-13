// Focused integration checks for the completed approved-frame change, not a browser acceptance.
const assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm');
const{corridorSource}=require('../tools/corridor-source.cjs');
const{api}=corridorSource();
const CORRIDORS={templates:api.templates,defaults:api.defaults,build:api.build,draw:api.draw,decorate:key=>api.decor[key]?.draw||'',patterns:api.patterns,opening:api.opening,yard:api.yard,materials:api.materials};
const context={RECIPES:{},CORRIDORS,structuredClone,recipeId:()=>null,furnitureLayout:()=>({width:100,height:80}),drawFurniture:()=>({svg:'',footprints:[]}),escapeXML:s=>s,composeRoom:()=>({objects:[]}),SCENERY:{},key:s=>s};
vm.createContext(context);
vm.runInContext(fs.readFileSync('src/draw.js','utf8')+fs.readFileSync('src/build.js','utf8')+';styleIndoor=s=>s;furnitureLayout=()=>({width:100,height:80});drawFurniture=()=>({svg:"",footprints:[]});globalThis.indoor=indoorMap;globalThis.asset=corridorAssetMarkup;',context);
assert.equal(api.defaults.height,40);
let scenes=0;
for(const preset of api.templates)for(const count of [1,4,12,20]){
 const scene={places:Array.from({length:count},(_,i)=>({id:'r'+i,name:'Room '+i,type:'office',inventory:{objects:[]}}))};
 const actual=context.indoor(scene,{layoutType:preset.id,meta:{areaName:'Integration'}});
 assert.equal(actual.geometry.cfg.height,40,preset.id);
 assert.equal(actual.geometry.rooms.length,count,preset.id);
 if(count>1){
  const cfg=JSON.parse(JSON.stringify(api.defaults));Object.assign(cfg,{type:preset.id,count,height:40,seed:0,selected:null,decor:true,overrides:{}});
  const expected=api.build(cfg);
  const coords=plan=>JSON.stringify(plan.rooms.map(r=>[r.index,r.x,r.y,r.w,r.h,r.cells||null]));
  assert.equal(coords(actual.geometry),coords(expected),preset.id+' must retain source room/gap formulas');
  assert.equal(JSON.stringify(actual.geometry.passages),JSON.stringify(expected.passages),preset.id+' passages');
 }
 assert.ok(actual.svg.includes('tường cao 40'));
 scenes++;
}
const catalog=JSON.parse(fs.readFileSync('assets/catalog.json','utf8'));
const elements=Object.values(catalog).filter(a=>a.corridorSource);
assert.equal(elements.length,48);
for(const asset of elements)assert.equal(context.asset(asset),asset.svg,'runtime source reference must reproduce '+asset.id);
const bundle=fs.readFileSync('dist/bundle.js','utf8');
assert.ok(!bundle.includes('"id":"corridor.decor.portrait","name":"Tranh chân dung","category":"Hành lang · Decor","view":"front","viewBox":[-3,-3,32,36],"svg":'),'no duplicate embedded corridor SVG');
console.log(JSON.stringify({frameScenes:scenes,sourceAssetReferences:elements.length,wallHeight:40,browser:'NOT RUN',visualApproval:'source approved by user; no new style approval claimed'}));
