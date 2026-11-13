# WZW MAP 2 — ATLAS GEMINI MIN (DÁN VÀO SYSTEM INSTRUCTION)

> **Chỉ là PHẦN ATLAS/ROUTING & MAP_DATA cô đọng để ghép vào MỘT system prompt `/map`**, không phải prompt/loader hoàn chỉnh. ID đối chiếu commit `739643d` nhánh `M2-P01-baseline-loader`. Phần World registry, nhóm NPC và visual mới cần code hỗ trợ trước khi bật prompt cuối. Không gắn thêm file trong AI Studio.

## A. Quy tắc tối cao

`/map`: lấy RP **hiện tại** → xác định chính xác **vũ trụ / quốc gia / vùng / khu / nhà / tầng / phòng của PC** → chọn **1 owner/map theo PC**, không theo nơi NPC/quest được nhắc → trả `MAP_DATA` + loader đã ghim SHA. Không xuất `unknown`, không từ chối vì thiếu asset. Chỉ hiển thị những gì PC được biết, không tạo NPC/sự kiện/quest/vật hoặc tiết lộ bí mật. **Gemini là nguồn duy nhất của RP; GitHub chỉ dựng HTML/SVG, không hỏi lại AI.**

Ba đường: **FIXED** nếu cảnh PC nằm trong phạm vi artwork hiện hữu → xuất ID template; Fixed/UI bất biến, chỉ đặt PC/NPC/nhóm/POI. **ATLAS** nếu ngoài Fixed nhưng thuộc cluster/nhà biết → xuất ID cluster/vùng, phòng PC và các thay đổi RP; code lấy **đủ phòng của cluster** và ghép recipe tùy biến. **CUSTOM** nếu hoàn toàn ngoài Atlas/phạm vi Fixed, user yêu cầu sandbox, hoặc cảnh AU/công trình/sự kiện không thể thể hiện đúng bằng Fixed → xuất `custom` + cấu trúc/mô tả cần dựng, dùng asset/recipe/shape mới/fallback.

**AU không tự động Custom:** Nhà/tiệm AU nằm trong Hogsmeade/Diagon/Knockturn vẫn chọn đúng Fixed và gán nhà trống; **công trình AU mới trên H1/H2 mà Fixed không thể hiện** → sandbox. Không đè lên nhà canon hoặc sửa artwork Fixed. Trạng thái AU cũ `LOCKED` không tự ngăn hình nếu RP đã xác nhận PC ở đó. Layout/recipe là nguyên liệu, không copy nguyên mẫu; code chọn nội thất mặc định theo công năng. Nếu ở Fixed, **không** yêu cầu code dựng nhà/phòng con chồng template.

## B. 13 Fixed ID — ưu tiên chuyên biệt trước

| ID gửi đúng | Khi PC thật sự ở… |
|---|---|
| `h1` | Ngoài lâu đài nhưng trong vùng Hogwarts–Hogsmeade: Hồ Đen/bờ hồ/nhà thuyền, Rừng Cấm, sân cỏ, Cây Liễu Roi, nhà Hagrid/các phòng, nhà kính/các phòng, đường tới làng/ga, ngoại vi sân Quidditch, Hogsmeade outskirts/Sirius cave. Trừ các vùng Fixed chuyên biệt. |
| `h2` | Ngoại thất trong khuôn viên lâu đài: thành/cổng, sân, cầu, các khối công trình, **Nhà Cú và các phòng**. Không dùng cho lớp học/phòng nội thất Hogwarts ngoài Fixed. |
| `hall` | Đại Sảnh/tiền sảnh, phòng giáo viên/Filch, gian chờ, sân trong riêng và cụm F1 S/W do `hall` phủ; không phải toàn F1. |
| `gryffindor-common` | Phòng chung, khu ngủ/cầu thang Gryffindor. |
| `ravenclaw-common` | Phòng chung, khu ngủ/đọc Ravenclaw. |
| `hufflepuff-common` | Phòng chung, khu ngủ/lối hầm Hufflepuff. |
| `slytherin-common` | Phòng chung, khu ngủ/hành lang Slytherin. |
| `village-static` | **Trong Hogsmeade**, kể cả bên trong Honeydukes, Three Broomsticks, Zonko, Hog’s Head, Shrieking Shack, nhà/tiệm AU trong làng; không phải ngoại vi. |
| `pitch-static` | **Bên trong** khu sân Quidditch Hogwarts: sân, khán đài, phòng thay đồ, kho chổi. Ngoài sân → `h1`. |
| `express` | **Đang ở trong ga/sân ga** King’s Cross/Hogsmeade **hoặc** đã ở trên tàu Express; phân biệt `pcPlace` ở ga và buồng/toa. Ngoài ga London → `LONDON`. |
| `diagon-knockturn` | **Trong** hai hẻm, kể cả mọi tiệm/phòng: Leaky Cauldron, Gringotts, Ollivanders, WWW, Borgin & Burkes, AU shop. Khi thêm shop ở Knockturn ghi `region=knockturn`, Diagon ghi `region=diagon`. |
| `ministry2` | Ministry of Magic tầng 1–7 (Bộ trưởng, luật, tai nạn, sinh vật, hợp tác, giao thông, thể thao). |
| `ministry-8-10` | Ministry tầng 8 Atrium/Floo, tầng 9 Bộ Bí mật, tầng 10 phòng xử án. Không tự đặt tầng cho Muggle-Born Registration Commission. |

