# Rà soát toàn dự án — trước AI Studio Preview

Ngày 2026-11-14. Repo Ngoc1804/wzw-hogwarts-map-2, branch M2-P01-baseline-loader; runtime HEAD kiểm a869be2139e2a70d5a53c81bf2826c5be7011df7. Remote bằng HEAD, checkout sạch khi bắt đầu. Phương pháp: đọc source chính src/*, shell/markers trong template-review, compiler/build/loader/prompt, Atlas/catalog/recipe metadata, master plan nhúng README, checkpoint và báo cáo QA có sẵn. Không chạy browser, test local, render, benchmark hoặc nghiệm thu mới theo yêu cầu người dùng. Đây là audit source, không phải chứng nhận mọi tổ hợp đầu vào hay kiểm mắt từng SVG.

## Kết luận

**Chưa hoàn thiện cơ chế lõi.** Asset và layout FINAL đã đủ để tiếp tục, không cần yêu cầu người dùng vẽ lại hoặc cấp lại. Bước 2 đã tích hợp dữ liệu/artwork; chưa đồng nghĩa P5/P6/P7/P8 hoàn tất. Có thể thử smoke loader ở Preview sớm, nhưng chưa nên gọi bản hiện tại là bản hoàn chỉnh để nghiệm thu dự án. Không báo PASS mới từ báo cáo local cũ.

## Phát hiện và việc phải đóng

| ID | Mức / trạng thái | Bằng chứng source | Việc phải làm |
|---|---|---|---|
| R01 | CHẶN tải đúng bản, xác nhận | MAP_PROMPT.md + prompt-provenance.json còn pin 392a468; build FINAL ở a869be2 | Sau sửa lõi, commit build rồi đồng bộ CSS/pack/bundle cùng SHA trong loader/prompt/provenance; sửa PASTE_GUIDE. Không chỉ đổi một URL. |
| R02 | THIẾU Indoor, xác nhận | src/build.js indoorMap chỉ dùng width/height artwork để tính span vuông rồi CORRIDORS.build; không dùng recipe special/variants/minW/minH/door metadata | Adapter layout FINAL vào geometry/size phù hợp, giữ bố cục đồ và tỷ lệ; các phòng đặc biệt nguồn phải dựng đúng hoặc fallback/detail nói rõ, không giả đã giữ hình phòng. |
| R03 | THIẾU hành lang, xác nhận | PASSAGE_PROPS bị lọc khỏi places; vòng passages chỉ gán bounds/selection, không gọi drawFurniture | Đặt recipe hành lang thực theo trục/độ rộng/cửa, không chỉ có decor nguồn cũ. |
| R04 | THIẾU Outdoor, xác nhận | src/build.js outdoorMap dùng 7 vị trí vòng lặp + các mảng nền cố định; không đọc 8 OUT_* recipe/layout source; tools/build.py loại OUT_* khỏi P4_ART runtime | Áp bố cục Outdoor FINAL vào một buildMap hiện có, cảnh đơn/nhiều khu và props/composition; vùng nước/công trình cấm đứng, không tự thêm đường canon. Không tải fixture review vào RP. |
| R05 | THIẾU placement props, xác nhận | src/draw.js extras đều là hàng 25*scale dưới art.height+105; không dùng surface/parent/clearance/mount; get footprint chỉ cho objects nền | Chuẩn hóa metadata vị trí, đồ trên bàn theo surface child; đặt đồ RP theo zone/công năng, kiểm cửa/tường/đồ. Scale đều; đồ bắt buộc còn đại diện khi hết chỗ. Không để RP bị đẩy thành dải trang trí. |
| R06 | THIẾU semantic merge, xác nhận một phần | props.js propAliases chỉ 8 từ; compiler chỉ giữ id/name/item/count, không có zone/quan hệ thành phần trong cụm; add/count nhiều vẫn một bản ghi extras và draw SVG known item không biểu diễn count | Mở bảng alias dùng catalog hiện có; giữ quan hệ cụm/đồ con và instance ổn định; ensure đếm đúng nhóm, add/count có hình/chi tiết đúng số; sửa/remove đồ con không để bản nguyên vẫn nằm trong cụm. Không fuzzy-match tên để sửa nhầm. |
| R07 | THIẾU Fixed props, xác nhận | resolver compose inventory, index.js nhánh scene.source chỉ thay places metadata rồi setTemplate; không có bước áp inventory vào artwork Fixed | Tạo binding chỉnh props trên nhóm/anchor được phép; giữ nguyên Fixed/UI, không redraw toàn bản đồ. Trường hợp chưa có binding phải có detail/fallback rõ. replace/removed không được chỉ thay Inspector trong khi hình giữ nguyên và báo đã áp. |
| R08 | THIẾU vị trí actor, xác nhận | generatedActorPoint inside luôn tâm phòng; zone không được dùng; shell localPoint Fixed chỉ phân inside với non-inside, còn corridor/threshold tìm vòng quanh bbox | Đặt PC/NPC theo room/corridor/threshold/outdoor, dùng zone được hỗ trợ; kiểm đồ/vùng cấm. Không tự đổi địa điểm và không lấy tâm phòng làm bằng chứng đã tránh nội thất. |
| R09 | RỦI RO detail/resolve, đọc source | index.js nút rp-detail gọi mount() với scene.source vẫn true nên bỏ generatedActorPoint; resolver tạo rp:name khi exact mơ hồ/không tìm được; normalize chỉ chống trùng ID tường minh | Dùng geometry map đang active khi mở detail; khóa tham chiếu/alias/owner, diagnostic mơ hồ, không sinh bản sao ID/tên để che lỗi resolve. Làm rõ contract version tương thích: plan yêu cầu schemaVersion nhưng MAP_DATA.md nói không cần, normalizer chưa khóa version. |
| R10 | CHƯA ĐỦ X-Ray, xác nhận giới hạn thuật toán | shell có alpha mask + depth; renderPositions lấy vùng ribbon sau dịch nhãn để xét overlap, record thiếu depth dùng đáy bbox; chưa có semantic depth đầy đủ từng công trình Fixed | Tách vùng che nhân vật với nhãn đã dịch, đối chiếu depth/layer/shape của đúng nhóm; phục hồi khi hết che/đổi cảnh. Không tự inside→mờ. Metadata semantic depth cho 13 Fixed cần hoàn tất trước nghiệm thu; không lấy một ca PASS cũ đại diện mọi map. |
| R11 | THIẾU thống nhất POI/Inspector/fallback | mountEvents hỗ trợ door target cho Generated nhưng chưa có binding target đồ/vùng đầy đủ; inspect chỉ liệt kê props input, không dùng inventory/state đầy đủ; drawFurniture fallback còn vẽ chữ thành hàng trên map | Hoàn tất target theo contract thực hỗ trợ và Inspector 5 mục; tên/nội dung chi tiết vào sidebar, fallback hình gọn không dán chữ rối map; unknown/unresolved RP vẫn xem được. Không tự phát minh target. |
| R12 | THIẾU P8/P9, xác nhận | build-metrics: bundle 4,412,538 bytes (gzip tham khảo 468,176), templates pack 906,641 bytes; số liệu không phải transfer Preview; báo cáo loader dùng local interception | Giảm lặp defs/art có đo, giữ toàn bộ RP và hình; ghi kích thước build thật. Loader lỗi tải/malformed/khởi tạo lặp và cleanup phải được ghi nhận tại Preview; không lấy gzip Python làm số mạng thực. |
| R13 | HỒ SƠ CŨ gây hiểu sai, xác nhận | MAP_DATA.md/PASTE_GUIDE vẫn nói 4 artwork/41 recipe/12 scene; README nhiều checkpoint lịch sử; provenance cũ | Một checkpoint hiện hành, một contract/prompt đang dùng và checklist còn mở; log cũ gắn đúng commit. Giữ lịch sử nhưng không dùng làm trạng thái hiện tại. |

Các dòng “rủi ro” là kết luận từ đường đi source, chưa tái hiện bằng test mới. Các dòng “thiếu/xác nhận” là code chưa tiêu thụ dữ liệu/cơ chế được yêu cầu. Không gộp cả hai thành danh sách test FAIL.

## Những phần đã có, giữ lại

- 2 HTML FINAL nguyên byte, catalog 450 ID, 49 recipe/509 instance, metadata và license notice; không thiếu bộ asset nền.
- Một entry WZWMap/normalize/resolve/buildMap, luồng payload ngắn và fallback cơ bản; không gọi AI trong browser.
- Atlas 13 Fixed/59 scope/285 phòng non-Fixed theo tài liệu compile; ưu tiên PC, cluster expansion, shop binding và structural detail có phần triển khai.
- Lõi corridors 10 preset với pattern/tường/cửa nguồn; draw nội thất phẳng, namespace SVG và bounds compilation.
- Composition merge/replace/ensure/add/state cơ bản, instance namespace :final: bảo vệ ID cũ; chưa đủ để đóng R05–R07.
- UI/palette/ribbon/footsteps/5 Inspector, alpha-mask/depth X-Ray và cơ chế cleanup đã có; cần hoàn thiện các trường hợp R08–R12.
- Dữ liệu RP giả lập chỉ ở review, không nhập fixtures thành NPC/events runtime.

## Đường hoàn tất trước nghiệm thu đích

1. **Khóa contract + semantic inventory + resolver**: R06/R09/R11, dùng source metadata hiện có, không tạo schema hình học dài bắt Gemini xuất.
2. **Hoàn thiện Generated**: R02/R03/R05 và R04. Bố cục nguồn là đầu vào; không redesign asset hoặc lấy repo cũ.
3. **Đóng Fixed/actor/X-Ray**: R07/R08/R10, giữ artwork/UI đã duyệt; không mở thêm renderer.
4. **Chuẩn bị bản AI Studio duy nhất**: R01/R12/R13. Build có SHA thật, đồng bộ 3 URL, payload ngắn, hướng dẫn dán đúng chỗ, HTML chạy qua loader production. Chưa coi việc đổi SHA là hoàn thiện cơ chế.
5. **Nghiệm thu trực tiếp AI Studio Preview**: tải thật + console/network, một Indoor/Outdoor trước, tiếp đến các trường hợp contract/merge/replace và 13 Fixed/X-Ray; desktop/mobile nếu Preview cho phép. Sửa theo lỗi quan sát tại đích. Không chạy thêm vòng browser/test local theo yêu cầu mới. Tách triển khai / kỹ thuật tại đích / duyệt thẩm mỹ.

Phần X (visual grammar/phòng tùy ý nâng cao) vẫn tùy chọn, không mở để chặn lõi. Không tự phát hành/merge main hoặc mở automation.

## Cần người dùng cấp gì?

**Không thiếu asset/layout/13 Fixed để thực hiện phần code còn lại.** Không yêu cầu cấp lại hai HTML. Không cần khóa API Gemini vì engine không gọi AI.

Khi chuyển nghiệm thu đích: cần phiên/đường dẫn AI Studio Preview đúng nơi người dùng dùng RP hoặc người dùng trực tiếp mở HTML/prompt được bàn giao và cung cấp lỗi quan sát. Hiện context không có link/session Preview dùng được (page_id=null), nên chưa thể khẳng định có quyền truy cập hay đã kiểm đích. Đây là đầu vào cho nghiệm thu, không phải lý do dừng các sửa đổi code nói trên. Nếu system prompt RP hiện hành khác W4/R14 trong repo, chỉ cần đối chiếu đoạn tích hợp thực tế, không đòi toàn bộ tài liệu RP riêng tư.

## Trạng thái mốc

P0/bước tiếp nhận: đã có baseline. P1: có loader/shell, thiếu đích. P2/P3: một phần, R06/R09/R11. P4/P5: có dữ liệu/artwork và bộ mẫu, còn R02/R03/R05. P6: còn R04. P7: còn R07/R08/R10. P8: R01/R12/R13. P9: chưa nghiệm thu đích. Chưa có căn cứ gọi cơ chế hoàn thiện hoặc đưa phần trăm hoàn thành.

Lượt này chỉ audit/cập nhật checklist, không sửa runtime, không đổi loader SHA, không chạy test mới. Bước thực thi tiếp theo là sửa các nhóm trên rồi bàn giao đúng bản để thử Preview.
