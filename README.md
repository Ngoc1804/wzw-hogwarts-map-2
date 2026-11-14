# WIZAMAP · Các bộ nguồn đã chốt

Dọn file và sửa presentation ngày 14/11/2026, từ `M2-P01-baseline-loader@d1eec88`.

Mở [trang chọn HTML](index.html). Tải repository bằng **Code → Download ZIP**, giải nén và mở `index.html` bằng Chrome/Edge/Firefox mới. Các HTML chính chạy offline, không cần CDN. GitHub blob chỉ hiển thị mã HTML.

| Bộ | File hiện hành | Trạng thái |
|---|---|---|
| 443 asset, icon, editor màu | [WIZAMAP_ASSETS.html](examples/WIZAMAP_ASSETS.html) | Bộ asset đã chốt; giữ 443 ID, chia sẻ 3 bản SVG trùng trong bản sinh |
| 13 Fixed + UI | [WIZAMAP_FIXED_UI.html](examples/WIZAMAP_FIXED_UI.html) | Giữ nguyên artwork/UI; decor sảnh và bốn nhà làm sau |
| Layout H40 S/M/L | [WIZAMAP_LAYOUTS.html](examples/WIZAMAP_LAYOUTS.html) | Giữ bản hiện hành; danh sách phòng đổi màu chờ lượt sau |

## Nguồn duy nhất

- `assets/catalog.json`: 443 ID và artwork nguồn, giữ SVG màu đã chốt. Hai cụm picnic được đặt tên phân biệt có chai/không chai.
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

Các tài liệu nghiệm thu cũ chỉ chứng minh phạm vi ở commit ghi trong tài liệu. Loader/prompt hiện pin runtime `f801eff`; ba file CDN đã tải thật và khớp dist. `prompt-provenance.json` là hồ sơ cũ, để cập nhật sau theo yêu cầu. AI Studio chưa nghiệm thu; chưa phát hành hoặc merge main.

Hai HTML kiểm runtime/mechanisms cũ đã xóa hẳn cùng công cụ sinh. Bộ kiểm mới sẽ làm sau từ nguồn đã chốt. Test hồi quy dùng harness trong bộ nhớ, không sinh lại HTML cũ.
