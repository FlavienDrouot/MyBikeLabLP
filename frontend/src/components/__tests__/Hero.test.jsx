import { createElement } from 'react';
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import Hero from '../Hero';

function countOccurrences(haystack, needle) {
  let count = 0;
  let start = 0;
  while (true) {
    const idx = haystack.indexOf(needle, start);
    if (idx === -1) break;
    count++;
    start = idx + needle.length;
  }
  return count;
}

describe('Hero', () => {
  describe('stat metrics grid', () => {
    it('renders the stat metrics grid exactly once', () => {
      const html = renderToStaticMarkup(createElement(Hero, null));

      expect(countOccurrences(html, 'Road wheels')).toBe(1);
      expect(countOccurrences(html, 'Filter axes')).toBe(1);
      expect(countOccurrences(html, 'Phases planned')).toBe(1);
    });
  });
});
