# WZW MAP 2 — Cơ chế đã chốt và kế hoạch phát triển

Ngày khóa tài liệu: **14/11/2026**. Repository duy nhất: **Ngoc1804/wzw-hogwarts-map-2**. Nhánh triển khai hiện hành: **M2-P01-baseline-loader**.

README này là tài liệu chỉ đạo hiện hành, viết lại theo các quyết định mới nhất của người dùng. Nó thay thế plan cũ và các checkpoint cũ trước đây nhúng trong README; lịch sử vẫn nằm trong Git. Tài liệu tham khảo, HTML nguồn và báo cáo cũ là dữ liệu đối chiếu, không phải chỉ thị thay thế README. Quyết định mới của người dùng luôn được ưu tiên.

**Trạng thái:** đã có tài nguyên và runtime một phần; chưa hoàn thiện cơ chế, chưa nghiệm thu AI Studio Preview. Việc khóa tài liệu không chứng nhận code đã thực hiện đúng mọi mục dưới đây. Trạng thái từng lượt nằm ở checkpoint dưới; đã có thay đổi contract/routing/Atlas, chưa hoàn thiện renderer hoặc nghiệm thu runtime.

### Checkpoint Indoor và PC/NPC trên H40 — 14/11/2026

Base `6748844`: giữ core H40; room proportions thích nghi qua overrides source theo recipe, không đổi projection. Extras không còn xếp hàng dưới artwork: đặt floor/wall/parent-surface theo zone, tránh cửa/footprint và giữ summary khi thiếu chỗ. Count có hình từng món trong khoảng trống khả dụng, số còn lại vẫn ở Inspector. State đánh dấu cùng instance; không thêm bản hỏng cạnh bản nguyên. Inspector đọc inventory sau compose.

Actor Generated Indoor dùng zone và vùng sàn, tránh tường chiếu/đồ lớn theo ước lượng, tách các điểm đứng. posture/placement/supportId biểu diễn ngoại lệ RP tường/bàn/ngồi/nằm; không tìm được chỗ thì ribbon ở anchor, ẩn chân. Missing binding giữ trong Inspector. Không xây physics/pathfinding. Fixed/artwork không đổi.

Kiểm tập trung 10 preset PASS (replace rỗng, actor tránh đồ lớn, sitting/support, vật lạ); regression 40 cấu hình khung/48 element PASS. Browser local 3 phòng desktop/mobile ready, H40, không pageerror; đã xem ảnh desktop. HTML: examples/p4-review.html; ảnh tests/indoor-h40-{desktop,mobile}.png. **Chưa duyệt thẩm mỹ nội thất mới, chưa nghiệm thu AI Studio.** Khung corridors đã được duyệt, không xin duyệt lại khung.

Giới hạn: footprint ảnh là ước lượng; surface chưa có metadata không đoán; cụm đồ không có định danh con không tự tháo rời; geometry đặc biệt FINAL chưa được coi tái hiện chính xác mọi hình phòng. P5/P7 chưa đóng toàn mốc. Palette mới/visual compiler/Outdoor/icon mới không nằm trong thay đổi này.

### Checkpoint loader / Outdoor / routing — 14/11/2026

Tích hợp trên `8a09e91` (giữ thay đổi nội thất/actor H40 của phiên khác). Không merge main. Sửa source chính và rebuild dist:

- Loader: JSON hỏng dừng trước normalize/build, không SVG/WZW_SCENE; thông báo riêng. Render API xếp hàng; có thể phục hồi bằng payload hợp lệ sau lỗi parse. Lỗi pack/CSS không được báo ready. Dữ liệu thiếu PC/vị trí, nhiều PC hoặc version không hỗ trợ không dựng scene; payload legacy thiếu version vẫn có diagnostic để tương thích, minimal mới dùng 2.0.0.
- Routing: giữ sandbox/Fixed/Atlas hiện hành; reserve thêm nhà canon được PC/NPC/event tham chiếu trước cấp nhà AU. Nội dung địa điểm/actor/event unresolved giữ trong Inspector, không gán bừa phòng.
- Outdoor: đưa đủ 8 artwork/layout FINAL vào bundle và cùng buildMap; dùng nền nguồn và inventory, namespace theo vùng, giữ merge/replace. Không dùng vòng 7 vị trí cũ. Bản nhiều khu dùng các ô minh họa không tạo đường nối canon. Water path nguồn OUT_WATERSIDE dùng kiểm điểm hình; footprint đồ lớn chặn điểm đứng mặc định.
- Review: [8 Outdoor](examples/outdoor-review.html), dùng cùng runtime, có selector 8 mẫu. **Chờ duyệt hình; chưa nghiệm thu AI Studio**. Không coi tích hợp này đã hoàn tất mọi ca Outdoor tùy ý, visual mới tối thiểu hoặc toàn bộ semantic contract/props.

Kiểm mới: `tests/current-scope.cjs` (browser boot, 8 Outdoor, 5 render liên tiếp, JSON hỏng không scene, phục hồi API); `tests/routing-current.cjs` (8 fixture, AU reorder/không trùng/hết nhà, giữ 11 NPC, thiếu PC invalid); corridor-source và indoor-placement PASS. Không đổi pack Fixed/CSS/template source. Số liệu build mới ở build-metrics; bundle tăng do giữ terrain/art Outdoor, chưa phải tối ưu P8. Báo cáo [scope QA](docs/CURRENT_SCOPE_QA.json).

