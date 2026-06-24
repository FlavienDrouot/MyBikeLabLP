# Fix: Arcaris brand filter duplicates

- **ID:** fix-014
- **Date:** 2026-06-04
- **Status:** Done

---

## Context & Need

The wheel comparator filters catalog entries through the shared wheel property registry and the `selectFilteredWheels` selector. Arcaris entries currently remain visible when another brand is selected, and repeated brand filtering can make those entries appear more than once. Brand filtering must only show selected brands and must not introduce duplicate visible rows.

---

## Acceptance Criteria

- [ ] When a non-Arcaris brand is selected, no visible comparator row has `brand: 'Arcaris'`.
- [ ] Reapplying or changing the brand filter does not duplicate Arcaris rows or any other wheel rows.
- [ ] Arcaris rows remain visible when `Arcaris` is selected, preserving the three documented variants.

---

## Technical Tasks

### Task 1: Add regression coverage for Arcaris brand filtering

**Files:** `frontend/src/store/selectors/__tests__/wheelsSelectors.test.js`

**What to do:** Add selector-level tests using a small catalog that includes Arcaris variants and at least one other brand. Assert that filtering by another brand excludes all Arcaris entries, filtering by Arcaris keeps only the three Arcaris variants, and changing the brand filter does not create duplicate IDs.

**Validation:** The new tests fail before the fix if Arcaris entries pass through brand filtering or duplicate, and pass after the implementation.

---

### Task 2: Fix brand-filter result integrity

**Files:** `frontend/src/store/selectors/wheelsSelectors.js`, `frontend/src/components/MiniComparator/ComparisonTable.jsx`

**What to do:** Inspect the filtering and rendering path and make the smallest correction needed so the visible table is derived only from `selectFilteredWheels` results and contains unique wheel IDs after brand changes. Keep the measuring table hidden and non-interactive if it remains necessary for column sizing.

**Validation:** With `brand = ['Roval']`, the selected wheel list contains only Roval IDs and no Arcaris IDs. With `brand = ['Arcaris']`, the selected wheel list contains exactly the three Arcaris IDs once each.

---

## Test Summary

### Baseline Vitest

- Command: `npm.cmd run test:summary`
- Result: 17 files passed, 227 tests passed, 0 failed, exit code 0
- Failed tests: none
- Notes: Baseline run before implementation from `MyBikeLab/frontend`.

### Regression Vitest

- Command: `npm.cmd run test:summary`
- Result: 17 files passed, 230 tests passed, 0 failed, exit code 0
- Failed tests: none
- Notes: Added three regression assertions covering global ID uniqueness and Arcaris brand filtering.

---

## Implementation Notes

### Task 1

- Added catalog integration coverage for unique wheel IDs.
- Added Arcaris brand-filter regression tests for filtering by Caden and filtering by Arcaris.

### Task 2

- Changed Arcaris wheel IDs from `206`, `207`, `208` to `219`, `220`, `221`.
- Root cause was duplicate React row keys: Caden already used IDs `206` and `207`, so table reconciliation could preserve or duplicate stale Arcaris rows across brand filter changes.
