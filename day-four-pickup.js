/* Fourth-day scarf scene, followed by the shared pickup/cabinet flow. */
const D4_PICKUP_ROWS={
 'd4-door':{image:'assets/day4-pickup-door.jpg?v=20261011-rc4',rows:['新规则永久生效，所以今天还是得叫上林晴一起去取件。',{speaker:'me',text:'走吧，我们去取物资'},{speaker:'linqing',text:'嗯嗯'}],next:'d4-scarf'},
 'd4-scarf':{image:'assets/day4-pickup-scarf.jpg?v=20261011-rc4',rows:[
 '你的手刚碰到门把手，后颈忽然感受到一片细细的、绒毛质感的东西贴了上来。',
 '可你知道，你的身后只有林晴。',
 {speaker:'me',text:'林晴？'},
 {speaker:'linqing',text:'惊喜吗？'},
 {speaker:'linqing',text:'这个是送给你的'},
 '你低头看去，那垂在胸前的围巾，正是林晴前几天早上织的那条。',
 ],next:'d4-scarf-choice'},
 'd4-scarf-knit':{image:'assets/day4-pickup-scarf.jpg?v=20261011-rc4',rows:[
 {speaker:'me',text:'原来是给我织的'},
 {speaker:'linqing',text:'嗯'},
 {speaker:'linqing',text:'给你的'},
 '你摸了摸垂在胸前的围巾，软乎乎的，好舒服的触感。'
 ],next:'d4-scarf-go',confirmed:true},
 'd4-scarf-thanks':{image:'assets/day4-pickup-scarf.jpg?v=20261011-rc4',rows:[{speaker:'me',text:'林晴，谢谢你'},{speaker:'linqing',text:'不用谢谢我'},{speaker:'linqing',text:'我们不是好朋友吗？'}],next:'d4-scarf-go',confirmed:true},
 'd4-scarf-promise':{image:'assets/day4-pickup-scarf.jpg?v=20261011-rc4',rows:[
 {speaker:'me',text:'那以后也帮我戴，好不好？'},
 '你转过身去，看着林晴说道。',
 '她却低下头，扯了扯你围巾的边缘，帮你整理了起来。',
 {speaker:'linqing',text:'……你自己又不是不会'},
 {speaker:'me',text:'是会啊'},
 {speaker:'me',text:'但就想让你帮我'},
 {speaker:'linqing',text:'……嗯'},
 '她还是那样，一害羞就不敢看你。'
 ],next:'d4-scarf-go',confirmed:true},
 'd4-scarf-go':{image:'assets/day4-pickup-scarf.jpg?v=20261011-rc4',rows:[{speaker:'linqing',text:'走吧'},{speaker:'me',text:'好'}],next:'d4-depart'},
 'd4-depart':{image:PICKUP_DAY2_IMAGES.p3,rows:['电梯门在你们身后缓缓合上。'],next:'elevator'},
 'd4-return':{image:PICKUP_DAY2_IMAGES.returnRoom,rows:['你和林晴回到了宿舍。',{speaker:'linqing',text:'你先在宿舍等我一下，我很快就回来'}],next:'d4-wait-choice'},
 'd4-wait-ask':{image:PICKUP_DAY2_IMAGES.returnRoom,rows:[{speaker:'me',text:'你要去哪里？'},{speaker:'linqing',text:'等我回来你就知道了'}],confirmed:true,next:'d4-wait-return'},
 'd4-wait-agree':{image:PICKUP_DAY2_IMAGES.returnRoom,rows:[{speaker:'me',text:'好，我等你'},{speaker:'linqing',text:'嗯嗯'}],confirmed:true,next:'d4-wait-return'},
 'd4-wait-return':{image:'assets/day4-wait-desk.jpg?v=20261011-rc4',rows:['二十分钟后——',{text:'你听到宿舍门外传来奔跑的脚步声，大概是林晴回来了。'},{sfx:'doorOpen',text:'下一秒，门被推开了。'},'林晴整个人气喘吁吁的，手里还拿着一个学校便利店的袋子。'],next:'d4-gift-bag'},
 'd4-gift-bag':{image:'assets/day4-convenience-bag.jpg?v=20261011-rc4',rows:['随后她走到你面前，将袋子放在了你的桌上。',{speaker:'linqing',text:'给你。'}],next:'d4-meal-reveal'}
};
function d4PickupBegin(){
 if(state.game.day!==4||deliveryHealthBlocked())return;
 const old=state.story.dayFourPickup;if(old){if(!old.done)pickup16Render();return}
 const orders=pickup16Targets();
 if(!orders.length){sheet('未找到待取订单','<p>当前没有第四日待领取的物资。可以通过「再一次抉择」回到第三晚，完成购物后继续。</p><button class="primary" data-action="d4-pickup-rewind">前往再一次抉择</button>');return}
 for(const o of orders){o.pickupCode='9264';o.arrivalNotified=true}
 state.story.dayFourPickup={phase:'notice',done:false,startedTime:state.system.time,orderIds:orders.map(o=>o.id),input:'',error:false,dialogueIndex:0};
 document.querySelector('#delivery-notification')?.remove();document.querySelector('#d4-debate-parcel')?.remove();persist();pickup16Render();playNotificationSound('logistics');
}
function d4ReturnChoose(p,i){
 if(pickup16State()!==p||p.phase!=='d4-wait-choice'||![0,1].includes(i))return;
 p.returnChoice=i;pickup16Set(['d4-wait-ask','d4-wait-agree'][i]);
}
function d4ScarfChoose(p,phase){
 if(pickup16State()!==p||p.phase!=='d4-scarf-choice'||!['d4-scarf-knit','d4-scarf-thanks','d4-scarf-promise'].includes(phase))return;
 p.scarfChoice=phase;if(phase==='d4-scarf-promise'&&!p.scarfAffectionApplied){p.scarfAffectionApplied=true;state.game.trust??={};state.game.trust.linqing=(state.game.trust.linqing??30)+20}pickup16Set(phase);
}
function d4PickupScene(root,p){
 if(p!==state.story.dayFourPickup)return false;
 if(d4MealScene(root,p))return true;
 if(p.phase==='d4-return')state.system.time='16:31';
 if(['d4-wait-return','d4-gift-bag'].includes(p.phase))state.system.time='16:51';
 if(p.phase==='d4-done'){p.done=true;p.phase='done';state.system.time=p.returnChoice===undefined?'16:31':'16:51';state.game.period='下午';status();persist();pickup16Cleanup();home();return true}
 if(p.phase==='d4-wait-choice'){
 root.className='pickup16-scene';root.innerHTML='<img class="pickup16-background" src="'+PICKUP_DAY2_IMAGES.returnRoom+'" alt="回到宿舍">';
 cgChoiceDialogue(root,D4_PICKUP_ROWS['d4-return'].rows[1]);
 const choices=document.createElement('div');choices.className='cg-options pickup-day2-options';
 [['d4-wait-ask','你要去哪里？'],['d4-wait-agree','好，我等你']].forEach(([phase,label],i)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=e=>{e.preventDefault();e.stopPropagation();d4ReturnChoose(p,i)};choices.append(b)});
 root.append(choices);return true;
 }
 if(p.phase==='d4-scarf-choice'){
 root.className='pickup16-scene';root.innerHTML='<img class="pickup16-background" src="assets/day4-pickup-scarf.jpg?v=20261011-rc4" alt="胸前的紫色围巾">';
 cgChoiceDialogue(root,D4_PICKUP_ROWS['d4-scarf'].rows.slice(-1)[0]);
 const choices=document.createElement('div');choices.className='cg-options pickup-day2-options';
 for(const [phase,label]of [['d4-scarf-knit','原来是给我织的'],['d4-scarf-thanks','林晴，谢谢你'],['d4-scarf-promise','那以后也帮我戴，好不好？']]){
 const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=e=>{e.preventDefault();e.stopPropagation();d4ScarfChoose(p,phase)};choices.append(b)
 }root.append(choices);return true;
 }
 const def=D4_PICKUP_ROWS[p.phase];if(!def)return false;const phase=p.phase;
 root.className='pickup16-scene';root.innerHTML='<img class="pickup16-background" src="'+def.image+'" alt="与林晴一同取件">';
 CGDialogue.present(root,def.rows,{index:p.dialogueIndex||0,firstReplyConfirmed:!!def.confirmed,onIndex:i=>{if(pickup16State()===p){p.dialogueIndex=i;persist()}},onComplete:()=>{if(pickup16State()===p&&p.phase===phase)pickup16Set(def.next)}});return true;
}
d4DebatePickup=d4PickupBegin;
actions['d4-debate-parcel']=d4PickupBegin;
actions['d4-pickup-rewind']=()=>{closeSheet();view='game-menu';zeroNodes()};
// Existing arrival notifications from older saves enter the authored scene too.
const d4PickupDetailBase=deliveryDetail;deliveryDetail=function(id,...args){const o=deliveryOrders().find(o=>o.id===id);if(!pickup16Internal&&state.game.day===4&&d4Debate()?.phase==='done'&&!state.story.dayFourPickup&&o?.deliveryDate===state.system.date&&o.status!=='已完成')return d4PickupBegin();return d4PickupDetailBase(id,...args)};
const d4PickupResumeBase=resumeStoryScene;resumeStoryScene=function(snapshot,...args){if(snapshot?.game?.day===4&&snapshot.story?.dayFourPickup&&!snapshot.story.dayFourPickup.done){pickup16Render();persist();return}return d4PickupResumeBase(snapshot,...args)};
if(!d3Paused()&&state.game.day===4&&state.story.dayFourPickup&&!state.story.dayFourPickup.done)pickup16Render();
