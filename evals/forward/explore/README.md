# Riverside Print Room exploration

Open `index.html` directly in a browser. It is one self-contained file, works offline, and needs no installation or server.

Use the typography and color buttons independently to try all four combinations. Full and Narrow provide comparable reading sizes. Select or deselect the workshop session, enter an example email, and press Preview booking. The state buttons make an email error or ready state easy to compare across combinations. No booking is created, no email is sent, and the prototype stores no form data. The URL hash retains the current type, palette, and reading width on reload.

## Proposed options

| Choice | What changes | Tradeoff |
| --- | --- | --- |
| A · Utility sans | Sans serif wordmark and headings, matching the practical body and controls | Direct and familiar; less expressive contrast between headings and booking details |
| B · Studio serif | Georgia-led wordmark and headings; body and controls stay sans serif | Editorial and craft-oriented; different letterforms change rhythm and can change wrapping on other operating systems |
| 1 · Paper & moss | Warm paper surfaces, deep green actions, pale green selection | Tactile print-room tone; warmer surfaces feel less neutral |
| 2 · Chalk & cobalt | Cool pale surfaces, blue actions, pale blue selection | Crisp and instructional; the brighter action pulls more visual attention |

All options are agent proposals. No winner has been selected or integrated. The starting A + 1 position is only an initial state.

## Held comparable

The actual project name, headline, description, date, time, price, and availability from `brief.json` are preserved. Content, layout rules, dimensions, spacing, body typography, and interaction state remain the same when changing a palette. Changing typography affects the wordmark and headings only, with identical font sizes, line heights, and layout constraints. Natural differences in font metrics remain visible. No additional workshop sessions or seat inventory have been invented.

Both options use installed system font stacks. No font files or other assets are fetched:

- Sans/body/control stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif`
- Serif heading stack: `Georgia, "Times New Roman", ui-serif, serif`

The browser and operating system determine the available face. Chromium reported both Arial and Georgia available and used the declared stacks in this environment. No claim is made about identical rendering on every operating system.

## Semantic palette values

| Role | Paper & moss | Chalk & cobalt |
| --- | --- | --- |
| Canvas | `#f4f0e7` | `#f1f3f8` |
| Surface | `#fffcf5` | `#ffffff` |
| Text | `#242d28` | `#202b43` |
| Muted text / input boundary | `#596258` | `#586278` |
| Decorative divider | `#b4b6a7` | `#abb3c7` |
| Action / focus / selected boundary | `#244f47` | `#294cb9` |
| Hover action | `#173e36` | `#1d3690` |
| Text on action | `#ffffff` | `#ffffff` |
| Selected surface | `#e3eadd` | `#e5eafb` |
| Error text / boundary | `#a02f28` | `#a02c49` |
| Error surface | `#fff0e8` | `#fff0f4` |

Selection includes a checkmark and text. Errors include explicit error text and an invalid-field state. Form controls have visible keyboard focus.

## Verification performed

`verify.mjs` exercised the local `file://` page in headless Chromium with an offline browser context. It passed 64 assertions:

- All four combinations rendered at full size and a 390px specimen width; all eight screenshots were visually inspected.
- Every combination passed page-overflow checks at viewport widths 320, 375, 390, and 768px, plus the 1440px desktop checks.
- Actual headline and description were checked against the supplied content.
- Session selection/deselection, missing-session handling, empty/malformed email errors, valid local preview, and reset were exercised.
- Typography controls were operated with Tab and Enter; palette controls with Space. Active states and invalid-field accessibility attributes were checked.
- A mixed combination survived reload via its URL hash.
- Declared font stacks and browser font availability were inspected.
- Calculated text contrast for canvas, surface, selected, action, hover, and error roles was at least **5.51:1**. Focus color pairings exceeded **3:1**. This is a focused role check, not a full accessibility audit.
- No JavaScript page errors and no non-file network requests were observed.

See `validation.json` for the actual checks, font results, and contrast measurements. `screenshots/start.png` shows the initial view; the other eight screenshots capture every type/palette combination at full and narrow widths with the same email-error state.

Not tested: other browsers, physical devices, assistive technology, or any backend. The booking behavior is explicitly simulated. No production files were edited and nothing was published.

To repeat the browser checks in this workspace:

```sh
FORM_PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs node evals/forward/explore/verify.mjs
```
