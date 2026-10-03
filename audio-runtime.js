/* Decoded, reusable short effects. No storage or story state is owned here. */
window.GameAudio=(()=>{
 const buffers=new Map(),loading=new Map(),active=new Set(),keys=new Map(),fallback=new Map();
 let context=null,unsupported=false;
 function getContext(){
  if(!context&&!unsupported){try{const Constructor=window.AudioContext||window.webkitAudioContext;if(!Constructor)throw Error('Web Audio unavailable');context=new Constructor({latencyHint:'interactive'})}catch{unsupported=true}}
  return context;
 }
 function prepare(src){
  if(!src)return Promise.resolve(null);
  if(buffers.has(src))return Promise.resolve(buffers.get(src));
  if(loading.has(src))return loading.get(src);
  const ctx=getContext();
  if(!ctx){if(!fallback.has(src)){const a=new Audio(src);a.preload='auto';a.load();fallback.set(src,a)}return Promise.resolve(null)}
  const task=fetch(src).then(r=>{if(!r.ok)throw Error('Audio '+r.status);return r.arrayBuffer()}).then(bytes=>ctx.decodeAudioData(bytes)).then(buffer=>{buffers.set(src,buffer);return buffer}).catch(()=>null).finally(()=>loading.delete(src));
  loading.set(src,task);return task;
 }
 function unlock(){const ctx=getContext();if(ctx&&ctx.state!=='running')ctx.resume().catch(()=>{})}
 for(const event of ['pointerdown','touchstart','keydown'])document.addEventListener(event,unlock,{capture:true,passive:true});
 function play(src,{volume=0.5,key=null,onended=()=>{},maxDelay=200}={}){
  if(key)keys.get(key)?.pause();
  let source=null,gain=null,audio=null,done=false,timer=null,level=volume;
  const created=performance.now();
  function finish(){if(done)return;done=true;clearTimeout(timer);active.delete(handle);if(key&&keys.get(key)===handle)keys.delete(key);source?.disconnect();gain?.disconnect();onended()}
  const handle={pause(){if(done)return;if(source){try{source.stop()}catch{}}if(audio)audio.pause();finish()},get volume(){return level},set volume(value){level=value;if(gain)gain.gain.value=value;if(audio)audio.volume=value}};
  active.add(handle);if(key)keys.set(key,handle);
  function start(buffer){
   if(done)return;
   if(document.hidden||performance.now()-created>maxDelay){finish();return}
   clearTimeout(timer);
   if(context){if(!buffer||context.state!=='running'){finish();return}source=context.createBufferSource();gain=context.createGain();gain.gain.value=level;source.buffer=buffer;source.connect(gain);gain.connect(context.destination);source.onended=finish;source.start(0)}
  }
  timer=setTimeout(()=>handle.pause(),maxDelay);
  const ctx=getContext();
  if(ctx){
   if(ctx.state==='running'&&buffers.has(src))start(buffers.get(src));
   else Promise.all([prepare(src),ctx.state==='running'?Promise.resolve():ctx.resume()]).then(([buffer])=>start(buffer)).catch(()=>finish());
  }else{
   prepare(src);const cached=fallback.get(src);audio=cached&&!cached.paused?cached.cloneNode(true):cached;
   if(!audio){finish();return handle}audio.currentTime=0;audio.volume=level;audio.onended=finish;audio.onerror=finish;
   audio.play().then(()=>{if(done||document.hidden)audio.pause();else clearTimeout(timer)}).catch(finish);
  }
  return handle;
 }
 function stopAll(){for(const h of [...active])h.pause()}
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAll()});
 const important=['dreamcore-click-01-glass.wav','dialogue-blip-01-girl.wav','muted-keypress-06-short-tap.wav','message-notification-v1.wav','system-unlock-v1.wav'];
 for(const name of important)prepare('assets/audio/'+name);
 // Longer scene sounds retain their existing media-element timing and envelopes.
 const longAudio=['creation-monitor-three.mp3','questionnaire-monitor-v1.mp3','ringtone-02-warm-chime.mp3'].map(name=>{const audio=new Audio('assets/audio/'+name);audio.preload='auto';audio.load();return audio});
 return {prepare,play,stopAll,longAudio};
})();
