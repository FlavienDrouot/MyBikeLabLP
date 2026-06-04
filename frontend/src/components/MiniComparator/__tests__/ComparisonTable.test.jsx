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
// list exactly. The selectors only read `state.wheels.items` and
// `state.filters.{filters,sortBy}`, so a single object reducer is enough.
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

// Minimal wheel shape: only fields exercised by required columns
// (model column renders brand + model). Other registry columns are
// excluded because `visibility={{}}` keeps only `required: true` columns.
const minimalWheel = {
  id: 1,
  model: 'Alpinist CLX II',
  brand: 'Roval',
  weight_grams: 1225,
  diameter_mm: 700,
  rim: { material: 'Carbon', hookless: false, depth_mm: 33, externalWidth_mm: 25.5 },
  spokes: { model: 'Sapim CX-Ray', brand: 'Sapim', material: 'Stainless Steel' },
  hub: { model: 'DT 240', brand: 'DT Swiss' },
  prices: [{ currency: 'EUR', amount: 1299 }],
  image: 'placeholder.svg',
  affiliateLinks: {},
};

const renderWithStore = (wheels) => {
  const store = makeStore(wheels);
  return renderToStaticMarkup(
    createElement(
      Provider,
      { store },
      createElement(ComparisonTable, { visibility: {} })
    )
  );
};

const visibleTableOf = (container) =>
  Array.from(container.querySelectorAll('table')).find(
    (table) => table.getAttribute('aria-hidden') !== 'true'
  );
const closeButtonOf = (container) =>
  Array.from(container.querySelectorAll('button')).find((button) =>
    /close menu|nav\.closeMenu/i.test(button.getAttribute('aria-label') ?? '')
  );

