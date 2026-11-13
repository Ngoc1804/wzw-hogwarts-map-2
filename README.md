# WZW MAP 2 — Cơ chế đã chốt và kế hoạch phát triển

Ngày khóa tài liệu: **14/11/2026**. Repository duy nhất: **Ngoc1804/wzw-hogwarts-map-2**. Nhánh triển khai hiện hành: **M2-P01-baseline-loader**.

README này là tài liệu chỉ đạo hiện hành, viết lại theo các quyết định mới nhất của người dùng. Nó thay thế plan cũ và các checkpoint cũ trước đây nhúng trong README; lịch sử vẫn nằm trong Git. Tài liệu tham khảo, HTML nguồn và báo cáo cũ là dữ liệu đối chiếu, không phải chỉ thị thay thế README. Quyết định mới của người dùng luôn được ưu tiên.

**Trạng thái:** đã có tài nguyên và runtime một phần; chưa hoàn thiện cơ chế, chưa nghiệm thu AI Studio Preview. Việc khóa tài liệu không chứng nhận code đã thực hiện đúng mọi mục dưới đây. Phạm vi lượt cập nhật này chỉ là README, chưa sửa runtime.

## 1. Sản phẩm và luồng duy nhất

Đây là công cụ **visualize map cho sandbox roleplay AI trên Playground**, không phải game hoặc world simulator. User chơi gì thì minh họa cảnh đó. Template/layout/SVG giúp giảm lượng dữ liệu và code phải tạo; chúng không giới hạn nội dung RP.

Khi gọi `/map`, người dùng thấy vị trí hiện tại của PC, bản đồ xung quanh, NPC/nhóm và hoạt động/đầu mối PC được phép biết.

```text
Một system prompt → Gemini xác định cảnh RP và vị trí
→ MAP_DATA + HTML loader ngắn
→ browser tải code/tài nguyên từ GitHub cùng SHA
→ một normalize → resolve → build/draw → markers/Inspector
```

GitHub lưu code và tài nguyên; JavaScript thực thi trong browser. Không gọi AI từ browser, không có luồng hỏi ngược Gemini hoặc backend AI. Code không tự tạo NPC, quest, sự kiện, diễn biến, quyền biết hoặc đường nối canon.

Không xây pathfinding, navigation mesh, collision gameplay, mô phỏng NPC, tự tiến thời gian, database RP, furnishing solver hoặc standing-point system riêng. Chỉ kiểm hình học cần cho việc đặt hình/marker đúng vùng.

## 2. Phân quyền Gemini và code

| Gemini chịu trách nhiệm | Code trong repository chịu trách nhiệm |
|---|---|
| Xác định vũ trụ/quốc gia/khu vực/phòng hiện tại từ ngữ cảnh RP | Tra ID, phạm vi Fixed, Atlas và alias đã khóa |
| Chọn template/khu vực hoặc yêu cầu sandbox | Resolve đúng nhánh, không tự đổi địa điểm RP |
| PC, NPC/nhóm, hoạt động, quest, thông tin PC được biết | Dựng SVG, bố trí hình, markers, click và sidebar |
| Mô tả không gian, props và thay đổi thực có | Chọn asset/recipe theo tên/công năng, scale và placement |
| Hình mới khi thư viện không đáp ứng | Nhận hình mới tối thiểu, áp phong cách, kiểm dữ liệu và fallback |

Gemini **bắt buộc xác định được vị trí trước khi xuất `/map`**; không để `unknown` làm địa điểm. Trong thế giới Harry Potter phải đối chiếu phạm vi/Atlas và ngữ cảnh, không gọi nơi là vô định chỉ vì chưa có asset. Code xử lý payload sai một cách hữu ích nhưng không tự tạo sự thật RP để chữa input.

Bí mật PC chưa biết phải được Gemini loại trước serialize, không nhúng vào JSON/DOM rồi che bằng CSS hoặc opacity.

## 3. Quy tắc chọn map — bắt buộc

