# Fix: Rim construction column order

- **ID:** fix-026
- **Date:** 2026-06-09
- **Status:** Done

---

## Context & Need

PROJ-001 promoted several specs from `other_specs` into canonical comparator columns. `Rim construction` was added near the start of the `rims` group, immediately after `Rim material`, but this makes the optional technical detail appear before more primary rim dimensions. The column should remain available in the `rims` group, but appear last within that group.

---

## Acceptance Criteria

- [x] `Rim construction` remains in the `rims` column group.
- [x] `Rim construction` appears after all other `rims` columns in comparator/column-selector ordering.
- [x] No accessor, filter, translation, or display behavior changes.

---

## Technical Tasks

### Task 1: Move `rimConstruction` to the end of the rims group

**Files:** `frontend/src/config/wheelProperties.jsx`

**What to do:** Move the existing `rimConstruction` property object to the end of the contiguous `rims` entries in `WHEEL_PROPERTIES`, after `tireWidth`, without changing its contents.

**Validation:** The `rims` group order in `WHEEL_PROPERTIES` ends with `rimConstruction`, and the test suite remains green.

---

## Test Summary

### Baseline Vitest

- Command:
- Result: Passed - 24 files passed, 0 failed; 334 tests passed, 0 failed; duration 4.61s; exit code 0.
- Failed tests: None.
- Notes: Baseline run before moving `rimConstruction`.

### Regression Vitest

- Command:
- Result: Passed - 24 files passed, 0 failed; 334 tests passed, 0 failed; duration 4.24s; exit code 0.
- Failed tests: None.
- Notes: Regression matched the clean baseline.

---

## Implementation Notes

### Task 1

- Moved the existing `rimConstruction` registry entry after `tireWidth`, making it the final property in the `rims` group. No field behavior, accessor, filter, or display configuration was changed.
