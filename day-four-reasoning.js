/* Day 4 testimony and conditional deduction. No vote settlement or confrontation script. */
const D4_HEAN_CHAT='day4-hean';
const D4_REASON_NODE='day4-reasoning-start';
const D4_REASON_STEPS=['证词','行动','配对','身份','矛盾','结论'];
const D4_HEAN_ROWS=[
 '我看到你申请成为委托人了','你应该和我一样吧，不相信沈可欣',
 ['为什么这么说','你也不相信她？'],
 '第二天取件的时候','她私下问过我，要不要和她一起去取物资',
 '我也不知道为什么，可能是直觉？反正就觉得不放心','所以没答应她','我最后是和韩露一起去的',
 '韩露一定是普通生，我能保证，不然我现在不可能在这给你发消息','你看下我们那层的情况吧，就理解我是什么意思了',
 ['好，我知道了'],'这几天你在群里说的话我都有看见','我和韩露都相信你'
];
const D4_REASON_QUOTES=['大家今天更要注意规则。','凡事都要小心。','楼层混乱的事情大家应该已经发现了。','怪我大意了，没注意到第二章还有隐藏的行为规则。'];
const D4_REASON_RULES=[['stairs','严禁使用宿舍楼楼梯。'],['digits','电梯楼层数字被打乱'],['alone','不要独自进入电梯。'],['factions','普通生无权与学生会成员同时处于电梯内。']];
const D4_REASON_WORDS=['韩露','许蓁蓁','楼层混乱','同一阵营','学生会','普通生','何安','不同阵营','取件码错误'];
STORY_CHOICES.push({id:D4_REASON_NODE,title:'整理何安的证词',day:'第四日 · 09:41',chat:null});
const d4ReasonWorldlineBase=makeDayFourWorldline;
makeDayFourWorldline=function(){const m=d4ReasonWorldlineBase();m.nodes.push({id:D4_REASON_NODE,title:'09:41 · 整理证词',x:690,y:420,kind:'story',record:D4_REASON_NODE,replayable:true});m.edges.push({from:D4_DELEGATION_NODE,to:D4_REASON_NODE});m.width=1100;return m};
function d4Hean(){return state.story.dayFourHean}
function d4Reason(){return state.story.dayFourReasoning}
function d4ReasonReady(){return state.game.day===4&&!!d4Reason()}
function d4HeanInside(){return view==='chat'&&active===D4_HEAN_CHAT}
function d4HeanEnsure(){if(state.game.day!==4||d4Delegation()?.phase!=='registered'||d4Hean())return;state.story.dayFourHean={phase:'waiting',remaining:3000,index:0,decisions:{}};persist()}
function d4HeanNotice(){
 document.querySelector('#d4-hean-notice')?.remove();const q=d4Hean();if(!q||d3Paused())return;
 const request=q.phase==='request',c=state.contacts.find(c=>c.id===D4_HEAN_CHAT),el=document.createElement('div');
 el.id='d4-hean-notice';el.className='opening-message';el.innerHTML='<button class="opening-body" data-action="d4-hean-open"><span>'+avatar(dayTwoPerson('hean').avatar)+'</span><span><small>讯息 · 09:41</small><strong>'+ (request?'何安（519）请求添加你为好友':'何安')+'</strong><span>'+esc(request?'附言：有些事想和你聊聊':c?.preview||'你收到一条消息')+'</span></span></button><button class="opening-close" data-action="d4-hean-dismiss" aria-label="关闭通知">×</button>';document.querySelector('#phone').append(el);playNotificationSound(request?'friend':'message');
}
function d4HeanFriend(){
 const q=d4Hean();if(state.game.day!==4||!q||q.phase==='waiting')return;
 document.querySelector('#d4-hean-notice')?.remove();if(q.phase!=='request')return openChat(D4_HEAN_CHAT);
 closeSheet();view='day4-hean-friend';active=null;rememberRoute();screen.innerHTML='<section class="app-page">'+head('好友申请')+'<div class="panel"><div class="profile-row">'+avatar(dayTwoPerson('hean').avatar)+'<div><h2>何安（519）</h2><p class="subtle">来自女生B栋临时互助群</p></div></div><p>附言：有些事想和你聊聊</p><button class="primary" data-action="d4-hean-accept">同意</button></div></section>';persist();refreshPhoneBack();
}
function d4HeanAccept(){const q=d4Hean();if(state.game.day!==4||q?.phase!=='request')return;q.phase='chat';q.remaining=messageSendDelay();
 if(!state.contacts.some(c=>c.id===D4_HEAN_CHAT))state.contacts.push({id:D4_HEAN_CHAT,name:'何安',avatar:dayTwoPerson('hean').avatar,status:'在线',online:true,time:'09:41',preview:'你们已成为联系人',unread:0});
 state.messages[D4_HEAN_CHAT]??=[];ensureFriendContactNotice(D4_HEAN_CHAT,state,true);persist();openChat(D4_HEAN_CHAT);
}
function d4HeanWrite(text,id,mine=false){const c=state.contacts.find(c=>c.id===D4_HEAN_CHAT),rows=state.messages[D4_HEAN_CHAT];if(!c||rows.some(m=>m.id===id))return;rows.push({id,type:'text',sender:mine?'me':c.avatar,name:mine?state.profile.name:'何安',text,time:state.system.time,gameDate:state.system.date,status:'read'});c.preview=(mine?'我：':'')+text;c.time=state.system.time;if(!d4HeanInside())c.unread=(c.unread||0)+1;persist();if(d4HeanInside())openChat(D4_HEAN_CHAT);else d4HeanNotice()}
function d4HeanDecorate(){if(state.game.day!==4||!d4HeanInside())return;document.querySelector('#d4-hean-notice')?.remove();screen.querySelector('[data-d4-hean-options]')?.remove();const q=d4Hean();if(!q)return;const row=D4_HEAN_ROWS[q.index];if(q.phase==='chat'&&Array.isArray(row)){screen.querySelector('#composer')?.insertAdjacentHTML('beforebegin','<div class="zero-choices" data-d4-hean-options>'+row.map((s,i)=>'<button data-d4-hean-choice="'+i+'">'+esc(s)+'</button>').join('')+'</div>');scrollMessages()}}
function d4HeanChoose(i){const q=d4Hean(),row=D4_HEAN_ROWS[q?.index];if(!d4HeanInside()||q?.phase!=='chat'||!Array.isArray(row)||!row[i])return;const index=q.index;q.decisions[index]=i;q.index++;q.remaining=messageSendDelay();d4HeanWrite(row[i],'d4-hean-choice-'+index,true)}
function d4HeanUnlock(){const q=d4Hean();if(q?.phase!=='chat')return;q.phase='delegation-notice';
 state.story.dayFourReasoning??={step:0,phase:'investigation',pending:null,pair:[],quote:null,evidence:null,identity:null,claim:null,slots:[],completed:[],hints:0,feedback:'',result:false};
 d4Delegation().receivedDelegations={...(d4Delegation().receivedDelegations||{}),hean:'me',hanlu:'me'};freeSync();persist();d4HeanPrompt();
}
function d4HeanPrompt(){const q=d4Hean();if(q?.phase==='delegation-notice')d4DelegationNotice();else if(q?.phase==='reason-notice')sheet('开始推理','<p>整理何安的证词，重新核对五楼的取件搭档。</p><button class="primary" data-action="d4-reason-open">整理证词</button>')}
Object.assign(actions,{'d4-hean-open':d4HeanFriend,'d4-hean-accept':d4HeanAccept,'d4-hean-dismiss':()=>document.querySelector('#d4-hean-notice')?.remove(),'d4-hean-reason-notice':()=>{if(d4Hean()?.phase!=='delegation-notice')return;closeSheet();document.querySelector('#d4-delegation-notice')?.remove();d4Hean().phase='reason-notice';persist();d4HeanPrompt()},'d4-reason-open':()=>{if(!d4ReasonReady())return;if(['delegation-notice','reason-notice'].includes(d4Hean()?.phase))d4Hean().phase='done';document.querySelector('#d4-delegation-notice')?.remove();d4ReasonPanel()}});
const d4HeanApplyBase=actions['d4-delegation-apply'];actions['d4-delegation-apply']=()=>{d4HeanApplyBase();d4HeanEnsure();d4HeanLastTick=Date.now()};
const d4HeanListBase=chatList;chatList=function(...args){const result=d4HeanListBase(...args);if(state.game.day===4&&view==='messages'&&d4Hean()?.phase==='request')screen.querySelector('.page-head')?.insertAdjacentHTML('afterend','<button class="setting-row" data-action="d4-hean-open"><span><i class="live-dot friend-request-dot"></i>新的好友申请</span><span>何安（519） ›</span></button>');return result};
const d4HeanChatBase=openChat;openChat=function(...args){const result=d4HeanChatBase(...args);d4HeanDecorate();return result};
let d4HeanLastTick=0,d4HeanLastSave=0;
function d4HeanTick(){if(state.game.day!==4||d3Paused()){d4HeanLastTick=0;return}d4HeanEnsure();const q=d4Hean();if(!q)return;const now=Date.now(),elapsed=d4HeanLastTick?Math.min(500,now-d4HeanLastTick):0;d4HeanLastTick=now;
 if(q.phase==='waiting'){q.remaining=Math.max(0,q.remaining-elapsed);if(!q.remaining){q.phase='request';state.system.time='09:41';persist();if(view==='delegation')d4DelegationPanel();else if(view==='home')home();else if(view==='messages')chatList();status();d4HeanNotice()}}
 else if(q.phase==='chat'&&d4HeanInside()){
  const row=D4_HEAN_ROWS[q.index];if(Array.isArray(row))return;q.remaining=Math.max(0,q.remaining-elapsed);
  if(!q.remaining){if(row===undefined){d4HeanUnlock();return}const index=q.index++;q.remaining=messageSendDelay();d4HeanWrite(row,'d4-hean-'+index)}
 }
 if(['waiting','chat'].includes(q.phase)&&now-d4HeanLastSave>1000){d4HeanLastSave=now;persist()}
}
setInterval(d4HeanTick,100);