**Còn mở trong phạm vi yêu cầu:** kiểm lỗi tải CSS/pack/bundle bằng browser và vòng đời stress rộng hơn; contract validation theo nhánh/alias mơ hồ toàn Atlas, đủ ma trận routing; Outdoor nhiều vùng/props state/count/đồ lạ nâng cao và hình tương ứng. Chưa tick “hoàn thiện hẳn” pipeline/contract/routing. Các task visual tối thiểu/semantic inventory còn theo P2/P5, không giả đã hoàn tất từ smoke PASS.

### Checkpoint áp khung corridors đã duyệt H40 — 14/11/2026

Base `857f0c6`; file user cấp lại `CHỐT_01_10_CORRIDORS_FINAL.html` có SHA-256 `e1fd37c355ec679b2d44b52fc0a669b8ea00d36f284a4da3f4ff9f837e1cd7e6`, khớp baseline cũ. Runtime giải nén **trùng nguyên byte** `assets/source/corridors.js`, không nhập renderer mới. User chốt khung/góc nhìn/10 công thức/hốc/khe, chiều cao **40**, không cần thiết kế hay duyệt lại khung.

Code bỏ ép H36, bỏ nến dọc ngoài nguồn, bỏ span vuông mặc định theo artwork; giữ tỷ lệ phòng và công thức nguồn. Catalog thêm **48 element** (11 decor, 21 pattern, 12 cửa/cửa sổ, 3 sân, 1 sàn thảm), tổng **498 ID**. Lọc trùng chính xác bảo toàn màu/transform/viewBox: không thấy trùng chính xác với catalog cũ; không gộp theo tên/hình gần giống. Bundle tái tạo SVG corridors từ cùng lõi qua source reference, không nhúng thêm 48 chuỗi SVG. Compiler FINAL gọi importer corridors để rebuild không làm mất element.

Kiểm tích hợp tập trung: 40 cấu hình (10 preset × 1/4/12/20 phòng), geometry/hốc/khe nguồn và H40; 48 source reference tái tạo SVG nguyên dạng; XML/IDs/refs PASS. Test geometry cô lập furniture/style, không thay chứng nhận hình runtime. Chưa chạy browser/ảnh/AI Studio; giữ nguồn đã được user duyệt. [Báo cáo](docs/CORRIDORS_H40.md) · [catalog offline](examples/asset-review.html).

P5 size/placement/nội thất Generated vẫn có phần việc riêng; không coi đã xong toàn Indoor. Palette mới/?/! chưa được thay đổi ở mốc này.

### Checkpoint tích hợp Atlas và bản Gemini tiếng Anh — 14/11/2026

Tích hợp nhánh `ATLAS_CAN_DUYET` (`84f9f82`) vào nhánh triển khai trên base `3ea860a`, không merge main. Nguồn chính: [GitHub Atlas Master](docs/WZW_MAP2_ATLAS_GITHUB_MASTER.md); bản cho Gemini: [Atlas-only English](docs/WZW_MAP2_ATLAS_GEMINI_MIN.md). ATLAS_W4/W4_1 chỉ còn redirect, không giữ hai Atlas cạnh tranh. Hướng dẫn /map/contract/loader không nhét vào Atlas MIN, sẽ hợp nhất ở P8.

Đã biên dịch đủ 13 Fixed/348 anchor, 59 scope/285 phòng cluster; thêm 53 site World và 64 focus-room. Sửa pointer thiếu/không canonical, recipe lệch công năng và tự mở detail khi hết nhà trống; giữ nguồn minh họa khác với canon. Resolver chọn một công trình/tầng World từ vị trí PC; không sinh cả macro-region. Alias Fixed tiếng Anh chỉ trỏ anchor có thật. Dữ liệu chi tiết World chưa phải chứng nhận hình học renderer hoàn chỉnh.

MIN: **12.687 bytes / 12.620 ký tự**, so với file người dùng vừa cấp 15.504 bytes (giảm khoảng 18,2% bytes); chưa đo token, không khẳng định cực tiểu toán học. Giữ tên phòng/corridor/code để không mất khả năng định tuyến. Compiler/prompt generator có thể sinh lại; `tools/prompt.py` không còn ghi đè /map prompt cũ. Pack Fixed/CSS/artwork không đổi.

Kiểm dữ liệu/compiler, bảo toàn ID, JS syntax/build/diff đã thực hiện; chưa chạy kiểm runtime/browser/hình ảnh hoặc AI Studio. Chi tiết số liệu ở [atlas integration](docs/ATLAS_INTEGRATION.md). P3 phần dữ liệu được bổ sung, P4–P9 và các cổng duyệt vẫn mở.

### Checkpoint contract/routing — 14/11/2026

Base `342d833`; đã sửa `src/contract.js`, `src/resolver.js`, dependency entry/sidebar trong `src/index.js`, cập nhật `docs/MAP_DATA.md` và luật routing Atlas. Build lại bundle từ source chính, giữ nguyên pack 13 Fixed/CSS/artwork. Contract **2.0.0**: phiên bản rõ, spot/zone, members/summary, diagnostic vượt 10 ribbon (không cắt RP), event icon ?/!. Routing forceSandbox/H1–H2 công trình mới, Fixed không auto-detail, nhà/tiệm AU gán nhà dân đúng khu và giữ alias ID/tên. Generated giữ cluster và nơi RP; không dựng phòng từ actor/event chỉ có ID sai.

