/* Choice presentation owns no story state. Deadlines start at DOM insertion,
 * survive same-chat redraws, and never advance a branch or settle an effect. */
window.ChatChoiceTiming=(()=>{
 let owner=state,chat=null,timer=null;
 const seen=new Map(),shown=new Map();
 const tail=id=>(state.messages[id]||[]).filter(m=>m.id&&m.type!=='time').slice(-1)[0];
 function reset(){
  clearTimeout(timer);timer=null;owner=state;chat=null;seen.clear();shown.clear();
  for(const id of Object.keys(state.messages||{}))seen.set(id,tail(id)?.id);
 }
 function inserted(id){
  if(owner!==state)reset();
  if(view!=='chat'||active!==id||!screen.querySelector('#messages'))return;
  if(chat!==id){for(const mark of shown.values())mark.fast=false;chat=id}
  const m=tail(id);if(!m||seen.get(id)===m.id)return;
  seen.set(id,m.id);
  shown.set(id,{id:m.id,at:Date.now(),fast:!!window.ReadHistory?.accelerating||!!screen.querySelector('#messages > :last-child[data-read-fast="true"]')});
 }
 function remaining(id=active){
  if(owner!==state){reset();return null}
  const mark=shown.get(id);if(!mark||mark.id!==tail(id)?.id)return null;
  const delay=mark.fast?Math.min(messageSendDelay(),500):messageSendDelay();
  return Math.max(0,mark.at+delay-Date.now());
 }
 function delay(){return window.ReadHistory?.accelerating||shown.get(active)?.fast?Math.min(messageSendDelay(),500):messageSendDelay()}
 // Resolve only the next authored choice; scene, vote and gameplay waits fall through.
 function choiceChat(source,q){
  if(!q)return null;
  let s;
  switch(source){
   case 'hg':return q.phase==='event'&&q.step===HG_EVENT.length?HG_ID:null;
   case 'first-morning':return q.phase==='invitation'&&q.step===FM.invitation.length?HG_ID:null;
   case 'post':s=POST_SCRIPTS[q.script];return q.phase==='chat'&&q.index===s?.rows.length&&s.choices?s.chat:null;
   case 'day2':s=DAY_TWO_AUTHORED[q.script];return q.phase==='chat'&&q.index===s?.rows.length&&s.choices?dayTwoChat(q):null;
   case 'pickup-record':s=RECORD_SCRIPTS[q.script];return q.phase==='script'&&!q.typing&&!s?.[q.index-1]?.pause&&!s?.[q.index-1]?.typing&&s?.[q.index]?.choices?HG_ID:null;
   case 'evening-anomaly':return q.phase==='messages'&&EVENING_ROWS[q.index]?.[0]==='choice'?HG_ID:null;
   case 'd3-probe':s=d3ProbeRows(q.script);if(q.index===s?.rows.length){const key=q.script==='evidence'?'day3-self-proof':q.script==='counter'?'day3-zhao-defense':null;if(key&&groupAdditionNext(key))return null}return q.phase==='chat'&&q.index===s?.rows.length&&s.choice?HG_ID:null;
   case 'day3-evening':s=d3EveningScript(q.script);return q.phase==='chat'&&q.index===s?.rows.length&&s.choice?q.chat:null;
   case 'd4-after':return q.phase==='chat'&&['group','private'].includes(q.script)&&q.index===d4AfterRows(q.script).length?q.chat:null;
   case 'd4-a':return q.phase==='chat'&&D4_A_SCRIPTS[q.script]?.[q.index]?.options?q.chat:null;
   case 'd4-debate':s=D4_DEBATE_SCRIPTS[q.script];return q.phase==='chat'&&q.index===s?.rows.length&&s.options?q.chat:null;
  }
  return null;
 }
 function waiting(source,q){
  if(window.mobileLaunch||storyRestoring||document.hidden||view!=='chat')return null;
  try{const id=choiceChat(source,q);if(!id||id!==active)return null;const rest=remaining(id);return rest===null?null:rest>0}catch{return null}
 }
 const style=document.createElement('style');
 style.textContent='.chat-page .zero-choices[data-choice-wait]{display:none!important}';document.head.append(style);
 function refresh(){
  clearTimeout(timer);timer=null;
  if(owner!==state)reset();
  if(view!=='chat'||window.mobileLaunch||storyRestoring){for(const mark of shown.values())mark.fast=false;chat=null;return}
  if(chat!==active){for(const mark of shown.values())mark.fast=false;chat=active}
  inserted(active);
  const rest=remaining(),boxes=screen.querySelectorAll('.chat-page .zero-choices');let released=false;
  for(const box of boxes){
   const pending=rest!==null&&rest>0;
   if(pending&&!box.hasAttribute('data-choice-wait'))box.setAttribute('data-choice-wait','');
   else if(!pending&&box.hasAttribute('data-choice-wait')){box.removeAttribute('data-choice-wait');released=true}
  }
  if(released)scrollMessages();
  if(boxes.length&&rest>0){const original=state,id=active;timer=setTimeout(()=>{timer=null;if(state===original&&active===id&&view==='chat')refresh()},rest)}
 }
 const base=openChat;
 openChat=function(id,...args){const result=base(id,...args);inserted(id);return result};
 new MutationObserver(refresh).observe(screen,{childList:true,subtree:true});
 window.addEventListener('click',event=>{
  if(view!=='chat'||!event.target.closest('.zero-choices'))return;
  if((remaining()||0)>0){event.preventDefault();event.stopImmediatePropagation()}
 },true);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){clearTimeout(timer);timer=null;for(const mark of shown.values())mark.fast=false}else refresh()});
 reset();
 return {waiting,delay,refresh,reset};
})();
function storyChoiceDelay(){return window.ChatChoiceTiming?.delay()??messageSendDelay()}

