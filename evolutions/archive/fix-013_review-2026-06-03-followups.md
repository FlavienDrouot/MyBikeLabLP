# Fix: Review 2026-06-03 follow-ups

- **ID:** fix-013
- **Date:** 2026-06-03
- **Status:** Done

---

## Context & Need

The full-project code review of 2026-06-03 (`reviews/Review-2026-06-03-22h10.md`) found no blockers but flagged one Important item, three Suggestions, and three Nits. This fix applies the actionable findings in a single pass and resolves the two open product/domain questions (null sort placement → missing values sort to the end; categorical data value casing → canonical Title Case, documented in `domain-vocabulary.md`).

> **Scope note:** This fix touches more than the 1–3 files the Fix path nominally targets, but all changes are mechanical corrections from one review with no architecture or UX decision. The user explicitly chose the Fix path with this in mind.

---

## Acceptance Criteria

- [ ] Brand sub-labels (Model/Hub/Spokes columns) and the "no results" message render in the dimmed `ink-7` gray, not the parent color.
- [ ] No remaining occurrence of the invalid `text-ink-500` token in `frontend/src`.
- [ ] Sorting by price or weight ascending places wheels with a missing value (`null`/`NaN`) at the **end** of the list, not the top; descending also keeps them at the end.
- [ ] The dead commented placeholder dataset block is removed from `wheelsData.js`.
- [ ] The sorted column header in the visible table can no longer be wider than its measured fixed width (sort arrow accounted for); the `MeasuringTable` header comment no longer over-claims equivalence.
- [ ] The speculative `minPrice` re-export and the `safeT` legacy fallback are removed (with their now-orphaned test), or explicitly justified.
- [ ] `domain-vocabulary.md` documents the canonical Title Case convention for categorical data values.
- [ ] Lint clean; full Vitest suite green (baseline 206 tests).

---

## Technical Tasks

### Task 1: Fix invalid `text-ink-500` Tailwind token

**Files:** `frontend/src/config/wheelProperties.jsx` (lines 113, 397, 487), `frontend/src/components/MiniComparator/FilterPanel.jsx` (line 331)

**What to do:** Replace `text-ink-500` with `text-ink-7` (the `ink` scale defined in `tailwind.config.js` only goes 1–12; `500` generates no CSS). `ink-7` is the established dimmed meta sub-label token used elsewhere.

**Validation:** Grep for `text-ink-500` returns no results in `frontend/src`. Brand names appear visually dimmer than the model name.

---

### Task 2: Sort missing numeric values to the end

**Files:** `frontend/src/store/selectors/wheelsSelectors.js` (sort comparator, ~line 60-66)

**What to do:** Before the `va - vb` subtraction in the non-`localeCompare` branch, treat `null`/`undefined`/`NaN` as "missing" and force missing values after present ones regardless of `asc`/`desc`.

**Validation:** A wheel with no price does not appear first in an ascending price sort. Existing sort tests still pass; add/extend a test asserting missing-value placement if one is not already present.

---

### Task 3: Delete dead placeholder dataset

**Files:** `frontend/src/data/wheelsData.js` (commented block ~lines 13-308)

**What to do:** Delete the commented-out legacy placeholder dataset (the comment itself says "remove once all brands are scraped" — the 4 brands are now ingested). Prefer deletion over comment retention; git history preserves it.

**Validation:** File no longer contains the commented block; no reference to the removed `wheelPlaceholderUrl` remains in this file; build and tests still pass.

---

### Task 4: Align MeasuringTable header with the visible table

**Files:** `frontend/src/components/MiniComparator/MeasuringTable.jsx` (header `th`, line 65); reference `frontend/src/components/MiniComparator/ComparisonTable.jsx` (lines 165-171)

**What to do:** The measuring header uses `text-xs font-medium tracking-widest` while the visible header uses `text-[10px] font-semibold tracking-[0.16em]` and appends a `↓` sort arrow (`ml-1`) on the sorted column. Make the measured width reflect the widest rendered state: align the typographic classes to the visible header and reserve the sort-arrow width (e.g. always render an invisible/placeholder arrow span in the measuring header). Correct the file-top comment so it no longer over-claims exact class equivalence.

