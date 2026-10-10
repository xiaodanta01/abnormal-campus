/* Day zero: a resumable, idempotent local scene machine; no backend. */
const Z=window.DAY_ZERO;

const zeroBase={home,chatList,openChat,openApp,forum,rulesPage,postDetail,renderMessage,sendMessage,settings,initializeChapter};
const NODE_KEY=STORAGE_KEY+'-choice-nodes';
let zeroTimer=null,zeroInternal=false;
function zeroState(){return {phase:'idle',branch:null,invitationTriggered:false,choice:null,enteredCG:false,suppliesDone:false,queueEntered:false,rulesActive:false,playerLeft:false,chenyanLeft:false,nodeUnlocked:false,selected:[],notices:[],banner:null,script:null,step:0,due:null}}
function z(){return state.story.zero??=zeroState()}
function nodeRecords(){const records=ChoiceNodeStorage.read(NODE_KEY,toast);if(Object.values(records).some(r=>r?.checkpoint?.story&&r.snapshotVersion!==STORY_SNAPSHOT_VERSION)){normalizeStoryNodeRecords(records);ChoiceNodeStorage.write(NODE_KEY,records,toast)}return records}
function saveNodes(records){return ChoiceNodeStorage.write(NODE_KEY,normalizeStoryNodeRecords(records),toast)}
function zeroText(text){return text.replaceAll('{name}',state.profile?.name||'同学')}
function zeroClock(time){state.system.time=time;updateCampusCondition();status();persist()}
function updateCampusCondition(){if(state.system.time>='21:00'||z().rulesActive)state.story.campusAbnormal=true;if(!state.story.campusAbnormal)return;const markup='<span class="campus-condition campus-condition-abnormal"><i class="live-dot"></i>校园运行异常</span>';const widget=document.querySelector('.campus-widget');if(widget){widget.classList.add('campus-abnormal');widget.querySelector('strong').innerHTML=markup;widget.querySelector('small').textContent='请勿离开宿舍楼'}const row=document.querySelector('[data-campus-condition]');if(row)row.innerHTML=markup}
function zeroWallNotice(kind){return kind==='departure'?{...Z.notices[kind],text:'【离校公示】\n'+(state.story.afterWall?.departures??1327)+'位学生已完成离校手续。'}:Z.notices[kind]}
function zeroLock(){const owner=storyEndingOwner();if(owner&&owner!=='zero')return false;return !['game-menu','nodes'].includes(view)&&['accept','cg','supplies','queue','minute','profile','departing','dead','pickup-code-death'].includes(z().phase)}
function zeroChrome(){document.querySelector('#phone').classList.toggle('zero-immersive',zeroLock()||['game-menu','nodes'].includes(view))}
function zeroCall(fn,...args){const before=zeroInternal;zeroInternal=true;try{return fn(...args)}finally{zeroInternal=before}}
function zeroSchedule(ms,fn){clearTimeout(zeroTimer);z().due=Date.now()+ms;persist();zeroTimer=storyTimeout(()=>{z().due=null;fn()},ms)}
function zeroPhase(phase){clearTimeout(zeroTimer);Object.assign(z(),{phase,due:null});enterStoryEnding();persist();zeroChrome()}
function zeroBanner(kind){
  z().banner=kind;persist();document.querySelector('#opening-message')?.remove();
  document.querySelector('#zero-notification')?.remove();if(!kind)return;
  const n=kind==='invitation'?{title:'408宿舍（4）',text:'陈妍：要不要一起去超市买点东西？'}:kind==='warning'?{title:'林晴',text:'你先别回复她'}:kind==='where'?{title:'林晴',text:zeroText('{name}，你在哪？')}:zeroWallNotice(kind);
  const el=document.createElement('div');el.id='zero-notification';el.className='opening-message';el.setAttribute('role','status');
  el.innerHTML=`<button class="opening-body" data-action="zero-notice"><span class="zero-notice-icon">${icon(n.title==='校园通'?'user':n.title==='校园墙'?'wall':'chat')}</span><span><small>${n.title==='校园墙'||n.title==='校园通'?'校园通知':'讯息'} · 现在</small><strong>${esc(n.title)}</strong><span>${esc(n.text)}</span></span></button>${zeroLock()?'':'<button class="opening-close" data-action="zero-dismiss" aria-label="关闭消息通知">×</button>'}`;
  document.querySelector('#phone').append(el);
}
function zeroNotice(kind){if(!z().notices.includes(kind))z().notices.push(kind);if(kind==='effective')z().rulesActive=true;if(kind==='departure')z().chenyanLeft=true;zeroBanner(kind);persist()}
function zeroAdd(script,index,row,chat='room408'){
  const [time,sender,text,type]=row;zeroClock(time);
  if(sender==='notice'){zeroNotice(text);return}
  const messages=state.messages[chat]??=[];const id=`zero-${script}-${index}`;if(messages.some(m=>m.id===id))return;
  if(messages.at(-1)?.time!==time)messages.push({id:id+'-time',type:'time',text:time,time});
  const names={chenyue:'陈妍',linqing:'林晴',me:state.profile.name};
  messages.push({id,sender:sender==='system'?undefined:sender,name:names[sender],time,text:zeroText(text),type:sender==='system'?'system':type==='photo'?'image':'text',...(type==='photo'?{asset:'shelves'}:{}),...(sender==='me'?{status:'read'}:{})});
  const c=state.contacts.find(c=>c.id===chat);c.time=time;c.preview=(names[sender]?names[sender]+'：':'')+zeroText(text);if(!(view==='chat'&&active===chat))c.unread=(c.unread||0)+1;
  persist();if(view==='chat'&&active===chat)zeroCall(openChat,chat);else if(view==='messages')zeroCall(chatList);else if(view==='home')zeroCall(home);status();
}
function zeroBeginScript(name){if(name==='warning')z().warningReadStarted=false;zeroPhase(name);z().script=name;z().step=0;persist();zeroStep()}
function zeroStep(){
  const name=z().script,rows=Z.scripts[name];if(!rows)return;if(name==='warning'&&z().step>0&&!z().warningReadStarted&&!(view==='chat'&&active==='linqing')){z().waitingForChat='linqing';persist();return}
  if(z().step>=rows.length){
    z().script=null;
    if(name==='invitation'){zeroPhase('choice');zeroUnlockNode();if(view==='chat'&&active==='room408')zeroCall(openChat,'room408')}
    if(name==='accept'){z().enteredCG=true;zeroPhase('cg');zeroScene()}
    if(name==='refuse'){zeroBanner('warning');zeroBeginScript('warning')}
    if(name==='warning'){zeroPhase('finished');if(view==='chat')zeroCall(openChat,active)}
    return;
  }
  const next=rows[z().step],chat=name==='warning'?'linqing':'room408';if(next?.[1]==='me'&&storyReplyGate(chat,zeroText(next[2]),'zero:'+name+':'+z().step,'zeroStep'))return;
  const i=z().step++;zeroAdd(name,i,rows[i],name==='warning'?'linqing':'room408');persist();
  // Keep each beat readable; all pacing is configured in DAY_ZERO.timing.
  const delay=i===rows.length-1&&['invitation','warning'].includes(name)?storyChoiceDelay():rows[i][1]==='notice'?Z.timing.notice:name==='refuse'&&i===3?Z.timing.photo:i===rows.length-1?Z.timing.scene:rows[i][2].length>23?messageSendDelay():messageSendDelay();
  zeroSchedule(delay,zeroStep);
}
function zeroTriggerInvitation(){
  if(!state.story.started||!state.story.read||z().invitationTriggered||zeroInternal||['game-menu','nodes'].includes(view))return;
  z().invitationTriggered=true;zeroPhase('invited');
  const c=state.contacts.find(c=>c.id==='room408');c.unread=1;c.time='20:45';c.preview='陈妍：要不要一起去超市买点东西？';
  zeroBanner('invitation');status();persist();
  if(view==='messages')zeroCall(chatList);else if(view==='home')zeroCall(home);
}
function zeroExit(old){/* The initial invitation is scheduled by reading the rules. */}
function zeroUnlockNode(){z().nodeUnlocked=true;persist();captureStoryNode(Z.node,state,{route:{view:'chat',active:'room408'}})}
function zeroChoices(){return `<div class="zero-choices" aria-label="剧情回复"><button data-action="zero-accept">${Z.choices[0]}</button><button data-action="zero-refuse">${Z.choices[1]}</button></div>`}
function zeroChoose(which){if(z().phase!=='choice')return;if(Z.scripts[which]?.[0]?.[1]==='me')confirmStoryReply('zero:'+which+':0');z().choice=which;z().branch=which==='accept'?'supermarket':'dormitory';zeroBanner(null);zeroBeginScript(which)}
function zeroScene(){
  const previous=captureSceneSnapshot(screen),oldKey=screen.dataset.scene;previous.messageScroll=screen.querySelector('.messages')?.scrollTop||0;
  const sceneKey=z().phase==='queue'?'queue':'shelves',crossfade=view!=='zero-scene'||oldKey!==sceneKey;
  stopReading();closeSheet();view='zero-scene';active=null;zeroChrome();rememberRoute();
  const p=z().phase,supply=p==='supplies',queue=p==='queue';
  screen.innerHTML=`<section class="zero-scene ${supply?'choosing':''}"><img class="zero-cg" src="${Z.cg[queue?'queue':'shelves']}" alt="${queue?'校园超市收银台排队':'校园超市货架'}"><span class="zero-clock">${esc(state.system.time)}</span>${supply?`<div class="zero-supply-panel"><small>校园超市</small><h2>买点什么？</h2><div class="zero-supplies">${Z.supplies.map((s,i)=>`<button data-supply-choice="${i}" aria-pressed="${z().selected.includes(s)}">${esc(s)}<span>${z().selected.includes(s)?'✓':'＋'}</span></button>`).join('')}</div><button class="primary" data-action="zero-queue">选好了</button></div>`:queue&&!z().notices.includes('minute')?'<div class="zero-queue-popup"><p>当前排队人数较多</p><strong>预计等待时间：10分钟</strong></div>':''}</section>`;
  screen.dataset.scene=sceneKey;if(crossfade)zeroDissolve(previous);
}
// DOM cloning omits scroll offsets. Capture them before replacing the live scene.
function captureSceneSnapshot(source=screen){
 const copy=source.cloneNode(true),originals=[source,...source.querySelectorAll('*')],clones=[copy,...copy.querySelectorAll('*')];
 copy.sceneScroll=originals.flatMap((el,i)=>el.scrollTop||el.scrollLeft||el.scrollHeight>el.clientHeight||el.scrollWidth>el.clientWidth||el.matches('.messages')?[{el:clones[i],top:el.scrollTop,left:el.scrollLeft,bottom:el.matches('.messages')&&el.scrollHeight-el.clientHeight-el.scrollTop<=2}]:[]);
 copy.sceneBounds={top:source.offsetTop,left:source.offsetLeft,width:source.clientWidth,height:source.clientHeight};
 const css=getComputedStyle(source);for(const key of ['display','flexDirection','boxSizing','overflowX','overflowY','paddingTop','paddingRight','paddingBottom','paddingLeft','color'])copy.style[key]=css[key];
 return copy;
}
function restoreSceneSnapshotScroll(copy){
 if(copy.sceneScroll){for(const row of copy.sceneScroll){row.el.scrollTop=row.bottom?row.el.scrollHeight:row.top;row.el.scrollLeft=row.left}return}
 const messages=copy.querySelector('.messages');if(messages)messages.scrollTop=copy.messageScroll??messages.scrollHeight;
}
function zeroDissolve(previous,duration=600){
  document.querySelector('.zero-transition')?.remove();previous.removeAttribute('id');previous.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));previous.className='zero-transition';previous.style.animationDuration=duration+'ms';previous.inert=true;previous.setAttribute('aria-hidden','true');const bounds=previous.sceneBounds||{top:screen.offsetTop,left:screen.offsetLeft,width:screen.clientWidth,height:screen.clientHeight};Object.assign(previous.style,{top:bounds.top+'px',left:bounds.left+'px',width:bounds.width+'px',height:bounds.height+'px'});document.querySelector('#phone').append(previous);restoreSceneSnapshotScroll(previous);const scene=screen.querySelector('.zero-scene');if(scene)scene.style.animation='none';const image=screen.querySelector('.rd-cg>img,.ending-scene>img,.zero-scene>.zero-cg');if(image&&duration===600&&typeof cgFadeLayer==='function')cgFadeLayer(previous,image);else storyTimeout(()=>previous.remove(),duration);
}
function zeroQueue(){if(z().phase!=='supplies')return;z().suppliesDone=true;z().queueEntered=true;zeroClock('20:59');zeroPhase('queue');zeroScene();zeroSchedule(Z.timing.queue,()=>{zeroNotice('minute');zeroScene()})}
function zeroReminder(kind){
  const n=zeroWallNotice(kind);if(!n)return;
  zeroBanner(null);stopReading();closeSheet();view='zero-notice';active=kind;rememberRoute();zeroChrome();
  screen.innerHTML=`<section class="app-page zero-notice-page"><header class="page-head">${zeroLock()?'':`<button class="icon-button" data-action="forum" aria-label="返回校园墙">${icon('back')}</button>`}<h1>校园墙</h1><time>${esc(state.system.time)}</time></header><article class="rule-post"><div class="post-author"><span class="avatar black-avatar"></span><small>${wallDateLabel({date:'2045-09-07',time:n.time})}</small></div><p class="zero-notice-text">${esc(n.text)}</p></article></section>`;
  if(kind==='minute'&&!z().rulesActive){zeroPhase('minute');zeroSchedule(Z.timing.reminder,zeroActivate)}
  else if(kind==='minute'&&z().rulesActive)zeroBanner('campus');
}
function zeroActivate(){z().rulesActive=true;z().playerLeft=true;enterStoryEnding();zeroClock('21:00');zeroNotice('campus');const t=document.querySelector('.zero-notice-page time');if(t)t.textContent='21:00';persist()}
function zeroCampus(){
  if(!z().playerLeft)return;
  zeroBanner(null);zeroPhase('profile');view='zero-profile';active=null;rememberRoute();
  screen.innerHTML=campusPageMarkup(true);
  zeroSchedule(1000,()=>{firstDeathPrompt()});
}
function zeroDeath(){const previous=captureSceneSnapshot(screen);previous.messageScroll=screen.querySelector('.messages')?.scrollTop||0;const fading=view!=='zero-death';if(z().phase!=='dead')state.game.deaths=(state.game.deaths||0)+1;zeroPhase('dead');zeroBanner(null);closeSheet();view='zero-death';active=null;rememberRoute();screen.innerHTML='<section class="zero-death"><p>你已被请离学校。</p><button class="secondary" data-action="zero-menu">返回主页</button></section>';if(fading)zeroDissolve(previous)}
function zeroMenu(){if(zeroLock()&&z().phase!=='dead')return;clearTimeout(zeroTimer);zeroBanner(null);stopReading();closeSheet();view='game-menu';active=null;z().menu=true;rememberRoute();zeroChrome();screen.innerHTML='<section class="zero-menu"></section>';if(typeof decorateGameMenu==='function')decorateGameMenu()}
function zeroNodes(){if(view!=='game-menu'&&view!=='nodes')return;view='nodes';rememberRoute();const unlocked=!!nodeRecords()[Z.node];screen.innerHTML=`<section class="app-page zero-nodes"><header class="page-head"><button class="icon-button" data-action="zero-menu" aria-label="返回主页">${icon('back')}</button><h1>再一次抉择</h1></header><p>那些已经走到过的路口。</p><div class="zero-timeline"><button class="zero-node ${unlocked?'visited':''}" ${unlocked?'data-action="zero-retry"':'disabled'}><i></i>${unlocked?'<small>第零日</small><strong>陈妍邀请前往超市</strong>':'<strong>？</strong>'}</button>${[1,2,3].map(()=>'<button class="zero-node" disabled aria-label="尚未经历的节点"><i></i><strong>？</strong></button>').join('')}</div></section>`}
function zeroNew(confirm=false){if(!['game-menu','nodes'].includes(view))return;if(state.story.started&&!confirm){sheet('重新开始？','<p>本次游戏的聊天、评论和物资进度将重新开始。已解锁的抉择节点会保留。</p><button class="primary" data-action="zero-new-confirm">确认重新开始</button><button class="secondary" data-action="close">取消</button>');return}initializeChapter(false);zeroCall(home);profileSetup()}
function zeroRetry(){if(view==='nodes')return loadStoryNode(Z.node)}
function zeroClickNotice(){const kind=z().banner;if(kind==='invitation'){zeroBanner(null);openChat('room408')}else if(kind==='campus')zeroCampus();else if(kind==='where'||kind==='warning')zeroCall(openChat,'linqing');else zeroReminder(kind)}

