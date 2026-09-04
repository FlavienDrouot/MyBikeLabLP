// @vitest-environment jsdom

import { createElement, act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import ComparisonTable from '../ComparisonTable';

// Synthetic store builder — bypasses the real slices (which auto-build
// initial state from the full dataset) so each test controls the wheel
// list exactly.
const makeStore = (wheels, overrides = {}) => {
  const slice = createSlice({
    name: 'root',
    initialState: {
      wheels: { items: wheels },
      filters: { filters: {}, sortBy: null },
      currency: { displayCurrency: 'EUR' },
      ...overrides,
    },
    reducers: {},
  });
  return configureStore({ reducer: slice.reducer });
};

// Minimal wheel shape: only fields exercised by required columns.
// Use zero-padded names so the default A→Z sort matches numeric order.
const makeWheel = (id) => ({
  id,
  model: `Wheel-${String(id).padStart(3, '0')}`,
  brand: 'Brand',
  weight_grams: 1000 + id,
  diameter_mm: 700,
  rim: { material: 'Carbon', hookless: false, depth_mm: 33, externalWidth_mm: 25.5 },
  spokes: { model: 'Sapim CX-Ray', brand: 'Sapim', material: 'Stainless Steel' },
  hub: { model: 'DT 240', brand: 'DT Swiss' },
  prices: [{ currency: 'EUR', amount: 1000 }],
  image: 'placeholder.svg',
  affiliateLinks: {},
});

// Generate a set of wheels.
const makeWheels = (count) => Array.from({ length: count }, (_, i) => makeWheel(i + 1));

const renderWithStore = (wheels, opts = {}) =>
  renderToStaticMarkup(
    createElement(
      Provider,
      { store: makeStore(wheels, opts.storeOverrides) },
      createElement(ComparisonTable, { visibility: opts.visibility ?? {} })
    )
  );

const visibleTableOf = (container) =>
  Array.from(container.querySelectorAll('table')).find(
    (table) => table.getAttribute('aria-hidden') !== 'true'
  );

const paginationNavs = (container) =>
  Array.from(container.querySelectorAll('nav[aria-label="Pagination"]'));

describe('ComparisonTable pagination (EVO-061)', () => {
  let container;
  let root;
  let originalResizeObserver;
  let originalMatchMedia;

  beforeEach(() => {
    vi.useFakeTimers();
    originalResizeObserver = globalThis.ResizeObserver;
    globalThis.ResizeObserver = class ResizeObserver {
      observe() {}
      disconnect() {}
    };
    container = document.createElement('div');
    Object.defineProperty(container, 'clientWidth', {
      configurable: true,
      value: 960,
    });
    document.body.appendChild(container);
    root = createRoot(container);

    // Store original matchMedia
    originalMatchMedia = globalThis.window.matchMedia;
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    globalThis.ResizeObserver = originalResizeObserver;
    globalThis.window.matchMedia = originalMatchMedia;
    vi.useRealTimers();
  });

  // Helper to mock matchMedia for mobile viewport
  const mockMobileViewport = () => {
    globalThis.window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  };

  const mountInteractive = (wheels, opts = {}) => {
    mockMobileViewport();
    const store = makeStore(wheels, opts.storeOverrides);
    act(() => {
      root.render(
        createElement(
          Provider,
          { store },
          createElement(ComparisonTable, { visibility: opts.visibility ?? {} })
        )
      );
    });
  };

  describe('static rendering', () => {
    it('renders at most 10 wheels per page with 25 wheels', () => {
      const html = renderWithStore(makeWheels(25));
      // Should have pagination controls (appears twice: above and below table)
      expect(html).toContain('aria-label="Pagination"');
      // Count <tr> inside <tbody> — renderToStaticMarkup strips key attributes
      const tbodyMatch = html.match(/<tbody>([\s\S]*?)<\/tbody>/);
      expect(tbodyMatch).not.toBeNull();
      const tbodyContent = tbodyMatch[1];
      const rowMatches = tbodyContent.match(/<tr\b/g);
      expect(rowMatches).not.toBeNull();
      expect(rowMatches.length).toBe(10);
    });

    it('renders pagination controls when more than 10 wheels', () => {
      const html = renderWithStore(makeWheels(15));
      const paginationCount = (html.match(/aria-label="Pagination"/g) || []).length;
      expect(paginationCount).toBe(2);
    });

    it('does not render pagination controls when 10 or fewer wheels', () => {
      const html = renderWithStore(makeWheels(10));
      expect(html).not.toContain('aria-label="Pagination"');
    });

    it('does not render pagination controls when 0 wheels', () => {
      const html = renderWithStore([]);
      expect(html).not.toContain('aria-label="Pagination"');
    });

    it('displays "Page 1 of 3" for 25 wheels', () => {
      const html = renderWithStore(makeWheels(25));
      expect(html).toContain('Page 1 of 3');
    });

    it('shows total filtered count in heading', () => {
      const html = renderWithStore(makeWheels(25));
      expect(html).toContain('25');
      expect(html).toContain('of');
    });

    it('exactly 11 wheels shows "Page 1 of 2" with 10 rows on page 1', () => {
      const html = renderWithStore(makeWheels(11));
      expect(html).toContain('Page 1 of 2');
      const tbodyMatch = html.match(/<tbody>([\s\S]*?)<\/tbody>/);
      const rowMatches = tbodyMatch[1].match(/<tr\b/g);
      expect(rowMatches).not.toBeNull();
      expect(rowMatches.length).toBe(10);
    });
  });

  describe('interactive navigation', () => {
    it('navigates to next page when Next is clicked', () => {
      const wheels = makeWheels(25);
      mountInteractive(wheels);

      const navs = paginationNavs(container);
      expect(navs.length).toBe(2);

      // Verify page 1 text
      expect(navs[0].textContent).toContain('Page 1 of 3');

      // Get the Next button (last button in the nav)
      const nextButton = navs[0].querySelector('button:last-child');
      expect(nextButton.textContent).toContain('Next');
      expect(nextButton.disabled).toBe(false);

      act(() => {
        nextButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });

      // Verify we're on page 2
      const navsAfter = paginationNavs(container);
      expect(navsAfter[0].textContent).toContain('Page 2 of 3');
      expect(navsAfter[1].textContent).toContain('Page 2 of 3');

      // Verify the table shows 10 rows
      const table = visibleTableOf(container);
      const rows = table.querySelectorAll('tbody tr');
      expect(rows.length).toBe(10);
    });

    it('navigates to previous page when Previous is clicked', () => {
      const wheels = makeWheels(25);
      mountInteractive(wheels);

      // Go to page 2 first
      const navs = paginationNavs(container);
      const nextButton = navs[0].querySelector('button:last-child');
      act(() => {
        nextButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });

      // Verify we're on page 2
      expect(paginationNavs(container)[0].textContent).toContain('Page 2 of 3');

      // Now go back to page 1
      const navs2 = paginationNavs(container);
      const prevButton = navs2[0].querySelector('button:first-child');
      expect(prevButton.disabled).toBe(false);
      act(() => {
        prevButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });

      // Verify we're back on page 1
      expect(paginationNavs(container)[0].textContent).toContain('Page 1 of 3');
      expect(paginationNavs(container)[1].textContent).toContain('Page 1 of 3');
    });

    it('Previous is disabled on page 1', () => {
      const wheels = makeWheels(25);
      mountInteractive(wheels);

      const navs = paginationNavs(container);
      const prevButton = navs[0].querySelector('button:first-child');
      expect(prevButton.disabled).toBe(true);
    });

    it('Next is disabled on last page', () => {
      const wheels = makeWheels(25);
      mountInteractive(wheels);

      // Navigate to last page (page 3)
      let navs = paginationNavs(container);
      let nextButton = navs[0].querySelector('button:last-child');
      act(() => {
        nextButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });

      navs = paginationNavs(container);
      nextButton = navs[0].querySelector('button:last-child');
      act(() => {
        nextButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });

      // Now on last page
      navs = paginationNavs(container);
      expect(navs[0].textContent).toContain('Page 3 of 3');
      nextButton = navs[0].querySelector('button:last-child');
      expect(nextButton.disabled).toBe(true);

      // Previous should be enabled
      const prevButton = navs[0].querySelector('button:first-child');
      expect(prevButton.disabled).toBe(false);
    });

    it('last page shows remaining wheels', () => {
      const wheels = makeWheels(25);
      mountInteractive(wheels);

      // Navigate to last page (page 3)
      let navs = paginationNavs(container);
      let nextButton = navs[0].querySelector('button:last-child');
      act(() => {
        nextButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });

      navs = paginationNavs(container);
      nextButton = navs[0].querySelector('button:last-child');
      act(() => {
        nextButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });

      const table = visibleTableOf(container);
      const rows = table.querySelectorAll('tbody tr');
      expect(rows.length).toBe(5);
    });

    it('exactly 11 wheels: page 2 shows 1 row', () => {
      const wheels = makeWheels(11);
      mountInteractive(wheels);

      const navs = paginationNavs(container);
      expect(navs.length).toBe(2);
      expect(navs[0].textContent).toContain('Page 1 of 2');

      // Navigate to page 2
      const nextButton = navs[0].querySelector('button:last-child');
      act(() => {
        nextButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });

      const table = visibleTableOf(container);
      const rows = table.querySelectorAll('tbody tr');
      expect(rows.length).toBe(1);
    });
  });

  describe('page reset and clamping on wheel list change', () => {
    it('resets to page 1 after wheel list changes', () => {
      const wheels25 = makeWheels(25);
      mockMobileViewport();
      const store = makeStore(wheels25);

      act(() => {
        root.render(
          createElement(
            Provider,
            { store },
            createElement(ComparisonTable, { visibility: {} })
          )
        );
      });

      // Navigate to page 2
      let navs = paginationNavs(container);
      const nextButton = navs[0].querySelector('button:last-child');
      act(() => {
        nextButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });

      expect(paginationNavs(container)[0].textContent).toContain('Page 2 of 3');

      // Re-render with a reduced wheel list (simulating a filter change)
      const wheels15 = makeWheels(15);
      const newStore = makeStore(wheels15);
      act(() => {
        root.render(
          createElement(
            Provider,
            { store: newStore },
            createElement(ComparisonTable, { visibility: {} })
          )
        );
      });

      // Page should reset to 1
      expect(paginationNavs(container)[0].textContent).toContain('Page 1 of 2');
    });

    it('clamps to valid page when filter reduces below stored page, then resets', () => {
      const wheels25 = makeWheels(25);
      mockMobileViewport();
      const store = makeStore(wheels25);

      act(() => {
        root.render(
          createElement(
            Provider,
            { store },
            createElement(ComparisonTable, { visibility: {} })
          )
        );
      });

      // Navigate to page 3 (last page for 25 wheels)
      let navs = paginationNavs(container);
      let nextButton = navs[0].querySelector('button:last-child');
      act(() => {
        nextButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });
      navs = paginationNavs(container);
      nextButton = navs[0].querySelector('button:last-child');
      act(() => {
        nextButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });

      expect(paginationNavs(container)[0].textContent).toContain('Page 3 of 3');

      // Re-render with 15 wheels — page 3 no longer exists.
      // The list-reference-aware page derivation prevents an empty render and
      // starts the new list on page 1.
      const wheels15 = makeWheels(15);
      const newStore = makeStore(wheels15);
      act(() => {
        root.render(
          createElement(
            Provider,
            { store: newStore },
            createElement(ComparisonTable, { visibility: {} })
          )
        );
      });

      expect(paginationNavs(container)[0].textContent).toContain('Page 1 of 2');
    });
  });

  describe('desktop viewport (lg and above)', () => {
    it('renders all wheels without pagination controls', () => {
      // Mock matchMedia for desktop viewport
      globalThis.window.matchMedia = vi.fn().mockImplementation(() => ({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));

      const wheels = makeWheels(25);
      const store = makeStore(wheels);

      act(() => {
        root.render(
          createElement(
            Provider,
            { store },
            createElement(ComparisonTable, { visibility: {} })
          )
        );
      });

      const navs = paginationNavs(container);
      expect(navs.length).toBe(0);

      const table = visibleTableOf(container);
      const rows = table.querySelectorAll('tbody tr');
      expect(rows.length).toBe(25);
    });
  });

  describe('panel closure on page change', () => {
    it('closes the detail panel when navigating to another page', () => {
      const wheels = makeWheels(15);
      mountInteractive(wheels);

      // Open detail panel on first wheel
      const table = visibleTableOf(container);
      const firstRow = table.querySelector('tbody tr');
      act(() => {
        firstRow.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });

      // Verify panel is open
      expect(container.textContent).toContain('No links available for this wheel.');

      // Navigate to page 2
      const navs = paginationNavs(container);
      const nextButton = navs[0].querySelector('button:last-child');
      act(() => {
        nextButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });

      // Panel should be closed
      expect(container.textContent).not.toContain('No links available for this wheel.');
    });
  });
});
