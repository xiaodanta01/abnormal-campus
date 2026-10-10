/* Small, route-aware decoded-image working set. Nothing is written to saves. */
window.CGImages=(()=>{
 const selector='.rd-cg>img,.ending-scene>img,.zero-scene>.zero-cg';
 const allScenes=["assets/bed-phone-day-screen-off.jpg?v=20261011-rc4", "assets/bed-phone-evening-screen-off.jpg?v=20261011-rc4", "assets/day-zero-bedroom.jpg?v=20261011-rc4", "assets/day2-door-804.jpg?v=20261011-rc4", "assets/day2-elevator-corridor.jpg?v=20261011-rc4", "assets/day2-elevator-lobby.jpg?v=20261011-rc4", "assets/day2-elevator-panel.jpg?v=20261011-rc4", "assets/day2-evening-phone.jpg?v=20261011-rc4", "assets/day2-midday-desk.jpg?v=20261011-rc4", "assets/day2-midday-knitting.jpg?v=20261011-rc4", "assets/day2-midday-linqing.jpg?v=20261011-rc4", "assets/day2-return-dorm.jpg?v=20261011-rc4", "assets/day2-visit-318.jpg?v=20261011-rc4", "assets/day2-visit-408.jpg?v=20261011-rc4", "assets/day2-visit-back.jpg?v=20261011-rc4", "assets/day2-visit-down.jpg?v=20261011-rc4", "assets/day2-visit-jiang-updated.jpg?v=20261011-rc4", "assets/day2-visit-lin.jpg?v=20261011-rc4", "assets/day2-visit-tears-updated.jpg?v=20261011-rc4", "assets/day2-visit-zhou-updated.jpg?v=20261011-rc4", "assets/day2-wrong-dorm.jpg?v=20261011-rc4", "assets/day2-wrong-room-door.jpg?v=20261011-rc4", "assets/day3-evening-bed.jpg?v=20261011-rc4", "assets/day3-fever-linqing-hd.jpg?v=20261011-rc4", "assets/day3-fever-linqing.jpg?v=20261011-rc4", "assets/day3-fever-medicine.jpg?v=20261011-rc4", "assets/day3-linqing-confession.jpg?v=20261011-rc4", "assets/day3-night-bed.jpg?v=20261011-rc4", "assets/day4-convenience-bag.jpg?v=20261011-rc4", "assets/day4-delegation-narration.jpg?v=20261011-rc4", "assets/day4-delegation-portraits.jpg?v=20261011-rc4", "assets/day4-final-bed-phone.jpg?v=20261011-rc4", "assets/day4-food-bibimbap.jpg?v=20261011-rc4", "assets/day4-food-chicken.jpg?v=20261011-rc4", "assets/day4-food-croissant.jpg?v=20261011-rc4", "assets/day4-food-omurice.jpg?v=20261011-rc4", "assets/day4-food-onigiri.jpg?v=20261011-rc4", "assets/day4-food-pasta.jpg?v=20261011-rc4", "assets/day4-food-sandwich.jpg?v=20261011-rc4", "assets/day4-food-sushi.jpg?v=20261011-rc4", "assets/day4-hospital-ceiling.jpg?v=20261011-rc4", "assets/day4-hospital-nurse.jpg?v=20261011-rc4", "assets/day4-hospital-zhouhe.jpg?v=20261011-rc4", "assets/day4-lin-memory-1.jpg?v=20261011-rc4", "assets/day4-lin-memory-2.jpg?v=20261011-rc4", "assets/day4-lin-memory-3.jpg?v=20261011-rc4", "assets/day4-lin-memory-4.jpg?v=20261011-rc4", "assets/day4-lin-memory-5.jpg?v=20261011-rc4", "assets/day4-lin-memory-6.jpg?v=20261011-rc4", "assets/day4-lin-memory-7.jpg?v=20261011-rc4", "assets/day4-lin-memory-8.jpg?v=20261011-rc4", "assets/day4-lin-memory.jpg?v=20261011-rc4", "assets/day4-lin-outside-evidence.jpg?v=20261011-rc4", "assets/day4-night-oden.jpg?v=20261011-rc4", "assets/day4-pickup-door.jpg?v=20261011-rc4", "assets/day4-pickup-scarf.jpg?v=20261011-rc4", "assets/day4-shen-confrontation.jpg?v=20261011-rc4", "assets/day4-wait-desk.jpg?v=20261011-rc4", "assets/day4-zhoumo-debate-updated.jpg?v=20261011-rc4", "assets/day4-zhoumo-debate.jpg?v=20261011-rc4", "assets/day5-campus-gate.jpg?v=20261011-rc4", "assets/day5-hospital-1207.jpg?v=20261011-rc4", "assets/day5-hospital-hands.jpg?v=20261011-rc4", "assets/day5-hospital-lin.jpg?v=20261011-rc4", "assets/day5-hospital-wheelchair.jpg?v=20261011-rc4", "assets/day5-lin-night-bench.jpg?v=20261011-rc4", "assets/day5-lin-night-road.jpg?v=20261011-rc4", "assets/day5-lin-stay-later.jpg?v=20261011-rc4", "assets/day5-lin-stay-love.jpg?v=20261011-rc4", "assets/drone-rooftop-v2.jpg?v=20261011-rc4", "assets/drone-rooftop.jpg?v=20261011-rc4", "assets/first-morning-door.jpg?v=20261011-rc4", "assets/food-cg-dorm.jpg?v=20261011-rc4", "assets/food-cg-snickers.jpg?v=20261011-rc4", "assets/noodle-cg/cg-window-v1.jpg?v=20261011-rc4", "assets/noodle-cg/cg1-v1.jpg?v=20261011-rc4", "assets/noodle-cg/cg2-v1.jpg?v=20261011-rc4", "assets/noodle-cg/cg3-v1.jpg?v=20261011-rc4", "assets/noodle-cg/cg4-v1.jpg?v=20261011-rc4", "assets/noodle-cg/cg5-v1.jpg?v=20261011-rc4", "assets/noodle-cg/cg6-v1.jpg?v=20261011-rc4", "assets/noodle-cg/cg6.5-v1.jpg?v=20261011-rc4", "assets/noodle-cg/cg7-v1.jpg?v=20261011-rc4", "assets/noodle-cg/cg8-v1.jpg?v=20261011-rc4", "assets/noodle-cg/cg9-v1.jpg?v=20261011-rc4", "assets/pickup-day2-p1.jpg?v=20261011-rc4", "assets/pickup-day2-p2.jpg?v=20261011-rc4", "assets/pickup-day2-p3.jpg?v=20261011-rc4", "assets/pickup-day2-p4.jpg?v=20261011-rc4", "assets/pickup-day2-solo-elevator.jpg?v=20261011-rc4", "assets/pickup16-cabinet.jpg?v=20261011-rc4", "assets/pickup16-corridor.jpg?v=20261011-rc4", "assets/pickup16-door.jpg?v=20261011-rc4", "assets/pickup16-elevator.jpg?v=20261011-rc4", "assets/pickup16-fourth-floor.jpg?v=20261011-rc4", "assets/pickup16-handle.jpg?v=20261011-rc4", "assets/pickup16-screen.jpg?v=20261011-rc4", "assets/questionnaire/dorm-night-v1.jpg?v=20261011-rc4", "assets/supermarket-queue.jpg?v=20261011-rc4", "assets/supermarket-shelves.jpg?v=20261011-rc4", "assets/day4-lin-memory-guarantor-v2.jpg?v=20261011-rc4"];
 const cache=new Map(),failedUntil=new Map();let queue=[],active=0;
 const downloaded=new Set(),attempts=new Map(),retryAfter=new Map();let downloading=false;
 // Download compressed files into the HTTP cache, without decoding every CG
 // or retaining hundreds of full-size bitmaps in mobile memory.
 async function downloadAll(){
  if(downloading||document.hidden||navigator.onLine===false||active>=2)return;
  const candidates=[...new Set([...entrySources(),...allScenes])];
  const src=candidates.find(src=>!downloaded.has(src)&&!cache.has(src)&&(attempts.get(src)||0)<3&&(retryAfter.get(src)||0)<=Date.now());
  if(!src)return;
  downloading=true;attempts.set(src,(attempts.get(src)||0)+1);
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),30000);
  try{const response=await fetch(src,{cache:'force-cache',priority:'low',signal:controller.signal});if(!response.ok)throw new Error('CG '+response.status);await response.arrayBuffer();downloaded.add(src)}catch{retryAfter.set(src,Date.now()+30000)}
  finally{clearTimeout(timer);downloading=false;setTimeout(downloadAll,50)}
 }
 function ready(image){return new Promise(resolve=>{
  let done=false;const finish=ok=>{if(done)return;done=true;clearTimeout(timer);image.removeEventListener('load',loaded);image.removeEventListener('error',failed);resolve(ok)};
  const failed=()=>finish(false),loaded=()=>{if(!image.naturalWidth)return failed();if(image.decode)image.decode().then(()=>finish(true),()=>finish(image.complete&&!!image.naturalWidth));else finish(true)};
  const timer=setTimeout(failed,20000);image.addEventListener('load',loaded,{once:true});image.addEventListener('error',failed,{once:true});if(image.complete)loaded();
 })}
 function pump(){while(!document.hidden&&active<2&&queue.length){const src=queue.shift();if(cache.has(src))continue;const image=new Image();image.decoding='async';image.fetchPriority='low';cache.set(src,image);while(cache.size>6)cache.delete(cache.keys().next().value);active++;image.src=src;ready(image).then(ok=>{if(ok)downloaded.add(src);if(!ok){if(cache.get(src)===image)cache.delete(src);failedUntil.set(src,Date.now()+30000);if(!image.complete)image.removeAttribute('src')}active--;pump()})}}
 function warm(sources){for(const [src,until]of failedUntil)if(until<=Date.now())failedUntil.delete(src);queue=[...new Set(sources.filter(Boolean))].filter(src=>!cache.has(src)&&!failedUntil.has(src)).slice(0,4);pump()}
 // Follow data only: never invoke a scene transition or a choice handler.
 function ahead(key,get,imageOf,current){const pending=[[key,0]],seen=new Set(),urls=[];while(pending.length&&seen.size<40&&urls.length<4){const [k,depth]=pending.shift();if(!k||seen.has(k)||depth>2)continue;seen.add(k);const def=get(k);if(!def)continue;const src=imageOf(def);const changed=src&&src!==current&&!urls.includes(src);if(changed&&depth>=2)continue;if(changed)urls.push(src);const nextDepth=depth+(changed?1:0);for(const next of [def.next,...(def.choices||def.options||[]).map(c=>Array.isArray(c)?c[1]:c.next)])if(next)pending.push([next,nextDepth])}return urls}
 // Read progress without calling state getters (some of those create save data).
 // Keep only the upcoming scene group warm while the player is still chatting.
 function entrySources(){
  const s=state.story||{},day=Math.round((Date.parse(state.system.date+'T00:00:00Z')-Date.UTC(2045,8,7))/86400000);
  const bedroom='assets/day-zero-bedroom.jpg?v=20261011-rc4',night='assets/day3-night-bed.jpg?v=20261011-rc4';
  if(s.dayFourSleep&&s.dayFourSleep.phase!=='done')return [night,'assets/day4-hospital-ceiling.jpg?v=20261011-rc4','assets/day4-hospital-nurse.jpg?v=20261011-rc4','assets/day5-lin-night-road.jpg?v=20261011-rc4'];
  if(day===0)return s.zero?.rulesActive?[bedroom]:['assets/supermarket-shelves.jpg?v=20261011-rc4','assets/supermarket-queue.jpg?v=20261011-rc4',bedroom];
  if(day===1){
   if(s.noodleEvening?.phase==='done')return ['assets/questionnaire/dorm-night-v1.jpg?v=20261011-rc4',bedroom];
   if(s.foodCG?.phase==='done'||s.afternoonCommonReady||s.noodleEvening)return ['assets/noodle-cg/cg3-v1.jpg?v=20261011-rc4','assets/noodle-cg/cg1-v1.jpg?v=20261011-rc4','assets/noodle-cg/cg2-v1.jpg?v=20261011-rc4'];
   return ['assets/first-morning-door.jpg?v=20261011-rc4','assets/food-cg-dorm.jpg?v=20261011-rc4','assets/food-cg-snickers.jpg?v=20261011-rc4'];
  }
  if(day===2)return s.dayTwoFreeAction?.cg?.done||s.dayTwoFreeAction?.unlocked||s.dayTwoEvening?['assets/day2-evening-phone.jpg?v=20261011-rc4',bedroom]:['assets/day2-midday-desk.jpg?v=20261011-rc4','assets/day2-midday-linqing.jpg?v=20261011-rc4','assets/day2-midday-knitting.jpg?v=20261011-rc4'];
  if(day===3)return s.dayThreeFever?.phase==='done'||s.dayThreeFever?.phase==='free'?['assets/bed-phone-evening-screen-off.jpg?v=20261011-rc4',bedroom,night]:['assets/day2-midday-desk.jpg?v=20261011-rc4','assets/day3-fever-linqing-hd.jpg?v=20261011-rc4','assets/day3-fever-medicine.jpg?v=20261011-rc4'];
  if(day>=4)return s.dayFourLinNight||state.system.time>='18:00'?['assets/day4-night-oden.jpg?v=20261011-rc4',bedroom,night,'assets/day4-hospital-ceiling.jpg?v=20261011-rc4']:['assets/bed-phone-day-screen-off.jpg?v=20261011-rc4','assets/day4-night-oden.jpg?v=20261011-rc4',bedroom];
  return [];
 }
 function sync(){
  if(document.hidden)return;
  const image=screen.querySelector(selector);
  if(!image){warm(entrySources());return}
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
 // Chat progress can change without replacing any image, so image observation
 // alone cannot prepare the first CG. Poll only outside CG, without saving.
 // The game's interval wrapper pauses story timers on the launch screen and
 // ending routes; resource preparation must also work on those screens.
 const poll=typeof mobileNativeInterval==='function'?mobileNativeInterval:window.setInterval.bind(window);
 poll(()=>{if(!document.hidden&&!screen.querySelector(selector))sync();downloadAll()},1000);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)sync()});
 window.addEventListener('pageshow',sync);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync,{once:true});else queueMicrotask(sync);
 return {ready,warm,ahead,sync,entrySources,downloadAll,downloadProgress:()=>({total:allScenes.length,downloaded:allScenes.filter(src=>downloaded.has(src)||(cache.get(src)?.complete&&cache.get(src)?.naturalWidth)).length})};
})();
