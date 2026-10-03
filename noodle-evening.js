/* Independent supplied artwork slots; cg6.5 is the uncovered noodle cup. */
const NOODLE_CG_IMAGES={"cg1":"assets/noodle-cg/cg1-v1.jpg","cg2":"assets/noodle-cg/cg2-v1.jpg","cg3":"assets/noodle-cg/cg3-v1.jpg","cg4":"assets/noodle-cg/cg4-v1.jpg","cg5":"assets/noodle-cg/cg5-v1.jpg","cg6":"assets/noodle-cg/cg6-v1.jpg","cg6.5":"assets/noodle-cg/cg6.5-v1.jpg","cg7":"assets/noodle-cg/cg7-v1.jpg","cg8":"assets/noodle-cg/cg8-v1.jpg","cg9":"assets/noodle-cg/cg9-v1.jpg","cgLin":"assets/noodle-cg/cgLin-v1.jpg","cgWindow":"assets/noodle-cg/cg-window-v1.jpg"};
const noodleLine=(speaker,text)=>({speaker,text});
function noodleScript(phase){const lied=state.story.noodleEvening.lied;return {
 noWaterIntro:{image:'cg1',rows:[{sfx:'tear',text:'你从柜子里翻出仅剩的一桶泡面。\n直到撕开包装，你才想起自己昨天根本没有买水。'},'你捏着调料包看了一会儿，最后还是把它重新放回泡面桶里。'],next:'noWaterChoice'},
 noWaterChoice:{image:'cg1',choices:[['把泡面收起来','done',0]]},
 intro:{image:'cg3',rows:['你翻出了仅剩的一桶泡面。\n以前你一直去水房接热水，宿舍里没有准备可以烧水的电器。'],next:'kettle'},
 kettle:{image:'cg2',rows:['现在不能随意离开宿舍，你只能看向林晴桌上的烧水壶。'],next:lied?'lieReminder':'borrow'},
 lieReminder:{image:'cg3',rows:['可是不久前，你才告诉她自己已经没有吃的了。\n现在想要吃东西就必须向她借烧水壶，那个谎言显然瞒不下去了。'],next:'borrow'},
 borrow:{image:'cg2',choices:lied?[['继续掩饰','cover',-10],['实话实说','admit',5]]:[['你的烧水壶借我用一下呗','direct',0],['小晴，我想泡面，方便借一下烧水壶嘛？','gentle',5,true]]},
 direct:{image:'cgLin',rows:[noodleLine('me','你的烧水壶借我用一下呗。'),noodleLine('linqing','好。'),noodleLine('linqing','在我桌子上面，你自己拿吧。')],next:'boil'},
 gentle:{image:'cgLin',rows:[noodleLine('me','小晴，我想泡面，方便借一下烧水壶嘛'),noodleLine('me','用完我会洗干净的'),noodleLine('linqing','可以'),noodleLine('linqing','不用特意洗，烧完放回去就好。')],next:'boil'},
 cover:{image:'cgLin',rows:[noodleLine('me','我刚才突然发现我柜子里还有一桶泡面'),noodleLine('me','你的烧水壶可以借我用一下吗？'),'林晴看了看你手里的泡面，停顿片刻',noodleLine('linqing','这样啊'),noodleLine('linqing','在我桌子上面，你自己拿吧')],next:'boil'},
 admit:{image:'cgLin',rows:[noodleLine('me','对不起，我中午没有说实话'),noodleLine('me','我其实还剩一桶泡面'),noodleLine('me','当时我也不知道怎么想的，就下意识就撒谎了'),noodleLine('me','但是你给我递吃的后，我才发现我真是以小人之心度君子之腹了'),noodleLine('me','林晴，对不起'),noodleLine('linqing','我知道'),noodleLine('linqing','这种情况下，因为不安选择隐瞒一些事很正常'),noodleLine('linqing','烧水壶在我桌子上面，你拿吧')],next:'boil'},
 boil:{image:'cg4',rows:['水烧开以后，白色的热气从壶口涌了出来。'],next:'pour'},
 pour:{image:'cg5',rows:[{sfx:'pour',text:'你倒入调料包后把热水倒进了泡面桶。\n原本干硬的面饼一点点沉下去，咸香的热气随之散开。'}],next:'coverBowl'},
 coverBowl:{image:'cg6',rows:['林晴从桌边拿起一本旧习题册，替你压在泡面盖上。',noodleLine('linqing','这样就完美了。'),lied?'她没有再提之前发生的任何事，就好像根本不在意。\n林晴只是把烧水壶的电线收好，又顺手将一包纸巾推到你面前。':'她说完就去把烧水壶的电线收好，又顺手将一包纸巾推到你面前。'],next:'eat'},
 eat:{image:'cg6.5',rows:['三分钟后，你掀开泡面盖子。\n热气一下涌到脸上，调料的香味填满了安静的宿舍。','校园墙、失踪的人、那些互相怀疑的消息，似乎都被短暂隔在了宿舍门外。\n这一刻，你只是坐在自己的椅子上，吃着一桶刚泡好的面。\n好幸福。',noodleLine('linqing','味道怎么样？')],next:'taste'},
 taste:{image:'cg6.5',question:'味道怎么样？',choices:[['很好吃','alone',0],['你要不要尝尝？','share',5]]},
 alone:{image:'cg6.5',rows:[noodleLine('me','很好吃'),'林晴看了你一眼，轻轻笑了一下。随后，她也拿出自己的食物，坐在桌边慢慢吃了起来。','平时根本不会在意的味道，此刻却带来一种近乎奢侈的满足感。'],next:'done'},
 share:{image:'cg6.5',rows:[noodleLine('me','你要不要尝尝？'),noodleLine('linqing','好啊')],next:'smallBowl'},
 smallBowl:{image:'cg7',rows:['她从柜子里拿出一只很小的碗，又拆了一双筷子。','明明是你主动邀请的，她还是只从碗里夹走了两根面条，连汤都没盛。\n两根面孤零零地躺在碗底，看起来甚至有些可怜。'],next:'more'},
 more:{image:'cg8',rows:['你看了她一眼，没有说话，直接又卷起一叉面放进她碗里。','林晴怔了一下。',noodleLine('linqing','太多了吧！'),noodleLine('me','哪多了？'),'她似乎想把面夹回来，筷子在碗边停了停，最后还是没有动。\n林晴低下头，吹散面条上的热气，小口尝了一下。',noodleLine('me','怎么样？'),noodleLine('linqing','嗯，很好吃！')],next:'together'},
 together:{image:'cgWindow',rows:['其实只是最普通的速食泡面。\n窗外依旧安静得反常，手机里还有一堆让人不安的消息。','但至少这几分钟里，你们只是两个被困在宿舍、凑在一起吃泡面的普通学生。','一桶泡面分成两份，谁都没有真正吃饱。\n可有人坐在旁边，总比一个人对着那些规则胡思乱想要好。'],next:'done'}
 }[phase]}
