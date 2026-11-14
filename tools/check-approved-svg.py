"""Validate all compiled approved views: unique SVG IDs and resolvable references."""
from pathlib import Path
import collections,json,re,xml.etree.ElementTree as ET
root=Path(__file__).resolve().parents[1]
views=json.loads((root/'assets/layout-sizes.json').read_text());count=0
for name,sizes in views.items():
 for size,art in sizes.items():
  body=(re.sub(r'^<svg[^>]*>|</svg>$','',art['sceneSvg']) if name.startswith('OUT_') else art['defs']+art.get('floorSvg','')+art.get('architectureSvg','')+art.get('decorSvg',''))+''.join(o['svg']for o in art['objects'])
  svg=ET.fromstring('<svg xmlns="http://www.w3.org/2000/svg">'+body+'</svg>');ids=[n.get('id')for n in svg.iter()if n.get('id')];refs=set()
  for node in svg.iter():
   for key,value in node.attrib.items():
    refs.update(re.findall(r'url\([\"\']?#([^\)\"\']+)',value))
    if key.endswith('href')and value.startswith('#'):refs.add(value[1:])
  duplicates=[key for key,num in collections.Counter(ids).items()if num>1];missing=refs-set(ids)
  if duplicates or missing:raise ValueError(f'{name}/{size}: duplicate IDs {duplicates}, missing references {sorted(missing)}')
  count+=1
print(f'PASS {count} approved SVG views: unique IDs, references valid')
