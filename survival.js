/* Daily survival settlement is recorded in the current progress/checkpoint. */
function settleMorning(){if(!state.story.started)return false;const game=state.game;game.survivalDays??={};const day=Math.floor((Date.parse(state.system.date+'T00:00:00Z')-Date.UTC(2045,8,7))/86400000);const hour=Number(state.system.time.split(':')[0]);const last=day-(hour<6?1:0);let changed=false;for(let n=1;n<=last;n++){if(game.survivalDays[n])continue;game.dailyVitalChanges??={};const before={health:game.health??100,spirit:game.spirit??100};game.health=(game.health??100)-30;if(n>=2)game.spirit=(game.spirit??100)-10;game.dailyVitalChanges[n]={health:{before:before.health,after:game.health,delta:game.health-before.health},spirit:{before:before.spirit,after:game.spirit??100,delta:(game.spirit??100)-before.spirit}};game.survivalDays[n]=true;changed=true}if(changed&&typeof dailyVitalsMarkup==='function'){const panel=document.querySelector('#morning-title .daily-vitals');if(panel)panel.outerHTML=dailyVitalsMarkup()}return changed}
let survivalScheduled=false;
function freeActionEnergyBlocked(id){if(id==='d2sleep'||(state.game.spirit??100)>=20)return false;closeSheet();const f=freeState();if(view==='free-transition'&&!f.transition&&!f.run){view='home';active=null;home();rememberRoute();persist()}toast('你的精力太差 无法进行探索');return true}
function freeRecoveryReady(){if(![1,2].includes(state.game.day))return false;const f=freeState();return f.unlocked&&!f.finished&&!f.run&&!f.transition&&f.completed.length<FREE_ACTION_LIMIT}
function freeRecoveryPrompt(){
 const f=freeState();if(!freeRecoveryReady()||(state.game.spirit??100)>5||f.recoveryPromptSeen)return false;
 f.recoveryPromptSeen=true;f.promptSeen=true;persist();
 sheet('你的精力状态很差','<p>你现在的精力值已经不足以继续探索。<br>建议先吃点东西，或者睡一觉恢复精力值。</p><button class="primary" data-action="free-recovery-health">打开健康背包</button><button class="secondary" data-action="free-recovery-sleep">选择睡觉休息</button>');return true;
}
function freeRecoveryHealthBack(){
 if(view!=='health'||!freeRecoveryReady()||!freeState().recoveryHealthReturn)return;
 const back=screen.querySelector('.page-head [data-action="home"]');if(back){back.dataset.action='free-recovery-return';back.setAttribute('aria-label','返回自由行动')}
}
actions['free-recovery-health']=()=>{if(!freeRecoveryReady())return;freeState().recoveryHealthReturn=true;persist();closeSheet();nsHealth()};
actions['free-recovery-sleep']=()=>{if(freeRecoveryReady())faRunStart('d2sleep')};
actions['free-recovery-return']=()=>{if(freeRecoveryReady())freePanel();else home()};
// Every completed investigation costs 5 spirit. Sleeping restores 20 instead;
// callers settle only after their completed-action guard, so replay cannot double-charge.
const FREE_ACTION_SPIRIT=Object.freeze({cost:5,rest:20});
function settleFreeActionSpirit(id){const before=state.game.spirit??100;state.game.spirit=id==='d2sleep'?Math.min(100,before+FREE_ACTION_SPIRIT.rest):before-FREE_ACTION_SPIRIT.cost;return state.game.spirit-before}
function morningVitalsPending(){
 const s=state.story;
 return !!document.querySelector('#morning-title')||s.dayFourMorning&&s.dayFourMorning.phase!=='done'||s.dayThreeMorning&&['sleep','transition'].includes(s.dayThreeMorning.phase)||state.game.day===2&&(s.postReportEvening?.morningTransitionUntil||0)>Date.now();
}
// One current-health threshold across all days; morning presentation finishes first.
function checkLowHealth(){
 if(!state.story.started||window.mobileLaunch||['game-menu','nodes','zero-death'].includes(view)||morningVitalsPending())return false;
 if(state.game.survivalEnding||state.story.lateDayDeath)return false;
 if((state.game.health??100)>=20||typeof beginLateDeath!=='function')return false;
 beginLateDeath('forgot-food');return true;
}
// Retain the old caller without a separate Day 2 threshold or stale failure flag.
function checkSecondMorningHealth(){return checkLowHealth()}
function checkSurvival(){checkLowHealth()}

actions['zero-survival-close']=closeSheet;
const survivalPersist=persist;persist=function(){settleMorning();survivalPersist();if(!survivalScheduled){survivalScheduled=true;queueMicrotask(()=>{survivalScheduled=false;checkSurvival()})}};
setInterval(()=>{if(!state.story.started||['game-menu','nodes'].includes(view))return;if(settleMorning()){persist();if(view==='health')nsHealth()}checkSurvival()},500);
if(settleMorning())persist();
