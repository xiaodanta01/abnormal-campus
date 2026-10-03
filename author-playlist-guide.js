/* Visual guidance only: do not insert story messages or change their timing. */
const authorPlaylistRenderMessage=renderMessage;
renderMessage=function(m,c){
 const html=authorPlaylistRenderMessage(m,c);
 return c.id==='linqing'&&m.id==='opening'?html+'<div class="divider message-group-time" data-author-playlist-guide>点击设置可查看推荐歌单</div>':html;
};

/* Let the longer homepage reminder wrap on narrow screens. */
const playlistHintStyle=document.createElement('style');
playlistHintStyle.textContent='.zero-menu.abnormal-game-menu .game-bgm-hint{white-space:pre-line;font-size:11px;letter-spacing:0;max-width:310px;text-wrap:balance}[data-author-playlist-guide]{white-space:normal;font-size:10px;letter-spacing:0}.recommended-playlist ol{padding-left:28px;margin:12px 0 24px}.recommended-playlist li{padding:6px 0;line-height:1.7;overflow-wrap:anywhere}.recommended-playlist h3{font-size:14px;margin:20px 0 6px}';
document.head.appendChild(playlistHintStyle);

const recommendedPlaylistGroups=[
 {day:'day0-1',start:1,tracks:[
  'Charm and Rules（欲望法则）— 时空储蓄罐',
  'Decorate（饰品）— 时空储蓄罐',
  'Dilemma（进退）— 时空储蓄罐',
  'Frame（定格）— 时空储蓄罐',
  'Cipher（机密）— 时空储蓄罐',
  'Six Forty Seven（6:47）— instupendo'
 ]},
 {day:'day2',start:7,tracks:[
  '情绪回收站 — 失落花园_',
  '麻木梦 — 失落花园_',
  '假心话 — M3mo',
  '情绪回收站 PT.2 — 失落花园_',
  '回忆格式化 — M3mo',
  'Hi — TEMPOREX',
  'Moth — Park Bird'
 ]},
 {day:'day3-4',start:14,tracks:[
  'slt — 牛尾憲輔',
  'Their（局外人）— 时空储蓄罐',
  '走马灯 pt.2 — M3mo',
  '闭环 — CMJ',
  '黑色华尔兹 — Auren蜜蜂',
  '于是你再一次盛开 — 在虚无中永存'
 ]},
 {day:'day5',start:20,tracks:[
  '一个精神分裂症患者的自白 — MT1990',
  '负心人 — M3mo',
  '好结局 — 银河小鱼',
  'Time Flies — 水仙LONE',
  'scarlet — L1VET..'
 ]}
];
actions['recommended-playlist-close']=()=>closeSheet();
actions['recommended-playlist']=()=>{
 sheet('异常校园模拟器推荐歌单',
 '<div class="recommended-playlist">'+recommendedPlaylistGroups.map(group=>
  '<section><h3>'+esc(group.day)+'</h3><ol start="'+group.start+'">'+group.tracks.map(track=>'<li>'+esc(track)+'</li>').join('')+'</ol></section>'
 ).join('')+'</div><button class="secondary" data-action="recommended-playlist-close">返回设置</button>');
 document.querySelector('.sheet-header [data-action="close"]')?.setAttribute('data-action','recommended-playlist-close');
};
const playlistBaseSettings=settings;
settings=function(...args){
 const result=playlistBaseSettings(...args);
 if(view!=='settings')return result;
 const page=screen.querySelector('.standard-settings');
 if(page&&!page.querySelector('[data-action="recommended-playlist"]')){
  page.querySelector('.settings-footer')?.remove();
  page.insertAdjacentHTML('beforeend','<div class="settings-group">'+settingItem('bell','推荐歌单','recommended-playlist')+'</div>');
 }
 return result;
};

/* Reuse the questionnaire instrument sound only during new-player creation. */
let creationMonitorAudio=null;
function stopCreationMonitor(){if(creationMonitorAudio){creationMonitorAudio.pause();creationMonitorAudio.currentTime=0}}
function playCreationMonitor(){
 if(!mobileCreating||state.story.started||mobileSounds.silent||document.hidden)return;
 stopCreationMonitor();
 if(!creationMonitorAudio){creationMonitorAudio=new Audio('assets/audio/creation-monitor-three.wav');creationMonitorAudio.loop=false;creationMonitorAudio.volume=.5}
 const playing=creationMonitorAudio.play();if(playing&&playing.catch)playing.catch(()=>{});
}
const creationMonitorNameStep=actions['mobile-name-step'];
actions['mobile-name-step']=function(){const result=creationMonitorNameStep.apply(this,arguments);playCreationMonitor();return result};
const creationMonitorProfile=profileSetup;
profileSetup=function(){const result=creationMonitorProfile.apply(this,arguments);playCreationMonitor();return result};
const creationMonitorOpening=showOpeningMessage;
showOpeningMessage=function(){if(state.story.started)stopCreationMonitor();return creationMonitorOpening.apply(this,arguments)};
const creationMonitorReset=initializeChapter;
initializeChapter=function(){stopCreationMonitor();return creationMonitorReset.apply(this,arguments)};
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopCreationMonitor()});
window.addEventListener('pagehide',stopCreationMonitor);
