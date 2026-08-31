import { getStoredTheme } from './lib/theme';

document.documentElement.dataset.theme = getStoredTheme();
