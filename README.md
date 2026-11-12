# WZW Map 2 — Nhánh 01: Template và UI cố định

Nhánh: `01-template-ui`. Mã task/commit: `TUI-01`–`TUI-08`.
Không merge `main`, không phát hành; repo cũ chỉ đọc.

## Bản chính

`examples/template-review.html` là bản offline duy nhất, chứa đủ 13 SVG, definitions và UI. Mở trực tiếp bằng Chromium hoặc chạy:

```sh
python -m http.server 8765
```

Mở `http://localhost:8765/examples/template-review.html?template=h1`.
13 ID: `h1`, `h2`, `hall`, `gryffindor-common`, `ravenclaw-common`, `hufflepuff-common`, `slytherin-common`, `village-static`, `pitch-static`, `express`, `diagon-knockturn`, `ministry2`, `ministry-8-10`.
Tham số URL phục vụ kiểm mẫu, không thêm lại thanh chuyển template vào UI.

## Trạng thái duyệt

**TUI-04 — Nội thất map sảnh: CHƯA ĐƯỢC DUYỆT.** Người dùng phản hồi bản trước xấu và chồng chéo. Bản sửa hiện tại là đề xuất để xem lại; kết quả test kỹ thuật không thay thế duyệt thẩm mỹ. Lịch tự động vẫn tắt.

## Task đã triển khai

| Task | Kết quả |
|---|---|
| TUI-01 | Nhập đủ 13 template; giữ referenced defs, IDs và tỷ lệ; loại placeholder definition rỗng và tham chiếu không vẽ gì. Ghi nguồn dưới đây. |
| TUI-02 | Đổi vị trí use chân trái/phải, glow đỏ nhẹ; walk sáu nhịp 550 ms, ẩn 2.000 ms, idle hai dấu; reduced-motion dùng hai chân tĩnh; inside tắt chân. Kiểm toàn bounds của dấu, không chỉ tâm. |
| TUI-03 | Phục hồi 106 hook H1 motion; cleanup khi đổi mẫu; tôn trọng reduced-motion. Bỏ hiệu ứng chọn đỏ cạnh tranh, giảm bóng cầu; nền H2 cùng #f1e5ca với viewport. Thêm bóng rêu #637752, blur 9, opacity .22 sau từng công trình H1/H2, không thêm khối đặc. |
| TUI-04 · CHỜ DUYỆT | Giữ element Đại Sảnh; bổ sung đồ dùng, tủ, kệ sách, cây, đèn và chân dung cho các phòng quanh sảnh. Nới sân trong về trái 14 đơn vị, thay đài cũ bằng chính nhóm SVG đài H2; thêm ghế và cây. |
| TUI-05 | Bốn nhà chung thêm bàn học, đèn, cây và kệ sách chi tiết. Lò sưởi hiện có tăng 40% quanh tâm; Ravenclaw được bổ sung lò cùng kiểu tài nguyên. Giữ kích thước mặt bằng và màu Nhà. |
| TUI-06 | Click/tap và Enter/Space chọn địa điểm, Inspector đọc metadata; pointer capture chỉ khi thật sự kéo. Glow thống nhất. Event=Quest dùng kính lúp vàng/burgundy; Hidden dấu hỏi xanh giấy cổ; pulse nhẹ, reduced-motion sáng tĩnh. X-Ray chỉ khi alpha artwork thật chồng lên ribbon. |
| TUI-07 | Từng công trình dùng nhóm độc lập; 172 nhóm occluder trên các template có kiến trúc nổi/đồ cao. Map Bộ/Express dạng mặt bằng không có kiến trúc nổi cần làm mờ. Vùng cấm tách theo hình công trình/nước/đồ cao; ngoài vùng cấm là đất trong bounds. Nhãn công trình con có trong artwork được thêm vào metadata hiển thị, không tạo Atlas thứ hai hay nội dung RP. |
| TUI-08 | Việt hóa nhãn, title, aria-label và metadata; giữ tên riêng sách giữ. Bỏ cả hai hàng chọn khu/template và nút thử UI; map/sidebar lấp đầy. Không giữ bản original/v2/patch trong repo. Đã kiểm desktop/mobile, giữ nguyên năm mục Inspector. |

## Cơ chế tương tác

`data-occluder="building"` đánh dấu đúng nhóm công trình; `data-forbidden="building|water|furniture"` đánh dấu vùng cấm. Không dùng cả bbox trong suốt làm vùng cấm: bbox chỉ lọc sơ bộ, quyết định dựa trên alpha raster của hình đã vẽ, bao gồm các referenced defs. Raster cache tối đa 1.024 px cạnh dài, tạo khi cần actor, không tải SVG từ mạng.

