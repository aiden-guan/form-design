# Corrected outputs after the unslop failure

The first revision failed the owner's visual acceptance despite its working interactions. It still used ornamental status dots, arrows, italic accents and other supplied tells. Those drafts are retained; they are not evidence of successful unslop.

The final skill makes the full checklist a starting constraint and a delivery check. All 19 original signals remain separate from the reference catalog. Indicator lights and ordinary-action arrows are two additional owner-identified defaults, not additions attributed to Charles Liu. Dithering remains excluded.

## What was corrected

| Example | Correction | Recorded evidence |
| --- | --- | --- |
| Signal festival | Remove added framing/punctuation and use plain action labels. Fix enlarged time/title collisions, header overflow, dialog Close overflow and artwork interference. | At 900px doubled text, all six time/title pairs have no overlap and at least an 18px gap. Mobile dialog overflow is zero; artwork clears the wordmark. |
| Dispatch lending desk | Plain status labels and Undo action; fewer outer frames and duplicate shortcut labels. Stronger focus and a correctly hidden skip link. | Blue focus contrast is 6.48:1 on white and 5.94:1 on canvas. The unfocused enlarged skip link ends 8px above the viewport and becomes usable on focus. |
| Margin reading shelf | Upright original covers; no decorative dots, arrows, italic accents or repeated framing. Stack mobile details for enlarged titles. | All four details at 320px and 390px doubled text have zero broken title words or horizontal dialog overflow. |
| Kite bicycle | Remove a pale, floating frame decal; retain actual size/color/wheel controls and the original illustration. | All 18 configurations and actual frame-color changes are exercised by the shared task checks. Native controls and physical bicycle joints are not decorative status lights. |

[Exact-state repair checks](final-geometry-verification.json), [reading checks](reading-repair-verification.json), [festival verification](festival-final-verification.json), and [lending verification](operations-final-verification.json) retain measurements and limits. The final source hashes are recorded alongside the shared captures and [maintainer checklist](maintainer-checklist.json). Some minor label/glyph simplifications followed individual reviewer checks; the final shared checks and exact-state verification run against the final source.

## What passed, and what it means

- **Task behavior:** 24/24 required task flows pass in the earlier saved pages and 24/24 in the corrected pages, across 1440px and 390px. This includes filtering, empty/reset states, save/unsave, reading-state updates, returns/latest undo, configuration prices and quote dismissal. It does not measure beauty. [Raw results](task-results.json) · [runner](check-tasks.mjs).
- **Narrow style checks:** All four corrected pages pass the demo-specific checks for direct/pseudo arrow glyphs, italic text and negative tracking, including referenced SVG text assets. These checks do not identify every SVG path icon or every checklist issue. The redundant Undo path icon was removed by manual review. [Raw observations](visual-checks.json) · [runner](check-visual.mjs).
- **Full checklist review:** Each of four cross-reviews covers U01–U19 and A01–A02. The original reports include real findings, not only approvals. The [maintainer record](maintainer-checklist.json) states the final corrections and concrete exceptions. Necessary input/control boundaries, real loan IDs, native selection and actual artwork geometry remain.
- **Layout observations:** The corrected initial pages have no horizontal page overflow at the two normal capture widths or the shared 390px doubled-text stress view. These are bounded observations, not a complete reflow/accessibility evaluation. [Captures and coverage](capture-results.json).

Read the original cross-reviews: [festival](reviews/festival.json), [lending](reviews/operations.json), [reading](reviews/reading.json), [bicycle](reviews/holdout.json). Their targets are preserved pre-repair snapshots. One review accepted the Undo icon as conventional; owner preference took precedence, the arrow was removed, and the skill now closes that exception explicitly.

## Open and inspect the pages

[Download the optional evidence ZIP](https://github.com/aiden-guan/form-design/releases/latest/download/form-design-evidence.zip), extract it, and open **gallery.html**. It compares an earlier draft with the corrected example under the same viewport. All actions are local demonstrations. Some pages preserve fictional selections in browser storage; the shared captures use fresh contexts for their recorded initial states.

From a source checkout with an existing Playwright installation:

```sh
node evals/paired-2026-11-03/check-tasks.mjs
node evals/paired-2026-11-03/check-visual.mjs
node evals/paired-2026-11-03/verify-corrections.mjs
node scripts/capture-design-pairs.mjs
python3 scripts/build-evaluation-gallery.py
```

Set `FORM_PLAYWRIGHT_MODULE` if Playwright is outside the checkout. The skills themselves do not require it. The [raw briefs](briefs/reading.json), generated source, actual images and reports are original synthetic material under the included license.

## Method and limits

This became an iterative acceptance record after the owner rejected the initial experiment. The original [protocol](protocol.json), [amendment](amendment.json), [first revision](revision-1.json), [final revision record](revision.json) and [method](method.md) are retained.

Two corrected drafts began in fresh contexts; the reading page was rebuilt by the maintainer and the bicycle used continued context. All received review and guided repairs. Reviewers used separate artifact tasks but were not a fresh human panel or a blinded preference study. Model settings were inherited; provider revision, inference tokens and equal effort were not independently controlled. This cannot establish a causal skill win rate or general superiority over Impeccable/Emil.

Computed font doubling is a stress method, not actual browser zoom. Chromium checks do not prove other browsers, physical devices, assistive technology, production performance or complete WCAG conformance. The style checks verify specific criteria; the examples are inspectable results rather than a promise that every future generation will be beautiful.
