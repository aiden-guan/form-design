// Shared semantic index over the canonical catalog. Pure ES module: the browser,
// the CLI and the MCP server all build the same index from the same JSON.

export const DIMENSIONS = ['intent', 'behavior', 'trigger', 'feel', 'material', 'technique', 'spatial', 'complexity'];
const NON_MOTION = new Set(['still', 'unspecified']);
const INTERACTIVE_TRIGGERS = new Set(['hover', 'pointer-move', 'click', 'drag', 'hold', 'swipe', 'keyboard', 'camera', 'audio']);

export function normalizeText(value) {
  return String(value ?? '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[’']/g, '').replace(/[^a-z0-9.\-:\s]+/g, ' ').replace(/\s+/g, ' ').trim();
}

export function tokenize(value) {
  const out = [];
  for (const raw of normalizeText(value).split(' ')) {
    const token = raw.replace(/^[.\-:]+|[.\-:]+$/g, '');
    if (!token) continue;
    out.push(token);
    if (token.includes('-')) for (const part of token.split('-')) if (part) out.push(part);
  }
  return out;
}

/** Inflections that never change meaning (plurals). */
export function strongStems(token) {
  const c = [token];
  const add = s => { if (s && s.length > 2 && !c.includes(s)) c.push(s); };
  if (token.endsWith('ies')) add(token.slice(0, -3) + 'y');
  if (token.endsWith('es')) add(token.slice(0, -2));
  if (token.endsWith('s') && !token.endsWith('ss')) add(token.slice(0, -1));
  return c;
}

/** Strong stems first, then derivational guesses (-ing, -er, -ly...). */
export function stemCandidates(token) {
  const c = strongStems(token);
  const add = s => { if (s && s.length > 2 && !c.includes(s)) c.push(s); };
  if (token.endsWith('ing')) { add(token.slice(0, -3)); add(token.slice(0, -3) + 'e'); }
  if (token.endsWith('ed')) { add(token.slice(0, -2)); add(token.slice(0, -1)); }
  if (token.endsWith('ier')) add(token.slice(0, -3) + 'y');
  if (token.endsWith('er')) { add(token.slice(0, -2)); add(token.slice(0, -1)); }
  if (token.endsWith('est')) add(token.slice(0, -3));
  if (token.endsWith('ly')) add(token.slice(0, -2));
  if (token.endsWith('y')) add(token.slice(0, -1));
  return c;
}

export function parseConcepts(spec) {
  const out = [];
  for (const part of String(spec || '').split(/\s+/)) {
    if (!part) continue;
    const [body, w] = part.split('@');
    const i = body.indexOf(':');
    if (i < 0) continue;
    out.push({ kind: body.slice(0, i), value: body.slice(i + 1), weight: w ? Number(w) : 1 });
  }
  return out;
}

export function salience(index) { return Math.max(0.6, 1 - 0.1 * index); }

/** Normalize the vocabulary fields of a record into a searchable profile. */
function profile(item) {
  const facets = item.facets || {};
  const weights = new Map();
  for (const dim of DIMENSIONS) (facets[dim] || []).forEach((v, i) => weights.set(dim + ':' + v, salience(i)));
  const nameText = [item.title, item.preciseName, ...(item.aliases || []), ...(item.terms || []), ...(item.tags || [])].join(' | ');
  const bodyText = [item.summary || item.description, item.behaves, item.feels, item.creator, item.project, item.via, item.collectionName, item.collectionId].join(' | ');
  const nameTokens = new Set(tokenize(nameText).flatMap(strongStems));
  const bodyTokens = new Set(tokenize(bodyText).flatMap(strongStems));
  const behaviors = facets.behavior || [];
  const triggers = facets.trigger || [];
  return {
    item, weights, nameText: normalizeText(nameText), bodyText: normalizeText(bodyText), nameTokens, bodyTokens,
    moving: behaviors.some(b => !NON_MOTION.has(b)),
    interactive: triggers.some(t => INTERACTIVE_TRIGGERS.has(t)),
  };
}

