> Đã được thay bằng STYLE_REDESIGN_V2.md. Không áp quy tắc bắt buộc mọi cụm phải front hoặc khay ellipse trong bản cũ dưới đây.

# Vẽ lại SVG cụm để bàn — chờ duyệt

Đã xóa 6 cụm top và 2 cụm cây mới khỏi candidate, xóa preview đặt thử và generator bị bác bỏ. Catalog còn 432 design nguồn. Runtime chưa thay.

GitHub đã kết nối và đã đọc ref nhánh thực; không cần cài thêm GitHub. Đã tìm plugin vector: Figma đang kết nối, có công cụ tạo vector minh họa editable; chọn công cụ này hỗ trợ prototype. Không cam kết plugin tự tạo đúng style hoặc tự xuất SVG sạch: phải so mẫu và kiểm vector sau xuất. Không dùng ảnh raster bọc trong SVG.

Nghiên cứu mẫu: góc nhìn front/xiên nhẹ, thấy mặt đứng đồ vật và mặt khay ellipse; không top-down. Nét nâu mảnh, bo tròn nhẹ; màu giấy/kem, gỗ nâu, xanh xám, đồng trầm; điểm sáng kính tiết chế. Cụm có phân tầng trước/sau, bố cục gọn bất đối xứng, tỷ lệ đồ rõ. Không dùng khay vuông mặt bằng thay cụm ellipse. Bộ nguồn canonical có 7 họ cluster C4; ảnh người dùng thấy 8 ô nguồn vì astronomy có hai biểu diễn path tương đương từng bị lặp. Khi làm phải đối chiếu cả 8 ô tham chiếu, không tự bịa mẫu thứ tám.

Danh sách cần thiết cho 41 công năng nội thất hiện tại:

| Ưu tiên | Cụm cần có | Layout dùng |
|---|---|---|
| 1 | Đọc–ghi: sách mở, giấy, mực, bút | Office, Study, Classroom, Library |
| 1 | Pha chế: chai, lọ, cân/đồ đong, sổ | Potions, Research |
| 1 | Hồ sơ: sách, cuộn giấy, hộp thư/tài liệu | Archive, Reception, Guardroom |
| 1 | Trà tiếp khách | Lounge, Meeting, Headmaster |
| 2 | Nghiên cứu phép, tiên tri, thiên văn | Phòng chuyên môn tương ứng |
| 2 | Nến/ánh sáng và đồ nghi lễ | Ceremony, Dining, Ballroom |
| 2 | Dụng cụ thủ công | Workshop, Utility |
| 2 | Mỹ thuật/bản đồ | Art Cartography |
| 2 | Chăm sóc/y tế | Hospital |
| 3 | Ăn uống, bếp và phục vụ | Kitchen, Dining, Public Counter |
| 3 | Cờ/trò chơi, âm nhạc | Games, Music |
| 3 | Đồ cá nhân, khăn/chai vệ sinh | Bedroom, Bathroom, Laundry |

Storage/Vault/Cell/Cloakroom/Passage không tự rải cụm lên sàn; chỉ dùng khi có mặt bàn phù hợp và RP cho phép. Các công năng đặc biệt còn lại dùng lại họ phù hợp, không bắt mỗi tên phòng có một prefab.

Plan sau duyệt: (1) chốt style sheet từ 8 ô nguồn và bảng màu/nét/tỷ lệ; (2) prototype 3 SVG front mới: đọc–ghi, pha chế, hồ sơ bằng vector, giữ ellipse và mặt đứng như mẫu; (3) xuất SVG thật, sửa path/defs/IDs, xem cạnh mẫu nguồn ở kích thước thật và thu nhỏ; (4) gửi HTML duyệt ba mẫu trước khi vẽ toàn bộ; (5) sau duyệt mới ghép vào các surface/layout với mount front phù hợp, giữ merge/replace và không nhân đôi đồ. Chưa tạo SVG thay thế ở lượt lên plan này. Không áp lại top-down hoặc tự bật lịch.
