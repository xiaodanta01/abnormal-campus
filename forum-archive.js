/* Stable pre-lockdown archive and shared forum composer. */
const WALL_ARCHIVE_POST={id:'prelock-room316',preserveForumNames:true,author:'forum-account-2',name:'茉莉雨',category:'互助问答',date:'2045-09-03',time:'17:26',title:'B栋3楼有没有宝宝可以帮我带个东西出来',body:'有东西落在宿舍了，但舍友都不在宿舍😭\n有没有三楼的宝宝顺路帮我带下来，我请喝奶茶❤️',likes:0,replies:[
 {author:'archive-puff',name:'奶油泡芙',time:'17:27',text:'A栋路过，帮你顶一下'},
 {author:'archive-cheng',name:'也许想法天真',time:'17:29',text:'我在318，我可以帮你拿'},
 {author:'forum-account-2',name:'楼主',replyTo:'也许想法天真',time:'17:29',text:'宝宝你是天使，给我讯息号我加你ovo'},
 {author:'archive-cheng',name:'也许想法天真',replyTo:'楼主',time:'17:29',text:'celine07'},
 {author:'archive-sleep',name:'在睡觉',time:'17:31',text:'是男生无能为力了'}]};
const ALIVE_GOSSIP_POST={id:'day2-gossip-qiyue',preserveForumNames:true,author:'gossip-early-class',name:'今天也不想早八',category:'吃瓜',date:'2045-09-01',time:'22:14',title:'【有图】508某人是不是在知三当三？',body:'刚才在北门看见qy和cy一起回来。\n两个人共用一把伞，cy还帮她拿着包。\n\ncy不是有女朋友吗？',likes:0,replies:[{id:'gossip-qiyue-c1',author:'archive-puff',name:'奶油泡芙',text:'不是吧，qy知道cy有女朋友吗？',date:'2045-09-01',time:'22:14',replies:[]},{id:'gossip-qiyue-c2',author:'archive-sleep',name:'在睡觉',text:'一张背影图就直接判小三？',date:'2045-09-01',time:'22:14',replies:[]}]};
for(const [id,name,gender] of [['archive-puff','奶油泡芙','female'],['archive-cheng','也许想法天真','female'],['archive-sleep','在睡觉','male']])registerForumAccount(id,name,gender);
registerForumAccount('gossip-early-class','今天也不想早八','female');
function repairChengRoomReferences(progress){
 for(const rows of Object.values(progress.messages||{}))for(const message of rows){
  if(message.text==='你以前说自己住316，为什么现在备注是602？')message.text='你以前说自己住318，为什么现在备注是602？';
  if(message.type==='forum-shot'&&message.src==='assets/p1.jpg')message.src='assets/p1-room318.jpg';
 }
 for(const f of [progress.story?.freeAction,progress.story?.dayTwoFreeAction,progress.story?.dayThreeFreeAction])for(const clue of f?.clues||[])if(clue.id==='cheng'||clue.result==='cheng'){
  if(clue.title==='316与602')clue.title='318与602';
  if(typeof clue.text==='string')clue.text=clue.text.replace('她曾公开表示自己住316','她曾公开表示自己住318');
 }
}
function wallArchiveInstall(progress){if(!progress?.forumPosts)return;repairChengRoomReferences(progress);if(!progress.forumPosts.some(p=>p.id===WALL_ARCHIVE_POST.id))progress.forumPosts.push(structuredClone(WALL_ARCHIVE_POST));const post=progress.forumPosts.find(p=>p.id===WALL_ARCHIVE_POST.id);for(const reply of post.replies||[])if(reply.author==='archive-cheng'&&reply.text==='我在316，我可以帮你拿')reply.text='我在318，我可以帮你拿';if(!progress.forumPosts.some(p=>p.id===ALIVE_GOSSIP_POST.id))progress.forumPosts.push(structuredClone(ALIVE_GOSSIP_POST));wallStampProgress(progress)}
wallStampRows(WALL_ARCHIVE_POST.replies,WALL_ARCHIVE_POST.date,WALL_ARCHIVE_POST.time);
if(!C.forumPosts.some(p=>p.id===WALL_ARCHIVE_POST.id))C.forumPosts.push(structuredClone(WALL_ARCHIVE_POST));
if(!C.forumPosts.some(p=>p.id===ALIVE_GOSSIP_POST.id))C.forumPosts.push(structuredClone(ALIVE_GOSSIP_POST));
wallArchiveInstall(state);const wallArchiveNodes=nodeRecords();for(const r of Object.values(wallArchiveNodes))wallArchiveInstall(r.checkpoint);saveNodes(wallArchiveNodes);
const wallArchivePersist=persist;persist=function(){wallArchiveInstall(state);return wallArchivePersist()};
function wallComposerStyle(){for(const form of screen.querySelectorAll('.rule-comment-form')){form.classList.add('wall-unified-composer');const input=form.querySelector('input');if(input&&!input.placeholder)input.placeholder='友善地说两句…';const button=form.querySelector('.pill-button');if(button)button.textContent='回复'}}
const wallArchiveForum=forum;forum=function(...args){wallArchiveInstall(state);const result=wallArchiveForum(...args);if(view==='wall'){const tabs=screen.querySelector('.category-tabs');if(tabs&&!tabs.querySelector('[data-forum-category="吃瓜"]'))tabs.insertAdjacentHTML('beforeend','<button data-forum-category="吃瓜" class="'+(forumCategory==='吃瓜'?'current':'')+'">吃瓜</button>')}return result};
const wallArchiveDetail=postDetail;postDetail=function(...args){wallArchiveInstall(state);const result=wallArchiveDetail(...args);wallComposerStyle();return result};
const wallArchiveRules=rulesPage;rulesPage=function(...args){wallStampProgress(state);const result=wallArchiveRules(...args);wallComposerStyle();return result};
persist();if(view==='wall')forum();else if(view==='post')postDetail(active);else if(view==='rules')rulesPage();