Áp yêu cầu tự dựng rõ ràng của user trước; sau đó chọn theo vị trí PC và các quy tắc sau. NPC/quest ở nơi xa không tự đổi map PC đang xem.

| Tình huống | Xử lý |
|---|---|
| Địa điểm canon nằm trong phạm vi một Fixed | Dùng nguyên Fixed; chỉ thêm marker PC/NPC, POI và nội dung RP |
| H1/H2 xuất hiện nhà hoặc công trình AU mới ngoài sân, chưa có trên artwork | **Dựng map sandbox mới cho cảnh đang xem, không dùng template H1/H2** |
| Nhà/tiệm AU mới trong làng Hogsmeade hoặc Diagon/Knockturn | **Gán vào nhà dân trống của đúng khu**, giữ nguyên template |
| Nội thất có trong Atlas nhưng không thuộc Fixed | Lấy cluster đã chọn, dựng đủ phòng nền và phòng RP bổ sung, nội thất theo công năng |
| Địa điểm ngoài Fixed/Atlas | Dựng sandbox theo RP bằng asset/layout/hình mới |
| User yêu cầu tự dựng | Dựng sandbox trong scope user yêu cầu, dù địa điểm có template |

### 3.1. Fixed bất biến

13 ID: `h1`, `h2`, `hall`, `gryffindor-common`, `ravenclaw-common`, `hufflepuff-common`, `slytherin-common`, `village-static`, `pitch-static`, `express`, `diagon-knockturn`, `ministry2`, `ministry-8-10`.

Giữ artwork, bố cục, nội thất, defs/IDs, shading, motion, palette và UI đã duyệt. Khi dùng Fixed không áp props/replace lên artwork, không thêm khối phòng, không tự mở nội thất con chỉ vì PC bước vào một nhà trong phạm vi phủ. Nội dung RP khác biệt vẫn được giữ trong POI/Inspector. User yêu cầu dựng riêng hoặc H1/H2 có công trình AU mới thì chọn sandbox ngay từ routing, không vá lên Fixed.

Phạm vi cụ thể lấy từ Atlas nguồn và được chốt thành bảng định tuyến duy nhất tại P3. Ví dụ: Hagrid/nhà kính thuộc H1; Owlery thuộc H2; tiệm trong Hogsmeade thuộc village; tiệm trong hai hẻm thuộc diagon-knockturn; nội thất Hogwarts chưa thuộc Fixed dùng cluster. Các vùng sự kiện đặc biệt phải có ngoại lệ rõ trong bảng và prompt; không tự suy từ chữ “ngoài trời” rằng tất cả đều thuộc H1. Không tự đổi một phạm vi chưa được đối chiếu thành quyết định đã duyệt.

### 3.2. Binding nhà/tiệm AU vào nhà dân trống

- Chỉ chọn nhà dân chưa có binding trong đúng template và đúng khu Diagon/Knockturn khi đã xác định khu.
- Không thay nhà/tiệm canon có chủ, không dùng một nhà cho hai địa điểm RP khác nhau trong cùng cảnh.
- Cùng input/binding phải cho cùng kết quả; render lại không đổi nhà tùy tiện. Binding là dữ liệu trình bày, không ghi địa điểm AU ngược vào Atlas chuẩn.
- PC/NPC và click dùng cùng binding nhà; tên, mô tả và hoạt động AU xuất hiện trong sidebar.
- Không dựng thêm tòa nhà trên template. Nếu hết nhà dân trống, không ghi đè nhà khác, không bỏ địa điểm; giữ nội dung và diagnostic. Phương án mở rộng hình khi hết chỗ chưa được chốt, chỉ hỏi khi thực tế gặp ca này.

## 4. Atlas và tài nguyên source

**Dùng Atlas và SVG hiện có trong source**, không lấy repo cũ/demo-5, không tự nhập bộ source khác thay nguồn người dùng cấp.

