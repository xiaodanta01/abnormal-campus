/* Visual guidance only: do not insert story messages or change their timing. */
const authorPlaylistRenderMessage=renderMessage;
renderMessage=function(m,c){
 const html=authorPlaylistRenderMessage(m,c);
 return c.id==='linqing'&&m.id==='opening'?html+'<div class="divider message-group-time" data-author-playlist-guide><span>前往设置可查看推荐歌单</span><a href="https://163cn.tv/bhMY8KCM" target="_blank" rel="noopener noreferrer">点击此处跳转</a></div>':html;
};

/* Let the longer homepage reminder wrap on narrow screens. */
const playlistHintStyle=document.createElement('style');
playlistHintStyle.textContent=`
.zero-menu.abnormal-game-menu .game-bgm-hint{white-space:pre-line;font-size:11px;letter-spacing:0;max-width:310px;text-wrap:balance}
[data-author-playlist-guide]{display:flex;align-items:center;justify-content:center;gap:8px;white-space:nowrap;font-size:10px;letter-spacing:0}
[data-author-playlist-guide]>a{font:inherit;color:#b6d6c5;padding:8px 0;text-decoration:underline;text-underline-offset:3px;flex-shrink:0}
.sheet.playlist-sheet{background:#172321;color:#e4ebe6;border:1px solid #a8c6b51f;padding-bottom:max(22px,env(safe-area-inset-bottom));overscroll-behavior:contain}
.playlist-sheet .sheet-header{border-bottom:1px solid #ffffff0b;padding-bottom:16px;margin-bottom:18px}
.playlist-sheet .sheet-header h2{font-size:18px;letter-spacing:1px}
.playlist-direct{padding:16px;border:1px solid #9ec4ae30;border-radius:14px;background:linear-gradient(120deg,#38584966,#243d3333);font-size:14px;color:#d7e9dc;line-height:1.7}
.playlist-direct small{display:block;margin-top:5px;font-size:11px;color:#95afa3;letter-spacing:.3px}
.recommended-playlist section{margin-top:25px}
.recommended-playlist h3{display:flex;align-items:center;gap:10px;font-size:13px;font-weight:500;color:#b6cabc;margin:0 0 10px}
.recommended-playlist h3:after{content:'';height:1px;background:#ffffff0b;flex:1}
.recommended-playlist h3 small{font-size:9px;letter-spacing:1px;color:#718c7e}
.recommended-playlist ol{list-style:none;margin:0;padding:0;border:1px solid #ffffff09;border-radius:14px;background:#ffffff03;overflow:hidden}
.recommended-playlist li{display:flex;align-items:center;gap:13px;padding:13px 14px;line-height:1.5}
.recommended-playlist li+li{border-top:1px solid #ffffff07}
.playlist-track-number{width:20px;flex-shrink:0;color:#718d7f;font-size:11px;font-variant-numeric:tabular-nums}
.playlist-track-copy{min-width:0;overflow-wrap:anywhere}
.playlist-track-copy strong{display:block;font-size:13px;font-weight:500;color:#e0e7e1}
.playlist-track-copy small{display:block;margin-top:4px;font-size:11px;color:#8ea497}
.playlist-sheet>.secondary{margin-top:22px;border-color:#94b49e30;color:#c3d8ca;background:#24372f}
`;
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
 const labels={'day0-1':'第零日 · 第一日',day2:'第二日','day3-4':'第三日 · 第四日',day5:'第五日'};
 sheet('推荐歌单',
 '<div class="recommended-playlist"><div class="playlist-direct">☁歌单直达：游戏同名<small>异常校园模拟器 · 推荐聆听</small></div>'+recommendedPlaylistGroups.map(group=>
  '<section><h3>'+labels[group.day]+'<small>'+esc(group.day.toUpperCase())+'</small></h3><ol start="'+group.start+'">'+group.tracks.map((track,i)=>{const [title,artist]=track.split(/\s*—\s*/);return '<li><span class="playlist-track-number" aria-hidden="true">'+String(group.start+i).padStart(2,'0')+'</span><span class="playlist-track-copy"><strong>'+esc(title)+'</strong><small>'+esc(artist)+'</small></span></li>'}).join('')+'</ol></section>'
 ).join('')+'</div><button class="secondary" data-action="recommended-playlist-close">'+(view==='settings'?'返回设置':'返回聊天')+'</button>');
 document.querySelector('#overlay .sheet')?.classList.add('playlist-sheet');
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
 if(!creationMonitorAudio){creationMonitorAudio=new Audio('assets/audio/creation-monitor-three.mp3?v=20261011-rc5');creationMonitorAudio.loop=false;creationMonitorAudio.volume=.5}
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
