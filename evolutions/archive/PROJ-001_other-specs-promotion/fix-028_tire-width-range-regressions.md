# Fix: Tire width range regressions

- **ID:** fix-028
- **Date:** 2026-06-11
- **Status:** Done

---

## Context & Need

PROJ-001 promoted tire width into `rim.tire_width_mm` as an interval with overlap filtering. Two regressions remain: range-bound initialization still reads the sortable scalar accessor, and the codemod parses ETRTO ranges after the generic numeric range matcher. This hides valid low tire widths in the UI and can migrate `25-622 - 32-622` as an impossible `25-622` mm tire range.

---

## Acceptance Criteria

- [x] Tire-width filter bounds include finite interval `min` and `max` values from `filterAccessor`, so the current catalog exposes the supported 19 mm lower bound.
- [x] Range-bound initialization uses the same finite-value extraction logic in Redux initial filter state and in contextual selector bounds.
- [x] The tire-width codemod parses `25-622 - 32-622` as `{ min: 25, max: 32 }`.
- [x] Regression tests cover both the tire-width filter bounds and the ETRTO codemod case.
- [x] PROJ-001 documentation reflects the completed `fix-028` child and project status.

---

## Technical Tasks

### Task 1: Share range-bound value extraction

**Files:** `frontend/src/store/slices/filtersSlice.js`, `frontend/src/store/selectors/wheelsSelectors.js`, `frontend/src/store/selectors/__tests__/wheelsSelectors.test.js`, `frontend/src/store/slices/__tests__/filtersSlice.test.js`

**What to do:** Add a shared helper for range-bound finite values that calls `property.filterAccessor` when present, otherwise `property.accessor`. The helper must collect finite values from scalars, arrays, and `{ min, max }` interval objects. Use it in both `buildInitialFilters` and `makeSelectRangeBoundsFor`.

**Validation:** Tests confirm `tireWidth` bounds include interval minima, including the current catalog lower bound of 19 mm.

---

### Task 2: Prioritize ETRTO tire-width parsing

**Files:** `scripts/codemods/other-specs-promote.mjs`, codemod regression test file

**What to do:** Move the ETRTO range and single ETRTO checks before the generic range matcher in `parseTireWidthRange`. Add a codemod-level regression test proving `recommended_tire_size: "25-622 - 32-622"` migrates to `rim.tire_width_mm: { min: 25, max: 32 }`.

**Validation:** The regression test fails before the parser order change and passes after it.

---

### Task 3: Close PROJ-001 documentation

**Files:** `evolutions/README.md`, `evolutions/PROJ-001_other-specs-promotion/project.md`, `evolutions/PROJ-001_other-specs-promotion/fix-028_tire-width-range-regressions.md`

**What to do:** Register `fix-028` as a PROJ-001 child, extend the child ID span, and mark PROJ-001 Done once implementation and regression tests pass.

**Validation:** The project index and master fix table include `fix-028`, and `project.md` status is `Done`.

---

## Test Summary

### Baseline Vitest

- Command: `npm.cmd run test:summary`
- Result: 24 files passed, 334 tests passed, exit code 0
- Failed tests: None
- Notes: Baseline before implementation.

### Regression Vitest

- Command: `npm.cmd run test:summary`
- Result: 25 files passed, 337 tests passed, exit code 0
- Failed tests: None
- Notes: Added one codemod test file and three regression assertions.

---

## Implementation Notes

### Task 1

- Added `frontend/src/store/rangeBounds.js` with shared finite-value extraction for range bounds.
- Updated `filtersSlice.js` and `wheelsSelectors.js` to use `filterAccessor` values when present, including scalar, array, and `{ min, max }` inputs.
- Added selector and initial-state tests proving tire-width bounds include the 19 mm catalog minimum.

### Task 2

- Reordered ETRTO parsing ahead of the generic range matcher in `parseTireWidthRange`.
- Exported `promoteTireWidthMm` behind a CLI guard so the codemod can be tested without executing `main()`.
- Added a Node-runtime codemod regression test for `recommended_tire_size: "25-622 - 32-622"`.

### Task 3

- Registered `fix-028` in the PROJ-001 child index and master fixes table.
- Extended the PROJ-001 child span to `fix-028` and marked the project Done after regression tests passed.
