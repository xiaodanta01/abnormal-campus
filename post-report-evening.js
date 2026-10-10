/* Day-one continuation using existing message, choice, notification and bedtime styles. */
const POST_MENG_ID='mengshu-friend';
const POST_MENG_AVATAR='chat_mengshu';
C.avatars.push({id:POST_MENG_AVATAR,name:'孟舒',src:'assets/chat-avatars/chat_mengshu_v1.jpg?v=20261011-rc4'});
PORTRAIT_CHARACTERS['孟舒']=POST_MENG_AVATAR;
function migrateMengshuPortrait(progress){if(!progress)return;for(const c of progress.contacts||[])if(c.id===POST_MENG_ID)c.avatar=POST_MENG_AVATAR;for(const m of progress.messages?.[POST_MENG_ID]||[])if(m.sender&&m.sender!=='me')m.sender=POST_MENG_AVATAR}
migrateMengshuPortrait(state);
function postEvening(){return state.story.postReportEvening}
function postDanger(){const g=state.game;g.dangerValue??=20;const now=g.campusPopulation?.alive;if(g.dangerLedgerVersion!==2){g.dangerLedgerVersion=2;if(Number.isFinite(now))g.dangerPopulation=now;return g.dangerValue}g.dangerPopulation??=now;if(Number.isFinite(now)&&Number.isFinite(g.dangerPopulation)&&now<g.dangerPopulation){g.dangerValue+=(g.dangerPopulation-now)*2;g.dangerPopulation=now}return g.dangerValue}
const postPersistBase=persist;persist=function(...args){if(state.game.dangerValue!==undefined)postDanger();return postPersistBase(...args)};
const POST_SCRIPTS={
 lin:{chat:'linqing',rows:['你怎么样','刚刚怎么都叫不醒你'],choices:['我睡了多久？','没事，我就是太累了']},
 linTime:{chat:'linqing',rows:['你睡了快两个小时'],next:'friend'},
 linFine:{chat:'linqing',rows:['哦哦，那就好'],next:'friend'},
 meng:{chat:POST_MENG_ID,rows:['江晓有没有和你说过什么？'],choices:['她没和我说过什么','只是提醒了我，有什么事吗'],sentChoices:['她没和我说过什么。','只是提醒了我，有什么事吗？']},
 mengWarn:{chat:POST_MENG_ID,rows:['不要相信江晓，我今天检举她显示检举正确',{type:'post-wallet',text:'[校园钱包余额截图]'}],choices:['你为什么把这些告诉我'],sentChoices:['你为什么把这些告诉我？']},
 mengExplain:{chat:POST_MENG_ID,rows:['我其实是档案员','第0日公布身份的时候 我查询了你和苏沐','结果显示同一阵营','苏沐违反校园新规后被请离，证明她是普通生','所以你也是普通生','第1日我又查询了你和江晓','结果显示不同阵营','所以江晓只能是学生会'],choices:['好，我知道了，谢谢你'],sentChoices:['好，我知道了，谢谢你。']},
 mengSecret:{chat:POST_MENG_ID,rows:['别告诉任何人我的身份'],next:'explore'},
 mengQuiet:{chat:POST_MENG_ID,rows:['她提醒你什么？'],choices:['只让我最近小心一个人'],sentChoices:['只让我最近小心一个人']},
 mengQuietAfter:{chat:POST_MENG_ID,rows:[{mine:true,text:'怎么了？'},'哦哦，没什么','她刚刚也找我了','我就是想确认一下'],next:'explore'}

};
function postNotice(kind){document.querySelector('#post-evening-notice')?.remove();const p=postEvening();if(!p||!kind)return;const friend=kind==='friend',chat=POST_SCRIPTS[p.script]?.chat||POST_MENG_ID,c=state.contacts.find(c=>c.id===chat),friendTime=friend&&state.story.mengErrorBranch?.phase==='done'?'21:20':'现在',el=document.createElement('div');el.id='post-evening-notice';el.className='opening-message';el.innerHTML='<button class="opening-body" data-action="post-notice"><span>'+avatar(friend?POST_MENG_AVATAR:c?.avatar||'linqing')+'</span><span><small>讯息 · '+friendTime+'</small><strong>'+(friend?'孟舒（312） · 好友申请':esc(c?.name||'林晴'))+'</strong><span>'+(friend?'江晓有没有和你说过什么？':esc(c?.preview||'你收到一条消息'))+'</span></span></button>';document.querySelector('#phone').append(el);playNotificationSound('message',el)}
function postStartScript(name){const p=postEvening();p.phase='chat';p.script=name;p.index=0;p.due=Date.now()+messageSendDelay();persist();if(view==='chat'&&active===POST_SCRIPTS[name].chat)openChat(active)}
// Authored chat streams continue off-chat; choice phases still wait for the player.
function postChatCanAdvance(){return true}
function postWrite(text,id,mine=false,type='text'){const p=postEvening(),chat=POST_SCRIPTS[p.script].chat,c=state.contacts.find(c=>c.id===chat),rows=state.messages[chat]??=[];if(!c||rows.some(m=>m.id===id))return;rows.push({id,type,sender:mine?'me':c.avatar,name:mine?state.profile.name:c.name,text,time:state.system.time,gameDate:state.system.date,status:mine?'read':'sent'});c.preview=mine?'我：'+text:text;c.time=state.system.time;const inside=view==='chat'&&active===chat;if(!inside&&!mine)c.unread=(c.unread||0)+1;persist();if(inside)openChat(chat);else{status();if(view==='messages')chatList();if(!mine)postNotice('message')}}
function postFriend(){const p=postEvening();if(p?.phase!=='friend')return;document.querySelector('#post-evening-notice')?.remove();closeSheet();view='post-meng-friend';active=null;rememberRoute();screen.innerHTML='<section class="app-page">'+head('好友申请')+'<div class="panel"><div class="profile-row">'+avatar(POST_MENG_AVATAR)+'<div><h2>孟舒（312）</h2><p>来自女生B栋临时互助群</p></div></div><p>江晓有没有和你说过什么？</p><button class="primary" data-action="post-meng-accept">同意</button></div></section>'}
function postAccept(){const p=postEvening();if(p?.phase!=='friend'||p.accepted)return;p.accepted=true;if(!state.contacts.some(c=>c.id===POST_MENG_ID))state.contacts.push({id:POST_MENG_ID,name:'孟舒',avatar:POST_MENG_AVATAR,status:'在线',online:true,unread:0,time:state.system.time,preview:'你们已成为联系人'});state.messages[POST_MENG_ID]??=[{id:'post-meng-added',type:'system',text:'你们已成为联系人',time:state.system.time,gameDate:state.system.date}];ensureFriendContactNotice(POST_MENG_ID);postStartScript('meng');openChat(POST_MENG_ID)}
// Sleep requires a paid, still-pending food or water parcel for the second day.
function postPurchaseRequired(){return state.game.day===1&&['transition','explore','purchase-required','bed'].includes(postEvening()?.phase)}
function postHasTomorrowSupplies(){
 const tomorrow=deliveryDateNext(state.system.date);
 return deliveryOrders().some(order=>{
  deliveryPrepare(order);
  return order.deliveryDate===tomorrow&&!order.expired&&!order.collectedAt&&!order.refunded&&['待配送','待领取'].includes(order.status)
   &&order.lines.some(line=>Number(line.quantity)>0&&['食品','饮水'].includes(line.category||NS.products.find(p=>'ns-'+p[0]===line.id||p[1]===line.name)?.[3]));
 });
}
function postOpenPurchase(){closeSheet();shopCategory='全部';openApp('supply')}
function postPurchasePrompt(expired=false){
 if(reportFirstNightSubsidy(state.game.personalReports?.[state.system.date]))persist();
 const p=postEvening();if(!postPurchaseRequired()||postHasTomorrowSupplies())return false;
 if(expired){p.phase='purchase-required';p.exploreUntil=0;persist();zeroChrome();if(view==='post-evening-bed'||view==='post-evening-transition')home();postOpenPurchase()}
 sheet('睡前储备物资','<p>'+(expired?'睡前，请先完成物资订购。':'你还没有订购明天的物资，先去买一点吧。')+'</p><button class="primary" data-action="post-purchase-open">前往购买</button><button class="secondary" data-action="close">再看看</button>');
 return true;
}
actions['post-purchase-open']=postOpenPurchase;

function postBasicWaterAvailable(){
 const result=state.game.personalReports?.[DAY_ONE_REPORT_DATE];
 return state.game.day===1&&state.system.time>='21:00'&&result?.settled&&result.correct===false&&result.basicSubsidyApplied
  &&!deliveryOrders().some(o=>o.lines.some(p=>p.id==='ns-basic-water'&&Number(p.quantity)>0));
}
const postPurchaseProductsBase=nsProducts;
nsProducts=function(){
 postPurchaseProductsBase();
 if(postBasicWaterAvailable())C.products.unshift({id:'ns-basic-water',name:'矿泉水',price:100,category:'饮水',label:'基础补给',icon:'box',tone:'blue',detail:'第一晚基础补给 · 限购1瓶'});
};
const postPurchasePayBase=pay;
pay=function(...args){
 if([1,2].includes(state.game.day)&&state.system.time>='21:00'){
  if(reportFirstNightSubsidy(state.game.personalReports?.[DAY_ONE_REPORT_DATE]))persist();
  if(Number(state.cart['ns-basic-water'])>0&&(!postBasicWaterAvailable()||Number(state.cart['ns-basic-water'])!==1)){
   if(postBasicWaterAvailable())state.cart['ns-basic-water']=1;else delete state.cart['ns-basic-water'];
   persist();shop();toast('第一晚基础补给限购1瓶，请重新确认订单');return;
  }
  nsProducts();
  const lines=cartLines(),reserve=postBasicWaterAvailable()?100:300;
  if(lines.length&&!postHasTomorrowSupplies()&&!lines.some(p=>['食品','饮水'].includes(p.category)&&p.quantity>0)&&Math.round((Number(state.game.wallet)||0)*100)-cartTotal()<reserve){
   sheet('请先储备明天的物资','<p>睡前需要购买至少一件食物或饮用水。请先完成订购，或保留'+reserve/100+'校园币购买基础物资。</p><button class="primary" data-action="post-purchase-open">前往购买</button><button class="secondary" data-action="close">返回订单</button>');return;
  }
 }
 return postPurchasePayBase(...args);
};


