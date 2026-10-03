/* Shared CG dialogue presentation and pre-service shopping gate. */
const cgStyle=document.createElement('style');cgStyle.textContent=`.vn-dialogue{position:absolute;left:14px;right:14px;bottom:max(18px,env(safe-area-inset-bottom));padding:22px 22px 18px;border-radius:24px;background:#221f2bd9;border:1px solid #d7c2d521;backdrop-filter:blur(10px);color:#eee5ed;min-height:168px;cursor:pointer;box-shadow:0 8px 25px #0003}.vn-dialogue .vn-speaker{display:flex;align-items:flex-start;gap:14px}.vn-dialogue .avatar{width:48px;height:48px;flex-shrink:0}.vn-copy{flex:1;min-width:0}.vn-name{display:block;font-size:14px;color:#d6b4c7;margin-bottom:10px}.vn-text{font-size:15px;line-height:1.9;white-space:pre-wrap;min-height:58px;margin:0}.vn-hint{display:block;text-align:right;color:#a698ad;font-size:11px;margin-top:14px}.supply-locked{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:55dvh;gap:12px;text-align:center}.supply-locked>.app-icon{background:#39313e;color:#c7adbc}.supply-locked h2{font-size:19px;font-weight:500;margin:8px 0}.supply-locked p{color:#a899ad;font-size:13px;margin:0}`;document.head.append(cgStyle);
let cgTypingTimer=null;
function cgScreenCrossfade(previous){
 const selector='.rd-cg>img,.ending-scene>img,.zero-scene>.zero-cg';
 const before=previous?.querySelector(selector),after=screen.querySelector(selector);
 if(!previous||!after||before?.getAttribute('src')===after.getAttribute('src'))return;
 zeroDissolve(previous,600);
}
function cgFadeLayer(layer,image){
 layer.inert=true;layer.setAttribute('aria-hidden','true');layer.style.pointerEvents='none';
 layer.style.animation='zero-dissolve .6s ease-in-out forwards';
 let started=false;const start=()=>{if(started)return;started=true;layer.style.animationPlayState='running';setTimeout(()=>layer.remove(),600)};
 if(image&&!image.complete){layer.style.animationPlayState='paused';image.addEventListener('load',start,{once:true});image.addEventListener('error',start,{once:true});setTimeout(start,2500)}else start();
}
function cgImageCrossfade(previous,current){
 if(!previous||!current||previous.getAttribute('src')===current.getAttribute('src'))return;
 current.style.animation='none';previous.removeAttribute('id');previous.classList.add('cg-outgoing-image');
 Object.assign(previous.style,{position:'absolute',inset:'0',width:'100%',height:'100%',objectFit:'cover'});
 current.after(previous);cgFadeLayer(previous,current);
}
// Format only CG presentation; chat messages and saved story text remain intact.
function cgText(text,speaker=null){
 const value=String(text||'');
 if(value==='二十分钟后——')return value;
 if(speaker&&speaker!=='narrator')return value.replace(/。/g,'');
 return value.split('\n').map(line=>{const trimmed=line.trim();if(!trimmed)return line;const match=trimmed.match(/^(.*?)([”’」』）)]*)$/);let body=match[1],closing=match[2];body=body.replace(/(…+)。$/,'$1');if(!/[。？?…：:]$/.test(body))body+='。';return body+closing}).join('\n');
}
function cgDialogueMarkup(raw,{lastPage=false,hint=''}={}){
 const row=typeof raw==='string'?{text:raw}:raw;if(!row)return '';
 const player=row.speaker==='me',person=row.speaker&&row.speaker!=='narrator';
 const name=player?state.profile.name:row.name||state.contacts.find(c=>c.id===row.speaker)?.name||row.speaker;
 const pages=cgSentencePages(row.text),text=cgText(lastPage?pages[pages.length-1]:row.text,row.speaker);
 return '<div class="vn-speaker">'+(person?avatar(player?'me':row.avatar||row.speaker):'')+'<div class="vn-copy">'+(person?'<strong class="vn-name">'+esc(name)+'</strong>':'')+'<p class="vn-text">'+esc(text)+'</p></div></div>'+(hint?'<small class="vn-hint">'+esc(hint)+'</small>':'');
}
function cgChoiceDialogue(host,raw,{lastPage=true}={}){
 if(raw===undefined||raw===null)return;clearInterval(cgTypingTimer);host.querySelector('.vn-dialogue')?.remove();
 const box=document.createElement('div');box.className='vn-dialogue';box.innerHTML=cgDialogueMarkup(raw,{lastPage});host.append(box);
}
function cgSentencePages(text){return String(text||'').match(/[^。]+。[”’」』）)]*|[^。]+$/g)?.map(part=>part.trim()).filter(Boolean)||['']}
function presentCGDialogue(host,rows,{index=0,onIndex=()=>{},onComplete=()=>{},onLastShown=null,firstReplyConfirmed=false}={}){
 clearInterval(cgTypingTimer);host.querySelector('.vn-dialogue')?.remove();let interactionVoiceIndex=-1;let current=index,letters=[],shown=0,finished=false,parts=[],part=0,waitingReply=false;const sceneKey=JSON.stringify([view,rows]);const savedSentence=state.story.cgSentenceCursor;if(savedSentence?.scene===sceneKey&&savedSentence.index===index)part=savedSentence.part||0;
 const box=document.createElement('div');box.className='vn-dialogue';box.tabIndex=0;box.setAttribute('role','button');box.setAttribute('aria-label','继续对话');host.append(box);
 function pageShown(){box.querySelector('.vn-hint').textContent='点击继续';if(onLastShown&&current===rows.length-1&&part===parts.length-1){finished=true;box.querySelector('.vn-hint').textContent='';onLastShown()}}
 function render(){clearInterval(cgTypingTimer);const raw=rows[current];if(raw===undefined){finished=true;box.remove();onComplete();return}const row=typeof raw==='string'?{text:raw}:raw;parts=cgSentencePages(row.text).map(text=>cgText(text,row.speaker));part=Math.min(part,parts.length-1);const player=row.speaker==='me';const replyToken=sceneKey+':'+current;const confirmations=state.story.cgReplyConfirmations??={};if(player&&rows[current-1]?.speaker!=='me'&&!confirmations[replyToken]){if(current===0&&firstReplyConfirmed){confirmations[replyToken]=true}else{waitingReply=true;const previous=rows[current-1];box.hidden=previous===undefined;if(previous!==undefined)box.innerHTML=cgDialogueMarkup(previous,{lastPage:true});host.querySelector('[data-cg-single-reply]')?.remove();const options=document.createElement('div');options.className='cg-options';options.setAttribute('data-cg-single-reply','');const button=document.createElement('button');button.type='button';button.textContent=cgText(row.text,'me');button.onclick=e=>{e.preventDefault();e.stopPropagation();if(!waitingReply||!options.isConnected)return;confirmations[replyToken]=true;waitingReply=false;options.remove();box.hidden=false;persist();render()};options.append(button);host.append(options);return}}box.hidden=false;const person=row.speaker&&row.speaker!=='narrator';const name=player?state.profile.name:row.name||state.contacts.find(c=>c.id===row.speaker)?.name||row.speaker;box.innerHTML=`<div class="vn-speaker">${person?avatar(player?'me':row.avatar||row.speaker):''}<div class="vn-copy">${person?`<strong class="vn-name">${esc(name)}</strong>`:''}<p class="vn-text"></p></div></div><small class="vn-hint">点击显示完整句子</small>`;if(interactionVoiceIndex!==current){interactionVoiceIndex=current;if(part===0){if(typeof playCGCharacterBlip==='function')playCGCharacterBlip(row);if(row.sfx&&typeof playInteractionSound==='function')playInteractionSound(row.sfx)}}letters=Array.from(parts[part]);shown=0;const text=box.querySelector('.vn-text');cgTypingTimer=setInterval(()=>{if(!box.isConnected){clearInterval(cgTypingTimer);return}shown=Math.min(letters.length,shown+1);text.textContent=letters.slice(0,shown).join('');if(shown===letters.length){clearInterval(cgTypingTimer);pageShown()}},32)}
 function advance(){if(waitingReply||finished||!box.isConnected)return;if(shown<letters.length){clearInterval(cgTypingTimer);shown=letters.length;box.querySelector('.vn-text').textContent=letters.join('');pageShown();return}if(part+1<parts.length){part++;state.story.cgSentenceCursor={scene:sceneKey,index:current,part};persist();render();return}part=0;delete state.story.cgSentenceCursor;current++;onIndex(current);if(!box.isConnected){finished=true;return}render()}
 host.addEventListener('click',e=>{if(e.target.closest('button,input,form')&&!box.contains(e.target))return;advance()});box.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();advance()}};render();
}
window.CGDialogue={present:presentCGDialogue};
const sharedCGScene=zeroScene;
zeroScene=function(){sharedCGScene();if(view!=='zero-scene'||z().phase!=='cg')return;const host=screen.querySelector('.zero-scene');presentCGDialogue(host,Z.narration,{index:z().narrationIndex||0,onIndex:i=>{z().narrationIndex=i;persist()},onComplete:()=>actions['zero-supplies']()})};
// The initial resume runs before this dialogue renderer is installed.
if(view==='zero-scene'&&z().phase==='cg')zeroScene();
const lockedSupplyBase={openApp,shop,checkout,pay};
function lockedSupply(){if(zeroLock())return;closeSheet();view='supply';active=null;rememberRoute();screen.innerHTML=`<section class="app-page">${head('物资中心')}<div class="supply-locked"><span class="app-icon">${icon('lock')}</span><h2>异常封禁中</h2><p>物资中心尚未解锁</p></div></section>`}
openApp=function(id){if(id==='supply'&&!ns().productsUpdated)return lockedSupply();return lockedSupplyBase.openApp(id)};
shop=function(){if(!ns().productsUpdated)return lockedSupply();return lockedSupplyBase.shop()};
checkout=function(){if(!ns().productsUpdated)return lockedSupply();return lockedSupplyBase.checkout()};
pay=function(){if(!ns().productsUpdated)return lockedSupply();return lockedSupplyBase.pay()};
if(view==='supply'&&!ns().productsUpdated)lockedSupply();
