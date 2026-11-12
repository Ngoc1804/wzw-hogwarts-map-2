# P4 — mẫu chờ duyệt hình ảnh

HTML tự chứa: examples/p4-review.html. Desktop/mobile: tests/p4-desktop.png, tests/p4-mobile.png. Có bộ chọn P4 + đủ 13 Fixed dành riêng cho review. Dùng cùng contract, entry và renderer với runtime; không có viewer/renderer thứ hai. Dữ liệu mẫu nằm trong examples/p4-data.json, không tải vào lượt RP thật.

Mẫu: Horizontal + Potions + Office + Storage + Classroom. Source artwork được trích từ đúng pack interiors đã cấp; instance lấy ngoài defs/symbol và ngoài wrapper metadata lồng. Tường 36; đồ giữ tỷ lệ nguồn, không skew để ép tường. Các phòng giữ kích thước công năng nguồn, mở dải đặt đồ RP bổ sung; cửa nằm ở ranh giới phòng/hành lang. Hốc ngắn ở khe giữa phòng, tối đa hai, seed ổn định theo scope/phòng, không ăn mất sàn hoặc tự trở thành địa điểm RP.

Mẫu này có phòng nhỏ/vừa/lớn, đồ sát tường/đồ trên bàn từ recipe, một vật lạ có đại diện tên, actor inside không chân, event và Inspector. replace+[] đã kiểm không còn instance nội thất mà vẫn giữ sàn/tường/cửa. Dữ liệu/source recipe vẫn cần QA va chạm và surface rộng hơn trước nhân rộng, không gọi mẫu này là solver hoặc chứng minh mọi mô tả.

PASS kỹ thuật local: 4 phòng, 97 instance artwork, H36, không duplicate SVG ID/thiếu href, không request phụ ở HTML review, fallback vật lạ và replace rỗng. Chưa có duyệt thẩm mỹ. Chưa thử Google AI Studio Preview. Chỉ bốn recipe được vẽ bằng artwork ở bước này; recipe/layout khác tiếp tục fallback và chờ P5/P6 sau duyệt.

Build: python tools/build.py && python tools/review.py. Import lại artwork mẫu khi source thay đổi: node tools/import-p4.cjs (cần Playwright + Chromium; không gọi nguồn cũ). Công cụ chỉ trích graph từ source tham khảo; code renderer tham khảo không được tải trong runtime.

Vị trí đã kiểm: PC corridor nằm ở dải hành lang thật, threshold ở cửa phòng; thiếu anchor ở layout chưa có geometry thì giữ actor trong Inspector, không đặt giả trong phòng. Code không nhận tọa độ Gemini; scenePoint chỉ là dữ liệu nội bộ do geometry cung cấp. Bundle khởi tạo lặp giữ nguyên scene. Kiểm sâu footsteps/occlusion ngoài mẫu này vẫn thuộc P7.

Đã kiểm thêm click/Enter ở desktop, tap thật ở mobile, activity không tự trở thành overhear, và tag patrol không cần field onPatrol trong prompt. Fixed artwork pack giữ nguyên hash; chỉ adapter nhận điểm nội bộ và mapping Inspector được chỉnh để khớp contract. Bản prompt mới: W4.1 4.746 byte, R14.6 khoảng 4.842 byte (UTF-8, không phải số token Gemini).
