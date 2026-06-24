# Implementation Notes — EVO-001

## Design decisions

### TASK-001 — Vitest alias syntax

The tech spec listed `moduleNameMapper` under the `test` block, which is Jest syntax. Vitest does not support `moduleNameMapper`; the equivalent is the `alias` option with array-form entries that support regex `find` patterns. Implemented as:

```js
test: {
  alias: [{ find: /\.(svg|png|jpg|jpeg|gif)$/, replacement: fileURLToPath(...) }]
}
```

`fileURLToPath` is required on Windows: `new URL(...).pathname` produces a `/C:/...` path with a leading slash that breaks module resolution on Windows.

### TASK-002 — `makeSelectContextualCountsFor` placement relative to `makeSelectRangeBoundsFor`

`makeSelectContextualCountsFor` was placed before `makeSelectRangeBoundsFor` in `wheelsSelectors.js` to match reading order: contextual counts are needed by TASK-003/004/005 (more impactful), bounds by TASK-002 (narrower scope). No functional consequence.

### TASK-003 — `filtersState` shape assumption in `makeSelectContextualCountsFor`

The selector reads `filtersState.filters[p.id]` where `filtersState` is `state.filters` (the full filters slice). This matches the shape set by `filtersSlice` (`{ filters: { [id]: { value, enabled } }, sortBy }`). The selector does not defensively handle a missing `filtersState.filters` object because the Redux store always initialises it.

## Deviations

None. All task specs were followed as written, except the `moduleNameMapper` → `alias` substitution noted above (unavoidable, Jest-only API).

## Tradeoffs

### `makeSelectContextualCountsFor` creates one memoised instance per filter axis per mounted component

Acknowledged in the tech spec (section 7, Identified Risks). At ~10 filter axes, the overhead is negligible. Each instance is a small closure holding two input selectors and one result cache entry.

### `pct` guard in `DualRangeRow`: returns 0 when `max === min`

When the dataset has a single wheel, both slider thumbs collapse to position 0%. This is a silent visual no-op rather than a NaN/Infinity render error, which is the correct tradeoff for an edge case dataset.

## Bugfixes (post-implementation validation)

### BUG-001 — Range slider thumb cannot reach max value when `min` is not a multiple of `step`

**Root cause:** The HTML `<input type="range">` snaps values to a step grid anchored at `min`. When `min` is not a multiple of `step` (e.g. dataset min = 1225 g, step = 10), the grid is 1225, 1235, … and `max` (e.g. 1510) may fall between two grid points, making the high thumb stop short.

**Fix:** `makeSelectRangeBoundsFor` and the `range` case in `filtersSlice.buildInitialFilters` now snap bounds outward to step boundaries — `Math.floor(dataMin / step) * step` for min and `Math.ceil(dataMax / step) * step` for max. Properties without a `step` (depth, rimWidth) are left unaligned since those inputs have no step snapping. The filter initial value is also snapped so `valueLow` and `valueHigh` start exactly on grid points.

### BUG-002 — Muted list items in `LargeMultiSelectFilter` appeared with higher contrast than normal items

**Root cause:** The spec prescribed `text-ink-400` for muted labels. `ink-400` is not defined in the project's Tailwind config (which only declares 100, 300, 500, 700, 900). An unrecognised Tailwind utility generates no CSS, so text colour fell back to the browser default (near-black), which is darker than the intended `text-ink-700` applied to non-muted items.

**Fix:** Replaced `text-ink-400` with `text-ink-300` (#cbd5e1), a defined colour that is clearly lighter than the `text-ink-700` (#334155) used for normal items.

## Open questions

None identified during implementation.