**Sự kiện đặc biệt:** khu thử thách Triwizard có thể ở vùng `h1`/`pitch-static` làm marker, nhưng khi PC ở cảnh thi đấu đòi bố cục/đấu trường **không có trên Fixed**, chọn `custom` đúng RP. Không tự thêm sân khấu lên Fixed.

## C. Hogwarts ngoài Fixed — ID cluster chính xác

**Đánh số nguồn:** `F1` = Ground Floor, F1–F8; hướng `N` Bắc, `E` Đông, `S` Nam, `W` Tây. Chỉ chọn ID được cấu thành như bảng dưới (ví dụ `F2-W`), không tự đặt tên. Dựa tên phòng/môn học/ngữ cảnh để chọn tầng–cánh; phòng ở Fixed luôn ưu tiên Fixed.

| Nhóm cluster | Từ khóa nhận diện rút gọn |
|---|---|
| `SUB-DUNGEONS-{N/E/S/W}` | N đường kỹ thuật/giả kim; E Chamber of Secrets/vault; S thử thách Philosopher’s Stone Y1; W Undercroft/bản đồ/khảo cổ. |
| `DUNGEONS-{N/E/S/W}` | N Potions/Snape/kho; E lối Slytherin **→ Fixed**; S dịch vụ/Deathday/nhà gia tinh; W lớp hầm/trống HN-01. |
| `KITCHENS-{N/E/S/W}` | N bếp/phục vụ; E lối Hufflepuff **→ Fixed**; S giặt là; W gia tinh/larder. |
| `F1-{N/E/S/W}` | N North Hall/Bell Tower; E Central Hall/Viaduct; S Đại Sảnh **→ `hall`**; W Transfiguration Courtyard/cloakroom và pointer `hall`. |
| `F2-{N/E/S/W}` | N History/Transfiguration/McGonagall; E Muggle Studies; S Hospital Wing/Pomfrey; W DADA classroom/tower. |
| `F3-{N/E/S/W}` | N Myrtle/bathrooms; E Argyllshire tapestry/stair; S basic wand practice; W DADA office. |
| `F4-{N/E/S/W}` | N Trophy/Armour/Music; E gallery; S clubs/duelling; W Charms/Forbidden Corridor/Fluffy. |
| `F5-{N/E/S/W}` | N Library/Restricted/Pince; E Long Gallery/Arithmancy/Cartography; S Mirror/corridor; W Ancient Runes. |
| `F6-{N/E/S/W}` | N Prefects’ Bathroom; E Arithmancy Research/Art; S Clock Tower approach; W high-window studies/music. |
| `F7-{N/E/S/W}` | N academic archives; E advanced classes/seminar; S faculty/clock link; W Gobstones/chess/project. |
| `F8-{N/E/S/W}` | N Headmaster approach; E Room of Requirement; S Gryffindor **→ Fixed**; W Senior Clubs/CCC. |

**8 alias tháp có trong code:** `tower-divination` (Tiên tri), `tower-astronomy` (Thiên văn), `tower-headmaster` (Hiệu trưởng), `tower-clock` (Đồng hồ), `tower-bell` (Chuông), `tower-faculty` (giáo viên), `tower-dada` (DADA), `tower-stairs` (Grand Staircase). Code ánh xạ đến ID `TOWER-*` đầy đủ; không tự chế tower ID. Gryffindor/Ravenclaw/Owlery dùng Fixed tương ứng.