**Chỉ đã triển khai, chưa chứng nhận đạt kiểm thử.** Đã kiểm cú pháp JS/build và diff whitespace; chưa chạy test logic/browser/ảnh/AI Studio theo thứ tự đã chốt. Fixtures chờ kiểm cuối ở `tests/contract-routing-cases.json`. MAP_PROMPT/loader CDN còn bản cũ, chưa chuyển sang schema này. Visual compiler, placement, semantic merge đầy đủ, giới hạn nhóm kiểm chi tiết và giao diện ?/! vẫn ở task sau. Phạm vi/ngoại lệ template chi tiết chưa chốt lại toàn bộ; routing không tự suy canon từ NLP.

Task P02-01/P02-02/P03-02/P03-03 đã có triển khai nền, chờ kiểm cuối và các dependency trình bày; chưa tick DONE. P03-01 mới cập nhật quy tắc đầu Atlas, chưa đóng audit phạm vi; P03-04 giữ compile/bảng công năng hiện có, alias mơ hồ/toàn phạm vi còn mở. Bước kế tiếp là tiếp tục khung/mẫu P4 và các task còn thiếu theo bảng, không coi mốc này hoàn thiện P5–P7.

### Kiểm tra hiện trạng theo README — 14/11/2026

Người dùng xác nhận dùng README làm plan. Base kiểm tra `857f0c6c0f22b7f16b66b75af0ce9f5f5103130e`, branch `M2-P01-baseline-loader`, local/remote khớp và tree sạch trước ghi. Không có AGENTS.md trong checkout. Bằng chứng mới: [audit JSON](docs/M2-P00-CURRENT-AUDIT.json). Đây là kiểm tra giới hạn, không phải nghiệm thu tổng.

- **PASS dữ liệu:** giải nén source Fixed có 13 mẫu; Atlas 13 Fixed, 59 cluster/285 phòng; catalog 450 ID; 41 Indoor + 8 Outdoor, 509 instance, không thiếu item recipe trong catalog. Hai HTML FINAL khớp hash baseline mục 11. Notice dependency hiện có được giữ; không suy giấy phép toàn artwork từ MIT dependency.
- **PASS giới hạn:** cú pháp 6 module src và bundle; 8 ca trong `contract-routing-cases.json` chạy bằng Node VM với maps thật và source normalize/compose/resolve. Chưa kiểm toàn additionalMatrix hoặc browser routing đầy đủ; không tick DONE cho P2/P3.
- **Browser local:** minimal lên ready, không pageerror nhưng diagnostic `missing-schema-version`. JSON hỏng tái hiện `incomplete` **vẫn có SVG/WZW_SCENE với phòng “Không gian RP”**: FAIL yêu cầu tách transport khỏi cảnh RP, cần sửa P01-02. Không phải lỗi tải mạng đã được kiểm.

| Task còn mở | Kết quả đối chiếu source hiện tại |
|---|---|
| P00-02 | Hash/count đã kiểm mới; audit toàn phạm vi/ngoại lệ/alias và hồ sơ nguồn còn mở |
| P01-01/02 | Một entry/pipeline hiện có, giữ lại; cần chặn dựng khi parse lỗi, kiểm khởi tạo lại/render đồng thời và cleanup. `renderInput` chưa có serialize/generation guard |
| P02-01/02 | Đã có version 2.0.0, spot/zone, members/summary, diagnostic >10 ribbon, ?/!; validation bắt buộc theo nhánh và nối trình bày còn thiếu. Không làm lại phần routing đã có |
| P02-03/04 | Chưa có compiler visual tối thiểu trong draw; prompt draft/final chưa đồng bộ |
| P03 | Có forceSandbox, H1/H2 AU, binding nhà trống, cluster và World focus; 8 ca nền PASS giới hạn. Còn audit toàn phạm vi, mơ hồ, hết nhà, reorder và bảo toàn dữ liệu |
| P04/P05 | Indoor lấy span vuông từ artwork, chưa dùng đủ geometry FINAL; passage không drawFurniture; extras thành hàng dưới art. Mount/surface/count/đồ con và 3 cấu hình decor chưa hoàn thiện; mẫu mới chưa duyệt |
| P06 | outdoorMap còn 7 vị trí lặp; build loại OUT_* khỏi runtime art. Có đủ source 8 Outdoor nhưng chưa tích hợp đúng cơ chế |
| P07 | generatedActorPoint chưa nhận zone, inside dùng tâm phòng chưa tránh footprint. Actor unresolved bị lọc khỏi marker, Inspector chưa bảo đảm giữ toàn bộ nội dung. Click ribbon trên map chưa trình bày members/summary như chip Inspector. X-Ray dùng mask + depth nhưng vùng xét theo ribbon đã dịch và có fallback depth bbox; cần hoàn thiện semantic/các ca phục hồi. Review picker 13 mẫu đã có, giữ lại |
| P08 | MAP_PROMPT/provenance còn pin 392a468; compiler recipe bỏ metadata zone/quan hệ, prompt/build chưa thống nhất. Tối ưu SVG mới có audit, chưa thực thi |
| P09 | Chưa kiểm tổng, đo transfer/render/memory, đối chiếu hình hoặc nghiệm thu AI Studio Preview; chưa duyệt mẫu Indoor/Outdoor/?/! mới |

