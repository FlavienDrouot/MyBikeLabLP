# Fix: Double separator before first filter group

- **ID:** fix-020
- **Date:** 2026-06-05
- **Status:** Done

---

## Context & Need

Since the sort dropdown was removed from the FilterPanel (fix-019), an extra
separator line appears before the first filter group ("General Specs"). The
panel header carries a bottom border (`border-b border-ink-10`) and every
`Section` carries a top border (`border-t border-ink-3`). The dropdown used to
sit between them; with it gone, the two borders stack and read as a doubled
separator.

This is a narrow visual regression — Fix path, single file.

---

## Acceptance Criteria

- [x] No doubled separator between the FilterPanel header and the first group.
- [x] Separators between subsequent groups are unchanged.
- [x] No change to filter behaviour or accordion logic.

---

## Technical Tasks

### Task 1: Drop the top border on the first Section

**Files:** `frontend/src/components/MiniComparator/FilterPanel.jsx`

**What to do:** Add a `first` prop to `Section`. When `first` is true, render the
wrapper without `border-t border-ink-3 pt-3`. In `FilterPanel`, pass
`first={index === 0}` to the first rendered group so it sits flush under the
header's bottom border. Subsequent sections keep their top border.

**Validation:** The first group ("General Specs") shows a single separator (the
header's bottom border); following groups keep their separators.

---

## Implementation Notes

### Task 1

- `Section` gained `first = false`; the wrapper className is now
  `first ? '' : 'border-t border-ink-3 pt-3'`. The map callback passes
  `first={index === 0}`. No other logic touched.
