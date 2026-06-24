# TASK-004 — Normalize freehub_options in wheelsData_zipp.js

## Objective

Replace all occurrences of the composite value `'SRAM/Shimano Road'` in `frontend/src/data/wheelsData_zipp.js` with the canonical `'Shimano HG'`.

## Required context

The `freehub_options` field on each wheel object is an array of strings. The filter system matches against these strings exactly. Only the following 6 values are canonical: `'Shimano HG'`, `'Shimano Micro Spline'`, `'SRAM XD'`, `'SRAM XDR'`, `'Campagnolo ED'`, `'Campagnolo N3W'`.

`'SRAM/Shimano Road'` is a composite label meaning the wheel is sold in both SRAM XDR and Shimano HG configurations. It must be split into two separate array entries. In every Zipp array that contains it, `'SRAM XDR'` is already present — so `'SRAM/Shimano Road'` must be **replaced by `'Shimano HG'`**, not by `['SRAM XDR', 'Shimano HG']` (which would duplicate `'SRAM XDR'`).

## Potentially impacted files

- `frontend/src/data/wheelsData_zipp.js`

## Inputs

All 13 wheels in the file contain `'SRAM/Shimano Road'`. Current arrays and expected results:

| Line | Current array | After |
|---|---|---|
| 13 | `['SRAM XDR', 'SRAM/Shimano Road']` | `['SRAM XDR', 'Shimano HG']` |
| 55 | `['SRAM XDR', 'SRAM/Shimano Road']` | `['SRAM XDR', 'Shimano HG']` |
| 90 | `['SRAM XDR', 'SRAM/Shimano Road']` | `['SRAM XDR', 'Shimano HG']` |
| 128 | `['SRAM XDR', 'SRAM/Shimano Road']` | `['SRAM XDR', 'Shimano HG']` |
| 167 | `['SRAM XDR', 'SRAM/Shimano Road']` | `['SRAM XDR', 'Shimano HG']` |
| 205 | `['SRAM XDR', 'SRAM/Shimano Road']` | `['SRAM XDR', 'Shimano HG']` |
| 240 | `['SRAM XDR', 'SRAM/Shimano Road']` | `['SRAM XDR', 'Shimano HG']` |
| 279 | `['SRAM XDR', 'SRAM/Shimano Road']` | `['SRAM XDR', 'Shimano HG']` |
| 313 | `['SRAM XDR', 'SRAM/Shimano Road']` | `['SRAM XDR', 'Shimano HG']` |
| 358 | `['SRAM XDR', 'SRAM/Shimano Road']` | `['SRAM XDR', 'Shimano HG']` |
| 397 | `['SRAM XDR', 'SRAM/Shimano Road', 'Campagnolo N3W']` | `['SRAM XDR', 'Shimano HG', 'Campagnolo N3W']` |
| 434 | `['SRAM XDR', 'SRAM/Shimano Road']` | `['SRAM XDR', 'Shimano HG']` |
| 475 | `['SRAM XDR', 'SRAM/Shimano Road']` | `['SRAM XDR', 'Shimano HG']` |

## Expected outputs

No occurrence of `'SRAM/Shimano Road'` remains in the file. Every affected array contains both `'SRAM XDR'` and `'Shimano HG'` as separate entries.

## Constraints

- **Critical:** Do not add `'SRAM XDR'` a second time — it is already present in every array. Only replace `'SRAM/Shimano Road'` with `'Shimano HG'`.
- Do not reorder other entries unnecessarily.
- Do not modify any field other than `freehub_options`.

## Dependencies

none

## Validation criteria

- [ ] No occurrence of `'SRAM/Shimano Road'` remains in the file.
- [ ] Every wheel that previously had `'SRAM/Shimano Road'` now has both `'SRAM XDR'` and `'Shimano HG'` in its `freehub_options` array.
- [ ] No `freehub_options` array contains `'SRAM XDR'` more than once.
- [ ] All 13 wheels have `freehub_options` entries from the canonical set only.

## Tests to implement

### Unit
- None — data file only.

### Integration
- None — no logic change.
