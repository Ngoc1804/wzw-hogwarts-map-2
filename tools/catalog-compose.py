"""Build colored candidate catalog/compositions from selected source geometry and measured bounds."""
from pathlib import Path
import json,re,csv,hashlib,base64,xml.etree.ElementTree as E
items=json.load(open('work/catalog-selection.json'));bounds=json.load(open('work/catalog-bounds.json'));mapping=json.load(open('work/catalog-mapping.json'))
for a in items:a['bounds']=bounds[a['id']];a['coloredBy']='source + explicit material variables';a['status']='candidate'
def pick(alias,view=None,source=None):
 matches=[a for a in items if alias in a.get('aliases',[])and(not view or a.get('view')==view)and(not source or source in a.get('sources',[]))]
 if not matches:raise ValueError(alias+' '+str(view))
 return sorted(matches,key=lambda a:('C4'in a['sources'],a['source']=='C4'),reverse=True)[0]
def nested(a,rect,prefix):
 x,y,w,h=rect;svg=a['svg'];ids=re.findall(r'\bid="([^"]+)"',svg);m={i:prefix+i for i in ids}
 svg=re.sub(r'\bid="([^"]+)"',lambda z:'id="'+m[z[1]]+'"',svg)
 svg=re.sub(r'url\(#([^)]*)\)',lambda z:'url(#'+m.get(z[1],z[1])+')',svg);svg=re.sub(r'(href=")#([^"]+)"',lambda z:z[1]+'#'+m.get(z[2],z[2])+'"',svg)
 b=a['bounds'];svg=re.sub(r'viewBox="[^"]*"','viewBox="'+' '.join(map(str,b))+'"',svg,count=1)
 svg=svg.replace('<svg ',f'<svg x="{x}" y="{y}" width="{w}" height="{h}" ',1)
 return svg
new=[]
def cluster(cid,name,parts,view='top',size=(256,240),base=True):
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size[0]} {size[1]}">'
 if base:svg+='<rect x="8" y="8" width="240" height="224" rx="28" fill="#c1a47b" stroke="#705b44" stroke-width="2"/><rect x="15" y="15" width="226" height="210" rx="22" fill="#e5d4ad" stroke="#aa8d61" stroke-width="1"/>'
 inventory=[]
 for i,(a,rect)in enumerate(parts):svg+=nested(a,rect,cid.replace('.','-')+'-p'+str(i)+'-');inventory.append({'id':cid+':'+str(i+1),'designId':a['id'],'name':a['name'],'rect':rect,'mount':'surface'if view=='top'else'ground'})
 svg+='</svg>';a={'id':cid,'name':name,'category':'Cụm để bàn · Mới'if view=='top'else'Cảnh quan · Cụm cây mới','view':view,'svg':svg,'parts':inventory,'bounds':[0,0,*size],'sources':['composed from colored selected assets'],'source':'new-composition','aliases':[],'status':'new candidate','surfaceBounds':[8,8,240,224]if base else None};new.append(a)
def part(id,x,y,w,h):return(pick(id,'top'),[x,y,w,h])
cluster('wm.surface.study.top','Cụm đọc và ghi chép — top',[part('accessory.book-open',22,42,100,72),part('accessory.book',146,24,56,72),part('accessory.ink',158,120,30,38),part('accessory.scroll',30,153,108,34),part('accessory.candle',204,44,25,25)])
cluster('wm.surface.potions.top','Cụm pha chế nhỏ — top',[part('accessory.bottle',27,26,28,58),part('accessory.bottle',77,24,28,58),part('accessory.bottle',177,27,28,58),part('accessory.pot',92,95,78,66),part('accessory.book',25,134,48,64),part('accessory.scroll',102,183,116,24)])
cluster('wm.surface.tea.top','Cụm trà và đọc sách — top',[part('accessory.teapot',91,46,74,70),part('accessory.mug',27,80,42,42),part('accessory.mug',190,85,36,36),part('accessory.plate',95,153,70,55),part('accessory.book',25,145,46,60)])
cluster('wm.surface.archive.top','Cụm sắp hồ sơ — top',[part('accessory.book',25,26,50,65),part('accessory.book',100,26,50,65),part('accessory.scroll',25,134,150,32),part('accessory.ink',194,130,26,38),part('accessory.candle',192,35,30,30)])
cluster('wm.surface.faculty.top','Cụm bàn giáo viên — top',[part('accessory.book',22,22,82,67),part('accessory.lamp',156,24,65,80),part('accessory.book-open',20,127,105,70),part('accessory.ink',135,136,28,30),part('accessory.mug',190,142,36,36)])
cluster('wm.surface.botany.top','Cụm chăm cây nhỏ — top',[part('plant.pot-top',23,23,86,86),part('accessory.bottle',159,25,30,68),part('accessory.book-open',58,140,122,66),part('accessory.mug',197,140,30,30)])
for cid,name,trees in [('wm.grove.broadleaf','Cụm cây lá rộng — nguồn 259',['tree.oak','tree.beech','tree.birch','tree.alder','tree.rowan','tree.fruit']),('wm.grove.conifer','Cụm lá kim và rìa thưa — nguồn 259',['tree.spruce','tree.pine','tree.slender','tree.spreading','tree.bare','tree.weeping'])]:
 rects=[[170,20,118,205],[260,35,110,190],[82,70,130,190],[335,85,125,190],[205,100,135,195],[28,130,108,150]]
 parts=[(pick(t,source='259'),r)for t,r in zip(trees,rects)];parts.sort(key=lambda p:p[1][1]+p[1][3]);cluster(cid,name,parts,'elevation',(500,320),False)
items+=new
for a in items:
 a['svgSha256']=hashlib.sha256(a['svg'].encode()).hexdigest()
summary={'inputRecords':1376,'keptDesigns':len(items)-len(new),'sharedCopies':sum(r['action']=='SHARE_SAME_DESIGN'for r in mapping),'oldTreeCopiesExcluded':33,'newSurfaceClusters':6,'newGroves':2,'totalCandidateDesigns':len(items),'productionStatus':'UNCHANGED — pending user approval','protectedTrees':['ancient','special willow / Liễu Roi','H1 lakeside ancient']}
payload={'summary':summary,'assets':items,'changes':mapping}
Path('examples/asset-review-data.json').write_text(json.dumps(payload,ensure_ascii=False,separators=(',',':')))
with Path('docs/ASSET_SELECTION.csv').open('w')as f:
 w=csv.DictWriter(f,fieldnames=list(mapping[0]));w.writeheader();w.writerows(mapping)
print(summary)
# Surface mockups are review examples, separate from catalog designs and runtime RP.
demos=[]
for name,tableId,cid in [('Bàn giáo viên','table.desk','wm.surface.faculty.top'),('Bàn pha chế','table.study','wm.surface.potions.top'),('Bàn đọc và ghi','table.study','wm.surface.study.top')]:
 table=pick(tableId,'top');deco=next(a for a in new if a['id']==cid)
 svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 620 340"><rect width="620" height="340" fill="#eee2c7"/>'+nested(table,[35,20,550,300],'demo-table-')+nested(deco,[212,76,196,184],'demo-decor-')+'</svg>'
 demos.append({'name':name,'svg':svg,'tableId':table['id'],'clusterId':cid,'status':'surface placement prototype, not RP runtime'})
payload['demos']=demos
Path('examples/asset-review-data.json').write_text(json.dumps(payload,ensure_ascii=False,separators=(',',':')))
