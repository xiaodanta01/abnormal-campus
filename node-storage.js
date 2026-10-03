/* Lossless shared-subtree storage. Public reads remain independent JSON snapshots. */
const ChoiceNodeStorage=(()=>{
 const format='afterclass-choice-nodes/1',stores=new Map();
 function pack(text){
  const entries=[],seen=new Map();
  function visit(value){
   if(value===null||typeof value!=='object')return value;
   const entry=Array.isArray(value)?[0,value.map(visit)]:[1,Object.entries(value).map(([key,item])=>[key,visit(item)])];
   const signature=JSON.stringify(entry);let index=seen.get(signature);
   if(index===undefined){index=entries.length;entries.push(entry);seen.set(signature,index)}
   return [index];
  }
  const root=visit(JSON.parse(text));return JSON.stringify({format,entries,root});
 }
 function unpack(raw){
  const data=JSON.parse(raw||'{}');if(data.format!==format)return JSON.stringify(data);
  if(!Array.isArray(data.entries))throw new Error('Invalid node archive');
  const entries=[];
  function value(item){if(!Array.isArray(item))return item;if(item.length!==1||!Number.isInteger(item[0])||item[0]<0||item[0]>=entries.length)throw new Error('Invalid node reference');return entries[item[0]]}
  for(const entry of data.entries){
   if(!Array.isArray(entry)||!Array.isArray(entry[1]))throw new Error('Invalid node entry');
   if(entry[0]===0)entries.push(entry[1].map(value));
   else if(entry[0]===1)entries.push(Object.fromEntries(entry[1].map(([key,item])=>[key,value(item)])));
   else throw new Error('Invalid node entry type');
  }
  // Expand shared objects before returning to callers: changing one checkpoint must
  // never change another checkpoint, even if their persisted subtrees are shared.
  return JSON.stringify(value(data.root));
 }
 function store(key){if(!stores.has(key))stores.set(key,{raw:undefined,text:'{}',pending:false,timer:null,retryAt:0,warned:false,blocked:false});return stores.get(key)}
 function report(s,error,notify){if(s.warned)return;s.warned=true;const quota=error?.name==='QuotaExceededError'||error?.code===22||error?.code===1014;notify(quota?'浏览器存储空间不足，新抉择暂未保存；请勿刷新，程序会自动重试。':error?.name==='SecurityError'?'浏览器不允许保存抉择，请检查此页面的存储权限。':'抉择记录暂时无法保存或读取，请勿刷新。')}
 function load(key,s,notify){
  if(s.pending)return true;
  try{const raw=GameStorage.getItem(key);if(raw!==s.raw){const text=unpack(raw);s.text=text;s.raw=raw}s.blocked=false;return true}
  catch(error){s.blocked=true;report(s,error,notify);return false}
 }
 function flush(key,s,notify){
  try{
   const packed=pack(s.text);
   GameStorage.setItem(key,packed);s.raw=packed;s.pending=false;s.retryAt=0;s.warned=false;
   if(s.timer!==null){clearTimeout(s.timer);s.timer=null}return true;
  }catch(error){
   s.pending=true;s.retryAt=Date.now()+30000;report(s,error,notify);
   if(s.timer===null)s.timer=setTimeout(()=>{s.timer=null;flush(key,s,notify)},30000);
   return false;
  }
 }
 function normalizeRecord(record){if(record?.checkpoint&&window.SaveSchema)record.checkpoint=SaveSchema.normalize(record.checkpoint);return record}
 function read(key,notify){const s=store(key);load(key,s,notify);const records=JSON.parse(s.text);for(const record of Object.values(records))normalizeRecord(record);return records}
 function record(key,id,notify){
  const s=store(key);load(key,s,notify);
  if(!s.lookup||s.lookup.id!==id||s.lookup.text!==s.text){
   const value=JSON.parse(s.text)[id];s.lookup={id,text:s.text,value:value===undefined?null:JSON.stringify(value)};
  }
  return s.lookup.value===null?undefined:normalizeRecord(JSON.parse(s.lookup.value));
 }
 function write(key,records,notify){
  const s=store(key);if(!load(key,s,notify))return false;
  let text;try{text=JSON.stringify(records)}catch(error){report(s,error,notify);return false}
  const unchanged=text===s.text;
  if(unchanged&&!s.pending&&s.raw?.startsWith('{"format":"'+format+'"'))return true;
  s.text=text;
  // Keep the latest failed write in memory so polling cannot recapture this node
  // with a later state. Retry once per interval rather than once per render.
  if(s.pending&&Date.now()<s.retryAt)return false;
  return flush(key,s,notify);
 }
 return {read,record,write,pack,unpack};
})();
