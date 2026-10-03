/* One timeline controller. Archives/collections never supply live gameplay state. */
const STORY_SNAPSHOT_VERSION=2;
const STORY_SETTINGS_KEY=STORAGE_KEY+'-permanent-settings';
const storyPendingTimeouts=new Set();
const storyRestoreGuards=[];
const storySnapshotMigrations=[];
let storyRestoring=false;
let storyEndingState=null,storyEndingKind=null;
function storyEndingOwner(){
 const s=state.story||{};
 if(s.dayFourSleep?.phase==='hidden-ending'&&['020','hidden-stay'].includes(s.dayFourSleep.endingId))return 'hidden';
 if(s.lateDayDeath)return 'late';
 const terminal=phase=>phase==='dead'||String(phase||'').startsWith('death-');
 if(terminal(s.questionnaire?.phase))return 'survey';
 const report=typeof dayReport==='function'?dayReport():s.dayOneReport;
 if(terminal(report?.phase))return 'report';
 if(s.zero?.playerLeft||['departing','pickup-code-death','dead'].includes(s.zero?.phase)||state.game.survivalEnding)return 'zero';
 return null;
}
function storyIntervalAllowed(callback){
 const owner=storyEndingOwner();
 if(!owner)return true;
 // The first-morning expulsion owns its campus-card countdown as well.
 if(owner==='zero'&&state.story.firstMorning?.phase==='profile'&&callback===globalThis.fmTick)return true;
 // Terminal transitions keep their own clock; ordinary story ticks stop here.
 return owner==='late'&&callback===globalThis.lateDeathTick||owner==='survey'&&callback===globalThis.surveyTick||owner==='report'&&callback===globalThis.dayReportTick;
}
function isStoryEndingNotice(element){
 if(!element)return false;
 const owner=storyEndingOwner(),id=element.id;
 if(id==='cg-recovery-confirm')return true;
 if(owner==='zero'&&id==='fm-campus-notice'&&state.story.firstMorning?.phase==='campus-notice')return true;
 return owner==='late'&&id==='late-death-notice'||owner==='survey'&&id==='survey-notice'||owner==='report'&&id==='report-death-notice'||owner==='zero'&&(id==='first-death-message'||id==='zero-notification'&&state.story.zero?.banner==='campus');
}
function clearOrdinaryStoryNotices(){
 if(!storyEndingOwner())return;
 const selector='.opening-message,.report-modal,#identity-reward,#notebook-collected,#cg-recovery-confirm,#morning-title,#fm-campus-notice,#evening-notification';
 document.querySelectorAll(selector).forEach(el=>{if(!isStoryEndingNotice(el))el.remove()});
 if(!['game-menu','nodes'].includes(view)&&document.querySelector('#overlay .sheet'))closeSheet();
}
function enterStoryEnding(){
 const owner=storyEndingOwner();if(!owner||window.mobileLaunch)return;
 if(storyEndingState===state&&storyEndingKind===owner)return;
 storyEndingState=state;storyEndingKind=owner;
 for(const timer of storyPendingTimeouts)clearTimeout(timer);storyPendingTimeouts.clear();
 clearTimeout(zeroTimer);clearTimeout(endingSleepTimer);clearTimeout(inviteTimer);clearInterval(cgTypingTimer);
 if(typeof notebookNoticeTimer!=='undefined'){clearTimeout(notebookNoticeTimer);notebookNoticeTimer=null;notebookNoticeQueue.length=0}
 if(typeof pendingItemUse!=='undefined')pendingItemUse=null;
 if(typeof cancelHandlePress==='function')cancelHandlePress();
 if(typeof clearForumHandlePress==='function')clearForumHandlePress();
 clearTimeout(window.toastTimer);document.querySelector('#toast')?.classList.remove('show');
 delete state.story.pendingPlayerReply;
 pickup16Cleanup();surveyStopSound();stopReading();closeSheet();
 for(const audio of mobilePlaying){audio.pause();audio.currentTime=0}mobilePlaying.clear();
 if(typeof interactionSounds!=='undefined')for(const audio of Object.values(interactionSounds)){audio.pause();audio.currentTime=0}
 document.querySelectorAll('.zero-transition,.ending-morning-veil,#pickup16-return').forEach(el=>el.remove());
 clearOrdinaryStoryNotices();
 const phone=document.querySelector('#phone');phone.classList.remove('pickup16-active','cg-active');
 if(owner!=='survey')phone.classList.remove('survey-active','survey-notifying');
 if(owner!=='report')phone.classList.remove('report-death-active');
 for(const el of [document.documentElement,document.body,phone,screen]){
  el.removeAttribute('inert');el.removeAttribute('aria-disabled');
  for(const key of ['pointer-events','overflow','overflow-y','touch-action'])el.style.removeProperty(key);
 }
}
new MutationObserver(clearOrdinaryStoryNotices).observe(document.querySelector('#phone'),{childList:true,subtree:true});
function storyRunId(){return globalThis.crypto?.randomUUID?.()||('run-'+Date.now()+'-'+Math.random().toString(36).slice(2))}
function storyTimeout(callback,delay,...args){
 const owner=state,ending=storyEndingOwner();const timer=setTimeout(()=>{storyPendingTimeouts.delete(timer);if(state===owner&&storyEndingOwner()===ending)callback(...args)},delay);storyPendingTimeouts.add(timer);return timer;
}
function storyPosition(progress,id=null){return {nodeId:id,day:progress.game?.day??0,date:progress.system?.date,time:progress.system?.time,route:structuredClone(progress.story?.route||{view:'home',active:null})}}
function ensureStoryTimeline(progress,legacy=false){
 if(!progress.story)return null;
 if(!progress.timeline?.runId){const runId=progress.story.replayRun||(legacy?'legacy-initial':storyRunId());progress.timeline={version:STORY_SNAPSHOT_VERSION,runId,parentRunId:null,sourceNodeId:null,nodeSequence:0,createdAt:Date.now(),snapshotAt:null,position:storyPosition(progress)}}
 progress.timeline.version=STORY_SNAPSHOT_VERSION;progress.story.replayRun=progress.timeline.runId;return progress.timeline;
}
function checkpointIsCurrentRun(record,progress=state){
 if(!record?.checkpoint||!progress?.story)return false;
 return (record.runId||record.checkpoint.timeline?.runId||record.checkpoint.story?.replayRun||'legacy-initial')===(progress.timeline?.runId||progress.story.replayRun||'legacy-initial');
}
function savePermanentStorySettings(progress){
 const settings={accent:progress.accent,preferences:structuredClone(progress.preferences||{}),wifi:progress.system?.wifi};
 GameStorage.setItem(STORY_SETTINGS_KEY,JSON.stringify(settings));
}
function applyPermanentStorySettings(progress){
 let settings;try{settings=JSON.parse(GameStorage.getItem(STORY_SETTINGS_KEY)||'null')}catch{}
 if(!settings)return;
 if(settings.accent!==undefined)progress.accent=settings.accent;
 progress.preferences=structuredClone(settings.preferences||{});
 if(settings.wifi!==undefined)progress.system.wifi=settings.wifi;
}
function prepareCurrentStorySave(progress){
 if(typeof syncNpcDepartures==='function')syncNpcDepartures(progress);
 savePermanentStorySettings(progress);
 const timeline=ensureStoryTimeline(progress);if(timeline){timeline.snapshotAt=Date.now();timeline.position=storyPosition(progress,timeline.position?.nodeId)}
 return progress;
}
function normalizeStoryNodeRecords(records){
 for(const [id,record] of Object.entries(records)){
  const snapshot=record?.checkpoint;if(!snapshot?.story||!snapshot.game||record.snapshotVersion===STORY_SNAPSHOT_VERSION)continue;
  const fresh=!!snapshot.timeline?.runId&&snapshot.timeline.runId===state.timeline?.runId;
  const timeline=ensureStoryTimeline(snapshot,true),at=record.reachedAt||timeline.snapshotAt||Date.now();
  if(fresh){const current=ensureStoryTimeline(state);current.nodeSequence=(current.nodeSequence||0)+1;current.position=storyPosition(state,id);timeline.nodeSequence=current.nodeSequence}
  timeline.snapshotAt=at;timeline.position=storyPosition(snapshot,id);
  Object.assign(record,{snapshotVersion:STORY_SNAPSHOT_VERSION,runId:timeline.runId,parentRunId:timeline.parentRunId,sourceNodeId:timeline.sourceNodeId,nodeOrder:timeline.nodeSequence||0,position:structuredClone(timeline.position),snapshotAt:at});
 }
 return records;
}
function captureStoryNode(id,checkpoint=state,details={}){
 if(storyRestoring||window.mobileLaunch||['nodes','game-menu'].includes(view)||!checkpoint?.story)return false;
 if(typeof earlyChoiceSnapshotValid==='function'&&!earlyChoiceSnapshotValid(id,checkpoint))return false;
 ensureStoryTimeline(state);const records=nodeRecords(),old=records[id];
 if(checkpointIsCurrentRun(old,checkpoint)&&(!details.branchPoint||old.branchPoint)&&(typeof earlyChoiceSnapshotValid!=='function'||earlyChoiceSnapshotValid(id,old.checkpoint)))return false;
 const snapshot=structuredClone(checkpoint);ensureStoryTimeline(snapshot);
 if(details.route)snapshot.story.route=structuredClone(details.route);
 if(snapshot.story.zero)snapshot.story.zero.menu=false;
 const {route,...metadata}=details;
 records[id]={...metadata,reachedAt:Date.now(),checkpoint:snapshot};saveNodes(records);return true;
}
// Only running clocks move. Message timestamps, transactions and acquired rewards stay historical.
const STORY_RUNNING_CLOCKS=new Set(['due','deadline','inviteDue','productDue','groupDue','healthUnlockDue','nightDue','reactionDue','nextGrowth','nextPostAt','nsGrowthAt','surveySoundDue','firstDeathReadyAt','homeReadyAt','readyAt','reportReadyAt','soloChoicesReadyAt','blackUntil','exploreUntil','transitionUntil','morningTransitionUntil','readUntil','waterNoticeAt','waterNoticeDeadline','identityAt','identityFallbackAt','warningAt','accountStartedAt','friendRequestedAt','enteredAt','startedAt']);
function rebaseStoryClocks(progress,at){
 if(!Number.isFinite(at))return;
 const offset=Date.now()-at;
 function walk(value){if(!value||typeof value!=='object')return;for(const [key,item] of Object.entries(value)){if(typeof item==='number'&&item>100000000000&&(STORY_RUNNING_CLOCKS.has(key)||key==='at'&&value.who))value[key]=item+offset;else if(item&&typeof item==='object')walk(item)}}
 walk(progress.story);
}
function migrateStoryNode(snapshot,id,record){
 const restored=SaveSchema.normalize(structuredClone(snapshot));
 if(!restored?.story||!restored?.game||!restored.system||!restored.messages||!Array.isArray(restored.contacts))throw new Error('Invalid story checkpoint');
 // Missing legacy fields get initial defaults only, never data from another timeline.
 restored.cart??={};restored.orders??=[];restored.forumPosts??=structuredClone(C.forumPosts||[]);
 ensureStoryTimeline(restored,true);
 if(!restored.timeline.snapshotAt&&record?.reachedAt)restored.timeline.snapshotAt=record.reachedAt;
 const route=restored.story.route;
 if(!route||['nodes','game-menu'].includes(route.view)){
  const node=typeof STORY_CHOICES!=='undefined'?STORY_CHOICES.find(n=>n.id===id):null;
  restored.story.route=node?.chat?{view:'chat',active:node.chat}:{view:'home',active:null};
 }
 // Old CG snapshots sometimes retained the chat they had just left.
 if(id==='day1-linqing-food')restored.story.route={view:'role-discussion-cg',active:null};
 if(typeof Z!=='undefined'&&id===Z.node)restored.story.route={view:'chat',active:'room408'};
 if(id==='day1-free-action-start')restored.story.route={view:'home',active:null};
 if(id==='day1-before-pickup')restored.story.route={view:'afternoon-pickup',active:null};
 if(id?.startsWith('noodle-choice-'))restored.story.route={view:'noodle-cg',active:null};
 if(record&&record.mengStoryVersion!==2&&restored.timeline.mengChoiceVersion!==2&&typeof MENG_CHOICE_NODES!=='undefined'&&Object.values(MENG_CHOICE_NODES).some(n=>n.id===id)){
  restored.timeline.mengChoiceVersion=2;
  const p=restored.story.postReportEvening,script=id===MENG_CHOICE_NODES.meng.id?'meng':'mengWarn';
  Object.assign(p,{script,phase:'chat',index:0,due:(restored.timeline.snapshotAt||Date.now())+messageSendDelay()});p.decisions??={};delete p.decisions[script];
  restored.messages[POST_MENG_ID]=(restored.messages[POST_MENG_ID]||[]).filter(m=>!m.id?.startsWith('post-'+script+'-'));
  restored.story.route={view:'chat',active:POST_MENG_ID};
  if(script==='mengWarn'){restored.game.npcSecrets??={};restored.game.npcSecrets.mengshu??={};restored.game.npcSecrets.mengshu.impersonatingArchivist=true}
 }
 return restored;
}
function restoreStorySnapshot(snapshot){
 const restored=migrateStoryNode(snapshot);
 rebaseStoryClocks(restored,restored.timeline.snapshotAt);
 for(const name of ['migrateNpcPortraits','migratePortraitProgress','migrateDayTwoMotiveOutcome','migrateFriendContactNotices','migratePickupDay2Phase','migrateLockdownDuration','migratePopulation57','migrateJiangningAvatar','migrateMengshuPortrait','migrateHanluPortrait','migrateDebatePortraits'])if(typeof globalThis[name]==='function')globalThis[name](restored);
 if(typeof d3DefenseRepair==='function'&&restored.story.dayThreeLinDefense)d3DefenseRepair(restored);
 if(restored.story.dayThreeNight?.phase==='blur'&&restored.story.dayThreeNight.blurDuration!==D3_NIGHT_BLUR_MS)Object.assign(restored.story.dayThreeNight,{remaining:D3_NIGHT_BLUR_MS,blurElapsed:0,blurDuration:D3_NIGHT_BLUR_MS});
 const report=restored.story.dayOneReport;
 if(report?.beforeReportCheckpoint){if(!report.homeReadyAt)report.homeReadyAt=Date.now()+2000;delete report.beforeReportCheckpoint}
 if(restored.story.route?.view==='day2-report-start'&&restored.story.dayTwoReport?.phase==='open')restored.story.route={view:'report-chat',active:'mandatory-day1-report'};
 for(const migrate of storySnapshotMigrations)migrate(restored);
 if(typeof syncNpcDepartures==='function')syncNpcDepartures(restored);
 applyPermanentStorySettings(restored);restored.timeline.snapshotAt=Date.now();return restored;
}
function cleanupStoryTimeline(){
 for(const timer of storyPendingTimeouts)clearTimeout(timer);storyPendingTimeouts.clear();
 if(typeof cleanupSceneResume==='function')cleanupSceneResume();
 if(typeof surveyCleanup==='function')surveyCleanup();
 if(typeof pendingItemUse!=='undefined')pendingItemUse=null;
 if(typeof inviteTimer!=='undefined')clearTimeout(inviteTimer);
 if(typeof d2EveningLastTick!=='undefined')d2EveningLastTick=0;
 if(typeof d2NightLastTick!=='undefined')d2NightLastTick=0;
 if(typeof d3LastTick!=='undefined')d3LastTick=0;
 if(typeof d3ReviewLastTick!=='undefined')d3ReviewLastTick=0;
 if(typeof d3DefenseLastTick!=='undefined')d3DefenseLastTick=0;
 if(typeof d3FeverLastTick!=='undefined')d3FeverLastTick=0;
 if(typeof d3ProbeLastTick!=='undefined')d3ProbeLastTick=0;
 if(typeof d3EveningLastTick!=='undefined')d3EveningLastTick=0;
 if(typeof d3NightLastTick!=='undefined')d3NightLastTick=0;
 if(typeof d3LetterLastTick!=='undefined')d3LetterLastTick=0;
 if(typeof d4MorningLastTick!=='undefined')d4MorningLastTick=0;
 if(typeof d4GroupLastTick!=='undefined')d4GroupLastTick=0;
 if(typeof d4DelegationLastTick!=='undefined')d4DelegationLastTick=0;
 if(typeof d4HeanLastTick!=='undefined')d4HeanLastTick=0;
 if(typeof d4ConfrontLastTick!=='undefined')d4ConfrontLastTick=0;
 if(typeof d4AfterLastTick!=='undefined')d4AfterLastTick=0;
 if(typeof d4ALast!=='undefined')d4ALast=0;
 if(typeof d4DebateLast!=='undefined')d4DebateLast=0;
 if(typeof d4CounterLast!=='undefined')d4CounterLast=0;
 if(typeof d4VoteReplayLast!=='undefined')d4VoteReplayLast=0;
 if(typeof d4FinalLastTick!=='undefined')d4FinalLastTick=0;
 document.querySelectorAll('#identity-reward,#notebook-collected').forEach(el=>el.remove());
 if(typeof mobilePlaying!=='undefined'){for(const audio of mobilePlaying)audio.pause();mobilePlaying.clear()}
}
function loadStoryNode(id){
 const record=nodeRecords()[id];if(!record?.checkpoint)return false;
 if(typeof allowStoryChoiceRestore==='function'&&!allowStoryChoiceRestore(id,record.checkpoint))return false;
 return resumeGameSnapshot(migrateStoryNode(record.checkpoint,id,record),{sourceNodeId:id,record});
}
function resumeGameSnapshot(snapshot,options={}){
 snapshot=SaveSchema.normalize(structuredClone(snapshot));
 if(storyRestoreGuards.some(guard=>guard(snapshot)))return false;
 // Complete validation/migration before discarding the live state.
 const restored=restoreStorySnapshot(snapshot),sourceNodeId=options.sourceNodeId;
 if(sourceNodeId){const parentRunId=restored.timeline.runId;restored.timeline={...restored.timeline,runId:storyRunId(),parentRunId,sourceNodeId,createdAt:Date.now(),snapshotAt:Date.now()};restored.story.replayRun=restored.timeline.runId}
 const sourceCheckpoint=sourceNodeId?structuredClone(restored):null;
 cleanupStoryTimeline();storyRestoring=true;
 try{
  screen.innerHTML='';delete screen.dataset.scene;
  state=restored;window.mobileLaunch=false;view='home';active=null;if(state.story.zero)state.story.zero.menu=false;
  if(typeof nsProductCatalog==='function')C.products=nsProductCatalog(!!state.story.nightServices?.life);
  if(typeof syncMobileSettings==='function')syncMobileSettings();
  if(typeof syncPlayerName==='function')syncPlayerName();
  if(typeof freeSync==='function')freeSync();
  resumeStoryScene(structuredClone(state));
  if(typeof syncMessageTheme==='function')syncMessageTheme();
 }finally{storyRestoring=false}
 // Reaching the source on the new run replaces its old pre-choice snapshot; other nodes stay archived.
 if(sourceNodeId)captureStoryNode(sourceNodeId,sourceCheckpoint,{worldline:true,branchPoint:!!options.record?.branchPoint,mengStoryVersion:options.record?.mengStoryVersion});
 persist();if(typeof storeContinueGame==='function')storeContinueGame();return true;
}
// Settings are the only state fields promoted to the permanent layer. Other collections already use separate keys.
try{if(!GameStorage.getItem(STORY_SETTINGS_KEY))savePermanentStorySettings(state)}catch{}

window.addEventListener('pagehide',()=>{if(!window.mobileLaunch&&!storyRestoring)persist()});
