#!/usr/bin/env python3
"""Build individual FORM skills and the complete suite using standard libraries."""
import hashlib
import json
import re
import zipfile
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'releases'
CONFIG = json.loads((ROOT / 'scripts/release-config.json').read_text())
ALLOWED_TOP = {'SKILL.md', 'LICENSE.txt', 'NOTICE.md'}
ALLOWED_DIRS = {'agents', 'references', 'scripts', 'data', 'assets'}
ALLOWED_SUFFIXES = {'.md', '.txt', '.yaml', '.mjs', '.json', '.svg', '.html'}


def skill_files(name):
    folder = ROOT / 'skills' / name
    files = []
    for file in sorted(folder.rglob('*')):
        relative = file.relative_to(folder)
        if file.is_symlink():
            raise ValueError(f'Symlink in skill: {name}/{relative}')
        if not file.is_file():
            continue
        allowed = (relative.name in ALLOWED_TOP if len(relative.parts) == 1 else
                   relative.parts[0] in ALLOWED_DIRS and file.suffix in ALLOWED_SUFFIXES)
        if not allowed or any(part.startswith('.') or part == '__pycache__' for part in relative.parts):
            raise ValueError(f'Unexpected skill file: {name}/{relative}')
        body = file.read_bytes()
        if re.search(rb'/Users/|/home/|file://|https?://(?:localhost|127\.0\.0\.1)(?=[:/"\s])', body):
            raise ValueError(f'Local path/address in skill: {name}/{relative}')
        files.append((relative, body))
    required = {'SKILL.md', 'agents/openai.yaml', 'LICENSE.txt', 'NOTICE.md'}
    if not required.issubset({p.as_posix() for p, _ in files}):
        raise ValueError(f'Missing required files: {name}')
    manifest = (folder / 'SKILL.md').read_text().split('---', 2)[1]
    if not re.search(r'^name: '+re.escape(name)+r'\s*$', manifest, re.M):
        raise ValueError(f'Skill name mismatch: {name}')
    if not re.search(r'^\s+version: [\'"]'+re.escape(CONFIG['version'])+r'[\'"]\s*$', manifest, re.M):
        raise ValueError(f'Skill version mismatch: {name}')
    return files


def write_archive(name, entries, skills):
    stamp = date.fromisoformat(CONFIG['date'])
    archive = OUT / f'{name}.zip'
    with zipfile.ZipFile(archive, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as bundle:
        for member, body in sorted(entries):
            info = zipfile.ZipInfo(member, (stamp.year, stamp.month, stamp.day, 0, 0, 0))
            info.create_system = 3
            info.external_attr = 0o100644 << 16
            info.compress_type = zipfile.ZIP_DEFLATED
            bundle.writestr(info, body, compresslevel=9)
    with zipfile.ZipFile(archive) as bundle:
        if bundle.testzip() is not None:
            raise ValueError('Archive integrity check failed')
    digest = hashlib.sha256(archive.read_bytes()).hexdigest()
    (OUT / f'{name}.zip.sha256').write_text(f'{digest}  {name}.zip\n')
    result = {'name': name, 'version': CONFIG['version'], 'filename': archive.name,
              'bytes': archive.stat().st_size, 'sha256': digest, 'files': len(entries), 'skills': skills}
    if 'form-design' in skills:
        catalog = json.loads((ROOT / 'skills/form-design/data/manifest.json').read_text())
        result.update(references=catalog['count'], snapshot=catalog['snapshot'])
    (OUT / f'{name}.json').write_text(json.dumps(result, indent=2) + '\n')
    return result


def package():
    OUT.mkdir(exist_ok=True)
    files = {name: skill_files(name) for name in CONFIG['skills']}
    results = []
    for name, members in files.items():
        results.append(write_archive(name, [(name+'/'+p.as_posix(), body) for p, body in members], [name]))
    suite = [('form-design-suite/INSTALL.md', (ROOT / 'docs/install-suite.md').read_bytes())]
    for name, members in files.items():
        suite.extend(('form-design-suite/skills/'+name+'/'+p.as_posix(), body) for p, body in members)
    results.append(write_archive('form-design-suite', suite, CONFIG['skills']))
    (OUT / 'release-index.json').write_text(json.dumps({'version': CONFIG['version'], 'date': CONFIG['date'], 'artifacts': results}, indent=2)+'\n')
    print(json.dumps({'version': CONFIG['version'], 'artifacts': [{k: r[k] for k in ['filename','bytes','files','sha256']} for r in results]}, indent=2))


if __name__ == '__main__':
    package()
