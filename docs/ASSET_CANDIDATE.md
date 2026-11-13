# Catalog màu đã lọc — bản đầy đủ để duyệt

Base đang chạy: ecbd880; báo cáo scan: 713841b. Chỉ chuẩn bị bộ asset dự kiến, chưa thay SVG/catalog/trees/recipes/dist đang chạy. Không bật lịch tự động. Hình học Fixed vẫn giữ riêng, không coi 2.724 definitions là 2.724 món độc lập để xóa.

## Mở bản đầy đủ

`examples/asset-review.html` tự chứa 440 SVG màu và bảng quyết định, mở offline. Có tìm kiếm, lọc nhóm/góc nhìn, phân trang; từng món có ID mới, aliases, nguồn và nút tải SVG. Tab “Giữ / gộp / bỏ” có 1.376 dòng nguồn. `examples/asset-review-data.json` là toàn bộ dữ liệu dự kiến để tích hợp sau khi duyệt. `docs/ASSET_SELECTION.csv` là bảng mapping đầy đủ.

## Kết quả

| Xử lý | Số lượng |
|---|---:|
| Bản ghi nguồn độc lập đã đối chiếu | 1.376 |
| Design gốc giữ lại | 432 |
| Bản sao cùng geometry/view gộp vào design giữ lại | 911 |
| Bản ghi cây thường cũ loại khỏi candidate | 33 |
| Cụm top để bàn mới | 6 |
| Cụm cây mới | 2 |
| Tổng catalog dự kiến | 440 |

1.376 = 432 + 911 + 33. Các con số là bản ghi nhiều nguồn/biến thể, không phải số món vật lý trong một phòng. Chưa xóa asset cũ hoặc cây Fixed khỏi runtime ở mốc bàn giao candidate này.

Gộp bằng hình học, thứ tự vẽ, transform và view; chuẩn hóa path tương đối/tuyệt đối và H/V thành tọa độ tuyệt đối để phát hiện cùng nét được viết khác SVG. Giữ hình học pattern và clipPath; không coi cùng khung bao là trùng. Các SVG dùng use/reference phức tạp được giữ bảo thủ nếu chưa chứng minh tương đương. Tên/ID không dùng làm điều kiện gộp. Vì vậy có thể vẫn còn cặp gần giống cần xem hình, không tuyên bố chứng minh tương đương mọi SVG tùy ý.

Ưu tiên C4 đã tô màu, sau đó các bản runtime đã màu; 259 có design riêng thì giữ và gắn palette màu cụ thể, không thay bằng một món C4 cùng tên khác hình. Không tô kín các path vốn fill:none. Chọn từ C4 234 design, runtime catalog 126, 259 63, repo catalog 4 và artwork Outdoor đã trích 5; thêm 8 cụm mới. Các bản đã gộp không mất alias/công năng; physical instance trong recipe không bị xóa chỉ vì dùng chung symbol.

## Bỏ những gì

- 911 bản sao: bảng CSV ghi source/oldId và canonicalId đã chọn; action SHARE_SAME_DESIGN. Trong HTML mở chi tiết món để xem các bản nguồn đã gộp.
- 33 bản ghi cây thường cũ, thuộc các ID tree.bare, columnar, cypress, dead, flowering, fruit, pine, round, sapling, spruce, umbrella từ các nguồn cũ. Chúng bị loại khỏi candidate để dùng cây thường 259. Không xóa theo tên hoặc ghi đè thiết kế mới cùng ID.
- Không bỏ cổ thụ/liễu đặc biệt; artwork cổ thụ H1 cũng giữ riêng. Hai cụm mới không chứa ancient/willow đặc biệt. Cây weeping tán rủ thường của 259 là design khác với Liễu Roi đặc biệt.
- Giữ mọi design khác nét/view, kể cả cùng tên. Không nhập lặp 7 cụm front C4 đã có; chọn lại bản màu canonical để dùng.

## Cụm mới

Hai cụm cây dùng đúng 12 cây thường 259, đã phối palette màu: lá rộng (oak/beech/birch/alder/rowan/fruit) và lá kim–rìa thưa (spruce/pine/slender/spreading/bare/weeping). Thành phần, thứ tự lớp và rect nằm trong metadata từng cụm. Đây là geometry trình bày; safe floor/thân cây/occlusion khi tích hợp map cần kiểm riêng.

Sáu cụm top: đọc–ghi, pha chế nhỏ, trà–đọc, sắp hồ sơ, bàn giáo viên, chăm cây nhỏ. Tái dùng đồ rời top đã chọn từ nguồn, không kéo cụm front sang mặt bàn top. Mỗi cụm có inventory part ID, designId và rect; khay nền chung, các món còn đúng tỷ lệ. Có 3 mẫu đặt thử trên bàn C4: giáo viên, pha chế, đọc–ghi. Đây là preview surface, chưa thay layout phòng.

## Kiểm và bàn giao

PASS tests/asset-candidate.cjs: 440 SVG parse/decode/có hình, unique design IDs, không trùng ID nội bộ/thiếu href/url reference; 6 cụm top không vượt khay/không chồng rect thành phần; 2 cụm cây đúng nguồn và không lẫn hai cây đặc biệt. Đã xem screenshot desktop/mobile, cụm cây và mẫu đặt thử bàn. Không suy PASS kỹ thuật thành duyệt hình.

Ảnh: tests/asset-clusters.png, tests/asset-groves.png, tests/asset-surface-demos.png, tests/asset-clusters-mobile.png. Log: tests/asset-candidate-qa.json. Builder HTML: python tools/asset-review.py. Quy trình lọc/đo/ghép lưu trong tools/catalog-dedupe.py, catalog-measure.cjs, catalog-compose.py; cần inventory SVG đã audit từ hai file cấp + repo, không tự thay bằng nguồn khác.

Sau khi người dùng duyệt candidate: tích hợp catalog canonical, mapping tham chiếu, hai cụm cây và cụm surface vào source chính; thay cây thường trong Fixed theo nhóm/instance, giữ ngoại lệ và vị trí; build lại dist/review, test layout và X-Ray. Chưa thực hiện các thay đổi production đó ở mốc này.
