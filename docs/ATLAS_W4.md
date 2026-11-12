# WZW NORMALIZED ATLAS — TEMPLATE ROUTING & WORLD LOCATIONS

> Bản ATLAS hoàn chỉnh đã tinh gọn để AI chọn map theo **vị trí thực tế của PC**. Giữ nguyên 13 fixed templates, các cụm Hogwarts không có fixed template, thế giới ngoài template và trạng thái AU.

## 0. ROUTING RULES

- **1 vị trí PC → 1 owner/map.** Chọn theo **vị trí thực của PC**, không theo NPC, nhiệm vụ hay địa điểm chỉ được nhắc. Nhà/tiệm/phòng trong fixed template là `place/marker` để click/đặt NPC; **không dựng map nội thất con**.
- **Ưu tiên:** `AU ACTIVE` đúng địa điểm → fixed template chuyên biệt (`hall`, house-common, village, pitch, express, diagon, ministry) → `HOGWARTS_INTERIOR` nếu đang trong phòng/hành lang/tháp chưa có fixed template → `h2` (khuôn viên lâu đài) → `h1` (ngoại cảnh Hogwarts–Hogsmeade ngoài các vùng trên) → `WORLD_NON_TEMPLATE`. `AU LOCKED` không mở map.
- **Ranh giới:** `h2` = trong khuôn viên lâu đài + cổng/sân/cầu/tháp cú; `h1` = ngoài khuôn viên nhưng trong vùng Hogwarts–Hogsmeade, trừ bên trong làng Hogsmeade, sân Quidditch, ga. Nhà Hagrid/nhà kính/phòng của chúng vẫn `h1`; nhà cú và phòng của nó vẫn `h2`.
- **Khu nhiều nhà:** PC vào Honeydukes/Three Broomsticks → `village-static`; vào WWW/Gringotts/Borgin & Burkes → `diagon-knockturn`. Focus/đặt marker vào nhà, **không đổi map**. Ngoài làng → `h1`; ngoài sân Quidditch → `h1`, vào trong sân → `pitch-static`.
- **Ga vs tàu:** `express:station` khi PC **ở trong ga/sân ga**; `express:train` **chỉ khi PC đã lên tàu**. Đường đến ga Hogwarts/Hogsmeade → `h1`; đường phố London ngoài ga → `WORLD_NON_TEMPLATE`.
- **Lâu đài:** `hall` sở hữu cụm F1 S/W và `Dedicated hall Inner Courtyard` riêng; sân lâu đài khác → `h2`. Phòng/tháp Hogwarts chưa có fixed template dùng `Floor → N/E/S/W → Cluster [layout] → Room` từ `recipes.mjs`, không phát sinh fixed template mỗi phòng.
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

**Owner:** các nội thất Hogwarts chưa thuộc 13 fixed templates. Chọn theo `Floor → Direction → Cluster [layout] → Room`; lấy recipe đúng tên trong `recipes.mjs`. `[layout]` giữ nguyên (`vertical`, `ell`, `horizontal`, `tee`, `cross`, `curved`, `cloister`, `court`, `windows`, `tower`). Các `→` bên dưới là **routing pointer**, không phải room duplicate.

### SUB-DUNGEONS (HẦM NGẦM)
- N Tech Tunnels [vertical]: Stone Corridor under Astronomy Tower; Alchemy Room; Coal/Fuel Store; Tower Foundation Check Room.
- E Relic Vaults [ell]: Chamber of Secrets Pipe; Chamber of Secrets; Ancient Vault Gatehouse; Sealed Vault Corridor.
- S Y1 Stone Chambers [horizontal]: Devil's Snare; Flying Keys; Wizard's Chess; Potions Trial; Final Mirror Chamber.
- W Ancient Study [tee]: Map Chamber; Undercroft; Archaeological Tool Store; Blueprint Room.

### DUNGEONS (HẦM NGỤC)
- N Potions Cluster [cross]: Potions Classroom; Snape's Office; Potions Ingredient Store; Practical Prep Room; Cauldron Washroom.
- E Slytherin Approach [curved]: →slytherin-common.
- S Under-Hall Service [horizontal]: Deathday Party Chamber; Cleaning Supply Store; Food Transit Corridor; House-Elf Duty Room; Furnace Tech Room.
- W Subterranean Classes [ell]: Astronomy Dungeon Corridor; Mineral Sorting Room; Empty Classroom HN-01; Old Cauldron Store; Potion Sample Archive.

### KITCHENS (TẦNG BẾP)
- N Kitchens & Service [tee]: Hogwarts Kitchens; Dry Food Store; Meal Prep Room; Scullery/Dishwashing; Kitchen Logistics Corridor.
- E Hufflepuff Approach [ell]: →hufflepuff-common.
- S Laundry & Linen [vertical]: Laundry Room; Linen Room; Tablecloth Store; Laundry Maintenance; South Storage Corridor.
- W Elf Quarters & Larder [cross]: House-Elf Quarters; Vegetable Larder; Kitchen Herb Store; Spare Utensil Store; West Basement Link Corridor.

