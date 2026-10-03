/* A player's first line in each reply turn waits for an explicit click. */
function confirmStoryReply(token){
 (state.story.replyConfirmations??={})[token]=true;
 if(state.story.pendingPlayerReply?.token===token){delete state.story.pendingPlayerReply;screen.querySelector('[data-story-reply-box]')?.remove()}
}
function storyReplyGate(chat,text,token,runner,forceClick=false){
 if(!state.story)return false;
 const approved=state.story.replyConfirmations??={};
 if(approved[token]){confirmStoryReply(token);return false}
 const rows=state.messages[chat]||[];let last;
 for(let i=rows.length-1;i>=0;i--)if(rows[i].sender&&!['system','recalled','time'].includes(rows[i].type)){last=rows[i];break}
 if(last?.sender==='me'&&!forceClick){confirmStoryReply(token);return false}
 const pending=state.story.pendingPlayerReply;
 if(!pending){state.story.pendingPlayerReply={chat,text,token,runner};persist();renderStoryReply()}
 else if(pending.token===token)renderStoryReply();
 return true;
}
function renderStoryReply(){
 if(hospitalPhoneMode()){screen.querySelector('[data-story-reply-box]')?.remove();return}
 const p=state.story?.pendingPlayerReply,old=screen.querySelector('[data-story-reply-box]');
 if(p&&state.story.replyConfirmations?.[p.token]){delete state.story.pendingPlayerReply;old?.remove();persist();return}
 if(!p||view!=='chat'||active!==p.chat){old?.remove();return}
 if(old?.dataset.storyReplyBox===p.token)return;
 old?.remove();const composer=screen.querySelector('#composer');if(!composer)return;
 composer.querySelectorAll('button,textarea').forEach(el=>el.disabled=true);
 composer.insertAdjacentHTML('beforebegin','<div class="zero-choices" data-story-reply-box="'+esc(p.token)+'"><button type="button" data-story-reply="'+esc(p.token)+'">'+esc(p.text)+'</button></div>');
 scrollMessages();
}
document.addEventListener('click',event=>{
 const button=event.target.closest('[data-story-reply]'),p=state.story?.pendingPlayerReply;
 if(!button||!p||p.token!==button.dataset.storyReply||view!=='chat'||active!==p.chat)return;
 event.preventDefault();confirmStoryReply(p.token);
 screen.querySelector('[data-story-reply-box]')?.remove();persist();
 const resume={d3ProbeTick:()=>d3ProbeTick(),d3DefenseTick:()=>d3DefenseTick(),d3ZhouTick:()=>d3ZhouTick(),zeroStep:()=>zeroStep(),faTick:()=>faTick(),recordDiscussionTick:()=>recordDiscussionTick(),postEveningTick:()=>postEveningTick(),mengErrorTick:()=>mengErrorTick(),leakAdvance:()=>leakAdvance(leakState()),dayTwoAdvance:()=>dayTwoAdvance(dayTwoState())}[p.runner];
 if(resume)resume();
});
new MutationObserver(renderStoryReply).observe(screen,{childList:true,subtree:true});
