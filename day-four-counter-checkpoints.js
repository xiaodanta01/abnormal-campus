const D4_COUNTER_NODES=[['day4-counter-choice','回应林晴离楼的指控'],['day4-vote-reasoning','从委托票数寻找反击']];
for(const [id,title]of D4_COUNTER_NODES)STORY_CHOICES.push({id,title,day:'第四日',chat:id==='day4-counter-choice'?HG_ID:null});
const d4CounterGraphBase=makeDayFourWorldline;makeDayFourWorldline=function(){
 const g=d4CounterGraphBase(),x=g.width-100;
 for(const i of [0,1])g.edges.push({from:'d4-meal-taste-option-'+i,to:'day4-counter-choice'});
 g.nodes.push({id:'day4-counter-choice',title:D4_COUNTER_NODES[0][1],x,y:420,kind:'story',record:'day4-counter-choice',replayable:true});
 D4_COUNTER_SCRIPTS.defend.options.forEach((title,i)=>{const id='day4-counter-choice-option-'+i;g.nodes.push({id,title,x:x+310,y:i===0?270:570,kind:'bubble',record:'day4-counter-choice'});g.edges.push({from:'day4-counter-choice',to:id},{from:id,to:'day4-vote-reasoning'})});
 g.nodes.push({id:'day4-vote-reasoning',title:D4_COUNTER_NODES[1][1],x:x+620,y:420,kind:'story',record:'day4-vote-reasoning',replayable:true});g.width=x+1000;return g;
};
function migrateDayFourPrivateVoteCopy(progress){
 if(!progress.story||progress.story.privateVoteCopyVersion===2)return false;
 const r=progress.story.dayFourADorm?.huang;
 if(r?.script==='image'&&r.index>=3){r.phase='chat';r.index=3;r.remaining=0}
 for(const [chat,rows]of Object.entries(progress.messages||{}))progress.messages[chat]=rows.filter(m=>!['如果你们那有2个学生会，我们这就至少还有8个学生会','所以她最少会有9张票'].includes((m.text||'').replace(/[。！]$/,'')));
 progress.story.privateVoteCopyVersion=2;return true;
}
function migrateDayFourCounterSpeakers(progress){
 const ids=['d4-counter-accuse-0','d4-counter-accuse-1','d4-counter-accuse-2','d4-counter-photo-6'];let changed=false;
 for(const row of progress.messages?.[HG_ID]||[]){
  if(!ids.includes(row.id)||row.hgWho!=='zhengning')continue;
  row.hgWho='gunian';row.name='顾念（303）';row.sender=dayTwoPerson('gunian').avatar;changed=true;
 }
 return changed;
}
storySnapshotMigrations.push(migrateDayFourPrivateVoteCopy,migrateDayFourCounterSpeakers);
const d4CounterCopyChanged=migrateDayFourPrivateVoteCopy(state),d4CounterSpeakersChanged=migrateDayFourCounterSpeakers(state);
if(d4CounterCopyChanged||d4CounterSpeakersChanged)persist();
// A reload resumes the exact effect/cursor; it never replays completed transfers.
if(!d3Paused()&&state.game.day===4){const q=d4Counter();if(q?.phase==='collapse')d4CounterCollapse();else if(['narration','prompt'].includes(q?.phase))d4CounterNarrate();else if(q?.phase==='reasoning'&&view==='day4-vote-reasoning')d4VoteReasonPanel();else if(q?.phase==='vote'){openChat(HG_ID);d4CounterVoteNotice()}else if(q?.phase==='choice')d4CounterDecorate()}
