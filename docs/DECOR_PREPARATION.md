# Chuẩn bị decor — chưa áp vào artwork

Phạm vi được chuẩn bị trực tiếp trên `M2-P01-baseline-loader`. Không đổi hình H1/H2, vị trí/ID/lối đi, palette bốn Nhà hoặc màu asset đã chốt.

## Fixed cần decor

| Map | ID mục tiêu | Định hướng |
|---|---|---|
| hall | `gf-staff`, `gf-filch`, `gf-class11`, `gf-waiting`, `gf-antechamber`, `gf-broom` | Phòng giáo viên: khu ngồi/đọc và tài liệu; Filch: hồ sơ, đồ vệ sinh; lớp 11: phòng chưa dùng; phòng phụ theo chức năng. |
| gryffindor-common | `gryffindor-hearth`, `gryffindor-sleep-0`, `gryffindor-sleep-1` | Giữ đỏ/vàng; gỗ ấm, sách, thảm, đồ dùng sinh hoạt; không chắn lò sưởi/cửa/cầu thang. |
| ravenclaw-common | `ravenclaw-hearth`, `raven-rowena`, `ravenclaw-sleep-0`, `ravenclaw-sleep-1` | Giữ màu Nhà; góc học/đọc và thiên văn; giữ tượng Rowena và cửa đại bàng. |
| hufflepuff-common | `huff-lounge`, `hufflepuff-bed-0`, `hufflepuff-bed-1`, `hufflepuff-bed-2`, `hufflepuff-bed-3`, `hufflepuff-bed-4` | Giữ màu Nhà; gỗ, cây và vật dụng sinh hoạt; giữ cửa thùng gỗ và đường hầm. |
| slytherin-common | `sly-lounge`, `sly-study`, `slytherin-bed-0`, `slytherin-bed-1`, `slytherin-bed-2`, `slytherin-bed-3`, `slytherin-bed-4` | Giữ màu Nhà; đồ gỗ/đá và góc học; giữ cửa sổ Hồ Đen, cửa đá và hành lang. |

## Layout làm theo từng phòng

Bản preview chỉnh decor trên nhánh `DECOR@b432657` là tài liệu xem riêng; chưa gộp hay áp bản chỉnh màu đó vào runtime. Danh sách 49 layout và kích thước nguồn đầy đủ nằm trong `assets/decor-plan.json`.

| Layout | Tên | Kích thước cần rà |
|---|---|---|
| `HEADMASTER_OFFICE` | Văn phòng Hiệu trưởng | S / M / L |
| `DIVINATION_CLASSROOM` | Phòng Tiên tri | S / M / L |
| `ASTRONOMY_OBSERVATORY` | Đài thiên văn | S / M / L |
| `PREFECTS_BATHROOM` | Phòng tắm Huynh trưởng | S / M / L |
| `ROOM_OF_REQUIREMENT` | Phòng Yêu Cầu | S / M / L |
| `CHAMBER_OF_SECRETS` | Phòng chứa Bí mật | S / M / L |
| `TOWER_CLOCKWORK` | Máy tháp / tháp chuông | S / M / L |
| `BALLROOM` | Phòng khiêu vũ | S / M / L |
| `TROPHY_ROOM` | Phòng Cúp | S / M / L |
| `CLASSROOM` | Lớp học lý thuyết | S / M / L |
| `MAGIC_PRACTICE` | Thực hành phép thuật | S / M / L |
| `POTIONS_LAB` | Phòng Độc dược | S / M / L |
| `RESEARCH_LAB` | Phòng nghiên cứu | S / M / L |
| `OFFICE` | Phòng làm việc | S / M / L |
| `STUDY_ROOM` | Phòng tự học | S / M / L |
| `MEETING_CLUB` | Phòng họp / CLB | S / M / L |
| `LIBRARY` | Thư viện | S / M / L |
| `ARCHIVE` | Kho hồ sơ | S / M / L |
| `STORAGE` | Kho đồ | S / M / L |
| `WORKSHOP` | Xưởng chế tác | S / M / L |
| `GALLERY` | Phòng trưng bày | S / M / L |
| `MUSIC_ROOM` | Phòng nhạc | S / M / L |
| `LOUNGE` | Phòng khách / nghỉ | S / M / L |
| `BEDROOM` | Phòng ngủ | S / M / L |
| `KITCHEN` | Phòng bếp | S / M / L |
| `DINING_ROOM` | Phòng ăn | S / M / L |
| `BATHROOM` | Phòng tắm thường | S / M / L |
| `LAUNDRY` | Phòng giặt | S / M / L |
| `HOSPITAL_WARD` | Bệnh xá | S / M / L |
| `RECEPTION` | Tiếp tân / chờ | S / M / L |
| `GUARDROOM` | Phòng trực gác | S / M / L |
| `PASSAGE_PROPS` | Trang trí hành lang | S / M / L |
| `UTILITY_ROOM` | Phòng kỹ thuật | S / M / L |
| `SECURE_VAULT` | Kho bảo mật | S / M / L |
| `DETENTION_CELL` | Buồng giam | S / M / L |
| `PUBLIC_COUNTER` | Quầy hàng / quán nhỏ | S / M / L |
| `CEREMONY_HALL` | Phòng nghi lễ | S / M / L |
| `ENTRANCE_VESTIBULE` | Sảnh vào / tiền sảnh | S / M / L |
| `CLOAKROOM_LOCKERS` | Phòng áo khoác / tủ đồ | S / M / L |
| `ART_CARTOGRAPHY_STUDIO` | Xưởng mỹ thuật / bản đồ | S / M / L |
| `GAMES_ROOM` | Phòng cờ / Gobstones | S / M / L |
| `OUT_COURTYARD` | Sân trong / sân lát đá | S / M / L |
| `OUT_GARDEN` | Vườn / khu nghỉ | S / M / L |
| `OUT_LAWN` | Bãi cỏ / sân hoạt động | S / M / L |
| `OUT_WOODLAND` | Bìa rừng / đường mòn | S / M / L |
| `OUT_WATERSIDE` | Ven hồ / ven sông | S / M / L |
| `OUT_BUILDING_YARD` | Nhà và sân phụ trợ | S / M / L |
| `OUT_CAMP` | Khu trại / nơi trú tạm | S / M / L |
| `OUT_SERVICE_GARDEN` | Vườn trồng / sân làm việc | S / M / L |

## Trình tự thực hiện

1. Lấy baseline từ đúng nguồn và hash trong manifest, không lấy bộ màu ở nhánh khác thay mặc định.
2. Làm nhóm hall, rồi từng Nhà; layout làm từng phòng S/M/L.
3. Dùng asset hiện có theo chức năng; xem ảnh trước/sau toàn cảnh và zoom; kiểm cửa/lối đi và tỷ lệ đồ.
4. Kiểm click/PC/NPC, nhóm, zoom/pan/resize và tải/mở lại sau mỗi nhóm.
5. Chỉ cập nhật bản nguồn của nhóm đã làm rồi build dist; AI Studio nghiệm thu sau khi code/decor hoàn thiện.

Lượt này mới chuẩn bị phạm vi và baseline, chưa decor lại các map/phòng.
