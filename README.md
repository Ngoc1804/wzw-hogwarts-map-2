# Style V2 và gỡ motif nơ — chờ duyệt redesign

Đã đọc plan V2 mới (người dùng cấp 2026-11-13): khung phòng 2.5D; nội thất SVG 2D phẳng, nhiều góc nhìn theo món; không ép isometric/45°/mặt hông hoặc khay oval. V2 thay các chỉ dẫn góc front bắt buộc trước đây.

Xác nhận 32/432 design có 51 nơ lỗi (bao gồm path gộp nhiều nơ). Đã gỡ đúng subpath này ở candidate, catalog/interiors source và P4 definitions rồi build lại bundle/review. Fixed pack/CSS/Atlas không đổi. Không vẽ thêm SVG hoặc cài thư viện ở mốc lập plan.

Bảng toàn bộ 432 design: docs/STYLE_AUDIT.csv. Danh sách 32 design đã sửa: docs/BOW_AFFECTED_DESIGNS.csv. Plan và phạm vi: docs/STYLE_REDESIGN_V2.md. Kiểm: python tests/bow-cleanup.py; node tests/style-audit.cjs. HTML đầy đủ đã gỡ nơ: examples/asset-review.html. Lịch tự động vẫn tắt. Chờ người dùng duyệt redesign/giao diện V2.

---

# Các cụm mới đã bị bác bỏ và xóa

Catalog review hiện giữ 432 design nguồn, không có cụm mới hoặc demo đặt thử. Xem docs/CLUSTER_REDESIGN_PLAN.md: nghiên cứu mẫu, công cụ Figma đã kết nối và danh sách cụm cần vẽ. Chờ duyệt trước tạo SVG thay thế.

# Catalog màu đã lọc — bộ dự kiến chờ duyệt

Người dùng yêu cầu lọc theo nét vẽ, ưu tiên bản màu và ghép thêm cụm để bàn. Đã tạo **440 design dự kiến**: 432 design nguồn + 6 cụm top mới + 2 cụm cây 259. Bảng đầy đủ 1.376 dòng nguồn ghi 911 bản sao gộp, 33 bản ghi cây thường cũ loại khỏi candidate. Giữ các design khác nét/view dù cùng tên và hai cây đặc biệt; chưa thay catalog/trees/layout/dist runtime.

Mở **examples/asset-review.html** (offline, đầy đủ SVG màu, tìm kiếm/tải từng SVG, tab giữ/gộp/bỏ). Nguồn candidate: examples/asset-review-data.json. Bảng: docs/ASSET_SELECTION.csv; báo cáo: [ASSET_CANDIDATE.md](docs/ASSET_CANDIDATE.md). PASS 440 SVG và kiểm thành phần 6 cụm top/2 cụm cây; xem tests/asset-candidate-qa.json và ảnh asset-*.png. Chờ người dùng duyệt bản cụ thể trước tích hợp production; lịch vẫn tắt.

---

# C1–C5 — cải thiện theo duyệt phần 1 và 2 (2026-11-13)

Người dùng duyệt triển khai Indoor/marker và các mẫu Outdoor; chưa giao bước 3 kiểm toàn bộ Fixed/X-Ray và chưa duyệt hình bản cải thiện. Nhánh giữ `M2-P01-baseline-loader`, base `16818bf`. Lịch tự động vẫn tắt.

- [x] Bỏ tên phòng/địa điểm Generated trên hình, giữ binding click/tap/Enter và sidebar.
- [x] Đổi sàn/tường theo công năng bằng pattern nguồn; nhận architecture.floor/wall trong whitelist, giữ H36 và geometry.
- [x] Bật decor hành lang ngang nguồn, thêm nến đứng ở tường dọc đủ khoảng trống, tránh cửa/cửa sổ; không kéo méo đồ.
- [x] Marker `?` và `!` không badge tròn: glyph mực xanh/burgundy, keyline giấy sáng, vùng bấm vô hình 32×36; reduced-motion giữ cơ chế cũ.
- [x] Outdoor dùng nền giấy/mảng đất+cỏ, asset catalog nhà/cây/bụi/đá/ghế; trích thêm hình nhà/quán/tháp/cây từ đúng H1 hiện có (không lấy repo khác). Bỏ tên canon/chữ và vùng click trước khi compile; không sửa artwork Fixed.
- [x] 3 Outdoor mẫu: sân+nhà kho, bờ hồ+tháp, cụm nhà/quán. Không tự tạo đường nối canon. Geometry nguồn của nhà được giữ, chưa phải toàn bộ khả năng dựng Outdoor P6.
- [ ] Người dùng duyệt hình Indoor/marker/Outdoor mới.
- [ ] Bước 3: kiểm 13 Fixed và ma trận X-Ray trên template theo kế hoạch đã đề xuất; chưa báo nghiệm thu lại phần đó trong mốc này.

Build: `node tools/import-outdoor.cjs` khi đổi artwork trích H1; `python tools/build.py`; `python tools/review-fixtures.py`; `python tools/review.py`. Kiểm mới: `node tests/visual-refinement.cjs`, `node tests/repair-review.cjs` (tự mở server). 10 Indoor+3 Outdoor, desktop/mobile, không trùng IDs/thiếu refs; footprint/cửa và tương tác trong fixtures được kiểm. HTML: examples/p4-review.html. Ảnh: tests/repair-overview.png, tests/marker-review.png và repair-*.png. PASS 13 cảnh desktop/mobile, 13 kiểm tra style mới và 16 ca chức năng. Cảnh sân sau dùng chung symbol giảm 13.408 → 2.777 node; bundle gzip 119.464 byte (tăng do artwork H1/catalog được tái dùng). Google AI Studio Preview chưa thử.

Lưu ý: stage này đổi style/asset và chuẩn bị các mẫu để duyệt; các số đo và duyệt cũ trong nhật ký dưới đây thuộc mốc trước. Prompt CDN hiện pin bản cũ 392a468 cho tới mốc đồng bộ loader; HTML offline chứa đúng bundle mới và là bản kiểm của mốc này.

---

# M2-P04 — checkpoint sửa theo phản hồi (2026-11-13)

Repo duy nhất `Ngoc1804/wzw-hogwarts-map-2`; nhánh `M2-P01-baseline-loader`. Base đã fetch/xác minh: `10d2c37`, working tree sạch trước sửa. Không có AGENTS.md trong checkout. Plan người dùng cấp được đọc đầy đủ, hash khớp bản đã kiểm kê; bản chỉ đạo nguyên văn nằm ở phụ lục cuối README, không tạo một plan/contract cạnh tranh. [Baseline mới](docs/repair-baseline.json).

**Trạng thái: ĐÃ SỬA VÀ KIỂM LOCAL BỘ MẪU. CHỜ NGƯỜI DÙNG DUYỆT HÌNH. Google AI Studio Preview CHƯA THỬ. Bản cũ 10d2c37 đã bị bác bỏ, không dùng làm mốc duyệt.**

Đã chốt/kế thừa: 13 Fixed và UI; bản nội thất sảnh đã duyệt tại `24c6c20`; bảng màu, icon, footsteps và 5 mục Inspector. P0/P1 local có baseline; P2/P3 còn thiếu, không đánh dấu hoàn tất lại. Nguồn đang có: 10 preset corridors, catalog, 41 recipe inventories và 4 recipe artwork P4; các source viewer không phải UI runtime.

Lỗi đã tái hiện ở 10d2c37: Generated gọi basicMap tự vẽ sàn/tường/cửa thay geometry nguồn; source corridors không được bundle. P4 có 0 mặt tường nguồn/0 pattern tường hoặc slate nguồn; đổi vertical/cross/tee/ell đều thành cùng lưới. Test cũ vẫn PASS vì chỉ đếm nhãn H36 và object.

Theo yêu cầu mới, cho phép bộ **mẫu kiểm/duyệt** bao phủ đủ 10 preset và trong/ngoài nhà; không coi đó là phê duyệt thẩm mỹ hoặc nghiệm thu toàn P5/P6. Nội dung RP giả lập chỉ nằm trong fixtures review; runtime không tự tạo NPC/sự kiện.

- [x] R0 — đọc plan/source, kiểm remote HEAD/branch/tree và baseline/hash/license notices.
- [x] R1 — đưa lõi geometry/materials/cửa của corridors vào pipeline chính; bỏ basicMap sơ đồ thay thế; giữ shell Fixed.
- [x] R2 — ghép nội thất phẳng, tỷ lệ hợp lý, kiểm footprint, cửa, wall/surface; merge/replace và đồ lạ.
- [x] R3 — 10 MAP_DATA RP có PC/NPC/events, phủ 10 presets; thêm ca Outdoor, phòng đơn, sai/thiếu, đông và Fixed overrides cần thiết.
- [x] R4 — lặp chụp/xem/sửa desktop/mobile, kiểm hình học thực và tương tác; regression 13 Fixed/UI, layer/X-Ray/cleanup phù hợp thay đổi.
- [x] R5 — giao một HTML offline tổng hợp + ảnh + báo cáo lỗi/giới hạn; commit/push sau kiểm HEAD.
- [ ] USER VISUAL APPROVAL — chờ người dùng; không tự tick.
- [ ] TARGET PREVIEW — chưa thử, local không thay nghiệm thu AI Studio.

Lịch tiếp tục mỗi giờ đã chạy theo yêu cầu; hiện tạm tắt khi bàn giao bộ mẫu để chờ người dùng duyệt. Khi được tiếp tục, mỗi lượt đọc checkpoint, kiểm HEAD và phiên đang chạy, tránh làm trùng. Tắt khi bộ mẫu đã kiểm/giao xong và chờ duyệt, hoặc phần việc hoàn tất. Không nhập repo cũ/demo-5, không merge main/release/force-push. Bộ mẫu được giao ở mốc sửa này; lịch sẽ tạm tắt khi bàn giao để chờ duyệt, không tự mở P5/P6 hoặc tự duyệt. Các lượt sau phải tiếp tục từ checkpoint này và kiểm HEAD mới nhất.


Runtime sửa đã push tại `392a4682fd550c1f8cdbe199856db6b84660c41c`; MAP_PROMPT/loader ghim cùng SHA này để kiểm đúng bản sửa. Đây là bản chờ duyệt, chưa phát hành/AI Studio.

Bàn giao: [HTML offline tổng hợp](examples/p4-review.html) · [ảnh tổng hợp 12 cảnh](tests/repair-overview.png) · [MAP_DATA mô phỏng](examples/rp-review-data.json) · [báo cáo sửa/giới hạn](docs/P4_REVIEW.md). Mỗi cảnh có ảnh desktop/mobile trong `tests/repair-*.png`. Selector gồm 10 Indoor + 2 Outdoor + 13 Fixed. Fixtures không được bundle vào runtime.

