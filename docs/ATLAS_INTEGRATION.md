# Atlas integration — 2026-11-14

Base runtime: `3ea860a`; reviewed branch: `84f9f82`. Merged into M2-P01-baseline-loader; main unchanged.

## Implemented

- Canonical human Atlas: WZW_MAP2_ATLAS_GITHUB_MASTER.md; compiler reads its tables/metadata into one assets/atlas.json. Legacy Atlas paths are redirects.
- Preserved 13 Fixed / 348 anchor IDs and 59 scopes / 285 cluster-room IDs; added 53 World sites / 64 focus rooms. Distinct unmapped homes are separate sites.
- Canonical pointers, corrected inappropriate room recipes, source-derived English Fixed aliases, PC-focused World building/level lookup, Outdoor mode from resolved focus room when not explicitly supplied.
- English Gemini MIN is Atlas-only; /map contract, NPC groups/icons, visual instructions and loader are deferred to the single final prompt at P8.
- English MIN: 12,687 bytes / 12,620 characters, 101 lines; input upload: 15,504 bytes (18.2% byte reduction). Token count not measured. No claim of mathematical minimum.
- Full source room names retained to avoid losing room identification; verbose repeated prose remains outside runtime.

## Verification performed

- Compiler structural checks: canonical pointer targets and recipe references; IDs preserved against baseline, no duplicate World focus-room IDs.
- Compiler + MIN generation deterministic on repeat.
- JS syntax/build and git diff whitespace checks.
- Fixed template HTML/pack, CSS, catalog and recipes byte-identical to base.
- No runtime logic tests/browser/render/AI Studio acceptance run in this milestone; final technical QA remains per README.

## Build bytes (not measured network transfer)

| Artifact | Base bytes | Current bytes | Base gzip | Current gzip |
|---|---:|---:|---:|---:|
| bundle.js | 4415172 | 4445428 | 469011 | 474517 |
| shell.css | 11034 | 11034 | 3563 | 3563 |
| templates-pack.js | 906641 | 906641 | 678292 | 678292 |

World registry/aliases increase data bytes; this is added lookup capability, not a claimed bundle-size optimization. Raw Master Markdown and reference viewers are not bundled.

## Limits / next steps

- World layout geometry, actor placement, visual compiler, icon appearance and full semantic merge remain P4–P7 tasks. Registry data does not certify exact canon floor plans.
- The 64 focus rooms cover explicitly detailed World buildings; other sites retain source component/function hints and accept RP descriptions. No claim that every world location has a fully authored floor plan.
- Only one World building/level is selected from PC location; unknown/mismatched paths retain RP fallback and diagnostics.
- Existing MAP_PROMPT/loader is marked legacy, not a release matching this new Atlas. P8 must combine the English Atlas with the new /map instructions and one pinned loader.
- Uploaded reference puts Owlery in H1 and has old AU LOCKED gates; latest user-approved README wins: Owlery belongs to H2, RP-confirmed AU is not blocked.

## Reproduce

```sh
python tools/atlas.py
python tools/prompt.py
python tools/build.py
```