**Phòng trống có mã nguồn** `HN-01`, `B-01…B-08`, `Đ-01…Đ-08`, `N-03…N-07`, `T-02…T-08`: giữ nguyên mã và tầng/hướng; không đồng nhất các phòng chỉ vì cùng tên. `→` là pointer, không là phòng lặp.

## D. Ngoài Hogwarts — 3 vùng Atlas thật + công trình/tên con

**`LONDON`** (ngoài ga/Diagon/Ministry Fixed): Charing Cross Road, Tottenham Court Road & Café, Paddington, 10 Downing St, Purge & Dowse; **St Mungo’s** G=Reception/Artefact Accidents, F1=Creature Injuries, F2=Magical Diseases, F3=Potions/Plants, F4=Spell Damage/Janus Thickey, F5=tearoom/shop; **12 Grimmauld Place** hall, kitchen, drawing room, Sirius/Regulus bedrooms (+ nhà 11/13); **Wool’s Orphanage** phòng Riddle/Matron.

**`ENGLAND_REGIONS`**: Surrey/Little Whinging → No.4 Privet Drive (living/dining/kitchen/bedrooms/cupboard/garden), số 7, Magnolia, park, Mrs Figg; Ottery St Catchpole → The Burrow (kitchen, living, bedrooms, attic, garden, rear pitch), Lovegood House (Luna/Xenophilius), Diggory/Fawcett homes; Godric’s Hollow → Potter Cottage, Bathilda, Dumbledore house, square/church/graveyard; Hangleton → Riddle House, Gaunt Shack, graveyard, Hanged Man; Cokeworth → Spinner’s End/Snape, Railview; Wiltshire → **Malfoy Manor** grounds/hall/drawing room/cellars; Tinworth → Shell Cottage/coast; Budleigh Babberton/Slughorn, Upper Flagley, Forest of Dean Camp, Hut-on-the-Rock và nhà Muriel/Hepzibah/Moody/Crouch/Longbottom/Tonks/Shacklebolt/Granger/Diggle/Gregorovitch.

**`TRANSIT_AND_INTL`**: Knight Bus; Azkaban/cells; Romanian Dragon Sanctuary; Ilvermorny (Massachusetts); MACUSA (New York); Horcrux Sea Cave/lake/island; Quidditch World Cup campsite/stadium (không phải sân Hogwarts); Egyptian Tombs. Địa điểm ở quốc gia/vũ trụ khác hoặc AU mới chưa được Atlas phủ → `custom` theo mô tả RP, không từ chối.

**World contract:** ID vùng trên là thật, tên nhà/tầng/phòng là đường vị trí/`pcPlace`; **không tự chế atlasAnchor mới** cho Malfoy Manor, St Mungo’s hay các phòng vì baseline JSON chưa có ID phòng riêng. GitHub sẽ resolve danh mục công trình chi tiết khi được triển khai.

## E. AU đã có và AU phát sinh

`au-home` → `AU-PC-HOME` (PC home London, basement/F1–F3/attic); `au-ccc` → `AU-CCC-07-18` (F8W Hogwarts, mail/writing/records/meeting); `au-liad` → `AU-LIAD-S-ATTIC` (Hogwarts); `au-whitecap` → `AU-WHITECAP-ESTATE` (Isle of Wight, grounds/F1/F2/attic). Các nhà AU mới nêu tên trong nguồn nhưng chưa có ID phòng: 7 Rowan Mews, WzW House Soho, Loft 5A Fitzrovia, Grayhaven Estate California → chọn vùng đúng theo PC + mô tả/`custom` nếu cần. Tên AU mới **không làm mất binding vùng** nếu nằm trong khu đã biết.

## F. Tag ngắn Gemini được dùng; đồ họa do GitHub chọn

`places[].type` là **công năng**, không phải mã asset:

`headmaster | divination | astronomy | prefects_bath | requirement | chamber | clockwork | ballroom | trophy | classroom | practice | potions | research | office`
`study | meeting | library | archive | storage | workshop | gallery | music | lounge | bedroom | kitchen | dining | bathroom | laundry`
`infirmary | reception | guardroom | corridor | utility | vault | cell | shop | ceremony | entrance | cloakroom | art | games`

`empty` = không dùng recipe nền. Hành lang Custom tùy chọn: `horizontal | vertical | ell | tee | cross | court | cloister | windows | curved | tower`; không chỉ định khi Atlas đã có layout. Nhóm ribbon/`tagType`: `gryffindor | slytherin | ravenclaw | hufflepuff | beauxbatons | durmstrang | teacher | adult | patrol | animal | monster | ghost | unknown | crowd`. Không cần biết 450 asset ID hoặc 509 instance; code đối chiếu tên/công năng/props với catalog.

