# TASK-003 — Add `multiSelectFlat` initial state case in `filtersSlice.js`

## Objective

Add a `case 'multiSelectFlat'` branch to the `buildInitialFilters` switch statement in `filtersSlice.js` so that properties with filter type `multiSelectFlat` are initialized with an empty array `[]` — the correct initial state for a multi-select filter.

## Required context

### File to modify

`frontend/src/store/slices/filtersSlice.js`

### Existing `buildInitialFilters` switch

```js
const buildInitialFilters = () => {
  const filters = {};
  for (const property of getFilterableProperties()) {
    let value;
    switch (property.filter.type) {
      case 'range': {
        // ... computes { min, max } from data
        break;
      }
      case 'multiSelect':
        value = [];
        break;
      case 'triState':
        value = null;
        break;
      default:
        value = null;
    }
    filters[property.id] = { value, enabled: true };
  }
  return filters;
};
```

### Problem

Without a `case 'multiSelectFlat'` branch, properties using that filter type fall through to `default: value = null`. A `null` initial value is incompatible with `MultiSelectFilter`'s rendering, which expects `filter.value` to be an array (it calls `filter.value.includes(option)` and `filter.value.length`). This would cause a runtime error.

## Expected outputs

Add the following case immediately after `case 'multiSelect'`:

```js
case 'multiSelectFlat':
  value = [];
  break;
```

The resulting switch block becomes:

```js
switch (property.filter.type) {
  case 'range': {
    // ... unchanged
    break;
  }
  case 'multiSelect':
    value = [];
    break;
  case 'multiSelectFlat':
    value = [];
    break;
  case 'triState':
    value = null;
    break;
  default:
    value = null;
}
```

No other change to the file is required.

## Constraints

- Only add the `case 'multiSelectFlat'` branch. Do not modify any existing case.
- The initial value `[]` is correct: an empty array means "no filter applied" for multi-select types.
- The `enabled: true` initialization for the new filter entries is inherited from the existing `filters[property.id] = { value, enabled: true }` line — do not change that line.

## Dependencies

none

## Validation criteria

- [ ] The `buildInitialFilters` switch statement contains a `case 'multiSelectFlat'` that sets `value = []`
- [ ] The Redux store initializes all `multiSelectFlat` filter states with `{ value: [], enabled: true }`
- [ ] No existing filter type initialization is changed
- [ ] `resetFilters` action (which calls `buildInitialState`) correctly resets `multiSelectFlat` filters to `[]`

## Tests to implement

### Unit

None — no automated test suite for the slice currently exists.

### Integration

Manual: after TASK-005 registers the new `multiSelectFlat` property (`freehubOptions`), load the comparator and confirm:
- No console error related to `filter.value.includes is not a function` or similar
- The `freehubOptions` filter renders without errors
- Clicking "Reset" in the filter panel clears the `freehubOptions` filter selection back to empty
