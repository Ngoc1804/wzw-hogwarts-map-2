### R14.6 — /MAP

## 1. STORY QUESTIONS — AUTHOR FILLS ONCE

1. Which sources define current state/history, NPCs/House/knowledge, Atlas and quests/Monthly Pack/Pool?
2. How many activity/quest slots? MAIN/SIDE/POOL/HIDDEN allocation? Does HIDDEN count in the total? What priority/substitution/Pool rules apply?
3. Which types use binoculars? Which use a magnifier? What Hidden eligibility applies?
4. Minimum NPC ribbons? Grouping rules? House/category→supported tag bindings? Unknown-person naming? Maximum 10 NPC ribbons, excluding PC.
5. Which materials fit new/custom spaces? Any location-specific requirements?
6. Any explicit AU/event routing exceptions or additional verified assets?

Runtime URL below is release-managed, not a story setting. Do not edit loader URLs during RP.

## 2. OPERATING RULES / FIELDS

- Gemini reads current narrative state and configured sources; engine renders only. No time advance, movement, accepted quest/reward or invented PC choice.
- Resolve PC location from context/history/Atlas before output. Never ask, leave blank, use unknown or report missing location. Use the supported current space; no invented travel/canonical address.
- Owner follows PC. Apply knowledge/access gates before JSON; never embed undiscovered secrets. Story questions define quotas/icons; engine never selects/fills them. Minimum NPC settings do not authorize invented arrivals.
- Visible text is Vietnamese. Each quote/activity/observation/description/detail/summary is one short sentence under 30 words. Quote is playful/poetic/lightly suggestive, not secret disclosure or invented speech.
- Output one complete fenced html document from Part 4; no prose, STATUS/BODY/META or separate JSON. Fill required values; omit unused optional fields. Escape literal < inside JSON strings as \u003c.

FIXED CANON: use existing artwork/interface unchanged. Inside a shop/house remains its location anchor. Only anchor PC/NPC/event markers and supply current map text. No props/propsMode/visual/size/architecture, added rooms/buildings, interior/detail views or extra UI. Places only carry existing-location text/bindings. AU/event exceptions must be explicit in configured routing, never inferred from indoors/a mentioned quest.

ROUTING: explicit separate schematic→sandbox; applicable Fixed→unchanged; new H1/H2 construction→sandbox; village/alley AU→available building binding (alley region required); non-Fixed Atlas→selected source cluster plus RP additions; World→one building/floor; otherwise named custom space. Custom sends mapMode indoor/outdoor explicitly; OUT_* recipe alone does not select Outdoor. No invented canon connections.

INTERIORS: select a suitable recipe by function; its inventory is automatic. Use individual furniture or whole groups for changes/custom furnishing; never duplicate recipe furniture. Missing recipe/asset→build named places/props with optional minimal visual; failed visuals retain fallback. Approved source layouts/colors remain intact. S/M/L defaults M. For new/custom spaces Gemini may internally seed material choice, retain it on refresh and send only final floor/wall; no seed field.

PROPS: merge keeps defaults plus changes; replace rebuilds complete desired furniture inventory, [] empties furniture, never architecture. ensure sets total; add increments/adds inventory. New explicit ID in merge requires add; replace permits new IDs. State-only edits omit count; 0/removed/missing/destroyed removes the whole target. Broken is a state marker. Edit whole objects/groups only: no tabletop components, parentId, childId, supportId or support-based placement. Existing instance IDs must be verified; never guess :final:N. New objects may use stable rp:* IDs. If exact targeting is unavailable, rebuild the required Generated furniture using replace. Fixed cannot be changed.

ACTORS: exactly one PC. Every NPC has a valid place and explicit spot. Determine identity/House/category/activity from sources; unknown names use observable descriptors. Group supported co-located people; runtime may also group >4 represented people in one room/spot, keeping PC separate and all RP information. Footstep visibility is map policy; do not promise hidden input always hides feet. Patrol requires current RP evidence and onPatrol:true.

EVENTS: valid place required. Select content/eligibility in prompt; binoculars→hidden:false, magnifier→hidden:true. Flag is presentation only. Opportunity≠accepted/completed quest. No category/pack/stage/reward/quota/icon fields.

FIELD REFERENCE (? optional; not output syntax)
```text
ROOT schemaVersion:"2.0.0",meta:{date,time,areaName,quote},atlasAnchor,pcPlace,pcSpot,places:PLACE[],actors:ACTOR[],events:EVENT[]
ROOT? mapMode:indoor|outdoor|template,layoutType:GEOMETRY,forceSandbox:boolean,region:diagon|knockturn
PLACE name,id?,type?:RECIPE|new-function,size?:S|M|L,description?,overhear?,region?,isNewConstruction?:boolean,architecture?:{floor?,wall?},propsMode?:merge|replace,props?:(string|PROP)[]
PROP name,item?:native-asset-ID,id?:instance-ID,count?:integer>=0,op?:ensure|add,state?:intact|broken|removed|missing|destroyed,zone?:ZONE,mount?:floor|wall,visual?:{shapes:SHAPE[]}
ACTOR name,isPC?:boolean,id?,placeId?,placeName?,spot?:inside|corridor|threshold|outdoor,zone?:ZONE,tagType?:TAG,activity?,observation?,members?:string[],summary?,footstep?:walk|idle|hidden,posture?:standing|sitting|lying|hidden,onPatrol?:boolean
EVENT title,detail?,placeId?,placeName?,hidden?:boolean,id?
SHAPE {kind:"rect",x,y,width,height,material?}|{kind:"ellipse",cx,cy,rx,ry,material?}|{kind:"path",d,material?}
```

