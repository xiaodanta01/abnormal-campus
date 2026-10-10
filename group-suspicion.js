/* The sole NPC group-report rule. Personal reports never write to this ledger. */
const GROUP_SUSPECT_NAMES={songjia:'宋佳',cheng:'程昕',zhao:'赵诗雨',wen:'温宁',lin:'林晴',shen:'沈可欣',jiang:'江晓',xianing:'夏宁',yuwei:'余薇',yelin:'叶琳',linxia:'林夏',qiaoan:'乔安',luyao:'陆遥',ningke:'宁可',fangtian:'方恬',baizhi:'白栀',gunian:'顾念',heyu:'何雨',mengshu:'孟舒',zhoumo:'周茉',xutang:'李恬',songyan:'宋妍',jiangning:'江柠',hanlu:'韩露',qiyue:'戚悦',zhengning:'许蓁蓁',hean:'何安',liangyin:'梁音',guyao:'顾遥',yeshu:'蒋小雪',me:'玩家'};
function suspicionDay(progress=state,date=progress.system.date){progress.game.groupSuspicionDays??={};return progress.game.groupSuspicionDays[date]??={scores:Object.fromEntries(Object.keys(GROUP_SUSPECT_NAMES).map(key=>[key,key==='songjia'?20:0])),events:{},result:null}}
function addGroupSuspicion(eventId,changes,progress=state,date=progress.system.date){const day=suspicionDay(progress,date);if(day.events[eventId]||day.result)return false;day.events[eventId]={...changes};for(const [key,value] of Object.entries(changes))day.scores[key]=(day.scores[key]||0)+value;return true}
function highestGroupSuspicion(date=state.system.date){const day=suspicionDay(state,date);if(day.result)return structuredClone(day.result);const departed=state.game.departedNpcs||{};const entries=Object.entries(day.scores).filter(([key])=>!departed[key]);entries.sort((a,b)=>b[1]-a[1]);if(!entries.length)return null;const [target,score]=entries[0];return {date,target,name:target==='me'?state.profile.name:GROUP_SUSPECT_NAMES[target]||target,score,source:'suspicion'}}
function settleGroupSuspicion(date=state.system.date){const day=suspicionDay(state,date);if(day.result)return structuredClone(day.result);const highest=highestGroupSuspicion(date);if(!highest)return null;day.result={...highest,status:'已离校'};state.game.departedNpcs??={};state.game.departedNpcs[highest.target]={date,cause:'group-suspicion'};persist();return structuredClone(day.result)}
function migrateGroupSuspicion(progress){if(!progress?.game||progress.game.groupSuspicionVersion===1)return;const f=progress.story?.freeAction,legacy=f?.publicConfrontations||[],date=progress.system.date;const clues=f?.clues||[];
 if(f?.completed?.includes('cheng')||legacy.some(x=>x.target==='cheng'))addGroupSuspicion('free-cheng',{cheng:50},progress,clues.find(x=>x.result==='cheng')?.date||date);
 if(clues.some(x=>x.result==='wenPublic')||legacy.some(x=>x.target==='zhao'))addGroupSuspicion('free-wen-public',{zhao:70},progress,clues.find(x=>x.result==='wenPublic')?.date||date);
 delete progress.game.groupReports;delete progress.game.groupReportResults;if(f)delete f.publicConfrontations;
 for(const [key,value] of Object.entries(progress.game.departedNpcs||{}))if(value.cause==='group-report')delete progress.game.departedNpcs[key];
 progress.game.groupSuspicionVersion=1;suspicionDay(progress);
}
migrateGroupSuspicion(state);const suspicionNodes=nodeRecords();for(const node of Object.values(suspicionNodes))migrateGroupSuspicion(node.checkpoint);saveNodes(suspicionNodes);

