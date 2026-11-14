# Tích hợp S/M/L vào M2-P01-baseline-loader

Nguồn nhánh duyệt: ATLAS_CAN_DUYET, commit 3615b31ddf234cff923698c20aa96729d853cab2. Nhánh đích chuẩn: M2-P01-baseline-loader, nền 3c6a8674a00f25359e68f6a3b41e4c0f5ae8c834.

Chuyển chọn lọc generator layout review H40/S/M/L vào nhánh chuẩn, không merge ngược các file engine cũ của nhánh duyệt. Theo chỉ dẫn mới của người dùng, bảng phối màu thử nghiệm không được áp; màu FINAL mặc định được giữ. Hai HTML intake FINAL giữ nguyên byte.

## Dữ liệu và runtime

- `tools/build-layout-review.py`: generator từ nhánh duyệt; giữ sửa dải sàn thừa, cửa Bắc Hiệu trưởng, H40, S/M/L và bỏ signage trong bản review; không áp palette thử nghiệm.
- `tools/import-layout-sizes.cjs`: compile artwork 41 layout Indoor × 3 size từ bản review, đối chiếu inventory nguồn và giữ các ID instance hiện hành. Instance cùng asset được ghép theo thứ tự xuất hiện trong nhóm asset, không phát sinh ID instance khác theo size.
- `assets/recipes.json`: thêm sizeProfiles của layout.
- `assets/layout-sizes.json`: bố trí đồ đã compile theo size; editor không được chạy trong RP.
- `src/draw.js`: chọn artwork theo size, giữ pipeline state/child/extra props.
- `src/build.js`: bỏ hệ số 0.8/1/1.3, dùng width/height từ profile; phòng đơn giữ đúng kích thước; hành lang đơn có inventory riêng được render. Multi-room tiếp tục qua topology hành lang hiện có, có thể điều chỉnh frontage/depth để ghép các nhánh; không tuyên bố đã port mọi hình phòng đặc biệt của editor.
- `tools/build.py`: đưa dữ liệu size vào bundle production; Fixed và Outdoor không đổi cơ chế kích thước.

| Layout | S | M (mặc định) | L |
|---|---|---|---|
| OFFICE | 360 × 320 | 410 × 360 | 470 × 400 |
| POTIONS_LAB | 640 × 480 | 740 × 540 | 830 × 600 |
| LIBRARY | 900 × 640 | 1040 × 720 | 1170 × 810 |
| HEADMASTER_OFFICE | 860 × 600 | 990 × 690 | 1130 × 790 |

Đơn vị geometry nội bộ, không phải pixel Preview. Tường H40. `S/M/L` và `small/medium/large` cùng được nhận; thiếu size dùng M. Size phòng không điều khiển zoom.

## Tái lập

```sh
python tools/build-layout-review.py
node tools/import-layout-sizes.cjs
python tools/build.py
node tests/layout-sizes.cjs
node tests/indoor-placement.cjs
node tests/routing-current.cjs
python tools/check-id-links.py
```

## Kiểm tra mới

- 123 lượt render runtime Indoor: 41 layout × S/M/L, đúng kích thước profile phòng đơn, H40, đủ instance, không lỗi trang.
- Alias small/medium/large và mặc định M; xóa đúng instance ở S/L; Fixed không đổi khi đổi size.
- 10 preset qua kiểm placement/replace/posture/support hiện có.
- 8 fixture routing và kiểm AU order/overflow/uniqueness/missing PC.
- Kiểm liên kết catalog/recipe/Atlas/art: 0 issue trong phạm vi script; 49 recipe, 509 instance, 443 catalog asset, 13 Fixed, 59 scope.

Đây là kiểm kỹ thuật cục bộ, không phải duyệt thẩm mỹ toàn bộ layout hay nghiệm thu Gemini/AI Studio Preview. Prompt/CDN chưa đổi, bảng contract chờ người dùng duyệt, zoom/footer và dọn repo thuộc bước sau.

Artwork theo ba size làm bundle lớn hơn; số byte và gzip mới nằm trong build-metrics.json. Chưa thực hiện dọn hoặc tối ưu dung lượng trong lượt tích hợp này.
