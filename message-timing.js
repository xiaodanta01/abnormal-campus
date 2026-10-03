/* Global message pacing; independent of story saves and cinematic timers. */
const MESSAGE_INTERVAL_KEY='abnormal-campus-message-interval';
let messageIntervalSeconds=2.7;
try{const n=Number(GameStorage.getItem(MESSAGE_INTERVAL_KEY));if(n>=1&&n<=10)messageIntervalSeconds=n}catch{}
function messageSendDelay(){return Math.round(messageIntervalSeconds*1000)}
function setMessageInterval(value){messageIntervalSeconds=Math.max(1,Math.min(10,Number(value)||2.7));try{GameStorage.setItem(MESSAGE_INTERVAL_KEY,String(messageIntervalSeconds))}catch{}}
