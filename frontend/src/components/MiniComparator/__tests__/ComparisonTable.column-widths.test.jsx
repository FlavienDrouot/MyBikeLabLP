// @vitest-environment jsdom

// EVO-030 — the comparison table pins its column widths from a hidden twin
// measured on the FULL dataset, so filtering (which only changes the visible
// row set) can never change the table width and therefore never shifts the
// filter panel. JSDOM does no layout, so these assertions stay at the
// CSS-contract / structure level:
//   - once measured, the visible table is `table-layout: fixed` with a
//     <colgroup> sized from the measurement (mechanism is wired);
//   - the measuring twin renders the full dataset, not the filtered subset
//     (width source is filter-independent by construction);
//   - with no usable measurement (width 0, as JSDOM reports), it falls back to
//     auto layout instead of collapsing to 0-width columns.
// The actual "nothing moves while dragging" behaviour is a layout property and
// is verified visually in the browser.

import { createElement, act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import ComparisonTable from '../ComparisonTable';

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

const visibleTableOf = (container) =>
  Array.from(container.querySelectorAll('table')).find(
    (t) => t.getAttribute('aria-hidden') !== 'true'
  );
const measuringTableOf = (container) =>
  container.querySelector('table[aria-hidden="true"]');

describe('ComparisonTable column widths (EVO-030)', () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    // Remove the stub (an own prop on HTMLElement.prototype); the real
    // getBoundingClientRect lives on Element.prototype and is left untouched.
    delete window.HTMLElement.prototype.getBoundingClientRect;
  });

  // Make every element report a fixed non-zero width, so the measuring effect
  // produces a usable measurement (JSDOM otherwise returns 0 for everything).
  const stubMeasuredWidth = (px) => {
    Object.defineProperty(window.HTMLElement.prototype, 'getBoundingClientRect', {
      configurable: true,
      value() {
        return { x: 0, y: 0, top: 0, left: 0, bottom: 0, right: px, width: px, height: 16, toJSON() {} };
      },
    });
  };

  const mount = (wheels) => {
    const store = makeStore(wheels);
    act(() => {
      root.render(
        createElement(Provider, { store }, createElement(ComparisonTable, { visibility: {} }))
      );
    });
  };

  it('pins the visible table with table-layout: fixed and a <colgroup> once measured', () => {
    stubMeasuredWidth(100);
    mount([minimalWheel(1), minimalWheel(2)]);

    const table = visibleTableOf(container);
    expect(table).not.toBeNull();
    expect(table.style.tableLayout).toBe('fixed');

    // visibility={} keeps only required columns (model) → 1 data col + 1 actions col.
    const colgroup = table.querySelector('colgroup');
    expect(colgroup).not.toBeNull();
    expect(colgroup.querySelectorAll('col').length).toBe(2);

    // width = sum of measured data cols (100) + actions constant (48).
    expect(table.style.width).toBe('148px');
  });

  it('measures the full dataset, not the filtered subset', () => {
    stubMeasuredWidth(100);
    const fullDataset = [minimalWheel(1), minimalWheel(2), minimalWheel(3), minimalWheel(4)];
    mount(fullDataset);

    const measuring = measuringTableOf(container);
    expect(measuring).not.toBeNull();
    // One body row per wheel in the full dataset — the width source is the whole
    // dataset, independent of any active filter.
    expect(measuring.querySelectorAll('tbody tr').length).toBe(fullDataset.length);
  });

  it('keeps the measuring table out of document overflow calculations', () => {
    mount([minimalWheel(1), minimalWheel(2)]);

    const measuring = measuringTableOf(container);
    expect(measuring).not.toBeNull();
    expect(measuring.style.position).toBe('fixed');
    expect(measuring.style.visibility).toBe('hidden');
  });

  it('falls back to auto layout (no colgroup) when no width can be measured', () => {
    // No stub → JSDOM reports width 0 → not "ready".
    mount([minimalWheel(1), minimalWheel(2)]);

    const table = visibleTableOf(container);
    expect(table).not.toBeNull();
    expect(table.style.tableLayout).toBe('');
    expect(table.querySelector('colgroup')).toBeNull();
  });
});
