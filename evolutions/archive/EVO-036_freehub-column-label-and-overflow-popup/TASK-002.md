# TASK-002 — Add max-width constraint to `freehubOptions` column spec in registry

## Objective

Modify the `freehubOptions` entry in `wheelProperties.jsx` so that the column's cells are capped at a maximum width of 160 px. This is done by adding `max-w-[160px]` to the existing `cellClassName` string. No other logic changes are needed in this task.

## Required context

- `MyBikeLab/frontend/src/config/wheelProperties.jsx` is the central registry. Column display is controlled via the `column` field on each property entry.
- `cellClassName` is a space-separated string of Tailwind classes applied to every `<td>` for that column. It is consumed by `cellClassFor()` in `columnCells.jsx`, which is called from both `ComparisonTable.jsx` and `MeasuringTable.jsx`.
- Because `MeasuringTable` uses the same `cellClassFor()` output, adding `max-w-[160px]` here automatically constrains the measurement pass. The MeasuringTable will never report a width exceeding 160 px for this column, and the `<col>` element will therefore be set to at most 160 px.
- The existing `freehubOptions` column spec (current state in `wheelProperties.jsx`):
  ```js
  column: {
    defaultVisible: false,
    headClassName: 'px-4 py-3 font-semibold',
    cellClassName: 'px-4 py-3 text-ink-11',
    renderCell: (w) => {
      const arr = w.hub?.freehub_options;
      return Array.isArray(arr) && arr.length > 0 ? arr.join(' / ') : null;
    },
  },
  ```
- The `<td>` elements already receive `whitespace-nowrap overflow-hidden text-ellipsis` from `ComparisonTable.jsx` (hardcoded on every `<td>` in the row map). These classes combined with `max-w-[160px]` on the `<td>` produce the truncation behavior required by FR-002 and FR-003.
- Important: `max-w` on a `<td>` works when the table uses `table-layout: fixed` (which `ComparisonTable` does once `widthsReady` is true). Before `widthsReady`, the table uses auto layout; the max-width still applies as a cap in auto layout.

## Potentially impacted files

- `MyBikeLab/frontend/src/config/wheelProperties.jsx`

## Inputs

- PRD FR-002: column must never exceed maximum width.
- PRD FR-003: content exceeding max width must be truncated with an ellipsis indicator.
- Architecture decision AD-002.

## Expected outputs

Updated `freehubOptions` column spec:
```js
column: {
  defaultVisible: false,
  headClassName: 'px-4 py-3 font-semibold',
  cellClassName: 'px-4 py-3 text-ink-11 max-w-[160px]',
  renderCell: (w) => {
    const arr = w.hub?.freehub_options;
    return Array.isArray(arr) && arr.length > 0 ? arr.join(' / ') : null;
  },
},
```

No other changes to the file.

## Constraints

- Only the `freehubOptions` entry is modified. All other property entries remain untouched.
- Do not add the `max-w` to `headClassName`; the constraint applies to data cells only.
- Do not change the `renderCell` function in this task. TASK-004 will replace it with a `FreehubCell` component.
- Do not add truncation classes (`overflow-hidden`, `text-ellipsis`, `whitespace-nowrap`) to `cellClassName` here — they are already applied globally to all `<td>` elements in `ComparisonTable.jsx` row rendering and must not be duplicated.

## Dependencies

none

## Validation criteria

- [ ] The `freehubOptions` entry in `wheelProperties.jsx` has `max-w-[160px]` in `cellClassName`.
- [ ] No other entries in `WHEEL_PROPERTIES` have been modified.
- [ ] With a wheel that has many freehub options (3+), the column does not grow beyond 160 px in the rendered table.
- [ ] The truncation ellipsis is visible on overflowing cells.
- [ ] With a wheel that has a short freehub value (e.g. one option), the column renders narrower than 160 px (natural width).

## Tests to implement

### Unit
- None required (PRD section 10).

### Integration
- None required.
