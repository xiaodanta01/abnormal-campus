/* Profile entry points, resumable menu, noodle choice checkpoints and scene music. */
const profileEntryRenderMessage=renderMessage;
renderMessage=function(m,c){let html=profileEntryRenderMessage(m,c);if(m.sender==='me')return html;const key=['wen','zhao'].find(k=>m.sender===FA_PEOPLE[k].avatar||m.sender===FA_PEOPLE[k].contact);if(!key||html.includes('data-fa-profile='))return html;const face=avatar(m.sender);return html.replace(face,'<button class="npc-avatar-button" data-fa-profile="'+key+'" aria-label="查看'+FA_PEOPLE[key].name+'个人资料">'+face+'</button>')};
const profileEntryChat=openChat;openChat=function(...args){const result=profileEntryChat(...args);faPrivateAvatar();return result};

const GAME_CONTINUE_KEY=STORAGE_KEY+'-continue';
function storeContinueGame(){if(storyRestoring||!state.story.started||['game-menu','nodes'].includes(view)||window.mobileLaunch)return;try{const durable=GameStorage.getItem(STORAGE_KEY);if(durable&&JSON.parse(durable)?.story?.started)GameStorage.setItem(GAME_CONTINUE_KEY,durable)}catch{}}
const continuePersist=persist;persist=function(...args){const result=continuePersist(...args);storeContinueGame();return result};
function cleanupSceneResume(){clearTimeout(zeroTimer);clearTimeout(endingSleepTimer);clearInterval(cgTypingTimer);pickup16Cleanup();closeSheet();stopReading();document.querySelectorAll('.opening-message,.zero-transition,.ending-morning-veil,#morning-title,#fm-campus-notice,#hg-notification,#cg-recovery-confirm,#evening-notification').forEach(el=>el.remove());for(const key of Object.keys(drafts))delete drafts[key]}
function resumeStoryScene(snapshot){const route=state.story.route||{view:'home'};view='home';active=null;zeroChrome();syncMobileSettings();mobileFixedPortraits();migrateJiangningAvatar(state);
 if(state.story.noodleEvening&&state.story.noodleEvening.phase!=='done')noodleRender(false);
 else if(state.story.afternoonPickup&&!state.story.afternoonPickup.done){pickup16Base.home();pickup16Render()}
 else if(state.story.dayTwoPickup&&!state.story.dayTwoPickup.done){if(state.story.dayTwoPickup.phase==='d2-solo-chat')pickupDay2OpenLinChat();else pickup16Render()}
 else if(route.view==='role-discussion-cg')foodRender(false);
 else if(isFreeActionSegment(state)){const f=freeState();if(f.run)faReturnToAction();else if(f.transition)faTransition();else if(route.view==='free-action')freePanel();else{home();freePrompt()}}
 else if(route.view==='ending-cg')endingScene(false);
 else if(zeroLock()||z().script||z().phase==='choice')zeroResume();
 else if(route.view==='chat'&&route.active)openChat(route.active);
 else if(route.view==='post'&&route.active)postDetail(route.active);
 else if(route.view==='messages')chatList();
 else if(C.apps.some(a=>a.id===route.view))openApp(route.view);
 else home();persist();syncNoodleMusic();}
actions['game-continue']=()=>{let snapshot;try{snapshot=JSON.parse(GameStorage.getItem(GAME_CONTINUE_KEY)||'null')}catch{}if(!snapshot?.story?.started)return toast('暂无可继续的游戏');resumeGameSnapshot(snapshot)};
requestZeroMenu=function(){if(['game-menu','nodes'].includes(view))return zeroMenu();if(zeroLock()&&z().phase!=='dead')return;persist();zeroMenu();syncNoodleMusic()};
actions['zero-menu']=requestZeroMenu;actions['zero-menu-confirm']=requestZeroMenu;
const continueZeroMenu=zeroMenu;zeroMenu=function(...args){if(!['game-menu','nodes'].includes(view))storeContinueGame();return continueZeroMenu(...args)};

const NOODLE_CHOICE_NODES={noWaterChoice:'泡面：把泡面收起来',borrow:'泡面：借烧水壶',taste:'泡面：味道怎么样'};
for(const [phase,title] of Object.entries(NOODLE_CHOICE_NODES))STORY_CHOICES.push({id:'noodle-choice-'+phase,title,day:'第一日 · 17:00',chat:null});
function captureNoodleChoice(){const n=state.story.noodleEvening;if(!n||!NOODLE_CHOICE_NODES[n.phase]||n.choices[n.phase]!==undefined)return;return captureStoryNode('noodle-choice-'+n.phase,state,{route:{view:'noodle-cg',active:null}})}
const choiceNoodleRender=noodleRender;noodleRender=function(...args){const result=choiceNoodleRender(...args);if(view==='noodle-cg')captureNoodleChoice();syncNoodleMusic();return result};
function syncNoodleMusic(){}
storeContinueGame();if(view==='chat')openChat(active);if(view==='noodle-cg')captureNoodleChoice();
