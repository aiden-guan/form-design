#!/usr/bin/env node
// Offline, bounded discovery. No network access or third-party dependencies.
import fs from 'node:fs';
import { createIndex } from './lib/index.mjs';
import { search } from './lib/search.mjs';

const usage = `FORM reference search (Node.js 18+)
  node scripts/search.mjs "description" [--limit 1..12] [--collection ID] [--reuse CLASS]
  node scripts/search.mjs --id REFERENCE_ID
  node scripts/search.mjs --stats
  node scripts/search.mjs --help
All data is local. Search results are candidates, not visual verification.`;

function parse(args) {
  const options = { limit: 5 }, query = [];
  const flags = new Map([['--limit','limit'],['--collection','collection'],['--reuse','reuse'],['--id','id']]);
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--stats') options.stats = true;
    else if (flags.has(arg)) {
      if (!args[i+1] || args[i+1].startsWith('--')) throw new Error(`Missing value for ${arg}.`);
      options[flags.get(arg)] = args[++i];
    } else if (arg.startsWith('--')) throw new Error(`Unknown option: ${arg}`);
    else query.push(arg);
  }
  if (!/^\d+$/.test(String(options.limit)) || Number(options.limit) < 1 || Number(options.limit) > 12) throw new Error('--limit must be an integer from 1 to 12.');
  options.limit = Number(options.limit);
  options.query = query.join(' ').trim();
  if (options.query.length > 500) throw new Error('Use a query of at most 500 characters.');
  if ([Boolean(options.query), Boolean(options.id), Boolean(options.stats)].filter(Boolean).length > 1) throw new Error('Choose a query, --id, or --stats.');
  return options;
}

function present(item) {
  return {
    id: item.id, title: item.title, summary: item.summary, creator: item.creator,
    collection: item.collectionId, terms: item.terms, facets: item.facets,
    original: item.sourceURL, handoff: item.handoffURL,
    rights: item.rights,
    evidence: { metadataOnly: item.metadataOnly, fidelity: item.fidelity },
  };
}

try {
  const options = parse(process.argv.slice(2));
  if (options.help || (!options.query && !options.id && !options.stats)) {
    console.log(usage);
  } else {
    const read = name => JSON.parse(fs.readFileSync(new URL('../data/'+name, import.meta.url), 'utf8'));
    const catalog = read('catalog.json'), taxonomy = read('taxonomy.json'), manifest = read('manifest.json');
    const items = catalog.patterns;
    const collections = [...new Set(items.map(item=>item.collectionId))].sort();
    const reuseClasses = [...new Set(items.map(item=>item.rights.reuse))].sort();
    if (options.collection && !collections.includes(options.collection)) throw new Error(`Unknown collection. Use --stats for available IDs.`);
    if (options.reuse && !reuseClasses.includes(options.reuse)) throw new Error('Unknown reuse class. Use --stats for available classes.');
    if (options.stats) {
      console.log(JSON.stringify({snapshot:manifest.snapshot, count:items.length, collections:manifest.collections, reuseClasses, facets:Object.fromEntries(taxonomy.dimensions.map(d=>[d.id,Object.keys(d.values)])), lenses:taxonomy.lenses.map(l=>l.id)},null,2));
    } else if (options.id) {
      const item=items.find(item=>item.id===options.id);
      if (!item) throw new Error(`Unknown reference: ${options.id}`);
      console.log(JSON.stringify({snapshot:manifest.snapshot,reference:present(item)},null,2));
    } else {
      const candidates = items.filter(item=>(!options.collection || item.collectionId===options.collection) && (!options.reuse || item.rights.reuse===options.reuse));
      const index = createIndex({items:candidates,taxonomy,lexicon:read('lexicon.json')});
      const found = search(index, options.query);
      const membership = new Map();
      for (const group of ['closest','behavior','feel']) for (const result of found.groups[group] || []) if (!membership.has(result.item.id)) membership.set(result.item.id,group);
      const results = found.results.slice(0,options.limit).map(result=>({
        ...present(result.item), group:membership.get(result.item.id)||'partial',
        matched:result.matched, score:Number(result.score.toFixed(4)),
      }));
      console.log(JSON.stringify({query:options.query,snapshot:manifest.snapshot,understood:found.understood,recognized:found.interpretation.recognized,filters:found.interpretation.filters,unknown:found.interpretation.unknown,totalMatches:found.results.length,results,notice:'Catalog matches are candidates. Inspect originals; rights and behavior are not freshly verified.'},null,2));
    }
  }
} catch (error) {
  console.error(`FORM: ${error.message}`);
  process.exitCode = 1;
}
