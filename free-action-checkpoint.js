/* One exact, whole-state checkpoint for the investigation segment. No partial snapshots. */
function captureFreeActionStart(){if(storyRestoring||window.mobileLaunch||['nodes','game-menu'].includes(view))return false;const f=freeState();if(state.game.day!==1||!f.unlocked||f.completed.length||f.run||f.transition||state.system.time!=='12:00')return false;if(checkpointIsCurrentRun(freeActionCheckpointRecord(state)))return true;f.checkpointToken=storyRunId();f.finished=false;const checkpoint=structuredClone(state);checkpoint.story.freeAction.promptSeen=false;return captureStoryNode(FREE_ACTION_CHECKPOINT_ID,checkpoint,{route:{view:'home',active:null}})}
const checkpointFreeSync=freeSync;freeSync=function(){checkpointFreeSync();captureFreeActionStart()};
const checkpointRecord=recordStoryChoice;recordStoryChoice=function(id,checkpoint=state){if(id.startsWith('fa-')||isFreeActionSegment(state))return;return checkpointRecord(id,checkpoint)};
for(let i=STORY_CHOICES.length-1;i>=0;i--)if(STORY_CHOICES[i].id.startsWith('fa-'))STORY_CHOICES.splice(i,1);
if(!STORY_CHOICES.some(n=>n.id===FREE_ACTION_CHECKPOINT_ID))STORY_CHOICES.push({id:FREE_ACTION_CHECKPOINT_ID,title:'自由行动选择',day:'第一日 · 12:00',chat:null});

function freeCheckpointAvailable(){return !!freeActionCheckpointRecord(state)}
function restoreFreeActionStart(){return loadStoryNode(FREE_ACTION_CHECKPOINT_ID)}
// Existing intermediate saves without a true baseline are never fabricated into a checkpoint.
freeSync();if(freeActionCheckpointRecord(state))persist();
