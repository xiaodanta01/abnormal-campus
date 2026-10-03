/* Evening accusation. All cursors and vote effects belong to the loaded snapshot. */
const D4_COUNTER_PHOTO='assets/day4-lin-outside-evidence.jpg';
const D4_COUNTER_SCRIPTS={
 opening:{rows:[['shen','我觉得有件事大家必须知道'],['shen','我不想看着大家相信一个错误的人'],['shen','我也不想看着大家被欺骗'],['shen','何雨，你来说吧'],['heyu','我在窗边看见林晴走出了宿舍楼'],['heyu','一开始我也不敢确定是她'],['heyu','可没过多久，她又从外面回来了'],['heyu','还拿着学校便利店的袋子'],['gunian','她真的离开宿舍楼了？'],['heyu','我看得很清楚'],['heyu','就是林晴'],['shen','林晴不但出去了'],['shen','还安然无恙地回来了'],['shen','这说明什么'],['shen','应该不用我替大家解释了吧？']],vote:'first',next:'accuse'},
 accuse:{rows:[['gunian','而且别忘了'],['gunian','【玩家名字】是一直和林晴在一起的'],['gunian','如果【玩家名字】是普通生，她怎么可能一点事都没有？'],['jiangning','难怪她一直护着林晴'],['supporter','我说呢']],vote:'second',next:'defend'},
 defend:{rows:[['heyu','【玩家名字】申请成为委托人'],['heyu','就是为了把所有普通生的票骗到手里吧'],['lin','不是这样的']],options:['一张嘴就在这造谣，好威风啊','光说谁不会，证据呢？我还说我看见何雨出宿舍楼了呢'],next:'photo'},
 photo:{rows:[['heyu','我就知道你们不会承认'],['heyu','林晴离开宿舍楼的照片','image'],['heyu','这是我刚才拍到的'],['heyu','照片里的人是不是林晴'],['heyu','你们自己看'],['baizhi','真的是林晴……'],['gunian','现在还有什么好说的？']],vote:'third',next:'last'},
 last:{rows:[['shen','【玩家名字】，你还准备继续骗大家吗？']],next:'collapse'}
};
const D4_COUNTER_NARRATION=['沈可欣甚至不需要继续煽动。','群里的人已经开始自行补全剩下的部分，将一张张委托从你的名字下面移走。','照片是真的，但你和林晴必须咬死不认。','现在，你得想出一个足以扭转局面的反击之策'];
function d4Counter(){return state.story.dayFourCounterattack}
function d4CounterCounts(){return {shen:d4DelegationVoteCount('shen'),me:d4DelegationVoteCount('me')}}
function d4CounterHistory(){
 const history=[{label:'委托开放',shen:12,me:0},{label:'何安、韩露委托',shen:12,me:2},{label:'黄依依退出委托人',shen:12,me:5}];
 let shen=12,me=5;const effects=d4Debate()?.effects||{};
 for(let n=1;n<=3;n++){const effect=effects['good'+n]||effects['bad'+n];if(!effect)break;shen+=effect.shen;me+=effect.me;history.push({label:['第一次公开辩论','第二次公开辩论','第三次公开辩论'][n-1],shen,me})}
 if(effects.rescue){shen+=effects.rescue.shen;me+=effects.rescue.me;history.push({label:'林晴公开回应后',shen,me})}
 return history;
}
function d4CounterBegin(){
 if(state.game.day!==4||!state.story.dayFourPickup?.done||d4Counter())return;
 state.story.dayFourCounterattack={phase:'waiting',script:'opening',index:0,remaining:1600,effects:{},history:d4CounterHistory(),before:d4CounterCounts(),choice:null,narrationIndex:0};
 state.system.time='19:57';state.game.period='晚上';persist();status();
}
function d4CounterInside(){return view==='chat'&&active===HG_ID}
function d4CounterNotice(){if(!d4Counter()||d4CounterInside())return;d4ATop('d4-counter-notice','讯息 · 19:57','女生B栋临时互助群',hgContact()?.preview||'沈可欣发来新消息','d4-counter-chat')}
function d4CounterWrite(who,text,id,type='text'){
 const rows=state.messages[HG_ID]??=[];if(rows.some(m=>m.id===id))return;
 const person=dayTwoPerson(who);text=d4DebateText(text);
 rows.push({id,type,sender:who==='me'?'me':person.avatar,name:who==='me'?state.profile.name:who==='heyu'?'何雨（305）':who==='gunian'?'顾念（303）':person.name,hgWho:who,text,time:'19:57',gameDate:state.system.date,status:'read',...(type==='image'?{src:D4_COUNTER_PHOTO}:{})});
 const c=hgContact();if(c){c.preview=type==='image'?'[图片]':text;c.time='19:57';if(!d4CounterInside())c.unread=(c.unread||0)+1}
 persist();if(d4CounterInside())openChat(HG_ID);else d4CounterNotice();
}
function d4CounterGo(script){const q=d4Counter();if(script==='collapse'){q.phase='collapse';q.collapseFrom=d4CounterCounts();q.remaining=4200;persist();d4CounterCollapse();return}q.script=script;q.index=0;q.phase='chat';q.remaining=messageSendDelay();persist()}
function d4CounterVote(key){
 const q=d4Counter(),d=d4Delegation();if(q.effects[key])return;
 const before=d4CounterCounts();if(before.me<1)return;
 d.voteChanges??={};d.voteChanges.me=(d.voteChanges.me||0)-1;d.voteChanges.shen=(d.voteChanges.shen||0)+1;
 q.effects[key]={shen:1,me:-1};q.history.push({label:key==='third'?'照片公开后':key==='first'?'目击指控后':'同伴关系遭质疑后',...d4CounterCounts()});q.phase='vote';persist();d4CounterVoteNotice();
}
function d4CounterVoteNotice(){d4VoteModal('有1份委托由你转交给沈可欣','沈可欣：'+d4DelegationVoteCount('shen')+'票｜你：'+d4DelegationVoteCount('me')+'票','d4-counter-vote-ack')}
function d4CounterSettle(){
 const q=d4Counter();if(q.effects.final)return;const before=d4CounterCounts(),d=d4Delegation();
 // Final authored totals; a withdrawn delegation stays unassigned instead of becoming an extra vote.
 const delta={shen:16-before.shen,me:3-before.me};d.voteChanges??={};for(const key of ['shen','me'])d.voteChanges[key]=(d.voteChanges[key]||0)+delta[key];
 q.withdrawn=Math.max(0,before.shen+before.me-19);d.withdrawnDelegations=(d.withdrawnDelegations||0)+q.withdrawn;q.effects.final=delta;q.history.push({label:'照片引发的委托变化',shen:16,me:3});
}
function d4CounterDecorate(){
 if(!d4CounterInside())return;screen.querySelector('[data-d4-counter-options]')?.remove();document.querySelector('#d4-counter-notice')?.remove();
 if(d4Counter()?.phase==='choice'){screen.querySelector('#composer')?.insertAdjacentHTML('beforebegin','<div class="zero-choices" data-d4-counter-options>'+D4_COUNTER_SCRIPTS.defend.options.map((label,i)=>'<button data-d4-counter-choice="'+i+'">'+esc(label)+'</button>').join('')+'</div>');d4CaptureCheckpoint('day4-counter-choice',{view:'chat',active:HG_ID})}
 scrollMessages();
}
function d4CounterChoose(i){const q=d4Counter(),label=D4_COUNTER_SCRIPTS.defend.options[i];if(!q||q.phase!=='choice'||q.choice!==null||!d4CounterInside()||!label)return;q.choice=i;d4CounterGo('photo');d4CounterWrite('me',label,'d4-counter-choice')}
function d4CounterCollapse(){
 const q=d4Counter();if(q?.phase!=='collapse')return;
 if(!d4CounterInside())openChat(HG_ID);
 view='day4-counter-collapse';active=null;rememberRoute();zeroChrome();
 screen.querySelector('.chat-page')?.classList.add('counter-blur');screen.querySelector('.counter-tally')?.remove();
 screen.insertAdjacentHTML('beforeend','<div class="counter-tally"><p>沈可欣 <span>↑</span><strong data-counter-shen></strong></p><p>'+esc(state.profile.name)+' <span>↓</span><strong data-counter-me></strong></p></div>');d4CounterDrawCounts();persist();
}
function d4CounterDrawCounts(){const q=d4Counter();if(!q)return;const t=Math.min(1,Math.max(0,1-q.remaining/4200));for(const key of ['shen','me']){const el=screen.querySelector('[data-counter-'+key+']');if(el)el.textContent=String(Math.round(q.collapseFrom[key]+(({shen:16,me:3}[key])-q.collapseFrom[key])*t))}}
function d4CounterNarrate(){
 const q=d4Counter();if(!q||!['narration','prompt'].includes(q.phase))return;
 closeSheet();stopReading();view='day4-counter-narration';active=null;rememberRoute();zeroChrome();screen.innerHTML='<section class="rd-cg counter-narration"></section>';
 if(q.phase==='prompt')screen.firstElementChild.innerHTML='<div class="counter-prompt"><p>或许可以从票数入手</p><button class="reason-primary" data-action="d4-counter-reason">开始推理</button></div>';
 else CGDialogue.present(screen.firstElementChild,D4_COUNTER_NARRATION,{index:q.narrationIndex,onIndex:i=>{if(d4Counter()===q){q.narrationIndex=i;persist()}},onComplete:()=>{if(d4Counter()!==q)return;q.phase='prompt';persist();d4CounterNarrate()}});
 persist();
}
let d4CounterLast=0,d4CounterSave=0;
function d4CounterTick(){
 if(d3Paused()||state.game.day!==4){d4CounterLast=0;return}d4CounterBegin();const q=d4Counter();if(!q)return;
 const now=Date.now(),elapsed=d4CounterLast?Math.min(500,now-d4CounterLast):0;d4CounterLast=now;
 if(q.phase==='waiting'){q.remaining=Math.max(0,q.remaining-elapsed);if(!q.remaining){q.phase='chat';q.index=1;q.remaining=messageSendDelay();d4CounterWrite('shen',D4_COUNTER_SCRIPTS.opening.rows[0][1],'d4-counter-opening-0')}}
 else if(q.phase==='chat'&&d4CounterInside()&&!document.querySelector('#overlay .sheet')){
  q.remaining=Math.max(0,q.remaining-elapsed);if(!q.remaining){const def=D4_COUNTER_SCRIPTS[q.script],row=def.rows[q.index];if(row){const who=d4DebateWho(row[0]);q.index++;q.remaining=messageSendDelay();if(d4DebatePresent(who))d4CounterWrite(who,row[1],'d4-counter-'+q.script+'-'+(q.index-1),row[2]);else persist()}
  else if(def.vote)d4CounterVote(def.vote);else if(def.options){q.phase='choice';persist();d4CounterDecorate()}else d4CounterGo(def.next)}
 }else if(q.phase==='vote'&&!document.querySelector('#overlay .sheet'))d4CounterVoteNotice();
 else if(q.phase==='collapse'&&view==='day4-counter-collapse'){q.remaining=Math.max(0,q.remaining-elapsed);d4CounterDrawCounts();if(!q.remaining){d4CounterSettle();q.phase='narration';persist();d4CounterNarrate()}}
 if(now-d4CounterSave>1000){d4CounterSave=now;persist()}
}
Object.assign(actions,{
 'd4-counter-chat':()=>openChat(HG_ID),
 'd4-counter-vote-ack':()=>{const q=d4Counter();if(q?.phase!=='vote')return;closeSheet();d4CounterGo(D4_COUNTER_SCRIPTS[q.script].next)},
 'd4-counter-reason':()=>{const q=d4Counter();if(q?.phase!=='prompt')return;q.phase='reasoning';d4VoteReason();persist();d4VoteReasonPanel()}
});
const d4CounterChatBase=openChat;openChat=function(...args){const result=d4CounterChatBase(...args);d4CounterDecorate();return result};
const d4CounterHomeBase=home;home=function(...args){const q=d4Counter();if(!d3Paused()&&state.game.day===4){if(q?.phase==='collapse')return d4CounterCollapse();if(['narration','prompt'].includes(q?.phase))return d4CounterNarrate()}const result=d4CounterHomeBase(...args);if(view==='home')d4CounterBegin();return result};
const d4CounterResumeBase=resumeStoryScene;resumeStoryScene=function(snapshot,...args){
 if(snapshot?.game?.day!==4||!snapshot.story?.dayFourCounterattack)return d4CounterResumeBase(snapshot,...args);
 
 const q=d4Counter();if(q.phase==='collapse')d4CounterCollapse();else if(['narration','prompt'].includes(q.phase))d4CounterNarrate();else if(q.phase==='reasoning')d4VoteReasonPanel();else if(snapshot.story.route?.view==='chat'||['choice','vote'].includes(q.phase))openChat(HG_ID);else home();
 if(q.phase==='vote')d4CounterVoteNotice();else if(q.phase==='chat'&&!d4CounterInside())d4CounterNotice();persist();
};
const d4CounterCleanupBase=cleanupSceneResume;cleanupSceneResume=function(...args){d4CounterLast=0;document.querySelector('#d4-counter-notice')?.remove();document.querySelector('#d4-vote-reason-drawer')?.remove();return d4CounterCleanupBase(...args)};
document.addEventListener('click',e=>{const b=e.target.closest('[data-d4-counter-choice]');if(b)d4CounterChoose(Number(b.dataset.d4CounterChoice))});
setInterval(d4CounterTick,100);
