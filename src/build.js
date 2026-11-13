const rectContains=(r,x,y,pad=0)=>x-pad>=r.x&&y-pad>=r.y&&x+pad<=r.x+r.w&&y+pad<=r.y+r.h;
function generatedFloor(plan,x,y,pad=0){
 const rects=[...plan.halls,...plan.rooms.filter(r=>!r.circular).flatMap(r=>r.cells||[r])];
 const inFloor=(x,y)=>rects.some(r=>rectContains(r,x,y))||plan.rooms.some(r=>r.circular&&Math.hypot(x-r.x-r.w/2,y-r.y-r.h/2)<=r.w/2)||
  (plan.special?.type==='curve'&&x>=0&&y<=0&&(x/(plan.special.R+plan.special.V))**2+(y/(plan.special.R+plan.special.H))**2<=1&&Math.hypot(x,y)>=plan.special.R)||
  (plan.yard&&rectContains(plan.yard,x,y));
 return [[x-pad,y-pad],[x+pad,y-pad],[x-pad,y+pad],[x+pad,y+pad],[x,y]].every(([px,py])=>inFloor(px,py));
}
function placeDoor(plan,room){return plan.openings.doors.find(d=>d.room===room.id);}
function indoorMap(scene,d){
 const places=scene.places.filter(p=>recipeId(p.type)!=='PASSAGE_PROPS'),passages=scene.places.filter(p=>recipeId(p.type)==='PASSAGE_PROPS');
 if(!places.length)places.push({id:'context',name:d.meta.areaName||'Không gian RP',props:[],inventory:composeRoom({props:[]})});
 const layouts=places.map(furnitureLayout),requested=d.layoutType||scene.cluster?.layout||'horizontal';
 const type=CORRIDORS.templates.some(t=>t.id===requested)?requested:'horizontal';
 const cfg=structuredClone(CORRIDORS.defaults);Object.assign(cfg,{type,count:places.length,height:40,seed:0,selected:null,decor:true,overrides:{}});
 // Source formulas own room proportions, gaps and alcoves. RP sizing adaptation
 // may supply internal overrides in later placement work, without changing projection.
 const plan=CORRIDORS.build(cfg),single=places.length===1;
 if(single){
  plan.halls=[];plan.passages=[];plan.special=null;plan.yard=null;
  plan.walls=plan.walls.filter(w=>w.A?.id===plan.rooms[0].id||w.B?.id===plan.rooms[0].id);
  plan.openings.doors=plan.openings.doors.filter(o=>plan.walls.includes(o.ln));
  plan.openings.windows=plan.openings.windows.filter(o=>plan.walls.includes(o.ln));
  const r=plan.rooms[0];plan.view=[r.x-55,r.y-80,r.w+130,r.h+150];
 }
 let svg=styleIndoor(CORRIDORS.draw(plan,cfg),plan,places);const floorEnd='</g><g data-layer="architecture">';let furnishings='<g data-layer="furniture">',selection='<g data-layer="selection">';
 const footprints=[];
 for(const room of plan.rooms){
  const p=places[room.index],layout=layouts[room.index],f=drawFurniture(p,'p'+room.index+'-',room,layout,placeDoor(plan,room));
  p.bounds=[room.x,room.y,room.w,room.h];p.geometry={room,door:placeDoor(plan,room)};
  footprints.push(...f.footprints.map(o=>({...o,placeId:p.id})));
  furnishings+=f.svg;
  const shape=room.circular?`<circle cx="${room.x+room.w/2}" cy="${room.y+room.h/2}" r="${room.w/2}"`:`<rect x="${room.x}" y="${room.y}" width="${room.w}" height="${room.h}"`;
  selection+=`<g data-id="${escapeXML(p.id)}" tabindex="0" role="button" aria-label="${escapeXML(p.name)}">${shape} data-floor="room" fill="transparent"/></g>`;
 }
 for(const [i,p]of passages.entries()){
  const hall=plan.halls.find(h=>!h.passage);if(!hall)continue;p.bounds=[hall.x,hall.y,hall.w,hall.h];p.geometry={hall};
  selection+=`<g data-id="${escapeXML(p.id)}" role="button" tabindex="0" aria-label="${escapeXML(p.name)}"><rect x="${hall.x}" y="${hall.y}" width="${hall.w}" height="${hall.h}" fill="transparent" data-floor="corridor"/></g>`;
 }
 // Keep the source floor, wall projection, material graph and door/window drawing intact.
 svg=svg.replace(floorEnd,'</g>'+furnishings+'</g><g data-layer="architecture">');
 svg=svg.replace(/<g data-layer="selection">[\s\S]*?<\/g><\/svg>$/,selection+'</g></svg>');
 const mainHall=plan.halls.find(h=>!h.passage);
 return {kind:'indoor',layout:type,geometry:plan,footprints,title:d.meta.areaName||d.pcPlace||'Bản đồ RP',bounds:plan.view,places:scene.places,svg,safeFloor:(x,y,pad)=>generatedFloor(plan,x,y,pad),generatedCorridor:mainHall?[mainHall.x,mainHall.y,mainHall.w,mainHall.h]:null};
}
let sceneryDefs=new Map();
function sceneryAsset(id,x,y,w,h,prefix){
 const a=SCENERY[id];if(!a)return '';
 const b=a.bounds,symbolId='scenery-'+id.replace(/[^a-z0-9]/gi,'-');
 if(!sceneryDefs.has(id)){
  const body=a.svg.replace(/^<svg\b[^>]*>/,'').replace(/<\/svg>\s*$/,'');
  sceneryDefs.set(id,`<symbol id="${symbolId}" viewBox="${b.x} ${b.y} ${b.width} ${b.height}" overflow="visible">${namespaceArt(body,symbolId+'-')}</symbol>`);
 }
 return `<g data-asset="${id}"><use href="#${symbolId}" x="${x}" y="${y}" width="${w}" height="${h}"/></g>`;
}
function outdoorMap(scene,d){
 sceneryDefs=new Map();
 const places=scene.places,width=1100,height=Math.max(780,620+places.length*35),blockers=[],objects=[];
 let terrain=`<rect width="${width}" height="${height}" fill="#f1e5ca"/><path d="M50 190Q250 40 620 125T1050 300L1010 ${height-140}Q700 ${height+10} 160 ${height-100}Q-10 500 50 190Z" fill="#c7cba9" opacity=".43"/><path d="M90 500Q280 340 500 510T1010 570" fill="none" stroke="#d7c7a2" stroke-width="85" opacity=".17"/>`;
 const locations=[[165,190],[695,180],[640,510],[155,530],[430,140],[425,620],[850,410]];
 for(const [i,p]of places.entries()){
  let [x,y]=locations[i%locations.length];y+=Math.floor(i/locations.length)*230;
  const semantic=key(p.type||p.name),water=/lake|river|pond|hồ|sông|ao/.test(semantic),open=/garden|yard|clearing|field|vườn|sân|bãi/.test(semantic);
  const w=water?340:open?300:230,h=water?220:open?210:200;
  p.bounds=[x,y,w,h];p.geometry={outdoor:true,water,open};let art='';
  if(water){
   art=`<path data-forbidden="water" d="M${x} ${y+90}Q${x+35} ${y-25} ${x+180} ${y+15}T${x+w} ${y+110}Q${x+w-10} ${y+h+15} ${x+150} ${y+h}T${x} ${y+90}Z" fill="#8fae9e" stroke="#d7c9a4" stroke-width="9"/><path d="M${x+45} ${y+105}q65 -15 140 0m-95 35q65 12 155 -4" fill="none" stroke="#c5d5c2" stroke-width="2" opacity=".6"/>`;
   blockers.push({x,y,w,h,ellipse:true});
  }else if(open){
   art=`<ellipse cx="${x+w/2}" cy="${y+h/2}" rx="${w/2}" ry="${h/2}" fill="#c9caa5" opacity=".45"/>`;
   art+=sceneryAsset('landscape.garden-bench',x+35,y+130,65,40,'o'+i+'bench-');
  }else{
   const id=/tower|tháp/.test(semantic)?'architecture.owlery':/storage|shed|kho/.test(semantic)?'house.wood.barn':/shop|tiệm/.test(semantic)?'architecture.shop':/inn|quán/.test(semantic)?'architecture.inn':i%2?'house.wood.gable':'architecture.cottage';
   art=`<ellipse cx="${x+w/2}" cy="${y+h-8}" rx="${w*.48}" ry="18" fill="#8d9774" opacity=".16"/>`+`<g data-forbidden="building" data-occluder="building" data-depth="${y+h}">${sceneryAsset(id,x,y,w,h,'o'+i+'-')}</g>`;
   blockers.push({x:x+12,y:y+20,w:w-24,h:h-20});
  }
  objects.push({depth:y+h,svg:`<g data-id="${escapeXML(p.id)}" role="button" tabindex="0" aria-label="${escapeXML(p.name)}">${art}<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="transparent"/></g>`});
  (p.props||[]).forEach((prop,j)=>objects.push({depth:y+h+25,svg:`<g data-prop-fallback="true"><path d="M${x+20+j*22} ${y+h+12}l7 7 -7 7 -7 -7Z" fill="#d8c6a6" stroke="#8d7658"/><title>${escapeXML(prop.name)} × ${prop.count}</title></g>`}));
 }
 for(let i=0;i<44;i++){
  const x=55+(i*239%990),y=65+(i*173%(height-130)),w=32+(i%4)*13,h=w*1.25;
  if(places.some(p=>{const[a,b,c,e]=p.bounds;return x+w>a-20&&x<a+c+20&&y+h>b-20&&y<b+e+35}))continue;
  const id=i%6===0?'terrain.boulder':['architecture.tree','tree.pine','tree.spreading','tree.bare','plant.bush'][i%5];
  objects.push({depth:y+h,svg:sceneryAsset(id,x,y,w,h,'land'+i+'-')});
 }
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><defs>${[...sceneryDefs.values()].join('')}</defs><g data-layer="terrain">${terrain}</g><g data-layer="architecture">${objects.sort((a,b)=>a.depth-b.depth).map(o=>o.svg).join('')}</g></svg>`;
 return {kind:'outdoor',title:d.meta.areaName||d.pcPlace,bounds:[0,0,width,height],places,svg,safeFloor:(x,y,pad=0)=>x-pad>=0&&y-pad>=0&&x+pad<=width&&y+pad<=height&&!blockers.some(r=>r.ellipse?((x-r.x-r.w/2)/(r.w/2+pad))**2+((y-r.y-r.h/2)/(r.h/2+pad))**2<=1:x+pad>=r.x&&x-pad<=r.x+r.w&&y+pad>=r.y&&y-pad<=r.y+r.h)};
}
function styleIndoor(markup,plan,places){
 const doc=new DOMParser().parseFromString(markup,'image/svg+xml'),root=doc.documentElement;
 const finish=r=>{const p=places[r.index],base=['tile','stone'],a=p?.architecture||{};return [['tile','wood','brick','octagon','mosaic','herringbone','diamond','cobble'].includes(a.floor)?a.floor:base[0],['stone','dark','timber','wainscot','plaster','brick','ashlar','panel','limestone','rubble'].includes(a.wall)?a.wall:base[1]];};
 for(const r of plan.rooms){const[floor]=finish(r);for(const n of root.querySelectorAll('[data-layer="floors"] rect'))if(Math.abs(+n.getAttribute('x')-r.x)<.1&&Math.abs(+n.getAttribute('y')-r.y)<.1)n.setAttribute('fill',`url(#floor-${floor})`);}
 const walls=[...plan.walls].sort((a,b)=>(a.axis==='H'?a.at:a.b)-(b.axis==='H'?b.at:b.b)||a.at-b.at);
 [...root.querySelectorAll('[data-wall]')].forEach((n,i)=>{const wall=walls[i];if(!wall)return;const r=plan.rooms.find(r=>r.id===(wall.A?.kind==='room'?wall.A.id:wall.B?.id));if(r)n.querySelector('path').setAttribute('fill',`url(#wall-${finish(r)[1]})`);});
 return new XMLSerializer().serializeToString(root);
}
function buildMap(scene,d){return (d.mapMode||scene.mapMode)==='outdoor'?outdoorMap(scene,d):indoorMap(scene,d);}
function generatedActorPoint(map,place,spot){
 if(!place.bounds||!spot)return null;
 const [x,y,w,h]=place.bounds;
 if(map.kind==='outdoor'){
  if(spot==='inside'&&!place.geometry.water)return{x:x+w/2,y:y+h/2};
  if(spot==='inside')return null;
  const candidates=place.geometry.open?[[x+w/2,y+h/2],[x+w/2,y+h+30]]:[[x+w/2,y+h+30],[x-15,y+h+25],[x+w+15,y+h+25]];
  const p=candidates.find(([x,y])=>map.safeFloor(x,y,7));return p?{x:p[0],y:p[1]}:null;
 }
 const room=place.geometry?.room,hall=place.geometry?.hall;
 if(hall)return {x:x+w/2,y:y+h/2};
 if(spot==='inside')return{x:x+w/2,y:y+h/2};
 const door=place.geometry?.door;
 if(!door){
  if(room?.circular&&map.geometry.special?.type==='tower'){const s=map.geometry.special;return{x:s.stemEnd-12,y:s.cy};}
  return null;
 }
 const ln=door.ln,at=door.at;
 const point=ln.axis==='H'?{x:at,y:ln.at}:{x:ln.at,y:at};
 if(spot==='threshold')return point;
 if(spot==='corridor'){
  const hall=ln.A?.kind==='hall'?ln.A:ln.B?.kind==='hall'?ln.B:null;if(!hall)return null;
  if(ln.axis==='H')point.y+=(hall.y>=ln.at?1:-1)*Math.min(30,hall.h/2);
  else point.x+=(hall.x>=ln.at?1:-1)*Math.min(30,hall.w/2);
  return map.safeFloor(point.x,point.y,5)?point:null;
 }
 if(spot==='outdoor'&&map.geometry.yard){const yard=map.geometry.yard;return{x:yard.x+yard.w/2,y:yard.y+yard.h/2};}
 return null;
}
