# TASK-005 — Integrate `FreehubCell` into `ComparisonTable`

## Objective

Modify `ComparisonTable.jsx` to render `FreehubCell` for the `freehubOptions` column instead of the generic `renderCellFor` / `cellClassFor` path. All other columns continue to use the existing rendering path unchanged.

## Required context

### Current rendering loop (ComparisonTable.jsx, lines 145-148)

```jsx
{cols.map((p) => (
  <td key={p.id} className={`${cellClassFor(p)} whitespace-nowrap overflow-hidden text-ellipsis`}>
    {renderCellFor(p, t)(w)}
  </td>
))}
```

This renders every visible column generically. The `freehubOptions` column currently uses the `renderCell` defined in `wheelProperties.jsx` (joins array with ' / '). After this task, the `freehubOptions` column uses `FreehubCell` instead.

### Strategy

Add a conditional branch inside the `cols.map` callback that detects `p.id === 'freehubOptions'` and renders `FreehubCell`:

```jsx
{cols.map((p) => {
  if (p.id === 'freehubOptions') {
    return (
      <td key={p.id} className={`${cellClassFor(p)} whitespace-nowrap overflow-hidden text-ellipsis`}>
        <FreehubCell wheel={w} t={t} />
      </td>
    );
  }
  return (
    <td key={p.id} className={`${cellClassFor(p)} whitespace-nowrap overflow-hidden text-ellipsis`}>
      {renderCellFor(p, t)(w)}
    </td>
  );
})}
```

### Why `cellClassFor(p)` is still applied to the `<td>`

`cellClassFor` returns the `cellClassName` from the registry (which now includes `max-w-[160px]` after TASK-002) plus `font-mono tabular-nums` if the property has a `unit`. Keeping `cellClassFor(p)` on the `<td>` ensures the max-width class is applied at the table cell level, which is required for the truncation and `MeasuringTable` constraint to work correctly.

`FreehubCell` itself renders an inner `<div>` (see TASK-004). The `<td>` remains the width-constrained container; `FreehubCell` fills it.

### MeasuringTable

`MeasuringTable.jsx` also iterates `cols` and renders cells using `renderCellFor` / `cellClassFor`. After this evolution, `MeasuringTable` does NOT need to use `FreehubCell` — it only measures natural content widths and does not need interactive behavior. The `max-w-[160px]` class applied via `cellClassName` is sufficient for MeasuringTable to cap its measurement correctly.

Verify that `MeasuringTable` does not need any change. If it loops over `cols` in the same way, it already picks up `cellClassFor(p)` (including `max-w-[160px]`) without modification. No change to `MeasuringTable.jsx` is expected.

### Import to add

At the top of `ComparisonTable.jsx`, add:
```js
import FreehubCell from './FreehubCell';
```

## Potentially impacted files

- `MyBikeLab/frontend/src/components/MiniComparator/ComparisonTable.jsx` (conditional branch in cell render loop + import)
- `MyBikeLab/frontend/src/components/MiniComparator/MeasuringTable.jsx` (read to confirm no change needed)

## Inputs

- `FreehubCell` component (TASK-004).
- Existing `ComparisonTable.jsx` cell rendering loop.
- Existing `cellClassFor` utility from `columnCells.jsx`.

## Expected outputs

- `ComparisonTable.jsx` imports `FreehubCell` and uses it for `p.id === 'freehubOptions'` cells.
- All other column cells continue to use `renderCellFor`.
- `MeasuringTable.jsx` is confirmed unchanged (or minimally adjusted if an issue is discovered).
- The `renderCell` override in `wheelProperties.jsx` for `freehubOptions` can be removed in this task (it is now superseded by `FreehubCell`), OR left in place as a harmless fallback (it will no longer be called for the visible table). Prefer removing it to avoid dead code; document the decision.

## Constraints

### Table layout

- The `<td>` continues to carry `whitespace-nowrap overflow-hidden text-ellipsis` — these classes are needed for the `scrollWidth > clientWidth` detection in `FreehubCell` to work correctly (the inner `<span>` in `FreehubCell` also has these, but the `<td>` constraint ensures the cell does not widen the column).
- The `<td>` has `position: static` by default. `FreehubCell` uses `relative` on its inner `<div>` to position the popup. No CSS change to the `<td>` is needed.
- The popup from `FreehubCell` uses `absolute` positioning and `z-20`. The table header uses `z-10`. Confirm visually that the popup renders above the header when the first row's cell is clicked.

### Propagation

- The `<tr>` has `onClick={() => toggleExpanded(w.id)}`. `FreehubCell` stops propagation internally (TASK-004) when opening the popup. No change to the `<tr>` onClick is needed.
- For non-truncated freehub cells, `FreehubCell` does not stop propagation, so the row expand works normally.

### UI guidelines applicable to this task

This task does not introduce new visual surfaces — it wires an existing component into the table. No new UI states need to be specified here beyond what is already in TASK-004 (FreehubCell) and TASK-003 (FreehubPopup).

Confirm that after integration:
- The popup does not cause the table to reflow horizontally.
- The popup does not cause the comparator card to grow in height (absolute positioning handles this).
- On mobile viewport, the popup stays within the horizontal scroll container (use `overflow-x-auto` context of `.comparison-table-scroll`).

### Dead code

If the `renderCell` function in `wheelProperties.jsx` for `freehubOptions` is removed in this task, add a comment explaining why (superseded by `FreehubCell`). Do not remove any other part of the `freehubOptions` column spec.

## Dependencies

TASK-004

## Validation criteria

- [ ] `ComparisonTable.jsx` imports `FreehubCell`.
- [ ] The `freehubOptions` column cells are rendered via `FreehubCell`, not via `renderCellFor`.
- [ ] All other columns continue to use `renderCellFor` unchanged.
- [ ] `MeasuringTable.jsx` does not require changes (confirmed by reading the file).
- [ ] The complete UC-001, UC-002, and UC-003 use cases from the PRD pass manual verification.
- [ ] Clicking a non-freehub cell still expands WheelDetailPanel correctly.
- [ ] The popup appears above the sticky header visually.
- [ ] No horizontal reflow in the table when the popup opens.
- [ ] AC-001 through AC-007 from the PRD pass (cross-check with TASK-001 for label, TASK-002 for width, TASK-003/004 for popup behavior).

## Tests to implement

### Unit
- None required (PRD section 10).

### Integration
- None required.
