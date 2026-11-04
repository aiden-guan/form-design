# Changelog

## [1.2.0](https://github.com/aiden-guan/form-design/releases/tag/v1.2.0) — 2026-11-03

Apply the unslop criteria before implementation, correct the examples after owner rejection, and retain failures and repair evidence.

### Highlights

| Area | Change | Reason |
| --- | --- | --- |
| Repeat-use composition | Tie opening-view space to task frequency and consolidate repeated framing. | The previous version's app outputs spent space on overlapping context and instructional chrome. |
| Text enlargement | Inspect adjacent text and control contents, then repeat the same affected check after correction. | The previous festival output had time/title collisions and escaped button labels under doubled text; page-width checks alone missed other control crowding. |
| Evidence | Retain rejected drafts, four corrected examples, task/style checks and full-checklist cross-reviews. | Fresh drafts, guided corrections and measured behavior are identified separately. |

### Changed

- **FORM Design**: Strengthen first-view allocation, responsive intrinsic sizing, and reading-size critique in the entrypoint and relevant references. Preserve the existing brand, useful density, expressive identity, and optional-tool boundaries.
- **Unslop defaults**: Explicitly exclude decorative lights, ordinary-action arrows (including labelled Undo actions), italic accents and related defaults. Review all 19 signals, artwork and pseudo-elements.
- **Optional inspector**: Observe arrow glyphs, small round markers, inline SVG italics and bounded text-layout candidates without issuing a taste verdict.
- **Explore**: Remove negative tracking and the unnecessary preview border from the lab; keep controls quiet. The reference catalog is unchanged.
- **Repository presentation**: Link actual generated outputs and the limited paired-pilot evidence alongside the existing research and synthetic rehearsals.

### Added

- **Development record**: Preserve the initial plan and owner-rejected candidates, then document the changed acceptance criteria and guided corrections. Do not present the final examples as an equal-effort model benchmark.
- **Offline gallery**: Open both saved versions at equivalent desktop/mobile sizes, with links to the actual-size pages and underlying reports.
- **Evidence packaging**: Build a separate optional archive with saved code, original synthetic data/artwork, real captures, task checks, review records, and explicit methodological limits.

### Verification

- **Core and utilities**: Nine dependency-free tests, nine optional Chromium tests, and all three skill-entrypoint validators pass.
- **Skill archives**: All four ZIPs pass digest, source-equality, safe-extraction, relative-link, and applicable extracted-tool checks.
- **Evaluation scope**: See the [pilot results](evals/paired-2026-11-03/results.md) for recorded outcomes. Single-run pairs and same-family AI reviewers do not establish a general aesthetic ranking or superiority over another skill.

## [1.1.0](https://github.com/aiden-guan/form-design/releases/tag/v1.1.0) — 2026-11-03

Expand FORM into three independent skills with contextual diagnostics, user-directed visual comparisons, and inspectable research/evaluation evidence.

### Highlights

| Area | Change | Result |
| --- | --- | --- |
| Design | Add reference decomposition, controlled font/color decisions, and explicit preservation checks. | The main skill carries user choices and project specificity into implementation. |
| Unslop | Add a separate 19-signal checklist with investigation, legitimate-use, and repair guidance; deliberately exclude dithering. | Common treatments are evaluated by their actual role rather than banned by appearance. |
| Explore | Add a comparison workflow and standalone type/color lab. | Users can inspect, mix, and export visual proposals on comparable content and states. |
| Evidence | Add primary-source research, reviewed competitor file hashes, synthetic fixtures, and real-browser checks. | Source claims, tool observations, author judgments, and unperformed comparisons are distinguishable. |

### Added

- **FORM Unslop**: Package contextual repair guidance and an optional read-only browser inspector with bounded scan/sample output and explicit limits.
- **FORM Explore**: Package controlled alternatives, decision handoff guidance, and a local comparison lab with independently selectable type/palette roles and proposal export.
- **Research**: Record primary design/usability/accessibility sources and a direct review of public Impeccable/Emil skill files. No superiority claim is inferred from source review.
- **Rehearsals**: Include a fictional workshop before/after and an approved dense-tool counterexample, with actual wide/narrow captures and local interactions.
- **Forward tests**: Retain requests, raw inputs, outputs, measurements, and actual screenshots from two fresh-context skill tasks: critique of an approved tool and interactive type/color exploration.

### Changed

- **FORM Design**: Strengthen visual-authority handling, real-content comparisons, subject-specific decisions, and checks against destructive simplification.
- **Release packaging**: Produce three individual skill ZIPs plus the complete suite, each with checksums/manifests, from one version/date/skill-list configuration.
- **Verification**: Check source equality, safe extraction, local references, and applicable tool execution across all four archives.

### Verification

- **Core**: Nine dependency-free Node tests cover reference retrieval, filters, catalog/provenance fields, contrast, and links across skills.
- **Browser**: Six real-Chromium tests cover inspection boundaries, read-only behavior, functional status filters, reserve/undo at 1200- and 390-pixel widths, and independent type/palette comparison with checked sample contrast pairs.
- **Skills**: All three entrypoints pass the skill-creator validator. Archives are extracted into clean folders and checked against source.
- **Skill use**: Reviewed both independent forward-task outcomes. Reran the generated Explore artifact's 64 browser assertions and checked content preservation, independent choices, stable palette-only geometry, and unapproved proposal status.
- **Scope**: Author-created synthetic examples and tool tests are not a blinded model comparison. General superiority over another design skill remains untested.

## Documentation update — 2026-11-02

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