function postExplore(){const p=postEvening();p.phase='explore-wait';p.due=Date.now()+2000;persist()}
function postExploreShow(){reportFirstNightSubsidy(state.game.personalReports?.[state.system.date]);const p=postEvening();p.phase='transition';p.due=Date.now()+2000;state.system.time='22:00';state.game.period='晚上';document.querySelector('#post-evening-notice')?.remove();closeSheet();view='post-evening-transition';active=null;rememberRoute();zeroChrome();document.querySelector('#phone').classList.add('zero-immersive');screen.innerHTML='<section class="fa-time-transition"><h2>时间来到22点</h2><p>该阶段你有60s可以进行购物和其他探索</p><p>明天的物资需要提前订购。睡觉前，先购买至少一件食物或饮用水。</p></section>';persist()}
function postChoose(index){const p=postEvening(),s=p&&POST_SCRIPTS[p.script];if(p?.phase!=='choice'||view!=='chat'||active!==s.chat||!s.choices?.[index])return;const branch=p.script;p.decisions??={};if(p.decisions[branch]!==undefined)return;p.decisions[branch]=index;p.phase='chat';postWrite(s.sentChoices?.[index]||s.choices[index],'post-choice-'+branch,true);if(branch==='lin'){if(index===1){state.game.trust??={};state.game.trust.linqing=(state.game.trust.linqing??30)-5}postStartScript(index===0?'linTime':'linFine')}else if(branch==='meng'){state.game.npcSecrets??={};state.game.npcSecrets.mengshu??={};state.game.npcSecrets.mengshu.impersonatingArchivist=index===0;if(index===1){state.game.npcSecrets.jiangxiao??={};Object.assign(state.game.npcSecrets.jiangxiao,{nightDeathScheduled:true,secondDayAlive:false,nextDayConfrontationAllowed:true});state.story.mengshuLeakConfrontation={pending:true,trigger:'second-night-group-removal'};p.jiangNightDeath=true;postStartScript('mengQuiet')}else postStartScript('mengWarn')}else if(branch==='mengWarn')postStartScript('mengExplain');else if(branch==='mengExplain'){state.game.dangerValue=postDanger()-5;postStartScript('mengSecret')}else if(branch==='mengQuiet')postStartScript('mengQuietAfter');persist()}
function migrateMengQuietChoice(){const p=postEvening();if(p?.script!=='mengQuiet'||p.decisions?.mengQuiet!==undefined||p.index<=1)return;state.messages[POST_MENG_ID]=(state.messages[POST_MENG_ID]||[]).filter(m=>!/^post-mengQuiet-[1-5]$/.test(m.id||''));p.index=1;p.phase='choice';p.due=0;persist()}
migrateMengQuietChoice();
function migrateStaleWolfVoteDeath(){const death=state.story.lateDayDeath,p=postEvening(),danger=Number(state.game.dangerValue)||0;if(death?.reason!=='wolf-vote'||danger>=300)return;delete state.story.lateDayDeath;delete state.game.survivalEnding;if(p){p.phase='bed';p.nightSettled=false}state.game.wolfVoteResults??={};delete state.game.wolfVoteResults[state.system.date];persist()}
migrateStaleWolfVoteDeath();
function postDecorate(){const p=postEvening();if(!p||!['chat','choice'].includes(p.phase)||view!=='chat'||active!==POST_SCRIPTS[p.script]?.chat)return;document.querySelector('#post-evening-notice')?.remove();const composer=screen.querySelector('#composer');if(!composer)return;composer.querySelectorAll('button,textarea').forEach(el=>el.disabled=true);composer.querySelector('textarea').placeholder=p.phase==='choice'?'选择一条回复…':'等待消息…';screen.querySelector('[data-post-choices]')?.remove();if(p.phase==='choice')composer.insertAdjacentHTML('beforebegin','<div class="zero-choices" data-post-choices>'+POST_SCRIPTS[p.script].choices.map((text,i)=>'<button data-post-choice="'+i+'">'+esc(text)+'</button>').join('')+'</div>');scrollMessages()}
function postReadRemoval(){if(!dayReport()?.publicationComplete||view!=='chat'||active!==HG_ID)return false;const row=(state.messages[HG_ID]||[]).find(m=>m.id==='day1-report-group-removal');if(!row)return false;const pane=screen.querySelector('#messages');if(!pane)return false;const bounds=pane.getBoundingClientRect();return [...pane.querySelectorAll('.system-msg')].some(el=>{const rect=el.getBoundingClientRect();return el.textContent.includes(dayReport().groupResult?.name)&&el.textContent.includes('移出群聊')&&rect.bottom>bounds.top&&rect.top<bounds.bottom})}
function postSleepScene(){if(postEvening()?.phase==='bed'&&postPurchasePrompt(true))return;const previous=view!=='post-evening-bed'?captureSceneSnapshot(screen):null;const p=postEvening();closeSheet();stopReading();clearInterval(cgTypingTimer);view='post-evening-bed';active=null;rememberRoute();zeroChrome();document.querySelector('#phone').classList.add('zero-immersive');screen.innerHTML='<section class="ending-scene"><img src="'+DAY_ZERO_BEDROOM+'" alt="夜晚的408宿舍">'+(p.phase==='sleep'?'<div class="ending-shade"><p>第一日结束</p></div>':'<div class="cg-options"><button class="ending-rest" data-action="post-sleep">上床睡觉</button></div>')+'</section>';if(previous)zeroDissolve(previous);persist()}
function postSongjiaVotedOut(){const r=state.story.dayOneReport;return state.game.day===1&&r?.publicationComplete&&r.groupResult?.target==='songjia'}
function postSettleNight(){
 const p=postEvening(),danger=postDanger(),reason=postSongjiaVotedOut()?'day1-songjia-uninformed':danger>=300?'wolf-vote':null;
 state.game.wolfVoteResults??={};p.nightSettled=true;
 state.game.wolfVoteResults[state.system.date]={dangerValue:danger,threshold:300,votedOut:!!reason,...(reason?{reason}:{})};persist();
 if(!reason)return false;p.phase='failed';persist();beginLateDeath(reason);return true;
}
function postSleep(){const p=postEvening();if(p?.phase!=='bed')return;if(postPurchasePrompt(true)||postSettleNight())return;p.phase='midnight-wait';p.due=Date.now()+1500;midnightBlack()}
STORY_CHOICES.push({id:'day2-start',title:'第二日开始',day:'第二日 · 08:40',chat:null});
function postMorningIntro(){const p=postEvening();view='home';active=null;persist();zeroChrome();home();document.querySelector('.ending-morning-veil')?.remove();const veil=document.createElement('div');veil.className='ending-morning-veil';document.querySelector('#phone').append(veil);storyTimeout(()=>veil.remove(),2200);const el=document.createElement('div');el.id='morning-title';el.className='morning-title';el.innerHTML='<strong>第二日</strong><span>新规实施剩余2日</span>'+dailyVitalsMarkup();document.querySelector('#phone').append(el);storyTimeout(()=>{el.remove();if(postEvening()===p&&state.story.secondMorningReady)deliveryTick()},4500)}
function postMorning(){const p=postEvening();if(p?.phase!=='sleep')return;if(postSongjiaVotedOut()){postSettleNight();return}p.phase='done';p.morningTransitionUntil=Date.now()+4500;state.system.date=deliveryDateNext(state.system.date);state.system.time='08:40';state.game.day=2;state.game.period='早晨';state.game.location='女生宿舍B栋408室';state.story.secondMorningReady=true;settleMorning();if(checkSecondMorningHealth())return;p.morningDeliveryIds=[];for(const o of deliveryOrders()){deliveryPrepare(o);if(!o.expired&&!o.arrivalNotified&&['待配送','待领取'].includes(o.status)&&o.deliveryDate===state.system.date){p.morningDeliveryIds.push(o.id);o.arrivalNotified=true}}settleMorning();postMorningIntro();d2Capture('day2-start',{view:'day2-morning-start',active:null});}
function postEveningTick(){if(window.mobileLaunch||document.hidden||['game-menu','nodes','zero-death'].includes(view)||state.game.survivalEnding)return;let p=postEvening();if(!p){if(!postReadRemoval())return;state.story.postReportEvening=p={phase:'chat',script:'lin',index:0,due:Date.now()+messageSendDelay(),decisions:{},removalRead:true};postDanger();persist();return}if(p.phase==='done'){deliveryTick();return}if(p.phase==='failed')return;const now=Date.now();if(p.phase==='explore-wait'&&now>=p.due){postExploreShow();return}if(p.phase==='transition'&&now>=p.due){p.phase='explore';p.exploreUntil=now+60000;home();sheet('储备明日物资','<p>明天的物资需要提前订购。睡觉前，先购买至少一件食物或饮用水。</p>'+(postBasicWaterAvailable()?'<p>第一日检举失败的基础补贴1校园币已到账，可购买一瓶1元基础补给矿泉水。</p>':'')+'<button class="primary" data-action="post-purchase-open">前往购买</button><button class="secondary" data-action="close">我知道了</button>');persist();return}if(p.phase==='explore'&&now>=p.exploreUntil){if(postPurchasePrompt(true))return;p.phase='bed';postSleepScene();return}if(p.phase==='sleep'&&now>=p.due){postMorning();return}if(p.phase!=='chat'||(window.ReadHistory?ReadHistory.waiting('post',p):now<p.due))return;const s=POST_SCRIPTS[p.script];if(!s)return;if(p.index>0&&!postChatCanAdvance(s))return;if(p.index<s.rows.length){const next=s.rows[p.index];if(next?.mine&&storyReplyGate(s.chat,next.text,'post:'+p.script+':'+p.index,'postEveningTick'))return;const i=p.index++,row=s.rows[i];p.due=now+messageSendDelay();postWrite(typeof row==='string'?row:row.text,'post-'+p.script+'-'+i,!!row.mine,row.type||'text');return}if(!postChatCanAdvance(s))return;if(s.choices){p.phase='choice';persist();postDecorate()}else if(s.next==='friend'){p.phase='friend';persist();postNotice('friend')}else if(s.next==='explore')postExplore()}
const postOpenBase=openChat;openChat=function(...args){const result=postOpenBase(...args);postDecorate();return result};
const postListBase=chatList;chatList=function(...args){const result=postListBase(...args);if(view==='messages'&&postEvening()?.phase==='friend'&&!postEvening().accepted)screen.querySelector('.page-head')?.insertAdjacentHTML('afterend','<button class="setting-row" data-action="post-meng-friend" aria-label="新的好友申请，孟舒，待通过"><span><i class="live-dot friend-request-dot" aria-hidden="true"></i>新的好友申请</span><span>孟舒（312） ›</span></button>');return result};
const postSendBase=sendMessage;sendMessage=function(id,...args){const p=postEvening();if(p&&['chat','choice'].includes(p.phase)&&id===POST_SCRIPTS[p.script]?.chat)return false;return postSendBase(id,...args)};
const postRenderBase=renderMessage;renderMessage=function(m,c){if(m.id==='alive-qiyue-departure')return '';if(m.type==='system'&&m.text==='有人开始怀疑孟舒的身份了')return '<div class="divider message-group-time">'+esc(m.text)+'</div>';if(m.type==='post-wallet')return '<div class="message">'+avatar(POST_MENG_AVATAR)+'<div class="message-main"><div class="bubble"><img src="assets/story/mengshu-wallet-v1.jpg?v=20261011-rc4" alt="孟舒发来的校园钱包余额截图：52.00校园币" style="display:block;width:220px;max-width:100%;border-radius:12px"></div></div></div>';let html=postRenderBase(m,c);if(c.id===HG_ID&&m.hgWho==='shen'&&m.text==='目前看来是这样')html+='<div class="divider message-group-time"><button data-action="message-speed" style="font:inherit;color:inherit;text-align:inherit;background:none;border:0;padding:0">消息发送的太快了？（点击这里调节速度）</button></div>';return html};
const postLockBase=zeroLock;zeroLock=function(){return ['transition','bed','sleep'].includes(postEvening()?.phase)||postLockBase()};
Object.assign(actions,{'post-notice':()=>postEvening()?.phase==='friend'?postFriend():openChat(POST_SCRIPTS[postEvening()?.script]?.chat||'linqing'),'post-meng-friend':postFriend,'post-meng-accept':postAccept,'post-sleep':postSleep});
document.addEventListener('click',e=>{const b=e.target.closest('[data-post-choice]');if(b){e.preventDefault();postChoose(Number(b.dataset.postChoice))}});
// The old demo boundary now leads into the next authored conversation.
reportReturnHome=function(){const r=dayReport();if(!r?.publicationComplete||!state.game.personalReports?.[r.date]?.settled||state.game.survivalEnding)return false;r.homeReturned=true;reportSendResultMessages();document.querySelector('#report-notification')?.remove();home();persist();if(hgContact()?.unread)hgNotice('group');return true};
const postSettingsBase=settings;settings=function(...args){const result=postSettingsBase(...args);if(view!=='settings')return result;const group=screen.querySelector('.game-settings-group')||screen.querySelector('.settings-group');if(group&&!screen.querySelector('#message-interval'))group.insertAdjacentHTML('beforeend','<div class="standard-row game-bgm-slider-row" id="message-interval"><span class="setting-symbol">'+icon('chat')+'</span><div class="game-bgm-volume-body"><label for="message-interval-input">消息发送间隔</label><div class="game-bgm-volume"><input id="message-interval-input" type="range" min="1" max="10" step="0.1" value="'+messageIntervalSeconds+'"><output>'+messageIntervalSeconds.toFixed(1)+'s</output></div></div></div>');const input=screen.querySelector('#message-interval-input');if(input)input.oninput=e=>{setMessageInterval(e.target.value);input.nextElementSibling.value=messageIntervalSeconds.toFixed(1)+'s'};return result};
actions['message-speed']=()=>{settings();const row=screen.querySelector('#message-interval');row?.scrollIntoView({block:'center'});row?.querySelector('input')?.focus()};
window.addEventListener('click',e=>{if(e.target.closest('.lin-moment-photo')){e.preventDefault();e.stopImmediatePropagation()}},true);
const postStyle=document.createElement('style');postStyle.textContent='.lin-moment-photo{cursor:default}';document.head.append(postStyle);
const postResumeBase=resumeStoryScene;resumeStoryScene=function(snapshot){const p=snapshot?.story?.postReportEvening;if(snapshot?.story?.route?.view==='day2-morning-start'&&p?.phase==='done'){postEvening().morningTransitionUntil=Date.now()+4500;postMorningIntro();return}if(!p)return postResumeBase(snapshot);postResumeBase(snapshot);migrateMengshuPortrait(state);if(p.phase==='transition'){view='post-evening-transition';zeroChrome();screen.innerHTML='<section class="fa-time-transition"><h2>时间来到22点</h2><p>该阶段你有60s可以进行购物和其他探索</p><p>明天的物资需要提前订购。睡觉前，先购买至少一件食物或饮用水。</p></section>'}else if(['bed','sleep'].includes(p.phase))postSleepScene();else if(p.phase==='friend')postNotice('friend');persist()};
const postCleanupBase=cleanupSceneResume;cleanupSceneResume=function(...args){document.querySelector('#post-evening-notice')?.remove();return postCleanupBase(...args)};
if(postEvening()){postDanger();if(!window.mobileLaunch){if(['bed','sleep'].includes(postEvening().phase))postSleepScene();else if(postEvening().phase==='friend')postNotice('friend');else if(postEvening().phase==='chat')postNotice('message')}}
setInterval(postEveningTick,200);

