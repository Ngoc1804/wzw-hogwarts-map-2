"""Generate compact Gemini routing/function vocabulary; full Atlas stays in GitHub."""
from pathlib import Path
import json,re,os
os.chdir(Path(__file__).resolve().parents[1])
atlas=json.load(open('assets/atlas.json'));vocab=json.load(open('assets/vocabulary.json'))
s='''#### W4.1 — SPACE / ATLAS
Flow: vị trí PC → owner/khu hiện tại → Fixed hoặc Generated. Fixed gửi đúng template ID; cụm đã có gửi ID cụm, runtime lấy đủ phòng nền. Custom gửi layout + places theo thứ tự bố trí, type công năng, props/zone khi cần. Không cần ID từng element hoặc chép lại phòng trong Fixed. Phòng mới/vật mới từ RP luôn hợp lệ; hình học chỉ minh họa, không tự tạo canon.

FIXED (13):
- h1: ngoại cảnh Hogwarts–Hogsmeade ngoài khuôn viên; rừng, hồ, Hagrid/nhà kính và nội thất của chúng, ngoại ô/Sirius's Cave. Trừ làng, sân Quidditch, ga và H2.
- h2: khuôn viên/cổng/sân/cầu lâu đài, toàn bộ Owlery; trừ nội thất lớp/tháp khác và sân trong riêng hall.
- hall: Đại Sảnh/cụm F1 S/W liên quan và sân trong riêng; không chiếm cả F1.
- gryffindor-common, ravenclaw-common, hufflepuff-common, slytherin-common: khu sinh hoạt/ký túc tương ứng.
- village-static: trong làng Hogsmeade, mọi nhà/tiệm/phòng; ngoài làng→h1.
- pitch-static: trong sân Quidditch và phòng phụ; ngoài sân→h1.
- express: trong ga/sân ga hoặc đã lên tàu; giữ đúng vị trí ga/toa, đường tới ga→h1 hoặc World.
- diagon-knockturn: hai hẻm và mọi nhà/tiệm/phòng; ngoài hẻm→LONDON.
- ministry2: Bộ L1–7; ministry-8-10: L8–10, Commission chưa gán tầng.

HOGWARTS NON-FIXED: F1=Ground Floor, F1–F8 giữ số nguồn. Mỗi ô dưới là ID/layout; ID phòng/mã nguồn HN/B/Đ/N/T và danh sách đầy đủ nằm ở GitHub. N/E/S/W không gộp; pointer không nhân phòng. PC ở phòng nào thì pcPlace nêu đúng phòng đó; không đổi corridor/threshold thành inside.
|Tầng|N|E|S|W|
|---|---|---|---|---|
'''
short={'horizontal':'horizontal','vertical':'vertical','windows':'windows','ell':'ell','tee':'tee','cross':'cross','court':'court','cloister':'cloister','curved':'curved','tower':'tower'}
for floor in ['SUB-DUNGEONS','DUNGEONS','KITCHENS',*['F'+str(i) for i in range(1,9)]]:
 s+='|'+floor+'|'+'|'.join(f"{floor}-{d}/{atlas['clusters'][floor+'-'+d]['layout']}" for d in 'NESW')+'|\n'
