/* Page navigation stays inside each screen, separate from browser controls. */
const phoneNavStyle=document.createElement('style');
phoneNavStyle.textContent=`
#homebar{display:none!important}
#dock .app-icon.home-soft{background:#e1c7d6;color:#704b63;border:1px solid #ead7e2;box-shadow:inset 0 1px 0 #ffffff20,0 3px 8px #130f181f}
#dock .app-icon.home-soft svg{stroke-width:1.5}
#screen.phone-back-locked .page-head button[aria-label^="返回"],#screen.phone-back-locked .chat-head button[aria-label^="返回"],#screen.phone-back-locked [data-page-back]{display:none!important}
#screen .phone-page-back-head{display:flex;align-items:center;margin:0 0 12px;padding:0;background:transparent}
#screen [data-page-back]{flex-shrink:0}
`;
document.head.append(phoneNavStyle);
function phonePageBackLocked(){
 return !['game-menu','nodes'].includes(view)&&((zeroLock()&&!['delivery-detail','logistics'].includes(view))||(typeof midnightRulesReading==='function'&&midnightRulesReading())||['midnight-sleep','day2-midnight','day3-morning','day3-sleep'].includes(view)||!!screen.querySelector('.zero-scene,.ending-scene,.rd-cg,.vn-dialogue,.fa-time-transition'));
}
function refreshPhoneBack(){
 const locked=phonePageBackLocked();screen.classList.toggle('phone-back-locked',locked);
 // Report forms already provide their own return-to-home control.
 const reportPage=screen.querySelector('.report-page');
 if(reportPage){reportPage.querySelector('.phone-page-back-head')?.remove();return}
 if(locked||window.mobileLaunch||['home','game-menu','nodes'].includes(view))return;
 // Keep existing parent-specific actions; only fill screens without a return control.
 if(screen.querySelector('button[aria-label^="返回"],[data-page-back]'))return;
 const page=screen.firstElementChild;if(!page)return;
 const button=document.createElement('button');button.type='button';button.className='icon-button';button.dataset.action='page-back';button.dataset.pageBack='';button.setAttribute('aria-label','返回');button.innerHTML=icon('back');
 const header=page.querySelector('.page-head,.chat-head,.reason-head');
 if(header)header.prepend(button);
 else{const bar=document.createElement('header');bar.className='page-head phone-page-back-head';bar.append(button);page.prepend(bar)}
}
actions['page-back']=()=>{
 if(phonePageBackLocked())return;
 if(document.querySelector('#overlay .sheet'))return closeSheet();
 if(view==='chat'||view.startsWith('message-'))chatList();else if(view==='post'||view==='rules')forum();else if(view==='orders')shop();else home();
};
function installDockHome(){const phone=document.querySelector('#dock [data-app="phone"]');if(!phone)return;phone.removeAttribute('data-app');phone.dataset.action='phone-desktop';phone.setAttribute('aria-label','主页，返回手机桌面');phone.innerHTML='<span class="app-icon home-soft"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 9-8 9 8M5 10v10h5v-6h4v6h5V10"/></svg></span><span>主页</span>'}
actions['phone-desktop']=()=>home();
const phoneNavStatus=status;status=function(){phoneNavStatus();installDockHome();refreshPhoneBack()};
new MutationObserver(refreshPhoneBack).observe(screen,{childList:true,subtree:true});
installDockHome();refreshPhoneBack();
