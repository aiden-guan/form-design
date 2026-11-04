const { chromium } = await import(process.env.FORM_PLAYWRIGHT_MODULE || 'playwright');
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
await mkdir(join(dir, 'screenshots'), { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--disable-background-networking'] });
const context = await browser.newContext({ viewport: { width: 1440, height: 1100 }, offline: true });
const page = await context.newPage();
const errors = [];
const requests = [];
page.on('pageerror', error => errors.push(error.message));
page.on('request', request => { if (!request.url().startsWith('file:')) requests.push(request.url()); });
await context.route('**/*', route => route.request().url().startsWith('file:') ? route.continue() : route.abort());
const checks = [];
function assert(condition, message) { if (!condition) throw new Error(message); checks.push(message); }
await page.goto(pathToFileURL(join(dir, 'index.html')).href);
await page.evaluate(() => document.fonts.ready);
assert(await page.title() === 'Riverside Print Room — type & color exploration', 'Local HTML opens with expected title');
assert(await page.locator('h1').textContent() === 'Make a two-color print.', 'Actual headline is preserved');
assert(await page.locator('.lede').textContent() === 'Learn to ink a plate, align two colors, and pull a small edition on a tabletop press. All materials are included.', 'Actual description is preserved');
const variants = [];
const contrast = [];
for (const type of ['sans', 'serif']) {
  for (const palette of ['moss', 'cobalt']) {
    await page.locator(`[data-type-choice="${type}"]`).click();
    await page.locator(`[data-palette-choice="${palette}"]`).click();
    await page.locator('#show-error').click();
    assert(await page.locator('#email-error').isVisible(), `${type}/${palette}: error state is visible`);
    assert(await page.locator('#email').getAttribute('aria-invalid') === 'true', `${type}/${palette}: email error is exposed to accessibility APIs`);
    await page.locator('#session-choice').click();
    assert(await page.locator('#session-choice').getAttribute('aria-pressed') === 'false', `${type}/${palette}: session can be deselected`);
    await page.locator('#session-choice').click();
    await page.locator('#email').fill('you@example.com');
    await page.locator('.primary').click();
    assert(await page.locator('#booking-result').isVisible(), `${type}/${palette}: valid local preview works`);
    assert(await page.locator('#email-error').isHidden(), `${type}/${palette}: valid email clears error`);
    await page.locator('#show-error').click();
    const metrics = await page.evaluate(() => {
      const root = document.querySelector('#specimen');
      const css = getComputedStyle(root);
      const heading = document.querySelector('h1');
      const rectangles = [...root.querySelectorAll('*')].filter(el => el.getClientRects().length).map(el => ({tag: el.tagName, rect: el.getBoundingClientRect()}));
      const rootRect = root.getBoundingClientRect();
      const overflow = rectangles.filter(({rect}) => rect.right > rootRect.right + 1 || rect.left < rootRect.left - 1).map(({tag}) => tag);
      const rgb = value => value.startsWith('#') ? value.match(/[a-f0-9]{2}/gi).map(x => parseInt(x, 16) / 255) : value.match(/[\d.]+/g).slice(0, 3).map(Number).map(x => x / 255);
      const luminance = value => rgb(value).map(x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4).reduce((sum, x, i) => sum + x * [.2126, .7152, .0722][i], 0);
      const ratio = (a, b) => { const x = luminance(a), y = luminance(b); return +((Math.max(x, y) + .05) / (Math.min(x, y) + .05)).toFixed(2); };
      const token = name => css.getPropertyValue('--' + name).trim();
      const pairs = [['text', 'canvas'], ['muted', 'canvas'], ['text', 'surface'], ['muted', 'surface'], ['on-action', 'action'], ['on-action', 'action-hover'], ['action', 'selected'], ['text', 'selected'], ['error', 'error-surface'], ['focus', 'surface'], ['focus', 'canvas']];
      return { headingFont: getComputedStyle(heading).fontFamily, bodyFont: getComputedStyle(document.querySelector('.lede')).fontFamily, fontSize: getComputedStyle(heading).fontSize, headingHeight: heading.getBoundingClientRect().height, overflow, systemFontChecks: {sans: document.fonts.check('16px Arial'), serif: document.fonts.check('16px Georgia')}, contrast: pairs.map(([fg, bg]) => ({fg, bg, ratio: ratio(token(fg), token(bg))})) };
    });
    assert(metrics.overflow.length === 0, `${type}/${palette}: full-width specimen has no horizontal overflow`);
    assert(metrics.contrast.every(pair => pair.ratio >= (pair.fg === 'focus' ? 3 : 4.5)), `${type}/${palette}: tested text and control-role contrasts pass their thresholds`);
    contrast.push({type, palette, pairs: metrics.contrast});
    await page.screenshot({ path: join(dir, 'screenshots', `${type}-${palette}-full.png`), fullPage: true });
    await page.locator('[data-width-choice="narrow"]').click();
    const narrow = await page.evaluate(() => { const root = document.querySelector('#specimen'); const r = root.getBoundingClientRect(); return {width: r.width, overflow: [...root.querySelectorAll('*')].filter(el => el.getClientRects().length).filter(el => { const b = el.getBoundingClientRect(); return b.right > r.right + 1 || b.left < r.left - 1; }).map(el => el.tagName)}; });
    assert(narrow.width === 390 && narrow.overflow.length === 0, `${type}/${palette}: 390px reading width has no horizontal overflow`);
    await page.locator('#specimen').screenshot({ path: join(dir, 'screenshots', `${type}-${palette}-narrow.png`) });
    await page.locator('[data-width-choice="wide"]').click();
    variants.push({type, palette, ...metrics, narrow});
  }
}
await page.locator('#reset-state').click();
await page.locator('#session-choice').click();
await page.locator('#email').fill('you@example.com');
await page.locator('.primary').click();
assert(await page.locator('#session-error').isVisible(), 'Missing session prevents preview with a text error');
assert(await page.locator('#session-choice').evaluate(el => el === document.activeElement), 'Missing session focuses its control');
await page.locator('#reset-state').click();
await page.locator('.primary').click();
assert(await page.locator('#email').evaluate(el => el === document.activeElement), 'Invalid email focuses the email field');
await page.locator('#email').fill('bad-email');
await page.locator('.primary').click();
assert(await page.locator('#email-error').isVisible(), 'Malformed email is rejected');
await page.locator('#reset-state').click();
assert(await page.locator('#email').inputValue() === '', 'Reset clears the email field');
assert(await page.locator('#booking-result').isHidden() && await page.locator('#email-error').isHidden(), 'Reset clears status and errors');
await page.locator('[data-type-choice="sans"]').focus();
await page.keyboard.press('Tab');
assert(await page.locator('[data-type-choice="serif"]').evaluate(el => el === document.activeElement), 'Typography controls are reachable by keyboard');
await page.keyboard.press('Enter');
assert(await page.locator('[data-type-choice="serif"]').getAttribute('aria-pressed') === 'true', 'Typography can be changed with Enter');
await page.locator('[data-palette-choice="cobalt"]').focus();
await page.keyboard.press('Space');
assert(await page.locator('[data-palette-choice="cobalt"]').getAttribute('aria-pressed') === 'true', 'Palette can be changed with Space');
const combinationHash = await page.evaluate(() => location.hash);
await page.locator('.preview-link').click();
assert(await page.evaluate(() => location.hash) === combinationHash, 'Workshop navigation preserves the current combination');
await page.reload();
assert(await page.locator('#specimen').getAttribute('data-type') === 'serif' && await page.locator('#specimen').getAttribute('data-palette') === 'cobalt', 'A mixed combination survives reload through the URL hash');
const mobile = [];
for (const width of [320, 375, 390, 768]) {
  await page.setViewportSize({width, height: 1000});
  for (const type of ['sans', 'serif']) for (const palette of ['moss', 'cobalt']) {
    await page.locator(`[data-type-choice="${type}"]`).click();
    await page.locator(`[data-palette-choice="${palette}"]`).click();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    assert(!overflow, `${type}/${palette}: no page overflow at ${width}px`);
    mobile.push({width, type, palette, overflow});
  }
}
await page.setViewportSize({width: 1440, height: 1100});
await page.locator('[data-type-choice="sans"]').click();
await page.locator('[data-palette-choice="moss"]').click();
await page.locator('#reset-state').click();
await page.screenshot({path: join(dir, 'screenshots', 'start.png'), fullPage: true});
assert(errors.length === 0, 'No JavaScript page errors');
assert(requests.length === 0, 'No HTTP or other non-file requests were made');
await writeFile(join(dir, 'validation.json'), JSON.stringify({environment: 'Local headless Chromium, file://, offline context', checks, variants, contrast, mobile, errors, nonFileRequests: requests}, null, 2));
console.log(JSON.stringify({passed: checks.length, combinations: variants.length, responsiveChecks: mobile.length, screenshots: 9, errors, nonFileRequests: requests, lowestTestedTextContrast: Math.min(...contrast.flatMap(x => x.pairs.filter(x => x.fg !== 'focus').map(x => x.ratio)))}, null, 2));
await browser.close();
