# Fix: Comparator column max widths for promoted specs

- **ID:** fix-022
- **Date:** 2026-06-09
- **Status:** Done

---

## Context & Need

PROJ-001 promoted several formerly secondary specs into selectable comparator columns. `Hub bearings`, `Spoke lacing`, `Warranty`, and `Max tire pressure` can contain long labels or notes, so when users enable them the comparison table may allocate too much horizontal width to those columns. These columns need explicit width caps consistent with existing bounded columns such as `Hub`, `Spokes`, and `Freehub options`.

---

## Acceptance Criteria

- [x] `Hub bearings`, `Spoke lacing`, `Warranty`, and `Max tire pressure` have explicit bounded comparator column widths.
- [x] Long values in those columns are clipped or ellipsized instead of expanding the table width beyond the configured cap.
- [x] Existing measured-column behavior remains unchanged for columns without explicit width caps.

---

## Technical Tasks

### Task 1: Add width caps to promoted spec columns

**Files:** `MyBikeLab/frontend/src/config/wheelProperties.jsx`

**What to do:** Add `colWidth` values and matching `max-w[...] overflow-hidden` cell classes to `hubBearingType`, `spokeLacing`, `warrantyYears`, and `maxTirePressure`. Use the existing registry pattern already applied to `hub`, `spokes`, and `freehubOptions`.

**Validation:** The four columns are skipped by the measurement table, receive fixed colgroup widths in the visible table, and long content no longer determines table width.

---

## Test Summary

### Baseline Vitest

- Command: `npm run test:summary`
- Result: Passed. 24 files passed, 0 failed. 323 tests passed, 0 failed. Exit code 0.
- Failed tests: None
- Notes: Duration 4.17s.

### Regression Vitest

- Command: `npm run test:summary`
- Result: Passed. 24 files passed, 0 failed. 323 tests passed, 0 failed. Exit code 0.
- Failed tests: None
- Notes: Duration 4.54s.

---

## Implementation Notes

### Task 1

- Added `colWidth: 160` to `maxTirePressure`, `warrantyYears`, `hubBearingType`, and `spokeLacing`.
- Added matching `max-w-[160px] overflow-hidden` cell classes so these optional promoted columns follow the same bounded-column pattern as `Hub`, `Spokes`, and `Freehub options`.
