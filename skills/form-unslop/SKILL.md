---
name: form-unslop
description: Diagnose and improve generic or AI-looking interfaces with evidence-based, context-sensitive design corrections. Use for unslop requests, template-like pages, decorative clutter, weak hierarchy, and design critique or repair. Preserve functional detail, approved references, and user-selected fonts/colors; audit-only requests remain read-only.
license: See LICENSE.txt and NOTICE.md
metadata:
  version: "1.1.0"
---

# FORM Unslop

Find why a design feels interchangeable and correct the cause. The goal is a more specific, coherent, useful interface. The presence of a pill, font, border, gradient, or mono label does not establish poor design or AI authorship.

This skill is independently usable. It needs no other FORM skill, network service, installation hook, or shell. An optional browser inspector collects observations when your host can evaluate a function in the page.

## Establish the target and the authority

Inspect the supplied screen or running artifact and the relevant source when available. Identify the audience, primary task, surface, requested scope, and existing brand. Read relevant existing design context. Preserve factual content, working behavior, platform conventions, and user-approved choices. A request to remove generic styling does not authorize replacing the product or deleting required information.

For “audit” or “critique,” inspect and recommend; do not edit. “Unslop this” or an explicit repair request authorizes scoped, reversible design corrections. If the intended target is unclear, progress on the supplied artifact and ask only the missing question that changes the work. Do not create an onboarding questionnaire for a narrow edit.

## Diagnose relationships before individual tells

Start with a reading-path and task check:

- Can a new visitor identify what this is, why it matters, and the next relevant action?
- Does the hierarchy reflect those priorities, or does every card/label compete equally?
- Which choices depend on this project's actual subject? Which survive unchanged after swapping its name?
- Is the apparent clutter necessary working information, or decoration imitating a complicated product?

Read [signals.md](references/signals.md) for the separate 19-signal checklist adapted from the supplied Charles Liu notes. It intentionally excludes dithering. Keep this diagnostic list separate from the inspiration/reference library; neither “in the library” nor “on the checklist” decides whether a treatment is appropriate.

Use each signal as a hypothesis. For a relevant candidate, identify a location, an observable effect, its job, and a decision: **keep, change, verify, or outside scope**. “Change” needs a contextual reason such as redundant information, competing emphasis, illegibility, false affordance, or lack of connection to the brief. Explicit user choices can justify a style; a demonstrable accessibility or behavior problem still needs a targeted correction.

## Gather evidence proportionate to the task

Look at actual content at a representative wide and narrow width, plus the affected state. Compare equivalent viewport, crop, font loading, and state before/after. If only a screenshot is available, limit conclusions to what it demonstrates. If the app cannot run, distinguish source observations from rendered observations.

When a browser execution tool is available, [browser-inspection.md](references/browser-inspection.md) explains the optional [inspect-page.mjs](scripts/inspect-page.mjs) function. It returns bounded computed-style observations, selectors, and samples. It does not decide taste, identify AI authorship, or validate accessibility. Counts are not severity scores. Manual inspection remains sufficient when the host cannot run it.

## Repair the cause

Read [repair-method.md](references/repair-method.md). Prioritize the most consequential problems, then make the smallest set of changes that resolves them. A composition problem may need structural work; do not disguise it with a font swap. A narrow typography request should not become a layout rebuild.

Useful moves include removing duplicated meaning, strengthening a reading path, grouping by proximity, consolidating accidental token drift, replacing invented proof with honest content, and adding subject-specific imagery or structure. Do not replace the original with a new canned look such as a beige editorial page or a monochrome dashboard.

When the unresolved issue is taste, compare a few controlled font/color or composition alternatives on the same actual content. Preserve a user selection. Do not choose a default because it is popular, and do not reject a selected face because it appears on the checklist.

## Verify the correction and the restraint

Reinspect the affected views and operate relevant actions. Confirm that status, filters, input affordances, density needed for comparison, labels, focus, and chosen brand details still do their jobs. Review zoom/reflow, long content, contrast context, touch access, and reduced motion where relevant. Cosmetic subtraction is not success if the task becomes harder.

Stop when the requested scope is complete and the material problems are resolved. Do not pad a report with all 19 signals or continue removing elements to maximize a count.

## Handoff

For critique, report the most useful findings as **location → observation → consequence → correction**, with uncertainty when applicable. For implementation, deliver the actual changes and briefly report why they help, what important choices you preserved, and what was tested. Avoid numerical taste scores and claims that you proved a design was generated by AI.

Research and inspection limits are summarized in [sources.md](references/sources.md). The checklist is a diagnostic adaptation, not a universal design standard or a competitor-quality benchmark.
