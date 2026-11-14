"""Share only exact SVG trees after normalizing local ID names, never geometry/colors."""
import re,xml.etree.ElementTree as E

def signature(svg):
 root=E.fromstring(svg)
 # CSS selectors/SMIL can refer to IDs outside href/url; leave those untouched.
 if any(n.tag.split('}')[-1]in ['style','animate','animateTransform','set']for n in root.iter()):return svg
 ids={n.get('id'):'local-'+str(i)for i,n in enumerate(root.iter())if n.get('id')}
 for n in root.iter():
  for key,value in list(n.attrib.items()):
   if key=='id':n.set(key,ids[value]);continue
   value=re.sub(r'url\(#([^)]+)\)',lambda m:'url(#'+ids.get(m[1],m[1])+')',value)
   if key.split('}')[-1]=='href'and value.startswith('#'):value='#'+ids.get(value[1:],value[1:])
   n.set(key,value)
 return E.canonicalize(E.tostring(root,encoding='unicode'))

def share(records):
 seen={};result={};aliases={}
 for id,a in records.items():
  a=dict(a)
  if a.get('svg')and not a.get('corridorSource'):
   key=(a.get('view'),signature(a['svg']))
   if key in seen:a.pop('svg');a['svgRef']=seen[key];aliases[id]=seen[key]
   else:seen[key]=id
  result[id]=a
 return result,aliases
