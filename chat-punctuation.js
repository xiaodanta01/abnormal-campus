/* Chat-only punctuation convention: keep all other punctuation and non-chat prose. */
function cleanChatText(value){return typeof value==='string'?value.replaceAll('。','').replaceAll('我有拖延症吗，谢谢','我有拖延症…'):value}
function normalizeChatProgress(progress){if(!progress)return;for(const rows of Object.values(progress.messages||{}))for(const m of rows)if(typeof m.text==='string'&&!m.preservePunctuation)m.text=cleanChatText(m.text);for(const c of progress.contacts||[])c.preview=cleanChatText(c.preview)}
const punctuationPersist=persist;persist=function(...args){normalizeChatProgress(state);return punctuationPersist(...args)};
const punctuationRender=renderMessage;renderMessage=function(m,c){const html=punctuationRender({...m,text:m.preservePunctuation?m.text:cleanChatText(m.text)},c);return m.preservePunctuation?html.replace(/class="([^"]*\bbubble\b[^"]*)"/g,'data-preserve-punctuation class="$1"'):html};
const punctuationRow=contactRow;contactRow=function(c){return punctuationRow({...c,preview:cleanChatText(c.preview)})};
const punctuationSend=sendMessage;sendMessage=function(id,text){return punctuationSend(id,cleanChatText(text))};
const punctuationRecord=recordStoryChoice;recordStoryChoice=function(id,checkpoint=state){normalizeChatProgress(checkpoint);return punctuationRecord(id,checkpoint)};
function cleanChatDOM(root){if(!root)return;const walk=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;while(node=walk.nextNode())if(!node.parentElement?.closest('[data-preserve-punctuation]')&&node.nodeValue.includes('。'))node.nodeValue=cleanChatText(node.nodeValue)}
function refreshChatPunctuation(){if(view==='chat'){for(const el of screen.querySelectorAll('.bubble,.system-msg,.zero-choices,.contact-preview'))cleanChatDOM(el)}for(const id of ['opening-message','jx-notification','hg-notification','role-discussion-notification','fa-group-notice','first-death-message'])cleanChatDOM(document.getElementById(id));if(['invitation','warning','where'].includes(state.story?.zero?.banner))cleanChatDOM(document.querySelector('#zero-notification'))}
normalizeChatProgress(state);
{const records=nodeRecords();for(const record of Object.values(records))normalizeChatProgress(record.checkpoint);saveNodes(records)}
persist();refreshChatPunctuation();
new MutationObserver(refreshChatPunctuation).observe(document.querySelector('#phone'),{childList:true,subtree:true,characterData:true});
