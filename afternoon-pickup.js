/* First afternoon delivery: persisted stages, one atomic inventory receipt. */
const PICKUP16_IMAGES={corridor:'assets/pickup16-fourth-floor.jpg',elevator:'assets/pickup16-elevator.png',door:'assets/pickup16-door.png',handle:'assets/pickup16-handle.png',screen:'assets/pickup16-screen.png',cabinet:'assets/pickup16-cabinet.jpg'};
const PICKUP_DAY2_IMAGES={p1:'assets/pickup-day2-p1.png',p2:'assets/pickup-day2-p2.jpg',p3:'assets/pickup-day2-p3.png',p4:'assets/pickup-day2-p4.png',solo:'assets/pickup-day2-solo-elevator.png',panel:'assets/day2-elevator-panel.png',lobby:'assets/day2-elevator-lobby.png',corridor:'assets/day2-elevator-corridor.png',wrongRoom:'assets/day2-wrong-dorm.png',door804:'assets/day2-door-804.png',openDorm:'assets/day2-wrong-room-door.jpg',ownRoom:'assets/food-cg-dorm.png',returnRoom:'assets/day2-return-dorm.png',sleep:'assets/day-zero-bedroom.jpg'};
const pickup16Base={home,openApp,openChat,forum,faEndTransition,deliveryDetail};
let pickup16Timer=null,pickup16Rendering=false,pickup16Internal=false,pickup16History=false;
function pickup16State(){return state.game.day===4?state.story?.dayFourPickup:state.game.day===3?state.story?.dayThreePickup:state.game.day===2?state.story?.dayTwoPickup:state.story?.afternoonPickup}
function migratePickupDay2Phase(progress=state){const p=progress.story?.dayTwoPickup;if(!p||progress.game.day!==2)return;const old=p.phase;if(['d2-abandon','d2-sleep-intro','d2-sleep-choice','d2-wake'].includes(old)||p.abandoned&&!progress.story.dayTwoEvening){if(p.sleepRewardApplied)progress.game.spirit=Math.max(0,(progress.game.spirit??100)-5);delete p.sleepRewardApplied;delete p.abandoned;delete progress.story.secondDayPickupCommonReady;p.done=false;p.phase='d2-choice'}if(['d2-solo-confirm','d2-solo'].includes(old))p.phase='d2-choice';else if(old==='d2-solo-lie')p.phase='d2-solo-elevator';else if(old==='d2-solo-death')p.phase='d2-solo-notice';const valid=new Set(['notice','d2-rule','d2-choice','d2-invite','d2-question','d2-reply','d2-reply-0','d2-reply-1','d2-reply-2','d2-reassure-choice','d2-reassure-answer','d2-solo-chat','d2-solo-reply-wait','d2-solo-ok','d2-solo-yes','d2-solo-single','d2-solo-answer','d2-pull','d2-solo-elevator','d2-solo-notice','d2-depart','elevator','hall','door','opening','counter','input','order','success','d2-return','d2-floor','d2-notebook','d2-lobby','d2-platform','d2-corridor','d2-corridor-choice','d2-other-floor','d2-floor-return','d2-room','d2-room-door','d2-wrong-room','d2-room-death','d2-own-room','d2-common','done','failed']);if(!valid.has(p.phase))p.phase='d2-choice';if(p.phase!==old){p.dialogueIndex=0;delete p.due;if(progress===state)persist()}}
migratePickupDay2Phase();
function pickup16Locked(){if(storyInputDormant()||storyEndingOwner())return false;const p=pickup16State();return !!(p&&!p.done)}
function pickup16Targets(){
 const now=state.system.date+' '+state.system.time;
 return deliveryOrders().filter(o=>{deliveryPrepare(o);if(o.expired||o.collectedAt||o.status==='已完成'||o.deliveryDate!==state.system.date)return false;if(o.status==='待配送'&&now>=o.deliveryDate+' 07:30'&&now<o.deliveryDate+' 22:00')o.status='待领取';return o.status==='待领取'});
}
function pickup16GrantOrders(p){
 // Reconcile the pickup against actual arrived orders, even if the scene captured an empty list.
 p.orderIds=[...new Set([...(p.orderIds||[]),...pickup16Targets().map(o=>o.id)])];state.game.inventory??=[];let count=0;
 for(const id of p.orderIds){const o=deliveryOrders().find(item=>item.id===id);if(!o||o.status!=='待领取'||o.expired||o.collectedAt||o.deliveryDate!==state.system.date)continue;
  for(const line of o.lines){const item=state.game.inventory.find(item=>item.name===line.name);if(item)item.quantity+=line.quantity;else state.game.inventory.push({id:line.id,name:line.name,quantity:line.quantity})}
  o.status='已完成';o.seenStatus='已完成';o.collectedAt=state.system.date+' '+state.system.time;o.pickup16Collected=true;count++;
 }return count;
}
function pickup16Begin(force=false){if(state.game.day>=3)return;const dayTwo=state.game.day===2;if(dayTwo&&!force)return;const slot=dayTwo?'dayTwoPickup':'afternoonPickup';if(state.story?.[slot]||(!force&&(!fa().finished||fa().completed.length<FREE_ACTION_LIMIT)))return;suspicionDay();const orders=pickup16Targets(),active=force||orders.length>0;state.story[slot]={phase:active?'notice':'done',done:!active,startedTime:state.system.time,orderIds:orders.map(o=>o.id),input:'',error:false,dialogueIndex:0};if(!active){state.story.afternoonCommonReady=true;persist();return}for(const o of orders)o.pickupCode=dayTwo?'7431':'6116';if(!dayTwo)capturePickupCheckpoint();persist();pickup16Render();playNotificationSound('logistics')}
function d3PickupBegin(){
 if(state.game.day!==3||state.story.dayThreePickup&&!state.story.dayThreePickup.noOrder)return;
 const orders=pickup16Targets();
 // Historical saves may predate mandatory shopping; never invent inventory or replay Day 1.
 if(!orders.length){
  state.story.dayThreePickup={phase:'order-required',done:true,noOrder:true};persist();home();
  sheet('未找到待取订单','<p>当前读档进度中没有第二晚购买、第三日待领取的物资。</p><p>请通过「再一次抉择」回到第二晚，完成购物后再继续。</p><button class="primary" data-action="d3-pickup-rewind">前往再一次抉择</button>');return;
 }
 if(state.system.time<'16:00'){state.system.time='16:00';status()}
 for(const o of orders)o.pickupCode=deliveryCodeForDate(state.system.date);
 state.story.dayThreePickup={phase:'notice',done:false,startedTime:state.system.time,orderIds:orders.map(o=>o.id),input:'',error:false,dialogueIndex:0};persist();pickup16Render();playNotificationSound('logistics');
}
actions['d3-pickup-rewind']=()=>{if(state.game.day!==3||!state.story.dayThreePickup?.noOrder)return;closeSheet();pickup16Cleanup();view='game-menu';zeroNodes()};
let pickupAscentSound=null,pickupAscentOwner=null,pickupAscentPhase=null;
function stopPickupAscentSound(){if(pickupAscentSound){pickupAscentSound.pause();pickupAscentSound.currentTime=0}pickupAscentOwner=null;pickupAscentPhase=null}
function syncPickupAscentSound(p){
 if(!p||p.done||!['elevator','d2-solo-elevator'].includes(p.phase)){stopPickupAscentSound();return}
 if(document.hidden||pickupAscentOwner===p&&pickupAscentPhase===p.phase)return;
 pickupAscentOwner=p;pickupAscentPhase=p.phase;
 if(typeof mobileSounds!=='undefined'&&mobileSounds.silent)return;
 try{if(!pickupAscentSound){pickupAscentSound=new Audio('assets/audio/elevator-ascent.mp3');pickupAscentSound.volume=.5;pickupAscentSound.loop=false}pickupAscentSound.currentTime=0;const playing=pickupAscentSound.play();if(playing&&playing.catch)playing.catch(()=>{})}catch(error){}
}
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopPickupAscentSound()});
window.addEventListener('pagehide',stopPickupAscentSound);
function pickup16Set(phase){const p=pickup16State();if(!p||p.done)return;clearTimeout(pickup16Timer);p.phase=phase;p.dialogueIndex=0;if(phase==='opening'&&typeof playInteractionSound==='function')playInteractionSound('glassDoor');if(state.game.day===2&&phase==='d2-floor')pickupDay2PuzzleStart(p);if(phase==='elevator')p.readyAt=Date.now()+2000;persist();pickup16Render()}
function pickup16Root(){let root=document.querySelector('#pickup16');if(!root){root=document.createElement('section');root.id='pickup16';document.querySelector('#phone').append(root)}root.className='';return root}
function pickup16Backdrop(root,key){root.className='pickup16-scene';root.innerHTML=`<img class="pickup16-background" src="${PICKUP16_IMAGES[key]}" alt="${{corridor:'宿舍走廊',elevator:'前往七楼的电梯',door:'七楼玻璃门',handle:'玻璃门把手',screen:'取货柜台屏幕',cabinet:'无人机取货柜'}[key]}">`}
function pickupDay2Backdrop(root,key){root.className='pickup16-scene pickup-day2-scene';root.innerHTML=`<img class="pickup16-background" src="${PICKUP_DAY2_IMAGES[key]}" alt="${state.game.day===3?'第三日':'第二日'}取件剧情">`}
function pickupDay2Dialogue(root,key,rows,next){const p=pickup16State(),phase=p.phase;pickupDay2Backdrop(root,key);CGDialogue.present(root,rows,{index:p.dialogueIndex||0,firstReplyConfirmed:['d2-invite','d2-reply-0','d2-reply-1','d2-reply-2','d2-reassure-answer','d2-solo-answer'].includes(phase),onIndex:i=>{if(pickup16State()===p){p.dialogueIndex=i;persist()}},onComplete:()=>{if(pickup16State()===p&&p.phase===phase)pickup16Set(next)}})}
function pickupDay2Choices(root,key,text,choices,speaker=null){pickupDay2Backdrop(root,key);cgChoiceDialogue(root,{text,speaker},{lastPage:false});root.insertAdjacentHTML('beforeend',`<div class="pickup-day2-options cg-options ${choices.length===1?'single':''}">${choices.map(([action,label])=>`<button data-pickup16="${action}">${esc(cgText(label,'me'))}</button>`).join('')}</div>`);capturePickupDay2Choice()}
function pickup16Code(p=pickup16State()){return p&&p===state.story.dayFourPickup?'9264':p&&p===state.story.dayThreePickup?'5826':p===state.story.dayTwoPickup?'7431':'6116'}
function pickup16Dialogue(root,key,rows,next){const p=pickup16State(),phase=p.phase;pickup16Backdrop(root,key);CGDialogue.present(root,rows,{index:p.dialogueIndex||0,onIndex:i=>{if(pickup16State()===p){p.dialogueIndex=i;persist()}},onComplete:()=>{if(pickup16State()===p&&p.phase===phase)pickup16Set(next)}})}
function pickup16Card(root,title,body,buttons){root.insertAdjacentHTML('beforeend',`<section class="pickup16-card" role="dialog" aria-modal="true" aria-label="${esc(title)}"><h2>${title}</h2>${body}<div class="pickup16-buttons">${buttons}</div></section>`)}
function pickup16Button(action,text,secondary=false){return `<button type="button" class="${secondary?'secondary':'primary'}" data-pickup16="${action}">${text}</button>`}
function pickup16Render(){const p=pickup16State();syncPickupAscentSound(p);if(!p||p.done)return;if(p===state.story.dayTwoPickup&&['d2-solo-chat','d2-solo-reply-wait','d2-solo-ok'].includes(p.phase)){if(p.phase==='d2-solo-chat'&&!p.soloChatOpened)return pickupDay2SoloNotice();return pickupDay2OpenLinChat()}document.querySelector('#day2-pickup-lin-notice')?.remove();if(pickup16Rendering){queueMicrotask(()=>{if(pickup16State()===p)pickup16Render()});return}pickup16Rendering=true;const previousRoot=document.querySelector('#pickup16'),previousImage=previousRoot?.querySelector('.pickup16-background:not(.cg-outgoing-image)')?.cloneNode(true),previousEntry=previousImage?null:captureSceneSnapshot(previousRoot||screen);try{clearTimeout(pickup16Timer);clearInterval(cgTypingTimer);closeSheet();document.querySelector('#phone').classList.add('pickup16-active');if(!pickup16History){history.pushState({pickup16:true},'',location.href);pickup16History=true}const root=pickup16Root();
 if(p.phase==='order'){if(!p.orderIds[0]){const order=pickup16Targets()[0]||deliveryOrders().find(item=>!item.expired&&item.deliveryDate===state.system.date);if(order){order.pickupCode=pickup16Code(p);p.orderIds=[order.id];persist()}}root.remove();if(p.orderIds[0]){pickup16Internal=true;try{pickup16Base.deliveryDetail(p.orderIds[0])}finally{pickup16Internal=false}screen.querySelector('.parcel-go')?.remove();const ticket=screen.querySelector('.parcel-ticket');if(ticket){ticket.querySelector('.parcel-code').textContent=pickup16Code(p);ticket.querySelector('.parcel-code').previousElementSibling.textContent='取件码'}}else{view='delivery-detail';active=null;rememberRoute();screen.innerHTML=`<section class="app-page parcel-page"><header class="page-head"><h1>包裹详情</h1></header><div class="parcel-ticket"><div><small>领取柜号</small><strong>—<span>号柜</span></strong></div><div><small>取件码</small><strong class="parcel-code">${pickup16Code(p)}</strong></div><p>请于今日22:00前领取</p></div></section>`}document.querySelector('#pickup16-return')?.remove();const button=document.createElement('button');button.id='pickup16-return';button.dataset.pickup16='counter';button.textContent='继续取件';document.querySelector('#phone').append(button);return}
 document.querySelector('#pickup16-return')?.remove();view='afternoon-pickup';active=null;rememberRoute();root.innerHTML='';
 if(state.game.day===4&&typeof d4PickupScene==='function'&&d4PickupScene(root,p))return;
 if(p.phase==='notice'){root.className='pickup16-notice';pickup16Card(root,'校园物流','<span class="pickup16-mark">'+icon('drone')+'</span><p>你有物资正在女生B栋楼顶接收平台等待领取</p>',pickup16Button('start','立即前往取件'));return}
 if(state.game.day===3&&p===state.story.dayThreePickup){
  if(p.phase==='d3-depart'){pickupDay2Dialogue(root,'p3',['电梯门在你们身后缓缓合上。'],'elevator');return}
  if(p.phase==='d3-return'){pickupDay2Dialogue(root,'returnRoom',['你和林晴回到了宿舍',{speaker:'linqing',text:state.profile.name+'，你的病还没完全好'},{speaker:'linqing',text:'喝点水，先躺床上休息一下吧'},'你点了点头，去到了自己的床上。'],'d3-done');return}
  if(p.phase==='d3-done'){p.done=true;p.phase='done';persist();pickup16Cleanup();d3EveningStart();return}
 }
 if(state.game.day===2&&p===state.story.dayTwoPickup){
  p.startedTime??=state.system.time;if(pickupDay2PuzzleRender(root,p))return;
  if(p.phase==='d2-rule'){pickupDay2Dialogue(root,'p1',['开门后，你突然想起来今天新增的规定。\n不要独自进入电梯。','现在整个四楼，你只认识林晴。要邀请她一起去取件吗？'],'d2-choice');return}
  if(p.phase==='d2-choice'){pickupDay2Choices(root,'p1','要邀请她一起去取件吗？',[['d2-invite','邀请林晴'],['d2-solo','自己去']]);return}
  if(p.phase==='d2-invite'){pickupDay2Dialogue(root,'p1',[{speaker:'me',text:'林晴，我们一起去取物资吧'},{speaker:'linqing',text:'好啊'}],'d2-question');return}
  if(p.phase==='d2-question'){pickupDay2Dialogue(root,'p2',['你们一起来到电梯前，林晴伸手按下了上行按钮。',{speaker:'linqing',text:'你就不怕我是学生会的人吗？'}],'d2-reply');return}
  if(p.phase==='d2-reply'){pickupDay2Choices(root,'p2','你就不怕我是学生会的人吗？',[['d2-reply-0','我不怕，大不了就重开。'],['d2-reply-1','我相信你是好人。'],['d2-reply-2','其实我昨天检举过你，但系统显示失败了。']],'linqing');return}
  if(p.phase==='d2-reply-0'){pickupDay2Dialogue(root,'p2',[{speaker:'me',text:'我不怕，大不了就重开'},{speaker:'linqing',text:'……重开？'}],'d2-reassure-choice');return}
  if(p.phase==='d2-reassure-choice'){pickupDay2Choices(root,'p2','你把这里当成游戏吗？别拿自己的命开玩笑',[['d2-reassure-answer','好啦好啦，下次不会了']],'linqing');return}
  if(p.phase==='d2-reassure-answer'){pickupDay2Dialogue(root,'p2',[{speaker:'me',text:'好啦好啦，下次不会了'},{speaker:'linqing',text:'可不能再这样了'},{speaker:'linqing',text:'算了，先进电梯吧'}],'d2-depart');return}
  if(p.phase==='d2-reply-1'){pickupDay2Dialogue(root,'p2',[{speaker:'me',text:'我相信你是好人'},{speaker:'linqing',text:'那你相信对了'},{speaker:'me',text:'第六感一向很准啦'},{speaker:'linqing',text:'我也相信你'},{speaker:'linqing',text:'走吧，电梯到了'}],'d2-depart');return}
  if(p.phase==='d2-reply-2'){pickupDay2Dialogue(root,'p2',[{speaker:'me',text:'其实我昨天检举过你，但系统显示失败了'},{speaker:'linqing',text:'我不相信你会检举我，别开玩笑了'},{speaker:'me',text:'你就这么相信我？'},{speaker:'linqing',text:'走吧，电梯到了'}],'d2-depart');return}
  if(p.phase==='d2-solo-yes'){pickupDay2Dialogue(root,'p2',[{sfx:'doorCloseChase',text:'你刚准备走进电梯，身后突然传来宿舍门被用力关上的声音。'},{sfx:'runningSteps',text:'急促的脚步声由远及近，你回头望去是林晴追了上来。'}],'d2-solo-single');return}
  if(p.phase==='d2-solo-single'){pickupDay2Choices(root,'p2',state.profile.name+'，你不要命了吗？！',[['d2-solo-answer','你怎么过来了？']],'linqing');return}
  if(p.phase==='d2-solo-answer'){pickupDay2Dialogue(root,'p2',[{speaker:'me',text:'你怎么过来了'},{speaker:'linqing',text:'我陪你去'}],'d2-pull');return}
  if(p.phase==='d2-pull'){pickupDay2Dialogue(root,'p3',['你还没来得及拒绝，林晴已经强势地抓住你的手腕，将你拉进了电梯。'],'elevator');return}
  if(p.phase==='d2-solo-elevator'){pickupDay2Dialogue(root,'solo',['你独自走进电梯，按下了七楼。'],'d2-solo-notice');return}
  if(p.phase==='d2-solo-notice'){pickupDay2CampusNotice(root,'solo','d2-campus-notice');return}
  if(p.phase==='d2-depart'){pickupDay2Dialogue(root,'p3',['电梯门在你们身后缓缓合上。'],'elevator');return}
  if(p.phase==='d2-return'){pickupDay2Dialogue(root,'panel',['取件完毕后，你们又回到了电梯内。','刚准备按下按钮，就发现了不对劲的地方。',{speaker:'linqing',text:'这是怎么回事'},'电梯的按钮数字被打乱了。楼层数字从下到上依次是1758392。\n现在有个问题摆在眼前，你们该去几楼？'],'d2-floor');return}
 }
 if(p.phase==='corridor'){pickup16Dialogue(root,'corridor',['走廊里很安静。','大部分宿舍门依然紧闭着。'],'elevator');return}
 if(p.phase==='elevator'){pickup16Backdrop(root,'elevator');const left=Math.max(0,(p.readyAt||0)-Date.now());root.insertAdjacentHTML('beforeend',`<div class="pickup16-travel"><h2>正在前往7楼……</h2><button data-pickup16="arrive" ${left?'disabled':''}>${left?'':'点击继续'}</button></div>`);if(left)pickup16Timer=storyTimeout(()=>{if(pickup16State()===p&&p.phase==='elevator')pickup16Render()},left);return}
 if(p.phase==='hall'){pickup16Set('door');return}
 if(p.phase==='door'){pickup16Backdrop(root,'handle');root.insertAdjacentHTML('beforeend','<button class="pickup16-door-hotspot" data-pickup16="open-door" aria-label="点击玻璃门开门"><span>点击此处开门</span></button>');return}
 if(p.phase==='opening'){pickup16Backdrop(root,'handle');root.classList.add('pickup16-opening');pickup16Timer=storyTimeout(()=>{if(pickup16State()===p&&p.phase==='opening')pickup16Set('counter')},850);return}
 if(p.phase==='counter'){pickup16Backdrop(root,'screen');root.classList.add('pickup16-machine');pickup16Card(root,'请输入取件码','',pickup16Button('input','输入取件码')+pickup16Button('forgot','忘记取件码',true));return}
 if(p.phase==='input'){pickup16Backdrop(root,'screen');root.classList.add('pickup16-machine');pickup16Card(root,'请输入取件码',`<form id="pickup16-code"><div class="pickup16-machine-label"><span>校园物流 · 自助取件</span><i>等待输入</i></div><output class="pickup16-code-display" aria-label="已输入的取件码" aria-live="polite"></output><div class="pickup16-keypad">${[1,2,3,4,5,6,7,8,9].map(n=>'<button type="button" data-pickup-digit="'+n+'">'+n+'</button>').join('')}<button type="button" data-pickup-backspace aria-label="删除最后一位">退格</button><button type="button" data-pickup-digit="0">0</button><button class="pickup16-key-confirm" type="submit">确认</button></div></form>`,pickup16Button('forgot','忘记取件码',true));const form=root.querySelector('form'),display=form.querySelector('output'),confirm=form.querySelector('[type="submit"]');const refresh=()=>{display.textContent=p.input||'— — — —';display.classList.toggle('is-empty',!p.input);confirm.disabled=!p.input;display.scrollLeft=display.scrollWidth};refresh();form.onclick=e=>{const key=e.target.closest('[data-pickup-digit],[data-pickup-backspace]');if(!key||pickup16State()!==p||p.phase!=='input')return;p.input=key.hasAttribute('data-pickup-backspace')?p.input.slice(0,-1):p.input+key.dataset.pickupDigit;persist();refresh()};form.onsubmit=e=>{e.preventDefault();pickup16Collect()};return}
 if(p.phase==='success'){pickup16Backdrop(root,'cabinet');root.classList.add('pickup16-machine');pickup16Card(root,'订单领取成功','<p>物资已加入背包<br>点击“健康状态”App可查看和使用</p>',pickup16Button('leave','继续'));return}
 if(p.phase==='discovery'){pickup16Dialogue(root,'screen',['你刚准备离开，却注意到屏幕下方有一行很小的文字。'],'record-choice');return}
 if(p.phase==='record-choice'){pickup16Backdrop(root,'screen');const first=!p.recordHotspotSeen;p.recordHotspotSeen=true;persist();root.insertAdjacentHTML('beforeend','<button class="pickup16-record-hotspot '+(first?'first-reveal':'')+'" data-pickup16="record">取件记录</button><p class="pickup16-record-hint">点击屏幕上的“取件记录”</p>');pickup16PositionRecord(root);return}
 if(p.phase==='record'){root.className='pickup16-record-page';root.innerHTML='<header><small>校园物流 · 取件记录</small><h2>订单领取记录</h2></header><div class="pickup16-record-entry"><time>07:38</time><span>领取完成</span></div><section class="pickup16-record-share"><p>是否将取件记录发送到群内？</p>'+pickup16Button('publish-record','把取件记录发到群里')+pickup16Button('keep-record','暂时不说',true)+'</section>';return}

 }finally{const currentImage=document.querySelector('#pickup16 .pickup16-background:not(.cg-outgoing-image)');if(currentImage){currentImage.style.animation='none';if(previousImage)cgImageCrossfade(previousImage,currentImage);else if(previousEntry){previousEntry.removeAttribute('id');previousEntry.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));Object.assign(previousEntry.style,{position:'absolute',inset:'0',width:'100%',height:'100%',background:'#18171c',zIndex:'2'});if(previousEntry.sceneBounds){previousEntry.style.width=previousEntry.sceneBounds.width+'px';previousEntry.style.height=previousEntry.sceneBounds.height+'px'}currentImage.parentElement.append(previousEntry);restoreSceneSnapshotScroll(previousEntry);cgFadeLayer(previousEntry,currentImage)}}pickup16Rendering=false}}
