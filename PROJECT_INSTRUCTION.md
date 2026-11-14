# MAP 2 — PROJECT INSTRUCTION

**Đích:** `M2-P01-baseline-loader`. **Dự án:** bản đồ minh họa RP, không phải game engine mô phỏng. Đây là **file Markdown hướng dẫn duy nhất**.

## Luồng và ranh giới

`Gemini RP → MAP_DATA 2.0.0 → Atlas GitHub → chọn phòng lân cận → 49 layout/SVG/Fixed → Preview`.

- **Gemini** đọc RP, chỉ gửi vị trí PC, các phòng lân cận có liên quan, NPC/nhóm, POI và thay đổi thực tế trong RP. Gemini nắm Information Gate, thời gian, nhiệm vụ, người biết bí mật, không chuyển những quyết định ấy thành logic GitHub. Prompt chỉ cần `prompts/ATLAS_GEMINI_MIN.txt`, không danh sách đồ/tường/sàn.
- **GitHub** đọc `assets/atlas.json`: giải quyết owner/room ID, các phòng quanh PC, công năng, topology, 10 kiểu hành lang, 49 layout S/M/L, màu, sàn/tường, asset SVG và vị trí marker. Không tự bịa diễn biến, NPC hay Quest.
- **MAP_DATA** bắt buộc `schemaVersion:"2.0.0",meta,atlasAnchor,pcPlace,pcSpot,places,actors,events`; tùy chọn `mapMode,layoutType,forceSandbox,region`. `places` không chứa toàn bộ phòng mặc định, chỉ thông tin/điều chỉnh do RP cung cấp. PC duy nhất; vị trí NPC/POI phải hợp lệ.
- **13 Fixed** bất biến artwork và UI; chỉ thêm marker và text. Nhà AU mới trên H1/H2 → Generated. Shop AU trong Hogsmeade/Diagon/Knockturn → gán nhà trống đúng vùng, không ghi đè canon.
- **Generated** có 49 layout S/M/L đã duyệt (41 Indoor, 8 Outdoor). Dữ liệu Atlas quyết định phòng xung quanh; Runtime tự xây. `propsMode:merge` giữ inventory mặc định, `replace` ghi danh sách đầy đủ. `op:ensure` = tổng cần có, `add` = cộng thêm; `state` = trạng thái. Chỉ thao tác vật nguyên cụm, bỏ `parentId,childId,supportId`.
- Thiếu asset: Gemini xuất `visual.shapes` nếu thực sự cần, renderer chỉ dựng hình an toàn/fallback dạng text; không tự tưởng tượng lore.
- POI: `hidden:false` = **! ống nhòm**, `hidden:true` = **? kính lúp**.
- Presentation: footstep 6 nhịp, nhóm NPC, Inspector, X-Ray, pan/touch, zoom out dừng ở fit/full map; zoom in không trần nhân tạo.

## File nguồn được phép chỉnh

| Nội dung | Source chính |
|---|---|
| 13 Fixed + UI | `examples/WIZAMAP_FIXED_UI.html` |
| 49 layout sạch S/M/L | `assets/layout-sizes.json`, `assets/recipes.json`, `assets/layout-finishes.json` |
| Thư viện SVG/texture và ID | `assets/catalog.json`, `assets/icons/` |
| Atlas, World, AU và quan hệ phòng | `assets/atlas.json`, `assets/vocabulary.json` |
| Hình học hành lang | `assets/source/corridors.js` |
| Runtime | `src/contract.js`, `src/resolver.js`, `src/props.js`, `src/draw.js`, `src/build.js`, `src/index.js` |
| Gemini ngắn | `prompts/ATLAS_GEMINI_MIN.txt`, `prompts/MAP_RULES.txt` |
| Pinned release | `assets/runtime-release.json` |
| License | `assets/FINAL_NOTICES.txt` — bắt buộc giữ |

**Đúng 3 viewer HTML:** `examples/WIZAMAP_ASSETS.html`, `examples/WIZAMAP_FIXED_UI.html`, `examples/WIZAMAP_LAYOUTS.html`. Layout viewer chỉ đọc dữ liệu đã biên dịch: không editor, asset palette, code xây, lịch sử chỉnh sửa. HTML viewer cực nhẹ; khi mở `file://` cần mạng cho CDN fallback. Các file `dist/*.js` là runtime xuất bản, không phải HTML demo.

## Pipeline

`python tools/rebuild.py`: xác minh Atlas JSON → kiểm SVG 49 × 3 → build Fixed/CSS/templates/runtime JS → sinh Asset viewer → sinh prompt Gemini. **Không đọc editor HTML cũ, không biên dịch từ Atlas Master Markdown.** `assets/p4-art.json` là bản copy artwork cỡ M, bỏ khỏi build để giảm trùng.

Chạy `node tests/canonical-sources.cjs` và các test phù hợp còn lại; kiểm 13 Fixed, 147 layout, zoom, routing, actor, POI, SVG và AI Studio Preview. `dist` và `prompts/MAP_PROMPT.txt` là file sinh tự động. Không ghim CDN sang SHA mới trước khi rebuild/publish đã xong. Lịch sử phiên bản nằm trong Git history; `main` không thay đổi.
