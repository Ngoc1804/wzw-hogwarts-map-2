# P2 contract — concise sandbox payload

Always supply meta {date,time,areaName,quote}, atlasAnchor, pcPlace, pcSpot, places[], actors[], events[]. Empty text/arrays are valid: never invent RP. Loader version pins the contract; no per-payload schemaVersion required.

places: name, type, description; optional overhear, props, propsMode merge/replace, templateState intact/modified_props/structural_change, architecture. Actors: name, placeName, tagType, footstep, activity, observation; isPC for PC, spot/zone optional. Events: title, placeName, detail, hidden/target optional. ID references remain supported for precision. Props accept strings or name/count/zone/state/op/id objects. No coordinates or raw SVG. Count defaults 1, ensure defaults; replace with [] is empty. Runtime validation is tolerant, diagnostics are developer-only.

Gemini decides all RP and location/scope. Runtime never invents actors/events and never rejects an unknown place/type. Missing bindings get a schematic Custom representation. Repeated names remain scoped to selected cluster; ambiguous names are not arbitrarily merged. No Atlas writes from RP.

Optional mapMode selects indoor/outdoor; layoutType is a hint. `region: "diagon" | "knockturn"` disambiguates new shops within diagon-knockturn (also accepted per place). Empty-home pools are exact metadata records named Nhà dân: 22 village, 15 Diagon, 16 Knockturn. No guessed assignment when alley isn't specified: use detail. Bindings are deterministic for same scene/input, not persistent RP storage. Existing named shops are never overwritten by the new-shop allocator.

## Canonical-ID update

AI sends atlasAnchor directly from the canonical tables in ATLAS_W4.md and pcPlace/placeId as exact location IDs. places[].id updates that location; places[].type uses a real supplied recipe ID such as POTIONS_LAB, OFFICE, STORAGE. Names are display labels, not an identity substitute. Unknown names remain supported for Custom sandbox.

Atlas source content retained; §6 is its explicit ID table. tools/atlas.py compiles that table (13 Fixed, 348 artwork anchors, 59 scopes including towers/AU/World, 285 named non-Fixed records). World region scopes intentionally do not instantiate every city/house; places[] provides current RP scope. Some Atlas semantic rooms do not have an independent artwork anchor: no falsely exact geometry is claimed. Preserve names, source owner and AU status. Pointer-only cluster to one Fixed resolves directly; pointers accompanying real rooms do not duplicate rooms or silently expand scope.

41 recipe inventories were extracted from actual supplied interiors. Stable instance IDs are recipe ID + source instance ordinal. composeRoom applies merge/replace/ensure/add/count/state against those real instances, retaining RP fallbacks. An exact instance id wins; known aliases resolve exact asset kind; ambiguous cases retain the named prop with developer diagnostics. Re-render starts from source inventory, never previous output. Removed/missing/destroyed or count zero removes matched items; broken changes matched items. No structural floor changes through propsMode.

This implements inventory composition, not completed furniture geometry. Generated still uses schematic room/prop representatives; P4 will place/draw composed recipe inventory and validate surface children, doors, H36, upright furniture and visual quality before expansion. Source interiors contain repeated groups for some fixtures; source ordinals are retained, not silently deduplicated without visual review. Source geometry remains reference, not a competing renderer. P4 aesthetic approval and Google AI Studio Preview are pending. Event detailed architectural targets still fall back to place. Fixed placement/X-Ray needs P7 depth audit.
