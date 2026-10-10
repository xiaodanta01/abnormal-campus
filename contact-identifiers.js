/* Fixed public messaging identifiers; friendship permissions stay story-controlled. */
const CONTACT_SOCIAL_PROFILES={
 hean:{signature:'无法与食物分手的女人',moments:[{date:'2045年7月30日 20:20',text:'鸡翅太好吃了……',image:'assets/hean-chicken-wings.jpg?v=20261011-rc4',imageAlt:'一锅鸡翅',replies:[]}]},
 huangyiyi:{signature:'点开我资料干啥，暗恋我？',moments:[{date:'2045年9月4日 21:01',text:'我妈说我们现在日子过得好，都是无人机配送到柜，她那时候天天被偷外卖哈哈哈哈哈哈哈哈哈',replies:[]}]},
 zhoumo:{signature:'小幸运',moments:[{date:'2045年8月25日 00:02',text:'要和晓晓做一辈子的好朋友！',replies:[{name:'江晓',text:'那肯定呀'}]}]},
 yelin:{signature:'最烦装X的人',moments:[{date:'2045年7月21日 23:23',text:'哇 我居然是ESTJ',replies:[]}]}
};
const CONTACT_IDENTIFIERS=Object.freeze([
 Object.freeze({key:'hean',name:'何安',handle:'annnn0426',avatar:'chat_hean_v1',contact:'day4-hean'}),
 Object.freeze({key:'huangyiyi',name:'黄依依',handle:'sunnyyiyi213',avatar:'chat_huangyiyi_v1',contact:'day4-huang'}),
 Object.freeze({key:'zhoumo',name:'周茉',handle:'weekend1023',avatar:'chat_zhoumo_v2',contact:'zhoumo'}),
 Object.freeze({key:'yelin',name:'叶琳',handle:'yeeeee',avatar:'npc-yelin-v1',contact:'yelin'}),
 Object.freeze({key:'meng',name:'孟舒',handle:'shushu00',avatar:'chat_mengshu',contact:'mengshu-friend'}),
 Object.freeze({key:'lin',name:'林晴',handle:'linqing_1217',avatar:'linqing',contact:'linqing'}),
 Object.freeze({key:'shen',name:'沈可欣',handle:'happykx',avatar:'shen',contact:'shen-friend'}),
 Object.freeze({key:'jiang',name:'江晓',handle:'JXiao_1103',avatar:'npc-jiangxiao',contact:JX.id}),
 Object.freeze({key:'wen',name:'温宁',handle:'wenningovo',avatar:'npc-wenning',contact:'wenning'}),
 Object.freeze({key:'zhao',name:'赵诗雨',handle:'kikiiou22',avatar:'npc-zhaoshiyu',contact:'zhaoshiyu'}),
 Object.freeze({key:'cheng',name:'程昕',handle:'celine07',avatar:'npc-chengxin',contact:'chengxin'})
]);
function messageIdentifiers(){return state.hospitalPhoneData?Object.values(state.contactProfiles||{}):CONTACT_IDENTIFIERS}
function identifierFriend(p){return !!(state.story.started||state.hospitalPhoneData)&&state.contacts.some(c=>c.id===p.contact&&!c.members)}
function identifierSignature(p){if(p.signature!==undefined)return p.signature;if(CONTACT_SOCIAL_PROFILES[p.key])return CONTACT_SOCIAL_PROFILES[p.key].signature;return p.key==='meng'?'下雨天':p.key==='lin'?Z.linqingProfile.signature:p.key==='shen'?SHEN_PROFILE.signature:p.key==='wen'?(FA_WEN_PROFILE.signature||'这个人什么也没写。'):p.key==='zhao'?'这个人什么也没写。':''}
function identifierCard(p){const friend=identifierFriend(p);return `<div class="contact-detail-hero">${avatar(p.avatar)}<div><small>讯息 · 个人资料</small><h2>${p.name}</h2><span class="contact-relation">${friend?'已添加的朋友':'个人名片'}</span></div></div><div class="contact-detail-fields"><div class="contact-detail-row"><span>讯息号</span>${friend?`<span class="contact-handle" tabindex="0" data-copy-handle="${p.key}" aria-label="讯息号 ${p.handle}，长按复制">${p.handle}</span>`:'<small>成为好友后可查看</small>'}</div>${identifierSignature(p)?`<div class="contact-detail-row signature"><span>个性签名</span><p>${esc(identifierSignature(p))}</p></div>`:''}</div>${friend?'<p class="contact-copy-note">长按讯息号即可复制</p>':''}`}
function decorateIdentifierProfile(key){const p=state.contactProfiles?.[state.messageProfile]||messageIdentifiers().find(x=>x.key===key),card=screen.querySelector('.lin-profile-card');if(!card)return;card.classList.add('contact-detail');card.innerHTML=identifierCard(p)}
const identifierLinProfile=linProfile;linProfile=function(...args){identifierLinProfile(...args);if(view==='lin-profile')decorateIdentifierProfile('lin')};
const identifierShenProfile=shenProfile;shenProfile=function(...args){identifierShenProfile(...args);if(view==='shen-profile')decorateIdentifierProfile('shen')};
const identifierJiangProfile=jxProfile;jxProfile=function(...args){identifierJiangProfile(...args);if(view==='jx-profile')decorateIdentifierProfile('jiang')};
let identifierQuery='';
function identifierSearch(){messageContacts();screen.querySelector('#contacts-handle-search')?.scrollIntoView({block:'nearest'});screen.querySelector('#contacts-handle-search input')?.focus()}
let identifierSearched=false;
function renderInlineIdentifierResult(){const container=screen.querySelector('#identifier-result');if(!container||!identifierSearched)return;const p=messageIdentifiers().find(x=>x.handle.toLowerCase()===identifierQuery.trim().toLowerCase());container.innerHTML=p?`<div class="lin-profile-card contact-detail">${identifierCard(p)}${p.key==='cheng'?'<button class="primary contact-add-cheng" data-action="identifier-add-cheng">添加程昕好友</button>':''}</div>`:'<p class="contact-search-empty">未找到对应的讯息号</p>';return p}
actions['identifier-add-cheng']=()=>toast('她关闭了讯息号加好友功能');

