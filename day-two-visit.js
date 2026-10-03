/* Both food branches join here. Scene text and report UI use the existing renderers. */
const D2_VISIT_IMAGES={door408:'assets/day2-visit-408.jpg',lin:'assets/day2-visit-lin.jpg',down:'assets/day2-visit-down.jpg',door318:'assets/day2-visit-318.jpg',jiang:'assets/day2-visit-jiang-updated.jpg',zhou:'assets/day2-visit-zhou-updated.jpg',tears:'assets/day2-visit-tears-updated.jpg',back:'assets/day2-visit-back.jpg'};
function d2VisitLine(speaker,text){const key=speaker==='linqing'?'lin':speaker,person=dayTwoPerson(key);return {speaker,text,name:speaker==='me'?state.profile.name:person.name.replace(/[（(].*$/,''),avatar:person.avatar}}
function d2VisitScript(scene){return {
 door408:{image:'door408',rows:['林晴正在把要带过去的东西拿袋子装好。','你先走出了门，抬头看去，门上的门牌号又变回了408。','真是奇怪，为什么好端端的门牌号可以随意变换呢。'],next:'lin'},
 lin:{image:'lin',rows:['林晴已经拎着装好的东西走到了门口。',d2VisitLine('linqing','走吧')],next:'down'},
 down:{image:'down',travel:'正在前往3楼',rows:['电梯缓缓下行，最后停在三楼。'],next:'door318'},
 door318:{image:'door318',rows:[{sfx:'knock',text:'你跟着林晴找到316，抬手敲了敲门。'},'很快，里面传来了脚步声。',{sfx:'doorOpen',text:'门开了。'}],next:d2Visit()?.jiangAlive?'jiang':'zhou'},
 jiang:{image:'jiang',rows:[
  '江晓看见你和林晴，又低头看了眼我们手里的东西，明显愣了一下。',
  d2VisitLine('jiang','你们……真的来了。'),d2VisitLine('linqing','先拿进去吧。'),
  '江晓接过袋子，沉默了两秒。',d2VisitLine('jiang','……谢谢。'),
  d2VisitLine('jiang','真的。谢谢你们……我，我不知道该怎么说，但是真的很感谢'),
  '她说得有点断断续续，也一直没抬头。',d2VisitLine('me','先让周茉吃点东西吧。'),
  '你隐约看见，她的眼眶好像有点红。',d2VisitLine('jiang','谢谢你愿意相信我。')
 ],next:'back'},
 zhou:{image:'zhou',rows:[
  '周茉看到你们后，她先是愣了一下，随后目光落到了你们手中的袋子上。',d2VisitLine('zhoumo','你们真的来了……'),
  '话刚说完，她的眼睛一下就红了。','你甚至还没来得及开口，她的眼泪就已经掉了下来。'
 ],next:'tears'},
 tears:{image:'tears',rows:[
  '她慌乱地抬手擦了一下，眼泪却越擦越多。',d2VisitLine('zhoumo','我刚才一直在想……'),
  d2VisitLine('zhoumo','你不回我，是不是也没有吃的了'),d2VisitLine('zhoumo','我真的以为我要一个人待在这里等死了。'),
  '林晴把袋子递给她。',d2VisitLine('linqing','你看，我们不是来了吗。'),
  '周茉听到这句话，反而哭的更厉害了。',d2VisitLine('zhoumo','谢谢。'),d2VisitLine('zhoumo','真的……谢谢你们。')
 ],next:'back'},
 back:{image:'back',rows:['回去的路上，你一直在想：这种时候帮别人，算是圣母心吗？','你不知道。','但你不后悔做这个决定。'],next:'done'}
}[scene]}
function d2Visit(){return state.story.dayTwoVisit}
function d2VisitBusy(){return !!d2Visit()&&!d2Visit().done}
let visitDescentSound=null,visitDescentOwner=null;
function stopVisitDescentSound(){if(visitDescentSound){visitDescentSound.pause();visitDescentSound.currentTime=0}visitDescentOwner=null}
function syncVisitDescentSound(v){
 if(!v||v.done||v.scene!=='down'){stopVisitDescentSound();return}
 if(document.hidden||visitDescentOwner===v)return;visitDescentOwner=v;
 if(typeof mobileSounds!=='undefined'&&mobileSounds.silent)return;
 try{if(!visitDescentSound){visitDescentSound=new Audio('assets/audio/elevator-descent.mp3');visitDescentSound.volume=.5;visitDescentSound.loop=false}visitDescentSound.currentTime=0;const playing=visitDescentSound.play();if(playing&&playing.catch)playing.catch(()=>{})}catch(error){}
}
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopVisitDescentSound()});
window.addEventListener('pagehide',stopVisitDescentSound);
function d2VisitRender(){
 const v=d2Visit();syncVisitDescentSound(v);if(!v||v.done)return;const script=d2VisitScript(v.scene);if(!script)return;
 const previous=captureSceneSnapshot(screen);closeSheet();stopReading();document.querySelector('#day2-evening-notice')?.remove();
 view='day2-visit-cg';active=null;rememberRoute();zeroChrome();
 screen.innerHTML='<section class="rd-cg day2-visit"><img src="'+D2_VISIT_IMAGES[script.image]+'" alt="送食物的路上">'+(script.travel?'<div class="pickup16-travel"><h2>'+script.travel+'</h2></div>':'')+'</section>';
 CGDialogue.present(screen.firstElementChild,script.rows,{index:v.index,onIndex:i=>{if(d2Visit()===v){v.index=i;persist()}},onComplete:()=>{if(d2Visit()!==v||v.done)return;d2VisitNext(script.next)}});
 cgScreenCrossfade(previous);persist();
}
function d2VisitNext(scene){
 const v=d2Visit();if(!v||v.done)return;
 if(scene==='done'){stopVisitDescentSound();
  v.done=true;v.completedAt=Date.now();v.reportReadyAt=Date.now()+2000;d2Evening().phase='done';clearInterval(cgTypingTimer);
  state.system.time='20:59';state.game.period='晚上';persist();home();return;
 }
 v.scene=scene;v.index=0;persist();d2VisitRender();
}
function d2VisitStart(){
 if(d2Visit())return;const e=d2Evening();if(!e||e.result!=='eveningLinDone')return;
 e.phase='visit';state.story.dayTwoVisit={scene:'door408',index:0,jiangAlive:e.jiangAlive,done:false};persist();d2VisitRender();
}
function startDayTwoReport(){
 if(state.story.dayTwoReport||!d2Visit()?.done)return;
 state.system.time='21:00';state.game.period='晚上';
 state.story.dayTwoReport={day:2,phase:'home-wait',date:state.system.date,homeReadyAt:Date.now(),deadline:null,draft:'',name:null,submittedAt:null};
 persist();sendDayOneReport();status();
}
const d2VisitFinishBase=dayTwoFinish;dayTwoFinish=function(q,result){d2VisitFinishBase(q,result);if(q===d2Evening()&&result==='eveningLinDone'){q.phase='visit-wait';persist()}};
const d2VisitHomeBase=home;home=function(...args){if(d2VisitBusy()&&!window.mobileLaunch&&!['game-menu','nodes','zero-death'].includes(view))return d2VisitRender();return d2VisitHomeBase(...args)};
const d2VisitAppBase=openApp;openApp=function(...args){if(d2VisitBusy()&&!window.mobileLaunch&&!['game-menu','nodes','zero-death'].includes(view))return d2VisitRender();return d2VisitAppBase(...args)};
const d2VisitResumeBase=resumeStoryScene;resumeStoryScene=function(snapshot,...args){
 const result=d2VisitResumeBase(snapshot,...args);if(d2VisitBusy()&&!window.mobileLaunch&&!state.game.survivalEnding&&!['game-menu','nodes','zero-death'].includes(view))d2VisitRender();return result;
};
function d2VisitTick(){
 if(window.mobileLaunch||document.hidden||state.game.day!==2||state.game.survivalEnding||['game-menu','nodes','zero-death'].includes(view))return;
 const e=d2Evening(),v=d2Visit();
 if(!v&&e?.result==='eveningLinDone'&&['done','visit-wait'].includes(e.phase)){
  if(view==='chat'&&active==='linqing'&&!state.contacts.find(c=>c.id==='linqing')?.unread)d2VisitStart();else d2EveningNotice('linqing');
 }else if(v?.done&&!state.story.dayTwoReport&&Date.now()>=v.reportReadyAt)startDayTwoReport();
}
setInterval(d2VisitTick,200);
if(d2VisitBusy()&&!window.mobileLaunch&&!['game-menu','nodes','zero-death'].includes(view))d2VisitRender();
