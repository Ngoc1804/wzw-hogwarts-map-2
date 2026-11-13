"""Package the existing review loader with the same runtime; no alternate renderer."""
from pathlib import Path
import re
r=Path(__file__).resolve().parents[1]
p=r/'examples/mechanism-review.html';s=p.read_text()
# Works on the original loader or on an already embedded review.
s=re.sub(r'<style id="offline-css">.*?</style>','',s,flags=re.S)
s=re.sub(r'<script id="offline-(?:pack|bundle)">.*?</script>','',s,flags=re.S)
s=re.sub(r'<link rel="stylesheet"[^>]*>','',s)
s=re.sub(r'<script src="[^\"]*dist/(?:templates-pack|bundle)\.js"[^>]*></script>','',s)
css=(r/'dist/shell.css').read_text();pack=(r/'dist/templates-pack.js').read_text();bundle=(r/'dist/bundle.js').read_text()
s+='<style id="offline-css">'+css+'</style>'
for id,code in [('pack',pack),('bundle',bundle)]:s+='<script id="offline-'+id+'">'+code.replace('</script','<\\/script')+'</script>'
p.write_text(s)
print('Self-contained review bytes',len(s.encode()))