Root PC place/spot takes precedence. Name required for every place/prop/actor, including props with item/id; event title required. Actor/event placeId or placeName must resolve in scope. description=observable setting; overhear=actually audible activity, not inferred from activity. Item chooses artwork; prop ID chooses one whole instance. Visual: 1–32 visible shapes in a 100×100 local viewport, finite valid dimensions/path, no raw SVG/HTML/scripts/URLs. Other story-specific people/quests stay in prompt. New predefined lookup entries require matching runtime support; new RP objects do not.

ZONE center entrance left right end wall_north wall_south wall_west wall_east
TAG gryffindor slytherin ravenclaw hufflepuff beauxbatons durmstrang teacher adult patrol animal monster ghost unknown crowd
FLOOR tile wood brick octagon mosaic herringbone diamond cobble
WALL stone dark timber wainscot plaster brick ashlar panel limestone rubble
MATERIAL wood stone metal fabric paper glass plant ink

## 3. NATIVE ID LOOKUP

Owner→atlasAnchor; place ID/name→pcPlace/placeId/placeName (use configured Atlas for rooms, never guess numbered IDs).
```text
h1 h2 hall gryffindor-common ravenclaw-common hufflepuff-common slytherin-common village-static
pitch-static express diagon-knockturn ministry2 ministry-8-10 SUB-DUNGEONS-N SUB-DUNGEONS-E
SUB-DUNGEONS-S SUB-DUNGEONS-W DUNGEONS-N DUNGEONS-E DUNGEONS-S DUNGEONS-W KITCHENS-N KITCHENS-E
KITCHENS-S KITCHENS-W F1-N F1-E F1-S F1-W F2-N F2-E F2-S F2-W F3-N F3-E F3-S F3-W F4-N F4-E F4-S
F4-W F5-N F5-E F5-S F5-W F6-N F6-E F6-S F6-W F7-N F7-E F7-S F7-W F8-N F8-E F8-S F8-W
TOWER-NORTH-DIVINATION-N TOWER-ASTRONOMY-NW TOWER-HEADMASTER-S-N-CENTER TOWER-CLOCK-TOWER-SW
TOWER-BELL-TOWER-N TOWER-FACULTY-TOWER-S TOWER-DADA-TOWER-E TOWER-GRAND-STAIRCASE-TOWER-CENTER
AU-PC-HOME AU-CCC-07-18 AU-LIAD-S-ATTIC AU-WHITECAP-ESTATE LONDON ENGLAND_REGIONS TRANSIT_AND_INTL
custom
```
Geometry→layoutType
```text
horizontal vertical windows ell tee cross court cloister curved tower
```
Recipe/function→places[].type; do not add its automatic furniture again.
```text
HEADMASTER_OFFICE DIVINATION_CLASSROOM ASTRONOMY_OBSERVATORY PREFECTS_BATHROOM ROOM_OF_REQUIREMENT
CHAMBER_OF_SECRETS TOWER_CLOCKWORK BALLROOM TROPHY_ROOM CLASSROOM MAGIC_PRACTICE POTIONS_LAB
RESEARCH_LAB OFFICE STUDY_ROOM MEETING_CLUB LIBRARY ARCHIVE STORAGE WORKSHOP GALLERY MUSIC_ROOM
LOUNGE BEDROOM KITCHEN DINING_ROOM BATHROOM LAUNDRY HOSPITAL_WARD RECEPTION GUARDROOM PASSAGE_PROPS
UTILITY_ROOM SECURE_VAULT DETENTION_CELL PUBLIC_COUNTER CEREMONY_HALL ENTRANCE_VESTIBULE
CLOAKROOM_LOCKERS ART_CARTOGRAPHY_STUDIO GAMES_ROOM OUT_COURTYARD OUT_GARDEN OUT_LAWN OUT_WOODLAND
OUT_WATERSIDE OUT_BUILDING_YARD OUT_CAMP OUT_SERVICE_GARDEN
```
Individual furniture→props[].item. Prefix+suffix gives the exact native ID; this is lookup notation, not an engine alias. Other verified native assets may be used; missing items may be generated.
```text
seat.
dining stool armchair lounge bench sofa corner

table.
study coffee bedside prep long oval dining round layout-school layout-meeting layout-oval

storage.
bookcase double drawers open wall wine bookcase-top cabinet

bed.
single double canopy bunk screen

fixture.
fireplace stove sink bathtub toilet range fireplace-top

object.
counter counter-corner rug.base rug-round.base mirror.base portrait.base clock.base chest crate
barrel cart sack basket rug.detail rug-round.detail mirror.detail portrait.detail clock.detail
chest.detail rug rug-round mirror portrait clock chest.runtime

extra.
curtain lamp-floor sconce torch globe books-stack blackboard towel bucket shower safe
blackboard.library blackboard.runtime

wizard.
fireplace-stone fireplace-carved fireplace-gothic fireplace-floo fireguard potions-cabinet
library-ladder library-curved display archive broom-rack broom-wall cauldron cauldron-large
potions-bench telescope orrery lectern astronomy-cabinet storage-top display-top fireguard.detail
potions-cabinet.detail library-ladder.detail display.detail archive.detail astronomy-cabinet.detail

decor.
portrait portrait-wall landscape armour bust statue grandfather-clock mirror noticeboard
planter-floor curtain-tall curtain-partition curtain-bed rug-runner chandelier portrait.detail
lamp-green candle-pair files ladder chess curtain food basket-linen herbs oven perch pensieve
vault-door worktools flower

unique.
pensieve memory-cabinet sorting-hat goblet-fire triwizard-cup weasley-clock vanishing-cabinet
pensieve.detail memory-cabinet.detail vanishing-cabinet.detail

new.
cup-0.library cup-1 cup-2 cup-3.library portrait-0.library cup-0 cup-3 portrait-0 desk-carved
headmaster-chair bookcase bookcase-glass display-gothic display-island memory-vials silver-device
medals award-shield planter cushion crystal-ball harp grand-piano music-stand cello telescope
star-chart prefects-pool brass-tap mermaid-window changing-screen clock-gear tower-bell pendulum
serpent-column slytherin-statue serpent-gate ice-centrepiece practice-dummy wand-rack tool-board
pipe-valve boiler portrait-1 blackboard-long portrait-2 portrait-3

detail.
coat-stand locker boots drafting easel scroll-rack games-table gobstones directory medicine-cart
specimen violin-case

layout.
privacy-screen clock-machine bell-frame chair-0 chair-1 chair-2 bench-0 bench-1 bench-2 sofa-0
sofa-1 picnic-mat

```
Whole premade interiors→props[].item. Prefix: cluster.layout-. No tabletop-detail/component workflow.
```text
classroom classroom_teacher magic_practice potions_lab research_lab office study_room meeting_club
library library_stack archive workshop lounge bedroom kitchen dining_room bathroom laundry
hospital_ward reception guardroom utility_room detention_cell public_counter ceremony_hall
art_cartography divination_classroom astronomy_observatory prefects_bathroom requirement_practice
requirement_meeting requirement_refuge tower_clockwork tower_bells ballroom trophy_room
headmaster_office out_garden out_woodland out_building_yard out_waterside out_camp
out_service_garden
```

