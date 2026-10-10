/* Lin Qing's authored recollection, in the supplied P1-P8 order. */
const D4_LIN_MEMORY_PAGES=[
['我该从哪里开始说起呢','这些事，我还是第一次和除自己以外的人说起','我是单亲家庭的孩子，一直跟着爸爸长大','爸爸从小就一直宠着我，哪怕家里并不富裕，也是有求必应的','我那时就觉得，他是世界上最好的爸爸','后来，他开始睡得越来越晚','每天晚上，他都一个人坐在客厅里盯着手机','我凑过去看，他就立刻把屏幕关掉，还会冲我发脾气'],
['他开始变得喜怒无常，开始变得不耐烦，开始变得让我感到陌生','有时候特别高兴，答应给我买这买那；有时候又会因为一点小事摔东西，骂我不懂事','那时候我甚至认真想过，他是不是被外星人带走了','留在家里的这个，只是一个长得和他一样的假人','直到有一天，他看手机看得太入神，没有注意到我在他身后——我终于看到了他屏幕上的东西'],
['百家乐、老虎机……还有一串不停变化的数字','我不知道我该怎么形容我那一刻的感觉','五雷轰顶？就好像呼吸都停止了，听不见任何声音，四肢都好沉重','原来我的爸爸真的不见了','只是这一次，带走他的不是什么外星人','是网赌','网赌，为什么我的爸爸会染上网赌？','他那些没有来由的高兴、愤怒和恐慌，一下子都有了解释','原来我的日子，一直在跟着手机屏幕上的数字，一会儿升上去一会儿摔下来','可你知道吗，我却还是不死心的相信那个小时候的爸爸会回来'],
['有一天他哭着和我说，爸爸再也不赌了','“爸爸会戒赌，会变好，爸爸对不起你”'],
['我也哭了，我想上天一定是听到了我的祈祷','把我的爸爸还给我了'],
['我是又度过了一段幸福的时光，放学就有爸爸做好的饭吃，我住校的时候，他还会专门开车到校门口给我送一份便当','总之一切都变得好幸福','所以当他说自己周转不开，拿出那份担保合同让我签字的时候……'],
['我竟然傻乎乎的相信了，我简直是蠢到家了','他说只要帮他熬过这一次，以后我们就能好好过日子','其实只要多想一下，我就应该明白的','可他以前偏偏对我那么好','好到他只要掉几滴眼泪，说一句“爸爸真的知道错了”，我就又愿意相信他','她们说周茉只要别人对她好一点，就会轻易相信别人','可我听见那些话的时候，一句话都不敢替她说。','因为我知道，我才是那个最愚蠢的人。'],
['高中老师总说，考不上好大学，这辈子就完了。','我最后考上的，刚好也只是一所很普通的大学。','我身上背着那么多债，交不起学费，也没有生活费。','我的人生是不是已经看不到头了？','如果他从一开始就是个坏爸爸，我或许早就不再相信他了。','我也可以恨他，可以离开他，可以告诉自己，这个人不值得。','可他偏偏以前那么好。','好到我直到最后，都还在等他回来。','不过没关系，我都接受了']
];
D4_MEAL_CHOICES['d4-meal-memory'].options=[['进入林晴回忆','d4-meal-memory-p1'],['跳过回忆','d4-meal-memory-merge']];
D4_MEAL_CHOICES['d4-meal-memory-response']={title:'回应林晴的过去',image:'assets/day4-lin-memory-8.jpg?v=20261011-rc5',last:{speaker:'linqing',text:'不过没关系，我都接受了'},options:[['对不起，我不知道是这样的原因','d4-meal-memory-sorry'],['谁说看不到头？我会一直陪着你的','d4-meal-memory-stay'],['林晴，你该早点和我说的，我会帮你分担这些的','d4-meal-memory-share']]};
D4_MEAL_CHOICES['d4-meal-taste']={title:'回应林晴询问食物味道',last:{speaker:'linqing',text:'【食物】好吃吗？'},options:[['嗯，很好吃！','d4-meal-taste-good'],['只要是你买的，不好吃也是好吃的','d4-meal-taste-you']]};
function d4MemoryLastImage(){return state.story.dayFourPickup?.mealChoices?.['d4-meal-memory']===0?'assets/day4-lin-memory-8.jpg?v=20261011-rc5':null}
const d4MemoryBaseRows=d4MealRows;
d4MealRows=function(phase){
 const page=/^d4-meal-memory-p([1-8])$/.exec(phase);
 if(page){const n=Number(page[1]);return {image:'assets/day4-lin-memory-'+n+'.jpg?v=20261011-rc5',rows:D4_LIN_MEMORY_PAGES[n-1].map(text=>({speaker:'linqing',text,silentBlip:true})),next:n===8?'d4-meal-memory-response':'d4-meal-memory-p'+(n+1)}}
 const me=text=>({speaker:'me',text}),lin=text=>({speaker:'linqing',text});
 const reply=(text,rows)=>({image:'assets/day4-lin-memory-8.jpg?v=20261011-rc5',confirmed:true,rows:[me(text),...rows.map(text=>({...lin(text),silentBlip:true}))],next:'d4-meal-memory-merge'});
 return {
 'd4-meal-memory-sorry':reply('对不起，我不知道是这样的原因',['没关系的，这和你没关系']),
 'd4-meal-memory-stay':reply('谁说看不到头？我会一直陪着你的',['【玩家名字】，谢谢你','你还是那么好']),
 'd4-meal-memory-share':reply('林晴，你该早点和我说的，我会帮你分担这些的',['【玩家名字】，谢谢你','你还是那么好']),
 'd4-meal-memory-merge':{image:d4MemoryLastImage(),rows:[{...lin('不说这些了，都过去了'),silentBlip:!!d4MemoryLastImage()},me('好')],next:'d4-meal-taste-ask'},
 'd4-meal-taste-ask':{rows:[lin('【食物】好吃吗？')],next:'d4-meal-taste'},
 'd4-meal-taste-good':{confirmed:true,rows:[me('嗯，很好吃！')],next:'d4-meal-emotion'},
 'd4-meal-taste-you':{confirmed:true,rows:[me('只要是你买的，不好吃也是好吃的')],next:'d4-meal-emotion'},
 'd4-meal-emotion':{rows:[lin('嗯，那就好'),'她弯起眼睛，声音却颤了起来。','林晴仓促地别过脸，你看见她用手背掩住嘴唇，就像试图将那声哽咽咽回去。','可那阵情绪无论如何也止不住。',me('你怎么了？'),lin('没什么，嗓子有点不舒服。'),'她没有再看你，只是低着头，一小口、一小口地吃着面前的食物。','你也不敢再继续追问，因为你知道林晴没有获得任何身份。','那今晚又要怎么判断她是获胜还是失败？','还是根本就……','你也不愿再继续想下去了。','至少这一刻，还是美好的。'],next:'d4-done'}
 }[phase]||d4MemoryBaseRows(phase);
};
