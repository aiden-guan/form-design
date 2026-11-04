#!/usr/bin/env node
// Optional maintainer utility: capture saved artifacts under the same conditions.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath=path.resolve(root, process.argv[2] || 'evals/paired-2026-11-03/artifacts.json');
const base=path.dirname(manifestPath);
const manifest=JSON.parse(await fs.readFile(manifestPath, 'utf8'));
const moduleName=process.env.FORM_PLAYWRIGHT_MODULE || 'playwright';
const {chromium}=await import(path.isAbsolute(moduleName)?pathToFileURL(moduleName).href:moduleName);
const browser=await chromium.launch({headless:true});
const results=[];
try {
 for(const artifact of manifest.artifacts){
  const source=path.resolve(base,artifact.file);
  const output=path.resolve(base,artifact.captures);
  await fs.mkdir(output,{recursive:true});
  const context=await browser.newContext({offline:true,viewport:{width:1440,height:1000},deviceScaleFactor:1,reducedMotion:'reduce'});
  const page=await context.newPage();
  const errors=[],externalRequests=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',request=>{if(!request.url().startsWith('file:'))externalRequests.push(request.url())});
  await context.route('**/*',route=>route.request().url().startsWith('file:')?route.continue():route.abort());
  const views=[];
  for(const [label,width,height] of [['wide',1440,1000],['narrow',390,844]]){
   await page.setViewportSize({width,height});
   await page.goto(pathToFileURL(source).href);
   await page.evaluate(()=>document.fonts.ready);
   // Settle layout without depending on animation completion or network idle.
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   const layout=await page.evaluate(()=>({
    viewportWidth:innerWidth,documentWidth:document.documentElement.scrollWidth,
    documentHeight:document.documentElement.scrollHeight,
    pageOverflow:document.documentElement.scrollWidth>innerWidth+1,
    title:document.title,
    controls:[...document.querySelectorAll('button,a[href],input,select,textarea')].filter(el=>el.getClientRects().length).map(el=>({tag:el.tagName,label:(el.getAttribute('aria-label')||el.textContent||el.getAttribute('placeholder')||'').trim().slice(0,120)}))
   }));
   await page.screenshot({path:path.join(output,label+'.png')});
   await page.screenshot({path:path.join(output,label+'-full.png'),fullPage:true});
   views.push({label,...layout});
  }
  await page.evaluate(()=>{
   const sizes=[...document.querySelectorAll('body,body *')].map(el=>[el,getComputedStyle(el).fontSize]);
   for(const [el,size] of sizes)if(el instanceof HTMLElement)el.style.fontSize=(parseFloat(size)*2)+'px';
  });
  const events=artifact.case==='festival'?JSON.parse(await fs.readFile(path.join(base,'briefs/festival.json'),'utf8')).facts.events:[];
  const doubledText=await page.evaluate(events=>{
   const rects=(root,match)=>{
    const out=[],walk=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    let node;
    while((node=walk.nextNode())){
     const el=node.parentElement;
     if(!node.textContent.trim()||!el.getClientRects().length||el.closest('svg')||getComputedStyle(el).visibility==='hidden')continue;
     if(match&&node.textContent.trim()!==match)continue;
     const range=document.createRange();range.selectNodeContents(node);
     for(const r of range.getClientRects())if(r.width&&r.height)out.push({x:r.x,y:r.y,right:r.right,bottom:r.bottom});
    }
    return out;
   };
   const buttonTextBoundsCandidates=[];
   for(const button of document.querySelectorAll('button')){
    if(!button.getClientRects().length)continue;
    const b=button.getBoundingClientRect();
    if(rects(button).some(r=>r.x<b.x-2||r.right>b.right+2||r.y<b.y-2||r.bottom>b.bottom+2))buttonTextBoundsCandidates.push((button.getAttribute('aria-label')||button.textContent).trim().slice(0,120));
   }
   const timeArtistOverlap=events.filter(e=>{
    const times=rects(document.body,e.time),names=rects(document.body,e.artist);
    return times.some(a=>names.some(b=>Math.min(a.right,b.right)-Math.max(a.x,b.x)>2&&Math.min(a.bottom,b.bottom)-Math.max(a.y,b.y)>2));
   }).map(e=>({time:e.time,artist:e.artist}));
   return {documentWidth:document.documentElement.scrollWidth,viewportWidth:innerWidth,pageOverflow:document.documentElement.scrollWidth>innerWidth+1,buttonTextBoundsCandidates,timeArtistOverlap};
  },events);
  await page.screenshot({path:path.join(output,'doubled-text-full.png'),fullPage:true});
  results.push({case:artifact.case,condition:artifact.condition,sourceSha256:createHash('sha256').update(await fs.readFile(source)).digest('hex'),views,doubledText,errors,externalRequests});
  await context.close();
 }
} finally { await browser.close() }
const result={environment:'Local Chromium; file URLs; offline; DPR 1; reduced motion; new context per artifact',limits:'Saved-artifact layout observations and real captures. Doubled text is a stress observation, not browser zoom. No beauty score or complete accessibility audit.',artifacts:results};
await fs.writeFile(path.join(base,'capture-results.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(results.map(r=>({case:r.case,condition:r.condition,pageOverflow:r.views.map(v=>v.pageOverflow),doubledTextOverflow:r.doubledText.pageOverflow,errors:r.errors.length,externalRequests:r.externalRequests.length})),null,2));
