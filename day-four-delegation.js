/* Day 4 initial delegated votes; final settlement is implemented separately. */
const D4_DELEGATION_INITIAL_VOTES={shen:12,me:0,huangyiyi:2};
const D4_DELEGATION_NODE='day4-delegation-unlocked';
STORY_CHOICES.push({id:D4_DELEGATION_NODE,title:'解锁委托行动',day:'第四日 · 09:37',chat:null});
function makeDayFourWorldline(){return {nodes:[
 {id:'day4-start',title:'第四日开始',x:72,y:420,kind:'story',record:null,replayable:false},
 {id:D4_DELEGATION_NODE,title:'09:37 · 解锁委托行动',x:380,y:420,kind:'story',record:D4_DELEGATION_NODE,replayable:true}
 ],edges:[{from:'day4-start',to:D4_DELEGATION_NODE}],sections:[{label:'第四日 · 委托行动',x:72}],height:850,width:1000,focusY:420}}
function d4DelegationCapture(){if(d4DelegationReady()&&d4Delegation().phase==='ready')d2Capture(D4_DELEGATION_NODE,{view:'delegation',active:null})}
D4_GROUP_ROWS.push(
 ['shen','今天的新规则大家应该也都看见了'],
 ['shen','如果大家愿意相信我，可以把票委托给我'],
 ['shen','我向大家保证，我会检举许蓁蓁'],
 ['shen','她和江柠是站在一边的，一定是学生会'],
 ['baizhi','我愿意相信可欣，这几天一直都是她在帮我们管理这个群'],
 ['yuwei','是啊，也是她一直在提醒我们担心我们'],
 ['ningke','那就先委托给沈可欣吧']
);
const D4_DELEGATION_NARRATION=[
 '沈可欣说得每句话听起来都合理，但这一切都太顺利了，顺利到让你感到非常不安。',
 '从提出成为委托人，到选择检举对象，再到其他人陆续表态——这一切就像是早就安排好了一样。',
 '你心里很清楚，如果沈可欣是学生会，她就是在骗大家自己会投许蓁蓁，实际上她并不会这么做。',
 '你不能继续坐以待毙了。'
];
icons.delegation='M8 3h8v4H8z M8 5H5v16h14V5h-3 M8 12l2 2 5-5 M8 18h7';
C.apps.push({id:'delegation',name:'委托行动',icon:'delegation',tone:'sand',visible:false,locked:false});
C.homeLayout.main.push('delegation');
function d4Delegation(){return state.story.dayFourDelegation}
function d4DelegationReady(){return state.game.day===4&&['ready','registered'].includes(d4Delegation()?.phase)}
function d4DelegationBusy(){return state.game.day===4&&d4Delegation()?.phase==='narration'}
function d4DelegationCountdown(){const parts=state.system.time.split(':').map(Number),minutes=Math.max(0,21*60-parts[0]*60-parts[1]);return Math.floor(minutes/60)+'小时'+String(minutes%60).padStart(2,'0')+'分'}
function d4DelegationNarrate(){
 const q=d4Delegation();if(!d4DelegationBusy())return;
 closeSheet();stopReading();clearInterval(cgTypingTimer);document.querySelector('#hg-notification')?.remove();
 view='day4-delegation-narration';active=null;rememberRoute();zeroChrome();
 screen.innerHTML='<section class="rd-cg delegation-narration"><img src="assets/bed-phone-day-screen-off.jpg" alt="坐在宿舍床上看着手机"></section>';
 CGDialogue.present(screen.firstElementChild,D4_DELEGATION_NARRATION,{index:q.index||0,onIndex:i=>{if(d4Delegation()===q){q.index=i;persist()}},onComplete:()=>{
  if(d4Delegation()!==q||q.phase!=='narration')return;
  q.phase='ready';state.system.time='09:37';state.game.period='早晨';d4DelegationCapture();persist();home();
  sheet('新应用已解锁：委托行动','<p>你可以前往手机桌面，查看委托统计。</p><button class="primary" data-action="d4-delegation-open">前往查看</button>');
 }});persist();
}
function d4DelegationPanel(){
 if(!d4DelegationReady())return;closeSheet();view='delegation';active=null;rememberRoute();d4DelegationCapture();zeroChrome();status();
 const registered=d4Delegation().phase==='registered';
 const cards=[['shen','沈可欣',avatar(dayTwoPerson('shen').avatar)],['me',state.profile.name,avatar('me')],['huangyiyi','黄依依',avatar('chat_huangyiyi_v1')]].filter(([id])=>id!=='huangyiyi'||!d4Delegation().huangWithdrawn);
 screen.innerHTML='<section class="app-page delegation-page"><div class="delegation-top-art" aria-hidden="true"><span>FINAL DAY</span><i></i><b>04</b></div>'+head('委托统计')+
 '<div class="delegation-deadline"><span>距离 21:00</span><strong data-delegation-countdown>'+d4DelegationCountdown()+'</strong></div>'+
 (registered?'<div class="delegation-section"><span>已登记委托人</span><span>'+String(cards.length).padStart(2,'0')+'</span></div><div class="delegation-cards">'+cards.map(([id,name,portrait])=>'<article class="delegation-card'+(id==='me'?' delegation-self':'')+'"><div class="delegation-person">'+portrait+'<strong>'+esc(name)+'</strong>'+(id==='me'?'<small>你</small>':'')+'</div><div class="delegation-votes"><span>委托票数量</span><strong>'+d4DelegationVoteCount(id)+'</strong></div></article>').join('')+'</div>':
 '<div class="delegation-intro"><span class="delegation-mark">'+icon('delegation')+'</span><p>把选择权交给别人？这种情况下，和把自己的命交给别人有什么区别。</p><div class="delegation-second"><p>现在摆在你面前的只有一个选择——</p><div class="delegation-bottom"><button class="primary" data-action="d4-delegation-apply">申请成为委托人</button></div></div></div>')+'</section>';persist();
}
actions['d4-delegation-open']=()=>{document.querySelector('#d4-transfer-notice')?.remove();d4DelegationPanel()};
actions['d4-delegation-apply']=()=>{const q=d4Delegation();if(!d4DelegationReady()||view!=='delegation'||q.phase!=='ready')return;q.phase='registered';persist();d4DelegationPanel();toast('申请成功，你已成为委托人')};
const d4DelegationSyncBase=freeSync;freeSync=function(...args){const result=d4DelegationSyncBase(...args);C.apps.find(a=>a.id==='delegation').visible=d4DelegationReady();return result};
const d4DelegationAppBase=openApp;openApp=function(id,...args){if(d4DelegationBusy())return d4DelegationNarrate();if(id==='delegation')return d4DelegationPanel();return d4DelegationAppBase(id,...args)};
const d4DelegationHomeBase=home;home=function(...args){if(d4DelegationBusy()&&!d3Paused())return d4DelegationNarrate();return d4DelegationHomeBase(...args)};
const d4DelegationResumeBase=resumeStoryScene;resumeStoryScene=function(snapshot,...args){const result=d4DelegationResumeBase(snapshot,...args);if(state.game.day===4&&!state.game.survivalEnding){if(d4DelegationBusy())d4DelegationNarrate();else if(snapshot?.story?.route?.view==='delegation')d4DelegationPanel()}return result};
let d4DelegationLastTick=0;
setInterval(()=>{
 if(d3Paused()||state.game.day!==4||d4Morning()?.phase!=='done'){d4DelegationLastTick=0;return}
 const now=Date.now(),elapsed=d4DelegationLastTick?now-d4DelegationLastTick:0;d4DelegationLastTick=now;
 const counter=screen.querySelector('[data-delegation-countdown]');if(counter&&counter.textContent!==d4DelegationCountdown())counter.textContent=d4DelegationCountdown();
 if((state.story.dayFourGroup?.index||0)<D4_GROUP_ROWS.length||view!=='chat'||active!==HG_ID)return;
 const q=state.story.dayFourDelegation??={phase:'waiting',remaining:2000,index:0};if(q.phase!=='waiting')return;
 q.remaining=Math.max(0,q.remaining-elapsed);if(!q.remaining){q.phase='narration';persist();d4DelegationNarrate()}
},100);
freeSync();
if(!d3Paused()){if(d4DelegationBusy())d4DelegationNarrate();else if(view==='delegation')d4DelegationPanel();else if(view==='home')home()}

function d4DelegationVoteCount(id){const d=d4Delegation();return D4_DELEGATION_INITIAL_VOTES[id]+(id==='me'?Object.keys(d.receivedDelegations||{}).length:0)+(d.voteChanges?.[id]||0)}
