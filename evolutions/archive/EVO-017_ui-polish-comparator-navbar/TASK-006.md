# TASK-006 — Replace Footer hardcoded logo with logo-mark.svg asset

## Objective

Replace the Footer's current hardcoded logo markup (a brass `div` with the letter "M") with an `<img>` element that imports and renders `logo-mark.svg` from the design system assets.

## Required context

### Current state

File: `frontend/src/components/Footer.jsx`

The logo area (lines 6–9):
```jsx
<div className="flex items-center gap-2">
  <div className="grid h-7 w-7 place-items-center rounded-xs bg-brass-7 text-ink-12 text-xs font-bold">
    M
  </div>
  <span className="text-sm text-paper-2">
    © {new Date().getFullYear()} MyBikeLab. All rights reserved.
  </span>
</div>
```

The `<div>` with letter "M" is hardcoded markup. The PRD (FR-006) requires it to be replaced by the `logo-mark.svg` asset. The copyright `<span>` that follows the logo mark must remain — only the logo `<div>` is replaced.

### Asset location

- Source asset: `MyBikeLab/design-system/assets/logo-mark.svg`
- Component location: `MyBikeLab/frontend/src/components/Footer.jsx`
- Relative import path from `Footer.jsx`: `../../../design-system/assets/logo-mark.svg`

(Same path depth as Navbar: `Footer.jsx` is at `frontend/src/components/`, three levels up reaches `MyBikeLab/`.)

### Vite asset import

Same mechanism as TASK-005. The import:
```js
import logoMark from '../../../design-system/assets/logo-mark.svg';
```
resolves at build time to a hashed URL string.

### Required change

1. Add the import at the top of `Footer.jsx`:
   ```js
   import logoMark from '../../../design-system/assets/logo-mark.svg';
   ```

2. Replace the `<div className="grid h-7 w-7 place-items-center rounded-xs bg-brass-7 text-ink-12 text-xs font-bold">M</div>` with:
   ```jsx
   <img src={logoMark} alt="MyBikeLab" className="h-7 w-auto" />
   ```

The outer `<div className="flex items-center gap-2">` and the copyright `<span>` remain unchanged.

### Sizing

- `h-7` = 28px height — matches the current brass mark box height (`h-7 w-7`).
- `w-auto` — preserves the SVG's natural aspect ratio.
- `logo-mark.svg` is a compact symbol (not a wordmark); the mark is appropriate at 28px height.

### Footer background context

The Footer uses `bg-ink-12` (the inverse/dark background). The `logo-mark.svg` must be designed for use on a dark background, or the SVG must contain its own colors. The implementation agent should visually verify the logo renders correctly on the dark Footer background. If the SVG uses `currentColor` and inherits text color, adding `text-paper-2` to the `<img>` will not affect it (SVG in `<img>` does not inherit CSS). If contrast is insufficient, note this as an open finding but do not modify the SVG.

### Test context

Same constraint as TASK-005: in Vitest node tests, `logoMark` resolves to `''` (via fileMock). The test asserts structural replacement (presence of `<img>`, absence of hardcoded "M" div).

## Potentially impacted files

- `frontend/src/components/Footer.jsx` — import addition + logo div replacement
- `frontend/src/components/__tests__/Footer.test.jsx` (new file) — automated test for AC-006

## Inputs

- `frontend/src/components/Footer.jsx` (current source — read before acting)
- `MyBikeLab/design-system/assets/logo-mark.svg` (do not modify; verify it exists)

## Expected outputs

1. `Footer.jsx` modified: import added, hardcoded logo `<div>` replaced with `<img src={logoMark} alt="MyBikeLab" className="h-7 w-auto" />`.
2. New test file at `frontend/src/components/__tests__/Footer.test.jsx` asserting AC-006.

## Constraints

- Do not modify `logo-mark.svg`.
- Do not copy the SVG to `frontend/public/`. Use a module import only.
- The copyright `<span>` must remain in its current position, adjacent to the logo.
- The outer `<div className="flex items-center gap-2">` layout wrapper must remain.
- Footer navigation links and layout must be unaffected.
- The `alt` attribute must be `"MyBikeLab"`.

## Dependencies

none

## Validation criteria

- [ ] `Footer.jsx` imports `logoMark` from `'../../../design-system/assets/logo-mark.svg'`
- [ ] The logo `<div>` with "M" text is removed; replaced by `<img src={logoMark} alt="MyBikeLab" className="h-7 w-auto" />`
- [ ] The copyright span remains adjacent to the logo image
- [ ] Visual inspection: the Footer logo renders correctly on the dark (`bg-ink-12`) background
- [ ] Footer layout (flex row with copyright and nav links) is unaffected
- [ ] `npm run build` completes without errors
- [ ] `npm run test` passes with the new test

## Tests to implement

### Unit

Test file: `frontend/src/components/__tests__/Footer.test.jsx`

Strategy: render `<Footer />` to a static HTML string using `react-dom/server`'s `renderToStaticMarkup`. Footer uses no Redux state, so no Provider is needed. Assert:
- The rendered HTML contains an `<img` element with `alt="MyBikeLab"`
- The rendered HTML does not contain the hardcoded `>M<` text (the letter mark)
- The rendered HTML contains the copyright text ("MyBikeLab. All rights reserved.")

Example test skeleton:
```js
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import Footer from '../Footer';

describe('Footer', () => {
  it('renders logo as an img element (not hardcoded markup)', () => {
    const html = renderToStaticMarkup(<Footer />);
    expect(html).toContain('<img');
    expect(html).toContain('alt="MyBikeLab"');
    expect(html).not.toContain('>M<');
  });

  it('renders copyright notice', () => {
    const html = renderToStaticMarkup(<Footer />);
    expect(html).toContain('MyBikeLab. All rights reserved.');
  });
});
```

### Integration

- Manual: load `npm run dev`, scroll to Footer, confirm the logo renders as the mark SVG on the dark background. Verify the copyright text remains visible.
