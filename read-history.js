/* Presentation history is deliberately outside all rewindable game snapshots.
 * The adapters below audit individual waits; no global clock or queue is replaced. */
// Standalone static-CG skipping is disabled; the seven authored segments use cg-replay.js.
const SKIPPABLE_SEEN_CG_IDS=Object.freeze([]);
function getPresentationDelay(originalDelay){
 return window.ReadHistory?.accelerating?Math.min(originalDelay,500):originalDelay;
}
window.ReadHistory=(()=>{
 'use strict';
 const key=STORAGE_KEY+'-read-history',version=1;
 const sets={seenMessageIds:new Set(),seenStoryNodeIds:new Set(),seenCgIds:new Set()};
 const sources=new Map(),frames=new Set();
 let enabled=false,current=null,serial=0,fastUntil=null,dirty=false,saveTimer=null;
 let lastState=state,lastView=view,lastChat=active,pendingCg=null,watchCg=null,zeroWait=null,inFlight=null,painting=false,wake=null;
 const validId=id=>typeof id==='string'&&id.length>0&&id.length<512;
 const messageKey=(chat,id)=>JSON.stringify([chat,id]);
 const safe=(fn,fallback=null)=>{try{return fn()}catch{return fallback}};
 const object=value=>value&&typeof value==='object'&&!Array.isArray(value);
 let stored=safe(()=>JSON.parse(GameStorage.getItem(key)||'null'));
 for(const field of Object.keys(sets))if(Array.isArray(stored?.[field]))for(const id of stored[field])if(validId(id))sets[field].add(id);
 function add(field,id){if(!validId(id)||sets[field].has(id))return;sets[field].add(id);dirty=true}
 function flush(){
  if(saveTimer!==null){clearTimeout(saveTimer);saveTimer=null}
  if(!dirty)return;
  try{GameStorage.setItem(key,JSON.stringify({readHistoryVersion:version,...Object.fromEntries(Object.entries(sets).map(([name,ids])=>[name,[...ids]]))}));dirty=false}catch{/* Optional history must never block saves or startup. */}
 }
 function saveSoon(){if(dirty&&saveTimer===null)saveTimer=setTimeout(flush,300)}
 function scriptNode(chat,id){
  let match;
  if((match=/^zero-(invitation|accept|refuse|warning)-\d+$/.exec(id)))return 'chat:zero:'+match[1];
  if((match=/^hg-(intro|event)-\d+$/.exec(id)))return 'chat:hg:'+match[1];
  if((match=/^post-([A-Za-z]+)-\d+$/.exec(id)))return 'chat:post:'+match[1];
  if((match=/^day2-authored-([A-Za-z]+)-\d+$/.exec(id)))return 'chat:day2:'+match[1];
  if((match=/^day3-evening-([A-Za-z]+)-\d+$/.exec(id)))return 'chat:day3-evening:'+match[1];
  if((match=/^d4-after-([A-Za-z]+)-\d+$/.exec(id)))return 'chat:d4-after:'+match[1];
  if((match=/^d4-a-([A-Za-z]+)-\d+$/.exec(id)))return 'chat:d4-a:'+match[1];
  return null;
 }
 function historicalMessages(progress){
  if(!object(progress?.messages)||!progress.story?.started)return;
  for(const [chat,rows]of Object.entries(progress.messages))if(validId(chat)&&Array.isArray(rows))for(const row of rows){
   if(!object(row)||!validId(row.id)||row.type==='time')continue;
   add('seenMessageIds',messageKey(chat,row.id));add('seenStoryNodeIds',scriptNode(chat,row.id));
  }
 }
 // Read raw archives, not nodeRecords()/SaveSchema: migration must not normalize,
 // rewrite, combine, or restore any gameplay snapshots.
 if(stored?.readHistoryVersion!==version){
  for(const source of [STORAGE_KEY,STORAGE_KEY+'-continue'])safe(()=>historicalMessages(JSON.parse(GameStorage.getItem(source)||'null')));
  safe(()=>{
   const records=JSON.parse(ChoiceNodeStorage.unpack(GameStorage.getItem(STORAGE_KEY+'-choice-nodes')));
   for(const [id,record]of Object.entries(records||{}))safe(()=>{
    if(!object(record)||!object(record.checkpoint))return;
    historicalMessages(record.checkpoint);
    if(Number.isFinite(record.reachedAt)&&record.reachedAt>0)add('seenStoryNodeIds',id);
   });
  });
  safe(()=>{const records=JSON.parse(GameStorage.getItem(STORAGE_KEY+'-worldline-discovery')||'{}');for(const [id,reached]of Object.entries(records))if(reached===true)add('seenStoryNodeIds',id)});
  safe(()=>{const records=JSON.parse(GameStorage.getItem(STORAGE_KEY+'-ending-gallery')||'{}');for(const [id,record]of Object.entries(records))if(/^\d{3}$/.test(id)&&Number.isFinite(record?.unlockedAt))add('seenStoryNodeIds','ending:'+id)});
  // No CG unlock is inferred from a date, ending, image filename or choice.
  safe(()=>{const records=JSON.parse(GameStorage.getItem(STORAGE_KEY+'-cg-gallery')||'{}');for(const [id,record]of Object.entries(records))if(validId(id)&&(record===true||Number.isFinite(record?.unlockedAt)))add('seenCgIds',id)});
  dirty=true;flush();
 }
 stored=null;
 const phone=document.querySelector('#phone'),button=document.createElement('button');
 button.type='button';button.id='read-speed-toggle';button.className='secondary';button.hidden=true;
 const speedIcons={play:'<path d="M3 5.5v13l9-6.5zM12 5.5v13l9-6.5z"/>',pause:'<rect x="5" y="5" width="5" height="14" rx="1"/><rect x="14" y="5" width="5" height="14" rx="1"/>'};
 button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">'+speedIcons.play+'</svg><span>已读加速</span>';
 button.setAttribute('aria-label','已读加速');button.setAttribute('aria-pressed','false');phone.append(button);
 function blocked(){
  if(window.mobileLaunch||document.hidden||storyRestoring||view!=='chat'||!active||!state.story?.started||state.game.survivalEnding||pendingCg)return true;
  if(storyEndingOwner()||state.story.pendingPlayerReply||hospitalPhoneMode())return true;
  const free=state.game.day===3?state.story.dayThreeFreeAction:state.game.day===2?state.story.dayTwoFreeAction:state.game.day===1?state.story.freeAction:null;
  if(free?.run||free?.transition)return true;
  if(document.querySelector('#overlay .sheet,#pickup16.pickup16-scene,#cg-recovery-confirm,.report-modal'))return true;
  return !!screen.querySelector('.zero-choices,.cg-options,.vn-dialogue,.reasoning-page,.delegation-page,[data-story-reply-box]')||!screen.querySelector('#messages');
 }
 function candidate(){
  if(blocked())return null;
  const matches=[];
  for(const [source,resolve]of sources){
   const c=safe(resolve);
   if(c&&c.chat===active&&validId(c.id)&&c.owner&&Number.isFinite(c.owner[c.field])&&!state.messages[c.chat]?.some(m=>m.id===c.id))matches.push({...c,source,key:messageKey(c.chat,c.id)});
  }
  // Ambiguous concurrent legacy runners are intentionally not accelerated.
  return matches.length===1?matches[0]:null;
 }
 function known(c){return !!c&&sets.seenMessageIds.has(c.key)&&(!c.node||sets.seenStoryNodeIds.has(c.node))}
 function same(a,b){return a&&b&&a.source===b.source&&a.owner===b.owner&&a.key===b.key&&a.field===b.field}
 function updateButton(show){
  if(button.hidden===show)button.hidden=!show;
  const label=enabled?'加速中':'已读加速';
  if(button.getAttribute('aria-label')!==label){button.querySelector('svg').innerHTML=enabled?speedIcons.pause:speedIcons.play;button.querySelector('span').textContent=label;button.setAttribute('aria-label',label)}
  if(button.getAttribute('aria-pressed')!==String(enabled))button.setAttribute('aria-pressed',String(enabled));
  phone.classList.toggle('read-speed-visible',show);phone.classList.toggle('read-speed-active',enabled&&show);
 }
 function armZero(fast=false){
  const t=zeroWait;if(!t)return;
  clearTimeout(t.handle);storyPendingTimeouts.delete(t.handle);
  t.fast=fast;const token=++t.token,remaining=Math.max(0,t.normalDue-Date.now());
  const delay=fast?getPresentationDelay(remaining):remaining;
  t.handle=storyTimeout(()=>{
   if(zeroWait!==t||t.token!==token||state!==t.state||state.story.zero!==t.owner||t.owner.script!==t.script||t.owner.step!==t.step)return;
   zeroWait=null;
   const c=candidate();if(fast&&enabled&&same(c,current)&&known(c))permit(c);
   t.callback();
  },delay);zeroTimer=t.handle;
 }
 function stop(notify=false){
  const was=enabled;enabled=false;fastUntil=null;serial++;
  if(wake){clearTimeout(wake.handle);wake=null}
  if(zeroWait?.fast)armZero(false);
  updateButton(false);
  if(was&&notify)toast('已进入未读内容，快进已停止');
 }
 function inspect(){
  if(pendingCg&&!pendingCg.valid())cancelCg();
  if(state!==lastState||view!==lastView||active!==lastChat){
   stop();current=null;
   if(state!==lastState)cancelZero();
   if(pendingCg&&!pendingCg.valid())cancelCg();
   lastState=state;lastView=view;lastChat=active;
  }
  const next=candidate();
  if(!same(next,current)){current=next;fastUntil=null;serial++;if(wake){clearTimeout(wake.handle);wake=null}}
  if(!known(next)){stop(!!next);return null}
  if(enabled)scheduleWake(next);
  updateButton(true);return next;
 }
 function scheduleWake(c){
  if(c.source==='zero'||wake)return;
  const remaining=c.field==='due'?c.owner.due-Date.now():c.owner[c.field];
  if(fastUntil===null)fastUntil=Date.now()+getPresentationDelay(Math.max(0,remaining));
  const ticket={state,owner:c.owner,key:c.key,serial};wake=ticket;
  ticket.handle=setTimeout(()=>{
   if(wake!==ticket)return;
   if(!enabled||state!==ticket.state||serial!==ticket.serial||!same(candidate(),c))return;
   try{c.run?.()}catch{stop()}
  },Math.max(0,fastUntil-Date.now()));
 }
 function permit(c){
  const marker={key:c.key,state,chat:active,serial,sound:true};inFlight=marker;painting=true;
  // The existing runner inserts exactly one row synchronously. A following row
  // cannot be accelerated until that insertion has survived a browser paint.
  const a=requestAnimationFrame(()=>{frames.delete(a);const b=requestAnimationFrame(()=>{frames.delete(b);if(inFlight===marker){painting=false;inFlight=null;scanVisible()}});frames.add(b)});frames.add(a);
 }
 function waiting(source,owner,field='due',mode='due'){
  const remaining=mode==='due'?owner[field]-Date.now():owner[field],normal=remaining>0;
  try{
   if(pendingCg||window.CgReplay?.paused)return true;
   const choiceWait=window.ChatChoiceTiming?.waiting(source,owner);
   if(typeof choiceWait==='boolean'){if(enabled)stop();return choiceWait}
   const c=inspect();
   if(!enabled||!c||c.source!==source||c.owner!==owner||c.field!==field)return normal;
   if(painting)return true;
   if(fastUntil===null)fastUntil=Date.now()+getPresentationDelay(Math.max(0,remaining));
   if(normal&&Date.now()<fastUntil)return true;
   permit(c);return false;
  }catch{stop();return normal}
 }
 function cancelZero(){if(!zeroWait)return;clearTimeout(zeroWait.handle);storyPendingTimeouts.delete(zeroWait.handle);zeroWait=null}
 function reset(){
  stop();cancelZero();cancelCg();watchCg=null;current=null;inFlight=null;painting=false;
  for(const frame of frames)cancelAnimationFrame(frame);frames.clear();flush();
 }
 function scanVisible(){
  if(window.mobileLaunch||document.hidden||view!=='chat')return;
  const list=screen.querySelector('#messages');if(!list)return;
  const bounds=list.getBoundingClientRect();
  for(const el of list.querySelectorAll('[data-read-message]')){
   const id=el.getAttribute('data-read-message');if(sets.seenMessageIds.has(id))continue;
   const rect=el.getBoundingClientRect();if(!rect.width||!rect.height||rect.bottom<=bounds.top||rect.top>=bounds.bottom)continue;
   if(el.getAnimations?.({subtree:true}).some(a=>a.playState==='running'))continue;
   const pictures=[...el.querySelectorAll('img')];if(pictures.some(img=>!img.complete||!img.naturalWidth))continue;
   add('seenMessageIds',id);const parts=safe(()=>JSON.parse(id));if(parts)add('seenStoryNodeIds',scriptNode(parts[0],parts[1]));
  }
  saveSoon();
 }
 const renderBase=renderMessage;
 renderMessage=function(m,c){
  let html=renderBase(m,c);if(!validId(m?.id)||!validId(c?.id)||m.type==='time')return html;
  const id=messageKey(c.id,m.id),fast=inFlight?.key===id&&inFlight.state===state;
  return html.replace(/^(\s*<[a-z][\w-]*)/i,'$1 data-read-message="'+esc(id)+'"'+(fast?' data-read-fast="true"':''));
 };
 const captureBase=captureStoryNode;
 captureStoryNode=function(id,...args){const result=captureBase(id,...args);if(result){add('seenStoryNodeIds',id);saveSoon()}return result};
 const cleanupBase=cleanupStoryTimeline;
 cleanupStoryTimeline=function(...args){reset();return cleanupBase(...args)};
 const initializeBase=initializeChapter;
 initializeChapter=function(...args){reset();return initializeBase(...args)};
 const homeBase=home;
 home=function(...args){stop();return homeBase(...args)};
 const menuBase=zeroMenu;
 zeroMenu=function(...args){stop();const result=menuBase(...args);if(view==='game-menu')reset();return result};
 const chatBase=openChat;
 openChat=function(id,...args){
  if(view!=='chat'||active!==id)stop();const result=chatBase(id,...args);
  const marker=inFlight;if(marker)queueMicrotask(()=>{marker.sound=false});
  if(!painting)safe(inspect);return result;
 };
 const zeroScheduleBase=zeroSchedule;
 zeroSchedule=function(ms,fn){
  cancelZero();const result=zeroScheduleBase(ms,fn);
  // The only timeout adapter: a next chat row, never the choice/scene/end beat.
  const c=safe(()=>sources.get('zero')());
  if(fn===zeroStep&&c){zeroWait={handle:zeroTimer,token:0,normalDue:z().due,owner:z(),script:z().script,step:z().step,state,callback:()=>{z().due=null;fn()}};if(inspect()&&enabled)armZero(true)}
  return result;
 };
 const zeroPhaseBase=zeroPhase;
 zeroPhase=function(...args){cancelZero();return zeroPhaseBase(...args)};
 function cancelCg(){
  if(!pendingCg)return;pendingCg.used=true;pendingCg=null;phone.classList.remove('read-cg-prompt');
  if(document.querySelector('[data-read-cg-dialog]'))closeSheet();
 }
 function presentStaticCg(id,{owner,valid,show,onComplete}){
  if(!SKIPPABLE_SEEN_CG_IDS.includes(id))return false;
  stop();
  if(watchCg?.owner===owner&&watchCg.id===id&&watchCg.state===state)return false;
  if(pendingCg?.id===id&&pendingCg.owner===owner){
   if(document.querySelector('[data-read-cg-dialog]'))return true;
   cancelCg();
  }
  if(!sets.seenCgIds.has(id))return false;
  if(document.querySelector('#overlay .sheet'))return false;
  const prompt={id,owner,valid,used:false,state};pendingCg=prompt;
  const choose=skip=>{
   if(pendingCg!==prompt||prompt.used||state!==prompt.state||!valid())return;
   prompt.used=true;pendingCg=null;phone.classList.remove('read-cg-prompt');closeSheet();
   try{if(skip)onComplete();else{watchCg={owner,id,state};show()}}catch(error){stop();throw error}
  };
  sheet('该画面已经观看过','<div data-read-cg-dialog><p>是否跳过本次CG？</p><button type="button" class="primary" data-read-cg-skip>跳过</button><button type="button" class="secondary" data-read-cg-watch>继续观看</button></div>');
  phone.classList.add('read-cg-prompt');
  const dialog=document.querySelector('[data-read-cg-dialog]');
  dialog.closest('.sheet').querySelector('.sheet-header button')?.remove();
  dialog.querySelector('[data-read-cg-skip]').onclick=e=>{e.preventDefault();e.stopPropagation();choose(true)};
  dialog.querySelector('[data-read-cg-watch]').onclick=e=>{e.preventDefault();e.stopPropagation();choose(false)};
  return true;
 }
 function cgShown(id,image,valid=()=>true){
  if(!validId(id)||sets.seenCgIds.has(id)||!image)return;
  const originalState=state;
  const record=()=>{
   const frame=requestAnimationFrame(()=>{frames.delete(frame);if(state===originalState&&valid()&&image.isConnected&&image.complete&&image.naturalWidth&&!document.hidden){add('seenCgIds',id);saveSoon()}});frames.add(frame);
  };
  if(image.complete)record();else image.addEventListener('load',record,{once:true});
 }
 button.onclick=e=>{
  e.preventDefault();e.stopPropagation();
  if(enabled){stop();inspect();return}
  const c=inspect();if(!known(c))return;
  enabled=true;fastUntil=null;updateButton(true);
  if(c.source==='zero'&&zeroWait)armZero(true);else scheduleWake(c);
 };
 // This capture listener never consumes input or advances a story.
 window.addEventListener('click',e=>{if(e.target.closest('#read-speed-toggle,[data-read-cg-dialog]'))return;if(e.target.closest('button,[data-action],[data-app]'))stop()},true);
 // An unrelated legacy error must not cancel a pending normal story callback.
 window.addEventListener('error',()=>{stop()});
 window.addEventListener('unhandledrejection',()=>{stop()});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();flush()}});
 window.addEventListener('pagehide',reset);
 window.addEventListener('storage',e=>{if(e.key===key||e.key===null){reset();if(e.newValue===null){for(const ids of Object.values(sets))ids.clear();dirty=false}}});
 new MutationObserver(()=>safe(inspect)).observe(screen,{childList:true,subtree:true});
 // This observer/interval only observes the UI and read IDs. It never sends messages.
 setInterval(()=>{try{inspect();scanVisible()}catch{stop()}},100);
 return {waiting,register:(name,resolve)=>sources.set(name,resolve),presentStaticCg,cgShown,stop,reset,
  canContinueReadReply:(source,owner,id)=>enabled&&current?.source===source&&current.owner===owner&&current.id===id&&known(current)&&!blocked(),
  get accelerating(){return enabled},get cgPaused(){return !!pendingCg},
  muteMessageSound:kind=>!!inFlight?.sound&&inFlight.state===state&&inFlight.chat===active&&['message','group'].includes(kind)};
})();

