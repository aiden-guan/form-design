Original evaluator handoff. It describes its isolated workspace and self-reported checks; standardized captures and maintainer checks are published separately.

# Margin

Open `index.html` directly in a modern browser. No build, server, dependency install, fonts, or network connection is required. Keep the `assets/` folder beside it.

The direction is a small, warm bookshop: paper and ink-red interface colors, Georgia for book titles, four original SVG covers, and restrained physical book shadows. The wide shelf becomes a readable cover-and-title list on phones. The four supplied fictional books and their facts are preserved.

## Working behavior

- Case-insensitive title and author search, reading-state filters with live global counts, combined search/filter empty states, clear search, and reset.
- Every book opens in a native modal and can move between Want to read, Reading, and Finished. Shelf membership, badges, and counts update immediately.
- Reading states persist locally in the current browser when storage is available. The interface explains session-only behavior if storage is unavailable.
- Visible Close and Escape dismiss details. Focus returns to the book, or the active filter when a moved book leaves the current view. Native modal focus containment and visible keyboard focus are retained.

## Performed checks

Used Chromium via the supplied local Playwright installation with browser networking disabled. `checks.json` records 23 passing assertions. `verify.mjs` is the repeatable local verification script; its Playwright import uses the supplied machine-specific path.

Inspected actual renders at 1440×1000, 390×844, and 820×1000. Exercised every book and every state, persistence after reload, search by title and author, filtering, combined empty states, reset, keyboard Escape, visible Close, focus restoration, and Tab inside the modal. Observed zero external requests and zero browser runtime errors.

One initial implementation and one rendered review/correction pass were performed. Corrections grouped the mobile detail metadata and title coherently, allowed filters and footer copy to reflow, strengthened placeholder contrast, and prevented the longest title from clipping under enlarged text. A synthetic 200% text-size stress render confirmed mobile title/author separation and absence of horizontal overflow; this is not a browser-zoom or full accessibility audit. Tested the detail action with reduced motion. Spot-checked opaque text contrast: secondary text/paper 4.84:1; accent/paper 6.20:1.

## Screenshots

- `desktop.png` — 1440×1000 default shelf.
- `mobile.png` — 390×844 default shelf; `mobile-full.png` includes the full scroll.
- `detail-desktop.png` / `detail-mobile.png` — actual detail layouts, including the longest title on mobile.
- `empty-mobile.png` — search empty state with reset.
- `intermediate.png` — 820×1000 composition.
- `mobile-text-200.png` / `detail-mobile-text-200.png` — enlarged-text stress states.
- `*-initial.png` — first-render review evidence.

## Remaining limits

This is a frontend-only fictional collection with browser-local state; there is no account, synchronization, catalogue service, or external availability. Verified in desktop Chromium emulating the listed viewports. Physical touch devices, Safari/Firefox, screen readers, forced colors, and a full WCAG audit were not tested. All cover artwork is original SVG; typography uses system fonts.
