/* One exact, whole-state checkpoint for the investigation segment. No partial snapshots. */
function captureFreeActionStart(){if(storyRestoring||window.mobileLaunch||['nodes','game-menu'].includes(view))return false;const f=freeState();if(state.game.day!==1||!f.unlocked||f.completed.length||f.run||f.transition||state.system.time!=='12:00')return false;if(checkpointIsCurrentRun(freeActionCheckpointRecord(state)))return true;f.checkpointToken=storyRunId();f.finished=false;const checkpoint=structuredClone(state);checkpoint.story.freeAction.promptSeen=false;return captureStoryNode(FREE_ACTION_CHECKPOINT_ID,checkpoint,{route:{view:'home',active:null}})}
const checkpointFreeSync=freeSync;freeSync=function(){checkpointFreeSync();captureFreeActionStart()};
const checkpointRecord=recordStoryChoice;recordStoryChoice=function(id,checkpoint=state){if(id.startsWith('fa-')||isFreeActionSegment(state))return;return checkpointRecord(id,checkpoint)};
for(let i=STORY_CHOICES.length-1;i>=0;i--)if(STORY_CHOICES[i].id.startsWith('fa-'))STORY_CHOICES.splice(i,1);
if(!STORY_CHOICES.some(n=>n.id===FREE_ACTION_CHECKPOINT_ID))STORY_CHOICES.push({id:FREE_ACTION_CHECKPOINT_ID,title:'自由行动选择',day:'第一日 · 12:00',chat:null});

function freeCheckpointAvailable(){return !!freeActionCheckpointRecord(state)}
const checkpointNodes=zeroNodes;zeroNodes=function(){if(!isFreeActionSegment(state))return checkpointNodes();if(!['game-menu','nodes'].includes(view))return;view='nodes';active=null;rememberRoute();const ready=freeCheckpointAvailable();screen.innerHTML=`<section class="app-page zero-nodes">${head('再一次抉择')}<p>读取后，本轮自由行动的全部变化将被撤销。</p><div class="zero-timeline"><button class="zero-node ${ready?'visited':''}" ${ready?`data-retry-choice="${FREE_ACTION_CHECKPOINT_ID}"`:'disabled'}><i></i><small>第一日 · 12:00</small><strong>自由行动选择</strong></button></div>${ready?'':'<p>这份旧进度没有自由行动开始前的完整检查点。重新开始游戏并抵达此处后即可建立。</p>'}<button class="secondary" data-action="zero-menu">返回游戏主页</button></section>`};actions['zero-nodes']=()=>zeroNodes();
function restoreFreeActionStart(){return loadStoryNode(FREE_ACTION_CHECKPOINT_ID)}
// Existing intermediate saves without a true baseline are never fabricated into a checkpoint.
freeSync();if(freeActionCheckpointRecord(state))persist();
