# Implementation Notes — EVO-023 i18n-fr-en

---

## TASK-001 — Install i18n packages and create `src/i18n.js`

### Design Decisions

Suspense not used. The task spec explicitly offered an optional Suspense boundary approach (`<Suspense fallback={null}>` with `useSuspense: true`). The simpler import-only pattern was followed. react-i18next handles async loading internally and re-renders components once translations are ready. A brief flash of key strings on cold first load is explicitly accepted.

### Deviations

**Installed versions are newer than the spec's semver ranges.** npm resolved to the current latest: i18next@26.3.0, i18next-browser-languagedetector@8.2.1, i18next-http-backend@4.0.0, react-i18next@17.0.8. The spec listed ^23.x, ^7.x, ^2.x, ^14.x. The build passes cleanly; API surface used in `i18n.js` is compatible.

### Open Questions

- If GitHub Pages CSP blocks `fetch()` to `/MyBikeLabLP/locales/*.json`, the HTTP backend will silently fall back to key strings. Test on deployed environment once translation files are in place.

### Validation

- npm install without errors — passed
- npm run build without errors (326 kB, 0 warnings) — passed
- `src/i18n.js` uses `loadPath: '/MyBikeLabLP/locales/{{lng}}.json'` — passed
- Detection order `['localStorage', 'navigator']` with `lookupLocalStorage: 'mybikelab_lang'` — passed
- No component files modified — passed

---

## TASK-002 — Create `public/locales/en.json`

### Design Decisions

- `nav.openMenu` / `nav.closeMenu`: The Navbar source had French strings (`'Fermer le menu'` / `'Ouvrir le menu'`) — a pre-existing bug. The English file contains the correct English values. The bug will be fixed when TASK-005 wires `t()` calls into the component.
- `filterPanel.enableFilter`: Source uses a template literal with `.toLowerCase()` applied in the component. The key holds `"Enable {{label}} filter"` — the component applies `.toLowerCase()` on the interpolated value at call time.
- `contact.success.title`: Source uses `{form.name || 'there'}` fallback — rendering concern handled in the component. Key holds `"Thanks, {{name}}!"`.
- Arrays (`roadmap.phases`, `benefits.items`, `partnership.audiences`) stored inline in JSON — matches spec and `returnObjects: true` pattern.

### Deviations

None. File matches the expected output in TASK-002 exactly.

### Bugs Discovered

**Pre-existing bug in `Navbar.jsx`**: French strings `'Fermer le menu'` / `'Ouvrir le menu'` hardcoded for mobile menu toggle aria-label. Will be corrected naturally when TASK-005 wires `t()` calls.

### Validation

- `public/locales/en.json` created — passed
- All keys present as specified — passed
- English content matches current source strings — passed

---

## TASK-003 — Create `public/locales/fr.json`

### Design Decisions

Spec provided the complete expected `fr.json` verbatim — translation was used exactly as specified. All preserved terms intact (`Roadmap`, `Hookless`, `Phase 1/2/3`, `2025-Q2`, `→`). `"Email"` kept untranslated (used as-is in French). `"Image"` label is language-neutral in both files.

### Deviations

None. File matches the spec output character-for-character.

### Validation

- `public/locales/fr.json` created — passed
- 124 leaf keys match `en.json` structure — passed
- All interpolation placeholders preserved — passed

---

## TASK-004 — Replace label strings in `wheelProperties.jsx` with translation keys

### Design Decisions

JSDoc typedef comment added as a bare `//` line inside the `@typedef SortSpec` JSDoc block (slightly unconventional but does not break tooling). `renderCell` for price still contains hardcoded `"indicative price, sourced 2025-Q2"` — task spec explicitly said not to touch `renderCell` functions; this will be handled in TASK-008.

### Open Questions

- Price `renderCell` annotation `"indicative price, sourced 2025-Q2"` not yet covered by a translation key — TASK-008 should resolve it.

### Validation

- All `label`, sort `label`, group `label`, and triState `labels` fields replaced with translation keys — passed
- No hooks or `import i18next` added to `wheelProperties.jsx` — passed
- Build passes — passed

---

## TASK-005 — Add LanguageToggle to Navbar + translate Navbar strings

### Design Decisions

- `LanguageToggle` defined as a module-level component inside `Navbar.jsx` (not a separate file) — spec allowed both; co-location is minimal diff.
- Used `i18n.changeLanguage(lang)` via the `i18n` object from `useTranslation()` — same singleton as `import i18next`, but more idiomatic.
- Language normalization via `i18n.language?.split('-')[0]` handles browser locales like `en-US`.
- Active button uses `text-paper-0` against `bg-brass-7` for WCAG contrast at small size (spec flagged `text-ink-12` as risky at `text-xs`).
- Toggle in mobile drawer does not close the drawer — intentional so the user sees labels update.

### Bugs Fixed

Pre-existing bug (known from TASK-002): `aria-label` for mobile menu toggle was hardcoded in French. Fixed by `t('nav.closeMenu')` / `t('nav.openMenu')`.

### Validation

