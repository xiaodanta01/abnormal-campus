/* Older Android webviews need these before any saved progress is read. */
(function(){
 function install(target,name,value){if(typeof target[name]!=='function')Object.defineProperty(target,name,{value,writable:true,configurable:true})}
 function at(index){const value=Object(this),length=value.length;let i=Math.trunc(Number(index)||0);if(i<0)i+=length;return i<0||i>=length?undefined:value[i]}
 install(Array.prototype,'at',at);install(String.prototype,'at',at);
 install(String.prototype,'trimStart',function(){return String(this).replace(/^\s+/,'')});
 install(String.prototype,'trimEnd',function(){return String(this).replace(/\s+$/,'')});
 install(Array.prototype,'findLast',function(predicate,thisArg){for(let i=this.length-1;i>=0;i--)if(predicate.call(thisArg,this[i],i,this))return this[i]});
 install(Array.prototype,'findLastIndex',function(predicate,thisArg){for(let i=this.length-1;i>=0;i--)if(predicate.call(thisArg,this[i],i,this))return i;return -1});
 // Game snapshots/configuration are JSON data, including optional undefined values.
 if(typeof window.structuredClone!=='function')window.structuredClone=function(value){return value===undefined?undefined:JSON.parse(JSON.stringify(value))};
})();
/* Pointer clicks never acquire the keyboard-only fallback focus ring. */
(function(){
 var root=document.documentElement;
 try{document.querySelector(':focus-visible');return}catch(error){}
 root.classList.add('mini-focus-fallback');
 document.addEventListener('keydown',function(e){if(!e.altKey&&!e.ctrlKey&&!e.metaKey)root.classList.add('mini-keyboard-nav')},true);
 function pointer(){root.classList.remove('mini-keyboard-nav')}
 document.addEventListener('pointerdown',pointer,true);
 document.addEventListener('mousedown',pointer,true);
 document.addEventListener('touchstart',pointer,{capture:true,passive:true});
})();
/* Launch at the phone desktop; story timers wait for an explicit start. */
window.mobileLaunch=true;
window.mobileResumeRoute=null;
// Saved scene locks own gameplay input only after Continue/Load resumes that scene.
// The launch menu, its dialogs/gallery and choice archive must remain interactive.
function storyInputDormant(){return window.mobileLaunch||['game-menu','nodes'].includes(view)}
// Saved progress stays dormant until the shared Continue/Load entry point restores it.
window.mobileBootTimeouts=[];
window.mobileNativeTimeout=window.setTimeout.bind(window);
function hospitalEndingId(progress=state){const id=progress?.story?.dayFourSleep?.endingId;return ['021','022','023'].includes(id)?id:'019'}
function hospitalMotherNode(endingId){return endingId==='023'?'day5-together-mother-call':endingId==='022'?'day5-low-mother-call':endingId==='021'?'day5-reunion-mother-call':'day5-mother-call'}
function hospitalPhoneMode(){try{return !!(state.hospitalPhoneData||state.story?.dayFourSleep?.phase==='done'&&['survival-001','019','021','022','023'].includes(state.story.dayFourSleep.endingId))}catch{return false}}
const mobilePhoneTimeouts=new Set();
function cancelMobilePhoneTimeouts(){for(const timer of mobilePhoneTimeouts)clearTimeout(timer);mobilePhoneTimeouts.clear()}
window.setTimeout=function(fn,delay,...args){const hospital=hospitalPhoneMode();const id=window.mobileNativeTimeout(()=>{mobilePhoneTimeouts.delete(id);if(hospital===hospitalPhoneMode())fn(...args)},delay);mobilePhoneTimeouts.add(id);if(window.mobileLaunch)window.mobileBootTimeouts.push(id);return id};
const mobileNativeInterval=window.setInterval.bind(window);
window.setInterval=(fn,delay,...args)=>mobileNativeInterval(()=>{if(!hospitalPhoneMode()&&!window.mobileLaunch&&(typeof storyIntervalAllowed!=='function'||storyIntervalAllowed(fn)))fn(...args)},delay);
// Capture before story-specific click handlers. The optional ending module owns only its phone.
for(const type of ['click','input','change','submit','keydown'])window.addEventListener(type,event=>window.hospitalPhoneInput?.(event),true);
document.documentElement.classList.add('mobile-loading');
