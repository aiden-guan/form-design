Original evaluator handoff. It describes its isolated workspace and self-reported checks; standardized captures and maintainer checks are published separately.

# Signal — local festival programme

Open `index.html` directly in a browser. Everything is bundled in the file, including original SVG artwork; no install, server, fonts, images, or network access are required.

The visual direction combines a condensed printed-poster wordmark, an off-centre sound ripple, electric yellow and orange with a quieter, aligned programme. On phones the artwork becomes a horizontal sound strip, and ticket details remain reachable beside the venue.

## Working behaviour
- All six supplied events and facts are preserved. Room filters include an All reset.
- Save/unsave updates every count and the My programme view. Both an empty programme and an empty room selection provide recovery actions.
- Selections persist in browser local storage on this device. If storage is unavailable, the page explains that the selection lasts only for the visit.
- Day-pass controls open a native modal with £28, the supplied date, hours and venue. The modal explicitly says checkout is unavailable and collects no payment information.

## Performed checks
One initial implementation, one rendered self-review/correction pass, then reinspection. The correction fixed time/artist collisions with enlarged text, allowed the view switch to reflow, removed decorative artwork labels from the small crop, and added the mobile day-pass control.

Playwright/Chromium checked 1440×1000, 390×844 and an intermediate 800×1000 viewport. All 42 checks in `checks.json` passed: every room filter, saving/unsaving all six events, actual saved selections, reload persistence, empty states and resets, mobile interactions, keyboard Enter/Space, native modal focus/closing/return, reduced motion, and horizontal overflow. No JavaScript errors or external requests were observed.

Programme time/title/filter/view text and ticket facts/action were separately doubled for a text-enlargement stress render. The programme remained within the mobile viewport with no time/title/save collisions. The enlarged ticket dialog scrolls, and its return action remained reachable and operable (`supplementary-checks.json`). This was a targeted text stress check, not a complete browser-zoom or accessibility audit.

Solid text/background pairs measured 14.14:1 (ink/paper), 6.17:1 (muted/paper), 13.21:1 (ink/yellow), and 5.67:1 (ink/orange). Visible keyboard focus was operated and captured.

## Captures
- `desktop.png`, `desktop-full.png`: 1440×1000 viewport and complete page.
- `mobile.png`, `mobile-full.png`, `mobile-programme.png`: 390×844 viewport, complete page and programme.
- `saved-programme.png`, `empty-programme.png`: actual saved and empty states.
- `day-pass.png`, `mobile-day-pass.png`: ticket detail modal.
- `intermediate.png`, `keyboard-focus.png`: responsive transition and focus state.
- `text-stress.png`, `ticket-text-stress.png`, `ticket-text-stress-action.png`: enlarged text and reachable action.

## Remaining limits
Fictional offline demo; checkout, accounts, syncing, live festival information and external integrations are absent. Verification used desktop Chromium emulation, not physical phones or a browser matrix. System-font rendering and local-storage handling can vary by browser and privacy mode. No full assistive-technology or WCAG conformance audit was performed.
