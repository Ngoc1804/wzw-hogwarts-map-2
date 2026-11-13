// Standalone catalog view from the one approved source: no duplicated corridor SVG in bundle.
function corridorAssetMarkup(asset){
 const ref=asset.corridorSource,view=asset.viewBox;let body='';
 if(ref.kind==='decor')body=CORRIDORS.decorate(ref.key);
 else if(ref.kind==='pattern'||ref.kind==='yard'||ref.kind==='runner'){
  const id=ref.kind==='pattern'?ref.key:ref.kind==='runner'?'floor-slate':ref.key==='paving'?'yard-paving':'yard-grass';
  const pattern=[...CORRIDORS.patterns().matchAll(/<pattern\b[^>]*\bid="([^"]+)"[^>]*>[\s\S]*?<\/pattern>/g)].find(m=>m[1]===id)?.[0]||'';
  body='<defs>'+pattern+'</defs>'+(ref.kind==='runner'?'<rect width="360" height="120" fill="url(#floor-slate)"/><rect x="4" y="33.6" width="352" height="52.8" fill="#975b58" stroke="#c6a568" stroke-width="2"/>':ref.kind==='pattern'?`<rect width="${ref.w}" height="${ref.h}" fill="url(#${id})"/>`:CORRIDORS.yard({x:0,y:0,w:360,h:280},ref.key));
 }else{
  const cfg=structuredClone(CORRIDORS.defaults);cfg.height=40;cfg.materials[ref.kind==='window'?'window':'door']=ref.key;
  body=CORRIDORS.opening({kind:ref.kind==='window'?'window':'door',main:ref.kind==='main-door',width:ref.kind==='main-door'?64:44,ln:{axis:'H'}},40,cfg);
 }
 let markup=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${view.join(' ')}">${body}</svg>`;for(const [old,next]of asset.paintEdits||[])markup=markup.replaceAll(old,next);return markup;
}
const escapeXML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function namespaceArt(markup,prefix){return markup.replace(/(?:^|\s)id="([^"]+)"/g,(_,id)=>` id="${prefix}${id}"`).replace(/url\(#([^)]+)\)/g,(_,id)=>`url(#${prefix}${id})`).replace(/href="#([^"]+)"/g,(_,id)=>`href="#${prefix}${id}"`);}
// Furniture stays upright. Only uniform scale/translation is used; no wall shear.
function furnitureLayout(place){
 const inventory=place.inventory||composeRoom(place),art=P4_ART[inventory.recipeId];
 const nodes=new Map((art?.objects||[]).map(x=>[x.id,x]));const objects=[],extra=[];
 const north=art?.source==='FINAL'?[]:art?.objects.filter(o=>o.bounds[1]+o.bounds[3]<5&&!/portrait|blackboard|banner|crest/.test(o.item))||[];
 const band=north.length?105:20;
 for(const item of inventory.objects){
  const node=nodes.get(item.id);
  if(!node){extra.push(item);continue;}
  const [x,y,w,h]=node.bounds;let magnify=1,dx=0,dy=band;
  if(north.includes(node)){
   // Front-view storage was incorrectly squeezed to the wall height in the reference.
   // Use the useful artwork aspect ratio and reserve a real floor strip for it.
   magnify=Math.min(3.5,80/Math.max(w,1));dx=x+w/2-(x+w/2)*magnify;dy=8-y*magnify;
  }else if(y+h<5&&art?.source!=='FINAL'){dy=8-y;}
  objects.push({item,node,magnify,dx,dy,bounds:[x*magnify+dx,y*magnify+dy,w*magnify,h*magnify]});

 }
 if(art?.source==='FINAL'&&objects.length){
  const minX=Math.min(0,...objects.map(o=>o.bounds[0])),minY=Math.min(0,...objects.map(o=>o.bounds[1]));
  const maxX=Math.max(art.width,...objects.map(o=>o.bounds[0]+o.bounds[2])),maxY=Math.max(art.height,...objects.map(o=>o.bounds[1]+o.bounds[3]));
  for(const o of objects){o.dx-=minX;o.dy-=minY;o.bounds[0]-=minX;o.bounds[1]-=minY;}
  return {inventory,art,objects,extra,width:maxX-minX,height:maxY-minY+20};
 }
 const width=art?.width||320;
 const height=(art?.height||190)+band+20;
 return {inventory,art,objects,extra,width,height};
}
function drawFurniture(place,prefix,room,layout,door){
 const pad={left:14,right:14,top:14,bottom:44};
 if(door){const ln=door.ln;if(ln.axis==='H')pad[Math.abs(ln.at-room.y)<.1?'top':'bottom']=52;else pad[Math.abs(ln.at-room.x)<.1?'left':'right']=52;}
 const circle=room.circular;const usableW=circle?room.w*.68:room.w,usableH=circle?room.h*.68:room.h;
 const scale=Math.min((usableW-pad.left-pad.right)/layout.width,(usableH-pad.top-pad.bottom)/layout.height,.95);
 const x=room.x+(room.w-usableW)/2+pad.left+(usableW-pad.left-pad.right-layout.width*scale)/2;
 const y=room.y+(room.h-usableH)/2+pad.top+(usableH-pad.top-pad.bottom-layout.height*scale)/2;
 let markup=layout.art?namespaceArt(layout.art.defs,prefix):'';const footprints=[];
 for(const o of layout.objects){
  const [bx,by,bw,bh]=o.bounds;const box=[x+bx*scale,y+by*scale,bw*scale,bh*scale];
  const asset=CATALOG[o.node.item];
  footprints.push({id:o.item.id,name:o.item.name,item:o.node.item,bounds:box,blocksActor:largeFurniture(o.node.item,o.item.name,asset),surface:asset?.surface});
  markup+=`<g data-instance="${escapeXML(o.item.id)}" data-state="${escapeXML(o.item.state||'intact')}" data-footprint="${box.join(' ')}" pointer-events="none" transform="translate(${x} ${y}) scale(${scale})"><g transform="translate(${o.dx} ${o.dy}) scale(${o.magnify})">${namespaceArt(o.node.svg,prefix)}</g></g>`;
 }
 for(const o of layout.objects)if(o.item.state&&o.item.state!=='intact'){const b=footprints.find(f=>f.id===o.item.id)?.bounds;if(b)markup+=`<g pointer-events="none"><title>${escapeXML(o.item.name+' · '+o.item.state)}</title><path d="M${b[0]} ${b[1]}l8 8m-8 0l8 -8" stroke="#783d45" stroke-width="2"/></g>`;}
 const placed=placeExtraProps(place,prefix,room,layout.extra,door,footprints);
 markup+=placed.svg;footprints.push(...placed.footprints);
 return {svg:markup,footprints,scale};
}