**Giữ:** artwork/UI/13 Fixed, source FINAL, catalog/recipe/Atlas và pipeline hiện hành. Không áp đề xuất sửa props trực tiếp lên Fixed từ PROJECT_READINESS cũ: README mục 3.1 là chỉ đạo. **Thiếu cơ chế, không thiếu bộ asset nền.** Lượt này chỉ cập nhật hồ sơ kiểm tra, không sửa runtime/dist, không có HTML/ảnh mới và không thay trạng thái duyệt hình. Ưu tiên code tiếp theo: đóng lỗi transport/lifecycle P1, rồi P2 và dependency P3 trước mẫu P4.

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

- Các đối tượng nguồn mang tên **“Nhà dân số…”** là chỗ có thể auto-fill nhà/tiệm AU. Chọn một nhà chưa dùng trong đúng template/khu Diagon hoặc Knockturn; không xây hệ quản lý nhà trống riêng.
- Không thay nhà/tiệm canon có chủ, không dùng một nhà cho hai địa điểm RP khác nhau trong cùng cảnh.
- Cùng input/binding phải cho cùng kết quả; render lại không đổi nhà tùy tiện. Binding là dữ liệu trình bày, không ghi địa điểm AU ngược vào Atlas chuẩn.
- PC/NPC và click dùng cùng binding nhà; tên, mô tả và hoạt động AU xuất hiện trong sidebar.
- Không dựng thêm tòa nhà trên template. Nếu hết nhà dân trống, không ghi đè nhà khác, không bỏ địa điểm; giữ nội dung và diagnostic. Phương án mở rộng hình khi hết chỗ chưa được chốt, chỉ hỏi khi thực tế gặp ca này.

## 4. Atlas và tài nguyên source

**Dùng Atlas và SVG hiện có trong source**, không lấy repo cũ/demo-5, không tự nhập bộ source khác thay nguồn người dùng cấp.

| Source chính | Vai trò |
|---|---|
| `docs/WZW_MAP2_ATLAS_GITHUB_MASTER.md` → `tools/atlas.py` → `assets/atlas.json` | Atlas dễ đọc và index runtime từ cùng nguồn; cần đồng bộ routing mới |
| `assets/intake/final-2026-11-14/WIZAMAP_ASSETS_FINAL.html` | Thư viện FINAL nguyên bản: 423 asset |
| `assets/intake/final-2026-11-14/WIZAMAP_LAYOUTS_FINAL.html` | Layout FINAL nguyên bản: 41 Indoor + 8 Outdoor |
| `assets/catalog.json` | Catalog runtime: 498 ID = 450 ID FINAL/layout + 48 element corridors đã chốt |
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

**Ưu tiên trong prompt:** Fixed phù hợp → layout/asset sẵn có → xây mới khi cần. **Code khóa một khung dựng hành lang Generated Indoor và cùng góc nhìn 2.5D xuyên suốt dự án**, dùng lõi corridors nguồn (tường cao 40 theo source đã chốt). Không để nhánh Gemini tạo mới đổi khung thành mặt bằng phẳng. Size/vị trí phòng, sàn/tường và nội–ngoại thất được tùy biến; hình đồ vật phẳng theo source không làm đổi góc nhìn khung. Fixed giữ nguyên góc nhìn artwork đã duyệt.

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

Gemini xác định phòng/spot/zone; code chọn điểm minh họa trong vùng đó. Indoor tránh tường và footprint **ước lượng** của nội thất lớn như bàn, tủ, kệ — những chỗ đứng/chui vào vô lý. Ngoài vùng không nên đứng, actor được đặt tự do. Không đòi độ chính xác game, không tìm đường hoặc xây solver.

RP có thể xác nhận đứng trên bàn, trong tường, ngồi/nằm hoặc tình huống đặc biệt; biểu diễn đúng ngoại lệ đó, không áp luật mặc định để phủ quyết. Ngồi/nằm vẫn có actor/ribbon và nội dung; ẩn footsteps phù hợp. Không tìm được điểm hợp lý thì giữ ribbon ở anchor địa điểm, ẩn chân, không đổi phòng hoặc bỏ actor.

Giữ cửa/lối đi, scale đồng đều, đồ trên bàn là surface child, đồ tường đúng mount. Mái/nước không thành điểm đứng mặc định. Dùng bounds/footprint đơn giản phù hợp, không lập hệ va chạm chính xác. Cùng scope/input ổn định bố cục; đổi thời gian/NPC không xáo phòng tùy tiện.

### Hành lang và chuyển cảnh tối giản

Dùng **đúng decor/phân bố/hốc/khe của lõi corridors được cấp**, không tự thêm nến lên tường dọc hoặc dựng lại khung. Quyết định source H40 mới thay đề xuất cũ về 3 recipe decor độc lập. Giữ seed ổn định; số phòng/size/material có thể tùy biến theo RP qua công thức nguồn, không khóa 12 phòng hoặc một kích thước cố định. Element được đưa vào catalog bằng cùng artwork nguồn, không nhân đôi SVG trong bundle.

Bỏ đường **tự mở detail từ Fixed** đang có trong code cũ sau khi kiểm dependency. Chọn Fixed hoặc sandbox ngay từ routing. User yêu cầu xem riêng nội thất thì dựng một scene sandbox mới qua entry/pipeline hiện có; actor lấy geometry của scene đang active, không giữ cách đặt từ Fixed trước đó.

