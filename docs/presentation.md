# Presentation evidence and capture specification

The README hero is a code-generated graphic containing three real results from the bundled search tool. It is a condensed presentation of CLI output, not a screenshot of a website produced by the skill.

## Reproduce the evidence

From the repository root, with Python 3 and Node.js 18+:

```sh
python3 scripts/generate-presentation.py
python3 scripts/generate-presentation.py --check
```

The generator executes:

```sh
node skills/form-design/scripts/search.mjs "retro texture but not glass" --limit 3
```

| File | Purpose |
| --- | --- |
| [search-demo.json](assets/search-demo.json) | Full JSON response from the real command, without terminal decoration or invented fields. |
| [hero.svg](assets/hero.svg) | 1600×800 vector graphic; projects title, creator, and recorded rights from those results. |
| [social-preview.svg](assets/social-preview.svg) | 1280×640 brand graphic using the snapshot's actual reference count. |
| [social-preview.png](assets/social-preview.png) | Raster copy prepared for optional GitHub social-preview upload. |

The generator uses Python's standard library and invokes Node for the actual search. It has no renderer or font-download dependency. SVG text uses system font fallbacks, so glyph metrics can differ slightly between viewers. `--check` checks SVGs and JSON; it does not re-render the PNG.

## Optional social-preview capture

GitHub's social-preview setting is separate from committing an image. The PNG can be uploaded in the repository's social-preview settings; preparing it does not configure that setting.

To reproduce the raster capture with a browser:

1. Open the local `docs/assets/social-preview.svg` file directly in a browser or serve that folder over local HTTP.
2. Set a **1280×640 CSS pixel viewport**, **device scale factor 1**, browser zoom **100%**, and no page margin. Wait for fonts to settle.
3. Capture only the SVG/page content, excluding browser and OS chrome, to `docs/assets/social-preview.png`.
4. Confirm the result is **1280×640 pixels**, below **1 MB**, with the title and footer inside the 64-pixel safe area.

For a retina README raster, use `hero.svg`, a 1600×800 viewport at device scale factor 1, and save to a chosen PNG path. The README already uses the vector original, so this extra capture is optional.

## Future design-output demonstrations

The repository has no completed comparative model evaluation. A future example should retain the exact brief, model/host, permitted input assets, generated source, reproduction commands, and unedited captures of the result. Label a mockup as a mockup and separate visual judgment from measured task behavior. Use the [evaluation scenarios](../evals/form-design.md) to choose a concrete workflow.
