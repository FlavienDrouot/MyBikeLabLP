// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  applyTheme,
  DEFAULT_THEME,
  getCurrentTheme,
  getStoredTheme,
  THEME_SWITCHING_CLASS,
  THEME_STORAGE_KEY,
} from '../theme';

describe('theme utilities', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove(THEME_SWITCHING_CLASS);
  });

  it('defaults to Light when storage is empty or invalid', () => {
    expect(getStoredTheme()).toBe(DEFAULT_THEME);

    localStorage.setItem(THEME_STORAGE_KEY, 'invalid');
    expect(getStoredTheme()).toBe(DEFAULT_THEME);
  });

  it('uses the browser preference without persisting an automatic choice', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    expect(getStoredTheme()).toBe('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();

    localStorage.setItem(THEME_STORAGE_KEY, 'invalid');
    expect(getStoredTheme()).toBe('dark');

    vi.stubGlobal('matchMedia', () => ({ matches: false }));
    expect(getStoredTheme()).toBe('light');
  });

  it.each(['light', 'cream', 'dark'])('honors saved %s over the browser preference', (theme) => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    expect(getStoredTheme()).toBe(theme);
  });

  it('uses the browser preference when storage is unavailable', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage denied');
    });
    expect(getStoredTheme()).toBe('dark');
  });

  it('reads the current document theme before consulting storage', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'cream');
    document.documentElement.dataset.theme = 'dark';

    expect(getCurrentTheme()).toBe('dark');
  });

  it('applies a valid theme to the document and local storage', () => {
    expect(applyTheme('dark')).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.documentElement.classList.contains(THEME_SWITCHING_CLASS)).toBe(true);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  });

  it('falls back to Light for an invalid theme', () => {
    expect(applyTheme('invalid')).toBe(DEFAULT_THEME);
    expect(document.documentElement.dataset.theme).toBe(DEFAULT_THEME);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe(DEFAULT_THEME);
  });
});
