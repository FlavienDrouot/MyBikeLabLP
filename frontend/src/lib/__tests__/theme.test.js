// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest';
import {
  applyTheme,
  DEFAULT_THEME,
  getCurrentTheme,
  getStoredTheme,
  THEME_STORAGE_KEY,
} from '../theme';

describe('theme utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('defaults to Light when storage is empty or invalid', () => {
    expect(getStoredTheme()).toBe(DEFAULT_THEME);

    localStorage.setItem(THEME_STORAGE_KEY, 'invalid');
    expect(getStoredTheme()).toBe(DEFAULT_THEME);
  });

  it('reads the current document theme before consulting storage', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'cream');
    document.documentElement.dataset.theme = 'dark';

    expect(getCurrentTheme()).toBe('dark');
  });

  it('applies a valid theme to the document and local storage', () => {
    expect(applyTheme('dark')).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  });

  it('falls back to Light for an invalid theme', () => {
    expect(applyTheme('invalid')).toBe(DEFAULT_THEME);
    expect(document.documentElement.dataset.theme).toBe(DEFAULT_THEME);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe(DEFAULT_THEME);
  });
});
