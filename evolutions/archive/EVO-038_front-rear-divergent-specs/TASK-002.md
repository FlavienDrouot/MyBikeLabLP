# TASK-002 — Update `wheelProperties.jsx` accessors for the four divergent-eligible specs

## Objective

Update the four property entries in `WHEEL_PROPERTIES` that are eligible for divergence (depth, externalWidth, internalWidth, weight) so that their `accessor` always returns a scalar, and three of them expose a new `filterAccessor` returning the pair as an array for OR-semantics filtering.

This task does NOT touch cell rendering (that is TASK-004) and does NOT touch the filter matcher (that is TASK-003). After this task, `accessor` returns the correct scalar for sort and filter-bounds purposes; `filterAccessor` is declared but the filter matcher does not yet use it (that wiring happens in TASK-003).

## Required context

### Current state of the four properties in `wheelProperties.jsx`

```js
// depth
accessor: (w) => w.rim.depth_mm,

// externalWidth
accessor: (w) => w.rim.externalWidth_mm,

// internalWidth
accessor: (w) => w.rim?.internalWidth_mm,

// weight
accessor: (w) => w.weight_grams,
```

All four currently expect a scalar and pass it through directly. After EVO-038, these fields may hold a scalar or `{ front, rear }`.

### `resolveSpec` utility (from TASK-001)

```js
import { resolveSpec } from '../data/wheelUtils';

resolveSpec(value)
// Returns: { front, rear, total, isSingle }
```

Import path from `wheelProperties.jsx`: `'../data/wheelUtils'`.

### New accessor contract

For **dimensional specs** (depth, externalWidth, internalWidth):
- `accessor(w)` must return `Math.max(front, rear)` when the value is a pair, or the scalar directly when single. Returns `null` if the value is null/undefined.
- This scalar is used for: sort, initial filter bounds (`buildInitialFilters`), `makeSelectRangeBoundsFor`, and the default cell renderer fallback (which is bypassed by `renderCell` in TASK-004 anyway).

For **weight**:
- `accessor(w)` must return `front + rear` when the value is a pair, or the scalar directly when single. Returns `null` if null/undefined.
- No `filterAccessor` needed for weight (total-only semantics).

### New `filterAccessor` contract (dimensional specs only)

```js
filterAccessor: (w) => number | number[]
```

- When the value is a single-value form (scalar or `isSingle: true`): return the scalar directly (a number, not an array).
- When the value is a true pair (front ≠ rear): return `[front, rear]`.
- When the value is null/undefined: return null.

This field does not exist in the current `WheelProperty` type. Add it to the JSDoc typedef:
```js
* @property {((w: any) => number | number[] | null) | undefined} [filterAccessor]
*   Optional. When present and the value is a divergent pair, returns [front, rear] for OR-semantics range filtering.
*   When absent, `accessor` is used for filtering (scalar path).
```

The `filterAccessor` is added only to: `depth`, `externalWidth`, `internalWidth`.
It is NOT added to: `weight` (total-only semantics).

### Side effect on initial filter bounds (documented, no action needed)

`buildInitialFilters` in `filtersSlice.js` calls `property.accessor(w)` and filters for `Number.isFinite`. After this task, `accessor` for depth/externalWidth/internalWidth returns `Math.max(front, rear)` — a scalar — so the bounds computation is unaffected structurally. The computed upper bound will reflect the maximum of front and rear values across the catalog, which is the intended behaviour (see spec-notes OQ-003).

## Potentially impacted files

- `frontend/src/config/wheelProperties.jsx` — update four property entries and the WheelProperty JSDoc typedef
- `frontend/src/data/wheelUtils.js` — imported (must exist, produced by TASK-001)
- `frontend/src/config/__tests__/wheelProperties.test.js` — new or updated test file

## Inputs

- `resolveSpec` from `src/data/wheelUtils.js` (TASK-001 output).
- Current `wheelProperties.jsx` (read the file before editing).

## Expected outputs

- `wheelProperties.jsx` updated with new accessors and `filterAccessor` for the four properties.
- `WheelProperty` JSDoc typedef updated with the optional `filterAccessor` field.
- Unit tests confirming accessor and filterAccessor outputs for both scalar and pair inputs.

## Constraints

- `accessor` must always return a scalar (`number | null`) — never an object or an array. This is a hard constraint because many consumers rely on it.
- `filterAccessor` returns `number | number[] | null`.
- No change to any other property in `WHEEL_PROPERTIES`.
- No change to the property's `sorts` entries — the existing sort specs use `accessor` implicitly, which now returns the correct scalar.
- Do not add `renderCell` overrides in this task — that is TASK-004.
- Import `resolveSpec` at the top of the file alongside existing imports.

## Dependencies

TASK-001

## Validation criteria

- [ ] `depth` property: `accessor(w)` returns `60` for `w = { rim: { depth_mm: { front: 50, rear: 60 } } }`.
- [ ] `depth` property: `accessor(w)` returns `45` for `w = { rim: { depth_mm: 45 } }`.
- [ ] `depth` property: `accessor(w)` returns `null` for `w = { rim: { depth_mm: null } }`.
- [ ] `depth` property: `filterAccessor(w)` returns `[50, 60]` for the divergent pair.
- [ ] `depth` property: `filterAccessor(w)` returns `45` for the scalar input.
- [ ] Same pattern confirmed for `externalWidth` and `internalWidth`.
- [ ] `weight` property: `accessor(w)` returns `1570` for `w = { weight_grams: { front: 720, rear: 850 } }`.
- [ ] `weight` property: `accessor(w)` returns `1492` for `w = { weight_grams: 1492 }`.
- [ ] `weight` property has no `filterAccessor`.
- [ ] No existing test for scalar-only entries regresses.
- [ ] All tests pass.

## Tests to implement

### Unit

**wheelProperties.test.js** (or `wheelProperties.accessor.test.js` — place in `src/config/__tests__/`):

For each of the four properties (depth, externalWidth, internalWidth, weight):
- `accessor` with scalar input → returns scalar.
- `accessor` with pair input → returns max (dimensional) or sum (weight).
- `accessor` with null input → returns null.

For dimensional properties only (depth, externalWidth, internalWidth):
- `filterAccessor` with scalar input → returns scalar (not wrapped in array).
- `filterAccessor` with divergent pair input → returns `[front, rear]` array.
- `filterAccessor` with equal-pair input → returns scalar (because `isSingle: true`).
- `filterAccessor` with null input → returns null.

### Integration

None in this task — integration tested in TASK-003 and TASK-005.
