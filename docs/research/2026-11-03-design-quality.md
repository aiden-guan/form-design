# Design quality research — 2026-11-03

This pass updates FORM's design methods and adds separate Unslop and Explore skills. It combines the supplied social-media notes, primary design/usability sources, a research paper, and inspection of Impeccable and Emil Kowalski's public skill files. Applications are original synthesis; source inspection is not a comparative product benchmark.

## What the research changed

| Finding | Evidence | Change in FORM |
| --- | --- | --- |
| A style tell needs a contextual explanation. | Aesthetic judgments in research depend on properties and audiences; functional design systems deliberately use tags and other familiar treatments. | The 19-signal list asks when to investigate, when to keep, and what correction addresses the actual cause. No AI-authorship probability or taste score. |
| Less decoration is not the same as a better interface. | NN/G distinguishes useful minimalism from minimalist appearance and documents the importance of clickability clues. | Repair must preserve useful status, labels, input boundaries, task density, and explicit brand choices. A preservation counterexample is included. |
| Hierarchy and grouping are stronger interventions than cosmetic replacement. | NN/G's visual principles and Every Layout describe relationships among scale, contrast, proximity, and adaptable structure. | Diagnose reading path and information structure before font swaps or blanket border removal. |
| Font and color choices need real context. | Type guidance distinguishes roles; palette guidance supplies usable ranges; recognition benefits from inspectable choices. | Explore holds unrelated variables stable for font/color decisions, supports mixing chosen options, and records approved vs proposed choices. |
| A screenshot, source scan, and computed-style sample establish different things. | Browser rendering guidance and accessibility specifications require attention to rendered context and user settings. | The optional inspector reports selectors, computed properties, and coverage limits, with no automatic taste verdict. |
| Quality needs behavioral evidence as well as packaging checks. | The inspected skills emphasize rendered iteration; functional requirements remain separate from appearance. | Add real-browser tests and explicitly labeled synthetic rehearsals, alongside a protocol for future matched model comparisons. |

## Primary-source ledger

Sources were inspected on 2026-11-03 unless marked as the existing foundation. Summaries are bounded; the actionable comparison/repair procedures are FORM's applications.