function d4ReasonOptions(key,items){const q=d4Reason();return '<div class="reason-premise">'+items.map(([id,label])=>'<button class="'+(String(q[key])===String(id)?'is-selected':'')+'" data-d4-pick="'+key+'" data-value="'+id+'" aria-pressed="'+(String(q[key])===String(id))+'">'+esc(label.replace(/。+$/,''))+'</button>').join('')+'</div>'}
function d4ReasonCard(id,locked){return d3ReasoningCard(id,{interactive:!locked,selected:d4Reason().pending===id||d4Reason().pair.includes(id),excluded:locked,note:locked?'已锁定搭档':''}).replace('data-reason-person','data-d4-person')}
function d4ReasonPairs(){const q=d4Reason(),ids=['hanlu','shen','zhengning','hean'],locked=q.step>=2||q.result,pairs=[...(q.step>=2?[['hean','hanlu']]:[]),...(q.pair.length===2?[q.pair]:[])],caps=d3ReasoningCapabilities();
 const point=id=>{const i=ids.indexOf(id);return [i%2?75:25,i<2?23:77]};
 const lines=caps.simple?'':'<svg class="reason-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">'+pairs.map(([a,b])=>{const [x,y]=point(a),[xx,yy]=point(b);return '<line x1="'+x+'" y1="'+y+'" x2="'+xx+'" y2="'+yy+'" />'}).join('')+'</svg>';
 return '<div class="reason-board">'+lines+'<div class="reason-people">'+ids.map(id=>d4ReasonCard(id,locked&&['hean','hanlu'].includes(id))).join('')+'</div></div>'+(q.step===0?'<p class="reason-copy">戚悦 · 已请离</p>':'')+pairs.map(pair=>'<p class="d4-pair-line">'+pair.map(id=>esc(d3ReasoningPerson(id).name)).join(' <span>—</span> ')+(pair.includes('hean')&&locked?' · 已锁定':'')+'</p>').join('');
}
function d4ReasonBoard(){const q=d4Reason(),rows=[['何安 ＋ 韩露','已知搭档'],['沈可欣曾乘坐电梯','行动线索'],['沈可欣 ＋ 许蓁蓁','排除其他组合'],['同一阵营','电梯身份规则'],['沈可欣的指控','与同阵营证据相连'],['沈可欣＝学生会','若何安及沈可欣的陈述成立']];return '<div class="d4-evidence-board" aria-label="已完成的证据连接">'+q.completed.map(i=>'<div><i></i><span>'+rows[i][0]+'<small>'+rows[i][1]+'</small></span></div>').join('')+'</div>'}
function d4ReasonBody(){const q=d4Reason();if(q.phase==='group')return '<h2>公开推理已准备好</h2><p class="reason-note">证词与推理已保存。前往群聊，准备对峙。</p>';
 if(q.phase==='complete')return '<h2>推理完成</h2><p class="reason-narration">沈可欣用来争取委托票的指控，反而暴露了她自己。</p><div class="reason-note"><p>如果沈可欣坚持许蓁蓁是学生会，那么她也只能是学生会。</p><p>如果她改口说自己不能确定许蓁蓁的身份，那么她早晨以此为理由收集所有委托票的行为，同样是在欺骗大家。</p><p>无论她选择哪一种说法，她“最可靠的人”这一形象都会出现裂缝。</p></div><p class="reason-narration">但这条推理仍然建立在一个无法验证的前提上——<br>何安没有撒谎。</p>';
 if(q.result)return '<h2>'+['已知搭档已锁定','确认行动线索','五楼的唯一组合','只能确定同一阵营','发言与证据发生矛盾'][q.step]+'</h2><div class="reason-note '+(q.step===4?'d4-contradiction':'confirmed')+'">'+[
 '已知组合：何安＋韩露<br>尚未确定：沈可欣、许蓁蓁',
 '电梯楼层数字被打乱，是进入电梯后才能发现的异常。<br>沈可欣知道这件事，说明她当天坐过电梯。',
 '何安：已与韩露同行<br>韩露：已与何安同行<br>沈可欣：确认乘坐过电梯<br>剩余可同行成员：许蓁蓁<br><br>在何安没有撒谎的前提下，这是五楼唯一能够成立的组合。',
 '目前只能证明两人的身份相同。<br>她们可能都是普通生，也可能都是学生会。<br>还缺少决定身份的最后一条信息。',
 '沈可欣承诺把许蓁蓁投出去，是在向所有人表明她们处于对立阵营。<br>可取件当天的同行关系却说明，她们属于同一阵营。<br>沈可欣正在欺骗大家。'
 ][q.step]+'</div>'+(q.step===0||q.step===2?d4ReasonPairs():'');
 if(q.step===0)return '<h2>哪一组取件搭档已经可以确定？</h2><p class="reason-copy">根据何安的证词，依次点击两个人建立连线。</p>'+d4ReasonPairs();
 if(q.step===1)return '<h2>哪句话能证明沈可欣坐过电梯？</h2><p class="reason-copy">选择一条发言，核对她是否亲历了电梯内的异常。</p>'+d4ReasonOptions('quote',D4_REASON_QUOTES.map((s,i)=>[i,s]));
 if(q.step===2)return '<h2>沈可欣能和谁一起乘坐电梯？</h2><div class="reason-note">① 校园新规第三章：不要独自进入电梯。<br>② 沈可欣当天乘坐过电梯。</div>'+d4ReasonPairs();
 if(q.step===3)return '<h2>两人的身份有什么关系？</h2><div class="reason-people">'+['shen','zhengning'].map(id=>d3ReasoningCard(id,{interactive:false,note:'身份：？'})).join('')+'</div><h3>选择关键信息</h3>'+d4ReasonOptions('evidence',D4_REASON_RULES)+(q.evidence?'<p class="reason-copy">两人乘坐同一部电梯后都没有消失，可以得出什么结论？</p>'+d4ReasonOptions('identity',[['ordinary','她们都是普通生'],['council','她们都是学生会'],['same','她们属于同一阵营'],['none','无法得到任何结论']]):'');
 if(q.step===4)return '<h2>哪一部分与现有证据矛盾？</h2><p class="reason-copy">沈可欣早晨的拉票发言</p>'+d4ReasonOptions('claim',[['identity','我认为许蓁蓁就是学生会。'],['delegate','我会把许蓁蓁投出去']])+'<h3>提交证据</h3>'+d4ReasonOptions('evidence',[['same','沈可欣与许蓁蓁属于同一阵营'],['pair','何安与韩露：同行'],['digits','电梯楼层数字被打乱']]);
 const before=['何安选择与','沈可欣曾提到','在五楼剩余成员中，她唯一可能的同行者是','两人共同乘坐电梯后都没有消失，说明她们属于','如果沈可欣所说的“许蓁蓁是学生会”成立，那么沈可欣也是'],after=['一起取件。','，说明她当天进入过电梯。','。','。','。'];return '<h2>亲手补全这条推理</h2><div class="reason-sentence">'+before.map((s,i)=>'<p>'+s+'<button class="reason-slot '+(q.slots[i]?'filled':'')+'" data-d4-slot="'+i+'">'+esc(q.slots[i]||'选择词条')+'</button>'+after[i]+'</p>').join('')+'</div>';
}
function d4ReasonPanel(){if(!d4ReasonReady())return;closeSheet();const q=d4Reason(),caps=d3ReasoningCapabilities();view='day4-reasoning';active=null;rememberRoute();zeroChrome();status();
 if(!q.captured){q.captured=true;d2Capture(D4_REASON_NODE,{view:'day4-reasoning',active:null})}
 screen.innerHTML='<section class="reason-page d4-reason-page '+(caps.simple?'reason-simple ':'')+(caps.simple||caps.reduce?'reason-no-motion':'')+'"><div class="reason-top-art" aria-hidden="true"><span>REASONING</span><i></i><b>04</b></div><header class="reason-head"><h1>整理证词</h1><button class="reason-clue-open" data-reason-drawer>线索 '+icon('note')+'</button><button class="reason-clue-open" data-action="d4-reason-hint">提示</button></header><nav class="reason-progress">'+D4_REASON_STEPS.map((s,i)=>'<span class="'+(q.completed.includes(i)?'done':q.step===i?'current':'')+'"><i>'+(q.completed.includes(i)?'✓':i+1)+'</i><small>'+s+'</small></span>').join('')+'</nav><main class="reason-main">'+d4ReasonBody()+'<p class="reason-feedback" role="status">'+esc(q.feedback)+'</p>'+d4ReasonBoard()+'</main><footer class="reason-footer"><button class="reason-drawer-handle" data-action="d4-reason-clues"><i></i><span>查看线索</span></button><button class="reason-primary" data-action="d4-reason-next" '+(q.step===1&&!q.result&&q.phase==='investigation'?'hidden':'')+'>'+(q.phase==='group'?'前往群聊':q.phase==='complete'?'相信何安，准备公开推理':q.result?'继续推理':'提交验证')+'</button></footer></section>';persist();refreshPhoneBack();
}
function d4ReasonFeedback(text){d4Reason().feedback=text;persist();d4ReasonPanel()}
function d4ReasonPair(id){const q=d4Reason();if(!d4ReasonReady()||q.phase!=='investigation'||q.result||![0,2].includes(q.step)||!['hanlu','shen','zhengning','hean'].includes(id)||q.step===2&&['hean','hanlu'].includes(id))return;if(q.pair.length===2)q.pair=[];if(q.pending===id)q.pending=null;else if(q.pending){q.pair=[q.pending,id];q.pending=null}else q.pending=id;q.feedback='';d4ReasonPanel()}
function d4ReasonValidate(){const q=d4Reason();if(!d4ReasonReady())return;if(q.phase==='group')return openChat(HG_ID);if(q.phase==='complete'){q.phase='group';state.story.dayFourConfrontation={phase:'unlocked',premise:'hean-truthful'};persist();return openChat(HG_ID)}
 if(q.result){q.step++;q.result=false;q.pair=[];q.pending=null;q.evidence=null;q.feedback='';return d4ReasonPanel()}
 const pair=q.pair.slice().sort().join('+');
 if(q.step===0&&pair!=='hanlu+hean')return d4ReasonFeedback('何安明确表示，她拒绝沈可欣后，选择了与韩露同行。');
 if(q.step===1){if(String(q.quote)!=='2')return d4ReasonFeedback(q.quote===null?'先选择一条与电梯内异常有关的发言。':({'0':'这只是提醒大家注意规则，不能证明她亲自坐过电梯。','1':'这只是一般性的提醒，无法证明她亲自进入过电梯。','3':'这句话只是在反省疏忽，没有说明她是否亲历电梯内的异常。'}[q.quote]||'这条发言不能证明她亲自坐过电梯。'))}
 if(q.step===2&&pair!=='shen+zhengning')return d4ReasonFeedback('已经确定同行的两个人不能重复配对；请核对剩下的人与“不独自进入电梯”的规则。');
 if(q.step===3){if(q.evidence!=='factions')return d4ReasonFeedback('这条规则没有说明不同身份共同乘梯会怎样，无法推导阵营关系。');if(q.identity!=='same')return d4ReasonFeedback(q.identity==='none'?'规则限制了不同阵营共同乘梯；两人都回来，是可以利用的信息。':'共同乘梯只能排除身份不相容的情况，还不能单独确定她们是哪一个阵营。')}
 if(q.step===4){if(q.claim!=='delegate')return d4ReasonFeedback(q.claim==='identity'?'这句话是在判断许蓁蓁的身份，还不能直接说明两人处于对立阵营。\n再找找沈可欣承诺要对许蓁蓁采取什么行动。':'先选择沈可欣承诺要采取的行动。');if(q.evidence!=='same')return d4ReasonFeedback('这条证据没有把她与被指控者的身份联系起来，暂时无法反驳这句指控。')}
 if(q.step===5){const expected=['韩露','楼层混乱','许蓁蓁','同一阵营','学生会'],bad=expected.findIndex((s,i)=>q.slots[i]!==s);if(bad!==-1)return d4ReasonFeedback(['第一句需要和何安亲口描述的同行经历一致。','第二句要填写能说明电梯内部状况的信息，而非一般提醒。','第三句需要排除已锁定的搭档，再考虑剩下的人。','第四句只能推导身份之间的关系，不能直接指定阵营。','最后一句要同时符合“同阵营”和沈可欣自己的指控。'][bad]);q.phase='complete'}else q.result=true;
 if(!q.completed.includes(q.step))q.completed.push(q.step);q.feedback='';d4ReasonPanel();
}
function d4ReasonEvidence(){return [
 {id:'testimony',title:'何安的私聊证词',source:'讯息 · 何安（519）',text:D4_HEAN_ROWS.filter(s=>typeof s==='string').join('\n'),note:'何安的证词尚未得到独立验证。'},
 {id:'rules',title:'取件规则与电梯现象',source:'校园墙 · 校园新规与取件经历',text:D4_REASON_RULES.map(r=>r[1]).join('\n')},
 {id:'statements',title:'沈可欣的群聊发言',source:'女生B栋临时互助群 · 前两日',text:D4_REASON_QUOTES.join('\n')},
 {id:'delegation',title:'早晨的拉票发言',source:'女生B栋临时互助群 · 第四日',text:'我向大家保证，我会检举许蓁蓁\n她和江柠是站在一边的，一定是学生会'}
]}
function d4ReasonClues(){if(d4ReasonReady())d3ReasoningOpenDrawer()}
function d4DelegationNotice(){d4VoteModal('新增两份委托','何安、韩露已将票委托给你','d4-hean-reason-notice')}
actions['d4-delegation-dismiss']=()=>{document.querySelector('#d4-delegation-notice')?.remove();if(d4Hean()?.phase==='delegation-notice'){d4Hean().phase='done';persist()}};

