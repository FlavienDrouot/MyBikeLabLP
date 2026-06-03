import { createElement } from 'react';
import { describe, it, expect } from 'vitest';
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
  prices: [{ price_eur: 1299 }],
  image: 'placeholder.svg',
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

describe('ComparisonTable', () => {
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

    it('<th> header cells carry sticky, top-0, z-10, and preserves bg-paper-2', () => {
      const html = renderWithStore([minimalWheel]);
      // Locate the first <th ...> opening tag and assert all four classes
      // appear on it — sticky positioning lives on the cells, not on <thead>.
      const match = html.match(/<th\b[^>]*class="([^"]*)"/);
      expect(match).not.toBeNull();
      const thClass = match[1];
      expect(thClass).toContain('sticky');
      expect(thClass).toContain('top-0');
      expect(thClass).toContain('z-10');
      expect(thClass).toContain('bg-paper-2');
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
});