Khi ribbon chồng lên pixel có hình của công trình, chỉ nhóm đó có opacity `0.3`, ribbon vẫn rõ. Tag không chồng thì công trình bình thường. `inside` tự nó không kích X-Ray. Xóa actor/đổi mẫu phục hồi opacity và giải phóng timer/layer. Vị trí nhãn có thể dịch để nằm trong bounds; vị trí chân giữ độc lập.

Các template mặt bằng dùng nguyên mặt bằng; không tạo mái hoặc nhà nổi giả chỉ để có X-Ray. Với map tự do, có thể dùng lại các thuộc tính nhóm và helper `paintedMask`/`maskOverlaps` khi renderer đã cung cấp artwork và bounds. Không bảo đảm cho mọi geometry tùy ý; không xây pathfinding/solver.

API trình bày dành cho tích hợp và kiểm thử:

```js
await WZWTemplateUI.setTemplate('h1');
await WZWTemplateUI.mountActors(resolvedActors);
WZWTemplateUI.mountEvents(resolvedEvents);
```

`resolvedActors` cần `placeId` hoặc `placeName` khớp metadata của template, `name`, `tagType`, `footstep`; `inside` là trạng thái scene đã được resolver xác định, không phải quyết định của artwork. Không truyền tọa độ Gemini. Khi ngoài vùng cấm không tìm được điểm hợp lệ trong địa điểm, adapter không tự chuyển actor sang nơi khác. Không cấp actors/events thì không sinh NPC/quest/RP mẫu.
`resolvedEvents` dùng `title`, `detail`, `placeId|placeName`, `hidden` cho kiểu icon; đây là dữ liệu trình bày sau resolve, chưa thay contract chung.

## Ghi nhớ bắt buộc cho phiên MAP_DATA sau

Bổ sung hai trường đã duyệt vào contract và MAP_PROMPT khi xây cơ chế MAP_DATA; không tự nhập schema/runtime cũ:

- `actors[].tagType`: AI chọn từ `gryffindor`, `slytherin`, `ravenclaw`, `hufflepuff`, `beauxbatons`, `durmstrang`, `teacher`, `adult`, `patrol`, `animal`, `monster`, `ghost`, `unknown`, `crowd`. Engine đối chiếu token, AI không tự đặt hex. Toàn bộ cặp main/accent giữ nguyên bảng màu trong HTML. PC dùng màu loại/Nhà và viền #D2A64D. Patrol chỉ khi thực sự đang tuần tra (`onPatrol=true`), không suy từ chức danh.
- `actors[].footstep`: `walk|idle|hidden`, AI chọn theo hành động RP có cơ sở. Resolver bảo đảm inside/ngồi/nằm/bơi/lặn ẩn chân nếu không phù hợp. Không dùng hoạt động để tự dịch phòng hoặc tạo đường đi.

Năm mục Inspector giữ nguyên: VỊ TRÍ, NGHE HÓNG, QUAN SÁT, AI ĐÓ, HÓNG HỚT TÁM PHƯƠNG. Metadata cấp vị trí/mô tả; actor cấp tên, hoạt động, quan sát; event cấp đầu mối thực. Không invent RP để lấp trường thiếu. Nối `window.MAP_DATA`, loader đồng SHA và AI Studio Preview thuộc phiên tích hợp sau, chưa triển khai trong nhánh template này.

## Nguồn và Việt hóa

