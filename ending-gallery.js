/* Ending collection is account-local and independent of every rewindable story save. */
(()=>{
 const key=STORAGE_KEY+'-ending-gallery';
 const endings=[
  {
    "id": "001",
    "name": "规则已生效。"
  },
  {
    "id": "002",
    "name": "校园新规，你忘了吗？"
  },
  {
    "id": "003",
    "name": "犯错误是愚蠢的。"
  },
  {
    "id": "004",
    "name": "真是一份奇怪的问卷。"
  },
  {
    "id": "005",
    "name": "不要独自进入电梯。"
  },
  {
    "id": "006",
    "name": "随意更换宿舍者将被直接抹除。"
  },
  {
    "id": "007",
    "name": "表现的太聪明和强势也不是好事。",
    "hint": "不要公开怀疑站队的人"
  },
  {
    "id": "008",
    "name": "大家都在怀疑你。",
    "hint": "与孟舒对质时，选择「你是在确认她有没有骗你吗？」"
  },
  {
    "id": "009",
    "name": "你需要相信并帮助对的人。",
    "hint": "帮助江晓，说出孟舒找自己的事"
  },
  {
    "id": "010",
    "name": "你似乎相信了错误的人。",
    "hint": "你公开指向叶琳的信息，最初是谁告诉你的？这真的可信吗？"
  },
  {
    "id": "011",
    "name": "你失去了第三次检举的机会。"
  },
  {
    "id": "012",
    "name": "检举提交已超时。"
  },
  {
    "id": "013",
    "name": "你好像忘记了进食。"
  },
  {
    "id": "014",
    "name": "你似乎有些倒霉。",
    "hint": "群聊内的人没有获得任何有效信息：可以试试在第零日晚上购买矿泉水－自由行动私聊温宁－询问黄色外套－整理成员楼层－把取件记录公开在群内"
  },
  {
    "id": "015",
    "name": "你早早落下了话柄。",
    "hint": "第一日让大家检举出正确的人。"
  },
  {
    "id": "016",
    "name": "你选择了最有可能活下去的人，可她设想的幸存者里只有自己。",
    "hint": "你对两份问卷的评分造成了不可挽回的后果。"
  },
  {
    "id": "017",
    "name": "你是故意的吗？"
  },
  {
    "id": "018",
    "name": "看来你的好奇心比求生欲更强。"
  },
  {
    "id": "019",
    "name": "你成功苏醒了。",
    "category": "survival"
  },
  {
    "id": "020",
    "name": "明天也请留在这里吧。",
    "category": "hidden",
    "hidden": true
  },
  {
    "id": "021",
    "name": "故事还没有结束。",
    "category": "survival"
  },
  {
    "id": "022",
    "name": "你成功活下来了。",
    "category": "survival"
  },
  {
    "id": "023",
    "name": "你们一起回来了。",
    "category": "hidden",
    "hidden": true
  },
  {
    "id": "024",
    "name": "你没能找到正确的线索",
    "hint": "可以试试公开质问孟舒，让群聊里的人获得更多的信息"
  }
];
 function read(){try{return JSON.parse(GameStorage.getItem(key)||'{}')||{}}catch{return {}}}
 function unlock(id,notify=false){if(!endings.some(e=>e.id===id))return;const records=read();if(records[id])return;records[id]={unlockedAt:Date.now(),noticePending:notify};try{GameStorage.setItem(key,JSON.stringify(records))}catch{toast('无法保存结局，请检查浏览器存储权限')}}
 function deathId(){
  const s=state.story,d=s.lateDayDeath;
  if(d?.phase==='dead'&&d.reason==='departed-reply')return '018';
  if(d?.phase==='dead'&&d.reason==='day4-final-report-wrong')return '017';
  if(d?.phase==='dead'&&d.reason==='day3-unprotected')return '016';
  if(d?.phase==='dead'&&d.reason==='day3-lost-support')return '015';
  if(d?.phase==='dead'&&d.reason==='day1-songjia-uninformed')return '014';
  if(d?.phase==='dead'&&d.reason==='forgot-food')return '013';
  if(Object.values(s).some(r=>r&&typeof r==='object'&&r.phase==='dead'&&(r.endingId==='012'||r.expired&&r.submittedAt==null&&r.deadline)))return '012';
  if(d?.phase==='dead'&&d.reason==='report-errors'||state.game.reportErrorEnding&&state.game.identity?.wrongReports>=2)return '011';
  if(s.dayTwoWrongDormDeath)return '006';
  if(s.dayTwoSoloElevatorDeath)return '005';
  if(d?.phase==='dead'&&['group-vote','wolf-vote'].includes(d.reason))return '008';
  if(d?.phase==='dead'&&d.reason==='day2-council-accusation')return '007';
  if(d?.phase==='dead'&&d.reason==='day2-yelin-misled')return '010';
  if(d?.phase==='dead'&&d.reason==='day2-yelin-no-clues')return '024';
  if(d?.phase==='dead'&&(d.reason==='day2-jiang-unsupported'||d.reason==='day2-confrontation'&&s.dayTwoPublicOutcome?.applied&&s.dayTwoPublicOutcome.nightTarget==='me'))return '009';
  if(d?.phase==='dead')return d.reason==='breakdown'?null:d.reason==='questionnaire'?'004':'003';
  if(s.questionnaire?.phase==='dead')return '004';
  if(s.dayOneReport?.phase==='dead'||s.dayTwoReport?.phase==='dead'||s.pickupCodeDeath)return '003';
  if(s.firstMorning?.phase==='dead')return '002';
  if(s.zero?.phase==='dead'&&state.game.day===0)return '001';
  return null;
 }
 function migrateHospitalEndingId(progress){
  const ending=progress?.story?.dayFourSleep;
  if(ending?.endingId==='survival-001')ending.endingId='019';
  if(ending?.endingId==='hidden-stay')ending.endingId='020';
 }
 storySnapshotMigrations.push(migrateHospitalEndingId);
 function migrate(){
  // Preserve a collection earned in the older hospital build, without awarding
  // a new collection merely for reaching the hospital scene or answering a call.
  const records=read();
  if(records['hidden-stay']){
   records['020']??={...records['hidden-stay']};delete records['hidden-stay'];
   try{GameStorage.setItem(key,JSON.stringify(records))}catch{}
  }
  if(records['survival-001']){
   records['019']??={...records['survival-001']};delete records['survival-001'];
   try{GameStorage.setItem(key,JSON.stringify(records))}catch{}
  }
  migrateHospitalEndingId(state);
  if(state.story?.dayFourSleep?.phone?.motherCall?.endingConfirmed)unlock(hospitalEndingId(state));
  if(state.story?.dayFourSleep?.phase==='hidden-ending'&&state.story.dayFourSleep.endingId==='020')unlock('020');
  let discovered={};try{discovered=JSON.parse(GameStorage.getItem(STORAGE_KEY+'-worldline-discovery')||'{}')||{}}catch{}
  if(discovered['death-day2-solo'])unlock('005');
  if(discovered['death-day2-code'])unlock('003');
  for(const ending of endings)if(discovered['death-'+ending.id])unlock(ending.id);
  if(discovered['020']||discovered['hidden-stay'])unlock('020');
  if(state.story?.route?.view==='zero-death')unlock(deathId());
 }
 // Reuse the existing map's four numbers without sharing a mutable cached storage object.
 window.endingGalleryHas=id=>!!read()[String(id).replace(/^death-/,'')];
 window.endingGalleryConfirmHospital=(progress=state)=>{
  const c=progress.story?.dayFourSleep?.phone?.motherCall;
  if(!c?.completed||c.phase!=='done'||c.noticePhase!=='prompt')return false;
  const id=hospitalEndingId(progress);if(id==='021'&&progress.story.dayFourSleep.phone.reunionHope?.phase!=='done')return false;unlock(id);return !!read()[id];
 };
 window.endingGalleryUnlockLinStay=(progress=state)=>{
  const n=progress.story?.dayFourSleep;
  if(n?.phase!=='hidden-ending'||n.endingId!=='020')return false;
  unlock('020');return !!read()['020'];
 };
 function decorateDeath(){
  const page=screen.querySelector('.zero-death'),message=page?.querySelector('p');
  if(!message||!['你已被请离','你已被学生会清理'].some(text=>message.textContent.includes(text)))return;
  // Resolve the current ending before applying the generic operation-failure fallback.
  const id=deathId()||'003',ending=endings.find(e=>e.id===id);unlock(id,true);
  page.querySelectorAll('.ending-title').forEach(el=>el.remove());
  if(ending?.hint&&!page.querySelector('.ending-hint'))message.insertAdjacentHTML('afterend','<p class="subtle ending-hint">（提示：'+esc(ending.hint)+'）</p>');
  const label='已解锁结局 '+id+' · '+ending.name,note=page.querySelector('.ending-unlock-note');
  if(note){if(note.textContent!==label)note.textContent=label;return}
  message.insertAdjacentHTML('afterend','<small class="subtle ending-unlock-note" role="status">'+label+'</small>');
 }
 function addMenuEntry(){
  const button=screen.querySelector('.zero-menu [data-action="game-continue"]');
  if(button&&!screen.querySelector('.zero-menu [data-action="ending-gallery"]'))button.insertAdjacentHTML('afterend','<button class="secondary" data-action="ending-gallery">结局图鉴</button>');
 }

 // Authored ending copy; collection IDs and saved unlock records remain unchanged.
 const letters={
  "001": [
    {
      "name": "林晴",
      "text": "其实我本来想劝阻你们，但又心存侥幸，觉得那条规则可能是假的……我好后悔。"
    }
  ],
  "002": [
    {
      "name": "林晴",
      "text": "对不起"
    }
  ],
  "003": [
    {
      "name": "黑头像",
      "text": "看来我提醒的还不够明显"
    }
  ],
  "004": [
    {
      "name": "林晴",
      "text": "我以为你只是睡着了……没想到你就这样消失了"
    }
  ],
  "005": [
    {
      "name": "林晴",
      "text": "为什么要骗我？是因为不相信我吗？"
    }
  ],
  "006": [
    {
      "name": "林晴",
      "text": "能和你一起消失，我该高兴还是难过？"
    }
  ],
  "007": [
    {
      "name": "孟舒",
      "text": "你确实聪明，可未免也太不知死活了。别忘了我们有权决定清理谁，而你只是个白板。"
    }
  ],
  "008": [
    {
      "name": "孟舒",
      "text": "你太轻敌了，我们学生会可是彼此都知道身份的。"
    }
  ],
  "009": [
    {
      "name": "江晓",
      "text": "你原来还是不相信我吗？"
    }
  ],
  "010": [
    {
      "name": "叶琳",
      "text": "我惹你没……"
    }
  ],
  "024": [
    {"name":"叶琳","text":"我只是看不惯周茉，嘴快了点，我没想让她真的消失……"}
  ],
  "011": [
    {
      "name": "作者",
      "text": "你是故意来达成这个结局，还是无意的？"
    }
  ],
  "012": [
    {
      "name": "黑头像",
      "text": "看来你还是不够重视这个规则"
    }
  ],
  "013": [
    {
      "name": "林晴",
      "text": "都怪我，我应该看着你有没有吃东西的"
    }
  ],
  "014": [
    {
      "name": "林晴",
      "text": "一觉醒来你就不见了"
    }
  ],
  "015": [
    {
      "name": "赵诗雨",
      "text": "我不怪你，是温宁欺骗了你，你也是受害者"
    }
  ],
  "016": [
    {
      "name": "周茉",
      "text": "原来大家都觉得，我这种人不该留下来。"
    }
  ],
  "017": [
    {
      "name": "沈可欣",
      "text": "没想到你人这么好，看来周茉说的没错"
    }
  ],
  "018": [
    {
      "name": "作者",
      "text": "恭喜你发现了彩蛋！"
    }
  ],
  "019": [
    {
      "name": "林晴",
      "text": "没能和你一起逛街，是我食言了"
    },
    {
      "name": "周茉",
      "text": "看到你醒来真的很开心"
    },
    {
      "name": "叶琳",
      "text": "快把我好友加回来啊，康复了带你吃火锅去"
    }
  ],
  "021": [
    {"name":"林晴","text":"【玩家名字】，对不起，这一次没能和你一起回来。我只是害怕，醒来以后仍会成为大家的拖累，所以又胆怯了一次。可我答应过你我会回来的，所以我已经在努力了，毕竟我们还要一起逛街不是吗？"},
    {"name":"周禾","text":"你到底怎么了？怎么刚醒就急着找林晴，见到她还哭成这样？"},
    {"name":"陈妍","text":"看见你和林晴都好好的，我很开心"},
    {"name":"江晓","text":"真好"}
  ],
  "023": [
    {"name":"林晴","text":"等我康复了，我们去哪里玩？"},
    {"name":"周禾","text":"你俩醒了，真好……找个时间我们一起去给陈妍送花吧？"}
  ],
  "020": [
    {
      "name": "林晴",
      "text": "一想到【玩家名字】最后只会记得我一个人，就好开心。"
    }
  ]
};
 const descriptions={
  "001": "校园新规生效，没有按规则待在宿舍楼内，或许你不该同意出门购物。",
  "002": "16点后才能离开宿舍屋内。",
  "003": "输入的时候，你应该仔细一点。",
  "004": "你真的知道现在是几点吗？如实回答你所知道的，并严格按照问卷规则进行回答。",
  "005": "违反规则，独自进入电梯。",
  "006": "第二日进入错误宿舍，触发更换宿舍禁令。再仔细看看电梯数字变化的规律吧。",
  "007": "对峙中公开质疑站队者，让学生会受到了太大的威胁。",
  "008": "在对峙上似乎选择了太多错误的选项，连续失利",
  "009": "第二日江晓相关对峙缺少必要支持，自由行动选择上出现了错误。",
  "010": "第二日接受并公开了指向叶琳的误导信息，最终导致叶琳被冤枉",
  "011": "错误检举累计达到两次，触发错误次数限制。",
  "012": "检举倒计时结束，玩家尚未提交回答。",
  "013": "未及时补充食物，生命值不足导致请离。",
  "014": "没有找到有效的线索，大家投出了错误的人，学生会也碰巧选择了清除你。",
  "015": "第一日投出赵诗雨，温宁的话在大家心里种下了怀疑的种子",
  "016": "一个本可以在今晚保护你的人离开了",
  "017": "最终日检举错误，导致全军覆没",
  "018": "回复已离校的同学，导致违规离校。",
  "019": "再次睁开眼睛时，映入眼帘的不是熟悉的宿舍，而是医院的天花板。\n\n你成功回到了现实。",
  "020": "外面的世界，本就是她一直想逃避的地方。\n而在这里，你只认识她，也只会依赖她。与你相伴的日子幸福得近乎虚假，她却甘愿沉溺其中，越来越不想醒来。",
  "021": "你成功回到了现实。\n也终于找到了那个你曾答应过，无论多久都会等下去的人。",
  "022": "你成功回到了现实，林晴却在凌晨停止了呼吸。",
  "023": "你握住了她的手，一起回到了现实。",
  "024": "没有新的有效线索扭转局面，叶琳因自己的莽撞被冤枉。"
};
 window.hospitalEndingInfo=Object.freeze({id:'019',name:endings.find(e=>e.id==='019').name,description:descriptions['019']});
 window.hospitalEndingInfoFor=(progress=state)=>{const id=hospitalEndingId(progress),ending=endings.find(e=>e.id===id);return {id,name:ending.name,category:ending.category,description:descriptions[id]}};
 function letterAvatar(name){
  if(name==='黑头像')return '<span class="ending-letter-avatar ending-letter-black" aria-hidden="true"></span>';
  if(name==='作者')return '<span class="ending-letter-avatar ending-letter-author" aria-hidden="true"><img src="assets/ui-flower.svg?v=20261011-rc5" alt=""></span>';
  const person=Object.values(FA_PEOPLE).find(p=>p.name===name);
  return avatar(person?.avatar||PORTRAIT_CHARACTERS[name]||'student0');
 }
 let selectedFilter='all';
 function archiveBack(action,label){return window.AndroidGameRuntime?'<nav class="android-archive-back"><button type="button" class="icon-button" data-action="'+action+'" aria-label="'+label+'">'+icon('back')+'</button></nav>':''}
 const categories=[['all','全部'],['survival','生存结局'],['departure','请离结局'],['hidden','隐藏结局']];
 function card(ending,ready,mini=false){
  return '<'+(mini?'div':'button type="button"')+' class="ending-card '+(ready?'is-collected':'is-locked')+(mini?' ending-card-mini':'')+'" '+(mini?'':ready?'data-ending-detail="'+ending.id+'"':'disabled aria-label="'+(ending.hidden?'隐藏结局 '+ending.id:'结局 '+ending.id)+'，未解锁"')+'><span class="ending-card-art" aria-hidden="true"></span><span class="ending-card-number">'+(ending.hidden?'结局'+ending.id:'NO. '+ending.id)+'</span><span class="ending-card-symbol" aria-hidden="true">'+icon(ready?'file':'lock')+'</span><strong>'+ (ready?esc(ending.name):'？？？')+'</strong><span class="ending-card-caption">'+(ready?'已收录 · 查看结局':'尚未解锁')+'</span></'+(mini?'div':'button')+'>';
 }
 function openGallery(filter=selectedFilter){
  if(view!=='game-menu')return;migrate();closeSheet();active=null;z().menu=true;
  selectedFilter=categories.some(c=>c[0]===filter)?filter:'all';
  const records=read(),count=endings.filter(e=>records[e.id]).length;
  const visible=endings.filter(e=>selectedFilter==='all'||(e.category||'departure')===selectedFilter);
  screen.innerHTML='<section class="ending-gallery ending-archive">'+archiveBack('ending-gallery-back','返回游戏主页')+'<header class="ending-gallery-head"><small>STORY ARCHIVE</small><h1>结局图鉴</h1><p>已收集 <strong>'+count+'</strong> / '+endings.length+'</p></header><nav class="ending-filters" aria-label="结局分类">'+categories.map(c=>'<button type="button" data-ending-filter="'+c[0]+'" aria-pressed="'+(selectedFilter===c[0])+'">'+c[1]+'</button>').join('')+'</nav><div class="ending-grid">'+visible.map(e=>card(e,!!records[e.id])).join('')+'</div>'+(!visible.length?'<p class="ending-empty">这一页，尚待故事写下。</p>':'')+'<button class="ending-exit" data-action="ending-gallery-back">返回游戏主页</button></section>';
  screen.scrollTop=0;zeroChrome();
 }
 let treeDetailReturn=null;
 function openDetail(id,returnToTree=null){
  const ending=endings.find(e=>e.id===id);if(!ending||!read()[id]||!(view==='game-menu'||view==='nodes'&&typeof returnToTree==='function'))return;
  treeDetailReturn=typeof returnToTree==='function'?returnToTree:null;view='game-menu';
  closeSheet();active=null;z().menu=true;
  const messages=(letters[id]||[]).map(m=>ending.hidden||id==='021'?{...m,text:m.text.replaceAll('【玩家名字】',state.profile?.name||'同学')}:m);
  const devotion=id==='020';
  screen.innerHTML='<section class="ending-detail-page ending-archive'+(devotion?' ending-devotion':'')+'">'+archiveBack('ending-gallery','返回图鉴')+'<header class="ending-gallery-head"><small>STORY ARCHIVE · '+(ending.hidden?'结局'+id+' · 隐藏结局':id)+'</small><h1>'+esc(ending.name)+'</h1></header><p class="ending-description">'+esc(descriptions[id]||'')+'</p><section class="ending-letters" aria-label="角色留言"><h2>留在故事里的话</h2>'+messages.map(m=>'<article class="ending-letter">'+letterAvatar(m.name)+'<div><strong>'+esc(m.name)+'</strong><p>'+esc(m.text)+'</p></div></article>').join('')+(!messages.length?'<p class="ending-empty">暂无留言</p>':'')+'</section>'+(ending.hint?'<section class="ending-detail-hint"><h2>提示</h2><p>'+esc(ending.hint)+'</p></section>':'')+'<button class="ending-exit" data-action="ending-gallery">返回图鉴</button><button class="ending-exit" data-action="ending-gallery-back">返回游戏主页</button></section>';
  screen.scrollTop=0;zeroChrome();
 }
 function acknowledge(id){const records=read();if(records[id]){records[id].noticePending=false;try{GameStorage.setItem(key,JSON.stringify(records))}catch{toast('无法保存结局，请检查浏览器存储权限')}}}
 function showCollection(id){
  const ending=endings.find(e=>e.id===id);if(!ending)return;
  closeSheet();screen.innerHTML='<section class="ending-collection ending-archive" role="dialog" aria-modal="true" aria-label="新结局已收录"><small>STORY ARCHIVE</small><h1>新结局已收录</h1><p>「'+esc(ending.name)+'」</p>'+card(ending,true,true)+'<button class="ending-collect-open" data-ending-collected="'+id+'">查看结局</button><button class="ending-exit" data-ending-dismiss="'+id+'">返回游戏主页</button></section>';
  screen.scrollTop=0;screen.querySelector('[data-ending-collected]')?.focus();
 }
 // Capture before the story's locked-screen guards. Normal exits retain their original
 // confirmation flow; only a first collection replaces that exit with the archive notice.
 window.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button)return;
  if(button.dataset.action==='zero-menu'&&screen.querySelector('.zero-death')){
   decorateDeath();const id=deathId()||'003';if(!read()[id]?.noticePending)return;
   event.preventDefault();event.stopImmediatePropagation();if(typeof playInteractionSound==='function')playInteractionSound('button');showCollection(id);return;
  }
  const id=button.dataset.endingCollected||button.dataset.endingDismiss;if(!id)return;
  event.preventDefault();event.stopImmediatePropagation();if(typeof playInteractionSound==='function')playInteractionSound('button');acknowledge(id);
  actions['zero-menu-confirm']();
  if(button.dataset.endingCollected)openDetail(id);
 },true);
 const baseMenu=decorateGameMenu;decorateGameMenu=function(...args){const result=baseMenu(...args);addMenuEntry();return result};
 const baseZeroDeath=zeroDeath;zeroDeath=function(...args){const result=baseZeroDeath(...args);decorateDeath();return result};
 const baseLateDeath=renderLateDeath;renderLateDeath=function(...args){const result=baseLateDeath(...args);decorateDeath();return result};
 const baseReportDeath=renderReportDeath;renderReportDeath=function(...args){const result=baseReportDeath(...args);decorateDeath();return result};
 const baseSurveyRender=surveyRender;surveyRender=function(...args){const result=baseSurveyRender(...args);decorateDeath();return result};
 window.endingGalleryOpenFromTree=(id,onReturn)=>{
  if(view!=='nodes'||typeof onReturn!=='function')return;
  migrate();openDetail(String(id).replace(/^death-/,''),onReturn);
  if(!treeDetailReturn)return;
  const page=screen.querySelector('.ending-detail-page');page.dataset.treeReturn='true';
  page.querySelectorAll('[data-action="ending-gallery"]').forEach(button=>{if(button.classList.contains('ending-exit'))button.textContent='返回再一次抉择';else button.setAttribute('aria-label','返回再一次抉择')});
  page.querySelectorAll('[data-action="ending-gallery-back"]').forEach(button=>button.remove());
 };
 actions['ending-gallery']=()=>{
  if(treeDetailReturn&&screen.querySelector('.ending-detail-page[data-tree-return]')){const back=treeDetailReturn;treeDetailReturn=null;back();return}
  treeDetailReturn=null;openGallery();
 };
 actions['ending-gallery-back']=()=>{closeSheet();zeroMenu();screen.scrollTop=0};
 document.addEventListener('click',event=>{const button=event.target.closest('[data-ending-detail],[data-ending-filter]');if(!button)return;event.preventDefault();if(button.dataset.endingDetail)openDetail(button.dataset.endingDetail);else openGallery(button.dataset.endingFilter)});
 // Covers restored death screens and existing renderers without changing their markup or flow.
 new MutationObserver(()=>{decorateDeath();addMenuEntry()}).observe(screen,{childList:true,subtree:true});
 migrate();decorateDeath();addMenuEntry();
})();
