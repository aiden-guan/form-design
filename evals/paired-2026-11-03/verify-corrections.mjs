import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const base=path.dirname(fileURLToPath(import.meta.url));
const {chromium}=await import(process.env.FORM_PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true});
const url=name=>pathToFileURL(path.join(base,'outputs',name,'final/index.html')).href;
const double=page=>page.evaluate(()=>{const sizes=[...document.querySelectorAll('body,body *')].map(e=>[e,getComputedStyle(e).fontSize]);for(const[e,s]of sizes)if(e instanceof HTMLElement)e.style.fontSize=parseFloat(s)*2+'px'});
const report={scope:'Exact post-repair states with computed-font doubling. Focused geometry/navigation checks, not browser zoom or a full accessibility audit.',festival:{},operations:{},reading:[]};
try{
 let p=await browser.newPage({viewport:{width:900,height:1000}});
 await p.goto(url('festival'));await double(p);
 report.festival.enlarged900=await p.evaluate(()=>({headerActionRight:document.querySelector('#ticket-open').getBoundingClientRect().right,rows:[...document.querySelectorAll('.event')].map(e=>{const r=el=>{const range=document.createRange();range.selectNodeContents(el);return range.getBoundingClientRect()};const a=r(e.querySelector('.time')),n=r(e.querySelector('.artist'));return {artist:e.querySelector('.artist').textContent,gap:n.left-a.right,overlap:Math.min(a.right,n.right)>Math.max(a.left,n.left)&&Math.min(a.bottom,n.bottom)>Math.max(a.top,n.top)}})}));
 if(report.festival.enlarged900.headerActionRight>901||report.festival.enlarged900.rows.some(r=>r.overlap))throw Error('Festival intermediate reflow failed');
 await p.locator('#events').scrollIntoViewIfNeeded();await p.screenshot({path:path.join(base,'outputs/festival/final/captures/intermediate-enlarged.png')});
 await p.setViewportSize({width:390,height:844});await p.goto(url('festival'));await double(p);
 report.festival.enlarged390=await p.evaluate(()=>{const a=document.querySelector('.wave-art').getBoundingClientRect(),t=document.querySelector('.hero h1').getBoundingClientRect();return {artTop:a.top,titleBottom:t.bottom,intersects:Math.min(a.right,t.right)>Math.max(a.left,t.left)&&Math.min(a.bottom,t.bottom)>Math.max(a.top,t.top)}});
 if(report.festival.enlarged390.intersects)throw Error('Artwork intersects enlarged wordmark');
 await p.locator('#ticket-open').click();report.festival.dialog=await p.locator('dialog').evaluate(d=>({clientWidth:d.clientWidth,scrollWidth:d.scrollWidth,closeRight:d.querySelector('#ticket-close').getBoundingClientRect().right,dialogRight:d.getBoundingClientRect().right,title:d.querySelector('h2').textContent}));
 if(report.festival.dialog.scrollWidth>report.festival.dialog.clientWidth+1||report.festival.dialog.closeRight>report.festival.dialog.dialogRight+1)throw Error('Festival modal overflow');
 await p.screenshot({path:path.join(base,'outputs/festival/final/captures/dialog-enlarged.png')});await p.close();
 report.operations.views=[];
 for(const width of[1440,390]){
  p=await browser.newPage({viewport:{width,height:1000}});await p.goto(url('operations'));await p.locator('#loan-search').focus();
  const check=await p.locator('#loan-search').evaluate(e=>({ring:getComputedStyle(e).outlineColor,undoArrows:document.querySelectorAll('#undo svg').length,inaccurateHint:document.querySelectorAll('.keyboard-tip').length}));
  if(check.ring!=='rgb(34, 85, 204)'||check.undoArrows||check.inaccurateHint)throw Error('Operations focus/ornament repair failed');
  await double(p);check.hiddenSkipBottom=await p.locator('.skip').evaluate(e=>e.getBoundingClientRect().bottom);if(check.hiddenSkipBottom>0)throw Error('Skip-link leakage');
  await p.locator('.skip').focus();check.focusedSkipTop=await p.locator('.skip').evaluate(e=>e.getBoundingClientRect().top);await p.keyboard.press('Enter');check.target=await p.evaluate(()=>document.activeElement.id);if(check.target!=='loan-search')throw Error('Skip navigation failed');report.operations.views.push({width,...check});await p.close();
 }
 for(const width of[320,390]){
  p=await browser.newPage({viewport:{width,height:844}});
  for(const id of['b1','b2','b3','b4']){
   await p.goto(url('reading'));await p.locator('#book-'+id).click();await double(p);
   const check=await p.locator('#detail-title').evaluate(el=>{const node=el.firstChild,broken=[];for(const m of node.textContent.matchAll(/\S+/g)){const r=document.createRange();r.setStart(node,m.index);r.setEnd(node,m.index+m[0].length);if(r.getClientRects().length>1)broken.push(m[0])}const d=el.closest('dialog');return {title:el.textContent,brokenWords:broken,dialogOverflow:d.scrollWidth>d.clientWidth+1}});
   if(check.brokenWords.length||check.dialogOverflow)throw Error('Reading detail reflow failed');report.reading.push({width,id,...check});
   if(width===390&&id==='b4')await p.screenshot({path:path.join(base,'outputs/reading/final/captures/detail-enlarged.png')});
  }await p.close();
 }
}finally{await browser.close()}
report.sourceSha256={};for(const name of['festival','operations','reading'])report.sourceSha256[name]=createHash('sha256').update(await fs.readFile(path.join(base,'outputs',name,'final/index.html'))).digest('hex');
await fs.writeFile(path.join(base,'final-geometry-verification.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({festivalOverlaps:0,minimumTimeGap:Math.min(...report.festival.enlarged900.rows.map(r=>r.gap)),dialogOverflow:report.festival.dialog.scrollWidth-report.festival.dialog.clientWidth,artOverlap:false,operations:report.operations.views,readingDetails:report.reading.length},null,2));
