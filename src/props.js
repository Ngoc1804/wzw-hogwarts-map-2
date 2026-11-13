// Inventory composition uses real supplied recipe instance IDs; geometry follows at P4.
const propAliases={'vạc thuốc':'wizard.cauldron','vạc':'wizard.cauldron','ghế ăn':'seat.dining','ghế':'seat.dining','gương':'decor.mirror','gương vỡ':'decor.mirror','chair':'seat.dining','cauldron':'wizard.cauldron'};
function recipeId(value){return RECIPES[value]?value:VOCAB.recipes[key(value)]||VOCAB.legacyRecipes[key(value)]||null;}
function composeRoom(place){const rid=recipeId(place.type),recipe=RECIPES[rid];const base=place.propsMode==='replace'?[]:(recipe?.instances||[]).map(i=>({...i,source:'recipe'}));let out=base;const diagnostics=[];
 list(place.props).forEach((p,index)=>{
 if(p.childId){const parent=out.find(x=>x.id===p.parentId);if(!parent){diagnostics.push('unknown-parent:'+p.parentId);out.push({...p,id:'rp:child:'+index,informationOnly:true,source:'rp'});return;}parent.childChanges=[...(parent.childChanges||[]),p];return;}
 let matches=[];if(p.id)matches=out.filter(x=>x.id===p.id);else{const item=p.item||propAliases[key(p.name)];matches=out.filter(x=>(item?x.item===item:key(x.name)===key(p.name))&&(!p.zone||x.zone===p.zone));}
 const groups=new Set(matches.map(x=>x.item||key(x.name)));if(groups.size>1||(p.state&&matches.length>1&&!p.id)){diagnostics.push('ambiguous-prop:'+p.name);out.push({...p,id:'rp:'+index,unresolved:true,informationOnly:true,source:'rp'});return;}
 if(p.id&&!matches.length&&p.op!=='add'&&place.propsMode!=='replace'){diagnostics.push('unknown-prop-id:'+p.id);out.push({...p,id:'rp:'+index,unresolved:true,informationOnly:true,source:'rp'});return;}
 const removed=['removed','missing','destroyed'].includes(p.state)||p.count===0;
 if(p.op==='add'){if(p.id&&matches.length){diagnostics.push('duplicate-add-id:'+p.id);return;}if(!removed)out.push({...p,id:p.id||'rp:add:'+index,source:'rp'});return;}
 if(matches.length){out=out.filter(x=>!matches.includes(x));if(!removed){let remaining=p.state&&(p.countProvided===false||p.count===undefined)?matches.reduce((n,m)=>n+(m.count??1),0):(p.count??1);for(const m of matches){const take=Math.min(remaining,m.count??1);if(take>0)out.push({...m,...p,id:m.id,item:m.item,count:take,source:'rp'});remaining-=take;}if(remaining>0)out.push({...p,id:'rp:ensure:'+index,item:matches[0].item,count:remaining,source:'rp'});}}
 else if(!removed)out.push({...p,id:p.id||'rp:ensure:'+index,source:'rp'});
 });
 return {recipeId:rid,objects:out,diagnostics,illustrative:true};}
