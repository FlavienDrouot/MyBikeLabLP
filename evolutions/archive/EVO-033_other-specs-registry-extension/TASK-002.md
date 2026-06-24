# TASK-002 — Add `multiSelectFlat` support in `wheelsSelectors.js`

## Objective

Extend the selector layer to handle the new `multiSelectFlat` filter type. This involves three changes:
1. Add a `multiSelectFlat` entry to the `matchers` object.
2. Fix null/undefined filtering in `makeSelectOptionsFor` for all types, and add array-flattening logic for `multiSelectFlat`.
3. Add array-aware contextual count logic in `makeSelectContextualCountsFor` for `multiSelectFlat`.

## Required context

### File to modify

`frontend/src/store/selectors/wheelsSelectors.js`

### Existing structure

The file exports:
- `matchers` object: keyed by filter type, each value is `(value, filter) => boolean`
- `selectFilteredWheels` memoized selector: uses `matchers` to filter wheels
- `makeSelectOptionsFor(propertyId)`: returns deduplicated sorted option list from all wheels
- `makeSelectContextualCountsFor(propertyId)`: returns `{ [option]: count }` given other active filters
- `makeSelectRangeBoundsFor(propertyId)`: not affected by this task

### Current `matchers` object

```js
const matchers = {
  range: (value, filter) =>
    !Number.isFinite(value) || (value >= filter.value.min && value <= filter.value.max),
  multiSelect: (value, filter) =>
    filter.value.length === 0 || filter.value.includes(value),
  triState: (value, filter) =>
    filter.value === null || value === filter.value,
};
```

### Current `makeSelectOptionsFor`

```js
export const makeSelectOptionsFor = (propertyId) =>
  createSelector(
    [(state) => state.wheels.items],
    (items) => {
      const property = getPropertyById(propertyId);
      if (!property) return [];
      return [...new Set(items.map(property.accessor))].sort();
    }
  );
```

### Current `makeSelectContextualCountsFor`

```js
export const makeSelectContextualCountsFor = (propertyId) =>
  createSelector(
    [(state) => state.wheels.items, (state) => state.filters],
    (items, filtersState) => {
      const property = getPropertyById(propertyId);
      if (!property) return {};

      const otherFilterables = getFilterableProperties().filter((p) => p.id !== propertyId);

      const filteredItems = items.filter((wheel) =>
        otherFilterables.every((p) => {
          const f = filtersState.filters[p.id];
          if (!f || !f.enabled) return true;
          const matcher = matchers[p.filter.type];
          if (!matcher) return true;
          return matcher(p.accessor(wheel), f);
        })
      );

      const counts = {};
      for (const wheel of filteredItems) {
        const key = String(property.accessor(wheel));
        counts[key] = (counts[key] ?? 0) + 1;
      }
      return counts;
    }
  );
```

## Expected outputs

### 1. Add `multiSelectFlat` matcher

Add the following entry to `matchers`:

```js
multiSelectFlat: (value, filter) => {
  if (filter.value.length === 0) return true;
  if (!Array.isArray(value) || value.length === 0) return true; // null-pass
  return filter.value.some((selected) => value.includes(selected));
},
```

Semantics:
- If no filter values are selected (`filter.value.length === 0`): all wheels pass.
- If the wheel's value is not an array or is empty (null/undefined/absent): wheel passes (null-pass rule, consistent with FR-006).
- Otherwise: wheel passes if its array contains at least one of the selected filter values.

### 2. Fix `makeSelectOptionsFor`

Replace the function with a version that:
- Filters out `null` and `undefined` values before deduplication (for all property types)
- For `multiSelectFlat` properties: flattens per-wheel arrays, filters nullish values, then deduplicates and sorts

```js
export const makeSelectOptionsFor = (propertyId) =>
  createSelector(
    [(state) => state.wheels.items],
    (items) => {
      const property = getPropertyById(propertyId);
      if (!property) return [];

      if (property.filter?.type === 'multiSelectFlat') {
        const all = [];
        for (const item of items) {
          const arr = property.accessor(item);
          if (Array.isArray(arr)) {
            for (const v of arr) {
              if (v != null) all.push(v);
            }
          }
        }
        return [...new Set(all)].sort();
      }

      return [
        ...new Set(items.map(property.accessor).filter((v) => v != null)),
      ].sort();
    }
  );
```

### 3. Fix `makeSelectContextualCountsFor`

Replace the counting loop with a version that handles `multiSelectFlat`:

```js
const counts = {};
if (property.filter?.type === 'multiSelectFlat') {
  for (const wheel of filteredItems) {
    const arr = property.accessor(wheel);
    if (Array.isArray(arr)) {
      for (const v of arr) {
        if (v != null) {
          const key = String(v);
          counts[key] = (counts[key] ?? 0) + 1;
        }
      }
    }
  }
} else {
  for (const wheel of filteredItems) {
    const key = String(property.accessor(wheel));
    counts[key] = (counts[key] ?? 0) + 1;
  }
}
return counts;
```

## Constraints

- Do not modify any other function in the file.
- The null-pass rule in the `multiSelectFlat` matcher must match FR-006: a wheel with `null`, `undefined`, or absent value for the property passes the filter regardless of selected values.
- The `matchers` change is backward-compatible: existing keys (`range`, `multiSelect`, `triState`) are unchanged.
- The `makeSelectOptionsFor` null filtering change is backward-compatible: it only removes entries that previously appeared as `"null"` or `"undefined"` strings — no valid option is removed.

## Dependencies

none

## Validation criteria

- [ ] `matchers.multiSelectFlat` is defined and returns `true` when `filter.value` is empty
- [ ] `matchers.multiSelectFlat` returns `true` when `value` is `null`, `undefined`, or not an array (null-pass)
- [ ] `matchers.multiSelectFlat` returns `true` when the wheel's array contains at least one of the selected values
- [ ] `matchers.multiSelectFlat` returns `false` when the wheel's array contains none of the selected values
- [ ] `makeSelectOptionsFor` for a `multiSelectFlat` property returns a flat deduplicated sorted array of individual string values (not array references)
- [ ] `makeSelectOptionsFor` does not include `null` or `undefined` in the option list for any property type
- [ ] `makeSelectContextualCountsFor` for a `multiSelectFlat` property counts each element of each wheel's array individually
- [ ] Existing `makeSelectOptionsFor` behavior for `multiSelect`, `triState`, and `range` properties is unchanged (minus null/undefined removal, which is the intentional fix)

## Tests to implement

### Unit

None — no automated test suite for selectors currently exists.

### Integration

Manual: after TASK-005 registers the new properties, open the `freehubOptions` filter in the comparator and confirm:
- The option list contains individual values (`HG`, `XDR`, `N3W`, `Microspline`, etc.) not array strings like `HG,XDR,N3W`
- Contextual counts next to each option update when other filters are active
- Selecting `'N3W'` shows only wheels whose `freehub_options` array includes `'N3W'`; track wheels (no `freehub_options`) remain visible