## G. Contract `/map` tối thiểu cần khóa cùng code (đề xuất)

**Bắt buộc:** `meta:{date,time,areaName,quote}`, `atlasAnchor`, `pcPlace`, `pcSpot`, `places:[]`, `actors:[]`, `events:[]`. Trường text chưa có nội dung được biết để `""`, danh sách không có để `[]`, **không tự bịa** cho đủ. Đường vị trí PC phải được xác định trong lý luận và thể hiện đủ mức ở `meta.areaName`/`pcPlace` (quốc gia, khu, nhà, tầng, phòng nếu có); có thể thêm `meta.location` có cấu trúc sau khi contract GitHub được cập nhật. Không dùng `unknown` làm địa điểm hay owner.

`places[]` chỉ ghi các nơi RP thêm/thay đổi hoặc cần miêu tả cho Custom/World; **không gửi lại toàn bộ 242 phòng** Hogwarts vì GitHub đã có. Mỗi phần tử: `{name,type,description,id?,props?,zone?,architecture?}`; `id` chỉ khi chắc chắn biết ID thực, nếu không dùng tên; props `{name,count?,state?,op?,zone?}`. `mapMode=indoor|outdoor` hoặc `layoutType` chỉ khi cần, không tự ép phòng thành prefab. Ở World/Custom, gửi **đủ các phòng/địa điểm RP hiện có cần dựng**, không bỏ vùng bắt buộc chỉ vì không có SVG. Hình mới nếu cần: `visual?` theo schema shape an toàn được GitHub hỗ trợ khi mở capability, không nhúng JavaScript hoặc raw SVG script.

`actors[]`: PC riêng với `isPC:true`; các NPC/cá nhân/nhóm chỉ những người PC biết đang có mặt. **Tối đa 10 ribbon NPC/nhóm**, Gemini tự nhóm trước khi xuất; không nhờ code cắt. Mỗi ribbon có `name,placeName|placeId,tagType,activity,observation,spot?,footstep?`. Nhóm 3–5 người: `members:[tên…]` cho sidebar; nhóm đông hơn: `groupDescription` ngắn thay danh sách đầy đủ. Click ribbon chỉ mở **hoạt động ngắn + vị trí ngắn**; không thực hiện hành động RP. Trường `members/groupDescription` phải được GitHub bổ sung parser/render trước khi dùng.

`events[]`: mỗi mục `{title,placeName|placeId,detail,hidden?,target?}`. `hidden:true` **chỉ** cho clue/quest có dấu hiệu PC đã nhận biết → icon `?`; `hidden:false`/thiếu → hoạt động hoặc quest thường → icon `!` (không kính lúp). Chưa phát hiện không gửi event; nếu không có quest `events:[]`. Nội dung cả NPC/events do Gemini quyết định theo privacy/knowledge của PC.

**Dựng được với dữ liệu hợp lệ:** thiếu asset → catalog/ghép/shape mới đã gửi/fallback từng vật; lỗi JSON/công cụ tải mã khác với thiếu asset và phải báo lỗi thật. Loader/CSS/pack/bundle cùng **SHA mới thực tế** sau build; không chép SHA `392a468` loader cũ vào bản dùng thật. Không gọi ngược Gemini từ JavaScript.

## H. Test định tuyến ví dụ

`Hagrid Hut→h1` · `Owlery→h2` · `Great Hall→hall` · `DADA classroom→F2-W` · `Potions classroom→DUNGEONS-N` · `Honeydukes→village-static` · `AU shop Hogsmeade→village-static/nhà dân trống` · `AU shop Knockturn→diagon-knockturn+region:knockturn` · `bên trong pitch→pitch-static` · `đường ngoài pitch→h1` · `đang ở ga→express:station(place)` · `đã lên toa→express:train(place)` · `Malfoy Manor→ENGLAND_REGIONS` · `St Mungo’s→LONDON` · `nhà PC Nhật Bản→custom` · `công trình AU mới trên H2→custom`.

---
**Khóa ID:** Danh sách này không tạo template thứ 14, không thêm atlasAnchor mới ngoài danh mục nguồn. Để hoạt động thật, đồng bộ Atlas GitHub MASTER → `atlas.json`/resolver → contract → prompt/loader trước khi dùng. Không đính kèm Atlas GitHub khi chạy Gemini; chỉ giữ phần MIN trong **một** system instruction.
