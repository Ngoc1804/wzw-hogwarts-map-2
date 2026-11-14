# MAP_DATA — bảng GitHub / Gemini để duyệt

Trạng thái: **CHỜ DUYỆT quy ước prompt**. Chỉ phần tích hợp size được triển khai trong lượt này; chưa sửa system prompt, quota quest, zoom, footer hoặc CDN của prompt legacy.

Nền chuẩn: M2-P01-baseline-loader tại 3c6a8674. Nguồn S/M/L: ATLAS_CAN_DUYET tại 3615b31d, tools/build-layout-review.py. Màu dùng mặc định FINAL theo chỉ dẫn người dùng. Prompt đối chiếu: bản WzW · Hogwarts Year 2 được người dùng gửi, phần R14.6 MAP_DATA và R/W/C đi kèm.

## Ai làm gì — đã chốt bởi người dùng

| Việc | Gemini / prompt | GitHub / engine |
|---|---|---|
| NPC, Monthly Pack, MAIN/SIDE/HIDDEN/POOL | Đọc, chọn, xây nội dung và xét mọi điều kiện | Không lưu registry, không chọn hay xét điều kiện cốt truyện |
| Số quest, ngày Hidden, tri thức PC | Gemini chịu trách nhiệm trước khi gửi | Chỉ hiển thị payload; không tự thêm/cắt/chọn quest |
| ID NPC/quest trong RP | Prompt quản lý nếu cần | Không yêu cầu registry hoặc ID quest bắt buộc |
| ID kỹ thuật map/phòng/recipe/asset/instance | Gửi đúng loại ID khi cần | Tra dữ liệu kỹ thuật để dựng/neo/chỉnh đồ |
| Fixed | Gửi metadata, actor/event | Giữ artwork và kích thước; không sửa props |
| Generated | Gửi phòng, type, size, thay đổi nội thất | Dựng theo layout và nội thất |
| Màu | Không cần yêu cầu phối màu | Dùng mặc định; không áp bảng màu thử nghiệm của nhánh duyệt |

## Root và nội dung đầu map

“Bắt buộc” ở cột cuối là quy tắc đề xuất cho Gemini. Không có nghĩa code hiện đã từ chối mọi field thiếu.

| Trường | GitHub hiện làm gì | Gemini hiện ghi gì | Đề xuất để duyệt |
|---|---|---|---|
| schemaVersion | Nhận 2.0.0; version khác bị invalid; thiếu version có diagnostic | Bắt buộc 2.0.0 | Giữ bắt buộc 2.0.0 |
| meta.date | Hiển thị chuỗi; không xét gate quest | DD/MM/YYYY, ngày RP | Giữ; không lấy ngày máy |
| meta.time | Hiển thị chuỗi | HH:mm, giờ RP | Giữ; /MAP không tiến giờ |
| meta.areaName | Hiển thị tên khu vực | Tên vùng đang xem | Bắt buộc, ngắn |
| meta.quote | Hiển thị chuỗi; không tự tạo quote | Một câu ngắn vui/gợi nhẹ | Đúng một câu; PC-safe |
| atlasAnchor | Chọn Fixed/cluster/World/custom; nhận alias scope | ID owner W4 theo PC | Giữ canonical owner; không lấy nơi NPC xa làm owner |
| pcPlace | Resolve ID hoặc tên duy nhất; thiếu/unknown làm invalid | Vị trí PC đã xác định | Bắt buộc; ưu tiên ID phòng thật, tên duy nhất vẫn hợp lệ |
| pcSpot | inside/corridor/threshold/outdoor; outside thành outdoor | Một trong bốn giá trị | Bắt buộc gửi rõ |
| places | Fixed cập nhật metadata; cluster mở phòng nguồn; custom cần nơi khai báo | Mảng, có thể rỗng | Giữ; không gửi lại toàn bộ Fixed/recipe |
| actors | Cần đúng một PC; giữ NPC/nhóm; trên 10 NPC ribbon diagnostic | Một PC, NPC có mặt, tối đa 10 ribbon NPC | Giữ một PC; Gemini nhóm đúng nguồn, engine không cắt |
| events | Lọc bản ghi thiếu title; render nội dung/location/hidden | Có đoạn cho phép rỗng hoặc 0–3 SIDE/POOL | Prompt đổi theo yêu cầu đủ 3 SIDE/POOL; engine không kiểm quota |
| mapMode | indoor/outdoor quyết định Generated; template giữ định tuyến | Tùy chọn indoor/outdoor | Chỉ gửi khi cần; không dùng để đổi Fixed |
| layoutType | Chọn 10 preset hành lang cho Generated | horizontal/vertical/windows/ell/tee/cross/court/cloister/curved/tower | Giữ tùy chọn; không phải ID recipe nội thất |
| forceSandbox | Ép Generated | Khi người dùng yêu cầu sơ đồ riêng | Giữ tùy chọn true |
| region | Gán nhà AU đúng diagon/knockturn; nhận root hoặc place | Khi map hẻm cần phân khu | Giữ theo routing; không phải trường quest |

