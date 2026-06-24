# TASK-009 — Translate `MiniComparator.jsx` section header and footer note

## Objective

Replace the hardcoded strings in `src/components/MiniComparator/MiniComparator.jsx` with `useTranslation` calls. This covers the section header, subtitle, mobile filter trigger button, and the footer note below the comparator.

## Required context

- **File**: `src/components/MiniComparator/MiniComparator.jsx`
- **i18n**: TASK-001. Use `useTranslation` from `react-i18next`.
- **Scope**: only strings in `MiniComparator.jsx` itself. FilterPanel, ComparisonTable, ColumnSelector, and WheelDetailPanel are handled in TASK-007 and TASK-008.

### Strings to translate

| Location | Current hardcoded string | Translation key |
|---|---|---|
| Section index label | `"COMPARATOR"` | `comparator.sectionIndex` |
| Section title `<h2>` | `"Road wheels: filter and compare"` | `comparator.title` |
| Section subtitle `<p>` | `"Filter and sort by brand, weight, rim depth, price, and many more."` | `comparator.subtitle` |
| Mobile filter button label | `"Filters"` | `comparator.filtersButton` |
| Filters drawer `aria-label` | `"Filters"` | `comparator.filtersDrawerLabel` |
| Mobile drawer header span | `"Filters"` | `comparator.filtersDrawerLabel` |
| Mobile close button `aria-label` | `"Close filters"` | `filterPanel.closeFilters` (add this key) |
| Footer note `<p>` | `"Sample dataset · Real prices & partners coming soon"` | `comparator.footerNote` |

Note: `"Close filters"` is a new key not in the initial TASK-002 spec. Add it:
- `en.json`: `"filterPanel": { ..., "closeFilters": "Close filters" }`
- `fr.json`: `"filterPanel": { ..., "closeFilters": "Fermer les filtres" }`

## Potentially impacted files

- `src/components/MiniComparator/MiniComparator.jsx`
- `public/locales/en.json` (add `filterPanel.closeFilters`)
- `public/locales/fr.json` (add `filterPanel.closeFilters`)

## Inputs

Current `MiniComparator.jsx` strings (relevant excerpts):
```jsx
<p className="t-section-index">COMPARATOR</p>
<h2 className="section-title mt-2">Road wheels: filter and compare</h2>
<p className="section-subtitle mx-auto">Filter and sort by brand, weight, rim depth, price, and many more.</p>

<button aria-controls="filters-drawer">
  <Icon as={SlidersHorizontal} />
  Filters
</button>

<div
  id="filters-drawer"
  role="dialog"
  aria-label="Filters"
>
  <div>
    <span>Filters</span>
    <button aria-label="Close filters">
      <Icon as={X} />
    </button>
  </div>
  ...
</div>

<p className="mt-8 text-center text-xs text-ink-7">
  Sample dataset · Real prices &amp; partners coming soon
</p>
```

## Expected outputs

Updated `MiniComparator.jsx`:
- Add `import { useTranslation } from 'react-i18next';`
- Inside `MiniComparator` component: `const { t } = useTranslation();`
- Apply `t()` to each string listed in the table above
- The `&amp;` HTML entity in the footer note becomes a plain `&` character inside the translation value — render with `{t('comparator.footerNote')}` (React handles string values safely; no need for `dangerouslySetInnerHTML`)

## Constraints

- Do not change any layout, visibility logic, mobile/desktop switching logic, or Redux state in this component
- The `aria-label` on the filter drawer must update when the language changes — using `t()` ensures this automatically
- The `aria-expanded` and `aria-controls` attributes are not translatable — leave them as-is

## Dependencies

TASK-001, TASK-002, TASK-003

## Validation criteria

- [ ] In French mode: section index displays "COMPARATEUR"
- [ ] In French mode: section title displays "Roues route : filtrer et comparer"
- [ ] In French mode: section subtitle displays in French
- [ ] In French mode: mobile filter trigger button displays "Filtres"
- [ ] In French mode: mobile drawer header and close button aria-label display in French
- [ ] In French mode: footer note displays in French
- [ ] `npm run build` passes

## Tests to implement

### Unit
- None

### Integration
- Switch to French; verify the comparator section header, subtitle, and footer note are in French
- On a narrow viewport (mobile), open the filters drawer; verify "Filtres" label and "Fermer les filtres" aria-label appear correctly
