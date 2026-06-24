# TASK-007 — Translate `FilterPanel.jsx` — resolve all labels via `t()`

## Objective

Update `src/components/MiniComparator/FilterPanel.jsx` to use `useTranslation` for all user-facing strings and to resolve property labels, sort labels, group labels, and triState labels via `t()` instead of reading raw strings from the registry.

## Required context

- **File**: `src/components/MiniComparator/FilterPanel.jsx`
- **Dependency on TASK-004**: after TASK-004, `property.label`, `group.label`, `sort.label`, and `property.filter.labels` are all translation key strings. This component must call `t(key)` to resolve them.
- **i18n init**: `src/i18n.js` (TASK-001). Import `useTranslation` from `react-i18next`.
- **Architecture constraint**: `FilterPanel` is a complex component with several sub-components defined in the same file (`FilterToggle`, `DualRangeRow`, `Section`, `Pill`, `RangeFilter`, `MultiSelectFilter`, `LargeMultiSelectFilter`, `TriStateFilter`, `FilterField`). Each sub-component that renders a string from a prop or from the registry needs `t` passed in or obtained via its own `useTranslation()` call. The cleanest approach at this scale: call `useTranslation()` inside each sub-component that renders translated text.
- **TriState labels**: the `TriStateFilter` component currently reads `const [labelAll, labelTrue, labelFalse] = property.filter.labels;`. After TASK-004, these are translation keys. The component must call `t(labelAll)`, `t(labelTrue)`, `t(labelFalse)` to render the display strings.
- **Filter toggle aria-label**: currently `ariaLabel={\`Enable ${property.label.toLowerCase()} filter\`}`. After TASK-004, `property.label` is a key. The ariaLabel must become `t('filterPanel.enableFilter', { label: t(property.label).toLowerCase() })` using the interpolated key from `en.json` / `fr.json`.
- **Sort option labels**: currently rendered as `{s.label}` inside `<option>` elements. After TASK-004, `s.label` is a key. Render as `{t(s.label)}`.
- **Group section titles**: currently `{group.label}` in `<Section title={group.label}>`. After TASK-004, `group.label` is a key. Pass `t(group.label)` to the `title` prop.
- **Property labels in filter headers**: `property.label` is now a key. Render as `{t(property.label)}`.

### Strings to translate in this file

| Location | Current hardcoded string | Translation key |
|---|---|---|
| Panel heading | `"Filters"` | `filterPanel.heading` |
| Reset button | `"Reset"` | `filterPanel.reset` |
| "Sort by" label | `"Sort by"` | `filterPanel.sortBy` |
| Search placeholder (LargeMultiSelect) | `"Search…"` | `filterPanel.searchPlaceholder` |
| No results (LargeMultiSelect) | `"No results"` | `filterPanel.noResults` |
| Filter toggle aria-label | `` `Enable ${property.label.toLowerCase()} filter` `` | `filterPanel.enableFilter` with `{{label}}` interpolation |
| Sort option labels | `s.label` (now a key after TASK-004) | `t(s.label)` |
| Group section titles | `group.label` (now a key after TASK-004) | `t(group.label)` |
| Property labels in filter headers | `property.label` (now a key after TASK-004) | `t(property.label)` |
| TriState labels | `property.filter.labels[0..2]` (now keys after TASK-004) | `t(labelKey)` for each |

## Potentially impacted files

- `src/components/MiniComparator/FilterPanel.jsx`

## Inputs

Current `FilterPanel.jsx` strings (key excerpts for reference):

```jsx
// Panel heading and reset
<h3>Filters</h3>
<button>Reset</button>

// Sort by label
<label>Sort by</label>
<option key={s.id} value={s.id}>{s.label}</option>

// Section title (group label)
<Section key={group.id} title={group.label} defaultOpen={idx === 0}>

// Property label in DualRangeRow
<span>{label}</span>  // label prop comes from property.label

// FilterToggle ariaLabel
ariaLabel={`Enable ${property.label.toLowerCase()} filter`}

// Property label in filter header (MultiSelect, TriState)
<span>{property.label}</span>

// TriState labels
const [labelAll, labelTrue, labelFalse] = property.filter.labels;
// ... rendered as {labelAll}, {labelTrue}, {labelFalse}

// LargeMultiSelectFilter
<input placeholder="Search…" />
<li>No results</li>
```

