# Motion that makes the design better

Use this for animation, transitions, gestures, and animated art direction. A static result can be the strongest design decision.

## Decide whether it should move

Identify the job: confirm an action, maintain spatial continuity, reveal structure, explain a process, support direct manipulation, or create an occasional moment of delight. Consider frequency. A launch sequence and a command menu used hundreds of times a day need different pacing. Remove motion that delays work without explaining anything.

## Specify behavior before choosing a library

```text
Element and purpose:
Trigger / start state / end state:
Properties and spatial relationship:
Duration + easing OR spring behavior:
Repeat / reversal / interruption:
Keyboard and touch equivalents:
Reduced-motion and low-cost fallback:
```

Use a duration/easing transition for predictable finite feedback. Use a spring when velocity, interruption, or physical settling matters. A direct-manipulation object should respond during the gesture; thresholds can govern commitment without delaying all feedback. Preserve velocity and position when reversing where the technology permits it.

For small UI feedback, roughly 120–220 ms is a useful starting experiment; more substantial transitions might need longer, and repeated keyboard navigation may need no transition. These are FORM tuning suggestions, not requirements or quotes from a practitioner. Fit movement to distance, scale, and task. Review the actual motion, not only its parameter values.

Enter/exit direction and transform origin should explain where an object came from and where it returns. Keep travel proportional to the element. Sequence attention only when an order helps comprehension. Avoid long cascades that require someone to wait for content or controls to become usable.

## Make implementation match the intent

Use CSS transitions/keyframes for simple effects; reuse the existing motion system when appropriate. Prefer transform and opacity for frequent visual transitions where they achieve the effect, while measuring the actual rendering cost. Layout changes, clipping, filters, and shared-element transitions have different costs; do not promise they are free.

Keep continuous pointer or scroll updates out of unnecessary application rerenders. Pause decorative loops offscreen and when the page is hidden. Avoid competing animation engines controlling the same property. Reserve dimensions for media and prevent entrance effects from changing reading geometry unexpectedly.

For reduced motion, retain content, state, and action outcomes. Remove travel, parallax, looping, and scale where they are unnecessary; an instant state change or a restrained fade may preserve meaning. Do not merely shorten a large movement. Give essential drag interactions a usable non-drag route where needed.

## Review conditions

Exercise rapid repeat, reverse, cancel, pointer leave, keyboard navigation, touch, nested scrolling, and reduced motion as relevant. Check that focus and hit targets remain correct throughout. A motion preview proves only the observed states; it does not establish performance on all devices.

Research basis: [Emil Kowalski on purpose and frequency](https://emilkowal.ski/ui/you-dont-need-animations), [Rauno Freiberg on responsive gestures and spatial consistency](https://rauno.me/craft/interaction-design). FORM's implementation suggestions extend those ideas; they are not copied source code or universal prescriptions from the authors.
