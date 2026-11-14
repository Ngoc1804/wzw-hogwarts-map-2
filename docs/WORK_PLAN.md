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
| P2 | Gemini/AI Studio | Loader CSS/pack/bundle đã đồng bộ pin a8cb85c và kiểm CDN; còn nghiệm thu Preview, hồ sơ phiên bản để sau | Kiểm thực tại AI Studio; không suy từ test local |

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

## Đã sửa tiếp: cửa/hành lang và resize

- Cửa/hành lang dùng vùng đặt hợp lệ thay vì ép mọi người vào một điểm; tránh tường kín, cửa sổ và vật cản.
- Resize desktop/mobile hoặc drawer tính lại tag/chân; zoom/pan không tự đổi điểm đứng.
- Thêm kiểm hồi quy horizontal/vertical, 2/4/5 người, chuyển viewport và nhiều người ngoài trời.
- Chỉ sửa presentation và build liên quan; asset, màu và layout nguồn giữ nguyên. AI Studio/duyệt hình vẫn để sau.

## Decor Fixed đã được duyệt

Người dùng đã duyệt HTML local có so sánh trước/sau và yêu cầu đẩy lên nhánh M2-P01-baseline-loader. Đã thay artwork nguồn của hall, gryffindor-common, ravenclaw-common, hufflepuff-common, slytherin-common; build lại pack. Bản cũ chỉ giữ trong lịch sử Git, không thêm HTML review hay renderer song song. Nhiệm vụ decor Fixed trong bảng P1 phía trên đã hoàn tất; decor layout vẫn là phạm vi riêng.

Bước tiếp theo: rà dependency/file thừa, hợp nhất tài liệu và tối ưu prompt dựa trên contract hiện hành; lập danh sách giữ–gộp–bỏ trước khi xóa.

## Plan tiếp theo — dọn project và prompt sau decor

Khảo sát tại commit decor `aae54f4`: 111 file theo cây được theo dõi (33 docs, 27 tests, 20 tools, 14 assets, 6 src, 5 examples, 3 dist và 3 file gốc). Chưa xác nhận file nào thừa chỉ từ tên.

1. **Inventory/dependency:** cập nhật FILE_INVENTORY từ cây thật; truy vết import, build, script sinh, link HTML/docs và test. Phân loại nguồn duy nhất, file sinh bắt buộc, tài liệu hiện hành, báo cáo lịch sử và file không còn người dùng. Xóa sau khi có bằng chứng không phụ thuộc; lịch sử Git giữ bản cũ.
2. **Nguồn và bản sinh:** giữ ba HTML hiện hành (ASSETS/FIXED_UI/LAYOUTS), index và loader cần thiết. Không đưa HTML duyệt tạm vào repo. Loại file sinh dư/trùng nếu truy vết chứng minh; rebuild trên checkout sạch phải tạo lại đủ output.
3. **Docs:** gộp chỉ dẫn hiện hành và dọn redirect/báo cáo lỗi thời. `WZW_MAP2_ATLAS_GITHUB_MASTER.md` hiện là nguồn của atlas.py và prompt.py, không xóa trực tiếp. Đối chiếu W4_TAIL, W4_1, MAP_DATA_GITHUB_GEMINI_REVIEW, PROJECT_READINESS và prompt-provenance với code trước khi gộp/bỏ. Không dùng báo cáo cũ để chứng nhận HEAD mới.
4. **Code/payload:** đo bytes thô/gzip và tham chiếu SVG; tìm dữ liệu layout/artwork/catalog bị nhúng trùng, hàm/adapter không còn caller. Ưu tiên giảm payload bundle (hiện 7,328,560 bytes thô) và pool SVG decor mà bảo toàn hình đã duyệt. Không xóa metadata/recipe/layout chỉ để giảm số file hoặc mất tính năng RP. Chốt số đo trước/sau.
5. **Prompt duy nhất:** hiện chưa có system prompt cuối; tools/prompt.py chỉ sinh Atlas-only fragment. Đối chiếu contract/resolver/loader thực, hợp nhất luật /map, Atlas nén, field bắt buộc, nhóm/PC/spot và visual/fallback thành một khối dán. Loại luật lặp, ví dụ dài không cần thiết và tham chiếu legacy. Dùng runtime-release cho SHA thật; đo ký tự/bytes/token với tokenizer được ghi rõ, không ước lượng thành kết quả đo.
6. **Kiểm và bàn giao:** rebuild từ checkout sạch, kiểm refs/IDs, routing/placement/loader và ảnh trước/sau năm template. Chỉ chạy lại test liên quan sau từng nhóm sửa; nghiệm thu AI Studio ghi riêng khi có bằng chứng tại đích. Bàn giao manifest giữ–gộp–bỏ, metric trước/sau, một prompt và một pin runtime.

Lượt push decor chỉ thay artwork chính, pack sinh lại, tài liệu trạng thái và pin loader. Dọn code/file/prompt diện rộng là lượt triển khai tiếp theo theo plan này.
