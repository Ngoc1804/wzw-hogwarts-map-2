# WZW Map 2 — trạng thái hiện tại

Nhánh duy nhất: `M2-P01-baseline-loader`. **System prompt chỉ dán [W4.1 gọn](docs/W4_1.md) + [R14.6](docs/MAP_PROMPT.md)** theo [hướng dẫn](docs/PASTE_GUIDE.md); không dán Atlas chi tiết vào Gemini nữa.

- Contract và từ công năng ngắn dùng một bảng `assets/vocabulary.json`: classroom → CLASSROOM, potions → POTIONS_LAB…; không bắt AI biết ID từng đồ vật/phòng artwork.
- Fixed/cụm/Custom, shop bindings và inventory merge đã có; [Atlas đầy đủ](docs/ATLAS_W4.md) vẫn là nguồn GitHub, index sinh tự động. W4.1 chỉ là bản định tuyến nén.
- **[P4 review offline](examples/p4-review.html)**: Horizontal + Potions/Office/Storage/Classroom, H36, cửa/hành lang/hốc nhẹ theo seed, vật lạ và Inspector; chuyển được P4 + 13 Fixed. **Chờ duyệt thẩm mỹ**, chưa nhân rộng chín layout còn lại.
- Recipe khác vẫn có inventory/fallback, chưa có QA geometry đầy đủ. P5/P6/P7 và nghiệm thu Google AI Studio Preview còn mở; không tuyên bố hoàn tất toàn dự án.

Build từ repo root: `python tools/atlas.py`, `python tools/build.py`, `python tools/review.py`. Sinh lại bản prompt gọn: `python tools/prompt.py` (giữ loader đã pin). Serve `python -m http.server 8790`. Kiểm: `node tests/vocabulary.cjs`, `node tests/compact-p4.cjs`, `node tests/ids-props.cjs`, `node tests/p2-p3.cjs`. [P4 QA và giới hạn](docs/P4_REVIEW.md).

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
