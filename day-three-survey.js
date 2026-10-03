/* Day three starts after reading chapter four; all answers belong to the story snapshot. */
const D3_SURVEY_NODE='day3-survey-before-notice';
STORY_CHOICES.push({id:D3_SURVEY_NODE,title:'留校资格申请',day:'第三日 · 09:00',chat:null});
function d3Morning(){return state.story.dayThreeMorning}
function d3Survey(){return state.story.dayThreeSurvey}
function d3SurveyLocked(){return !storyInputDormant()&&!!d3Survey()&&d3Survey().phase!=='done'}
function d3Paused(){return window.mobileLaunch||document.hidden||state.game.survivalEnding||['game-menu','nodes','zero-death'].includes(view)}
let d3Internal=false,d3LastTick=0,d3LastSave=0;
function d3Call(fn,...args){const previous=d3Internal;d3Internal=true;try{return fn(...args)}finally{d3Internal=previous}}
const d3LockBase=zeroLock;zeroLock=function(){return !d3Internal&&(d3SurveyLocked()||d3ReadingRules()||['sleep','transition'].includes(d3Morning()?.phase))||d3LockBase()};
const d3HomeBase=home;home=function(...args){if((d3SurveyLocked()||d3ReadingRules())&&!d3Internal)return;return d3HomeBase(...args)};
function d3ReadingRules(){return !d3Morning()&&d2Night()?.phase==='midnight-reading'&&view==='post'&&active===D2_FOURTH_RULE_ID}
function d3RulesContinue(){
 if(!d3ReadingRules())return;
 screen.querySelector('.page-head button[aria-label^="返回"]')?.remove();
 midnightContinue.hidden=false;zeroChrome();refreshPhoneBack();
}
const d3PostBase=postDetail;postDetail=function(...args){const result=d3PostBase(...args);d3RulesContinue();return result};
function d3StartMorning(){
 if(d3Morning()||d2Night()?.phase!=='midnight-reading'||state.game.survivalEnding)return;
 state.story.dayThreeMorning={phase:'sleep',date:state.system.date,remaining:1000,index:0,jiangAlive:!reportDeparted('江晓')};
 midnightContinue.hidden=true;
 d3LastTick=0;persist();d3RenderSleep();
}
function d3RenderSleep(){
 const previous=captureSceneSnapshot(screen);closeSheet();stopReading();clearInterval(cgTypingTimer);
 document.querySelectorAll('.opening-message,#morning-title,.ending-morning-veil').forEach(el=>el.remove());
 view='day3-sleep';active=null;rememberRoute();zeroChrome();
 screen.innerHTML='<section class="ending-scene" style="background:#000"></section>';zeroDissolve(previous,600);persist();
}
function d3RenderMorningTransition(){
 closeSheet();stopReading();clearInterval(cgTypingTimer);
 document.querySelectorAll('.opening-message,#morning-title,.ending-morning-veil').forEach(el=>el.remove());
 state.system.time='08:56';state.game.day=3;state.game.period='上午';persist();
 d3Call(home);view='day3-morning';active=null;rememberRoute();zeroChrome();
 const veil=document.createElement('div');veil.className='ending-morning-veil';
 const title=document.createElement('div');title.id='morning-title';title.className='morning-title';
 title.innerHTML='<strong>第三日</strong><span>新规实施剩余1日</span>'+dailyVitalsMarkup();
 document.querySelector('#phone').append(veil,title);persist();
}
function d3MorningRows(){return [
 ...(d3Morning().jiangAlive?[['remove','江晓'],['zhoumo','……']]:[['shen','看来昨天他们选的是其他宿舍楼的人']]),
 ['shen','有件事我要和你们说一下'],['shen','我们和其他宿舍楼的联系被切断了，不知道是什么原因'],
 ['xianing','这个黑头像到底是什么来头？'],['xianing','我们现在校外的人联系不上'],['xianing','其他宿舍楼为什么也联系不上'],['shen','我也不清楚']
 ]}
