/* Relative game-clock beats. Real delivery delays and story outcomes are unchanged. */
const FA_CHAT_OFFSETS={
 wen:[0,0],wenAnswer:[1,1,2],wenCoat:[2,2,2,3],wenSuspect:[3,3,4,4],wenPublicLead:[5,5,8],
 wenPublic:[8,8,8,9,9,9,10,10,10,11,11,11,12,12,12,13,13,13,13],
 wenQuiet:[4,4],wenFloor:[3,3,3,4],wenBack:[4,4],
 cheng:[0],chengEvidence:[0,1],chengAsk:[1],chengReply:[1,1,2,2,2,3,3,3],
 zhao:[0,1],zhaoStory:[2,2,2,3,3,3,4,4,5],zhaoEnd:[5],zhaoDeny:[2,2,2],
 lin:[0],linTyping:[1,1,1,2],linPress:[2],linSorry:[3,3,3],linKind:[3,3,4],linTrust:[5,5,5,6],linEnd:[6]
};
function faClockMinutes(time){const [h,m]=String(time).split(':').map(Number);return h*60+m}
function faClockLabel(minutes){return String(Math.floor(minutes/60)).padStart(2,'0')+':'+String(minutes%60).padStart(2,'0')}
function faEnsureChatClock(){const r=fa().run;if(!r)return null;if(!Number.isFinite(r.chatClockBase)){const start=fa().completed.length===0?'12:00':FREE_ACTION_TIMES[fa().completed.length-1];r.chatClockBase=faClockMinutes(start);r.chatClockLast=Math.max(r.chatClockBase,faClockMinutes(state.system.time))}return r}
function faAdvanceChatClock(){const r=faEnsureChatClock();if(!r)return;const offset=FA_CHAT_OFFSETS[r.script]?.[r.index];if(offset===undefined)return;const current=faClockMinutes(state.system.time);const minute=Math.max(r.chatClockBase+offset,r.chatClockLast||0,current);r.chatClockLast=minute;state.system.time=faClockLabel(minute);status()}
function faChatDivider(rows,id){const r=fa().run;if(!r)return;const previous=rows.at(-1),date=state.system.date,time=state.system.time;const same=previous&&(previous.gameDate||date)===date&&(previous.time||previous.text)===time;if(!same&&!rows.some(m=>m.id===id+'-time'))rows.push({id:id+'-time',type:'time',text:time,time,gameDate:date,freeActionDivider:true})}
