// Narrow checks for these demo briefs. The full checklist still needs visual review.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {inspectPage} from './tools/inspect-page.mjs';
const base=path.dirname(fileURLToPath(import.meta.url));
const {chromium}=await import(process.env.FORM_PLAYWRIGHT_MODULE||'playwright');
const manifest=JSON.parse(await fs.readFile(path.join(base,'artifacts.json'),'utf8'));
const browser=await chromium.launch({headless:true}),results=[];
const groups=['arrowGlyph','smallRoundMarker','italicText','negativeTracking','smallUppercaseText','knownMonoFamily','pillShape','nestedBoundaries','separator','terminalPeriod'];
const groupData=e=>Object.fromEntries(groups.map(g=>[g,e.candidates[g]]));
try{
 for(const artifact of manifest.artifacts.filter(a=>a.condition==='final')){
  const context=await browser.newContext({offline:true,viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  const page=await context.newPage(),assets=new Set(),observations=[];
  for(const width of [1440,390]){
   await page.setViewportSize({width,height:width===390?844:1000});
   await page.goto(pathToFileURL(path.join(base,artifact.file)).href);
   const e=await page.evaluate(inspectPage,{viewportOnly:false,maxNodes:5000,maxSamples:12,measureTextBounds:true});
   const pseudoArrows=await page.evaluate(()=>[...document.querySelectorAll('body *')].flatMap(el=>['::before','::after'].flatMap(pseudo=>{
    if(!el.getClientRects().length)return[];
    const s=getComputedStyle(el,pseudo);
    return /[\u2190-\u21ff\u2794-\u27bf\u27f0-\u27ff\u2900-\u297f\u2b00-\u2b11]/u.test(s.content)?[{element:el.id||el.tagName,pseudo,content:s.content}]:[];
   })));
   for(const url of await page.locator('img').evaluateAll(es=>es.map(e=>e.src)))if(url.startsWith('file:')&&/\.svg(?:$|[?#])/.test(url))assets.add(url);
   observations.push({width,groups:groupData(e),pseudoArrows,scanComplete:!e.scan.limitReached});
  }
  const assetObservations=[];
  for(const url of assets){
   await page.goto(url);
   const e=await page.evaluate(inspectPage,{selector:'svg',viewportOnly:false,maxNodes:5000,maxSamples:12});
   assetObservations.push({file:path.relative(base,fileURLToPath(url)),groups:groupData(e),scanComplete:!e.scan.limitReached});
  }
  const failures=[];
  for(const o of [...observations,...assetObservations]){
   for(const g of ['arrowGlyph','italicText','negativeTracking'])if(o.groups[g].count)failures.push({location:o.file||o.width,pattern:g,count:o.groups[g].count});
   if(o.pseudoArrows?.length)failures.push({location:o.width,pattern:'pseudo-element arrows',count:o.pseudoArrows.length});
   if(!o.scanComplete)failures.push({location:o.file||o.width,pattern:'incomplete scan'});
  }
  results.push({case:artifact.case,condition:artifact.condition,passed:failures.length===0,failures,observations,assetObservations});
  await context.close();
 }
}finally{await browser.close()}
await fs.writeFile(path.join(base,'visual-checks.json'),JSON.stringify({scope:'For these demo briefs: no decorative arrow glyphs, italic accents or negative tracking. Marker counts and other checklist items require manual interpretation. No beauty score or authorship claim.',results},null,2)+'\n');
console.log(JSON.stringify(results.map(r=>({case:r.case,passed:r.passed,failures:r.failures})),null,2));
if(!results.length||results.some(r=>!r.passed))process.exitCode=1;