### Màu mặc định

Giữ nguyên màu artwork đã duyệt. Asset chưa có màu dùng token theo vật liệu: gỗ, đá, kim loại, vải, kính, cây. Hình mới dùng cùng token/phong cách; Gemini không phải phối hex từng món. Chỉ override khi RP nêu màu quan trọng. Không tô lại toàn thư viện, không tạo nhiều SVG chỉ để đổi màu; giữ biến thể màu/góc nhìn có chủ đích.

## 7. PC, NPC/nhóm, POI và Inspector

- PC có marker riêng, đúng vị trí Gemini xác định.
- **Tối đa 10 ribbon NPC/cá nhân/nhóm**, PC không tính trong trần này. Đây là yêu cầu contract MAP_DATA và prompt: Gemini trả dữ liệu đã nhóm cùng nội dung sidebar; code chỉ hiển thị, không tự suy thành viên hoặc âm thầm cắt NPC.
- Ribbon cá nhân: click hiện hoạt động ngắn và mô tả ngắn vị trí.
- Nhóm 3–5 người: click hiện tên thành viên ở sidebar. Nhóm đông: tên/mô tả nhóm ngắn như “nhóm Slytherin”, “đội Quidditch”. Dữ liệu thành viên/hoạt động do Gemini cung cấp.
- **`?`: đầu mối/quest hidden mà PC đã nhận biết dấu hiệu. `!`: hoạt động/quest thường.** Thay quy định kính lúp cũ; hidden không cho phép gửi bí mật PC chưa biết.
- Ý nghĩa ?/! đã khóa, **giao diện cụ thể chưa duyệt**. Dựng một bộ mẫu chung kích thước/nét/vùng bấm/hiệu ứng, khác glyph/màu; gửi HTML/ảnh để user chốt trước áp toàn bộ.
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

## 9A. Dung lượng, SVG và làm sạch — thực hiện có đo

**Kết quả audit M2-P00-03:** [báo cáo baseline](docs/M2-P00-03-BASELINE.md) · [46 nhóm ứng viên SVG](docs/M2-P00-03-SVG-DECISIONS.csv) · [metrics JSON](docs/M2-P00-03-METRICS.json). Chỉ hoàn tất đo/plan; tối ưu thực thi ở P08.

Đọc và lập phương án từ đầu; xóa/gộp khi đã rõ dependency. Phân biệt dung lượng repository với bytes browser tải. Không tối ưu hàng loạt chỉ theo tên/số lượng asset.

1. Đo baseline source/catalog/artwork/pack/bundle: bytes thô/gzip, số lần nhúng, request dự kiến và đường build. Số transfer/render/memory thực đo ở bước kiểm cuối.
2. Lập bảng hình giống hệt, defs lặp, hình nhúng lại giữa catalog/layout; rà code/adapter/phiên bản không dùng. Khác góc nhìn/màu/chi tiết có chủ đích vẫn giữ.
3. Chốt asset chính, alias và tham chiếu dùng chung; không gộp hai instance RP thành một vật. Ghi giữ–gộp–bỏ, dependency và lợi ích dự kiến trước chỉnh.
4. Gộp source chính, bỏ nhánh thay thế đã hết dùng; dist sinh tự động. Source HTML nguyên bản là mốc đối chiếu, không đóng gói nguyên viewer vào runtime.
5. Dùng chung defs/symbol, bỏ metadata runtime không cần; giữ viewBox, transform, nét, màu, opacity, IDs/refs và motion. Không giảm precision path tùy tiện, không bỏ hình hoặc ca kiểm để đạt bytes.
6. Sau chỉnh đối chiếu hình trước/sau, SVG/refs/build và đo lại. Chỉ báo giảm dung lượng thực có số đo; chưa kiểm hình thì chưa kết luận bảo toàn hình.

## 9B. Bảng task phát triển chi tiết

Trạng thái mặc định **TODO** là chưa hoàn tất theo cơ chế mới, dù có code nền. DONE-DOC chỉ xác nhận tài liệu. Không tick task triển khai bằng báo cáo PASS cũ. Cột điều kiện là đầu ra cần đạt; kiểm kỹ thuật tổng chạy sau hoàn thiện cơ chế, Preview cuối, riêng render/rà hình phục vụ cổng duyệt được làm đúng lúc.

