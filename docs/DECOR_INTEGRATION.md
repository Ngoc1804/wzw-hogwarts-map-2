# Decor layout đã chốt

Nguồn duy nhất: `examples/WIZAMAP_LAYOUTS.html`, thay trực tiếp bản cũ bằng file người dùng gửi `WIZAMAP_DECOR_49_LAYOUT_ALL_SIZES (1).html`. Bản nguồn giữ nguyên byte; hash và bảng 147 view nằm trong `DECOR_IMPORT.json`. Không còn dùng bản chuẩn bị decor cũ làm nguồn runtime.

## Khi dựng phòng

- 49 layout × S/M/L, gồm 41 Indoor và 8 Outdoor. `size` nhận S/M/L hoặc small/medium/large; bỏ trống dùng M.
- Kích thước được giữ đúng profile nguồn, kể cả khi ghép phòng theo 10 topology. Không kéo dãn/đổi chiều rộng–sâu để lấp đầy cạnh hành lang hoặc cắt phòng thành lối phụ.
- Phòng riêng dùng nguyên lớp sàn/tường và bố cục nội thất đã chốt, với H40. Phòng ghép giữ sàn, màu/texture tường và size nguồn; cửa/hành lang theo cấu trúc kết nối của cảnh.
- Màu từng món, đồ đã ẩn, bản sao, đồ thêm và thứ tự lớp được biên dịch từ trạng thái editor đã lưu theo size. Không tự áp thay đổi của size M sang S/L nếu file đã chốt không có thay đổi đó.
- Bổ sung 9 asset được bản decor sử dụng; 443 asset đã có giữ nguyên dữ liệu/hình/màu.
- Giữ bản Fixed mới nhất từ commit aae54f4: decor Sảnh và bốn Nhà đã được duyệt ở phiên khác. Lượt tích hợp 49 layout không sửa thêm artwork Fixed/H1.

## Nguồn và build

`tools/import-layout-sizes.cjs` đọc trạng thái DOM sau khi áp decor/màu trong HTML đã chốt, rồi sinh `assets/layout-sizes.json`, default M tại `assets/p4-art.json`, inventory theo size và `assets/layout-finishes.json`. Metadata ID gốc chỉ dùng giữ tham chiếu khi nhập lại; không giữ artwork layout cũ.

`python tools/rebuild.py` tự nhập lại nếu HTML, compiler hoặc dữ liệu biên dịch thay đổi, rồi build dist. Nếu nguồn không đổi, dùng bản biên dịch đã xác minh hash.

## Hai lỗi Outdoor đã sửa

1. Món đặt chung một mặt đỡ dùng các slot trống trong vùng mặt đỡ thật; không đặt hai ID khác nhau trùng tọa độ. Thiếu chỗ vẫn giữ số lượng trong Inspector.
2. Nhãn của người ở trong nhà trên ngoại cảnh xếp thành một cột dọc, giữ cùng anchor công trình, không đè chữ; PC riêng và nhóm NPC vẫn giữ đầy đủ nội dung. Stack đi theo zoom/pan và reflow khi đổi viewport.

Kiểm: `tests/approved-decor.cjs`, `tests/layout-sizes.cjs`, `tests/outdoor-overlap.cjs` và các bài hồi quy. Nghiệm thu AI Studio tiếp tục để sau theo quyết định người dùng.
