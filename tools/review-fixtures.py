"""Explicit fictional QA input. Never imported by production tools/build.py."""
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
layouts=['horizontal','vertical','windows','ell','tee','cross','court','cloister','curved','tower']
names=['Trục ngang — lớp thực hành','Trục dọc — khu giáo vụ','Cửa sổ — cánh nhìn ra vườn','Chữ L — buổi kiểm kê','Chữ T — trước tiết học','Ngã tư — giờ đổi lớp','Sân chữ U — nhóm thực địa','Bao sân — đoàn tham quan','Cánh cong — khu nghiên cứu','Chân tháp — cuộc hẹn']
types=['potions','office','storage','classroom']
labels=['Phòng Độc dược','Văn phòng','Kho đồ','Lớp học']
cases=[]
for index,(layout,title) in enumerate(zip(layouts,names)):
 count=8 if layout=='cloister' else 6 if layout in ['cross','court'] else 4
 places=[]
 for j in range(count):
  name=labels[j%4]+(' phụ' if j>=4 else '')
  p={'name':name,'type':types[j%4],'description':['Các bàn thực hành có vạc, chai thủy tinh và ghế; lối vào để trống.','Bàn làm việc có hồ sơ; kệ sách đặt sát phía bắc.','Rương và thùng đã được kiểm kê; một khoảng trống dành cho người ra vào.','Sách và lọ mực trên bàn học; bảng ở đầu lớp.'][j%4]}
  if j==0:p['overhear']='Tiếng thủy tinh chạm nhẹ và lời nhắc giữ bàn sạch.';p['props']=[{'name':'Hộp mẫu lạ có khóa đồng','count':1}]
  if layout=='ell' and j==2:p['propsMode']='replace';p['props']=[];p['description']='Kho đã được dọn trống theo dữ kiện mô phỏng; kiến trúc vẫn nguyên.'
  if layout=='tee' and j==0:p['props']+=[{'name':'Vạc thuốc','count':6}]
  if layout=='cross' and j==1:p['props']=[{'id':'OFFICE:13','name':'Lò sưởi đã tắt','state':'broken','count':1}];p['templateState']='modified_props'
  if layout=='tower' and j==count-1:p['name']='Phòng học chân tháp';p['description']='Gian tròn chân tháp, đồ học tập đặt trong phần sàn hữu dụng.'
  places.append(p)
 spot=['inside','corridor','threshold','inside','corridor','threshold','outdoor','inside','corridor','threshold'][index]
 pc=places[1]['name']
 payload={'meta':{'date':'Ngày kiểm mô phỏng','time':'09:30','areaName':title,'quote':'DỮ LIỆU KIỂM THỬ MÔ PHỎNG — chờ duyệt hình, không phải diễn biến RP thật.'},'atlasAnchor':'custom','mapMode':'indoor','layoutType':layout,'pcPlace':pc,'pcSpot':spot,'places':places,
 'actors':[{'name':'An — PC mẫu','isPC':True,'placeName':pc,'tagType':'slytherin','footstep':'idle' if spot!='inside' else 'hidden','activity':'Đang đối chiếu ghi chú tại vị trí đã khai báo.','observation':'Mang sổ kiểm kê bìa nâu.'},
 {'name':'Cô Mai — mẫu','placeName':places[0]['name'],'spot':'inside','tagType':'teacher','footstep':'hidden','activity':'Đang hướng dẫn cách giữ bàn thực hành sạch.','observation':'Đứng cạnh bàn có các chai thủy tinh.'},
 {'name':'Bình — mẫu','placeName':places[2]['name'],'spot':'corridor','tagType':'ravenclaw','footstep':'walk','activity':'Đang đi ở hành lang phía ngoài kho.','observation':'Cầm một tờ danh mục.'},
 {'name':'Lan — mẫu','placeName':places[-1]['name'],'spot':'inside','tagType':'gryffindor','footstep':'hidden','activity':'Đang đọc trang sách được mở sẵn.','observation':'Có túi vải đặt cạnh ghế.'}],
 'events':[{'title':'Nhãn hộp mẫu','placeName':places[0]['name'],'detail':'Nhân vật đã nhìn thấy nhãn giấy trên hộp có khóa đồng; nội dung chỉ là dữ liệu mô phỏng.'},
 {'title':'Dấu phấn ở cửa','placeName':pc,'hidden':True,'target':{'kind':'door'},'detail':'Có một dấu phấn đã được nhận biết cạnh cửa; không ngụ ý bí mật ngoài payload.'}]}
 if layout=='cloister':
  payload['actors'] += [{'name':'Khách mẫu '+str(k+1),'placeName':places[3]['name'],'spot':'inside','tagType':['hufflepuff','beauxbatons','adult'][k%3],'footstep':'hidden','activity':'Đang nghe phần hướng dẫn mô phỏng.','observation':'Đã được PC nhận biết trong cùng phòng.'} for k in range(6)]
 cases.append({'id':layout,'name':title,'data':payload})
