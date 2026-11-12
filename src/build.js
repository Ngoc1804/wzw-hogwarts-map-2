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
 const cfg=structuredClone(CORRIDORS.defaults);Object.assign(cfg,{type,count:places.length,height:36,seed:0,selected:null,decor:false,overrides:{}});
 for(const [i,f]of layouts.entries()){
  const span=Math.max(f.width*.67+32,f.height*.67+32,200);
  cfg.overrides[i]={fw:Math.round(span),depth:Math.round(span)};
 }
 const plan=CORRIDORS.build(cfg),single=places.length===1;
 if(single){
  plan.halls=[];plan.passages=[];plan.special=null;plan.yard=null;
  plan.walls=plan.walls.filter(w=>w.A?.id===plan.rooms[0].id||w.B?.id===plan.rooms[0].id);
  plan.openings.doors=plan.openings.doors.filter(o=>plan.walls.includes(o.ln));
  plan.openings.windows=plan.openings.windows.filter(o=>plan.walls.includes(o.ln));
  const r=plan.rooms[0];plan.view=[r.x-55,r.y-80,r.w+130,r.h+150];
 }
 let svg=CORRIDORS.draw(plan,cfg);const floorEnd='</g><g data-layer="architecture">';let furnishings='<g data-layer="furniture">',selection='<g data-layer="selection">';
 const footprints=[];
 for(const room of plan.rooms){
  const p=places[room.index],layout=layouts[room.index],f=drawFurniture(p,'p'+room.index+'-',room,layout,placeDoor(plan,room));
  p.bounds=[room.x,room.y,room.w,room.h];p.geometry={room,door:placeDoor(plan,room)};
  footprints.push(...f.footprints.map(o=>({...o,placeId:p.id})));
  furnishings+=f.svg;
  const shape=room.circular?`<circle cx="${room.x+room.w/2}" cy="${room.y+room.h/2}" r="${room.w/2}"`:`<rect x="${room.x}" y="${room.y}" width="${room.w}" height="${room.h}"`;
  selection+=`<g data-id="${escapeXML(p.id)}" tabindex="0" role="button" aria-label="${escapeXML(p.name)}">${shape} data-floor="room" fill="transparent"/><text x="${room.x+room.w/2}" y="${room.y+room.h-52}" text-anchor="middle" font-size="11" fill="#68503a" pointer-events="none">${escapeXML(p.name)}</text></g>`;
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
function outdoorMap(scene,d){
 const places=scene.places,cols=Math.max(1,Math.ceil(Math.sqrt(places.length))),width=Math.max(640,cols*350+100),height=Math.max(500,Math.ceil(places.length/cols)*290+100);
 let terrain='<rect width="'+width+'" height="'+height+'" fill="#c7ccb0"/><path d="M0 0H'+width+'V'+height+'H0Z" fill="url(#out-grass)"/>';
 let buildings='',hits='';const blockers=[];
 for(const [i,p]of places.entries()){
  const x=70+(i%cols)*350,y=90+Math.floor(i/cols)*290;
  const water=/lake|river|pond|hồ|sông|ao/.test(key(p.type||p.name));const open=/garden|yard|clearing|field|vườn|sân|bãi/.test(key(p.type||p.name));
  p.bounds=[x,y,260,180];p.geometry={outdoor:true,water,open};
  let art;
  if(water){art=`<ellipse data-forbidden="water" cx="${x+130}" cy="${y+90}" rx="120" ry="75" fill="#a6beb5" stroke="#d8cfab" stroke-width="10"/><path d="M${x+65} ${y+80}q35 -12 70 0t65 0M${x+80} ${y+120}q40 -10 85 0" fill="none" stroke="#dce0c9" stroke-width="2"/>`;blockers.push({x:x+10,y:y+15,w:240,h:150,ellipse:true});}
  else if(open){art=`<rect x="${x}" y="${y}" width="260" height="180" rx="15" fill="#b9c29d" stroke="#99a582"/><path d="M${x+10} ${y+90}h240" stroke="#d8ccb0" stroke-width="28"/>`;for(const k of [0,1,2,3])art+=`<g transform="translate(${x+30+k*62} ${y+(k%2?145:30)})"><ellipse rx="18" ry="13" fill="#94a489" stroke="#71866c"/><path d="M0 13v8" stroke="#8b7658" stroke-width="3"/></g>`;}
  else{
   const tower=/tower|tháp/.test(key(p.type||p.name));
   art=tower?`<g data-forbidden="building" data-occluder="building" data-depth="${y+140}"><ellipse cx="${x+130}" cy="${y+140}" rx="70" ry="30" fill="#b7a98d"/><path d="M${x+60} ${y+65}v75q70 42 140 0V${y+65}Z" fill="#c9baa0" stroke="#8c795f"/><path d="M${x+53} ${y+65}l77 -65 77 65q-77 37 -154 0Z" fill="#8a7667" stroke="#6f5d50"/></g>`:`<g data-forbidden="building" data-occluder="building" data-depth="${y+140}"><path d="M${x+25} ${y+65}h200v80h-200Z" fill="#c9baa0" stroke="#8c795f"/><path d="M${x+25} ${y+65}l35 -48h145l20 48Z" fill="#927d68" stroke="#705e4e"/><path d="M${x+25} ${y+145}h200" stroke="#84735b" stroke-width="3"/><rect x="${x+106}" y="${y+103}" width="34" height="42" fill="#8f704e"/><path d="M${x+50} ${y+89}h25v24h-25ZM${x+175} ${y+89}h25v24h-25Z" fill="#b5cac2" stroke="#8c795f"/></g>`;
   blockers.push({x:x+25,y:y+15,w:200,h:130});
  }
  buildings+=`<g data-id="${escapeXML(p.id)}" tabindex="0" role="button" aria-label="${escapeXML(p.name)}">${art}<text x="${x+130}" y="${y+172}" text-anchor="middle" font-size="13" fill="#68503a">${escapeXML(p.name)}</text></g>`;
  // Outdoor props remain explicit named representatives; no indoor recipe is put on a roof.
  (p.props||[]).forEach((prop,j)=>{buildings+=`<g data-prop-fallback="true"><circle cx="${x+28+j*18}" cy="${y+198}" r="6" fill="#d6c2a1" stroke="#886f51"/><title>${escapeXML(prop.name)} × ${prop.count}</title></g>`});
 }
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><defs><pattern id="out-grass" width="36" height="32" patternUnits="userSpaceOnUse"><path d="M4 12l2 -3m17 15l3 -4M31 5l1 -2" fill="none" stroke="#9aab88" stroke-width="1" opacity=".5"/></pattern></defs><g data-layer="terrain">${terrain}</g><g data-layer="architecture">${buildings}</g>${hits}</svg>`;
 return {kind:'outdoor',title:d.meta.areaName||d.pcPlace,bounds:[0,0,width,height],places,svg,safeFloor:(x,y,pad=0)=>x-pad>=0&&y-pad>=0&&x+pad<=width&&y+pad<=height&&!blockers.some(r=>r.ellipse?((x-r.x-r.w/2)/(r.w/2+pad))**2+((y-r.y-r.h/2)/(r.h/2+pad))**2<=1:x+pad>=r.x&&x-pad<=r.x+r.w&&y+pad>=r.y&&y-pad<=r.y+r.h)};
}
function buildMap(scene,d){return d.mapMode==='outdoor'?outdoorMap(scene,d):indoorMap(scene,d);}
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
