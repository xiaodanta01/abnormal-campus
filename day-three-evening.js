/* Day 3 evening: every choice, delay and affection change belongs to the restored snapshot. */
const D3_EVENING_NODES={wish:'出校后的愿望',plan:'林晴的计划',zhou:'周茉的感谢',kind:'回应周茉'};
for(const [key,title] of Object.entries(D3_EVENING_NODES))STORY_CHOICES.push({id:'day3-evening-'+key,title,day:'第三日 · 晚间',chat:null});
STORY_CHOICES.push({id:'day3-before-report',title:'第三日检举开始前',day:'第三日 · 21:00',chat:null});
function d3Evening(){return state.story.dayThreeEvening}
function d3EveningText(text){return text.split('【玩家名字】').join(state.profile.name)}
function d3EveningOptions(key){return {
 wish:[['unsure','我还没想好','unsure'],['meal','吃一顿大餐','nice'],['movie','去逛商场，看电影','nice'],['custom','自己输入想做的事','nice']],
 plan:[['ask','你呢，你最想做什么？','ask'],['together','你呢，你的计划里会有我吗？','together']],
 zhou:[['lucky','遇到你我也很幸运','lucky'],['why','怎么了，为什么突然这么说','thanks']],
 kind:[['joke','我们有那么好吗哈哈哈','joke'],['better','不会的，你还会遇到比我更好的人','better']]
 }[key]||[]}
function d3EveningScript(key){return {
 intro:{rows:['如果后天能出去了','你最想做什么？'],choice:'wish'},
 unsure:{rows:['好吧'],choice:'plan'},nice:{rows:['听起来很不错'],choice:'plan'},
 ask:{rows:['嗯……','我还没想好'],next:'cg'},
 together:{rows:['你又在说这种话…',...(d3Evening()?.affectionReached?['我…当然想有你','很想很想']:[])],next:'cg'},
 zhou:{rows:['【玩家名字】，能遇到你和林晴真的很幸运'],choice:'zhou'},
 lucky:{rows:['我可能再也遇不到像你们这样好的人了'],choice:'kind'},
 thanks:{rows:['就是想再感谢感谢你们啦'],next:'done'},
 joke:{rows:['当然啦'],next:'done'},better:{rows:['嗯嗯，借你吉言！'],next:'done'}
 }[key]}
