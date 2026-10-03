/* Apply authored continuity changes to old messages, rules and reached checkpoints. */
// Migrate authored display text without rewriting player notes, answers or choices.
function migrateLockdownDuration(progress){
 if(!progress?.story)return;
 const replacements=[
  ['封五天','封四天'],['封七天','封四天'],['封闭五日','封闭四日'],['封闭七日','封闭四日'],['为期五日','为期四日'],
  ['8. 第五日结束时','8. 第四日晚上为最后一次检举。第四日结束时'],['第五日结束时','第四日结束时'],['第五天只有一个阵营','第四天只有一个阵营'],
  ['我们还要在这个鬼地方待四天','我们还要在这个鬼地方待三天'],['我怎么一个人待四天啊','我怎么一个人待三天啊'],
  ['是否愿意继续配合剩余四日的封校观察？','是否愿意继续配合剩余三日的新规观察？'],
  ['接下来的两天，我真的能心安理得地度过吗？','剩下的时间，我真的能心安理得地度过吗？'],
  ['封校期间临时管理规则','即将实施四日特殊新规'],
  ['本校将封闭四日。封闭期间，任何学生不得离开宿舍楼。','新规实施期间，任何学生不得离开宿舍楼。'],
  ['封闭期间','新规实施期间'],['封校规则','校园新规'],
  ['因空气质量急剧恶化，学校将进行为期四日的封校计划','因空气质量急剧恶化，学校将进行为期四日的新规计划'],
  ['异常封校','异常校园'],['封校的规则','校园新规'],
  ['封校剩余','新规实施剩余'],['封校最后一日','新规实施最后一日'],['封校第','新规实施第'],
  ['从封校到现在','从新规实施到现在'],['万一真的封校','万一新规真的实施'],
  ['封校观察','新规观察'],['封校通知','校园通知'],['封校期间','新规实施期间']
 ];
 const update=text=>typeof text==='string'?replacements.reduce((value,[old,next])=>value.replaceAll(old,next),text):text;
 for(const rows of Object.values(progress.messages||{}))for(const message of rows){if(message.sender!=='me')message.text=update(message.text)}
 for(const contact of progress.contacts||[]){const last=progress.messages?.[contact.id]?.at(-1);if(last?.sender!=='me')contact.preview=update(contact.preview)}
 function updatePost(post){if(!post)return;for(const key of ['category','tag'])if(typeof post[key]==='string')post[key]=update(post[key]);if(post.author==='me')return;for(const key of ['body','text','title'])if(typeof post[key]==='string')post[key]=update(post[key]);for(const reply of post.replies||[])updatePost(reply)}
 for(const post of progress.forumPosts||[])updatePost(post);
 for(const clues of [progress.story.freeAction?.clues,progress.story.dayTwoFreeAction?.clues,progress.story.notebookClues])for(const clue of clues||[])for(const key of ['title','text','source'])if(typeof clue[key]==='string')clue[key]=update(clue[key]);
}
const CONTINUITY_TEXT_UPDATES={"CXin0726":"celine07","cxin0726":"celine07","我在你朋友圈里见过那件外套":"我在你朋友圈好像也见过黄色外套","我当时刚打开门，手机就收到群消息了，所以没出去。":"八点半左右，我刚打开门，就看见沈可欣在群里提醒不能出门，所以停在了门口。","不过我看见一个穿黄色外套的人，已经往取货平台那边走了。":"不过我隔着玻璃看见一个穿黄色外套的人，从平台的取件柜里拿出了包裹。","我开门的时候，看见一个穿黄色外套的人往平台走。":"八点半左右，我开门的时候，看见一个穿黄色外套的人从平台的取件柜里拿出了包裹。","我开门的时候，那个人已经快走到玻璃门了。":"我开门的时候，那个人已经在玻璃门外的平台上，背对着我站在取件柜前。","温宁看见一个穿黄色外套的人走向取货平台，但没有看见正脸。她公开质疑赵诗雨后，大部分成员开始怀疑赵诗雨故意组织其他人离开宿舍。":"温宁声称八点半左右看见一个穿黄色外套的人从平台取件柜里拿出包裹，但没有看见正脸。她公开质疑赵诗雨后，大部分成员开始怀疑赵诗雨故意组织其他人离开宿舍。","温宁看见一个穿黄色外套的人走向取货平台。她认为可能是赵诗雨，但没有看见正脸，也未在群内公开指控。":"温宁声称八点半左右看见一个穿黄色外套的人从平台取件柜里拿出包裹。她私下认为可能是赵诗雨，但没有看见正脸，也未在群内公开指控。","女生B栋七楼通过走廊尽头的玻璃门与取货平台相连。温宁看见一个人向平台方向走去，但无法确认身份。":"女生B栋七楼通过走廊尽头的玻璃门与取货平台相连。温宁声称八点半左右隔着玻璃看见一个穿黄色外套的人从取件柜里拿出包裹，但无法确认身份。"};
Object.assign(CONTINUITY_TEXT_UPDATES,{"好，那我在5楼楼梯口等你们":"好，那我在7楼楼梯口等你们","我学着不去担心的太远":"我学着不再为太遥远的事担心","今天可以好好的睡一觉了。":"今天可以好好睡一觉了。","大家虽然都不太相信那个帖子，但还是有很多人想以防万一。":"大家虽然不太相信那个帖子，还是忍不住多买了些吃的。万一新规真的实施，总不能到时候连吃的都没有。","我舍友也人突然没了 她说的是真的":"我舍友刚刚也突然消失了 楼主说的是真的","八分钟不够其他楼层上来取件吗？":"配送从七点半开始，到七点三十八有八分钟。你怎么排除其他楼层的人在这段时间上去取件？"});
function migrateStoryContinuity(progress){if(!progress?.story)return;migrateLockdownDuration(progress);function strings(value){if(!value||typeof value!=='object')return;for(const key of Object.keys(value)){const text=value[key];if(typeof text==='string'){let updated=(CONTINUITY_TEXT_UPDATES[text]||text).replaceAll('每晚22:00至次日06:00','每晚22:00至次日16:00');if(value!==progress.profile&&value.author!=='me'&&value.sender!=='me'&&!/draft|note/i.test(key))updated=updated.replace(/叶舒|郑宁|许棠/g,name=>({'叶舒':'蒋小雪','郑宁':'许蓁蓁','许棠':'李恬'}[name]));value[key]=updated}else strings(text)}}strings(progress);
 function removeRetiredComment(value){if(!value||typeof value!=='object')return;for(const [key,items] of Object.entries(value)){if(Array.isArray(items)){value[key]=items.filter(item=>!(item&&typeof item==='object'&&((item.id==='c3'&&String(item.text||'').includes('三千字检讨'))||item.text==='“被带离”是被带去写三千字检讨吗')));for(const item of value[key])removeRetiredComment(item)}else removeRetiredComment(items)}}removeRetiredComment(progress);
 if(progress.game){progress.game.freeActionTruth??={};progress.game.freeActionTruth.facts??={};progress.game.freeActionTruth.facts.lin??={};progress.game.freeActionTruth.facts.lin.countedInCampusPopulation=false;}

 const fresh=progress.story.continuityVersion!==1;
 for(const rows of Object.values(progress.messages||{})){for(let i=rows.length-1;i>=0;i--){const m=rows[i],match=String(m.id||'').match(/^pickup-public-ask-(\d+)$/);if(fresh&&match){const n=Number(match[1]);if(n===4||n===5){rows.splice(i,1);continue}if(n>5)m.id='pickup-public-ask-'+(n-2)}const record=String(m.id||'').match(/^pickup-public-([a-zA-Z]+)-(\d+)$/);if(record){const script=record[1],index=Number(record[2]),row=RECORD_SCRIPTS[script]?.[index];if(row?.who)m.text=recordDialogueText(row,script,index,progress)}}}
 const r=progress.story.pickupRecordDiscussion;if(fresh&&r?.script==='ask')r.index=r.index>=6?r.index-2:Math.min(r.index,4);
 for(const clue of progress.story.freeAction?.clues||[]){if(['wenPublic','wenQuiet','wenFloor'].includes(clue.result))clue.text=FA_RESULTS[clue.result].text;if(clue.id==='wen-pickup-conflict')clue.text=recordConflictNote(progress)}
 for(const contact of progress.contacts||[]){const last=progress.messages?.[contact.id]?.at(-1);if(last?.id?.startsWith('pickup-public-'))contact.preview=last.text}
 progress.story.continuityVersion=1;
}
Object.assign(CONTINUITY_TEXT_UPDATES,{"墙哥":"墙墙","墙哥被盗号了？":"墙墙被盗号了？"});
migrateStoryContinuity(state);{const records=nodeRecords();for(const record of Object.values(records))migrateStoryContinuity(record.checkpoint);saveNodes(records)}
try{const saved=JSON.parse(GameStorage.getItem(GAME_CONTINUE_KEY)||'null');if(saved){migrateStoryContinuity(saved);GameStorage.setItem(GAME_CONTINUE_KEY,JSON.stringify(saved))}}catch{}
persist();if(view==='chat')openChat(active);else if(view==='post')postDetail(active);else if(view==='notes')faNotes();else if(view==='noodle-cg')noodleRender(false);
