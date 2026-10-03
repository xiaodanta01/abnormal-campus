/* Final-night private chat. Choices, drafts and clocks belong to the current timeline. */
const D4_LIN_ODEN_IMAGE='assets/day4-night-oden.jpg';
const D4_LIN_ODEN_ROWS=[
 '林晴又出门给你买吃的了，她带回来的关东煮还是一如既往地好吃。',
 '你不明白，她为什么宁愿冒着被发现的风险，也要出去给你带喜欢的食物。',
 '更不明白的是，你不过随口说了一句想吃关东煮，就算已经快十点了她也还要去便利店。',
 '可最让你想不明白的是——',
 '这么多天过去了，便利店里的关东煮，为什么一直没有坏？'
];
const D4_LIN_NIGHT_SCRIPTS={
 opening:{title:'回应林晴的深夜消息',options:[['什么意思？','friend'],['林晴，这到底是怎么回事？','friend']]},
 friend:{rows:['我特别喜欢你这个朋友','我真的特别特别不想失去你','我好后悔'],next:'regret'},
 regret:{title:'回应林晴的后悔',options:[['我不会离开你的','promise'],['到底发生什么了？','explain']]},
 promise:{rows:['真的吗？'],next:'rest'},
 explain:{rows:['就是好后悔没有再早点遇到你，相见恨晚'],next:'rest'},
 rest:{rows:['好了，刷会儿手机就快睡吧，明天我们去逛街'],next:'pastime'},
 pastime:{title:'选择睡前的消遣',options:[['手机什么都看不了诶','phone'],['我不要，我要和你聊天','chat-invite']]},
 phone:{rows:['哦哦差点忘记了','那你想不想吃便利店里的关东煮？'],next:'oden'},
 oden:{title:'回应关东煮的邀请',options:[['好呀好呀','oden-wait'],['现在吗？','oden-now']]},
 'oden-now':{rows:['嗯嗯，现在'],next:'oden-confirm'},
 'oden-confirm':{title:'确认想吃关东煮',options:[['想！','oden-wait']]},
 'oden-wait':{rows:['那你等着我'],next:'cg'},
 'chat-invite':{rows:['那你想聊什么呀？'],next:'topics'},
 hobbies:{rows:['嗯……','就是织一些好看的东西，还有坐在公园的板凳上看日落','你呢？','你喜欢做什么呀？'],input:'说说你喜欢做什么',next:'hobbies-answer'},
 'hobbies-answer':{rows:['还怪有趣的'],next:'topic-end'},
 song:{rows:['就是我朋友圈那首呀，中间的间奏很好听呢'],next:'song-choice'},
 'song-choice':{title:'回应林晴喜欢的歌',options:[['原来你只是喜欢听，没有别的暗示吗','song-share'],['我也觉得很好听','song-taste']]},
 'song-share':{rows:['嗯嗯，就是想分享','也可能是因为有那么一点共鸣吧'],next:'topic-end'},
 'song-taste':{rows:['难怪我们是好朋友','都很有品位'],next:'topic-end'},
 impression:{rows:['你很勇敢，还很善良','周茉遇到困难，你会毫不犹豫的帮助她','你明知道正面和学生会对抗会有多大的风险，却还是愿意挺身而出','所以对我来说，你是我见过最可靠、也最温柔的人','【玩家名字】，你觉得我是个怎样的人'],input:'说说你眼中的林晴',next:'impression-answer'},
 'impression-answer':{rows:['嗯嗯，我知道了','谢谢你'],next:'topic-end'}
};
const D4_LIN_NIGHT_TOPICS=[['我想知道你的爱好是什么？','hobbies'],['你有喜欢听的歌吗？','song'],['你觉得我是一个什么样的人？','impression']];
const D4_RELEASE_POST='day4-one-am-release';
const D5_RELEASE_BODY='解除后可自由活动，明日假期将至，今日可提前出校回家';
const D4_HOSPITAL_IMAGES={ceiling:'assets/day4-hospital-ceiling.jpg',nurse:'assets/day4-hospital-nurse.jpg',zhouhe:'assets/day4-hospital-zhouhe.jpg'};
C.avatars.push({id:'hospital_nurse',name:'护士',src:'assets/hospital-nurse-avatar.jpg'});
const D5_FOLLOW_IMAGES={road:'assets/day5-lin-night-road.jpg',bench:'assets/day5-lin-night-bench.jpg',gate:'assets/day5-campus-gate.jpg'};
const D5_STAY_IMAGES={later:'assets/day5-lin-stay-later.jpg',love:'assets/day5-lin-stay-love.jpg'};
const D5_REUNION_IMAGES={wheelchair:'assets/day5-hospital-wheelchair.jpg',door:'assets/day5-hospital-1207.jpg',lin:'assets/day5-hospital-lin.jpg',hands:'assets/day5-hospital-hands.jpg'};
function d4HospitalScripts(){
 const lin=text=>({speaker:'linqing',text}),nurse=text=>({speaker:'nurse',name:'护士',avatar:'hospital_nurse',text}),zhou=text=>({speaker:'zhouhe',name:'周禾',text:d3EveningText(text)}),me=text=>({speaker:'me',text});
 const scripts={
  bedtime:{image:D3_NIGHT_IMAGE,rows:[lin('快睡吧，别看手机了'),lin('醒来以后，一切都会变正常的')],next:'goodnight'},
  goodnight:{image:D3_NIGHT_IMAGE,options:[['好，晚安','sleep-choice']]},
  'follow-awake':{dark:true,rows:['你没有立刻闭上眼睛。','黑暗中，时间一分一秒地过去。片刻后，你隐约听见床板轻轻响了一下。','过了一会儿，宿舍门被人小心翼翼地拉开，又轻轻合上。'],next:'follow-rise'},
  'follow-rise':{dark:true,action:true,options:[['起来跟上她','follow-corridor']]},
  'follow-corridor':{dark:true,rows:['你看见林晴独自走在昏暗的走廊里，她没有带手机，也没有拿任何东西。','你也说不清自己为什么一定要追出来。'],next:'follow-road'},
  'follow-road':{image:D5_FOLLOW_IMAGES.road,rows:['只是有一种强烈的不安攥住了你——如果这一次没有跟上她，你可能就再也见不到她了。','林晴最后停在了通往校门口的那条路上。'],next:'follow-bench'},
  'follow-bench':{image:D5_FOLLOW_IMAGES.bench,rows:['夜风吹动林晴散落的头发，只见她在长椅上坐下，安静地望着校门口。',lin('你为什么要跟过来？'),'你猛地停住脚步。','还以为自己隐藏的特别好，原来早就被发现了。'],next:'follow-concern'},
  'follow-concern':{image:D5_FOLLOW_IMAGES.bench,options:[['你为什么不睡觉，要来这里','follow-walk'],['我担心你','follow-worried',10]]},
  'follow-walk':{image:D5_FOLLOW_IMAGES.bench,rows:[lin('就是想散散心')],next:'follow-confession'},
  'follow-worried':{image:D5_FOLLOW_IMAGES.bench,rows:['林晴没有回答你，她的头更低了'],next:'follow-confession'},
  'follow-confession':{image:D5_FOLLOW_IMAGES.bench,rows:[lin('我……'),lin('我不知道这里究竟是什么地方。'),lin('可我也不想离开'),lin('明明已经决定留在这里了……'),lin('为什么一想到你会走，我就接受不了'),lin('我不想亲眼看着你从我面前消失')],next:'follow-stay-choice'},
  'follow-stay-choice':{image:D5_FOLLOW_IMAGES.bench,options:[['我留下来陪你，好不好？','stay-invited'],['和我一起走，好不好？','leave-invitation']]},
  'stay-invited':{image:D5_FOLLOW_IMAGES.bench,rows:[lin('留下来……陪我？')],next:'stay-promise-choice'},
  'stay-promise-choice':{image:D5_FOLLOW_IMAGES.bench,options:[['嗯，我会一直陪着你，直到你愿意离开这里为止','stay-wind'],['林晴，我也不想离开你','stay-wind']]},
  'stay-wind':{image:D5_FOLLOW_IMAGES.bench,rows:['夜风吹过空荡荡的校园。','林晴低着头，很久都没有说话。','长椅下积着一小片潮湿的水迹，路灯昏黄的光落在里面，随着风轻轻发颤。'],next:'stay-promise'},
  'stay-promise':{image:D5_FOLLOW_IMAGES.bench,rows:[lin('如果我一直都不愿意离开呢？'),me('那我就一直等'),lin('如果留在这里太久，你会慢慢忘记外面的事呢？'),me('没关系'),lin('哪怕最后……你可能会消失？'),'她终于抬起头看向你。','你看见那双通红的眼睛里，藏着一点卑劣的期待。','她明明希望你拒绝，却又比任何人都渴望听见另一个答案。',lin('即使这样，你也愿意陪我吗？'),me('我愿意，我会一直陪着你的'),'听见你肯定的回答，林晴的眼泪一下子落了下来，可她此刻并不是伤心，而是高兴极了。',lin('那你不许后悔。'),me('不后悔'),'你知道，只要现在松开她，或许还来得及。','可林晴的手那么冷，又握得那么紧。','你好像也没法再回头了。',lin('我们回去吧。'),me('好')],next:'stay-gate'},
  'stay-gate':{image:D5_FOLLOW_IMAGES.bench,rows:['身后的校门缓缓合拢，发出一声沉闷的轻响。','手机上的时间永远停在了1:30。'],next:'stay-later'},
  'stay-later':{image:D5_STAY_IMAGES.later,dark:true,rows:['后来，林晴每天都会问你：','“你不会走的，对吧？”','而你每一次都会告诉她：','“只要你不走，我就不走。”','你渐渐想不起校门外究竟有什么。','再后来，你会问林晴，你们究竟在这里待了多久？','她总会笑着岔开话题。',lin('时间很重要吗？'),lin('反正我们一直都在一起。'),'她的表情像是有些苦恼，苦恼你为什么会好奇这么多事情；又像在为此庆幸，庆幸你好像忘记了除了她以外的很多事情。'],next:'stay-love'},
  'stay-love':{image:D5_STAY_IMAGES.love,rows:[lin('怎么办……'),lin(d3EveningText('我好像越来越喜欢【玩家名字】了。'))],next:'stay-forgotten'},
  'stay-forgotten':{dark:true,rows:['你总觉得你本该想起些什么，你看着那些空着的床铺，那些似乎曾在宿舍里响起过的声音，无不在告诉你这里不对劲。','可每当你试着回忆，林晴总会在这时叫你的名字。','久而久之，那些模糊的痕迹也就不再重要了。','直到最后，你竟真开始觉得——','这里原本就只有你和林晴，没什么不对的。'],next:'stay-ending'},
  light:{rows:['白光吞没视野的瞬间，耳边的风声忽然变成了急促的仪器鸣响。',{text:'嘀——嘀——嘀——',monitor:true}],next:'wake'},
  wake:{image:D4_HOSPITAL_IMAGES.ceiling,rows:['你猛地睁开眼睛。','你看见了一片全然陌生的天花板，脸上好像还有什么东西压着你。','这是……医院？'],next:'nurse'},
  nurse:{image:D4_HOSPITAL_IMAGES.nurse,rows:[nurse('能听见我说话吗？'),nurse('先不要动，我去叫医生。'),'值班医生很快赶来做了检查。确认你的情况暂时稳定后，他叮嘱你继续卧床观察，不要自行下床。'],next:'nurse-question'},
  'nurse-question':{image:D4_HOSPITAL_IMAGES.nurse,options:[['林晴在哪里','ask-lin'],['我为什么在这里','cause']]},
  'ask-lin':{image:D4_HOSPITAL_IMAGES.nurse,rows:[me('林晴在哪里？'),nurse('什么？'),'护士似乎没有反应过来。',me('我的室友林晴，她不在吗？'),nurse('我们没有接到这个病人'),me('她就和我在一个宿舍，那她不在这在哪里'),nurse('可救援记录上写……'),nurse('救援人员进入你的宿舍408时，宿舍里只有你和陈妍两个人'),me('救援记录？')],next:'cause'},
  cause:{image:D4_HOSPITAL_IMAGES.nurse,rows:[nurse('你们学校地下的电缆管廊起火了'),nurse('电缆在地下持续阴燃，产生的有毒气体被B栋的新风系统吸了进去，又送到了附近的每一层寝室'),nurse('你们当时大部分人都还在熟睡，所以很多人吸入了过多有毒气体'),me('那其他人怎么样了？'),nurse('你们女生B栋受灾最严重，有些人已经醒了，还有几个人仍在重症监护室。'),nurse('女生A栋大部分人已经脱离危险。'),nurse('男生宿舍使用的是另一套通风系统，只有少数人出现中毒症状，情况相对较轻。'),me('所以有人没有救回来吗？'),nurse('具体情况还没有完全统计出来。'),nurse('当晚送来的学生太多，被分别送去了几家医院。'),nurse('你现在才刚醒，先不要想这些。')],next:'door'},
  door:{image:D4_HOSPITAL_IMAGES.nurse,rows:[{text:'病房门忽然被人推开。',sfx:'doorOpen'},'周禾提着袋子站在门口，看见你睁着眼睛，她整个人都懵了一般。'],next:'visit'},
  visit:{image:D4_HOSPITAL_IMAGES.zhouhe,rows:[zhou('你终于醒了……'),zhou('你知不知道你吓死我了？'),'她快步走到床边，又顾忌着你身上的输液管，伸出的手停在半空，最后只轻轻碰了碰你的手臂。',zhou('那天晚上我刚好不在学校。'),zhou('等我赶回来，你们已经全被送走了。')],next:'zhou-question'},
  'zhou-question':{image:D4_HOSPITAL_IMAGES.zhouhe,options:[['周茉呢？','zhoumo'],['林晴呢？','linqing'],['叶琳呢？','yelin']]},
  zhoumo:{image:D4_HOSPITAL_IMAGES.zhouhe,rows:[zhou('你怎么会认识周茉？'),me('啊？我认识啊'),zhou('哦哦'),zhou('周茉她……'),zhou('没能抢救回来'),'你张了张嘴，却什么声音也没有发出来。','原来，那些被“请离”的人，那些消失的人，都再也醒不来了。'],next:'end'},
  linqing:{image:D4_HOSPITAL_IMAGES.zhouhe,rows:[zhou('林晴？'),zhou('【玩家名字】，你怎么了？你记不清事情了吗？'),zhou('林晴在那件事之后……一直都昏迷不醒'),'那件事？什么那件事？'],next:'recall-shake'},
  recall:{image:D4_HOSPITAL_IMAGES.zhouhe,rows:['你终于想起来了。','早在一周前，林晴就曾试图结束自己的生命。','她被及时救了回来，却一直没有醒。','消息传开以后，许多女孩都自发为她捐了钱，你依稀记得，其中捐得最多的那个人，好像叫江晓。','江晓……','这个名字让你的呼吸猛地停了一瞬。','你记得她也出现在了那所学校里——一个可怕的念头隐约浮上心头，你却不敢再继续想下去。','够了。','就到这里吧。'],next:'end'},
  yelin:{image:D4_HOSPITAL_IMAGES.zhouhe,rows:[zhou('叶琳？'),zhou('我不认识她诶'),me('就是108那个'),zhou('我帮你问问'),'大约三分钟后——',zhou('哦哦，她也刚醒没多久'),zhou('你怎么会认识一楼的人啊'),zhou('从来没听你提起过这号人'),me('我们就是网上认识没见过'),zhou('原来如此')],next:'end'}
 };
 Object.assign(scripts,{
  'leave-invitation':{image:D5_FOLLOW_IMAGES.bench,rows:[lin('走？'),lin('……去哪里？'),me('你不是接受不了我消失吗？'),me('那就和我一起离开这里'),'林晴望着你，迟迟没有伸手。',lin('可外面什么都不会变。'),lin('那些我不想面对的事，也还在那里。')],next:'leave-judge'},
  'leave-low-choice':{image:D5_FOLLOW_IMAGES.bench,options:[['林晴，有什么事我们都一起面对，好吗？','leave-low-hand'],['林晴，你相信我，一切都会好起来的','leave-low-hand']]},
  'leave-low-hand':{image:D5_FOLLOW_IMAGES.bench,rows:['林晴终于把手递给了你。'],next:'leave-low-gate'},
  'leave-low-gate':{image:D5_FOLLOW_IMAGES.gate,rows:['你们沿着空荡的道路走向校门，临近门口时，她的脚步却突然停了下来。',lin('我只能送你到这里了。'),me('为什么？'),lin('我不是不想和你走。'),lin('是我现在……还做不到离开这里。'),lin('对不起'),me('那我还会再见到你吗？'),lin('会的。'),lin('等我再勇敢一点，我一定会来找你的。'),'她松开你的手，将你轻轻推出了校门。'],next:'leave-white'},
  'leave-high-choice':{image:D5_FOLLOW_IMAGES.bench,options:[['林晴，有些事你不用再一个人面对了','leave-high-hand'],['林晴，我不能没有你','leave-high-hand']]},
  'leave-high-hand':{image:D5_FOLLOW_IMAGES.bench,rows:['林晴低头看着你伸出的手。',lin('你知道自己在说什么吗？'),me('我知道'),'听到你的回答后，林晴沉默了许久，就好像在做什么思想斗争。'],next:'leave-high-gate'},
  'leave-high-gate':{image:D5_FOLLOW_IMAGES.gate,rows:['最后她终于牵住了你的手，你也带着她一起走向了校门。'],next:'leave-white'},
  'together-hand':{image:D5_REUNION_IMAGES.hands,rows:['你低下头，握住她的手。','你好害怕林晴又在骗你，你好害怕其实她根本离不开那个校园，你好害怕未来没有她的日子。'],next:'together-call-choice'},
  'together-call-choice':{image:D5_REUNION_IMAGES.hands,options:[['你是不是骗了我','together-awake'],['陪我去逛街吧','together-awake']]},
  'together-awake':{image:D5_REUNION_IMAGES.hands,rows:['片刻后，你感受到掌心里的手指忽然动了一下。','幅度小到像是你的错觉。','紧接着，林晴的睫毛颤了颤，她像是在很远的地方听见了你的声音，挣扎了许久，终于缓慢地睁开了眼睛。','那双眼睛起初没有焦点——直到她看见你。',zhou('护士姐姐！医生！'),{text:'周禾边喊边转身跑出病房，走廊里很快响起急促的脚步声。',sfx:'runningSteps'},'而你仍然坐在床边，没有松开她的手。','这一次，你们都回来了。'],next:'end'},
  'reunion-refusal':{image:D5_FOLLOW_IMAGES.bench,rows:['林晴怔了一下，抬眼望着你。','那一瞬间，她眼眶一下便红了，就像是听见了自己最想听见的话。','可她最终还是摇了摇头。',lin('不'),lin('我不要你因为我留在这里……'),lin('你应该去过自己的生活'),lin('那样才是对的')],next:'reunion-why'},
  'reunion-why':{image:D5_FOLLOW_IMAGES.bench,options:[['为什么？我就想留下来陪你','reunion-trapped'],['那你怎么办？','reunion-promise']]},
  'reunion-trapped':{image:D5_FOLLOW_IMAGES.bench,rows:[lin('如果这样'),lin('我只会觉得是我害了你，困住了你')],next:'reunion-promise'},
  'reunion-promise':{image:D5_FOLLOW_IMAGES.bench,rows:[lin('我只是还需要一点时间'),lin('你答应我，离开以后不要忘记我，好不好？'),me('好，我答应你'),lin('嗯'),me('你也答应我，别忘记我一直在等你'),lin(d3EveningText('【玩家名字】是我最好的朋友了')),lin('我不会忘记的'),'你突然感觉一阵天旋地转，面前的画面开始模糊了起来'],next:'reunion-fade'},
  'reunion-location':{image:D4_HOSPITAL_IMAGES.zhouhe,action:true,options:[['那林晴现在在哪？','reunion-rise']]},
  'reunion-rise':{image:D4_HOSPITAL_IMAGES.zhouhe,rows:[me('那林晴现在在哪？'),zhou('她也在这，只不过是三号楼，神经内科病区的1207床'),'你几乎没有犹豫，撑着床沿便想坐起来。',{text:'可一阵强烈的眩晕迎面袭来，你整个人十分难受，甚至有些恶心想吐。',dizzy:true},'周禾连忙扶住你，将你重新按回床上。',zhou('你别乱动！')],next:'reunion-visit-choice'},
  'reunion-visit-choice':{image:D4_HOSPITAL_IMAGES.zhouhe,options:[['我就是想去看看她','reunion-nurse'],['你让我去见见林晴','reunion-nurse']]},
  'reunion-nurse':{image:D4_HOSPITAL_IMAGES.zhouhe,rows:[zhou('我知道你想见她，但你现在什么情况你自己不清楚吗？'),zhou('我先去问问护士姐姐看她怎么说')],next:'reunion-wheelchair'},
  'reunion-wheelchair':{image:D5_REUNION_IMAGES.wheelchair,rows:['片刻后，周禾推着一辆轮椅回来了。',zhou('护士说可以去，但你不能自己走，也不能待太久。'),me('谢谢你，周禾')],next:'reunion-door'},
  'reunion-door':{image:D5_REUNION_IMAGES.door,rows:[zhou('林晴就在里面。'),{text:'周禾帮你开了门，把你推到了病床旁边。',sfx:'doorOpen'}],next:'reunion-bed'},
  'reunion-bed':{image:D5_REUNION_IMAGES.lin,rows:['一路上，你都在害怕林晴又骗了你——害怕所谓的“醒来以后再见”，其实只是一次没有归期的告别。','可她还在这里。','只要她还在，你就愿意相信她一定会回来。'],next:'reunion-bed-choice'},
  'reunion-bed-choice':{image:D5_REUNION_IMAGES.lin,options:[['不管发生什么，大家都会陪你一起面对的','reunion-touch'],['快醒来吧，你说好要陪我逛街的','reunion-touch']]},
  'reunion-touch':{image:D5_REUNION_IMAGES.lin,rows:['话音落下，你的眼泪终于不受控制地落了下来。','周禾没有说话，只是轻轻拍了拍你的肩膀。','你握住了林晴的手，轻轻的摩挲。','在你没有察觉的地方，她的指尖极轻地动了一下。'],next:'end'}
 });
 if(['021','023'].includes(d4Sleep()?.endingId)){
  scripts['nurse-question'].options=[['林晴在哪里？','ask-lin']];
  scripts['ask-lin'].rows=[me('林晴在哪里？'),nurse('什么？'),'护士似乎没有反应过来。',me('我的室友林晴，她在哪？'),nurse('我们没有接到这个病人')];scripts['ask-lin'].next='door';
  scripts['zhou-question'].options=[['林晴呢？','linqing']];
  scripts.recall.rows[0]='一瞬间，你全都想起来了。';scripts.recall.rows[2]='她被及时救了回来，生命体征平稳但一直没有醒来。';scripts.recall.next='reunion-location';
 }
 if(d4Sleep()?.endingId==='023'){
  scripts.wake.rows=['你猛地睁开眼睛。','这是……医院？'];scripts.nurse.next='door';
  scripts.visit.rows.splice(1,1);scripts.recall.rows=scripts.recall.rows.slice(0,3);
  scripts['reunion-visit-choice'].options=[['你带我去见她，我感觉她马上就会醒了','reunion-nurse']];
  scripts['reunion-bed'].rows=['你看见林晴就躺在那里，安静得像是仍被困在那场没有结束的梦里。'];
  scripts['reunion-bed-choice'].options=[['林晴，快醒醒','together-hand']];
 }
 if(d4Sleep()?.endingId==='022'){
  scripts.visit.next='zhou-question';
  scripts['sleep-low-lin']={image:D4_HOSPITAL_IMAGES.zhouhe,rows:[me('林晴呢？'),zhou('你不记得了吗？'),zhou('她在那件事之后就一直昏迷着'),zhou('今天凌晨，她的情况突然恶化……'),zhou('医生抢救了很久，但她还是没能挺过来。'),'越往后说，周禾的声音就愈发哽咽。',zhou('我还以为你们三个都要抛下我了'),me('我这不是回来了吗'),'直到这一刻你才明白，林晴所说的“醒来以后，一切都会恢复正常”什么的，根本没有包括她自己。'],next:'end'};
  scripts.linqing={...scripts['sleep-low-lin'],rows:scripts['sleep-low-lin'].rows.slice(1)};
  scripts.zhoumo.next=scripts.yelin.next='sleep-low-followup';
  scripts['sleep-low-followup']={...scripts['sleep-low-lin'],rows:[zhou('对了，还有林晴……'),zhou('她在那件事之后，就一直昏迷着。'),...scripts['sleep-low-lin'].rows.slice(3)]};
 }
 return scripts;
}
function d4LinNight(){return state.story.dayFourLinNight}
function d4LinNightInitial(){return {phase:'choice',script:'opening',index:0,remaining:0,decisions:{},asked:[],answers:{},draft:'',cgIndex:0}}
function d4LinNightStart(){if(!d4LinNight())state.story.dayFourLinNight=d4LinNightInitial()}
function d4LinNightInside(){return view==='chat'&&active==='linqing'}
function d4LinNightKey(n=d4LinNight()){return n.script==='topics'?'topics-'+(n.asked.length+1):n.script}
function d4LinNightNode(key){return key==='opening'?'day4-final-lin-night':'day4-lin-night-'+key}
function d4LinNightOptions(n=d4LinNight()){return n.script==='topics'?D4_LIN_NIGHT_TOPICS.filter(([,key])=>!n.asked.includes(key)):D4_LIN_NIGHT_SCRIPTS[n.script]?.options||[]}
function d4LinNightNotice(){d4ATop('d4-final-lin-notice','讯息 · 21:37','林晴',state.contacts.find(c=>c.id==='linqing')?.preview||'我明天睡醒，还能见到你吗？','d4-final-lin-open');const span=document.querySelector('#d4-final-lin-notice .opening-body>span');if(span)span.innerHTML=avatar('linqing')}
function d4LinNightDecorate(){
 const n=d4LinNight();if(!n||state.game.day!==4||!d4LinNightInside())return;
 document.querySelector('#d4-final-lin-notice')?.remove();screen.querySelector('[data-d4-lin-controls]')?.remove();
 const composer=screen.querySelector('#composer');if(!composer)return;
 composer.hidden=['choice','chat','input'].includes(n.phase);
 if(n.phase==='choice'){
  const key=d4LinNightKey(n);composer.insertAdjacentHTML('beforebegin','<div class="zero-choices" data-d4-lin-controls>'+d4LinNightOptions(n).map(([label],i)=>'<button type="button" data-d4-lin-choice="'+i+'" data-d4-lin-key="'+key+'">'+esc(label)+'</button>').join('')+'</div>');
  d4CaptureCheckpoint(d4LinNightNode(key),{view:'chat',active:'linqing'});
 }else if(n.phase==='input'){
  const label=D4_LIN_NIGHT_SCRIPTS[n.script].input;
  composer.insertAdjacentHTML('beforebegin','<form class="zero-choices d4-lin-input" data-d4-lin-controls><label for="d4-lin-answer">'+esc(label)+'</label><input class="nickname" id="d4-lin-answer" type="text" maxlength="500" required autocomplete="off" placeholder="输入你想说的话…" value="'+esc(n.draft)+'"><button type="submit">发送</button></form>');
  const form=screen.querySelector('.d4-lin-input'),input=form.querySelector('input'),button=form.querySelector('button');button.disabled=!input.value.trim();
  input.oninput=()=>{if(d4LinNight()!==n||n.phase!=='input')return;n.draft=input.value;button.disabled=!input.value.trim();persist()};
  form.onsubmit=e=>{e.preventDefault();d4LinNightAnswer(input.value)};
  d4CaptureCheckpoint(d4LinNightNode(n.script+'-input'),{view:'chat',active:'linqing'});
 }
 scrollMessages();
}
function d4LinNightGo(key){
 const n=d4LinNight();if(!n)return;
 if(key==='topic-end')key=n.asked.length>=2?'transition':'topics';
 n.index=0;n.remaining=messageSendDelay();d4LinNightLastTick=Date.now();
 if(key==='cg'){n.phase='cg';n.cgIndex=0;persist();d4LinNightCG();return}
 if(key==='transition'){n.phase='transition';n.remaining=2000;state.system.time='22:00';state.game.period='晚上';persist();d4LinNightTransition();return}
 n.script=key;n.phase=key==='topics'||D4_LIN_NIGHT_SCRIPTS[key].options?'choice':'chat';persist();d4LinNightDecorate();
}
function d4LinNightChoose(key,index){
 const n=d4LinNight();if(d3Paused()||state.game.day!==4||!d4LinNightInside()||n?.phase!=='choice'||d4LinNightKey(n)!==key||n.decisions[key]!==undefined||!Number.isInteger(index))return;
 const option=d4LinNightOptions(n)[index];if(!option)return;
 n.decisions[key]=option[1];if(n.script==='topics')n.asked.push(option[1]);n.phase='chat';
 d4FinalWrite('me',option[0],'d4-lin-night-choice-'+key,{chat:'linqing'});d4LinNightGo(option[1]);
}
function d4LinNightAnswer(text){
 const n=d4LinNight();text=String(text).trim();if(d3Paused()||!d4LinNightInside()||n?.phase!=='input'||!text||text.length>500||n.answers[n.script]!==undefined)return;
 const key=n.script;n.answers[key]=text;n.draft='';n.phase='chat';
 d4FinalWrite('me',text,'d4-lin-night-answer-'+key,{chat:'linqing'});d4LinNightGo(D4_LIN_NIGHT_SCRIPTS[key].next);
}
function d4LinNightCG(){
 const n=d4LinNight();if(n?.phase!=='cg')return;const previous=captureSceneSnapshot(screen);closeSheet();stopReading();view='day4-lin-night-cg';active=null;rememberRoute();zeroChrome();
 screen.innerHTML='<section class="rd-cg"><img src="'+D4_LIN_ODEN_IMAGE+'" alt="夜晚桌上的便利店关东煮"></section>';
 CGDialogue.present(screen.firstElementChild,D4_LIN_ODEN_ROWS,{index:n.cgIndex,onIndex:i=>{if(d4LinNight()===n){n.cgIndex=i;persist()}},onComplete:()=>{if(d4LinNight()===n&&n.phase==='cg')d4LinNightGo('transition')}});cgScreenCrossfade(previous);persist();
}
function d4LinNightTransition(){
 const previous=captureSceneSnapshot(screen);closeSheet();stopReading();view='day4-lin-night-transition';active=null;rememberRoute();zeroChrome();
 screen.innerHTML='<section class="fa-time-transition"><h2>时间来到22点</h2><p>该阶段你有60s可以进行购物和其他探索</p></section>';zeroDissolve(previous,600);persist();
}
function d4LinNightExploreNotice(){
 const n=d4LinNight();if(n?.phase!=='explore'||n.explorePromptSeen||d3Paused()||document.querySelector('#overlay .sheet'))return;
 sheet('自由行动','<p>该阶段你有60s可以进行购物和其他探索，也可以选择提前睡觉。</p><button class="primary" data-action="close">我知道了</button>');
 n.explorePromptSeen=true;persist();
}
let d4LinNightLastTick=0,d4LinNightLastSave=0;
function d4LinNightTick(){
 const n=d4LinNight();if(d3Paused()||state.game.day!==4||!n||!['chat','transition','explore'].includes(n.phase)){d4LinNightLastTick=0;return}
 const def=D4_LIN_NIGHT_SCRIPTS[n.script];
 // Once the last chosen topic has finished sending, returning home must not stall its handoff.
 const chatFinished=n.phase==='chat'&&n.asked.length>=2&&def?.next==='topic-end'&&n.index>=def.rows.length;
 if(n.phase==='chat'&&((!d4LinNightInside()&&!chatFinished)||document.querySelector('#overlay .sheet'))){d4LinNightLastTick=0;return}
 const now=Date.now(),elapsed=d4LinNightLastTick?now-d4LinNightLastTick:0;d4LinNightLastTick=now;
 n.remaining=Math.max(0,n.remaining-(n.phase==='chat'?Math.min(500,elapsed):elapsed));
 if(!n.remaining){
  if(n.phase==='transition'){n.phase='explore';n.remaining=60000;persist();home();status();d4LinNightExploreNotice();d4CaptureCheckpoint('day4-lin-night-explore',{view:'home',active:null})}
  else if(n.phase==='explore'){n.phase='done';persist();d4SleepStart()}
  else{const def=D4_LIN_NIGHT_SCRIPTS[n.script],text=def.rows[n.index];
   if(text!==undefined){const id='d4-lin-night-'+n.script+'-'+n.index++;n.remaining=messageSendDelay();d4FinalWrite('lin',text,id,{chat:'linqing'})}
   else if(def.input){n.phase='input';persist();d4LinNightDecorate()}
   else d4LinNightGo(def.next);
  }
 }
 if(n.phase==='explore')d4LinNightExploreNotice();
 if(now-d4LinNightLastSave>=1000){d4LinNightLastSave=now;persist()}
}
function migrateDayFourLinNight(progress){
 const q=progress.story?.dayFourFinal;if(!q)return false;let changed=false;
 const night=progress.story.dayFourLinNight;
 // Resume old saves paused by the removed affection gate at the first unsent reply.
 if(night?.phase==='high-affection'){
  Object.assign(night,{phase:'chat',script:'friend',index:0,remaining:messageSendDelay()});changed=true;
 }
 if(night&&Object.prototype.hasOwnProperty.call(night,'affection')){delete night.affection;changed=true}
 if(night?.decisions?.opening==='affection'){night.decisions.opening='friend';changed=true}
 const rows=progress.messages?.[DAY_ONE_REPORT_ID],obsolete=rows?.findIndex(m=>m.id==='day4-final-release')??-1;
 if(obsolete>=0){const wasLast=obsolete===rows.length-1;rows.splice(obsolete,1);const c=progress.contacts.find(c=>c.id===DAY_ONE_REPORT_ID);if(c){if(wasLast){c.preview=rows.at(-1)?.text||'';c.time=rows.at(-1)?.time||''}if(q.phase==='release-unread')c.unread=Math.max(0,(c.unread||0)-1)}changed=true}
 if(q.phase==='release-unread'){q.phase='lin-wait';q.remaining=3000;progress.system.time='21:23';progress.story.route={view:'home',active:null};changed=true}
 const message=progress.messages?.linqing?.find(m=>m.id==='day4-final-lin-night');
 if(message?.text==='你说我明天睡醒，还能见到你吗？'){message.text='我明天睡醒，还能见到你吗？';const c=progress.contacts.find(c=>c.id==='linqing');if(c?.preview==='你说我明天睡醒，还能见到你吗？')c.preview=message.text;changed=true}
 if(q.phase==='done'&&message&&!progress.story.dayFourLinNight){progress.story.dayFourLinNight=d4LinNightInitial();changed=true}
 return changed;
}
storySnapshotMigrations.push(migrateDayFourLinNight);
function d4LinNightRestore(route=state.story.route){
 const n=d4LinNight();if(!n)return;
 if(n.phase==='cg')d4LinNightCG();else if(n.phase==='transition')d4LinNightTransition();
 else{if(route?.view==='chat'&&route.active)openChat(route.active);else if(route?.view==='home'||!route)home();else d4FinalRestoreView(route);if(['choice','chat','input'].includes(n.phase)&&!d4LinNightInside())d4LinNightNotice()}
}
const d4LinNightChatBase=openChat;openChat=function(...args){const result=d4LinNightChatBase(...args);d4LinNightDecorate();return result};
const d4LinNightResumeBase=resumeStoryScene;resumeStoryScene=function(snapshot,...args){if(snapshot?.game?.day!==4||!snapshot.story?.dayFourLinNight)return d4LinNightResumeBase(snapshot,...args);d4LinNightRestore(snapshot.story.route);persist()};
const d4LinNightCleanupBase=cleanupSceneResume;cleanupSceneResume=function(...args){d4LinNightLastTick=0;document.querySelector('#d4-final-lin-notice')?.remove();return d4LinNightCleanupBase(...args)};
const d4LinNightLockBase=zeroLock;zeroLock=function(){return state.game.day===4&&!['game-menu','nodes'].includes(view)&&['cg','transition'].includes(d4LinNight()?.phase)||d4LinNightLockBase()};
window.addEventListener('click',event=>{const b=event.target.closest('[data-d4-lin-choice]');if(!b)return;event.preventDefault();event.stopImmediatePropagation();d4LinNightChoose(b.dataset.d4LinKey,Number(b.dataset.d4LinChoice))},true);
document.addEventListener('visibilitychange',()=>{d4LinNightLastTick=0});setInterval(d4LinNightTick,100);

