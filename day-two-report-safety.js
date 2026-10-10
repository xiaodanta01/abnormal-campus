/* Notification-only fallback. The original night runner owns all progression. */
(()=>{
 let ticket=null,restorePending=false,resultWait=null,returning=null;
 const noticeId='day2-report-safety-notice';
 function clear(){ticket=null;document.getElementById(noticeId)?.remove()}
 function eligible(r){return state.game.day===2&&r===state.story.dayTwoReport&&r?.publicationComplete&&r.homeReturned&&!state.game.survivalEnding&&['jiang','yelin','mengshu'].includes(r.groupResult?.target)}
 function progressed(){const phase=state.story.dayTwoNight?.phase;return !!phase&&phase!=='group-wait'}
 function arm(){
  const r=state.story.dayTwoReport;
  if(!eligible(r)||progressed()||r.afterVoteSafety?.shown||r.afterVoteSafety?.finished||ticket?.report===r)return;
  r.afterVoteSafety??={armed:true,shown:false,finished:false};
  ticket={owner:state,report:r,due:Date.now()+5000};persist();
 }
 function resumePublishedResult(restored=false){
  const r=dayReport();
  if(!r?.publicationComplete||r.homeReturned||state.game.survivalEnding||!state.game.personalReports?.[r.date]?.settled){resultWait=null;return}
  if(!resultWait||resultWait.owner!==state||resultWait.report!==r)resultWait={owner:state,report:r,due:Date.now()+5000};
  if(['game-menu','nodes','zero-death'].includes(view))return;
  const readingResult=view==='chat'&&active===DAY_ONE_REPORT_ID;
  const leftResult=view!=='report-input'&&!readingResult;
  if(restored||leftResult||readingResult&&!reportContact()?.unread||Date.now()>=resultWait.due)reportReturnHome();
 }
 function check(){
  if(window.mobileLaunch||storyRestoring)return;
  const restored=restorePending;restorePending=false;
  resumePublishedResult(restored);
  if(restored)arm();
  const t=ticket;if(!t)return;
  if(t.owner!==state||!eligible(t.report)){clear();return}
  if(progressed()){
   t.report.afterVoteSafety.finished=true;clear();persist();return;
  }
  if(document.hidden||['game-menu','nodes','zero-death'].includes(view)||Date.now()<t.due)return;
  const mark=t.report.afterVoteSafety;
  if(mark.finished){clear();return}
  if(mark.shown)return;
  // An already visible group reminder (or the open group itself) needs no duplicate.
  mark.shown=true;persist();
  if(view==='chat'&&active===HG_ID||document.getElementById('hg-notification'))return;
  const contact=hgContact();if(!contact)return;
  const el=document.createElement('div');el.id=noticeId;el.className='opening-message';el.dataset.ringtonePlayed='true';
  el.innerHTML='<button class="opening-body"><span>'+avatar(contact.avatar)+'</span><span><small>讯息 · '+esc(state.system.time)+'</small><strong>女生B栋临时互助群</strong><span>你收到一条新消息</span></span></button>';
  el.querySelector('button').onclick=()=>{
   if(state!==t.owner||!eligible(t.report)||progressed()){clear();return}
   mark.acknowledged=true;clear();persist();openChat(HG_ID);
  };
  document.querySelector('#phone').append(el);playNotificationSound('message');
 }
 const back=reportReturnHome;
 reportReturnHome=function(...args){
  const r=dayReport();
  if(!r||r.homeReturned||returning===r||window.mobileLaunch||storyRestoring)return false;
  returning=r;
  try{const result=back(...args);if(result){resultWait=null;arm()}return result}
  finally{returning=null}
 };
 const cleanup=cleanupStoryTimeline;
 cleanupStoryTimeline=function(...args){clear();restorePending=false;resultWait=null;returning=null;return cleanup(...args)};
 const resume=resumeGameSnapshot;
 resumeGameSnapshot=function(...args){const result=resume(...args);if(result!==false){restorePending=true;check()}return result};
 mobileNativeInterval(check,100);
 window.addEventListener('pagehide',()=>{clear();restorePending=false;resultWait=null});
})();
