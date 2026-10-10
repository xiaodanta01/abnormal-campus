/* Only the morning vitals transition is authored here; story continues separately. */
STORY_CHOICES.push({id:'day4-start',title:'第四日开始',day:'第四日 · 早晨',chat:null});
function d4Morning(){return state.story.dayFourMorning}
let d4MorningInternal=false,d4MorningLastTick=0,d4MorningLastSave=0;
function d4MorningBusy(){return !!d4Morning()&&d4Morning().phase!=='done'}
function d4MorningStart(){if(d4Morning()||state.game.survivalEnding)return;state.story.dayFourMorning={phase:'sleep',remaining:1000};d3Night().phase='done';d4MorningRender();d4MorningLastTick=Date.now();d2Capture('day4-start',{view:'day4-sleep',active:null})}
function d4MorningRender(){const m=d4Morning();if(!m||m.phase==='done')return;closeSheet();stopReading();clearInterval(cgTypingTimer);document.querySelectorAll('.opening-message,#morning-title,.ending-morning-veil').forEach(e=>e.remove());
 if(m.phase==='sleep'){view='day4-sleep';active=null;rememberRoute();screen.innerHTML='<section class="ending-scene" style="background:#000"></section>';zeroChrome();persist();return}
 state.game.day=4;state.system.time='08:40';state.game.period='早晨';settleMorning();persist();d4MorningInternal=true;try{home()}finally{d4MorningInternal=false}view='day4-morning';active=null;rememberRoute();zeroChrome();
 const veil=document.createElement('div');veil.className='ending-morning-veil';const title=document.createElement('div');title.id='morning-title';title.className='morning-title';title.innerHTML='<strong>第四日</strong><span>新规实施最后一日</span>'+dailyVitalsMarkup();document.querySelector('#phone').append(veil,title);persist();
}
function d4MorningFinish(){const m=d4Morning();if(m?.phase!=='transition')return;document.querySelectorAll('#morning-title,.ending-morning-veil').forEach(e=>e.remove());m.phase='done';m.vitalsShown=true;view='home';persist();checkSurvival();if(!state.game.survivalEnding)home()}
const d4NightNextBase=d3NightNext;d3NightNext=function(key,...args){if(key==='finished'){d4MorningStart();return}return d4NightNextBase(key,...args)};
const d4LockBase=zeroLock;zeroLock=function(){return !d4MorningInternal&&d4MorningBusy()&&!['game-menu','nodes'].includes(view)||d4LockBase()};
const d4HomeBase=home;home=function(...args){if(d4MorningBusy()&&!d4MorningInternal&&!d3Paused())return;return d4HomeBase(...args)};
const d4CleanupBase=cleanupSceneResume;cleanupSceneResume=function(...args){d4MorningLastTick=0;document.querySelectorAll('#morning-title,.ending-morning-veil').forEach(e=>e.remove());return d4CleanupBase(...args)};
const d4ResumeBase=resumeStoryScene;resumeStoryScene=function(snapshot,...args){if(!snapshot?.story?.dayFourMorning)return d4ResumeBase(snapshot,...args);if(d4MorningBusy()){d4MorningRender()}else{view='home';checkSurvival();if(!state.game.survivalEnding)home()}persist()};
setInterval(()=>{if(d3Paused()){d4MorningLastTick=0;return}if(!d4Morning()&&d3Night()?.phase==='finished'){d4MorningStart();return}const m=d4Morning();if(!m||m.phase==='done')return;const now=Date.now(),elapsed=d4MorningLastTick?now-d4MorningLastTick:0;d4MorningLastTick=now;m.remaining=Math.max(0,m.remaining-elapsed);if(!m.remaining){if(m.phase==='sleep'){m.phase='transition';m.remaining=4500;d4MorningRender()}else d4MorningFinish()}else if(now-d4MorningLastSave>=1000){d4MorningLastSave=now;persist()}},100);
if(!d3Paused()&&d4MorningBusy()){if(d4Morning().phase==='transition')d4Morning().remaining=4500;d4MorningRender()}

