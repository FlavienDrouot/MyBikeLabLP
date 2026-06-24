# TASK-001 — Create `resolveSpec` utility and `wheelValidator`

## Objective

Create two new utility files:
1. `src/data/wheelUtils.js` — exports `resolveSpec`, the single canonical interpreter for divergent-eligible field values.
2. `src/data/wheelValidator.js` — exports `validateWheelEntry` and `validateWheelsCatalog`, which check entries for ingestion correctness and return warning strings.

Write unit tests for both files.

## Required context

### Data model for divergent specs

A divergent-eligible spec field (rim depth, external width, internal width, weight) may hold one of two forms:
- **Single-value form**: a plain number, e.g. `45`. Means front = rear = 45.
- **Pair form**: an object `{ front: number, rear: number }`, e.g. `{ front: 50, rear: 60 }`. Both keys are required.

The four eligible field paths in a wheelset object are:
- `rim.depth_mm`
- `rim.externalWidth_mm`
- `rim.internalWidth_mm`
- `weight_grams`

No other fields are eligible for the pair form.

### `resolveSpec` specification

```js
resolveSpec(value)
// Returns: { front: number, rear: number, total: number, isSingle: boolean }
```

| Input | front | rear | total | isSingle |
|---|---|---|---|---|
| `45` (scalar) | 45 | 45 | 45 | true |
| `{ front: 50, rear: 60 }` | 50 | 60 | 110 | false |
| `{ front: 60, rear: 60 }` | 60 | 60 | 120 | true |
| `{ front: 50 }` (missing rear) | 50 | 50 | 50 | true — normalized, log warning |
| `{ rear: 60 }` (missing front) | 60 | 60 | 60 | true — normalized, log warning |
| `null` / `undefined` | null | null | null | true |

When `front === rear` (whether from a pair or a scalar), `isSingle` is `true`.

The `total` field for weight semantics is always `front + rear` when both are numbers, or the scalar directly.

For single-value inputs, `total === front === rear`.

### Validation rules (FR-010, FR-011)

`validateWheelEntry(entry)` must check:
1. For each eligible field (list above): if the value is an object with only `front` or only `rear` (not both), produce a warning: `"[field] on entry [id]: incomplete pair { front/rear only }, normalized to single value [n]"`.
2. For any field that is NOT in the eligible list: if the value is an object with `front` and `rear` keys, produce a warning: `"[field] on entry [id]: pair form is not eligible for divergence, value rejected"`.
3. No throw. Return an array of warning strings (empty array if valid).

`validateWheelsCatalog(entries)` calls `validateWheelEntry` for each entry and returns a flat array of all warnings.

### Important: `other_specs.weight_front_g` / `other_specs.weight_rear_g` are NOT the canonical pair form

Several existing Zipp entries have `other_specs.weight_front_g` and `other_specs.weight_rear_g`. These are informational annotation fields, not the new divergent form. The validator must NOT flag these as errors. Only the four canonical eligible fields listed above are subject to validation. Add a JSDoc comment to `wheelValidator.js` documenting this distinction.

## Potentially impacted files

- `frontend/src/data/wheelUtils.js` — **new file**
- `frontend/src/data/wheelValidator.js` — **new file**
- `frontend/src/data/__tests__/wheelUtils.test.js` — **new file**
- `frontend/src/data/__tests__/wheelValidator.test.js` — **new file**

## Inputs

- PRD FR-010 (incomplete pair normalization) and FR-011 (ineligible divergence rejection).
- The four eligible field paths listed above.

## Expected outputs

- `wheelUtils.js` exporting `resolveSpec`.
- `wheelValidator.js` exporting `validateWheelEntry` and `validateWheelsCatalog`.
- Unit test files covering all cases listed in "Tests to implement" below.

## Constraints

- `resolveSpec` must be a pure function with no side effects (no console.warn inside it).
- `validateWheelEntry` may call `console.warn` but must also return the warnings as strings so tests can assert on them without capturing console output.
- Both files must use ES module syntax (`export`), not CommonJS.
- Do not import from any React or Redux dependency — these are pure data utilities.

## Dependencies

none

## Validation criteria

- [ ] `resolveSpec(45)` returns `{ front: 45, rear: 45, total: 45, isSingle: true }`.
- [ ] `resolveSpec({ front: 50, rear: 60 })` returns `{ front: 50, rear: 60, total: 110, isSingle: false }`.
- [ ] `resolveSpec({ front: 60, rear: 60 })` returns `isSingle: true` (equal pair collapses).
- [ ] `resolveSpec({ front: 50 })` returns `isSingle: true`, `front === rear === 50`.
- [ ] `resolveSpec(null)` returns `{ front: null, rear: null, total: null, isSingle: true }`.
- [ ] `validateWheelEntry` returns a non-empty array for a wheelset with `rim: { depth_mm: { front: 50 } }` (missing rear).
- [ ] `validateWheelEntry` returns a non-empty array for a wheelset with `brand: { front: "Zipp", rear: "Zipp" }`.
- [ ] `validateWheelEntry` returns an empty array for a valid scalar-only entry.
- [ ] `validateWheelEntry` returns an empty array for a valid pair entry (both keys present, eligible field).
- [ ] `validateWheelEntry` does NOT flag `other_specs.weight_front_g` / `other_specs.weight_rear_g` as errors.
- [ ] All tests pass.

## Tests to implement

### Unit

**wheelUtils.test.js**
- `resolveSpec` with scalar input
- `resolveSpec` with valid pair (front ≠ rear)
- `resolveSpec` with equal pair (front = rear)
- `resolveSpec` with incomplete pair (front only)
- `resolveSpec` with incomplete pair (rear only)
- `resolveSpec` with null
- `resolveSpec` with undefined

**wheelValidator.test.js**
- Valid entry with all scalar fields → no warnings
- Valid entry with valid pair on eligible field → no warnings
- Entry with incomplete pair on `rim.depth_mm` (front only) → one warning, message includes field name and entry id
- Entry with incomplete pair on `weight_grams` (rear only) → one warning
- Entry with pair on ineligible field (`brand`) → one warning
- Entry with multiple issues → multiple warnings
- `validateWheelsCatalog` with two entries, one valid and one invalid → only warnings from the invalid entry
- Entry with `other_specs.weight_front_g` present → no warning (not a canonical pair field)

### Integration

None for this task — integration is covered by TASK-003 and TASK-005.
