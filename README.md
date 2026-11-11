# WZW Map 2 — Nhánh 01: Template & UI cố định

Nhánh triển khai: `01-template-ui`. Mã task/commit: `TUI-01` đến `TUI-08`.
Chỉ sửa nhánh này; không merge main/phát hành. Repo cũ chỉ đọc.

## Nguồn và bản chính

- Nguồn người dùng: WIZAMAP_01_FIXED_TEMPLATES_UI_OFFLINE.html, 966.551 bytes.
- Bản chính hiện tại: `examples/template-review.html`. Đây là bản offline độc lập, mở trực tiếp hoặc qua HTTP; không cần CDN. Không lưu thêm bản original/patch/v2 trong repo.
- Dùng `?template=h1` (hoặc ID bên dưới) để kiểm từng mẫu, không đưa lại thanh chọn mẫu lên UI.
- H1 motion lấy từ `Ngoc1804/wzw-hogwarts-map`, file `elements/h1-motion.js`, blob `607d906affdc21c11f750d961e72ff9f824cbf4a`. Đã tích hợp trực tiếp, không giữ bản module trùng trong repo đích. Bảo toàn chú thích nguồn.
- 13 ID: h1, h2, hall, gryffindor-common, ravenclaw-common, hufflepuff-common, slytherin-common, village-static, pitch-static, express, diagon-knockturn, ministry2, ministry-8-10.
- File chứa dữ liệu SVG gzip/base64. Khi sửa artwork: giải nén JSON từ script `wzw-embedded-atlas`, sửa maps/vectors rồi nén lại bằng gzip mtime=0. Không chèn thêm patch runtime chồng lên artwork.
- Giữ referenced defs, IDs, viewBox, tỷ lệ, shading, các hiệu ứng đã duyệt. Không dùng renderer/adapter Demo 3; nguồn SVG kế thừa không đồng nghĩa nhập engine cũ.

## Yêu cầu đã duyệt và tiến độ

| Task | Yêu cầu | Tiến độ |
|---|---|---|
| TUI-01 | Kiểm kê 13 template/UI/palette/nguồn | Đã xác nhận 13 mẫu và tìm H1 motion; còn rà soát defs dư/trùng và ghi dung lượng cuối. Phép duyệt references hiện tại chưa loại được definition nào, chưa tuyên bố tối ưu xong. |
| TUI-02 | Đảo hai chân, glow đỏ nhẹ; walk/idle/hidden, inside ẩn chân | Đã đổi use trái/phải trong hàm feet và thêm glow. Chưa nối actor thật; cần fixture và ảnh kiểm riêng, không coi hoàn tất. |
| TUI-03 | Motion H1, cầu bỏ halo đỏ, đồng nền H2, shade xanh rêu blur | Đã nối 106 hook motion H1, cleanup khi đổi template, tôn trọng reduced-motion. Đã đồng fill nền H2 #f1e5ca và giảm bóng cầu, chuyển hs-shadow sang rêu. Halo cầu chưa kiểm cận cảnh; không khẳng định xử lý xong. Bóng phải blur hòa nền, không khối đặc. Còn kiểm shading/chiều khối cả H1/H2. |
| TUI-04 | Phòng quanh Đại Sảnh và sân trong | Chưa làm. Giữ element Đại Sảnh, được thêm decor; cải thiện bố cục/phòng xung quanh; nới sân trong và tái dùng đài phun H2 với namespace IDs an toàn. |
| TUI-05 | Decor bốn nhà chung, lò sưởi lớn hơn | Chưa làm. Giữ phong cách, không phá bố cục/giao diện. |
| TUI-06 | Click/Inspector, glow, icons, X-Ray | Đã sửa pointer capture chỉ khi kéo và tra places metadata khi click. Còn kiểm đủ hit-target từng mẫu, keyboard/mobile, cả trường hợp nested IDs. Glow hover/select bước đầu đã có. Icons và X-Ray chưa làm. |
| TUI-07 | Vùng cấm và nhóm từng công trình, hợp đồng ribbon/chân | Đã ghi hợp đồng bên dưới; chưa tạo vùng cấm/occluder theo artwork và chưa nối runtime actor. |
| TUI-08 | Việt hóa, bỏ hai hàng UI, tối ưu, QA | Đã bỏ cả hai nav và dialog kiểm palette/motion, giữ header thương hiệu, map/sidebar lấp đầy. Bỏ PC mẫu đặt tùy tiện theo tỷ lệ khung. Còn dọn CSS/code không dùng, tối ưu definitions mà không mất hình, research thuật ngữ Lý Lan có nguồn và Việt hóa đầy đủ, QA nghiệm thu cuối. |

