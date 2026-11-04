#!/usr/bin/env python3
"""Build an offline viewer from the paired pilot's recorded artifact manifest."""
import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / 'evals/paired-2026-11-03'


def build():
    manifest = json.loads((BASE / 'artifacts.json').read_text())
    entries = manifest['artifacts']
    for entry in entries:
        assert (BASE / entry['file']).is_file(), entry['file']
    cases = list(dict.fromkeys(entry['case'] for entry in entries))
    options = ''.join(f'<option value="{html.escape(case)}">{html.escape(case.title())}</option>' for case in cases)
    data = json.dumps(entries, ensure_ascii=False).replace('<', '\\u003c')
    template = '''<!doctype html>
<html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>FORM — inspect the paired design outputs</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#ededeb;color:#232722;font:15px/1.5 system-ui,sans-serif}header{padding:24px clamp(16px,4vw,56px);background:#fcfcf9;border-bottom:1px solid #c9ccc5}h1{font-size:clamp(22px,3vw,34px);line-height:1.15;margin:0 0 10px}p{max-width:85ch;margin:8px 0}nav{display:flex;gap:24px;flex-wrap:wrap;align-items:end;margin-top:20px}label{display:grid;gap:6px;font-weight:600}select,button,a{font:inherit}select{padding:8px;border:1px solid #7d8478;border-radius:3px;background:white;color:inherit}a{color:#24583f;text-underline-offset:3px}:focus-visible{outline:3px solid #214e8a;outline-offset:4px}.pairs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px;padding:24px}.candidate{min-width:0}.meta{display:flex;justify-content:space-between;gap:12px;align-items:center;margin:0 0 10px}.meta h2{margin:0;font-size:17px}.frame{overflow:hidden;background:white;border:1px solid #b7beb2;position:relative}.frame iframe{display:block;border:0;transform-origin:0 0;background:white}.notice{font-size:13px;color:#50594a}footer{padding:0 24px 32px}@media(max-width:900px){.pairs{grid-template-columns:1fr;padding:16px;gap:28px}}
</style>
<header><h1>Inspect the actual design outputs</h1><p>Four fictional briefs with earlier drafts and corrected examples after owner feedback and checklist review. These are saved, runnable artifacts from iterative development, not an equal-effort model benchmark. All actions operate locally.</p>
<p class="notice">The same viewport is applied to both candidates. Frames are scaled to fit this viewer; open a page at actual size to judge reading comfort and interaction. Fresh drafts, guided repairs, failures and limits are recorded separately.</p>
<nav><label>Brief<select id="case">OPTIONS</select></label><label>Artifact viewport<select id="width"><option value="1440">1440 × 1000 desktop</option><option value="390">390 × 844 mobile</option></select></label><a href="results.md">Results and limitations</a><a href="method.md">Method</a></nav></header>
<main class="pairs" id="pairs"></main><footer><p class="notice">All artwork and sample data in these artifacts are original synthetic material. The complete source, briefs, captures, task checks, and review records accompany this viewer.</p></footer>
<script>
const entries=DATA;
const area=document.querySelector('#pairs'),caseControl=document.querySelector('#case'),widthControl=document.querySelector('#width');
function fit(){const width=Number(widthControl.value),height=width===390?844:1000;for(const frame of document.querySelectorAll('.frame')){frame.style.width='min(100%, '+width+'px)';frame.style.marginInline='auto';const iframe=frame.querySelector('iframe'),scale=Math.min(1,(frame.clientWidth)/width);iframe.style.width=width+'px';iframe.style.height=height+'px';iframe.style.transform='scale('+scale+')';frame.style.height=(height*scale+2)+'px'}}
function render(){area.replaceChildren();for(const entry of entries.filter(e=>e.case===caseControl.value)){const section=document.createElement('section');section.className='candidate';const meta=document.createElement('div');meta.className='meta';const heading=document.createElement('h2');heading.textContent=entry.condition==='current'?'Earlier draft':'Corrected example';const link=document.createElement('a');link.href=entry.file;link.target='_blank';link.rel='noopener';link.textContent='Open at actual size';meta.append(heading,link);const frame=document.createElement('div');frame.className='frame';const iframe=document.createElement('iframe');iframe.src=entry.file;iframe.title=entry.case+' / '+heading.textContent;iframe.setAttribute('sandbox','allow-scripts allow-same-origin');frame.append(iframe);section.append(meta,frame);area.append(section)}fit()}
caseControl.addEventListener('change',render);widthControl.addEventListener('change',fit);new ResizeObserver(fit).observe(area);render();
</script></html>
'''
    (BASE / 'gallery.html').write_text(template.replace('OPTIONS', options).replace('DATA;', data+';'))
    print(f'Built offline gallery for {len(cases)} paired briefs.')


if __name__ == '__main__':
    build()