/* Audited next-row descriptors. Control rows, dynamic IDs, options, departures,
 * final beats and all free-action/reasoning/report clocks intentionally fall back. */
(()=>{
 const register=ReadHistory.register;
 const runners={hg:()=>hgTick(),post:()=>postEveningTick(),day2:()=>dayTwoAdvance(dayTwoState()),'day3-evening':()=>d3EveningTick(),'d4-after':()=>d4AfterTick(),'d4-a':()=>d4ATick()};
 const row=(owner,chat,id,field='due',node=null)=>({owner,chat,id,field,node:node||null,run:runners[node?.split(':')[1]]});
 // Mirror the existing reply gate without approving anything: only a confirmed
 // line or the automatic continuation of the player's current turn may speed up.
 const playerReady=(chat,token,forceClick=false)=>{
  if(state.story.replyConfirmations?.[token])return true;
  if(forceClick)return false;
  const messages=state.messages[chat]||[];
  for(let i=messages.length-1;i>=0;i--){const m=messages[i];if(m.sender&&!['system','recalled','time'].includes(m.type))return m.sender==='me'}
  return false;
 };
 register('zero',()=>{
  const q=state.story.zero;if(!q?.script||!['invitation','accept','refuse','warning'].includes(q.phase))return null;
  const next=Z.scripts[q.script]?.[q.step];if(!next||['notice','system'].includes(next[1]))return null;
  if(next[1]==='me'&&!playerReady(q.script==='warning'?'linqing':'room408','zero:'+q.script+':'+q.step))return null;
  return row(q,q.script==='warning'?'linqing':'room408','zero-'+q.script+'-'+q.step,'due','chat:zero:'+q.script);
 });
 register('first-morning',()=>{
  const a=state.story.firstMorning;if(state.game.day!==1||!a||a.waiting)return null;
  const rows=a.phase==='invitation'?FM.invitation:a.phase==='accept'?FM.accept:a.phase==='refuse'?FM.refuse:null;
  const next=rows?.[a.step];
  // Departures and choice/scene transitions retain their original timing.
  if(!next||next[3]||next[1]==='system'||document.querySelector('#delivery-notification'))return null;
  const id=a.phase==='refuse'?(a.step===4?'fm-refuse-su-question':'fm-refuse-'+(a.step>4?a.step-1:a.step)):'fm-'+a.phase+'-'+a.step;
  return {...row(a,HG_ID,id),run:()=>fmTick()};
 });
 register('hg',()=>{
  const q=state.story.helpGroup;if(!q?.joined||q.waitingForRead||!['intro','event'].includes(q.phase))return null;
  const next=(q.phase==='intro'?HG_INTRO:HG_EVENT)[q.step];if(!next||next[1]==='system'||next[3]==='remove')return null;
  return row(q,HG_ID,'hg-'+q.phase+'-'+q.step,'due','chat:hg:'+q.phase);
 });
 register('post',()=>{
  const q=state.story.postReportEvening,s=q&&POST_SCRIPTS[q.script],next=s?.rows[q.index];
  if(q?.phase!=='chat'||!next||q.index>0&&!postChatCanAdvance(s))return null;
  if(next.mine&&!playerReady(s.chat,'post:'+q.script+':'+q.index))return null;
  return row(q,s.chat,'post-'+q.script+'-'+q.index,'due','chat:post:'+q.script);
 });
 register('pickup-record',()=>{
  const q=state.story.pickupRecordDiscussion,rows=q&&RECORD_SCRIPTS[q.script],next=rows?.[q.index];
  if(q?.phase!=='script'||q.typing||!next?.who||typeof next.text!=='string')return null;
  if(next.choices||next.members||next.end||next.typing||next.pause)return null;
  // The cursor already points beyond a pause while its original wait is running.
  // Do not turn that wait into a skippable message delay (including old saves).
  const previous=rows[q.index-1];
  if((previous?.typing||previous?.pause)&&Date.now()<q.due)return null;
  if(next.who==='me'&&!playerReady(HG_ID,'record:'+q.script+':'+q.index))return null;
  // Keep the original script/index ID: distance and conflict never share IDs.
  // No new node-history prerequisite is imposed on existing v1 read histories.
  return {...row(q,HG_ID,'pickup-public-'+q.script+'-'+q.index),run:()=>recordDiscussionTick()};
 });
 register('evening-anomaly',()=>{
  const q=state.story.eveningAnomaly,next=q&&EVENING_ROWS[q.index];
  if(q?.phase!=='messages'||!next||['system','choice'].includes(next[0]))return null;
  if(next[0]==='me'&&!q.replyChosen)return null;
  // Existing exact message IDs suffice, including histories migrated by v1.
  return {...row(q,HG_ID,'evening-anomaly-'+q.index),run:()=>eveningTick()};
 });
 register('day2',()=>{
  const q=dayTwoState();if(q?.phase!=='chat'||q.dayTwoVersion!==DAY_TWO_VERSION)return null;
  const chat=dayTwoChat(q);let scriptId=q.script,index=q.index;const visited=new Set();
  while(!visited.has(scriptId)){
   visited.add(scriptId);const script=DAY_TWO_AUTHORED[scriptId];if(!script||dayTwoChat({script:scriptId})!==chat)return null;
   let next=script.rows?.[index];
   if(scriptId==='eveningFloorWarning')while(next?.[2]==='speakerAlive'&&reportDeparted(GROUP_SUSPECT_NAMES[next[0]],state))next=script.rows[++index];
   if(!next){
    // Only look through an automatic same-chat transition. The original runner
    // still advances the script and performs every original save/effect.
    if(index!==script.rows?.length||script.choices||!script.next)return null;
    scriptId=script.next;index=0;continue;
   }
   const floorSpeaker=scriptId==='eveningFloorWarning'&&next[2]==='speakerAlive';
   if(['typing','supporter'].includes(next[0])||next[2]&&next[2]!=='forceReply'&&!floorSpeaker)return null;
   if(next[0]==='me'&&!playerReady(chat,'day2:'+scriptId+':'+index,next[2]==='forceReply'))return null;
   return row(q,chat,'day2-authored-'+scriptId+'-'+index,'due','chat:day2:'+scriptId);
  }
  return null;
 });
 register('d3-probe',()=>{
  const q=d3Probe();if(state.game.day!==3||q?.phase!=='chat')return null;
  // Look through automatic segment boundaries without advancing the original runner.
  let scriptId=q.script,index=q.index;const visited=new Set();
  while(!visited.has(scriptId)){
   visited.add(scriptId);const script=d3ProbeRows(scriptId);if(!script)return null;
   if(script.rows[index])return {...row(q,HG_ID,'day3-probe-'+scriptId+'-'+index,'remaining'),run:()=>d3ProbeTick()};
   if(index!==script.rows.length)return null;
   const key=scriptId==='evidence'?'day3-self-proof':scriptId==='counter'?'day3-zhao-defense':null;
   const extra=key&&groupAdditionNext(key);
   if(extra)return {...row(q,HG_ID,extra.id,'remaining'),run:()=>d3ProbeTick()};
   if(script.choice||!script.next||script.next==='pickup')return null;
   scriptId=script.next;index=0;
  }
  return null;
 });
 register('day3-evening',()=>{
  const q=state.story.dayThreeEvening;if(q?.phase!=='chat')return null;
  const s=d3EveningScript(q.script),next=s?.rows[q.index];if(!next||typeof next!=='string')return null;
  return row(q,q.chat,'day3-evening-'+q.script+'-'+q.index,'remaining','chat:day3-evening:'+q.script);
 });
 register('d4-after',()=>{
  const q=state.story.dayFourAfterConfrontation;if(q?.phase!=='chat')return null;
  const next=d4AfterRows(q.script)[q.index];if(!next||['me','supporter'].includes(next[0])||reportDeparted(GROUP_SUSPECT_NAMES[next[0]]))return null;
  return row(q,q.chat,'d4-after-'+q.script+'-'+q.index,'remaining','chat:d4-after:'+q.script);
 });
 register('d4-a',()=>{
  const q=state.story.dayFourADorm;if(!q||q.phase!=='talk')return null;
  const r=q.huang;if(r?.phase!=='chat')return null;
  // Resolve across automatic next/skip rows without advancing the story owner.
  // The original runner still handles transitions, replies and vote settlement.
  let script=r.script,index=r.index;const visited=new Set();
  while(!visited.has(script+':'+index)){
   visited.add(script+':'+index);
   const next=D4_A_SCRIPTS[script]?.[index];
   if(!next||next.options)return null;
   if(next.skip===true){index++;continue}
   if(typeof next.next==='string'){script=next.next;index=0;continue}
   if(!Array.isArray(next))return null;
   if(next[0]==='me'&&!playerReady(r.chat,'d4-a:'+script+':'+index))return null;
   return row(r,r.chat,'d4-a-'+script+'-'+index,'remaining','chat:d4-a:'+script);
  }
  return null;
 });
 const debateScripts=new Set(['attack','round1bad','round1badEnd','round1good','round1press','round1goodEnd','hean','invitation','risk','round2bad','round2good','round3','round3alive','round3risk','closing','rescue','relief','reliefEnd']);
 register('d4-debate',()=>{
  const q=state.story.dayFourDebate;
  if(state.game.day!==4||q?.phase!=='chat'||!debateScripts.has(q.script)||document.querySelector('[data-d4-vote-modal]'))return null;
  const rows=D4_DEBATE_SCRIPTS[q.script]?.rows;let index=q.index,next=rows?.[index];
  // Look past absent speakers without changing the original runner's cursor.
  while(next&&!d4DebatePresent(d4DebateWho(next[0])))next=rows[++index];
  if(!next)return null;
  if(next[0]==='me'&&!playerReady(q.chat,'d4-debate:'+q.script+':'+index))return null;
  // Exact branch/message IDs also work with existing v1 histories. No new node
  // prerequisite, archive migration, reply approval or vote settlement is needed.
  return {...row(q,q.chat,'d4-debate-'+q.script+'-'+index,'remaining'),run:()=>d4DebateTick()};
 });
})();