function d3EveningStart(){
 if(state.game.day!==3||d3Evening()||!state.story.dayThreePickup?.done)return;
 state.story.dayThreeEvening={phase:'home-wait',remaining:2000,date:state.system.date,chat:'linqing',decisions:{},index:0};
 state.system.time='18:03';state.game.period='晚上';persist();home();d3EveningLastTick=Date.now();
}
function d3EveningInside(){return view==='chat'&&active===d3Evening()?.chat}
function d3EveningNotice(){const q=d3Evening(),c=state.contacts.find(c=>c.id===q?.chat);if(!c||d3EveningInside()||document.querySelector('#d3-evening-notice'))return;const el=document.createElement('div');el.id='d3-evening-notice';el.className='opening-message';el.innerHTML='<button class="opening-body" data-action="d3-evening-open"><span>'+avatar(c.avatar)+'</span><span><small>讯息 · '+state.system.time+'</small><strong>'+esc(c.name)+'</strong><span>'+esc(c.preview)+'</span></span></button>';document.querySelector('#phone').append(el);playNotificationSound('message')}
actions['d3-evening-open']=()=>{if(!d3Evening())return;document.querySelector('#d3-evening-notice')?.remove();openChat(d3Evening().chat)};
function d3EveningWrite(text,id,mine=false){
 const q=d3Evening(),c=state.contacts.find(c=>c.id===q.chat),rows=state.messages[q.chat]??=[];if(!c||rows.some(m=>m.id===id))return;
 text=d3EveningText(text);rows.push({id,type:'text',sender:mine?'me':c.avatar,name:mine?state.profile.name:c.name,text,time:state.system.time,gameDate:q.date,status:'read'});
 c.preview=mine?'我：'+text:text;c.time=state.system.time;if(!d3EveningInside())c.unread=(c.unread||0)+1;
 persist();if(d3EveningInside())openChat(q.chat);else d3EveningNotice();
}
function d3EveningDecorate(){
 const q=d3Evening();if(!q||!d3EveningInside())return;document.querySelector('#d3-evening-notice')?.remove();screen.querySelector('[data-d3-evening-options]')?.remove();
 if(q.phase!=='choice')return;
 screen.querySelector('#composer')?.insertAdjacentHTML('beforebegin','<div class="zero-choices" data-d3-evening-options>'+d3EveningOptions(q.choice).map(([id,label])=>'<button type="button" data-d3-evening-choice="'+id+'" data-key="'+q.choice+'">'+esc(label)+'</button>').join('')+'</div>');
 d2Capture('day3-evening-'+q.choice,{view:'chat',active:q.chat});scrollMessages();
}
function d3EveningChoose(key,id,custom){
 const q=d3Evening();if(!q||q.phase!=='choice'||q.choice!==key||q.decisions[key]!==undefined||!d3EveningInside())return;
 const option=d3EveningOptions(key).find(o=>o[0]===id);if(!option)return;
 if(id==='custom'&&custom===undefined){
  sheet('你最想做什么？','<form id="d3-evening-input"><input aria-label="想做的事" maxlength="200" autocomplete="off" placeholder="输入你想做的事" value="'+esc(q.draft||'')+'"><button class="primary" type="submit">发送</button></form>');
  const form=document.querySelector('#d3-evening-input'),input=form.querySelector('input');input.oninput=()=>{q.draft=input.value;persist()};form.onsubmit=e=>{e.preventDefault();const text=input.value.trim();if(!text){input.focus();return}closeSheet();d3EveningChoose(key,id,text)};return;
 }
 q.decisions[key]=id;if(custom!==undefined)q.customWish=custom;
 if(key==='plan'&&id==='together'){state.game.trust??={};state.game.trust.linqing=(state.game.trust.linqing??30)+10;q.affectionReached=state.game.trust.linqing>=110}
 q.phase='chat';q.script=option[2];q.index=0;q.remaining=messageSendDelay();delete q.choice;d3EveningLastTick=Date.now();
 d3EveningWrite(custom===undefined?option[1]:custom,'day3-evening-choice-'+key,true);
}
function d3EveningCG(){
 const q=d3Evening();if(q?.phase!=='cg')return;const previous=captureSceneSnapshot(screen);closeSheet();stopReading();document.querySelector('#d3-evening-notice')?.remove();view='day3-evening-cg';active=null;rememberRoute();zeroChrome();
 screen.innerHTML='<section class="rd-cg"><img src="assets/bed-phone-evening-screen-off.jpg" alt="宿舍床上的手机"></section>';
 CGDialogue.present(screen.firstElementChild,['你的直觉告诉你，林晴似乎还有更多的事情瞒着你。','可她为什么总是不愿意告诉你，话总是说得那么模棱两可。','这种无法追问到底的感觉，让你格外难受。'],{index:q.cgIndex||0,onIndex:i=>{if(d3Evening()===q){q.cgIndex=i;persist()}},onComplete:()=>{if(d3Evening()!==q||q.phase!=='cg')return;q.phase='report-wait';q.remaining=2000;state.system.time='20:59';persist();home();d3EveningLastTick=Date.now();d2Capture('day3-before-report',{view:'home',active:null})}});cgScreenCrossfade(previous);persist();
}
function startDayThreeReport(){
 if(state.story.dayThreeReport)return;state.system.time='21:00';state.story.dayThreeReport={day:3,phase:'home-wait',date:state.system.date,homeReadyAt:Date.now(),draft:'',submittedAt:null,deadline:null};d3Evening().phase='report';persist();if(view==='home')reportCall(home);sendDayOneReport();status();
}
function d3EveningVoteTarget(progress=state){return progress.story.dayOneReport?.groupResult?.target==='zhao'?'me':'jiangning'}
const d3EveningHighestBase=highestGroupSuspicion;highestGroupSuspicion=function(date=state.system.date){if(state.game.day!==3||date!==state.system.date)return d3EveningHighestBase(date);const day=suspicionDay(state,date);if(day.result)return structuredClone(day.result);const target=d3EveningVoteTarget();return {date,target,name:target==='me'?state.profile.name:GROUP_SUSPECT_NAMES[target],score:day.scores[target]||0,source:'day3-support'}};
function d3EveningAfterVote(){
 const q=d3Evening(),r=state.story.dayThreeReport;if(q?.phase!=='report'||!r?.homeReturned||!r.publicationComplete||state.game.survivalEnding)return;
 if(state.game.departedNpcs?.zhoumo){q.phase='done';persist();return}
 const person=FA_PEOPLE.zhoumo;let c=state.contacts.find(c=>c.id===person.contact);
 if(!c){c={id:person.contact,name:'周茉',avatar:person.avatar,status:'',unread:0,online:false};state.contacts.push(c);(state.messages[c.id]??=[]).push({id:'day3-evening-zhou-contact',type:'system',text:'你们已成为联系人',time:state.system.time,gameDate:q.date})}
 q.chat=c.id;q.phase='chat';q.script='zhou';q.index=0;q.remaining=messageSendDelay();persist();
}
let d3EveningLastTick=0,d3EveningLastSave=0;
function d3EveningTick(){
 const now=Date.now();if(state.game.day!==3||d3Paused()||document.querySelector('#overlay .sheet')){d3EveningLastTick=0;return}
 const elapsed=d3EveningLastTick?Math.max(0,now-d3EveningLastTick):0;d3EveningLastTick=now;
 if(!d3Evening()){if(state.story.dayThreePickup?.done&&!state.story.dayThreePickup.noOrder)d3EveningStart();return}
 const q=d3Evening();if(q.phase==='report'){d3EveningAfterVote();return}
 if(!['home-wait','report-wait','chat','cg-wait'].includes(q.phase))return;
 if(q.phase==='chat'&&q.index>0&&!d3EveningInside())return;
 q.remaining=Math.max(0,q.remaining-elapsed);if(q.remaining){if(now-d3EveningLastSave>1000){d3EveningLastSave=now;persist()}return}
 if(q.phase==='home-wait'){state.system.time='19:01';if(view==='home')home();else status();q.phase='chat';q.script='intro';q.index=0;q.remaining=0;persist();return}
 if(q.phase==='report-wait'){startDayThreeReport();return}
 if(q.phase==='cg-wait'){q.phase='cg';q.cgIndex=0;persist();d3EveningCG();return}
 const script=d3EveningScript(q.script);if(!script)return;
 if(q.index<script.rows.length){const i=q.index++;q.remaining=messageSendDelay();d3EveningWrite(script.rows[i],'day3-evening-'+q.script+'-'+i);return}
 if(script.choice){q.phase='choice';q.choice=script.choice;persist();d3EveningDecorate()}
 else if(script.next==='cg'){q.phase='cg-wait';q.remaining=0;persist()}
 else {q.phase='done';persist()}
}
const d3EveningChatBase=openChat;openChat=function(...args){const result=d3EveningChatBase(...args);d3EveningDecorate();return result};
const d3EveningHomeBase=home;home=function(...args){if(d3Evening()?.phase==='cg'&&!d3Paused())return d3EveningCG();return d3EveningHomeBase(...args)};
const d3EveningAppBase=openApp;openApp=function(...args){if(d3Evening()?.phase==='cg'&&!d3Paused())return d3EveningCG();return d3EveningAppBase(...args)};
const d3EveningCleanupBase=cleanupSceneResume;cleanupSceneResume=function(...args){d3EveningLastTick=0;document.querySelector('#d3-evening-notice')?.remove();return d3EveningCleanupBase(...args)};
const d3EveningResumeBase=resumeStoryScene;resumeStoryScene=function(snapshot,...args){
 const q=snapshot?.story?.dayThreeEvening;if(!q||['report','done'].includes(q.phase))return d3EveningResumeBase(snapshot,...args);
 
 if(q.phase==='cg')d3EveningCG();else if(snapshot.story.route?.view==='chat')openChat(q.chat);else{home();if(['chat','choice'].includes(q.phase))d3EveningNotice()}persist();
};
document.addEventListener('click',e=>{const b=e.target.closest('[data-d3-evening-choice]');if(b){e.preventDefault();d3EveningChoose(b.dataset.key,b.dataset.d3EveningChoice)}});
document.addEventListener('visibilitychange',()=>{d3EveningLastTick=0});setInterval(d3EveningTick,100);
if(!d3Paused()&&d3Evening()?.phase==='cg')d3EveningCG();
