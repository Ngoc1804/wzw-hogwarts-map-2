# MAP_DATA 2.0.0 — contract và routing

Quyết định đã chốt: Fixed canon chỉ hiển thị vị trí nhân vật trên artwork gốc. Không xây thêm, không thêm đồ vật, không mở cơ chế chỉnh đồ hoặc detail mới. PC/place/spot bắt buộc do prompt bảo đảm; không thêm fallback đoán vị trí cho payload thiếu trường.

## Bắt buộc khi Gemini xuất /map

`schemaVersion: "2.0.0"`, `meta` (areaName, date, time, quote theo nội dung có thật), `atlasAnchor`, `pcPlace`, `pcSpot`, `places`, `actors`, `events`. Mảng rỗng hợp lệ; không bịa nội dung để điền. PC là một actor `isPC:true`; pcPlace/pcSpot cấp cảnh ưu tiên. Gemini phải xác định vị trí trước xuất, không dùng unknown. Payload thiếu vị trí không thuộc đầu vào hợp lệ; không tự đoán hoặc thêm vị trí PC.

- `atlasAnchor`: một ID Fixed, cluster Atlas, scope World hoặc `custom`; tên alias scope từ vocabulary được normalize một điểm.
- `pcPlace`: canonical ID hoặc tên rõ trong scope. `pcSpot`: inside/corridor/threshold/outdoor. Alias outside chỉ normalize thành outdoor.
- `forceSandbox: true` (optional): user yêu cầu tự dựng. `mapMode`: indoor/outdoor; template hoặc bỏ trống giữ định tuyến Fixed/Atlas. Dựng Generated Outdoor hiện cần mapMode outdoor rõ ràng.
- `layoutType` optional: horizontal/vertical/windows/ell/tee/cross/court/cloister/curved/tower. Khung Generated Indoor giữ góc nhìn source đã duyệt và tường H40; payload không đổi hệ chiếu/chiều cao khung. Số phòng theo scope RP, không khóa số phòng của viewer.
- `region` optional: diagon/knockturn, bắt buộc khi gán nhà/tiệm mới trong diagon-knockturn; cũng nhận ở từng place.

## Places

`{id?, name, type?, description?, props?, propsMode?, architecture?, isNewConstruction?, region?}`.

Tên/type mở; type công năng ngắn (office, classroom, potions, storage, shop, bedroom...) tra vocabulary; recipe ID nguồn vẫn nhận. Không yêu cầu asset ID/tọa độ. `isNewConstruction:true` trên nhà/công trình AU mới ở scope h1/h2 chuyển toàn scene đang xem sang sandbox. Nhà/tiệm mới tại làng/hẻm không dùng cờ này để bỏ template: resolver gán nhà dân trống đúng khu.

Props: chuỗi hoặc `{name,count?,zone?,item?,id?,op?,state?}`. count mặc định 1, hữu hạn/nguyên/không âm; op ensure/add, propsMode merge/replace. Đây là dữ liệu Generated. Fixed giữ nguyên artwork, không áp inventory thay thế hoặc props overlay. templateState cũ không còn khiến Fixed tự thay hình/mở detail.

Visual tối thiểu cho Generated được mô tả bên dưới; không đưa raw SVG/HTML vào payload. Không áp cơ chế này cho Fixed canon.

## Actors và nhóm

`{id?, name, isPC?, placeId?, placeName?, spot?, zone?, tagType?, footstep?, activity?, observation?, members?, summary?, onPatrol?}`.

- Tối đa **10 ribbon NPC/cá nhân/nhóm**, không tính PC. Gemini nhóm trước khi trả nếu cần; runtime giữ nguyên danh sách đầu vào và ghi diagnostic khi vượt giới hạn. Lớp hiển thị tự gộp NPC khi trên 4 người đã biết cùng phòng/cùng inside hoặc spot; PC giữ tag riêng, không tự phát sinh hoặc bỏ thành viên.
- Cá nhân: name/activity/observation; mô tả vị trí ngắn trong observation/placeName/zone.
- Nhóm do prompt cung cấp: name là nhãn nhóm, members là mảng tên; click sidebar hiện danh sách. Trên 4 người cùng phòng, presentation giữ PC riêng và gom NPC thành một tag; cả sidebar và click tag nhóm giữ đủ members/summary/hoạt động/quan sát. Nhóm đông: name + summary ngắn. Không tự phát sinh thành viên.
- spot là trạng thái vị trí, zone là gợi ý tương đối, không phải tọa độ. Placement theo zone còn ở P4.
- tagType: gryffindor/slytherin/ravenclaw/hufflepuff/beauxbatons/durmstrang/teacher/adult/patrol/animal/monster/ghost/unknown/crowd. Màu theo token; unknown là loại actor, không phải địa điểm.
- footstep walk/idle/hidden là trạng thái đầu vào. Presentation quyết định khả năng hiển thị: H1, H2, Hogsmeade (`village-static`), Hẻm Xéo (`diagon-knockturn`) và Generated Outdoor ẩn chân khi inside, giữ tag. Các map còn lại luôn có chân dưới tên, kể cả inside hoặc đầu vào hidden. Walk có chuyển động, còn lại idle; không có khoảng mất toàn bộ dấu chân. onPatrol chỉ true khi RP xác nhận.

