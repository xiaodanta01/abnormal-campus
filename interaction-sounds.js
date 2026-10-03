/* User-supplied UI click and one blip per non-player CG line. */
const interactionSoundFiles={doorCloseChase:'assets/audio/cg-close-door.mp3',runningSteps:'assets/audio/cg-running-footsteps.mp3',doorOpen:'assets/audio/cg-open-door.mp3',pour:'assets/audio/cg-pour-water.mp3',tear:'assets/audio/cg-tear-package.mp3',knock:'assets/audio/cg-knock-door.mp3',doorClose:'assets/audio/cg-close-door.mp3',glassDoor:'assets/audio/sliding-glass-door.wav',pickup:'assets/audio/muted-keypress-06-short-tap.wav',button:'assets/audio/dreamcore-click-01-glass.wav',dialogue:'assets/audio/dialogue-blip-01-girl.wav'};
const interactionSounds={};
for(const src of new Set(Object.values(interactionSoundFiles)))GameAudio.prepare(src);
function playInteractionSound(kind){
 if(document.hidden||(typeof mobileSounds!=='undefined'&&mobileSounds.silent))return;
 if(!interactionSoundFiles[kind])return;
 interactionSounds[kind]=GameAudio.play(interactionSoundFiles[kind],{key:'interaction:'+kind,volume:kind==='doorCloseChase'?.65:.5});
}
function playCGCharacterBlip(row){if(row&&typeof row==='object'&&!row.silentBlip&&row.speaker&&row.speaker!=='me'&&row.speaker!=='narrator')playInteractionSound('dialogue')}
document.addEventListener('click',function(event){
 const button=event.target.closest('button,input[type="submit"]');if(!button||button.disabled||button.getAttribute('aria-disabled')==='true')return;
 if(button.closest('#pickup16-code')){playInteractionSound('pickup');return;}
 if(button.closest('#mobile-name-form')||button.matches('[data-action="zero-new"],[data-action="mobile-new"],[data-action="mobile-new-confirm"],[data-action="mobile-name-step"]'))return;
 if(button.closest('.cg-options,.vn-dialogue,.rd-cg,.zero-scene,.ending-scene'))return;
 const label=(button.textContent||button.value||'').trim();
 if(button.closest('.zero-choices,[data-story-reply-box]')||button.matches('[data-story-reply],[data-reason-next],[data-action="d4-reason-next"],[data-action="d4-reason-open"],[data-action="d4-counter-reason"],[data-action="d4-vote-reason-next"]')||/^(确认|确定|我知道了|知道了|同意|好的|完成|提交|购买|立即购买|支付|保存|下一步)/.test(label)||(button.type==='submit'&&button.closest('form')))playInteractionSound('button');
},true);
document.addEventListener('visibilitychange',function(){if(document.hidden)for(const kind of Object.keys(interactionSounds))interactionSounds[kind].pause()});
