/* Extra dialogue only. Conditions always use the current, rewindable story. */
function groupAdditionCanSpeak(who){return !reportDeparted(GROUP_SUSPECT_NAMES[who],state)}
function groupAdditionWenExposed(){
 const discussion=state.story.pickupRecordDiscussion;
 return discussion?.phase==='done'&&discussion.result==='conflict';
}
function groupAdditionWenAccusedZhao(){
 const rows=state.messages[HG_ID]||[],f=state.story.freeAction;
 return rows.some(m=>m.type==='text'&&(m.id==='fa-wenPublic-0'||m.id?.startsWith('fa-wen-wenPublic-')&&m.hgWho==='wen'))
  ||!!(f?.completed?.includes('wen')&&f.clues?.some(c=>c.result==='wenPublic'));
}
function groupAdditionZhaoDeparted(){return state.story.dayOneReport?.groupResult?.target==='zhao'&&!!state.game.departedNpcs?.zhao}
function groupAdditionNext(key){
 const zhaoRoute=groupAdditionZhaoDeparted()&&['day3-lin','day3-self-proof','day3-zhao-defense'].includes(key);
 const messages=state.messages[HG_ID]||[],prefix='group-addition-'+key+(zhaoRoute?'-zhao-departed':'')+'-';
 let rows=[];
 if(zhaoRoute&&key==='day3-lin')rows=[
  ['wen','为什么林晴被怀疑，【玩家名字】你就护着'],
  ['yuwei','别忘了，【玩家名字】还害得赵诗雨被投出去了'],
  ['yuwei','我反正是不敢随便相信她了'],
  ['wen','赵诗雨解释说自己忘记了，你却要怀疑她？'],
  ['lin','说我的问题就说我，别带上【玩家名字】']
 ];
 else if(zhaoRoute&&key==='day3-self-proof')rows=[
  ['jiangning','赵诗雨那天也说自己没出去'],
  ['jiangning','你们是怎么做的？'],
  ['jiangning','最后结果又是什么？你们要重蹈覆辙吗？']
 ];
 else if(zhaoRoute&&key==='day3-zhao-defense')rows=[
  ['yuwei','别忘了，【玩家姓名】还害得赵诗雨被投出去了'],
  ['yuwei','我反正是不敢随便相信她了']
 ];
 else if(key==='day2-yelin')rows=[['wen','谁知道呢，反正你拿不出说法确实嫌疑大']];
 else if(key==='day3-lin')rows=[['wen','总不能你说不知道，这件事就过去了吧？']];
 else if(key==='day3-review')rows=[['zhao','是最低分被请离了吗…']];
 else if(key==='day3-self-proof'){
  // Once the first line is sent, the other speaker cannot join this insertion.
  const sent=messages.find(m=>m.id===prefix+'0');
  const who=sent?.hgWho||(groupAdditionCanSpeak('wen')&&groupAdditionWenExposed()?'wen':groupAdditionCanSpeak('cheng')?'cheng':null);
  if(who==='wen')rows=[['wen','又是查记录'],['wen','这么喜欢查当初怎么不选个公安专业']];
  else if(who==='cheng')rows=[['cheng','是啊，搞上自证陷阱了']];
 }else if(key==='day3-zhao-defense'){
  rows=groupAdditionWenAccusedZhao()?[
   ['zhao','我之前没跟着苏沐出门，你们就怀疑我是故意害她。'],
   ['zhao','现在【玩家姓名】没被学生会清理也有错'],
   ['zhao','活着的人就都该被怀疑吗？']
  ]:[['zhao','我觉得有点牵强了……']];
 }
 for(let i=0;i<rows.length;i++){
  const [who,text]=rows[i],id=prefix+i;
  if(groupAdditionCanSpeak(who)&&!messages.some(m=>m.id===id))return {who,text,id};
 }
 return null;
}