home=function(){if(zeroLock()&&!zeroInternal)return;const old=view;zeroBase.home();updateCampusCondition();zeroChrome();zeroExit(old)};
chatList=function(){if(zeroLock()&&!zeroInternal)return;const old=view;zeroBase.chatList();zeroChrome();zeroExit(old)};
openApp=function(id){if(zeroLock()&&!zeroInternal)return;const old=view;zeroBase.openApp(id);updateCampusCondition();zeroChrome();zeroExit(old)};
forum=function(){if(zeroLock()&&!zeroInternal)return;const old=view;zeroBase.forum();const tabs=document.querySelector('.rule-post');if(tabs&&forumCategory==='全部')tabs.insertAdjacentHTML('afterend',z().notices.filter(k=>k!=='campus').map(k=>`<button class="zero-wall-update" data-zero-update="${k}"><small>${wallDateLabel({date:'2045-09-07',time:Z.notices[k].time})}</small><p>${esc(zeroWallNotice(k).text)}</p></button>`).reverse().join(''));zeroExit(old)};
rulesPage=function(...args){if(zeroLock()&&!zeroInternal)return;zeroBase.rulesPage(...args)};
postDetail=function(id){if(zeroLock()&&!zeroInternal)return;zeroBase.postDetail(id)};
openChat=function(id){
  if(zeroLock()&&!zeroInternal)return;const old=view;zeroBase.openChat(id);zeroChrome();zeroExit(old);
  if(id==='linqing'&&view==='chat'&&active===id&&z().script==='warning'){z().warningReadStarted=true;persist()}if(id==='linqing'&&['warning','where'].includes(z().banner))zeroBanner(null);if(z().waitingForChat===id&&view==='chat'&&active===id){z().waitingForChat=null;zeroSchedule(z().script==='warning'&&z().step>=Z.scripts.warning.length?storyChoiceDelay():Z.timing.message,zeroStep)}
  if(id==='room408'&&z().phase==='invited'){zeroBanner(null);zeroBeginScript('invitation');return}
  const busy=['invitation','choice','accept','refuse','warning','departing'].includes(z().phase);
  if(busy){const input=document.querySelector('#message-input');if(input){input.disabled=true;input.value='';input.placeholder=z().phase==='choice'?'选择一条回复…':'等待消息…'}document.querySelectorAll('#composer button').forEach(b=>b.disabled=true)}
  if(id==='room408'&&z().phase==='choice'){document.querySelector('#composer').insertAdjacentHTML('beforebegin',zeroChoices());scrollMessages()}
};
sendMessage=function(id,text){if(zeroLock()||['invitation','choice','refuse','warning'].includes(z().phase))return false;return zeroBase.sendMessage(id,text)};
renderMessage=function(m,c){let html=zeroBase.renderMessage(m.asset?{...m,src:Z.cg[m.asset]}:m,c);if(m.sender==='chenyue'&&z().chenyanLeft)html=html.replace('<div class="sender-name">陈妍</div>','<div class="sender-name">陈妍<small class="zero-left-status">已离校</small></div>');if(c.id==='linqing'&&m.sender==='linqing')html=html.replace(avatar('linqing'),`<button class="npc-avatar-button" data-action="zero-lin-profile" aria-label="查看林晴个人资料">${avatar('linqing')}</button>`);return html};
settings=function(){zeroBase.settings();document.querySelector('.settings-footer')?.insertAdjacentHTML('beforebegin',`<div class="settings-group">${settingItem('home','游戏主页','zero-menu')}</div>`)};
initializeChapter=function(keep=true){clearTimeout(zeroTimer);document.querySelector('#zero-notification')?.remove();zeroBase.initializeChapter(keep);state.story.zero=zeroState();delete state.note;zeroChrome();persist()};
Object.assign(actions,{'zero-accept':()=>zeroChoose('accept'),'zero-refuse':()=>zeroChoose('refuse'),'zero-supplies':()=>{if(z().phase!=='cg')return;zeroPhase('supplies');zeroScene()},'zero-queue':zeroQueue,'zero-notice':zeroClickNotice,'zero-dismiss':()=>zeroBanner(null),'zero-menu':requestZeroMenu,'zero-menu-confirm':()=>{initializeChapter(true);zeroMenu()},'zero-menu-cancel':closeSheet,'zero-nodes':zeroNodes,'zero-new':()=>zeroNew(),'zero-new-confirm':()=>zeroNew(true),'zero-retry':zeroRetry});
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.supplyChoice!==undefined&&z().phase==='supplies'){const item=Z.supplies[Number(b.dataset.supplyChoice)];if(!item)return;z().selected=z().selected.includes(item)?z().selected.filter(x=>x!==item):[...z().selected,item];persist();zeroScene()}if(b.dataset.zeroUpdate&&!zeroLock())zeroReminder(b.dataset.zeroUpdate)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&(zeroLock()||['game-menu','nodes'].includes(view))){e.preventDefault();e.stopImmediatePropagation()}},true);
// Block stale phone controls during CGs; only scene and notification actions may run.
document.addEventListener('click',e=>{if(!zeroLock())return;const b=e.target.closest('button');if(!b)return;const allowed=b.id==='read-speed-toggle'||!!b.closest('[data-read-cg-dialog]')||((view==='delivery-detail'||view==='logistics')&&(!!b.closest('.page-head')&&b.getAttribute('aria-label')?.startsWith('返回')||b.dataset.deliveryOrder!==undefined||b.dataset.deliveryTab!==undefined||['delivery-list','phone-desktop'].includes(b.dataset.action)))||(b.id==='midnight-continue-sleep'&&typeof midnightRulesReading==='function'&&midnightRulesReading())||b.dataset.storyReply!==undefined||!!b.closest('[data-cg-single-reply]')||(b.dataset.action==='midnight-rules-open'&&state.story.postReportEvening?.phase==='midnight-notice')||(b.dataset.action==='post-sleep'&&view==='post-evening-bed'&&state.story.postReportEvening?.phase==='bed')||b.dataset.action?.startsWith('zero-')||['ending-rest','fm-campus'].includes(b.dataset.action)||b.dataset.supplyChoice!==undefined;if(!allowed){e.preventDefault();e.stopImmediatePropagation()}},true);

