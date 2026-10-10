/* One-time follow-up to reading the public special-role notice. */
const ROLE_DISCUSSION={member:'chengxin',name:'程昕（602）',avatar:'npc-chengxin',image:'assets/npc-chengxin.jpg?v=20261011-rc4',cgImage:null,lines:[
 ['chengxin','有特殊身份的不要过早暴露自己'],
 ['chengxin','可以找信得过的人私聊'],
 ['wen','你这样很可疑啊'],
 ['wen','现在哪有什么信得过的人'],
 ['chengxin','我只是在提建议好吗？'],
 ['chengxin','少在这带节奏'],
 ['shen','好了好了，别吵了']
]};
C.avatars.push({id:ROLE_DISCUSSION.avatar,name:'程昕',src:ROLE_DISCUSSION.image});
HG_PEOPLE.chengxin={name:ROLE_DISCUSSION.name,avatar:ROLE_DISCUSSION.avatar};
function rd(){return state.story.roleDiscussion??={phase:'idle',readAt:null,due:0,step:0,banner:false}}
function rdRoster(){const c=hgContact();if(!c?.members||c.members.includes('chengxin'))return;const index=c.members.findIndex(id=>id.startsWith('stranger-'));if(index>=0){c.members[index]='chengxin';persist()}}
const rdBase={postDetail,openChat,renderMessage,sendMessage,zeroLock,initializeChapter,retryStoryChoice};
postDetail=function(id){const result=rdBase.postDetail(id);if(id===SPECIAL_NOTICE.id&&view==='post'&&active===id&&rd().phase==='idle'){rd().phase='reading';rd().readAt=Date.now();rd().due=rd().readAt+10000;persist()}return result};
function rdNotify(){document.querySelector('#role-discussion-notification')?.remove();if(!rd().banner)return;const el=document.createElement('div');el.id='role-discussion-notification';el.className='opening-message';el.innerHTML=`<button class="opening-body" data-action="rd-open"><span>${avatar('shen')}</span><span><small>讯息 · 新消息</small><strong>女生B栋临时互助群</strong><span>${esc(hgContact()?.preview||'程昕（602）：转发了【身份说明·特殊身份】')}</span></span></button><button class="opening-close" data-action="rd-dismiss" aria-label="关闭消息通知">×</button>`;document.querySelector('#phone').append(el)}
function rdInvite(){const a=rd(),c=hgContact();if(a.phase!=='reading'||!c)return;rdRoster();a.phase='invited';a.banner=true;const rows=state.messages[HG_ID]??=[];if(!rows.some(m=>m.id==='rd-forward')){if(rows.at(-1)?.time!=='11:49')rows.push({id:'rd-time',type:'time',text:'11:49',time:'11:49'});rows.push({id:'rd-forward',type:'text',hgWho:'chengxin',sender:ROLE_DISCUSSION.avatar,name:ROLE_DISCUSSION.name,text:'【身份说明·特殊身份】\n当前存活人数：57人',time:'11:49',roleForward:true});c.preview=ROLE_DISCUSSION.name+'：转发了【身份说明·特殊身份】';c.time='11:49';c.unread=(c.unread||0)+1}persist();status();if(view==='messages')chatList();rdNotify()}
function rdComposer(){if(view!=='chat'||active!==HG_ID||!['running','ending'].includes(rd().phase))return;const input=screen.querySelector('#message-input');if(input){input.disabled=true;input.placeholder='等待群聊消息…'}screen.querySelectorAll('#composer button').forEach(b=>b.disabled=true)}
openChat=function(id){const result=rdBase.openChat(id);if(view!=='chat'||active!==HG_ID||id!==HG_ID)return result;const a=rd();if(a.banner){a.banner=false;rdNotify();persist()}if(a.phase==='invited'){a.phase='running';a.banner=false;a.due=Date.now()+messageSendDelay();zeroClock('11:49');rdNotify();persist()}rdComposer();return result};
sendMessage=function(id,text){if(id===HG_ID&&['running','ending'].includes(rd().phase))return false;return rdBase.sendMessage(id,text)};
renderMessage=function(m,c){if(!m.roleForward)return rdBase.renderMessage(m,c);return `<div class="message">${avatar(ROLE_DISCUSSION.avatar)}<div class="message-main"><div class="sender-name">${esc(ROLE_DISCUSSION.name)}</div><button class="bubble" data-post="${SPECIAL_NOTICE.id}" style="text-align:left"><small class="subtle">校园墙 · 转发帖子</small><strong style="display:block;margin:9px 0">【身份说明·特殊身份】</strong><span>当前存活人数：57人</span></button><div class="message-meta">11:49</div></div></div>`};
function rdSend(){const a=rd(),i=a.step,[who,text]=ROLE_DISCUSSION.lines[i],person=HG_PEOPLE[who],rows=state.messages[HG_ID];if(!rows.some(m=>m.id==='rd-line-'+i))rows.push({id:'rd-line-'+i,type:'text',sender:person.avatar,hgWho:who,name:person.name,text,time:'11:49'});const c=hgContact();c.preview=person.name+'：'+text;c.time='11:49';a.step++;a.due=Date.now()+(a.step===ROLE_DISCUSSION.lines.length?messageSendDelay():messageSendDelay());if(a.step===ROLE_DISCUSSION.lines.length)a.phase='ending';const inside=view==='chat'&&active===HG_ID;if(!inside){c.unread=(c.unread||0)+1;if(a.phase==='ending')a.waitingForFinalRead=true}persist();if(inside)openChat(HG_ID);else{status();if(view==='messages')chatList()}}
zeroLock=function(){return !['game-menu','nodes'].includes(view)&&rd().phase==='cg'||rdBase.zeroLock()};
function rdScene(transition=true){const previous=transition?captureSceneSnapshot(screen):null;if(previous)previous.messageScroll=screen.querySelector('.messages')?.scrollTop||0;rd().phase='cg';rd().banner=false;rdNotify();closeSheet();view='role-discussion-cg';active=null;rememberRoute();screen.innerHTML=`<section class="rd-cg" aria-label="待续场景">${ROLE_DISCUSSION.cgImage?`<img src="${esc(ROLE_DISCUSSION.cgImage)}" alt="场景">`:'<div class="rd-cg-placeholder"><span>场景待补充</span></div>'}</section>`;zeroChrome();persist();if(previous)zeroDissolve(previous)}
function rdTick(){if(!state.story.started||document.hidden||['game-menu','nodes'].includes(view)||zeroLock())return;const a=rd(),now=Date.now();if(a.phase==='reading'&&now>=a.due){rdInvite();return}if(a.phase==='running'&&now>=a.due)rdSend();else if(a.phase==='ending'){if((hgContact()?.unread||0)>0){if(!a.waitingForFinalRead){a.waitingForFinalRead=true;persist()}return}if(a.waitingForFinalRead){a.waitingForFinalRead=false;a.due=now+messageSendDelay();persist()}if(now>=a.due)rdScene()}}
Object.assign(actions,{'rd-open':()=>openChat(HG_ID),'rd-dismiss':()=>{rd().banner=false;rdNotify();persist()}});
initializeChapter=function(...args){document.querySelector('#role-discussion-notification')?.remove();return rdBase.initializeChapter(...args)};