| Source | What was used | Limit |
| --- | --- | --- |
| [NN/G — Aesthetic and Minimalist Design](https://www.nngroup.com/articles/aesthetic-minimalist-design/) | Necessary information should remain while irrelevant competition is reduced. | Does not require a minimalist style or prove that every visual detail is waste. |
| [NN/G — Five Principles of Visual Design](https://www.nngroup.com/articles/principles-visual-design/) | Scale, hierarchy, balance, contrast, and perceptual grouping. | These relationships need contextual interpretation. |
| [NN/G — Visual Hierarchy](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/) | Organizing emphasis to guide the reading path. | No universal font size, decoration quota, or visual-score formula follows. |
| [NN/G — Flat Design Best Practices](https://www.nngroup.com/articles/flat-design-best-practices/) | Consistent, perceivable clues help people recognize actions. | Removing borders/shadows can reduce usability; an effect's role matters. |
| [NN/G — Recognition and Recall](https://www.nngroup.com/articles/recognition-and-recall/) | Inspectable options reduce reliance on imagining or recalling possibilities. | Supports showing choices; does not empirically validate FORM's particular comparison workflow. |
| [GOV.UK — Tag component](https://design-system.service.gov.uk/components/tag/) | A real status indicator is a legitimate reason for a tag-like shape; distinguish static status from actions. | A functional counterexample, not a mandate to copy the system's appearance. |
| [Every Layout — Axioms](https://every-layout.dev/rudiments/axioms/) | Content measure and adaptable relationships under changing space/settings. | The example numeric constraints are not a universal style recipe. |
| [Every Layout — Composition](https://every-layout.dev/rudiments/composition/) | Compose reusable layout relationships rather than accumulating arbitrary special cases. | FORM does not copy the book's implementations. |
| [Adobe Spectrum — Typography](https://spectrum.adobe.com/page/typography/) | Typographic roles, reading conditions, and language support. | A brand's face is a contextual choice, not a prescribed replacement for another face. |
| [W3C — Text Spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html) | Content/function should survive specified user text-spacing overrides. | The override thresholds are not required author defaults; negative tracking is not categorically forbidden. |
| [W3C — Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) | Meaning should not depend on color alone. | Semantic roles still need contextual contrast and non-color cues. |
| [Reinecke et al., CHI 2013 — Predicting Website Aesthetics](https://www.iis.seas.harvard.edu/papers/2013/reinecke13aesthetics.pdf) | Complexity and colorfulness relate to initial aesthetic judgments, with differences among audiences. | The work concerns first impressions of study stimuli; it does not establish general task success, contemporary model quality, or a slop classifier. |
| [Emil Kowalski — You Don't Need Animations](https://emilkowal.ski/ui/you-dont-need-animations) | Purpose and frequency change whether animation helps. | Original essay reread; no course material copied. |
| [Rauno Freiberg — Invisible Details of Interaction Design](https://rauno.me/craft/interaction-design) | Observed responsiveness, interruption, and spatial relationships. | Observational examples, not a universal timing table. |
| [web.dev — High-performance CSS animations](https://web.dev/articles/animations-guide) | Rendering cost depends on the property and pipeline; measure expensive effects. | Does not justify claiming every CSS/WAAPI animation is compositor-driven or smooth on every device. |
| [Existing 13-lens foundation](../../skills/form-design/references/designer-principles.md) | Prior primary-source lessons on typography, responsive composition, color, material, and interaction. | Prior inspection notes remain explicit; they are not counted as new behavioral tests. |

The supplied Charles Liu list/caption was used as user-provided source material. Searches did not establish the exact original reel URL, so no reel link or independent viewing claim is invented. The 19-item diagnostic selection excludes dithering and remains separate from the public design-reference catalog.

## Review of public skills

Reviewed content snapshots:

| Project / file | Source | Git blob SHA inspected |
| --- | --- | --- |
| Impeccable README | [Public README](https://github.com/pbakaus/impeccable/blob/main/README.md) | `555fd9a67de957c750950e62bf1baad167f61b00` |
| Impeccable entrypoint | [SKILL.md](https://github.com/pbakaus/impeccable/blob/main/.agents/skills/impeccable/SKILL.md) | `c0dd2530c9968963b1f63bf50b227c4a33996e3b` |
| Impeccable craft guidance | [craft-floor.md](https://github.com/pbakaus/impeccable/blob/main/.agents/skills/impeccable/reference/craft-floor.md) | `fd7280103f7ef4b009b38ce58f594c44c0f04caa` |
| Emil design engineering | [SKILL.md](https://github.com/emilkowalski/skills/blob/main/skills/emil-design-eng/SKILL.md) | `dc063c2a861922c1c9f2412b824b0862746304f5` |
| Emil prototyping | [SKILL.md](https://github.com/emilkowalski/skills/blob/main/skills/prototype/SKILL.md) | `dbcc1a23c66933f7372c0aacbce2b0d7cc6100b6` |

These are file-object hashes, not commit IDs. Links follow the current default branch and may drift; the hashes identify the inspected content. The tools were not installed or executed in this review, and their broader implementations were not exhaustively audited.

Both projects already contain substantial guidance about context, craft, actual rendering, and meaningful variation. Those ideas are not claimed as unique to FORM. Impeccable documents a broader command set, detection engine, context files, and live iteration. Emil's inspected files focus on interaction craft and a concrete component-variation workflow. Neither document review nor a feature count establishes which gives better results for a given user.

FORM's chosen emphasis is:

- **Small independent workflows:** design, contextual repair, and user-directed visual comparison can be installed separately.
- **Evidence with counterexamples:** every supplied style signal has a legitimate-use case, and browser observations remain distinct from judgments.
- **Choice that survives implementation:** controlled font/color comparisons and an explicit record of user-selected vs agent-proposed decisions.
- **Attributed offline discovery:** the existing 13,351-reference index remains available without a search service.
- **Lightweight distribution:** no custom installer engine, model service, mandatory browser dependency, or automatic hooks are required by the skills.

No competitor code or paid content was copied. New writing and tooling are original FORM work. This report compares documented approaches, not end-to-end quality or speed.

## How to establish an improvement claim

Use the same brief, model/version, host, tools, factual content, permitted assets, and effort budget for each condition: baseline, FORM, and any explicitly tested alternative. Start from independent clean copies. Record failures and all outputs, not only the best screenshots. Do not import another skill into a condition accidentally.

Present outputs under neutral labels and randomized order to reviewers who do not know the condition. Have reviewers assess task clarity, subject specificity, hierarchy, type/color coherence, actual behavior, accessibility evidence, preservation of constraints, and maintenance cost. Keep subjective preference distinct from observed failures. Include multiple briefs and repeated runs before generalizing.

The supplied [scenario suite](../../evals/scenarios.json), [author-run rehearsal](../../evals/rehearsal.md), and browser tests support iteration. The rehearsal is synthetic and authored with knowledge of the intended repair; it is not an independent or blinded evaluation. Two [fresh-context forward tasks](../../evals/forward-tests-2026-11-03.md) separately exercised contextual critique and interactive exploration, with actual outputs and observed limits retained. They are limited qualitative checks, not repeated or matched rival comparisons. No claim that FORM outperforms Impeccable, Emil's skills, or another model is made by this release.
