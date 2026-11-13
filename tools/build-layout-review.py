from pathlib import Path
import json,re,gzip,base64
ROOT=Path(__file__).resolve().parents[1]
src=ROOT/'assets/intake/final-2026-11-14/WIZAMAP_LAYOUTS_FINAL.html'
s=src.read_text();m=re.search(r'(<script[^>]*id="pack"[^>]*>)(.*?)(</script>)',s,re.S)
p=json.loads(gzip.decompress(base64.b64decode(m[2])));c=p['code']
# The special master floor also contained an entry/name-strip stub; keep only the three chambers.
master=p['data']['master']
master['d']=master['d'].replace('v-53.24906h74v53.24906','a210,210 0 0 1 74,0')
import math
points=master['points'];start=next(i for i,xy in enumerate(points) if xy[1]<53.3);end=next(i for i in range(start,len(points)) if points[i][0]>487 and points[i][1]>53.3)
master['points']=points[:start]+[[450+210*math.cos(math.radians(deg)),260+210*math.sin(math.radians(deg))] for deg in range(-100,-79,2)]+points[end:]

c=c.replace('h.height=80,h.decor=', 'h.height=40,h.decor=').replace('s("show-front").checked','true')
# Remove the reference editor's hall/name-strip geometry, not merely its text.
c=c.replace('halls:[c(0,r,e,90,{kind:"hall"})]', 'halls:[]')
c=c.replace('r+h.height+160', 'r+h.height+80')
c=c.replace('e+=D(413,0,74,94,"url(#floor-slate)"),','')
c=c.replace('if(a[1]<95&&l[1]<95)continue;', 'if(a[1]<60&&l[1]<60&&a[0]>=420&&a[0]<=480&&l[0]>=420&&l[0]<=480)continue;')
needle_door='for(let e of o.openings.doors)e.main||(e.width=t.door.width);return o'
replace_door='const entry=o.walls.find(w=>w.axis==="H"&&Math.abs(w.at-r)<.01);if(entry)o.openings.doors=[{kind:"door",ln:entry,at:e/2,width:t.door.width,room:t.id}];for(let e of o.openings.doors)e.main||(e.width=t.door.width);return o'
assert needle_door in c
c=c.replace(needle_door,replace_door,1)

