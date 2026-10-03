/* Forum dates are stored separately from their display labels. */
function wallDateLabel(row,fallback='2045-09-07'){
 const clock=String(row.time||'').match(/\d{1,2}:\d{2}/)?.[0]||'00:00';
 const date=row.date||fallback,today=state.system.date||'2045-09-07';
 const days=Math.round((Date.parse(today+'T00:00:00Z')-Date.parse(date+'T00:00:00Z'))/86400000);
 const [y,m,d]=date.split('-').map(Number);
 return (y!==Number(today.slice(0,4))?y+'年'+m+'月'+d+'日 ':days===0?'':days===1?'昨天 ':days===2?'前天 ':m+'月'+d+'日 ')+clock;
}
function wallStampRows(rows,date,time){for(const row of rows||[]){row.date??=date;row.time??=time;wallStampRows(row.replies,row.date,row.time)}}
function wallStampProgress(progress){if(!progress)return;for(const p of progress.forumPosts||[]){p.date??=p.author==='me'?(progress.system?.date||'2045-09-07'):'2045-09-07';wallStampRows(p.replies,p.date,p.time)}wallStampRows(progress.story?.comments,'2045-09-07','20:37')}