// Let the daily title finish before using the existing order-arrival notification.
const secondMorningDeliveryTick=deliveryTick;deliveryTick=function(){if(deliveryHealthBlocked()){document.querySelector('#delivery-notification')?.remove();return;}if(postEvening()?.phase==='done'&&Date.now()<(postEvening().morningTransitionUntil||0))return;const result=secondMorningDeliveryTick();const p=postEvening();if(p?.morningDeliveryIds?.length&&!window.mobileLaunch&&!['game-menu','nodes'].includes(view)){const ready=deliveryOrders().filter(o=>p.morningDeliveryIds.includes(o.id)&&o.status==='待领取'&&!o.expired);p.morningDeliveryIds=[];persist();if(ready.length)deliveryNotice(ready[0])}return result};

/* Meng Shu's two branching choices reuse the existing story-node snapshots. */
const MENG_CHOICE_NODES={meng:{id:'meng-private-first-choice',title:'孟舒私聊：隐瞒或如实回答'}};
for(const node of Object.values(MENG_CHOICE_NODES))if(!STORY_CHOICES.some(item=>item.id===node.id))STORY_CHOICES.push({...node,day:'第一日 · 检举后',chat:POST_MENG_ID});
function captureMengChoice(){const p=postEvening(),node=p&&MENG_CHOICE_NODES[p.script];if(!node||p.phase!=='choice'||p.decisions?.[p.script]!==undefined||view!=='chat'||active!==POST_MENG_ID)return;return captureStoryNode(node.id,state,{route:{view:'chat',active:POST_MENG_ID},mengStoryVersion:2})}
const mengChoiceDecorate=postDecorate;postDecorate=function(...args){const result=mengChoiceDecorate(...args);captureMengChoice();return result};
if(!window.mobileLaunch)captureMengChoice();

/* The second-morning receipt settles all three departures exactly once. */
function secondNightResult(){return state.story.secondNightResult}
function publishSecondNightResult(){if(secondNightResult())return;const p=postEvening(),jiang=p?.decisions?.meng===1,target=jiang?'jiang':'qiyue',name=jiang?'江晓':'戚悦',room=jiang?'316':'508';
 const result=state.story.secondNightResult={target,name,room,phase:'notice',date:state.system.date,populationApplied:true,groupApplied:false};
 postDanger();const legacy=jiang&&state.game.npcSecrets?.jiangxiao?.nightDeathApplied?1:0;
 if(Number.isFinite(state.game.campusPopulation?.alive))state.game.campusPopulation.alive=47;
 postDanger();state.game.departedNpcs??={};state.game.departedNpcs[target]={date:result.date,cause:'night-death',...(jiang?{nextDayConfrontationAllowed:true}:{})};
 if(jiang){state.game.npcSecrets??={};state.game.npcSecrets.jiangxiao??={};state.game.npcSecrets.jiangxiao.nightDeathApplied=true;state.game.npcSecrets.jiangxiao.nextDayConfrontationAllowed=true}
 const friend=jiang?jxContact():state.contacts.find(c=>c.id==='qiyue'||/^戚悦/.test(c.name));if(friend){friend.status='已离校';friend.online=false}
 state.system.time='08:40';const text='学生会夜间请离结果：你所在的宿舍楼中：'+name+'（'+room+'）已被清理';
 const rows=state.messages[DAY_ONE_REPORT_ID]??=[];if(!rows.some(m=>m.id==='second-night-result'))rows.push({id:'second-night-result',type:'text',sender:'chat_report_black',name:'',text,time:'08:40',gameDate:result.date});
 const c=reportContact();if(c){c.preview=text;c.time='08:40';c.unread=(c.unread||0)+1}persist();status();secondNightNotice();
}
function secondNightNotice(){if(document.querySelector('#second-night-notice'))return;const el=document.createElement('div');el.id='second-night-notice';el.className='opening-message';el.innerHTML='<button class="opening-body" data-action="second-night-open"><span class="report-black-avatar"></span><span><small>讯息 · 08:40</small><span>'+esc(reportContact()?.preview||'学生会夜间请离结果已公布')+'</span></span></button>';document.querySelector('#phone').append(el);playNotificationSound('message',el)}
function secondNightRemove(){const r=secondNightResult();if(!r||r.groupApplied)return;r.groupApplied=true;r.phase='done';state.system.time='09:00';
 const contact=hgContact();if(contact){hg().count=27;contact.status='群成员：27人';const members=contact.members||[],person=FA_PEOPLE[r.target];let index=members.findIndex(id=>id===r.target||id===person?.contact||id===person?.avatar||(r.target==='jiang'&&id===JX.id));if(index<0)index=members.findLastIndex(id=>id.startsWith('stranger-'));if(index>=0)members.splice(index,1);const text='沈可欣已将'+r.name+'（'+r.room+'）移出群聊';const rows=state.messages[HG_ID]??=[];if(!rows.some(m=>m.id==='second-night-group-removal'))rows.push({id:'second-night-group-removal',type:'system',text,time:'09:00',gameDate:r.date});contact.preview=text;contact.time='09:00';if(view!=='chat'||active!==HG_ID)contact.unread=(contact.unread||0)+1}
 const clue=state.story.freeAction?.clues?.find(c=>c.id==='members');if(clue){clue.historicalRoster??=FA_ROSTER;clue.removedMembers??=[];if(!clue.removedMembers.includes(r.target))clue.removedMembers.push(r.target)}persist();if(view==='chat'&&active===HG_ID)openChat(HG_ID);else hgNotice('group');if(view==='notes')faNotes();status();if(r.target==='jiang')startImmediateZhoumo();
}
function secondNightTick(){if(window.mobileLaunch||document.hidden||['game-menu','nodes','zero-death'].includes(view)||state.game.survivalEnding||!state.story.secondMorningReady||postEvening()?.phase!=='done')return;const p=postEvening();if(Date.now()<(p.morningTransitionUntil||0)||p.morningDeliveryIds?.length||document.querySelector('#morning-title,#delivery-notification'))return;const r=secondNightResult();if(!r){publishSecondNightResult();return}if(r.phase==='notice')secondNightNotice();else if(r.phase==='group-wait'&&Date.now()>=r.groupDue)secondNightRemove()}
const secondNightOpenBase=openReportChat;openReportChat=function(...args){const result=secondNightOpenBase(...args),r=secondNightResult();if(view==='report-chat'&&r?.phase==='notice'){document.querySelector('#second-night-notice')?.remove();r.phase='group-wait';r.groupDue=Date.now()+messageSendDelay();persist();const pane=screen.querySelector('.messages');if(pane)pane.scrollTop=pane.scrollHeight}return result};
actions['second-night-open']=()=>openReportChat();
const secondNightCleanup=cleanupSceneResume;cleanupSceneResume=function(...args){document.querySelector('#second-night-notice')?.remove();return secondNightCleanup(...args)};
setInterval(secondNightTick,250);

// Meng Shu uses the shared contact card and friends feed.
const POST_MENG_MOMENT={date:'2045年8月21日 21:33',text:'想去南极看企鹅'};
function postMengProfile(){if(zeroLock()||!state.contacts.some(c=>c.id===POST_MENG_ID))return;closeSheet();view='post-meng-profile';active=null;rememberRoute();screen.innerHTML='<section class="app-page lin-profile">'+head('个人资料')+'<div class="lin-profile-card contact-detail">'+identifierCard(CONTACT_IDENTIFIERS.find(p=>p.key==='meng'))+'</div><div class="settings-group">'+settingItem('photo','朋友圈','message-moments-meng')+'</div></section>';screen.scrollTop=0}
function postMengMoments(){if(zeroLock()||!state.contacts.some(c=>c.id===POST_MENG_ID))return;closeSheet();view='post-meng-moments';active=null;rememberRoute();screen.innerHTML='<section class="app-page lin-moments">'+head('孟舒的朋友圈')+'<div class="lin-feed-owner">'+avatar(POST_MENG_AVATAR)+'<div><strong>孟舒</strong><p>下雨天</p></div></div><article class="lin-moment"><time>'+POST_MENG_MOMENT.date+'</time><p class="lin-moment-text">'+POST_MENG_MOMENT.text+'</p></article></section>';screen.scrollTop=0}
actions['message-moments-meng']=postMengMoments;
actions['post-meng-profile']=postMengProfile;
const postMengFeedBase=friendsMomentRows;friendsMomentRows=function(){const rows=postMengFeedBase();if(state.contacts.some(c=>c.id===POST_MENG_ID))rows.push({key:'meng',name:'孟舒',avatar:POST_MENG_AVATAR,post:POST_MENG_MOMENT,rowKey:'meng-0'});return rows.sort((a,b)=>momentTimestamp(b.post.date)-momentTimestamp(a.post.date))};
const postMengContact=state.contacts.find(c=>c.id===POST_MENG_ID);if(postMengContact&&postMengContact.name!=='孟舒'){postMengContact.name='孟舒';persist()}

// Reuse the same clickable profile avatar as other friends.
function postMengAvatarButton(){return '<button class="npc-avatar-button" data-action="post-meng-profile" aria-label="查看孟舒个人资料">'+avatar(POST_MENG_AVATAR)+'</button>'}
const postMengOpenChatBase=openChat;openChat=function(id){const result=postMengOpenChatBase(id);if(view==='chat'&&active===POST_MENG_ID){const face=screen.querySelector('.chat-head>.avatar');if(face)face.outerHTML=postMengAvatarButton()}return result};
const postMengMessageBase=renderMessage;renderMessage=function(m,c){const html=postMengMessageBase(m,c);return c.id===POST_MENG_ID?html.replace(avatar(POST_MENG_AVATAR),postMengAvatarButton()):html};
document.addEventListener('click',e=>{if(view!=='message-contacts')return;const face=e.target.closest('.avatar');if(!face||face.closest('[data-contact]')?.dataset.contact!==POST_MENG_ID)return;e.preventDefault();e.stopImmediatePropagation();postMengProfile()},true);

