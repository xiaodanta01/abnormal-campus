/* First-day progression. Local state only; repeated events are idempotent. */
const D=window.DAY_ONE;
const baseDay={home,chatList,openChat,openApp,forum,postDetail,renderMessage,sendMessage,profileSetup};
let readTimer=null,inviteTimer=null,commentObserver=null;
let ruleExpanded=false,replyTarget=null,expandedThreads=new Set();
function newDayState(){return {version:D.version,stage:'creation',started:false,read:false,invited:false,joined:false,inviteDue:null,postLiked:false,postLikes:0,comments:structuredClone(D.comments),route:{view:'home',active:null}}}
function syncPlayerName(){
  if(!state.story?.started)return;
  const first=state.messages.linqing?.find(m=>m.id==='opening');
  if(first)first.text=state.profile.name+'，你看到校园墙上的东西没？';
  const c=state.contacts.find(c=>c.id==='linqing');
  if(c&&state.messages.linqing.length===1)c.preview=first.text;
}
function initializeChapter(keepProfile=true){
  clearTimeout(readTimer);clearTimeout(inviteTimer);commentObserver?.disconnect();
  if(!keepProfile)state.profile=null;
  state={profile:state.profile,accent:state.accent,preferences:structuredClone(state.preferences||{}),story:newDayState(),system:{...C.system,date:D.date,time:D.time}};
  state.game={...structuredClone(C.initialState),day:0,period:'夜间',location:D.location};
  state.contacts=structuredClone(C.contacts);state.messages=structuredClone(C.messages);
  state.forumPosts=structuredClone(C.forumPosts);state.cart={};state.orders=[];
  ruleExpanded=false;replyTarget=null;expandedThreads.clear();
  for(const key of Object.keys(drafts))delete drafts[key];
  document.querySelector('#day-invitation')?.remove();
  persist();
}
function startChapter(){
  if(!state.profile)return;
  if(!state.story.started){state.story.started=true;state.story.stage='message_received';state.contacts.find(c=>c.id==='linqing').unread=1;}
  syncPlayerName();persist();
}
function rememberRoute(){if(!state.story)return;state.story.route={view,active};persist()}
function stopReading(){clearTimeout(readTimer);readTimer=null;commentObserver?.disconnect();commentObserver=null}
function readRules(reason){
  if(!state.story.started||state.story.read)return;
  state.story.read=true;state.story.readReason=reason;state.story.stage='forum_read';state.story.inviteDue=null;
  persist();stopReading();
}
function ruleArticle(detail=false){return `<article class="rule-post"><div class="post-author"><span class="avatar black-avatar" aria-label="纯黑色头像"></span><span><small>${wallDateLabel({date:'2045-09-07',time:'20:37'})}</small></span><b class="rule-pin">置顶</b></div><h2>${detail?esc(D.rulesTitle):`<button data-action="rules">${esc(D.rulesTitle)}</button>`}</h2><p class="rule-body ${ruleExpanded?'expanded':''}">${esc(D.rules)}</p><button class="expand-rule" data-action="expand-rules">${ruleExpanded?'收起全文':'展开全文'}</button><p class="subtle">因空气质量急剧恶化，学校将进行为期四日的新规计划</p><div class="post-foot"><button data-action="like-rule" aria-pressed="${state.story.postLiked}" aria-label="${state.story.postLiked?'取消帖子点赞':'点赞帖子'}">${state.story.postLiked?'♥':'♡'} ${state.story.postLikes}</button><button data-action="rules-comments">${icon('chat')} ${state.story.comments.reduce((n,c)=>n+1+c.replies.length,0)} 条评论</button></div></article>`}
function commentName(c){return c.author==='me'?state.profile.name:c.name}
function commentMarkup(c,parent=null){return `<div class="rule-comment ${parent?'nested-comment':''}" id="comment-${c.id}">${forumAvatar(c.author,commentName(c),c.gender)}<div class="comment-content"><div class="comment-heading"><strong>${esc(commentName(c))}</strong><button data-comment-like="${c.id}" aria-label="${c.liked?'取消点赞':'点赞'}${esc(commentName(c))}的评论" aria-pressed="${!!c.liked}">${c.liked?'♥':'♡'} ${c.likes||0}</button></div><p>${c.replyTo?`<span class="subtle">回复 ${esc(c.replyTo==='me'?state.profile.name:c.replyTo)}：</span>`:''}${esc(c.text)}</p><div class="comment-tools"><small>${esc(wallDateLabel(c))}</small><button data-reply-comment="${c.id}" data-parent="${parent||c.id}">回复</button></div>${!parent&&c.replies.length?`<button class="thread-toggle" data-thread="${c.id}">${expandedThreads.has(c.id)?'收起回复':'展开 '+c.replies.length+' 条回复'}</button>${expandedThreads.has(c.id)?c.replies.map(r=>commentMarkup(r,c.id)).join(''):''}`:''}</div></div>`}
function findComment(id){for(const c of state.story.comments){if(c.id===id)return c;const r=c.replies.find(r=>r.id===id);if(r)return r}return null}
function rulesPage(scrollToComments=false){
  const alreadyHere=view==='rules';
  stopReading();view='rules';active=null;rememberRoute();
  screen.innerHTML=`<section class="app-page forum-page rules-page"><header class="page-head"><button class="icon-button" data-action="forum" aria-label="返回校园墙">${icon('back')}</button><h1>帖子详情</h1></header>${ruleArticle(true)}<section id="rule-comments"><h3 class="reply-title">评论</h3><div id="rule-comment-list">${state.story.comments.map(c=>commentMarkup(c)).join('')}</div></section><form class="rule-comment-form" id="rule-comment-form"><label for="rule-comment-input" id="reply-label">${replyTarget?'回复 '+esc(commentName(findComment(replyTarget.id))):'发表评论'}</label>${replyTarget?'<button type="button" data-action="cancel-reply" class="cancel-reply">取消回复</button>':''}<div><input id="rule-comment-input" placeholder="说说你的想法…" aria-label="评论内容" maxlength="500" required><button class="pill-button" type="submit">发布</button></div></form></section>`;
  document.querySelector('#rule-comment-form').onsubmit=e=>{e.preventDefault();submitRuleComment(document.querySelector('#rule-comment-input').value)};
  const commentInput=document.querySelector('#rule-comment-input');
  commentInput.value=state.story.commentDraft||'';
  commentInput.oninput=()=>{state.story.commentDraft=commentInput.value;persist()};
  if(!alreadyHere)screen.scrollTop=0;
  if(!state.story.read){
    if(!document.hidden)readTimer=setTimeout(()=>{if(view==='rules'&&!document.hidden)readRules('dwell')},D.readingDelay);
    if(typeof IntersectionObserver!=='undefined'){commentObserver=new IntersectionObserver(entries=>{if(view==='rules'&&screen.scrollTop>0&&entries.some(e=>e.isIntersecting))readRules('comments')},{root:screen,threshold:0.15});commentObserver.observe(document.querySelector('#rule-comments h3'))}
  }
  if(scrollToComments){document.querySelector('#rule-comments').scrollIntoView({block:'start'});readRules('comments')}
}
function submitRuleComment(text){
  text=String(text).trim();if(!text||text.length>500||!state.profile)return false;
  const c={id:'player-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),author:'me',text,date:state.system.date,time:state.system.time,likes:0,liked:false,replies:[]};
  if(replyTarget){const p=state.story.comments.find(x=>x.id===replyTarget.parent),target=findComment(replyTarget.id);if(!p||!target)return false;c.replyTo=target.author==='me'?'me':target.name;p.replies.push(c);expandedThreads.add(p.id)}else state.story.comments.push(c);
  replyTarget=null;state.story.commentDraft='';persist();readRules('comment');rulesPage();document.querySelector('#comment-'+c.id)?.scrollIntoView({block:'center'});return true;
}
function toggleRuleLike(){toggleWallLike(state.story,'postLikes','postLiked');readRules('like');if(view==='rules')rulesPage();else forum()}
function toggleCommentLike(id){const c=findComment(id);if(!c)return;c.liked=!c.liked;c.likes=(c.likes||0)+(c.liked?1:-1);persist();readRules('like');const list=document.querySelector('#rule-comment-list');if(list)list.innerHTML=state.story.comments.map(c=>commentMarkup(c)).join('')}

home=function(){stopReading();closeSheet();baseDay.home();const greeting=document.querySelector('.home-greeting');if(greeting)greeting.insertAdjacentHTML('afterend',`<div class="day-location">${D.location}</div>`);const date=document.querySelector('.date-chip');if(date){const [y,m,d]=state.system.date.split('-').map(Number);date.textContent=y+'年'+m+'月'+d+'日';}rememberRoute();showOpeningMessage()};
chatList=function(){stopReading();baseDay.chatList();rememberRoute()};
openChat=function(id){stopReading();if(id==='help2')return;const c=state.contacts.find(c=>c.id===id);if(!c)return;baseDay.openChat(id);if(id==='linqing'){document.querySelector('#opening-message')?.remove();state.story.openingDismissed=true;}if(!state.story.read){if(id==='linqing'&&!state.story.read)state.story.stage='wall_required';const input=document.querySelector('#message-input');input.disabled=true;input.placeholder='先看看林晴提到的校园墙。';input.value='';document.querySelectorAll('#composer button').forEach(b=>b.disabled=true);document.querySelector('#composer').classList.add('story-locked');document.querySelector('#composer').insertAdjacentHTML('beforebegin','<button class="story-guide" data-action="forum">先看看林晴提到的校园墙。 <span>前往 ›</span></button>')}rememberRoute()};
sendMessage=function(id,text){if(!state.story.read)return false;return baseDay.sendMessage(id,text)};
renderMessage=function(m,c){if(m.type==='time')return `<div class="divider">${esc(m.text)}</div>`;return baseDay.renderMessage(m,c)};
openApp=function(id){
  if(!state.profile||!state.story.started)return profileSetup();
  if(!state.story.read&&!['messages','wall','settings'].includes(id)){sheet('先看看校园墙',`<p>林晴提到了校园墙上的一条帖子。</p><button class="primary" data-action="forum">前往校园墙</button><button class="secondary" data-action="close">稍后查看</button>`);return}
  stopReading();baseDay.openApp(id);rememberRoute();
};
forum=function(){stopReading();closeSheet();baseDay.forum();const oldBanner=document.querySelector('.forum-banner');if(oldBanner)oldBanner.remove();if(['全部','校园新规'].includes(forumCategory))document.querySelector('.category-tabs').insertAdjacentHTML('afterend',ruleArticle());rememberRoute()};
postDetail=function(id){stopReading();baseDay.postDetail(id);rememberRoute()};
Object.assign(actions,{home:()=>home(),list:()=>chatList(),forum:()=>forum(),rules:()=>rulesPage(),
  'rules-comments':()=>rulesPage(true),
  'expand-rules':()=>{ruleExpanded=!ruleExpanded;if(ruleExpanded)readRules('expand');if(view==='rules')rulesPage();else forum()},
  'like-rule':toggleRuleLike,'cancel-reply':()=>{replyTarget=null;rulesPage()},
  datetime:()=>sheet('日期与时间',`<div class="setting-row">日期 <span>9月7日</span></div><div class="setting-row">时间 <span>03:31</span></div>`)
});
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  if(b.dataset.commentLike)toggleCommentLike(b.dataset.commentLike);
  if(b.dataset.thread){const id=b.dataset.thread;expandedThreads.has(id)?expandedThreads.delete(id):expandedThreads.add(id);document.querySelector('#rule-comment-list').innerHTML=state.story.comments.map(c=>commentMarkup(c)).join('')}
  if(b.dataset.replyComment){replyTarget={id:b.dataset.replyComment,parent:b.dataset.parent};rulesPage();document.querySelector('#rule-comment-input').focus()}
});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopReading();else if(view==='rules'&&!state.story.read)readTimer=setTimeout(()=>{if(view==='rules'&&!document.hidden)readRules('dwell')},D.readingDelay)});
// Development controls are absent from the normal URL and use a separate save slot.
if(new URLSearchParams(location.search).get('dev')==='1'){
  const dev=document.createElement('details');dev.className='day-dev';dev.innerHTML='<summary>开发测试 · 独立存档</summary><label><input id="reset-profile" type="checkbox">同时清除姓名和头像</label><button id="reset-day">重置剧情进度</button>';
  document.body.append(dev);document.querySelector('#reset-day').onclick=()=>{initializeChapter(!document.querySelector('#reset-profile').checked);home();profileSetup();toast('测试进度已重置')};
}
window.DayOne={profileSaved:()=>{const fresh=!state.story.started;startChapter();if(fresh)home()},getProgress:()=>structuredClone(state.story)};
window.CampusEngine.openApp=id=>openApp(id);window.CampusEngine.openChat=id=>openChat(id);
const updateDaySystem=window.CampusEngine.updateSystem;
window.CampusEngine.updateSystem=patch=>updateDaySystem({...patch,date:D.date,time:state.system.time});
if(state.story&&[1,2].includes(state.story.version)){state.story.version=D.version;state.story.stage=state.story.read?'forum_read':state.story.stage;state.story.invited=false;state.story.inviteDue=null;state.story.joined=false;const oldGroup=state.contacts.find(c=>c.id==='help2');if(oldGroup)state.story.deferredGroup={contact:oldGroup,messages:state.messages.help2||[]};state.contacts=state.contacts.filter(c=>c.id!=='help2');delete state.messages.help2;if(state.story.route?.active==='help2')state.story.route={view:'messages',active:null};persist()}
if(state.story?.version!==D.version){try{if(saved.profile)GameStorage.setItem(STORAGE_KEY+'-before-day1',JSON.stringify(saved))}catch{}initializeChapter()}
else {state.system.date??=D.date;if(!state.story.zero)state.system.time=D.time;syncPlayerName()}
const resume=state.story.route;closeSheet();
if(!state.profile||!state.story.started){home();profileSetup()}
else {startChapter();if(resume?.view==='chat')openChat(resume.active);else if(resume?.view==='rules')rulesPage();else if(resume?.view==='wall')forum();else if(resume?.view==='messages')chatList();else home()}

function showOpeningMessage(){
 if(!state.story?.started||state.story.openingDismissed||!state.contacts.find(c=>c.id==='linqing')?.unread)return;
 let banner=document.querySelector('#opening-message');if(!banner){banner=document.createElement('div');banner.id='opening-message';banner.className='opening-message';banner.setAttribute('role','status');document.querySelector('#phone').append(banner)}
 banner.innerHTML=`<button class="opening-body" data-action="open-linqing">${avatar('linqing')}<span><small>讯息 · 现在</small><strong>林晴</strong><span>${esc(state.profile.name)}，你看到校园墙上的东西没？</span></span></button><button class="opening-close" data-action="dismiss-opening" aria-label="关闭消息通知">×</button>`;
}
actions['open-linqing']=()=>{closeSheet();openChat('linqing')};actions['dismiss-opening']=()=>{state.story.openingDismissed=true;persist();document.querySelector('#opening-message')?.remove()};
