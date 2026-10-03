/* One terminal sequence for the noodle-to-report chapter. */
function lateDeath(){return state.story.lateDayDeath}
function isNightClearance(reason=lateDeath()?.reason){return ['day3-unprotected','wolf-vote','day1-songjia-uninformed','day2-council-accusation','day2-confrontation','day2-jiang-unsupported','day2-yelin-misled','day2-yelin-no-clues'].includes(reason)}
function lateDeathLocked(){return !storyInputDormant()&&!!lateDeath()&&lateDeath().phase!=='dead'}
let lateDeathInternal=false;
function lateDeathCall(fn,...args){const previous=lateDeathInternal;lateDeathInternal=true;try{return fn(...args)}finally{lateDeathInternal=previous}}
function beginLateDeath(reason='left'){
 if(lateDeath())return false;
 const q=survey(),r=dayReport();
 if(q&&q.phase!=='done'){q.failed=true;q.phase='dead';q.due=0;surveyCleanup()}
 if(r){r.phase='dead';r.failed=true}
 state.game.survivalEnding='left';
 state.story.lateDayDeath={phase:'notice',reason,startedAt:Date.now(),counted:false};
 enterStoryEnding();
 document.querySelectorAll('.opening-message,#survey-notice,#report-confirm,#report-death-notice').forEach(el=>el.remove());
 lateDeathCall(home);renderLateDeath();syncNoodleMusic();playNotificationSound('system',document.querySelector('#late-death-notice'));return true;
}
function renderLateDeath(){
 const d=lateDeath();if(!d)return;enterStoryEnding();document.querySelector('#late-death-notice')?.remove();
 const phone=document.querySelector('#phone');phone.classList.toggle('late-death-active',['campus','black','dead'].includes(d.phase));
 view=d.phase==='dead'?'zero-death':'late-death';active=null;state.story.route={view,active};
 if(d.phase==='notice'){
  const el=document.createElement('div');el.id='late-death-notice';
  if(['forgot-food','day3-unprotected'].includes(d.reason)){
   el.className='opening-message';el.dataset.notificationKind='system';
   el.innerHTML='<button class="opening-body" data-late-death-open><span class="zero-notice-icon">'+icon('campus')+'</span><span><small>校园通知 · 现在</small><strong>校园通</strong><span>校园通已更新，点击查看</span></span></button>';
  }else{
   el.className='report-modal';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');
   el.innerHTML='<section><small>校园通</small><p>校园通已更新</p><button data-late-death-open>点击查看</button></section>';
  }phone.append(el);
 }else if(d.phase==='campus'){screen.innerHTML=campusPageMarkup(true);screen.querySelectorAll('button').forEach(b=>{b.disabled=true;b.hidden=true})}
 else if(d.phase==='black')screen.innerHTML='<section class="report-blackout"></section>';
 else screen.innerHTML='<section class="zero-death"><p>'+(isNightClearance(d.reason)?'你已被学生会清理。':'你已被请离学校。')+'</p><button class="secondary" data-action="zero-menu">返回主页</button></section>';
 persist();zeroChrome();
}
function lateDeathOpen(){const d=lateDeath();if(d?.phase!=='notice')return false;d.phase='campus';d.readyAt=Date.now()+2000;renderLateDeath();return true}
function lateDeathAdvance(){const d=lateDeath();if(d?.phase!=='campus'||Date.now()<d.readyAt)return false;d.phase='black';d.blackUntil=Date.now()+700;renderLateDeath();return true}
function lateDeathTick(){const d=lateDeath();if(window.mobileLaunch||d?.phase!=='black'||Date.now()<d.blackUntil)return;if(!d.counted){d.counted=true;state.game.deaths=(state.game.deaths||0)+1}d.phase='dead';renderLateDeath()}
window.addEventListener('click',e=>{if(!lateDeathLocked())return;e.preventDefault();e.stopImmediatePropagation();if(e.target.closest('[data-late-death-open]'))lateDeathOpen();else if(e.target.closest('#screen'))lateDeathAdvance()},true);
window.addEventListener('keydown',e=>{if(lateDeathLocked()){e.preventDefault();e.stopImmediatePropagation()}},true);
const lateDeathBaseLock=zeroLock;zeroLock=function(){return (!lateDeathInternal&&lateDeathLocked())||lateDeathBaseLock()};
const lateDeathBaseZeroDeath=zeroDeath;zeroDeath=function(...args){if(state.story.noodleEvening&&state.system.date===DAY_ONE_REPORT_DATE)return beginLateDeath(state.game.survivalEnding||'left');return lateDeathBaseZeroDeath(...args)};
surveyFail=function(){const q=survey();if(!q||q.phase==='dead'||q.phase.startsWith('death'))return;q.failed=true;beginLateDeath('questionnaire')};
reportTimeout=function(){const r=dayReport();if(!r||r.submittedAt||r.phase==='dead'||r.phase.startsWith('death'))return;r.expired=true;beginLateDeath('report-timeout')};
const lateDeathBaseResume=resumeStoryScene;resumeStoryScene=function(snapshot){if(!snapshot?.story?.lateDayDeath)return lateDeathBaseResume(snapshot);if(lateDeath().phase==='notice')lateDeathCall(home);renderLateDeath()};
const lateDeathBaseCleanup=cleanupSceneResume;cleanupSceneResume=function(){lateDeathBaseCleanup();document.querySelector('#late-death-notice')?.remove();document.querySelector('#phone').classList.remove('late-death-active')};
const lateDeathBaseMenu=zeroMenu;zeroMenu=function(...args){document.querySelector('#late-death-notice')?.remove();document.querySelector('#phone').classList.remove('late-death-active');return lateDeathBaseMenu(...args)};
setInterval(lateDeathTick,100);
if(lateDeath()&&!window.mobileLaunch)renderLateDeath();
