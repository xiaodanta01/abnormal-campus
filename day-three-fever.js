/* Day 3 fever scene: shared dialogue renderer and whole-state checkpoints. */
const D3_FEVER_IMAGES={desk:'assets/day2-midday-desk.jpg',lin:'assets/day3-fever-linqing-hd.jpg',medicine:'assets/day3-fever-medicine.jpg'};
const D3_FEVER_NODES={answerChoice:'回应林晴的呼唤',revealChoice:'询问林晴出门的原因'};
for(const [key,title] of Object.entries(D3_FEVER_NODES))STORY_CHOICES.push({id:'day3-fever-'+key,title,day:'第三日 · 午前',chat:null});
function d3Fever(){return state.story.dayThreeFever}
function d3FeverHasDoorRecord(){return !!(state.story.freeAction?.completed?.includes('door')||state.story.dayTwoFreeAction?.completed?.includes('d2door')||[...(state.story.freeAction?.clues||[]),...(state.story.dayTwoFreeAction?.clues||[])].some(c=>['door','day2-d2door'].includes(c.id)))}
function d3FeverChoices(key){return {
 wakeChoice:[{id:'what',label:'我这是怎么了？',next:'fever'}],
 medicineChoice:[{id:'where',label:'这个药是哪里来的',reply:'你这个药是哪里来的？',next:'where'},{id:'taken',label:'你给我吃了这个吗',reply:'你给我吃了这个吗？',next:'taken'}],
 outsideChoice:[{id:'heard',label:'可我听见你出门的声音了',next:'caught'}],
 answerChoice:[{id:'here',label:'我在',next:'questions',trust:10},{id:'yes',label:'嗯',next:'questions'}],
 revealChoice:[{id:'why',label:'所以现在，可以告诉我为什么了吗？',next:'reveal'},{id:'care',label:'你就这么担心我出事，担心到露出马脚也无所谓了吗？',next:'care',trust:10}],
 identityChoice:[{id:'invincible',label:'那你岂不是无敌了？',next:'invincible'},...(d3FeverHasDoorRecord()?[{id:'door',label:'原来是这样，你那天晚上开门是因为这个吗？',next:'door'}]:[]),{id:'jiang',label:'看来江晓说的都是真的',next:'jiang'}]
}[key]||[]}
function d3FeverScript(key){const lin=text=>({speaker:'linqing',text:text.replaceAll('【玩家名字】',state.profile.name)}),me=text=>({speaker:'me',text});return {
 intro:{image:'desk',rows:['一阵突如其来的眩晕感袭来，眼前的景象也跟着模糊起来。','直到这时，你才发现自己冷得厉害。','醒来后，那股寒意就一直缠着你，身体也隐隐发烫，只是刚才群聊里的争执让你气得顾不上留意。',lin('【玩家名字】？！你怎么了？'),'意识沉入黑暗之前，你隐约听见了林晴焦急的呼唤。','还有……',{sfx:'doorClose',text:'关门声。'}],next:'black'},
 wake:{image:'lin',rows:[lin('你怎么样？')],next:'wakeChoice'},
 fever:{image:'lin',rows:[lin('没什么，就是有点发烧了'),'林晴把话说得轻描淡写，可她藏不住语气里的慌乱，和看见你醒来时眼底那一瞬间的欣喜。'],next:'medicine'},
 medicine:{image:'medicine',rows:['你抬起头，视线落在桌上放着的一盒退烧药。'],next:'medicineChoice'},
 where:{image:'medicine',rows:[lin('我一直都有备着这种药')],next:'outsideChoice'},
 taken:{image:'medicine',rows:[lin('嗯'),me('药是哪里来的？'),lin('我一直都有备着这种药')],next:'outsideChoice'},
 heard:{image:'medicine',rows:[me('可我听见你出门的声音了')],next:'caught'},
 caught:{image:'lin',rows:['林晴脸上的表情有些僵住，显然没料到你会这么说。',lin('【玩家名字】…')],next:'answerChoice'},
 questions:{image:'lin',rows:[lin('你是不是在想，我为什么这个时候出门了'),lin('却还能安然无恙的回来'),lin('还有我又是去哪买的退烧药')],next:'revealChoice'},
 care:{image:'lin',rows:['林晴听到你这句话，脸上的表情有一瞬间变得不自然。','她现在似乎不太敢直视你的眼睛。'],next:'reveal'},
 reveal:{image:'lin',rows:[lin('那天晚上我没有获得任何身份'),lin('这里的规则好像对我不起任何作用'),lin('我…我也不知道是为什么')],next:'identityChoice'},
 invincible:{image:'lin',rows:[me('难怪你根本不怕缺吃的！'),lin('哎，你呀……')],next:'free'},
 door:{image:'lin',rows:[lin('嗯，算是一部分原因吧'),lin('我当时想试试，我会不会因为规则而消失'),lin('然而并没有')],next:'free'},
 jiang:{image:'lin',rows:[me('不管检举你和谁，都会显示不同'),lin('是的……我也很内疚'),me('这不怪你')],next:'free'}
}[key]}
function d3FeverBusy(){return state.game.day===3&&d3Fever()&&d3Fever().phase!=='done'}
function d3FeverApplyDiscomfort(){const q=d3Fever();if(q?.phase!=='free'||q.discomfortSpirit)return false;const before=state.game.spirit??100;state.game.spirit=before-20;q.discomfortSpirit={before,after:state.game.spirit,delta:-20};return true}
function d3FeverStart(){if(d3Fever())return;state.story.dayThreeFever={phase:'cg',script:'intro',index:0,decisions:{},dizzyElapsed:0};d3FeverLastTick=0;persist();d3FeverRender()}
function d3FeverNext(key,reply=null){const q=d3Fever();if(!q)return;clearInterval(cgTypingTimer);q.reply=reply;q.index=0;d3FeverLastTick=Date.now();if(key==='black'||key==='free'){q.phase=key;q.remaining=key==='black'?3600:2100}else if(d3FeverChoices(key).length){q.previous=q.script;q.script=key;q.phase='choice'}else{q.script=key;q.phase='cg'}persist();d3FeverRender()}
function d3FeverChoose(key,id){const q=d3Fever();if(!q||q.phase!=='choice'||q.script!==key||view!=='day3-fever-cg'||q.decisions[key]!==undefined)return;const option=d3FeverChoices(key).find(c=>c.id===id);if(!option)return;q.decisions[key]=id;if(option.trust){state.game.trust??={};state.game.trust.linqing=(state.game.trust.linqing??30)+option.trust}if(key==='outsideChoice'){d3FeverNext('heard');return}d3FeverNext(option.next,option.reply||option.label)}
function d3FeverRender(){const q=d3Fever();if(!q||q.phase==='done')return;d3FeverApplyDiscomfort();const previous=captureSceneSnapshot(screen);closeSheet();stopReading();document.querySelector('#hg-notification')?.remove();view='day3-fever-cg';active=null;rememberRoute();zeroChrome();
 if(q.phase==='black'||q.phase==='free'){screen.innerHTML=q.phase==='black'?'<section class="d3-fever-black" aria-label="意识沉入黑暗"></section>':'<section class="fa-time-transition"><h2>时间来到11:51</h2><p>你可以选择进食，或者进行推理。</p><p>因为身体不适，你的精神值下降了20。</p></section>';zeroDissolve(previous,600);persist();return}
 const script=d3FeverScript(q.phase==='choice'?q.previous:q.script),dizzy=q.script==='intro';screen.innerHTML='<section class="rd-cg d3-fever-scene'+(dizzy?' d3-fever-dizzy':'')+'"><img src="'+D3_FEVER_IMAGES[script.image]+'" alt="'+({desk:'书桌上的手机',lin:'身旁的林晴',medicine:'桌上的退烧药'}[script.image])+'"'+(dizzy?' style="animation-delay:-'+q.dizzyElapsed+'ms"':'')+'></section>';const host=screen.firstElementChild;
 if(D3_FEVER_NODES[q.script])d2Capture('day3-fever-'+q.script,{view,active:null});
 if(q.phase==='choice'){cgChoiceDialogue(host,script.rows.at(-1));host.insertAdjacentHTML('beforeend','<div class="cg-options">'+d3FeverChoices(q.script).map(c=>'<button type="button" data-d3-fever-key="'+q.script+'" data-d3-fever-choice="'+c.id+'">'+esc(cgText(c.label,'me'))+'</button>').join('')+'</div>')}else{const rows=q.reply?[{speaker:'me',text:q.reply},...script.rows]:script.rows;CGDialogue.present(host,rows,{index:q.index,firstReplyConfirmed:!!q.reply||q.script==='heard',onIndex:i=>{if(d3Fever()===q){q.index=i;persist()}},onComplete:()=>{if(d3Fever()===q&&q.phase==='cg')d3FeverNext(script.next)}})}
 cgScreenCrossfade(previous);persist();
}
function d3Free(){return state.story.dayThreeFreeAction??={unlocked:false,completed:[],newCards:[],seenUnlocks:[],clues:structuredClone(state.story.dayTwoFreeAction?.clues||state.story.freeAction?.clues||[]),run:null,transition:null}}
// Use the same single-stroke SVG renderer and tile palette as the other home apps.
icons.reasoning='M9 17h6 M10 21h4 M9 17v-1.5c0-1.3-3-2.5-3-6a6 6 0 0 1 12 0c0 3.5-3 4.7-3 6V17 M12 1v1 M3 5l1.5 1 M21 5l-1.5 1 M2 11h1 M21 11h1';
if(!C.apps.some(a=>a.id==='reasoning'))C.apps.push({id:'reasoning',name:'进行推理',icon:'reasoning',tone:'sand',visible:false,locked:false});
if(!C.homeLayout.main.includes('reasoning'))C.homeLayout.main.push('reasoning');
function d3ReasoningReady(){return state.game.day===3&&(d3Fever()?.phase==='done'||d3Free().unlocked)}
function d3ReasoningPanel(){if(!d3ReasoningReady())return;closeSheet();view='reasoning';active=null;rememberRoute();screen.innerHTML='<section class="app-page">'+head('进行推理')+'</section>';persist()}
const d3FreeAppButtonBase=appButton;appButton=function(a){if(state.game.day===4&&a.id==='free-action')return '';let html=d3FreeAppButtonBase(a);if(state.game.day===3&&a.id==='free-action'||state.game.day===4&&a.id==='reasoning')html=html.replace('<button ','<button disabled aria-disabled="true" ').replace('class="app-button','class="app-button locked');return html};
const d3FreeStateBase=freeState;freeState=function(){return state.game.day===3?d3Free():d3FreeStateBase()};
const d3FreeSyncBase=freeSync;freeSync=function(){const reasoning=C.apps.find(a=>a.id==='reasoning');reasoning.visible=state.game.day===4||!!d3ReasoningReady();reasoning.locked=state.game.day===4;if(state.game.day!==3&&state.game.day!==4)return d3FreeSyncBase();const app=C.apps.find(a=>a.id==='free-action');if(app){app.visible=state.game.day===3;app.locked=true}};
const d3FreePanelBase=freePanel;freePanel=function(){if(state.game.day===4)return;if(state.game.day!==3)return d3FreePanelBase();toast('第三日暂不开放自由行动')};
const d3FreeConfirmBase=freeConfirm;freeConfirm=function(...args){if(state.game.day===3)return;return d3FreeConfirmBase(...args)};
const d3FreeRunBase=faRunStart;faRunStart=function(...args){if(state.game.day===3){freeActionEnergyBlocked();return}return d3FreeRunBase(...args)};
function d3FeverFinish(){const q=d3Fever();if(q?.phase!=='free')return;q.phase='done';state.system.time='11:51';state.game.period='上午';d3Free().unlocked=true;freeSync();view='home';persist();home()}
let d3FeverLastTick=0,d3FeverLastSave=0;
function d3FeverTick(){const now=Date.now(),image=screen.querySelector('.d3-fever-dizzy>img');if(image)image.style.animationPlayState=d3Paused()?'paused':'running';if(d3Paused()){d3FeverLastTick=0;return}if(state.game.day===3&&!d3Fever()&&d3Defense()?.phase==='done'&&d3Defense()?.decisions?.reassure){d3FeverStart();return}const q=d3Fever();if(!q||q.phase==='done'||view!=='day3-fever-cg'){d3FeverLastTick=0;return}const elapsed=d3FeverLastTick?Math.max(0,now-d3FeverLastTick):0;d3FeverLastTick=now;if(q.script==='intro'&&q.phase==='cg')q.dizzyElapsed=Math.min(12000,q.dizzyElapsed+elapsed);if(['black','free'].includes(q.phase)){q.remaining=Math.max(0,q.remaining-elapsed);if(!q.remaining){if(q.phase==='black')d3FeverNext('wake');else d3FeverFinish();return}}if(now-d3FeverLastSave>=1000){d3FeverLastSave=now;persist()}}
const d3FeverHomeBase=home;home=function(...args){if(d3FeverBusy()&&!d3Paused())return d3FeverRender();return d3FeverHomeBase(...args)};
const d3FeverAppBase=openApp;openApp=function(...args){if(d3FeverBusy()&&!d3Paused())return d3FeverRender();if(args[0]==='reasoning')return d3ReasoningPanel();return d3FeverAppBase(...args)};
const d3FeverCleanupBase=cleanupSceneResume;cleanupSceneResume=function(...args){d3FeverLastTick=0;return d3FeverCleanupBase(...args)};
const d3FeverResumeBase=resumeStoryScene;resumeStoryScene=function(snapshot,...args){const q=snapshot?.story?.dayThreeFever;if(!q||q.phase==='done')return d3FeverResumeBase(snapshot,...args);d3FeverRender();persist()};
window.addEventListener('click',e=>{const b=e.target.closest('[data-d3-fever-choice]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();d3FeverChoose(b.dataset.d3FeverKey,b.dataset.d3FeverChoice)},true);
document.addEventListener('visibilitychange',()=>{d3FeverLastTick=0});
setInterval(d3FeverTick,100);
if(!d3Paused()&&d3FeverBusy())d3FeverRender();

freeSync();
if(state.game.day===3&&!d3Paused()&&view==='home')home();
