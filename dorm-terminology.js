/* Normalize existing local progress and reached choice checkpoints. */
function normalizeDormTerms(text){return text.replaceAll('寝室楼','宿舍楼').replaceAll('寝室','宿舍').replace(/(?<!\d)1栋/g,'A栋').replace(/(?<!\d)2栋/g,'B栋')}
function migrateDormTerms(value){if(!value||typeof value!=='object')return;for(const key of Object.keys(value)){if(typeof value[key]==='string')value[key]=normalizeDormTerms(value[key]);else migrateDormTerms(value[key])}}
migrateDormTerms(state);persist();
const dormNodeRecords=nodeRecords(),dormNodesBefore=JSON.stringify(dormNodeRecords);migrateDormTerms(dormNodeRecords);if(JSON.stringify(dormNodeRecords)!==dormNodesBefore)saveNodes(dormNodeRecords);
const dormTextWalker=document.createTreeWalker(document.querySelector('#phone'),NodeFilter.SHOW_TEXT);let dormTextNode;while(dormTextNode=dormTextWalker.nextNode()){const text=normalizeDormTerms(dormTextNode.nodeValue);if(text!==dormTextNode.nodeValue)dormTextNode.nodeValue=text}
document.querySelectorAll('#phone [aria-label],#phone [placeholder],#phone [title]').forEach(el=>{for(const attr of ['aria-label','placeholder','title'])if(el.hasAttribute(attr))el.setAttribute(attr,normalizeDormTerms(el.getAttribute(attr))) });
