/* Section navigation is shared by the game and the author preview. */
function treeEventTitle(title){
 return String(title).replace(/(?:凌晨|清晨|早晨|上午|中午|下午|傍晚|晚上|夜间)?\s*\d{1,2}[:：]\d{2}(?:[:：]\d{2})?\s*(?:[·｜|/—-]\s*|的)?/g,'').replace(/^[\s·｜|/—-]+|[\s·｜|/—-]+$/g,'').trim();
}
function treeSectionDirectory(g){
 if(g.placeholder||!g.sections.length)return '';
 const escape=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 return '<nav class="choice-tree-directory" aria-label="剧情分段定位">'+g.sections.map((section,i)=>'<button type="button" data-tree-section="'+i+'" aria-current="false"><small>'+String(i+1).padStart(2,'0')+'</small><span>'+escape(section.label)+'</span></button>').join('')+'</nav>';
}
function treeSectionPosition(g,index,height,scale){
 const section=g.sections[index];if(!section)return null;
 const candidates=g.nodes.filter(n=>n.x>=section.x&&n.kind!=='bubble'&&n.kind!=='hidden'),first=candidates.reduce((a,b)=>!a||b.x<a.x?b:a,null);
 const column=first?candidates.filter(n=>n.x===first.x):[],y=section.y??(column.length?column.reduce((sum,n)=>sum+n.y,0)/column.length:g.focusY||420);
 const zoom=Math.max(.65,Math.min(1,scale));return {x:24-section.x*zoom,y:height*.48-y*zoom,scale:zoom};
}
function treeSectionHighlight(root,g,position){
 const left=(24-position.x)/position.scale;let current=0;
 g.sections.forEach((section,i)=>{if(section.x<=left+2)current=i});
 root.querySelectorAll('[data-tree-section]').forEach(button=>button.setAttribute('aria-current',String(Number(button.dataset.treeSection)===current)));
}
/* Authored left-to-right story graphs. Kept independent of the release's story boundary. */
(()=>{
const W=196,H=88,BW=48,BH=36,STEP=292,ROW=136;
const groups=['第零日 + 第一日','第二日','第三日','第四日','第五日'];
const availableDays=[0,1,2,3,4];
const discoveryKey=STORAGE_KEY+'-worldline-discovery';
let discovered={};try{discovered=JSON.parse(GameStorage.getItem(discoveryKey)||'{}')}catch{}
if(discovered['death-day2-code'])discovered['death-003']=true;
if(discovered['hidden-stay'])discovered['020']=true;
let selectedDay=0,transform={x:24,y:0,scale:.8},graph=null,dragged=false;
const positions={};
function mark(id){if(discovered[id])return;discovered[id]=true;try{GameStorage.setItem(discoveryKey,JSON.stringify(discovered))}catch{}}
function questionnaireOwnsFailure(progress){
 const death=progress?.story?.lateDayDeath;
 // Other terminal routes also close an unfinished questionnaire as 'dead'.
 return !death||death.reason==='questionnaire';
}
function rememberDayTwoMilestones(progress){
 const s=progress?.story;if(!s)return;
 if(s.lateDayDeath?.phase==='dead'&&s.lateDayDeath.reason==='day2-council-accusation')mark('death-007');
 // Publishing chapter four advances the date/day before persist runs. A vote or
 // midnight-wait alone is not evidence that the publication has happened.
 const night=s.dayTwoNight,ruleId='chapter-four-midnight-rules';
 if(night?.rulesNotified||['midnight-notice','midnight-reading'].includes(night?.phase)
  ||progress.forumPosts?.some(p=>p.id===ruleId)
  ||Object.values(progress.messages||{}).some(rows=>Array.isArray(rows)&&rows.some(m=>m.id===ruleId))
  ||progress.game?.day>=3||/^\d{4}-\d{2}-\d{2}$/.test(progress.system?.date||'')&&progress.system.date>='2045-09-10')mark('tree-day2-fourth-rules');
}
function rememberDayFiveMilestones(progress){
 const ending=progress?.story?.dayFourSleep,call=ending?.phone?.motherCall;
 if(call&&['incoming','talking','done'].includes(call.phase))mark(hospitalMotherNode(hospitalEndingId(progress)));
 if(window.endingGalleryHas?.('019'))mark('day5-mother-call');
 if(window.endingGalleryHas?.('021'))mark('day5-reunion-mother-call');
 if(window.endingGalleryHas?.('022'))mark('day5-low-mother-call');
 if(window.endingGalleryHas?.('023'))mark('day5-together-mother-call');
 if(call?.endingConfirmed)mark(hospitalEndingId(progress));
 // Later historical snapshots establish discovery, never reconstruct a replay state.
 if(typeof dayFiveReleaseReached==='function'&&dayFiveReleaseReached(progress)){
  mark('day5-start');mark('day5-release-notice');
 }
 if(progress?.story?.dayFourSleep?.phase==='hidden-ending'&&['020','hidden-stay'].includes(progress.story.dayFourSleep.endingId))mark('020');
}
function rememberBranches(progress){
 const s=progress?.story;if(!s)return;
 rememberDayTwoMilestones(progress);
 rememberDayFiveMilestones(progress);
 if(progress.game?.day>=4)mark('day4-start');
 for(const [phase,index]of Object.entries(s.dayFourPickup?.mealChoices||{}))mark(phase+'-option-'+index);
 if(Number.isInteger(s.dayFourCounterattack?.choice))mark('day4-counter-choice-option-'+s.dayFourCounterattack.choice);
 for(const [key,index]of Object.entries(s.dayFourFinal?.decisions||{}))if(Number.isInteger(index))mark('day4-final-'+key+'-option-'+index);
 if(s.dayFourFinal?.correct)mark('day4-final-success');
 if(s.dayFourFinal?.phase==='done')mark('day4-final-lin-night');
 if(s.lateDayDeath?.reason==='day4-final-report-wrong')mark('death-017');
 if(s.lateDayDeath?.phase==='dead'&&s.lateDayDeath.reason==='departed-reply'){mark('wall-departed-reply');mark('death-018')}
 if(Number.isInteger(s.dayFourPickup?.returnChoice))mark('day4-wait-choice-option-'+s.dayFourPickup.returnChoice);
 if(s.dayFourPickup?.returnChoice!==undefined&&(s.dayFourPickup.phase==='d4-gift-bag'||s.dayFourPickup.done))mark('day4-lin-gift');
 if(s.dayThreeNight?.decisions?.storyChoice)mark('day3-night-storyChoice-option-'+s.dayThreeNight.decisions.storyChoice);
 for(const [key,choice] of Object.entries(s.dayThreeEvening?.decisions||{}))mark('day3-evening-'+key+'-option-'+choice);
 if(s.dayThreeReport?.groupResult?.target==='jiangning')mark('day3-vote-jiangning');
 if(s.lateDayDeath?.reason==='day3-lost-support')mark('death-015');
 const option=(id,value)=>{if(Number.isInteger(value))mark(id+'-option-'+value)};
 for(const [key,id]of Object.entries({group:'day4-after-group-choice',private:'day4-lin-snicker-choice'})){
  const choice=s.dayFourAfterConfrontation?.decisions?.[key];
  if(choice===0||choice===1)option(id,choice);
 }
 // Read real decisions and settled effects from current and saved states.
 for(const [key,effects]of Object.entries({attack:['bad1','good1'],risk:['bad2','good2'],round3:['good3','good3']})){
  const q=s.dayFourDebate,choice=q?.decisions?.[key];
  if(choice!==0&&choice!==1)continue;
  const id='day4-debate-'+key+'-choice';option(id,choice);
  if(q.effects?.[effects[choice]])mark(id+'-option-'+choice+'-result');
 }

 for(const [key,allowed] of Object.entries({opening:['challenge','mistake','silent'],reassure:['friends','wait']})){
  const choice=s.dayThreeLinDefense?.decisions?.[key];if(allowed.includes(choice))mark('day3-lin-defense-'+key+'-option-'+choice);
 }

 if(['morning','suspicion'].includes(s.dayThreeReasoningProbe?.decisions?.pressure))mark('day3-probe-pressure-option-'+s.dayThreeReasoningProbe.decisions.pressure);
 for(const [key,choice] of Object.entries(s.dayThreeFever?.decisions||{}))mark('day3-fever-'+key+'-option-'+choice);
 if(s.zero?.choice==='accept')mark('supermarket-yes');if(s.zero?.choice==='refuse')mark('supermarket-no');
 option('day0-linqing-reply',s.afterWall?.choice);option('day0-xuzhixia-reply',s.helpGroup?.choice);
 const morning=s.firstMorning?.choice;
 if(morning===2){mark('supply-none');mark('pickup-none')}
 if(morning===0||morning===1){mark('supply-bought');mark(morning===0?'pickup-together':'pickup-later')}
 option('day1-jiangxiao-warning',s.jiangxiao?.choice);option('day1-linqing-food',s.foodCG?.choice);
 const n=s.noodleEvening;
 if(n){mark('code-right');if(n.route==='water')mark('has-water');if(n.route==='no-water')mark('no-water');option('noodle-choice-borrow',n.choices?.borrow);if(n.choices?.taste===0)mark('taste-alone');if(n.choices?.taste===1)mark('taste-share')}
 if(s.pickupCodeDeath&&progress.game?.day===1)mark('code-wrong');
 if(questionnaireOwnsFailure(progress)&&(s.questionnaire?.failed||s.questionnaire?.phase==='dead'))mark('survey-fail');
 if(s.questionnaireComplete)mark('survey-pass');option('meng-private-first-choice',s.postReportEvening?.decisions?.meng);
 const q=s.mengshuLeakConfrontation;
 for(const story of [q,s.jiangAliveMorning])if(story?.dayTwoVersion)for(const [key,value] of Object.entries(story.decisions||{}))option('day2-script-'+key,value);
 if(q?.decisions?.intro===0)mark('d2-public');if(q?.decisions?.intro===1)mark('d2-private');if(q?.decisions?.intro===2)mark('d2-silent');
 option('jiang-death-private-question',q?.decisions?.private);
 if(q?.decisions?.public===0)mark('d2-first-right');if(q?.decisions?.public===1)mark('d2-first-wrong');
 const p=s.dayTwoPickup;
 if(p){if(p.phase?.startsWith('d2-solo')||p.phase==='d2-pull')mark('d2-solo');if(['d2-invite','d2-question','d2-reply','d2-reply-0','d2-reply-1','d2-reply-2'].includes(p.phase))mark('d2-invite');for(let i=0;i<3;i++)if(p.phase==='d2-reply-'+i)mark('day2-pickup-linqing-reply-option-'+i);if(p.phase==='d2-solo-yes')mark('d2-honest');if(p.phase==='d2-solo-ok')mark('d2-lie')}
}
function capture(id,route,source=state,branchPoint=false){if(source?.story?.started)return captureStoryNode(id,source,{route,worldline:true,branchPoint})}
// These are real whole-state snapshots taken as the scene is reached, never reconstructed outcomes.
const baseNoodle=noodleRender;noodleRender=function(...args){
 const n=state.story.noodleEvening;
 if(n&&['intro','noWaterIntro'].includes(n.phase))capture('tree-noodles',{view:'noodle-cg',active:null});
 if(n?.phase==='share')capture('tree-share-noodles',{view:'noodle-cg',active:null});
 return baseNoodle(...args);
};
const baseEvening=eveningDecorate;eveningDecorate=function(...args){
 if(state.story.eveningAnomaly?.phase==='post')capture('tree-campus-warning',{view:'chat',active:HG_ID});
 return baseEvening(...args);
};
const baseResults=captureReportResults;captureReportResults=function(...args){
 const result=baseResults(...args),r=state.story.dayOneReport;
 if(result&&state.game.day===1&&r===args[0]&&r?.publicationComplete&&r.resultPublished&&!state.game.survivalEnding&&['songjia','zhao','wen','cheng'].includes(r.groupResult?.target))capture('tree-result-'+r.groupResult.target,{view:'report-input',active:DAY_ONE_REPORT_ID});
 return result;
};
const baseBed=postSleepScene;postSleepScene=function(...args){
 if(state.story.postReportEvening?.phase==='bed')capture('tree-next-day',{view:'post-evening-bed',active:null});
 return baseBed(...args);
};
const baseDeath=zeroDeath;zeroDeath=function(...args){
 if(state.story.dayTwoSoloElevatorDeath)mark('death-005');else if(state.story.dayTwoWrongDormDeath)mark('death-006');
 else if(state.story.pickupCodeDeath)mark('death-003');
 else if(state.story.firstMorning?.phase==='dead')mark('death-002');
 else if(state.game.day===0)mark('death-001');
 return baseDeath(...args);
};
const baseSurveyDeath=surveyDie;surveyDie=function(...args){mark('death-004');return baseSurveyDeath(...args)};
function refreshReached(){
 rememberDayTwoMilestones(state);
 rememberDayFiveMilestones(state);
 if(window.endingGalleryHas?.('007'))mark('death-007');
 if(questionnaireOwnsFailure(state)&&state.story.questionnaire?.phase==='dead')mark('death-004');
 if(view==='zero-death'){
  if(state.story.lateDayDeath?.reason==='departed-reply')mark('death-018');else if(state.story.lateDayDeath?.reason==='day1-songjia-uninformed')mark('death-014');else if(state.story.dayTwoSoloElevatorDeath)mark('death-005');else if(state.story.dayTwoWrongDormDeath)mark('death-006');
  else if(state.story.pickupCodeDeath)mark('death-003');
  else if(state.story.firstMorning?.phase==='dead')mark('death-002');
  else if(state.game.day===0)mark('death-001');
 }
 const records=nodeRecords(),saved=records['day1-report-results-issued'],r=saved?.checkpoint?.story?.dayOneReport;
 if(records['tree-day2-fourth-rules']?.checkpoint)mark('tree-day2-fourth-rules');
 if(r?.publicationComplete&&r.resultPublished&&['songjia','zhao','wen','cheng'].includes(r.groupResult?.target)){
  const id='tree-result-'+r.groupResult.target;
  if(!records[id]){records[id]={...saved,worldline:true};saveNodes(records)}
 }
 const n=state.story.noodleEvening;
 if(n&&['intro','noWaterIntro'].includes(n.phase))capture('tree-noodles',{view:'noodle-cg',active:null});
 if(n?.phase==='share')capture('tree-share-noodles',{view:'noodle-cg',active:null});
 if(state.story.eveningAnomaly?.phase==='post')capture('tree-campus-warning',{view:'chat',active:HG_ID});
 if(state.story.postReportEvening?.phase==='bed')capture('tree-next-day',{view:'post-evening-bed',active:null});
}
function makeGraph(day){
 const g={nodes:[],edges:[],sections:[],height:900,width:0};
 const node=(id,title,col,lane=0,kind='story',record=id)=>{g.nodes.push({id,title,x:72+col*STEP,y:420+lane*ROW,kind,record});return id};
 const edge=(from,to)=>g.edges.push({from,to});
 const bubble=(id,title,col,lane,owner)=>{node(id,title,col,lane,'bubble',owner);return id};
 const options=(from,to,col,lanes,labels,owner=from)=>lanes.forEach((lane,i)=>{const id=from+'-option-'+i; bubble(id,labels[i],col,lane,owner);edge(from,id);edge(id,to)});
 if(day===0){
  g.sections=[{label:'第零日',x:72},{label:'第一日 · 清晨',x:72+6*STEP},{label:'第一日 · 下午',x:72+11*STEP},{label:'第一日 · 夜晚',x:72+21*STEP}];
  node(Z.node,'陈妍邀请前往超市',0);
  bubble('supermarket-yes','一起去超市',1,-1,Z.node);bubble('supermarket-no','留在宿舍',1,0,Z.node);
  node('death-001','被请离 · 结局001',2,-1,'death');node('day0-linqing-reply','回复林晴的提醒',2);
  edge(Z.node,'supermarket-yes');edge('supermarket-yes','death-001');edge(Z.node,'supermarket-no');edge('supermarket-no','day0-linqing-reply');
  node('day0-xuzhixia-reply','回应入群申请',3.6);options('day0-linqing-reply','day0-xuzhixia-reply',3,[-.42,.42],['好','嗯嗯，谢谢你提醒我']);
  bubble('wall-departed-reply','回复已离校的同学',3.6,1.7,'day0-linqing-reply');node('death-018','看来你的好奇心比求生欲更强。',4.6,1.7,'death');edge('day0-linqing-reply','wall-departed-reply');edge('wall-departed-reply','death-018');
  node('day0-supply-opening','物资中心开启',5.2);options('day0-xuzhixia-reply','day0-supply-opening',4.6,[-.42,.42],['看来被请离的人仍然可以发送信息','不要理会这个申请']);
  bubble('supply-none','没买东西',6.2,-1.6,'day1-morning-pickup');bubble('supply-bought','买了东西',6.2,0,'day1-morning-pickup');
  bubble('pickup-none','我昨天根本没买',7.2,-1.6,'day1-morning-pickup');bubble('pickup-later','晚点自己去',7.2,0,'day1-morning-pickup');bubble('pickup-together','一起去',7.2,1.15,'day1-morning-pickup');
  edge('day0-supply-opening','supply-none');edge('day0-supply-opening','supply-bought');edge('supply-none','pickup-none');edge('supply-bought','pickup-later');edge('supply-bought','pickup-together');
  node('day1-jiangxiao-warning','回应江晓提醒',8.2);node('death-002','被请离 · 结局002',8.2,1.15,'death');node('day1-linqing-food','回应林晴食物询问',9.8);
  edge('pickup-later','day1-jiangxiao-warning');edge('pickup-together','death-002');edge('pickup-none','day1-linqing-food');
  options('day1-jiangxiao-warning','day1-linqing-food',9.2,[-.42,.42],['什么意思？可以说清楚一点吗','我凭什么相信你？']);
  node('day1-free-action-start','自由行动选择',11.4);options('day1-linqing-food','day1-free-action-start',10.8,[-.42,.42],['有所隐瞒','如实回答']);
  node('day1-before-pickup','前往取件',12.5);edge('day1-free-action-start','day1-before-pickup');node('tree-skip-pickup','跳过取件',12.5,1.5);edge('day1-free-action-start','tree-skip-pickup');edge('tree-skip-pickup','tree-noodles');
  bubble('code-wrong','取件码错误',13.5,-1.5,'day1-before-pickup');bubble('code-right','取件码正确',13.5,0,'day1-before-pickup');
  node('death-003','被请离 · 结局003',14.5,-1.5,'death');node('tree-noodles','拿出泡面',14.5);
  edge('day1-before-pickup','code-wrong');edge('code-wrong','death-003');edge('day1-before-pickup','code-right');edge('code-right','tree-noodles');
  bubble('has-water','有水',15.5,0,'tree-noodles');bubble('no-water','没水',15.5,1.5,'tree-noodles');
  node('noodle-choice-borrow','借烧水壶',16.5);node('noodle-choice-noWaterChoice','收起泡面',16.5,1.5);
  edge('tree-noodles','has-water');edge('tree-noodles','no-water');edge('has-water','noodle-choice-borrow');edge('no-water','noodle-choice-noWaterChoice');
  node('noodle-choice-taste','林晴：味道怎么样？',18.1);options('noodle-choice-borrow','noodle-choice-taste',17.5,[-.42,.42],['选项一','选项二']);
  bubble('taste-alone','很好吃',19.1,0,'noodle-choice-taste');bubble('taste-share','你要不要尝尝？',19.1,.85,'noodle-choice-taste');
  node('tree-share-noodles','和林晴一起吃泡面',20.1,.85);node('tree-campus-warning','校园墙取件提醒',21.3);
  edge('noodle-choice-taste','taste-alone');edge('noodle-choice-taste','taste-share');edge('taste-share','tree-share-noodles');edge('tree-share-noodles','tree-campus-warning');edge('taste-alone','tree-campus-warning');edge('noodle-choice-noWaterChoice','tree-campus-warning');
  node('day1-questionnaire-before-notice','？？？问卷',22.4);edge('tree-campus-warning','day1-questionnaire-before-notice');
  bubble('survey-fail','问卷回答错误',23.4,-1.2,'day1-questionnaire-before-notice');bubble('survey-pass','完成问卷',23.4,0,'day1-questionnaire-before-notice');
  node('death-004','被请离 · 结局004',24.4,-1.2,'death');node('day1-report-results-issued','检举结果发放',25.6);
  edge('day1-questionnaire-before-notice','survey-fail');edge('survey-fail','death-004');edge('day1-questionnaire-before-notice','survey-pass');node('day1-before-report','第一日检举开始前',24.4);edge('survey-pass','day1-before-report');edge('day1-before-report','day1-report-results-issued');
  node('meng-private-first-choice','孟舒私聊',28.2);
  ['songjia','zhao','wen','cheng'].forEach((key,i)=>{const id='tree-result-'+key;node(id,['宋出局','赵出局','温出局','程出局'][i],26.9,(i-1.5)*.85);edge('day1-report-results-issued',id);edge(id,'meng-private-first-choice')});
  node('tree-next-day','第一日夜间结算',29.8);options('meng-private-first-choice','tree-next-day',29.2,[-.42,.42],['她没和我说过什么','如实回答']);
  node('death-014','学生会清理 · 结局014',31,-1.1,'death');edge('tree-next-day','death-014');
 }else if(day===1&&typeof makeDayTwoWorldline==='function'){
  return makeDayTwoWorldline();
 }else if(day===2&&typeof makeDayThreeWorldline==='function'){
  return makeDayThreeWorldline();
 }else if(day===3&&typeof makeDayFourWorldline==='function'){
  return makeDayFourWorldline();
 }else if(day===4&&typeof makeDayFiveWorldline==='function'){
  return makeDayFiveWorldline();
 }else{
  g.sections=[{label:groups[day],x:72}];node('future-'+day,'尚未解锁',0);g.placeholder=true;
 }
 g.width=Math.max(1000,...g.nodes.map(n=>n.x+W+100));return g;
}
const basePickup=pickup16Render;pickup16Render=function(...args){
 const p=state.story.dayTwoPickup;
 if(state.game.day===2&&p?.phase==='input')capture('tree-day2-counter',{view:'afternoon-pickup',active:null});
 return basePickup(...args);
};
// A successful pickup is captured by persist.
function captureDayTwoWorldline(){
 rememberDayTwoMilestones(state);
 if(state.game.day!==2||typeof makeDayTwoWorldline!=='function')return;
 const q=state.story.jiangAliveMorning?.dayTwoVersion?state.story.jiangAliveMorning:state.story.mengshuLeakConfrontation,lin=state.story.linAfterConflict,p=state.story.dayTwoPickup;
 const authoredChat=q?.dayTwoVersion?DAY_TWO_AUTHORED[q.script]?.chat:null,qChat=authoredChat==='meng'?POST_MENG_ID:authoredChat==='jiang'?JX.id:HG_ID;
 for(const n of makeDayTwoWorldline().nodes){
  let route=null;
  if(n.script&&q?.dayTwoVersion&&q.script===n.script)route={view:'chat',active:qChat};
  if(n.linScript&&lin?.script===n.linScript)route={view:'chat',active:'linqing'};
  if(n.pickupPhase&&p?.phase===n.pickupPhase)route={view:p.phase==='d2-solo-chat'?'chat':'afternoon-pickup',active:p.phase==='d2-solo-chat'?'linqing':null};
  if(n.checkpoint==='debateDone'&&q?.kind==='death'&&q.phase==='done'&&linAfterPublicWarningKnown()&&!lin&&!p)route={view:'chat',active:qChat};
  if(n.checkpoint==='morningDone'&&state.story.secondMorningMainReady&&!p)route={view:'home',active:null};
  if(n.checkpoint==='floorDone'&&p?.done&&p.elevatorSolved&&!p.failed)route={view:'home',active:null};
  if(n.checkpoint==='middayDone'&&state.story.dayTwoFreeAction?.finished)route={view:'home',active:null};
  if(n.checkpoint==='pickupCommon'&&state.story.secondDayPickupCommonReady)route={view:'home',active:null};
  if(n.checkpoint==='eveningDepartures'&&state.story.dayTwoEvening?.departuresApplied)route={view:'home',active:null};
  if(n.checkpoint==='eveningExplore'&&state.story.dayTwoEvening?.exploreStarted)route={view:'home',active:null};
  if(n.checkpoint==='eveningHelp'&&state.story.dayTwoEvening?.helpStarted)route={view:'home',active:null};
  const evening=state.story.dayTwoEvening;
  if(n.eveningScript&&evening?.script===n.eveningScript&&evening.phase==='choice')route={view:'chat',active:'linqing'};
  if(n.checkpoint==='eveningReflection'&&evening&&(evening.reflectionIndex!==undefined||evening.toldLin))route={view:'day2-evening-cg',active:null};
  if(n.checkpoint==='eveningGive'&&evening?.decisions?.eveningLinFood===0)route={view:'chat',active:'linqing'};
  if(n.checkpoint==='eveningWorry'&&evening?.decisions?.eveningLinFood===1)route={view:'chat',active:'linqing'};
  if(n.checkpoint==='eveningSnacks'&&evening?.decisions?.eveningLinEmpty!==undefined)route={view:'chat',active:'linqing'};
  if(n.checkpoint==='eveningLinDone'&&evening?.result==='eveningLinDone')route={view:'chat',active:'linqing'};
  const visit=state.story.dayTwoVisit;
  if(n.checkpoint==='visitStart'&&visit)route={view:'day2-visit-cg',active:null};
  if(n.checkpoint==='visitJiang'&&visit?.jiangAlive&&(['jiang','back'].includes(visit.scene)||visit.done))route={view:'day2-visit-cg',active:null};
  if(n.checkpoint==='visitZhou'&&visit&&!visit.jiangAlive&&(['zhou','tears','back'].includes(visit.scene)||visit.done))route={view:'day2-visit-cg',active:null};
  if(n.checkpoint==='visitBack'&&(visit?.scene==='back'||visit?.done))route={view:'day2-visit-cg',active:null};
  if(n.checkpoint==='secondReportOpen'&&state.story.dayTwoReport?.phase==='open')route={view:'day2-report-start',active:DAY_ONE_REPORT_ID};
  if(n.checkpoint==='secondReportResult'&&state.story.dayTwoReport?.publicationComplete)route={view:'report-input',active:DAY_ONE_REPORT_ID};
  const night=state.story.dayTwoNight;
  if(n.checkpoint==='nightGroup'&&night&&night.target!=='mengshu'&&night.phase!=='group-wait')route={view:'chat',active:HG_ID};
  if(n.checkpoint==='nightExplore'&&night&&['explore','bed','failed','midnight-wait','midnight-notice','midnight-reading'].includes(night.phase))route={view:'home',active:null};
  if(n.checkpoint==='nightBed'&&night&&['bed','failed','midnight-wait','midnight-notice','midnight-reading'].includes(night.phase))route={view:'day2-night-bed',active:null};
  if(n.checkpoint==='fourthRules'&&night?.rulesNotified)route={view:'post',active:'chapter-four-midnight-rules'};
  if(route){if(!n.replayable)mark(n.id);else if(n.script?q.phase==='choice':n.linScript?lin.phase==='choice':true)capture(n.id,route,state,true)}
 }
 if(q?.kind==='death'&&q.phase==='done'&&linAfterPublicWarningKnown())mark(state.story.noodleEvening?.choices?.taste===1?'d2-shared-noodles':'d2-no-shared-noodles');
 for(const [key,value] of Object.entries(lin?.decisions||{}))mark('tree-day2-'+key+'-option-'+value);
 const evening=state.story.dayTwoEvening;
 if(evening?.toldLin)mark('d2-evening-has-'+(evening.hasFood?'Food':'Empty'));
 if(state.story.dayTwoVisit)mark(state.story.dayTwoVisit.jiangAlive?'d2-visit-jiang-alive':'d2-visit-jiang-dead');
 const night=state.story.dayTwoNight;
 if(night){mark('d2-night-vote-'+night.target);if(['failed','midnight-wait','midnight-notice','midnight-reading'].includes(night.phase))mark('d2-night-sleep-'+night.target)}
 for(const key of ['Food','Empty'])if(evening?.decisions?.['eveningLin'+key]!==undefined)mark('tree-day2-eveningLin'+key+'-option-'+evening.decisions['eveningLin'+key]);
 for(const [key,value] of Object.entries(state.story.dayTwoFreeAction?.cg?.decisions||{}))mark('d2-midday-'+key+'-'+value);
 if(p){
  const phase=p.phase;
  if(['d2-invite','d2-question','d2-reply'].includes(phase)||phase.startsWith('d2-reply-'))mark('d2-pickup-option-0');
  if(phase.startsWith('d2-solo-')||phase==='d2-pull')mark('d2-pickup-option-1');
  if(phase==='d2-reassure-answer')mark('d2-reassure');if(phase==='d2-solo-answer')mark('d2-lin-arrives-reply');
  if(p.received)mark('d2-code-right');if(state.story.pickupCodeDeath)mark('d2-code-wrong');
  if(p.elevatorSolved)mark('d2-floor-selected');if(state.story.dayTwoWrongDormDeath)mark('d2-room-wrong');
 }
}
// Historical archives remain separate from current-route discovery.
const basePersist=persist;persist=function(...args){
 captureDayTwoWorldline();
 if(!window.mobileLaunch&&!['game-menu','nodes'].includes(view))rememberBranches(state);
 const skipped=state.story.afternoonPickup;if(state.game.day===1&&skipped?.done&&!skipped.failed&&!skipped.orderIds?.length&&!state.story.noodleEvening)capture('tree-skip-pickup',{view:'home',active:null});
 const p=state.story.dayTwoPickup;
 if(state.game.day===2&&p?.done&&p.elevatorSolved&&!p.failed)mark('tree-day2-finish');
 return basePersist(...args);
};
function unlocked(n,records){return n.kind==='start'?true:n.kind==='death'?(!n.routeRecord||!!discovered[n.routeRecord])&&(!!discovered[n.id]||!!window.endingGalleryHas?.(n.id)):n.kind==='bubble'?!!discovered[n.id]:n.replayable===false?!!discovered[n.id]||!!records[n.record]?.checkpoint:!!records[n.record]?.checkpoint}
function visibleGraph(full,records){
 // All unexplored routes have the same neutral frontier. Nothing beyond its first lock is rendered.
 const known=new Set(full.nodes.filter(n=>unlocked(n,records)).map(n=>n.id));
 const incoming=new Set(full.edges.map(e=>e.to)),visible=new Set(known);
 for(const n of full.nodes)if(!incoming.has(n.id))visible.add(n.id);
 for(const e of full.edges)if(known.has(e.from))visible.add(e.to);
 const nodes=full.nodes.filter(n=>visible.has(n.id)).map(n=>known.has(n.id)?n:{...n,kind:'hidden',record:null,title:'尚未解锁'});
 const edges=full.edges.filter(e=>known.has(e.from)&&visible.has(e.to));
 const width=Math.max(1000,...nodes.map(n=>n.x+W+100));
 return {...full,nodes,edges,width,sections:full.sections.filter(s=>s.x<width-100)};
}
function path(a,b){
 const x1=a.x+(['bubble','hidden'].includes(a.kind)?BW:W),y1=a.y,x2=b.x,y2=b.y;
 if(x2-x1>STEP)return `M${x1} ${y1} H${x2-130} C${x2-60} ${y1},${x2-90} ${y2},${x2} ${y2}`;
 const bend=Math.max(32,Math.min(110,(x2-x1)*.45));
 return `M${x1} ${y1} C${x1+bend} ${y1},${x2-bend} ${y2},${x2} ${y2}`;
}
function treeConnectors(g){
 const nodes=Object.fromEntries(g.nodes.map(n=>[n.id,n])),incoming=new Map(),lines=[];
 for(const edge of g.edges){if(!incoming.has(edge.to))incoming.set(edge.to,[]);incoming.get(edge.to).push(edge.from)}
 for(const [to,from] of incoming){
  const target=nodes[to];
  if(!g.independentMerges||from.length<2){for(const id of from)lines.push({from:[id],to,d:path(nodes[id],target)});continue}
  // Match Day 1's soft curves. Every route bends after the last source bubble.
  // Identical control-point x positions keep the vertical order until the shared endpoint.
  const rightmost=Math.max(...from.map(id=>nodes[id].x+(['bubble','hidden'].includes(nodes[id].kind)?BW:W)));
  const width=Math.max(32,Math.min(240,target.x-rightmost-16)),start=target.x-width,bend=width*.5;
  for(const id of from){
   const source=nodes[id],x=source.x+(['bubble','hidden'].includes(source.kind)?BW:W),y=source.y;
   lines.push({from:[id],to,d:'M'+x+' '+y+' H'+start+' C'+(start+bend)+' '+y+','+(target.x-bend)+' '+target.y+','+target.x+' '+target.y});
  }
 }
 return lines;
}
const lockSVG='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="10" width="12" height="10" rx="3"/><path d="M8 10V7a4 4 0 018 0v3M12 14v2"/></svg>';
const chatSVG='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h12a3 3 0 013 3v7a3 3 0 01-3 3h-7l-5 4v-4a3 3 0 01-3-3V7a3 3 0 013-3Z"/><path d="M8 10h.01M12 10h.01M16 10h.01"/></svg>';
function render(){
 if(!['game-menu','nodes'].includes(view))return;
 refreshReached();view='nodes';active=null;rememberRoute();graph=makeGraph(selectedDay);
 graph.nodes=graph.nodes.map(n=>n.kind==='bubble'?n:{...n,title:treeEventTitle(n.title)});
 graph.sections=graph.sections.map(section=>({...section,label:treeEventTitle(section.label)}));
 const records=nodeRecords(),byId={};Object.values(records).forEach(r=>rememberBranches(r.checkpoint));rememberBranches(state);graph=visibleGraph(graph,records);graph.nodes.forEach(n=>byId[n.id]=n);
 const lines=treeConnectors(graph).map(e=>{const b=byId[e.to],reached=e.from.some(id=>unlocked(byId[id],records))&&unlocked(b,records);return `<path class="${reached?'reached':'unexplored'} ${b.category==='hidden'?'hidden-ending':b.category==='survival'?'survival':b.kind==='death'?'death':''}" d="${e.d}"/>`}).join('');
 const cards=graph.nodes.map(n=>{
  const ready=unlocked(n,records),isBubble=n.kind==='bubble'||n.kind==='hidden',death=n.kind==='death',jumpable=ready&&!death&&n.kind!=='start'&&n.replayable!==false,title=ready?n.title:'尚未解锁';
  if(isBubble)return `<span class="choice-tree-bubble ${ready?'visited':'locked'}" style="left:${n.x}px;top:${n.y-BH/2}px" tabindex="0" role="img" aria-label="${esc(title)}" data-tip="${esc(title)}">${ready?chatSVG:lockSVG}</span>`;
  return `<button type="button" class="choice-tree-node ${ready?'visited':'locked'} ${death?(n.category==='hidden'?'hidden-ending':n.category==='survival'?'death survival':'death'):''}" style="left:${n.x}px;top:${n.y-H/2}px" ${jumpable?`data-tree-jump="${esc(n.record)}"`:'disabled'} aria-label="${esc(title+(death?'，结局终点，不能跳转':''))}"><i class="tree-dot">${ready?(n.category==='hidden'?'♥':''):lockSVG}</i><span><small>${death?(n.category==='hidden'?'END · 隐藏结局':'END · 无法跳转'):selectedDay===0?(n.x<72+6*STEP?'第零日':'第一日'):groups[selectedDay]}</small><strong>${ready?esc(n.title):'？'}</strong></span>${jumpable?'<b aria-hidden="true">›</b>':''}</button>`;
 }).join('');
 screen.innerHTML=`<section class="choice-tree-page"><header class="choice-tree-top"><div class="choice-tree-heading"><div><h1>再一次抉择</h1><p>从左向右，重走曾经抵达的故事。</p></div></div><nav class="choice-tree-days" style="grid-template-columns:1.65fr repeat(${availableDays.length-1},minmax(0,1fr))" aria-label="按天切换剧情导图">${availableDays.map(i=>`<button type="button" data-tree-day="${i}" aria-current="${selectedDay===i}">${groups[i]}</button>`).join('')}</nav>${treeSectionDirectory(graph)}</header><div class="choice-tree-viewport"><div class="choice-tree-canvas" style="width:${graph.width}px;height:${graph.height}px"><svg class="choice-tree-lines" width="${graph.width}" height="${graph.height}" aria-hidden="true">${lines}</svg>${graph.sections.map(s=>`<div class="choice-tree-section" style="left:${s.x}px"><span>${s.label}</span><i></i></div>`).join('')}${cards}${graph.placeholder?'<p class="choice-tree-pending">故事尚未抵达这一天</p>':''}</div><div class="choice-tree-legend"><span>已抵达</span><span>未解锁</span><span>结局终点</span></div><div class="choice-tree-controls"><button type="button" data-tree-zoom="in" aria-label="放大">＋</button><button type="button" data-tree-zoom="out" aria-label="缩小">－</button><button type="button" class="tree-reset" data-tree-reset>回到起点</button></div><div class="choice-tree-direction">拖动查看 · 双指缩放 <span>时间向右 →</span></div></div><footer class="choice-tree-footer"><button type="button" class="secondary" data-action="zero-menu">返回主页</button></footer></section>`;
 bind();requestAnimationFrame(()=>{if(positions[selectedDay]){transform={...positions[selectedDay]};apply()}else reset()});
}
function apply(){const canvas=screen.querySelector('.choice-tree-canvas');if(canvas)canvas.style.transform=`translate(${transform.x}px,${transform.y}px) scale(${transform.scale})`;positions[selectedDay]={...transform};treeSectionHighlight(screen,graph,transform)}
function reset(){const el=screen.querySelector('.choice-tree-viewport');if(!el)return;transform={scale:.82,x:18,y:el.clientHeight*.48-(graph?.focusY||420)*.82};apply()}
function zoom(factor,x,y){const el=screen.querySelector('.choice-tree-viewport');if(!el)return;x=x??el.clientWidth/2;y=y??el.clientHeight/2;const old=transform.scale,next=Math.max(.3,Math.min(1.6,old*factor));transform.x=x-(x-transform.x)*next/old;transform.y=y-(y-transform.y)*next/old;transform.scale=next;apply()}
function jump(id){
 if(id==='tree-next-day'){
  if(view==='nodes'&&availableDays.includes(1)){positions[selectedDay]={...transform};selectedDay=1;delete positions[1];render()}
  return;
 }
 if(selectedDay===1&&!makeGraph(1).nodes.some(n=>n.record===id&&n.replayable))return;
 if(view==='nodes')loadStoryNode(id);
}
function bind(){
 const el=screen.querySelector('.choice-tree-viewport');let pointers=new Map(),drag=null,pinch=null;
 el.addEventListener('wheel',e=>{e.preventDefault();const box=el.getBoundingClientRect();zoom(e.deltaY<0?1.12:.89,e.clientX-box.left,e.clientY-box.top)},{passive:false});
 el.addEventListener('pointerdown',e=>{if(e.target.closest('.choice-tree-controls'))return;dragged=false;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(!e.target.closest('button,[role="img"]'))el.setPointerCapture(e.pointerId);if(pointers.size===1){drag={x:e.clientX,y:e.clientY,tx:transform.x,ty:transform.y};el.classList.add('dragging')}else if(pointers.size===2){const [a,b]=[...pointers.values()];pinch={distance:Math.max(1,Math.hypot(a.x-b.x,a.y-b.y)),scale:transform.scale};drag=null}});
 el.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===2&&pinch){dragged=true;const [a,b]=[...pointers.values()],box=el.getBoundingClientRect();zoom(pinch.scale*Math.hypot(a.x-b.x,a.y-b.y)/pinch.distance/transform.scale,(a.x+b.x)/2-box.left,(a.y+b.y)/2-box.top)}else if(drag){const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>6)dragged=true;if(dragged){el.setPointerCapture(e.pointerId);transform.x=drag.tx+dx;transform.y=drag.ty+dy;apply()}}});
 const end=e=>{pointers.delete(e.pointerId);pinch=null;if(pointers.size===1){const p=[...pointers.values()][0];drag={x:p.x,y:p.y,tx:transform.x,ty:transform.y}}else{drag=null;el.classList.remove('dragging')}};
 el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end);
 el.addEventListener('click',e=>{const b=e.target.closest('[data-tree-jump]');if(b&&!dragged)jump(b.dataset.treeJump)});
 screen.querySelectorAll('[data-tree-section]').forEach(b=>b.onclick=()=>{const next=treeSectionPosition(graph,Number(b.dataset.treeSection),el.clientHeight,transform.scale);if(next){transform=next;apply()}});
 screen.querySelectorAll('[data-tree-day]').forEach(b=>b.onclick=()=>{positions[selectedDay]={...transform};selectedDay=Number(b.dataset.treeDay);render()});
 screen.querySelector('[data-tree-zoom="in"]').onclick=()=>zoom(1.2);screen.querySelector('[data-tree-zoom="out"]').onclick=()=>zoom(.82);screen.querySelector('[data-tree-reset]').onclick=reset;
}
captureDayTwoWorldline();
refreshReached();
zeroNodes=render;actions['zero-nodes']=render;
})();
