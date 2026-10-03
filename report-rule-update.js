/* Personal report errors are independent of NPC suspicion totals. */
function checkReportErrorLimit(){
 const count=state.game.identity?.wrongReports||0;
 state.game.reportErrorStatus=count>=2?'left':count===1?'warning':'safe';
 if(count<2||['game-menu','nodes'].includes(view))return false;
 if(state.game.reportErrorEnding)return true;
 const round=typeof dayReport==='function'?dayReport():null;
 // All report days share this limit; only the published, settled result may end the run.
 if(round?.submittedAt&&(!round.publicationComplete||!state.game.personalReports?.[round.date]?.settled))return false;
 if(typeof beginLateDeath!=='function'||state.story.lateDayDeath||state.game.survivalEnding)return false;
 state.game.reportErrorEnding=true;
 if(typeof pickup16Cleanup==='function')pickup16Cleanup();
 if(state.story.afternoonPickup&&!state.story.afternoonPickup.done){state.story.afternoonPickup.done=true;state.story.afternoonPickup.phase='failed'}
 state.story.afternoonCommonReady=false;
 beginLateDeath('report-errors');persist();return true;
}
function migrateReportRules(progress){if(!progress)return;for(const post of progress.forumPosts||[]){if(post.id===NS.rules.id)post.body=NS.rules.body;else if(typeof post.body==='string')post.body=post.body.replaceAll('第三次错误检举','第二次错误检举')}const count=progress.game?.identity?.wrongReports||0;if(progress.game)progress.game.reportErrorStatus=count>=2?'left':count===1?'warning':'safe'}
migrateReportRules(state);const reportRuleNodes=nodeRecords();for(const node of Object.values(reportRuleNodes))migrateReportRules(node.checkpoint);saveNodes(reportRuleNodes);persist();
setInterval(()=>{if(!window.mobileLaunch)checkReportErrorLimit()},250);
if(view==='ns-identity')nsIdentity();else if(view==='post'&&active===NS.rules.id)postDetail(active);
