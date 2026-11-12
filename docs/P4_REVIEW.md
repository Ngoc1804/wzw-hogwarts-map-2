# M2-P04 — bản sửa và bộ mẫu chờ duyệt

Bản 10d2c37 bị người dùng bác bỏ. Bản sửa này dùng cùng một contract/entry/runtime cho HTML review và dist. Không tự đánh dấu duyệt hình. **Google AI Studio Preview chưa thử.**

## HTML và ảnh

- `examples/p4-review.html`: tự chứa CSS, pack, engine và 12 fixture; chọn đủ 13 Fixed bằng nút Xem mẫu.
- `examples/rp-review-data.json`: 10 preset `horizontal`, `vertical`, `windows`, `ell`, `tee`, `cross`, `court`, `cloister`, `curved`, `tower`; thêm 2 Outdoor sân/nhà kho và bờ hồ/tháp. Các fixture có PC/NPC, activity/observation, props, description/overhear và events; chỉ là dữ liệu QA.
- `tests/repair-overview.png`: contact sheet chụp bằng Chromium từ các screenshot, không dựng hình thay engine.
- `tests/repair-<case>.png`, `tests/repair-<case>-mobile.png`: ảnh 1700×1050 và 390×844.

## Lỗi đã xác định và sửa

| Lỗi | Thay đổi |
|---|---|
| basicMap thay hành lang bằng rect màu phẳng; source patterns/wall/door không được bundle | tools/build.py đưa đúng lõi build/draw/materials của assets/source/corridors.js vào bundle, bỏ editor UI/startup; src/build.js ghép geometry ấy thay basicMap |
| Trích object bằng outerHTML làm mất transform của ancestor; portrait/blackboard đo và vẽ khác chỗ | Compiler bảo toàn orientation nhóm cha, bỏ wall shear cho nội thất và đo lại local geometry; test so trực tiếp getBBox/CTM sau render |
| Kệ/tủ bị ép nhỏ theo chiều cao mặt đứng tường | Normalize theo useful artwork aspect ratio, scale đều; chừa dải đặt đồ có thật, không kéo méo để khớp tường |
| Nội thất chỉ chừa cửa nam, nhưng cửa thật có thể nằm bắc/tây/đông | Chừa clearance theo đúng opening/axis và ranh giới nguồn; kiểm toàn footprint |
| Vertical/T/Cross/L đều thành cùng grid | 10 preset đi qua source topology tương ứng; phòng đơn không buộc có hall |
| Tên có chữ sân phủ quyết type storage | Công năng khai báo ưu tiên tên, Outdoor không biến nhà kho thành vườn |
| Ribbon trùng anchor chồng chữ | Bố trí nhãn có đường chỉ; giữ nguyên point chân, không clustering/không sinh NPC |
| X-Ray chỉ kiểm mask, thiếu depth | Depth gate rồi kiểm alpha của đúng nhóm; clear/đổi scene phục hồi; inside không tự làm mờ |
| JSON hỏng/pack lỗi báo trạng thái ready quá rộng | JSON hỏng có trạng thái incomplete và thông báo; pack hỏng có text-fallback |

13 Fixed artwork pack, source corridors và shell.css giữ byte/hash. UI helper nhận thêm safeFloor, event chọn địa điểm duy nhất, depth và tách vị trí nhãn/chân; không thay palette/icon/footstep artwork hay nội thất đã duyệt. Source reference viewer không chạy trong runtime. Không tải từng SVG từ mạng.

## Kiểm thử

- `node tests/repair-review.cjs`: tự mở server ephemeral; đủ 12 cảnh, actual H36, source patterns, footprint khớp hình thực, không vượt sàn/chắn cửa trong fixtures, đúng số actor, defs/IDs, Enter, tap thật và zoom/fit; screenshot desktop/mobile.
- `MAP_BASE_URL=http://localhost:8790 node tests/repair-functional.cjs`: phòng đơn, replace rỗng, vật lạ, dữ liệu sai/ID trùng/PC mơ hồ, pcPlace, inside/unresolved, Fixed modified_props/structural_change, Outdoor type và X-Ray trước/sau/không chồng/cleanup.
- `tests/ids-props.cjs`, `tests/vocabulary.cjs`, `tests/p2-p3.cjs`, `tests/p1.cjs`, `tests/review-switch.cjs`, `tests/compact-p4.cjs`: inventory, 41 từ công năng, scope, lỗi transport, đổi đủ 25 scene và cleanup. Dùng MAP_BASE_URL khi server không ở 8790.
- `tests/template-ui.cjs`, `tests/interaction.cjs`: đủ 13 Fixed, 348 keyboard selections, mouse/touch 26 ca, X-Ray và footsteps/reduced motion. MAP_PREVIEW_URL trỏ examples/template-review.html.
- `tests/prompt-loader.cjs`: escape script transport, đồng SHA và text fallback trên exact local dist qua request interception; không phải nghiệm thu CDN thật.

Ảnh đã được xem ở contact sheet và các cảnh chi tiết Indoor/Outdoor/mobile. Khung 2.5D đã quay về source; nội thất giữ hướng thẳng, đồ trên bàn theo bố cục nguồn, không có lỗi vượt sàn/chắn cửa trong bộ kiểm cuối. Tỷ lệ tủ/kệ được sửa từ vùng hình hữu dụng. Tính đẹp, mật độ và lựa chọn silhouette Outdoor vẫn chờ người dùng duyệt; không có test tự động nào thay thế quyết định đó.

## Giới hạn

4 recipe có artwork: POTIONS_LAB, OFFICE, STORAGE, CLASSROOM. Các recipe khác còn inventory và đại diện tên, không coi hoàn tất toàn Indoor. State broken giữ một instance và thông tin trạng thái, chưa có toàn bộ artwork vỡ. Geometry nâng cao, safe floor bị sập và layout mô tả tự do chưa được chứng minh. Không nhận visual grammar X.

Outdoor là silhouette nền/sân/nước/công trình cơ bản, giữ props/Inspector, không nội thất chồng mái và không bịa đường nối. P6 đầy đủ còn mở. Fixed X-Ray có depth gate dùng base được đánh dấu ở Generated; với Fixed chưa có semantic depth thì dùng đáy artwork cùng alpha mask. Audit depth từng công trình/địa hình thuộc P7, chưa khẳng định chính xác mọi điểm trên 13 map.

Render cuối 12 fixture: 41–117 ms (median ~64 ms) trong renderInput, 42–3251 SVG node, Chromium Linux desktop; không gồm network, không phải SLA. Heap là số toàn page, không quy cho riêng engine. Pack/CSS/bundle bytes/gzip ở docs/build-metrics.json. Chưa đo tải trên điện thoại thật, Safari hoặc AI Studio Preview.

Lịch theo giờ tạm tắt khi bàn giao bộ mẫu để chờ duyệt; không tự chuyển sang nhân rộng hoặc phát hành.
