#!/usr/bin/env python3
"""Create a deterministic, allowlisted skill ZIP and public distribution folder."""
import hashlib
import json
import re
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / 'skills/form-design'
OUT = ROOT / 'releases'
ALLOWED_TOP = {'SKILL.md', 'LICENSE.txt', 'NOTICE.md'}
ALLOWED_DIRS = {'agents', 'references', 'scripts', 'data'}
ALLOWED_SUFFIXES = {'.md', '.txt', '.yaml', '.mjs', '.json'}


def package():
    files = []
    for file in sorted(SKILL.rglob('*')):
        if not file.is_file():
            continue
        relative = file.relative_to(SKILL)
        if file.is_symlink():
            raise ValueError(f'Symlink in package: {relative}')
        if len(relative.parts) == 1:
            allowed = relative.name in ALLOWED_TOP
        else:
            allowed = relative.parts[0] in ALLOWED_DIRS and file.suffix in ALLOWED_SUFFIXES
        if not allowed or any(part.startswith('.') or part == '__pycache__' for part in relative.parts):
            raise ValueError(f'Unexpected skill file: {relative}')
        body = file.read_bytes()
        if re.search(rb'/Users/|/home/|file://|https?://(?:localhost|127\.0\.0\.1)(?=[:/"\s])', body):
            raise ValueError(f'Local path/address in package: {relative}')
        files.append((relative, body))
    required = {'SKILL.md', 'agents/openai.yaml', 'scripts/search.mjs', 'scripts/contrast.mjs', 'data/catalog.json', 'data/manifest.json', 'LICENSE.txt', 'NOTICE.md'}
    if not required.issubset({p.as_posix() for p, _ in files}):
        raise ValueError('Missing required package files')
    OUT.mkdir(exist_ok=True)
    archive = OUT / 'form-design.zip'
    with zipfile.ZipFile(archive, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as bundle:
        for relative, body in files:
            info = zipfile.ZipInfo('form-design/' + relative.as_posix(), (2026, 11, 2, 0, 0, 0))
            info.create_system = 3
            info.external_attr = 0o100644 << 16
            info.compress_type = zipfile.ZIP_DEFLATED
            bundle.writestr(info, body, compresslevel=9)
    with zipfile.ZipFile(archive) as bundle:
        if bundle.testzip() is not None:
            raise ValueError('Archive integrity check failed')
    digest = hashlib.sha256(archive.read_bytes()).hexdigest()
    (OUT / 'form-design.zip.sha256').write_text(f'{digest}  form-design.zip\n')
    catalog = json.loads((SKILL / 'data/manifest.json').read_text())
    manifest = {'name': 'form-design', 'version': '1.0.0', 'filename': archive.name,
                'bytes': archive.stat().st_size, 'sha256': digest, 'files': len(files),
                'references': catalog['count'], 'snapshot': catalog['snapshot']}
    (OUT / 'form-design.json').write_text(json.dumps(manifest, indent=2) + '\n')
    print(json.dumps(manifest, indent=2))


if __name__ == '__main__':
    package()
