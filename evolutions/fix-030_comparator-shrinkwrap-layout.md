# Fix: Comparator shrink-wrap layout

- **ID:** fix-030
- **Date:** 2026-06-19
- **Status:** Done

---

## Context & Need

The MiniComparator layout was changed in commit `1424fbbb1671375345f2032f007864325609d7b0` to prevent horizontal overflow by making the comparator grid span the available width. That removed the previous shrink-wrap behavior, so the table area could show a large empty region to the right when the visible columns did not need the full width. The comparator should stay centered and shrink around the combined filter panel and table while still remaining capped to the viewport.

---

## Acceptance Criteria

- [x] The MiniComparator grid shrink-wraps around the filter panel and comparison table when the visible table columns need less than the available width.
- [x] The shrink-wrapped grid remains horizontally centered in the page.
- [x] The grid remains capped to the available viewport width to preserve the anti-overflow behavior introduced by the prior fix.
- [x] The viewport-cap regression test reflects the intended shrink-wrap contract.

---

## Technical Tasks

### Task 1: Restore shrink-wrap on the comparator grid

**Files:** `frontend/src/components/MiniComparator/MiniComparator.jsx`

**What to do:** Replace the full-width comparator grid wrapper with a shrink-wrapped, centered wrapper using `w-fit max-w-full mx-auto`, while keeping the existing grid columns, gap, and alignment.

**Validation:** In the comparator surface, the filter panel and table group should be centered and no longer leave a large table-container background area to the right when the table is narrow. The wrapper must still carry `max-w-full`.

---

### Task 2: Update viewport-cap regression coverage

**Files:** `frontend/src/components/MiniComparator/__tests__/MiniComparator.viewport-cap.test.jsx`

**What to do:** Update AC-002b so it verifies the shrink-wrap contract: the grid wrapper contains `w-fit`, `mx-auto`, and `max-w-full`, and does not contain the standalone `w-full` class.

**Validation:** `npm.cmd run test:summary` passes with no failed files or tests.

---

## Test Summary

### Baseline Vitest

- Command: Not run before implementation.
- Result: Not available.
- Failed tests: Not available.
- Notes: This fix document was created retrospectively after the implementation had already been applied. This records the process deviation explicitly.

### Regression Vitest

- Command: `npm.cmd run test:summary`
- Result: Passed. 25 files passed, 0 failed. 341 tests passed, 0 failed. Duration 5.50s. Exit code 0.
- Failed tests: None.
- Notes: A targeted viewport test was also run earlier with `node_modules\.bin\vitest.cmd run src/components/MiniComparator/__tests__/MiniComparator.viewport-cap.test.jsx`; 8 tests passed.

---

## Implementation Notes

### Task 1

- Updated the MiniComparator grid wrapper from `w-full max-w-full` to `w-fit max-w-full mx-auto`.
- Kept the existing `lg:grid-cols-[288px_1fr]`, gap, and `items-start` layout.

### Task 2

- Updated AC-002b to describe shrink-wrap behavior instead of full-width behavior.
- The test now tokenizes the class list before checking for `w-full`, avoiding false matches from `max-w-full`.