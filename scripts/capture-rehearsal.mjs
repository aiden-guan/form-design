// Optional maintainer tool; uses an existing Playwright installation.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {inspectPage} from '../skills/form-unslop/scripts/inspect-page.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const moduleName=process.env.FORM_PLAYWRIGHT_MODULE||'playwright';
const {chromium}=await import(path.isAbsolute(moduleName)?pathToFileURL(moduleName).href:moduleName);
const browser=await chromium.launch({headless:true});
const captures=[];
try{
 for(const item of [
  {fixture:'workshop.html',mode:'before',width:1200,name:'rehearsal-before'},
  {fixture:'workshop.html',mode:'after',width:1200,name:'rehearsal-after'},
  {fixture:'workshop.html',mode:'before',width:390,name:'rehearsal-before-mobile'},
  {fixture:'workshop.html',mode:'after',width:390,name:'rehearsal-after-mobile'},
  {fixture:'working-tool.html',mode:null,width:1200,name:'rehearsal-preserve'},
 ]){
  const page=await browser.newPage({viewport:{width:item.width,height:960},deviceScaleFactor:1,reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  const url=pathToFileURL(path.join(root,'evals/fixtures',item.fixture));
  if(item.mode)url.searchParams.set('mode',item.mode);
  await page.goto(url.href);await page.evaluate(()=>document.fonts.ready);
  if(errors.length)throw new Error(errors.join('\n'));
  const output=path.join(root,'docs/assets',item.name+'.png');
  await page.screenshot({path:output});
  const observations=await page.evaluate(inspectPage,{selector:'main',maxSamples:2});
  captures.push({fixture:item.fixture,mode:item.mode,viewport:{width:item.width,height:960},image:item.name+'.png',observations});
  await page.close();
 }
 fs.writeFileSync(path.join(root,'docs/assets/rehearsal-evidence.json'),JSON.stringify({kind:'Synthetic fixtures; author-run rehearsal, not a blinded model comparison',captures},null,2)+'\n');
 console.log('Captured five actual fixture views and their bounded browser observations.');
}finally{await browser.close()}
