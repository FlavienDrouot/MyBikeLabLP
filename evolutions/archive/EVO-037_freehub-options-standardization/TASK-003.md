# TASK-003 — Normalize freehub_options in wheelsData_mavic.js

## Objective

Replace all non-canonical `freehub_options` string values in `frontend/src/data/wheelsData_mavic.js` with their canonical equivalents.

## Required context

The `freehub_options` field on each wheel object is an array of strings. The filter system matches against these strings exactly. Only the following 6 values are canonical: `'Shimano HG'`, `'Shimano Micro Spline'`, `'SRAM XD'`, `'SRAM XDR'`, `'Campagnolo ED'`, `'Campagnolo N3W'`.

## Potentially impacted files

- `frontend/src/data/wheelsData_mavic.js`

## Inputs

Current alias values found in this file and their required replacements:

| Alias (current) | Canonical (target) | Notes |
|---|---|---|
| `'Shimano HG Light'` | `'Shimano HG'` | `'Shimano HG'` is always already present in the same array — **drop the alias entry, do not add a duplicate** |
| `'Shimano MS'` | `'Shimano Micro Spline'` | Simple replacement |
| `'Campagnolo'` | `'Campagnolo ED'` | Simple replacement |

Affected wheels and their current arrays:

- Line 186: `['Shimano HG', 'SRAM XD', 'Shimano HG Light', 'Shimano MS', 'Campagnolo N3W', 'Campagnolo ED']`
  - Drop `'Shimano HG Light'`, replace `'Shimano MS'` → `'Shimano Micro Spline'`
  - Result: `['Shimano HG', 'SRAM XD', 'Shimano Micro Spline', 'Campagnolo N3W', 'Campagnolo ED']`

- Line 259: `['Shimano HG', 'Campagnolo', 'SRAM XD', 'Shimano MS']`
  - Replace `'Campagnolo'` → `'Campagnolo ED'`, replace `'Shimano MS'` → `'Shimano Micro Spline'`
  - Result: `['Shimano HG', 'Campagnolo ED', 'SRAM XD', 'Shimano Micro Spline']`

- Line 296: `['Shimano HG', 'SRAM XD', 'Shimano HG Light', 'Shimano MS', 'Campagnolo N3W', 'Campagnolo ED']`
  - Same as line 186
  - Result: `['Shimano HG', 'SRAM XD', 'Shimano Micro Spline', 'Campagnolo N3W', 'Campagnolo ED']`

- Line 327: `['Shimano HG', 'SRAM XD', 'Shimano HG Light', 'Shimano MS', 'Campagnolo ED', 'Campagnolo N3W']`
  - Drop `'Shimano HG Light'`, replace `'Shimano MS'` → `'Shimano Micro Spline'`
  - Result: `['Shimano HG', 'SRAM XD', 'Shimano Micro Spline', 'Campagnolo ED', 'Campagnolo N3W']`

- Line 400: `['Shimano HG', 'SRAM XD', 'Shimano HG Light', 'Shimano MS', 'Campagnolo ED', 'Campagnolo N3W']`
  - Same as line 327

- Line 439: `['Shimano HG', 'SRAM XD', 'Shimano HG Light', 'Shimano MS', 'Campagnolo ED', 'Campagnolo N3W']`
  - Same as line 327

- Line 513: `['Shimano HG', 'SRAM XD', 'Shimano MS', 'Campagnolo ED', 'Campagnolo N3W']`
  - Replace `'Shimano MS'` → `'Shimano Micro Spline'`
  - Result: `['Shimano HG', 'SRAM XD', 'Shimano Micro Spline', 'Campagnolo ED', 'Campagnolo N3W']`

- Line 552: `['Shimano HG', 'SRAM XD', 'Shimano HG Light', 'Shimano MS', 'Campagnolo ED', 'Campagnolo N3W']`
  - Same as line 327

- Line 591: `['Shimano HG', 'SRAM XD', 'Shimano HG Light', 'Shimano MS', 'Campagnolo ED', 'Campagnolo N3W']`
  - Same as line 327

## Expected outputs

Every `freehub_options` array in the file contains only canonical values. None of `'Shimano HG Light'`, `'Shimano MS'`, `'Campagnolo'` (standalone) remain. No array contains a canonical value more than once.

## Constraints

- **Critical:** `'Shimano HG Light'` must be removed, not replaced by another `'Shimano HG'` — `'Shimano HG'` is already present in every array that contains `'Shimano HG Light'`. Adding a second `'Shimano HG'` would create a duplicate filter option.
- Do not modify any field other than `freehub_options`.
- Do not alter wheels that already use only canonical values (lines 13, 47, 80, 116, 151, 221, 364, 476, 629).

## Dependencies

none

## Validation criteria

- [ ] No occurrence of `'Shimano HG Light'` remains in the file.
- [ ] No occurrence of `'Shimano MS'` remains in the file.
- [ ] No occurrence of `'Campagnolo'` as a standalone value remains (a grep for `'Campagnolo'` that is not followed by ` ED` or ` N3W` returns zero results).
- [ ] No `freehub_options` array contains a duplicate entry.
- [ ] All 18 wheels have `freehub_options` entries from the canonical set only.

## Tests to implement

### Unit
- None — data file only.

### Integration
- None — no logic change.
