# Fix: Weight tolerance display

- **ID:** fix-023
- **Date:** 2026-06-09
- **Status:** Done

---

## Context & Need

EVO-055 promoted weight tolerance into the canonical top-level `weight_tolerance_percent` field next to `weight_grams`. The data is present in the catalog, but the comparator weight cell only renders the published weight and optional front/rear split. Users therefore cannot see any weight tolerance values even when the catalog has them.

---

## Acceptance Criteria

- [x] Wheels with a finite `weight_tolerance_percent` show the tolerance in the weight column.
- [x] The tolerance display is compact and uses the existing weight cell, without creating a new filter, sort, or column.
- [x] Existing weight filtering, sorting, scalar display, and front/rear split display remain unchanged.
- [x] Render tests cover scalar and divergent weight rows with tolerance.

---

## Technical Tasks

### Task 1: Render tolerance in the weight cell

**Files:** `frontend/src/config/wheelProperties.jsx`

**What to do:** Update the `weight` column `renderCell` so finite `weight_tolerance_percent` values render as a secondary line like `+/- 5%` below the main weight value. Keep the current scalar, equal-pair, divergent-pair, filter, and sort behavior unchanged.

**Validation:** Existing weight render tests still pass and new tolerance cases show the percentage only when the canonical field is finite.

### Task 2: Add render coverage

**Files:** `frontend/src/config/__tests__/wheelProperties.renderCell.test.jsx`

**What to do:** Add tests proving the weight cell renders tolerance for scalar weights and divergent front/rear weights while preserving the existing weight text.

**Validation:** `npm.cmd run test:summary` passes.

---

## Test Summary

### Baseline Vitest

- Command: `npm.cmd run test:summary` from `frontend/`
- Result: Passed, exit code 0
- Failed tests: None
- Notes: Vitest summary reported 24 passed files and 323 passed tests in 4.70s.

### Regression Vitest

- Command: `npm.cmd run test:summary` from `frontend/`
- Result: Passed, exit code 0
- Failed tests: None
- Notes: Vitest summary reported 24 passed files and 326 passed tests in 4.62s.

---

## Implementation Notes

### Task 1

- Updated the `weight` column render path to display finite `weight_tolerance_percent` values as a secondary `+/- n%` line.
- Kept the existing `weight_grams` accessor, range filter, sort options, scalar display, and front/rear split behavior unchanged.

### Task 2

- Added render tests for scalar weight tolerance, divergent front/rear weight tolerance, and null tolerance non-display.
