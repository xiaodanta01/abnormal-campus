/* Second-day morning, versioned independently from the first-day official release. */
const DAY_TWO_VERSION=1;
function dayTwoChat(q){const chat=DAY_TWO_AUTHORED[q.script]?.chat;return chat==='meng'?POST_MENG_ID:chat==='jiang'?JX.id:HG_ID}
function dayTwoState(){return state.story.jiangAliveMorning?.dayTwoVersion?state.story.jiangAliveMorning:state.story.mengshuLeakConfrontation}
function dayTwoPerson(who){
 if(who==='supporter')who=state.game.departedNpcs?.cheng?'wen':'cheng';
 if(LEAK_PEOPLE[who])return LEAK_PEOPLE[who];
 const person=FA_PEOPLE[who],name=GROUP_SUSPECT_NAMES[who]||who,room=person?.room||FA_ROSTER.match(new RegExp(name+'(\\d{3})'))?.[1];
 return {name:room?name+'（'+room+'）':name,avatar:person?.avatar||PORTRAIT_CHARACTERS[name]||C.avatars.find(a=>a.name===name)?.id||'student0'};
}
function dayTwoStart(kind){
 const slot=kind==='alive'?'jiangAliveMorning':'mengshuLeakConfrontation',previous=state.story[slot];
 if(previous?.dayTwoVersion===DAY_TWO_VERSION||previous?.phase==='done')return;
 if(previous?.effects){
  const effects={privateWhy:[0,10],privateBet:[0,-2],firstWrong:[-5,0],firstRight:[5,0],secondRight:[5,10],secondWrong:[0,5]},day=suspicionDay();
  for(const [name,[trust,danger]] of Object.entries(effects))if(previous.effects[name]){state.game.otherTrust=(state.game.otherTrust||0)-trust;state.game.dangerValue=postDanger()-danger;const event='meng-leak-'+name;if(!day.result&&day.events[event]){for(const [who,value] of Object.entries(day.events[event]))day.scores[who]-=value;delete day.events[event]}}
 }
 if(previous?.phase){for(const chat of [HG_ID,POST_MENG_ID,JX.id])state.messages[chat]=(state.messages[chat]||[]).filter(m=>!m.id?.startsWith('meng-leak-'));delete state.story.pendingPlayerReply;}
 state.story[slot]={dayTwoVersion:DAY_TWO_VERSION,kind,phase:'chat',script:kind==='alive'?'aliveMeng':'intro',index:0,due:Date.now(),decisions:{},effects:{},date:state.system.date};
 state.story.secondMorningMainReady=false;state.system.time='09:01';persist();
 const q=state.story[slot];dayTwoAdvance(q);
 if(view==='chat'&&active===dayTwoChat(q))openChat(active);else if(kind==='alive')aliveNotice(dayTwoChat(q));
}
function dayTwoMorningTick(){
 if(window.mobileLaunch||document.hidden||['game-menu','nodes','zero-death'].includes(view)||state.game.survivalEnding)return;
 const receipt=secondNightResult();if(!receipt?.groupApplied)return;
 if(state.story.linAfterConflict){if(state.story.linAfterConflict.phase!=='done')leakAdvance(state.story.linAfterConflict);return}
 const kind=receipt.target==='jiang'?'death':'alive';dayTwoStart(kind);
 const q=dayTwoState();if(q?.dayTwoVersion===DAY_TWO_VERSION)dayTwoAdvance(q);
}
function dayTwoGoto(q,next){
 if(next==='aliveJiang')aliveUnlockGossip();
 const before=dayTwoChat(q);q.script=next;q.index=0;q.phase='chat';q.typing=null;q.due=Date.now()+messageSendDelay();persist();
 const chat=dayTwoChat(q);if(chat!==before){q.due=Date.now();dayTwoAdvance(q)}
 if(view==='chat'&&active===chat)openChat(chat);
 else if(chat!==before&&chat!==HG_ID)aliveNotice(chat);
}
function dayTwoFinish(q,result){
 if(q.phase==='done')return;q.phase='done';q.result=result;q.pending=false;
 if(!q.effects[result]){
  q.effects[result]=true;
  if(result==='publicSuccess'){state.game.dangerValue=postDanger()-5;state.game.otherTrust=(state.game.otherTrust||0)+10;addGroupSuspicion('day2-authored-public-success',{mengshu:50})}
  if(result==='playerSuspicion')addGroupSuspicion('day2-authored-player-suspicion',{me:80});
  if(result==='aliveDone'){state.game.npcSecrets??={};state.game.npcSecrets.jiangxiao??={};Object.assign(state.game.npcSecrets.jiangxiao,{secondDayAlive:true,archivistDisclosedToPlayer:true})}
 }
 const optional=q.kind==='death'&&linAfterEligible();
 state.story.secondMorningMainReady=!optional;
 if(!optional)state.system.time='09:51';persist();if(view==='chat')openChat(active);
}
function dayTwoAdvance(q){
 if(!q||q.dayTwoVersion!==DAY_TWO_VERSION||q.phase!=='chat'||Date.now()<q.due||window.mobileLaunch||['game-menu','nodes','zero-death'].includes(view))return;
 const script=DAY_TWO_AUTHORED[q.script];if(!script)return;
 const row=script.rows[q.index];
 if(!row){
  if(script.choices){q.phase='choice';persist();dayTwoDecorate();dayTwoCapture(q)}
  else if(script.next)dayTwoGoto(q,script.next);else dayTwoFinish(q,script.end);
  return;
 }
 if(row[2]==='speakerAlive'&&reportDeparted(GROUP_SUSPECT_NAMES[row[0]],state)){q.index++;q.due=Date.now();persist();return}
 if(row[2]==='zhaoAlive'&&state.game.departedNpcs?.zhao){q.index++;q.due=Date.now();persist();return}
 if(row[2]==='sharedNoodles'&&state.story.noodleEvening?.choices?.taste!==1){q.index++;q.due=Date.now();persist();return}
 if(row[0]==='typing'){q.index++;q.typing=row[1];q.due=Date.now()+row[2];persist();dayTwoDecorate();return}
 const chat=dayTwoChat(q),text=row[1].replaceAll('【玩家名字】',state.profile.name).replaceAll('【玩家】',state.profile.name),token='day2:'+q.script+':'+q.index;
 if(row[0]==='me'&&storyReplyGate(chat,text,token,'dayTwoAdvance',row[2]==='forceReply'))return;
 q.typing=null;const id='day2-authored-'+q.script+'-'+q.index,rows=state.messages[chat]??=[],mine=row[0]==='me',person=mine?null:dayTwoPerson(row[0]);
 if(!rows.some(m=>m.id===id))rows.push({id,type:'text',sender:mine?'me':person.avatar,name:mine?state.profile.name:person.name,text,time:state.system.time,gameDate:state.system.date,status:'read'});
 q.index++;q.due=Date.now()+messageSendDelay();
 const contact=state.contacts.find(c=>c.id===chat);if(contact){contact.preview=text;contact.time=state.system.time;if(!mine&&!(view==='chat'&&active===chat))contact.unread=(contact.unread||0)+1}
 persist();if(view==='chat'&&active===chat)openChat(chat);else if(view==='messages')chatList();else status();
}
function dayTwoDecorate(){
 screen.querySelectorAll('[data-day2-options],.day2-typing').forEach(el=>el.remove());
 const q=dayTwoState();if(!q?.dayTwoVersion||q.phase==='done'||view!=='chat'||active!==dayTwoChat(q))return;
 const composer=screen.querySelector('#composer');if(!composer)return;
 composer.querySelectorAll('button,textarea').forEach(el=>el.disabled=true);
 if(q.phase==='choice')composer.insertAdjacentHTML('beforebegin','<div class="zero-choices" data-day2-options>'+DAY_TWO_AUTHORED[q.script].choices.map((c,i)=>'<button type="button" data-day2-choice="'+i+'" data-day2-token="'+q.script+'">'+esc(c.label)+'</button>').join('')+'</div>');
 if(q.typing&&Date.now()<q.due)screen.querySelector('#messages')?.insertAdjacentHTML('beforeend','<div class="message fa-typing day2-typing">'+avatar(dayTwoPerson(q.typing).avatar)+'<div class="bubble"><span>正在输入</span><i></i><i></i><i></i></div></div>');
 scrollMessages();
}
function dayTwoChoose(index,token){
 const q=dayTwoState(),choice=q&&DAY_TWO_AUTHORED[q.script]?.choices?.[index];
 if(!q||q.phase!=='choice'||q.script!==token||!choice||view!=='chat'||active!==dayTwoChat(q)||q.decisions[token]!==undefined)return;
 q.decisions[token]=index;
 if(token==='publicSupport'&&index===0)dayTwoScheduleCouncilDeath(q);
 if(DAY_TWO_AUTHORED[choice.next].rows[0]?.[0]==='me')confirmStoryReply('day2:'+choice.next+':0');
 dayTwoGoto(q,choice.next);
 const row=DAY_TWO_AUTHORED[q.script].rows[0];
 if(row?.[0]==='me'&&q.index===0){q.due=Date.now();dayTwoAdvance(q)}
 else if(choice.next==='none'){q.due=Date.now();dayTwoAdvance(q)}
}
const dayTwoNodeKeys=['intro','private','public','publicVerify','publicConfirm','publicSupport','publicBet','aliveMeng','aliveJiang','aliveTrust'];
for(const key of dayTwoNodeKeys)STORY_CHOICES.push({id:'day2-script-'+key,title:DAY_TWO_AUTHORED[key].title,day:'第二日 · 09:01',chat:DAY_TWO_AUTHORED[key].chat==='meng'?POST_MENG_ID:DAY_TWO_AUTHORED[key].chat==='jiang'?JX.id:HG_ID});
function dayTwoCapture(q){if(!q||!dayTwoNodeKeys.includes(q.script)||q.phase!=='choice'||q.decisions?.[q.script]!==undefined)return;return d2Capture('day2-script-'+q.script,{view:'chat',active:dayTwoChat(q)})}
const dayTwoBaseDecorate=leakDecorate;leakDecorate=function(...args){if(leakState()?.dayTwoVersion)return dayTwoDecorate();return dayTwoBaseDecorate(...args)};
const dayTwoBaseChat=leakChat;leakChat=function(){const q=leakState();return q?.dayTwoVersion?dayTwoChat(q):dayTwoBaseChat()};
const dayTwoBaseAdvance=leakAdvance;leakAdvance=function(q){return q?.dayTwoVersion?dayTwoAdvance(q):dayTwoBaseAdvance(q)};
const dayTwoBaseNoticeOpen=actions['alive-morning-open'];actions['alive-morning-open']=()=>{const q=dayTwoState();if(!q?.dayTwoVersion)return dayTwoBaseNoticeOpen();document.querySelector('#alive-morning-notice')?.remove();openChat(dayTwoChat(q))};
const dayTwoRemoval=secondNightRemove;secondNightRemove=function(){dayTwoRemoval();if(secondNightResult()?.groupApplied&&secondNightResult().target==='qiyue')dayTwoStart('alive')};
// Use the same eligibility predicate for the notification and main-story continuation.
const dayTwoLinFinish=leakFinish;leakFinish=function(result){const value=dayTwoLinFinish(result);if(result.startsWith('linAfterPlus')&&state.story.secondMorningMainReady){state.system.time='09:51';persist()}return value};
document.addEventListener('click',event=>{const b=event.target.closest('[data-day2-choice]');if(b){event.preventDefault();dayTwoChoose(Number(b.dataset.day2Choice),b.dataset.day2Token)}});
function dayTwoScheduleCouncilDeath(q){if(!q?.dayTwoVersion||q.kind!=='death'||q.decisions?.publicSupport!==0||state.story.dayTwoNightDeath)return;state.story.dayTwoNightDeath={date:q.date||state.system.date,scheduled:true,applied:false,reason:'public-council-accusation'};persist()}
// This reply now defers to the final group vote, including when resuming old saves.
function migrateDayTwoMotiveOutcome(progress){
 const story=progress?.story;if(!story)return false;let changed=false;
 if(story.dayTwoNightDeath?.reason==='public-motive-question'){delete story.dayTwoNightDeath;changed=true}
 const q=story.mengshuLeakConfrontation;
 if(q?.dayTwoVersion&&(q.script==='publicMotivesEnd'||q.decisions?.publicBet===1)){
  if(q.result==='nightDeath'){q.result='voteOutcome';changed=true}
  if(q.effects?.nightDeath){delete q.effects.nightDeath;q.effects.voteOutcome=true;changed=true}
 }
 return changed;
}
if(migrateDayTwoMotiveOutcome(state))persist();
{const records=nodeRecords();let changed=false;for(const record of Object.values(records))if(migrateDayTwoMotiveOutcome(record.checkpoint))changed=true;if(changed)saveNodes(records)}
function dayTwoNightTick(){
 if(state.story.dayTwoReport?.publicationComplete)return;
 if(window.mobileLaunch||document.hidden||['game-menu','nodes','zero-death'].includes(view)||state.game.survivalEnding)return;
 const q=state.story.mengshuLeakConfrontation;dayTwoScheduleCouncilDeath(q);
 const date=dayTwoState()?.date;
 // The published group vote takes precedence over the later nighttime elimination.
 if(state.game.day>=2&&date&&(state.system.date>date||state.system.date===date&&state.system.time>='22:00')&&highestGroupSuspicion(date)?.target==='me'){
  const result=settleGroupSuspicion(date);if(result?.target==='me'){persist();beginLateDeath('group-vote');return}
 }
 const pending=state.story.dayTwoNightDeath;if(!pending?.scheduled||pending.applied||pending.reason!=='public-council-accusation')return;
 if(state.system.date>pending.date||state.system.date===pending.date&&state.system.time>='22:00'){pending.applied=true;persist();beginLateDeath('day2-council-accusation')}
}
setInterval(dayTwoNightTick,250);
