# Fix: Tire width open interval filter

- **ID:** fix-025
- **Date:** 2026-06-09
- **Status:** Done

---

## Context & Need

EVO-058 introduced `rim.tire_width_mm` as a canonical `{ min, max }` range and exposed it as a comparator range filter. Closed ranges filter correctly, but open intervals such as `28+` are reduced to a scalar value before matching. This makes wheels with a minimum tire width only fail filters above that minimum, even though the intervals overlap.

---

## Acceptance Criteria

- [x] A wheel with `rim.tire_width_mm: { min: 28, max: null }` matches tire-width filters above 28 mm, such as `30-30`.
- [x] A wheel with `rim.tire_width_mm: { min: 28, max: null }` does not match tire-width filters entirely below 28 mm.
- [x] Closed tire-width ranges keep matching by interval overlap.
- [x] Existing scalar and divergent range filters keep their current behavior.
- [x] Baseline and regression Vitest summary runs are recorded.

---

## Technical Tasks

### Task 1: Add range-object matching

**Files:** `frontend/src/store/selectors/wheelsSelectors.js`, `frontend/src/store/selectors/__tests__/wheelsSelectors.test.js`

**What to do:** Extend the generic range matcher so values shaped as `{ min, max }` are matched by interval overlap against the active filter range, treating missing bounds as open intervals. Add unit coverage for open-low/open-high interval behavior while preserving scalar and array behavior.

**Validation:** Selector tests show `28+` matches `30-30`, does not match ranges below 28, and existing range matcher cases still pass.

### Task 2: Preserve tire-width intervals for filtering

**Files:** `frontend/src/config/wheelProperties.jsx`, `frontend/src/config/__tests__/wheelProperties.accessor.test.js`, `frontend/src/store/selectors/__tests__/wheelsSelectors.test.js`

**What to do:** Change the `tireWidth` filter accessor so it returns the canonical interval object rather than collapsing open intervals to a scalar. Keep sorting and display behavior unchanged.

**Validation:** Tire-width accessor tests expect `{ min, max }` values for filter input, and selector integration tests cover open intervals.

---

## Test Summary

### Baseline Vitest

- Command:
- `npm.cmd run test:summary`
- Result: Passed - 24 files passed, 328 tests passed, 0 failed, exit code 0, duration 4.60s.
- Failed tests: None.
- Notes: Baseline taken before fix implementation.

### Regression Vitest

- Command:
- `npm.cmd run test:summary`
- Result: Passed - 24 files passed, 334 tests passed, 0 failed, exit code 0, duration 4.59s.
- Failed tests: None.
- Notes: Regression includes range-object matcher coverage and tire-width open interval selector integration tests.

---

## Implementation Notes

### Task 1

- Added generic `{ min, max }` range-object matching by interval overlap in `wheelsSelectors.js`, treating missing bounds as open intervals.
- Added unit tests for closed interval overlap, `28+` open-high matching, open-high non-overlap below 28, and open-low overlap.

### Task 2

- Changed the tire-width filter accessor to pass the canonical interval object through to the matcher instead of expanding or collapsing it.
- Updated accessor and selector tests so closed and open tire-width intervals filter through the same interval-overlap path.
