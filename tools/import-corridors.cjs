// Extract all graphics from the approved source without launching a browser or redesigning artwork.
const fs=require('fs'),crypto=require('crypto');
const{corridorSource}=require('./corridor-source.cjs');
const{api}=corridorSource();
const svg=(body,view)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${view.join(' ')}">${body}</svg>`;
const source='assets/source/corridors.js';
const records=[];
for(const[key,d]of Object.entries(api.decor))records.push({id:'corridor.decor.'+key,name:api.labels[key],category:'Hành lang · Decor',view:'front',viewBox:[-3,-3,d.w+6,d.h+6],svg:svg(d.draw,[-3,-3,d.w+6,d.h+6]),mount:['portrait','gallery','candle','curtain','banner','crest','niche'].includes(key)?'wall':'floor',corridorSource:{kind:'decor',key}});
const defs=api.patterns();
for(const match of defs.matchAll(/<pattern\b[^>]*\bid="([^"]+)"[^>]*>[\s\S]*?<\/pattern>/g)){
 const id=match[1],w=+match[0].match(/\bwidth="([^"]+)"/)[1],h=+match[0].match(/\bheight="([^"]+)"/)[1];
 records.push({id:'corridor.material.'+id,name:id,category:'Hành lang · Vật liệu',view:'top',viewBox:[0,0,w*3,h*3],svg:svg(`<defs>${match[0]}</defs><rect width="${w*3}" height="${h*3}" fill="url(#${id})"/>`,[0,0,w*3,h*3]),mount:'surface',corridorSource:{kind:'pattern',key:id,w:w*3,h:h*3}});
}
for(const kind of ['door','main-door','window'])for(const key of Object.keys(api.materials[kind==='window'?'window':'door'].values)){
 const cfg=JSON.parse(JSON.stringify(api.defaults));cfg.height=40;cfg.materials[kind==='window'?'window':'door']=key;
 const body=api.opening({kind:kind==='window'?'window':'door',main:kind==='main-door',width:kind==='main-door'?64:44,ln:{axis:'H'}},40,cfg);
 records.push({id:`corridor.${kind}.${key}`,name:`${kind} · ${api.materials[kind==='window'?'window':'door'].values[key][0]}`,category:'Hành lang · Cửa',view:'front',viewBox:[-38,-5,76,57],svg:svg(body,[-38,-5,76,57]),mount:'wall',corridorSource:{kind,key}});
}
for(const key of Object.keys(api.materials.yard.values))records.push({id:'corridor.yard.'+key,name:'Sân · '+api.materials.yard.values[key][0],category:'Hành lang · Sân',view:'top',viewBox:[0,0,360,280],svg:svg('<defs>'+[...defs.matchAll(/<pattern\b[^>]*\bid="([^"]+)"[^>]*>[\s\S]*?<\/pattern>/g)].find(m=>m[1]===(key==='paving'?'yard-paving':'yard-grass'))[0]+'</defs>'+api.yard({x:0,y:0,w:360,h:280},key),[0,0,360,280]),mount:'surface',corridorSource:{kind:'yard',key}});
const slate=[...defs.matchAll(/<pattern\b[^>]*\bid="([^"]+)"[^>]*>[\s\S]*?<\/pattern>/g)].find(m=>m[1]==='floor-slate')[0];
records.push({id:'corridor.material.floor-runner',name:'Đá & thảm đỏ',category:'Hành lang · Vật liệu',view:'top',viewBox:[0,0,360,120],svg:svg('<defs>'+slate+'</defs><rect width="360" height="120" fill="url(#floor-slate)"/><rect x="4" y="33.6" width="352" height="52.8" fill="#975b58" stroke="#c6a568" stroke-width="2"/>',[0,0,360,120]),mount:'surface',corridorSource:{kind:'runner'}});
const catalog=JSON.parse(fs.readFileSync('assets/catalog.json','utf8'));
// Exact normalized XML only: preserve fill/stroke/opacity/transform and ID references.
const fingerprint=s=>s.replace(/>\s+</g,'><').trim();
const seen=new Map();for(const[id,a]of Object.entries(catalog))if(a.svg&&!a.corridorSource)seen.set(fingerprint(a.svg),id);
const report=[];
for(const a of records){const signature=fingerprint(a.svg),existing=seen.get(signature);if(existing&&existing!==a.id){catalog[existing].aliases=[...new Set([...(catalog[existing].aliases||[]),a.id])];report.push({id:a.id,canonical:existing,action:'EXACT_ALIAS',sha256:crypto.createHash('sha256').update(a.svg).digest('hex')});continue;}
 catalog[a.id]={...a,source:'CORRIDORS_FINAL',aliases:catalog[a.id]?.aliases||[],occupancy:{x:a.viewBox[0],y:a.viewBox[1],width:a.viewBox[2],height:a.viewBox[3],type:'source-viewbox-conservative',collisionReady:false}};
 seen.set(signature,a.id);report.push({id:a.id,canonical:a.id,action:'KEEP_SOURCE_GRAPHIC',sha256:crypto.createHash('sha256').update(a.svg).digest('hex')});}
fs.writeFileSync('assets/catalog.json',JSON.stringify(catalog));
fs.writeFileSync('docs/CORRIDOR_ELEMENTS.json',JSON.stringify({source,sourceSha256:crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex'),wallHeight:40,records:report,notes:'Only exact normalized SVGs deduplicated. Different drawing/colors remain separate. Patterns/decor/openings reuse the source core in runtime rather than embedding duplicate SVG strings.'},null,2));
console.log('Corridor elements',records.length,'exact aliases',report.filter(r=>r.action==='EXACT_ALIAS').length,'catalog IDs',Object.keys(catalog).length);

require("child_process").execFileSync("python",["tools/apply-paint.py"],{stdio:"inherit"});

require("child_process").execFileSync("python",["tools/style-catalog.py"],{stdio:"inherit"});

require("child_process").execFileSync("python",["tools/finish-paint.py"],{stdio:"inherit"});
