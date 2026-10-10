// Hidden population scope: Lin Qing remains in the group roster but is not counted in the published campus total.
function campusPopulationCountsStudent(key){return !["lin","linqing","林晴"].includes(key)}
function syncPopulationDisplays(){
 const alive=state.game.campusPopulation?.alive,count=state.story.helpGroup?.count;
 if(Number.isFinite(alive))for(const el of document.querySelectorAll('[data-campus-alive]'))el.textContent=alive;
 if(Number.isFinite(count))for(const el of document.querySelectorAll('[data-group-roster-count]'))el.textContent=count;
}
const populationPersistBase=persist;persist=function(...args){const result=populationPersistBase(...args);syncPopulationDisplays();return result};
/* Public special-role notice; never exposes character identities. */
const SPECIAL_NOTICE={id:'special-role-notice',title:'【身份说明·特殊身份】',tag:'身份说明',time:'11:40',body:`目前存活人数：57人

当前身份配置：
普通生：44人
学生会：13人

普通生中，仅有3人持有特殊身份。

档案员：3人
每天可以选择两名仍然存活的学生，查询两人是否属于同一阵营。
系统只会返回“相同”或“不同”，不会显示两人的具体身份。`,comments:[]};
const SPECIAL_COMMENTS=[
 ['命运你阿帕次','怎么只剩57个人了？？？'],
 ['忧郁ID','昨天不是还有那么多人吗，发生什么了？'],
 ['茉莉雨','等一下，前面一直写的是“请离”，这里为什么有几处变成“清理”？'],
 ['moke_7ov','我也发现了，我觉得是故意的。',2,'茉莉雨'],
 ['呆呆猫','也可能只是用词不统一吧。',2,'moke_7ov'],
 ['moke_7ov','这种时候你还敢把它当错别字？',2,'呆呆猫'],
 ['茉莉雨','档案员千万别公开身份，学生会第一个找的就是你们。'],
 ['命运你阿帕次','档案员查到学生会也证明不了吧？身份页面又不能给别人看。']
];
function specialState(){return state.story.specialNotice??={published:false,due:null,banner:false,commentStep:0,nextGrowth:0,roleSchemaVersion:3}}
function specialPost(){return state.forumPosts.find(p=>p.id===SPECIAL_NOTICE.id)}
function specialBanner(){document.querySelector('#special-notification')?.remove();if(!specialState().banner)return;const el=document.createElement('div');el.id='special-notification';el.className='opening-message';el.innerHTML=`<button class="opening-body" data-action="special-open"><span class="zero-notice-icon">${icon('wall')}</span><span><small>校园通知 · 现在</small><strong>校园墙</strong><span>新的身份说明已发布</span></span></button><button class="opening-close" data-action="special-dismiss" aria-label="关闭消息通知">×</button>`;document.querySelector('#phone').append(el)}
function specialPublish(){const a=specialState();if(a.published)return;a.published=true;a.banner=true;if(!specialPost())state.forumPosts.push(nsPost(SPECIAL_NOTICE));state.game.campusPopulation={scope:'全校',alive:57,ordinary:44,council:13,special:3};zeroClock('11:40');persist();if(view==='wall')forum();specialBanner()}
const specialBase={forum,nsAnnouncementBody,nsComments,initializeChapter,retryStoryChoice};
forum=function(){specialBase.forum();if(view!=='wall'||!specialState().published)return;const alive=state.game.campusPopulation?.alive??57;screen.querySelector('.forum-intro')?.insertAdjacentHTML('afterend',`<div class="panel" style="padding:12px 16px;margin:12px 0;display:flex;align-items:center;justify-content:space-between"><strong style="font-size:14px">当前存活：<span data-campus-alive>${alive}</span>人</strong><small class="subtle">身份统计范围：全校</small></div>`)};
nsAnnouncementBody=function(p){if(p.id!==SPECIAL_NOTICE.id)return specialBase.nsAnnouncementBody(p);return esc(p.body).replace(/档案员：3人/g,t=>'<strong>'+t+'</strong>').replaceAll('普通生','<span style="color:#ffe566">普通生</span>').replaceAll('学生会','<span style="color:#b76b77">学生会</span>')};
nsComments=function(p){if(p.id!==SPECIAL_NOTICE.id)return specialBase.nsComments(p);return p.replies.map((r,i)=>{const key=p.id+'-'+i;const row=(c,nested=false)=>`<div class="rule-comment ${nested?'nested-comment':''}">${forumAvatar(c.author,c.name,c.gender)}<div class="comment-content"><div class="comment-heading"><strong>${esc(c.author==='me'?state.profile.name:c.name)}</strong></div><p>${c.replyTo?`回复 ${esc(c.replyTo)}：`:''}${esc(c.text)}</p>${c.time?`<small class="subtle">${esc(wallDateLabel(c,p.date))}</small>`:''}${!nested&&c.replies?.length?`<button class="thread-toggle" data-ns-thread="${key}">${nsThreads.has(key)?'收起回复':'展开 '+c.replies.length+' 条回复'}</button>${nsThreads.has(key)?c.replies.map(x=>row(x,true)).join(''):''}`:''}</div></div>`;return row(r)}).join('')};
Object.assign(actions,{'special-open':()=>{specialState().banner=false;specialBanner();persist();postDetail(SPECIAL_NOTICE.id)},'special-dismiss':()=>{specialState().banner=false;specialBanner();persist()}});
function specialTick(){if(!state.story.started||document.hidden||['game-menu','nodes'].includes(view)||zeroLock())return;const a=specialState(),now=Date.now();if(!a.published){if(jx().finishedAt||jx().phase==='done'){a.due??=(jx().finishedAt||now)+2000;if(now>=a.due)specialPublish()}return}if(!(view==='wall'||view==='post'&&active===SPECIAL_NOTICE.id))return;const p=specialPost();if(!p||now<a.nextGrowth)return;a.nextGrowth=now+2000;let commentsChanged=false;if(a.commentStep<SPECIAL_COMMENTS.length){const i=a.commentStep++,[name,text,parent,replyTo]=SPECIAL_COMMENTS[i];const r={id:'special-comment-'+i,name,text,time:specialCommentTime(i),author:'student1',replies:[],...(replyTo?{replyTo}:{})};if(parent===undefined)p.replies.push(r);else p.replies.find(c=>c.id==='special-comment-'+parent)?.replies.push(r);commentsChanged=true}growWallLikes(p,2+Math.floor(Math.random()*6),41);document.querySelectorAll('[data-ns-likes="'+p.id+'"]').forEach(el=>el.textContent=p.likes);document.querySelectorAll('[data-ns-count="'+p.id+'"]').forEach(el=>el.textContent=nsCommentCount(p.replies));if(commentsChanged&&view==='post'&&active===p.id){const el=document.querySelector('#ns-comments');if(el)el.innerHTML=nsComments(p)}persist()}
initializeChapter=function(...args){document.querySelector('#special-notification')?.remove();return specialBase.initializeChapter(...args)};

