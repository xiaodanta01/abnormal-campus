/* Local girls' dormitory group continuation. */
const HG_ID='girls2-help';
const HG_PEOPLE={shen:{name:'沈可欣（512）',avatar:'shen'},zhao:{name:'赵诗雨（214）',avatar:'student1'},su:{name:'苏沐（214）',avatar:'student3'},xu:{name:'许知夏（417）',avatar:'student5'},qin:{name:'秦琦（417）',avatar:'student7'}};
const HG_CHOICES=['看来被请离的人会消失，但仍然可以发送信息','不要理会这个申请，谁知道同意了会有什么后果'];
const HG_INTRO=[
 ['21:18','shen','现在还没失踪的应该都进群了'],
 ['21:18','shen','如果后面群里有人显示被请离，我会把她移出群聊'],
 ['21:18','shen','大家如果有什么消息，最好都在群里说一下'],
 ['21:19','zhao','所以我们现在就34人还在楼里？'],
 ['21:19','shen','目前看来是这样'],
 ['21:20','su','真是要疯了，这都是啥啊']
];
const HG_EVENT=[
 ['21:22','xu','我刚刚回复了显示已离校的室友'],
 ['21:22','xu','她只是问我在不在宿舍，应该没事吧？'],
 ['21:22','system','沈可欣已将许知夏（417）移出群聊。','remove'],
 ['21:22','shen','','capture'],
 ['21:22','qin','疯了，她刚刚直接就在我面前消失了'],
 ['21:22','qin','人不见了怎么给你发的申请？']
];
function hg(){return state.story.helpGroup??={joined:false,phase:'idle',step:0,due:0,accepted:false,xuLeft:false,count:34,choice:null,banner:null}}
function hgContact(ensure=false){
 state.contacts=SaveSchema.array(state.contacts);
 const members=()=>['me','linqing','shen','zhao','su',...(hg().xuLeft?[]:['xu']),'qin',...Array.from({length:27},(_,i)=>'stranger-'+i)];
 let contact=state.contacts.find(c=>c.id===HG_ID);
 if(!contact&&(ensure||hg().joined)){contact={id:HG_ID,name:'女生B栋临时互助群',avatar:'chat_help_group',status:'群成员：'+hg().count+'人',time:'21:18',preview:'',unread:0,members:members()};state.contacts.push(contact)}
 if(contact&&!Array.isArray(contact.members))contact.members=SaveSchema.array(contact.members,members());
 return contact;
}
function hgNotice(kind){hg().banner=kind;persist();document.querySelector('#hg-notification')?.remove();if(!kind)return;document.querySelector('#zero-notification')?.remove();const el=document.createElement('div');el.id='hg-notification';el.className='opening-message';el.innerHTML=`<button class="opening-body" data-action="hg-notice"><span class="zero-notice-icon">${icon('chat')}</span><span><small>讯息 · 现在</small><strong>${kind==='friend'?'好友申请':'女生B栋临时互助群'}</strong><span>${kind==='friend'?'沈可欣请求添加你为好友':esc(hgContact()?.preview||'你收到一条群消息')}</span></span></button><button class="opening-close" data-action="hg-dismiss" aria-label="关闭消息通知">×</button>`;document.querySelector('#phone').append(el)}
function hgRefresh(){const c=hgContact();if(!c)return;c.status='群成员：'+hg().count+'人';persist();if(view==='chat'&&active===HG_ID)openChat(HG_ID);else if(view==='messages')chatList();status()}
function hgAdd(row,id){const [time,who,text,type]=row;const messages=SaveSchema.chat(state,HG_ID);hgContact(true);if(messages.some(m=>m.id===id))return;zeroClock(time);if(messages.at(-1)?.time!==time)messages.push({id:id+'-time',type:'time',text:time,time});messages.push({id,time,sender:who==='system'?undefined:HG_PEOPLE[who]?.avatar||who,hgWho:who,name:HG_PEOPLE[who]?.name,text,type:who==='system'?'system':type==='capture'?'hg-capture':'text',...(who==='me'?{status:'read'}:{})});const c=hgContact();c.time=time;c.preview=(HG_PEOPLE[who]?HG_PEOPLE[who].name+'：':'')+(type==='capture'?'[图片]':text);const waiting=!(view==='chat'&&active===HG_ID);if(waiting)c.unread++;hgRefresh();if(waiting&&who!=='system'&&who!=='me'){hg().waitingForRead=!hg().readStarted;if(!hg().readStarted)hgNotice('group')}}
function hgJoin(){if(hg().joined){openChat(HG_ID);return}Object.assign(hg(),{joined:true,phase:'intro',step:0,due:Date.now()+messageSendDelay()});state.contacts.unshift({id:HG_ID,name:'女生B栋临时互助群',avatar:'chat_help_group',status:'群成员：34人',time:'21:18',preview:'住宿信息验证通过',unread:0,members:['me','linqing','shen','zhao','su','xu','qin',...Array.from({length:27},(_,i)=>'stranger-'+i)]});state.messages[HG_ID]=[];hgAdd(['21:18','system','住宿信息验证通过'],'hg-verified');hgAdd(['21:18','system','你已加入“女生B栋临时互助群”'],'hg-joined');openChat(HG_ID);persist()}
function hgFriendPage(){if(!hg().joined||!['friend','event','choice','closing','done'].includes(hg().phase))return;closeSheet();hgNotice(null);view='hg-friend';active=null;rememberRoute();screen.innerHTML=`<section class="app-page">${head('好友申请')}<div class="panel"><div class="profile-row">${avatar('shen')}<div><h2>沈可欣</h2><p class="subtle">来自女生B栋临时互助群</p></div></div>${hg().accepted?'<p class="subtle">已添加为联系人</p>':'<button class="primary" data-action="hg-accept">同意</button>'}</div></section>`}
function hgAccept(){if(hg().phase!=='friend'||hg().accepted)return;hg().accepted=true;hg().readStarted=false;state.contacts.push({id:'shen-friend',name:'沈可欣',avatar:'shen',online:true,status:'在线',time:'21:21',preview:'你们已成为联系人',unread:0});state.messages['shen-friend']=[{id:'hg-friend-added',type:'system',text:'你们已成为联系人'},{id:'hg-friend-avatar-tip',type:'system',text:'作者温馨提醒：点击头像可查看朋友圈'}];Object.assign(hg(),{phase:'event',step:0,due:Date.now()+messageSendDelay()});persist();hgFriendPage()}
function hgCapture(){return `<div class="aw-capture"><small>群聊申请</small><div>${avatar('student5')}<span><strong>许知夏（417）</strong><small class="zero-left-status">已离校</small></span></div><p>申请理由：为什么把我踢出去？</p></div>`}
const hgBase={openChat,renderMessage,sendMessage,chatList};
renderMessage=function(m,c){if(c.id!==HG_ID)return hgBase.renderMessage(m,c);if(m.type==='hg-capture')return `<div class="message">${avatar('shen')}<div class="message-main"><div class="sender-name">沈可欣</div><div class="bubble">${hgCapture()}</div><div class="message-meta">${esc(m.time)}</div></div></div>`;let rendered=hgBase.renderMessage(m,c);if(m.hgWho==='xu'&&hg().xuLeft)rendered=rendered.replace('<div class="sender-name">'+esc(m.name)+'</div>','<div class="sender-name">'+esc(m.name)+'<small class="zero-left-status">已离校</small></div>');return rendered};
openChat=function(id){hgBase.openChat(id);if(view!=='chat'||active!==HG_ID)return;hg().readStarted=true;persist();if(hg().waitingForRead){hg().waitingForRead=false;hg().due=Date.now()+(hg().phase==='event'&&hg().step===HG_EVENT.length?storyChoiceDelay():hg().phase==='event'&&[2,3].includes(hg().step)?messageSendDelay():messageSendDelay());persist()}if(hg().banner==='group')hgNotice(null);if(hg().phase==='done')return;const input=document.querySelector('#message-input');input.disabled=true;input.placeholder=hg().phase==='choice'?'选择一条回复…':'查看群消息…';document.querySelectorAll('#composer button').forEach(b=>b.disabled=true);if(hg().phase==='choice')document.querySelector('#composer').insertAdjacentHTML('beforebegin',`<div class="zero-choices">${HG_CHOICES.map((t,i)=>`<button data-hg-choice="${i}">${esc(t)}</button>`).join('')}</div>`);scrollMessages()};
sendMessage=function(id,text){if(id===HG_ID&&hg().phase!=='done')return false;return hgBase.sendMessage(id,text)};
chatList=function(){hgBase.chatList();if(view==='messages'&&hg().phase==='friend'&&!hg().accepted)document.querySelector('.page-head')?.insertAdjacentHTML('afterend','<button class="setting-row" data-action="hg-friend">新的好友申请<span>沈可欣 ›</span></button>')};
const hgMemberOptions=actions['chat-options'];
actions['chat-options']=()=>{if(active!==HG_ID)return hgMemberOptions();sheet('群聊成员',`<p>群成员：${hg().count}人</p><div style="max-height:50dvh;overflow:auto">${hgContact().members.map(id=>{const p=HG_PEOPLE[id];const name=id==='me'?state.profile.name:id==='linqing'?'林晴':p?.name||'群成员';const known=id==='me'||id==='linqing'||id==='shen'&&hg().accepted;return `<div class="setting-row"><span>${avatar(id==='me'||id==='linqing'?id:p?.avatar||'student0')} ${esc(name)}</span><small>${known?(id==='me'?'你':'联系人'):''}</small></div>`}).join('')}</div>`)};
function hgChoose(i){if(hg().phase!=='choice'||![0,1].includes(i))return;hg().choice=i;state.game.otherTrust??=0;if(i===0)state.game.otherTrust+=10;Object.assign(hg(),{phase:'closing',step:0,due:Date.now()+messageSendDelay()});hgAdd(['21:22','me',HG_CHOICES[i]],'hg-choice');persist()}
function hgTick(){const a=hg();if(!a.joined||a.waitingForRead||document.hidden||['game-menu','nodes'].includes(view)||(window.ReadHistory?ReadHistory.waiting('hg',a):Date.now()<a.due))return;
 if(a.phase==='intro'){
  if(a.step<HG_INTRO.length){const i=a.step++;a.due=Date.now()+messageSendDelay();hgAdd(HG_INTRO[i],'hg-intro-'+i)}else{a.phase='friend';zeroClock('21:21');hgNotice('friend');hgRefresh()}
 }else if(a.phase==='event'){
  if(a.step<HG_EVENT.length){const i=a.step++;a.due=Date.now()+(i===HG_EVENT.length-1?storyChoiceDelay():(i===1||i===2)?messageSendDelay():messageSendDelay());if(i===2){a.xuLeft=true;a.count=33;hgContact().members=hgContact().members.filter(id=>id!=='xu')}hgAdd(HG_EVENT[i],'hg-event-'+i);if(!(view==='chat'&&active===HG_ID)&&!a.readStarted)hgNotice('group')}
  else{a.phase='choice';state.game.otherTrust??=0;hgRefresh()}
 }else if(a.phase==='closing'){
  if(a.step===0){a.step++;a.due=Date.now()+messageSendDelay();hgAdd(a.choice===0?['21:25','shen','没错，但我们不能回复他们，只能看他们发的消息']:['21:25','qin','当然不会同意啊……'],'hg-answer')}
  else{a.phase='done';hgAdd(['21:25','shen','大家要洗澡打水的快去吧，22点之后不要在屋外逗留了。'],'hg-end')}
 }else return;persist()
}
Object.assign(actions,{'hg-dismiss':()=>hgNotice(null),'hg-notice':()=>hg().banner==='friend'?hgFriendPage():openChat(HG_ID),'hg-friend':hgFriendPage,'hg-accept':hgAccept});
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.awApply){const id=b.closest('[data-after-post]')?.dataset.afterPost;if(!hg().joined&&!awState().coreReturned)return;if(id==='aw-girls1'&&typeof d4AReady==='function'&&d4AReady())d4AJoin();else if(id==='aw-girls2')hgJoin();else toast('申请未通过，你不是该宿舍楼的学生。')}if(b.dataset.hgChoice!==undefined)hgChoose(Number(b.dataset.hgChoice))});
// Migrate the existing invitation and recruitment preview without resetting progress.
for(const list of Object.values(state.messages))for(const m of list)if(m.text)m.text=m.text.replaceAll('封七天','封四天').replaceAll('封闭七日','封闭四日');
for(const c of state.contacts)if(c.preview)c.preview=c.preview.replaceAll('封七天','封四天');
const hgRecruit=state.forumPosts.find(p=>p.id==='aw-girls2');if(hgRecruit)hgRecruit.preview='34名成员\n1名联系人已加入：林晴';
AW.recruitment.find(p=>p.id==='girls2').preview='34名成员\n1名联系人已加入：林晴';
for(const p of awState().pendingPosts||[])if(p.id==='girls2')p.preview='34名成员\n1名联系人已加入：林晴';
persist();setInterval(hgTick,250);
if(hg().banner)hgNotice(hg().banner);
for(const m of state.messages['shen-friend']||[])if(m.id==='hg-friend-avatar-tip')m.text='点击对话头像可以查看朋友圈';
const hgAcceptCurrent=hgAccept;
hgAccept=function(){hgAcceptCurrent();const m=(state.messages['shen-friend']||[]).find(x=>x.id==='hg-friend-avatar-tip');if(m)m.text='点击对话头像可以查看朋友圈';persist()};
actions['hg-accept']=hgAccept;

