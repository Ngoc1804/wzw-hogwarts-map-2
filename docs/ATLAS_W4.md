# WZW NORMALIZED ATLAS — TEMPLATE ROUTING & WORLD LOCATIONS

> Bản ATLAS hoàn chỉnh đã tinh gọn để AI chọn map theo **vị trí thực tế của PC**. Giữ nguyên 13 fixed templates, các cụm Hogwarts không có fixed template, thế giới ngoài template và trạng thái AU.

## 0. ROUTING RULES

- **1 vị trí PC → 1 owner/map.** Chọn theo **vị trí thực của PC**, không theo NPC, nhiệm vụ hay địa điểm chỉ được nhắc. Nhà/tiệm/phòng trong fixed template là `place/marker` để click/đặt NPC; **không dựng map nội thất con**.
- **Ưu tiên:** `AU ACTIVE` đúng địa điểm → fixed template chuyên biệt (`hall`, house-common, village, pitch, express, diagon, ministry) → `HOGWARTS_INTERIOR` nếu đang trong phòng/hành lang/tháp chưa có fixed template → `h2` (khuôn viên lâu đài) → `h1` (ngoại cảnh Hogwarts–Hogsmeade ngoài các vùng trên) → `WORLD_NON_TEMPLATE`. `AU LOCKED` không mở map.
- **Ranh giới:** `h2` = trong khuôn viên lâu đài + cổng/sân/cầu/tháp cú; `h1` = ngoài khuôn viên nhưng trong vùng Hogwarts–Hogsmeade, trừ bên trong làng Hogsmeade, sân Quidditch, ga. Nhà Hagrid/nhà kính/phòng của chúng vẫn `h1`; nhà cú và phòng của nó vẫn `h2`.
- **Khu nhiều nhà:** PC vào Honeydukes/Three Broomsticks → `village-static`; vào WWW/Gringotts/Borgin & Burkes → `diagon-knockturn`. Focus/đặt marker vào nhà, **không đổi map**. Ngoài làng → `h1`; ngoài sân Quidditch → `h1`, vào trong sân → `pitch-static`.
- **Ga vs tàu:** `express:station` khi PC **ở trong ga/sân ga**; `express:train` **chỉ khi PC đã lên tàu**. Đường đến ga Hogwarts/Hogsmeade → `h1`; đường phố London ngoài ga → `WORLD_NON_TEMPLATE`.
- **Lâu đài:** `hall` sở hữu cụm F1 S/W và `Dedicated hall Inner Courtyard` riêng; sân lâu đài khác → `h2`. Phòng/tháp Hogwarts chưa có fixed template dùng `Floor → N/E/S/W → Cluster [layout] → Room` từ `assets/recipes.json`, không phát sinh fixed template mỗi phòng.
- **Không mất dữ liệu:** giữ nguyên hướng N/E/S/W, mã phòng `HN-01`, `B-01…B-08`, `Đ-01…Đ-08`, `N-03…N-07`, `T-02…T-08`, canonical corridor labels và đánh số nguồn `F1=Ground Floor` (F1–F8). `→` chỉ là pointer, không phải owner/room thứ hai; nhãn trùng ở tầng khác nhau phân biệt bằng Floor+Direction. Giữ trạng thái AU ACTIVE/LOCKED.

## 1. FIXED TEMPLATES (13)

### `h1` — Hogwarts–Hogsmeade Outer Grounds
**Owner:** mọi cảnh ngoài khuôn viên lâu đài trong vùng Hogwarts–Hogsmeade, trừ vùng riêng `village-static`, `pitch-static`, `express`; công trình và nội thất không có map riêng.
- **Lawns & Paths:** Flying Lawn; Study/Outer Castle Lawns & Meadows (outside H2); Outdoor Walks; Hogsmeade Path; Station Approach Road/Docks (outside station); Whomping Willow & surrounding ground; Quidditch Pitch Approach & Outer Perimeter (outside stadium); Outer Wall Paths (outside castle boundary).
- **Forbidden Forest:** Forest Entrance/Edge/Trails; Deep Forest; Centaur Territory; Aragog's Hollow.
- **Great Lake:** Lake Surface/Boats; Lakeshore/Walks/Lawns; Boathouse & Docks; Lakeside Ancient Tree; Black Lake Trial Zone.
- **Hagrid & Greenhouses:** Hagrid's Hut (interior/rooms); Pumpkin Patch/Garden & Path; Greenhouses 1–3 (interiors); Herbology Gardens & Inter-Greenhouse Paths.
- **Special Grounds:** Triwizard Dragon Arena; Beauxbatons Camp; Durmstrang Ship Mooring; Dumbledore's Tomb.
- **Hogsmeade Outskirts:** Hogsmeade Outskirts/Mountain; Sirius's Cave (marker, không thuộc làng). **West Tower Owlery → `h2`**.

### `h2` — Hogwarts Castle Grounds, Owlery & Bridges
**Owner:** khuôn viên lâu đài, cổng/sân/cầu và toàn bộ Nhà Cú, **không** chiếm nội thất lớp/hành lang/tháp khác.
- **Castle & Grounds:** Castle Exterior & Main Gates; Castle Lawns/Wall Paths (inside grounds).
- **Courtyards:** Front/Entrance Gate; Viaduct; Transfiguration; Bell Tower; Quad; Clock Tower; Wyvern; Mistletoe; Inner/Inter-Wing/Tower-Foot Courtyards (**trừ** `Dedicated hall Inner Courtyard` → `hall`).
- **Bridges:** Viaduct; Stone Wing Bridges; Wooden/Hanging Bridge (cầu treo).
- **West Tower Owlery:** Owlery; Feed Store; Injured Owl Room; Owlery Stairs (marker trong H2, không dựng phòng riêng).

### `hall` — Hogwarts F1 South/West · Great Hall Cluster
- **S:** Great Hall; Entrance Hall & Approach; Sorting Antechamber; Side Chamber; Behind-Dais Room; Staff Room; Filch's Office; Dedicated hall Inner Courtyard; Grand Staircase Foot; School Reception Room.
- **W:** Classroom 11; Broom Cupboard. `F1S/F1W →hall` chỉ tại điểm nối tương ứng, không đổi cả tầng F1 thành hall.

### `gryffindor-common` — F8 S / Gryffindor Tower SW
Common Room; Boys'/Girls' Dorms & Dorm Stairs; Internal Stairs; Study/Lounge Areas; Fat Lady Portrait Entrance; End-of-Corridor Student Lounge.

### `ravenclaw-common` — Ravenclaw Tower W
Common Room; Boys'/Girls' Dorms; Entrance/Inner Hall; Academic Reading & Group Study Rooms.

### `hufflepuff-common` — Kitchens Floor E
Common Room; Boys'/Girls' Dorms; Common Corridor; Group Study Rooms.

### `slytherin-common` — Dungeons E
Common Room; Boys'/Girls' Dorms; Under-Lake Corridor; Reading & Group Study Rooms.

### `village-static` — Hogsmeade Village
**Owner:** mọi nhà/tiệm/phòng trong **ranh giới làng Hogsmeade**, không dựng map từng tiệm.
High Street; Square; Alleys; Village Houses/Shops; Honeydukes (& cellar); Zonko's; Gladrags; Scrivenshaft's; Owl Post; Three Broomsticks (& rooms); Dervish & Banges; Hog's Head (& rooms); Madam Puddifoot's; Shrieking Shack (& interior); Village Apothecary (khác Diagon Apothecary). Ngoài làng/Sirius's Cave → `h1`; trong ga Hogsmeade → `express`.

### `pitch-static` — Hogwarts Quidditch Complex
**Owner:** bên **trong ranh giới sân**, không dựng map phòng phụ.
Pitch/Turf; Stands; Commentary Box; Auxiliary Rooms; Mini Training Pitch; Internal Paths; Triwizard Maze (when active); Team A/B/General Changing Rooms; Pitch Broom Shed. Ngoài sân → `h1`; Quidditch World Cup ở địa điểm khác → `WORLD_NON_TEMPLATE`.

### `express` — Stations & Hogwarts Express
- **`station` khi PC trong ga:** King's Cross; Platform 9¾ & Waiting Area; Hogsmeade Station & Platform (inside boundary).
- **`train` chỉ khi PC lên tàu:** Hogwarts Express Engine; Carriages; House Model Cars; Compartments; Corridors/Gangways. Đứng trên sân ga **không** hiện toa tàu.

