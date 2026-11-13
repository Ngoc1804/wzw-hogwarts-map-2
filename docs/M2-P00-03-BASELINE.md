# M2-P00-03 — Baseline dung lượng, dependency, kế hoạch gộp/dọn SVG

**Trạng thái: DONE-DOC / AUDIT ONLY.** Ngày 14/11/2026, branch `M2-P01-baseline-loader`, SHA gốc `828761bb77327af3963f45def367b459f8f8b95c`. Không thay đổi asset, Fixed/UI, layout, runtime hoặc dist.

## 1. Phương pháp & giới hạn
- Đo raw bằng `git tree blob.size`; gzip lấy từ `docs/build-metrics.json` cùng commit (không phải benchmark mạng mới).
- Parse `assets/recipes.json`, đối chiếu 450 catalog ID / 49 recipe / 509 instance với inventory đã kiểm ở baseline trước; catalog SHA không thay đổi từ commit `342d833e` đến SHA này.
- 46 nhóm từ phép dò chữ ký cấu trúc SVG trước đó (**bỏ qua fill, stroke, gradient, defs, clip-path**): chỉ là ứng viên, không chứng minh cùng màu/hình nhìn thấy.
- Chưa chạy Chromium hoặc QA hình, đo thời gian tải/CPU/RAM hay AI Studio. Không được coi audit tĩnh là chứng nhận tương đương pixel.

## 2. Dung lượng tại SHA này

| Đối tượng | Byte raw | Gzip bytes đã có |
|---|---:|---:|
| Tổng repository (163 tracked files, gồm ảnh test + dữ liệu lịch sử) | 36,929,615 | — |
| assets/intake/final-2026-11-14/WIZAMAP_ASSETS_FINAL.html | 298,842 | — |
| assets/intake/final-2026-11-14/WIZAMAP_LAYOUTS_FINAL.html | 212,575 | — |
| assets/catalog.json | 3,360,445 | — |
| assets/recipes.json | 65,970 | — |
| assets/p4-art.json | 1,514,073 | — |
| assets/outdoor-extra.json | 382,536 | — |
| assets/source/catalog.json.gz | 78,321 | — |
| assets/source/interiors.json.gz | 57,205 | — |
| examples/asset-review.html | 3,559,615 | — |
| examples/asset-review-data.json | 3,002,469 | — |
| examples/template-review.html | 966,422 | 700673 |
| examples/p4-review.html | 5,368,563 | — |
| dist/bundle.js | 4,445,428 | 474517 |
| dist/templates-pack.js | 906,641 | 678292 |
| dist/shell.css | 11,034 | 3563 |
| **Tổng 3 file dist** | **5,363,103** | **1,156,372** |

**Phân biệt:** file nguồn, review và dist có bản dữ liệu giống nhau trên GitHub không đồng nghĩa cả ba được tải trong cùng một lần `/map`. Dung lượng repo ≠ dung lượng truyền mạng; gzip trong bảng không bao gồm overhead/cache.

## 3. Điểm trùng/tiềm năng giảm

1. **Catalog 450 ID, 448 chuỗi SVG raw khác nhau.** Ba ID `extra.blackboard`, `extra.blackboard.runtime`, `new.blackboard-long` dùng đúng một SVG. `object.chest` và `object.chest.runtime` còn là ứng viên trùng sau đổi ID nội bộ.
2. **46 nhóm chữ ký hình học / 54 bản ghi dư tiềm năng**. Trần tiết kiệm SVG thô khảo sát: ~715,595 byte; **không** phải dung lượng sẽ tiết kiệm sau gzip hoặc bảo đảm được gộp.
3. **16 asset hậu tố `.detail`** không được recipe gọi trực tiếp, theo yêu cầu user là ứng viên bỏ bản trùng. Phân biệt với **12 asset tiền tố `detail.`** là các đồ độc lập, đang được recipe dùng **16 lần** và phải giữ.
4. **Cây đặc biệt:** giữ `architecture.tree` theo màu H1, giữ **một Liễu Roi màu**; không nhập hai loại cây thành một chỉ vì tên tương tự. `tree.ancient` phải giữ design nếu khác nét.
5. **Nội thất, ghế:** `layout.chair-0/1/2` được recipe dùng 63 lần; ghế trùng *hình học* khác màu mới được chia sẻ SVG, thay màu qua color slots. Không gộp chair khác hình. `new.portrait-1` dùng 16 lượt; nếu gộp về `new.portrait-0` phải remap không mất instance.
6. **Metadata màu có nhưng chưa đủ pipeline:** 104 asset có `colorSlots`, 138 SVG chứa `data-material`, 140 asset khai báo `mount`; `src/draw.js` chưa áp palette thống nhất lên mọi compiled room artwork. Ba cấu hình hành lang (tối giản / đèn-nến / tranh-cây) **khác** ba palette nội thất.
7. **Embedded Room Art:** `assets/p4-art.json` lưu fragments / defs cho 49 recipe, có ~435 KB defs, ~507 KB object fragments và ~367 KB Outdoor sceneSvg ở source; `tools/build.py` bỏ Outdoor art `sceneSvg` khỏi bundle nhưng vẫn đóng gói compiled Indoor fragments/defs. Cần chia sẻ defs có kiểm render thay vì chỉ xóa catalog.
8. **Catalog preview copy:** `examples/asset-review.html` nhúng JSON catalog lớn; `examples/asset-review-data.json` là dữ liệu lịch sử. Nếu nén viewer vẫn phải giữ xem offline. `assets/outdoor-extra.json` và `assets/source/*.gz` hiện không được `tools/build.py` đọc trực tiếp, **không tự xóa** khi chưa kiểm toàn bộ tooling.

