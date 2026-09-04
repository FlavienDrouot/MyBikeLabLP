export const THEME_STORAGE_KEY = 'mbl-wave5-theme';
export const DEFAULT_THEME = 'light';
export const THEMES = ['light', 'cream', 'dark'];
export const THEME_SWITCHING_CLASS = 'theme-switching';

let themeSwitchSequence = 0;

export const isTheme = (value) => THEMES.includes(value);

export const getStoredTheme = () => {
  if (typeof window === 'undefined') return DEFAULT_THEME;

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(storedTheme) ? storedTheme : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
};

export const getCurrentTheme = () => {
  if (typeof document === 'undefined') return getStoredTheme();

  const documentTheme = document.documentElement.dataset.theme;
  return isTheme(documentTheme) ? documentTheme : getStoredTheme();
};

export const applyTheme = (theme) => {
  const nextTheme = isTheme(theme) ? theme : DEFAULT_THEME;

  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    const switchSequence = ++themeSwitchSequence;

    root.classList.add(THEME_SWITCHING_CLASS);
    root.dataset.theme = nextTheme;

    const releaseThemeSwitch = () => {
      if (switchSequence === themeSwitchSequence) {
        root.classList.remove(THEME_SWITCHING_CLASS);
      }
    };

    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(releaseThemeSwitch);
      });
    } else {
      releaseThemeSwitch();
    }
  }

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // Theme application still works when storage is unavailable.
    }
  }

  return nextTheme;
};
