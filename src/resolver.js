function resolve(d){
 const diagnostics=d.diagnostics;
 const seenNames=new Set();for(const p of d.places){if(seenNames.has(key(p.name)))diagnostics.push('duplicate-place-name:'+p.name);seenNames.add(key(p.name));}
 let cluster=ATLAS.clusters[d.atlasAnchor],fixedId=Object.hasOwn(DATA.maps,d.atlasAnchor)?d.atlasAnchor:null;
 if(!fixedId&&cluster&&!cluster.rooms.length&&cluster.pointers.length===1&&DATA.maps[cluster.pointers[0]])fixedId=cluster.pointers[0];
 const sandbox=d.forceSandbox||(['h1','h2'].includes(fixedId)&&d.places.some(p=>p.isNewConstruction));
 const source=sandbox?null:fixedId?DATA.maps[fixedId]:null;
 let places=source?source.places.map(p=>({...p})):!sandbox&&cluster?cluster.rooms.map(p=>({...p})):[];
 const bindings={},used=new Set(),unresolved=[];
 // World registry selects one focus building, never every site in a macro region.
 let worldSite=null,worldMode=null;
 const fold=v=>key(v).replace(/[’']/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
 const worldRef=ref=>{let label=fold(ref);for(const alias of [...(worldSite?.aliases||[])].sort((a,b)=>b.length-a.length)){const a=fold(alias);if(label.startsWith(a+' ')){label=label.slice(a.length+1);break;}}const level=label.match(/^(g|f\d+)(?: |$)/)?.[1]?.toUpperCase();return{label:level?label.replace(/^(g|f\d+) ?/,''):label,level};};
 if(!source&&!sandbox&&cluster?.rpScope&&cluster.sites){
  const pcInput=d.places.find(p=>p.id===d.pcPlace||key(p.name)===key(d.pcPlace));
  const refs=[d.pcPlace,text(d.meta.areaName),pcInput?.name].filter(Boolean);
  for(const ref of refs){
   const label=fold(ref);
   const candidates=cluster.sites.filter(site=>site.aliases.some(alias=>{const a=fold(alias);return label===a||label.startsWith(a+' ')||label.endsWith(' '+a);}));
   if(candidates.length===1){worldSite=candidates[0];break;}
   if(candidates.length>1){diagnostics.push('ambiguous-world-site:'+ref);break;}
  }
  if(worldSite){
   const {label:roomLabel,level:explicitLevel}=worldRef(d.pcPlace);
   const focus=worldSite.rooms.filter(room=>fold(room.name)===roomLabel&&(!explicitLevel||room.level===explicitLevel));
   const level=explicitLevel||(focus.length===1?focus[0].level:null);
   if(focus.length===1)worldMode=focus[0].type?.startsWith('OUT_')?'outdoor':'indoor';
   places=worldSite.rooms.filter(room=>(!room.conditional||focus.includes(room))&&(!level||room.level===level)).map(room=>({...room}));
   if(focus.length===1)bindings[d.pcPlace]=focus[0].id;
   if(!places.length)places=[{id:worldSite.id,name:worldSite.name,desc:'',type:''}];
  }
 }
 const exact=(ref,region=d.region)=>{
  if(!ref)return null;
  const bound=bindings[ref];if(bound)return places.find(p=>p.id===bound)||null;
  if(worldSite){const r=worldRef(ref),hits=places.filter(p=>fold(p.name)===r.label&&(!r.level||p.level===r.level));if(hits.length===1)return hits[0];}
  const byId=places.filter(p=>p.id===ref);if(byId.length===1)return byId[0];
  const canonical=key(ref),hits=places.filter(p=>key(p.name)===canonical||p.aliases?.some(a=>key(a)===canonical)||ATLAS.fixed[fixedId]?.places.find(x=>x.id===p.id)?.aliases?.some(a=>key(a)===canonical));
  if(hits.length>1&&fixedId==='diagon-knockturn'&&['diagon','knockturn'].includes(region)){const scoped=hits.filter(p=>p.id.startsWith(region==='diagon'?'da-':'ka-'));return scoped.length===1?scoped[0]:null;}
  return hits.length===1?hits[0]:null;
 };
 const locate=p=>{
  if(p.id){const hit=places.find(x=>x.id===p.id);if(hit){if(key(hit.name)!==key(p.name))diagnostics.push('place-id-name-conflict:'+p.id);return hit;}}
  const hit=exact(p.name,p.region||d.region);if(hit&&p.id)diagnostics.push('place-id-fallback:'+p.id);return hit;
 };
 // Reserve explicitly addressed houses before allocating AU entries. Stable ordering avoids payload-order reshuffles.
 for(const p of d.places){const hit=locate(p);if(hit)used.add(hit.id);}
 for(const ref of [d.pcPlace,...d.actors.map(a=>a.placeId||a.placeName),...d.events.map(e=>e.placeId||e.placeName)]){const hit=exact(ref);if(hit)used.add(hit.id);}
 const sorted=[...d.places].sort((a,b)=>key(a.id||a.name).localeCompare(key(b.id||b.name)));
 for(const p of sorted){
  let match=locate(p);
  if(!match&&source&&['village-static','diagon-knockturn'].includes(fixedId)&&/shop|store|pub|cafe|house|home|tiệm|quán|nhà/.test(key(p.type)+' '+key(p.name))){
   const region=p.region||d.region;
   if(fixedId==='diagon-knockturn'&&!['diagon','knockturn'].includes(region))diagnostics.push('missing-alley-region:'+p.name);
   const pool=places.filter(x=>/^Nhà dân(?:\b|\s|$)/i.test(x.name)&&!used.has(x.id)&&(fixedId==='village-static'||region==='diagon'&&x.id.startsWith('da-')||region==='knockturn'&&x.id.startsWith('ka-'))).sort((a,b)=>a.id.localeCompare(b.id));
   if(pool.length){match=pool[0];used.add(match.id);}else diagnostics.push('no-empty-house-binding:'+p.name);
  }
  if(match){bindings[p.name]=match.id;if(p.id)bindings[p.id]=match.id;Object.assign(match,p,{id:match.id,desc:p.description||match.desc,...(source?{x:match.x,y:match.y}:{})});}
  else if(source){unresolved.push(p);diagnostics.push('unresolved-fixed-place:'+p.name);}
  else{
   const duplicate=places.some(x=>key(x.name)===key(p.name));
   if(duplicate){unresolved.push(p);diagnostics.push('ambiguous-place:'+p.name);continue;}
   places.push({...p,id:p.id||'rp:'+key(p.name),desc:p.description});
  }
 }
 // New RP places are allowed in Generated, but an invalid ID must not become a fictitious named room.
 for(const ref of [d.pcPlace,...d.actors.filter(a=>!a.isPC).map(a=>a.placeId||a.placeName),...d.events.map(e=>e.placeId||e.placeName)].filter(Boolean)){
  if(exact(ref))continue;
  const actor=d.actors.find(a=>a.placeId===ref),event=d.events.find(e=>e.placeId===ref);
  const name=actor?.placeName||event?.placeName||ref;
  const hit=exact(name);if(hit){bindings[ref]=hit.id;diagnostics.push('reference-name-fallback:'+ref);continue;}
  if(source){diagnostics.push('unresolved-location:'+ref);continue;}
  if(d.actors.some(a=>a.placeId===ref&&!a.placeName)||d.events.some(e=>e.placeId===ref&&!e.placeName)){diagnostics.push('unresolved-location:'+ref);continue;}
  if(places.some(p=>key(p.name)===key(name))){diagnostics.push('ambiguous-location:'+ref);continue;}
  places.push({id:'rp:'+key(name),name,desc:''});
 }
 for(const place of places)place.inventory=source?{objects:[],diagnostics:[],illustrative:false}:composeRoom(place);
 if(!places.length)places.push({id:'context',name:d.meta.areaName||'Không gian RP',desc:''});
 return {worldSite,mapMode:worldMode,source,fixedId:source?fixedId:null,cluster:sandbox?null:cluster,places,bindings,unresolved,diagnostics,detail:false,route:source?'fixed':cluster&&!sandbox?'atlas':'sandbox',exact};
}