/* Second morning: Jiang Xiao's death and the disclosure confrontation. */
const LEAK_PEOPLE={zhoumo:{name:'周茉（316）',avatar:PORTRAIT_CHARACTERS['周茉']||'student0'},shen:{name:'沈可欣（512）',avatar:'shen'},lin:{name:'林晴（408）',avatar:'linqing'},yelin:{name:'叶琳（108）',avatar:PORTRAIT_CHARACTERS['叶琳']||'student0'},meng:{name:'孟舒（312）',avatar:POST_MENG_AVATAR},zhao:{name:'赵诗雨（214）',avatar:FA_PEOPLE.zhao.avatar},wen:{name:'温宁（701）',avatar:FA_PEOPLE.wen.avatar}};
const LEAK_SCRIPTS={
 intro:{rows:[['zhoumo','？？？'],['zhoumo','我到底做错了什么，要被困在这鬼地方'],['zhoumo','还要遇到这么多没法解释的怪事'],['zhoumo','……唯一的朋友都不在了，我活着还有什么意思'],['shen','周茉，你冷静一点'],['lin','别做傻事'],['yelin','一年前就看你这个装货不爽了'],['yelin','真想死你现在就开门出去啊'],['yelin','你该不会是开门出去都死不了的身份吧'],['shen','都什么时候了还吵架？']],choices:['公开质问孟舒','私聊质问孟舒','什么也不做']},
 private:{private:true,rows:[['me','江晓被请离是不是和你有关？'],['me','你昨天刚问完我，今天她就出事了。'],['meng','你什么意思？'],['meng','我只是担心自己被骗，才来问你的。']],choices:['那为什么偏偏问我？','你就不怕我们合伙骗你？']},
 privateWhy:{private:true,rows:[['me','那为什么偏偏问我？'],['meng','你想多了。'],['meng','我问了很多人。']],end:'privateWhy'},
 privateBet:{private:true,rows:[['me','你就不怕我们合起伙来骗你吗？'],['meng','所以我就在赌你是好人。']],end:'privateBet'},
 public:{rows:[['me','昨天孟舒突然私聊我'],['me','问江晓有没有和我说过什么'],['me','我承认江晓提醒过我以后，今天她就被请离了'],['me','@孟舒，你怎么解释？'],['meng','你什么意思？'],['meng','我只是想确认她是不是在骗我'],['meng','她被请离和我有什么关系？'],['conditional','']],choices:['先让孟舒说江晓告诉了她什么','质问孟舒为什么偏偏找自己']},
 firstRight:{rows:[['me','孟舒，你先说'],['me','江晓找你的时候，具体告诉了你什么？'],['meng','凭什么只问我？'],['meng','她不是也找过你吗？'],['me','是你主动找我，也是你说怕她骗你'],['me','那就由你先说'],['pause',4000],['meng','她说自己是档案员'],['meng','她查过林晴，确定林晴属于学生会'],['meng','后来她又查询了我和林晴'],['meng','结果显示不同阵营'],['meng','所以她认为我是普通生，希望我帮她']],choices:['可她只提醒我小心林晴']},
 firstWrong:{rows:[['me','群里这么多人，你为什么偏偏找我？'],['meng','因为江晓亲口说过她找过你'],['meng','我不问你还能问谁？'],['shen','可能江晓出局是有些巧合在吧'],['shen','【玩家】我知道你是好心，但不要想太多了']],end:'firstWrong'},
 second:{rows:[['me','可她只提醒我小心林晴'],['me','所以我只知道她怀疑林晴'],['me','但真正知道她是档案员的人，是你'],['meng','那又怎么样？'],['meng','学生会也可能只是碰巧选中了她'],['meng','我知道她是档案员，不代表就是我告诉学生会的']],choices:['你昨晚根本不是在确认她有没有骗你','哪有这么多巧合？']},
 secondRight:{rows:[['me','你说私聊我是为了确认江晓有没有骗你'],['me','但我当时只说，她提醒我小心一个人'],['me','我没有告诉你那个人是谁，你却没有继续追问'],['me','所以你根本不在乎她对我说了什么、有没有骗你'],['me','你只是想确认她有没有把消息传出去、会不会构成威胁'],['meng','我只是不想继续追问你的私聊内容'],['meng','这也有问题吗？'],['me','你觉得解释得通吗？'],['me','有没有一种可能林晴是普通生'],['me','你才是那个学生会呢'],['me','只是江晓搞错了'],['meng','随便你们怎么想。']],end:'secondRight'},
 secondWrong:{rows:[['me','哪有这么多巧合？'],['meng','所以你觉得她死了，知道她身份的人就是学生会？'],['meng','随便你们怎么想吧。']],end:'secondWrong'}
};
function leakState(){return state.story.linAfterConflict||state.story.jiangAliveMorning||state.story.mengshuLeakConfrontation}
function leakChat(){const script=LEAK_SCRIPTS[leakState()?.script];return script?.chat||(script?.private?POST_MENG_ID:HG_ID)}
function leakStart(script){const q=leakState();if(q.phase==='choice'&&q.decisions?.[q.script]!==undefined&&LEAK_SCRIPTS[script]?.rows[0]?.[0]==='me')confirmStoryReply('leak:'+script+':0');q.script=script;q.phase='chat';q.index=0;q.due=Date.now()+messageSendDelay();persist();if(view==='chat'&&active===leakChat())openChat(active)}
function leakEffect(key,suspect=0,trust=0,danger=0){const q=leakState();q.effects??={};if(q.effects[key])return;q.effects[key]=true;if(suspect)addGroupSuspicion('meng-leak-'+key,{mengshu:suspect});state.game.otherTrust=(state.game.otherTrust||0)+trust;state.game.dangerValue=postDanger()+danger;persist()}
function leakFinish(result){const q=leakState();if(q.phase==='done')return;if(result==='privateWhy'){leakEffect(result,0,0,10);state.game.npcSecrets??={};state.game.npcSecrets.mengshu??={};state.game.npcSecrets.mengshu.suspectsPlayerHasEvidence=true}else if(result==='privateBet')leakEffect(result,0,0,-2);else if(result==='firstWrong')leakEffect(result,10,-5);else if(result==='secondRight'){leakEffect(result,40,5,10);addNotebookClue({id:'jiang-identity-leaker',title:'江晓身份的泄露者',text:'孟舒知道江晓自称档案员。她向我确认江晓是否传出消息，却没有追问我被提醒小心的人是谁。她的说法与行为存在矛盾，但尚未直接证实她的真实阵营。',date:state.system.date,time:state.system.time})}else if(result==='secondWrong')leakEffect(result,20,0,5);q.phase='done';q.pending=false;q.result=result;state.story.secondMorningMainReady=true;persist();if(view==='chat'&&active===leakChat())openChat(active)}
function leakDecorate(){const q=leakState();if(!q||!['chat','choice'].includes(q.phase)||view!=='chat'||active!==leakChat())return;const composer=screen.querySelector('#composer');if(!composer)return;composer.querySelectorAll('button,textarea').forEach(el=>el.disabled=true);composer.querySelector('textarea').placeholder=q.phase==='choice'?'选择一条回复…':'等待消息…';screen.querySelector('[data-leak-choices]')?.remove();if(q.phase==='choice')composer.insertAdjacentHTML('beforebegin','<div class="zero-choices" data-leak-choices>'+LEAK_SCRIPTS[q.script].choices.map((text,i)=>'<button data-leak-choice="'+i+'">'+esc(text)+'</button>').join('')+'</div>');scrollMessages()}
function leakChoose(index){const q=leakState();if(q?.phase!=='choice'||view!=='chat'||active!==leakChat()||!LEAK_SCRIPTS[q.script].choices?.[index])return;const script=q.script;q.decisions??={};if(q.decisions[script]!==undefined)return;q.decisions[script]=index;if(script==='intro'){if(index===2)return leakFinish('none');leakStart(index===0?'public':'private');openChat(leakChat())}else if(script==='private')leakStart(index===0?'privateWhy':'privateBet');else if(script==='public')leakStart(index===0?'firstRight':'firstWrong');else if(script==='firstRight'){leakEffect('firstRight',30,5);leakStart('second')}else if(script==='second')leakStart(index===0?'secondRight':'secondWrong');persist()}
function leakTick(){if(typeof dayTwoMorningTick==='function')dayTwoMorningTick()}
function leakAdvance(q){if(q.phase!=='chat'||Date.now()<q.due)return;const script=LEAK_SCRIPTS[q.script];if(q.index>=script.rows.length){if(script.choices){q.phase='choice';persist();leakDecorate()}else leakFinish(script.end);return}const next=script.rows[q.index];if(next?.[0]==='me'&&storyReplyGate(leakChat(),next[1].replace('【玩家】',state.profile.name),'leak:'+q.script+':'+q.index,'leakAdvance'))return;const index=q.index++;let [who,text]=script.rows[index];q.due=Date.now()+messageSendDelay();if(who==='pause'){q.due=Date.now()+text;persist();return}if(who==='conditional'){const gone=!!state.game.departedNpcs?.zhao;who=gone?'wen':'zhao';text=gone?'先把她对你们说过的话讲清楚吧':'江晓到底和你们说了什么？'}text=text.replace('【玩家】',state.profile.name);const chat=leakChat(),rows=state.messages[chat]??=[],id='meng-leak-'+q.script+'-'+index,person=LEAK_PEOPLE[who],inside=view==='chat'&&active===chat,time=q.messageTime||state.system.time;if(!rows.some(m=>m.id===id)){rows.push({id,type:'text',sender:who==='me'?'me':person.avatar,name:who==='me'?state.profile.name:person.name,text,time,gameDate:state.system.date,status:who==='me'?'read':'sent'});const c=state.contacts.find(c=>c.id===chat);if(c){c.preview=text;c.time=time;if(!inside&&who!=='me')c.unread=(c.unread||0)+1}}if(chat===HG_ID&&who==='meng'&&['secondRight','secondWrong'].includes(q.script)&&text.startsWith('随便你们怎么想')){const noticeId=id+'-suspicion';if(!rows.some(m=>m.id===noticeId))rows.push({id:noticeId,type:'system',text:'有人开始怀疑孟舒的身份了',time,gameDate:state.system.date})}persist();if(inside)openChat(chat);else{status();if(view==='messages')chatList()}}
const leakOpenChatBase=openChat;openChat=function(...args){const result=leakOpenChatBase(...args);leakDecorate();return result};
document.addEventListener('click',e=>{const b=e.target.closest('[data-leak-choice]');if(b){e.preventDefault();leakChoose(Number(b.dataset.leakChoice))}});
setInterval(leakTick,250);

