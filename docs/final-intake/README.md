# Bước 1 — tiếp nhận source FINAL, 2026-11-14

Chỉ kiểm kê/baseline và mapping; không tích hợp runtime, sửa artwork/layout, cài thư viện hoặc áp chỉ thị trong HTML. Bộ FINAL người dùng cung cấp thay đầu vào cho kế hoạch tự redesign cũ. Hai HTML được lưu nguyên byte trong assets/intake/final-2026-11-14; hash ở baseline.json. Chưa có file WZW_MAP_2_PROJECT_PLAN.md riêng trong checkout; plan nguyên văn được lưu ở README từ dòng PROJECT PLAN và được đối chiếu khi tiếp nhận.

## Kết quả

- Thư viện: 423 SVG; layout: 49 (41 Indoor + 8 Outdoor).
- Layout data đầu vào có 136 asset; sau mã bổ sung/ghi đè có 235 asset hiệu lực. 26 ID hiệu lực không nằm trong thư viện 423, được liệt kê ở baseline.json; phải bảo toàn khi tích hợp.
- Scan 658 bản ghi (423 + 235): không phát hiện XML lỗi, ID asset trùng trong từng bộ, ID SVG nội bộ trùng, local href/url thiếu hoặc thiếu viewBox. ID nội bộ lặp giữa các SVG độc lập không tự là lỗi; lúc ghép chung DOM phải namespace.
- 221 nhóm hình học có nhiều bản ghi trên hai bộ: đây là nhóm ứng viên chia sẻ, **không phải 221 asset phải xóa**. Giữ bản khác màu/góc nhìn/design; bảng geometry-groups.csv không dùng tên làm khóa. Hash chuẩn hóa XML/path/ID; chưa chứng minh mọi cặp tương đương thị giác khi khác transform/cách chia path.
- Mapping 432 candidate cũ: 125 khớp hình học; 179 ID/alias khớp nhưng hình khác; 128 chưa khớp tự động. Đây là mapping candidate → FINAL, chưa phải migration toàn bộ binding runtime. Không tự xóa 128 hoặc chọn bản cũ thay FINAL.
- 65 bản ghi đầu vào layout khai báo collisionReady=false; 235 bản hiệu lực không khai báo trường này. Không coi metadata là chứng nhận va chạm; bước tích hợp phải đo placement thực/cửa/safe floor.
- Mở hai HTML bằng HTTP local: không pageerror; chụp desktop/mobile. Render mặc định đủ 49 layout, SVG parse và Image.decode PASS. Chưa kiểm toàn bộ tổ hợp size/variant/material/topology, chưa nghiệm thu va chạm hoặc thẩm mỹ 49 cảnh.
- Layout có sẵn chữ chú thích trên hình và giao diện thiết kế riêng: giữ nguyên source. Khi tích hợp runtime vẫn phải giữ quy tắc không dán tên phòng lên map, dùng Inspector; không thay shell đã duyệt bằng viewer.
- HTML layout mang thông báo license Culori/Paper.js (MIT); giữ nguyên notice. Điều này không tự chứng minh giấy phép artwork độc lập bên ngoài file người dùng cấp.

## Bảng bàn giao

baseline.json: byte/hash/đếm/26 ID layout-only. inventory.csv: từng SVG và hash hình/hình có màu. geometry-groups.csv: nhóm ứng viên dùng chung. old-to-new.csv: mapping cần xử lý. layouts.csv: danh sách 49 layout. layout-render.json: report render mặc định từ source. Screenshot: tests/intake-{assets,layouts}-{desktop,mobile}.png.

Chạy lại từ repo root: `node tools/intake-final.cjs`, `python tools/intake-final.py`, `node tools/intake-layout-check.cjs`. Browser dùng Chromium local hiện có. Lần thử file:// bị browser policy chặn; đã kiểm thành công qua HTTP local. Không coi local thay Google AI Studio Preview (chưa thử).

## Phần tiếp theo, chưa thực hiện

Bước 2: giải quyết mapping còn mở, trích source FINAL vào catalog/recipes chính; adapter metadata/placement qua một pipeline hiện có; bảo toàn 26 ID layout-only và notice; namespace khi ghép; thay reference rồi mới dọn asset cũ. Giữ layout/design người dùng, không tiếp tục tự redesign theo danh sách cũ. Chờ giao bước tiếp; automation tắt.
