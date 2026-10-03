/* Shared campus card for ordinary access and story-driven status updates. */
function campusPageMarkup(departed=false){
 const abnormal=departed||state.story?.campusAbnormal;
 return `<section class="app-page campus-page">${head('校园通')}<div class="campus-intro"><span>东川大学</span><small>我的校园服务</small></div><article class="campus-card ${departed?'campus-card-departed':''}"><div class="campus-card-top"><span>校园电子卡</span>${icon('user')}</div><div class="campus-owner">${avatar('me')}<div><h2>${esc(state.profile?.name||'同学')}</h2><p>${departed?'离校':'在校学生'}</p></div></div><div class="campus-card-bottom"><span>东川大学</span><span>校园通</span></div></article><div class="campus-status" data-campus-condition><span class="campus-condition ${abnormal?'campus-condition-abnormal':''}"><i class="live-dot"></i>校园运行${abnormal?'异常':'正常'}</span><small>${esc(state.system.time)}</small></div><h3 class="campus-section-title">${departed?'个人资料':'账户信息'}</h3><div class="campus-detail-list">${departed?`<div><span>姓名</span><strong>${esc(state.profile?.name||'同学')}</strong></div><div><span>门禁权限</span><strong class="campus-revoked">已注销</strong></div><div><span>学籍状态</span><strong class="campus-revoked">已注销</strong></div><div><span>学生状态</span><strong class="campus-revoked">离校</strong></div>`:`<div><span>校园信用</span><strong>${esc(state.game.credit)}</strong></div><div><span>终端连接</span><strong>校内网络</strong></div>`}</div><h3 class="campus-section-title">校园服务</h3><div class="panel campus-services"><button class="campus-lock-entry" disabled aria-label="住宿服务，暂未开放"><span class="campus-service-icon">${icon('lock')}</span><span><strong>住宿服务</strong><small>暂未开放</small></span><span class="campus-service-lock">${icon('lock')}</span></button></div></section>`;
}
// Personal writing is separate from all story snapshots and choice checkpoints.
const PERSONAL_NOTE_KEY=(new URLSearchParams(location.search).get('dev')==='1'?'afterclass-day1-test':'afterclass-v1')+'-personal-note';
let personalNotebookValue='';
try{
 const stored=GameStorage.getItem(PERSONAL_NOTE_KEY);
 if(stored!==null)personalNotebookValue=stored;
 else{
  const progressKey=PERSONAL_NOTE_KEY.replace(/-personal-note$/,'');
  for(const key of [progressKey,progressKey+'-continue']){
   const progress=JSON.parse(GameStorage.getItem(key)||'null');
   if(typeof progress?.note==='string'){personalNotebookValue=progress.note;break}
  }
  GameStorage.setItem(PERSONAL_NOTE_KEY,personalNotebookValue);
 }
}catch{}
function savePersonalNotebook(value){personalNotebookValue=String(value);try{GameStorage.setItem(PERSONAL_NOTE_KEY,personalNotebookValue);return true}catch{toast('备忘录未能保存，请检查浏览器存储权限');return false}}
document.addEventListener('input',event=>{if(event.target.id==='note-text')savePersonalNotebook(event.target.value)});
function notebookElevatorReminder(){
 const pickup=state.story?.dayTwoPickup;
 if(state.game.day<2||!(pickup?.puzzleToken||pickup?.elevatorSolved))return '';
 return "<article class=\"notebook-paper notebook-reminder\"><div class=\"notebook-paper-head\"><span>提示</span></div><p>你所在的宿舍是408</p><table aria-label=\"电梯楼层对照\"><tbody><tr><th scope=\"row\">原本的电梯楼层</th><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td></tr><tr><th scope=\"row\">现在的电梯楼层</th><td>1</td><td>7</td><td>5</td><td>8</td><td>3</td><td>9</td><td>2</td></tr></tbody></table></article>";
}
function notebookPageMarkup(){return `<section class="app-page notebook-page">${head('备忘录')}<div class="notebook-intro"><div><h2>随手记</h2><p>记下此刻，留待回看。</p></div><span class="notebook-emblem">${icon('file')}</span></div>${notebookElevatorReminder()}<article class="notebook-paper"><div class="notebook-paper-head"><span>我的笔记</span><time>${esc(state.system.date.replaceAll('-','.'))}</time></div><label for="note-text" class="notebook-label">笔记内容</label><textarea class="note-input" id="note-text" placeholder="有什么想记下来的？">${esc(personalNotebookValue)}</textarea><div class="notebook-paper-foot"><span>自动保存，回溯后保留</span>${icon('file')}</div></article><button class="primary notebook-save" data-action="save-note">保存备忘录</button></section>`}