| Task | Trạng thái | Việc cần làm / phạm vi file | Dependency | Đầu ra / điều kiện hoàn tất |
|---|---|---|---|---|
| M2-P00-01 | DONE-DOC | Khóa quyết định và bảng task trong README | Quyết định user | Một chỉ đạo hiện hành; lịch sử nằm trong Git |
| M2-P00-02 | TODO | Đối chiếu phạm vi/ngoại lệ Atlas và source; hash/license/keep–fix–missing | P00-01 | Bảng nguồn và phạm vi có căn cứ; phần chưa chốt nêu rõ |
| M2-P00-03 | DONE-DOC | Đã rà build/dependency/bytes SVG; [baseline](docs/M2-P00-03-BASELINE.md) + [bảng gộp](docs/M2-P00-03-SVG-DECISIONS.csv) | P00-01 | Baseline và KEEP–SHARE–DROP có bằng chứng; chưa sửa asset/runtime |
| M2-P01-01 | TODO | Rà index/shell/build: một entry, một loader, một pipeline | P00-02 | Interface khởi tạo/chuyển scene thống nhất, giữ branding |
| M2-P01-02 | TODO | Tách parse/lỗi tải khỏi RP; vòng đời scene/listener/timer | P01-01 | Không khởi tạo lặp hoặc báo ready giả; cleanup rõ |
| M2-P02-01 | TODO | Khóa schemaVersion/field bắt buộc từng nhánh; normalize ID/count/PC/spot/zone | P01-01 | contract.js và MAP_DATA.md cùng một contract ngắn |
| M2-P02-02 | TODO | Khóa dữ liệu ribbon nhóm, thành viên/summary/sidebar và ?/! | P02-01 | Prompt yêu cầu tối đa 10 ribbon NPC; code không suy/cắt danh sách |
| M2-P02-03 | TODO | Khóa visual tối thiểu và token vật liệu, nhận hình mới/fallback riêng món | P02-01 | Một dạng visual có cấu trúc; không thực thi mã/URL tùy ý |
| M2-P02-04 | TODO | Draft một prompt: ưu tiên Fixed → layout/asset → mới, xác định vị trí bắt buộc | P02-01–03, P03-01 | Draft khớp interface; chưa phát hành prompt dùng thật |
| M2-P03-01 | CODE — chờ QA | Đồng bộ Atlas nguồn/index và bảng routing 13 Fixed/ngoại lệ | P00-02, P02-01 | Một nguồn routing, giữ owner/cluster/pointer |
| M2-P03-02 | TODO | H1/H2 công trình AU mới/user yêu cầu → sandbox; bỏ auto-detail Fixed | P03-01, P01-01 | Chọn nhánh trước dựng, actor theo geometry active |
| M2-P03-03 | TODO | Auto-fill “Nhà dân số…” đúng làng/Diagon/Knockturn | P03-01 | Binding ổn định, không chiếm canon/trùng nhà; ca hết chỗ ghi rõ |
| M2-P03-04 | CODE — chờ QA | Alias/phòng–công năng–recipe, đủ cluster và phòng RP bổ sung | P03-01 | Không yêu cầu Gemini biết asset ID; không tự nhân phòng |
| M2-P04-01 | SOURCE-APPROVED / CODE | Khóa khung corridors cùng góc nhìn 2.5D, height 40, kể cả hình mới | P02-03, P03-04 | Một khung dựng, size/vật liệu linh hoạt; Fixed không đổi |
| M2-P04-02 | TODO | Mẫu Horizontal + Potions/Office/Storage/Classroom nếu có | P04-01 | Có props lạ, merge/replace và bố trí thích nghi, không ép nguyên layout |
| M2-P04-03 | CODE — chờ QA/duyệt hình | Placement actor nhẹ: zone/sàn, tránh tường/đồ lớn, ngoại lệ RP, anchor khi chật | P02-01, P04-02 | Không solver/game physics; actor không đổi địa điểm hoặc biến mất |
| M2-P04-04 | SOURCE-APPROVED / CODE | Giữ decor/hốc/khe nguồn H40, bỏ đề xuất 3 recipe thay thế | P04-01 | Không thêm decor ngoài source, catalog tham chiếu cùng lõi |
| M2-P04-05 | TODO | Mẫu ?/! chung nét/vùng bấm/hover/reduced-motion | P02-02 | HTML/ảnh có tương tác, chưa tự coi đã duyệt hình |
| M2-P04-06 | WAIT-VISUAL | Chỉ gửi nội thất mới và ?/! nếu cần duyệt; khung corridors đã duyệt | P04-02–05 | Không mở lại cổng duyệt khung hành lang. Nội thất mới/?/! vẫn cần bản cụ thể |
| M2-P05-01 | CODE — chờ QA/duyệt hình | Phòng đơn/10 preset; size/vị trí phòng, vật liệu từ layout/asset/RP | P04-06 | Cùng khung 2.5D; không làm mọi phòng thành span vuông cố định |
| M2-P05-02 | TODO | Hoàn thiện compose/merge/replace/ensure/add/state, định danh ổn định | P02-01, P04-02 | Không thêm trùng; phòng rỗng; sửa/xóa đúng món hoặc nêu giới hạn cụm |
| M2-P05-03 | CODE — chờ QA/duyệt hình | Placement props: floor/wall/surface, cửa/lối đi và fallback khi chật | P05-01–02 | Đồ thêm không thành hàng dưới art; không bỏ đồ RP nhường decor |
| M2-P06-01 | TODO | Áp 8 Outdoor thành nguyên liệu trong builder hiện có | P02-03, P03-02, P04-06 | Cảnh đơn/nhiều khu theo RP, không vòng 7 vị trí cố định |
| M2-P06-02 | TODO | Nhà/công trình AU, nền/nước/props/hình mới, vùng đứng ước lượng | P06-01 | Không tự thêm canon; thiếu hình fallback riêng món |
| M2-P06-03 | WAIT-VISUAL | Mẫu Outdoor gồm công trình AU H1/H2 | P06-02 | User duyệt hình trước nhân rộng style mới |
| M2-P07-01 | TODO | Nối contract nhóm/10 ribbon với sidebar và POI ?/! đã duyệt | P02-02, P04-06 | Click có đúng nội dung Gemini, giữ năm mục Inspector |
| M2-P07-02 | TODO | Đồng bộ Fixed/binding/actor/footsteps/review selector | P03-03, P04-03, P07-01 | Giữ 13 artwork/UI; inside ẩn chân; nhãn tách chân |
| M2-P07-03 | TODO | Hoàn thiện X-Ray layer/depth/vùng che và phục hồi | P07-02 | Đúng nhóm che opacity 0.3, không inside→mờ hoặc bbox-only |
| M2-P08-01 | TODO | Áp phương án tối ưu: dùng chung defs/asset, bỏ code/nhúng trùng đã hết dependency | P00-03, P05–07 cơ chế | Source chính gọn; giữ hình/refs/motion; số đo trước–sau |
| M2-P08-02 | TODO | Build dist; một prompt cuối và loader CSS/pack/bundle cùng SHA thật | P08-01, P02-04 | Hướng dẫn dán một khối, không SHA cũ/placeholder/file đính kèm |
| M2-P09-01 | TODO | Kiểm tổng dữ liệu/routing/Indoor/Outdoor/markers/cleanup desktop-mobile | P05–08 cơ chế | Log PASS/FAIL theo commit; sửa lỗi thực, không kế thừa PASS cũ |
| M2-P09-02 | TODO | Đối chiếu hình SVG trước–sau và đo tải/render/request/memory | P09-01 | Không mất hình/RP; giới hạn đo rõ; tối ưu bổ sung nếu bằng chứng cần |
| M2-P09-03 | TODO | AI Studio Playground/Preview đích và bàn giao | P09-01–02, duyệt hình cần thiết | Nghiệm thu cuối có log/ảnh; chưa có phiên thì ghi chưa nghiệm thu |

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

