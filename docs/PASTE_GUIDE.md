# Handoff /map hiện hành

- Atlas fragment: [WZW_MAP2_ATLAS_GEMINI_MIN.md](WZW_MAP2_ATLAS_GEMINI_MIN.md).
- Contract: [MAP_DATA.md](MAP_DATA.md), schemaVersion 2.0.0.
- Hướng dẫn /map và HTML loader: [MAP_PROMPT.md](MAP_PROMPT.md).
- Ba URL CSS/pack/bundle cùng pin `f801effb597dee647caac9b60e59133f0db20db2`, chứa sửa zoom/footstep và có byte khớp dist hiện hành. Không dùng loader pin 392a468 nữa.
- Fixed canon: chỉ đặt tag đúng địa điểm trên artwork có sẵn; không yêu cầu dựng phòng/đồ vật mới.
- Prompt bắt buộc xác định PC, pcPlace và pcSpot trước khi xuất; không dùng browser để đoán vị trí.
- Dữ liệu JSON nhúng phải escape `<` thành `\u003c`; không sửa tay các URL thành SHA chưa tồn tại.

Đây là phần tích hợp /map, không thay toàn bộ system prompt RP riêng. Khi tích hợp, ghép Atlas và hướng dẫn /map vào một system instruction hiện hành, không đính kèm các HTML kiểm cũ đã xóa. Không dán master GitHub dài vào Gemini.

Live CDN và AI Studio Preview chỉ ghi PASS khi đã tải/kiểm thực tại đích. `prompt-provenance.json` là hồ sơ lịch sử chưa cập nhật theo yêu cầu để sau; không dùng hash trong đó để chứng nhận lượt này.
