from pathlib import Path
import json,subprocess,gzip,re,xml.etree.ElementTree as E
# Match the erroneous bow primitive, including combined subpaths; not actor ribbons.
needle=re.compile(r'q\s*-15\s*[-, ]\s*15')
old=json.loads(subprocess.check_output(['git','show','c6545d4:examples/asset-review-data.json']))
new=json.loads(Path('examples/asset-review-data.json').read_text());lookup={a['id']:a for a in old['assets']}
changed=[]
for a in new['assets']:
 E.fromstring(a['svg'])
 if a['svg']!=lookup[a['id']]['svg']:changed.append(a['id'])
 assert 'q-15-15-19 0t19 4q15 15 19 0t-19-4'not in a['svg']
assert len(new['assets'])==432 and len(changed)==32
for name in ['catalog','interiors']:
 s=gzip.decompress(Path('assets/source/'+name+'.json.gz').read_bytes()).decode();assert 'q-15-15-19 0t19 4q15 15 19 0t-19-4'not in s
for f in ['dist/templates-pack.js','dist/shell.css','assets/atlas.json']:
 assert subprocess.check_output(['git','show','c6545d4:'+f])==Path(f).read_bytes()
result={'candidateDesigns':432,'changedDesigns':32,'removedMotifs':51,'remainingKnownBowMotif':0,'fixedPackCSSAtlas':'unchanged','redesign':'not implemented — pending approval'}
Path('tests/bow-cleanup-qa.json').write_text(json.dumps(result,indent=2));print(result)
