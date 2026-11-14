"""One pipeline from canonical source JSON, never a deleted editor."""
from pathlib import Path
import subprocess,sys
root=Path(__file__).resolve().parents[1]
for name in ['atlas.py','check-approved-svg.py','build.py','asset-review.py','map_prompt.py']:
 subprocess.run([sys.executable,str(root/'tools'/name)],cwd=root,check=True)
subprocess.run(['node','tests/canonical-sources.cjs'],cwd=root,check=True)