### `diagon-knockturn` — Diagon Alley & Knockturn Alley
**Owner:** toàn bộ phố/nhà/tiệm/phòng trong hai hẻm, không dựng map riêng cửa tiệm.
- **Diagon:** Leaky Cauldron (& rooms/courtyard); Gringotts (& Vaults/713/Potter/Lestrange); Ollivanders; Flourish & Blotts; Madam Malkin's; Quality Quidditch Supplies; Eeylops; Magical Menagerie; Potage's Cauldrons; Fortescue's; Gambol & Japes; WWW (era-dependent); Twilfitt & Tatting's; Scribbulus; Diagon Apothecary; Secondhand Robes/Goods/Stationery Shops; Alley Houses/Workshops.
- **Knockturn & Links:** Knockturn Alley; Borgin & Burkes; Curio/Pawn Shops; Knockturn Houses/Alleys; Connecting Passages. Ra ngoài hai hẻm → `WORLD_NON_TEMPLATE` LONDON.

### `ministry2` — Ministry of Magic L1–L7
- L1: Minister's & Junior Minister's Offices | L2: Magical Law Enforcement, Auror HQ, Improper Use of Magic, Misuse of Muggle Artefacts, Wizengamot Admin | L3: Accidental Magic Reversal, Obliviators, Muggle-Worthy Excuse Committee | L4: Beast/Being/Spirit Divisions, Goblin Liaison, Pest Advisory | L5: Int'l Magical Cooperation/Trade/Law/Liaison | L6: Magical Transport (Floo, Broom Regulation, Portkey, Apparition Test) | L7: Magical Games/Sports, Quidditch League HQ, Gobstones Club, Ludicrous Patents.

### `ministry-8-10` — Ministry of Magic L8–L10
- L8: Atrium, Reception, Security, Floo Network, Visitor Intake | L9: Dept of Mysteries (Rotating Hall; Time/Prophecy/Death/Brain/Space/Locked Love Rooms) | L10: Courtrooms/Courtroom 10, Holding/Support Rooms.
- **Unassigned floor (single record):** Muggle-Born Registration Commission — giữ nguyên chưa có tầng, không tự chế thêm.

## 2. HOGWARTS_INTERIOR — NON-TEMPLATE CLUSTERS

**Owner:** các nội thất Hogwarts chưa thuộc 13 fixed templates. Chọn theo `Floor → Direction → Cluster [layout] → Room`; lấy recipe đúng tên trong `assets/recipes.json`. `[layout]` giữ nguyên (`vertical`, `ell`, `horizontal`, `tee`, `cross`, `curved`, `cloister`, `court`, `windows`, `tower`). Các `→` bên dưới là **routing pointer**, không phải room duplicate.

### SUB-DUNGEONS (HẦM NGẦM)
#### `SUB-DUNGEONS-N` [vertical] — N Tech Tunnels
`SUB-DUNGEONS-N:01`=Stone Corridor under Astronomy Tower → `PASSAGE_PROPS`; `SUB-DUNGEONS-N:02`=Alchemy Room → —; `SUB-DUNGEONS-N:03`=Coal/Fuel Store → `STORAGE`; `SUB-DUNGEONS-N:04`=Tower Foundation Check Room → —.

#### `SUB-DUNGEONS-E` [ell] — E Relic Vaults
`SUB-DUNGEONS-E:01`=Chamber of Secrets Pipe → —; `SUB-DUNGEONS-E:02`=Chamber of Secrets → `CHAMBER_OF_SECRETS`; `SUB-DUNGEONS-E:03`=Ancient Vault Gatehouse → `GUARDROOM`; `SUB-DUNGEONS-E:04`=Sealed Vault Corridor → `PASSAGE_PROPS`.

#### `SUB-DUNGEONS-S` [horizontal] — S Y1 Stone Chambers
`SUB-DUNGEONS-S:01`=Devil's Snare → —; `SUB-DUNGEONS-S:02`=Flying Keys → —; `SUB-DUNGEONS-S:03`=Wizard's Chess → `GAMES_ROOM`; `SUB-DUNGEONS-S:04`=Potions Trial → `POTIONS_LAB`; `SUB-DUNGEONS-S:05`=Final Mirror Chamber → —.

#### `SUB-DUNGEONS-W` [tee] — W Ancient Study
`SUB-DUNGEONS-W:01`=Map Chamber → `ART_CARTOGRAPHY_STUDIO`; `SUB-DUNGEONS-W:02`=Undercroft → —; `SUB-DUNGEONS-W:03`=Archaeological Tool Store → `STORAGE`; `SUB-DUNGEONS-W:04`=Blueprint Room → `ART_CARTOGRAPHY_STUDIO`.


### DUNGEONS (HẦM NGỤC)
#### `DUNGEONS-N` [cross] — N Potions Cluster
`DUNGEONS-N:01`=Potions Classroom → `POTIONS_LAB`; `DUNGEONS-N:02`=Snape's Office → `OFFICE`; `DUNGEONS-N:03`=Potions Ingredient Store → `STORAGE`; `DUNGEONS-N:04`=Practical Prep Room → `POTIONS_LAB`; `DUNGEONS-N:05`=Cauldron Washroom → `BATHROOM`.

#### `DUNGEONS-E` [curved] — E Slytherin Approach
.
Pointers: slytherin-common.

#### `DUNGEONS-S` [horizontal] — S Under-Hall Service
`DUNGEONS-S:01`=Deathday Party Chamber → —; `DUNGEONS-S:02`=Cleaning Supply Store → `STORAGE`; `DUNGEONS-S:03`=Food Transit Corridor → `PASSAGE_PROPS`; `DUNGEONS-S:04`=House-Elf Duty Room → —; `DUNGEONS-S:05`=Furnace Tech Room → `UTILITY_ROOM`.

#### `DUNGEONS-W` [ell] — W Subterranean Classes
`DUNGEONS-W:01`=Astronomy Dungeon Corridor → `PASSAGE_PROPS`; `DUNGEONS-W:02`=Mineral Sorting Room → —; `DUNGEONS-W:03`=Empty Classroom HN-01 → `CLASSROOM`; `DUNGEONS-W:04`=Old Cauldron Store → `STORAGE`; `DUNGEONS-W:05`=Potion Sample Archive → `ARCHIVE`.


### KITCHENS (TẦNG BẾP)
#### `KITCHENS-N` [tee] — N Kitchens & Service
`KITCHENS-N:01`=Hogwarts Kitchens → `KITCHEN`; `KITCHENS-N:02`=Dry Food Store → `STORAGE`; `KITCHENS-N:03`=Meal Prep Room → `KITCHEN`; `KITCHENS-N:04`=Scullery/Dishwashing → `BATHROOM`; `KITCHENS-N:05`=Kitchen Logistics Corridor → `PASSAGE_PROPS`.

#### `KITCHENS-E` [ell] — E Hufflepuff Approach
.
Pointers: hufflepuff-common.

#### `KITCHENS-S` [vertical] — S Laundry & Linen
`KITCHENS-S:01`=Laundry Room → `LAUNDRY`; `KITCHENS-S:02`=Linen Room → `LAUNDRY`; `KITCHENS-S:03`=Tablecloth Store → `STORAGE`; `KITCHENS-S:04`=Laundry Maintenance → `LAUNDRY`; `KITCHENS-S:05`=South Storage Corridor → `PASSAGE_PROPS`.

#### `KITCHENS-W` [cross] — W Elf Quarters & Larder
`KITCHENS-W:01`=House-Elf Quarters → `BEDROOM`; `KITCHENS-W:02`=Vegetable Larder → `STORAGE`; `KITCHENS-W:03`=Kitchen Herb Store → `STORAGE`; `KITCHENS-W:04`=Spare Utensil Store → `STORAGE`; `KITCHENS-W:05`=West Basement Link Corridor → `PASSAGE_PROPS`.


### F1 (GROUND / TẦNG 1)
#### `F1-N` [cloister] — N North Hall–Bell Tower
`F1-N:01`=North Hall → —; `F1-N:02`=Bell Tower Foot Hall → —; `F1-N:03`=North Gate Corridor → `PASSAGE_PROPS`; `F1-N:04`=North Gate Guardroom → `GUARDROOM`; `F1-N:05`=Practice Gear Store → `TOWER_CLOCKWORK`; `F1-N:06`=Empty Classroom B-01 → `CLASSROOM`.

#### `F1-E` [cross] — E Library Annex–Viaduct
`F1-E:01`=Central Hall → —; `F1-E:02`=Viaduct Entrance Hall → —; `F1-E:03`=Greenhouse Link Corridor → `PASSAGE_PROPS`; `F1-E:04`=New Pupil Reception → `RECEPTION`; `F1-E:05`=Central Hall Store → `STORAGE`; `F1-E:06`=Empty Classroom Đ-01 → `CLASSROOM`.

#### `F1-S` [tee] — S Great Hall Approach
.
Pointers: hall.

