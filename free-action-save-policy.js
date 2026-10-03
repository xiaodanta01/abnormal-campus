/* Select the durable snapshot before any scene or resume code can save progress. */
const FREE_ACTION_CHECKPOINT_ID='day1-free-action-start';
function isFreeActionSegment(progress){const f=progress?.story?.freeAction;return progress?.game?.day===1&&!!(f?.unlocked&&!f.finished&&(f.completed?.length||0)<FREE_ACTION_LIMIT)}
function freeActionCheckpointRecord(progress){try{const key=new URLSearchParams(location.search).get('dev')==='1'?'afterclass-day1-test':'afterclass-v1';const record=ChoiceNodeStorage.record(key+'-choice-nodes',FREE_ACTION_CHECKPOINT_ID,typeof toast==='function'?toast:()=>{});return record?.checkpoint?.story?.freeAction?.checkpointToken&&record.checkpoint.story.freeAction.checkpointToken===progress?.story?.freeAction?.checkpointToken?record:null}catch{return null}}
// Auto-continue always saves the current timeline, including an action/puzzle in progress.
window.freeActionSaveSnapshot=progress=>progress;
