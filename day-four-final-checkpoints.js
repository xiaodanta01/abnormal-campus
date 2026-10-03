/* Every authored answer remains visible on the rewind map, including converging choices. */
const D4_FINAL_NODES=Object.entries(D4_FINAL_SCRIPTS).filter(([,s])=>s.options).map(([key])=>['day4-final-'+key,key]);
const D4_FINAL_TITLES={opening:'反击骗取委托的指控',claim:'回顾初始委托票数',initial:'质疑缺失的学生会支持',excuse:'回应最后两分钟的说法',isolated:'指出毫无保留的信任',faction:'追问沉默的同伙',three:'质疑三名学生会的说法',reported:'回顾已确认的学生会',identity:'回应林晴公开身份',deadline:'最后的反问'};
for(const [id,key]of D4_FINAL_NODES)STORY_CHOICES.push({id,title:D4_FINAL_TITLES[key],day:'第四日',chat:HG_ID});
STORY_CHOICES.push({id:'day4-final-report',title:'提交最终日检举',day:'第四日',chat:null});
const d4FinalGraphBase=makeDayFourWorldline;makeDayFourWorldline=function(){
 const g=d4FinalGraphBase();let x=g.width-70;g.sections.push({label:'最终日 · 反击与检举',x});g.edges.push({from:'day4-vote-reasoning',to:D4_FINAL_NODES[0][0]});
 D4_FINAL_NODES.forEach(([id,key],index)=>{const next=D4_FINAL_NODES[index+1]?.[0]||'day4-final-report';g.nodes.push({id,title:D4_FINAL_TITLES[key],x,y:420,kind:'story',record:id,replayable:true});
  D4_FINAL_SCRIPTS[key].options.forEach((title,i)=>{const branch=id+'-option-'+i;g.nodes.push({id:branch,title,x:x+310,y:D4_FINAL_SCRIPTS[key].options.length===1?420:i===0?270:570,kind:'bubble',record:id});g.edges.push({from:id,to:branch},{from:branch,to:next})});x+=620;
 });
 g.nodes.push({id:'day4-final-report',title:'提交最终日检举',x,y:420,kind:'story',record:'day4-final-report',replayable:true},
 {id:'death-017',title:'你是故意的吗？',x:x+310,y:270,kind:'death',record:null,replayable:false},
 {id:'day4-final-success',title:'检举成功',x:x+310,y:570,kind:'story',record:null,replayable:false},
 {id:'day4-final-lin-night',title:'林晴的深夜消息',x:x+620,y:570,kind:'story',record:null,replayable:false});
 g.edges.push({from:'day4-final-report',to:'death-017'},{from:'day4-final-report',to:'day4-final-success'},{from:'day4-final-success',to:'day4-final-lin-night'});g.width=x+1000;return g;
};