- HTML người dùng: `WIZAMAP_01_FIXED_TEMPLATES_UI_OFFLINE.html`, 966.551 bytes. Artwork/giấy phép nguồn giữ trong dialog Nguồn và giấy phép.
- H1 motion: [repo cũ/elements/h1-motion.js](https://github.com/Ngoc1804/wzw-hogwarts-map/blob/main/elements/h1-motion.js), blob `607d906affdc21c11f750d961e72ff9f824cbf4a`. Tích hợp trực tiếp, không giữ thêm bản module trùng. Không nhập engine/adapter cũ.
- Nội thất mới tái dùng fixture SVG trong HTML, cùng một symbol dùng cho nhiều instance. Đài sân trong sao chép geometry H2, không vẽ đài thay thế. Kệ sách mới dùng một symbol chung, giữ tone mực/giấy.
- Đối chiếu thuật ngữ Lý Lan: [Lều Hét — tập 7](https://vietnamthuquan.eu/TacPham/harry-potter-va-bao-boi-tu-than-2-12341/chuong-33), [Công tước Mật — tập 3](https://thuvien.vietnamthuquan.eu/TacPham/harry-potter-va-ten-tu-nhan-nguc-azkaban-4011/chuong-11), [Ba Cây Chổi Thần — tập 3](https://thuvien.vietnamthuquan.eu/TacPham/harry-potter-va-ten-tu-nhan-nguc-azkaban-4011/chuong-10), [Phú Quý và Cơ Hàn — thư viện Khánh Hòa](https://pr.thuvienkhanhhoa.gov.vn/tai-lieu-so-chuyen-de-237), [Hẻm Xéo/Hẻm Knockturn](https://hogwarts.vn/home/2014/07/choi-chu-hem-xeo-knockturn/), [địa danh và tên tiệm](https://legacy.hogwarts.vn/printthread.php?tid=2371).
- Giữ Hogwarts, Hogsmeade, tên bốn Nhà, Quidditch và họ/tên chủ tiệm. Nhãn loại cửa hàng, phòng và AU chỉ mô tả bằng tiếng Việt; không khẳng định các nhãn diễn giải trong artwork đều xuất hiện nguyên văn trong sách. Các nguồn web đối chiếu không thay thế việc so từng dòng với một ấn bản in cụ thể.

## Dung lượng và bảo trì

HTML hiện khoảng 964 KB, nhỏ hơn bản gốc dù thêm decor, mask và API trình bày. Không tải lẻ asset, không CDN, không backend. Số thập phân rất dài chuẩn hóa tới 3 chữ số, sai số dưới 0,001 đơn vị artwork. Shared symbols tránh nhân bản đồ mới; gzip level 9, mtime=0 bảo đảm pack xác định.

Sửa dữ liệu gốc trực tiếp, không chèn patch runtime:

```sh
python tools/template-data.py unpack work/templates.json
# Sửa JSON/SVG trong work/templates.json
python tools/template-data.py pack work/templates.json
```

`work/` chỉ là thư mục scratch, không commit các bản JSON/SVG giải nén trùng với HTML. Test và ảnh là tài liệu kiểm tra, không được tải bởi HTML production.

## Kiểm thử và giới hạn

Kết quả máy đọc: `tests/qa.json`. Ảnh tổng hợp: `tests/preview.webp`.

- PASS 13/13 template tải, không lỗi JavaScript; không thiếu href hoặc trùng SVG ID.
- PASS 348 vùng tương tác bằng Enter với tên Inspector đối chiếu đúng metadata/aria-label.
- PASS click chuột và tap thật trên mỗi template (26 ca, desktop 1500×950 và mobile 390×844).
- PASS X-Ray đúng nhà Hagrid, opacity 0.3; inside nhưng không chồng tag không mờ; chồng lại thì mờ; xóa actor phục hồi. Nước/ngoài bounds bị từ chối.
- PASS walk sáu use đã đảo chân; reduced-motion còn hai dấu; xóa actor không dư chân/timer. NPC inside không có chân.
- PASS hai kiểu icon, click mở đúng nội dung Inspector; không có actors/events vẫn render.
- Đã xem ảnh H1/H2, Đại Sảnh, bốn nhà chung, X-Ray và mobile; giữ bố cục và màu Nhà.
- Chưa chạy trên Safari hoặc Google AI Studio Preview; chưa nối toàn bộ engine/contract MAP_DATA. Raster theo độ phân giải hữu hạn, không phải chứng minh hình học cho mọi polygon. Không tuyên bố QA cho map generated chưa xây.

Chạy lại bằng Node + Playwright và Chromium:

```sh
node tests/template-ui.cjs
node tests/interaction.cjs
```

Có thể đặt `CHROMIUM_PATH` để chọn Chromium. Lịch theo giờ hoàn tất nhiệm vụ triển khai nhánh này và sẽ được tắt sau khi commit bàn giao được lưu; không tự merge main.

### Sửa nội thất sảnh sau phản hồi

Đã bỏ toàn bộ lớp decor thêm gây chồng chéo, sắp lại cụm tiếp khách phòng giáo viên, giữ một tủ sách sát tường; trả lối bên phải lớp học và tủ hồ sơ đơn của Filch về bố trí gọn. Phòng chờ có hai ghế dài dọc tường, một bàn nhỏ và ghế tách rời. Sân trong giữ một đài H2, bốn chậu cây gốc và hai ghế; bỏ các chậu lặp. Đại Sảnh và bàn bốn Nhà giữ nguyên. Ảnh riêng `tests/hall-review.webp` là bản CHỜ DUYỆT, không phải bản được nghiệm thu.
