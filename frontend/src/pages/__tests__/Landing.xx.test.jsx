import { createElement } from 'react';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import wheelsReducer from '../../store/slices/wheelsSlice';
import filtersReducer from '../../store/slices/filtersSlice';
import currencyReducer from '../../store/slices/currencySlice';
import Landing from '../Landing';
import i18n from 'i18next';

function isTokenAllowed(token) {
  return (
    token === 'XX' ||
    /^\d+$/.test(token) ||
    /^\(\d+\)$/.test(token) ||
    /^[a-z]{1,2}$/.test(token) ||
    /^[A-Z]{2}$/.test(token) ||
    /^[^A-Za-z0-9()]+$/.test(token)
  );
}

function extractTextNodes(html) {
  return html
    .replace(/<[^>]*>/g, '\0')
    .split('\0')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

function isNodeAllowed(node) {
  return node.split(/\s+/).every((token) => !token || isTokenAllowed(token));
}

const emptyWheelsStore = configureStore({
  reducer: { wheels: wheelsReducer, filters: filtersReducer, currency: currencyReducer },
  preloadedState: { wheels: { items: [], loading: false, error: null } },
});

describe('XX locale - i18n completeness', () => {
  beforeAll(() => i18n.changeLanguage('xx'));
  afterAll(() => i18n.changeLanguage('en'));

  it('all text nodes are translated (XX) or an explicit exception - no hardcoded UI strings', () => {
    const html = renderToStaticMarkup(
      createElement(Provider, { store: emptyWheelsStore }, createElement(Landing, null))
    );

    const nodes = extractTextNodes(html);
    const unexpected = nodes.filter((node) => !isNodeAllowed(node));
    expect(unexpected, 'hardcoded strings found').toEqual([]);
  });

  it('keeps the validated section order and existing navigation anchors', () => {
    const html = renderToStaticMarkup(
      createElement(Provider, { store: emptyWheelsStore }, createElement(Landing, null))
    );
    const sectionPositions = [
      html.indexOf('id="top"'),
      html.indexOf('id="tool"'),
      html.indexOf('class="section-spaced decor-section flow benefits-section"'),
      html.indexOf('id="roadmap"'),
      html.indexOf('id="partnerships"'),
    ];

    expect(sectionPositions.every((position) => position >= 0)).toBe(true);
    expect(sectionPositions).toEqual([...sectionPositions].sort((a, b) => a - b));
    expect(html).toContain('href="#tool"');
    expect(html).toContain('href="#roadmap"');
    expect(html).toContain('href="#partnerships"');
    expect(html).toContain('href="#contact"');
  });
});
