# TASK-002 — Normalize freehub_options in wheelsData_roval.js

## Objective

Replace all non-canonical `freehub_options` string values in `frontend/src/data/wheelsData_roval.js` with their canonical equivalents.

## Required context

The `freehub_options` field on each wheel object is an array of strings. The filter system matches against these strings exactly. Only the following 6 values are canonical: `'Shimano HG'`, `'Shimano Micro Spline'`, `'SRAM XD'`, `'SRAM XDR'`, `'Campagnolo ED'`, `'Campagnolo N3W'`.

## Potentially impacted files

- `frontend/src/data/wheelsData_roval.js`

## Inputs

Current alias values found in this file and their required replacements:

| Alias (current) | Canonical (target) |
|---|---|
| `'SRAM XD-R'` | `'SRAM XDR'` |
| `'Shimano HG 11-speed'` | `'Shimano HG'` |
| `'Shimano HG 11/12-speed'` | `'Shimano HG'` |

Affected wheels:
- Line 13: `['SRAM XD-R', 'Shimano HG 11/12-speed']`
- Line 57: `['SRAM XD-R', 'Shimano HG 11/12-speed']`
- Line 101: `['Shimano HG 11-speed']`
- Line 139: `['Shimano HG 11-speed']`
- Line 177: `['Shimano HG 11-speed']`
- Line 216: `['Shimano HG 11-speed']`
- Line 255: `['SRAM XD-R', 'Shimano HG 11/12-speed']`
- Line 293: `['Shimano HG 11-speed']`
- Line 328: `['Shimano HG 11-speed']`

## Expected outputs

Every `freehub_options` array in the file contains only canonical values. None of `'SRAM XD-R'`, `'Shimano HG 11-speed'`, `'Shimano HG 11/12-speed'` remain.

Example — line 13 before:
```js
freehub_options: ['SRAM XD-R', 'Shimano HG 11/12-speed']
```
After:
```js
freehub_options: ['SRAM XDR', 'Shimano HG']
```

## Constraints

- Do not reorder entries unnecessarily.
- Do not introduce duplicate canonical values in any array.
- Do not modify any field other than `freehub_options`.

## Dependencies

none

## Validation criteria

- [ ] No occurrence of `'SRAM XD-R'` remains in the file.
- [ ] No occurrence of `'Shimano HG 11-speed'` remains in the file.
- [ ] No occurrence of `'Shimano HG 11/12-speed'` remains in the file.
- [ ] All 9 wheels have `freehub_options` entries from the canonical set only.

## Tests to implement

### Unit
- None — data file only.

### Integration
- None — no logic change.
