# TASK-002 — Normalize categorical values in `wheelsData.js` to lowercase snake_case

## Objective

Change every categorical string value in `wheelsData.js` that corresponds to a `translatable: true` property (`rimMaterial`, `spokeMaterial`) to lowercase snake_case. This ensures the values match the `[fieldId].[value]` translation key pattern used by the rendering pipeline.

## Required context

- `wheelsData.js` is at `src/data/wheelsData.js`.
- The fields to normalize are:
  - `rim.material` (accessor for `rimMaterial` property: `(w) => w.rim.material`)
  - `spokes.material` (accessor for `spokeMaterial` property: `(w) => w.spokes.material`)
- The `hookless` property value is a boolean (`w.rim.hookless`). Booleans do not need normalization — they are handled at render time via `String(w.rim.hookless)`.
- All other fields in `wheelsData.js` (brand, model, hub brand/model, spokes brand/model, numeric values) must not be changed.

## Normalization rules

Apply these exact transformations to all occurrences in `wheelsData.js`:

| Current value | Normalized value |
|---|---|
| `'Carbon'` | `'carbon'` |
| `'Aluminum'` | `'aluminum'` |
| `'Stainless Steel'` | `'stainless_steel'` |

These transformations apply only to `rim.material` and `spokes.material` fields. Do not apply them to brand names, model names, or any other field.

## Current values in the dataset (verified)

- `rim.material`: all 15 wheels have `'Carbon'` → normalize to `'carbon'`
- `spokes.material`:
  - 13 wheels: `'Stainless Steel'` → normalize to `'stainless_steel'`
  - 1 wheel (id: 4, Fulcrum Racing Zero Carbon): `'Aluminum'` → normalize to `'aluminum'`

## Potentially impacted files

- `src/data/wheelsData.js`

## Inputs

- Current `src/data/wheelsData.js` (read before editing).
- Verified field paths above.

## Expected outputs

- `wheelsData.js` where every `rim.material` value is a lowercase snake_case string (`'carbon'` or `'aluminum'`).
- Every `spokes.material` value is a lowercase snake_case string (`'stainless_steel'` or `'aluminum'`).
- All other values in the file are unchanged.

## Constraints

- Do not change `brand`, `model`, `hub.brand`, `hub.model`, `spokes.brand`, `spokes.model`, or any numeric field.
- Do not change the hookless boolean values.
- Do not add or remove wheels from the dataset.
- The file must remain valid JavaScript (no syntax errors).

## Dependencies

none

## Validation criteria

- [ ] All `rim.material` values in the file are `'carbon'` or `'aluminum'` (lowercase, no mixed case or spaces).
- [ ] All `spokes.material` values in the file are `'stainless_steel'` or `'aluminum'` (lowercase snake_case).
- [ ] No brand, model, or numeric value is altered.
- [ ] The existing test suite passes without modification (`npm run test`). In particular, `wheelsSelectors.test.js` uses `rim.material` values — verify the test uses lowercase after this change (if it uses raw values like `'Carbon'`, update the test's expected strings to match the new lowercase form).

## Tests to implement

### Unit

No new test file in this task. After editing, run the existing test suite to detect any test that hard-codes a raw categorical value that must be updated to its normalized form.

Specifically inspect `src/store/selectors/__tests__/wheelsSelectors.test.js` — it contains assertions on `rimMaterial` values (e.g. `{ Carbon: 2 }`). If any such assertion uses the old mixed-case form, update those expected values to the new lowercase form (e.g. `{ carbon: 2 }`).

### Integration

None — this task normalizes data only; no UI behavior changes until TASK-003 and TASK-004 are merged.
