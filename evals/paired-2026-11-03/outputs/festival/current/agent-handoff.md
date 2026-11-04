Original evaluator handoff. It describes its isolated workspace and self-reported checks; standardized captures and maintainer checks are published separately.

# Signal — handoff

Open `index.html` directly in a modern browser. No install, server, build, fonts, or network connection is required. Keep `signal-ripple.svg` beside it.

## Design and implementation

An acid-green sound poster leads into a quiet, chronological running order. Oversized system typography and the original procedural ripple SVG give the festival an identity; the programme uses consistent time, artist, room and save columns. Mobile recomposes the artwork, room filters and event information instead of shrinking the desktop layout.

All six supplied events and festival facts are included. Room filters have an All reset. Each event can be saved or removed, both saved counters reflect the actual selection, and My programme includes useful empty and filtered-empty states. Selection persists in localStorage; a visible fallback explains if browser storage is unavailable. The native day-pass dialog shows £28, the date, venue and hours, and explicitly says checkout is unavailable in this fictional demo.

## Performed checks

- One initial implementation followed by one rendered review and consolidated correction pass. Corrected the headline descender spacing, mobile filter layout, artwork-caption collision, and phone target sizes.
- Inspected actual Chromium screenshots at **1440×1000**, **390×844**, and an intermediate **900×1000**, including programme, saved and ticket states.
- `verify.mjs --final`: **30 assertions passed**. Covered every room filter/reset; save/unsave/counts; empty states; combined filters; reload persistence; header shortcut; keyboard tab navigation; dialog facts, close and Escape/focus return; mobile actions; 44px phone-control heights; overflow and reduced motion.
- No horizontal overflow at 390, 780, 900 or 1440 CSS pixels. No browser runtime errors or network requests.
- Solid-colour spot checks: muted text/paper **5.16:1**; ink/acid **13.54:1**. These are limited contrast checks, not a full accessibility audit.

## Evidence and limits

Final captures: `final-desktop-1440x1000.png`, `final-mobile-390x844.png`, `final-mobile-programme.png`, `final-mobile-saved.png`, `final-day-pass-desktop.png`, `final-day-pass-mobile.png`, full-page and empty-state captures. `final-checks.json` contains the check results. Initial captures are retained as review evidence.

JavaScript is required for programme interactions. Saves stay in this browser on this device and can be cleared by browser settings; no account or cross-device sync. Physical phones, Safari/Firefox, screen readers, forced colours and enlarged-text browser settings were not tested. Nothing was published, and no payment or backend integration exists.
