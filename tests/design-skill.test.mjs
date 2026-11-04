import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createIndex } from '../skills/form-design/scripts/lib/index.mjs';
import { search } from '../skills/form-design/scripts/lib/search.mjs';
import { contrast } from '../skills/form-design/scripts/contrast.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const skill=path.join(root,'skills/form-design');
const read=name=>JSON.parse(fs.readFileSync(path.join(skill,'data',name+'.json'),'utf8'));
const catalog=read('catalog'), taxonomy=read('taxonomy'), lexicon=read('lexicon');
const index=createIndex({items:catalog.patterns,taxonomy,lexicon});
const invoke=(...args)=>spawnSync(process.execPath,[path.join(skill,'scripts/search.mjs'),...args],{cwd:os.tmpdir(),encoding:'utf8'});

test('public catalog contains only its declared metadata fields and public links',()=>{
  const manifest=read('manifest');
  assert.equal(new Set(catalog.patterns.map(item=>item.id)).size,catalog.patterns.length);
  const fields=['id','title','preciseName','summary','aliases','terms','facets','creator','collectionId','collectionName','sourceURL','handoffURL','lenses','metadataOnly','fidelity','rights'];
  for(const item of catalog.patterns){
    assert.deepEqual(Object.keys(item).sort(),[...fields].sort());
    assert.match(item.sourceURL,/^https?:\/\//);
    assert.equal(item.handoffURL,manifest.publicHandoffBase+'reference/'+item.id+'.html');
    assert.notEqual(item.rights.reuse,'owner-source');
    assert.ok(item.rights.reuse&&item.rights.license);
    assert.equal(typeof item.metadataOnly,'boolean');
    assert.ok(item.fidelity.mode&&item.fidelity.limitation);
  }
});

test('snapshot manifest verifies installed catalog integrity and collection counts',()=>{
  const manifest=read('manifest'),hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
  assert.equal(manifest.count,catalog.patterns.length);
  assert.equal(manifest.catalogSha256,hash(fs.readFileSync(path.join(skill,'data/catalog.json'))));
  const collections={};for(const item of catalog.patterns)collections[item.collectionId]=(collections[item.collectionId]||0)+1;
  assert.deepEqual(manifest.collections,collections);
});

test('semantic search finds useful candidates and excludes negated glass',()=>{
  const found=search(index,'retro texture but not glass');
  assert.ok(found.results.length>0);
  assert.ok(found.results.some(r=>r.item.id==='ordered-dither'));
  assert.ok(found.interpretation.negative.length>0);
  assert.ok(found.results.every(r=>!(r.item.facets.material||[]).includes('glass')));
});

test('exact facets intersect and unknown vocabulary does not produce filler',()=>{
  const found=search(index,'intent:hero technique:halftone');
  assert.ok(found.results.length>0);
  assert.ok(found.results.every(r=>r.item.facets.intent.includes('hero')&&r.item.facets.technique.includes('halftone')));
  assert.equal(search(index,'xqzvnonexistent').results.length,0);
});

test('CLI works from another directory, bounds output, and preserves evidence',()=>{
  const result=invoke('drawer','--collection','60fps','--limit','2');
  assert.equal(result.status,0,result.stderr);
  const data=JSON.parse(result.stdout);
  assert.ok(data.results.length>0&&data.results.length<=2);
  assert.ok(data.results.every(item=>item.collection==='60fps'));
  assert.ok(data.results.every(item=>item.creator&&item.original&&item.rights&&item.evidence));
  const exact=JSON.parse(invoke('--id','ascii-landscape').stdout);
  assert.equal(exact.reference.id,'ascii-landscape');
  assert.equal(exact.reference.rights.license,'MIT');
});

test('CLI reports invalid arguments rather than silently broadening the query',()=>{
  for(const args of [['drawer','--limit','13'],['drawer','--limit','1.5'],['--id','absent-reference'],['drawer','--collection','absent-collection'],['drawer','--unknown'],['--id'],['drawer','--stats']]){
    const result=invoke(...args);
    assert.equal(result.status,1,args.join(' '));assert.ok(result.stderr.startsWith('FORM:'));
  }
});

test('rights filter is effective and stats reflect the installed snapshot',()=>{
  const result=invoke('dither','--reuse','licensed-code','--limit','3');
  assert.equal(result.status,0,result.stderr);
  const data=JSON.parse(result.stdout);assert.ok(data.results.length>0);
  assert.ok(data.results.every(item=>item.rights.reuse==='licensed-code'));
  const stats=JSON.parse(invoke('--stats').stdout);
  assert.equal(stats.count,catalog.patterns.length);
  assert.equal(Object.values(stats.collections).reduce((a,b)=>a+b,0),catalog.patterns.length);
});

test('contrast calculation handles known ratios, thresholds, and invalid inputs',()=>{
  assert.equal(contrast('#000','#fff').ratio,21);
  assert.equal(contrast('#fff','#fff').ratio,1);
  assert.equal(contrast('#777','#fff').AA_normal_text,false);
  assert.equal(contrast('#767676','#fff').AA_normal_text,true);
  assert.equal(contrast('#fff','#777').ratio,contrast('#777','#fff').ratio);
  assert.throws(()=>contrast('#0000','#fff'));
  assert.throws(()=>contrast('red','#fff'));
});

test('all local Markdown links inside the independent skills resolve',()=>{
  const walk=folder=>fs.readdirSync(folder,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(folder,entry.name)):[path.join(folder,entry.name)]);
  for(const file of walk(path.join(root,'skills')).filter(file=>file.endsWith('.md'))){
    const text=fs.readFileSync(file,'utf8');
    for(const match of text.matchAll(/\]\(([^)]+)\)/g)){
      if(/^(?:https?:|#)/.test(match[1]))continue;
      assert.ok(fs.existsSync(path.resolve(path.dirname(file),match[1].split('#')[0])),`${file}: ${match[1]}`);
    }
  }
});
