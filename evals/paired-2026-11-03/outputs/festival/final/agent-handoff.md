Evaluator self-report from its temporary workspace. Shared captures and task/style checks are recorded separately.

# Signal festival handoff

Open `index.html` directly in a browser. It runs offline with no installation, external fonts, images or network services. `signal-waves.svg` is original artwork; typography uses system sans-serif stacks.

The visual direction is a sound poster: oversized type and a vermilion wave field lead into a time-led programme. Desktop uses aligned comparison columns; mobile groups each set with a separate, reachable save control.

## Completed behavior

- All six supplied events and festival facts are preserved.
- Room filters include All reset and work in both programme views.
- Save/unsave, live count, chronological My programme, empty states and recovery are functional.
- Selections persist in browser local storage. If storage is unavailable, in-memory saving works and the limitation is shown.
- Day pass opens a native modal with the supplied £28 price, date, hours and location. It explicitly states that checkout and reservations are unavailable in this local demo.

## Performed checks

One initial implementation and one rendered self-review/correction pass. The review corrected mobile artwork/type overlap and replaced constrained mobile schedule columns with a layout that reflows under enlarged text.

Playwright Chromium checks passed at **1440×1000** and **390×844**, plus an **800×1000** intermediate render. Operated every room filter, saved and unsaved every event, verified actual saved selection/order/count, reload persistence, both empty states, and storage failure fallback. Operated ticket opening by keyboard, initial focus, blocked background focus, Escape, close button and focus return. Reduced-motion scroll behavior was checked. No page errors or external requests were observed.

A doubled-text stress render at 390px had no page overflow or collisions among schedule items. Sample solid-color contrast ratios: ink/paper 15.64:1, ink/vermilion 4.79:1, secondary text/paper 6.18:1. These targeted checks are not a complete accessibility audit.

## Evidence

- `desktop.png`, `mobile.png`: final requested viewport captures.
- `desktop-full.png`, `mobile-full.png`: final full-page captures.
- `desktop-saved.png`, `mobile-saved.png`: actual three-set saved selection.
- `mobile-empty.png`: empty My programme.
- `desktop-ticket.png`, `mobile-ticket.png`: day pass modal.
- `intermediate.png`: intermediate layout.
- `mobile-enlarged.png`, `mobile-enlarged-programme.png`: text stress renders.
- `checks.json`: final results; `checks.mjs`: repeatable checks using the supplied local Playwright installation.
- `review-*-initial.png`: initial review evidence, before corrections.

## Remaining limits

Fictional local demo only; no ticket service or payment flow. Persistence is per browser/origin and may be removed by browser storage settings. Verification used headless Chromium, not physical phones, other browser engines or screen readers. Doubled text was a CSS stress test, not a full browser zoom audit. Nothing was published.
