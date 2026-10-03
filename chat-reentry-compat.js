/* Complete chat navigation synchronously; older Android layout engines may defer observers. */
(()=>{
 const baseOpen=openChat;
 openChat=function(id,...args){
  const result=baseOpen(id,...args);
  if(view==='chat'&&active===id&&screen.querySelector('.chat-page')){
   screen.scrollTop=0;
   syncMessageTabs();
   refreshPhoneBack();
  }
  return result;
 };
})();
