/* Third-night continuation. Uses the existing chat, CG, shopping and checkpoint primitives. */
const D3_FIFTH_RULE_ID='chapter-five-midnight-rules';
const D3_FIFTH_RULE_BODY="今晚，系统不接收本人提交的集体检举票。\n请在 21:00 前，指定一名仍在校的人作为你的「委托人」。\n注意：任何身份都可以成为委托人，同时任何人也可以申请成为委托人。\n21:00 时，委托人的检举对象，将同时成为你的检举对象。\n委托人21:00前可以更换；委托人的选择，在结算前对委托者保密。\n未指定委托人，视为放弃检举票。\n\n阵营结算将在今晚1点学生会行动后进行。";
const D3_NIGHT_BLUR_MS=4800;
const D3_NIGHT_IMAGE='assets/day3-night-bed.jpg';
STORY_CHOICES.push({id:'day3-night-story',title:'林晴的睡前故事',day:'第三日 · 深夜',chat:null},{id:'day3-night-storyChoice',title:'回应林晴的睡前故事',day:'第三日 · 深夜',chat:null});
function d3Night(){return state.story.dayThreeNight}
function d3NightGroupRows(){return [
 ['songyan','你们学生会真是打得一手好算盘'],
 ['songyan','要不是【玩家名字】问起了取件的事，让我察觉到了一丝不对劲'],
 ['songyan','还真就要被耍的团团转了'],
 ['zhoumo',reportDeparted('温宁')?'许蓁蓁和蒋小雪，你们有什么要说的吗':'许蓁蓁，蒋小雪还有温宁，你们有什么要说的吗'],
 ['yeshu','我也是被江柠骗了，我以为她是好人才帮她的']
 ]}
