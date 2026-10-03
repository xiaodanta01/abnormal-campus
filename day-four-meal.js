/* Food preference reveal and authored conversation. */
const D4_MEAL_IMAGES={'三明治':'sandwich','意大利面':'pasta','烤鸡盖饭':'chicken','蛋包饭':'omurice','韩式拌饭':'bibimbap','饭团':'onigiri','寿司':'sushi','牛角面包':'croissant'};
const D4_MEAL_CHOICES={
 'd4-meal-reply':{title:'回应林晴记得你的喜好',last:'你打开袋子，发现里面装着你最爱吃的【食物】。',options:[['你怎么知道我喜欢吃这个？','d4-meal-remember'],['你这样，我会越来越离不开你的','d4-meal-rely']]},
 'd4-meal-flirt':{title:'回应林晴的认真',last:{speaker:'linqing',text:'别这样说'},options:[['为什么？','d4-meal-flirt-why'],['我就要说','d4-meal-flirt-insist']]},
 'd4-meal-money':{title:'询问林晴没钱的原因',last:{speaker:'linqing',text:'我其实没什么钱'},options:[['为什么呀','d4-meal-money-why'],['是因为没有身份，所以也不会获得校园币吗？','d4-meal-money-identity']]},
 'd4-meal-memory':{title:'是否听林晴的回忆',last:{speaker:'linqing',text:'【玩家名字】，你想知道吗？'},options:[['进入林晴回忆',null],['跳过回忆','d4-done']]}
};
function d4MealRows(phase){const me=text=>({speaker:'me',text}),lin=text=>({speaker:'linqing',text});return {
 'd4-meal-reveal':{rows:['你打开袋子，发现里面装着你最爱吃的【食物】。'],next:'d4-meal-reply'},
 'd4-meal-remember':{rows:[me('你怎么知道我喜欢吃这个？'),lin('你每次去便利店都要买这个'),me('哇，这都被你记住了')],next:'d4-meal-eat',confirmed:true},
 'd4-meal-rely':{rows:[me('你这样，我会越来越离不开你的。'),lin('别这样说')],next:'d4-meal-flirt',confirmed:true},
 'd4-meal-flirt-why':{rows:[me('为什么？'),lin('……我会当真的，所以不要再乱说了')],next:'d4-meal-eat',confirmed:true},
 'd4-meal-flirt-insist':{rows:[me('我就要说'),lin('……我会当真的，所以不要再乱说了')],next:'d4-meal-eat',confirmed:true},
 'd4-meal-eat':{rows:['她将另一份食物从袋子里拿出来，坐到了你的身边。',lin('先吃吧'),me('你说，我这算不算是傍上大腿了？'),me('居然都能吃到便利店里的东西了，这可是物资中心没有的'),me('话说你怎么一开始不去买呀'),lin('我……'),lin('我其实没什么钱')],next:'d4-meal-money'},
 'd4-meal-money-why':{rows:[me('为什么呀')],next:'d4-meal-invite',confirmed:true},
 'd4-meal-money-identity':{rows:[me('是因为没有身份，所以也不会获得校园币吗？'),lin('不是因为这个，我的钱没有被清空'),lin('只是我本来就没什么钱'),me('为什么？')],next:'d4-meal-invite',confirmed:true},
 'd4-meal-invite':{rows:[lin('【玩家名字】，你想知道吗？')],next:'d4-meal-memory'}
}[phase]}
function d4MealText(row){const text=t=>t.replaceAll('【食物】',state.profile.favoriteFood).replaceAll('【玩家名字】',state.profile.name);return typeof row==='string'?text(row):{...row,text:text(row.text)}}
function d4MealSelect(p,phase,index){const choice=D4_MEAL_CHOICES[phase],option=choice?.options[index];if(pickup16State()!==p||p.phase!==phase||!option)return;
 if(!option[1])return;
 p.mealChoices??={};p.mealChoices[phase]=index;
 if(phase==='d4-meal-reply'&&index===1&&!p.mealAffectionApplied){p.mealAffectionApplied=true;state.game.trust??={};state.game.trust.linqing=(state.game.trust.linqing??30)+20}
 if(phase==='d4-meal-memory-response'&&index>0&&!p.memoryAffectionApplied){p.memoryAffectionApplied=true;state.game.trust??={};state.game.trust.linqing=(state.game.trust.linqing??30)+5}
 if(phase==='d4-meal-taste'&&index===1&&!p.tasteAffectionApplied){p.tasteAffectionApplied=true;state.game.trust??={};state.game.trust.linqing=(state.game.trust.linqing??30)+5}
 pickup16Set(option[1]);
}
function d4MealScene(root,p){if(!p.phase.startsWith('d4-meal-'))return false;
 const food=state.profile.favoriteFood;
 if(!D4_MEAL_IMAGES[food]){
 root.className='pickup16-scene';root.innerHTML='<img class="pickup16-background" src="assets/day4-convenience-bag.jpg" alt="便利店袋子">';cgChoiceDialogue(root,'这份旧存档还没有记录食物偏好，请补选你最喜欢的便利店食品。');
 const options=document.createElement('div');options.className='cg-options pickup-day2-options';options.style.cssText='display:grid;grid-template-columns:1fr 1fr;max-height:65%;overflow:auto';let selected=null;
 const confirm=document.createElement('button');confirm.textContent='确认';confirm.disabled=true;confirm.style.gridColumn='1 / -1';
 for(const label of Object.keys(D4_MEAL_IMAGES)){const b=document.createElement('button');b.textContent=label;b.onclick=e=>{e.stopPropagation();selected=label;options.querySelectorAll('button').forEach(el=>{el.setAttribute('aria-pressed',String(el===b));el.style.outline=el===b?'2px solid #acb8a1':''});confirm.disabled=false};options.append(b)}
 confirm.onclick=e=>{e.stopPropagation();if(pickup16State()!==p||!selected)return;state.profile.favoriteFood=selected;persist();pickup16Render()};options.append(confirm);root.append(options);return true;
 }
 const phase=p.phase,choice=D4_MEAL_CHOICES[phase],def=d4MealRows(phase);
 const image=choice?.image||def?.image||('assets/day4-food-'+D4_MEAL_IMAGES[food]+'.jpg');
 root.className='pickup16-scene';root.innerHTML='<img class="pickup16-background" src="'+image+'" alt="与林晴的对话">';
 if(choice){cgChoiceDialogue(root,d4MealText(choice.last));const options=document.createElement('div');options.className='cg-options pickup-day2-options';choice.options.forEach(([label],i)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=e=>{e.preventDefault();e.stopPropagation();d4MealSelect(p,phase,i)};options.append(b)});root.append(options);return true}
 if(!def)return false;
 CGDialogue.present(root,def.rows.map(d4MealText),{index:p.dialogueIndex||0,firstReplyConfirmed:!!def.confirmed,onIndex:i=>{if(pickup16State()===p){p.dialogueIndex=i;persist()}},onComplete:()=>{if(pickup16State()===p&&p.phase===phase)pickup16Set(def.next)}});return true;
}
