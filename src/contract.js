const text=v=>typeof v==='string'?v:'',list=v=>Array.isArray(v)?v:[],key=v=>text(v).normalize('NFKC').trim().toLocaleLowerCase();
function normalize(input){
 const d=input&&typeof input==='object'&&!Array.isArray(input)?input:{},diagnostics=[];
 const usedIds=new Set();
 const places=list(d.places).filter(p=>p&&text(p.name)).map((p,index)=>{
  let id=text(p.id)||undefined;
  if(id&&usedIds.has(id)){diagnostics.push('duplicate-place-id:'+id);id='rp:conflict:'+index;}if(id)usedIds.add(id);
  const props=list(p.props).map((p,i)=>{
   if(typeof p==='string')return{name:p,count:1,op:'ensure'};
   const valid=Number.isInteger(p?.count)&&Number.isFinite(p?.count)&&p.count>=0;
   if(p?.count!==undefined&&!valid)diagnostics.push('invalid-prop-count:'+index+':'+i);
   return {...p,name:text(p?.name),count:valid?p.count:1,op:p?.op==='add'?'add':'ensure'};
  }).filter(p=>p.name);
  return {...p,id,name:text(p.name),type:text(p.type),description:text(p.description),propsMode:p.propsMode==='replace'?'replace':'merge',props};
 });
 const spots=['inside','corridor','threshold','outdoor'],spot=v=>v==='outside'?'outdoor':spots.includes(v)?v:null;
 const actors=list(d.actors).filter(a=>a&&text(a.name)).map(a=>({...a,name:a.name,placeName:text(a.placeName),tagType:KEYS.includes(a.tagType)?a.tagType:'unknown',onPatrol:a.tagType==='patrol',spot:spot(a.spot),footstep:['walk','idle','hidden'].includes(a.footstep)?a.footstep:'hidden'}));
 if(actors.filter(a=>a.isPC).length>1){diagnostics.push('ambiguous-pc');actors.forEach(a=>a.isPC=false);}
 const pcPlace=text(d.pcPlace);
 const pc=actors.find(a=>a.isPC);
 if(pc&&(pc.placeId||pc.placeName)&&pcPlace&&pcPlace!==(pc.placeId||pc.placeName))diagnostics.push('pc-place-conflict');
 return {...d,meta:d.meta&&typeof d.meta==='object'?d.meta:{},atlasAnchor:VOCAB.scopes[key(d.atlasAnchor)]||text(d.atlasAnchor)||'custom',pcPlace,pcSpot:spot(d.pcSpot),places,actors,events:list(d.events).filter(e=>e&&text(e.title)),diagnostics};
}
