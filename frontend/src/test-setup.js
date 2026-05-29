import React from 'react';
globalThis.React = React;

// Flag the environment so React 19's `act(...)` does not emit a warning
// when tests use it to flush effects after createRoot renders.
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Minimal ResizeObserver shim for tests. JSDOM does not implement
// ResizeObserver, and Node has no DOM at all. Each instance records its
// callback and the observed element, and exposes a `trigger()` helper so
// tests can synchronously simulate a resize.
if (typeof globalThis.ResizeObserver === 'undefined') {
  class ResizeObserverShim {
    constructor(callback) {
      this.callback = callback;
      this.targets = new Set();
      ResizeObserverShim.instances.push(this);
    }
    observe(target) {
      this.targets.add(target);
    }
    unobserve(target) {
      this.targets.delete(target);
    }
    disconnect() {
      this.targets.clear();
    }
    // Test helper: synchronously fire the callback for every observed target.
    trigger() {
      const entries = Array.from(this.targets).map((target) => ({ target }));
      this.callback(entries, this);
    }
  }
  ResizeObserverShim.instances = [];
  globalThis.ResizeObserver = ResizeObserverShim;
}

// Minimal matchMedia shim for tests. JSDOM does not implement matchMedia,
// but a few tests (EVO-025 TASK-004) need to assert behavior at a specific
// breakpoint. Tests can override `globalThis.__matchMediaMatches` with a
// predicate `(query: string) => boolean` to control which media queries
// match. When the override is absent, the shim defaults to "no match",
// which mirrors JSDOM's small default viewport (1024 wide is not reached).
if (typeof globalThis.window !== 'undefined' && typeof globalThis.window.matchMedia === 'undefined') {
  globalThis.window.matchMedia = (query) => {
    const matches = typeof globalThis.__matchMediaMatches === 'function'
      ? Boolean(globalThis.__matchMediaMatches(query))
      : false;
    return {
      matches,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    };
  };
}