PASS local: 12 cảnh desktop 1700×1050 + mobile 390×844, geometry H36 thực; source patterns và mặt tường; bounds hình thực khớp footprint; không vượt sàn/chắn cửa trong fixtures; đủ actor; href/ID; click/tap/Enter/zoom; 16 ca chức năng; 41 từ công năng; inventory/Atlas; 13 Fixed/348 vùng bàn phím; 26 click/tap Fixed; X-Ray có depth + mask, inside không tự mờ; walk/reduced-motion và cleanup. Log: `tests/repair-review-qa.json`, `tests/repair-functional-qa.json`, `tests/*-qa.json`; Fixed integrity: `tests/qa.json`. Pack 13 Fixed, CSS và corridors source giữ nguyên byte/hash so với 10d2c37.

Vòng sửa đã bắt và sửa: bỏ qua corridors core; mất transform nhóm cha khi trích artwork; tủ/kệ bị co theo chiều cao tường; cửa nguồn ở cạnh khác lối chừa cũ; phân loại tên “Nhà kho sân” thành sân; nhãn đông chồng nhau. Ribbon dịch có đường chỉ, không kéo chân. Tường sử dụng nguyên projection/pattern/cửa của lõi source, không dựng lại bộ khung khác.

Đo lượt cuối Chromium Linux: 42–3.251 SVG node/cảnh; 41–117 ms ở hàm render (median ~64 ms, 12 fixture desktop, không gồm network); số đo heap trong log là heap toàn page Chromium, không phải bộ nhớ riêng engine. Không dùng kết quả đơn máy làm SLA hoặc giới hạn RP. Chi tiết bytes/gzip ở `docs/build-metrics.json`.

Giới hạn còn mở: chỉ 4 công năng có artwork P4; recipe khác giữ inventory bằng đại diện có tên, chưa coi hoàn thiện P5. Outdoor dùng silhouette cơ bản chưa duyệt, không phải toàn P6; không tự nối đường canon. Architectural hints tùy ý, toàn bộ binding P2/P3, surface/va chạm mọi recipe và semantic depth từng công trình Fixed vẫn cần audit P5/P7. Chưa có nghiệm thu AI Studio Preview. P4 sửa này là bản để duyệt, không phải phát hành lõi.

---

# WZW Map 2 — trạng thái hiện tại

Nhánh duy nhất: `M2-P01-baseline-loader`. **System prompt chỉ dán [W4.1 gọn](docs/W4_1.md) + [R14.6](docs/MAP_PROMPT.md)** theo [hướng dẫn](docs/PASTE_GUIDE.md); không dán Atlas chi tiết vào Gemini nữa.

- Contract và từ công năng ngắn dùng một bảng `assets/vocabulary.json`: classroom → CLASSROOM, potions → POTIONS_LAB…; không bắt AI biết ID từng đồ vật/phòng artwork.
- Fixed/cụm/Custom, shop bindings và inventory merge đã có; [Atlas đầy đủ](docs/ATLAS_W4.md) vẫn là nguồn GitHub, index sinh tự động. W4.1 chỉ là bản định tuyến nén.
- **[P4 review offline](examples/p4-review.html)**: Horizontal + Potions/Office/Storage/Classroom, H36, cửa/hành lang/hốc nhẹ theo seed, vật lạ và Inspector; chuyển được P4 + 13 Fixed. **ĐÃ BỊ NGƯỜI DÙNG BÁC BỎ**: renderer sơ đồ đã bỏ qua kiến trúc nguồn; xem checkpoint sửa ở đầu README.
- Recipe khác vẫn có inventory/fallback, chưa có QA geometry đầy đủ. P5/P6/P7 và nghiệm thu Google AI Studio Preview còn mở; không tuyên bố hoàn tất toàn dự án.

Build từ repo root: `python tools/atlas.py`, `python tools/build.py`, `python tools/review.py`. Khi đổi fixtures: `python tools/review-fixtures.py`; khi đổi artwork/compiler: `node tools/import-p4.cjs`. Sinh lại bản prompt gọn: `python tools/prompt.py` (giữ loader đã pin). Serve `python -m http.server 8790`. Kiểm: `node tests/vocabulary.cjs`, `node tests/compact-p4.cjs`, `node tests/ids-props.cjs`, `node tests/p2-p3.cjs`. [P4 QA và giới hạn](docs/P4_REVIEW.md).

---

## Nhật ký baseline và các mốc trước

# WZW Map 2 — UI cố định, đồ họa và tích hợp P0/P1

Nhánh làm việc hợp nhất duy nhất: `M2-P01-baseline-loader`. Nhánh này kế thừa toàn bộ lịch sử `01-template-ui` tại `24c6c207bd5c321a511299004aa036d54294571f`; nhánh cũ đã được hợp nhất theo yêu cầu người dùng và không còn dùng làm nhánh chỉnh sửa. [Baseline and decisions](docs/P0-P1.md), [upload hashes](docs/baseline.json), [Atlas](docs/ATLAS_W4.md), [build sizes](docs/build-metrics.json).

- [x] P0 source inventory, hashes, keep/adapt/missing and prior approval identified.
- [x] P1 local Fixed shell/loader/SVG, one MAP_DATA bootstrap and deterministic build.
- [x] Pre-upload optimization gate: exclude reference viewers/unused picker, measure bytes, preserve artwork.
- [ ] P1 target Google AI Studio Preview acceptance (not tested).
- [ ] P2 contract and normalization; P3 Atlas resolver.
- [ ] P4 Horizontal/Potions/Office/Storage sample and user visual approval.
- [ ] P5/P6 after visual gate; P7/P8; P9 final QA/measurement.
- [ ] X optional, no core dependency.

Run `python tools/build.py`, then `python -m http.server 8766`. Open [P1 loader](examples/minimal.html) or [13-template offline review](examples/template-review.html). Tests: `node tests/p1.cjs`; `MAP_PREVIEW_URL=http://localhost:8766/examples/template-review.html node tests/template-ui.cjs` and `node tests/interaction.cjs` with the same variable.

Agreed geometry: wall height 36; upright furniture except actual wall attachments. These are integration requirements; reference viewers retain source defaults. Do not treat local technical PASS as new aesthetic approval. No merge/main/release/automation.

---

## UI cố định và đồ họa đã kế thừa

Baseline lịch sử: `01-template-ui` tại `24c6c207bd5c321a511299004aa036d54294571f`. Các task/commit `TUI-01`–`TUI-08` được giữ nguyên trong lịch sử nhánh hợp nhất.
Không merge `main`, không phát hành; repo cũ chỉ đọc.

## Bản chính

Chỉ sửa một nguồn Fixed/UI: `examples/template-review.html`. `dist/` là đầu ra tự sinh bởi `tools/build.py`, không sửa trực tiếp. Các pack trong `assets/source/` là đầu vào đồ họa tham khảo đã kiểm kê, không phải renderer chạy song song. Bộ xem offline có selector đủ 13 mẫu; runtime P1 không có selector review.

`examples/template-review.html` là bản offline duy nhất, chứa đủ 13 SVG, definitions và UI. Mở trực tiếp bằng Chromium hoặc chạy:

```sh
python -m http.server 8765
```

Mở `http://localhost:8765/examples/template-review.html?template=h1`.
13 ID: `h1`, `h2`, `hall`, `gryffindor-common`, `ravenclaw-common`, `hufflepuff-common`, `slytherin-common`, `village-static`, `pitch-static`, `express`, `diagon-knockturn`, `ministry2`, `ministry-8-10`.
Tham số URL phục vụ kiểm mẫu, không thêm lại thanh chuyển template vào UI.

## Trạng thái duyệt

**TUI-04 — Nội thất map sảnh: ĐÃ ĐƯỢC NGƯỜI DÙNG DUYỆT.** Bản sửa tại commit `f7931908e805148f5edd687d0291041a5f528897` đã được duyệt trong thread gốc. Lịch tự động vẫn tắt.

## Task đã triển khai

| Task | Kết quả |
|---|---|
| TUI-01 | Nhập đủ 13 template; giữ referenced defs, IDs và tỷ lệ; loại placeholder definition rỗng và tham chiếu không vẽ gì. Ghi nguồn dưới đây. |
| TUI-02 | Đổi vị trí use chân trái/phải, glow đỏ nhẹ; walk sáu nhịp 550 ms, ẩn 2.000 ms, idle hai dấu; reduced-motion dùng hai chân tĩnh; inside tắt chân. Kiểm toàn bounds của dấu, không chỉ tâm. |
| TUI-03 | Phục hồi 106 hook H1 motion; cleanup khi đổi mẫu; tôn trọng reduced-motion. Bỏ hiệu ứng chọn đỏ cạnh tranh, giảm bóng cầu; nền H2 cùng #f1e5ca với viewport. Thêm bóng rêu #637752, blur 9, opacity .22 sau từng công trình H1/H2, không thêm khối đặc. |
| TUI-04 · ĐÃ DUYỆT | Giữ element Đại Sảnh; bổ sung đồ dùng, tủ, kệ sách, cây, đèn và chân dung cho các phòng quanh sảnh. Nới sân trong về trái 14 đơn vị, thay đài cũ bằng chính nhóm SVG đài H2; thêm ghế và cây. |
| TUI-05 | Bốn nhà chung thêm bàn học, đèn, cây và kệ sách chi tiết. Lò sưởi hiện có tăng 40% quanh tâm; Ravenclaw được bổ sung lò cùng kiểu tài nguyên. Giữ kích thước mặt bằng và màu Nhà. |
| TUI-06 | Click/tap và Enter/Space chọn địa điểm, Inspector đọc metadata; pointer capture chỉ khi thật sự kéo. Glow thống nhất. Event=Quest dùng kính lúp vàng/burgundy; Hidden dấu hỏi xanh giấy cổ; pulse nhẹ, reduced-motion sáng tĩnh. X-Ray chỉ khi alpha artwork thật chồng lên ribbon. |
| TUI-07 | Từng công trình dùng nhóm độc lập; 172 nhóm occluder trên các template có kiến trúc nổi/đồ cao. Map Bộ/Express dạng mặt bằng không có kiến trúc nổi cần làm mờ. Vùng cấm tách theo hình công trình/nước/đồ cao; ngoài vùng cấm là đất trong bounds. Nhãn công trình con có trong artwork được thêm vào metadata hiển thị, không tạo Atlas thứ hai hay nội dung RP. |
| TUI-08 | Việt hóa nhãn, title, aria-label và metadata; giữ tên riêng sách giữ. Bỏ cả hai hàng chọn khu/template và nút thử UI; map/sidebar lấp đầy. Không giữ bản original/v2/patch trong repo. Đã kiểm desktop/mobile, giữ nguyên năm mục Inspector. |

## Cơ chế tương tác

