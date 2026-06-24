# Fix: Single open filter group

- **ID:** fix-017
- **Date:** 2026-06-04
- **Status:** Done

---

## Context & Need

The comparator filter panel groups filters by category in an accordion. Today each group owns its own open state, so users can leave several filter groups expanded at the same time. The intended behavior is lighter and more focused: opening one group should automatically close the previously open group.

---

## Acceptance Criteria

- [ ] On initial render, the first non-empty filter group is open by default.
- [ ] Opening a closed filter group closes any other open filter group.
- [ ] Clicking the currently open filter group closes it, leaving all groups closed.
- [ ] Existing filter controls, reset behavior, sorting and filter values continue to work unchanged.

---

## Technical Tasks

### Task 1: Centralize filter group open state

**Files:** `frontend/src/components/MiniComparator/FilterPanel.jsx`

**What to do:** Replace the per-`Section` local `useState(defaultOpen)` state with a single `openGroupId` state owned by `FilterPanel`. Initialize it from the first non-empty filter group. Pass each section its `open` boolean and an `onToggle` callback that either opens that group or clears `openGroupId` when the same group is clicked.

**Validation:** Rendering the panel still opens the first non-empty group, and clicking different group headers leaves at most one group content block visible.

---

### Task 2: Add accordion behavior coverage

**Files:** `frontend/src/components/MiniComparator/__tests__/FilterPanel.test.jsx`

**What to do:** Add a focused test for the exclusive accordion behavior using the existing `FilterPanel` render setup. Verify the initial open group, then simulate opening another group and assert that the first group closes.

**Validation:** `npm run test:summary` passes with the new test included.

---

## Test Summary

### Baseline Vitest

- Command: `npm run test:summary`
- Result: Passed. 17 files passed, 0 failed. 231 tests passed, 0 failed.
- Failed tests: None.
- Notes: Baseline is clean before implementation.

### Regression Vitest

- Command: `npm run test:summary`
- Result: Passed. 17 files passed, 0 failed. 232 tests passed, 0 failed.
- Failed tests: None.
- Notes: Regression is clean after implementation.

---

## Implementation Notes

### Task 1

- Replaced section-local open state with a controlled `Section` component.
- Added a single `openGroupId` state in `FilterPanel`, initialized from the first non-empty group.
- Section toggles now either open the clicked group or close it when it is already open.

### Task 2

- Added jsdom coverage that renders `FilterPanel`, verifies the first group is initially open, opens another group and confirms the previous group closes.
- The same test also verifies clicking the open group again leaves all groups closed.