**Validation:** Sorting a column does not clip its header text. Comment accurately describes the sizing relationship.

---

### Task 5: Remove speculative dead code (nits)

**Files:** `frontend/src/store/selectors/wheelsSelectors.js` (lines 9-11), `frontend/src/components/MiniComparator/columnCells.jsx` (lines 5-9), `frontend/src/components/MiniComparator/__tests__/columnCells.test.jsx` (line ~100)

**What to do:**
- Remove the `minPrice` re-export (lines 9-11) — no real consumer found in `frontend/src`.
- Remove the `safeT` fallback in `renderCellFor`: all real callers (`ComparisonTable`, `MeasuringTable`) pass `t`. The only consumer of the fallback is the dedicated test `renderCellFor(property, undefined)` (columnCells.test.jsx:100), which must be removed alongside it.
- `WheelImageCarousel.jsx:3` (`prefersReducedMotion` evaluated once at module load): **won't-fix** — review marks it acceptable; no behavior change.

**Validation:** Lint and full suite green after removals; no import of the removed `minPrice` re-export breaks.

---

### Task 6: Document canonical data value casing convention

**Files:** `MyBikeLab/domain-vocabulary.md`

**What to do:** Add a "Data Conventions" entry stating that categorical data values (e.g. `disc_standard`, `freehub_options`) use **Title Case** as the canonical form (`Center Lock`, `Shimano HG`, `SRAM XDR`) to avoid duplicate filter options from casing variants. Current data already conforms (`disc_standard` is `'Center Lock'` across all four brands) — no data change required; this codifies the rule for future scraping.

**Validation:** `domain-vocabulary.md` contains the convention; no data file edits needed.

---

## Test Summary

### Baseline Vitest

- Command: `npm run test:summary`
- Result: 17 files passed, 206 tests passed, 0 failed
- Failed tests: none
- Notes: clean baseline, duration 3.87s.

### Regression Vitest

- Command: `npm run lint` + `npm run test:summary`
- Result: lint clean; 17 files passed, 205 tests passed, 0 failed
- Failed tests: none
- Notes: Test count dropped 206 → 205 because the orphaned `safeT`-fallback test was removed in Task 5. A first regression run failed on `Landing.xx.test.jsx` (the always-rendered `↓` in the measuring header was flagged as a hardcoded string); resolved by adding `↓`/`↑` to the test's allowed decorative-symbols token class — both are sanctioned typographic glyphs in `domain-vocabulary.md`.

---

## Implementation Notes

### Task 1
Replaced `text-ink-500` → `text-ink-7` at `wheelProperties.jsx:113,397,487` and `FilterPanel.jsx:331`. No remaining `text-ink-500` in `frontend/src`.

### Task 2
`wheelsSelectors.js` sort comparator now treats `null`/`undefined`/`NaN` as missing and forces them after present values regardless of direction (returns `±1`).

### Task 3
`wheelsData.js` reduced to its live content (imports + concatenated brand arrays); the ~295-line commented placeholder block and the orphaned `wheelPlaceholderUrl` reference are gone.

### Task 4
`MeasuringTable` header classes aligned to the visible header (`text-[10px] font-semibold tracking-[0.16em]`) and now always reserve the sort-arrow width via an `aria-hidden` `↓` span. File-top comment corrected to describe the worst-case reservation instead of claiming exact equivalence.

### Task 5
Removed the `minPrice` re-export from `wheelsSelectors.js` (no real consumer) and the `safeT` fallback from `columnCells.jsx` (all real callers pass `t`); deleted the dedicated `renderCellFor(property, undefined)` test. `WheelImageCarousel.jsx:3` left as-is (won't-fix, accepted in review).

### Task 6
Added a "Data Conventions" entry to `domain-vocabulary.md` codifying Title Case as canonical for categorical data values. No data files changed — the catalog already conforms.
