/* Notification assets and a fixed, chat-only mutual-aid group portrait. */
C.avatars.push({id:'chat_help_group',name:'女生B栋临时互助群',src:'assets/chat-avatars/chat_help_group_v1.jpg'});
function syncHelpGroupPortrait(progress){let changed=false;for(const c of progress?.contacts||[]){if((c.id===HG_ID||c.id==='room408')&&c.avatar!=='chat_help_group'){c.avatar='chat_help_group';changed=true}}return changed}
const helpPortraitPersist=persist;persist=function(...args){syncHelpGroupPortrait(state);return helpPortraitPersist(...args)};
syncHelpGroupPortrait(state);{const records=nodeRecords();let changed=false;for(const record of Object.values(records))changed=syncHelpGroupPortrait(record.checkpoint)||changed;if(changed)saveNodes(records)}
try{const progress=JSON.parse(GameStorage.getItem(GAME_CONTINUE_KEY)||'null');if(syncHelpGroupPortrait(progress))GameStorage.setItem(GAME_CONTINUE_KEY,JSON.stringify(progress))}catch{}
// Message banners already use the shared observer. Observe only additional system notices here.
new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes){if(node.nodeType!==1)continue;const selector='#identity-reward,#notebook-collected,.sheet';const notices=[...(node.matches(selector)?[node]:[]),...node.querySelectorAll(selector)];for(const el of notices){if(el.dataset.ringtonePlayed)continue;if(el.matches('.sheet')&&!/解锁|已开放|身份确认|物品已放入|领取成功/.test(el.getAttribute('aria-label')||''))continue;el.dataset.ringtonePlayed='true';playNotificationSound('system',el)}}}).observe(document.querySelector('#phone'),{childList:true,subtree:true});
persist();if(view==='chat')openChat(active);else if(view==='messages')chatList();
