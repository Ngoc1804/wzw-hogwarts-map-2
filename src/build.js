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
 // Adapt proportions through the approved core's overrides, never change its projection.
 for(const [i,place]of places.entries()){
  const recipe=RECIPES[recipeId(place.type)],factor=({small:.8,large:1.3})[place.size]||1;
  if(recipe&&layouts[i].objects?.length||factor!==1){
   const w=recipe?.w||layouts[i].width,h=recipe?.h||layouts[i].height;
   cfg.overrides[i]={fw:Math.max(recipe?.minW||180,w*.8*factor),depth:Math.max(recipe?.minH||160,h*.8*factor)};
  }
 }
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
  const props=placeExtraProps(p,'hall'+i+'-',{...hall},(p.inventory?.objects||[]).filter(o=>o.source==='rp'),null,[]);furnishings+=props.svg;footprints.push(...props.footprints.map(f=>({...f,placeId:p.id})));
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
 const columns=Math.max(1,Math.ceil(Math.sqrt(scene.places.length))),cellW=1000,footprints=[],water=[];
 const isBuilding=id=>/^(wm\.house-|house\.|architecture\.(?:cottage|shop|inn|owlery))/.test(id||'');
 const plans=scene.places.map(p=>{const rid=recipeId(p.type),art=P4_ART[rid],extras=[];let budget=2000;
  for(const item of p.inventory.objects){const count=Math.max(0,(item.count??1)-(art?.objects.some(n=>n.id===item.id)?1:0)),drawn=Math.min(count,budget);budget-=drawn;
   for(let i=0;i<drawn;i++)extras.push({...item,id:item.id+':extra:'+i,count:1});
   if(count>drawn){extras.push({...item,id:item.id+':summary',count:count-drawn,summary:true});p.inventory.diagnostics.push('outdoor-count-summary:'+item.name+':'+(count-drawn));}
  }
  return{p,rid,art,extras,height:extras.length?800+Math.ceil(extras.length/10)*88+24:760};
 });
 const rowHeights=[];for(const[i,z]of plans.entries()){const row=Math.floor(i/columns);rowHeights[row]=Math.max(rowHeights[row]||0,z.height);}
 const rowY=row=>rowHeights.slice(0,row).reduce((a,b)=>a+b,0);let markup='';
 for(const[i,z]of plans.entries()){
  const{p,rid,art,extras}=z,x=i%columns*cellW,y=rowY(Math.floor(i/columns)),prefix='out'+i+'-';
  p.bounds=[x,y,cellW,z.height];p.geometry={outdoor:true,open:true};
  let body=`<rect width="1000" height="${z.height}" fill="#f1e5ca"/>`;
  if(art?.sceneSvg&&rid.startsWith('OUT_')){
   const doc=new DOMParser().parseFromString(art.sceneSvg,'image/svg+xml');doc.querySelectorAll('[data-element-id],text,title').forEach(n=>n.remove());
   for(const n of doc.querySelectorAll('path[fill="#88b3b6"]'))water.push({x,y,path:new Path2D(n.getAttribute('d'))});
   body+=doc.documentElement.innerHTML;
   for(const item of p.inventory.objects){const node=art.objects.find(n=>n.id===item.id);if(!node)continue;
    const[bx,by,w,h]=node.bounds,building=isBuilding(node.item);const occlusion=building?`data-forbidden="building" data-occluder="building" data-layer="1" data-depth="${y+by+h}"`:'';
    body+=`<g data-instance="${escapeXML(item.id)}" ${occlusion}>${namespaceArt(editedArtwork(art.defs+node.svg,item,p.inventory.diagnostics),'instance'+i+'-'+art.objects.indexOf(node)+'-')}</g>`;
    footprints.push({placeId:p.id,id:item.id,bounds:[x+bx,y+by,w,h]});
   }
  }else body+='<ellipse cx="500" cy="380" rx="420" ry="280" fill="#c7cba9" opacity=".3"/>';
  for(const[j,item]of extras.entries()){
   const asset=CATALOG[item.item||propAliases[key(item.name)]]||visualAsset(item),px=40+j%10*92,py=800+Math.floor(j/10)*88,building=isBuilding(item.item);
   if(item.visual&&!asset)p.inventory.diagnostics.push('invalid-visual:'+item.name);
   const occupancy=asset?.occupancy,vb=occupancy?[occupancy.x,occupancy.y,occupancy.width,occupancy.height]:asset?.viewBox||[0,0,100,100];
   const occlusion=building?`data-forbidden="building" data-occluder="building" data-layer="1" data-depth="${y+py+65}"`:'';
   body+=`<g data-rp-instance="${escapeXML(item.id)}" data-count="${item.count}" ${occlusion}>`;
   body+=asset&&!item.informationOnly&&!item.summary?`<svg x="${px}" y="${py}" width="80" height="65" viewBox="${vb.join(' ')}">${namespaceArt(asset.svg.replace(/^<svg\b[^>]*>/,'').replace(/<\/svg>\s*$/,''),'extra'+j+'-')}</svg>`:`<g data-prop-fallback="true"><path d="M${px} ${py}l18 -12 18 12 -18 12Z" fill="#d8c6a6" stroke="#8d7658"/><title>${escapeXML(item.name)} × ${item.count}${item.summary?' — résumé Inspector':''}</title></g>`;
   body+='</g>';footprints.push({placeId:p.id,id:item.id,bounds:[x+px,y+py,80,65]});
  }
  markup+=`<g data-id="${escapeXML(p.id)}" data-recipe="${escapeXML(rid||'custom')}" tabindex="0" role="button" aria-label="${escapeXML(p.name)}" transform="translate(${x} ${y})">${namespaceArt(body,prefix)}</g>`;
 }
 const width=columns*cellW,height=rowHeights.reduce((a,b)=>a+b,0)||760,ctx=document.createElement('canvas').getContext('2d');
 return{kind:'outdoor',title:d.meta.areaName||d.pcPlace,bounds:[0,0,width,height],places:scene.places,svg:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">${markup}</svg>`,footprints,
 safeFloor:(x,y,pad=0)=>x-pad>=0&&y-pad>=0&&x+pad<=width&&y+pad<=height&&!footprints.some(f=>{const[a,b,w,h]=f.bounds;return x+pad>=a&&x-pad<=a+w&&y+pad>=b&&y-pad<=b+h})&&!water.some(z=>[[x,y],[x-pad,y-pad],[x+pad,y+pad],[x-pad,y+pad],[x+pad,y-pad]].some(([px,py])=>ctx.isPointInPath(z.path,px-z.x,py-z.y)))};
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
function generatedActorPoint(map,place,spot,actor={}){
 if(!place.bounds||!spot)return null;
 const [x,y,w,h]=place.bounds;
 if(map.kind==='outdoor'){
  if(spot==='inside'&&!place.geometry.water)return{x:x+w/2,y:y+h/2};
  if(spot==='inside')return null;
  const candidates=place.geometry.open?Array.from({length:81},(_,i)=>[x+w*(.1+i%9*.1),y+h*(.1+Math.floor(i/9)*.1)]):[[x+w/2,y+h+30],[x-15,y+h+25],[x+w+15,y+h+25]];
  const p=candidates.find(([x,y])=>map.safeFloor(x,y,7));return p?{x:p[0],y:p[1]}:null;
 }
 const room=place.geometry?.room,hall=place.geometry?.hall;
 if(hall||spot==='inside')return indoorActorPoint(map,place,actor);
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

// Approximate display placement only: no game physics or route finding.
function zonePoint(bounds,zone='center'){
 const [x,y,w,h]=bounds,offset={center:[.5,.5],entrance:[.5,.85],wall_north:[.5,.15],wall_south:[.5,.85],wall_west:[.15,.5],wall_east:[.85,.5],left:[.25,.5],right:[.75,.5],end:[.5,.15]};
 const [u,v]=offset[zone]||offset.center;return{x:x+w*u,y:y+h*v};
}
function indoorActorPoint(map,place,actor){
 const bounds=place.bounds,room=place.geometry?.room;
 const obstacles=(map.footprints||[]).filter(f=>f.placeId===place.id&&f.blocksActor);
 const desired=zonePoint(bounds,actor.zone);
 if(actor.placement==='in_wall')return{x:bounds[0]+bounds[2]/2,y:bounds[1],noFeet:true};
 if(actor.placement==='on_furniture'){
  const support=obstacles.find(f=>f.id===actor.supportId);
  return support?{...zonePoint(support.bounds),noFeet:true}:{...desired,anchorOnly:true,noFeet:true};
 }
 const inside=p=>room?.circular?Math.hypot(p.x-room.x-room.w/2,p.y-room.y-room.h/2)+7<room.w/2:p.x>=bounds[0]+26&&p.x<=bounds[0]+bounds[2]-9&&p.y>=bounds[1]+9&&p.y<=bounds[1]+bounds[3]-46;
 const points=[desired];for(const u of [.15,.3,.5,.7,.85])for(const v of [.15,.3,.5,.7,.85])points.push({x:bounds[0]+bounds[2]*u,y:bounds[1]+bounds[3]*v});
 points.sort((a,b)=>Math.hypot(a.x-desired.x,a.y-desired.y)-Math.hypot(b.x-desired.x,b.y-desired.y));
 const point=points.find(p=>inside(p)&&map.safeFloor(p.x,p.y,6)&&!obstacles.some(f=>{const [x,y,w,h]=f.bounds;return p.x>x-6&&p.x<x+w+6&&p.y>y-6&&p.y<y+h+6;})&&!(map.actorPoints||[]).some(q=>Math.hypot(q.x-p.x,q.y-p.y)<14));
 if(!point)return{...desired,anchorOnly:true,noFeet:true};
 (map.actorPoints||(map.actorPoints=[])).push(point);return{...point,noFeet:['sitting','lying','hidden'].includes(actor.posture)};
}
