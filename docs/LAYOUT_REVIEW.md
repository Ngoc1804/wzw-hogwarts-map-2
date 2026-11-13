# Layout H40 / S–M–L — chờ người dùng duyệt

## C2 — Bảy mẫu màu Hogwarts Vintage

Đã áp dụng recipe vật liệu cho Library, Potions Lab, Art/Cartography Studio, Lounge, Bathroom, Headmaster Office và Ballroom. Các phòng khác giữ màu source trong lượt duyệt này. Ballroom giữ nền và chi tiết source, chỉ đặt slot gỗ óc chó. [Ảnh Library](layout-review/sample-library.png) · [Potions](layout-review/sample-potions.png) · [Art Studio](layout-review/sample-art-studio.png) · [Lounge](layout-review/sample-lounge.png) · [Bathroom](layout-review/sample-bathroom.png) · [Headmaster](layout-review/sample-headmaster.png) · [Ballroom](layout-review/sample-ballroom.png).

Kiểm Chromium local 168 tổ hợp PASS; Office giữ màu ổn định sau khi render Library. Chờ duyệt hình ảnh trước khi nhân rộng 41 phòng. AI Studio Preview ở bước cuối.

Bản duyệt riêng trên **ATLAS_CAN_DUYET**, base `84f9f82`. Chưa gộp vào nhánh triển khai hoặc main; không thay HTML source FINAL nguyên bản hoặc runtime Map 2.

## Mở bản duyệt

Tải [HTML offline](../examples/WIZAMAP_LAYOUTS_REVIEW_H40_SML.html) bằng **Download raw file**, mở trong browser hiện đại. Chọn phòng bên trái và S/M/L trên toolbar. Không cần tải asset bên ngoài.

- 49 layout, ba size đặt sẵn; giữ hình riêng của phòng đặc biệt, phòng thường có kích thước/tỷ lệ phù hợp công năng.
- Khóa H40, cửa/cửa sổ theo hệ chiếu nguồn. Cửa phòng Hiệu trưởng nằm ở biên phía Bắc.
- Bỏ toàn bộ chữ SVG/signage; click phòng/đồ vật xem sidebar. Không có toast nhãn trên map.
- **Bỏ hẳn hình học dải sàn/tường thừa dưới phòng**, không chỉ xóa chữ. Bỏ phần nhô thừa ở lối vào phòng Hiệu trưởng, giữ ba gian phòng.
- Nội thất dùng source; vật liệu/hoạ tiết tường gán theo công năng. Mỗi size có kích thước rõ trong sizeProfiles/export.

## Kết quả kiểm

[QA chi tiết](layout-review/qa.json): **168 tổ hợp phòng × size × biến thể** đã render bằng Chromium local; không pageerror, không node text trên SVG, không ID trùng, không dải sàn vượt sâu phòng, không món bị source báo dropped do capacity. Click Office cập nhật sidebar đúng ID/size/kích thước/H40.

Đã xem ảnh Office/Hiệu trưởng; không coi kiểm cấu trúc 168 tổ hợp là đã duyệt thẩm mỹ mọi hình. Chưa nghiệm thu AI Studio Preview. User chưa duyệt bản này.

Ảnh: [Office M](layout-review/office-M.png) · [Hiệu trưởng M](layout-review/headmaster-M.png) · [Mobile](layout-review/mobile.png).

## Nguồn và build

Source input: `assets/intake/final-2026-11-14/WIZAMAP_LAYOUTS_FINAL.html`, SHA-256 `2d7b484dcf8be8bd9a5cbe5fe43af3cc915d484270eff9168ce71851d2ccdcb9` (khớp file user cấp lại).

```sh
python tools/build-layout-review.py
```

Chỉ sinh HTML review. Chờ user duyệt trước tích hợp template size vào source chính; không coi bản review là renderer thứ hai của runtime.

## Sửa màu sau khi người dùng từ chối bản 326ab8f

Bản phối tám màu đậm và Ballroom xanh tuyết **không được duyệt**, đã thay thế trong HTML hiện tại.

- Tone dự án: giấy kem ấm, đá vôi/đá xám sáng, gỗ tự nhiên, kim loại đồng cũ; vải xanh sage, xanh xám và đỏ đất dịu làm điểm nhấn nhỏ.
- 32 phòng công năng chọn bảng vật liệu theo nhóm công năng (học tập, sinh hoạt, chế tác, đá, khu ướt). Nền sáng hơn đồ; không quay vòng màu xanh/tím cho gỗ.
- Giữ màu riêng của sách, giấy, vải, kính, kim loại và chi tiết nguồn. Chỉ đổi slot gỗ; không quét đổi mọi màu SVG theo RGB.
- Ballroom khôi phục sàn/tường/vải/chi tiết gốc; chỉ đổi slot gỗ sang óc chó dịu `#9a8068`.
- Giữ nguyên H40, S/M/L, bố cục và số đồ. Phòng đặc biệt khác cùng outdoor giữ bảng màu nguồn.
- Kiểm lại 168 tổ hợp PASS: không lỗi JavaScript, không chữ SVG, không ID trùng, không món bị source báo dropped, không dải sàn thừa. Đã xem ảnh Thư viện và Ballroom. Chưa nghiệm thu AI Studio Preview; **chờ người dùng duyệt thẩm mỹ**.

Ảnh hiện tại: [Thư viện](layout-review/library-color.png) · [Xưởng chế tác](layout-review/workshop-color.png) · [Phòng khiêu vũ](layout-review/ballroom-color.png) · [Office](layout-review/office-M.png).
