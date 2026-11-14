let sceneData=null;const runtimeShell=root.innerHTML;
function inventoryNote(code){
 if(code.startsWith('unresolved-child:'))return 'Chưa xác định duy nhất món trong cụm; hình món đó được giữ nguyên.';
 if(code.startsWith('unknown-parent:'))return 'Chưa xác định cụm đồ cần chỉnh; thay đổi chưa được áp vào hình.';
 if(code.startsWith('child-count-summary:'))return 'Cụm có nhiều món: hình vẽ rút gọn, tổng số vẫn giữ trong thông tin bên dưới.';
 if(code.startsWith('unresolved-support:'))return 'Chưa xác định đúng vật/vùng đỡ được RP yêu cầu; giữ nhãn thông tin, chưa xác nhận vị trí đứng trên đó.';
 if(code.startsWith('unresolved-surface:'))return 'Chưa xác định mặt đỡ phù hợp để đặt món đồ.';
 if(code.startsWith('invalid-visual:'))return 'Hình được cung cấp không dùng được; món đồ vẫn có đại diện thay thế.';
 if(code.startsWith('prop-detail-only:')||code.startsWith('outdoor-count-summary:'))return 'Một phần đồ được biểu diễn rút gọn; số lượng đầy đủ vẫn giữ trong thông tin.';
 return 'Có thay đổi đồ vật chưa xác định rõ để áp vào hình; nội dung RP vẫn được giữ.';
}
function inspect(place){put('#place-title',place?.name||sceneData.pcPlace||sceneData.meta.areaName);put('#activity',place?.overhear||'');put('#observation',[place?.description||place?.desc,...(sceneData.unresolvedPlaces||[]).map(p=>[p.name,p.description].filter(Boolean).join(" — ")),...new Set((place?.inventory?.diagnostics||[]).map(inventoryNote)),...(place?.inventory?.objects||place?.props||[]).map(p=>p.name+' × '+(p.count??1)+(p.state?' · '+p.state:'')+(p.childChanges?.length?' ['+p.childChanges.map(c=>(c.name||c.childId)+' × '+c.count+(c.state?' '+c.state:'')).join('; ')+']':''))].filter(Boolean).join('\n'));const actors=$('#actors');actors.replaceChildren();for(const a of groupRoomActors(sceneData.actors).filter(a=>!place||a.unresolvedAnchor||!a.placeId||a.placeId===place.id||key(a.placeName)===key(place.name))){const row=actorTag(a,true);row.onclick=()=>{showActorDetails(a,place)};actors.append(row);}const events=sceneData.events.filter(e=>!place||!e.placeId||e.placeId===place.id||key(e.placeName)===key(place.name));$('#quests').replaceChildren();put('#hintcount',String(events.length));for(const e of events){const row=document.createElement('button');row.className='event-row';row.textContent=e.title;row.onclick=()=>{put('#place-title',e.title);put('#observation',e.detail||'')};$('#quests').append(row);}}
async function renderInput(input){const renderStart=performance.now();root.parentElement.querySelectorAll('[data-rp-detail]').forEach(e=>e.remove());sceneData=normalize(input);const d=sceneData;
 if(d.fatal){window.WZW_SCENE=null;presentation?.dispose();stopScene();$("#mapmount").replaceChildren();put("#observation",d.diagnostics.join("\n"));root.dataset.status="invalid-data";return null;}
 if(!window.WZW_ORIGINAL_MAPS)window.WZW_ORIGINAL_MAPS=structuredClone(DATA.maps);DATA.maps=structuredClone(window.WZW_ORIGINAL_MAPS);
 const scene=resolve(d);d.unresolvedPlaces=scene.unresolved;let mapId=scene.source?scene.fixedId:'rp-scene';if(scene.source){DATA.maps[mapId].places=scene.places.filter(p=>scene.source.places.some(x=>x.id===p.id));}else DATA.maps[mapId]=buildMap(scene,d);
 await setTemplate(mapId);
 async function mount(){DATA.maps[activeId].actorPoints=[];for(const a of d.actors){const place=scene.exact(a.placeId||a.placeName);a.placeId=place?.id;if(a.isPC){a.placeName=d.pcPlace;a.placeId=scene.exact(d.pcPlace)?.id;a.spot=d.pcSpot||a.spot;}a.inside=a.spot==='inside';a.scenePoint=undefined;a.unresolvedAnchor=false;const resolved=scene.exact(a.placeId||a.placeName);a.hearingText=resolved?.overhear||'';if(!resolved)a.unresolvedAnchor=true;const map=DATA.maps[activeId];if(!scene.source&&resolved){a.scenePoint=generatedActorPoint(map,resolved,a.spot,a);if(!a.scenePoint)a.unresolvedAnchor=true;else if(a.scenePoint.anchorOnly||a.scenePoint.noFeet)a.footstep='hidden';}/* Footstep visibility follows the active map's presentation policy. */}for(const e of d.events)e.placeId=scene.exact(e.placeId||e.placeName)?.id;await presentation.mountActors(d.actors.filter(a=>a.placeId&&!a.unresolvedAnchor));presentation.mountEvents(d.events.filter(e=>e.placeId));svg.addEventListener('wzw-place-selected',e=>inspect(scene.places.find(p=>p.id===e.detail.id)));inspect(scene.exact(d.pcPlace));}
 await mount();put('#place-area',scene.source?'BẢN ĐỒ CỐ ĐỊNH':'KHÔNG GIAN RP');for(const [selector,value]of [['#zone',d.meta.areaName],['.quote',d.meta.quote],['.date',d.meta.date],['.clock',d.meta.time]]){const el=$(selector);if(el)el.textContent=value||'';}
 root.dataset.status='ready';root.dataset.renderMs=String(performance.now()-renderStart);window.WZW_SCENE={...scene,rendered:{kind:DATA.maps[activeId].kind,geometry:DATA.maps[activeId].geometry,footprints:DATA.maps[activeId].footprints},diagnostics:d.diagnostics};return scene;}
