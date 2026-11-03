#!/usr/bin/env python3
"""Verify actual downloadable ZIP in isolation, including its executable tools."""
import hashlib
import json
import subprocess
import tempfile
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
archive = ROOT / 'releases/form-design.zip'
release = json.loads((ROOT / 'releases/form-design.json').read_text())
assert hashlib.sha256(archive.read_bytes()).hexdigest() == release['sha256']
assert archive.stat().st_size == release['bytes']

with tempfile.TemporaryDirectory(prefix='form skill verification ') as temp:
    with zipfile.ZipFile(archive) as bundle:
        assert bundle.testzip() is None
        names = bundle.namelist()
        assert len(names) == release['files']
        assert all(name.startswith('form-design/') and '..' not in Path(name).parts for name in names)
        assert all(((info.external_attr >> 16) & 0o170000) != 0o120000 for info in bundle.infolist())
        sources = {f'form-design/{file.relative_to(ROOT / "skills/form-design").as_posix()}': file
                   for file in (ROOT / 'skills/form-design').rglob('*') if file.is_file()}
        assert set(names) == set(sources), 'Archive does not match the current skill file set'
        for name, source in sources.items():
            assert bundle.read(name) == source.read_bytes(), f'Stale archive member: {name}'
        bundle.extractall(temp)
    skill = Path(temp) / 'form-design'

    def run(script, *args):
        result = subprocess.run(['node', str(skill / 'scripts' / script), *args], cwd=temp,
                                text=True, capture_output=True, timeout=30, check=True)
        return json.loads(result.stdout)

    found = run('search.mjs', 'intent:hero technique:halftone', '--limit', '2')
    assert found['results'] and len(found['results']) <= 2
    assert found['results'][0]['id'] == 'ascii-landscape'
    assert run('search.mjs', '--id', 'ascii-landscape')['reference']['creator']
    assert run('search.mjs', '--stats')['count'] == release['references']
    assert run('contrast.mjs', '#000', '#fff')['ratio'] == 21
    manifest = json.loads((skill / 'data/manifest.json').read_text())
    assert hashlib.sha256((skill / 'data/catalog.json').read_bytes()).hexdigest() == manifest['catalogSha256']

print(f'ZIP verified: {release["files"]} files, {release["references"]} references; search and contrast run from a clean folder with spaces and no installed npm dependencies.')
