# P2 contract — concise sandbox payload

Always supply meta {date,time,areaName,quote}, atlasAnchor, pcPlace, pcSpot, places[], actors[], events[]. Empty text/arrays are valid: never invent RP. Loader version pins the contract; no per-payload schemaVersion required.

places: name, type, description; optional overhear, props, propsMode merge/replace, templateState intact/modified_props/structural_change, architecture. Actors: name, placeName, tagType, footstep, activity, observation; isPC for PC, spot/zone optional. Events: title, placeName, detail, hidden/target optional. ID references remain supported for precision. Props accept strings or name/count/zone/state/op/id objects. No coordinates or raw SVG. Count defaults 1, ensure defaults; replace with [] is empty. Runtime validation is tolerant, diagnostics are developer-only.

Gemini decides all RP and location/scope. Runtime never invents actors/events and never rejects an unknown place/type. Missing bindings get a schematic Custom representation. Repeated names remain scoped to selected cluster; ambiguous names are not arbitrarily merged. No Atlas writes from RP.

Optional mapMode selects indoor/outdoor; layoutType is a hint. `region: "diagon" | "knockturn"` disambiguates new shops within diagon-knockturn (also accepted per place). Empty-home pools are exact metadata records named Nhà dân: 22 village, 15 Diagon, 16 Knockturn. No guessed assignment when alley isn't specified: use detail. Bindings are deterministic for same scene/input, not persistent RP storage. Existing named shops are never overwritten by the new-shop allocator.

## Implemented / limitations

Implemented: tolerant contract, prop composition helper, 44 floor/direction cluster bindings (203 room records), Fixed metadata, deterministic empty-house assignment, overflow/detail, basic Custom schematic, RP Inspector and header. Full Atlas remains in ATLAS_W4.md; generated index derives from that one source.

Pending P3: tower/World/AU canonical index and full aliases; referenced places there currently use Custom fallback, not full cluster coverage. Pointer records are retained but not traversed yet. Mixed-cluster selection and previous-binding transport are not implemented. Structural changes use a detail/schematic scope; architecture shape semantics, recipe placement and destructive floor geometry are P4/P5 work. Event architectural target binding currently falls back to place. Prop helper is tested but not yet applied to recipe instances (no recipe renderer is claimed). Fixed prop changes remain in Inspector; verified overlay anchors await P4.

Generated schematic currently has H36 wall faces, neutral room/area shapes and labeled prop representatives. It does NOT claim ten layout geometry or P4 furniture acceptance. Fixed artwork unchanged. Existing Fixed placement/X-Ray mechanics still require P7 depth audit.
