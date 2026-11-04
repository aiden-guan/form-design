#!/usr/bin/env python3
"""Package the saved paired-pilot artifacts for offline inspection."""
import hashlib
import json
import zipfile
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'evals/paired-2026-11-03'
OUT = ROOT / 'releases'


def package():
    config = json.loads((ROOT / 'scripts/release-config.json').read_text())
    artifacts = json.loads((SOURCE / 'artifacts.json').read_text())['artifacts']
    revision = json.loads((SOURCE / 'revision.json').read_text())
    skill = ROOT / 'skills/form-design'
    tree = hashlib.sha256()
    for file in sorted(p for p in skill.rglob('*') if p.is_file()):
        tree.update(file.relative_to(skill).as_posix().encode() + b'\0' + file.read_bytes() + b'\0')
    assert tree.hexdigest() == revision['revisedSkillTreeSha256'], 'The evaluated revision differs from the release skill.'
    captures = json.loads((SOURCE / 'capture-results.json').read_text())['artifacts']
    assert (SOURCE / 'tools/inspect-page.mjs').read_bytes() == (ROOT / 'skills/form-unslop/scripts/inspect-page.mjs').read_bytes(), 'Evidence inspector differs from the shipped tool.'
    assert len(artifacts) == 8, 'The recorded pilot has four complete pairs.'
    for artifact in artifacts:
        source = SOURCE / artifact['file']
        assert source.is_file()
        capture = next(c for c in captures if c['case'] == artifact['case'] and c['condition'] == artifact['condition'])
        assert hashlib.sha256(source.read_bytes()).hexdigest() == capture['sourceSha256'], 'Stale capture source.'
    for name in ['gallery.html', 'results.md', 'LICENSE.txt', 'NOTICE.md', 'capture-results.json', 'task-results.json', 'visual-checks.json', 'reviews/reading.json', 'reviews/festival.json', 'reviews/operations.json', 'reviews/holdout.json']:
        assert (SOURCE / name).is_file(), name
    files = sorted(p for p in SOURCE.rglob('*') if p.is_file())
    stamp = date.fromisoformat(config['date'])
    OUT.mkdir(exist_ok=True)
    target = OUT / 'form-design-evidence.zip'
    with zipfile.ZipFile(target, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as bundle:
        for file in files:
            assert not file.is_symlink() and file.suffix in {'.md', '.txt', '.json', '.html', '.mjs', '.svg', '.png'}, file
            body = file.read_bytes()
            if file.suffix != '.png':
                assert b'/Users/' not in body and b'/var/folders/' not in body, file
            name = 'form-design-evidence/' + file.relative_to(SOURCE).as_posix()
            info = zipfile.ZipInfo(name, (stamp.year, stamp.month, stamp.day, 0, 0, 0))
            info.create_system = 3
            info.external_attr = 0o100644 << 16
            info.compress_type = zipfile.ZIP_DEFLATED
            bundle.writestr(info, body, compresslevel=9)
    with zipfile.ZipFile(target) as bundle:
        assert bundle.testzip() is None
        for file in files:
            assert bundle.read('form-design-evidence/' + file.relative_to(SOURCE).as_posix()) == file.read_bytes()
    digest = hashlib.sha256(target.read_bytes()).hexdigest()
    (OUT / (target.name + '.sha256')).write_text(f'{digest}  {target.name}\n')
    result = {'version': config['version'], 'filename': target.name, 'bytes': target.stat().st_size,
              'sha256': digest, 'files': len(files), 'pairs': 4,
              'open': 'form-design-evidence/gallery.html',
              'scope': 'Saved drafts, corrected examples and iterative acceptance evidence; not a controlled model ranking.'}
    (OUT / 'form-design-evidence.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps(result, indent=2))


if __name__ == '__main__':
    package()
