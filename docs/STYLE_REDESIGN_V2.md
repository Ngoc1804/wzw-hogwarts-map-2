# Style V2 — kế hoạch redesign & giao diện, CHỜ DUYỆT

Đã đọc toàn bộ file plan người dùng cấp. Chỉ thực hiện yêu cầu rõ trong chat: tìm/đếm/gỡ nơ lỗi. Chưa triển khai các thay đổi thiết kế/cài thư viện chỉ được đề xuất trong file; không coi câu “chốt” trong tài liệu là phê duyệt mới.

## Style chính xác

- Phòng 2.5D: giữ tường, chân tường và phân lớp đã duyệt.
- Nội thất 2D phẳng, nét mảnh mềm, màu phân mảng vintage parchment. Top/front/nghiêng nhẹ tùy món; không ép mọi món 45°, isometric hoặc có mặt bên.
- Cụm trên bàn sắp tự nhiên, 1–2 món chính + 2–5 món phụ; không khay oval mặc định. Không áp lại các cụm mới bị bác bỏ.
- Tủ/kệ ưu tiên design chi tiết như new.bookcase, new.display-gothic, wizard.library-ladder, wizard.potions-cabinet. Nhà giữ hình 2.5D; nhà chính diện đơn giản là ứng viên thay, không gỡ reference trước khi có bản thay.
- Palette đề nghị: giấy/kem, gỗ nâu, mực #68503a, kính xanh xám, đồng trầm, lá xanh muted. Vạch nét theo phân cấp; kiểm ở kích thước nhỏ trên ảnh 10 hành lang + 3 Outdoor, không lấy histogram defs làm tiêu chuẩn thẩm mỹ tự động.

## Kiểm toàn bộ và số lượng

432 design candidate được scan SVG/path, không phải 432 asset runtime chính thức. Bảng riêng từng món ở STYLE_AUDIT.csv. Định danh nơ dựa vào hình học subpath, không dựa tên, màu vàng hoặc mọi nét cong.

- **32 design có 51 nơ**, đã gỡ. Một path có thể chứa nhiều nơ. Bảng BOW_AFFECTED_DESIGNS.csv ghi tên/ID/nhóm/số motif.
- 32 design phân nhóm: đồ dùng 12; tủ kệ phù thủy 5; bàn 3; tủ kệ thường 3; trang trí phù thủy 3; độc bản 3; lò sưởi 2; cụm trên bàn 1.
- Bản sao trong source catalog: 39 motif; source interiors: 15; P4 definitions: 3. Không cộng những số này thành design độc lập vì nhiều chỗ tái dùng hình.
- Không tìm thấy motif xác nhận này trong pack 13 Fixed hoặc Outdoor trích H1. Không xóa ribbon NPC/dấu chân, vì đó không phải motif lỗi.
- Quét mẫu nơ sau cleanup: 0 trong nguồn đã xử lý; 432 SVG còn parse/render được. Giữ ID và phần thân nét vẽ; không nhân tiện thay màu/hình học khác.

## Hàng đợi style đề nghị, chưa phải phán quyết tự động

| Quyết định đề xuất | Số design | Nhóm |
|---|---:|---|
| REWORK_PROPOSED | 31 | 7 cụm gốc, 12 bàn, 7 ghế, 5 nhóm phòng ngủ |
| FILTER_REPLACE_PROPOSED | 33 | 13 tủ thường, 14 nhà khối cơ bản, 6 nhà khung basic khác |
| PREFER_KEEP_REVIEW | 11 | Tủ phù thủy: ưu tiên bản chi tiết, kiểm trùng |
| FUNCTIONAL_SEPARATE | 57 | Cấu kiện/kiến trúc đặc biệt, material tường/sàn, cửa/cửa sổ |
| KEEP_REVIEW | 300 | Còn lại: giữ công năng, đối chiếu style khi đặt trên map |

