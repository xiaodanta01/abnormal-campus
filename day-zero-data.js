/* Dialogue is local configuration. {name} is resolved at delivery time. */
window.DAY_ZERO={
  node:'day0-supermarket',
  timing:{message:2000,longMessage:2000,notice:2000,photo:2000,scene:2000,queue:4000,reminder:2500,profile:6500,departure:9000,crossfade:1600},
  cg:{shelves:'assets/supermarket-shelves.jpg?v=20261011-rc5',queue:'assets/supermarket-queue.jpg?v=20261011-rc5'},
  linqingProfile:{name:'林晴',signature:'涙太轻 心太重',moments:[
    {id:'sleep-well-2045-08-28',date:'2045年8月28日 04:33',text:'今天可以好好睡一觉了。'},
    {id:'night-shift',date:'2045年8月23日 01:47',text:'下班下班\n今天的报损饭团归我咯',image:'assets/linqing-night-shift.jpg?v=20261011-rc5',imageAlt:'便利店闭店后的柜台，灯已经关了一半，旁边放着一个贴有“报损”标签的饭团。',replies:[{name:'周禾',text:'你怎么还在上夜班'},{name:'林晴',replyTo:'周禾',text:'白天有两节家教，只能晚上上班😭'},{name:'陈妍',text:'小姐姐你这样真的不会猝死吗'},{name:'林晴',replyTo:'陈妍',text:'我是铁人 放心吧'}]},
    {id:'rain',date:'2045年2月7日 02:14',text:'落在我脸上的到底是泪水还是雨滴。\n好咸。'},
    {id:'music',date:'2044年9月21日 17:42',text:'可是恨的人没死成，爱的人没可能。',music:{title:'爱人',artist:'莉莉周她说'}}
  ]},
  supplies:['矿泉水','泡面','面包','八宝粥','午餐罐头','士力架','可乐','常用药品'],
  choices:['好呀，刚好我也去买点东西','我等会没空诶TT你先去吧'],
  narration:['超市里的人异常的多，各个区域都挤满了人，尤其是泡面速食区域。','看来大家嘴上不太相信那个帖子，实际上还是担心这个新规是真的，买点东西总比到时候饿肚子好。'],
  notices:{minute:{title:'校园墙',text:'《即将实施四日特殊新规》将在一分钟后生效。',time:'20:59'},campus:{title:'校园通',text:'信息更新成功。',time:'21:00'},effective:{title:'校园墙',text:'【临时管理规则现已生效】',time:'21:00'},departure:{title:'校园墙',text:'【离校公示】\n1327位学生已完成离校手续。',time:'21:03'}},
  scripts:{
    invitation:[['20:45','chenyue','要不要一起去超市买点东西啊'],['20:45','chenyue','万一真要被封四天怎么办'],['20:45','linqing','现在去吗'],['20:46','chenyue','嗯嗯早点去，晚了怕人多'],['20:46','chenyue','{name}，你去不去呀？']],
    accept:[['20:47','me','好呀，刚好我也去买点东西'],['20:47','chenyue','走吧走吧'],['20:47','chenyue','林晴你要带什么吗'],['20:47','linqing','不用啦']],
    refuse:[['20:47','me','我等会没空诶TT你先去吧'],['20:47','chenyue','好嘟'],['20:47','linqing','路上小心，早点回来哦'],['20:48','system','陈妍离开了宿舍'],['20:59','chenyue','超市货架照片','photo'],['20:59','chenyue','超市好多人'],['20:59','chenyue','全在抢泡面，笑死'],['21:00','notice','effective'],['21:02','chenyue','？'],['21:02','chenyue','我学籍怎么被注销了'],['21:02','chenyue','我门禁卡怎么也失效了'],['21:02','linqing','什么情况？？'],['21:03','notice','departure'],['21:03','chenyue','什么离校？'],['21:03','chenyue','我就在楼下'],['21:03','chenyue','林晴？'],['21:03','chenyue','{name}，你帮我开一下门']],
    warning:[['21:03','linqing','你先别回复她'],['21:03','linqing','我记得校园墙第四条规则说'],['21:03','linqing','若校园墙宣布某人“已经离校”，不要回复其任何互动'],['21:03','linqing','虽然不知道这东西是不是真的'],['21:03','linqing','但陈妍这个状态就像是违反了规定才这样的……']]
  }
};