Baseline lần viết lại đầu: **739643d1fa3f6360e0ccf26ae266dcb1aa07a824**; lần bổ sung task dựa trên **b2cf159f4771babfa20dc5b419e8f70cc3b12747**, local/remote nhánh triển khai khớp, working tree sạch trước sửa. Không có AGENTS.md trong checkout tại lần kiểm trước. Bản cập nhật này không thay assets/runtime/dist.

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
- [x] Bổ sung placement nhẹ, khung hành lang 2.5D, decor tối giản, palette, tối ưu SVG và bảng task chi tiết.
- [x] Đo baseline dung lượng và lập phương án dọn/gộp trước sửa runtime (M2-P00-03; audit-only).
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

Bộ xem nguồn: [full catalog](examples/asset-review.html), [13 Fixed/UI](examples/template-review.html), [layout FINAL](assets/intake/final-2026-11-14/WIZAMAP_LAYOUTS_FINAL.html), [Atlas](docs/WZW_MAP2_ATLAS_GITHUB_MASTER.md). P4 review hiện có là bản cũ, chưa thể coi là mẫu đạt cơ chế mới.

## 13. Quy tắc Git và báo cáo

Chỉ repo Map 2, nhánh phù hợp phần việc; giữ nhánh hiện hành khi cùng phạm vi. Task/commit tiền tố `M2-Pxx`. Kiểm HEAD/remote/tree trước ghi và trước push; nếu phiên khác đã đổi phải đọc/tích hợp, không đè. Được commit/push phần được giao; không merge main, release, force-push hoặc xóa lịch sử.

Gộp sửa vào source chính, dist sinh từ source; không chồng patch/v2/final hoặc hai renderer/contract hoạt động song song. Không tự tạo/bật lịch tự động.

Sau mỗi mốc báo ngắn: đã làm/chưa làm, file sửa, interface nếu đổi, PASS/FAIL hoặc chưa chạy, HTML/ảnh cụ thể, điểm chưa xác minh, branch/commit và bước tiếp. Tự quyết kỹ thuật thông thường trong phạm vi đã chốt; chỉ hỏi khi thiếu đầu vào chặn việc, xung đột thật hoặc cần đổi cơ chế/phạm vi. Cổng duyệt hình không được tự tick.

### M2-P04-05 — mẫu !/? và palette, chờ duyệt — 14/11/2026

Review-only: [HTML](examples/marker-palette-review.html), [ảnh](tests/marker-palette-review.png), [token đề xuất](docs/marker-palette-proposal.json). Ba palette: default Giấy & gỗ, Rêu & đá, Mận & đồng. Glyph !/? cùng nét/vùng bấm 44px, hover/focus/selected; không thực hiện hành động RP. Đề xuất seed canonical scope + place ID chọn palette ổn định cho Generated; không đổi màu theo giờ/NPC. Chỉ dùng token cho hình mới/vùng cho phép, không tô lại artwork đã có màu, không đổi Fixed hoặc palette actor/Nhà.

Đã kiểm click và không tràn ngang ở viewport 390px; đã xem ảnh desktop 1440px. Lượt đầu mở HTTP local lỗi ERR_EMPTY_RESPONSE; render lại bằng HTML self-contained thành công. Chưa kiểm AI Studio. **Chưa được user duyệt; chưa áp token/seed vào runtime.** Hình hành lang trong review là nguồn H40 giữ nguyên; bảng swatch là đề xuất token, không phải bằng chứng đã recolor runtime. Chờ user duyệt !/? và ba palette trước triển khai.

### Điều chỉnh theo user — một palette và icon ống nhòm/kính lúp