const hgInitialize=initializeChapter;
initializeChapter=function(...args){document.querySelector('#hg-notification')?.remove();return hgInitialize(...args)};

// Every reached story choice shares the existing retry timeline.
const STORY_CHOICES=[{id:Z.node,title:'陈妍邀请前往超市',chat:'room408'},{id:'day0-linqing-reply',title:'回复林晴的提醒',chat:'linqing'},{id:'day0-xuzhixia-reply',title:'回应许知夏的入群申请',chat:HG_ID}];
function earlyChoiceSnapshotValid(id,checkpoint){
 if(!['day0-linqing-reply','day0-xuzhixia-reply'].includes(id))return true;
 const story=checkpoint?.story;
 if(!story||checkpoint.system?.date!=='2045-09-07'||checkpoint.game?.day!==0||story.firstMorningReady||story.nightServices?.life)return false;
 if(id==='day0-linqing-reply')return story.afterWall?.choice===null&&!story.helpGroup?.joined;
 return story.helpGroup?.phase==='choice'&&story.helpGroup.choice===null&&!(checkpoint.messages?.[HG_ID]||[]).some(m=>/^hg-(choice|answer|end)(-time)?$/.test(m.id));
}
function allowStoryChoiceRestore(id,checkpoint){
 if(earlyChoiceSnapshotValid(id,checkpoint))return true;
 sheet('这个旧节点记录异常','<p>旧版本把后续进度混入了这个节点，无法准确恢复当时的状态。</p><p>请关闭此提示，从前一个正常节点重新推进；再次到达这里时会自动保存正确记录。当前进度和结局收藏不会被删除。</p>');
 return false;
}
function recordStoryChoice(id,checkpoint=state){return captureStoryNode(id,checkpoint)}
const retryAwChoices=awChoices;
awChoices=function(){if(awReady()&&awState().choice===null&&view==='chat'&&active==='linqing')recordStoryChoice('day0-linqing-reply');return retryAwChoices()};
const retryHgOpen=openChat;
openChat=function(id){const result=retryHgOpen(id);if(view==='chat'&&active===HG_ID&&hg().phase==='choice')recordStoryChoice('day0-xuzhixia-reply');return result};
zeroNodes=function(){if(view!=='game-menu'&&view!=='nodes')return;view='nodes';rememberRoute();const records=nodeRecords();screen.innerHTML=`<section class="app-page zero-nodes"><header class="page-head"><button class="icon-button" data-action="zero-menu" aria-label="返回主页">${icon('back')}</button><h1>再一次抉择</h1></header><p>那些已经走到过的路口。</p><div class="zero-timeline">${STORY_CHOICES.map(n=>`<button class="zero-node ${records[n.id]?'visited':''}" ${records[n.id]?`data-retry-choice="${n.id}"`:'disabled aria-label="尚未经历的节点"'}><i></i>${records[n.id]?`<small>${esc(n.day||'第零日')}</small><strong>${esc(n.title)}</strong>`:'<strong>？</strong>'}</button>`).join('')}<button class="zero-node" disabled aria-label="尚未经历的节点"><i></i><strong>？</strong></button></div><button class="secondary retry-home" data-action="zero-menu">返回游戏主页</button></section>`};
actions['zero-nodes']=zeroNodes;
function retryStoryChoice(id){if(view==='nodes')return loadStoryNode(id)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-retry-choice]');if(b)retryStoryChoice(b.dataset.retryChoice)});
// Capture only an actually pending choice, never reconstruct history from later progress.
if(state.story.afterWall?.choice===null&&awReady())recordStoryChoice('day0-linqing-reply');
if(state.story.helpGroup?.phase==='choice')recordStoryChoice('day0-xuzhixia-reply');

// Read the rules, then notify the dormitory group after three seconds.
let rulesDormNoticeTimer=null;
function scheduleRulesDormNotice(){
 if(!state.story.started||z().invitationTriggered||z().branch||rulesDormNoticeTimer)return;
 const currentStory=state.story;
 rulesDormNoticeTimer=storyTimeout(()=>{
  rulesDormNoticeTimer=null;
  if(state.story!==currentStory||z().branch||['game-menu','nodes'].includes(view))return;
  zeroTriggerInvitation();
 },3000);
}
const readRulesWithDormNotice=readRules;
readRules=function(reason){readRulesWithDormNotice(reason);if(reason==='expand'||reason==='comments')scheduleRulesDormNotice()};
if(state.story.read&&['expand','comments'].includes(state.story.readReason))scheduleRulesDormNotice();

const unreadBadgeStatus=status;status=function(...args){const result=unreadBadgeStatus(...args),count=totalUnread();document.querySelectorAll('[data-app="messages"] .app-icon').forEach(el=>{let badge=el.querySelector('.badge');if(!count){badge?.remove();return}if(!badge){badge=document.createElement('b');badge.className='badge';el.append(badge)}badge.textContent=count});return result};
