Original evaluator handoff. It describes its isolated workspace and self-reported checks; standardized captures and maintainer checks are published separately.

# Dispatch — loan desk

Open `index.html` directly in a modern browser. The app is self-contained and runs offline, with system fonts and original inline SVG icons. No installation or server is needed.

The direction is a compact lending ledger: approved navy, blue and cool off-white; aligned desktop columns for fast comparison; complete stacked records on mobile; and a focused detail panel for returns. All six supplied loan facts are preserved. Counts are calculated from those records.

Working actions: search by borrower, equipment or loan ID; combine search with status; clear/reset; open details; mark returned locally; and undo the latest return. Return state persists in browser storage. The app clearly labels fictional, local-only behavior.

## Performed checks

- Rendered and inspected at 1440×1000 and 390×844, plus 900×1000. Mobile keeps loan ID, person, full equipment, due time and status available.
- Exercised person/item/ID search, combined filters, empty/reset, detail open/close, return, updated row and counts, changed status membership, reload persistence, and undo from both list and details. Also exercised the return/filter/undo path on mobile.
- Checked keyboard search shortcut, focus wrap in both directions, Escape, and focus restoration. Checked a reduced-motion preference.
- Compared every original loan fact against the read-only brief. Captured a 150% text enlargement stress render and checked long labels and adjacent controls.
- No browser runtime errors or external network requests during the checks. Nine relevant text/action/status contrast spot checks exceeded 4.5:1; results are in `checks.json`.

One implementation and one rendered correction pass were completed. Corrections added predictable dialog focus wrapping, restored focus after undo, and strengthened secondary-text contrast.

## Screenshots and evidence

- `desktop.png`, `mobile.png`, `mobile-full.png`: final default views.
- `desktop-detail.png`, `mobile-detail.png`: full long equipment and borrower labels.
- `mobile-returned.png`, `returned-list.png`: successful local return and updated records/counts.
- `empty-state.png`, `intermediate.png`, `enlarged-text.png`: empty/reset, intermediate reflow and enlarged text.
- `checks.json`: performed checks and contrast results. `checks.mjs` and `capture.mjs` reproduce the verification with the supplied local Playwright installation.

## Remaining limits

Verified in automated Chromium. Safari, Firefox, physical touch devices and screen readers were not tested. The text stress check is CSS text enlargement, not actual browser zoom, and the contrast spot checks are not a complete accessibility audit. This fictional app has no live inventory, identity or synchronization; marking a return does not verify physical equipment.
