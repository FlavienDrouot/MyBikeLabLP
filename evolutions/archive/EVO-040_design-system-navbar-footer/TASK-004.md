# TASK-004 — Update Navbar.test.jsx and Footer.test.jsx assertions

## Objective

Update the two failing test assertions that check for an `<img>` element in Navbar and Footer. After TASK-002 and TASK-003, both components render the brand mark as an inline SVG via `LogoMark`, not as an `<img>` element. The updated assertions must verify the correct brand mark structure without breaking the `--navbar-height` behavior tests or the copyright test.

## Required context

### Current tests that will fail after migration

**`frontend/src/components/__tests__/Navbar.test.jsx` — line 13:**
```js
it('renders logo as an img element (not hardcoded markup)', () => {
  const html = renderToStaticMarkup(createElement(Navbar, null));
  expect(html).toContain('<img');        // WILL FAIL: <img> no longer present
  expect(html).not.toContain('>M<');     // still valid
});
```

**`frontend/src/components/__tests__/Footer.test.jsx` — line 8:**
```js
it('renders logo as an img element (not hardcoded markup)', () => {
  const html = renderToStaticMarkup(createElement(Footer, null));
  expect(html).toContain('<img');        // WILL FAIL: <img> no longer present
  expect(html).toContain('alt="MyBikeLab"');   // WILL FAIL: alt is no longer on the img
  expect(html).not.toContain('>M<');     // still valid
});
```

### Tests that must remain unchanged

**`Navbar.test.jsx` — `--navbar-height CSS variable sync` describe block (lines 16-123):** three tests covering mount, resize, and unmount behavior of the `--navbar-height` write mechanism. These tests do not interact with the logo at all — they test `useLayoutEffect` + `ResizeObserver`. **Do not touch these tests.**

**`Footer.test.jsx` — `renders copyright notice` (lines 14-18):**
```js
it('renders copyright notice', () => {
  const html = renderToStaticMarkup(createElement(Footer, null));
  expect(html).toContain('MyBikeLab. All rights reserved.');
});
```
This test checks for the copyright string from the i18n key `footer.copyright`. After migration this string is still rendered. **Do not touch this test.**

### Required assertion replacements

**Navbar test — replace the `<img>` assertion with SVG-based assertions:**

The `it('renders logo as an img element (not hardcoded markup)')` test must be renamed and updated. New intent: verify the brand mark renders as an SVG and the wordmark text is present.

```js
it('renders the brand mark as an inline SVG with wordmark text', () => {
  const html = renderToStaticMarkup(createElement(Navbar, null));
  expect(html).toContain('<svg');
  expect(html).toContain('aria-hidden="true"');
  expect(html).toContain('MyBikeLab');
  expect(html).not.toContain('<img');
  expect(html).not.toContain('>M<');
});
```

Rationale for each assertion:
- `toContain('<svg')` — confirms the LogoMark SVG is rendered inline
- `toContain('aria-hidden="true"')` — confirms the decorative SVG has the correct accessibility attribute
- `toContain('MyBikeLab')` — confirms the wordmark text is rendered (replaces the `alt="MyBikeLab"` that was on the `<img>`)
- `not.toContain('<img')` — explicit regression guard that the old `<img>` approach is gone
- `not.toContain('>M<')` — original guard against hardcoded letter markup, kept

**Footer test — replace the `<img>` assertion with SVG-based assertions:**

The `it('renders logo as an img element (not hardcoded markup)')` test must be renamed and updated.

```js
it('renders the brand mark as an inline SVG with wordmark text', () => {
  const html = renderToStaticMarkup(createElement(Footer, null));
  expect(html).toContain('<svg');
  expect(html).toContain('aria-hidden="true"');
  expect(html).toContain('MyBikeLab');
  expect(html).not.toContain('<img');
  expect(html).not.toContain('>M<');
});
```

Same rationale as the Navbar assertion update.

### Complete updated test files for reference

**`frontend/src/components/__tests__/Navbar.test.jsx` — final state:**

```js
// @vitest-environment jsdom

import { createElement, act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import Navbar from '../Navbar';

describe('Navbar', () => {
  it('renders the brand mark as an inline SVG with wordmark text', () => {
    const html = renderToStaticMarkup(createElement(Navbar, null));
    expect(html).toContain('<svg');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('MyBikeLab');
    expect(html).not.toContain('<img');
    expect(html).not.toContain('>M<');
  });

  describe('--navbar-height CSS variable sync', () => {
    // ... (entire block unchanged — copy verbatim from current file)
  });
});
```

**`frontend/src/components/__tests__/Footer.test.jsx` — final state:**

```js
import { createElement } from 'react';
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import Footer from '../Footer';

describe('Footer', () => {
  it('renders the brand mark as an inline SVG with wordmark text', () => {
    const html = renderToStaticMarkup(createElement(Footer, null));
    expect(html).toContain('<svg');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('MyBikeLab');
    expect(html).not.toContain('<img');
    expect(html).not.toContain('>M<');
  });

  it('renders copyright notice', () => {
    const html = renderToStaticMarkup(createElement(Footer, null));
    expect(html).toContain('MyBikeLab. All rights reserved.');
  });
});
```

## Potentially impacted files

- `frontend/src/components/__tests__/Navbar.test.jsx`
- `frontend/src/components/__tests__/Footer.test.jsx`

## Inputs

- Current `Navbar.test.jsx` — read in full before editing
- Current `Footer.test.jsx` — read in full before editing
- Migrated `Navbar.jsx` (TASK-002 output) — confirm it renders `<svg>`, `aria-hidden="true"`, and "MyBikeLab" text
- Migrated `Footer.jsx` (TASK-003 output) — confirm it renders `<svg>`, `aria-hidden="true"`, and "MyBikeLab" text

## Expected outputs

- `Navbar.test.jsx`: first `it` block renamed and updated to SVG assertions; `--navbar-height` describe block unchanged
- `Footer.test.jsx`: first `it` block renamed and updated to SVG assertions; copyright `it` block unchanged

## Constraints

- Do not modify any assertion inside the `--navbar-height CSS variable sync` describe block in `Navbar.test.jsx`
- Do not modify the `renders copyright notice` test in `Footer.test.jsx`
- Do not add new test dependencies or change the import list beyond what is required
- The test rename (`renders logo as an img element` → `renders the brand mark as an inline SVG with wordmark text`) is required — do not keep the old test name as it will be misleading

## Dependencies

TASK-002, TASK-003

## Validation criteria

- [ ] `vitest run` passes with zero failing tests in `Navbar.test.jsx` and `Footer.test.jsx`
- [ ] The first `it` in `Navbar.test.jsx` is renamed and contains no `toContain('<img')` assertion
- [ ] The first `it` in `Footer.test.jsx` is renamed and contains no `toContain('<img')` or `toContain('alt="MyBikeLab"')` assertion
- [ ] The `--navbar-height CSS variable sync` describe block in `Navbar.test.jsx` is byte-for-byte identical to the current version
- [ ] The `renders copyright notice` test in `Footer.test.jsx` is byte-for-byte identical to the current version

## Tests to implement

### Unit

The test file updates described above are themselves the deliverable. No new separate test infrastructure is required.

### Integration

- `vitest run frontend/src/components/__tests__/Navbar.test.jsx` — all 4 tests pass (1 brand mark + 3 `--navbar-height`)
- `vitest run frontend/src/components/__tests__/Footer.test.jsx` — all 2 tests pass (1 brand mark + 1 copyright)
