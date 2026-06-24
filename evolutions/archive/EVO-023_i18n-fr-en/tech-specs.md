# Technical Specifications

## 1. General Information

- Evolution ID: EVO-023
- PRD reference: `MyBikeLab/evolutions/EVO-023_i18n-fr-en/prd.md`
- Author: Flavien Drouot
- Date: 2026-05-28

---

## 2. Technical Context

### Technical objective

Install react-i18next with browser-language detection and localStorage persistence, externalize all user-facing strings from every component and from the wheel property registry into two JSON translation files (EN + FR), and add a language toggle to the Navbar — without modifying the URL or any non-UI logic.

### Affected architecture

- **i18n bootstrap**: new `src/i18n.js` module, initialized before React mounts in `main.jsx`
- **Translation files**: new `public/locales/en.json` and `public/locales/fr.json`
- **Navbar**: receives a new `LanguageToggle` sub-component
- **wheelProperties.jsx**: all human-readable label strings replaced by translation key strings
- **FilterPanel.jsx**, **ComparisonTable.jsx**, **ColumnSelector.jsx**: call `t()` to resolve property labels, column-group labels, and sort option labels
- **Hero.jsx**, **RoadmapSection.jsx**, **BenefitsGrid.jsx**, **PartnershipSection.jsx**, **Footer.jsx**, **ContactForm.jsx**: all hardcoded strings replaced by `t()` calls
- **badges.jsx**: `HookBadge` rendered labels resolved through `useTranslation`
- **package.json**: three new runtime dependencies

### Impacted modules

| File | Nature of change |
|---|---|
| `package.json` | Add `i18next`, `react-i18next`, `i18next-browser-languagedetector`, `i18next-http-backend` |
| `src/main.jsx` | Import and await `i18n.js` before rendering |
| `src/i18n.js` | New file — i18next init with detector + HTTP backend |
| `public/locales/en.json` | New file — all English strings |
| `public/locales/fr.json` | New file — all French strings |
| `src/config/wheelProperties.jsx` | Labels and sort labels become translation key strings |
| `src/components/Navbar.jsx` | Add `LanguageToggle`; translate nav labels |
| `src/components/Hero.jsx` | Translate all strings |
| `src/components/MiniComparator/MiniComparator.jsx` | Translate section header and footer note |
| `src/components/MiniComparator/FilterPanel.jsx` | Use `t()` for property labels, group labels, sort labels, "Filters" heading, "Reset" button, "Sort by" label, "Search…" placeholder, "No results" message |
| `src/components/MiniComparator/ComparisonTable.jsx` | Use `t()` for column headers, "Wheels" heading, empty state |
| `src/components/MiniComparator/ColumnSelector.jsx` | Use `t()` for column labels, group labels, "Columns" button |
| `src/components/MiniComparator/WheelDetailPanel.jsx` | Translate "Manufacturer", "Where to buy", "Buy →", "No affiliate links…", price annotation |
| `src/components/MiniComparator/badges.jsx` | Translate "Hookless" / "Hooked" badge labels |
| `src/components/RoadmapSection.jsx` | Translate all content via returnObjects |
| `src/components/BenefitsGrid.jsx` | Translate all content via returnObjects |
| `src/components/PartnershipSection.jsx` | Translate all content |
| `src/components/ContactForm.jsx` | Translate labels, errors, success state |
| `src/components/Footer.jsx` | Translate copyright and nav labels |

---

## 3. Technical Constraints

- Stack: React 19 + Vite; no server-side rendering
- Deployment: GitHub Pages at base path `/MyBikeLabLP/`; translation JSON files must be served from `public/locales/` and the HTTP backend path must account for the Vite base path
- `wheelProperties.jsx` is not a React component — no hooks, no `useTranslation`; label fields become opaque translation key strings
- i18next must be fully initialized before the React tree mounts (use `i18next.init()` as a promise, awaited in `main.jsx`)
- No URL changes (FR-007); no `react-router-dom` required for this evolution
- Architecture must allow future URL-prefix routing without changes to translation files or key structure (FR-008)
- Language detection order: `localStorage` first, then `navigator.language`; fallback language is `'en'`
- Supported languages: `['en', 'fr']` — any other detected language falls back to `'en'`
- French translation content: AI-produced, no placeholders — actual French strings required in `fr.json`
- English content must be textually identical to current hardcoded strings (AC-011)

---

## 4. Architecture Decisions

### AD-001 — i18next stack: react-i18next + i18next-browser-languagedetector + i18next-http-backend

