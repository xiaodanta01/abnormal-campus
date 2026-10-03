/* Anonymous review follows the application; scores and outcomes rewind with the story. */
const D3_REVIEW_NODE='day3-anonymous-review';
const D3_REVIEW_MESSAGE='问卷已收集完毕，请查看你被分配到的问卷答案';
const D3_REVIEW_NOTES=['请分别对申请人的「留校价值」进行评分。','评分范围：1—5分。','两份答卷不得给予相同分数。','所有评分将计入最终综合评价。','综合评分最低者，取消留校资格。'];
const D3_REVIEW_PAPERS={
 A:`我真的比别人更值得留下来吗？
我胆小，怕孤单，也怕被欺骗、被背叛。
我不像朋友那样，能扛住那么大的压力。
甚至只要有人对我好一点，我就会忍不住相信他——
这大概是我最大的缺点吧。

我当然想留下来。
或者说，我想活下去。

可如果活下去的代价，是必须有一个人消失……
就算最后留下来的人是我，
剩下的时间，我真的能心安理得地度过吗？`,
 B:`我能控制好自己的情绪，遵守规则，也能照顾好自己。
我不会因为个人情绪，给别人添麻烦。

我更看重实际情况和确凿的证据。
其他的，都可以往后放一放。

留下的人越可靠，或许就能有更多人活下来。
至少……比起那些不稳定、容易被情绪左右的人，
我应该更值得被留下吧。`
};
STORY_CHOICES.push({id:D3_REVIEW_NODE,title:'匿名答卷评审',day:'第三日 · 问卷结束后',chat:null});
function d3Review(){return state.story.dayThreeReview}
function d3ReviewMigrateTarget(){
 let correctedSpeaker=false;for(const row of state.messages[HG_ID]||[])if(row.id?.startsWith('day3-morning-')&&row.hgWho==='xutang'){Object.assign(row,{hgWho:'xianing',name:'夏宁（101）',sender:dayTwoPerson('xianing').avatar});correctedSpeaker=true}if(correctedSpeaker)persist();
 const r=d3Review();if(r?.target!=='xutang')return;r.target='xianing';
 if(r.departureApplied){
  state.game.departedNpcs??={};const group=hgContact(),already=state.game.departedNpcs.xianing;
  // The old review already charged the population once. Transfer that removal;
  // Day 2 migration accounts separately for Li Tian's additional departure.
  if(!already&&group){const members=group.members||[],ids=['xianing',PORTRAIT_CHARACTERS['夏宁'],dayTwoPerson('xianing').avatar];let i=members.findIndex(id=>ids.includes(id));if(i<0)i=members.findLastIndex(id=>id.startsWith('stranger-'));if(i>=0)members.splice(i,1);hg().count=Math.max(0,hg().count-1);group.status='群成员：'+hg().count+'人'}
  state.game.departedNpcs.xianing={date:r.date,cause:'day3-anonymous-review'};
  const message=(state.messages[HG_ID]||[]).find(m=>m.id==='day3-review-removal');if(message){const old=message.text;message.text='沈可欣已将夏宁（101）移出群聊';if(group?.preview===old)group.preview=message.text}
  for(const c of state.contacts)if(c.id==='xianing'||c.name?.replace(/[（(].*$/,'').trim()==='夏宁'){c.status='已离校';c.online=false}
  for(const f of [state.story.freeAction,state.story.dayTwoFreeAction])for(const clue of f?.clues||[])if(clue.id==='members')clue.removedMembers=[...new Set([...(clue.removedMembers||[]),'xianing'])];
 }
 persist();
}
function d3ReviewVisible(){return view==='day3-review'}
function d3ReviewLatestNotice(){return (state.messages[DAY_ONE_REPORT_ID]||[]).at(-1)?.id==='day3-review-assigned'}
function d3ReviewValid(scores){return ['A','B'].every(id=>Number.isInteger(scores?.[id])&&scores[id]>=1&&scores[id]<=5)&&scores.A!==scores.B}
function d3ReviewSchedule(){
 if(state.game.day!==3||d3Survey()?.phase!=='done'||d3Review())return;
 state.story.dayThreeReview={phase:'waiting',date:state.system.date,remaining:2000,scores:{A:null,B:null},read:{},rating:null,instructionsAccepted:false};persist();
}
function d3ReviewNotice(){
 const r=d3Review();if(r?.phase!=='notice'||d3Paused())return;
 document.querySelector('#d3-review-notice')?.remove();document.querySelector('#d3-zhou-notice')?.remove();
 const el=document.createElement('div');el.id='d3-review-notice';el.className='opening-message';
 el.innerHTML='<button class="opening-body" data-action="day3-review-chat"><span>'+avatar('chat_report_black')+'</span><span><small>讯息 · 现在</small><strong></strong><span>'+esc(D3_REVIEW_MESSAGE)+'</span></span></button>';
 document.querySelector('#phone').append(el);
}
function d3ReviewSend(){
 const r=d3Review();if(r?.phase!=='waiting')return;
 r.phase='notice';r.remaining=0;r.sentAt=Date.now();r.time=state.system.time;
 let c=reportContact();if(!c){c={id:DAY_ONE_REPORT_ID,name:'',avatar:'chat_report_black',status:'',systemAccount:true,protected:true,online:false,unread:0};state.contacts.unshift(c)}
 const rows=state.messages[DAY_ONE_REPORT_ID]??=[];
 if(!rows.some(m=>m.id==='day3-review-assigned')){rows.push({id:'day3-review-assigned',type:'text',sender:'chat_report_black',name:'',text:D3_REVIEW_MESSAGE,time:r.time,gameDate:r.date});c.unread=(c.unread||0)+1}
 c.preview=D3_REVIEW_MESSAGE;c.time=r.time;persist();if(view==='report-chat'&&active===DAY_ONE_REPORT_ID)openReportChat();else{if(view==='messages')chatList();d3ReviewNotice()}playNotificationSound('message',document.querySelector('#d3-review-notice'));status();
}
function d3ReviewOpen(){
 const r=d3Review();if(!r||r.phase==='waiting'||d3Paused())return;
 document.querySelector('#d3-review-notice')?.remove();if(reportContact())reportContact().unread=0;
 r.phase=r.submittedAt?'done':r.instructionsAccepted?'cards':'instructions';
 d3ReviewRender();if(!r.submittedAt&&!r.instructionsAccepted)d2Capture(D3_REVIEW_NODE,{view:'day3-review',active:null});
}
function d3ReviewCards(){
 const r=d3Review(),done=r.phase==='done';
 return '<header><small>校园通 · 匿名评审</small><h1>被分配的问卷</h1></header><p class="d3-summary-caption">'+(done?'评分已提交。':'请为两份答卷给出不同的分数。')+'</p>'+['A','B'].map(id=>{
  const other=id==='A'?'B':'A',score=r.scores[id],rating=r.rating===id&&!done;
  return '<article class="d3-summary-type d3-review-card"><div class="d3-review-card-heading"><h2>问卷'+id+'</h2><span>'+(score?score+' / 5':'尚未评分')+'</span></div><div class="survey-options d3-review-actions"><button type="button" data-d3review-action="read" data-paper="'+id+'">查看内容</button><button type="button" data-d3review-action="rate" data-paper="'+id+'" '+(done?'disabled':'')+'>'+(done?'已评分':'进行评分')+'</button></div>'+(rating?'<fieldset class="d3-review-rating"><legend>留校价值评分</legend><div class="d3-review-circles">'+[1,2,3,4,5].map(value=>'<label><input type="radio" name="d3-score-'+id+'" data-d3review-score="'+id+'" value="'+value+'" '+(score===value?'checked ':'')+(r.scores[other]===value?'disabled':'')+' aria-label="问卷'+id+'，'+value+'分"><span>'+value+'</span></label>').join('')+'</div><p class="d3-summary-caption">'+(r.scores[other]?'另一份答卷已评'+r.scores[other]+'分，此分数不可重复使用。':'请选择1—5分；选中的圆圈会填实。')+'</p></fieldset>':'')+'</article>';
 }).join('')+'<div class="survey-options"><button type="button" data-d3review-action="'+(done?'home':'submit')+'" '+(!done&&!d3ReviewValid(r.scores)?'disabled':'')+'>'+(done?'返回手机主页':'提交评分')+'</button></div>';
}
function d3ReviewRender(){
 const r=d3Review();if(!r||['waiting','notice'].includes(r.phase))return;
 closeSheet();stopReading();clearInterval(cgTypingTimer);document.querySelectorAll('.opening-message').forEach(el=>el.remove());
 view='day3-review';active=null;rememberRoute();zeroChrome();document.querySelector('#phone').classList.add('survey-active');
 let body;
 if(r.phase==='instructions')body='<div class="survey-question d3-instructions"><h1>阅前须知</h1><ol>'+D3_REVIEW_NOTES.map(text=>'<li>'+esc(text)+'</li>').join('')+'</ol><div class="survey-options"><button type="button" data-d3review-action="begin">我知道了，开始评审</button></div></div>';
 else if(r.phase==='content')body='<article class="d3-summary"><header><small>校园通 · 匿名答卷</small><h1>问卷'+r.paper+'</h1></header><section class="d3-summary-type"><p>'+esc(D3_REVIEW_PAPERS[r.paper])+'</p></section><div class="survey-options"><button type="button" data-d3review-action="cards">返回问卷列表</button></div></article>';
 else body='<div class="d3-summary">'+d3ReviewCards()+'</div>';
 screen.innerHTML='<section class="survey-screen d3-survey d3-review">'+body+'</section>';screen.scrollTop=0;applyGameBgm();persist();
}
function d3ReviewScore(id,value){
 const r=d3Review();if(!r||r.phase!=='cards'||r.submittedAt||!d3ReviewVisible()||!['A','B'].includes(id)||!Number.isInteger(value)||value<1||value>5)return false;
 if(r.scores[id==='A'?'B':'A']===value){toast('两份答卷不得给予相同分数');return false}
 r.scores[id]=value;const page=screen.querySelector('.d3-review'),top=page?.scrollTop||0;d3ReviewRender();const next=screen.querySelector('.d3-review');if(next)next.scrollTop=top;screen.querySelector('[data-d3review-score="'+id+'"][value="'+value+'"]')?.focus({preventScroll:true});return true;
}
function d3ReviewRemove(){
 const r=d3Review();if(!r?.submittedAt||r.departureApplied||r.departureRemaining>0||!['xianing','zhoumo'].includes(r.target))return;
 const key=r.target,name=key==='xianing'?'夏宁':'周茉',room=key==='xianing'?'101':'316',person=FA_PEOPLE[key],group=hgContact();
 r.departureApplied=true;state.game.departedNpcs??={};
 if(!state.game.departedNpcs[key]){
  state.game.departedNpcs[key]={date:r.date,cause:'day3-anonymous-review'};
  if(Number.isFinite(state.game.campusPopulation?.alive))state.game.campusPopulation.alive=Math.max(0,state.game.campusPopulation.alive-1);
  if(group){const members=group.members||[],ids=[key,person?.contact,person?.avatar,HG_PEOPLE[key]?.avatar,dayTwoPerson(key).avatar,PORTRAIT_CHARACTERS[name]].filter(Boolean);let index=members.findIndex(id=>ids.includes(id));if(index<0)index=members.findLastIndex(id=>id.startsWith('stranger-'));if(index>=0)members.splice(index,1);hg().count=Math.max(0,hg().count-1);group.status='群成员：'+hg().count+'人'}
 }
 for(const c of state.contacts)if(c.id===key||person?.contact===c.id||c.name?.replace(/[（(].*$/,'').trim()===name){c.status='已离校';c.online=false}
 for(const f of [state.story.freeAction,state.story.dayTwoFreeAction])for(const clue of f?.clues||[])if(clue.id==='members')clue.removedMembers=[...new Set([...(clue.removedMembers||[]),key])];
 if(key==='zhoumo'){
  if(d3Zhou())d3Zhou().phase='done';document.querySelector('#d3-zhou-notice')?.remove();
  if(state.story.pendingPlayerReply?.chat===FA_PEOPLE.zhoumo.contact)delete state.story.pendingPlayerReply;
 }
 const rows=state.messages[HG_ID]??=[],id='day3-review-removal',text='沈可欣已将'+name+'（'+room+'）移出群聊';
 if(!rows.some(m=>m.id===id)){rows.push({id,type:'system',text,time:'10:30',gameDate:r.date});if(group){group.preview=text;group.time='10:30';group.unread=(group.unread||0)+1}}
 persist();hgNotice('group');status();
}
function d3ReviewSubmit(){
 const r=d3Review();if(r?.phase!=='cards'||!d3ReviewVisible()||r.submittedAt||!d3ReviewValid(r.scores))return false;
 r.submittedAt=Date.now();r.target=r.scores.A>r.scores.B?'xianing':'zhoumo';r.phase='done';r.rating=null;r.departureRemaining=2800;
 if(state.story.dayThreeApplication){state.story.dayThreeApplication.reviewStatus='completed';state.story.dayThreeApplication.peerScores={...r.scores}}
 state.system.time='10:30';state.game.period='上午';d3ReviewCleanup();persist();d3Call(home);d3ReviewLastTick=Date.now();applyGameBgm();persist();return true;
}
function d3ReviewCleanup(){document.querySelector('#d3-review-notice')?.remove();if(d3ReviewVisible())document.querySelector('#phone').classList.remove('survey-active');d3ReviewLastTick=0}
let d3ReviewLastTick=0,d3ReviewLastSave=0;
function d3ReviewTick(){
 const now=Date.now();if(d3Paused()){d3ReviewLastTick=0;return}const elapsed=d3ReviewLastTick?Math.max(0,now-d3ReviewLastTick):0;d3ReviewLastTick=now;
 d3ReviewSchedule();const r=d3Review();
 if(r?.submittedAt&&!r.departureApplied){r.departureRemaining=Math.max(0,(r.departureRemaining??2800)-elapsed);if(!r.departureRemaining)d3ReviewRemove();else if(now-d3ReviewLastSave>=1000){d3ReviewLastSave=now;persist()}return}
 if(r?.phase!=='waiting')return;r.remaining=Math.max(0,r.remaining-elapsed);
 if(!r.remaining)d3ReviewSend();else if(now-d3ReviewLastSave>=1000){d3ReviewLastSave=now;persist()}
}
function d3ReviewRestore(){
 d3ReviewLastTick=0;if(typeof d2EveningMigrateLi==='function')d2EveningMigrateLi(state.story.dayTwoEvening);d3ReviewMigrateTarget();if(d3Paused())return;d3ReviewSchedule();const r=d3Review();if(!r)return;
 if(r.submittedAt&&!r.departureApplied){r.departureRemaining??=2800;state.system.time='10:30'}
 if(state.story.route?.view==='day3-review')d3ReviewRender();else if(r.phase==='notice')d3ReviewNotice();
}
actions['day3-review-open']=d3ReviewOpen;
actions['day3-review-chat']=()=>openReportChat();
const d3ReviewFinishBase=d3FinishSurvey;d3FinishSurvey=function(...args){const result=d3ReviewFinishBase(...args);d3ReviewSchedule();return result};
const d3ReviewLockBase=zeroLock;zeroLock=function(){return d3ReviewVisible()&&!d3Internal||d3ReviewLockBase()};
const d3ReviewHomeBase=home;home=function(...args){if(d3ReviewVisible()&&!d3Internal)return;return d3ReviewHomeBase(...args)};
function d3ReviewChatEntry(){
 const r=d3Review(),pane=screen.querySelector('.messages');
 if(state.story.dayThreeReport||!r||r.phase==='waiting'||view!=='report-chat'||active!==DAY_ONE_REPORT_ID||!pane)return;
 document.querySelector('#d3-review-notice')?.remove();
 if(!pane.querySelector('[data-day3-review-entry]'))pane.insertAdjacentHTML('beforeend','<article class="report-channel" data-day3-review-entry><div class="report-mail-icon">'+icon('file')+'</div><h2>匿名问卷评审</h2><p>查看分配给你的两份答卷</p><button type="button" data-action="day3-review-open">'+(r.submittedAt?'查看已提交的评分':'查看问卷')+'</button></article>');
 pane.scrollTop=pane.scrollHeight;
}
const d3ReviewChatBase=openReportChat;openReportChat=function(...args){const result=d3ReviewChatBase(...args);d3ReviewChatEntry();return result};
const d3ReviewRowBase=contactRow;contactRow=function(c){const html=d3ReviewRowBase(c);return c.id===DAY_ONE_REPORT_ID&&d3Review()?.sentAt&&d3ReviewLatestNotice()?html.replace(/<time>.*?<\/time>/,'<time>'+esc(d3Review().time)+'</time>'):html};
const d3ReviewZhouTickBase=d3ZhouTick;d3ZhouTick=function(...args){if(d3ReviewVisible())return;return d3ReviewZhouTickBase(...args)};
const d3ReviewZhouNoticeBase=d3ZhouNotice;d3ZhouNotice=function(...args){if(d3ReviewVisible()||d3Review()?.phase==='notice')return;return d3ReviewZhouNoticeBase(...args)};
// Day 3 questionnaires keep the current BGM and its playback position.
const d3ReviewCleanupBase=cleanupSceneResume;cleanupSceneResume=function(...args){d3ReviewCleanup();return d3ReviewCleanupBase(...args)};
const d3ReviewResumeBase=resumeStoryScene;resumeStoryScene=function(snapshot,...args){
 if(snapshot?.story?.route?.view==='day3-review'&&snapshot.story.dayThreeReview){view='day3-review';active=null;d3ReviewRestore();persist();return}
 const result=d3ReviewResumeBase(snapshot,...args);d3ReviewRestore();return result;
};
const d3ReviewMessageBase=renderMessage;renderMessage=function(m,c){let html=d3ReviewMessageBase(m,c);if(c.id!==HG_ID||m.sender==='me'||html.includes('zero-left-status'))return html;for(const [key,name] of [['xutang','李恬'],['xianing','夏宁'],['zhoumo','周茉']])if(state.game.departedNpcs?.[key]&&(m.hgWho===key||m.name?.replace(/[（(].*$/,'').trim()===name))return html.replace(/(<div class="sender-name">[^<]*)(<\/div>)/,'$1<small class="zero-left-status">已离校</small>$2');return html};
window.addEventListener('click',event=>{
 if(!d3ReviewVisible())return;const b=event.target.closest('[data-d3review-action]');if(!b||b.disabled)return;
 event.preventDefault();event.stopImmediatePropagation();const r=d3Review(),action=b.dataset.d3reviewAction,id=b.dataset.paper;
 if(action==='begin'&&r.phase==='instructions'){r.instructionsAccepted=true;r.phase='cards';d3ReviewRender()}
 else if(action==='read'&&['cards','done'].includes(r.phase)&&D3_REVIEW_PAPERS[id]){r.paper=id;r.read[id]=true;r.phase='content';d3ReviewRender()}
 else if(action==='cards'&&r.phase==='content'){r.phase=r.submittedAt?'done':'cards';d3ReviewRender()}
 else if(action==='rate'&&r.phase==='cards'&&D3_REVIEW_PAPERS[id]){r.rating=id;d3ReviewRender()}
 else if(action==='submit')d3ReviewSubmit();
 else if(action==='home'&&r.submittedAt){r.phase='done';d3ReviewCleanup();d3Call(home);applyGameBgm();persist()}
},true);
document.addEventListener('change',event=>{const input=event.target.closest('[data-d3review-score]');if(input)d3ReviewScore(input.dataset.d3reviewScore,Number(input.value))});
window.addEventListener('keydown',event=>{if(d3ReviewVisible()&&(event.key==='Escape'||event.key==='BrowserBack'||event.altKey&&['ArrowLeft','Home'].includes(event.key))){event.preventDefault();event.stopImmediatePropagation()}},true);
document.addEventListener('visibilitychange',()=>{d3ReviewLastTick=0;if(d3Review())persist()});
setInterval(d3ReviewTick,100);d3ReviewRestore();
