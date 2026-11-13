"""Apply reviewed semantic finishing colors to the main catalog and compiled object art."""
import json,re
from pathlib import Path
r=Path(__file__).resolve().parents[1];patches=json.loads((r/'assets/finish-paint.json').read_text())
p=r/'assets/catalog.json';catalog=json.loads(p.read_text())
for id,changes in patches.items():
 for old,new in changes:catalog[id]['svg']=catalog[id]['svg'].replace(old,new)
p.write_text(json.dumps(catalog,ensure_ascii=False,separators=(',',':')))
p=r/'assets/p4-art.json';art=json.loads(p.read_text())
for a in art.values():
 for o in a['objects']:
  if o['item'] in patches:
   href=re.search(r'href="#([^"]+)"',o['svg'])
   if href:
    sid=href[1];asset=catalog[o['item']]['svg'];body=re.sub(r'^<svg\b[^>]*>','',asset);body=re.sub(r'</svg>\s*$','',body)
    for id in re.findall(r'\bid="([^"]+)"',body):
     body=body.replace('id="'+id+'"','id="finish-'+sid+'-'+id+'"').replace('url(#'+id+')','url(#finish-'+sid+'-'+id+')').replace('href="#'+id+'"','href="#finish-'+sid+'-'+id+'"')
    style=re.search(r'^<svg[^>]*style="([^"]*)"',asset)
    body='<g'+(' style="'+style[1]+'"' if style else '')+'>'+body+'</g>'
    pattern=r'(<symbol\b[^>]*\bid="'+re.escape(sid)+r'"[^>]*>).*?(</symbol>)'
    a['defs']=re.sub(pattern,lambda m:m[1]+body+m[2],a['defs'],flags=re.S)

  for old,new in patches.get(o['item'],[]):o['svg']=o['svg'].replace(old,new)
p.write_text(json.dumps(art,ensure_ascii=False,separators=(',',':')))
print('Finished',len(patches),'assets')
