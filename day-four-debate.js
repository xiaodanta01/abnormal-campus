/* Day 4 afternoon: choices, notices, votes and timers are snapshot-owned. */
const D4_DEBATE_CG=[
 '你看到周茉的名字，攥着手机的手被气得止不住地发抖。',
 '明明是她们把周茉清理了，现在竟然还有脸拿她的死来指责你？',
 '周茉是可怜。可怜在她不过是记得别人对她的好，想尽力还回去；可怜在这样一个人，竟成了这场弱肉强食游戏里的牺牲品。'
];
const D4_DEBATE_SCRIPTS={
 suggestion:{chat:D4_HUANG,rows:[['huang','这样吧，你让她们都来申请A栋的群'],['huang','等她们进来以后，我直接把截图发在群里']],options:[['好，就按你说的做','invite'],['OK，我去试试看','invite']]},
 invite:{chat:HG_ID,rows:[],options:[['大家去加一下校园墙A栋的群吧','joiners']]},
 aEvidence:{chat:D4_A_GROUP,rows:[['huang','我这两天一直在申请你们的群聊'],['huang','可是你们的群主一直在拒绝'],['huang','女生B栋临时互助群——入群申请已被拒绝','image']],next:'challenge'},
 challenge:{chat:HG_ID,rows:[['yelin','沈可欣'],['yelin','你昨天不是说，其他宿舍楼的人没有来联系我们吗'],['yelin','那她的入群申请为什么一直被拒绝？'],['shen','我没有收到她的申请'],['zhao','可你怎么证明呢……'],['zhao','我不是怀疑你，但是我想听到合理的解释']],next:'attack'},
 screenshot:{chat:HG_ID,rows:[],next:'attack'},
 attack:{chat:HG_ID,rows:[['shen','图片现在都是可以ai处理的'],['shen','你们有没有想过，她可能就是在利用这件事挑拨我们？'],['shen','而且为什么偏偏是今天？'],['shen','【玩家名字】刚成为委托人，另一个委托人就退出了'],['shen','还给我泼这样的脏水，引导大家怀疑我'],['shen','她们拒绝我们的申请，还反过来说我拒绝了她们'],['cheng','是啊，倒反天罡'],['cheng','【玩家名字】你和A栋的那个人是一伙的吧'],['cheng','你俩这是担心许蓁蓁被投出去？'],['gunian','话都说到这了，还不明白吗']],options:[['昨天许蓁蓁那样针对我，我怎么可能是担心这个','round1bad'],['我是在担心你并不会投许蓁蓁，明白吗？','round1good']]},
 round1bad:{chat:HG_ID,rows:[['shen','她针对过你，就说明你们不是一伙的？'],['gunian','又不是没见过互相唱反调的'],['gunian','你这几天不就是在卖学生会来换取普通生的信任吗？'],['gunian','周茉那么相信你，最后是什么结局？']],cg:true,next:'round1badEnd'},
 round1badEnd:{chat:HG_ID,rows:[['yeshu','哎，周茉真可怜'],['lin','你们够了，真恶心'],['shen','如果质疑我，那就请你拿出关于我的确凿证据'],['shen','而不是说你和许蓁蓁在群里吵过几次，这代表不了什么'],['shen','毕竟群里的吵架很有可能是做做样子的']],vote:'bad1',next:'hean'},
 round1good:{chat:HG_ID,rows:[['shen','我已经当着所有人的面保证过了'],['me','可你最后会不会投她，除了你，谁知道？'],['gunian','许蓁蓁早上都那样了，你还觉得她俩站一边吗？']],options:[['哦，我忘记了，你的学生会队友一定知道','round1press']]},
 round1press:{chat:HG_ID,rows:[['me','而且我一问你，你就说我是不是想保她？'],['me','你在害怕什么呢？'],['shen','我这是正常的怀疑逻辑吧'],['shen','换做谁来都会这么想的'],['wenFirst','不是我说，给你你就一定会投？'],['wenFirst','护许蓁蓁护得这么明显']],options:[['@许蓁蓁，她们说我保护你，怎么不出来感谢我','round1goodEnd']]},
 round1goodEnd:{chat:HG_ID,rows:[['zhengning','……']],vote:'good1',next:'hean'},
 hean:{chat:'day4-hean',rows:[['hean','她邀请我取件的事，你可以说'],['hean','需要的话，我会在群里作证']],next:'witness'},
 witness:{chat:HG_ID,rows:[],options:[['沈可欣，你说你没去取件，那为什么一开始又要邀请何安？','invitation']]},
 invitation:{chat:HG_ID,rows:[['hean','是我和【玩家名字】说的，她没瞎编'],['shen','就是因为何安拒绝了我，我就想着干脆不去了'],['shen','有什么问题吗？']],options:[['你下午约何安的时候，说的是一起去取件，对吧','risk']]},
 risk:{chat:HG_ID,rows:[['shen','是，但我确实什么也没买'],['shen','我是想找人同行，能通过电梯规则确认一下对方的身份'],['shen','如果能多确定一个普通生，大家都会轻松一点'],['shen','我没想到…这也能成为你们怀疑我的理由']],options:[['你只是想骗一个普通生和你乘电梯吧','round2bad'],['所以，你在和早上的自己自相矛盾吗','round2good']]},
 round2bad:{chat:HG_ID,rows:[['shen','你已经认定我是学生会了？'],['me','在我的视角看来就是这样'],['shen','我刚刚解释过了我为什么想约人'],['shen','我要是约到学生会，出事的肯定是我'],['shen','我愿意承担这个风险去试别人的身份，到你这里却成了我想害人'],['yuwei','是啊，这也太咄咄逼人了'],['yeshu','我听着都觉得可欣委屈……']],vote:'bad2',next:'round3'},
 round2good:{chat:HG_ID,rows:[['shen','有吗？'],['me','你早上用自己没待取物资来证明自己没有坐过电梯'],['me','现在又说你什么也没买，但就是想约人坐电梯'],['me','那到底哪句话是真的呢？'],['shen','……'],['shen','你这样是不是诡辩的太过分了点？'],['songjia','可欣，你当时发这张图，不就是让我们相信你没去电梯吗？'],['yuwei','你们在这偷换概念有意思吗？'],['shen','早上我都解释过了，电梯混乱的事都是梁音告诉我的'],['shen','我没有去过电梯'],['yuwei','沈可欣都说了她会投许蓁蓁的，你们在这简单问题复杂化是想怎样？'],['lin','沈可欣有太多没法解释的事情了'],['lin','我想大家真的没办法完全相信她吧']],vote:'good2',next:'round3'},
 round3:{chat:HG_ID,rows:[['yuwei','至少可欣真的想过该怎么帮大家'],['gunian','【玩家名字】呢？除了在群里怀疑这个怀疑那个，还做过什么？'],['lin','作为普通生不应该多怀疑吗？']],options:[['沈可欣，你为什么能活到今天呢','round3alive'],['你说你承担风险，前提是你是普通生','round3risk']]},
 round3alive:{chat:HG_ID,rows:[['shen','什么意思？'],['me','你一直帮大家管理群聊、提醒规则'],['me','你还愿意冒险去确认身份'],['me','你这样有领导力还愿意牺牲的人，学生会为什么一直都没有清理你？'],['me','你们不是说我一直活着很可疑吗，怎么到沈可欣这就玩双标了？'],['shen','就是为了让我被怀疑'],['shen','你现在不就得逞了吗？'],['me','可偏偏只有我到今天才开始质疑你'],['me','学生会若真的想给你泼脏水，何必等到今天'],['me','又怎么可能只有我一人发难'],['yeshu','你们两个的情况不一样吧……']],vote:'good3',next:'closing'},
 round3risk:{chat:HG_ID,rows:[['me','可你要是学生会，哪来的承担风险这一说'],['me','你当真这么无私奉献，一点都不怕何安是学生会？'],['me','真的想为普通生好，就不会在没有任何信息的情况下随便邀请一个人'],['shen','不要把你那种自私自利的想法强加给我'],['shen','如果何安是学生会，我就会自认倒霉'],['me','自私自利？'],['me','假设何安是学生会，你觉得你是在帮普通生，还是在添乱？'],['shen','这一切都只是你的假设']],vote:'good3',next:'closing'},
 closing:{chat:HG_ID,rows:[['shen','大家怎么选，我尊重'],['shen','现在离九点还早'],['shen','大家不用现在就急着作最后的决定'],['shen','但我不会害大家的，我也不希望大家被骗了']],next:'settle'},
 rescue:{chat:HG_ID,rows:[['lin','你们想过没有'],['lin','在正面和学生会交锋的一直都是【玩家名字】'],['lin','沈可欣呢，她有给你们提供过任何有效信息吗'],['lin','永远都在让大家别吵了，没证据就别吵了'],['lin','如果不吵出个结果，吃亏的是学生会还是普通生？'],['lin','你们好好想想吧'],['supporter','就是因为是学生会才那么不怕死的一直怼人吧？'],['yeshu','对啊'],['lin','你们一直让【玩家名字】解释，为什么怀疑，为什么还活着'],['lin','你们好像能看到互相身份一样的相信沈可欣'],['lin','这种环境下，别和我说什么沈可欣对你们好所以你们相信'],['lin','前两天你们不还鄙夷这样的周茉吗？'],['lin','现在是在搬起石头砸自己脚？'],['yelin','你们抱团会不会太不明显了？'],['gunian','？']],vote:'rescue',next:'relief'},
 relief:{chat:D4_HUANG,rows:[['huang','你【票数】票了？'],['huang','所以我们现在暂时没危险了是吗']],options:[['算是吧','reliefEnd']]},
 reliefEnd:{chat:D4_HUANG,rows:[['huang','太好了，可以勉强松口气了']],next:'pickup'}
};
function d4Debate(){return state.story.dayFourDebate}
function d4DebateWho(who){if(who==='supporter')return !reportDeparted('程昕')?'cheng':!reportDeparted('温宁')?'wen':null;if(who==='wenFirst')return !reportDeparted('温宁')?'wen':!reportDeparted('程昕')?'cheng':null;return who}
function d4DebatePresent(who){return !!who&&(who==='me'||who==='huang'||!reportDeparted(GROUP_SUSPECT_NAMES[who]||dayTwoPerson(who).name))}
function d4DebateText(text){return text.split('【玩家名字】').join(state.profile.name).split('【票数】').join(String(d4DelegationVoteCount('me')))}
function d4DebateInside(){return view==='chat'&&active===d4Debate()?.chat}
// Follow the B-dorm reply after Huang's invitation or He An's testimony only.
// Wait for the shared choice-delay gate and all decorators; never store UI state.
const d4ChatReturnPositioned=new WeakMap();
let d4ChatReturnLayout=null;
function d4DebateClearReturnLayout(){d4ChatReturnLayout?.observer.disconnect();d4ChatReturnLayout=null}
function d4DebatePrepareReturnPosition(){
 const q=d4Debate();if(!q||!['invite','witness'].includes(q.script)||!['chat','choice'].includes(q.phase)||!d4DebateInside()||active!==HG_ID||d4ChatReturnPositioned.get(q)===q.script)return;
 const messages=screen.querySelector('#messages');if(!messages)return;
 captureMessagePosition(messages).bottom=true;queueMessagePosition(messages);
 if(d4ChatReturnLayout?.messages===messages&&d4ChatReturnLayout.q===q&&d4ChatReturnLayout.script===q.script)return;
 d4DebateClearReturnLayout();
 // Choice visibility and skin layout can change AFTER the scroll rAF. Settle
 // these two returns after layout, before paint, rather than in another frame.
 if(typeof ResizeObserver==='function'){
  const observer=new ResizeObserver(()=>d4DebateRevealReturnChoice(true));
  d4ChatReturnLayout={q,script:q.script,messages,observer};
  observer.observe(messages);observer.observe(messages.parentElement);
 }
}
function d4DebateRevealReturnChoice(afterLayout=false){
 const q=d4Debate(),pending=d4ChatReturnLayout;
 if(pending&&(pending.q!==q||pending.script!==q?.script||!pending.messages.isConnected||!d4DebateInside()||active!==HG_ID||window.mobileLaunch||storyRestoring))d4DebateClearReturnLayout();
 if(!q||!['invite','witness'].includes(q.script)||!['chat','choice'].includes(q.phase)||!d4DebateInside()||active!==HG_ID||window.mobileLaunch||storyRestoring||d4ChatReturnPositioned.get(q)===q.script)return;
 const options=screen.querySelector('[data-d4-debate-options]'),messages=screen.querySelector('#messages');
 if(!messages)return;
 const visible=q.phase==='choice'&&options&&!options.hasAttribute('data-choice-wait')&&options.getClientRects().length;
 const position=captureMessagePosition(messages);position.bottom=true;if(visible)position.reveal=options;
 if(afterLayout||typeof ResizeObserver!=='function'){
  flushMessagePosition(messages,position);
  if(visible){d4ChatReturnPositioned.set(q,q.script);d4DebateClearReturnLayout()}
 }else queueMessagePosition(messages);
}
new MutationObserver(()=>d4DebateRevealReturnChoice()).observe(screen,{childList:true,subtree:true,attributes:true,attributeFilter:['data-choice-wait']});
function d4DebateWrite(who,text,id,type='text',chat=d4Debate().chat){
 const rows=state.messages[chat]??=[];if(rows.some(m=>m.id===id))return;
 const p=who==='huang'?{name:'黄依依',avatar:'chat_huangyiyi_v1'}:dayTwoPerson(who);text=d4DebateText(text);
 rows.push({id,type,sender:who==='me'?'me':p.avatar,name:who==='me'?state.profile.name:p.name,hgWho:who,text,time:state.system.time,gameDate:state.system.date,status:'read',...(type==='image'?{src:'assets/day4-group-rejected.svg?v=20261011-rc5'}:{})});
 const c=state.contacts.find(c=>c.id===chat);if(c){c.preview=type==='image'?'[图片]':text;c.time=state.system.time;if(view!=='chat'||active!==chat)c.unread=(c.unread||0)+1}
 persist();if(view==='chat'&&active===chat)openChat(chat);else if(view==='messages')chatList();status();
}
function d4DebateNoticePreview(message,fallback='你收到新的消息'){const text=message?(message.type==='image'?'[图片]':message.text||fallback):fallback;return message?.name&&message.sender!=='me'&&message.type!=='system'?message.name+'：'+text:text}
function d4DebateContinueRemovedReply(){const q=d4Debate();if(q?.phase!=='choice'||!['challenge','screenshot'].includes(q.script))return false;d4DebateGo('attack');return true}
function d4DebateNotice(){const q=d4Debate();if(!q||d4DebateInside())return;const c=state.contacts.find(c=>c.id===q.chat);d4ATop('d4-debate-message','讯息 · '+state.system.time,c?.name||'群聊',q.chat===HG_ID?d4DebateNoticePreview([...(state.messages[q.chat]||[])].reverse().find(m=>m.type!=='time'),c?.preview):c?.preview||'你收到新的消息','d4-debate-chat')}
function d4DebateGo(script,announce=false){const q=d4Debate();if(script==='settle'){return d4DebateGo(d4DelegationVoteCount('shen')>d4DelegationVoteCount('me')?'rescue':'relief',true)}if(script==='pickup'){q.phase='done';persist();d4DebatePickup();return}
 if(script==='joiners'){q.phase='joiners';q.joinIndex=0;q.remaining=900;persist();return}
 if(script==='relief'||script==='reliefEnd'){state.system.time='15:57';state.game.period='下午';status()}const def=D4_DEBATE_SCRIPTS[script];q.script=script;q.chat=def.chat;q.index=0;q.phase='chat';q.remaining=messageSendDelay();q.announce=announce;persist();d4DebateDecorate();
}
function d4DebateStart(){if(state.game.day!==4||!d4A()?.transferred||d4Debate())return;state.story.dayFourDebate={phase:'notice',script:'initial',chat:D4_HUANG,remaining:0,decisions:{},effects:{}};persist();if(!document.querySelector('[data-d4-vote-modal]'))d4DebateVoteNotice()}
function d4DebateVote(kind){const q=d4Debate(),d=d4Delegation();if(q.effects[kind])return;let ds=1,dp=0,headline='新增1份委托交给沈可欣',body='';
 if(kind.startsWith('good')){ds=-1;dp=2;headline='1份委托由沈可欣转向你，并新增1份委托'}
 if(kind==='rescue'){const s=d4DelegationVoteCount('shen'),p=d4DelegationVoteCount('me'),n=Math.floor((s-p)/2)+1;const available=Math.max(0,s-9);if(n>available){q.phase='vote-unavailable';persist();return}ds=-n;dp=n;headline='有'+n+'份委托由沈可欣转交给你'}
 d.voteChanges??={};d.voteChanges.shen=(d.voteChanges.shen||0)+ds;d.voteChanges.me=(d.voteChanges.me||0)+dp;q.effects[kind]={shen:ds,me:dp};q.voteHeadline=headline;q.phase='notice';q.next=D4_DEBATE_SCRIPTS[q.script].next;persist();d4DebateVoteNotice();
}
function d4DebateVoteNotice(){const q=d4Debate();if(q?.phase!=='notice')return;if(q.script==='initial'){d4VoteModal('黄依依已退出委托人','2份委托已转交给你，并新增1份委托','d4-vote-ack');return}d4VoteModal(q.voteHeadline,'沈可欣：'+d4DelegationVoteCount('shen')+'票｜你：'+d4DelegationVoteCount('me')+'票','d4-vote-ack')}
function d4DebateOpenVotes(){const q=d4Debate();document.querySelector('#d4-debate-votes')?.remove();if(q?.phase==='notice'){q.phase='notice-wait';q.remaining=3000;persist()}}
function d4DebateDecorate(){if(d4DebateContinueRemovedReply())return;d4DebatePrepareReturnPosition();screen.querySelector('[data-d4-debate-options]')?.remove();const q=d4Debate();if(!d4DebateInside())return;document.querySelector('#d4-debate-message')?.remove();if(q.phase==='choice'){const options=D4_DEBATE_SCRIPTS[q.script].options;screen.querySelector('#composer')?.insertAdjacentHTML('beforebegin','<div class="zero-choices" data-d4-debate-options>'+options.map((o,i)=>'<button data-d4-debate-choice="'+i+'">'+esc(o[0])+'</button>').join('')+'</div>')}renderStoryReply();scrollMessages()}
function d4DebateChoose(i){const q=d4Debate();if(!d4DebateInside()||q.phase!=='choice')return;const o=D4_DEBATE_SCRIPTS[q.script].options?.[i];if(!o)return;const old=q.script;q.decisions[old]=i;q.phase='chat';d4DebateWrite('me',o[0],'d4-debate-choice-'+old,o[2]||'text');d4DebateGo(o[1]);}
function d4DebateCG(){const q=d4Debate();if(q?.phase!=='cg')return;closeSheet();stopReading();view='day4-debate-cg';active=null;rememberRoute();zeroChrome();const shake=!q.shaken;q.shaken=true;screen.innerHTML='<section class="rd-cg'+(shake?' d4-confront-shake':'')+'"><img src="assets/day4-zhoumo-debate-updated.jpg?v=20261011-rc5" alt="握着手机的手"></section>';CGDialogue.present(screen.firstElementChild,D4_DEBATE_CG,{index:q.cgIndex||0,onIndex:i=>{q.cgIndex=i;persist()},onComplete:()=>{if(d4Debate()!==q)return;d4DebateGo('round1badEnd');openChat(HG_ID)}});persist()}
function d4DebatePickup(){if(deliveryHealthBlocked())return;const orders=deliveryOrders().filter(o=>!o.expired&&o.deliveryDate===state.system.date&&o.status!=='已完成');if(orders.length){const o=orders[0];o.status='待领取';state.story.deliveryNoticeIds=(state.story.deliveryNoticeIds||[]).filter(id=>id!==o.id);deliveryNotice(o)}else{d4ATop('d4-debate-parcel','校园物流','查看今日物资','前往校园物流查看取件情况','d4-debate-parcel')}}
let d4DebateLast=0,d4DebateSave=0;
function d4DebateTick(){if(d3Paused()||state.game.day!==4){d4DebateLast=0;return}d4DebateStart();if(d4DebateContinueRemovedReply())return;const q=d4Debate();if(!q)return;const now=Date.now(),elapsed=d4DebateLast?Math.min(500,now-d4DebateLast):0;d4DebateLast=now;
 if(q.phase==='notice-wait'){q.remaining=Math.max(0,q.remaining-elapsed);if(!q.remaining){if(q.script==='initial'){state.system.time='13:44';status();d4DebateGo('suggestion',true)}else d4DebateGo(q.next,true)}}
 if(q.phase==='joiners'){q.remaining=Math.max(0,q.remaining-elapsed);if(!q.remaining){const who=['yuwei','yelin','songjia','qiaoan','luyao'][q.joinIndex++];q.remaining=900;if(q.joinIndex>=5){q.phase='challenge-wait';q.remaining=2000}if(who){if(d4DebatePresent(who)){const c=state.contacts.find(c=>c.id===D4_A_GROUP),p=dayTwoPerson(who);if(c){c.members??=[];if(!c.members.includes(p.avatar))c.members.push(p.avatar);c.status='群成员：'+c.members.length+'人'}d4DebateWrite(who,p.name+'已加入群聊','d4-debate-joined-'+who,'system',D4_A_GROUP);if((q.joinNoticeCount||0)<2){q.joinNoticeCount=(q.joinNoticeCount||0)+1;d4ATop('d4-debate-join-notice','讯息','女生A栋临时互助群',p.name+'已加入群聊','d4-debate-a-group')}}}else{q.phase='challenge-wait';q.remaining=2000}persist()}}
 if(q.phase==='challenge-wait'){q.remaining=Math.max(0,q.remaining-elapsed);if(!q.remaining){state.system.time='13:59';status();d4DebateGo('aEvidence',true)}}
 if(q.phase==='chat'&&(d4DebateInside()||q.announce||window.StoryResumeRecovery?.allow('d4-debate'))){
 q.remaining=Math.max(0,q.remaining-elapsed);if(!(window.ReadHistory?ReadHistory.waiting('d4-debate',q,'remaining','remaining'):q.remaining)){const def=D4_DEBATE_SCRIPTS[q.script],row=def.rows[q.index];if(row){let who=d4DebateWho(row[0]);if(!d4DebatePresent(who)||(q.script==='challenge'&&['叶琳，你什么态度啊？','就你最性情了，行么'].includes(row[1])&&reportDeparted('叶琳'))){q.index++;persist();return}const text=d4DebateText(row[1]);if(who==='me'&&storyReplyGate(q.chat,text,'d4-debate:'+q.script+':'+q.index,'d4DebateTick'))return;if(q.script==='closing'&&row[1]==='但我不会害大家的，我也不希望大家被骗了'){state.system.time='15:42';state.game.period='下午';status()}if(q.script==='reliefEnd'){state.system.time='15:57';status()}const id='d4-debate-'+q.script+'-'+q.index++;q.remaining=messageSendDelay();d4DebateWrite(who,text,id,row[2]||'text');if(q.announce){q.announce=false;d4DebateNotice()}}
 else if(def.options){q.phase='choice';persist();d4DebateDecorate()}
 else if(def.cg){q.phase='cg';q.cgIndex=0;persist();d4DebateCG()}
 else if(def.vote)d4DebateVote(def.vote);
 else if(def.next)d4DebateGo(def.next,def.next==='relief'||q.script==='aEvidence');
 }}
 if(now-d4DebateSave>1000){d4DebateSave=now;persist()}
}
actions['d4-debate-chat']=()=>{document.querySelector('#d4-debate-message')?.remove();if(d4Debate())openChat(d4Debate().chat)};
actions['d4-debate-a-group']=()=>{document.querySelector('#d4-debate-join-notice')?.remove();openChat(D4_A_GROUP)};
actions['d4-debate-parcel']=()=>{document.querySelector('#d4-debate-parcel')?.remove();deliveryTab='待领取';deliveryList()};
const d4DebateVotesBase=actions['d4-delegation-open'];actions['d4-delegation-open']=function(...args){d4DebateStart();return d4DebateVotesBase(...args)};
const d4DebateAppBase=openApp;openApp=function(id,...args){const result=d4DebateAppBase(id,...args);if(id==='delegation'){d4DebateStart();document.querySelector('#d4-transfer-notice')?.remove()}return result};
const d4DebateChatBase=openChat;openChat=function(...args){const q=d4Debate();if(args[0]===HG_ID&&['invite','witness'].includes(q?.script)&&(view!=='chat'||active!==HG_ID))d4ChatReturnPositioned.delete(q);const result=d4DebateChatBase(...args);d4DebateDecorate();return result};
const d4DebateCleanupBase=cleanupSceneResume;cleanupSceneResume=function(...args){d4DebateLast=0;for(const id of ['d4-debate-message','d4-debate-votes','d4-debate-join-notice','d4-debate-parcel'])document.getElementById(id)?.remove();return d4DebateCleanupBase(...args)};
const d4DebateResumeBase=resumeStoryScene;resumeStoryScene=function(snapshot,...args){const result=d4DebateResumeBase(snapshot,...args);const q=d4Debate();if(state.game.day===4&&q){if(q.phase==='cg')d4DebateCG();else if(q.phase==='notice')d4DebateVoteNotice();else if(q.phase==='chat'&&!d4DebateInside())d4DebateNotice()}return result};
document.addEventListener('click',e=>{const b=e.target.closest('[data-d4-debate-choice]');if(b)d4DebateChoose(Number(b.dataset.d4DebateChoice))});
setInterval(d4DebateTick,100);

if(!d3Paused()&&state.game.day===4&&d4Debate()?.phase==='cg')d4DebateCG();

// Correct timestamps already written by earlier builds without replaying messages.
(function(){let changed=false;for(const [chat,rows]of Object.entries(state.messages||{})){for(const m of rows){const time=m.id==='d4-debate-closing-3'?'15:42':m.id==='d4-debate-reliefEnd-0'?'15:57':null;if(time&&m.time!==time){m.time=time;changed=true;const c=state.contacts.find(c=>c.id===chat);if(c&&rows[rows.length-1]===m)c.time=time}}}if(changed)persist()})();
