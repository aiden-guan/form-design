Original evaluator handoff. It describes its isolated workspace and self-reported checks; standardized captures and maintainer checks are published separately.

# Margin

Open `index.html` directly in a browser. It is a complete offline app: all CSS, JavaScript, icons, and four original SVG book covers are inline. No install, server, external assets, fonts, or network access is needed.

## Direction
A small, warm bookshop translated into a personal shelf: paper cream, dark green ink, Georgia display type, and covers with individual compositions. Desktop presents four books together; mobile becomes a touch-friendly list with search and state filters above it. The currently-reading shortcut is useful additional context on wide screens.

Only the supplied fictional books, authors, descriptions, kinds, and page counts are used. The product identifies its demo content. Changes save in browser localStorage, with an honest session-only fallback when unavailable.

## Performed checks
One initial implementation followed by one rendered review/correction pass. That pass tightened mobile spacing, fixed 320px filter overflow, added explicit dialog keyboard wrapping and robust focus recovery, and put save feedback inside the dialog.

Playwright/Chromium checks passed for:
- All four book details and supplied content; title/author search, including mixed case.
- Combined state filtering and search, zero results, clear search, and reset.
- All three state changes, live shelf/count updates, and persistence after reload.
- Visible close and Escape; focus restoration, modal Tab wrapping, and recovery when the opened book leaves the active filter.
- Mobile operation with the longest title; page/dialog overflow at 320, 390, 760, 820, and 1440 CSS pixels.
- Reduced-motion transition removal, zero browser script errors, and zero external requests.

Primary ink/paper contrast: 10.40:1. Muted text/paper: 4.80:1. These are spot checks, not a full accessibility audit.

## Evidence
`desktop.png` is an actual 1440×1000 viewport capture; `mobile.png` is 390×844. `desktop-full.png` and `mobile-full.png` capture complete pages. Additional actual captures: `desktop-detail.png`, `mobile-detail.png`, `mobile-state-changed.png`, and `mobile-empty.png`. The `initial-*.png` images record the first render before corrections.

`checks.json` records outcomes. Re-run with `rtk proxy node verify.mjs` in this folder; the script uses the supplied local Playwright installation.

## Remaining limits
Checked in headless Chromium; Safari, Firefox, physical phones, screen readers, OS text scaling, and forced-colors mode were not exercised. Storage behavior for local files depends on browser settings. No accounts, syncing, external catalogue, ratings, reviews, or availability are implied.
