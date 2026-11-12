const {chromium}=require('playwright'),fs=require('fs'),assert=require('assert');
const http=require('http'),path=require('path');
let base=process.env.MAP_PREVIEW_URL;
(async()=>{
 const server=http.createServer((q,r)=>{const file=path.join(process.cwd(),new URL(q.url,'http://localhost').pathname);try{r.end(fs.readFileSync(file))}catch{r.statusCode=404;r.end()}});await new Promise(r=>server.listen(0,'127.0.0.1',r));base=base||'http://127.0.0.1:'+server.address().port+'/examples/p4-review.html';
 const b=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 const p=await b.newPage({viewport:{width:1700,height:1050},reducedMotion:'reduce'}),errors=[],report=[];
 p.on('pageerror',e=>errors.push(e.message));await p.goto(base);await p.waitForFunction(()=>document.querySelector('#wzw-map').dataset.status==='ready');
 const cases=await p.evaluate(()=>WZW_REVIEW_CASES);
 for(const fixture of cases){
  const started=Date.now();await p.locator('#review-controls summary').click();await p.selectOption('#review-scene',fixture.id);await p.waitForFunction(()=>!document.querySelector('#review-scene').disabled);
  const result=await p.evaluate(()=>{
   const svg=document.querySelector('#mapmount > svg'),scene=WZW_SCENE,plan=scene.rendered.geometry;
   const ids=[...svg.querySelectorAll('[id]')].map(n=>n.id),all=new Set(ids);
   const refs=[...svg.outerHTML.matchAll(/(?:url\(#|href=["']#)([^)"' ]+)/g)].map(x=>x[1]);
   const geometryFailures=[],doorCollisions=[],actualBoundsMismatch=[];
   for(const n of svg.querySelectorAll('[data-instance]')){const b=n.getBBox(),m=svg.getScreenCTM().inverse().multiply(n.getScreenCTM()),points=[[b.x,b.y],[b.x+b.width,b.y+b.height]].map(([x,y])=>new DOMPoint(x,y).matrixTransform(m)),actual=[points[0].x,points[0].y,points[1].x-points[0].x,points[1].y-points[0].y],expected=n.dataset.footprint.split(' ').map(Number);if(actual.some((v,i)=>Math.abs(v-expected[i])>1))actualBoundsMismatch.push(n.dataset.instance);}
   const wallHeightFailures=[...svg.querySelectorAll('[data-wall]>path:first-child')].filter(n=>Math.abs(n.getBBox().height-36)>.01).length;
   for(const r of plan?.rooms||[]){
    const place=scene.places[r.index];
    for(const f of scene.rendered.footprints.filter(f=>f.placeId===place.id)){
     const [x,y,w,h]=f.bounds;
     const inside=(px,py)=>r.circular?Math.hypot(px-r.x-r.w/2,py-r.y-r.h/2)<=r.w/2+.1:px>=r.x-.1&&py>=r.y-.1&&px<=r.x+r.w+.1&&py<=r.y+r.h+.1;
     if(![[x,y],[x+w,y],[x,y+h],[x+w,y+h]].every(([x,y])=>inside(x,y)))geometryFailures.push(f.id);
     const door=plan.openings.doors.find(d=>d.room===r.id);
     if(door){const l=door.ln;let clearance;
      if(l.axis==='H')clearance={x:door.at-door.width/2-4,y:l.at===r.y?r.y:r.y+r.h-40,w:door.width+8,h:40};
      else clearance={x:l.at===r.x?r.x:r.x+r.w-40,y:door.at-door.width/2-4,w:40,h:door.width+8};
      if(x<clearance.x+clearance.w&&x+w>clearance.x&&y<clearance.y+clearance.h&&y+h>clearance.y)doorCollisions.push({place:place.name,item:f.id,asset:f.item});
     }
    }
   }
   const malformed=svg.querySelector('parsererror')?.textContent;
   return {nodes:svg.querySelectorAll('*').length,renderMs:+document.querySelector('#wzw-map').dataset.renderMs,heapBytes:performance.memory?.usedJSHeapSize||null,kind:scene.rendered.kind,layout:plan?.type,roomCount:svg.querySelectorAll('[data-floor="room"]').length,walls:svg.querySelectorAll('[data-wall]').length,wallPattern:!!svg.querySelector('#wall-stone'),slatePattern:!!svg.querySelector('#floor-slate'),instances:svg.querySelectorAll('[data-instance]').length,actorTags:document.querySelectorAll('.npc-tag').length,expectedActors:scene.places.length,footsteps:svg.querySelectorAll('[data-layer="actor-feet"] .footstep').length,missingRefs:[...new Set(refs.filter(id=>!document.getElementById(id)))],duplicateIds:ids.length-all.size,geometryFailures,doorCollisions,actualBoundsMismatch,wallHeightFailures,malformed,unresolvedActors:scene.places.filter(p=>!p.bounds).map(p=>p.name),inspectorHeadings:[...document.querySelectorAll('aside h3,.eyebrow')].map(n=>n.textContent.trim())};
  });
  result.id=fixture.id;result.expectedActors=fixture.data.actors.length;result.elapsedMs=Date.now()-started;
  const target=p.locator('[data-id]').last();if(await target.count()){await target.focus();await p.keyboard.press('Enter');assert.equal(await p.locator('#place-title').innerText(),fixture.data.places.at(-1).name);}
  const initialVB=await p.locator('#mapmount>svg').getAttribute('viewBox');await p.locator('#zoom-in').click();assert.notEqual(await p.locator('#mapmount>svg').getAttribute('viewBox'),initialVB);await p.locator('#fit').click();assert.equal(await p.locator('#mapmount>svg').getAttribute('viewBox'),initialVB);
  await p.locator('#review-controls').evaluate(n=>n.open=false);await p.screenshot({path:'tests/repair-'+fixture.id+'.png'});
  const mobile=await b.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
  await mobile.goto(base);await mobile.waitForFunction(()=>document.querySelector('#wzw-map').dataset.status==='ready');await mobile.locator('#review-controls summary').tap();await mobile.selectOption('#review-scene',fixture.id);await mobile.waitForFunction(()=>!document.querySelector('#review-scene').disabled);
  const hit=await mobile.evaluate(()=>{const node=[...document.querySelectorAll('#mapmount [data-id]')].at(-1),r=node.getBoundingClientRect();for(let fy=.15;fy<1;fy+=.2)for(let fx=.15;fx<1;fx+=.2){const x=r.x+r.width*fx,y=r.y+r.height*fy;if(document.elementFromPoint(x,y)?.closest('[data-id]')===node)return{x,y}}return null;});assert(hit,fixture.id+' no tappable room surface');await mobile.touchscreen.tap(hit.x,hit.y);assert.equal(await mobile.locator('#place-title').innerText(),fixture.data.places.at(-1).name);
  await mobile.waitForTimeout(600);await mobile.screenshot({path:'tests/repair-'+fixture.id+'-mobile.png'});await mobile.close();report.push(result);console.log(JSON.stringify(result));
 }
 fs.writeFileSync('tests/repair-review-qa.json',JSON.stringify({report,errors,visual:'PENDING USER APPROVAL',targetPreview:'NOT TESTED'},null,2));
 assert.equal(errors.length,0,errors.join('\n'));
 for(const r of report){assert.equal(r.duplicateIds,0);assert.equal(r.missingRefs.length,0,r.id+' missing SVG reference');assert.equal(r.actorTags,r.expectedActors,r.id+' missing actor');assert.equal(r.actualBoundsMismatch.length,0,r.id+' useful artwork bounds mismatch');assert.equal(r.wallHeightFailures,0,r.id+' actual wall height');assert.equal(r.geometryFailures.length,0,r.id+' furniture outside floor');assert.equal(r.doorCollisions.length,0,r.id+' blocked door');if(r.kind==='indoor'){assert(r.walls>0&&r.wallPattern&&r.slatePattern,r.id+' missing source architecture');}}
 await b.close();await new Promise(r=>server.close(r));console.log('PASS repair review');
})().catch(e=>{console.error(e);process.exit(1)});