## Places và S/M/L

| Trường | GitHub hiện làm gì | Gemini hiện ghi gì | Đề xuất để duyệt |
|---|---|---|---|
| id | Khóa phòng, resolve trước tên; Generated có thể dùng ID RP ổn định | ID phòng thật hoặc ID RP mới | Giữ; không đoán số phòng canon |
| name | Bắt buộc để normalize giữ place | Tên nơi | Giữ bắt buộc |
| type | Recipe ID hoặc alias công năng từ vocabulary | Recipe/alias như POTIONS_LAB/potions | Giữ; khác asset ID |
| description | Inspector Quan sát | Miêu tả cảnh vật quan sát được | Một câu ngắn |
| overhear | Inspector hoạt động của địa điểm | Nội dung thực sự nghe được | Một câu ngắn; không suy bí mật từ activity |
| size | Đã nối sizeProfiles S/M/L và artwork riêng từng size cho 41 layout Indoor; mặc định M; small/medium/large còn nhận | S→small; M bỏ field; L→large | Đề xuất gửi S/M/L trực tiếp; bỏ field vẫn M; không đổi Fixed |
| architecture | floor/wall theo whitelist trong Generated; không đổi Fixed | Tùy chọn vật liệu | Bình thường bỏ field để dùng mặc định; không yêu cầu Gemini phối lại màu |
| propsMode | merge mặc định; replace thay inventory Generated | merge/replace | Giữ; không áp trên Fixed |
| props | Đồ thay đổi Generated; props thiếu name bị lọc | Chuỗi hoặc object có name | Chỉ gửi delta cần thiết, không dump 509 instance |
| isNewConstruction | Trên H1/H2 chuyển scene sang sandbox | Có đoạn viết “ngoài H1/H2” | Sửa câu thành “công trình mới trong scope H1/H2”; hẻm/làng dùng binding nhà có sẵn |
| templateState | Không còn điều khiển Fixed đổi hình/detail | Không cần trong bản đặc tả mới | Loại khỏi hướng dẫn xuất |

## Props Generated

| Trường | GitHub hiện làm gì | Gemini cần gửi | Đề xuất để duyệt |
|---|---|---|---|
| name | Chuỗi tên bắt buộc; object thiếu name bị lọc | Tên món | Bắt buộc kể cả khi có item/id |
| item | Asset ID; không phải recipe | Khi cần đúng hình và biết ID | Tùy chọn; không tự đoán |
| id | Nhắm đúng instance; add có thể cấp ID mới không trùng | ID instance đã kiểm khi sửa món cụ thể | Không nhầm với item |
| count | Số nguyên không âm; ensure là tổng, add là tăng; state-only giữ tổng cũ | Khi cần thay số lượng | Giữ ngữ nghĩa; 0 xóa món |
| op | ensure mặc định / add | Theo thay đổi RP | Không dùng add để nhắm instance đã tồn tại |
| state | removed/missing/destroyed loại bỏ; broken đánh dấu trạng thái | Trạng thái đã xảy ra | Giữ; không tự phát sinh hư hại |
| zone | Gợi ý vị trí tương đối | Chỉ khi cần | Không gửi tọa độ |
| mount | floor/wall/surface | Chỉ khi cần | surface cần parent có thật |
| parentId | ID inventory instance mẹ/mặt đỡ | ID đã kiểm | Tùy chọn, không đoán bàn khác |
| childId | Token data-prop/data-piece trong asset | Token đã kiểm + parentId | Không có token thật thì mô tả, không giả đã chỉnh đúng |
| visual | Grammar hình giới hạn, không nhận raw SVG/HTML/URL | Chỉ khi đồ mới cần hình tối thiểu | Tùy chọn nâng cao; bình thường bỏ |

## Actors, nhóm và event hiển thị