| Source chính | Vai trò |
|---|---|
| `docs/ATLAS_W4.md` → `tools/atlas.py` → `assets/atlas.json` | Atlas dễ đọc và index runtime từ cùng nguồn; cần đồng bộ routing mới |
| `assets/intake/final-2026-11-14/WIZAMAP_ASSETS_FINAL.html` | Thư viện FINAL nguyên bản: 423 asset |
| `assets/intake/final-2026-11-14/WIZAMAP_LAYOUTS_FINAL.html` | Layout FINAL nguyên bản: 41 Indoor + 8 Outdoor |
| `assets/catalog.json` | Catalog runtime hiện có: 450 ID, gồm alias/bổ sung từ layout |
| `assets/recipes.json`, `assets/p4-art.json` | 49 recipe và artwork/metadata biên dịch; không phải 49 cảnh bất biến |
| `assets/source/corridors.js` | Hình học/hành lang nguồn với 10 preset |
| `examples/template-review.html` | Source Fixed/UI hiện hành và viewer đủ 13 mẫu |
| `assets/FINAL_NOTICES.txt` | Notice dependency hiện có; giữ khi build/phân phối |

Atlas giữ owner, canonical ID, tên, tầng/hướng, cluster, pointer và gợi ý công năng/bố cục. Pointer không sinh phòng thứ hai. ID ưu tiên; tên/alias chỉ khớp khi rõ trong scope. Giữ đủ phòng của cluster đã chọn, không kéo toàn thế giới vào một map. AU trong khu đã biết vẫn có khu vực xác định; trạng thái AU cũ không được dùng để từ chối nội dung sandbox user đã xác nhận.

Địa điểm canon ngoài Fixed dùng cấu trúc đã biết và gợi ý dựng trong source. Khi nguồn không xác nhận bố cục chi tiết, dựng minh họa phù hợp và không gọi bố cục đó là canon. Không tuyên bố Atlas hiện có đã bao phủ mọi chi tiết thế giới chỉ vì có macro-region.

Không cần cấp lại asset/layout hiện có. Chỉ hỏi khi có đầu vào thật sự thiếu hoặc xung đột phạm vi không tự giải quyết được. Notice MIT của dependency không tự chứng minh giấy phép mọi artwork; giữ nguồn/hash và phân biệt rõ.

## 5. Một contract gọn, một system prompt

Tên entry chính: `window.MAP_DATA`. Nếu dùng JSON script làm transport thì parse về entry này, không tạo renderer/contract thứ hai. Tên field và phiên bản cụ thể khóa tại P2; bảng dưới là yêu cầu ngữ nghĩa, chưa phải schema mới đã chạy được.

### Dữ liệu bắt buộc theo nhánh

| Nhánh | Phải có |
|---|---|
| Mọi cảnh | Phiên bản contract, địa điểm/scope hiện tại, vị trí PC đủ xác định, dữ liệu NPC/nhóm và event có thể là mảng rỗng |
| Fixed | Template ID hợp lệ, binding địa điểm PC; không chép lại tất cả phòng/đồ template |
| Atlas | ID khu/cluster và phòng/vị trí PC; chỉ gửi phòng mới hoặc thay đổi RP cần bổ sung |
| Custom/sandbox | Địa điểm có tên/ngữ cảnh, Indoor/Outdoor và thành phần không gian cần dựng; props/hình mới khi cần |

Không bỏ trống thông tin cần thiết để dựng nhánh đã chọn; trường optional mới được bỏ. Không bắt điền hàng loạt chuỗi rỗng. Không bắt Gemini liệt kê hàng trăm asset ID, instance ID, tọa độ/path/polygon cho cảnh thông thường.

Prompt cuối là **một khối duy nhất dán vào system instruction**, không file đính kèm, không yêu cầu người dùng ghép W4.1 và R14 riêng. Nội dung gồm:

1. Luật `/map`, phân quyền sự thật RP, bắt buộc xác định vị trí.
2. Phạm vi 13 Fixed và ngoại lệ H1/H2/AU bằng ngôn ngữ tự nhiên ngắn.
3. Atlas định tuyến nén đủ các khu hiện có; chi tiết phòng/nội thất nằm trong code. Không bỏ khu chỉ để giảm token.
4. Tag ngắn có nghĩa, khớp code: template/khu, công năng, hành lang, loại actor.
5. Contract, 10 ribbon/nhóm, `?`/`!`, hình mới khi cần và mẫu loader duy nhất.