function pickup16Collect(){const p=pickup16State();if(!p||p.phase!=='input'||p.received)return;if(!/^[0-9]+$/.test(p.input.trim()))return;if(p.input.trim()!==pickup16Code(p)){pickup16WrongCode();return}pickup16GrantOrders(p);p.received=true;p.error=false;p.phase='success';p.dialogueIndex=0;persist();deliveryBadge();pickup16Render()}
function pickupDay2FinishFloor(){pickupDay2FloorSubmit()}
function pickupDay2SoloDeath(){const p=pickup16State();if(!p||p!==state.story.dayTwoPickup)return;p.phase='failed';p.done=true;state.story.dayTwoSoloElevatorDeath=true;pickup16Cleanup();clearInterval(cgTypingTimer);z().playerLeft=true;z().firstDeathClicked=false;delete z().firstDeathReadyAt;zeroPhase('pickup-code-death');zeroCampus();persist()}
function pickupDay2ChatMessage(id,text,sender='linqing'){
 const rows=state.messages.linqing??=[];if(rows.some(item=>item.id===id))return false;
 rows.push({id,type:'text',sender,name:sender==='me'?state.profile.name:'林晴',text,time:state.system.time,gameDate:state.system.date,...(sender==='me'?{status:'read'}:{})});
 const contact=state.contacts.find(item=>item.id==='linqing');if(contact){contact.preview=text;contact.time=state.system.time;contact.unread=view==='chat'&&active==='linqing'||sender==='me'?0:(contact.unread||0)+1}return true;
}
function pickupDay2SoloNotice(){
 const p=pickup16State();if(!p||p!==state.story.dayTwoPickup||!['d2-choice','d2-solo-chat'].includes(p.phase))return;
 p.phase='d2-solo-chat';const text=state.profile.name+'，你去哪了？';pickupDay2ChatMessage('day2-pickup-lin-1',text);persist();pickup16Cleanup();
 pickup16Internal=true;try{pickup16Base.home()}finally{pickup16Internal=false}
 const el=document.createElement('div');el.id='day2-pickup-lin-notice';el.className='opening-message';el.innerHTML='<button class="opening-body" data-pickup16="d2-open-chat"><span>'+avatar('linqing')+'</span><span><small>讯息 · '+esc(state.system.time)+'</small><strong>林晴</strong><span>'+esc(text)+'</span></span></button>';document.querySelector('#phone').append(el);playNotificationSound('message');
}
function pickupDay2OpenLinChat(){
 const p=pickup16State();if(!p||p!==state.story.dayTwoPickup||!['d2-solo-chat','d2-solo-reply-wait','d2-solo-ok'].includes(p.phase))return;
 pickup16Cleanup();if(p.phase==='d2-solo-chat'&&!p.soloChatOpened){p.soloChatOpened=true;p.due=Date.now()+2000;persist()}
 pickup16Internal=true;try{openChat('linqing')}finally{pickup16Internal=false}pickupDay2DecorateChat();pickupDay2ScheduleChat();
}
function pickupDay2DecorateChat(){
 const p=pickup16State();if(p!==state.story.dayTwoPickup||!['d2-solo-chat','d2-solo-reply-wait','d2-solo-ok'].includes(p.phase)||view!=='chat'||active!=='linqing')return;
 const composer=screen.querySelector('#composer');if(!composer)return;const ready=p.phase==='d2-solo-chat'&&state.messages.linqing?.some(item=>item.id==='day2-pickup-lin-2')&&Date.now()>=(p.soloChoicesReadyAt??Infinity);
 composer.querySelectorAll('button,textarea').forEach(item=>item.disabled=true);const input=composer.querySelector('textarea');if(input)input.placeholder=ready?'选择一条回复…':'等待中…';screen.querySelector('[data-day2-pickup-chat-choices]')?.remove();
 if(ready){composer.insertAdjacentHTML('beforebegin','<div class="zero-choices" data-day2-pickup-chat-choices><button data-pickup16="d2-solo-yes">是的。</button><button data-pickup16="d2-solo-lie">我和其他人约好了。</button></div>');capturePickupDay2Choice()}scrollMessages();
}
function pickupDay2ScheduleChat(){
 clearTimeout(pickup16Timer);const p=pickup16State();if(!p||p!==state.story.dayTwoPickup||p.done||view!=='chat'||active!=='linqing')return;
 if(p.phase==='d2-solo-chat'&&state.messages.linqing?.some(item=>item.id==='day2-pickup-lin-2')){
  p.soloChoicesReadyAt??=Date.now()+2000;persist();
  if(Date.now()>=p.soloChoicesReadyAt){pickupDay2DecorateChat();return}
  pickup16Timer=storyTimeout(()=>{if(pickup16State()===p&&!p.done&&p.phase==='d2-solo-chat'&&view==='chat'&&active==='linqing')pickupDay2DecorateChat()},p.soloChoicesReadyAt-Date.now());return;
 }
 if(!['d2-solo-chat','d2-solo-reply-wait','d2-solo-ok'].includes(p.phase))return;
 const phase=p.phase;p.due??=Date.now()+(phase==='d2-solo-ok'?1000:2000);persist();
 pickup16Timer=storyTimeout(()=>{
  if(pickup16State()!==p||p.done||p.phase!==phase||view!=='chat'||active!=='linqing')return;
  if(phase==='d2-solo-chat'){pickupDay2ChatMessage('day2-pickup-lin-2','你要一个人去取物资吗？');p.soloChoicesReadyAt=Date.now()+2000;delete p.due;persist();pickupDay2OpenLinChat()}
  else if(phase==='d2-solo-reply-wait'&&p.soloReply==='d2-solo-lie'){pickupDay2ChatMessage('day2-pickup-lin-ok','ok');p.phase='d2-solo-ok';p.due=Date.now()+1000;persist();pickupDay2OpenLinChat()}
  else if(phase==='d2-solo-reply-wait'){delete p.due;pickup16Set('d2-solo-yes')}
  else pickupDay2StartSoloElevator();
 },Math.max(0,p.due-Date.now()));
}
function pickupDay2SendReply(text,next){
 const p=pickup16State();if(p!==state.story.dayTwoPickup||p.phase!=='d2-solo-chat'||!state.messages.linqing?.some(item=>item.id==='day2-pickup-lin-2')||Date.now()<(p.soloChoicesReadyAt??Infinity))return;
 pickupDay2ChatMessage('day2-pickup-player-reply',text,'me');p.soloReply=next;p.phase='d2-solo-reply-wait';p.due=Date.now()+(next==='d2-solo-lie'?2000:1000);persist();pickupDay2OpenLinChat();
}
function pickupDay2StartSoloElevator(){const p=pickup16State();if(p!==state.story.dayTwoPickup||p.phase!=='d2-solo-ok')return;delete p.due;pickup16Set('d2-solo-elevator')}
actions['day2-pickup-lin-open']=pickupDay2OpenLinChat;
const PICKUP_DAY2_CHOICE_NODES={
 'd2-choice':{id:'day2-pickup-companion',title:'取件选择'},
 'd2-reply':{id:'day2-pickup-linqing-reply',title:'和林晴一同取件：选择回应方式'},
 'd2-solo-chat':{id:'day2-pickup-solo-reply',title:'独自取件：回复林晴'}
};
for(const node of Object.values(PICKUP_DAY2_CHOICE_NODES))if(!STORY_CHOICES.some(item=>item.id===node.id))STORY_CHOICES.push({...node,day:'第二日 · 取件',chat:null});
for(const retiredId of ['day2-pickup-linqing-arrives','day2-pickup-abandon-confirm']){const index=STORY_CHOICES.findIndex(item=>item.id===retiredId);if(index>=0)STORY_CHOICES.splice(index,1)}
function capturePickupDay2Choice(){const p=pickup16State(),node=p&&PICKUP_DAY2_CHOICE_NODES[p.phase];if(!node||p!==state.story.dayTwoPickup||p.done)return;return captureStoryNode(node.id,state,{route:{view:'afternoon-pickup',active:null}})}
function pickup16Record(){const p=pickup16State();if(p?.phase!=='record-choice')return;const clues=fa().clues;if(!clues.some(c=>c.id==='pickup16-record'))addNotebookClue({id:'pickup16-record',title:'07:38的取件记录',text:'一个订单在早晨07:38完成领取。\n当时宿舍禁令仍然生效，却没有人因此被请离。',date:state.system.date,time:state.system.time});pickup16Set('record')}
function pickup16Cleanup(){stopPickupAscentSound();clearTimeout(pickup16Timer);document.querySelector('#day2-pickup-lin-notice')?.remove();document.querySelector('#pickup16')?.remove();document.querySelector('#pickup16-return')?.remove();document.querySelector('#phone').classList.remove('pickup16-active')}
function pickup16Finish(){const p=pickup16State();if(p?.phase!=='record')return;p.done=true;p.phase='done';state.story.afternoonCommonReady=true;persist();pickup16Cleanup();pickup16Base.home()}
window.addEventListener('click',e=>{if(!pickup16Locked())return;const b=e.target.closest('[data-pickup16]'),root=e.target.closest('#pickup16');if(b){e.preventDefault();e.stopImmediatePropagation();const p=pickup16State(),action=b.dataset.pickup16,dayTwo=p===state.story.dayTwoPickup;if(dayTwo&&pickupDay2PuzzleAction(action,p))return;if(action==='start'&&p.phase==='notice')pickup16Set(state.game.day===4?'d4-door':state.game.day===3?'d3-depart':dayTwo?'d2-rule':'corridor');else if(action==='d2-invite'&&p.phase==='d2-choice')pickup16Set('d2-invite');else if(action==='d2-solo'&&p.phase==='d2-choice')pickupDay2SoloNotice();else if(action==='d2-open-chat'&&p.phase==='d2-solo-chat')pickupDay2OpenLinChat();else if(action.startsWith('d2-reply-')&&p.phase==='d2-reply'){const n=Number(action.at(-1));if(n>0){state.game.trust??={};state.game.trust.linqing=(state.game.trust.linqing??30)+5}pickup16Set(action)}else if(action==='d2-reassure-answer'&&p.phase==='d2-reassure-choice')pickup16Set('d2-reassure-answer');else if(action==='d2-solo-yes'&&p.phase==='d2-solo-chat')pickupDay2SendReply('是的','d2-solo-yes');else if(action==='d2-solo-lie'&&p.phase==='d2-solo-chat')pickupDay2SendReply('我和其他人约好了','d2-solo-lie');else if(action==='d2-solo-answer'&&p.phase==='d2-solo-single')pickup16Set('d2-solo-answer');else if(action==='d2-campus-notice'&&p.phase==='d2-solo-notice')pickupDay2SoloDeath();else if(action==='arrive'&&p.phase==='elevator'&&Date.now()>=p.readyAt)pickup16Set('hall');else if(action==='open-door'&&p.phase==='door')pickup16Set('opening');else if(action==='input'&&p.phase==='counter'){if(typeof playInteractionSound==='function')playInteractionSound('pickup');pickup16Set('input')}else if(action==='forgot'&&['counter','input'].includes(p.phase))pickup16Set('order');else if(action==='counter'&&p.phase==='order')pickup16Set('counter');else if(action==='leave'&&p.phase==='success')pickup16Set(state.game.day===4?'d4-return':state.game.day===3?'d3-return':dayTwo?'d2-return':'discovery');else if(action==='record')pickup16Record();else if(action==='publish-record'&&p.phase==='record')startRecordDiscussion();else if(action==='keep-record'&&p.phase==='record')pickup16Finish();return}if(root)return;e.preventDefault();e.stopImmediatePropagation()},true);
window.addEventListener('keydown',e=>{if(pickup16Locked()&&['Escape','BrowserBack','GoBack'].includes(e.key)){e.preventDefault();e.stopImmediatePropagation()}},true);
window.addEventListener('popstate',()=>{if(!pickup16Locked())return;history.pushState({pickup16:true},'',location.href);pickup16Render()});
home=function(...args){if(pickup16Locked()&&!pickup16Internal)return pickup16Render();const result=pickup16Base.home(...args);pickup16Begin();return result};
openApp=function(...args){if(pickup16Locked()&&!pickup16Internal)return pickup16Render();return pickup16Base.openApp(...args)};
openChat=function(...args){if(pickup16Locked()&&!pickup16Internal)return pickup16Render();return pickup16Base.openChat(...args)};
forum=function(...args){if(pickup16Locked()&&!pickup16Internal)return pickup16Render();return pickup16Base.forum(...args)};
faEndTransition=function(){pickup16Base.faEndTransition();pickup16Begin()};
const pickup16Restore=restoreFreeActionStart;restoreFreeActionStart=function(...args){pickup16Cleanup();return pickup16Restore(...args)};
const pickup16Initialize=initializeChapter;initializeChapter=function(...args){pickup16Cleanup();return pickup16Initialize(...args)};
capturePickupCheckpoint();
if(!window.mobileLaunch){if(pickup16Locked()){pickup16Render()}else if(view==='afternoon-pickup')pickup16Base.home();else if(fa().finished)pickup16Begin()}

