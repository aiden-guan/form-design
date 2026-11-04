# FORM Design v1.1.0

FORM v1.1.0 adds three independent skills for design, contextual repair, and visual choice.

```sh
npx skills add aiden-guan/form-design
```

Choose all three or install one with `--skill form-design`, `--skill form-unslop`, or `--skill form-explore`. [Installation guide](https://github.com/aiden-guan/form-design#quick-start).

| Skill | What's new |
| --- | --- |
| **Design** | Stronger reference decomposition, real-content font/color comparisons, choice preservation, and diagnosis of generic composition. Includes the existing 13,351-reference offline search and contrast checker. |
| **Unslop** | A separate 19-signal diagnostic checklist, legitimate-use counterexamples, targeted repairs, and a read-only browser inventory function. Dithering is intentionally excluded. |
| **Explore** | Comparable visual alternatives, user-selected combinations, decision handoff, and a standalone type/color lab that exports proposal data. |

The checklist adapts the supplied Charles Liu notes with explicit provenance. It treats a style signal as a hypothesis and preserves useful tags, borders, type, density, and chosen identity. The original reel was not independently retrieved.

The [research report](https://github.com/aiden-guan/form-design/blob/main/docs/research/2026-11-03-design-quality.md) links primary sources and records the reviewed public Impeccable/Emil skill snapshots. The included [synthetic rehearsal](https://github.com/aiden-guan/form-design/blob/main/evals/rehearsal.md) has actual fixture captures and explicit evaluation limits. No competitor code, paid course material, or creator media is bundled.

Validation includes nine dependency-free tests, six real-browser tests, all three skill-entrypoint validators, and source/extraction/tool checks for four archives. Two [independent forward tasks](https://github.com/aiden-guan/form-design/blob/main/evals/forward-tests-2026-11-03.md) retain actual critique/prototype outputs and explicit limits; the generated Explore artifact's 64 browser assertions were rerun. This evidence does not establish general design-quality superiority over another skill.

Download **form-design-suite.zip** for all skills and the installation guide, or choose the individual skill ZIPs. Each archive has a matching SHA-256 file and JSON manifest; **release-index.json** lists the full release.

Written guidance works without a shell. Optional core CLI tools use Node.js 18+; the comparison lab opens directly in a browser. The optional inspector needs an existing permitted browser-evaluation tool and is not an aesthetic or accessibility detector. The Skills CLI currently needs Node.js 22.20+.
