# Layout H40 / S–M–L — chờ người dùng duyệt

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