function largeFurniture(item,name,asset){
 return asset?.mount!=='wall'&&/table|desk|cabinet|cupboard|bookcase|shelf|shelves|storage|bed|sofa|counter|bench|bàn|tủ|kệ|giường|ghế băng/.test(key(item+' '+name));
}
function placeExtraProps(place,prefix,room,props,door,base){
 const footprints=[],occupied=base.map(f=>f.bounds),diagnostics=place.inventory.diagnostics;
 let svg='';const candidates=[];
 for(let y=room.y+18;y<room.y+room.h-25;y+=28)for(let x=room.x+18;x<room.x+room.w-25;x+=28)candidates.push({x,y});
 const overlap=(a,b)=>a[0]<b[0]+b[2]+4&&a[0]+a[2]+4>b[0]&&a[1]<b[1]+b[3]+4&&a[1]+a[3]+4>b[1];
 const valid=box=>box[0]>=room.x+26&&box[1]>=room.y+8&&box[0]+box[2]<=room.x+room.w-8&&box[1]+box[3]<=room.y+room.h-46&&(!room.circular||[[0,0],[1,0],[0,1],[1,1]].every(([u,v])=>Math.hypot(box[0]+box[2]*u-room.x-room.w/2,box[1]+box[3]*v-room.y-room.h/2)<room.w/2-8))&&(!door||!overlap(box,door.ln.axis==='H'?[door.at-door.width/2-8,door.ln.at-26,door.width+16,52]:[door.ln.at-26,door.at-door.width/2-8,52,door.width+16]));
 for(const [i,prop]of props.entries()){
  const matches=Object.values(CATALOG).filter(a=>key(a.name)===key(prop.name)||a.aliases?.some(n=>key(n)===key(prop.name)));
  const asset=CATALOG[prop.item||propAliases[key(prop.name)]]||(matches.length===1?matches[0]:null);
  const ref=asset?.occupancy,vb=ref?[ref.x,ref.y,ref.width,ref.height]:asset?.viewBox||[0,0,40,40];
  const mount=prop.mount||(prop.zone==='surface'?'surface':asset?.mount)||'floor';const surfaces=base.filter(f=>f.surface&&/table|desk|counter|bàn/.test(key(f.item+' '+f.name)));const parent=prop.parentId?base.find(f=>f.id===prop.parentId):surfaces.length===1?surfaces[0]:null;
  const desired=zonePoint([room.x,room.y,room.w,room.h],prop.zone);
  const count=Number.isInteger(prop.count)&&prop.count>=0?prop.count:1;
  let drawn=0;
  for(let n=0;n<count;n++){
   const width=largeFurniture(prop.item||'',prop.name,asset)?48:22,height=width*Math.min(2,Math.max(.3,vb[3]/Math.max(vb[2],1)));
   let box;
   if(mount==='surface'||prop.parentId){
    if(!parent||!parent.surface){diagnostics.push('unresolved-surface:'+prop.name);break;}
    const [x,y,w,h]=parent.bounds;box=[x+w*.2+n*width,y+h*.2,width,height];
    if(box[0]+width>x+w||box[1]+height>y+h)break;
   }else{
    const ordered=[...candidates].sort((a,b)=>Math.hypot(a.x-desired.x,a.y-desired.y)-Math.hypot(b.x-desired.x,b.y-desired.y));
    const point=ordered.find(p=>{const b=[p.x,p.y,width,height];return valid(b)&&!occupied.some(o=>overlap(b,o))&&(mount!=='wall'||Math.min(p.x-room.x,room.x+room.w-p.x,p.y-room.y,room.y+room.h-p.y)<45);});
    if(!point)break;box=[point.x,point.y,width,height];
   }
   occupied.push(box);const id=prop.id+':'+n;
   footprints.push({id,name:prop.name,item:prop.item,bounds:box,blocksActor:mount==='floor'&&largeFurniture(prop.item||'',prop.name,asset),surface:asset?.surface});
   if(asset&&!prop.informationOnly)svg+=`<svg data-rp-instance="${escapeXML(id)}" data-state="${escapeXML(prop.state||'intact')}" pointer-events="none" x="${box[0]}" y="${box[1]}" width="${box[2]}" height="${box[3]}" viewBox="${vb.join(' ')}" overflow="visible"><title>${escapeXML(prop.name)}</title>${namespaceArt(asset.svg.replace(/^<svg\b[^>]*>/,'').replace(/<\/svg>\s*$/,''),prefix+'extra'+i+'-'+n+'-')}</svg>`;
   else svg+=`<g data-prop-fallback="true" pointer-events="none"><path d="M${box[0]+11} ${box[1]}l11 11 -11 11 -11 -11Z" fill="#d8c6a6" stroke="#8d7658"/><title>${escapeXML(prop.name)}</title></g>`;
   drawn++;
  }
  if(drawn<count){diagnostics.push('prop-detail-only:'+prop.name+':'+(count-drawn));svg+=`<g data-prop-summary="true" pointer-events="none"><circle cx="${room.x+room.w-16}" cy="${room.y+16}" r="6" fill="#a18b6b"/><title>${escapeXML(prop.name)} × ${count-drawn} — Inspector</title></g>`;}
 }
 return{svg,footprints};
}
