/* The third-day application: authored answers, five recreational result types. */
const D3_SURVEY_NOTES=[
 '问卷不存在标准答案。请根据自身经历、能力与贡献，如实说明。',
 '问卷阶段结束后，将进入匿名评审。每名学生会随机收到两份匿名答卷，并对其“留校价值”进行评分。'
];
const D3_SURVEY_QUESTIONS=[
 {text:'当一个集体只考虑保留部分成员时，你认为最应该参考什么？',choices:[
  ['每个人此前的贡献',{V:1}],['未来可能提供的价值',{V:2}],['不应该用统一标准比较',{V:-2}]
 ]},
 {text:'如果一个人在过去多次作出错误判断，但最后提供了重要信息，你会如何评价她？',choices:[
  ['有最后的重要信息就够了',{C:-1,V:1}],['要看她是否承认错误',{C:-2,J:-1}],['不会再把重要决定交给她',{C:2}]
 ]},
 {text:'当系统记录结果和你亲眼看到的情况发生冲突时，你更倾向相信什么？',choices:[
  ['系统记录结果',{J:2}],['自己看到的',{J:-1}],['先核对两者为何不一致',{J:-2}],['相信大多数人的判断',{J:2}]
 ]},
 {text:'一个人没有提供过任何资源和帮助，但一直遵守规则，没有伤害任何人。你认为她的存在价值是：',choices:[
  ['与其他人没有区别',{V:-1}],['取决于剩余名额',{V:1,R:1}],['低于能提供资源和帮助的人',{V:2}],['“存在价值”本身不应该被评估',{V:-2}]
 ]},
 {text:'当群体中一个人需要别人帮助，却暂时无法回报时，你认为这种关系：',choices:[
  ['很正常，人都会有困难的时候',{R:-2}],['可以接受，但不能长期持续',{R:1}],['不愿意帮助，这会成为群体的负担',{R:2,V:1}]
 ]},
 {text:'哪一种人更容易让你产生信任？',choices:[
  ['从不出错的人',{C:2}],['会承认自己出错的人',{C:-2}],['能提供明确证据的人',{J:-2}],['愿意帮助我的人',{}]
 ]}
];
const D3_SURVEY_WRITING=['你为什么比别人更值得留下？','这个问卷本身合理吗？'];
const D3_SURVEY_TYPES={
 cooperative:{name:'人本协作型',adaptation:'中等',description:'你更倾向于把个体本身，而不是其贡献、能力或回报价值，作为判断的重要依据。\n当他人暂时陷入困境时，你通常愿意提供帮助，也不会要求对方立即证明自己的价值。\n对你来说，一个人“现在帮不上忙”，并不意味着她就更不值得留下。',hint:'对低回报成员的资源投入倾向较高。',center:{V:-1,J:0,C:-.5,R:-1}},
 empathetic:{name:'理性共情型',adaptation:'中等偏高',description:'你倾向于核对证据、确认前后逻辑，再形成判断。\n一个人是否与你立场一致，不会直接决定她的信息是否可信。你可以理解人的脆弱和失误，但不会因此放弃怀疑。\n即使某人曾经犯错，只要新的信息足够可靠，你仍然愿意重新评估。',hint:'信息筛选意识较强，但反复核实可能延缓决策。',center:{V:-.25,J:-1,C:-.5,R:0}},
 protective:{name:'现实自保型',adaptation:'较高',description:'你愿意帮助别人，但通常会先确认自己是否承担得起代价。\n在资源有限的情况下，你认为保护自己的基本需求并不可耻。\n你不一定赞同淘汰弱者，但也不会无限承担他人的风险。',hint:'资源风险意识较强，自身生存稳定性较高。',center:{V:0,J:0,C:0,R:1}},
 pragmatic:{name:'功利决策型',adaptation:'高',description:'你更习惯从实际贡献、未来价值和整体结果判断一个选择。\n当资源或名额有限时，你能够接受不同成员拥有不同的优先级。\n相比“每个人都应该被同等对待”，你更关注怎样的选择能让整体结果更好。',hint:'资源配置意识较强，能够接受必要取舍。',center:{V:1,J:0,C:0,R:.25}},
 efficient:{name:'效率优先型',adaptation:'很高',description:'你对错误、低效率和持续依赖的容忍度较低。\n当一个人多次无法证明自己的可靠性或贡献时，你会倾向于降低其优先级。',hint:'决策效率高，淘汰无效投入的意愿较强。',center:{V:1,J:.3,C:1,R:.5}}
};
const D3_SURVEY_AXES=[
 {key:'V',title:'价值取向',left:'人本导向',right:'功利导向'},
 {key:'R',title:'资源策略',left:'互助倾向',right:'自保／交换'},
 {key:'C',title:'错误态度',left:'容错修正',right:'淘汰苛责'},
 {key:'J',title:'判断方式',left:'自主求证',right:'外部依赖'}
];
function d3SurveyBounds(key){
 const ranges=D3_SURVEY_QUESTIONS.map(q=>q.choices.map(c=>c[1][key]||0));
 return [ranges.reduce((sum,r)=>sum+Math.min(...r),0),ranges.reduce((sum,r)=>sum+Math.max(...r),0)];
}
function d3SurveyNormalized(key,value){const [min,max]=d3SurveyBounds(key);return value<0?value/Math.abs(min):value/(max||1)}
function d3SurveyAssessment(answers){
 if(answers.length!==D3_SURVEY_QUESTIONS.length||answers.some((a,i)=>!Number.isInteger(a)||!D3_SURVEY_QUESTIONS[i].choices[a]))return null;
 const scores={V:0,J:0,C:0,R:0};
 answers.forEach((a,i)=>{for(const [key,value] of Object.entries(D3_SURVEY_QUESTIONS[i].choices[a][1]))scores[key]+=value});
 const {V,J,C,R}=scores;let type;
 // Explicit precedence resolves overlaps; nearest tendency covers the remaining mixed answers.
 if(V>=2&&C>=2)type='efficient';
 else if(R>=2&&V<3)type='protective';
 else if(V>=2)type='pragmatic';
 else if(J<=-2)type='empathetic';
 else if(V<=-2&&R<=-1)type='cooperative';
 else {
  const weights={V:2,J:2,C:1,R:2};
  type=['cooperative','empathetic','protective','pragmatic'].map(id=>({id,distance:Object.keys(scores).reduce((sum,k)=>sum+weights[k]*(d3SurveyNormalized(k,scores[k])-D3_SURVEY_TYPES[id].center[k])**2,0)})).sort((a,b)=>a.distance-b.distance)[0].id;
 }
 const axes=D3_SURVEY_AXES.map(axis=>{const value=d3SurveyNormalized(axis.key,scores[axis.key]),rightPercent=Math.round(50+50*value);return {...axis,rightPercent,label:value<0?axis.left:value>0?axis.right:'倾向均衡',percent:value<0?100-rightPercent:rightPercent}});
 return {version:1,type,scores,axes};
}
function makeDayThreeWorldline(){
 const steps=[
  ['day3-lin-defense-opening','回应对林晴的怀疑', [['challenge','所以呢，你想表达什么？'],['mistake','……不然呢？不是都说了弄错了吗'],['silent','保持沉默']]],
  ['day3-lin-defense-reassure','回应林晴的隐瞒', [['friends','我们是好朋友，对吧？'],['wait','没事，我会等到你愿意告诉我的时候。']]],
  ['day3-fever-answerChoice','回应林晴的呼唤', [['here','我在'],['yes','嗯']]],
  ['day3-fever-revealChoice','询问林晴出门的原因', [['why','所以现在，可以告诉我为什么了吗？'],['care','你就这么担心我出事，担心到露出马脚也无所谓了吗？']]]
 ];
 const g={nodes:[
  {id:'day3-start',title:'第三日开始',x:72,y:420,kind:'start',record:null,replayable:false},
  {id:'day3-survey-before-notice',title:'09:00 · 留校资格申请',x:380,y:420,kind:'story',record:'day3-survey-before-notice',replayable:true},
  {id:'day3-anonymous-review',title:'匿名答卷评审',x:688,y:420,kind:'story',record:'day3-anonymous-review',replayable:true}
 ],edges:[{from:'day3-start',to:'day3-survey-before-notice'},{from:'day3-survey-before-notice',to:'day3-anonymous-review'}],
 sections:[{label:'问卷与匿名评审',x:72},{label:'群聊争执与林晴的秘密',x:996}],height:850,focusY:420,independentMerges:true};
 let previous=['day3-anonymous-review'],x=996;
 for(const [id,title,options] of steps){
  g.nodes.push({id,title,x,y:420,kind:'story',record:id,replayable:true});
  for(const from of previous)g.edges.push({from,to:id});
  previous=options.map(([choice,label],i)=>{const branch=id+'-option-'+choice;g.nodes.push({id:branch,title:label,x:x+252,y:420+(i-(options.length-1)/2)*136,kind:'bubble',record:id,replayable:false});g.edges.push({from:id,to:branch});return branch});
  x+=560;
 }
 g.sections.push({label:'推理与群聊试探',x});
 g.nodes.push({id:'day3-reasoning-start',title:'开始推理',x,y:420,kind:'story',record:'day3-reasoning-start',replayable:true});
 for(const from of previous)g.edges.push({from,to:'day3-reasoning-start'});
 previous=['day3-reasoning-start'];x+=308;
 g.nodes.push({id:'day3-probe-pressure',title:'追问江柠的物流记录',x,y:420,kind:'story',record:'day3-probe-pressure',replayable:true});
 for(const from of previous)g.edges.push({from,to:'day3-probe-pressure'});
 for(const [i,[id,title]] of [['morning','早上许蓁蓁不也是这样怀疑林晴的吗？'],['suspicion','因为我怀疑你是学生会']].entries()){
  const branch='day3-probe-pressure-option-'+id;g.nodes.push({id:branch,title,x:x+252,y:352+i*136,kind:'bubble',record:'day3-probe-pressure',replayable:false});g.edges.push({from:'day3-probe-pressure',to:branch});
 }
 previous=['day3-probe-pressure-option-morning','day3-probe-pressure-option-suspicion'];x+=560;
 g.sections.push({label:'回宿舍与晚间检举',x});
 for(const [key,title,options] of [
  ['wish','出校后的愿望',[['unsure','我还没想好'],['meal','吃一顿大餐'],['movie','去逛商场，看电影'],['custom','自己输入想做的事']]],
  ['plan','林晴的计划',[['ask','你呢，你最想做什么？'],['together','你呢，你的计划里会有我吗？']]]
 ]){
  const id='day3-evening-'+key;g.nodes.push({id,title,x,y:420,kind:'story',record:id,replayable:true});for(const from of previous)g.edges.push({from,to:id});
  previous=options.map(([choice,label],i)=>{const branch=id+'-option-'+choice;g.nodes.push({id:branch,title:label,x:x+252,y:420+(i-(options.length-1)/2)*136,kind:'bubble',record:id,replayable:false});g.edges.push({from:id,to:branch});return branch});x+=560;
 }
 const report='day3-before-report';g.nodes.push({id:report,title:'21:00 · 第三日检举',x,y:420,kind:'story',record:report,replayable:true});for(const from of previous)g.edges.push({from,to:report});
 x+=308;g.nodes.push({id:'day3-vote-jiangning',title:'江柠被请离',x,y:352,kind:'bubble',replayable:false});g.nodes.push({id:'death-015',title:'结局015',x,y:488,kind:'death',replayable:false});g.edges.push({from:report,to:'day3-vote-jiangning'},{from:report,to:'death-015'});
 x+=308;g.nodes.push({id:'day3-evening-zhou',title:'周茉的感谢',x,y:352,kind:'story',record:'day3-evening-zhou',replayable:true});g.edges.push({from:'day3-vote-jiangning',to:'day3-evening-zhou'});
 for(const [i,[id,title]] of [['lucky','遇到你我也很幸运'],['why','怎么了，为什么突然这么说']].entries()){const branch='day3-evening-zhou-option-'+id;g.nodes.push({id:branch,title,x:x+252,y:284+i*136,kind:'bubble',replayable:false});g.edges.push({from:'day3-evening-zhou',to:branch})}
 x+=560;g.nodes.push({id:'day3-evening-kind',title:'回应周茉',x,y:284,kind:'story',record:'day3-evening-kind',replayable:true});g.edges.push({from:'day3-evening-zhou-option-lucky',to:'day3-evening-kind'});
 for(const [i,[id,title]] of [['joke','我们有那么好吗哈哈哈'],['better','不会的，你还会遇到比我更好的人']].entries()){const branch='day3-evening-kind-option-'+id;g.nodes.push({id:branch,title,x:x+252,y:216+i*136,kind:'bubble',replayable:false});g.edges.push({from:'day3-evening-kind',to:branch})}
 x+=560;
 g.nodes.push({id:'day3-night-story',title:'林晴的睡前故事',x,y:420,kind:'story',record:'day3-night-story',replayable:true});
 for(const from of ['day3-evening-kind-option-joke','day3-evening-kind-option-better','day3-evening-zhou-option-why','day3-vote-jiangning'])g.edges.push({from,to:'day3-night-story'});
 x+=308;g.nodes.push({id:'day3-night-storyChoice',title:'回应林晴的睡前故事',x,y:420,kind:'story',record:'day3-night-storyChoice',replayable:true});g.edges.push({from:'day3-night-story',to:'day3-night-storyChoice'});
 for(const [i,[id,title]] of [['ready','好啊，我准备好了'],['yes','嗯嗯'],['scary','恐怖故事我可不听哦']].entries()){const branch='day3-night-storyChoice-option-'+id;g.nodes.push({id:branch,title,x:x+252,y:284+i*136,kind:'bubble',replayable:false});g.edges.push({from:'day3-night-storyChoice',to:branch})}
 g.width=x+560;return g;
}
