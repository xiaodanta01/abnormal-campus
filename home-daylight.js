/* Home-screen daylight follows the in-game clock. */
const homeNightSymbol=icon('moon')+'<i>✦</i>';
const homeSunSymbol='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-label="白天"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg>';
function updateHomeDaylight(){if(view!=='home')return;const day=Number(state.system.time.split(':')[0])<18;const symbol=screen.querySelector('.moon-drawing');if(symbol){const mode=day?'day':'night';if(symbol.dataset.light!==mode){symbol.dataset.light=mode;symbol.innerHTML=day?homeSunSymbol:homeNightSymbol}symbol.style.color=day?'#cfb780':''}const foot=screen.querySelector('.home-footnote');if(foot){const text='点击设置可返回游戏主页';if(!foot.textContent.includes(text))foot.innerHTML='<span></span> '+text+' <span></span>'}}
const daylightHome=home;home=function(...args){const result=daylightHome(...args);updateHomeDaylight();return result};
const daylightStatus=status;status=function(...args){const result=daylightStatus(...args);updateHomeDaylight();return result};
updateHomeDaylight();
