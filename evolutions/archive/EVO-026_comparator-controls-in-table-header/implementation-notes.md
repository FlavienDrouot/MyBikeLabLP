# Implementation Notes — EVO-026

## TASK-001 — Add action-button props to ComparisonTable

**File modified:** `frontend/src/components/MiniComparator/ComparisonTable.jsx`

**What was done:**
- Added `SlidersHorizontal` to the lucide-react import.
- Added `import ColumnSelector from './ColumnSelector'`.
- Extended the component signature with four new props: `visibility`, `columnOnToggle`, `onOpenFilters`, `filtersOpen`.
- In the existing `justify-between` header `<div>`, added a right-side container (`flex items-center gap-2`) with:
  - A Filters button wrapped in `lg:hidden`, with `onClick={onOpenFilters}`, `aria-expanded={filtersOpen}`, `aria-controls="filters-drawer"`, and the standard transition style.
  - `<ColumnSelector visibility={visibility} onToggle={columnOnToggle} />` — no visibility wrapper, renders on all viewports.

**Validation:** All criteria passed. ESLint: zero errors.

---

## TASK-002 — Restructure MiniComparator: remove toolbar, simplify grid, wire callbacks

**File modified:** `frontend/src/components/MiniComparator/MiniComparator.jsx`

**What was done:**
1. Removed `SlidersHorizontal` from lucide-react import; removed `ColumnSelector` import.
2. Removed `lg:grid-rows-[auto_1fr]` from the grid wrapper `<div>`.
3. Deleted the `hidden lg:flex` desktop ColumnSelector block (row 1, col 2).
4. Deleted the `lg:hidden` mobile Filters trigger button block.
5. Removed `lg:row-start-2` from the filter sidebar container.
6. Removed `lg:row-start-2` from the table wrapper; deleted the mobile ColumnSelector div inside it.
7. Wired all four new props into `ComparisonTable`: `visibility`, `columnOnToggle={handleToggle}`, `onOpenFilters={() => setFiltersOpen(true)}`, `filtersOpen={filtersOpen}`.

**Validation:** All criteria passed. No dead grid classes, no orphaned toolbar markup, no unused imports.
