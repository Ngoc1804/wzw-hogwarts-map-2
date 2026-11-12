"""Generate one self-contained P4 review from the same runtime/contract."""
from pathlib import Path
import json,re
from loader import loader
r=Path(__file__).resolve().parents[1];html=loader('../dist/',json.loads((r/'examples/p4-data.json').read_text()))
for file in ['templates-pack.js','bundle.js']:
 code=(r/'dist'/file).read_text();code=re.sub(r'</script',lambda m:'<\\/script',code,flags=re.I)
 html=re.sub(r'<script src="[^"]*'+re.escape(file)+r'"[^>]*></script>',lambda m:'<script>'+code+'</script>',html)
html=re.sub(r'<link rel="stylesheet"[^>]+>',lambda m:'<style>'+(r/'dist/shell.css').read_text()+'</style>',html)
# Review-only selector: same WZWMap entry, no extra renderer or runtime toolbar.
fixed=json.loads((r/'assets/atlas.json').read_text())['fixed']
options=[{'id':k,'name':k} for k in fixed]
review_script='''<details style="position:fixed;top:100px;left:72px;z-index:99;background:#3b2925;color:#eadbc2;padding:8px;font:13px Georgia"><summary>Xem mẫu · P4 + 13 Fixed</summary><select id="review-scene" aria-label="Chọn mẫu duyệt"></select></details><script>(()=>{const items='''+json.dumps(options)+''',original=JSON.parse(document.getElementById('map-data').textContent),select=document.getElementById('review-scene');for(const item of [{id:'p4',name:'P4 — Horizontal'},...items]){const o=document.createElement('option');o.value=item.id;o.textContent=item.name;select.append(o)}select.onchange=async()=>{select.disabled=true;try{await WZWMap.render(select.value==='p4'?original:{meta:{areaName:select.value,date:'',time:'',quote:''},atlasAnchor:select.value,pcPlace:'',pcSpot:'outdoor',places:[],actors:[],events:[]})}finally{select.disabled=false;select.parentElement.open=false}}})();</script>'''
html=html.replace('</html>',review_script+'</html>')
(r/'examples/p4-review.html').write_text(html)
