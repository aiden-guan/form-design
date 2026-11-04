// Pass this function to an available browser evaluation API. Read-only; no imports.
export function inspectPage(options = {}) {
  const limit = Math.max(1, Math.min(5000, Math.floor(Number(options.maxNodes) || 1200)));
  const sampleLimit = Math.max(1, Math.min(12, Math.floor(Number(options.maxSamples) || 4)));
  const viewportOnly = options.viewportOnly !== false;
  const measureTextBounds = options.measureTextBounds === true;
  const root = options.selector ? document.querySelector(options.selector) : document.body;
  if (!root) throw new Error('FORM inspector: the requested root element does not exist.');
  const styles = new WeakMap(), samples = new WeakMap(), families = new Map(), repeats = new Map();
  const names = ['pillShape', 'italicText', 'negativeTracking', 'nestedBoundaries', 'gradientSurface', 'separator', 'knownMonoFamily', 'smallUppercaseText', 'terminalPeriod', 'repeatedText', 'arrowGlyph', 'smallRoundMarker', 'textBeyondViewport', 'textOutsideControl', 'textClippedByContainer'];
  const candidates = Object.fromEntries(names.map(name => [name, { count: 0, samples: [] }]));
  const styleFor = el => { if (!styles.has(el)) styles.set(el, getComputedStyle(el)); return styles.get(el); };
  const norm = value => String(value || '').replace(/\s+/g, ' ').trim();
  const px = value => Number.parseFloat(value) || 0;
  const hasBoundary = el => {
    const style = styleFor(el);
    return ['Top', 'Right', 'Bottom', 'Left'].some(side => px(style['border'+side+'Width']) > 0 && !['none','hidden'].includes(style['border'+side+'Style']) && !['transparent','rgba(0, 0, 0, 0)'].includes(style['border'+side+'Color']));
  };
  const selectorFor = el => {
    const parts = [];
    for (let node=el; node && node.nodeType===1; node=node.parentElement) {
      if(node.id&&globalThis.CSS?.escape){const id='#'+CSS.escape(node.id);if(document.querySelectorAll(id).length===1){parts.unshift(id);break;}}
      const tag=node.tagName.toLowerCase(); let position=1;
      for(let sibling=node.previousElementSibling;sibling;sibling=sibling.previousElementSibling) if(sibling.tagName===node.tagName)position++;
      parts.unshift(tag+':nth-of-type('+position+')');
    }
    return parts.join(' > ');
  };
  const sampleFor = el => {
    if (samples.has(el)) return samples.get(el);
    const style=styleFor(el), rect=el.getBoundingClientRect();
    const value={selector:selectorFor(el),tag:el.tagName.toLowerCase(),role:el.getAttribute('role'),
      text:norm(el.innerText || (el.namespaceURI==='http://www.w3.org/2000/svg'?el.textContent:'') || el.getAttribute('aria-label') || el.getAttribute('alt')).slice(0,140),
      codeContext:Boolean(el.closest('code, pre, kbd, samp')),fontFamily:style.fontFamily,fontSize:style.fontSize,
      fontStyle:style.fontStyle,letterSpacing:style.letterSpacing,color:style.color,
      rect:{x:Math.round(rect.x),y:Math.round(rect.y),width:Math.round(rect.width),height:Math.round(rect.height)}};
    samples.set(el,value);return value;
  };
  const add = (name,el) => { const bucket=candidates[name]; bucket.count++;if(bucket.samples.length<sampleLimit)bucket.samples.push(sampleFor(el)); };
  const observedControls=new WeakSet();let textFragments=0,textBoundsTruncated=false;
  const textBoundsFor = el => {
    const nodes=[...el.childNodes].filter(n=>n.nodeType===3&&norm(n.textContent));
    if(nodes.length>8)textBoundsTruncated=true;
    const boxes=[];
    for(const node of nodes.slice(0,8)){
      const range=document.createRange();range.selectNodeContents(node);
      const rects=[...range.getClientRects()];
      if(rects.length>16)textBoundsTruncated=true;
      for(const r of rects.slice(0,16))if(r.width&&r.height){boxes.push(r);textFragments++;}
    }
    return boxes;
  };
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT);let next=root;
  let visited=0,visible=0,textNodes=0;
  while(next&&visited<limit) {
    const el=next;next=walker.nextNode();
    visited++;
    if(['SCRIPT','STYLE','NOSCRIPT','TEMPLATE','HEAD','META','LINK'].includes(el.tagName)||el.closest('[hidden]'))continue;
    const style=styleFor(el),rect=el.getBoundingClientRect();
    if(style.display==='none'||style.visibility!=='visible'||rect.width===0||rect.height===0)continue;
    let transparent=false;
    for(let ancestor=el;ancestor;ancestor=ancestor.parentElement){if(Number(styleFor(ancestor).opacity)===0){transparent=true;break;}}
    if(transparent)continue;
    if(viewportOnly&&(rect.bottom<=0||rect.right<=0||rect.top>=innerHeight||rect.left>=innerWidth))continue;
    visible++;
    const direct=norm([...el.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join(' '));
    if(direct){
      textNodes++;
      // Range boxes are font-layout bounds, not painted-glyph or occlusion tests.
      // Explicitly clipped 1px accessibility text is not a visible layout candidate.
      const visuallyHidden=rect.width<=2&&rect.height<=2&&(style.clip!=='auto'||style.clipPath!=='none');
      if(measureTextBounds&&!visuallyHidden){
        const boxes=textBoundsFor(el);
        if(boxes.some(r=>r.left < -2 || r.right > innerWidth+2))add('textBeyondViewport',el);
        const control=el.closest('button,[role="button"]');
        if(control&&!observedControls.has(control)){
          const b=control.getBoundingClientRect();
          if(boxes.some(r=>r.left<b.left-2||r.right>b.right+2||r.top<b.top-2||r.bottom>b.bottom+2)){add('textOutsideControl',control);observedControls.add(control);}
        }
        let clipped=false,depth=0;
        for(let ancestor=el;ancestor&&depth<6;ancestor=ancestor.parentElement,depth++){
          const s=styleFor(ancestor),b=ancestor.getBoundingClientRect();
          const clipX=/hidden|clip/.test(s.overflowX),clipY=/hidden|clip/.test(s.overflowY);
          if(boxes.some(r=>(clipX&&(r.left<b.left-2||r.right>b.right+2))||(clipY&&(r.top<b.top-2||r.bottom>b.bottom+2)))){clipped=true;break;}
        }
        if(clipped)add('textClippedByContainer',el);
      }
      const family=style.fontFamily;
      const stats=families.get(family)||{family,elements:0,characters:0};stats.elements++;stats.characters+=direct.length;families.set(family,stats);
      if(/italic|oblique/.test(style.fontStyle))add('italicText',el);
      if(/[\u2190-\u21ff\u2794-\u27bf\u27f0-\u27ff\u2900-\u297f\u2b00-\u2b11]/u.test(direct))add('arrowGlyph',el);
      if(px(style.letterSpacing)<0)add('negativeTracking',el);
      if(/monospace|\bmono\b|consolas|courier|menlo|source code/i.test(family))add('knownMonoFamily',el);
      const rendered=style.textTransform==='uppercase'?direct.toUpperCase():direct;
      if(px(style.fontSize)<=18&&rendered.length>=3&&rendered.length<=100&&/[A-Z]/.test(rendered)&&!/[a-z]/.test(rendered))add('smallUppercaseText',el);
      const key=direct.toLowerCase();
      if(key.length>=8){const found=repeats.get(key)||[];found.push(el);repeats.set(key,found);}
    }
    const radius=style.borderTopLeftRadius.endsWith('%')?px(style.borderTopLeftRadius)*Math.min(rect.width,rect.height)/100:px(style.borderTopLeftRadius);
    const smallRound=rect.width>=2&&rect.width<=12&&rect.height>=2&&rect.height<=12&&Math.abs(rect.width-rect.height)<=2;
    if(smallRound&&((radius>=Math.min(rect.width,rect.height)*.45&&!['transparent','rgba(0, 0, 0, 0)'].includes(style.backgroundColor))||(el.tagName.toLowerCase()==='circle'&&!['none','transparent','rgba(0, 0, 0, 0)'].includes(style.fill))))add('smallRoundMarker',el);
    if(rect.width>rect.height*1.2&&radius>=rect.height*0.45)add('pillShape',el);
    if(/gradient\(/.test(style.backgroundImage))add('gradientSurface',el);
    if(el.tagName==='HR'||el.getAttribute('role')==='separator'||(rect.height<=3&&rect.width>40&&hasBoundary(el)))add('separator',el);
    if(hasBoundary(el)){
      let boundaries=0,depth=0;
      for(let ancestor=el.parentElement;ancestor&&depth<6;ancestor=ancestor.parentElement,depth++)if(hasBoundary(ancestor))boundaries++;
      if(boundaries>0)add('nestedBoundaries',el);
    }
    if(el.matches('button,a,h1,h2,h3,h4,h5,h6,[role="button"]')&&norm(el.innerText).endsWith('.'))add('terminalPeriod',el);
  }
  for(const group of repeats.values())if(group.length>=3)for(const el of group)add('repeatedText',el);
  return {schemaVersion:1,scope:options.selector||'body',
    scan:{visited,visible,textElements:textNodes,maxNodes:limit,limitReached:Boolean(next),viewportOnly,viewport:{width:innerWidth,height:innerHeight},textBounds:{enabled:measureTextBounds,fragments:textFragments,maxDirectTextNodesPerElement:8,maxFragmentsPerNode:16,truncated:textBoundsTruncated}},
    typography:{families:[...families.values()].sort((a,b)=>b.characters-a.characters).slice(0,8)},candidates,
    limits:['Counts are observations, not severity, taste, or AI-authorship judgments.','No screenshot analysis, pseudo-element, shadow-DOM, or nested-frame inspection, occlusion test, font-file verification, contrast audit, or full accessibility audit is performed.','Monospace detection uses family names. Text bounds are font-layout boxes, not painted glyphs; intentional truncation, cropping and optical glyph extents can be legitimate. Context and manual review determine whether any candidate should change.']};
}
