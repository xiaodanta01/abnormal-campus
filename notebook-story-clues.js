/* Collect only evidence already delivered in this snapshot, never future flags. */
const NOTEBOOK_STORY_EVIDENCE=[
 [HG_ID,'day3-lin-defense-answer-3','day3-lin-statement','林晴对质疑的回应','林晴称自己不知道江晓为什么怀疑她，并否认自己是学生会；许蓁蓁要求她证明。身份仍未得到证实。'],
 [HG_ID,'day3-probe-evidence-2','day3-songyan-record','宋妍的物流记录','宋妍出示了这两天没有购买记录、也没有待取包裹的截图。这只能说明记录内容，不能单凭它证明她没有乘过电梯。'],
 [HG_ID,'day3-probe-evidence-4','day3-jiangning-record','江柠拒绝出示记录','江柠称自己这两天没有取过件。宋妍出示截图后，江柠仍以“我凭什么要自证？”拒绝出示自己的物流记录。'],
 [HG_ID,'day3-probe-zhou-alive-3','day3-zhou-witness','周茉的送水证词','周茉在群里说，昨天自己差点脱水，是林晴和玩家送来了水与零食；她因此相信两人是普通生。这是她的判断，并非身份查验结果。'],
 ['day4-hean','d4-hean-7','day4-hean-testimony','何安的取件证词','何安称第二日沈可欣曾邀请她一起取物资，她没有答应，最后与韩露同行。这段私聊证词尚未得到独立验证。'],
 [HG_ID,'day4-confront-8','day4-shen-record','沈可欣的解释与记录','沈可欣称自己一直没有离开宿舍，是梁音告诉她楼层被打乱；她出示了没有购买记录、也没有待取包裹的截图。截图不能单独证明她没有乘过电梯，梁音也已无法核实她的说法。'],
 ['day4-huang','d4-a-lie-3','day4-huang-rejection','黄依依的入群申请截图','黄依依称多次申请加入女生B栋互助群均被拒绝，并出示了申请被拒的截图。这与沈可欣此前声称联系不上其他宿舍楼的说法存在矛盾。']
];
function collectStoryNotebookClues(notify=true){
 let changed=false;
 for(const [chat,messageId,id,title,text] of NOTEBOOK_STORY_EVIDENCE){
  if(state.story.notebookClues?.some(c=>c.id===id))continue;
  const message=state.messages?.[chat]?.find(m=>m.id===messageId);
  if(!message)continue;
  const rows=state.story.notebookClues??=[],clue={id,title,text,date:message.gameDate||state.system.date,time:message.time||state.system.time};
  if(notify)addNotebookClue(clue,rows);else rows.push(clue);
  changed=true;
 }
 return changed;
}
const notebookStoryPersistBase=persist;
persist=function(...args){collectStoryNotebookClues();return notebookStoryPersistBase(...args)};
const notebookStoryCleanupBase=cleanupSceneResume;
cleanupSceneResume=function(...args){
 clearTimeout(notebookNoticeTimer);notebookNoticeTimer=null;notebookNoticeQueue.length=0;
 document.querySelector('#notebook-collected')?.remove();
 return notebookStoryCleanupBase(...args);
};
// Existing saves can recover delivered evidence quietly, without replaying a notice queue.
if(collectStoryNotebookClues(false))notebookStoryPersistBase();
