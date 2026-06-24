# TASK-005 — Replace Navbar hardcoded logo with logo-wordmark.svg asset

## Objective

Replace the Navbar's current hardcoded logo markup (a brass `div` with the letter "M" and a styled `span` for the brand name) with an `<img>` element that imports and renders `logo-wordmark.svg` from the design system assets.

## Required context

### Current state

File: `frontend/src/components/Navbar.jsx`

The logo area (lines 13–20):
```jsx
<a href="#top" className="flex items-center gap-2">
  <div className="grid h-8 w-8 place-items-center rounded-xs bg-brass-7 text-ink-12 font-bold">
    M
  </div>
  <span className="text-lg font-semibold tracking-tight">
    My<span className="text-brass-8">Bike</span>Lab
  </span>
</a>
```

This is hardcoded markup. The PRD (FR-005) requires it to be replaced by the `logo-wordmark.svg` asset.

### Asset location

- Source asset: `MyBikeLab/design-system/assets/logo-wordmark.svg`
- Component location: `MyBikeLab/frontend/src/components/Navbar.jsx`
- Relative import path from `Navbar.jsx`: `../../../design-system/assets/logo-wordmark.svg`

(Path reasoning: `Navbar.jsx` is at `frontend/src/components/`. Going up three levels reaches `MyBikeLab/`, then `design-system/assets/` is a sibling to `frontend/`.)

### Vite asset import

Vite handles static asset imports outside `src/` as long as the import is resolvable from the project root. The import:
```js
import logoWordmark from '../../../design-system/assets/logo-wordmark.svg';
```
will be resolved at build time, producing a hashed URL string (e.g., `/MyBikeLabLP/assets/logo-wordmark-abc123.svg`). This URL is then used as the `src` of an `<img>` tag.

### Required change

1. Add the import at the top of `Navbar.jsx` (after existing imports):
   ```js
   import logoWordmark from '../../../design-system/assets/logo-wordmark.svg';
   ```

2. Replace the `<div>` + `<span>` logo markup inside the `<a href="#top">` element with:
   ```jsx
   <img src={logoWordmark} alt="MyBikeLab" className="h-8 w-auto" />
   ```

The `<a>` element itself (`href="#top"`, `flex items-center gap-2`) remains unchanged except that its children are replaced.

### Sizing

- `h-8` = 32px height — matches the current brass mark box height (`h-8 w-8`).
- `w-auto` — preserves the SVG's natural aspect ratio.
- If `logo-wordmark.svg` is designed to be taller or shorter than 32px, the implementation agent should adjust `h-8` after visual inspection. The `h-8` is a recommended starting point.

### Navbar scroll behavior

The Navbar header has `sticky top-0 z-40` and `bg-paper-1/88 backdrop-blur`. These classes are on the `<header>` element, not on the logo, and must not be changed. This task only modifies the logo area inside the `<a>` link.

### Test context

In Vitest node tests, the import `logoWordmark` resolves to `''` (via `fileMock.js`). The test for AC-005 (in TASK-005's test suite) should assert that the Navbar renders an `<img>` element whose `src` attribute is derived from the imported variable — not that it equals a specific path string. Since the mock returns `''`, the assertion should check that the component contains an `<img>` element (i.e., uses the SVG import pattern rather than hardcoded text), or it should mock the import differently. See the Tests section below.

## Potentially impacted files

- `frontend/src/components/Navbar.jsx` — import addition + logo markup replacement
- `frontend/src/components/__tests__/Navbar.test.jsx` (new file) — automated test for AC-005

## Inputs

- `frontend/src/components/Navbar.jsx` (current source — read before acting)
- `MyBikeLab/design-system/assets/logo-wordmark.svg` (do not modify; verify it exists)

## Expected outputs

1. `Navbar.jsx` modified: import added, hardcoded logo markup replaced with `<img src={logoWordmark} alt="MyBikeLab" className="h-8 w-auto" />`.
2. New test file at `frontend/src/components/__tests__/Navbar.test.jsx` asserting AC-005.

## Constraints

- Do not modify `logo-wordmark.svg`.
- Do not copy the SVG to `frontend/public/`. Use a module import only.
- The `<a href="#top">` wrapper and its class `flex items-center gap-2` must remain.
- The Navbar's layout, navigation links, mobile menu, and backdrop-blur behavior must be unaffected.
- The `alt` attribute must be `"MyBikeLab"` (the brand name, for screen readers).
- Do not hardcode a `width` attribute on the `<img>` — use `w-auto` via Tailwind.

## Dependencies

none

## Validation criteria

- [ ] `Navbar.jsx` imports `logoWordmark` from `'../../../design-system/assets/logo-wordmark.svg'`
- [ ] The `<a href="#top">` element's only child is `<img src={logoWordmark} alt="MyBikeLab" className="h-8 w-auto" />`
- [ ] No `<div>` with letter "M" or `<span>` with "MyBikeLab" text remains inside the logo link
- [ ] Visual inspection: the Navbar logo renders correctly (wordmark visible, correct size, no broken image)
- [ ] Navbar sticky behavior, backdrop blur, and mobile menu are unaffected
- [ ] `npm run build` completes without errors (Vite resolves the import)
- [ ] `npm run test` passes with the new test

## Tests to implement

### Unit

Test file: `frontend/src/components/__tests__/Navbar.test.jsx`

Strategy: render `<Navbar />` to a static HTML string using `react-dom/server`'s `renderToStaticMarkup`. In the test environment, `logoWordmark` resolves to `''` (fileMock). Assert:
- The rendered HTML contains an `<img` element
- The rendered HTML does not contain the text `>M<` (the hardcoded letter mark)
- The rendered HTML does not contain `My<span` (the hardcoded wordmark span structure)

Note: `renderToStaticMarkup` requires a Redux `Provider` because Navbar uses no Redux state. Navbar does not use Redux, so no Provider is needed. Navbar does use `useState` (for mobile menu), which works in `react-dom/server`.

Example test skeleton:
```js
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import Navbar from '../Navbar';

describe('Navbar', () => {
  it('renders logo as an img element (not hardcoded markup)', () => {
    const html = renderToStaticMarkup(<Navbar />);
    expect(html).toContain('<img');
    expect(html).not.toContain('>M<');
  });
});
```

### Integration

- Manual: load `npm run dev`, confirm the Navbar logo renders as the wordmark SVG. Verify at mobile and desktop breakpoints.
