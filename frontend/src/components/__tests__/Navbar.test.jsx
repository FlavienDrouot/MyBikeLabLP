// @vitest-environment jsdom

import { createElement, act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import Navbar from '../Navbar';

describe('Navbar', () => {
  it('renders logo as an img element (not hardcoded markup)', () => {
    const html = renderToStaticMarkup(createElement(Navbar, null));
    expect(html).toContain('<img');
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
        root.render(createElement(Navbar, null));
      });

      expect(
        document.documentElement.style.getPropertyValue('--navbar-height')
      ).toBe(`${HEADER_HEIGHT_PX}px`);
    });

    it('updates --navbar-height when the header is resized', () => {
      act(() => {
        root.render(createElement(Navbar, null));
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
        root.render(createElement(Navbar, null));
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