## Events

`{id?, title, detail?, placeId?, placeName?, hidden?, target?}`. hidden true tương ứng kính lúp; còn lại tương ứng ống nhòm. Giá trị chuẩn hóa ?/! là ngữ nghĩa, không phải glyph hiển thị. target chỉ tham chiếu kiến trúc có thật; binding chi tiết còn ở P7, thiếu thì giữ cấp địa điểm.

## Routing và tham chiếu

1. forceSandbox → Generated. H1/H2 + place isNewConstruction → Generated. Không dùng artwork H1/H2 cho scene đó.
2. Anchor Fixed/pointer-only Fixed → giữ nguyên artwork, không auto-detail.
3. Atlas cluster → giữ đủ rooms của cluster, thêm nơi RP mới; không mở mọi scope từ pointer. World macro-region dùng sites: pcPlace dạng “Malfoy Manor / Drawing Room” hoặc “St Mungo’s Hospital / F4 / Spell Damage”; chọn một công trình và mức focus phù hợp, không dựng cả vùng. ID site/room do compiler sinh chỉ là khóa nội bộ, không phải atlasAnchor mới. Nếu xác định được phòng World ngoài trời, builder nhận mode outdoor; mapMode tường minh vẫn ưu tiên.
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

## Trạng thái và phạm vi

Fixed canon position-only đã chốt; không có việc mở triển khai inventory/props/structural-detail cho Fixed. Các props/state/composition bên dưới chỉ dành cho Generated. Artwork, asset và layout đã chốt giữ nguyên; decor/đổi màu làm sau. Test kỹ thuật không thay thế nghiệm thu AI Studio. Hồ sơ hash/phiên bản cập nhật ở lượt sau.

## Atlas source integration

Master nguồn là WZW_MAP2_ATLAS_GITHUB_MASTER.md; tools/atlas.py sinh index. Alias Fixed tiếng Anh chỉ trỏ anchor đã có; bảng room type đã chỉnh các nhầm lẫn hành lang/phòng tắm/văn phòng/kho. Compiler giữ đủ 348 anchor, 285 phòng cluster; registry World có công trình riêng, không gộp danh sách nhiều nhà thành một nhà. MIN tiếng Anh chỉ là Atlas; hướng dẫn MAP_DATA/ribbon/icon/loader để ở /map instruction cuối P8.

## Indoor H40 placement update

Khung H40 giữ nguyên core. Recipe w/h/minW/minH điều chỉnh frontage/depth qua overrides nguồn; size small/large chỉ là gợi ý tương đối, không prefab bắt buộc. Đồ extras đặt theo zone, tránh footprint/cửa và mặt tường chiếu; hết chỗ giữ biểu tượng tổng + số lượng/nội dung trong Inspector. Unknown giữ biểu tượng trung tính có title, không ép thành rương hoặc bàn.

Prop optional: mount floor/wall/surface và parentId (ID instance mẹ). Surface cần parent có metadata surface; không tìm được thì ghi diagnostic và giữ đại diện/Inspector, không tự chọn bàn khác. Source group không tách được đồ con vẫn là một instance; chưa khẳng định sửa đúng mọi thành phần trong cụm.

Actor optional tương thích 2.0.0: posture standing/sitting/lying/hidden; placement normal/on_furniture/in_wall; supportId nhắm đúng instance khi RP xác nhận đứng/ngồi trên vật. Không suy ngoại lệ từ NLP activity. Thiếu support thì giữ anchor thông tin; không giả đã đặt đúng trên đồ. Chân tuân theo quy tắc từng map ở phần Actors, không ẩn tự động vì inside trên map chi tiết. Điểm actor dùng phần sàn trong địa điểm, tránh tường và nội thất lớn theo metadata/bounds hiện có; không loại vùng sàn chỉ vì có đồ nhỏ hoặc decor. Ngoại lệ lên đồ/trong tường chỉ theo yêu cầu RP tường minh; không tự đổi địa điểm. Điểm Generated dùng footprint ước lượng. Nếu Fixed macro không có mặt bằng nội thất, tag giữ anchor thông tin của công trình, không dựng nội thất mới. Tên, icon và chân dùng chung điểm neo và tỉ lệ zoom; ribbon không tự dịch riêng khỏi nhân vật. Không tự kích hoạt X-Ray. Actor chưa binding vẫn giữ trong Inspector.

## Loader / validation update

Malformed JSON is a transport error: no normalize/build/scene is produced. Corrected object input may recover using `WZWMap.render`. Render calls are serialized. Missing PC actor/location, multiple PCs, and unsupported explicit versions produce `invalid-data` without a scene. Legacy omitted schemaVersion is diagnosed; new payloads must send 2.0.0. Unresolved Fixed locations remain information in Inspector; they never allocate invented buildings. Canonical PC/NPC/event references reserve AU house slots before allocation.

