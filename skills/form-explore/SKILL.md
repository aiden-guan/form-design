---
name: form-explore
description: Create and compare visual directions, typography, or color alternatives using the same real content and task states. Use when a user wants design options, help choosing fonts/colors, a reference-based direction, or a mix of selected variants. Produce inspectable alternatives and carry the user's selections into a coherent system.
license: See LICENSE.txt and NOTICE.md
metadata:
  version: "1.1.0"
---

# FORM Explore

Make visual decisions easier by showing meaningful alternatives under comparable conditions. The output is a useful choice and its consequences, not a large moodboard or a collection of near-identical themes.

This skill works independently of other FORM skills, paid services, or a particular framework. Use the host's available design, rendering, and prototyping tools. Image generation is optional; an image comp is a proposal, not evidence of a working interface.

## Frame the decision

Inspect the brief, existing project, approved references, real content, target surface, and relevant states. Preserve established facts, behavior, user-selected choices, and constraints. State the unresolved question in terms someone can answer by looking or operating: type tone, color roles, composition, information density, image treatment, or interaction.

Match the exploration to the request:

| User wants | Vary | Hold comparable |
| --- | --- | --- |
| Fonts | Candidate families/role combinations and necessary metrics | Content, layout, imagery, color, viewport |
| Colors | Semantic surface/text/action/state palettes | Typography, content, geometry, state |
| Full directions | Composition, typographic relationships, image language, and appropriate behavior | Facts, audience, required functionality, completeness, viewport/state |
| A local component | The named design question in its real surrounding context | Neighboring content, task, platform, relevant states |
| A mix of selected options | The requested combination | The selections themselves and the product constraints |

Read [comparison-method.md](references/comparison-method.md) for practical specimens, variables, and handoff criteria. If the user has supplied a reference, identify what they like and what can be observed. Distinguish appearance from uninspected behavior. Do not assume the goal is a clone unless requested.

## Build a useful comparison

Choose a small set that answers the question; two or three are often enough when no count is specified. Do not pad a narrow decision with weak alternatives. Name directions descriptively and state how each serves the audience and what it costs.

For whole-concept exploration, differences should affect composition or visual language. For a requested font/color comparison, controlled local differences are the point—do not force a new layout just to create divergence. Use the actual headline, paragraph, navigation, long content, and relevant states rather than placeholder marketing copy.

For prototypes, keep exploratory work in a suitable isolated surface unless the task explicitly authorizes direct integration. Use the existing stack when it matters; a standalone HTML prototype can be sufficient when there is no project. Do not build a special picker framework if existing tabs, routes, files, or design frames make the comparison clear.

For a font/color-only comparison without an existing surface, the optional [comparison-lab.html](assets/comparison-lab.html) is a self-contained starting point. Copy it to an appropriate project-local prototype, replace its fictional specimen, system-font stacks, and example palettes with the actual candidates, and open it in a browser. It varies type and palette independently and exports proposal data. It is not a whole-site template, a source of user approval, or a substitute for verifying real project fonts and states.

Let the user compare each version at an equivalent full reading size and narrow layout, not only as small thumbnails. Use neutral comparison controls with clear active state, keyboard access, and no distracting switching animation. A palette variation is not done until text, action, selected, and error roles can be judged together.

## Verify before presenting

Inspect every alternative when rendering is available and exercise the relevant local interactions. Check loaded fonts, wrapping, long content, state differences, and narrow layout. Correct incomplete variants rather than making one option win by being more finished. Clearly label unavailable assets, simulated data, or disconnected integrations.

If rendering is unavailable, provide the best permitted inspectable artifacts and state the checks still needed. Do not claim a live prototype from screenshots or call an unrendered comparison validated.

## Select, combine, and carry forward

If the task asks for options to choose from, provide the comparison and a short tradeoff explanation, then wait for the choice before integrating it. If the user already asked you to choose and build, select with a reason and continue. Existing authorization applies; exploration does not introduce a mandatory approval gate.

When a user mixes a font from one direction with another palette, implement and inspect that combination. Recheck role contrast, type weight, wrap, density, and interaction feedback. Preserve the selections and explain any small adjustment needed to make them work together.

Use the project's existing design-context document or a concise project-local decision note when a durable handoff is useful. Mark user-selected, agent-proposed, and unresolved choices distinctly. Record type roles/font availability, semantic color values, composition/image rules, important states, and checked conditions. Implement through existing tokens/components where possible. Do not delete useful exploration artifacts without a reason or a user request.

Deliver the requested artifacts and explain what decision they enable. Recommendations should come from the audience, content, and use conditions, not the agent's favorite style.
