# Attribution and provenance

Lot Map for Hermes is an independent community adaptation, not an official Nous Research plugin or the original author's Hermes release.

The SVG/braille renderers and their geometry, icons, palettes and localization are from **Aleksei Volodin's alexeyw/lot-map**, MIT licensed, v0.13.0, commit `5c5833d7380976fda671975d32fcec9c1bc3ef79`.
Source: https://github.com/alexeyw/lot-map
Copyright (c) 2026 Aleksei Volodin. The original notice is preserved in `LICENSE.upstream` and `LICENSE`.

`vendor/lot-map/` preserves the renderer's TypeScript dependency closure. `src/svg-renderer.js` and `src/braille-renderer.js` are readable esbuild IIFE bundles (not minified). `src/desktop-adapter.js`, `src/tui-adapter.mjs` and the Python observer are the Hermes integration. No upstream Claude runtime hooks run in Hermes.

Rebuild distribution: `python scripts/build.py` (offline, standard library only).
Regenerate renderers from vendored source with a reviewed esbuild installation:
```
esbuild src/svg-entry.ts --bundle --format=iife --global-name=LotMapOriginal --platform=browser --target=es2022 --outfile=src/svg-renderer.js
esbuild src/braille-entry.ts --bundle --format=iife --global-name=LotMapBraille --platform=browser --target=es2022 --outfile=src/braille-renderer.js
python scripts/build.py
```
An esbuild installation is developer-only, not a runtime dependency. Review generated bundle differences before publishing.