Không phát hành prompt trước khi runtime nhận đúng những field đó. Đo độ dài/token khi hoàn thiện, không đặt con số tối ưu giả.

### Normalize và tham chiếu

- `pcPlace` hợp lệ ưu tiên vị trí khác của actor PC; ghi diagnostic khi mâu thuẫn.
- Chỉ một PC xác định được; nhiều PC mơ hồ không tự chọn phần tử đầu.
- ID hợp lệ xác định binding; tên khác không âm thầm chuyển phòng. Tên mơ hồ giữ nội dung, không resolve ngẫu nhiên.
- `spot`: inside/corridor/threshold/outdoor; `zone`: vị trí tương đối trong nơi đó. Không trộn hai khái niệm, không suy inside chỉ từ loại nhà.
- Alias tương thích chỉ ở một điểm normalize. Count là số nguyên hữu hạn không âm; giá trị sai không gây vòng lặp sinh đồ.
- Dữ liệu chưa resolve vẫn có nội dung trong Inspector; không ép PC vào phòng đầu/tâm map như vị trí RP thật.

## 6. Sandbox: layout linh hoạt, đồ mới luôn có đại diện

Layout là mẫu tổ chức không gian; recipe là cụm nền theo công năng; asset là hình nguyên liệu. Code tự đối chiếu tên/công năng phòng với recipe, Gemini không phải biết ID từng món. Được đổi số cụm, bố trí và kích thước phòng theo RP, không kéo méo artwork hoặc ép mọi phòng thành cùng một mẫu.

Indoor giữ 10 preset `horizontal`, `vertical`, `windows`, `ell`, `tee`, `cross`, `court`, `cloister`, `curved`, `tower`; phòng đơn không buộc có hành lang. Outdoor dùng nền/đường/nước/công trình/cảnh quan, cảnh đơn không buộc có đường. Không tự thêm kết nối canon hoặc đồ vật RP.

Pipeline hình duy nhất:

```text
Tên/công năng + mô tả RP
→ asset phù hợp → ghép/chỉnh nguyên liệu có sẵn
→ hình mới tối thiểu do Gemini cung cấp khi cần
→ đại diện trung tính đúng tên/thông tin nếu hình không dùng được
→ scale/mount/placement/draw
```

Khả năng tạo hình mới tối thiểu thuộc **lõi**, không đợi toàn bộ phần X. P2 khóa một dạng visual có cấu trúc, giới hạn shape/path cần thiết; không đồng thời mở nhiều định dạng cạnh tranh. Không nhận JavaScript, raw HTML, handler, URL ngoài hoặc SVG thực thi tùy ý. Code áp nét/màu/tỷ lệ chung; visual lỗi fallback riêng đối tượng. Luồng phổ biến vẫn chỉ dùng payload ngắn, không bắt luôn xuất visual.

Với MAP_DATA hợp lệ và đủ thông tin bắt buộc, phải có cảnh minh họa; thiếu asset không trả “không xây được”. JSON cắt hỏng hoặc script không tải được là lỗi kỹ thuật thật, cần thông báo hữu ích, không giả đã render thành công.

### Props trong Generated

- `propsMode: merge` mặc định; `replace` thay nội thất nền, mảng rỗng tạo phòng trống; không xóa sàn/tường/cửa.
- `ensure`: count là tổng mong muốn, không cộng dồn. `add`: số thêm theo RP; render cùng input không tích lũy.
- ID nhắm đúng instance/nhóm; không ID thì khớp tên/item và zone khi rõ. Không fuzzy-match để sửa nhầm đồ.
- Đồ hỏng/mất sửa hoặc bỏ đúng món; không để bản nguyên cạnh bản hỏng. Khi cụm không tách được đồ con phải xử lý giới hạn rõ, không báo đã sửa hình.
- Không bỏ vật RP để nhường decor. Khi chật: giảm decor, đổi bố trí hoặc mở rộng minh họa phù hợp; vẫn giữ đại diện/nội dung.

