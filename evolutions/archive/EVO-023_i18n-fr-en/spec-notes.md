# Spec Notes — EVO-023 i18n FR/EN

## PRD interpretations

### ContactForm is in scope
The PRD lists the Partnership section as in scope (FR-004). ContactForm is embedded in PartnershipSection. Its hardcoded strings (field labels, placeholder hint "Search…", validation errors, submit button, success state) are user-facing and must be translated. The PRD does not call it out explicitly, but omitting it would leave visible English strings in French mode and fail AC-006.

### The `indicative price, sourced 2025-Q2` annotation
This string appears in `WheelDetailPanel.jsx` and in the `price` property's `renderCell` in `wheelProperties.jsx`. It is a visible UI string (not a wheel model name or numeric spec), so it is in scope for translation. However, it contains a data timestamp (`2025-Q2`) that is language-neutral. The French translation will be `prix indicatif, source 2025-Q2`.

### The "Buy →" link label
The `Buy →` text with the arrow in `WheelDetailPanel.jsx` is a UI action label, not a wheel spec. It is in scope. French: `Acheter →`.

### `HookBadge` — "Hookless" / "Hooked" values
These labels in `badges.jsx` are displayed as cell values in the comparison table. They are UI labels (not wheel model names), so they are in scope. They do not live in a translation file today. The badge renders a boolean, so it must call `t()` to resolve the correct label at render time.

### TriState filter labels ("All", "Hookless", "Hooked")
These are declared directly in `wheelProperties.jsx` under `filter.labels`. They are UI strings and must be translated. Because `wheelProperties.jsx` is a static module (not a React component), it cannot call `useTranslation()`. Decision: the `TriStateFilter` component in `FilterPanel.jsx` will resolve translated labels using `t()` instead of reading them from `property.filter.labels`. The `labels` field in the registry will be replaced by a stable array of translation keys (e.g., `['filters.hookless.all', 'filters.hookless.hookless', 'filters.hookless.hooked']`).

### Sort option labels in `wheelProperties.jsx`
Sort labels (e.g., `'Name (A → Z)'`, `'Weight (light → heavy)'`) are used inside `<option>` elements in `FilterPanel.jsx`. They live in `wheelProperties.jsx` as static strings. Same problem as triState labels: `wheelProperties.jsx` cannot use hooks. Decision: sort labels are replaced by translation keys in `wheelProperties.jsx`; `FilterPanel.jsx` resolves them with `t()` at render time.

### Column group labels in `COLUMN_GROUPS`
`COLUMN_GROUPS` contains labels `'General specs'`, `'Rims'`, `'Subcomponents'`. These are rendered in `FilterPanel.jsx` (Section titles) and `ColumnSelector.jsx` (group headers). Same approach: replace the `label` field with a translation key string (e.g., `'properties.groups.general'`), resolved with `t()` in the consuming components.

### Property `label` fields in `wheelProperties.jsx`
Each property has a `label` used in `FilterPanel.jsx` (filter headers), `ComparisonTable.jsx` (column headers), and `ColumnSelector.jsx` (column checkboxes). They will be replaced by translation keys (e.g., `'properties.weight.label'`), resolved with `t()` in each consuming component.

### `wheelProperties.jsx` remains a non-React module
The file currently uses `.jsx` extension only because it contains JSX in `renderCell` functions (e.g., `HookBadge`, image cells). It imports no React hooks. This will stay unchanged. All string fields in the registry that are currently human-readable labels become translation key strings. The consuming components are responsible for resolving them.

### `aria-label` attributes referencing property labels
`FilterPanel.jsx` uses `ariaLabel={`Enable ${property.label.toLowerCase()} filter`}`. After replacing `property.label` with a key, this becomes `ariaLabel={`Enable ${t(property.label).toLowerCase()} filter`}`. This is acceptable and keeps aria labels translated.

### Browser language detection — regional variants
The PRD does not specify how to handle `fr-CA` or `en-GB` variants. Decision: use `navigator.language.startsWith('fr')` to detect French; everything else falls back to English. This covers all `fr-*` variants as French, and all `en-*` and other variants as English.

### `localStorage` key name
The PRD specifies persistence in localStorage but leaves the key name to implementation. Decision: use `'mybikelab_lang'` as the key. Simple, namespaced, unlikely to collide.

### i18next `lng` detection order
react-i18next's `LanguageDetector` plugin supports automatic detection from `navigator.language` and `localStorage`. Decision: use the `i18next-browser-languagedetector` plugin with detection order `['localStorage', 'navigator']` and cache set to `localStorage`. This covers FR-001, FR-002, FR-003, and UC-006 without custom detection logic.

### URL stability — no `react-router-dom` required for this evolution
FR-007 says no URL changes. FR-008 says the system must be extensible for future URL routing. Decision: the i18n setup uses `i18next` directly without URL routing for this evolution. Future URL routing will layer `react-router-dom` on top; the translation system (files, keys, `useTranslation` hooks) will require no changes.

