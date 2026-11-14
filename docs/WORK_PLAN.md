# Current work plan

## Completed under user approval

- Retain merged decor, 49 layouts × S/M/L and current catalog; no artwork redesign.
- Fixed canon: positions and text through existing map UI only; no furniture/construction/detail UI.
- Public prompt: Generated sandbox, whole furniture/groups, merge/replace, minimal visual/fallback. No parentId/childId/supportId or tabletop-component workflow. Internal legacy APIs remain compatible.
- Remove footer from source; clamp zoom at fit through 4×, preserving current anchor/scale presentation.
- One English MAP_PROMPT generated from MAP_INSTRUCTIONS + native lookup + tools/loader.py. Story quotas/icons/minimum NPC are questions for the author. Runtime URL is release-managed.
- Replace outdated competing contract/review handoff documents with current contract/redirects. Refresh file inventory and prompt provenance.

## Verification / remaining acceptance

Current run results are recorded in FINAL_MAP_QA.json and the release pin in assets/runtime-release.json. Source/build/CDN/local tests are distinct from AI Studio Preview. Preview acceptance remains pending because no target page/session has been supplied; do not mark it PASS. Further payload optimization must preserve approved artwork and be measured before/after; no feature or asset is removed merely to reduce bytes.

## Rebuild

`python tools/rebuild.py` validates approved SVGs, rebuilds distributions/catalog/loader and generates the prompt. `python tools/map_prompt.py` regenerates only the prompt. Runtime code changes require publishing the code commit first, then refreshing runtime-release, loader and prompt together. No merge main, force push or history rewriting.
