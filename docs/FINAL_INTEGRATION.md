# Bước 2 — tích hợp catalog/recipe FINAL

Đầu vào: hai HTML người dùng cấp, nguyên byte ở assets/intake/final-2026-11-14. Đã kiểm HEAD e676a3d trước ghi; không có thay đổi checkout khác. Chỉ làm bước 2 và dependency kiểm tích hợp. Không tự redesign artwork hoặc thay shell Fixed.

## Source chính và ưu tiên

`node tools/import-p4.cjs` giờ biên dịch source FINAL; không đọc viewer interiors cũ. Xuất assets/catalog.json (450 ID), assets/recipes.json (49 recipe), assets/p4-art.json (artwork/bounds/scene data nguồn). Tên p4-art là đường dẫn cũ được giữ để không tạo contract cạnh tranh, không còn giới hạn 4 recipe.

Catalog gồm toàn bộ 423 ID thư viện + 26 ID riêng của layout + layout.picnic-mat trích từ chính SVG Outdoor, không vẽ mới. ID chung giữa thư viện/layout dùng SVG layout để khớp bố cục, giữ metadata thư viện nếu layout không có. Các alias wm.* và ID ngắn cùng hình được giữ vì source tham chiếu chúng; không coi mỗi alias là một physical object. Geometry-bbox đo bằng Chromium, collisionReady=false; không dùng bbox làm chứng nhận safe floor/X-Ray.

Build chỉ tiêu thụ catalog/recipe/art đã biên dịch; viewer reference và mã thiết kế không chạy trong runtime. Outdoor dùng asset FINAL, không còn overlay catalog H1 cũ ghi đè FINAL. SCENERY tham chiếu catalog, không nhúng thêm bản sao SVG. Full Outdoor sceneSvg giữ ở dữ liệu source, chưa bundle scene mẫu thành RP mặc định. Notice Culori/Paper.js giữ nguyên ở assets/FINAL_NOTICES.txt và HTML nguồn.

`python tools/asset-review.py` sinh examples/asset-review.html từ catalog chính 450 ID; examples/asset-review-data.json 432 design cũ chỉ còn là dữ liệu lịch sử cho bảng audit/migration, không được build/runtime hoặc catalog viewer mới dùng.

## Mapping và tính toàn vẹn RP

Bảng design-migration.csv xử lý 432 candidate cũ: 125 khớp geometry chỉ là ứng viên alias, không gộp instance; 179 ID/alias khớp nhưng hình đổi dùng FINAL thay hình cũ; 128 chưa khớp không nhập lại design cũ vào thư viện mới. Payload RP không tìm được hình vẫn giữ tên/nội dung/đại diện.

ID instance dùng `RECIPE:final:N`. Không tái dùng ordinal cũ như OFFICE:5 cho một món khác sau thay layout. instance-migration.csv ghi ứng viên cùng item để rà soát, không tự khẳng định đó là cùng món vật lý. Legacy ID không còn xác định đi vào nhánh unresolved/informationOnly hiện có, giữ RP và chẩn đoán; không sửa ngầm sang đồ khác.

merge/replace/ensure/add vẫn dùng composeRoom cũ. Có asset phù hợp thì extras được vẽ bằng SVG catalog qua drawFurniture; đồ lạ vẫn fallback + Inspector. Chưa làm bộ layout thích nghi/phòng trống/va chạm toàn bộ ở P5. Cụm là một instance đồ họa; không tự đoán mọi món nằm trong cụm là inventory RP độc lập.

## Kiểm đã chạy và lỗi đã sửa

- Compiler từng đo nhầm symbol s0/s1 từ SVG viewer ban đầu: đã bỏ SVG đang mở trước đo từng layout. Kiểm getBBox/CTM và footprint thực trên 10 preset không còn mismatch.
- Test cũ yêu cầu đúng 41 recipe: cập nhật thành 41 Indoor + 8 Outdoor theo đầu vào mới, không bỏ kiểm inventory.
- X-Ray test ban đầu FAIL sau đổi scenery do bounds tạm 256×256: đo useful bounds SVG FINAL rồi chạy lại PASS 16 ca chức năng.
- `tests/final-integration.cjs`: 450 SVG parse/IDs/refs/Image.decode; giữ đủ 423 source IDs; 49 recipe/509 instance có asset; dựng 40 công năng phòng Indoor qua runtime, kiểm PASSAGE_PROPS inventory riêng nhưng vị trí hành lang còn ở bước 3; known/unknown RP props, replace rỗng và legacy-ID safety.
- `tests/repair-review.cjs`: 10 preset + 3 Outdoor desktop/mobile; IDs/refs/footprint/cửa/actors/5 Inspector.
- `tests/repair-functional.cjs`, `tests/ids-props.cjs`, `tests/vocabulary.cjs`, `tests/p2-p3.cjs`: kiểm composition, RP state, scope/Atlas, 41 từ công năng, Generated X-Ray và cleanup trong ca có sẵn.
- Pack 13 Fixed, shell CSS, Atlas và template-review.html giữ nguyên byte so với bước 1. Không coi đây là nghiệm thu lại toàn bộ 13 Fixed/depth.

Đã xem ảnh Office runtime và bộ ảnh kiểm; chưa tự đánh dấu duyệt thẩm mỹ. Office trong khung corridor có khoảng trống/phân bố còn cần P5 thích nghi kích thước; các bố cục đặc biệt chưa giữ hình phòng nguồn như ba gian tròn. Bước 2 bảo toàn dữ liệu/artwork, không khẳng định 49 layout đã có hình học runtime giống viewer.

## Còn lại và bàn giao

PASSAGE_PROPS đã vào recipe nhưng chưa đặt cụm vào corridor (runtime hiện giữ decor hành lang cũ). Tám Outdoor đã trích 62 instance và toàn scene SVG nhưng chưa áp layout nguồn làm scene RP; hiện renderer Outdoor dùng catalog mới với cơ chế bố trí cũ. Đây là việc bước 3/4, không báo hoàn tất P5/P6.

Bundle hiện lớn hơn trước do toàn bộ catalog/layout artwork; đo bytes/gzip ở docs/build-metrics.json. Chưa tối ưu sâu hoặc đánh đổi mất hình. Loader CDN vẫn pin commit trước (392a468), chưa đồng bộ bản này cho AI Studio: thuộc P8, không dùng prompt cũ để kiểm bản mới. HTML offline chứa build mới. AI Studio Preview chưa thử.

HTML: examples/asset-review.html (catalog FINAL) và examples/p4-review.html (runtime chung + fixtures RP). Ảnh Office: tests/final-office-{desktop,mobile}.png; ảnh 13 fixture: tests/repair-*.png. Fixture chỉ thuộc review. Nguồn FINAL nguyên bản và 49 layout xem tại assets/intake/final-2026-11-14/.

Trạng thái: dữ liệu/tích hợp bước 2 đã triển khai; QA kỹ thuật giới hạn theo log; duyệt hình runtime còn chờ. Không mở automation, không merge main/release. Bước tiếp là P5 thích nghi layout/geometry, hành lang và placement; P6 Outdoor theo plan đã lập.
