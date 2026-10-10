/* A writable reality phone inside this ending's snapshot; the story's phone stays intact. */
(()=>{
 const apps=['messages','wall','supply','notes','wallet','calendar','campus','phone'];
 const names=['讯息','校园墙','物资中心','备忘录','钱包','日历','校园通','电话'];
 const date='2045-09-09',time='09:33';
 const motherRingtoneSource='assets/audio/ringtone-02-warm-chime.mp3?v=20261011-rc5';
 const base={persist,home,status,openApp,chatList,openChat,forum,postDetail,shop,orders,cartSheet,checkout,pay,renderMessage,contactRow,cartLines,cartTotal,quantity,productCards,productArt,forumAvatar,zeroLock,resumeStoryScene,initializeChapter,savePersonalNotebook,playNotificationSound,checkSurvival,showNotebookNotice};
 let owner=null,entered=null;
 let callTimer=null,callTimerKey=null,callAudio=null,callTypingTimer=null;
 const isVisible=()=>hospitalPhoneMode()&&!window.mobileLaunch&&!['game-menu','nodes'].includes(view);
 const root=()=>owner||state;
 const medicalAidNote={title:'2045年9月1日｜关于林晴的治疗',text:'辅导员今天说，学校已经为林晴启动了「在校生重大医疗应急援助」。\n\n抢救和住院费用由学校先行垫付，后续治疗也会接入市里的困难学生医疗救助和长期护理补助。医院还专门安排了医务社工，负责协调她之后的治疗和康复。\n\n辅导员让我们不用再担心她会因为交不起费用而被迫停止治疗。\n\n很多女生也自发为她捐了钱。金额不重要，几十、几百，大家都只是希望她醒来以后能知道，还有很多人在等她。'};
 function medicalAidPost(){
  return {id:'reality-lin-medical-aid',author:'reality-student-affairs',name:'东川大学学生工作处｜官方',official:true,gender:'neutral',preserveForumNames:true,date:'2045-09-01',time:'18:20',category:'校园日常',title:'学校已为林晴同学启动「在校生重大医疗应急援助」，目前相关抢救及住院费用已完成先行垫付，后续将继续协助申请医疗救助与长期护理补助。',body:'学生援助中心现已开放自愿捐助渠道。所有善款均由学校专项账户统一管理，由负责此事的工作人员直接与医院及康复机构结算，不会转入任何个人或家属账户。\n\n每一笔款项的使用去向都会登记备案，并由工作人员定期公开明细，接受捐助者监督。募集款项仅用于林晴后续的治疗、护理、康复及必要生活保障。\n\n感谢所有提供帮助的同学。也请大家尊重林晴的隐私，不传播未经确认的病情信息。',likes:2876,aidLikesBase:2876,replies:[['rain','小雨','希望她早点醒来。'],['orange','一颗橘子','虽然钱不多，但还是希望能帮上一点忙。']].map(([id,name,text])=>({id:'reality-medical-aid-'+id,author:'reality-medical-aid-'+id,name,gender:'female',text,date:'2045-09-01',time:'18:20',likes:0,replies:[]}))};
 }
 const motherNode=progress=>hospitalMotherNode(hospitalEndingId(progress));
 function medicalAidRecoveryPost(){
  return {id:'reality-lin-medical-aid-recovery',author:'reality-student-affairs',name:'东川大学学生工作处｜官方',official:true,gender:'neutral',preserveForumNames:true,date:'2045-09-09',time:'10:02',category:'校园日常',title:'关于林晴同学医疗援助项目的阶段性进展',body:'经医院及负责此事的医务社工确认，林晴同学已于今日上午恢复意识，目前生命体征平稳，仍需留院接受进一步观察和治疗。\n\n「在校生重大医疗应急援助」及相关捐助项目将继续运行。所有款项仍由学校专项账户统一管理，由工作人员直接与医院及后续康复机构结算。\n\n具体使用明细会按照原计划定期公开，接受所有捐助者监督。\n\n感谢每一位曾经帮助和等待她的人。',likes:0,replies:[['orange','一颗橘子','恭喜！'],['rain','小雨','刚看到消息直接哭了，希望她以后都能平平安安。'],['tart','肯德基蛋挞唯一真神','欢迎回家']].map(([id,name,text])=>({id:'reality-aid-recovery-'+id,author:'reality-aid-recovery-'+id,name,gender:'female',text,date:'2045-09-09',time:'10:02',likes:0,replies:[]}))};
 }
 function medicalAidClosurePost(){
  return {id:'reality-lin-medical-aid-closure',author:'reality-student-affairs',name:'东川大学学生工作处｜官方',official:true,gender:'neutral',preserveForumNames:true,date:'2045-09-09',time:'07:40',category:'校园日常',title:'关于林晴同学医疗援助项目的后续说明',body:'林晴同学于今日凌晨病情突然恶化，经抢救无效，于1时28分离世。\n「在校生重大医疗应急援助」及相关捐助渠道现已停止接收新的款项。\n援助期间产生的医疗、护理等费用，将由学校专项账户直接与相关机构结算。工作人员将在完成核对后公开全部款项明细，接受捐助者监督。\n尚未使用的捐助款项将按照原支付渠道退回，不会转入任何个人或家属账户。\n感谢所有曾经关心、帮助过林晴同学的人。也请大家停止传播未经确认的信息，给予逝者应有的尊重。',likes:0,replies:[['anonymous','匿名用户','节哀'],['rain','小雨','晚安，林晴。']].map(([id,name,text])=>({id:'reality-aid-closure-'+id,author:'reality-aid-closure-'+id,name,gender:'female',text,date:'2045-09-09',time:'07:40',likes:0,replies:[]}))};
 }
 const realityProfiles={
  chenyue:{signature:'问题不大，先吃饭。',moments:[
   {id:'reality-chen-fundraiser',date:'2045年8月28日 12:26',text:'很抱歉占用大家时间，麻烦大家帮忙转发一下\n这是我室友林晴，筹款信息已经和辅导员确认过了，情况属实\n她现在还没有醒，后续治疗需要很多钱\n能帮一点是一点，不能捐的话帮忙转发也可以的\n谢谢大家！',linkCard:{title:'林晴医疗救助',detail:'已筹金额：¥47,862.31',status:'仍需帮助'},replies:[
    {name:'周禾',text:'情况属实，后续捐款去向也会公开'},
    {name:'沈可欣',text:'已经转发了，希望她早点醒'},
    {name:'苏姚',text:'捐了一点，帮忙顶一下'},
    {name:'江晓',text:'已捐，后续如果还需要，可以再联系我'},
    {name:'陈妍',replyTo:'江晓',text:'你已经捐很多了，真的谢谢你'},
    {name:'江晓',replyTo:'陈妍',text:'没关系，希望她能醒过来'}]},
   {id:'reality-chen-dinner',date:'2045年7月30日 19:07',image:'assets/reality-chen-dinner.jpg?v=20261011-rc5',imageAlt:'林晴做的一桌饭菜',text:'晴姐的厨艺太好了呜呜呜\n但是我出钱买的菜，功劳也不小吧！',replies:[
    {name:'周禾',text:'就你吃的最多'},
    {name:'陈妍',replyTo:'周禾',text:'太好吃了呀，震撼美味！'},
    {name:'周禾',replyTo:'陈妍',text:'下次多给【玩家名字】留点，她都没吃上几口'}]}
  ]},
  zhouhe:{signature:'回消息慢，急事打电话',moments:[
   {id:'reality-zhou-awake',date:'2045年9月9日 09:30',text:'【玩家名字】醒了\n谢谢大家这两天的帮忙\n她现在还需要休息，暂时不一一回复',replies:[
    {name:'江颜悦',text:'太好了，终于醒了'},
    {name:'周禾',replyTo:'江颜悦',text:'嗯嗯'},
    {name:'辅导员',text:'让她好好休息，有什么需要及时联系'},
    {name:'周禾',replyTo:'辅导员',text:'好的老师'}]},
   {id:'reality-zhou-class',date:'2045年3月20日 07:57',text:'开学以来第一次没有踩点进教室\n纪念一下',replies:[
    {name:'【玩家名字】',text:'因为我叫了你三次'},
    {name:'周禾',replyTo:'【玩家名字】',text:'也算我自己醒的'},
    {name:'【玩家名字】',replyTo:'周禾',text:'你对“自己醒的”是不是有什么误解'}]}
  ]}
 };
 window.ensureMotherCallNode=function(endingId='019'){
  const id=hospitalMotherNode(endingId),records=nodeRecords();if(records[id]?.checkpoint)return;
  const candidates=[root(),...Object.values(records).map(record=>record.checkpoint)].filter(progress=>motherNode(progress)===id&&['incoming','talking','done'].includes(progress?.story?.dayFourSleep?.phone?.motherCall?.phase));
  const source=candidates.find(progress=>progress.story.dayFourSleep.phone.motherCall.phase==='incoming')||candidates[0];
  if(!source)return;
  // Legacy saves predate this checkpoint. Migrate one whole saved timeline,
  // resetting only the call and its own completion effects; never merge runs.
  const checkpoint=structuredClone(source),phone=checkpoint.story.dayFourSleep.phone;
  phone.motherCall={phase:'incoming',line:0,typed:0,completed:false,noticePhase:'waiting',endingConfirmed:false};
  delete phone.reunionHope;
  phone.system.time='09:33';phone.route={view:'home',active:null};
  if(phone.telephone)phone.telephone.records=phone.telephone.records.filter(record=>record.id!=='hospital-mother');
  checkpoint.story.route={view:'hospital-phone',active:null};
  records[id]={checkpoint,reachedAt:Date.now(),branchPoint:true,legacyMotherCall:true};saveNodes(records);
 };
 const messageActions=Object.fromEntries(['profile','chat-options','toggle-pin','toggle-mute','zero-lin-profile','zero-lin-return','zero-lin-moments','zero-lin-back','zero-lin-music','moment-compose','moment-photo','moment-send'].map(key=>[key,actions[key]]));
 function accidentPosts(){
  const comment=(id,name,text,replyTo=null)=>({id:'reality-'+id,author:'reality-'+id,name,gender:'female',text,replyTo,date, time:'07:08',likes:0,replies:[]});
  const rows=[
   ['1','匿名用户','male','2045-09-07','00:58','女生宿舍那边怎么了？','楼下突然来了好多消防车和救护车。'],
   ['2','过路人','male','2045-09-07','01:34','男寝这边也有人头晕被接走了，但是情况好像没有女生宿舍严重。','刚才看见好几辆救护车从B栋开走了。\n我丢，好吓人啊。'],
   ['3','校园墙管理员','neutral','2045-09-07','07:42','请大家不要传播未经确认的消息。','事故原因正在调查，请以学校后续正式公告为准。'],
   ['4','我一直在哭','female',date,'07:08','有没有B栋醒来的同学报个平安？','']
  ].map(([id,name,gender,date,time,title,body])=>({id:'reality-accident-'+id,author:'reality-author-'+id,name,gender,date,time,title,body,preserveForumNames:true,category:'校园日常',likes:0,replies:[]}));
  rows[3].replies=[comment('thought','思绪','我室友醒了，但是很多事情都记得很乱。'),comment('burger','我想吃汉堡','我朋友还在重症监护室……希望她快点好起来。'),comment('sleep','睡不醒','我朋友走了……'),comment('cat','我有猫饼','拜托大家都回来吧。')];
  rows[3].replies[2].replies=[comment('condolence','思绪','节哀。','睡不醒')];return rows;
 }
 function initialPhone(progress){
  const contacts=['linqing','zhouhe','chenyue','room408'].map(id=>{
   const original=C.contacts.find(c=>c.id===id)||{id,name:id==='chenyue'?'陈妍':id==='zhouhe'?'周禾':'林晴',avatar:id};
   return {...structuredClone(original),unread:0,preview:'',time:'',online:id==='zhouhe',status:id==='room408'?'4 位成员':['linqing','chenyue'].includes(id)?'离线':'在线'};
  });
  const room=contacts.find(c=>c.id==='room408');Object.assign(room,structuredClone(C.contacts.find(c=>c.id==='room408')),{unread:0});
  const roomRows=structuredClone(C.messages.room408).filter(m=>m.gameDate&&m.gameDate<='2045-09-06'&&m.type!=='system');
  for(const m of roomRows)if(m.text==='ok'||m.text==='那你后天回来嘛'){
   m.sender='chenyue';m.name='陈妍';if(m.text!=='ok')m.text='那你后天还回来吗';
  }
  const messages={linqing:[{id:'reality-lin-friend',type:'text',sender:'linqing',name:'林晴',gameDate:'2045-08-28',time:'04:31',text:'能和你做朋友我真的很开心'}],zhouhe:[],chenyue:[],room408:roomRows};
  for(const c of contacts){const last=messages[c.id].findLast(m=>m.type!=='time');c.preview=last?.text||'';c.time=last?.time||''}
  const ordinary=new Map();
  const dateOrdinaryRows=rows=>{for(const row of rows||[]){row.date='2045-09-06';dateOrdinaryRows(row.replies)}};
  for(const p of ordinaryPhoneCatalog.posts){const copy=structuredClone(p);copy.date='2045-09-06';dateOrdinaryRows(copy.replies);wallStampRows(copy.replies,copy.date,copy.time);ordinary.set(copy.id,copy)}
  for(const p of progress.forumPosts||[])if(p.date&&p.date<='2045-09-06'&&!p.afterWall&&!p.nightService&&!p.recruit&&!/检举|请离|身份|生存|新规|封校|学生会清理/.test((p.title||'')+(p.body||''))&&!ordinary.has(p.id))ordinary.set(p.id,structuredClone(p));
  const phone={hospitalPhoneData:true,version:1,profile:structuredClone(progress.profile),accent:progress.accent,preferences:structuredClone(progress.preferences||{}),system:{...C.system,date,time},game:{...structuredClone(C.initialState),wallet:268.5,unlockedApps:[...apps]},story:{started:false,zero:{phase:'finished'},nightServices:{life:false,productsUpdated:true}},contacts,messages,forumPosts:[...ordinary.values(),...accidentPosts()],cart:{},orders:[],note:'',delivery:'到店自取',route:{view:'home',active:null},expanded:[],calendarMonth:'2045-09',calendarSelected:date,forumCategory:'全部',shopCategory:'全部',shopQuery:''};
  phone.game.period='上午';return phone;
 }
 function data(){
  const progress=root(),n=progress.story.dayFourSleep,p=n.phone??=initialPhone(progress);
  if(!p.forumPosts.some(post=>post.id==='reality-lin-medical-aid'))p.forumPosts.push(medicalAidPost());
  const aid=p.forumPosts.find(post=>post.id==='reality-lin-medical-aid');
  if(aid.aidLikesBase!==2876){aid.likes=2876+(aid.liked?1:0);aid.aidLikesBase=2876}
  if(n.endingId==='022'&&n.decisions?.sleep==='continue'&&!p.forumPosts.some(post=>post.id==='reality-lin-medical-aid-closure'))p.forumPosts.push(medicalAidClosurePost());
  if(n.endingId==='023'){
   p.forumPosts=p.forumPosts.filter(post=>post.id!=='reality-lin-medical-aid-closure');
   if(!p.forumPosts.some(post=>post.id==='reality-lin-medical-aid-recovery'))p.forumPosts.push(medicalAidRecoveryPost());
  }
  const lin=p.contacts.find(c=>c.id==='linqing');if(lin){lin.online=n.endingId==='023';lin.status=lin.online?'在线':'离线'}
  for(const post of p.forumPosts||[])if(['reality-accident-1','reality-accident-2','reality-accident-3'].includes(post.id))post.date='2045-09-07';
  const linMessage=p.messages.linqing?.find(message=>message.id==='reality-lin-friend');
  if(linMessage){
   linMessage.text='能和你做朋友我真的很开心';
   const contact=p.contacts.find(c=>c.id==='linqing');if(contact)contact.preview=linMessage.text;
  }
  const room=p.contacts.find(c=>c.id==='room408'),originalRoom=C.contacts.find(c=>c.id==='room408');
  const chen=p.contacts.find(c=>c.id==='chenyue');if(chen){chen.online=false;chen.status='离线'}
  if(room&&originalRoom)for(const key of ['name','avatar','members','status'])room[key]=structuredClone(originalRoom[key]);
  for(const id of ['zhouhe','chenyue']){
   const contact=p.contacts.find(c=>c.id===id);
   if(contact&&!contact.handle)contact.handle=(id==='zhouhe'?'zhouhe_':'chenyan_')+String(Math.floor(100000+Math.random()*900000));
  }
  p.contactProfiles??={};
  for(const id of ['linqing','zhouhe','chenyue'])if(!p.contactProfiles[id]){
   const c=p.contacts.find(c=>c.id===id),identity=CONTACT_IDENTIFIERS.find(p=>p.contact===id);
   p.contactProfiles[id]={...(id==='linqing'?structuredClone(Z.linqingProfile):{signature:'',moments:[]}),key:identity?.key||id,contact:id,avatar:c.avatar,name:c.name,handle:c.handle||identity?.handle||''};
   for(const post of p.contactProfiles[id].moments)delete post.condition;
  }
  for(const [id,content]of Object.entries(realityProfiles)){
   const profile=p.contactProfiles[id];profile.signature=content.signature;
   for(const post of content.moments)if(!profile.moments.some(existing=>existing.id===post.id))profile.moments.push(structuredClone(post));
   const dinner=profile.moments.find(post=>post.id==='reality-chen-dinner');
   if(dinner){dinner.image='assets/reality-chen-dinner.jpg?v=20261011-rc5';dinner.imageAlt='林晴做的一桌饭菜'}
  }
  if(!p.zhouConcernAdded){
   const rows=p.messages.zhouhe??=[];
   if(!rows.some(m=>m.id==='reality-zhou-concern')){
    const text='你还好吗？校园墙说的是真的吗？';
    rows.push({id:'reality-zhou-concern',type:'text',sender:'zhouhe',name:'周禾',gameDate:'2045-09-07',time:'07:31',text});
    const contact=p.contacts.find(c=>c.id==='zhouhe');
    if(contact){contact.unread=(contact.unread||0)+1;contact.preview=text;contact.time='07:31'}
   }
   p.zhouConcernAdded=true;
  }
  if(!p.telephone){
   const used=new Set();p.telephone={contacts:['爸爸','妈妈','林晴','陈妍','周禾'].map(name=>{let number;do{number=String(100000+Math.floor(Math.random()*900000))}while(used.has(number));used.add(number);return {name,number}}),records:[]};
  }
  p.motherCall??={phase:'waiting',line:0,completed:false,noticePhase:'waiting',endingConfirmed:false};
  if(p.motherCall.phase==='done'&&!p.motherCall.endingConfirmed){
   if(n.endingId==='021')p.reunionHope??={phase:'waiting',dueAt:Date.now()+2000};
   p.motherCall.noticePhase=n.endingId==='021'&&p.reunionHope.phase!=='done'?'reunion':'prompt';delete p.motherCall.noticeDueAt;
  }
  if((p.motherCall.completed||p.motherCall.phase==='done')&&p.system.time===time)p.system.time='09:38';
  p.game.unlockedApps=[...apps];p.version=2;return p;
 }
 function stopCallAudio(){const audio=callAudio;callAudio=null;if(audio){audio.pause();audio.currentTime=0}}
 function clearCallTimer(){clearTimeout(callTimer);callTimer=null;callTimerKey=null}
 function clearCallTyping(){clearTimeout(callTypingTimer);callTypingTimer=null}
 function disposeCall(){clearCallTimer();clearCallTyping();stopCallAudio();document.querySelector('#hospital-mother-call')?.remove();document.querySelector('#hospital-reunion-notice')?.remove();document.querySelector('#hospital-ending-confirmation')?.closest('.sheet-backdrop')?.remove()}
 function syncCallAudio(){
  if(!isVisible()||document.hidden||data().motherCall.phase!=='incoming'||mobileSounds.silent||!motherRingtoneSource){stopCallAudio();return}
  if(callAudio)return;
  const audio=callAudio=new Audio(motherRingtoneSource);audio.loop=true;audio.volume=.5;
  audio.play().then(()=>{if(callAudio!==audio)audio.pause()}).catch(()=>{if(callAudio===audio)stopCallAudio()});
 }
 function motherNickname(){
  const value=data().profile?.name??root().profile?.name,name=typeof value==='string'&&value.trim()?value:'同学',last=Array.from(name).at(-1),code=last.codePointAt(0);
  let han;try{han=new RegExp('^(?:\\p{Unified_Ideograph}|〇)$','u').test(last)}catch{han=code===0x3007||[[0x3400,0x4dbf],[0x4e00,0x9fff],[0xf900,0xfaff],[0x20000,0x2a6df],[0x2a700,0x2b739],[0x2b740,0x2b81d],[0x2b820,0x2cea1],[0x2ceb0,0x2ebe0],[0x30000,0x3134a]].some(([start,end])=>code>=start&&code<=end)}
  return han?last+last:name;
 }
 function motherLines(){return [
  {name:'妈妈',text:motherNickname()+'能听见我说话吗？'},
  {name:'妈妈',text:'我现在正在往医院赶，你先不要乱动，听医生的话，知道吗？'},
  {name:'妈妈',text:'妈妈还以为再也听不到你说话了'},
  {name:'旁白',text:'电话那边安静了一会儿，只剩下她压抑的哭声。'},
  {name:'妈妈',text:'醒了就好……醒了就好'}
 ]}
 function motherLineText(c){
  const row=motherLines()[c.line]||motherLines().at(-1);
  return row.name==='旁白'?'（'+row.text+'）':row.text;
 }
 function syncCallTyping(host){
  if(!host?.isConnected||!isVisible()||document.hidden){clearCallTyping();return}
  const c=data().motherCall;if(c.phase!=='talking')return;
  const letters=Array.from(motherLineText(c)),text=host.querySelector('[data-hospital-call-text]'),hint=host.querySelector('.hospital-call-hint');
  if(!text||!hint)return;
  c.typed=Math.max(0,Math.min(letters.length,Number(c.typed)||0));
  const shown=letters.slice(0,c.typed).join(''),tip=c.typed<letters.length?'点击显示完整句子':'点击继续';
  if(text.textContent!==shown)text.textContent=shown;
  if(hint.textContent!==tip)hint.textContent=tip;
  if(c.typed>=letters.length||callTypingTimer!==null)return;
  const line=c.line;
  // Use the phone's timeout path: ordinary story intervals pause in this ending.
  callTypingTimer=setTimeout(()=>{
   callTypingTimer=null;
   if(!isVisible()||document.hidden||!host.isConnected||data().motherCall!==c||c.phase!=='talking'||c.line!==line)return;
   c.typed=Math.min(letters.length,c.typed+1);syncCallTyping(host);
   if(c.typed===letters.length)save();
  },32);
 }
 function renderMotherCall(){
  const c=data().motherCall,key=c.phase+':'+c.line,previous=document.querySelector('#hospital-mother-call');
  if(previous?.dataset.stage===key){if(c.phase==='talking')syncCallTyping(previous);return}
  clearCallTyping();
  previous?.remove();closeSheet();const host=document.createElement('section');host.id='hospital-mother-call';host.dataset.stage=key;host.setAttribute('role','dialog');host.setAttribute('aria-modal','true');host.setAttribute('aria-label','妈妈来电');
  const incoming=c.phase==='incoming';
  host.innerHTML='<div class="hospital-call-person"><h1>妈妈</h1><p>'+ (incoming?'正在呼叫……':'通话中')+'</p></div>'+(incoming?'<div class="hospital-call-actions"><button type="button" data-hospital-decline><span class="hospital-call-circle hospital-call-decline">'+icon('phone')+'</span><span>拒绝</span></button><button type="button" data-hospital-answer><span class="hospital-call-circle hospital-call-answer">'+icon('phone')+'</span><span>接听</span></button></div>':'<button type="button" class="hospital-call-dialogue" data-hospital-call-next aria-label="继续通话"><span class="hospital-call-text" data-hospital-call-text></span><small class="hospital-call-hint"></small></button>');
  const identity=host.querySelector('.hospital-call-person');
  identity.insertAdjacentHTML('afterbegin','<span class="hospital-call-mark" aria-hidden="true">'+icon('phone')+'</span>');
  identity.insertAdjacentHTML('beforeend','<small class="hospital-call-number">'+esc(data().telephone.contacts.find(person=>person.name==='妈妈').number)+'</small>');
  host.classList.toggle('is-incoming',incoming);
  document.querySelector('#phone').append(host);host.querySelector(incoming?'[data-hospital-answer]':'[data-hospital-call-next]').focus();
  if(!incoming)syncCallTyping(host);
 }
 function endingNotice(){
  if(document.querySelector('#hospital-ending-confirmation'))return;
  const ending=window.hospitalEndingInfoFor(root());
  sheet('结局'+ending.id,'<div id="hospital-ending-confirmation"><header class="ending-gallery-head"><small>结局'+esc(ending.id)+'</small><span class="ending-card-symbol" aria-hidden="true">'+icon('file')+'</span><h1>'+esc(ending.name)+'</h1></header><p class="ending-description">'+esc(ending.description)+'</p><button type="button" class="ending-collect-open" data-hospital-ending-confirm>确认</button></div>');
  const modal=document.querySelector('#hospital-ending-confirmation');
  modal.closest('.sheet-backdrop').classList.add('hospital-ending-backdrop');
  modal.closest('.sheet').classList.add('hospital-ending-sheet');
  if(ending.category==='hidden')modal.closest('.sheet').classList.add('hidden-ending');
  modal.closest('.sheet').querySelector('.sheet-header')?.remove();modal.querySelector('[data-hospital-ending-confirm]').focus();
 }
 function scheduleCallChange(kind,due){
  const progress=root(),p=data(),key=kind+':'+due;
  if(callTimerKey===key)return;clearCallTimer();callTimerKey=key;
  callTimer=setTimeout(()=>{
   clearCallTimer();if(state!==progress||!isVisible()||document.hidden||data()!==p)return;
   context(()=>{
    const c=p.motherCall;
    if(kind==='call'&&c.phase==='waiting'){c.phase='incoming';delete c.dueAt}
    if(kind==='reunion')advanceReunionHope();
   });
  },Math.max(0,due-Date.now()));
 }
 function syncCall(){
  if(!isVisible()){disposeCall();return}
  const c=data().motherCall;
  if(document.hidden){clearCallTimer();clearCallTyping();stopCallAudio();return}
  if(c.phase==='incoming'||c.phase==='talking'){
   if(c.phase==='incoming'&&!owner)captureStoryNode(motherNode(root()),root(),{route:{view:'hospital-phone',active:null},branchPoint:true});
   clearCallTimer();renderMotherCall();syncCallAudio();return
  }
  clearCallTyping();document.querySelector('#hospital-mother-call')?.remove();stopCallAudio();
  if(c.phase==='waiting'&&c.dueAt)scheduleCallChange('call',c.dueAt);
  else if(c.phase==='done'&&c.noticePhase==='reunion')syncReunionHope();
  else if(c.phase==='done'&&c.noticePhase==='prompt'){clearCallTimer();endingNotice()}
  else clearCallTimer();
 }
 function answerMother(){const c=data().motherCall;if(c.phase!=='incoming')return;stopCallAudio();c.phase='talking';c.line=0;c.typed=0}
 function reunionHopeMessage(id,text,mine=false){
  const p=data(),rows=p.messages.zhouhe??=[];if(rows.some(m=>m.id===id))return;
  rows.push({id,type:'text',sender:mine?'me':'zhouhe',name:mine?p.profile.name:'周禾',text,gameDate:date,time:p.system.time,...(mine?{status:'read'}:{})});
  const contact=p.contacts.find(c=>c.id==='zhouhe');if(contact){contact.preview=text;contact.time=p.system.time;if(!mine&&!(view==='chat'&&active==='zhouhe'))contact.unread=(contact.unread||0)+1}
 }
 function advanceReunionHope(){
  const p=data(),q=p.reunionHope;if(!q||hospitalEndingId(root())!=='021')return;
  if(q.phase==='waiting'){q.phase='notified';delete q.dueAt;reunionHopeMessage('reality-021-hope','我总觉得，林晴应该也快醒了。')}
  else if(q.phase==='replying'){q.phase='replied';q.dueAt=Date.now()+1200;reunionHopeMessage('reality-021-answer','好。');if(view==='chat'&&active==='zhouhe')chat('zhouhe')}
  else if(q.phase==='replied'){q.phase='done';delete q.dueAt;p.motherCall.noticePhase='prompt'}
 }
 function syncReunionHope(){
  const q=data().reunionHope;if(!q)return;
  if(['waiting','replying','replied'].includes(q.phase)){scheduleCallChange('reunion',q.dueAt);return}
  clearCallTimer();
  if(q.phase==='notified'&&!document.querySelector('#hospital-reunion-notice')){
   const el=document.createElement('div');el.id='hospital-reunion-notice';el.className='opening-message';
   el.innerHTML='<button class="opening-body" data-hospital-reunion-open><span>'+avatar('zhouhe')+'</span><span><small>讯息 · 现在</small><strong>周禾</strong><span>我总觉得，林晴应该也快醒了。</span></span></button>';document.querySelector('#phone').append(el);
  }
 }
 function chooseReunionHope(index){
  const q=data().reunionHope;if(!q||!['notified','choice'].includes(q.phase)||![0,1].includes(index)||hospitalEndingId(root())!=='021')return;
  q.choice=index;q.phase='replying';q.dueAt=Date.now()+messageSendDelay();
  reunionHopeMessage('reality-021-reply',['嗯，我们一起等她','她会回来的'][index],true);chat('zhouhe');
 }
 function nextMotherLine(){
  const p=data(),c=p.motherCall;if(c.phase!=='talking')return;
  clearCallTyping();
  const length=Array.from(motherLineText(c)).length;
  if((c.typed||0)<length){c.typed=length;return}
  if(c.line<motherLines().length-1){c.line++;c.typed=0;return}
  c.phase='done';c.completed=true;c.completedAt=Date.now();c.noticePhase='prompt';delete c.noticeDueAt;p.system.time='09:38';clearCallTimer();stopCallAudio();
  if(!p.telephone.records.some(r=>r.id==='hospital-mother'))p.telephone.records.unshift({id:'hospital-mother',name:'妈妈',number:p.telephone.contacts.find(c=>c.name==='妈妈').number,date,time,duration:300,direction:'incoming'});
  document.querySelector('#hospital-mother-call')?.remove();homePhone();
 }
 function confirmEnding(){
  const c=data().motherCall;if(c.phase!=='done'||c.noticePhase!=='prompt')return;
  if(!window.endingGalleryConfirmHospital(root()))return;
  c.endingConfirmed=true;c.noticePhase='confirmed';closeSheet();homePhone();
 }
 function telephone(){
  const book=data().telephone;view='phone';active=null;
  screen.innerHTML='<section class="app-page hospital-telephone">'+header('电话')+'<div class="hospital-phone-section"><h2>联系人</h2><span>'+book.contacts.length+'</span></div><div class="hospital-phone-book">'+book.contacts.map(c=>'<div class="hospital-contact"><strong>'+esc(c.name)+'</strong><span class="hospital-contact-number">'+esc(c.number)+'</span></div>').join('')+'</div><div class="hospital-phone-section"><h2>通话记录</h2><span>'+book.records.length+'</span></div>'+(book.records.length?'<div class="hospital-phone-book">'+book.records.map(r=>'<div class="hospital-record"><span class="hospital-record-symbol" aria-hidden="true">'+icon('phone')+'</span><div class="hospital-record-person"><strong>'+esc(r.name)+'</strong><small>'+esc(r.number)+' · 呼入</small></div><div class="hospital-record-detail"><span>'+Math.round(r.duration/60)+'分钟</span><small>9月9日 '+esc(r.time)+'</small></div></div>').join('')+'</div>':'<div class="hospital-phone-empty"><span aria-hidden="true">'+icon('phone')+'</span><p>暂无通话记录</p></div>')+'</section>';
 }
 function save(){
  if(owner)return;
  // Bypass story migration/collection wrappers: no old clues or announcements belong here.
  if(window.mobileLaunch||storyRestoring||['game-menu','nodes'].includes(view))return;
  try{state.story.route={view:'hospital-phone',active:null};ensureStoryTimeline(state);state.timeline.snapshotAt=Date.now();const value=JSON.stringify(state);GameStorage.setItem(STORAGE_KEY,value);GameStorage.setItem(GAME_CONTINUE_KEY,value)}catch(error){GameStorage.report(error,toast)}
 }
 function context(fn){
  if(owner)return fn();const progress=state,p=data();
  const previous={products:C.products,apps:C.apps,dock:C.dock,layout:C.homeLayout,forumCategory,shopCategory,shopQuery,calendarMonth,calendarSelected,notes:personalNotebookValue,profileOrigin:linProfileOrigin};
  owner=progress;state=p;C.products=ordinaryPhoneCatalog.products;C.apps=previous.apps.filter(a=>apps.includes(a.id)).map(a=>({...a,name:names[apps.indexOf(a.id)],visible:true,locked:false}));C.homeLayout={main:[...apps]};C.dock=[];
  forumCategory=p.forumCategory;shopCategory=p.shopCategory;shopQuery=p.shopQuery;calendarMonth=p.calendarMonth;calendarSelected=p.calendarSelected;personalNotebookValue=p.note;
  linProfileOrigin=p.profileOrigin||{chat:'linqing',members:false};
  try{return fn()}finally{
   p.route={view,active};p.forumCategory=forumCategory;p.shopCategory=shopCategory;p.shopQuery=shopQuery;p.calendarMonth=calendarMonth;p.calendarSelected=calendarSelected;
   p.profileOrigin=linProfileOrigin;linProfileOrigin=previous.profileOrigin;
   const returnButton=screen.querySelector('.page-head button[aria-label^="返回"]');
   if(['lin-profile','lin-moments'].includes(view)&&returnButton)p.socialBack={view,action:returnButton.dataset.action,label:returnButton.getAttribute('aria-label')};
   state=progress;owner=null;C.products=previous.products;C.apps=previous.apps;C.dock=previous.dock;C.homeLayout=previous.layout;
   forumCategory=previous.forumCategory;shopCategory=previous.shopCategory;shopQuery=previous.shopQuery;calendarMonth=previous.calendarMonth;calendarSelected=previous.calendarSelected;personalNotebookValue=previous.notes;
   save();chrome();
  }
 }
 function chrome(){
  const visible=isVisible(),phone=document.querySelector('#phone');phone.classList.toggle('hospital-phone',visible);if(!visible){disposeCall();return}
  phone.classList.remove('zero-immersive','cg-active','survey-active','survey-notifying','late-death-active','report-death-active','pickup16-active');
  for(const el of document.querySelectorAll('.opening-message,#identity-reward,#notebook-collected,#d4-delegation-notice'))if(el.id!=='hospital-reunion-notice')el.remove();
  for(const el of [earlySleepButton,midnightContinue,cgExitButton])el.hidden=true;
  const dock=document.querySelector('#dock');if(dock.childNodes.length)dock.innerHTML='';syncMessageTabs();refreshPhoneBack();syncCall();syncMomentReplies();
 }
 function enter(){
  if(entered===state)return;entered=state;
  disposeCall();
  cancelMobilePhoneTimeouts();cleanupStoryTimeline();closeSheet();clearInterval(cgTypingTimer);d4HospitalStopSound();
  clearTimeout(notebookNoticeTimer);notebookNoticeTimer=null;notebookNoticeQueue.length=0;
  clearTimeout(window.toastTimer);document.querySelector('#toast')?.classList.remove('show');
  document.querySelectorAll('.opening-message,.zero-transition,.ending-morning-veil,#morning-title,#identity-reward,#notebook-collected').forEach(el=>el.remove());
  for(const sound of Object.values(interactionSounds)){sound.pause();sound.currentTime=0}
  data();
 }
 function header(title,action='home'){return '<header class="page-head"><button class="icon-button" data-action="'+action+'" aria-label="返回">'+icon('back')+'</button><h1>'+esc(title)+'</h1></header>'}
 function statusPhone(){ordinaryPhoneUI.status();const clock=document.querySelector('#status>span');if(clock)clock.textContent='9月9日 '+data().system.time}
 function homePhone(){
  ordinaryPhoneUI.home();statusPhone();updateHomeDaylight();replaceHomeSymbols();
  screen.querySelector('.home-footnote').innerHTML='<button type="button" data-hospital-menu>点击此处返回主页</button>';
  const c=data().motherCall;if(c.phase==='waiting')c.dueAt??=Date.now()+3000;
 }
 function message(m,c){
  if(m.type==='time')return '';
  let html=ordinaryPhoneUI.renderMessage(m,c);const rows=state.messages[c.id],index=rows.indexOf(m);
  html=html.replace(/(<div class="message-meta">)[^<]*/g,'$1').replace(/<div class="message-meta">\s*<\/div>/g,'');
  html=html.replace(/<div class="message(?=[\s"])([^"]*)"/,(_,classes)=>'<div class="message'+classes+'" data-skin-sender="'+esc(JSON.stringify([m.sender||c.avatar,m.name||'']))+'" data-skin-time="'+esc(m.time||'')+'" data-skin-date="'+esc(m.gameDate||m.date||'')+'" data-skin-read="'+(!c.members&&m.sender==='me'&&m.status==='read')+'"');
  if(messageStartsGroup(rows,index))html='<div class="divider message-group-time">'+esc(m.id==='reality-lin-friend'?'2045年8月28日 04:31':messageTimeLabel(m))+'</div>'+html;
  return html;
 }
 function contactRowPhone(c){
  const latest=latestConversationMessage(c);
  return ordinaryPhoneUI.contactRow(latest?{...c,preview:latest.text??c.preview,time:messageTimeLabel({...latest,time:latest.time||c.time})}:c);
 }
 function chat(id){
  if(!state.contacts.some(c=>c.id===id))return;
  ordinaryPhoneUI.openChat(id);syncMessageTheme();
  decorateContactAvatars(screen);
  const q=data().reunionHope;
  if(id==='zhouhe'&&hospitalEndingId(root())==='021'&&q&&['notified','choice','replying','replied'].includes(q.phase)){
   document.querySelector('#hospital-reunion-notice')?.remove();
   if(q.phase==='notified')q.phase='choice';
   const composer=screen.querySelector('#composer');
   if(composer){composer.querySelectorAll('button,textarea,input').forEach(el=>el.disabled=true);if(q.phase==='choice')composer.insertAdjacentHTML('beforebegin','<div class="zero-choices"><button data-hospital-reunion-choice="0">嗯，我们一起等她</button><button data-hospital-reunion-choice="1">她会回来的</button></div>')}
  }
 }
 function contactProfile(id){
  if(!state.contactProfiles?.[id])return;
  state.messageProfile=id;linProfile();
 }
 function decorateContactAvatars(scope){
  for(const portrait of scope.querySelectorAll('.avatar')){
   if(portrait.closest('button'))continue;
   const id=Object.keys(state.contactProfiles).find(id=>portrait.dataset.avatarId===chatAvatarLibrary.resolve(C.avatars.find(a=>a.id===currentAvatarId(state.contactProfiles[id].avatar)))?.id);
   if(!id)continue;
   const button=document.createElement('button');button.type='button';button.className='npc-avatar-button';button.dataset.messageProfile=id;button.setAttribute('aria-label','查看'+state.contactProfiles[id].name+'个人资料');portrait.replaceWith(button);button.append(portrait);
  }
 }
 function contacts(){messageContacts()}
 const momentPostBindings=new WeakMap();
 function moments(id){
  if(id){if(!state.contactProfiles[id])return;state.messageProfile=id;linMoments()}
  else {
   messageMoments();
   const heading=screen.querySelector('.feed-heading');
   const posts=Array.isArray(state.hospitalMoments)?state.hospitalMoments:[];
   heading?.insertAdjacentHTML('afterend',posts.map((p,i)=>'<article class="friends-moment" data-hospital-moment="'+i+'">'+avatar('me')+'<div class="friend-post-content"><button type="button" class="friend-post-name">'+esc(state.profile.name)+'</button><p class="lin-moment-text">'+esc(p.text)+'</p><time>'+esc(momentDate(p.date))+'</time><div class="lin-existing-replies">'+p.replies.map(r=>'<p><strong>'+esc(r.name)+'</strong>'+(r.replyTo?'<span>回复</span><strong>'+esc(r.replyTo)+'</strong>':'')+'：'+esc(r.text)+'</p>').join('')+'</div></div></article>').join(''));
   for(const el of screen.querySelectorAll('[data-hospital-moment]'))momentPostBindings.set(el,posts[Number(el.dataset.hospitalMoment)]);
  }
 }
 function momentDate(value){return String(value||'').replace(/^(\d{4})-(\d{2})-(\d{2})/,(_,y,m,d)=>y+'年'+Number(m)+'月'+Number(d)+'日')}
 let momentReplyTimer=null;
 function syncMomentReplies(){
  if(momentReplyTimer!==null){clearTimeout(momentReplyTimer);momentReplyTimer=null}
  if(!isVisible()||document.hidden||storyRestoring)return;
  const progress=root(),phone=data(),now=Date.now();let due=Infinity,changed=false;
  for(const p of phone.hospitalMoments||[]){
   if(!Array.isArray(p.pendingReplies))continue;
   const pending=p.pendingReplies;
   // Only the head can run. Start the next wait after this reply is inserted.
   const r=pending[0];if(!r)continue;
   if(!Number.isFinite(r.at)){r.at=now+(p.replyInterval===2000?2000:r.name==='林晴'?3000:1000);changed=true}
   if(r.at<=now){
    (p.replies??=[]).push({name:r.name,text:r.text,...(r.replyTo?{replyTo:r.replyTo}:{})});
    pending.shift();changed=true;
    if(pending[0])pending[0].at=now+(p.replyInterval===2000?2000:pending[0].name==='林晴'?3000:1000);
   }
   if(pending[0])due=Math.min(due,pending[0].at);
  }
  if(changed){
   save();
   if(view==='message-moments')for(const el of screen.querySelectorAll('[data-hospital-moment]')){
    const p=momentPostBindings.get(el),replies=el.querySelector('.lin-existing-replies');
    if(p&&phone.hospitalMoments.includes(p)&&replies)replies.insertAdjacentHTML('beforeend',p.replies.slice(replies.children.length).map(r=>'<p><strong>'+esc(r.name)+'</strong>'+(r.replyTo?'<span>回复</span><strong>'+esc(r.replyTo)+'</strong>':'')+'：'+esc(r.text)+'</p>').join(''));
   }
  }
  if(Number.isFinite(due))momentReplyTimer=window.mobileNativeTimeout(()=>{momentReplyTimer=null;if(root()===progress&&isVisible())syncMomentReplies()},Math.max(0,due-Date.now()));
 }
 function composeTextMoment(){
  composeMoment();screen.querySelector('[data-action="moment-photo"]')?.remove();
 }
 function sendTextMoment(){
  if(view!=='moment-compose')return;
  const text=String(screen.querySelector('#moment-draft')?.value||'').trim();
  if(!text)return toast('写点什么再发送吧');
  const phone=data();
  if(!Array.isArray(phone.hospitalMoments))phone.hospitalMoments=[];
  const posts=phone.hospitalMoments,count=posts.length,linAllowed=hospitalEndingId(root())==='023';
  const original=[{name:'周禾',text:'还玩手机呢？快好好休息去'},{name:'林晴',replyTo:'周禾',text:'就让她玩吧'}];
  // Older test posts have no replyKind: use the actual stored reply sequence as evidence.
  const secondUsed=posts.some(p=>['second','second-comfort'].includes(p.replyKind)||[...(p.replies||[]),...(p.pendingReplies||[])].some(r=>r.name==='周禾'&&r.text==='你等我买完关东煮就上楼收你手机'));
  const moodText=text.replace(/(?:不再|并不|没有|不)(?:难过|伤心|低落|迷茫|孤独|绝望|悲伤|沮丧)/g,'');
  const lowMood=/难过|伤心|低落|迷茫|孤独|绝望|悲伤|沮丧|不开心|不快乐|想哭|好累|很累|撑不住|坚持不下去|没有方向|不知道.*(?:怎么办|何去何从|往哪|怎么走)|看不到希望/.test(moodText);
  let replies,replyKind,replyGroupId;
  const secondTurn=count>=1&&!secondUsed;
  if(secondTurn){
   const clock=/^(\d{1,2}):(\d{2})$/.exec(phone.system.time);
   if(clock){const minutes=Number(clock[1])*60+Number(clock[2])+2;phone.system.time=String(Math.floor(minutes/60)%24).padStart(2,'0')+':'+String(minutes%60).padStart(2,'0')}
   statusPhone();
  }
  if(lowMood&&secondTurn){
   replyKind='second-comfort';replyGroupId='second-comfort';
   replies=[{name:'周禾',text:'等我买完吃的就上楼，好吗？别多想'},{name:'林晴',text:'你这样，我会很担心你的……'}];
  }else if(lowMood){
   replyKind='comfort';replyGroupId='comfort';
   replies=[{name:'周禾',text:'一切都会好起来的，我一直都在'},{name:'林晴',text:phone.profile.name+'，你怎么了？'}];
  }else if(secondTurn){
   replyKind='second';replyGroupId='second';
   replies=[{name:'周禾',text:'……'},{name:'周禾',text:'你等我买完关东煮就上楼收你手机'},{name:'林晴',text:'哈哈，你把周禾姐姐气到啦'},{name:'周禾',replyTo:'林晴',text:'你就不气人吗？一个两个都不好好休息'}];
  }else{
   replyKind='ordinary';
   const pool=[{id:'rest',rows:original}];
   if(linAllowed)pool.push({id:'downstairs-023',rows:[{name:'周禾',text:'我刚下楼你就玩手机是吧'},{name:'林晴',replyTo:'周禾',text:'什么吃的，我也想吃'}]});
   const group=count===0?pool[Math.floor(Math.random()*pool.length)]:pool[0];
   replyGroupId=group.id;replies=group.rows;
  }
  const now=Date.now(),pendingReplies=replies.filter(r=>linAllowed||r.name!=='林晴'&&r.replyTo!=='林晴').map((r,i)=>({...r,at:i===0?now+2000:null}));
  posts.unshift({text,date:momentDate(phone.system.date+' '+phone.system.time),replies:[],pendingReplies,replyInterval:2000,replyKind,replyGroupId});
  state.momentDraft='';moments();
 }
 function forumPhone(){
  state.forumPosts.sort((a,b)=>(b.date+' '+b.time).localeCompare(a.date+' '+a.time));ordinaryPhoneUI.forum();screen.querySelector('[data-forum-category="校园新规"]')?.remove();
 }
 function forumAvatarPhone(id,name,gender){
  const account=forumAvatarLibrary.accounts[id],pool=forumAvatarLibrary.pools[gender||account?.gender||'neutral'];
  let hash=0;for(const ch of String(id))hash=(hash*31+ch.charCodeAt(0))>>>0;const image=pool[hash%pool.length];
  return '<span class="avatar" data-forum-account="'+esc(id)+'" data-avatar-id="'+image+'"><img src="'+forumAvatarLibrary.src(image)+'" alt="'+esc(name||'匿名用户')+'"></span>';
 }
 function commentMarkupPhone(c,parent=null){
  return '<div class="rule-comment '+(parent?'nested-comment':'')+'">'+forumAvatar(c.author,c.name,c.gender)+'<div class="comment-content"><div class="comment-heading"><strong>'+esc(c.author==='me'?state.profile.name:c.name)+'</strong><button data-hospital-comment-like="'+c.id+'" aria-pressed="'+!!c.liked+'">'+(c.liked?'♥':'♡')+' '+(c.likes||0)+'</button></div><p>'+(c.replyTo?'回复 '+esc(c.replyTo)+'：':'')+esc(c.text)+'</p><small class="wall-comment-time">'+esc(wallDateLabel(c))+'</small><button class="aw-reply-button" data-hospital-reply="'+c.id+'">回复</button>'+(!parent&&c.replies?.length?'<button class="thread-toggle" data-hospital-thread="'+c.id+'">'+(state.expanded.includes(c.id)?'收起回复':'展开 '+c.replies.length+' 条回复')+'</button>'+(state.expanded.includes(c.id)?c.replies.map(r=>commentMarkupPhone(r,c.id)).join(''):''):'')+'</div></div>';
 }
 function post(id){
  const p=state.forumPosts.find(p=>p.id===id);if(!p)return;
  view='post';active=id;closeSheet();
  const numberRows=(rows,prefix)=>rows.forEach((r,i)=>{r.id??=prefix+'-'+i;r.replies??=[];numberRows(r.replies,r.id)});numberRows(p.replies,p.id);
  screen.innerHTML='<section class="app-page forum-page">'+header('帖子详情','forum')+'<article class="post-detail"><div class="post-author">'+forumAvatar(p.author,p.name,p.gender)+'<span>'+esc(p.author==='me'?state.profile.name:p.name)+'<small>'+esc(wallDateLabel(p))+'</small></span></div><h2>'+esc(p.title)+'</h2><p>'+esc(p.body)+'</p><button class="pill-button '+(p.liked?'liked':'')+'" data-like="'+p.id+'">'+(p.liked?'♥ 已赞':'♡ 点赞')+' '+p.likes+'</button></article><h3 class="reply-title">全部回复 · '+p.replies.reduce((sum,r)=>sum+1+(r.replies?.length||0),0)+'</h3>'+p.replies.map(r=>commentMarkupPhone(r)).join('')+'<form class="rule-comment-form wall-unified-composer" id="hospital-reply-form"><input name="reply" aria-label="回复内容" placeholder="友善地说两句…" required maxlength="500"><button class="pill-button">回复</button></form></section>';
  screen.querySelector('#hospital-reply-form').onsubmit=e=>{e.preventDefault();const text=e.target.elements.reply.value.trim();if(!text)return;p.replies.push(newReply(text));post(id)};
 }
 function newReply(text,replyTo=null){return {id:'reality-reply-'+storyRunId(),author:'me',name:state.profile.name,text,date,time:data().system.time,replyTo,likes:0,replies:[]}}
 function findComment(id){const p=state.forumPosts.find(p=>p.id===active);for(const c of p?.replies||[]){if(c.id===id)return {post:p,comment:c,parent:c};const r=c.replies?.find(r=>r.id===id);if(r)return {post:p,comment:r,parent:c}}}
 function replyTo(id){
  const target=findComment(id);if(!target)return;
  sheet('回复 '+esc(target.comment.name),'<form id="hospital-nested-reply" class="rule-comment-form"><input name="reply" aria-label="回复内容" required maxlength="500"><button class="pill-button">回复</button></form>');
  document.querySelector('#hospital-nested-reply').onsubmit=e=>{e.preventDefault();const text=e.target.elements.reply.value.trim();if(!text)return;target.parent.replies.push(newReply(text,target.comment.name));if(!state.expanded.includes(target.parent.id))state.expanded.push(target.parent.id);post(target.post.id)};
 }
 function shopPhone(){ordinaryPhoneUI.shop();screen.querySelector('.shop-nav span').textContent='校园自营 · 到店自取 / 无人机派送'}
 function checkoutPhone(){
  const rows=ordinaryPhoneUI.cartLines(),total=ordinaryPhoneUI.cartTotal();if(!rows.length)return toast('请先选择商品');
  sheet('确认订单','<label class="setting-row">配送方式<select id="hospital-delivery"><option'+(state.delivery==='到店自取'?' selected':'')+'>到店自取</option><option'+(state.delivery==='无人机派送'?' selected':'')+'>无人机派送</option></select></label>'+rows.map(p=>'<div class="cart-line"><span>'+esc(p.name)+' × '+p.quantity+'</span><strong>¥ '+money(p.price*p.quantity)+'</strong></div>').join('')+'<div class="order-total">实付款 <strong>¥ '+money(total)+'</strong></div><p>钱包支付 · 余额 '+state.game.wallet.toFixed(2)+' 元</p><button class="primary" data-action="pay" '+(total>Math.round(state.game.wallet*100)?'disabled':'')+'>确认支付</button><button class="secondary" data-action="cart">返回购物袋</button>');
  document.querySelector('#hospital-delivery').onchange=e=>{state.delivery=e.target.value};
 }
 function payPhone(){
  const lines=ordinaryPhoneUI.cartLines(),total=ordinaryPhoneUI.cartTotal(),balance=Math.round(state.game.wallet*100);if(!lines.length||total<=0||total>balance)return;
  state.orders.unshift({id:'REAL-'+storyRunId(),time:date+' '+data().system.time,total,lines:structuredClone(lines),delivery:state.delivery,status:state.delivery==='到店自取'?'待自提':'待配送'});state.game.wallet=(balance-total)/100;state.cart={};shopPhone();
  sheet('支付成功','<div class="payment-success">'+icon('check')+'<h3>支付成功</h3><p>'+state.delivery+'</p><strong>¥ '+money(total)+'</strong></div><button class="primary" data-action="orders">查看订单</button><button class="secondary" data-action="close">继续逛逛</button>');
 }
 function ordersPhone(){ordinaryPhoneUI.orders();const empty=screen.querySelector('.empty-app');if(empty)empty.innerHTML='暂无订单';screen.querySelectorAll('.order-card').forEach((el,i)=>{el.querySelector('.post-foot span:last-child').textContent=state.orders[i].status})}
 function wallet(){view='wallet';active=null;renderCampusWallet();const empty=screen.querySelector('.wallet-history-empty strong');if(empty)empty.textContent='暂无消费记录'}
 function notes(){view='notes';active=null;screen.innerHTML=ordinaryPhoneUI.notebookPageMarkup();screen.querySelector('.notebook-intro').insertAdjacentHTML('afterend','<article class="notebook-paper"><h3>'+esc(medicalAidNote.title)+'</h3>'+medicalAidNote.text.split('\n\n').map(text=>'<p>'+esc(text)+'</p>').join('')+'</article>');screen.querySelector('.notebook-paper-foot span').textContent='自动保存';screen.querySelector('#note-text').oninput=e=>{state.note=e.target.value}}
 function calendar(){phoneCalendar();screen.querySelector('.calendar-today p').textContent=data().system.time}
 function campus(){
  view='campus';active=null;screen.innerHTML=campusPageMarkup(false);
  const services=['学生信息','校园卡','课程表','校园公告','网络状态'];
  screen.querySelector('.campus-services').innerHTML=services.map(label=>'<div class="setting-row hospital-service-display"><span>'+label+'</span></div>').join('');
  screen.querySelector('.campus-detail-list').innerHTML=['校园网络','校园卡服务','教务服务'].map(label=>'<div><span>'+label+'</span><strong>正常</strong></div>').join('');
  const status=screen.querySelector('.campus-status');screen.querySelector('.campus-intro').after(status);
 }
 function campusService(key){
  const title={student:'学生信息',card:'校园卡',classes:'课程表',announcements:'校园公告',network:'网络状态'}[key];if(!title)return;
  const content=key==='student'?'<div class="setting-row">姓名<span>'+esc(state.profile.name)+'</span></div><div class="setting-row">学校<span>东川大学</span></div>':key==='card'?'<div class="setting-row">校园卡服务<span>正常</span></div>':key==='network'?['校园网络','校园卡服务','教务服务'].map(label=>'<div class="setting-row">'+label+'<span>正常</span></div>').join(''):'';
  sheet(title,content+'<button class="primary" data-action="close">返回</button>');
 }
 function chatListPhone(){ordinaryPhoneUI.chatList()}
 function navigate(id){
  closeSheet();if(id==='home')return homePhone();if(id==='messages')return chatListPhone();if(id==='message-contacts')return contacts();if(id==='message-moments')return moments();
  if(id==='phone')return telephone();
  if(id==='wall')return forumPhone();if(id==='post')return post(active);if(id==='supply')return shopPhone();if(id==='orders')return ordersPhone();if(id==='wallet')return wallet();if(id==='notes')return notes();if(id==='calendar')return calendar();if(id==='campus')return campus();homePhone();
 }
 function back(){if(document.querySelector('#overlay .sheet'))return closeSheet();if(view==='chat'||view.startsWith('message-'))return navigate('messages');if(view==='post')return navigate('wall');if(view==='orders')return navigate('supply');navigate('home')}
 function click(button){
  const d=button.dataset;if(button.disabled)return;
  if(d.action==='moment-compose')return composeTextMoment();
  if(d.action==='moment-send')return sendTextMoment();
  if(d.action==='moment-photo')return;

  if(button.hasAttribute('data-hospital-reunion-open'))return chat('zhouhe');
  if(d.hospitalReunionChoice!==undefined)return chooseReunionHope(Number(d.hospitalReunionChoice));
  if(d.action==='page-back'||button.id==='homebar')return back();
  if(d.app)return navigate(apps.includes(d.app)?d.app:'home');if(d.contact)return chat(d.contact);if(d.post)return post(d.post);
  if(d.messageProfile)return contactProfile(d.messageProfile);
  if(d.action?.startsWith('message-moments-')){
   const id=d.action.slice('message-moments-'.length),contact=id==='lin'?'linqing':id;
   if(state.contactProfiles[contact]){state.messageProfile=contact;return enterContactMoments(linMoments)}
  }
  if(d.identifierProfile)return identifierSearchProfile(d.identifierProfile);
  if(d.hospitalMoments)return moments(d.hospitalMoments);
  if(d.forumCategory){forumCategory=d.forumCategory;return forumPhone()}if(d.shopCategory){shopCategory=d.shopCategory;return shopPhone()}
  if(d.like)return toggleWallLike(state.forumPosts.find(p=>p.id===d.like));
  if(d.hospitalCommentLike){const r=findComment(d.hospitalCommentLike);if(r){toggleWallLike(r.comment);post(active)}return}
  if(d.hospitalReply)return replyTo(d.hospitalReply);
  if(d.hospitalThread){state.expanded=state.expanded.includes(d.hospitalThread)?state.expanded.filter(id=>id!==d.hospitalThread):[...state.expanded,d.hospitalThread];return post(active)}
  if(d.qty){const n=(state.cart[d.qty]||0)+Number(d.delta);if(n<0||n>99||!C.products.some(p=>p.id===d.qty))return;const cart=!!document.querySelector('[aria-label="购物袋"]');state.cart[d.qty]=n;shopPhone();if(cart)ordinaryPhoneUI.cartSheet();return}
  if(d.calendarShift){const [y,m]=calendarMonth.split('-').map(Number);calendarMonth=new Date(Date.UTC(y,m-1+Number(d.calendarShift),1)).toISOString().slice(0,7);return calendar()}
  if(d.calendarDate){calendarSelected=d.calendarDate;return calendar()}
  if(d.walletOrder){const order=state.orders.find(o=>o.id===d.walletOrder);if(order)sheet('消费详情','<div class="wallet-receipt"><h3>−'+money(order.total)+' 元</h3><p>'+esc(order.time)+'</p><p>'+esc(order.delivery)+'</p></div>');return}
  const commands={home:homePhone,'phone-desktop':homePhone,list:()=>navigate('messages'),'message-conversations':()=>navigate('messages'),'message-contacts':contacts,'message-moments':()=>moments(),close:closeSheet,forum:forumPhone,'write-post':ordinaryPhoneUI.writePost,shop:shopPhone,cart:ordinaryPhoneUI.cartSheet,checkout:checkoutPhone,pay:payPhone,orders:ordersPhone,'calendar-today':()=>{calendarMonth='2045-09';calendarSelected=date;calendar()},'save-note':()=>{state.note=screen.querySelector('#note-text').value;toast('备忘录已保存')},profile:messageActions.profile,'zero-lin-profile':()=>contactProfile('linqing'),'chat-options':()=>{messageActions['chat-options']();decorateContactAvatars(document.querySelector('#overlay'))},'new-chat':contacts,'identifier-search':contacts};
  if(commands[d.action])return commands[d.action]();if(messageActions[d.action])return messageActions[d.action]();if(d.action==='message-moments-lin'){state.messageProfile='linqing';return enterContactMoments(linMoments)}if(['voice-call','video-call'].includes(d.action))sheet(d.action==='voice-call'?'语音通话':'视频通话','<p>暂未连接通话服务。</p><button class="primary" data-action="close">返回聊天</button>');
 }
 window.hospitalPhoneInput=event=>{
  if(!isVisible())return;
  const button=event.target.closest('button');
  const call=data().motherCall,calling=['incoming','talking'].includes(call.phase),confirming=call.phase==='done'&&call.noticePhase==='prompt';
  if(calling||confirming){
   if(event.type==='click'){
    event.preventDefault();event.stopImmediatePropagation();
    if(button?.hasAttribute('data-hospital-answer'))context(answerMother);
    else if(button?.hasAttribute('data-hospital-call-next'))context(nextMotherLine);
    else if(button?.hasAttribute('data-hospital-ending-confirm'))context(confirmEnding);
   }else if(event.type==='keydown'){
    event.stopImmediatePropagation();
    if(event.key==='Tab'){
     event.preventDefault();const buttons=[...document.querySelectorAll('#hospital-mother-call button,#hospital-ending-confirmation button')],index=buttons.indexOf(document.activeElement);buttons[(index+(event.shiftKey?-1:1)+buttons.length)%buttons.length]?.focus();
    }else if(event.key==='Escape')event.preventDefault();
   }else{event.preventDefault();event.stopImmediatePropagation()}
   return;
  }
  if(event.type==='click'&&button?.hasAttribute('data-hospital-menu')){
   event.preventDefault();event.stopImmediatePropagation();save();disposeCall();document.querySelector('#phone').classList.remove('hospital-phone');zeroMenu();return;
  }
  if(event.type==='keydown'&&event.key!=='Escape')return;
  event.stopImmediatePropagation();
  if(event.type==='click'&&button){
   event.preventDefault();if(button.disabled)return;
   if(button.type==='submit'&&button.form){const form=button.form;if(form.reportValidity())context(()=>form.onsubmit?.call(form,{target:form,currentTarget:form,preventDefault(){}}))}
   else context(()=>click(button));
  }
  else if(event.type==='input'||event.type==='change'){const fn=event.target['on'+event.type];if(fn)context(()=>fn.call(event.target,event))}
  else if(event.type==='submit'){event.preventDefault();const fn=event.target.onsubmit;if(fn)context(()=>fn.call(event.target,event))}
  else if(event.type==='keydown'){event.preventDefault();context(back)}
 };
 persist=function(...args){if(owner)return;if(isVisible())return save();return base.persist(...args)};
 const originalCopyContactHandle=copyContactHandle;
 copyContactHandle=function(...args){return isVisible()?context(()=>originalCopyContactHandle(...args)):originalCopyContactHandle(...args)};
 savePersonalNotebook=function(value){if(isVisible()){context(()=>{state.note=String(value)});return true}return base.savePersonalNotebook(value)};
 zeroLock=function(){return isVisible()?false:base.zeroLock()};
 playNotificationSound=function(...args){if(hospitalPhoneMode())return;return base.playNotificationSound(...args)};
 checkSurvival=function(...args){if(hospitalPhoneMode())return;return base.checkSurvival(...args)};
 showNotebookNotice=function(...args){if(hospitalPhoneMode()){notebookNoticeQueue.length=0;return}return base.showNotebookNotice(...args)};
 const replacements={home:homePhone,status:statusPhone,openApp:navigate,chatList:chatListPhone,openChat:chat,forum:forumPhone,postDetail:post,shop:shopPhone,orders:ordersPhone,cartSheet:ordinaryPhoneUI.cartSheet,checkout:checkoutPhone,pay:payPhone,renderMessage:message,contactRow:contactRowPhone,cartLines:ordinaryPhoneUI.cartLines,cartTotal:ordinaryPhoneUI.cartTotal,quantity:ordinaryPhoneUI.quantity,productCards:ordinaryPhoneUI.productCards,productArt:ordinaryPhoneUI.productArt,forumAvatar:forumAvatarPhone};
 for(const [name,fn]of Object.entries(replacements))globalThis[name]=function(...args){if(isVisible()){if(!owner)enter();return context(()=>fn(...args))}return base[name](...args)};
 resumeStoryScene=function(snapshot,...args){
  disposeCall();
  if(hospitalPhoneMode()){enter();const route={...data().route},socialBack=data().socialBack;context(()=>{statusPhone();if(route.view==='chat')chat(route.active);else if(route.view==='post')post(route.active);else if(route.view==='hospital-profile')contactProfile(route.active);else if(route.view==='lin-profile')linProfile(true);else if(route.view==='lin-moments')linMoments();else if(route.view==='moment-compose')composeTextMoment();else if(route.view==='message-moments')moments(route.active);else navigate(route.view);if(socialBack?.view===view){const button=screen.querySelector('.page-head button');if(button){button.dataset.action=socialBack.action;button.setAttribute('aria-label',socialBack.label)}}});return}
  document.querySelector('#phone').classList.remove('hospital-phone');return base.resumeStoryScene(snapshot,...args);
 };
 initializeChapter=function(...args){disposeCall();entered=null;document.querySelector('#phone').classList.remove('hospital-phone');return base.initializeChapter(...args)};
 const style=document.createElement('style');style.textContent='#phone.hospital-phone #dock,#phone.hospital-phone #post-early-sleep,#phone.hospital-phone #midnight-continue-sleep,#phone.hospital-phone #cg-recovery-home{display:none!important}#phone.hospital-phone #screen{height:calc(100% - 43px);padding-bottom:0}';document.head.append(style);
 style.textContent+=`
 #phone.hospital-phone .hospital-service-display{justify-content:center;cursor:default}
 #hospital-mother-call{position:absolute;inset:0;z-index:15000;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;padding:64px 24px 36px;background:radial-gradient(ellipse at 50% 0%,#46544780 0,transparent 58%),radial-gradient(ellipse at 95% 100%,#3f505333,transparent 60%),linear-gradient(165deg,#1b2523,#0c1316);color:#e2e8e5;font-family:inherit}
 #hospital-mother-call::before{content:'';position:absolute;inset:18px;border:1px solid #afc1b211;border-radius:30px;pointer-events:none}
 #hospital-mother-call .hospital-call-person{text-align:center;margin-top:0;position:relative}
 #hospital-mother-call .hospital-call-mark{display:grid;place-items:center;width:42px;height:42px;margin:0 auto 18px;border:1px solid #b6c8b537;border-radius:15px;color:#b2c4b0;background:#b1c7b00a}
 #hospital-mother-call .hospital-call-mark svg{width:19px;height:19px}
 #hospital-mother-call .hospital-call-number{display:block;margin-top:12px;font-size:12px;letter-spacing:3px;color:#879d94;font-variant-numeric:tabular-nums}
 #hospital-mother-call h1{font-size:32px;line-height:1.5;font-weight:500;letter-spacing:3px;margin:0 0 12px}
 #hospital-mother-call .hospital-call-person p{font-size:15px;color:#a4b3ad;margin:0;letter-spacing:1px}
 #hospital-mother-call .hospital-call-actions{display:flex;justify-content:space-between;width:100%;max-width:270px;gap:50px;margin-top:auto;margin-bottom:36px}
 #hospital-mother-call .hospital-call-actions button{display:flex;flex-direction:column;align-items:center;gap:13px;background:none;color:inherit;font:inherit;font-size:14px;border:0;padding:0}
 #hospital-mother-call .hospital-call-circle{display:grid;place-items:center;width:72px;height:72px;border:1px solid #ffffff26;border-radius:50%;color:#fff;box-shadow:0 0 0 8px #ffffff04,0 10px 30px #0004,inset 0 1px 0 #ffffff20;transition:transform .18s,box-shadow .18s}
 #hospital-mother-call .hospital-call-actions button:active .hospital-call-circle{transform:scale(.94)}
 #hospital-mother-call button:focus-visible{outline:2px solid #c1d2ba;outline-offset:8px}
 #hospital-mother-call .hospital-call-circle svg{width:30px;height:30px}
 #hospital-mother-call .hospital-call-decline{background:linear-gradient(145deg,#a86e77,#83505a)}
 #hospital-mother-call .hospital-call-decline svg{transform:rotate(135deg)}
 #hospital-mother-call .hospital-call-answer{background:linear-gradient(145deg,#809b81,#52715e)}
 #hospital-mother-call .hospital-call-dialogue{position:absolute;top:50%;left:24px;right:24px;transform:translateY(-50%);text-align:center;font:inherit;color:inherit;background:transparent;border:0;border-radius:0;box-shadow:none;padding:16px 8px;cursor:pointer}
 #hospital-mother-call .hospital-call-text{display:block;font-size:17px;line-height:2;letter-spacing:.5px;white-space:pre-wrap;min-height:2em}
 #hospital-mother-call .hospital-call-hint{display:block;margin-top:26px;font-size:11px;font-weight:400;color:#a4b3ad}
 #phone.hospital-phone .hospital-telephone{padding:18px 22px 32px;background:radial-gradient(ellipse at 100% 0%,#37443a65,transparent 50%),#131c1b;color:#dbe3d9;font-family:inherit}
 .hospital-telephone .page-head{margin-bottom:28px}
 .hospital-telephone .page-head h1{font-size:25px;font-weight:500;letter-spacing:3px}
 .hospital-telephone .page-head .icon-button{border:1px solid #b5c2b51f;background:#a4b39d0a;border-radius:14px;color:#c4d1c0}
 .hospital-phone-section{display:flex;align-items:center;gap:10px;margin:26px 2px 13px}
 .hospital-phone-section h2{margin:0;font-size:12px;font-weight:500;letter-spacing:2px;color:#aabbab}
 .hospital-phone-section>span{font-size:10px;color:#859b8b;font-variant-numeric:tabular-nums}
 .hospital-phone-section::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,#a5b69f26,transparent);margin-left:4px}
 .hospital-phone-book{border:1px solid #aabda424;border-radius:20px;padding:0 18px;background:linear-gradient(140deg,#a9bd9c0e,#72867804);box-shadow:0 8px 26px #00000012;overflow:hidden}
 .hospital-contact{display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:65px}
 .hospital-contact+.hospital-contact,.hospital-record+.hospital-record{border-top:1px solid #aebda414}
 .hospital-contact strong,.hospital-record strong{font-size:15px;font-weight:500;letter-spacing:1px}
 .hospital-contact-number{color:#92a899;font-size:13px;letter-spacing:2px;font-variant-numeric:tabular-nums}
 .hospital-record{display:flex;align-items:center;gap:12px;padding:20px 0}
 .hospital-record-symbol{display:grid;place-items:center;width:34px;height:34px;flex-shrink:0;border-radius:12px;background:#91b08d12;border:1px solid #a4c19a24;color:#acc3a5}
 .hospital-record-symbol svg{width:16px;height:16px}
 .hospital-record-person{flex:1;min-width:0}
 .hospital-record small{display:block;margin-top:7px;font-size:10px;color:#84988b;line-height:1.5;font-variant-numeric:tabular-nums}
 .hospital-record-detail{text-align:right;flex-shrink:0;font-size:12px;color:#bdccb7}
 .hospital-phone-empty{padding:28px 16px;text-align:center;border:1px dashed #afc1a722;border-radius:20px;background:#adbd9e03;color:#7f9487}
 .hospital-phone-empty>span{display:inline-flex;padding:12px;border-radius:50%;background:#acbc9f08}
 .hospital-phone-empty svg{width:20px;height:20px;opacity:.7}
 .hospital-phone-empty p{margin:12px 0 0;font-size:12px;letter-spacing:1px}
 @media(max-height:640px){#hospital-mother-call{padding-top:38px;padding-bottom:20px}#hospital-mother-call .hospital-call-mark{margin-bottom:10px;width:32px;height:32px}#hospital-mother-call .hospital-call-actions{margin-bottom:12px}#hospital-mother-call .hospital-call-text{font-size:15px;line-height:1.8}}
 #overlay .hospital-ending-backdrop{align-items:center;justify-content:center;padding:24px;background:#040908b8}
 #overlay .hospital-ending-sheet{max-width:370px;max-height:90%;padding:30px 26px;border:1px solid #a6b79c38;border-radius:22px;background:radial-gradient(ellipse at 85% 0%,#303b32 0,transparent 52%),linear-gradient(160deg,#1b2320,#0c1112 75%);color:#d8ddd8;box-shadow:0 18px 60px #0006;font-family:inherit}
 #hospital-ending-confirmation .ending-gallery-head{text-align:center;margin-bottom:22px}
 #hospital-ending-confirmation .ending-gallery-head h1{font-size:23px;letter-spacing:1px}
 #hospital-ending-confirmation .ending-card-symbol{margin:23px 0 19px}
 #hospital-ending-confirmation .ending-description{white-space:pre-line;margin:18px 0 24px}
 #hospital-ending-confirmation .ending-collect-open{margin-top:4px}
 #overlay .hospital-ending-sheet.hidden-ending{background:var(--ending-romance-bg);border-color:var(--ending-romance-border);color:var(--ending-romance-text)}
 .hospital-ending-sheet.hidden-ending .ending-gallery-head h1{color:var(--ending-romance-text)}
 .hospital-ending-sheet.hidden-ending .ending-gallery-head>small,.hospital-ending-sheet.hidden-ending .ending-card-symbol{color:var(--ending-romance-accent)}
 .hospital-ending-sheet.hidden-ending .ending-description{color:var(--ending-romance-muted)}
 .hospital-ending-sheet.hidden-ending .ending-collect-open{background:var(--ending-romance-accent);border-color:var(--ending-romance-border);color:#39222f}
 `;
 new MutationObserver(chrome).observe(document.querySelector('#phone'),{childList:true,subtree:true});
 document.addEventListener('visibilitychange',()=>{if(isVisible())syncCall();else stopCallAudio()});
 window.addEventListener('pagehide',()=>{if(isVisible())save();clearCallTimer();clearCallTyping();stopCallAudio()});
 window.addEventListener('pageshow',()=>{if(isVisible()){syncCall();syncMomentReplies()}});
 window.addEventListener('visibilitychange',()=>syncMomentReplies());
 window.addEventListener('pagehide',()=>{if(momentReplyTimer!==null)clearTimeout(momentReplyTimer);momentReplyTimer=null});
 window.addEventListener('storage',()=>{if(isVisible())syncCallAudio()});
 if(isVisible()){enter();context(homePhone)}
})();
