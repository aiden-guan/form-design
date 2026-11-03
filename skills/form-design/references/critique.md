# Review the artifact, then correct it

Use this after building, during a redesign, or for a critique request. Do not assign a decorative quality score without evidence.

## Inspect in descending order of consequence

| Lens | What to look at | Evidence to use |
| --- | --- | --- |
| Purpose | The first visible message, primary task, and next action | Actual initial view and task path |
| Composition | Focal point, balance, alignment, rhythm, mobile transformation | Wide/narrow renders and whole-page view |
| Typography | Hierarchy, wraps, measure, reading comfort, actual font loading | Real content at reading size and enlarged text |
| Visual identity | Choices tied to the subject; coherent type, imagery, material | Relationship to the brief and inspected references |
| Interaction | Affordances, feedback, correct outcomes, loading and failure | Operated controls and relevant state captures |
| Inclusion | Contrast, focus, reading order, touch, reduced motion | Measurements and keyboard/touch checks as available |
| Technical fit | Stable layout, appropriate assets and rendering cost | Existing checks, observed runtime, measured traces if needed |

Separate a subjective judgment (“the crop weakens the focal point”) from a demonstrable failure (“the image covers the action at this width”). Both can matter; evidence should fit the claim.

For each material issue record **where → observation → consequence → specific correction**. Prefer “the label has the same contrast as the value, so the account balance is difficult to scan; lower the label emphasis and align amounts” over “improve hierarchy.”

## A useful review pass

1. Inspect the actual artifact and identify the few problems with the largest effect on the task or composition.
2. Correct those relationships together, preserving the visual direction and existing functionality.
3. Reinspect the affected views and states. Check that the correction did not create a new narrow-screen, content, or focus problem.
4. Stop when the requested scope is complete and material problems are resolved. Avoid endless polishing or unrelated redesign.

Representative checks: primary action; keyboard focus and order; open/close and Escape for relevant overlays; hover-independent access; loading/empty/error states; long content; narrow viewport and intermediate wrap point; zoom or enlarged text; reduced motion; missing/slow imagery. Select checks that match the artifact rather than claiming a comprehensive audit.

For faithful matching, align viewport, DPR, crop, loaded fonts, content, and interaction state. Compare proportion and position before microdetails. A pixel difference concerns a capture, not every state or overall usability.

If tooling is unavailable, make a useful artifact-level review and label unverified items. Do not report “visually verified,” “accessible,” “fast,” or “pixel perfect” solely because code compiles.
