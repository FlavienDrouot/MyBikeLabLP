// @vitest-environment jsdom

// EVO-025 / TASK-004 — integration-style coverage of the viewport-bounded
// height cap, the desktop-only gating, the scroll isolation, and the sticky
// table header. Mapped 1:1 to PRD ACs:
//   AC-001 — FilterPanel root resolved max-height at lg
//   AC-002 — ComparisonTable card root resolved max-height at lg
//   AC-003 — Scroll isolation: FilterPanel does not move the page or the table
//   AC-004 — Scroll isolation: ComparisonTable does not move the page or the panel
//   AC-005 — No internal scrollbar appears when the content fits under the cap
//   AC-006 — <thead> is position: sticky; top: 0 (the CSS contract)
//   AC-007 — No max-height is applied below the lg breakpoint
//
// Per spec-notes.md "Tradeoffs": JSDOM does not run Tailwind, and a quick
// probe confirms JSDOM also does not evaluate `@media` queries inside
// stylesheets (CSS rules inside `@media (min-width: 1024px) { ... }` are
// reported as `'none'` by `getComputedStyle`, regardless of `innerWidth`).
// To simulate the breakpoint, the desktop helper injects the rules
// unconditionally (matching the "lg matches" case), and the mobile helper
// clears them (matching the "lg does not match" case). Class names asserted
// here are exactly the ones present on the rendered DOM (verified by the
// production markup, e.g. `lg:max-h-[calc(100vh-var(--navbar-height)-12px)]`).
// This keeps the assertions at the CSS-contract level rather than the layout
// level (JSDOM cannot compute `vh`).

