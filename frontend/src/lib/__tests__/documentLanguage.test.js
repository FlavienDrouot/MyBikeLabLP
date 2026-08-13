// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest';
import {
  getDocumentLanguagePolicy,
  syncDocumentLanguage,
} from '../documentLanguage';

beforeEach(() => {
  document.documentElement.className = '';
  document.documentElement.setAttribute('lang', 'en');
  document.documentElement.setAttribute('translate', 'yes');
});

describe('getDocumentLanguagePolicy', () => {
  it('keeps English and English regional locales browser-translatable', () => {
    expect(getDocumentLanguagePolicy('en')).toEqual({
      locale: 'en',
      allowBrowserTranslation: true,
    });
    expect(getDocumentLanguagePolicy('en-US').allowBrowserTranslation).toBe(true);
  });

  it('protects French and future non-English locales', () => {
    expect(getDocumentLanguagePolicy('fr').allowBrowserTranslation).toBe(false);
    expect(getDocumentLanguagePolicy('de').allowBrowserTranslation).toBe(false);
  });
});

describe('syncDocumentLanguage', () => {
  it('marks English as active and translatable', () => {
    syncDocumentLanguage('en');

    expect(document.documentElement.getAttribute('lang')).toBe('en');
    expect(document.documentElement.getAttribute('translate')).toBe('yes');
    expect(document.documentElement.classList.contains('notranslate')).toBe(false);
  });

  it('marks French as active and protected from browser translation', () => {
    syncDocumentLanguage('fr');

    expect(document.documentElement.getAttribute('lang')).toBe('fr');
    expect(document.documentElement.getAttribute('translate')).toBe('no');
    expect(document.documentElement.classList.contains('notranslate')).toBe(true);
  });

  it('updates the document policy in both language-switch directions', () => {
    syncDocumentLanguage('en');
    syncDocumentLanguage('fr');
    expect(document.documentElement.getAttribute('translate')).toBe('no');
    expect(document.documentElement.classList.contains('notranslate')).toBe(true);

    syncDocumentLanguage('en');
    expect(document.documentElement.getAttribute('translate')).toBe('yes');
    expect(document.documentElement.classList.contains('notranslate')).toBe(false);
  });
});