Quest = Event: một loại kính lúp. Hidden: dấu hỏi. Không tạo loại thứ ba giả; palette icon chọn tông phù hợp nhưng nổi rõ trên nền, hover/chọn nhấp nháy nhẹ, reduced-motion dùng sáng tĩnh.

X-Ray chỉ khi công trình thực sự che NPC/tag/mask (overlap footprint/mask có căn cứ, không chỉ bbox trong suốt). Khi đó đúng nhóm công trình giảm opacity còn 0.3, tag giữ sáng/rõ; hết che phải phục hồi. NPC inside tự nó KHÔNG kích X-Ray. Tách từng nhà/công trình cho toàn bộ 13 template, giữ defs và animation. Công trình ưu tiên layer trước tag theo cơ chế che lấp, tránh hạ opacity cả map.

Vùng đặt NPC: mái/nước/vùng không hợp lệ là vùng cấm tag tự do; ngoài vùng cấm là mặt đất trong bounds map. Không bay ra ngoài map. NPC inside là ngoại lệ gắn tag lên công trình và tắt chân. Chân và ribbon độc lập; dịch nhãn không kéo chân. Kiểm toàn footprint sáu bước, bước sai ẩn; không pathfinding/solver. Cơ chế dùng lại ở map tự do trong phần renderer có dữ liệu hỗ trợ, không hứa mọi cảnh đúng.

## Ghi nhớ cho phiên MAP_DATA sau

Đây là interface đã duyệt cho phần template/UI; cần bổ sung vào contract và MAP_PROMPT khi xây MAP_DATA, không tự nhập schema runtime cũ.

- `actors[].tagType`: AI chọn key trong palette có sẵn: gryffindor, slytherin, ravenclaw, hufflepuff, beauxbatons, durmstrang, teacher, adult, patrol, animal, monster, ghost, unknown, crowd. Engine đối chiếu token trong HTML, không cho AI tự đặt hex.
- Giữ toàn bộ main/accent hiện có. PC dùng màu loại/nhà và viền vàng #D2A64D. Patrol chỉ khi onPatrol=true có căn cứ; không tự đổi người có vai trò giám thị thành đang tuần tra.
- `actors[].footstep`: walk | idle | hidden. AI chọn từ hành động RP thực tế, không tự bịa hành động. inside hoặc hoạt động ngồi/nằm/bơi/lặn tắt chân khi không phù hợp; thiếu dữ liệu dùng trạng thái trình bày bảo thủ.
- walk: sáu bước luân phiên, stepMs=550, hideMs=2000; idle: hai dấu cố định đổi độ đậm nhẹ, không dịch chuyển/dư ảnh; reduced-motion dùng tĩnh.
- Không đưa tọa độ/polygon/SVG vào payload Gemini. Runtime/template registry chịu trách nhiệm vị trí hợp lệ và occlusion.
- Inspector giữ đúng 5 mục: VỊ TRÍ, NGHE HÓNG, QUAN SÁT, AI ĐÓ, HÓNG HỚT TÁM PHƯƠNG. Không có actors/events vẫn hợp lệ. Nội dung địa điểm lấy metadata nguồn, không sáng tác RP.

## Kiểm thử đợt đầu

- Chromium desktop: H1 tải được, không lỗi JS, 106 hook motion, hai nav không còn. Chưa thay thế nghiệm thu thị giác từng hiệu ứng.
- PASS tải đủ 13 mẫu không lỗi JavaScript; PASS click thật vào lâu đài H1 hiển thị “Lâu đài Hogwarts”; PASS reduced-motion giữ motion clock tĩnh. Đã chụp desktop H1/H2 và mobile 390×844. Chưa kiểm từng hit-target/mobile tap và chưa nghiệm thu thị giác đầy đủ.
- Chưa nghiệm thu decor, icon, X-Ray, vùng cấm, Việt hóa hoặc Google AI Studio Preview.

## Tiếp tục theo giờ

Đã tạo lịch mỗi giờ trong thread gốc, tên **WZW 01 — Template UI**, múi giờ Asia/Ho_Chi_Minh. Mỗi lượt đọc README ở nhánh, tiếp tục task chưa xong, gộp trực tiếp vào bản chính và cập nhật PASS/FAIL trung thực. Kiểm head trước ghi để tránh đè phiên khác. Khi đủ task và nghiệm thu, tự tắt lịch; không tự merge.