s+='''Nội dung cụm theo tầng N/E/S/W: Sub-dungeons=tech/relics–Chamber/Stone trials/ancient study; Dungeons=Potions/Slytherin approach/service/subterranean classes; Kitchens=kitchen/Hufflepuff/laundry/elf–larder; F1=north–bell/library–viaduct/hall/transfiguration–quad; F2=history–transfiguration/scholars/hospital/DADA; F3=Myrtle/shortcut/classes/DADA office; F4=trophy–armour/upper gallery/clubs/Charms–forbidden route; F5=library/long gallery/Mirror route/Runes; F6=prefects–faculty/classes/clock ascent/west windows; F7=archives/seminars–labs/faculty–clock/games; F8=headmaster approach/RoR/Gryffindor/senior clubs–CCC.
Pointers: DUNGEONS-E→slytherin-common; KITCHENS-E→hufflepuff-common; F1-S→hall; F1-W chỉ điểm nối→hall; F8-S chỉ điểm nối→gryffindor-common; F8-W→au-ccc. Cụm có phòng riêng vẫn giữ đủ phòng, không đổi toàn cụm thành pointer.
Towers (ID/layout): tower-divination/tower; tower-astronomy/tower; tower-headmaster/tower; tower-clock/curved; tower-bell/tower; tower-faculty/windows; tower-dada/tee; tower-stairs/cross. Gryffindor/Ravenclaw→common tương ứng; Owlery→h2. Các tầng Entry/Base/Mid/Top giữ theo RP và nguồn, không tự đổi tầng.

WORLD (Generated, chỉ dựng scope RP đang xem): LONDON=phố/ga ngoài express và hai hẻm, St Mungo's, Grimmauld, Wool's; ENGLAND_REGIONS=Privet/Little Whinging, Ottery–Burrow/Lovegood/Diggory/Fawcett, Godric's Hollow, Hangleton, Cokeworth, Malfoy Manor, Shell Cottage/Tinworth, Budleigh, Upper Flagley, Forest of Dean, Hut-on-the-Rock và nhà khác; TRANSIT_AND_INTL=Knight Bus, Azkaban, Romanian sanctuary, Ilvermorny, MACUSA, Sea Cave, World Cup, Egyptian Tombs. Không biến cả vùng thành một phòng hay kéo mọi nơi vào map; giữ địa điểm/chi tiết RP thực tế.
AU ACTIVE: au-home=PC Home London; au-ccc=CCC 07.18 F8W; au-liad=Liad's Attic Hogwarts. LOCKED/UNBUILT: au-whitecap=Whitecap Estate; 7 Rowan Mews, WzW House Soho, Loft 5A Fitzrovia, Grayhaven California. Không mở AU từ tên; trạng thái map không phủ quyết RP cụ thể đã được phép minh họa. Nơi chưa có binding dùng custom, không từ chối sandbox.
'''
Path('docs/W4_1.md').write_text(s)
old=Path('docs/MAP_PROMPT.md').read_text();html=re.search(r'```html\n(.*?)\n```',old,re.S)[1]
head='''### R14.6 — /MAP · WZW MAP 2
On /map: accepted RP snapshot → W4.1 owner/scope → Fixed or Generated → correct IDs/function words → HTML. No time/state/quest changes, invented actors/events/routes or secrets. Return ONE complete fenced html block using the loader below, no extra prose. No GitHub fetch per turn; runtime reads the payload and builds.
Required MAP_DATA: meta:{date,time,areaName,quote}, atlasAnchor, pcPlace, pcSpot, places:[], actors:[], events:[]. Unknown text="", absent events=[]. atlasAnchor=Fixed/cluster/World/AU ID from W4.1 or custom; pcPlace=actual room name or known ID; pcSpot=inside|corridor|threshold|outdoor. Scope follows PC, not a mentioned NPC/quest. Fixed needs no room dump; known cluster expands all source rooms + RP additions. Custom places lists all rooms; array length is room count. mapMode=indoor|outdoor only when needed. layoutType=horizontal|vertical|windows|ell|tee|cross|court|cloister|curved|tower when custom needs it; cluster default comes from Atlas; geometry not yet implemented uses an illustrative fallback without losing RP. No coordinates/SVG/path.
places:[{name,type,description,id?,overhear?,zone?,props?,propsMode?,templateState?}]. type chooses room function from WORDS below; GitHub matches the recipe. New function names remain valid. description=observable setting; overhear=actually heard RP, not inferred from any activity. Order rooms by layout; zone=entrance|left|center|right|end only if needed. props accepts names or {name,count?,zone?,id?,state?,op?}; defaults merge/ensure/count1, ensure is desired total, add only actual additions. replace+[] clears furniture, not architecture. broken/removed/missing/destroyed targets existing objects; exact instance id only when needed/known, never guess. templateState=intact|modified_props|structural_change; place overrides global. Small furniture changes keep Fixed; real structural changes use suitable detail/schematic, preserving RP. New shops in village-static bind empty houses; diagon-knockturn uses region=diagon|knockturn if known, else detail. No invented canon address; no lost RP on overflow/unknown assets.
actors:[{name,isPC?,placeName or placeId,tagType,footstep,spot?,zone?,activity,observation}]. Include known PC with isPC:true; pcPlace/pcSpot wins. footstep=walk|idle|hidden; inside/seated/lying/swimming hides feet; spot uses pcSpot values, zone is relative. patrol only when actually patrolling. events:[{title,placeName or placeId,detail,hidden?,target?}], [] if none; hidden is a known clue's question-mark icon, never secret data. Filter PC knowledge before JSON; keep harmless Atlas background. Unknown items/rooms get a representation, not refusal; inside never requests X-Ray. Never invent content to fill fields.
WORDS (pick function, no element IDs):
'''
head+='rooms: '+ '|'.join(vocab['recipes'])+'|empty.\n'
head+='ribbon: gryffindor|slytherin|ravenclaw|hufflepuff|beauxbatons|durmstrang|teacher|adult|patrol|animal|monster|ghost|unknown|crowd.\n'
head+='HTML: replace __MAP_DATA_JSON__ with current pure JSON; escape literal < as \\u003c before HTML parsing. Keep all three pinned URLs unchanged. Runtime fallback retains RP; never claim Preview success without seeing it.\n\n```html\n'
Path('docs/MAP_PROMPT.md').write_text(head+html+'\n```\n\nEND R14.6 /MAP.\n')
