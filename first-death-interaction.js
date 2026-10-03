/* The first trap waits for one deliberate click after Lin Qing's message. */
function firstDeathPrompt(){
 if(z().phase==='dead'||z().firstDeathClicked)return;
 // Wrong-room expulsion has no Day 0 message from Lin Qing.
 if(state.game.day===2&&state.story.dayTwoWrongDormDeath){document.querySelector('#first-death-message')?.remove();zeroDeath();return;}
 clearTimeout(zeroTimer);zeroPhase('departing');zeroBanner(null);closeSheet();
 zeroAdd('where',0,['21:00','linqing','{name}，你在哪？'],'linqing');
 document.querySelector('#first-death-message')?.remove();
 const panel=document.createElement('div');panel.id='first-death-message';panel.className='first-death-message opening-message';panel.setAttribute('role','alert');
 panel.innerHTML=avatar('linqing')+'<div class="first-death-copy"><small>讯息 · 林晴</small><p></p></div>';
 panel.querySelector('p').textContent=(state.profile?.name||'同学')+'，你在哪？';
 panel.style.cssText='position:absolute;top:calc(16px + env(safe-area-inset-top));left:12px;right:12px;z-index:1550;display:flex;align-items:center;gap:12px;padding:18px;background:#302937;color:#f4eaf2;border:1px solid #d8c5d438;border-radius:20px;pointer-events:auto';
 panel.querySelector('p').style.cssText='display:block;color:#f4eaf2;font-size:16px;line-height:1.7;margin:6px 0 0;white-space:normal;overflow-wrap:anywhere';
 z().firstDeathReadyAt=Date.now()+3000;
 document.querySelector('#phone').append(panel);persist();
}
function firstDeathClick(event){
 if(storyEndingOwner()!=='zero')return false;
 if(event?.target.closest('#cg-recovery-home,#cg-recovery-confirm'))return false;
 const panel=document.querySelector('#first-death-message');
 if(z().phase!=='departing'||z().firstDeathClicked||!panel)return false;
 if(!Number.isFinite(z().firstDeathReadyAt))z().firstDeathReadyAt=Date.now()+3000;
 if(Date.now()<z().firstDeathReadyAt){event?.preventDefault();event?.stopImmediatePropagation();return false;}
 z().firstDeathClicked=true;clearTimeout(zeroTimer);
 event?.preventDefault();event?.stopImmediatePropagation();
 document.querySelector('#first-death-message')?.remove();zeroBanner(null);closeSheet();
 document.querySelectorAll('.zero-transition').forEach(el=>el.remove());
 screen.innerHTML='<section style="position:absolute;inset:0;background:#000;animation:none"></section>';
 view='zero-death';zeroDeath();
 document.querySelector('.zero-death').style.cssText='background:#000;animation:none';persist();return true;
}
window.addEventListener('click',firstDeathClick,true);
