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
  if(item.state)extra.push({...item,name:item.name+' · '+item.state,informationOnly:true});
 }
 if(art?.source==='FINAL'&&objects.length){
  const minX=Math.min(0,...objects.map(o=>o.bounds[0])),minY=Math.min(0,...objects.map(o=>o.bounds[1]));
  const maxX=Math.max(art.width,...objects.map(o=>o.bounds[0]+o.bounds[2])),maxY=Math.max(art.height,...objects.map(o=>o.bounds[1]+o.bounds[3]));
  for(const o of objects){o.dx-=minX;o.dy-=minY;o.bounds[0]-=minX;o.bounds[1]-=minY;}
  return {inventory,art,objects,extra,width:maxX-minX,height:maxY-minY+50+extra.length*32};
 }
 const width=art?.width||320;
 const height=(art?.height||190)+band+50+extra.length*32;
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
  footprints.push({id:o.item.id,item:o.node.item,bounds:box});
  markup+=`<g data-instance="${escapeXML(o.item.id)}" data-state="${escapeXML(o.item.state||'intact')}" data-footprint="${box.join(' ')}" pointer-events="none" transform="translate(${x} ${y}) scale(${scale})"><g transform="translate(${o.dx} ${o.dy}) scale(${o.magnify})">${namespaceArt(o.node.svg,prefix)}</g></g>`;
 }
 for(const [i,prop]of layout.extra.entries()){
  const py=y+((layout.art?.height||190)+(layout.art?105:20)+8+i*32)*scale;
  const width=(layout.width-24)*scale;
  const asset=CATALOG[prop.item||propAliases[key(prop.name)]];
  if(asset&&!prop.informationOnly){const vb=asset.svg.match(/viewBox=["']([^"']+)/)?.[1]||'0 0 256 256';markup+=`<svg data-rp-instance="${escapeXML(prop.id)}" data-catalog-asset="${escapeXML(asset.id)}" x="${x+12*scale}" y="${py}" width="${width}" height="${25*scale}" viewBox="${vb}" preserveAspectRatio="xMidYMid meet">${namespaceArt(asset.svg.replace(/^<svg\b[^>]*>/,'').replace(/<\/svg>\s*$/,''),prefix+'extra'+i+'-')}</svg>`;continue;}
  markup+=`<g data-prop-fallback="true" pointer-events="none"><rect x="${x+12*scale}" y="${py}" width="${width}" height="${25*scale}" rx="2" fill="#eee2cb" stroke="#a18b6b" stroke-width=".6"/><text x="${x+18*scale}" y="${py+17*scale}" fill="#49362b" font-size="${Math.max(8,12*scale)}">${escapeXML(prop.name)}${prop.informationOnly?'':' × '+prop.count}</text></g>`;
 }
 return {svg:markup,footprints,scale};
}
