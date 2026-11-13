# Một bảng màu — kế hoạch phủ màu asset

Quyết định mới: bỏ ba palette và seed chọn palette. Giữ một bảng vật liệu thống nhất theo màu nguồn: gỗ #B18D69, đá #D3C5A7, kim loại #BCA373, vải #975B58, kính/nước #88B3B6, cây #82966B; giữ biến thể đã có màu. Không tô lại Fixed, UI hoặc màu Nhà/actor.

## Kiểm kê thực hiện

498 catalog SVG parse thành công. 290 bản ghi có fill tường minh trên các shape; 208 cần kiểm kế thừa. Đây KHÔNG phải 208 asset chắc chắn chưa tô màu, cũng không phải chứng nhận 290 đã đủ màu. Bảng ASSET_COLOR_AUDIT.csv có từng ID và số shape. fill none có thể là nét/chi tiết chủ ý. Script tools/audit-colors.py tái lập bảng.

## Thứ tự triển khai

1. Resolve fill/stroke/style kế thừa từ ancestor, defs/use, gradient/pattern; render contact sheet 208 ứng viên. Rà cả 290 còn lại để phát hiện thiếu màu theo bộ phận.
2. Ghi quyết định từng ID: KEEP / FILL_MATERIAL / INTENTIONAL_LINE / NEED_REVIEW, bộ phận và màu cần thêm. Không tô dựa trên thiếu thuộc tính đơn thuần.
3. Tô trực tiếp source catalog/compiler chính theo data-material/materialSlots; đồng bộ recipes/art/runtime bằng build. Không ghi đè màu source đã chốt, không phủ màu toàn silhouette làm mất chi tiết.
4. Kiểm SVG/refs/instance, before-after và layout thật; giữ đủ 498 ID, RP và 13 Fixed nguyên hash. Bàn giao hình và số liệu.

## Icon mới

! dùng activity-binoculars.svg; ? dùng clue-search.svg. Mẫu examples/event-icon-review.html. Source sidebar hiện có nhóm người/cuộn giấy; icon mới theo chỉ định user, không tuyên bố sao chép từ sidebar. Chưa áp runtime hoặc tự coi hình mới đã duyệt.