/* Jiang Xiao survives: the archive rumor and her private explanation. */
LEAK_PEOPLE.hanlu={name:'韩露（506）',avatar:PORTRAIT_CHARACTERS['韩露']||'student0'};
LEAK_PEOPLE.jiang={name:'江晓',avatar:JX.avatar};
Object.assign(LEAK_SCRIPTS,{
 aliveGroup:{rows:[['hanlu','戚悦？？'],['shen','戚悦已经被请离'],['shen','大家今天更要注意规则']],end:'aliveMeng'},
 aliveMeng:{chat:POST_MENG_ID,rows:[['meng','看见了吗？'],['meng','戚悦被请离了'],['meng','戚悦的瓜，你知道吧？']],choices:['什么瓜？']},
 aliveRumor:{chat:POST_MENG_ID,rows:[['me','什么瓜？'],['meng','她当小三啊，正主就是江晓'],['meng','当时论坛闹得挺大的'],['meng','现在戚悦偏偏被学生会选中'],['meng','说不定就是江晓在公报私仇']],end:'aliveJiang'},
 aliveJiang:{chat:JX.id,rows:[['jiang','你醒了吗？']],choices:['刚醒，怎么了？']},
 aliveExplain:{chat:JX.id,rows:[['me','刚醒，怎么了？'],['jiang','我实话和你说吧'],['jiang','反正我也只剩一次检举错误的机会了'],['jiang','我之前让你小心林晴'],['jiang','是因为前天公布身份的时候我就获得档案员身份了'],['jiang','也获得了一次查询次数'],['jiang','我就查询了苏沐和林晴'],['jiang','结果显示阵营不同'],['jiang','所以林晴在我心里就是确定的学生会'],['jiang','可是我昨天检举了林晴，结果却显示检举失败'],['jiang','这完全不合理啊']],choices:['检举失败，不就说明林晴不是学生会吗？','有没有可能档案员的能力出错了？']},
 aliveNotCouncil:{chat:JX.id,rows:[['me','检举失败，不就说明林晴不是学生会吗？'],['jiang','可苏沐和她明明显示阵营不同'],['jiang','如果林晴也是普通生，结果就应该是相同啊']],end:'aliveCompare'},
 aliveAbility:{chat:JX.id,rows:[['me','有没有可能档案员的能力出错了？'],['jiang','身份说明里没有写能力会出错'],['jiang','如果查询结果本身不可信，档案员这个身份就没有意义了']],end:'aliveCompare'},
 aliveCompare:{chat:JX.id,rows:[['jiang','还有我昨晚查询了林晴和孟舒，结果是不同阵营'],['jiang','原本我以为这能证明孟舒是普通生'],['jiang','但林晴的身份现在解释不通'],['jiang','所以这个结果已经不能证明任何事了']],choices:['孟舒知道你是档案员吗？']},
 aliveKnow:{chat:JX.id,rows:[['me','孟舒知道你是档案员吗？'],['jiang','知道'],['jiang','我觉得她是普通生，就告诉了她']],choices:['我脑子有点乱，让我先理理吧']},
 aliveEnd:{chat:JX.id,rows:[['me','我脑子有点乱，让我先理理吧'],['jiang','好']],end:'aliveDone'}
});
function aliveUnlockGossip(){state.story.gossipUnlocked=true;wallArchiveInstall(state);persist()}
function aliveNotice(chat){document.querySelector('#alive-morning-notice')?.remove();const c=state.contacts.find(c=>c.id===chat);if(!c)return;const el=document.createElement('div');el.id='alive-morning-notice';el.className='opening-message';el.innerHTML='<button class="opening-body" data-action="alive-morning-open"><span>'+avatar(c.avatar)+'</span><span><small>讯息 · '+esc(state.system.time)+'</small><strong>'+esc(c.name)+'</strong><span>'+esc(c.preview)+'</span></span></button>';document.querySelector('#phone').append(el);playNotificationSound('message',el)}
actions['alive-morning-open']=()=>{const q=state.story.jiangAliveMorning;if(!q)return;document.querySelector('#alive-morning-notice')?.remove();openChat(LEAK_SCRIPTS[q.script].chat||HG_ID)};
function aliveFirstMessage(script,time){const q=state.story.jiangAliveMorning;state.system.time=time;leakStart(script);const [who,text]=LEAK_SCRIPTS[script].rows[0],person=LEAK_PEOPLE[who],chat=LEAK_SCRIPTS[script].chat,rows=state.messages[chat]??=[],id='meng-leak-'+script+'-0';q.index=1;q.due=Date.now()+messageSendDelay();if(!rows.some(m=>m.id===id)){rows.push({id,type:'text',sender:person.avatar,name:person.name,text,time,gameDate:state.system.date});const c=state.contacts.find(c=>c.id===chat);if(c){c.preview=text;c.time=time;if(view!=='chat'||active!==chat)c.unread=(c.unread||0)+1}}persist();if(view==='chat'&&active===chat)openChat(chat);else aliveNotice(chat)}
const aliveFinishBase=leakFinish;leakFinish=function(result){const q=state.story.jiangAliveMorning;if(!q||!q.script?.startsWith('alive'))return aliveFinishBase(result);if(result==='aliveMeng'){q.phase='wait-meng';q.due=Date.now()+messageSendDelay()}else if(result==='aliveJiang'){aliveUnlockGossip();q.phase='wait-jiang';q.due=q.rumorSentAt+3000}else if(result==='aliveDone'){q.phase='done';state.story.secondMorningMainReady=true;state.game.npcSecrets??={};state.game.npcSecrets.jiangxiao??={};Object.assign(state.game.npcSecrets.jiangxiao,{secondDayAlive:true,archivistDisclosedToPlayer:true})}else{leakStart(result);return}persist();if(view==='chat')openChat(active)};
const aliveChooseBase=leakChoose;leakChoose=function(index){const q=state.story.jiangAliveMorning;if(!q||!q.script?.startsWith('alive'))return aliveChooseBase(index);if(q.phase!=='choice'||view!=='chat'||active!==leakChat()||!LEAK_SCRIPTS[q.script].choices?.[index]||q.decisions[q.script]!==undefined)return;q.decisions[q.script]=index;const next={aliveMeng:'aliveRumor',aliveJiang:'aliveExplain',aliveExplain:index===0?'aliveNotCouncil':'aliveAbility',aliveCompare:'aliveKnow',aliveKnow:'aliveEnd'}[q.script];if(next)leakStart(next)};
const aliveChatBase=openChat;openChat=function(id){const result=aliveChatBase(id);if(state.story.jiangAliveMorning&&id===leakChat())document.querySelector('#alive-morning-notice')?.remove();return result};
function aliveMorningTick(){if(typeof dayTwoMorningTick==='function')dayTwoMorningTick()}
const aliveCleanupBase=cleanupSceneResume;cleanupSceneResume=function(...args){document.querySelector('#alive-morning-notice')?.remove();return aliveCleanupBase(...args)};
setInterval(aliveMorningTick,250);

// Updated avatar crops and death-line checkpoints.
const NEW_NPC_AVATARS={叶琳:'npc-yelin-v1',乔安:'npc-qiaoan-v1',陆遥:'npc-luyao-v1',蒋小雪:'npc-jiangxiaoxue-v1'};
for(const [id,name,file] of [['chat_zhoumo_v2','周茉','chat_zhoumo_v2.jpg'],['chat_yelin_v2','叶琳','chat_yelin_v2.jpg'],['npc-jiangxiaoxue-v1','蒋小雪','npc-jiangxiaoxue-v1.jpg?v=2'],['npc-yelin-v1','叶琳','npc_yelin_v1.jpg'],['npc-qiaoan-v1','乔安','npc_qiaoan_v1.jpg'],['npc-luyao-v1','陆遥','npc_luyao_v1.jpg'],['npc-avatar-pool-1','备用NPC头像1','npc_pool_1_v1.jpg'],['npc-avatar-pool-2','备用NPC头像2','npc_pool_2_v1.jpg'],['npc-avatar-pool-3','备用NPC头像3','npc_pool_3_v1.jpg']]){if(!C.avatars.some(a=>a.id===id))C.avatars.push({id,name,src:'assets/chat-avatars/'+file});if(NEW_NPC_AVATARS[name])PORTRAIT_CHARACTERS[name]=id}
LEAK_PEOPLE.zhoumo.avatar='chat_zhoumo_v2';
LEAK_PEOPLE.yelin.avatar=NEW_NPC_AVATARS['叶琳'];
if(typeof RECORD_PEOPLE!=='undefined')RECORD_PEOPLE.ye[2]='assets/chat-avatars/npc_yelin_v1.jpg?v=20261011-rc4';
function migrateDebatePortraits(progress){for(const c of progress.contacts||[]){const name=(c.name||'').replace(/^叶舒/,'蒋小雪').replace(/（.*?）|\(.*?\)/g,'').trim();if(NEW_NPC_AVATARS[name])c.avatar=NEW_NPC_AVATARS[name];else if(c.id==='yeshu')c.avatar=NEW_NPC_AVATARS['蒋小雪']}for(const rows of Object.values(progress.messages||{}))for(const m of rows){if(m.sender==='me')continue;if(/^周茉/.test(m.name||''))m.sender='chat_zhoumo_v2';for(const [name,id] of Object.entries(NEW_NPC_AVATARS))if(new RegExp('^'+name).test((m.name||'').replace(/^叶舒/,'蒋小雪')))m.sender=id}}
migrateDebatePortraits(state);
const portraitRecords=nodeRecords();for(const record of Object.values(portraitRecords))if(record.checkpoint)migrateDebatePortraits(record.checkpoint);saveNodes(portraitRecords);
function startImmediateZhoumo(){if(typeof dayTwoStart==='function'&&postEvening()?.decisions?.meng===1)dayTwoStart('death')}
const retiredMengNode='meng-private-trust-choice';const retiredMengIndex=STORY_CHOICES.findIndex(n=>n.id===retiredMengNode);if(retiredMengIndex>=0)STORY_CHOICES.splice(retiredMengIndex,1);
const LEAK_CHOICE_NODES={intro:{id:'jiang-death-response',title:'江晓死亡：选择质问方式'},private:{id:'jiang-death-private-question',title:'江晓死亡：私聊质问孟舒'},public:{id:'jiang-death-reasoning-one',title:'江晓死亡：第一轮推理'},firstRight:{id:'jiang-death-evidence',title:'江晓死亡：指出知情者'},second:{id:'jiang-death-reasoning-two',title:'江晓死亡：第二轮关键推理'}};
for(const [script,node] of Object.entries(LEAK_CHOICE_NODES))if(!STORY_CHOICES.some(n=>n.id===node.id))STORY_CHOICES.push({...node,day:'第二日 · 江晓死亡线',chat:script==='private'?POST_MENG_ID:HG_ID});
function captureLeakChoice(){const q=state.story.mengshuLeakConfrontation,node=q&&LEAK_CHOICE_NODES[q.script];if(q?.dayTwoVersion||!node||q.phase!=='choice'||q.decisions?.[q.script]!==undefined||view!=='chat'||active!==leakChat())return;return captureStoryNode(node.id,state,{route:{view:'chat',active:leakChat()}})}
const checkpointLeakDecorate=leakDecorate;leakDecorate=function(...args){const result=checkpointLeakDecorate(...args);captureLeakChoice();return result};
if(!window.mobileLaunch)captureLeakChoice();

// Send only the first player reply immediately after an accepted choice.
const immediateLeakChooseBase=leakChoose;leakChoose=function(index){const before=leakState(),wasChoice=before?.phase==='choice',previous=before?.script;const result=immediateLeakChooseBase(index);const q=leakState();if(wasChoice&&q===before&&q.phase==='chat'&&q.script!==previous&&q.index===0&&LEAK_SCRIPTS[q.script]?.rows[0]?.[0]==='me'){q.due=Date.now();leakAdvance(q)}return result};