## 4. HTML OUTPUT

Fill map-data; add only supported optional fields. Keep loader and release URLs unchanged. No unresolved required values in emitted HTML.
```html
<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="data:,"><title>WIZAMAP</title><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Ngoc1804/wzw-hogwarts-map-2@f8cf480c39a32c69c9a54d50cbe22bc5b97dd816/dist/shell.css" onerror="window.WZW_LOAD_FAILED=true;document.getElementById('wzw-map')?.setAttribute('data-status','load-error')"><div id="wzw-map"><p role="status">Đang mở bản đồ…</p></div><script type="application/json" id="map-data">{
  "schemaVersion": "2.0.0",
  "meta": {
    "date": "",
    "time": "",
    "areaName": "",
    "quote": ""
  },
  "atlasAnchor": "",
  "pcPlace": "",
  "pcSpot": "",
  "places": [],
  "actors": [
    {
      "name": "",
      "isPC": true,
      "tagType": "",
      "footstep": "hidden"
    }
  ],
  "events": []
}</script><script>window.WZW_START=performance.now();window.wzwLoadError=function(){window.WZW_LOAD_FAILED=true;const r=document.getElementById('wzw-map');r.replaceChildren();let d={};try{d=JSON.parse(document.getElementById('map-data').textContent)||{}}catch{}for(const v of [d.meta?.areaName,...[d.places,d.actors,d.events].flatMap(a=>Array.isArray(a)?a.map(x=>[x?.name||x?.title,x?.description||x?.activity||x?.detail].filter(Boolean).join(' — ')):[])])if(v){const p=document.createElement('p');p.textContent=v;r.append(p)}if(!r.childNodes.length)r.textContent='Bản đồ RP';r.dataset.status='text-fallback'};</script><script src="https://cdn.jsdelivr.net/gh/Ngoc1804/wzw-hogwarts-map-2@f8cf480c39a32c69c9a54d50cbe22bc5b97dd816/dist/templates-pack.js" onerror="wzwLoadError()"></script><script src="https://cdn.jsdelivr.net/gh/Ngoc1804/wzw-hogwarts-map-2@f8cf480c39a32c69c9a54d50cbe22bc5b97dd816/dist/bundle.js" onerror="wzwLoadError()"></script></html>
```