let renderQueue=Promise.resolve(),initialized=false;
function enqueue(input){const task=renderQueue.then(()=>renderInput(input));renderQueue=task.catch(()=>{});return task;}
function transportError(message,status='incomplete'){
 presentation?.dispose();stopScene();window.WZW_SCENE=null;sceneData=null;
 root.replaceChildren();const p=document.createElement('p');p.setAttribute('role','alert');p.textContent=message;root.append(p);root.dataset.status=status;
}
async function initialize(){if(initialized)return;
 if(!window.WZW_TEMPLATE_PACK)throw Error('Template pack unavailable');
 const b=Uint8Array.from(atob(window.WZW_TEMPLATE_PACK),c=>c.charCodeAt(0));
 DATA=JSON.parse(await new Response(new Blob([b]).stream().pipeThrough(new DecompressionStream('gzip'))).text());
 if(!document.getElementById("mapmount"))root.innerHTML=runtimeShell;bindUI();initialized=true;
}
async function boot(){let input=window.MAP_DATA;
 try{const t=document.getElementById('map-data');if(t)input=JSON.parse(t.textContent)}
 catch{transportError('MAP_DATA sai JSON hoặc bị cắt. Chưa dựng cảnh RP.');return;}
 try{if(window.WZW_LOAD_FAILED)throw Error('Không tải được CSS hoặc template pack');await initialize();window.MAP_DATA=input;await enqueue(input)}
 catch(error){transportError('Không thể mở bản đồ: '+error.message,'text-fallback');}
}
window.WZWMap={normalize,composeRoom,render:async input=>{await window.WZWMap.ready;
 if(!initialized)await initialize();
 window.MAP_DATA=input;return enqueue(input)}};
if(!window.WZW_BOOT){window.WZW_BOOT=true;window.WZWMap.ready=boot();}
