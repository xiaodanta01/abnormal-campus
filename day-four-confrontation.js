/* Authored Day 4 confrontation; stops at the final reflection. */
const D4_CONFRONT_ROWS=[['me','@沈可欣'],['me','前天你是和谁一起坐的电梯？'],['shen','什么意思？'],['shen','我一直都没有离开过宿舍房间'],['me','你没坐电梯怎么会知道电梯楼层被打乱了？'],['shen','梁音告诉我的'],['shen','她当时私聊我，我才知道电梯出了问题'],['shen','我根本没去取件过'],['shen','物流记录：没有购买记录，也没有待取包裹','image']];
const D4_CONFRONT_NARRATION=[
 '糟了。',
 '你没想到沈可欣早就为这一步做好了准备。',
 '一张和宋妍几乎相同的取件记录截图，足以让所有人相信她那天下午根本没有去过取件平台。',
 '就算你认定图片是伪造的，现在也拿不出任何证据。',
 '更麻烦的是，她偏偏把梁音搬了出来。',
 '一个已经被请离、再也无法开口的人，当然不可能站出来否认她的说法。',
 '现在能够证明沈可欣坐过电梯的，只剩下许蓁蓁——可许蓁蓁想要活下去，就绝不可能在这个时候站出来指认沈可欣。',
 '一时间，你竟找不到任何办法拆穿她。'
];
function d4Confront(){return state.story.dayFourConfrontation}
function d4ConfrontInside(){return view==='chat'&&active===HG_ID}
function d4ConfrontStart(){const q=d4Confront();if(state.game.day!==4||q?.phase!=='unlocked'||!d4ConfrontInside())return;Object.assign(q,{phase:'chat',index:0,remaining:messageSendDelay(),cgIndex:0});state.system.time='10:48';state.game.period='上午';status();persist()}
function d4ConfrontCG(){const q=d4Confront();if(!q||!['cg','hold'].includes(q.phase))return;closeSheet();stopReading();document.querySelector('#hg-notification')?.remove();document.querySelector('#d3-reason-drawer')?.remove();view='day4-confrontation-cg';active=null;rememberRoute();zeroChrome();
 const shake=!q.shaken;q.shaken=true;
 screen.innerHTML='<section class="rd-cg'+(shake?' d4-confront-shake':'')+'"><img src="assets/bed-phone-day-screen-off.jpg?v=20261011-rc5" alt="宿舍床上握着手机"></section>';
 const host=screen.firstElementChild;if(q.phase==='hold')cgChoiceDialogue(host,D4_CONFRONT_NARRATION[D4_CONFRONT_NARRATION.length-1]);else CGDialogue.present(host,D4_CONFRONT_NARRATION,{index:q.cgIndex,onIndex:i=>{if(d4Confront()===q){q.cgIndex=i;persist()}},onComplete:()=>{if(d4Confront()!==q||q.phase!=='cg')return;q.phase='done';persist();d4AfterStart()}});persist();
}
let d4ConfrontLastTick=0,d4ConfrontLastSave=0;
function d4ConfrontTick(){
 if(d3Paused()||state.game.day!==4||!d4ConfrontInside()&&!window.StoryResumeRecovery?.allow('d4-confront')||document.querySelector('#overlay .sheet')){d4ConfrontLastTick=0;return}
 d4ConfrontStart();const q=d4Confront();if(q?.phase!=='chat')return;const now=Date.now(),elapsed=d4ConfrontLastTick?Math.min(500,now-d4ConfrontLastTick):0;d4ConfrontLastTick=now;q.remaining=Math.max(0,q.remaining-elapsed);
 if(q.remaining){if(now-d4ConfrontLastSave>1000){d4ConfrontLastSave=now;persist()}return}
 const row=D4_CONFRONT_ROWS[q.index];if(!row){q.phase='cg';persist();d4ConfrontCG();return}
 const [who,text,type='text']=row,index=q.index;
 if(who==='me'&&storyReplyGate(HG_ID,text,'day4-confront:'+index,'d4ConfrontTick',index===0))return;
 const rows=state.messages[HG_ID]??=[],id='day4-confront-'+index,person=dayTwoPerson(who);
 const added=!rows.some(m=>m.id===id);if(added)rows.push({id,type,sender:who==='me'?'me':person.avatar,name:who==='me'?state.profile.name:person.name,hgWho:who,text,time:'10:48',gameDate:state.system.date,status:'read',...(type==='image'?{src:'assets/day4-shen-logistics.svg?v=20261011-rc5'}:{})});
 q.index++;q.remaining=messageSendDelay();const c=hgContact();if(c){c.preview=type==='image'?'[图片]':text;c.time='10:48';if(added&&!d4ConfrontInside())c.unread=(c.unread||0)+1}persist();if(d4ConfrontInside())openChat(HG_ID);else hgNotice('group');
}
const d4ConfrontChatBase=openChat;openChat=function(...args){const result=d4ConfrontChatBase(...args);d4ConfrontStart();if(d4ConfrontInside()&&d4Confront()?.phase==='chat'){renderStoryReply();scrollMessages()}return result};
const d4ConfrontResumeBase=resumeStoryScene;resumeStoryScene=function(snapshot,...args){if(snapshot?.game?.day===4&&['cg','hold'].includes(snapshot.story?.dayFourConfrontation?.phase)){d4ConfrontCG();return}return d4ConfrontResumeBase(snapshot,...args)};
const d4ConfrontCleanupBase=cleanupSceneResume;cleanupSceneResume=function(...args){d4ConfrontLastTick=0;return d4ConfrontCleanupBase(...args)};
setInterval(d4ConfrontTick,100);
if(!d3Paused()&&view==='day4-confrontation-cg')d4ConfrontCG();