`data-occluder="building"` đánh dấu đúng nhóm công trình; `data-forbidden="building|water|furniture"` đánh dấu vùng cấm. Không dùng cả bbox trong suốt làm vùng cấm: bbox chỉ lọc sơ bộ, quyết định dựa trên alpha raster của hình đã vẽ, bao gồm các referenced defs. Raster cache tối đa 1.024 px cạnh dài, tạo khi cần actor, không tải SVG từ mạng.

Khi ribbon chồng lên pixel có hình của công trình, chỉ nhóm đó có opacity `0.3`, ribbon vẫn rõ. Tag không chồng thì công trình bình thường. `inside` tự nó không kích X-Ray. Xóa actor/đổi mẫu phục hồi opacity và giải phóng timer/layer. Vị trí nhãn có thể dịch để nằm trong bounds; vị trí chân giữ độc lập.

Các template mặt bằng dùng nguyên mặt bằng; không tạo mái hoặc nhà nổi giả chỉ để có X-Ray. Với map tự do, có thể dùng lại các thuộc tính nhóm và helper `paintedMask`/`maskOverlaps` khi renderer đã cung cấp artwork và bounds. Không bảo đảm cho mọi geometry tùy ý; không xây pathfinding/solver.

API trình bày dành cho tích hợp và kiểm thử:

```js
await WZWTemplateUI.setTemplate('h1');
await WZWTemplateUI.mountActors(resolvedActors);
WZWTemplateUI.mountEvents(resolvedEvents);
```

`resolvedActors` cần `placeId` hoặc `placeName` khớp metadata của template, `name`, `tagType`, `footstep`; `inside` là trạng thái scene đã được resolver xác định, không phải quyết định của artwork. Không truyền tọa độ Gemini. Khi ngoài vùng cấm không tìm được điểm hợp lệ trong địa điểm, adapter không tự chuyển actor sang nơi khác. Không cấp actors/events thì không sinh NPC/quest/RP mẫu.
`resolvedEvents` dùng `title`, `detail`, `placeId|placeName`, `hidden` cho kiểu icon; đây là dữ liệu trình bày sau resolve, chưa thay contract chung.

## Ghi nhớ bắt buộc cho phiên MAP_DATA sau

Bổ sung hai trường đã duyệt vào contract và MAP_PROMPT khi xây cơ chế MAP_DATA; không tự nhập schema/runtime cũ:

- `actors[].tagType`: AI chọn từ `gryffindor`, `slytherin`, `ravenclaw`, `hufflepuff`, `beauxbatons`, `durmstrang`, `teacher`, `adult`, `patrol`, `animal`, `monster`, `ghost`, `unknown`, `crowd`. Engine đối chiếu token, AI không tự đặt hex. Toàn bộ cặp main/accent giữ nguyên bảng màu trong HTML. PC dùng màu loại/Nhà và viền #D2A64D. Patrol chỉ khi thực sự đang tuần tra (`onPatrol=true`), không suy từ chức danh.
- `actors[].footstep`: `walk|idle|hidden`, AI chọn theo hành động RP có cơ sở. Resolver bảo đảm inside/ngồi/nằm/bơi/lặn ẩn chân nếu không phù hợp. Không dùng hoạt động để tự dịch phòng hoặc tạo đường đi.

Năm mục Inspector giữ nguyên: VỊ TRÍ, NGHE HÓNG, QUAN SÁT, AI ĐÓ, HÓNG HỚT TÁM PHƯƠNG. Metadata cấp vị trí/mô tả; actor cấp tên, hoạt động, quan sát; event cấp đầu mối thực. Không invent RP để lấp trường thiếu. Nối `window.MAP_DATA`, loader đồng SHA và AI Studio Preview thuộc phiên tích hợp sau, chưa triển khai trong nhánh template này.

## Nguồn và Việt hóa

