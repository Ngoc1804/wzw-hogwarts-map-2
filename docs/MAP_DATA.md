# MAP_DATA 2.0.0 — current public contract

One entry: `window.MAP_DATA`; JSON transport: `<script type="application/json" id="map-data">`. Gemini resolves narrative state, location, NPCs and quests; browser code only resolves technical references and renders. Prompt settings/quest registries/quotas/material seeds are not payload fields.

## Required root

| Field | Value / rule |
|---|---|
| schemaVersion | `2.0.0` |
| meta | `{date,time,areaName,quote}`; narrative date/time, short visible text |
| atlasAnchor | Fixed ID, Atlas scope, World scope or `custom` |
| pcPlace | Resolved canonical ID or unique place name; no empty/unknown |
| pcSpot | `inside/corridor/threshold/outdoor` |
| places | Array; Fixed/Atlas additions or text bindings only; custom declares required places |
| actors | Array with exactly one `isPC:true` |
| events | Array selected by Gemini; no engine quota/eligibility logic |

Optional root: `mapMode:indoor/outdoor/template`, `layoutType:horizontal/vertical/windows/ell/tee/cross/court/cloister/curved/tower`, `forceSandbox:boolean`, `region:diagon/knockturn`. Explicit `mapMode:outdoor` for custom Outdoor. PC root place/spot wins. Every NPC must have a valid location and explicit spot; normalizer does not reject all missing spots, so prompt must ensure completeness.

## Fixed canon — position and existing interface only

Preserve approved artwork, geometry, furniture, colors and size. Inside a house/shop is still an anchor on that Fixed map, not a request to build its interior. Supply correctly anchored PC/NPC/event markers and RP text through the existing interface. No props/propsMode/visual/architecture/size, added geometry, detail screen or extra UI. `places` may carry existing-location name/description/overhear bindings. Explicit AU/event exceptions follow configured routing; do not infer them from indoors or a mentioned quest. H1/H2 new construction switches to sandbox; village/alley AU premises bind available buildings in the correct district. Fixed props are not an open feature task.

## Generated places and furniture

`PLACE={name,id?,type?,size?,description?,overhear?,region?,isNewConstruction?,architecture?:{floor?,wall?},propsMode?,props?}`.

`type` selects a recipe/function; it is not an asset ID. S/M/L defaults to M; legacy small/medium/large remain accepted. Approved source now supplies 49 layouts × S/M/L, including Outdoor; native size and arrangement are retained by the current integration. New/custom spaces use supported architecture materials; approved source colors/artwork remain intact.

`PROP={name,item?,id?,count?,op?,state?,zone?,mount?,visual?}`. Name is mandatory, even with item/id. `item` is a verified native catalog ID; `id` addresses one inventory instance. Missing suitable assets must not prevent a named scene/object: Gemini may supply minimal visual, engine retains fallback/information.

- merge (default): keep recipe inventory and apply changes.
- replace: use supplied props as complete desired furniture inventory; empty array clears furniture, not architecture.
- ensure: desired total; add: additional/new inventory. New explicit IDs in merge require add. New IDs in replace are accepted. Repeated render does not accumulate state.
- count: nonnegative integer; state-only updates omit count to preserve totals. Count 0 / removed / missing / destroyed removes the target. Broken is a state marker, not a promise of detailed fracture artwork.
- Edit assembled furniture as a whole. Prompt does not use child tokens or surface/support relations. Do not output parentId/childId/supportId. Legacy internal capabilities remain for compatibility, not a required public workflow.

`visual={shapes:[...]}`: 1–32 visible rect/ellipse/path shapes in a 100×100 local viewport; finite valid numbers/path; materials wood/stone/metal/fabric/paper/glass/plant/ink. Rect: x/y/width/height; ellipse: cx/cy/rx/ry; path: d. No raw SVG/HTML/scripts/URLs. Invalid visual falls back per object.

## Actors

`ACTOR={name,isPC?,id?,placeId?,placeName?,spot?,zone?,tagType?,activity?,observation?,members?,summary?,footstep?,posture?,onPatrol?}`.

One PC. Gemini supplies knowledge-safe names/descriptors and House/category. NPC place and spot are required by the prompt. More than 10 input NPC ribbons produces diagnostic, not truncation. Presentation groups more than four represented people in the same room/spot when there are multiple NPC entries; PC stays separate. Original RP actors and member information are retained.

Supported tags: gryffindor/slytherin/ravenclaw/hufflepuff/beauxbatons/durmstrang/teacher/adult/patrol/animal/monster/ghost/unknown/crowd. Patrol only when onPatrol is true. Footstep input walk/idle/hidden follows active-map presentation policy: overview/Outdoor hides inside feet; detail maps retain feet. Posture standing/sitting/lying/hidden. Ordinary prompt does not request support-based placement; exceptional scenes are illustrated through sandbox and observable text, not detailed furniture physics.

## Events

`EVENT={title,detail?,placeId?,placeName?,hidden?,id?}`. Valid location required by prompt. hidden false = binoculars; true = magnifier. This selects presentation, not category/knowledge/eligibility. Gemini applies story-specific icon assignments and gates before serialization. No icon/pack/category/reward/stage/quota fields. All secrets must be removed before JSON. Advanced door target remains internal/optional, not needed by ordinary prompt.

## Materials / seed

Floor: tile/wood/brick/octagon/mosaic/herringbone/diamond/cobble. Wall: stone/dark/timber/wainscot/plaster/brick/ashlar/panel/limestone/rubble. Gemini may internally seed selection for new spaces and retain choices across refreshes; only final architecture values are sent. No public seed/materialSeed field. Preserve approved source and Fixed colors.

## Loader / release / verification

Use only tools/loader.py; one base URL expanded into CSS/templates-pack/bundle at one published commit. assets/runtime-release.json is the release source; examples/loader-cdn.html is generated. tools/map_prompt.py generates the single final docs/MAP_PROMPT.md. Story questions remain for the author; emitted HTML must contain no unresolved required values. Escape literal `<` as `\u003c` in embedded JSON.

Malformed JSON is a transport error; invalid PC/version input does not justify invented location. Render API is serialized. AI Studio acceptance is separate from local/CDN checks. Zoom policy: fit=1, maximum=4; footer removed at source. Runtime notices are retained in assets/FINAL_NOTICES.txt and the source information dialog.