/* A player's first line in each reply turn waits for an explicit click. */
function confirmStoryReply(token){
 (state.story.replyConfirmations??={})[token]=true;
 if(state.story.pendingPlayerReply?.token===token){delete state.story.pendingPlayerReply;screen.querySelector('[data-story-reply-box]')?.remove()}
}
function storyReplyGate(chat,text,token,runner,forceClick=false){
 if(!state.story)return false;
 const approved=state.story.replyConfirmations??={};
 if(approved[token]){confirmStoryReply(token);return false}
 const rows=state.messages[chat]||[];let last;
 for(let i=rows.length-1;i>=0;i--)if(rows[i].sender&&!['system','recalled','time'].includes(rows[i].type)){last=rows[i];break}
 if(last?.sender==='me'&&!forceClick){confirmStoryReply(token);return false}
 const pending=state.story.pendingPlayerReply;
 if(!pending){state.story.pendingPlayerReply={chat,text,token,runner};persist();renderStoryReply()}
 else if(pending.token===token)renderStoryReply();
 return true;
}
function renderStoryReply(){
 if(hospitalPhoneMode()){screen.querySelector('[data-story-reply-box]')?.remove();return}
 const p=state.story?.pendingPlayerReply,old=screen.querySelector('[data-story-reply-box]');
 if(p&&state.story.replyConfirmations?.[p.token]){delete state.story.pendingPlayerReply;old?.remove();persist();return}
 if(!p||view!=='chat'||active!==p.chat){old?.remove();return}
 if(old?.dataset.storyReplyBox===p.token)return;
 old?.remove();const composer=screen.querySelector('#composer');if(!composer)return;
 composer.querySelectorAll('button,textarea').forEach(el=>el.disabled=true);
 composer.insertAdjacentHTML('beforebegin','<div class="zero-choices" data-story-reply-box="'+esc(p.token)+'"><button type="button" data-story-reply="'+esc(p.token)+'">'+esc(p.text)+'</button></div>');
 scrollMessages();
}
document.addEventListener('click',event=>{
 const button=event.target.closest('[data-story-reply]'),p=state.story?.pendingPlayerReply;
 if(!button||!p||p.token!==button.dataset.storyReply||view!=='chat'||active!==p.chat)return;
 event.preventDefault();confirmStoryReply(p.token);
 screen.querySelector('[data-story-reply-box]')?.remove();persist();
 const resume={d3ProbeTick:()=>d3ProbeTick(),d3DefenseTick:()=>d3DefenseTick(),d3ZhouTick:()=>d3ZhouTick(),zeroStep:()=>zeroStep(),faTick:()=>faTick(),recordDiscussionTick:()=>recordDiscussionTick(),postEveningTick:()=>postEveningTick(),mengErrorTick:()=>mengErrorTick(),leakAdvance:()=>leakAdvance(leakState()),dayTwoAdvance:()=>dayTwoAdvance(dayTwoState())}[p.runner];
 if(resume)resume();
});
new MutationObserver(renderStoryReply).observe(screen,{childList:true,subtree:true});
