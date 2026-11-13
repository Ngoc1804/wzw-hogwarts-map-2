// Source-only access: execute the approved geometry core, never its reference editor/startup.
const fs=require('fs'),vm=require('vm');
function corridorSource(){
 const source=fs.readFileSync('assets/source/corridors.js','utf8');
 const core=source.slice(0,source.indexOf('function Q('));
 const context={window:{},document:{getElementById:()=>({textContent:'null'})}};
 vm.createContext(context);
 const api=vm.runInContext(core+';({templates:t,defaults:s,build:V,draw:q,materials:S,decor:Z,labels:E,patterns:N,opening:R,yard:G})',context);
 return{source,api};
}
module.exports={corridorSource};
