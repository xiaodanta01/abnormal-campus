/* Day 3 group inquiry: shared chat rendering, cadence and snapshot state. */
const D3_PROBE_NODE='day3-probe-pressure';
STORY_CHOICES.push({id:D3_PROBE_NODE,title:'追问江柠的物流记录',day:'第三日 · 推理后',chat:HG_ID});
function d3Probe(){return state.story.dayThreeReasoningProbe}
function d3ProbeText(text){return text.split('【玩家姓名】').join(state.profile.name)}
function d3ProbeRows(key){return {
 intro:{rows:[['me','@宋妍，你这两天去取过件吗？'],['songyan','没有'],['songyan','我平常就囤了蛮多泡面的，这两天没买东西'],['songyan','怎么了？']],choice:'purpose'},
 jiang:{rows:[['me','@江柠 你呢？'],['jiangning','什么？'],['me','你这两天有没有去取过件？'],['jiangning','没去过']],choice:'record'},
 evidence:{rows:[['jiangning','为什么宋妍你就不要她的记录？'],['songyan','物流记录：这两天没有购买记录，也没有待取包裹','image'],['songyan','我的在这'],['me','现在可以发了吧'],['jiangning','我凭什么要自证？']],choice:'pressure'},
 morning:{rows:[['jiangning','那你针对许蓁蓁去啊，抓着我不放干嘛？'],['me','早上她质疑林晴的时候，你可没少接话'],['me','你们一唱一和，把大家的怀疑往林晴身上引'],['me','现在一句“找她去”，就跟你没关系了？']],next:'counter'},
 suspicion:{rows:[['jiangning','没有证据的怀疑就是造谣，知道吗？'],['me','所以我才让你把记录发出来，怀疑错了我就道歉，行么'],['me','四楼能和你一起取件的人，只剩宋妍。'],['me','她说没去过，记录也发了'],['me','你也说没去过，那你的呢？']],next:'counter'},
 counter:{rows:[['jiangning','反正不管我说什么，你都能挑出毛病'],['jiangning','别忘了，昨天在群里提供孟舒那些信息的人，也有你'],['jiangning','为什么昨晚学生会没清理你？'],['jiangning','你们自己好好想想吧，别再艾特我了'],['yeshu','是啊，【玩家姓名】昨天的发言对学生会威胁不小了吧'],['yeshu','可你怎么没被清理？'],['yeshu','该不会……你们本来就是打配合'],['yeshu','只是看孟舒保不住了，就假装正义使者来获取普通生的信任吧？']],next:state.game.departedNpcs?.zhoumo?'zhou-left':'zhou-alive'},
 'zhou-alive':{rows:[['zhoumo','你们到底还要胡说八道到什么时候？'],['zhoumo','我昨天差点脱水，是林晴和【玩家姓名】给我送来的水和零食。'],['zhoumo','如果她们是学生会，放着我不管不就好了？为什么还要救我？'],['zhoumo','不管你们怎么说，我都相信她们是普通生'],['zhengning','周茉，你怎么到现在还这么单纯？'],['zhengning','给你一点水和吃的，你就这么相信她们了？'],['zhengning','她们要的就是你这样的反应，你还不明白吗？'],['zhoumo','够了。'],['zhoumo','在你眼里，连救人都成了算计，是吗？'],['zhoumo','我没有那么蠢']],next:'pickup'},
 'zhou-left':{rows:[['zhengning','你们这配合可真够高明的'],['zhengning','今晚我们普通生要是再投错一次，就会最少一次性失去9个人'],['zhengning','其实就是想让我们把最后一次机会也浪费掉，对吧？'],['me','你也知道只剩最后一次机会？'],['me','这么护着江柠这个拿不出证据的人'],['me','我在确认她有没有撒谎，你就说我在害大家。'],['me','你到底是怕我投错，还是怕我继续问下去？']],next:'pickup'}
 }[key]}
function d3ProbeChoices(key){return {
 purpose:[{id:'check',label:'想核对一些事情',next:'jiang'},{id:'ask',label:'没什么，想了解一下情况',next:'jiang'}],
 record:[{id:'show',label:'发一下物流记录看看',next:'evidence'},{id:'proof',label:'光说有什么用，证据呢',next:'evidence'}],
 pressure:[{id:'morning',label:'早上许蓁蓁不也是这样怀疑林晴的吗？',next:'morning'},{id:'suspicion',label:'因为我怀疑你是学生会',next:'suspicion'}]
 }[key]||[]}