Tổng 432. **64 design được đề xuất xét lại style** (31 + 33), không khẳng định cả 64 đều phải vứt bỏ. Hợp các design này với 32 món lỗi nơ là 89 design, do có giao nhau; không cộng 64 + 32. Có 16 bản ghi chưa khai báo view, phải bổ sung góc nhìn sau xem hình trước placement. Các số style là phân loại theo nhóm/plan V2; vẫn cần duyệt mắt từng món, không tự coi histogram/nhãn nhóm là lỗi thẩm mỹ đã chứng minh.

## Công cụ GitHub đã nghiên cứu — chưa cài

Đã kiểm metadata repo chính thức, đều chưa archived:

- https://github.com/svgdotjs/svg.js — chỉnh/tổ chức SVG trong preview; phải kiểm license/version cụ thể trước tích hợp (API license chưa khẳng định SPDX).
- https://github.com/svgdotjs/svg.draggable.js — kéo chỉnh layout thiết kế, MIT.
- https://github.com/svgdotjs/svg.draw.js — vẽ primitive/path, MIT; chỉ thêm nếu preview thật sự cần.
- https://github.com/elrumordelaluz/svgson — SVG↔JSON, MIT; tùy chọn vì parser hiện tại đã scan được.
- https://github.com/svg/svgo — tối ưu sau khi hình được duyệt, MIT; so ảnh/defs/IDs trước–sau.

Chọn tối thiểu SVG.js + SVGO cho build/preview; drag/draw chỉ khi cần. Không đưa thư viện thiết kế vào runtime /map hoặc dựng engine thứ hai. Chưa cài dependency ở lượt chờ duyệt này.

## Kế hoạch giao diện thiết kế

1. Tách Artwork / Materials / Architecture; không trộn cửa, pattern sàn vào nhóm đồ trang trí.
2. Filter KEEP / REWORK / REPLACE / REMOVE, nhóm phòng, nguồn, view và lỗi metadata; mọi quyết định có lý do và source ID.
3. Màn so trước–sau cạnh nhau: bật/tắt nền giấy/sàn, xem kích thước thật và thu nhỏ; đánh dấu motif đã gỡ. Không dùng bóng 3D để che hình sơ sài.
4. Preview bàn/phòng dùng cùng SVG production; chỗ đặt surface, kích thước, cửa và vùng hợp lệ hiển thị trong chế độ thiết kế, không đưa debug vào cảnh RP.
5. Export SVG sạch + mapping IDs + catalog HTML; chỉ gộp khi geometry/view/design thực sự trùng.

## Lộ trình đề nghị

A. Duyệt style sheet và bảng 432 món này.
B. Prototype 3 SVG theo V2: Nghiên cứu, Độc dược, Trà. Gửi ảnh ở kích thước nhỏ cạnh nguồn; không ép khay/góc nhìn đồng loạt.
C. Sau duyệt, làm D01–D16: Tiên tri, Nghiên cứu, Hiệu trưởng, Thiên văn, Sách, Trà, Chân nến, Độc dược, Thảo dược, Y tế, Hồ sơ, Bếp, Bàn ăn, Quầy hàng, Chế tác, Cá nhân. Bảy cụm gốc là REWORK, không dùng làm bản final.
D. Lọc tủ/nhà: thay asset và reference trước, rồi dọn bản không dùng; giữ 12 nhà gỗ/tường 2.5D và công năng độc bản.
E. Chỉnh layout phòng theo công năng; kiểm tỷ lệ, surface, cửa, merge/replace và RP props. Không đổi Atlas hoặc logic RP.
F. Kiểm 10 hành lang + 3 Outdoor, sau đó ma trận 13 Fixed/X-Ray và môi trường đích; SVG tối ưu sau duyệt, không lấy PASS local thay duyệt hình/AI Studio.

Mốc hiện tại chỉ gỡ nơ đã được chỉ định và lập kế hoạch. Chưa redesign, chưa thêm SVG, chưa cài tool, chưa triển khai giao diện mới; chờ duyệt.
