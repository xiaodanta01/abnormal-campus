/* A writable reality phone inside this ending's snapshot; the story's phone stays intact. */
(()=>{
 const apps=['messages','wall','supply','notes','wallet','calendar','campus','phone'];
 const names=['讯息','校园墙','物资中心','备忘录','钱包','日历','校园通','电话'];
 const date='2045-09-09',time='09:33';
 const motherAvatarId='chat_hospital_mother';
 if(!C.avatars.some(a=>a.id===motherAvatarId))C.avatars.push({id:motherAvatarId,name:'妈妈',src:'assets/chat-avatars/hospital-mother.jpg?v=20261016-rc2'});
 const fatherAvatarId='chat_hospital_father';
 if(!C.avatars.some(a=>a.id===fatherAvatarId))C.avatars.push({id:fatherAvatarId,name:'爸爸',src:'assets/chat-avatars/hospital-father.jpg?v=20261016-rc2'});
 const motherRingtoneSource='assets/audio/ringtone-02-warm-chime.mp3?v=20261016-rc2';
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
   {id:'reality-chen-dinner',date:'2045年7月30日 19:07',image:'assets/reality-chen-dinner.jpg?v=20261016-rc2',imageAlt:'林晴做的一桌饭菜',text:'晴姐的厨艺太好了呜呜呜\n但是我出钱买的菜，功劳也不小吧！',replies:[
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
 function ensureAccidentDreamComment(posts){
  for(const [id,likes]of [['1',2889],['2',678],['3',1973],['4',379]]){
   const p=posts.find(p=>p.id==='reality-accident-'+id);
   if(p&&p.accidentLikesBase!==likes){p.likes=likes+(p.liked?1:0);p.accidentLikesBase=likes}
  }
  const post=posts.find(p=>p.id==='reality-accident-4');if(!post)return;
  const id='reality-accident-dream',rows=post.replies??=[];
  let comment=rows.find(c=>c.id===id);
  if(!comment){
   const reply=(key,name,text)=>({id:id+'-'+key,author:id+'-'+key,name,gender:'female',text,date,time:'07:08',likes:0,replies:[]});
   comment={...reply('author','命运你阿帕次','有没有人经历了什么普通生学生会的事情？还是说是我做梦梦到的……'),id,pinned:true,replies:[
    reply('sleep','睡不醒','什么鬼？？'),
    reply('dumpling','早点水饺','？？？我也梦到了'),
    reply('toast','云朵吐司','你在说什么啊？')
   ]};
   rows.unshift(comment);
  }
  comment.pinned=true;
  comment.time='09:12';
  if(comment.accidentLikesBase!==29){comment.likes=29+(comment.liked?1:0);comment.accidentLikesBase=29}
  const stamp=items=>{for(const row of items||[]){if(row.author!=='me'&&row.id!=='reality-accident-dream-response')row.time='09:13';stamp(row.replies)}};
  stamp(rows.filter(row=>row!==comment));stamp(comment.replies);
  const dumpling=comment.replies.find(r=>r.id===id+'-dumpling');
  if(dumpling&&dumpling.accidentLikesBase!==10){dumpling.likes=10+(dumpling.liked?1:0);dumpling.accidentLikesBase=10}
  const index=rows.indexOf(comment);if(index>0){rows.splice(index,1);rows.unshift(comment)}
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
  ensureAccidentDreamComment(p.forumPosts);
  if(hospitalEndingId(progress)==='023')ensureEpilogueMotherChat(p);
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
  const giftThanks=p.messages.linqing?.find(message=>message.id==='epilogue-023-gift-thanks-0');
  if(giftThanks&&giftThanks.text!=='谢谢你'){const contact=p.contacts.find(c=>c.id==='linqing');if(contact?.preview===giftThanks.text)contact.preview='谢谢你';giftThanks.text='谢谢你'}
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
  if(hospitalEndingId(root())==='023'&&['rolling','done'].includes(p.epilogueCalendar?.phase)){
   const profile=p.contactProfiles.linqing;
   profile.signature='允许自己像一朵花、一棵树、一根草';
   if(p.epilogueMall?.phoneEnding?.node?.startsWith('trip-')||p.epilogueMall?.finish==='travel')travelMoments(p);
   if(profile?.moments.some(post=>post.id==='rain'||post.id==='music'))profile.moments=profile.moments.filter(post=>post.id!=='rain'&&post.id!=='music');
  }
  for(const [id,content]of Object.entries(realityProfiles)){
   const profile=p.contactProfiles[id];profile.signature=content.signature;
   for(const post of content.moments)if(!profile.moments.some(existing=>existing.id===post.id))profile.moments.push(structuredClone(post));
   const dinner=profile.moments.find(post=>post.id==='reality-chen-dinner');
   if(dinner){dinner.image='assets/reality-chen-dinner.jpg?v=20261016-rc2';dinner.imageAlt='林晴做的一桌饭菜'}
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
  ensureMotherIdentity(p);ensureFatherIdentity(p);
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
  c.endingConfirmed=true;c.noticePhase='confirmed';if(hospitalEndingId(root())==='023')data().epilogueCalendar??={phase:'waiting'};closeSheet();homePhone();
 }
 // Confirmed 023 phone use counts across apps. Leaving the phone or
 // backgrounding resets dwell time; animation progress is saved.
 let epilogueOwner=null,epilogueLast=0,epilogueElapsed=0;
 let epilogueMusic=null,epilogueMusicStarting=false,epilogueMusicBlocked=false,epilogueMusicFadeAt=0,epilogueMusicKey=null,epilogueMusicOwner=null;
 const bgmSettingsKey=STORAGE_KEY+'-epilogue-bgm';
 let bgmSettings={enabled:true,volume:35};
 try{const stored=JSON.parse(GameStorage.getItem(bgmSettingsKey)||'null');if(stored){bgmSettings.enabled=stored.enabled!==false;if(Number.isFinite(stored.volume))bgmSettings.volume=Math.max(0,Math.min(100,stored.volume))}}catch{}
 function saveBgmSettings(){try{GameStorage.setItem(bgmSettingsKey,JSON.stringify(bgmSettings))}catch{} }
 function bgmApp(){
  closeSheet();view='hospital-bgm';active=null;
  screen.innerHTML=header('背景音乐')+'<section class="epilogue-bgm-settings"><div class="epilogue-bgm-row"><span>背景音乐</span><button type="button" role="switch" aria-label="背景音乐" aria-checked="'+bgmSettings.enabled+'" data-action="epilogue-bgm-toggle"><i></i></button></div><div class="epilogue-bgm-volume"><label for="epilogue-bgm-volume">音量</label><output id="epilogue-bgm-value">'+bgmSettings.volume+'%</output><input id="epilogue-bgm-volume" type="range" min="0" max="100" step="1" value="'+bgmSettings.volume+'" aria-label="背景音乐音量"></div></section>';
  screen.querySelector('#epilogue-bgm-volume').oninput=event=>{bgmSettings.volume=Number(event.target.value);screen.querySelector('#epilogue-bgm-value').textContent=bgmSettings.volume+'%';saveBgmSettings();if(epilogueMusic)epilogueMusic.volume=bgmSettings.volume/100;};
 }
 let epilogueInviteFadeAt=0;
 function epilogueMusicTrack(p){
  const q=p?.epilogueMall;
  if(q?.riverMusicStarted)return 'river';
  if(q&&((q.node==='riverside'&&mallSceneCGKey(q)==='parkArrival')||/^(river-|high-|mid-|low-|trip-|finish-|years-pass)/.test(q.node)))return 'river';
  if(p?.messages?.linqing?.some(m=>m.id==='epilogue-023-shopping-invite-0'))return 'invite';
  if(['calendar22','done'].includes(p?.epilogueGift?.phase))return null;
  return ['rolling','done'].includes(p?.epilogueCalendar?.phase)?'calendar':null;
 }
 function epilogueMusicWanted(){
  const progress=root(),p=progress?.story?.dayFourSleep?.phone;
  return bgmSettings.enabled&&isVisible()&&webEpilogueReady()&&!document.hidden&&!mobileSounds.silent&&hospitalEndingId(progress)==='023'&&p?.motherCall?.endingConfirmed&&!!epilogueMusicTrack(p);
 }
 function syncEpilogueMusic(){
  if(owner)return;
  const p=root()?.story?.dayFourSleep?.phone,key=epilogueMusicTrack(p);
  if(epilogueMusicOwner!==p||epilogueMusicKey!==key){
   epilogueMusic?.pause();epilogueMusic=null;epilogueMusicStarting=false;epilogueMusicBlocked=false;epilogueMusicFadeAt=0;epilogueMusicOwner=p;epilogueMusicKey=key;epilogueInviteFadeAt=0;
  }
  if(!epilogueMusicWanted()||(key==='calendar'&&p?.epilogueMusicEnded?.[key])){
   if(epilogueMusic){epilogueMusic.pause();epilogueMusic.volume=0}
   epilogueMusicFadeAt=0;return;
  }
  if(!epilogueMusic){
   const audio=epilogueMusic=new Audio(key==='river'?'assets/audio/epilogue-riverside.m4a?v=20261016-rc2':key==='invite'?'assets/audio/epilogue-shopping-invite.mp3?v=20261016-rc2':'assets/audio/epilogue-honey-lemon.mp3?v=20261016-rc2');audio.loop=key!=='calendar';audio.volume=0;
   audio.addEventListener('ended',()=>{if(key!=='calendar'||epilogueMusic!==audio||root()?.story?.dayFourSleep?.phone!==p)return;(p.epilogueMusicEnded??={})[key]=true;save()});
  }
  if(epilogueMusic.paused){
   if(epilogueMusicStarting||epilogueMusicBlocked||epilogueMusic.ended)return;
   const audio=epilogueMusic;epilogueMusicStarting=true;audio.volume=0;
   audio.play().then(()=>{if(epilogueMusic!==audio){audio.pause();return}epilogueMusicStarting=false;if(!epilogueMusicWanted()){audio.pause();return}epilogueMusicFadeAt=Date.now()}).catch(()=>{if(epilogueMusic!==audio)return;epilogueMusicStarting=false;epilogueMusicBlocked=true});return;
  }
  const musicScene=p.epilogueMall;
  const musicRow=(musicScene?.index||0)-(musicScene?.choiceLead?.node===musicScene?.node?1:0);
  const leaving=key==='invite'&&((musicScene?.node==='dinner-checkout'&&musicRow>=3)||musicScene?.node==='riverside');
  if(leaving)epilogueInviteFadeAt||=Date.now();else epilogueInviteFadeAt=0;
  const inviteFade=epilogueInviteFadeAt?Math.max(0,1-(Date.now()-epilogueInviteFadeAt)/2000):1;
  if(leaving&&inviteFade===0){musicScene.riverMusicStarted=true;save();syncEpilogueMusic();return}
  const fadeOut=key==='calendar'&&p.epilogueGift?.phase==='reply-wait'?Math.min(1,Math.max(0,p.epilogueGift.remaining/3000)):inviteFade;
  if(epilogueMusicFadeAt)epilogueMusic.volume=(bgmSettings.volume/100)*Math.min(1,Math.max(0,(Date.now()-epilogueMusicFadeAt)/1500))*fadeOut;
 }
 mobileNativeInterval(syncEpilogueMusic,100);
 for(const event of ['pointerdown','keydown'])document.addEventListener(event,()=>{epilogueMusicBlocked=false;syncEpilogueMusic()},{capture:true});
 document.addEventListener('visibilitychange',syncEpilogueMusic);
 window.addEventListener('pagehide',()=>{epilogueMusic?.pause();epilogueMusicFadeAt=0});
 // Web-only resource gate: no persistent flags, so old saves remain unchanged.
 function webEpilogueReady(force=false){
  const p=root()?.story?.dayFourSleep?.phone;
  if(hospitalEndingId(root())!=='023'||!p?.motherCall?.endingConfirmed)return true;
  if(!force&&(!p.epilogueCalendar||p.epilogueCalendar.phase==='waiting'))return true;
  return WebEpilogueLoader.ensure();
 }
 function epilogueTick(){
  const current=root(),p=current?.story?.dayFourSleep?.phone;
  const activeEnding=!owner&&isVisible()&&!document.hidden&&hospitalEndingId(current)==='023'&&p?.motherCall?.endingConfirmed;
  // Old confirmed endings predate this feature and never ran its confirm hook.
  if(activeEnding&&!p.epilogueCalendar){p.epilogueCalendar={phase:'waiting'};save()}
  if(activeEnding&&p.epilogueCalendar?.version!==2){p.epilogueCalendar={phase:'waiting',version:2};save()}
  const q=p?.epilogueCalendar,eligible=activeEnding&&q&&q.phase!=='done';
  if(!eligible){epilogueLast=0;epilogueElapsed=0;document.querySelector('#hospital-epilogue-calendar')?.remove();return}
  if(!webEpilogueReady()){epilogueLast=0;return}
  const now=Date.now();
  if(epilogueOwner!==current){epilogueOwner=current;epilogueLast=0;epilogueElapsed=0}
  const delta=epilogueLast?Math.min(250,now-epilogueLast):0;epilogueLast=now;epilogueElapsed+=delta;
  if(q.phase==='waiting'){
   if(epilogueElapsed>=24000&&!webEpilogueReady(true)){epilogueLast=0;return}
   if(epilogueElapsed<25000)return;
   q.phase='rolling';q.day=9;epilogueElapsed=-600;data();syncEpilogueMusic();save();
  }
  let layer=document.querySelector('#hospital-epilogue-calendar');
  if(!layer){
   layer=document.createElement('div');layer.id='hospital-epilogue-calendar';layer.setAttribute('role','dialog');layer.setAttribute('aria-modal','true');layer.setAttribute('aria-label','日历翻至9月17日');
   layer.innerHTML='<div class="epilogue-calendar-card"><div class="epilogue-calendar-rings"><i></i><i></i></div><p>九月 · SEPTEMBER</p><div class="epilogue-calendar-window"><div class="epilogue-calendar-days">'+Array.from({length:9},(_,i)=>'<div>9.'+(i+9)+'</div>').join('')+'</div></div><span class="epilogue-calendar-time">10:07</span></div>';
   document.querySelector('#phone').append(layer);
   layer.querySelector('.epilogue-calendar-days').style.transform='translateY(-'+((q.day||9)-9)*96+'px)';
  }
  if(q.day<17&&epilogueElapsed>=180){q.day++;epilogueElapsed=0;layer.querySelector('.epilogue-calendar-days').style.transform='translateY(-'+(q.day-9)*96+'px)';save()}
  if(q.day===17&&epilogueElapsed>=900){
   q.phase='done';q.version=2;p.system.date='2045-09-17';p.system.time='10:07';p.game.wallet=5468.50;p.motherTransferBalanceAdjusted=true;p.motherTransferBalanceVersion=2;p.calendarMonth='2045-09';p.calendarSelected=p.system.date;p.epilogueDischarge??={phase:'waiting',remaining:3000,index:0};
   layer.remove();epilogueLast=0;epilogueElapsed=0;context(homePhone);save();
  }
 }
 // The story interval wrapper deliberately stops inside the reality phone.
 mobileNativeInterval(epilogueTick,100);
 document.addEventListener('visibilitychange',()=>{epilogueLast=0;epilogueElapsed=0;epilogueTick()});
 window.addEventListener('pagehide',()=>{epilogueLast=0;epilogueElapsed=0});
 const dischargeChoices=['今天最好的消息！','不用谢我们，大家都是自愿帮你的','太好了，恭喜你'];
 const dischargeNarration=['林晴出院的消息令你十分高兴。不过她刚出院的话，给她买点什么礼物好呢？','你想到她总是那几件衣服穿来穿去，要不就买一套新衣服给她吧。'];
 let dischargeOwner=null,dischargeLast=0;
 function ensureFatherIdentity(p){
  const id='epilogue-father',number=p.telephone.contacts.find(c=>c.name==='爸爸')?.number||'';
  let contact=p.contacts.find(c=>c.id===id);
  if(!contact){contact={id,name:'爸爸',unread:0,preview:'',time:'',online:false,status:''};p.contacts.push(contact)}
  Object.assign(contact,{avatar:fatherAvatarId,handle:number,directoryOnly:true});
  p.contactProfiles[id]={key:id,contact:id,name:'爸爸',avatar:fatherAvatarId,handle:number,signature:'',moments:[]};
 }
 function ensureMotherIdentity(p){
  const id='epilogue-mother';let contact=p.contacts.find(c=>c.id===id);
  if(!contact){contact={id,name:'妈妈',unread:0,preview:'',time:'',online:false,status:''};p.contacts.push(contact)}
  Object.assign(contact,{name:'妈妈',avatar:motherAvatarId,handle:'680173'});
  const rows=p.messages[id]??=[];for(const row of rows)if(row.sender==='hospital-mother-empty')row.sender=motherAvatarId;
  const profile=p.contactProfiles[id]??={moments:[]};
  Object.assign(profile,{key:id,contact:id,name:'妈妈',avatar:motherAvatarId,handle:'680173',signature:'人在决定幸福时幸福'});
  const mother=p.telephone.contacts.find(c=>c.name==='妈妈');if(mother)mother.number='680173';
  for(const record of p.telephone.records)if(record.id==='hospital-mother')record.number='680173';
 }
 function ensureEpilogueMotherChat(p){
  if(!p.epilogueDischarge)return;
  // Correct either previous starting balance once, preserving subsequent spending.
  if(p.motherTransferBalanceVersion!==2&&Number.isFinite(p.game.wallet)){const previousBalance=p.motherTransferBalanceAdjusted?8147.50:2947.50;p.game.wallet=(Math.round(p.game.wallet*100)+546850-Math.round(previousBalance*100))/100;p.motherTransferBalanceAdjusted=true;p.motherTransferBalanceVersion=2}
  if(p.epilogueDischarge.phase==='waiting')return;
  const id='epilogue-mother',sender=motherAvatarId,rows=p.messages[id]??=[];
  if(!p.contacts.some(c=>c.id===id))p.contacts.push({id,name:'妈妈',avatar:sender,unread:0,preview:'谢谢妈妈',time:'11:23',online:false,status:''});
  const add=(key,fields)=>{if(!rows.some(m=>m.id===key))rows.push({id:key,gameDate:'2045-09-10',time:'11:23',status:'read',...fields})};
  add('epilogue-mother-transfer',{type:'transfer',sender,name:'妈妈',amount:5200,received:true,text:'已收款'});
  add('epilogue-mother-care',{type:'text',sender,name:'妈妈',text:'宝贝不够再和妈妈说'});
  if(!rows.some(m=>m.id==='epilogue-mother-receipt')){
   const thanks=rows.findIndex(m=>m.id==='epilogue-mother-thanks');
   rows.splice(thanks<0?rows.length:thanks,0,{id:'epilogue-mother-receipt',type:'transfer',sender:'me',name:p.profile.name,amount:5200,received:true,text:'已收款',gameDate:'2045-09-10',time:'11:23',status:'read'});
  }
  add('epilogue-mother-thanks',{type:'text',sender:'me',name:p.profile.name,text:'谢谢妈妈'});
  for(const row of rows)if(row.id==='epilogue-mother-transfer'||row.id==='epilogue-mother-receipt')row.amount=5200;
  p.contacts.find(c=>c.id===id).unread=0;p.motherTransferHistoryAdded=true;
 }
 function dischargeMessage(p,id,sender,text){
  const rows=p.messages.room408??=[];if(rows.some(m=>m.id===id))return;
  const name=sender==='me'?p.profile.name:sender==='linqing'?'林晴':'周禾';
  rows.push({id,type:'text',sender,name,text,gameDate:'2045-09-17',time:'11:08',...(sender==='me'?{status:'read'}:{})});
  const room=p.contacts.find(c=>c.id==='room408');if(room){room.preview=text;room.time='11:08';if(sender!=='me'&&!(view==='chat'&&active==='room408'))room.unread=(room.unread||0)+1}
 }
 function dischargeMoment(p){
  const rows=p.contactProfiles.linqing.moments;if(rows.some(m=>m.id==='epilogue-023-discharge'))return;
  rows.unshift({id:'epilogue-023-discharge',date:'2045年9月17日 11:08',text:'谢谢大家，我今天出院了。\n谢谢你们帮助我，为我做出的一切，我真的很感激你们，是你们给了我新的生命，我会努力报答你们的',replies:[{name:'周禾',text:'你好好的就好，不用报答我'},{name:'小奶芙芙',text:'恭喜你呀！以后的日子会越来越好的'},{name:'地球用户1022',text:'加油小晴'},{name:'垂耳兔',text:'有什么事都要和大家说哦，我们很愿意帮助你！'},{name:'苹果派',text:'啊啊啊，太好了！！'}]});
 }
 const epilogueCaptured=new WeakMap();
 function captureEpilogueNodes(){
  if(owner||storyRestoring||!isVisible()||hospitalEndingId(root())!=='023')return;
  const progress=root(),p=data(),q=p.epilogueShopping;
  const candidates=[];
  if(p.epilogueDischarge?.phase==='choice')candidates.push(['discharge',{view:'chat',active:'room408'}]);
  if(p.epilogueDischarge?.phase==='done'&&p.shoppingMallUnlocked&&!p.epilogueGift&&!Object.keys(p.mall?.purchased||{}).length)candidates.push(['gift-shopping',{view:'hospital-shopping-mall',active:null}]);
  if(q?.phase==='choice'&&q.node==='invite')candidates.push(['shopping-invite',{view:'chat',active:'linqing'}]);
  if(p.taxi?.phase==='arrived'&&p.taxi.arrivalScene!=='done')candidates.push(['arrival',{view:'hospital-taxi-arrival-cg',active:null}]);
  if(p.epilogueMall?.node==='intro'&&p.epilogueMall.phase==='choice')candidates.push(['mall-choice',{view:'hospital-epilogue-mall-cg',active:null}]);
  if(p.epilogueMall?.node==='dinner-invite')candidates.push(['dinner-invite',{view:'hospital-epilogue-mall-cg',active:null}]);
  if(p.taxiUnlocked&&(!p.taxi||p.taxi.phase==='booking'))candidates.push(['taxi-choice',{view:'hospital-taxi',active:null}]);
  if(p.taxi?.phase==='riding')candidates.push(['taxi-'+p.taxi.car,{view:'hospital-taxi',active:null}]);
  const mall=p.epilogueMall,sceneRoute={view:'hospital-epilogue-mall-cg',active:null};
  if(mall?.node==='dinner-seat'&&mall.phase==='choice')candidates.push(['photo-choice',sceneRoute]);
  if(mall?.node==='dinner-checkout')candidates.push(['river-invite',sceneRoute]);
  if(mall?.node==='river-breeze'&&mall.phase==='choice')candidates.push(['river-reply',sceneRoute]);
  if(mall?.node==='river-steps'&&mall.phase==='choice')candidates.push(['river-joy',sceneRoute]);
  if(mall?.phase==='ending'&&epilogueFinishes[mall.finish])candidates.push(['finish-'+mall.finish,{view:'hospital-epilogue-finish',active:null}]);
  const branchKeys={'river-first':'river-first','river-laugh':'river-laugh',jewelry:'shop-jewelry',island:'shop-island',tea:'shop-tea','dinner-camera-confirm':'photo-yes','dinner-no-photo':'photo-no'};
  if(branchKeys[mall?.node])candidates.push([branchKeys[mall.node],sceneRoute]);
  let captured=epilogueCaptured.get(progress);if(!captured){captured=new Set();epilogueCaptured.set(progress,captured)}
  for(const [key,route]of candidates){
   if(captured.has(key))continue;
   const id='epilogue023-'+key,record=ChoiceNodeStorage.record(NODE_KEY,id,toast);
   if(checkpointIsCurrentRun(record,progress)&&record.branchPoint){captured.add(key);continue}
   // Capture the full game, never the temporary phone state used by context().
   const checkpoint=structuredClone(progress);checkpoint.story.dayFourSleep.phone.route=route;
   if(key==='dinner-invite'||key==='river-invite'){
    Object.assign(checkpoint.story.dayFourSleep.phone.epilogueMall,{index:0,phase:'rows'});
    delete checkpoint.story.cgSentenceCursor;delete checkpoint.story.dayFourSleep.phone.story.cgSentenceCursor;
   }
   if(key==='arrival'){
    const phone=checkpoint.story.dayFourSleep.phone;
    Object.assign(phone.taxi,{phase:'arrived',elapsed:22000,arrivalScene:'playing',arrivalIndex:0});
    delete phone.epilogueOutfit;delete phone.epilogueMeeting;delete phone.epilogueGreeting;delete phone.epilogueMall;delete checkpoint.story.cgSentenceCursor;delete phone.story.cgSentenceCursor;
   }
   if(captureStoryNode(id,checkpoint,{route:{view:'hospital-phone',active:null},branchPoint:true,worldline:true}))captured.add(key);
  }
 }
 function dischargeChat(){
  const q=data().epilogueDischarge;if(hospitalEndingId(root())!=='023'||!q)return;
  document.querySelector('#hospital-discharge-notice')?.remove();
  const composer=screen.querySelector('#composer');if(!composer)return;
  if(['zhou','choice-wait','choice','cg-wait','cg'].includes(q.phase))composer.querySelectorAll('button,textarea,input').forEach(el=>el.disabled=true);
  if(q.phase==='choice')composer.insertAdjacentHTML('beforebegin','<div class="zero-choices">'+dischargeChoices.map((text,i)=>'<button data-discharge-choice="'+i+'">'+esc(text)+'</button>').join('')+'</div>');
 }
 function dischargeRefresh(){context(()=>{statusPhone();if(view==='chat'&&active==='room408'){chat('room408');const list=screen.querySelector('.messages');if(list)list.scrollTop=list.scrollHeight}else if(view==='home')homePhone();else if(view==='message-moments')moments()})}
 function dischargeChoose(index){
  const p=data(),q=p.epilogueDischarge;if(hospitalEndingId(root())!=='023'||q?.phase!=='choice'||!Number.isInteger(index)||!dischargeChoices[index])return;
  q.choice=index;q.phase='cg-wait';q.remaining=3000;dischargeMessage(p,'epilogue-023-discharge-player','me',dischargeChoices[index]);dischargeRefresh();
 }
 function dischargeCG(){
  const q=data().epilogueDischarge;if(q?.phase!=='cg'||screen.querySelector('#hospital-discharge-cg'))return;
  const previous=captureSceneSnapshot(screen);view='hospital-discharge-cg';active=null;
  screen.innerHTML='<section id="hospital-discharge-cg" class="rd-cg"><img src="assets/day4-wait-desk.jpg?v=20261016-rc2" alt="宿舍书桌"></section>';
  CGDialogue.present(screen.firstElementChild,dischargeNarration,{index:q.index||0,typingInterval:mobileNativeInterval,onIndex:i=>{if(data().epilogueDischarge===q&&q.phase==='cg'){q.index=i;save()}},onComplete:()=>{if(data().epilogueDischarge===q&&q.phase==='cg')dischargeNext()}});
  cgScreenCrossfade(previous);save();
 }
 function dischargeNext(){
  const p=data(),q=p.epilogueDischarge;if(q?.phase!=='cg')return;
  const previous=captureSceneSnapshot(screen);q.phase='done';p.shoppingMallUnlocked=true;clearInterval(cgTypingTimer);context(homePhone);captureEpilogueNodes();zeroDissolve(previous,600);save();
 }
 function mallLogo(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l1 12H4L5 8Z"/><path d="M8 9V6a4 4 0 0 1 8 0v3"/><path d="m9 14 3 3 3-3"/></svg>'}
 const mallProducts=[
  {id:'knit',name:'秋冬复古风',image:'assets/epilogue-mall-retro.jpg?v=20261016-rc2',subtitle:'毛衣内搭+毛呢外套+打底裤+靴子',price:71900,tone:'rose',tag:'复古秋冬',number:'01'},
  {id:'skirt',name:'温柔千金风',image:'assets/epilogue-mall-elegant.jpg?v=20261016-rc2',subtitle:'毛呢外套+长裙+皮鞋+袜子',price:53900,tone:'sand',tag:'温柔气质',number:'02'}
 ];
 const mallPrice=cents=>(cents/100).toFixed(2);
 function mallData(){const p=data();return p.mall??={purchased:{},checkout:null}}
 function mallArt(item){return '<div class="hm-art hm-art-'+item.tone+'"><img src="'+esc(item.image)+'" alt="'+esc(item.name)+'" decoding="async"><span class="hm-art-number">'+item.number+'</span></div>'}
 function shoppingMall(){
  if(!data().shoppingMallUnlocked)return;
  const p=data(),m=mallData();view='hospital-shopping-mall';active=null;
  screen.innerHTML='<section class="hm-shop"><header class="hm-header"><button type="button" class="hm-back" data-action="home" aria-label="返回桌面">'+icon('back')+'</button><div><span>购物商城</span><small>THE EVERYDAY EDIT</small></div><span class="hm-header-mark">'+mallLogo()+'</span></header><div class="hm-wallet"><span>'+icon('wallet')+' 小金库可用余额</span><strong>¥ '+Number(p.game.wallet).toFixed(2)+'</strong></div><div class="hm-section-title"><h2>女装精选 <small> / 02</small></h2><span>为她挑选</span></div><div class="hm-products">'+mallProducts.map(item=>{const bought=!!m.purchased[item.id];return '<article class="hm-product"><button type="button" class="hm-preview" data-mall-product="'+item.id+'" aria-label="查看'+esc(item.name)+'">'+mallArt(item)+(bought?'<span class="hm-owned">已购买</span>':'')+'</button><div class="hm-product-copy"><h3>'+item.name+'</h3><p>'+item.subtitle+'</p><div class="hm-product-bottom"><strong><small>¥</small>'+mallPrice(item.price).replace('.00','')+'</strong><button type="button" class="hm-buy" data-mall-product="'+item.id+'" '+(bought?'disabled':'')+'>'+(bought?'已购':icon('plus'))+'<span class="hm-sr">'+(bought?'已购买':'选购'+item.name)+'</span></button></div></div></article>'}).join('')+'</div>'+(!m.purchased.knit&&!m.purchased.skirt?mallBundleCard():'')+'<footer class="hm-footer">送给重要的人</footer></section>';
 }
 function mallSheetStyle(){document.querySelector('#overlay .sheet')?.classList.add('hm-sheet')}
 function mallItems(id){return id==='both'?mallProducts:mallProducts.filter(item=>item.id===id)}
 function mallQuote(id){
  const items=mallItems(id),original=items.reduce((sum,item)=>sum+item.price,0),total=id==='both'?Math.round(original*80/100):original;
  return {items,original,total,discount:original-total};
 }
 function mallBundleCard(){
  const q=mallQuote('both');
  return '<button type="button" class="hm-both" data-mall-product="both"><span class="hm-bundle-top"><strong>两件打包</strong><span class="hm-discount">限时 <b>20%</b> OFF</span></span><span class="hm-bundle-bottom"><span class="hm-bundle-price"><small>打包价</small><strong>¥ '+mallPrice(q.total)+'</strong><del>¥ '+mallPrice(q.original)+'</del></span><span class="hm-bundle-save">立省 ¥ '+mallPrice(q.discount)+'<span aria-hidden="true"> ›</span></span></span></button>';
 }
 function mallSelection(m){m.clothingSelection=m.purchased.knit&&m.purchased.skirt?'both':m.purchased.knit?'1':m.purchased.skirt?'2':null}
 function mallSelect(id){
  const p=data(),m=mallData(),items=mallItems(id);if(!p.shoppingMallUnlocked||!items.length)return;
  const bought=items.some(item=>m.purchased[item.id]);if(bought)return toast('这件衣服已经买过啦');
  if(p.epilogueGift&&p.epilogueGift.phase!=='paid-wait')return toast('礼物已经送出啦');
  const {total,original,discount}=mallQuote(id),balance=Math.round(p.game.wallet*100),enough=balance>=total;m.checkout=id;
  sheet('确认购买',items.map(item=>'<div class="hm-check-product">'+mallArt(item)+'<div><h3>'+item.name+'</h3><p>'+item.subtitle+'</p><strong>¥ '+mallPrice(item.price)+'</strong></div></div>').join('')+'<div class="hm-payment"><div><span>购买数量</span><strong>'+items.length+' 件</strong></div>'+(discount?'<div><span>商品原价</span><del>¥ '+mallPrice(original)+'</del></div><div class="hm-payment-discount"><span>两件打包 · 限时 20% OFF</span><strong>− ¥ '+mallPrice(discount)+'</strong></div>':'')+'<div><span>付款方式</span><strong>小金库余额</strong></div><div><span>可用余额</span><strong>¥ '+mallPrice(balance)+'</strong></div><div class="hm-payment-total"><span>实付款</span><strong>¥ '+mallPrice(total)+'</strong></div></div>'+(enough?'':'<p class="hm-payment-error" role="status">余额不足，还差 ¥ '+mallPrice(total-balance)+'</p>')+'<button type="button" class="hm-pay" '+(enough?'data-mall-pay="'+id+'"':'disabled')+'>'+(enough?'确认付款 · ¥ '+mallPrice(total):'余额不足')+'</button>');mallSheetStyle();
 }
 function grantClothingAffection(p){
  const m=p.mall,count=Number(!!m?.purchased?.knit)+Number(!!m?.purchased?.skirt);if(!count)return false;
  const target=count===2?15:5,granted=Number(m.clothingAffectionGranted??(m.bothAffectionGranted?15:0));
  if(granted>=target)return false;
  const q=p.epilogueShopping??={phase:'waiting',remaining:0,node:'invite',index:0,affection:0,decisions:{}};
  q.affection=(Number(q.affection)||0)+target-granted;m.clothingAffectionGranted=target;m.bothAffectionGranted=count===2;return true;
 }
 function mallPay(id){
  const p=data(),m=mallData(),items=mallItems(id);if(!p.shoppingMallUnlocked||!items.length||m.checkout!==id||items.some(item=>m.purchased[item.id])||p.epilogueGift&&p.epilogueGift.phase!=='paid-wait')return;
  const {total}=mallQuote(id),balance=Math.round(p.game.wallet*100);if(!Number.isSafeInteger(balance)||balance<total)return mallSelect(id);
  p.game.wallet=(balance-total)/100;for(const item of items)m.purchased[item.id]={price:id==='both'?Math.round(item.price*80/100):item.price,listPrice:item.price,bundle:id==='both',date:p.system.date,time:p.system.time};m.checkout=null;mallSelection(m);grantClothingAffection(p);
  p.epilogueGift={phase:'paid-wait',remaining:11000,index:0};giftLast=0;
  shoppingMall();sheet('付款成功','<div class="hm-success"><span class="hm-success-icon">'+icon('check')+'</span><small>PAYMENT COMPLETE</small><h3>商品正在等待揽件……</h3><p>'+items.map(item=>item.name).join('、')+'</p><strong>¥ '+mallPrice(total)+'</strong><div>小金库剩余 <b>¥ '+p.game.wallet.toFixed(2)+'</b></div></div><button type="button" class="hm-pay" data-action="close">继续逛逛</button>');mallSheetStyle();
 }
 const giftReplies=['喜欢就好','快试试合不合身'];
 const giftLines=['谢谢你送我的礼物','你送我的礼物我已经收到了','很漂亮，我很喜欢','但是这些衣服都很贵吧'];
 const giftCostReplies=['不贵不贵，很便宜的，你放心穿好了','都是我妈妈买的，别有心理负担'];
 let giftOwner=null,giftLast=0;
 function giftMessage(p,id,text,mine=false){
  const rows=p.messages.linqing??=[];if(rows.some(row=>row.id===id))return;
  text=text.replaceAll('【玩家名字】',p.profile.name);
  rows.push({id,type:'text',sender:mine?'me':'linqing',name:mine?p.profile.name:'林晴',text,gameDate:'2045-09-20',time:'18:21',...(mine?{status:'read'}:{})});
  const contact=p.contacts.find(c=>c.id==='linqing');if(contact){contact.preview=text;contact.time='18:21';if(!mine&&!(view==='chat'&&active==='linqing'))contact.unread=(contact.unread||0)+1}
 }
 function giftNotice(p){
  if(view==='chat'&&active==='linqing'||document.querySelector('#hospital-gift-notice'))return;
  const el=document.createElement('div');el.id='hospital-gift-notice';el.className='opening-message';el.innerHTML='<button class="opening-body" data-gift-open><span>'+avatar('linqing')+'</span><span><small>讯息 · 18:21</small><strong>林晴</strong><span>'+'谢谢你'+'</span></span></button>';el.dataset.ringtonePlayed='true';document.querySelector('#phone').append(el);base.playNotificationSound('message',el);
 }
 function giftChoices(){
  const p=data(),q=p.epilogueGift;if(hospitalEndingId(root())!=='023'||!q)return;
  document.querySelector('#hospital-gift-notice')?.remove();const composer=screen.querySelector('#composer');if(!composer)return;
  if(q.phase==='thanks-read'){q.introViewed=true;q.phase='thanks';q.remaining=messageSendDelay();giftLast=0}
  if(['thanks','choice-wait','choice','cost-answer','answer','reply-wait'].includes(q.phase))composer.querySelectorAll('button,input,textarea').forEach(el=>el.disabled=true);
  if(q.phase==='choice')composer.insertAdjacentHTML('beforebegin','<div class="zero-choices">'+(q.replyStage==='final'?giftReplies:giftCostReplies).map((text,i)=>'<button data-gift-choice="'+i+'">'+text+'</button>').join('')+'</div>');
 }
 function giftChoose(index){
  const p=data(),q=p.epilogueGift;if(hospitalEndingId(root())!=='023'||q?.phase!=='choice'||!Number.isInteger(index))return;
  const final=q.replyStage==='final',replies=final?giftReplies:giftCostReplies;if(!replies[index])return;
  giftMessage(p,final?'epilogue-023-gift-reply':'epilogue-023-gift-cost-reply',replies[index],true);
  if(final){q.choice=index;q.phase='answer'}else{q.costChoice=index;q.answerIndex=0;q.phase='cost-answer'}
  q.remaining=messageSendDelay();giftLast=0;shoppingRefresh();
 }
 function travelMoments(p){
  const profile=p.contactProfiles?.linqing;if(!profile)return;
  const posts=[
   {id:'epilogue-023-travel-new-year',date:'2048年1月1日 10:51',text:'大家元旦快乐！\n想和大家分享一个好消息：我的债务问题很快就能彻底解决了\n我也已经和父亲断绝了一切联系，不会再让他从我这里骗走一分钱\n我会通过法律途径起诉并向他追偿\n前两天向学校要一份当初帮助过我的同学名单，但学校始终没有同意，说参与捐助的人实在太多了，但我也真的很想亲口对你们每一个人说声谢谢\n\n所以我决定，以后在保证自己基本生活的前提下，以东川大学学生的名义，将多余的钱都捐给其他需要帮助的人\n\n谢谢你们曾经给予我的善意\n今后，我也会努力把这份善意继续传递下去',replies:[{name:'周禾',text:'恭喜你'},{name:p.profile.name,text:'小晴太厉害了'},{name:'猫薄水',text:'元旦快乐'},{name:'总是任性',text:'啊啊啊恭喜恭喜，听到这个消息真是太好了'},{name:'早点水饺',text:'你好好的就是对大家最好的回报了'},{name:'鱼鱼鱼',text:'做得好小晴'}]},
   {id:'epilogue-023-travel-tomorrow',date:'2047年10月31日 20:59',text:'突然发现\n我现在好像不会再害怕睡觉和明天了\n反而是很期待每一个明天',replies:[]},
   {id:'epilogue-023-travel-work',date:'2045年9月27日 09:02',text:'新工作的第一天',image:'assets/epilogue-first-workday.jpg?v=20261016-rc2',imageAlt:'新工作第一天，办公桌上的咖啡与窗外阳光',replies:[{name:'周禾',text:'加油！下班请你吃饭'},{name:p.profile.name,text:'别累到自己了哦'},{name:'白米饭',text:'冲啊啊啊'}]}
  ];
  const existingWork=profile.moments.find(post=>post.id===posts[2].id);
  if(existingWork){existingWork.image=posts[2].image;existingWork.imageAlt=posts[2].imageAlt;}
  const existingNewYear=profile.moments.find(post=>post.id===posts[0].id);
  if(existingNewYear)existingNewYear.text=posts[0].text;
  const missing=posts.filter(post=>!profile.moments.some(existing=>existing.id===post.id));
  profile.moments.unshift(...missing);
  const zhou=p.contactProfiles.zhouhe;
  if(zhou){zhou.moments??=[];const id='epilogue-023-travel-zhou-new-year';if(!zhou.moments.some(post=>post.id===id))zhou.moments.unshift({id,date:'2046年2月5日 20:59',text:'新年快乐！',replies:[{name:p.profile.name,text:'新年快乐！'},{name:'林晴',text:'新年快乐'}]})}

 }
 function giftCalendar(q){
  const from=q.phase==='calendar20'?17:20,to=q.phase==='calendar20'?20:22;
  let layer=document.querySelector('#hospital-gift-calendar');
  if(!layer){layer=document.createElement('div');layer.id='hospital-gift-calendar';layer.setAttribute('role','dialog');layer.setAttribute('aria-modal','true');layer.setAttribute('aria-label','日历翻至9月'+to+'日');layer.innerHTML='<div class="epilogue-calendar-card"><div class="epilogue-calendar-rings"><i></i><i></i></div><p>九月 · SEPTEMBER</p><div class="epilogue-calendar-window"><div class="epilogue-calendar-days">'+Array.from({length:to-from+1},(_,i)=>'<div>9.'+(from+i)+'</div>').join('')+'</div></div><span class="epilogue-calendar-time">'+(to===20?'18:21':'16:27')+'</span></div>';document.querySelector('#phone').append(layer)}
  layer.querySelector('.epilogue-calendar-days').style.transform='translateY(-'+(q.day-from)*96+'px)';
 }
 function giftTick(){
  if(!owner&&isVisible()&&!webEpilogueReady()){giftLast=0;return}
  const current=root(),p=current?.story?.dayFourSleep?.phone;
  if(owner||!isVisible()||document.hidden||hospitalEndingId(current)!=='023'){giftLast=0;document.querySelector('#hospital-gift-calendar')?.remove();document.querySelector('#hospital-gift-notice')?.remove();return}
  if(!p)return;
  if(!p.epilogueGift&&(p.mall?.purchased.knit||p.mall?.purchased.skirt)){mallSelection(p.mall);p.epilogueGift={phase:'paid-wait',remaining:11000,index:0};save()}
  if(grantClothingAffection(p))save();
  const q=p.epilogueGift;if(!q||q.phase==='done'||q.phase==='choice'){giftLast=0;return}
  if(q.phase==='thanks'&&q.index===1&&!q.introViewed){q.phase='thanks-read';save()}
  if(q.phase==='thanks-read'){
   giftLast=0;
   if(view==='chat'&&active==='linqing'&&!document.querySelector('#overlay .sheet')){q.introViewed=true;q.phase='thanks';q.remaining=messageSendDelay();save()}
   else giftNotice(p);
   return;
  }
  if(giftOwner!==current){giftOwner=current;giftLast=0}
  const now=Date.now(),delta=giftLast?Math.min(500,now-giftLast):0;giftLast=now;q.remaining=Math.max(0,q.remaining-delta);
  if(q.phase==='calendar20'||q.phase==='calendar22'){
   const to=q.phase==='calendar20'?20:22;giftCalendar(q);if(q.remaining>0)return;
   if(q.day<to){q.day++;q.remaining=q.day===to?900:180;giftCalendar(q);save();return}
   p.system.date='2045-09-'+to;p.system.time=to===20?'18:21':'16:27';p.game.period='下午';p.calendarMonth='2045-09';p.calendarSelected=p.system.date;
   document.querySelector('#hospital-gift-calendar')?.remove();q.phase=to===20?'thanks':'done';q.index=0;q.remaining=messageSendDelay();context(homePhone);save();return;
  }
  if(q.remaining>0)return;
  if(q.phase==='choice-wait'){q.phase='choice';save();shoppingRefresh();return}
  if(q.phase==='paid-wait'||q.phase==='reply-wait'){
   q.day=q.phase==='paid-wait'?17:20;q.phase=q.phase==='paid-wait'?'calendar20':'calendar22';q.remaining=700;context(closeSheet);giftCalendar(q);save();return;
  }
  if(q.phase==='thanks'){
   giftMessage(p,'epilogue-023-gift-thanks-'+q.index,giftLines[q.index]);q.index++;q.remaining=messageSendDelay();if(q.index===giftLines.length)q.phase='choice-wait';
   if(q.index===1&&!q.introViewed)q.phase='thanks-read';
   shoppingRefresh();giftNotice(p);
  }else if(q.phase==='cost-answer'){
   const lines=['嗯嗯',q.costChoice===1?'那也替我谢谢阿姨吧':'谢谢你'];
   const index=q.answerIndex||0;giftMessage(p,'epilogue-023-gift-cost-answer-'+index,lines[index]);q.answerIndex=index+1;q.remaining=messageSendDelay();
   if(q.answerIndex===lines.length){q.replyStage='final';q.phase='choice-wait'}
   shoppingRefresh();
  }else if(q.phase==='answer'){giftMessage(p,'epilogue-023-gift-answer','好');q.phase='reply-wait';q.remaining=3000;shoppingRefresh()}
  save();
 }
 mobileNativeInterval(giftTick,250);
 document.addEventListener('visibilitychange',()=>{giftLast=0});

 function dischargeTick(){
  if(!owner&&isVisible()&&!webEpilogueReady()){dischargeLast=0;return}
  const current=root(),p=current?.story?.dayFourSleep?.phone,q=p?.epilogueDischarge;
  if(owner||!isVisible()||document.hidden||hospitalEndingId(current)!=='023'||!q){dischargeLast=0;document.querySelector('#hospital-discharge-cg')?.remove();document.querySelector('#hospital-discharge-notice')?.remove();return}
  if(dischargeOwner!==current){dischargeOwner=current;dischargeLast=0}
  if(q.phase==='cg'){dischargeLast=0;dischargeCG();return}
  if(['choice','done'].includes(q.phase)){captureEpilogueNodes();dischargeLast=0;return}
  const now=Date.now(),delta=dischargeLast?Math.min(500,now-dischargeLast):0;dischargeLast=now;q.remaining=Math.max(0,q.remaining-delta);if(q.remaining>0)return;
  if(q.phase==='waiting'){
   p.system.time='11:08';dischargeMessage(p,'epilogue-023-discharge-lin','linqing','我今天出院了，谢谢你们');dischargeMoment(p);q.phase='zhou';q.remaining=messageSendDelay();ensureEpilogueMotherChat(p);
   if(!(view==='chat'&&active==='room408')){const el=document.createElement('div');el.id='hospital-discharge-notice';el.className='opening-message';el.innerHTML='<button class="opening-body" data-discharge-open><span>'+avatar(p.contacts.find(c=>c.id==='room408')?.avatar||'room408')+'</span><span><small>讯息 · 11:08</small><strong>'+esc(p.contacts.find(c=>c.id==='room408')?.name||'宿舍群')+'</strong><span>林晴：我今天出院了，谢谢你们</span></span></button>';document.querySelector('#phone').append(el);el.dataset.ringtonePlayed='true';base.playNotificationSound('message',el)}
  }else if(q.phase==='zhou'){dischargeMessage(p,'epilogue-023-discharge-zhou','zhouhe','有什么谢的，你好好的就好');q.phase='choice-wait';q.remaining=messageSendDelay()}
  else if(q.phase==='choice-wait'){q.phase='choice'}
  else if(q.phase==='cg-wait'){q.phase='cg';q.index=0;closeSheet();dischargeCG();save();return}
  captureEpilogueNodes();save();dischargeRefresh();
 }
 mobileNativeInterval(dischargeTick,250);
 document.addEventListener('visibilitychange',()=>{dischargeLast=0});
 const shoppingScript={
  invite:{rows:['【玩家名字】，今天要不要去逛街？'],choices:[['你身体没事吗？现在流感很多诶','health',0],['是只邀请我一个人，还是也邀请别人了？','only',10],['你说想要我陪你去，我就去','say',10]]},
  health:{rows:['没事的，我没那么虚弱啦','毕竟都这么久了'],choices:[['好吧，那我在哪找你？','meet',0]]},
  only:{rows:['哈哈哈哈哈','你是在学黛玉吗？','我和宝玉不一样，今天只邀请了你一个人'],choices:[['只是今天邀请我一个人嘛……','always',10],['哈哈逗你玩的啦，算你过关了！','joke',0]]},
  always:{rows:['你想我以后都只邀请你一个人吗？'],choices:[['我想','promise',15],['不可以吗？','promise',10],['我开玩笑啦','laugh',0]]},
  promise:{rows:['我也想答应你','但丢下周禾一个人不好','我会尽量找时间单独约你，好吗？'],choices:[['嗯嗯','meet',0],['好呀','meet',0]]},
  laugh:{rows:['哈哈哈哈'],next:'meet'},
  joke:{rows:['你呀','还是和在那里一样'],next:'meet'},
  say:{rows:['一定要说嘛……'],choices:[['你不想说的话，不说也行','shy',0],['看来你也没有那么想陪我去嘛','want',10]]},
  shy:{rows:['就是觉得怪怪的','但不是不想你陪我'],choices:[['哈哈我知道，我去哪找你呢？','meet',0]]},
  want:{rows:['我想的','我想你陪我去逛街','……说出来好奇怪'],choices:[['哈哈哈哈，我去哪找你？','tease',0]]},
  tease:{rows:['就知道你又在逗我'],next:'meet'},
  meet:{rows:['我五点在东川中心的北区一楼门口等你'],choices:[['好哦，我打车过去','taxi-ready',0]]},
  'taxi-ready':{rows:['嗯嗯，注意安全','上车把行程分享给我']}
 };
 let shoppingOwner=null,shoppingLast=0;
 function shoppingMessage(p,id,text,mine=false){
  const rows=p.messages.linqing??=[];if(rows.some(row=>row.id===id))return;
  text=text.replaceAll('【玩家名字】',p.profile.name);
  rows.push({id,type:'text',sender:mine?'me':'linqing',name:mine?p.profile.name:'林晴',text,gameDate:p.system.date,time:'16:28',...(mine?{status:'read'}:{})});
  const contact=p.contacts.find(c=>c.id==='linqing');if(contact){contact.preview=text;contact.time='16:28';if(!mine&&!(view==='chat'&&active==='linqing'))contact.unread=(contact.unread||0)+1}
 }
 function shoppingRefresh(){
  context(()=>{statusPhone();if(view==='chat'&&active==='linqing'){chat('linqing');const list=screen.querySelector('.messages');if(list)list.scrollTop=list.scrollHeight}else if(view==='home')homePhone();else if(view==='messages')chatListPhone()});
 }
 function shoppingChoices(){
  const p=data(),q=p.epilogueShopping;if(hospitalEndingId(root())!=='023'||!q)return;
  document.querySelector('#hospital-shopping-notice')?.remove();
  const composer=screen.querySelector('#composer');if(!composer)return;
  if(q.phase!=='waiting'&&q.phase!=='done')composer.querySelectorAll('button,textarea,input').forEach(el=>el.disabled=true);
  if(q.phase==='choice')composer.insertAdjacentHTML('beforebegin','<div class="zero-choices">'+shoppingScript[q.node].choices.map(([text],i)=>'<button data-shopping-node="'+q.node+'" data-shopping-choice="'+i+'">'+esc(text)+'</button>').join('')+'</div>');
 }
 function shoppingChoose(node,index){
  const p=data(),q=p.epilogueShopping;if(hospitalEndingId(root())!=='023'||q?.phase!=='choice'||q.node!==node)return;
  const option=shoppingScript[node]?.choices?.[index];if(!option||q.decisions[node]!==undefined)return;
  q.decisions[node]=index;q.affection+=option[2];shoppingMessage(p,'epilogue-023-shopping-reply-'+node,option[0],true);
  q.node=option[1];q.index=0;q.phase='rows';q.remaining=messageSendDelay();shoppingRefresh();
 }
 function shoppingTick(){
  if(!owner&&isVisible()&&!webEpilogueReady()){shoppingLast=0;return}
  const current=root(),p=current?.story?.dayFourSleep?.phone;
  if(owner||!isVisible()||document.hidden||hospitalEndingId(current)!=='023'||p?.epilogueCalendar?.phase!=='done'||p.system.date!=='2045-09-22'){shoppingLast=0;document.querySelector('#hospital-shopping-notice')?.remove();return}
  if(shoppingOwner!==current){shoppingOwner=current;shoppingLast=0}
  const q=p.epilogueShopping??={phase:'waiting',remaining:0,node:'invite',index:0,affection:0,decisions:{}};
  if(q.phase==='done'&&q.node==='meet'&&q.decisions.meet===undefined){q.phase='choice-wait';q.remaining=messageSendDelay();save()}
  if(q.phase==='waiting')q.remaining=0;
  if(q.phase==='done'||q.phase==='choice'){if(q.phase==='choice'&&q.node==='invite')shoppingNotice(p);captureEpilogueNodes();shoppingLast=0;return}
  const now=Date.now(),delta=shoppingLast?Math.min(500,now-shoppingLast):0;shoppingLast=now;
  q.remaining=Math.max(0,q.remaining-delta);if(q.remaining>0)return;
  if(q.phase==='choice-wait'){q.phase='choice';captureEpilogueNodes();save();shoppingRefresh();return}
  if(q.phase==='waiting'){q.phase='rows';p.system.time='16:28'}
  const def=shoppingScript[q.node];if(!def)return;
  shoppingMessage(p,'epilogue-023-shopping-'+q.node+'-'+q.index,def.rows[q.index]);q.index++;
  if(q.index===def.rows.length){if(def.choices)q.phase='choice-wait';else if(def.next){q.node=def.next;q.index=0}else q.phase='done'}
  q.remaining=messageSendDelay();captureEpilogueNodes();save();shoppingRefresh();
  shoppingNotice(p);
 }
 function shoppingNotice(p){
  const rows=p.messages.linqing||[],invite=p.epilogueShopping?.node==='invite';
  const message=invite?rows.find(m=>m.id==='epilogue-023-shopping-invite-0'):[...rows].reverse().find(m=>m.sender==='linqing'&&m.id?.startsWith('epilogue-023-shopping-'));
  const preview=message?.text||(invite?shoppingScript.invite.rows[0].replaceAll('【玩家名字】',p.profile.name):'');
  if(!preview)return;
  if(!(view==='chat'&&active==='linqing')&&!document.querySelector('#hospital-shopping-notice')){
   const el=document.createElement('div');el.id='hospital-shopping-notice';el.className='opening-message';
   el.innerHTML='<button class="opening-body" data-hospital-shopping-open><span>'+avatar('linqing')+'</span><span><small>讯息 · '+esc(message?.time||'16:28')+'</small><strong>林晴</strong><span>'+esc(preview)+'</span></span></button>';document.querySelector('#phone').append(el);el.dataset.ringtonePlayed='true';base.playNotificationSound('message',el);
  }
 }
 mobileNativeInterval(shoppingTick,250);
 document.addEventListener('visibilitychange',()=>{shoppingLast=0});

 const taxiCars=[{id:'express',name:'舒适型',detail:'宽敞安静 · 4座',fare:32},{id:'comfort',name:'无人驾驶',detail:'智能出行 · 4座',fare:45},{id:'business',name:'商务型',detail:'舒适空间 · 6座',fare:68}];
 const taxiArrivalScenes={
  express:{image:'assets/epilogue-taxi-comfort.jpg?v=20261016-rc2',avatar:'taxi_comfort_driver',portrait:'assets/chat-avatars/taxi-comfort-driver-v2.jpg?v=20261016-rc2',name:'司机',text:'您好，您的目的地到了，请从右侧下车'},
  comfort:{image:'assets/epilogue-taxi-autonomous.jpg?v=20261016-rc2',avatar:'taxi_autonomous_voice',portrait:'assets/chat-avatars/taxi-autonomous-voice.jpg?v=20261016-rc2',name:'智能语音',text:'您好，您的目的地：东川中心北区A口已经到了，请从右侧下车'},
  business:{image:'assets/epilogue-taxi-business.jpg?v=20261016-rc2',avatar:'taxi_business_driver',portrait:'assets/chat-avatars/taxi-business-driver-v2.jpg?v=20261016-rc2',name:'司机',text:'您好，您的目的地到了，请从右侧下车'}
 };
 for(const scene of Object.values(taxiArrivalScenes))if(!C.avatars.some(a=>a.id===scene.avatar))C.avatars.push({id:scene.avatar,name:scene.name,src:scene.portrait});
 let taxiArrivalOwner=null;
 const taxiArrivalNarration=[
  '今天是周五，所以东川中心人还挺多的。',
  '其实醒来后没过几天，你的身体就恢复得差不多了。只能说得益于平时吃得好、睡得也好，而且你打小身体就不错，出院后很快便回学校上课了。',
  '所以一直到今天，你才有机会好好地出来逛逛。'
 ];
 function taxiArrivalCG(){
  const p=data(),q=p.taxi;if(q?.phase!=='arrived'||q.arrivalScene==='done')return taxiApp();
  if(screen.querySelector('#hospital-taxi-arrival-cg')&&taxiArrivalOwner===q)return;
  taxiArrivalOwner=q;
  const previous=captureSceneSnapshot(screen),scene=taxiArrivalScenes[q.car]||taxiArrivalScenes.express;
  closeSheet();q.arrivalScene='playing';view='hospital-taxi-arrival-cg';active=null;
  document.querySelector('#hospital-taxi-live')?.remove();document.querySelector('#hospital-taxi-notice')?.remove();
  screen.innerHTML='<section id="hospital-taxi-arrival-cg" class="rd-cg"><img src="'+scene.image+'" alt="抵达东川中心"></section>';
  CGDialogue.present(screen.firstElementChild,[{speaker:scene.avatar,avatar:scene.avatar,name:scene.name,text:scene.text},...taxiArrivalNarration],{index:q.arrivalIndex||0,typingInterval:mobileNativeInterval,onIndex:i=>{if(data().taxi===q&&q.arrivalScene==='playing'){q.arrivalIndex=i;save()}},onComplete:()=>{
   if(data().taxi!==q||q.arrivalScene!=='playing')return;
   q.arrivalScene='done';context(epilogueMeetingCG);save();
  }});
  cgScreenCrossfade(previous);save();
 }
 const epilogueOutfitScenes={
  '1':{meeting:'assets/epilogue-meeting-outfit-1.jpg?v=20261016-rc2',greeting:'assets/epilogue-greeting-outfit-1.jpg?v=20261016-rc2'},
  '2':{meeting:'assets/epilogue-meeting-outfit-2.jpg?v=20261016-rc2',greeting:'assets/epilogue-greeting-outfit-2.jpg?v=20261016-rc2'}
 };
 // Select once per saved story; later scenes share this same outfit route.
 function epilogueOutfit(p){
  if(epilogueOutfitScenes[p.epilogueOutfit])return p.epilogueOutfit;
  const purchased=p.mall?.purchased,one=!!purchased?.knit,two=!!purchased?.skirt;
  if(!one&&!two)return null;
  p.epilogueOutfit=one&&two?(Math.random()<.5?'1':'2'):one?'1':'2';
  return p.epilogueOutfit;
 }
 const epilogueMeetingNarration=[
  '下车后，你朝东川中心北区的门口走去。',
  '穿过熙攘的人群时，你忽然看见了一道熟悉的身影。',
  '那好像是林晴，而且她还穿着你给她买的新衣服。'
 ];
 let epilogueMeetingOwner=null;
 function epilogueMeetingCG(){
  const p=data(),outfit=epilogueOutfit(p);if(p.taxi?.arrivalScene!=='done'||!outfit)return taxiApp();
  const q=p.epilogueMeeting??={phase:'playing',index:0};if(q.phase==='done')return taxiApp();
  if(screen.querySelector('#hospital-epilogue-meeting-cg')&&epilogueMeetingOwner===q)return;
  epilogueMeetingOwner=q;
  const previous=captureSceneSnapshot(screen);closeSheet();view='hospital-epilogue-meeting-cg';active=null;
  screen.innerHTML='<section id="hospital-epilogue-meeting-cg" class="rd-cg"><img src="'+epilogueOutfitScenes[outfit].meeting+'" alt="东川中心门口的林晴"></section>';
  CGDialogue.present(screen.firstElementChild,epilogueMeetingNarration,{index:q.index||0,typingInterval:mobileNativeInterval,onIndex:i=>{if(data().epilogueMeeting===q&&q.phase==='playing'){q.index=i;save()}},onComplete:()=>{
   if(data().epilogueMeeting!==q||q.phase!=='playing')return;
   q.phase='done';context(epilogueGreetingCG);save();
  }});
  cgScreenCrossfade(previous);save();
 }
 const epilogueGreetingOptions={call:['林晴！'],intro:['你今天好漂亮呀','不愧是我挑的衣服，你穿起来真好看'],thanks:['哎呀，我哪天不漂亮','没你好看']};
 function epilogueGreetingRows(q){
  const lin=text=>({speaker:'linqing',name:'林晴',text}),me=text=>({speaker:'me',text});
  if(q.node==='intro')return [me('林晴！'),lin('你来啦'),'林晴看起来有些局促，就像很久没有这样打扮出门了，有些不太自信。'];
  if(q.node==='thanks')return [me(epilogueGreetingOptions.intro[q.decisions.intro]),lin('谢谢你'),lin('你今天也很漂亮')];
  if(q.node==='end')return [me(epilogueGreetingOptions.thanks[q.decisions.thanks]),'林晴又用手背捂着嘴笑了起来。',lin('好了，我们快进去吧')];
  return [];
 }
 let epilogueGreetingOwner=null;
 function epilogueGreetingCG(){
  const p=data(),outfit=epilogueOutfit(p);if(!outfit||p.epilogueMeeting?.phase!=='done')return;
  const q=p.epilogueGreeting??={node:'call',phase:'choice-wait',remaining:messageSendDelay(),index:0,decisions:{}};
  if(q.phase==='done')return;
  const key=q.node+':'+q.phase,existing=screen.querySelector('#hospital-epilogue-greeting-cg');
  if(existing&&epilogueGreetingOwner===q&&existing.dataset.stage===key)return;
  const image=epilogueOutfitScenes[outfit][q.node==='call'?'meeting':'greeting'];
  const changeImage=existing?existing.querySelector('img')?.getAttribute('src')!==image:q.node!=='call';
  const previous=changeImage?captureSceneSnapshot(screen):null;
  const keepDialogue=existing&&epilogueGreetingOwner===q&&[q.node+':rows',q.node+':choice-wait'].includes(existing.dataset.stage)&&['choice-wait','choice'].includes(q.phase)&&!!existing.querySelector('.vn-dialogue');
  epilogueGreetingOwner=q;closeSheet();view='hospital-epilogue-greeting-cg';active=null;
  if(!existing)screen.innerHTML='<section id="hospital-epilogue-greeting-cg" class="rd-cg"><img src="'+image+'" alt="门口的林晴"></section>';
  const scene=screen.firstElementChild;scene.dataset.stage=key;
  if(changeImage)scene.querySelector('img').src=image;
  let host=scene.querySelector('[data-greeting-dialogue]');
  if(!keepDialogue){
   host?.remove();host=document.createElement('div');host.dataset.greetingDialogue='';
   host.style.cssText='position:absolute;inset:0';scene.append(host);
  }
  const rows=epilogueGreetingRows(q);
  if(q.phase==='choice-wait'||q.phase==='choice'){
   const last=rows.at(-1)||epilogueMeetingNarration.at(-1);
   if(!keepDialogue)host.insertAdjacentHTML('beforeend','<div class="vn-dialogue">'+cgDialogueMarkup(typeof last==='string'?{text:last}:last,{lastPage:true,hint:''})+'</div>');
   if(q.phase==='choice'){
    const options=document.createElement('div');options.className='cg-options';
    epilogueGreetingOptions[q.node].forEach((text,i)=>{const button=document.createElement('button');button.type='button';button.textContent=text;button.dataset.epilogueGreetingChoice=i;button.onclick=e=>{
     e.preventDefault();e.stopPropagation();if(data().epilogueGreeting!==q||q.phase!=='choice'||q.decisions[q.node]!==undefined)return;
     playInteractionSound('button');q.decisions[q.node]=i;
     if(q.node==='intro'&&i===0){const affection=p.epilogueShopping??={phase:'done',node:'taxi-ready',affection:0,decisions:{}};affection.affection=(Number(affection.affection)||0)+5}
     q.node=q.node==='call'?'intro':q.node==='intro'?'thanks':'end';q.phase='rows';q.index=0;context(epilogueGreetingCG);save();
    };options.append(button)});host.append(options);
   }
  }else CGDialogue.present(host,rows,{index:q.index||0,firstReplyConfirmed:true,retainOnComplete:true,typingInterval:mobileNativeInterval,onIndex:i=>{if(data().epilogueGreeting===q){q.index=i;save()}},onComplete:()=>{
   if(data().epilogueGreeting!==q||q.phase!=='rows')return;
   if(q.node==='end'){q.phase='done';context(epilogueMallCG);save();return}
   q.phase='choice-wait';q.remaining=messageSendDelay();context(epilogueGreetingCG);save();
  }});
  if(changeImage)cgScreenCrossfade(previous);save();
 }
 // Reserved CG slots; clothing changes the artwork only, never this shared script.
 const epilogueMallImages={p1:{'1':'assets/epilogue-mall-hall.jpg?v=20261016-rc2','2':'assets/epilogue-mall-hall.jpg?v=20261016-rc2'},p2:{'1':'assets/epilogue-jewelry-shop.jpg?v=20261016-rc2','2':'assets/epilogue-jewelry-shop.jpg?v=20261016-rc2'},hairclips:{'1':'assets/epilogue-hairclips.jpg?v=20261016-rc2','2':'assets/epilogue-hairclips.jpg?v=20261016-rc2'},p3:{'1':'assets/epilogue-island-shop.jpg?v=20261016-rc2','2':'assets/epilogue-island-shop.jpg?v=20261016-rc2'},p4:{'1':'assets/epilogue-tea-shop.jpg?v=20261016-rc2','2':'assets/epilogue-tea-shop.jpg?v=20261016-rc2'},birds:{'1':'assets/epilogue-bird-charms.jpg?v=20261016-rc2','2':'assets/epilogue-bird-charms.jpg?v=20261016-rc2'},escalator:{'1':'assets/epilogue-escalator.jpg?v=20261016-rc2','2':'assets/epilogue-escalator.jpg?v=20261016-rc2'},restaurant:{'1':'assets/epilogue-restaurant.jpg?v=20261016-rc2','2':'assets/epilogue-restaurant.jpg?v=20261016-rc2'},dinner:{'1':'assets/epilogue-dinner.jpg?v=20261016-rc2','2':'assets/epilogue-dinner.jpg?v=20261016-rc2'},dinnerLin:{'1':'assets/epilogue-dinner-linqing-outfit1.jpg?v=20261016-rc2','2':'assets/epilogue-dinner-linqing-outfit2-v2.jpg?v=20261016-rc2'},checkout:{'1':'assets/epilogue-dinner-paid.jpg?v=20261016-rc2','2':'assets/epilogue-dinner-paid.jpg?v=20261016-rc2'},parkArrival:{'1':'assets/epilogue-park-arrival.jpg?v=20261016-rc2','2':'assets/epilogue-park-arrival.jpg?v=20261016-rc2'},riverBreeze:{'1':'assets/epilogue-river-breeze-outfit1.jpg?v=20261016-rc2','2':'assets/epilogue-river-breeze-outfit2.jpg?v=20261016-rc2'},riverSteps:{'1':'assets/epilogue-river-steps.jpg?v=20261016-rc2','2':'assets/epilogue-river-steps.jpg?v=20261016-rc2'},hairTouch:{'1':'assets/epilogue-hair-touch-outfit1.jpg?v=20261016-rc2','2':'assets/epilogue-hair-touch-outfit2.jpg?v=20261016-rc2'},subwayGoodbye:{'1':'assets/epilogue-subway-goodbye.jpg?v=20261016-rc2','2':'assets/epilogue-subway-goodbye.jpg?v=20261016-rc2'},fingerTouch:{'1':'assets/epilogue-finger-touch-outfit1.jpg?v=20261016-rc2','2':'assets/epilogue-finger-touch-outfit2.jpg?v=20261016-rc2'},holdingHands:{'1':'assets/epilogue-holding-hands-outfit1.jpg?v=20261016-rc2','2':'assets/epilogue-holding-hands-outfit2.jpg?v=20261016-rc2'},riverside:{'1':'','2':''},future:{'1':'assets/day2-midday-desk.jpg?v=20261016-rc2','2':'assets/day2-midday-desk.jpg?v=20261016-rc2'}};
 if(!C.avatars.some(a=>a.id==='mall-clerk'))C.avatars.push({id:'mall-clerk',name:'店员',src:'assets/chat-avatars/epilogue-tea-clerk.jpg?v=20261016-rc2'});
 if(!C.avatars.some(a=>a.id==='restaurant-reception'))C.avatars.push({id:'restaurant-reception',name:'前台服务员',src:'assets/chat-avatars/epilogue-restaurant-reception.jpg?v=20261016-rc2'});
 const mallLin=text=>({speaker:'linqing',name:'林晴',text}),mallMe=text=>({speaker:'me',text});
 const mallDrinks=[{name:'杨枝甘露',price:22},{name:'手打柠檬茶',price:18},{name:'四季奶青',price:16}];
 const mallSceneScript={
  intro:{cg:'p1',rows:[
   '东川中心是这块儿最大的商场，也是你最喜欢来的地方。',
   '谁不喜欢在这样的大商场里消费一下呢？这种热闹又繁华的感觉，就是很让人上瘾。',
   '你记得林晴家离这里挺远的，不知道为什么她竟然到的比你早。',
   '东川中心北区有这么多家店，你最想先去哪一家呢？'
  ],choices:[['银栖饰集','jewelry'],['小岛杂货','island'],['一川茶饮','tea',5]]},
  jewelry:{cg:'p2',rows:[
   mallMe('我们去逛逛银栖饰集，怎么样？'),mallLin('好，听你的'),
   '你带着林晴去了那家你经常逛的饰品店。',
   '林晴今天穿的这么好看，当然要再给她挑几件合适的配饰。',
   '谁让你大难不死必有后福，你原本就很充裕的生活费，如今直接翻倍涨到了5200，甚至不够还能再要。','这太爽了！',
   '你们走进店里，琳琅满目的饰品看得你有些眼花缭乱。',
   '耳饰、项链、发卡、手链……每一件都很好看，真想全部买下来。','先给林晴试试看耳饰吧。',
   mallMe('来试试这个'),'你拿起一对珍珠耳钉，放在林晴的耳边比对了一下。'
  ],choices:[['就买这个了！这太适合你了','hesitate',0,'earrings'],['还不错，我再给你看看这个发卡','hairclip']]},
  hairclip:{cg:'p2',rows:['你放下耳钉，转身拿起了后面发饰区的发卡给林晴戴上试了试。'],choices:[['就买这个了！这太适合你了','hesitate',0,'hairclip'],['都好好看啊，都买了吧','hesitate',0,'both']]},
  hesitate:{cg:'p2',rows:[mallLin('你已经给我送过礼物了，我不能总是这样仗着你对我好，就无限的索取你……')],choices:[['和她解释','explain',5],['装委屈','plead',15]]},
  explain:{cg:'p2',rows:q=>[
   mallMe('林晴，这不是索取我'),mallMe('这是我主动奉献，我想对你好'),mallMe('如果你愿意接受我的好，我会很开心的'),mallMe('反倒是被拒绝才会不高兴呢'),mallLin('我知道了'),
   mallLin(q.item==='both'?'谢谢你送我这些，我会一直戴着它们的':'谢谢你，我会一直戴着它的')
  ],next:'jewelry-paid'},
  plead:{cg:'p2',rows:q=>[
   mallMe('你其实就是不想要我给你买的东西对吧'),mallMe('呜呜我被嫌弃了'),mallLin('诶，我不是这个意思'),mallMe('那你就不准拒绝我，不然你就是嫌弃我了'),mallLin('好好，我不拒绝你'),
   mallLin(q.item==='both'?'谢谢你送我这些，我会一直戴着它们的':'谢谢你送我这个，我会一直戴着它的')
  ],next:'jewelry-paid'},
  'jewelry-paid':{cg:'p2',payment:q=>({amount:{earrings:68,hairclip:39,both:107}[q.item],item:q.item}),rows:q=>['已支付'+q.receipts['jewelry-paid'].amount.toFixed(2)+'元，小金库还剩余额'+q.receipts['jewelry-paid'].balance.toFixed(2)+'元。']},
  island:{cg:'p3',rows:[
   '你带着林晴去了那家你经常逛的杂物店。','你们在里面瞎晃悠着，这里卖的东西实在是太多了，店如其名，确实很“杂”。',
   '忽然，你看到了一个很特别的包挂。','准确来说不是一个，是一对。','两只毛茸茸的小鸟依偎在一起，似乎是用磁铁吸在一起的。'
  ],choices:[['我们买一对这个包挂吧','charm',5]]},
  charm:{cg:'p3',rows:[mallMe('我们买一对这个包挂吧'),mallLin('好啊，我来付钱吧')],choices:[['假装难过','charm-me'],['答应她','charm-lin',10]]},
  'charm-me':{cg:'p3',rows:[mallMe('如果你不让我付钱，我就会难过一整天的'),mallMe('不是我付钱，我就浑身难受'),mallLin('好吧，可是……'),mallMe('没什么可是啦'),mallLin('谢谢你，我会一直把它挂在包上的'),mallLin('包可以丢，它都不能丢了')],next:'charm-paid'},
  'charm-lin':{cg:'p3',rows:[mallMe('林晴你怎么那么好呀'),mallLin('你都送我礼物了，我总不能什么都不送你'),mallMe('那我会好好珍惜这个礼物的！'),mallLin('嗯，我也会把它一直挂在包上的')]},
  'charm-paid':{cg:'p3',payment:()=>({amount:58,item:'bird-charms'}),rows:q=>['已支付58.00元，小金库还剩余额'+q.receipts['charm-paid'].balance.toFixed(2)+'元。']},
  tea:{cg:'p4',rows:['你带着林晴去了那家你经常去的茶饮店。'],choices:[['你想喝什么？','tea-menu']]},
  'tea-menu':{cg:'p4',rows:[mallMe('你想喝什么？'),mallLin('你喝什么我就喝什么'),mallLin('我都可以的'),'林晴说自己什么都可以，那你想喝什么呢？'],choices:mallDrinks.map((d,i)=>[d.name+' '+d.price+'元','tea-paid',0,i])},
  'tea-paid':{cg:'p4',payment:q=>({amount:mallDrinks[q.drink].price*2,item:mallDrinks[q.drink].name,quantity:2}),rows:q=>['已下单'+mallDrinks[q.drink].name+'两杯，小金库扣款'+q.receipts['tea-paid'].amount.toFixed(2)+'元，还剩余额'+q.receipts['tea-paid'].balance.toFixed(2)+'元。'],next:'tea-wait'},
  'tea-wait':{cg:'p4',rows:[]},
  'tea-ready':{cg:'p4',rows:[{speaker:'mall-clerk',name:'店员',text:'1026，要打开还是打包呢？'}],choices:[['打开吧','tea-drink']]},
  'tea-drink':{cg:'p4',rows:(q,p)=>[mallMe('打开吧'),'你拿起店员插好吸管的那杯，递给了林晴。','林晴接过来，立马就用吸管喝了一小口。',mallLin('不愧是'+p.profile.name+'选的，好好喝'),mallLin('你是喜欢喝这个，所以点了它吗？')],choices:[['是的','tea-end'],['不完全是，就是觉得你应该也会喜欢','tea-end',5]]},
  'tea-end':{cg:'p4',rows:q=>[mallMe(q.decisions['tea-drink']===0?'是的':'不完全是，就是觉得你应该也会喜欢'),mallLin('哦哦'),mallLin('我知道了'),'你看见林晴转了转茶杯，似乎在找标签。','她应该是想记住它的名字，也想记住你喜欢的口味。']}
 };
 for(const node of ['jewelry-paid','charm-paid','charm-lin','tea-end'])mallSceneScript[node].next='dinner-invite';
 Object.assign(mallSceneScript,{
  'dinner-invite':{cg:'restaurant',rows:[
   mallLin('你应该饿了吧？'),mallLin('我带你去吃一家好吃的'),
   '还没等你问要去哪，她就边走边招手，示意你跟上她。',
   '上到四楼后你们没走几步，林晴就停下来指了指面前的这家店。',mallLin('就是这家'),
   '整家店的灯光环境是很昏暗的感觉，营造了出一种朦胧而静谧的氛围。',mallLin('我们有预定'),
   {speaker:'restaurant-reception',name:'前台服务员',text:'请问您贵姓？'},mallLin('林'),
   {speaker:'restaurant-reception',name:'前台服务员',text:'好的林小姐，这边请。'},
   '你有些懵懵的，林晴怎么都已经预定好了。她什么时候预定的啊？',mallLin('快坐吧')
  ],next:'dinner-seat'},
  'dinner-seat':{cg:'dinner',rows:[
   '你坐下来之后看到桌子上的吃的更懵了，怎么菜都已经上好了啊！',
   '你忍不住咽了咽口水，因为它们实在是太香了，好想全部吃掉。','对比之下平常在学校里吃的简直都是猪食。',mallLin('你要拍照吗？')
  ],choices:[['不仅要拍，我还要发朋友圈','dinner-camera-confirm',5],['不拍了，我快被馋死了','dinner-no-photo']]},
  'dinner-camera-confirm':{cg:'dinner',rows:[mallMe('不仅要拍，我还要发朋友圈')],next:'dinner-camera'},
  'dinner-camera':{cg:'dinner',rows:[]},
  'dinner-photo-done':{cg:'dinner',rows:[mallLin('快吃吧，不然一会儿该凉了')],next:'dinner-eat'},
  'dinner-no-photo':{cg:'dinner',rows:[mallLin('好，那快趁热吃吧')],next:'dinner-eat'},
  'dinner-eat':{cg:'dinner',rows:(q,p)=>[
   '林晴刚说完，你拿起筷子就开始吃了起来。番茄入口即化，拌饭也特别入味，总之这些菜实在是太好吃了。',mallLin(p.profile.name),
   '听到林晴叫你，闷头干饭的你才抬起头来。','这时你才注意到，在昏暗灯光的映衬下，她似乎比平时还要好看。'
  ],choices:[['怎么了','dinner-care']]},
  'dinner-care':{cg:'dinnerLin',rows:[mallMe('怎么了'),mallLin('其实你不用对我那么照顾的'),mallLin('我们都一起从鬼门关走过一遭，我想今后没有什么坎是过不去的'),mallLin('我总不能真的依赖你们一辈子')],choices:[['依赖我不好吗','dinner-depend',10],['好，我听你的','dinner-listen',20]]},
  'dinner-depend':{cg:'dinnerLin',rows:[mallMe('依赖我不好吗'),mallLin('我不是这个意思'),mallLin('我就是不想总是你一个人付出')],next:'dinner-confide'},
  'dinner-listen':{cg:'dinnerLin',rows:[mallMe('好，我听你的'),mallLin('谢谢你')],next:'dinner-confide'},
  'dinner-confide':{cg:'dinnerLin',rows:(q,p)=>[
   mallLin('我以前总是被困在一个念头里'),
   mallLin('赚钱，然后还债'),
   mallLin('每次拿到钱，我第一反应都是先拿去还债'),
   mallLin('从来没有想过要给自己留下些什么'),
   mallLin('后来身体被一点点拖垮，精神状态也跟着越来越差'),
   mallLin('可我明明不用想那么远，想那么多的'),
   mallLin('曾经的我一直拘泥于眼下让我痛苦的事情'),
   mallLin('直到经历了那场“梦”，我才发现自己忽略了太多东西'),
   mallLin('我没有看见那些女孩们心里的善意，也忽略了身边最重要的友情'),
   mallLin('我甚至从来没有认真想过，面对眼前的困境或许还有其他解决办法'),
   mallLin('我只是固执地觉得，自己已经走投无路了'),
   mallLin('不过出院以后，我找律师详细咨询了自己的情况'),
   mallLin('总之，一切都没有我想象中那么糟糕。'),
   mallLin('我现在也想明白了，我的人生不该永远被父亲和债务困住'),
   mallLin(p.profile.name+'，我真的特别感谢你为我做的一切'),
   mallLin('如果那天不是你追出来'),
   mallLin('或许现在，我就没办法坐在这里和你一起吃这顿饭了')
  ],choices:[['呸呸呸，说什么不吉利的话呢','dinner-lucky'],['以后你可不能什么事都瞒着我们了','dinner-promise']]},
  'dinner-lucky':{cg:'dinnerLin',rows:[mallMe('呸呸呸，说什么不吉利的话呢'),mallLin('诶，对对，不说不说')],next:'dinner-happy'},
  'dinner-promise':{cg:'dinnerLin',rows:[mallMe('以后你可不能什么事都瞒着我们了'),mallLin('好，我向你和周禾保证')],next:'dinner-happy'},
  'dinner-happy':{cg:'dinnerLin',rows:['林晴的状态看起来比从前好了太多。','无论是现实中的她，还是那个“梦”里的她，都不曾像现在这样轻松。','她的眼里有了光，就像是那种开始期待未来，也期待接下来的每一天的感觉。','不知道为什么，你看着她开心，自己也忍不住跟着开心起来。'],next:'dinner-checkout'},
  'dinner-checkout':{cg:'checkout',rows:['吃完后，你本想扫码结账，可上面显示钱已经被付过了。',mallLin('要不要去江边散步？'),'看着林晴笑眯眯的样子，你一下就明白了。','她肯定趁你埋头苦吃的时候，偷偷把账结了！','本来还想上演一出“霸道总裁豪气买单”，结果被她截胡了，可恶。'],choices:[['走吧','riverside']]},
  riverside:{cg:'parkArrival',rows:['到滨江公园时，天已经黑了，城市的灯光沿着江岸次第亮起，别有一番景色。'],next:'river-breeze'},
  'river-breeze':{cg:'riverBreeze',rows:(q,p)=>[
   '夜晚的江风很大，吹起了林晴的长发。',
   '你开始说起最近在学校遇到的趣事，她在一旁听得眉眼弯弯，哈哈大笑。',
   mallLin(p.profile.name+'，有人说过你很有意思吗？')
  ],choices:[['没有呢，你是第一个这么说的哦','river-first',20],['是你笑点太低了吧！','river-laugh']]},
  'river-first':{cg:'riverBreeze',rows:[mallMe('没有呢，你是第一个这么说的哦'),'林晴愣了一下，目光有些慌乱地移向别处。',mallLin('这样啊')],next:'river-steps'},
  'river-laugh':{cg:'riverBreeze',rows:[mallMe('是你笑点太低了吧！'),mallLin('明明就是很好笑啊……')],next:'river-steps'},
  'river-steps':{cg:'riverSteps',rows:[
   '你们就这样并排沿江慢慢走着。',
   '没走多久，你们来到一处临江一路向下延伸的台阶，台阶的最底端贴着江面。',
   '这里的风尤其大，不少人正三三两两地坐着，在这看对岸的夜景。',
   '林晴在台阶上坐下，又轻轻拍了拍身旁的位置，示意你坐到她身边。',mallLin('今天的夜景好漂亮'),mallLin('我好久没有像今天这样开心过了')
  ],choices:[['那就好好享受当下这一刻吧','river-pause'],['你以后会有比现在更开心的时候的','river-pause'],['我也是，我也很开心','river-pause']]},
  'river-pause':{cg:'riverSteps',rows:q=>[mallMe(mallSceneScript['river-steps'].choices[q.decisions['river-steps']][0]),mallLin('嗯')],next:'river-gate'},
  'river-high':{cg:'riverside',rows:[
   mallLin('你真好'),'夜风恰好在这时吹来。',
   '你本想偏过头看看林晴，看看她此刻是什么表情，可她的长发又一次被风吹乱，遮住了大半张脸。',
   '回过神时，手已经鬼使神差地伸了过去，轻轻替她拨开了脸侧的发丝。','你也不知道自己为什么会这样。',
   '林晴错愕地看着你，似乎完全没想到你会这么做。说实话，就连你自己也不知道这是怎么了。','怎么办……','她的脸怎么这么红？',
   '四周仿佛一下安静了，只剩江风掠过耳畔，以及你骤然清晰起来的心跳声。',mallLin('你的脸好红')
  ],choices:[['你也是','river-blush']]},
  'river-blush':{cg:'riverside',rows:[mallMe('你也是'),
   '林晴立刻将你拨到耳后的发丝重新放了下来，有些慌乱地别过脸去。',mallLin('有、有吗？'),mallLin('可能就是有点热吧今天，嗯'),
   '哈哈，这就是土象吗，还怪可爱的。','不知道过了多久，你们才终于想起该回家了。','你把林晴送到了滨江公园西站。',mallLin('那我先回家了'),'她说完没有直接刷卡进站，而是在原地看着你，有些不舍得离去。',mallLin('你到家以后要记得告诉我。'),'说完，她轻轻朝你挥了挥手，才终于走进地铁站。'
  ],next:'high-home'},
  'river-mid':{cg:'riverside',rows:[mallLin('你真好'),mallLin('以后我们也常来江边走走吧')],choices:[['好','river-touch'],['我还想和你去更多的地方','river-places']]},
  'river-places':{cg:'riverside',rows:[mallMe('我还想和你去更多的地方'),mallLin('好啊，那我要努力赚钱'),mallLin('这样就能想去哪玩就去哪玩了')],choices:[['我养你啊！','river-support'],['那我就当你最坚实的后盾','river-backup']]},
  'river-support':{cg:'riverside',rows:[mallMe('我养你啊！'),mallLin('哈哈哈哈'),mallLin('你先照顾好你自己吧，傻瓜'),mallLin('我是不是该接一句这个')],choices:[['我认真的','river-serious'],['好吧，看来你不想让我养你','river-no-support']]},
  'river-serious':{cg:'riverside',rows:[mallMe('我认真的'),mallLin('那不行'),mallLin('总得让我报答你吧')],choices:[['好吧','river-touch']]},
  'river-no-support':{cg:'riverside',rows:[mallMe('好吧，看来你不想让我养你'),mallLin('嗯'),mallLin('我不想把你当血包')],next:'river-touch'},
  'river-backup':{cg:'riverside',rows:[mallMe('那我就当你最坚实的后盾'),mallLin('我怎么这么幸运'),mallLin('有你这样的后盾在，我就不会再被打倒了')],next:'river-touch'},
  'river-touch':{cg:'riverside',rows:[
   '你们不约而同地结束了话题，只是静静地看着江景，看着不远处的孩子们追逐嬉闹。',
   '忽然，你感觉到小拇指上传来一阵微凉的触感。','起初像是不经意地碰在一起，也像是某种小心翼翼的试探。'
  ],choices:[['收回手','river-withdraw'],['不动','river-still']]},
  'river-withdraw':{cg:'riverSteps',rows:[
   '你下意识地收回了手。','余光里，你看见林晴的手蜷缩了一下，随后放回了膝上。','她没有看你，只是将目光投向了更远的江面。',
   mallLin('刚刚不小心碰到了'),mallMe('没事'),'你们又安静了下来，谁也没有继续说话。','或许林晴真的只是不小心碰到了你的手。','总之今天和她出来玩，你们俩都很开心。','不知道下一次再和她出来玩会是什么时候呢？'
  ],next:'finish-friends'},
  'river-still':{cg:'riverside',rows:[
   '你没有躲开，她也没有收回手。','你终于转头看向林晴。','林晴仍然望着江面，风刚好吹乱了她的头发，让人看不清她此刻的表情。',mallLin('今晚的风……是不是有点大？')
  ],choices:[['有点','river-wind'],['好像是','river-wind']]},
  'river-wind':{cg:'holdingHands',rows:q=>[mallMe(q.decisions['river-still']===0?'有点':'好像是'),
   '江对岸的灯光落进水里，被晚风揉成细碎的光点。你没有问她刚才的动作是什么意思，她也始终没有松开手。',
   '今晚的风是有点大，可为什么你的脸和手都有点热呢？'
  ],next:'finish-wind'},
  'river-low':{cg:'riverSteps',rows:(q,p)=>[mallLin(p.profile.name+'，你现在是我最好的朋友了')],choices:[['那周姐呢？','river-zhou'],['以后就不是了？','river-forever']]},
  'river-zhou':{cg:'riverSteps',rows:[mallMe('那周姐呢？'),mallLin('你们都是'),mallLin('不过，你要比周姐地位高那么一点')],choices:[['不错不错','trip-plan'],['你就不怕我告诉周姐？','river-tell-zhou']]},
  'river-tell-zhou':{cg:'riverSteps',rows:[mallMe('你就不怕我告诉周姐？'),mallLin('周姐她有从小到大都玩在一起的闺蜜'),mallLin('她应该不会因为这个和我计较的')],next:'trip-plan'},
  'river-forever':{cg:'riverSteps',rows:[mallMe('以后就不是了？'),mallLin('你永远是我最好的朋友'),mallLin('你是不是就想听这个？')],choices:[['对咯','trip-plan'],['答对了，奖励你一个爱的拥抱','river-hug']]},
  'river-hug':{cg:'riverSteps',rows:[mallMe('答对了，奖励你一个爱的拥抱'),'你笑着张开双臂，示意她来一个大大的拥抱。','林晴也笑着抱住了你。','你轻轻拍了拍她的背，随后很自然地松开了手。'],next:'trip-plan'},
  'trip-plan':{cg:'riverSteps',rows:[mallLin('等我解决了债务的问题，我们就约定好去一个地方玩吧？'),mallLin('你有什么想去的地方吗？')],choices:[['说说想去的地方','trip-input'],['我还没有想好，你有想去的地方吗？','trip-seaside']]},
  'trip-input':{cg:'riverSteps',rows:[]},
  'trip-custom':{cg:'riverSteps',rows:q=>[mallMe(q.destination),mallLin('好，那我们以后一起去'+q.destination+'玩吧？'),mallLin('我会为了这个目标努力的'),mallLin('你那么漂亮'),mallLin('我到时候要给你拍很多好看的照片')],next:'trip-photography'},
  'trip-seaside':{cg:'riverSteps',rows:[mallMe('我还没有想好，你有想去的地方吗？'),mallLin('我想和你去海边玩'),mallLin('你那么漂亮'),mallLin('夏日的海边我肯定可以给你拍很多好看的照片')],next:'trip-photography'},
  'trip-photography':{cg:'riverSteps',rows:['你这才想起来，林晴曾经透露过自己是个很爱摄影的人。有这样一个好的出片搭子在，不敢想到时候出去玩会有多爽。'],next:'trip-future'},
  'trip-future':{cg:'future',rows:["那天回去以后，你们不约而同的把这场尚未确定日期的旅行，都写进了手机备忘录。","后来，你和林晴的聊天记录里全都是对未来的种种期待。","不过林晴最终选择了休学。","虽然大家都很想继续帮助她，但她不愿一直依靠别人的资助生活。","大家筹款让她得到了及时的治疗，对她而言这已经足够了，林晴也很感激大家的付出。","了解她的情况后，学校特批了这次休学，不设具体期限，也会一直保留她的学籍。","无论什么时候，只要她准备好了，随时都可以回来继续上学。","于是林晴开始重新规划自己的生活，认真工作，按时吃饭，也终于学会在遇到困难的时候主动给你和周禾发消息求助。"],next:'years-pass'}
 });
 let epilogueMallOwner=null;
 const epilogueFinishes={
  blush:{tone:'romance',title:'你们在脸红什么呢？'},
  friends:{tone:'green',title:'你们都是彼此最好的朋友'},
  wind:{tone:'pink',title:'今晚的风有点大'},
  travel:{tone:'yellow',title:'一起去旅行吧！'}
 };
 const endingPhoneScript={
  'high-ask':{rows:['我到家了，你到家了吗？'],choices:[['到家了','high-answer'],['嗯嗯，刚到','high-answer']]},
  'high-answer':{rows:['好',{sticker:true}],finish:'blush'},
  'trip-ask':{rows:['我们一起去旅行吧？'],choices:[['现在出发？','trip-now'],['什么时候？','trip-when']]},
  'trip-now':{rows:['如果你想的话，就现在'],choices:[['好！','finish-travel']]},
  'trip-when':{rows:['你想什么时候都可以'],choices:[['好！','finish-travel']]}
 };
 function epilogueSticker(){return '<img class="epilogue-blush-sticker" src="assets/epilogue-blush-cat.jpg?v=20261016-rc2" alt="小猫抱心表情包">'}
 function epilogueFinish(kind){
  const q=data().epilogueMall;if(!epilogueFinishes[kind])return;
  q.finish=kind;q.phase='ending';q.node='finish-'+kind;
  document.querySelector('#hospital-ending-message')?.remove();context(epilogueFinishView);save();
 }
 function epilogueFinishView(){
  const q=data().epilogueMall,ending=epilogueFinishes[q?.finish];if(!ending||q.phase!=='ending')return;
  if(screen.querySelector('.epilogue-finish')?.dataset.finish===q.finish)return;
  closeSheet();view='hospital-epilogue-finish';active=null;
  screen.innerHTML='<section class="epilogue-finish '+ending.tone+'" data-finish="'+q.finish+'"><div class="epilogue-finish-card" role="dialog" aria-modal="true" aria-label="番外完"><div class="epilogue-finish-art" aria-hidden="true"><svg viewBox="0 0 120 90"><path d="M60 74C-2 38 22-8 60 23C98-8 122 38 60 74Z"/><path d="M18 74q42-14 84 0M12 23h8m-4-4v8m84 19h8m-4-4v8"/></svg></div><p>番外 <span>完</span></p><h2>'+ending.title+'</h2><div class="epilogue-finish-rule"></div><button type="button" data-action="epilogue-finish-close" aria-label="返回手机主页">珍藏这一刻</button></div></section>';save();
 }
 function endingMessage(p,f,row,mine=false){
  const id='epilogue-023-ending-'+f.node+'-'+(mine?'player':f.index),rows=p.messages.linqing??=[];
  if(rows.some(m=>m.id===id))return;
  const sticker=!!row?.sticker,text=sticker?'[表情包]':String(row);
  rows.push({id,type:'text',sender:mine?'me':'linqing',name:mine?p.profile.name:'林晴',text,epilogueSticker:sticker,gameDate:p.system.date,time:p.system.time,...(mine?{status:'read'}:{})});
  const contact=p.contacts.find(c=>c.id==='linqing');if(contact){contact.preview=text;contact.time=p.system.time;if(!mine&&!(view==='chat'&&active==='linqing'))contact.unread=(contact.unread||0)+1}
  if(!mine&&!(view==='chat'&&active==='linqing')){
   document.querySelector('#hospital-ending-message')?.remove();const el=document.createElement('div');el.id='hospital-ending-message';el.className='opening-message';el.dataset.ringtonePlayed='true';
   el.innerHTML='<button class="opening-body" data-action="epilogue-ending-chat"><span>'+avatar('linqing')+'</span><span><small>讯息 · '+esc(p.system.time)+'</small><strong>林晴</strong><span>'+esc(text)+'</span></span></button>';document.querySelector('#phone').append(el);base.playNotificationSound('message',el);
  }
 }
 function endingPhoneStart(node,fromHome=false,delay=0){
  const p=data(),q=p.epilogueMall;q.phase='ending-phone';q.node=node;
  if(node==='trip-ask')travelMoments(p);
  const f=q.phoneEnding={node,index:0,phase:'rows',remaining:0,decisions:q.phoneEnding?.decisions||{}};
  if(fromHome){
   const outgoing=node==='high-ask'?screen.querySelector('#hospital-epilogue-mall-cg')?.cloneNode(true):null;
   p.system.time=node==='high-ask'?'22:21':'13:23';p.game.period=node==='high-ask'?'夜晚':'下午';context(homePhone);
   if(outgoing){
    outgoing.inert=true;outgoing.setAttribute('aria-hidden','true');
    Object.assign(outgoing.style,{pointerEvents:'none',zIndex:'100',animation:'none'});
    screen.append(outgoing);
    const fade=outgoing.animate([{opacity:1},{opacity:0}],{duration:900,easing:'ease-in-out',fill:'forwards'});
    fade.onfinish=()=>outgoing.remove();fade.oncancel=()=>outgoing.remove();
   }
  }
  if(delay>0){f.phase='arrival-wait';f.remaining=delay;save();return}
  endingMessage(p,f,endingPhoneScript[node].rows[0]);f.index=1;f.phase=fromHome?'await-read':endingPhoneScript[node].choices&&f.index===endingPhoneScript[node].rows.length?'choice-wait':'rows';f.remaining=messageSendDelay();save();
  if(!fromHome)shoppingRefresh();
 }
 function endingChatChoices(){
  const p=data(),q=p.epilogueMall,f=q?.phoneEnding;if(q?.phase!=='ending-phone'||!f)return;
  document.querySelector('#hospital-ending-message')?.remove();
  const composer=screen.querySelector('#composer');if(!composer)return;composer.querySelectorAll('input,textarea,button').forEach(el=>el.disabled=true);
  if(f.phase==='await-read'){f.phase=endingPhoneScript[f.node].choices&&f.index===endingPhoneScript[f.node].rows.length?'choice-wait':'rows';f.remaining=messageSendDelay();save()}
  if(f.phase==='choice')composer.insertAdjacentHTML('beforebegin','<div class="zero-choices">'+endingPhoneScript[f.node].choices.map(([text],i)=>'<button data-ending-phone-choice="'+i+'">'+esc(text)+'</button>').join('')+'</div>');
 }
 function endingPhoneChoose(index){
  const p=data(),q=p.epilogueMall,f=q?.phoneEnding;if(q?.phase!=='ending-phone'||f?.phase!=='choice'||f.decisions[f.node]!==undefined)return;
  const choice=endingPhoneScript[f.node].choices?.[index];if(!choice)return;f.decisions[f.node]=index;endingMessage(p,f,choice[0],true);
  f.next=choice[1];f.phase='player-wait';f.remaining=messageSendDelay();shoppingRefresh();save();
 }
 function endingPhoneTick(delta){
  const p=data(),q=p.epilogueMall,f=q.phoneEnding;if(!f||['await-read','choice'].includes(f.phase))return;
  f.remaining=Math.max(0,f.remaining-delta);if(f.remaining)return;
  if(f.phase==='arrival-wait'){endingMessage(p,f,endingPhoneScript[f.node].rows[0]);f.index=1;f.phase='await-read';f.remaining=messageSendDelay();save();return}
  if(f.phase==='player-wait'){if(f.next==='finish-travel'){epilogueFinish('travel');return}endingPhoneStart(f.next);return}
  if(f.phase==='ending-wait'){epilogueFinish('blush');return}
  const def=endingPhoneScript[f.node];
  if(f.phase==='choice-wait'){f.phase='choice';shoppingRefresh();save();return}
  if(f.index<def.rows.length){endingMessage(p,f,def.rows[f.index]);f.index++;f.remaining=messageSendDelay();shoppingRefresh()}
  if(f.index===def.rows.length){f.phase=def.choices?'choice-wait':'ending-wait';f.remaining=def.choices?messageSendDelay():4000}
  save();
 }
 function epilogueYearCalendar(){
  const p=data(),q=p.epilogueMall;let layer=screen.querySelector('.epilogue-years');
  if(!layer){context(homePhone);layer=document.createElement('div');layer.className='epilogue-years';layer.setAttribute('role','status');layer.innerHTML='<div class="epilogue-years-card"><small>日子一页页翻过</small><div class="epilogue-year-pages"><div data-year-page></div></div><progress max="7000" value="0" aria-label="时光流逝"></progress></div>';screen.append(layer)}
  const step=Math.min(35,Math.floor((7000-q.remaining)/200)),start=Date.UTC(2045,8,22),end=Date.UTC(2048,7,2),date=new Date(start+(end-start)*step/35).toISOString().slice(0,10);
  const page=layer.querySelector('[data-year-page]');if(page.dataset.date!==date){page.dataset.date=date;page.innerHTML='<span>'+date.slice(0,4)+'</span><strong>'+date.slice(5).replace('-',' / ')+'</strong>';page.classList.remove('turn');void page.offsetWidth;page.classList.add('turn')}
  layer.querySelector('progress').value=7000-q.remaining;
 }
 function endingStageTick(delta){
  const p=data(),q=p.epilogueMall;
  if(q.phase==='ending'){if(screen.querySelector('.epilogue-finish')?.dataset.finish!==q.finish)context(epilogueFinishView);return true}
  if(q.phase==='ending-phone'){endingPhoneTick(delta);return true}
  if(q.phase==='years'){
   q.remaining=Math.max(0,q.remaining-delta);epilogueYearCalendar();
   if(!q.remaining){p.system.date='2048-08-02';p.calendarMonth='2048-08';p.calendarSelected=p.system.date;endingPhoneStart('trip-ask',true,4000)}
   return true;
  }
  return false;
 }
function mallSceneCGKey(q){
  const lead=q.choiceLead?.node===q.node,index=(q.index||0)-(lead?1:0);
  if(lead&&index<0)return q.choiceLead.cg;
  if(['river-mid','river-places','river-support','river-serious','river-no-support','river-backup'].includes(q.node))return 'riverSteps';
  if(q.node==='river-touch')return index<1?'riverSteps':'fingerTouch';
  if(q.node==='river-still')return index<3?'fingerTouch':'holdingHands';
  if(q.node==='river-high')return index<3?'riverSteps':'hairTouch';
  if(q.node==='river-blush')return index<2?'hairTouch':index<6?'riverSteps':'subwayGoodbye';
  if(q.node==='river-steps'&&index===0)return 'parkArrival';
  if(q.node==='dinner-eat'&&index>=2)return 'dinnerLin';
  if(q.node==='jewelry'&&index<2)return 'p1';
  if(q.node==='dinner-invite'&&index>=2)return index<4?'escalator':index<11?'restaurant':'dinner';
  const key=mallSceneScript[q.node].cg;
  const hairclips=q.item==='hairclip'||q.item==='both'||q.decisions?.jewelry===1;
  if(key==='p2'&&(q.node==='hairclip'||q.node!=='jewelry'&&hairclips))return 'hairclips';
  if(key==='p3')return q.node==='island'&&index<2?'p3':'birds';
  if(q.node==='dinner-invite'&&index<2){
   const shop=q.shopCG||(['p2','birds','p4'][q.decisions?.intro])||(q.receipts?.['jewelry-paid']?'p2':q.receipts?.['tea-paid']?'p4':'birds');
   return shop==='p2'&&hairclips?'hairclips':shop;
  }
  return key;
 }
 function mallSceneAdvanceImage(scene,q,p){
  const key=mallSceneCGKey(q);if(scene.dataset.cg===key)return;
  scene.dataset.cg=key;const image=epilogueMallImages[key][epilogueOutfit(p)]||'',old=scene.querySelector(':scope>img:not(.cg-outgoing-image)');
  if(old?.getAttribute('src')===image)return;
  if(image){const img=document.createElement('img');img.src=image;img.alt='东川中心';scene.prepend(img);if(old){old.remove();cgImageCrossfade(old,img,600)}}
  else if(old){old.classList.add('cg-outgoing-image');cgFadeLayer(old,null,600)}
 }
 function mallSceneRows(q,p){const rows=mallSceneScript[q.node].rows,result=typeof rows==='function'?rows(q,p):rows;return q.choiceLead?.node===q.node?[mallMe(q.node==='tea-paid'?mallDrinks[q.drink].name+'吧':q.choiceLead.text),...result]:result}
 const dinnerPhotoId='epilogue-023-dinner-photo',dinnerPostId='epilogue-023-dinner-post';
 function dinnerCameraIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h4l2-3h4l2 3h4v14H4z"/><circle cx="12" cy="13" r="4"/></svg>'}
 function dinnerPhotoMarkup(photo,cls='dinner-photo'){
  if(photo?.id===dinnerPhotoId&&!photo.src)photo={...photo,src:epilogueMallImages.dinner['1']};
  return photo?.src?'<img class="'+cls+'" src="'+esc(photo.src)+'" alt="晚餐照片">':'<div class="'+cls+' dinner-photo-empty" role="img" aria-label="晚餐照片">'+dinnerCameraIcon()+'</div>';
 }
 function dinnerCamera(){
  const p=data(),q=p.epilogueMall;if(!q?.cameraUnlocked)return homePhone();
  closeSheet();view='hospital-dinner-camera';active=null;statusPhone();
  const photo=p.album?.find(item=>item.id===dinnerPhotoId),image=epilogueMallImages.dinner[epilogueOutfit(p)];
  screen.innerHTML='<section class="dinner-camera"><header><button data-action="dinner-camera-back" aria-label="返回手机主页">'+icon('back')+'</button><span class="camera-flash" aria-label="闪光灯关闭"><svg viewBox="0 0 24 24"><path d="m13 2-7 11h6l-1 9 7-12h-6zM3 3l18 18"/></svg></span><span class="camera-live">实况</span></header><div class="dinner-viewfinder">'+(image?'<img src="'+esc(image)+'" alt="晚餐取景">':'')+'<div class="camera-grid" aria-hidden="true"></div><span class="camera-focus" aria-hidden="true"></span><div class="camera-zoom"><span>0.5</span><b>1×</b><span>2</span></div><div class="camera-saved" role="status" hidden>已成功保存到相册<br><small>现在可以去发朋友圈了</small></div></div><footer><div class="camera-modes"><span>视频</span><strong>照片</strong><span>人像</span></div><div class="camera-controls"><button class="camera-thumb" data-action="dinner-album" aria-label="查看相册">'+dinnerPhotoMarkup(photo)+'</button><button class="camera-shutter" data-action="dinner-shutter" aria-label="拍摄照片"><i></i></button><span class="camera-lens" aria-hidden="true">'+dinnerCameraIcon()+'</span></div></footer></section>';
 }
 function dinnerShoot(){
  const p=data(),q=p.epilogueMall;if(view!=='hospital-dinner-camera'||!q?.cameraUnlocked)return;
  p.album??=[];if(!p.album.some(item=>item.id===dinnerPhotoId))p.album.push({id:dinnerPhotoId,src:epilogueMallImages.dinner[epilogueOutfit(p)]||'',date:p.system.date,time:'18:49'});
  q.photoTaken=true;save();
  const camera=screen.querySelector('.dinner-viewfinder');camera.classList.remove('shot');void camera.offsetWidth;camera.classList.add('shot');
  camera.querySelector('.camera-saved').hidden=false;
 }
 function dinnerCameraBack(){
  const q=data().epilogueMall;if(q?.phase==='camera')q.phase='social';homePhone();save();
 }
 function dinnerAlbum(){
  const p=data(),photo=p.album?.find(item=>item.id===dinnerPhotoId);
  sheet('相册',photo?dinnerPhotoMarkup(photo)+'<p class="dinner-album-caption">9月22日 · 18:49</p>':'<p>还没有照片，拍一张留作纪念吧。</p>');
 }
 function dinnerMomentReplyMarkup(post,r){
  const text='<strong>'+esc(r.name)+'</strong>'+(r.replyTo?'<span>回复</span><strong>'+esc(r.replyTo)+'</strong>':'')+'：'+esc(r.text);
  return post.id===dinnerPostId&&r.id&&r.name!==data().profile.name?'<p><button class="dinner-comment" data-dinner-reply="'+esc(r.id)+'">'+text+'</button></p>':'<p>'+text+'</p>';
 }
 function dinnerReply(id){
  const p=data(),post=p.hospitalMoments?.find(item=>item.id===dinnerPostId),reply=post?.replies.find(item=>item.id===id);if(!reply)return;
  post.drafts??={};sheet('回复 '+reply.name,'<form id="dinner-reply-form"><textarea class="dinner-reply-input" rows="1" maxlength="1000" placeholder="说点什么…" aria-label="回复内容">'+esc(post.drafts[id]||'')+'</textarea><button class="primary" type="submit">发送</button></form>');
  const form=document.querySelector('#dinner-reply-form');form.closest('.sheet').classList.add('dinner-reply-sheet');form.closest('.sheet-backdrop').classList.add('dinner-reply-backdrop');form.querySelector('textarea').oninput=e=>{post.drafts[id]=e.target.value;save()};
  form.onsubmit=e=>{e.preventDefault();if(!p.hospitalMoments.includes(post))return;const text=form.querySelector('textarea').value.trim();if(!text)return;
   post.replySerial=(post.replySerial||0)+1;post.replies.push({id:'dinner-player-'+post.replySerial,name:p.profile.name,replyTo:reply.name,text});delete post.drafts[id];
   post.responded??={};const kind=id==='dinner-zhou-1'||id==='dinner-zhou-2'?'zhou':id==='dinner-mom-1'?'mom':null;
   if(kind&&!post.responded[kind]){post.responded[kind]=true;post.pendingReplies.push({id:'dinner-'+kind+'-response',name:reply.name,text:kind==='zhou'?'好好好':'宝贝一会儿告诉我多少钱，我转你，你请人家吃',replyTo:p.profile.name,at:null})}
   closeSheet();moments();save();syncMomentReplies();
  };
 }
 function sendDinnerMoment(text){
  const p=data(),q=p.epilogueMall;if(!q?.photoTaken||q.dinnerPosted)return false;
  const photo=p.album?.find(item=>item.id===dinnerPhotoId);p.hospitalMoments??=[];
  if(!p.hospitalMoments.some(post=>post.id===dinnerPostId))p.hospitalMoments.unshift({id:dinnerPostId,text,photo:structuredClone(photo),date:momentDate(p.system.date+' 18:49'),replies:[],pendingReplies:[{id:'dinner-zhou-1',name:'周禾',text:'？？？'},{id:'dinner-zhou-2',name:'周禾',text:'居然没叫我'},{id:'dinner-mom-1',name:'妈妈',text:'看起来很好吃，在和谁一起吃呢？'}],replyKind:'dinner',replyInterval:1000});
  q.dinnerPosted=true;q.phase='post-wait';q.remaining=15000;state.momentDraft='';save();moments();syncMomentReplies();return true;
 }
 function mallSceneGo(node){
  const p=data(),q=p.epilogueMall;
  if(node==='river-gate'){
   q.riversideAffection=Number(p.epilogueShopping?.affection)||0;
   q.affectionBranch=q.riversideAffection>100?'high':q.riversideAffection>80?'mid':'low';
   node='river-'+q.affectionBranch;
  }
  if(node==='high-home'){endingPhoneStart('high-ask',true,3000);return true}
  if(node==='finish-friends'||node==='finish-wind'){epilogueFinish(node.slice(7));return true}
  if(node==='years-pass'){
   q.node=node;q.phase='years';q.remaining=7000;
   if(!q.travelNoteWritten){p.note=(p.note?String(p.note)+'\n\n':'')+'和林晴的旅行约定\n想一起去：'+(q.destination||'海边')+'\n出发日期：等我们准备好了，就一起出发。';q.travelNoteWritten=true}
   context(homePhone);epilogueYearCalendar();save();return true;
  }
  const def=mallSceneScript[node];
  if(node==='dinner-invite'&&mallSceneScript[q.node])q.shopCG=mallSceneCGKey(q);
  if(def.payment&&!q.receipts[node]){
   const receipt=def.payment(q),cents=Math.round(receipt.amount*100),balance=Math.round(p.game.wallet*100);
   if(!Number.isSafeInteger(cents)||cents<0||!Number.isSafeInteger(balance)||balance<cents){toast('小金库余额不足');return false}
   p.game.wallet=(balance-cents)/100;q.receipts[node]={...receipt,balance:p.game.wallet};
  }
  q.node=node;q.index=0;q.phase=node==='tea-wait'?'brewing':node==='dinner-camera'?'camera':node==='trip-input'?'destination':'rows';q.remaining=node==='tea-wait'?7000:0;
  const choice=q.pendingChoice;delete q.pendingChoice;delete q.choiceLead;
  if(choice?.target===node){
   const rows=typeof def.rows==='function'?def.rows(q,p):def.rows;
   const actions=['和她解释','装委屈','假装难过','答应她','收回手','不动','说说想去的地方'];
   if(rows[0]?.speaker!=='me'&&!actions.includes(choice.label))q.choiceLead={node,cg:choice.cg,text:choice.source==='intro'?'我们去逛逛'+choice.label+'，怎么样？':choice.source==='tea-menu'?mallDrinks[q.drink].name+'吧':choice.label};
  }
  if(node==='trip-seaside')q.destination='海边';
  if(node==='dinner-seat'||node==='dinner-camera'){p.system.time='18:49';statusPhone()}
  if(node==='dinner-camera'){q.cameraUnlocked=true;save();context(dinnerCamera);return true}
  context(epilogueMallCG);return true;
 }
 function mallSceneChoose(index){
  const p=data(),q=p.epilogueMall;if(q?.phase!=='choice'||q.decisions[q.node]!==undefined)return;
  const option=mallSceneScript[q.node].choices?.[index];if(!option)return;
  const [label,next,affection=0,item]=option,node=q.node;
  if(node==='tea-menu')q.drink=item;else if(item!==undefined)q.item=item;
  // Settle the choice before rendering; a repeated click or restore cannot award twice.
  q.decisions[node]=index;
  q.pendingChoice={source:node,target:next,label,cg:mallSceneCGKey(q)};
  if(affection){const a=p.epilogueShopping;a.affection=(Number(a.affection)||0)+affection}
  if(!mallSceneGo(next)){delete q.pendingChoice;delete q.decisions[node];if(affection)p.epilogueShopping.affection-=affection;return}
  playInteractionSound('button');
  if(node==='dinner-care'&&next==='dinner-listen')toast('林晴对你的好感产生了变化');
 }
 function mallOrderPaint(q){
  const count=Math.ceil(q.remaining/1000),el=screen.querySelector('.epilogue-tea-order');if(!el)return;
  const number=el.querySelector('[data-tea-count]');if(number.textContent!==String(count))number.textContent=count;
  const progress=el.querySelector('progress');progress.value=7000-q.remaining;
 }
 function epilogueMallCG(){
  const p=data();if(p.epilogueGreeting?.phase!=='done')return;
  if(p.epilogueMall?.phase==='ending')return epilogueFinishView();
  if(p.epilogueMall?.phase==='ending-phone')return homePhone();
  if(p.epilogueMall?.phase==='years')return epilogueYearCalendar();
  if(['camera','social','post-wait'].includes(p.epilogueMall?.phase))return dinnerCamera();
  const q=p.epilogueMall??={node:'intro',phase:'rows',index:0,decisions:{},receipts:{}};
  const def=mallSceneScript[q.node],key=q.node+':'+q.phase,existing=screen.querySelector('#hospital-epilogue-mall-cg');
  if(existing&&epilogueMallOwner===q&&existing.dataset.stage===key)return;
  const cg=mallSceneCGKey(q),image=epilogueMallImages[cg][epilogueOutfit(p)]||'',change=!existing||existing.dataset.cg!==cg;
  const previous=change?captureSceneSnapshot(screen):null;
  const keep=existing&&epilogueMallOwner===q&&[q.node+':rows',q.node+':choice-wait'].includes(existing.dataset.stage)&&['choice-wait','choice','done'].includes(q.phase)&&!!existing.querySelector('.vn-dialogue');
  epilogueMallOwner=q;closeSheet();view='hospital-epilogue-mall-cg';active=null;
  if(!existing)screen.innerHTML='<section id="hospital-epilogue-mall-cg" class="rd-cg"></section>';
  const scene=screen.firstElementChild;scene.dataset.stage=key;scene.dataset.cg=cg;
  if(change){scene.querySelector(':scope>img')?.remove();if(image){const img=document.createElement('img');img.src=image;img.alt='东川中心';scene.prepend(img)}}
  let host=scene.querySelector('[data-mall-dialogue]');
  if(!keep){host?.remove();host=document.createElement('div');host.dataset.mallDialogue='';host.style.cssText='position:absolute;inset:0';scene.append(host)}
  const rows=mallSceneRows(q,p);
  if(q.phase==='destination'){
   host.innerHTML='<form class="epilogue-destination"><small>和林晴的旅行约定</small><h2>你想去哪里？</h2><p>把想一起去的地方告诉她吧。</p><input maxlength="80" aria-label="想去的地方" placeholder="输入目的地…" value="'+esc(q.destinationDraft||'')+'" required><button type="submit">告诉林晴</button></form>';
   const form=host.querySelector('form');form.querySelector('input').oninput=e=>{q.destinationDraft=e.target.value;save()};
   form.onsubmit=e=>{e.preventDefault();e.stopPropagation();if(data().epilogueMall!==q||q.phase!=='destination')return;const value=form.querySelector('input').value.trim();if(!value)return toast('写下一个想去的地方吧');q.destination=value;playInteractionSound('button');mallSceneGo('trip-custom')};
  }else if(q.phase==='brewing'){
   host.innerHTML='<div class="epilogue-tea-order" role="status"><div class="tea-order-mark"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M13 16h22l-3 25H16zM11 16h26M28 16l4-11h6M18 24h12"/></svg></div><small>一川茶饮 · 现点现做</small><h2>您的订单正在制作中</h2><div class="tea-order-number">1026</div><p>前方还有 <b data-tea-count>7</b> 杯制作中</p><progress max="7000" value="0" aria-label="饮品制作进度"></progress><span>稍等片刻，美味即将送达</span></div>';mallOrderPaint(q);
  }else if(['choice-wait','choice','done'].includes(q.phase)){
   if(!keep)host.innerHTML='<div class="vn-dialogue">'+cgDialogueMarkup(rows.at(-1),{lastPage:true})+'</div>';
   if(q.phase==='choice'){const options=document.createElement('div');options.className='cg-options';def.choices.forEach(([text],i)=>{const b=document.createElement('button');b.type='button';b.textContent=text;b.dataset.mallSceneChoice=i;b.onclick=e=>{e.preventDefault();e.stopPropagation();if(data().epilogueMall===q)mallSceneChoose(i)};options.append(b)});host.append(options)}
  }else CGDialogue.present(host,rows,{index:q.index||0,firstReplyConfirmed:true,retainOnComplete:true,typingInterval:mobileNativeInterval,onReplyConfirmed:()=>playInteractionSound('button'),onIndex:i=>{if(data().epilogueMall===q){q.index=i;mallSceneAdvanceImage(scene,q,p);save()}},onComplete:()=>{
   if(data().epilogueMall!==q||q.phase!=='rows')return;
   if(def.next){if(!mallSceneGo(def.next)){q.index=Math.max(0,rows.length-1);scene.dataset.stage='';context(epilogueMallCG)}return}
   if(q.node==='river-pause')q.riversideAffection=Number(p.epilogueShopping?.affection)||0;
   q.phase=def.choices?'choice-wait':'done';q.remaining=def.choices?messageSendDelay():0;context(epilogueMallCG);save();
  }});
  if(change)zeroDissolve(previous,600);save();
 }
 function taxiIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 9 2-5h10l2 5M4 9h16v10H4zM7 19v2m10-2v2M7 13h1m8 0h1M9 4V2h6v2"/></svg>'}
 function taxiData(){return data().taxi??={phase:'booking',query:'',destination:'',car:'express',elapsed:0,shared:false,asked:false,replyPhase:null,queue:[]}}
 function taxiClock(q){const minutes=16*60+32+Math.floor(Math.min(22000,q.elapsed)/1000);return String(Math.floor(minutes/60)).padStart(2,'0')+':'+String(minutes%60).padStart(2,'0')}
 function taxiMap(){return '<svg class="ht-map" viewBox="0 0 360 330" aria-label="东川大学南门至东川中心北区A口的示意路线"><rect width="360" height="330" fill="#edf0ed"/><g fill="#dde5db"><rect x="20" y="22" width="80" height="60" rx="12"/><rect x="130" y="100" width="65" height="80" rx="12"/><rect x="25" y="225" width="80" height="75" rx="12"/><rect x="250" y="230" width="80" height="65" rx="12"/></g><g stroke="white" stroke-width="13" fill="none"><path d="M0 95H360M0 205H360M0 270H360M115 0V330M230 0V330"/></g><g fill="#86928d" font-size="10"><text x="25" y="53">东川大学</text><text x="142" y="151">中心公园</text><text x="257" y="251">东川中心</text></g><path d="M55 95H115V205H230V270H285" stroke="#fff" stroke-width="12" fill="none"/><path d="M55 95H115V205H230V270H285" stroke="#557f72" stroke-width="6" fill="none" stroke-linejoin="round"/><circle cx="55" cy="95" r="7" fill="#fff" stroke="#557f72" stroke-width="3"/><circle cx="285" cy="270" r="7" fill="#a96c83" stroke="white" stroke-width="3"/><g data-taxi-car transform="translate(55 95)"><circle r="15" fill="#fff" stroke="#537969" stroke-width="2"/><path d="M-7-4h14v8H-7zM-5-4l2-4h6l2 4M-5 4v3m10-3v3" fill="none" stroke="#365c50" stroke-width="1.7"/></g><text x="18" y="120" fill="#435b50" font-size="10">东川大学南门</text><text x="233" y="298" fill="#805065" font-size="10">北区A口</text><text x="12" y="322" fill="#8a9690" font-size="8">路线示意</text></svg>'}
 function taxiApp(){
  const p=data();if(!p.taxiUnlocked)return;const q=taxiData();view='hospital-taxi';active=null;closeSheet();
  const car=taxiCars.find(c=>c.id===q.car)||taxiCars[0],onTrip=q.phase!=='booking';
  screen.innerHTML='<section class="ht-app"><header class="ht-header"><button data-action="home" aria-label="返回桌面">'+icon('back')+'</button><strong>出发</strong></header>'+taxiMap()+'<div class="ht-panel">'+(onTrip?'<div class="ht-trip-top"><div><small data-taxi-state>正在前往目的地</small><h2>东川中心北区A口</h2></div><span class="ht-live">行程中</span></div><div class="ht-driver"><span>'+taxiIcon()+'</span><div><strong>东A·D6279</strong><small>'+car.name+' · 白色车辆</small></div><b>¥ '+car.fare.toFixed(2)+'</b></div><div class="ht-metrics"><div><strong data-taxi-distance></strong><small>距目的地</small></div><div><strong data-taxi-time></strong><small>当前时间</small></div><div><strong>16:54</strong><small>预计到达</small></div></div><div class="ht-track"><i data-taxi-progress></i></div><button class="ht-primary" data-action="taxi-share" '+(q.shared?'disabled':'')+'>'+icon('send')+(q.shared?'已分享给林晴':'分享行程给林晴')+'</button>':'<h2>今天想去哪里？</h2><div class="ht-address"><div><i></i><span>东川大学南门</span></div><div><i></i><input id="taxi-destination" placeholder="输入目的地" value="'+esc(q.query)+'" autocomplete="off" aria-label="目的地"></div></div><div id="taxi-suggestions"></div><div id="taxi-cars" '+(!q.destination?'hidden':'')+'><div class="ht-section"><strong>选择车型</strong><small>全程 11 公里</small></div>'+taxiCars.map(c=>'<button class="ht-car '+(q.car===c.id?'selected':'')+'" data-taxi-car="'+c.id+'"><span>'+taxiIcon()+'</span><span><strong>'+c.name+'</strong><small>'+c.detail+'</small></span><b>¥ '+c.fare+'</b><i></i></button>').join('')+'<button class="ht-primary" data-action="taxi-book">确认打车 · ¥ '+car.fare.toFixed(2)+'</button><p class="ht-payment-note">小金库支付 · 余额 ¥ '+Number(p.game.wallet).toFixed(2)+'</p></div>')+'</div></section>';
  const input=screen.querySelector('#taxi-destination');if(input)input.oninput=()=>{q.query=input.value;q.destination='';screen.querySelector('#taxi-cars').hidden=true;taxiSuggest(q)};
  if(onTrip)taxiPaint(q);else taxiSuggest(q);
 }
 function taxiSuggest(q){const host=screen.querySelector('#taxi-suggestions'),show=!q.destination&&/东川|中心/.test(q.query);if(host&&host.dataset.visible!==String(show)){host.dataset.visible=String(show);host.innerHTML=show?'<button class="ht-suggestion" data-taxi-destination><span>'+icon('map')+'</span><span><strong>东川中心北区A口</strong><small>东川中心 · 北区一楼入口</small></span><b>11 km</b></button>':''}}
 function taxiSelection(q){
  const input=screen.querySelector('#taxi-destination');if(input&&input.value!==q.query)input.value=q.query;
  const cars=screen.querySelector('#taxi-cars');if(cars)cars.hidden=!q.destination;
  screen.querySelectorAll('button[data-taxi-car]').forEach(el=>el.classList.toggle('selected',el.dataset.taxiCar===q.car));
  const car=taxiCars.find(c=>c.id===q.car)||taxiCars[0];taxiText(screen.querySelector('[data-action="taxi-book"]'),'确认打车 · ¥ '+car.fare.toFixed(2));taxiSuggest(q);
 }
 function taxiBoard(){
  const p=data(),q=taxiData(),car=taxiCars.find(c=>c.id===q.car);if(!p.taxiUnlocked||q.phase!=='booking'||q.destination!=='东川中心北区A口'||!car)return;
  const balance=Math.round(Number(p.game.wallet)*100);if(!Number.isSafeInteger(balance)||balance<car.fare*100)return toast('小金库余额不足');
  p.game.wallet=(balance-car.fare*100)/100;Object.assign(q,{phase:'riding',elapsed:0,fare:car.fare,paid:true,shared:false,asked:false,queue:[],replyPhase:null});p.system.time='16:32';taxiLast=0;taxiApp();statusPhone();
 }
 function taxiWrite(p,id,text,mine=false,location=false){
  const rows=p.messages.linqing??=[];if(rows.some(m=>m.id===id))return;
  rows.push({id,type:location?'location':'text',sender:mine?'me':'linqing',name:mine?p.profile.name:'林晴',text,gameDate:p.system.date,time:p.system.time,...(mine?{status:'read'}:{})});
  const c=p.contacts.find(c=>c.id==='linqing');if(c){c.preview=text;c.time=p.system.time;if(!mine&&!(view==='chat'&&active==='linqing'))c.unread=(c.unread||0)+1}
  if(!mine&&!(view==='chat'&&active==='linqing')){document.querySelector('#hospital-taxi-notice')?.remove();const el=document.createElement('div');el.id='hospital-taxi-notice';el.className='opening-message';el.dataset.ringtonePlayed='true';el.innerHTML='<button class="opening-body" data-action="taxi-message"><span>'+avatar('linqing')+'</span><span><small>讯息 · '+esc(p.system.time)+'</small><strong>林晴</strong><span>'+esc(text)+'</span></span></button>';document.querySelector('#phone').append(el);base.playNotificationSound('message',el)}
 }
 function taxiShare(){
  const p=data(),q=taxiData();if(!['riding','arrived'].includes(q.phase)||q.shared)return;
  if(!q.asked&&!q.proactiveShareAffectionGranted){
   const shopping=p.epilogueShopping??={phase:'done',node:'taxi-ready',index:2,affection:0,decisions:{},remaining:0};
   shopping.affection=(Number(shopping.affection)||0)+10;q.proactiveShareAffectionGranted=true;
  }
  q.shared=true;q.replyPhase=null;q.queue=[{id:'taxi-share-ok',text:'好'},{id:'taxi-share-soon',text:'我快到了'}];q.messageRemaining=messageSendDelay();
  taxiWrite(p,'taxi-player-share','行程分享：东川大学南门 → 东川中心北区A口 · 东A·D6279',true,true);document.querySelector('#hospital-taxi-notice')?.remove();chat('linqing');
 }
 function taxiBoardedReply(){
  const p=data(),q=taxiData();if(q.replyPhase!=='choice'||q.shared)return;
  q.replyPhase='answered';taxiWrite(p,'taxi-player-boarded','上了',true);q.queue=[{id:'taxi-share-request',text:'那把行程分享给我吧'}];q.messageRemaining=messageSendDelay();chat('linqing');
 }
 function taxiChoices(){
  const p=data(),q=p.taxi;if(!q||!p.taxiUnlocked)return;document.querySelector('#hospital-taxi-notice')?.remove();const composer=screen.querySelector('#composer');if(!composer)return;
  if(q.replyPhase==='choice-wait'||q.replyPhase==='choice'||q.queue?.length)composer.querySelectorAll('input,textarea,button').forEach(el=>el.disabled=true);
  if(q.replyPhase==='choice'&&!q.shared)composer.insertAdjacentHTML('beforebegin','<div class="zero-choices"><button data-action="taxi-boarded">上了</button></div>');
 }
 const taxiRoute=[[55,95],[115,95],[115,205],[230,205],[230,270],[285,270]];
 function taxiText(el,text){if(el&&el.textContent!==text)el.textContent=text}
 function taxiShareCard(){
  const q=data().taxi,car=taxiCars.find(c=>c.id===q?.car)||taxiCars[0],arrived=q?.phase==='arrived';
  return '<button type="button" class="ht-share-card" data-action="hospital-taxi" aria-label="查看分享的行程"><div class="ht-share-head"><span>'+taxiIcon()+'<b>行程分享</b></span><small data-taxi-share-state>'+(arrived?'已到达':'行程中')+'</small></div><div class="ht-share-map" aria-hidden="true"><svg viewBox="0 0 260 86"><rect width="260" height="86" fill="#edf2ec"/><g fill="#dce6da"><rect x="14" y="8" width="51" height="27" rx="5"/><rect x="109" y="50" width="48" height="28" rx="5"/><rect x="202" y="6" width="46" height="30" rx="5"/></g><path d="M0 43H260M83 0V86M179 0V86" fill="none" stroke="#fff" stroke-width="9"/><path d="M30 43H83V66H179V23H226" fill="none" stroke="#fff" stroke-width="9"/><path d="M30 43H83V66H179V23H226" fill="none" stroke="#648876" stroke-width="4" stroke-linejoin="round"/><circle cx="30" cy="43" r="5" fill="#fff" stroke="#648876" stroke-width="2"/><circle cx="226" cy="23" r="5" fill="#b17c91" stroke="#fff" stroke-width="2"/></svg></div><div class="ht-share-body"><div class="ht-share-stops"><div><i></i><span>东川大学南门</span></div><div><i></i><strong>东川中心北区A口</strong></div></div><div class="ht-share-vehicle"><strong>东A·D6279</strong><span>'+esc(car.name)+'</span></div><div class="ht-share-meta"><span>16:32 出发</span><span>全程 11 公里</span></div></div><div class="ht-share-foot"><span data-taxi-share-detail>'+(arrived?'已安全到达目的地':'预计 16:54 到达')+'</span><span>查看行程 '+icon('back')+'</span></div></button>';
 }
 function taxiPosition(progress){let distance=Math.min(1,Math.max(0,progress))*405;for(let i=1;i<taxiRoute.length;i++){const a=taxiRoute[i-1],b=taxiRoute[i],length=Math.hypot(b[0]-a[0],b[1]-a[1]);if(distance<=length)return [a[0]+(b[0]-a[0])*distance/length,a[1]+(b[1]-a[1])*distance/length];distance-=length}return taxiRoute.at(-1)}
 function taxiPaint(q){
  const progress=Math.min(1,q.elapsed/22000),remaining=Math.max(0,11-Math.floor(q.elapsed/1000)*.5),at=taxiPosition(progress);
  const car=screen.querySelector('g[data-taxi-car]'),position='translate('+at.join(' ')+')';if(car&&car.getAttribute('transform')!==position)car.setAttribute('transform',position);
  taxiText(screen.querySelector('[data-taxi-distance]'),remaining.toFixed(1)+' km');
  taxiText(screen.querySelector('[data-taxi-time]'),taxiClock(q));
  const bar=screen.querySelector('[data-taxi-progress]'),width=progress*100+'%';if(bar&&bar.style.width!==width)bar.style.width=width;
  if(q.phase==='arrived'){taxiText(screen.querySelector('[data-taxi-state]'),'已到达目的地');taxiText(screen.querySelector('.ht-live'),'已到达')}
  taxiText(screen.querySelector('[data-taxi-share-state]'),q.phase==='arrived'?'已到达':'行程中');
  taxiText(screen.querySelector('[data-taxi-share-detail]'),q.phase==='arrived'?'已安全到达目的地':'预计 16:54 到达');
  let badge=document.querySelector('#hospital-taxi-live');
  if(q.phase==='riding'&&view!=='hospital-taxi'){
   if(!badge){badge=document.createElement('button');badge.id='hospital-taxi-live';badge.dataset.action='hospital-taxi';badge.innerHTML=taxiIcon()+'<span></span><i></i>';document.querySelector('#phone').append(badge)}
   taxiText(badge.querySelector('span'),'距目的地 '+remaining.toFixed(1)+' km');badge.querySelector('i').style.width=progress*100+'%';
  }else badge?.remove();
  screen.querySelector('[data-action="hospital-taxi"] .app-icon')?.classList.toggle('ht-moving',q.phase==='riding');
 }
 let taxiOwner=null,taxiLast=0;
 function taxiTick(){
  if(!owner&&isVisible()&&!webEpilogueReady()){taxiLast=0;return}
  const current=root(),p=current?.story?.dayFourSleep?.phone;
  if(owner||!isVisible()||document.hidden||hospitalEndingId(current)!=='023'){taxiLast=0;document.querySelector('#hospital-taxi-live')?.remove();document.querySelector('#hospital-taxi-notice')?.remove();return}
  if(!p)return;
  if(!p.taxiUnlocked&&p.epilogueShopping?.phase==='done'&&p.epilogueShopping.node==='taxi-ready'){p.taxiUnlocked=true;context(()=>{if(view==='home')homePhone()});save()}
  captureEpilogueNodes();
  const q=p.taxi;if(!q||q.phase==='booking')return;
  if(taxiOwner!==current){taxiOwner=current;taxiLast=0}
  const now=Date.now(),delta=taxiLast?Math.min(500,now-taxiLast):0;taxiLast=now;const second=Math.floor(q.elapsed/1000);let changed=false,chatChanged=false;
  // Keep chat pacing active while the journey and game clock pause in Lin's chat.
  if(q.phase==='riding'&&!(view==='chat'&&active==='linqing')){q.elapsed=Math.min(22000,q.elapsed+delta);p.system.time=taxiClock(q);if(q.elapsed>=22000){q.phase='arrived';changed=true}if(Math.floor(q.elapsed/1000)!==second)changed=true}
  if(q.phase==='arrived'&&q.arrivalScene!=='done'){
   captureEpilogueNodes();
   if(q.arrivalScene==='playing'||!(view==='chat'&&active==='linqing')){if(!screen.querySelector('#hospital-taxi-arrival-cg'))context(()=>{statusPhone();taxiArrivalCG()});return}
  }
  if(q.phase==='arrived'&&q.arrivalScene==='done'&&p.epilogueMeeting?.phase!=='done'&&(p.epilogueOutfit||p.mall?.purchased?.knit||p.mall?.purchased?.skirt)){
   if(p.epilogueMeeting?.phase==='playing'||!(view==='chat'&&active==='linqing')){if(!screen.querySelector('#hospital-epilogue-meeting-cg'))context(epilogueMeetingCG);return}
  }
  if(p.epilogueMeeting?.phase==='done'&&p.epilogueGreeting?.phase!=='done'){
   const greeting=p.epilogueGreeting;
   if(greeting?.phase==='choice-wait'){greeting.remaining=Math.max(0,greeting.remaining-delta);if(!greeting.remaining){greeting.phase='choice';save()}}
   const host=screen.querySelector('#hospital-epilogue-greeting-cg');
   if(!greeting||!host||epilogueGreetingOwner!==greeting||host.dataset.stage!==greeting.node+':'+greeting.phase)context(epilogueGreetingCG);return;
  }
  if(p.epilogueMall?.phase==='done'&&mallSceneScript[p.epilogueMall.node]?.next){mallSceneGo(mallSceneScript[p.epilogueMall.node].next);return}
  if(p.epilogueGreeting?.phase==='done'&&p.epilogueMall?.phase!=='done'){
   captureEpilogueNodes();
   const mall=p.epilogueMall;
   if(mall&&endingStageTick(delta))return;
   if(mall&&['camera','social','post-wait'].includes(mall.phase)){
    if(mall.phase==='post-wait'){mall.remaining=Math.max(0,mall.remaining-delta);if(!mall.remaining){save();mallSceneGo('dinner-photo-done')}}
    return;
   }
   if(mall&&['choice-wait','brewing'].includes(mall.phase)){
    mall.remaining=Math.max(0,mall.remaining-delta);
    if(mall.phase==='brewing')mallOrderPaint(mall);
    if(!mall.remaining){if(mall.phase==='brewing'){mallSceneGo('tea-ready')}else{mall.phase='choice';save()}}
   }
   const host=screen.querySelector('#hospital-epilogue-mall-cg');
   if(!mall||!host||epilogueMallOwner!==mall||host.dataset.stage!==mall.node+':'+mall.phase)context(epilogueMallCG);return;
  }
  if(q.replyPhase==='choice-wait'){q.choiceRemaining=Math.max(0,q.choiceRemaining-delta);if(!q.choiceRemaining){q.replyPhase='choice';changed=true;chatChanged=true}}
  if(q.queue?.length){q.messageRemaining=Math.max(0,q.messageRemaining-delta);if(!q.messageRemaining){const row=q.queue.shift();taxiWrite(p,row.id,row.text);q.messageRemaining=messageSendDelay();changed=true;chatChanged=true}}
  if(q.elapsed>=6000&&!q.shared&&!q.asked){q.asked=true;q.replyPhase='choice-wait';q.choiceRemaining=messageSendDelay();taxiWrite(p,'taxi-boarded-question','你上车了吗？');changed=true;chatChanged=true}
  if(chatChanged)shoppingRefresh();
  if(changed){taxiText(document.querySelector('#status>span'),Number(p.system.date.slice(5,7))+'月'+Number(p.system.date.slice(8,10))+'日 '+p.system.time);taxiText(screen.querySelector('.home-clock'),p.system.time);save()}
  taxiPaint(q);
 }
 mobileNativeInterval(taxiTick,100);
 document.addEventListener('visibilitychange',()=>{taxiLast=0});

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
  phone.classList.remove('zero-immersive','survey-active','survey-notifying','late-death-active','report-death-active','pickup16-active');
  for(const el of document.querySelectorAll('.opening-message,#identity-reward,#notebook-collected,#d4-delegation-notice'))if(!['hospital-reunion-notice','hospital-shopping-notice','hospital-discharge-notice','hospital-gift-notice','hospital-taxi-notice','hospital-ending-message'].includes(el.id))el.remove();
  for(const el of [earlySleepButton,midnightContinue])el.hidden=true;
  const dock=document.querySelector('#dock');if(dock.childNodes.length)dock.innerHTML='';syncMessageTabs();refreshPhoneBack();syncCall();syncMomentReplies();syncWallDreamReply();cgExitSync();
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
 function statusPhone(){ordinaryPhoneUI.status();const clock=document.querySelector('#status>span');if(clock)clock.textContent=Number(data().system.date.slice(5,7))+'月'+Number(data().system.date.slice(8,10))+'日 '+data().system.time}
 function homePhone(){
  ordinaryPhoneUI.home();statusPhone();updateHomeDaylight();replaceHomeSymbols();
  if(hospitalEndingId(root())==='023'&&data().epilogueCalendar)screen.querySelector('.app-grid')?.insertAdjacentHTML('beforeend','<button type="button" class="app-button" data-action="epilogue-bgm"><span class="app-icon lilac"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 17V5l11-2v12M9 8l11-2"/><ellipse cx="6" cy="17" rx="3" ry="2.5"/><ellipse cx="17" cy="15" rx="3" ry="2.5"/></svg></span><span>背景音乐</span></button>');
  if(data().epilogueMall?.cameraUnlocked)screen.querySelector('.app-grid')?.insertAdjacentHTML('beforeend','<button type="button" class="app-button" data-action="dinner-camera"><span class="app-icon lilac">'+dinnerCameraIcon()+'</span><span>相机</span></button>');
  if(data().taxiUnlocked)screen.querySelector('.app-grid')?.insertAdjacentHTML('beforeend','<button type="button" class="app-button" data-action="hospital-taxi"><span class="app-icon sand">'+taxiIcon()+'</span><span>打车</span></button>');
  if(data().shoppingMallUnlocked)screen.querySelector('.app-grid')?.insertAdjacentHTML('beforeend','<button type="button" class="app-button" data-action="hospital-shopping-mall"><span class="app-icon rose">'+mallLogo()+'</span><span>购物商城</span></button>');
  if(!data().awakeningWallSeen)screen.querySelector('[data-app="wall"] .app-icon')?.insertAdjacentHTML('beforeend','<i class="hospital-wall-dot" aria-label="校园墙有新内容"></i>');
  screen.querySelector('.home-footnote').innerHTML='<button type="button" data-hospital-menu>点击此处返回主页</button>';
  const c=data().motherCall;if(c.phase==='waiting')c.dueAt??=Date.now()+3000;
 }
 function message(m,c){
  if(m.type==='time')return '';
  let html=ordinaryPhoneUI.renderMessage(m,c);
  if(m.epilogueSticker)html=ordinaryPhoneUI.renderMessage({...m,text:'EPILOGUE_BLUSH_STICKER'},c).replace('EPILOGUE_BLUSH_STICKER',epilogueSticker());
 const rows=state.messages[c.id],index=rows.indexOf(m);
  if(c.id==='linqing'&&m.id==='taxi-player-share')html=ordinaryPhoneUI.renderMessage({...m,type:'text',text:'HOSPITAL_TAXI_CARD'},c).replace('HOSPITAL_TAXI_CARD',()=>taxiShareCard()).replace(/class="message(?=[\s"])/,'class="message ht-share-message');
  if(c.id==='epilogue-mother'&&(m.id==='epilogue-mother-transfer'||m.id==='epilogue-mother-receipt')){
   const receipt=m.id==='epilogue-mother-receipt';
   const mark='<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="13"/>'+(receipt?'<path d="m10 16 4 4 8-8"/>':'<path d="M9 12h14m-4-4 4 4-4 4M23 20H9m4-4-4 4 4 4"/>')+'</svg>';
   const card='<div class="hp-transfer-card '+(receipt?'is-receipt':'')+'"><div class="hp-transfer-main">'+mark+'<div><strong><span>¥</span> '+Number(m.amount||0).toFixed(2)+'</strong><small>'+(receipt?'已收款':'已被领取')+'</small></div></div><div class="hp-transfer-foot"><span>'+(receipt?'转账收款':'转账')+'</span><span>小金库</span></div></div>';
   html=ordinaryPhoneUI.renderMessage({...m,type:'text',text:'HOSPITAL_TRANSFER_CARD'},c).replace('HOSPITAL_TRANSFER_CARD',()=>card).replace(/class="message(?=[\s"])/,'class="message hp-transfer-message');
  }
  if(c.id==='epilogue-mother'&&m.sender!=='me')html=html.replace('class="message ', 'class="message hospital-mother-message ');

  html=html.replace(/(<div class="message-meta">)[^<]*/g,'$1').replace(/<div class="message-meta">\s*<\/div>/g,'');
  html=html.replace(/<div class="message(?=[\s"])([^"]*)"/,(_,classes)=>'<div class="message'+classes+'" data-skin-sender="'+esc(JSON.stringify([m.sender||c.avatar,m.name||'']))+'" data-skin-time="'+esc(m.time||'')+'" data-skin-date="'+esc(m.gameDate||m.date||'')+'" data-skin-read="'+(!c.members&&m.sender==='me'&&m.status==='read')+'"');
  if(messageStartsGroup(rows,index))html='<div class="divider message-group-time">'+esc(m.id==='reality-lin-friend'?'2045年8月28日 04:31':messageTimeLabel(m))+'</div>'+html;
  return html;
 }
 function contactRowPhone(c){
  if(c.directoryOnly)return '';
  const latest=latestConversationMessage(c);
  return ordinaryPhoneUI.contactRow(latest?{...c,preview:latest.text??c.preview,time:messageTimeLabel({...latest,time:latest.time||c.time})}:c);
 }
 function chat(id){
  if(id==='epilogue-father')return;
  if(!state.contacts.some(c=>c.id===id))return;
  ordinaryPhoneUI.openChat(id);syncMessageTheme();
  decorateContactAvatars(screen);
  if(id==='linqing'){shoppingChoices();giftChoices();taxiChoices();endingChatChoices()}
  if(id==='room408')dischargeChat();
  const q=data().reunionHope;
  if(id==='zhouhe'&&hospitalEndingId(root())==='021'&&q&&['notified','choice','replying','replied'].includes(q.phase)){
   document.querySelector('#hospital-reunion-notice')?.remove();
   if(q.phase==='notified')q.phase='choice';
   const composer=screen.querySelector('#composer');
   if(composer){composer.querySelectorAll('button,textarea,input').forEach(el=>el.disabled=true);if(q.phase==='choice')composer.insertAdjacentHTML('beforebegin','<div class="zero-choices"><button data-hospital-reunion-choice="0">嗯，我们一起等她</button><button data-hospital-reunion-choice="1">她会回来的</button></div>')}
  }
 }
 function contactProfile(id){
  if(id==='epilogue-father')return;
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
 function contacts(){
  messageContacts();
  const row=screen.querySelector('[data-contact="epilogue-father"]')?.closest('.address-friend');
  if(row){const button=row.querySelector('[data-contact]');button.disabled=true;button.style.cursor='default';row.querySelector('.address-detail')?.remove()}
 }
 const momentPostBindings=new WeakMap();
 function moments(id){
  if(id){if(!state.contactProfiles[id])return;state.messageProfile=id;linMoments()}
  else {
   messageMoments();
   const heading=screen.querySelector('.feed-heading');
   const posts=Array.isArray(state.hospitalMoments)?state.hospitalMoments:[];
   heading?.insertAdjacentHTML('afterend',posts.map((p,i)=>'<article class="friends-moment" data-hospital-moment="'+i+'">'+avatar('me')+'<div class="friend-post-content"><button type="button" class="friend-post-name">'+esc(state.profile.name)+'</button><p class="lin-moment-text">'+esc(p.text)+'</p>'+(p.photo?dinnerPhotoMarkup(p.photo):'')+'<time>'+esc(momentDate(p.date))+'</time><div class="lin-existing-replies">'+p.replies.map(r=>dinnerMomentReplyMarkup(p,r)).join('')+'</div></div></article>').join(''));
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
    (p.replies??=[]).push({...(r.id?{id:r.id}:{}),name:r.name,text:r.text,...(r.replyTo?{replyTo:r.replyTo}:{})});
    pending.shift();changed=true;
    if(pending[0])pending[0].at=now+(p.replyInterval===2000?2000:pending[0].name==='林晴'?3000:1000);
   }
   if(pending[0])due=Math.min(due,pending[0].at);
  }
  if(changed){
   save();
   if(view==='message-moments')for(const el of screen.querySelectorAll('[data-hospital-moment]')){
    const p=momentPostBindings.get(el),replies=el.querySelector('.lin-existing-replies');
    if(p&&phone.hospitalMoments.includes(p)&&replies)replies.insertAdjacentHTML('beforeend',p.replies.slice(replies.children.length).map(r=>dinnerMomentReplyMarkup(p,r)).join(''));
   }
  }
  if(Number.isFinite(due))momentReplyTimer=window.mobileNativeTimeout(()=>{momentReplyTimer=null;if(root()===progress&&isVisible())syncMomentReplies()},Math.max(0,due-Date.now()));
 }
 function composeTextMoment(){
  composeMoment();screen.querySelector('[data-action="moment-photo"]')?.remove();
  const p=data(),q=p.epilogueMall;
  if(q?.photoTaken&&!q.dinnerPosted){const photo=p.album?.find(item=>item.id===dinnerPhotoId);screen.querySelector('.moment-compose').insertAdjacentHTML('beforeend',dinnerPhotoMarkup(photo));}

 }
 function sendTextMoment(){
  if(view!=='moment-compose')return;
  const text=String(screen.querySelector('#moment-draft')?.value||'').trim();
  if(sendDinnerMoment(text))return;
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
 const wallIdentityAvatars=['forum_f_01','forum_f_rabbit','forum_m_cat'];
 let wallIdentityPending=null,wallDreamTimer=null;
 function wallName(row){return row.author==='me'?(row.name&&row.avatarId?row.name:state.forumIdentity?.name||'匿名用户'):row.name}
 function wallAvatar(row){
  const avatarId=row.avatarId||(row.author==='me'?state.forumIdentity?.avatarId:null);
  return avatarId?'<span class="avatar" data-avatar-id="'+esc(avatarId)+'"><img src="'+esc(forumAvatarLibrary.src(avatarId))+'" alt="'+esc(wallName(row))+'"></span>':forumAvatarPhone(row.author,wallName(row),row.gender);
 }
 function wallIdentityReady(){const identity=data().forumIdentity;return !!(identity?.name?.trim()&&wallIdentityAvatars.includes(identity.avatarId))}
 function withWallIdentity(publish,restoreDraft,confirmLabel='确认并发布'){
  const phone=data(),identity=phone.forumIdentity;
  if(identity?.name?.trim()&&wallIdentityAvatars.includes(identity.avatarId)){publish();return}
  const pending=wallIdentityPending={phone,publish,restoreDraft};
  sheet('设置校园墙身份','<form id="hospital-wall-identity" class="post-form"><label>校园墙昵称<input name="nickname" aria-label="校园墙匿名昵称" placeholder="取一个只在校园墙使用的昵称" maxlength="30" required></label><fieldset class="hospital-wall-avatar-field"><legend>选择头像</legend><div class="hospital-wall-avatars">'+wallIdentityAvatars.map((id,i)=>'<label><input type="radio" name="portrait" value="'+id+'" required aria-label="头像'+(i+1)+'"><img src="'+esc(forumAvatarLibrary.src(id))+'" alt=""></label>').join('')+'</div></fieldset><button class="pill-button forum-publish" type="submit" disabled>确认并发布</button><button class="pill-button hospital-wall-cancel" type="button" data-action="hospital-wall-identity-cancel">取消</button></form>');
  const form=document.querySelector('#hospital-wall-identity');
  form.closest('.sheet').classList.add('forum-compose-sheet');
  form.querySelector('[type="submit"]').textContent=confirmLabel;
  const update=()=>{form.querySelector('[type="submit"]').disabled=!form.elements.nickname.value.trim()||!wallIdentityAvatars.includes(form.elements.portrait.value)};
  form.elements.nickname.oninput=update;for(const radio of form.querySelectorAll('[name="portrait"]'))radio.onchange=update;
  form.onsubmit=e=>{e.preventDefault();if(wallIdentityPending!==pending||data()!==phone)return;
   const name=form.elements.nickname.value.trim(),avatarId=form.elements.portrait.value;if(!name||!wallIdentityAvatars.includes(avatarId))return;
   phone.forumIdentity={name,avatarId};wallIdentityPending=null;closeSheet();publish();
  };
 }
 function cancelWallIdentity(){const pending=wallIdentityPending;wallIdentityPending=null;closeSheet();if(pending?.phone===data())pending.restoreDraft?.()}
 function wallDraft(key,value){const drafts=state.forumDrafts??={};if(value!==undefined)drafts[key]=value;return drafts[key]||''}
 function sharedDreamIntent(text){
  const value=text.replace(/\s+/g,'');
  // Reject explicit denials before looking for shared-memory synonyms.
  if(/(?:没|未|不曾|从未|没有|不)(?:有|曾|也|再|怎么|太|还|真的|亲身|过|能|敢)*?(?:经历|遇到|碰到|梦到|梦见|做(?:过|了)?.{0,8}梦|记得|记住|记起|印象)|不(?:是|算).{0,4}(?:我也|经历过)|忘(?:了|记)/.test(value))return false;
  return /(?:我|咱|我们|俺也).{0,10}(?:经历|遇到|碰到|梦到|梦见|做(?:过|了)?.{0,8}梦|记得|记起|印象)|(?:也|同样).{0,5}(?:经历|遇到|碰到|梦到|梦见|做(?:过|了)?.{0,8}梦|记得|记起)|(?:不是|并非|不只是|不止是|不算是)梦|这.{0,3}(?:真的发生过|是真实的)|^(?:也)?(?:经历过|遇到过|碰到过|梦到过|梦见过|也记得|我也是)[了的。！!…]*$/.test(value);
 }
 function queueWallDreamReply(target,text){
  const phone=data();if(target.post.id!=='reality-accident-4'||target.comment.id!=='reality-accident-dream'||phone.forumDreamInteraction)return;
  const id='reality-accident-dream-response';
  if(target.parent.replies.some(r=>r.id===id)){phone.forumDreamInteraction={status:'done'};return}
  const realName=root().profile.name;
  phone.forumDreamInteraction={status:'pending',dueAt:Date.now()+1000,reply:{id,author:'reality-accident-dream-author',name:'命运你阿帕次',gender:'female',text:sharedDreamIntent(text)?'你是谁？你是'+realName+'吗？':'我总觉得这一切不是梦',replyTo:phone.forumIdentity.name,date:phone.system.date,time:phone.system.time,likes:0,replies:[]}};
 }
 function syncWallDreamReply(){
  if(wallDreamTimer!==null){clearTimeout(wallDreamTimer);wallDreamTimer=null}
  if(!isVisible()||document.hidden)return;
  const progress=root(),phone=data(),q=phone.forumDreamInteraction;if(q?.status!=='pending')return;
  wallDreamTimer=window.mobileNativeTimeout(()=>{
   wallDreamTimer=null;if(root()!==progress||!isVisible()||document.hidden)return;
   context(()=>{
    if(data()!==phone||q.status!=='pending')return;
    const parent=phone.forumPosts.find(p=>p.id==='reality-accident-4')?.replies.find(r=>r.id==='reality-accident-dream');if(!parent)return;
    if(!parent.replies.some(r=>r.id===q.reply.id))parent.replies.push(structuredClone(q.reply));
    q.status='done';if(!phone.expanded.includes(parent.id))phone.expanded.push(parent.id);
    if(view==='post'&&active==='reality-accident-4'&&!document.querySelector('#overlay .sheet')){
     const input=screen.querySelector('#hospital-reply-form input');if(input)wallDraft('post:'+active,input.value);
     post(active);
    }
   });
  },Math.max(0,(Number.isFinite(q.dueAt)?q.dueAt:Date.now()+1000)-Date.now()));
 }
 function writeWallPost(){
  if(!wallIdentityReady())return withWallIdentity(writeWallPost,null,'确认并继续发帖');
  ordinaryPhoneUI.writePost();
  const form=document.querySelector('#post-form'),draft=state.forumPostDraft||{};
  for(const key of ['title','body','category'])if(draft[key]!==undefined)form.elements[key].value=draft[key];
  const remember=()=>{state.forumPostDraft={title:form.elements.title.value,body:form.elements.body.value,category:form.elements.category.value}};
  for(const key of ['title','body','category']){form.elements[key].oninput=remember;form.elements[key].onchange=remember}
  form.onsubmit=e=>{e.preventDefault();remember();const pending={...state.forumPostDraft};if(!pending.title.trim()||!pending.body.trim())return;
   let sent=false;withWallIdentity(()=>{if(sent)return;sent=true;
    state.forumPosts.unshift({id:'reality-post-'+storyRunId(),author:'me',name:state.forumIdentity.name,avatarId:state.forumIdentity.avatarId,preserveForumNames:true,...pending,title:pending.title.trim(),body:pending.body.trim(),date:state.system.date,time:state.system.time,likes:0,replies:[]});
    delete state.forumPostDraft;closeSheet();forumPhone('全部');toast('已发布');
   },writeWallPost);
  };
 }
 function forumPhone(category=null){
  if(['全部','校园日常','互助问答','失物招领'].includes(category)){
   wallBrowsePosition=null;wallPositionRestoring=true;wallPositionFrame++;
   forumCategory=category;
  }
  state.awakeningWallSeen=true;
  state.forumPosts.sort((a,b)=>(b.date+' '+b.time).localeCompare(a.date+' '+a.time));ordinaryPhoneUI.forum();screen.querySelector('[data-forum-category="校园新规"]')?.remove();
  if(!wallIdentityReady())screen.querySelector('.page-head')?.insertAdjacentHTML('afterend','<button type="button" class="hospital-wall-identity-entry" data-action="hospital-wall-identity-open"><strong>设置校园墙身份</strong><span>填写匿名昵称，选择你的头像 ›</span></button>');
  for(const card of screen.querySelectorAll('[data-post]')){
   const p=state.forumPosts.find(post=>post.id===card.dataset.post),count=card.querySelector('.post-foot span:nth-child(2)');
   if(p&&count)count.innerHTML=icon('chat')+' '+(p.replies||[]).reduce((sum,r)=>sum+1+(r.replies?.length||0),0)+' 回复';
   if(p&&(p.author==='me'||p.avatarId)){const author=card.querySelector('.post-author');if(author)author.innerHTML=wallAvatar(p)+'<span>'+esc(wallName(p))+'<small>'+esc(wallDateLabel(p))+' · '+esc(p.category)+'</small></span>'}
  }
 }
 function forumAvatarPhone(id,name,gender){
  const account=forumAvatarLibrary.accounts[id],pool=forumAvatarLibrary.pools[gender||account?.gender||'neutral'];
  let hash=0;for(const ch of String(id))hash=(hash*31+ch.charCodeAt(0))>>>0;const image=pool[hash%pool.length];
  return '<span class="avatar" data-forum-account="'+esc(id)+'" data-avatar-id="'+image+'"><img src="'+forumAvatarLibrary.src(image)+'" alt="'+esc(name||'匿名用户')+'"></span>';
 }
 function commentMarkupPhone(c,parent=null){
  return '<div class="rule-comment '+(parent?'nested-comment':c.pinned?'aw-pinned-comment':'')+'">'+wallAvatar(c)+'<div class="comment-content"><div class="comment-heading"><strong>'+esc(wallName(c))+'</strong><button data-hospital-comment-like="'+c.id+'" aria-pressed="'+!!c.liked+'">'+(c.liked?'♥':'♡')+' '+(c.likes||0)+'</button></div>'+(!parent&&c.pinned?'<small class="aw-comment-pin">置顶回复</small>':'')+'<p>'+(c.replyTo?'回复 '+esc(c.replyTo)+'：':'')+esc(c.text)+'</p><small class="wall-comment-time">'+esc(wallDateLabel(c))+'</small><button class="aw-reply-button" data-hospital-reply="'+c.id+'">回复</button>'+(!parent&&c.replies?.length?'<button class="thread-toggle" data-hospital-thread="'+c.id+'">'+(state.expanded.includes(c.id)?'收起回复':'展开 '+c.replies.length+' 条回复')+'</button>'+(state.expanded.includes(c.id)?c.replies.map(r=>commentMarkupPhone(r,c.id)).join(''):''):'')+'</div></div>';
 }
 function post(id){
  const p=state.forumPosts.find(p=>p.id===id);if(!p)return;
  if(!wallIdentityReady())return withWallIdentity(()=>post(id),null,'确认并查看帖子');
  view='post';active=id;closeSheet();
  const numberRows=(rows,prefix)=>rows.forEach((r,i)=>{r.id??=prefix+'-'+i;r.replies??=[];numberRows(r.replies,r.id)});numberRows(p.replies,p.id);
  screen.innerHTML='<section class="app-page forum-page">'+header('帖子详情','forum')+'<article class="post-detail"><div class="post-author">'+wallAvatar(p)+'<span>'+esc(wallName(p))+'<small>'+esc(wallDateLabel(p))+'</small></span></div><h2>'+esc(p.title)+'</h2><p>'+esc(p.body)+'</p><button class="pill-button '+(p.liked?'liked':'')+'" data-like="'+p.id+'">'+(p.liked?'♥ 已赞':'♡ 点赞')+' '+p.likes+'</button></article><h3 class="reply-title">全部回复 · '+p.replies.reduce((sum,r)=>sum+1+(r.replies?.length||0),0)+'</h3>'+p.replies.map(r=>commentMarkupPhone(r)).join('')+'<form class="rule-comment-form wall-unified-composer" id="hospital-reply-form"><input name="reply" aria-label="回复内容" placeholder="友善地说两句…" required maxlength="500"><button class="pill-button">回复</button></form></section>';
  const form=screen.querySelector('#hospital-reply-form'),key='post:'+id;form.elements.reply.value=wallDraft(key);form.elements.reply.oninput=e=>wallDraft(key,e.target.value);
  form.onsubmit=e=>{e.preventDefault();const raw=form.elements.reply.value;if(!raw.trim())return;wallDraft(key,raw);let sent=false;
   withWallIdentity(()=>{if(sent)return;sent=true;p.replies.push(newReply(raw));wallDraft(key,'');post(id)},()=>post(id));
  };
 }
 function newReply(text,replyTo=null){return {id:'reality-reply-'+storyRunId(),author:'me',name:state.forumIdentity.name,avatarId:state.forumIdentity.avatarId,text,date:data().system.date,time:data().system.time,replyTo,likes:0,replies:[]}}
 function findComment(id){const p=state.forumPosts.find(p=>p.id===active);for(const c of p?.replies||[]){if(c.id===id)return {post:p,comment:c,parent:c};const r=c.replies?.find(r=>r.id===id);if(r)return {post:p,comment:r,parent:c}}}
 function replyTo(id){
  const target=findComment(id);if(!target)return;
  if(!wallIdentityReady())return withWallIdentity(()=>replyTo(id),null,'确认并继续回复');
  sheet('回复评论','<form id="hospital-nested-reply" class="post-form"><div class="hospital-reply-reference"><strong>'+esc(wallName(target.comment))+'</strong><p>'+esc(target.comment.text)+'</p></div><textarea name="reply" aria-label="回复内容" placeholder="写下你的回复…" required maxlength="500"></textarea><div class="hospital-reply-footer"><small>回复给 '+esc(wallName(target.comment))+'</small><button type="submit" class="pill-button forum-publish">发送回复</button></div></form>');
  const form=document.querySelector('#hospital-nested-reply'),key='comment:'+id;
  form.closest('.sheet').classList.add('forum-compose-sheet','hospital-reply-sheet');
  form.elements.reply.value=wallDraft(key);
  const updateReply=()=>{wallDraft(key,form.elements.reply.value);form.querySelector('[type="submit"]').disabled=!form.elements.reply.value.trim()};
  form.elements.reply.oninput=updateReply;updateReply();
  form.onsubmit=e=>{e.preventDefault();const raw=form.elements.reply.value,text=raw.trim();if(!text)return;wallDraft(key,raw);let sent=false;
   withWallIdentity(()=>{if(sent)return;sent=true;target.parent.replies.push(newReply(raw,wallName(target.comment)));queueWallDreamReply(target,text);wallDraft(key,'');if(!state.expanded.includes(target.parent.id))state.expanded.push(target.parent.id);post(target.post.id)},()=>replyTo(id));
  };
 }
 function shopPhone(){ordinaryPhoneUI.shop();screen.querySelector('.shop-nav span').textContent='校园自营 · 到店自取 / 无人机派送'}
 function checkoutPhone(){
  const rows=ordinaryPhoneUI.cartLines(),total=ordinaryPhoneUI.cartTotal();if(!rows.length)return toast('请先选择商品');
  sheet('确认订单','<label class="setting-row">配送方式<select id="hospital-delivery"><option'+(state.delivery==='到店自取'?' selected':'')+'>到店自取</option><option'+(state.delivery==='无人机派送'?' selected':'')+'>无人机派送</option></select></label>'+rows.map(p=>'<div class="cart-line"><span>'+esc(p.name)+' × '+p.quantity+'</span><strong>¥ '+money(p.price*p.quantity)+'</strong></div>').join('')+'<div class="order-total">实付款 <strong>¥ '+money(total)+'</strong></div><p>钱包支付 · 余额 '+state.game.wallet.toFixed(2)+' 元</p><button class="primary" data-action="pay" '+(total>Math.round(state.game.wallet*100)?'disabled':'')+'>确认支付</button><button class="secondary" data-action="cart">返回购物袋</button>');
  document.querySelector('#hospital-delivery').onchange=e=>{state.delivery=e.target.value};
 }
 function payPhone(){
  const lines=ordinaryPhoneUI.cartLines(),total=ordinaryPhoneUI.cartTotal(),balance=Math.round(state.game.wallet*100);if(!lines.length||total<=0||total>balance)return;
  state.orders.unshift({id:'REAL-'+storyRunId(),time:data().system.date+' '+data().system.time,total,lines:structuredClone(lines),delivery:state.delivery,status:state.delivery==='到店自取'?'待自提':'待配送'});state.game.wallet=(balance-total)/100;state.cart={};shopPhone();
  sheet('支付成功','<div class="payment-success">'+icon('check')+'<h3>支付成功</h3><p>'+state.delivery+'</p><strong>¥ '+money(total)+'</strong></div><button class="primary" data-action="orders">查看订单</button><button class="secondary" data-action="close">继续逛逛</button>');
 }
 function ordersPhone(){ordinaryPhoneUI.orders();const empty=screen.querySelector('.empty-app');if(empty)empty.innerHTML='暂无订单';screen.querySelectorAll('.order-card').forEach((el,i)=>{el.querySelector('.post-foot span:last-child').textContent=state.orders[i].status})}
 function wallet(){view='wallet';active=null;renderCampusWallet();const empty=screen.querySelector('.wallet-history-empty strong');if(empty)empty.textContent='暂无消费记录'}
 function notes(){
  view='notes';active=null;screen.innerHTML=ordinaryPhoneUI.notebookPageMarkup();
  const [recordDate,...title]=medicalAidNote.title.split('｜');
  screen.querySelector('.notebook-intro').insertAdjacentHTML('afterend','<div class="fa-clues"><article class="notebook-paper"><small>'+esc(recordDate)+'</small><h3>【'+esc(title.join('｜'))+'】</h3>'+medicalAidNote.text.split('\n\n').map(text=>'<p>'+esc(text)+'</p>').join('')+'</article></div>');
  screen.querySelector('.notebook-paper-foot span').textContent='自动保存';
  screen.querySelector('#note-text').oninput=e=>{state.note=e.target.value};
 }
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
  if(id==='hospital-bgm')return bgmApp();
  if(id==='hospital-epilogue-finish')return epilogueFinishView();
  if(id==='hospital-dinner-camera')return dinnerCamera();
  if(id==='hospital-epilogue-mall-cg')return epilogueMallCG();
  if(id==='hospital-epilogue-greeting-cg')return epilogueGreetingCG();
  if(id==='hospital-epilogue-meeting-cg')return epilogueMeetingCG();
  if(id==='hospital-taxi-arrival-cg')return taxiArrivalCG();
  if(id==='hospital-shopping-mall')return shoppingMall();
  if(id==='hospital-taxi')return taxiApp();
  closeSheet();if(id==='home')return homePhone();if(id==='messages')return chatListPhone();if(id==='message-contacts')return contacts();if(id==='message-moments')return moments();
  if(id==='phone')return telephone();
  if(id==='wall')return forumPhone();if(id==='post')return post(active);if(id==='supply')return shopPhone();if(id==='orders')return ordersPhone();if(id==='wallet')return wallet();if(id==='notes')return notes();if(id==='calendar')return calendar();if(id==='campus')return campus();homePhone();
 }
 function back(){if(document.querySelector('#overlay .sheet'))return closeSheet();if(view==='chat'||view.startsWith('message-'))return navigate('messages');if(view==='post')return navigate('wall');if(view==='orders')return navigate('supply');navigate('home')}
 function click(button){
  const d=button.dataset;if(button.disabled)return;
  if(d.action==='epilogue-bgm')return bgmApp();
  if(d.action==='epilogue-bgm-toggle'){bgmSettings.enabled=!bgmSettings.enabled;saveBgmSettings();if(!bgmSettings.enabled)epilogueMusic?.pause();bgmApp();return}
  if(d.action==='epilogue-ending-chat')return chat('linqing');
  if(d.endingPhoneChoice!==undefined)return endingPhoneChoose(Number(d.endingPhoneChoice));
  if(d.action==='epilogue-finish-close'){const q=data().epilogueMall;if(q?.phase==='ending'){q.phase='done';q.endingAcknowledged=true;homePhone();save()}return}
  if(d.action==='dinner-camera')return dinnerCamera();
  if(d.action==='dinner-camera-back')return dinnerCameraBack();
  if(d.action==='dinner-shutter')return dinnerShoot();
  if(d.action==='dinner-album')return dinnerAlbum();
  if(d.dinnerReply)return dinnerReply(d.dinnerReply);
  if(button.hasAttribute('data-discharge-open'))return chat('room408');
  if(d.dischargeChoice!==undefined)return dischargeChoose(Number(d.dischargeChoice));
  if(d.action==='hospital-shopping-mall')return shoppingMall();
  if(d.action==='hospital-taxi')return taxiApp();
  if(d.taxiDestination!==undefined){const q=taxiData();if(q.phase!=='booking')return;q.destination='东川中心北区A口';q.query=q.destination;return taxiSelection(q)}
  if(d.taxiCar){const q=taxiData();if(q.phase!=='booking')return;q.car=d.taxiCar;return taxiSelection(q)}
  if(d.action==='taxi-book')return taxiBoard();
  if(d.action==='taxi-share')return taxiShare();
  if(d.action==='taxi-boarded')return taxiBoardedReply();
  if(d.action==='taxi-message')return chat('linqing');
  if(d.mallProduct)return mallSelect(d.mallProduct);
  if(d.mallPay)return mallPay(d.mallPay);
  if(d.giftChoice!==undefined)return giftChoose(Number(d.giftChoice));
  if(button.hasAttribute('data-gift-open'))return chat('linqing');
  if(d.action==='hospital-wall-identity-cancel')return cancelWallIdentity();
  if(d.action==='hospital-wall-identity-open')return withWallIdentity(forumPhone,null,'确认保存身份');
  if(d.action==='write-post')return writeWallPost();
  if(d.action==='moment-compose')return composeTextMoment();
  if(d.action==='moment-send')return sendTextMoment();
  if(d.action==='moment-photo')return;

  if(button.hasAttribute('data-hospital-shopping-open'))return chat('linqing');
  if(d.shoppingChoice!==undefined)return shoppingChoose(d.shoppingNode,Number(d.shoppingChoice));
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
  if(d.forumCategory)return forumPhone(d.forumCategory);if(d.shopCategory){shopCategory=d.shopCategory;return shopPhone()}
  if(d.like)return toggleWallLike(state.forumPosts.find(p=>p.id===d.like));
  if(d.hospitalCommentLike){const r=findComment(d.hospitalCommentLike);if(r){toggleWallLike(r.comment);post(active)}return}
  if(d.hospitalReply)return replyTo(d.hospitalReply);
  if(d.hospitalThread){state.expanded=state.expanded.includes(d.hospitalThread)?state.expanded.filter(id=>id!==d.hospitalThread):[...state.expanded,d.hospitalThread];return post(active)}
  if(d.qty){const n=(state.cart[d.qty]||0)+Number(d.delta);if(n<0||n>99||!C.products.some(p=>p.id===d.qty))return;const cart=!!document.querySelector('[aria-label="购物袋"]');state.cart[d.qty]=n;shopPhone();if(cart)ordinaryPhoneUI.cartSheet();return}
  if(d.calendarShift){const [y,m]=calendarMonth.split('-').map(Number);calendarMonth=new Date(Date.UTC(y,m-1+Number(d.calendarShift),1)).toISOString().slice(0,7);return calendar()}
  if(d.calendarDate){calendarSelected=d.calendarDate;return calendar()}
  if(d.walletOrder){const order=state.orders.find(o=>o.id===d.walletOrder);if(order)sheet('消费详情','<div class="wallet-receipt"><h3>−'+money(order.total)+' 元</h3><p>'+esc(order.time)+'</p><p>'+esc(order.delivery)+'</p></div>');return}
  const commands={home:homePhone,'phone-desktop':homePhone,list:()=>navigate('messages'),'message-conversations':()=>navigate('messages'),'message-contacts':contacts,'message-moments':()=>moments(),close:closeSheet,forum:forumPhone,'write-post':writeWallPost,shop:shopPhone,cart:ordinaryPhoneUI.cartSheet,checkout:checkoutPhone,pay:payPhone,orders:ordersPhone,'calendar-today':()=>{calendarMonth=data().system.date.slice(0,7);calendarSelected=data().system.date;calendar()},'save-note':()=>{state.note=screen.querySelector('#note-text').value;toast('备忘录已保存')},profile:messageActions.profile,'zero-lin-profile':()=>contactProfile('linqing'),'chat-options':()=>{messageActions['chat-options']();decorateContactAvatars(document.querySelector('#overlay'))},'new-chat':contacts,'identifier-search':contacts};
  if(commands[d.action])return commands[d.action]();if(messageActions[d.action])return messageActions[d.action]();if(d.action==='message-moments-lin'){state.messageProfile='linqing';return enterContactMoments(linMoments)}if(['voice-call','video-call'].includes(d.action))sheet(d.action==='voice-call'?'语音通话':'视频通话','<p>暂未连接通话服务。</p><button class="primary" data-action="close">返回聊天</button>');
 }
 window.hospitalPhoneInput=event=>{
  if(!isVisible())return;
  if(event.target.closest('#cg-recovery-home,#cg-recovery-confirm'))return;
  const button=event.target.closest('button');
  if(['calendar20','calendar22'].includes(data().epilogueGift?.phase)){event.preventDefault();event.stopImmediatePropagation();return}
  if(data().epilogueDischarge?.phase==='cg'){if(event.target.closest('#hospital-discharge-cg'))return;event.preventDefault();event.stopImmediatePropagation();return}
  if(data().taxi?.arrivalScene==='playing'){if(event.target.closest('#hospital-taxi-arrival-cg'))return;event.preventDefault();event.stopImmediatePropagation();return}
  if(data().epilogueMeeting?.phase==='playing'){if(event.target.closest('#hospital-epilogue-meeting-cg'))return;event.preventDefault();event.stopImmediatePropagation();return}
  if(data().epilogueGreeting&&data().epilogueGreeting.phase!=='done'){if(event.target.closest('#hospital-epilogue-greeting-cg'))return;event.preventDefault();event.stopImmediatePropagation();return}
  if(data().epilogueMall?.phase==='years'){event.preventDefault();event.stopImmediatePropagation();return}
  if(data().epilogueMall?.phase==='ending'&&!event.target.closest('.epilogue-finish-card')){event.preventDefault();event.stopImmediatePropagation();return}
  if(data().epilogueMall&&!['done','camera','social','post-wait','ending-phone','ending'].includes(data().epilogueMall.phase)){if(event.target.closest('#hospital-epilogue-mall-cg'))return;event.preventDefault();event.stopImmediatePropagation();return}
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
   if(button.dataset.action==='dinner-shutter'&&typeof playInteractionSound==='function')playInteractionSound('cameraShutter');
   else if(typeof playInteractionClickSound==='function')playInteractionClickSound(event);
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
  if(hospitalPhoneMode()&&!webEpilogueReady()){
   const waitingState=state;
   WebEpilogueLoader.whenReady(()=>{if(state===waitingState&&hospitalPhoneMode()&&!window.mobileLaunch)resumeStoryScene(snapshot,...args)});
   return;
  }
  if(hospitalPhoneMode()){enter();const route={...data().route},socialBack=data().socialBack;context(()=>{statusPhone();if(route.view==='chat')chat(route.active);else if(route.view==='post')post(route.active);else if(route.view==='hospital-profile')contactProfile(route.active);else if(route.view==='lin-profile')linProfile(true);else if(route.view==='lin-moments')linMoments();else if(route.view==='moment-compose')composeTextMoment();else if(route.view==='message-moments')moments(route.active);else navigate(route.view);if(socialBack?.view===view){const button=screen.querySelector('.page-head button');if(button){button.dataset.action=socialBack.action;button.setAttribute('aria-label',socialBack.label)}}});return}
  document.querySelector('#phone').classList.remove('hospital-phone');return base.resumeStoryScene(snapshot,...args);
 };
 initializeChapter=function(...args){disposeCall();entered=null;document.querySelector('#phone').classList.remove('hospital-phone');return base.initializeChapter(...args)};
 const style=document.createElement('style');style.textContent='#phone.hospital-phone #dock,#phone.hospital-phone #post-early-sleep,#phone.hospital-phone #midnight-continue-sleep{display:none!important}#phone.hospital-phone #screen{height:calc(100% - 43px);padding-bottom:0}';document.head.append(style);
 style.textContent+=`
 .epilogue-bgm-settings{margin:26px 18px;border-radius:22px;padding:24px;background:#ffffff09;border:1px solid #ffffff12;color:var(--text,#eee)}.epilogue-bgm-row{display:flex;align-items:center;justify-content:space-between;padding-bottom:24px;border-bottom:1px solid #ffffff12}.epilogue-bgm-row button{width:48px;height:28px;padding:3px;border-radius:20px;background:#687078;transition:background .18s}.epilogue-bgm-row button[aria-checked="true"]{background:#89b8a7}.epilogue-bgm-row i{display:block;width:22px;height:22px;border-radius:50%;background:#fff;transition:transform .18s}.epilogue-bgm-row button[aria-checked="true"] i{transform:translateX(20px)}.epilogue-bgm-volume{display:grid;grid-template-columns:1fr auto;gap:22px;padding-top:24px}.epilogue-bgm-volume output{color:#a9b9b3;font-variant-numeric:tabular-nums}.epilogue-bgm-volume input{grid-column:1/-1;width:100%;margin:0;accent-color:#89b8a7;cursor:pointer}

 #overlay .hospital-reply-sheet{padding:22px;border-radius:24px;background:var(--wall-surface);border:1px solid var(--wall-border);color:var(--wall-text)}
 #overlay .hospital-reply-sheet .sheet-header{padding-bottom:14px;margin-bottom:18px}
 #overlay .hospital-reply-sheet .sheet-header h2{font-size:18px;font-weight:500;letter-spacing:.5px}
 #overlay .hospital-reply-sheet .sheet-header .icon-button{width:30px;height:30px;border-radius:50%}
 #hospital-nested-reply{display:flex;flex-direction:column;gap:16px;margin:0;padding:0;background:transparent;border:0}
 .hospital-reply-reference{padding:2px 0 2px 12px;border-left:2px solid var(--wall-focus)}
 .hospital-reply-reference strong{font-size:12px;font-weight:500;color:var(--wall-button-text)}
 .hospital-reply-reference p{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;margin:7px 0 0;font-size:12px;line-height:1.7;color:var(--wall-muted);overflow-wrap:anywhere}
 #hospital-nested-reply textarea{box-sizing:border-box;width:100%;height:132px;min-height:110px;max-height:230px;resize:vertical;padding:14px 15px;border:1px solid var(--wall-border);border-radius:14px;background:var(--wall-field);color:var(--wall-text);font:inherit;font-size:14px;line-height:1.8}
 .hospital-reply-footer{display:flex;align-items:center;justify-content:space-between;gap:12px}
 .hospital-reply-footer small{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11px;color:var(--wall-muted)}
 #hospital-nested-reply .forum-publish{flex-shrink:0;min-height:40px;padding:10px 18px;border-radius:12px;letter-spacing:0;background:var(--wall-button);color:var(--wall-button-text);border:1px solid var(--wall-border)}
 #hospital-nested-reply .forum-publish:disabled{opacity:.4;cursor:default}
 .hospital-wall-identity-entry{display:flex;flex-direction:column;align-items:flex-start;gap:7px;width:100%;padding:15px 18px;margin:0 0 16px;border:1px solid #ffffff24;border-radius:14px;background:#ffffff08;color:inherit;text-align:left}
 .hospital-wall-identity-entry span{font-size:12px;opacity:.7}
 #hospital-wall-identity>label{display:grid;gap:10px}
 #hospital-wall-identity input[name="nickname"]{width:100%;box-sizing:border-box;padding:12px;border:1px solid var(--wall-border);border-radius:12px;background:var(--wall-field);color:var(--wall-text);font:inherit}
 .hospital-wall-avatar-field{border:0;padding:0;margin:0;min-width:0}
 .hospital-wall-avatar-field legend{color:var(--wall-muted);font-size:14px;margin-bottom:12px}
 .hospital-wall-avatars{display:flex;justify-content:space-around;gap:12px;padding:16px 12px;background:var(--wall-field);border:1px solid var(--wall-border);border-radius:16px}
 .hospital-wall-avatars label{position:relative;display:grid;place-items:center;cursor:pointer}
 #hospital-wall-identity .hospital-wall-avatars input{position:absolute;width:1px;height:1px;padding:0;margin:0;opacity:0}
 .hospital-wall-avatars img{width:58px;height:58px;border-radius:50%;border:3px solid transparent;object-fit:cover;padding:3px}
 .hospital-wall-avatars input:checked+img{border-color:var(--wall-focus);background:var(--wall-button)}
 .hospital-wall-avatars input:focus-visible+img{outline:2px solid var(--wall-focus);outline-offset:3px}
 #hospital-wall-identity .pill-button{background:var(--wall-button);color:var(--wall-button-text);border:1px solid var(--wall-border);border-radius:14px;min-height:46px}
 #hospital-wall-identity .hospital-wall-cancel{background:transparent;color:var(--wall-muted)}
 #hospital-wall-identity button:disabled{opacity:.4;cursor:default}
 #phone.hospital-phone .hospital-wall-dot{position:absolute;right:-2px;top:-2px;width:9px;height:9px;border:2px solid #192229;border-radius:50%;background:#e45b67;pointer-events:none}
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
 .hm-shop{min-height:100%;background:#fcf8f7;color:#493a42;padding:0 18px 24px;font-family:inherit}
 .hm-shop button,.hm-sheet button{font-family:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent}
 .hm-header{display:flex;align-items:center;gap:12px;height:76px;border-bottom:1px solid #eadfe3}
 .hm-back{display:grid;place-items:center;background:transparent;border:1px solid #e6d6dd;border-radius:50%;width:34px;height:34px;color:#806975;padding:8px}
 .hm-back svg{width:18px;height:18px}.hm-header>div{display:flex;flex-direction:column;gap:5px}.hm-header>div>span{font-size:17px;font-weight:650;letter-spacing:2px}.hm-header small{font-size:8px;letter-spacing:2px;color:#927d88}.hm-header-mark{margin-left:auto;color:#985d78;width:33px;height:33px}.hm-header-mark svg{width:100%;height:100%}.hm-header+.hm-wallet{margin-top:20px}
 .hm-wallet{display:flex;align-items:center;justify-content:space-between;gap:8px;border:1px solid #eadce2;border-radius:12px;padding:13px 12px;background:#f3e9ed}.hm-wallet>span{display:flex;align-items:center;gap:7px;font-size:10px;color:#8c7581}.hm-wallet svg{width:15px;height:15px}.hm-wallet strong{font-size:16px;font-weight:600;font-variant-numeric:tabular-nums;color:#6c465a}
 .hm-section-title{display:flex;align-items:baseline;justify-content:space-between;margin:26px 0 14px}.hm-section-title h2{font-size:15px;margin:0;letter-spacing:1px}.hm-section-title h2 small{font-size:10px;color:#927d88;font-weight:400}.hm-section-title>span{font-size:10px;color:#8c7581}
 .hm-products{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.hm-product{min-width:0;overflow:hidden;border:1px solid #eadfe3;border-radius:14px;background:#fffdfc}.hm-preview{position:relative;display:block;width:100%;padding:0;border:0;background:transparent;text-align:inherit}.hm-art{position:relative;aspect-ratio:4/5;background:#f0e9ed;overflow:hidden}.hm-art>img{display:block;width:100%;height:100%;object-fit:contain;background:#fff}.hm-art-rose{background:#f0dfe5}.hm-art-sand{background:#eee5d8}.hm-art-sage{background:#e8eee2}.hm-art-number{position:absolute;top:12px;left:12px;font-size:10px;color:#967587;letter-spacing:1px}.hm-owned{position:absolute;bottom:10px;left:10px;border-radius:20px;padding:4px 9px;background:#fffdfce6;color:#5e775a;font-size:10px}
 .hm-product-copy{padding:13px 11px}.hm-tag{font-size:9px;color:#9c6a80;letter-spacing:1px}.hm-product h3{font-size:13px;line-height:1.5;font-weight:600;margin:5px 0}.hm-product-copy>p{font-size:10px;color:#8c7581;margin:0;line-height:1.6}.hm-product-bottom{display:flex;align-items:center;justify-content:space-between;margin-top:14px;gap:8px}.hm-product-bottom>strong{font-size:22px;font-weight:500;color:#9a536f;font-variant-numeric:tabular-nums}.hm-product-bottom>strong>small{font-size:11px;margin-right:3px}.hm-buy{display:grid;place-items:center;border:0;border-radius:50%;width:32px;height:32px;padding:8px;background:#eac7d5;color:white}.hm-buy svg{width:16px;height:16px}.hm-buy:disabled{background:#eee5e9;color:#8c7581;font-size:10px;padding:0;cursor:default}
 .hm-both{display:flex;flex-direction:column;gap:16px;width:100%;margin-top:18px;padding:18px 16px;border:1px solid #dfb8ca;border-radius:16px;background:linear-gradient(125deg,#f8e4ed,#f0d8e5);color:#713e57;text-align:left;position:relative;overflow:hidden}.hm-check-product+.hm-check-product{margin-top:14px}.hm-footer{display:flex;justify-content:center;gap:10px;font-size:9px;color:#927d88;letter-spacing:1px;padding:26px 0 10px}.hm-footer>span{color:#9c6a80}.hm-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}
 #overlay .sheet.hm-sheet{background:#fffafc;color:#493a42;border:1px solid #e6d6dd;border-radius:24px;padding:22px;box-shadow:0 16px 64px #4a243025;max-height:90%;overflow:auto}#overlay .hm-sheet .sheet-header{background:transparent;border-bottom:1px solid #eadfe3;margin-bottom:20px;padding-bottom:14px}#overlay .hm-sheet .sheet-header h2{font-size:16px;letter-spacing:1px;color:#493a42}#overlay .hm-sheet .sheet-header button{color:#8e7481;background:transparent}
 .hm-check-product{display:grid;grid-template-columns:82px 1fr;gap:16px;align-items:center}.hm-check-product>.hm-art{border-radius:9px}.hm-check-product h3{font-size:16px;margin:7px 0}.hm-check-product p{font-size:11px;color:#8c7581;margin:0 0 10px}.hm-check-product strong{font-size:17px;color:#9a536f}.hm-payment{margin:22px 0 0;padding:16px;background:#f6eef2;border-radius:12px;display:grid;gap:14px}.hm-payment>div{display:flex;align-items:center;justify-content:space-between;font-size:12px;gap:12px}.hm-payment>div>span{color:#8c7581}.hm-payment strong{font-weight:500}.hm-payment .hm-payment-total{border-top:1px dashed #e6d6dd;padding-top:14px}.hm-payment-total strong{font-size:20px;color:#9a536f}.hm-payment-note{font-size:11px;color:#8c7581;line-height:1.8;margin:15px 0}.hm-payment-error{font-size:12px;color:#e3a0a4;margin:15px 0}
 #overlay .hm-sheet .hm-pay{width:100%;padding:15px;border:0;border-radius:12px;background:#a66a85;color:#fff9fc;font-size:14px;letter-spacing:1px;font-weight:600;min-height:48px}#overlay .hm-sheet .hm-pay:disabled{background:#dac8d1;color:#8c7581;cursor:default}.hm-shop button:focus-visible,.hm-sheet button:focus-visible{outline:2px solid #b97c98;outline-offset:3px}.hm-success{text-align:center;padding:8px 0 22px}.hm-success-icon{display:grid;place-items:center;margin:0 auto 15px;width:62px;height:62px;border-radius:50%;background:#e8eee2;color:#68805c}.hm-success-icon svg{width:28px;height:28px}.hm-success>small{font-size:8px;letter-spacing:2px;color:#758569}.hm-success h3{font-size:20px;font-weight:500;margin:15px 0 9px}.hm-success p{font-size:12px;color:#8c7581}.hm-success>strong{display:block;font-size:32px;font-weight:500;color:#9a536f;margin:19px 0}.hm-success>div{font-size:11px;color:#8c7581}.hm-success b{font-weight:500;color:#6d5260;margin-left:8px}
 .hm-bundle-top,.hm-bundle-bottom{display:flex;align-items:center;justify-content:space-between;gap:10px}.hm-bundle-top>strong{font-size:16px;font-weight:500;letter-spacing:1px}.hm-discount{display:flex;align-items:baseline;gap:5px;padding:6px 9px;border:1px solid #d8a2ba;border-radius:7px;background:#fff7fb;color:#a05174;font-size:9px;white-space:nowrap}.hm-discount b{font-size:20px;line-height:1;font-weight:600}.hm-bundle-bottom{padding-top:14px;border-top:1px dashed #d7b2c3;align-items:flex-end}.hm-bundle-price{display:flex;flex-wrap:wrap;align-items:baseline;gap:5px 9px;min-width:0}.hm-bundle-price>small{flex-basis:100%;font-size:10px;color:#967587}.hm-bundle-price>strong{font-size:25px;font-weight:500;font-variant-numeric:tabular-nums;letter-spacing:-.6px}.hm-bundle-price>del{font-size:10px;color:#947d8a}.hm-bundle-save{font-size:10px;white-space:nowrap;color:#985d78;padding-bottom:4px}.hm-bundle-save>span{font-size:18px;margin-left:3px}.hm-buy{color:#6d4054}.hm-payment-discount>span,.hm-payment-discount>strong{color:#a45376!important}.hm-payment del{color:#8c7581;font-size:12px}



 .ht-share-message .bubble{padding:0!important;background:transparent!important;border:0!important;box-shadow:none!important;border-radius:17px!important;overflow:hidden}
 .ht-share-message .bubble:before,.ht-share-message .bubble:after{display:none!important}
 .ht-share-card{display:block;width:260px;max-width:100%;padding:0;border:1px solid #d9e3da;border-radius:17px;overflow:hidden;background:#f9fcf9;color:#2d493b;text-align:left;font-family:inherit;cursor:pointer;box-shadow:0 3px 10px #11251b0d}
 .ht-share-card:focus-visible{outline:2px solid #87b49a;outline-offset:-3px}
 .ht-share-head{display:flex;align-items:center;justify-content:space-between;padding:13px 15px;background:#e3eee4;gap:8px}
 .ht-share-head>span{display:flex;align-items:center;gap:7px}.ht-share-head svg{width:18px;height:18px;stroke:#577461;fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}.ht-share-head b{font-size:12px;font-weight:600}.ht-share-head small{font-size:10px;color:#587a64;background:#f7faf5;border-radius:12px;padding:4px 8px;white-space:nowrap}
 .ht-share-map{height:86px;background:#edf2ec}.ht-share-map svg{width:100%;height:100%;display:block;stroke-width:0}
 .ht-share-body{padding:15px 16px 13px}.ht-share-stops{position:relative;display:grid;gap:12px}.ht-share-stops:before{content:'';position:absolute;left:3px;top:9px;bottom:9px;width:1px;background:#d5ded6}.ht-share-stops>div{display:flex;align-items:center;gap:10px;position:relative;font-size:12px;line-height:1.5}.ht-share-stops i{width:7px;height:7px;border-radius:50%;background:#789783;flex:none;box-shadow:0 0 0 3px #f9fcf9}.ht-share-stops>div+div i{background:#b17c91}.ht-share-stops strong{font-size:13px;font-weight:600}.ht-share-stops span{color:#77877b}
 .ht-share-vehicle{display:flex;align-items:baseline;justify-content:space-between;gap:8px;margin-top:17px;padding-top:12px;border-top:1px solid #e4ebe4}.ht-share-vehicle strong{font-size:23px;line-height:1.3;letter-spacing:.4px;font-weight:700}.ht-share-vehicle span{font-size:10px;color:#748575;white-space:nowrap}.ht-share-meta{display:flex;justify-content:space-between;font-size:10px;color:#839184;margin-top:7px}
 .ht-share-foot{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:10px 14px;background:#eff4ee;border-top:1px solid #e3ebe0;color:#6b806b;font-size:9px}.ht-share-foot>span:last-child{display:flex;align-items:center;gap:3px;color:#476b53;white-space:nowrap}.ht-share-foot svg{width:11px;height:11px;transform:rotate(180deg)}
 .hp-transfer-message .bubble{padding:0!important;background:transparent!important;border:0!important;box-shadow:none!important;overflow:hidden;border-radius:16px!important}
 .hp-transfer-message .bubble:before,.hp-transfer-message .bubble:after{display:none!important}
 .hp-transfer-card{width:232px;max-width:100%;background:#bdd5c2;color:#294e3e;border:1px solid #d2e4d5;border-radius:16px;overflow:hidden;text-align:left}
 .hp-transfer-card.is-receipt{background:#dce9df;border-color:#e5efe7}
 .hp-transfer-main{display:flex;align-items:center;gap:13px;padding:21px 17px 19px}
 .hp-transfer-main>svg{width:35px;height:35px;flex:none;stroke:#486e56;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
 .hp-transfer-main strong{display:block;font-size:25px;font-weight:600;line-height:1.3;letter-spacing:.2px;font-variant-numeric:tabular-nums;color:#294e3e}
 .hp-transfer-main strong>span{font-size:17px;font-weight:500}
 .hp-transfer-main small{display:block;margin-top:6px;font-size:12px;color:#53745e}
 .hp-transfer-foot{display:flex;justify-content:space-between;align-items:center;border-top:1px solid #37594322;padding:9px 17px;font-size:10px;color:#53745e;letter-spacing:.4px}
 .ht-app{min-height:100%;background:#f6f8f6;color:#273a33;padding-bottom:24px}.ht-header{display:flex;align-items:center;gap:12px;padding:18px;background:#fff}.ht-header button{padding:0;display:grid;place-items:center}.ht-header strong{font-size:21px}.ht-map{width:100%;height:clamp(180px,29vh,270px);background:#edf0ed;display:block;stroke:none;stroke-width:0}.ht-map g[data-taxi-car]{transition:transform .1s linear}.ht-panel{position:relative;margin:-6px 12px 0;padding:20px 16px;background:#fff;border:1px solid #e5ebe6;border-radius:24px;box-shadow:0 10px 28px #203a2410}.ht-panel h2{font-size:20px;line-height:1.5;margin:0 0 18px}.ht-address{background:#f5f7f5;border-radius:14px;padding:0 14px}.ht-address>div{display:flex;align-items:center;gap:10px;min-height:50px;font-size:13px}.ht-address>div+div{border-top:1px solid #e5ebe6}.ht-address i{width:7px;height:7px;border-radius:50%;background:#739785;flex-shrink:0}.ht-address>div+div i{background:#ba849b}.ht-address input{width:100%;min-width:0;border:0;background:transparent;color:#263e33;padding:14px 0;font-size:13px;outline:none}.ht-suggestion{width:100%;display:flex;align-items:center;gap:10px;padding:16px 3px;text-align:left;border-bottom:1px solid #edf0ed}.ht-suggestion span:nth-child(2){flex:1}.ht-suggestion strong,.ht-car strong{display:block;font-size:13px;font-weight:600}.ht-suggestion small,.ht-car small{display:block;font-size:10px;color:#83938b;margin-top:6px}.ht-suggestion b{font-size:10px;font-weight:400;color:#83938b}.ht-section{display:flex;justify-content:space-between;align-items:center;margin:22px 0 12px;font-size:13px}.ht-section small{font-size:10px;color:#83938b}.ht-car{display:flex;width:100%;align-items:center;gap:12px;border:1px solid #e6ebe7;border-radius:13px;padding:13px 12px;margin-bottom:9px;text-align:left}.ht-car.selected{border-color:#658a75;background:#f0f6f1}.ht-car>span:first-child{color:#71867b}.ht-car>span:nth-child(2){flex:1}.ht-car b{font-size:18px;font-weight:500}.ht-car i{width:14px;height:14px;border:1px solid #d0d9d2;border-radius:50%}.ht-car.selected i{background:#638572;border:4px solid #d9e6dd}.ht-primary{display:flex;width:100%;justify-content:center;align-items:center;gap:8px;min-height:48px;margin-top:18px;background:#304e40;border-radius:13px;color:#fff;font-size:14px}.ht-primary svg{width:18px;height:18px}.ht-primary:disabled{background:#e7ede8;color:#829489;cursor:default}.ht-payment-note{text-align:center;color:#83938b;font-size:10px;margin:12px 0 0}.ht-trip-top{display:flex;align-items:center;justify-content:space-between;gap:8px}.ht-trip-top small{font-size:11px;color:#739080}.ht-trip-top h2{font-size:17px;margin:6px 0 0}.ht-live{font-size:10px;background:#e6f0e8;color:#638572;border-radius:20px;padding:6px 9px;white-space:nowrap}.ht-driver{display:grid;grid-template-columns:40px minmax(0,1fr);gap:10px;align-items:center;padding:20px 0;border-bottom:1px solid #edf1ed}.ht-driver>span{display:grid;place-items:center;width:44px;height:44px;background:#edf1ed;border-radius:12px}.ht-driver>div{flex:1}.ht-driver strong{display:block;font-size:30px;line-height:1.3;letter-spacing:.5px;white-space:nowrap;font-weight:700}.ht-driver small{display:block;font-size:10px;color:#83938b;margin-top:6px}.ht-driver b{grid-column:2;font-size:13px;font-weight:500;color:#708578}.ht-metrics{display:flex;justify-content:space-between;text-align:center;padding:22px 0}.ht-metrics strong{display:block;font-size:18px;font-weight:500}.ht-metrics small{display:block;color:#83938b;font-size:10px;margin-top:7px}.ht-track{height:4px;background:#edf1ed;border-radius:4px;overflow:hidden}.ht-track i{display:block;background:#769884;height:100%;transition:width .1s linear}#hospital-taxi-live{position:absolute;z-index:40;left:50%;right:auto;top:max(4px,env(safe-area-inset-top));transform:translateX(-50%);width:max-content;max-width:calc(100% - 32px);white-space:nowrap;display:flex;align-items:center;gap:7px;padding:6px 13px 8px;border:1px solid #d7e3d9;border-radius:999px;background:#f4faf5f2;color:#365545;box-shadow:0 5px 15px #0002;font-size:10px;overflow:hidden}#hospital-taxi-live svg{width:16px;height:16px;animation:taxi-driving .8s ease-in-out infinite alternate}#hospital-taxi-live i{position:absolute;bottom:0;left:0;height:3px;background:#759982}.ht-moving svg{animation:taxi-driving .8s ease-in-out infinite alternate}@keyframes taxi-driving{from{transform:translateX(-2px)}to{transform:translateX(2px)}}

 .epilogue-finish{position:absolute;inset:0;z-index:90;display:grid;place-items:center;padding:28px;background:radial-gradient(ellipse at 50% 35%,#314b4066,#101b18ed);--finish-bg:#f0f7ef;--finish-ink:#45685a;--finish-line:#91b29d;animation:epilogue-finish-in .7s ease both}.epilogue-finish.pink,.epilogue-finish.romance{--finish-bg:#fff1f4;--finish-ink:#9c5f77;--finish-line:#dca2b7;background:radial-gradient(ellipse at 50% 35%,#9e617b66,#21121eed)}.epilogue-finish.yellow{--finish-bg:#fff8df;--finish-ink:#88703b;--finish-line:#d7bd76;background:radial-gradient(ellipse at 50% 35%,#8e794f66,#201d14ed)}.epilogue-finish-card{width:100%;max-width:340px;padding:32px 22px 25px;box-sizing:border-box;border-radius:30px;border:1px solid #ffffffa8;background:var(--finish-bg);color:var(--finish-ink);text-align:center;box-shadow:0 24px 100px #0004,inset 0 0 0 7px #ffffff50}.epilogue-finish.romance .epilogue-finish-card{background:radial-gradient(ellipse at 15% 0,#ffe1eccc,transparent 60%),radial-gradient(ellipse at 95% 80%,#f5dceacc,transparent 55%),#fff3f5}.epilogue-finish-art{margin:0 auto 24px;width:120px}.epilogue-finish-art svg{width:100%;height:90px;display:block;fill:none;stroke:var(--finish-line);stroke-width:1.3;stroke-linecap:round}.epilogue-finish.romance .epilogue-finish-art svg{fill:#efc4d150}.epilogue-finish-card>p{font-size:13px;letter-spacing:9px;margin:0 0 17px;padding-left:9px}.epilogue-finish-card>p span{margin-left:10px}.epilogue-finish h2{font-size:19px;font-weight:500;line-height:1.8;margin:0;letter-spacing:1px}.epilogue-finish-rule{width:38px;height:1px;background:var(--finish-line);margin:30px auto}.epilogue-finish button{border:1px solid var(--finish-line);border-radius:30px;background:#ffffff55;color:var(--finish-ink);font-size:12px;padding:12px 25px;letter-spacing:2px}.epilogue-blush-sticker{width:120px;height:auto;display:block;border-radius:8px}.epilogue-years{position:absolute;inset:0;z-index:85;display:grid;place-items:center;background:#211c29a6;backdrop-filter:blur(6px);animation:epilogue-finish-in .6s ease both}.epilogue-years-card{width:290px;padding:30px 26px;border-radius:28px;background:#fff1f2;box-shadow:0 22px 75px #0004;color:#9b6374;text-align:center;box-sizing:border-box}.epilogue-years small{letter-spacing:3px;font-size:12px}.epilogue-year-pages{margin:26px 0 18px;background:#fffafa;border-top:4px solid #dca6b6;border-bottom:1px solid #dfb9c4;border-radius:10px;overflow:hidden;padding:22px 0;perspective:700px}.epilogue-year-pages span{display:block;font-size:23px;letter-spacing:6px;color:#b48293}.epilogue-year-pages strong{display:block;font-size:35px;letter-spacing:2px;font-weight:500;margin-top:13px;font-variant-numeric:tabular-nums}.epilogue-year-pages .turn{animation:epilogue-page-turn .2s ease-out}.epilogue-years p{font-size:11px;letter-spacing:1px}.epilogue-years progress{appearance:none;height:4px;width:100%;border:0;border-radius:6px;overflow:hidden;margin-top:16px}.epilogue-years progress::-webkit-progress-bar{background:#ecd7de}.epilogue-years progress::-webkit-progress-value{background:#c892a5}.epilogue-destination{position:absolute;left:22px;right:22px;top:50%;transform:translateY(-50%);padding:28px 24px;border-radius:24px;border:1px solid #e6d3c34d;background:#29242eed;color:#eee4e9;box-shadow:0 15px 65px #0005}.epilogue-destination small{font-size:11px;letter-spacing:2px;color:#c4a9b6}.epilogue-destination h2{font-size:21px;font-weight:500;margin:14px 0}.epilogue-destination p{font-size:12px;color:#b2a4b1;line-height:1.8}.epilogue-destination input{box-sizing:border-box;width:100%;padding:14px;margin:14px 0 20px;border:1px solid #a995a955;border-radius:12px;background:#ffffff08;color:#fff;font:inherit}.epilogue-destination button{width:100%;padding:13px;border-radius:12px;background:#d6b7c5;color:#382d37;font-size:14px}@keyframes epilogue-finish-in{from{opacity:0}to{opacity:1}}@keyframes epilogue-page-turn{from{opacity:.25;transform:rotateX(-35deg) translateY(-10px)}to{opacity:1;transform:none}}
 .dinner-camera{height:100%;display:flex;flex-direction:column;background:#050505;color:#fff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.dinner-camera header{height:64px;flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:0 22px}.dinner-camera header button{width:40px;height:40px;border-radius:50%;background:#ffffff12;display:grid;place-items:center}.dinner-camera svg{width:23px;height:23px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}.camera-live{font-size:11px;letter-spacing:2px;color:#b9b9bd}.camera-flash{margin-right:10px;color:#d1d1d5}.dinner-viewfinder{position:relative;flex:1;min-height:160px;overflow:hidden;background:#19191b}.dinner-viewfinder>img{width:100%;height:100%;object-fit:cover}.camera-grid{position:absolute;inset:0;background:linear-gradient(to right,transparent 33.2%,#ffffff20 33.2%,#ffffff20 33.5%,transparent 33.5%,transparent 66.5%,#ffffff20 66.5%,#ffffff20 66.8%,transparent 66.8%),linear-gradient(to bottom,transparent 33.2%,#ffffff20 33.2%,#ffffff20 33.5%,transparent 33.5%,transparent 66.5%,#ffffff20 66.5%,#ffffff20 66.8%,transparent 66.8%);pointer-events:none}.camera-focus{position:absolute;width:72px;height:72px;border:1px solid #e8c654;left:50%;top:45%;transform:translate(-50%,-50%);border-radius:3px;opacity:.65}.camera-zoom{position:absolute;bottom:20px;left:50%;transform:translateX(-50%);display:flex;gap:8px;align-items:center;background:#0005;border-radius:30px;padding:5px}.camera-zoom span,.camera-zoom b{width:34px;height:34px;display:grid;place-items:center;font-size:12px;font-weight:500}.camera-zoom b{border-radius:50%;background:#333b;color:#ffd766}.dinner-camera footer{flex-shrink:0;padding:21px 25px 16px;background:#050505}.camera-modes{display:flex;justify-content:center;gap:32px;font-size:13px;letter-spacing:2px;margin-bottom:23px}.camera-modes span{color:#9c9c9f}.camera-modes strong{font-weight:500;color:#ffd966}.camera-controls{display:flex;align-items:center;justify-content:space-between}.camera-shutter{width:78px;height:78px;padding:4px;border:3px solid #fff;border-radius:50%;background:none}.camera-shutter i{display:block;width:100%;height:100%;background:#fff;border-radius:50%;transition:transform .12s}.camera-shutter:active i{transform:scale(.91)}.camera-thumb{width:47px;height:47px;border-radius:8px;overflow:hidden;background:#29292b;border:1px solid #ffffff18;padding:0}.camera-thumb .dinner-photo{width:100%;height:100%;margin:0;min-height:0;border-radius:0}.camera-thumb svg{width:22px;height:22px}.camera-lens{width:47px;height:47px;border-radius:50%;background:#242426;display:grid;place-items:center;color:#ccc}.dinner-camera footer p{font-size:10px;text-align:center;letter-spacing:1px;color:#737378;margin:18px 0 0}.camera-saved{position:absolute;top:24px;left:18px;right:18px;padding:16px 12px;background:#101014dc;border:1px solid #ffffff24;border-radius:17px;text-align:center;font-size:14px;line-height:1.8;box-shadow:0 8px 30px #0005}.camera-saved small{color:#c1c1c8;font-size:12px}.dinner-viewfinder.shot:after{content:"";position:absolute;inset:0;pointer-events:none;background:white;animation:dinner-shutter-flash .3s forwards}@keyframes dinner-shutter-flash{from{opacity:.8}to{opacity:0}}.dinner-photo{display:block;width:min(240px,100%);height:180px;object-fit:cover;border-radius:12px;margin:14px 0;background:#29252a}.dinner-photo-empty{display:grid;place-items:center;border:1px solid #ffffff18;color:#b6a7ad}.dinner-photo-empty svg{width:32px;height:32px;fill:none;stroke:currentColor;stroke-width:1.3}.dinner-album-caption{font-size:12px;color:#b7a9b1}.moment-compose>.dinner-photo{margin:20px}.dinner-comment{display:block;text-align:left;background:none;border:0;padding:3px 0;color:inherit;font:inherit;line-height:inherit;width:100%}.dinner-comment:active{opacity:.65}.sheet-backdrop.dinner-reply-backdrop{background:#00000030;backdrop-filter:none;-webkit-backdrop-filter:none}.sheet.dinner-reply-sheet{padding:12px 14px 14px;border-radius:16px;margin-bottom:calc(64px + env(safe-area-inset-bottom));max-height:calc(100dvh - 110px - env(safe-area-inset-bottom));background:#202b31;border:1px solid #ffffff12;box-shadow:0 8px 28px #0003}.dinner-reply-sheet .sheet-header{margin:0 0 8px;min-height:22px;align-items:center}.dinner-reply-sheet .sheet-header h2{font-size:12px;font-weight:400;color:#aebcc2;margin:0}.dinner-reply-sheet .sheet-header button{width:24px;height:24px;font-size:18px;color:#8e9ea5}#dinner-reply-form{display:flex;align-items:center;gap:10px}.dinner-reply-input{box-sizing:border-box;display:block;flex:1;min-width:0;width:100%;height:42px;min-height:42px;resize:none;border:1px solid #ffffff0d;border-radius:10px;background:#ffffff08;color:#edf1f2;padding:10px 12px;font:inherit;font-size:14px;line-height:20px;margin:0;outline:none}.dinner-reply-input:focus{border-color:#84b4a65c}.dinner-reply-input::placeholder{color:#819098}#dinner-reply-form .primary{display:block;flex:none;width:auto;min-width:62px;min-height:40px;height:40px;padding:0 14px;margin:0;border-radius:10px;font-size:13px;background:#91b9ac;color:#142b24}
 .epilogue-tea-order{position:absolute;top:45%;left:50%;transform:translate(-50%,-50%);width:min(320px,calc(100% - 40px));padding:28px 24px;box-sizing:border-box;background:#faf6ee;border:1px solid #fff9;border-radius:28px;text-align:center;color:#384c43;box-shadow:0 20px 70px #0005}
 .tea-order-mark{width:58px;height:58px;margin:0 auto 16px;background:#e8eee2;border-radius:20px;display:grid;place-items:center}.tea-order-mark svg{width:38px;fill:none;stroke:#6b8772;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
 .epilogue-tea-order small{font-size:11px;letter-spacing:2px;color:#7d8879}.epilogue-tea-order h2{font-size:17px;font-weight:500;margin:14px 0 8px}.tea-order-number{font-size:48px;font-weight:600;letter-spacing:6px;font-variant-numeric:tabular-nums}.epilogue-tea-order p{font-size:13px;color:#7b8275}.epilogue-tea-order b{color:#486e55;font-size:19px;font-variant-numeric:tabular-nums}.epilogue-tea-order progress{appearance:none;width:100%;height:7px;border:0;border-radius:8px;overflow:hidden;background:#e6e9dd;margin:10px 0 18px}.epilogue-tea-order progress::-webkit-progress-bar{background:#e6e9dd}.epilogue-tea-order progress::-webkit-progress-value{background:#86a58c;border-radius:8px;transition:width .1s linear}.epilogue-tea-order>span{display:block;font-size:11px;color:#92988b}
 #hospital-epilogue-mall-cg,#hospital-epilogue-greeting-cg,#hospital-epilogue-meeting-cg,#hospital-taxi-arrival-cg,#hospital-discharge-cg{position:relative;height:100%;min-height:100%;background:#151218}
 #hospital-epilogue-mall-cg>img,#hospital-epilogue-greeting-cg>img,#hospital-epilogue-meeting-cg>img,#hospital-taxi-arrival-cg>img,#hospital-discharge-cg>img{width:100%;height:100%;object-fit:cover}
 #overlay .hm-sheet p{color:#8c7581}#overlay .hm-sheet .hm-payment-error{color:#ad4d60}.hm-product-copy>p{color:#806b77}.hm-header-mark svg{stroke-width:1.8}
 @keyframes hospital-calendar-in{from{opacity:0}to{opacity:1}}
 #hospital-epilogue-calendar,#hospital-gift-calendar{animation:hospital-calendar-in .6s ease-out both;position:absolute;inset:0;z-index:1500;display:grid;place-items:center;background:#34182b99;backdrop-filter:blur(8px);pointer-events:auto}
 .epilogue-calendar-card{position:relative;width:76%;max-width:300px;padding:34px 20px 24px;text-align:center;border:1px solid #ffe4ed;border-radius:24px;background:linear-gradient(145deg,#fff4f7,#f5cedd);color:#96516d;box-shadow:0 24px 70px #250b244d;font-family:inherit}
 .epilogue-calendar-rings{position:absolute;top:-10px;left:22%;right:22%;display:flex;justify-content:space-between}
 .epilogue-calendar-rings i{width:10px;height:28px;background:#ce8fa6;border:2px solid #ffe4ed;border-radius:8px}
 .epilogue-calendar-card>p{font-size:12px;letter-spacing:3px;margin:0 0 20px}
 .epilogue-calendar-window{height:96px;overflow:hidden;border-block:1px solid #d9a5b644}
 .epilogue-calendar-days{transition:transform .18s ease-in-out}
 .epilogue-calendar-days>div{height:96px;line-height:96px;font-size:58px;font-weight:500;font-variant-numeric:tabular-nums}
 .epilogue-calendar-time{display:block;margin-top:22px;font-size:16px;letter-spacing:4px}
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
 window.addEventListener('pageshow',()=>{if(isVisible()){syncCall();syncMomentReplies();syncWallDreamReply()}});
 document.addEventListener('visibilitychange',syncWallDreamReply);
 window.addEventListener('pagehide',()=>{if(wallDreamTimer!==null)clearTimeout(wallDreamTimer);wallDreamTimer=null});
 window.addEventListener('visibilitychange',()=>syncMomentReplies());
 window.addEventListener('pagehide',()=>{if(momentReplyTimer!==null)clearTimeout(momentReplyTimer);momentReplyTimer=null});
 window.addEventListener('storage',()=>{if(isVisible())syncCallAudio()});
 if(isVisible()){enter();context(homePhone)}
})();
