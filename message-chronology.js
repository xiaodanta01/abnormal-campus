/* Conversation ordering and game-calendar timestamps, including legacy progress. */
const messageChronologyBase={persist,chatList,openChat,renderMessage,contactRow};
const messageChronologyLists=new WeakSet();
const messageChronologyRoots=new WeakSet();
let messageChronologyOrder=0;
function messageDayValue(date){return Date.parse(date+'T00:00:00Z')}
function messageClockMinutes(time){const match=String(time||'').match(/(\d{1,2}):(\d{2})/);return match?Number(match[1])*60+Number(match[2]):null}
function messageNextDay(date){return new Date(messageDayValue(date)+86400000).toISOString().slice(0,10)}
function syncMessageDates(){
 const today=state.system.date;
 const restored=!messageChronologyRoots.has(state.messages);
 for(const rows of Object.values(state.messages||{})){
  if(!Array.isArray(rows))continue;
  const legacy=restored&&!messageChronologyLists.has(rows);
  let date='2045-09-07',previous=null;
  for(const m of rows){
   const minutes=messageClockMinutes(m.time|| (m.type==='time'?m.text:''));
   if(legacy){
    if(/^(fm-|jx-|rd-)/.test(m.id||''))date=date<'2045-09-08'?'2045-09-08':date;
    else if(previous!==null&&minutes!==null&&previous>=1080&&minutes<360)date=messageNextDay(date);
   }
   if(!m.gameDate)m.gameDate=legacy?(m.date&&/^\d{4}-\d{2}-\d{2}$/.test(m.date)?m.date:date):today;
   date=m.gameDate;
   if(minutes!==null)previous=minutes;
   messageChronologyOrder=Math.max(messageChronologyOrder,Number(m.messageOrder)||0);
   if(!m.messageOrder)m.messageOrder=++messageChronologyOrder;
  }
  messageChronologyLists.add(rows);
 }
 messageChronologyRoots.add(state.messages);
 // Correct only the pre-story leave conversation after dating legacy messages,
 // so moving it to the previous day cannot shift any later conversation dates.
 const room=state.messages.room408||[],opening=new Map(C.messages.room408.map(m=>[m.id,m]));
 for(const message of room){
  const source=opening.get(message.id);if(!source)continue;
  message.text=source.text;message.time=source.time;message.gameDate=source.gameDate;
 }
 const contact=state.contacts.find(c=>c.id==='room408');
 if(contact&&room.length&&room.every(m=>opening.has(m.id))){
  contact.time='15:21';
  if(contact.preview==='周禾：我今晚不回学校了')contact.preview=C.contacts.find(c=>c.id==='room408').preview;
 }
}
function messageTimeLabel(m){
 const minutes=messageClockMinutes(m.time||(m.type==='time'?m.text:''));
 if(minutes===null)return '';
 const hour=Math.floor(minutes/60),period=hour<6?'凌晨':hour<12?'上午':hour<18?'下午':'晚上';
 const clock=period+(hour%12||12)+':'+String(minutes%60).padStart(2,'0');
 const date=m.gameDate||m.date||state.system.date,days=Math.round((messageDayValue(state.system.date)-messageDayValue(date))/86400000);
 const [y,month,day]=date.split('-').map(Number);
 return (days===0?'':days===1?'昨天 ':days===2?'前天 ':(y!==Number(state.system.date.slice(0,4))?y+'年':'')+month+'月'+day+'日 ')+clock;
}
function groupedMessageTime(rows,index){const m=rows[index];let minutes=messageClockMinutes(m.time||(m.type==='time'?m.text:''));for(let i=index-1;minutes===null&&i>=0;i--)minutes=messageClockMinutes(rows[i].time||(rows[i].type==='time'?rows[i].text:''));return minutes===null?null:{time:String(Math.floor(minutes/60)).padStart(2,'0')+':'+String(minutes%60).padStart(2,'0'),gameDate:m.gameDate||m.date||state.system.date};}
function messageStartsGroup(rows,index){if(index<0)return false;let previous=index-1;while(previous>=0&&rows[previous].type==='time')previous--;if(previous<0)return true;const a=groupedMessageTime(rows,index),b=groupedMessageTime(rows,previous);if(!a||!b)return false;const gap=messageDayValue(a.gameDate)+messageClockMinutes(a.time)*60000-messageDayValue(b.gameDate)-messageClockMinutes(b.time)*60000;return gap>300000||gap<0;}
function latestConversationMessage(c){const rows=state.messages[c.id]||[];for(let i=rows.length-1;i>=0;i--)if(rows[i].type!=='time')return rows[i]}
function conversationRank(c){const m=latestConversationMessage(c);return messageDayValue(m?.gameDate||'2045-09-07')+(messageClockMinutes(m?.time||c.time)||0)*60000}
function chronologicalContacts(contacts){return [...contacts].sort((a,b)=>conversationRank(b)-conversationRank(a)||(latestConversationMessage(b)?.messageOrder||0)-(latestConversationMessage(a)?.messageOrder||0))}
persist=function(...args){syncMessageDates();return messageChronologyBase.persist(...args)};
openChat=function(...args){syncMessageDates();return messageChronologyBase.openChat(...args)};
contactRow=function(c){const m=latestConversationMessage(c);return messageChronologyBase.contactRow(m?{...c,time:messageTimeLabel({...m,time:m.time||c.time})}:c)};
renderMessage=function(m,c){
 if(m.type==='time')return '';
 const rows=state.messages[c.id]||[],index=rows.findIndex(x=>x===m||(m.id&&x.id===m.id)||(m.messageOrder&&x.messageOrder===m.messageOrder));
 let html=messageChronologyBase.renderMessage(m,c);
 html=html.replace(/(<div class="message-meta">)[^<]*/g,'$1').replace(/<div class="message-meta">\s*<\/div>/g,'');
 if(messageStartsGroup(rows,index)){const time=groupedMessageTime(rows,index);if(time)html='<div class="divider message-group-time">'+esc(messageTimeLabel(time))+'</div>'+html;}
 return html;
};
chatList=function(...args){
 syncMessageDates();const result=messageChronologyBase.chatList(...args);
 const list=document.querySelector('#contact-list'),search=document.querySelector('#search');
 if(list){const update=()=>{const q=search?.value.trim().toLowerCase()||'';const rows=chronologicalContacts(state.contacts.filter(c=>(c.name+c.preview).toLowerCase().includes(q)));list.innerHTML=rows.map(contactRow).join('')||'<div class="empty-state">没有找到相关讯息</div>'};update();if(search)search.oninput=update}
 return result;
};
syncMessageDates();
