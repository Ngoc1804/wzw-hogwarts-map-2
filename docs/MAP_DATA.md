# MAP_DATA 2.0.0 — contract và routing

Cập nhật cho cơ chế README mới. Đây là contract code hiện nhận; chưa phải prompt cuối/P8 hoặc chứng nhận test/Preview. Contract 2.0.0 thay cách xử lý Fixed structural/detail cũ. Payload cũ thiếu version vẫn normalize ở cùng entry với diagnostic, không có adapter/renderer thứ hai; schemaVersion không được hỗ trợ được ghi diagnostic, không tự xác nhận tương thích.

## Bắt buộc khi Gemini xuất /map

`schemaVersion: "2.0.0"`, `meta` (areaName, date, time, quote theo nội dung có thật), `atlasAnchor`, `pcPlace`, `pcSpot`, `places`, `actors`, `events`. Mảng rỗng hợp lệ; không bịa nội dung để điền. PC là một actor `isPC:true`; pcPlace/pcSpot cấp cảnh ưu tiên. Gemini phải xác định vị trí trước xuất, không dùng unknown. Runtime thiếu trường vẫn xử lý bảo thủ và diagnostic, không tự đoán vị trí.

- `atlasAnchor`: một ID Fixed, cluster Atlas, scope World hoặc `custom`; tên alias scope từ vocabulary được normalize một điểm.
- `pcPlace`: canonical ID hoặc tên rõ trong scope. `pcSpot`: inside/corridor/threshold/outdoor. Alias outside chỉ normalize thành outdoor.
- `forceSandbox: true` (optional): user yêu cầu tự dựng. `mapMode`: indoor/outdoor; template hoặc bỏ trống giữ định tuyến Fixed/Atlas. Dựng Generated Outdoor hiện cần mapMode outdoor rõ ràng.
- `layoutType` optional: horizontal/vertical/windows/ell/tee/cross/court/cloister/curved/tower. Khung Generated Indoor giữ góc nhìn nguồn, không đổi bằng payload.
- `region` optional: diagon/knockturn, bắt buộc khi gán nhà/tiệm mới trong diagon-knockturn; cũng nhận ở từng place.

## Places

`{id?, name, type?, description?, props?, propsMode?, architecture?, isNewConstruction?, region?}`.

Tên/type mở; type công năng ngắn (office, classroom, potions, storage, shop, bedroom...) tra vocabulary; recipe ID nguồn vẫn nhận. Không yêu cầu asset ID/tọa độ. `isNewConstruction:true` trên nhà/công trình AU mới ở scope h1/h2 chuyển toàn scene đang xem sang sandbox. Nhà/tiệm mới tại làng/hẻm không dùng cờ này để bỏ template: resolver gán nhà dân trống đúng khu.

Props: chuỗi hoặc `{name,count?,zone?,item?,id?,op?,state?}`. count mặc định 1, hữu hạn/nguyên/không âm; op ensure/add, propsMode merge/replace. Đây là dữ liệu Generated. Fixed giữ nguyên artwork, không áp inventory thay thế hoặc props overlay. templateState cũ không còn khiến Fixed tự thay hình/mở detail.

Visual mới tối thiểu, palette, placement, semantic merge đầy đủ thuộc task sau; **chưa có visual compiler**, không đưa raw SVG/visual vào prompt dùng thật tại mốc này.

## Actors và nhóm

`{id?, name, isPC?, placeId?, placeName?, spot?, zone?, tagType?, footstep?, activity?, observation?, members?, summary?, onPatrol?}`.

- Tối đa **10 ribbon NPC/cá nhân/nhóm**, không tính PC. Gemini nhóm trước khi trả, runtime ghi diagnostic nếu vượt nhưng giữ nội dung, không tự cắt hoặc gom người.
- Cá nhân: name/activity/observation; mô tả vị trí ngắn trong observation/placeName/zone.
- Nhóm 3–5: name là nhãn nhóm, members là mảng tên; click sidebar hiện danh sách. Nhóm đông: name + summary ngắn. Không tự phát sinh thành viên.
- spot là trạng thái vị trí, zone là gợi ý tương đối, không phải tọa độ. Placement theo zone còn ở P4.
- tagType: gryffindor/slytherin/ravenclaw/hufflepuff/beauxbatons/durmstrang/teacher/adult/patrol/animal/monster/ghost/unknown/crowd. Màu theo token; unknown là loại actor, không phải địa điểm.
- footstep walk/idle/hidden; mặc định hidden. onPatrol chỉ true khi RP xác nhận, không suy từ chức danh. Inside ẩn chân; ngoại lệ placement RP hoàn thiện ở P4.

## Events

`{id?, title, detail?, placeId?, placeName?, hidden?, target?}`. hidden true → icon `?`; còn lại → `!`. Icon là dữ liệu chuẩn hóa, giao diện cuối chờ P4/user duyệt. target chỉ tham chiếu kiến trúc có thật; binding chi tiết còn ở P7, thiếu thì giữ cấp địa điểm.

## Routing và tham chiếu

1. forceSandbox → Generated. H1/H2 + place isNewConstruction → Generated. Không dùng artwork H1/H2 cho scene đó.
2. Anchor Fixed/pointer-only Fixed → giữ nguyên artwork, không auto-detail.
3. Atlas cluster → giữ đủ rooms của cluster, thêm nơi RP mới; không mở mọi scope từ pointer.
4. custom/World → Generated trong scope RP.

ID hợp lệ ưu tiên tên; ID hỏng có thể tìm theo tên duy nhất và diagnostic. Binding AU giữ alias tên/ID input tới canonical house ID. Nhà dân được chọn ổn định theo danh sách input sắp thứ tự, không phụ thuộc thứ tự khai báo; không phải bộ nhớ RP lâu dài. Các nhà được places gọi rõ được giữ trước, không ghi đè nhà canon; không gán hai nơi vào cùng nhà. Không tìm thấy nhà/khu thì giữ unresolved + diagnostic, không tự mở detail hoặc ghi đè nhà khác.

Các vị trí không binding được giữ trong dữ liệu/Inspector, không đặt giả lên map. Actor/event chỉ có ID sai không được biến thành phòng mới mang tên ID. Không sửa Atlas từ RP.

## Ví dụ payload ngắn

```json
{
  "schemaVersion":"2.0.0",
  "meta":{"areaName":"Hogsmeade","date":"","time":"","quote":""},
  "atlasAnchor":"village-static",
  "pcPlace":"Tiệm AU của PC",
  "pcSpot":"inside",
  "places":[{"name":"Tiệm AU của PC","type":"shop"}],
  "actors":[{"name":"PC","isPC":true,"placeName":"Tiệm AU của PC","spot":"inside","footstep":"hidden"}],
  "events":[]
}
```

## Trạng thái

Đã sửa normalize/resolver và nối sidebar members/summary. Chưa chạy test tổng/browser theo yêu cầu hoàn thiện cơ chế trước. P4/P5 placement/merge, visual mới, P7 icon/X-Ray và P8 prompt/SHA vẫn mở. Không dùng báo cáo test cũ để chứng nhận version này. Khi kiểm cuối cần ma trận Fixed bất biến, H1/H2 AU, binding nhà/region/overflow/order, đủ cluster, tham chiếu lỗi/mơ hồ, nhóm/10 ribbon và target.