Outdoor uses the same mapMode/places/type/props contract. All eight OUT_* recipes are available in runtime; `propsMode: replace` removes recipe inventory while terrain remains. Hai HTML kiểm cũ đã xóa; test dùng dữ liệu trong bộ nhớ, không sinh lại các trang đó. Current multi-zone composition is illustrative tiles without inferred connecting routes; advanced placement/state/count and visual acceptance remain open.

## Props / visual / X-Ray update

Generated props: add accepts a new stable id, repeated add id is diagnosed; replace permits new ids. ensure count is a total across matched records, not a record count. Child edits use parentId (inventory instance) + childId (exact data-prop/data-piece token), plus name/count/state. Unknown or ambiguous child is diagnosed and left untouched. Removal targets only that child. Unavailable child metadata is not guessed. High child counts retain Inspector summary; bounded illustration is not a claim of drawing every instance.

Optional visual: {shapes:[{kind:"rect",x:10,y:10,width:70,height:50,material:"wood"}]} on a named prop. Coordinate space 0..100, up to 32 shapes; rect/ellipse/path only, finite bounded numbers and restricted path characters. Materials: wood/stone/metal/fabric/paper/glass/plant/ink. No raw SVG/HTML/scripts/URLs accepted. Invalid visual uses normal fallback. Typical payloads need no visual.

X-Ray now tests anchored actor region independently of label shifts; requires building occluder, layer/depth ordering and alpha shape overlap. Own inside building does not fade. Explicit depth is preferred; missing depth derives approximate ground contact from opaque silhouette, not bbox alone. Unknown/unrenderable masks never conclude occlusion. X-Ray kiểm theo shape/layer/depth và tương tác; không suy ra nghiệm thu AI Studio từ unit PASS.

### Four audit corrections

Omitted/invalid count on state-only updates preserves existing total; explicit valid count is applied. Outdoor map grows to contain extras and multi-zone rows. Extreme counts retain complete inventory plus a counted summary after 2000 individually drawn extras per zone. Outdoor buildings now participate in layer/depth/shape occlusion. Visuals require valid complete SVG path commands and a visible filled/stroked shape in the 100×100 viewport; otherwise the named RP object falls back.

### X-Ray interaction correction

X-Ray requires user interaction: hover the occluding building or actor ribbon for a temporary preview; click/tap either to pin/unpin. Leaving hover restores unless pinned; background click or Escape clears. Touch pointer hover is ignored. Occlusion shape/layer/depth checks still apply; no automatic fade when merely overlapping. Actor/scene cleanup clears interaction state.

### Child quantities and group detail

Child edits are reconciled by childId into a final state before rendering. ensure count sets a total, add increments it, state-only preserves it, removed/missing/destroyed or count 0 removes it. Very large counts use up to 32 shared SVG use instances plus explicit count/remainder information. No duplicate member ribbons are created: clicking the single group ribbon opens members AND summary in the sidebar. Fixed places with source x/y but no artwork data-id receive invisible presentation anchors using those exact coordinates; RP merge cannot replace Fixed x/y.

## S/M/L integration — current implementation

Generated Indoor now reads the reviewed per-layout `sizeProfiles` from recipes. `places[].size` accepts `S`, `M`, `L`; existing `small`, `medium`, `large` inputs remain accepted. Omitted/unknown size retains M. This replaces the old 0.8/1/1.3 runtime multipliers. Size-specific furniture arrangements are compiled from the reviewed source, with existing recipe instance IDs retained. Standalone rooms retain exact profile width/height and H40; multi-room topology continues to adapt frontage/depth through the existing corridor geometry core. Fixed artwork and dimensions remain unchanged; Outdoor sizing is not changed in this Indoor integration.

The GitHub–Gemini comparison is pending approval in [MAP_DATA_GITHUB_GEMINI_REVIEW.md](MAP_DATA_GITHUB_GEMINI_REVIEW.md). It is not an already-approved replacement system prompt.

## Reflow cửa/hành lang và thay đổi viewport

Nhiều nhân vật ở cửa/hành lang được đặt tách nhau trong vùng sàn kết nối hợp lệ của hành lang hoặc vùng lân cận cửa; tránh tường kín, cửa sổ và nội thất lớn. Không đưa người ở hành lang vào phòng khác. Cửa đi là khoảng mở hợp lệ, cửa sổ không phải lối đứng/đi qua tường. Với một nhân vật, ưu tiên vị trí cửa/hành lang đã xác định nếu vẫn hợp lệ.

Khi viewport/drawer đổi kích thước, presentation tính lại vị trí và tỉ lệ tag/chân cùng nhau trong đúng địa điểm. Zoom/pan đơn thuần giữ nguyên các điểm neo đã chọn. Nhân vật ngoài trời cũng có thể tách nhau trên phần nền được map đánh dấu hợp lệ, tránh vùng nước/công trình theo metadata hiện có. Không thêm công trình, nội thất hay màu mới.