- HTML người dùng: `WIZAMAP_01_FIXED_TEMPLATES_UI_OFFLINE.html`, 966.551 bytes. Artwork/giấy phép nguồn giữ trong dialog Nguồn và giấy phép.
- H1 motion: [repo cũ/elements/h1-motion.js](https://github.com/Ngoc1804/wzw-hogwarts-map/blob/main/elements/h1-motion.js), blob `607d906affdc21c11f750d961e72ff9f824cbf4a`. Tích hợp trực tiếp, không giữ thêm bản module trùng. Không nhập engine/adapter cũ.
- Nội thất mới tái dùng fixture SVG trong HTML, cùng một symbol dùng cho nhiều instance. Đài sân trong sao chép geometry H2, không vẽ đài thay thế. Kệ sách mới dùng một symbol chung, giữ tone mực/giấy.
- Đối chiếu thuật ngữ Lý Lan: [Lều Hét — tập 7](https://vietnamthuquan.eu/TacPham/harry-potter-va-bao-boi-tu-than-2-12341/chuong-33), [Công tước Mật — tập 3](https://thuvien.vietnamthuquan.eu/TacPham/harry-potter-va-ten-tu-nhan-nguc-azkaban-4011/chuong-11), [Ba Cây Chổi Thần — tập 3](https://thuvien.vietnamthuquan.eu/TacPham/harry-potter-va-ten-tu-nhan-nguc-azkaban-4011/chuong-10), [Phú Quý và Cơ Hàn — thư viện Khánh Hòa](https://pr.thuvienkhanhhoa.gov.vn/tai-lieu-so-chuyen-de-237), [Hẻm Xéo/Hẻm Knockturn](https://hogwarts.vn/home/2014/07/choi-chu-hem-xeo-knockturn/), [địa danh và tên tiệm](https://legacy.hogwarts.vn/printthread.php?tid=2371).
- Giữ Hogwarts, Hogsmeade, tên bốn Nhà, Quidditch và họ/tên chủ tiệm. Nhãn loại cửa hàng, phòng và AU chỉ mô tả bằng tiếng Việt; không khẳng định các nhãn diễn giải trong artwork đều xuất hiện nguyên văn trong sách. Các nguồn web đối chiếu không thay thế việc so từng dòng với một ấn bản in cụ thể.

## Dung lượng và bảo trì

HTML hiện khoảng 964 KB, nhỏ hơn bản gốc dù thêm decor, mask và API trình bày. Không tải lẻ asset, không CDN, không backend. Số thập phân rất dài chuẩn hóa tới 3 chữ số, sai số dưới 0,001 đơn vị artwork. Shared symbols tránh nhân bản đồ mới; gzip level 9, mtime=0 bảo đảm pack xác định.

Sửa dữ liệu gốc trực tiếp, không chèn patch runtime:

```sh
python tools/template-data.py unpack work/templates.json
# Sửa JSON/SVG trong work/templates.json
python tools/template-data.py pack work/templates.json
```

`work/` chỉ là thư mục scratch, không commit các bản JSON/SVG giải nén trùng với HTML. Test và ảnh là tài liệu kiểm tra, không được tải bởi HTML production.

## Kiểm thử và giới hạn

Kết quả máy đọc: `tests/qa.json`. Ảnh tổng hợp: `tests/preview.webp`.

- PASS 13/13 template tải, không lỗi JavaScript; không thiếu href hoặc trùng SVG ID.
- PASS 348 vùng tương tác bằng Enter với tên Inspector đối chiếu đúng metadata/aria-label.
- PASS click chuột và tap thật trên mỗi template (26 ca, desktop 1500×950 và mobile 390×844).
- PASS X-Ray đúng nhà Hagrid, opacity 0.3; inside nhưng không chồng tag không mờ; chồng lại thì mờ; xóa actor phục hồi. Nước/ngoài bounds bị từ chối.
- PASS walk sáu use đã đảo chân; reduced-motion còn hai dấu; xóa actor không dư chân/timer. NPC inside không có chân.
- PASS hai kiểu icon, click mở đúng nội dung Inspector; không có actors/events vẫn render.
- Đã xem ảnh H1/H2, Đại Sảnh, bốn nhà chung, X-Ray và mobile; giữ bố cục và màu Nhà.
- Chưa chạy trên Safari hoặc Google AI Studio Preview; chưa nối toàn bộ engine/contract MAP_DATA. Raster theo độ phân giải hữu hạn, không phải chứng minh hình học cho mọi polygon. Không tuyên bố QA cho map generated chưa xây.

Chạy lại bằng Node + Playwright và Chromium:

```sh
node tests/template-ui.cjs
node tests/interaction.cjs
```

Có thể đặt `CHROMIUM_PATH` để chọn Chromium. Lịch theo giờ hoàn tất nhiệm vụ triển khai nhánh này và sẽ được tắt sau khi commit bàn giao được lưu; không tự merge main.

### Sửa nội thất sảnh sau phản hồi

Đã bỏ toàn bộ lớp decor thêm gây chồng chéo, sắp lại cụm tiếp khách phòng giáo viên, giữ một tủ sách sát tường; trả lối bên phải lớp học và tủ hồ sơ đơn của Filch về bố trí gọn. Phòng chờ có hai ghế dài dọc tường, một bàn nhỏ và ghế tách rời. Sân trong giữ một đài H2, bốn chậu cây gốc và hai ghế; bỏ các chậu lặp. Đại Sảnh và bàn bốn Nhà giữ nguyên. Ảnh riêng `tests/hall-review.webp` là bản sửa đã được người dùng duyệt.

## M2-P02/P03 sandbox integration

User approved concise payload, tolerant fallback, runtime catalog selection and new-shop binding. See [contract/status](docs/MAP_DATA.md) and [draft Gemini prompt](docs/MAP_PROMPT.md). Current implementation adds contract + prop composition helper, 44 floor/direction clusters, Fixed/Custom resolve, empty-house assignment and supplementary schematic detail. No new branch.

P2/P3 are **in progress**, not globally complete: full World/tower/AU alias bindings, pointer traversal, recipe merge integration, event architectural targets and exact Generated geometry remain unverified/unimplemented as documented. P4 aesthetic gate and target Preview remain open. The P1 error-on-unknown policy is superseded: runtime now attempts schematic/text fallback. Reference P0/P1 measurements describe the earlier commit only. Latest bytes are in build-metrics.json. Use local server port 8770 for current p1/p2-p3 tests.

## M2-P02 — ID alignment and prompt handoff

Atlas content is complete; current work aligns IDs instead of adding geography. ATLAS_W4.md now lists all 13 existing Fixed, 348 exact artwork metadata IDs, 41 real recipe IDs, floor/tower/AU scopes and location IDs. `tools/atlas.py` compiles those tables; runtime consumes canonical IDs directly. World macro scopes keep their supplied content, and construct only current RP places, not entire regions.

`assets/recipes.json` contains inventories extracted from the supplied interiors, stable per-instance IDs and original transforms. `src/props.js` composes those actual inventories (ensure/add/replace/state) without mutation; the bundle excludes unused source transforms and duplicate Fixed metadata. Displaying the resulting furniture geometry belongs to P4 and has not received visual approval. Current Generated remains schematic. No old source was fetched or imported.

Commands: `python tools/atlas.py`, `python tools/build.py`, `python tools/loader.py`; serve on localhost:8780. QA: tests/ids-props.cjs and tests/p2-p3.cjs; previous Fixed smoke rerun with MAP_PREVIEW_URL. Canonical IDs, nine inventory/binding cases and eleven sandbox cases passed locally. Google AI Studio Preview remains NOT TESTED. System-prompt paste instructions and full R14.6 are supplied separately; no user prompt is edited automatically.

Prompt handoff: [paste guide](docs/PASTE_GUIDE.md), [full R14.6](docs/MAP_PROMPT.md), [normalized Atlas](docs/ATLAS_W4.md), [deduplicated W4 tail](docs/W4_TAIL.md). Runtime URLs pin source commit `f6498ffd9af16010549cc719a2db858fdf02ce7f`; documentation-only normalization keeps the generated Atlas/dist bytes identical. No master prompt is edited automatically. Full loader local test uses intercepted CDN requests with the exact local dist, including script-tag escaping and core failure text fallback; it does not certify live CDN or Google AI Studio Preview. P4 remains next.

Inventory extraction excludes 60 nested data-object metadata wrappers (not artwork); only outer physical instances count. Stable outer source IDs remain unchanged.


---

# PROJECT PLAN — nguyên văn tài liệu người dùng cấp

# WZW MAP 2 — HƯỚNG DẪN DỰ ÁN VÀ KẾ HOẠCH TRIỂN KHAI

**Trạng thái:** Kế hoạch thống nhất đã cập nhật sau rà soát; luồng cốt lõi gọn, tính năng đồ họa nâng cao tách riêng. Phạm vi và cơ chế nền đã được người dùng duyệt. Chờ bộ source mới để kiểm kê và xác định baseline; chưa coi tài nguyên, contract hoặc renderer đã được tích hợp chỉ vì có trong tài liệu này.

**Repository duy nhất:** `Ngoc1804/wzw-hogwarts-map-2`.

**Đầu ra:** Hệ thống dựng bản đồ SVG cho Sandbox Roleplay, chạy trong trình duyệt và Google AI Studio Preview. Gemini xuất dữ liệu RP cùng HTML loader ngắn; JavaScript dựng hình từ code và tài nguyên của Map 2.

Tài liệu này là kế hoạch thống nhất để xây dự án. Các tài liệu/phiên bản trước chỉ là nguồn tham khảo, không là một bộ quy tắc song song. Không dùng repository khác làm đích triển khai. Không tự nhập code di sản; chỉ sử dụng source người dùng cấp và các dependency thực sự cần, sau kiểm kê.

---

## 1. Mục tiêu và nguyên tắc

Thứ tự ưu tiên:

**Đúng sự thật RP → đúng địa điểm và đủ cluster Atlas → bố cục/nội thất rõ, đẹp → tương tác nhẹ → Preview ổn định.**

- Gemini quyết định nội dung RP và thông tin PC được phép biết. Engine không tự tạo NPC, quest, sự kiện, đường nối canon hoặc thay đổi trạng thái truyện.
- Atlas là địa điểm nền; catalog, template và recipe là công cụ dựng hình. Chúng không được phủ quyết địa điểm/vật thể mới trong RP.
- Giữ artwork, phong cách giấy cổ beige, mực nâu, footsteps burgundy, màu ribbon và UI đã duyệt.
- Source mới có phần tốt thì giữ và tích hợp; không xóa để xây lại tùy tiện. Không giữ hai renderer/contract hoạt động cạnh tranh lâu dài.
- Một lỗi asset hoặc visual chỉ làm fallback đối tượng đó; không làm trắng toàn cảnh.
- Hình ảnh độc bản chỉ được coi đạt sau khi render và xem ảnh thực tế. Không hứa thể hiện chính xác mọi mô tả hoặc đạt một tỷ lệ thành công/tốc độ cố định trước QA.

### Không xây trong dự án

Backend/API AI, world simulator, database trạng thái RP, tự tiến thời gian, NPC simulation, pathfinding, navigation mesh, collision gameplay, furnishing solver riêng, standing-point system riêng, slot/S–M–L bắt buộc, click thực hiện hành động RP.

Không dùng fog/visibility để giấu dữ liệu bí mật đã gửi xuống browser. Không xây bộ kiểm soát quyền RP hoặc cơ chế từ chối phòng trong engine.

---

## 2. Tiếp nhận source mới và baseline

Người dùng sẽ cấp toàn bộ source mới. Trước khi triển khai:

1. Xác minh repo, nhánh, HEAD, working tree và các hướng dẫn dự án thực sự có trong source.
2. Ghi tên file nguồn, hash/commit, giấy phép và trạng thái được duyệt; phân biệt bản gốc, bản mẫu, bản xem offline và code runtime.
3. Kiểm kê bằng cả cấu trúc file lẫn render, không chỉ đếm số lượng.
4. Xác định phần giữ nguyên, phần cần sửa, phần chỉ dùng làm tham khảo và phần thiếu. Chỉ hỏi đầu vào còn thiếu thực sự chặn công việc.
5. Chốt baseline trước thay đổi. Không giả định source cấp lần tới trùng với file đã dùng trong các phiên trước.

### Tài nguyên cần đối chiếu

| Nhóm | Nội dung cần xác nhận |
|---|---|
| Fixed | Đủ 13 mẫu; bounds, defs, IDs, shading, animation, tương tác, các nhóm công trình |
| UI | Shell, CSS, tokens, năm mục Inspector, camera, ribbon, icon và footsteps đã duyệt |
| Atlas | Nguồn chuẩn, owner, group/cluster, routing pointer, alias, canonical ID, tầng/hướng, AU |
| SVG elements | Catalog/metadata, kích thước hữu dụng, viewBox, alias, công năng, nguồn và giấy phép |
| Nội thất | Cụm ghép sẵn/recipe và mẫu thiết kế được cấp; bố cục, cửa, tỷ lệ, đồ đã có trong từng cụm |
| Runtime | Entry, normalizer, resolver, builder/draw, markers, bundler và tests thực sự tồn tại |

Các số lượng 259/309 SVG, nhóm phòng và số bản ghi Atlas trong tài liệu nguồn là số liệu cần đối chiếu, không phải hằng số để ép source khớp theo. Không nhập toàn bộ pack chỉ vì có nhiều asset hơn. Không mặc định source thiếu chỉ vì tên file khác kế hoạch.

Bản nội thất Đại Sảnh sửa lại và UI đã được duyệt trong phiên trước là mốc đối chiếu thẩm mỹ. Khi nhận source mới, xác nhận đúng bản này trước khi thay thế. Không coi các hình cũ bị bác bỏ là baseline đã duyệt.

---

## 3. Kiến trúc thực thi

```text
/map
 → Gemini đọc snapshot RP đã chấp nhận và đối chiếu Atlas
 → Lọc thông tin theo điều PC được biết
 → Xuất MAP_DATA + một HTML loader ngắn
 → Browser tải CSS, templates pack và engine cùng commit SHA
 → Normalize dữ liệu
 → Resolve Fixed / Atlas Blend / Custom và thay đổi RP
 → Build geometry và vùng hợp lệ
 → Compose nội thất, vật thể, artwork
 → Draw SVG
 → Markers, POI, Inspector, zoom/pan
 → Preview
```

- GitHub lưu code/tài nguyên; browser thực thi renderer. URL script không có nghĩa Gemini đã đọc repo hoặc biết catalog.
- Không gọi thêm AI từ browser để chọn hoặc xếp nội thất mỗi lượt `/map`.
- Một contract đầu vào, một scene chuẩn nội bộ, một pipeline dựng hình. Scene nội bộ không phải schema thứ hai bắt Gemini xuất.
- Vị trí/footprint của artwork, đồ vật, chân và hitbox phải cùng hệ tọa độ, có transform rõ khi chuyển giữa local/world/screen.

### Phân quyền

| Gemini cung cấp | Engine thực hiện |
|---|---|
| Địa điểm, PC/NPC, hoạt động, quan sát, sự kiện thực có | Normalize, resolve và trình bày; không bổ sung diễn biến |
| Thay đổi cấu trúc, vật thể bắt buộc và quan hệ không gian | Chọn geometry, asset/recipe, scale, placement, layering |
| Ý đồ hình dạng ngữ nghĩa; visual chỉ khi capability mở rộng được bật | Kiểm dữ liệu, dựng primitive/path hoặc fallback |
| Địa điểm và zone tương đối của actor | Chọn điểm hiển thị có căn cứ, tách chân và nhãn |
| Nội dung PC được biết | Inspector thuần client; không thực hiện hành động RP |

---

## 4. MAP_DATA — một hợp đồng duy nhất

Contract lấy V4 làm nền. P2 đối chiếu source mới để chốt schema/version chính thức: mở rộng tương thích được ghi rõ, thay đổi không tương thích phải có migration/version phù hợp; không gắn cứng nhãn 4.0.0 cho mọi thay đổi. Không dùng prompt mới trước khi normalizer và renderer hỗ trợ các field tương ứng.

### 4.1. Trường cấp cảnh

| Trường | Quy tắc |
|---|---|
| `schemaVersion` | Phiên bản đã khóa tại P2, dùng nhất quán trong schema, normalizer và prompt |
| `meta` | `date`, `time`, `areaName`, `quote`; `theme?` chỉ gợi ý vật liệu/màu Generated, không đổi Fixed |
| `mapMode?` | `template`, `indoor`, `outdoor`; bỏ trống để tự chọn. Nếu source dùng `auto`, normalizer coi tương đương bỏ trống. Không thêm `mixed` mặc định |
| `atlasAnchor?` | Fixed/group/cluster đã xác định, hoặc `custom`; không bịa ID |
| `templateState?` | `intact`, `modified_props`, `structural_change` |
| `layoutType?` | `auto` hoặc một trong 10 preset; phòng đơn tự nhận diện; hình học nâng cao dùng capability riêng, không thêm enum tùy tiện |
| `pcPlace` | ID/tên địa điểm hiện tại; ưu tiên khi khác actor PC, ghi diagnostic nếu mâu thuẫn |
| `pcSpot?` | `inside`, `corridor`, `threshold`, `outdoor`; không tự đổi ngưỡng cửa/hành lang thành ở trong phòng |
| `places[]` | Các địa điểm RP cần mô tả/ghi đè, không phải bản chép lại toàn bộ phòng Atlas |
| `actors[]` | Các nhân vật PC được phép biết; rỗng hoặc thiếu NPC là hợp lệ |
| `events[]` | Sự kiện/đầu mối có thật; dùng `title`, `detail`, không tráo sang field chưa hỗ trợ |

### 4.2. Địa điểm, props và thay đổi cấu trúc

`places[]` hỗ trợ `id?`, `name`, `type?`, `description?`, `size?`, `props?`, `architecture?`, `propsMode?`, `templateState?`.

- Tên, type và item là chuỗi mở. Loại mới không phải lỗi schema. Custom không bắt buộc có ID do Gemini tự đặt.
- `size` là gợi ý tương đối; không tạo một bộ prefab S/M/L hoặc kéo giãn đồ theo size.
- `architecture` là tùy chọn: luồng cốt lõi chỉ nhận gợi ý ngữ nghĩa ngắn thuộc khả năng đã hỗ trợ, chẳng hạn dạng phòng tròn hoặc cửa ở hướng xác định. Không bắt Gemini gửi polygon/path hay tọa độ. Nếu hình học chưa hỗ trợ, dựng sơ đồ gần đúng có ghi chú hoặc detail view; không giả hình trang trí là cấu trúc thật. Sàn sập được xác nhận phải loại vùng đứng/đặt đồ tương ứng, không chỉ vẽ vết nứt trang trí.
- `propsMode: merge` là mặc định: thêm/sửa nội thất nền. `replace` thay toàn bộ nội thất nền; `replace` cùng props rỗng phải dựng được phòng trống.
- `places[].templateState` ưu tiên hơn field cấp cảnh cho địa điểm tương ứng.

Dạng props mặc định ngắn, hai cách đều được normalize vào một kiểu nội bộ:

```json
["vạc thuốc", {"name":"gương vỡ", "count":1, "zone":"wall_north"}]
```

Chỉ `name` cần có ở object dạng ngắn; `count` mặc định 1. Không bắt xuất hàng loạt field rỗng. Các trường `id`, `item` (alias công năng), `op`, `required`, `state`, `layout` chỉ dùng khi cần diễn đạt chính xác; `visual` chỉ được nhận khi đã bật capability nâng cao ở mục 8.3. Đồ RP được khai báo rõ phải còn đại diện khi không có asset; không coi thiếu `required:true` là cho phép âm thầm xóa món đó.

**Quy tắc merge và chống trùng:**

- Recipe cấp ID ổn định cho từng instance/nhóm nội bộ. Prop có `id` hợp lệ nhắm đúng instance/nhóm đó; không tự khớp nhầm nhóm khác.
- Không có ID: khớp tên/item đã normalize trong cùng phòng; dùng zone để phân biệt khi có. Chỉ tự sửa khi khớp duy nhất, không fuzzy-match tùy tiện.
- Mặc định `op:"ensure"`: count là tổng số mong muốn trong tập khớp, không phải số cộng thêm. Ví dụ nền có 4 ghế, props ensure 4 thì vẫn 4.
- `op:"add"` chỉ dùng khi RP thực sự bổ sung: count là số thêm. Cùng seed/input và ID instance sinh ổn định; render lại cùng payload không tích lũy thêm đồ.
- Nếu khớp nhiều nhóm mà không rõ đối tượng, giữ thông tin props và báo diagnostic; dùng đại diện/nhãn khi cần, không sửa ngẫu nhiên hoặc nhân đôi tất cả. Đây là trường hợp cần dữ liệu rõ hơn, không được tự chế cách hiểu.
- `replace` xóa nội thất nền và áp danh sách props mới; `replace` + mảng rỗng tạo phòng trống. Không xóa kiến trúc/sàn/cửa bằng propsMode. Diện tích/hình dạng là việc của architecture/templateState.
- Nếu RP nói rõ đồ hỏng/biến mất mà recipe có sẵn, phải sửa/loại đúng món; không thêm bản hỏng cạnh bản nguyên. P2 khóa biểu diễn state và ca kiểm thử trước dùng trong prompt.

### 4.3. Actors và events

Actors hỗ trợ `id?`, `name`, `isPC?`, `placeId?`, `placeName?`, `houseOrRole?`, `activity?`, `observation?`, `spot?`, `zone?`, `tagType?`, `footstep?`.

- `tagType` chọn từ bảng đã duyệt: `gryffindor`, `slytherin`, `ravenclaw`, `hufflepuff`, `beauxbatons`, `durmstrang`, `teacher`, `adult`, `patrol`, `animal`, `monster`, `ghost`, `unknown`, `crowd`.
- Engine lấy cặp main/accent từ tokens, không để Gemini tự chọn hex. PC giữ màu Nhà/loại và viền vàng đã duyệt.
- `patrol` chỉ dùng khi RP xác nhận đang tuần tra; nếu cần, `onPatrol` là cờ xác nhận tùy chọn. Chức danh giám thị/huynh trưởng không tự đồng nghĩa đang tuần tra.
- `footstep`: `walk`, `idle`, `hidden`; AI chọn theo hành động đã có. Renderer vẫn ẩn chân khi trạng thái hoặc sàn không cho phép.
- `spot` là trạng thái vị trí, cùng từ vựng với `pcSpot`: `inside`, `corridor`, `threshold`, `outdoor`. `zone` chỉ vị trí tương đối trong địa điểm như `center`, `entrance`, `wall_north`; không dùng chung nó làm cờ inside/outdoor. Với PC, pcSpot cấp cảnh ưu tiên spot của actor PC. P2 ghi field spot tùy chọn vào contract duy nhất; không thêm adapter thứ hai. Alias `outside` nếu có trong source cũ chỉ normalize thành `outdoor` tại một điểm. Không suy inside chỉ từ loại công trình.
- Trạng thái inside/outdoor thực thi là thông tin scene đã resolve. Nếu dữ liệu mơ hồ, không tự suy inside hoặc đặt chân lên mái/nước.
- Actor nhắc nơi ngoài places: tra Atlas trong scope; chưa có thì minh họa nơi RP đã nêu, không bịa địa điểm thay thế.

Events hỗ trợ `id?`, `title`, `detail?`, `placeId?`, `placeName?`, `target?`. `target` gắn vào kiến trúc đã dựng: phòng, tường, cửa, cầu thang hoặc công trình. P2 khóa target dạng tham chiếu ngữ nghĩa vào kiến trúc đã dựng, gồm loại target và khóa/ID cục bộ; không nhận CSS selector hoặc tọa độ màn hình tùy ý. Không có anchor chi tiết thì gắn cấp địa điểm và giữ detail; không tự bịa cửa/tường để khớp target.

Event và Quest là một loại hiển thị kính lúp. Nếu cần đánh dấu đầu mối ẩn nhưng PC đã nhận biết dấu hiệu, event có thể khai báo `hidden: true` để dùng dấu hỏi. Đây là trạng thái trình bày, không cho phép nhúng bí mật PC chưa biết.

### 4.4. Normalize và thông tin được phép biết

- Thiếu field phụ dùng mặc định trình bày, không tạo dữ kiện RP. Không ép PC vào phòng đầu tiên.
- Thông tin riêng tư được Gemini lọc trước serialize. Không gửi bí mật vào JSON/DOM rồi che bằng opacity, fog hoặc CSS.
- Không dùng Information Gate để cắt các phòng Atlas nền vô hại; cluster vẫn đủ phòng. Nội dung bí mật của phòng được bỏ khỏi payload, không tự dựng thêm cơ chế engine từ chối địa điểm.
- Giữ trạng thái AU ACTIVE/LOCKED của nguồn; LOCKED không tự mở toàn bộ chỉ từ tên, cũng không phủ quyết nội dung RP cụ thể được phép minh họa.
- Alias tương thích source chỉ được nhận tại một điểm normalize; không duy trì nhiều contract/pipeline song song.

### 4.5. Ưu tiên dữ liệu và kiểm tham chiếu

| Xung đột | Quyết định |
|---|---|
| pcPlace và actor PC khác nhau | pcPlace hợp lệ ưu tiên; ghi diagnostic, không chuyển PC theo vị trí vẽ tiện hơn |
| Nhiều actor isPC | Chỉ nhận một PC sau normalize nếu xác định được duy nhất; nếu còn mơ hồ, không chọn phần tử đầu làm sự thật RP |
| placeId hợp lệ khác placeName | ID xác định binding; tên không được âm thầm trỏ sang phòng khác. Ghi xung đột để kiểm dữ liệu |
| ID không tồn tại nhưng tên khớp duy nhất trong scope | Có thể resolve bằng tên với diagnostic; tên trùng/mơ hồ thì giữ unresolved |
| templateState phòng khác cấp cảnh | Field phòng ưu tiên riêng địa điểm đó; thay đổi ở phòng xa không buộc bỏ toàn overview |
| explicit mode, anchor và thực trạng RP không cùng hướng | Xác định scope PC/sự thật cấu trúc trước; explicit mode dùng khi phù hợp. Giữ thông tin mâu thuẫn trong diagnostic, không tự tạo cấu trúc/địa điểm để hợp thức hóa |
| Thiếu vị trí PC hoặc tham chiếu chưa resolve | Giữ actor và nội dung trong Inspector; không đặt PC ở phòng đầu hay tâm map như vị trí thật |

P2/P3 phải có ca test riêng cho tham chiếu sai, dữ liệu thiếu, dữ liệu mâu thuẫn và type mới. ID trùng không được âm thầm gộp hai địa điểm; count phải là số nguyên hữu hạn không âm, giá trị sai được ghi diagnostic và dùng fallback trình bày bảo thủ, không kích vòng lặp sinh đồ vô hạn. “Không trắng trang” không có nghĩa các liên kết dữ liệu đã đúng. Chỉ hiển thị vị trí chính xác khi có binding đủ căn cứ; dữ liệu chưa resolve vẫn được giữ có tên và ghi nhận giới hạn.

---

## 5. Atlas và resolver

### 5.1. Một nguồn Atlas

Atlas gồm TEMPLATES/vùng sở hữu, WORLD + HOGWARTS và AU theo nguồn. Giữ canonical ID, name, tầng, hướng, cluster và layout.

- Một địa điểm có một owner. Routing pointer không tạo bản sao phòng.
- Match ID trước; alias/name chỉ khi không mơ hồ trong owner/cluster/ngữ cảnh. Không gộp phòng vì trùng tên.
- Bản dễ đọc và runtime index sinh từ cùng nguồn chuẩn. Không tạo Atlas/ANCHOR_MAP thứ hai; không ghi địa điểm RP phát sinh ngược vào Atlas.
- Khi chọn Atlas Blend: **đủ 100% phòng của cluster đã chọn + phòng RP bổ sung**. Nếu input chọn nhiều cluster, mỗi cluster được resolve rõ; không kéo cả Hogwarts vào map.
- Nếu scene quá đông, mở rộng bố cục hoặc chuyển scope được thể hiện rõ; không âm thầm cắt phòng để dễ render.

### 5.2. Quy tắc chọn cảnh

| Trường hợp | Cách xử lý |
|---|---|
| Kiến trúc tại scope đang xem thay đổi lớn, rõ ràng | Generated/detail view theo RP; giữ phần artwork phù hợp, không hiện Fixed nguyên trạng như tình trạng thực tế |
| Anchor custom | Dựng nơi mới, không ép vào Fixed/Atlas |
| Explicit indoor/outdoor | Dùng renderer tương ứng sau resolve dữ liệu |
| Fixed phù hợp, intact | Dùng artwork đã duyệt cùng markers/Inspector |
| Modified props trên Fixed | Chỉ overlay đồ khi có anchor/vùng đặt đã kiểm; không có thì detail view Generated hoặc Inspector |
| Không có Fixed nhưng có cluster | Atlas Blend đủ phòng cùng thay đổi RP |
| Nơi chưa có binding | Custom minh họa trong phạm vi thông tin đã biết |

Không suy structural change bằng NLP tùy tiện trong JavaScript. Gemini phải khai báo thay đổi có chủ đích. Bàn gãy, đồ vỡ, đổi decor hoặc vết nứt nhỏ không làm mất Fixed: giữ artwork, dùng POI/Inspector hoặc overlay đã có anchor hợp lệ. Chỉ thay đổi làm bố cục/kết cấu của scope thực sự không còn đúng mới chọn Generated/detail view. Không giữ Fixed bằng mọi giá nếu nó thể hiện sai RP; khi chỉ có thể hiện sơ đồ gần đúng, ghi rõ giới hạn.

Không vẽ khối phòng Generated tùy tiện đè artwork Fixed. PC ở trong nội thất mới không có trên Fixed thì dựng Generated Indoor; overview chỉ dùng marker/ribbon/điểm liên kết phù hợp.

### 5.3. Ổn định bố cục

Seed từ scope/anchor, ID/danh sách địa điểm, layout và thuộc tính cấu trúc. Thời gian, NPC, hoạt động không làm xáo phòng. Phòng mới hoặc thay đổi kiến trúc có thể làm bố cục mở rộng/sắp lại. Không lưu tọa độ thế giới vĩnh viễn hoặc tự xác nhận đường nối canon chưa có nguồn.

---

## 6. Fixed Templates và UI đã duyệt

13 Fixed:

`h1`, `h2`, `hall`, `gryffindor-common`, `ravenclaw-common`, `hufflepuff-common`, `slytherin-common`, `village-static`, `pitch-static`, `express`, `diagon-knockturn`, `ministry2`, `ministry-8-10`.

- Giữ artwork, bố cục, defs, IDs, shading, animation và tương tác đã duyệt; kiểm riêng motion H1.
- H2/Hogsmeade/Hẻm Xéo cần xác định sàn/đường/sân/cầu, mái/nước, thứ tự layer và từng nhóm có thể X-Ray.
- Tách từng nhà/công trình theo nguồn thực. Không làm mờ toàn khu hoặc địa hình chỉ vì nó chung group với một công trình. Ví dụ cầu và khe đất phía sau phải tách vai trò che lấp.
- Shading rêu nhẹ, blur hòa nền; không thêm khối đặc nặng mắt. Giữ sửa màu nền H2 và bỏ shade đỏ không phù hợp ở cầu H1 nếu chúng có trong source đã duyệt.
- Nội thất hall và các nhà chung dùng đúng bản cuối được duyệt. Không tự decor lại, tăng/giảm đồ hoặc thay bố cục vì thấy có thể làm đẹp hơn.

### UI runtime và bộ xem mẫu

Runtime giữ header thương hiệu, viewport, sidebar/Inspector, zoom/pan, ribbon và màu Nhà/vai trò. Không đưa lại hai hàng chọn khu/template và các nút thử UI đã bỏ.

Bản HTML xem mẫu offline phải có nút **Xem template — 13 mẫu**, dễ tìm, không cần sửa URL để chuyển map. Bộ chọn phục vụ duyệt được tách khỏi UI runtime hoặc bật bằng chế độ review; không biến thành hàng điều khiển thường trực của cảnh RP.

Không gom nhãn theo zoom mặc định. Trước hết dùng bố trí nhãn tối thiểu và kiểm cảnh đông NPC; chỉ đề xuất clustering khi có bằng chứng cần, có mẫu và được duyệt riêng.

---

## 7. Dựng Indoor và hình học

- Phòng đơn là trường hợp tự nhận diện, không bị ép có hành lang.
- Giữ đúng 10 preset: `horizontal`, `vertical`, `windows`, `ell`, `tee`, `cross`, `court`, `cloister`, `curved`, `tower`. Không đổi tên court thành một hệ khác.
- Giai đoạn cốt lõi ưu tiên hình học đã hỗ trợ và kiểm được: phòng chữ nhật, tròn/tháp, cùng các đoạn/hình tương ứng 10 preset. RP vẫn được nêu tên/hình dạng tự do. Polygon/curve tùy ý chỉ mở khi capability nâng cao đạt kiểm thử; chưa có thì dùng sơ đồ gần đúng có ghi chú, không tự tuyên bố cửa khớp hoặc hình dạng chính xác.
- Dựng sàn, chân tường, mặt đứng 2.5D nhẹ, cửa/cửa sổ/cầu thang phù hợp. Cửa thuộc ranh giới tiếp giáp thật, giữ lối đi và khoảng mở cửa.
- Tăng số phòng thì mở rộng bố cục, không cắt phòng. Kích thước phòng theo công năng/RP, không một kích thước pixel cho mọi nơi.

### Kiểm vị trí tối giản

- Bbox lọc sơ bộ; phòng chữ nhật dùng bounds và khoảng đệm đơn giản.
- Hình cong/lõm hoặc vật có footprint không thường mới cần polygon containment/overlap và kiểm giao cạnh phù hợp. Không chỉ kiểm tâm đối tượng.
- Safe floor dựa vào biên sàn/chân tường thật. Mặt đứng 2.5D chiếu ra ngoài sàn không phải lý do trừ chiều cao tường thêm lần nữa.
- Vùng đặt đồ và vùng chân khác nhau: bàn/tủ không chắn cửa; chân có thể ở threshold/cửa nếu nền thực hợp lệ.
- Đồ trên mặt bàn gắn theo surface của món mẹ, không coi là vật cản sàn riêng. Đồ treo tường không shear/skew để ép khớp mặt tường.
- Nếu chật: đổi cách đặt hợp lý, giảm decor nền, hoặc mở rộng phòng minh họa khi phù hợp RP. Không âm thầm bỏ vật bắt buộc hoặc thay sự thật RP.

Không tạo module solver/obstacle riêng chỉ vì có kiểm bounds và footprint.

---

## 8. Nội thất: recipe kết hợp và đồ vật mới

### 8.1. Thứ tự ưu tiên

1. Thay đổi kiến trúc, đồ RP bắt buộc và `propsMode`.
2. Cụm nền/recipe phù hợp công năng đã có.
3. Sửa/bổ sung đồ RP khác thường, không nhân đôi món đã nằm trong cụm.
4. SVG rời cho phòng chưa có cụm hoặc phần chưa được recipe đáp ứng.
5. Tùy biến/ghép/primitive của engine hoặc fallback cho đối tượng mới; visual đặc tả chỉ ở capability X.
6. Decor nhỏ khi còn chỗ, không cản lối và không làm nhiễu bản đồ.

Recipe là cấu hình nền có thể thay đổi, không phải prefab cứng cho từng tên Atlas. Phòng phổ biến như Classroom/Potions/DADA dùng cụm đã ghép khi phù hợp; phòng mới không cần có prefab riêng mới render được.

Recipe/cụm chỉ cần tên/alias công năng, kích thước gốc, hướng, các món đã chứa, footprint/anchor hữu dụng. Nếu props trùng món nền, engine sửa/thay instance hoặc số lượng tương ứng thay vì thêm một bản nữa. Món cùng loại nhưng thực sự bổ sung phải được dữ liệu thể hiện rõ.

Phòng lớn tăng số cụm hoặc số món phù hợp, không phóng đại hay kéo méo cả cụm. Các biến thiên decor dùng seed ổn định; không random lại khi NPC di chuyển.

### 8.2. Một pipeline cho mỗi vật thể

```text
Tên/công năng + props ngắn + trạng thái RP
 → Asset chính xác hoặc alias đáng tin
 → Tùy biến asset gần loại nhưng không đổi bản chất
 → Ghép asset/shape bộ phận
 → Primitive/procedural của engine đã hỗ trợ
 → Hình thay thế có tên và thông tin đúng RP
 → Normalize local geometry → scale/mount → placement → draw
```

Gemini không đọc danh sách hàng trăm asset ID. Luồng mặc định không gửi tọa độ, polygon, path, rotation hoặc visual grammar. Engine dùng asset/cụm/primitive có sẵn, rồi hình đại diện có tên khi cần. Không chọn bệ đá/rương một cách tùy tiện nếu làm sai ý nghĩa món đồ; dùng biểu tượng trung tính cùng mô tả khi chưa biết hình dạng. Không áp quota cứng khiến vật quan trọng bị cắt.

### 8.3. Mở rộng đồ họa nâng cao — không chặn lộ trình cốt lõi

Phần này không bắt buộc cho `/map` thông thường hoặc phát hành lõi. P2 chỉ quy định điểm mở rộng tùy chọn, trạng thái capability và fallback khi chưa hỗ trợ; không buộc xây visual compiler trước mẫu cơ bản. Sau khi lõi chạy ổn, nếu cần vật độc bản/hình học nâng cao thì làm prototype riêng và duyệt mẫu trước nhân rộng.

Chỉ khi capability được triển khai, kiểm thử và bật trong prompt mới nhận visual từ Gemini. Khi chưa bật: field lạ không được thực thi, giữ tên/mô tả và fallback riêng vật; không làm hỏng toàn payload. Các quy tắc kỹ thuật cho phần mở rộng:

- Dữ liệu shape/path có cấu trúc; không nhận raw SVG chứa mã tùy ý ở bản đầu.
- Các shape hỗ trợ theo allowlist: group, rect/roundRect, circle, ellipse, polygon, line, polyline, path.
- Tọa độ là local của vật, gợi ý miền 0..100; có thể dùng viewBox khác khi cần giữ tỷ lệ. Không phải pixel/toàn cảnh map do Gemini tính.
- Hỗ trợ role, material, rotation, mount floor/wall/surface, anchor và footprint tương đối.
- Hiệu ứng floating/glowing/broken/burned/rune-ring chỉ khi cần và nhẹ. Giữ `fill:none`, không tự tô kín hoặc bóp méo artwork.
- Kiểm số hữu hạn, độ dài path/số phần tử theo ngân sách render; cấm script, on*, foreignObject, image, href/URL ngoài và CSS tùy ý. DOMParser không thay sanitizer.
- Khi capability nâng cao được bật, visual sai fallback riêng instance; thông tin debug không tràn vào Inspector như một sự kiện RP.

---

## 9. Outdoor

Một renderer Outdoor hỗ trợ cảnh đơn và nhiều khu liên quan:

**Nền → đường/nước → công trình/cảnh quan → markers/POI.**

Hỗ trợ cỏ/đất/đá/cát, hồ/sông/bờ nước, nhà/tháp/cầu/cổng/tường, cây/bụi/đá/hàng rào và gợi ý architecture ngữ nghĩa. Visual/hình học tùy ý chỉ thuộc capability X, không là yêu cầu của Outdoor cốt lõi.

Không dựng Outdoor thành phòng Indoor giả. Cảnh đơn không bắt buộc có đường. Path + Nodes chỉ dùng khi cảnh thực sự có đường/cụm; đường minh họa không tự trở thành kết nối canon.

Nội thất mới của một công trình dùng detail view phù hợp; không dựng toàn bộ nội thất chồng lên overview. Công trình chưa có art dùng kiến trúc cơ bản/silhouette đúng công năng và giữ metadata.

---

## 10. NPC, ribbon, footsteps và X-Ray

### 10.1. Vị trí và vùng cấm

- Indoor: theo sàn phòng/hành lang/threshold của địa điểm thật.
- Outdoor/Fixed: bounds map, vùng cấm và hình công trình/nước đã kiểm trên artwork.
- Ngoài vùng cấm là nền trong phạm vi map. Không đẩy actor/tag ra ngoài bounds hoặc đổi địa điểm RP để tìm chỗ vẽ.
- Tách ba khái niệm: vùng đặt actor/chân, vùng anchor nhãn và vùng che lấp. Mái/nước không được dùng làm điểm đứng/anchor tự do; actor xác nhận inside có anchor trên công trình và ẩn chân. Ribbon từ anchor hợp lệ có thể chồng lên hình công trình phía trước do phép chiếu hoặc chiều rộng nhãn; trường hợp này được xét X-Ray, không đẩy chân/actor đi để né.
- Vị trí nhãn khác vị trí chân. Có thể dịch nhãn/đường chỉ để dễ đọc mà không dịch actor. Không có điểm đứng nhưng có anchor địa điểm đã biết: giữ nhãn thông tin phù hợp, ẩn chân và ghi diagnostic. Không có cả anchor đủ căn cứ: giữ actor trong Inspector với trạng thái vị trí chưa xác định, không bỏ actor hoặc đặt giả lên map. Không đặt nhãn lên vùng cấm tùy tiện để chữa thiếu dữ liệu.

### 10.2. Footsteps

- Đã đảo đúng chân trái/phải, burgundy sáng hơn nhẹ và glow đỏ tiết chế.
- `walk`: sáu nhịp luân phiên, `stepMs=550`, `hideMs=2000`; không giữ dư ảnh ngoài mẫu đã duyệt.
- `idle`: hai dấu ở vị trí cố định, đổi độ đậm nhẹ; không dịch chuyển.
- `hidden`: không vẽ chân. Inside, ngồi/nằm/núp, bơi/lặn hoặc nền không hợp lệ phải xử lý tương ứng, không vẽ chân đi bộ trên nước.
- Kiểm toàn dấu chân/footprint và giao cạnh cần thiết. Bước sai thì ẩn, không tìm đường vòng. Thảm/trang trí nhỏ không mặc định là blocker.
- Reduced-motion dùng trạng thái tĩnh phù hợp; không chạy chuyển động để vượt cài đặt thiết bị.

### 10.3. X-Ray

Chỉ kích hoạt khi nhóm công trình thực sự che NPC/tag/mask ở vị trí hiển thị. `inside` không tự kích X-Ray.

- Đúng nhóm che lấp giảm opacity còn `0.3`; ribbon vẫn rõ và sáng nhẹ. Hết che, bỏ actor hoặc đổi map phải phục hồi trạng thái gốc.
- Bbox chỉ lọc candidate. Quyết định che lấp phải xét cả thứ tự layer/depth thực tế và footprint/vùng che đã kiểm: công trình phía sau actor không bị mờ chỉ vì hình chiếu chồng nhau. Không dùng toàn bbox trong suốt của cây/cảnh nền làm bằng chứng che.
- Ưu tiên vùng che/footprint có sẵn hoặc geometry đơn giản đã kiểm. Raster mask cache là lựa chọn tối ưu hóa có điều kiện, không yêu cầu bắt buộc: chỉ dùng nếu nguồn SVG, cùng origin/tài nguyên nhúng, browser đích và chi phí được kiểm chứng; xử lý lỗi đọc canvas bằng phương án footprint/fallback, không làm trắng cảnh. Canvas không mặc nhiên bị tainted, cũng không mặc nhiên an toàn với mọi tài nguyên. Chọn độ phân giải/cache theo đo đạc và ghi giới hạn phương pháp.
- Giữ layer công trình và marker theo cơ chế đã duyệt, không làm mờ cả map hoặc nhân đôi artwork để giả hiệu ứng.
- Desktop/mobile có hành vi nhất quán; hover/click không tự tạo trạng thái RP.

---

## 11. Tương tác và Inspector

Tương tác cho actor, địa điểm, cửa/cầu thang, công trình và POI RP đã biết. Đồ nhỏ không có click riêng, dùng pointer-events:none khi phù hợp. Click chỉ chọn và mở thông tin.

Hover/focus/chọn làm sáng nhẹ theo cùng bộ effect; hỗ trợ chuột, touch và bàn phím. Icon Event/Quest là kính lúp, Hidden là dấu hỏi; bảng màu nổi trên nền nhưng cùng tone. Pulse nhẹ khi hover/chọn, reduced-motion dùng sáng tĩnh.

| Mục Inspector cố định | Nguồn dữ liệu và giới hạn |
|---|---|
| VỊ TRÍ | meta.areaName, pcPlace/pcSpot hoặc địa điểm đang chọn, tên và mô tả từ Atlas/places |
| NGHE HÓNG | Phần nội dung RP đã được phép nghe trong description/activity/detail; không tự suy một hành động thành âm thanh có thể nghe |
| QUAN SÁT | description và observation đã được phép biết; không bổ sung thông tin ẩn từ catalog |
| AI ĐÓ | Actors thuộc địa điểm, tên/loại, activity/observation có cơ sở; không tạo người để lấp mục |
| HÓNG HỚT TÁM PHƯƠNG | Events/đầu mối được biết, title/detail/target; không có thì hiển thị trạng thái trống phù hợp |

Khi hiện thực contract, khóa rõ cách dữ liệu có sẵn cấp từng mục; nếu thật sự cần field âm thanh riêng thì đề xuất trước, không âm thầm mở thêm schema. Không dùng cùng một câu để tự lấp mọi mục Inspector.

---

## 12. Module và tài liệu

Cấu trúc mục tiêu gọn cho Map 2; đối chiếu source mới trước khi đổi đường dẫn:

```text
assets/atlas.json
assets/templates/
assets/elements/
ui/shell.mjs
ui/shell.css
ui/tokens.json
src/contract.mjs
src/resolver.mjs
src/build.mjs
src/draw.mjs
src/markers.mjs
src/index.mjs
tools/bundle.mjs
dist/templates-pack.js
dist/bundle.js
dist/shell.css
examples/
tests/
README.md
docs/ATLAS_W4.md
docs/MAP_PROMPT.md
```

| Module | Trách nhiệm |
|---|---|
| contract | Normalize mềm, field tùy chọn, validation/alias tại một điểm |
| resolver | Scope, owner/alias, đủ cluster, Fixed/Atlas/Custom, structural overrides |
| build | Geometry Indoor/Outdoor, sàn/tường/cửa, footprint và vùng hợp lệ |
| draw | Asset/recipe/custom visual, vật liệu, scale/mount, placement và SVG |
| markers | Chân/ribbon, POI, che lấp/X-Ray, vòng đời marker |
| index | Entry, khởi tạo một lần, điều phối và xử lý lỗi |
| shell | UI, camera, Inspector, accessibility và chế độ review |

Giữ mã tốt có sẵn bằng cách ánh xạ trách nhiệm, không bắt đổi tên file chỉ để đẹp cây thư mục. Nếu cần đổi interface/module, ghi phương án và dependency trước khi code. Không sinh thêm manifest/manager khi catalog hiện có đủ dùng.

README giữ hướng dẫn chạy/build, quyết định đã duyệt, progress, baseline và hạn chế. ATLAS_W4 giữ diễn giải Atlas; MAP_PROMPT chỉ hướng dẫn `/map`. Nếu đưa master plan vào repo thì tích hợp vào README thay vì giữ nhiều bản kế hoạch cạnh tranh. Test fixtures/report là dữ liệu QA, không được tải vào bản runtime thật.

---

## 13. Bundle, loader và tối ưu

### Entry chính thức

Dùng `window.MAP_DATA` làm entry chính. Nếu cần nhận JSON script, một adapter nhỏ parse rồi chuyển vào cùng normalizer/entry; không tạo lần khởi tạo thứ hai.

Loader gồm root container, MAP_DATA thực, CSS, templates pack trước engine bundle. Mọi URL cùng SHA thật đã build. Không dùng placeholder null, nhánh chuyển động hoặc đường dẫn tưởng tượng làm release.

Payload JSON hỏng/cắt cụt phải được phát hiện trước normalize. Loader cần giữ phần khởi tạo/lỗi tách khỏi dữ liệu RP: có thể dùng JSON script làm transport, parse trong try/catch rồi gán window.MAP_DATA vào entry duy nhất. Không dùng eval, không tự thêm ngoặc hoặc đoán phần JSON thiếu để tạo sự thật RP. Khi parse thất bại, báo dữ liệu chưa đầy đủ và giữ UI/lỗi có ích nếu shell đã tải; không hứa dựng đủ map. P2 khóa một mẫu loader chính thức và test payload hỏng, không để mỗi phiên dùng một kiểu nhúng.

JSON thuần khác JavaScript object literal. Khi nhúng HTML phải serialize và escape `<`/chuỗi có thể đóng script trước lúc browser parse; không chèn trực tiếp nội dung RP vào innerHTML.

### Đóng gói

- Mặc định pack sẵn 13 Fixed và asset phổ biến; không fetch từng SVG nội thất hoặc gọi GitHub API mỗi lượt `/map`.
- Chỉ tách pack tải bổ sung sau khi đo được lợi ích về bytes/request/cache và có fallback; không tự đổi sang tải lẻ.
- Shared defs/symbols, namespace ID, viewBox và kích thước hữu dụng được kiểm trước/sau tối ưu. Đo bytes thực, không hứa file sẽ nhỏ theo một tỷ lệ cố định.
- Source, dist và bản review có vai trò rõ; không giữ original/v2/final/patch chồng nhau. Source và bundle sinh tự động không bị coi là hai engine riêng.
- Gộp sửa đổi vào bản chính. Chỉ xóa code thay thế khi đã kiểm đủ dependency Fixed/generated; không xóa lịch sử Git hoặc force-push để giả repo sạch.

### Ngân sách và vòng đời tài nguyên

P1 đo baseline; trước nhân rộng phải chốt cấu hình giới hạn payload, số SVG node/path point, thời gian dựng một lượt và bộ nhớ/cache trên thiết bị thử. Không ấn định số đẹp thiếu đo đạc, không dùng một quota NPC/phòng thấp để cắt RP.

Cache mask/asset phải có giới hạn dung lượng, khóa theo asset/geometry/version và cleanup khi đổi scene; không raster lại mỗi pointermove hoặc giữ vô hạn. Hủy tác vụ scene cũ, giải phóng bitmap/object URL, listener và timer. Ưu tiên giảm decor mặc định, hiệu ứng, độ chi tiết hoặc dựng trì hoãn; vẫn giữ tên/nội dung và đại diện của phòng/vật/actor RP quan trọng. Scene không thể hiển thị đủ chi tiết thì ghi rõ giới hạn, không báo đủ hình giả.

### Preview và lỗi tải

Ưu tiên Preview trực tiếp. Không thêm iframe/loader thứ hai nếu đường hiện tại chạy ổn. Nếu môi trường chặn script/CDN, ghi lỗi thật, thử phương án được duyệt; không âm thầm đổi môi trường nghiệm thu.

Script lõi không tải được thì không thể hứa dựng SVG đầy đủ. Hiện lỗi có ích và fallback văn bản/Inspector chỉ khi các thành phần cần thiết đã có. Không báo thành công giả.

Bắt buộc test trong Google AI Studio Playground/Preview đúng nơi dùng RP. Browser local hoặc Build mode không thay thế nghiệm thu này.

---

## 14. Kế hoạch triển khai cốt lõi

Mỗi bước có source/commit, đầu ra cụ thể, PASS/FAIL và phần chưa xác minh. Không đặt visual grammar nâng cao làm dependency của toàn bộ bản đồ.

| Bước | Phần cần làm | Đầu ra / điều kiện chuyển bước |
|---|---|---|
| **P0** | Nhận source mới, kiểm kê và baseline Map 2 | Hash/nguồn/license, danh sách giữ–sửa–thiếu |
| **P1** | Shell, loader, payload tối thiểu và SVG | Chạy Preview đích; đo baseline tải/render, ghi lỗi chặn |
| **P2** | Contract gọn, entry, Inspector và quy tắc normalize | Khóa spot/zone, merge, tham chiếu, target và điểm mở rộng; fixtures hợp lệ/sai/mâu thuẫn |
| **P3** | Atlas/resolver, ưu tiên Fixed | Đủ cluster, owner/alias, PC, Custom/AU và thay đổi cấu trúc đúng scope |
| **P4** | Horizontal + Potions + Office + Storage | Nội thất có cửa/lối đi, fallback vật lạ không visual, markers/Inspector; **duyệt thẩm mỹ** |
| **P5** | Hoàn thiện Indoor và nội thất | Phòng đơn, 10 preset, merge/replace, chống trùng, tỷ lệ và safe floor; không bắt polygon tự do |
| **P6** | Outdoor cốt lõi | Cảnh đơn/nhiều khu; đường/nước/công trình và vùng hợp lệ, không bịa canon |
| **P7** | Đồng bộ 13 Fixed và UI/markers | Motion, palette, icon, footsteps, vùng cấm, layer/X-Ray và review selector đạt |
| **P8** | Bundle và MAP_PROMPT | Một entry, SHA thật thống nhất, prompt ngắn không yêu cầu grammar hình học |
| **P9** | QA tổng, tối ưu và bàn giao lõi | Preview đích, desktop/mobile, báo cáo bytes/request/thời gian/bộ nhớ, trạng thái duyệt rõ |
| **X — tùy chọn sau lõi** | Prototype visual và hình học nâng cao | Grammar/allowlist, mẫu độc bản, kiểm tải và an toàn; duyệt trước khi bật capability |

Luồng chính: **P0 → P1 → P2/P3 → P4 duyệt → P5/P6 → P7/P8 → P9**. Bước X không chặn P5–P9. P2/P3 chỉ chuẩn bị song song khi interface rõ. Kiểm kê và smoke-test Fixed làm sớm từ P0/P1; P7 là đồng bộ cuối.

**Mẫu P4:** Horizontal + Potions + Office + Storage; bổ sung cảnh lớp học nếu source có cụm tương ứng. Kiểm phòng nhỏ/vừa/lớn, đồ sát tường và đồ trên bàn, cửa thoáng, không chồng/sai tỷ lệ. Một vật lạ không visual vẫn có tên/hình đại diện hữu ích. Không mở rộng chín preset còn lại trước duyệt mẫu này.

**Mẫu X:** Chỉ khi triển khai mở rộng, thử phòng bát giác và bàn tế lục giác nổi/sáu cột, malformed path, asset thiếu, scale/mount. Chốt grammar trước dựng mẫu, không xây toàn bộ hệ rồi mới duyệt. Nếu không hỗ trợ đúng hình phòng thì không dùng vòng trang trí trên sàn chữ nhật làm bằng chứng đã dựng được phòng bát giác.

**Fixed/UI:** Dùng đúng source bản đã duyệt thì chỉ kiểm tích hợp. Sửa mới ảnh hưởng hình ảnh phải có ảnh duyệt riêng. Nếu source mới có phần đạt yêu cầu thì xác minh, không làm lại như mới.

---

## 15. Kiểm thử và tiêu chí hoàn thành

### Dữ liệu và resolver

- Một contract và entry; input thiếu/loại lạ/malformed visual không làm trắng cảnh.
- Atlas Blend đủ cluster + phòng RP; alias/routing không tạo bản sao; không sửa Atlas nguồn từ phiên RP.
- PC đúng phòng/corridor/threshold/outdoor; pcPlace ưu tiên; không fallback thành vị trí RP giả.
- Không NPC/events vẫn render; không có nội dung bí mật PC chưa biết trong JSON/DOM.
- Fixed intact/modified_props/structural_change và custom chọn đúng; overlay chỉ ở anchor hợp lệ.

### Geometry và nội thất

- Nghiệm thu lõi: phòng đơn, 10 preset và Outdoor cơ bản đều có mẫu thực tế. Polygon/curve tùy ý chỉ là tiêu chí khi capability X được triển khai; không báo lõi hỗ trợ nếu chưa có.
- Cửa nằm đúng ranh giới; không mất sàn vì trừ sai chiều cao mặt đứng.
- Đồ đúng công năng, giữ tỷ lệ; không xuyên tường/chặn cửa/chồng nhau sai. Đồ trên bàn là surface child, không blocker sàn riêng.
- Recipe không thêm trùng props; merge/replace và phòng trống đúng. Phòng lớn tăng cụm, không kéo méo.
- Vật required không bị mất; thiếu asset/visual có đại diện đúng tên/chức năng; lỗi chỉ fallback instance.

### Fixed, marker và UI

- Đủ 13 Fixed, referenced defs/IDs, shading và motion H1 được giữ.
- Vùng cấm/footprint được kiểm; tag/chân không đổi địa điểm hoặc ra ngoài map.
- Ribbon dịch không kéo chân; walk/idle/hidden và reduced-motion đúng; inside ẩn chân.
- X-Ray chỉ khi thật sự che; opacity 0.3 đúng nhóm, ribbon rõ; hết che/đổi map phục hồi. Kiểm cả inside không che và actor đứng ngoài nhưng bị che.
- Click/tap/keyboard, Inspector năm mục, icon và palette đúng; không biến click thành hành động RP.
- Bản review offline chuyển đủ 13 mẫu bằng nút chọn; UI runtime không mang lại các hàng điều khiển đã bỏ.

### Browser, đóng gói và bàn giao

- Desktop/mobile, zoom/pan, nhiều actor/POI, đổi scene nhiều lần và cleanup timer/layer.
- Đo payload, bytes bundle/pack, số request, thời gian tải và khả năng tương tác trên mẫu thực; ghi điều kiện đo.
- CDN 404/timeout, asset sai và khởi tạo lặp có xử lý rõ. Core script lỗi không báo render thành công.
- Tối thiểu 10 cảnh Generated gồm phòng/vật lạ, không có asset/visual, replace rỗng, thay đổi nhỏ/lớn, dữ liệu sai và cảnh đông nội dung. Khi mở X mới thêm malformed path/hình học nâng cao.
- Có log/ảnh từ Google AI Studio Preview đích. Chưa thử môi trường đích thì phải ghi chưa nghiệm thu tích hợp, không gắn PASS chung.
- Mã sạch, source chính thống nhất; build và URL ghim SHA thật; không còn phần thay thế không dùng hoặc hai renderer cạnh tranh.

### Ba trạng thái phải tách biệt

1. **Đã triển khai:** code/tài nguyên đã có trong commit cụ thể.
2. **Đạt kiểm thử kỹ thuật:** có ca test, log và giới hạn phương pháp.
3. **Được duyệt thẩm mỹ:** người dùng đã xem bản cụ thể và chấp nhận.

Chỉ gọi một phần hoàn tất khi đạt các trạng thái cần cho phần đó. Không đánh dấu nội thất đã duyệt chỉ vì render không lỗi.

---

## 16. Quy tắc làm việc, Git và lịch tự động

- Chỉ làm việc trên repo Map 2 và nhánh phù hợp phần việc. Đọc source thực trước sửa, kiểm HEAD trước push, tránh ghi đè phiên khác.
- Đặt tên task/commit có tiền tố nhất quán, ví dụ `M2-P04`, `M2-P08`; nhánh template/UI đã có được giữ theo phạm vi của nó, không dùng làm nhánh mặc định cho mọi phần.
- Không tự merge, release, đổi nhánh phát hành, force-push, xóa lịch sử hay sửa repo khác.
- Quyết định đã được duyệt trong tài liệu này không cần xin lại. Chỉ hỏi khi source phát sinh xung đột thật, thiếu đầu vào chặn việc hoặc cần thay đổi cơ chế/phạm vi.
- Sau mỗi phần báo: hoàn thành/chưa hoàn thành, file sửa/tạo, interface đổi nếu có, test PASS/FAIL, ảnh/HTML, điểm chưa xác minh, branch/commit và phần có thể tiếp tục.
- Nếu dùng lịch theo giờ: chỉ tiếp tục từ progress trong README; kiểm phiên đang chạy, không làm lại task xong, không coi một lượt hẹn giờ là cam kết đã hoàn tất. Tắt lịch khi hết phần được giao; nếu bị chặn thì báo lý do thật.

**Điểm bắt đầu khi được cấp source:** P0 kiểm kê/baseline → P1 chứng minh loader/Preview → khóa contract/resolver cần cho mẫu. Chưa cấp source mới thì không bắt đầu sửa GitHub hoặc tự lấy một bộ source cũ thay thế.
