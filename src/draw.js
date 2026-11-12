const escapeXML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function namespaceArt(markup,prefix){return markup.replace(/(?:^|\s)id="([^"]+)"/g,(_,id)=>` id="${prefix}${id}"`).replace(/url\(#([^)]+)\)/g,(_,id)=>`url(#${prefix}${id})`).replace(/href="#([^"]+)"/g,(_,id)=>`href="#${prefix}${id}"`);}
function drawFurniture(place,prefix){const inventory=place.inventory||composeRoom(place),art=P4_ART[inventory.recipeId];const nodes=new Map((art?.objects||[]).map(x=>[x.id,x.svg]));let svg=art?namespaceArt(art.defs,prefix):'',extra=[];
 for(const item of inventory.objects){const node=nodes.get(item.id);if(node){svg+=`<g data-instance="${escapeXML(item.id)}" data-state="${escapeXML(item.state||'intact')}" pointer-events="none">${namespaceArt(node,prefix)}</g>`;if(item.state)extra.push({...item,name:item.name+' · '+item.state,informationOnly:true});}else if(item.source==='rp')extra.push(item);}
 return {svg,extra,art};}