function d3ProbeStart(){
 if(state.game.day!==3||state.story.dayThreeReasoning?.phase!=='group')return;
 const q=d3Probe();if(q&&q.phase!=='awaiting-script')return;
 state.story.dayThreeReasoningProbe={phase:'chat',script:'intro',index:0,remaining:messageSendDelay(),decisions:{},date:state.system.date,time:state.system.time};persist();
}
function d3ProbeInside(){return view==='chat'&&active===HG_ID&&!hgContact()?.unread}
function d3ProbeWrite(who,text,id,type='text'){
 const rows=state.messages[HG_ID]??=[];if(rows.some(m=>m.id===id))return;
 const q=d3Probe(),person=dayTwoPerson(who),mine=who==='me';text=d3ProbeText(text);
 rows.push({id,type,sender:mine?'me':person.avatar,name:mine?state.profile.name:person.name,hgWho:who,text,time:q.time,gameDate:q.date,status:'read',...(type==='image'?{src:'assets/day3-songyan-logistics.svg?v=20261011-rc5'}:{})});
 if(type==='image')q.songyanRecordReceived=true;
 const c=hgContact();if(c){c.preview=type==='image'?'[图片]':mine?'我：'+text:text;c.time=q.time;if(view!=='chat'||active!==HG_ID)c.unread=(c.unread||0)+1}
 persist();if(view==='chat'&&active===HG_ID)openChat(HG_ID);else hgNotice('group');
}
function d3ProbeDecorate(){
 if(!d3ProbeInside())return;
 const q=d3Probe();if(!q||!['chat','choice','pickup-wait'].includes(q.phase))return;
 screen.querySelector('[data-d3-probe-options]')?.remove();
 if(q.phase==='choice'){
  screen.querySelector('#composer')?.insertAdjacentHTML('beforebegin','<div class="zero-choices" data-d3-probe-options>'+d3ProbeChoices(q.choice).map(c=>'<button type="button" data-d3-probe-choice="'+c.id+'" data-d3-probe-key="'+q.choice+'">'+esc(c.label)+'</button>').join('')+'</div>');
  if(q.choice==='pressure')d2Capture(D3_PROBE_NODE,{view:'chat',active:HG_ID});
 }
 renderStoryReply();scrollMessages();
}
function d3ProbeChoose(key,id){
 const q=d3Probe();if(!q||q.phase!=='choice'||q.choice!==key||q.decisions[key]!==undefined||!d3ProbeInside())return;
 const option=d3ProbeChoices(key).find(c=>c.id===id);if(!option)return;
 q.decisions[key]=id;delete q.choice;q.phase='chat';q.script=option.next;q.index=0;q.remaining=messageSendDelay();d3ProbeLastTick=Date.now();
 d3ProbeWrite('me',option.label,'day3-probe-choice-'+key);
}
let d3ProbeLastTick=0,d3ProbeLastSave=0;
function d3ProbeTick(){
 const now=Date.now();if(d3Paused()||!d3ProbeInside()&&d3Probe()?.phase!=='pickup-wait'&&!window.StoryResumeRecovery?.allow('d3-probe')||document.querySelector('#overlay .sheet')){d3ProbeLastTick=0;return}
 const elapsed=d3ProbeLastTick?Math.max(0,now-d3ProbeLastTick):0;d3ProbeLastTick=now;d3ProbeStart();const q=d3Probe();
 if(!q||!['chat','pickup-wait'].includes(q.phase))return;
 q.remaining=Math.max(0,q.remaining-elapsed);
 if(q.phase==='chat'&&window.ReadHistory?ReadHistory.waiting('d3-probe',q,'remaining','remaining'):q.remaining){if(now-d3ProbeLastSave>=1000){d3ProbeLastSave=now;persist()}return}
 if(q.phase==='pickup-wait'){q.phase='done';persist();d3PickupBegin();return}
 const script=d3ProbeRows(q.script);if(!script)return;
 const additionKey=q.index===script.rows.length?(q.script==='evidence'?'day3-self-proof':q.script==='counter'?'day3-zhao-defense':null):null;
 const extra=additionKey&&groupAdditionNext(additionKey);
 if(extra){q.remaining=messageSendDelay();d3ProbeWrite(extra.who,extra.text,extra.id);return}
 const row=script.rows[q.index];
 if(row){
  const token='day3-probe:'+q.script+':'+q.index;
  if(row[0]==='me'&&window.ReadHistory?.canContinueReadReply('d3-probe',q,'day3-probe-'+q.script+'-'+q.index))confirmStoryReply(token);
  if(row[0]==='me'&&storyReplyGate(HG_ID,d3ProbeText(row[1]),token,'d3ProbeTick',q.script==='intro'&&q.index===0))return;
  const id='day3-probe-'+q.script+'-'+q.index;q.index++;q.remaining=messageSendDelay();
  if(q.index===script.rows.length&&script.next==='pickup'){q.phase='pickup-wait';q.remaining=3000}
  d3ProbeWrite(row[0],row[1],id,row[2]);return;
 }
 if(script.choice){q.phase='choice';q.choice=script.choice;persist();d3ProbeDecorate()}
 else{q.script=script.next;q.index=0;q.remaining=0;persist();d3ProbeTick()}
}
const d3ProbeChatBase=openChat;openChat=function(...args){const result=d3ProbeChatBase(...args);d3ProbeStart();d3ProbeDecorate();return result};
const d3ProbeCleanupBase=cleanupSceneResume;cleanupSceneResume=function(...args){d3ProbeLastTick=0;return d3ProbeCleanupBase(...args)};
const d3ProbeResumeBase=resumeStoryScene;resumeStoryScene=function(snapshot,...args){
 const q=snapshot?.story?.dayThreeReasoningProbe,p=snapshot?.story?.dayThreePickup;
 if(!q||q.phase==='done'&&(!p||p.done&&!p.noOrder))return d3ProbeResumeBase(snapshot,...args);
 d3ProbeStart();
 if(p?.noOrder)d3PickupBegin();else if(p&&!p.done)pickup16Render();else if(snapshot.story.route?.view==='chat'&&snapshot.story.route.active===HG_ID)openChat(HG_ID);else{home();hgNotice('group')}persist();
};
document.addEventListener('click',e=>{const b=e.target.closest('[data-d3-probe-choice]');if(b){e.preventDefault();d3ProbeChoose(b.dataset.d3ProbeKey,b.dataset.d3ProbeChoice)}});
document.addEventListener('visibilitychange',()=>{d3ProbeLastTick=0});
setInterval(d3ProbeTick,100);
if(!d3Paused()){d3ProbeStart();if(state.game.day===3&&state.story.dayThreePickup?.noOrder)d3PickupBegin();else if(state.story.dayThreePickup&&!state.story.dayThreePickup.done)pickup16Render();else d3ProbeDecorate()}