#### Description
Three packages are added as runtime dependencies:
- `i18next` — core engine
- `react-i18next` — React bindings (`useTranslation`, `I18nextProvider`)
- `i18next-browser-languagedetector` — localStorage + navigator detection (covers FR-001, FR-003)
- `i18next-http-backend` — loads JSON from `public/locales/` at runtime

#### Motivation
`react-i18next` is the validated library choice (needs-assessment). The detector plugin implements the exact behavior specified in FR-001 and FR-003 without custom logic. The HTTP backend keeps translation files out of the JS bundle and makes adding a third language trivial.

#### Rejected alternatives
- `react-intl`: verbose API, no built-in detection, not the validated choice
- Bundling JSON directly into the bundle via Vite imports: slightly simpler setup, but all translations always loaded; does not scale to future languages
- Custom detection + localStorage logic: duplicates behavior that the detector plugin provides reliably

---

### AD-002 — Translation keys replace label strings in `wheelProperties.jsx`

#### Description
Every `label` field, sort option `label`, and `filter.labels` array in `wheelProperties.jsx` becomes a translation key string (e.g., `'properties.weight.label'`). Consuming components (`FilterPanel`, `ComparisonTable`, `ColumnSelector`) call `t(property.label)` to resolve the display string. The TypeScript JSDoc comment for `WheelProperty.label` is updated to note that the field is a translation key.

The `COLUMN_GROUPS` array entries have their `label` field replaced by a translation key (e.g., `'properties.groups.general'`).

TriState `filter.labels` arrays are replaced by arrays of translation keys (e.g., `['filters.hookless.all', 'filters.hookless.hookless', 'filters.hookless.hooked']`).

Sort `label` fields become translation keys (e.g., `'sorts.name_asc'`).

#### Motivation
`wheelProperties.jsx` is not a React component and cannot use hooks. Keeping keys in the registry ensures a single source of truth and avoids a parallel key-to-label mapping.

#### Rejected alternatives
- Separate key-to-label map: two sources of truth that must stay in sync
- Passing a `t` function into registry accessors: changes the module API surface and requires all 4+ call sites to be updated

---

### AD-003 — LanguageToggle as a standalone component inside Navbar

#### Description
A new `LanguageToggle` component is created (either as a separate file or as a local component within `Navbar.jsx`). It reads the active language from `i18next.language` via `useTranslation` and calls `i18next.changeLanguage(lang)` on click. It renders two buttons labeled `EN` and `FR`; the active one reflects its active state visually. It is placed in the Navbar desktop row and remains visible in the mobile drawer.

#### Motivation
i18next manages its own language state reactively — `useTranslation` re-renders subscribers when the language changes. No Redux slice needed. A dedicated component isolates the toggle logic from the Navbar's own state (mobile menu open/close).

#### Rejected alternatives
- Storing language in Redux: duplicates i18next's own state management; adds indirection with no benefit
- Inline toggle logic in Navbar: harder to test and reason about in isolation

---

### AD-004 — Translation files at `public/locales/{lang}.json` with HTTP backend

#### Description
Translation files are placed at `frontend/public/locales/en.json` and `frontend/public/locales/fr.json`. The i18next HTTP backend is configured with `loadPath: '/MyBikeLabLP/locales/{{lng}}.json'` (matching the Vite base path for GitHub Pages).

A single default namespace `'translation'` is used. All keys live flat in one JSON object per language.

#### Motivation
Static files in `public/` are served as-is by Vite and GitHub Pages. The HTTP backend fetches only the needed locale file, keeping the initial JS bundle lean. The path must include the `/MyBikeLabLP/` base to work correctly on GitHub Pages.

#### Rejected alternatives
- Vite JSON imports bundled into JS: works locally but loads all translations regardless of active language; harder to extend with a third language later

---

## 5. Task Breakdown

Each task is described in a dedicated file.