// Fixed early-sleep control for the first evening's exploration window.
const earlySleepStyle=document.createElement('style');earlySleepStyle.textContent=`#post-early-sleep{position:absolute;right:14px;top:144px;z-index:8;display:flex;align-items:center;gap:5px;padding:10px 12px;border-radius:18px;border:1px solid #c9b8cc30;background:#302b36ed;backdrop-filter:blur(14px);box-shadow:0 4px 16px #0003;color:#ddd2df;font-size:12px;min-height:40px;touch-action:manipulation;user-select:none;cursor:pointer}#post-early-sleep svg{width:16px;height:16px}#post-early-sleep[hidden]{display:none}`;document.head.append(earlySleepStyle);
const earlySleepButton=document.createElement('button');earlySleepButton.id='post-early-sleep';earlySleepButton.type='button';earlySleepButton.hidden=true;earlySleepButton.innerHTML=icon('back')+'<span>提前睡觉</span>';document.querySelector('#phone').append(earlySleepButton);
function earlySleepAvailable(){const p=postEvening();return !window.mobileLaunch&&(p?.phase==='purchase-required'||p?.phase==='explore'&&Date.now()<p.exploreUntil)&&!state.game.survivalEnding&&!['game-menu','nodes','zero-death'].includes(view)}
function syncEarlySleepButton(){earlySleepButton.hidden=!earlySleepAvailable()}
earlySleepButton.onclick=()=>{if(!earlySleepAvailable())return;if(postPurchasePrompt())return;sheet('是否提前入眠？','<p>确认后将结束本次自由行动，进入睡觉流程。</p><button class="primary" data-action="post-early-sleep-confirm">提前入眠</button><button class="secondary" data-action="close">继续探索</button>')};
actions['post-early-sleep-confirm']=()=>{if(!earlySleepAvailable()){closeSheet();return}if(postPurchasePrompt())return;closeSheet();postEvening().phase='bed';earlySleepButton.hidden=true;postSleepScene()};
setInterval(syncEarlySleepButton,250);syncEarlySleepButton();

// Han Lu portrait and Jiang Xiao's identity-question checkpoint.
if(!C.avatars.some(a=>a.id==='chat_hanlu_v1'))C.avatars.push({id:'chat_hanlu_v1',name:'韩露',src:'assets/chat-avatars/chat_hanlu_v1.jpg?v=20261011-rc4'});PORTRAIT_CHARACTERS['韩露']='chat_hanlu_v1';LEAK_PEOPLE.hanlu.avatar='chat_hanlu_v1';
function migrateHanluPortrait(progress){for(const rows of Object.values(progress.messages||{}))for(const m of rows)if(m.sender!=='me'&&/^韩露/.test(m.name||''))m.sender='chat_hanlu_v1';for(const c of progress.contacts||[])if(/^韩露/.test(c.name||''))c.avatar='chat_hanlu_v1'}
migrateHanluPortrait(state);const hanluResumeBase=resumeStoryScene;resumeStoryScene=function(snapshot){const result=hanluResumeBase(snapshot);migrateHanluPortrait(state);return result};
const JIANG_IDENTITY_NODE='jiang-alive-identity-question';if(!STORY_CHOICES.some(n=>n.id===JIANG_IDENTITY_NODE))STORY_CHOICES.push({id:JIANG_IDENTITY_NODE,title:'江晓：检举结果的矛盾',day:'第二日 · 江晓存活线',chat:JX.id});
function captureJiangIdentityChoice(){const q=state.story.jiangAliveMorning;if(q?.script!=='aliveExplain'||q.phase!=='choice'||q.decisions?.aliveExplain!==undefined||view!=='chat'||active!==JX.id)return;return captureStoryNode(JIANG_IDENTITY_NODE,state,{route:{view:'chat',active:JX.id}})}
const jiangIdentityDecorateBase=leakDecorate;leakDecorate=function(...args){const result=jiangIdentityDecorateBase(...args);captureJiangIdentityChoice();return result};
if(!window.mobileLaunch)captureJiangIdentityChoice();

// Day shortcuts retain the existing checkpoint list and loading rules.
const nodeDayStyle=document.createElement('style');nodeDayStyle.textContent='.node-day-shortcuts{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:5px;margin:12px 0 18px;padding:8px 0}.node-day-shortcuts button{font:inherit;font-size:11px;white-space:nowrap;padding:9px 0;border:1px solid #c9b8cc40;border-radius:10px;background:#c9b8cc12;color:inherit;cursor:pointer}.node-day-shortcuts button:disabled{opacity:.3;cursor:default}.node-day-shortcuts button[aria-current="true"]{background:#b791aa30;border-color:#b791aa}.zero-node[data-node-day]{scroll-margin-top:16px}';document.head.append(nodeDayStyle);
const dayShortcutNodesBase=zeroNodes;zeroNodes=function(...args){const result=dayShortcutNodesBase(...args);if(view!=='nodes')return result;const page=screen.querySelector('.zero-nodes');if(!page||page.querySelector('.node-day-shortcuts'))return result;const days=['第零日','第一日','第二日','第三日','第四日'],nodes=[...page.querySelectorAll('.zero-timeline .zero-node')],restricted=isFreeActionSegment(state);nodes.forEach((el,i)=>{const record=restricted?null:STORY_CHOICES[i];const label=record?.day||el.querySelector('small')?.textContent||(record?'第零日':'');const day=days.find(d=>label.startsWith(d));if(day)el.dataset.nodeDay=day});const nav=document.createElement('nav');nav.className='node-day-shortcuts';nav.setAttribute('aria-label','按日期定位存档');nav.innerHTML=days.map(day=>'<button type="button" data-node-day-jump="'+day+'" '+(nodes.some(el=>el.dataset.nodeDay===day)?'':'disabled')+'>'+day+'</button>').join('');page.querySelector('.page-head').after(nav);nav.addEventListener('click',e=>{const button=e.target.closest('[data-node-day-jump]');if(!button||button.disabled)return;const target=nodes.find(el=>el.dataset.nodeDay===button.dataset.nodeDayJump);if(!target)return;nav.querySelectorAll('button').forEach(b=>b.setAttribute('aria-current',String(b===button)));target.scrollIntoView({behavior:'smooth',block:'start'})});return result};

// Midnight rule announcement pauses the existing first-night sleep transition.
const MIDNIGHT_RULE_ID='chapter-three-midnight-rules';
const MIDNIGHT_RULE_BODY='缺乏判断能力的群体，应当为低效决策共同支付代价。\n有限的生存资源，只应留给能够证明自身价值的人。\n\n一、从今日开始，若检举使任何普通生成员被请离，将另外随机请离五名普通生，作为浪费生存资源、降低筛选效率的惩罚。\n\n二、严禁使用宿舍楼楼梯。\n\n三、不要独自进入电梯。后果自负。\n\n四、普通生无权与学生会成员同时处于电梯内。\n\n五、随意更换宿舍者将被直接抹除。';
function midnightBlack(){const previous=captureSceneSnapshot(screen);closeSheet();view='midnight-sleep';active=null;rememberRoute();screen.innerHTML='<section style="position:absolute;inset:0;background:#000"></section>';document.querySelector('#phone').classList.add('zero-immersive');zeroDissolve(previous);persist()}
function midnightNotice(){if(document.querySelector('#midnight-rules-notice'))return;const el=document.createElement('div');el.id='midnight-rules-notice';el.className='opening-message';el.innerHTML='<button class="opening-body" data-action="midnight-rules-open"><span>'+avatar('chat_report_black')+'</span><span><small>讯息 · 00:00</small><strong>校园墙 · 转发帖子</strong><span>第三章规则已发布</span></span></button>';document.querySelector('#phone').append(el);playNotificationSound('message',el)}
function midnightPublish(){const p=postEvening();if(!p||!['midnight-wait','midnight-notice','midnight-reading'].includes(p.phase))return;const reading=p.phase==='midnight-reading',ruleDate=state.forumPosts.find(x=>x.id===MIDNIGHT_RULE_ID)?.date||(state.messages[DAY_ONE_REPORT_ID]||[]).find(m=>m.id===MIDNIGHT_RULE_ID)?.gameDate||deliveryDateNext(state.system.date);state.system.time='00:00';if(!state.forumPosts.some(x=>x.id===MIDNIGHT_RULE_ID))state.forumPosts.push({id:MIDNIGHT_RULE_ID,author:'campus-system',name:'',nightService:true,official:true,tag:'校园新规',category:'校园新规',title:'【校园新规·第三章】',body:MIDNIGHT_RULE_BODY,date:ruleDate,time:'00:00',likes:0,replies:[]});const rows=state.messages[DAY_ONE_REPORT_ID]??=[];if(!rows.some(m=>m.id===MIDNIGHT_RULE_ID)){rows.push({id:MIDNIGHT_RULE_ID,type:'text',sender:'chat_report_black',name:'',text:'校园墙 · 转发帖子：第三章规则已发布',time:'00:00',gameDate:ruleDate});const c=reportContact();if(c){c.preview='第三章规则已发布';c.time='00:00';if(!reading)c.unread=(c.unread||0)+1}}if(!reading){p.phase='midnight-notice';const c=reportContact();if(c)c.unread=Math.max(1,c.unread||0)}persist();if(!reading)midnightNotice()}
function midnightRulesReading(){return (view==='post'&&active===MIDNIGHT_RULE_ID&&postEvening()?.phase==='midnight-reading')||(typeof d3ReadingRules==='function'&&d3ReadingRules())}
const midnightContinue=document.createElement('button');midnightContinue.id='midnight-continue-sleep';midnightContinue.type='button';midnightContinue.hidden=true;midnightContinue.innerHTML=icon('back')+'<span>继续睡觉</span>';document.querySelector('#phone').append(midnightContinue);const midnightStyle=document.createElement('style');midnightStyle.textContent=earlySleepStyle.textContent.replaceAll('#post-early-sleep','#midnight-continue-sleep');document.head.append(midnightStyle);
actions['midnight-rules-open']=()=>{const p=postEvening();if(!['midnight-notice','midnight-reading'].includes(p?.phase))return;document.querySelector('#midnight-rules-notice')?.remove();p.phase='midnight-reading';zeroChrome();if(reportContact())reportContact().unread=0;postDetail(MIDNIGHT_RULE_ID);midnightContinue.hidden=false;persist()};
midnightContinue.onclick=()=>{if(typeof d3ReadingRules==='function'&&d3ReadingRules()){d3StartMorning();return}const p=postEvening();if(p?.phase!=='midnight-reading')return;midnightContinue.hidden=true;midnightBlack();p.phase='sleep';p.due=Date.now()+1000;persist()};
setInterval(()=>{const p=postEvening();midnightContinue.hidden=!midnightRulesReading();if(window.mobileLaunch||document.hidden||['game-menu','nodes'].includes(view))return;if(p?.phase==='midnight-wait'){if(view!=='midnight-sleep')midnightBlack();if(Date.now()>=p.due)midnightPublish()}else if(p?.phase==='midnight-notice')midnightNotice()},250);
const midnightLockBase=zeroLock;zeroLock=function(){return !['game-menu','nodes'].includes(view)&&['midnight-wait','midnight-notice'].includes(postEvening()?.phase)||midnightLockBase()};
const shortDayNodesBase=zeroNodes;zeroNodes=function(...args){const result=shortDayNodesBase(...args);if(view==='nodes')for(const label of screen.querySelectorAll('.zero-node small')){const day=label.textContent.match(/第[零一二三四五]日/);if(day)label.textContent=day[0]}return result};

