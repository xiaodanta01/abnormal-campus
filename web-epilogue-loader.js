/* Web-only entry gate. Downloads do not write to game saves. */
window.WebEpilogueLoader=(()=>{
 const manifest={
  "music": [
    {
      "path": "assets/audio/cg-close-door.mp3",
      "bytes": 9703
    },
    {
      "path": "assets/audio/cg-knock-door.mp3",
      "bytes": 8200
    },
    {
      "path": "assets/audio/cg-open-door.mp3",
      "bytes": 9924
    },
    {
      "path": "assets/audio/cg-pour-water.mp3",
      "bytes": 39563
    },
    {
      "path": "assets/audio/cg-running-footsteps.mp3",
      "bytes": 31938
    },
    {
      "path": "assets/audio/cg-tear-package.mp3",
      "bytes": 9646
    },
    {
      "path": "assets/audio/dialogue-blip-01-girl.wav",
      "bytes": 6764
    },
    {
      "path": "assets/audio/dreamcore-click-01-glass.wav",
      "bytes": 44204
    },
    {
      "path": "assets/audio/epilogue-camera-shutter.m4a",
      "bytes": 4302
    },
    {
      "path": "assets/audio/epilogue-honey-lemon.mp3",
      "bytes": 3885916
    },
    {
      "path": "assets/audio/epilogue-riverside.m4a",
      "bytes": 3569532
    },
    {
      "path": "assets/audio/epilogue-shopping-invite.mp3",
      "bytes": 9262379
    },
    {
      "path": "assets/audio/muted-keypress-06-short-tap.wav",
      "bytes": 7244
    },
    {
      "path": "assets/audio/ringtone-02-warm-chime.mp3",
      "bytes": 120717
    },
    {
      "path": "assets/audio/sliding-glass-door.wav",
      "bytes": 190124
    }
  ],
  "cg": [
    {
      "path": "assets/chat-avatars/epilogue-restaurant-reception.jpg",
      "bytes": 5402
    },
    {
      "path": "assets/chat-avatars/epilogue-tea-clerk.jpg",
      "bytes": 4772
    },
    {
      "path": "assets/chat-avatars/hospital-father.jpg",
      "bytes": 3735
    },
    {
      "path": "assets/chat-avatars/hospital-mother.jpg",
      "bytes": 4213
    },
    {
      "path": "assets/chat-avatars/taxi-autonomous-voice.jpg",
      "bytes": 4683
    },
    {
      "path": "assets/chat-avatars/taxi-business-driver-v2.jpg",
      "bytes": 4152
    },
    {
      "path": "assets/chat-avatars/taxi-comfort-driver-v2.jpg",
      "bytes": 4743
    },
    {
      "path": "assets/day2-midday-desk.jpg",
      "bytes": 121432
    },
    {
      "path": "assets/day4-wait-desk.jpg",
      "bytes": 96605
    },
    {
      "path": "assets/epilogue-bird-charms.jpg",
      "bytes": 265530
    },
    {
      "path": "assets/epilogue-blush-cat.jpg",
      "bytes": 55109
    },
    {
      "path": "assets/epilogue-dinner-linqing-outfit1.jpg",
      "bytes": 204334
    },
    {
      "path": "assets/epilogue-dinner-linqing-outfit2-v2.jpg",
      "bytes": 193906
    },
    {
      "path": "assets/epilogue-dinner-paid.jpg",
      "bytes": 110553
    },
    {
      "path": "assets/epilogue-dinner.jpg",
      "bytes": 271957
    },
    {
      "path": "assets/epilogue-escalator.jpg",
      "bytes": 257192
    },
    {
      "path": "assets/epilogue-finger-touch-outfit1.jpg",
      "bytes": 181059
    },
    {
      "path": "assets/epilogue-finger-touch-outfit2.jpg",
      "bytes": 160467
    },
    {
      "path": "assets/epilogue-first-workday.jpg",
      "bytes": 98125
    },
    {
      "path": "assets/epilogue-greeting-outfit-1.jpg",
      "bytes": 210522
    },
    {
      "path": "assets/epilogue-greeting-outfit-2.jpg",
      "bytes": 206699
    },
    {
      "path": "assets/epilogue-hair-touch-outfit1.jpg",
      "bytes": 162493
    },
    {
      "path": "assets/epilogue-hair-touch-outfit2.jpg",
      "bytes": 183196
    },
    {
      "path": "assets/epilogue-hairclips.jpg",
      "bytes": 73788
    },
    {
      "path": "assets/epilogue-holding-hands-outfit1.jpg",
      "bytes": 272843
    },
    {
      "path": "assets/epilogue-holding-hands-outfit2.jpg",
      "bytes": 186104
    },
    {
      "path": "assets/epilogue-island-shop.jpg",
      "bytes": 127026
    },
    {
      "path": "assets/epilogue-jewelry-shop.jpg",
      "bytes": 70034
    },
    {
      "path": "assets/epilogue-mall-elegant.jpg",
      "bytes": 88946
    },
    {
      "path": "assets/epilogue-mall-hall.jpg",
      "bytes": 264638
    },
    {
      "path": "assets/epilogue-mall-retro.jpg",
      "bytes": 76150
    },
    {
      "path": "assets/epilogue-meeting-outfit-1.jpg",
      "bytes": 269916
    },
    {
      "path": "assets/epilogue-meeting-outfit-2.jpg",
      "bytes": 295400
    },
    {
      "path": "assets/epilogue-park-arrival.jpg",
      "bytes": 202168
    },
    {
      "path": "assets/epilogue-restaurant.jpg",
      "bytes": 193792
    },
    {
      "path": "assets/epilogue-river-breeze-outfit1.jpg",
      "bytes": 231753
    },
    {
      "path": "assets/epilogue-river-breeze-outfit2.jpg",
      "bytes": 221659
    },
    {
      "path": "assets/epilogue-river-steps.jpg",
      "bytes": 211572
    },
    {
      "path": "assets/epilogue-subway-goodbye.jpg",
      "bytes": 276822
    },
    {
      "path": "assets/epilogue-taxi-autonomous.jpg",
      "bytes": 251831
    },
    {
      "path": "assets/epilogue-taxi-business.jpg",
      "bytes": 188865
    },
    {
      "path": "assets/epilogue-taxi-comfort.jpg",
      "bytes": 262832
    },
    {
      "path": "assets/epilogue-tea-shop.jpg",
      "bytes": 94845
    },
    {
      "path": "assets/reality-chen-dinner.jpg",
      "bytes": 509606
    }
  ]
};
 const completed=new Set(),received=new Map(),callbacks=new Set();
 let ready=false,running=false,retrying=false,layer=null,started=0,previousFocus=null;
 const delay=ms=>new Promise(resolve=>(window.mobileNativeTimeout||window.setTimeout)(resolve,ms));
 const url=path=>window.WebAssets?.url(path)||path;
 function render(){
  for(const [kind,items]of Object.entries(manifest)){
   const total=items.reduce((n,item)=>n+item.bytes,0);
   const loaded=items.reduce((n,item)=>n+(completed.has(item.path)?item.bytes:Math.min(item.bytes,received.get(item.path)||0)),0);
   const count=items.filter(item=>completed.has(item.path)).length;
   const percent=count===items.length?100:Math.min(99,Math.floor(loaded/Math.max(1,total)*100));
   layer.querySelector('[data-progress="'+kind+'"]').value=percent;
   layer.querySelector('[data-count="'+kind+'"]').textContent=percent+'% · '+count+'/'+items.length;
  }
 }
 function show(){
  if(layer)return;
  previousFocus=document.activeElement;
  layer=document.createElement('div');layer.id='web-epilogue-loader';layer.tabIndex=-1;
  layer.setAttribute('role','dialog');layer.setAttribute('aria-modal','true');layer.setAttribute('aria-labelledby','web-epilogue-title');
  layer.innerHTML='<section class="web-epilogue-card"><span class="web-epilogue-kicker">EXTRA STORY</span><h1 id="web-epilogue-title">网页版专属：番外剧情加载包</h1><p>将在资源加载完毕后进入游戏</p><div class="web-epilogue-track"><label for="epilogue-music-progress">音乐</label><span data-count="music"></span><progress id="epilogue-music-progress" data-progress="music" max="100" value="0"></progress></div><div class="web-epilogue-track"><label for="epilogue-cg-progress">CG</label><span data-count="cg"></span><progress id="epilogue-cg-progress" data-progress="cg" max="100" value="0"></progress></div><p class="web-epilogue-status" role="status" aria-live="polite">正在准备番外资源，请稍候…</p><button type="button" hidden>重新加载</button></section>';
  layer.querySelector('button').onclick=()=>{retrying=true;run()};
  layer.addEventListener('keydown',event=>{
   if(event.key==='Tab'){event.preventDefault();const button=layer.querySelector('button');(button.hidden?layer:button).focus()}
   event.stopPropagation();
  });
  document.body.append(layer);layer.focus();render();
 }
 async function download(item,kind){
  if(completed.has(item.path))return;
  const controller=new AbortController();let timer;
  const arm=()=>{clearTimeout(timer);timer=(window.mobileNativeTimeout||window.setTimeout)(()=>controller.abort(),90000)};
  received.set(item.path,0);arm();
  try{
   const response=await fetch(url(item.path),{cache:retrying?'reload':'force-cache',signal:controller.signal});
   if(!response.ok)throw new Error('HTTP '+response.status);
   let blob;
   if(response.body?.getReader){
    const reader=response.body.getReader(),chunks=[];let size=0;
    for(;;){const {done,value}=await reader.read();if(done)break;arm();chunks.push(value);size+=value.byteLength;received.set(item.path,size);render()}
    blob=new Blob(chunks,{type:response.headers.get('content-type')||''});
   }else blob=await response.blob();
   if(!blob.size)throw new Error('Empty resource');
   if(kind==='cg'){
    const objectURL=URL.createObjectURL(blob);
    try{await new Promise((resolve,reject)=>{const img=new Image();img.onload=resolve;img.onerror=reject;img.src=objectURL})}finally{URL.revokeObjectURL(objectURL)}
   }
   completed.add(item.path);render();
  }finally{clearTimeout(timer)}
 }
  async function run(){
  if(running||ready)return;
  running=true;show();started=performance.now();
  layer.querySelector('button').hidden=true;
  layer.querySelector('[role="status"]').textContent='正在准备番外资源，请稍候…';
  const failures=[];
  async function queue(kind,workers,onItem){
   const pending=manifest[kind].filter(item=>!completed.has(item.path));
   await Promise.all(Array.from({length:workers},async()=>{while(pending.length){const item=pending.shift();try{await download(item,kind);onItem?.()}catch(error){failures.push(item.path)}}}));
  }
  // Music is the gate's priority. Do not spend the first network slots on CGs.
  await queue('music',1);
  if(failures.length){
   running=false;
   layer.querySelector('[role="status"]').textContent='有 '+failures.length+' 项资源未加载成功，请检查网络后重试。已完成的资源会保留。';
   layer.querySelector('button').hidden=false;layer.querySelector('button').focus();return;
  }
  retrying=false;
  layer.querySelector('[role="status"]').textContent='音乐已就绪，正在加载 CG…';
  const backgroundCG=queue('cg',2);
  while(true){
   const total=manifest.cg.reduce((n,item)=>n+item.bytes,0);
   const loaded=manifest.cg.reduce((n,item)=>n+(completed.has(item.path)?item.bytes:received.get(item.path)||0),0);
   if(loaded/Math.max(1,total)>=.4)break;
   await delay(100);
  }
  layer.querySelector('[role="status"]').textContent='已完成首批 CG，正在进入番外…';
  await delay(Math.max(0,1000-(performance.now()-started)));
  ready=true;running=false;layer.remove();layer=null;
  if(previousFocus?.isConnected)previousFocus.focus();
  const pending=[...callbacks];callbacks.clear();for(const callback of pending)callback();
  // The remaining CGs keep downloading after the story has started.
  backgroundCG.catch(()=>{});
 }
 return {ensure(){if(ready)return true;show();if(!running&&layer.querySelector('button').hidden)void run();return false},whenReady(callback){if(ready)callback();else callbacks.add(callback)},get ready(){return ready}};
})();
