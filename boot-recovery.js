/* Self-contained recovery UI, loaded before storage and story scripts. */
window.BootRecovery=(()=>{
 const original={},errors=[],delay=window.setTimeout.bind(window),cancelDelay=window.clearTimeout.bind(window);
 const progressKey='campus-recovery-progress',steps=['备份存档','检查存档','修复存档','恢复游戏'];
 let failed=false,ready=false,backupPath='',panel=null,busy=false,runId=0,watchdog=0,mode='idle',completed=0,current=-1,issue='';
 const owns=k=>/^(afterclass-|abnormal-campus-)/.test(k);
 function lifecycle(event){window.desktopWindow?.logStartupEvent?.({event,readyState:document.readyState,loading:document.documentElement.classList.contains('mobile-loading'),errors:errors.length})}
 function backup(){
  if(backupPath||!Object.keys(original).length)return backupPath;
  const raw=JSON.stringify({format:1,origin:location.origin,storage:original});
  if(window.desktopWindow?.backupStorage){const result=window.desktopWindow.backupStorage(raw);if(!result.ok)throw new Error('存档备份失败：'+result.error);backupPath=result.path}
  else {localStorage.setItem('campus-recovery-backup',raw);backupPath='campus-recovery-backup'}
  return backupPath;
 }
 function errorText(){return [issue,...errors.map(e=>[e.message,[e.file,e.line,e.column].filter(Boolean).join(':'),e.stack].filter(Boolean).join('\n'))].filter(Boolean).join('\n\n').slice(0,10000)}
 function details(){if(!panel)return;const text=errorText();panel.querySelector('details').hidden=!text;panel.querySelector('pre').textContent=text;panel.querySelector('[data-recovery="copy"]').hidden=!text}
 function paint(title,description,status,indeterminate=false){
  if(!panel)return;panel.dataset.mode=mode;panel.dataset.stage=String(current);
  panel.querySelector('h1').textContent=title;panel.querySelector('.recovery-description').textContent=description;panel.querySelector('.recovery-status').textContent=status;
  panel.querySelector('.recovery-count').textContent=completed===4?'已完成':completed+' / 4 步';
  const bar=panel.querySelector('[role="progressbar"]');bar.classList.toggle('is-indeterminate',indeterminate);bar.setAttribute('aria-valuetext',status);
  if(indeterminate)bar.removeAttribute('aria-valuenow');else bar.setAttribute('aria-valuenow',String(completed));bar.querySelector('span').style.width=(completed*25)+'%';
  panel.querySelectorAll('.recovery-step').forEach((el,i)=>{el.classList.toggle('is-done',i<completed);el.classList.toggle('is-current',i===current);el.querySelector('small').textContent=i<completed?'已完成':i===current?(mode==='error'?'待重试':'进行中'):'等待中'});
  const primary=panel.querySelector('[data-recovery="continue"]'),home=panel.querySelector('[data-recovery="menu"]');
  primary.disabled=home.disabled=busy||mode==='success';primary.textContent=busy?'正在处理，请稍候':mode==='error'&&issue?'重试修复':'尝试修复并继续';
  panel.querySelector('.recovery-protection').textContent=backupPath?'原存档已备份，修复不会清空游戏进度。':'修复前会先备份存档，不会清空游戏进度。';details();
 }
 function stopWatch(){cancelDelay(watchdog);watchdog=0}
 function armWatch(){stopWatch();const token=runId;watchdog=delay(()=>{if(token!==runId||!panel)return;runId++;busy=false;mode='error';issue='等待超过 30 秒仍未完成。可以重试；如果反复出现，请复制错误信息反馈。';paint('恢复暂时未完成','原存档没有被清空。请重试，或尝试返回游戏主页。',current>=0?steps[current]+'耗时较长':'启动耗时较长');lifecycle('repair-timeout')},30000)}
 function fail(error){stopWatch();busy=false;mode='error';issue=String(error.message||error);paint('修复暂时未完成','原存档已保留。请根据下方提示重试，或复制信息反馈。',issue);window.desktopWindow?.logStartupError({message:issue,stack:error.stack,type:'repair'});lifecycle('repair-failed')}
 function record(error){
  errors.push(error);if(!ready)failed=true;window.desktopWindow?.logStartupError(error);
  if(panel){
   if(!ready&&mode==='restoring'){stopWatch();runId++;busy=false;mode='error';paint('游戏启动失败','恢复时仍遇到问题，原存档已保留。可重试或复制错误信息反馈。','恢复游戏时遇到问题')}
   else if(!busy&&!ready){mode='error';paint('游戏启动失败','校园终端暂时没有回应。我们会先保护存档，再尝试恢复。','等待开始修复')}
   details();
  }
 }
 window.addEventListener('error',e=>{if(e instanceof ErrorEvent)record({message:e.message,file:e.filename,line:e.lineno,column:e.colno,stack:e.error?.stack||''})});
 window.addEventListener('unhandledrejection',e=>record({message:String(e.reason?.message||e.reason),stack:e.reason?.stack||'',type:'unhandledrejection'}));
 async function copyError(){
  const text=errorText();if(!text)return;let copied=false;
  try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text);copied=true}}catch{}
  if(!copied){const field=document.createElement('textarea');field.value=text;field.style.cssText='position:fixed;left:0;top:0;opacity:0';panel.append(field);field.select();try{copied=document.execCommand('copy')}catch{}field.remove()}
  if(panel)panel.querySelector('.recovery-feedback').textContent=copied?'错误信息已复制，可发送给开发者。':'未能自动复制，请展开下方错误详情手动复制。';
 }
 // Registered before scene capture locks; native keyboard activation still works.
 function recoveryInput(e){
  if(!panel||!panel.contains(e.target))return;e.stopImmediatePropagation();if(e.type!=='click')return;
  const button=e.target.closest('[data-recovery]');if(!button||button.disabled)return;e.preventDefault();
  if(button.dataset.recovery==='copy')copyError();else recover(button.dataset.recovery==='continue');
 }
 window.addEventListener('click',recoveryInput,true);window.addEventListener('keydown',recoveryInput,true);
 function yieldPaint(token){return new Promise(resolve=>delay(resolve,32)).then(()=>{if(token!==runId)throw new Error('recovery-cancelled')})}
 async function recover(resume){
  if(busy)return;busy=true;issue='';completed=0;current=0;mode='working';panel.querySelector('.recovery-feedback').textContent='';const token=++runId,written=[];
  lifecycle(resume?'repair-continue-click':'repair-menu-click');
  function stage(index,status){current=index;completed=index;paint('正在恢复你的进度','请稍候，完成后会自动'+(resume?'继续游戏。':'返回游戏主页。'),status,true);armWatch()}
  try{
   stage(0,'正在备份原始存档…');await yieldPaint(token);backup();
   stage(1,'正在检查存档结构…');await yieldPaint(token);
   if(typeof GameStorage==='undefined'||!window.SaveSchema)throw new Error('游戏文件未完整加载，请保留存档并重新解压完整游戏包。');
   const keys=Object.keys(original).filter(key=>/^afterclass-(v1(?:-continue)?|day1-test)$/.test(key)),decoded=[],writes=[];
   for(let i=0;i<keys.length;i++){
    const key=keys[i],value=JSON.parse(GameStorage.decode(original[key]));
    if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('存档内容无法识别：'+key);
    decoded.push([key,value]);paint('正在恢复你的进度','检查原有进度，不会重新开始剧情。','已检查 '+(i+1)+' / '+keys.length+' 份存档');await yieldPaint(token);
   }
   stage(2,'正在修复存档…');await yieldPaint(token);
   // Validate all replacements before writing; keep the original backup intact.
   for(let i=0;i<decoded.length;i++){
    const [key,value]=decoded[i];writes.push([key,GameStorage.encode(JSON.stringify(SaveSchema.normalize(value)))]);
    paint('正在恢复你的进度','保留剧情进度、角色好感和已收集内容。','已处理 '+(i+1)+' / '+decoded.length+' 份存档');await yieldPaint(token);
   }
   for(const [key,value] of writes){localStorage.setItem(key,value);written.push(key)}
   stage(3,'正在重新打开游戏…');await yieldPaint(token);
   sessionStorage.setItem('campus-recovery-route',resume?'continue':'menu');sessionStorage.setItem(progressKey,'restoring');lifecycle('repair-reload');location.reload();
  }catch(error){
   if(token!==runId)return;
   for(const key of written)try{localStorage.setItem(key,original[key])}catch(restoreError){errors.push({message:'原存档回写失败，请保留备份：'+restoreError.message})}
   try{sessionStorage.removeItem('campus-recovery-route');sessionStorage.removeItem(progressKey)}catch{}
   fail(error);
  }
 }
 function show(){
  if(panel)return;window.mobileLaunch=true;document.documentElement.classList.remove('mobile-loading');
  panel=document.createElement('section');panel.id='boot-failure';panel.setAttribute('role','region');panel.setAttribute('aria-labelledby','recovery-title');
  panel.innerHTML=`<style>
   #boot-failure{position:fixed;inset:0;z-index:2147483647;overflow:auto;display:flex;align-items:center;justify-content:center;padding:32px 20px;background:radial-gradient(ellipse at 50% 25%,#302738 0,transparent 60%),#121117;color:#ebe6ee;font:14px/1.65 "Microsoft YaHei",sans-serif;color-scheme:dark;isolation:isolate}
   #boot-failure,#boot-failure *{box-sizing:border-box}#boot-failure [hidden]{display:none!important}#boot-failure:before{content:"";position:fixed;inset:0;z-index:-1;opacity:.16;pointer-events:none;background-image:linear-gradient(#bca9ce15 1px,transparent 1px),linear-gradient(90deg,#bca9ce15 1px,transparent 1px);background-size:48px 48px}
   #boot-failure .recovery-card{width:100%;max-width:440px;padding:30px;border:1px solid #bca5cb26;border-radius:26px;background:linear-gradient(145deg,#27222fd9,#1b1922f5);box-shadow:0 24px 90px #0005;text-align:left}#boot-failure .recovery-brand{display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:11px;letter-spacing:2px;color:#b3a4c1;margin-bottom:28px}#boot-failure .recovery-brand span:last-child{font-size:10px;letter-spacing:1px;color:#8d8598}
   #boot-failure .recovery-symbol{display:flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:21px;border:1px solid #c7abda35;background:linear-gradient(145deg,#5a476452,#322c3b66);margin-bottom:23px;color:#d6c0e5;box-shadow:inset 0 1px #e9d6f112}#boot-failure .recovery-symbol svg{width:34px;height:34px;fill:none;stroke:currentColor;stroke-width:1.4;stroke-linecap:round;stroke-linejoin:round}
   #boot-failure h1{margin:0 0 10px;font-size:25px;line-height:1.4;font-weight:600;letter-spacing:1px;color:#f0e9f3}#boot-failure .recovery-description{font-size:13px;color:#aaa1b5;margin:0;line-height:1.9;min-height:49px}#boot-failure .recovery-progress{margin-top:26px}#boot-failure .recovery-progress-head{display:flex;gap:12px;align-items:baseline;justify-content:space-between}#boot-failure .recovery-status{font-size:12px;color:#cfc3dc;overflow-wrap:anywhere}#boot-failure .recovery-count{font-size:10px;color:#99909f;white-space:nowrap;font-variant-numeric:tabular-nums}
   #boot-failure .recovery-track{height:5px;position:relative;overflow:hidden;border-radius:9px;background:#ffffff0b;margin-top:11px}#boot-failure .recovery-track span{display:block;height:100%;background:linear-gradient(90deg,#8e76a4,#c9b3da);border-radius:inherit;transition:width .22s ease}#boot-failure .recovery-track.is-indeterminate:after{content:"";position:absolute;top:0;bottom:0;left:-35%;width:35%;background:linear-gradient(90deg,transparent,#e7d2f0b0,transparent);animation:recovery-scan 1.7s ease-in-out infinite}
   #boot-failure .recovery-steps{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));list-style:none;padding:0;margin:23px 0 27px;gap:7px}#boot-failure .recovery-step{min-width:0;display:flex;flex-direction:column;align-items:center;color:#716a7d;gap:6px;text-align:center;font-size:11px}#boot-failure .recovery-step i{display:grid;place-items:center;width:23px;height:23px;border:1px solid #8f81902e;border-radius:50%;font:10px/1 sans-serif;font-style:normal;color:#8b8096}#boot-failure .recovery-step small{font-size:9px;color:#716a7d}
   #boot-failure .recovery-step.is-current{color:#ddd0e8}#boot-failure .recovery-step.is-current i{color:#ecdef5;border-color:#bda1d0;background:#bda1d019;box-shadow:0 0 0 4px #bda1d00a}#boot-failure .recovery-step.is-done{color:#a4bcb6}#boot-failure .recovery-step.is-done i{font-size:0;color:#9dc6b8;border-color:#8eb4a84d;background:#8eb4a812}#boot-failure .recovery-step.is-done i:after{content:"✓";font-size:12px}#boot-failure .recovery-step.is-done small{color:#8eafa3}
   #boot-failure .recovery-protection{padding:12px 13px;border:1px solid #a0b8af12;border-radius:12px;background:#8fb7a906;color:#a4b4ab;font-size:11px;line-height:1.8;margin:0 0 23px}#boot-failure .recovery-actions{display:grid;gap:9px}#boot-failure button{display:block;width:100%;min-height:46px;margin:0;padding:11px 14px;border:1px solid #ac98ba30;border-radius:12px;background:transparent;color:#bfb0cd;font:12px/1.5 "Microsoft YaHei",sans-serif;cursor:pointer;box-shadow:none;letter-spacing:.5px}#boot-failure button[data-recovery="continue"]{background:#c8b6d8;color:#241e2d;border-color:transparent;font-weight:600;font-size:13px}#boot-failure button:hover:not(:disabled){filter:brightness(1.1)}#boot-failure button:disabled{cursor:wait;opacity:.52}
   #boot-failure button:focus-visible,#boot-failure summary:focus-visible{outline:2px solid #e0cce9;outline-offset:3px}#boot-failure button[data-recovery="copy"]{border:0;min-height:32px;padding:8px;color:#93839f;font-size:11px}#boot-failure .recovery-feedback{font-size:11px;color:#b7a4c4;margin:5px 0;text-align:center}#boot-failure details{margin-top:16px;padding-top:15px;border-top:1px solid #a797b21c;color:#867a91;font-size:11px}#boot-failure summary{cursor:pointer;width:fit-content}#boot-failure pre{max-height:140px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;padding:10px;border-radius:8px;background:#0003;color:#b3a5bd;font:10px/1.7 monospace;text-align:left;user-select:text}#boot-failure .recovery-footer{margin:20px 0 0;text-align:center;font-size:10px;letter-spacing:1px;color:#645d6d}#boot-failure[data-mode="success"] .recovery-track span{background:#a0c2b5}
   @keyframes recovery-scan{to{left:105%}}@media(max-width:480px){#boot-failure{padding:24px 18px;padding-top:max(24px,env(safe-area-inset-top));padding-bottom:max(24px,env(safe-area-inset-bottom))}#boot-failure .recovery-card{padding:25px 22px;border-radius:23px}#boot-failure h1{font-size:23px}}@media(max-height:720px){#boot-failure{align-items:flex-start}#boot-failure .recovery-brand{margin-bottom:18px}#boot-failure .recovery-symbol{width:50px;height:50px;margin-bottom:16px}#boot-failure .recovery-progress{margin-top:18px}#boot-failure .recovery-steps{margin:18px 0}#boot-failure .recovery-protection{margin-bottom:16px}}@media(prefers-reduced-motion:reduce){#boot-failure .recovery-track:after{animation:none}#boot-failure .recovery-track span{transition:none}}
  </style><div class="recovery-card"><header class="recovery-brand"><span>校园终端</span><span>恢复中心</span></header><div class="recovery-symbol" aria-hidden="true"><svg viewBox="0 0 36 36"><rect x="10" y="4" width="17" height="27" rx="4"/><path d="M16 8h5M17 27h3M6 14a12 12 0 0 0 0 10M3 21l3 3 3-3M29 21a12 12 0 0 0 0-10M26 14l3-3 3 3"/></svg></div><h1 id="recovery-title"></h1><p class="recovery-description"></p><div class="recovery-progress" aria-live="polite"><div class="recovery-progress-head"><span class="recovery-status"></span><span class="recovery-count"></span></div><div class="recovery-track" role="progressbar" aria-label="恢复步骤进度" aria-valuemin="0" aria-valuemax="4"><span></span></div></div><ol class="recovery-steps">${steps.map((name,i)=>'<li class="recovery-step"><i aria-hidden="true">'+(i+1)+'</i><span>'+name+'</span><small>等待中</small></li>').join('')}</ol><p class="recovery-protection"></p><div class="recovery-actions"><button type="button" data-recovery="continue">尝试修复并继续</button><button type="button" data-recovery="menu">返回游戏主页</button><button type="button" data-recovery="copy" hidden>复制错误信息</button></div><p class="recovery-feedback" role="status"></p><details hidden><summary>查看错误详情</summary><pre></pre></details><p class="recovery-footer">让故事，从上次停下的地方继续。</p></div>`;
  document.body.append(panel);mode=failed?'error':'slow';paint(failed?'游戏启动失败':'游戏正在启动',failed?'校园终端暂时没有回应。我们会先保护存档，再尝试恢复。':'本次加载稍慢，请稍候。完成后会自动进入游戏。',failed?'等待开始修复':'正在加载游戏资源…',!failed);if(!failed)armWatch();
 }
 try{for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(owns(key))original[key]=localStorage.getItem(key)}if(window.desktopWindow?.backupStorage)backup()}catch(error){record({message:error.message,stack:error.stack})}
 try{if(sessionStorage.getItem(progressKey)==='restoring'){show();mode='restoring';busy=true;completed=3;current=3;paint('正在恢复游戏','存档处理已完成，正在重新打开校园终端。','正在加载游戏界面…',true);armWatch()}}catch(error){record({message:error.message,stack:error.stack})}
 delay(()=>{if(failed||document.documentElement.classList.contains('mobile-loading')){lifecycle(failed?'startup-error-panel':'startup-slow-panel');show()}},8000);
 function complete(){
  if(failed)return;ready=true;lifecycle('startup-ready');if(busy&&mode==='working')return;stopWatch();runId++;busy=false;
  const route=sessionStorage.getItem('campus-recovery-route');sessionStorage.removeItem('campus-recovery-route');sessionStorage.removeItem(progressKey);
  function enter(){if(panel){panel.remove();panel=null}if(route==='continue')delay(()=>{const button=document.querySelector('[data-action="game-continue"]');if(button)button.click()},100)}
  if(panel&&mode==='restoring'){completed=4;current=-1;mode='success';paint('恢复完成','已准备就绪，即将回到你的故事。','所有步骤已完成');delay(enter,350)}else enter();
 }
 return {backup,complete,show,get blocked(){return failed},errors};
})();
