# From references and preferences to decisions

Use this when a design needs a defensible direction, when the user wants font/color options, or when repeated sessions keep undoing earlier choices.

## Establish what has authority

Read explicit instructions first, then approved designs/assets, current working behavior, and relevant project conventions. Separate established facts from inferred preferences. A screenshot is evidence of appearance at one size and state; source code is evidence of the implementation; neither alone proves every behavior.

Write only the unresolved question worth testing: “Which type system makes these project descriptions feel more editorial while remaining readable on a phone?” is answerable. “Make it premium” is not a selection criterion until connected to an audience and subject.

## Decompose a reference

Inspect the original or supplied capture and extract relationships, not a list of effects:

| Read | Record | Transfer deliberately |
| --- | --- | --- |
| Reading order | First focal element, second, meaningful action | Relative emphasis and sequence |
| Geometry | Content width, track relationships, alignment, crop | Composition that works with the new content |
| Typography | Actual roles, measure, weight, leading, wraps | Role contrast; confirm the font and license separately |
| Color/material | Which colors carry text, action, surface, status | Roles and contrast in the new context |
| Behavior | Observed trigger, state, interruption, duration | Only what was demonstrated; mark unknowns |

For original work, avoid importing several references' competing identities into one screen. Assign each a job. For faithful matching, source geometry and assets take priority over an original remix. When a reference is inaccessible, say which decisions are inferred rather than pretending to have inspected it.

## Compare fonts and palettes without confounding the question

When choosing a font, hold layout, content, and color constant. Set the real headline, a paragraph, a navigation label, a long name, an error, and representative numbers. Compare wrap, x-height, tone, available weights, language coverage, fallback behavior, and actual rendering. Let the user choose; do not secretly replace a selected face because it appears on a trend list.

When choosing color, keep type and geometry stable. Compare semantic roles on actual controls and states, not isolated swatches. Check text/action contrast, selected vs unselected, error vs ordinary content, and meaning without hue alone. A palette choice is not complete until those roles have values.

When exploring whole concepts, vary composition and visual language on purpose. Name the question each direction answers and the cost it introduces. Use equal factual content and an equivalent viewport/state; a beautiful hero and an unfinished dashboard are not a useful comparison.

If the user combines the type from one direction with another palette, inspect that combined result. Choices interact: a thin face on a colored surface may need different weight or contrast. Explain the smallest adjustment that preserves the choice.

## Carry decisions forward

When the work benefits from a handoff, update the existing design-context document or create one compact project-local decision note. Do not overwrite unrelated context or treat proposed choices as approved. Include:

```text
Audience / primary task / surface:
Facts and constraints:
Approved reference roles:
Selected type roles and available font files:
Selected semantic color values:
Layout and image rules:
Signature detail and its purpose:
Behavior, states, and reduced-motion treatment:
User-selected / agent-proposed / still unresolved:
Checked viewports and remaining evidence gaps:
```

Use the project's existing token conventions when implementing. Prefer a small set of decisions that explains the interface over a large decorative specification. A selection note preserves decisions; it does not grant new permissions or turn an unresolved proposal into a commitment.

Research basis: [Jason Santa Maria on type choice](https://alistapart.com/article/on-web-typography/), [Refactoring UI's public palette guidance](https://refactoringui.com/previews/building-your-color-palette), [NN/G on recognition and recall](https://www.nngroup.com/articles/recognition-and-recall/), [Every Layout on composition](https://every-layout.dev/rudiments/composition/). The comparison procedure is FORM's synthesis.
