/* Keep the report return action; the former demo boundary no longer interrupts play. */
function reportReturnHome(){const r=dayReport(),result=state.game.personalReports?.[r?.date];if(!r?.publicationComplete||!result?.settled||state.game.survivalEnding)return false;r.homeReturned=true;reportSendResultMessages();document.querySelector('#report-notification')?.remove();home();state.story.route={view:'home',active:null};persist();if(hgContact()?.unread)hgNotice('group');return true}
window.addEventListener('click',e=>{
 if(e.target.closest('[data-report-home]')){
  e.preventDefault();
  e.stopImmediatePropagation();
  reportReturnHome();
 }
},true);
