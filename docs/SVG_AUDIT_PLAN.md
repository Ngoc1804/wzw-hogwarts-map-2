# Kiểm kê SVG và kế hoạch — CHỜ DUYỆT, chưa thay/xóa asset

Base: ecbd8805bcf81635e78a3b206fb23e2df9664fec, nhánh M2-P01-baseline-loader. Hai file mới là dữ liệu để đối chiếu, không thay chỉ thị người dùng. Chỉ lưu báo cáo; không đổi source, dist, asset, cây Fixed hoặc layout trong mốc này.

## Phạm vi kiểm

4.210 bản ghi: C4 245; 259 259; catalog repo 300; interiors repo 67; vectors/definitions Fixed 2.724; 13 map Fixed; artwork Outdoor trích 5; P4 object 97; assets runtime catalog 363 và runtime interiors 137. Có bản sao đóng gói/instance/definition, không phải 4.210 món độc lập. XML parse toàn bộ 4.210 bản ghi không lỗi. Render/raster đối chiếu 1.376 asset catalog/interiors/C4/259/Outdoor, không lỗi decode. Definitions Fixed được kiểm cấu trúc và tham chiếu theo source, không đánh đồng gradient/clipPath với món nội thất.

Bảng chi tiết từng bản ghi: SVG_AUDIT.csv. Gallery đối chiếu cây/cụm và cặp trùng khác ID: SVG_AUDIT_REVIEW.html, tự chứa hình và tìm kiếm. Đây là scan dữ liệu và phép so tự động, không phải tuyên bố đã duyệt mắt mọi cặp gần trùng. Các cặp có hình học tương đương nhưng dùng cách viết path khác vẫn phải overlay khi xét gộp.

## Kết quả quan trọng

- C4 có 7 cluster: divination, research, headmaster, astronomy, books, tea, candelabrum. Cả bảy có ảnh render trùng với catalog repo: giữ một bản canonical, bổ sung cách dùng trong layout, không nhập lặp.
- C4 có 245 ID chung runtime catalog: 231 ảnh render khớp hoàn toàn, 14 ảnh khác. Khác pixels không tự đồng nghĩa khác thiết kế: cần đối chiếu shape/material/view.
- 259 có 224 ID chung runtime catalog: chỉ 5 ảnh render khớp hoàn toàn, 219 ảnh khác. Tuyệt đối không ghi đè bản cũ chỉ vì trùng ID/tên.
- Hai nhóm khác ID có ảnh render trùng: atelier.door.double.room / atelier.door.double.main; extra.blackboard / new.blackboard-long. Chỉ đề xuất chia sẻ definition sau khi kiểm kích thước hữu dụng, mount và vai trò; không gộp hai công năng hoặc instance.
- 259 có 14 cây: ancient, willow và 12 cây thường oak, beech, birch, pine, spruce, alder, rowan, spreading, slender, weeping, bare, fruit. Hai cây đặc biệt giữ riêng, không đưa vào hai cụm. Nguồn gọi willow đặc biệt là Liễu Roi; không nhầm với weeping (tán rủ thường).

## Bảng lấy — giữ — thay — bỏ

| Nhóm | Đề xuất |
|---|---|
| Cây thường hiện tại trong catalog/runtime và architecture.tree trích H1 | Ngừng dùng, thay bằng cây từ 259 sau duyệt; không chỉ xóa khỏi một dist rồi còn lại trong source |
| Cây thường đang vẽ trong Fixed | Kiểm từng nhóm/instance và dependency, thay bằng cây 259; giữ bố cục/sàn/công trình khác. Vì người dùng yêu cầu bỏ toàn bộ cây cũ, phạm vi này bao gồm cây trong Fixed; phải có ảnh so trước/sau |
| Cây cổ thụ và cây liễu đặc biệt | Giữ riêng đúng artwork/anchor đã chốt; loại khỏi hai cụm cây thường |
| 12 cây thường từ 259 | Lấy theo hình nguồn, gán ID design riêng nếu đụng ID hiện có; không kéo méo/đổi thành cây cùng tên khác nét |
| 7 cluster để bàn C4 | Tái dùng bản trùng đã có, lấy C4 làm đối chiếu. Giữ variant front; chuẩn bị biến thể phù hợp mặt bàn top trước gắn layout |
| Đồ rời/decor C4 và 259 | Lấy design còn thiếu; giữ mọi design khác nét dù cùng tên. Chỉ loại bản sao sau so hình và kiểm refs |
| Nội thất đã có trong repo | Giữ bản đạt; bổ sung đồ thiếu theo công năng/props, không thêm cả cụm rồi nhân đôi sách/nến/đồ đã nằm trên bàn |
| Definition/path trùng thật | Chia sẻ symbol/defs; giữ alias công năng và instance riêng. Không dùng tên làm khóa dedup |
| File build/pack/review | Sinh lại từ nguồn đã hợp nhất; không sửa tay từng bản hay giữ engine cạnh tranh |