const D4_LIN_NIGHT_NODES=[...Object.entries(D4_LIN_NIGHT_SCRIPTS).filter(([,def])=>def.options).map(([key,def])=>[key,def.title]),['topics-1','选择第一个睡前话题'],['topics-2','选择第二个睡前话题'],['hobbies-input','分享自己的爱好'],['impression-input','告诉林晴你眼中的她'],['explore','22:00 · 自由探索60秒']];
for(const [key,title]of D4_LIN_NIGHT_NODES)STORY_CHOICES.push({id:d4LinNightNode(key),title,day:'第四日 · 深夜',chat:key==='explore'?null:'linqing'});
const d4LinNightGraphBase=makeDayFourWorldline;makeDayFourWorldline=function(){
 const g=d4LinNightGraphBase(),opening=g.nodes.find(n=>n.id==='day4-final-lin-night');opening.record=opening.id;opening.replayable=true;let x=g.width;
 g.sections.push({label:'第四日 · 林晴的深夜消息',x:opening.x});
 const positions={regret:[0,420],pastime:[1,420],oden:[2,200],'oden-confirm':[3,200],'topics-1':[2,650],'topics-2':[5,650],'song-choice':[3,860],'hobbies-input':[3,560],'impression-input':[4,650],explore:[6,420]};
 for(const [key,title]of D4_LIN_NIGHT_NODES){if(key==='opening')continue;const [col,y]=positions[key];g.nodes.push({id:d4LinNightNode(key),title,x:x+col*310,y,kind:'story',record:d4LinNightNode(key),replayable:true})}
 const links=[['opening','regret'],['regret','pastime'],['pastime','oden'],['oden','oden-confirm'],['oden','explore'],['oden-confirm','explore'],['pastime','topics-1'],['topics-1','hobbies-input'],['topics-1','song-choice'],['topics-1','impression-input'],['hobbies-input','topics-2'],['song-choice','topics-2'],['impression-input','topics-2'],['topics-2','explore']];
 for(const [from,to]of links)g.edges.push({from:d4LinNightNode(from),to:d4LinNightNode(to)});g.width=x+7*310;return g;
};
const d4LinNightMigrated=migrateDayFourLinNight(state);if(d4LinNightMigrated)persist();
if(!d3Paused()&&state.game.day===4){
 if(d4LinNight())d4LinNightRestore();
 else if(d4LinNightMigrated&&d4Final()?.phase==='lin-wait'){document.querySelector('#d4-final-release-notice')?.remove();d4FinalLastTick=Date.now();home();status()}
}

