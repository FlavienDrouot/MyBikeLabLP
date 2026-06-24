# Fix: Skip measurement for max-w-capped columns

- **ID:** fix-007
- **Date:** 2026-06-02
- **Status:** Done

---

## Context & Need

The comparison table measures column widths via a hidden `MeasuringTable` rendered on the full dataset (EVO-030). The columns `hub`, `freehubOptions`, and `spokes` each have a `max-w-[160px]` CSS class on their cells, which caps their display width to exactly 160 px. Passing these columns through the measurement cycle is therefore redundant — the result is predetermined by the CSS constraint.

---

## Acceptance Criteria

- [x] Columns with a declared `colWidth` in `ColumnSpec` are excluded from the `MeasuringTable` render
- [x] Their width is read directly from `colWidth` in `ComparisonTable` (via `getColWidth`)
- [x] `widthsReady` and `totalWidth` use `getColWidth` so the fixed layout still activates correctly
- [x] All existing column-widths tests pass unchanged

---

## Technical Tasks

### Task 1 — Declare `colWidth` on capped columns in `wheelProperties.jsx`

**Files:** `frontend/src/config/wheelProperties.jsx`
**What to do:**
- Add `colWidth?: number` to the `ColumnSpec` typedef
- Set `colWidth: 160` on `hub`, `freehubOptions`, and `spokes`

**Validation:** The three entries each have `colWidth: 160` alongside their `max-w-[160px]` cell class.

---

### Task 2 — Use `colWidth` in `ComparisonTable` and exclude those columns from `MeasuringTable`

**Files:** `frontend/src/components/MiniComparator/ComparisonTable.jsx`
**What to do:**
- Derive `measuringCols = cols.filter(p => !p.column?.colWidth)` (memoized)
- Add `getColWidth = (p) => colWidths[p.id] ?? p.column?.colWidth ?? 0`
- Replace `colWidths[p.id]` with `getColWidth(p)` in `widthsReady`, `totalWidth`, and `<colgroup>`
- Pass `measuringCols` instead of `cols` to `<MeasuringTable>`

**Validation:** `ComparisonTable.column-widths` tests pass; with `visibility={}` (only `model`), measurement and fixed layout still work as before.

---

## Implementation Notes

### Task 1
- `colWidth?: number` added to the `@typedef ColumnSpec` comment block
- `colWidth: 160` added to `hub`, `freehubOptions`, `spokes` — placed before `cellClassName` for readability

### Task 2
- `measuringCols` is `useMemo`-wrapped so its reference stays stable across renders (it feeds `MeasuringTable`'s `useLayoutEffect` deps)
- `getColWidth` is a plain inline function (not a hook) — reads `colWidths` state and falls back to `p.column?.colWidth`
- All existing tests pass; the `ComparisonTable.column-widths` suite uses `visibility={}` which only shows `model` (no `colWidth`) — no test changes needed
