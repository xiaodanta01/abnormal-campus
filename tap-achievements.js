/* TapTap reporting only. No game UI, rewards, or changes to story saves. */
(()=>{
 'use strict';
 if(window.TapAchievements)return;
 const catalog=Object.freeze({
  achievement1:'舌战群儒',achievement2:'越描越黑',achievement3:'新规遵守标兵',
  achievement4:'今天你吃了吗？',achievement5:'一滴不剩',achievement6:'视奸狂魔',
  achievement7:'电子仓鼠',achievement8:'我就要回复',achievement9:'你是个好人',
  achievement10:'明天也请留在这里',achievement11:'一起回来了',achievement12:'请离大师',
  achievement13:'我还能肝',achievement14:'这是女同事吗',achievement15:'每种未来都有你'
 });
 const people=['沈可欣','林晴','江晓','周茉','孟舒'];
 const key=STORAGE_KEY+'-tap-achievements-v1',endingKey=STORAGE_KEY+'-ending-gallery';
 const object=value=>value&&typeof value==='object'&&!Array.isArray(value)?value:{};
 function read(key){return object(JSON.parse(GameStorage.getItem(key)||'{}'))}
 let ledger;
 try{const data=read(key);ledger={earned:object(data.earned),moments:object(data.moments)}}
 catch(error){console.warn('TapTap achievement record could not be read; original retained',error);return}
 function evaluate(progress,endings){
  const result=[],s=object(progress?.story),g=object(progress?.game),d=object(s.dayFourDebate?.decisions);
  const has=id=>!!object(endings)[id];
  if(d.attack===1&&d.risk===1)result.push('achievement1');
  if(d.attack===0&&d.risk===0)result.push('achievement2');
  if(s.started&&Number.isFinite(g.day)&&g.day>=1)result.push('achievement3');
  if(s.started&&g.wallet===0)result.push('achievement5');
  const inventory=Array.isArray(g.inventory)?g.inventory:[];
  // Different purchase/order IDs can represent the same kind of supply.
  const kinds=new Set(inventory.filter(p=>p&&p.quantity>0).map(p=>p.name==='泡面'?'桶装泡面':p.name||p.id).filter(Boolean));
  if(kinds.size>=5)result.push('achievement7');
  if(s.lateDayDeath?.reason==='departed-reply'||has('018'))result.push('achievement8');
  if((s.dayFourFinal?.submittedAt!=null&&s.dayFourFinal?.correct===false)||has('017'))result.push('achievement9');
  if(has('020'))result.push('achievement10');
  if(has('023'))result.push('achievement11');
  if(Array.from({length:18},(_,i)=>String(i+1).padStart(3,'0')).every(has))result.push('achievement12');
  if(Array.from({length:23},(_,i)=>String(i+1).padStart(3,'0')).every(has))result.push('achievement13');
  if(Number.isFinite(g.trust?.linqing)&&g.trust.linqing>=160)result.push('achievement14');
  if(has('020')&&has('023'))result.push('achievement15');
  return result;
 }
 let checking=false,queued=false,lastSent='';
 function save(){GameStorage.setItem(key,JSON.stringify(ledger))}
 function award(id){if(!catalog[id]||ledger.earned[id])return false;ledger.earned[id]=true;return true}
 function sync(force=false){
  const host=window.AndroidHost||window.DesktopAchievements;
  if(!host||typeof host.reportAchievements!=='function')return;
  if(window.AndroidHost?typeof host.isPlayAllowed!=='function'||!host.isPlayAllowed():!host.isReady())return;
  const ids=Object.keys(catalog).filter(id=>ledger.earned[id]),payload=JSON.stringify(ids);
  if(!ids.length||!force&&payload===lastSent)return;
  host.reportAchievements(payload);lastSent=payload;
 }
 function check(){
  if(checking)return;checking=true;
  try{
   let changed=false;
   for(const id of evaluate(state,read(endingKey)))changed=award(id)||changed;
   // Record an actually rendered personal page, never all contacts in the feed.
   if(!window.mobileLaunch&&!document.hidden&&!window.AndroidGameRuntime?.isPaused()&&String(view).includes('moments')){
    const name=screen.querySelector('.lin-moments .lin-feed-owner strong')?.textContent.trim();
    if(people.includes(name)&&!ledger.moments[name]){ledger.moments[name]=true;changed=true}
   }
   if(people.every(name=>ledger.moments[name]))changed=award('achievement6')||changed;
   if(changed)save();
   sync();
  }catch(error){console.warn('TapTap achievement check failed; gameplay retained',error)}
  finally{checking=false}
 }
 function schedule(){if(queued)return;queued=true;Promise.resolve().then(()=>{queued=false;check()})}
 function foodRecovered(before,after){
  if(!Number.isFinite(before)||!Number.isFinite(after)||after<=before)return;
  try{if(award('achievement4'))save();sync()}catch(error){console.warn('TapTap food achievement pending',error)}
 }
 window.TapAchievements=Object.freeze({catalog,evaluate,foodRecovered,sync,check});
 const basePersist=persist;
 persist=function(...args){const result=basePersist(...args);check();return result};
 const baseSet=GameStorage.setItem;
 GameStorage.setItem=function(name,value,...args){const result=baseSet.call(this,name,value,...args);if(name===endingKey)schedule();return result};
 new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});
 // Auth completion/reconnection must retry even if the earned list did not change.
 window.addEventListener('tap-achievements-sync',()=>{lastSent='';check()});
 window.addEventListener('online',()=>{lastSent='';check()});
 window.DesktopAchievements?.onReady(()=>{lastSent='';check()});
 check();
})();
