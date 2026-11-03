#!/usr/bin/env python3
"""Generate presentation SVGs from real, deterministic CLI output (stdlib only)."""
import argparse
import html
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'docs/assets'
QUERY = 'retro texture but not glass'


def escape(value):
    return html.escape(str(value), quote=True)


def text(x, y, value, size=24, fill='#ecf0e8', family='Arial, Helvetica, sans-serif', **attrs):
    extra = ' '.join(f'{key.replace("_", "-")}="{escape(value)}"' for key, value in attrs.items())
    return f'<text x="{x}" y="{y}" fill="{fill}" font-size="{size}" font-family="{family}" {extra}>{escape(value)}</text>'


def svg(width, height, title, description, content):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">
<title id="title">{escape(title)}</title><desc id="desc">{escape(description)}</desc>
{content}
</svg>
'''


def hero(data, manifest):
    out = ['<rect width="1600" height="800" rx="20" fill="#102d27"/>',
           '<path d="M64 116H1536M770 150V716M64 722H1536" stroke="#496158" stroke-width="1"/>',
           '<rect x="64" y="62" width="16" height="16" fill="#f1a47d"/>',
           text(96, 77, 'A PORTABLE DESIGN SKILL', 20, '#c2d0c5', letter_spacing=2),
           text(1536, 77, 'DIRECTION / CRAFT / REVIEW', 18, '#c2d0c5', text_anchor='end', letter_spacing=1),
           text(58, 290, 'FORM', 168, '#f6f0dd', font_weight='700', letter_spacing=-10),
           text(68, 336, 'D E S I G N', 26, '#f1a47d'),
           text(64, 450, 'A point of view.', 55, '#f6f0dd', family='Georgia, serif'),
           text(64, 516, 'A way to build.', 55, '#f6f0dd', family='Georgia, serif'),
           text(64, 598, 'Art direction, visual craft, and offline references', 24, '#c2d0c5'),
           text(64, 632, 'for the interface you actually need.', 24, '#c2d0c5'),
           text(820, 178, 'OFFLINE SEARCH / CONDENSED CLI OUTPUT', 18, '#c2d0c5', letter_spacing=1),
           text(820, 226, 'retro texture but not glass', 28, '#f6f0dd', family='monospace')]
    for i, result in enumerate(data['results']):
        y = 260 + i * 142
        out += [f'<rect x="820" y="{y}" width="716" height="124" rx="10" fill="#1c3a32" stroke="#496158"/>',
                text(844, y+34, f'0{i+1}', 18, '#f1a47d', family='monospace'),
                text(893, y+35, result['title'], 27, '#f6f0dd'),
                text(844, y+72, result['creator'], 21, '#c2d0c5'),
                text(844, y+102, ' / '.join([result['rights']['reuse'], result['rights']['license']]), 18, '#a4bbac', family='monospace')]
    out += [text(64, 764, f"{manifest['count']:,} PUBLIC REFERENCES", 19, '#c2d0c5', letter_spacing=1),
            text(1536, 764, f"SNAPSHOT {data['snapshot']} / INSPECT ORIGINALS BEFORE REUSE", 17, '#c2d0c5', text_anchor='end', letter_spacing=0.5)]
    description = 'FORM Design with real results for the query '+QUERY+': '+', '.join(item['title'] for item in data['results'])+'. This is condensed CLI output, not a generated website preview.'
    return svg(1600, 800, 'FORM Design — direction, craft, and reference search', description, '\n'.join(out))


def social(manifest):
    content = '\n'.join([
        '<rect width="1280" height="640" fill="#102d27"/>',
        '<path d="M64 112H1216M64 552H1216M882 150V510" stroke="#496158"/>',
        '<rect x="64" y="64" width="15" height="15" fill="#f1a47d"/>',
        text(96, 79, 'A PORTABLE AGENT SKILL', 19, '#c2d0c5', letter_spacing=2),
        text(56, 288, 'FORM', 174, '#f6f0dd', font_weight='700', letter_spacing=-10),
        text(68, 338, 'D E S I G N', 26, '#f1a47d'),
        text(64, 445, 'Design with a point of view.', 48, '#f6f0dd', family='Georgia, serif'),
        text(64, 491, 'From visual direction to the last detail.', 26, '#c2d0c5'),
        text(932, 232, 'DIRECTION', 21, '#f1a47d', letter_spacing=2),
        text(932, 304, 'CRAFT', 21, '#f1a47d', letter_spacing=2),
        text(932, 376, 'REVIEW', 21, '#f1a47d', letter_spacing=2),
        text(64, 598, 'github.com/aiden-guan/form-design', 22, '#c2d0c5'),
        text(1216, 598, f"{manifest['count']:,} public references", 22, '#c2d0c5', text_anchor='end'),
    ])
    return svg(1280, 640, 'FORM Design', 'A portable Agent Skill for art direction, visual craft, and review.', content)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Fail if committed SVGs or CLI evidence differ from current output')
    args = parser.parse_args()
    cli = ROOT / 'skills/form-design/scripts/search.mjs'
    result = subprocess.run(['node', str(cli), QUERY, '--limit', '3'], cwd=ROOT,
                            text=True, capture_output=True, check=True, timeout=30)
    data = json.loads(result.stdout)
    manifest = json.loads((ROOT / 'skills/form-design/data/manifest.json').read_text())
    assert len(data['results']) == 3
    outputs = {'search-demo.json': json.dumps(data, ensure_ascii=False, indent=2)+'\n',
               'hero.svg': hero(data, manifest), 'social-preview.svg': social(manifest)}
    if args.check:
        for name, content in outputs.items():
            assert (ASSETS/name).read_text() == content, f'Stale presentation asset: {name}'
        print('Presentation evidence and SVGs match current CLI output.')
    else:
        ASSETS.mkdir(parents=True, exist_ok=True)
        for name, content in outputs.items():
            (ASSETS/name).write_text(content)
        print('Generated hero.svg, social-preview.svg, and real CLI evidence.')


if __name__ == '__main__':
    main()
