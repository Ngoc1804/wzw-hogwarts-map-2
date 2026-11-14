# Map 2 — 53 địa điểm và thiết kế bảng hiệu

Đã gộp và triển khai trực tiếp trên `M2-P01-baseline-loader` trong `Ngoc1804/wzw-hogwarts-map-2`. Nguồn Fixed: `examples/WIZAMAP_FIXED_UI.html`.

- 29 địa điểm có sẵn đã thống nhất tên Việt theo danh sách.
- 23 địa điểm bổ sung dùng nhà dân trống cùng khu: 8 Hẻm Xéo, 13 Knockturn, 2 nhà riêng Hogsmeade.
- Mục ga Hogsmeade giữ `v-station` là đường tới ga; không vẽ thêm nhà ga lên map làng.
- 52 công trình có bảng tên; dùng màu mực, gỗ, đồng dịu và biểu tượng theo công năng (sách, độc dược, kẹo, áo chùng, vạc, thư, quán rượu, nến, tơ nhện, quan tài, rắn…).
- Giữ nguyên ID, vị trí, khung/mái nhà và 11 map khác; không sửa shared definitions.
- Còn 7 nhà dân Hẻm Xéo, 3 Knockturn và 20 Hogsmeade cho RP/AU.

Vị trí gán mới là bố trí minh hoạ WIZAMAP, không phải địa chỉ canon được xác minh. Những tên dịch đề xuất trong danh sách vẫn giữ tên tiếng Anh để đối chiếu. Hai chi nhánh Mulpepper trùng tên được phân biệt theo khu khi tra cứu.

