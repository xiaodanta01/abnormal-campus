/* Cosmetics stay in permanent preferences, outside story snapshots. */
let syncMessageTheme=()=>{};
(()=>{
 const dev=new URLSearchParams(location.search).get('dev')==='1';
 const key='afterclass-message-skin-v1'+(dev?'-dev':'');
 const colors={white:{name:'柔白',value:'#eeedeb'},line:{name:'LINE 绿',value:'#a5e990'},kakao:{name:'Kakao 黄',value:'#f8df59'}};
 let prefs=read(),preview=null;
 function read(){let p={};try{p=JSON.parse(GameStorage.getItem(key))||{}}catch{}return {unlocked:true,theme:p.theme==='paid'?'paid':'default',color:colors[p.color]?p.color:'white'}}
 function save(next){try{GameStorage.setItem(key,JSON.stringify(next));prefs=next;return true}catch{toast('未能保存外观设置，请检查浏览器存储权限');return false}}
 function theme(){return preview||(prefs.unlocked&&prefs.theme==='paid'?'paid':'default')}
 function setTheme(value){if(!['default','paid'].includes(value))return;if(save({...prefs,theme:value})){preview=null;refreshTheme();skinSheet()}}
 function mini(paid){
  const rows=['刚好看到你的消息','一起慢慢聊吧','好呀，收到啦','待会儿见'];
  return '<div class="skin-mini '+(paid?'skin-mini-paid':'skin-mini-default')+'" aria-hidden="true"><small>讯息预览</small><div class="skin-mini-messages">'+rows.map((text,i)=>'<div class="skin-mini-row '+(i>1?'skin-mini-mine ':'')+(paid&&i%2?'skin-mini-continuation':'')+'"><b class="skin-mini-avatar"></b><div><span>'+text+'</span>'+(i>1&&(!paid||i===3)?'<em class="skin-mini-read">已读</em>':'')+'</div></div>').join('')+'</div><div class="skin-mini-input">'+(paid?'<b class="skin-mini-heart">♡</b>':icon('mic'))+'<i></i>'+icon('smile')+icon('plus')+'<b class="skin-mini-send">'+icon('send')+'</b></div></div>';
 }
 function skinSheet(){sheet('讯息皮肤','<p class="skin-caption">换一种心情，读同样的故事。</p><div class="skin-cards">'+['default','paid'].map(t=>{const paid=t==='paid',selected=theme()===t;return '<button type="button" class="skin-card '+(selected?'selected':'')+'" data-message-skin="'+t+'" aria-pressed="'+selected+'">'+mini(paid)+'<span class="skin-card-label"><strong>'+(paid?'小短信':'原版皮肤')+'</strong><small>'+(selected?'使用中':'切换')+'</small></span><span class="skin-card-description">'+(paid?'合并头像 · 细长气泡':'逐条头像 · 原版输入栏')+'</span></button>'}).join('')+'</div>'+(dev?'<div class="skin-dev"><small>开发预览 · 不改变解锁状态</small><button data-skin-preview="default">预览原版</button><button data-skin-preview="paid">预览小短信</button></div>':''));const el=document.querySelector('#overlay .sheet');el.classList.add('message-skin-sheet');el.style.setProperty('--sms-mine',colors[prefs.color].value)}
 const baseSettings=settings;
 settings=function(...args){const result=baseSettings(...args);if(view!=='settings')return result;const row=screen.querySelector('[data-action="appearance"]');if(row){row.outerHTML=settingItem('chat','气泡颜色','appearance')+settingItem('text','讯息皮肤','message-skins',theme()==='paid'?'小短信':'原版皮肤')}return result};
 actions['message-skins']=skinSheet;
 const baseAppearance=appearance;
 appearance=function(){if(theme()!=='paid'){baseAppearance();const title=document.querySelector('#overlay .sheet-header h2');if(title)title.textContent='气泡颜色';return}sheet('气泡颜色','<p>小短信 · 选择你的消息气泡颜色</p><div class="skin-colors">'+Object.entries(colors).map(([id,c])=>'<button data-skin-color="'+id+'" aria-pressed="'+(prefs.color===id)+'"><i style="background:'+c.value+'">'+(prefs.color===id?'✓':'')+'</i><span>'+c.name+'</span></button>').join('')+'</div>'+mini(true));document.querySelector('#overlay .sheet').style.setProperty('--sms-mine',colors[prefs.color].value)};
 actions.appearance=()=>appearance();
 // Add display metadata to the existing renderer, including image/forwarded cards.
 // Never replace its body: profile links, departures, recalls and choices stay intact.
 const baseRender=renderMessage;
 renderMessage=function(m,c){let html=baseRender(m,c);if(['system','time','recalled'].includes(m.type))return html;html=html.replace(/<div class="message(?=[\s"])([^"]*)"/,(_,classes)=>'<div class="message'+classes+'" data-skin-sender="'+esc(JSON.stringify([m.sender||c.avatar,m.name||'']))+'" data-skin-time="'+esc(m.time||'')+'" data-skin-date="'+esc(m.gameDate||m.date||'')+'" data-skin-read="'+(!c.members&&m.sender==='me'&&m.status==='read')+'"');if(c.id==='room408'&&m.id==='zero-invitation-1')html+='<div class="divider message-group-time" data-message-skin-guide>前往设置→讯息皮肤 可以更换气泡/讯息列表样式</div>';return html};
 function same(a,b){return !!(a&&b&&a.matches('.message[data-skin-sender]')&&b.matches('.message[data-skin-sender]')&&a.dataset.skinSender===b.dataset.skinSender&&a.dataset.skinDate===b.dataset.skinDate&&a.dataset.skinTime===b.dataset.skinTime)}
 function decorate(page){for(const row of page.querySelectorAll('.messages>.message[data-skin-sender]')){const continuation=same(row.previousElementSibling,row);row.classList.toggle('sms-continuation',continuation);row.classList.toggle('sms-group-start',!continuation);row.classList.toggle('sms-group-end',!same(row,row.nextElementSibling));row.classList.toggle('sms-named',!!row.querySelector('.sender-name'));if(row.dataset.skinRead==='true'&&!row.querySelector('.sms-read')){const label=document.createElement('small');label.className='sms-read';label.textContent='已读';row.querySelector('.message-main')?.append(label)}}}
 const originalAppIcons=new WeakMap();
 const paidAppIcon='<svg class="sms-app-art" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h12a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H9l-6 3V7a3 3 0 0 1 3-3Z M12 15l-3.2-3.1a2.2 2.2 0 0 1 3.2-3 2.2 2.2 0 0 1 3.2 3L12 15Z"/></svg>';
 function syncAppIcons(){for(const tile of document.querySelectorAll('[data-app="messages"]>.app-icon')){const paid=theme()==='paid';if(tile.classList.contains('sms-app-icon')===paid)continue;const art=tile.querySelector('svg');if(!art)continue;if(paid){originalAppIcons.set(tile,art.outerHTML);art.outerHTML=paidAppIcon}else{const original=originalAppIcons.get(tile);if(original)art.outerHTML=original;originalAppIcons.delete(tile)}tile.classList.toggle('sms-app-icon',paid)}}
 let syncing=false,syncFrame=null;
 const observer=new MutationObserver(scheduleSync);
 function scheduleSync(){if(syncFrame!==null)return;syncFrame=requestAnimationFrame(()=>{syncFrame=null;sync()})}
 function layoutRoots(){return [...screen.querySelectorAll('.app-page[data-message-page="messages"],.app-page[data-message-page="message-contacts"],.chat-page,#contact-list,.chat-page .messages')];}
 function resetHorizontalLayout(){
  const roots=layoutRoots();if(!roots.length)return;
  // Only messaging containers: do not clear CG transforms or authored bubble styles.
  for(const el of roots){for(const prop of ['width','min-width','max-width','transform','translate','left','right'])el.style.removeProperty(prop);el.scrollLeft=0}
  screen.scrollLeft=0;
 }
 function refreshTheme(){
  // Keep the live DOM, selected tab, search, choices and listeners. Calling openChat
  // here would mark messages read and can re-enter story hooks.
  const positions=[screen,...layoutRoots()].map(el=>[el,el.scrollTop]);
  sync();
  for(const [el,top] of positions)if(el.isConnected)el.scrollTop=top;
  // Reconcile after the sheet/DOM changes and native WebView layout on the next frame.
  scheduleSync();
 }
 function sync(){if(syncing)return;syncing=true;observer.disconnect();try{syncNow();resetHorizontalLayout()}finally{observer.observe(screen,{childList:true,subtree:true});syncing=false}}
 function syncNow(){prefs=read();syncAppIcons();document.documentElement.style.setProperty('--accent',state.accent);const page=screen.querySelector('.chat-page'),personalMoments=screen.querySelector('.lin-moments'),social=['messages','message-contacts','message-moments','moment-compose'].includes(view),list=social?screen.querySelector('.app-page'):personalMoments;
  const messages=page?.querySelector('.messages'),bottom=messages&&messages.scrollHeight-messages.clientHeight-messages.scrollTop<3;
  const edge=messages?.getBoundingClientRect().top,anchor=messages&&[...messages.children].find(el=>el.getBoundingClientRect().bottom>edge),offset=anchor?.getBoundingClientRect().top;
  for(const root of [page,list].filter(Boolean)){root.dataset.messageTheme=theme();root.style.setProperty('--sms-mine',colors[prefs.color].value)}
  if(list)list.dataset.messagePage=personalMoments?'personal-moments':view;
  document.querySelector('#phone')?.classList.toggle('sms-shell',theme()==='paid'&&!!(page||list));
  const tabs=document.querySelector('#message-bottom');if(tabs)tabs.dataset.messageTheme=social?theme():'default';
  // Visible, non-interactive composer; authored choices still insert before it.
  const form=page?.querySelector('#composer');if(form){form.hidden=false;form.setAttribute('inert','');form.setAttribute('aria-disabled','true');form.removeAttribute('aria-hidden')}
  if(page)decorate(page);
  if(messages){if(bottom)messages.scrollTop=messages.scrollHeight;else if(anchor)messages.scrollTop+=anchor.getBoundingClientRect().top-offset}
 }
 // Run before existing scroll positioning and after navigation, never reopen a chat.
 const baseScroll=scrollMessages;scrollMessages=function(...args){sync();return baseScroll(...args)};
 const baseOpen=openChat;openChat=function(...args){const result=baseOpen(...args);sync();return result};
 const baseList=chatList;chatList=function(...args){const result=baseList(...args);sync();return result};
 syncMessageTheme=sync;
 observer.observe(screen,{childList:true,subtree:true});
 const dock=document.querySelector("#dock");if(dock)new MutationObserver(syncAppIcons).observe(dock,{childList:true,subtree:true});
 document.addEventListener('click',e=>{const skin=e.target.closest('[data-message-skin]'),color=e.target.closest('[data-skin-color]'),test=e.target.closest('[data-skin-preview]');if(skin)setTheme(skin.dataset.messageSkin);if(color&&colors[color.dataset.skinColor]&&(prefs.unlocked||dev)){if(save({...prefs,color:color.dataset.skinColor})){refreshTheme();appearance()}}if(test&&dev){preview=test.dataset.skinPreview;refreshTheme();skinSheet()}});
 window.addEventListener('storage',e=>{if(e.key===key){prefs=read();refreshTheme()}});
 if(dev)window.MessageThemePreview={set(value){if(!['default','paid'].includes(value))return;preview=value;sync()},reset(){preview=null;sync()}};
 sync();
})();