const rdStyle=document.createElement('style');rdStyle.textContent='.rd-cg{position:absolute;inset:0;background:#17191e;overflow:hidden}.rd-cg>img{width:100%;height:100%;object-fit:cover}.rd-cg-placeholder{height:100%;display:grid;place-items:center;background:linear-gradient(180deg,#242630,#121318);color:#8e8b99;font-size:13px;letter-spacing:2px}';document.head.append(rdStyle);
rdRoster();if(rd().phase==='cg'&&!['game-menu','nodes'].includes(view))rdScene(false);else if(rd().banner)rdNotify();setInterval(rdTick,250);
for(const rows of Object.values(state.messages||{}))for(const m of rows||[])if(m.text)m.text=m.text.replaceAll('当前存活：129人','当前存活人数：57人').replaceAll('当前存活：57人','当前存活人数：57人');
const rdInviteCurrent=rdInvite;
function ensureRdPopulationReply(progress=state){const rows=progress.messages?.[HG_ID]||[],forward=rows.findIndex(m=>m.id==='rd-forward');if(forward<0||rows.some(m=>m.id==='rd-zhao-population'))return false;const person=HG_PEOPLE.zhao;rows.splice(forward+1,0,{id:'rd-zhao-population',type:'text',hgWho:'zhao',sender:person.avatar,name:person.name,text:'什么？？我们这栋楼几乎占了一大半人数',time:'11:49',gameDate:progress.system?.date,status:'read'});return true}
rdInvite=function(){rdInviteCurrent();const changed=ensureRdPopulationReply();for(const m of state.messages[HG_ID]||[])if(m.id==='rd-forward')m.text='【身份说明·特殊身份】\n当前存活人数：57人';if(changed)hgContact().preview='赵诗雨（214）：什么？？我们这栋楼几乎占了一大半人数';persist()};
const rdRenderCurrent=renderMessage;
renderMessage=function(m,c){return rdRenderCurrent(m,c).replaceAll('当前存活：129人','当前存活人数：57人').replaceAll('当前存活：57人','当前存活人数：57人')};
if(ensureRdPopulationReply())persist();
