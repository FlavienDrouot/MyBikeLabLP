# TASK-003 — Replace placeholder favicon with MyBikeLab brand icon

## Objective

Replace the content of `frontend/public/favicon.svg` with the MyBikeLab logo-mark SVG so that the browser tab displays the brand icon instead of the current placeholder. No changes to `index.html` or any other file.

## Required context

**Current state of `index.html`** (`frontend/index.html`, line 6):
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```
This declaration is correct. The `href="/favicon.svg"` is an absolute path from the origin root, which is standard and not affected by Vite's base path (`/MyBikeLabLP/`). No change to `index.html` is needed.

**Current content of `frontend/public/favicon.svg`**: a generic purple bolt icon (not the MyBikeLab brand). This file must be replaced.

**Brand icon source**: `frontend/src/assets/logo-mark.svg`. This is the MyBikeLab "M" mark — a square outline with four tick marks on the edges and an "M" path using square-cap strokes. It uses `currentColor` for all strokes (no hardcoded fill).

**Problem with `currentColor`**: SVG favicons render outside any CSS context. `currentColor` defaults to `black` in that context, but relying on this implicit behavior is fragile. The task is to replace `currentColor` with the explicit value `#0e0f0c` (the `--ink-12` near-black design token) so the icon renders as a sharp, intentional near-black mark.

**Required content of `frontend/public/favicon.svg`** — replace the file with the logo-mark SVG, substituting every occurrence of `currentColor` with `#0e0f0c`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none">
  <rect x="0.5" y="0.5" width="39" height="39" stroke="#0e0f0c" stroke-width="1"></rect>
  <line x1="20" y1="0" x2="20" y2="3" stroke="#0e0f0c" stroke-width="1"></line>
  <line x1="20" y1="37" x2="20" y2="40" stroke="#0e0f0c" stroke-width="1"></line>
  <line x1="0" y1="20" x2="3" y2="20" stroke="#0e0f0c" stroke-width="1"></line>
  <line x1="37" y1="20" x2="40" y2="20" stroke="#0e0f0c" stroke-width="1"></line>
  <path d="M 9 28 L 9 12 L 20 22 L 31 12 L 31 28" stroke="#0e0f0c" stroke-width="1.6" stroke-linecap="square" stroke-linejoin="miter"></path>
</svg>
```

This is identical to `src/assets/logo-mark.svg` with every `currentColor` replaced by `#0e0f0c`. No other attributes change.

**Note on `#0e0f0c`**: This value is the `--ink-12` design token (declared in `frontend/src/design-tokens.css`). It is the only acceptable raw hex value in this task, because it is used here in an SVG asset context where CSS custom properties are not available, and it maps exactly to an existing token.

## Potentially impacted files

- `frontend/public/favicon.svg` — file content replaced entirely

No other files are touched.

## Inputs

- `frontend/src/assets/logo-mark.svg` — source of the brand icon shape (read-only reference)
- `frontend/public/favicon.svg` — file to overwrite

## Expected outputs

`frontend/public/favicon.svg` contains the SVG content shown above in the Required context section — the logo-mark shape with all `currentColor` references replaced by `#0e0f0c`.

## Constraints

- Do not create any new files.
- Do not change `frontend/index.html`.
- Do not change `frontend/src/assets/logo-mark.svg`.
- The replacement SVG must be valid, self-contained, and contain no external references.
- The only raw hex value permitted is `#0e0f0c` — used because `var(--brass-8)` and similar CSS tokens are not available in a standalone SVG favicon context.
- Do not add a `width` or `height` attribute to the favicon SVG — `viewBox="0 0 40 40"` alone is correct for a scalable favicon.
- Do not add `<title>` or `<desc>` elements — they are not needed for a favicon.

## Dependencies

none

## Validation criteria

- [ ] Open the landing page in a modern browser (`npm run dev`). Confirm the browser tab shows the MyBikeLab "M" mark icon (square outline with M path) instead of the previous purple bolt icon or a browser default.
- [ ] Open `frontend/public/favicon.svg` in a text editor or SVG viewer. Confirm it contains the logo-mark shape and no `currentColor` references remain.
- [ ] Confirm `frontend/index.html` is unchanged — the `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />` line must be identical to its pre-task state.
- [ ] Confirm `frontend/src/assets/logo-mark.svg` is unchanged.
- [ ] Hard-refresh the browser (`Ctrl+Shift+R`) if the previous favicon is still cached during testing.
- [ ] Visually confirm the favicon is legible at small tab sizes (16×16 px effective rendering). The square outline and M path should be recognizable.

## Tests to implement

### Unit
None — asset replacement; no logic.

### Integration
None.