export function createIndex({ items, taxonomy, lexicon }) {
  const profiles = items.map(profile);
  const byId = new Map(profiles.map(p => [p.item.id, p]));
  const df = new Map();
  for (const p of profiles) for (const key of p.weights.keys()) df.set(key, (df.get(key) || 0) + 1);
  const N = Math.max(1, profiles.length);
  const idf = key => Math.log(1 + N / ((df.get(key) || 0) + 1));
  const maxIdf = Math.log(1 + N);

  // Every taxonomy value is recognized by name ("pointer-follow", "pointer follow").
  const valueConcepts = new Map();
  const labels = new Map();
  for (const dim of taxonomy.dimensions) {
    for (const [value, description] of Object.entries(dim.values)) {
      labels.set(dim.id + ':' + value, { dimension: dim.id, value, description: description.replace(/\s*\(extension\)$/, ''), dimensionLabel: dim.label });
      for (const form of new Set([value, value.replace(/-/g, ' '), value.replace(/-/g, '')])) {
        if (!valueConcepts.has(form)) valueConcepts.set(form, []);
        valueConcepts.get(form).push({ kind: dim.id, value, weight: 1 });
      }
    }
  }
  const words = new Map(Object.entries(lexicon.words || {}).map(([k, v]) => [k, parseConcepts(v)]));
  const phrases = new Map(Object.entries(lexicon.phrases || {}).map(([k, v]) => [normalizeText(k), parseConcepts(v)]));
  for (const [form, concepts] of valueConcepts) if (form.includes(' ') && !phrases.has(form)) phrases.set(form, concepts);
  const negatedMeaning = new Map(Object.entries(lexicon.negated || {}).map(([k, v]) => [k, parseConcepts(v)]));
  const maxPhrase = Math.max(1, ...[...phrases.keys()].map(p => p.split(' ').length));

  const corpus = new Set();
  for (const p of profiles) { for (const t of p.nameTokens) corpus.add(t); for (const t of p.bodyTokens) corpus.add(t); }

  // Field-weighted BM25 over vocabulary text.
  const bm = new Map();
  const docLen = [];
  profiles.forEach((p, i) => {
    const tf = new Map();
    const addField = (text, w) => {
      const tokens = tokenize(text);
      for (const t of tokens) for (const s of strongStems(t)) tf.set(s, (tf.get(s) || 0) + w);
      return tokens.length * w;
    };
    const it = p.item;
    let len = 0;
    len += addField(it.title, 3) + addField(it.preciseName, 3) + addField((it.aliases || []).join(' '), 2.5) + addField((it.terms || []).join(' '), 2.5);
    len += addField((it.tags || []).join(' '), 1.5) + addField([it.creator, it.project, it.via, it.collectionName, it.collectionId].join(' '), 1.2);
    len += addField(it.summary || it.description, 1) + addField([it.behaves, it.feels].join(' '), 0.7);
    docLen[i] = len;
    for (const [t, f] of tf) { if (!bm.has(t)) bm.set(t, []); bm.get(t).push([i, f]); }
  });
  const avgLen = docLen.reduce((a, b) => a + b, 0) / Math.max(1, docLen.length);

  function bm25(tokens) {
    const scores = new Float64Array(profiles.length);
    for (const { token, weight } of tokens) {
      const postings = bm.get(token);
      if (!postings) continue;
      const w = Math.log(1 + (N - postings.length + 0.5) / (postings.length + 0.5));
      for (const [i, f] of postings) scores[i] += weight * w * (f * 2.2) / (f + 1.2 * (0.5 + 0.5 * docLen[i] / avgLen));
    }
    return scores;
  }

  const known = c => words.get(c) || valueConcepts.get(c) || null;
  /**
   * Lexicon meaning for a word. A word that literally appears in the catalog
   * also matches records that use it, so "curl" ranks the page curl above
   * other paper. Derivational guesses ("flower" -> "flow") are discounted when
   * the word itself is catalog vocabulary.
   */
  function lookupWord(token) {
    const strong = strongStems(token);
    const literal = strong.find(c => corpus.has(c));
    const withLiteral = (form, concepts) => {
      if (!literal) return { form, concepts };
      // A rare literal ("metaballs") names a specific thing: records that use
      // the name rank above records that merely share its facets.
      const facets = concepts.filter(c => c.kind !== 'term').length;
      const broad = facets > 4;
      const rare = !broad && (bm.get(literal)?.length || 0) / N < 0.06;
      const scaled = rare ? concepts.map(c => c.kind === 'term' ? c : { ...c, weight: c.weight * 0.7 }) : concepts;
      if (concepts.some(c => c.kind === 'term' && c.value === literal)) return { form, concepts: scaled };
      return { form, concepts: [...scaled, { kind: 'term', value: literal, weight: broad ? 0.7 : 1, auto: true }] };
    };
    for (const c of strong) if (known(c)) return withLiteral(c, known(c));
    for (const c of stemCandidates(token).slice(strong.length)) {
      if (!known(c)) continue;
      if (!literal) return { form: c, concepts: known(c) };
      return withLiteral(literal, known(c).map(x => ({ ...x, weight: x.weight * 0.5 })));
    }
    return null;
  }
  function inCorpus(token) {
    for (const c of stemCandidates(token)) if (corpus.has(c)) return c;
    return null;
  }

  return {
    profiles, byId, idf, maxIdf, labels, words, phrases, negatedMeaning, maxPhrase, lexicon, taxonomy,
    lookupWord, inCorpus, bm25, corpus, size: N,
    label(key) { return labels.get(key) || null; },
  };
}

/** How strongly one profile satisfies one concept (0..1). */
export function satisfy(p, concept) {
  const { kind, value } = concept;
  if (kind === 'any') {
    if (value === 'motion') return p.moving ? 1 : 0;
    if (value === 'interactive') return p.interactive ? 1 : 0;
    return 0;
  }
  if (kind === 'term') {
    const v = normalizeText(value.replace(/_/g, ' '));
    if (v.includes(' ')) return p.nameText.includes(v) ? 1 : p.bodyText.includes(v) ? 0.6 : 0;
    for (const c of stemCandidates(v)) { if (p.nameTokens.has(c)) return 1; }
    for (const c of stemCandidates(v)) { if (p.bodyTokens.has(c)) return 0.6; }
    return 0;
  }
  return p.weights.get(kind + ':' + value) || 0;
}

export function lensMatches(item, lens) {
  if (!lens || lens.id === 'everything' || !lens.any) return true;
  const f = item.facets || {};
  return Object.entries(lens.any).some(([dim, values]) => (f[dim] || []).some(v => values.includes(v)));
}

export function deriveLenses(item, taxonomy) {
  return taxonomy.lenses.filter(l => l.id !== 'everything' && lensMatches(item, l)).map(l => l.id);
}
