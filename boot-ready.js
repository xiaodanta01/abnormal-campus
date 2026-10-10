// Install after all chapter wrappers: sleeping saves cannot relock menu navigation.
const bootSceneLock=zeroLock;
zeroLock=function(){return !storyInputDormant()&&bootSceneLock()};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>BootRecovery.complete(),{once:true});
else BootRecovery.complete();

// Capture programmatic post entry as well as taps, after chapter-specific wrappers.
const wallPositionPostBase=postDetail;
postDetail=function(...args){captureWallPosition();return wallPositionPostBase(...args)};
