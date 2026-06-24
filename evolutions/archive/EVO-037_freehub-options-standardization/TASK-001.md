# TASK-001 — Normalize freehub_options in wheelsData_enve.js

## Objective

Replace all non-canonical `freehub_options` string values in `frontend/src/data/wheelsData_enve.js` with their canonical equivalents.

## Required context

The `freehub_options` field on each wheel object is an array of strings. The filter system matches against these strings exactly. Only the following 6 values are canonical: `'Shimano HG'`, `'Shimano Micro Spline'`, `'SRAM XD'`, `'SRAM XDR'`, `'Campagnolo ED'`, `'Campagnolo N3W'`.

## Potentially impacted files

- `frontend/src/data/wheelsData_enve.js`

## Inputs

Current alias values found in this file and their required replacements:

| Alias (current) | Canonical (target) |
|---|---|
| `'HG'` | `'Shimano HG'` |
| `'XDR'` | `'SRAM XDR'` |
| `'N3W'` | `'Campagnolo N3W'` |
| `'Microspline'` | `'Shimano Micro Spline'` |

Affected wheels (all 6 wheels in the file):
- Line 12: `['HG', 'XDR', 'N3W']`
- Line 58: `['HG', 'XDR', 'N3W', 'Microspline']`
- Line 103: `['HG', 'XDR', 'N3W', 'Microspline']`
- Line 148: `['HG', 'XDR', 'N3W']`
- Line 202: `['HG', 'XDR', 'N3W']`
- Line 250: `['HG', 'XDR', 'Microspline']`

## Expected outputs

Every `freehub_options` array in the file contains only canonical values. None of `'HG'`, `'XDR'`, `'N3W'`, `'Microspline'` remain.

Example — line 12 before:
```js
freehub_options: ['HG', 'XDR', 'N3W']
```
After:
```js
freehub_options: ['Shimano HG', 'SRAM XDR', 'Campagnolo N3W']
```

## Constraints

- Do not reorder entries unnecessarily.
- Do not introduce duplicate canonical values in any array.
- Do not modify any field other than `freehub_options`.

## Dependencies

none

## Validation criteria

- [ ] No occurrence of `'HG'` as a standalone value remains in the file (a grep for `'HG'` matching only the alias, not `'Shimano HG'`, returns zero results).
- [ ] No occurrence of `'XDR'` (alias, not `'SRAM XDR'`) remains.
- [ ] No occurrence of `'N3W'` (alias, not `'Campagnolo N3W'`) remains.
- [ ] No occurrence of `'Microspline'` remains.
- [ ] All 6 wheels have `freehub_options` entries from the canonical set only.

## Tests to implement

### Unit
- None — data file only.

### Integration
- None — no logic change.
