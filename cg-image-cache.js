/* Small, route-aware decoded-image working set. Nothing is written to saves. */
window.CGImages=(()=>{
 const selector='.rd-cg>img,.ending-scene>img,.zero-scene>.zero-cg';
 const cache=new Map();let queue=[],active=0;
 function ready(image){return new Promise(resolve=>{
  let done=false;const finish=ok=>{if(done)return;done=true;clearTimeout(timer);image.removeEventListener('load',loaded);image.removeEventListener('error',failed);resolve(ok)};
  const failed=()=>finish(false),loaded=()=>{if(!image.naturalWidth)return failed();if(image.decode)image.decode().then(()=>finish(true),()=>finish(image.complete&&!!image.naturalWidth));else finish(true)};
  const timer=setTimeout(failed,20000);image.addEventListener('load',loaded,{once:true});image.addEventListener('error',failed,{once:true});if(image.complete)loaded();
 })}
 function pump(){while(active<2&&queue.length){const src=queue.shift();if(cache.has(src))continue;const image=new Image();image.decoding='async';image.fetchPriority='low';cache.set(src,image);while(cache.size>6)cache.delete(cache.keys().next().value);active++;image.src=src;ready(image).then(ok=>{if(!ok&&cache.get(src)===image)cache.delete(src);active--;pump()})}}
 function warm(sources){queue=[...new Set(sources.filter(Boolean))].filter(src=>!cache.has(src)).slice(0,4);pump()}
 // Follow data only: never invoke a scene transition or a choice handler.
 function ahead(key,get,imageOf,current){const pending=[[key,0]],seen=new Set(),urls=[];while(pending.length&&seen.size<40&&urls.length<4){const [k,depth]=pending.shift();if(!k||seen.has(k)||depth>2)continue;seen.add(k);const def=get(k);if(!def)continue;const src=imageOf(def);const changed=src&&src!==current&&!urls.includes(src);if(changed&&depth>=2)continue;if(changed)urls.push(src);const nextDepth=depth+(changed?1:0);for(const next of [def.next,...(def.choices||def.options||[]).map(c=>Array.isArray(c)?c[1]:c.next)])if(next)pending.push([next,nextDepth])}return urls}
 function sync(){
  const image=screen.querySelector(selector);
  if(!image){if(view==='day4-sleep-ending'&&typeof d4Sleep==='function'&&['white-wait','white-fade'].includes(d4Sleep()?.phase))warm([D4_HOSPITAL_IMAGES.ceiling,D4_HOSPITAL_IMAGES.nurse]);else warm([]);return}
  const src=image.getAttribute('src');let next=[];
  if(view==='noodle-cg'&&state.story.noodleEvening){const n=state.story.noodleEvening;next=ahead(n.phase,noodleScript,d=>NOODLE_CG_IMAGES[d.image],src);if(n.phase==='more')next.unshift(NOODLE_CG_IMAGES.cg9)}
  else if(view==='day4-sleep-ending'&&typeof d4HospitalScripts==='function'){const defs=d4HospitalScripts(),n=d4Sleep();next=ahead(n.script,k=>defs[k],d=>d.image,src);if(n.phase==='bed')next=[D3_NIGHT_IMAGE];if(['white-wait','white-fade','sleep-choice'].includes(n.phase))next.push(D4_HOSPITAL_IMAGES.ceiling,D4_HOSPITAL_IMAGES.nurse)}
  else if(typeof FOOD_CG!=='undefined'&&src===FOOD_CG.images.intro)next=[FOOD_CG.images.gift];
  if(typeof Z!=='undefined'&&src===Z.cg.shelves)next.push(Z.cg.queue);
  if(typeof D3_FEVER_IMAGES!=='undefined'&&Object.values(D3_FEVER_IMAGES).includes(src)&&view==='day3-fever-cg')next.push(...Object.values(D3_FEVER_IMAGES).filter(s=>s!==src));
  // Touch the current entry before evicting older decoded images.
  if(cache.has(src)){const value=cache.get(src);cache.delete(src);cache.set(src,value)}
  warm(next);
 }
 let scheduled=false;new MutationObserver(records=>{
  // Typewriter text changes every 32 ms; they do not change the image plan.
  if(scheduled||!records.some(r=>r.type==='attributes'||[...r.addedNodes,...r.removedNodes].some(n=>n.nodeType===1&&(n.matches('img')||n.querySelector('img')))))return;
  scheduled=true;queueMicrotask(()=>{scheduled=false;sync()});
 }).observe(screen,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});
 return {ready,warm,ahead,sync};
})();