function d4ReasonHint(){if(!d4ReasonReady())return;const q=d4Reason(),hints=['先确认何安选择了谁。','沈可欣说过什么，能证明她坐过电梯？','何安和韩露已经组成一组后，五楼还剩哪两个人？'];q.hints=Math.min(3,q.hints+1);persist();sheet('推理提示 '+q.hints+' / 3','<p>'+hints[q.hints-1]+'</p>'+(q.hints<3?'<button class="primary" data-action="d4-reason-hint">查看下一级提示</button>':'')+'<button class="secondary" data-action="close">返回推理</button>')}
Object.assign(actions,{'d4-reason-next':d4ReasonValidate,'d4-reason-clues':d4ReasonClues,'d4-reason-hint':d4ReasonHint});
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-d4-hean-choice'))return d4HeanChoose(Number(b.dataset.d4HeanChoice));if(view!=='day4-reasoning'||!d4ReasonReady())return;const q=d4Reason();if(q.phase!=='investigation'||q.result)return;
 if(b.dataset.d4Person)return d4ReasonPair(b.dataset.d4Person);
 if(b.dataset.d4Pick){const key=b.dataset.d4Pick,val=b.dataset.value;if(!['quote','evidence','identity','claim'].includes(key))return;q[key]=val;q.feedback='';if(q.step===1&&key==='quote')return d4ReasonValidate();return d4ReasonPanel()}
 if(b.hasAttribute('data-d4-slot')&&q.step===5){const i=Number(b.dataset.d4Slot);return sheet('选择词条','<div class="reason-picker">'+D4_REASON_WORDS.map((s,j)=>'<button data-d4-word="'+j+'" data-slot="'+i+'">'+s+'</button>').join('')+'</div>')}
 if(b.hasAttribute('data-d4-word')&&q.step===5){const i=Number(b.dataset.slot),word=D4_REASON_WORDS[Number(b.dataset.d4Word)];if(i<0||i>4||!word)return;q.slots[i]=word;q.feedback='';d4ReasonPanel()}
});
const d4ReasonSyncBase=freeSync;freeSync=function(...args){const result=d4ReasonSyncBase(...args);if(d4ReasonReady())C.apps.find(a=>a.id==='reasoning').locked=false;return result};
const d4ReasonButtonBase=appButton;appButton=function(a){let html=d4ReasonButtonBase(a);if(a.id==='reasoning'&&d4ReasonReady())html=html.replace('disabled aria-disabled="true" ','').replace('app-button locked','app-button');return html};
const d4ReasonAppBase=openApp;openApp=function(id,...args){if(id==='reasoning'&&state.game.day===4){if(d4ReasonReady())return d4ReasonPanel();return toast('暂未获得新的推理线索')}return d4ReasonAppBase(id,...args)};
const d4ReasonCleanupBase=cleanupSceneResume;cleanupSceneResume=function(...args){d4HeanLastTick=0;document.querySelector('#d4-hean-notice')?.remove();document.querySelector('#d4-delegation-notice')?.remove();return d4ReasonCleanupBase(...args)};
const d4ReasonResumeBase=resumeStoryScene;resumeStoryScene=function(snapshot,...args){const route=snapshot?.story?.route;if(snapshot?.game?.day!==4||!snapshot.story.dayFourHean)return d4ReasonResumeBase(snapshot,...args);freeSync();if(route?.view==='day4-reasoning'&&d4ReasonReady())d4ReasonPanel();else if(route?.view==='day4-hean-friend')d4HeanFriend();else if(route?.view==='chat')openChat(route.active);else if(route?.view==='delegation')d4DelegationPanel();else home();if(['delegation-notice','reason-notice'].includes(d4Hean()?.phase))d4HeanPrompt();else if(d4Hean()?.phase==='request')d4HeanNotice();persist()};
if(!d3Paused()){freeSync();if(view==='day4-reasoning')d4ReasonPanel();else if(view==='day4-hean-friend')d4HeanFriend()}