describe('ComparisonTable', () => {
  let container;
  let root;
  let originalResizeObserver;

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
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    globalThis.ResizeObserver = originalResizeObserver;
    vi.useRealTimers();
  });

  const mountInteractive = (wheels) => {
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
  };

  describe('viewport-bounded height classes (EVO-025 TASK-003)', () => {
    it('card root carries lg:flex, lg:flex-col, and lg:max-h-[calc(...)] cap', () => {
      const html = renderWithStore([minimalWheel]);
      expect(html).toContain('lg:flex');
      expect(html).toContain('lg:flex-col');
      expect(html).toContain('lg:max-h-[calc(100vh-var(--navbar-height)-12px)]');
    });

    it('table scroll wrapper carries overflow-x-auto, lg:overflow-y-auto, lg:min-h-0, and lg:[scrollbar-gutter:stable]', () => {
      const html = renderWithStore([minimalWheel]);
      expect(html).toContain('overflow-x-auto');
      expect(html).toContain('lg:overflow-y-auto');
      expect(html).toContain('lg:min-h-0');
      expect(html).toContain('lg:[scrollbar-gutter:stable]');
    });

    it('<th> header cells carry sticky, top-0, z-10, and preserves bg-paper-1', () => {
      const html = renderWithStore([minimalWheel]);
      // Locate the first <th ...> opening tag and assert all four classes
      // appear on it — sticky positioning lives on the cells, not on <thead>.
      const match = html.match(/<th\b[^>]*class="([^"]*)"/);
      expect(match).not.toBeNull();
      const thClass = match[1];
      expect(thClass).toContain('sticky');
      expect(thClass).toContain('top-0');
      expect(thClass).toContain('z-10');
      expect(thClass).toContain('bg-paper-1');
    });
  });

  describe('empty state', () => {
    it('renders the empty-state div when selectFilteredWheels returns []', () => {
      const html = renderWithStore([]);
      expect(html).toContain('class="p-10 text-center text-ink-7 text-sm"');
      // The table scroll wrapper must not be rendered in the empty branch.
      expect(html).not.toContain('overflow-x-auto');
    });
  });

  describe('variant marker', () => {
    it('renders a variant marker for variant wheels', () => {
      const variantWheel = {
        ...minimalWheel,
        variant: 'carbon_spokes',
      };
      const html = renderWithStore([variantWheel]);
      expect(html).toContain('Carbon spokes');
      expect(html).toContain('border-l border-brass-7');
    });

    it('does not render a variant marker for wheels without a variant', () => {
      const html = renderWithStore([minimalWheel]);
      expect(html).not.toContain('border-l border-brass-7');
    });
  });

  describe('expanded detail panel behavior (EVO-043 TASK-003)', () => {
    it('mounts one inline detail panel below the activated row', () => {
      mountInteractive([minimalWheel]);

      const table = visibleTableOf(container);
      const firstRow = table.querySelector('tbody tr');

      act(() => {
        firstRow.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });

      expect(table.querySelectorAll('tbody tr').length).toBe(2);
      expect(container.textContent).toContain('No links available for this wheel.');
      expect(closeButtonOf(container)).not.toBeNull();
    });

    it('collapses the current panel when the same row is activated again', () => {
      mountInteractive([minimalWheel]);

      const table = visibleTableOf(container);
      const firstRow = table.querySelector('tbody tr');

      act(() => {
        firstRow.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });
      act(() => {
        firstRow.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });
      act(() => {
        vi.advanceTimersByTime(221);
      });

      expect(container.textContent).not.toContain('No links available for this wheel.');
      expect(closeButtonOf(container)).toBeUndefined();
    });

    it('moves the inline detail panel when another row is activated', () => {
      const secondWheel = { ...minimalWheel, id: 2, model: 'Aeolus RSL 37', brand: 'Bontrager' };
      mountInteractive([minimalWheel, secondWheel]);

      const table = visibleTableOf(container);
      const bodyRows = () => Array.from(table.querySelectorAll('tbody tr'));

      act(() => {
        bodyRows()[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });
      expect(bodyRows()[1].textContent).toContain('No links available for this wheel.');

      act(() => {
        bodyRows()[2].dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });

      expect(bodyRows().length).toBe(3);
      expect(bodyRows()[2].textContent).toContain('No links available for this wheel.');
    });

    it('uses design-system motion tokens on the expanded panel wrapper', () => {
      mountInteractive([minimalWheel]);

      const table = visibleTableOf(container);
      const firstRow = table.querySelector('tbody tr');

      act(() => {
        firstRow.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });

      const wrapper = container.querySelector('.duration-base-ds.ease-standard');
      expect(wrapper).not.toBeNull();
      expect(wrapper.style.transitionProperty).toBe('opacity, transform');
      expect(wrapper.style.transitionDuration).toBe('var(--duration-base)');
      expect(wrapper.style.transitionTimingFunction).toBe('var(--ease-standard)');
    });

    it('dedicated close button collapses the panel and uses design-system close styling', () => {
      mountInteractive([minimalWheel]);

      const table = visibleTableOf(container);
      const firstRow = table.querySelector('tbody tr');

      act(() => {
        firstRow.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });

      const closeButton = closeButtonOf(container);
      expect(closeButton).not.toBeUndefined();
      expect(closeButton.className).toContain('rounded-xs');
      expect(closeButton.className).toContain('text-ink-11');
      expect(closeButton.className).toContain('focus-visible:outline-brass-8');
      expect(closeButton.className).not.toContain('rounded-full');

      act(() => {
        closeButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });
      expect(closeButtonOf(container)).toBeUndefined();
    });
  });
});

  describe('display-currency price cells (EVO-046)', () => {
    const usdWheel = { ...minimalWheel, id: 7, prices: [{ amount: 1200, currency: 'USD', url: 'u' }] };
    const eurWheel = { ...minimalWheel, id: 8, prices: [{ amount: 1000, currency: 'EUR', url: 'u' }] };

    const renderInCurrency = (wheels, displayCurrency) => {
      const slice = createSlice({
        name: 'root',
        initialState: {
          wheels: { items: wheels },
          filters: { filters: {}, sortBy: null },
          currency: { displayCurrency },
        },
        reducers: {},
      });
      const store = configureStore({ reducer: slice.reducer });
      return renderToStaticMarkup(
        createElement(Provider, { store }, createElement(ComparisonTable, { visibility: { price: true } })),
      );
    };

    it('prefixes a converted (USD→EUR) price with the approx marker and shows native EUR plainly', () => {
      const html = renderInCurrency([usdWheel, eurWheel], 'EUR');
      expect(html).toContain('≈');
      expect(html).toContain('€');
    });

    it('shows a native USD price without the approx marker in USD display', () => {
      const html = renderInCurrency([usdWheel], 'USD');
      expect(html).toContain('$');
      // The single USD offer is native in USD display → no approx marker.
      expect(html).not.toContain('≈');
    });
  });