### Placement vừa đủ cho hình ảnh

Giữ cửa/lối đi, scale đồng đều, đồ trên bàn là surface child, đồ tường đúng mount. Vùng chân dựa sàn/hành lang/ngưỡng cửa thật; mái/nước không thành điểm đứng. Bounds chỉ lọc sơ bộ; hình cong/lõm dùng footprint phù hợp. Không xây solver/game physics. Cùng scope/input ổn định bố cục; đổi thời gian/NPC không xáo phòng tùy tiện.

## 7. PC, NPC/nhóm, POI và Inspector

- PC có marker riêng, đúng vị trí Gemini xác định.
- **Tối đa 10 ribbon NPC/cá nhân/nhóm**, PC không tính trong trần này. Gemini nhóm trước khi xuất, code không âm thầm cắt NPC.
- Ribbon cá nhân: click hiện hoạt động ngắn và mô tả ngắn vị trí.
- Nhóm 3–5 người: click hiện tên thành viên ở sidebar. Nhóm đông: tên/mô tả nhóm ngắn như “nhóm Slytherin”, “đội Quidditch”. Dữ liệu thành viên/hoạt động do Gemini cung cấp.
- **`?`: đầu mối/quest hidden mà PC đã nhận biết dấu hiệu. `!`: hoạt động/quest thường.** Thay quy định kính lúp cũ; hidden không cho phép gửi bí mật PC chưa biết.
- Click/tap/keyboard chỉ chọn và xem thông tin, không thực hiện hành động RP.

Giữ tagType/palette đã duyệt: gryffindor, slytherin, ravenclaw, hufflepuff, beauxbatons, durmstrang, teacher, adult, patrol, animal, monster, ghost, unknown, crowd. `unknown` ở đây là loại actor, không phải cho phép vị trí unknown. PC giữ màu loại/Nhà và viền vàng; patrol chỉ khi RP xác nhận tuần tra.

Giữ năm mục Inspector: **VỊ TRÍ; NGHE HÓNG; QUAN SÁT; AI ĐÓ; HÓNG HỚT TÁM PHƯƠNG**. Chỉ cấp nội dung RP có căn cứ; không suy activity thành âm thanh hoặc tự lấp mục trống. Target POI gắn địa điểm/kiến trúc đã dựng; thiếu anchor chi tiết thì giữ cấp địa điểm, không bịa cửa/tường.

## 8. Fixed/UI, footsteps và X-Ray

Giữ branding, shell, giấy beige/mực nâu, màu Nhà/vai trò, camera/zoom-pan và nội thất Fixed đã duyệt. Review offline có nút **Xem template — 13 mẫu**; không đưa hàng chọn mẫu trở lại runtime RP.

Tách chân và ribbon: dịch nhãn không dịch actor. Inside ẩn chân nhưng không tự kích X-Ray. Walk giữ sáu nhịp, stepMs=550/hideMs=2000; idle hai dấu cố định; hidden không vẽ. Giữ burgundy và reduced-motion; không vẽ chân lên nền không hợp lệ.

X-Ray chỉ khi công trình phía trước thực sự che actor/tag tại vị trí hiển thị: xét layer/depth và vùng hình/footprint phù hợp. Bbox không đủ làm kết luận. Chỉ nhóm che còn opacity **0.3**, ribbon rõ; hết che/xóa actor/đổi scene phải phục hồi. Công trình phía sau không mờ chỉ do chồng hình chiếu. Không bắt buộc raster cache; nếu dùng phải có giới hạn và cleanup. Giữ một artwork, không nhân đôi map để giả hiệu ứng.

## 9. Kế hoạch P0–P9 và cổng duyệt

Hoàn thiện cơ chế trước, sau đó kiểm thử kỹ thuật tổng; **nghiệm thu Google AI Studio Playground/Preview ở bước cuối**. Local không thay nghiệm thu đích. Các mẫu có thay đổi hình ảnh vẫn phải dựng thành HTML/ảnh để user duyệt trước nhân rộng; đây không phải nghiệm thu Preview sớm. PASS kỹ thuật không đồng nghĩa duyệt thẩm mỹ.

