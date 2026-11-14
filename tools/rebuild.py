"""Rebuild all distributions from the retained source JSON and Fixed/UI HTML."""
from pathlib import Path
import subprocess,sys
r=Path(__file__).resolve().parents[1]
for tool in ['build.py','asset-review.py','loader.py','review.py','mechanism-review.py','offline-review.py']:
 subprocess.run([sys.executable,str(r/'tools'/tool)],cwd=r,check=True)
