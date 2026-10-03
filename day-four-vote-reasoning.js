/* Six-stage deduction, using the existing reasoning shell and controls. */
const D4_VOTE_STEPS=['人数','阵营票','初始票数','票数变化','照片','验证'];
const D4_VOTE_WORDS=['10名学生会','9张阵营票','知道彼此身份','普通生的浮动票','沈可欣'];
const D4_VOTE_TITLES=['第四日还剩多少名学生会？','如果一名委托人是学生会，她最多拥有多少张阵营票？','重新观察委托行动刚开放时的票数','这些票曾经动摇过吗？','照片出现后，哪些票发生了变化？','沈可欣的说法能够成立吗？'];
function d4VoteReason(){return state.story.dayFourVoteReasoning??={step:0,crossed:[],delegate:null,support:[],selected:null,slider:0,timeline:0,photoIndex:0,photoRemaining:500,answers:{},hypothesis:[],slots:[],slot:0,result:false,sub:'hypothesis',feedback:'',done:false}}
function d4VoteWordOrder(){
 const q=d4VoteReason();if(q.wordOrder)return q.wordOrder;
 const order=D4_VOTE_WORDS.map((_,i)=>i);
 for(let i=order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]]}
 if(order.every((n,i)=>n===i))order.push(order.shift());
 q.wordOrder=order;return order;
}
function d4VoteReasonReady(){return state.game.day===4&&d4Counter()?.phase==='reasoning'}
function d4VoteFormat(text){return esc(d4DebateText(text)).replace(/固定票/g,'<span class="vote-fixed-label">固定票</span>').replace(/浮动票/g,'<span class="vote-floating-label">浮动票</span>')}
function d4VoteOptions(key,labels){const q=d4VoteReason();return '<div class="reason-picker vote-options">'+labels.map((label,i)=>'<button class="'+(q.answers[key]===i?'selected':'')+'" data-vr-answer="'+i+'" data-vr-key="'+key+'" aria-pressed="'+(q.answers[key]===i)+'"><span class="vote-option-index" aria-hidden="true">'+String.fromCharCode(65+i)+'</span><span class="vote-option-copy">'+d4VoteFormat(label)+'</span><span class="vote-option-check" aria-hidden="true">'+icon('check')+'</span></button>').join('')+'</div>'}
function d4VotePeople(count){const q=d4VoteReason();return '<div class="vote-people">'+Array.from({length:count},(_,i)=>{
 const crossed=q.crossed.includes(i),assigned=q.delegate===i||q.support.includes(i);
 return '<button type="button" class="vote-person '+(q.step===0&&crossed?'crossed ':'')+(q.step===0&&q.result&&!crossed?'gold ':'')+(q.step===1&&assigned?'assigned ':'')+(q.selected===i?'selected':'')+'" '+(q.step===0&&q.result||q.step===1&&assigned?'disabled':'')+' '+(q.step===1?'draggable="true" ':'')+'data-vr-person="'+i+'" aria-label="'+(i+1)+'号学生会成员'+(crossed?'，已划去':'')+'">'+icon('user')+(crossed&&q.step===0?'<b>×</b>':'')+'</button>';
 }).join('')+'</div>'}
