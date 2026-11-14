# WIZAMAP · Các bộ nguồn đã chốt

Dọn file và sửa presentation ngày 14/11/2026, từ `M2-P01-baseline-loader@d1eec88`.

Mở [trang chọn HTML](index.html). Tải repository bằng **Code → Download ZIP**, giải nén và mở `index.html` bằng Chrome/Edge/Firefox mới. Các HTML chính chạy offline, không cần CDN. GitHub blob chỉ hiển thị mã HTML.

| Bộ | File hiện hành | Trạng thái |
|---|---|---|
| 452 asset, icon, editor màu | [WIZAMAP_ASSETS.html](examples/WIZAMAP_ASSETS.html) | Bộ asset đã chốt; giữ 452 ID, chia sẻ 3 bản SVG trùng trong bản sinh |
| 13 Fixed + UI | [WIZAMAP_FIXED_UI.html](examples/WIZAMAP_FIXED_UI.html) | Decor Sảnh và bốn Nhà đã được duyệt; UI/ID giữ nguyên |
| Layout H40 S/M/L | [WIZAMAP_LAYOUTS.html](examples/WIZAMAP_LAYOUTS.html) | 49 layout đã chốt; giữ decor, sàn/tường và size S/M/L |

## Nguồn duy nhất

- `assets/catalog.json`: 452 ID và artwork nguồn, giữ SVG màu đã chốt. Hai cụm picnic được đặt tên phân biệt có chai/không chai.
- `assets/{recipes,p4-art,layout-sizes,atlas,vocabulary}.json`: dữ liệu runtime đang dùng, không xóa theo hai HTML FINAL gốc. Recipe/instance không phải bản sao của file HTML.
- `assets/{paint-edits,finish-paint}.json`, hai icon, `assets/source/corridors.js`, `assets/FINAL_NOTICES.txt`: quyết định màu, kiến trúc và giấy phép.
- `examples/WIZAMAP_FIXED_UI.html`: nguồn 13 Fixed/UI mà build đọc. Lượt sửa zoom/footstep chỉ thay presentation, không đổi artwork. `examples/WIZAMAP_LAYOUTS.html`: nguồn layout được giữ; `tools/import-layout-sizes.cjs` compile S/M/L khi có thay đổi được chốt.
- `src/*` + `tools/*`: mã nguồn và pipeline; `dist/*` và HTML assets được sinh lại. Không patch trực tiếp file sinh.

Hai HTML FINAL gốc, dữ liệu catalog cũ, mẫu !/?/ba palette và ảnh/log cũ đã bỏ khỏi cây hiện hành. Importer đọc các HTML đó cũng đã bỏ để tránh rebuild đưa bản cũ trở lại. Lịch sử nằm tại commit `d1eec88`, không rewrite lịch sử Git.

## Build và kiểm

```sh
python tools/rebuild.py
node tests/presentation.cjs
node tests/catalog-editor.cjs
```

Python 3.12+, Node và Playwright/Chromium cho test; không cần các công cụ này để mở HTML. `work/` chứa file tạm và kết quả test, không commit.

ID public được giữ ổn định. SVG trùng chỉ chia sẻ payload theo XML tương đương, có giữ màu/geometry/viewBox và quan hệ local reference; không gộp instance hay xóa cụm khác hình. Xem [manifest dọn file](docs/CLEANUP_MANIFEST.json), [bảng việc cần làm](docs/WORK_PLAN.md), [báo cáo kiểm zoom/footstep](docs/PRESENTATION_QA.json).

Các tài liệu nghiệm thu cũ chỉ chứng minh phạm vi ở commit ghi trong tài liệu. Loader hiện lấy commit từ `assets/runtime-release.json`; ví dụ tải CDN là `examples/loader-cdn.html`. `MAP_PROMPT.md` legacy đã bỏ; system prompt mới sẽ làm riêng. `prompt-provenance.json` là hồ sơ cũ, để cập nhật sau theo yêu cầu. AI Studio chưa nghiệm thu; chưa phát hành hoặc merge main.

Hai HTML kiểm runtime/mechanisms cũ đã xóa hẳn cùng công cụ sinh. Bộ kiểm mới sẽ làm sau từ nguồn đã chốt. Test hồi quy dùng harness trong bộ nhớ, không sinh lại HTML cũ.

## Decor layout đã chốt

[Hướng dẫn tích hợp](docs/DECOR_INTEGRATION.md): `WIZAMAP_LAYOUTS.html` là file người dùng duyệt, thay bản cũ. Build giữ 49 layout × S/M/L, sàn/tường H40 và các chỉnh sửa theo size. Xem `docs/DECOR_IMPORT.json` để đối chiếu hash nguồn.

## Nhóm và vị trí nhân vật

Trên 4 người cùng phòng/spot thì NPC được trình bày thành nhóm, PC giữ tag riêng. Danh sách RP không bị sửa/cắt; click tag xem đủ thành viên và thông tin. Tag đặt trên phần sàn còn trống, tránh tường/đồ lớn, ngoại lệ theo yêu cầu RP; zoom/pan giữ cùng điểm neo.

Kiểm hồi quy alias và vị trí: `node tests/alias-export.cjs`, `node tests/actor-placement.cjs`. Test X-Ray template cũ và hai tool phụ thuộc dữ liệu review đã xóa đã được bỏ. Không đổi màu mặc định hoặc nhập màu từ phiên khác.

Cửa/hành lang dùng vùng sàn hợp lệ để tách nhân vật; resize tính lại bố trí và tỉ lệ tag/chân. Kiểm ca chuyển viewport: `node tests/passage-resize.cjs`.

## Địa điểm hai hẻm và Hogsmeade

[Đối chiếu 53 mục và bảng hiệu](docs/SHOP_NAME_AUDIT.md): 52 công trình được gán tên, một điểm đường tới ga; còn nhà trống theo khu cho AU. Chạy `node tests/shop-bindings.cjs` để kiểm tra tra cứu song ngữ, hai chi nhánh Mulpepper và tránh gán AU đè địa điểm đã có chủ.
