/* One graph definition for the playable map and the read-only author preview. */
const DAY_TWO_NODE_TITLES={
 intro:'江晓被请离后的群聊',private:'私聊质问孟舒',privateWhy:'江晓提到了叶琳',privateDoubt:'孟舒为什么怀疑江晓',privateDone:'结束私聊',
 public:'在群里公开质疑孟舒',publicVerify:'追问确认的目的',publicPress:'为什么没有追问',publicAgain:'你是真心来确认的吗',publicConfirm:'她只确认了江晓找过你',publicContent:'内容与身份的矛盾',publicIdentity:'找过我能证明什么',publicSupport:'有人替孟舒解释',publicTeam:'你们在站队孟舒吗',publicStrange:'但我也确实没证据',publicBet:'回应孟舒的反问',publicCoincidence:'昨天打听，今天消失',publicMotives:'凭空编造的动机',publicCoincidenceEnd:'沈可欣结束争论',publicMotivesEnd:'质问后的沉默',none:'暂时什么也不做',
 aliveMeng:'戚悦被请离，孟舒私聊',aliveKnow:'我知道了',aliveThink:'我会自己想想的',aliveJiang:'江晓说明档案员身份',aliveAsk:'你去找孟舒了吗',aliveDoubt:'你让我怎么相信你',aliveTrust:'江晓把信任交给你',aliveFinish:'我是普通生，你可以相信我'
};
function makeDayTwoWorldline(){
 const g={nodes:[],edges:[],sections:[],height:1860,width:0,focusY:1235,independentMerges:true},step=292;
 const node=(id,title,col,y,extra={})=>{g.nodes.push({id,title,x:72+col*step,y,kind:'story',record:id,...extra});return id};
 const edge=(from,to)=>g.edges.push({from,to});
 const bubble=(id,title,col,y,owner)=>node(id,title,col,y,{kind:'bubble',record:owner});
 const story=(key,col,y)=>node('day2-script-'+key,DAY_TWO_NODE_TITLES[key],col,y,{script:key});
 const sid=key=>'day2-script-'+key;
 const placements={intro:[0,780],private:[2,260],privateWhy:[4,190],privateDoubt:[4,330],privateDone:[6,260],public:[2,780],publicVerify:[4,640],publicPress:[6,540],publicAgain:[6,740],publicConfirm:[8,640],publicContent:[10,540],publicIdentity:[10,740],publicSupport:[12,640],publicTeam:[14,540],publicStrange:[14,740],publicBet:[4,1110],publicCoincidence:[6,1020],publicMotives:[6,1270],publicCoincidenceEnd:[8,1020],publicMotivesEnd:[8,1270],none:[2,1460],aliveMeng:[0,1690],aliveKnow:[2,1600],aliveThink:[2,1780],aliveJiang:[4,1690],aliveAsk:[6,1600],aliveDoubt:[6,1780],aliveTrust:[8,1690],aliveFinish:[10,1690]};
 for(const [key,[col,y]] of Object.entries(placements))story(key,col,y);
 for(const [key,[col,y]] of Object.entries(placements)){
  const script=DAY_TWO_AUTHORED[key];
  if(script.choices)script.choices.forEach((choice,i)=>{const target=placements[choice.next],id=sid(key)+'-option-'+i;bubble(id,choice.label,col+1,target[1],sid(key));edge(sid(key),id);edge(id,sid(choice.next))});
  else if(script.next)edge(sid(key),sid(script.next));
 }
 // This choice schedules the later council clearance; it is not the Meng Shu vote outcome.
 node('death-007','结局007 · 学生会清理',16,360,{kind:'death',record:null});
 edge(sid('publicSupport')+'-option-0','death-007');
 node('tree-day2-debate-end','质问结束',18,780,{checkpoint:'debateDone'});
 for(const key of ['publicTeam','publicStrange'])edge(sid(key),'tree-day2-debate-end');
 bubble('d2-shared-noodles','曾把泡面分给林晴',19,650,'tree-day2-debate-end');bubble('d2-no-shared-noodles','没有分享泡面',19,1150,'tree-day2-debate-end');
 edge('tree-day2-debate-end','d2-shared-noodles');edge('tree-day2-debate-end','d2-no-shared-noodles');
 const lin=[['linAfterIntro','林晴问起江晓',20,650],['linAfterWhen','为什么把泡面分给我',22,650],['linAfterTrust','因为你不会害我',24,440],['linAfterTaste','你对谁都这么好吗',24,800],['linAfterWhat','当我什么都没说',26,730],['linAfterSnack','你也给过我士力架',26,940]];
 const lid=key=>'tree-day2-'+key;
 for(const [key,title,col,y] of lin)node(lid(key),title,col,y,{linScript:key});
 edge('d2-shared-noodles',lid('linAfterIntro'));
 const linChoice=(key,i,text,col,y,next)=>{const id=lid(key)+'-option-'+i;bubble(id,text,col,y,lid(key));edge(lid(key),id);edge(id,lid(next))};
 linChoice('linAfterIntro',0,'昨天上午',21,650,'linAfterWhen');linChoice('linAfterWhen',0,'因为我不觉得你会害我',23,440,'linAfterTrust');linChoice('linAfterWhen',1,'就是想给你也尝尝',23,800,'linAfterTaste');linChoice('linAfterTaste',0,'什么？',25,730,'linAfterWhat');linChoice('linAfterTaste',1,'你都给我士力架了',25,940,'linAfterSnack');
 node('tree-day2-morning-end','09:51 · 早晨对话结束',28,1150,{checkpoint:'morningDone'});
 for(const from of [sid('privateDone'),sid('publicCoincidenceEnd'),sid('publicMotivesEnd'),sid('none'),sid('aliveFinish'),'d2-no-shared-noodles',lid('linAfterTrust'),lid('linAfterWhat'),lid('linAfterSnack')])edge(from,'tree-day2-morning-end');
 const pickup=(id,title,col,y,phase)=>node(id,title,col,y,{pickupPhase:phase});
 pickup('tree-day2-pickup-rules','不要独自进入电梯',29.3,1150,'d2-rule');pickup('day2-pickup-companion','取件选择',30.6,1150,'d2-choice');
 edge('tree-day2-morning-end','tree-day2-pickup-rules');edge('tree-day2-pickup-rules','day2-pickup-companion');
 pickup('tree-day2-invite','邀请林晴同行',32.6,650,'d2-invite');pickup('day2-pickup-linqing-reply','你不怕我是学生会吗',34,650,'d2-reply');
 pickup('day2-pickup-solo-reply','林晴发来私聊',32.6,1250,'d2-solo-chat');
 for(const [i,text,y,to] of [[0,'邀请林晴',650,'tree-day2-invite'],[1,'自己去',1250,'day2-pickup-solo-reply']]){const id='d2-pickup-option-'+i;bubble(id,text,31.6,y,'day2-pickup-companion');edge('day2-pickup-companion',id);edge(id,to)}
 edge('tree-day2-invite','day2-pickup-linqing-reply');
 const replies=[['我不怕，大不了重开','林晴提醒你珍惜生命','d2-reply-0',430],['我相信你是好人','我也相信你','d2-reply-1',650],['其实我昨天检举过你','林晴识破你的玩笑','d2-reply-2',870]];
 replies.forEach(([text,title,phase,y],i)=>{const id='tree-day2-'+phase;pickup(id,title,36,y,phase);bubble('day2-pickup-linqing-reply-option-'+i,text,35,y,'day2-pickup-linqing-reply');edge('day2-pickup-linqing-reply','day2-pickup-linqing-reply-option-'+i);edge('day2-pickup-linqing-reply-option-'+i,id)});
 pickup('tree-day2-reassure','下次不会了',38,430,'d2-reassure-answer');bubble('d2-reassure','好啦好啦，下次不会了',37,430,'tree-day2-d2-reply-0');edge('tree-day2-d2-reply-0','d2-reassure');edge('d2-reassure','tree-day2-reassure');
 pickup('tree-day2-lin-arrives','林晴追了上来',34.6,1150,'d2-solo-yes');pickup('tree-day2-lin-company','我陪你去',36.6,1150,'d2-solo-answer');
 bubble('d2-honest','是的',33.6,1150,'day2-pickup-solo-reply');bubble('d2-lie','我和其他人约好了',33.6,1420,'day2-pickup-solo-reply');edge('day2-pickup-solo-reply','d2-honest');edge('d2-honest','tree-day2-lin-arrives');edge('day2-pickup-solo-reply','d2-lie');
 bubble('d2-lin-arrives-reply','你怎么过来了？',35.6,1150,'tree-day2-lin-arrives');edge('tree-day2-lin-arrives','d2-lin-arrives-reply');edge('d2-lin-arrives-reply','tree-day2-lin-company');
 pickup('tree-day2-solo-elevator','独自走进电梯',34.6,1420,'d2-solo-elevator');node('death-005','结局005 · 被请离',36.6,1420,{kind:'death'});edge('d2-lie','tree-day2-solo-elevator');edge('tree-day2-solo-elevator','death-005');
 pickup('tree-day2-elevator','一起前往七楼',40,780,'elevator');
 for(const from of ['tree-day2-reassure','tree-day2-d2-reply-1','tree-day2-d2-reply-2','tree-day2-lin-company'])edge(from,'tree-day2-elevator');
 pickup('tree-day2-counter','输入取件码',41.4,780,'input');edge('tree-day2-elevator','tree-day2-counter');
 bubble('d2-code-right','取件码正确',42.4,780,'tree-day2-counter');bubble('d2-code-wrong','取件码错误',42.4,500,'tree-day2-counter');
 pickup('tree-day2-collected','领取物资',43.4,780,'success');node('death-003','结局003 · 被请离',43.4,500,{kind:'death',routeRecord:'d2-code-wrong'});edge('tree-day2-counter','d2-code-right');edge('tree-day2-counter','d2-code-wrong');edge('d2-code-right','tree-day2-collected');edge('d2-code-wrong','death-003');
 pickup('tree-day2-return','电梯的楼层数字被打乱',44.8,780,'d2-return');pickup('tree-day2-floor','首次输入楼层',46.2,780,'d2-floor');node('tree-day2-finish','成功回到宿舍',48.2,780,{checkpoint:'floorDone'});edge('tree-day2-collected','tree-day2-return');edge('tree-day2-return','tree-day2-floor');
 bubble('d2-floor-selected','成功回到宿舍',47.2,780,'tree-day2-floor');bubble('d2-room-wrong','进入错误宿舍',47.2,500,'tree-day2-floor');node('death-006','结局006 · 被请离',48.2,500,{kind:'death'});edge('tree-day2-floor','d2-floor-selected');edge('d2-floor-selected','tree-day2-finish');edge('tree-day2-floor','d2-room-wrong');edge('d2-room-wrong','death-006');
 node('tree-day2-common','取件结束 · 共同主线',49.6,1100,{checkpoint:'pickupCommon'});edge('tree-day2-finish','tree-day2-common');
 // Midday sits between the morning conversations and the 16:00 pickup.
 for(const n of g.nodes)if(n.x>=72+29.3*step)n.x+=9*step;
 g.edges=g.edges.filter(e=>!(e.from==='tree-day2-morning-end'&&e.to==='tree-day2-pickup-rules'));
 node('day2-midday-knitChoice','林晴在织什么',29.3,1150,{middayScript:'knitChoice'});
 node('day2-midday-familyChoice','林晴一个人的时候',31.3,1150,{middayScript:'familyChoice'});
 node('day2-midday-companyChoice','陪伴林晴',33.3,1360,{middayScript:'companyChoice'});
 node('day2-midday-free','11:50 · 四次自由行动',35.3,1150,{checkpoint:'middayFree'});
 node('day2-midday-finished','16:00 · 自由行动结束',37.3,1150,{checkpoint:'middayDone'});
 edge('tree-day2-morning-end','day2-midday-knitChoice');
 for(const [key,choices,col] of [['knitChoice',[['你在织什么？',1020,'familyChoice'],['你还会这个？',1280,'familyChoice']],30.3],['familyChoice',[['你家里人呢？',990,'free'],['那你怎么不找我呀？',1360,'companyChoice']],32.3],['companyChoice',[['无聊的时候可以找我聊天嘛',1260,'free'],['不想一个人的时候，我可以陪你',1460,'free']],34.3]])for(let i=0;i<choices.length;i++){const [title,y,to]=choices[i],id='d2-midday-'+key+'-'+i;bubble(id,title,col,y,'day2-midday-'+key);edge('day2-midday-'+key,id);edge(id,'day2-midday-'+to)}
 edge('day2-midday-free','day2-midday-finished');edge('day2-midday-finished','tree-day2-pickup-rules');
 g.sections=[{label:'第二日 · 09:01 / 群聊与私聊',x:72},{label:'林晴被针扎到',x:72+29.3*step,anchor:'day2-midday-knitChoice'},{label:'外出取件',x:72+39.6*step},{label:'领取物资与返程',x:72+49*step},{label:'把求助的事情告诉林晴',x:72+64.1*step,anchor:'tree-day2-evening-reflection'}];
 node('tree-day2-evening-departures','18:09 · 请离名单与楼层提醒',59.9,1100,{checkpoint:'eveningDepartures'});
 node('tree-day2-evening-explore','18:30 · 进食与自由探索',61.3,1100,{checkpoint:'eveningExplore'});
 node('tree-day2-evening-help','18:57 · 求助私聊',62.7,1100,{checkpoint:'eveningHelp'});
 edge('tree-day2-common','tree-day2-evening-departures');edge('tree-day2-evening-departures','tree-day2-evening-explore');edge('tree-day2-evening-explore','tree-day2-evening-help');
 node('tree-day2-evening-reflection','把求助的事告诉林晴',64.1,1100,{checkpoint:'eveningReflection'});
 edge('tree-day2-evening-help','tree-day2-evening-reflection');
 for(const [key,label,y] of [['Food','背包还有食物',850],['Empty','背包没有食物',1450]]){
  const id='tree-day2-eveningLin'+key,condition='d2-evening-has-'+key;
  bubble(condition,label,65.1,y,'tree-day2-evening-reflection');edge('tree-day2-evening-reflection',condition);
  node(id,label+' · 与林晴商量',66.1,y,{eveningScript:'eveningLin'+key});edge(condition,id);
 }
 node('tree-day2-evening-give','林晴提出拿自己的食物',68.1,700,{checkpoint:'eveningGive'});
 node('tree-day2-evening-worry','林晴理解你的担心',68.1,1030,{checkpoint:'eveningWorry'});
 node('tree-day2-evening-snacks','林晴愿意分享零食',68.1,1450,{checkpoint:'eveningSnacks'});
 for(const [key,labels,ys,targets] of [
  ['Food',['我想分一些给她们','我是想分，但还是有点担心后面不够'],[700,1030],['give','worry']],
  ['Empty',['我们要不帮忙问问其他人？','我不知道该怎么帮她们'],[1330,1570],['snacks','snacks']]
 ])labels.forEach((label,i)=>{const from='tree-day2-eveningLin'+key,id=from+'-option-'+i;bubble(id,label,67.1,ys[i],from);edge(from,id);edge(id,'tree-day2-evening-'+targets[i])});
 node('tree-day2-evening-lin-end','林晴陪你一起去',69.6,1100,{checkpoint:'eveningLinDone'});
 for(const key of ['give','worry','snacks'])edge('tree-day2-evening-'+key,'tree-day2-evening-lin-end');
 node('tree-day2-visit-start','和林晴一起送食物',70.9,1100,{checkpoint:'visitStart'});
 edge('tree-day2-evening-lin-end','tree-day2-visit-start');
 bubble('d2-visit-jiang-alive','江晓存活',71.9,910,'tree-day2-visit-start');bubble('d2-visit-jiang-dead','江晓已被请离',71.9,1330,'tree-day2-visit-start');
 node('tree-day2-visit-jiang','江晓接过袋子',72.9,910,{checkpoint:'visitJiang'});node('tree-day2-visit-zhou','周茉接过袋子',72.9,1330,{checkpoint:'visitZhou'});
 edge('tree-day2-visit-start','d2-visit-jiang-alive');edge('d2-visit-jiang-alive','tree-day2-visit-jiang');edge('tree-day2-visit-start','d2-visit-jiang-dead');edge('d2-visit-jiang-dead','tree-day2-visit-zhou');
 node('tree-day2-visit-back','送完食物，返回宿舍',74.3,1100,{checkpoint:'visitBack'});
 edge('tree-day2-visit-jiang','tree-day2-visit-back');edge('tree-day2-visit-zhou','tree-day2-visit-back');
 node('day2-report-start','21:00 · 第二日检举',75.7,1100,{checkpoint:'secondReportOpen'});
 node('day2-report-results-issued','21:05 · 检举结果',77.1,1100,{checkpoint:'secondReportResult'});
 edge('tree-day2-visit-back','day2-report-start');edge('day2-report-start','day2-report-results-issued');
 for(const [key,title,y] of [['jiang','江晓被投出',800],['yelin','叶琳被投出',1100],['mengshu','孟舒被投出',1500]]){
  const id='d2-night-vote-'+key;bubble(id,title,78.1,y,'day2-report-results-issued');edge('day2-report-results-issued',id);
 }
 node('tree-day2-night-group','21:20 · 韩露的消息与请离',79.1,950,{checkpoint:'nightGroup'});
 edge('d2-night-vote-jiang','tree-day2-night-group');edge('d2-night-vote-yelin','tree-day2-night-group');
 node('tree-day2-night-explore','22:00 · 自由购买探索60秒',80.5,1100,{checkpoint:'nightExplore'});
 edge('tree-day2-night-group','tree-day2-night-explore');edge('d2-night-vote-mengshu','tree-day2-night-explore');
 node('tree-day2-night-bed','上床睡觉',81.9,1100,{checkpoint:'nightBed'});edge('tree-day2-night-explore','tree-day2-night-bed');
 for(const [key,title,y,to] of [['jiang','江晓被投出',800,'death-009'],['yelin','叶琳被投出',1100,'death-010'],['mengshu','孟舒被投出',1500,'tree-day2-fourth-rules']]){
  const id='d2-night-sleep-'+key;bubble(id,title,82.9,y,'tree-day2-night-bed');edge('tree-day2-night-bed',id);edge(id,to);
 }
 node('death-009','结局009 · 学生会清理',83.9,800,{kind:'death'});node('death-010','结局010 · 学生会清理',83.9,1100,{kind:'death'});
 node('death-024','结局024 · 你没能找到正确的线索',83.9,1300,{kind:'death',record:null});edge('d2-night-sleep-yelin','death-024');
 node('tree-day2-fourth-rules','00:00 · 规则第四章',83.9,1500,{kind:'end',checkpoint:'fourthRules'});
 // The chapter heading is always visible, but is never a save or replay point.
 for(const n of g.nodes)n.x+=2*step;
 for(const section of g.sections)section.x+=2*step;
 node('day2-start','第二日开始',0,1235,{kind:'start',record:null});
 edge('day2-start',sid('intro'));edge('day2-start',sid('aliveMeng'));
 g.sections.unshift({label:'第二日',x:72});
 // Choices are bubbles. Only the decision that opens a branch is a replay card.
 const pickupDecisions=new Set(['d2-choice','d2-reply','d2-solo-chat','input','d2-floor']);
 const replyPhases=new Set(['d2-invite','d2-reply-0','d2-reply-1','d2-reply-2','d2-reassure-answer','d2-solo-yes','d2-solo-answer']);
 const outgoing=new Map();for(const e of g.edges){if(!outgoing.has(e.from))outgoing.set(e.from,[]);outgoing.get(e.from).push(e.to)}
 const removed=new Set();
 const optionCounts=new Map();
 for(const n of g.nodes)if(n.kind==='bubble')optionCounts.set(n.record,(optionCounts.get(n.record)||0)+1);
 for(const n of g.nodes){
  n.replayable=!!(n.script&&DAY_TWO_AUTHORED[n.script].choices?.length>1||n.linScript&&['linAfterWhen','linAfterTaste'].includes(n.linScript)||pickupDecisions.has(n.pickupPhase)||n.middayScript||n.eveningScript||['middayFree','secondReportOpen'].includes(n.checkpoint));
  if(n.script&&!n.replayable||n.linScript&&!n.replayable||replyPhases.has(n.pickupPhase))removed.add(n.id);
  if(n.kind==='bubble'&&optionCounts.get(n.record)<2)removed.add(n.id);
  // Hide passive transitions; keep actual decisions, conditions and chapter endpoints.
  if(n.kind==='story'&&!n.replayable&&(outgoing.get(n.id)||[]).length<=1)removed.add(n.id);
 }
const destinations=id=>removed.has(id)?(outgoing.get(id)||[]).flatMap(destinations):[id];
 const edges=[],seen=new Set();
 for(const e of g.edges)if(!removed.has(e.from))for(const to of destinations(e.to)){const key=e.from+'>'+to;if(!seen.has(key)){seen.add(key);edges.push({from:e.from,to})}}
 g.nodes=g.nodes.filter(n=>!removed.has(n.id));g.edges=edges;
 // Bubble columns only need their actual width, not a full card-sized column.
 const columns=[...new Set(g.nodes.map(n=>n.x))].sort((a,b)=>a-b),compact=new Map();let left=72;
 const incomingCount=new Map();for(const edge of g.edges)incomingCount.set(edge.to,(incomingCount.get(edge.to)||0)+1);
 for(let i=0;i<columns.length;i++){const x=columns[i];compact.set(x,left);const width=Math.max(...g.nodes.filter(n=>n.x===x).map(n=>n.kind==='bubble'?48:196));const nextNodes=g.nodes.filter(n=>n.x===columns[i+1]),fan=Math.max(1,...nextNodes.map(n=>incomingCount.get(n.id)||1));left+=width+(fan>1?160+(fan-2)*16:64)}
 const compactY=y=>140+(y-190)*.65;
 for(const n of g.nodes){n.x=compact.get(n.x);n.y=compactY(n.y)}
 for(const section of g.sections){const anchor=g.nodes.find(n=>n.id===section.anchor);section.x=anchor?.x??compact.get(columns.find(x=>x>=section.x)??columns.at(-1));if(anchor)section.y=anchor.y}
 g.focusY=compactY(g.focusY);
 g.startSpan=Math.abs(g.nodes.find(n=>n.id===sid('aliveMeng')).y-g.nodes.find(n=>n.id===sid('intro')).y)+200;
 g.height=Math.max(...g.nodes.map(n=>n.y))+130;
 g.width=Math.max(...g.nodes.map(n=>n.x+296));return g;
}
