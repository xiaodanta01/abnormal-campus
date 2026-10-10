/* Completion-only history. Never restore story values from this independent store.
 * Adapters press the existing controls; only the original validators settle effects.
 */
const ReasoningReplay=(()=>{
 const key=STORAGE_KEY+'-reasoning-history',phone=document.querySelector('#phone');
 let session=null,pending=null,restoreEvidence=[];
 const canonical=value=>JSON.stringify(value,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.keys(v).sort().reduce((a,k)=>(a[k]=v[k],a),{}):v);
 function history(){try{const data=JSON.parse(GameStorage.getItem(key)||'null');return data?.version===1&&Array.isArray(data.records)?data.records:[]}catch{return []}}
 function route(progress=state){return {departed:Object.keys(progress.game.departedNpcs||{}).filter(id=>progress.game.departedNpcs[id]).sort(),identity:progress.game.identity??null,role:progress.game.role??null}}
 function click(selector){const el=document.querySelector(selector);if(!el||el.disabled||el.hidden)throw Error('Reasoning control unavailable');el.click()}
 function button(selector){return ()=>click(selector)}
 function input(selector,value){return ()=>{const el=document.querySelector(selector);if(!el)throw Error('Reasoning input unavailable');el.value=value;el.dispatchEvent(new Event('input',{bubbles:true}))}}
 const pairings=[[['hanlu','shen'],['zhengning','hean']],[['hanlu','zhengning'],['shen','hean']],[['hanlu','hean'],['shen','zhengning']]];
 const signature=pairs=>pairs.map(p=>p.slice().sort().join('+')).sort().join('|');
 function floorSteps(q){
  if(d3ReasoningEvidenceGap())return null;
  const steps=[],add=f=>steps.push(f),next=()=>d3ReasoningValidate();
  if(q.step===0){
   if(!q.premisePending){
    for(const id of q.clues.filter(id=>!['roster','elevator'].includes(id)))add(button('[data-reason-clue="'+id+'"]'));
    for(const id of ['roster','elevator'])if(!q.clues.includes(id))add(button('[data-reason-clue="'+id+'"]'));
    add(next);
   }
   add(()=>d3ReasoningPremise('same-floor'));
  }
  if(q.step<=1){
   const attempts=q.fiveAttempts;
   if(!Array.isArray(attempts)||attempts.some(s=>!pairings.some(p=>signature(p)===s))||new Set(attempts).size!==attempts.length)return null;
   for(const pairs of pairings.filter(p=>!attempts.includes(signature(p)))){
    add(button('[data-reason-reset]'));
    for(const id of pairs.flat())add(()=>d3ReasoningPair(id));
    add(next);
   }
   add(next);
  }
  if(q.step<=2){
   // Clicking a fresh pair through the original handler replaces a partial pair.
   add(()=>{const r=d3Reasoning();for(const pair of r.fourPairs.slice())d3ReasoningPair(pair[0]);if(r.pending)d3ReasoningPair(r.pending)});
   for(const id of ['songyan','jiangning'])add(()=>d3ReasoningPair(id));
   add(next);
  }
  if(q.step<=3){
   for(const [field,value] of Object.entries({target:'jiangning',identity:'ordinary',ask:'jiangning',record:'logistics'})){
    add(()=>d3ReasoningChooseSlot(field));add(button('[data-reason-field="'+field+'"][data-reason-fill="'+value+'"]'));
   }
   add(next);
  }
  add(next);return steps;
 }
 function testimonySteps(q){
  const steps=[],add=f=>steps.push(f),next=()=>d4ReasonValidate();
  for(let step=q.step;step<=5;step++){
   if(step===q.step&&q.result){add(next);continue}
   if(step===0||step===2){
    add(()=>{const r=d4Reason();if(r.pending)d4ReasonPair(r.pending)});
    for(const id of step===0?['hean','hanlu']:['shen','zhengning'])add(()=>d4ReasonPair(id));
   }
   if(step===1)add(button('[data-d4-pick="quote"][data-value="2"]'));
   if(step===3)for(const [field,value] of [['evidence','factions'],['identity','same']])add(button('[data-d4-pick="'+field+'"][data-value="'+value+'"]'));
   if(step===4)for(const [field,value] of [['claim','delegate'],['evidence','same']])add(button('[data-d4-pick="'+field+'"][data-value="'+value+'"]'));
   if(step===5)for(const [i,word] of ['韩露','楼层混乱','许蓁蓁','同一阵营','学生会'].entries()){
    add(button('[data-d4-slot="'+i+'"]'));add(button('[data-d4-word="'+D4_REASON_WORDS.indexOf(word)+'"][data-slot="'+i+'"]'));
   }
   if(step!==1)add(next); // Selecting the quotation already calls validation.
   if(step<5)add(next);
  }
  return steps;
 }
 function voteSteps(q){
  const steps=[],add=f=>steps.push(f),next=()=>d4VoteReasonNext();
  for(let step=q.step;step<=5;step++){
   if(step===q.step&&q.result){add(next);if(step<5)continue}
   else if(step===0){
    for(let id=0,n=q.crossed.length;id<13&&n<3;id++)if(!q.crossed.includes(id)){add(button('[data-vr-person="'+id+'"]'));n++}
    add(button('[data-vr-key="count"][data-vr-answer="1"]'));
   }else if(step===1){
    const delegate=q.delegate??0;add(()=>d4VoteAssign('delegate',delegate));
    for(let id=0;id<10;id++)if(id!==delegate)add(()=>d4VoteAssign('support',id));
   }else if(step===2)add(input('[data-vr-range="slider"]',9));
   else if(step===3)add(button('[data-vr-key="stable"][data-vr-answer="1"]'));
   else if(step===4)add(button('[data-vr-key="photo"][data-vr-answer="1"]'));
   if(step<5){add(next);add(next);continue}
   if(!(q.step===5&&(q.sub==='assemble'||q.result))){
    for(const [i,value] of [0,0,1].entries())add(button('[data-vr-hypothesis="'+i+'"][data-vr-value="'+value+'"]'));
    add(next);add(next);
   }
   for(let i=0;i<D4_VOTE_WORDS.length;i++){add(button('[data-vr-slot="'+i+'"]'));add(button('[data-vr-word="'+i+'"]'))}
   add(next);
  }
  return steps;
 }
 const defs={
  'day3-floor':{view:'reasoning',render:'d3ReasoningPanel',ready:()=>d3ReasoningReady(),owner:()=>state.story.dayThreeReasoning,done:q=>q.phase==='group',valid:q=>q.step===4&&[0,1,2,3,4].every(n=>q.timedSteps?.includes(n))&&q.fiveAttempts.length===3&&q.premiseConfirmed===true,
   context:(p=state)=>({route:route(p),liRemoved:!!(p.game.departedNpcs?.xutang||p.story.dayThreeReview?.departureApplied&&p.story.dayThreeReview.target==='xutang'),sameFloor:D3_REASONING_EVIDENCE.sameFloor,litian:D3_REASONING_EVIDENCE.litian}),plan:floorSteps},
  'day4-testimony':{view:'day4-reasoning',render:'d4ReasonPanel',ready:()=>d4ReasonReady(),owner:()=>d4Reason(),done:q=>['complete','group'].includes(q.phase),valid:q=>q.step===5&&[0,1,2,3,4,5].every(n=>q.completed.includes(n)),
   context:(p=state)=>({route:route(p),testimony:p.story.dayFourHean?.decisions??null,premise:'hean-truthful'}),plan:testimonySteps},
  'day4-votes':{view:'day4-vote-reasoning',render:'d4VoteReasonPanel',ready:()=>d4VoteReasonReady(),owner:()=>state.story.dayFourVoteReasoning,done:q=>q.done===true,valid:q=>q.step===5&&q.sub==='assemble'&&D4_VOTE_WORDS.every((word,i)=>q.slots[i]===word),
   context:(p=state)=>({route:route(p),before:p.story.dayFourCounterattack?.before??null,history:p.story.dayFourCounterattack?.history??null,withdrawn:!!p.story.dayFourCounterattack?.withdrawn,debate:p.story.dayFourDebate?.decisions??null}),plan:voteSteps}
 };
 const fields={'day3-floor':'dayThreeReasoning','day4-testimony':'dayFourReasoning','day4-votes':'dayFourVoteReasoning'};
 // Read raw checkpoint copies only. nodeRecords() normalizes and rewrites old
 // archives, which is deliberately not part of this completion-only migration.
 function proofs(progress){
  const found=[];if(!progress?.story||!progress.game)return found;
  for(const [id,d] of Object.entries(defs))try{
   const q=progress.story[fields[id]];if(!q||!d.done(q)||!d.valid(q))continue;
   if(id==='day3-floor'){
    if(q.clues?.length!==2||!['roster','elevator'].every(c=>q.clues.includes(c))||!pairings.every(p=>q.fiveAttempts.includes(signature(p)))||q.fourPairs?.length!==1||signature(q.fourPairs)!=='jiangning+songyan')continue;
    if(q.slots?.target!=='jiangning'||q.slots.identity!=='ordinary'||q.slots.ask!=='jiangning'||q.slots.record!=='logistics'||q.plan?.claim!=='songyan'||q.plan.ask!=='jiangning'||q.plan.record!=='logistics')continue;
    // Alternate evidence was not saved in legacy snapshots; do not infer it.
    if(!d.context(progress).liRemoved||D3_REASONING_EVIDENCE.litian)continue;
   }else if(id==='day4-testimony'){
    if(String(q.quote)!=='2'||q.identity!=='same'||q.claim!=='delegate'||!['韩露','楼层混乱','许蓁蓁','同一阵营','学生会'].every((v,i)=>q.slots?.[i]===v)||!progress.story.dayFourHean?.decisions)continue;
   }else{
    if(q.crossed?.length!==3||new Set(q.crossed).size!==3||!q.crossed.every(n=>Number.isInteger(n)&&n>=0&&n<13)||!Number.isInteger(q.delegate)||q.delegate<0||q.delegate>9)continue;
    if(q.support?.length!==9||new Set(q.support).size!==9||!q.support.every(n=>Number.isInteger(n)&&n>=0&&n<10&&n!==q.delegate)||q.slider!==9||!['count','stable','photo'].every(k=>q.answers?.[k]===1)||canonical(q.hypothesis)!=='[0,0,1]')continue;
    const counter=progress.story.dayFourCounterattack;if(!counter?.before||!Number.isFinite(counter.before.shen)||!Number.isFinite(counter.before.me)||!Array.isArray(counter.history)||!counter.history.length)continue;
   }
   found.push({id,context:canonical(d.context(progress)),complete:true});
  }catch{/* An incomplete or damaged entry is not evidence of completion. */}
  return found;
 }
 function savedProofs(){
  const found=[];
  for(const source of [STORAGE_KEY,STORAGE_KEY+'-continue'])try{found.push(...proofs(JSON.parse(GameStorage.getItem(source)||'null')))}catch{}
  try{
   const records=JSON.parse(ChoiceNodeStorage.unpack(GameStorage.getItem(STORAGE_KEY+'-choice-nodes')));
   for(const record of Object.values(records))found.push(...proofs(record?.checkpoint));
  }catch{}
  return found;
 }
 function saveCompletion(id,context){
  try{const rows=history().filter(r=>r?.id!==id||r.context!==context);rows.push({id,context,complete:true});GameStorage.setItem(key,JSON.stringify({version:1,records:rows}));return true}catch{return false}
 }
 function migrateCompletion(s){
  if(s.q.step!==0||s.q.result||s.d.done(s.q))return false;
  const matches=r=>r.id===s.id&&r.context===s.context&&r.complete===true;
  return (restoreEvidence.some(matches)||savedProofs().some(matches))&&saveCompletion(s.id,s.context);
 }
 function loading(){return window.mobileLaunch||(typeof storyRestoring!=='undefined'&&storyRestoring)}
 function clearPending(){if(pending?.frame)cancelAnimationFrame(pending.frame);pending=null}
 function pendingValid(task){return pending===task&&state===task.state&&view===task.d.view&&task.d.owner()===task.q}
 function deferEntry(id){
  const d=defs[id],q=d.owner();if(!q||view!==d.view)return;
  if(pending&&pending.id===id&&pendingValid(pending))return;
  clearPending();const task={id,d,q,state,frame:null};pending=task;
  const check=()=>{
   if(!pendingValid(task)){if(pending===task)clearPending();return}
   if(loading()){task.frame=requestAnimationFrame(check);return}
   pending=null;enter(id);
  };
  task.frame=requestAnimationFrame(check);
 }
 function detectEntry(){for(const [id,d] of Object.entries(defs))if(view===d.view){enter(id);return}}
 function valid(s){return session===s&&state===s.state&&view===s.d.view&&s.d.ready()&&s.d.owner()===s.q&&canonical(s.d.context())===s.context}
 function clearUi(){document.querySelector('#reasoning-replay-modal')?.remove();phone.classList.remove('reasoning-replay-running')}
 function reset(){clearPending();restoreEvidence=[];if(session)for(const frame of session.frames)cancelAnimationFrame(frame);session=null;clearUi()}
 function paint(s,callback){const frame=requestAnimationFrame(()=>{s.frames.delete(frame);if(!valid(s)){reset();return}const next=requestAnimationFrame(()=>{s.frames.delete(next);if(valid(s))callback();else reset()});s.frames.add(next)});s.frames.add(frame)}
 function completed(id){
  const s=session;if(!s||s.id!==id||state!==s.state||s.d.owner()!==s.q||s.recorded||!s.d.done(s.q)||!s.d.valid(s.q)||canonical(s.d.context())!==s.context)return;
  s.recorded=true;
  saveCompletion(id,s.context);
 }
 function recover(s){if(session!==s)return;for(const frame of s.frames)cancelAnimationFrame(frame);s.frames.clear();s.mode='watch';s.advancing=false;clearUi();if(state===s.state&&s.d.owner()===s.q&&view===s.d.view)globalThis[s.d.render]();else reset()}
 function progress(s){const percent=Math.floor(s.index/s.steps.length*100),bar=document.querySelector('#reasoning-replay-modal [role="progressbar"]');if(!bar)return;bar.setAttribute('aria-valuenow',percent);bar.firstElementChild.style.width=percent+'%';document.querySelector('#reasoning-replay-percent').textContent=percent+'%'}
 function advance(s){
  paint(s,()=>{
   try{
    if(s.index===s.steps.length){if(!s.d.done(s.q)||!s.recorded)throw Error('Incomplete reasoning');s.mode='watch';clearUi();globalThis[s.d.render]();return}
    if(s.d.done(s.q))throw Error('Unexpected reasoning endpoint');
    s.advancing=true;s.steps[s.index]();s.advancing=false;
    if(!valid(s)){reset();return}
    s.index++;progress(s);advance(s);
   }catch{recover(s)}
  });
 }
 function prompt(s){
  if(typeof ReadHistory!=='undefined')ReadHistory.stop();closeSheet();
  const modal=document.createElement('div');modal.id='reasoning-replay-modal';modal.className='story-replay-modal';
  modal.innerHTML='<section class="vn-dialogue cg-replay-card" role="dialog" aria-modal="true" aria-labelledby="reasoning-replay-title" aria-describedby="reasoning-replay-description" tabindex="-1"><h2 id="reasoning-replay-title">这段推理已经完成过，是否跳过？</h2><p id="reasoning-replay-description" class="replay-description">按本线路的正确推理继续，完成后停留在结论页。</p><div class="cg-options"><button type="button" data-reasoning-skip>跳过推理</button><button type="button" data-reasoning-watch>重新推理</button></div></section>';
  phone.append(modal);
  modal.querySelector('[data-reasoning-watch]').onclick=()=>{if(valid(s)&&s.mode==='prompt'){s.mode='watch';clearUi()}};
  modal.querySelector('[data-reasoning-skip]').onclick=()=>{
   if(!valid(s)||s.mode!=='prompt')return;
   try{
    s.steps=s.d.plan(s.q);if(!s.steps?.length)return recover(s);
    s.index=0;s.mode='replay';phone.classList.add('reasoning-replay-running');
    modal.querySelector('section').setAttribute('aria-busy','true');modal.querySelector('h2').textContent='正在跳过已完成的推理';modal.querySelector('.replay-description').textContent='正在整理推理结论……';modal.querySelector('.cg-options').remove();
    modal.querySelector('section').insertAdjacentHTML('beforeend','<div class="cg-replay-progress" role="progressbar" aria-label="推理处理进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span></span></div><p class="cg-replay-percent" id="reasoning-replay-percent">0%</p>');
    modal.querySelector('section').focus();advance(s);
   }catch{recover(s)}
  };
  modal.querySelector('[data-reasoning-skip]').focus();
 }
 function enter(id){
  const d=defs[id],q=d.owner();if(!q||view!==d.view)return;
  if(loading()){deferEntry(id);return}
  clearPending();if(!d.ready())return;
  if(session&&!valid(session))reset();
  if(session||d.done(q))return;
  const s={id,d,q,state,context:canonical(d.context()),mode:'watch',recorded:false,frames:new Set()};session=s;
  if(history().some(r=>r?.id===id&&r.complete===true&&r.context===s.context)||migrateCompletion(s)){
   try{if(!d.plan(q)?.length)return;s.mode='prompt';prompt(s)}catch{recover(s)}
  }
 }
 for(const [id,d] of Object.entries(defs)){
  const base=globalThis[d.render];globalThis[d.render]=function(...args){const result=base(...args);enter(id);return result};
 }
 for(const type of ['pointerdown','pointerup','click','keydown','input'])window.addEventListener(type,event=>{
  const s=session;if(!s||!['prompt','replay'].includes(s.mode))return;
  if(!valid(s)){reset();return}
  if(s.advancing&&!event.isTrusted)return;
  const modal=document.querySelector('#reasoning-replay-modal');
  if(s.mode==='prompt'&&modal?.contains(event.target)&&event.key!=='Escape'){
   if(type==='keydown'&&event.key==='Tab'){const buttons=[...modal.querySelectorAll('button')],i=buttons.indexOf(document.activeElement);event.preventDefault();buttons[(i+(event.shiftKey?-1:1)+buttons.length)%buttons.length].focus()}
   return;
  }
  event.preventDefault();event.stopImmediatePropagation();
 },true);
 new MutationObserver(()=>{if(pending&&!pendingValid(pending)||session&&!valid(session))reset()}).observe(screen,{childList:true});
 const cleanup=cleanupStoryTimeline;cleanupStoryTimeline=function(...args){reset();return cleanup(...args)};
 const initialize=initializeChapter;initializeChapter=function(...args){reset();return initialize(...args)};
 const resume=resumeGameSnapshot;resumeGameSnapshot=function(...args){
  // Preserve only verified completion evidence before the original restore can
  // replace main/continue progress. Never copy its answers into the loaded state.
  const evidence=[...proofs(state),...savedProofs()];
  const result=resume(...args);
  if(result!==false){restoreEvidence=evidence;detectEntry()}
  return result;
 };
 window.addEventListener('pagehide',reset);
 window.addEventListener('storage',event=>{if(event.key===key||event.key===null)reset()});
 window.addEventListener('error',()=>{if(session?.mode==='replay')recover(session)});
 for(const [id,d] of Object.entries(defs))if(view===d.view)enter(id);
 return {completed,reset,holdsResult:id=>session?.id===id&&session.mode==='replay'};
})();