// Fourth-morning departures share the normal message cadence and saved progress.
const D4_GROUP_ROWS=[['remove','songyan','宋妍','405'],['remove','zhoumo','周茉','316'],['baizhi','怎么就只少了两个人？'],['shen','可能是校医志愿者保护了一个被学生会选中的人']];
function d4RemovePerson(key,name){
 state.game.departedNpcs??={};if(state.game.departedNpcs[key])return;
 state.game.departedNpcs[key]={date:state.system.date,cause:'day4-night-death'};
 if(Number.isFinite(state.game.campusPopulation?.alive))state.game.campusPopulation.alive=Math.max(0,state.game.campusPopulation.alive-1);
 const person=FA_PEOPLE[key],group=hgContact();if(group){const members=group.members||[],ids=[key,person?.contact,person?.avatar,dayTwoPerson(key).avatar,PORTRAIT_CHARACTERS[name]].filter(Boolean);let i=members.findIndex(id=>ids.includes(id));if(i<0)i=members.findLastIndex(id=>id.startsWith('stranger-'));if(i>=0)members.splice(i,1);hg().count=Math.max(0,hg().count-1);group.status='群成员：'+hg().count+'人'}
 for(const c of state.contacts)if(c.id===key||c.id===person?.contact||c.name?.replace(/[（(].*$/,'').trim()===name){c.status='已离校';c.online=false}
 for(const f of [state.story.freeAction,state.story.dayTwoFreeAction])for(const clue of f?.clues||[])if(clue.id==='members')clue.removedMembers=[...new Set([...(clue.removedMembers||[]),key])];
}
let d4GroupLastTick=0;
function d4GroupTick(){
 if(d3Paused()||state.game.survivalEnding||state.game.day!==4||d4Morning()?.phase!=='done'){d4GroupLastTick=0;return}
 const now=Date.now(),elapsed=d4GroupLastTick?now-d4GroupLastTick:0;d4GroupLastTick=now;
 const q=state.story.dayFourGroup??={index:0,remaining:messageSendDelay()};if(q.index>=D4_GROUP_ROWS.length)return;
 const inside=view==='chat'&&active===HG_ID;if(q.index&&!inside&&!window.StoryResumeRecovery?.allow('d4-group'))return;
 q.remaining=Math.max(0,q.remaining-elapsed);if(q.remaining)return;
 const index=q.index++,row=D4_GROUP_ROWS[index],rows=state.messages[HG_ID]??=[],id='day4-morning-group-'+index;q.remaining=messageSendDelay();
 const added=!rows.some(m=>m.id===id);let text;if(row[0]==='remove'){d4RemovePerson(row[1],row[2]);text='沈可欣已将'+row[2]+'（'+row[3]+'）移出群聊';if(!rows.some(m=>m.id===id))rows.push({id,type:'system',text,time:state.system.time,gameDate:state.system.date})}
 else{const person=dayTwoPerson(row[0]);if(reportDeparted(GROUP_SUSPECT_NAMES[row[0]])){persist();return}text=row[1];if(!rows.some(m=>m.id===id))rows.push({id,type:'text',text,sender:person.avatar,name:person.name,hgWho:row[0],time:state.system.time,gameDate:state.system.date,status:'read'})}
 const group=hgContact();if(group){group.preview=text;group.time=state.system.time;if(!inside&&added)group.unread=(group.unread||0)+1}persist();if(inside)openChat(HG_ID);else{hgNotice('group');const notice=document.querySelector('#hg-notification');if(notice)notice.dataset.ringtonePlayed='true';if(added)playNotificationSound('message');status()}
}
setInterval(d4GroupTick,100);

// Apply only missing population losses in this snapshot; never reset later totals.
function reconcileCampusLosses(progress){
 const g=progress?.game,s=progress?.story;if(!g||!s||!Number.isFinite(g.campusPopulation?.alive))return;
 const e=s.dayTwoEvening;if(e?.departuresApplied&&e.rosterVersion===2&&!e.populationBalanceVersion){const old=Number.isFinite(e.population)?e.population:(e.jiangAlive?34:33);g.campusPopulation.alive=Math.max(0,g.campusPopulation.alive-(old-31));e.population=31;e.populationLoss=16;e.populationBalanceVersion=1}
 const m=s.dayThreeMorning;if(m&&['chat','survey-wait','done'].includes(m.phase)&&!m.otherDormPopulationApplied){g.campusPopulation.alive=Math.max(0,g.campusPopulation.alive-(m.jiangAlive?2:3));m.otherDormPopulationApplied=true}
}
const populationLossPersistBase=persist;persist=function(...args){reconcileCampusLosses(state);return populationLossPersistBase(...args)};
storySnapshotMigrations.push(reconcileCampusLosses);
reconcileCampusLosses(state);persist();
