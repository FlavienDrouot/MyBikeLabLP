# TASK-005 — Create FilterChips.jsx and wire into ComparisonTable.jsx

## Objective

Create `FilterChips.jsx` as a new component file. This component renders the active filter chip row above the comparison table whenever one or more filters are active. It reads Redux filter state directly and dispatches remove actions. Wire it into `ComparisonTable.jsx` between the toolbar row and the scrollable table area.

## Required context

**FilterChips.jsx does not exist in production.** The design system reference defines it as a standalone component (`design-system/ui_kits/comparator/FilterChips.jsx`).

**New file location:** `frontend/src/components/MiniComparator/FilterChips.jsx`

**Where to wire it:** `frontend/src/components/MiniComparator/ComparisonTable.jsx` — between the `<hr className="rule" />` and the empty-state / table scroll area.

**Redux state shape** (from `frontend/src/store/slices/filtersSlice` — read this file to confirm selector structure before implementing):
- Active filters are in `s.filters.filters` — an object keyed by property id, each with `{ value, enabled }`
- A filter is "active" when `enabled === true` AND `value` is non-default: non-empty array for multiSelect/multiSelectFlat, non-null for triState, value not equal to bounds for range
- Dispatch `setFilterValue({ id, value: [] })` to clear a multiSelect filter
- Dispatch `setFilterValue({ id, value: null })` to clear a triState filter
- Dispatch `resetFilters()` to clear all
- For range filters, "active" means `value.min !== bounds.min || value.max !== bounds.max`; resetting sets value back to bounds — use `setFilterValue({ id, value: { min: bounds.min, max: bounds.max } })`

**Property registry:** filterable properties are retrieved via `getFilterableProperties()` from `../../config/wheelProperties`. Each property has `id`, `label` (i18n key), `unit`, `filter.type` ('multiSelect' | 'multiSelectFlat' | 'triState' | 'range').

**Design system reference** (`comparator.css`, `.active-row` and `.active-chip`):
```css
.active-row {
  display: flex; flex-wrap: wrap; gap: 8px; align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--ink-3);
  margin-bottom: 16px;
}
.active-chip {
  background: var(--brass-3); border: 1px solid var(--brass-6);
  color: var(--brass-11);
  padding: 4px 10px; border-radius: 2px;
  font-size: 11px; font-weight: 500;
}
.active-chip .x { color: var(--brass-10); }
```

**PRD reference:** FR-004 (`brass-3` fill, `brass-6` border, `brass-11` text, `×` in `brass-10`, `border-radius: 2px`)

**Token mappings:**
- Chip: `bg-brass-3 border border-brass-6 text-brass-11 rounded-xs px-2.5 py-1 text-xs font-medium inline-flex items-center gap-1.5`
- Remove control `×`: `text-brass-10 cursor-pointer font-mono text-xs`
- Row wrapper: `flex flex-wrap gap-2 items-center py-3 border-b border-ink-3 mb-4`
- "Active" label: `text-[10px] font-bold uppercase tracking-[0.18em] text-ink-7 mr-1`
- "Clear all" button: `ml-auto text-xs font-semibold uppercase tracking-[0.1em] text-ink-8 hover:text-ink-12 bg-transparent border-0 cursor-pointer`

**Transition:** none required on the chip row itself — chips appear/disappear instantly as filters change (per motion guidelines: filter chip tap is 80ms or no animation).

## Potentially impacted files

- `frontend/src/components/MiniComparator/FilterChips.jsx` — new file (create)
- `frontend/src/components/MiniComparator/ComparisonTable.jsx` — add import and render the new component

## Inputs

- `frontend/src/store/slices/filtersSlice.js` — read to confirm state shape and action creators
- `frontend/src/config/wheelProperties.jsx` (or `.js`) — read to confirm `getFilterableProperties()` return shape
- `frontend/src/store/selectors/wheelsSelectors.js` — read to check if a bounds selector exists for range filter reset
- `design-system/ui_kits/comparator/FilterChips.jsx` — logic reference (chip-building pattern)
- `design-system/ui_kits/comparator/comparator.css` — `.active-row`, `.active-chip` styles

## Expected outputs

### FilterChips.jsx (new file)

