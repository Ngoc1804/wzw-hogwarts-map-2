# Generated Outdoor — đặt đồ và nhân vật

Áp dụng cho 8 recipe Outdoor và cảnh custom Outdoor, không thay artwork/địa điểm H1 hoặc các Fixed. Đã rà các nhánh remote trong OUTDOOR_PLACEMENT_QA.json; không nhập renderer/hình cũ từ nhánh ATLAS_CAN_DUYET.

- Đồ bổ sung đặt ngay trong nền theo zone, kích thước asset và chỗ còn trống; không còn dải inventory dưới cảnh. Nhân vật cũng xét zone và chỗ đứng trong đúng địa điểm.
- Tránh footprint vật cản/công trình, tường/hàng rào, mặt hồ và bồn cảnh quan. Mặt cầu/bến được gắn rõ là vùng đi được trên nước. Không có xử lý riêng cho thân/tán cây hoặc lớp cây phía trước.
- Metadata `data-outdoor-ground` và `data-outdoor-walkable` nằm trong nguồn sceneSvg của 8 recipe. Màu decor thay đổi không làm mất vùng tránh.
- Props `mount: surface` + `parentId` đặt trên mặt đỡ đã xác định. Actor `placement: on_furniture` + `supportId` dùng vật cụ thể; `placement: on_landscape` + `supportId` là ngoại lệ RP tường minh cho cảnh quan; `in_wall` + supportId nhắm đúng tường. Không suy ngoại lệ từ activity.
- Support dùng ID instance đã có hoặc ID terrain trong geometry của địa điểm (ví dụ `terrain:water:0`, `terrain:wall:0`). Không tìm được support thì giữ nội dung/nhãn thông tin và diagnostic; không giả đã đặt đúng lên đối tượng đó.
- RP xác định ở trong nhà: nhãn bám đúng công trình dưới dạng anchor thông tin của bản ngoại cảnh; không suy ra mặt bằng nội thất.
- Hết chỗ hoặc số lượng lớn: giữ tổng số trong inventory/Inspector và biểu tượng tổng, không dựng thêm nhà hay nới cảnh thành dải đồ.

Kiểm: `node tests/outdoor-placement.cjs`. Báo cáo: OUTDOOR_PLACEMENT_QA.json. Nghiệm thu AI Studio để sau theo yêu cầu người dùng.
