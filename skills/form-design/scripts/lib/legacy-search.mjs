// The original FORM lexical matcher, preserved unchanged as one ranking signal.
const stopWords = new Set('a an the that this with and or of for to in it i want like something thing make me my you your more little very'.split(' '));
const relatedWords = {
 bouncy:['spring','bounce','elastic','motion'], cards:['card','stack','toast','photo'], grainy:['grain','dither','halftone','noise'],
 dotted:['dot','halftone','screen'], pixelated:['pixel','dither'], shiny:['chrome','reflective','glass'],
 tactile:['tactile','physical','paper','skeuomorphic'], moving:['motion','animated','loop'], painting:['painterly','watercolor','gouache'],
 squishy:['morph','fluid','elastic'], sliding:['slide','sliding','swipe','drawer','tabs'], spinning:['orbit','rotating','spin'],
 huge:['oversized','large','big','giant'], giant:['oversized','large','big','giant'], soft:['soft','quiet','blur','gentle'],
 footer:['footer','footers'], landscape:['landscape','scenery','terrain'],
};
export function normalize(value) { return String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim(); }
export function searchScore(item, query) {
  const q = normalize(query); if (!q) return 1;
  const title = normalize(item.title);
  const aliases = (item.aliases || []).map(normalize);
  const tags = (item.tags || []).map(normalize);
  const nameFields = [title, ...aliases, ...tags, normalize(item.category), normalize(item.creator), normalize(item.project)];
  const full = [...nameFields,normalize(item.description)].join(' ');
  const tokens = q.split(' ').filter(t => !stopWords.has(t));
  if (!tokens.length) return 0;
  let score = title.includes(q) ? 100 : aliases.some(a=>a.includes(q)) ? 80 : full.includes(q) ? 55 : 0;
  let matched=0;
  for(const token of tokens) {
    const stem = token.length>4 && token.endsWith('s') ? token.slice(0,-1) : token;
    const forms = [...new Set([token,stem,...(relatedWords[token]||relatedWords[stem]||[])])];
    if(nameFields.some(f=>forms.some(t=>f.includes(t)))) { score+=15; matched++; }
    else if(forms.some(t=>full.includes(t))) { score+=5; matched++; }
  }
  return matched >= Math.ceil(tokens.length*.6) ? score : 0;
}
export function searchCatalog(items,query){return items.map((item,index)=>({item,index,score:searchScore(item,query)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.index-b.index).map(x=>x.item);}
