const text=v=>typeof v==='string'?v:'',list=v=>Array.isArray(v)?v:[],key=v=>text(v).normalize('NFKC').trim().toLocaleLowerCase();
const MAP_SCHEMA_VERSION='2.0.0';
function normalize(input){
 const d=input&&typeof input==='object'&&!Array.isArray(input)?input:{},diagnostics=[];
 if(d.schemaVersion!==MAP_SCHEMA_VERSION)diagnostics.push(d.schemaVersion?'unsupported-schema-version:'+text(d.schemaVersion):'missing-schema-version');
 const spots=['inside','corridor','threshold','outdoor'],spot=v=>v==='outside'?'outdoor':spots.includes(v)?v:null;
 const ids=new Set();
 const places=list(d.places).filter(p=>p&&text(p.name).trim()).map((p,index)=>{
  let id=text(p.id)||undefined;
  if(id&&ids.has(id)){diagnostics.push('duplicate-place-id:'+id);id=undefined;}if(id)ids.add(id);
  const props=list(p.props).map((p,i)=>{
   if(typeof p==='string')return{name:p,count:1,op:'ensure'};
   const valid=Number.isInteger(p?.count)&&Number.isFinite(p?.count)&&p.count>=0;
   if(p?.count!==undefined&&!valid)diagnostics.push('invalid-prop-count:'+index+':'+i);
   return {...p,name:text(p?.name),count:valid?p.count:1,op:p?.op==='add'?'add':'ensure'};
  }).filter(p=>p.name);
  return {...p,id,name:text(p.name),type:text(p.type),description:text(p.description),isNewConstruction:p.isNewConstruction===true,propsMode:p.propsMode==='replace'?'replace':'merge',props};
 });
 const actors=list(d.actors).filter(a=>a&&text(a.name)).map(a=>({...a,name:text(a.name),isPC:a.isPC===true,placeId:text(a.placeId),placeName:text(a.placeName),tagType:KEYS.includes(a.tagType)?a.tagType:'unknown',onPatrol:a.onPatrol===true,spot:spot(a.spot),zone:text(a.zone),posture:['standing','sitting','lying','hidden'].includes(a.posture)?a.posture:'standing',placement:['normal','on_furniture','in_wall'].includes(a.placement)?a.placement:'normal',supportId:text(a.supportId),members:list(a.members).filter(n=>typeof n==='string'&&n.trim()),summary:text(a.summary),activity:text(a.activity),observation:text(a.observation),footstep:['walk','idle','hidden'].includes(a.footstep)?a.footstep:'hidden'}));
 if(actors.filter(a=>a.isPC).length>1){diagnostics.push('ambiguous-pc');actors.forEach(a=>a.isPC=false);}
 if(actors.filter(a=>!a.isPC).length>10)diagnostics.push('npc-ribbon-limit-exceeded'); // Preserve RP; Gemini must group, never silently truncate.
 const pcPlace=text(d.pcPlace),pc=actors.find(a=>a.isPC);
 if(!pcPlace||key(pcPlace)==='unknown')diagnostics.push('missing-pc-location');
 if(pc&&(pc.placeId||pc.placeName)&&pcPlace!== (pc.placeId||pc.placeName))diagnostics.push('pc-place-conflict');
 const mode=['indoor','outdoor','template'].includes(d.mapMode)?d.mapMode:undefined;
 if(!pc)diagnostics.push('missing-pc-actor');
 const fatal=!pcPlace||key(pcPlace)==='unknown'||!pc||diagnostics.includes('ambiguous-pc')||(d.schemaVersion!==undefined&&d.schemaVersion!==MAP_SCHEMA_VERSION);
 return {...d,fatal,schemaVersion:MAP_SCHEMA_VERSION,meta:d.meta&&typeof d.meta==='object'?d.meta:{},atlasAnchor:VOCAB.scopes[key(d.atlasAnchor)]||text(d.atlasAnchor)||'custom',mapMode:mode,forceSandbox:d.forceSandbox===true,pcPlace,pcSpot:spot(d.pcSpot),places,actors,events:list(d.events).filter(e=>e&&text(e.title)).map(e=>({...e,title:text(e.title),detail:text(e.detail),hidden:e.hidden===true,icon:e.hidden===true?'?':'!'})),diagnostics};
}
