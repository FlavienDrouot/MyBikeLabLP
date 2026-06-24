# TASK-002 — Fix FilterPanel / ComparisonTable top-edge vertical alignment

## Objective

Within the MiniComparator section, align the top edge of the FilterPanel card with the top edge of the ComparisonTable so that the ColumnSelector button above the ComparisonTable does not introduce a vertical offset between the two sibling layout columns.

## Required context

### Current layout structure

File: `frontend/src/components/MiniComparator/MiniComparator.jsx`

The relevant grid and its children (simplified):

```jsx
<div className="mt-12 grid gap-6 lg:grid-cols-[320px_1fr] w-fit mx-auto">
  {/* Left column — FilterPanel */}
  <div id="filters-drawer" ...>
    <div className="px-4 py-4 lg:p-0">
      <FilterPanel />
    </div>
  </div>

  {/* Right column — ColumnSelector + ComparisonTable */}
  <div className="min-w-0">
    <div className="flex justify-end mb-3">
      <ColumnSelector visibility={visibility} onToggle={handleToggle} />
    </div>
    <ComparisonTable visibility={visibility} />
  </div>
</div>
```

The `div.flex.justify-end.mb-3` wrapping the ColumnSelector has `mb-3` (12px margin-bottom). The button itself has `py-2` (8px top + 8px bottom) with `text-sm` content (~20px at 1.25 line height) = approximately 36px button height. Total ColumnSelector row height: ~48px.

The grid has no `items-*` alignment class, so children default to `stretch`. The FilterPanel card starts at the grid cell top, which visually aligns with the ColumnSelector row top — not with the ComparisonTable top. This causes the FilterPanel's top edge to be visually aligned with the ColumnSelector button rather than with the ComparisonTable below it.

### Design system tokens

- `lg:pt-[Npx]` — Tailwind arbitrary value. `N` is the measured height of the ColumnSelector row.
- The FilterPanel is wrapped by `div.px-4.py-4.lg:p-0` inside the filter-drawer container. At `lg`, the padding is `p-0`, so adding `lg:pt-[Npx]` to this wrapper adds top padding only at large breakpoints.

### Fix mechanism

Two changes to `MiniComparator.jsx`:

1. Add `items-start` to the grid wrapper (`div.mt-12.grid.gap-6...`). This prevents the grid children from stretching to full grid height and makes each child start at the top of its grid area.

2. Add `lg:pt-[Npx]` to the FilterPanel wrapper (`div.px-4.py-4.lg:p-0`), where `N` is the measured pixel height of the ColumnSelector row. The implementation agent must:
   - Run `npm run dev` and open the page in a browser
   - Inspect the ColumnSelector row (`div.flex.justify-end.mb-3`) using browser DevTools
   - Read its `offsetHeight` (includes the button + the `mb-3` margin)
   - Use that exact pixel value for `N`

   A reasonable starting estimate is 48px (36px button + 12px mb-3), but the actual rendered value must be used.

### No changes to FilterPanel.jsx

The fix is entirely in `MiniComparator.jsx`. `FilterPanel.jsx` is not modified.

## Potentially impacted files

- `frontend/src/components/MiniComparator/MiniComparator.jsx` — two className changes (grid wrapper + FilterPanel wrapper div)

## Inputs

- `frontend/src/components/MiniComparator/MiniComparator.jsx` (current source — read before acting)
- Rendered page in `npm run dev` (measure ColumnSelector row height in DevTools)

## Expected outputs

- `MiniComparator.jsx` modified:
  - Grid wrapper div has `items-start` added to its className
  - FilterPanel wrapper div has `lg:pt-[Npx]` added to its className (with the exact measured value of N)

## Constraints

- Only modify `MiniComparator.jsx`. Do not touch `FilterPanel.jsx` or `ComparisonTable.jsx`.
- The fix must apply only at the `lg` breakpoint (the grid layout only applies at `lg`). Below `lg`, FilterPanel is off-canvas; alignment is not relevant.
- Do not change the `gap-6` between grid columns or any other grid property.
- Do not change the ColumnSelector row structure or its `mb-3`.
- Use only Tailwind classes or inline styles consistent with existing code style.

## Dependencies

none

## Validation criteria

- [ ] At viewport width ≥ 1024px (lg breakpoint), the top edge of the FilterPanel card is visually aligned with the top edge of the ComparisonTable card (within 1px tolerance)
- [ ] The ColumnSelector button remains positioned above the ComparisonTable, unchanged in appearance
- [ ] Below the lg breakpoint, no layout regression is introduced
- [ ] All filter, sort, and column-visibility interactions continue to work
- [ ] `npm run build` passes without errors
- [ ] `npm run test` passes without errors

## Tests to implement

### Unit

- None for this task. Pixel alignment cannot be asserted in a node-environment Vitest test. AC-002 is marked as Manual in the PRD.

### Integration

- Manual: open `npm run dev`, navigate to the MiniComparator section at lg+ viewport, confirm the top edges of FilterPanel and ComparisonTable are visually aligned.
