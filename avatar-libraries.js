/* Independent resource and identity namespaces. Only forum bindings use this storage key. */
const chatAvatarLibrary={entries:{},resolve(p){if(!p)return null;const id=p.id.startsWith('chat_')?p.id:'chat_'+p.id;const src=p.src?.replace(/^assets\/(?!chat-avatars\/)((?:(?:npc-|player-approved-|reward-)[^/]+\.jpg)|[^/]+\.svg)$/,'assets/chat-avatars/$1');return this.entries[id]={...p,id,src}}};
const forumAvatarLibrary={version:2,pools:{female:['forum_f_01','forum_f_02'],male:['forum_m_02','forum_m_03'],neutral:['forum_n_01','forum_n_02']},accounts:{},bindings:{},src(id){return 'assets/forum-avatars-v1/'+id+'.jpg?v=2'}};
try{const saved=JSON.parse(GameStorage.getItem('afterclass-forum-avatars-v1')||'null');if(saved?.version===2)forumAvatarLibrary.bindings=saved.bindings||{}}catch{}
function registerForumAccount(id,name,gender){const account={id:name||id,name:name||'匿名用户',gender:['male','female'].includes(gender)?gender:'neutral'};forumAvatarLibrary.accounts[id]=account;if(name)forumAvatarLibrary.accounts[name]=account;return account}
function forumPortraitFor(id,name,gender){const existing=forumAvatarLibrary.accounts[name]||forumAvatarLibrary.accounts[id];const account=existing&&(!gender||existing.gender===gender)?existing:registerForumAccount(id,name,gender);const pool=forumAvatarLibrary.pools[account.gender]||forumAvatarLibrary.pools.neutral;let assigned=forumAvatarLibrary.bindings[account.id];if(!pool.includes(assigned)){let hash=0;for(const ch of String(account.id))hash=(hash*31+ch.charCodeAt(0))>>>0;assigned=pool[hash%pool.length];forumAvatarLibrary.bindings[account.id]=assigned;try{GameStorage.setItem('afterclass-forum-avatars-v1',JSON.stringify({version:2,bindings:forumAvatarLibrary.bindings}))}catch{}}return {...account,avatarId:assigned,src:forumAvatarLibrary.src(assigned)}}
function forumAvatar(id,name,gender){const p=forumPortraitFor(id,name,gender);return '<span class="avatar" data-forum-account="'+esc(p.id)+'" data-avatar-id="'+p.avatarId+'"><img src="'+p.src+'" alt="'+esc(p.name)+'"></span>'}
window.chatAvatarLibrary=chatAvatarLibrary;window.forumAvatarLibrary=forumAvatarLibrary;

for(const name of ['林晴','沈可欣','江晓','赵诗雨','温宁','苏沐','秦琦','程昕'])registerForumAccount(name,name,'female');

// One-time redistribution for the newly supplied gender-matched animal choices.
try{if(GameStorage.getItem('afterclass-forum-animal-pool')!=='2'){forumAvatarLibrary.bindings={};GameStorage.setItem('afterclass-forum-avatars-v1',JSON.stringify({version:1,bindings:{}}));GameStorage.setItem('afterclass-forum-animal-pool','2')}}catch{}
