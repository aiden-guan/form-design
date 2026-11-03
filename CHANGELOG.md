# Changelog

## Unreleased — 2026-11-02

Improve the public repository's demonstration, architecture documentation, and release hygiene while preserving the v1.0.0 skill.

### Highlights

| Area | Change | Result |
| --- | --- | --- |
| Demonstration | Generate the README hero from actual offline search output and retain its JSON evidence. | Readers can inspect and reproduce the displayed candidates. |
| Architecture | Document instruction loading, hybrid retrieval, provenance, contrast, and archive verification with owning modules. | Implementation and tradeoffs are explicit. |
| Distribution | Keep generated ZIPs and manifests in ignored `releases/`; published downloads remain in GitHub Releases. | Main-branch source is separated from release outputs. |

### Documentation & Presentation

- **README**: Add a compact quick start, four-part capability grid, real CLI walkthrough, Mermaid flow, annotated repository map, and explicit maturity limits.
- **Engineering notes**: Explain concept coverage, field-weighted BM25, lexical scoring, bounded output, and release verification without claiming unmeasured performance.
- **Assets**: Add reproducible SVGs, real search JSON, and a social-preview PNG with a capture specification.
- **Architecture fallback**: Add a static SVG alongside expandable Mermaid source after the native embed remained on a loading indicator during headless inspection.
- **History**: Record the initial release and this presentation pass in a maintained changelog.

### Tooling & Hygiene

- **Presentation generator**: Add a standard-library Python command that runs search and checks committed SVG/JSON output for drift.
- **Release outputs**: Stop tracking generated release artifacts on the main branch. Rebuilding locally remains part of the documented verification path.

### Verification

- `node --test tests/design-skill.test.mjs`: nine tests.
- `python3 scripts/package-design-skill.py` and `python3 scripts/verify-design-skill-archive.py`: source/archive equality and extracted-tool checks.
- `python3 scripts/generate-presentation.py --check`: recorded search evidence and SVGs match current output.
- README and changelog: strict validation with the GitHub Repo Presenter validator.

## [1.0.0](https://github.com/aiden-guan/form-design/releases/tag/v1.0.0) — 2026-11-02

Publish the standalone FORM Design skill with design methods, attributed public-reference discovery, and verifiable release packaging.

### Highlights

| Component | Initial capability | Boundary |
| --- | --- | --- |
| Design workflow | Task routing, art direction, visual craft, surfaces, motion, critique, and worked examples. | Host models and tools carry out the work. |
| Reference discovery | Offline search over 13,351 public references with attribution, rights, and evidence fields. | A metadata snapshot is not an individual visual or license audit. |
| Distribution | Public source, versioned ZIP, SHA-256 file, release manifest, and installation instructions. | Creator media and private source are excluded. |

### Added

- **Skill**: Package the portable entrypoint, Codex metadata, focused references, and five worked examples.
- **Research**: Organize primary-source lessons into 13 practitioner lenses, distinguishing observations from FORM applications.
- **Tools**: Include bounded reference search and an opaque-hex contrast calculator, both using Node.js built-ins.
- **Verification**: Include nine automated checks, an allowlisted packager, archive verification, and behavioral evaluation inputs.

### Verification

- **Local**: Nine automated tests and clean-folder archive checks passed before publication.
- **Public download**: An anonymous ZIP download matched the published SHA-256; the extracted search tool ran successfully.
- **Installation**: A fresh temporary Codex project installed through the Skills CLI; both installed tools executed successfully.
- **Scope**: No cross-model design-quality benchmark was performed.
