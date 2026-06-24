# TASK-002 — Restructure MiniComparator: remove toolbar JSX, simplify grid, wire callbacks

## Objective

Remove all toolbar-related JSX from `MiniComparator.jsx` (the ColumnSelector placement blocks and the mobile Filters trigger button), simplify the CSS grid layout so it no longer has a first `auto` row reserved for the toolbar, and forward the required props (`visibility`, `columnOnToggle`, `onOpenFilters`, `filtersOpen`) to `ComparisonTable`.

## Required context

### File to modify

`frontend/src/components/MiniComparator/MiniComparator.jsx`

### Current layout structure (the grid div, line 39)

```jsx
<div className="mt-12 grid gap-x-6 lg:grid-cols-[320px_1fr] lg:grid-rows-[auto_1fr] w-fit mx-auto items-start">
```

This grid has two rows on desktop: `auto` (for the ColumnSelector above the table) and `1fr` (for the sidebar + table). After this evolution, the grid has one implicit row — the `lg:grid-rows-[auto_1fr]` class must be removed.

### Blocks to remove entirely

**Block 1 — ColumnSelector above the table (desktop only), lines 41–43:**
```jsx
{/* ColumnSelector: row 1, col 2 — desktop only */}
<div className="hidden lg:flex justify-end mb-3 lg:col-start-2 lg:row-start-1">
  <ColumnSelector visibility={visibility} onToggle={handleToggle} />
</div>
```

**Block 2 — Mobile Filters trigger button, lines 46–57:**
```jsx
{/* Mobile-only trigger: opens the filter drawer below lg */}
<div className="lg:hidden">
  <button
    type="button"
    onClick={() => setFiltersOpen(true)}
    aria-expanded={filtersOpen}
    aria-controls="filters-drawer"
    className="inline-flex items-center gap-2 rounded-xs border border-ink-4 bg-paper-0 px-4 py-2 text-sm font-semibold text-ink-11 hover:border-brass-8 hover:text-brass-8"
  >
    <Icon as={SlidersHorizontal} size={16} aria-hidden="true" />
    {t('comparator.filtersButton')}
  </button>
</div>
```

**Block 3 — Mobile ColumnSelector below the table, lines 98–100:**
```jsx
<div className="flex justify-end mb-3 lg:hidden">
  <ColumnSelector visibility={visibility} onToggle={handleToggle} />
</div>
```

### Grid column positions to update

After removing the toolbar row, the filter drawer div and the table div no longer need explicit `row-start` targeting:

**Filter drawer div (currently line 77):** remove `lg:row-start-2` from its class string.

**Table wrapper div (currently line 97):** the class `"min-w-0 lg:row-start-2"` becomes `"min-w-0"`.

### ComparisonTable call to update (currently line 101)

Before:
```jsx
<ComparisonTable visibility={visibility} />
```

After:
```jsx
<ComparisonTable
  visibility={visibility}
  columnOnToggle={handleToggle}
  onOpenFilters={() => setFiltersOpen(true)}
  filtersOpen={filtersOpen}
/>
```

### Imports to remove

After removing the two toolbar blocks, `SlidersHorizontal` (from `lucide-react`) is no longer used in `MiniComparator.jsx`. Remove it from the import statement. `Icon` may still be used inside the filter drawer's close button (line 88) — verify before removing.

`ColumnSelector` is no longer imported in `MiniComparator.jsx` once all three blocks above are removed. Remove its import line.

### Complete current import block (lines 1–8) for reference

```jsx
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SlidersHorizontal, X } from 'lucide-react';
import FilterPanel from './FilterPanel';
import ComparisonTable from './ComparisonTable';
import ColumnSelector from './ColumnSelector';
import Icon from '../ui/Icon';
import { getColumnProperties } from '../../config/wheelProperties';
```

After this task, `ColumnSelector` import is removed. `SlidersHorizontal` is removed from the lucide import. `Icon` stays (used in the drawer close button). All other imports stay.

## Potentially impacted files

- `frontend/src/components/MiniComparator/MiniComparator.jsx` (primary change)

## Inputs

- Completed TASK-001: `ComparisonTable` now accepts `visibility`, `columnOnToggle`, `onOpenFilters`, `filtersOpen`.

## Expected outputs

After this task:

1. The grid wrapper `<div>` class no longer contains `lg:grid-rows-[auto_1fr]`.
2. The ColumnSelector above-table block (desktop, row 1 col 2) is deleted.
3. The mobile Filters trigger button block is deleted.
4. The mobile ColumnSelector below-table block is deleted.
5. `lg:row-start-2` is removed from the filter drawer div's class.
6. `lg:row-start-2` is removed from the table wrapper div's class.
7. `ComparisonTable` is called with the four new props wired correctly.
8. `ColumnSelector` import is removed from `MiniComparator.jsx`.
9. `SlidersHorizontal` is removed from the lucide-react import in `MiniComparator.jsx`.
10. No other changes to `MiniComparator.jsx` — the filter drawer, backdrop, `filtersOpen` state, and `handleToggle` function are all preserved.

## Constraints

- The filter drawer (off-canvas drawer, backdrop, aria attributes, close button) must remain exactly as-is in `MiniComparator`. Do not touch it.
- `filtersOpen` state and its setter stay in `MiniComparator` — they are still needed to drive the drawer.
- `visibility` state and `handleToggle` stay in `MiniComparator` — they are forwarded as props, not moved.
- No new CSS files, no new components, no new state.
- Do not alter the `FilterPanel` component or its container.

## Dependencies

TASK-001

## Validation criteria

- [ ] The comparator renders a single grid on desktop: `lg:grid-cols-[320px_1fr]` (no `grid-rows`).
- [ ] No `ColumnSelector` is rendered outside of `ComparisonTable` (neither above the table on desktop nor below on mobile).
- [ ] No Filters trigger button is rendered outside of `ComparisonTable`.
- [ ] `ComparisonTable` receives all four new props and the header row behaves as specified in TASK-001.
- [ ] The filter drawer still opens and closes correctly on mobile.
- [ ] The backdrop still appears when the filter drawer is open.
- [ ] Column visibility toggle still works end-to-end (state in `MiniComparator`, toggled via `handleToggle`, forwarded to `ComparisonTable`, forwarded to `ColumnSelector`).
- [ ] No ESLint "unused import" warnings remain.
- [ ] Code review confirms no orphaned toolbar markup, no dead `row-start` grid classes, and no commented-out toolbar code.

## Tests to implement

### Unit
- None required for this evolution (PRD §10).

### Integration
- None required for this evolution (PRD §10).
