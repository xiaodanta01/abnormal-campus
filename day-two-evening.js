/* Day two, after both pickup routes converge. Reuse the authored chat runner and phone UI. */
Object.assign(DAY_TWO_AUTHORED,{
 eveningFloorWarning:{rows:[
  ['shen','楼层混乱的事情大家应该已经发现了'],['shen','凡事都要小心'],
  ['songyan','恐怕不止是楼层变化的原因吧','speakerAlive'],
  ['songyan','学生会说不定骗了不少人进电梯','speakerAlive'],
  ['songyan','不然不可能一下全校少十几个人','speakerAlive'],
  ['yeshu','我们普通生还有胜算吗……','speakerAlive']
 ],end:'eveningGroupDone'},
 eveningJiangHelp:{chat:'jiang',rows:[
  ['jiang','你那边还有吃的或者水吗？'],['jiang','我知道现在问这个挺不合适的'],['jiang','但我真的不知道还能找谁了'],
  ['me','怎么了？'],['jiang','我舍友周茉从新规实施到现在，已经两天多没吃东西了'],['jiang','都怪我让她投林晴，她才没拿到钱……'],
  ['jiang','如果你有一点多的，如果能不能分她一点？'],['jiang','一点就行'],['jiang','对不起，让你为难了']
 ],end:'eveningHelpDone'},
 eveningZhouHelp:{chat:'zhoumo',rows:[
  ['zhoumo','那个……你还有吃的，或者水吗'],['zhoumo','我知道现在这种情况这样问很不好'],['zhoumo','可我真的有点撑不住了'],
  ['zhoumo','我已经两天多没吃东西了'],['zhoumo','我根本没想到会发生这些，什么吃的都没留'],
  ['zhoumo','本来江晓还在的时候我都没这么害怕'],['zhoumo','现在她也不在了'],['zhoumo','我连该怎么办都不知道'],
  ['zhoumo','你要是还有多的话'],['zhoumo','可不可以分我一点……'],['zhoumo','没有的话也没关系'],['zhoumo','你不要有心理负担']
 ],end:'eveningHelpDone'},
 eveningLinFood:{chat:'linqing',rows:[
  ['me','刚刚有人来问我还有没有吃的。','forceReply'],['me','说是已经两天多没怎么吃东西了。'],['me','我这里还有一些……']
 ],choices:[{label:'我想分一些给她们',next:'eveningLinGive'},{label:'我是想分，但还是有点担心后面不够',next:'eveningLinWorry'}]},
 eveningLinGive:{chat:'linqing',rows:[
  ['me','我想分一些给她们'],['lin','那我陪你一起去'],['lin','我这里也还有吃的'],['lin','就拿我的给她们吧'],
  ['me','可是你自己怎么办…'],['lin','够的啦，不用担心'],['lin','你昨天晚上给我分了泡面，你忘记了？','sharedNoodles'],['lin','而且你想帮她们，我也想帮你']
 ],end:'eveningLinDone'},
 eveningLinWorry:{chat:'linqing',rows:[
  ['me','我是想分，但还是有点担心后面不够'],['lin','那把我的分给他们一点吧'],['lin','我这里还有一些零食'],
  ['lin','担心自己的东西后面不够，纠结什么的很正常'],['lin','你愿意帮她们就说明你是一个很好的人了'],['lin','我陪你一起去']
 ],end:'eveningLinDone'},
 eveningLinEmpty:{chat:'linqing',rows:[
  ['me','刚刚有人来问我还有没有吃的。','forceReply'],['me','说是已经两天多没怎么吃东西了。'],['me','可是我这里也没有了。']
 ],choices:[{label:'我们要不帮忙问问其他人？',next:'eveningLinAskOthers'},{label:'我不知道该怎么帮她们',next:'eveningLinUnsure'}]},
 eveningLinAskOthers:{chat:'linqing',rows:[['me','我们要不帮忙问问其他人？']],next:'eveningLinSnacks'},
 eveningLinUnsure:{chat:'linqing',rows:[['me','我不知道该怎么帮她们']],next:'eveningLinSnacks'},
 eveningLinSnacks:{chat:'linqing',rows:[
  ['lin','我还有小零食，我可以帮他们'],['me','真的？'],['lin','嗯。'],['lin','所以你不用想那么多。'],['lin','想帮的话，我们就拿我的过去。'],
  ['me','那你后面怎么办？'],['lin','不用担心，我的小零食很多的。'],['lin','不骗你。'],['lin','走吧，我陪你一起去。']
 ],end:'eveningLinDone'}
});
const D2_EVENING_REFLECTION=[
 '你盯着手机想了很久。',
 '谁都不知道接下来还会发生什么，更不知道手里的东西到底够不够撑到最后。',
 '可如果真的还有余力……',
 '你的良心告诉你，你做不到眼睁睁的看着一个女孩饿死。',
 '能互相拉一把的时候，总比各顾各的好。',
 '你犹豫了一会儿，转头看向林晴。'
];
function d2Evening(){return state.story.dayTwoEvening}
function d2EveningChatActive(){return ['chat','choice','group-read','help-read'].includes(d2Evening()?.phase)}
const d2EveningStateBase=dayTwoState;dayTwoState=function(){return d2EveningChatActive()?d2Evening():d2EveningStateBase()};
const d2EveningLeakBase=leakState;leakState=function(){return d2EveningChatActive()?d2Evening():d2EveningLeakBase()};
const d2EveningChatBase=dayTwoChat;dayTwoChat=function(q){const chat=DAY_TWO_AUTHORED[q.script]?.chat;return ['zhoumo','linqing'].includes(chat)?chat:d2EveningChatBase(q)};
const d2EveningCaptureBase=dayTwoCapture;dayTwoCapture=function(q){if(q===d2Evening()&&q.phase==='choice'&&['eveningLinFood','eveningLinEmpty'].includes(q.script))return d2Capture('tree-day2-'+q.script,{view:'chat',active:'linqing'});return d2EveningCaptureBase(q)};
function d2EveningNotice(chat=HG_ID){
 if(document.querySelector('#day2-evening-notice'))return;
 const c=state.contacts.find(c=>c.id===chat);if(!c)return;
 const el=document.createElement('div');el.id='day2-evening-notice';el.className='opening-message';
 el.innerHTML='<button class="opening-body" data-d2-evening-chat="'+esc(chat)+'"><span>'+avatar(c.avatar)+'</span><span><small>讯息 · '+state.system.time+'</small><strong>'+esc(c.name||'请离通知')+'</strong><span>'+esc(c.preview||'你收到一条消息')+'</span></span></button>';
 document.querySelector('#phone').append(el);playNotificationSound('message');
}
function d2EveningDepartureList(e){return [['liangyin','梁音','603'],['linxia','林夏','116'],...(!e.jiangAlive?[['qiyue','戚悦','508']]:[]),['xutang','李恬','401']]}
function d2EveningMigrateDepartures(e){
 if(!e||e.departureNoticeVersion===2)return;e.departureNoticeVersion=2;
 const rows=state.messages[DAY_ONE_REPORT_ID]||[],index=rows.findIndex(m=>m.id==='day2-evening-departures');
 if(index>=0){const removed=rows.splice(index,1)[0],report=reportContact();if(report){report.unread=Math.max(0,(report.unread||0)-1);if(report.preview===removed.text){const last=rows.filter(m=>m.type==='text').at(-1);report.preview=last?.text||'';report.time=last?.time||report.time}}}
 const messages=state.messages[HG_ID]||[];e.removalIndex=d2EveningDepartureList(e).filter(([key])=>messages.some(m=>m.id==='day2-evening-removal-'+key)).length;
 if(['departures','removal-read'].includes(e.phase)){e.phase='departures';e.groupOpened=false;document.querySelector('#day2-evening-notice')?.remove()}
 persist();
}
function d2EveningApplyDepartures(e){
 if(e.departuresApplied)return;e.departuresApplied=true;e.departureNoticeVersion=2;e.removalIndex=0;e.removed=[];
 e.population=31;e.populationLoss=16;e.rosterVersion=2;e.populationBalanceVersion=1;
 postDanger();state.game.campusPopulation??={scope:'全校'};state.game.campusPopulation.alive=e.population;postDanger();
 d2EveningRemoveNext(e);persist();status();
}
// Upgrade only this loaded progress. Earlier checkpoints stay earlier checkpoints.
function d2EveningMigrateLi(e){
 if(!e?.departuresApplied||e.rosterVersion===2)return;
 e.rosterVersion=2;e.population=e.jiangAlive?34:33;e.populationLoss=e.jiangAlive?13:14;
 if(Number.isFinite(state.game.campusPopulation?.alive))state.game.campusPopulation.alive=Math.max(0,state.game.campusPopulation.alive-1);
 if(['departures','removal-read'].includes(e.phase)){persist();return}
 const key='xutang',person=FA_PEOPLE[key],group=hgContact();state.game.departedNpcs??={};
 if(!state.game.departedNpcs[key]&&group){const ids=[key,person?.contact,person?.avatar,PORTRAIT_CHARACTERS['李恬']].filter(Boolean),members=group.members||[];let i=members.findIndex(id=>ids.includes(id));if(i<0)i=members.findLastIndex(id=>id.startsWith('stranger-'));if(i>=0)members.splice(i,1);hg().count=Math.max(0,hg().count-1);group.status='群成员：'+hg().count+'人'}
 state.game.departedNpcs[key]={date:e.date,cause:'day2-evening'};
 for(const c of state.contacts)if(c.id===key||c.id===person?.contact||c.name?.replace(/[（(].*$/,'').trim()==='李恬'){c.status='已离校';c.online=false}
 const rows=state.messages[HG_ID]??=[],id='day2-evening-removal-xutang';
 if(!rows.some(m=>m.id===id)){let i=rows.findLastIndex(m=>m.id?.startsWith('day2-evening-removal-'));rows.splice(i<0?0:i+1,0,{id,type:'system',text:'沈可欣已将李恬（401）移出群聊',time:'18:09',gameDate:e.date})}
 e.removed=[...new Set([...(e.removed||[]),key])];e.removalIndex=d2EveningDepartureList(e).length;
 for(const f of [state.story.freeAction,state.story.dayTwoFreeAction])for(const clue of f?.clues||[])if(clue.id==='members')clue.removedMembers=[...new Set([...(clue.removedMembers||[]),key])];
 persist();
}
function d2EveningRemoveNext(e){
 const entry=d2EveningDepartureList(e)[e.removalIndex||0];if(!entry)return false;
 const [key,name,room]=entry;state.game.departedNpcs??={};const already=!!state.game.departedNpcs[key];state.game.departedNpcs[key]??={date:e.date,cause:'day2-evening'};
 for(const c of state.contacts)if(c.id===key||c.name?.replace(/[（(].*$/,'')===name){c.status='已离校';c.online=false}
 const group=hgContact(),messages=state.messages[HG_ID]??=[];
 if(group&&!already){const members=group.members||[];let index=members.findIndex(id=>id===key||id===PORTRAIT_CHARACTERS[name]||id===FA_PEOPLE[key]?.contact||id===FA_PEOPLE[key]?.avatar);if(index<0)index=members.findLastIndex(id=>id.startsWith('stranger-'));if(index>=0)members.splice(index,1);hg().count=Math.max(0,hg().count-1)}
 const id='day2-evening-removal-'+key,inside=view==='chat'&&active===HG_ID;
 if(!messages.some(m=>m.id===id)){messages.push({id,type:'system',text:'沈可欣已将'+name+'（'+room+'）移出群聊',time:'18:09',gameDate:e.date});if(group&&!inside)group.unread=(group.unread||0)+1}
 if(group){group.status='群成员：'+hg().count+'人';group.time='18:09';group.preview=messages.at(-1).text}
 e.removed??=[];if(!e.removed.includes(key))e.removed.push(key);e.removalIndex=(e.removalIndex||0)+1;
 for(const f of [state.story.freeAction,state.story.dayTwoFreeAction])for(const clue of f?.clues||[])if(clue.id==='members')clue.removedMembers=[...new Set([...(clue.removedMembers||[]),...e.removed])];
 e.due=Date.now()+messageSendDelay();persist();status();if(inside)openChat(HG_ID);return true;
}
function d2EveningStart(){
 if(d2Evening()||state.game.day!==2||!state.story.secondDayPickupCommonReady||!state.story.dayTwoPickup?.done||state.story.dayTwoPickup.failed)return;
 state.system.time='18:09';const e=state.story.dayTwoEvening={dayTwoVersion:DAY_TWO_VERSION,kind:'evening',date:state.system.date,phase:'departures',jiangAlive:state.story.secondNightResult?.target!=='jiang',decisions:{},effects:{},index:0};
 d2EveningApplyDepartures(e);home();d2EveningNotice();
}
function d2EveningRun(script){
 const e=d2Evening();Object.assign(e,{phase:'chat',script,index:0,typing:null,due:Date.now()});persist();dayTwoAdvance(e);
 const chat=dayTwoChat(e);if(view!=='chat'||active!==chat)d2EveningNotice(chat);
}
const d2EveningFinishBase=dayTwoFinish;dayTwoFinish=function(q,result){
 if(q!==d2Evening())return d2EveningFinishBase(q,result);
 q.phase=result==='eveningGroupDone'?'group-read':result==='eveningHelpDone'?'help-read':'done';q.result=result;q.typing=null;
 if(q.phase==='done')q.completedAt=Date.now();persist();if(view==='chat'&&active===dayTwoChat(q))openChat(active);
};
function d2EveningCGBusy(){return ['reflection','reflection-choice'].includes(d2Evening()?.phase)}
function d2EveningReflection(){
 const e=d2Evening();if(!e||!d2EveningCGBusy())return;
 const previous=captureSceneSnapshot(screen);closeSheet();stopReading();document.querySelector('#day2-evening-notice')?.remove();
 view='day2-evening-cg';active=null;rememberRoute();zeroChrome();
 screen.innerHTML='<section class="rd-cg"><img src="assets/day2-evening-phone.jpg" alt="夜晚宿舍桌上的手机"></section>';
 const host=screen.firstElementChild;
 if(e.phase==='reflection-choice'){
  cgChoiceDialogue(host,D2_EVENING_REFLECTION.at(-1));
  host.insertAdjacentHTML('beforeend','<div class="cg-options"><button type="button" data-d2-evening-tell-lin>把这件事告诉林晴</button></div>');
 }else CGDialogue.present(host,D2_EVENING_REFLECTION,{index:e.reflectionIndex||0,onIndex:i=>{if(d2Evening()===e){e.reflectionIndex=i;persist()}},onComplete:()=>{if(d2Evening()!==e||e.phase!=='reflection')return;e.phase='reflection-choice';persist();d2EveningReflection()}});
 cgScreenCrossfade(previous);persist();
}
function d2EveningTellLin(){
 const e=d2Evening();if(view!=='day2-evening-cg'||e?.phase!=='reflection-choice')return;
 // Food is determined from remaining backpack quantities, not uncollected orders or water/medicine.
 e.hasFood=(state.game.inventory||[]).some(item=>item.quantity>0&&['食品','能量棒'].includes(itemUseEffect(item)?.category));
 e.toldLin=true;e.phase='chat';clearInterval(cgTypingTimer);openChat('linqing');
 d2EveningRun(e.hasFood?'eveningLinFood':'eveningLinEmpty');
}
const d2EveningHomeBase=home;home=function(...args){if(d2EveningCGBusy()&&!window.mobileLaunch&&!['game-menu','nodes','zero-death'].includes(view))return d2EveningReflection();return d2EveningHomeBase(...args)};
const d2EveningAppBase=openApp;openApp=function(...args){if(d2EveningCGBusy()&&!window.mobileLaunch&&!['game-menu','nodes','zero-death'].includes(view))return d2EveningReflection();return d2EveningAppBase(...args)};
function d2EveningTransition(){
 const previous=captureSceneSnapshot(screen);closeSheet();stopReading();document.querySelector('#day2-evening-notice')?.remove();
 view='day2-evening-transition';active=null;rememberRoute();zeroChrome();
 screen.innerHTML='<section class="fa-time-transition"><h2>时间来到18:30</h2><p>你有20s可以选择进食/自由探索</p></section>';zeroDissolve(previous,600);
}
function d2EveningExplore(){
 const e=d2Evening();e.phase='explore';e.exploreStarted=true;e.remaining=20000;persist();home();
 sheet('时间来到18:30','<p>你有20s可以选择进食/自由探索</p><button class="primary" data-d2-evening-health>查看背包并进食</button><button class="secondary" data-action="close">自由探索</button>');
}
function d2EveningHelp(){
 const e=d2Evening();e.helpStarted=true;state.system.time='18:57';closeSheet();home();
 if(!e.jiangAlive)faContact('zhoumo');
 d2EveningRun(e.jiangAlive?'eveningJiangHelp':'eveningZhouHelp');
}
const d2EveningOpenChatBase=openChat;openChat=function(id){
 const result=d2EveningOpenChatBase(id),e=d2Evening();
 if(e&&view==='chat'&&active===id){
  if(id===HG_ID&&['departures','removal-read'].includes(e.phase)){e.groupOpened=true;if(e.phase==='departures'){e.phase='removal-read';e.due=Date.now()+messageSendDelay()}document.querySelector('#day2-evening-notice')?.remove();persist()}
  else if(e.script&&id===dayTwoChat(e))document.querySelector('#day2-evening-notice')?.remove();
 }return result;
};
let d2EveningLastTick=0,d2EveningLastSave=0;
function d2EveningTick(){
 const now=Date.now();if(window.mobileLaunch||document.hidden||['game-menu','nodes','zero-death'].includes(view)||state.game.survivalEnding||state.game.day!==2){d2EveningLastTick=0;return}
 const elapsed=d2EveningLastTick?Math.max(0,now-d2EveningLastTick):0;d2EveningLastTick=now;
 if(!d2Evening())return d2EveningStart();const e=d2Evening();d2EveningMigrateDepartures(e);
 // Continue saves made at the previous test build's temporary endpoint.
 if(e.phase==='done'&&e.result==='eveningHelpDone'&&!e.toldLin){e.phase='help-read';persist()}
 if(e.phase==='departures'){if(view==='chat'&&active===HG_ID){e.groupOpened=true;e.phase='removal-read';e.due=now+messageSendDelay();document.querySelector('#day2-evening-notice')?.remove();persist()}else d2EveningNotice(HG_ID);return}
 if(e.phase==='removal-read'){if(view!=='chat'||active!==HG_ID){e.due=now+messageSendDelay();d2EveningNotice(HG_ID);return}if(now>=e.due&&!d2EveningRemoveNext(e))d2EveningRun('eveningFloorWarning');return}
 if(e.phase==='chat'){dayTwoAdvance(e);return}
 if(e.phase==='help-read'){const chat=dayTwoChat(e);if(view==='chat'&&active===chat&&!state.contacts.find(c=>c.id===chat)?.unread){e.phase='reflection';e.reflectionIndex=0;persist();d2EveningReflection()}else d2EveningNotice(chat);return}
 if(e.phase==='group-read'){if(view==='chat'&&active===HG_ID&&!hgContact()?.unread){e.phase='transition';e.remaining=1500;state.system.time='18:30';persist();d2EveningTransition()}return}
 if(e.phase==='transition'||e.phase==='explore'){
  e.remaining=Math.max(0,e.remaining-elapsed);
  if(now-d2EveningLastSave>=1000){d2EveningLastSave=now;persist()}
  if(e.remaining===0){if(e.phase==='transition')d2EveningExplore();else d2EveningHelp()}
 }
}
function d2EveningRestore(){
 d2EveningLastTick=0;const e=d2Evening();if(!e||window.mobileLaunch||['game-menu','nodes','zero-death'].includes(view)||state.game.survivalEnding)return;
 d2EveningMigrateDepartures(e);d2EveningMigrateLi(e);if(d2EveningCGBusy())d2EveningReflection();else if(e.phase==='transition')d2EveningTransition();else if(['departures','removal-read'].includes(e.phase)&&(view!=='chat'||active!==HG_ID))d2EveningNotice(HG_ID);else if(['chat','choice','help-read'].includes(e.phase)&&(view!=='chat'||active!==dayTwoChat(e)))d2EveningNotice(dayTwoChat(e));
}
const d2EveningResumeBase=resumeStoryScene;resumeStoryScene=function(...args){d2EveningResumeBase(...args);d2EveningRestore()};
const d2EveningCleanupBase=cleanupSceneResume;cleanupSceneResume=function(...args){document.querySelector('#day2-evening-notice')?.remove();d2EveningLastTick=0;return d2EveningCleanupBase(...args)};
document.addEventListener('click',event=>{const b=event.target.closest('button');if(!b)return;if(b.dataset.d2EveningChat){document.querySelector('#day2-evening-notice')?.remove();if(b.dataset.d2EveningChat===DAY_ONE_REPORT_ID)openReportChat();else openChat(b.dataset.d2EveningChat)}else if(b.hasAttribute('data-d2-evening-health')){closeSheet();openApp('health')}else if(b.hasAttribute('data-d2-evening-tell-lin'))d2EveningTellLin()});
document.addEventListener('visibilitychange',()=>{d2EveningLastTick=0;if(d2Evening()?.phase==='explore'||d2Evening()?.phase==='transition')persist()});
setInterval(d2EveningTick,200);d2EveningRestore();
