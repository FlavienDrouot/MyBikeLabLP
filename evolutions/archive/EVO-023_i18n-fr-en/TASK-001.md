# TASK-001 — Install i18n packages and create `src/i18n.js`

## Objective

Add the four i18n runtime dependencies to `package.json` and create the `src/i18n.js` initialization module that configures i18next with browser-language detection (localStorage + navigator) and HTTP-backend loading of translation JSON files. Update `main.jsx` to await i18next initialization before mounting the React tree.

## Required context

- **Project**: `MyBikeLab/frontend/` — React 19 + Vite, deployed on GitHub Pages at base path `/MyBikeLabLP/`
- **Entry point**: `src/main.jsx` — renders `<App />` inside Redux `<Provider>`
- **Translation files location**: `public/locales/en.json` and `public/locales/fr.json` (created in TASK-002 and TASK-003)
- **Detection behavior**: on first visit with no stored preference, detect `navigator.language`; if it starts with `'fr'`, use French; otherwise use English. On return visit, restore from `localStorage`. Detection order: `['localStorage', 'navigator']`.
- **Fallback**: `'en'`
- **Supported languages**: `['en', 'fr']`
- **localStorage key**: `'mybikelab_lang'` (i18next's `lookupLocalStorage` option)
- **Namespace**: default `'translation'`; no multi-namespace setup needed

## Potentially impacted files

- `package.json` (add dependencies)
- `src/main.jsx` (await i18n init before render)
- `src/i18n.js` (new file)

## Inputs

- Current `package.json`:
  ```json
  "dependencies": {
    "@reduxjs/toolkit": "^2.11.2",
    "lucide-react": "^1.16.0",
    "react": "^19.2.5",
    "react-dom": "^19.2.5",
    "react-redux": "^9.2.0"
  }
  ```
- Current `src/main.jsx`:
  ```jsx
  import { StrictMode } from 'react';
  import { createRoot } from 'react-dom/client';
  import { Provider } from 'react-redux';
  import { store } from './store';
  import './index.css';
  import App from './App.jsx';

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>,
  );
  ```

## Expected outputs

### `package.json` — updated dependencies section
Add to `"dependencies"`:
```json
"i18next": "^23.x",
"i18next-browser-languagedetector": "^7.x",
"i18next-http-backend": "^2.x",
"react-i18next": "^14.x"
```
(Use latest stable versions compatible with React 19. Run `npm install` after updating.)

### `src/i18n.js` — new file
```js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['en', 'fr'],
    fallbackLng: 'en',
    defaultNS: 'translation',
    ns: ['translation'],
    backend: {
      loadPath: '/MyBikeLabLP/locales/{{lng}}.json',
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'mybikelab_lang',
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false, // React already escapes
    },
  });

export default i18n;
```

### `src/main.jsx` — updated
Import `./i18n.js` and await initialization before rendering:
```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import './index.css';
import './i18n.js';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
```

Note: importing `./i18n.js` triggers the `i18n.init()` call. react-i18next handles the async loading internally and will re-render components once translations are ready. The app may briefly show key strings on the very first cold load if translation files are slow to fetch — this is acceptable. To prevent this, you may optionally use the `Suspense` boundary approach with `react-i18next`'s `useSuspense` option (set `useSuspense: true` in the `initReactI18next` options and wrap `<App />` in `<Suspense fallback={null}>`). If you use Suspense, add the fallback; if not, leave as-is.

## Constraints

- Do not modify any component file in this task — this task only installs infrastructure
- The `loadPath` must include `/MyBikeLabLP/` to work on GitHub Pages
- The `lookupLocalStorage` key must be `'mybikelab_lang'` exactly
- Do not add `lng` as a hardcoded default — let the detector determine the language
- Do not introduce any other i18next plugins or options not listed above

## Dependencies

none

## Validation criteria

- [ ] `npm install` completes without errors after updating `package.json`
- [ ] `npm run dev` starts without errors in the console
- [ ] `npm run build` completes without errors
- [ ] No console error about missing translation files (files are created in TASK-002/003 — for this task alone, a 404 for the locales files is expected and acceptable)
- [ ] `i18next` is accessible from the browser console (`window.i18next` after attaching, or via React DevTools)
- [ ] The `src/i18n.js` module uses the exact `loadPath`, detection order, and localStorage key specified above

## Tests to implement

### Unit
- None for this task (infrastructure setup; no logic to unit-test independently)

### Integration
- Verify the app renders without React errors after this task is merged (even with missing translation files — key strings are acceptable at this stage)
