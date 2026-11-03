// Hybrid retrieval: concept interpretation (with negation), field-weighted BM25,
// and the original lexical matcher. A query is an AND of groups; each group is
// an OR of concepts contributed by one word or phrase.
import { DIMENSIONS, normalizeText, tokenize, satisfy, stemCandidates } from './index.mjs';
import { searchScore as legacyScore, normalize as legacyNormalize } from './legacy-search.mjs';

const BEHAVIOR_DIMS = new Set(['behavior', 'trigger', 'any']);
const VISUAL_DIMS = new Set(['feel', 'material', 'technique', 'spatial']);
const FILTER_RE = /\b(intent|behavior|trigger|feel|material|technique|spatial|complexity|lens):([a-z0-9.\-]+)/g;

function groupKind(concepts) {
  const mass = {};
  for (const c of concepts) {
    if (c.auto) continue;
    const k = BEHAVIOR_DIMS.has(c.kind) ? 'behavior' : VISUAL_DIMS.has(c.kind) ? 'visual' : c.kind === 'term' ? 'term' : 'use';
    mass[k] = (mass[k] || 0) + c.weight;
  }
  return Object.entries(mass).sort((a, b) => b[1] - a[1])[0]?.[0] || 'term';
}

/** Turn casual language into weighted concept groups. */
export function interpret(index, query) {
  const filters = {};
  let text = String(query || '');
  text = text.replace(FILTER_RE, (_, dim, value) => { (filters[dim] ||= []).push(value); return ' '; });
  const { lexicon } = index;
  const stop = new Set(lexicon.stop);
  const negators = new Set(lexicon.negators);
  const soft = new Set(lexicon.softNegators);
  const boosters = new Set(lexicon.boosters);
  const breakers = new Set(lexicon.breakers);

  // Protect "-glass" style exclusions before normalization strips punctuation context.
  text = text.replace(/(^|\s)-(?=[a-z0-9])/gi, '$1 not ');
  const tokens = normalizeText(text).replace(/,/g, ' , ').split(' ').filter(Boolean);
  const positive = [], negative = [], preferences = [], unknown = [], recognized = [];
  let negate = 0, boost = 1;

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t === ',' || t === ';' || t === '.') { negate = 0; continue; }
    if (breakers.has(t)) { negate = 0; continue; }
    if (t === 'and' || t === 'or' || t === '&') continue;
    if (negators.has(t)) { negate = 1; continue; }
    if (soft.has(t)) { negate = 0.5; continue; }
    if (boosters.has(t) && i < tokens.length - 1) { boost = 1.3; continue; }

    // Longest phrase match first.
    let matched = null;
    for (let n = Math.min(index.maxPhrase, tokens.length - i); n >= 2; n--) {
      const phrase = tokens.slice(i, i + n).join(' ');
      if (index.phrases.has(phrase)) { matched = { form: phrase, concepts: index.phrases.get(phrase), span: n }; break; }
    }
    if (!matched) {
      if (stop.has(t)) continue;
      const hit = index.lookupWord(t);
      if (hit) matched = { ...hit, span: 1 };
    }
    if (matched && matched.concepts.length === 0) { i += matched.span - 1; continue; }
    if (!matched) {
      const c = index.inCorpus(t);
      if (c) matched = { form: c, concepts: [{ kind: 'term', value: c, weight: 1 }], span: 1, lexicalOnly: true };
    }
    if (!matched) { unknown.push(t); continue; }
    i += matched.span - 1;
    const group = { form: matched.form, concepts: matched.concepts, kind: groupKind(matched.concepts), weight: boost, lexicalOnly: !!matched.lexicalOnly };
    boost = 1;
    if (negate) {
      negative.push({ ...group, strength: negate });
      // "not distracting" also asks for something: calm. It becomes a softer requirement.
      const meaning = index.negatedMeaning.get(matched.form);
      const signature = meaning?.map(c => c.kind + ':' + c.value).join(' ');
      if (meaning && !preferences.some(p => p.signature === signature)) {
        const pref = { form: (negate < 1 ? 'less ' : 'not ') + matched.form, concepts: meaning, kind: groupKind(meaning), weight: 0.8, fromNegation: true, signature };
        preferences.push(pref);
        positive.push(pref);
      }
    } else {
      positive.push(group);
    }
    recognized.push((negate ? 'not ' : '') + matched.form);
  }
  for (const v of filters.lens || []) recognized.push('lens:' + v);
  return { query: String(query || ''), positive, negative, preferences, unknown, recognized, filters };
}