### F1 (GROUND / TẦNG 1)
- N North Hall–Bell Tower [cloister]: North Hall; Bell Tower Foot Hall; North Gate Corridor; North Gate Guardroom; Practice Gear Store; Empty Classroom B-01.
- E Library Annex–Viaduct [cross]: Central Hall; Viaduct Entrance Hall; Greenhouse Link Corridor; New Pupil Reception; Central Hall Store; Empty Classroom Đ-01.
- S Great Hall Approach [tee]: →hall.
- W Transfig Courtyard Approach [court]: Transfiguration Courtyard Corridor; Quad Corridor; Cloakroom; Transfiguration Supply Store; →hall.

### F2 (TẦNG 2)
- N History & Transfiguration [horizontal]: History of Magic Classroom; McGonagall's Office; Transfiguration Classroom; Transfiguration Prep Room; History Book Store; Empty Classroom B-02.
- E Scholars Upper Walk [windows]: Muggle Studies Classroom; Hieroglyphics Room; North Hall Upper Corridor; Historical Model Archive; Teaching Map Store; Empty Classroom T-02.
- S Hospital & Faculty Access [ell]: Hospital Wing; Pomfrey's Office; Faculty Tower Access Corridor; Bandage/Dressing Room; Medical Supply Store; Infirmary Waiting Room.
- W DADA Teaching Cluster [tee]: DADA Classroom (tower door); Lower DADA Tower Corridor; DADA Auxiliary Room; Defence Practical Room; DADA Prop Store; Empty Classroom Đ-02.

### F3 (TẦNG 3)
- N Myrtle's Corridor [horizontal]: Myrtle's Bathroom; "Second-Floor" Corridor by Myrtle's Bathroom; Boys' Bathroom; Plumbing Store; Corridor Guardroom B-03.
- E Shortcut Stair Walk [curved]: Argyllshire Map Tapestry Corridor; Stair Safety Check Room; Empty Classroom T-03; Desk/Chair Store.
- S Supplemental Classes [vertical]: Basic Wand-Practice Room; Empty Classroom N-03; Study Equipment Store; TA Office; Small Student Lounge.
- W DADA Office Route [ell]: DADA Professor's Office (Lockhart 1992); DADA Office Corridor; DADA Parent Reception; Lesson Plan Archive; Empty Classroom Đ-03.

### F4 (TẦNG 4)
- N Trophy–Armour Gallery [windows]: Trophy Room; Armour Gallery; Music Room; Trophy Preservation Store; Ensemble Practice Room; Empty Classroom B-04.
- E Upper North Gallery [curved]: North Hall Upper Gallery Corridor; Educational Artefact Display; Empty Classroom T-04; Costume Store; Artefact Restoration Room.
- S Clubs & Group Work [cross]: Backup Duelling Practice Room; Club Prep Room; Public Speaking Room; Student Meeting Room; Empty Classroom N-04.
- W Charms & Forbidden Route [ell]: Charms Classroom; Charms Corridor; 1991 "Third-Floor" Forbidden Corridor; Fluffy's Trapdoor Chamber (1991); Charms Practical Room; Charms Supply Store.

### F5 (TẦNG 5)
- N Library & Restricted [cloister]: Hogwarts Library; Restricted Section; Pince's Office; Research Reading Room; Catalogue Index Room; Rare Book Store.
- E Long Gallery [windows]: Long Gallery; Arithmancy Classroom; Magical Cartography Room; Cipher/Cryptology Room; Empty Classroom Đ-05.
- S Fourth-Floor Walk & Mirror [ell]: Former 1991 Mirror of Erised Room; Old Secret Mirror Corridor; Library Records Archive; Empty Classroom N-05; Reading Room Store; Tapestry Shortcut Stair.
- W Ancient Runes [tee]: Ancient Runes Classroom; Runes Translation Room; History Seminar Room; Source Research Room; Empty Classroom T-05.

### F6 (TẦNG 6)
- N Prefects–Faculty Route [ell]: Prefects' Bathroom; Prefects' Bathroom Corridor; Upper Faculty Tower Corridor; Prefects' Lounge; Towel/Uniform Store; Empty Classroom B-06.
- E Intermediate Classes [horizontal]: Arithmancy Research Room; "Fifth-Floor" East Wing Corridor; Magical Art Room; Assignment/Chart Store; Empty Classroom Đ-06.
- S Clock Tower Ascent [curved]: Upper Clock Tower Corridor; Academic Club Room; Student Newspaper Room; Exhibit Gear Store; →Clock Tower (maintenance).
- W West High Windows [windows]: "Fifth-Floor" West Window Corridor; Small Ensemble Room; Quiet Reading Room; Empty Classroom T-06; Craft Supply Store.

