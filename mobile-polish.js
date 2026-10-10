/* Incremental phone controls and sound preferences. */
const MOBILE_SETTINGS_KEY='afterclass-phone-settings-v1';
function mobileRead(key,fallback){try{return JSON.parse(GameStorage.getItem(key))??fallback}catch{return fallback}}
let mobileSounds={notificationRingtone:true,silent:false,ringtoneVolume:50,...mobileRead(MOBILE_SETTINGS_KEY,{})};
mobileSounds.notificationRingtone=mobileSounds.notificationRingtone!==false;mobileSounds.ringtoneVolume=Number.isFinite(Number(mobileSounds.ringtoneVolume))?Math.min(100,Math.max(0,Number(mobileSounds.ringtoneVolume))):50;
function syncMobileSettings(){state.preferences??={};state.preferences.notifications=true;state.preferences.notificationRingtone=mobileSounds.notificationRingtone;state.preferences.ringtoneVolume=mobileSounds.ringtoneVolume;state.system.silent=mobileSounds.silent}
function saveMobileSounds(){if(mobileSounds.silent)GameAudio.stopAll();GameStorage.setItem(MOBILE_SETTINGS_KEY,JSON.stringify(mobileSounds));syncMobileSettings();persist();status()}
const mobileSettings=settings;settings=function(){mobileSettings();const item=screen.querySelector('[data-action="notifications"]');if(item)item.outerHTML=settingItem('bell','通知铃声','notifications',mobileSounds.notificationRingtone?'已开启':'已关闭');};
actions.notifications=()=>{sheet('通知铃声',`<label class="standard-row">通知铃声<input class="switch" id="ringtone-switch" type="checkbox" ${mobileSounds.notificationRingtone?'checked':''}></label><p>剧情通知正常显示，可单独关闭提醒声音。</p>`);document.querySelector('#ringtone-switch').onchange=e=>{mobileSounds.notificationRingtone=e.target.checked;saveMobileSounds()}};
actions.network=()=>{sheet('网络与声音',`<label class="setting-row">Wi-Fi<input class="switch" type="checkbox" data-system="wifi" ${state.system.wifi?'checked':''}></label><label class="setting-row">静音模式<input class="switch" id="mobile-silent" type="checkbox" ${mobileSounds.silent?'checked':''}></label>`);document.querySelector('#mobile-silent').onchange=e=>{mobileSounds.silent=e.target.checked;saveMobileSounds()}};
// Replace any path independently when audio material is available. Missing files stay silent.
window.NotificationAudioSlots={message:'assets/audio/message-notification-v1.wav?v=20261011-rc5',friend:'assets/audio/message-notification-v1.wav?v=20261011-rc5',group:'assets/audio/message-notification-v1.wav?v=20261011-rc5',wall:'assets/audio/system-unlock-v1.wav?v=20261011-rc5',logistics:'assets/audio/system-unlock-v1.wav?v=20261011-rc5',identity:'assets/audio/system-unlock-v1.wav?v=20261011-rc5',system:'assets/audio/system-unlock-v1.wav?v=20261011-rc5',unlock:'assets/audio/system-unlock-v1.wav?v=20261011-rc5'};
const mobilePlaying=new Set();
window.playNotificationSound=function(kind,notice=null){if(notice){if(!notice.isConnected||notice.dataset.ringtonePlayed)return;notice.dataset.ringtonePlayed='true'}if(window.ReadHistory?.muteMessageSound(kind))return;if(storyEndingOwner()&&!isStoryEndingNotice(notice))return;if(window.mobileLaunch||document.hidden||mobileSounds.silent||!mobileSounds.notificationRingtone||mobileSounds.ringtoneVolume===0)return;const src=NotificationAudioSlots[kind]||NotificationAudioSlots.system;if(!src)return;let audio;audio=GameAudio.play(src,{volume:mobileSounds.ringtoneVolume/100,onended:()=>queueMicrotask(()=>mobilePlaying.delete(audio))});mobilePlaying.add(audio)};
function notificationKind(el){if(el.dataset.notificationKind)return el.dataset.notificationKind;const t=el.textContent;if(/解锁|已开放|身份确认/.test(t))return 'system';if(/好友|验证消息|申请/.test(t))return 'friend';if(/物流|订单已送达/.test(t))return 'logistics';if(/身份档案|身份系统/.test(t))return 'identity';if(/校园墙/.test(t))return 'wall';if(/互助群|408宿舍/.test(t))return 'group';if(/讯息|林晴|江晓/.test(t))return 'message';return 'system'}
new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes){if(node.nodeType!==1)continue;const notices=[...(node.matches('.opening-message')?[node]:[]),...node.querySelectorAll('.opening-message')];for(const el of notices)playNotificationSound(notificationKind(el),el)}}).observe(document.querySelector('#phone'),{childList:true,subtree:true});
const mobileSaveSounds=saveMobileSounds;saveMobileSounds=function(){if(mobileSounds.silent||!mobileSounds.notificationRingtone){for(const audio of mobilePlaying)audio.pause();mobilePlaying.clear()}else for(const audio of mobilePlaying)audio.volume=mobileSounds.ringtoneVolume/100;mobileSaveSounds()};
function mobileAppLocked(id){return id==='health'?!ns().healthUnlocked:id==='logistics'?!ns().productsUpdated:false}
const mobileAppButton=appButton;appButton=function(a){let html=mobileAppButton(a);if(mobileAppLocked(a.id)){html=html.replace('class="app-button','class="app-button locked');html=html.replace('</span><span>','<img class="app-lock-image" src="assets/ui-lock.svg?v=20261011-rc5" alt="已锁定"></span><span>')}return html};
const mobileOpenApp=openApp;openApp=function(id){if(mobileAppLocked(id))return toast('功能暂未开放');if(window.mobileLaunch){if(id==='settings')return settings();return toast('点击“新游戏”开始')}return mobileOpenApp(id)};
window.CampusEngine.openApp=id=>openApp(id);
function mobileFixedPortraits(){migratePortraitProgress(state);const records=nodeRecords();for(const record of Object.values(records))migratePortraitProgress(record.checkpoint);saveNodes(records)}
const mobileInitialize=initializeChapter;initializeChapter=function(...args){const result=mobileInitialize(...args);syncMobileSettings();mobileFixedPortraits();persist();return result};
const mobileProfileSetup=profileSetup;
let mobileCreating=false,mobileCreationAvatar=null,mobileCreationName='',mobileCreationFood='';
const MOBILE_FAVORITE_FOODS=['三明治','意大利面','烤鸡盖饭','蛋包饭','韩式拌饭','饭团','寿司','牛角面包'];
let creationNoticeTimer=null,creationNoticeSerial=0;
function clearCreationNotice(){clearTimeout(creationNoticeTimer);creationNoticeTimer=null;creationNoticeSerial++}
function showCreationNotice(){
 clearCreationNotice();closeSheet();stopReading();view='game-menu';active=null;zeroChrome();
 const lines=['特别说明','本作品设定于架空世界的2045年','本作中的人物、学校与事件均为虚构。','所有“校园规则”仅为悬疑剧情需要，与任何现实事件无关。','如有雷同，纯属巧合。'],serial=creationNoticeSerial;
 screen.innerHTML='<section class="creation-notice"><div class="creation-notice-copy" aria-busy="true">'+lines.map((line,i)=>{const tag=i===0?'h1':'p';return '<'+tag+'><span class="creation-notice-measure" aria-hidden="true">'+esc(line)+'</span><span class="creation-notice-line"></span></'+tag+'>'}).join('')+'</div><button type="button" class="creation-notice-continue" disabled aria-label="点击屏幕继续游戏"><span>点击屏幕继续游戏</span></button></section>';
 screen.scrollTop=0;
 const page=screen.querySelector('.creation-notice'),copy=page.querySelector('.creation-notice-copy'),rows=page.querySelectorAll('.creation-notice-line'),button=page.querySelector('.creation-notice-continue');
 const current=()=>serial===creationNoticeSerial&&mobileCreating&&page.isConnected;
 let line=0,index=0;
 function typeNext(){
  if(!current())return;
  rows[line].textContent=lines[line].slice(0,++index);
  if(index<lines[line].length){creationNoticeTimer=setTimeout(typeNext,65);return}
  if(line<lines.length-1){line++;index=0;creationNoticeTimer=setTimeout(typeNext,360);return}
  copy.setAttribute('aria-busy','false');
  creationNoticeTimer=setTimeout(()=>{if(!current())return;creationNoticeTimer=null;button.disabled=false;page.classList.add('ready');button.focus()},2000);
 }
 button.onclick=()=>{if(button.disabled||!current())return;button.disabled=true;clearCreationNotice();actions['mobile-name-step']()};
 creationNoticeTimer=setTimeout(typeNext,300);
}
function styleCreationSheet(){const panel=document.querySelector('#overlay .sheet');panel?.classList.add('creation-sheet');const close=panel?.querySelector('.sheet-header button');if(close){close.dataset.action='mobile-create-cancel';close.setAttribute('aria-label','取消新建角色，返回游戏主页')}}
function cancelMobileCreation(){if(!mobileCreating)return;clearCreationNotice();mobileCreating=false;mobileCreationName='';mobileCreationFood='';mobileCreationAvatar=null;if(typeof stopCreationMonitor==='function')stopCreationMonitor();closeSheet();window.mobileLaunch=true;mobileLaunchHome();persist()}
actions['mobile-create-cancel']=cancelMobileCreation;
window.addEventListener('click',e=>{if(!mobileCreating||!e.target.closest('.creation-sheet [data-action="mobile-create-cancel"]'))return;e.preventDefault();e.stopImmediatePropagation();cancelMobileCreation()},true);
profileSetup=function(){if(!mobileCreating){mobileProfileSetup();return}chosenAvatar=mobileCreationAvatar||C.playerAvatars[0].id;sheet('选择你的头像',`<div class="setup-step">个人终端 <span>03 / 03</span></div><p class="setup-welcome">你好，${esc(mobileCreationName)}。</p><p class="setup-caption">挑选一个喜欢的头像。</p><div class="avatar-grid">${C.playerAvatars.map(a=>`<button type="button" class="avatar-choice ${a.id===chosenAvatar?'selected':''}" data-avatar="${a.id}" aria-label="${esc(a.name)}">${avatar(a.id)}</button>`).join('')}</div><p class="setup-note">后续可以在设置中，或在聊天界面点击自己的头像修改。</p><button class="primary" data-action="mobile-avatar-confirm">确认头像，开始游戏</button><button class="secondary" data-action="mobile-name-step">修改名字</button>`);styleCreationSheet()};
actions['mobile-name-step']=()=>{if(!mobileCreating)return;clearCreationNotice();screen.innerHTML='<section class="creation-backdrop" aria-hidden="true"></section>';mobileCreationAvatar=chosenAvatar;sheet('怎么称呼你？',`<div class="setup-step">个人终端 <span>01 / 03</span></div><span class="setup-emblem">${icon('user')}</span><p class="setup-caption">从一个属于你的名字开始。</p><form id="mobile-name-form"><label class="field-label" for="mobile-name">你的名字</label><input class="nickname" id="mobile-name" value="${esc(mobileCreationName)}" placeholder="请输入名字" maxlength="16" required autocomplete="nickname"><button class="primary" type="submit">下一步</button></form>`);styleCreationSheet();document.querySelector('#mobile-name-form').onsubmit=e=>{e.preventDefault();const name=document.querySelector('#mobile-name').value.trim();if(!name)return toast('请输入名字');mobileCreationName=name;mobileFoodStep()}};
function mobileFoodStep(){
 if(!mobileCreating)return;
 mobileCreationAvatar=chosenAvatar;
 sheet('你的饮食偏好', '<div class="setup-step">个人终端 <span>02 / 03</span></div><p class="setup-welcome creation-food-question">下面这些便利店食品里，你最喜欢哪一种？</p><div class="creation-food-options">'+MOBILE_FAVORITE_FOODS.map((food,index)=>'<button type="button" class="secondary" data-creation-food="'+index+'" aria-pressed="'+(mobileCreationFood===food)+'">'+food+'</button>').join('')+'</div><p class="setup-note">提示：该选择不会影响属性，请按照自己的喜好选择。</p><button type="button" class="primary" data-action="mobile-food-confirm" '+(MOBILE_FAVORITE_FOODS.includes(mobileCreationFood)?'':'disabled')+'>确认选择，下一步</button>');
 styleCreationSheet();
 document.querySelectorAll('[data-creation-food]').forEach(button=>button.onclick=()=>{
  if(!mobileCreating)return;const food=MOBILE_FAVORITE_FOODS[Number(button.dataset.creationFood)];if(!food)return;
  mobileCreationFood=food;if(typeof playInteractionSound==='function')playInteractionSound('button');
  document.querySelectorAll('[data-creation-food]').forEach(option=>option.setAttribute('aria-pressed',String(MOBILE_FAVORITE_FOODS[Number(option.dataset.creationFood)]===food)));
  document.querySelector('[data-action="mobile-food-confirm"]').disabled=false;
 });
}
actions['mobile-food-confirm']=()=>{if(mobileCreating&&document.querySelector('.creation-food-options')&&MOBILE_FAVORITE_FOODS.includes(mobileCreationFood))profileSetup()};
actions['mobile-avatar-confirm']=()=>{if(!mobileCreating||!mobileCreationName||!MOBILE_FAVORITE_FOODS.includes(mobileCreationFood)||!C.playerAvatars.some(a=>a.id===chosenAvatar))return;state.profile={name:mobileCreationName,avatar:chosenAvatar,favoriteFood:mobileCreationFood};mobileCreating=false;window.mobileLaunch=false;z().menu=false;syncMobileSettings();closeSheet();window.DayOne.profileSaved();persist();home()};
function mobileNewGame(confirmed=false){if(state.story.started&&!confirmed)return sheet('开始新游戏？','<p>当前剧情进度将重新开始，已到达的抉择节点会保留。</p><button class="primary" data-action="mobile-new-confirm">确认重新开始</button><button class="secondary" data-action="close">取消</button>');window.mobileLaunch=false;initializeChapter(false);mobileCreating=true;mobileCreationAvatar=null;mobileCreationName='';mobileCreationFood='';chosenAvatar=C.playerAvatars[0].id;window.mobileLaunch=true;mobileLaunchHome();showCreationNotice()}
actions['mobile-new']=()=>mobileNewGame();actions['mobile-new-confirm']=()=>mobileNewGame(true);
const mobileZeroNew=zeroNew;zeroNew=function(confirm=false){mobileNewGame(confirm)};
function replaceHomeSymbols(){for(const el of screen.querySelectorAll('.campus-sticker,.widget .eyebrow>span,.tiny-star,.moon-drawing i')){const arrow=el.matches('.widget .eyebrow>span');el.innerHTML=`<img class="asset-icon" src="assets/ui-${arrow?'arrow':'flower'}.svg" alt="">`}const mark=screen.querySelector('.home-section>span:last-child');if(mark)mark.innerHTML='<img class="asset-icon" src="assets/ui-flower.svg?v=20261011-rc5" alt=""> MY SPACE'}
const mobileHome=home;home=function(...args){if(window.mobileLaunch)return mobileLaunchHome();const result=mobileHome(...args);replaceHomeSymbols();return result};
const mobileLock=zeroLock;zeroLock=function(){return window.mobileLaunch?false:mobileLock()};
function mobileLaunchHome(){clearCreationNotice();closeSheet();view='game-menu';active=null;zeroMenu();const mark=screen.querySelector('.zero-menu-mark');if(mark)mark.innerHTML='<img src="assets/ui-flower.svg?v=20261011-rc5" alt="" class="menu-emblem">';document.querySelectorAll('.opening-message').forEach(el=>el.remove())}
actions['mobile-nodes']=()=>{view='game-menu';zeroNodes()};
function syncMobileHome(){const dockHome=document.querySelector('#dock [data-action="phone-desktop"]');if(dockHome)dockHome.hidden=view!=='home'}
const mobileStatus=status;status=function(){mobileStatus();if(view==='home')replaceHomeSymbols();syncMobileHome()};
new MutationObserver(syncMobileHome).observe(screen,{childList:true,subtree:true});
// Stop startup resume callbacks; do not advance existing progress before New Game or a node.
for(const id of window.mobileBootTimeouts)clearTimeout(id);window.mobileBootTimeouts=[];
if(window.mobileLaunch&&saved.story?.version===D.version)state=structuredClone(saved);
state.story.deliveryNoticeIds??=[];
for(const order of state.orders||[])if(order.arrivalNotified&&!state.story.deliveryNoticeIds.includes(order.id))state.story.deliveryNoticeIds.push(order.id);
syncMobileSettings();mobileFixedPortraits();
if(window.mobileLaunch)mobileLaunchHome();
else {const route=window.mobileResumeRoute;if(view==='home'&&!zeroLock()&&route){if(route.view==='post'&&route.active)postDetail(route.active);else if(route.view==='ns-identity')nsIdentity();else if(['health','logistics','supply','wallet','settings','calendar','campus'].includes(route.view))openApp(route.view)}persist();replaceHomeSymbols()}
syncMobileHome();
// Reveal only after the current menu, styles and ending-gallery entry are installed.
function revealCurrentGameScreen(){
 if(view==='game-menu'&&screen.querySelector('.zero-menu')&&typeof decorateGameMenu==='function')decorateGameMenu();
 document.documentElement.classList.remove('mobile-loading');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',revealCurrentGameScreen,{once:true});
else revealCurrentGameScreen();