Bác mẫu !/? cũ và bỏ ba palette/seed chọn palette. Chỉ một bảng màu vật liệu; giữ Fixed. Đã lập [plan](docs/ASSET_COLOR_PLAN.md), [bảng 498 SVG](docs/ASSET_COLOR_AUDIT.csv), tạo [mẫu icon](examples/event-icon-review.html). 208 SVG cần kiểm inheritance, 290 có paint tường minh; chưa kết luận asset nào đủ màu chỉ bằng scan. Chưa tô hàng loạt hoặc áp icon runtime.

### M2-P04 — HTML asset có màu và icon mới — 14/11/2026

User yêu cầu thực hiện: đã thay glyph marker bằng ống nhòm (!)/kính lúp (?) và nhúng cả hai trong [catalog offline](examples/asset-review.html), cùng 498 SVG có màu nguồn. Giữ một palette; không seed đổi bảng màu. Kiểm computed paint phân biệt inheritance/nét mở: 51 asset có nét mở thiếu fill tường minh, đã ghi fill none theo từng path trong assets/paint-edits.json; không tùy tiện phủ màu lên nét. Không phát hiện mặt khối rơi về fill đen mặc định trong phép scan này; không tuyên bố kiểm thẩm mỹ từng bộ phận bằng scan. Compiler tái áp quyết định bằng tools/apply-paint.py; corridor factory dùng cùng quyết định, không tạo renderer khác.

Ảnh [asset-color-review](tests/asset-color-review.png), kết quả [paint QA](docs/ASSET_PAINT_RESULT.json). PASS browser catalog trang đầu/icon/mobile, H40 40 cấu hình/48 reference, Indoor placement, 8 Outdoor/lifecycle. Chưa nghiệm thu AI Studio. Pack 13 Fixed không đổi; CSS chỉ thay nét icon event để không tô đặc icon stroke. Hình mới chờ user xem.

### Màu Hogwarts và bỏ Cụm để bàn — theo yêu cầu user

Đã xóa 55 tabletop.* khỏi catalog (không có recipe tham chiếu); còn 443 ID. Đã đổi màu 129 asset có data-material sang gỗ óc chó/đồng cổ/burgundy/giấy da; giữ hình học và độ chuyển gradient. Các phần không có nhãn vật liệu giữ màu nguồn; không tự tô toàn bộ silhouette. tools/style-catalog.py được gọi sau importer để rebuild giữ quyết định. HTML asset-review sinh từ catalog mới, bỏ tab Cụm để bàn; hai icon giữ nguyên. Fixed pack/CSS không đổi ở mốc này.

Nhóm cluster.layout-* chọn lọc: so XML bỏ ID/nhãn, giữ geometry/transform/viewBox/màu: 0 trùng; so hình render chuẩn 512px cũng 0 bản giống hệt. Không xóa chỉ vì cùng tên hoặc nhìn gần giống. Báo cáo docs/CATALOG_STYLE_CLEANUP.json có danh sách ID bỏ/đổi màu. PASS recipe item refs, browser catalog 443 ID/0 tabletop, H40 40 cấu hình/48 reference, 8 Outdoor/lifecycle. Đã xem ảnh tests/asset-hogwarts-review.png; chưa nghiệm thu AI Studio hoặc user duyệt bảng màu mới.

### Chỉnh vải beige và editor offline — 14/11/2026

Theo user bác burgundy: đưa phần fabric mới recolor của 17 asset về beige, đồng bộ catalog/art/bundle. Màu Nhà/cờ nguồn và pack Fixed giữ nguyên. Compiler palette mới dùng fabric beige.

HTML chính examples/asset-review.html có editor màu trong nút “Xem / chỉnh màu / tải SVG”. Cho đổi từng mã màu fill/stroke/gradient, cập nhật ảnh trực tiếp, hoàn tác, về màu lúc mở file, tải SVG/JSON và **Tải HTML đã chỉnh**. Chỉ sửa màu cùng mã trong asset đang chọn; không thay ID/ref hoặc geometry. Không tự lưu vào file đang mở hoặc ghi vào GitHub; muốn giữ thay đổi phải xuất HTML/JSON. Editor nhúng offline từ tools/catalog-editor.js, không thêm renderer runtime.

PASS tests/catalog-editor.cjs: chỉnh màu, undo, xuất HTML, mở lại giữ màu, editor sau mở lại, reset và mobile không tràn ngang. Corridor-source 40 cấu hình/48 reference và Indoor placement PASS. Ảnh tests/catalog-color-editor.png. Chưa kiểm AI Studio; chưa coi user đã duyệt màu mới.

### Hoàn thiện màu theo vật liệu — user giao tự xử lý

Giữ vải beige, không dùng lại burgundy mới. Hoàn thiện 20 asset: nhịp gáy sách kem/sage/xám lam/da nâu, vạc sắt tối, giáp bạc cũ, gương kính xanh khói; bổ sung token base/surface/detail/ink trên các SVG detail trước đó có fallback none. Màu được ghi vào catalog và object art cùng nguồn; assets/finish-paint.json + tools/finish-paint.py là các quyết định paint cụ thể, importer gọi lại để không mất khi rebuild. Không đổi geometry, cờ Nhà hoặc pack Fixed.

Đã xem contact sheet tests/asset-finished-contact.png; catalog HTML sinh lại từ source chính và vẫn có editor offline. PASS catalog-editor (đổi/undo/export/mở lại/mobile), H40 40 cấu hình/48 reference, browser 8 Outdoor/lifecycle. Chưa nghiệm thu AI Studio. Không yêu cầu user tự chỉnh màu để hoàn thành lượt này.
