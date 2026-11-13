# Indoor / marker / Outdoor — chờ duyệt hình phần 1 và 2

Base 16818bf; thực hiện theo người dùng duyệt phần 1 và 2, không tự bật lịch. HTML duy nhất: examples/p4-review.html. Selector 10 Indoor + 3 Outdoor + 13 Fixed. Nội dung RP mô phỏng chỉ có trong fixtures review.

Đổi mới: không tên phòng/địa điểm Generated trên sàn; metadata/Inspector và thao tác còn nguyên. Sàn/tường chọn pattern nguồn theo công năng, architecture.floor/wall nhận giá trị whitelist khi RP nêu rõ. Decor hành lang ngang nguồn được bật; tường dọc có nến đứng, bỏ vị trí gần opening. Nội thất trong phòng giữ bố cục/tỷ lệ đã được người dùng đánh giá ổn, không kéo méo để lấp phòng.

Marker ? xanh mực và ! burgundy dùng keyline màu giấy + shadow nhẹ, không vòng tròn/nền tròn; giữ hit target 32×36. Mẫu riêng: tests/marker-review.png. Đây là phương án để người dùng duyệt, chưa coi đã duyệt.

Outdoor: bỏ renderer nhà/cây sơ sài, dùng catalog nguồn và hình nhà/quán/tháp/cây H1. tools/import-outdoor.cjs trích artwork từ đúng examples/template-review.html, bỏ hit region/metadata cũ và chữ, đo useful bounds, thu đủ referenced defs rồi khử ID lặp. Không đổi pack 13 Fixed. Một symbol/asset/scene, tham chiếu use cho nhiều instance. Nền giấy + các mảng địa hình mềm, bố trí cảnh quan; không tự vẽ đường nối canon. Ba cảnh kiểm: sân/nhà kho; bờ hồ/tháp; cụm nhà/cửa hàng/quán trọ/nhà kho.

Đã xem ảnh desktop, mobile và ảnh tổng hợp. PASS tests/repair-review.cjs (13 cảnh, thực H36, không vượt floor/chặn cửa trong fixtures, đủ actor, IDs/refs, keyboard/touch/zoom); tests/visual-refinement.cjs (13 kiểm tra style/source asset); tests/repair-functional.cjs (16 ca, gồm merge phụ trợ, empty/unknown, binding, pan và cơ chế X-Ray Generated). Log tests/*-qa.json. Việc kiểm toàn bộ 13 template/X-Ray theo ma trận bước 3 chưa được thực hiện lại ở mốc này, không dùng kết quả cũ làm nghiệm thu mới. AI Studio Preview chưa thử.

Ảnh: tests/repair-overview.png; tests/repair-*-mobile.png và repair-*.png; tests/marker-review.png. Screenshot được chụp từ cùng runtime, không phải mockup thay renderer. Cảnh sân được giảm 13.408 xuống 2.777 SVG node bằng symbol dùng chung. Bundle/CSS/pack bytes và gzip đo trong docs/build-metrics.json; không tuyên bố SLA cho mobile thật.

Giới hạn: vật lạ còn dùng đại diện + Inspector; 4 công năng có artwork nội thất P4; các công năng khác chưa hoàn thiện toàn P5. Outdoor là bộ mẫu cốt lõi để duyệt, chưa có renderer hình học tự do hoặc toàn bộ địa hình RP. Bố trí nhiều hơn bảy khu và safety floor phức tạp cần mẫu riêng; không báo hoàn tất P6/P7/P9. Chờ người dùng duyệt hình trước bước 3.