b=p['body'].replace('value="80" aria-label="Cao tường"','value="40" readonly aria-label="Cao tường"').replace('SIZE MINH HỌA','S/M/L ĐẶT SẴN · H40').replace('Nhấp đồ vật để xem ID.','Nhấp phòng hoặc đồ vật để xem thông tin tại đây.')
b=b.replace('<button id="fit">','<label>Size <select id="review-size" aria-label="Size S M L"><option>S</option><option selected>M</option><option>L</option></select></label><button id="fit">')
b=b.replace('id="size-small">Gọn','id="size-small">S').replace('id="size-default">Chuẩn','id="size-default">M').replace('id="size-large">Rộng','id="size-large">L')
b=b.replace('id="room-width" type="number"','id="room-width" readonly type="number"').replace('id="room-depth" type="number"','id="room-depth" readonly type="number"')
b=b.replace('41 INDOOR · 8 OUTDOOR · OFFLINE','BẢN DUYỆT · 49 LAYOUT × S/M/L · H40')
p['body']=b;p['css']+='\n#toast{display:none!important}#wall-height{pointer-events:none}.toolbar label{display:flex;align-items:center;gap:8px}.preset-size-note{font-size:12px;color:#806c55}\n'
patch=r'''
// Review-only revision of the supplied FINAL file. No main-repository publishing.
const REVIEW_SIZE_PROFILES={};
for(const room of _t){
 const special=room.special,round=id=>10*Math.round(id/10);
 const ratio=room.w/room.h;
 let mw=room.w,mh=room.h;
 if(!special&&!room.id.startsWith('OUT_')){
  if(['OFFICE','BEDROOM','BATHROOM','GUARDROOM','DETENTION_CELL','STORAGE'].includes(room.id)){mw=Math.max(360,room.w);mh=Math.max(320,room.h);}
  if(['LIBRARY','ARCHIVE','HOSPITAL_WARD','CLASSROOM','CEREMONY_HALL'].includes(room.id)){mw=Math.max(640,room.w);mh=Math.max(460,room.h);}
 }
 const sizes=special?{S:[.95,.95],M:[1.1,1.1],L:[1.25,1.25]}:{S:[1,1],M:[1.15,1.12],L:[1.3,1.26]};
 REVIEW_SIZE_PROFILES[room.id]=Object.fromEntries(Object.entries(sizes).map(([size,[u,v]])=>[size,{width:round(Math.max(room.minW,mw*u)),height:round(Math.max(room.minH,mh*v)),wallHeight:40}]));
}
let REVIEW_SIZE='M';
const REVIEW_WALLS={HEADMASTER_OFFICE:'panel',DIVINATION_CLASSROOM:'dark',ASTRONOMY_OBSERVATORY:'stone',PREFECTS_BATHROOM:'plaster',CHAMBER_OF_SECRETS:'dark',TOWER_CLOCKWORK:'ashlar',BALLROOM:'limestone',TROPHY_ROOM:'panel',OFFICE:'wainscot',STUDY_ROOM:'timber',LIBRARY:'panel',ARCHIVE:'ashlar',STORAGE:'rubble',WORKSHOP:'brick',BEDROOM:'wainscot',KITCHEN:'brick',BATHROOM:'plaster',LAUNDRY:'plaster',HOSPITAL_WARD:'plaster',DETENTION_CELL:'dark',SECURE_VAULT:'ashlar'};
const originalNt=Nt;
Nt=function(id,options={}){
 h.height=40;h.materials.wall=REVIEW_WALLS[id]||'stone';
 const result=originalNt(id,options);
 const parsed=new DOMParser().parseFromString(result.svg,'image/svg+xml');
 if(parsed.querySelector('parsererror'))throw Error('Invalid source SVG '+id);
 const root=parsed.documentElement;
 root.querySelectorAll('text,[data-layer="signage"]').forEach(n=>n.remove());
 if(id==='HEADMASTER_OFFICE'){
  const factor=Math.min(result.report.width/900,result.report.height/630),tx=(result.report.width-900*factor)/2,ty=(result.report.height-630*factor)/2;
  const door=parsed.createElementNS('http://www.w3.org/2000/svg','g');door.setAttribute('data-element-id','review.entry-door');door.setAttribute('data-object','Cửa vào · hướng Bắc');door.setAttribute('transform',`translate(${tx} ${ty}) scale(${factor})`);door.innerHTML='<g transform="matrix(1 0 .42 -1 450 50)"><path d="M-26 0H26V33.6H-26Z" fill="#9a734f" stroke="#5f4e3b" stroke-width="2.7"/><path d="M-22 2V26M22 2V26M0 1V30M-24 9H24M-24 23H24" fill="none" stroke="#d5b58a"/><circle cx="7" cy="16" r="1.6" fill="#dec28a"/></g>';root.append(door);result.report.door={side:'north',width:52};
 }
 root.setAttribute('data-layout',id);root.setAttribute('data-size',REVIEW_SIZE);root.setAttribute('data-wall-height','40');
 root.setAttribute('tabindex','0');root.setAttribute('aria-label',Ct(id).name+' — '+REVIEW_SIZE);
 if(!id.startsWith('OUT_'))root.setAttribute('viewBox',[-32,-56,result.report.width+80,result.report.height+96].join(' '));
 result.svg=new XMLSerializer().serializeToString(root);result.report.size=REVIEW_SIZE;result.report.wallHeight=40;
 return result;
};
window.WIZAMAP_PACK.renderRoom=Nt;
const originalEe=ee;
ee=function(id){const profile=REVIEW_SIZE_PROFILES[id][REVIEW_SIZE];originalEe(id);Ut=profile.width;Gt=profile.height;s('room-width').value=Ut;s('room-depth').value=Gt;s('review-size').value=REVIEW_SIZE;re();};
function chooseReviewSize(size){REVIEW_SIZE=size;ee(Qt);}
s('review-size').onchange=e=>chooseReviewSize(e.target.value);
s('size-small').onclick=()=>chooseReviewSize('S');s('size-default').onclick=()=>chooseReviewSize('M');s('size-large').onclick=()=>chooseReviewSize('L');
s('wall-height').value=40;s('wall-height').onchange=()=>{h.height=40;s('wall-height').value=40;re()};
s('mount').addEventListener('click',event=>{const target=event.target.closest('[data-element-id]');const room=Ct(Qt),profile=REVIEW_SIZE_PROFILES[Qt][REVIEW_SIZE];s('selection').textContent=(target?(I[target.dataset.elementId]?.name||target.dataset.object||target.dataset.elementId)+' · '+target.dataset.elementId:room.name+' · '+room.id)+' · Size '+REVIEW_SIZE+' · '+profile.width+' × '+profile.height+' · H40';});
window.WIZAMAP_PACK.sizeProfiles=REVIEW_SIZE_PROFILES;for(const room of _t){room.sizeProfiles=REVIEW_SIZE_PROFILES[room.id];room.wallHeight=40;room.wall=REVIEW_WALLS[room.id]||'stone';if(room.id==='HEADMASTER_OFFICE')room.door={side:'north',width:52};}
window.WIZAMAP_REVIEW={select:ee,size:chooseReviewSize,render(id,size='M'){REVIEW_SIZE=size;const p=REVIEW_SIZE_PROFILES[id][size];return Nt(id,{width:p.width,height:p.height,variant:Ct(id).variants[0]||''});}};
'''
# Install overrides after source definitions/handlers but before initial selection/export binding.
needle=',ee("HEADMASTER_OFFICE"),s("export-source")';assert needle in c
c=c.replace(needle,';'+patch+'\nee("HEADMASTER_OFFICE"),s("export-source")',1)
p['code']=c
encoded=base64.b64encode(gzip.compress(json.dumps(p,ensure_ascii=False,separators=(',',':')).encode(),mtime=0)).decode()
s=s[:m.start(2)]+encoded+s[m.end(2):]
(ROOT/'examples/WIZAMAP_LAYOUTS_REVIEW_H40_SML.html').write_text(s)
print('Review HTML',len(s.encode()))
