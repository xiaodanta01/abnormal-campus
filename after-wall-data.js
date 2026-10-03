/* Additional wall content, scoped to the end of day zero. */
window.AFTER_WALL={
  replyChoices:['好','嗯嗯，谢谢你提醒我'],
  posts:[
    {id:'panic-teachers',name:'一只栗',author:'student3',likes:27,body:'有人能联系上老师或者学校吗？\n辅导员不接电话 宿管也不见了 根本联系不上',comments:[['爱是一场小雨','我们导员电话直接关机了'],['冰美式','报警电话也是忙线']]},
    {id:'panic-door',name:'心似我冷冰冰',author:'student5',likes:43,body:'我室友就在B栋楼下，但是门禁刷不开。\n她的校园通突然显示已经离校。\n这种情况到底能不能给她开门？',comments:[['doki','我刚从窗户往下看了，楼下根本没人……',[['心似我冷冰冰','我靠你别吓我，她说自己就在楼下']]]]},
    {id:'core',title:'校园墙置顶的事情说的是真的',name:'肯德基蛋挞唯一真神',author:'student7',likes:10,body:'校园墙置顶的事情说的是真的\n\n刚刚我舍友回复了被请离的同学\n\n她直接在我面前凭空消失了\n\n我草救命啊，这到底是怎么一回事',comments:[['命运你阿帕次','什么？？？你认真的嘛',[['肯德基蛋挞唯一真神','编故事我活全家行吗？']]],['忧郁ID','什么叫凭空消失？就直接没了？',[['肯德基蛋挞唯一真神','她刚回复了一句“你在哪”\n下一秒人就没了 我真的要吓死了']]],['茉莉雨','回复文字也算回复互动吗？'],['momo','都别再联系显示已离校的人了，电话也别接']]},
    {id:'panic-home',name:'呆呆猫',author:'student1',likes:35,body:'今晚没回宿舍的人全部被注销了吗？\n我朋友只是回家住一天，现在连学籍都没了，何意味',comments:[['一只栗','我室友也是',[['呆呆猫','你联系得上她吗？'],['一只栗','联系不上，一直没回我信息']]],['心似我冷冰冰','有没有人在处理啊']]},
    {id:'doubt-db',name:'我的世界皓宸',author:'student0',likes:19,body:'都冷静点，明显就是校园通数据库出问题了。\n什么规则怪谈，别自己吓自己。',comments:[['忧郁ID','数据库出问题能同时注销门禁和学籍吗',[['我的世界皓宸','一个系统的数据本来就是互通的，有什么奇怪的']]]]},
    {id:'doubt-drill',name:'momo',author:'student5',likes:7,body:'有没有可能是学校在做什么大型应急演习？',comments:[['开水鉴心','什么演习能直接注销一千多个人的学籍'],['momo','系统显示而已，又不一定是真的退学']]}
  ],
  growing:[
    {at:30,comment:['爱是一场小雨','我刚给我朋友发过消息怎么办\n她也显示已离校，但是一直没回我']},
    {at:50,comment:['爱是一场小雨','我舍友刚刚也突然消失了 楼主说的是真的']},
    {at:75,comment:['我的世界皓宸','先发证据，只有文字谁都能编\n现在这种时候别制造恐慌',[['肯德基蛋挞唯一真神','嘉豪']]]},
    {at:95,comment:['忧郁ID','这帖点赞涨得好快\n刷新一次就多几百']},
    {at:130,comment:['doki','楼主你现在还在宿舍吗？',[['肯德基蛋挞唯一真神','在\n门锁了\n我现在动都不敢动']]]}
  ],
  aftermath:[
    {id:'capture',name:'命运你阿帕次',author:'student1',likes:38,capture:true,body:'这个账号是不是楼主说的那个舍友？',comments:[['爱是一场小雨','别回，先别回'],['忧郁ID','她的状态真的是已离校……']]},
    {id:'dont-reply',name:'moke_7ov',author:'student2',likes:64,body:'别回复她',comments:[['茉莉雨','现在连消息都不敢点开了'],['冰美式','有没有人知道该怎么办'],['momo','先待在宿舍里，别乱跑']]}
  ],
  recruitment:[
    {id:'girls1',name:'doki',author:'student3',title:'女生A栋临时互助群',likes:24,body:'女生A栋的可以进。\n先建个群统计每个宿舍现在有多少人。'},
    {id:'boys1',name:'绘梨衣',author:'student0',title:'男生A栋临时互助群',likes:18,body:'男生A栋互助群，进群需要验证宿舍信息。'},
    {id:'boys2',name:'看一千次海',author:'student2',title:'男生B栋临时互助群',likes:21,body:'男生B栋的进，先统计今晚没回来的人数。'},
    {id:'girls2',name:'肯德基蛋挞唯一真神',author:'shen',title:'女生B栋临时互助群',likes:46,body:'B栋还在宿舍的人先加群。\n大家有消息互相通知。',preview:'34名成员\n1名联系人已加入：林晴'}
  ]
};
