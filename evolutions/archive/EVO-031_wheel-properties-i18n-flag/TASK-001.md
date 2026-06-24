# TASK-001 — Add `translatable` boolean to every WHEEL_PROPERTIES entry

## Objective

Add an explicit `translatable: boolean` field to every entry in `WHEEL_PROPERTIES` in `src/config/wheelProperties.jsx`. This field is the central registry marker that governs how property values are rendered in the comparator UI and tested by the automated suite.

## Required context

- `WHEEL_PROPERTIES` is an array of property descriptor objects defined in `src/config/wheelProperties.jsx`.
- No other file is modified in this task.
- The full list of current property IDs (in order): `image`, `model`, `brand`, `weight`, `price`, `diameter`, `rimMaterial`, `hookless`, `depth`, `rimWidth`, `hub`, `hubBrand`, `hubModel`, `spokes`, `spokesBrand`, `spokesModel`, `spokeMaterial`.

## Potentially impacted files

- `src/config/wheelProperties.jsx`

## Inputs

- Current `src/config/wheelProperties.jsx` (read before editing).

## Expected outputs

Every entry in `WHEEL_PROPERTIES` has a `translatable` field set to the exact boolean value specified below:

| Property ID | `translatable` |
|---|---|
| `image` | `false` |
| `model` | `false` |
| `brand` | `false` |
| `weight` | `false` |
| `price` | `false` |
| `diameter` | `false` |
| `rimMaterial` | `true` |
| `hookless` | `true` |
| `depth` | `false` |
| `rimWidth` | `false` |
| `hub` | `false` |
| `hubBrand` | `false` |
| `hubModel` | `false` |
| `spokes` | `false` |
| `spokesBrand` | `false` |
| `spokesModel` | `false` |
| `spokeMaterial` | `true` |

Add `translatable` as a top-level field on the property object, at the same level as `id`, `label`, `group`, `accessor`. Placement: add it immediately after the `group` field on each entry (for consistency).

## Constraints

- Do not modify any field other than adding `translatable`.
- Do not change `accessor`, `filter`, `sorts`, `column`, `label`, or `group` on any entry.
- No other files are touched in this task.

## Dependencies

none

## Validation criteria

- [ ] Every entry in `WHEEL_PROPERTIES` has a `translatable` field of type boolean (no entry is missing it).
- [ ] `rimMaterial`, `spokeMaterial`, `hookless` have `translatable: true`.
- [ ] All other 14 entries have `translatable: false`.
- [ ] No existing field on any entry is altered.
- [ ] The file remains valid JSX (no syntax errors).

## Tests to implement

### Unit

No new test file in this task. Tests for registry completeness are written in TASK-006. However, the implementation agent must ensure existing tests still pass after this change:
- Run the existing test suite (`npm run test`) and confirm zero failures.

### Integration

None — this task only adds metadata to the registry; no runtime behavior changes.