/* Final sleep and hospital continuation. All choices and clocks rewind with the story. */
let d4SleepInternal=false,d4SleepLastTick=0,d4SleepLastSave=0,d4HospitalSound=null,d4HospitalSoundDue=0,d4HospitalBurst=null,d4HospitalBurstIndex=0;
function d4Sleep(){return state.story.dayFourSleep}
function d4SleepBusy(){return !!d4Sleep()&&d4Sleep().phase!=='done'}
const D5_RELEASE_NODE='day5-release-notice';
function dayFiveReleaseReached(progress){
 const phase=progress?.story?.dayFourSleep?.phase;
 return ['notice','reading','cg','choice','sleep-choice','sleep-timeout','white-wait','white-fade','blur','recall-shake','end-black','done','hidden-ending'].includes(phase)
  ||(Array.isArray(progress?.forumPosts)&&progress.forumPosts.some(p=>p.id===D4_RELEASE_POST))
  ||(Array.isArray(progress?.messages?.[DAY_ONE_REPORT_ID])&&progress.messages[DAY_ONE_REPORT_ID].some(m=>m.id===D4_RELEASE_POST));
}
function d5CaptureCheckpoint(id){
 if(d3Paused()||!dayFiveReleaseReached(state))return;
 d2Capture(id,{view:'day4-sleep-ending',active:null});
}
function d5SleepChoiceNode(key){if(d4Sleep()?.endingId==='023'&&['zhou-question','reunion-location','reunion-visit-choice','reunion-bed-choice'].includes(key))return 'day5-together-'+key;if(d4Sleep()?.endingId==='022'&&key==='nurse-question')return 'day5-low-nurse-question';if(d4Sleep()?.endingId==='022'&&key==='zhou-question')return 'day5-low-lin';if(d4Sleep()?.endingId==='021'&&['nurse-question','zhou-question'].includes(key))return 'day5-reunion-'+key;return /^(follow|stay|reunion|leave|together)-/.test(key)?'day5-'+key:'day4-hospital-'+key}
function d4SleepStart(){
 if(state.game.day!==4||d4Sleep()||d4LinNight()?.phase!=='done'||state.game.survivalEnding)return;
 state.story.dayFourSleep={phase:'bed',date:state.system.date,remaining:0,script:null,cgIndex:0,decisions:{},monitor:false};
 d4SleepRender();
}
function d4SleepSet(phase,remaining=0){const n=d4Sleep();n.phase=phase;n.remaining=remaining;d4SleepLastTick=Date.now();d4SleepRender()}
function d4SleepGo(key,reply=null){
 const n=d4Sleep();if(!n)return;clearInterval(cgTypingTimer);
 if(key==='leave-judge'){
  if(!n.leaveDecision){const affection=Number(state.game.trust?.linqing??30);n.leaveDecision={affection,endingId:affection>160?'023':'021'}}
  n.endingId=n.leaveDecision.endingId;persist();key=n.endingId==='023'?'leave-high-choice':'leave-low-choice';
 }
 if(key==='sleep-choice'){n.reply=null;d4SleepSet('sleep-choice',10000);return}
 if(key==='leave-white'){n.reply=null;d4SleepSet('white-wait',2000);return}
 if(key==='reunion-fade'){n.blurNext='white-wait';d4SleepSet('blur',D3_NIGHT_BLUR_MS);return}
 if(key==='recall-shake'){d4SleepSet('recall-shake',550);return}
 if(key==='end'){n.monitor=false;d4HospitalStopSound();d4SleepSet('end-black',1500);return}
 if(key==='stay-ending'){d5FinishStayEnding();return}
 if(key==='stay-gate'){state.system.time='01:30';state.game.period='凌晨'}
 if(key==='door'){n.monitor=false;d4HospitalStopSound()}
 const def=d4HospitalScripts()[key];if(!def)return;
 n.previous=n.script;n.script=key;n.reply=reply;n.cgIndex=0;n.phase=def.options?'choice':'cg';d4SleepLastTick=Date.now();d4SleepRender();
}
function d4SleepChoose(key,index){
 const n=d4Sleep();if(d3Paused()||view!=='day4-sleep-ending'||n?.phase!=='choice'||n.script!==key||n.decisions[key]!==undefined)return;
 const def=d4HospitalScripts()[key],option=def?.options?.[index];
 // Unwritten outcomes stay visible without consuming the choice or its snapshot.
 if(!option?.[1])return;
 if(key==='follow-stay-choice'&&index===0){
  const affection=Number(state.game.trust?.linqing??30);
  n.stayAffection=affection;
  n.stayDecision={affection,endingId:affection>170?'020':'021'};
  if(n.stayDecision.endingId==='021'){n.endingId='021';n.decisions[key]=index;d4SleepGo('reunion-refusal',option[0]);return}
 }
 n.decisions[key]=index;
 if(option[2]){state.game.trust??={};state.game.trust.linqing=(state.game.trust.linqing??30)+option[2]}
 d4SleepGo(option[1],def.action||option[1]==='ask-lin'?null:option[0]);
}
function d4SleepPublish(){
 const n=d4Sleep();state.system.date=deliveryDateNext(n.date);state.system.time='01:00';state.game.day=5;state.game.period='凌晨';
 const text='校园新规将于30分钟后解除';
 if(!state.forumPosts.some(p=>p.id===D4_RELEASE_POST))state.forumPosts.push({id:D4_RELEASE_POST,author:'campus-system',name:'',nightService:true,official:true,tag:'校园新规',category:'校园新规',title:text,body:D5_RELEASE_BODY,date:state.system.date,time:'01:00',likes:0,replies:[]});
 const rows=state.messages[DAY_ONE_REPORT_ID]??=[];
 if(!rows.some(m=>m.id===D4_RELEASE_POST)){
  rows.push({id:D4_RELEASE_POST,type:'text',sender:'chat_report_black',name:'',text:'校园墙 · 转发帖子：'+text,time:'01:00',gameDate:state.system.date});
  const c=reportContact();if(c){c.preview=text;c.time='01:00';c.unread=(c.unread||0)+1}
 }
 n.phase='notice';d4SleepRender();status();d4SleepNotice();
}
function d4SleepNotice(){
 if(document.querySelector('#d4-release-notice'))return;
 const el=document.createElement('div');el.id='d4-release-notice';el.className='opening-message';
 el.innerHTML='<button class="opening-body" data-action="d4-release-open"><span>'+avatar('chat_report_black')+'</span><span><small>讯息 · 01:00</small><strong>校园墙 · 转发帖子</strong><span>校园新规将于30分钟后解除</span></span></button>';
 document.querySelector('#phone').append(el);playNotificationSound('message',el);
}
function d4SleepOpenRelease(){
 if(d3Paused()||!['notice','reading'].includes(d4Sleep()?.phase))return;
 d4Sleep().phase='reading';document.querySelector('#d4-release-notice')?.remove();if(reportContact())reportContact().unread=0;
 d4SleepInternal=true;try{postDetail(D4_RELEASE_POST)}finally{d4SleepInternal=false}
 screen.querySelector('.page-head button[aria-label^="返回"]')?.remove();midnightContinue.hidden=false;zeroChrome();refreshPhoneBack();persist();
}
function d4SleepCommit(){
 const n=d4Sleep();if(d3Paused()||n?.phase!=='sleep-choice'||n.remaining<=0)return;
 if(!n.sleepDecision){const affection=Number(state.game.trust?.linqing??30);n.sleepDecision={affection,endingId:affection<120?'022':'019'}}
 n.decisions.sleep='continue';n.endingId=n.sleepDecision.endingId;persist();d4SleepSet('white-wait',2000);
}
function d4SleepTimeout(){
 const n=d4Sleep();
 if(!n||!['sleep-choice','sleep-timeout'].includes(n.phase)||n.remaining>0||n.decisions.sleep==='continue')return;
 n.decisions.sleep='follow';n.monitor=false;d4HospitalStopSound();d4SleepGo('follow-awake');
}
function d5FinishStayEnding(){
 const n=d4Sleep();
 // Keep the decision made at the branch, including older saves already on the hidden route.
 const chosenEnding=n?.stayDecision?.endingId||(n?.stayAffection>170?'020':null);
 if(n?.script!=='stay-forgotten'||n.phase!=='cg'||chosenEnding!=='020'||n.decisions['follow-stay-choice']!==0||![0,1].includes(n.decisions['stay-promise-choice']))return;
 n.phase='hidden-ending';n.endingId='020';n.monitor=false;n.remaining=0;
 state.system.time='01:30';d5RenderStayEnding();
}
function d5RenderStayEnding(){
 const n=d4Sleep();if(n?.phase!=='hidden-ending'||n.endingId!=='020')return;
 enterStoryEnding();d4HospitalStopSound();earlySleepButton.hidden=true;midnightContinue.hidden=true;
 view='day5-hidden-ending';active=null;rememberRoute();zeroChrome();
 screen.innerHTML='<section class="zero-death"><p>解锁结局020：<br>明天也请留在这里吧。</p><button class="secondary" data-action="d5-hidden-menu">返回主页</button></section>';
 window.endingGalleryUnlockLinStay?.(state);persist();
}
function d4HospitalStopSound(){
 if(d4HospitalSound){d4HospitalSound.pause();d4HospitalSound.currentTime=0}
 d4HospitalSoundDue=0;d4HospitalBurst=null;
}
function d4HospitalSyncSound(){
 if(!d4Sleep()?.monitor||d3Paused()||view!=='day4-sleep-ending'||document.querySelector('#cg-recovery-confirm')||mobileSounds.silent){d4HospitalStopSound();return}
 const now=Date.now();
 if(d4HospitalBurst){const b=d4HospitalBurst,t=now-b.start;if(t>=b.duration){d4HospitalSound.pause();d4HospitalSound.volume=0;d4HospitalBurst=null}else d4HospitalSound.volume=b.volume*Math.max(0,Math.min(1,t/250,(b.duration-t)/450));return}
 if(now<d4HospitalSoundDue)return;
 if(!d4HospitalSound){d4HospitalSound=new Audio(SURVEY_CONFIG.sound);d4HospitalSound.loop=false}
 const i=d4HospitalBurstIndex++,duration=[2200,3000,1800,3400][i%4],b={start:now,duration,volume:.18};
 d4HospitalBurst=b;d4HospitalSoundDue=now+duration+[2000,3000,2500,3500][i%4];d4HospitalSound.currentTime=0;d4HospitalSound.volume=0;
 d4HospitalSound.play().catch(()=>{if(d4HospitalBurst===b){d4HospitalBurst=null;d4HospitalSoundDue=Date.now()+1000}});
}
function d4SleepRender(){
 const n=d4Sleep();if(!n||n.phase==='done')return;
 // Resume older saves at this line with the new recall effect as well.
 if(n.phase==='blur'&&n.script==='linqing'&&!n.blurNext){n.phase='recall-shake';n.remaining=550}
 if(n.phase==='hidden-ending'){d5RenderStayEnding();return}
 const previous=captureSceneSnapshot(screen);closeSheet();stopReading();clearInterval(cgTypingTimer);earlySleepButton.hidden=true;midnightContinue.hidden=true;
 view='day4-sleep-ending';active=null;rememberRoute();zeroChrome();
 if(['cg','choice','blur','recall-shake'].includes(n.phase)){
  const def=d4HospitalScripts()[n.script],src=n.phase==='blur'&&n.blurNext!=='white-wait'?D4_HOSPITAL_IMAGES.zhouhe:def?.image;
  const imageLabel=src===D3_NIGHT_IMAGE?'夜晚的宿舍':src===D5_FOLLOW_IMAGES.road?'夜晚通往校门的小路':src===D5_FOLLOW_IMAGES.bench?'坐在校门旁长椅上的林晴':src===D5_STAY_IMAGES.love?'林晴握着你的手':src&&src===D5_STAY_IMAGES.later?'留在校园的日子':'医院病房';
  screen.innerHTML='<section class="rd-cg d4-hospital-scene'+(n.phase==='recall-shake'?' d4-confront-shake':'')+(!src?(def?.dark?' d4-final-sleep-black':' d4-hospital-light'):'')+'">'+(src?'<img src="'+src+'" alt="'+imageLabel+'"'+(n.phase==='blur'?' class="d3-night-blur" style="animation-delay:-'+(D3_NIGHT_BLUR_MS-n.remaining)+'ms"':n.phase==='recall-shake'?' style="animation-delay:-'+(550-n.remaining)+'ms"':'')+'>':'')+'</section>';
  const host=screen.firstElementChild;
  if(n.phase==='choice'){
   const last=d4HospitalScripts()[n.previous]?.rows?.at(-1);cgChoiceDialogue(host,last);
   host.insertAdjacentHTML('beforeend','<div class="cg-options">'+def.options.map(([label],i)=>'<button type="button" data-d4-hospital-key="'+n.script+'" data-d4-hospital-choice="'+i+'">'+esc(label)+'</button>').join('')+'</div>');
  }else if(n.phase==='cg'){
   const rows=n.reply?[{speaker:'me',text:n.reply},...def.rows]:def.rows;
   const sync=()=>{if(rows[n.cgIndex]?.monitor)n.monitor=true;host.querySelector('img')?.classList.toggle('d3-night-blur',!!rows[n.cgIndex]?.dizzy);d4HospitalSyncSound()};sync();
   CGDialogue.present(host,rows,{index:n.cgIndex,firstReplyConfirmed:!!n.reply||n.script==='ask-lin',onIndex:i=>{if(d4Sleep()===n&&n.phase==='cg'){n.cgIndex=i;sync();persist()}},onComplete:()=>{if(d4Sleep()===n&&n.phase==='cg')d4SleepGo(def.next)}});
  }
 }else if(n.phase==='sleep-choice'){
  screen.innerHTML='<section class="rd-cg"><img src="'+D3_NIGHT_IMAGE+'" alt="夜晚的宿舍"></section>';
  midnightContinue.hidden=false;
 }else if(n.phase==='bed'){
  screen.innerHTML='<section class="ending-scene"><img src="'+DAY_ZERO_BEDROOM+'" alt="夜晚的宿舍"><div class="cg-options"><button class="ending-rest" data-action="d4-final-sleep">上床睡觉</button></div></section>';
 }else{
  screen.innerHTML='<section class="ending-scene d4-final-sleep-black'+(n.phase==='white-fade'?' d4-final-sleep-light':'')+'"'+(n.phase==='white-fade'?' style="animation-delay:-'+(1800-n.remaining)+'ms"':'')+' aria-label="夜晚"></section>';
 }
 if(!['white-fade','blur','recall-shake'].includes(n.phase)){if(screen.querySelector('img'))cgScreenCrossfade(previous);else zeroDissolve(previous,600)}
 // Save only the scene actually on screen, including an older save resumed here.
 if(n.phase==='notice')d5CaptureCheckpoint(D5_RELEASE_NODE);
 else if(n.phase==='cg'&&n.script==='sleep-low-lin')d5CaptureCheckpoint('day5-low-lin');
 else if(n.phase==='choice'&&n.decisions[n.script]===undefined)d5CaptureCheckpoint(d5SleepChoiceNode(n.script));
 else if(n.phase==='sleep-choice'&&n.remaining>0&&n.decisions.sleep===undefined)d5CaptureCheckpoint('day4-continue-sleep');
 persist();
}
function d4SleepTick(){
 if(d3Paused()||document.querySelector('#cg-recovery-confirm')){d4SleepLastTick=0;d4HospitalStopSound();const img=screen.querySelector('.d4-hospital-scene .d3-night-blur,.d4-hospital-scene.d4-confront-shake>img');if(img)img.style.animationPlayState='paused';return}
 if(!d4Sleep()&&d4LinNight()?.phase==='done'&&state.game.day===4)d4SleepStart();
 const n=d4Sleep();if(!n||['done','hidden-ending'].includes(n.phase)){d4SleepLastTick=0;return}
 d4HospitalSyncSound();const img=screen.querySelector('.d4-hospital-scene .d3-night-blur,.d4-hospital-scene.d4-confront-shake>img');if(img)img.style.animationPlayState='running';
 const now=Date.now(),elapsed=d4SleepLastTick?now-d4SleepLastTick:0;d4SleepLastTick=now;
 if(!['sleep-wait','sleep-choice','white-wait','white-fade','blur','recall-shake','end-black'].includes(n.phase))return;
 n.remaining=Math.max(0,n.remaining-elapsed);
 if(!n.remaining){
  if(n.phase==='sleep-wait')d4SleepPublish();
  else if(n.phase==='sleep-choice')d4SleepTimeout();
  else if(n.phase==='white-wait')d4SleepSet('white-fade',1800);
  else if(n.phase==='white-fade')d4SleepGo('light');
  else if(n.phase==='recall-shake')d4SleepGo('recall');
  else if(n.phase==='blur'){if(n.blurNext==='white-wait'){delete n.blurNext;d4SleepSet('white-wait',2000)}else d4SleepGo('recall')}
  else if(n.phase==='end-black'){n.phase='done';n.monitor=false;d4HospitalStopSound();persist();home();zeroChrome();persist()}
 }
 if(now-d4SleepLastSave>=1000){d4SleepLastSave=now;persist()}
}
const d4SleepLockBase=zeroLock;zeroLock=function(){return !d4SleepInternal&&d4SleepBusy()&&!['game-menu','nodes'].includes(view)||d4SleepLockBase()};
const d4SleepHomeBase=home;home=function(...args){if(d4SleepBusy()&&!d4SleepInternal&&!d3Paused())return;return d4SleepHomeBase(...args)};
const d4SleepAppBase=openApp;openApp=function(...args){if(d4SleepBusy()&&!d4SleepInternal&&!d3Paused())return;return d4SleepAppBase(...args)};
const d4SleepEarlyBase=earlySleepAvailable;earlySleepAvailable=function(){return state.game.day===4&&d4LinNight()?.phase==='explore'?!d3Paused():d4SleepEarlyBase()};
const d4SleepPurchaseBase=postPurchasePrompt;postPurchasePrompt=function(...args){return state.game.day===4&&d4LinNight()?.phase==='explore'?false:d4SleepPurchaseBase(...args)};
const d4SleepEarlyConfirmBase=actions['post-early-sleep-confirm'];actions['post-early-sleep-confirm']=function(...args){if(state.game.day===4&&d4LinNight()?.phase==='explore'){if(d3Paused())return;d4LinNight().phase='done';closeSheet();d4SleepStart();return}return d4SleepEarlyConfirmBase(...args)};
const d4SleepReadingBase=midnightRulesReading;midnightRulesReading=function(){return d4Sleep()?.phase==='sleep-choice'&&view==='day4-sleep-ending'||d4Sleep()?.phase==='reading'&&view==='post'&&active===D4_RELEASE_POST||d4SleepReadingBase()};
const d4SleepContinueBase=midnightContinue.onclick;midnightContinue.onclick=function(event){if(d4Sleep()?.phase==='sleep-choice'&&view==='day4-sleep-ending'){d4SleepCommit();return}if(d4Sleep()?.phase==='reading'&&active===D4_RELEASE_POST){d4SleepGo('bedtime');return}return d4SleepContinueBase.call(this,event)};
const d4SleepCleanupBase=cleanupSceneResume;cleanupSceneResume=function(...args){d4SleepLastTick=0;d4HospitalStopSound();document.querySelector('#d4-release-notice')?.remove();return d4SleepCleanupBase(...args)};
const d4SleepResumeBase=resumeStoryScene;resumeStoryScene=function(snapshot,...args){
 if(!snapshot?.story?.dayFourSleep)return d4SleepResumeBase(snapshot,...args);
 d4SleepLastTick=0;if(d4Sleep().phase==='done'){home();zeroChrome();persist();return}
 // Resume saves made while the timeout branch was still an empty placeholder.
 if(d4Sleep().phase==='sleep-timeout'){d4SleepTimeout();return}
 if(d4Sleep().phase==='reading')d4SleepOpenRelease();else{d4SleepRender();if(d4Sleep().phase==='notice')d4SleepNotice()}
};
Object.assign(actions,{'d4-release-open':d4SleepOpenRelease,'d4-final-sleep':()=>{if(!d3Paused()&&d4Sleep()?.phase==='bed')d4SleepSet('sleep-wait',1500)},'d4-continue-sleep':d4SleepCommit});
actions['d5-hidden-menu']=()=>{
 if(view!=='day5-hidden-ending'||d4Sleep()?.phase!=='hidden-ending')return;
 d4SleepInternal=true;try{actions['zero-menu']()}finally{d4SleepInternal=false}
};
window.addEventListener('click',event=>{
 const b=event.target.closest('[data-d4-hospital-choice],[data-action="d4-release-open"],[data-action="d4-final-sleep"],[data-action="d4-continue-sleep"],[data-action="d5-hidden-menu"]');if(!b)return;
 event.preventDefault();event.stopImmediatePropagation();if(b.dataset.action)actions[b.dataset.action]();else d4SleepChoose(b.dataset.d4HospitalKey,Number(b.dataset.d4HospitalChoice));
},true);
document.addEventListener('visibilitychange',()=>{d4SleepLastTick=0;if(document.hidden)d4HospitalStopSound()});
setInterval(d4SleepTick,100);
for(const [key,title]of [['goodnight','回应林晴的晚安'],['nurse-question','向护士询问'],['zhou-question','向周禾询问']])STORY_CHOICES.push({id:'day4-hospital-'+key,title,day:key==='goodnight'?'第五日 · 凌晨':'第五日 · 结局019',chat:null});
const D5_FOLLOW_CHOICES=[['follow-rise','起来跟上她'],['follow-concern','回应林晴的询问'],['follow-stay-choice','留下还是离开'],['stay-promise-choice','回应林晴的挽留']];
for(const [key,title]of D5_FOLLOW_CHOICES)STORY_CHOICES.push({id:d5SleepChoiceNode(key),title,day:'第五日 · 夜晚的校门',chat:null});
STORY_CHOICES.push({id:D5_RELEASE_NODE,title:'校园新规解除通知',day:'第五日 · 01:00',chat:null},{id:'day4-continue-sleep',title:'01:00 · 继续睡觉',day:'第五日 · 凌晨',chat:null});
STORY_CHOICES.push({id:'day5-mother-call',title:'妈妈来电',day:'第五日 · 现实医院',chat:null});
for(const [id,title]of [['day5-low-nurse-question','医院苏醒'],['day5-low-lin','询问林晴的近况'],['day5-low-mother-call','妈妈来电']])STORY_CHOICES.push({id,title,day:'第五日 · 结局022',chat:null});
const D5_REUNION_CHOICES=[['why','回应林晴的拒绝'],['nurse-question','向护士寻找林晴'],['zhou-question','向周禾询问林晴'],['location','询问林晴的病床'],['visit-choice','想去见林晴'],['bed-choice','在林晴病床旁'],['mother-call','妈妈来电']];
for(const [key,title]of D5_REUNION_CHOICES)STORY_CHOICES.push({id:'day5-reunion-'+key,title,day:'第五日 · 结局021',chat:null});
for(const [id,title]of [['day5-leave-low-choice','陪林晴面对'],['day5-leave-high-choice','牵手离开']])STORY_CHOICES.push({id,title,day:'第五日 · 夜晚的校门',chat:null});
const D5_TOGETHER_CHOICES=[['zhou-question','向周禾询问林晴'],['reunion-location','询问林晴的病床'],['reunion-visit-choice','请周禾带你探望'],['reunion-bed-choice','唤醒林晴'],['call-choice','握住林晴的手'],['mother-call','妈妈来电']];
for(const [key,title]of D5_TOGETHER_CHOICES)STORY_CHOICES.push({id:'day5-together-'+key,title,day:'第五日 · 结局023',chat:null});
function makeDayFiveWorldline(){
 window.ensureMotherCallNode?.();
 window.ensureMotherCallNode?.('021');
 window.ensureMotherCallNode?.('022');
 window.ensureMotherCallNode?.('023');
 // Keep the existing hospital checkpoint IDs so archived saves remain usable.
 const g={nodes:[
  {id:'day5-start',title:'第五日开始',x:72,y:420,kind:'story',record:null,replayable:false},
  {id:D5_RELEASE_NODE,title:'校园新规解除通知',x:382,y:420,kind:'story',record:D5_RELEASE_NODE,replayable:!!nodeRecords()[D5_RELEASE_NODE]?.checkpoint}
 ],edges:[{from:'day5-start',to:D5_RELEASE_NODE}],sections:[{label:'第五日',x:72}],height:900,width:0};
 const add=(id,x,y)=>g.nodes.push({id,title:STORY_CHOICES.find(n=>n.id===id).title,x,y,kind:'story',record:id,replayable:true});
 let from=D5_RELEASE_NODE,x=692;
 for(const id of ['day4-hospital-goodnight','day4-continue-sleep']){add(id,x,420);g.edges.push({from,to:id});from=id;x+=310}
 const split=from,branchX=x;
 g.sections.push({label:'第五日 · 梦与现实',x:branchX});
 for(const id of ['day4-hospital-nurse-question','day4-hospital-zhou-question']){add(id,x,240);g.edges.push({from,to:id});from=id;x+=310}
 g.nodes.push({id:'day5-mother-call',title:'妈妈来电',x,y:240,kind:'story',record:'day5-mother-call',replayable:!!nodeRecords()['day5-mother-call']?.checkpoint});g.edges.push({from,to:'day5-mother-call'});x+=310;
 g.nodes.push({id:'019',title:'结局019 · 你成功苏醒了。',x,y:240,kind:'death',category:'survival',record:null,replayable:false});g.edges.push({from:'day5-mother-call',to:'019'});
 from=split;x=branchX;
 for(const [key]of D5_FOLLOW_CHOICES){const id=d5SleepChoiceNode(key);add(id,x,600);g.edges.push({from,to:id});from=id;x+=310}
 g.nodes.push({id:'020',title:'结局020 · 明天也请留在这里吧。',x,y:600,kind:'death',category:'hidden',record:null,replayable:false});g.edges.push({from,to:'020'});x+=310;
 const upperWidth=x;
 from='day5-follow-stay-choice';x=g.nodes.find(n=>n.id===from).x+310;
 for(const [key]of D5_REUNION_CHOICES){const id='day5-reunion-'+key;add(id,x,960);g.edges.push({from,to:id});from=id;x+=310}
 g.nodes.push({id:'021',title:'结局021 · 故事还没有结束。',x,y:960,kind:'death',category:'survival',record:null,replayable:false});g.edges.push({from,to:'021'});
 const reunionWidth=x+310;from=split;x=branchX;
 for(const id of ['day5-low-nurse-question','day5-low-lin','day5-low-mother-call']){add(id,x,1320);g.edges.push({from,to:id});from=id;x+=310}
 g.nodes.push({id:'022',title:'结局022 · 你成功活下来了。',x,y:1320,kind:'death',category:'survival',record:null,replayable:false});g.edges.push({from,to:'022'});
 const priorWidth=Math.max(upperWidth,reunionWidth,x+310),leaveX=g.nodes.find(n=>n.id==='day5-follow-stay-choice').x+310;
 add('day5-leave-low-choice',leaveX,790);g.edges.push({from:'day5-follow-stay-choice',to:'day5-leave-low-choice'},{from:'day5-leave-low-choice',to:'day5-reunion-nurse-question'});
 from='day5-leave-high-choice';x=leaveX;add(from,x,1680);g.edges.push({from:'day5-follow-stay-choice',to:from});x+=310;
 for(const [key]of D5_TOGETHER_CHOICES){const id='day5-together-'+key;add(id,x,1680);g.edges.push({from,to:id});from=id;x+=310}
 g.nodes.push({id:'023',title:'结局023 · 你们一起回来了。',x,y:1680,kind:'death',category:'hidden',record:null,replayable:false});g.edges.push({from,to:'023'});
 g.height=1960;g.width=Math.max(priorWidth,x+310)+70;return g;
}
function migrateDayFiveReleaseBody(progress){
 const post=progress?.forumPosts?.find(p=>p.id===D4_RELEASE_POST);
 if(!post||post.body===D5_RELEASE_BODY)return false;
 post.body=D5_RELEASE_BODY;return true;
}
storySnapshotMigrations.push(migrateDayFiveReleaseBody);
if(migrateDayFiveReleaseBody(state))persist();
if(!d3Paused()&&d4Sleep())resumeStoryScene(state);
