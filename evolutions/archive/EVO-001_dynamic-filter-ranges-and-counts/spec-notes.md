# spec-notes — EVO-001

## PRD interpretations

**FR-002 / FR-003 — "Excluding any active selection on the same filter axis"**
The PRD says the count for option X on axis P excludes P's own filter entirely — not merely the currently selected values. This means: even if `brand = ['Roval']` is active, the counts for brand options are computed as if no brand filter existed. `makeSelectContextualCountsFor` implements this as "apply all filterable properties except `propertyId`".

**FR-007 — Empty dataset: "not rendered or rendered in a safe default state"**
We chose safe default state (`min = 0, max = 0` with a division-by-zero guard in `DualRangeRow.pct`) rather than conditional rendering. Rationale: conditional rendering would add a new code path tested only in a degenerate edge case; a safe default produces a collapsed-but-visible slider, which is acceptable since an empty dataset is not a production scenario.

**FR-005 — "Lower opacity or muted colour"**
We apply `opacity-40` on `Pill` (affects the whole button) and `text-ink-400` on `LargeMultiSelectFilter` labels. Both signal de-emphasis without removing the click target. Muting is suppressed on the active option.

**PRD section 3 "Yes/No filter (Hookless)"**
The PRD uses "Yes"/"No" as abstract labels. The actual registry labels are `['All', 'Hookless', 'Hooked']`. `labelTrue` = 'Hookless' maps to `filter.value === true` and selector key `'true'`; `labelFalse` = 'Hooked' maps to `filter.value === false` and key `'false'`.

---

## Architecture decision rationale

**AD-001 — Dataset import in `filtersSlice`**
`wheelsSlice.js` already imports `wheelsData` for bootstrapping initial state. The same pattern in `filtersSlice.js` is consistent and avoids inventing a new protocol. The "future: async Redux thunk" note in the README applies to `wheelsSlice`; if that transition occurs, `filtersSlice` would need a corresponding listener to reset range bounds when new items load. This is explicitly deferred and out of scope for EVO-001.

**AD-002 — Parameterised selector factory**
`makeSelectOptionsFor` is the existing precedent. Using the same factory pattern keeps the selector API consistent and benefits from RTK's `createSelector` memoisation. A single `selectAllContextualCounts` selector returning a nested object would recompute all axes on every filter change and be harder to memoize efficiently.

**TASK-001 — Vitest as a prerequisite task rather than a subtask**
No test runner exists. Rather than fold it into TASK-002, it is its own task so it can be merged independently (as a pure dev-tooling change with no feature impact), and subsequent tasks can depend on it explicitly.

---

## Tradeoffs

**Dynamic bounds in slice init vs. null sentinel**
Initialising with concrete dataset values avoids null guards throughout `rangeMath.js`, `DualRangeRow`, and the range matcher. The cost is coupling `filtersSlice` to `wheelsData`, but this coupling already exists in `wheelsSlice`. Accepted.

**Showing `(0)` vs. hiding zero-count options**
PRD explicitly requires options to remain visible and selectable. Hiding or disabling zero-count options would produce a confusing "disappearing options" experience when filters narrow aggressively.

---

## Open questions

None. All functional rules are fully specified in the PRD.