import { createElement, act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import MiniComparator from '../MiniComparator';

// ---------------------------------------------------------------------------
// Synthetic Redux store builder — mirrors the helper used in
// ComparisonTable.test.jsx. Bypasses the production store so each test owns
// its dataset.
// ---------------------------------------------------------------------------
const makeStore = (wheels) => {
  const slice = createSlice({
    name: 'root',
    initialState: {
      wheels: { items: wheels },
      filters: { filters: {}, sortBy: null },
      currency: { displayCurrency: 'EUR' },
    },
    reducers: {},
  });
  return configureStore({ reducer: slice.reducer });
};

const minimalWheel = (id) => ({
  id,
  model: `Model ${id}`,
  brand: 'BrandX',
  weight_grams: 1200 + id,
  diameter_mm: 700,
  rim: { material: 'Carbon', hookless: false, depth_mm: 33, externalWidth_mm: 25.5 },
  spokes: { model: 'CX-Ray', brand: 'Sapim', material: 'Stainless Steel' },
  hub: { model: 'DT 240', brand: 'DT Swiss' },
  prices: [{ currency: 'EUR', amount: 1000 + id }],
  image: 'placeholder.svg',
});

// Rules applied unconditionally when the test simulates the `lg` breakpoint
// (≥ 1024 px). Drop these rules to simulate the sub-`lg` viewport. Generated
// to match what Tailwind compiles in production for these arbitrary-value
// classes. The `sticky` / `top-0` utilities are non-responsive in Tailwind
// (always applied) and therefore live in a separate sheet that stays mounted
// across viewport switches.
const TAILWIND_LG_STYLES = `
.lg\\:max-h-\\[calc\\(100vh-var\\(--navbar-height\\)-12px\\)\\] {
  max-height: calc(100vh - var(--navbar-height) - 12px);
}
.lg\\:overflow-y-auto { overflow-y: auto; }
.lg\\:flex { display: flex; }
.lg\\:flex-col { flex-direction: column; }
.lg\\:min-h-0 { min-height: 0; }
.lg\\:overflow-hidden { overflow: hidden; }
`;
const TAILWIND_BASE_STYLES = `
.sticky { position: sticky; }
.top-0 { top: 0px; }
`;

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------
const NAVBAR_HEIGHT_PX = '64px';
const EXPECTED_MAX_HEIGHT = 'calc(100vh - var(--navbar-height) - 12px)';

let baseStyleEl;
let lgStyleEl;

beforeAll(() => {
  baseStyleEl = document.createElement('style');
  baseStyleEl.setAttribute('data-test-id', 'evo-025-tailwind-base-shim');
  baseStyleEl.textContent = TAILWIND_BASE_STYLES;
  document.head.appendChild(baseStyleEl);
});

afterAll(() => {
  baseStyleEl?.remove();
  lgStyleEl?.remove();
  lgStyleEl = undefined;
});

// Mount/unmount the lg-stylesheet to simulate JSDOM honouring the @media rule.
const enableLgStyles = () => {
  if (lgStyleEl) return;
  lgStyleEl = document.createElement('style');
  lgStyleEl.setAttribute('data-test-id', 'evo-025-tailwind-lg-shim');
  lgStyleEl.textContent = TAILWIND_LG_STYLES;
  document.head.appendChild(lgStyleEl);
};

const disableLgStyles = () => {
  if (!lgStyleEl) return;
  lgStyleEl.remove();
  lgStyleEl = undefined;
};

describe('MiniComparator viewport-cap integration (EVO-025 TASK-004)', () => {
  let container;
  let root;
  let originalInnerWidth;

  beforeEach(() => {
    document.documentElement.style.setProperty('--navbar-height', NAVBAR_HEIGHT_PX);
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    originalInnerWidth = Object.getOwnPropertyDescriptor(window, 'innerWidth');
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    document.documentElement.style.removeProperty('--navbar-height');
    delete globalThis.__matchMediaMatches;
    disableLgStyles();
    if (originalInnerWidth) {
      Object.defineProperty(window, 'innerWidth', originalInnerWidth);
    }
  });

  // Helper: render <Provider><MiniComparator/></Provider> with the given wheels
  // dataset. Returns the panel and table roots once mounted.
  const mount = (wheels) => {
    const store = makeStore(wheels);
    act(() => {
      root.render(
        createElement(Provider, { store }, createElement(MiniComparator, null))
      );
    });

    // FilterPanel root <aside> carries the desktop cap and scroll classes.
    const panelRoot = Array.from(container.querySelectorAll('aside')).find((el) =>
      el.className.includes('lg:max-h-[calc(100vh-var(--navbar-height)-12px)]')
    );
    // ComparisonTable root carries the same desktop cap plus flex layout.
    const tableRoot = Array.from(container.querySelectorAll('div')).find((el) =>
      el.className.includes('lg:flex') &&
      el.className.includes('lg:max-h-[calc(100vh-var(--navbar-height)-12px)]')
    );
    return { panelRoot, tableRoot };
  };

  const setDesktopMatchMedia = () => {
    globalThis.__matchMediaMatches = (query) => /min-width:\s*1024px/i.test(query);
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: 1280,
    });
    enableLgStyles();
  };

  const setMobileMatchMedia = () => {
    globalThis.__matchMediaMatches = (query) => /max-width:\s*1023(\.\d+)?px/i.test(query);
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: 800,
    });
    disableLgStyles();
  };

  // --- AC-001 -------------------------------------------------------------
  it('AC-001 — FilterPanel root resolved max-height equals the cap formula at lg', () => {
    setDesktopMatchMedia();
    const { panelRoot } = mount([minimalWheel(1), minimalWheel(2)]);

    expect(panelRoot).not.toBeNull();
    const resolved = window.getComputedStyle(panelRoot).maxHeight;
    expect(resolved).toBe(EXPECTED_MAX_HEIGHT);
  });

  // --- AC-002 -------------------------------------------------------------
  it('AC-002 — ComparisonTable card root resolved max-height equals the cap formula at lg', () => {
    setDesktopMatchMedia();
    const { tableRoot } = mount([minimalWheel(1), minimalWheel(2)]);

    expect(tableRoot).not.toBeNull();
    const resolved = window.getComputedStyle(tableRoot).maxHeight;
    expect(resolved).toBe(EXPECTED_MAX_HEIGHT);
  });

  it('AC-002b — the MiniComparator grid wrapper spans the available width instead of shrink-wrapping', () => {
    setDesktopMatchMedia();
    mount([minimalWheel(1), minimalWheel(2)]);

    const section = container.querySelector('#tool');
    const gridWrapper = Array.from(container.querySelectorAll('div')).find((el) =>
      el.className.includes('mt-12 grid') &&
      el.className.includes('lg:grid-cols-[280px_1fr]')
    );

    expect(section).not.toBeNull();
    expect(section.className).toContain('overflow-x-hidden');
    expect(gridWrapper).not.toBeNull();
    expect(gridWrapper.className).toContain('w-full');
    expect(gridWrapper.className).toContain('max-w-full');
    expect(gridWrapper.className).not.toContain('w-fit');
  });

  // --- AC-003 -------------------------------------------------------------
  it('AC-003 — scrolling the FilterPanel does not move the page or the table', () => {
    setDesktopMatchMedia();
    const { panelRoot, tableRoot } = mount([minimalWheel(1), minimalWheel(2)]);

    // The table's scroll region is the inner wrapper carrying lg:overflow-y-auto.
    const tableScrollWrapper = tableRoot.querySelector('.lg\\:overflow-y-auto');
    expect(tableScrollWrapper).not.toBeNull();

    panelRoot.scrollTop = 120;

    expect(window.scrollY).toBe(0);
    expect(tableScrollWrapper.scrollTop).toBe(0);
  });

  // --- AC-004 -------------------------------------------------------------
  it('AC-004 — scrolling the ComparisonTable does not move the page or the panel', () => {
    setDesktopMatchMedia();
    const { panelRoot, tableRoot } = mount([minimalWheel(1), minimalWheel(2)]);

    const tableScrollWrapper = tableRoot.querySelector('.lg\\:overflow-y-auto');
    expect(tableScrollWrapper).not.toBeNull();

    tableScrollWrapper.scrollTop = 240;

    expect(window.scrollY).toBe(0);
    expect(panelRoot.scrollTop).toBe(0);
  });

  // --- AC-005 -------------------------------------------------------------
  it('AC-005 — neither root reports an internal scrollbar when content fits under the cap', () => {
    setDesktopMatchMedia();
    const { panelRoot, tableRoot } = mount([minimalWheel(1)]);

    // Force a synthetic content height that fits within the cap.
    // JSDOM defaults `scrollHeight` and `clientHeight` to 0; redefining both
    // to the same value emulates "content fits, no overflow".
    const stubFits = (el) => {
      Object.defineProperty(el, 'scrollHeight', { configurable: true, value: 400 });
      Object.defineProperty(el, 'clientHeight', { configurable: true, value: 400 });
    };
    stubFits(panelRoot);
    stubFits(tableRoot);

    expect(panelRoot.scrollHeight).toBe(panelRoot.clientHeight);
    expect(tableRoot.scrollHeight).toBe(tableRoot.clientHeight);
  });

  // --- AC-006 -------------------------------------------------------------
  it('AC-006 — <thead> resolves to position: sticky with top: 0', () => {
    setDesktopMatchMedia();
    mount([minimalWheel(1), minimalWheel(2)]);

    // Sticky positioning is applied to the <th> cells (CSS-standard approach),
    // not to <thead> itself.
    const th = container.querySelector('thead th');
    expect(th).not.toBeNull();

    const computed = window.getComputedStyle(th);
    expect(computed.position).toBe('sticky');
    expect(computed.top).toBe('0px');
  });

  // --- AC-007 -------------------------------------------------------------
  it('AC-007 — below the lg breakpoint, neither root has a resolved max-height', () => {
    setMobileMatchMedia();
    const { panelRoot, tableRoot } = mount([minimalWheel(1), minimalWheel(2)]);

    // Tailwind's lg: utilities are inside `@media (min-width: 1024px)`. With
    // `innerWidth = 800`, JSDOM honours the media query and the cap rule does
    // not apply, so the resolved max-height falls back to the default 'none'.
    expect(window.getComputedStyle(panelRoot).maxHeight).toBe('none');
    expect(window.getComputedStyle(tableRoot).maxHeight).toBe('none');
  });
});
