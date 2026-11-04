#!/usr/bin/env python3
"""Check all downloadable archives against source and run extracted tools."""
import hashlib
import json
import re
import subprocess
import tempfile
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
release = json.loads((ROOT / 'releases/release-index.json').read_text())


def expected_skill(name, prefix):
    folder = ROOT / 'skills' / name
    return {prefix + file.relative_to(folder).as_posix(): file.read_bytes()
            for file in folder.rglob('*') if file.is_file()}


def check_links(skill):
    for file in skill.rglob('*.md'):
        for target in re.findall(r'\]\(([^)]+)\)', file.read_text()):
            if target.startswith(('https:', 'http:', '#')):
                continue
            assert (file.parent / target.split('#')[0]).exists(), (file, target)


for artifact in release['artifacts']:
    assert Path(artifact['filename']).name == artifact['filename']
    archive = ROOT / 'releases' / artifact['filename']
    assert hashlib.sha256(archive.read_bytes()).hexdigest() == artifact['sha256']
    assert archive.stat().st_size == artifact['bytes']
    suite = artifact['name'] == 'form-design-suite'
    expected = {}
    if suite:
        expected['form-design-suite/INSTALL.md'] = (ROOT / 'docs/install-suite.md').read_bytes()
    for name in artifact['skills']:
        expected.update(expected_skill(name, f'form-design-suite/skills/{name}/' if suite else name+'/'))
    with tempfile.TemporaryDirectory(prefix='form suite verification ') as temp:
        with zipfile.ZipFile(archive) as bundle:
            assert bundle.testzip() is None
            names = bundle.namelist()
            assert len(names) == len(set(names)) == artifact['files']
            assert set(names) == set(expected), f'Unexpected or missing archive files: {archive.name}'
            assert all(not Path(name).is_absolute() and '..' not in Path(name).parts for name in names)
            assert all(((info.external_attr >> 16) & 0o170000) != 0o120000 for info in bundle.infolist())
            for name, body in expected.items():
                assert bundle.read(name) == body, f'Stale archive member: {name}'
            bundle.extractall(temp)
        base = Path(temp) / 'form-design-suite/skills' if suite else Path(temp)
        for name in artifact['skills']:
            check_links(base / name)
        if 'form-design' in artifact['skills']:
            skill = base / 'form-design'

            def run(script, *args):
                result = subprocess.run(['node', str(skill / 'scripts' / script), *args], cwd=temp,
                                        text=True, capture_output=True, timeout=30, check=True)
                return json.loads(result.stdout)

            found = run('search.mjs', 'intent:hero technique:halftone', '--limit', '2')
            assert found['results'] and found['results'][0]['id'] == 'ascii-landscape'
            assert run('search.mjs', '--id', 'ascii-landscape')['reference']['creator']
            assert run('search.mjs', '--stats')['count'] == artifact['references']
            assert run('contrast.mjs', '#000', '#fff')['ratio'] == 21
            manifest = json.loads((skill / 'data/manifest.json').read_text())
            assert hashlib.sha256((skill / 'data/catalog.json').read_bytes()).hexdigest() == manifest['catalogSha256']
        if 'form-unslop' in artifact['skills']:
            module = base / 'form-unslop/scripts/inspect-page.mjs'
            code = 'import {pathToFileURL} from "node:url";const m=await import(pathToFileURL(process.argv[1]).href);if(typeof m.inspectPage!=="function")process.exit(1);'
            subprocess.run(['node', '--input-type=module', '-e', code, str(module)], cwd=temp, check=True, timeout=30)
    print(f'Verified {artifact["filename"]}: {artifact["files"]} files, source equality, safe extraction, links, and applicable tool checks.')

print(f'All {len(release["artifacts"])} archives verified. Browser observations are tested separately in a real browser.')
