# Fix: Active filter chips wrap

- **ID:** fix-018
- **Date:** 2026-06-04
- **Status:** Done

---

## Context & Need

The active filter chips row sits above the comparison table and summarizes the current comparator filters. When many chips are active, or when chip labels are long, the row can increase the intrinsic width of the table area instead of staying inside the available comparator width. The row should wrap onto additional lines so the table layout remains stable.

---

## Acceptance Criteria

- [x] Active filter chips wrap onto additional lines when there is not enough horizontal space.
- [x] Long chip labels do not force the comparison table wider than its available container.
- [x] The reset action remains visible and usable when chips wrap.

---

## Technical Tasks

### Task 1: Constrain and wrap active filter chips

**Files:** `frontend/src/components/MiniComparator/FilterChips.jsx`, `frontend/src/components/MiniComparator/ComparisonTable.jsx`

**What to do:** Update the active filter chips row and chip classes so the row can shrink within the comparator, chips can wrap cleanly, and long labels can break without expanding the table. Keep the comparison card constrained to its available width so horizontal overflow stays inside the table scroll area.

**Validation:** Run the full Vitest summary suite and verify the layout classes preserve chip removal and reset behavior.

---

## Test Summary

### Baseline Vitest

- Command:
- Result: 17 files passed, 232 tests passed, exit code 0
- Failed tests: None
- Notes: Baseline clean before implementation.

### Regression Vitest

- Command:
- Result: 17 files passed, 232 tests passed, exit code 0
- Failed tests: None
- Notes: Regression clean after implementation.

---

## Implementation Notes

### Task 1

- Root cause of the first attempt's failure: the card is sized by the parent grid (`MiniComparator`, `lg:grid-cols-[280px_1fr] w-fit`), whose `1fr` track resolves to the max-content of its contents. The table sits in an `overflow-x-auto` scroller (contributes ~0), but the chips row did not — its single-line max-content inflated the track regardless of card-level `w-full`/`min-w-0` constraints.
- Fix: gave the chips row `w-0 min-w-full` so it contributes 0 to intrinsic width (no longer inflates the grid track) while still rendering at the full card width and wrapping. The card width is therefore driven by the table only.
- Split the row into a growing `flex-wrap` zone (label + chips) and a `shrink-0` reset button pinned to the right with `items-start`, so reset stays in place when chips wrap.
- Wrapped chip labels in a shrinkable text span and kept remove buttons from shrinking.
- Changed the comparison table card from `w-fit` to `w-full max-w-full`.
- Browser-verified: chips wrap, the table keeps its content width, and reset stays right-aligned.