// Optional Lin Qing conversation after the public confrontation.
Object.assign(LEAK_SCRIPTS,{
 linAfterIntro:{chat:'linqing',rows:[['lin','江晓什么时候跟你说的'],['lin','让你小心我']],choices:['昨天上午']},
 linAfterWhen:{chat:'linqing',rows:[['me','昨天上午。'],['lin','那你为什么还把泡面分给我？']],choices:['因为我不觉得你会害我','就是想给你也尝尝']},
 linAfterTrust:{chat:'linqing',rows:[['me','因为我不觉得你会害我。'],['lin','我知道了。'],['lin','谢谢你。']],end:'linAfterPlus5'},
 linAfterTaste:{chat:'linqing',rows:[['me','就是想给你也尝尝'],['linTyping',3000],['lin','【玩家】'],['lin','你对谁都这么好吗']],choices:['什么？','你都给我士力架了']},
 linAfterWhat:{chat:'linqing',rows:[['me','什么？'],['lin','没什么'],['lin','当我什么都没说吧']],end:'linAfterPlus0'},
 linAfterSnack:{chat:'linqing',rows:[['me','你都给我士力架了'],['me','我给你分一点是理所应当的呀，什么好不好的'],['lin','这样啊，我知道了']],end:'linAfterPlus2'}
});
// Require the public exchange to have actually been sent on this saved worldline.
function linAfterPublicWarningKnown(snapshot=state){
 const q=snapshot.story.mengshuLeakConfrontation;if(!q)return false;
 const decisions=q.decisions||{},authored=!!q.dayTwoVersion;
 if(decisions.intro!==(authored?1:0)||decisions.public!==0||!authored&&decisions.firstRight!==0)return false;
 const rows=snapshot.messages[HG_ID]||[],warningPrefix=authored?'day2-authored-publicVerify-':'meng-leak-firstRight-',replyPrefix=authored?'day2-authored-publicVerify-':'meng-leak-second-';
 const warned=rows.some(m=>m.id?.startsWith(warningPrefix)&&m.sender!=='me'&&/林晴/.test(m.text||''));
 const acknowledged=rows.some(m=>m.id?.startsWith(replyPrefix)&&m.sender==='me'&&(authored?m.text==='可我昨天只跟你说江晓提醒我小心一个人':/小心林晴/.test(m.text||'')));
 return warned&&acknowledged;
}
function linAfterEligible(){const q=state.story.mengshuLeakConfrontation;return q?.phase==='done'&&linAfterPublicWarningKnown()&&state.story.noodleEvening?.choices?.taste===1&&!state.story.linAfterConflict}
const linAfterFinishBase=leakFinish;leakFinish=function(result){const q=state.story.linAfterConflict;if(q&&result.startsWith('linAfterPlus')){if(q.phase==='done')return;state.game.trust??={};state.game.trust.linqing=(state.game.trust.linqing??30)+Number(result.slice('linAfterPlus'.length));q.phase='done';state.story.secondMorningMainReady=true;persist();openChat('linqing');return}const value=linAfterFinishBase(result);if(linAfterEligible())state.story.secondMorningMainReady=false;return value};
const linAfterChooseBase=leakChoose;leakChoose=function(index){const q=state.story.linAfterConflict;if(!q)return linAfterChooseBase(index);if(q.phase!=='choice'||view!=='chat'||active!=='linqing'||!LEAK_SCRIPTS[q.script].choices?.[index]||q.decisions[q.script]!==undefined)return;const next={linAfterIntro:'linAfterWhen',linAfterWhen:index===0?'linAfterTrust':'linAfterTaste',linAfterTaste:index===0?'linAfterWhat':'linAfterSnack'}[q.script];if(!next)return;q.decisions[q.script]=index;leakStart(next);q.due=Date.now();leakAdvance(q)};
const linAfterAdvanceBase=leakAdvance;leakAdvance=function(q){if(q===state.story.linAfterConflict&&q.phase==='chat'&&view==='chat'&&active==='linqing'&&Date.now()>=q.due){q.typing=false;const row=LEAK_SCRIPTS[q.script]?.rows[q.index];if(row?.[0]==='linTyping'){q.index++;q.typing=true;q.due=Date.now()+row[1];persist();openChat('linqing');return}}return linAfterAdvanceBase(q)};
const linAfterDecorateBase=leakDecorate;leakDecorate=function(...args){const value=linAfterDecorateBase(...args);if(view==='chat'&&active==='linqing'&&state.story.linAfterConflict?.typing){screen.querySelector('.lin-after-typing')?.remove();screen.querySelector('#messages')?.insertAdjacentHTML('beforeend','<div class="message fa-typing lin-after-typing">'+avatar(LEAK_PEOPLE.lin.avatar)+'<div class="bubble"><span>正在输入</span><i></i><i></i><i></i></div></div>');scrollMessages()}return value};
// This branch is optional. Keep its node locked (and therefore shown as “？”) until the player actually reaches its choice.
const LIN_AFTER_CHOICE_NODE={id:'linqing-private-reply-choice',title:'林晴私聊：选择回应方式',day:'第二日 · 林晴私聊',chat:'linqing'};
if(!STORY_CHOICES.some(node=>node.id===LIN_AFTER_CHOICE_NODE.id))STORY_CHOICES.push(LIN_AFTER_CHOICE_NODE);
function captureLinAfterChoice(){const q=state.story.linAfterConflict;if(q?.script!=='linAfterWhen'||q.phase!=='choice'||q.decisions?.linAfterWhen!==undefined||view!=='chat'||active!=='linqing')return;return captureStoryNode(LIN_AFTER_CHOICE_NODE.id,state,{route:{view:'chat',active:'linqing'}})}
const checkpointLinAfterDecorate=leakDecorate;leakDecorate=function(...args){const value=checkpointLinAfterDecorate(...args);captureLinAfterChoice();return value};
actions['lin-after-open']=()=>{document.querySelector('#lin-after-notice')?.remove();openChat('linqing')};
setInterval(()=>{if(window.mobileLaunch||document.hidden||['game-menu','nodes','zero-death'].includes(view)||!linAfterEligible())return;state.story.linAfterConflict={phase:'chat',script:'linAfterIntro',index:1,decisions:{},due:Date.now()+messageSendDelay(),messageTime:'09:02'};state.story.secondMorningMainReady=false;const rows=state.messages.linqing??=[];rows.push({id:'meng-leak-linAfterIntro-0',type:'text',sender:LEAK_PEOPLE.lin.avatar,name:'林晴',text:'江晓什么时候跟你说的',time:'09:02',gameDate:state.system.date});const c=state.contacts.find(c=>c.id==='linqing');if(c){c.preview='江晓什么时候跟你说的';c.time='09:02';if(view!=='chat'||active!=='linqing')c.unread=(c.unread||0)+1}persist();if(view==='chat'&&active==='linqing')openChat('linqing');else{const el=document.createElement('div');el.id='lin-after-notice';el.className='opening-message';el.innerHTML='<button class="opening-body" data-action="lin-after-open"><span>'+avatar(LEAK_PEOPLE.lin.avatar)+'</span><span><small>讯息</small><strong>林晴</strong><span>江晓什么时候跟你说的</span></span></button>';document.querySelector('#phone').append(el);playNotificationSound('message',el)}},250);
for(const p of state.forumPosts)if(p.id===MIDNIGHT_RULE_ID)Object.assign(p,{title:'【校园新规·第三章】',nightService:true,official:true,tag:'校园新规',category:'校园新规'});

