/* Authored free-action content. Hidden facts are never rendered as dialogue. */
const FA_FACTIONS=Object.freeze({gunian:'学生会',heyu:'学生会',cheng:'学生会',lin:'无身份',wen:'学生会',shen:'学生会',zhao:'普通生',jiang:'普通生',zhoumo:'普通生'});
const FA_PEOPLE={cheng:{name:'程昕',room:'602',avatar:'npc-chengxin',contact:'chengxin'},lin:{name:'林晴',room:'408',avatar:'linqing',contact:'linqing'},wen:{name:'温宁',room:'701',avatar:'npc-wenning',contact:'wenning'},shen:{name:'沈可欣',room:'512',avatar:'shen',contact:'shen-friend'},zhao:{name:'赵诗雨',room:'214',avatar:'npc-zhaoshiyu',contact:'zhaoshiyu'},jiang:{name:'江晓',room:'316',avatar:'npc-jiangxiao',contact:JX.id},jiangning:{name:'江柠',room:'410',avatar:'chat_jiangning'}};
const FA_HIDDEN={cheng:{actualRoom:'318',displayRoom:'602',former602LeftOnDayZero:true},jiang:{room:'316',roommate:'周茉',reasonForRecall:'担心被学生会清理'},wen:{intent:'利用模糊目击引导普通生检举赵诗雨'},lin:{countedInCampusPopulation:false,left408:true,intent:'验证自己是否不受校园新规影响',pastThought:'曾认为无法继续坚持时可以主动违规被请离',result:'发现自己无法通过违规被请离后更加崩溃'}};
const FA_ROSTER='当前成员：31人\n以下宿舍号为成员自行填写，不代表系统认证。\n\n1楼：夏宁101、余薇106、叶琳108、宋佳112、林夏116\n2楼：乔安205、陆遥207、宁可211、赵诗雨214、方恬219、白栀223\n3楼：顾念303、何雨305、孟舒312、江晓316、周茉316\n4楼：李恬401、宋妍405、【玩家名字】408、林晴408、江柠410\n5楼：韩露506、戚悦508、沈可欣512、许蓁蓁517、何安519\n6楼：程昕602、梁音603、顾遥606、蒋小雪611\n7楼：温宁701';
const FA_RESULTS={
 cheng:{title:'318与602',text:'“也许想法天真”确定是程昕。她曾公开表示自己住318，现在却使用602作为群备注。她解释称自己调换过宿舍。',trust:10,suspect:'cheng',suspicion:50,tag:'群体高度怀疑'},
 door:{title:'深夜门锁记录',text:'第一日凌晨，408宿舍门曾开启五分钟。当时宿舍里除了你，只剩林晴。',tag:'凌晨门锁异常',suspect:'lin'},
 author:{title:'无法追踪的发布者',text:'这个账号没有学生资料，似乎由拥有最高权限的存在直接控制。'},
 wenPublic:{title:'穿着黄色外套的女孩',text:'温宁声称八点半左右看见一个穿黄色外套的人从平台取件柜里拿出包裹，但没有看见正脸。她公开质疑赵诗雨后，大部分成员开始怀疑赵诗雨故意组织其他人离开宿舍。',suspect:'zhao',suspicion:70,tag:'群体高度怀疑'},
 wenQuiet:{title:'黄色外套',text:'温宁声称八点半左右看见一个穿黄色外套的人从平台取件柜里拿出包裹。她私下认为可能是赵诗雨，但没有看见正脸，也未在群内公开指控。',trust:5},
 wenFloor:{title:'七楼取货通道',text:'女生B栋七楼通过走廊尽头的玻璃门与取货平台相连。温宁声称八点半左右隔着玻璃看见一个穿黄色外套的人从取件柜里拿出包裹，但无法确认身份。',trust:5},
 zhaoStory:{title:'赵诗雨的证词',text:'赵诗雨声称自己当时仍躺在214；苏沐已经洗漱完毕，并在打开宿舍门后消失。',trust:5},
 zhaoDeny:{title:'赵诗雨的反驳',text:'赵诗雨否认自己离开过214，但没有详细说明苏沐消失时的经过。',trust:-5},
 members:{title:'女生B栋成员楼层',text:'玩家根据群成员自行填写的宿舍号，整理了目前31名成员所在的楼层。宿舍号不代表系统认证。'},
 linPress:{title:'被回避的五分钟',text:'林晴承认自己在01:17打开宿舍门，却否认离开408。当你追问原因时，她没有详细解释。',lin:-5},
 linKind:{title:'林晴的解释',text:'林晴承认凌晨打开过宿舍门，但解释得有些含糊。',lin:5}
};
const faSay=(who,text)=>({who,text});
const faChoice=(...options)=>({choices:options.map(([label,next,text])=>({label,next,text:text||label}))});
const faEnd=result=>({end:result});
const FA_SCRIPTS={
 cheng:[faChoice(['也许想法天真是你吧？ @程昕（602）','chengEvidence'])],
 chengEvidence:[{who:'me',type:'forum-shot',text:'p1',src:'assets/p1-room318.jpg?v=20261011-rc5'},{nextScript:'chengAsk'}],
 chengAsk:[faChoice(['你以前说自己住318，为什么现在备注是602？','chengReply'])],
 chengReply:[faSay('cheng','是我，怎么了？'),faSay('cheng','我开学以后调过宿舍，有些资料没同步而已。'),faSay('shen','你现在确实住602吗？'),faSay('cheng','我有必要把调宿舍记录也发给你们看吗？'),faSay('cheng','现在连搬过宿舍都要被审问？'),{who:'jiang',text:'我明明',recall:true},faSay('system','其他成员开始怀疑程昕。'),faEnd('cheng')],
 wen:[faSay('wen','有什么事吗？'),faChoice(['你早上换好衣服以后，没有出门吗？','wenAnswer'])],
 wenAnswer:[faSay('wen','八点半左右，我刚打开门，就看见沈可欣在群里提醒不能出门，所以停在了门口。'),faSay('wen','不过我隔着玻璃看见一个穿黄色外套的人，从平台的取件柜里拿出了包裹。'),faChoice(['黄色外套？','wenCoat'],['你们七楼是连着取货平台的？','wenFloor','你们七楼是连着取货平台的吗？'])],
 wenCoat:[faSay('wen','对，黄色外套。'),faSay('wen','但是只看见了背影。'),faSay('wen','诶，我好像在赵诗雨朋友圈里见过她穿，当时就以为是她。'),faChoice(['有没有可能就是她？','wenSuspect'],['好的，我知道了','wenQuiet','好的，我知道了。'])],
 wenSuspect:[faSay('wen','有这种可能。'),faSay('wen','学生会的人不受校园新规约束。'),faSay('wen','如果她真是学生会，就算离开宿舍也不会被请离。'),faChoice(['你的意思是，她可能是故意骗那些忘记规则的人出门？','wenPublicLead'])],
 wenPublicLead:[faSay('wen','我不敢确定……'),faSay('wen','但你提醒我了，我觉得至少应该让大家知道这些。'),{group:'wenPublic'}],
wenPublic:[faSay('wen','赵诗雨，早上往取货平台走的人是不是你？'),faSay('zhao','什么东西？'),faSay('wen','八点半左右，我开门的时候，看见一个穿黄色外套的人从平台的取件柜里拿出了包裹。'),faSay('wen','我在你朋友圈好像也见过黄色外套。'),faSay('zhao','我要是出去了，现在还能在这和你说话？'),faSay('wen','可是早上是你提出一起取快递的。'),faSay('wen','最后其他人被请离了，你却还在。'),faSay('zhao','我有拖延症…'),faSay('zhao','我发消息的时候还在床上，根本没准备好出门。'),faSay('zhao','你现在是觉得我故意害她们？'),faSay('jiangning','这确实有点奇怪吧。'),faSay('shen','现在还不能确定那就是赵诗雨。'),faSay('wen','她今天害死两个人，你还帮她说话？'),faSay('zhao','我知道我罪该万死，能不能别说了。'),faSay('zhao','我也很自责，对不起。'),faSay('system','有人认为赵诗雨非常可疑。'),faSay('system','有人认为仅凭黄色外套不能定罪。'),faSay('system','有人怀疑赵诗雨故意利用朋友的信任。'),faEnd('wenPublic')],
 wenQuiet:[faSay('wen','嗯。'),faEnd('wenQuiet')],
 wenFloor:[faSay('wen','是的。'),faSay('wen','七楼走廊尽头有一扇玻璃门，打开以后就能直接去取货平台。'),faSay('wen','我开门的时候，那个人已经在玻璃门外的平台上，背对着我站在取件柜前。'),faChoice(['所以你只看见了背影？','wenBack'])],
 wenBack:[faSay('wen','对，我没看清脸。'),faEnd('wenFloor')],
 zhao:[faSay('zhao','有什么事吗？'),faChoice(['早上到底发生了什么？','zhaoStory'],['你早上没去取快递吗？','zhaoDeny'])],
 zhaoStory:[faSay('zhao','我在群里提议去取快递的时候，其实还躺在床上。'),faSay('zhao','苏沐已经洗漱好了'),faSay('zhao','她当时一边开门一边催我'),faSay('zhao','让我快点起来'),faSay('zhao','开门的时候她还好好的，然后突然就不见了。'),faSay('zhao','我刚好在群里看见沈可欣的消息，才想起来规则。'),faSay('zhao','我真的好后悔……'),faSay('zhao','我现在脑子特别乱'),faChoice(['我知道了，你先冷静一下。','zhaoEnd'])],
 zhaoEnd:[faEnd('zhaoStory')],zhaoDeny:[faSay('zhao','你疯了吗？'),faSay('zhao','我要是真的出去了，我现在还会在这里？'),faEnd('zhaoDeny')],
 lin:[faChoice(['昨晚一点多，你开过门吗？','linTyping'])],
 linTyping:[{typing:'lin',duration:3000},faSay('lin','开过。'),faSay('lin','我听见走廊里有声音，就起来看了一眼。'),faChoice(['门开了整整五分钟','linPress','晴，门开了整整五分钟。'],['你在外面看见什么了？','linKind'])],
 linPress:[faChoice(['你为什么开那么久？你是出门了吗？','linSorry'])],
 linSorry:[faSay('lin','对不起。'),faSay('lin','我当时有些情绪低落，在想一些事情。'),faEnd('linPress')],
 linKind:[faSay('lin','没看见什么。'),faSay('lin','我当时在发呆，想一些事情。'),faChoice(['你是不是有什么心事？可以和我说。','linTrust'])],
 linTrust:[faSay('lin','真的可以和你说吗？'),faSay('lin','哪怕是负面的。'),faSay('lin','我不想把这些不好的东西传递给别人。'),faChoice(['当然了。','linEnd'])],linEnd:[faEnd('linKind')]
};
const FA_ZHAO_MOMENTS=[{date:'2045年9月4日 18:32',text:'亚米亚米 好吃',image:'assets/zhao-yellow-photo.jpg?v=20261011-rc5',imageAlt:'赵诗雨穿着黄色外套和日料合影',replies:[]},{date:'2045年9月2日 21:06',text:'于我而言 她很可爱',image:'assets/zhao-sumu-photo.jpg?v=20261011-rc5',imageAlt:'赵诗雨与苏沐的亲密合照',replies:[{name:'苏沐',text:'嘿嘿'},{name:'赵诗雨',replyTo:'苏沐',text:'别忘了给我拿外卖'}]}];

