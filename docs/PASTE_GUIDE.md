# Copy/paste — bản gọn

1. Thay toàn bộ **R14.6** cũ, từ tiêu đề `/MAP` đến hết `END R14.6 /MAP.`, bằng toàn bộ **MAP_PROMPT.md**.
2. Thay toàn bộ **W4.1**, từ tiêu đề W4.1 đến ngay trước W4.2 đầu tiên, bằng toàn bộ **W4_1.md**. Không dán ATLAS_W4.md dài vào system prompt nữa.
3. Nếu chưa gộp các mục W4.2/W4.3 lặp: thay từ W4.2 đầu tiên đến trước W5 bằng **W4_TAIL.md**; chỉ giữ một tiêu đề W4.

Giữ nguyên R14.7 /INVENTORY, R14.8 /TASK và các phần RP khác. Loader cũ/iframe/repo cũ phải được thay, không dán nối thêm. __MAP_DATA_JSON__ là chỗ Gemini điền JSON RP thật, escape `<` thành `\u003c`.

W4_1.md là bản định tuyến ngắn cùng nguồn với Atlas đầy đủ trong GitHub. Không dán 348 anchor, danh sách phòng nền, recipe instance hoặc catalog 363 element. R14.6 đã có từ công năng và loại NPC; runtime tự tra đúng recipe. Tên phòng mới được dùng tự do. P4 đang chờ duyệt hình ảnh; các layout chưa có geometry vẫn có sơ đồ fallback, chưa được coi là đã hoàn thiện. Google AI Studio Preview CHƯA THỬ.

Bản mới: W4.1 khoảng 4,7 KB, R14.6 khoảng 4,8 KB UTF-8. Atlas chi tiết 48,8 KB chỉ nằm ở GitHub. Loader sẽ được ghim cùng SHA của code/vocabulary đã kiểm; không thay riêng một URL.
