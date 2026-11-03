#!/usr/bin/env node
// WCAG 2.x relative luminance for two opaque sRGB colors, not an interface audit.
import { pathToFileURL } from 'node:url';
import { realpathSync } from 'node:fs';

export function luminance(hex) {
  if (!/^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(hex)) throw new Error('Use an opaque #RGB or #RRGGBB color.');
  const expanded = hex.length===4 ? '#'+[...hex.slice(1)].map(c=>c+c).join('') : hex;
  const [r,g,b] = expanded.slice(1).match(/../g).map(c=>{
    const s=Number.parseInt(c,16)/255;
    return s<=0.04045 ? s/12.92 : ((s+0.055)/1.055)**2.4;
  });
  return r*0.2126+g*0.7152+b*0.0722;
}

export function contrast(foreground, background) {
  const a=luminance(foreground),b=luminance(background);
  const ratio=(Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);
  // Compare full precision: 4.499 is not a pass at 4.5.
  return {foreground,background,ratio,AA_normal_text:ratio>=4.5,AA_large_text:ratio>=3,AAA_normal_text:ratio>=7,notice:'Opaque solid color pair only. Check large-text qualification and rendered context. This is not a page accessibility audit.'};
}

if (process.argv[1] && import.meta.url===pathToFileURL(realpathSync(process.argv[1])).href) {
  try {
    const args=process.argv.slice(2);
    if(args.length!==2) throw new Error("Usage: node contrast.mjs '#17201b' '#f6f3eb'");
    console.log(JSON.stringify(contrast(...args),null,2));
  } catch(error) { console.error(`FORM: ${error.message}`);process.exitCode=1; }
}
