# Different surfaces need different strengths

Use this to avoid transplanting a marketing-page aesthetic into every interface.

| Surface | What deserves emphasis | Typical failure |
| --- | --- | --- |
| Marketing / studio / portfolio | Identity, message, relevant evidence, a clear next step, memorable composition | Spectacle that hides the work, vague copy, invented proof, repeated template sections |
| Working product / dashboard | Task hierarchy, useful density, scan paths, consistent states, speed | A large decorative header and spacious cards that push the work below the fold |
| Commerce / booking | Product truth, comparison, price and availability, trustworthy progression | Over-styled controls, hidden costs, uncertain selected states or next steps |
| Reading / knowledge | Type, measure, navigation, annotation, reading continuity | Decorative movement, low contrast, intrusive chrome, broken deep links |
| Mobile / native app | Platform expectations, reachability, navigation, safe areas, text scaling, interruption recovery | Desktop hover concepts, bespoke controls that lose expected behavior, unusable keyboard states |
| Immersive / experimental | A coherent world, discoverability, responsive input, clear entry/exit, graceful fallback | A beautiful loading screen, inaccessible content, uncontrolled motion or performance cost |

## Product interfaces

Start from the primary task, not the app shell. Map what someone needs to compare, edit, or act on together. Design tables for comparison, lists for scanning, and cards for independent objects. Group commands by consequence and frequency. Keep filters and selection state visible enough to explain the current view.

Include realistic data and at least the states the task depends on: loading, no data, no search results, partial data, error/retry, success, and relevant permissions. A polished empty screenshot does not demonstrate a working product. Do not invent additional backend behavior simply to fill a visual concept.

## Mobile and native

Preserve platform navigation and interaction conventions unless the brief has a clear reason to depart. Use native components and semantic controls where they fit. Establish how back navigation, keyboard appearance, scrolling, safe areas, text enlargement, and orientation affect the screen. Translate the art direction through type, color, imagery, and proportion rather than copying a desktop composition.

Keep primary actions reachable and targets comfortably usable; distinguish platform units from CSS pixels. For the web, WCAG 2.2's target-size minimum has a 24×24 CSS pixel criterion with exceptions, not a blanket rule that every target must be 44 pixels. Larger touch targets often improve comfort. Verify the actual platform and context rather than treating one number as universal. [W3C target guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

For platform-specific work, consult current [Apple HIG](https://developer.apple.com/design/human-interface-guidelines) or [Material guidance](https://m3.material.io/) when available. Those resources are optional implementation references, not bundled or audited platform specifications.

## Immersive work

Make the interaction vocabulary discoverable. Decide how input, orientation, progression, and exit are communicated. Essential information should have a usable conventional route when an experimental scene cannot run. A scene can be the main experience when that is the assignment; it still needs loading, failure, reduced-motion, and constrained-device behavior.

Choose the lightest implementation that achieves the effect: CSS/SVG for simple graphics, canvas for dense procedural drawing, GPU rendering when a scene actually requires it. Do not install a 3D stack to solve a composition problem. Report performance measurements only from the environments actually tested.
