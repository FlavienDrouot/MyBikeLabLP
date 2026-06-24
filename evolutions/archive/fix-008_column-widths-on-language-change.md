# Fix: Column widths recalculation on language change

- **ID:** fix-008
- **Date:** 2026-06-02
- **Status:** Done

---

## Context & Need

The comparator table uses a hidden `MeasuringTable` to compute each column's natural width from the full dataset, then pins those widths on the visible table via `table-layout: fixed`. The measurement `useLayoutEffect` in `MeasuringTable.jsx` has the dependency array `[items, cols, onMeasure]`, which does not include the active language. When the user switches language (FR ↔ EN), translated column headers and cell values re-render with different text lengths, but the widths are never remeasured — causing columns to be either truncated (when the new language is wider) or excessively spacious (when it is narrower).

---

## Acceptance Criteria

- [ ] Switching language triggers an automatic remeasure with no user action required
- [ ] After a language switch, column headers are fully visible and not truncated
- [ ] After a language switch, there is no excessive blank space in narrow-label columns
- [ ] Initial load (page first render) is unaffected
- [ ] Filtering and column visibility changes still trigger remeasure correctly

---

## Technical Tasks

### Task 1 — Add `i18n.language` to the `useLayoutEffect` dependency array

**Files:** `frontend/src/components/MiniComparator/MeasuringTable.jsx`

**What to do:**
1. Destructure `i18n` in addition to `t` from the `useTranslation()` call on line 26:
   ```js
   const { t, i18n } = useTranslation();
   ```
2. Add `i18n.language` to the dependency array on line 56:
   ```js
   }, [items, cols, onMeasure, i18n.language]);
   ```

**Validation:** Open the comparator, observe column widths, switch language — widths must update automatically on each switch without page reload.

---

## Implementation Notes

### Task 1
- Destructured `i18n` alongside `t` from `useTranslation()` on line 26
- Added `i18n.language` to the `useLayoutEffect` dependency array on line 56
- No other files affected
