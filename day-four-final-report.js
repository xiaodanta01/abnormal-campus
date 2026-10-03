/* Final-day rebuttal and report. Cursors, read gates and effects rewind with the save. */
const D4_FINAL_CG='assets/day4-final-bed-phone.jpg';
const D4_FINAL_REPORTERS={shen:'沈可欣',yeshu:'蒋小雪',gunian:'顾念',heyu:'何雨',yuwei:'余薇',baizhi:'白栀'};
const D4_FINAL_SCRIPTS={
 opening:{rows:[],options:['你们刚才说，我申请成为委托人，是为了骗走普通生的票，对吧？'],next:'claim'},
 claim:{rows:[['supporter','难道不是吗？'],['yeshu','事实已经很清楚了']],options:['委托刚开始的时候沈可欣有12票，对吧？'],next:'initial'},
 initial:{rows:[['me','而我一票都没有。'],['me','为什么你口中的“学生会”，即我，申请成为委托人以后']],options:['不仅一开始没有一个人投给我，马上都要21点了还只有3票？','没有一个学生会的人，把票交给我？'],next:'first'},
 first:{rows:[],votes:1,next:'excuse'},
 excuse:{rows:[['shen','那是因为他们在等最后两分钟，到时候一起把票从我这边转到你那'],['shen','你现在只要保证有3票，到时候我必输无疑']],options:['那我这个学生会还挺惨的'],next:'isolated'},
 isolated:{rows:[['me','被你们所有人围攻，9个同伙没有一个人愿意帮我说话'],['me','我要是学生会，现在这个情况，他们就不怕我失去更多的票吗'],['me','反倒是你们']],options:['做出的每个选择，都像是早已确认过谁是自己人','对彼此的信任毫无保留，就好像从一开始就知道谁可以相信'],next:'faction'},
 faction:{rows:[['me','普通生没有上帝视角只会互相猜忌，可学生会就不一样了'],['me','是不是眼看着还有一个小时'],['me','都急的忘记装一下了？']],options:['至少多派几个人帮我说话吧？','至少装装样子，为我说几句话吧？'],next:'second'},
 second:{rows:[],votes:2,next:'support'},
 support:{rows:[['gunian','你想多了'],['heyu','叶琳，林晴不都在帮你吗？'],['yelin','帮她是因为我觉得你们都是铁狼'],['yelin','其他普通生你们动脑子好好想想啊，【玩家名字】要是学生会，怎么可能会这样孤立无援']],votes:1,next:'three'},
 three:{rows:[],options:['所以你的意思是学生会一共就三个人？'],next:'reported'},
 reported:{rows:[['me','别逗我了']],options:['我们前面已经检举出了3个正确的学生会'],next:'fixed'},
 fixed:{rows:[['me','现在就还有10个学生会'],['yelin','去掉沈可欣这个委托人，剩下就有9个可以投票的'],['yelin','沈可欣，你最少的时候就是9票吧'],['yelin','为什么这9票如此坚定不移啊？']],votes:1,next:'identity'},
 identity:{rows:[['lin','自己的身份界面','identity'],['lin','你们看见了吧，我没有任何身份'],['lin','而且我发送截屏，也不会被请离'],['lin','校园新规对我没有任何作用，我不知道为什么'],['lin','前几天江晓的误判也可能和这个有关'],['lin','但是你们不相信的话 我也没有办法'],['yelin','……原来是个关系户'],['lin','总之我和你们保证，我不是学生会，【玩家名字】也不会是'],['shen','你们为了骗票真是什么图都敢伪造了']],options:['沈可欣，你是很聪明，但你的队友们都太着急太愚蠢了'],next:'deadline'},
 deadline:{time:'20:59',rows:[['me','现在已经20:59分了'],['me','为什么我的学生会同伙还没有把票给我？']],options:['你们还不明白吗？','你们还没看清楚是怎么一回事吗？'],next:'last'},
 last:{rows:[],votes:2,next:'winner'}
};
const D4_FINAL_HUANG_THANKS=['救命恩人……','我刚刚心率都要爆表了，都等着被请离了呜呜','谢谢你，救了我们所有人'];
const D4_FINAL_FAREWELL=[
 ['songjia','为什么要骗我们那么久……'],
 ['shen','好像从拿到这个身份开始，我就只剩下一条路。'],
 ['shen','为了不让自己消失，只能先让其他人消失。'],
 ['shen','但如果我什么都不做，消失的就不只是我。'],
 ['shen','其他学生会的人，也会因为我的心软被一起拖下去。'],
 ['shen','我想活下来，难道也是错吗？'],
 ['shen','而我为大家做的一切，都好像被学生会这个身份抹除了'],
 ['shen','等一切结束，活下来的人只会记得我骗了你们。'],
 ['shen','你们会觉得，我做的每一件事，都是为了博取信任，都是早有预谋。'],
 ['shen','可我明明是在后来才拿到这个身份的。'],
 ['shen','在那之前，我就已经在帮大家了。']
];
const D4_FINAL_NARRATION=[
 '你看着屏幕上的消息，忽然觉得这一切荒唐得可笑。',
 '人的价值可以被问卷评分，决定别人命运的权力可以随手委托，一个人的消失，也只需要轻描淡写地写成“请离”。',
 '这场游戏先给每个人贴上“普通生”或“学生会”的标签，再逼着所有人只凭这个标签判断善恶。',
 '沈可欣从获得学生会身份的那一刻起，她过去的每一次提醒都会变成笼络，每一次帮助都会变成算计。仿佛一个后来才获得的身份，真能穿过时间，把从前的她也一并改写。',
 '只是比起承认人会矛盾、会改变，人们似乎更愿意相信一个简单的标签。'
];
function d4Final(){return state.story.dayFourFinal}
function d4FinalInside(id=HG_ID){return view==='chat'&&active===id}
function d4FinalBegin(){
 if(d3Paused()||state.game.day!==4||d4Final()||d4Counter()?.phase!=='done'||!state.story.dayFourVoteReasoning?.done)return;
 state.story.dayFourFinal={phase:'choice',script:'opening',index:0,remaining:messageSendDelay(),decisions:{},effects:{},date:state.system.date,cgIndex:0,draft:'',submittedAt:null};
 state.system.time='20:03';state.game.period='晚上';persist();status();openChat(HG_ID);
}
function d4FinalWrite(who,text,id,{chat=HG_ID,type='text',src=null}={}){
 const rows=state.messages[chat]??=[];if(rows.some(m=>m.id===id))return false;
 const p=who==='huang'?{name:'黄依依',avatar:'chat_huangyiyi_v1'}:dayTwoPerson(who),name=who==='me'?state.profile.name:who==='heyu'?'何雨（305）':who==='gunian'?'顾念（303）':who==='lin'?'林晴':p.name;
 text=d4DebateText(text);rows.push({id,type,text,sender:who==='me'?'me':who==='lin'?'linqing':p.avatar,name,hgWho:who,time:state.system.time,gameDate:state.system.date,status:'read',...(src?{src}:{})});
 const c=state.contacts.find(c=>c.id===chat);if(c){c.preview=['image','d4-lin-identity'].includes(type)?'[图片]':text;c.time=state.system.time;if(!d4FinalInside(chat))c.unread=(c.unread||0)+1}
 persist();if(d4FinalInside(chat))openChat(chat);return true;
}
function d4FinalGo(script){
 const q=d4Final();if(!q)return;
 if(script==='winner'){q.phase='winner';q.winner='me';d4Delegation().finalDelegate='me';d4Delegation().finalized=true;state.system.time='21:00';persist();status();d4FinalWinner();return}
 const def=D4_FINAL_SCRIPTS[script];q.script=script;q.index=0;q.phase=def.rows.length?'chat':def.options?'choice':'chat';q.remaining=messageSendDelay();if(def.time){state.system.time=def.time;status()}persist();d4FinalDecorate();
}
function d4FinalDecorate(){
 const q=d4Final();if(!q||!d4FinalInside())return;
 screen.querySelector('[data-d4-final-options]')?.remove();document.querySelector('#d4-final-notice')?.remove();
 if(q.phase==='choice'){
  const def=D4_FINAL_SCRIPTS[q.script];screen.querySelector('#composer')?.insertAdjacentHTML('beforebegin','<div class="zero-choices" data-d4-final-options>'+def.options.map((text,i)=>'<button data-d4-final-choice="'+i+'">'+esc(d4DebateText(text))+'</button>').join('')+'</div>');
  d4CaptureCheckpoint('day4-final-'+q.script,{view:'chat',active:HG_ID});
 }
 scrollMessages();
}
function d4FinalChoose(index){
 const q=d4Final(),def=q&&D4_FINAL_SCRIPTS[q.script];if(q?.phase!=='choice'||!d4FinalInside()||q.decisions[q.script]!==undefined||!Number.isInteger(index)||!def.options?.[index])return;
 const script=q.script;q.decisions[script]=index;q.phase='chat';d4FinalWrite('me',def.options[index],'d4-final-choice-'+script);d4FinalGo(def.next);
}
function d4FinalTransfer(){
 const q=d4Final(),def=q&&D4_FINAL_SCRIPTS[q.script];if(!q||!def?.votes||q.effects[q.script])return;
 const d=d4Delegation(),n=def.votes;d.voteChanges??={};d.voteChanges.shen=(d.voteChanges.shen||0)-n;d.voteChanges.me=(d.voteChanges.me||0)+n;
 q.effects[q.script]={shen:-n,me:n};q.phase='vote';persist();d4FinalVoteNotice();
}
function d4FinalVoteNotice(){const q=d4Final(),n=D4_FINAL_SCRIPTS[q.script].votes;d4VoteModal('有'+n+'份委托由沈可欣转交给你','沈可欣：'+d4DelegationVoteCount('shen')+'票｜你：'+d4DelegationVoteCount('me')+'票','d4-final-vote-ack')}
function d4FinalWinner(){
 if(d4Final()?.phase!=='winner')return;d4VoteModal('最终委托人已确认',state.profile.name,'d4-final-report-open');
 const card=document.querySelector('#overlay .delegation-card'),button=document.querySelector('#overlay [data-action="d4-final-report-open"]');
 if(card)card.insertAdjacentHTML('afterbegin','<div class="d4-final-winner-avatar">'+avatar('me')+'</div>');if(button)button.textContent='前往检举';
}
const d4FinalStudentBase=reportStudent;
reportStudent=function(name,progress=state){
 const clean=String(name??'').trim(),entry=Object.entries(D4_FINAL_REPORTERS).find(([,n])=>n===clean);
 if(progress.game.day===4&&entry&&progress.story.dayFourFinal){
  if(reportDeparted(clean,progress)||clean===progress.profile?.name)return null;
  return {key:entry[0],name:clean,faction:'学生会'};
 }
 return d4FinalStudentBase(name,progress);
};
function d4FinalReport(){
 const q=d4Final();if(!q||!['winner','report','confirm'].includes(q.phase)||q.submittedAt)return;
 const confirming=q.phase==='confirm';if(!confirming)q.phase='report';closeSheet();document.querySelector('#d4-final-confirm')?.remove();
 view='day4-final-report';active=null;rememberRoute();zeroChrome();status();
 screen.innerHTML='<section class="report-page"><header><h1>最终日检举</h1></header><form id="report-name-form"><label for="report-real-name">请输入你要检举的对象：</label><input id="report-real-name" placeholder="输入真实姓名" aria-label="输入真实姓名" autocomplete="off" maxlength="40" value="'+esc(q.draft)+'"><p class="report-error" role="status"></p><button type="submit" data-action="d4-final-confirm-open" '+(q.draft.trim()?'':'disabled')+'>提交检举</button></form></section>';
 const form=screen.querySelector('#report-name-form'),input=screen.querySelector('#report-real-name'),button=form.querySelector('button');
 input.oninput=()=>{if(d4Final()!==q||q.phase!=='report')return;q.draft=input.value;button.disabled=!input.value.trim();screen.querySelector('.report-error').textContent='';persist()};
 form.onsubmit=e=>{e.preventDefault();d4FinalConfirm()};persist();d4CaptureCheckpoint('day4-final-report',{view,active:null});if(confirming)d4FinalConfirm(true);
}
function d4FinalConfirm(restoring=false){
 const q=d4Final();if(!q||q.submittedAt||!['report',...(restoring?['confirm']:[])].includes(q.phase))return;
 const name=(restoring?q.confirmName:q.draft).trim(),person=reportStudent(name);if(!person){q.phase='report';screen.querySelector('.report-error').textContent=reportNameError(name);persist();return}
 q.confirmName=name;q.phase='confirm';persist();document.querySelector('#d4-final-confirm')?.remove();
 const el=document.createElement('div');el.id='d4-final-confirm';el.className='report-modal';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-label','确认检举');
 el.innerHTML='<section><p>你要检举的人是：</p><strong>'+esc(name)+'</strong><p>检举提交后不可修改。</p><button data-action="d4-final-submit">确认提交</button><button data-action="d4-final-edit">重新输入</button></section>';document.querySelector('#phone').append(el);
}
function d4FinalMarkDeparted(key,name){
 state.game.departedNpcs??={};state.game.departedNpcs[key]??={date:state.system.date,cause:'day4-final-report'};
 const p=reportPerson(key);
 for(const c of state.contacts)if(c.id===key||c.id===p?.contact||c.name?.replace(/[（(].*$/,'').trim()===name){c.status='已请离';c.online=false}
}
function d4FinalSubmit(){
 const q=d4Final();if(q?.phase!=='confirm'||q.submittedAt)return;const person=reportStudent(q.confirmName);if(!person){q.phase='report';d4FinalReport();return}
 q.submittedAt=Date.now();q.target=person.key;q.name=person.name;q.correct=person.faction==='学生会';document.querySelector('#d4-final-confirm')?.remove();
 state.game.personalReports??={};state.game.personalReports[q.date]={target:q.target,name:q.name,correct:q.correct,date:q.date,status:'settled',submittedAt:q.submittedAt,settled:true,finalDelegated:true};
 if(!q.correct){q.phase='dead';persist();beginLateDeath('day4-final-report-wrong');return}
 q.phase='a-unread';q.remaining=messageSendDelay();
 if(!q.populationApplied){q.populationApplied=true;if(Number.isFinite(state.game.campusPopulation?.alive))state.game.campusPopulation.alive=Math.max(0,state.game.campusPopulation.alive-10)}
 d4FinalMarkDeparted(q.target,q.name);
 const group=state.contacts.find(c=>c.id===D4_A_GROUP),rows=state.messages[D4_A_GROUP]??=[];
 for(const [key,name,room,placeholder]of [['a-zhangxin','张昕','213','stranger-a1'],['a-lixiaoxiao','李潇潇','518','stranger-a2']]){
  const id='d4-final-remove-'+key;if(!rows.some(m=>m.id===id))rows.push({id,type:'system',text:'黄依依已将'+name+'（'+room+'）移出群聊',time:'21:00',gameDate:q.date});
  d4FinalMarkDeparted(key,name);
  if(group?.members){const i=group.members.findIndex(member=>[key,placeholder,name].includes(member));if(i>=0)group.members.splice(i,1)}
 }
 if(group){group.preview=rows.at(-1).text;group.time='21:00';group.unread=(group.unread||0)+2;if(group.members)group.status='群成员：'+group.members.length+'人'}
 persist();home();status();d4FinalANotice();
}
function d4FinalANotice(){d4ATop('d4-final-a-notice','讯息 · 21:00','女生A栋临时互助群','黄依依已将张昕（213）、李潇潇（518）移出群聊','d4-final-a-open')}
function d4FinalGroupNotice(){d4ATop('d4-final-notice','讯息 · '+state.system.time,'女生B栋临时互助群',hgContact()?.preview||'你收到一条新消息','d4-final-chat')}
function d4FinalReadA(){const q=d4Final();if(q?.phase!=='a-unread'||!d4FinalInside(D4_A_GROUP))return;q.phase='huang-wait';q.huangIndex=0;q.remaining=messageSendDelay();q.index=0;document.querySelector('#d4-final-a-notice')?.remove();persist()}
function d4FinalHuangNotice(){d4ATop('d4-final-huang-notice','讯息 · 21:03','黄依依',state.contacts.find(c=>c.id===D4_HUANG)?.preview||D4_FINAL_HUANG_THANKS[0],'d4-final-huang-open')}
function d4FinalReadHuang(){
 const q=d4Final();if(!q||!d4FinalInside(D4_HUANG))return;
 document.querySelector('#d4-final-huang-notice')?.remove();
 if(q.phase!=='huang-chat'||q.huangIndex<D4_FINAL_HUANG_THANKS.length||d3Paused()||document.querySelector('#overlay .sheet'))return;
 q.huangRead=true;q.phase='farewell-wait';q.index=0;q.remaining=messageSendDelay();persist();
}
function d4FinalNarrate(){
 const q=d4Final();if(q?.phase!=='cg')return;const previous=captureSceneSnapshot(screen);closeSheet();stopReading();view='day4-final-cg';active=null;rememberRoute();zeroChrome();
 screen.innerHTML='<section class="rd-cg"><img src="'+D4_FINAL_CG+'" alt="夜晚躺在宿舍床上，看着手机"></section>';
 CGDialogue.present(screen.firstElementChild,D4_FINAL_NARRATION,{index:q.cgIndex,onIndex:i=>{if(d4Final()===q){q.cgIndex=i;persist()}},onComplete:()=>{if(d4Final()===q&&q.phase==='cg')d4FinalRelease()}});cgScreenCrossfade(previous);persist();
}
function d4FinalRelease(){
 const q=d4Final();if(q?.phase!=='cg')return;q.phase='lin-wait';q.remaining=3000;state.system.time='21:23';d4FinalLastTick=Date.now();
 persist();home();status();
}
function d4FinalSendLin(){
 const q=d4Final();if(q?.phase!=='lin-wait')return;q.phase='done';state.system.time='21:37';
 d4LinNightStart();d4FinalWrite('lin','我明天睡醒，还能见到你吗？','day4-final-lin-night',{chat:'linqing'});status();persist();
 if(!d4FinalInside('linqing'))d4LinNightNotice();
}
let d4FinalLastTick=0,d4FinalLastSave=0;
function d4FinalTick(){
 if(d3Paused()||state.game.day!==4){d4FinalLastTick=0;return}d4FinalBegin();const q=d4Final();if(!q)return;
 const now=Date.now(),elapsed=d4FinalLastTick?Math.min(500,now-d4FinalLastTick):0;d4FinalLastTick=now;
 if(q.phase==='chat'&&d4FinalInside()&&!document.querySelector('#overlay .sheet')){
  q.remaining=Math.max(0,q.remaining-elapsed);if(!q.remaining){const def=D4_FINAL_SCRIPTS[q.script],row=def.rows[q.index];
   if(row){const i=q.index++,who=d4DebateWho(row[0]);q.remaining=messageSendDelay();if(d4DebatePresent(who))d4FinalWrite(who,row[1],'d4-final-'+q.script+'-'+i,row[2]==='identity'?{type:'d4-lin-identity'}:{});else persist()}
   else if(def.votes)d4FinalTransfer();else if(def.options){q.phase='choice';persist();d4FinalDecorate()}else d4FinalGo(def.next);
  }
 }else if(q.phase==='vote'&&!document.querySelector('#overlay .sheet'))d4FinalVoteNotice();
 else if(q.phase==='winner'&&!document.querySelector('#overlay .sheet'))d4FinalWinner();
 else if(q.phase==='a-unread')d4FinalReadA();
 else if(q.phase==='huang-wait'||q.phase==='huang-chat'&&d4FinalInside(D4_HUANG)){
  if(document.querySelector('#overlay .sheet'))return;
  q.remaining=Math.max(0,q.remaining-elapsed);if(!q.remaining){
   const i=q.huangIndex||0,text=D4_FINAL_HUANG_THANKS[i];
   if(text){q.phase='huang-chat';q.huangIndex=i+1;q.remaining=messageSendDelay();state.system.time='21:03';status();d4FinalWrite('huang',text,'d4-final-huang-thanks-'+i,{chat:D4_HUANG});if(!d4FinalInside(D4_HUANG))d4FinalHuangNotice()}
   else d4FinalReadHuang();
  }
 }
 else if(q.phase==='farewell-wait'||q.phase==='farewell'&&d4FinalInside()){
  q.remaining=Math.max(0,q.remaining-elapsed);if(!q.remaining){const row=D4_FINAL_FAREWELL[q.index];
   if(row){const i=q.index++;q.remaining=messageSendDelay();if(row[0]==='shen'||d4DebatePresent(row[0])){q.phase='farewell';d4FinalWrite(row[0],row[1],'d4-final-farewell-'+i);if(!d4FinalInside())d4FinalGroupNotice()}else persist()}
   else {q.phase='cg';q.cgIndex=0;persist();d4FinalNarrate()}
  }
 }else if(q.phase==='lin-wait'){q.remaining=Math.max(0,q.remaining-elapsed);if(!q.remaining)d4FinalSendLin()}
 if(now-d4FinalLastSave>1000){d4FinalLastSave=now;persist()}
}
Object.assign(actions,{
 'd4-final-vote-ack':()=>{const q=d4Final();if(q?.phase!=='vote')return;closeSheet();d4FinalGo(D4_FINAL_SCRIPTS[q.script].next)},
 'd4-final-report-open':()=>{if(d4Final()?.phase==='winner')d4FinalReport()},
 'd4-final-confirm-open':()=>d4FinalConfirm(),
 'd4-final-edit':()=>{if(d4Final()?.phase!=='confirm')return;d4Final().phase='report';d4FinalReport()},
 'd4-final-submit':d4FinalSubmit,'d4-final-a-open':()=>openChat(D4_A_GROUP),'d4-final-huang-open':()=>openChat(D4_HUANG),'d4-final-chat':()=>openChat(HG_ID),
 'd4-final-lin-open':()=>openChat('linqing')
});
const d4FinalChatBase=openChat;openChat=function(id,...args){const result=d4FinalChatBase(id,...args);if(state.game.day===4&&d4Final()){if(id===HG_ID)d4FinalDecorate();if(id===D4_A_GROUP)d4FinalReadA();if(id===D4_HUANG)d4FinalReadHuang();if(id==='linqing'&&d4FinalInside('linqing'))document.querySelector('#d4-final-lin-notice')?.remove()}return result};
const d4FinalMessageBase=renderMessage;renderMessage=function(m,c){let html=d4FinalMessageBase(m,c);if(c.id===HG_ID&&d4Final()?.correct&&d4Final().target==='shen'&&m.hgWho==='shen'){html=html.replace(/<small class="zero-left-status">[^<]*<\/small>/g,'');html=html.replace(/(<div class="sender-name">[^<]*)(<\/div>)/,'$1<small class="zero-left-status">已请离</small>$2')}return html};
function d4FinalRestoreView(route=state.story.route){
 const q=d4Final();if(!q)return;
 if(q.phase==='farewell-wait'&&q.index===0&&!q.huangRead){q.phase='huang-wait';q.huangIndex=0;q.remaining=messageSendDelay()}
 if(q.phase==='dead'){if(lateDeath())renderLateDeath();else beginLateDeath('day4-final-report-wrong');return}
 if(q.phase==='cg'){d4FinalNarrate();return}
 if(['report','confirm'].includes(q.phase)){d4FinalReport();return}
 if(['choice','vote','winner'].includes(q.phase)){zeroCall(openChat,HG_ID);if(q.phase==='vote')d4FinalVoteNotice();if(q.phase==='winner')d4FinalWinner();return}
 if(route?.view==='report-chat'&&route.active===DAY_ONE_REPORT_ID)openReportChat();else if(route?.view==='chat'&&route.active)openChat(route.active);else home();
 if(q.phase==='a-unread')d4FinalANotice();else if(q.phase==='huang-chat'&&!d4FinalInside(D4_HUANG))d4FinalHuangNotice();else if(['chat','farewell'].includes(q.phase)&&!d4FinalInside())d4FinalGroupNotice();
}
const d4FinalResumeBase=resumeStoryScene;resumeStoryScene=function(snapshot,...args){
 if(snapshot?.game?.day!==4||!snapshot.story?.dayFourFinal)return d4FinalResumeBase(snapshot,...args);
 d4FinalRestoreView(snapshot.story.route);persist();
};
const d4FinalCleanupBase=cleanupSceneResume;cleanupSceneResume=function(...args){d4FinalLastTick=0;document.querySelectorAll('#d4-final-confirm,#d4-final-a-notice,#d4-final-huang-notice,#d4-final-notice,#d4-final-release-notice,#d4-final-lin-notice').forEach(el=>el.remove());return d4FinalCleanupBase(...args)};
const d4FinalLockBase=zeroLock;zeroLock=function(){return state.game.day===4&&!['game-menu','nodes'].includes(view)&&['winner','report','confirm','cg'].includes(d4Final()?.phase)||d4FinalLockBase()};
window.addEventListener('click',e=>{const choice=e.target.closest('[data-d4-final-choice]'),button=e.target.closest('[data-action]');if(choice){e.preventDefault();e.stopImmediatePropagation();d4FinalChoose(Number(choice.dataset.d4FinalChoice))}else if(button?.dataset.action?.startsWith('d4-final-')){e.preventDefault();e.stopImmediatePropagation();actions[button.dataset.action]?.()}},true);
document.addEventListener('visibilitychange',()=>{d4FinalLastTick=0});setInterval(d4FinalTick,100);
function d4FinalIdentityMarkup(){return '<div class="d4-final-identity"><header>身份档案</header><div class="identity-owner">'+avatar('linqing')+'<div><small>校园通 · 私人档案</small><strong>林晴</strong></div></div><article class="identity-card"><span class="identity-eyebrow">我的身份</span><div class="identity-role"><h2>暂无身份</h2></div><div class="identity-ability"><span>特殊能力</span><strong>——</strong></div><p>未获得身份档案。</p></article></div>'}
messageRenderers['d4-lin-identity']=()=>'<button type="button" class="d4-final-identity-image" data-action="d4-final-identity-open" aria-label="查看林晴的身份界面">'+d4FinalIdentityMarkup()+'</button>';
actions['d4-final-identity-open']=()=>{if(state.messages[HG_ID]?.some(m=>m.id==='d4-final-identity-0'))sheet('林晴的身份界面',d4FinalIdentityMarkup())};
if(!d3Paused()&&state.game.day===4&&d4Final())d4FinalRestoreView();
