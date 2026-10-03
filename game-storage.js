/* Synchronous, lossless storage: old Android needs no CompressionStream or IndexedDB.
 * Only this adapter touches browser storage; game callers still receive the original text.
 * A replacement is atomic. Never delete a save to make room for its replacement.
 */
const GameStorage=(()=>{
 const marker='\u0001ACZ1:',cache=new Map(),pending=new Map();
 const delay=window.setTimeout.bind(window),cancel=window.clearTimeout.bind(window);
 let timer=null,lastWarning='',warningAt=0,lastEncoded=null,compacting=false;
 function owned(key){return /^(afterclass-|abnormal-campus-)/.test(key)}
 function encode(text){
  if(text.length<512&&!text.startsWith(marker))return text;
  if(lastEncoded&&lastEncoded.text===text)return lastEncoded.raw;
  const bytes=new Uint8Array(text.length*2);
  for(let i=0;i<text.length;i++){const c=text.charCodeAt(i);bytes[i*2]=c&255;bytes[i*2+1]=c>>>8}
  const zipped=pako.deflate(bytes,{level:6}),parts=[];let bits=0,count=0,part='';
  for(let i=0;i<zipped.length;i++){
   bits=(bits<<8)|zipped[i];count+=8;
   if(count>=15){count-=15;part+=String.fromCharCode(((bits>>>count)&32767)+32);bits&=(1<<count)-1}
   if(part.length>=8192){parts.push(part);part=''}
  }
  if(count)part+=String.fromCharCode((bits<<(15-count))+32);parts.push(part);
  const packed=marker+zipped.length.toString(36)+':'+parts.join('');
  const raw=packed.length<text.length||text.startsWith(marker)?packed:text;
  lastEncoded={text,raw};return raw;
 }
 function decode(raw){
  if(raw===null||!raw.startsWith(marker))return raw;
  const split=raw.indexOf(':',marker.length),number=raw.slice(marker.length,split);
  const length=parseInt(number,36),body=raw.slice(split+1);
  if(split<0||!/^[0-9a-z]+$/.test(number)||!Number.isSafeInteger(length)||length<1||body.length!==Math.ceil(length*8/15))throw new Error('Invalid compressed save');
  const bytes=new Uint8Array(length);let bits=0,count=0,index=0;
  for(let i=0;i<body.length;i++){
   const code=body.charCodeAt(i)-32;if(code<0||code>32767)throw new Error('Invalid compressed save');
   bits=(bits<<15)|code;count+=15;
   while(count>=8&&index<length){count-=8;bytes[index++]=(bits>>>count)&255}
   bits&=(1<<count)-1;
  }
  const expanded=pako.inflate(bytes);if(expanded.length%2)throw new Error('Invalid save text');
  const parts=[];let part='';
  for(let i=0;i<expanded.length;i+=2){part+=String.fromCharCode(expanded[i]|expanded[i+1]<<8);if(part.length>=8192){parts.push(part);part=''}}
  parts.push(part);return parts.join('');
 }
 function getItem(key){
  key=String(key);if(pending.has(key))return pending.get(key).text;
  const raw=localStorage.getItem(key),known=cache.get(key);
  if(known&&known.raw===raw)return known.text;
  const text=decode(raw);cache.set(key,{raw,text});return text;
 }
 function quota(error){return !!error&&(error.name==='QuotaExceededError'||error.code===22||error.code===1014)}
 function compact(){
  if(window.BootRecovery?.blocked)return;
  if(compacting)return;compacting=true;
  try{
   const entries=[];
   for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(owned(key)){const raw=localStorage.getItem(key);if(raw&&!raw.startsWith(marker)&&raw.length>=512)entries.push({key,raw})}}
   entries.sort((a,b)=>b.raw.length-a.raw.length);
   for(const entry of entries){
    try{
     const raw=encode(entry.raw);
     if(raw.length<entry.raw.length&&localStorage.getItem(entry.key)===entry.raw){localStorage.setItem(entry.key,raw);cache.delete(entry.key)}
    }catch(error){/* The original entry stays intact if storage is blocked. */}
   }
  }catch(error){}finally{compacting=false;lastEncoded=null}
 }
 function commit(key,item){
  if(window.BootRecovery?.blocked)throw new Error('Startup failed; original save is protected');
  const current=localStorage.getItem(key),known=cache.get(key);
  // Never overwrite unreadable compressed data with boot-time empty defaults.
  if(current&&current.startsWith(marker)&&(!known||known.raw!==current)){
   try{decode(current)}catch(error){const failure=new Error('Existing save cannot be decoded');failure.name='SaveDecodeError';throw failure}
  }
  if(item.raw===null)item.raw=encode(item.text);
  if(current!==item.raw)localStorage.setItem(key,item.raw);
  cache.set(key,item);pending.delete(key);
 }
 function schedule(){if(timer===null&&pending.size)timer=delay(()=>{timer=null;retry()},30000)}
 function retry(){
  for(const [key,item] of pending){try{commit(key,item)}catch(error){item.error=error;item.retryAt=Date.now()+30000}}
  if(!pending.size){if(timer!==null)cancel(timer);timer=null;lastWarning=''}else schedule();
 }
 function setItem(key,value){
  if(window.BootRecovery?.blocked)throw new Error('Startup failed; original save is protected');
  key=String(key);const text=String(value),old=pending.get(key);
  // Failed writes keep only the newest text for each key. Don't compress on every tick.
  if(old&&Date.now()<old.retryAt){if(old.text!==text){old.text=text;old.raw=null}schedule();throw old.error}
  const item={text,raw:null};
  try{
   const known=cache.get(key);
   if(!old&&known&&known.text===text&&localStorage.getItem(key)===known.raw)return;
   commit(key,item);
  }catch(error){
   if(error&&error.name==='SaveDecodeError')throw error;
   if(quota(error)){compact();try{commit(key,item);return}catch(next){error=next}}
   item.error=error;item.retryAt=Date.now()+30000;pending.set(key,item);schedule();throw error;
  }
 }
 function removeItem(key){if(window.BootRecovery?.blocked)throw new Error('Startup failed; original save is protected');key=String(key);localStorage.removeItem(key);pending.delete(key);cache.delete(key)}
 function report(error,notify){
  const kind=quota(error)?'quota':error&&error.name==='SecurityError'?'security':'data',now=Date.now();
  if(lastWarning===kind&&now-warningAt<60000)return;lastWarning=kind;warningAt=now;
  notify(kind==='quota'?'浏览器存储空间不足，最新进度暂未保存；请勿刷新，程序会自动重试。':kind==='security'?'浏览器禁止保存本地数据，最新进度暂未保存；请勿刷新。':'存档处理失败，最新进度暂未保存；请勿刷新。');
 }
 // Compact legacy current/continue/backups/nodes in place before any game boot read.
 compact();
 window.addEventListener('pagehide',retry);
 window.addEventListener('focus',retry);
 return {getItem,setItem,removeItem,compact,retry,report,encode,decode};
})();