| Khu | Tên gốc | Tên Việt | ID | Bố trí |
|---|---|---|---|---|
| Hẻm Xéo | The Leaky Cauldron | Quán Cái Vạc Lủng | `da-leaky` | Có sẵn |
| Hẻm Xéo | Gringotts Wizarding Bank | Ngân hàng Phù thủy Gringotts | `da-gringotts` | Có sẵn |
| Hẻm Xéo | Ollivanders | Tiệm Đũa phép Ollivander | `da-ollivanders` | Có sẵn |
| Hẻm Xéo | Flourish and Blotts | Tiệm sách Phú Quý và Cơ Hàn | `da-flourish` | Có sẵn |
| Hẻm Xéo | Madam Malkin's Robes for All Occasions | Tiệm Áo chùng Phu nhân Malkin | `da-malkin` | Có sẵn |
| Hẻm Xéo | Eeylops Owl Emporium | Sở cú Eeylops | `da-eeylops` | Có sẵn |
| Hẻm Xéo | Quality Quidditch Supplies | Tiệm Dụng cụ Quidditch Chất lượng | `da-quidditch` | Có sẵn |
| Hẻm Xéo | Magical Menagerie | Tiệm Thú kiểng Pháp thuật | `da-menagerie` | Có sẵn |
| Hẻm Xéo | Florean Fortescue's Ice Cream Parlour | Tiệm kem Florean Fortescue | `da-fortescue` | Có sẵn |
| Hẻm Xéo | Gambol and Japes Wizarding Joke Shop | Tiệm Giỡn Gambol và Japes | `da-gambol` | Có sẵn |
| Hẻm Xéo | Weasleys' Wizard Wheezes | Tiệm Giỡn Phù thủy nhà Weasley | `da-weasleys` | Có sẵn |
| Hẻm Xéo | Twilfitt and Tatting's | Tiệm May mặc Twilfitt và Tatting | `da-twilfitt` | Có sẵn |
| Hẻm Xéo | Apothecary / Slug & Jiggers | Tiệm Độc dược Slug và Jiggers | `da-apothecary` | Có sẵn |
| Hẻm Xéo | Second-Hand Robes Shop | Tiệm Áo chùng Cũ | `da-robe-used` | Có sẵn |
| Hẻm Xéo | Junk Shop | Tiệm Đồ cũ | `da-goods` | Có sẵn |
| Hẻm Xéo | Scribbulus Writing Implements | Tiệm Bút mực Scribbulus | `da-scribbulus` | Có sẵn |
| Hẻm Xéo | Potage's Cauldron Shop | Tiệm Vạc Potage | `da-potage` | Có sẵn |
| Hẻm Xéo | Wiseacre's Wizarding Equipment | Tiệm Pháp cụ Wiseacre | `da-terrace-7` | Nhà trống được gán mới |
| Hẻm Xéo | Mr Mulpepper's Apothecary | Tiệm Độc dược ông Mulpepper | `da-terrace-11` | Nhà trống được gán mới |
| Hẻm Xéo | Sugarplum's Sweets Shop | Tiệm Kẹo Mận Đường | `da-terrace-13` | Nhà trống được gán mới |
| Hẻm Xéo | Brews & Stews | Quán Trọ Nồi Hầm và Rượu Ủ | `da-terrace-17` | Nhà trống được gán mới |
| Hẻm Xéo | Madam Primpernelle's Beautifying Potions | Tiệm Mỹ dược bà Primpernelle | `da-terrace-20` | Nhà trống được gán mới |
| Hẻm Xéo | Obscurus Books | Nhà xuất bản Obscurus | `da-obscurus` | Có sẵn |
| Hẻm Xéo | WhizzHard Books | Nhà xuất bản WhizzHard | `da-terrace-8` | Nhà trống được gán mới |
| Hẻm Xéo | Terrortours | Hãng Du lịch Kinh Hoàng | `da-terrace-9` | Nhà trống được gán mới |
| Hẻm Xéo | Daily Prophet Offices | Tòa soạn Nhật báo Tiên tri | `da-terrace-10` | Nhà trống được gán mới |
| Knockturn | Borgin and Burkes | Tiệm Borgin và Burkes | `ka-borgin` | Có sẵn |
| Knockturn | Unnamed Shrunken Heads Shop | Tiệm Đầu người Teo quắt | `ka-block-0` | Nhà trống được gán mới |
| Knockturn | Unnamed Poisonous Candles Shop | Tiệm Nến Độc | `ka-block-1` | Nhà trống được gán mới |
| Knockturn | Unnamed Dark Creatures Shop | Tiệm Sinh vật Hắc ám | `ka-block-2` | Nhà trống được gán mới |
| Knockturn | Cobb & Webb's | Tiệm Tơ Nhện Cobb & Webb | `ka-block-3` | Nhà trống được gán mới |
| Knockturn | Ye Olde Curiosity Shop | Tiệm Cổ vật Kỳ Bí | `ka-block-4` | Nhà trống được gán mới |
| Knockturn | Moribund's | Tiệm Moribund | `ka-block-5` | Nhà trống được gán mới |
| Knockturn | The Coffin House | Nhà Quan Tài | `ka-block-6` | Nhà trống được gán mới |
| Knockturn | Mr Mulpepper's Apothecary | Tiệm Độc dược ông Mulpepper | `ka-block-7` | Nhà trống được gán mới |
| Knockturn | The White Wyvern | Quán Rồng Trắng | `ka-block-8` | Nhà trống được gán mới |
| Knockturn | Noggin and Bonce | Tiệm Đầu Lâu Noggin và Bonce | `ka-block-9` | Nhà trống được gán mới |
| Knockturn | Shyverwretch's Venoms and Poisons | Tiệm Nọc độc Shyverwretch | `ka-block-10` | Nhà trống được gán mới |
| Knockturn | The Spiny Serpent | Tiệm Rắn Gai | `ka-block-11` | Nhà trống được gán mới |
| Knockturn | The Starry Prophesier | Nhà Tiên Tri Tinh Tú | `ka-block-12` | Nhà trống được gán mới |
| Hogsmeade | The Three Broomsticks | Quán Ba Cây Chổi Thần | `v-broomsticks` | Có sẵn |
| Hogsmeade | The Hog's Head | Quán Đầu Heo | `v-hogshead` | Có sẵn |
| Hogsmeade | Honeydukes Sweetshop | Tiệm Kẹo Công tước Mật | `v-honeydukes` | Có sẵn |
| Hogsmeade | Zonko's Joke Shop | Tiệm Giỡn Zonko | `v-zonkos` | Có sẵn |
| Hogsmeade | Dervish and Banges | Tiệm Dervish và Banges | `v-dervish` | Có sẵn |
| Hogsmeade | Gladrags Wizardwear | Tiệm Giẻ Vui | `v-gladrags` | Có sẵn |
| Hogsmeade | Scrivenshaft's Quill Shop | Tiệm Viết lông ngỗng Scrivenshaft | `v-quills` | Có sẵn |
| Hogsmeade | Madam Puddifoot's Tea Shop | Quán trà bà Puddifoot | `v-puddifoot` | Có sẵn |
| Hogsmeade | Hogsmeade Post Office | Bưu điện Hogsmeade | `v-post` | Có sẵn |
| Hogsmeade | The Shrieking Shack | Lều Hét | `v-shack` | Có sẵn |
| Hogsmeade | Hogsmeade Railway Station | Ga Hogsmeade | `v-station` | Đường dẫn ngoài map |
| Hogsmeade | McGonagall–Urquart Cottage | Nhà McGonagall và Urquart | `v-home-0` | Nhà trống được gán mới |
| Hogsmeade | Silvanus Kettleburn's House | Nhà giáo sư Kettleburn | `v-home-1` | Nhà trống được gán mới |

Kiểm thử và hash nguồn nằm trong `SHOP_NAME_AUDIT.json`. Chạy hồi quy: `node tests/shop-bindings.cjs`, `node tests/routing-current.cjs`, `node tests/presentation.cjs`, `node tests/actor-placement.cjs`, `python tools/check-id-links.py`.
