/* DAY02cg和自由行动: the author's midday dialogue and conditional investigations. */
const D2_CG_IMAGES={desk:'assets/day2-midday-desk.jpg?v=20261011-rc5',lin:'assets/day2-midday-linqing.jpg?v=20261011-rc5',knit:'assets/day2-midday-knitting.jpg?v=20261011-rc5'};
const D2_CG={
 intro:{image:'desk',rows:['早上发生的事情太多了，你现在只觉得脑子里乱糟糟的。','你放下了手机，抬手揉了揉太阳穴。',{speaker:'linqing',text:'嘶……'}],next:'needle'},
 needle:{image:'lin',rows:['旁边突然传来一声很轻的抽气声。',{speaker:'me',text:'怎么了？'},{speaker:'linqing',text:'没事，不小心被针扎了一下'}],next:'knitIntro'},
 knitIntro:{image:'knit',rows:['你起身走到林晴旁边，这才注意到林晴手里拿着毛线和织针。'],next:'knitChoice'},
 knitChoice:{image:'knit',choices:[['你在织什么？','scarf'],['你还会这个？','skill']]},
 scarf:{image:'knit',rows:[{speaker:'linqing',text:'围巾'}],next:'alone'},
 skill:{image:'knit',rows:[{speaker:'linqing',text:'会一点点'}],next:'alone'},
 alone:{image:'knit',rows:['她的动作看起来很熟练。',{speaker:'linqing',text:'之前我一个人的时候，就经常做这个打发时间。'},{speaker:'me',text:'你一个人的时候？'},'林晴手上的动作停了一下。',{speaker:'linqing',text:'哦哦，就是暑假的时候。'},{speaker:'linqing',text:'那时候经常一个人在家。'}],next:'familyChoice'},
 familyChoice:{image:'knit',choices:[['你家里人呢？','family'],['那你怎么不找我呀？','askMe']]},
 family:{image:'knit',rows:[{speaker:'linqing',text:'他们…他们经常不在家的，有自己的事嘛'},{speaker:'me',text:'所以你经常一个人？'},{speaker:'linqing',text:'嗯嗯，一个人待着挺好的'}],next:'finish'},
 askMe:{image:'knit',rows:[{speaker:'linqing',text:'找你干嘛？'}],next:'companyChoice'},
 companyChoice:{image:'knit',choices:[['无聊的时候可以找我聊天嘛','chat'],['不想一个人的时候，我可以陪你','company']]},
 chat:{image:'knit',rows:[{speaker:'linqing',text:'我就是怕，你们都有自己的事要做'},{speaker:'me',text:'回几句消息又不影响什么'},{speaker:'linqing',text:'嗯嗯，我知道了'}],next:'finish'},
 company:{image:'knit',rows:['林晴愣了一下。',{speaker:'linqing',text:'你不用特地陪我的，一个人真的没什么'},{speaker:'me',text:'嗯……也不算特地吧？'},{speaker:'linqing',text:'……哦哦'},'她低下头，又绕了一针毛线。'],next:'finish'}
};
const d2say=(who,...lines)=>lines.map(text=>faSay(who,text));
const d2choice=(...choices)=>faChoice(...choices);
const d2end=id=>faEnd(id);
Object.assign(FA_PEOPLE,{
 zhoumo:{name:'周茉',room:'316',avatar:dayTwoPerson('zhoumo').avatar,contact:'zhoumo'},
 yelin:{name:'叶琳',room:'108',avatar:dayTwoPerson('yelin').avatar,contact:'yelin'},
 meng:{name:'孟舒',room:'312',avatar:POST_MENG_AVATAR,contact:POST_MENG_ID},
 hanlu:{name:'韩露',room:'506',avatar:dayTwoPerson('hanlu').avatar,contact:'hanlu'},
 yeshu:{name:'蒋小雪',room:'611',avatar:dayTwoPerson('yeshu').avatar,contact:'yeshu'}
});
Object.assign(FA_SCRIPTS,{
 d2zhou:[...d2say('zhoumo','怎么了？'),...d2say('me','我想问你一些关于江晓的事情'),...d2say('zhoumo','……','你问吧'),...d2say('me','她昨天晚上有跟你说过什么吗？'),...d2say('zhoumo','有','她跟我坦白了自己是档案员'),d2choice(['她为什么告诉你','d2zhouWhy'],['她有让你小心林晴吗','d2zhouLin'])],
 d2zhouWhy:[...d2say('zhoumo','我们关系一直很好','而且我也和她保证了我是普通生','她很信任我吧，哪怕是在这种环境下'),...d2say('me','那她还跟别人说过自己是档案员吗？'),...d2say('zhoumo','没有','但她昨晚说什么她有可能会出事，因为可能把一个学生会当普通生了','我没想到她真的……','对不起，我不想聊了'),...d2say('me','我知道了，谢谢你'),d2end('d2zhouWhy')],
 d2zhouLin:[...d2say('zhoumo','我昨晚和她说，我不知道投谁','她说她确定林晴是学生会','我昨晚就投了林晴','结果检举失败了','江晓说她也不知道怎么回事'),...d2say('me','我知道了，谢谢你'),d2end('d2zhouLin')],
 d2yelinZhou:[...d2say('yelin','就是不喜欢她这个人啊','一有点什么事，周围人就都得围着她转','我看多了就烦'),...d2say('me','所以你早上才那么说？'),...d2say('yelin','嗯，因为她说她不想一个人，现在谁不是一个人？'),...d2say('me','我不是……'),...d2say('yelin','……','算了','反正我当时就是特别来火，你懂吗？','但我也没真想让她出去送死'),d2end('d2yelin')],
 d2yelinJiang:[...d2say('yelin','她跟周茉关系好','所以我和她根本不熟，没了解过'),...d2say('me','有人和我说，江晓让别人小心你'),...d2say('yelin','？？？','神经病吧，我惹她了吗？','我一个普通生有什么好小心的？','不是，你确定她真这么说？'),...d2say('me','我也不确定，是别人和我说的'),...d2say('yelin','气死我了真的，她在想什么??','怀疑谁也不能怀疑我吧，我干啥了我'),d2end('d2yelinJiang')],
 d2linKnown:[d2end('d2lin')],d2linTrust:[d2end('d2linTrust')],
 d2publicZhou:[...d2say('me','我刚刚去问了周茉一些江晓的事','有些信息我觉得大家应该有知情权','江晓其实是档案员'),...d2say('hanlu','江晓是档案员？'),...d2say('shen','周茉，这件事你确定吗？'),...d2say('zhoumo','她昨天晚上亲口告诉我的','而且她一直认定林晴是学生会','我昨晚也因为相信她，检举了林晴','但是我检举失败了'),d2choice(['江晓找孟舒，是因为觉得孟舒是普通生吧','d2publicZhouReason','江晓找孟舒'])],
 d2publicZhouReason:[...d2say('me','是觉得@孟舒 你是普通生吧','她会不会是同时选了你和林晴，然后显示不同阵营','觉得你肯定是好人，就和你坦白了自己是档案员？','可你早上根本不敢说出来这些'),...d2say('meng','少在这里胡说八道了','周茉说失败就失败了吗？一张嘴谁不会乱说？','这些都只是你的猜测，而且极其荒谬'),...d2say('zhoumo','随你们信不信吧，我累了'),d2end('d2publicZhou')],
 d2publicYelinAfter:[...d2say('yelin','我还是那句话，我是普通生','她凭什么这么说？'),...d2say('meng','反正江晓就是这么跟我说的'),...d2say('yelin','现在人没了','当然你说什么就是什么'),...d2say('meng','那我还能怎么办','难道因为她现在不在了','我就不能说她跟我讲过什么吗'),...d2say('yeshu','主要是叶琳你早上……'),...d2say('yelin','我早上怎么了？','我讨厌周茉和我是学生会有什么关系？'),...d2say('yeshu','我也没说你是学生会啊'),...d2say('yelin','你少在这装'),d2end('d2publicYelin')],
 d2jiang:[...d2say('me','校园墙上说的你和戚悦那件事，是真的吗？'),...d2say('jiang','不完全是','我前任自己出轨，还骗戚悦自己是单身','戚悦也是被骗了'),...d2say('me','我明白了'),...d2say('jiang','怎么突然问我这个？'),d2choice(['没什么，就是突然好奇','d2jiangQuiet'],['孟舒和我说，昨天戚悦的死可能和你有关','d2jiangMeng'])],
 d2jiangQuiet:[...d2say('jiang','哦哦'),d2end('d2jiang')],
 d2jiangMeng:[...d2say('jiang','孟舒？','我根本不认识她，她为什么要这样说'),...d2say('me','她说她是档案员，你是学生会'),...d2say('jiang','她在胡扯什么。。','就算我真是学生会，我也不可能因为这种事公报私仇'),...d2say('me','嗯，我也是这么想的'),d2end('d2jiang')],
 d2aliveLin:[...d2say('me','你和江晓关系怎么样？'),...d2say('lin','江晓？','我不认识她','怎么突然问这个'),...d2say('me','哦哦，没什么'),d2end('d2aliveLin')],
 d2check:[...d2say('me','你有想好自己今天要查谁吗？'),...d2say('jiang','我真的可以相信你吗'),...d2say('me','你当然可以，我发誓','我如果是学生会，在你和我说小心林晴的时候','我就会意识到你是有身份和威胁的人了','你活不到今天的'),...d2say('jiang','那我就查你和孟舒','你等我一下'),{typing:'jiang',duration:4000},...d2say('jiang','看来，她就是学生会'),d2choice(['接下来你准备怎么做？','d2checkPlan'])],
 d2checkPlan:[...d2say('jiang','我会去群里质问她的'),...d2say('me','好，我支持你'),d2end('d2check')],
 d2publicJiang:[...d2say('jiang','@孟舒 你为什么要冒充档案员','还要私聊别人说我是学生会的人？','真正是学生会的人是你吧？'),...d2say('meng','什么意思？'),...d2say('jiang','我是档案员，还查出来你就是学生会的人了'),...d2say('meng','你是在搞笑吗，那你昨天下午为什么又说相信我是好人？'),...d2say('jiang','昨天查验返回的结果有问题'),...d2say('meng','我怎么不知道档案员的查验还会出错？'),...d2say('jiang','因为你不是档案员，所以你不知道'),{nextScript:'d2publicJiangChoice'}],
 d2publicHelp:[...d2say('me','孟舒昨天晚上找过我，问我江晓有没有说过什么','我说没说过什么，她就说自己是档案员，叫我别相信江晓','今天又突然私信我，把戚悦的请离说成是江晓在公报私仇','一切都太刻意了'),...d2say('jiang','那件事戚悦也是受害者，我怎么可能会怪她？','你说你自己是档案员，可你知道档案员是几点开始查验吗？'),...d2say('meng','我有义务告诉你吗？'),...d2say('jiang','你爱说不说','明眼人都看得出来'),d2end('d2publicHelp')],
 d2publicSilent:[...d2say('meng','你这是什么逻辑？','正因为我是档案员，我才知道根本不会出错','要是会出错，档案员的身份还有什么意义？','自己是档案员的谎言编不下去了，就再编一个查验会有问题的谎？'),...d2say('jiang','……'),d2end('d2publicSilent')]
});
function d2ConditionalScripts(){
 const choices=[['你和周茉是什么情况？','d2yelinZhou']];if(d2KnowsYelinWarning())choices.push(['你和江晓关系怎么样？','d2yelinJiang']);
 FA_SCRIPTS.d2yelin=[...d2say('yelin','有什么事吗？'),...d2say('me','想问你一点事'),...d2say('yelin','你问吧'),d2choice(...choices)];
 const trust=[['嗯，我知道了','d2linKnown'],['我相信你，一直都会的','d2linTrust']];
 FA_SCRIPTS.d2lin=[...d2say('me','江晓为什么会怀疑你'),...d2say('lin','我不知道，我不认识她','【玩家名字】，我不是学生会'),d2choice(...trust)];
 const extra=d2choice(['江晓还和周茉坦白了自己是档案员','d2publicYelinAfter'],['暂不补充','d2publicYelinAfter']);extra.choices[1].silent=true;
 FA_SCRIPTS.d2publicYelin=[...d2say('me','有件事，我觉得应该让大家知道','江晓有让孟舒小心叶琳'),...(d2Free().completed.includes('d2zhou')?[extra]:[{nextScript:'d2publicYelinAfter'}])];
 const support=d2choice(['帮助江晓，说昨晚和今早孟舒找自己的事','d2publicHelp'],['什么也不说','d2publicSilent']);support.choices.forEach(c=>c.silent=true);if(!d2Free().completed.includes('d2jiang'))support.choices.shift();FA_SCRIPTS.d2publicJiangChoice=[support];
}
