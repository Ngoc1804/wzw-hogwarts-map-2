# Bảng việc sau khi dọn file

Quyết định người dùng: dọn file trước; decor/đổ màu/tên cửa hàng làm sau. Tên theo bản Lý Lan; chưa xác minh thì giữ thương hiệu. Không tự gắn nhãn vị trí AU thành canon.

| Ưu tiên | Bộ/file | Việc cần làm | Điều kiện chốt |
|---|---|---|---|
| P0 | Assets | Giữ 443 ID, editor màu; chia sẻ SVG trùng; phân biệt hai cụm picnic | Không mất màu/hình/alias; editor xuất/mở lại chạy offline |
| P0 | Toàn project | Một bộ tên file; bỏ HTML FINAL gốc, bản cũ và công cụ import cũ | Rebuild không cần file đã xóa; không đổi hash artwork Fixed/UI |
| P0 | Hai HTML kiểm cũ | Đã xóa hẳn HTML, nút mở và công cụ sinh; bộ kiểm mới làm sau | Rebuild không tạo lại hai file |
| P1 | Fixed/UI · hall | Decor lại cụm phòng giáo viên, Filch, lớp 11 và phòng phụ phù hợp | Xem ảnh trước/sau; giữ cửa, lối đi, ID, PC/NPC và vùng bấm |
| P1 | Fixed/UI · bốn phòng chung | Decor riêng theo bản sắc Gryffindor/Ravenclaw/Hufflepuff/Slytherin | Giữ màu Nhà; đồ cân đối, không chắn cửa; desktop/mobile |
| P1 | Hogsmeade + Hẻm Xéo/Knockturn | Rà tên canon bản Lý Lan; tên chưa chắc giữ thương hiệu; điền nhãn, alias, mô tả và tọa độ | Một ID/địa điểm, có marker bấm được; tách canon thương hiệu và vị trí AU; xét mốc thời gian RP |
| P1 | H40 S/M/L | Lập danh sách phòng cần đổ màu rồi sửa từng phòng | Duyệt trước/sau ở S/M/L; không tự recolor toàn bộ |
| P2 | Runtime | Nghiệm thu layout Indoor/Outdoor, inventory/đồ con/X-Ray và 13 Fixed đầy đủ | Bảng ca và kết quả thật; không lấy HTML mở được làm nghiệm thu cơ chế |
| P2 | Gemini/AI Studio | Loader CSS/pack/bundle đã đồng bộ pin f801eff và kiểm CDN; còn nghiệm thu Preview, hồ sơ phiên bản để sau | Kiểm thực tại AI Studio; không suy từ test local |

Nguồn đối chiếu địa danh cho lượt sau:
- https://www.harrypotter.com/fact-file/locations/diagon-alley
- https://www.hp-lexicon.org/place/shops-and-stores/
- https://www.hp-lexicon.org/place/great-britain-united-kingdom/scotland/hogsmeade/
- Tên Phú Quý và Cơ Hàn có đối chiếu tiếng Việt; các tên khác chưa được chứng nhận đồng loạt là bản dịch Lý Lan.

Lượt dọn này không sửa decor, palette phòng, tên cửa hàng, tọa độ hoặc hành vi RP.

## Sửa presentation theo phản hồi

- Tên/icon/footstep dùng cùng tọa độ và tỉ lệ zoom; không dịch nhãn tự do khỏi nhân vật.
- H1, H2, Hogsmeade, Hẻm Xéo và Outdoor: ở trong nhà giữ tên, bỏ chân; bên ngoài có chân. Các map còn lại bắt buộc có chân dưới tên.
- Tên layout hiện hành: `WIZAMAP_LAYOUTS.html`; bỏ hậu tố H40_SML.

## Chốt sau rà soát runtime

- PC: prompt bắt buộc có PC/place/spot; đóng mục xử lý payload thiếu vị trí, không thêm cơ chế đoán vị trí.
- Fixed canon: chỉ giữ artwork và đặt tag đúng địa điểm; inventory/đồ vật/construction/detail không thuộc phạm vi. Không mở task thêm cơ chế đồ vật Fixed.
- Cập nhật test độc lập HTML đã xóa; chỉnh contract và loader CDN theo bản đang dùng.
- Công cụ kiểm ID tự tạo work/ trên checkout mới.
- Hồ sơ hash/provenance: để sau theo yêu cầu, không chứng nhận lại trong lượt này.

## Lượt đã được duyệt: alias và nhóm nhân vật

- HTML xuất từ catalog giữ SVG snapshot riêng của alias/canonical; không đổi màu mặc định hoặc geometry/ID nguồn. Không làm pipeline nhập màu.
- Trên 4 người cùng phòng/spot: PC riêng, NPC một nhóm; giữ đầy đủ thành viên và thông tin.
- Đặt tag trên sàn trong địa điểm, tránh tường/nội thất lớn; ngoại lệ chỉ theo RP. Điểm và tỉ lệ tag/chân đi cùng bản đồ khi zoom.
- Đã bỏ tests/template-ui.cjs, tools/review-contact-sheet.cjs, tools/catalog-measure.cjs. Không tạo nghiệm thu X-Ray/AI Studio mới từ việc dọn này.
- Màu đang làm ở phiên khác, decor và nghiệm thu hình/AI Studio tiếp tục để sau.