### F7 (TẦNG 7)
- N Upper Stair Access [vertical]: Academic Achievement Archive; Grade Ledger Archive; Advanced Lesson Gear Store; Empty Classroom B-07; North Stair Corridor.
- E Seminar & Labs [cross]: "Sixth-Floor" Boys' Bathroom; Advanced Magic Seminar Room; Small Colloquium Room; Safe Lab; Empty Classroom Đ-07.
- S Faculty/Clock Link [ell]: Upper Faculty Tower Corridor; Staff Minutes Archive; Timetable Room; Reference Book Store; Empty Classroom N-07.
- W Games & Projects [windows]: Gobstones Room; Wizard's Chess Club Room; Student Project Room; Empty Classroom T-07; High Glass Corridor.

### F8 (TẦNG 8)
- N Headmaster Approach [tower]: Headmaster's Office Approach Corridor; Headmaster's Entrance Hall; Upper Grand Staircase Hall; Empty Classroom B-08; Academic Records Store.
- E Room of Requirement [horizontal]: "Seventh-Floor" Corridor outside RoR; Room of Requirement; Empty Classroom Đ-08; Academic Ceremony Room; Portrait Conservation Room.
- S Gryffindor Route [curved]: "Seventh-Floor" Study Group Room; "Seventh-Floor" Portrait Corridor; →gryffindor-common.
- W Senior Clubs / CCC [tee]: Empty Classroom T-08; →AU:CCC 07.18.

### HOGWARTS TOWERS (NỘI THẤT THÁP KHÔNG CÓ FIXED TEMPLATE)
- Gryffindor SW [tower]: →gryffindor-common | Ravenclaw W [tower]: →ravenclaw-common | West/Owlery W [tower]: →h2.
- North/Divination N [tower]: Approach (Spiral Stair, Star-Chart Archive) | Top (Divination Classroom, Divination Store).
- Astronomy NW [tower]: Base (Foot Corridor, Telescope Maintenance) | Mid (Observation Prep, Star-Map Store) | Top (Astronomy Classroom, Observatory).
- Headmaster's N/Center [tower]: Entry (Gargoyle Spiral Stair, Waiting Room) | Top (Headmaster's Office, Instrument Room, Archive).
- Clock Tower SW [curved]: Base (Clock Tower Hall, Timekeeper Room) | Mid (Gearwork Chamber, Clock Maintenance) | Top (Great Pendulum, Bell Check Chamber).
- Bell Tower N [tower]: Base (Bell Gear Room) | Top (Belfry, Bell Control Room).
- Faculty Tower S [windows]: Entry (Faculty Entrance, Staff Duty Room) | Mid (Staff Quarters Corridor, Staff Lounge) | Top (Infirmary Link Corridor, Closed Staff Meeting Room).
- DADA Tower E [tee]: Base (DADA Tower Hall, →F2W) | Mid (Tower Wand-Practice Room, →F2W) | Top (Upper DADA Corridor, Auxiliary Office).
- Grand Staircase Tower Center [cross]: Base (Grand Staircase, Stair Check Room) | Mid (Portrait Link Corridor, Mid-Floor Guardroom) | Top (Directory Sign Store, →F8N).

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
- **PC Home — London:** Basement (Utility; Laundry; Store; Workshop) | F1 (Hall; Living; Dining; Kitchen; Rear Porch/Garden) | F2 (Master Bedroom; Study; Bath) | F3 (PC's Room; Guest Room) | Attic (Hobby Room; Loft Store).
- **CCC 07.18 — Hogwarts F8W:** Anteroom; Inter-House Mail Room; Writing Room; Records Store; Inter-House Meeting Room. `F8 W Senior Clubs / CCC →AU:CCC 07.18` là route, không duplicate.
- **Liad's Attic — Hogwarts:** Liad's Attic Loft.

### LOCKED MAP (LOCKED / UNBUILT)
- **Whitecap Estate — Isle of Wight:** Grounds (Villa; Garden; Pool; Beach; Guesthouse; Coop; Dock) | F1 (Hall; Living; Dining; Library; D&D Room; Kitchen; Veranda; Sunroom) | F2 (Family/Guest Bedrooms; Lounge; Balcony) | Attic (Loft; Store; Hobby).
- **Other locked sites:** 7 Rowan Mews (London); WzW House (Soho); Loft 5A (Fitzrovia); Grayhaven Estate (California).

## 5. QUICK ROUTING TEST

`Sirius's Cave→h1` · `Owlery→h2` · `Hagrid's Hut→h1` · `Great Hall→hall` · `DADA F2W→HOGWARTS_INTERIOR` · `Honeydukes→village-static` · `WWW→diagon-knockturn` · `Quidditch Approach→h1` · `Changing Rooms→pitch-static` · `Hogsmeade Platform→express:station` · `Train Compartment→express:train` · `CCC 07.18→AU ACTIVE`.

**Invariant:** Mỗi lượt `/map` xác định đúng 1 owner theo PC; trong owner có thể đặt nhiều marker PC/NPC/POI. Không dựng map con cho nhà/tiệm/phòng đã thuộc fixed template.
