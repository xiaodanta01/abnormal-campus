/* Retired Song Jia routes must rewind; preserve all saves and collections. */
(()=>{
 const noticeId='songjia-route-update-notice',resultNode='day1-report-results-issued';
 function affected(progress){
  return Number(progress?.game?.day)>=2&&progress?.story?.dayOneReport?.groupResult?.target==='songjia';
 }
 function dismiss(){document.getElementById(noticeId)?.remove()}
 function show(progress){
  if(!affected(progress))return false;
  if(document.getElementById(noticeId))return true;
  cleanupSceneResume();
  window.mobileLaunch=false;view='game-menu';active=null;z().menu=true;zeroMenu();
  const available=!!nodeRecords()[resultNode]?.checkpoint;
  const el=document.createElement('div');el.id=noticeId;el.className='report-modal';
  el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-labelledby','songjia-route-update-title');
  el.innerHTML='<section><small>剧情更新</small><h2 id="songjia-route-update-title">线路有所调整</h2>'+
   '<p>你所在的线路有所调整，请回到「检举结束」重新读档。</p>'+
   '<p style="font-size:13px;line-height:1.8">第一日宋佳被投出后，将进入新的夜间结局。这条旧线路无法继续第二日及之后的剧情。</p>'+
   '<p style="font-size:13px;line-height:1.8">读取「检举结束」可以体验更新后的结局。若想继续后续剧情，请选择更早的抉择，改变集体投票结果。</p>'+
   (available?'<button type="button" data-route-update="result">读取「检举结束」</button>':'<p style="font-size:13px">未找到「检举结束」存档，请选择更早的抉择。</p>')+
   '<button type="button" data-route-update="nodes">选择更早的抉择</button>'+
   '<button type="button" data-route-update="menu">返回主页</button></section>';
  document.querySelector('#phone').append(el);return true;
 }
 storyRestoreGuards.push(show);
 const cleanupBase=cleanupSceneResume;
 cleanupSceneResume=function(...args){dismiss();return cleanupBase(...args)};
 // Capture before the menu can process clicks behind this modal.
 window.addEventListener('click',event=>{
  const modal=document.getElementById(noticeId);if(!modal)return;
  event.preventDefault();event.stopImmediatePropagation();
  const button=event.target.closest('[data-route-update]');if(!button||!modal.contains(button))return;
  const action=button.dataset.routeUpdate;dismiss();
  if(action==='result'){
   const checkpoint=nodeRecords()[resultNode]?.checkpoint;
   if(checkpoint){loadStoryNode(resultNode);return}
  }
  if(action==='nodes'||action==='result'){view='game-menu';zeroNodes();return}
  zeroMenu();
 },true);
 if(affected(state))show(state);
})();