const MENG_ERROR_FAILURES=['xianing','yuwei','yelin','qiaoan','luyao','ningke','baizhi'];
const MENG_ERROR_PEOPLE={
 qiaoan:{name:'乔安（205）',avatar:NEW_NPC_AVATARS['乔安']},yuwei:{name:'余薇（106）',avatar:PORTRAIT_CHARACTERS['余薇']},luyao:{name:'陆遥（207）',avatar:NEW_NPC_AVATARS['陆遥']},
 ningke:{name:'宁可（211）',avatar:PORTRAIT_CHARACTERS['宁可']},yelin:{name:'叶琳（108）',avatar:NEW_NPC_AVATARS['叶琳']},baizhi:{name:'白栀（223）',avatar:PORTRAIT_CHARACTERS['白栀']},
 xianing:{name:'夏宁（101）',avatar:'student6'},shen:{name:'沈可欣（512）',avatar:'shen'},wen:{name:'温宁（701）',avatar:'npc-wenning'},
 jiang:{name:'江晓（316）',avatar:'npc-jiangxiao'},hanlu:{name:'韩露（506）',avatar:'student7'}
};
const MENG_ERROR_SONG=[
 ['qiaoan','我刚刚检举了宋佳'],['qiaoan','系统提示失败了'],['yuwei','我也是…'],
 ['yelin','今天本来就没多少信息'],['yelin','规则又要求所有人必须检举'],
 ['baizhi','所以大家就随便选了一个人？'],['qiaoan','说到底，我们都是倒霉吧…'],
 ['system','群聊安静了几秒。'],['shen','以后没有证据，不要因为别人提了一个名字就跟着检举'],
 ['shen','这次已经来不及了']
];
const MENG_ERROR_ZHAO_OPEN=[
 ['yuwei','我今天检举了赵诗雨'],['yuwei','系统提示失败了'],['luyao','我也是失败'],['luyao','所以赵诗雨根本不是学生会？'],
 ['qiaoan','@温宁'],['qiaoan','不是你说看见赵诗雨去取快递了吗？'],['wen','我从来没说那个人一定是赵诗雨'],
 ['wen','是【玩家】和我说“有没有可能就是赵诗雨”'],['wen','我才觉得这种可能性很大']
];
const MENG_ERROR_ZHAO_RIGHT=[
 ['me','黄色外套这件事，是从你口中先说出来的'],['me','你又说在赵诗雨朋友圈见过'],['me','我才会怀疑是她'],
 ['me','对了，我昨晚检举的人是你'],['me','系统显示检举成功'],['system','群聊安静了几秒。'],
 ['qiaoan','？？？'],['yuwei','你的意思是温宁才是学生会？'],['wen','检举结果不能发出来'],
 ['wen','你现在说什么都可以'],['wen','你有办法证明吗？'],['me','我是没办法证明，那就让大家自己判断'],
 ['jiang','温宁，你还是需要解释清楚'],['jiang','为什么没有看清正脸，却把怀疑说得那么肯定？'],
 ['wen','我没什么可解释的'],['wen','我当时看到什么，就说了什么'],['wen','后来在群里说这些'],
 ['wen','也是因为【玩家】先提出了这种可能'],['wen','你们要是相信我，今晚就检举【玩家】']
];
const MENG_ERROR_ZHAO_WRONG=[
 ['me','是你先主动引导我的'],['me','你先说看见了黄色外套'],['me','又说在赵诗雨朋友圈见过'],['me','我才会怀疑是她'],
 ['wen','我说的是“我以为是她”'],['wen','我只是提供了目击信息'],['wen','是你直接问我，有没有可能就是赵诗雨'],
 ['wen','我是觉得你说得有道理'],['wen','才把这个推测发到群里的'],['wen','如果你没有先说这些'],
 ['wen','我会在群里指向赵诗雨吗？'],['wen','又怎么会有这么多人检举她？'],['hanlu','这样看，你们两个都有责任吧'],
 ['wen','你们自己判断吧'],['wen','我也是被人当枪使了而已']
];
function mengError(){return state.story.mengErrorBranch}
function mengErrorEligible(){const target=dayReport()?.groupResult?.target;if(target==='songjia')return 'songjia';if(target!=='zhao')return null;const f=typeof fa==='function'?fa():null;const choseZhao=f?.decisions?.['wen:wenCoat:3']===0;const published=f?.completed?.includes('wen')&&f?.clues?.some(c=>c.result==='wenPublic');return choseZhao&&published?'zhao':null}
function mengErrorFailure(progress=state){
 progress.game.npcReportFailures??={};
 for(const key of MENG_ERROR_FAILURES){
  progress.game.npcReportFailures[key]=(progress.game.npcReportFailures[key]||0)+1;
  if(progress.game.npcReportFailures[key]<2||progress.game.departedNpcs?.[key])continue;
  syncNpcDeparture(progress,key,{cause:'personal-report-error',date:progress.system.date,status:'已离校',id:'meng-error-removal-'+progress.system.date+'-'+key,time:'21:06'});
 }
}
function mengErrorNotice(){document.querySelector('#meng-error-notice')?.remove();const el=document.createElement('div');el.id='meng-error-notice';el.className='opening-message';el.innerHTML='<button class="opening-body" data-action="meng-error-open"><span>'+avatar('chat_help_group')+'</span><span><small>讯息 · 21:06</small><strong>女生B栋临时互助群</strong><span>有人开始讨论昨晚的错误检举</span></span></button><button class="opening-close" data-action="meng-error-dismiss" aria-label="关闭消息通知">×</button>';document.querySelector('#phone').append(el)}
function mengErrorAdd(row){const q=mengError(),[who,raw]=row,text=raw.replaceAll('【玩家】',state.profile?.name||'玩家'),rows=state.messages[HG_ID]??=[],id='meng-error-'+q.route+'-'+q.index+'-'+Date.now();if(who==='system'){rows.push({id,type:'system',text,time:'21:06',gameDate:state.system.date,status:'read'})}else{const p=who==='me'?{name:state.profile?.name||'玩家',avatar:'me'}:MENG_ERROR_PEOPLE[who];rows.push({id,type:'text',sender:p.avatar,name:p.name,text,time:'21:06',gameDate:state.system.date,status:who==='me'?'read':'sent'})}const c=hgContact();if(c){c.time='21:06';c.preview=who==='system'?text:(who==='me'?'我：':MENG_ERROR_PEOPLE[who]?.name+'：')+text;if(view!=='chat'||active!==HG_ID)c.unread=(c.unread||0)+1}if(view==='chat'&&active===HG_ID)openChat(HG_ID);else if(view==='messages')chatList();else status()}
function mengErrorDecorate(){screen.querySelector('[data-meng-error-choices]')?.remove();const q=mengError();if(!q||q.phase!=='choice'||view!=='chat'||active!==HG_ID)return;screen.querySelector('[data-meng-error-choices]')?.remove();const input=screen.querySelector('#composer');if(!input)return;if(q.awaitingFinal){input.insertAdjacentHTML('beforebegin','<div class="zero-choices" data-meng-error-choices><button data-meng-error-choice="2">……</button></div>');scrollMessages();return}const eligible=q.route==='zhao'&&q.personalWenSuccess;const options=(eligible?['我昨晚检举的是你，而且显示成功','是你先主动引导我的']:['是你先主动引导我的']);input.insertAdjacentHTML('beforebegin','<div class="zero-choices" data-meng-error-choices>'+options.map((x,i)=>'<button data-meng-error-choice="'+(eligible?i:1)+'">'+esc(x)+'</button>').join('')+'</div>');scrollMessages()}
function mengErrorApplyChoice(index){const q=mengError();if(!q||q.phase!=='choice')return;q.decisions??={};if(q.awaitingFinal){if(index!==2||q.decisions.final!==undefined)return;q.decisions.final=0;q.awaitingFinal=false;q.phase='chat';q.rows=[['me','……']];q.index=0;q.due=Date.now();confirmStoryReply('meng-error:'+q.route+':final:0');persist();mengErrorTick();return}if(q.decisions.open!==undefined)return;q.decisions.open=index;q.opening=false;q.phase='chat';if(index===0&&q.personalWenSuccess){state.game.dangerValue=(postDanger()||0)+10;addGroupSuspicion('meng-error-zhao-wen',{wen:50});addNotebookClue({id:'wen-report-result',title:'温宁的检举结果',text:'第一晚检举结果显示温宁检举失败。她没有看清黄色外套的正脸，却把赵诗雨的嫌疑带进了群聊。',date:state.system.date,time:'21:06'});q.rows=MENG_ERROR_ZHAO_RIGHT}else{state.game.otherTrust=(state.game.otherTrust||0)-10;state.game.dangerValue=(postDanger()||0)+10;addGroupSuspicion('meng-error-zhao-blame',{wen:15,me:40});q.rows=MENG_ERROR_ZHAO_WRONG}q.index=0;q.due=Date.now();if(q.rows[0]?.[0]==='me')confirmStoryReply('meng-error:'+q.route+':'+q.decisions.open+':0');mengErrorDecorate();persist();mengErrorTick()}
function mengErrorFinish(){const q=mengError();if(!q||q.phase==='done')return;q.phase='done';q.finishedAt=Date.now();state.system.time='21:20';persist();document.querySelector('#meng-error-notice')?.remove();postNotice('friend')}
function mengErrorStart(){const p=postEvening();if(!p||p.phase!=='friend'||mengError())return false;const route=mengErrorEligible();if(!route){state.story.mengErrorBranch={phase:'skipped',reason:'target-or-condition'};persist();return false}const r=dayReport(),personal=state.game.personalReports?.[r?.date],personalWenSuccess=route==='zhao'&&personal?.target==='wen'&&personal.correct===true;state.system.time='21:06';state.story.mengErrorBranch={phase:'chat',route,index:0,rows:route==='songjia'?MENG_ERROR_SONG:MENG_ERROR_ZHAO_OPEN,opening:route==='zhao',personalWenSuccess,decisions:{},due:Date.now()};mengErrorFailure();persist();document.querySelector('#post-evening-notice')?.remove();if(view==='chat'&&active===HG_ID)openChat(HG_ID);else mengErrorNotice();return true}
function mengErrorTick(){const q=mengError();if(!q||q.phase!=='chat'||Date.now()<q.due)return;if(q.index>=q.rows.length){if(q.route==='zhao'&&q.opening!==false){q.phase='choice';persist();mengErrorDecorate();captureMengErrorChoice();return}if(q.route==='zhao'&&q.decisions?.open===0&&q.decisions.final===undefined){q.awaitingFinal=true;q.phase='choice';persist();mengErrorDecorate();return}mengErrorFinish();return}const next=q.rows[q.index];if(next?.[0]==='me'&&storyReplyGate(HG_ID,next[1],'meng-error:'+q.route+':'+(q.decisions?.final!==undefined?'final':q.decisions?.open??'intro')+':'+q.index,'mengErrorTick'))return;const row=q.rows[q.index++];q.due=Date.now()+messageSendDelay();mengErrorAdd(row);persist();mengErrorDecorate()}
const mengErrorPostNoticeBase=postNotice;
postNotice=function(kind){if(kind==='friend'){if(mengErrorStart())return;const q=mengError();if(q&&!['done','skipped'].includes(q.phase))return}return mengErrorPostNoticeBase(kind)};
const mengErrorOpenChatBase=openChat;
openChat=function(id){const result=mengErrorOpenChatBase(id);if(id===HG_ID)mengErrorDecorate();return result};
Object.assign(actions,{'meng-error-open':()=>{document.querySelector('#meng-error-notice')?.remove();openChat(HG_ID)},'meng-error-dismiss':()=>{document.querySelector('#meng-error-notice')?.remove()},'meng-error-choice':i=>mengErrorApplyChoice(Number(i))});
document.addEventListener('click',e=>{const b=e.target.closest('[data-meng-error-choice]');if(b){e.preventDefault();e.stopImmediatePropagation();mengErrorApplyChoice(Number(b.dataset.mengErrorChoice))}},true);
setInterval(mengErrorTick,200);
if(postEvening()?.phase==='friend'&&!mengError())mengErrorStart();
if(mengError()?.phase==='chat'&&!document.querySelector('#meng-error-notice')&&!(view==='chat'&&active===HG_ID))mengErrorNotice();

/* Save the confrontation choice before either response is selected. */
const MENG_ERROR_CHOICE_NODE={id:'meng-error-wen-confrontation',title:'温宁对峙：选择回应方式',day:'第一日 · 检举后',chat:HG_ID};
if(!STORY_CHOICES.some(item=>item.id===MENG_ERROR_CHOICE_NODE.id)){const reportIndex=STORY_CHOICES.findIndex(item=>item.id===REPORT_RESULT_NODE);STORY_CHOICES.splice(reportIndex<0?STORY_CHOICES.length:reportIndex+1,0,MENG_ERROR_CHOICE_NODE)}
function captureMengErrorChoice(){const q=mengError();if(!q||q.route!=='zhao'||q.phase!=='choice'||q.awaitingFinal||q.decisions?.open!==undefined||view!=='chat'||active!==HG_ID)return;return captureStoryNode(MENG_ERROR_CHOICE_NODE.id,state,{route:{view:'chat',active:HG_ID},mengStoryVersion:4})}
const mengErrorDecorateCheckpointBase=mengErrorDecorate;
mengErrorDecorate=function(...args){const result=mengErrorDecorateCheckpointBase(...args);captureMengErrorChoice();return result};
if(!window.mobileLaunch)captureMengErrorChoice();

/* Load the full-screen choice tree after every story node has registered. */
if(!document.querySelector('link[href="choice-tree.css?v=20261011-rc4"]')){const choiceTreeStyle=document.createElement('link');choiceTreeStyle.rel='stylesheet';choiceTreeStyle.href='choice-tree.css?v=20261011-rc4';document.head.append(choiceTreeStyle)}
if(!document.querySelector('script[src="choice-tree.js?v=20261011-rc4"]')){const choiceTreeScript=document.createElement('script');choiceTreeScript.src='choice-tree.js?v=20261011-rc4';document.body.append(choiceTreeScript)}

function migrateSongjiaDialogue(){let changed=false;for(const rows of Object.values(state.messages||{})){for(let i=rows.length-1;i>=0;i--){const m=rows[i];if(!m.id?.startsWith('meng-error-songjia-'))continue;if(['所以宋佳不是学生会？','可她今天根本没做什么','为什么最后会是她？','我看见有人提宋佳','就跟着填了她的名字'].includes(m.text)){rows.splice(i,1);changed=true;continue}const next=m.text?.replace('我也是……','我也是…').replace('说到底，她就是倒霉吧','说到底，我们都是倒霉吧…');if(next!==m.text){m.text=next;changed=true}}}const q=mengError();if(q?.route==='songjia'&&q.rows?.some(row=>row[1]==='所以宋佳不是学生会？')){q.rows=MENG_ERROR_SONG;const map=[0,1,2,3,3,3,3,4,5,6,6,6,7,8,9];q.index=map[Math.min(q.index, map.length-1)]??q.index;changed=true}if(changed)persist()}
migrateSongjiaDialogue();
function migrateMengErrorTimes(){const q=mengError();if(!q||q.phase==='skipped')return;let changed=false;for(const m of state.messages?.[HG_ID]||[])if(m.id?.startsWith('meng-error-')&&m.time==='09:06'){m.time='21:06';changed=true}const group=hgContact();if(group?.time==='09:06'){group.time='21:06';changed=true}const clue=state.story?.notebook?.clues?.find?.(item=>item.id==='wen-report-result');if(clue?.time==='09:06'){clue.time='21:06';changed=true}if(q.phase==='done'){const meng=state.contacts?.find(c=>c.id===POST_MENG_ID);if(meng&&meng.time!=='21:20'){meng.time='21:20';changed=true}}if(changed)persist()}
migrateMengErrorTimes();
function startSecondDayPickupAfterMorning(){
 if(state.game.day!==2||!state.story.secondMorningMainReady||['game-menu','nodes','zero-death'].includes(view))return;
 if(!state.story.dayTwoPickup){if(typeof d2StartMidday==='function'&&!d2Free().finished){d2StartMidday();return}state.system.time='16:00';pickup16Begin(true);}
 const pickup=state.story.dayTwoPickup;if(pickup?.received&&!pickup.failed&&pickup16GrantOrders(pickup)){persist();deliveryBadge()}
 for(const id of state.story.dayTwoPickup?.orderIds||[]){const order=deliveryOrders().find(item=>item.id===id);if(order)order.pickupCode='7431'}
}
const secondMorningPickupFinishBase=leakFinish;
leakFinish=function(result){const value=secondMorningPickupFinishBase(result);if(state.story.secondMorningMainReady)storyTimeout(startSecondDayPickupAfterMorning,250);return value};
setInterval(startSecondDayPickupAfterMorning,500);
function migrateSecondDayCounts(){
 if(!state.story.secondNightResult||state.story.dayTwoEvening?.departuresApplied)return;
 state.game.campusPopulation??={scope:'全校'};
 state.game.campusPopulation.alive=47;
 if(state.story.secondNightResult.groupApplied){hg().count=27;const contact=hgContact();if(contact)contact.status='群成员：27人'}
 persist();
}
migrateSecondDayCounts();
