import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {inspectPage} from '../skills/form-unslop/scripts/inspect-page.mjs';
import {contrast} from '../skills/form-design/scripts/contrast.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const moduleName=process.env.FORM_PLAYWRIGHT_MODULE||'playwright';
let chromium;
try { ({chromium}=await import(path.isAbsolute(moduleName)?pathToFileURL(moduleName).href:moduleName)); }
catch(error){throw new Error('These optional browser tests require Playwright. Install it or set FORM_PLAYWRIGHT_MODULE to an existing module path.',{cause:error});}
const browser=await chromium.launch({headless:true});
test.after(()=>browser.close());
const fixture=name=>fs.readFileSync(path.join(root,'evals/fixtures',name),'utf8');

test('inspector is read-only and collects legitimate functional styling as neutral observations',async()=>{
 const page=await browser.newPage({viewport:{width:1200,height:900}});
 try{
  await page.setContent(fixture('working-tool.html'));
  const before=await page.content();
  const result=await page.evaluate(inspectPage,{selector:'main'});
  assert.equal(await page.content(),before);
  assert.ok(result.candidates.pillShape.count>0);
  assert.ok(result.candidates.knownMonoFamily.samples.some(s=>s.codeContext));
  assert.ok(result.candidates.smallUppercaseText.count>0);
  assert.ok(result.candidates.nestedBoundaries.count>0);
  assert.deepEqual(Object.keys(result.candidates.pillShape).sort(),['count','samples']);
 }finally{await page.close()}
});

test('coverage and sample limits are explicit and selectors point to observed elements',async()=>{
 const page=await browser.newPage({viewport:{width:1200,height:900}});
 try{
  await page.setContent(fixture('working-tool.html'));
  const result=await page.evaluate(inspectPage,{maxSamples:1});
  for(const bucket of Object.values(result.candidates)){
   assert.ok(bucket.samples.length<=1);
   for(const sample of bucket.samples)assert.equal(await page.locator(sample.selector).count(),1);
  }
  const limited=await page.evaluate(inspectPage,{maxNodes:5});
  assert.equal(limited.scan.visited,5);assert.equal(limited.scan.limitReached,true);
 }finally{await page.close()}
});

test('hidden content is excluded and viewport coverage is honored',async()=>{
 const page=await browser.newPage({viewport:{width:1200,height:900}});
 try{
  await page.setContent(fixture('working-tool.html'));
  const local=await page.evaluate(inspectPage,{maxSamples:12});
  assert.equal(local.candidates.italicText.count,0);
  const all=await page.evaluate(inspectPage,{viewportOnly:false,maxSamples:12});
  assert.equal(all.candidates.italicText.count,1);
  assert.ok(!all.candidates.italicText.samples.some(s=>s.text.includes('Hidden evidence')));
  await page.evaluate(()=>{document.querySelector('.outside').style.opacity='0'});
  assert.equal((await page.evaluate(inspectPage,{viewportOnly:false})).candidates.italicText.count,0);
  await assert.rejects(page.evaluate(inspectPage,{selector:'#missing-root'}),/root element does not exist/);
 }finally{await page.close()}
});

test('working-tool filters retain useful tags, identifiers, counts, and selection',async()=>{
 const page=await browser.newPage();
 try{
  await page.setContent(fixture('working-tool.html'));
  await page.getByRole('button',{name:'Review',exact:true}).click();
  assert.equal(await page.locator('tr[data-status]:visible').count(),1);
  assert.equal(await page.locator('#count').innerText(),'1 package shown');
  assert.equal(await page.getByRole('button',{name:'Review',exact:true}).getAttribute('aria-pressed'),'true');
  assert.equal(await page.locator('tr[data-status]:visible code').first().innerText(),'scripts/inspect-page.mjs');
 }finally{await page.close()}
});

test('workshop rehearsal preserves meaningful content and local booking behavior at both widths',async()=>{
 for(const width of [1200,390])for(const mode of ['before','after']){
  const page=await browser.newPage({viewport:{width,height:960},reducedMotion:'reduce'});
  try{
   await page.setContent(fixture('workshop.html'));
   await page.evaluate(mode=>{document.documentElement.dataset.mode=mode},mode);
   assert.equal(await page.locator('h1').innerText(),'Make a two-color print.');
   assert.equal(await page.locator('.facts').getByText('Saturday, 21 November 2026').count(),1);
   assert.equal(await page.locator('.steps li').count(),3);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
   await page.locator('#reserve').click();
   assert.equal(await page.locator('#reserve').getAttribute('aria-pressed'),'true');
   assert.match(await page.locator('#feedback').innerText(),/No booking was sent/);
   assert.match(await page.locator('#availability').innerText(),/^5 seats/);
   await page.locator('#reserve').click();
   assert.equal(await page.locator('#reserve').getAttribute('aria-pressed'),'false');
   assert.equal(await page.locator('#availability').innerText(),'6 seats available');
  }finally{await page.close()}
 }
});

test('comparison lab varies type and palette independently and exports a proposal',async()=>{
 const page=await browser.newPage({viewport:{width:1200,height:960}});
 try{
  await page.setContent(fs.readFileSync(path.join(root,'skills/form-explore/assets/comparison-lab.html'),'utf8'));
  const specimen=await page.locator('#preview').innerText();
  const originalColor=await page.locator('#preview').evaluate(el=>getComputedStyle(el).color);
  await page.getByRole('button',{name:'Book serif',exact:true}).click();
  assert.equal(await page.locator('#preview').evaluate(el=>getComputedStyle(el).color),originalColor);
  assert.match(await page.locator('#preview').evaluate(el=>getComputedStyle(el).fontFamily),/Georgia/);
  await page.getByRole('button',{name:'Night print',exact:true}).click();
  assert.match(await page.locator('#preview').evaluate(el=>getComputedStyle(el).fontFamily),/Georgia/);
  assert.equal(await page.locator('#preview').innerText(),specimen);
  await page.getByRole('button',{name:'Export current proposal',exact:true}).click();
  const decision=JSON.parse(await page.locator('#decision').inputValue());
  assert.equal(decision.status,'proposal');assert.equal(decision.type.label,'Book serif');assert.equal(decision.palette.label,'Night print');
  for(const label of ['Paper and ink','Cool blue','Night print']){
   await page.getByRole('button',{name:label,exact:true}).click();
   await page.getByRole('button',{name:'Export current proposal',exact:true}).click();
   const {palette}=JSON.parse(await page.locator('#decision').inputValue());
   for(const [fg,bg] of [[palette.ink,palette.canvas],[palette.muted,palette.canvas],[palette['action-ink'],palette.action],[palette.ink,palette.selected],[palette.error,palette.canvas]])assert.ok(contrast(fg,bg).AA_normal_text,`${label}: ${fg} / ${bg}`);
  }
  await page.setViewportSize({width:390,height:960});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.locator('#sample-action').click();
  assert.match(await page.locator('#action-result').innerText(),/No booking was sent/);
 }finally{await page.close()}
});