function noodleImageSlot(n,script){return n.phase==='more'&&n.index===script.rows.length-1?'cg9':script.image;}
function noodleUpdateImage(host,n,script){const slot=noodleImageSlot(n,script);if(host.dataset.cgSlot===slot)return;host.dataset.cgSlot=slot;const picture=host.querySelector(':scope > img');if(picture){const previous=picture.cloneNode(true);picture.src=NOODLE_CG_IMAGES[slot];cgImageCrossfade(previous,picture);}}
function noodleSet(phase){const n=state.story.noodleEvening;if(!n||n.phase==='done')return;if(phase==='done')return noodleFinish();n.phase=phase;n.index=0;persist();noodleRender(true)}
function noodleChoose(index){const n=state.story.noodleEvening;if(view!=='noodle-cg'||!n||n.choices[n.phase]!==undefined)return;const choice=noodleScript(n.phase)?.choices?.[index];if(!choice)return;const phase=n.phase;n.choices[phase]=index;if(n.route==='no-water'){persist();return noodleFinish()}state.game.trust??={};state.game.trust.linqing=(state.game.trust.linqing??30)+choice[2];n.phase=choice[1];n.index=0;persist();noodleRender(false);if(choice[3])toast('林晴好感度＋5')}
function noodleFinish(){const n=state.story.noodleEvening;if(!n||n.phase==='done')return;if(n.route==='water'&&n.waterConsumptionPending&&!n.storyWaterConsumed){const water=(state.game.inventory||[]).find(item=>item.name==='矿泉水'&&item.quantity>0);if(water){water.quantity--;n.storyWaterConsumed=1}n.waterConsumptionPending=false}n.phase='done';state.story.eveningNoodlesComplete=true;clearInterval(cgTypingTimer);persist();home()}
function noodleRender(fade=false){const n=state.story.noodleEvening;if(!n||n.phase==='done')return;const previous=captureSceneSnapshot(screen);clearInterval(cgTypingTimer);closeSheet();view='noodle-cg';active=null;rememberRoute();zeroChrome();if(n.phase==='transition'){screen.innerHTML='<section class="fa-time-transition"><h2>时间来到17:00</h2></section>';return}const script=noodleScript(n.phase);if(!script)return;const slot=noodleImageSlot(n,script),image=NOODLE_CG_IMAGES[slot];screen.innerHTML=`<section class="rd-cg noodle-cg" data-cg-slot="${slot}">${image?`<img src="${esc(image)}" alt="宿舍场景">`:'<div class="noodle-cg-blank" aria-label="宿舍CG图片待补充"></div>'}</section>`;const host=screen.firstElementChild;if(script.choices){const priorPhase=n.phase==='noWaterChoice'?'noWaterIntro':n.phase==='borrow'?(n.lied?'lieReminder':'kettle'):null;cgChoiceDialogue(host,script.question?{speaker:'linqing',text:script.question}:noodleScript(priorPhase)?.rows?.slice(-1)[0]);host.insertAdjacentHTML('beforeend',`<div class="noodle-options cg-options with-dialogue">${script.choices.map((choice,i)=>`<button data-noodle-choice="${i}">${esc(cgText(choice[0],'me'))}</button>`).join('')}</div>`)}else{CGDialogue.present(host,script.rows,{index:n.index,firstReplyConfirmed:Object.entries(n.choices||{}).some(([phase,i])=>noodleScript(phase)?.choices?.[i]?.[1]===n.phase),onIndex:i=>{if(state.story.noodleEvening!==n||i>=script.rows.length)return;n.index=i;noodleUpdateImage(host,n,script);persist()},onComplete:()=>{if(state.story.noodleEvening===n)noodleSet(script.next)}})}cgScreenCrossfade(previous)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-noodle-choice]');if(b){e.preventDefault();noodleChoose(Number(b.dataset.noodleChoice))}});
function noodlePrepareRoute(n){
 if(n.route)return;
 // Legacy saves already inside the original scene keep that route and their existing settlement state.
 if(n.phase!=='transition'){n.route='water';n.waterConsumptionPending=true;if(!n.settled){const noodles=(state.game.inventory||[]).find(item=>item.id==='starter-noodles');if(noodles&&noodles.quantity>0){noodles.quantity--;n.storyNoodlesConsumed=1}const healthBefore=state.game.health??100;state.game.health=Math.min(100,healthBefore+5);n.settled=true;window.TapAchievements?.foodRecovered(healthBefore,state.game.health)}persist();return}
 const water=(state.game.inventory||[]).find(item=>item.name==='矿泉水'&&item.quantity>0);
 n.route=water?'water':'no-water';n.waterConsumptionPending=!!water;
 if(water&&!n.settled){const noodles=(state.game.inventory||[]).find(item=>item.id==='starter-noodles');if(noodles&&noodles.quantity>0){noodles.quantity--;n.storyNoodlesConsumed=1}const healthBefore=state.game.health??100;state.game.health=Math.min(100,healthBefore+5);n.settled=true;window.TapAchievements?.foodRecovered(healthBefore,state.game.health)}
 persist();
}
function noodleTick(){if(window.mobileLaunch||['game-menu','nodes','zero-death'].includes(view)||state.game.survivalEnding)return;let n=state.story.noodleEvening;if(!n){if(!state.story.afternoonCommonReady||!state.story.afternoonPickup?.done)return;state.story.noodleEvening=n={phase:'transition',index:0,lied:state.story.foodCG?.choice===0,choices:{},settled:false,due:Date.now()+1500};noodlePrepareRoute(n);state.system.time='17:00';persist();status();noodleRender(true);return}if(n.phase==='done')return;noodlePrepareRoute(n);if(n.phase==='transition'&&Date.now()>=n.due){noodleSet(n.route==='no-water'?'noWaterIntro':'intro');return}if(view==='home')noodleRender(false)}
setInterval(noodleTick,250);
if(view==='noodle-cg'&&state.story.noodleEvening?.phase!=='done')noodleRender(false);
