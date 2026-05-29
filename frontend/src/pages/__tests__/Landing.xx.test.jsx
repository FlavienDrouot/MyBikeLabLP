import { createElement } from 'react';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import wheelsReducer from '../../store/slices/wheelsSlice';
import filtersReducer from '../../store/slices/filtersSlice';
import Landing from '../Landing';
import i18n from 'i18next';

// Allowed token classes:
//   XX         – translated string
//   \d+        – hardcoded number (counts, stats)
//   [a-z]{1,2} – measurement unit (g, mm…)
//   [€$£%]     – currency / percentage symbol
//   [—→]       – decorative symbols (range separator, roadmap arrow)
//   [A-Z]{2}   – 2-letter language code (EN, FR) from the language switcher
const ALLOWED_TOKEN = /^(XX|\d+|[a-z]{1,2}|[€$£%]|[—→]|[A-Z]{2})$/;

function extractTextNodes(html) {
  return html
    .replace(/<[^>]*>/g, '\0')
    .split('\0')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

function isNodeAllowed(node) {
  return node.split(/\s+/).every((token) => !token || ALLOWED_TOKEN.test(token));
}

const emptyWheelsStore = configureStore({
  reducer: { wheels: wheelsReducer, filters: filtersReducer },
  preloadedState: { wheels: { items: [], loading: false, error: null } },
});

describe('XX locale — i18n completeness', () => {
  beforeAll(() => i18n.changeLanguage('xx'));
  afterAll(() => i18n.changeLanguage('en'));

  it('all text nodes are translated (XX) or an explicit exception — no hardcoded UI strings', () => {
    const html = renderToStaticMarkup(
      createElement(Provider, { store: emptyWheelsStore }, createElement(Landing, null))
    );

    const nodes = extractTextNodes(html);
    const unexpected = nodes.filter((node) => !isNodeAllowed(node));
    expect(unexpected, 'hardcoded strings found').toEqual([]);
  });
});
