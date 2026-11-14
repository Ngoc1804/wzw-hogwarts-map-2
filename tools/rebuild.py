"""Rebuild all distributions from the retained source JSON and Fixed/UI HTML."""
from pathlib import Path
import subprocess,sys,json,hashlib
r=Path(__file__).resolve().parents[1]
manifest=r/'docs/DECOR_IMPORT.json'
try:
 d=json.loads(manifest.read_text());digest=lambda p:hashlib.sha256((r/p).read_bytes()).hexdigest()
 current=d['sha256']==digest('examples/WIZAMAP_LAYOUTS.html') and d['compilerSha256']==digest('tools/import-layout-sizes.cjs') and all(digest(p)==sha for p,sha in d['artifacts'].items())
except (FileNotFoundError,KeyError,ValueError):current=False
if not current:subprocess.run(['node','tools/import-layout-sizes.cjs'],cwd=r,check=True)
for tool in ['check-approved-svg.py','build.py','asset-review.py','loader.py']:
 subprocess.run([sys.executable,str(r/'tools'/tool)],cwd=r,check=True)