function zeroResume(){
  const p=z().phase;zeroChrome();
  if(z().menu){zeroCall(()=>{const old=z().phase;z().phase='finished';zeroMenu();z().phase=old});return}
  if(z().script){if(z().script!=='warning')zeroCall(openChat,'room408');zeroSchedule(messageSendDelay(),zeroStep)}
  else if(p==='choice')zeroCall(openChat,'room408');
  else if(['cg','supplies','queue'].includes(p)){zeroScene();if(p==='queue'&&!z().notices.includes('minute'))zeroSchedule(Z.timing.queue,()=>{zeroNotice('minute');zeroScene()})}
  else if(p==='minute')zeroReminder('minute');
  else if(p==='profile')zeroCampus();
  else if(p==='departing'){firstDeathPrompt()}
  else if(p==='dead')zeroDeath();
  // A private message never changes the player's current page on resume.
  if(z().banner&&p!=='departing')zeroBanner(z().banner);
}
state.game.day=0;C.initialState.day=0;const chenAvatar=C.avatars.find(a=>a.id==='chenyue');if(chenAvatar)chenAvatar.name='陈妍';
z();persist();zeroResume();
// The reading notification resumes through scheduleRulesDormNotice.
if(new URLSearchParams(location.search).get('dev')==='1'){
  document.querySelector('.day-dev')?.insertAdjacentHTML('beforeend','<button id="clear-choice-nodes">清除已解锁抉择节点（测试）</button>');
  document.querySelector('#clear-choice-nodes').onclick=()=>{saveNodes({});toast('测试节点记录已清除')};
}
window.DayZero={getProgress:()=>structuredClone(z()),getUnlockedNodes:()=>Object.keys(nodeRecords())};