function groupSatisfaction(p, group) {
  let best = 0, total = 0;
  for (const c of group.concepts) {
    const s = satisfy(p, c) * c.weight;
    total += s;
    if (s > best) best = s;
  }
  return Math.min(1, best + 0.12 * Math.max(0, total - best));
}

function groupImportance(index, group) {
  if (group.lexicalOnly) return 1;
  let best = 0;
  for (const c of group.concepts) {
    if (c.kind === 'term' || c.kind === 'any') continue;
    best = Math.max(best, c.weight * index.idf(c.kind + ':' + c.value) / index.maxIdf);
  }
  const base = group.concepts.every(c => c.kind === 'any') ? 0.6 : 0.65 + 0.35 * best;
  return base * (group.weight || 1);
}

function coverage(index, p, groups) {
  if (!groups.length) return { value: 0, parts: [] };
  let num = 0, den = 0;
  const parts = [];
  for (const g of groups) {
    const s = groupSatisfaction(p, g), w = groupImportance(index, g);
    num += s * w; den += w;
    parts.push(s);
  }
  return { value: num / den, parts };
}

function passesFilters(item, filters, lenses) {
  for (const [dim, values] of Object.entries(filters)) {
    if (dim === 'lens') { if (!values.every(v => v === 'everything' || (item.lenses || []).includes(v))) return false; continue; }
    const have = item.facets?.[dim] || [];
    if (!values.every(v => have.includes(v))) return false;
  }
  return true;
}

function matchedLabels(index, p, groups) {
  const out = [];
  for (const g of groups) {
    let best = null, score = 0;
    for (const c of g.concepts) {
      const s = satisfy(p, c) * c.weight;
      if (s > score) { score = s; best = c; }
    }
    if (best && score >= 0.5) out.push(best.kind === 'term' || best.kind === 'any' ? g.form : best.value);
  }
  return [...new Set(out)];
}

/**
 * Rank items for a query. Returns every relevant item with its score, plus the
 * three result groups shown in the UI. Unrelated items are never padded in.
 */
