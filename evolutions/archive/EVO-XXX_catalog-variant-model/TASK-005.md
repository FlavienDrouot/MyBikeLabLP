# TASK-005: ComparisonTable grouped rendering (collapse/expand + auto-expand)

## Objective

Render the comparator from `selectGroupedWheels` instead of the flat list: a multi-config
model shows as one collapsed representative row by default, expandable manually; when filters
prune siblings the group auto-expands to reveal only the survivors; single-configuration
models render exactly as today. Per-configuration rows keep their own weight, price and axis
values.

## Required context

- `ComparisonTable.jsx` currently maps `selectFilteredWheels` to `<tr>` rows, each toggling a
  `WheelDetailPanel`. Column set, widths (`MeasuringTable` on the full flat `allWheels`),
  sticky header, and the per-row detail-panel expansion already exist and must keep working.
- Switch the row source to `selectGroupedWheels` (TASK-004). Descriptors are either
  `{ kind: 'single', wheel }` or `{ kind: 'group', groupId, label, representative,
  configurations, siblingCount, survivingCount, autoExpanded }`.
- `MeasuringTable` must keep measuring the flat `allWheels` so column widths are stable
  regardless of grouping — do not feed it grouped data.
- Collapse/expand is local component state, keyed by `groupId`. Effective expansion =
  `autoExpanded || manuallyExpanded[groupId]`. When `autoExpanded` is true the group cannot be
  manually collapsed (a pruning filter is active). Reset manual state appropriately when the
  filtered result changes.
- The existing detail-panel expansion (`expandedId`) continues to work per configuration row
  (both representative and revealed sibling rows are real configuration rows).

### UI-guidelines constraints (embed — implementation agent does not read the guidelines file)

- **Expand/collapse animation**: asymmetric timing — expand ~220ms, collapse ~140ms.
  Entering/exiting uses `ease-out`; height/position morphs use `ease-in-out`. Never `ease-in`,
  no bounce, no spring. Prefer CSS transitions over keyframes (interruptible). Animate only
  `transform`/`opacity`; never animate `height`/`top`/`margin` directly. Respect
  `prefers-reduced-motion`: keep opacity/color, drop position/movement.
- **Hover affordance** on the group toggle: gate any position/transform/scale hover behind
  `@media (hover: hover) and (pointer: fine)`; color/opacity hovers are exempt.
- **Disabled / empty states**: the existing empty-state message (`table.emptyState`) must
  still show when no group/row survives. A group toggle that cannot collapse (auto-expanded)
  must not look interactively broken — render it disabled with `opacity: 0.4` +
  `cursor: not-allowed`, never `display: none`.
- **Corner radius**: reuse the table's existing radius system (`rounded-xs`); do not introduce
  a new radius for group rows. Use `border-t`/`divide-y` for row separation consistent with
  the current table; do not wrap groups in elevated cards.
- **No section-index labels** (`01/03`), no decorative status dots, em-dash banned in editorial
  strings — group counts (`"3 configurations"`) are non-prose UI and may use a count display.
- The group toggle is a real `<button>` with `aria-expanded` and an accessible label
  (provided in TASK-006).

## Potentially impacted files

- `frontend/src/components/MiniComparator/ComparisonTable.jsx`
- `frontend/src/components/MiniComparator/__tests__/ComparisonTable.test.jsx`
- `frontend/src/components/MiniComparator/__tests__/ComparisonTable.column-widths.test.jsx`
  (verify still green)
- possibly a small `GroupRow` subcomponent in the same folder.

## Inputs

- `selectGroupedWheels` output.
- Existing column/visibility/measurement machinery.

## Expected outputs

- Collapsed group: one representative row plus an expand affordance and a sibling count.
- Expanded group (manual or auto): the representative context plus each surviving sibling as
  its own configuration row with its own weight/price/axis values.
- Standalone descriptors: unchanged single rows.
- The result header count (`{shown} of {total}`) reflects a sensible unit; keep counting
  configurations (surviving) over total catalog configurations unless product says otherwise —
  document the choice in the test.

## Constraints

- Do not change `selectFilteredWheels`, the registry, or `MeasuringTable`'s flat input.
- Keep the per-row `WheelDetailPanel` expansion working for every configuration row.
- Auto-expanded groups are not manually collapsible while the pruning filter is active.
- Animations and states per the embedded UI-guidelines constraints above.

## Dependencies

TASK-003, TASK-004

## Validation criteria

- [ ] A multi-config model renders as one collapsed representative row by default.
- [ ] Manual expand reveals all siblings; manual collapse hides them again (when no pruning
      filter is active).
- [ ] A filter matching a subset of a group auto-expands it and shows only the matching
      siblings; a group with no match is absent.
- [ ] Single-configuration models render with no group affordance, identical to pre-EVO.
- [ ] Each shown configuration row displays that configuration's own weight and price.
- [ ] Column widths stay stable (width test green); empty state still shows when nothing
      survives.
- [ ] `npm run lint` clean; full Vitest suite green.

## Tests to implement

### Unit / component
- Collapsed-by-default rendering of a group; expand toggle reveals siblings; collapse hides
  them.
- Auto-expansion when a filter prunes siblings; auto-expanded toggle is non-collapsible
  (disabled styling).
- Standalone rows unchanged; per-configuration weight/price rendered on each row.
- Empty state when no descriptor survives.

### Integration
- Apply spoke-material = "Carbon" + a weight range; assert the affected group auto-expands to
  the carbon sibling only and a model whose only carbon config is out of range is absent
  (UC-001).
