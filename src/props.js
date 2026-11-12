// Inventory composition uses real supplied recipe instance IDs; geometry follows at P4.
const propAliases={'vạc thuốc':'wizard.cauldron','vạc':'wizard.cauldron','ghế ăn':'seat.dining','ghế':'seat.dining','gương':'decor.mirror','gương vỡ':'decor.mirror','chair':'seat.dining','cauldron':'wizard.cauldron'};
function recipeId(value){const aliases={potions:'POTIONS_LAB',office:'OFFICE',storage:'STORAGE',classroom:'CLASSROOM',bathroom:'BATHROOM',corridor:'PASSAGE_PROPS',shop:'PUBLIC_COUNTER',dorm:'BEDROOM',common:'LOUNGE',library:'LIBRARY'};return RECIPES[value]?value:aliases[key(value)]||null;}
function composeRoom(place){const rid=recipeId(place.type),recipe=RECIPES[rid];const base=place.propsMode==='replace'?[]:(recipe?.instances||[]).map(i=>({...i,source:'recipe'}));let out=base;const diagnostics=[];
 list(place.props).forEach((p,index)=>{let matches=[];if(p.id)matches=out.filter(x=>x.id===p.id);else{const item=p.item||propAliases[key(p.name)];matches=out.filter(x=>(item?x.item===item:key(x.name)===key(p.name))&&(!p.zone||x.zone===p.zone));}
 const groups=new Set(matches.map(x=>x.item||key(x.name)));if(groups.size>1||(p.state&&matches.length>1&&!p.id)){diagnostics.push('ambiguous-prop:'+p.name);out.push({...p,id:'rp:'+index,unresolved:true,informationOnly:true,source:'rp'});return;}
 if(p.id&&!matches.length){diagnostics.push('unknown-prop-id:'+p.id);out.push({...p,id:'rp:'+index,unresolved:true,informationOnly:true,source:'rp'});return;}
 const removed=['removed','missing','destroyed'].includes(p.state)||p.count===0;
 if(p.op==='add'){if(!removed)out.push({...p,id:p.id||'rp:add:'+index,source:'rp'});return;}
 if(matches.length){const first=matches[0];out=out.filter(x=>!matches.includes(x));if(!removed)out.push({...first,...p,id:first.id,item:first.item,count:p.count,source:'rp'});}
 else if(!removed)out.push({...p,id:p.id||'rp:ensure:'+index,source:'rp'});
 });
 return {recipeId:rid,objects:out,diagnostics,illustrative:true};}