const FA_WEN_PROFILE={signature:'我学着不再为太遥远的事担心',moments:[{date:'2045年6月29日 09:11',text:'放暑假一大早就来拼豆 噢耶',image:'assets/wenning-beads.jpg?v=20261011-rc5',imageAlt:'拼豆材料陈列架',replies:[]}]};

// Migrate only this split dialogue, preserving the active branch and existing progress.
function migrateZhaoSplit(progress){
 if(!progress?.story||progress.story.zhaoSplitVersion===1)return;
 progress.story.zhaoSplitVersion=1;
 const remap=[0,1,4,5,6,8];
 for(const [chat,rows] of Object.entries(progress.messages||{})){
  progress.messages[chat]=rows.flatMap(m=>{
   const match=String(m.id||'').match(/^fa-zhao-zhaoStory-(\d+)(-time)?$/);
   if(match){const oldIndex=Number(match[1]);m.id='fa-zhao-zhaoStory-'+(remap[oldIndex]??oldIndex)+(match[2]||'');if(!match[2]&&(oldIndex===1||oldIndex===4)){
    const texts=oldIndex===1?['苏沐已经洗漱好了','她当时一边开门一边催我','让我快点起来']:['我真的好后悔……','我现在脑子特别乱'];
    return texts.map((text,i)=>({...m,id:'fa-zhao-zhaoStory-'+(remap[oldIndex]+i),text}));
   }}
   if(m.id==='fa-choice-zhao:zhaoStory:5')m.id='fa-choice-zhao:zhaoStory:8';
   return [m];
  });
 }
 const f=progress.story.freeAction,r=f?.run;if(r?.script==='zhaoStory')r.index=remap[r.index]??r.index;
 if(f?.decisions&&f.decisions['zhao:zhaoStory:5']!==undefined){f.decisions['zhao:zhaoStory:8']=f.decisions['zhao:zhaoStory:5'];delete f.decisions['zhao:zhaoStory:5']}
 for(const c of progress.contacts||[])if(c.id==='zhaoshiyu'){
  const last=progress.messages?.[c.id]?.findLast(m=>m.type!=='time');if(last&&/苏沐已经洗漱好了|我真的好后悔/.test(c.preview||''))c.preview=last.text;
 }
}
migrateZhaoSplit(state);
{const records=nodeRecords();for(const record of Object.values(records))migrateZhaoSplit(record.checkpoint);saveNodes(records)}