function d3NightAlive(key){return !reportDeparted(GROUP_SUSPECT_NAMES[key]||dayTwoPerson(key).name.replace(/[（(].*$/,''))}
function d3NightStart(){if(d3Night()||state.game.day!==3||d3Evening()?.phase!=='done'||state.story.dayThreeReport?.groupResult?.target!=='jiangning'||state.game.survivalEnding)return;state.story.dayThreeNight={phase:'group',date:state.system.date,index:0,remaining:messageSendDelay(),decisions:{}};persist()}
function d3NightWrite(who,text,index){const n=d3Night(),rows=state.messages[HG_ID]??=[],id='day3-night-group-'+index;if(rows.some(m=>m.id===id))return;const p=dayTwoPerson(who);text=d3EveningText(text);rows.push({id,type:'text',sender:p.avatar,name:p.name,hgWho:who,text,time:state.system.time,gameDate:n.date,status:'read'});const c=hgContact();if(c){c.preview=text;c.time=state.system.time;if(view!=='chat'||active!==HG_ID)c.unread=(c.unread||0)+1}persist();if(view==='chat'&&active===HG_ID)openChat(HG_ID);else {document.querySelector('#hg-notification')?.remove();hgNotice('group');playNotificationSound('message',document.querySelector('#hg-notification'))}}
function d3NightPurchase(expired=false){const n=d3Night();if(!n||!['transition','explore','purchase-required','bed'].includes(n.phase)||postHasTomorrowSupplies())return false;if(expired){n.phase='purchase-required';n.remaining=0;persist();if(view==='day3-night')home();postOpenPurchase()}sheet('睡前储备物资','<p>明天的物资需要提前订购。睡觉前，先购买至少一件食物或饮用水。</p><button class="primary" data-action="post-purchase-open">前往购买</button><button class="secondary" data-action="close">再看看</button>');return true}
function d3NightTransition(){const n=d3Night();n.phase='transition';n.remaining=2000;state.system.time='22:00';state.game.period='晚上';document.querySelectorAll('#hg-notification,#report-notification,#d3-evening-notice').forEach(e=>e.remove());d3NightRender()}
function d3NightBed(){const n=d3Night();if(!n||d3NightPurchase(true))return;n.phase='bed';earlySleepButton.hidden=true;d3NightRender()}
function d3NightSleep(){const n=d3Night();if(n?.phase!=='bed'||d3NightPurchase(true))return;n.phase='midnight-wait';n.remaining=1500;d3NightRender()}
function d3FifthPublish(){const n=d3Night();if(n.rulesPublished)return;n.rulesPublished=true;n.phase='midnight-notice';state.system.date=deliveryDateNext(n.date);state.system.time='00:00';
 // Day 4 morning has not been authored: the current night remains owned by Day 3.
 if(!state.forumPosts.some(p=>p.id===D3_FIFTH_RULE_ID))state.forumPosts.push({id:D3_FIFTH_RULE_ID,author:'campus-system',name:'',nightService:true,official:true,tag:'校园新规',category:'校园新规',title:'【校园新规-终章】',body:D3_FIFTH_RULE_BODY,date:state.system.date,time:'00:00',likes:0,replies:[]});
 const rows=state.messages[DAY_ONE_REPORT_ID]??=[];if(!rows.some(m=>m.id===D3_FIFTH_RULE_ID))rows.push({id:D3_FIFTH_RULE_ID,type:'text',sender:'chat_report_black',name:'',text:'校园墙 · 转发帖子：终章规则已发布',time:'00:00',gameDate:state.system.date});const c=reportContact();if(c){c.preview='终章规则已发布';c.time='00:00';c.unread=(c.unread||0)+1}persist();status();d3FifthNotice()}
function d3FifthNotice(){if(document.querySelector('#d3-fifth-notice'))return;const e=document.createElement('div');e.id='d3-fifth-notice';e.className='opening-message';e.innerHTML='<button class="opening-body" data-action="d3-fifth-open"><span>'+avatar('chat_report_black')+'</span><span><small>讯息 · 00:00</small><strong>校园墙 · 转发帖子</strong><span>终章规则已发布</span></span></button>';document.querySelector('#phone').append(e);playNotificationSound('message',e)}
function d3FifthOpen(){const n=d3Night();if(!n||!['midnight-notice','midnight-reading'].includes(n.phase))return;n.phase='midnight-reading';document.querySelector('#d3-fifth-notice')?.remove();if(reportContact())reportContact().unread=0;d3NightInternal=true;try{postDetail(D3_FIFTH_RULE_ID)}finally{d3NightInternal=false}zeroChrome();refreshPhoneBack();persist()}
function d3NightChoices(key){return {
 awake:[['awake','还没有','question'],['rules','刚看完新规则，怎么了','question']],
 meaning:[['meaning','什么意思？','morning']],
 memory:[['class','应该是在上课吧？','class'],['forgot','我……不记得了','forgot']],
 know:[['know','林晴，你是不是知道些什么','offer']],
 storyChoice:[['ready','好啊，我准备好了','pan'],['yes','嗯嗯','pan'],['scary','恐怖故事我可不听哦','laugh',10]],
 read:[['read','看过','neverland'],['unread','没有看过诶','story']],
 home:[['home','可能因为她的家不在那里','goodnight'],['adventure','温蒂或许只把梦幻岛当一次冒险','goodnight']],
 night:[['night','嗯，晚安','end']]
 }[key]||[]}
function d3NightScript(key){const lin=text=>({speaker:'linqing',text:d3EveningText(text)}),me=text=>({speaker:'me',text});return {
 intro:{rows:[lin('【玩家名字】，你睡了吗'),'对面的林晴突然叫你，声音很轻。'],next:'awake'},
 question:{rows:[lin('你…还记得自己是怎么来到这里的吗')],next:'blur'},
 doubt:{rows:['林晴这句话是什么意思？什么叫记不记得自己是怎么来这里的？','你不是一直在这里上学吗，是东川大学大二的学生吗？','舍友知道你的名字，你也认识她们，这不会错的。'],next:'meaning'},
 morning:{rows:[lin('你还记得9月7号的早上你在做什么吗？')],next:'memory'},
 class:{rows:[lin('哦哦')],next:'recall'},forgot:{rows:[lin('好吧')],next:'recall'},
 recall:{rows:['早上的事情你好像真的记不清了…','无论怎样回想，早晨的记忆都像被什么东西抹去了一样。','脑海里唯一清晰的，只有林晴发来的那句话——“你看到校园墙上的东西了吗？”','可为什么偏偏记不得早上发生的事？','是因为每天都按着课表上课，日复一日，连记忆也渐渐混在了一起吗？','不…这不对。'],next:'know'},
 offer:{rows:[lin('我还不确定'),lin('好了，不聊这些了'),lin('说不定就是最近压力太大了，再加上你还生病了'),lin('【玩家名字】，我给你讲个睡前故事吧？')],next:'storyChoice'},
 laugh:{rows:['林晴又被你逗笑了。面对你，她的笑点似乎总是那么低'],next:'pan'},
 pan:{rows:[lin('你看过《彼得潘》吗？')],next:'read'},
 story:{rows:[lin('有一个永远不会长大的男孩，叫彼得潘。'),lin('他住在一个叫梦幻岛的地方。'),lin('后来，一个叫温蒂的孩子和其他人来到那里，陪他经历了很多事情'),me('然后呢？'),lin('后来他们都回家了，彼得潘还是留在梦幻岛'),lin('不过我小时候特别喜欢梦幻岛'),lin('那里不用上课，不会长大，每天都可以到处冒险'),lin('所以我以前一直不明白，温蒂最后为什么还要回去')],next:'home'},
 neverland:{rows:[lin('我小时候特别喜欢梦幻岛'),lin('那里不用上课，不会长大，每天都可以到处冒险'),lin('所以我以前一直不明白，温蒂最后为什么还要回去')],next:'home'},
 goodnight:{rows:[lin('嗯，我也是这么想的'),lin('就是想和你分享这个小故事'),lin('好啦，时间不早了，睡觉吧')],next:'night'},
 end:{rows:[],next:'finished'}
 }[key]}
function d3NightNext(key,reply=null){const n=d3Night();if(!n)return;clearInterval(cgTypingTimer);n.reply=reply;n.cgIndex=0;if(key==='finished'){n.phase='finished';d3NightRender();return}if(key==='blur'){n.phase='blur';n.remaining=D3_NIGHT_BLUR_MS;n.blurElapsed=0;n.blurDuration=D3_NIGHT_BLUR_MS}else if(d3NightChoices(key).length){n.previous=n.script;n.script=key;n.phase='choice'}else{n.script=key;n.phase='cg'}d3NightLastTick=Date.now();persist();d3NightRender()}
function d3NightChoose(key,id){const n=d3Night();if(n?.phase!=='choice'||n.script!==key||view!=='day3-night'||n.decisions[key]!==undefined)return;const o=d3NightChoices(key).find(o=>o[0]===id);if(!o)return;n.decisions[key]=id;if(o[3]){state.game.trust??={};state.game.trust.linqing=(state.game.trust.linqing??30)+o[3]}d3NightNext(o[2],o[1])}
function d3NightStoryStart(){if(d3Night()?.phase!=='midnight-reading')return;midnightContinue.hidden=true;d3NightNext('intro');d2Capture('day3-night-story',{view:'day3-night',active:null})}
function d3NightRender(){const n=d3Night();if(!n)return;const previous=captureSceneSnapshot(screen);closeSheet();stopReading();view='day3-night';active=null;rememberRoute();zeroChrome();
 if(n.phase==='transition')screen.innerHTML='<section class="fa-time-transition"><h2>时间来到22点</h2><p>该阶段你有60s可以进行购物和其他探索</p><p>明天的物资需要提前订购。睡觉前，先购买至少一件食物或饮用水。</p></section>';
 else if(n.phase==='bed')screen.innerHTML='<section class="ending-scene"><img src="'+DAY_ZERO_BEDROOM+'" alt="夜晚的宿舍"><div class="cg-options"><button class="ending-rest" data-action="d3-night-sleep">上床睡觉</button></div></section>';
 else if(n.phase==='finished')screen.innerHTML='<section class="ending-scene" style="background:#000"><div class="ending-shade"><p>第三日结束</p><button class="secondary" data-action="zero-menu">返回主页</button></div></section>';
 else if(['midnight-wait','midnight-notice'].includes(n.phase))screen.innerHTML='<section class="ending-scene" style="background:#000" aria-label="'+(n.phase==='finished'?'晚安':'夜晚')+'"></section>';
 else {
 screen.innerHTML='<section class="rd-cg"><img class="'+(n.phase==='blur'?'d3-night-blur':'')+'" '+(n.phase==='blur'?'style="animation-delay:-'+(n.blurElapsed||0)+'ms"':'')+' src="'+D3_NIGHT_IMAGE+'" alt="夜晚的宿舍床铺"></section>';const host=screen.firstElementChild;
 if(n.phase==='choice'){cgChoiceDialogue(host,d3NightScript(n.previous).rows.at(-1));host.insertAdjacentHTML('beforeend','<div class="cg-options">'+d3NightChoices(n.script).map(([id,label])=>'<button type="button" data-d3-night-key="'+n.script+'" data-d3-night-choice="'+id+'">'+esc(label)+'</button>').join('')+'</div>');if(n.script==='storyChoice')d2Capture('day3-night-storyChoice',{view,active:null})}
 else if(n.phase!=='blur'){const script=d3NightScript(n.script),rows=n.reply?[{speaker:'me',text:n.reply},...script.rows]:script.rows;CGDialogue.present(host,rows,{index:n.cgIndex||0,firstReplyConfirmed:!!n.reply,onIndex:i=>{if(d3Night()===n){n.cgIndex=i;persist()}},onComplete:()=>{if(d3Night()===n&&n.phase==='cg')d3NightNext(script.next)}})}
 }
 if(n.phase!=='blur'){if(['transition','midnight-wait','finished'].includes(n.phase))zeroDissolve(previous,600);else cgScreenCrossfade(previous)}persist();
}
let d3NightInternal=false,d3NightLastTick=0,d3NightLastSave=0;
function d3NightBusy(){return !d3NightInternal&&['transition','bed','midnight-wait','midnight-notice','midnight-reading','cg','choice','blur','finished'].includes(d3Night()?.phase)}
function d3NightTick(){const now=Date.now();if(d3Paused()){d3NightLastTick=0;const img=screen.querySelector('.d3-night-blur');if(img)img.style.animationPlayState='paused';return}const elapsed=d3NightLastTick?now-d3NightLastTick:0;d3NightLastTick=now;d3NightStart();const n=d3Night();if(!n)return;const img=screen.querySelector('.d3-night-blur');if(img)img.style.animationPlayState='running';
 if(n.phase==='group'&&n.index>0&&(view!=='chat'||active!==HG_ID))return;
 if(['group','group-wait','transition','explore','midnight-wait','blur'].includes(n.phase)){
 n.remaining=Math.max(0,n.remaining-elapsed);if(n.phase==='blur')n.blurElapsed=D3_NIGHT_BLUR_MS-n.remaining;if(n.remaining){if(now-d3NightLastSave>=1000){d3NightLastSave=now;persist()}return}
 if(n.phase==='group'){const rows=d3NightGroupRows();while(n.index<rows.length&&!d3NightAlive(rows[n.index][0]))n.index++;if(n.index>=rows.length){n.phase='group-wait';n.remaining=3000;persist();return}const i=n.index++,row=rows[i];n.remaining=messageSendDelay();const more=rows.slice(n.index).some(r=>d3NightAlive(r[0]));if(!more){n.phase='group-wait';n.remaining=3000}d3NightWrite(row[0],row[1],i)}
 else if(n.phase==='group-wait')d3NightTransition();
 else if(n.phase==='transition'){n.phase='explore';n.remaining=60000;persist();home();syncEarlySleepButton();d3NightPurchase()}
 else if(n.phase==='explore')d3NightBed();else if(n.phase==='midnight-wait')d3FifthPublish();else if(n.phase==='blur')d3NightNext('doubt');
 }
}
actions['d3-night-sleep']=d3NightSleep;actions['d3-fifth-open']=d3FifthOpen;actions['d3-night-story']=d3NightStoryStart;
const d3NightPurchaseBase=postPurchasePrompt;postPurchasePrompt=function(expired=false){return ['transition','explore','purchase-required','bed'].includes(d3Night()?.phase)?d3NightPurchase(expired):d3NightPurchaseBase(expired)};
const d3NightEarlyBase=earlySleepAvailable;earlySleepAvailable=function(){return ['explore','purchase-required'].includes(d3Night()?.phase)?!d3Paused():d3NightEarlyBase()};
const d3NightEarlyConfirmBase=actions['post-early-sleep-confirm'];actions['post-early-sleep-confirm']=()=>{if(['explore','purchase-required'].includes(d3Night()?.phase)){if(earlySleepAvailable())d3NightBed()}else d3NightEarlyConfirmBase()};
function d3FifthReading(){return view==='post'&&active===D3_FIFTH_RULE_ID&&d3Night()?.phase==='midnight-reading'}
const d3FifthReadingBase=midnightRulesReading;midnightRulesReading=function(){return d3FifthReading()||d3FifthReadingBase()};
const d3FifthContinueBase=midnightContinue.onclick;midnightContinue.onclick=function(event){if(d3FifthReading()){d3NightStoryStart();return}return d3FifthContinueBase.call(this,event)};
const d3FifthPostBase=postDetail;postDetail=function(id,...args){if(id===D3_FIFTH_RULE_ID){const post=state.forumPosts.find(p=>p.id===id);if(post){post.title='【校园新规-终章】';post.body=D3_FIFTH_RULE_BODY}}const result=d3FifthPostBase(id,...args);if(id===D3_FIFTH_RULE_ID&&d3Night()?.phase==='midnight-reading'){screen.querySelector('.page-head button[aria-label^="返回"]')?.remove();midnightContinue.hidden=false;zeroChrome();refreshPhoneBack()}return result};
const d3NightLockBase=zeroLock;zeroLock=function(){return d3NightBusy()&&!['game-menu','nodes'].includes(view)||d3NightLockBase()};
const d3NightHomeBase=home;home=function(...args){if(d3NightBusy()&&!d3Paused())return;return d3NightHomeBase(...args)};
const d3NightAppBase=openApp;openApp=function(...args){if(d3NightBusy()&&!d3Paused())return;return d3NightAppBase(...args)};
const d3NightCleanupBase=cleanupSceneResume;cleanupSceneResume=function(...args){d3NightLastTick=0;document.querySelector('#d3-fifth-notice')?.remove();return d3NightCleanupBase(...args)};
const d3NightResumeBase=resumeStoryScene;resumeStoryScene=function(snapshot,...args){const n=snapshot?.story?.dayThreeNight;if(!n)return d3NightResumeBase(snapshot,...args);if(n.phase==='midnight-reading')d3FifthOpen();else if(['group','group-wait','explore','purchase-required'].includes(n.phase)){if(snapshot.story.route?.view==='chat')openChat(HG_ID);else{view='home';home();if(n.phase==='group'&&n.index)hgNotice('group')}}else{d3NightRender();if(n.phase==='midnight-notice')d3FifthNotice()}syncEarlySleepButton();persist()};
window.addEventListener('click',e=>{const action=e.target.closest('[data-action]')?.dataset.action;if(['d3-night-sleep','d3-fifth-open','d3-night-story'].includes(action)){e.preventDefault();e.stopImmediatePropagation();actions[action]();return}const b=e.target.closest('[data-d3-night-choice]');if(b){e.preventDefault();e.stopImmediatePropagation();d3NightChoose(b.dataset.d3NightKey,b.dataset.d3NightChoice)}},true);
document.addEventListener('visibilitychange',()=>{d3NightLastTick=0});setInterval(d3NightTick,100);
if(d3Night()?.phase==='blur'&&d3Night().blurDuration!==D3_NIGHT_BLUR_MS)Object.assign(d3Night(),{remaining:D3_NIGHT_BLUR_MS,blurElapsed:0,blurDuration:D3_NIGHT_BLUR_MS});
if(!d3Paused()&&d3Night()){const n=d3Night();if(n.phase==='midnight-reading')d3FifthOpen();else if(d3NightBusy()){d3NightRender();if(n.phase==='midnight-notice')d3FifthNotice()}}

// Refresh previously published placeholder text without publishing a second post.
{const post=state.forumPosts.find(p=>p.id===D3_FIFTH_RULE_ID);if(post){post.title='【校园新规-终章】';post.body=D3_FIFTH_RULE_BODY}for(const m of state.messages[DAY_ONE_REPORT_ID]||[])if(m.id===D3_FIFTH_RULE_ID)m.text='校园墙 · 转发帖子：终章规则已发布';const c=reportContact();if(c?.preview==='第五章规则已发布')c.preview='终章规则已发布';if(post)persist()}
