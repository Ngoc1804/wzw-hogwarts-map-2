# WZW MAP 2 — ATLAS GITHUB MASTER

**Bản đặc tả địa điểm, kiến trúc, phòng, nội thất và routing cho GitHub/browser.**  Đây là tài liệu đề xuất thay thế Atlas cũ; chưa ghi vào repo, chưa sửa runtime.

- **Baseline đối chiếu:** `Ngoc1804/wzw-hogwarts-map-2`, nhánh `M2-P01-baseline-loader`, commit `739643d1fa3f6360e0ccf26ae266dcb1aa07a824`.
- **Nguồn ID:** [ATLAS_W4.md](https://github.com/Ngoc1804/wzw-hogwarts-map-2/blob/739643d1fa3f6360e0ccf26ae266dcb1aa07a824/docs/ATLAS_W4.md), [atlas.json](https://github.com/Ngoc1804/wzw-hogwarts-map-2/blob/739643d1fa3f6360e0ccf26ae266dcb1aa07a824/assets/atlas.json), [recipes.json](https://github.com/Ngoc1804/wzw-hogwarts-map-2/blob/739643d1fa3f6360e0ccf26ae266dcb1aa07a824/assets/recipes.json), [vocabulary.json](https://github.com/Ngoc1804/wzw-hogwarts-map-2/blob/739643d1fa3f6360e0ccf26ae266dcb1aa07a824/assets/vocabulary.json); tài liệu Atlas người dùng cung cấp. Nội thất 49 recipe lấy từ báo cáo tích hợp FINAL trong repo.
- **Phạm vi:** 13 Fixed × 348 anchor; 52 Hogwarts cluster × 242 phòng; 4 AU cluster × 43 phòng; 3 World scope hiện chưa có bản ghi phòng trong JSON; 49 recipe × 509 instance. World được mô tả chi tiết ở đây để phát triển bộ Atlas dữ liệu.
- **Quy ước:** `NGUỒN` = ID/tên/recipe có sẵn trong Atlas hiện tại; `MINH HỌA` = bố cục/đồ đạc được đề xuất để renderer dựng khi canon không xác định; `RP` = Gemini quyết định theo ngữ cảnh. Mô tả gợi ý không phải xác nhận canon.

## 0. Nguyên tắc tối cao — visualizer, không phải game

1. `/map` hiển thị vị trí PC, **bản đồ xung quanh**, ribbon NPC/nhóm, POI `?`/`!` mà PC được biết. Không chạy AI/NPC/quest/time simulation, pathfinding hay gameplay từ JavaScript.
2. **Gemini → MAP_DATA → browser/GitHub** một chiều. Gemini quyết định vũ trụ/quốc gia/khu/công trình/phòng, PC/NPC, số lượng/hoạt động/quest/props. Browser nhận và biểu diễn; không tự thêm diễn biến và không gọi AI thứ hai.
3. **13 Fixed bất biến về artwork và UI.** Bên trong phạm vi Fixed đã thể hiện được: chỉ thêm PC/NPC/nhóm/POI, nhãn/Inspector, hiệu ứng marker/X-Ray hợp lệ. Không tự sửa tường, phòng, bàn, màu, svg template; không đắp Generated lên Fixed.
4. **Generated = sandbox tùy biến RP.** Asset là hình, recipe là bộ đồ gợi ý, layout là mẫu liên thông; đổi số lượng, cỡ phòng, cách bố trí, vật theo RP. Không ép 49 layout thành 49 cảnh nguyên xi.
5. Chọn một **owner** theo vị trí PC thực; vùng/nơi khác được nhắc không làm đổi bản đồ. Fixed: marker trong template; Atlas: đủ phòng thuộc cluster; Custom/World: chỉ dựng **phạm vi đang xem**, không dựng cả quốc gia.
6. **Không có `unknown` ở đầu ra Gemini:** phải xác định vị trí theo ngữ cảnh RP, canon, AU và mức chi tiết cần thiết; nơi mới có tên/miêu tả dùng `custom` hoặc scope vùng hợp lý. Một cảnh thiếu asset vẫn có hình ghép, hình mới có cấu trúc hoặc fallback đúng ý nghĩa.
7. Bí mật chưa được PC nhận biết không được đưa vào `MAP_DATA`, bao gồm DOM/Inspector; Atlas có thể lưu tri thức mô tả địa điểm nhưng không phát thông tin bí mật vào UI.
8. `MAP_DATA` JSON hợp lệ/đủ trường phải có kết quả hiển thị. Asset lỗi fallback **từng đối tượng**; JSON bị cắt, CDN lỗi hoặc script không chạy phải báo lỗi kỹ thuật, không giả render thành công.

## 1. ID, phân cấp, ranh giới và resolver

### 1.1. Mô hình dữ liệu dự kiến

`universe → country → region → settlement/estate → building → level → cluster → room → zone → asset`. **Chỉ cấp đã có ID trong source mới được coi là ID hiện thực.** Các tên World chi tiết tại mục 5 là `placeName`/alias cho dữ liệu sẽ bổ sung, **chưa phải `atlasAnchor` mới**. Một `owner`/cluster thực tại một thời điểm; `→` chỉ là pointer liên thông.

**Ưu tiên định tuyến:** `user explicitly requests sandbox` hoặc cảnh không đại diện được trên Fixed → `custom`; còn lại dùng Fixed chuyên biệt → Hogwarts cluster/tower/AU đã biết → `h2` → `h1` → World region/Custom. Thay đổi nội thất thuộc Generated được áp trực tiếp. Trạng thái AU `LOCKED` của tài liệu cũ là thông tin nền/cốt truyện, không phải lỗi chặn vẽ khi RP đã thực sự đặt PC ở đó.

**Ngoại lệ bắt buộc:** H1/H2 xuất hiện nhà/công trình AU **mới** không có trên bản đồ → sandbox mới cho cảnh đó; làng Hogsmeade và hai hẻm có nhà/tiệm AU mới → dùng anchor nhà dân trống cùng khu, giữ Fixed. Khi hết chỗ: giữ marker/thông tin và chủ động dùng Custom/detail theo ngữ cảnh (không gán đè nhà canon, không silently drop). Nhà/tiệm AU có tên mới nhưng nằm trong khu Fixed **không tự động bị chuyển sang Custom**. Bất kỳ cảnh nào user chủ động yêu cầu dựng riêng được xem như Custom.

**Ranh giới tiêu biểu:** sân/bờ ngoài sân Quidditch `h1`, bên trong `pitch-static`; làng `village-static`, ngoại vi/cave Sirius `h1`; Nhà Cú và khu trong thành `h2`, phòng Hogwarts chưa có Fixed → cluster; King’s Cross/Hogsmeade station bên trong ga `express`, đã lên tàu vẫn `express` nhưng chọn toa/buồng; ngoài ga London `LONDON`. Đại Sảnh/phạm vi F1 S/W do `hall` sở hữu, không phải toàn F1.

**Sự kiện:** Vị trí khu vực của Triwizard có thể có anchor H1/pitch, nhưng khi RP đòi bối cảnh thi đấu đặc biệt không có trong Fixed (ví dụ đấu trường rồng, nhiệm vụ dưới hồ, mê cung mới), dựng sandbox theo nội dung RP; không sửa SVG H1/pitch để dựng sân khấu. Không tự mở nội dung/sự kiện đang khóa.

### 1.2. Cách nối đến renderer

| Trường/nguồn | Browser xử lý |
|---|---|
| `atlasAnchor` có Fixed ID | Lấy nguyên template và anchor vị trí PC/NPC/POI; không xây phòng. |
| `atlasAnchor` là Hogwarts/AU cluster | Lấy đủ mọi room của cluster, nhận pointer liên thông; chọn recipe theo `room.type`, dùng `layout` làm gợi ý, dựng tùy biến. |
| World region + `pcPlace`/đường vị trí | Chọn đúng nơi/công trình/phạm vi đang hiện, mở các phòng thuộc công trình/tầng liên quan đã biết; đừng dựng nguyên vùng quốc gia. |
| `atlasAnchor: custom` | Dựa vào tên, công năng và miêu tả Gemini; chọn hình/recipe/layout hoặc tạo shape tối thiểu. |
| `places[].props` | Ghi đè/cộng/thay theo RP, không nhân bản đồ nền nếu recipe đã chứa. |
| `actors[]`/`events[]` | Không tự thêm NPC/quest. PC marker riêng; tối đa 10 ribbon do Gemini tự tổ chức; `?` = clue hidden được PC nhận dấu hiệu, `!` = hoạt động/quest thường. |

### 1.3. 10 dạng hành lang có trong source

| `layout` | Ý nghĩa hình học và tính tùy biến |
|---|---|
| `horizontal` | Hành lang ngang, các phòng ở hai bên; co giãn độ dài theo số phòng. |
| `vertical` | Trục dọc; cửa, cửa sổ và nội thất sát vách theo chiều dài. |
| `ell` | Hai nhánh tạo góc chữ L, phòng phân bố theo nhánh. |
| `tee` | Trục chính và một nhánh chữ T, nhường nút giao thông thoáng. |
| `cross` | Bốn nhánh gặp nhau ở tâm, lối nối trung tâm thông thoáng. |
| `court` | Ba cánh chữ U bao sân mở; ưu tiên cửa hướng hành lang/sân hợp lý. |
| `cloister` | Hành lang khép quanh sân trung tâm, phòng mở vào vòng hành lang. |
| `windows` | Dãy hành lang lấy ánh sáng bằng cửa sổ hướng ra ngoài. |
| `curved` | Hành lang có đoạn chuyển cong, tường/trang trí theo cung. |
| `tower` | Hành lang tiếp nối không gian tháp tròn/đầu tháp, theo cửa tiếp cận. |

### 1.4. Vật liệu và ngôn ngữ hình chung

Generated dùng màu giấy beige cũ, mực nâu, đường viền/texture dịu, vật liệu gỗ/đá/gạch/cỏ/nước theo vùng; không áp trang trí tùy tiện lên Fixed. SVG catalog được chuẩn hoá viewBox/namespace ID, giữ tỷ lệ không shear, bố trí đồ trên mặt bàn/tường theo quan hệ parent–surface thay vì xếp hàng rời; dấu chân burgundy, sáu nhịp theo UI đã duyệt. Sàn, tường, cửa, nước, công trình tạo **vùng đặt hợp lệ tối giản** (không phải solver/game collision). X-Ray chỉ làm mờ nhóm công trình thực sự che marker khi kiểm depth/layer, khôi phục khi hết che; `inside` không tự bật X-Ray.

## 2. Atlas Fixed — 13 template bất biến và đủ anchor gốc

**Trong Fixed, tất cả nội dung dưới đây là chỉ mục vị trí/đối tượng để click; KHÔNG phải chỉ thị dựng lại nội thất hay thêm kiến trúc.** Anchor trong bảng là danh sách ID thực có trong tài liệu Atlas nguồn. Các điểm được đánh dấu bằng visual source nhưng routing owner có thể do khu Fixed chuyên biệt khác quyết định (như Owlery trên H1 → `h2`).

### 2.1. `h1` — Bản đồ ngoại cảnh Hogwarts

- **Phạm vi:** Ngoại cảnh Hogwarts–Hogsmeade ngoài khuôn viên lâu đài.
- **Thành phần đã biết:** Hồ Đen, Rừng Cấm, đồng cỏ, đường mòn, nhà Hagrid, nhà kính, Cây Liễu Roi, nhà thuyền, đường tới làng/ga. Một số vùng sự kiện có thể hiện marker tại điểm nguồn; khi RP yêu cầu đấu trường/bố cục mới ngoài artwork, chuyển sandbox.
- **Cách hiển thị RP/AU:** Không tạo nội thất nhà Hagrid/nhà kính hoặc cảnh AU đè lên Fixed; các công trình hiện có được đánh dấu bằng anchor. Công trình AU mới trên H1 phải dựng sandbox nếu không hiện được đúng bằng Fixed.
- **Định hướng visual:** Cảnh quan: nước, bờ, cỏ/đất, rừng, đường và khối công trình; giữ chính xác SVG hiện có.
- **Anchor từ source: 29 ID.** Mọi ID dưới đây chỉ là đích định vị/click; khi có anchor trong map cha nhưng owner chuyên biệt khác, resolver ưu tiên owner chuyên biệt.

| Anchor ID thực | Tên hiển thị nguồn | Ý nghĩa/chi tiết hình |
|---|---|---|
| `region-4` | Rừng Cấm | Địa hình/sân; marker tại anchor hợp lệ |
| `region-3` | Hồ Đen | Địa hình/sân; marker tại anchor hợp lệ |
| `region:station-dock` | Bến ga | Anchor/POI hiện hữu trên Fixed |
| `region-0` | Lâu đài Hogwarts | Khối công trình/tầng đã phủ Fixed |
| `region:extra:5` | Nhà Hagrid | Anchor/POI hiện hữu trên Fixed |
| `region:extra:2` | Cây Liễu Roi | Anchor/POI hiện hữu trên Fixed |
| `region:extra:0` | Nhà kính | Anchor/POI hiện hữu trên Fixed |
| `region:extra:1` | Nhà cú | Anchor/POI hiện hữu trên Fixed |
| `region:extra:4` | Sân Quidditch | Địa hình/sân; marker tại anchor hợp lệ |
| `region:extra:7` | Bãi học bay | Địa hình/sân; marker tại anchor hợp lệ |
| `region:extra:8` | Sân đón tiếp | Địa hình/sân; marker tại anchor hợp lệ |
| `region-5` | Cổng trường | Anchor/POI hiện hữu trên Fixed |
| `region-1` | Hogsmeade | Anchor/POI hiện hữu trên Fixed |
| `region-6` | Lều Hét | Anchor/POI hiện hữu trên Fixed |
| `region-2` | Ga Hogsmeade | Anchor/POI hiện hữu trên Fixed |
| `suspension-bridge` | Cầu treo | Lối/kết nối hoặc điểm vào trong Fixed |
| `lakeside-boathouse` | Nhà thuyền ven hồ | Địa hình/sân; marker tại anchor hợp lệ |
| `lakeside-tree` | Cây cổ thụ · Bãi cỏ ven hồ | Địa hình/sân; marker tại anchor hợp lệ |
| `train-v5` | Tàu tốc hành Hogwarts | Anchor/POI hiện hữu trên Fixed |
| `village-house-0` | Tiệm Công tước Mật | Tiệm/quán trên Fixed, dùng POI/marker |
| `village-house-1` | Tiệm giỡn Zonko | Tiệm/quán trên Fixed, dùng POI/marker |
| `village-house-2` | Tiệm trang phục Gladrags | Tiệm/quán trên Fixed, dùng POI/marker |
| `village-house-3` | Tiệm bút lông Scrivenshaft | Tiệm/quán trên Fixed, dùng POI/marker |
| `village-house-4` | Bưu điện Cú | Anchor/POI hiện hữu trên Fixed |
| `village-house-5` | Quán Ba Cây Chổi Thần | Tiệm/quán trên Fixed, dùng POI/marker |
| `village-house-6` | Tiệm Dervish và Banges | Tiệm/quán trên Fixed, dùng POI/marker |
| `village-house-7` | Hog’s Head | Anchor/POI hiện hữu trên Fixed |
| `village-house-8` | Quán trà bà Puddifoot | Tiệm/quán trên Fixed, dùng POI/marker |
| `village-house-9` | Apothecary. | Anchor/POI hiện hữu trên Fixed |

### 2.2. `h2` — Khuôn viên/lâu đài Hogwarts

- **Phạm vi:** Ngoại thất lâu đài, sân, cổng, cầu và Nhà Cú.
- **Thành phần đã biết:** Các khối lâu đài và tháp, sân rồng hai chân/tầm gửi/Transfiguration/Clock, cổng, cầu đá/cầu treo, Nhà Cú và đường nội khu. H2 không sở hữu lớp học/phòng nội thất Hogwarts khác.
- **Cách hiển thị RP/AU:** Bối cảnh trong phạm vi H2 giữ nguyên artwork; NPC trong nhà/tháp tương ứng được gắn anchor, không tự dựng phòng đè H2. Nhà/công trình AU mới cần cảnh sandbox nếu Fixed không biểu diễn được.
- **Định hướng visual:** Địa hình, sân lát, cầu, khối tháp và lớp mái phải giữ depth/X-Ray đúng nhóm.
- **Anchor từ source: 72 ID.** Mọi ID dưới đây chỉ là đích định vị/click; khi có anchor trong map cha nhưng owner chuyên biệt khác, resolver ưu tiên owner chuyên biệt.

| Anchor ID thực | Tên hiển thị nguồn | Ý nghĩa/chi tiết hình |
|---|---|---|
| `h2-place-0` | Hồ Đen | Địa hình/sân; marker tại anchor hợp lệ |
| `h2-place-1` | Đường vào trường | Lối/kết nối hoặc điểm vào trong Fixed |
| `h2-place-2` | Đường ven hồ | Lối/kết nối hoặc điểm vào trong Fixed |
| `h2-place-3` | Sân đài rồng hai chân | Địa hình/sân; marker tại anchor hợp lệ |
| `h2-place-4` | Sân tầm gửi | Địa hình/sân; marker tại anchor hợp lệ |
| `h2-place-5` | Sân đón tiếp | Địa hình/sân; marker tại anchor hợp lệ |
| `h2-place-6` | Cánh Bắc | Khối công trình/tầng đã phủ Fixed |
| `h2-place-7` | Đại Sảnh | Anchor/POI hiện hữu trên Fixed |
| `h2-place-8` | Thư viện · Cánh Đông Bắc | Khối công trình/tầng đã phủ Fixed |
| `h2-place-9` | Tháp phía Bắc | Khối công trình/tầng đã phủ Fixed |
| `h2-place-10` | Tháp tròn Tây Bắc | Khối công trình/tầng đã phủ Fixed |
| `h2-place-11` | Tháp góc Bắc | Khối công trình/tầng đã phủ Fixed |
| `h2-place-12` | Tháp Đông Bắc | Khối công trình/tầng đã phủ Fixed |
| `h2-place-13` | Cánh Tây · Khu học tập | Khối công trình/tầng đã phủ Fixed |
| `h2-place-14` | Cánh Đông · Khu học tập | Khối công trình/tầng đã phủ Fixed |
| `h2-place-15` | Dãy nhà Bắc chung hai sân | Địa hình/sân; marker tại anchor hợp lệ |
| `h2-place-16` | Hành lang Bắc · Sân rồng hai chân | Lối/kết nối hoặc điểm vào trong Fixed |
| `h2-place-17` | Hành lang Bắc · Sân tầm gửi | Lối/kết nối hoặc điểm vào trong Fixed |
| `h2-place-18` | Dãy nhà chung chia hai sân | Địa hình/sân; marker tại anchor hợp lệ |
| `h2-place-19` | Dãy nhà Nam chung hai sân | Địa hình/sân; marker tại anchor hợp lệ |
| `h2-place-20` | Cổng xuyên vào sân rồng hai chân | Địa hình/sân; marker tại anchor hợp lệ |
| `h2-place-21` | Lối đá · Cổng xuyên vào sân rồng hai chân | Lối/kết nối hoặc điểm vào trong Fixed |
| `h2-place-22` | Cổng xuyên vào sân tầm gửi | Địa hình/sân; marker tại anchor hợp lệ |
| `h2-place-23` | Lối đá · Cổng xuyên vào sân tầm gửi | Lối/kết nối hoặc điểm vào trong Fixed |
| `h2-place-24` | Tháp Tây Nam | Khối công trình/tầng đã phủ Fixed |
| `h2-place-25` | Tháp đầu cầu | Lối/kết nối hoặc điểm vào trong Fixed |
| `h2-place-26` | Đài phun rồng hai chân | Anchor/POI hiện hữu trên Fixed |
| `h2-place-27` | Cây tầm gửi sân trong | Địa hình/sân; marker tại anchor hợp lệ |
| `h2-place-28` | Nhà nguyện · Cánh Tây Nam | Khối công trình/tầng đã phủ Fixed |
| `h2-place-29` | Sảnh vào lâu đài | Khối công trình/tầng đã phủ Fixed |
| `h2-place-30` | Tháp sảnh vào · Tây | Khối công trình/tầng đã phủ Fixed |
| `h2-place-31` | Tháp sảnh vào · Đông | Khối công trình/tầng đã phủ Fixed |
| `h2-place-32` | Hành lang sân trước · Tây | Lối/kết nối hoặc điểm vào trong Fixed |
| `h2-place-33` | Hành lang sân trước · Đông | Lối/kết nối hoặc điểm vào trong Fixed |
| `h2-place-34` | Bậc thềm và cổng chính | Anchor/POI hiện hữu trên Fixed |
| `h2-place-35` | Tháp cổng · Tây | Khối công trình/tầng đã phủ Fixed |
| `h2-place-36` | Tháp cổng · Đông | Khối công trình/tầng đã phủ Fixed |
| `h2-place-37` | Ghế đá 1 | Anchor/POI hiện hữu trên Fixed |
| `h2-place-38` | Ghế đá 2 | Anchor/POI hiện hữu trên Fixed |
| `h2-place-39` | Ghế đá 3 | Anchor/POI hiện hữu trên Fixed |
| `h2-place-40` | Ghế đá 4 | Anchor/POI hiện hữu trên Fixed |
| `h2-place-41` | Ghế đá 5 | Anchor/POI hiện hữu trên Fixed |
| `h2-place-42` | Ghế đá 6 | Anchor/POI hiện hữu trên Fixed |
| `h2-place-43` | Đường tới mé Rừng Cấm | Lối/kết nối hoặc điểm vào trong Fixed |
| `h2-place-44` | Đường nhà kính và vườn thực vật | Lối/kết nối hoặc điểm vào trong Fixed |
| `h2-place-45` | Đường nối đầu cầu gỗ tới nhà Hagrid | Lối/kết nối hoặc điểm vào trong Fixed |
| `h2-place-46` | Đường lên nhà cú | Lối/kết nối hoặc điểm vào trong Fixed |
| `h2-place-47` | Đường tới bãi Liễu Roi | Lối/kết nối hoặc điểm vào trong Fixed |
| `h2-place-48` | Đường dạo bờ hồ và nhà cú | Lối/kết nối hoặc điểm vào trong Fixed |
| `h2-place-49` | Mé Rừng Cấm | Địa hình/sân; marker tại anchor hợp lệ |
| `h2-place-50` | Sân Quidditch | Địa hình/sân; marker tại anchor hợp lệ |
| `h2-place-51` | Lối ra sân Quidditch | Lối/kết nối hoặc điểm vào trong Fixed |
| `h2-place-52` | Cầu gỗ Hogwarts · Mẫu H1 | Lối/kết nối hoặc điểm vào trong Fixed |
| `h2-place-53` | Chiếu nghỉ hai đầu cầu gỗ | Lối/kết nối hoặc điểm vào trong Fixed |
| `h2-place-54` | Nhà kính · Vườn thực vật | Anchor/POI hiện hữu trên Fixed |
| `h2-place-55` | Vườn thảo dược ngoài trời | Anchor/POI hiện hữu trên Fixed |
| `h2-place-56` | Nhà Hagrid · Lục giác | Anchor/POI hiện hữu trên Fixed |
| `h2-place-57` | Vườn bí và hàng rào | Anchor/POI hiện hữu trên Fixed |
| `h2-place-58` | Cầu cạn đá lên nhà cú | Lối/kết nối hoặc điểm vào trong Fixed |
| `h2-place-59` | Nhà cú | Anchor/POI hiện hữu trên Fixed |
| `h2-place-60` | Cây cổ thụ ven hồ | Địa hình/sân; marker tại anchor hợp lệ |
| `h2-place-61` | Liễu Roi · Cây liễu gai | Anchor/POI hiện hữu trên Fixed |
| `h2-place-62` | Cây cảnh quan 1 | Anchor/POI hiện hữu trên Fixed |
| `h2-place-63` | Cây cảnh quan 2 | Anchor/POI hiện hữu trên Fixed |
| `h2-place-64` | Cây cảnh quan 3 | Anchor/POI hiện hữu trên Fixed |
| `h2-place-65` | Cây cảnh quan 4 | Anchor/POI hiện hữu trên Fixed |
| `h2-place-66` | Cây cảnh quan 5 | Anchor/POI hiện hữu trên Fixed |
| `h2-place-67` | Cây cảnh quan 6 | Anchor/POI hiện hữu trên Fixed |
| `h2-place-68` | Cây cảnh quan 7 | Anchor/POI hiện hữu trên Fixed |
| `h2-place-69` | Vòng gôn Quidditch | Anchor/POI hiện hữu trên Fixed |
| `h2-place-70` | Khán đài Quidditch | Anchor/POI hiện hữu trên Fixed |
| `h2-place-71` | Cổng sân Quidditch. | Địa hình/sân; marker tại anchor hợp lệ |

### 2.3. `hall` — Đại Sảnh & F1 S/W

- **Phạm vi:** Cụm F1 South/West Đại Sảnh.
- **Thành phần đã biết:** Great Hall với bốn dãy bàn, bệ giáo viên, tiền sảnh, cầu thang, phòng giáo viên, Filch, gian chờ, phòng sau bục và sân trong riêng; không chiếm toàn tầng F1.
- **Cách hiển thị RP/AU:** Không tái bố trí bàn hay thêm/sửa nội thất sảnh Fixed; actor/POI gắn đúng các anchor `gf-*`.
- **Định hướng visual:** Nội thất gỗ/đá và hướng sáng của bản Fixed nguyên gốc.
- **Anchor từ source: 16 ID.** Mọi ID dưới đây chỉ là đích định vị/click; khi có anchor trong map cha nhưng owner chuyên biệt khác, resolver ưu tiên owner chuyên biệt.

| Anchor ID thực | Tên hiển thị nguồn | Ý nghĩa/chi tiết hình |
|---|---|---|
| `gf-courtyard` | Sân trong tầng trệt | Địa hình/sân; marker tại anchor hợp lệ |
| `gf-staff` | Phòng giáo viên | Room/POI trong artwork Fixed; không dựng map con |
| `gf-filch` | Văn phòng Filch | Room/POI trong artwork Fixed; không dựng map con |
| `gf-class11` | Lớp học 11 · phòng chưa dùng | Room/POI trong artwork Fixed; không dựng map con |
| `gf-waiting` | Gian chờ trước Phân loại | Anchor/POI hiện hữu trên Fixed |
| `gf-antechamber` | Phòng nhỏ sau bàn giáo viên | Anchor nội thất/điểm chọn, không sửa artwork |
| `gf-dais` | Đại Sảnh · Bệ giáo viên | Bệ bàn giáo viên Đại Sảnh; bất biến. |
| `gf-table-0` | Bàn Gryffindor | Dãy bàn Gryffindor; bất biến. |
| `gf-table-1` | Bàn Hufflepuff | Dãy bàn Hufflepuff; bất biến. |
| `gf-table-2` | Bàn Ravenclaw | Dãy bàn Ravenclaw; bất biến. |
| `gf-table-3` | Bàn Slytherin | Dãy bàn Slytherin; bất biến. |
| `gf-entrance` | Tiền sảnh | Anchor/POI hiện hữu trên Fixed |
| `gf-main-stairs` | Cầu thang đá cẩm thạch · lên tầng trên | Lối/kết nối hoặc điểm vào trong Fixed |
| `gf-hourglasses` | Đồng hồ cát điểm bốn nhà | Địa hình/sân; marker tại anchor hợp lệ |
| `gf-downstairs` | Lối xuống tầng dưới · bếp và Hufflepuff | Lối/kết nối hoặc điểm vào trong Fixed |
| `gf-broom` | Tủ chổi. | Anchor/POI hiện hữu trên Fixed |

### 2.4. `gryffindor-common` — Phòng chung Gryffindor

- **Phạm vi:** Phòng chung và khu ngủ Gryffindor.
- **Thành phần đã biết:** Lối chân dung Bà Béo, lò sưởi, cụm ghế sinh hoạt, khu học/đọc và các hướng cầu thang đến khu ngủ nam/nữ.
- **Cách hiển thị RP/AU:** Phạm vi hoàn toàn thuộc Fixed; điểm ngủ/cầu thang là anchor click, không dựng map phòng ngủ riêng.
- **Định hướng visual:** Giữ bảng màu đỏ ấm và đồ gỗ đã có trong template.
- **Anchor từ source: 8 ID.** Mọi ID dưới đây chỉ là đích định vị/click; khi có anchor trong map cha nhưng owner chuyên biệt khác, resolver ưu tiên owner chuyên biệt.

| Anchor ID thực | Tên hiển thị nguồn | Ý nghĩa/chi tiết hình |
|---|---|---|
| `gryffindor-hearth` | Lò sưởi và khu ngồi chung | Anchor/POI hiện hữu trên Fixed |
| `gryff-stairs-0` | Cầu thang khu ngủ nam | Lối/kết nối hoặc điểm vào trong Fixed |
| `gryff-stairs-1` | Cầu thang khu ngủ nữ | Lối/kết nối hoặc điểm vào trong Fixed |
| `gryff-entry` | Cửa chân dung Bà Béo | Anchor/POI hiện hữu trên Fixed |
| `gryffindor-sleep-0` | Gryffindor · Tầng ngủ mẫu · Cụm 1 | Khối công trình/tầng đã phủ Fixed |
| `gryffindor-sleep-1` | Gryffindor · Tầng ngủ mẫu · Cụm 2 | Khối công trình/tầng đã phủ Fixed |
| `gryffindor-return-0` | Cầu thang về phòng chung | Room/POI trong artwork Fixed; không dựng map con |
| `gryffindor-return-1` | Cầu thang về phòng chung. | Room/POI trong artwork Fixed; không dựng map con |

### 2.5. `ravenclaw-common` — Phòng chung Ravenclaw

- **Phạm vi:** Phòng chung và khu ngủ Ravenclaw.
- **Thành phần đã biết:** Lối đại bàng, cầu thang xoắn, gian sinh hoạt/đọc, tượng Rowena, lối vào phòng ngủ.
- **Cách hiển thị RP/AU:** Giữ Fixed; không sinh thêm phòng học/tủ sách ngoài artwork để giải thích NPC.
- **Định hướng visual:** Giữ kết cấu tháp, góc đọc và bảng màu hiện có.
- **Anchor từ source: 7 ID.** Mọi ID dưới đây chỉ là đích định vị/click; khi có anchor trong map cha nhưng owner chuyên biệt khác, resolver ưu tiên owner chuyên biệt.

| Anchor ID thực | Tên hiển thị nguồn | Ý nghĩa/chi tiết hình |
|---|---|---|
| `ravenclaw-hearth` | Khu sinh hoạt và đọc sách | Anchor/POI hiện hữu trên Fixed |
| `raven-entry` | Cửa đại bàng và cầu thang xoắn | Anchor nội thất/điểm chọn, không sửa artwork |
| `raven-dorm-door` | Cửa tới khu ngủ | Anchor/POI hiện hữu trên Fixed |
| `raven-rowena` | Tượng Rowena Ravenclaw | Anchor/POI hiện hữu trên Fixed |
| `ravenclaw-sleep-0` | Ravenclaw · Tầng ngủ mẫu · Cụm 1 | Khối công trình/tầng đã phủ Fixed |
| `ravenclaw-sleep-1` | Ravenclaw · Tầng ngủ mẫu · Cụm 2 | Khối công trình/tầng đã phủ Fixed |
| `ravenclaw-return` | Cầu thang về phòng chung. | Room/POI trong artwork Fixed; không dựng map con |

### 2.6. `hufflepuff-common` — Phòng chung Hufflepuff

- **Phạm vi:** Phòng chung và khu ngủ Hufflepuff.
- **Thành phần đã biết:** Lối thùng gỗ, khu sinh hoạt, các nhánh hầm đi khu ngủ, giường/rương mẫu, lối lên tầng trệt.
- **Cách hiển thị RP/AU:** Mọi phòng/khu có anchor được thể hiện trên Fixed; không dựng overlay phòng riêng.
- **Định hướng visual:** Đồ gỗ và cảm giác hầm ấm giữ theo template.
- **Anchor từ source: 11 ID.** Mọi ID dưới đây chỉ là đích định vị/click; khi có anchor trong map cha nhưng owner chuyên biệt khác, resolver ưu tiên owner chuyên biệt.

| Anchor ID thực | Tên hiển thị nguồn | Ý nghĩa/chi tiết hình |
|---|---|---|
| `huff-barrels` | Lối thùng gỗ Hufflepuff | Lối/kết nối hoặc điểm vào trong Fixed |
| `huff-lounge` | Phòng chung Hufflepuff | Room/POI trong artwork Fixed; không dựng map con |
| `huff-dorm-0` | Đường hầm tới khu ngủ | Lối/kết nối hoặc điểm vào trong Fixed |
| `huff-dorm-1` | Đường hầm tới khu ngủ | Lối/kết nối hoặc điểm vào trong Fixed |
| `huff-up` | Lối về tầng trệt | Lối/kết nối hoặc điểm vào trong Fixed |
| `hufflepuff-bed-0` | Giường và rương cá nhân | Anchor/POI hiện hữu trên Fixed |
| `hufflepuff-bed-1` | Giường và rương cá nhân | Anchor/POI hiện hữu trên Fixed |
| `hufflepuff-bed-2` | Giường và rương cá nhân | Anchor/POI hiện hữu trên Fixed |
| `hufflepuff-bed-3` | Giường và rương cá nhân | Anchor/POI hiện hữu trên Fixed |
| `hufflepuff-bed-4` | Giường và rương cá nhân | Anchor/POI hiện hữu trên Fixed |
| `hufflepuff-dorm-return` | Trở về phòng chung. | Room/POI trong artwork Fixed; không dựng map con |

### 2.7. `slytherin-common` — Phòng chung Slytherin

- **Phạm vi:** Phòng chung và khu ngủ Slytherin.
- **Thành phần đã biết:** Cửa đá, khu ngồi, cửa sổ hướng Hồ Đen, góc học và các khu giường/tủ.
- **Cách hiển thị RP/AU:** Giữ Fixed, không dựng lại phòng dưới hồ hay thay đồ nội thất.
- **Định hướng visual:** Chỉ X-Ray công trình thật sự che tag/chân theo depth/occlusion.
- **Anchor từ source: 12 ID.** Mọi ID dưới đây chỉ là đích định vị/click; khi có anchor trong map cha nhưng owner chuyên biệt khác, resolver ưu tiên owner chuyên biệt.

| Anchor ID thực | Tên hiển thị nguồn | Ý nghĩa/chi tiết hình |
|---|---|---|
| `sly-lounge` | Phòng chung Slytherin | Room/POI trong artwork Fixed; không dựng map con |
| `sly-lake` | Cửa sổ nhìn ra Hồ Đen | Địa hình/sân; marker tại anchor hợp lệ |
| `sly-door` | Cửa đá kín | Anchor/POI hiện hữu trên Fixed |
| `sly-study` | Bàn học và tủ sách | Anchor nội thất/điểm chọn, không sửa artwork |
| `sly-dorm` | Hành lang tới khu ngủ | Lối/kết nối hoặc điểm vào trong Fixed |
| `sly-up` | Lối lên tầng trệt | Lối/kết nối hoặc điểm vào trong Fixed |
| `slytherin-bed-0` | Giường và tủ cá nhân | Anchor/POI hiện hữu trên Fixed |
| `slytherin-bed-1` | Giường và tủ cá nhân | Anchor/POI hiện hữu trên Fixed |
| `slytherin-bed-2` | Giường và tủ cá nhân | Anchor/POI hiện hữu trên Fixed |
| `slytherin-bed-3` | Giường và tủ cá nhân | Anchor/POI hiện hữu trên Fixed |
| `slytherin-bed-4` | Giường và tủ cá nhân | Anchor/POI hiện hữu trên Fixed |
| `slytherin-dorm-return` | Trở về phòng chung. | Room/POI trong artwork Fixed; không dựng map con |

### 2.8. `village-static` — Làng Hogsmeade

- **Phạm vi:** Toàn bộ làng Hogsmeade, gồm bên trong tiệm/nhà.
- **Thành phần đã biết:** Đường High Street, quảng trường, ngõ, quán Three Broomsticks, Honeydukes, Zonko, Owl Post, Shrieking Shack, nhà dân. Các nội thất shop là địa điểm/anchor, không phải map mới.
- **Cách hiển thị RP/AU:** AU shop → gán nhà dân trống `v-home-*` ổn định, không ghi đè nhà canon; khi hết chỗ, giữ thông tin và lựa chọn fallback minh bạch, không sửa Fixed.
- **Định hướng visual:** Nhà liền phố/mái/lối đi giữ nguyên SVG và biển/nhãn đúng vị trí nguồn.
- **Anchor từ source: 35 ID.** Mọi ID dưới đây chỉ là đích định vị/click; khi có anchor trong map cha nhưng owner chuyên biệt khác, resolver ưu tiên owner chuyên biệt.

| Anchor ID thực | Tên hiển thị nguồn | Ý nghĩa/chi tiết hình |
|---|---|---|
| `v-home-0` | Nhà dân · Ngõ 0 | Anchor nhà trống, chỉ binding AU ổn định |
| `v-home-1` | Nhà dân · Ngõ 1 | Anchor nhà trống, chỉ binding AU ổn định |
| `v-home-3` | Nhà dân · Ngõ 3 | Anchor nhà trống, chỉ binding AU ổn định |
| `v-home-4` | Nhà dân · Ngõ 4 | Anchor nhà trống, chỉ binding AU ổn định |
| `v-home-6` | Nhà dân · Ngõ 6 | Anchor nhà trống, chỉ binding AU ổn định |
| `v-home-7` | Nhà dân · Ngõ 7 | Anchor nhà trống, chỉ binding AU ổn định |
| `v-home-9` | Nhà dân · Ngõ 9 | Anchor nhà trống, chỉ binding AU ổn định |
| `v-home-11` | Nhà dân · Ngõ 11 | Anchor nhà trống, chỉ binding AU ổn định |
| `v-home-12` | Nhà dân · Ngõ 12 | Anchor nhà trống, chỉ binding AU ổn định |
| `v-home-13` | Nhà dân · Ngõ 13 | Anchor nhà trống, chỉ binding AU ổn định |
| `v-home-14` | Nhà dân · Ngõ 14 | Anchor nhà trống, chỉ binding AU ổn định |
| `v-home-16` | Nhà dân · Ngõ 16 | Anchor nhà trống, chỉ binding AU ổn định |
| `v-home-17` | Nhà dân · Ngõ 17 | Anchor nhà trống, chỉ binding AU ổn định |
| `v-home-18` | Nhà dân · Ngõ 18 | Anchor nhà trống, chỉ binding AU ổn định |
| `v-home-21` | Nhà dân · Ngõ 21 | Anchor nhà trống, chỉ binding AU ổn định |
| `v-home-22` | Nhà dân · Ngõ 22 | Anchor nhà trống, chỉ binding AU ổn định |
| `v-home-23` | Nhà dân · Ngõ 23 | Anchor nhà trống, chỉ binding AU ổn định |
| `v-home-24` | Nhà dân · Ngõ 24 | Anchor nhà trống, chỉ binding AU ổn định |
| `v-home-27` | Nhà dân · Ngõ 27 | Anchor nhà trống, chỉ binding AU ổn định |
| `v-home-28` | Nhà dân · Ngõ 28 | Anchor nhà trống, chỉ binding AU ổn định |
| `v-home-29` | Nhà dân · Ngõ 29 | Anchor nhà trống, chỉ binding AU ổn định |
| `v-home-30` | Nhà dân · Ngõ 30 | Anchor nhà trống, chỉ binding AU ổn định |
| `v-honeydukes` | Tiệm Công tước Mật | Tiệm bánh kẹo: kệ lọ kẹo, quầy bán, lối tới kho/hầm nếu đã có trong template. |
| `v-broomsticks` | Quán Ba Cây Chổi Thần | Quán rượu: quầy phục vụ, bàn ghế khách, phòng trọ; chỉ mô tả, không đắp nội thất lên Fixed. |
| `v-zonkos` | Tiệm giỡn Zonko | Cửa hàng đồ đùa: các kệ món đồ chơi/quầy, khách NPC theo RP. |
| `v-gladrags` | Tiệm trang phục Gladrags | Tiệm/quán trên Fixed, dùng POI/marker |
| `v-post` | Bưu điện cú | Anchor/POI hiện hữu trên Fixed |
| `v-quills` | Tiệm bút lông Scrivenshaft | Tiệm/quán trên Fixed, dùng POI/marker |
| `v-dervish` | Tiệm Dervish và Banges | Tiệm/quán trên Fixed, dùng POI/marker |
| `v-puddifoot` | Quán trà bà Puddifoot | Tiệm/quán trên Fixed, dùng POI/marker |
| `v-hogshead` | Quán Đầu Heo | Quán Hog’s Head: bàn khách, quầy, phòng phụ theo dữ liệu khu. |
| `v-shack` | Lều Hét | Anchor/POI hiện hữu trên Fixed |
| `v-square` | Quảng trường Hogsmeade | Anchor/POI hiện hữu trên Fixed |
| `v-school` | Đường về Hogwarts | Lối/kết nối hoặc điểm vào trong Fixed |
| `v-station` | Đường tới ga Hogsmeade. | Lối/kết nối hoặc điểm vào trong Fixed |

### 2.9. `pitch-static` — Sân Quidditch

- **Phạm vi:** Bên trong sân Quidditch.
- **Thành phần đã biết:** Sân thi đấu, vòng gôn, khán đài, bình luận, phòng thay đồ hai đội, kho chổi và đường phụ. Ngoài ranh giới sân thuộc H1.
- **Cách hiển thị RP/AU:** Phòng thay đồ/kho trong ranh giới vẫn Fixed; không dựng phòng nội thất chồng. Các thử thách bố trí mới không tương thích artwork chuyển sandbox khi cần.
- **Định hướng visual:** Giữ mặt sân, khán đài và các công trình phụ nguyên gốc.
- **Anchor từ source: 14 ID.** Mọi ID dưới đây chỉ là đích định vị/click; khi có anchor trong map cha nhưng owner chuyên biệt khác, resolver ưu tiên owner chuyên biệt.

| Anchor ID thực | Tên hiển thị nguồn | Ý nghĩa/chi tiết hình |
|---|---|---|
| `q-building-0` | Phòng thay đồ · Đội A | Room/POI trong artwork Fixed; không dựng map con |
| `q-building-1` | Phòng thay đồ · Đội B | Room/POI trong artwork Fixed; không dựng map con |
| `q-building-2` | Kho chổi | Anchor/POI hiện hữu trên Fixed |
| `q-commentary` | Bục bình luận | Anchor/POI hiện hữu trên Fixed |
| `q-field` | Sân Quidditch | Mặt sân thi đấu; không thay địa hình Fixed. |
| `q-stand-0-0` | Khán đài 1 | Anchor/POI hiện hữu trên Fixed |
| `q-stand-0-1` | Khán đài 2 | Anchor/POI hiện hữu trên Fixed |
| `q-stand-0-2` | Khán đài 3 | Anchor/POI hiện hữu trên Fixed |
| `q-stand-0-3` | Khán đài 4 | Anchor/POI hiện hữu trên Fixed |
| `q-stand-1-0` | Khán đài 5 | Anchor/POI hiện hữu trên Fixed |
| `q-stand-1-1` | Khán đài 6 | Anchor/POI hiện hữu trên Fixed |
| `q-stand-1-2` | Khán đài 7 | Anchor/POI hiện hữu trên Fixed |
| `q-stand-1-3` | Khán đài 8 | Anchor/POI hiện hữu trên Fixed |
| `q-campus` | Đường về Hogwarts. | Lối/kết nối hoặc điểm vào trong Fixed |

### 2.10. `express` — Ga và tàu Express

- **Phạm vi:** Ga và tàu Hogwarts Express.
- **Thành phần đã biết:** Ga King’s Cross/ga Hogsmeade cùng khu sân ga; khi lên tàu có các toa/buồng, hành lang sát mép và đầu toa. Các buồng có ID `coach-*`.
- **Cách hiển thị RP/AU:** Trong ga/sân ga: chọn `express` với `pcPlace` ở ga; chỉ khi PC đã lên tàu mới đặt ở toa/buồng. Không tự chuyển sang toa khi PC còn trên sân ga.
- **Định hướng visual:** Không thêm tàu/toa nằm trên map ga nếu source không có bố cục đó.
- **Anchor từ source: 34 ID.** Mọi ID dưới đây chỉ là đích định vị/click; khi có anchor trong map cha nhưng owner chuyên biệt khác, resolver ưu tiên owner chuyên biệt.

| Anchor ID thực | Tên hiển thị nguồn | Ý nghĩa/chi tiết hình |
|---|---|---|
| `coach-0-corridor` | Hành lang sát mép toa · Gryffindor | Lối/kết nối hoặc điểm vào trong Fixed |
| `coach-0-room-1` | Gryffindor · Buồng 1 | Room/POI trong artwork Fixed; không dựng map con |
| `coach-0-room-2` | Gryffindor · Buồng 2 | Room/POI trong artwork Fixed; không dựng map con |
| `coach-0-room-3` | Gryffindor · Buồng 3 | Room/POI trong artwork Fixed; không dựng map con |
| `coach-0-room-4` | Gryffindor · Buồng 4 | Room/POI trong artwork Fixed; không dựng map con |
| `coach-0-room-5` | Gryffindor · Buồng 5 | Room/POI trong artwork Fixed; không dựng map con |
| `coach-0-vestibule` | Đầu toa và xe đồ ăn | Anchor/POI hiện hữu trên Fixed |
| `coach-1-corridor` | Hành lang sát mép toa · Hufflepuff | Lối/kết nối hoặc điểm vào trong Fixed |
| `coach-1-room-1` | Hufflepuff · Buồng 1 | Room/POI trong artwork Fixed; không dựng map con |
| `coach-1-room-2` | Hufflepuff · Buồng 2 | Room/POI trong artwork Fixed; không dựng map con |
| `coach-1-room-3` | Hufflepuff · Buồng 3 | Room/POI trong artwork Fixed; không dựng map con |
| `coach-1-room-4` | Hufflepuff · Buồng 4 | Room/POI trong artwork Fixed; không dựng map con |
| `coach-1-room-5` | Hufflepuff · Buồng 5 | Room/POI trong artwork Fixed; không dựng map con |
| `coach-1-vestibule` | Đầu toa và xe đồ ăn | Anchor/POI hiện hữu trên Fixed |
| `coach-2-corridor` | Hành lang sát mép toa · Ravenclaw | Lối/kết nối hoặc điểm vào trong Fixed |
| `coach-2-room-1` | Ravenclaw · Buồng 1 | Room/POI trong artwork Fixed; không dựng map con |
| `coach-2-room-2` | Ravenclaw · Buồng 2 | Room/POI trong artwork Fixed; không dựng map con |
| `coach-2-room-3` | Ravenclaw · Buồng 3 | Room/POI trong artwork Fixed; không dựng map con |
| `coach-2-room-4` | Ravenclaw · Buồng 4 | Room/POI trong artwork Fixed; không dựng map con |
| `coach-2-room-5` | Ravenclaw · Buồng 5 | Room/POI trong artwork Fixed; không dựng map con |
| `coach-2-vestibule` | Đầu toa và xe đồ ăn | Anchor/POI hiện hữu trên Fixed |
| `coach-3-corridor` | Hành lang sát mép toa · Slytherin | Lối/kết nối hoặc điểm vào trong Fixed |
| `coach-3-room-1` | Slytherin · Buồng 1 | Room/POI trong artwork Fixed; không dựng map con |
| `coach-3-room-2` | Slytherin · Buồng 2 | Room/POI trong artwork Fixed; không dựng map con |
| `coach-3-room-3` | Slytherin · Buồng 3 | Room/POI trong artwork Fixed; không dựng map con |
| `coach-3-room-4` | Slytherin · Buồng 4 | Room/POI trong artwork Fixed; không dựng map con |
| `coach-3-room-5` | Slytherin · Buồng 5 | Room/POI trong artwork Fixed; không dựng map con |
| `coach-3-vestibule` | Đầu toa và xe đồ ăn | Anchor/POI hiện hữu trên Fixed |
| `ex-standard` | Toa thường · Ghế dài hai bên | Anchor/POI hiện hữu trên Fixed |
| `ex-kings` | ex-kings | Anchor/POI hiện hữu trên Fixed |
| `ex-station` | ex-station | Anchor/POI hiện hữu trên Fixed |
| `ex-coach-0` | ex-coach-0 | Anchor/POI hiện hữu trên Fixed |
| `ex-coach-1` | ex-coach-1 | Anchor/POI hiện hữu trên Fixed |
| `ex-coach-2` | ex-coach-2. | Anchor/POI hiện hữu trên Fixed |

### 2.11. `diagon-knockturn` — Hẻm Xéo & Knockturn

- **Phạm vi:** Toàn bộ Diagon Alley và Knockturn Alley.
- **Thành phần đã biết:** Phố/nhà/tiệm/nhánh ngõ gồm Leaky Cauldron, Gringotts, Ollivanders, Flourish & Blotts, WWW, Borgin & Burkes và các nhà trống.
- **Cách hiển thị RP/AU:** AU shop đúng hẻm → gán `da-terrace-*` hoặc `ka-block-*`; không ghi đè cửa tiệm canon. Dùng `region=diagon|knockturn` để không nhầm hẻm.
- **Định hướng visual:** Giữ đúng artwork nhà phố, ngõ, biển hiệu và anchor hiện tại.
- **Anchor từ source: 71 ID.** Mọi ID dưới đây chỉ là đích định vị/click; khi có anchor trong map cha nhưng owner chuyên biệt khác, resolver ưu tiên owner chuyên biệt.

| Anchor ID thực | Tên hiển thị nguồn | Ý nghĩa/chi tiết hình |
|---|---|---|
| `da-potage` | Tiệm vạc Potage | Tiệm/quán trên Fixed, dùng POI/marker |
| `da-malkin` | Tiệm áo chùng của phu nhân Malkin | Tiệm/quán trên Fixed, dùng POI/marker |
| `da-ollivanders` | Tiệm đũa phép Ollivanders | Tiệm đũa: tủ/hộp đũa và quầy thử; không tự bật diễn biến. |
| `da-scribbulus` | Văn phòng phẩm Scribbulus | Room/POI trong artwork Fixed; không dựng map con |
| `da-eeylops` | Tiệm cú Eeylops | Tiệm/quán trên Fixed, dùng POI/marker |
| `da-flourish` | Tiệm sách Phú Quý và Cơ Hàn | Hiệu sách: giá sách, bàn sách/quầy; không mở detail map tự động. |
| `da-house-a` | Số 47 · Tiệm đóng sách | Tiệm/quán trên Fixed, dùng POI/marker |
| `da-quidditch` | Tiệm dụng cụ Quidditch cao cấp | Tiệm/quán trên Fixed, dùng POI/marker |
| `da-menagerie` | Tiệm sinh vật huyền bí | Tiệm/quán trên Fixed, dùng POI/marker |
| `da-twilfitt` | Tiệm trang phục Twilfitt và Tatting | Tiệm/quán trên Fixed, dùng POI/marker |
| `da-gambol` | Tiệm đồ giỡn Gambol và Japes | Tiệm/quán trên Fixed, dùng POI/marker |
| `da-apothecary` | Tiệm bào chế độc dược | Tiệm nguyên liệu độc dược: chai, lọ và quầy; chỉ giữ thành metadata mô tả. |
| `da-goods` | Tiệm đồ cũ | Tiệm/quán trên Fixed, dùng POI/marker |
| `da-print` | Tiệm bản in và giấy da | Tiệm/quán trên Fixed, dùng POI/marker |
| `da-weasleys` | Tiệm giỡn của anh em Weasley | Cửa hàng WWW: trưng bày đồ giỡn, cầu thang/đầu gian nếu bản Fixed có. |
| `da-tailor` | Tiệm áo choàng du hành | Tiệm/quán trên Fixed, dùng POI/marker |
| `da-optics` | Tiệm kính thiên văn và dụng cụ | Tiệm/quán trên Fixed, dùng POI/marker |
| `da-gold` | Tiệm kim hoàn bạc | Tiệm/quán trên Fixed, dùng POI/marker |
| `da-stationery` | Tiệm giấy da và bút lông | Tiệm/quán trên Fixed, dùng POI/marker |
| `da-leaky` | Quán Cái Vạc Lủng | Quán Leaky Cauldron: quầy, lối phòng trọ và cửa vào hẻm. |
| `da-brick-gateway` | Cổng gạch sau Cái Vạc Lủng | Anchor/POI hiện hữu trên Fixed |
| `da-gringotts` | Ngân hàng Gringotts | Ngân hàng: quầy giao dịch, khu an ninh và kho hầm như marker, không sinh kho con. |
| `ka-stair` | Lối xuống Knockturn | Lối/kết nối hoặc điểm vào trong Fixed |
| `ka-block-0` | Nhà dân | Anchor nhà trống, chỉ binding AU ổn định |
| `ka-block-1` | Nhà dân | Anchor nhà trống, chỉ binding AU ổn định |
| `ka-block-2` | Nhà dân | Anchor nhà trống, chỉ binding AU ổn định |
| `ka-block-3` | Nhà dân | Anchor nhà trống, chỉ binding AU ổn định |
| `ka-block-4` | Nhà dân | Anchor nhà trống, chỉ binding AU ổn định |
| `ka-block-5` | Nhà dân | Anchor nhà trống, chỉ binding AU ổn định |
| `ka-block-6` | Nhà dân | Anchor nhà trống, chỉ binding AU ổn định |
| `ka-block-7` | Nhà dân | Anchor nhà trống, chỉ binding AU ổn định |
| `ka-block-8` | Nhà dân | Anchor nhà trống, chỉ binding AU ổn định |
| `ka-block-9` | Nhà dân | Anchor nhà trống, chỉ binding AU ổn định |
| `ka-block-10` | Nhà dân | Anchor nhà trống, chỉ binding AU ổn định |
| `ka-block-11` | Nhà dân | Anchor nhà trống, chỉ binding AU ổn định |
| `ka-block-12` | Nhà dân | Anchor nhà trống, chỉ binding AU ổn định |
| `ka-block-13` | Nhà dân | Anchor nhà trống, chỉ binding AU ổn định |
| `ka-block-14` | Nhà dân | Anchor nhà trống, chỉ binding AU ổn định |
| `ka-block-15` | Nhà dân | Anchor nhà trống, chỉ binding AU ổn định |
| `ka-entrance` | Số 2 · Tiệm đồ lạ cũ | Tiệm/quán trên Fixed, dùng POI/marker |
| `ka-candles` | Tiệm nến và đồ lạ | Tiệm/quán trên Fixed, dùng POI/marker |
| `ka-upper` | Tiệm cầm đồ cũ | Tiệm/quán trên Fixed, dùng POI/marker |
| `ka-borgin` | Tiệm Borgin và Burkes | Tiệm/quán trên Fixed, dùng POI/marker |
| `ka-relics` | Tiệm di vật và đồ cổ | Tiệm/quán trên Fixed, dùng POI/marker |
| `ka-gloom` | Cửa tiệm đóng cửa | Tiệm/quán trên Fixed, dùng POI/marker |
| `ka-bones` | Tiệm đồ kỳ lạ | Tiệm/quán trên Fixed, dùng POI/marker |
| `ka-dealer` | Tiệm sách cổ | Tiệm/quán trên Fixed, dùng POI/marker |
| `ka-end` | Kho khóa kín | Anchor/POI hiện hữu trên Fixed |
| `ka-corner` | Tiệm đồ bạc và đồ lạ | Tiệm/quán trên Fixed, dùng POI/marker |
| `da-fortescue` | Tiệm kem Florean Fortescue | Tiệm/quán trên Fixed, dùng POI/marker |
| `da-robe-used` | Tiệm áo chùng cũ | Tiệm/quán trên Fixed, dùng POI/marker |
| `da-remedies` | Tiệm thảo dược | Tiệm/quán trên Fixed, dùng POI/marker |
| `da-obscurus` | Tiệm sách Obscurus | Tiệm/quán trên Fixed, dùng POI/marker |
| `da-wizardwear` | Tiệm trang phục phù thủy | Tiệm/quán trên Fixed, dùng POI/marker |
| `da-workshop` | Tiệm sửa vạc | Tiệm/quán trên Fixed, dùng POI/marker |
| `da-cafe` | Tiệm trà và cà phê | Tiệm/quán trên Fixed, dùng POI/marker |
| `da-terrace-7` | Nhà dân | Anchor nhà trống, chỉ binding AU ổn định |
| `da-terrace-8` | Nhà dân | Anchor nhà trống, chỉ binding AU ổn định |
| `da-terrace-9` | Nhà dân | Anchor nhà trống, chỉ binding AU ổn định |
| `da-terrace-10` | Nhà dân | Anchor nhà trống, chỉ binding AU ổn định |
| `da-terrace-11` | Nhà dân | Anchor nhà trống, chỉ binding AU ổn định |
| `da-terrace-12` | Nhà dân | Anchor nhà trống, chỉ binding AU ổn định |
| `da-terrace-13` | Nhà dân | Anchor nhà trống, chỉ binding AU ổn định |
| `da-terrace-14` | Nhà dân | Anchor nhà trống, chỉ binding AU ổn định |
| `da-terrace-15` | Nhà dân | Anchor nhà trống, chỉ binding AU ổn định |
| `da-terrace-16` | Nhà dân | Anchor nhà trống, chỉ binding AU ổn định |
| `da-terrace-17` | Nhà dân | Anchor nhà trống, chỉ binding AU ổn định |
| `da-terrace-18` | Nhà dân | Anchor nhà trống, chỉ binding AU ổn định |
| `da-terrace-19` | Nhà dân | Anchor nhà trống, chỉ binding AU ổn định |
| `da-terrace-20` | Nhà dân | Anchor nhà trống, chỉ binding AU ổn định |
| `da-terrace-21` | Nhà dân. | Anchor nhà trống, chỉ binding AU ổn định |

### 2.12. `ministry2` — Bộ Pháp thuật L1–L7

- **Phạm vi:** Ministry of Magic tầng 1–7.
- **Thành phần đã biết:** Mỗi tầng đại diện một nhóm cơ quan: Bộ trưởng, thực thi luật, tai nạn ma thuật, sinh vật, hợp tác quốc tế, giao thông, thể thao.
- **Cách hiển thị RP/AU:** Chọn đúng tầng; phòng ban nằm trong phạm vi tầng Fixed, không mở sơ đồ nội thất mới.
- **Định hướng visual:** Giữ layout/tầng của template, thêm đúng marker/cửa tương tác.
- **Anchor từ source: 7 ID.** Mọi ID dưới đây chỉ là đích định vị/click; khi có anchor trong map cha nhưng owner chuyên biệt khác, resolver ưu tiên owner chuyên biệt.

| Anchor ID thực | Tên hiển thị nguồn | Ý nghĩa/chi tiết hình |
|---|---|---|
| `min-level-1` | Tầng 1 · Bộ trưởng | Khối công trình/tầng đã phủ Fixed |
| `min-level-2` | Tầng 2 · Thi hành Luật Pháp thuật | Khối công trình/tầng đã phủ Fixed |
| `min-level-3` | Tầng 3 · Tai nạn và Thảm họa Pháp thuật | Khối công trình/tầng đã phủ Fixed |
| `min-level-4` | Tầng 4 · Điều hòa và Kiểm soát Sinh vật | Khối công trình/tầng đã phủ Fixed |
| `min-level-5` | Tầng 5 · Hợp tác Pháp thuật Quốc tế | Khối công trình/tầng đã phủ Fixed |
| `min-level-6` | Tầng 6 · Giao thông Pháp thuật | Khối công trình/tầng đã phủ Fixed |
| `min-level-7` | Tầng 7 · Trò chơi và Thể thao Pháp thuật. | Khối công trình/tầng đã phủ Fixed |

### 2.13. `ministry-8-10` — Bộ Pháp thuật L8–L10

- **Phạm vi:** Ministry of Magic tầng 8–10.
- **Thành phần đã biết:** Tầng 8 Atrium, mạng Floo, bảo vệ; tầng 9 Department of Mysteries có rotunda và các phòng đặc thù; tầng 10 phòng xử án và hỗ trợ.
- **Cách hiển thị RP/AU:** Chọn đúng tầng và anchor `mm-*`; không mở phòng con trên template. Muggle-Born Registration Commission chưa có tầng nguồn xác nhận nên không tự đặt.
- **Định hướng visual:** Giữ các anchor Floo/thang/phòng theo bản Fixed, không tự tái dựng.
- **Anchor từ source: 32 ID.** Mọi ID dưới đây chỉ là đích định vị/click; khi có anchor trong map cha nhưng owner chuyên biệt khác, resolver ưu tiên owner chuyên biệt.

| Anchor ID thực | Tên hiển thị nguồn | Ý nghĩa/chi tiết hình |
|---|---|---|
| `mm-floo-in-0` | Mạng Floo · Lối đến 1 | Lối/kết nối hoặc điểm vào trong Fixed |
| `mm-floo-out-0` | Mạng Floo · Lối đi 1 | Lối/kết nối hoặc điểm vào trong Fixed |
| `mm-floo-in-1` | Mạng Floo · Lối đến 2 | Lối/kết nối hoặc điểm vào trong Fixed |
| `mm-floo-out-1` | Mạng Floo · Lối đi 2 | Lối/kết nối hoặc điểm vào trong Fixed |
| `mm-floo-in-2` | Mạng Floo · Lối đến 3 | Lối/kết nối hoặc điểm vào trong Fixed |
| `mm-floo-out-2` | Mạng Floo · Lối đi 3 | Lối/kết nối hoặc điểm vào trong Fixed |
| `mm-floo-in-3` | Mạng Floo · Lối đến 4 | Lối/kết nối hoặc điểm vào trong Fixed |
| `mm-floo-out-3` | Mạng Floo · Lối đi 4 | Lối/kết nối hoặc điểm vào trong Fixed |
| `mm-floo-in-4` | Mạng Floo · Lối đến 5 | Lối/kết nối hoặc điểm vào trong Fixed |
| `mm-floo-out-4` | Mạng Floo · Lối đi 5 | Lối/kết nối hoặc điểm vào trong Fixed |
| `mm-floo-in-5` | Mạng Floo · Lối đến 6 | Lối/kết nối hoặc điểm vào trong Fixed |
| `mm-floo-out-5` | Mạng Floo · Lối đi 6 | Lối/kết nối hoặc điểm vào trong Fixed |
| `mm-fountain` | Đài phun Huynh đệ Pháp thuật | Anchor/POI hiện hữu trên Fixed |
| `mm-visitor` | Lối vào dành cho khách · Luân Đôn | Lối/kết nối hoặc điểm vào trong Fixed |
| `mm-security` | Bàn kiểm tra an ninh | Anchor nội thất/điểm chọn, không sửa artwork |
| `mm-lift-8` | Thang máy · Tầng 8 → 9 | Lối/kết nối hoặc điểm vào trong Fixed |
| `mm-up` | Thang máy · Bộ tầng 1–7 | Lối/kết nối hoặc điểm vào trong Fixed |
| `mm-time` | Phòng Thời gian | Phòng Thời gian; điểm neo/POI trong Fixed, không tạo hiệu ứng tự phát. |
| `mm-prophecy` | Phòng Tiên tri | Phòng Tiên tri ở Bộ Bí mật, phân biệt Divination Classroom Hogwarts. |
| `mm-death` | Phòng Tử thần | Phòng Tử thần ở Bộ Bí mật; không tự tiết lộ RP. |
| `mm-brain` | Phòng Não | Room/POI trong artwork Fixed; không dựng map con |
| `mm-space` | Phòng Không gian | Room/POI trong artwork Fixed; không dựng map con |
| `mm-love` | Phòng Tình yêu · Khóa kín | Room/POI trong artwork Fixed; không dựng map con |
| `mm-rotunda` | Phòng xoay · Mười hai cửa | Room/POI trong artwork Fixed; không dựng map con |
| `mm-lift-9` | Thang máy · Tầng 9 → Tiền sảnh | Lối/kết nối hoặc điểm vào trong Fixed |
| `mm-stairs-9` | Cầu thang · Tầng 9 → 10 | Lối/kết nối hoặc điểm vào trong Fixed |
| `mm-court` | Phòng xử án số Mười · Hội đồng Wizengamot | Room/POI trong artwork Fixed; không dựng map con |
| `mm-accused` | Ghế bị cáo | Anchor/POI hiện hữu trên Fixed |
| `mm-waiting` | PHÒNG CHỜ | Room/POI trong artwork Fixed; không dựng map con |
| `mm-office` | KHU HỖ TRỢ | Anchor/POI hiện hữu trên Fixed |
| `mm-escort` | TUYẾN ÁP GIẢI | Anchor/POI hiện hữu trên Fixed |
| `mm-stairs-10` | Cầu thang · Tầng 10 → 9. | Lối/kết nối hoặc điểm vào trong Fixed |

## 3. Recipe/layout & asset — bảng gán công năng

Mỗi recipe là **bộ nguyên liệu mặc định**, không phải prefab ép nguyên vào mọi cảnh. `assets/recipes.json` giữ `w/h`, `minW/minH`, material, cửa, tag và `instances[]`; `assets/catalog.json` cung cấp SVG theo ID. Bảng dưới là bảng tra công năng chính xác 49 ID đã kiểm qua metadata nguồn; số instance chỉ là số bản ghi gốc, không phải giới hạn RP.

| ID `recipe` thật | Mẫu phòng/khu dùng lại | Kích thước nguồn | Instance | Nội thất/cảnh quan chính — chỉ dẫn khi Generated |
|---|---|---:|---:|---|
| `HEADMASTER_OFFICE` | Văn phòng Hiệu trưởng | 900×630 | 43 | Ba gian tròn liên thông; bàn gỗ chạm và ghế chủ, tủ sách cong theo tường, chân dung, thiết bị bạc, khu Pensieve và tủ ký ức. |
| `DIVINATION_CLASSROOM` | Phòng Tiên tri | 620×620 | 17 | Phòng tháp ấm, bàn trà nhỏ, ghế đệm, tách trà, quả cầu pha lê, rèm và giá sách bố trí theo cung. |
| `ASTRONOMY_OBSERVATORY` | Lớp thiên văn/đài quan sát | 720×660 | 7 | Sàn quan sát tương đối thoáng, kính thiên văn đồng, vòng chia độ, bản đồ sao, bàn ghi chép và tủ dụng cụ. |
| `PREFECTS_BATHROOM` | Phòng tắm Huynh trưởng | 820×600 | 13 | Bể tắm xây bậc, vòi kim loại, tranh kính, khu thay đồ; giữ khoảng trống quanh hồ tắm. |
| `ROOM_OF_REQUIREMENT` | Phòng Yêu Cầu | 850×650 | 7 | Không gian thay hình theo RP: tập luyện, họp, trú ẩn hoặc kho; không đóng cứng một inventory. |
| `CHAMBER_OF_SECRETS` | Phòng chứa Bí mật | 850×1450 | 11 | Trục dài, cột họa tiết rắn, rãnh nước, tượng Slytherin, cửa cuối gian; không dùng lớp học thông thường. |
| `TOWER_CLOCKWORK` | Cơ cấu tháp đồng hồ/chuông | 700×700 | 4 | Bánh răng, truyền động, khung đỡ, quả lắc; phiên bản tháp chuông có gông/chuông treo. |
| `BALLROOM` | Đại sảnh khiêu vũ | 1200×850 | 25 | Khoảng sàn trống để khiêu vũ, bục nhạc, bàn tiệc ở rìa, decor theo sự kiện RP. |
| `TROPHY_ROOM` | Phòng cúp | 650×420 | 11 | Tủ Gothic, cúp nhiều dáng, huy chương, khiên và đảo trưng bày kính thấp. |
| `CLASSROOM` | Phòng học | 600×420 | 21 | Bảng, bàn giảng viên, dãy bàn/ghế học sinh và giá dụng cụ; có thể đổi số lượng/bố cục. |
| `MAGIC_PRACTICE` | Phòng thực hành phép | 640×480 | 7 | Vùng tập thoáng, bia tập, giá đũa/vật luyện, băng ghế sát mép. |
| `POTIONS_LAB` | Lớp/phòng Độc dược | 640×480 | 20 | Bàn vạc và khu thao tác, chai lọ nguyên liệu, giá kệ, chậu rửa; giữ lối đi an toàn. |
| `RESEARCH_LAB` | Phòng nghiên cứu | 520×400 | 9 | Bàn nghiên cứu, dụng cụ chuyên môn, bản đồ/sổ sách, kệ mẫu vật. |
| `OFFICE` | Văn phòng | 360×300 | 9 | Bàn làm việc, ghế chủ và ghế khách, tủ tài liệu, lò sưởi nếu phù hợp. |
| `STUDY_ROOM` | Phòng tự học/đọc | 440×340 | 17 | Nhóm bàn đọc, đèn, kệ sách và ghế; chừa lối yên tĩnh giữa các nhóm. |
| `MEETING_CLUB` | Phòng họp/CLB | 520×400 | 11 | Bàn họp/hoạt động, ghế xung quanh, bảng tin và tủ vật dụng. |
| `LIBRARY` | Thư viện | 900×640 | 16 | Dãy kệ, các bàn đọc, thang lấy sách, quầy quản lý, khoảng đi giữa dãy. |
| `ARCHIVE` | Kho lưu trữ | 480×360 | 8 | Tủ hồ sơ, kệ tư liệu, bàn tra cứu, nhãn kệ và đường tiếp cận. |
| `STORAGE` | Kho vật dụng | 360×300 | 8 | Kệ, thùng, hòm/rương và khoảng đi; không đặt kín lối cửa. |
| `WORKSHOP` | Xưởng | 520×400 | 7 | Bàn chế tác, bảng treo công cụ, nguyên liệu, khu thử/đồ nghề. |
| `GALLERY` | Trưng bày | 640×400 | 8 | Tranh/tượng/áo giáp, tủ kính, lối xem; đồ tường không chiếm sàn độc lập. |
| `MUSIC_ROOM` | Phòng nhạc | 560×420 | 8 | Nhạc cụ, giá bản nhạc, ghế luyện tập và khu trình diễn nhỏ. |
| `LOUNGE` | Phòng sinh hoạt/nghỉ | 520×400 | 8 | Ghế sofa/ghế bành theo nhóm, bàn trà, lò sưởi nếu hợp cảnh, góc đọc. |
| `BEDROOM` | Phòng ngủ | 360×300 | 8 | Giường, tủ, rương cá nhân, bàn đầu giường và bàn viết tùy người ở. |
| `KITCHEN` | Bếp | 560×440 | 9 | Bếp nấu, bàn sơ chế, chậu rửa, kệ dụng cụ và thực phẩm. |
| `DINING_ROOM` | Phòng ăn | 520×360 | 17 | Bàn ăn, ghế phù hợp số người, tủ bát và đèn. |
| `BATHROOM` | Phòng tắm/vệ sinh | 320×260 | 6 | Bồn/khay tắm, chậu rửa, nơi để khăn, vách bảo đảm riêng tư. |
| `LAUNDRY` | Phòng giặt | 400×300 | 6 | Bồn giặt, giá phơi/sấy, bàn gấp đồ và kệ khăn vải. |
| `HOSPITAL_WARD` | Bệnh xá | 800×520 | 15 | Giường bệnh, rèm ngăn, tủ thuốc, bàn y tế và trục lưu thông. |
| `RECEPTION` | Sảnh tiếp đón | 480×340 | 10 | Quầy, ghế chờ, bảng tin, chỗ đứng/trao đổi. |
| `GUARDROOM` | Phòng trực | 320×280 | 6 | Bàn trực, sổ, tủ khóa, giá dụng cụ và tầm quan sát cửa. |
| `PASSAGE_PROPS` | Nội thất hành lang | 480×160 | 6 | Đèn, tranh, ghế băng, tượng/hốc tường ở rìa; giữ lối đi và cửa. |
| `UTILITY_ROOM` | Phòng kỹ thuật | 440×340 | 4 | Ống, van, lò, máy móc, tủ đồ bảo trì; rõ vùng thiết bị. |
| `SECURE_VAULT` | Kho bảo mật | 440×360 | 7 | Cửa gia cố, rương/tủ khóa, bệ đặt đồ và vùng kiểm soát. |
| `DETENTION_CELL` | Phòng giam | 240×200 | 4 | Giường đơn, ghế, vật dụng tối giản, cửa/hàng rào đúng công năng. |
| `PUBLIC_COUNTER` | Quầy hàng/tiệm nhỏ | 560×400 | 12 | Quầy phục vụ, kệ hàng, bàn/ghế khách; hàng hóa theo loại tiệm. |
| `CEREMONY_HALL` | Phòng nghi lễ | 720×480 | 10 | Bục, bàn nghi lễ, ghế/băng dài và trục đi giữa. |
| `ENTRANCE_VESTIBULE` | Tiền sảnh | 640×460 | 6 | Lối vào thoáng, bảng chỉ dẫn, ghế/tủ hai bên, cửa liên thông. |
| `CLOAKROOM_LOCKERS` | Tủ đồ/áo khoác | 520×380 | 8 | Tủ, móc, gương và ghế thay trang phục. |
| `ART_CARTOGRAPHY_STUDIO` | Phòng vẽ/bản đồ | 660×480 | 10 | Bàn bản vẽ, giá giấy, tủ bản đồ, dụng cụ mỹ thuật, vùng thao tác. |
| `GAMES_ROOM` | Phòng trò chơi | 620×460 | 8 | Bàn cờ/giải trí, ghế xem, tủ quân cờ và khu Gobstones. |
| `OUT_COURTYARD` | Sân trong | 1000×760 | 4 | Sân lát/đất, trục đường đi, cây bồn, ghế nghỉ, đài phun nếu RP có. |
| `OUT_GARDEN` | Vườn/khu nghỉ | 1000×760 | 8 | Luống hoa, đường dạo, cây/giàn nghỉ, chỗ ngồi và khoảng cỏ. |
| `OUT_LAWN` | Sân cỏ/hoạt động | 1000×760 | 9 | Mặt cỏ rộng, đường đi và ghế/đồ dùng ở mép, khoảng trống làm sự kiện. |
| `OUT_WOODLAND` | Bìa rừng/đường mòn | 1000×760 | 18 | Lối mòn, cụm cây, bụi, đá, khoảng trống nhỏ theo địa hình. |
| `OUT_WATERSIDE` | Ven sông/hồ | 1000×760 | 4 | Đường bờ, nước, lối dạo, bến nhỏ và khu nghỉ; nước là vùng cấm đặt chân. |
| `OUT_BUILDING_YARD` | Nhà và sân phụ | 1000×760 | 6 | Khối công trình, khoảng sân, hàng rào, lối phụ, vườn sau. |
| `OUT_CAMP` | Trại/nơi trú | 1000×760 | 7 | Lều, chỗ ngủ, đồ trại, kho tiếp tế, lối đi trên đất/cỏ. |
| `OUT_SERVICE_GARDEN` | Vườn trồng/sân làm việc | 1000×760 | 6 | Luống cây, dụng cụ, chậu nước, bàn thao tác và kho nhỏ. |

**Ánh xạ 41 từ ngắn cho Gemini (đã có trong `assets/vocabulary.json`):**

`headmaster`→`HEADMASTER_OFFICE` · `divination`→`DIVINATION_CLASSROOM` · `astronomy`→`ASTRONOMY_OBSERVATORY` · `prefects_bath`→`PREFECTS_BATHROOM` · `requirement`→`ROOM_OF_REQUIREMENT` · `chamber`→`CHAMBER_OF_SECRETS` · `clockwork`→`TOWER_CLOCKWORK` · `ballroom`→`BALLROOM`
`trophy`→`TROPHY_ROOM` · `classroom`→`CLASSROOM` · `practice`→`MAGIC_PRACTICE` · `potions`→`POTIONS_LAB` · `research`→`RESEARCH_LAB` · `office`→`OFFICE` · `study`→`STUDY_ROOM` · `meeting`→`MEETING_CLUB`
`library`→`LIBRARY` · `archive`→`ARCHIVE` · `storage`→`STORAGE` · `workshop`→`WORKSHOP` · `gallery`→`GALLERY` · `music`→`MUSIC_ROOM` · `lounge`→`LOUNGE` · `bedroom`→`BEDROOM`
`kitchen`→`KITCHEN` · `dining`→`DINING_ROOM` · `bathroom`→`BATHROOM` · `laundry`→`LAUNDRY` · `infirmary`→`HOSPITAL_WARD` · `reception`→`RECEPTION` · `guardroom`→`GUARDROOM` · `corridor`→`PASSAGE_PROPS`
`utility`→`UTILITY_ROOM` · `vault`→`SECURE_VAULT` · `cell`→`DETENTION_CELL` · `shop`→`PUBLIC_COUNTER` · `ceremony`→`CEREMONY_HALL` · `entrance`→`ENTRANCE_VESTIBULE` · `cloakroom`→`CLOAKROOM_LOCKERS` · `art`→`ART_CARTOGRAPHY_STUDIO`
`games`→`GAMES_ROOM`

**Quy tắc dùng recipe:** (1) xem room đã có `type` thực thì dùng; (2) type trống thì suy theo `name`/công năng và ghi rõ chỉ là gợi ý; (3) recipe cung cấp cụm/vật nền; RP có thể đổi số lượng, chia/tách cụm, kích thước, vật liệu, vị trí, đồ bổ sung; (4) không tự thêm bàn/ghế khi RP không có hoặc khi recipe đã đặt đủ; (5) các phòng đặc thù dùng đúng recipe đặc thù nếu có, nhưng hình học cần thích nghi; (6) vật lạ có thể gửi hình dạng có cấu trúc/ghép từ catalog, cuối cùng dùng icon/shape trung tính đúng tên; không biến vật lạ thành đồ khác.

### 3.1. Định hướng sử dụng catalog mà không thêm prompt

Trong GitHub, đối chiếu `room.type` → recipe → `instances[].item` → catalog SVG, sau đó mount/scale theo vùng phòng, sàn, bề mặt, tường, cửa. Mọi alias `wm.*`/ID ngắn và asset bổ sung từ layout phải giữ tham chiếu. Không dùng tên asset làm ràng buộc Gemini. Nếu recipe có một cụm bàn với các vật trên bàn, giữ quan hệ đồ con; thay đổi props phải cập nhật/đếm đúng instance, không nhân đôi cụm và không vẽ đồ extras thành dải ở mép bản đồ.

## 4. Hogwarts không Fixed — 52 cluster, 242 phòng

**Nguyên tắc:** Một cluster có các room thực được dựng **đủ tất cả phòng trong source**, cộng những phòng/vật RP thật sự bổ sung. `layout` chỉ là hình nền tổ chức, được đổi kích thước/tỉ lệ/nhánh cho hợp RP. Trường `recipe` ghi `nguồn` khi có ID trong Atlas hiện hành; mục `gợi ý` KHÔNG phải binding hiện hữu. Các nhãn tầng/hướng `F1=Ground Floor` và mã phòng có dấu tiếng Việt giữ nguyên.

### 4.1. HẦM NGẦM — 4 cluster

**Kiến trúc/sắc thái minh họa chung:** Kết cấu ngầm đá tối, nền gạch/đá, lối hẹp và cửa nặng; phòng thử thách/chốt bí mật chỉ tạo hình theo kiến thức PC được biết.

#### `SUB-DUNGEONS-N` — N Tech Tunnels · layout `vertical`

**Kết cấu:** Trục dọc; cửa, cửa sổ và nội thất sát vách theo chiều dài. **Phòng nguồn:** 4. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `SUB-DUNGEONS-N:01` | Stone Corridor under Astronomy Tower | `PASSAGE_PROPS` · nguồn | Lối chuyển tầng/giữa tháp; bậc và tay vịn hoặc nhịp hành lang theo địa hình, đèn/tranh sát vách; cửa thông rõ ràng. |
| `SUB-DUNGEONS-N:02` | Alchemy Room | —; gợi ý `STUDY_ROOM` (minh họa) | Nhóm bàn đọc, đèn, kệ sách và ghế; chừa lối yên tĩnh giữa các nhóm. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `SUB-DUNGEONS-N:03` | Coal/Fuel Store | `STORAGE` · nguồn | Kệ/rương/thùng theo vật liệu lưu trữ của phòng; chừa lối giữa kệ và khoảng thao tác cạnh cửa. |
| `SUB-DUNGEONS-N:04` | Tower Foundation Check Room | —; gợi ý `STUDY_ROOM` (minh họa) | Mặt bằng tháp với mảng cong/giếng cao, bệ máy hoặc đài quan sát tùy công năng; giữ lối tiếp cận/lan can. |

#### `SUB-DUNGEONS-E` — E Relic Vaults · layout `ell`

**Kết cấu:** Hai nhánh tạo góc chữ L, phòng phân bố theo nhánh. **Phòng nguồn:** 4. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `SUB-DUNGEONS-E:01` | Chamber of Secrets Pipe | —; gợi ý `CEREMONY_HALL` (minh họa) | Lối ống dẫn dốc/hẹp nối khu trên với không gian sâu; thể hiện miệng ống và chuyển cấp, không giả thành phòng học. |
| `SUB-DUNGEONS-E:02` | Chamber of Secrets | `CHAMBER_OF_SECRETS` · nguồn | Gian đá kéo dài theo trục, hàng cột hình rắn, rãnh nước và tượng ở cuối, khoảng sàn trống là trung tâm. |
| `SUB-DUNGEONS-E:03` | Ancient Vault Gatehouse | `GUARDROOM` · nguồn | Không gian chuyển tiếp, cửa và mảng tường định hướng, lối đi chính mở; quầy/ghế chờ hoặc giá treo nếu đúng tên phòng. |
| `SUB-DUNGEONS-E:04` | Sealed Vault Corridor | `PASSAGE_PROPS` · nguồn | Trục lưu thông thuộc cụm; sàn/đường đi liền mạch, cửa đến phòng liên quan, đèn/tranh/ghế rìa; không để vật trang trí bít cửa. |

#### `SUB-DUNGEONS-S` — S Y1 Stone Chambers · layout `horizontal`

**Kết cấu:** Hành lang ngang, các phòng ở hai bên; co giãn độ dài theo số phòng. **Phòng nguồn:** 5. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `SUB-DUNGEONS-S:01` | Devil's Snare | —; gợi ý `MAGIC_PRACTICE` (minh họa) | Hố/không gian dây leo vây quanh, vùng cây là chướng ngại trang trí, chỉ minh họa cấu trúc thử thách theo RP. |
| `SUB-DUNGEONS-S:02` | Flying Keys | —; gợi ý `MAGIC_PRACTICE` (minh họa) | Gian cao thoáng có cửa/đích đến, chìa khóa bay nếu RP đang có; giá chổi hoặc vật hỗ trợ chỉ theo tình huống. |
| `SUB-DUNGEONS-S:03` | Wizard's Chess | `GAMES_ROOM` · nguồn | Sàn ô cờ lớn và các quân kích thước công trình; vùng di chuyển dựa trên cảnh RP, không tự chạy gameplay. |
| `SUB-DUNGEONS-S:04` | Potions Trial | `POTIONS_LAB` · nguồn | Bàn vạc và khu thao tác, chai lọ nguyên liệu, giá kệ, chậu rửa; giữ lối đi an toàn. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `SUB-DUNGEONS-S:05` | Final Mirror Chamber | —; gợi ý `GALLERY` (minh họa) | Gian đá có gương làm điểm nhấn và lối vào rõ; nội dung gương không tự tiết lộ bí mật. |

#### `SUB-DUNGEONS-W` — W Ancient Study · layout `tee`

**Kết cấu:** Trục chính và một nhánh chữ T, nhường nút giao thông thoáng. **Phòng nguồn:** 4. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `SUB-DUNGEONS-W:01` | Map Chamber | `ART_CARTOGRAPHY_STUDIO` · nguồn | Bàn bản vẽ, giá giấy, tủ bản đồ, dụng cụ mỹ thuật, vùng thao tác. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `SUB-DUNGEONS-W:02` | Undercroft | —; gợi ý `STORAGE` (minh họa) | Kệ, thùng, hòm/rương và khoảng đi; không đặt kín lối cửa. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `SUB-DUNGEONS-W:03` | Archaeological Tool Store | `STORAGE` · nguồn | Kệ/rương/thùng theo vật liệu lưu trữ của phòng; chừa lối giữa kệ và khoảng thao tác cạnh cửa. |
| `SUB-DUNGEONS-W:04` | Blueprint Room | `ART_CARTOGRAPHY_STUDIO` · nguồn | Bàn bản vẽ, giá giấy, tủ bản đồ, dụng cụ mỹ thuật, vùng thao tác. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |

### 4.2. HẦM NGỤC — 4 cluster

**Kiến trúc/sắc thái minh họa chung:** Tường đá, sàn tối, khung cửa kiên cố; phân biệt khu lớp/kho với tuyến Slytherin Fixed.

#### `DUNGEONS-N` — N Potions Cluster · layout `cross`

**Kết cấu:** Bốn nhánh gặp nhau ở tâm, lối nối trung tâm thông thoáng. **Phòng nguồn:** 5. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `DUNGEONS-N:01` | Potions Classroom | `POTIONS_LAB` · nguồn | Các dãy bàn đặt vạc hướng về bàn giáo viên; kệ lọ nguyên liệu men theo tường, chậu rửa ở một rìa, khoảng giữa không bị chắn. |
| `DUNGEONS-N:02` | Snape's Office | `OFFICE` · nguồn | Bàn làm việc tối màu, tủ hồ sơ/sách, giá nguyên liệu có nhãn, vài ghế đối diện; cửa nối trực tiếp khu học Độc dược. |
| `DUNGEONS-N:03` | Potions Ingredient Store | `STORAGE` · nguồn | Kệ chai lọ, nguyên liệu khô và rương phân loại; lối tiếp cận từ khu Độc dược. |
| `DUNGEONS-N:04` | Practical Prep Room | `POTIONS_LAB` · nguồn | Chừa sân thao tác chính, cụm dụng cụ/bia tập ngoài rìa và cửa ra thoáng, chỉ đặt thiết bị gắn với hoạt động RP. |
| `DUNGEONS-N:05` | Cauldron Washroom | `BATHROOM` · nguồn | Khu chậu rửa, nguồn nước, khăn và buồng/thiết bị phù hợp; bề mặt đá/gạch chống ẩm. |

#### `DUNGEONS-E` — E Slytherin Approach · layout `curved`

**Kết cấu:** Hành lang có đoạn chuyển cong, tường/trang trí theo cung. **Phòng nguồn:** 0. **Pointer:** `slytherin-common`; không tính là phòng thứ hai.

Không có room độc lập trong cluster. Chỉ điều hướng sang Fixed theo pointer đã ghi; không tạo một phòng đệm rỗng làm owner mới.

#### `DUNGEONS-S` — S Under-Hall Service · layout `horizontal`

**Kết cấu:** Hành lang ngang, các phòng ở hai bên; co giãn độ dài theo số phòng. **Phòng nguồn:** 5. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `DUNGEONS-S:01` | Deathday Party Chamber | —; gợi ý `CEREMONY_HALL` (minh họa) | Bục, bàn nghi lễ, ghế/băng dài và trục đi giữa. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `DUNGEONS-S:02` | Cleaning Supply Store | `STORAGE` · nguồn | Kệ/rương/thùng theo vật liệu lưu trữ của phòng; chừa lối giữa kệ và khoảng thao tác cạnh cửa. |
| `DUNGEONS-S:03` | Food Transit Corridor | `PASSAGE_PROPS` · nguồn | Trục lưu thông thuộc cụm; sàn/đường đi liền mạch, cửa đến phòng liên quan, đèn/tranh/ghế rìa; không để vật trang trí bít cửa. |
| `DUNGEONS-S:04` | House-Elf Duty Room | —; gợi ý `STUDY_ROOM` (minh họa) | Bàn làm việc, chỗ ngồi, tủ/giá hồ sơ và điểm tiếp khách nhỏ; bố trí tùy người sử dụng. |
| `DUNGEONS-S:05` | Furnace Tech Room | `UTILITY_ROOM` · nguồn | Ống, van, lò, máy móc, tủ đồ bảo trì; rõ vùng thiết bị. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |

#### `DUNGEONS-W` — W Subterranean Classes · layout `ell`

**Kết cấu:** Hai nhánh tạo góc chữ L, phòng phân bố theo nhánh. **Phòng nguồn:** 5. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `DUNGEONS-W:01` | Astronomy Dungeon Corridor | `PASSAGE_PROPS` · nguồn | Trục lưu thông thuộc cụm; sàn/đường đi liền mạch, cửa đến phòng liên quan, đèn/tranh/ghế rìa; không để vật trang trí bít cửa. |
| `DUNGEONS-W:02` | Mineral Sorting Room | —; gợi ý `STUDY_ROOM` (minh họa) | Nhóm bàn đọc, đèn, kệ sách và ghế; chừa lối yên tĩnh giữa các nhóm. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `DUNGEONS-W:03` | Empty Classroom HN-01 | `CLASSROOM` · nguồn | Bảng và bàn giảng, bàn/ghế học viên theo quy mô, tủ/giá môn học dọc tường; giữ vị trí trình diễn. |
| `DUNGEONS-W:04` | Old Cauldron Store | `STORAGE` · nguồn | Kệ/rương/thùng theo vật liệu lưu trữ của phòng; chừa lối giữa kệ và khoảng thao tác cạnh cửa. |
| `DUNGEONS-W:05` | Potion Sample Archive | `ARCHIVE` · nguồn | Tủ hồ sơ, kệ tư liệu, bàn tra cứu, nhãn kệ và đường tiếp cận. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |

### 4.3. TẦNG BẾP — 4 cluster

**Kiến trúc/sắc thái minh họa chung:** Không gian phục vụ/nhà bếp, bếp và kệ, đường vận chuyển thực phẩm; tuyến Hufflepuff là pointer sang Fixed.

#### `KITCHENS-N` — N Kitchens & Service · layout `tee`

**Kết cấu:** Trục chính và một nhánh chữ T, nhường nút giao thông thoáng. **Phòng nguồn:** 5. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `KITCHENS-N:01` | Hogwarts Kitchens | `KITCHEN` · nguồn | Bếp trường rộng, các bếp nấu/khung lò, bàn sơ chế lớn, giá xoong nồi, đường phục vụ Đại Sảnh. |
| `KITCHENS-N:02` | Dry Food Store | `STORAGE` · nguồn | Kệ/rương/thùng theo vật liệu lưu trữ của phòng; chừa lối giữa kệ và khoảng thao tác cạnh cửa. |
| `KITCHENS-N:03` | Meal Prep Room | `KITCHEN` · nguồn | Khu bếp/sơ chế hoặc luân chuyển thực phẩm, bàn thao tác, thùng và kệ đúng vai trò phòng. |
| `KITCHENS-N:04` | Scullery/Dishwashing | `BATHROOM` · nguồn | Khu chậu rửa, nguồn nước, khăn và buồng/thiết bị phù hợp; bề mặt đá/gạch chống ẩm. |
| `KITCHENS-N:05` | Kitchen Logistics Corridor | `PASSAGE_PROPS` · nguồn | Trục lưu thông thuộc cụm; sàn/đường đi liền mạch, cửa đến phòng liên quan, đèn/tranh/ghế rìa; không để vật trang trí bít cửa. |

#### `KITCHENS-E` — E Hufflepuff Approach · layout `ell`

**Kết cấu:** Hai nhánh tạo góc chữ L, phòng phân bố theo nhánh. **Phòng nguồn:** 0. **Pointer:** `hufflepuff-common`; không tính là phòng thứ hai.

Không có room độc lập trong cluster. Chỉ điều hướng sang Fixed theo pointer đã ghi; không tạo một phòng đệm rỗng làm owner mới.

#### `KITCHENS-S` — S Laundry & Linen · layout `vertical`

**Kết cấu:** Trục dọc; cửa, cửa sổ và nội thất sát vách theo chiều dài. **Phòng nguồn:** 5. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `KITCHENS-S:01` | Laundry Room | `LAUNDRY` · nguồn | Bồn giặt, giá phơi/sấy, bàn gấp đồ và kệ khăn vải. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `KITCHENS-S:02` | Linen Room | `LAUNDRY` · nguồn | Bồn giặt, giá phơi/sấy, bàn gấp đồ và kệ khăn vải. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `KITCHENS-S:03` | Tablecloth Store | `STORAGE` · nguồn | Kệ/rương/thùng theo vật liệu lưu trữ của phòng; chừa lối giữa kệ và khoảng thao tác cạnh cửa. |
| `KITCHENS-S:04` | Laundry Maintenance | `LAUNDRY` · nguồn | Bồn giặt, giá phơi/sấy, bàn gấp đồ và kệ khăn vải. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `KITCHENS-S:05` | South Storage Corridor | `PASSAGE_PROPS` · nguồn | Trục lưu thông thuộc cụm; sàn/đường đi liền mạch, cửa đến phòng liên quan, đèn/tranh/ghế rìa; không để vật trang trí bít cửa. |

#### `KITCHENS-W` — W Elf Quarters & Larder · layout `cross`

**Kết cấu:** Bốn nhánh gặp nhau ở tâm, lối nối trung tâm thông thoáng. **Phòng nguồn:** 5. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `KITCHENS-W:01` | House-Elf Quarters | `BEDROOM` · nguồn | Giường, rương/tủ cá nhân và lối đi giữa giường; chỉ thêm đồ cá nhân đã có trong RP. |
| `KITCHENS-W:02` | Vegetable Larder | `STORAGE` · nguồn | Kệ/rương/thùng theo vật liệu lưu trữ của phòng; chừa lối giữa kệ và khoảng thao tác cạnh cửa. |
| `KITCHENS-W:03` | Kitchen Herb Store | `STORAGE` · nguồn | Kệ/rương/thùng theo vật liệu lưu trữ của phòng; chừa lối giữa kệ và khoảng thao tác cạnh cửa. |
| `KITCHENS-W:04` | Spare Utensil Store | `STORAGE` · nguồn | Kệ/rương/thùng theo vật liệu lưu trữ của phòng; chừa lối giữa kệ và khoảng thao tác cạnh cửa. |
| `KITCHENS-W:05` | West Basement Link Corridor | `PASSAGE_PROPS` · nguồn | Trục lưu thông thuộc cụm; sàn/đường đi liền mạch, cửa đến phòng liên quan, đèn/tranh/ghế rìa; không để vật trang trí bít cửa. |

### 4.4. TẦNG 1 — GROUND FLOOR — 4 cluster

**Kiến trúc/sắc thái minh họa chung:** Trục sảnh, cửa/cổng/sân; `hall` chỉ sở hữu các phòng trong phạm vi template F1 S/W, không cả tầng.

#### `F1-N` — N North Hall–Bell Tower · layout `cloister`

**Kết cấu:** Hành lang khép quanh sân trung tâm, phòng mở vào vòng hành lang. **Phòng nguồn:** 6. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `F1-N:01` | North Hall | —; gợi ý `ENTRANCE_VESTIBULE` (minh họa) | Không gian chuyển tiếp, cửa và mảng tường định hướng, lối đi chính mở; quầy/ghế chờ hoặc giá treo nếu đúng tên phòng. |
| `F1-N:02` | Bell Tower Foot Hall | —; gợi ý `ENTRANCE_VESTIBULE` (minh họa) | Không gian chuyển tiếp, cửa và mảng tường định hướng, lối đi chính mở; quầy/ghế chờ hoặc giá treo nếu đúng tên phòng. |
| `F1-N:03` | North Gate Corridor | `PASSAGE_PROPS` · nguồn | Trục lưu thông thuộc cụm; sàn/đường đi liền mạch, cửa đến phòng liên quan, đèn/tranh/ghế rìa; không để vật trang trí bít cửa. |
| `F1-N:04` | North Gate Guardroom | `GUARDROOM` · nguồn | Bàn trực, sổ, tủ khóa, giá dụng cụ và tầm quan sát cửa. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `F1-N:05` | Practice Gear Store | `TOWER_CLOCKWORK` · nguồn | Chừa sân thao tác chính, cụm dụng cụ/bia tập ngoài rìa và cửa ra thoáng, chỉ đặt thiết bị gắn với hoạt động RP. |
| `F1-N:06` | Empty Classroom B-01 | `CLASSROOM` · nguồn | Bảng và bàn giảng, bàn/ghế học viên theo quy mô, tủ/giá môn học dọc tường; giữ vị trí trình diễn. |

#### `F1-E` — E Library Annex–Viaduct · layout `cross`

**Kết cấu:** Bốn nhánh gặp nhau ở tâm, lối nối trung tâm thông thoáng. **Phòng nguồn:** 6. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `F1-E:01` | Central Hall | —; gợi ý `ENTRANCE_VESTIBULE` (minh họa) | Không gian chuyển tiếp, cửa và mảng tường định hướng, lối đi chính mở; quầy/ghế chờ hoặc giá treo nếu đúng tên phòng. |
| `F1-E:02` | Viaduct Entrance Hall | —; gợi ý `ENTRANCE_VESTIBULE` (minh họa) | Không gian chuyển tiếp, cửa và mảng tường định hướng, lối đi chính mở; quầy/ghế chờ hoặc giá treo nếu đúng tên phòng. |
| `F1-E:03` | Greenhouse Link Corridor | `PASSAGE_PROPS` · nguồn | Trục lưu thông thuộc cụm; sàn/đường đi liền mạch, cửa đến phòng liên quan, đèn/tranh/ghế rìa; không để vật trang trí bít cửa. |
| `F1-E:04` | New Pupil Reception | `RECEPTION` · nguồn | Quầy, ghế chờ, bảng tin, chỗ đứng/trao đổi. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `F1-E:05` | Central Hall Store | `STORAGE` · nguồn | Không gian chuyển tiếp, cửa và mảng tường định hướng, lối đi chính mở; quầy/ghế chờ hoặc giá treo nếu đúng tên phòng. |
| `F1-E:06` | Empty Classroom Đ-01 | `CLASSROOM` · nguồn | Bảng và bàn giảng, bàn/ghế học viên theo quy mô, tủ/giá môn học dọc tường; giữ vị trí trình diễn. |

#### `F1-S` — S Great Hall Approach · layout `tee`

**Kết cấu:** Trục chính và một nhánh chữ T, nhường nút giao thông thoáng. **Phòng nguồn:** 0. Không có pointer liên thông tường minh trong bản nguồn.

Không có room độc lập trong cluster. Chỉ điều hướng sang Fixed theo pointer đã ghi; không tạo một phòng đệm rỗng làm owner mới.

#### `F1-W` — W Transfig Courtyard Approach · layout `court`

**Kết cấu:** Ba cánh chữ U bao sân mở; ưu tiên cửa hướng hành lang/sân hợp lý. **Phòng nguồn:** 4. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `F1-W:01` | Transfiguration Courtyard Corridor | `PASSAGE_PROPS` · nguồn | Trục lưu thông thuộc cụm; sàn/đường đi liền mạch, cửa đến phòng liên quan, đèn/tranh/ghế rìa; không để vật trang trí bít cửa. |
| `F1-W:02` | Quad Corridor | `PASSAGE_PROPS` · nguồn | Trục lưu thông thuộc cụm; sàn/đường đi liền mạch, cửa đến phòng liên quan, đèn/tranh/ghế rìa; không để vật trang trí bít cửa. |
| `F1-W:03` | Cloakroom | `CLOAKROOM_LOCKERS` · nguồn | Tủ, móc, gương và ghế thay trang phục. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `F1-W:04` | Transfiguration Supply Store | `STORAGE` · nguồn | Kệ/rương/thùng theo vật liệu lưu trữ của phòng; chừa lối giữa kệ và khoảng thao tác cạnh cửa. |

### 4.5. TẦNG 2 — 4 cluster

**Kiến trúc/sắc thái minh họa chung:** Dãy lớp và bệnh xá, hành lang sáng/tối theo cửa sổ, phòng giáo sư kề khu học tương ứng.

#### `F2-N` — N History & Transfiguration · layout `horizontal`

**Kết cấu:** Hành lang ngang, các phòng ở hai bên; co giãn độ dài theo số phòng. **Phòng nguồn:** 6. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `F2-N:01` | History of Magic Classroom | `CLASSROOM` · nguồn | Bảng và bàn giảng, bàn/ghế học viên theo quy mô, tủ/giá môn học dọc tường; giữ vị trí trình diễn. |
| `F2-N:02` | McGonagall's Office | `OFFICE` · nguồn | Bàn làm việc, chỗ ngồi, tủ/giá hồ sơ và điểm tiếp khách nhỏ; bố trí tùy người sử dụng. |
| `F2-N:03` | Transfiguration Classroom | `CLASSROOM` · nguồn | Bảng và bàn giảng, bàn/ghế học viên theo quy mô, tủ/giá môn học dọc tường; giữ vị trí trình diễn. |
| `F2-N:04` | Transfiguration Prep Room | —; gợi ý `RESEARCH_LAB` (minh họa) | Bàn nghiên cứu, dụng cụ chuyên môn, bản đồ/sổ sách, kệ mẫu vật. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `F2-N:05` | History Book Store | `STORAGE` · nguồn | Kệ/rương/thùng theo vật liệu lưu trữ của phòng; chừa lối giữa kệ và khoảng thao tác cạnh cửa. |
| `F2-N:06` | Empty Classroom B-02 | `CLASSROOM` · nguồn | Bảng và bàn giảng, bàn/ghế học viên theo quy mô, tủ/giá môn học dọc tường; giữ vị trí trình diễn. |

#### `F2-E` — E Scholars Upper Walk · layout `windows`

**Kết cấu:** Dãy hành lang lấy ánh sáng bằng cửa sổ hướng ra ngoài. **Phòng nguồn:** 6. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `F2-E:01` | Muggle Studies Classroom | `CLASSROOM` · nguồn | Bảng và bàn giảng, bàn/ghế học viên theo quy mô, tủ/giá môn học dọc tường; giữ vị trí trình diễn. |
| `F2-E:02` | Hieroglyphics Room | `CLASSROOM` · nguồn | Bảng, bàn giảng viên, dãy bàn/ghế học sinh và giá dụng cụ; có thể đổi số lượng/bố cục. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `F2-E:03` | North Hall Upper Corridor | `PASSAGE_PROPS` · nguồn | Trục lưu thông thuộc cụm; sàn/đường đi liền mạch, cửa đến phòng liên quan, đèn/tranh/ghế rìa; không để vật trang trí bít cửa. |
| `F2-E:04` | Historical Model Archive | `ARCHIVE` · nguồn | Tủ hồ sơ, kệ tư liệu, bàn tra cứu, nhãn kệ và đường tiếp cận. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `F2-E:05` | Teaching Map Store | `STORAGE` · nguồn | Kệ/rương/thùng theo vật liệu lưu trữ của phòng; chừa lối giữa kệ và khoảng thao tác cạnh cửa. |
| `F2-E:06` | Empty Classroom T-02 | `CLASSROOM` · nguồn | Bảng và bàn giảng, bàn/ghế học viên theo quy mô, tủ/giá môn học dọc tường; giữ vị trí trình diễn. |

#### `F2-S` — S Hospital & Faculty Access · layout `ell`

**Kết cấu:** Hai nhánh tạo góc chữ L, phòng phân bố theo nhánh. **Phòng nguồn:** 6. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `F2-S:01` | Hospital Wing | `HOSPITAL_WARD` · nguồn | Dãy giường, rèm, xe thuốc, lối giữa cho chăm sóc; bàn làm việc và kho phụ theo sơ đồ cluster. |
| `F2-S:02` | Pomfrey's Office | `OFFICE` · nguồn | Bàn làm việc, chỗ ngồi, tủ/giá hồ sơ và điểm tiếp khách nhỏ; bố trí tùy người sử dụng. |
| `F2-S:03` | Faculty Tower Access Corridor | `PASSAGE_PROPS` · nguồn | Lối chuyển tầng/giữa tháp; bậc và tay vịn hoặc nhịp hành lang theo địa hình, đèn/tranh sát vách; cửa thông rõ ràng. |
| `F2-S:04` | Bandage/Dressing Room | —; gợi ý `STUDY_ROOM` (minh họa) | Giường/ghế y tế và bàn dụng cụ, ngăn bằng rèm khi cần; giữ trục lưu thông. |
| `F2-S:05` | Medical Supply Store | `STORAGE` · nguồn | Kệ/rương/thùng theo vật liệu lưu trữ của phòng; chừa lối giữa kệ và khoảng thao tác cạnh cửa. |
| `F2-S:06` | Infirmary Waiting Room | `HOSPITAL_WARD` · nguồn | Giường/ghế y tế và bàn dụng cụ, ngăn bằng rèm khi cần; giữ trục lưu thông. |

#### `F2-W` — W DADA Teaching Cluster · layout `tee`

**Kết cấu:** Trục chính và một nhánh chữ T, nhường nút giao thông thoáng. **Phòng nguồn:** 6. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `F2-W:01` | DADA Classroom (tower door) | `CLASSROOM` · nguồn | Phòng học DADA với bảng, bàn học, khoảng trình diễn bùa chú, tủ đạo cụ gần tường; cửa liên thông tháp DADA. |
| `F2-W:02` | Lower DADA Tower Corridor | `PASSAGE_PROPS` · nguồn | Lối chuyển tầng/giữa tháp; bậc và tay vịn hoặc nhịp hành lang theo địa hình, đèn/tranh sát vách; cửa thông rõ ràng. |
| `F2-W:03` | DADA Auxiliary Room | —; gợi ý `STUDY_ROOM` (minh họa) | Nhóm bàn đọc, đèn, kệ sách và ghế; chừa lối yên tĩnh giữa các nhóm. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `F2-W:04` | Defence Practical Room | —; gợi ý `STUDY_ROOM` (minh họa) | Chừa sân thao tác chính, cụm dụng cụ/bia tập ngoài rìa và cửa ra thoáng, chỉ đặt thiết bị gắn với hoạt động RP. |
| `F2-W:05` | DADA Prop Store | `STORAGE` · nguồn | Kệ/rương/thùng theo vật liệu lưu trữ của phòng; chừa lối giữa kệ và khoảng thao tác cạnh cửa. |
| `F2-W:06` | Empty Classroom Đ-02 | `CLASSROOM` · nguồn | Bảng và bàn giảng, bàn/ghế học viên theo quy mô, tủ/giá môn học dọc tường; giữ vị trí trình diễn. |

### 4.6. TẦNG 3 — 4 cluster

**Kiến trúc/sắc thái minh họa chung:** Phòng tắm, lớp bổ sung và các lối phụ DADA; bố cục tiện đi lại, không tự tạo tuyến mật.

#### `F3-N` — N Myrtle's Corridor · layout `horizontal`

**Kết cấu:** Hành lang ngang, các phòng ở hai bên; co giãn độ dài theo số phòng. **Phòng nguồn:** 5. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `F3-N:01` | Myrtle's Bathroom | `BATHROOM` · nguồn | Nhiều bồn rửa, vách ngăn, gian nước/ống dẫn; không đặt đồ chắn buồng vệ sinh. |
| `F3-N:02` | "Second-Floor" Corridor by Myrtle's Bathroom | `PASSAGE_PROPS` · nguồn | Trục lưu thông thuộc cụm; sàn/đường đi liền mạch, cửa đến phòng liên quan, đèn/tranh/ghế rìa; không để vật trang trí bít cửa. |
| `F3-N:03` | Boys' Bathroom | `BATHROOM` · nguồn | Khu chậu rửa, nguồn nước, khăn và buồng/thiết bị phù hợp; bề mặt đá/gạch chống ẩm. |
| `F3-N:04` | Plumbing Store | `STORAGE` · nguồn | Kệ/rương/thùng theo vật liệu lưu trữ của phòng; chừa lối giữa kệ và khoảng thao tác cạnh cửa. |
| `F3-N:05` | Corridor Guardroom B-03 | `PASSAGE_PROPS` · nguồn | Trục lưu thông thuộc cụm; sàn/đường đi liền mạch, cửa đến phòng liên quan, đèn/tranh/ghế rìa; không để vật trang trí bít cửa. |

#### `F3-E` — E Shortcut Stair Walk · layout `curved`

**Kết cấu:** Hành lang có đoạn chuyển cong, tường/trang trí theo cung. **Phòng nguồn:** 4. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `F3-E:01` | Argyllshire Map Tapestry Corridor | `PASSAGE_PROPS` · nguồn | Trục lưu thông thuộc cụm; sàn/đường đi liền mạch, cửa đến phòng liên quan, đèn/tranh/ghế rìa; không để vật trang trí bít cửa. |
| `F3-E:02` | Stair Safety Check Room | `PASSAGE_PROPS` · nguồn | Trục lưu thông thuộc cụm; sàn/đường đi liền mạch, cửa đến phòng liên quan, đèn/tranh/ghế rìa; không để vật trang trí bít cửa. |
| `F3-E:03` | Empty Classroom T-03 | `CLASSROOM` · nguồn | Bảng và bàn giảng, bàn/ghế học viên theo quy mô, tủ/giá môn học dọc tường; giữ vị trí trình diễn. |
| `F3-E:04` | Desk/Chair Store | `STORAGE` · nguồn | Kệ/rương/thùng theo vật liệu lưu trữ của phòng; chừa lối giữa kệ và khoảng thao tác cạnh cửa. |

#### `F3-S` — S Supplemental Classes · layout `vertical`

**Kết cấu:** Trục dọc; cửa, cửa sổ và nội thất sát vách theo chiều dài. **Phòng nguồn:** 5. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `F3-S:01` | Basic Wand-Practice Room | `MAGIC_PRACTICE` · nguồn | Chừa sân thao tác chính, cụm dụng cụ/bia tập ngoài rìa và cửa ra thoáng, chỉ đặt thiết bị gắn với hoạt động RP. |
| `F3-S:02` | Empty Classroom N-03 | `CLASSROOM` · nguồn | Bảng và bàn giảng, bàn/ghế học viên theo quy mô, tủ/giá môn học dọc tường; giữ vị trí trình diễn. |
| `F3-S:03` | Study Equipment Store | `STORAGE` · nguồn | Kệ/rương/thùng theo vật liệu lưu trữ của phòng; chừa lối giữa kệ và khoảng thao tác cạnh cửa. |
| `F3-S:04` | TA Office | `OFFICE` · nguồn | Bàn làm việc, chỗ ngồi, tủ/giá hồ sơ và điểm tiếp khách nhỏ; bố trí tùy người sử dụng. |
| `F3-S:05` | Small Student Lounge | `LOUNGE` · nguồn | Ghế sofa/ghế bành theo nhóm, bàn trà, lò sưởi nếu hợp cảnh, góc đọc. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |

#### `F3-W` — W DADA Office Route · layout `ell`

**Kết cấu:** Hai nhánh tạo góc chữ L, phòng phân bố theo nhánh. **Phòng nguồn:** 5. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `F3-W:01` | DADA Professor's Office (Lockhart 1992) | `OFFICE` · nguồn | Bàn làm việc, chỗ ngồi, tủ/giá hồ sơ và điểm tiếp khách nhỏ; bố trí tùy người sử dụng. |
| `F3-W:02` | DADA Office Corridor | `PASSAGE_PROPS` · nguồn | Trục lưu thông thuộc cụm; sàn/đường đi liền mạch, cửa đến phòng liên quan, đèn/tranh/ghế rìa; không để vật trang trí bít cửa. |
| `F3-W:03` | DADA Parent Reception | `RECEPTION` · nguồn | Quầy, ghế chờ, bảng tin, chỗ đứng/trao đổi. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `F3-W:04` | Lesson Plan Archive | `ARCHIVE` · nguồn | Bảng và bàn giảng, bàn/ghế học viên theo quy mô, tủ/giá môn học dọc tường; giữ vị trí trình diễn. |
| `F3-W:05` | Empty Classroom Đ-03 | `CLASSROOM` · nguồn | Bảng và bàn giảng, bàn/ghế học viên theo quy mô, tủ/giá môn học dọc tường; giữ vị trí trình diễn. |

### 4.7. TẦNG 4 — 4 cluster

**Kiến trúc/sắc thái minh họa chung:** Các gallery, phòng cúp, âm nhạc, Charms, phòng CLB và lối cấm; cửa/ngăn phù hợp RP.

#### `F4-N` — N Trophy–Armour Gallery · layout `windows`

**Kết cấu:** Dãy hành lang lấy ánh sáng bằng cửa sổ hướng ra ngoài. **Phòng nguồn:** 6. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `F4-N:01` | Trophy Room | `TROPHY_ROOM` · nguồn | Tủ Gothic, cúp nhiều dáng, huy chương, khiên và đảo trưng bày kính thấp. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `F4-N:02` | Armour Gallery | `GALLERY` · nguồn | Trục xem hiện vật, tranh hoặc gương làm điểm nhấn; bệ/trưng bày và lối tiếp cận, không trùng bản sao đồ. |
| `F4-N:03` | Music Room | `MUSIC_ROOM` · nguồn | Nhạc cụ, giá bản nhạc, ghế luyện tập và khu trình diễn nhỏ. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `F4-N:04` | Trophy Preservation Store | `STORAGE` · nguồn | Kệ/rương/thùng theo vật liệu lưu trữ của phòng; chừa lối giữa kệ và khoảng thao tác cạnh cửa. |
| `F4-N:05` | Ensemble Practice Room | `MUSIC_ROOM` · nguồn | Chừa sân thao tác chính, cụm dụng cụ/bia tập ngoài rìa và cửa ra thoáng, chỉ đặt thiết bị gắn với hoạt động RP. |
| `F4-N:06` | Empty Classroom B-04 | `CLASSROOM` · nguồn | Bảng và bàn giảng, bàn/ghế học viên theo quy mô, tủ/giá môn học dọc tường; giữ vị trí trình diễn. |

#### `F4-E` — E Upper North Gallery · layout `curved`

**Kết cấu:** Hành lang có đoạn chuyển cong, tường/trang trí theo cung. **Phòng nguồn:** 5. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `F4-E:01` | North Hall Upper Gallery Corridor | `PASSAGE_PROPS` · nguồn | Trục lưu thông thuộc cụm; sàn/đường đi liền mạch, cửa đến phòng liên quan, đèn/tranh/ghế rìa; không để vật trang trí bít cửa. |
| `F4-E:02` | Educational Artefact Display | `GALLERY` · nguồn | Trục xem hiện vật, tranh hoặc gương làm điểm nhấn; bệ/trưng bày và lối tiếp cận, không trùng bản sao đồ. |
| `F4-E:03` | Empty Classroom T-04 | `CLASSROOM` · nguồn | Bảng và bàn giảng, bàn/ghế học viên theo quy mô, tủ/giá môn học dọc tường; giữ vị trí trình diễn. |
| `F4-E:04` | Costume Store | `STORAGE` · nguồn | Kệ/rương/thùng theo vật liệu lưu trữ của phòng; chừa lối giữa kệ và khoảng thao tác cạnh cửa. |
| `F4-E:05` | Artefact Restoration Room | `WORKSHOP` · nguồn | Trục xem hiện vật, tranh hoặc gương làm điểm nhấn; bệ/trưng bày và lối tiếp cận, không trùng bản sao đồ. |

#### `F4-S` — S Clubs & Group Work · layout `cross`

**Kết cấu:** Bốn nhánh gặp nhau ở tâm, lối nối trung tâm thông thoáng. **Phòng nguồn:** 5. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `F4-S:01` | Backup Duelling Practice Room | `MAGIC_PRACTICE` · nguồn | Chừa sân thao tác chính, cụm dụng cụ/bia tập ngoài rìa và cửa ra thoáng, chỉ đặt thiết bị gắn với hoạt động RP. |
| `F4-S:02` | Club Prep Room | `MEETING_CLUB` · nguồn | Bàn hoạt động hoặc họp, ghế nhóm và tủ dụng cụ; hướng bố trí theo RP. |
| `F4-S:03` | Public Speaking Room | —; gợi ý `STUDY_ROOM` (minh họa) | Nhóm bàn đọc, đèn, kệ sách và ghế; chừa lối yên tĩnh giữa các nhóm. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `F4-S:04` | Student Meeting Room | `MEETING_CLUB` · nguồn | Bàn hoạt động hoặc họp, ghế nhóm và tủ dụng cụ; hướng bố trí theo RP. |
| `F4-S:05` | Empty Classroom N-04 | `CLASSROOM` · nguồn | Bảng và bàn giảng, bàn/ghế học viên theo quy mô, tủ/giá môn học dọc tường; giữ vị trí trình diễn. |

#### `F4-W` — W Charms & Forbidden Route · layout `ell`

**Kết cấu:** Hai nhánh tạo góc chữ L, phòng phân bố theo nhánh. **Phòng nguồn:** 6. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `F4-W:01` | Charms Classroom | `CLASSROOM` · nguồn | Bảng và bàn giảng, bàn/ghế học viên theo quy mô, tủ/giá môn học dọc tường; giữ vị trí trình diễn. |
| `F4-W:02` | Charms Corridor | `PASSAGE_PROPS` · nguồn | Trục lưu thông thuộc cụm; sàn/đường đi liền mạch, cửa đến phòng liên quan, đèn/tranh/ghế rìa; không để vật trang trí bít cửa. |
| `F4-W:03` | 1991 "Third-Floor" Forbidden Corridor | `PASSAGE_PROPS` · nguồn | Trục lưu thông thuộc cụm; sàn/đường đi liền mạch, cửa đến phòng liên quan, đèn/tranh/ghế rìa; không để vật trang trí bít cửa. |
| `F4-W:04` | Fluffy's Trapdoor Chamber (1991) | —; gợi ý `CEREMONY_HALL` (minh họa) | Bục, bàn nghi lễ, ghế/băng dài và trục đi giữa. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `F4-W:05` | Charms Practical Room | —; gợi ý `STUDY_ROOM` (minh họa) | Chừa sân thao tác chính, cụm dụng cụ/bia tập ngoài rìa và cửa ra thoáng, chỉ đặt thiết bị gắn với hoạt động RP. |
| `F4-W:06` | Charms Supply Store | `STORAGE` · nguồn | Kệ/rương/thùng theo vật liệu lưu trữ của phòng; chừa lối giữa kệ và khoảng thao tác cạnh cửa. |

### 4.8. TẦNG 5 — 4 cluster

**Kiến trúc/sắc thái minh họa chung:** Thư viện/khu nghiên cứu và phòng học, lối đọc/đến sách, hành lang trưng bày.

#### `F5-N` — N Library & Restricted · layout `cloister`

**Kết cấu:** Hành lang khép quanh sân trung tâm, phòng mở vào vòng hành lang. **Phòng nguồn:** 6. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `F5-N:01` | Hogwarts Library | `LIBRARY` · nguồn | Kệ sách theo dãy, bàn đọc chia vùng, quầy thủ thư và tuyến qua Restricted Section. |
| `F5-N:02` | Restricted Section | `LIBRARY` · nguồn | Kệ sách cao, lối đọc hẹp hơn thư viện chính và ngưỡng cửa/khu ngăn có thể xác định. |
| `F5-N:03` | Pince's Office | `OFFICE` · nguồn | Bàn làm việc, chỗ ngồi, tủ/giá hồ sơ và điểm tiếp khách nhỏ; bố trí tùy người sử dụng. |
| `F5-N:04` | Research Reading Room | `STUDY_ROOM` · nguồn | Bàn đọc, ghế và tủ sách/đèn, nhóm bàn theo số người dùng; lối đi yên tĩnh ở giữa. |
| `F5-N:05` | Catalogue Index Room | `ARCHIVE` · nguồn | Tủ hồ sơ, kệ tư liệu, bàn tra cứu, nhãn kệ và đường tiếp cận. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `F5-N:06` | Rare Book Store | `STORAGE` · nguồn | Kệ/rương/thùng theo vật liệu lưu trữ của phòng; chừa lối giữa kệ và khoảng thao tác cạnh cửa. |

#### `F5-E` — E Long Gallery · layout `windows`

**Kết cấu:** Dãy hành lang lấy ánh sáng bằng cửa sổ hướng ra ngoài. **Phòng nguồn:** 5. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `F5-E:01` | Long Gallery | `GALLERY` · nguồn | Trục xem hiện vật, tranh hoặc gương làm điểm nhấn; bệ/trưng bày và lối tiếp cận, không trùng bản sao đồ. |
| `F5-E:02` | Arithmancy Classroom | `CLASSROOM` · nguồn | Bảng và bàn giảng, bàn/ghế học viên theo quy mô, tủ/giá môn học dọc tường; giữ vị trí trình diễn. |
| `F5-E:03` | Magical Cartography Room | `ART_CARTOGRAPHY_STUDIO` · nguồn | Bàn bản vẽ, giá giấy, tủ bản đồ, dụng cụ mỹ thuật, vùng thao tác. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `F5-E:04` | Cipher/Cryptology Room | —; gợi ý `STUDY_ROOM` (minh họa) | Nhóm bàn đọc, đèn, kệ sách và ghế; chừa lối yên tĩnh giữa các nhóm. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `F5-E:05` | Empty Classroom Đ-05 | `CLASSROOM` · nguồn | Bảng và bàn giảng, bàn/ghế học viên theo quy mô, tủ/giá môn học dọc tường; giữ vị trí trình diễn. |

#### `F5-S` — S Fourth-Floor Walk & Mirror · layout `ell`

**Kết cấu:** Hai nhánh tạo góc chữ L, phòng phân bố theo nhánh. **Phòng nguồn:** 6. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `F5-S:01` | Former 1991 Mirror of Erised Room | —; gợi ý `STUDY_ROOM` (minh họa) | Trục xem hiện vật, tranh hoặc gương làm điểm nhấn; bệ/trưng bày và lối tiếp cận, không trùng bản sao đồ. |
| `F5-S:02` | Old Secret Mirror Corridor | `PASSAGE_PROPS` · nguồn | Trục lưu thông thuộc cụm; sàn/đường đi liền mạch, cửa đến phòng liên quan, đèn/tranh/ghế rìa; không để vật trang trí bít cửa. |
| `F5-S:03` | Library Records Archive | `ARCHIVE` · nguồn | Tủ hồ sơ, kệ tư liệu, bàn tra cứu, nhãn kệ và đường tiếp cận. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `F5-S:04` | Empty Classroom N-05 | `CLASSROOM` · nguồn | Bảng và bàn giảng, bàn/ghế học viên theo quy mô, tủ/giá môn học dọc tường; giữ vị trí trình diễn. |
| `F5-S:05` | Reading Room Store | `STORAGE` · nguồn | Kệ/rương/thùng theo vật liệu lưu trữ của phòng; chừa lối giữa kệ và khoảng thao tác cạnh cửa. |
| `F5-S:06` | Tapestry Shortcut Stair | `PASSAGE_PROPS` · nguồn | Trục lưu thông thuộc cụm; sàn/đường đi liền mạch, cửa đến phòng liên quan, đèn/tranh/ghế rìa; không để vật trang trí bít cửa. |

#### `F5-W` — W Ancient Runes · layout `tee`

**Kết cấu:** Trục chính và một nhánh chữ T, nhường nút giao thông thoáng. **Phòng nguồn:** 5. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `F5-W:01` | Ancient Runes Classroom | `CLASSROOM` · nguồn | Bảng và bàn giảng, bàn/ghế học viên theo quy mô, tủ/giá môn học dọc tường; giữ vị trí trình diễn. |
| `F5-W:02` | Runes Translation Room | `CLASSROOM` · nguồn | Bảng, bàn giảng viên, dãy bàn/ghế học sinh và giá dụng cụ; có thể đổi số lượng/bố cục. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `F5-W:03` | History Seminar Room | `CLASSROOM` · nguồn | Bảng và bàn giảng, bàn/ghế học viên theo quy mô, tủ/giá môn học dọc tường; giữ vị trí trình diễn. |
| `F5-W:04` | Source Research Room | `STUDY_ROOM` · nguồn | Nhóm bàn đọc, đèn, kệ sách và ghế; chừa lối yên tĩnh giữa các nhóm. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `F5-W:05` | Empty Classroom T-05 | `CLASSROOM` · nguồn | Bảng và bàn giảng, bàn/ghế học viên theo quy mô, tủ/giá môn học dọc tường; giữ vị trí trình diễn. |

### 4.9. TẦNG 6 — 4 cluster

**Kiến trúc/sắc thái minh họa chung:** Phòng Prefects, tuyến giáo viên và hành lang tháp đồng hồ, lớp học trên cao.

#### `F6-N` — N Prefects–Faculty Route · layout `ell`

**Kết cấu:** Hai nhánh tạo góc chữ L, phòng phân bố theo nhánh. **Phòng nguồn:** 6. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `F6-N:01` | Prefects' Bathroom | `PREFECTS_BATHROOM` · nguồn | Bể tắm lớn có bậc, vòi kim loại, tranh kính, khu đặt khăn và lối vào kín. |
| `F6-N:02` | Prefects' Bathroom Corridor | `PREFECTS_BATHROOM` · nguồn | Trục lưu thông thuộc cụm; sàn/đường đi liền mạch, cửa đến phòng liên quan, đèn/tranh/ghế rìa; không để vật trang trí bít cửa. |
| `F6-N:03` | Upper Faculty Tower Corridor | `PASSAGE_PROPS` · nguồn | Lối chuyển tầng/giữa tháp; bậc và tay vịn hoặc nhịp hành lang theo địa hình, đèn/tranh sát vách; cửa thông rõ ràng. |
| `F6-N:04` | Prefects' Lounge | `LOUNGE` · nguồn | Ghế sofa/ghế bành theo nhóm, bàn trà, lò sưởi nếu hợp cảnh, góc đọc. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `F6-N:05` | Towel/Uniform Store | `STORAGE` · nguồn | Kệ/rương/thùng theo vật liệu lưu trữ của phòng; chừa lối giữa kệ và khoảng thao tác cạnh cửa. |
| `F6-N:06` | Empty Classroom B-06 | `CLASSROOM` · nguồn | Bảng và bàn giảng, bàn/ghế học viên theo quy mô, tủ/giá môn học dọc tường; giữ vị trí trình diễn. |

#### `F6-E` — E Intermediate Classes · layout `horizontal`

**Kết cấu:** Hành lang ngang, các phòng ở hai bên; co giãn độ dài theo số phòng. **Phòng nguồn:** 5. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `F6-E:01` | Arithmancy Research Room | `CLASSROOM` · nguồn | Bảng, bàn giảng viên, dãy bàn/ghế học sinh và giá dụng cụ; có thể đổi số lượng/bố cục. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `F6-E:02` | "Fifth-Floor" East Wing Corridor | `PASSAGE_PROPS` · nguồn | Trục lưu thông thuộc cụm; sàn/đường đi liền mạch, cửa đến phòng liên quan, đèn/tranh/ghế rìa; không để vật trang trí bít cửa. |
| `F6-E:03` | Magical Art Room | `ART_CARTOGRAPHY_STUDIO` · nguồn | Bàn bản vẽ, giá giấy, tủ bản đồ, dụng cụ mỹ thuật, vùng thao tác. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `F6-E:04` | Assignment/Chart Store | `STORAGE` · nguồn | Kệ/rương/thùng theo vật liệu lưu trữ của phòng; chừa lối giữa kệ và khoảng thao tác cạnh cửa. |
| `F6-E:05` | Empty Classroom Đ-06 | `CLASSROOM` · nguồn | Bảng và bàn giảng, bàn/ghế học viên theo quy mô, tủ/giá môn học dọc tường; giữ vị trí trình diễn. |

#### `F6-S` — S Clock Tower Ascent · layout `curved`

**Kết cấu:** Hành lang có đoạn chuyển cong, tường/trang trí theo cung. **Phòng nguồn:** 4. **Pointer:** `Clock Tower (maintenance)`; không tính là phòng thứ hai.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `F6-S:01` | Upper Clock Tower Corridor | `PASSAGE_PROPS` · nguồn | Lối chuyển tầng/giữa tháp; bậc và tay vịn hoặc nhịp hành lang theo địa hình, đèn/tranh sát vách; cửa thông rõ ràng. |
| `F6-S:02` | Academic Club Room | `MEETING_CLUB` · nguồn | Bàn hoạt động hoặc họp, ghế nhóm và tủ dụng cụ; hướng bố trí theo RP. |
| `F6-S:03` | Student Newspaper Room | —; gợi ý `MEETING_CLUB` (minh họa) | Bàn họp/hoạt động, ghế xung quanh, bảng tin và tủ vật dụng. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `F6-S:04` | Exhibit Gear Store | `TOWER_CLOCKWORK` · nguồn | Khoang cơ khí/chuông, bánh răng, cáp hoặc bộ truyền trên bệ; chừa lối đi cho bảo trì, không dùng bàn học làm vật chính. |

#### `F6-W` — W West High Windows · layout `windows`

**Kết cấu:** Dãy hành lang lấy ánh sáng bằng cửa sổ hướng ra ngoài. **Phòng nguồn:** 5. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `F6-W:01` | "Fifth-Floor" West Window Corridor | `PASSAGE_PROPS` · nguồn | Trục lưu thông thuộc cụm; sàn/đường đi liền mạch, cửa đến phòng liên quan, đèn/tranh/ghế rìa; không để vật trang trí bít cửa. |
| `F6-W:02` | Small Ensemble Room | `MUSIC_ROOM` · nguồn | Nhạc cụ, giá bản nhạc, ghế luyện tập và khu trình diễn nhỏ. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `F6-W:03` | Quiet Reading Room | `STUDY_ROOM` · nguồn | Bàn đọc, ghế và tủ sách/đèn, nhóm bàn theo số người dùng; lối đi yên tĩnh ở giữa. |
| `F6-W:04` | Empty Classroom T-06 | `CLASSROOM` · nguồn | Bảng và bàn giảng, bàn/ghế học viên theo quy mô, tủ/giá môn học dọc tường; giữ vị trí trình diễn. |
| `F6-W:05` | Craft Supply Store | `STORAGE` · nguồn | Kệ/rương/thùng theo vật liệu lưu trữ của phòng; chừa lối giữa kệ và khoảng thao tác cạnh cửa. |

### 4.10. TẦNG 7 — 4 cluster

**Kiến trúc/sắc thái minh họa chung:** Kho tư liệu, seminar/CLB và phòng dự án, hành lang trên cao.

#### `F7-N` — N Upper Stair Access · layout `vertical`

**Kết cấu:** Trục dọc; cửa, cửa sổ và nội thất sát vách theo chiều dài. **Phòng nguồn:** 5. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `F7-N:01` | Academic Achievement Archive | `ARCHIVE` · nguồn | Tủ hồ sơ, kệ tư liệu, bàn tra cứu, nhãn kệ và đường tiếp cận. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `F7-N:02` | Grade Ledger Archive | `ARCHIVE` · nguồn | Tủ hồ sơ, kệ tư liệu, bàn tra cứu, nhãn kệ và đường tiếp cận. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `F7-N:03` | Advanced Lesson Gear Store | `TOWER_CLOCKWORK` · nguồn | Khoang cơ khí/chuông, bánh răng, cáp hoặc bộ truyền trên bệ; chừa lối đi cho bảo trì, không dùng bàn học làm vật chính. |
| `F7-N:04` | Empty Classroom B-07 | `CLASSROOM` · nguồn | Bảng và bàn giảng, bàn/ghế học viên theo quy mô, tủ/giá môn học dọc tường; giữ vị trí trình diễn. |
| `F7-N:05` | North Stair Corridor | `PASSAGE_PROPS` · nguồn | Trục lưu thông thuộc cụm; sàn/đường đi liền mạch, cửa đến phòng liên quan, đèn/tranh/ghế rìa; không để vật trang trí bít cửa. |

#### `F7-E` — E Seminar & Labs · layout `cross`

**Kết cấu:** Bốn nhánh gặp nhau ở tâm, lối nối trung tâm thông thoáng. **Phòng nguồn:** 5. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `F7-E:01` | "Sixth-Floor" Boys' Bathroom | `BATHROOM` · nguồn | Khu chậu rửa, nguồn nước, khăn và buồng/thiết bị phù hợp; bề mặt đá/gạch chống ẩm. |
| `F7-E:02` | Advanced Magic Seminar Room | `CLASSROOM` · nguồn | Bảng và bàn giảng, bàn/ghế học viên theo quy mô, tủ/giá môn học dọc tường; giữ vị trí trình diễn. |
| `F7-E:03` | Small Colloquium Room | `MEETING_CLUB` · nguồn | Bàn họp/hoạt động, ghế xung quanh, bảng tin và tủ vật dụng. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `F7-E:04` | Safe Lab | —; gợi ý `RESEARCH_LAB` (minh họa) | Bàn nghiên cứu, dụng cụ chuyên môn, bản đồ/sổ sách, kệ mẫu vật. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `F7-E:05` | Empty Classroom Đ-07 | `CLASSROOM` · nguồn | Bảng và bàn giảng, bàn/ghế học viên theo quy mô, tủ/giá môn học dọc tường; giữ vị trí trình diễn. |

#### `F7-S` — S Faculty/Clock Link · layout `ell`

**Kết cấu:** Hai nhánh tạo góc chữ L, phòng phân bố theo nhánh. **Phòng nguồn:** 5. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `F7-S:01` | Upper Faculty Tower Corridor | `PASSAGE_PROPS` · nguồn | Lối chuyển tầng/giữa tháp; bậc và tay vịn hoặc nhịp hành lang theo địa hình, đèn/tranh sát vách; cửa thông rõ ràng. |
| `F7-S:02` | Staff Minutes Archive | `ARCHIVE` · nguồn | Bàn làm việc, chỗ ngồi, tủ/giá hồ sơ và điểm tiếp khách nhỏ; bố trí tùy người sử dụng. |
| `F7-S:03` | Timetable Room | —; gợi ý `OFFICE` (minh họa) | Bàn làm việc, ghế chủ và ghế khách, tủ tài liệu, lò sưởi nếu phù hợp. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `F7-S:04` | Reference Book Store | `STORAGE` · nguồn | Kệ/rương/thùng theo vật liệu lưu trữ của phòng; chừa lối giữa kệ và khoảng thao tác cạnh cửa. |
| `F7-S:05` | Empty Classroom N-07 | `CLASSROOM` · nguồn | Bảng và bàn giảng, bàn/ghế học viên theo quy mô, tủ/giá môn học dọc tường; giữ vị trí trình diễn. |

#### `F7-W` — W Games & Projects · layout `windows`

**Kết cấu:** Dãy hành lang lấy ánh sáng bằng cửa sổ hướng ra ngoài. **Phòng nguồn:** 5. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `F7-W:01` | Gobstones Room | `GAMES_ROOM` · nguồn | Bàn cờ/giải trí, ghế xem, tủ quân cờ và khu Gobstones. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `F7-W:02` | Wizard's Chess Club Room | `MEETING_CLUB` · nguồn | Bàn hoạt động hoặc họp, ghế nhóm và tủ dụng cụ; hướng bố trí theo RP. |
| `F7-W:03` | Student Project Room | —; gợi ý `WORKSHOP` (minh họa) | Bàn chế tác, bảng treo công cụ, nguyên liệu, khu thử/đồ nghề. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `F7-W:04` | Empty Classroom T-07 | `CLASSROOM` · nguồn | Bảng và bàn giảng, bàn/ghế học viên theo quy mô, tủ/giá môn học dọc tường; giữ vị trí trình diễn. |
| `F7-W:05` | High Glass Corridor | `PASSAGE_PROPS` · nguồn | Trục lưu thông thuộc cụm; sàn/đường đi liền mạch, cửa đến phòng liên quan, đèn/tranh/ghế rìa; không để vật trang trí bít cửa. |

### 4.11. TẦNG 8 — 4 cluster

**Kiến trúc/sắc thái minh họa chung:** Tuyến văn phòng hiệu trưởng, Room of Requirement và nhánh Gryffindor; Fixed có pointer riêng.

#### `F8-N` — N Headmaster Approach · layout `tower`

**Kết cấu:** Hành lang tiếp nối không gian tháp tròn/đầu tháp, theo cửa tiếp cận. **Phòng nguồn:** 5. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `F8-N:01` | Headmaster's Office Approach Corridor | `HEADMASTER_OFFICE` · nguồn | Trục lưu thông thuộc cụm; sàn/đường đi liền mạch, cửa đến phòng liên quan, đèn/tranh/ghế rìa; không để vật trang trí bít cửa. |
| `F8-N:02` | Headmaster's Entrance Hall | —; gợi ý `HEADMASTER_OFFICE` (minh họa) | Không gian chuyển tiếp, cửa và mảng tường định hướng, lối đi chính mở; quầy/ghế chờ hoặc giá treo nếu đúng tên phòng. |
| `F8-N:03` | Upper Grand Staircase Hall | `PASSAGE_PROPS` · nguồn | Trục lưu thông thuộc cụm; sàn/đường đi liền mạch, cửa đến phòng liên quan, đèn/tranh/ghế rìa; không để vật trang trí bít cửa. |
| `F8-N:04` | Empty Classroom B-08 | `CLASSROOM` · nguồn | Bảng và bàn giảng, bàn/ghế học viên theo quy mô, tủ/giá môn học dọc tường; giữ vị trí trình diễn. |
| `F8-N:05` | Academic Records Store | `ARCHIVE` · nguồn | Kệ/rương/thùng theo vật liệu lưu trữ của phòng; chừa lối giữa kệ và khoảng thao tác cạnh cửa. |

#### `F8-E` — E Room of Requirement · layout `horizontal`

**Kết cấu:** Hành lang ngang, các phòng ở hai bên; co giãn độ dài theo số phòng. **Phòng nguồn:** 5. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `F8-E:01` | "Seventh-Floor" Corridor outside RoR | `PASSAGE_PROPS` · nguồn | Trục lưu thông thuộc cụm; sàn/đường đi liền mạch, cửa đến phòng liên quan, đèn/tranh/ghế rìa; không để vật trang trí bít cửa. |
| `F8-E:02` | Room of Requirement | `ROOM_OF_REQUIREMENT` · nguồn | Không gian biến đổi thật theo nhu cầu RP, có thể là phòng luyện tập, kho đồ hoặc chỗ trú; không gán một nội thất cố định. |
| `F8-E:03` | Empty Classroom Đ-08 | `CLASSROOM` · nguồn | Bảng và bàn giảng, bàn/ghế học viên theo quy mô, tủ/giá môn học dọc tường; giữ vị trí trình diễn. |
| `F8-E:04` | Academic Ceremony Room | `CEREMONY_HALL` · nguồn | Bục, bàn nghi lễ, ghế/băng dài và trục đi giữa. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `F8-E:05` | Portrait Conservation Room | `GALLERY` · nguồn | Trục xem hiện vật, tranh hoặc gương làm điểm nhấn; bệ/trưng bày và lối tiếp cận, không trùng bản sao đồ. |

#### `F8-S` — S Gryffindor Route · layout `curved`

**Kết cấu:** Hành lang có đoạn chuyển cong, tường/trang trí theo cung. **Phòng nguồn:** 2. **Pointer:** `gryffindor-common`; không tính là phòng thứ hai.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `F8-S:01` | "Seventh-Floor" Study Group Room | `STUDY_ROOM` · nguồn | Bàn đọc, ghế và tủ sách/đèn, nhóm bàn theo số người dùng; lối đi yên tĩnh ở giữa. |
| `F8-S:02` | "Seventh-Floor" Portrait Corridor | `PASSAGE_PROPS` · nguồn | Trục lưu thông thuộc cụm; sàn/đường đi liền mạch, cửa đến phòng liên quan, đèn/tranh/ghế rìa; không để vật trang trí bít cửa. |

#### `F8-W` — W Senior Clubs / CCC · layout `tee`

**Kết cấu:** Trục chính và một nhánh chữ T, nhường nút giao thông thoáng. **Phòng nguồn:** 1. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `F8-W:01` | Empty Classroom T-08 | `CLASSROOM` · nguồn | Bảng và bàn giảng, bàn/ghế học viên theo quy mô, tủ/giá môn học dọc tường; giữ vị trí trình diễn. |

### 4.12. NỘI THẤT THÁP — 8 cluster

**Kiến trúc/sắc thái minh họa chung:** Bệ/giếng tháp, hành lang xoắn, cầu thang, phòng ở các cao độ; phòng tháp tròn không ép vào một hình chữ nhật thường.

#### `TOWER-NORTH-DIVINATION-N` — North/Divination N · layout `tower`

**Kết cấu:** Hành lang tiếp nối không gian tháp tròn/đầu tháp, theo cửa tiếp cận. **Phòng nguồn:** 4. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `TOWER-NORTH-DIVINATION-N:approach-spiral-stair` | Spiral Stair [Approach] | `PASSAGE_PROPS` · nguồn | Lối chuyển tầng/giữa tháp; bậc và tay vịn hoặc nhịp hành lang theo địa hình, đèn/tranh sát vách; cửa thông rõ ràng. |
| `TOWER-NORTH-DIVINATION-N:approach-star-chart-archive` | Star-Chart Archive [Approach] | `ARCHIVE` · nguồn | Không gian chuyển tiếp, cửa và mảng tường định hướng, lối đi chính mở; quầy/ghế chờ hoặc giá treo nếu đúng tên phòng. |
| `TOWER-NORTH-DIVINATION-N:top-divination-classroom` | Divination Classroom [Top] | `DIVINATION_CLASSROOM` · nguồn | Gian tròn trên tháp; bàn trà, ghế đệm, khăn/rèm và quả cầu theo recipe Divination. |
| `TOWER-NORTH-DIVINATION-N:top-divination-store` | Divination Store [Top] | `STORAGE` · nguồn | Kệ/rương/thùng theo vật liệu lưu trữ của phòng; chừa lối giữa kệ và khoảng thao tác cạnh cửa. |

#### `TOWER-ASTRONOMY-NW` — Astronomy NW · layout `tower`

**Kết cấu:** Hành lang tiếp nối không gian tháp tròn/đầu tháp, theo cửa tiếp cận. **Phòng nguồn:** 6. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `TOWER-ASTRONOMY-NW:base-foot-corridor` | Foot Corridor [Base] | `PASSAGE_PROPS` · nguồn | Trục lưu thông thuộc cụm; sàn/đường đi liền mạch, cửa đến phòng liên quan, đèn/tranh/ghế rìa; không để vật trang trí bít cửa. |
| `TOWER-ASTRONOMY-NW:base-telescope-maintenance` | Telescope Maintenance [Base] | `UTILITY_ROOM` · nguồn | Ống, van, lò, máy móc, tủ đồ bảo trì; rõ vùng thiết bị. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `TOWER-ASTRONOMY-NW:mid-observation-prep` | Observation Prep [Mid] | —; gợi ý `RESEARCH_LAB` (minh họa) | Bàn nghiên cứu, dụng cụ chuyên môn, bản đồ/sổ sách, kệ mẫu vật. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `TOWER-ASTRONOMY-NW:mid-star-map-store` | Star-Map Store [Mid] | `STORAGE` · nguồn | Kệ/rương/thùng theo vật liệu lưu trữ của phòng; chừa lối giữa kệ và khoảng thao tác cạnh cửa. |
| `TOWER-ASTRONOMY-NW:top-astronomy-classroom` | Astronomy Classroom [Top] | `ASTRONOMY_OBSERVATORY` · nguồn | Khoảng đứng quan sát có kính thiên văn, bản đồ sao, bàn ghi số liệu; chừa không gian quanh mép đài. |
| `TOWER-ASTRONOMY-NW:top-observatory` | Observatory [Top] | `ASTRONOMY_OBSERVATORY` · nguồn | Đài quan sát tháp với thiết bị nhìn trời, bệ ống kính, lan can/cửa bảo vệ; không dựng như phòng chữ nhật. |

#### `TOWER-HEADMASTER-S-N-CENTER` — Headmaster's N/Center · layout `tower`

**Kết cấu:** Hành lang tiếp nối không gian tháp tròn/đầu tháp, theo cửa tiếp cận. **Phòng nguồn:** 5. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `TOWER-HEADMASTER-S-N-CENTER:entry-gargoyle-spiral-stair` | Gargoyle Spiral Stair [Entry] | `PASSAGE_PROPS` · nguồn | Lối chuyển tầng/giữa tháp; bậc và tay vịn hoặc nhịp hành lang theo địa hình, đèn/tranh sát vách; cửa thông rõ ràng. |
| `TOWER-HEADMASTER-S-N-CENTER:entry-waiting-room` | Waiting Room [Entry] | `RECEPTION` · nguồn | Quầy, ghế chờ, bảng tin, chỗ đứng/trao đổi. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `TOWER-HEADMASTER-S-N-CENTER:top-headmaster-s-office` | Headmaster's Office [Top] | `HEADMASTER_OFFICE` · nguồn | Ba không gian tròn nối nhau theo recipe đặc biệt: bàn chính, tủ sách cong, chân dung và khu Pensieve. |
| `TOWER-HEADMASTER-S-N-CENTER:top-instrument-room` | Instrument Room [Top] | —; gợi ý `STUDY_ROOM` (minh họa) | Nhóm bàn đọc, đèn, kệ sách và ghế; chừa lối yên tĩnh giữa các nhóm. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `TOWER-HEADMASTER-S-N-CENTER:top-archive` | Archive [Top] | `ARCHIVE` · nguồn | Tủ hồ sơ, kệ tư liệu, bàn tra cứu, nhãn kệ và đường tiếp cận. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |

#### `TOWER-CLOCK-TOWER-SW` — Clock Tower SW · layout `curved`

**Kết cấu:** Hành lang có đoạn chuyển cong, tường/trang trí theo cung. **Phòng nguồn:** 6. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `TOWER-CLOCK-TOWER-SW:base-clock-tower-hall` | Clock Tower Hall [Base] | —; gợi ý `ENTRANCE_VESTIBULE` (minh họa) | Không gian chuyển tiếp, cửa và mảng tường định hướng, lối đi chính mở; quầy/ghế chờ hoặc giá treo nếu đúng tên phòng. |
| `TOWER-CLOCK-TOWER-SW:base-timekeeper-room` | Timekeeper Room [Base] | `OFFICE` · nguồn | Bàn làm việc, ghế chủ và ghế khách, tủ tài liệu, lò sưởi nếu phù hợp. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `TOWER-CLOCK-TOWER-SW:mid-gearwork-chamber` | Gearwork Chamber [Mid] | `TOWER_CLOCKWORK` · nguồn | Khoang cơ khí/chuông, bánh răng, cáp hoặc bộ truyền trên bệ; chừa lối đi cho bảo trì, không dùng bàn học làm vật chính. |
| `TOWER-CLOCK-TOWER-SW:mid-clock-maintenance` | Clock Maintenance [Mid] | `TOWER_CLOCKWORK` · nguồn | Khoang cơ khí/chuông, bánh răng, cáp hoặc bộ truyền trên bệ; chừa lối đi cho bảo trì, không dùng bàn học làm vật chính. |
| `TOWER-CLOCK-TOWER-SW:top-great-pendulum` | Great Pendulum [Top] | `TOWER_CLOCKWORK` · nguồn | Không gian cao thoáng chứa quả lắc và bộ truyền, sàn bảo trì sát mép; không phủ kín giữa bằng bàn. |
| `TOWER-CLOCK-TOWER-SW:top-bell-check-chamber` | Bell Check Chamber [Top] | —; gợi ý `CEREMONY_HALL` (minh họa) | Khoang cơ khí/chuông, bánh răng, cáp hoặc bộ truyền trên bệ; chừa lối đi cho bảo trì, không dùng bàn học làm vật chính. |

#### `TOWER-BELL-TOWER-N` — Bell Tower N · layout `tower`

**Kết cấu:** Hành lang tiếp nối không gian tháp tròn/đầu tháp, theo cửa tiếp cận. **Phòng nguồn:** 3. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `TOWER-BELL-TOWER-N:base-bell-gear-room` | Bell Gear Room [Base] | `TOWER_CLOCKWORK` · nguồn | Khoang cơ khí/chuông, bánh răng, cáp hoặc bộ truyền trên bệ; chừa lối đi cho bảo trì, không dùng bàn học làm vật chính. |
| `TOWER-BELL-TOWER-N:top-belfry` | Belfry [Top] | `TOWER_CLOCKWORK` · nguồn | Mặt bằng tháp với mảng cong/giếng cao, bệ máy hoặc đài quan sát tùy công năng; giữ lối tiếp cận/lan can. |
| `TOWER-BELL-TOWER-N:top-bell-control-room` | Bell Control Room [Top] | `TOWER_CLOCKWORK` · nguồn | Bộ phận điều khiển và cáp/thanh gông chuông, khoảng bảo trì quanh thiết bị. |

#### `TOWER-FACULTY-TOWER-S` — Faculty Tower S · layout `windows`

**Kết cấu:** Dãy hành lang lấy ánh sáng bằng cửa sổ hướng ra ngoài. **Phòng nguồn:** 6. Không có pointer liên thông tường minh trong bản nguồn.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `TOWER-FACULTY-TOWER-S:entry-faculty-entrance` | Faculty Entrance [Entry] | —; gợi ý `ENTRANCE_VESTIBULE` (minh họa) | Không gian chuyển tiếp, cửa và mảng tường định hướng, lối đi chính mở; quầy/ghế chờ hoặc giá treo nếu đúng tên phòng. |
| `TOWER-FACULTY-TOWER-S:entry-staff-duty-room` | Staff Duty Room [Entry] | —; gợi ý `STUDY_ROOM` (minh họa) | Bàn làm việc, chỗ ngồi, tủ/giá hồ sơ và điểm tiếp khách nhỏ; bố trí tùy người sử dụng. |
| `TOWER-FACULTY-TOWER-S:mid-staff-quarters-corridor` | Staff Quarters Corridor [Mid] | `PASSAGE_PROPS` · nguồn | Trục lưu thông thuộc cụm; sàn/đường đi liền mạch, cửa đến phòng liên quan, đèn/tranh/ghế rìa; không để vật trang trí bít cửa. |
| `TOWER-FACULTY-TOWER-S:mid-staff-lounge` | Staff Lounge [Mid] | `LOUNGE` · nguồn | Ghế sofa/ghế bành theo nhóm, bàn trà, lò sưởi nếu hợp cảnh, góc đọc. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `TOWER-FACULTY-TOWER-S:top-infirmary-link-corridor` | Infirmary Link Corridor [Top] | `PASSAGE_PROPS` · nguồn | Trục lưu thông thuộc cụm; sàn/đường đi liền mạch, cửa đến phòng liên quan, đèn/tranh/ghế rìa; không để vật trang trí bít cửa. |
| `TOWER-FACULTY-TOWER-S:top-closed-staff-meeting-room` | Closed Staff Meeting Room [Top] | `MEETING_CLUB` · nguồn | Bàn hoạt động hoặc họp, ghế nhóm và tủ dụng cụ; hướng bố trí theo RP. |

#### `TOWER-DADA-TOWER-E` — DADA Tower E · layout `tee`

**Kết cấu:** Trục chính và một nhánh chữ T, nhường nút giao thông thoáng. **Phòng nguồn:** 4. **Pointer:** `F2W`, `F2W`; không tính là phòng thứ hai.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `TOWER-DADA-TOWER-E:base-dada-tower-hall` | DADA Tower Hall [Base] | —; gợi ý `ENTRANCE_VESTIBULE` (minh họa) | Không gian chuyển tiếp, cửa và mảng tường định hướng, lối đi chính mở; quầy/ghế chờ hoặc giá treo nếu đúng tên phòng. |
| `TOWER-DADA-TOWER-E:mid-tower-wand-practice-room` | Tower Wand-Practice Room [Mid] | `MAGIC_PRACTICE` · nguồn | Mặt bằng tháp với mảng cong/giếng cao, bệ máy hoặc đài quan sát tùy công năng; giữ lối tiếp cận/lan can. |
| `TOWER-DADA-TOWER-E:top-upper-dada-corridor` | Upper DADA Corridor [Top] | `PASSAGE_PROPS` · nguồn | Trục lưu thông thuộc cụm; sàn/đường đi liền mạch, cửa đến phòng liên quan, đèn/tranh/ghế rìa; không để vật trang trí bít cửa. |
| `TOWER-DADA-TOWER-E:top-auxiliary-office` | Auxiliary Office [Top] | `OFFICE` · nguồn | Bàn làm việc, chỗ ngồi, tủ/giá hồ sơ và điểm tiếp khách nhỏ; bố trí tùy người sử dụng. |

#### `TOWER-GRAND-STAIRCASE-TOWER-CENTER` — Grand Staircase Tower Center · layout `cross`

**Kết cấu:** Bốn nhánh gặp nhau ở tâm, lối nối trung tâm thông thoáng. **Phòng nguồn:** 5. **Pointer:** `F8N`; không tính là phòng thứ hai.

| Room ID nguồn (giữ nguyên) | Tên phòng / điểm | Recipe nguồn hoặc gợi ý | Miêu tả bản đồ & nội thất khi Generated |
|---|---|---|---|
| `TOWER-GRAND-STAIRCASE-TOWER-CENTER:base-grand-staircase` | Grand Staircase [Base] | `PASSAGE_PROPS` · nguồn | Giếng thang mở/đa tầng, vế thang và hành lang tiếp cận; chi tiết thang đặc thù dựa RP. |
| `TOWER-GRAND-STAIRCASE-TOWER-CENTER:base-stair-check-room` | Stair Check Room [Base] | `PASSAGE_PROPS` · nguồn | Trục lưu thông thuộc cụm; sàn/đường đi liền mạch, cửa đến phòng liên quan, đèn/tranh/ghế rìa; không để vật trang trí bít cửa. |
| `TOWER-GRAND-STAIRCASE-TOWER-CENTER:mid-portrait-link-corridor` | Portrait Link Corridor [Mid] | `PASSAGE_PROPS` · nguồn | Trục lưu thông thuộc cụm; sàn/đường đi liền mạch, cửa đến phòng liên quan, đèn/tranh/ghế rìa; không để vật trang trí bít cửa. |
| `TOWER-GRAND-STAIRCASE-TOWER-CENTER:mid-mid-floor-guardroom` | Mid-Floor Guardroom [Mid] | `GUARDROOM` · nguồn | Bàn trực, sổ, tủ khóa, giá dụng cụ và tầm quan sát cửa. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `TOWER-GRAND-STAIRCASE-TOWER-CENTER:top-directory-sign-store` | Directory Sign Store [Top] | `STORAGE` · nguồn | Kệ/rương/thùng theo vật liệu lưu trữ của phòng; chừa lối giữa kệ và khoảng thao tác cạnh cửa. |

## 5. Wizarding World ngoài Fixed — chi tiết địa điểm cần biên soạn vào Atlas runtime

**Cảnh báo tương thích:** `LONDON`, `ENGLAND_REGIONS`, `TRANSIT_AND_INTL` là **ba scope ID thực** trong `assets/atlas.json`, nhưng `rooms: []` ở baseline. Những tên công trình/tầng/phòng sau là **nội dung văn bản Atlas nguồn được triển khai thành bản miêu tả/khuyến nghị**, CHƯA phải room ID hiện thực trong JSON. Khi tích hợp code phải thêm registry place/room dưới ba scope và alias; Gemini có thể gửi `atlasAnchor` là ID vùng hiện hữu + `pcPlace`/tên công trình/phòng, không bịa ID.

### 5.1. `LONDON` — London ngoài Fixed

#### Streets & locations — 5 địa điểm/nhóm không gian

| Địa điểm / tên truy vấn | Phòng, tầng, thành phần được nhắc trong Atlas nguồn | Mô tả kiến trúc & bố trí minh họa | Recipe/cảnh gợi ý (source ID) |
|---|---|---|---|
| **Charing Cross Road** | Đường phố | Phố đô thị, vỉa hè và mặt tiền nhà; đường dẫn Leaky Cauldron chỉ khi RP xác định. | `OUT_BUILDING_YARD`, `OUT_COURTYARD` |
| **Tottenham Court Road & Café** | Đường và quán cà phê | Đường phố và mặt tiền cửa hàng; nếu PC ở trong café, dựng quầy, bàn nhỏ, lối vào, cửa sổ. | `OUT_COURTYARD`, `PUBLIC_COUNTER` |
| **Paddington** | Khu/ga Paddington (ngoài Fixed) | Các lối ga/đường phố khi RP ở ngoài King’s Cross; dùng hình phố hoặc nhà ga minh họa, không gán template Express. | `ENTRANCE_VESTIBULE` |
| **10 Downing Street** | Địa chỉ | Mặt tiền nhà phố; phòng nào chưa có trong Atlas nguồn chỉ dựng nếu RP mô tả rõ. | `OUT_BUILDING_YARD`, `OFFICE` |
| **Purge & Dowse** | Mặt tiền cửa hàng/điểm vào | Mặt tiền phố và lối vào bệnh viện St Mungo’s tùy bối cảnh; không tự biến thành cửa hàng buôn bán. | `ENTRANCE_VESTIBULE` |

#### St Mungo’s Hospital — 6 địa điểm/nhóm không gian

| Địa điểm / tên truy vấn | Phòng, tầng, thành phần được nhắc trong Atlas nguồn | Mô tả kiến trúc & bố trí minh họa | Recipe/cảnh gợi ý (source ID) |
|---|---|---|---|
| **St Mungo’s · Ground** | Reception; Artefact Accidents | Tiền sảnh chờ, quầy hướng dẫn, hành lang dẫn khu tai nạn hiện vật; ghế chờ, biển chỉ dẫn, băng ca nếu RP có. | `RECEPTION`, `HOSPITAL_WARD` |
| **St Mungo’s · F1** | Creature Injuries | Hành lang khoa chấn thương do sinh vật, buồng khám/giường và tủ dụng cụ y tế; độ rộng cho di chuyển bệnh nhân. | `HOSPITAL_WARD` |
| **St Mungo’s · F2** | Magical Bugs & Diseases | Khu điều trị bệnh/bọ ma thuật, giường/rèm và kho thuốc; biện pháp cách ly chỉ hiện theo RP. | `HOSPITAL_WARD` |
| **St Mungo’s · F3** | Potion & Plant Poisoning | Giường điều trị, tủ chai lọ thuốc giải, bàn thao tác; đường giữa thông suốt. | `HOSPITAL_WARD`, `POTIONS_LAB` |
| **St Mungo’s · F4** | Spell Damage; Janus Thickey Ward | Khoa tổn thương phép thuật và Janus Thickey Ward; phòng chăm sóc, rèm, ghế chờ, cửa khu bệnh. | `HOSPITAL_WARD` |
| **St Mungo’s · F5** | Tearoom; Hospital Shop | Phòng trà/quầy bán đồ, bàn ghế, lối đi chung; phân hai chức năng, không nhầm phòng điều trị. | `PUBLIC_COUNTER`, `DINING_ROOM` |

#### 12 Grimmauld Place — 5 địa điểm/nhóm không gian

| Địa điểm / tên truy vấn | Phòng, tầng, thành phần được nhắc trong Atlas nguồn | Mô tả kiến trúc & bố trí minh họa | Recipe/cảnh gợi ý (source ID) |
|---|---|---|---|
| **12 Grimmauld · Hall** | Entrance Hall | Tiền sảnh nhà phố cũ, hành lang/cầu thang trung tâm, cửa các phòng liên tầng; trang trí theo thời kỳ RP. | `ENTRANCE_VESTIBULE` |
| **12 Grimmauld · Kitchen** | Kitchen | Bếp ăn sinh hoạt trong nhà, bàn nấu/bàn ăn, tủ và lối cầu thang. | `KITCHEN`, `DINING_ROOM` |
| **12 Grimmauld · Drawing Room** | Drawing Room | Phòng khách trang trọng với ghế nhóm, lò sưởi, tủ/đồ trang trí; vật đặc biệt chỉ theo RP. | `LOUNGE` |
| **12 Grimmauld · Bedrooms** | Sirius; Regulus; other bedrooms | Các phòng ngủ tách biệt theo người ở; giường, tủ cá nhân, bàn viết và cửa ra hành lang. | `BEDROOM` |
| **11 & 13 Grimmauld Place** | Houses #11 and #13 | Nhà liền kề trong cùng dãy; chưa có room inventory nguồn nên không tự tạo kết cấu cố định. | `OUT_BUILDING_YARD` |

#### Wool’s Orphanage — 2 địa điểm/nhóm không gian

| Địa điểm / tên truy vấn | Phòng, tầng, thành phần được nhắc trong Atlas nguồn | Mô tả kiến trúc & bố trí minh họa | Recipe/cảnh gợi ý (source ID) |
|---|---|---|---|
| **Wool’s · Riddle Room** | Riddle’s Room | Phòng ngủ đơn giản với giường, bàn, đồ cá nhân ít; mặt bằng nhà tập thể minh họa. | `BEDROOM` |
| **Wool’s · Matron Office** | Matron’s Office | Bàn quản lý, tủ hồ sơ, ghế và khu tiếp người; nối với hành lang nhà tập thể. | `OFFICE` |

**Routing World:** Một `atlasAnchor` vùng đúng + đường địa điểm theo RP là đủ. Chỉ dựng khu/thành phần được focus (ví dụ Malfoy Manor có grounds, Hall, Drawing Room, Cellars; tùy PC ở đâu mà dựng cluster hợp lý), không sinh cả `ENGLAND_REGIONS`. Phần vị trí/đồ ngoài danh sách là kiến thức RP/Custom. Phân biệt Hogwarts Quidditch Fixed với Quidditch World Cup ở địa điểm khác.**

### 5.2. `ENGLAND_REGIONS` — Các vùng nước Anh

#### Surrey / Little Whinging — 5 địa điểm/nhóm không gian

| Địa điểm / tên truy vấn | Phòng, tầng, thành phần được nhắc trong Atlas nguồn | Mô tả kiến trúc & bố trí minh họa | Recipe/cảnh gợi ý (source ID) |
|---|---|---|---|
| **No. 4 Privet Drive** | Living; Dining; Kitchen; Harry/Dudley/Master Bedrooms; Cupboard Under Stairs; Garden | Nhà gia đình ở khu dân cư: sảnh, phòng khách, phòng ăn, bếp, thang, kho dưới thang, các phòng ngủ và sân/vườn; dùng từng recipe khác nhau. | `ENTRANCE_VESTIBULE`, `LOUNGE`, `DINING_ROOM`, `KITCHEN`, `BEDROOM`, `STORAGE`, `OUT_GARDEN` |
| **No. 7 Privet Drive** | House #7 | Nhà lân cận, mặt tiền/sân theo RP; cấu trúc phòng chưa được ghi nguồn. | `OUT_BUILDING_YARD` |
| **Magnolia Crescent / Magnolia Road** | Crescent #2; Road | Đường khu dân cư, nhà liền kề, lối đi, cây; địa chỉ chỉ là chỉ dẫn bối cảnh. | `OUT_BUILDING_YARD`, `OUT_LAWN` |
| **Little Whinging Park** | Park | Khoảng cỏ, lối dạo, cây/ghế, khu công cộng; không thêm công trình nếu RP chưa đặt. | `OUT_GARDEN`, `OUT_LAWN` |
| **Mrs Figg’s House** | House | Nhà dân với phòng khách, đồ sinh hoạt dựa trên RP; nguồn không ghi sơ đồ phòng chính xác. | `LOUNGE`, `BEDROOM` |

#### Ottery St Catchpole — 5 địa điểm/nhóm không gian

| Địa điểm / tên truy vấn | Phòng, tầng, thành phần được nhắc trong Atlas nguồn | Mô tả kiến trúc & bố trí minh họa | Recipe/cảnh gợi ý (source ID) |
|---|---|---|---|
| **The Burrow · Ground** | Kitchen; Living Room; Garden; Rear Pitch | Nhà nhiều tầng kết nối hẹp; tầng sinh hoạt có bếp, phòng khách, lối ra vườn và sân Quidditch sau nhà. | `KITCHEN`, `LOUNGE`, `OUT_GARDEN`, `OUT_LAWN` |
| **The Burrow · Bedrooms** | Master; Ron; Ginny; Twins; other bedrooms; Attic | Phòng ngủ cá nhân theo tầng, cầu thang, gác mái, đồ lưu niệm; không khẳng định sơ đồ tầng canon nếu thiếu nguồn. | `BEDROOM`, `STORAGE` |
| **Lovegood House** | Living; Luna’s Room; Xenophilius’s Study; Garden | Nhà riêng có phòng sinh hoạt, phòng Luna, nơi làm việc và vườn; các góc sách, tranh/bản thảo theo RP. | `LOUNGE`, `BEDROOM`, `STUDY_ROOM`, `OUT_GARDEN` |
| **Diggory Home** | Home | Nhà trong vùng Ottery; kiến trúc, phòng và đồ không có xác nhận trong Atlas nguồn, dựng theo RP. | `OUT_BUILDING_YARD`, `LOUNGE`, `BEDROOM` |
| **Fawcett Home** | Home | Nhà trong vùng Ottery, mặt tiền/vườn và nội thất theo mô tả RP. | `OUT_BUILDING_YARD`, `LOUNGE` |

#### Godric’s Hollow — 4 địa điểm/nhóm không gian

| Địa điểm / tên truy vấn | Phòng, tầng, thành phần được nhắc trong Atlas nguồn | Mô tả kiến trúc & bố trí minh họa | Recipe/cảnh gợi ý (source ID) |
|---|---|---|---|
| **Godric’s Hollow · Village** | Square; Church; Graveyard | Quảng trường làng, nhà thờ, nghĩa trang, đường đá và dãy nhà; tách rõ khu ngoài/kiến trúc. | `OUT_COURTYARD`, `OUT_GARDEN` |
| **Potter Cottage** | Cottage | Nhà nhỏ dân cư, lối vào, khu sinh hoạt và phòng ngủ chỉ dựng khi RP có thông tin. | `OUT_BUILDING_YARD`, `LOUNGE`, `BEDROOM` |
| **Bathilda Bagshot’s House** | House | Nhà cũ, góc sách/đồ sưu tầm theo RP; room inventory chưa được Atlas nguồn quy định. | `LOUNGE`, `LIBRARY` |
| **Dumbledore Family Home** | Home | Nhà gia đình ở làng, sân và nội thất theo nguồn RP; không tự khẳng định sơ đồ. | `LOUNGE`, `BEDROOM` |

#### Little / Great Hangleton — 4 địa điểm/nhóm không gian

| Địa điểm / tên truy vấn | Phòng, tầng, thành phần được nhắc trong Atlas nguồn | Mô tả kiến trúc & bố trí minh họa | Recipe/cảnh gợi ý (source ID) |
|---|---|---|---|
| **Riddle House** | House/Manor | Nhà lớn với sân, đại sảnh, phòng sinh hoạt và các phòng khác theo RP; bảo đảm ngoại cảnh/indoor theo focus. | `OUT_BUILDING_YARD`, `ENTRANCE_VESTIBULE`, `LOUNGE` |
| **Hangleton Graveyard** | Graveyard | Lối đá, khu mộ và cây/đá; bố cục mộ cụ thể chỉ khi RP có bằng chứng. | `OUT_GARDEN` |
| **Gaunt Shack** | Shack | Nhà tồi tàn nhỏ, phòng sinh hoạt/bếp, đồ đạc giản dị hoặc đổ nát theo RP. | `OUT_BUILDING_YARD`, `LOUNGE` |
| **Hanged Man Pub** | Pub | Quầy phục vụ và bàn khách, phía ngoài là phố/đường làng. | `PUBLIC_COUNTER`, `LOUNGE` |

#### Cokeworth — 2 địa điểm/nhóm không gian

| Địa điểm / tên truy vấn | Phòng, tầng, thành phần được nhắc trong Atlas nguồn | Mô tả kiến trúc & bố trí minh họa | Recipe/cảnh gợi ý (source ID) |
|---|---|---|---|
| **Spinner’s End / Snape’s House** | House | Nhà phố ven đường, phòng tiếp khách, kệ sách và các phòng khác theo RP; không tự dựng canon phụ. | `LOUNGE`, `LIBRARY`, `BEDROOM` |
| **Railview Hotel** | Hotel | Sảnh tiếp đón, hành lang và phòng nghỉ minh họa khi RP cần; không xác nhận số phòng canon. | `RECEPTION`, `BEDROOM` |

#### Wiltshire — 4 địa điểm/nhóm không gian

| Địa điểm / tên truy vấn | Phòng, tầng, thành phần được nhắc trong Atlas nguồn | Mô tả kiến trúc & bố trí minh họa | Recipe/cảnh gợi ý (source ID) |
|---|---|---|---|
| **Malfoy Manor · Grounds** | Grounds; outer gates; gardens | Điền trang rộng, cổng và lối xe vào, sân, vườn và khối dinh thự; mái/tường và đường theo vẻ trang trọng, không tự chế tuyến canon. | `OUT_BUILDING_YARD`, `OUT_GARDEN` |
| **Malfoy Manor · Hall** | Hall; corridors | Tiền sảnh/đại sảnh tiếp khách, cầu thang, hành lang thông vào phòng khách và khu phụ; đồ trang trí trang trọng ở mép. | `ENTRANCE_VESTIBULE`, `GALLERY` |
| **Malfoy Manor · Drawing Room** | Drawing Room | Phòng khách nghi lễ, ghế theo nhóm, bàn, lò sưởi/đồ trang trí tùy RP; tập trung điểm diễn biến. | `LOUNGE`, `MEETING_CLUB` |
| **Malfoy Manor · Cellars** | Cellars | Hầm đá/kho, cửa xuống, kệ/rương hoặc phòng giam chỉ nếu RP nói rõ; không tự bổ sung tầng/phòng canon. | `STORAGE`, `DETENTION_CELL` |

#### Tinworth — 2 địa điểm/nhóm không gian

| Địa điểm / tên truy vấn | Phòng, tầng, thành phần được nhắc trong Atlas nguồn | Mô tả kiến trúc & bố trí minh họa | Recipe/cảnh gợi ý (source ID) |
|---|---|---|---|
| **Shell Cottage · Interior** | Kitchen; Living; Bedrooms | Nhà nhỏ ven biển: bếp, sinh hoạt và phòng ngủ, cửa/đường đi phù hợp nhà nghỉ. | `KITCHEN`, `LOUNGE`, `BEDROOM` |
| **Shell Cottage · Coast** | Garden; Coast | Lối xuống bãi ven biển, bờ cát/cỏ, vườn sát nhà; tách nước khỏi vùng đặt marker đứng. | `OUT_WATERSIDE`, `OUT_GARDEN` |

#### Other villages/sites — 4 địa điểm/nhóm không gian

| Địa điểm / tên truy vấn | Phòng, tầng, thành phần được nhắc trong Atlas nguồn | Mô tả kiến trúc & bố trí minh họa | Recipe/cảnh gợi ý (source ID) |
|---|---|---|---|
| **Budleigh Babberton / Slughorn** | Village; Slughorn residence | Đường làng, nhà ở và phòng khách theo RP; không có bản phòng xác định. | `OUT_BUILDING_YARD`, `LOUNGE` |
| **Upper Flagley** | Village | Làng/nhà/đường, nội thất chỉ theo RP; không thêm chi tiết canon giả. | `OUT_BUILDING_YARD` |
| **Forest of Dean Camp** | Camp | Rừng, lều trại, chỗ nghỉ, nguồn nước/đường mòn tùy RP. | `OUT_WOODLAND`, `OUT_CAMP` |
| **Hut-on-the-Rock** | Rock; hut | Mỏm đá/biển, lều nhỏ, ngưỡng cửa và không gian trú; giữ mép nước/vách đá là vùng cấm. | `OUT_WATERSIDE`, `OUT_BUILDING_YARD` |

#### Unmapped homes — 2 địa điểm/nhóm không gian

| Địa điểm / tên truy vấn | Phòng, tầng, thành phần được nhắc trong Atlas nguồn | Mô tả kiến trúc & bố trí minh họa | Recipe/cảnh gợi ý (source ID) |
|---|---|---|---|
| **Muriel / Hepzibah / Moody / Crouch / Longbottom** | Homes in source list | Các nhà riêng nguồn có tên nhưng thiếu kiến trúc/phòng; tách từng nhà theo nơi PC ở, tự dùng bedroom/lounge/office hợp RP. | `OUT_BUILDING_YARD`, `LOUNGE`, `BEDROOM` |
| **Tonks / Shacklebolt / Granger / Diggle / Gregorovitch** | Homes in source list | Các nhà/địa chỉ nguồn chỉ có tên, chưa có sơ đồ; ưu tiên địa điểm cụ thể trong RP, không xem đây là một công trình chung. | `OUT_BUILDING_YARD`, `OFFICE`, `LOUNGE` |

**Routing World:** Một `atlasAnchor` vùng đúng + đường địa điểm theo RP là đủ. Chỉ dựng khu/thành phần được focus (ví dụ Malfoy Manor có grounds, Hall, Drawing Room, Cellars; tùy PC ở đâu mà dựng cluster hợp lý), không sinh cả `ENGLAND_REGIONS`. Phần vị trí/đồ ngoài danh sách là kiến thức RP/Custom. Phân biệt Hogwarts Quidditch Fixed với Quidditch World Cup ở địa điểm khác.**

### 5.3. `TRANSIT_AND_INTL` — Giao thông và quốc tế

#### Transit — 1 địa điểm/nhóm không gian

| Địa điểm / tên truy vấn | Phòng, tầng, thành phần được nhắc trong Atlas nguồn | Mô tả kiến trúc & bố trí minh họa | Recipe/cảnh gợi ý (source ID) |
|---|---|---|---|
| **Knight Bus** | Vehicle/interior | Xe buýt nhiều tầng, cầu thang, giường/ghế theo cảnh RP; chỉ minh họa các vùng cần thấy. | `ENTRANCE_VESTIBULE`, `BEDROOM` |

#### Prisons — 1 địa điểm/nhóm không gian

| Địa điểm / tên truy vấn | Phòng, tầng, thành phần được nhắc trong Atlas nguồn | Mô tả kiến trúc & bố trí minh họa | Recipe/cảnh gợi ý (source ID) |
|---|---|---|---|
| **Azkaban** | Cells; corridors | Công trình nhà tù biệt lập, hành lang khu giam, ô cửa, buồng giam và sân/lối tiếp cận nếu RP cho phép. | `DETENTION_CELL`, `PASSAGE_PROPS`, `OUT_BUILDING_YARD` |

#### Europe — 1 địa điểm/nhóm không gian

| Địa điểm / tên truy vấn | Phòng, tầng, thành phần được nhắc trong Atlas nguồn | Mô tả kiến trúc & bố trí minh họa | Recipe/cảnh gợi ý (source ID) |
|---|---|---|---|
| **Romanian Dragon Sanctuary** | Sanctuary | Địa hình rộng, chuồng/khu chăm sóc, đường tiếp cận và trạm làm việc theo RP; không tự sinh rồng/NPC. | `OUT_LAWN`, `OUT_BUILDING_YARD` |

#### North America — 2 địa điểm/nhóm không gian

| Địa điểm / tên truy vấn | Phòng, tầng, thành phần được nhắc trong Atlas nguồn | Mô tả kiến trúc & bố trí minh họa | Recipe/cảnh gợi ý (source ID) |
|---|---|---|---|
| **Ilvermorny · Massachusetts** | School | Khu trường/công trình và lớp/phòng theo RP; Atlas nguồn chỉ có tên, không tự đặt bố cục canon. | `OUT_BUILDING_YARD`, `CLASSROOM` |
| **MACUSA · New York** | Institution | Công trình hành chính, sảnh, quầy, phòng làm việc theo RP; không tự khẳng định layout tầng. | `RECEPTION`, `OFFICE` |

#### Coasts / caves — 1 địa điểm/nhóm không gian

| Địa điểm / tên truy vấn | Phòng, tầng, thành phần được nhắc trong Atlas nguồn | Mô tả kiến trúc & bố trí minh họa | Recipe/cảnh gợi ý (source ID) |
|---|---|---|---|
| **Horcrux Sea Cave** | Underground lake; island | Lối hang đá xuống hồ ngầm, đảo nhỏ/trục bến, nước ngăn vùng đứng; các hiện vật/hiệu ứng tùy RP được biết. | `OUT_WATERSIDE`, `CEREMONY_HALL` |

#### Sport — 1 địa điểm/nhóm không gian

| Địa điểm / tên truy vấn | Phòng, tầng, thành phần được nhắc trong Atlas nguồn | Mô tả kiến trúc & bố trí minh họa | Recipe/cảnh gợi ý (source ID) |
|---|---|---|---|
| **Quidditch World Cup** | Campsite; stadium | Khu lều và đường trại, sân vận động cùng khán đài; khác sân Hogwarts Fixed. | `OUT_CAMP`, `OUT_LAWN` |

#### Historical sites — 1 địa điểm/nhóm không gian

| Địa điểm / tên truy vấn | Phòng, tầng, thành phần được nhắc trong Atlas nguồn | Mô tả kiến trúc & bố trí minh họa | Recipe/cảnh gợi ý (source ID) |
|---|---|---|---|
| **Egyptian Tombs** | Tombs | Mộ/cấu trúc đá, hành lang và buồng mộ; nội thất/trang trí cụ thể không có trong Atlas nguồn. | `PASSAGE_PROPS`, `SECURE_VAULT` |

**Routing World:** Một `atlasAnchor` vùng đúng + đường địa điểm theo RP là đủ. Chỉ dựng khu/thành phần được focus (ví dụ Malfoy Manor có grounds, Hall, Drawing Room, Cellars; tùy PC ở đâu mà dựng cluster hợp lý), không sinh cả `ENGLAND_REGIONS`. Phần vị trí/đồ ngoài danh sách là kiến thức RP/Custom. Phân biệt Hogwarts Quidditch Fixed với Quidditch World Cup ở địa điểm khác.**

### 5.4. Bảng phòng chi tiết cho các công trình World trọng tâm (chưa có room ID runtime)

**Cách dùng:** Các dòng sau **không phải ID mới đã tồn tại**. Chúng là danh sách phòng/ngữ cảnh có trong văn bản Atlas gốc và hướng nội thất minh họa để viết registry chi tiết sau duyệt. Room/tầng chưa được nguồn xác nhận tuyệt đối không được gắn nhãn canon. Khi dựng, chỉ focus công trình/tầng PC đang có mặt.

#### St Mungo’s Hospital — thành phần phòng/không gian

| Phạm vi | Phòng/điểm theo nguồn hoặc theo RP | Recipe tham khảo | Nội thất/bố trí chi tiết (minh họa; không phải floor plan canon) |
|---|---|---|---|
| G | Reception | `RECEPTION` | Quầy đón tiếp, bảng phân khoa và hàng ghế chờ; cửa/lối lên các khoa. |
| G | Artefact Accidents | `HOSPITAL_WARD` | Khu tiếp nhận thương tích do hiện vật, giường khám, tủ y cụ, lối xe cáng. |
| F1 | Creature Injuries | `HOSPITAL_WARD` | Dãy giường, khu khám riêng và giá vật tư chăm sóc, lối giữa cho nhân viên. |
| F2 | Magical Bugs/Diseases | `HOSPITAL_WARD` | Buồng bệnh, tủ thuốc, ranh giới khu điều trị; không tự thiết kế phòng cách ly canon. |
| F3 | Potion/Plant Poisoning | `HOSPITAL_WARD` | Giường điều trị, kệ lọ thuốc giải, chậu và bàn chuẩn bị điều trị. |
| F4 | Spell Damage | `HOSPITAL_WARD` | Phòng khám và giường chăm sóc thương tổn phép, ghế chờ bên hành lang. |
| F4 | Janus Thickey Ward | `HOSPITAL_WARD` | Khu điều trị lâu dài, nhóm giường/tủ cá nhân, các vùng chờ yên tĩnh theo RP. |
| F5 | Tearoom | `PUBLIC_COUNTER` | Quầy đồ uống, bàn khách nhỏ, kệ dụng cụ phục vụ. |
| F5 | Hospital Shop | `PUBLIC_COUNTER` | Quầy bán và kệ sản phẩm, trục mua hàng rõ ràng. |

#### 12 Grimmauld Place — thành phần phòng/không gian

| Phạm vi | Phòng/điểm theo nguồn hoặc theo RP | Recipe tham khảo | Nội thất/bố trí chi tiết (minh họa; không phải floor plan canon) |
|---|---|---|---|
| Không xác định | Hall | `ENTRANCE_VESTIBULE` | Sảnh nhà phố, cầu thang lên xuống, khung cửa, lối nối các phòng; không tự khẳng định số tầng. |
| Không xác định | Kitchen | `KITCHEN` | Bếp nấu, bàn làm việc, chậu rửa, tủ thực phẩm và chỗ sinh hoạt nhỏ. |
| Không xác định | Drawing Room | `LOUNGE` | Bộ ghế khách, bàn trà, lò sưởi và đồ tường; biến thiên theo thời kỳ RP. |
| Không xác định | Sirius’s Bedroom | `BEDROOM` | Giường và bàn/đồ cá nhân theo RP, cửa hành lang. |
| Không xác định | Regulus’s Bedroom | `BEDROOM` | Giường, tủ và bàn viết cá nhân theo RP, không cài sẵn bí mật chưa biết. |
| Không xác định | Other Bedrooms | `BEDROOM` | Các phòng ngủ khác chỉ khi RP cho biết, không ép số phòng cố định. |

#### No. 4 Privet Drive — thành phần phòng/không gian

| Phạm vi | Phòng/điểm theo nguồn hoặc theo RP | Recipe tham khảo | Nội thất/bố trí chi tiết (minh họa; không phải floor plan canon) |
|---|---|---|---|
| Nhà | Entrance / Stairs | `ENTRANCE_VESTIBULE` | Sảnh vào và cầu thang; cửa sang phòng khách/bếp và dưới gầm thang. |
| Nhà | Living Room | `LOUNGE` | Ghế sofa, bàn trà, tủ/TV nếu phù hợp niên đại, cửa sổ và lối phòng. |
| Nhà | Dining Room | `DINING_ROOM` | Bàn ăn và ghế theo quy mô gia đình, tủ đồ ăn và lối sang bếp. |
| Nhà | Kitchen | `KITCHEN` | Tủ bếp, mặt nấu, chậu và bàn thao tác; cửa ra sân nếu RP xác định. |
| Nhà | Harry’s Bedroom | `BEDROOM` | Giường, bàn nhỏ/tủ/đồ cá nhân; không mặc định đồng nhất giai đoạn sống trong cupboard. |
| Nhà | Dudley’s Bedroom | `BEDROOM` | Giường và đồ cá nhân theo RP, chừa lối cửa. |
| Nhà | Master Bedroom | `BEDROOM` | Giường lớn, tủ quần áo và bàn nhỏ. |
| Dưới thang | Cupboard Under Stairs | `STORAGE` | Gian hẹp có cửa thấp và đồ kê theo giai đoạn RP; không biến thành một phòng ngủ rộng. |
| Ngoài nhà | Garden | `OUT_GARDEN` | Sân và cỏ/cây viền, hàng rào, cửa từ nhà, đường bước hợp lý. |

#### The Burrow — thành phần phòng/không gian

| Phạm vi | Phòng/điểm theo nguồn hoặc theo RP | Recipe tham khảo | Nội thất/bố trí chi tiết (minh họa; không phải floor plan canon) |
|---|---|---|---|
| Sinh hoạt | Kitchen | `KITCHEN` | Bếp sinh hoạt gia đình, bàn nấu lớn, tủ dụng cụ, lối ăn uống. |
| Sinh hoạt | Living Room | `LOUNGE` | Ghế nhóm, bàn nhỏ, lò sưởi/đồ cũ nếu hợp RP. |
| Các tầng | Master Bedroom | `BEDROOM` | Giường lớn, tủ áo, chỗ ngồi/đồ cá nhân. |
| Các tầng | Ron’s Bedroom | `BEDROOM` | Giường, góc học, tủ và đồ cá nhân theo RP. |
| Các tầng | Ginny’s Bedroom | `BEDROOM` | Giường và góc cá nhân theo RP, không tự thêm sự kiện. |
| Các tầng | Twins’ Bedroom | `BEDROOM` | Giường/khu đồ dùng hai người, đồ thí nghiệm chỉ khi RP đã có. |
| Các tầng | Other Bedrooms | `BEDROOM` | Chỉ thêm số phòng thực có trong RP, nối qua cầu thang nhà chính. |
| Mái | Attic | `STORAGE` | Không gian mái thấp, kho/gác; đồ vật phụ thuộc RP, không giả định occupant. |
| Ngoài nhà | Garden | `OUT_GARDEN` | Vườn, luống cây, lối nhà và chỗ nghỉ. |
| Ngoài nhà | Rear Pitch | `OUT_LAWN` | Khoảng cỏ tập chổi/Quidditch gia đình, ghế/dụng cụ ở rìa. |

#### Lovegood House — thành phần phòng/không gian

| Phạm vi | Phòng/điểm theo nguồn hoặc theo RP | Recipe tham khảo | Nội thất/bố trí chi tiết (minh họa; không phải floor plan canon) |
|---|---|---|---|
| Nhà | Living Room | `LOUNGE` | Không gian sinh hoạt, bàn ghế và đồ trang trí theo bối cảnh nhân vật. |
| Nhà | Luna’s Room | `BEDROOM` | Giường, bàn và đồ dùng cá nhân theo RP; tránh tự tạo bí mật. |
| Nhà | Xenophilius’s Study | `STUDY_ROOM` | Bàn viết, giá sách, bản thảo/báo chí theo RP. |
| Ngoài nhà | Garden | `OUT_GARDEN` | Lối từ nhà, cỏ/cây, vườn, cấu trúc vừa đủ. |

#### Malfoy Manor — thành phần phòng/không gian

| Phạm vi | Phòng/điểm theo nguồn hoặc theo RP | Recipe tham khảo | Nội thất/bố trí chi tiết (minh họa; không phải floor plan canon) |
|---|---|---|---|
| Ngoài | Grounds / Main Approach | `OUT_BUILDING_YARD` | Cổng, đường dẫn đến dinh thự, bãi sân, hàng cây và mảng công trình theo RP. |
| Ngoài | Gardens | `OUT_GARDEN` | Vườn cảnh và đường dạo phụ quanh nhà; vị trí chính xác chưa có sơ đồ canon nguồn. |
| Trong nhà | Hall | `ENTRANCE_VESTIBULE` | Tiền sảnh lớn, cửa chính, cầu thang/nút hành lang đi các phòng. |
| Trong nhà | Drawing Room | `LOUNGE` | Bộ ghế sang, bàn và đồ trang trí quý tộc; điểm RP chủ đạo trong phòng. |
| Dưới nhà | Cellars | `STORAGE` | Không gian hầm đá, các cửa/kho/phòng phụ theo RP, giữ đúng thông tin PC biết. |
| Dưới nhà | Cellar as detention (chỉ nếu RP) | `DETENTION_CELL` | Chỉ bật nếu RP đã xác nhận sử dụng làm nơi giam; không mặc định biến mọi cellar thành phòng giam. |

#### Shell Cottage — thành phần phòng/không gian

| Phạm vi | Phòng/điểm theo nguồn hoặc theo RP | Recipe tham khảo | Nội thất/bố trí chi tiết (minh họa; không phải floor plan canon) |
|---|---|---|---|
| Nhà | Kitchen | `KITCHEN` | Bếp sinh hoạt, bàn nấu và lối sang phòng chung. |
| Nhà | Living Room | `LOUNGE` | Bộ ghế, bàn trà và đồ dùng nhà biển giản dị. |
| Nhà | Bedrooms | `BEDROOM` | Phòng ngủ riêng chỉ theo người ở/số phòng trong RP. |
| Ngoài | Garden | `OUT_GARDEN` | Vườn nhỏ sát nhà, lối ra bờ biển. |
| Ngoài | Coast | `OUT_WATERSIDE` | Địa hình cát/đá, bờ nước, đường tiếp cận; dấu chân không đặt giữa nước. |

#### Quidditch World Cup — thành phần phòng/không gian

| Phạm vi | Phòng/điểm theo nguồn hoặc theo RP | Recipe tham khảo | Nội thất/bố trí chi tiết (minh họa; không phải floor plan canon) |
|---|---|---|---|
| Ngoài | Campsite | `OUT_CAMP` | Nhiều lều có khoảng đi, bãi trống và các khu dịch vụ do RP xác định. |
| Ngoài | Main Stadium | `OUT_LAWN` | Sân và các khán đài theo quy mô RP, không dùng `pitch-static` Hogwarts. |
| Ngoài | Approach / Perimeter | `OUT_COURTYARD` | Lối vào, hành lang tiếp cận các khán đài, khu rìa hoạt động; không tự dựng tuyến canon. |

#### Azkaban — thành phần phòng/không gian

| Phạm vi | Phòng/điểm theo nguồn hoặc theo RP | Recipe tham khảo | Nội thất/bố trí chi tiết (minh họa; không phải floor plan canon) |
|---|---|---|---|
| Tòa | Exterior | `OUT_BUILDING_YARD` | Khối công trình cách biệt, tường, cổng và bờ/địa hình sát công trình theo RP. |
| Trong nhà | Cell corridors | `PASSAGE_PROPS` | Hành lang giam hẹp, cửa các buồng, đèn và nhịp tường. |
| Trong nhà | Cells | `DETENTION_CELL` | Các ô giam, giường/tấm nằm và cửa chắc; số phòng/nhân vật chỉ theo RP. |

#### Horcrux Sea Cave — thành phần phòng/không gian

| Phạm vi | Phòng/điểm theo nguồn hoặc theo RP | Recipe tham khảo | Nội thất/bố trí chi tiết (minh họa; không phải floor plan canon) |
|---|---|---|---|
| Ngoài | Cave entrance | `OUT_WATERSIDE` | Miệng hang đá sát vùng nước/đá, lối vào an toàn đúng cảnh. |
| Trong hang | Underground Lake | `OUT_WATERSIDE` | Hồ ngầm là vùng không đặt NPC đứng tự do, rìa đá và lối tiếp cận rõ. |
| Trong hang | Island | `OUT_COURTYARD` | Đảo/khối đất giữa hồ, điểm RP đặt ở vùng đất hợp lệ, không chế thêm cầu. |
| Trong hang | Ritual focus (nếu RP) | `CEREMONY_HALL` | Bệ/vật kỳ lạ chỉ khi được PC biết; không tiết lộ nội dung Horcrux ẩn. |

#### Knight Bus — thành phần phòng/không gian

| Phạm vi | Phòng/điểm theo nguồn hoặc theo RP | Recipe tham khảo | Nội thất/bố trí chi tiết (minh họa; không phải floor plan canon) |
|---|---|---|---|
| Xe | Boarding / Stairs | `ENTRANCE_VESTIBULE` | Bậc lên xe, trục đi dọc và điểm lên tầng tùy cảnh. |
| Xe | Passenger space | `BEDROOM` | Giường/ghế di động hoặc chỗ đứng theo RP, không thêm NPC hành khách khi Gemini không gửi. |
| Xe | Driver / front area | `OFFICE` | Bộ phận điều khiển đầu xe và cửa liên quan, không nhúng simulation lái xe. |

**Lưu ý:** Các nhóm/địa điểm World khác đã có trong mục 5.1–5.3 nhưng Atlas nguồn không cung cấp danh sách phòng riêng; khi phát sinh RP, dùng room/function thực được Gemini xác định và cùng quy tắc dựng minh họa, không tự cấp mã canonical chưa tồn tại.

## 6. AU đã có trong Atlas — 4 cluster, 43 phòng

Các AU là tên riêng trong Atlas nguồn; trạng thái `ACTIVE/LOCKED` lưu làm dữ liệu bối cảnh, không tự động từ chối `/map` nếu RP đã hợp thức hoá vị trí. Các miêu tả hình của phòng AU là hướng dựng minh họa khi source chỉ ghi tên/công năng. Chỉ thêm nội thất theo RP thực tế.

### 6.1. `AU-PC-HOME` — PC Home — London (status nguồn: `ACTIVE`)

**Bố cục:** nhà PC London, hầm dưới + F1 sinh hoạt + F2/F3 ngủ/học + attic; cầu thang liên tầng, sân sau và phòng sinh hoạt. Bản vẽ và đồ đạc thực tế phụ thuộc RP, không mặc định số người.

| Room ID nguồn | Tên/độ cao | Recipe nguồn hoặc gợi ý | Nội thất/không gian minh họa |
|---|---|---|---|
| `AU-PC-HOME:basement-utility` | Utility [Basement] | `UTILITY_ROOM` · nguồn | Ống, van, lò, máy móc, tủ đồ bảo trì; rõ vùng thiết bị. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `AU-PC-HOME:basement-laundry` | Laundry [Basement] | `LAUNDRY` · nguồn | Bồn giặt, giá phơi/sấy, bàn gấp đồ và kệ khăn vải. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `AU-PC-HOME:basement-store` | Store [Basement] | `STORAGE` · nguồn | Kệ/rương/thùng theo vật liệu lưu trữ của phòng; chừa lối giữa kệ và khoảng thao tác cạnh cửa. |
| `AU-PC-HOME:basement-workshop` | Workshop [Basement] | `WORKSHOP` · nguồn | Bàn chế tác, bảng treo công cụ, nguyên liệu, khu thử/đồ nghề. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `AU-PC-HOME:f1-hall` | Hall [F1] | —; gợi ý `ENTRANCE_VESTIBULE` (minh họa) | Không gian chuyển tiếp, cửa và mảng tường định hướng, lối đi chính mở; quầy/ghế chờ hoặc giá treo nếu đúng tên phòng. |
| `AU-PC-HOME:f1-living` | Living [F1] | `LOUNGE` · nguồn | Ghế sofa/ghế bành theo nhóm, bàn trà, lò sưởi nếu hợp cảnh, góc đọc. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `AU-PC-HOME:f1-dining` | Dining [F1] | —; gợi ý `DINING_ROOM` (minh họa) | Bàn ăn, ghế phù hợp số người, tủ bát và đèn. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `AU-PC-HOME:f1-kitchen` | Kitchen [F1] | `KITCHEN` · nguồn | Khu bếp/sơ chế hoặc luân chuyển thực phẩm, bàn thao tác, thùng và kệ đúng vai trò phòng. |
| `AU-PC-HOME:f1-rear-porch-garden` | Rear Porch/Garden [F1] | —; gợi ý `OUT_BUILDING_YARD` (minh họa) | Ngoại cảnh liên quan công trình: nền/đường đi, cây/cảnh quan, bậc ra vào và vật đặc thù địa điểm; không nhân thêm nhà nếu RP không có. |
| `AU-PC-HOME:f2-master-bedroom` | Master Bedroom [F2] | `BEDROOM` · nguồn | Giường, rương/tủ cá nhân và lối đi giữa giường; chỉ thêm đồ cá nhân đã có trong RP. |
| `AU-PC-HOME:f2-study` | Study [F2] | `STUDY_ROOM` · nguồn | Bàn đọc, ghế và tủ sách/đèn, nhóm bàn theo số người dùng; lối đi yên tĩnh ở giữa. |
| `AU-PC-HOME:f2-bath` | Bath [F2] | —; gợi ý `BATHROOM` (minh họa) | Khu chậu rửa, nguồn nước, khăn và buồng/thiết bị phù hợp; bề mặt đá/gạch chống ẩm. |
| `AU-PC-HOME:f3-pc-s-room` | PC's Room [F3] | —; gợi ý `STUDY_ROOM` (minh họa) | Nhóm bàn đọc, đèn, kệ sách và ghế; chừa lối yên tĩnh giữa các nhóm. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `AU-PC-HOME:f3-guest-room` | Guest Room [F3] | —; gợi ý `BEDROOM` (minh họa) | Giường, tủ, rương cá nhân, bàn đầu giường và bàn viết tùy người ở. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `AU-PC-HOME:attic-hobby-room` | Hobby Room [Attic] | —; gợi ý `STUDY_ROOM` (minh họa) | Nhóm bàn đọc, đèn, kệ sách và ghế; chừa lối yên tĩnh giữa các nhóm. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `AU-PC-HOME:attic-loft-store` | Loft Store [Attic] | `STORAGE` · nguồn | Kệ/rương/thùng theo vật liệu lưu trữ của phòng; chừa lối giữa kệ và khoảng thao tác cạnh cửa. |

### 6.2. `AU-CCC-07-18` — CCC 07.18 — Hogwarts F8W (status nguồn: `ACTIVE`)

**Bố cục:** khu CCC thuộc Hogwarts F8W, phòng chờ → thư từ/viết → hồ sơ/họp. Pointer từ F8W; không nhân đôi địa điểm trên hai owner.

| Room ID nguồn | Tên/độ cao | Recipe nguồn hoặc gợi ý | Nội thất/không gian minh họa |
|---|---|---|---|
| `AU-CCC-07-18:anteroom` | Anteroom | `RECEPTION` · nguồn | Quầy, ghế chờ, bảng tin, chỗ đứng/trao đổi. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `AU-CCC-07-18:inter-house-mail-room` | Inter-House Mail Room | —; gợi ý `STUDY_ROOM` (minh họa) | Nhóm bàn đọc, đèn, kệ sách và ghế; chừa lối yên tĩnh giữa các nhóm. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `AU-CCC-07-18:writing-room` | Writing Room | —; gợi ý `STUDY_ROOM` (minh họa) | Nhóm bàn đọc, đèn, kệ sách và ghế; chừa lối yên tĩnh giữa các nhóm. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `AU-CCC-07-18:records-store` | Records Store | `ARCHIVE` · nguồn | Kệ/rương/thùng theo vật liệu lưu trữ của phòng; chừa lối giữa kệ và khoảng thao tác cạnh cửa. |
| `AU-CCC-07-18:inter-house-meeting-room` | Inter-House Meeting Room | `MEETING_CLUB` · nguồn | Bàn họp nhóm, ghế, bảng ghi chú, kệ tài liệu liên Nhà; bố trí theo số người thật. |

### 6.3. `AU-LIAD-S-ATTIC` — Liad's Attic — Hogwarts (status nguồn: `ACTIVE`)

**Bố cục:** gác mái đơn lẻ, nguồn chỉ có tên phòng; cửa/mái/ngủ/đồ cá nhân cần dựa trên RP.

| Room ID nguồn | Tên/độ cao | Recipe nguồn hoặc gợi ý | Nội thất/không gian minh họa |
|---|---|---|---|
| `AU-LIAD-S-ATTIC:liad-s-attic-loft` | Liad's Attic Loft | `BEDROOM` · nguồn | Gác mái trần dốc, giường/khu ngủ và góc sinh hoạt cá nhân theo RP; thông số riêng chưa được Atlas nguồn xác nhận. |

### 6.4. `AU-WHITECAP-ESTATE` — Whitecap Estate — Isle of Wight (status nguồn: `LOCKED`)

**Bố cục:** điền trang Isle of Wight gồm khuôn viên villa, vườn, hồ bơi, bãi biển, guesthouse, coop, dock và F1/F2/attic. Trạng thái nguồn `LOCKED/UNBUILT` không ngụ ý cấm hiển thị sau khi RP đã đưa PC tới nơi.

| Room ID nguồn | Tên/độ cao | Recipe nguồn hoặc gợi ý | Nội thất/không gian minh họa |
|---|---|---|---|
| `AU-WHITECAP-ESTATE:grounds-villa` | Villa [Grounds] | —; gợi ý `OUT_BUILDING_YARD` (minh họa) | Ngoại cảnh liên quan công trình: nền/đường đi, cây/cảnh quan, bậc ra vào và vật đặc thù địa điểm; không nhân thêm nhà nếu RP không có. |
| `AU-WHITECAP-ESTATE:grounds-garden` | Garden [Grounds] | —; gợi ý `OUT_GARDEN` (minh họa) | Ngoại cảnh liên quan công trình: nền/đường đi, cây/cảnh quan, bậc ra vào và vật đặc thù địa điểm; không nhân thêm nhà nếu RP không có. |
| `AU-WHITECAP-ESTATE:grounds-pool` | Pool [Grounds] | —; gợi ý `OUT_WATERSIDE` (minh họa) | Ngoại cảnh liên quan công trình: nền/đường đi, cây/cảnh quan, bậc ra vào và vật đặc thù địa điểm; không nhân thêm nhà nếu RP không có. |
| `AU-WHITECAP-ESTATE:grounds-beach` | Beach [Grounds] | —; gợi ý `OUT_WATERSIDE` (minh họa) | Ngoại cảnh liên quan công trình: nền/đường đi, cây/cảnh quan, bậc ra vào và vật đặc thù địa điểm; không nhân thêm nhà nếu RP không có. |
| `AU-WHITECAP-ESTATE:grounds-guesthouse` | Guesthouse [Grounds] | —; gợi ý `ENTRANCE_VESTIBULE` (minh họa) | Ngoại cảnh liên quan công trình: nền/đường đi, cây/cảnh quan, bậc ra vào và vật đặc thù địa điểm; không nhân thêm nhà nếu RP không có. |
| `AU-WHITECAP-ESTATE:grounds-coop` | Coop [Grounds] | —; gợi ý `OUT_BUILDING_YARD` (minh họa) | Ngoại cảnh liên quan công trình: nền/đường đi, cây/cảnh quan, bậc ra vào và vật đặc thù địa điểm; không nhân thêm nhà nếu RP không có. |
| `AU-WHITECAP-ESTATE:grounds-dock` | Dock [Grounds] | —; gợi ý `OUT_WATERSIDE` (minh họa) | Ngoại cảnh liên quan công trình: nền/đường đi, cây/cảnh quan, bậc ra vào và vật đặc thù địa điểm; không nhân thêm nhà nếu RP không có. |
| `AU-WHITECAP-ESTATE:f1-hall` | Hall [F1] | —; gợi ý `ENTRANCE_VESTIBULE` (minh họa) | Không gian chuyển tiếp, cửa và mảng tường định hướng, lối đi chính mở; quầy/ghế chờ hoặc giá treo nếu đúng tên phòng. |
| `AU-WHITECAP-ESTATE:f1-living` | Living [F1] | `LOUNGE` · nguồn | Ghế sofa/ghế bành theo nhóm, bàn trà, lò sưởi nếu hợp cảnh, góc đọc. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `AU-WHITECAP-ESTATE:f1-dining` | Dining [F1] | —; gợi ý `DINING_ROOM` (minh họa) | Bàn ăn, ghế phù hợp số người, tủ bát và đèn. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `AU-WHITECAP-ESTATE:f1-library` | Library [F1] | `LIBRARY` · nguồn | Dãy kệ, các bàn đọc, thang lấy sách, quầy quản lý, khoảng đi giữa dãy. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `AU-WHITECAP-ESTATE:f1-d-d-room` | D&D Room [F1] | —; gợi ý `STUDY_ROOM` (minh họa) | Nhóm bàn đọc, đèn, kệ sách và ghế; chừa lối yên tĩnh giữa các nhóm. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `AU-WHITECAP-ESTATE:f1-kitchen` | Kitchen [F1] | `KITCHEN` · nguồn | Khu bếp/sơ chế hoặc luân chuyển thực phẩm, bàn thao tác, thùng và kệ đúng vai trò phòng. |
| `AU-WHITECAP-ESTATE:f1-veranda` | Veranda [F1] | —; gợi ý `OUT_GARDEN` (minh họa) | Ngoại cảnh liên quan công trình: nền/đường đi, cây/cảnh quan, bậc ra vào và vật đặc thù địa điểm; không nhân thêm nhà nếu RP không có. |
| `AU-WHITECAP-ESTATE:f1-sunroom` | Sunroom [F1] | —; gợi ý `STUDY_ROOM` (minh họa) | Nhóm bàn đọc, đèn, kệ sách và ghế; chừa lối yên tĩnh giữa các nhóm. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `AU-WHITECAP-ESTATE:f2-family-guest-bedrooms` | Family/Guest Bedrooms [F2] | `BEDROOM` · nguồn | Giường, rương/tủ cá nhân và lối đi giữa giường; chỉ thêm đồ cá nhân đã có trong RP. |
| `AU-WHITECAP-ESTATE:f2-lounge` | Lounge [F2] | `LOUNGE` · nguồn | Ghế sofa/ghế bành theo nhóm, bàn trà, lò sưởi nếu hợp cảnh, góc đọc. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `AU-WHITECAP-ESTATE:f2-balcony` | Balcony [F2] | —; gợi ý `OUT_GARDEN` (minh họa) | Ngoại cảnh liên quan công trình: nền/đường đi, cây/cảnh quan, bậc ra vào và vật đặc thù địa điểm; không nhân thêm nhà nếu RP không có. |
| `AU-WHITECAP-ESTATE:attic-loft` | Loft [Attic] | —; gợi ý `ENTRANCE_VESTIBULE` (minh họa) | Lối vào thoáng, bảng chỉ dẫn, ghế/tủ hai bên, cửa liên thông. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |
| `AU-WHITECAP-ESTATE:attic-store` | Store [Attic] | `STORAGE` · nguồn | Kệ/rương/thùng theo vật liệu lưu trữ của phòng; chừa lối giữa kệ và khoảng thao tác cạnh cửa. |
| `AU-WHITECAP-ESTATE:attic-hobby` | Hobby [Attic] | —; gợi ý `STUDY_ROOM` (minh họa) | Nhóm bàn đọc, đèn, kệ sách và ghế; chừa lối yên tĩnh giữa các nhóm. Điều chỉnh tỉ lệ, số lượng và hướng theo quy mô phòng RP. |

### 6.5. Các AU nguồn có tên nhưng chưa có room ID

| Tên | Scope có thể chọn | Ghi chú minh họa và tính tương thích |
|---|---|---|
| **7 Rowan Mews** | `LONDON` / `custom` theo vị trí RP | Địa điểm AU London, Atlas nguồn chỉ ghi tên; tạo sơ đồ RP theo mô tả khi PC đến, không tự coi trạng thái LOCKED là cấm visualize. |
| **WzW House** | `LONDON` / `custom` theo vị trí RP | Nhà AU khu Soho; quy mô và phòng chưa được Atlas nguồn mô tả, dùng công năng từ RP. |
| **Loft 5A** | `LONDON` / `custom` theo vị trí RP | Loft AU Fitzrovia; ưu tiên căn hộ/phòng lớn linh hoạt, không giả có nhiều phòng khi chưa được kể. |
| **Grayhaven Estate** | `TRANSIT_AND_INTL` / `custom` theo vị trí RP | Điền trang AU California; dựng khuôn viên/công trình theo RP, không tự vẽ một kiến trúc canon. |

## 7. Quy tắc xây Generated — đủ mô tả nhưng không biến thành game

### 7.1. Indoor

1. Xác định scope/cụm; lấy **100% phòng có trong cluster** và pointer đúng, rồi thêm những phòng RP mới, không bí mật hóa bằng việc bỏ phòng nguồn. Nếu World building chưa có room registry hoàn chỉnh, dùng thành phần nguồn + RP mà không tự tăng room count tùy tiện.
2. Chọn topology `layout` từ Atlas làm **khởi điểm**, áp ràng buộc cửa/cầu thang/sân/giếng tháp; nới/kéo/phân nhánh theo số phòng & RP, không cố ép tất cả phòng cùng cỡ.
3. Mỗi phòng chọn `type/recipe`, lấy `instances` làm **gợi ý**, không cố định toàn bộ nội thất: phòng ngủ phải có giường, kho có kệ, văn phòng có bàn; ưu tiên thay đổi RP và thông tin nguồn thực.
4. Đồ treo tường gắn theo wall mount, đồ trên bàn là surface child, đồ nền đứng sàn; đặt bố trí hợp chức năng, không random vô nghĩa hoặc nhân đôi bàn/ghế. Đồ đặc thù nằm ở vùng thích hợp, không chắn cửa, lối đi, ngưỡng/giếng thang.
5. Đồ/không gian mới: `catalog exact → ghép/đổi scale nguyên liệu → shape/vector có cấu trúc an toàn do Gemini đã gửi → fallback hình trung tính đúng ý nghĩa`, cùng một pipeline đặt và style. Trường hình bị lỗi chỉ fallback đối tượng đó.

### 7.2. Outdoor

1. Sử dụng 8 `OUT_*` như bộ bố trí gợi ý, không phải 8 scene cố định. Chọn nền/tầng cây/nước/đường/công trình dựa trên cảnh RP; chỉ dựng phần PC đang nhìn/địa điểm kề cần thiết.
2. Tạo tỉ lệ công trình/cảnh quan và các cụm nội thất sân; đường đi không tự tạo lore canon mới. Có thể là một sân đơn không cần tuyến đường phức tạp.
3. Kiểm nước, tường, mặt mái, công trình, vực và vật cản lớn là vùng không đặt dấu chân. Không dùng gameplay pathfinding hoặc AI thứ hai để định vị.

### 7.3. NPC, nhóm, POI, inspector

| Đối tượng | Quy tắc bất biến hiển thị |
|---|---|
| PC | Marker riêng, ở `pcPlace/pcSpot` do Gemini quyết định; không tính vào 10 ribbon NPC/nhóm. |
| NPC cá nhân/nhóm | Tối đa **10 ribbon tên**; Gemini tự nhóm trước khi xuất, code không cắt mất. Click mở hoạt động ngắn và vị trí ngắn. |
| Nhóm 3–5 | Click mở danh sách tên thành viên ở sidebar; activity/location ngắn. |
| Nhóm đông hơn | Click mở tên/mô tả ngắn nhóm (ví dụ Slytherin, Quidditch), không buộc liệt kê mọi thành viên. |
| `?` | Clue/quest hidden chỉ khi PC đã thấy tín hiệu và có quyền biết; chưa phát hiện không gửi trong `MAP_DATA`. |
| `!` | Hoạt động/quest thường tại địa điểm. Không dùng kính lúp theo plan cũ. |
| Footsteps/X-Ray | Theo marker/anchor, tường và vùng đặt hợp lệ; không bẻ vị trí RP, chỉ xử lý hình hiển thị. |

## 8. Đối chiếu hai bản Atlas, hợp đồng và tiêu chí tích hợp

- **GitHub Master (file này):** ID/source + tất cả phòng nguồn + mô tả dựng hình + recipe/cách bố trí; World bổ sung chi tiết ở mục 5 là mục tiêu cần chuyển vào registry mới, không giả đã có room ID.
- **Gemini MIN:** chỉ Fixed ID, cluster/vùng/AU alias, tên địa điểm và quy tắc chọn; nội thất thường theo từ công năng 41 tag; không liệt kê 348 anchor, 242/43 room hay 450 asset.
- **Một contract:** Gemini xuất `MAP_DATA`, `meta`, `atlasAnchor`, `pcPlace`, `pcSpot`, `places[]`, `actors[]`, `events[]`, tùy chọn mô tả vị trí World/AU/Custom, props, zone, hình mới an toàn. `pcPlace` và khu/vũ trụ luôn xác định; optional thật sự mới có thể bỏ.
- **Không lấy prompt runtime cũ làm chuẩn:** baseline `docs/MAP_PROMPT.md` vẫn có `templateState` can thiệp Fixed, icon quest kính lúp, logic cũ và SHA loader cũ. Phải cập nhật code/contract/loader sau duyệt Atlas; hai file Markdown này chưa đồng nghĩa code đã tiêu thụ mọi trường mới.
- **Chỗ source có xung đột:** H1 có một anchor hiển thị Nhà Cú nhưng routing owner chốt `h2`; F1 S và E hầm có pointer đến Fixed; World 3 scope `rooms:[]`; AU LOCKED theo tài liệu cũ không nên phủ quyết RP đã thực; các tên phòng `→` là pointer, không phải duplicate.

### 8.1. Ví dụ routing kiểm thử

| Vị trí PC / tình huống | `atlasAnchor` | Hình được phép dựng |
|---|---|---|
| Hagrid’s Hut, hiện không có thay đổi kiến trúc AU | `h1` | Nguyên Fixed và marker công trình |
| Owlery, phòng chim bị thương | `h2` | Nguyên Fixed và anchor Nhà Cú |
| Đại Sảnh | `hall` | Nguyên Fixed, không thêm bàn |
| Phòng DADA F2W | `F2-W` | Toàn cluster F2-W; lớp DADA có recipe CLASSROOM |
| Phòng Hiệu trưởng trong tháp | `TOWER-HEADMASTER-S-N-CENTER` | Dựng cluster tháp và HEADMASTER_OFFICE |
| Bên trong Honeydukes | `village-static` | Fixed Hogsmeade, POI nhà hiện có |
| Tiệm AU mới trong Hogsmeade | `village-static` | Gán nhà dân trống ổn định, không sửa artwork |
| Tiệm AU mới ở Knockturn Alley | `diagon-knockturn` + `region=knockturn` | Gán khối `ka-block-*` trống |
| Nhà AU mới tại grounds H2, không có trên artwork | `custom` | Sandbox outdoor/indoor mới theo RP |
| Đang đứng tại sân ga Hogsmeade | `express` | Anchor nhà ga, không chuyển vào toa |
| Đang ngồi toa Hogwarts Express | `express` | Buồng/nhóm toa đúng ID `coach-*` |
| Malfoy Manor Drawing Room | `ENGLAND_REGIONS` | Dựng khu/phòng manor phù hợp, recipe LOUNGE |
| Bệnh viện St Mungo’s F4 | `LONDON` | Dựng khoa Spell Damage và Janus Thickey Ward |
| Nhà riêng PC tại Nhật Bản không có Atlas | `custom` | Sandbox theo địa chỉ/cảnh RP, không từ chối |

### 8.2. Checklist kiểm tra trước khi tích hợp lên repo

- [ ] 13 ID Fixed / 348 ID anchor giữ nguyên, không phát minh template thứ 14.
- [ ] 52 cluster Hogwarts / 242 phòng giữ đủ, không gộp hướng N/E/S/W hoặc cắt mã nguồn.
- [ ] 4 AU cluster / 43 phòng giữ đủ, AU source-status không tự thành cổng chặn visual RP.
- [ ] 49 recipe / 509 instance tham chiếu asset có thật; ID `OUT_*` giữ nguyên; asset thiếu fallback từng đối tượng.
- [ ] Ba vùng World thêm registry chi tiết không sinh fake atlasAnchor trong prompt; place names/alias phân biệt được phòng trùng tên.
- [ ] Binding AU trong làng/2 hẻm ổn định và không ghi đè 22/15/16 nhà trống hoặc tiệm canon.
- [ ] Chọn đúng 3 đường Fixed / Atlas / Custom; 13 Fixed không bị sửa hình.
- [ ] Max 10 ribbon và icon `?`/`!`, Gemini là nguồn NPC/hoạt động/quest, code không tự cắt/tạo.
- [ ] `MAP_DATA` hợp lệ render được kể cả thiếu asset; lỗi transport/CDN vẫn báo trung thực.
- [ ] Kiểm thẩm mỹ mẫu sandbox trước nhân rộng; AI Studio Preview nghiệm thu cuối.

---

**Phạm vi bàn giao:** Tài liệu `WZW_MAP2_ATLAS_GITHUB_MASTER.md` — đặc tả nguồn để triển khai sau duyệt. Không sửa repo, không push GitHub, không khẳng định runtime đã tương thích các mục World/hình mới.