### Translation file location
`locales/` directory under `frontend/public/` — this makes the JSON files served as static assets, compatible with Vite's asset pipeline and GitHub Pages. Path: `frontend/public/locales/en.json` and `frontend/public/locales/fr.json`. react-i18next's `HttpBackend` plugin loads them at runtime via fetch.

### Single translation namespace
All keys live in a single `translation` namespace (the i18next default). There is no structural reason to split into multiple namespaces at this scale. This simplifies the setup significantly.

### Roadmap section — hardcoded `phases` array
`RoadmapSection.jsx` defines a `phases` array of objects with `tag`, `status`, `title`, `description`, and `points` (array of strings). All these strings are UI copy and must be translated. Decision: move the array definition into the translation files rather than keeping it in JSX. The component iterates `t('roadmap.phases', { returnObjects: true })` and renders the result. This keeps the component logic clean.

### Benefits section — hardcoded `benefits` array
`BenefitsGrid.jsx` defines a `benefits` array with `title` and `description` per benefit. Same approach as roadmap: use `t('benefits.items', { returnObjects: true })`. The `icon` field is JSX and cannot go into JSON — it stays in the component, mapped by index.

### Partnership section — hardcoded `audiences` array
Same pattern as benefits and roadmap: `t('partnership.audiences', { returnObjects: true })`.

---

## Architecture decision rationale

### AD-001 — react-i18next + i18next-browser-languagedetector + i18next-http-backend
Three packages compose the full i18n stack:
- `i18next`: the core translation engine
- `react-i18next`: React bindings (`useTranslation`, `I18nextProvider`)
- `i18next-browser-languagedetector`: handles FR-001 and FR-003 automatically (localStorage + navigator.language detection chain)
- `i18next-http-backend`: loads JSON files from `public/locales/` at runtime

Alternatives considered:
- `react-intl` (FormatJS): more verbose API, no built-in detection, heavier
- Custom solution: more code to maintain, detection + persistence logic to write and test
- Bundling translations directly in JS: increases initial bundle size; HTTP backend allows lazy loading and is simpler to extend

### AD-002 — Translation keys replacing label strings in `wheelProperties.jsx`
The registry's `label` fields become translation key strings (e.g., `'properties.weight.label'`). All consuming components (FilterPanel, ComparisonTable, ColumnSelector) call `t(property.label)` or `t(property.sortKey)` to resolve the display string.

Alternative considered: keep human-readable English labels in the registry and build a separate key-to-label map. Rejected: creates two sources of truth that must stay in sync; adds complexity with no benefit.

Alternative considered: make `wheelProperties.jsx` accept a `t` function as argument. Rejected: changes the module's API and requires all call sites to pass `t()`.

### AD-003 — LanguageToggle as a standalone component added to Navbar
The toggle is a small, self-contained component. It reads the active language from `i18next.language` and calls `i18next.changeLanguage()`. It is rendered inside Navbar without requiring a Redux slice (i18next manages its own state reactively through `useTranslation`).

Alternative considered: storing language in Redux. Rejected: i18next already manages language state and provides subscription via `useTranslation`. Duplicating it in Redux adds indirection with no architectural benefit.

### AD-004 — `public/locales/` for JSON translation files
Translation files at `frontend/public/locales/{lang}.json` are served as static assets. The HTTP backend fetches them on app load.

Alternative considered: importing JSON directly into the bundle (Vite supports `import data from './locales/en.json'`). Rejected: all translations would be bundled together even for users who never switch language. The HTTP backend lazy-loads only the active language initially, with the other fetched on first toggle — better performance.

Note: at the current scale (two small JSON files), the performance difference is negligible. The HTTP backend approach is chosen because it matches the pattern used when the project will add a third or fourth language.

---

## Tradeoffs

### wheelProperties.jsx is not a React component — translation keys instead of `t()` calls
The downside is that the registry now contains opaque key strings instead of readable English labels. Developers adding a new property must know to write `'properties.newProp.label'` rather than `'New property'`. This is mitigated by the naming convention being explicit and consistent, and by the fact that each new property also requires a corresponding JSON entry.

### returnObjects for roadmap/benefits/partnership arrays
Using `t('roadmap.phases', { returnObjects: true })` couples the component to a specific JSON shape. If the JSON structure changes, the component must be updated. This is acceptable because the component and its translation content are co-owned and rarely split across teams.

### No automated tests for this evolution
The PRD explicitly states that acceptance criteria are best verified manually (language toggle, browser locale detection). The existing test suite uses `renderToStaticMarkup` which does not initialize i18next. Tests for translated components would require wrapping them in an `I18nextProvider` with mock translations — useful but out of scope for this spec, as confirmed by the PRD.

---

## Open questions

None. All scope and architectural decisions have been resolved.