function pickup16PositionRecord(root=document.querySelector('#pickup16')){const button=root?.querySelector('.pickup16-record-hotspot');if(!button)return;const w=root.clientWidth,h=root.clientHeight,scale=Math.max(w/941,h/1672);button.style.left=(w/2)+'px';button.style.top=((h-1672*scale)/2+983*scale)+'px';button.style.fontSize=Math.max(14,32*scale)+'px'}
window.addEventListener('resize',()=>pickup16PositionRecord());
function pickup16WrongCode(){const p=pickup16State();if(!p||p.phase!=='input'||p.failed)return;p.failed=true;p.done=true;p.phase='failed';state.story.afternoonCommonReady=false;state.story.pickupCodeDeath=true;pickup16Cleanup();clearInterval(cgTypingTimer);z().playerLeft=true;z().firstDeathClicked=false;delete z().firstDeathReadyAt;zeroPhase('pickup-code-death');zeroCall(home);zeroNotice('campus');persist()}

function pickupDay2CampusNotice(root,key,action){document.querySelector('#day2-pickup-lin-notice')?.remove();if(['where','warning'].includes(z().banner))zeroBanner(null);pickupDay2Backdrop(root,key);const notice=zeroWallNotice('campus')||{title:'校园通',text:'校园通状态已更新'};root.insertAdjacentHTML('beforeend','<div class="opening-message pickup-day2-campus-notice"><button class="opening-body" data-pickup16="'+esc(action)+'"><span class="zero-notice-icon">'+icon('user')+'</span><span><small>校园通知 · 现在</small><strong>'+esc(notice.title)+'</strong><span>'+esc(notice.text)+'</span></span></button></div>');}
