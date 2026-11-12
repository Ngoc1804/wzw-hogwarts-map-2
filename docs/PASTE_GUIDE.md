# Hướng dẫn thay system prompt — không dán thêm bản song song

Áp dụng cho file system prompt bạn gửi (1139 dòng). Dùng tiêu đề làm mốc vì số dòng sẽ đổi sau khi dán. Bạn tự copy/paste; repository không tự sửa system prompt Gemini.

| Thứ tự | Tìm trong prompt cũ | Thay bằng |
|---|---|---|
| 1 | Toàn bộ từ `### R14.6 — /MAP · WIZAMAP DEMO 3 · FLEXIBLE RP LOCATION (MAP_DATA 3.2.0)` tới hết `END R14.6 /MAP.` (dòng gốc 187–248) | Toàn bộ nội dung MAP_PROMPT.md. Đây là đoạn /map đầy đủ; giữ code fence HTML bên trong. Khi Gemini trả kết quả, nó thay __MAP_DATA_JSON__ bằng JSON RP thật. |
| 2 | Hai tiêu đề `### W4 — SPACE, LOCATIONS & TRAVEL DATA` và `### W4 — SPACE, LOCATIONS, ATLAS & TRAVEL DATA` (dòng gốc 374–375) | Một tiêu đề: `### W4 — SPACE, LOCATIONS, ATLAS & TRAVEL DATA` |
| 3 | Từ `#### W4.1 — WZW NORMALIZED ATLAS...` tới ngay trước `#### W4.2 — Connections, Travel & Special Rules` đầu tiên (dòng gốc 376–495) | Toàn bộ ATLAS_W4.md, thay riêng tiêu đề đầu `# WZW NORMALIZED ATLAS — TEMPLATE ROUTING & WORLD LOCATIONS` bằng `#### W4.1 — WZW NORMALIZED ATLAS — MAP 2 IDs`. Chỉ dán Atlas một lần. |
| 4 | Từ W4.2 đầu tiên tới trước `### W5 — INFORMATION CHANNELS & EVIDENCE SURFACES` (dòng gốc 496–515), gồm các W4.2/W4.3 trùng | Toàn bộ W4_TAIL.md. Nội dung đã hợp nhất, sửa CCC F7→F8W; giữ travel, Liad, Whitecap và mốc bảy năm. |

Không thay R14.7 /INVENTORY, R14.8 /TASK hoặc các phần RP khác. Không giữ lại loader iframe, schema 3.2.0, hints/visibility/view và URL repo cũ trong R14.6. Không đưa runtime error-policy cũ quay lại. Prompt mới không cần tải GitHub mỗi lượt; link chỉ tải renderer trong Preview.

## Dữ liệu đã có trong Atlas, không cần dán lặp

13 Fixed + owner/routing; 348 ID anchor artwork; ID cluster/phòng theo tầng/hướng; 41 ID nội thất có thật; World và AU. R14.6 đã có 14 ribbon, footsteps/spot, bảy field gốc và luật props. Không đưa 363 element ID hay source JSON/JS vào prompt. ID phòng và ID nội thất là hai khái niệm riêng. Nếu một phòng ngữ nghĩa chưa có artwork riêng, giữ nơi RP và dùng detail/fallback, không giả rằng có ID SVG chính xác.

## Binding và nội thất

Binding = tra ID địa điểm để nối hình/marker/Inspector; AI gửi đúng ID thì không cần đoán tên. Phòng mới vẫn được đặt tên tự do. Recipe = bộ nội thất dùng chung, không phải ID phòng. ensure là tổng mong muốn, add là số thêm; replace+[] tạo phòng không đồ. broken/removed nhắm đúng instance khi cần; re-render không tích lũy.

## Trạng thái triển khai

Contract/ID lookup và compose inventory recipe thật đã kiểm local. Generated hiện vẫn là sơ đồ nền; đặt/vẽ nội thất đầy đủ, cửa/lối đi, H36 và duyệt hình ảnh là P4 tiếp theo. Không tuyên bố cả 41 phòng đã được nghiệm thu đồ họa. Loader được ghim commit source thực và kiểm ở browser local; Google AI Studio Preview đích CHƯA THỬ, không được coi đã nghiệm thu. Không merge main hoặc phát hành.

## Dung lượng

Đoạn /map khoảng 5,9 KB UTF-8; không kèm catalog element hay lặp danh mục recipe ngoài Atlas. Atlas hiện 48.821 byte vì gồm cả địa danh nguồn và bảng ID artwork/nội thất cần tra; không tuyên bố token không tăng so với bản chỉ có tên. Các phòng không-Fixed đã gắn ID/recipe ngay tại mục nguồn để tránh lặp lại toàn bộ danh sách phòng trong một phụ lục thứ hai. Không có đo tokenizer cụ thể cho model Gemini.