| Trường | GitHub hiện làm gì | Gemini cần gửi | Đề xuất để duyệt |
|---|---|---|---|
| actors[].name | Tên ribbon/Inspector | Tên NPC hoặc mô tả PC được biết; nhãn nhóm | Bắt buộc; không tiết lộ tên chưa biết |
| isPC | Phải có đúng một true | Một PC | Giữ |
| placeId/placeName | Neo vào phòng; ưu tiên placeId khi có | Nơi thuộc map | Gửi một tham chiếu rõ; pcPlace ưu tiên cho PC |
| spot/zone | Trạng thái vị trí và gợi ý tương đối | inside/corridor/threshold/outdoor + zone khi cần | Giữ; không dùng activity thay placement |
| tagType | Chọn palette ribbon | House/teacher/adult/patrol/animal/monster/ghost/unknown/crowd và trường quốc tế có sẵn | Dùng enum hiện hành, không suy nhà từ tên |
| activity | Nội dung hoạt động actor | Một câu ai đang làm gì | Giữ ngắn |
| observation | Mô tả actor trong Inspector | Một câu quan sát được | Giữ ngắn |
| members/summary | Một ribbon nhóm, mở chi tiết thành viên/tóm tắt | Tên thật đã biết hoặc summary nhóm | Gemini nhóm, engine không tự tạo thành viên |
| footstep | walk/idle/hidden; một số posture/inside tự ẩn chân | Theo cảnh | Mặc định hidden |
| posture | standing/sitting/lying/hidden | Khi có căn cứ | Giữ |
| placement/supportId | normal/on_furniture/in_wall; support nhắm instance | Chỉ khi có ngoại lệ xác nhận | Không đoán từ văn activity |
| onPatrol | Cờ tuần tra phục vụ marker | Chỉ true khi thực sự tuần tra | Không suy từ chức danh |
| actors[].id | Được giữ nhưng không tra NPC registry | Tùy prompt có cần hay không | Không bắt buộc cho render |
| events[].title | Tên marker và dòng Inspector | Tên ngắn | Bắt buộc |
| detail | Nội dung event | Tóm tắt ngắn được phép biết | Không chứa đáp án/bí mật chưa được nhận |
| placeId/placeName | Neo event lên phòng | Địa điểm thuộc map | Bắt buộc theo quy tắc xuất, tránh event không có nơi |
| hidden | false→ống nhòm; true→kính lúp; không xét ngày | Gemini đã xét điều kiện | Chỉ là cờ hiển thị; không phải phân loại/điều kiện quest |
| events[].id | Được giữ, không kiểm registry/trùng/gate | Tùy prompt | Không bắt buộc cho render |
| target | Có hỗ trợ cửa Generated; chưa binding mọi cấu kiện | Chỉ khi target thật được hỗ trợ | Nếu không rõ, neo cấp place |
| icon | normalize tự ghi !/?; UI dùng hình ống nhòm/kính lúp | Không cần gửi riêng | Dùng hidden; không nhầm ký hiệu nội bộ với hình UI |
| MAIN/SIDE/POOL/pack/stage/reward | Không dùng để quyết định nội dung | Gemini xử lý trong prompt | Không thêm vào payload chỉ để engine xét quest |

## Nội dung còn chờ duyệt ở prompt

1. Đổi “tối đa 3 / thiếu thì ít hơn / 0–3” thành **đủ 3 SIDE/POOL**, Pool do Gemini xây theo R/W/C; engine không đụng quota. MAIN thuộc nội dung prompt, không thêm cổng kiểm trong engine.
2. Hidden **0 hoặc 1** đúng gate do Gemini xét; chỉ xuất dấu hiệu PC được nhận biết.
3. Làm rõ cơ hội Pool hiển thị không đồng nghĩa PC đã nhận/tham gia/hoàn thành quest; /MAP không tiến thời gian.
4. Một quote ngắn, một PC, NPC thật/nhóm phù hợp; tối đa 10 ribbon NPC không tính PC.
5. S/M/L dùng size của layout, mặc định M. Đề xuất prompt gửi S/M/L trực tiếp, engine vẫn nhận small/medium/large cũ.
6. Fixed không sửa props; màu mặc định; không đưa zoom/viewport vào MAP_DATA.
7. Root fields, props name và event location phải ghi rõ trong prompt. Không thêm registry/version cốt truyện vào engine.

## Tách việc đã làm với việc chưa làm

Đã triển khai: chuyển generator H40/S/M/L và các sửa phục vụ review từ nhánh duyệt, giữ màu FINAL mặc định, compile bố trí đồ theo size, nối sizeProfiles vào Generated Indoor, giữ ID instance. Multi-room tiếp tục dùng geometry hành lang hiện có; đây không phải triển khai mới toàn bộ hình phòng đặc biệt của editor vào runtime. Outdoor không thay cơ chế size trong lượt xử lý nội thất này.

Chưa làm: viết lại prompt RP/R14.6 theo bảng, đổi CDN, sửa zoom/tag/icon, xóa footer, dọn repo, nghiệm thu Gemini/AI Studio Preview. Các việc này không bị báo đã hoàn thành từ test local.