| Mốc | Phần việc và dependency | Đầu ra / điều kiện chuyển bước |
|---|---|---|
| P0 | Xác minh repo/HEAD/tree; khóa nguồn, hash/license; đối chiếu phần giữ/sửa/thiếu; cập nhật README này | Baseline rõ; không nhập source cũ, không dựng lại phần đã có |
| P1 | Giữ shell hiện có; thống nhất MAP_DATA/loader/entry và pipeline; tách lỗi transport khỏi dữ liệu | Khung chạy duy nhất; Preview đích để cuối |
| P2 | Khóa contract/version và tag; PC/spot/zone, nhóm/ribbon, ?/!, props; visual tối thiểu; thiết kế fixtures và prompt draft | Schema/tài liệu/code nhận cùng field; chưa phát hành prompt dùng thật |
| P3 | Đồng bộ Atlas nguồn/index; khóa phạm vi/ngoại lệ; Fixed/cluster/custom; H1/H2 AU mới; nhà dân trống làng/hẻm; bảng công năng/recipe | Routing rõ, đủ cluster, không trùng owner/phòng; mọi địa điểm RP có đường minh họa |
| P4 | Mẫu Indoor Horizontal + Potions/Office/Storage, Classroom nếu nguồn có; props lạ và hình mới; UI/markers thực | HTML/ảnh mẫu, rà hình và duyệt thẩm mỹ trước nhân rộng; chưa gọi hoàn thiện toàn Indoor |
| P5 | Từ cơ chế mẫu được duyệt mở rộng phòng đơn/10 preset; 41 recipe Indoor gồm hành lang; size adaptation, mount/surface, merge/replace/chống trùng | Indoor tùy biến, không ép nguyên layout hoặc mất vật RP |
| P6 | Tích hợp 8 Outdoor như nguyên liệu; cảnh đơn/nhiều khu, công trình AU H1/H2; hình mới/fallback; vùng nước/công trình | Outdoor sandbox và mẫu hình cần duyệt; không phát minh đường canon |
| P7 | Đồng bộ 13 Fixed/UI, binding nhà trống, vị trí actor, nhóm/sidebar, ?/!, footsteps, semantic X-Ray/cleanup | Review đủ 13 mẫu và tương tác nhất quán, giữ artwork đã chốt |
| P8 | Hợp nhất một system prompt; Atlas nén/tag/contract/loader; build và ghim CSS/pack/bundle cùng SHA thật | Một prompt cuối khớp runtime, không file đính kèm, không placeholder hoặc SHA cũ |
| P9 | Chạy ma trận kiểm sau hoàn thiện cơ chế, sửa lỗi; đo/tối ưu; duyệt hình còn mở; cuối cùng nghiệm thu AI Studio Preview | Log PASS/FAIL, HTML/ảnh, bytes/request/render/memory và hạn chế; source/dist/prompt thống nhất |

P2/P3 chuẩn bị cùng nhau khi interface rõ, không tạo contract thứ hai. P5/P6 nhân rộng sau cổng mẫu tương ứng. Không redesign asset người dùng đã cấp chỉ vì tự thấy đẹp hơn. Phần X còn lại (hình học/visual nâng cao ngoài khả năng tối thiểu) tùy chọn, không chặn lõi.

## 10. Ma trận kiểm cuối và tiêu chí hoàn tất

Chuẩn bị fixtures theo cơ chế trong quá trình code; không báo test đã chạy khi mới viết ca. Chạy kiểm tổng sau khi cơ chế hoàn thiện, sửa theo lỗi thực. Các lần render/rà hình cần thiết cho cổng thẩm mỹ phải ghi rõ phạm vi, không gọi là nghiệm thu toàn hệ thống.