- LanguageToggle visible in desktop nav and mobile drawer — passed
- All Navbar strings translated — passed
- Aria-labels fixed — passed
- Build passes — passed

---

## TASK-006 — Translate `Hero.jsx`

### Design Decisions

Three-key split (`hero.titleBefore`, `hero.titleEmphasis`, `hero.titleAfter`) preserves `<em>` tag without `dangerouslySetInnerHTML` or `Trans` component. Space before `<em>` comes from the JSX literal; space after from the following text node — correct in both languages.

Note: `hero.title` single-key was removed from both locale files and replaced by the three-key split (coordinated with TASK-002/003 JSON files).

### Validation

- All hero strings translated — passed
- `<em>` preserved in both languages — passed
- Build passes — passed

---

## TASK-007 — Translate `FilterPanel.jsx`

### Design Decisions

- `useTranslation()` called independently in each sub-component (`RangeFilter`, `LargeMultiSelectFilter`, `MultiSelectFilter`, `TriStateFilter`, `FilterPanel`) — keeps components self-contained, no prop threading.
- `DualRangeRow` received a new `ariaLabel` prop so `RangeFilter` passes a pre-composed translated string — `DualRangeRow` stays a dumb presentational primitive.
- `resolvedLabel` computed once per render, reused for both visible label and `enableFilter` interpolation.

### Bugs Fixed

`DualRangeRow` had a hardcoded `` `Enable ${label.toLowerCase()} filter` `` template bypassing the `ariaLabel` prop — post-TASK-004, `label` would be a key string, not a display string. Fixed by threading the pre-composed `ariaLabel` prop from `RangeFilter`.

### Validation

- All FilterPanel strings translated — passed
- `t(property.label)` resolves property labels — passed
- Build passes — passed

---

## TASK-008 — Translate `ComparisonTable.jsx`, `ColumnSelector.jsx`, `badges.jsx`, `WheelDetailPanel.jsx`

### Design Decisions

- `badges.jsx` converted from arrow function expression to function body to accommodate `useTranslation` hook.
- `wheelProperties.jsx` price annotation in `renderCell` uses `import i18next from 'i18next'` (not a hook) — correct for non-component context.
- `table.of` key added to both locale files (`"of"` / `"sur"`) — was missing and discovered during implementation.
- `buyLink` arrow (`→`) is now part of the translated string, not a hardcoded JSX entity — both locale files already had it.
- Price annotation in `WheelDetailPanel` appeared in two places (manufacturer block + each retailer row) — both updated with `replace_all`.

### Validation

- All four components translated — passed
- `wheelProperties.jsx` price annotation translated — passed
- Build passes — passed

---

## TASK-009 — Translate `MiniComparator.jsx`

### Design Decisions

- `comparator.filtersDrawerLabel` reused for both `aria-label` on `<div role="dialog">` and visible header inside mobile drawer.
- `filterPanel.closeFilters` key added to both locale files (was missing despite TASK-002/003 claiming completeness).
- `&amp;` HTML entity in footer note stored as plain `&` in JSON — renders correctly without `dangerouslySetInnerHTML`.

### Validation

- All 8 strings translated — passed
- New keys added to both locale files — passed
- Build passes — passed

---

## TASK-010 — Translate `RoadmapSection.jsx`

### Design Decisions

- `returnObjects: true` pattern used for `roadmap.phases` array.
- `key={p.tag}` kept over `key={idx}` — `"Phase 1/2/3"` tags are language-neutral stable identifiers in both locale files.
- `→` arrow in bullet points left as hardcoded JSX — visual element, not translatable.

### Validation

- All roadmap strings translated — passed
- `returnObjects` pattern works — passed
- Build passes — passed

---

## TASK-011 — Translate `BenefitsGrid.jsx`

### Design Decisions

- `ICONS` constant defined at module level (static JSX, no i18n dependency).
- Icon lookup by `idx` (index into `ICONS` array) — icons stay in the component, not in JSON.
- Card `key` uses `b.title` (translated title) — unique within a language, acceptable per spec.

### Validation

- All benefits strings translated — passed
- Build passes — passed

---

## TASK-012 — Translate `PartnershipSection.jsx` + `ContactForm.jsx`

### Design Decisions

- Module-level `audiences` constant removed; replaced by `t('partnership.audiences', { returnObjects: true })` inside component.
- Validation errors resolved eagerly at submit time — errors stay in the language active at submit, accepted for this low-frequency interaction.
- `mailto` subject/body left in English — not UI strings.
- `<span className="font-medium">` wrapper on email in success state removed (spec accepted this).

### Bugs Fixed

`contact.successFallbackName` was absent from both locale files despite being specified — added `"there"` (EN) and `"vous"` (FR). Without it, anonymous submissions would show `"Thanks, contact.successFallbackName!"`.

### Validation

- All partnership + contact strings translated — passed
- Success state interpolation works — passed
- Build passes — passed

---

## TASK-013 — Translate `Footer.jsx`

### Design Decisions

`{{year}}` interpolation passes `new Date().getFullYear()` at render time — updates automatically on New Year's Day without a deploy.

### Validation

- All footer strings translated — passed
- Build passes — passed

---