#### `F1-W` [court] — W Transfig Courtyard Approach
`F1-W:01`=Transfiguration Courtyard Corridor → `PASSAGE_PROPS`; `F1-W:02`=Quad Corridor → `PASSAGE_PROPS`; `F1-W:03`=Cloakroom → `CLOAKROOM_LOCKERS`; `F1-W:04`=Transfiguration Supply Store → `STORAGE`.
Pointers: hall.


### F2 (TẦNG 2)
#### `F2-N` [horizontal] — N History & Transfiguration
`F2-N:01`=History of Magic Classroom → `CLASSROOM`; `F2-N:02`=McGonagall's Office → `OFFICE`; `F2-N:03`=Transfiguration Classroom → `CLASSROOM`; `F2-N:04`=Transfiguration Prep Room → —; `F2-N:05`=History Book Store → `STORAGE`; `F2-N:06`=Empty Classroom B-02 → `CLASSROOM`.

#### `F2-E` [windows] — E Scholars Upper Walk
`F2-E:01`=Muggle Studies Classroom → `CLASSROOM`; `F2-E:02`=Hieroglyphics Room → `CLASSROOM`; `F2-E:03`=North Hall Upper Corridor → `PASSAGE_PROPS`; `F2-E:04`=Historical Model Archive → `ARCHIVE`; `F2-E:05`=Teaching Map Store → `STORAGE`; `F2-E:06`=Empty Classroom T-02 → `CLASSROOM`.

#### `F2-S` [ell] — S Hospital & Faculty Access
`F2-S:01`=Hospital Wing → `HOSPITAL_WARD`; `F2-S:02`=Pomfrey's Office → `OFFICE`; `F2-S:03`=Faculty Tower Access Corridor → `PASSAGE_PROPS`; `F2-S:04`=Bandage/Dressing Room → —; `F2-S:05`=Medical Supply Store → `STORAGE`; `F2-S:06`=Infirmary Waiting Room → `HOSPITAL_WARD`.

#### `F2-W` [tee] — W DADA Teaching Cluster
`F2-W:01`=DADA Classroom (tower door) → `CLASSROOM`; `F2-W:02`=Lower DADA Tower Corridor → `PASSAGE_PROPS`; `F2-W:03`=DADA Auxiliary Room → —; `F2-W:04`=Defence Practical Room → —; `F2-W:05`=DADA Prop Store → `STORAGE`; `F2-W:06`=Empty Classroom Đ-02 → `CLASSROOM`.


### F3 (TẦNG 3)
#### `F3-N` [horizontal] — N Myrtle's Corridor
`F3-N:01`=Myrtle's Bathroom → `BATHROOM`; `F3-N:02`="Second-Floor" Corridor by Myrtle's Bathroom → `PASSAGE_PROPS`; `F3-N:03`=Boys' Bathroom → `BATHROOM`; `F3-N:04`=Plumbing Store → `STORAGE`; `F3-N:05`=Corridor Guardroom B-03 → `PASSAGE_PROPS`.

#### `F3-E` [curved] — E Shortcut Stair Walk
`F3-E:01`=Argyllshire Map Tapestry Corridor → `PASSAGE_PROPS`; `F3-E:02`=Stair Safety Check Room → `PASSAGE_PROPS`; `F3-E:03`=Empty Classroom T-03 → `CLASSROOM`; `F3-E:04`=Desk/Chair Store → `STORAGE`.

#### `F3-S` [vertical] — S Supplemental Classes
`F3-S:01`=Basic Wand-Practice Room → `MAGIC_PRACTICE`; `F3-S:02`=Empty Classroom N-03 → `CLASSROOM`; `F3-S:03`=Study Equipment Store → `STORAGE`; `F3-S:04`=TA Office → `OFFICE`; `F3-S:05`=Small Student Lounge → `LOUNGE`.

#### `F3-W` [ell] — W DADA Office Route
`F3-W:01`=DADA Professor's Office (Lockhart 1992) → `OFFICE`; `F3-W:02`=DADA Office Corridor → `PASSAGE_PROPS`; `F3-W:03`=DADA Parent Reception → `RECEPTION`; `F3-W:04`=Lesson Plan Archive → `ARCHIVE`; `F3-W:05`=Empty Classroom Đ-03 → `CLASSROOM`.


### F4 (TẦNG 4)
#### `F4-N` [windows] — N Trophy–Armour Gallery
`F4-N:01`=Trophy Room → `TROPHY_ROOM`; `F4-N:02`=Armour Gallery → `GALLERY`; `F4-N:03`=Music Room → `MUSIC_ROOM`; `F4-N:04`=Trophy Preservation Store → `STORAGE`; `F4-N:05`=Ensemble Practice Room → `MUSIC_ROOM`; `F4-N:06`=Empty Classroom B-04 → `CLASSROOM`.

#### `F4-E` [curved] — E Upper North Gallery
`F4-E:01`=North Hall Upper Gallery Corridor → `PASSAGE_PROPS`; `F4-E:02`=Educational Artefact Display → `GALLERY`; `F4-E:03`=Empty Classroom T-04 → `CLASSROOM`; `F4-E:04`=Costume Store → `STORAGE`; `F4-E:05`=Artefact Restoration Room → `WORKSHOP`.

#### `F4-S` [cross] — S Clubs & Group Work
`F4-S:01`=Backup Duelling Practice Room → `MAGIC_PRACTICE`; `F4-S:02`=Club Prep Room → `MEETING_CLUB`; `F4-S:03`=Public Speaking Room → —; `F4-S:04`=Student Meeting Room → `MEETING_CLUB`; `F4-S:05`=Empty Classroom N-04 → `CLASSROOM`.

#### `F4-W` [ell] — W Charms & Forbidden Route
`F4-W:01`=Charms Classroom → `CLASSROOM`; `F4-W:02`=Charms Corridor → `PASSAGE_PROPS`; `F4-W:03`=1991 "Third-Floor" Forbidden Corridor → `PASSAGE_PROPS`; `F4-W:04`=Fluffy's Trapdoor Chamber (1991) → —; `F4-W:05`=Charms Practical Room → —; `F4-W:06`=Charms Supply Store → `STORAGE`.


### F5 (TẦNG 5)
#### `F5-N` [cloister] — N Library & Restricted
`F5-N:01`=Hogwarts Library → `LIBRARY`; `F5-N:02`=Restricted Section → `LIBRARY`; `F5-N:03`=Pince's Office → `OFFICE`; `F5-N:04`=Research Reading Room → `STUDY_ROOM`; `F5-N:05`=Catalogue Index Room → `ARCHIVE`; `F5-N:06`=Rare Book Store → `STORAGE`.

#### `F5-E` [windows] — E Long Gallery
`F5-E:01`=Long Gallery → `GALLERY`; `F5-E:02`=Arithmancy Classroom → `CLASSROOM`; `F5-E:03`=Magical Cartography Room → `ART_CARTOGRAPHY_STUDIO`; `F5-E:04`=Cipher/Cryptology Room → —; `F5-E:05`=Empty Classroom Đ-05 → `CLASSROOM`.

#### `F5-S` [ell] — S Fourth-Floor Walk & Mirror
`F5-S:01`=Former 1991 Mirror of Erised Room → —; `F5-S:02`=Old Secret Mirror Corridor → `PASSAGE_PROPS`; `F5-S:03`=Library Records Archive → `ARCHIVE`; `F5-S:04`=Empty Classroom N-05 → `CLASSROOM`; `F5-S:05`=Reading Room Store → `STORAGE`; `F5-S:06`=Tapestry Shortcut Stair → `PASSAGE_PROPS`.

#### `F5-W` [tee] — W Ancient Runes
`F5-W:01`=Ancient Runes Classroom → `CLASSROOM`; `F5-W:02`=Runes Translation Room → `CLASSROOM`; `F5-W:03`=History Seminar Room → `CLASSROOM`; `F5-W:04`=Source Research Room → `STUDY_ROOM`; `F5-W:05`=Empty Classroom T-05 → `CLASSROOM`.


### F6 (TẦNG 6)
#### `F6-N` [ell] — N Prefects–Faculty Route
`F6-N:01`=Prefects' Bathroom → `PREFECTS_BATHROOM`; `F6-N:02`=Prefects' Bathroom Corridor → `PREFECTS_BATHROOM`; `F6-N:03`=Upper Faculty Tower Corridor → `PASSAGE_PROPS`; `F6-N:04`=Prefects' Lounge → `LOUNGE`; `F6-N:05`=Towel/Uniform Store → `STORAGE`; `F6-N:06`=Empty Classroom B-06 → `CLASSROOM`.

#### `F6-E` [horizontal] — E Intermediate Classes
`F6-E:01`=Arithmancy Research Room → `CLASSROOM`; `F6-E:02`="Fifth-Floor" East Wing Corridor → `PASSAGE_PROPS`; `F6-E:03`=Magical Art Room → `ART_CARTOGRAPHY_STUDIO`; `F6-E:04`=Assignment/Chart Store → `STORAGE`; `F6-E:05`=Empty Classroom Đ-06 → `CLASSROOM`.

