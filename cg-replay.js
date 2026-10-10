/* Complete CG plans survive rewinds; source-node plans take priority.
 * Only the audited segments below can drive their original handlers. */
window.CgReplay=(()=>{
 'use strict';
 const version=1,phone=document.querySelector('#phone');
 let session=null,generation=0,sourceHistories={};
 const clone=value=>structuredClone(value);
 const pick=(object,keys)=>Object.fromEntries(keys.filter(k=>object?.[k]!==undefined).map(k=>[k,object[k]]));
 const histories=()=>((state.story.cgReplay??={version,histories:{}}).histories??={});
 const defKeys=['cgChoice','secretChoice','reassure'];
 const scarfChoices=['d4-scarf-knit','d4-scarf-thanks','d4-scarf-promise'];
 const foodChoiceKeys=['d4-meal-reply','d4-meal-flirt','d4-meal-money'];
 const foodPhases=new Set(['d4-return','d4-wait-choice','d4-wait-ask','d4-wait-agree','d4-wait-return','d4-gift-bag','d4-meal-reveal','d4-meal-reply','d4-meal-remember','d4-meal-rely','d4-meal-flirt','d4-meal-flirt-why','d4-meal-flirt-insist','d4-meal-eat','d4-meal-money','d4-meal-money-why','d4-meal-money-identity','d4-meal-invite']);
 const memoryPhase=p=>/^d4-meal-memory-p[1-8]$/.test(p)||['d4-meal-memory-response','d4-meal-memory-sorry','d4-meal-memory-stay','d4-meal-memory-share'].includes(p);
 const choice=(key,options,invoke)=>({key,options,invoke});
 const rows=(definition,key,invoke)=>!definition?null:definition.choices?choice(key,definition.choices.map((c,i)=>({value:i,next:c[1]})),invoke):{next:definition.next};
 const defs={
  noodles:{render:'noodleRender',view:'noodle-cg',owner:(p=state)=>p.story.noodleEvening,
   inside:q=>!!q&&!['transition','done'].includes(q.phase),done:q=>q.phase==='done',phase:q=>q.phase,
   start:q=>q.route==='no-water'?'noWaterIntro':'intro',end:'done',context:q=>[q.route,!!q.lied],choices:q=>q.choices||{},
   step:(q,key,p=state)=>rows(noodleScript(key,p),key,value=>noodleChoose(value))},
  knitting:{render:'d2CGRender',view:'day2-midday-cg',owner:(p=state)=>p.story.dayTwoFreeAction?.cg,
   inside:q=>!!q&&!q.done,done:q=>!!q.done,phase:q=>q.script,start:()=> 'intro',end:'finish',context:()=>[],choices:q=>q.decisions||{},
   step:(q,key)=>rows(D2_CG[key],key,value=>d2CGChoose(value,key))},
  foodVisit:{render:'d2VisitRender',view:'day2-visit-cg',owner:(p=state)=>p.story.dayTwoVisit,
   inside:q=>!!q&&!q.done,done:q=>!!q.done,phase:q=>q.scene,start:()=> 'door408',end:'done',context:q=>[!!q.jiangAlive],choices:()=>({}),
   step:(q,key,p=state)=>{const d=d2VisitScript(key,p);return d?{next:d.next}:null}},
  scarfGift:{render:'pickup16Render',view:'afternoon-pickup',owner:(p=state)=>p.story.dayFourPickup,
   inside:q=>state.game.day===4&&!!q&&!q.done&&q.phase.startsWith('d4-scarf'),done:q=>q.phase==='d4-depart',phase:q=>q.phase,start:()=> 'd4-scarf',end:'d4-depart',context:()=>[],choices:q=>pick(q,['scarfChoice']),
   step:(q,key)=>key==='d4-scarf-choice'?choice('scarfChoice',scarfChoices.map(value=>({value,next:value})),value=>d4ScarfChoose(q,value)):D4_PICKUP_ROWS[key]?{next:D4_PICKUP_ROWS[key].next}:null},
  favoriteFood:{render:'pickup16Render',view:'afternoon-pickup',owner:(p=state)=>p.story.dayFourPickup,
   inside:q=>state.game.day===4&&!!q&&!q.done&&foodPhases.has(q.phase),done:q=>q.phase==='d4-meal-memory',phase:q=>q.phase,start:()=> 'd4-return',end:'d4-meal-memory',
   context:(q,p=state)=>[p.profile?.favoriteFood],eligible:(p=state)=>!!D4_MEAL_IMAGES[p.profile?.favoriteFood],choices:q=>({...pick(q,['returnChoice']),...pick(q.mealChoices,foodChoiceKeys)}),
   step:(q,key)=>{
    if(key==='d4-wait-choice')return choice('returnChoice',[{value:0,next:'d4-wait-ask'},{value:1,next:'d4-wait-agree'}],value=>d4ReturnChoose(q,value));
    const c=D4_MEAL_CHOICES[key];if(c)return choice(key,c.options.map((o,i)=>({value:i,next:o[1]})),value=>d4MealSelect(q,key,value));
    const d=D4_PICKUP_ROWS[key]||d4MealRows(key);return d?{next:d.next}:null;
   }},
  linMemory:{render:'pickup16Render',view:'afternoon-pickup',owner:(p=state)=>p.story.dayFourPickup,
   inside:q=>state.game.day===4&&!!q&&!q.done&&memoryPhase(q.phase),done:q=>q.phase==='d4-meal-memory-merge',phase:q=>q.phase,start:()=> 'd4-meal-memory-p1',end:'d4-meal-memory-merge',
   context:(q,p=state)=>[p.profile?.favoriteFood],eligible:(p=state)=>!!D4_MEAL_IMAGES[p.profile?.favoriteFood],choices:q=>pick(q.mealChoices,['d4-meal-memory-response']),
   step:(q,key)=>{const c=D4_MEAL_CHOICES[key];if(c)return choice(key,c.options.map((o,i)=>({value:i,next:o[1]})),value=>d4MealSelect(q,key,value));const d=d4MealRows(key);return d?{next:d.next}:null}},
  fever:{render:'d3FeverRender',view:'day3-fever-cg',owner:(p=state)=>p.story.dayThreeFever,
   inside:q=>!!q&&q.phase!=='done',done:q=>q.phase==='done',phase:q=>['black','free'].includes(q.phase)?q.phase:q.script,
   start:()=> 'intro',end:'done',context:(q,p=state)=>[d3FeverHasDoorRecord(p)],choices:q=>q.decisions||{},
   step:(q,key,p=state)=>{
    if(key==='black'||key==='free')return {next:key==='black'?'wake':'done',advance:()=>d3FeverTimedContinue()};
    const c=d3FeverChoices(key,p);if(c.length)return choice(key,c.map(o=>({value:o.id,next:key==='outsideChoice'?'heard':o.next})),value=>d3FeverChoose(key,value));
    const d=d3FeverScript(key,p);return d?{next:d.next}:null;
   }},
  identity:{render:'d3DefenseCGRender',view:'day3-lin-defense-cg',owner:(p=state)=>p.story.dayThreeLinDefense,
   inside:q=>!!q&&['cg','cg-choice','cg-hold'].includes(q.phase),done:q=>q.phase==='done',phase:q=>q.phase==='cg-hold'?'reflection-hold':q.cgScript,
   start:()=> 'intro',end:'done',context:(q,p=state)=>[d3DefenseKnowsIdentity(p)],choices:q=>pick(q.decisions,defKeys),
   step:(q,key,p=state)=>{
    if(key==='reflection-hold')return {next:'done',advance:()=>d3DefenseLeaveReflection()};
    if(defKeys.includes(key))return choice(key,d3DefenseChoices(key,p).map(o=>({value:o.id,next:o.next})),value=>d3DefenseChoose(key,value));
    const d=d3DefenseCGScript(key,p);return d?{next:key==='reflection'?'reflection-hold':d.next}:null;
   }}
 };
 function current(render){
  for(const [id,d]of Object.entries(defs)){if(render&&d.render!==render)continue;const q=d.owner();if(d.inside(q))return {id,d,q}}
  return null;
 }
 function compatible(s,plan,completed=false){
  if(!plan||plan.segmentId&&plan.segmentId!==s.id||plan.version!==version||plan.complete!==true||plan.context!==s.context||!plan.choices||Array.isArray(plan.choices)||typeof plan.choices!=='object'||s.d.eligible&&!s.d.eligible(s.state))return false;
  // Prove the entire recorded path and the current prefix before applying any choice.
  for(const [key,value]of Object.entries(s.d.choices(s.q)))if(plan.choices[key]!==value)return false;
  let phase=s.d.start(s.q),atCurrent=phase===s.d.phase(s.q);const visited=new Set();
  while(phase!==s.d.end&&visited.size<160){
   if(visited.has(phase))return false;visited.add(phase);
   const step=s.d.step(s.q,phase,s.state);if(!step)return false;
   if(step.key){const selected=step.options.find(o=>o.value===plan.choices[step.key]);if(!selected||!selected.next)return false;phase=selected.next}
   else phase=step.next;
   if(!phase)return false;if(phase===s.d.phase(s.q))atCurrent=true;
  }
  return phase===s.d.end&&(atCurrent||s.d.done(s.q)||completed);
 }
 function archive(id,plan){
  // Only checkpoints actually reached in THIS run receive its history.
  // A selected older node keeps its own history, even after another route finishes.
  const runId=state.timeline?.runId||state.story.replayRun||'legacy-initial';
  const records=nodeRecords();let changed=false;
  for(const record of Object.values(records)){
   if(!record?.checkpoint||(record.runId||record.checkpoint.timeline?.runId||'legacy-initial')!==runId||(record.checkpoint.timeline?.runId||record.runId||'legacy-initial')!==runId)continue;
   (record.cgReplayHistories??={})[id]=plan?clone(plan):null;changed=true;
  }
  if(changed)saveNodes(records);
 }
 // This key is never included in a story snapshot or a node restore.
 const historyKey=STORAGE_KEY+'-cg-replay-history',migrationVersion=2;
 const safely=fn=>{try{return fn()}catch{return null}};
 let completedHistory=safely(()=>JSON.parse(GameStorage.getItem(historyKey)||'null'));
 if(!completedHistory||completedHistory.version!==version||!completedHistory.plans||Array.isArray(completedHistory.plans)||typeof completedHistory.plans!=='object')completedHistory={version,migrationVersion:0,plans:{}};
 const migrateFoodOnly=completedHistory.migrationVersion===1;
 function foodEffects(id,choices){
  if(id==='favoriteFood'&&[0,1].includes(choices['d4-meal-reply']))return {linqingAffection:choices['d4-meal-reply']===1?20:0};
  if(id==='linMemory'&&[0,1,2].includes(choices['d4-meal-memory-response']))return {linqingAffection:choices['d4-meal-memory-response']>0?5:0};
  return null;
 }
 // Old complete meal plans included the recollection. Split only explicit choices;
 // seeing the food segment alone is never evidence of seeing Lin's recollection.
 function memoryFromFood(plan){
  if(plan?.complete!==true||plan.choices?.['d4-meal-memory']!==0||!Number.isInteger(plan.choices?.['d4-meal-memory-response']))return null;
  return {...plan,segmentId:'linMemory',choices:pick(plan.choices,['d4-meal-memory-response'])};
 }
 function normalizedPlan(id,plan){
  if(!Object.prototype.hasOwnProperty.call(defs,id)||!plan||plan.version!==version||plan.complete!==true||plan.segmentId&&plan.segmentId!==id||typeof plan.context!=='string'||!plan.choices||Array.isArray(plan.choices)||typeof plan.choices!=='object')return null;
  if(Object.values(plan.choices).some(value=>typeof value!=='string'&&!Number.isInteger(value)))return null;
  const choices=clone(id==='favoriteFood'?pick(plan.choices,['returnChoice',...foodChoiceKeys]):id==='linMemory'?pick(plan.choices,['d4-meal-memory-response']):plan.choices),effects=foodEffects(id,choices);
  return {version,segmentId:id,complete:true,context:plan.context,choices,...(effects?{effects}:{}),completedAt:Number.isFinite(plan.completedAt)?plan.completedAt:0};
 }
 function saveCompleted(){safely(()=>GameStorage.setItem(historyKey,JSON.stringify(completedHistory)))}
 function rememberCompleted(id,plan,save=true){
  const clean=normalizedPlan(id,plan);if(!clean)return;
  const entries=Array.isArray(completedHistory.plans[id])?completedHistory.plans[id]:[];
  const signature=p=>JSON.stringify(Object.entries(p.choices).sort(([a],[b])=>a.localeCompare(b)));
  completedHistory.plans[id]=[clean,...entries.filter(p=>normalizedPlan(id,p)&&(p.context!==clean.context||signature(p)!==signature(clean)))];
  if(save)saveCompleted();
 }
 function findPlan(s){
  const globals=Array.isArray(completedHistory.plans[s.id])?completedHistory.plans[s.id]:[];
  const local=state.story.cgReplay?.histories||{};
  const candidates=[sourceHistories,local,state.story.cgReplayHistories,state.cgReplayHistories].flatMap(h=>[h?.[s.id],s.id==='linMemory'?memoryFromFood(h?.favoriteFood):null]);
  const oldMemory=s.id==='linMemory'&&Array.isArray(completedHistory.plans.favoriteFood)?completedHistory.plans.favoriteFood.map(memoryFromFood):[];
  for(const candidate of [...candidates,...globals,...oldMemory]){
   const plan=normalizedPlan(s.id,candidate);
   if(plan&&safely(()=>compatible(s,plan)))return plan;
  }
  return null;
 }
 function completedSegment(id,q){
  if(!q)return false;
  if(id==='favoriteFood')return q.phase==='d4-meal-memory'||memoryPhase(q.phase)||['d4-meal-memory-merge','d4-meal-taste-ask','d4-meal-taste','d4-meal-taste-good','d4-meal-taste-you','d4-meal-emotion','d4-done','done'].includes(q.phase);
  if(id==='linMemory')return q.mealChoices?.['d4-meal-memory']===0&&['d4-meal-memory-merge','d4-meal-taste-ask','d4-meal-taste','d4-meal-taste-good','d4-meal-taste-you','d4-meal-emotion','d4-done','done'].includes(q.phase);
  if(id==='scarfGift')return ['d4-depart','elevator','hall','door','opening','counter','input','order','success','d4-return','d4-wait-choice','d4-wait-ask','d4-wait-agree','d4-gift-bag','d4-done'].includes(q.phase)||typeof q.phase==='string'&&q.phase.startsWith('d4-meal-');
  return defs[id].done(q);
 }
 function migrateProgress(progress,attached){
  if(!progress?.story||!progress.game)return;
  for(const records of [progress.cgReplayHistories,progress.story.cgReplayHistories,progress.story.cgReplay?.histories,attached]){
   for(const [id,plan]of Object.entries(records||{}))safely(()=>{if(migrateFoodOnly&&!['favoriteFood','linMemory'].includes(id))return;if(id==='favoriteFood')rememberCompleted('linMemory',memoryFromFood(plan),false);rememberCompleted(id,plan,false)});
  }
  for(const [id,d]of Object.entries(defs))safely(()=>{
   if(migrateFoodOnly&&!['favoriteFood','linMemory'].includes(id))return;
   const q=d.owner(progress);if(!completedSegment(id,q))return;
   // Missing route facts or choices are not evidence of a completed choice path.
   if(id==='noodles'&&(!['water','no-water'].includes(q.route)||typeof q.lied!=='boolean'))return;
   if(id==='foodVisit'&&typeof q.jiangAlive!=='boolean')return;
   if(['favoriteFood','linMemory'].includes(id)&&!d.eligible(progress))return;
   const context=JSON.stringify(d.context(q,progress)),plan={version,segmentId:id,complete:true,context,choices:clone(d.choices(q))};
   if(compatible({id,d,q,state:progress,context},plan,true))rememberCompleted(id,plan,false);
  });
 }
 if(completedHistory.migrationVersion!==migrationVersion){
  for(const plan of (Array.isArray(completedHistory.plans.favoriteFood)?[...completedHistory.plans.favoriteFood]:[]))safely(()=>rememberCompleted('linMemory',memoryFromFood(plan),false));
  // Raw reads only: no normalization, current-state substitution or save rewriting.
  safely(()=>{
   const records=JSON.parse(ChoiceNodeStorage.unpack(GameStorage.getItem(STORAGE_KEY+'-choice-nodes')));
   for(const record of Object.values(records||{}).sort((a,b)=>(a?.reachedAt||0)-(b?.reachedAt||0)))safely(()=>migrateProgress(record?.checkpoint,record?.cgReplayHistories));
  });
  for(const key of [STORAGE_KEY+'-continue',STORAGE_KEY])safely(()=>migrateProgress(JSON.parse(GameStorage.getItem(key)||'null')));
  completedHistory.migrationVersion=migrationVersion;saveCompleted();
 }
 window.addEventListener('storage',event=>{
  if(event.key!==historyKey&&event.key!==null)return;
  reset();sourceHistories={};
  const saved=safely(()=>JSON.parse(GameStorage.getItem(historyKey)||'null'));
  completedHistory=saved?.version===version&&saved.plans?saved:{version,migrationVersion,plans:{}};
 });
 function clearUi(){
  phone.classList.remove('cg-replay-running','read-cg-prompt');
  phone.querySelector('#cg-replay-modal')?.remove();
 }
 function cancelFrames(s){if(!s)return;for(const id of s.frames||[])cancelAnimationFrame(id);s.frames?.clear();s.scheduled=false}
 function reset(){cancelFrames(session);generation++;session=null;clearUi()}
 function afterPaint(s,callback){
  const token=generation;s.frames??=new Set();
  const frame=fn=>{const id=requestAnimationFrame(()=>{s.frames.delete(id);if(token===generation&&session===s&&state===s.state)fn()});s.frames.add(id)};
  // Two frames guarantee the updated progress was painted before the next phase.
  frame(()=>frame(callback));
 }
 function remainingPath(s){
  if(JSON.stringify(s.d.context(s.q))!==s.context||!compatible(s,s.plan))return null;
  let phase=s.d.phase(s.q);const result=[],seen=new Set();
  while(phase!==s.d.end&&result.length<160){
   if(!phase||seen.has(phase))return null;seen.add(phase);
   const step=s.d.step(s.q,phase);if(!step)return null;
   const value=step.key?s.plan.choices[step.key]:undefined;
   const next=step.key?step.options.find(o=>o.value===value)?.next:step.next;
   if(!next)return null;result.push({phase,key:step.key,value,next});phase=next;
  }
  return phase===s.d.end&&result.length?result:null;
 }
 function updateProgress(s){
  const value=Math.min(100,Math.floor(100*s.completed/s.path.length));
  s.percent=Math.max(s.percent||0,value);
  const dialog=phone.querySelector('[data-cg-replay-dialog]');if(!dialog)return;
  dialog.querySelector('[data-cg-replay-progress]')?.setAttribute('aria-valuenow',String(s.percent));
  const fill=dialog.querySelector('[data-cg-replay-fill]');if(fill)fill.style.width=s.percent+'%';
  const label=dialog.querySelector('[data-cg-replay-percent]');if(label)label.textContent=s.percent+'%';
 }
 function finish(s){
  if(session!==s||state!==s.state||!s.d.done(s.q))return false;
  // Nested render/end wrappers must not close the UI before the invoking step returns.
  if(s.mode==='replay'&&(s.advancing||s.finishing))return true;
  if(s.mode==='replay'&&s.completed!==s.path.length){fail(s);return true}
  const plan=normalizedPlan(s.id,{version,segmentId:s.id,complete:true,context:s.context,choices:clone(s.d.choices(s.q)),completedAt:Date.now()});
  if(s.observed&&compatible(s,plan)){
   histories()[s.id]=plan;sourceHistories[s.id]=clone(plan);rememberCompleted(s.id,plan);archive(s.id,plan);persist();
  }
  if(s.mode==='replay'){
   s.finishing=true;cancelFrames(s);updateProgress(s);
   afterPaint(s,()=>{const render=s.deferredRender;session=null;generation++;clearUi();if(render)render()});
  }else{session=null;generation++;clearUi()}
  return true;
 }
 function invalidate(s){
  delete histories()[s.id];sourceHistories[s.id]=null;archive(s.id,null);persist();
 }
 function fail(s){
  if(session!==s||state!==s.state)return;
  cancelFrames(s);generation++;s.mode='watch';s.advancing=false;s.finishing=false;s.dialogue=null;clearUi();
  // Keep every already-applied effect; resume the original renderer at its real cursor.
  const render=s.deferredRender;delete s.deferredRender;
  if(s.d.done(s.q)){finish(s);if(render)render();return}
  globalThis[s.d.render]();
 }
 function schedule(s){
  if(session!==s||s.mode!=='replay'||s.scheduled||s.advancing||s.finishing)return;s.scheduled=true;
  afterPaint(s,()=>{
   s.scheduled=false;
   try{
    if(finish(s))return;
    const expected=s.path[s.completed];
    if(!expected||!s.d.inside(s.q)||s.d.phase(s.q)!==expected.phase||JSON.stringify(s.d.context(s.q))!==s.context||!compatible(s,s.plan))return fail(s);
    const step=s.d.step(s.q,expected.phase);if(!step)return fail(s);
    s.advancing=true;
    if(step.key){
     const option=step.options.find(o=>o.value===s.plan.choices[step.key]);
     if(step.key!==expected.key||!option||option.next!==expected.next)return fail(s);
     step.invoke(option.value);
    }else if(step.advance){step.advance()}
    else if(s.dialogue){const dialogue=s.dialogue;s.dialogue=null;if(!dialogue.skip())return fail(s)}
    else return fail(s);
    s.advancing=false;
    if(session!==s||state!==s.state)return;
    const done=s.d.done(s.q);
    if(done?expected.next!==s.d.end:s.d.phase(s.q)!==expected.next)return fail(s);
    s.completed++;updateProgress(s);
    if(!finish(s))schedule(s);
   }catch{fail(s)}
  });
 }
 function prompt(s){
  clearInterval(cgTypingTimer);ReadHistory.stop();closeSheet();view=s.d.view;active=null;
  phone.querySelector('#cg-replay-modal')?.remove();
  const backdrop=document.createElement('div');backdrop.id='cg-replay-modal';backdrop.className='story-replay-modal';backdrop.setAttribute('data-read-cg-dialog','');
  backdrop.innerHTML='<section class="vn-dialogue cg-replay-card" data-cg-replay-dialog role="dialog" aria-modal="true" aria-labelledby="cg-replay-title" aria-describedby="cg-replay-description" tabindex="-1"><h2 id="cg-replay-title">这段画面已经看过</h2><p id="cg-replay-description" class="replay-description">是否按照上次的选择跳过？</p><div class="cg-options"><button type="button" data-cg-replay-skip>跳过</button><button type="button" data-cg-replay-watch>继续观看</button></div></section>';
  phone.append(backdrop);phone.classList.add('read-cg-prompt');
  const dialog=backdrop.querySelector('[data-cg-replay-dialog]');
  const decide=replay=>{
   if(session!==s||state!==s.state||s.mode!=='prompt')return;
   if(!replay){s.mode='watch';clearUi();invalidate(s);globalThis[s.d.render]();return}
   try{
    const path=remainingPath(s);if(!path)return fail(s);
    s.path=path;s.completed=0;s.percent=0;s.mode='replay';phone.classList.add('cg-replay-running');
    dialog.setAttribute('aria-busy','true');dialog.querySelector('#cg-replay-title').textContent='正在跳过已读剧情';
    dialog.querySelector('#cg-replay-description').textContent='正在恢复上次的选择……';
    dialog.querySelector('.cg-options').remove();
    dialog.insertAdjacentHTML('beforeend','<div class="cg-replay-progress" data-cg-replay-progress role="progressbar" aria-label="已读剧情跳过进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span data-cg-replay-fill></span></div><p class="cg-replay-percent" data-cg-replay-percent>0%</p>');
    dialog.focus();
    afterPaint(s,()=>{try{globalThis[s.d.render]()}catch{fail(s)}});
   }catch{fail(s)}
  };
  dialog.querySelector('[data-cg-replay-skip]').onclick=e=>{e.preventDefault();e.stopPropagation();decide(true)};
  dialog.querySelector('[data-cg-replay-watch]').onclick=e=>{e.preventDefault();e.stopPropagation();decide(false)};
  dialog.querySelector('[data-cg-replay-skip]').focus();
 }
 // Keep navigation and background clicks locked; original programmatic reply handlers
 // remain callable only inside the single active replay step.
 for(const type of ['pointerdown','pointerup','click','keydown'])window.addEventListener(type,event=>{
  const s=session;if(!s||!['prompt','replay'].includes(s.mode))return;
  if(s.advancing&&!event.isTrusted)return;
  const dialog=phone.querySelector('[data-cg-replay-dialog]');
  if(s.mode==='prompt'&&dialog?.contains(event.target)&&event.key!=='Escape'){
   if(type==='keydown'&&event.key==='Tab'){
    const buttons=[...dialog.querySelectorAll('button')],index=buttons.indexOf(document.activeElement);
    event.preventDefault();buttons[(index+(event.shiftKey?-1:1)+buttons.length)%buttons.length]?.focus();
   }
   return;
  }
  event.preventDefault();event.stopImmediatePropagation();
 },true);
 for(const name of new Set(Object.values(defs).map(d=>d.render))){
  const base=globalThis[name];globalThis[name]=function(...args){
   if(name==='pickup16Render'&&window.PickupReplay?.running)return base(...args);
   if(session&&state!==session.state)reset();
   if(session?.mode==='replay'&&session.d.done(session.q)){session.deferredRender=()=>globalThis[name](...args);return}
   if(session)finish(session);
   const found=current(name);
   if(!found||window.mobileLaunch)return base(...args);
   if(session&&(session.id!==found.id||session.q!==found.q)){reset()}
   if(!session){
    const {id,d,q}=found;suspendSpeed();
    const s={id,d,q,state,context:JSON.stringify(d.context(q)),mode:'watch',observed:false,dialogue:null,scheduled:false};session=s;
    const plan=findPlan(s);
    if(plan){s.plan=clone(plan);s.mode='prompt';prompt(s);return}
    if(histories()[id])invalidate(s);
   }
   const s=session;
   // A legacy player may explicitly supply a missing food preference mid-scene.
   // Keep watching, but record that actual preference when this segment completes.
   if(s.id==='favoriteFood'&&s.mode==='watch'&&s.d.eligible(s.state))s.context=JSON.stringify(s.d.context(s.q));
   if(s.mode==='prompt'){if(!document.querySelector('[data-cg-replay-dialog]'))prompt(s);return}
   s.dialogue=null;
   const result=base(...args);
   if(session===s){
    s.observed=true;
    const image=s.d.render==='pickup16Render'?document.querySelector('#pickup16 img'):screen.querySelector('.rd-cg>img');
    ReadHistory.cgShown('segment:'+s.id,image,()=>state===s.state&&s.d.owner()===s.q);
    if(!finish(s))schedule(s);
   }
   return result;
  };
 }
 function suspendSpeed(){ReadHistory.stop()}
 const present=CGDialogue.present;
 CGDialogue.present=function(host,rows,options){const control=present(host,rows,options);if(session&&state===session.state&&session.d.inside(session.q)){session.dialogue=control}return control};
 // End functions retain every original effect, clock and continuation.
 for(const name of ['noodleFinish','d2CGNext','d2VisitNext','pickup16Set','d3FeverFinish','d3DefenseCGNext']){
  const base=globalThis[name];globalThis[name]=function(...args){const s=session;const result=base(...args);if(s&&session===s){if(!finish(s))schedule(s)}return result};
 }
 const cleanup=cleanupStoryTimeline;cleanupStoryTimeline=function(...args){reset();return cleanup(...args)};
 const initialize=initializeChapter;initializeChapter=function(...args){reset();sourceHistories={};return initialize(...args)};
 const resume=resumeGameSnapshot;
 resumeGameSnapshot=function(snapshot,options={}){
  const previous=sourceHistories;
  sourceHistories=clone(options.sourceNodeId?options.record?.cgReplayHistories||{}:{});
  try{const result=resume(snapshot,options);if(result===false)sourceHistories=previous;return result}
  catch(error){sourceHistories=previous;throw error}
 };
 // Skip only the presentation of these scenes; ordinary audio/transitions are untouched.
 for(const name of ['playCGCharacterBlip','playInteractionSound','cgImageCrossfade','cgScreenCrossfade','zeroDissolve']){
  const base=globalThis[name];if(typeof base!=='function')continue;
  globalThis[name]=function(...args){if(session?.mode==='replay')return;return base(...args)};
 }
 const descent=syncVisitDescentSound;syncVisitDescentSound=function(...args){if(session?.mode==='replay'){stopVisitDescentSound();return}return descent(...args)};
 window.addEventListener('pagehide',reset);
 return {get running(){return session?.mode==='replay'},get paused(){return session?.mode==='prompt'||session?.mode==='replay'&&!session.advancing}};
})();
