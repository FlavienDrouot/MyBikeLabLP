# Fix: Promoted text column max widths

- **ID:** fix-027
- **Date:** 2026-06-09
- **Status:** Done

---

## Context & Need

PROJ-001 promoted several long free-text specs into comparator columns. `hubBearingType`, `rimConstruction`, `spokeNipple`, and `spokeProfile` can contain long values, so measuring their natural content width can make the comparison table too wide. These columns should use a fixed configured width and CSS max-width, like the other long promoted text columns.

---

## Acceptance Criteria

- [x] `hubBearingType`, `rimConstruction`, `spokeNipple`, and `spokeProfile` declare a fixed column width.
- [x] The four columns apply matching `max-w` and overflow handling on their table cells.
- [x] The comparison table skips runtime width measurement for these four columns.
- [x] Baseline and regression Vitest summaries are recorded.

---

## Technical Tasks

### Task 1: Add fixed max-width metadata to promoted text columns

**Files:** `MyBikeLab/frontend/src/config/wheelProperties.jsx`

**What to do:** Add `column.colWidth` and matching `max-w-[...] overflow-hidden` cell classes to `hubBearingType`, `rimConstruction`, `spokeNipple`, and `spokeProfile`.

**Validation:** The four properties have a positive `colWidth`, so `ComparisonTable` excludes them from `MeasuringTable`, and their cells visually clamp to the configured width.

---

## Test Summary

### Baseline Vitest

- Command: `npm run test:summary`
- Result: Passed. 24 files passed, 0 failed. 334 tests passed, 0 failed. Duration 4.55s. Exit code 0.
- Failed tests: None.
- Notes: Baseline was clean before implementation.

### Regression Vitest

- Command: `npm run test:summary`
- Result: Passed. 24 files passed, 0 failed. 334 tests passed, 0 failed. Duration 4.51s. Exit code 0.
- Failed tests: None.
- Notes: Regression remained clean after implementation.

---

## Implementation Notes

### Task 1

- Added `colWidth: 160` and `max-w-[160px] overflow-hidden` cell classes to `rimConstruction`, `hubBearingType`, `spokeNipple`, and `spokeProfile`.
- Because `ComparisonTable` excludes columns with `column.colWidth` from `MeasuringTable`, these columns now skip runtime width measurement.