## 4. Sơ đồ dependency hiện hành

```text
WIZAMAP_ASSETS_FINAL.html + WIZAMAP_LAYOUTS_FINAL.html
  -> tools/import-p4.cjs
  -> assets/catalog.json + assets/recipes.json + assets/p4-art.json
      -> tools/asset-review.py -> examples/asset-review.html (review offline)
examples/template-review.html (13 Fixed/UI)
  + assets/source/corridors.js + assets/atlas.json + assets/vocabulary.json
  + catalog.json + recipes.json + p4-art.json
  + src/{contract,props,resolver,draw,build,index}.js
  -> tools/build.py
  -> dist/{shell.css,templates-pack.js,bundle.js}
```

`tools/build.py` đã cho SCENERY tham chiếu `CATALOG[id].svg`, **không copy lại** toàn catalog để làm scenery. Phần dư cần chú ý là compiled room defs/object và các bản review/source lịch sử. Dist chỉ sinh từ code nguồn, không patch thủ công.

## 5. Keep – share – drop; chưa xóa

| Đối tượng | Phán quyết |
|---|---|
| Hai HTML FINAL gốc, license notices | **KEEP** nguyên byte/hash để đối chiếu |
| 13 Fixed + UI, defs/IDs/shading/motion | **KEEP EXACT** không đổi |
| 49 recipe / 509 instance | **KEEP**, không xóa vật lý khi chia sẻ SVG |
| 450 ID public | **KEEP RESOLVABLE** qua canonical + alias, không ép số ID phải còn 450 SVG |
| Blackboards raw-identical | **SHARE** payload, vẫn duy trì các ID cũ |
| 16 hậu tố `.detail` và các pair cây/nhà/tranh/cabinet | **SHARE/DROP COPY sau QA màu, shape, refs**; chọn bản không-detail đã được user duyệt |
| 12 tiền tố `detail.` | **KEEP** riêng, không nhầm với suffix |
| Chair/bench/sofa, 3 palette nội thất | **HOLD** bản khác hình; định nghĩa vật liệu/color slots trước khi gộp màu |
| Test screenshots, old audit, historical JSON | **ARCHIVE**; rà dependency trước khi bỏ khỏi production phân phối |
| `dist/*` | **GENERATE ONLY**, không duy trì nhánh chỉnh sửa thứ hai |

Danh sách **46 nhóm ứng viên và 5 nhóm watch**: [M2-P00-03-SVG-DECISIONS.csv](M2-P00-03-SVG-DECISIONS.csv). Canonical trong CSV là *đề xuất*, KHÔNG phải lệnh xóa được áp dụng.

## 6. Bàn giao cho P08 / nghiệm thu P09

- P08-01: khóa mapping canonical/alias và dependency; sửa compiler trước (import-p4.cjs), sau đó catalog/recipes/p4-art; dùng defs/symbol theo phạm vi an toàn; tránh rebuild tái tạo bản `.detail`.
- Bảo toàn gradient, màu, opacity, layer, transform, viewBox, clip/reference và animation; **không** lấy palette 3 bộ của sandbox áp lên 13 Fixed; không xóa shape chi tiết khác design.
- Kiểm 450 ID resolvable, 49 recipe, 509 instance, 13 Fixed, RP props/merge/replace, visual ở size thật (trước/sau), defs/refs, X-Ray/footsteps và UI click.
- P09-02: đo lại byte raw/gzip, request thực, render, memory, SVG nodes và ảnh pixel-diff ở desktop/mobile/AI Studio (nếu truy cập đích). Ghi lỗi/độ lệch; nếu chưa chạy thì NOT RUN.
- Chỉ xóa file code/data lịch sử khi đã xác nhận không còn phụ thuộc từ tooling/QA.

## 7. Trạng thái QA P00-03

**PASS:** đọc đúng commit/branch, raw sizes, gzip baseline có sẵn, recipe JSON đủ 49 và 509 instance, bảng nhóm 46 + 5 theo scan catalog không đổi; không thay source/build trong audit.

**NOT RUN:** kiểm trình duyệt, visual before/after, network/time/memory, Preview. Đây là mốc tài liệu, không gắn PASS cho P08 hay P09.

Machine-readable: [M2-P00-03-METRICS.json](M2-P00-03-METRICS.json).