export function search(index, query, options = {}) {
  const intent = interpret(index, query);
  const filters = { ...intent.filters };
  for (const [dim, values] of Object.entries(options.filters || {})) filters[dim] = [...(filters[dim] || []), ...[].concat(values)];
  const pool = index.profiles.filter(p => passesFilters(p.item, filters));
  const hasQuery = intent.positive.length > 0;
  const q = legacyNormalize(query);

  if (!hasQuery) {
    // Filters or negations only: everything that passes, ordered by curation, minus excluded concepts.
    const results = pool.map((p, i) => ({ item: p.item, score: 1 - i * 1e-6, coverage: 1, matched: [] }))
      .filter(r => !intent.negative.some(g => groupSatisfaction(index.byId.get(r.item.id), g) >= 0.5));
    const empty = intent.unknown.length > 0 && !intent.negative.length && !Object.keys(filters).length;
    return { interpretation: intent, results: empty ? [] : results, groups: empty ? emptyGroups() : { closest: results, behavior: [], feel: [] }, understood: !empty };
  }

  const lexTokens = [];
  for (const g of intent.positive) {
    for (const t of tokenize(g.form)) lexTokens.push({ token: t, weight: 1 });
    for (const c of g.concepts) if (c.kind === 'term') lexTokens.push({ token: normalizeText(c.value), weight: 0.6 * c.weight });
  }
  const bm = index.bm25(lexTokens);
  const maxBm = Math.max(1e-9, ...bm);
  const posIndex = new Map(index.profiles.map((p, i) => [p, i]));
  const phrase = intent.positive.map(g => g.form).join(' ');

  const scored = [];
  for (const p of pool) {
    const cov = coverage(index, p, intent.positive);
    if (cov.value <= 0) continue;
    const lex = bm[posIndex.get(p)] / maxBm;
    const legacy = Math.min(1, legacyScore(p.item, q) / 130);
    let score = 0.72 * cov.value + 0.18 * lex + 0.1 * legacy;
    if (phrase.length > 3 && (p.nameText.includes(phrase))) score += 0.2;
    let penalty = 0;
    for (const g of intent.negative) penalty = Math.max(penalty, groupSatisfaction(p, g) * g.strength);
    score *= 1 - 0.85 * penalty;
    const behaviorGroups = intent.positive.filter(g => g.kind === 'behavior');
    const visualGroups = intent.positive.filter(g => g.kind === 'visual');
    scored.push({
      item: p.item, score, coverage: cov.value * (1 - 0.85 * penalty), penalty,
      groupsMet: cov.parts.filter(s => s >= 0.5).length,
      behaviorCoverage: behaviorGroups.length ? coverage(index, p, behaviorGroups).value : null,
      visualCoverage: visualGroups.length ? coverage(index, p, visualGroups).value : null,
      matched: matchedLabels(index, p, intent.positive),
    });
  }
  scored.sort((a, b) => b.score - a.score);
  const top = scored[0]?.score || 0;
  const bestCov = Math.max(0, ...scored.map(r => r.coverage));
  // Relevant means it shares at least half of what was asked for, not one stray word.
  const needGroups = Math.ceil(intent.positive.length / 2);
  const relevant = scored.filter(r => r.score >= Math.max(0.22, top * 0.4) && r.coverage >= 0.4 && r.groupsMet >= needGroups && r.penalty < 0.6);
  const closestCut = Math.max(0.5, bestCov * 0.78);
  const closest = relevant.filter(r => r.coverage >= closestCut - 1e-9);
  const inClosest = new Set(closest.map(r => r.item.id));
  const multi = intent.positive.length > 1;
  const pickGroup = key => {
    const groups = intent.positive.filter(g => g.kind === key);
    if (!multi || !groups.length || groups.length === intent.positive.length) return [];
    return scored.filter(r => !inClosest.has(r.item.id) && (key === 'behavior' ? r.behaviorCoverage : r.visualCoverage) >= 0.75 && r.penalty < 0.5)
      .sort((a, b) => (key === 'behavior' ? b.behaviorCoverage - a.behaviorCoverage : b.visualCoverage - a.visualCoverage) || b.score - a.score)
      .slice(0, 12);
  };
  const behavior = pickGroup('behavior');
  const behaviorIds = new Set(behavior.map(r => r.item.id));
  const feel = pickGroup('visual').filter(r => !behaviorIds.has(r.item.id));
  // Beyond the closest set, keep only the strongest partial matches.
  const grouped = new Set([...inClosest, ...behaviorIds, ...feel.map(r => r.item.id)]);
  const looser = relevant.filter(r => !grouped.has(r.item.id) && r.coverage >= 0.5).slice(0, 24);
  const results = [...closest, ...behavior, ...feel, ...looser].sort((a, b) => b.score - a.score);
  return {
    interpretation: intent,
    understood: true,
    results,
    groups: {
      closest,
      behavior: behavior.length >= 2 ? behavior : [],
      feel: feel.length >= 2 ? feel : [],
      behaviorLabel: intent.positive.filter(g => g.kind === 'behavior').map(g => g.form),
      feelLabel: intent.positive.filter(g => g.kind === 'visual').map(g => g.form),
    },
  };
}

function emptyGroups() { return { closest: [], behavior: [], feel: [] }; }

/** Backward-compatible API: ordered items for a query. */
export function searchItems(index, query, options) {
  if (!String(query || '').trim()) return index.profiles.map(p => p.item);
  return search(index, query, options).results.map(r => r.item);
}

export { DIMENSIONS, stemCandidates };
