function resolve(d){
 const diagnostics=d.diagnostics;
 const seenNames=new Set();for(const p of d.places){if(seenNames.has(key(p.name)))diagnostics.push('duplicate-place-name:'+p.name);seenNames.add(key(p.name));}
 let cluster=ATLAS.clusters[d.atlasAnchor],fixedId=Object.hasOwn(DATA.maps,d.atlasAnchor)?d.atlasAnchor:null;
 if(!fixedId&&cluster&&!cluster.rooms.length&&cluster.pointers.length===1&&DATA.maps[cluster.pointers[0]])fixedId=cluster.pointers[0];
 const sandbox=d.forceSandbox||(['h1','h2'].includes(fixedId)&&d.places.some(p=>p.isNewConstruction));
 const source=sandbox?null:fixedId?DATA.maps[fixedId]:null;
 let places=source?source.places.map(p=>({...p})):!sandbox&&cluster?cluster.rooms.map(p=>({...p})):[];
 const bindings={},used=new Set(),unresolved=[];
 const aliases={'great hall':'đại sảnh','honeydukes':'tiệm công tước mật','three broomsticks':'quán ba cây chổi thần','borgin & burkes':'tiệm borgin và burkes'};
 const exact=ref=>{
  if(!ref)return null;
  const bound=bindings[ref];if(bound)return places.find(p=>p.id===bound)||null;
  const byId=places.filter(p=>p.id===ref);if(byId.length===1)return byId[0];
  const canonical=aliases[key(ref)]||key(ref),hits=places.filter(p=>key(p.name)===canonical);
  return hits.length===1?hits[0]:null;
 };
 const locate=p=>{
  if(p.id){const hit=places.find(x=>x.id===p.id);if(hit){if(key(hit.name)!==key(p.name))diagnostics.push('place-id-name-conflict:'+p.id);return hit;}}
  const hit=exact(p.name);if(hit&&p.id)diagnostics.push('place-id-fallback:'+p.id);return hit;
 };
 // Reserve explicitly addressed houses before allocating AU entries. Stable ordering avoids payload-order reshuffles.
 for(const p of d.places){const hit=locate(p);if(hit)used.add(hit.id);}
 const sorted=[...d.places].sort((a,b)=>key(a.id||a.name).localeCompare(key(b.id||b.name)));
 for(const p of sorted){
  let match=locate(p);
  if(!match&&source&&['village-static','diagon-knockturn'].includes(fixedId)&&/shop|store|pub|cafe|house|home|tiệm|quán|nhà/.test(key(p.type)+' '+key(p.name))){
   const region=p.region||d.region;
   if(fixedId==='diagon-knockturn'&&!['diagon','knockturn'].includes(region))diagnostics.push('missing-alley-region:'+p.name);
   const pool=places.filter(x=>/^Nhà dân(?:\b|\s|$)/i.test(x.name)&&!used.has(x.id)&&(fixedId==='village-static'||region==='diagon'&&x.id.startsWith('da-')||region==='knockturn'&&x.id.startsWith('ka-'))).sort((a,b)=>a.id.localeCompare(b.id));
   if(pool.length){match=pool[0];used.add(match.id);}else diagnostics.push('no-empty-house-binding:'+p.name);
  }
  if(match){bindings[p.name]=match.id;if(p.id)bindings[p.id]=match.id;Object.assign(match,p,{id:match.id,desc:p.description||match.desc});}
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
 return {source,fixedId:source?fixedId:null,cluster:sandbox?null:cluster,places,bindings,unresolved,diagnostics,detail:false,route:source?'fixed':cluster&&!sandbox?'atlas':'sandbox',exact};
}
