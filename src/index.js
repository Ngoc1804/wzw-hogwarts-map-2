// P1 bootstrap only. P2 owns the full contract and resolver.
function showError(error){put('#place-title','Không dựng được bản đồ');put('#observation',error.message);root.dataset.status='error';}
async function boot(){
 try{
  let input=window.MAP_DATA;
  const transport=document.getElementById('map-data');
  if(transport){try{input=JSON.parse(transport.textContent)}catch{throw Error('MAP_DATA chưa đầy đủ hoặc JSON không hợp lệ.')}}
  if(!input||typeof input!=='object'||Array.isArray(input))throw Error('Thiếu MAP_DATA.');
  if(!window.WZW_TEMPLATE_PACK)throw Error('Không tải được templates pack.');
  if(!input.atlasAnchor)throw Error('P1 cần atlasAnchor của một Fixed; resolver đầy đủ thuộc P2/P3.');
  const bytes=Uint8Array.from(atob(window.WZW_TEMPLATE_PACK),c=>c.charCodeAt(0));
  DATA=JSON.parse(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text());
  if(!DATA.maps[input.atlasAnchor])throw Error('Fixed chưa được hỗ trợ: '+input.atlasAnchor);
  if(input.actors?.length||input.events?.length||input.places?.length)throw Error('P1 chưa hỗ trợ nội dung RP chi tiết; chờ contract/resolver P2/P3.');
  window.MAP_DATA=input;bindUI();await setTemplate(input.atlasAnchor);
  if(input.meta?.areaName)put('#zone',input.meta.areaName);
  if(input.meta?.quote)document.querySelector('.quote').textContent=input.meta.quote;
  root.dataset.status='ready';root.dataset.renderMs=String(performance.now()-window.WZW_START);
 }catch(error){showError(error);}
}
if(!window.WZW_BOOT){window.WZW_BOOT=true;boot();}
