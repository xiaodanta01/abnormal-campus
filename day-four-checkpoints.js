/* Day 4 checkpoints use the existing per-run snapshot store and restore chain. */
const D4_CHECKPOINTS=[
 ['day4-hean-friend-accepted','同意何安好友申请'],
 ['day4-after-group-choice','回应白栀的质疑'],
 ['day4-lin-snicker-choice','询问林晴与士力架'],
 ['day4-huang-shen-choice','向黄依依说明怀疑'],
 ['day4-debate-attack-choice','回应群内的反指控'],
 ['day4-debate-risk-choice','质疑沈可欣邀请同行的理由'],
 ['day4-debate-round3-choice','追问沈可欣的立场'],
 ['day4-scarf-choice','回应林晴送的围巾'],
 ['day4-pickup-code','第四日输入取件码'],
 ['day4-wait-choice','回应林晴暂时离开'],
 ...Object.entries(D4_MEAL_CHOICES).map(([phase,def])=>[phase,def.title])
];
for(const [id,title]of D4_CHECKPOINTS)if(!STORY_CHOICES.some(n=>n.id===id))STORY_CHOICES.push({id,title,day:'第四日',chat:null});
function d4CaptureCheckpoint(id,route){if(state.game.day!==4||d3Paused())return;d2Capture(id,route)}
const d4CheckpointHeanAccept=actions['d4-hean-accept'];
actions['d4-hean-accept']=function(...args){const accepting=state.game.day===4&&d4Hean()?.phase==='request';const result=d4CheckpointHeanAccept(...args);if(accepting&&d4Hean()?.phase==='chat')d4CaptureCheckpoint('day4-hean-friend-accepted',{view:'chat',active:D4_HEAN_CHAT});return result};
const d4CheckpointAfterDecorate=d4AfterDecorate;
d4AfterDecorate=function(...args){const result=d4CheckpointAfterDecorate(...args);const q=d4After();if(d4AfterInside()&&q?.phase==='choice')d4CaptureCheckpoint(q.script==='group'?'day4-after-group-choice':'day4-lin-snicker-choice',{view:'chat',active:q.chat});return result};
const d4CheckpointADecorate=d4ADecorate;
d4ADecorate=function(...args){const result=d4CheckpointADecorate(...args);const q=d4A()?.huang;if(view==='chat'&&active===D4_HUANG&&q?.phase==='choice'&&q.script==='shen')d4CaptureCheckpoint('day4-huang-shen-choice',{view:'chat',active:D4_HUANG});return result};
const d4CheckpointDebateDecorate=d4DebateDecorate;
d4DebateDecorate=function(...args){const result=d4CheckpointDebateDecorate(...args);const q=d4Debate();if(d4DebateInside()&&q?.phase==='choice'&&['attack','risk','round3'].includes(q.script))d4CaptureCheckpoint('day4-debate-'+q.script+'-choice',{view:'chat',active:HG_ID});return result};
const d4CheckpointPickupRender=pickup16Render;
pickup16Render=function(...args){const result=d4CheckpointPickupRender(...args);const p=state.story.dayFourPickup;if(state.game.day===4&&p&&!p.done){const id=p.phase==='d4-scarf-choice'?'day4-scarf-choice':p.phase==='input'?'day4-pickup-code':p.phase==='d4-wait-choice'?'day4-wait-choice':D4_MEAL_CHOICES[p.phase]?p.phase:null;if(id)d4CaptureCheckpoint(id,{view:'afternoon-pickup',active:null})}return result};
const d4CheckpointGraph=makeDayFourWorldline;
makeDayFourWorldline=function(){
 const g=d4CheckpointGraph(),order=['day4-start',D4_DELEGATION_NODE,'day4-hean-friend-accepted',D4_REASON_NODE,'day4-after-group-choice','day4-lin-snicker-choice',D4_HUANG_FRIEND_NODE,'day4-huang-shen-choice','day4-debate-attack-choice','day4-debate-risk-choice','day4-debate-round3-choice','day4-scarf-choice','day4-pickup-code','day4-wait-choice','day4-lin-gift'];
 for(const [id,title]of D4_CHECKPOINTS)g.nodes.push({id,title,kind:'story',record:id,replayable:true});
 g.nodes.push({id:'day4-lin-gift',title:'林晴带回便利店袋子',kind:'story',record:null,replayable:false});
 const rounds={attack:['周茉被用来指责你 · 沈可欣＋1票','追问检举承诺 · 沈可欣－1票，你＋2票'],risk:['质疑同行动机 · 沈可欣＋1票','指出前后矛盾 · 沈可欣－1票，你＋2票'],round3:['追问为何存活 · 沈可欣－1票，你＋2票','追问冒险前提 · 沈可欣－1票，你＋2票']};
 g.edges=[];g.sections=[{label:'第四日',x:72}];g.independentMerges=true;g.height=900;g.focusY=420;
 let col=0;
 order.forEach((id,index)=>{
  const n=g.nodes.find(n=>n.id===id);if(!n)return;
  n.x=72+col*310;n.y=420;
  if(id==='day4-start'){n.kind='story';n.record='day4-start';n.replayable=true}
  const key=Object.keys(rounds).find(key=>id==='day4-debate-'+key+'-choice'),next=order[index+1];
  const afterScript=id==='day4-after-group-choice'?'group':id==='day4-lin-snicker-choice'?'private':null;
  if(id==='day4-wait-choice'){
   ['你要去哪里？','好，我等你'].forEach((title,i)=>{const branch=id+'-option-'+i;g.nodes.push({id:branch,title,x:72+(col+1)*310,y:i===0?270:570,kind:'bubble',record:id});g.edges.push({from:id,to:branch},{from:branch,to:next})});col+=2;
  }else if(afterScript){
   d4AfterOptions(afterScript).forEach((choice,i)=>{
    const branch=id+'-option-'+i;
    g.nodes.push({id:branch,title:choice[1],x:72+(col+1)*310,y:i===0?270:570,kind:'bubble',record:id});
    g.edges.push({from:id,to:branch},{from:branch,to:next});
   });
   col+=2;
  }else if(key){
   g.sections.push({label:'辩论 · 第'+({attack:'一',risk:'二',round3:'三'}[key])+'轮',x:n.x});
   D4_DEBATE_SCRIPTS[key].options.forEach((choice,i)=>{
    const branch=id+'-option-'+i,result=branch+'-result',y=i===0?270:570;
    g.nodes.push({id:branch,title:choice[0],x:72+(col+1)*310,y,kind:'bubble',record:id});
    g.nodes.push({id:result,title:rounds[key][i],x:72+(col+2)*310,y,kind:'story',record:null,replayable:false});
    g.edges.push({from:id,to:branch},{from:branch,to:result},{from:result,to:next});
   });
   col+=3;
  }else{if(next)g.edges.push({from:id,to:next});col++}
 });
 g.width=72+col*310;return g
};
// A reached choice in an older save can be captured now, without inventing past snapshots.
if(!d3Paused()&&state.game.day===4){if(view==='chat'){d4AfterDecorate();d4ADecorate();d4DebateDecorate()}else if(state.story.dayFourPickup&&!state.story.dayFourPickup.done&&['d4-scarf-choice','input','d4-wait-choice'].includes(state.story.dayFourPickup.phase))pickup16Render()}

