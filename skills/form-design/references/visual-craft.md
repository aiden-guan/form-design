# Visual craft: decisions and corrections

Read the sections that address the current design problem. Values below are practical starting points, not a prescribed house style.

## Composition and hierarchy

Design a reading path. Identify a dominant element, a supporting layer, and the next meaningful action. Compare visual weight, not only font sizes: area, position, contrast, image detail, and surrounding space all draw attention.

Establish alignment anchors and a reason for breaking them. Asymmetry works when relationships remain legible; random offsets rarely do. A grid should serve content. A list may compare information better than cards; an editorial spread may tell a story better than a feature grid.

Vary page rhythm using the content's actual demands: an argument, a close-up, an annotated example, a comparison, a moment of rest. Give a section a communication job before styling it. Look at the whole page zoomed out, then at normal reading size. Thumbnail impact and sustained reading are different tests.

Use proximity to reveal groups: the gap within a related unit should usually be visibly smaller than the gap separating units. Optical corrections are legitimate when a mathematically centered icon or line looks off. Fix a spacing relationship in the token/component system before accumulating local overrides.

## Typography as structure

Choose faces using actual words and numbers from the product. Compare x-height, width, weight, apertures, punctuation, language coverage, and the available styles. Display personality can live in a headline while body and interface roles stay highly readable. A single strong family may be enough; multiple families need distinct jobs.

Build roles rather than an arbitrary size ladder: display, section heading, body, supporting text, label, numeric value. Distinguish importance with weight, tone, position, and space as well as size. Check that muted text remains readable. Use tabular figures for values that must align or update without distracting shifts, when the font supports them.

For Latin long-form text, roughly 45–75 characters per line and body leading around 1.45–1.7 can be useful first trials. Tune for the face, language, content, and device. Display type often needs tighter leading and carefully reviewed wraps. Avoid forced line breaks that create awkward narrow-screen fragments. Do not compress text until it fits an arbitrary container.

For fluid web type, combine relative and viewport units rather than using viewport units alone. Check browser zoom and user text settings. Ensure fallback fonts are acceptable and inspect again after web fonts load. Choose and license fonts deliberately; do not assume a local or commercial font exists for everyone.

## Color as a working system

Assign roles: canvas, surface, raised surface, primary text, secondary text, boundary, action, selected, success, warning, and danger. Not every project needs every role. A cohesive set of neutrals often contributes more than a collection of saturated swatches. Test colors in adjacent combinations and all used states.

Use strong contrast to guide attention, and repeat accents with intent. Meaning should survive without hue alone: add a label, shape, icon, position, or pattern for status and charts. Gradients and transparency require testing where the actual text or control appears, including the least favorable background.

For opaque solid hex colors:

```sh
node <skill-dir>/scripts/contrast.mjs '#17201b' '#f6f3eb'
```

The utility calculates WCAG contrast for the pair. Normal text's AA threshold is 4.5:1; large text's is 3:1. Large text qualification, exceptions, images, and rendered opacity require contextual assessment. Do not infer whole-page conformance from a color pair. [W3C contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

## Imagery and material

Art-direct the image, not just its placement. Specify subject, camera distance, lighting, negative space, crop, palette relationship, and what the image needs to communicate. Keep a focal subject intact across crops. Use actual product evidence when explaining a product. Avoid fabricated results and illegible faux interfaces.

Prefer assets supplied by the user or with appropriate reuse rights. Generated imagery is an option when available and suitable, not a prerequisite. Until an asset exists, preserve its intended ratio and use an honest placeholder; describe the missing asset in the handoff. Never replace useful page content with a single screenshot to simulate a working interface.

Texture, halftone, grain, and custom rendering are material decisions. Ask which property they express and what happens at small sizes. Keep readable text out of noisy regions. Tune pattern scale at real display sizes; check moiré, contrast, and low-quality fallbacks.

If depth is appropriate, choose a coherent lighting environment and elevation hierarchy. Related shadows should agree in direction and respond consistently to elevation. Use boundaries and background contrast when they describe structure more clearly or cheaply. Do not apply blur, glass, or shadow as a universal quality filter.

## Responsive composition

Treat a narrow layout as a fresh arrangement of the same priorities. Decide what stacks, reorders, collapses, crops, or becomes a deliberate horizontal scroller. Preserve semantic reading order; avoid visual order that contradicts keyboard or screen-reader order.

Use content-driven breakpoints, flexible tracks, wrapping, and sensible min/max widths. Test long headings, large numbers, translated labels, missing imagery, and variable-height cards. Fix the underlying sizing constraint instead of hiding overflow on the page. Preserve image space to reduce layout shifts.

## High-impact correction table

| Observed problem | First move to try |
| --- | --- |
| Nothing feels important | Reduce competing high-contrast regions; enlarge or reposition the actual focal element. |
| Everything feels oversized | Separate display typography from interface/body roles; restore useful information density. |
| The page is technically aligned but feels awkward | Inspect optical centers, type baselines, image crop, and unequal visual weight. |
| The result feels sterile | Add subject-specific imagery, distinctive typographic relationships, or one meaningful material detail. |
| The result feels messy | Unify alignment, type roles, color jobs, and grouping before removing all personality. |
| Mobile feels like a squeezed poster | Recompose the reading order, image crop, and action placement for the narrow surface. |
| The design looks expensive but is hard to use | Restore labels, visible actions, contrast, readable density, and familiar interaction affordances. |