## Các task sau khi duyệt

1. **A1 — Chốt bảng hình.** Overlay các cặp cùng ID khác hình, khác ID cùng hình và các variant gần trùng. Fingerprint giữ hình học, transform, viewBox, stroke và thứ tự layer; so màu riêng. Chốt một design ID cho mỗi thiết kế, alias tên/công năng là lớp khác.
2. **A2 — Namespace và dependency.** Dự kiến nhóm `outdoor.tree.<design>`, `outdoor.grove.<design>`, `interior.surface.<design>`. Không gắn tên người/địa điểm vào ID. Viết lại cả id, href/xlink:href, url(#...), gradient, filter, mask, clipPath, CSS và tham chiếu recipe. Giữ mapping ID cũ → mới; kiểm không trùng ID/thiếu href. Không gộp front/top hoặc đổi view chỉ vì cùng tên.
3. **A3 — Hai cụm cây.** Cụm lá rộng: oak/beech/birch/alder/rowan; cụm lá kim–rìa thưa: pine/spruce/slender, điểm bare/spreading/fruit phù hợp. Chỉ dùng cây 259, không ancient/willow đặc biệt. Ghép lớp sau–trước, tỷ lệ thân/tán hợp lý, không hàng đều hoặc kéo méo. Định nghĩa vùng thân/đất và vùng tán che riêng, không dùng toàn bbox tán làm vùng cấm. Gửi ảnh hai cụm và từng cây thành phần để duyệt.
4. **A4 — Cụm để bàn.** Bắt đầu books/research/headmaster cho Office; tea/candelabrum cho Lounge/Meeting; divination/astronomy cho phòng đúng công năng; cụm dụng cụ Potions từ đồ rời phù hợp. C4 hiện ghi 7 cụm view=front: không dán nguyên cụm front lên bàn mặt bằng. Chọn đồ top tương ứng hoặc dựng variant top giữ đúng design, sau đó gắn vào surface món mẹ. Mỗi món xuất hiện một lần, merge/replace/ensure/add vẫn đúng.
5. **A5 — Layout nội thất.** Thử Office/Potions/Storage/Classroom trước; bổ sung decor còn thiếu, tăng chi tiết có kiểm. Đồ RP ưu tiên decor; không chắn cửa, xuyên tường, lơ lửng hoặc vượt mặt bàn. Không tự sinh dữ kiện RP để lấp đồ.
6. **A6 — Thay cây toàn repo.** Thực hiện sau mẫu duyệt: nguồn canonical → recipes/bindings → Fixed instances → dist/review. Giữ ngoại lệ hai cây đặc biệt, không xóa lịch sử Git. Có ảnh so trước/sau các map bị ảnh hưởng.
7. **A7 — QA và bàn giao.** Kiểm hình nét/style, front/top, tỷ lệ, surface containment, refs/IDs, merge/replace, full footprint/cửa, cây/cụm chồng lớp và X-Ray. Giao HTML catalog mới, bảng ID mapping, hai cụm cây, nội thất mẫu, ảnh desktop/mobile và ZIP. AI Studio nghiệm thu riêng, local không thay thế.

Cổng duyệt: duyệt bảng/kế hoạch này trước khi thay asset; sau đó duyệt hai cụm cây và các mẫu bàn/layout trước khi áp dụng rộng vào Fixed. Không bật lịch tự động ở lượt lập plan.