function d4VoteTickets(n,{locked=false}={}){return '<div class="vote-tickets">'+Array.from({length:Math.max(0,n)},(_,i)=>'<i class="vote-ticket '+(i<9?'fixed':'floating')+'" style="--ticket-index:'+i+'">'+(i<9&&locked?icon('lock'):'')+'</i>').join('')+'</div>'}
function d4VoteTally(point,locked=false){return '<div class="vote-tally-pair"><article><span>沈可欣</span><strong>'+point.shen+'</strong>'+d4VoteTickets(point.shen,{locked})+'</article><article><span>'+esc(state.profile.name)+'</span><strong>'+point.me+'</strong><div class="vote-tickets">'+Array.from({length:point.me},()=>'<i class="vote-ticket floating"></i>').join('')+'</div></article></div>'}
function d4VoteTimeline(){return d4Counter().history.filter(p=>!['目击指控后','同伴关系遭质疑后','照片公开后','照片引发的委托变化'].includes(p.label))}
function d4VotePhotoFrames(){const q=d4Counter(),frames=[{label:'指控前',...q.before}];let s=q.before.shen,p=q.before.me;while(s<16&&p>3){s++;p--;frames.push({label:'委托转向沈可欣',shen:s,me:p})}if(s!==16||p!==3)frames.push({label:q.withdrawn?'另有1份委托撤回，暂未委托':'委托变化结束',shen:16,me:3});return frames}
// Render the saved playback position instead of restarting a CSS animation.
function d4VotePhotoFlightStyle(){
 const q=d4VoteReason(),p=Math.max(0,Math.min(1,1-q.photoRemaining/500));
 return 'opacity:'+Math.min(1,p/.15,(1-p)/.15)+';transform:translateX('+(-190*(p*p*(3-2*p)))+'px)';
}
function d4VotePhotoFlight(){
 const q=d4VoteReason(),count=Math.max(0,d4Counter().before.me-3);
 return '<div class="vote-flight" aria-hidden="true">'+(q.photoIndex<count?'<i class="vote-ticket floating" style="'+d4VotePhotoFlightStyle()+'"></i>':'')+'</div>';
}
function d4VoteResult(text){return '<div class="reason-note confirmed">'+d4VoteFormat(text).replace(/\n/g,'<br>')+'</div>'}
function d4VoteBody(){
 const q=d4VoteReason();if(q.done)return '<div class="vote-complete"><div class="vote-final-tickets">'+d4VoteTickets(9,{locked:true})+'</div><h2>推理完成</h2><p>如果你是学生会推出来争夺委托权的人——<br>那九张最稳定的学生会票<br>为什么从未属于你？</p><div class="reason-note">获得反击结论：<br><strong>真正拥有学生会固定票仓的人，是沈可欣</strong></div></div>';
 let html='<div class="vote-stage-label">'+D4_VOTE_STEPS[q.step]+'</div><h2>'+D4_VOTE_TITLES[q.step]+'</h2>';
 if(q.step===0)return html+'<div class="vote-population-stat"><span>身份分配时<small>学生会人数</small></span><strong>13</strong></div>'+d4VotePeople(13)+'<p class="reason-copy">请点击划去被请离的人数（已划去 '+q.crossed.length+' 人）</p>'+(q.result?d4VoteResult('已确认：\n第四日仍有10名学生会。'):q.crossed.length===3?'<h3>第四日仍然存活的学生会人数是：</h3>'+d4VoteOptions('count',['9人','10人','11人','无法判断']):'');
 if(q.step===1)return html+'<div class="reason-note">学生会拥有内部群聊，并且知道彼此的身份。<br>委托人不能将票委托给自己。</div><p class="reason-copy">将一人拖入“委托人”，再把其他人拖入委托区域。也可点击成员后点击区域。</p>'+d4VotePeople(10)+'<div class="vote-drop-grid"><button class="vote-drop" data-vr-drop="delegate">委托人<br><strong>'+(q.delegate===null?'拖入一名成员':(q.delegate+1)+'号成员')+'</strong></button><button class="vote-drop" data-vr-drop="support">可以委托给她<br><strong>'+q.support.length+' / 9 人</strong></button></div>'+(q.result?d4VoteResult('10名学生会－委托人本人＝9份委托\n一名学生会委托人\n理论上可以获得另外9名学生会的固定支持。'):'');
 if(q.step===2)return html+'<div class="vote-initial-board"><small>09:37</small>'+[['沈可欣',12],['黄依依',2],[state.profile.name,0]].map(([name,count])=>'<div><span>'+esc(name)+'</span><strong>'+count+'<small>票</small></strong></div>').join('')+'</div><p class="reason-copy">假设沈可欣是学生会。<br>她最初的12票中，最多有多少票可以来自同阵营成员？</p>'+(q.result?d4VoteTickets(12)+d4VoteResult('可能的阵营票　9\n来源未知的票　3')+'<p class="reason-copy">这还不能证明沈可欣是学生会。<br>需要继续观察这9张票是否真的表现出“阵营票”的特征。</p>':'<p class="vote-drag-hint" id="vote-slider-hint"><span aria-hidden="true">↔</span>左右拖动滑块，选择票数</p><label class="vote-range">0 <input aria-label="可能的阵营票数量" aria-describedby="vote-slider-hint" data-vr-range="slider" type="range" min="0" max="12" step="1" value="'+q.slider+'"> 12</label><output data-vr-value>'+q.slider+'</output>');
 if(q.step===3){const history=d4VoteTimeline(),index=Math.min(q.timeline,history.length-1),point=history[index];return html+'<p class="vote-legend"><span class="vote-fixed-label">固定票</span> · <span class="vote-floating-label">浮动票</span></p><div data-vr-timeline-tally>'+d4VoteTally(point,q.result)+'</div><p data-vr-timeline-label class="reason-copy">'+esc(point.label)+'</p><p class="vote-drag-hint" id="vote-timeline-hint"><span aria-hidden="true">↔</span>左右拖动进度条，查看各阶段票数变化</p><input class="vote-range-input" aria-label="回放票数时间轴" aria-describedby="vote-timeline-hint" data-vr-range="timeline" type="range" min="0" max="'+(history.length-1)+'" step="1" value="'+index+'">'+(q.result?d4VoteResult('发现异常：\n无论出现什么证据\n无论沈可欣的说法产生多少矛盾\n这9份委托从未动摇'):'<h3>沈可欣的票数变化中，最异常的部分是——</h3>'+d4VoteOptions('stable',['她最初拥有12票','她始终保有至少9票','她曾经失去普通生的委托','她的票数有时比玩家更少']))}
 if(q.step===4){const frames=d4VotePhotoFrames(),point=frames[Math.min(q.photoIndex,frames.length-1)];return html+'<p class="vote-legend"><span class="vote-fixed-label">固定票</span> · <span class="vote-floating-label">浮动票</span></p><div class="vote-photo-replay"><div data-vr-photo-tally>'+d4VoteTally(point,true)+'</div>'+d4VotePhotoFlight()+'<p class="reason-copy" data-vr-photo-label>'+esc(point.label)+'</p></div>'+(q.result?d4VoteResult('已确认：\n被照片影响并转移的，是会被公开信息动摇的普通生浮动票。'):'<h3>照片最有可能改变的是谁的判断？</h3>'+d4VoteOptions('photo',['学生会','普通生','沈可欣']))}
 if(q.sub==='assemble'){
 const before=['第四日仍有','除去委托人本人，其余成员最多可以提供','学生会','照片出现后，从玩家处流失的是','真正始终获得固定阵营支持的人是'],after=['。','。','，不会因为照片动摇自己的委托。','。','。'];
 return html+'<h3>最终拼接推理</h3><div class="reason-sentence">'+before.map((s,i)=>'<p>'+s+'<button class="reason-slot '+(q.slots[i]?'filled':'')+(q.slot===i?' selected':'')+'" data-vr-slot="'+i+'">'+d4VoteFormat(q.slots[i]||'选择词条')+'</button>'+after[i]+'</p>').join('')+'</div><div class="vote-word-bank">'+d4VoteWordOrder().map(i=>'<button data-vr-word="'+i+'">'+d4VoteFormat(D4_VOTE_WORDS[i])+'</button>').join('')+'</div>';
 }
 return html+'<div class="reason-note">沈可欣的指控：<p>“'+esc(state.profile.name)+'是学生会。”</p><p>“她申请成为委托人，是为了骗走普通生的票。”</p></div><div class="vote-hypotheses"><b>假设A：你是学生会</b><span>假设B：你是普通生</span></div><p class="reason-copy">先验证假设A：如果你是学生会——</p>'+[['其他学生会成员','你的身份。',['知道','不知道']],['她们应该将','交给你。',['固定票','浮动票']],['照片出现后，她们','转移自己的票。',['会','不会']]].map(([before,after,options],i)=>'<div class="vote-hypothesis-row"><p>'+before+'</p><div>'+options.map((word,j)=>'<button class="reason-slot '+(q.hypothesis[i]===j?'selected':'')+'" data-vr-hypothesis="'+i+'" data-vr-value="'+j+'">'+d4VoteFormat(word)+'</button>').join('')+'</div><p>'+after+'</p></div>').join('')+(q.result?d4VoteResult('假设无法解释当前票数。\n你从未得到学生会应有的固定支持。\n沈可欣却始终拥有9张不会动摇的委托。'):'');
}
function d4VoteAction(){
 const q=d4VoteReason(),kind=q.done?'return':q.result?q.step===5?'assemble':'continue':'verify';
 const [label,symbol]={verify:['提交验证','search'],continue:['继续推理','check'],assemble:['最终拼接推理','note'],return:['结束推理，返回群聊','chat']}[kind];
 return '<button type="button" class="reason-primary vote-action" data-action="d4-vote-reason-next" data-kind="'+kind+'"><span class="vote-action-icon" aria-hidden="true">'+icon(symbol)+'</span><span class="vote-action-label">'+label+'</span><span class="vote-action-arrow" aria-hidden="true">'+icon('back')+'</span></button>';
}
function d4VoteReasonPanel(){
 if(!d4VoteReasonReady())return;const q=d4VoteReason(),stage=q.step+':'+q.sub+':'+q.done,oldPage=screen.querySelector('.vote-reason-page');
 const scrollTop=view==='day4-vote-reasoning'&&oldPage?.dataset.vrStage===stage?oldPage.querySelector('.reason-main').scrollTop:0;
 closeSheet();stopReading();view='day4-vote-reasoning';active=null;rememberRoute();zeroChrome();status();
 const caps=d3ReasoningCapabilities();screen.innerHTML='<section class="reason-page vote-reason-page '+(caps.reduce?'reason-no-motion':'')+'"><header class="reason-head"><div><span class="vote-page-kicker">第四日</span><h1>票数逆推</h1></div><div class="vote-page-counter"><strong>'+String(q.step+1).padStart(2,'0')+'</strong><span>/ 06</span></div></header><nav class="reason-progress" aria-label="推理进度">'+D4_VOTE_STEPS.map((s,i)=>'<span class="'+(i===q.step?'current':i<q.step?'done':'')+'" '+(i===q.step?'aria-current="step"':'')+'><i aria-hidden="true"></i><small>'+s+'</small></span>').join('')+'</nav><main class="reason-main">'+d4VoteBody()+'</main><footer class="reason-footer vote-action-footer"><p class="reason-feedback" role="status">'+esc(q.feedback)+'</p>'+d4VoteAction()+'</footer></section>';
 screen.querySelector('.vote-reason-page').dataset.vrStage=stage;screen.querySelector('.reason-main').scrollTop=scrollTop;
 if(!q.captured){q.captured=true;d4CaptureCheckpoint('day4-vote-reasoning',{view,active:null})}persist();refreshPhoneBack();
}
function d4VoteReasonNext(){
 if(!d4VoteReasonReady()||view!=='day4-vote-reasoning')return;const q=d4VoteReason();
 if(q.done){d4Counter().phase='done';persist();openChat(HG_ID);if(typeof d4FinalBegin==='function')d4FinalBegin();return}
 if(q.result){if(q.step===5){q.sub='assemble';q.result=false}else{q.step++;q.result=false}q.feedback='';persist();d4VoteReasonPanel();return}
 let correct=false,error='';
 if(q.step===0){correct=q.crossed.length===3&&q.answers.count===1;error='这里只计算已经确认身份为学生会的请离者。普通生的离开不能算在其中。'}
 if(q.step===1){correct=q.delegate!==null&&q.support.length===9&&!q.support.includes(q.delegate);error='委托人不能委托给自己。先确定一名委托人，再把其余九人放入委托区域。'}
 if(q.step===2){correct=q.slider===9;error='再想想吧，委托人不能给自己投票。十名学生会中，最多只有另外九人能够委托给她。'}
 if(q.step===3){correct=q.answers.stable===1;error='不要只看双方谁的票数更多。寻找那部分从始至终没有发生变化的票。'}
 if(q.step===4){correct=q.answers.photo===1;error='学生会知道彼此身份。照片影响的是依赖公开信息判断身份的人。'}
 if(q.step===5&&q.sub==='hypothesis'){correct=JSON.stringify(q.hypothesis)===JSON.stringify([0,0,1]);error='从学生会知道彼此身份、固定支持不会因照片改变这两点继续推导。'}
 if(q.step===5&&q.sub==='assemble'){correct=D4_VOTE_WORDS.every((word,i)=>q.slots[i]===word);error='按人数、阵营票上限、身份信息、浮动票、固定支持对象的顺序，重新核对词条。';if(correct)q.done=true}
 q.feedback=correct?'':error;q.result=correct;persist();d4VoteReasonPanel();
}
function d4VoteAssign(zone,id){const q=d4VoteReason();if(!d4VoteReasonReady()||q.step!==1||q.result||!Number.isInteger(id)||id<0||id>9)return;if(zone==='delegate'){q.delegate=id;q.support=q.support.filter(n=>n!==id)}else if(q.delegate!==null&&id!==q.delegate&&!q.support.includes(id))q.support.push(id);q.selected=null;q.feedback='';persist();d4VoteReasonPanel()}
actions['d4-vote-reason-next']=d4VoteReasonNext;
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;if(!d4VoteReasonReady()||view!=='day4-vote-reasoning')return;
 const q=d4VoteReason();if(q.result)return;
 if(b.dataset.vrPerson!==undefined){const id=Number(b.dataset.vrPerson);if(q.step===0){if(q.crossed.includes(id))q.crossed=q.crossed.filter(n=>n!==id);else if(q.crossed.length<3)q.crossed.push(id);delete q.answers.count}else if(q.step===1)q.selected=id;else return}
 else if(b.dataset.vrDrop){if(q.selected!==null)d4VoteAssign(b.dataset.vrDrop,q.selected);return}
 else if(b.dataset.vrAnswer!==undefined){const expected={0:'count',3:'stable',4:'photo'}[q.step];if(expected!==b.dataset.vrKey)return;q.answers[expected]=Number(b.dataset.vrAnswer)}
 else if(b.dataset.vrHypothesis!==undefined&&q.step===5&&q.sub==='hypothesis')q.hypothesis[Number(b.dataset.vrHypothesis)]=Number(b.dataset.vrValue);
 else if(b.dataset.vrSlot!==undefined&&q.sub==='assemble')q.slot=Number(b.dataset.vrSlot);
 else if(b.dataset.vrWord!==undefined&&q.sub==='assemble'){q.slots[q.slot]=D4_VOTE_WORDS[Number(b.dataset.vrWord)];q.slot=Math.min(4,q.slot+1)}else return;
 q.feedback='';persist();d4VoteReasonPanel();
});
document.addEventListener('input',e=>{const input=e.target;if(!d4VoteReasonReady()||view!=='day4-vote-reasoning'||!input.dataset.vrRange)return;const q=d4VoteReason(),key=input.dataset.vrRange,value=Number(input.value);if(key==='slider'&&q.step===2&&!q.result){q.slider=value;screen.querySelector('[data-vr-value]').textContent=String(value)}else if(key==='timeline'&&q.step===3){q.timeline=value;const point=d4VoteTimeline()[value];screen.querySelector('[data-vr-timeline-tally]').innerHTML=d4VoteTally(point,q.result);screen.querySelector('[data-vr-timeline-label]').textContent=point.label}else return;persist()});
let d4VoteDragged=null;
document.addEventListener('dragstart',e=>{const b=e.target.closest('[data-vr-person]');if(!b||!d4VoteReasonReady()||d4VoteReason().step!==1)return;d4VoteDragged=Number(b.dataset.vrPerson);e.dataTransfer.setData('text/plain',String(d4VoteDragged))});
document.addEventListener('dragover',e=>{if(d4VoteDragged!==null&&e.target.closest('[data-vr-drop]'))e.preventDefault()});
document.addEventListener('drop',e=>{const zone=e.target.closest('[data-vr-drop]');if(!zone||d4VoteDragged===null)return;e.preventDefault();d4VoteAssign(zone.dataset.vrDrop,d4VoteDragged);d4VoteDragged=null});
document.addEventListener('dragend',()=>{d4VoteDragged=null});
// Pointer dragging also works on touch screens; a tap remains the accessible selection path.
let d4VoteTouch=null;
document.addEventListener('pointerdown',e=>{const b=e.target.closest('[data-vr-person]');if(e.pointerType==='mouse'||!b||!d4VoteReasonReady()||d4VoteReason().step!==1)return;d4VoteTouch={id:Number(b.dataset.vrPerson),pointer:e.pointerId}});
document.addEventListener('pointerup',e=>{if(!d4VoteTouch||e.pointerId!==d4VoteTouch.pointer)return;const zone=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-vr-drop]');if(zone)d4VoteAssign(zone.dataset.vrDrop,d4VoteTouch.id);d4VoteTouch=null});
document.addEventListener('pointercancel',()=>{d4VoteTouch=null});
let d4VoteReplayLast=0;
setInterval(()=>{
 if(d3Paused()||!d4VoteReasonReady()||view!=='day4-vote-reasoning'||d4VoteReason().step!==4){d4VoteReplayLast=0;return}
 const q=d4VoteReason(),now=Date.now(),elapsed=d4VoteReplayLast?Math.min(500,now-d4VoteReplayLast):0;d4VoteReplayLast=now;
 const frames=d4VotePhotoFrames();if(q.photoIndex>=frames.length-1)return;
 q.photoRemaining-=elapsed;
 if(q.photoRemaining<=0){q.photoRemaining=500;q.photoIndex++;const point=frames[q.photoIndex];screen.querySelector('[data-vr-photo-tally]').innerHTML=d4VoteTally(point,true);screen.querySelector('[data-vr-photo-label]').textContent=point.label;persist()}
 const ticket=screen.querySelector('.vote-flight .vote-ticket');if(ticket){if(q.photoIndex>=Math.max(0,d4Counter().before.me-3))ticket.remove();else ticket.style.cssText=d4VotePhotoFlightStyle()}
},32);
const d4VoteAppBase=openApp;openApp=function(id,...args){if(id==='reasoning'&&d4VoteReasonReady())return d4VoteReasonPanel();return d4VoteAppBase(id,...args)};
const d4VoteCleanupBase=cleanupSceneResume;cleanupSceneResume=function(...args){d4VoteDragged=null;d4VoteTouch=null;d4VoteReplayLast=0;return d4VoteCleanupBase(...args)};