for id,title,places,pc in [
 ('outdoor-yard','Ngoài trời — sân và nhà kho',[{'name':'Sân luyện tập','type':'yard','description':'Sân đất mở, có lối đi giữa các cụm cây.','props':['Cọc đánh dấu bằng gỗ']},{'name':'Nhà kho sân','type':'storage','description':'Công trình nhỏ bên sân; nội thất không chồng lên mái.','props':['Bảng kiểm kê treo ngoài cửa']}],'Sân luyện tập'),
 ('outdoor-lake','Ngoài trời — bờ hồ và tháp',[{'name':'Bờ cỏ phía đông','type':'garden','description':'Khoảng cỏ khô để đứng quan sát bờ nước.','props':['Giỏ dụng cụ lấy mẫu']},{'name':'Hồ thử nghiệm','type':'lake','description':'Mặt nước được chỉ định rõ, không phải vùng đứng.'},{'name':'Tháp quan sát','type':'tower','description':'Tháp nằm trên nền khô; người bên trong được gắn nhãn, không hiện chân trên mái.'}],'Bờ cỏ phía đông')]:
 data={'meta':{'date':'Ngày kiểm mô phỏng','time':'15:10','areaName':title,'quote':'DỮ LIỆU KIỂM THỬ MÔ PHỎNG — kiểm nền ngoài trời, mái và nước.'},'atlasAnchor':'custom','mapMode':'outdoor','pcPlace':pc,'pcSpot':'outdoor','places':places,'actors':[{'name':'An — PC mẫu','isPC':True,'placeName':pc,'tagType':'slytherin','footstep':'idle','activity':'Đang ghi nhận cảnh quan đã thấy.','observation':'Đứng trên nền khô.'},{'name':'Người trông coi — mẫu','placeName':places[-1]['name'],'spot':'inside','tagType':'adult','footstep':'hidden','activity':'Đang kiểm giấy tờ trong công trình.','observation':'Đã được PC biết vị trí qua dữ kiện kiểm.'}], 'events':[{'title':'Ghi chú hiện trường','placeName':pc,'detail':'Tờ ghi chú này chỉ thuộc cảnh mô phỏng và đã được nhân vật nhìn thấy.'}]}
 cases.append({'id':id,'name':title,'data':data})
town={'meta':{'areaName':'Cụm nhà — asset nguồn','date':'Ngày kiểm mô phỏng','time':'16:00','quote':'MẪU OUTDOOR ĐỂ DUYỆT — dùng asset nhà/cây/đá đã cấp.'},'atlasAnchor':'custom','mapMode':'outdoor','pcPlace':'Cottage ven bãi','pcSpot':'outdoor','places':[{'name':'Cottage ven bãi','type':'cottage','description':'Nhà đá cạnh bãi cỏ, có cây và đá cảnh quan.'},{'name':'Tiệm dụng cụ','type':'shop','description':'Cửa hàng nhỏ dùng artwork nguồn.'},{'name':'Quán trọ','type':'inn','description':'Quán trọ bên khoảng đất mở.'},{'name':'Kho dụng cụ','type':'storage','description':'Nhà kho gỗ ở rìa khu đất.'}],'actors':[{'name':'An — PC mẫu','isPC':True,'placeName':'Cottage ven bãi','tagType':'slytherin','footstep':'idle','activity':'Đang đứng trước nhà.','observation':'Nhìn thấy bốn công trình trong phạm vi mô phỏng.'}],'events':[{'title':'Bảng thông báo','placeName':'Tiệm dụng cụ','detail':'Đầu mối đã được PC nhìn thấy trong cảnh mô phỏng.'}]}
cases.append({'id':'outdoor-hamlet','name':'Cụm nhà — asset nguồn','data':town})
(root/'examples/rp-review-data.json').write_text(json.dumps(cases,ensure_ascii=False,indent=2))
