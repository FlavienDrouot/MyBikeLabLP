# Fix: Column-header sorting (replace sort dropdown)

- **ID:** fix-019
- **Date:** 2026-06-04
- **Status:** Done

---

## Context & Need

Sorting is currently driven by a `<select>` dropdown in the FilterPanel ("Sort by"), decoupled from the table the user is reading. We want the sort to live where the data is: each sortable column header becomes clickable, shows a visual sort indicator, and cycles **ascending → descending → reset** on successive clicks. Only one column is sorted at a time, and "reset" returns the list to the catalog (unsorted) order.

> **Scope note (FIX eligibility).** During Needs Assessment I recommended a Light EVO because this is a UX redesign of an existing interaction touching ~3 source files; the user explicitly chose the Fix path. The change is kept deliberately narrow and reuses the existing sort model (the `sortBy` string id and the registry's asc/desc `SortSpec` pairs) — no new state shape, no selector rewrite.

---

## Acceptance Criteria

- [ ] The "Sort by" dropdown is fully removed from the FilterPanel; no sort control remains in the filter panel.
- [ ] Every **measurable/sortable column** (those declaring an asc + desc sort in the registry: Price, Weight, Rim depth, External width, Internal width) shows a visual indicator in its header signalling it is sortable, even before any click.
- [ ] Non-sortable columns (image, model, brake type, hub, etc.) show no sort indicator and are not clickable for sorting.
- [ ] 1st click on a sortable header → ascending; 2nd click → descending; 3rd click → reset (no active column sort → base name A→Z order).
- [ ] The header indicator reflects the real state: neutral when inactive, `↑` when ascending, `↓` when descending — the active column rendered in the brass accent.
- [ ] Only one column is sorted at a time: clicking a different sortable column starts that column at ascending and clears the previous one.
- [ ] On load, no column is sorted; the list shows the base sort (name A→Z, as before this fix). Reset (3rd click) returns to that same base order.
- [ ] The header `<th>` exposes `aria-sort` (`none` / `ascending` / `descending`) and the clickable control is keyboard-operable with an accessible label.
- [ ] Sticky-header styling on `<th>` (`sticky top-0 z-10 bg-paper-1`) is preserved.

---

## Technical Tasks

<!-- One block per task. Keep inline: no separate TASK files. -->

### Task 1: Default to "no sort" (catalog order) as the reset target

**Files:** `frontend/src/store/slices/filtersSlice.js`

**What to do:** In `buildInitialState()`, set `sortBy: null` instead of `getDefaultSortId()`. `null` is already the canonical "no sort" value: `selectFilteredWheels` does `getAllSorts().find(s => s.id === sortBy)`, which returns `undefined` for `null`, and the comparator already returns `0` (stable catalog order) when no sort is found — so no selector change is required. The `setSortBy` reducer already accepts any payload including `null`. Leave `getDefaultSortId` in place (still exported); it simply becomes unused by the slice.

**Validation:** App loads with rows in catalog order; `filtersSlice` initial state has `sortBy: null`. Existing tests already mock `sortBy: null`, so no test breakage expected.

---

### Task 2: Make sortable column headers interactive with asc → desc → reset cycling and indicators

**Files:** `frontend/src/components/MiniComparator/ComparisonTable.jsx`

**What to do:**
1. Add `useDispatch` and import `setSortBy` from `../../store/slices/filtersSlice`.
2. Add a small registry-derived helper (inline in the component or a local function) that, given a column property `p`, reads `p.sorts` and returns `{ ascId, descId }` — `ascId` = the sort entry with `direction === 'asc'`, `descId` = `direction === 'desc'`. A column is "sortable here" when both exist. (This intentionally excludes the model column, whose only sort is a `localeCompare` and is out of scope per the measurable-columns decision.)
3. Replace `isSortedColumn` with state derived from the actual `sortBy` value:
   - `activeDir(p)` → `'asc'` if `sortBy === ascId`, `'desc'` if `sortBy === descId`, else `null`.
4. Add a click handler `cycleSort(p)`:
   - if current dir is `'asc'` → dispatch `setSortBy(descId)`
   - else if `'desc'` → dispatch `setSortBy(null)`
   - else → dispatch `setSortBy(ascId)`
5. In the `<thead>` `<th>` rendering, for sortable columns wrap the label in a keyboard-operable `<button type="button">` (full-width, inherits header alignment) that calls `cycleSort(p)`. Set `aria-label` using the existing i18n sort key (e.g. `t('sorts.price_asc')` / `t('sorts.price_desc')` describing the next action, or a generic `t(p.label)` + state). Render the indicator glyph after the label:
   - inactive sortable → dimmed glyph (`text-ink-5`, e.g. `↓` at reduced opacity, brightening on hover) to advertise sortability;
   - `asc` → `↑` in `text-brass-8`; `desc` → `↓` in `text-brass-8`.
   - Keep `aria-hidden="true"` on the glyph (state is conveyed via `aria-sort`).
6. Set `aria-sort` on the `<th>` to `ascending` / `descending` / `none` accordingly. Active column header text uses `text-ink-12`, inactive `text-ink-7` (preserving current visual emphasis logic).
7. Preserve all existing `<th>` classes, especially `sticky top-0 z-10 bg-paper-1 border-b border-ink-10`.

**Validation:** Clicking a sortable header (e.g. Price) cycles asc → desc → reset, the list reorders accordingly, the indicator shows `↑` / `↓` / neutral, and `aria-sort` updates. Clicking a second sortable column resets the first. Non-sortable columns are not clickable and show no indicator. ComparisonTable sticky-header test still passes.

---

### Task 3: Remove the sort dropdown from the FilterPanel

**Files:** `frontend/src/components/MiniComparator/FilterPanel.jsx`

**What to do:** Remove the entire "Sort — options generated from registry" block (the `<label>` + `<select>` for `sortBy`). Remove the now-unused pieces: the `setSortBy` import, the `getAllSorts` import, the `sortBy` selector, and the `sorts` memo. Leave `resetFilters` and all filter logic untouched. The `filterPanel.sortBy` i18n key becomes unused; leave the key in the locale files (harmless) — removing copy is out of scope for this fix.

**Validation:** FilterPanel renders with no sort control; reset button and all filters still work. No unused-import lint errors.

---

## Test Summary

### Baseline Vitest

- Command: `npm run test:summary` (frontend)
- Result: 22 files passed / 0 failed — 278 tests passed / 0 failed — exit code 0
- Failed tests: none
- Notes: Clean baseline (5.23s).

### Regression Vitest

- Command: `npm run test:summary` (frontend)
- Result: 22 files passed / 0 failed — 278 tests passed / 0 failed — exit code 0
- Failed tests: none
- Notes: Clean (4.94s), identical to baseline. `npm run lint` also passes (no unused-import errors after removing the dropdown wiring).

---

## Implementation Notes

<!-- Filled in during implementation, one block per task. -->

- **Post-implementation adjustment (user request):** the base order (no active column sort) is the **name A→Z** sort, as it was before this fix — not raw catalog order. `selectFilteredWheels` now resolves `sortBy ?? getDefaultSortId()` (= `name`), so `sortBy: null` (load + 3rd-click reset) sorts by name. The neutral header indicator stays a dimmed `↓` (the `↕` glyph was tried and rejected as visually unappealing).

### Task 1

- `buildInitialState()` sets `sortBy: null`; removed the now-unused `getDefaultSortId` import from the slice. The base/reset order is applied in the selector (see adjustment above), which resolves `null` to the default name sort.

### Task 2

- Added `useDispatch` + `setSortBy` import. Replaced `isSortedColumn` with three registry-derived helpers: `sortIdsFor` (reads the asc/desc `SortSpec` pair), `isSortable`, `sortDirOf`, plus a `cycleSort` click handler (none → asc → desc → none).
- Sortable headers now render a keyboard-operable `<button>` with an `aria-label` from the new `table.sortBy` key, a brass `↑`/`↓` glyph when active, and a dimmed `↓` (`text-ink-5`, brightening on hover) to advertise sortability when inactive. `<th>` carries `aria-sort` (`ascending`/`descending`/`none`) and preserves all sticky-header classes. Non-sortable columns render plain text as before.
- Sortable set resolved from the registry: Price, Weight, Rim depth, External width, Internal width. The model column (localeCompare only) is intentionally not sortable from its header.

### Task 3

- Removed the entire sort `<select>` block from FilterPanel and its now-unused wiring (`setSortBy`, `getAllSorts` imports, `sortBy` selector, `sorts` memo). The `filterPanel.sortBy` locale key is now unused but left in place. Added `table.sortBy` to `en.json` / `fr.json` for the header button's accessible label.