// A single person's read-only feed; future entries are configured in DAY_ZERO.
let linProfileOrigin={chat:'linqing',members:false};
function messageProfileData(){return state.contactProfiles?.[state.messageProfile]||Z.linqingProfile}
function momentText(text){return String(text??'').replaceAll('【玩家名字】',state.profile.name)}
function momentLinkCard(post){const card=post.linkCard;if(!card)return '';return '<div class="lin-music-card" role="group" aria-label="'+esc(card.title)+'"><span class="lin-music-art" aria-hidden="true">'+icon('heart')+'</span><span class="lin-music-info"><strong>'+esc(card.title)+'</strong><small>'+esc(card.detail)+'</small><small>'+esc(card.status)+'</small></span></div>'}
function linProfile(returning=false){
  if(zeroLock()&&z().phase!=='departing')return;
  if(!returning)linProfileOrigin={chat:active||'linqing',members:!!document.querySelector('#overlay .sheet')};
  closeSheet();view='lin-profile';active=null;const p=messageProfileData();
  screen.innerHTML=`<section class="app-page lin-profile"><header class="page-head"><button class="icon-button" data-action="zero-lin-back" aria-label="返回聊天">${icon('back')}</button><h1>个人资料</h1></header><div class="lin-profile-card">${avatar(p.avatar||'linqing')}<h2>${esc(p.name)}</h2><p>个性签名：${esc(p.signature)}</p></div><div class="settings-group">${settingItem('photo','朋友圈','zero-lin-moments')}</div></section>`;
  screen.scrollTop=0;
}
function linMoments(){
  if(zeroLock()&&z().phase!=='departing')return;
  closeSheet();view='lin-moments';active=null;const p=messageProfileData();
  screen.innerHTML=`<section class="app-page lin-moments"><header class="page-head"><button class="icon-button" data-action="zero-lin-return" aria-label="返回${esc(p.name)}个人资料">${icon('back')}</button><h1>${esc(p.name)}的朋友圈</h1></header><div class="lin-feed-owner">${avatar(p.avatar||'linqing')}<div><strong>${esc(p.name)}</strong><p>${esc(p.signature)}</p></div></div>${p.moments.filter(m=>!m.condition||state.game.flags?.[m.condition]).map(m=>`<article class="lin-moment"><time>${esc(m.date)}</time>${m.text?`<p class="lin-moment-text">${esc(momentText(m.text))}</p>`:''}${m.image?`<div class="lin-moment-photo"><img src="${esc(m.image)}" alt="${esc(m.imageAlt)}"></div>`:''}${momentLinkCard(m)}${m.music?`<button class="lin-music-card" data-action="zero-lin-music" aria-label="播放音乐：${esc(m.music.title)}" aria-pressed="false"><span class="lin-music-art" aria-hidden="true">♪</span><span class="lin-music-info"><strong>${esc(m.music.title)}</strong><small>${esc(m.music.artist)}</small></span><span class="lin-music-open" aria-hidden="true">▷</span></button>`:''}${m.replies?.length?`<div class="lin-existing-replies">${m.replies.map(r=>`<p><strong>${esc(momentText(r.name))}</strong>${r.replyTo?`<span>回复</span><strong>${esc(momentText(r.replyTo))}</strong>`:''}：${esc(momentText(r.text))}</p>`).join('')}</div>`:''}</article>`).join('')}</section>`;
  screen.scrollTop=0;
}

