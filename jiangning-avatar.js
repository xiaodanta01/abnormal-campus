/* Dedicated Jiang Ning portrait; other users of student3 remain unchanged. */
C.avatars.push({id:'chat_jiangning',name:'江柠',src:'assets/chat-avatars/chat_jiangning_v1.svg'});
PORTRAIT_CHARACTERS['江柠']='chat_jiangning';
function migrateJiangningAvatar(progress){if(!progress)return;for(const c of progress.contacts||[])if(/^江柠(?:[（(]|$)/.test(c.name||''))c.avatar='chat_jiangning';for(const rows of Object.values(progress.messages||{}))for(const m of rows)if(m.sender!=='me'&&/^江柠(?:[（(]|$)/.test(m.name||''))m.sender='chat_jiangning'}
migrateJiangningAvatar(state);const jiangningNodes=nodeRecords();for(const n of Object.values(jiangningNodes))migrateJiangningAvatar(n.checkpoint);saveNodes(jiangningNodes);