- Routing: 13 Fixed canon; H1/H2 công trình mới → sandbox; tiệm AU → nhà trống đúng khu, không chiếm canon/trùng binding; Atlas đủ cluster; ngoài thế giới HP vẫn dựng.
- Dữ liệu: thiếu/sai/ID trùng/tham chiếu mơ hồ/nhiều PC/count sai; spot/zone; không NPC/event; không bịa vị trí hoặc mất thông tin.
- Generated: phòng đơn/10 preset; hành lang; size/door/surface; merge/replace rỗng/ensure/add/state; vật lạ, thiếu asset và visual lỗi fallback riêng món.
- Markers: PC đúng nơi; tối đa 10 ribbon theo dữ liệu Gemini; nhóm/chi tiết sidebar; ?/!; click/touch/keyboard; năm mục Inspector.
- Fixed: defs/IDs/motion, chân độc lập nhãn, inside không chân/không tự X-Ray; occluder trước/sau đúng nhóm, opacity 0.3 và phục hồi.
- Runtime: malformed JSON, core/pack/CSS tải lỗi, SVG lỗi riêng món, khởi tạo lặp/đổi scene/cleanup; desktop/mobile, zoom-pan/reduced-motion.
- Đo tối ưu: bytes thực, request, tải/render, node và memory/cache trong điều kiện ghi rõ. Giảm lặp defs/chi tiết decor trước, không bỏ hình/đối tượng RP/ca kiểm để giảm dung lượng.
- Nghiệm thu cuối: Google AI Studio Playground/Preview đúng nơi dùng RP, có log/ảnh thực. Chưa truy cập đích phải ghi **chưa nghiệm thu**, không gắn PASS chung. Phiên/link đích là đầu vào nghiệm thu cuối, không chặn sửa code trước đó.

Ba trạng thái độc lập: **đã triển khai trong commit; đạt kiểm thử có bằng chứng; được user duyệt thẩm mỹ bản cụ thể**. Hoàn tất khi đạt các trạng thái cần cho mốc và không còn lỗi chặn; không đưa phần trăm hoàn thành thiếu căn cứ.

## 11. Baseline và trạng thái triển khai thực tế

Baseline khi viết lại: **739643d1fa3f6360e0ccf26ae266dcb1aa07a824**, local/remote nhánh triển khai khớp, working tree sạch trước sửa. Không có AGENTS.md trong checkout tại lần kiểm trước. Bản cập nhật này không thay assets/runtime/dist.

| Đã có — giữ và tích hợp | Còn sửa theo plan mới |
|---|---|
| Pack 13 Fixed và UI; source/viewer review | Routing H1/H2 AU, nhà trống ổn định, vị trí/X-Ray còn thiếu |
| Atlas, catalog 450 ID, 49 recipe/509 instance theo báo cáo compile | Đồng bộ routing mới, alias/công năng, layout thích nghi và Outdoor runtime |
| Normalize/resolve/build/draw/entry hiện có | Contract/nhóm/semantic merge, placement, target/Inspector và visual tối thiểu |
| HTML FINAL nguyên bản, notices, báo cáo/hash | Một prompt cuối; loader hiện còn pin 392a468, chưa tải build FINAL hiện tại |
| Báo cáo và ảnh QA cũ theo từng commit | Chưa chạy lại kiểm theo cơ chế mới; chưa nghiệm thu AI Studio; không kế thừa PASS chung |

Hash source FINAL đã đối chiếu:

- ASSETS: `17228d044eea77df4354b703e89d5106d3196c4b61b2c853ff7a6aa07c1afb8a`.
- LAYOUTS: `2d7b484dcf8be8bd9a5cbe5fe43af3cc915d484270eff9168ce71851d2ccdcb9`.

Baseline cũ: [docs/baseline.json](docs/baseline.json), [final intake](docs/final-intake/baseline.json). [PROJECT_READINESS](docs/PROJECT_READINESS.md) và báo cáo cũ là bằng chứng tồn tại ở commit trước; các đề xuất sửa Fixed/kiểm Preview sớm trong đó không còn là chỉ đạo. [MAP_DATA](docs/MAP_DATA.md), [MAP_PROMPT](docs/MAP_PROMPT.md), W4/PASTE_GUIDE chưa đồng bộ quyết định mới, không dùng làm prompt cuối.