Object.assign(actions,{'zero-lin-profile':()=>linProfile(),'zero-lin-return':()=>linProfile(true),'zero-lin-moments':linMoments,'zero-lin-back':()=>{zeroCall(openChat,linProfileOrigin.chat);if(linProfileOrigin.members)actions['chat-options']()}});


icons.home='M3 11l9-8 9 8 M5 10v11h5v-7h4v7h5V10';
function requestZeroMenu(){
  if(['game-menu','nodes'].includes(view))return zeroMenu();
  if(zeroLock()&&z().phase!=='dead')return;
  const reached=Object.keys(nodeRecords()).length>0;
  sheet('确定返回游戏主页？',`<p>返回后，当前游玩进度将不会保留。${reached?'已解锁的抉择节点会保留，你可以通过“再一次抉择”从上次的选择处重新开始。':'你还没有抵达抉择节点，返回后需要重新开始游戏。'}</p><button class="primary" data-action="zero-menu-confirm">确定返回</button><button class="secondary" data-action="zero-menu-cancel">留在当前页面</button>`);
  document.querySelector('#overlay [data-action="close"]')?.setAttribute('data-action','zero-menu-cancel');
}

// Audio is session-only and never starts without a player gesture.
let linMusicAudio=null;
function stopLinMusic(){if(linMusicAudio){linMusicAudio.pause();linMusicAudio.currentTime=0;linMusicAudio=null}syncLinMusic()}
function syncLinMusic(){const b=document.querySelector('.lin-music-card');if(!b)return;const playing=!!linMusicAudio&&!linMusicAudio.paused;b.setAttribute('aria-pressed',String(playing));b.setAttribute('aria-label',(playing?'暂停音乐：':'播放音乐：')+'爱人');b.querySelector('.lin-music-open').textContent=playing?'Ⅱ':'▷'}
actions['zero-lin-music']=()=>{toast('点击设置可查看推荐歌单')};
new MutationObserver(()=>{if(!['lin-moments','message-moments'].includes(view)&&linMusicAudio)stopLinMusic();else if(['lin-moments','message-moments'].includes(view))syncLinMusic()}).observe(screen,{childList:true});
window.addEventListener('pagehide',stopLinMusic);

// Update only the existing supermarket-photo sequence from earlier progress.
let correctedSupermarketTime=false;
for(const m of state.messages.room408||[]){if(/^zero-refuse-[456](?:-time)?$/.test(m.id||'')&&m.time==='20:56'){m.time='20:59';if(m.type==='time')m.text='20:59';correctedSupermarketTime=true}}
if(correctedSupermarketTime){const c=state.contacts.find(c=>c.id==='room408');if(c?.time==='20:56')c.time='20:59';if(state.system.time==='20:56')state.system.time='20:59';persist()}

updateCampusCondition();
