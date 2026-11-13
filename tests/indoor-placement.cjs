const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const{api}=require('../tools/corridor-source.cjs').corridorSource();
const ctx={structuredClone,CORRIDORS:{templates:api.templates,defaults:api.defaults,build:api.build,draw:api.draw},CATALOG:JSON.parse(fs.readFileSync('assets/catalog.json')),RECIPES:JSON.parse(fs.readFileSync('assets/recipes.json')),P4_ART:JSON.parse(fs.readFileSync('assets/p4-art.json')),VOCAB:JSON.parse(fs.readFileSync('assets/vocabulary.json')),KEYS:['unknown']};
vm.createContext(ctx);vm.runInContext(['contract','props','draw','build'].map(n=>fs.readFileSync('src/'+n+'.js','utf8')).join('\n')+';styleIndoor=s=>s;globalThis.api={normalize,composeRoom,indoorMap,generatedActorPoint,placeExtraProps};',ctx);
let checks=0;
for(const preset of api.templates){
 const d=ctx.api.normalize({schemaVersion:'2.0.0',layoutType:preset.id,meta:{},places:[{name:'Office',type:'office',props:[{name:'Unknown RP object',count:3}]},{name:'Store',type:'storage',propsMode:'replace',props:[]}],actors:[],events:[],pcPlace:'Office',pcSpot:'inside'});
 for(const p of d.places)p.inventory=ctx.api.composeRoom(p);
 const map=ctx.api.indoorMap({places:d.places},d),office=d.places[0];
 assert.equal(map.geometry.cfg.height,40);assert.equal(d.places[1].inventory.objects.length,0);
 const actor=ctx.api.generatedActorPoint(map,office,'inside',{zone:'wall_north'});
 assert.ok(actor);if(!actor.anchorOnly)for(const f of map.footprints.filter(f=>f.placeId===office.id&&f.blocksActor)){const[x,y,w,h]=f.bounds;assert.ok(!(actor.x>x-6&&actor.x<x+w+6&&actor.y>y-6&&actor.y<y+h+6));}
 const seated=ctx.api.generatedActorPoint(map,office,'inside',{posture:'sitting'});assert.ok(seated.noFeet);
 const support=map.footprints.find(f=>f.placeId===office.id&&f.blocksActor);
 if(support){const p=ctx.api.generatedActorPoint(map,office,'inside',{placement:'on_furniture',supportId:support.id});assert.equal(p.noFeet,true);}
 const names=map.svg.match(/Unknown RP object/g)||[];assert.ok(names.length>=1);checks++;
}
const base=ctx.api.composeRoom({type:'office',propsMode:'replace',props:[{name:'New object',count:4,op:'add'}]});assert.equal(base.objects[0].count,4);
const parent={id:'table-1',name:'Table',item:'table',bounds:[50,50,100,80],surface:{x:0,y:0,width:100,height:80}};
const place={inventory:{diagnostics:[]}};
const surface=ctx.api.placeExtraProps(place,'s-',{x:0,y:0,w:240,h:200},[{id:'book',name:'Book',mount:'surface',parentId:'table-1',count:2}],null,[parent]);
assert.equal(surface.footprints.length,2);assert.equal(surface.footprints[0].blocksActor,false);
const crowded=ctx.api.placeExtraProps(place,'c-',{x:0,y:0,w:20,h:20},[{id:'rp',name:'Required item',count:7}],null,[]);
assert.ok(crowded.svg.includes('Required item'));assert.ok(crowded.svg.includes('× 7'));
const instance=ctx.RECIPES.OFFICE.instances[0];
const removed=ctx.api.composeRoom({type:'office',props:[{id:instance.id,name:instance.name,state:'removed',count:1}]});
assert.ok(!removed.objects.some(p=>p.id===instance.id));
console.log(JSON.stringify({presets:checks,checks:'H40, replace empty, actor avoids large furniture, sitting, explicit support, unknown RP retained',browser:'separate'}));