const d4MealGraphBase=makeDayFourWorldline;
makeDayFourWorldline=function(){const g=d4MealGraphBase(),start=g.nodes.find(n=>n.id==='day4-lin-gift');let x=start.x+310;
 const destinations={'d4-meal-reply':['d4-meal-money','d4-meal-flirt'],'d4-meal-flirt':['d4-meal-money','d4-meal-money'],'d4-meal-money':['d4-meal-memory','d4-meal-memory'],'d4-meal-memory':['d4-meal-memory-response','d4-meal-taste'],'d4-meal-memory-response':['d4-meal-taste','d4-meal-taste','d4-meal-taste']};
 const order=['d4-meal-reply','d4-meal-flirt','d4-meal-money','d4-meal-memory','d4-meal-memory-response','d4-meal-taste'];g.edges.push({from:start.id,to:order[0]});
 for(const id of order){const n=g.nodes.find(n=>n.id===id);n.x=x;n.y=420;D4_MEAL_CHOICES[id].options.forEach(([title],i)=>{const branch=id+'-option-'+i;g.nodes.push({id:branch,title,x:x+310,y:D4_MEAL_CHOICES[id].options.length===3?240+i*180:i===0?270:570,kind:'bubble',record:id});g.edges.push({from:id,to:branch});const next=destinations[id]?.[i];if(next)g.edges.push({from:branch,to:next})});x+=620}g.width=x+310;return g};
