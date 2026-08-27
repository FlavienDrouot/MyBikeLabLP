// @vitest-environment jsdom

import { createElement } from 'react';
import { describe, it, expect } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import { store } from '../../../store';
import FilterPanel from '../FilterPanel';
import { resetFilters, setFilterValue } from '../../../store/slices/filtersSlice';

describe('FilterPanel', () => {
  const renderHtml = () =>
    renderToStaticMarkup(
      createElement(Provider, { store }, createElement(FilterPanel, null))
    );

  it('allows Wave 5 filter groups to open and close independently', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () => {
      root.render(
        createElement(Provider, { store }, createElement(FilterPanel, null))
      );
    });

    const groupButtons = () =>
      Array.from(container.querySelectorAll('button[aria-expanded]'));

    expect(groupButtons()[0].getAttribute('aria-expanded')).toBe('true');
    expect(groupButtons()[1].getAttribute('aria-expanded')).toBe('true');

    await act(async () => {
      groupButtons()[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(groupButtons()[0].getAttribute('aria-expanded')).toBe('true');
    expect(groupButtons()[1].getAttribute('aria-expanded')).toBe('false');

    await act(async () => {
      groupButtons()[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(groupButtons()[0].getAttribute('aria-expanded')).toBe('false');
    expect(groupButtons()[1].getAttribute('aria-expanded')).toBe('false');

    await act(async () => {
      root.unmount();
    });
    container.remove();
  });

  it('renders the multiplication sign for selected multi-select values', () => {
    const multiplicationSign = String.fromCodePoint(0x00d7);
    const mojibakeMarker = String.fromCodePoint(0x00c3, 0x2014);

    store.dispatch(setFilterValue({ id: 'brand', value: ['Roval'] }));
    try {
      const html = renderHtml();
      expect(html).toContain(multiplicationSign);
      expect(html).not.toContain(mojibakeMarker);
    } finally {
      store.dispatch(resetFilters());
    }
  });
});