if(specialState().banner)specialBanner();setInterval(specialTick,250);

// Apply the shortened notice to previously published posts without changing interactions.
function shortenSpecialNotice(progress){if(!progress)return false;let changed=false;const story=progress.story??=( {} );const a=story.specialNotice??={published:false,due:null,banner:false,commentStep:0,nextGrowth:0,roleSchemaVersion:2};if(a.roleSchemaVersion!==2){const oldStep=Number(a.commentStep)||0;a.commentStep=Math.max(0,oldStep-Math.max(0,Math.min(2,oldStep-6)));const p=progress.forumPosts?.find(p=>p.id===SPECIAL_NOTICE.id);if(p){const clean=rows=>{for(let i=rows.length-1;i>=0;i--){const r=rows[i],match=/^special-comment-(\d+)$/.exec(r.id||''),index=match?Number(match[1]):-1;if(index===6||index===7){rows.splice(i,1);changed=true;continue}if(index===8||index===9){r.id='special-comment-'+(index-2);changed=true}if(r.replies)clean(r.replies)}};clean(p.replies||[])}a.roleSchemaVersion=2;changed=true}const p=progress.forumPosts?.find(p=>p.id===SPECIAL_NOTICE.id);if(p&&p.body!==SPECIAL_NOTICE.body){p.body=SPECIAL_NOTICE.body;changed=true}const population=progress.game?.campusPopulation;if(population&&population.special!==3){population.special=3;changed=true}return changed}
if(shortenSpecialNotice(state))persist();
{const records=nodeRecords();let changed=false;for(const r of Object.values(records))if(shortenSpecialNotice(r.checkpoint))changed=true;if(changed)saveNodes(records)}