### Checklist tiếp tục

- [x] Đọc plan/source, xác minh repository/branch/HEAD và tài nguyên có sẵn.
- [x] Viết lại README khóa cơ chế mới và kế hoạch P0–P9.
- [ ] P0 hoàn tất đối chiếu phạm vi Atlas/ngoại lệ và hồ sơ nguồn còn mở.
- [ ] P1 thống nhất khung chạy theo cơ chế mới.
- [ ] P2 contract/nhóm/visual tối thiểu và draft prompt.
- [ ] P3 resolver/Atlas/binding AU/công năng.
- [ ] P4 mẫu hoàn thiện và user duyệt hình.
- [ ] P5 Indoor tùy biến.
- [ ] P6 Outdoor sandbox và duyệt hình.
- [ ] P7 Fixed/markers/Inspector/X-Ray.
- [ ] P8 một prompt cuối/build/SHA.
- [ ] P9 kiểm tổng, tối ưu, duyệt còn mở và AI Studio Preview cuối.

**Bước code kế tiếp:** đọc lại interface thực của entry/normalizer/resolver; triển khai P1/P2 và dependency P3 cần thiết, không xây thêm renderer hoặc sửa artwork Fixed. Lượt viết README không tự đánh dấu các mốc code hoàn tất.

## 12. Cấu trúc, build và bàn giao

Giữ đường dẫn hiện có khi đáp ứng trách nhiệm; không đổi tên module chỉ để khớp cây mục tiêu.

- `src/contract.js`: normalize/validation; `props.js`: inventory; `resolver.js`: routing; `build.js`: geometry; `draw.js`: đồ/hình; `index.js`: entry/điều phối.
- Shell/marker helpers hiện nằm trong source `examples/template-review.html`, được build trích ra. Chỉ tách module nếu cần và giữ một implementation.
- `tools/import-p4.cjs`: compile FINAL; `tools/atlas.py`: compile Atlas; `tools/build.py`: sinh dist; `tools/review.py` và `tools/review-fixtures.py`: review. Viewer/fixture không được tải thành nội dung RP thật.

Lệnh hiện có, chỉ chạy khi mốc tương ứng cần; chúng có thể ghi file sinh:

```sh
node tools/import-p4.cjs
python tools/atlas.py
python tools/build.py
python tools/review-fixtures.py
python tools/review.py
python -m http.server 8790
```

Bộ xem nguồn: [full catalog](examples/asset-review.html), [13 Fixed/UI](examples/template-review.html), [layout FINAL](assets/intake/final-2026-11-14/WIZAMAP_LAYOUTS_FINAL.html), [Atlas](docs/ATLAS_W4.md). P4 review hiện có là bản cũ, chưa thể coi là mẫu đạt cơ chế mới.

## 13. Quy tắc Git và báo cáo

Chỉ repo Map 2, nhánh phù hợp phần việc; giữ nhánh hiện hành khi cùng phạm vi. Task/commit tiền tố `M2-Pxx`. Kiểm HEAD/remote/tree trước ghi và trước push; nếu phiên khác đã đổi phải đọc/tích hợp, không đè. Được commit/push phần được giao; không merge main, release, force-push hoặc xóa lịch sử.

Gộp sửa vào source chính, dist sinh từ source; không chồng patch/v2/final hoặc hai renderer/contract hoạt động song song. Không tự tạo/bật lịch tự động.

Sau mỗi mốc báo ngắn: đã làm/chưa làm, file sửa, interface nếu đổi, PASS/FAIL hoặc chưa chạy, HTML/ảnh cụ thể, điểm chưa xác minh, branch/commit và bước tiếp. Tự quyết kỹ thuật thông thường trong phạm vi đã chốt; chỉ hỏi khi thiếu đầu vào chặn việc, xung đột thật hoặc cần đổi cơ chế/phạm vi. Cổng duyệt hình không được tự tick.
