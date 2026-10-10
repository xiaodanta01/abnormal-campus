/* Normalize at the save boundary, before any scene can enumerate legacy data.
 * Never borrow progress from another save or re-run a story action here. */
window.SaveSchema=(()=>{
 const object=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
 const clone=v=>JSON.parse(JSON.stringify(v));
 function array(value,fallback=[]){
  if(Array.isArray(value))return value;
  if(object(value))return Object.values(value);
  return clone(fallback);
 }
 function fields(target,defaults){for(const key of Object.keys(defaults)){if(target[key]===undefined||target[key]===null)target[key]=clone(defaults[key])}return target}
 function normalize(input){
  if(!object(input))throw new Error('Invalid save root: expected an object');
  const s=WebAssets.normalize(input),c=window.CAMPUS_CONFIG;
  s.system=fields(object(s.system)?s.system:{},c.system);
  s.game=fields(object(s.game)?s.game:{},c.initialState);
  for(const k of ['inventory','orders','unlockedApps','triggeredEvents'])if(k in s.game||k!=='orders')s.game[k]=array(s.game[k]);
  for(const k of ['trust','flags'])if(!object(s.game[k]))s.game[k]={};
  s.contacts=array(s.contacts,c.contacts);
  s.forumPosts=array(s.forumPosts,c.forumPosts||[]);
  s.orders=array(s.orders);s.cart=object(s.cart)?s.cart:{};
  if('expanded' in s)s.expanded=array(s.expanded);
  s.messages=object(s.messages)?s.messages:{};
  for(const key of Object.keys(s.messages)){
   s.messages[key]=array(s.messages[key]);
   // Correct authored display content in existing chat saves/checkpoints only.
   for(const row of s.messages[key])if(object(row)){
    if(row.id==='day4-confront-5'&&row.text==='\u7cb1音告诉我的')row.text='梁音告诉我的';
    if(row.id==='day4-confront-8'&&row.hgWho==='shen'&&row.type==='image'&&row.src==='assets/day3-songyan-logistics.svg?v=20261011-rc4')row.src='assets/day4-shen-logistics.svg?v=20261011-rc4';
   }
  }
  for(const contact of s.contacts){
   if(!object(contact))throw new Error('Invalid contact record');
   const original=c.contacts.find(row=>row.id===contact.id);
   if(original)fields(contact,original);
   if(contact.preview==='\u7cb1音告诉我的')contact.preview='梁音告诉我的';
   if('members' in contact)contact.members=array(contact.members,original?.members||[]);
   s.messages[contact.id]=array(s.messages[contact.id],c.messages[contact.id]||[]);
  }
  function replies(row){for(const k of ['comments','replies'])if(k in row){row[k]=array(row[k]);for(const child of row[k])if(object(child))replies(child)}}
  for(const post of s.forumPosts){if(!object(post))throw new Error('Invalid forum record');replies(post)}
  for(const order of s.orders)if(object(order)&&'items' in order)order.items=array(order.items);
  if(object(s.story)){
   s.story.comments=array(s.story.comments,window.DAY_ONE?.comments||[]);
   s.story.deliveryNoticeIds=array(s.story.deliveryNoticeIds);
   for(const k of ['freeAction','dayTwoFreeAction','dayThreeFreeAction'])if(object(s.story[k])){
    const f=s.story[k];for(const name of ['completed','newCards','seenUnlocks','clues'])f[name]=array(f[name]);
   }
   const q=s.story.dayThreeReasoning;if(object(q))for(const k of ['clues','fivePairs','fiveAttempts','fourPairs'])q[k]=array(q[k]);
   if(object(s.story.firstMorning))s.story.firstMorning.left=array(s.story.firstMorning.left);
   if(object(s.story.afterWall))s.story.afterWall.pendingPosts=array(s.story.afterWall.pendingPosts);
   if(object(s.story.dayFourReasoning))for(const k of ['pair','slots','completed'])s.story.dayFourReasoning[k]=array(s.story.dayFourReasoning[k]);
   if(object(s.story.dayFourVoteReasoning))for(const k of ['crossed','support','hypothesis','slots'])s.story.dayFourVoteReasoning[k]=array(s.story.dayFourVoteReasoning[k]);
   if(object(s.story.dayFourSleep?.phone))normalize(s.story.dayFourSleep.phone);
  }
  if(object(s.contactProfiles))for(const profile of Object.values(s.contactProfiles))if(object(profile))profile.moments=array(profile.moments);
  return s;
 }
 function chat(s,id){if(!object(s.messages))s.messages={};return s.messages[id]=array(s.messages[id])}
 return {normalize,array,chat};
})();
