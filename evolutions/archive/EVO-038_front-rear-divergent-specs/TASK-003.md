# TASK-003 — Update range matcher in `wheelsSelectors.js` for OR semantics

## Objective

Update the `range` predicate in `wheelsSelectors.js` to apply OR semantics when the value returned by `filterAccessor` is an array. The filter state shape and all other matchers are unchanged.

## Required context

### Current range matcher

```js
// wheelsSelectors.js
const matchers = {
  range: (value, filter) =>
    !Number.isFinite(value) || (value >= filter.value.min && value <= filter.value.max),
  // ...
};
```

This matcher takes a single scalar `value` and checks whether it falls within `[filter.value.min, filter.value.max]`. The `!Number.isFinite(value)` guard is a null-pass: wheels with no value for the spec are never filtered out.

### How the selector calls matchers

```js
// wheelsSelectors.js — selectFilteredWheels
filterables.every((property) => {
  const f = filtersState.filters[property.id];
  if (!f || !f.enabled) return true;
  const matcher = matchers[property.filter.type];
  if (!matcher) return true;
  return matcher(property.accessor(wheel), f);   // <-- currently passes accessor result
});
```

### Required change

1. The selector must use `filterAccessor` when it is present on the property, falling back to `accessor` when not:
   ```js
   const rawValue = property.filterAccessor
     ? property.filterAccessor(wheel)
     : property.accessor(wheel);
   return matcher(rawValue, f);
   ```

2. The `range` matcher must handle array input (OR semantics):
   ```js
   range: (value, filter) => {
     // Array: OR semantics — passes if any element is in range (or out of range null-pass)
     if (Array.isArray(value)) {
       return value.some(
         (v) => !Number.isFinite(v) || (v >= filter.value.min && v <= filter.value.max)
       );
     }
     // Scalar: existing behaviour, unchanged
     return !Number.isFinite(value) || (value >= filter.value.min && value <= filter.value.max);
   },
   ```

3. No other matcher is changed (multiSelect, triState, multiSelectFlat).

4. `makeSelectContextualCountsFor` also calls `matchers` indirectly via the `otherFilterables` loop. That loop uses `p.accessor(wheel)` directly. Update it to use `filterAccessor` when present, identical to the change in `selectFilteredWheels`. Both loops must be consistent.

5. `makeSelectRangeBoundsFor` uses `property.accessor` for computing bounds (a scalar). This does NOT change — the bounds should reflect the max scalar (max of front/rear), not an array.

### Filter state shape: unchanged

The filter state for depth, externalWidth, and internalWidth remains `{ min: number, max: number }`. The OR semantics affect only the evaluation against that range, not the state shape or the filter UI.

## Potentially impacted files

- `frontend/src/store/selectors/wheelsSelectors.js` — update `matchers.range` and both filter loops
- `frontend/src/store/selectors/__tests__/wheelsSelectors.test.js` — new or extended test file

## Inputs

- `wheelsSelectors.js` current source (read before editing).
- `wheelProperties.jsx` with `filterAccessor` present after TASK-002.

## Expected outputs

- `wheelsSelectors.js` updated with new range matcher and `filterAccessor` dispatch.
- Unit and integration tests covering OR semantics.

## Constraints

- The existing `!Number.isFinite(value)` null-pass behaviour must be preserved. Wheels with a null/undefined spec must never be filtered out by a range filter.
- For the array case: if ANY element passes the `Number.isFinite` check AND is in range, the wheel passes. If all elements fail `isFinite`, the null-pass applies (wheel passes).
- No change to state shape, no change to other matchers.
- No change to `filtersSlice.js`.
- No change to `rangeMath.js`.

## Dependencies

TASK-002

## Validation criteria

- [ ] A wheel with `rim.depth_mm: { front: 50, rear: 60 }` passes a depth range filter of 55–70 (rear 60 is in range).
- [ ] A wheel with `rim.depth_mm: { front: 40, rear: 45 }` does NOT pass a depth range filter of 55–70 (neither value in range).
- [ ] A wheel with `rim.depth_mm: { front: 50, rear: 60 }` passes a depth range filter of 48–55 (front 50 is in range).
- [ ] A wheel with `rim.depth_mm: 45` (scalar) passes a depth range filter of 40–50 (unchanged behaviour).
- [ ] A wheel with `rim.depth_mm: null` passes any depth range filter (null-pass, unchanged behaviour).
- [ ] A wheel with `weight_grams: { front: 720, rear: 850 }` passes a weight range filter of 1500–1650 (total 1570 is in range). Weight uses `accessor` (no `filterAccessor`), so total is the scalar.
- [ ] A wheel with `weight_grams: { front: 720, rear: 850 }` does NOT pass a weight range filter of 700–900 (total 1570 is outside 700–900; individual values are not used).
- [ ] Non-regression: scalar-only catalog produces identical filter results to pre-EVO-038 baseline.
- [ ] `makeSelectContextualCountsFor` correctly applies OR semantics for depth when called with a mixed catalog.
- [ ] All tests pass.

## Tests to implement

### Unit

**wheelsSelectors.test.js** (new or extend existing):

Range matcher unit tests (call `matchers.range` directly by exporting it from the module, or test via the selector):
- Scalar value in range → passes.
- Scalar value out of range → fails.
- Null value → null-pass (passes).
- Array with one value in range → passes (OR).
- Array with both values out of range → fails.
- Array with all null values → null-pass (passes).

### Integration

`selectFilteredWheels` integration tests with a mixed catalog (some entries with scalar depth, some with pairs):
- Filter that includes a pair entry (OR match on rear): correct subset returned.
- Filter that excludes a pair entry (neither value in range): entry not in result.
- Sort by depth desc with mixed entries: pair entries ranked by max value, scalar entries by their value; order is correct.
- Weight total filter with pair entry: correct subset returned.
- Regression: scalar-only catalog with same filter → same result as before.
