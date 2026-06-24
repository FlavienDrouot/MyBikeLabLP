# TASK-004 — Add `renderCell` overrides for divergent display of dimensional specs and weight

## Objective

Add `renderCell` overrides in `wheelProperties.jsx` for depth, externalWidth, internalWidth, and weight so that:
- Dimensional specs (depth, externalWidth, internalWidth) display `{front} / {rear} mm` when divergent, or `{value} mm` when single.
- Weight displays `{total} g` as the primary value, with `{front} / {rear} g` as a secondary sub-line when a true pair (front ≠ rear) exists.

No changes to `ComparisonTable.jsx`, `columnCells.jsx`, or `MeasuringTable`. The rendering extension is entirely contained in `wheelProperties.jsx`.

## Required context

### How `renderCell` is called

In `columnCells.jsx`:
```js
export const renderCellFor = (property, t) => {
  if (property.column?.renderCell) {
    return (w) => property.column.renderCell(w, safeT);
  }
  // ... fallback
};
```

The `renderCell` function signature is `(w, t) => React node`. It receives the full wheel object and the `t` translation function.

In `ComparisonTable.jsx`, the cell is rendered inside:
```jsx
<td className={`${cellClassFor(p)} whitespace-nowrap overflow-hidden text-ellipsis`}>
  {renderCellFor(p, t)(w)}
</td>
```

Note: `whitespace-nowrap` is applied on the `<td>`. A multi-line weight cell (primary + sub-line) requires the sub-line to be a block element (`<div>` or `<span className="block">`), not inline — otherwise `whitespace-nowrap` collapses it to one line.

### `resolveSpec` utility (from TASK-001)

```js
import { resolveSpec } from '../data/wheelUtils';
// resolveSpec(value) → { front, rear, total, isSingle }
```

### Rendering rules per spec

**Dimensional specs (depth, externalWidth, internalWidth):**
```
isSingle → "{value} mm"           e.g. "45 mm"
!isSingle → "{front} / {rear} mm"  e.g. "50 / 60 mm"
null → t('common.notAvailable')
```
Format: both numbers are plain integers or decimals (no forced rounding). The unit suffix `mm` appears once, after the rear value. The separator is ` / ` (space-slash-space).

**Weight:**
```
isSingle, value not null → "{total} g"  e.g. "1570 g"
!isSingle → "{total} g" as primary + "{front} / {rear} g" as secondary sub-line
null → t('common.notAvailable')
```
- Primary value: `<span>` or plain text node with the total.
- Secondary sub-line: `<div className="text-xs text-ink-7 mt-0.5">{front} / {rear} g</div>`.
- The sub-line must be wrapped in a block container so it renders below the primary, not inline. Use a wrapping `<div>` for the whole cell content when a sub-line is present.
- Numbers are tabular: use `tabular-nums` class on both lines.

### Equal-pair edge case

`resolveSpec({ front: 60, rear: 60 })` returns `isSingle: true`. The dimensional cell renders `60 mm`, not `60 / 60 mm`. The weight cell renders `120 g` with no sub-line. This is correct and expected.

### UI guidelines applicable to this task

From `shared-knowledge/ui-guidelines.md`:

- **No `border-t` + `border-b` on every row of a long list or spec table** — not adding any borders in these cells.
- **Accessibility**: the secondary weight sub-line must remain readable; `text-xs text-ink-7` is acceptable if it passes 4.5:1 contrast on the table background. Verify contrast in context; if `text-ink-7` fails, use `text-ink-9`.
- **Animation**: these cells are data cells, not interactive elements. No animation is added.
- **Forbidden pattern — em-dash**: do not use `—` in cell content. The separator ` / ` is a forward slash, which is explicitly permitted in non-prose UI contexts (see ui-guidelines.md: "Not banned: non-prose UI contexts — range separators, table cell separators").

### MeasuringTable concern (OQ-001 from spec-notes)

`MeasuringTable` calls `renderCellFor` with the same property definitions. Since the weight `renderCell` now returns a two-element block (primary + sub-line), the measured column width will be based on the two-line content. This is correct: the visible table also renders the two-line block. No special handling is required, but the implementation agent should verify visually that the column width measurement does not produce an excessively wide weight column (the sub-line `{front} / {rear} g` is shorter than the total and should not drive the width).

## Potentially impacted files

- `frontend/src/config/wheelProperties.jsx` — add `renderCell` to `column` specs of depth, externalWidth, internalWidth, weight
- `frontend/src/data/wheelUtils.js` — imported (must exist from TASK-001)
- `frontend/src/config/__tests__/wheelProperties.renderCell.test.jsx` — new test file

## Inputs

- `wheelUtils.js` from TASK-001.
- Current `wheelProperties.jsx` after TASK-002 changes.
- `ui-guidelines.md` (constraints embedded above — implementation agent does not need to re-read it).

## Expected outputs

- `wheelProperties.jsx` with `renderCell` overrides on depth, externalWidth, internalWidth, weight column specs.
- Unit tests for each cell renderer variant.

## Constraints

- `renderCell` must handle `null` / `undefined` field values gracefully — return the `t('common.notAvailable')` string (not a React element) in that case, consistent with the rest of the table.
- The unit suffix (`mm` or `g`) appears once only. Never `50 mm / 60 mm`.
- The separator for dimensional specs is ` / ` (space, forward slash, space) — exactly as specified in FR-003.
- The weight sub-line uses the format `{front} / {rear} g` — same separator convention.
- No new CSS classes from outside the existing design system. Use only Tailwind utility classes already present elsewhere in the project (`text-xs`, `text-ink-7`, `mt-0.5`, `tabular-nums`, `block`).
- Do not change `cellClassFor` or `renderCellFor` in `columnCells.jsx`.
- Do not add any animation to these cells.

## Dependencies

TASK-002

## Validation criteria

- [ ] Depth cell with `{ front: 50, rear: 60 }` renders `50 / 60 mm`.
- [ ] Depth cell with `45` renders `45 mm`.
- [ ] Depth cell with `null` renders the not-available string.
- [ ] Depth cell with `{ front: 60, rear: 60 }` renders `60 mm` (equal pair collapses).
- [ ] externalWidth and internalWidth cells follow the same rules.
- [ ] Weight cell with `{ front: 720, rear: 850 }` renders `1570 g` as primary and `720 / 850 g` as secondary sub-line.
- [ ] Weight cell with `1492` renders `1492 g` with no sub-line.
- [ ] Weight cell with null renders the not-available string.
- [ ] Weight cell with `{ front: 760, rear: 760 }` (equal pair) renders `1520 g` with no sub-line.
- [ ] No unit duplication (`mm` or `g` appears exactly once per rendered cell).
- [ ] All tests pass.

## Tests to implement

### Unit

**wheelProperties.renderCell.test.jsx** (in `src/config/__tests__/`):

For each of depth, externalWidth, internalWidth:
- Scalar input → `"{value} mm"`.
- Divergent pair → `"{front} / {rear} mm"`.
- Equal pair → `"{value} mm"` (single value, no duplication).
- null input → `t('common.notAvailable')` (mock `t` as `(key) => key` in tests).

For weight:
- Scalar input → `"{total} g"` rendered, no sub-line element.
- Divergent pair → primary text `"{total} g"` and sub-line containing `"{front} / {rear} g"`.
- Equal pair → `"{total} g"` (total = front + rear), no sub-line.
- null → `t('common.notAvailable')`.

### Integration

None in this task — visual correctness verified in TASK-005 (smoke test with a real divergent entry).
