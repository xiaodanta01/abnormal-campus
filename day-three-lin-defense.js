/* Day 3: the group questions Lin Qing after anonymous-review removal. */
const D3_DEFENSE_IMAGE='assets/day3-linqing-confession.jpg?v=20261011-rc5';
const D3_DEFENSE_DESK='assets/day2-midday-desk.jpg?v=20261011-rc5';
const D3_DEFENSE_NODES={opening:'回应对林晴的怀疑',proof:'回应自证要求',cgChoice:'回应群聊争论',secretChoice:'林晴的身份与隐瞒',reassure:'回应林晴的隐瞒'};
const D3_DEFENSE_REPLAY_KEYS=['opening','reassure'];
for(const [key,title] of Object.entries(D3_DEFENSE_NODES))if(D3_DEFENSE_REPLAY_KEYS.includes(key))STORY_CHOICES.push({id:'day3-lin-defense-'+key,title,day:'第三日 · 10:30',chat:['opening','proof'].includes(key)?HG_ID:null});
function d3Defense(){return state.story.dayThreeLinDefense}
function d3DefenseSecondOption(){const f=state.story.dayTwoFreeAction;if(!f)return false;return d2Alive()?!!f.effects?.d2publicHelp&&f.completed?.includes('d2publicJiang'):f.completed?.includes('d2zhou')&&f.completed?.includes('d2publicZhou')}
function d3DefenseKnowsIdentity(progress=state){return progress.story.secondNightResult?.target!=='jiang'&&progress.game.npcSecrets?.jiangxiao?.archivistDisclosedToPlayer===true}
function d3DefenseText(text){return text.replaceAll('【玩家名字】',state.profile.name)}
function d3DefenseRows(key){return {
 intro:{rows:[['zhengning','江晓之前怀疑林晴，这件事后来就算过去了吗？']],choice:'opening'},
 answer:{rows:[['lin','我不知道她为什么怀疑我'],['zhengning','那说说你自己是什么身份？'],['lin','我不是学生会'],['zhengning','你怎么证明？']],choice:'proof'},
 file:{rows:[['zhengning','她怎么证明是她的事情了，但她必须给个说法']],next:'debate'},
 yourself:{rows:[['me','上来就要别人自证是什么意思？'],['zhengning','没办法啊，谁让江晓说过这些话呢']],next:'debate'},
 debate:{rows:[['yeshu','【玩家名字】你为什么这么替她说话'],['yeshu','是因为知道什么，还是单纯相信她？'],['me','她要是学生会，昨天和她一起坐电梯的我还能回来吗？'],['jiangning','如果你们两个都是学生会，一起坐电梯也不会有事吧？'],...(!state.game.departedNpcs?.zhoumo?[['zhoumo','有你们这样颠倒黑白胡说八道的吗？']]:[])],next:'cg'}
}[key]}
function d3DefenseChoices(key,progress=state){return {
 opening:[{id:'challenge',label:'所以呢，你想表达什么？',next:'answer',trust:10},...(d3DefenseSecondOption()?[{id:'mistake',label:'……不然呢？不是都说了弄错了吗',next:'answer',trust:10}]:[]),{id:'silent',label:'保持沉默',next:'answer',silent:true}],
 proof:[{id:'file',label:'身份档案不能给别人看，你让她怎么证明？',next:'file'},{id:'yourself',label:'你怎么不证明一下自己不是学生会？',next:'yourself'}],
 cgChoice:[{id:'worry',label:'她们这样在群里引导，你今晚可能会被投出去的',next:'worry'},{id:'angry',label:'为什么，要眼睁睁的看着他们颠倒黑白吗',next:'angry'}],
 secretChoice:[...(d3DefenseKnowsIdentity(progress)?[{id:'identity',label:'为什么你的身份是矛盾的',next:'identity'}]:[]),{id:'hidden',label:'你是不是有什么事瞒着我',next:'hidden'}],
 reassure:[{id:'friends',label:'我们是好朋友，对吧？',next:'friends'},{id:'wait',label:'没事，我会等到你愿意告诉我的时候。',next:'wait',trust:10}]
}[key]||[]}
function d3DefenseCGScript(key,progress=state){const lin=text=>({speaker:'linqing',text:text.replaceAll('【玩家名字】',progress.profile?.name||'')}),me=text=>({speaker:'me',text});return {
 intro:{rows:[lin('【玩家名字】，别和她们争论了'),'林晴走到你身旁，轻声对你说道。'],next:'cgChoice'},
 worry:{rows:[lin('我会想办法的')],next:'secretChoice'},
 angry:{rows:[lin('先别着急，我想想怎么办吧')],next:'secretChoice'},
 identity:{rows:[lin('我……'),lin('我……我不知道'),lin('对不起，是我太自私了'),'她低下头，像是不想让你看到她的表情，也像是不敢直视你的眼睛。','可沉默越久，那份勉强维持的平静就越显得脆弱。'],next:'reassure'},
 hidden:{rows:[lin('【玩家名字】，我不是故意的'),lin('但我现在还不想说'),lin('对不起，我知道我不该这样瞒着你'),'她没有再往下说，只是望着你，就像是想把这一刻留得更久一点。'],next:'reassure'},
 friends:{rows:[lin('嗯'),me('那就不要说什么对不起'),lin('我知道了，谢谢你，【玩家名字】')],next:'reflection'},
 wait:{rows:['林晴像是没想到你会这么说。',lin('……好。')],next:'reflection'},
 reflection:{rows:[
 '既然林晴现在还不想说，那就先不追问了。',
 '你想起刚才群里的争执。',
 '许蓁蓁和江柠几乎句句都在针对你和林晴。',
 '她们的态度不像是临时起意，反而更像是早就串通好了，要把大家的怀疑引到你们身上。',
 '如果真是这样，你必须尽快找出她们的破绽。',
 '还有另外两个档案员到现在都没有露面，她们很可能已经消失或者根本就不在B栋。'
 ],next:'done'}
}[key]}
function d3DefenseRepair(progress=state){
 const q=progress.story?.dayThreeLinDefense;let changed=false;
 if(q?.reply==='没事，我会等到你愿意告诉我的那天。'){q.reply='没事，我会等到你愿意告诉我的时候。';changed=true}
 for(const message of progress.messages?.[HG_ID]||[]){if(message.hgWho==='zhengning'){if(message.name!=='许蓁蓁（517）'){message.name='许蓁蓁（517）';changed=true}if(message.text==='那你怎么证明？'){message.text='你怎么证明？';changed=true}}}
 if(q&&q.presentationVersion!==1){if(q.cgScript==='hidden'&&q.phase==='cg'&&q.cgIndex>2+(q.reply?1:0))q.cgIndex--;if(q.phase==='done'&&q.decisions?.reassure&&progress.game.day===3&&progress.system.time<'11:03')progress.system.time='11:03';q.presentationVersion=1;changed=true}
 if(q?.phase==='cg-hold'&&q.holdVersion!==1){q.remaining=5000;q.holdVersion=1;changed=true}
 if(!q||q.flowVersion===2)return changed;
 q.flowVersion=2;
 if(q.decisions?.cgChoice==='identity')q.decisions.secretChoice='identity';
 if(q.phase==='done'&&['worry','angry'].includes(q.decisions?.cgChoice)&&q.decisions.reassure===undefined){q.phase='cg-choice';q.cgScript='secretChoice';q.choice='secretChoice';q.cgIndex=0;delete q.reply;progress.story.route={view:'day3-lin-defense-cg',active:null}}
 return true;
}
function d3DefenseStart(){if(d3Defense()||!d3Review()?.departureApplied||state.game.day!==3)return;state.story.dayThreeLinDefense={flowVersion:2,presentationVersion:1,phase:'chat',script:'intro',index:0,remaining:messageSendDelay(),decisions:{},date:state.system.date};persist()}
function d3DefenseInside(){return view==='chat'&&active===HG_ID&&!hgContact()?.unread}
function d3DefenseWrite(who,text,id){const rows=state.messages[HG_ID]??=[];if(rows.some(m=>m.id===id))return;const person=dayTwoPerson(who),mine=who==='me';text=d3DefenseText(text);rows.push({id,type:'text',sender:mine?'me':person.avatar,name:mine?state.profile.name:person.name,hgWho:who,text,time:'10:30',gameDate:d3Defense().date,status:'read'});const c=hgContact();if(c){c.preview=mine?'我：'+text:text;c.time='10:30';if(view!=='chat'||active!==HG_ID)c.unread=(c.unread||0)+1}persist();if(view==='chat'&&active===HG_ID)openChat(HG_ID);else hgNotice('group')}
function d3DefenseDecorate(){const q=d3Defense();if(!q||!d3DefenseInside()||!['chat','choice','cg-wait'].includes(q.phase))return;screen.querySelector('[data-d3-defense-options]')?.remove();if(q.phase==='choice'){const options=d3DefenseChoices(q.choice);screen.querySelector('#composer')?.insertAdjacentHTML('beforebegin','<div class="zero-choices" data-d3-defense-options>'+options.map(c=>'<button type="button" data-d3-defense-choice="'+c.id+'" data-d3-defense-key="'+q.choice+'">'+esc(c.label)+'</button>').join('')+'</div>');if(D3_DEFENSE_REPLAY_KEYS.includes(q.choice))d2Capture('day3-lin-defense-'+q.choice,{view:'chat',active:HG_ID})}renderStoryReply();scrollMessages()}
function d3DefenseChoose(key,id){const q=d3Defense();if(!q||q.choice!==key||q.decisions[key]!==undefined||!['choice','cg-choice'].includes(q.phase))return;const cg=q.phase==='cg-choice';if(cg?view!=='day3-lin-defense-cg':!d3DefenseInside())return;const option=d3DefenseChoices(key).find(c=>c.id===id);if(!option)return;q.decisions[key]=id;if(option.trust){state.game.trust??={};state.game.trust.linqing=(state.game.trust.linqing??30)+option.trust}delete q.choice;if(cg){q.reply=option.label;d3DefenseCGNext(option.next);return}q.phase='chat';q.script=option.next;q.index=0;q.remaining=messageSendDelay();persist();if(!option.silent)d3DefenseWrite('me',option.label,'day3-lin-defense-choice-'+key);else openChat(HG_ID)}
function d3DefenseCGNext(key){const q=d3Defense();if(!q)return;if(key==='done'){q.phase='done';delete q.reply;clearInterval(cgTypingTimer);persist();d3FeverStart();return}q.cgScript=key;q.cgIndex=0;q.phase=D3_DEFENSE_NODES[key]?'cg-choice':'cg';q.choice=q.phase==='cg-choice'?key:null;persist();d3DefenseCGRender()}
function d3DefenseCGRender(){const q=d3Defense();if(!q||!['cg','cg-choice','cg-hold'].includes(q.phase))return;const previous=captureSceneSnapshot(screen);closeSheet();stopReading();document.querySelector('#hg-notification')?.remove();view='day3-lin-defense-cg';active=null;rememberRoute();zeroChrome();screen.innerHTML='<section class="rd-cg"><img src="'+(q.cgScript==='reflection'?D3_DEFENSE_DESK:D3_DEFENSE_IMAGE)+'" alt="'+(q.cgScript==='reflection'?'书桌上的手机':'身旁的林晴')+'"></section>';const host=screen.firstElementChild;if(q.phase==='cg-hold'){cgChoiceDialogue(host,d3DefenseCGScript('reflection').rows.at(-1))}else if(q.phase==='cg-choice'){const previousKey=q.choice==='cgChoice'?'intro':q.choice==='secretChoice'?(q.decisions.cgChoice==='angry'?'angry':'worry'):(q.decisions.secretChoice==='hidden'?'hidden':'identity');const before=d3DefenseCGScript(previousKey);cgChoiceDialogue(host,before.rows.at(-1));host.insertAdjacentHTML('beforeend','<div class="cg-options">'+d3DefenseChoices(q.choice).map(c=>'<button type="button" data-d3-defense-choice="'+c.id+'" data-d3-defense-key="'+q.choice+'">'+esc(cgText(c.label,'me'))+'</button>').join('')+'</div>');if(D3_DEFENSE_REPLAY_KEYS.includes(q.choice))d2Capture('day3-lin-defense-'+q.choice,{view,active:null})}else{const script=d3DefenseCGScript(q.cgScript),rows=q.reply?[{speaker:'me',text:q.reply},...script.rows]:script.rows;CGDialogue.present(host,rows,{index:q.cgIndex,firstReplyConfirmed:!!q.reply,onLastShown:q.cgScript==='reflection'?()=>{if(d3Defense()!==q||q.phase!=='cg')return;q.phase='cg-hold';q.holdVersion=1;q.remaining=5000;d3DefenseLastTick=Date.now();persist()}:null,onIndex:i=>{if(d3Defense()===q){q.cgIndex=i;persist()}},onComplete:()=>{if(d3Defense()===q&&q.phase==='cg'){delete q.reply;d3DefenseCGNext(script.next)}}})}cgScreenCrossfade(previous);persist()}
let d3DefenseLastTick=0,d3DefenseLastSave=0;
function d3DefenseTick(){if(window.CgReplay?.paused){d3DefenseLastTick=0;return}const now=Date.now();if(d3Paused()){d3DefenseLastTick=0;return}const elapsed=d3DefenseLastTick?Math.max(0,now-d3DefenseLastTick):0;d3DefenseLastTick=now;d3DefenseStart();const q=d3Defense();if(q?.phase==='cg-hold'){if(view!=='day3-lin-defense-cg')return;q.remaining=Math.max(0,q.remaining-elapsed);if(!q.remaining)d3DefenseCGNext('done');else if(now-d3DefenseLastSave>=1000){d3DefenseLastSave=now;persist()}return}if(!q||!['chat','cg-wait'].includes(q.phase)||!d3DefenseInside()&&!window.StoryResumeRecovery?.allow('d3-defense'))return;q.remaining=Math.max(0,q.remaining-elapsed);if(q.remaining){if(now-d3DefenseLastSave>=1000){d3DefenseLastSave=now;persist()}return}if(q.phase==='cg-wait'){d3DefenseCGNext('intro');return}const additionKey=q.script==='intro'&&q.index===0?'day3-review':q.script==='answer'&&q.index===1?'day3-lin':null;const extra=additionKey&&groupAdditionNext(additionKey);if(extra){q.remaining=messageSendDelay();d3DefenseWrite(extra.who,extra.text,extra.id);return}const script=d3DefenseRows(q.script),row=script.rows[q.index];if(row){const token='day3-lin-defense:'+q.script+':'+q.index;if(row[0]==='me'&&storyReplyGate(HG_ID,d3DefenseText(row[1]),token,'d3DefenseTick'))return;const id='day3-lin-defense-'+q.script+'-'+q.index;q.index++;q.remaining=messageSendDelay();if(q.index===script.rows.length&&script.next==='cg'){q.phase='cg-wait';q.remaining=2700}d3DefenseWrite(row[0],row[1],id);return}if(script.choice){q.phase='choice';q.choice=script.choice;persist();d3DefenseDecorate()}else{q.script=script.next;q.index=0;q.remaining=0;persist();d3DefenseTick()}}
const d3DefenseChatBase=openChat;openChat=function(...args){const result=d3DefenseChatBase(...args);d3DefenseDecorate();return result};
const d3DefenseHomeBase=home;home=function(...args){if(['cg','cg-choice','cg-hold'].includes(d3Defense()?.phase)&&!window.mobileLaunch&&!['game-menu','nodes','zero-death'].includes(view))return d3DefenseCGRender();return d3DefenseHomeBase(...args)};
const d3DefenseAppBase=openApp;openApp=function(...args){if(['cg','cg-choice','cg-hold'].includes(d3Defense()?.phase)&&!window.mobileLaunch&&!['game-menu','nodes','zero-death'].includes(view))return d3DefenseCGRender();return d3DefenseAppBase(...args)};
function d3DefenseLeaveReflection(){if(d3Defense()?.phase!=='cg-hold'||view!=='day3-lin-defense-cg'||d3Paused())return false;d3DefenseCGNext('done');return true}
window.addEventListener('click',e=>{if(e.target.closest('#screen')&&d3DefenseLeaveReflection()){e.preventDefault();e.stopImmediatePropagation();return}const b=e.target.closest('[data-d3-defense-choice]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();d3DefenseChoose(b.dataset.d3DefenseKey,b.dataset.d3DefenseChoice)},true);
const d3DefenseCleanupBase=cleanupSceneResume;cleanupSceneResume=function(...args){d3DefenseLastTick=0;return d3DefenseCleanupBase(...args)};
const d3DefenseResumeBase=resumeStoryScene;resumeStoryScene=function(snapshot,...args){const q=snapshot?.story?.dayThreeLinDefense;if(!q||q.phase==='done')return d3DefenseResumeBase(snapshot,...args);if(['cg','cg-choice','cg-hold'].includes(q.phase))d3DefenseCGRender();else if(snapshot.story.route?.view==='chat'&&snapshot.story.route.active===HG_ID)openChat(HG_ID);else{home();hgNotice('group')}persist()};
document.addEventListener('visibilitychange',()=>{d3DefenseLastTick=0});
if(d3DefenseRepair())persist();
setInterval(d3DefenseTick,100);
if(!d3Paused()&&['cg','cg-choice','cg-hold'].includes(d3Defense()?.phase))d3DefenseCGRender();
