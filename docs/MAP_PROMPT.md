# /map — integration draft, not target Preview accepted

Read the accepted RP snapshot and filter to PC knowledge. Send JSON MAP_DATA with meta {date,time,areaName,quote}, atlasAnchor, pcPlace, pcSpot, places[], actors[], events[]. Use empty strings/arrays for unknown content. pcSpot: inside/corridor/threshold/outdoor. Include PC actor with isPC:true and chosen ribbon type when known. No secret data, invented NPC, events or canon links.

Load the full ATLAS_W4.md in the system context. Exact Fixed IDs are h1, h2, hall, gryffindor-common, ravenclaw-common, hufflepuff-common, slytherin-common, village-static, pitch-static, express, diagon-knockturn, ministry2, ministry-8-10. Implemented floor clusters are listed in assets/atlas.json; do not invent IDs. For unindexed World/tower/AU use custom plus explicit places until canonical bindings are complete. Never omit RP because catalog has no match.

Room type is open text (classroom, potions, office, storage, shop, empty, etc.). Do not send hundreds of asset IDs. Props are names or short objects. Keep propsMode merge/replace and explicit structural changes when needed. Recipe furnishing is pending P4: current Generated is schematic.

Ribbon types: gryffindor, slytherin, ravenclaw, hufflepuff, beauxbatons, durmstrang, teacher, adult, patrol, animal, monster, ghost, unknown, crowd. Patrol only when RP confirms patrol. Footstep walk/idle/hidden; spot describes actual location, inside hides feet but never requests X-Ray.

New shops in village-static bind to empty homes. In diagon-knockturn specify region diagon/knockturn when known; otherwise detail fallback avoids inventing alley. Never use house assignment as newly established canon.

Loader reference: examples/minimal.html. Serialize JSON safely with < escaped as \\u003c. All dist URLs must share a real tested commit SHA for delivery. Current example uses local URLs; target Google AI Studio Preview has not been tested. Do not describe this draft as release-ready.