// Departure facts belong to the supplied timeline. Never infer them from saved node history.
function npcDeparturePerson(key){
 const early={chenyue:['陈妍','408'],zhouhe:['周禾','408'],su:['苏沐','214'],qin:['秦琦','417'],xu:['许知夏','417'],'a-zhangxin':['张昕','213'],'a-lixiaoxiao':['李潇潇','518']};
 const person=FA_PEOPLE[key==='mengshu'?'meng':key],member=HG_PEOPLE[key],name=GROUP_SUSPECT_NAMES[key]||early[key]?.[0]||person?.name||key;
 const room=person?.room||early[key]?.[1]||FA_ROSTER.match(new RegExp(name+'(\\d{3})'))?.[1];
 const ids=[key,name,person?.contact,person?.avatar,member?.avatar,'record-'+key,key==='jiang'?JX.id:null,key==='fangtian'?'record-fang':key==='guyao'?'record-gu':null];
 if(typeof PORTRAIT_CHARACTERS!=='undefined')ids.push(PORTRAIT_CHARACTERS[name]);
 return {name,room,ids:new Set(ids.filter(id=>id&&!/^student\d+$/.test(id)))};
}
function npcDepartureMatches(contact,person){return !contact.members&&!contact.systemAccount&&(person.ids.has(contact.id)||person.ids.has(contact.avatar)||contact.name?.replace(/[（(].*$/,'').trim()===person.name)}
function syncNpcDeparture(progress,key,event={}){
 if(!progress?.game||!progress.story||key==='me')return;
 const person=npcDeparturePerson(key),ledger=progress.game.departedNpcs??={},record=ledger[key]??={date:event.date||progress.system.date,cause:event.cause};
 record.status='已离校';
 for(const contact of progress.contacts||[])if(npcDepartureMatches(contact,person)){contact.online=false;contact.status=record.status}
 if(!event.id||event.ready===false)return;
 const chat=event.chat||HG_ID,group=progress.contacts?.find(c=>c.id===chat);if(!group?.members)return;
 const rows=progress.messages[chat]??=[],existing=rows.find(m=>m.id===event.id);
 record.groupSync??={};
 if(!record.groupSync[chat]){
  const members=group.members,oldCount=chat===HG_ID?progress.story.helpGroup?.count:members.length;
  let removed=0;
  for(let i=members.length-1;i>=0;i--)if(person.ids.has(members[i])||event.placeholder===members[i]){members.splice(i,1);removed++}
  // Authored publishers already settled their roster/count before persisting the notice.
  if(!event.rosterApplied&&!existing){
   if(!removed&&chat===HG_ID){const i=members.findLastIndex(id=>String(id).startsWith('stranger-'));if(i>=0){members.splice(i,1);removed=1}}
   if(chat===HG_ID&&progress.story.helpGroup)progress.story.helpGroup.count=Math.max(0,(oldCount??members.length+removed)-1);
  }
  record.groupSync[chat]=event.id;
 }
 const count=chat===HG_ID?progress.story.helpGroup?.count:group.members.length;
 if(Number.isFinite(count))group.status='群成员：'+count+'人';
 // Synchronize the roster/status only. Departure labels belong below the sender's name.
}
function removeAutomaticDepartureNotices(progress){
 for(const group of progress.contacts||[]){
  if(!group.members)continue;const rows=progress.messages?.[group.id];if(!Array.isArray(rows))continue;
  const removed=rows.filter(m=>m.type==='system'&&(['zero-departure-chenyue','aw-departure-zhouhe'].includes(m.id)||/^meng-error-removal-/.test(m.id||'')||/^d4-final-remove-(?!a-)/.test(m.id||'')||/^[^：:。\n]{1,16}(已离校|已(?:被)?请离|已清理)[。.]?$/.test(m.text||'')));
  if(!removed.length)continue;
  progress.messages[group.id]=rows.filter(m=>!removed.includes(m));
  if(removed.some(m=>m.text===group.preview)){
   const latest=progress.messages[group.id].findLast(m=>m.type!=='time');group.preview=latest?.text||'';group.time=latest?.time||'';
  }
 }
}
function syncNpcDepartures(progress=state){
 if(!progress?.story||!progress.game)return;
 // Normalize legacy contact labels without changing departure causes or roster counts.
 for(const contact of progress.contacts||[])if(!contact.members&&!contact.systemAccount&&/^(?:已离校|已注销|已请离|已被请离|被请离|已清理|已被清理)$/.test(contact.status||'')){contact.status='已离校';contact.online=false}
 removeAutomaticDepartureNotices(progress);
 const story=progress.story,rows=progress.messages?.[HG_ID]||[];
 const seed=(key,cause,date,status)=>{progress.game.departedNpcs??={};progress.game.departedNpcs[key]??={cause,date,status}};
 if(story.zero?.chenyanLeft)seed('chenyue','day0-rule','2045-09-07','已离校');
 if(story.afterWall?.zhouLeft)seed('zhouhe','departed-reply','2045-09-07','已离校');
 if(story.helpGroup?.xuLeft)seed('xu','departed-reply','2045-09-07','已离校');
 if(story.firstMorning?.suDeparted)seed('su','day1-rule','2045-09-08','已离校');
 for(const key of story.firstMorning?.left||[])seed(key,'day1-rule','2045-09-08','已离校');
 const night=story.secondNightResult;
 if(night?.populationApplied)seed(night.target,'night-death',night.date,'已离校');
 if(story.dayThreeMorning?.removalApplied)seed('jiang','day3-morning',story.dayThreeMorning.date,'已离校');
 for(const [key,record] of Object.entries(progress.game.departedNpcs||{})){
  let event={ready:false};
  if(key==='chenyue')event={chat:'room408',id:'zero-departure-chenyue',time:'21:03',text:'陈妍已离校'};
  else if(key==='zhouhe')event={chat:'room408',id:'aw-departure-zhouhe',time:'21:20',text:'周禾已离校'};
  else if(key==='xu'&&story.helpGroup?.xuLeft)event={id:'hg-event-2',time:'21:22',rosterApplied:true,text:'沈可欣已将许知夏（417）移出群聊。'};
  else if(['su','qin'].includes(key)&&story.firstMorning?.left?.includes(key))event={id:key==='su'?'fm-refuse-4':'fm-refuse-5',time:'08:35',rosterApplied:true,text:'沈可欣已将'+npcDeparturePerson(key).name+'（'+npcDeparturePerson(key).room+'）移出群聊。'};
  else if(record.cause==='group-suspicion'){
   const report=[story.dayOneReport,story.dayTwoReport,story.dayThreeReport].find(r=>r?.date===record.date&&r.groupResult?.target===key&&r.publicationComplete);
   if(report)event={id:'day'+(report.day||1)+'-report-group-removal',time:'21:05',rosterApplied:!!report.groupApplied};
  }else if(record.cause==='night-death'){
   if(night?.target===key&&night.date===record.date)event={id:'second-night-group-removal',time:'09:00',ready:!!night.groupApplied,rosterApplied:true};
   else if(story.dayTwoPublicOutcome?.applied)event={id:'day2-midday-outcome-'+key,time:'22:00',text:npcDeparturePerson(key).name+'已被请离',rosterApplied:true};
  }else if(record.cause==='evening-anomaly')event={id:'evening-anomaly-'+(['fangtian','guyao'].indexOf(key)),time:'17:50',rosterApplied:true};
  else if(record.cause==='day2-evening')event={id:'day2-evening-removal-'+key,time:'18:09',rosterApplied:true};
  else if(record.cause==='day2-after-vote')event={id:'day2-after-vote-remove-'+key,time:'21:05',rosterApplied:true};
  else if(record.cause==='day3-morning')event={id:'day3-morning-0',time:'08:56',text:'沈可欣已将江晓移出群聊',rosterApplied:true};
  else if(record.cause==='day3-anonymous-review')event={id:'day3-review-removal',time:'10:30',ready:!!story.dayThreeReview?.departureApplied,rosterApplied:true};
  else if(record.cause==='day4-night-death')event={id:'day4-morning-group-'+(['songyan','zhoumo'].indexOf(key)),time:'08:40',rosterApplied:true};
  else if(record.cause==='personal-report-error')event={id:'meng-error-removal-'+record.date+'-'+key,time:'21:06',rosterApplied:true};
  else if(record.cause==='day4-final-report'){
   if(key.startsWith('a-'))event={chat:'day4-a-group',id:'d4-final-remove-'+key,time:'21:00',rosterApplied:true};
   else event={id:'d4-final-remove-'+key,time:'21:00',text:npcDeparturePerson(key).name+'已被请离'};
  }
  syncNpcDeparture(progress,key,{...event,date:record.date});
 }
 // Both the living archivist's confession and the posthumous account identify Jiang Xiao.
 // Repair only this authored message, leaving all real Wen Ning branches untouched.
 const line=rows.find(m=>m.id==='d4-final-identity-4');
 if(line?.text==='前几天温宁的误判也可能和这个有关'){
  line.text='前几天江晓的误判也可能和这个有关';
  const group=progress.contacts?.find(c=>c.id===HG_ID);if(group?.preview==='前几天温宁的误判也可能和这个有关')group.preview=line.text;
 }
}
const departureOpenChat=openChat,departureChatList=chatList,departureRenderMessage=renderMessage;
openChat=function(...args){syncNpcDepartures(state);return departureOpenChat(...args)};
chatList=function(...args){syncNpcDepartures(state);return departureChatList(...args)};
renderMessage=function(message,contact){
 const html=departureRenderMessage(message,contact);
 if(!contact.members||message.type==='system'||message.sender==='me'||html.includes('zero-left-status'))return html;
 const entry=Object.entries(state.game.departedNpcs||{}).find(([key])=>{const p=npcDeparturePerson(key);return key===message.hgWho||p.ids.has(message.sender)||message.name?.replace(/[（(].*$/,'').trim()===p.name});
 return entry?html.replace(/(<div class="sender-name">[^<]*)(<\/div>)/,'$1<small class="zero-left-status">已离校</small>$2'):html;
};
document.addEventListener('DOMContentLoaded',()=>{syncNpcDepartures(state);persist()},{once:true});
