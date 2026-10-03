/* The elevator is one uninterrupted puzzle, starting at the first floor input. */
function pickupDay2PuzzleStart(p){
 if(p.puzzleToken)return;
 p.puzzleToken=Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
 p.puzzleActive=true;p.floor='';p.exploredFloors=[];p.dialogueIndex=0;
}
function pickupDay2ReturnFloor(){const p=pickup16State();p.floor='';p.roomDigit='';pickup16Set('d2-floor')}
function pickupDay2FloorSubmit(){
 const p=pickup16State(),floor=String(p?.floor||'').trim();
 if(!p||p.phase!=='d2-floor'||!/[1235789]/.test(floor)||floor.length!==1)return;
 p.hadOtherFloors=(p.exploredFloors||[]).some(n=>n!==floor);
 p.exploredFloors??=[];if(!p.exploredFloors.includes(floor))p.exploredFloors.push(floor);
 p.floorSelected=floor;p.roomDigit='';
 if(floor==='2')p.floorMapping={...p.floorMapping,2:7};
 pickup16Set(floor==='1'?'d2-lobby':floor==='2'?'d2-platform':'d2-corridor');
}
function pickupDay2RoomSubmit(){
 const p=pickup16State(),digit=String(p?.roomDigit||'').trim();
 if(!p||p.phase!=='d2-room'||!/^\d$/.test(digit))return;
 p.roomSelected=p.floorSelected+'0'+digit;
 pickup16Set('d2-room-door');
}
function pickupDay2PuzzleRender(root,p){
 const lin=text=>({speaker:'linqing',text});
 if(p.phase==='d2-floor'){
  pickupDay2PuzzleStart(p);persist();pickupDay2Backdrop(root,'panel');
  pickup16Card(root,'前往几楼？','<small class="pickup-day2-floor-hint">可输入楼层：2、9、3、8、5、7、1</small><form id="pickup-day2-floor"><input aria-label="楼层" inputmode="numeric" maxlength="1" pattern="[1235789]" required value="'+esc(p.floor||'')+'"><button class="primary" type="submit">确认前往</button></form>',pickup16Button('d2-notebook','打开备忘录',true));
  const form=root.querySelector('form');form.querySelector('input').oninput=e=>{p.floor=e.target.value};form.onsubmit=e=>{e.preventDefault();pickupDay2FloorSubmit()};return true;
 }
 if(p.phase==='d2-notebook'){
  root.className='pickup-day2-notebook';root.innerHTML=notebookPageMarkup();
  const back=root.querySelector('[data-action="home"]');back.removeAttribute('data-action');back.dataset.pickup16='d2-floor-back';back.setAttribute('aria-label','返回输入楼层');
  const save=root.querySelector('[data-action="save-note"]');save.removeAttribute('data-action');save.dataset.pickup16='d2-note-save';
  root.querySelector('.notebook-page').insertAdjacentHTML('beforeend',pickup16Button('d2-floor-back','返回输入楼层',true));return true;
 }
 if(p.phase==='d2-lobby'){pickupDay2Dialogue(root,'lobby',['你和林晴来到了一楼。','电梯门外是空荡荡的宿舍楼大堂，什么都没有。',lin('走吧，换个楼层。')],'d2-floor-return');return true}
 if(p.phase==='d2-platform'){
  const rows=p.hadOtherFloors?['你和林晴来到了数字2所对应的楼层。','电梯门打开的一瞬间，你便认出了外面的取件平台。','这里正是刚才的七楼。',lin('看来原本的七楼变成了数字2。'),lin('我们换一个楼层吧。')]:['你按下数字2，电梯门再次缓缓打开。',lin('这里不是我们刚刚取件的地方吗？'),lin('看来原本的七楼，现在变成了数字2。'),lin('先记住这个规律，再换一个楼层吧。')];
  pickup16Dialogue(root,'cabinet',rows,'d2-floor-return');return true;
 }
 if(p.phase==='d2-corridor'){pickupDay2Dialogue(root,'corridor',['你和林晴来到了'+p.floorSelected+'楼。','电梯门缓缓打开，走廊两侧排列着九间宿舍。','这里的门牌同样被打乱了。'],'d2-corridor-choice');pickupDay2DoorLabels(root,p);return true}
 if(p.phase==='d2-corridor-choice'){pickupDay2Choices(root,'corridor','你准备怎么做？',[['d2-enter-room','进入一间宿舍'],['d2-other-floor','再去其他楼层看看']]);pickupDay2DoorLabels(root,p);return true}
 if(p.phase==='d2-other-floor'){pickupDay2Dialogue(root,'corridor',[lin('再找找吧，别随便开门。')],'d2-floor-return');return true}
 if(p.phase==='d2-floor-return'){pickupDay2ReturnFloor();return true}
 if(p.phase==='d2-room'){
  pickupDay2Backdrop(root,'corridor');pickupDay2DoorLabels(root,p);
  pickup16Card(root,'请输入你要进入的宿舍号。','<form id="pickup-day2-room"><label class="pickup-day2-room-number"><span>'+esc(p.floorSelected)+'0</span><input aria-label="宿舍号最后一位数字" inputmode="numeric" maxlength="1" pattern="[0-9]" required></label><button class="primary" type="submit">打开宿舍门</button></form>','');
  const form=root.querySelector('form');form.querySelector('input').oninput=e=>{p.roomDigit=e.target.value};form.onsubmit=e=>{e.preventDefault();pickupDay2RoomSubmit()};return true;
 }
 if(p.phase==='d2-room-door'){
  if(p.roomSelected==='804')pickupDay2Dialogue(root,'door804',['你来到804门前，将手放在门把手上。','门锁发出一声轻响后打开了。'],'d2-own-room');
  else pickupDay2Dialogue(root,'openDorm',['你来到'+p.roomSelected+'门前，将手放在门把手上。','门锁发出一声轻响后打开了。'],'d2-wrong-room');
  return true;
 }
 if(p.phase==='d2-wrong-room'){pickupDay2Dialogue(root,'wrongRoom',['开门后，你发现这并不是你熟悉的宿舍。'],'d2-room-death');return true}
 if(p.phase==='d2-room-death'){pickupDay2CampusNotice(root,'wrongRoom','d2-room-campus-notice');return true}
 if(p.phase==='d2-own-room'){pickupDay2Dialogue(root,'returnRoom',['你成功回到了宿舍。','屋里的一切都和离开时一模一样。','可这里明明是408。','为什么门外的宿舍号会变成804？'],'d2-common');return true}
 if(p.phase==='d2-common'){pickupDay2Complete();return true}
 return false;
}
function pickupDay2DoorLabels(root,p){root.insertAdjacentHTML('beforeend','<div class="pickup-day2-door-labels" aria-label="走廊门牌顺序">'+[1,7,5,8,3,9,2,4,6].map(n=>'<span>'+esc(p.floorSelected)+'0'+n+'</span>').join('')+'</div>')}
function pickupDay2Complete(){
 const p=pickup16State();if(!p||p.done||p.phase!=='d2-common')return;
 if(p.roomSelected!=='804')return;p.elevatorSolved=true;p.suppliesObtained=!!p.received;
 p.puzzleActive=false;p.done=true;p.phase='done';state.story.secondDayPickupCommonReady=true;
 // Advance by the same interval regardless of floor exploration count.
 const [h,m]=(p.startedTime||state.system.time).split(':').map(Number),minutes=Math.min(23*60+59,h*60+m+30);
 state.system.time=String(Math.floor(minutes/60)).padStart(2,'0')+':'+String(minutes%60).padStart(2,'0');
 state.game.location='女生宿舍B栋408室';state.story.secondDayPickupCommonTime=state.system.time;
 pickup16Cleanup();view='home';active=null;state.story.route={view:'home',active:null};persist();pickup16Base.home();
}
function pickupDay2WrongDormDeath(){
 const p=pickup16State();if(!p||p.done||p.phase!=='d2-room-death')return;p.failed=true;p.done=true;p.phase='failed';p.puzzleActive=false;
 state.story.dayTwoWrongDormDeath=true;pickup16Cleanup();clearInterval(cgTypingTimer);
 z().playerLeft=true;z().firstDeathClicked=false;delete z().firstDeathReadyAt;
 zeroPhase('pickup-code-death');zeroCampus();persist();
}
function pickupDay2PuzzleAction(action,p){
 if(action==='d2-room-campus-notice'&&p.phase==='d2-room-death')pickupDay2WrongDormDeath();
 else if(action==='d2-notebook'&&p.phase==='d2-floor')pickup16Set('d2-notebook');
 else if(action==='d2-note-save'&&p.phase==='d2-notebook'){if(savePersonalNotebook(document.querySelector('#pickup16 #note-text').value))toast('备忘录已保存')}
 else if(action==='d2-floor-back'&&p.phase==='d2-notebook')pickup16Set('d2-floor');
 else if(action==='d2-enter-room'&&p.phase==='d2-corridor-choice')pickup16Set('d2-room');
 else if(action==='d2-other-floor'&&p.phase==='d2-corridor-choice')pickup16Set('d2-other-floor');
 else return false;
 return true;
}