## Expected outputs

Key changes to `FilterPanel.jsx`:

1. Add `import { useTranslation } from 'react-i18next';` at the top.

2. In `FilterPanel` (main component): add `const { t } = useTranslation();` and apply:
   - `t('filterPanel.heading')` for the "Filters" heading
   - `t('filterPanel.reset')` for the Reset button
   - `t('filterPanel.sortBy')` for the "Sort by" label
   - `t(s.label)` for each sort `<option>`
   - `t(group.label)` passed to `<Section title={...}>`

3. In `DualRangeRow`: the `label` prop it receives is now a resolved display string (the parent `RangeFilter` resolves it before passing down). No change needed inside `DualRangeRow` itself — the parent `RangeFilter` passes `t(property.label)` as the `label` prop.

4. In `RangeFilter`: add `const { t } = useTranslation();` and pass `label={t(property.label)}` to `<DualRangeRow>`. Also update the `FilterToggle` ariaLabel:
   ```jsx
   ariaLabel={t('filterPanel.enableFilter', { label: t(property.label).toLowerCase() })}
   ```
   (The `<DualRangeRow>` calls `FilterToggle` with `ariaLabel` received as a prop — so the ariaLabel must be constructed in `RangeFilter` and passed through, or `DualRangeRow` must construct it itself. Simplest: `DualRangeRow` receives the already-composed ariaLabel string from `RangeFilter`.)

5. In `MultiSelectFilter` and `LargeMultiSelectFilter`: add `const { t } = useTranslation();` and apply:
   - `t(property.label)` for the property label display
   - `t('filterPanel.enableFilter', { label: t(property.label).toLowerCase() })` for the FilterToggle ariaLabel
   - `t('filterPanel.searchPlaceholder')` for the search input placeholder (LargeMultiSelectFilter only)
   - `t('filterPanel.noResults')` for the empty list message (LargeMultiSelectFilter only)

6. In `TriStateFilter`: add `const { t } = useTranslation();` and apply:
   ```jsx
   const [keyAll, keyTrue, keyFalse] = property.filter.labels; // now keys after TASK-004
   const labelAll = t(keyAll);
   const labelTrue = t(keyTrue);
   const labelFalse = t(keyFalse);
   ```
   - `t(property.label)` for the property label display
   - `t('filterPanel.enableFilter', { label: t(property.label).toLowerCase() })` for the FilterToggle ariaLabel

## Constraints

- Do not change any filter logic, Redux dispatch calls, memoized selectors, or component structure
- Do not add new props to sub-components beyond what is necessary to pass resolved strings down
- The `filterPanel.enableFilter` interpolation must use the `{{label}}` placeholder from the JSON key — do not construct the string manually with string concatenation
- After this task, the filter panel must display all labels in the active language instantly when the language is switched
- All aria-labels must also update when the language is switched (since they use `t()`, this is automatic)

## Dependencies

TASK-001, TASK-002, TASK-003, TASK-004

## Validation criteria

- [ ] "Filters" heading displays as "Filtres" in French
- [ ] "Reset" button displays as "Réinitialiser" in French
- [ ] "Sort by" label displays as "Trier par" in French
- [ ] All sort options in the dropdown display translated labels in French (e.g., "Poids (léger → lourd)")
- [ ] Group section titles display in French ("Caractéristiques générales", "Jantes", "Sous-composants")
- [ ] Property labels in filter headers display in French ("Poids", "Prix", "Diamètre", etc.)
- [ ] TriState pills display in French ("Tous", "Hookless", "Avec crochet")
- [ ] The search placeholder in LargeMultiSelectFilter displays as "Rechercher…" in French
- [ ] The no-results message displays as "Aucun résultat" in French
- [ ] Filter toggle aria-labels update to French (verifiable via browser accessibility inspector)
- [ ] All filter functionality (enable/disable, range sliders, multiselect, tristate) works identically in both languages
- [ ] `npm run build` passes

## Tests to implement

### Unit
- None

### Integration
- Switch to French; open the filter panel (mobile drawer or desktop sidebar); verify all labels are in French
- Apply a filter in French mode; verify results update correctly
- Reset filters in French mode; verify reset works
