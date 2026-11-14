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