function specialCommentTime(index){return ['11:40','11:41','11:42','11:42','11:43','11:43','11:45','11:46'][index]}
function updateSpecialTimes(progress){const p=progress?.forumPosts?.find(p=>p.id===SPECIAL_NOTICE.id);if(!p)return false;let changed=p.time!=='11:40';p.time='11:40';const walk=rows=>{for(const r of rows||[]){const match=/^special-comment-(\d+)$/.exec(r.id||'');if(match){const time=specialCommentTime(Number(match[1]));if(time&&r.time!==time){r.time=time;changed=true}}walk(r.replies)}};walk(p.replies);return changed}
if(updateSpecialTimes(state))persist();
{const records=nodeRecords();let changed=false;for(const r of Object.values(records))if(updateSpecialTimes(r.checkpoint))changed=true;if(changed)saveNodes(records)}

function migratePopulation57(progress){
 const p=progress?.game?.campusPopulation,s=progress?.story;if(!p||!s||p.progressVersion===1)return false;
 // Old migrations reset the live total to 57 on every refresh. Reconstruct once
 // from reached events, never from the current calendar or a later playthrough.
 const voteLoss=r=>r?.publicationComplete&&r.groupApplied&&r.groupResult&&campusPopulationCountsStudent(r.groupResult.target)?1:0;
 let alive=p.alive;
 if(s.dayTwoEvening?.departuresApplied){
  const e=s.dayTwoEvening;alive=Number.isFinite(e.population)?e.population:e.jiangAlive?35:34;
  alive-=voteLoss(s.dayTwoReport);
  const removed=progress.game.departedNpcs||{};
  for(const key of ['xianing','hanlu'])if(removed[key]?.cause==='day2-after-vote')alive--;
  if(s.dayTwoNight?.otherDormRemovalsApplied)alive-=3;
  if(s.dayThreeMorning?.jiangAlive&&s.dayThreeMorning.removalApplied)alive--;
  if(s.dayThreeReview?.departureApplied)alive--;
  const legacy=s.dayTwoPublicOutcome;if(legacy?.applied&&legacy.nightTarget!=='me'&&removed[legacy.nightTarget]?.cause==='night-death'&&removed[legacy.nightTarget]?.date===legacy.date)alive--;
 }else if(s.secondNightResult?.populationApplied)alive=47;
 else if(s.eveningAnomaly?.populationApplied)alive=51-voteLoss(s.dayOneReport);
 else if(s.specialNotice?.published)alive=57;
 else if(alive===129)alive=57;
 Object.assign(p,{alive:Math.max(0,alive),ordinary:44,council:13,special:3,progressVersion:1});
 // Repairing display history must not charge the danger ledger a second time.
 if(Number.isFinite(progress.game.dangerPopulation))progress.game.dangerPopulation=p.alive;
 return true;
}
if(migratePopulation57(state))persist();
{const records=nodeRecords();let changed=false;for(const r of Object.values(records))if(migratePopulation57(r.checkpoint))changed=true;if(changed)saveNodes(records)}
const specialForumCurrent=forum;
forum=function(...args){const result=specialForumCurrent(...args);if(view==='wall')for(const el of screen.querySelectorAll('strong'))el.textContent=el.textContent.replaceAll('129','57');return result};
function isIdentityFollowupPost(p){return !!p&&(p.id===SPECIAL_NOTICE.id||(p.nightService&&p.official))}
function migrateIdentityNoticeText(progress){const p=progress?.forumPosts?.find(x=>x.id===SPECIAL_NOTICE.id);if(!p)return false;let changed=false;const fix=row=>{if(row.text?.includes('129')){row.text=row.text.replaceAll('129','57');changed=true}for(const child of row.replies||[])fix(child)};if(p.body?.includes('129')){p.body=p.body.replaceAll('129','57');changed=true}for(const row of p.replies||[])fix(row);return changed}
function capIdentityLikes(progress){let changed=false;for(const p of progress?.forumPosts||[])if(isIdentityFollowupPost(p)&&p.likes>wallLikeLimit(p,41)){p.likes=wallLikeLimit(p,41);changed=true}return changed}
if(migrateIdentityNoticeText(state)||capIdentityLikes(state))persist();
{const records=nodeRecords();let changed=false;for(const r of Object.values(records))if(migrateIdentityNoticeText(r.checkpoint)||capIdentityLikes(r.checkpoint))changed=true;if(changed)saveNodes(records)}
setInterval(()=>{for(const p of state.forumPosts||[])if(isIdentityFollowupPost(p)&&p.likes>wallLikeLimit(p,41)){p.likes=wallLikeLimit(p,41);document.querySelectorAll('[data-ns-likes="'+p.id+'"]').forEach(el=>el.textContent=p.likes);persist()}},250);
