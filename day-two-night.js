/* Post-vote continuation. The published vote is the single source of route selection. */
const D2_FOURTH_RULE_ID='chapter-four-midnight-rules';
const D2_FOURTH_RULE_BODY='新增两名校医志愿者，可在今晚10点前选择一位要保护的对象。只能保护除自己以外的人。\n\n1.今早9点将向所有在校普通学生发放《留校资格申请》，收到后必须在规定时间内完成作答。\n\n2.问卷不存在标准答案。请根据自身经历、能力与贡献，如实说明。\n\n3.问卷阶段结束后，将进入匿名评审。每名学生会随机收到两份匿名答卷，并对其“留校价值”进行评分。\n\n4.每份答卷将接受相同数量的匿名评审。系统将根据最终综合评分进行排名。\n\n5.综合评分最低者，将被取消留校资格。\n\n没有人有义务为一个毫无价值的人让出自己的位置。';
// Refresh the published wording when reading older saves, without changing progression.
const d2FourthPostBase=postDetail;postDetail=function(id,...args){if(id===D2_FOURTH_RULE_ID){const post=state.forumPosts.find(p=>p.id===id);if(post)post.body=D2_FOURTH_RULE_BODY}return d2FourthPostBase(id,...args)};
function d2Night(){return state.story.dayTwoNight}
function d2PurchaseRequired(){return state.game.day===2&&['transition','explore','purchase-required','bed'].includes(d2Night()?.phase)}
function d2PurchasePrompt(expired=false){
 if(!d2PurchaseRequired()||postHasTomorrowSupplies())return false;
 const n=d2Night();
 if(expired){n.phase='purchase-required';n.remaining=0;persist();zeroChrome();if(['day2-night-bed','day2-night-transition'].includes(view))home();postOpenPurchase()}
 sheet('睡前储备物资','<p>明天的物资需要提前订购。睡觉前，先购买至少一件食物或饮用水。</p><button class="primary" data-action="post-purchase-open">前往购买</button><button class="secondary" data-action="close">再看看</button>');return true;
}
const d2PurchasePromptBase=postPurchasePrompt;postPurchasePrompt=function(expired=false){return state.game.day===2?d2PurchasePrompt(expired):d2PurchasePromptBase(expired)};
function d2NightPaused(){return window.mobileLaunch||document.hidden||state.game.survivalEnding||['game-menu','nodes','zero-death'].includes(view)}
function d2NightGroupRead(){return view==='chat'&&active===HG_ID&&!hgContact()?.unread}
function d2NightWrite(row){
 const rows=state.messages[HG_ID]??=[];if(rows.some(m=>m.id===row.id))return;
 rows.push({...row,time:'21:20',gameDate:d2Night().date});const c=hgContact();
 if(c){c.preview=row.text;c.time='21:20';if(view!=='chat'||active!==HG_ID)c.unread=(c.unread||0)+1}
 persist();if(view==='chat'&&active===HG_ID)openChat(HG_ID);else hgNotice('group');
}
function d2NightOtherDorms(){const n=d2Night();if(!n?.extraRemoved||n.otherDormRemovalsApplied||!['jiang','yelin'].includes(n.target))return;n.otherDormRemovalsApplied=true;if(Number.isFinite(state.game.campusPopulation?.alive))state.game.campusPopulation.alive=Math.max(0,state.game.campusPopulation.alive-3);persist()}
function d2NightRemoveOthers(){
 const n=d2Night();if(n.extraRemoved||Date.now()<(n.due||0))return;state.game.departedNpcs??={};
 const remaining=[['xianing','夏宁','101'],['hanlu','韩露','506']].filter(([key])=>!(state.messages[HG_ID]||[]).some(m=>m.id==='day2-after-vote-remove-'+key));
 if(!remaining.length){n.extraRemoved=true;d2NightOtherDorms();n.phase='removals-read';n.due=Date.now()+messageSendDelay();persist();return}
 {const [key,name,room]=remaining[0];
  if(!state.game.departedNpcs[key]){
   state.game.departedNpcs[key]={date:n.date,cause:'day2-after-vote'};
   if(Number.isFinite(state.game.campusPopulation?.alive))state.game.campusPopulation.alive=Math.max(0,state.game.campusPopulation.alive-1);
   const group=hgContact();if(group){const members=group.members||[],person=FA_PEOPLE[key];let i=members.findIndex(id=>[key,person?.contact,person?.avatar,PORTRAIT_CHARACTERS[name]].includes(id));if(i<0)i=members.findLastIndex(id=>id.startsWith('stranger-'));if(i>=0)members.splice(i,1);hg().count=Math.max(0,hg().count-1);group.status='群成员：'+hg().count+'人'}
  }
  for(const c of state.contacts)if(c.id===key||c.name?.replace(/[（(].*$/,'')===name){c.status='已请离';c.online=false}
  for(const f of [state.story.freeAction,state.story.dayTwoFreeAction])for(const clue of f?.clues||[])if(clue.id==='members')clue.removedMembers=[...new Set([...(clue.removedMembers||[]),key])];
  d2NightWrite({id:'day2-after-vote-remove-'+key,type:'system',text:'沈可欣已将'+name+'（'+room+'）移出群聊'});
 }
 n.extraRemoved=remaining.length===1;d2NightOtherDorms();n.phase=n.extraRemoved?'removals-read':'warning-read';n.due=Date.now()+messageSendDelay();persist();
}
function d2NightTransition(){
 const n=d2Night(),previous=captureSceneSnapshot(screen);n.phase='transition';n.remaining=2000;
 state.system.time='22:00';state.game.period='晚上';closeSheet();
 document.querySelectorAll('#hg-notification,#report-notification,#day2-evening-notice').forEach(el=>el.remove());
 view='day2-night-transition';active=null;rememberRoute();zeroChrome();
 screen.innerHTML='<section class="fa-time-transition"><h2>时间来到22点</h2><p>该阶段你有60s可以进行购物和其他探索</p><p>明天的物资需要提前订购。睡觉前，先购买至少一件食物或饮用水。</p></section>';zeroDissolve(previous,600);persist();
}
function d2NightExplore(){const n=d2Night();n.phase='explore';n.remaining=60000;persist();home();syncEarlySleepButton();d2PurchasePrompt()}
function d2NightBed(){
 const n=d2Night();if(!n||d2PurchasePrompt(true))return;n.phase='bed';earlySleepButton.hidden=true;closeSheet();stopReading();clearInterval(cgTypingTimer);
 const previous=captureSceneSnapshot(screen);view='day2-night-bed';active=null;rememberRoute();zeroChrome();
 screen.innerHTML='<section class="ending-scene"><img src="'+DAY_ZERO_BEDROOM+'" alt="夜晚的宿舍"><div class="cg-options"><button class="ending-rest" data-action="day2-night-sleep">上床睡觉</button></div></section>';cgScreenCrossfade(previous);persist();
}
function d2NightBlack(){closeSheet();view='day2-midnight';active=null;rememberRoute();screen.innerHTML='<section class="ending-scene" style="background:#000"></section>';zeroChrome();persist()}
function d2YelinEndingReason(progress=state){
 const s=progress.story,q=s.mengshuLeakConfrontation,f=s.dayTwoFreeAction;
 // Only this timeline's morning choice and published clues distinguish 024 from 010.
 const stayedSilent=q?.kind==='death'&&q.decisions?.intro===2;
 const published=['d2publicZhou','d2publicYelin'].some(id=>f?.effects?.[id]||f?.completed?.includes(id));
 return s.secondNightResult?.target==='jiang'&&stayedSilent&&!published?'day2-yelin-no-clues':'day2-yelin-misled';
}
function d2NightSleep(){
 const n=d2Night();if(n?.phase!=='bed'||d2PurchasePrompt(true))return;
 dayTwoScheduleCouncilDeath(state.story.mengshuLeakConfrontation);const pending=state.story.dayTwoNightDeath;if(pending?.scheduled&&!pending.applied&&pending.reason==='public-council-accusation'){pending.applied=true;n.phase='failed';persist();beginLateDeath('day2-council-accusation');return}
 if(['jiang','yelin'].includes(n.target)){n.endingReason=n.target==='jiang'?'day2-jiang-unsupported':d2YelinEndingReason();n.phase='failed';persist();beginLateDeath(n.endingReason);return}
 n.phase='midnight-wait';n.remaining=1500;persist();d2NightBlack();
}
function d2FourthNotice(){
 if(document.querySelector('#day2-fourth-notice'))return;const el=document.createElement('div');el.id='day2-fourth-notice';el.className='opening-message';
 el.innerHTML='<button class="opening-body" data-action="day2-fourth-open"><span>'+avatar('chat_report_black')+'</span><span><small>讯息 · 00:00</small><strong>校园墙 · 转发帖子</strong><span>第四章规则已发布</span></span></button>';document.querySelector('#phone').append(el);playNotificationSound('message');
}
function d2FourthPublish(){
 const n=d2Night();if(n.rulesNotified)return;n.rulesNotified=true;n.phase='midnight-notice';
 state.system.date=deliveryDateNext(n.date);state.system.time='00:00';state.game.day=3;
 if(!state.forumPosts.some(p=>p.id===D2_FOURTH_RULE_ID))state.forumPosts.push({id:D2_FOURTH_RULE_ID,author:'campus-system',name:'',nightService:true,official:true,tag:'校园新规',category:'校园新规',title:'【校园新规 第四章】',body:D2_FOURTH_RULE_BODY,date:state.system.date,time:'00:00',likes:0,replies:[]});
 const rows=state.messages[DAY_ONE_REPORT_ID]??=[];if(!rows.some(m=>m.id===D2_FOURTH_RULE_ID))rows.push({id:D2_FOURTH_RULE_ID,type:'text',sender:'chat_report_black',name:'',text:'校园墙 · 转发帖子：第四章规则已发布',time:'00:00',gameDate:state.system.date});
 const c=reportContact();if(c){c.preview='第四章规则已发布';c.time='00:00';c.unread=(c.unread||0)+1}persist();d2FourthNotice();status();
}
actions['day2-fourth-open']=()=>{const n=d2Night();if(!n||!['midnight-notice','midnight-reading'].includes(n.phase))return;document.querySelector('#day2-fourth-notice')?.remove();n.phase='midnight-reading';if(reportContact())reportContact().unread=0;postDetail(D2_FOURTH_RULE_ID);persist()};
actions['day2-night-sleep']=d2NightSleep;
const d2NightEarlyBase=earlySleepAvailable;earlySleepAvailable=function(){return ['explore','purchase-required'].includes(d2Night()?.phase)?!d2NightPaused()&&(d2Night().phase==='purchase-required'||d2Night().remaining>0):d2NightEarlyBase()};
const d2NightEarlyConfirmBase=actions['post-early-sleep-confirm'];actions['post-early-sleep-confirm']=()=>{if(['explore','purchase-required'].includes(d2Night()?.phase)){if(!earlySleepAvailable())return;d2NightBed()}else d2NightEarlyConfirmBase()};
const d2NightReturnBase=reportReturnHome;reportReturnHome=function(...args){const result=d2NightReturnBase(...args);if(result&&state.story.dayTwoReport?.groupResult?.target==='mengshu'){document.querySelector('#hg-notification')?.remove();hg().banner=null}return result};
function d2NightStart(){
 const r=state.story.dayTwoReport;if(d2Night()||!r?.publicationComplete||!r.homeReturned||state.game.survivalEnding)return;
 const target=r.groupResult?.target;if(!['jiang','yelin','mengshu'].includes(target))return;
 state.story.dayTwoNight={date:r.date,target,phase:'group-wait',remaining:0};persist();
 if(target==='mengshu')d2NightTransition();else if(!d2NightGroupRead())hgNotice('group');
}
let d2NightLastTick=0,d2NightLastSave=0;
function d2NightTick(){
 const now=Date.now();if(d2NightPaused()){d2NightLastTick=0;return}const elapsed=d2NightLastTick?Math.max(0,now-d2NightLastTick):0;d2NightLastTick=now;
 if(!d2Night())return d2NightStart();const n=d2Night();
 if(n.phase==='group-wait'&&d2NightGroupRead()){
  state.system.time='21:20';n.phase='warning-read';n.due=now+messageSendDelay();
  d2NightWrite({id:'day2-after-vote-hanlu',type:'text',sender:dayTwoPerson('hanlu').avatar,name:'韩露（506）',text:'？？？什么情况，我们被骗了',status:'read'});status();return;
 }
 if(n.phase==='warning-read'&&now>=n.due&&d2NightGroupRead())return d2NightRemoveOthers();
 if(n.phase==='removals-read'&&now>=n.due&&d2NightGroupRead())return d2NightTransition();
 if(['transition','explore','midnight-wait'].includes(n.phase)){
  n.remaining=Math.max(0,n.remaining-elapsed);if(now-d2NightLastSave>=1000){d2NightLastSave=now;persist()}
  if(!n.remaining){if(n.phase==='transition')d2NightExplore();else if(n.phase==='explore')d2NightBed();else d2FourthPublish()}
 }
}
function d2NormalizeRemovalMessages(){
 let changed=false;const names={'day2-after-vote-remove-xianing':'夏宁（101）','day2-after-vote-remove-hanlu':'韩露（506）','day2-evening-removal-liangyin':'梁音（603）','day2-evening-removal-linxia':'林夏（116）','day2-evening-removal-qiyue':'戚悦（508）'},rows=state.messages[HG_ID]||[];
 for(const m of rows){if(!names[m.id])continue;const text='沈可欣已将'+names[m.id]+'移出群聊';if(m.text!==text){m.text=text;changed=true}}
 const group=hgContact(),last=rows.at(-1);if(group&&names[last?.id]&&group.preview!==last.text){group.preview=last.text;changed=true}if(changed)persist();
}
function d2HanluHasLeft(){
 return !!state.game.departedNpcs?.hanlu||(state.messages[HG_ID]||[]).some(m=>m.id==='day2-after-vote-remove-hanlu');
}
const d2DepartedRenderBase=renderMessage;renderMessage=function(m,c){
 let html=d2DepartedRenderBase(m,c);
 const isHanlu=m.id==='day2-after-vote-hanlu'||m.hgWho==='hanlu'||m.name?.replace(/[（(].*$/,'').trim()==='韩露'||m.sender==='hanlu'||m.sender==='chat_hanlu_v1';
 if(c.id===HG_ID&&m.sender!=='me'&&isHanlu&&d2HanluHasLeft()&&!html.includes('zero-left-status'))html=html.replace(/(<div class="sender-name">[^<]*)(<\/div>)/,'$1<small class="zero-left-status">已离校</small>$2');
 return html;
};
function d2RefreshDepartureLabels(){
 if(view!=='chat'||active!==HG_ID)return;
 const list=screen.querySelector('#messages'),contact=hgContact();if(!list||!contact)return;
 const top=list.scrollTop,atBottom=list.scrollHeight-list.clientHeight-top<=2;
 list.innerHTML=(state.messages[HG_ID]||[]).map(m=>renderMessage(m,contact)).join('');
 list.scrollTop=atBottom?list.scrollHeight:top;
}
function d2NightRestore(){
 d2NightOtherDorms();d2NormalizeRemovalMessages();d2RefreshDepartureLabels();
 d2NightLastTick=0;if(d2NightPaused())return;const n=d2Night();if(!n)return;
 if(n.phase==='bed')d2NightBed();else if(n.phase==='transition'){const remaining=n.remaining;d2NightTransition();n.remaining=remaining;persist()}else if(n.phase==='midnight-wait')d2NightBlack();else if(n.phase==='midnight-notice')d2FourthNotice();syncEarlySleepButton();
}
const d2NightResumeBase=resumeStoryScene;resumeStoryScene=function(...args){const result=d2NightResumeBase(...args);d2NightRestore();return result};
const d2NightCleanupBase=cleanupSceneResume;cleanupSceneResume=function(...args){d2NightLastTick=0;document.querySelector('#day2-fourth-notice')?.remove();return d2NightCleanupBase(...args)};
document.addEventListener('visibilitychange',()=>{d2NightLastTick=0;if(d2Night())persist()});
setInterval(d2NightTick,200);d2NightRestore();
