/* DAY02 daytime script supplied by the author. Existing phone UI and story state are reused. */
const DAY_TWO_AUTHORED={
 "intro": {
  "title": "江晓被请离后的群聊",
  "rows": [
   [
    "zhoumo",
    "为什么会这样"
   ],
   [
    "zhoumo",
    "你们为什么偏偏要带走江晓"
   ],
   [
    "zhoumo",
    "现在宿舍只剩我一个人了你们满意了吗"
   ],
   [
    "zhoumo",
    "我们还要在这个鬼地方待三天"
   ],
   [
    "zhoumo",
    "我怎么一个人待三天啊"
   ],
   [
    "zhoumo",
    "我不想一个人待着了……"
   ],
   [
    "zhoumo",
    "最好的朋友都不在了"
   ],
   [
    "zhoumo",
    "我活着还有什么意义"
   ],
   [
    "zhao",
    "我能理解你的感受",
    "zhaoAlive"
   ],
   [
    "zhao",
    "有什么事大家都会帮你的",
    "zhaoAlive"
   ],
   [
    "shen",
    "周茉，先冷静一点"
   ],
   [
    "shen",
    "她们只是消失了，未必是真的死了"
   ],
   [
    "zhoumo",
    "事到如今你们真的觉得只是消失吗"
   ],
   [
    "zhoumo",
    "别自欺欺人了"
   ],
   [
    "yelin",
    "差不多得了"
   ],
   [
    "yelin",
    "现在谁不是一个人待着"
   ],
   [
    "yelin",
    "赵诗雨室友没了也没像你这样吧",
    "zhaoAlive"
   ],
   [
    "yelin",
    "每次出点事所有人都要围着你转"
   ],
   [
    "yelin",
    "想死你就开门出去啊"
   ],
   [
    "yelin",
    "该不会开门出去也不会死吧"
   ],
   [
    "lin",
    "叶琳，别说了"
   ],
   [
    "yelin",
    "林晴，我说错了吗"
   ],
   [
    "lin",
    "……别拿这种话刺激人"
   ],
   [
    "yelin",
    "可以，你们都清高，是我咄咄逼人了"
   ]
  ],
  "choices": [
   {
    "label": "私聊孟舒，问她昨天为什么打听江晓",
    "next": "private"
   },
   {
    "label": "在群里公开质疑孟舒",
    "next": "public"
   },
   {
    "label": "暂时什么也不做",
    "next": "none"
   }
  ]
 },
 "private": {
  "title": "私聊质问孟舒",
  "chat": "meng",
  "rows": [
   [
    "me",
    "你昨天为什么要问我江晓的事"
   ],
   [
    "meng",
    "……你是在怀疑我吗"
   ],
   [
    "me",
    "你昨天晚上刚问完我"
   ],
   [
    "me",
    "今天她就消失了"
   ],
   [
    "meng",
    "我能理解你为什么会这么想"
   ],
   [
    "meng",
    "但这件事真的和我没关系"
   ],
   [
    "meng",
    "是江晓先来找我的"
   ],
   [
    "meng",
    "我怕她是学生会的人在骗我"
   ],
   [
    "meng",
    "就问她还找过谁"
   ],
   [
    "meng",
    "她跟我说了你"
   ],
   [
    "meng",
    "所以我才来找你确认"
   ]
  ],
  "choices": [
   {
    "label": "江晓都跟你说什么了？",
    "next": "privateWhy"
   },
   {
    "label": "你为什么会觉得她在骗你？",
    "next": "privateDoubt"
   }
  ]
 },
 "privateWhy": {
  "chat": "meng",
  "rows": [
   [
    "me",
    "江晓都跟你说什么了？"
   ],
   [
    "meng",
    "就是让我小心叶琳"
   ],
   [
    "me",
    "叶琳？"
   ],
   [
    "meng",
    "嗯"
   ],
   [
    "meng",
    "我问她为什么"
   ],
   [
    "meng",
    "她又不肯说"
   ],
   [
    "meng",
    "所以我当时就怕她是在骗我"
   ]
  ],
  "next": "privateDone"
 },
 "privateDoubt": {
  "chat": "meng",
  "rows": [
   [
    "me",
    "你为什么会觉得她在骗你？"
   ],
   [
    "meng",
    "因为她突然来找我，就让我小心林晴"
   ],
   [
    "meng",
    "可林晴怎么看都不像学生会的人"
   ],
   [
    "meng",
    "我问她为什么她又什么都不肯说"
   ],
   [
    "meng",
    "可如果她真的知道什么，为什么不直接说清楚"
   ],
   [
    "meng",
    "谁知道她到底是在提醒我们"
   ],
   [
    "meng",
    "还是故意让我们互相怀疑"
   ]
  ],
  "next": "privateDone"
 },
 "privateDone": {
  "chat": "meng",
  "rows": [
   [
    "me",
    "好的，我知道了"
   ]
  ],
  "end": "private"
 },
 "public": {
  "title": "公开质疑孟舒",
  "rows": [
   [
    "me",
    "@孟舒"
   ],
   [
    "me",
    "你昨天为什么突然来问我江晓的事"
   ],
   [
    "me",
    "紧接着今天她就消失了"
   ],
   [
    "meng",
    "……你什么意思？"
   ],
   [
    "me",
    "我只是觉得太巧了"
   ],
   [
    "meng",
    "江晓昨天来找我，我不完全信她说的话"
   ],
   [
    "meng",
    "我就问她你还和谁说过这些"
   ],
   [
    "meng",
    "她就说【玩家名字】"
   ],
   [
    "meng",
    "我怕她是学生会的人，在故意骗我让我怀疑别人"
   ],
   [
    "meng",
    "所以才找你确认"
   ]
  ],
  "choices": [
   {
    "label": "你是在确认她有没有骗你吗？",
    "next": "publicVerify"
   },
   {
    "label": "你就不怕我跟江晓是一伙的？",
    "next": "publicBet"
   }
  ]
 },
 "publicVerify": {
  "title": "追问孟舒的确认目的",
  "rows": [
   [
    "me",
    "你是在确认她有没有骗你吗？"
   ],
   [
    "meng",
    "不然呢？"
   ],
   [
    "me",
    "那江晓和你说了什么？"
   ],
   [
    "meng",
    "她说让我小心林晴"
   ],
   [
    "meng",
    "然后她又跟我说，她也找过你和你说过这个"
   ],
   [
    "meng",
    "所以我才来找你确认一下"
   ],
   [
    "me",
    "可我昨天只跟你说江晓提醒我小心一个人"
   ]
  ],
  "choices": [
   {
    "label": "你为什么不追问？",
    "next": "publicPress"
   },
   {
    "label": "我再问你一遍，你是真心来确认的吗？",
    "next": "publicAgain"
   }
  ]
 },
 "publicPress": {
  "rows": [
   [
    "me",
    "你为什么不追问？"
   ],
   [
    "me",
    "既然你是来确认的，肯定会追问的吧？"
   ]
  ],
  "next": "publicConfirm"
 },
 "publicAgain": {
  "rows": [
   [
    "me",
    "我再问你一遍，你是真心来确认的吗？"
   ],
   [
    "meng",
    "你什么意思？"
   ],
   [
    "me",
    "如果你真的有那么谨慎"
   ],
   [
    "me",
    "为什么在我回答你之后，却一点都不想追问？"
   ]
  ],
  "next": "publicConfirm"
 },
 "publicConfirm": {
  "title": "确认的内容与身份",
  "rows": [
   [
    "meng",
    "我当时只是想确认她到底有没有真的找过你"
   ],
   [
    "me",
    "你既不知道她跟我们说的是不是同一个人"
   ],
   [
    "me",
    "也不知道她到底有没有对我说别的"
   ],
   [
    "me",
    "所以从头到尾你只确认了江晓提醒过我"
   ],
   [
    "me",
    "我说得对吗"
   ],
   [
    "typing",
    "meng",
    3000
   ],
   [
    "supporter",
    "可是她只确认这个也没什么问题"
   ],
   [
    "supporter",
    "说明江晓至少这件事没骗她吧？"
   ]
  ],
  "choices": [
   {
    "label": "可孟舒说她怕的是江晓在“小心林晴”这件事上骗她",
    "next": "publicContent"
   },
   {
    "label": "所以江晓找没找过我，跟是不是学生会有什么关系？",
    "next": "publicIdentity"
   }
  ]
 },
 "publicContent": {
  "rows": [
   [
    "me",
    "可孟舒说她怕的是江晓在“小心林晴”这件事上骗她"
   ],
   [
    "me",
    "不是怕在“找过我”这件事上骗她"
   ]
  ],
  "next": "publicSupport"
 },
 "publicIdentity": {
  "rows": [
   [
    "me",
    "江晓有没有找过我"
   ],
   [
    "me",
    "跟她是不是学生会有什么关系？"
   ],
   [
    "me",
    "孟舒刚刚自己说"
   ],
   [
    "me",
    "她是因为怕江晓是学生会，才来找我确认"
   ],
   [
    "me",
    "可她确认的东西，从头到尾都验证不了江晓的身份"
   ]
  ],
  "next": "publicSupport"
 },
 "publicSupport": {
  "title": "回应替孟舒解释的人",
  "rows": [
   [
    "yeshu",
    "也许她就是不想问得太明显"
   ],
   [
    "yeshu",
    "毕竟现在谁的身份都不能确认"
   ],
   [
    "me",
    "我没说孟舒一定有问题"
   ],
   [
    "me",
    "只是觉得她的解释说不通"
   ]
  ],
  "choices": [
   {
    "label": "还有，你们这是在保孟舒吗？",
    "next": "publicTeam"
   },
   {
    "label": "但我也确实没证据",
    "next": "publicStrange"
   }
  ]
 },
 "publicTeam": {
  "rows": [
   [
    "me",
    "还有"
   ],
   [
    "me",
    "你们这是在站队孟舒吗"
   ],
   [
    "me",
    "一个接一个出来替她找理由"
   ]
  ],
  "end": "publicSuccess"
 },
 "publicStrange": {
  "rows": [
   ["me", "但我也确实没证据"],
   ["me", "你们自己判断吧"]
  ],
  "end": "publicSuccess"
 },
 "publicConclusion": {"rows": [], "end": "publicSuccess"},
 "publicBet": {
  "title": "孟舒的反问",
  "rows": [
   [
    "me",
    "你就不怕我跟江晓是一伙的？"
   ],
   [
    "meng",
    "怕啊"
   ],
   [
    "meng",
    "所以我昨天有跟你透露什么吗？"
   ],
   [
    "me",
    "……"
   ],
   [
    "meng",
    "而且如果你们真是一伙的"
   ],
   [
    "meng",
    "我什么信息都没给你"
   ],
   [
    "meng",
    "吃亏的人是我吗？"
   ],
   [
    "meng",
    "今天她刚消失"
   ],
   [
    "meng",
    "你就直接在群里来质问我"
   ],
   [
    "meng",
    "是不是想故意给我泼脏水"
   ],
   [
    "meng",
    "害得大家都失去一次正确的选举机会？"
   ]
  ],
  "choices": [
   {
    "label": "我只是觉得会不会太巧了呢？",
    "next": "publicCoincidence"
   },
   {
    "label": "你是在凭空给我编动机吗？",
    "next": "publicMotives"
   }
  ]
 },
 "publicCoincidence": {
  "rows": [
   [
    "me",
    "我只是觉得会不会太巧了呢？"
   ],
   [
    "me",
    "昨天你刚来问我，今天江晓就消失了"
   ],
   [
    "meng",
    "说不定你和你室友林晴都是学生会"
   ],
   [
    "meng",
    "在我私聊你之后"
   ],
   [
    "meng",
    "你觉得江晓不仅是档案员，还会散布消息"
   ],
   [
    "meng",
    "于是就把她刀了"
   ],
   [
    "meng",
    "是不是很有道理？"
   ],
   [
    "lin",
    "颠倒黑白也要有个限度"
   ],
   [
    "lin",
    "你说的是自己的心路历程吧？"
   ]
  ],
  "next": "publicCoincidenceEnd"
 },
 "publicMotives": {
  "rows": [
   [
    "me",
    "你是在凭空给我编动机吗？"
   ],
   [
    "meng",
    "什么意思？"
   ],
   [
    "me",
    "你现在说我在给你泼脏水"
   ],
   [
    "me",
    "说我想害大家"
   ],
   [
    "me",
    "哪一件是你真的知道的？"
   ],
   [
    "meng",
    "……"
   ]
  ],
  "next": "publicMotivesEnd"
 },
 "publicCoincidenceEnd": {
  "rows": [
   [
    "shen",
    "好了"
   ],
   [
    "shen",
    "现在你们都没有证据，继续吵没有意义"
   ]
  ],
  "end": "playerSuspicion"
 },
 "publicMotivesEnd": {
  "rows": [
   [
    "shen",
    "好了"
   ],
   [
    "shen",
    "现在你们都没有证据，继续吵没有意义"
   ]
  ],
  "end": "voteOutcome"
 },
 "none": {
  "rows": [],
  "end": "none"
 },
 "aliveMeng": {
  "title": "孟舒谈起戚悦",
  "chat": "meng",
  "rows": [
   [
    "meng",
    "看见了吗，戚悦昨天被请离了"
   ],
   [
    "me",
    "怎么了？"
   ],
   [
    "meng",
    "你不知道她和江晓以前那件事吗"
   ],
   [
    "meng",
    "就在墙上有人爆过"
   ],
   [
    "meng",
    "戚悦之前当过小三"
   ],
   [
    "meng",
    "正主就是江晓"
   ],
   [
    "meng",
    "当然了，我也不是说请离一定跟她有关"
   ],
   [
    "meng",
    "但八九不离十"
   ]
  ],
  "choices": [
   {
    "label": "我知道了",
    "next": "aliveKnow"
   },
   {
    "label": "我会自己想想的",
    "next": "aliveThink"
   }
  ]
 },
 "aliveKnow": {
  "chat": "meng",
  "rows": [
   [
    "me",
    "我知道了"
   ]
  ],
  "next": "aliveJiang"
 },
 "aliveThink": {
  "chat": "meng",
  "rows": [
   [
    "me",
    "我会自己想想的"
   ]
  ],
  "next": "aliveJiang"
 },
 "aliveJiang": {
  "title": "江晓说明档案员身份",
  "chat": "jiang",
  "rows": [
   [
    "jiang",
    "我昨晚投了林晴，失败了"
   ],
   [
    "jiang",
    "我已经错过一次了"
   ],
   [
    "jiang",
    "今天再投错是死，被学生会请离也是死"
   ],
   [
    "jiang",
    "所以我也不打算瞒你了"
   ],
   [
    "jiang",
    "其实我是档案员"
   ],
   [
    "me",
    "档案员？"
   ],
   [
    "jiang",
    "是的，档案员一次能查两个人"
   ],
   [
    "jiang",
    "黑头像只会告诉我她们是同阵营还是不同阵营"
   ],
   [
    "jiang",
    "发身份的时候能查一次，往后是每天下午两点"
   ],
   [
    "jiang",
    "第一次我查了苏沐和林晴，显示不同阵营"
   ],
   [
    "jiang",
    "苏沐后来因为违规被请离"
   ],
   [
    "jiang",
    "所以我一直以为林晴是学生会"
   ],
   [
    "jiang",
    "昨天下午两点我又查了林晴和孟舒，说是不同阵营"
   ],
   [
    "jiang",
    "但昨晚我检举林晴，却显示检举失败"
   ]
  ],
  "choices": [
   {
    "label": "你去找孟舒了吗？",
    "next": "aliveAsk"
   },
   {
    "label": "你让我怎么相信你？",
    "next": "aliveDoubt"
   }
  ]
 },
 "aliveAsk": {
  "chat": "jiang",
  "rows": [
   [
    "me",
    "你去找孟舒了吗？"
   ],
   [
    "jiang",
    "是的，我当时断定她就是普通生"
   ],
   [
    "jiang",
    "想拉拢她"
   ]
  ],
  "next": "aliveTrust"
 },
 "aliveDoubt": {
  "chat": "jiang",
  "rows": [
   [
    "me",
    "你让我怎么相信你？"
   ],
   [
    "jiang",
    "我知道这很奇怪，但我也不知道怎么回事"
   ]
  ],
  "next": "aliveTrust"
 },
 "aliveTrust": {
  "title": "江晓的信任",
  "chat": "jiang",
  "rows": [
   [
    "jiang",
    "不管怎么说，现在林晴的身份都很矛盾"
   ],
   [
    "jiang",
    "会干扰到档案员的判断"
   ],
   [
    "jiang",
    "但我现在和你说这些"
   ],
   [
    "jiang",
    "也是在赌你是好人"
   ]
  ],
  "choices": [
   {
    "label": "我是普通生，你可以相信我",
    "next": "aliveFinish"
   }
  ]
 },
 "aliveFinish": {
  "chat": "jiang",
  "rows": [
   [
    "me",
    "我是普通生，你可以相信我"
   ]
  ],
  "end": "aliveDone"
 }
};
