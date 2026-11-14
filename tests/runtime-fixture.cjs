// In-memory test harness: no fourth HTML viewer or CDN required.
const fs=require('node:fs');
const input=()=>({schemaVersion:'2.0.0',meta:{areaName:'Kiểm runtime',date:'',time:'',quote:''},atlasAnchor:'custom',mapMode:'indoor',layoutType:'horizontal',pcPlace:'r1',pcSpot:'inside',places:[{id:'r1',name:'Phòng Độc dược',type:'POTIONS_LAB'},{id:'r2',name:'Văn phòng',type:'OFFICE'},{id:'r3',name:'Kho',type:'STORAGE'},{id:'r4',name:'Lớp học',type:'CLASSROOM'}],actors:[{name:'PC',isPC:true,placeId:'r1',spot:'inside'}],events:[]});
module.exports=(data=input())=>{
 const css=fs.readFileSync('dist/shell.css','utf8').replace(/<\/style/gi,'<\\/style');
 const js=['templates-pack','bundle'].map(s=>'<script>'+fs.readFileSync('dist/'+s+'.js','utf8').replace(/<\/script/gi,'<\\/script')+'</script>').join('');
 const body=JSON.stringify(data).replace(/</g,'\\u003c');
 return '<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>'+css+'</style></head><body><div id="wzw-map"></div><script id="map-data" type="application/json">'+body+'</script>'+js+'</body></html>';
};
module.exports.input=input;
