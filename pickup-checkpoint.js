/* Exact pre-pickup snapshot, including this run's investigation outcomes. */
const PICKUP_CHECKPOINT_ID='day1-before-pickup';
STORY_CHOICES.push({id:PICKUP_CHECKPOINT_ID,title:'前往取件',day:'第一日 · 16:00',chat:null});
function capturePickupCheckpoint(){const p=pickup16State();if(!p||p.phase!=='notice'||p.done)return;return captureStoryNode(PICKUP_CHECKPOINT_ID,state,{route:{view:'home',active:null}})}
