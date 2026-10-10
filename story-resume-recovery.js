/* Recovery only: borrow the original runners, never replay their settlements. */
(()=>{
 let owner=null,pending=false,lastRoute='',tickets=new Map();
 const inside=id=>view==='chat'&&active===id;
 const blocked=()=>window.mobileLaunch||storyRestoring||document.hidden||!state?.story||state.game.survivalEnding||storyEndingOwner()||['game-menu','nodes','zero-death'].includes(view);
 const notice=(id,show)=>{if(document.getElementById(id))return;show();const el=document.getElementById(id);if(el)el.dataset.ringtonePlayed='true'};
 const groupNotice=()=>notice('hg-notification',()=>hgNotice('group'));
 const noticeIds={'d3-evening':'d3-evening-notice','d4-after':'d4-after-notice','d4-debate':'d4-debate-message','d4-counter':'d4-counter-notice','d4-final':'d4-final-notice','d4-farewell':'d4-final-notice'};
 function noticeMessage(entry){
  const rows=state.messages[entry.chat]||[];
  const message=[...rows].reverse().find(m=>m.id&&m.type!=='time');
  // A contact preview can still belong to a previous conversation. Never use it
  // to announce a stage whose first message has not actually been sent.
  return message&&message.sender!=='me'&&String(message.id).startsWith(entry.prefix)?message:null;
 }
 function noticeRecord(entry,message){
  const key=JSON.stringify([entry.chat,message.id]);
  const records=state.story.recoveryNotices??={};
  return {key,record:records[key]??={chat:entry.chat,messageId:message.id,noticeShown:false,noticeAcknowledged:false}};
 }
 function rememberNotice(entry,element){
  const message=noticeMessage(entry);if(!message)return;
  const {key,record}=noticeRecord(entry,message);
  if(record.noticeAcknowledged||record.noticeShown&&element.dataset.recoveryNoticeKey!==key){element.remove();return}
  element.dataset.recoveryNoticeKey=key;
  if(!record.noticeShown){record.noticeShown=true;persist()}
 }
 function recoveredNotice(entry){
  const id=noticeIds[entry.key]||'hg-notification',element=document.getElementById(id),message=noticeMessage(entry);
  if(!message){if(entry.key==='d3-evening')element?.remove();return}
  const {key,record}=noticeRecord(entry,message);
  if(record.noticeAcknowledged||record.noticeShown){if(element?.dataset.recoveryNoticeKey!==key)element?.remove();return}
  const contact=state.contacts.find(c=>c.id===entry.chat);
  if(!(contact?.unread>0))return;
  // Update only the preview; message history and unread counts are untouched.
  contact.preview=message.type==='image'?'[图片]':message.text||contact.preview;
  if(element){
   const preview=element.querySelector('.opening-body>span:last-child>span:last-child');
   if(preview)preview.textContent=entry.key==='d4-debate'&&entry.chat===HG_ID?d4DebateNoticePreview(message,contact.preview):contact.preview;
   rememberNotice(entry,element);return;
  }
  entry.show();const shown=document.getElementById(id);
  if(shown)rememberNotice(entry,shown);
 }
 function acknowledge(chat){
  if(owner!==state)return;
  let changed=false;
  for(const entry of stages())if(entry.chat===chat){
   const message=noticeMessage(entry);if(!message)continue;
   const {record}=noticeRecord(entry,message);
   if(!record.noticeAcknowledged){record.noticeAcknowledged=true;changed=true}
  }
  for(const record of Object.values(state.story.recoveryNotices||{}))if(record.chat===chat&&!record.noticeAcknowledged){record.noticeAcknowledged=true;changed=true}
  if(changed)persist();
 }
 function allowRecoveredNotice(id,chat){
  if(owner!==state&&!storyRestoring)return true;
  const entry=stages().find(e=>e.chat===chat&&(noticeIds[e.key]||'hg-notification')===id);
  if(!entry)return true; // Other original notification flows are out of scope.
  const message=noticeMessage(entry),contact=state.contacts.find(c=>c.id===chat);
  if(!message||inside(chat)||!(contact?.unread>0))return false;
  const key=JSON.stringify([chat,message.id]),record=state.story.recoveryNotices?.[key];
  if(record?.noticeShown||record?.noticeAcknowledged)return false;
  contact.preview=message.type==='image'?'[图片]':message.text||contact.preview;
  return true;
 }
 function item(key,q,rows,prefix,reset,chat=HG_ID,show=groupNotice){
  if(!q||!rows||!Number.isInteger(q.index)||q.index<0||!rows[q.index])return null;
  const row=rows[q.index],id=prefix+q.index;
  return {key,q,chat,id,prefix,reset,show,npc:typeof row==='string'||Array.isArray(row)&&row[0]!=='me',cursor:q.phase+'|'+q.script+'|'+q.index};
 }
 function stages(){
  const s=state.story,list=[],add=x=>{if(x)list.push(x)},chat=q=>q?.phase==='chat'?q:null;
  if(state.game.day===3){
   if(s.dayThreeMorning?.phase==='chat')add(item('d3-morning',s.dayThreeMorning,d3MorningRows(),'day3-morning-',()=>d3LastTick=Date.now()));
   const e=chat(s.dayThreeEvening);if(e)add(item('d3-evening',e,d3EveningScript(e.script)?.rows,'day3-evening-'+e.script+'-',()=>d3EveningLastTick=Date.now(),e.chat,()=>notice('d3-evening-notice',d3EveningNotice)));
   const n=s.dayThreeNight;if(n?.phase==='group')add(item('d3-night',n,d3NightGroupRows(),'day3-night-group-',()=>d3NightLastTick=Date.now()));
   const d=chat(s.dayThreeLinDefense);if(d)add(item('d3-defense',d,d3DefenseRows(d.script)?.rows,'day3-lin-defense-'+d.script+'-',()=>d3DefenseLastTick=Date.now()));
   const p=chat(s.dayThreeReasoningProbe);if(p)add(item('d3-probe',p,d3ProbeRows(p.script)?.rows,'day3-probe-'+p.script+'-',()=>d3ProbeLastTick=Date.now()));
  }
  if(state.game.day===4){
   if(s.dayFourMorning?.phase==='done')add(item('d4-group',s.dayFourGroup,D4_GROUP_ROWS,'day4-morning-group-',()=>d4GroupLastTick=Date.now()));
   add(item('d4-confront',chat(s.dayFourConfrontation),D4_CONFRONT_ROWS,'day4-confront-',()=>d4ConfrontLastTick=Date.now()));
   const a=chat(s.dayFourAfterConfrontation);if(a)add(item('d4-after',a,d4AfterRows(a.script),'d4-after-'+a.script+'-',()=>d4AfterLastTick=Date.now(),a.chat,()=>notice('d4-after-notice',d4AfterNotice)));
   const d=chat(s.dayFourDebate);if(d)add(item('d4-debate',d,D4_DEBATE_SCRIPTS[d.script]?.rows,'d4-debate-'+d.script+'-',()=>d4DebateLast=Date.now(),d.chat,()=>notice('d4-debate-message',d4DebateNotice)));
   const c=chat(s.dayFourCounterattack);if(c)add(item('d4-counter',c,D4_COUNTER_SCRIPTS[c.script]?.rows,'d4-counter-'+c.script+'-',()=>d4CounterLast=Date.now(),HG_ID,()=>notice('d4-counter-notice',d4CounterNotice)));
   const f=chat(s.dayFourFinal);if(f)add(item('d4-final',f,D4_FINAL_SCRIPTS[f.script]?.rows,'d4-final-'+f.script+'-',()=>d4FinalLastTick=Date.now(),HG_ID,()=>notice('d4-final-notice',d4FinalGroupNotice)));
   if(s.dayFourFinal?.phase==='farewell')add(item('d4-farewell',s.dayFourFinal,D4_FINAL_FAREWELL,'d4-final-farewell-',()=>d4FinalLastTick=Date.now(),HG_ID,()=>notice('d4-final-notice',d4FinalGroupNotice)));
  }
  return list;
 }
 function prepare(entry,launch=false){
  const {q,chat,key}=entry,delay=messageSendDelay();
  if(!Number.isFinite(q.remaining)||q.remaining<0||q.remaining>delay)q.remaining=delay;
  entry.reset();
  if(launch&&!inside(chat)&&entry.npc&&!(state.messages[chat]||[]).some(m=>m.id===entry.id))tickets.set(key,{q,cursor:entry.cursor,count:(state.messages[chat]||[]).length});
  if(!inside(chat))recoveredNotice(entry);
 }
 function allow(key){
  if(owner!==state||pending||blocked()||document.querySelector('#overlay .sheet'))return false;
  const t=tickets.get(key),e=stages().find(x=>x.key===key);
  if(!t||!e||t.q!==e.q||t.cursor!==e.cursor||t.count!==(state.messages[e.chat]||[]).length){tickets.delete(key);return false}
  return e.npc;
 }
 function repairReport(){
  const r=state.story.dayThreeReport;
  if(state.game.day!==3||!r?.publicationComplete||!r.homeReturned)return;
  // The existing Zhou Mo conversation still owns the transition until it ends.
  if(reportGroupRemoval(state))persist();
  d3EveningAfterVote();d3NightStart();
 }
 function repairMidnight(){
  const plans=[
   [postEvening(),MIDNIGHT_RULE_ID,midnightPublish,'due'],
   [d2Night(),D2_FOURTH_RULE_ID,d2FourthPublish,'remaining'],
   [d3Night(),D3_FIFTH_RULE_ID,d3FifthPublish,'remaining']
  ];
  for(const [q,id,publish,field] of plans){
   if(!q||!['midnight-wait','midnight-notice','midnight-reading'].includes(q.phase))continue;
   // Later days retain earlier reading snapshots. Do not reopen an old rule.
   if(id===MIDNIGHT_RULE_ID&&state.story.secondMorningReady||id===D2_FOURTH_RULE_ID&&state.story.dayThreeMorning||id===D3_FIFTH_RULE_ID&&state.story.dayFourMorning)continue;
   const published=q.rulesNotified||q.rulesPublished||state.forumPosts.some(p=>p.id===id)||(state.messages[DAY_ONE_REPORT_ID]||[]).some(m=>m.id===id);
   if(q.phase!=='midnight-wait'||published||q.remaining===0||field==='due'&&Number.isFinite(q.due)&&q.due<=Date.now())publish();
   else if(!Number.isFinite(q[field])||q[field]<0){q[field]=field==='due'?Date.now()+1500:1500;persist()}
  }
 }
 function check(){
  if(owner!==state||blocked())return;
  if(pending){
   pending=false;repairReport();repairMidnight();
   for(const e of stages())prepare(e,true);
   lastRoute=view+'|'+active;persist();return;
  }
  const route=view+'|'+active;
  if(route!==lastRoute){
   lastRoute=route;tickets.clear();
   for(const e of stages())prepare(e);
  }
 }
 function reset(){owner=null;pending=false;lastRoute='';tickets.clear()}
 function request(){owner=state;pending=true;tickets.clear();try{check()}catch(error){tickets.clear();console.warn('Story recovery deferred',error)}}
 window.StoryResumeRecovery={allow,request,check,reset};
 const restore=resumeGameSnapshot;
 resumeGameSnapshot=function(...args){reset();const result=restore(...args);if(result)request();return result};
 const cleanup=cleanupStoryTimeline;
 cleanupStoryTimeline=function(...args){reset();return cleanup(...args)};
 const enterChat=openChat;
 openChat=function(id,...args){
  const entering=!inside(id),result=enterChat(id,...args);
  if(inside(id))acknowledge(id);
  if(entering&&owner===state&&!blocked()&&inside(id)){
   tickets.clear();for(const e of stages())if(e.chat===id)prepare(e);
   lastRoute=view+'|'+active;
  }
  return result;
 };
 const returnHome=reportReturnHome;
 reportReturnHome=function(...args){const result=returnHome(...args);if(result&&owner===state&&!blocked()){repairReport();for(const e of stages())prepare(e,true)}return result};
 // Guard only the chat notices used by this recovery layer, before their original
 // renderer creates DOM or plays a sound. First-play and unrelated notices pass through.
 const originalGroupNotice=hgNotice;
 hgNotice=function(kind,...args){if(kind==='group'&&!allowRecoveredNotice('hg-notification',HG_ID))return;return originalGroupNotice(kind,...args)};
 for(const [name,id,chat] of [
  ['d3EveningNotice','d3-evening-notice',()=>d3Evening()?.chat],
  ['d4AfterNotice','d4-after-notice',()=>d4After()?.chat],
  ['d4DebateNotice','d4-debate-message',()=>d4Debate()?.chat],
  ['d4CounterNotice','d4-counter-notice',()=>HG_ID],
  ['d4FinalGroupNotice','d4-final-notice',()=>HG_ID]
 ]){
  const original=window[name];
  window[name]=function(...args){if(!allowRecoveredNotice(id,chat()))return;return original.apply(this,args)};
 }
 // Native interval also observes the end of launch/restoration; it never drives messages.
 mobileNativeInterval(()=>{try{check()}catch(error){tickets.clear();console.warn('Story recovery deferred',error)}},100);
 // Track real notifications produced by the original runners as well as recovery
 // prompts. Removing their DOM is not permission to announce the same message again.
 new MutationObserver(records=>{
  if(owner!==state||blocked())return;
  const entries=stages();
  for(const change of records)for(const node of change.addedNodes){
   if(node.nodeType!==1||!node.isConnected||!node.matches('.opening-message'))continue;
   const entry=entries.find(e=>(noticeIds[e.key]||'hg-notification')===node.id&&noticeMessage(e));
   if(entry)rememberNotice(entry,node);
  }
 }).observe(document.querySelector('#phone'),{childList:true});
 window.addEventListener('pagehide',reset);
})();