#### `F6-S` [curved] — S Clock Tower Ascent
`F6-S:01`=Upper Clock Tower Corridor → `PASSAGE_PROPS`; `F6-S:02`=Academic Club Room → `MEETING_CLUB`; `F6-S:03`=Student Newspaper Room → —; `F6-S:04`=Exhibit Gear Store → `TOWER_CLOCKWORK`.
Pointers: Clock Tower (maintenance).

#### `F6-W` [windows] — W West High Windows
`F6-W:01`="Fifth-Floor" West Window Corridor → `PASSAGE_PROPS`; `F6-W:02`=Small Ensemble Room → `MUSIC_ROOM`; `F6-W:03`=Quiet Reading Room → `STUDY_ROOM`; `F6-W:04`=Empty Classroom T-06 → `CLASSROOM`; `F6-W:05`=Craft Supply Store → `STORAGE`.


### F7 (TẦNG 7)
#### `F7-N` [vertical] — N Upper Stair Access
`F7-N:01`=Academic Achievement Archive → `ARCHIVE`; `F7-N:02`=Grade Ledger Archive → `ARCHIVE`; `F7-N:03`=Advanced Lesson Gear Store → `TOWER_CLOCKWORK`; `F7-N:04`=Empty Classroom B-07 → `CLASSROOM`; `F7-N:05`=North Stair Corridor → `PASSAGE_PROPS`.

#### `F7-E` [cross] — E Seminar & Labs
`F7-E:01`="Sixth-Floor" Boys' Bathroom → `BATHROOM`; `F7-E:02`=Advanced Magic Seminar Room → `CLASSROOM`; `F7-E:03`=Small Colloquium Room → `MEETING_CLUB`; `F7-E:04`=Safe Lab → —; `F7-E:05`=Empty Classroom Đ-07 → `CLASSROOM`.

#### `F7-S` [ell] — S Faculty/Clock Link
`F7-S:01`=Upper Faculty Tower Corridor → `PASSAGE_PROPS`; `F7-S:02`=Staff Minutes Archive → `ARCHIVE`; `F7-S:03`=Timetable Room → —; `F7-S:04`=Reference Book Store → `STORAGE`; `F7-S:05`=Empty Classroom N-07 → `CLASSROOM`.

#### `F7-W` [windows] — W Games & Projects
`F7-W:01`=Gobstones Room → `GAMES_ROOM`; `F7-W:02`=Wizard's Chess Club Room → `MEETING_CLUB`; `F7-W:03`=Student Project Room → —; `F7-W:04`=Empty Classroom T-07 → `CLASSROOM`; `F7-W:05`=High Glass Corridor → `PASSAGE_PROPS`.


### F8 (TẦNG 8)
#### `F8-N` [tower] — N Headmaster Approach
`F8-N:01`=Headmaster's Office Approach Corridor → `HEADMASTER_OFFICE`; `F8-N:02`=Headmaster's Entrance Hall → —; `F8-N:03`=Upper Grand Staircase Hall → `PASSAGE_PROPS`; `F8-N:04`=Empty Classroom B-08 → `CLASSROOM`; `F8-N:05`=Academic Records Store → `ARCHIVE`.

#### `F8-E` [horizontal] — E Room of Requirement
`F8-E:01`="Seventh-Floor" Corridor outside RoR → `PASSAGE_PROPS`; `F8-E:02`=Room of Requirement → `ROOM_OF_REQUIREMENT`; `F8-E:03`=Empty Classroom Đ-08 → `CLASSROOM`; `F8-E:04`=Academic Ceremony Room → `CEREMONY_HALL`; `F8-E:05`=Portrait Conservation Room → `GALLERY`.

#### `F8-S` [curved] — S Gryffindor Route
`F8-S:01`="Seventh-Floor" Study Group Room → `STUDY_ROOM`; `F8-S:02`="Seventh-Floor" Portrait Corridor → `PASSAGE_PROPS`.
Pointers: gryffindor-common.

#### `F8-W` [tee] — W Senior Clubs / CCC
`F8-W:01`=Empty Classroom T-08 → `CLASSROOM`.
Pointers: AU:CCC 07.18.


### HOGWARTS TOWERS (NỘI THẤT THÁP KHÔNG CÓ FIXED TEMPLATE)
- Gryffindor SW [tower]: →gryffindor-common | Ravenclaw W [tower]: →ravenclaw-common | West/Owlery W [tower]: →h2.
#### `TOWER-NORTH-DIVINATION-N` [tower] — North/Divination N
`TOWER-NORTH-DIVINATION-N:approach-spiral-stair`=Spiral Stair [Approach] → `PASSAGE_PROPS`; `TOWER-NORTH-DIVINATION-N:approach-star-chart-archive`=Star-Chart Archive [Approach] → `ARCHIVE`; `TOWER-NORTH-DIVINATION-N:top-divination-classroom`=Divination Classroom [Top] → `DIVINATION_CLASSROOM`; `TOWER-NORTH-DIVINATION-N:top-divination-store`=Divination Store [Top] → `STORAGE`.

#### `TOWER-ASTRONOMY-NW` [tower] — Astronomy NW
`TOWER-ASTRONOMY-NW:base-foot-corridor`=Foot Corridor [Base] → `PASSAGE_PROPS`; `TOWER-ASTRONOMY-NW:base-telescope-maintenance`=Telescope Maintenance [Base] → `UTILITY_ROOM`; `TOWER-ASTRONOMY-NW:mid-observation-prep`=Observation Prep [Mid] → —; `TOWER-ASTRONOMY-NW:mid-star-map-store`=Star-Map Store [Mid] → `STORAGE`; `TOWER-ASTRONOMY-NW:top-astronomy-classroom`=Astronomy Classroom [Top] → `ASTRONOMY_OBSERVATORY`; `TOWER-ASTRONOMY-NW:top-observatory`=Observatory [Top] → `ASTRONOMY_OBSERVATORY`.

#### `TOWER-HEADMASTER-S-N-CENTER` [tower] — Headmaster's N/Center
`TOWER-HEADMASTER-S-N-CENTER:entry-gargoyle-spiral-stair`=Gargoyle Spiral Stair [Entry] → `PASSAGE_PROPS`; `TOWER-HEADMASTER-S-N-CENTER:entry-waiting-room`=Waiting Room [Entry] → `RECEPTION`; `TOWER-HEADMASTER-S-N-CENTER:top-headmaster-s-office`=Headmaster's Office [Top] → `HEADMASTER_OFFICE`; `TOWER-HEADMASTER-S-N-CENTER:top-instrument-room`=Instrument Room [Top] → —; `TOWER-HEADMASTER-S-N-CENTER:top-archive`=Archive [Top] → `ARCHIVE`.

#### `TOWER-CLOCK-TOWER-SW` [curved] — Clock Tower SW
`TOWER-CLOCK-TOWER-SW:base-clock-tower-hall`=Clock Tower Hall [Base] → —; `TOWER-CLOCK-TOWER-SW:base-timekeeper-room`=Timekeeper Room [Base] → `OFFICE`; `TOWER-CLOCK-TOWER-SW:mid-gearwork-chamber`=Gearwork Chamber [Mid] → `TOWER_CLOCKWORK`; `TOWER-CLOCK-TOWER-SW:mid-clock-maintenance`=Clock Maintenance [Mid] → `TOWER_CLOCKWORK`; `TOWER-CLOCK-TOWER-SW:top-great-pendulum`=Great Pendulum [Top] → `TOWER_CLOCKWORK`; `TOWER-CLOCK-TOWER-SW:top-bell-check-chamber`=Bell Check Chamber [Top] → —.

#### `TOWER-BELL-TOWER-N` [tower] — Bell Tower N
`TOWER-BELL-TOWER-N:base-bell-gear-room`=Bell Gear Room [Base] → `TOWER_CLOCKWORK`; `TOWER-BELL-TOWER-N:top-belfry`=Belfry [Top] → `TOWER_CLOCKWORK`; `TOWER-BELL-TOWER-N:top-bell-control-room`=Bell Control Room [Top] → `TOWER_CLOCKWORK`.

#### `TOWER-FACULTY-TOWER-S` [windows] — Faculty Tower S
`TOWER-FACULTY-TOWER-S:entry-faculty-entrance`=Faculty Entrance [Entry] → —; `TOWER-FACULTY-TOWER-S:entry-staff-duty-room`=Staff Duty Room [Entry] → —; `TOWER-FACULTY-TOWER-S:mid-staff-quarters-corridor`=Staff Quarters Corridor [Mid] → `PASSAGE_PROPS`; `TOWER-FACULTY-TOWER-S:mid-staff-lounge`=Staff Lounge [Mid] → `LOUNGE`; `TOWER-FACULTY-TOWER-S:top-infirmary-link-corridor`=Infirmary Link Corridor [Top] → `PASSAGE_PROPS`; `TOWER-FACULTY-TOWER-S:top-closed-staff-meeting-room`=Closed Staff Meeting Room [Top] → `MEETING_CLUB`.

