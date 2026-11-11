"""Edit embedded template data without copying HTML versions. Python standard library only."""
import argparse,base64,gzip,json,re
from pathlib import Path
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('action',choices=['unpack','pack'])
parser.add_argument('json_path',type=Path)
args=parser.parse_args()
html=Path(__file__).resolve().parents[1]/'examples/template-review.html'
s=html.read_text(encoding='utf-8')
pattern=r'(<script[^>]*id="wzw-embedded-atlas"[^>]*>)(.*?)(</script>)'
m=re.search(pattern,s,re.S)
if not m:raise SystemExit('Không tìm thấy dữ liệu template')
if args.action=='unpack':
 d=json.loads(gzip.decompress(base64.b64decode(m[2])))
 args.json_path.parent.mkdir(parents=True,exist_ok=True)
 args.json_path.write_text(json.dumps(d,ensure_ascii=False,indent=2),encoding='utf-8')
else:
 d=json.loads(args.json_path.read_text(encoding='utf-8'))
 if len(d.get('maps',{}))!=13 or not isinstance(d.get('vectors'),dict):raise SystemExit('Dữ liệu phải giữ đủ 13 template và vectors')
 packed=base64.b64encode(gzip.compress(json.dumps(d,ensure_ascii=False,separators=(',',':')).encode(),compresslevel=9,mtime=0)).decode()
 html.write_text(s[:m.start(2)]+packed+s[m.end(2):],encoding='utf-8')
print('OK',args.action)
