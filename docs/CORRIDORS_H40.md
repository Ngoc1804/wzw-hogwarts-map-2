# Approved corridors H40 — integration receipt

Base: `857f0c6`, branch M2-P01-baseline-loader. User re-supplied CHỐT_01_10_CORRIDORS_FINAL.html and explicitly approved the frame/10 construction formulas; no new corridor prototype/approval requested.

## Source

- Uploaded HTML: 31,540 bytes, SHA-256 `e1fd37c355ec679b2d44b52fc0a669b8ea00d36f284a4da3f4ff9f837e1cd7e6`.
- Decoded engine is byte-identical to existing assets/source/corridors.js. Keep this one architecture core; do not copy the reference editor into runtime.
- Source defaults already specify H40. Integration had overridden H36 and added vertical candles; those interventions are removed. Source default tile/stone is retained unless RP supplies supported material hints.
- Geometry uses source room proportions/alcoves/passages/10 topologies. Removed furniture-driven square room overrides. RP size/placement adaptation remains P5; this milestone does not claim the old placement is complete.

## Elements and dedupe

48 reusable records: 11 decor, 21 material patterns, 4 doors + 4 main doors + 4 windows, 3 yard compositions, 1 floor runner. Total catalog: 498 IDs. See [CORRIDOR_ELEMENTS.json](CORRIDOR_ELEMENTS.json) for every imported element and hash.

Exact normalized SVG matching preserves colors, transforms and viewBox. No new record is an exact match to the existing 450; near matches/name matches are retained, not falsely merged. The broader audit's 46 candidate groups still need their own color/design review before consolidation.

Catalog/review contains standalone SVGs. Production build omits the added SVG strings and uses corridorSource references to the already packed architecture functions. It does not ship a second corridor renderer. FINAL compiler invokes corridor importer so rebuild does not erase these assets. Pattern previews include only required defs, not the entire source material library per preview.

## Verification performed

- `node tests/corridor-source.cjs`: PASS 40 configurations (10 presets × 1/4/12/20 rooms), H40, source room/alcove/passage geometry preserved for multi-room scenes; same construction core retained.
- Geometry integration check stubs furniture drawing and style serialization: it is not a pixel or full UI test.
- All 48 runtime asset factories reproduce the standalone catalog SVG strings exactly.
- All 48 new SVGs parse; internal IDs are unique and local url refs resolve.
- JS syntax/build/diff whitespace checks PASS.
- Fixed pack, shell CSS and approved template HTML unchanged; no palette redesign in this milestone.
- Initial focused test failed because the isolated test context's furniture stub was overwritten by a loaded function; fixed the harness and reran PASS. No browser result inferred.

Browser/render screenshots, furniture placement QA and Google AI Studio Preview: **NOT RUN**. Source frame is user-approved; generated furniture/icon/palette approval remains separate.

## Rebuild

```sh
node tools/import-corridors.cjs
python tools/asset-review.py
python tools/build.py
node tests/corridor-source.cjs
```

Full FINAL recompilation: node tools/import-p4.cjs also calls import-corridors.cjs. No need to rerun full FINAL/browser import when only reusing the byte-identical corridor source.

## Size measurement (build bytes, not network transfer)

| Bundle | Base | H40 + elements |
|---|---:|---:|
| Raw | 4445428 | 4464851 |
| gzip reference | 474517 | 476720 |

The increase includes 48 source-reference metadata records and the asset factory, not 48 duplicated SVG strings. Existing 450 catalog records are unchanged.
