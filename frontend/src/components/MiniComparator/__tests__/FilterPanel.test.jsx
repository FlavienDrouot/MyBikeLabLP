// @vitest-environment jsdom

import { createElement } from 'react';
import { describe, it, expect } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import { store } from '../../../store';
import FilterPanel from '../FilterPanel';

// EVO-025 / TASK-002: the FilterPanel root <aside> must carry a viewport-bounded
// max-height cap and internal vertical scroll on `lg`, and must no longer rely
// on the legacy `lg:sticky` + inline `top: var(--navbar-height)` positioning.
describe('FilterPanel (EVO-025 TASK-002 — viewport-bounded height)', () => {
  const renderHtml = () =>
    renderToStaticMarkup(
      createElement(Provider, { store }, createElement(FilterPanel, null))
    );

  it('caps the panel height to the viewport minus the navbar on lg', () => {
    const html = renderHtml();
    expect(html).toContain('lg:max-h-[calc(100vh-var(--navbar-height)-12px)]');
  });

  it('enables internal vertical scroll on lg', () => {
    const html = renderHtml();
    expect(html).toContain('lg:overflow-y-auto');
  });

  it('no longer pins the panel via lg:sticky', () => {
    const html = renderHtml();
    expect(html).not.toContain('lg:sticky');
  });

  it('no longer applies the inline top: var(--navbar-height) style', () => {
    const html = renderHtml();
    expect(html).not.toContain('top: var(--navbar-height)');
  });

  it('preserves the pre-existing base classes on the root <aside>', () => {
    const html = renderHtml();
    // These are the classes that pre-date this evolution and must remain.
    for (const cls of ['card', 'p-5', 'lg:p-6', 'space-y-6', 'h-fit']) {
      expect(html).toContain(cls);
    }
  });

  it('keeps only one filter group open at a time', async () => {
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

    expect(groupButtons().map((button) => button.getAttribute('aria-expanded'))).toEqual([
      'true',
      'false',
      'false',
    ]);

    await act(async () => {
      groupButtons()[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(groupButtons().map((button) => button.getAttribute('aria-expanded'))).toEqual([
      'false',
      'true',
      'false',
    ]);

    await act(async () => {
      groupButtons()[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(groupButtons().map((button) => button.getAttribute('aria-expanded'))).toEqual([
      'false',
      'false',
      'false',
    ]);

    await act(async () => {
      root.unmount();
    });
    container.remove();
  });
});
