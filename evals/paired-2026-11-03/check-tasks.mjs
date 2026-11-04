// Optional, artifact-level checks. Adapters locate different implementations;
// expectations come from the shared briefs, never from a skill version.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath,pathToFileURL} from 'node:url';
const base=path.dirname(fileURLToPath(import.meta.url));
const {chromium}=await import(process.env.FORM_PLAYWRIGHT_MODULE||'playwright');
const manifest=JSON.parse(await fs.readFile(path.join(base,'artifacts.json'),'utf8'));
const briefs=Object.fromEntries(await Promise.all(['festival','operations','reading','holdout'].map(async key=>[key,JSON.parse(await fs.readFile(path.join(base,'briefs',key+'.json'),'utf8'))])));
const adapters={
 'festival/current':{rows:'.event',room:name=>`[data-room="${name==='All'?'all':name}"]`,saved:'#saved-tab',all:'#all-tab',save:id=>`[data-save="${id}"]`,ticket:'[data-ticket]',dialog:'dialog',close:'[data-close]',empty:'#empty-state',reset:'#empty-action'},
 'operations/current':{rows:'#loans tr',search:'#search',status:name=>`[data-filter="${name==='All'?'All loans':name}"]`,mobileStatus:'#mobile-status',allValue:'All loans',reset:'#empty-reset',open:id=>`[data-open="${id}"]`,dialog:'dialog',check:'#equipment-checked',returned:'#record-return',undo:'#undo-return'},
 'reading/current':{rows:'.book',search:'#search',filter:name=>`[data-filter="${name}"]`,reset:'#reset',open:id=>`.book[data-id="${id}"]`,dialog:'dialog',state:name=>`[data-state="${name}"]`,close:'#close-details'}
};
adapters['festival/revised']={rows:'.event-row',room:name=>`[data-room="${name}"]`,saved:'#saved-view',all:'#all-view',save:id=>`[data-save="${id}"]`,ticket:'[data-ticket]',dialog:'dialog',close:'.dialog-close',empty:'.empty',reset:'#empty-action'};
adapters['operations/revised']={rows:'tbody tr',search:'#loan-search',status:name=>`[data-filter="${name==='All'?'all':name==='Returned'?'Returned locally':name}"]`,mobileStatus:'#status-filter',allValue:'all',value:name=>name==='All'?'all':name==='Returned'?'Returned locally':name,reset:'#empty-reset',open:id=>`[data-open="${id}"]`,dialog:'dialog',returned:'#mark-returned',undo:'#undo-return'};
adapters['reading/revised']={rows:'.book',search:'#search',filter:name=>`[data-filter="${name}"]`,reset:'#reset',open:id=>`#open-${id}`,dialog:'dialog',state:name=>`[data-state="${name}"]`,close:'#closeDetail'};
adapters['festival/final']={rows:'.event',room:name=>`[data-room="${name==='All'?'all':name}"]`,saved:'[data-view="saved"]',all:'[data-view="all"]',save:id=>`[data-save="${id}"]`,ticket:'#ticket-open',dialog:'dialog',close:'#ticket-close',empty:'.empty',reset:'#empty-action'};
adapters['operations/final']={rows:'.loan-row',search:'#loan-search',status:name=>`[data-filter="${name==='All'?'All loans':name}"]`,mobileStatus:'#status-select',allValue:'All loans',reset:'[data-reset]',open:id=>`[data-open="${id}"]`,dialog:'dialog',details:width=>width>1180?'#desktop-detail':'dialog',returned:'[data-return]',undo:'#undo'};
adapters['reading/final']={rows:'.book',search:'#search',filter:name=>`[data-filter="${name}"]`,reset:'#reset',open:id=>`#book-${id}`,dialog:'dialog',state:name=>`[data-state="${name}"]`,close:'#close'};
adapters['holdout/current']={total:'#total',svg:'#bike',open:'#review-quote',close:'#close-quote',dialog:'dialog'};
adapters['holdout/final']={total:'#configuration-total',svg:'#bicycle-illustration',open:'#open-quote',close:'#close-quote',dialog:'dialog'};
const text=async locator=>(await locator.innerText()).replace(/\s+/g,' ').trim();
const fact=s=>String(s).toLocaleLowerCase().replace(/,\s*/g,' ').replace(/\s+/g,' ').trim();
const has=async(locator,value)=>assert.ok(fact(await text(locator)).includes(fact(value)),`Missing ${value}`);
async function count(page,selector,n){assert.equal(await page.locator(selector+':visible').count(),n)}
async function dismiss(page,a){if(await page.locator(a.dialog+'[open]').count())await page.keyboard.press('Escape')}
async function status(page,a,name,width){if(width<600&&a.mobileStatus)await page.locator(a.mobileStatus).selectOption(a.value?a.value(name):name==='All'?a.allValue:name);else await page.locator(a.status(name)).click()}
const flows={
 festival:[
  ['room filtering and factual programme',async(p,a)=>{const events=briefs.festival.facts.events;await count(p,a.rows,events.length);for(const e of events){const row=p.locator(a.rows).filter({hasText:e.artist});for(const value of [e.time,e.artist,e.set,e.room])await has(row,value)}for(const room of ['Boiler Room','Turbine Hall','Listening Room']){await p.locator(a.room(room)).click();await count(p,a.rows,events.filter(e=>e.room===room).length)}await p.locator(a.room('All')).click();await count(p,a.rows,6)}],
  ['save, personal programme, unsave and empty recovery',async(p,a)=>{await p.locator(a.saved).click();assert.equal(await p.locator(a.empty).isVisible(),true);await p.locator(a.reset).click();await p.locator(a.save('e1')).click();await p.locator(a.save('e2')).click();await p.locator(a.saved).click();await count(p,a.rows,2);await p.locator(a.save('e1')).click();await count(p,a.rows,1);await has(p.locator(a.rows),'Low Current');await p.locator(a.save('e2')).click();assert.equal(await p.locator(a.empty).isVisible(),true)}],
  ['day-pass truth and dismissible detail',async(p,a)=>{await p.locator(a.ticket).filter({visible:true}).first().click();const d=p.locator(a.dialog);assert.equal(await d.isVisible(),true);for(const s of ['£28','Saturday 21 November 2026','The Waterworks, Bristol'])await has(d,s);assert.match(await text(d),/unavailable|no.*checkout|not.*(?:sale|purchase|payment)/i);await p.keyboard.press('Escape');assert.equal(await d.isVisible(),false);assert.notEqual(await p.evaluate(()=>document.activeElement.tagName),'BODY');await p.locator(a.ticket).filter({visible:true}).first().click();await p.locator(a.close).filter({visible:true}).first().click();assert.equal(await d.isVisible(),false)}]
 ],
 operations:[
  ['loan facts, combined search/filter, empty/reset',async(p,a,width)=>{await count(p,a.rows,6);for(const loan of briefs.operations.facts.loans){const row=p.locator(a.rows).filter({hasText:loan.id});for(const value of [loan.id,loan.person,loan.item,loan.due,loan.state])await has(row,value)}await p.locator(a.search).fill('Montgomery');await count(p,a.rows,1);await has(p.locator(a.rows+':visible'),'L-1044');await status(p,a,'Overdue',width);await count(p,a.rows,0);await p.locator(a.reset).click();await count(p,a.rows,6);await p.locator(a.search).fill('L-1043');await count(p,a.rows,1);await p.locator(a.search).fill('wireless');await count(p,a.rows,1);await has(p.locator(a.rows+':visible'),'L-1046')}],
  ['return, row/count consistency and latest undo',async(p,a,width)=>{await status(p,a,'Overdue',width);await count(p,a.rows,2);await p.locator(a.open('L-1043')).click();if(a.check)await p.locator(a.check).check();await p.locator(a.returned).filter({visible:true}).first().click();await dismiss(p,a);await count(p,a.rows,1);await p.locator(a.open('L-1047')).click();if(a.check)await p.locator(a.check).check();await p.locator(a.returned).filter({visible:true}).first().click();await dismiss(p,a);await count(p,a.rows,0);await status(p,a,'Returned',width);await count(p,a.rows,2);await p.locator(a.undo).filter({visible:true}).first().click();await count(p,a.rows,1);await has(p.locator(a.rows+':visible'),'L-1043');await status(p,a,'Overdue',width);await count(p,a.rows,1);await has(p.locator(a.rows+':visible'),'L-1047')}],
  ['detail discoverability and applicable keyboard close',async(p,a,width)=>{await p.locator(a.open('L-1044')).click();const d=p.locator(a.details?a.details(width):a.dialog);for(const s of ['L-1044','Alexandria Montgomery-Wright','Manfrotto carbon-fibre tripod + fluid head','Tomorrow, 12:00','On loan'])await has(d,s);if(await p.locator('dialog[open]').count()){await p.keyboard.press('Escape');assert.equal(await p.locator('dialog').isVisible(),false);assert.notEqual(await p.evaluate(()=>document.activeElement.tagName),'BODY')}}]
 ],
 reading:[
  ['search, combined state filter, empty/reset',async(p,a)=>{await count(p,a.rows,4);await p.locator(a.search).fill('Velez');await count(p,a.rows,1);await has(p.locator(a.rows+':visible'),'A Map of Small Distances');await p.locator(a.filter('Finished')).click();await count(p,a.rows,0);await p.locator(a.reset).click();await count(p,a.rows,4);await p.locator(a.search).fill('Night Gardens');await count(p,a.rows,1)}],
  ['all reading states and shelf consistency',async(p,a)=>{await p.locator(a.open('b2')).click();for(const state of ['Reading','Finished','Want to read']){await p.locator(a.state(state)).click();assert.equal(await p.locator(a.state(state)).getAttribute('aria-pressed'),'true')}await p.keyboard.press('Escape');await p.locator(a.filter('Want to read')).click();await count(p,a.rows,2);await p.locator(a.open('b2')).click();await p.locator(a.state('Finished')).click();await p.keyboard.press('Escape');await count(p,a.rows,1);assert.notEqual(await p.evaluate(()=>document.activeElement.tagName),'BODY');await p.locator(a.filter('Finished')).click();await count(p,a.rows,2)}],
  ['all supplied detail facts, visible close and Escape/focus',async(p,a)=>{for(const book of briefs.reading.facts.books){await p.locator(a.open(book.id)).click();const d=p.locator(a.dialog);for(const value of [book.title,book.author,book.kind,book.pages,book.note])await has(d,value);if(book.id==='b1')await p.locator(a.close).click();else await p.keyboard.press('Escape');assert.equal(await d.isVisible(),false);assert.notEqual(await p.evaluate(()=>document.activeElement.tagName),'BODY')}}]
 ]
};
async function choose(p,value){const input=p.locator(`input[type="radio"][value="${value}"]`),label=input.locator('xpath=ancestor::label[1]');if(await label.count())await label.click();else await input.check();assert.equal(await input.isChecked(),true)}
const money=async(p,a)=>Number((await text(p.locator(a.total))).replace(/[^\d.]/g,''));
flows.holdout=[
 ['all 18 configurations and accurate total',async(p,a)=>{for(const size of briefs.holdout.facts.sizes)for(const colour of briefs.holdout.facts.colors)for(const wheels of briefs.holdout.facts.wheelOptions){await choose(p,size);await choose(p,colour.name);await choose(p,wheels.name);assert.equal(await money(p,a),1650+wheels.extra)}}],
 ['colour changes the actual bicycle drawing',async(p,a)=>{for(const colour of briefs.holdout.facts.colors){await choose(p,colour.name);const rgb='rgb('+colour.hex.slice(1).match(/../g).map(x=>parseInt(x,16)).join(', ')+')';const count=await p.locator(a.svg).evaluate((svg,rgb)=>[...svg.querySelectorAll('*')].filter(e=>{const s=getComputedStyle(e);return s.stroke===rgb||s.fill===rgb}).length,rgb);assert.ok(count>0,colour.name+' must paint the drawing')}}],
 ['truthful current quote, visible close and Escape',async(p,a)=>{await choose(p,'Small');await choose(p,'Forest');await choose(p,'All-road wheels');await p.locator(a.open).click();const d=p.locator(a.dialog);for(const s of ['Small','Forest','All-road wheels'])await has(d,s);assert.match(await text(d),/1,?770/);assert.match(await text(d),/no order|not.*order|no.*payment|does not.*order/i);await p.locator(a.close).click();assert.equal(await d.isVisible(),false);await p.locator(a.open).click();await p.keyboard.press('Escape');assert.equal(await d.isVisible(),false);assert.notEqual(await p.evaluate(()=>document.activeElement.tagName),'BODY')}]
];
const browser=await chromium.launch({headless:true});const results=[];
try{
 for(const artifact of manifest.artifacts){
  const a=adapters[artifact.case+'/'+artifact.condition];if(!a)throw new Error('Missing UI adapter: '+artifact.case+'/'+artifact.condition);
  for(const width of [1440,390])for(const[name,run]of flows[artifact.case]){
   const context=await browser.newContext({viewport:{width,height:width===390?844:1000},offline:true,reducedMotion:'reduce'});const page=await context.newPage();page.setDefaultTimeout(3000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
   let passed=true,error;
   try{await page.goto(pathToFileURL(path.join(base,artifact.file)).href);await run(page,a,width);assert.equal(errors.length,0)}catch(e){passed=false;error=e.message}
   results.push({case:artifact.case,condition:artifact.condition,width,flow:name,passed,...(error?{error}:{})});await context.close();
  }
 }
}finally{await browser.close()}
await fs.writeFile(path.join(base,'task-results.json'),JSON.stringify({scope:'Saved-artifact brief-level task checks; not a beauty metric or full accessibility audit.',results},null,2)+'\n');
console.log(JSON.stringify({flows:results.length,passed:results.filter(r=>r.passed).length,failed:results.filter(r=>!r.passed)},null,2));
if(results.some(r=>!r.passed))process.exitCode=1;
