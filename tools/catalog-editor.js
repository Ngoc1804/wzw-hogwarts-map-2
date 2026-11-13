// Offline editor embedded by asset-review.py; never mutates the repository or Fixed.
const originals=new Map(DATA.assets.map(a=>[a.id,a.svg])),undoById=new Map();
let editingId=null;
const paintPattern=()=>/(\b(?:fill|stroke|stop-color|flood-color|color)=["']|(?:fill|stroke|stop-color|flood-color|color)\s*:\s*)(#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b)/g;
const swatches=svg=>[...new Set([...svg.matchAll(paintPattern())].map(m=>m[2].toLowerCase()))];
function normalizeHex(c){return c.length===4?'#'+[...c.slice(1)].map(x=>x+x).join(''):c;}
function replacePaint(svg,from,to){return svg.replace(paintPattern(),(all,prefix,c)=>c.toLowerCase()===from?prefix+to:all);}
function remember(a){const stack=undoById.get(a.id)||[];stack.push(a.svg);undoById.set(a.id,stack);}
function refreshPreview(a){document.querySelector('.detail-img').src=src(a.svg);document.querySelector('#edit-status').textContent='Đã đổi trong bản xem. Bấm “Tải HTML đã chỉnh” để lưu thành file.';}
const viewAsset=detail;
detail=function(id){viewAsset(id);editingId=id;const a=DATA.assets.find(a=>a.id===id);const box=document.createElement('section');box.id='paint-editor';box.innerHTML='<h3>Chỉnh màu asset này</h3><p>Chọn ô màu để đổi trực tiếp, gồm màu chuyển gradient và nét. Các phần đang dùng cùng mã màu sẽ đổi cùng nhau.</p><div id="paint-swatches" style="display:flex;flex-wrap:wrap;gap:12px"></div><p id="edit-status" role="status">Chưa lưu ra file. Tải HTML đã chỉnh để giữ thay đổi khi mở lại.</p><button id="paint-undo">Hoàn tác</button> <button id="paint-reset">Về màu lúc mở file</button>';
 document.querySelector('#detail-body').append(box);
 function controls(){const target=document.querySelector('#paint-swatches');target.replaceChildren();for(const color of swatches(a.svg)){let current=color;const label=document.createElement('label');label.style.cssText='display:grid;gap:5px;font:12px monospace';const input=document.createElement('input');input.type='color';input.value=normalizeHex(color);input.setAttribute('aria-label','Đổi màu '+color);input.style.cssText='width:70px;height:44px;padding:3px';const code=document.createElement('span');code.textContent=color;input.oninput=()=>{remember(a);a.svg=replacePaint(a.svg,current,input.value);current=input.value;code.textContent=current;refreshPreview(a)};label.append(input,code);target.append(label)}}
 controls();document.querySelector('#paint-undo').onclick=()=>{const previous=undoById.get(id)?.pop();if(previous!==undefined){a.svg=previous;refreshPreview(a);controls()}};document.querySelector('#paint-reset').onclick=()=>{remember(a);a.svg=originals.get(id);refreshPreview(a);controls()};
};
const priorClose=document.querySelector('#close').onclick;document.querySelector('#close').onclick=()=>{priorClose();render()};
const exportHTML=document.createElement('button');exportHTML.id='export-html';exportHTML.textContent='Tải HTML đã chỉnh';document.querySelector('.controls').append(exportHTML);
exportHTML.onclick=()=>{const clone=document.documentElement.cloneNode(true);clone.querySelector('#catalog-data').textContent=JSON.stringify(DATA).replace(/</g,'\\u003c');clone.querySelectorAll('dialog').forEach(d=>d.removeAttribute('open')); // runtime-generated controls are recreated at startup
 clone.querySelector('#export-html')?.remove();clone.querySelector('#detail-body').replaceChildren();
 save('<!doctype html>'+clone.outerHTML,'WIZAMAP-assets-da-chinh-mau.html','text/html;charset=utf-8');};
window.addEventListener('beforeunload',e=>{if(DATA.assets.some(a=>a.svg!==originals.get(a.id))){e.preventDefault();e.returnValue=''}});
