"""One self-contained review: same production entry, all QA fixtures and 13 Fixed."""
from pathlib import Path
import json,re
from loader import loader
r=Path(__file__).resolve().parents[1]
cases=json.loads((r/'examples/rp-review-data.json').read_text())
html=loader('../dist/',cases[0]['data'])
for file in ['templates-pack.js','bundle.js']:
 code=(r/'dist'/file).read_text();code=re.sub(r'</script',lambda m:'<\\/script',code,flags=re.I)
 html=re.sub(r'<script src="[^"]*'+re.escape(file)+r'"[^>]*></script>',lambda m:'<script>'+code+'</script>',html)
html=re.sub(r'<link rel="stylesheet"[^>]+>',lambda m:'<style>'+(r/'dist/shell.css').read_text()+'</style>',html)
fixed=json.loads((r/'assets/atlas.json').read_text())['fixed']
options=[{'id':k,'name':'Fixed · '+k} for k in fixed]
review_script='''<details id="review-controls" style="position:fixed;top:100px;left:72px;z-index:99;max-width:min(420px,75vw);background:#3b2925;color:#eadbc2;padding:8px;font:13px Georgia"><summary style="cursor:pointer">Xem mẫu · 10 hành lang + 2 Outdoor + 13 Fixed</summary><label style="display:block;margin:8px 0">Mẫu kiểm/duyệt <select id="review-scene" style="max-width:100%;margin-top:6px" aria-label="Chọn mẫu duyệt"></select></label><p style="font:12px/1.5 Georgia">Nội dung mô phỏng để kiểm hình. Chưa được duyệt thẩm mỹ; AI Studio Preview chưa thử.</p></details><script>(()=>{const cases='''+json.dumps(cases,ensure_ascii=False).replace('<','\\u003c')+''',fixed='''+json.dumps(options)+''',select=document.getElementById('review-scene');window.WZW_REVIEW_CASES=cases;for(const item of [...cases,...fixed]){const o=document.createElement('option');o.value=item.id;o.textContent=item.name;select.append(o)}select.onchange=async()=>{select.disabled=true;try{const c=cases.find(c=>c.id===select.value);await WZWMap.render(c?c.data:{meta:{areaName:select.value,date:'',time:'',quote:''},atlasAnchor:select.value,pcPlace:'',pcSpot:'outdoor',places:[],actors:[],events:[]})}finally{select.disabled=false;select.parentElement.parentElement.open=false}}})();</script>'''
html=html.replace('</html>',review_script+'</html>')
(r/'examples/p4-review.html').write_text(html)