#### `TOWER-DADA-TOWER-E` [tee] — DADA Tower E
`TOWER-DADA-TOWER-E:base-dada-tower-hall`=DADA Tower Hall [Base] → —; `TOWER-DADA-TOWER-E:mid-tower-wand-practice-room`=Tower Wand-Practice Room [Mid] → `MAGIC_PRACTICE`; `TOWER-DADA-TOWER-E:top-upper-dada-corridor`=Upper DADA Corridor [Top] → `PASSAGE_PROPS`; `TOWER-DADA-TOWER-E:top-auxiliary-office`=Auxiliary Office [Top] → `OFFICE`.
Pointers: F2W, F2W.

#### `TOWER-GRAND-STAIRCASE-TOWER-CENTER` [cross] — Grand Staircase Tower Center
`TOWER-GRAND-STAIRCASE-TOWER-CENTER:base-grand-staircase`=Grand Staircase [Base] → `PASSAGE_PROPS`; `TOWER-GRAND-STAIRCASE-TOWER-CENTER:base-stair-check-room`=Stair Check Room [Base] → `PASSAGE_PROPS`; `TOWER-GRAND-STAIRCASE-TOWER-CENTER:mid-portrait-link-corridor`=Portrait Link Corridor [Mid] → `PASSAGE_PROPS`; `TOWER-GRAND-STAIRCASE-TOWER-CENTER:mid-mid-floor-guardroom`=Mid-Floor Guardroom [Mid] → `GUARDROOM`; `TOWER-GRAND-STAIRCASE-TOWER-CENTER:top-directory-sign-store`=Directory Sign Store [Top] → `STORAGE`.
Pointers: F8N.


## 3. WORLD_NON_TEMPLATE — WIZARDING WORLD REGIONS

**Owner:** nơi **ngoài** 13 fixed templates. Dữ liệu nhà/phòng dưới đây là `place/room` để PC/NPC định vị; **không biến mỗi phòng thành fixed template**. Với làng/đô thị không có template riêng, giữ nguyên khu chủ quản và chỉ dựng macro/cluster khi cần. Hogsmeade Outskirts/Mountain và Sirius's Cave đã thuộc `h1`, **không lặp trong mục này**.

