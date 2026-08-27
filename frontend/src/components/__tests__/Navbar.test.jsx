// @vitest-environment jsdom

import { createElement, act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import filtersReducer from '../../store/slices/filtersSlice';
import currencyReducer from '../../store/slices/currencySlice';
import Navbar from '../Navbar';

// Real filters + currency reducers so the changeDisplayCurrency thunk works;
// a minimal wheels slice satisfies the filters slice's initial-bounds build.
const wheelsSlice = createSlice({ name: 'wheels', initialState: { items: [] }, reducers: {} });
const makeStore = () =>
  configureStore({
    reducer: { wheels: wheelsSlice.reducer, filters: filtersReducer, currency: currencyReducer },
  });

const withStore = (store, node) => createElement(Provider, { store }, node);

describe('Navbar', () => {
  it('renders the brand mark as an inline SVG with wordmark text', () => {
    const html = renderToStaticMarkup(withStore(makeStore(), createElement(Navbar, null)));
    expect(html).toContain('<svg');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('MyBikeLab');
    expect(html).not.toContain('<img');
    expect(html).not.toContain('>M<');
  });

  describe('--navbar-height CSS variable sync', () => {
    const HEADER_HEIGHT_PX = 65;
    let container;
    let root;
    let originalOffsetHeight;

    beforeEach(() => {
      // Stub HTMLElement#offsetHeight so the measurement is deterministic
      // regardless of CSS / layout in JSDOM (which has no real layout engine).
      originalOffsetHeight = Object.getOwnPropertyDescriptor(
        window.HTMLElement.prototype,
        'offsetHeight'
      );
      Object.defineProperty(window.HTMLElement.prototype, 'offsetHeight', {
        configurable: true,
        get() {
          return HEADER_HEIGHT_PX;
        },
      });

      // Reset the ResizeObserver shim's instance registry between tests so we
      // can deterministically pick the observer created by the current mount.
      if (globalThis.ResizeObserver && globalThis.ResizeObserver.instances) {
        globalThis.ResizeObserver.instances.length = 0;
      }

      container = document.createElement('div');
      document.body.appendChild(container);
      root = createRoot(container);
    });

    afterEach(() => {
      act(() => {
        root.unmount();
      });
      container.remove();
      if (originalOffsetHeight) {
        Object.defineProperty(
          window.HTMLElement.prototype,
          'offsetHeight',
          originalOffsetHeight
        );
      } else {
        delete window.HTMLElement.prototype.offsetHeight;
      }
      // Make sure no stale inline value leaks between tests.
      document.documentElement.style.removeProperty('--navbar-height');
    });

    it('writes the measured header height to --navbar-height on mount', () => {
      act(() => {
        root.render(withStore(makeStore(), createElement(Navbar, null)));
      });

      expect(
        document.documentElement.style.getPropertyValue('--navbar-height')
      ).toBe(`${HEADER_HEIGHT_PX}px`);
    });

    it('updates --navbar-height when the header is resized', () => {
      act(() => {
        root.render(withStore(makeStore(), createElement(Navbar, null)));
      });

      // Simulate a resized header by changing the stubbed offsetHeight and
      // firing the ResizeObserver callback recorded by our shim.
      const NEW_HEIGHT_PX = 96;
      Object.defineProperty(window.HTMLElement.prototype, 'offsetHeight', {
        configurable: true,
        get() {
          return NEW_HEIGHT_PX;
        },
      });

      const observer = globalThis.ResizeObserver.instances.at(-1);
      expect(observer).toBeDefined();

      act(() => {
        observer.trigger();
      });

      expect(
        document.documentElement.style.getPropertyValue('--navbar-height')
      ).toBe(`${NEW_HEIGHT_PX}px`);
    });

    it('removes the inline --navbar-height override on unmount', () => {
      act(() => {
        root.render(withStore(makeStore(), createElement(Navbar, null)));
      });

      expect(
        document.documentElement.style.getPropertyValue('--navbar-height')
      ).toBe(`${HEADER_HEIGHT_PX}px`);

      act(() => {
        root.unmount();
      });
      // Re-create a root for the shared afterEach which expects `root` to be
      // unmountable; unmounting an already-unmounted root is a no-op in React
      // 19 but we replace it to be safe.
      root = createRoot(container);

      expect(
        document.documentElement.style.getPropertyValue('--navbar-height')
      ).toBe('');
    });
  });
});

describe('Navbar currency selector (EVO-046)', () => {
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
  });

  const mount = (store) => {
    act(() => {
      root.render(withStore(store, createElement(Navbar, null)));
    });
  };

  const currencyGroup = () =>
    container.querySelector('[role="group"][aria-label="nav.currency"]')
    ?? container.querySelector('[role="group"][aria-label="Currency"]');

  it('keeps all navigation destinations available from the mobile menu', () => {
    mount(makeStore());

    const toggle = container.querySelector('button[aria-controls="mobile-menu"]');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');

    act(() => {
      toggle.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    const mobileMenu = container.querySelector('#mobile-menu');
    expect(mobileMenu).not.toBeNull();
    expect(
      Array.from(mobileMenu.querySelectorAll('a')).map((link) => link.getAttribute('href'))
    ).toEqual(['#tool', '#roadmap', '#partnerships', '#contact']);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
  });

  it('renders both currency buttons with EUR active by default', () => {
    mount(makeStore());
    const group = currencyGroup();
    expect(group).not.toBeNull();
    const buttons = Array.from(group.querySelectorAll('button'));
    expect(buttons.map((b) => b.textContent)).toEqual(['€', '$']);
    expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[1].getAttribute('aria-pressed')).toBe('false');
  });

  it('switches the store display currency to USD when $ is clicked', () => {
    const store = makeStore();
    mount(store);
    const usdButton = Array.from(currencyGroup().querySelectorAll('button')).find(
      (b) => b.textContent === '$',
    );
    act(() => {
      usdButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(store.getState().currency.displayCurrency).toBe('USD');
  });

  it('exposes a localized group aria-label and per-button aria-labels', () => {
    mount(makeStore());
    const group = currencyGroup();
    const buttons = Array.from(group.querySelectorAll('button'));
    expect(buttons[0].getAttribute('aria-label')).toBeTruthy();
    expect(buttons[1].getAttribute('aria-label')).toBeTruthy();
  });
});
