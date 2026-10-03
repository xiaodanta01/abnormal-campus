/* Reply handle copying and the visible evidence attachment share existing UI. */
messageRenderers['forum-shot']=m=>`<div class="forum-evidence-message"><img src="${esc(m.src)}" alt="论坛截图：也许想法天真表示住在318，并留下讯息号celine07"><small>论坛截图</small></div>`;

function decorateForumHandles(){if(!['post','rules','wall'].includes(view))return;const handles=CONTACT_IDENTIFIERS.map(x=>x.handle);for(const p of screen.querySelectorAll('.forum-reply p,.comment-content p')){if(p.querySelector('[data-forum-handle]'))continue;const walker=document.createTreeWalker(p,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);for(const node of nodes){const pattern=new RegExp('\\b('+handles.join('|')+')\\b','gi');const text=node.nodeValue;let match,last=0,found=false;const fragment=document.createDocumentFragment();while(match=pattern.exec(text)){found=true;fragment.append(document.createTextNode(text.slice(last,match.index)));const span=document.createElement('span');span.className='forum-handle';span.dataset.forumHandle=match[0];span.textContent=match[0];span.tabIndex=0;span.setAttribute('role','button');span.setAttribute('aria-label','长按复制讯息号 '+match[0]);fragment.append(span);last=pattern.lastIndex}if(found){fragment.append(document.createTextNode(text.slice(last)));node.replaceWith(fragment)}}}}
async function copyForumHandle(value){try{await navigator.clipboard.writeText(value);toast(value.toLowerCase()==='celine07'?'已复制 可前往通讯录添加好友':'讯息号已复制')}catch{const input=document.createElement('textarea');input.value=value;input.style.cssText='position:fixed;opacity:0';document.body.append(input);input.select();const done=document.execCommand('copy');input.remove();toast(done?(value.toLowerCase()==='celine07'?'已复制 可前往通讯录添加好友':'讯息号已复制'):'请选中讯息号后复制')}}
let forumHandlePress=null;
function clearForumHandlePress(){clearTimeout(forumHandlePress?.timer);forumHandlePress=null}
document.addEventListener('pointerdown',e=>{const node=e.target.closest('[data-forum-handle]');if(!node)return;clearForumHandlePress();forumHandlePress={x:e.clientX,y:e.clientY,timer:setTimeout(()=>{copyForumHandle(node.dataset.forumHandle);forumHandlePress=null},550)}});
document.addEventListener('pointermove',e=>{if(forumHandlePress&&Math.hypot(e.clientX-forumHandlePress.x,e.clientY-forumHandlePress.y)>10)clearForumHandlePress()});
document.addEventListener('pointerup',clearForumHandlePress);document.addEventListener('pointercancel',clearForumHandlePress);
document.addEventListener('contextmenu',e=>{if(e.target.closest('[data-forum-handle]'))e.preventDefault()});
document.addEventListener('keydown',e=>{const node=e.target.closest('[data-forum-handle]');if(node&&e.key==='Enter')copyForumHandle(node.dataset.forumHandle)});
new MutationObserver(decorateForumHandles).observe(screen,{childList:true,subtree:true});decorateForumHandles();
function migratePickupClue(progress){for(const clue of progress?.story?.freeAction?.clues||[])if(clue.id==='pickup16-record'){clue.title='07:38的取件记录';clue.text='一个订单在早晨07:38完成领取。\n当时宿舍禁令仍然生效，却没有人因此被请离。'}}
migratePickupClue(state);const polishNodes=nodeRecords();for(const node of Object.values(polishNodes))migratePickupClue(node.checkpoint);saveNodes(polishNodes);persist();

if(view==='chat'){refreshMessages();faDecorateChat()}else if(view==='notes')faNotes();
