/* Post-goodnight branch; the letter and its punctuation belong to the restored save. */
const D3_ZHOU_LETTER_ID='day3-zhou-last-letter';
const D3_ZHOU_LETTER=`亲爱的【玩家名字】：
当你看到这封信的时候，我可能已经“离校”了。
哈哈，这种开头好像只有小说和电视剧里才会出现，真的写出来，感觉好奇怪。

昨天晚上，我被分配到了校医志愿者的身份。
看到身份的那一刻，我不知道自己应该高兴，还是应该难过。

高兴的是，我终于可以报答你了。我不再是那个什么都做不了，只能躲在别人身后的女孩。至少这一次，我也可以保护自己想保护、也有能力保护的人了。

难过的是，如果我能早一天得到这个身份就好了——那样的话，说不定江晓现在还会在我身边。
不过，往好处想，如果我真的被请离了，是不是就能见到她了？

万一这一切只是一场游戏呢？
也许只有被淘汰的人才会知道，原来所谓的“请离”，只是游戏失败而已。大家其实都好好的，只是提前离开了这里。

虽然今天有不少人在怀疑你，但我只知道你在我最害怕的时候拉过我一把，我没有办法装作什么都没有发生。
而且，我好像还是老样子。
只要有人对我好一点，我就会忍不住相信对方。

以前我总觉得这是自己最大的缺点，不过这一次，我不想改。
我报答了那个曾经拉过我一把的人。
想到这里，我其实很开心。

【玩家名字】，祝你一切顺利。（不要回复我哦，别忘记啦）`;
function d3Letter(){return state.story.dayThreeLastLetter}
function d3LetterBusy(){return ['black','notice','reading'].includes(d3Letter()?.phase)}
function d3LetterBlack(){view='day3-letter-black';active=null;rememberRoute();screen.innerHTML='<section class="ending-scene" style="background:#000"></section>';zeroChrome();persist()}
function d3LetterStart(){if(d3Letter())return;state.story.dayThreeLastLetter={phase:'black',remaining:1000};d3Night().phase='done';const previous=captureSceneSnapshot(screen);closeSheet();clearInterval(cgTypingTimer);d3LetterBlack();zeroDissolve(previous,600);d3LetterLastTick=Date.now()}
function d3LetterNotice(){if(document.querySelector('#day3-letter-notice'))return;const c=state.contacts.find(c=>c.id===FA_PEOPLE.zhoumo.contact),el=document.createElement('div');el.id='day3-letter-notice';el.className='opening-message';el.innerHTML='<button class="opening-body" data-action="day3-letter-open"><span>'+avatar(c?.avatar||FA_PEOPLE.zhoumo.avatar)+'</span><span><small>讯息 · 01:03</small><strong>周茉</strong><span>'+esc('亲爱的'+state.profile.name+'：')+'</span></span></button>';document.querySelector('#phone').append(el);playNotificationSound('message')}
function d3LetterPublish(){const q=d3Letter();if(q?.phase!=='black')return;if(reportDeparted('周茉')){q.phase='failed';persist();beginLateDeath('day3-unprotected');screen.innerHTML='<section class="ending-scene" style="background:#000"></section>';return}
 state.system.time='01:03';q.phase='notice';const chat=FA_PEOPLE.zhoumo.contact;let c=state.contacts.find(c=>c.id===chat);if(!c){c={id:chat,name:'周茉',avatar:FA_PEOPLE.zhoumo.avatar,unread:0};state.contacts.push(c)}const rows=state.messages[chat]??=[];if(!rows.some(m=>m.id===D3_ZHOU_LETTER_ID)){rows.push({id:D3_ZHOU_LETTER_ID,type:'text',sender:c.avatar,name:'周茉',text:d3EveningText(D3_ZHOU_LETTER),preservePunctuation:true,time:'01:03',gameDate:state.system.date,status:'read'});c.unread=(c.unread||0)+1}c.preview='亲爱的'+state.profile.name+'：';c.time='01:03';persist();status();d3LetterNotice();
}
function d3LetterOpen(){if(!['notice','reading'].includes(d3Letter()?.phase))return;d3Letter().phase='reading';document.querySelector('#day3-letter-notice')?.remove();const c=state.contacts.find(c=>c.id===FA_PEOPLE.zhoumo.contact);if(c)c.unread=0;view='day3-letter';active=FA_PEOPLE.zhoumo.contact;rememberRoute();screen.innerHTML='<section class="chat-page"><header class="chat-head">'+avatar(c?.avatar||FA_PEOPLE.zhoumo.avatar)+'<div class="person"><strong>周茉</strong></div></header><div class="messages"><div class="divider message-group-time">01:03</div><div class="message"><div class="message-main"><div class="bubble" data-preserve-punctuation style="white-space:pre-wrap">'+esc(d3EveningText(D3_ZHOU_LETTER))+'</div></div></div></div></section>';midnightContinue.hidden=false;zeroChrome();refreshPhoneBack();persist()}
function d3LetterSleep(){if(d3Letter()?.phase!=='reading')return;d3Letter().phase='done';midnightContinue.hidden=true;persist();d4MorningStart()}
const d3LetterNextBase=d3NightNext;d3NightNext=function(key,...args){if(key==='finished'){d3LetterStart();return}return d3LetterNextBase(key,...args)};
const d3LetterReadingBase=midnightRulesReading;midnightRulesReading=function(){return view==='day3-letter'&&d3Letter()?.phase==='reading'||d3LetterReadingBase()};
const d3LetterSleepBase=midnightContinue.onclick;midnightContinue.onclick=function(e){if(view==='day3-letter'&&d3Letter()?.phase==='reading')return d3LetterSleep();return d3LetterSleepBase.call(this,e)};
const d3LetterLockBase=zeroLock;zeroLock=function(){return d3LetterBusy()&&!['game-menu','nodes'].includes(view)||d3LetterLockBase()};
const d3LetterHomeBase=home;home=function(...args){if(d3LetterBusy()&&!d3Paused())return;return d3LetterHomeBase(...args)};
const d3LetterCleanupBase=cleanupSceneResume;cleanupSceneResume=function(...args){d3LetterLastTick=0;document.querySelector('#day3-letter-notice')?.remove();return d3LetterCleanupBase(...args)};
const d3LetterResumeBase=resumeStoryScene;resumeStoryScene=function(snapshot,...args){if(!['black','notice','reading'].includes(snapshot?.story?.dayThreeLastLetter?.phase))return d3LetterResumeBase(snapshot,...args);if(d3Letter().phase==='reading')d3LetterOpen();else{d3LetterBlack();if(d3Letter().phase==='notice')d3LetterNotice()}persist()};
window.addEventListener('click',e=>{if(e.target.closest('[data-action="day3-letter-open"]')){e.preventDefault();e.stopImmediatePropagation();d3LetterOpen()}},true);
let d3LetterLastTick=0;
setInterval(()=>{if(d3Paused()){d3LetterLastTick=0;return}const now=Date.now(),elapsed=d3LetterLastTick?now-d3LetterLastTick:0;d3LetterLastTick=now;if(d3Letter()?.phase==='black'){d3Letter().remaining=Math.max(0,d3Letter().remaining-elapsed);if(!d3Letter().remaining)d3LetterPublish()}},100);
if(!d3Paused()&&d3LetterBusy()){if(d3Letter().phase==='reading')d3LetterOpen();else{d3LetterBlack();if(d3Letter().phase==='notice')d3LetterNotice()}}
