/* Replay only a complete, observed pickup trip through its original handlers.
 * History contains inputs, never inventory or final story states to restore. */
window.PickupReplay=(()=>{
 'use strict';
 const key=STORAGE_KEY+'-pickup-replay-history',version=1,phone=document.querySelector('#phone');
 const slots={1:'afternoonPickup',2:'dayTwoPickup',3:'dayThreePickup',4:'dayFourPickup'};
 const canonical=value=>JSON.stringify(value,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.keys(v).sort().reduce((o,k)=>(o[k]=v[k],o),{}):v);
 const clone=v=>structuredClone(v);
 let session=null,sourcePlans=[],frame=0,pending=null,entryFrame=0;
 const diagnostics=new WeakMap();
 const actionsByPhase={notice:['start'],elevator:['arrive'],door:['open-door'],counter:['input','forgot'],input:['forgot'],order:['counter'],success:['leave'],'record-choice':['record'],record:['publish-record','keep-record'],
  'd2-choice':['d2-invite','d2-solo'],'d2-reply':['d2-reply-0','d2-reply-1','d2-reply-2'],'d2-reassure-choice':['d2-reassure-answer'],'d2-solo-chat':['d2-open-chat','d2-solo-yes'],
  'd2-solo-single':['d2-solo-answer'],'d2-floor':['d2-notebook'],'d2-notebook':['d2-floor-back'],'d2-corridor-choice':['d2-enter-room','d2-other-floor']};
 const dialoguePhases=new Set(['corridor','discovery','d3-depart','d3-return','d2-rule','d2-invite','d2-question','d2-reply-0','d2-reply-1','d2-reply-2','d2-reassure-answer','d2-solo-yes','d2-solo-answer','d2-pull','d2-depart','d2-return','d2-lobby','d2-platform','d2-corridor','d2-other-floor','d2-room-door','d2-own-room','d4-door','d4-scarf','d4-scarf-knit','d4-scarf-thanks','d4-scarf-promise','d4-scarf-go','d4-depart']);
 function history(){try{const h=JSON.parse(GameStorage.getItem(key)||'null');return h?.version===version&&Array.isArray(h.plans)?h.plans:[]}catch{return []}}
 function validStep(step,day){
  if(!step||typeof step.after!=='string'||step.after==='failed')return false;
  if(step.kind==='action')return !!actionsByPhase[step.phase]?.includes(step.value);
  if(step.kind==='dialogue')return dialoguePhases.has(step.phase);
  if(step.kind==='code')return step.phase==='input'&&step.value===({1:'6116',2:'7431',3:'5826',4:'9264'})[day];
  if(step.kind==='floor')return day===2&&step.phase==='d2-floor'&&/^[1235789]$/.test(step.value);
  if(step.kind==='room')return day===2&&step.phase==='d2-room'&&step.value==='4';
  return step.kind==='scarf'&&day===4&&step.phase==='d4-scarf-choice'&&['d4-scarf-knit','d4-scarf-thanks','d4-scarf-promise'].includes(step.value);
 }
 function validPlan(plan){
  if(plan?.version!==version||plan.complete!==true||!slots[plan.day]||typeof plan.context!=='string'||!Array.isArray(plan.steps)||!plan.steps.length||plan.steps.length>500)return false;
  if(!plan.steps.every(s=>validStep(s,plan.day)))return false;
  const first=plan.steps[0],last=plan.steps.at(-1);
  const choiceStart=plan.day===2&&first.phase==='d2-choice'&&first.kind==='action'&&['d2-invite','d2-solo'].includes(first.value);
  if(!choiceStart&&(first.phase!=='notice'||first.kind!=='action'||first.value!=='start'))return false;
  const automatic={opening:'counter',hall:'door','d2-floor-return':'d2-floor','d2-solo-reply-wait':'d2-solo-yes','d2-common':'done','d3-done':'done'};
  const dialogues={corridor:'elevator',discovery:'record-choice','d3-depart':'elevator','d3-return':'d3-done','d2-rule':'d2-choice','d2-invite':'d2-question','d2-question':'d2-reply','d2-reply-0':'d2-reassure-choice','d2-reply-1':'d2-depart','d2-reply-2':'d2-depart','d2-reassure-answer':'d2-depart','d2-solo-yes':'d2-solo-single','d2-solo-answer':'d2-pull','d2-pull':'elevator','d2-depart':'elevator','d2-return':'d2-floor','d2-lobby':'d2-floor-return','d2-platform':'d2-floor-return','d2-corridor':'d2-corridor-choice','d2-other-floor':'d2-floor-return','d2-room-door':'d2-own-room','d2-own-room':'d2-common'};
  const nextAction={start:({1:'corridor',2:'d2-rule',3:'d3-depart',4:'d4-door'})[plan.day],arrive:'hall','open-door':'opening',input:'input',forgot:'order',counter:'counter',leave:({1:'discovery',2:'d2-return',3:'d3-return',4:'d4-return'})[plan.day],record:'record','publish-record':'done','keep-record':'done','d2-invite':'d2-invite','d2-solo':'d2-solo-chat','d2-open-chat':'d2-solo-chat','d2-solo-yes':'d2-solo-reply-wait','d2-reply-0':'d2-reply-0','d2-reply-1':'d2-reply-1','d2-reply-2':'d2-reply-2','d2-reassure-answer':'d2-reassure-answer','d2-solo-answer':'d2-solo-answer','d2-notebook':'d2-notebook','d2-floor-back':'d2-floor','d2-enter-room':'d2-room','d2-other-floor':'d2-other-floor'};
  const reachable=(a,b)=>a===b||automatic[a]===b;
  let phase=first.phase,floor=null,received=false;
  for(const step of plan.steps){
   if(!reachable(phase,step.phase))return false;
   let next;
   if(step.kind==='action')next=nextAction[step.value];
   else if(step.kind==='dialogue')next=dialogues[step.phase]||D4_PICKUP_ROWS[step.phase]?.next;
   else if(step.kind==='code'){if(received)return false;received=true;next='success'}
   else if(step.kind==='floor'){floor=step.value;next=floor==='1'?'d2-lobby':floor==='2'?'d2-platform':'d2-corridor'}
   else if(step.kind==='room'){if(floor!=='8')return false;next='d2-room-door'}
   else if(step.kind==='scarf')next=step.value;
   if(!next||!reachable(next,step.after))return false;
   phase=step.after;
  }
  return received&&(plan.day===4?last.after==='d4-return':reachable(last.after,'done'));
 }
 function remember(plan){
  if(!validPlan(plan))return;
  try{const signature=canonical(plan.steps),plans=history().filter(p=>validPlan(p)&&!(p.context===plan.context&&p.day===plan.day&&canonical(p.steps)===signature));plans.unshift(clone(plan));GameStorage.setItem(key,JSON.stringify({version,plans}))}catch{/* Storage failure never interrupts a pickup. */}
 }
 function routeContext(value){
  try{
   const c=typeof value==='string'?JSON.parse(value):value;
   if(!c||!slots[c.day])return null;
   // Day 2 entry precedes companion selection. The validated replay steps own that choice,
   // including legacy records whose companion field differs or is absent.
   if(c.day===2)return canonical({day:2});
   if(!['alone','choose','linqing'].includes(c.companion))return null;
   // Pickup branches (including Day 2 companion selection) live in the validated steps.
   // Delivery contents and unrelated timeline state never select a replay route.
   return canonical({day:c.day,companion:c.companion});
  }catch{return null}
 }
 function context(q){
  const day=state.game.day;
  return canonical(day===2?{day:2}:{day,companion:day===1?'alone':'linqing'});
 }
 function hasCurrentOrders(){
  // Read-only eligibility check; preparation and receipt remain in the original handlers.
  const date=state.system.date,now=date+' '+state.system.time;
  return deliveryOrders().some(o=>o.deliveryDate===date&&!o.expired&&!o.collectedAt&&
   (o.status==='待领取'||o.status==='待配送'&&now>=date+' 07:30'&&now<date+' 22:00')&&Array.isArray(o.lines)&&o.lines.length>0);
 }
 function diagnostic(q,reason){
  if(!q||typeof q!=='object')return;
  let logged=diagnostics.get(q);if(!logged){logged=new Set();diagnostics.set(q,logged)}
  if(logged.has(reason))return;logged.add(reason);console.debug('[PickupReplay] '+reason);
 }
 function cancelPending(){if(entryFrame)cancelAnimationFrame(entryFrame);entryFrame=0;pending=null}
 function endpoint(s){const q=s.q;return !!q.received&&!q.failed&&(s.day===4?q.phase==='d4-return':q.done&&q.phase==='done'&&(s.day!==2||q.elevatorSolved&&q.roomSelected==='804'))}
 function current(s){return session===s&&state===s.state&&pickup16State()===s.q&&state.game.day===s.day}
 function clearUi(){phone.querySelector('#pickup-replay-modal')?.remove();phone.classList.remove('pickup-replay-running')}
 function reset(){cancelPending();if(frame)cancelAnimationFrame(frame);frame=0;session=null;clearUi()}
 function archive(plan){
  // Attach to checkpoints from this run only; never replace their snapshots.
  try{const records=nodeRecords(),run=state.timeline?.runId||state.story.replayRun||'legacy-initial';let changed=false;
   for(const record of Object.values(records))if(record?.checkpoint&&(record.runId||record.checkpoint.timeline?.runId||'legacy-initial')===run&&(record.checkpoint.timeline?.runId||record.runId||'legacy-initial')===run){
    const rows=record.pickupReplayHistories??=[];const i=rows.findIndex(p=>p.day===plan.day&&p.context===plan.context);if(i>=0)rows[i]=clone(plan);else rows.push(clone(plan));changed=true;
   }
   if(changed)saveNodes(records);
  }catch{/* Independent history remains usable if the node archive is unavailable. */}
 }
 function complete(s){
  if(!current(s)||s.depth||s.finished||!endpoint(s))return;
  if(s.mode==='replay')return;
  s.finished=true;
  const plan={version,day:s.day,context:s.context,steps:clone(s.steps),complete:true};
  if(!s.invalid&&validPlan(plan)){s.q.pickupReplayTrace=plan;remember(plan);archive(plan);persist()}
  session=null;
 }
 function record(kind,value,fn){
  if(!session&&kind==='action'&&['start','d2-invite','d2-solo'].includes(value))begin(pickup16State(),true);
  const s=session;if(!s||!current(s)||s.finished||endpoint(s))return fn();
  if(['prompt','replay'].includes(s.mode)&&!s.executing)return;
  // Personal notebook editing is independent of the trip; never replay an old note over a new one.
  if(kind==='action'&&value==='d2-note-save')return fn();
  const step={phase:s.q.phase,kind,...(value===undefined?{}:{value}),after:''};
  if(s.mode==='watch'){s.steps.push(step);s.depth++;}
  try{return fn()}catch(error){s.invalid=true;throw error}finally{
   if(s.mode==='watch'){step.after=s.q.phase;s.depth--;if(!validStep(step,s.day))s.invalid=true;if(current(s)){complete(s);if(session===s)persist()}}
  }
 }
 function proofs(progress){
  for(const [day,slot]of Object.entries(slots)){
   const q=progress?.story?.[slot],plan=q?.pickupReplayTrace;
   // Legacy completion without the original context/inputs is not sufficient.
   if(!q?.received||q.failed||!validPlan(plan)||plan.day!==Number(day))continue;
   const done=Number(day)===4?['d4-return','d4-wait-choice','d4-wait-ask','d4-wait-agree','d4-wait-return','d4-gift-bag','d4-done','done'].includes(q.phase)||q.phase?.startsWith('d4-meal-'):q.done&&q.phase==='done';
   if(done&&(Number(day)!==2||q.elevatorSolved&&q.roomSelected==='804'))remember(plan);
  }
 }
 function findPlan(s){
  if(!hasCurrentOrders()){diagnostic(s.q,'当前没有待领取订单');return null}
  const target=routeContext(s.context),plans=[...sourcePlans,...history()].filter(p=>validPlan(p)&&p.day===s.day);
  // Source checkpoint wins; otherwise use the most recently completed matching trip.
  const plan=target&&plans.find(p=>routeContext(p.context)===target&&(s.q.phase==='notice'?p.steps[0].phase==='notice':p.steps.some(step=>step.phase===s.q.phase)));
  if(!plan)diagnostic(s.q,plans.length?'线路不匹配':'没有完成记录');
  return plan?clone(plan):null;
 }
 function atEntry(q){return !!q&&!q.done&&(q.phase==='notice'||state.game.day===2&&q.phase==='d2-choice')}
 function begin(q,manual=false){
  if(!atEntry(q)||!slots[state.game.day]){diagnostic(q,'不在取件起点');return}
  if(session?.q===q)return;
  if(window.mobileLaunch||storyRestoring){
   if(!pending||pending.q!==q||pending.state!==state)pending={q,state};
   diagnostic(q,'仍在恢复状态');return;
  }
  if(view!=='afternoon-pickup'){cancelPending();return}
  if(!manual){
   if(!pending||pending.q!==q||pending.state!==state)pending={q,state};
   detectPending();return;
  }
  cancelPending();
  const s={state,q,day:state.game.day,context:context(q),steps:[],mode:'watch',depth:0,executing:false,finished:false,dialogue:null,invalid:false};session=s;
  // A player who already pressed Start must still have their entire trip recorded.
 }
 function detectPending(){
  const task=pending;if(!task||entryFrame)return;
  if(task.state!==state||task.q!==pickup16State()){cancelPending();return}
  if(window.mobileLaunch||storyRestoring){diagnostic(task.q,'仍在恢复状态');return}
  if(view!=='afternoon-pickup'||!atEntry(task.q)){diagnostic(task.q,'不在取件起点');cancelPending();return}
  const button=phone.querySelector(task.q.phase==='d2-choice'?'#pickup16 [data-pickup16="d2-invite"]':'#pickup16 [data-pickup16="start"]');if(!button||button.disabled)return;
  entryFrame=requestAnimationFrame(()=>{entryFrame=requestAnimationFrame(()=>{
   entryFrame=0;if(pending!==task)return;
   if(window.mobileLaunch||storyRestoring)return;
   if(state!==task.state||pickup16State()!==task.q||view!=='afternoon-pickup'||!atEntry(task.q)){cancelPending();return}
   if(!button.isConnected)return;
   begin(task.q,true);
   const s=session;if(!s||s.q!==task.q)return;
   s.plan=findPlan(s);if(s.plan){s.mode='prompt';prompt(s)}
  })});
 }
 function paint(s,fn){
  frame=requestAnimationFrame(()=>{frame=0;if(!current(s))return;frame=requestAnimationFrame(()=>{frame=0;if(current(s))fn()})});
 }
 function progress(s){
  const percent=Math.floor(100*s.index/s.replayLimit),bar=phone.querySelector('#pickup-replay-modal [role="progressbar"]');if(!bar)return;
  bar.setAttribute('aria-valuenow',percent);bar.firstElementChild.style.width=percent+'%';phone.querySelector('#pickup-replay-percent').textContent=percent+'%';
 }
 function fail(s){
  if(!current(s))return;const redraw=s.day===4&&s.q.phase==='d4-return';s.mode='watch';s.invalid=true;s.executing=false;clearUi();
  toast('取件记录不匹配，已恢复正常体验');if(endpoint(s)){session=null;if(redraw)pickup16Render();return}pickup16Render();
 }
 function ready(s,step){
  if(s.q.phase!==step.phase)return false;
  if(step.kind==='dialogue')return !!s.dialogue&&s.dialogue.phase===step.phase;
  if(step.kind==='action'){
   const button=phone.querySelector('[data-pickup16="'+step.value+'"]');return !!button&&!button.disabled;
  }
  return !!phone.querySelector(({code:'#pickup16-code',floor:'#pickup-day2-floor',room:'#pickup-day2-room',scarf:'#pickup16 .cg-options'})[step.kind]);
 }
 function invoke(s,step){
  if(step.kind==='dialogue'){const control=s.dialogue.control;s.dialogue=null;if(!control.skip())throw Error('Dialogue no longer available')}
  else if(step.kind==='action')pickup16Action(step.value);
  else if(step.kind==='code'){s.q.input=step.value;pickup16Collect()}
  else if(step.kind==='floor'){s.q.floor=step.value;pickupDay2FloorSubmit()}
  else if(step.kind==='room'){s.q.roomDigit=step.value;pickupDay2RoomSubmit()}
  else if(step.kind==='scarf')d4ScarfChoose(s.q,step.value);
 }
 function advance(s){paint(s,()=>{
  try{
   if(s.mode!=='replay')return;
   if(s.index===s.replayLimit){
    if(s.day===1?!(s.q.received&&!s.q.failed&&s.q.phase==='record'):!endpoint(s))return fail(s);
    progress(s);s.finished=true;
    paint(s,()=>{const returned=s.day===4;session=null;clearUi();if(returned)pickup16Render()});return;
   }
   const step=s.plan.steps[s.index];
   if(!ready(s,step)){
    // Retain the audited original elevator/door/private-reply timers. No global speed changes.
    if(Date.now()-s.waitSince>15000)return fail(s);
    advance(s);return;
   }
   s.executing=true;try{invoke(s,step)}finally{s.executing=false}
   if(!current(s))return;
   if(s.q.phase!==step.after)return fail(s);
   s.index++;s.waitSince=Date.now();progress(s);advance(s);
  }catch{fail(s)}
 })}
 function prompt(s){
  ReadHistory.stop();closeSheet();const modal=document.createElement('div');modal.id='pickup-replay-modal';modal.className='story-replay-modal';modal.setAttribute('data-read-cg-dialog','');
  modal.innerHTML='<section class="vn-dialogue cg-replay-card" role="dialog" aria-modal="true" tabindex="-1" aria-labelledby="pickup-replay-title"><h2 id="pickup-replay-title">这段取件剧情已经完成过，是否跳过？</h2><p class="replay-description">按上次的选择完成取件，停留在返回宿舍后的原页面。</p><div class="cg-options"><button type="button" data-pickup-skip>跳过取件</button><button type="button" data-pickup-watch>重新体验</button></div></section>';
  if(s.day===1)modal.querySelector('.replay-description').textContent='跳过取件过程，停在取件记录页面，由你决定是否发到群里。';
  phone.append(modal);
  modal.querySelector('[data-pickup-watch]').onclick=()=>{if(!current(s)||s.mode!=='prompt')return;s.mode='watch';clearUi()};
  modal.querySelector('[data-pickup-skip]').onclick=()=>{
   if(!current(s)||s.mode!=='prompt')return;
   if(!hasCurrentOrders()||routeContext(context(s.q))!==routeContext(s.context)||!validPlan(s.plan)){s.mode='watch';s.invalid=true;clearUi();return}
   // Keep the complete historical proof intact; stop before the player's public/private decision.
   s.replayLimit=s.day===1?s.plan.steps.findIndex(step=>step.phase==='record'&&step.kind==='action'&&['publish-record','keep-record'].includes(step.value)):s.plan.steps.length;
   if(s.replayLimit<=0){s.mode='watch';s.invalid=true;clearUi();return}
   s.index=s.plan.steps.findIndex(step=>step.phase===s.q.phase);
   if(s.index<0){s.mode='watch';clearUi();return}
   s.mode='replay';s.waitSince=Date.now();phone.classList.add('pickup-replay-running');
   const card=modal.firstElementChild;card.setAttribute('aria-busy','true');card.querySelector('h2').textContent='正在跳过已完成的取件剧情';card.querySelector('.replay-description').textContent='正在恢复上次的选择……';card.querySelector('.cg-options').remove();
   card.insertAdjacentHTML('beforeend','<div class="cg-replay-progress" role="progressbar" aria-label="取件跳过进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span></span></div><p class="cg-replay-percent" id="pickup-replay-percent">0%</p>');card.focus();advance(s);
  };
  modal.querySelector('[data-pickup-skip]').focus();
 }
 const render=pickup16Render;pickup16Render=function(...args){
  if(session&&!current(session))reset();
  const result=render(...args),q=pickup16State();
  if(session)complete(session);else if(atEntry(q))begin(q);
  return result;
 };
 const present=CGDialogue.present;CGDialogue.present=function(host,rows,options){
  const s=session,phase=pickup16State()?.phase;
  if(!s||!current(s)||host.id!=='pickup16'||endpoint(s))return present(host,rows,options);
  const control=present(host,rows,{...options,onComplete:()=>{if(current(s)&&s.q.phase===phase)record('dialogue',undefined,options.onComplete);else options.onComplete()}});
  if(current(s))s.dialogue={phase,control};return control;
 };
 for(const [name,kind,value]of [
  ['pickup16Action','action',args=>args[0]],['pickup16Collect','code',()=>pickup16State()?.input?.trim()],
  ['pickupDay2FloorSubmit','floor',()=>String(pickup16State()?.floor||'').trim()],['pickupDay2RoomSubmit','room',()=>String(pickup16State()?.roomDigit||'').trim()],['d4ScarfChoose','scarf',args=>args[1]]
 ]){const original=globalThis[name];globalThis[name]=function(...args){return record(kind,value(args),()=>original.apply(this,args))}}
 for(const name of ['pickup16Finish','pickupDay2Complete','startRecordDiscussion']){
  const original=globalThis[name];globalThis[name]=function(...args){const result=original.apply(this,args);if(session)complete(session);return result};
 }
 for(const name of ['playCGCharacterBlip','playInteractionSound','playNotificationSound','cgImageCrossfade','cgScreenCrossfade']){
  const original=globalThis[name];if(typeof original==='function')globalThis[name]=function(...args){if(session?.mode==='replay')return;return original.apply(this,args)};
 }
 const ascent=syncPickupAscentSound;syncPickupAscentSound=function(...args){if(session?.mode==='replay'){stopPickupAscentSound();return}return ascent(...args)};
 for(const type of ['pointerdown','pointerup','click','keydown','input','submit'])window.addEventListener(type,event=>{
  const s=session;if(!s||!current(s)||!['prompt','replay'].includes(s.mode)||s.executing&&!event.isTrusted)return;
  if(s.mode==='prompt'&&event.target.closest('#pickup-replay-modal')&&event.key!=='Escape'){
   if(type==='keydown'&&event.key==='Tab'){const buttons=[...phone.querySelectorAll('#pickup-replay-modal button')],i=buttons.indexOf(document.activeElement);event.preventDefault();buttons[(i+(event.shiftKey?-1:1)+buttons.length)%buttons.length]?.focus()}return;
  }
  event.preventDefault();event.stopImmediatePropagation();
 },true);
 const cleanup=cleanupStoryTimeline;cleanupStoryTimeline=function(...args){reset();return cleanup(...args)};
 const initialize=initializeChapter;initializeChapter=function(...args){reset();sourcePlans=[];return initialize(...args)};
 const resume=resumeGameSnapshot;resumeGameSnapshot=function(snapshot,options={}){
  proofs(state);const previous=sourcePlans;reset();sourcePlans=clone(options.record?.pickupReplayHistories||[]);
  try{const result=resume(snapshot,options);if(result===false)sourcePlans=previous;else if(atEntry(pickup16State())){
    // A render during restoration must not consume the checkpoint entry check.
    if(options.sourceNodeId==='day1-before-pickup'&&session?.mode==='watch'&&!session.steps.length)reset();
    begin(pickup16State());
   }return result}catch(error){sourcePlans=previous;throw error}
 };
 for(const k of [STORAGE_KEY,STORAGE_KEY+'-continue'])try{proofs(JSON.parse(GameStorage.getItem(k)||'null'))}catch{}
 try{const records=JSON.parse(ChoiceNodeStorage.unpack(GameStorage.getItem(STORAGE_KEY+'-choice-nodes')));for(const r of Object.values(records||{})){proofs(r?.checkpoint);for(const plan of r?.pickupReplayHistories||[])remember(plan)}}catch{}
 window.addEventListener('pagehide',reset);
 window.addEventListener('storage',event=>{if(event.key===key||event.key===null){reset();sourcePlans=[]}});
 window.addEventListener('error',()=>{if(session?.mode==='replay')fail(session)});
 // Launch restoration may finish after the scene's first render.
 mobileNativeInterval(()=>{
  if(session&&!current(session))reset();
  if(pending)detectPending();
  else if(!session&&view==='afternoon-pickup')begin(pickup16State());
 },100);
 return {get running(){return session?.mode==='replay'}};
})();