function d3RemoveJiang(){
 const m=d3Morning();if(m.removalApplied)return;m.removalApplied=true;
 state.game.departedNpcs??={};if(state.game.departedNpcs.jiang)return;
 state.game.departedNpcs.jiang={date:m.date,cause:'day3-morning'};
 const person=FA_PEOPLE.jiang;
 for(const c of state.contacts)if(c.id===person.contact||c.name?.replace(/[（(].*$/,'')==='江晓'){c.status='已离校';c.online=false}
 const group=hgContact();if(group){const members=group.members||[];let i=members.findIndex(id=>['jiang',person.contact,person.avatar].includes(id));if(i<0)i=members.findLastIndex(id=>id.startsWith('stranger-'));if(i>=0)members.splice(i,1);hg().count=Math.max(0,hg().count-1);group.status='群成员：'+hg().count+'人'}
 if(Number.isFinite(state.game.campusPopulation?.alive))state.game.campusPopulation.alive=Math.max(0,state.game.campusPopulation.alive-1);
 for(const f of [state.story.freeAction,state.story.dayTwoFreeAction])for(const clue of f?.clues||[])if(clue.id==='members')clue.removedMembers=[...new Set([...(clue.removedMembers||[]),'jiang'])];
}
function d3MorningSend(){
 const m=d3Morning(),rows=d3MorningRows(),entry=rows[m.index];if(!entry)return;
 const [who,text]=entry,id='day3-morning-'+m.index,person=who==='remove'?null:dayTwoPerson(who);
 if(who==='remove')d3RemoveJiang();
 const messages=state.messages[HG_ID]??=[],inside=view==='chat'&&active===HG_ID;
 if(!messages.some(row=>row.id===id))messages.push({id,type:who==='remove'?'system':'text',sender:person?.avatar,hgWho:who,name:who==='xianing'?'夏宁（101）':person?.name,text:who==='remove'?'沈可欣已将江晓移出群聊':text,time:'08:56',gameDate:m.date,status:'read'});
 m.index++;m.remaining=m.index===rows.length?2000:messageSendDelay();m.phase=m.index===rows.length?'survey-wait':'chat';
 const group=hgContact();if(group){group.preview=messages.at(-1).text;group.time='08:56';if(!inside)group.unread=(group.unread||0)+1}
 persist();if(inside)openChat(HG_ID);else hgNotice('group');status();d3ZhouEnsure();
}
function d3MorningReady(){
 const m=d3Morning();state.game.day=3;state.game.period='上午';state.system.time='08:56';
 document.querySelectorAll('#morning-title,.ending-morning-veil').forEach(el=>el.remove());
 m.phase='chat';m.remaining=0;d3Call(home);refreshPhoneBack();d3MorningSend();
}

// Zhou Mo's request belongs only to Jiang Xiao's third-morning removal route.
function d3Zhou(){return state.story.dayThreeZhou}
function d3ZhouNotice(){
 const q=d3Zhou();if(!q||q.phase==='done'||d3Paused()||d3SurveyLocked())return;
 document.querySelector('#d3-zhou-notice')?.remove();
 const friend=q.phase==='request',c=state.contacts.find(c=>c.id===FA_PEOPLE.zhoumo.contact),el=document.createElement('div');
 el.id='d3-zhou-notice';el.className='opening-message';
 el.innerHTML='<button class="opening-body" data-action="day3-zhou-open"><span>'+avatar(FA_PEOPLE.zhoumo.avatar)+'</span><span><small>讯息 · 现在</small><strong>'+(friend?'周茉申请添加你为好友':'周茉')+'</strong><span>'+esc(friend?'验证消息：谢谢你':c?.preview||'你收到一条消息')+'</span></span></button><button class="opening-close" data-action="day3-zhou-dismiss" aria-label="关闭通知">×</button>';
 document.querySelector('#phone').append(el);playNotificationSound(friend?'friend':'message');
}
function d3ZhouEnsure(){
 const m=d3Morning();if(!m?.jiangAlive||!m.removalApplied||m.index<2||d3Zhou())return;
 const exists=state.contacts.some(c=>c.id===FA_PEOPLE.zhoumo.contact);
 state.story.dayThreeZhou={phase:exists?'chat':'request',accepted:exists,index:0,remaining:messageSendDelay()};
 persist();if(!exists){if(view==='messages')chatList();d3ZhouNotice()}
}
function d3ZhouFriend(){
 const q=d3Zhou();if(!q||d3SurveyLocked())return;
 document.querySelector('#d3-zhou-notice')?.remove();
 if(q.phase!=='request')return openChat(FA_PEOPLE.zhoumo.contact);
 closeSheet();view='day3-zhou-friend';active=null;rememberRoute();
 screen.innerHTML='<section class="app-page">'+head('好友申请')+'<div class="panel"><div class="profile-row">'+avatar(FA_PEOPLE.zhoumo.avatar)+'<div><h2>周茉</h2><p class="subtle">来自女生B栋临时互助群</p></div></div><p>验证消息：谢谢你</p><button class="primary" data-action="day3-zhou-accept">同意</button></div></section>';persist();
}
function d3ZhouAccept(){
 const q=d3Zhou();if(q?.phase!=='request'||q.accepted||d3SurveyLocked())return;
 q.accepted=true;q.phase='chat';q.remaining=messageSendDelay();
 const c=faContact('zhoumo');
 persist();openChat(c.id);
}
function d3ZhouRows(){return [
 '昨天的事，我非常感激你',
 '多亏了你们，江晓离开前，至少心里是感动是高兴的',
 '而不是愧疚难过的',
 {mine:true,text:'昨天那些零食其实都是林晴给的'},
 '啊，那麻烦你也帮我谢谢林晴吧',
 '以后你们有什么困难',
 '只要我能帮上忙，我都会尽力的！'
]}
function d3ZhouDecorate(){
 const q=d3Zhou();if(!q||view!=='chat'||active!==FA_PEOPLE.zhoumo.contact)return;
 document.querySelector('#d3-zhou-notice')?.remove();
 if(q.phase!=='chat')return;
 const composer=screen.querySelector('#composer');composer?.querySelectorAll('button,textarea').forEach(el=>el.disabled=true);
 if(composer?.querySelector('textarea'))composer.querySelector('textarea').placeholder='等待消息…';
 renderStoryReply();
}
function d3ZhouTick(elapsed=0){
 const q=d3Zhou(),chat=FA_PEOPLE.zhoumo.contact;
 if(!q||q.phase!=='chat'||d3Paused()||d3SurveyLocked())return;
 const inside=view==='chat'&&active===chat;if(!inside&&q.index>0)return;
 q.remaining=Math.max(0,q.remaining-elapsed);if(q.remaining)return;
 const row=d3ZhouRows()[q.index];if(!row)return;
 const mine=!!row.mine,text=mine?row.text:row,token='day3:zhou:'+q.index;
 if(mine&&storyReplyGate(chat,text,token,'d3ZhouTick',true))return;
 const c=faContact('zhoumo'),rows=state.messages[chat]??=[],id='day3-zhou-'+q.index;
 if(!rows.some(m=>m.id===id))rows.push({id,type:'text',sender:mine?'me':c.avatar,name:mine?state.profile.name:c.name,text,time:state.system.time,gameDate:state.system.date,status:'read'});
 c.preview=mine?'我：'+text:text;c.time=state.system.time;if(!inside&&!mine)c.unread=(c.unread||0)+1;
 q.index++;q.remaining=messageSendDelay();if(q.index===d3ZhouRows().length)q.phase='done';
 persist();if(inside)openChat(chat);else {if(view==='messages')chatList();d3ZhouNotice();status()}
}
Object.assign(actions,{'day3-zhou-open':d3ZhouFriend,'day3-zhou-accept':d3ZhouAccept,'day3-zhou-dismiss':()=>document.querySelector('#d3-zhou-notice')?.remove()});
const d3ZhouListBase=chatList;chatList=function(...args){const result=d3ZhouListBase(...args);if(view==='messages'&&d3Zhou()?.phase==='request')screen.querySelector('.page-head')?.insertAdjacentHTML('afterend','<button class="setting-row" data-action="day3-zhou-open" aria-label="新的好友申请，周茉，待通过"><span><i class="live-dot friend-request-dot" aria-hidden="true"></i>新的好友申请</span><span>周茉 ›</span></button>');return result};
const d3ZhouChatBase=openChat;openChat=function(...args){const result=d3ZhouChatBase(...args);d3ZhouDecorate();return result};
const d3ZhouSendBase=sendMessage;sendMessage=function(id,...args){if(id===FA_PEOPLE.zhoumo.contact&&d3Zhou()?.phase==='chat')return false;return d3ZhouSendBase(id,...args)};

function d3StartSurvey(){
 if(d3Survey())return;
 d3Morning().phase='done';state.story.otherDormContactLost=true;state.system.time='09:00';
 state.story.dayThreeSurvey={phase:'notice',question:0,answers:[],writing:[],draft:'',remaining:0,date:state.system.date};
 document.querySelectorAll('.opening-message').forEach(el=>el.remove());hg().banner=null;
 d3RenderSurvey();persist();d2Capture(D3_SURVEY_NODE,{view:'day3-survey',active:null});playNotificationSound('system');
}
function d3SurveyCleanup(){
 document.querySelectorAll('#morning-title,.ending-morning-veil').forEach(el=>el.remove());
 document.querySelector('#d3-survey-notice')?.remove();document.querySelector('#phone').classList.remove('survey-active','survey-notifying');
 d3LastTick=0;
}
function d3SurveySet(phase,remaining=0){const q=d3Survey();q.phase=phase;q.remaining=remaining;persist();d3RenderSurvey()}
function d3Choose(index,question){
 const q=d3Survey();if(q?.phase!=='question'||q.question!==question||q.answers.length!==question||!D3_SURVEY_QUESTIONS[question].choices[index])return;
 q.answers.push(index);q.assessment=null;d3SurveySet('fade',450);
}
function d3WritingStart(){const q=d3Survey();q.writeIndex=q.writing.length;q.draft='';d3SurveySet('typing',D3_SURVEY_WRITING[q.writeIndex].length*110+(q.writeIndex===0?400:0))}
function d3WritingSend(text){
 const q=d3Survey();if(q?.phase!=='writing'||q.writeIndex!==0)return;
 const answer=String(text).trim();if(!answer)return;q.writing[q.writeIndex]=answer;q.draft='';
 d3WritingStart();
}
function d3SubmitWriting(form,submit){
 const q=d3Survey(),input=form?.querySelector('input');
 if(!input||submit?.disabled||q?.phase!=='writing'||!input.value.trim())return;
 if(typeof form.checkValidity==='function'&&!form.checkValidity())return;
 // Prefer native form submission; old or incomplete WebViews use the same answer handler.
 if(typeof form.requestSubmit==='function'){
  try{form.requestSubmit(submit)}catch{}
 }
 if(d3Survey()===q&&q.phase==='writing')d3WritingSend(input.value);
}
function d3ReflectionContinue(){
 const q=d3Survey();if(q?.phase!=='reflection'||q.remaining>0)return;
 q.writing=q.writing.slice(0,1);
 q.assessment=d3SurveyAssessment(q.answers);if(!q.assessment)return;
 q.submittedAt=Date.now();state.story.dayThreeApplication={date:q.date,answers:[...q.answers],writing:[...q.writing],assessment:structuredClone(q.assessment),submittedAt:q.submittedAt,reviewStatus:'pending'};
 d3SurveySet('submitted');
}
function d3FinishSurvey(){
 const q=d3Survey();if(!['submitted','result'].includes(q?.phase))return;
 q.phase='done';q.remaining=0;state.story.dayThreeSurveyComplete=true;d3SurveyCleanup();persist();d3Call(home);applyGameBgm();persist();d2Capture('day3-survey-complete',{view:'home',active:null});d3ZhouNotice();
}
function d3AssessmentMarkup(){
 const q=d3Survey(),result=q.assessment||d3SurveyAssessment(q.answers),type=D3_SURVEY_TYPES[result.type];
 return '<article class="d3-summary"><header><small>校园通 · 留校资格申请</small><h1>行为倾向评估完成</h1></header><section class="d3-summary-type"><small>综合类型</small><h2>'+esc(type.name)+'</h2><p>'+esc(type.description)+'</p></section><section class="d3-axes" aria-label="四项行为倾向">'+result.axes.map(axis=>'<article class="d3-axis"><small>'+esc(axis.title)+'</small><div class="d3-axis-value"><span>'+esc(axis.label)+'</span><b>'+axis.percent+'<small>%</small></b></div><div class="d3-axis-track" role="img" aria-label="'+esc(axis.left)+' '+(100-axis.rightPercent)+'%，'+esc(axis.right)+' '+axis.rightPercent+'%"><i style="left:'+axis.rightPercent+'%"></i></div><div class="d3-axis-ends"><span>'+esc(axis.left)+'</span><span>'+esc(axis.right)+'</span></div></article>').join('')+'</section><section class="d3-summary-note"><div><small>留校适应性</small><strong>'+esc(type.adaptation)+'</strong></div><small>系统提示</small><p>'+esc(type.hint)+'</p></section><p class="d3-summary-caption">本评估仅反映本次答题倾向。留校适应性为系统评价，不代表正确答案。</p><div class="survey-options"><button type="button" data-d3-action="finish">返回主页</button></div></article>';
}
function d3RenderSurvey(){
 const q=d3Survey();if(!q||q.phase==='done')return;
 // Older checkpoints may still be waiting for a written answer to the reflection.
 if(q.phase==='writing'&&q.writeIndex===1){q.phase='reflection';q.remaining=2000;q.draft='';q.writing=q.writing.slice(0,1)}
 document.querySelector('#d3-survey-notice')?.remove();closeSheet();stopReading();clearInterval(cgTypingTimer);
 const phone=document.querySelector('#phone');
 if(q.phase==='notice'){
  d3Call(home);view='day3-survey';active=null;rememberRoute();phone.classList.add('survey-notifying');
  surveyModal('校园通','你有一份必须完成的问卷','d3-open','点击查看');
  const modal=document.querySelector('#survey-notice');modal.id='d3-survey-notice';modal.querySelector('button').dataset.d3Action='open';persist();return;
 }
 view='day3-survey';active=null;rememberRoute();zeroChrome();phone.classList.remove('survey-notifying');phone.classList.add('survey-active');
 let body='',progress='';
 if(q.phase==='instructions')body='<div class="survey-question d3-instructions"><h1>留校资格申请 · 作答须知</h1><ol>'+D3_SURVEY_NOTES.map(text=>'<li>'+esc(text)+'</li>').join('')+'</ol><div class="survey-options"><button type="button" data-d3-action="begin">我知道了，前往作答</button></div></div>';
 else if(['question','fade'].includes(q.phase)){
  const row=D3_SURVEY_QUESTIONS[q.question];progress='<small class="survey-progress">'+(q.question+1)+' / '+D3_SURVEY_QUESTIONS.length+'</small>';
  body='<div class="survey-question"><h1>'+esc(row.text)+'</h1><div class="survey-options">'+row.choices.map((choice,i)=>'<button type="button" data-d3-choice="'+i+'" data-d3-question="'+q.question+'" '+(q.phase==='fade'?'disabled':'')+'>'+esc(choice[0])+'</button>').join('')+'</div></div>';
 }else if(['typing','writing'].includes(q.phase)){
  body='<div class="survey-question"><h1 class="'+(q.phase==='typing'?'d3-prompt':'')+'" data-d3-prompt></h1>'+(q.phase==='writing'?'<form id="d3-survey-writing" class="survey-input-wrap d3-writing"><input aria-label="'+esc(D3_SURVEY_WRITING[q.writeIndex])+'" placeholder="请输入你的回答" maxlength="1000" autocomplete="off" value="'+esc(q.draft)+'"><button type="submit" '+(q.draft.trim()?'':'disabled')+'>提交回答</button></form>':'')+'</div>';
 }else if(q.phase==='reflection')body='<div class="survey-question"><h1>'+esc(D3_SURVEY_WRITING[1])+'</h1></div>';
 else if(q.phase==='submitted')body='<div class="survey-question"><h1>问卷提交成功。</h1><div class="survey-options"><button type="button" data-d3-action="result">查看行为倾向评估</button><button type="button" data-d3-action="finish">返回主页</button></div></div>';
 else if(q.phase==='result')body=d3AssessmentMarkup();
 screen.innerHTML='<section class="survey-screen d3-survey '+(q.phase==='fade'?'survey-leaving':'')+'">'+progress+body+'</section>';screen.scrollTop=0;
 if(['typing','writing'].includes(q.phase))d3TypePrompt();
 const form=screen.querySelector('#d3-survey-writing');if(form){const input=form.querySelector('input'),submit=form.querySelector('button');input.oninput=()=>{if(d3Survey()!==q)return;q.draft=input.value;submit.disabled=!q.draft.trim();persist()};form.onsubmit=e=>{e.preventDefault();if(d3Survey()===q)d3WritingSend(input.value)}}
 applyGameBgm();persist();
}
function d3TypePrompt(){const q=d3Survey(),el=screen.querySelector('[data-d3-prompt]');if(!q||!el)return;const text=D3_SURVEY_WRITING[q.writeIndex];el.textContent=q.phase==='writing'?text:text.slice(0,Math.floor(Math.max(0,text.length*110+(q.writeIndex===0?400:0)-q.remaining)/110))}
function d3Tick(){
 const now=Date.now();if(d3Paused()){d3LastTick=0;return}const elapsed=d3LastTick?Math.max(0,now-d3LastTick):0;d3LastTick=now;
 if(!d3Morning()){d3RulesContinue();return}
 const m=d3Morning(),q=d3Survey();d3ZhouEnsure();d3ZhouTick(elapsed);
 if(m.phase==='sleep'){m.remaining=Math.max(0,m.remaining-elapsed);if(!m.remaining){m.phase='transition';m.remaining=4500;d3RenderMorningTransition()}}
 else if(m.phase==='transition'){m.remaining=Math.max(0,m.remaining-elapsed);if(!m.remaining)d3MorningReady()}
 else if(['chat','survey-wait'].includes(m.phase)&&view==='chat'&&active===HG_ID){m.remaining=Math.max(0,m.remaining-elapsed);if(!m.remaining){if(m.phase==='survey-wait')d3StartSurvey();else d3MorningSend()}}
 if(q&&view==='day3-survey'&&['fade','typing','reflection'].includes(q.phase)){
  q.remaining=Math.max(0,q.remaining-elapsed);
  if(q.phase==='typing')d3TypePrompt();
  if(!q.remaining&&q.phase!=='reflection'){if(q.phase==='typing')d3SurveySet(q.writeIndex===0?'writing':'reflection',q.writeIndex===0?0:2000);else if(q.answers.length<D3_SURVEY_QUESTIONS.length){q.question=q.answers.length;d3SurveySet('question')}else d3WritingStart()}
 }
 if(now-d3LastSave>=1000&&(m.phase!=='done'||q&&q.phase!=='done'||d3Zhou()?.phase==='chat')){d3LastSave=now;persist()}
}
actions['day3-continue-sleep']=d3StartMorning;
window.addEventListener('click',event=>{
 if(!d3SurveyLocked())return;
 if(d3Survey().phase==='reflection'&&view==='day3-survey'){event.preventDefault();event.stopImmediatePropagation();d3ReflectionContinue();return}
 const button=event.target.closest('[data-d3-action],[data-d3-choice]');
 const form=event.target.closest('#d3-survey-writing');
 if(form){
  const submit=event.target.closest('button[type="submit"]');
  // Submit through the form before the global locked-page click guard cancels it.
  if(submit){event.preventDefault();event.stopImmediatePropagation();d3SubmitWriting(form,submit)}
  return;
 }
 event.preventDefault();event.stopImmediatePropagation();if(!button)return;
 const q=d3Survey();
 if(button.hasAttribute('data-d3-choice'))return d3Choose(Number(button.dataset.d3Choice),Number(button.dataset.d3Question));
 const action=button.dataset.d3Action;
 if(action==='open'&&q.phase==='notice')d3SurveySet('instructions');
 else if(action==='begin'&&q.phase==='instructions'){q.instructionsAccepted=true;d3SurveySet('question')}
 else if(action==='result'&&q.phase==='submitted')d3SurveySet('result');
 else if(action==='finish')d3FinishSurvey();
},true);
window.addEventListener('keydown',event=>{if(d3SurveyLocked()&&(event.key==='Escape'||event.key==='BrowserBack'||event.altKey&&['ArrowLeft','Home'].includes(event.key))){event.preventDefault();event.stopImmediatePropagation()}},true);
// Day 3 questionnaires keep the current BGM and its playback position.
const d3CleanupBase=cleanupSceneResume;cleanupSceneResume=function(...args){d3SurveyCleanup();return d3CleanupBase(...args)};
const d3ResumeBase=resumeStoryScene;resumeStoryScene=function(snapshot){
 const m=snapshot?.story?.dayThreeMorning,q=snapshot?.story?.dayThreeSurvey,zhou=snapshot?.story?.dayThreeZhou;
 if(!m||m.phase==='done'&&(!q||q.phase==='done')&&(!zhou||zhou.phase==='done'))return d3ResumeBase(snapshot);
 d3LastTick=0;
 if(q&&q.phase!=='done')d3RenderSurvey();else if(m.phase==='sleep')d3RenderSleep();else if(m.phase==='transition')d3RenderMorningTransition();else if(snapshot.story.route?.view==='day3-zhou-friend')d3ZhouFriend();else if(snapshot.story.route?.view==='chat'&&[HG_ID,FA_PEOPLE.zhoumo.contact].includes(snapshot.story.route.active))openChat(snapshot.story.route.active);else {d3Call(home);if(zhou&&zhou.phase!=='done')d3ZhouNotice();else if(m.phase!=='done')hgNotice('group')}
 persist();
};
const d3RenderMessageBase=renderMessage;renderMessage=function(m,c){let html=d3RenderMessageBase(m,c);if(c.id===HG_ID&&state.game.departedNpcs?.jiang&&m.sender!=='me'&&(m.hgWho==='jiang'||m.name?.replace(/[（(].*$/,'')==='江晓')&&!html.includes('zero-left-status'))html=html.replace(/(<div class="sender-name">[^<]*)(<\/div>)/,'$1<small class="zero-left-status">已离校</small>$2');return html};
document.addEventListener('visibilitychange',()=>{d3LastTick=0;if(d3Morning())persist()});
setInterval(d3Tick,100);
if(!d3Paused()){if(d3SurveyLocked())d3RenderSurvey();else if(d3Morning()?.phase==='sleep')d3RenderSleep();else if(d3Morning()?.phase==='transition')d3RenderMorningTransition();else d3RulesContinue()}