| Task | File | Summary | Dependencies |
|---|---|---|---|
| TASK-001 | `TASK-001.md` | Install i18n packages and create `src/i18n.js` init module | none |
| TASK-002 | `TASK-002.md` | Create `public/locales/en.json` with all English strings extracted from the codebase | TASK-001 |
| TASK-003 | `TASK-003.md` | Create `public/locales/fr.json` with complete French translations | TASK-002 |
| TASK-004 | `TASK-004.md` | Replace label/sort/group strings in `wheelProperties.jsx` with translation keys | TASK-002 |
| TASK-005 | `TASK-005.md` | Add `LanguageToggle` to `Navbar.jsx` and translate Navbar strings | TASK-001, TASK-002, TASK-003 |
| TASK-006 | `TASK-006.md` | Translate `Hero.jsx` | TASK-001, TASK-002, TASK-003 |
| TASK-007 | `TASK-007.md` | Translate `FilterPanel.jsx` — resolve property labels, group labels, sort labels, and UI strings via `t()` | TASK-001, TASK-002, TASK-003, TASK-004 |
| TASK-008 | `TASK-008.md` | Translate `ComparisonTable.jsx`, `ColumnSelector.jsx`, `badges.jsx`, and `WheelDetailPanel.jsx` | TASK-001, TASK-002, TASK-003, TASK-004 |
| TASK-009 | `TASK-009.md` | Translate `MiniComparator.jsx` section header and footer note | TASK-001, TASK-002, TASK-003 |
| TASK-010 | `TASK-010.md` | Translate `RoadmapSection.jsx` using returnObjects pattern | TASK-001, TASK-002, TASK-003 |
| TASK-011 | `TASK-011.md` | Translate `BenefitsGrid.jsx` using returnObjects pattern | TASK-001, TASK-002, TASK-003 |
| TASK-012 | `TASK-012.md` | Translate `PartnershipSection.jsx` and `ContactForm.jsx` | TASK-001, TASK-002, TASK-003 |
| TASK-013 | `TASK-013.md` | Translate `Footer.jsx` | TASK-001, TASK-002, TASK-003 |

### Dependency graph

```
TASK-001 (install + i18n.js)
    └── TASK-002 (en.json)
            └── TASK-003 (fr.json)          [can run in parallel with TASK-004..TASK-013 after TASK-002]
            └── TASK-004 (wheelProperties keys)
                    └── TASK-007 (FilterPanel)
                    └── TASK-008 (ComparisonTable + ColumnSelector + badges + WheelDetailPanel)
            └── TASK-005 (Navbar + LanguageToggle)
            └── TASK-006 (Hero)
            └── TASK-009 (MiniComparator header)
            └── TASK-010 (RoadmapSection)
            └── TASK-011 (BenefitsGrid)
            └── TASK-012 (PartnershipSection + ContactForm)
            └── TASK-013 (Footer)
```

Tasks TASK-005 through TASK-013 all require TASK-001, TASK-002, and TASK-003 to be complete (they need both translation files to exist and the i18n init to be in place). TASK-007 and TASK-008 additionally require TASK-004.

---

## 6. Global Validation Strategy

### Unit validation
- Not applicable for this evolution (PRD explicitly excludes automated tests; existing test suite uses `renderToStaticMarkup` which does not run i18next)

### Integration validation
- Run `npm run build` — build must succeed with no errors
- Run `npm run dev` and open the site in browser — no console errors related to missing translation keys

### Functional validation
- AC-001 through AC-011 as defined in the PRD — all manual
- Verify the toggle is keyboard-accessible (tab focus, Enter/Space activation)
- Verify no layout breaks in French (French strings are typically 20-30% longer than English)

### Non-regression validation
- AC-011: compare every section in English mode against pre-evolution content; verify no string was modified
- Comparator interactive features (filtering, sorting, column show/hide) must work identically in both languages

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|---|---|---|
| HTTP backend path misconfigured for GitHub Pages base path | Translation files not found at runtime; entire site shows key strings instead of text | Configure `loadPath: '/MyBikeLabLP/locales/{{lng}}.json'` explicitly; test on `npm run preview` before deploying |
| i18next not fully initialized when React renders | First render shows key strings for a frame | Await `i18next.init()` before calling `createRoot().render()` in `main.jsx` |
| French strings longer than English cause layout overflow | Text wraps unexpectedly in navigation bar, buttons, or table headers | Manual layout verification in French mode; Navbar toggle must remain compact (`EN` / `FR` are fixed-width labels) |
| Missing translation key in JSON | Falls back to key string visible to user | Use `missingKeyHandler` in development mode to log warnings; audit keys after each task |
| `returnObjects: true` pattern returns undefined if key path is wrong | Component crashes or renders nothing | Validate JSON structure matches the shape the component expects before merging each task |

---

## 8. Rollback Plan

- All changes are isolated to new files and modifications to existing components
- Reverting this evolution: remove the four new npm packages, delete `src/i18n.js`, delete `public/locales/`, revert all component files to their pre-evolution state via git
- No Redux store changes, no data schema changes, no API changes — rollback scope is entirely frontend source files