### `LONDON` — LONDON OUTSIDE FIXED ALLEYS/STATIONS
- **Streets & other Stations:** Charing Cross Rd; Tottenham Court Rd & Cafe; Paddington; 10 Downing St; Purge & Dowse. (King's Cross khi **trong ga** → `express`; Diagon/Knockturn/Leaky Cauldron → `diagon-knockturn`.)
- **St Mungo's:** G (Reception, Artefact Accidents) | F1 (Creature Injuries) | F2 (Magical Bugs/Diseases) | F3 (Potion/Plant Poisoning) | F4 (Spell Damage, Janus Thickey Ward) | F5 (Tearoom, Hospital Shop).
- **12 Grimmauld Place:** Hall; Kitchen; Drawing Room; Sirius's/Regulus's/Other Bedrooms; plus #11 & #13.
- **Wool's Orphanage:** Riddle's Room; Matron's Office.

### `ENGLAND_REGIONS`
- **Little Whinging, Surrey:** #4 Privet Drive (Living/Dining/Kitchen; Harry's/Dudley's/Master Bedrooms; Cupboard Under Stairs; Garden); #7 Privet Dr; Magnolia Crescent (#2)/Rd; Park; Mrs Figg's House.
- **Ottery St Catchpole:** The Burrow (Kitchen; Living Room; Master/Ron's/Ginny's/Twins'/Other Bedrooms; Attic; Garden; Rear Pitch); Lovegood House (Living; Luna's Room; Xenophilius's Study; Garden); Diggory Home; Fawcett Home.
- **Historic Villages & Manors:** Godric's Hollow (Square; Church; Graveyard; Potter Cottage; Bathilda's; Dumbledore Home); Little/Great Hangleton (Riddle House; Graveyard; Gaunt Shack; Hanged Man Pub); Cokeworth (Spinner's End/Snape's House; Railview Hotel); Wiltshire → Malfoy Manor (Grounds; Hall; Drawing Room; Cellars); Tinworth → Shell Cottage (Kitchen; Living; Bedrooms; Garden; Coast).
- **Other:** Budleigh Babberton/Slughorn's; Upper Flagley; Forest of Dean Camp; Hut-on-the-Rock; Unmapped Homes: Muriel/Hepzibah/Moody/Crouch/Longbottom/Tonks/Shacklebolt/Granger/Diggle/Gregorovitch.

### `TRANSIT_AND_INTL`
- Knight Bus; Azkaban (Cells); Romanian Dragon Sanctuary; Ilvermorny (MA); MACUSA (NY); Horcrux Sea Cave (Underground Lake/Island); Quidditch World Cup (Campsite/Stadium); Egyptian Tombs.

## 4. AU LOCATIONS — MAP STATUS

**Owner:** AU là vùng riêng; `ACTIVE` dùng map AU tương ứng nếu PC thật sự ở đó. `LOCKED/UNBUILT` không tự tạo hay mở map; narrative RP chỉ khi story-gated.

### ACTIVE (USE)
#### `AU-PC-HOME` [auto] ACTIVE — PC Home — London
`AU-PC-HOME:basement-utility`=Utility [Basement] → `UTILITY_ROOM`; `AU-PC-HOME:basement-laundry`=Laundry [Basement] → `LAUNDRY`; `AU-PC-HOME:basement-store`=Store [Basement] → `STORAGE`; `AU-PC-HOME:basement-workshop`=Workshop [Basement] → `WORKSHOP`; `AU-PC-HOME:f1-hall`=Hall [F1] → —; `AU-PC-HOME:f1-living`=Living [F1] → `LOUNGE`; `AU-PC-HOME:f1-dining`=Dining [F1] → —; `AU-PC-HOME:f1-kitchen`=Kitchen [F1] → `KITCHEN`; `AU-PC-HOME:f1-rear-porch-garden`=Rear Porch/Garden [F1] → —; `AU-PC-HOME:f2-master-bedroom`=Master Bedroom [F2] → `BEDROOM`; `AU-PC-HOME:f2-study`=Study [F2] → `STUDY_ROOM`; `AU-PC-HOME:f2-bath`=Bath [F2] → —; `AU-PC-HOME:f3-pc-s-room`=PC's Room [F3] → —; `AU-PC-HOME:f3-guest-room`=Guest Room [F3] → —; `AU-PC-HOME:attic-hobby-room`=Hobby Room [Attic] → —; `AU-PC-HOME:attic-loft-store`=Loft Store [Attic] → `STORAGE`.

#### `AU-CCC-07-18` [auto] ACTIVE — CCC 07.18 — Hogwarts F8W
`AU-CCC-07-18:anteroom`=Anteroom → `RECEPTION`; `AU-CCC-07-18:inter-house-mail-room`=Inter-House Mail Room → —; `AU-CCC-07-18:writing-room`=Writing Room → —; `AU-CCC-07-18:records-store`=Records Store → `ARCHIVE`; `AU-CCC-07-18:inter-house-meeting-room`=Inter-House Meeting Room → `MEETING_CLUB`.
F8 W Senior Clubs / CCC → AU-CCC-07-18 là route, không duplicate.

#### `AU-LIAD-S-ATTIC` [auto] ACTIVE — Liad's Attic — Hogwarts
`AU-LIAD-S-ATTIC:liad-s-attic-loft`=Liad's Attic Loft → `BEDROOM`.


### LOCKED MAP (LOCKED / UNBUILT)
#### `AU-WHITECAP-ESTATE` [auto] LOCKED — Whitecap Estate — Isle of Wight
`AU-WHITECAP-ESTATE:grounds-villa`=Villa [Grounds] → —; `AU-WHITECAP-ESTATE:grounds-garden`=Garden [Grounds] → —; `AU-WHITECAP-ESTATE:grounds-pool`=Pool [Grounds] → —; `AU-WHITECAP-ESTATE:grounds-beach`=Beach [Grounds] → —; `AU-WHITECAP-ESTATE:grounds-guesthouse`=Guesthouse [Grounds] → —; `AU-WHITECAP-ESTATE:grounds-coop`=Coop [Grounds] → —; `AU-WHITECAP-ESTATE:grounds-dock`=Dock [Grounds] → —; `AU-WHITECAP-ESTATE:f1-hall`=Hall [F1] → —; `AU-WHITECAP-ESTATE:f1-living`=Living [F1] → `LOUNGE`; `AU-WHITECAP-ESTATE:f1-dining`=Dining [F1] → —; `AU-WHITECAP-ESTATE:f1-library`=Library [F1] → `LIBRARY`; `AU-WHITECAP-ESTATE:f1-d-d-room`=D&D Room [F1] → —; `AU-WHITECAP-ESTATE:f1-kitchen`=Kitchen [F1] → `KITCHEN`; `AU-WHITECAP-ESTATE:f1-veranda`=Veranda [F1] → —; `AU-WHITECAP-ESTATE:f1-sunroom`=Sunroom [F1] → —; `AU-WHITECAP-ESTATE:f2-family-guest-bedrooms`=Family/Guest Bedrooms [F2] → `BEDROOM`; `AU-WHITECAP-ESTATE:f2-lounge`=Lounge [F2] → `LOUNGE`; `AU-WHITECAP-ESTATE:f2-balcony`=Balcony [F2] → —; `AU-WHITECAP-ESTATE:attic-loft`=Loft [Attic] → —; `AU-WHITECAP-ESTATE:attic-store`=Store [Attic] → `STORAGE`; `AU-WHITECAP-ESTATE:attic-hobby`=Hobby [Attic] → —.

- **Other locked sites:** 7 Rowan Mews (London); WzW House (Soho); Loft 5A (Fitzrovia); Grayhaven Estate (California).

## 5. QUICK ROUTING TEST

`Sirius's Cave→h1` · `Owlery→h2` · `Hagrid's Hut→h1` · `Great Hall→hall` · `DADA F2W→HOGWARTS_INTERIOR` · `Honeydukes→village-static` · `WWW→diagon-knockturn` · `Quidditch Approach→h1` · `Changing Rooms→pitch-static` · `Hogsmeade Platform→express:station` · `Train Compartment→express:train` · `CCC 07.18→AU ACTIVE`.

**Invariant:** Mỗi lượt `/map` xác định đúng 1 owner theo PC; trong owner có thể đặt nhiều marker PC/NPC/POI. Không dựng map con cho nhà/tiệm/phòng đã thuộc fixed template.

## 6. ID CONTRACT — dùng trực tiếp trong MAP_DATA

`atlasAnchor` = ID Fixed/cụm dưới đây; `pcPlace` và `placeId` dùng ID địa điểm. `places[].type` = ID nội thất, không phải địa điểm. Giữ name để hiển thị. ID địa điểm không có artwork riêng là khóa runtime của chính phòng Atlas đó, không phải Fixed mới. Khu World dùng ID vùng + places RP cụ thể; không tự dựng toàn vùng. `express` là một Fixed; station/train là vị trí, không phải template mới. Các quy tắc scope/structure/AU của master plan ưu tiên; LOCKED không tự mở từ tên và không phủ quyết RP cụ thể đã được phép minh họa.

### 6.1. ID nội thất có thật trong source
- `HEADMASTER_OFFICE` = Văn phòng Hiệu trưởng
- `DIVINATION_CLASSROOM` = Phòng Tiên tri
- `ASTRONOMY_OBSERVATORY` = Đài thiên văn
- `PREFECTS_BATHROOM` = Phòng tắm Huynh trưởng
- `ROOM_OF_REQUIREMENT` = Phòng Yêu Cầu
- `CHAMBER_OF_SECRETS` = Phòng chứa Bí mật
- `TOWER_CLOCKWORK` = Máy tháp / tháp chuông
- `BALLROOM` = Phòng khiêu vũ
- `TROPHY_ROOM` = Phòng Cúp
- `CLASSROOM` = Lớp học lý thuyết
- `MAGIC_PRACTICE` = Thực hành phép thuật
- `POTIONS_LAB` = Phòng Độc dược
- `RESEARCH_LAB` = Phòng nghiên cứu
- `OFFICE` = Phòng làm việc
- `STUDY_ROOM` = Phòng tự học
- `MEETING_CLUB` = Phòng họp / CLB
- `LIBRARY` = Thư viện
- `ARCHIVE` = Kho hồ sơ
- `STORAGE` = Kho đồ
- `WORKSHOP` = Xưởng chế tác
- `GALLERY` = Phòng trưng bày
- `MUSIC_ROOM` = Phòng nhạc
- `LOUNGE` = Phòng khách / nghỉ
- `BEDROOM` = Phòng ngủ
- `KITCHEN` = Phòng bếp
- `DINING_ROOM` = Phòng ăn
- `BATHROOM` = Phòng tắm thường
- `LAUNDRY` = Phòng giặt
- `HOSPITAL_WARD` = Bệnh xá
- `RECEPTION` = Tiếp tân / chờ
- `GUARDROOM` = Phòng trực gác
- `PASSAGE_PROPS` = Trang trí hành lang
- `UTILITY_ROOM` = Phòng kỹ thuật
- `SECURE_VAULT` = Kho bảo mật
- `DETENTION_CELL` = Buồng giam
- `PUBLIC_COUNTER` = Quầy hàng / quán nhỏ
- `CEREMONY_HALL` = Phòng nghi lễ
- `ENTRANCE_VESTIBULE` = Sảnh vào / tiền sảnh
- `CLOAKROOM_LOCKERS` = Phòng áo khoác / tủ đồ
- `ART_CARTOGRAPHY_STUDIO` = Xưởng mỹ thuật / bản đồ
- `GAMES_ROOM` = Phòng cờ / Gobstones

`empty` = không dùng recipe nền; công năng mới vẫn hợp lệ và có fallback. Không cần gửi ID element rời.

### 6.2. ID phòng/nhóm trên 13 Fixed

#### `h1`
`region-4`=Rừng Cấm; `region-3`=Hồ Đen; `region:station-dock`=Bến ga; `region-0`=Lâu đài Hogwarts; `region:extra:5`=Nhà Hagrid; `region:extra:2`=Cây Liễu Roi; `region:extra:0`=Nhà kính; `region:extra:1`=Nhà cú; `region:extra:4`=Sân Quidditch; `region:extra:7`=Bãi học bay; `region:extra:8`=Sân đón tiếp; `region-5`=Cổng trường; `region-1`=Hogsmeade; `region-6`=Lều Hét; `region-2`=Ga Hogsmeade; `suspension-bridge`=Cầu treo; `lakeside-boathouse`=Nhà thuyền ven hồ; `lakeside-tree`=Cây cổ thụ · Bãi cỏ ven hồ; `train-v5`=Tàu tốc hành Hogwarts; `village-house-0`=Tiệm Công tước Mật; `village-house-1`=Tiệm giỡn Zonko; `village-house-2`=Tiệm trang phục Gladrags; `village-house-3`=Tiệm bút lông Scrivenshaft; `village-house-4`=Bưu điện Cú; `village-house-5`=Quán Ba Cây Chổi Thần; `village-house-6`=Tiệm Dervish và Banges; `village-house-7`=Hog’s Head; `village-house-8`=Quán trà bà Puddifoot; `village-house-9`=Apothecary.

#### `h2`
`h2-place-0`=Hồ Đen; `h2-place-1`=Đường vào trường; `h2-place-2`=Đường ven hồ; `h2-place-3`=Sân đài rồng hai chân; `h2-place-4`=Sân tầm gửi; `h2-place-5`=Sân đón tiếp; `h2-place-6`=Cánh Bắc; `h2-place-7`=Đại Sảnh; `h2-place-8`=Thư viện · Cánh Đông Bắc; `h2-place-9`=Tháp phía Bắc; `h2-place-10`=Tháp tròn Tây Bắc; `h2-place-11`=Tháp góc Bắc; `h2-place-12`=Tháp Đông Bắc; `h2-place-13`=Cánh Tây · Khu học tập; `h2-place-14`=Cánh Đông · Khu học tập; `h2-place-15`=Dãy nhà Bắc chung hai sân; `h2-place-16`=Hành lang Bắc · Sân rồng hai chân; `h2-place-17`=Hành lang Bắc · Sân tầm gửi; `h2-place-18`=Dãy nhà chung chia hai sân; `h2-place-19`=Dãy nhà Nam chung hai sân; `h2-place-20`=Cổng xuyên vào sân rồng hai chân; `h2-place-21`=Lối đá · Cổng xuyên vào sân rồng hai chân; `h2-place-22`=Cổng xuyên vào sân tầm gửi; `h2-place-23`=Lối đá · Cổng xuyên vào sân tầm gửi; `h2-place-24`=Tháp Tây Nam; `h2-place-25`=Tháp đầu cầu; `h2-place-26`=Đài phun rồng hai chân; `h2-place-27`=Cây tầm gửi sân trong; `h2-place-28`=Nhà nguyện · Cánh Tây Nam; `h2-place-29`=Sảnh vào lâu đài; `h2-place-30`=Tháp sảnh vào · Tây; `h2-place-31`=Tháp sảnh vào · Đông; `h2-place-32`=Hành lang sân trước · Tây; `h2-place-33`=Hành lang sân trước · Đông; `h2-place-34`=Bậc thềm và cổng chính; `h2-place-35`=Tháp cổng · Tây; `h2-place-36`=Tháp cổng · Đông; `h2-place-37`=Ghế đá 1; `h2-place-38`=Ghế đá 2; `h2-place-39`=Ghế đá 3; `h2-place-40`=Ghế đá 4; `h2-place-41`=Ghế đá 5; `h2-place-42`=Ghế đá 6; `h2-place-43`=Đường tới mé Rừng Cấm; `h2-place-44`=Đường nhà kính và vườn thực vật; `h2-place-45`=Đường nối đầu cầu gỗ tới nhà Hagrid; `h2-place-46`=Đường lên nhà cú; `h2-place-47`=Đường tới bãi Liễu Roi; `h2-place-48`=Đường dạo bờ hồ và nhà cú; `h2-place-49`=Mé Rừng Cấm; `h2-place-50`=Sân Quidditch; `h2-place-51`=Lối ra sân Quidditch; `h2-place-52`=Cầu gỗ Hogwarts · Mẫu H1; `h2-place-53`=Chiếu nghỉ hai đầu cầu gỗ; `h2-place-54`=Nhà kính · Vườn thực vật; `h2-place-55`=Vườn thảo dược ngoài trời; `h2-place-56`=Nhà Hagrid · Lục giác; `h2-place-57`=Vườn bí và hàng rào; `h2-place-58`=Cầu cạn đá lên nhà cú; `h2-place-59`=Nhà cú; `h2-place-60`=Cây cổ thụ ven hồ; `h2-place-61`=Liễu Roi · Cây liễu gai; `h2-place-62`=Cây cảnh quan 1; `h2-place-63`=Cây cảnh quan 2; `h2-place-64`=Cây cảnh quan 3; `h2-place-65`=Cây cảnh quan 4; `h2-place-66`=Cây cảnh quan 5; `h2-place-67`=Cây cảnh quan 6; `h2-place-68`=Cây cảnh quan 7; `h2-place-69`=Vòng gôn Quidditch; `h2-place-70`=Khán đài Quidditch; `h2-place-71`=Cổng sân Quidditch.

#### `hall`
`gf-courtyard`=Sân trong tầng trệt; `gf-staff`=Phòng giáo viên; `gf-filch`=Văn phòng Filch; `gf-class11`=Lớp học 11 · phòng chưa dùng; `gf-waiting`=Gian chờ trước Phân loại; `gf-antechamber`=Phòng nhỏ sau bàn giáo viên; `gf-dais`=Đại Sảnh · Bệ giáo viên; `gf-table-0`=Bàn Gryffindor; `gf-table-1`=Bàn Hufflepuff; `gf-table-2`=Bàn Ravenclaw; `gf-table-3`=Bàn Slytherin; `gf-entrance`=Tiền sảnh; `gf-main-stairs`=Cầu thang đá cẩm thạch · lên tầng trên; `gf-hourglasses`=Đồng hồ cát điểm bốn nhà; `gf-downstairs`=Lối xuống tầng dưới · bếp và Hufflepuff; `gf-broom`=Tủ chổi.

#### `ministry2`
`min-level-1`=Tầng 1 · Bộ trưởng; `min-level-2`=Tầng 2 · Thi hành Luật Pháp thuật; `min-level-3`=Tầng 3 · Tai nạn và Thảm họa Pháp thuật; `min-level-4`=Tầng 4 · Điều hòa và Kiểm soát Sinh vật; `min-level-5`=Tầng 5 · Hợp tác Pháp thuật Quốc tế; `min-level-6`=Tầng 6 · Giao thông Pháp thuật; `min-level-7`=Tầng 7 · Trò chơi và Thể thao Pháp thuật.

#### `express`
`coach-0-corridor`=Hành lang sát mép toa · Gryffindor; `coach-0-room-1`=Gryffindor · Buồng 1; `coach-0-room-2`=Gryffindor · Buồng 2; `coach-0-room-3`=Gryffindor · Buồng 3; `coach-0-room-4`=Gryffindor · Buồng 4; `coach-0-room-5`=Gryffindor · Buồng 5; `coach-0-vestibule`=Đầu toa và xe đồ ăn; `coach-1-corridor`=Hành lang sát mép toa · Hufflepuff; `coach-1-room-1`=Hufflepuff · Buồng 1; `coach-1-room-2`=Hufflepuff · Buồng 2; `coach-1-room-3`=Hufflepuff · Buồng 3; `coach-1-room-4`=Hufflepuff · Buồng 4; `coach-1-room-5`=Hufflepuff · Buồng 5; `coach-1-vestibule`=Đầu toa và xe đồ ăn; `coach-2-corridor`=Hành lang sát mép toa · Ravenclaw; `coach-2-room-1`=Ravenclaw · Buồng 1; `coach-2-room-2`=Ravenclaw · Buồng 2; `coach-2-room-3`=Ravenclaw · Buồng 3; `coach-2-room-4`=Ravenclaw · Buồng 4; `coach-2-room-5`=Ravenclaw · Buồng 5; `coach-2-vestibule`=Đầu toa và xe đồ ăn; `coach-3-corridor`=Hành lang sát mép toa · Slytherin; `coach-3-room-1`=Slytherin · Buồng 1; `coach-3-room-2`=Slytherin · Buồng 2; `coach-3-room-3`=Slytherin · Buồng 3; `coach-3-room-4`=Slytherin · Buồng 4; `coach-3-room-5`=Slytherin · Buồng 5; `coach-3-vestibule`=Đầu toa và xe đồ ăn; `ex-standard`=Toa thường · Ghế dài hai bên; `ex-kings`=ex-kings; `ex-station`=ex-station; `ex-coach-0`=ex-coach-0; `ex-coach-1`=ex-coach-1; `ex-coach-2`=ex-coach-2.

#### `gryffindor-common`
`gryffindor-hearth`=Lò sưởi và khu ngồi chung; `gryff-stairs-0`=Cầu thang khu ngủ nam; `gryff-stairs-1`=Cầu thang khu ngủ nữ; `gryff-entry`=Cửa chân dung Bà Béo; `gryffindor-sleep-0`=Gryffindor · Tầng ngủ mẫu · Cụm 1; `gryffindor-sleep-1`=Gryffindor · Tầng ngủ mẫu · Cụm 2; `gryffindor-return-0`=Cầu thang về phòng chung; `gryffindor-return-1`=Cầu thang về phòng chung.

#### `ravenclaw-common`
`ravenclaw-hearth`=Khu sinh hoạt và đọc sách; `raven-entry`=Cửa đại bàng và cầu thang xoắn; `raven-dorm-door`=Cửa tới khu ngủ; `raven-rowena`=Tượng Rowena Ravenclaw; `ravenclaw-sleep-0`=Ravenclaw · Tầng ngủ mẫu · Cụm 1; `ravenclaw-sleep-1`=Ravenclaw · Tầng ngủ mẫu · Cụm 2; `ravenclaw-return`=Cầu thang về phòng chung.

#### `hufflepuff-common`
`huff-barrels`=Lối thùng gỗ Hufflepuff; `huff-lounge`=Phòng chung Hufflepuff; `huff-dorm-0`=Đường hầm tới khu ngủ; `huff-dorm-1`=Đường hầm tới khu ngủ; `huff-up`=Lối về tầng trệt; `hufflepuff-bed-0`=Giường và rương cá nhân; `hufflepuff-bed-1`=Giường và rương cá nhân; `hufflepuff-bed-2`=Giường và rương cá nhân; `hufflepuff-bed-3`=Giường và rương cá nhân; `hufflepuff-bed-4`=Giường và rương cá nhân; `hufflepuff-dorm-return`=Trở về phòng chung.

#### `slytherin-common`
`sly-lounge`=Phòng chung Slytherin; `sly-lake`=Cửa sổ nhìn ra Hồ Đen; `sly-door`=Cửa đá kín; `sly-study`=Bàn học và tủ sách; `sly-dorm`=Hành lang tới khu ngủ; `sly-up`=Lối lên tầng trệt; `slytherin-bed-0`=Giường và tủ cá nhân; `slytherin-bed-1`=Giường và tủ cá nhân; `slytherin-bed-2`=Giường và tủ cá nhân; `slytherin-bed-3`=Giường và tủ cá nhân; `slytherin-bed-4`=Giường và tủ cá nhân; `slytherin-dorm-return`=Trở về phòng chung.

#### `village-static`
`v-home-0`=Nhà dân · Ngõ 0; `v-home-1`=Nhà dân · Ngõ 1; `v-home-3`=Nhà dân · Ngõ 3; `v-home-4`=Nhà dân · Ngõ 4; `v-home-6`=Nhà dân · Ngõ 6; `v-home-7`=Nhà dân · Ngõ 7; `v-home-9`=Nhà dân · Ngõ 9; `v-home-11`=Nhà dân · Ngõ 11; `v-home-12`=Nhà dân · Ngõ 12; `v-home-13`=Nhà dân · Ngõ 13; `v-home-14`=Nhà dân · Ngõ 14; `v-home-16`=Nhà dân · Ngõ 16; `v-home-17`=Nhà dân · Ngõ 17; `v-home-18`=Nhà dân · Ngõ 18; `v-home-21`=Nhà dân · Ngõ 21; `v-home-22`=Nhà dân · Ngõ 22; `v-home-23`=Nhà dân · Ngõ 23; `v-home-24`=Nhà dân · Ngõ 24; `v-home-27`=Nhà dân · Ngõ 27; `v-home-28`=Nhà dân · Ngõ 28; `v-home-29`=Nhà dân · Ngõ 29; `v-home-30`=Nhà dân · Ngõ 30; `v-honeydukes`=Tiệm Công tước Mật; `v-broomsticks`=Quán Ba Cây Chổi Thần; `v-zonkos`=Tiệm giỡn Zonko; `v-gladrags`=Tiệm trang phục Gladrags; `v-post`=Bưu điện cú; `v-quills`=Tiệm bút lông Scrivenshaft; `v-dervish`=Tiệm Dervish và Banges; `v-puddifoot`=Quán trà bà Puddifoot; `v-hogshead`=Quán Đầu Heo; `v-shack`=Lều Hét; `v-square`=Quảng trường Hogsmeade; `v-school`=Đường về Hogwarts; `v-station`=Đường tới ga Hogsmeade.

#### `pitch-static`
`q-building-0`=Phòng thay đồ · Đội A; `q-building-1`=Phòng thay đồ · Đội B; `q-building-2`=Kho chổi; `q-commentary`=Bục bình luận; `q-field`=Sân Quidditch; `q-stand-0-0`=Khán đài 1; `q-stand-0-1`=Khán đài 2; `q-stand-0-2`=Khán đài 3; `q-stand-0-3`=Khán đài 4; `q-stand-1-0`=Khán đài 5; `q-stand-1-1`=Khán đài 6; `q-stand-1-2`=Khán đài 7; `q-stand-1-3`=Khán đài 8; `q-campus`=Đường về Hogwarts.

#### `diagon-knockturn`
`da-potage`=Tiệm vạc Potage; `da-malkin`=Tiệm áo chùng của phu nhân Malkin; `da-ollivanders`=Tiệm đũa phép Ollivanders; `da-scribbulus`=Văn phòng phẩm Scribbulus; `da-eeylops`=Tiệm cú Eeylops; `da-flourish`=Tiệm sách Phú Quý và Cơ Hàn; `da-house-a`=Số 47 · Tiệm đóng sách; `da-quidditch`=Tiệm dụng cụ Quidditch cao cấp; `da-menagerie`=Tiệm sinh vật huyền bí; `da-twilfitt`=Tiệm trang phục Twilfitt và Tatting; `da-gambol`=Tiệm đồ giỡn Gambol và Japes; `da-apothecary`=Tiệm bào chế độc dược; `da-goods`=Tiệm đồ cũ; `da-print`=Tiệm bản in và giấy da; `da-weasleys`=Tiệm giỡn của anh em Weasley; `da-tailor`=Tiệm áo choàng du hành; `da-optics`=Tiệm kính thiên văn và dụng cụ; `da-gold`=Tiệm kim hoàn bạc; `da-stationery`=Tiệm giấy da và bút lông; `da-leaky`=Quán Cái Vạc Lủng; `da-brick-gateway`=Cổng gạch sau Cái Vạc Lủng; `da-gringotts`=Ngân hàng Gringotts; `ka-stair`=Lối xuống Knockturn; `ka-block-0`=Nhà dân; `ka-block-1`=Nhà dân; `ka-block-2`=Nhà dân; `ka-block-3`=Nhà dân; `ka-block-4`=Nhà dân; `ka-block-5`=Nhà dân; `ka-block-6`=Nhà dân; `ka-block-7`=Nhà dân; `ka-block-8`=Nhà dân; `ka-block-9`=Nhà dân; `ka-block-10`=Nhà dân; `ka-block-11`=Nhà dân; `ka-block-12`=Nhà dân; `ka-block-13`=Nhà dân; `ka-block-14`=Nhà dân; `ka-block-15`=Nhà dân; `ka-entrance`=Số 2 · Tiệm đồ lạ cũ; `ka-candles`=Tiệm nến và đồ lạ; `ka-upper`=Tiệm cầm đồ cũ; `ka-borgin`=Tiệm Borgin và Burkes; `ka-relics`=Tiệm di vật và đồ cổ; `ka-gloom`=Cửa tiệm đóng cửa; `ka-bones`=Tiệm đồ kỳ lạ; `ka-dealer`=Tiệm sách cổ; `ka-end`=Kho khóa kín; `ka-corner`=Tiệm đồ bạc và đồ lạ; `da-fortescue`=Tiệm kem Florean Fortescue; `da-robe-used`=Tiệm áo chùng cũ; `da-remedies`=Tiệm thảo dược; `da-obscurus`=Tiệm sách Obscurus; `da-wizardwear`=Tiệm trang phục phù thủy; `da-workshop`=Tiệm sửa vạc; `da-cafe`=Tiệm trà và cà phê; `da-terrace-7`=Nhà dân; `da-terrace-8`=Nhà dân; `da-terrace-9`=Nhà dân; `da-terrace-10`=Nhà dân; `da-terrace-11`=Nhà dân; `da-terrace-12`=Nhà dân; `da-terrace-13`=Nhà dân; `da-terrace-14`=Nhà dân; `da-terrace-15`=Nhà dân; `da-terrace-16`=Nhà dân; `da-terrace-17`=Nhà dân; `da-terrace-18`=Nhà dân; `da-terrace-19`=Nhà dân; `da-terrace-20`=Nhà dân; `da-terrace-21`=Nhà dân.

#### `ministry-8-10`
`mm-floo-in-0`=Mạng Floo · Lối đến 1; `mm-floo-out-0`=Mạng Floo · Lối đi 1; `mm-floo-in-1`=Mạng Floo · Lối đến 2; `mm-floo-out-1`=Mạng Floo · Lối đi 2; `mm-floo-in-2`=Mạng Floo · Lối đến 3; `mm-floo-out-2`=Mạng Floo · Lối đi 3; `mm-floo-in-3`=Mạng Floo · Lối đến 4; `mm-floo-out-3`=Mạng Floo · Lối đi 4; `mm-floo-in-4`=Mạng Floo · Lối đến 5; `mm-floo-out-4`=Mạng Floo · Lối đi 5; `mm-floo-in-5`=Mạng Floo · Lối đến 6; `mm-floo-out-5`=Mạng Floo · Lối đi 6; `mm-fountain`=Đài phun Huynh đệ Pháp thuật; `mm-visitor`=Lối vào dành cho khách · Luân Đôn; `mm-security`=Bàn kiểm tra an ninh; `mm-lift-8`=Thang máy · Tầng 8 → 9; `mm-up`=Thang máy · Bộ tầng 1–7; `mm-time`=Phòng Thời gian; `mm-prophecy`=Phòng Tiên tri; `mm-death`=Phòng Tử thần; `mm-brain`=Phòng Não; `mm-space`=Phòng Không gian; `mm-love`=Phòng Tình yêu · Khóa kín; `mm-rotunda`=Phòng xoay · Mười hai cửa; `mm-lift-9`=Thang máy · Tầng 9 → Tiền sảnh; `mm-stairs-9`=Cầu thang · Tầng 9 → 10; `mm-court`=Phòng xử án số Mười · Hội đồng Wizengamot; `mm-accused`=Ghế bị cáo; `mm-waiting`=PHÒNG CHỜ; `mm-office`=KHU HỖ TRỢ; `mm-escort`=TUYẾN ÁP GIẢI; `mm-stairs-10`=Cầu thang · Tầng 10 → 9.


### 6.3. World scope IDs

Các vùng World giữ nguyên nội dung mục 3; chỉ dựng places RP đang cần.
#### `LONDON` [auto]
.
#### `ENGLAND_REGIONS` [auto]
.
#### `TRANSIT_AND_INTL` [auto]
.
