const rectContains=(r,x,y,pad=0)=>x-pad>=r.x&&y-pad>=r.y&&x+pad<=r.x+r.w&&y+pad<=r.y+r.h;
function generatedFloor(plan,x,y,pad=0){
 const rects=[...plan.halls,...plan.rooms.filter(r=>!r.circular&&!r.sourceFloor).flatMap(r=>r.cells||[r])];
 const inFloor=(x,y)=>rects.some(r=>rectContains(r,x,y))||plan.rooms.some(r=>r.sourceFloor?.(x,y))||plan.rooms.some(r=>!r.sourceFloor&&r.circular&&Math.hypot(x-r.x-r.w/2,y-r.y-r.h/2)<=r.w/2)||
  (plan.special?.type==='curve'&&x>=0&&y<=0&&(x/(plan.special.R+plan.special.V))**2+(y/(plan.special.R+plan.special.H))**2<=1&&Math.hypot(x,y)>=plan.special.R)||
  (plan.yard&&rectContains(plan.yard,x,y));
 return [[x-pad,y-pad],[x+pad,y-pad],[x-pad,y+pad],[x+pad,y+pad],[x,y]].every(([px,py])=>inFloor(px,py));
}
function placeDoor(plan,room){return room.approvedDoor||plan.openings.doors.find(d=>d.room===room.id);}
function indoorMap(scene,d){
 const standalone=scene.places.length===1;
 const places=scene.places.filter(p=>standalone||recipeId(p.type)!=='PASSAGE_PROPS'),passages=scene.places.filter(p=>!standalone&&recipeId(p.type)==='PASSAGE_PROPS');
 if(!places.length)places.push({id:'context',name:d.meta.areaName||'Không gian RP',props:[],inventory:composeRoom({props:[]})});
 const layouts=places.map(furnitureLayout),requested=d.layoutType||scene.cluster?.layout||'horizontal';
 const type=CORRIDORS.templates.some(t=>t.id===requested)?requested:'horizontal';
 const cfg=structuredClone(CORRIDORS.defaults);Object.assign(cfg,{type,count:places.length,height:40,seed:0,selected:null,decor:true,overrides:{}});
 // With no corridor, preserve the source room dimensions without corridor-axis remapping.
 if(places.length===1)Object.assign(cfg,{type:'horizontal',widthH:120,widthV:120});
 // Reviewed per-layout dimensions, not a second set of runtime multipliers.
 for(const [i,place]of places.entries()){
  const recipe=RECIPES[recipeId(place.type)],profile=recipe?.sizeProfiles?.[layoutSize(place.size)];
  if(profile)cfg.overrides[i]={fw:profile.width,depth:profile.height,nativeW:profile.width,nativeH:profile.height};
  else if(recipe&&layouts[i].objects?.length)cfg.overrides[i]={fw:Math.max(recipe.minW||180,recipe.w||layouts[i].width),depth:Math.max(recipe.minH||160,recipe.h||layouts[i].height)};
 }

 if(Object.values(cfg.overrides).some(p=>p.nativeW))Object.assign(cfg,{widthH:120,widthV:120,spacing:'shared'});
 const plan=CORRIDORS.build(cfg),single=places.length===1;
 if(single){
  plan.halls=[];plan.passages=[];plan.special=null;plan.yard=null;
  plan.walls=plan.walls.filter(w=>w.A?.id===plan.rooms[0].id||w.B?.id===plan.rooms[0].id);
  plan.openings.doors=plan.openings.doors.filter(o=>plan.walls.includes(o.ln));
  plan.openings.windows=plan.openings.windows.filter(o=>plan.walls.includes(o.ln));
  const r=plan.rooms[0];plan.view=[r.x-55,r.y-80,r.w+130,r.h+150];
 }
 if(single&&layouts[0].art?.doorAnchor){const room=plan.rooms[0],art=layouts[0].art,side=art.door?.side||'south',horizontal=['north','south'].includes(side),point={x:room.x+art.doorAnchor.x,y:room.y+art.doorAnchor.y},existing=plan.openings.doors[0],ln=plan.walls.find(w=>w.axis===(horizontal?'H':'V')&&Math.abs(w.at-(horizontal?point.y:point.x))<.1)||{...(existing?.ln||{}),axis:horizontal?'H':'V',at:horizontal?point.y:point.x};room.approvedDoor={...(existing||{}),kind:'door',room:room.id,ln,at:horizontal?point.x:point.y,width:art.door?.width||52};plan.openings.doors=[room.approvedDoor];}
 for(const room of plan.rooms){const art=layouts[room.index].art;if(art?.source==='APPROVED_DECOR'&&art.floorShapes?.length){const path=new Path2D(),ctx=document.createElement('canvas').getContext('2d');for(const shape of art.floorShapes){const doc=new DOMParser().parseFromString('<svg xmlns="http://www.w3.org/2000/svg">'+shape.svg+'</svg>','image/svg+xml');path.addPath(outdoorShape(doc.documentElement.firstElementChild),new DOMMatrix(shape.matrix));}room.sourceFloor=(x,y)=>ctx.isPointInPath(path,x-room.x,y-room.y);}}
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
 if(single&&layouts[0].art?.source==='APPROVED_DECOR'){
  const room=plan.rooms[0],art=layouts[0].art,prefix='p0-',doc=new DOMParser().parseFromString('<svg xmlns="http://www.w3.org/2000/svg">'+art.architectureSvg+'</svg>','image/svg+xml'),front=doc.querySelector('[data-layer="front-wall-foreground"]'),frontSvg=front?.outerHTML||'';front?.remove();
  const floor=`<g data-approved-shell="${escapeXML(recipeId(places[0].type))}" data-layout-size="${layoutSize(places[0].size)}" transform="translate(${room.x} ${room.y})">${namespaceArt(art.floorSvg+doc.documentElement.innerHTML,prefix)}</g>`;
  const frontWall=`<g transform="translate(${room.x} ${room.y})">${namespaceArt(frontSvg,prefix)}</g>`;
  svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${plan.view.join(' ')}">${floor}${furnishings}</g>${selection}</g>${frontWall}</svg>`;
 }
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
// Generated Outdoor shares Indoor's semantic zone/support placement, with ground
// and obstacles checked. This is display geometry, not a navigation/game solver.
function outdoorKind(item,name=''){
 const id=key(item+' '+name);
 if(/^(wm\.tree-|tree\.)|architecture\.tree/.test(item||''))return 'tree';
 if(/^(wm\.house-|house\.)|architecture\.(?:cottage|shop|inn|owlery)/.test(item||''))return 'building';
 if(/wall|fence|tường|hàng rào/.test(id))return 'wall';
 if(/lake|pond|water|fountain|hồ|đài phun/.test(id))return 'landscape';
 return 'furniture';
}
function outdoorOverlap(a,b,gap=3){return a[0]<b[0]+b[2]+gap&&a[0]+a[2]+gap>b[0]&&a[1]<b[1]+b[3]+gap&&a[1]+a[3]+gap>b[1];}
function outdoorGroundBox(bounds){return bounds;}
function outdoorShape(node){
 const p=new Path2D(),num=k=>+(node.getAttribute(k)||0),tag=node.localName;
 if(tag==='path')return new Path2D(node.getAttribute('d'));
 if(tag==='rect')p.rect(num('x'),num('y'),num('width'),num('height'));
 else if(tag==='ellipse'||tag==='circle')p.ellipse(num('cx'),num('cy'),num(tag==='circle'?'r':'rx'),num(tag==='circle'?'r':'ry'),0,0,Math.PI*2);
 return p;
}
function outdoorTerrain(doc,rid,art){
 const out=[],ctx=document.createElement('canvas').getContext('2d');
 // Semantic source tags survive color/decor edits; never infer obstacles from
 // a palette at render time. Supplied terrain has identity outer transforms.
 const entries=art?.terrainShapes||[...doc.querySelectorAll('[data-outdoor-ground]')].filter(n=>!n.closest('defs')).map(n=>({kind:n.getAttribute('data-outdoor-ground'),svg:n.outerHTML,matrix:[1,0,0,1,0,0]}));
 for(const entry of entries){const shape=new DOMParser().parseFromString('<svg xmlns="http://www.w3.org/2000/svg">'+entry.svg+'</svg>','image/svg+xml').documentElement.firstElementChild;
  const kind=entry.kind,path=new Path2D();path.addPath(outdoorShape(shape),new DOMMatrix(entry.matrix));const id='terrain:'+kind+':'+out.filter(o=>o.kind===kind).length;
  const samples=[];ctx.lineWidth=8;
  for(let y=24;y<(art?.height||760)-20;y+=8)for(let x=24;x<(art?.width||1000)-20;x+=8)if(kind==='wall'?ctx.isPointInStroke(path,x,y):ctx.isPointInPath(path,x,y))samples.push([x,y]);
  const xs=samples.map(p=>p[0]),ys=samples.map(p=>p[1]);
  out.push({id,kind,path,samplePoints:samples,bounds:samples.length?[Math.min(...xs)-4,Math.min(...ys)-4,Math.max(...xs)-Math.min(...xs)+8,Math.max(...ys)-Math.min(...ys)+8]:[0,0,0,0]});
 }
 // The supplied waterside deck is walkable above the lake, not bare water.
 const decks=art?.walkableRects||[...doc.querySelectorAll('rect[data-outdoor-walkable]')].map(n=>['x','y','width','height'].map(k=>+n.getAttribute(k)));
 return{obstacles:out,decks,blocked(box){
  const[x,y,w,h]=box;
  for(const o of out){if(!outdoorOverlap(box,o.bounds,0))continue;ctx.lineWidth=8;
   const nx=Math.max(2,Math.ceil(w/8)),ny=Math.max(2,Math.ceil(h/8));
   for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++){
    const px=x+w*i/nx,py=y+h*j/ny;
    if(o.kind==='water'&&decks.some(b=>px>=b[0]&&px<=b[0]+b[2]&&py>=b[1]&&py<=b[1]+b[3]))continue;
    if(o.kind==='wall'?ctx.isPointInStroke(o.path,px,py):ctx.isPointInPath(o.path,px,py))return true;
   }
  }return false;
 }};
}
function outdoorMap(scene,d){
 const columns=Math.max(1,Math.ceil(Math.sqrt(scene.places.length))),footprints=[],plots=[],plans=scene.places.map(p=>{const rid=recipeId(p.type),art=LAYOUT_SIZES[rid]?.[layoutSize(p.size)]||(rid?.startsWith('OUT_')?P4_ART[rid]:null);return{p,rid,art,w:art?.width||1000,h:art?.height||760};}),colWidths=[],rowHeights=[];let markup='';
 for(const[i,z]of plans.entries()){const c=i%columns,r=Math.floor(i/columns);colWidths[c]=Math.max(colWidths[c]||0,z.w);rowHeights[r]=Math.max(rowHeights[r]||0,z.h);}
 for(const[i,z]of plans.entries()){
  const{p,rid,art,w:cellW,h:cellH}=z,x=colWidths.slice(0,i%columns).reduce((a,b)=>a+b,0),y=rowHeights.slice(0,Math.floor(i/columns)).reduce((a,b)=>a+b,0),prefix='out'+i+'-',objects=[],occupied=[];
  const doc=new DOMParser().parseFromString(art?.sceneSvg||'<svg xmlns="http://www.w3.org/2000/svg"/>','image/svg+xml');
  doc.querySelectorAll('[data-element-id],text,title').forEach(n=>n.remove());
  const terrain=outdoorTerrain(doc,rid,art),supports=terrain.obstacles.map(o=>({...o,bounds:[x+o.bounds[0],y+o.bounds[1],o.bounds[2],o.bounds[3]],offset:[x,y],placeId:p.id}));
  const inPlot=box=>box[0]>=30&&box[1]>=30&&box[0]+box[2]<=cellW-30&&box[1]+box[3]<=cellH-30;
  const safeBox=(box,props=true)=>inPlot(box)&&!terrain.blocked(box)&&!occupied.some(f=>(props||f.blocksActor)&&outdoorOverlap(box,f.groundBounds,2));
  const add=(item,box,svg,kind,base)=>{
   const groundBounds=outdoorGroundBox(box,kind),blocksActor=['tree','building','wall','landscape'].includes(kind)||largeFurniture(item.item||'',item.name,CATALOG[item.item]);
   const f={id:item.id,sourceId:item.sourceId||item.id,name:item.name,item:item.item,placeId:p.id,bounds:[x+box[0],y+box[1],box[2],box[3]],groundBounds:[x+groundBounds[0],y+groundBounds[1],groundBounds[2],groundBounds[3]],kind,blocksActor,surface:CATALOG[item.item]?.surface,parentId:item.boundSupportId};
   footprints.push(f);occupied.push({...f,bounds:box,groundBounds});supports.push(f);
   const forbidden=kind==='tree'?'tree':kind==='building'?'building':kind==='wall'?'wall':kind==='landscape'?'landscape':null;
   const attrs=`${base?'data-instance':'data-rp-instance'}="${escapeXML(item.id)}" data-source-id="${escapeXML(item.sourceId||item.id)}" data-count="1" data-kind="${kind}" data-footprint="${f.bounds.join(' ')}" ${forbidden?`data-forbidden="${forbidden}"`:''} ${kind==='building'?`data-occluder="building" data-layer="1" data-depth="${y+box[1]+box[3]}"`:''}`;
   const body=`<g ${attrs}>${svg}</g>`;
   objects.push({depth:box[1]+box[3],svg:body});
  };
  const extras=[];
  for(const item of p.inventory.objects){
   const node=art?.objects.find(n=>n.id===item.id),count=Math.max(0,item.count??1);
   if(node&&count){add(item,node.bounds,namespaceArt(editedArtwork(art.defs+node.svg,item,p.inventory.diagnostics),'base'+i+'-'+art.objects.indexOf(node)+'-'),outdoorKind(node.item,item.name),true);}
   if(count>(node?1:0))extras.push({...item,count:count-(node?1:0)});
  }
  // Deterministic candidate field covers the same ground as the supplied scene.
  // No appended inventory strip, no extra building or landscape inferred from RP prose.
  const candidates=[];for(let cy=38;cy<cellH-50;cy+=24)for(let cx=38;cx<cellW-50;cx+=24)candidates.push({x:cx,y:cy});
  let summary=0;
  for(const[index,item]of extras.entries()){
   const matches=Object.values(CATALOG).filter(a=>key(a.name)===key(item.name)||a.aliases?.some(n=>key(n)===key(item.name)));
   const asset=CATALOG[item.item||propAliases[key(item.name)]]||(matches.length===1?matches[0]:null)||visualAsset(item),assetId=item.item||asset?.id||'',kind=outdoorKind(assetId,item.name);
   if(item.visual&&!asset)p.inventory.diagnostics.push('invalid-visual:'+item.name);
   const ref=asset?.occupancy,vb=ref?[ref.x,ref.y,ref.width,ref.height]:asset?.viewBox||[0,0,100,100];
   let width=kind==='building'?140:kind==='tree'?90:kind==='wall'?110:largeFurniture(assetId,item.name,asset)?64:28,height=width*Math.min(2,Math.max(.3,vb[3]/Math.max(1,vb[2])));
   const desired=zonePoint([0,0,cellW,cellH],item.zone),seed=[...String(item.id)].reduce((n,c)=>((n*31+c.charCodeAt(0))>>>0),0);
   const ordered=[...candidates].sort((a,b)=>Math.hypot(a.x+width/2-desired.x,a.y+height/2-desired.y)-Math.hypot(b.x+width/2-desired.x,b.y+height/2-desired.y)||((a.x*17+a.y*13+seed)%37)-((b.x*17+b.y*13+seed)%37));
   let drawn=0;const mount=item.mount||(item.zone==='surface'?'surface':asset?.mount)||'floor';
   const parentId=item.parentId||item.supportId,parent=parentId?supports.find(f=>f.id===parentId||f.sourceId===parentId):null;
   for(let n=0;n<Math.min(item.count,2000);n++){
    let box;
    if(mount==='surface'||parentId||item.placement==='on_landscape'){
     if(!parent||(item.placement!=='on_landscape'&&!parent.surface)){p.inventory.diagnostics.push('unresolved-surface:'+item.name);break;}
     const local={...parent,bounds:[parent.bounds[0]-x,parent.bounds[1]-y,parent.bounds[2],parent.bounds[3]]};
     if(mount==='surface'){const region=supportSurface(local).bounds,scale=Math.min(1,region[2]/(4*width),region[3]/(4*height));width*=scale;height*=scale;}
     box=surfaceSlot(local,width,height,item.zone,occupied);if(!box||!inPlot(box))break;
    }else if(mount==='wall'){
     p.inventory.diagnostics.push('unresolved-surface:'+item.name);break;
    }else{
     const point=ordered.find(q=>{const b=[q.x,q.y,width,height],ground=outdoorGroundBox(b,kind);return inPlot(b)&&safeBox(ground)&&!occupied.some(f=>outdoorOverlap(b,f.bounds));});
     if(!point)break;box=[point.x,point.y,width,height];
    }
    const id=item.id+':extra:'+n,content=asset&&!item.informationOnly?`<svg x="${box[0]}" y="${box[1]}" width="${width}" height="${height}" viewBox="${vb.join(' ')}"><title>${escapeXML(item.name)}</title>${namespaceArt(asset.svg.replace(/^<svg\b[^>]*>/,'').replace(/<\/svg>\s*$/,''),'extra'+index+'-'+n+'-')}</svg>`:`<g data-prop-fallback="true"><path d="M${box[0]} ${box[1]+12}l12 -12 12 12 -12 12Z" fill="#d8c6a6" stroke="#8d7658"/><title>${escapeXML(item.name)}</title></g>`;
    add({...item,id,sourceId:item.id,item:assetId,boundSupportId:parent?.id},box,content,kind,false);drawn++;
   }
   if(drawn<item.count){summary+=item.count-drawn;p.inventory.diagnostics.push('outdoor-count-summary:'+item.name+':'+(item.count-drawn));}
  }
  if(summary)objects.push({depth:cellH-20,svg:`<g data-prop-summary="true"><circle cx="${cellW-45}" cy="35" r="7" fill="#a18b6b"/><title>${summary} additional items — Inspector</title></g>`});
  p.bounds=[x,y,cellW,cellH];p.geometry={outdoor:true,open:true,supports,walkableRects:terrain.decks.map(b=>[x+b[0],y+b[1],b[2],b[3]])};
  plots.push({bounds:p.bounds,placeId:p.id,safe:(px,py,pad=0)=>safeBox([px-x-pad,py-y-pad,pad*2,pad*2],false)});
  const terrainSvg=art?.sceneSvg?doc.documentElement.innerHTML:'<rect width="1000" height="760" fill="#f1e5ca"/><ellipse cx="500" cy="380" rx="420" ry="280" fill="#c7cba9" opacity=".3"/>';
  markup+=`<g data-id="${escapeXML(p.id)}" data-recipe="${escapeXML(rid||'custom')}" role="button" tabindex="0" aria-label="${escapeXML(p.name)}" transform="translate(${x} ${y})">${namespaceArt(terrainSvg+objects.sort((a,b)=>a.depth-b.depth).map(o=>o.svg).join(''),prefix)}</g>`;
 }
 const width=colWidths.reduce((a,b)=>a+b,0),height=rowHeights.reduce((a,b)=>a+b,0);
 return{kind:'outdoor',title:d.meta.areaName||d.pcPlace,bounds:[0,0,width,height],places:scene.places,footprints,svg:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">${markup}</svg>`,safeFloor:(x,y,pad=0)=>plots.some(p=>x>=p.bounds[0]&&x<=p.bounds[0]+p.bounds[2]&&y>=p.bounds[1]&&y<=p.bounds[1]+p.bounds[3]&&p.safe(x,y,pad))};
}
function outdoorActorPoint(map,place,actor){
 const desired=zonePoint(place.bounds,actor.zone),supports=place.geometry.supports||[];
 if(['on_furniture','on_landscape','in_wall'].includes(actor.placement)){
  const support=supports.find(f=>(f.id===actor.supportId||f.sourceId===actor.supportId)&&(actor.placement!=='in_wall'||f.kind==='wall'));
  if(!support){place.inventory.diagnostics.push('unresolved-support:'+actor.supportId);return{...desired,anchorOnly:true,noFeet:true};}
  const target=zonePoint(support.bounds,actor.zone),samples=support.samplePoints?.map(([x,y])=>({x:x+support.offset[0],y:y+support.offset[1]}));
  const point=samples?.length?samples.reduce((best,p)=>Math.hypot(p.x-target.x,p.y-target.y)<Math.hypot(best.x-target.x,best.y-target.y)?p:best):target;
  return{...point,noFeet:true};
 }
 // An explicit indoor RP location remains attached to its building on an
 // exterior scene. Do not move it out to the yard or invent an interior floor.
 if(actor.spot==='inside'){
  const buildings=supports.filter(f=>f.kind==='building'),building=actor.supportId?buildings.find(f=>f.id===actor.supportId||f.sourceId===actor.supportId):buildings.length===1?buildings[0]:null;
  if(building){place.inventory.diagnostics.push('outdoor-interior-anchor:'+place.id);return{...zonePoint(building.bounds,actor.zone),anchorOnly:true,noFeet:true};}
  place.inventory.diagnostics.push('unresolved-support:indoor-building');
 }
 const[x,y,w,h]=place.bounds,points=[desired];for(let v=.08;v<.96;v+=.06)for(let u=.06;u<.96;u+=.06)points.push({x:x+w*u,y:y+h*v});
 points.sort((a,b)=>Math.hypot(a.x-desired.x,a.y-desired.y)-Math.hypot(b.x-desired.x,b.y-desired.y));
 const point=points.find(p=>map.safeFloor(p.x,p.y,7)&&!(map.actorPoints||[]).some(q=>Math.hypot(q.x-p.x,q.y-p.y)<18));
 if(!point)return{...desired,anchorOnly:true,noFeet:true};
 (map.actorPoints||(map.actorPoints=[])).push(point);return{...point,...(actor.spot==='inside'?{anchorOnly:true,noFeet:true}:{noFeet:['sitting','lying','hidden'].includes(actor.posture)})};
}
function styleIndoor(markup,plan,places){
 const doc=new DOMParser().parseFromString(markup,'image/svg+xml'),root=doc.documentElement;
 const finish=r=>{const p=places[r.index],base=['tile','stone'],a=p?.architecture||{};return [['tile','wood','brick','octagon','mosaic','herringbone','diamond','cobble'].includes(a.floor)?a.floor:base[0],['stone','dark','timber','wainscot','plaster','brick','ashlar','panel','limestone','rubble'].includes(a.wall)?a.wall:base[1]];};
 for(const r of plan.rooms){const[floor]=finish(r);for(const n of root.querySelectorAll('[data-layer="floors"] rect'))if(Math.abs(+n.getAttribute('x')-r.x)<.1&&Math.abs(+n.getAttribute('y')-r.y)<.1)n.setAttribute('fill',`url(#floor-${floor})`);}
 for(const r of plan.rooms){const p=places[r.index],art=LAYOUT_SIZES[recipeId(p?.type)]?.[layoutSize(p?.size)];if(art?.source!=='APPROVED_DECOR')continue;const prefix='finish-'+r.index+'-';const defs=doc.createElementNS('http://www.w3.org/2000/svg','g');defs.innerHTML=namespaceArt(art.defs,prefix);root.prepend(defs);
  for(const n of [...root.querySelectorAll('[data-layer="floors"]>rect')])if(Math.abs(+n.getAttribute('x')-r.x)<.1&&Math.abs(+n.getAttribute('y')-r.y)<.1){const g=doc.createElementNS('http://www.w3.org/2000/svg','g');g.setAttribute('transform',`translate(${r.x} ${r.y})`);g.innerHTML=namespaceArt(art.floorSvg,prefix);n.replaceWith(g);}
 }
 const walls=[...plan.walls].sort((a,b)=>(a.axis==='H'?a.at:a.b)-(b.axis==='H'?b.at:b.b)||a.at-b.at);
 [...root.querySelectorAll('[data-wall]')].forEach((n,i)=>{const wall=walls[i];if(!wall)return;const r=plan.rooms.find(r=>r.id===(wall.A?.kind==='room'?wall.A.id:wall.B?.id));if(r){const art=LAYOUT_SIZES[recipeId(places[r.index]?.type)]?.[layoutSize(places[r.index]?.size)],fill=art?.source==='APPROVED_DECOR'&&art.wallFill?namespaceArt(art.wallFill,'finish-'+r.index+'-'):`url(#wall-${finish(r)[1]})`;n.querySelector('path').setAttribute('fill',fill);}});
 return new XMLSerializer().serializeToString(root);
}
function buildMap(scene,d){return (d.mapMode||scene.mapMode)==='outdoor'?outdoorMap(scene,d):indoorMap(scene,d);}
function generatedActorPoint(map,place,spot,actor={}){
 if(!place.bounds||!spot)return null;
 const [x,y,w,h]=place.bounds;
 if(map.kind==='outdoor')return outdoorActorPoint(map,place,{...actor,spot});
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