function identifierSearchProfile(key){const p=messageIdentifiers().find(x=>x.key===key);if(!p||zeroLock())return;if(state.contactProfiles?.[p.contact]){state.messageProfile=p.contact;linProfile();const back=screen.querySelector('.page-head button');if(back){back.dataset.action='message-contacts';back.setAttribute('aria-label','返回通讯录')}return}if(identifierFriend(p)&&p.key!=='cheng'){({hean:()=>faProfile('hean'),huangyiyi:()=>faProfile('huangyiyi'),meng:postMengProfile,lin:linProfile,shen:shenProfile,jiang:jxProfile,wen:()=>faProfile('wen'),zhao:()=>faProfile('zhao'),zhoumo:()=>faProfile('zhoumo'),yelin:()=>faProfile('yelin')}[p.key])();const back=screen.querySelector('.page-head button');if(back){back.dataset.action='identifier-search';back.setAttribute('aria-label','返回查找好友')}return}view='contact-public-profile';active=p.key;screen.innerHTML=`<section class="app-page lin-profile"><header class="page-head"><button class="icon-button" data-action="identifier-search" aria-label="返回查找好友">${icon('back')}</button><h1>个人资料</h1></header><div class="lin-profile-card contact-detail">${identifierCard(p)}</div></section>`}
actions['new-chat']=identifierSearch;actions['identifier-search']=identifierSearch;
document.addEventListener('click',e=>{const b=e.target.closest('[data-identifier-profile]');if(b)identifierSearchProfile(b.dataset.identifierProfile)});
async function copyContactHandle(key){const p=messageIdentifiers().find(x=>x.key===key);if(!p||!identifierFriend(p))return;try{await navigator.clipboard.writeText(p.handle);toast(key==='cheng'?'已复制 可前往通讯录添加好友':'讯息号已复制')}catch{const input=document.createElement('textarea');input.value=p.handle;input.style.cssText='position:fixed;opacity:0;pointer-events:none';document.body.append(input);input.select();const copied=document.execCommand('copy');input.remove();toast(copied?(key==='cheng'?'已复制 可前往通讯录添加好友':'讯息号已复制'):'请选中讯息号后复制')}}
let handlePress=null;
document.addEventListener('pointerdown',e=>{const target=e.target.closest('[data-copy-handle]');if(!target)return;handlePress={x:e.clientX,y:e.clientY,timer:setTimeout(()=>{copyContactHandle(target.dataset.copyHandle);handlePress=null},550)}});
function cancelHandlePress(){if(handlePress)clearTimeout(handlePress.timer);handlePress=null}
document.addEventListener('pointermove',e=>{if(handlePress&&Math.hypot(e.clientX-handlePress.x,e.clientY-handlePress.y)>10)cancelHandlePress()});document.addEventListener('pointerup',cancelHandlePress);document.addEventListener('pointercancel',cancelHandlePress);
document.addEventListener('keydown',e=>{const target=e.target.closest('[data-copy-handle]');if(target&&e.key==='Enter')copyContactHandle(target.dataset.copyHandle)});
window.ContactIdentifierDirectory=CONTACT_IDENTIFIERS;
