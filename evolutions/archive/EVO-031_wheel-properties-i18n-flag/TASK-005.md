# TASK-005 — Update callers of `renderCellFor` to pass `t` as second argument

## Objective

Update all callers of `renderCellFor` in the codebase to pass the i18next `t` function as the second argument, enabling translated cell values in the comparator table and its measuring twin.

## Required context

### Current callers

There are exactly two callers of `renderCellFor`:

#### `ComparisonTable.jsx`

Located at `src/components/MiniComparator/ComparisonTable.jsx`.

`t` is already available in this component via:
```js
const { t } = useTranslation();
```

Current call site (line ~147):
```jsx
{renderCellFor(p)(w)}
```

Must become:
```jsx
{renderCellFor(p, t)(w)}
```

This change appears in **two places** in `ComparisonTable.jsx`:
1. In the visible `<tbody>` rows (line ~147).
2. The `MeasuringTable` is a separate component — its call is handled below.

#### `MeasuringTable.jsx`

Located at `src/components/MiniComparator/MeasuringTable.jsx`.

`t` is already available in this component via:
```js
const { t } = useTranslation();
```

Current call site:
```jsx
{renderCellFor(p)(w)}
```

Must become:
```jsx
{renderCellFor(p, t)(w)}
```

### Why MeasuringTable must also be updated

`MeasuringTable` renders a hidden twin of the full dataset to measure column widths. If its cell content uses untranslated raw values while the visible table shows translated text, the measured widths may be narrower than the rendered content, causing clipping. Both components must render identical cell content.

### No other callers

A search of the codebase confirms `renderCellFor` is called only in `ComparisonTable.jsx` and `MeasuringTable.jsx`. No other file imports or calls this function.

## Potentially impacted files

- `src/components/MiniComparator/ComparisonTable.jsx`
- `src/components/MiniComparator/MeasuringTable.jsx`

## Inputs

- Current `src/components/MiniComparator/ComparisonTable.jsx` (read before editing).
- Current `src/components/MiniComparator/MeasuringTable.jsx` (read before editing).
- TASK-004 must be merged (`renderCellFor` must accept `(property, t)`).

## Expected outputs

- In `ComparisonTable.jsx`: `renderCellFor(p, t)(w)` at the call site in the visible tbody.
- In `MeasuringTable.jsx`: `renderCellFor(p, t)(w)` at the call site in the tbody rows.
- Both files compile without errors.

## Constraints

- Do not change any other logic in `ComparisonTable.jsx` or `MeasuringTable.jsx`.
- Do not add a new `useTranslation()` call — `t` is already available in both components.
- The change is mechanical: only the `renderCellFor(p)` calls become `renderCellFor(p, t)`.

## Dependencies

TASK-004

## Validation criteria

- [ ] `ComparisonTable.jsx` calls `renderCellFor(p, t)(w)` (not `renderCellFor(p)(w)`) in the visible tbody.
- [ ] `MeasuringTable.jsx` calls `renderCellFor(p, t)(w)` (not `renderCellFor(p)(w)`) in its tbody.
- [ ] Both files compile without TypeScript or ESLint errors.
- [ ] `npm run test` passes — specifically, the existing `ComparisonTable.test.jsx` and `Landing.xx.test.jsx` tests pass.
- [ ] With the `xx` locale active in tests, `rimMaterial`, `spokeMaterial`, and `hookless` cells render `"XX"`.

## Tests to implement

### Unit

No new test file in this task. The existing `ComparisonTable.test.jsx` provides non-regression coverage for the table structure. The `Landing.xx.test.jsx` will now catch any untranslated categorical value appearing in the table when the XX locale is active.

### Integration

None — the change is mechanical. Full integration is confirmed by running the test suite.