```jsx
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  setFilterValue,
  resetFilters,
} from '../../store/slices/filtersSlice';
import { getFilterableProperties } from '../../config/wheelProperties';
import { makeSelectRangeBoundsFor } from '../../store/selectors/wheelsSelectors';

// Single chip — brass-tinted, removable.
const ActiveChip = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1.5 bg-brass-3 border border-brass-6 text-brass-11 px-2.5 py-1 rounded-xs text-xs font-medium">
    {label}
    <button
      type="button"
      aria-label={`Remove filter: ${label}`}
      onClick={onRemove}
      className="text-brass-10 font-mono text-xs leading-none cursor-pointer bg-transparent border-0 p-0"
    >
      ×
    </button>
  </span>
);

const FilterChips = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const filters = useSelector((s) => s.filters.filters);
  const filterables = useMemo(() => getFilterableProperties(), []);

  const chips = [];

  for (const property of filterables) {
    const filter = filters[property.id];
    if (!filter || !filter.enabled) continue;

    const { type } = property.filter;

    if (type === 'multiSelect' || type === 'multiSelectFlat') {
      if (!Array.isArray(filter.value) || filter.value.length === 0) continue;
      filter.value.forEach((v) => {
        const isAbsent = v === null || v === undefined || v === '';
        const valueLabel = isAbsent
          ? t('common.notAvailable')
          : property.translatable
          ? t(`${property.id}.${v}`)
          : String(v);
        chips.push({
          key: `${property.id}-${String(v)}`,
          label: `${t(property.label)}: ${valueLabel}`,
          onRemove: () => {
            const next = filter.value.filter((x) => x !== v);
            dispatch(setFilterValue({ id: property.id, value: next }));
          },
        });
      });
    }

    if (type === 'triState' && filter.value !== null) {
      const [, keyTrue, keyFalse] = property.filter.labels;
      const valueLabel = filter.value ? t(keyTrue) : t(keyFalse);
      chips.push({
        key: `${property.id}-tristate`,
        label: `${t(property.label)}: ${valueLabel}`,
        onRemove: () => dispatch(setFilterValue({ id: property.id, value: null })),
      });
    }

    // Range chips are omitted for now — range filters have no simple single-chip
    // representation. They are cleared via the reset button in FilterPanel.
    // If range chips are needed in a future evolution, add them here.
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 items-center px-5 py-3 border-b border-ink-3">
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-7 mr-1">
        {t('filterChips.active')}
      </span>
      {chips.map((c) => (
        <ActiveChip key={c.key} label={c.label} onRemove={c.onRemove} />
      ))}
      <button
        type="button"
        onClick={() => dispatch(resetFilters())}
        className="ml-auto text-xs font-semibold uppercase tracking-[0.1em] text-ink-8 hover:text-ink-12 bg-transparent border-0 cursor-pointer p-0"
      >
        {t('filterPanel.reset')}
      </button>
    </div>
  );
};

export default FilterChips;
```

**i18n note:** The `filterChips.active` key does not exist yet. Add it to both `fr.json` and `en.json` translation files:
- EN: `"filterChips": { "active": "Active" }`
- FR: `"filterChips": { "active": "Actifs" }`

Locate the translation files at `frontend/src/i18n/` (or equivalent path — read the directory before editing).

### ComparisonTable.jsx — wire FilterChips

Add import at the top of the file:
```jsx
import FilterChips from './FilterChips';
```

Insert `<FilterChips />` between the `<hr className="rule" />` and the empty-state / table scroll area:
```jsx
<hr className="rule" />
<FilterChips />

{wheels.length === 0 ? (
  ...
```

## Constraints

- `FilterChips` must return `null` when no chips are present — no empty wrapper div rendered
- Range filter chips are excluded from this component (see note in implementation above) — range filters are managed exclusively via `FilterPanel.jsx`
- The `×` remove control must be a `<button>` element with an `aria-label` for accessibility
- No inline `style` attributes for color or typography
- All transition/animation: none (chip row changes are immediate — 80ms or less per motion guidelines for filter chip taps)
- The "Clear all" button reuses the existing `filterPanel.reset` i18n key (same text, no new key needed — only `filterChips.active` is new)
- The `filterChips.active` i18n key must be added to both locale files; if the i18n files cannot be located, document this as a follow-up in a code comment

## Dependencies

none

## Validation criteria

- [ ] Active filter chip row appears when any multi-select or tri-state filter has a value
- [ ] Active chip row is hidden when no filters are active (returns null)
- [ ] Each chip shows `label: value` format with a `×` remove button
- [ ] Chip styling: `brass-3` fill, `brass-6` border, `brass-11` text (AC-003)
- [ ] Remove `×` renders in `brass-10` (FR-004)
- [ ] Chip shape: `rounded-xs` (2px radius, not pill) (FR-004)
- [ ] Clicking `×` removes that specific filter value; other active filters remain
- [ ] "Clear all" / reset button clears all filters
- [ ] No hardcoded hex values in `FilterChips.jsx`

## Tests to implement

### Unit
- Static scan: `grep -n '#[0-9a-fA-F]' FilterChips.jsx` returns zero matches

### Integration
- Apply a brand filter; verify chip row appears above the table with correct brass styling (AC-003)
- Click `×` on one chip; verify only that filter value is removed and the table updates
- Click "Clear all"; verify chip row disappears and all filters are reset
- Apply no filters; verify no chip row element is rendered in the DOM
