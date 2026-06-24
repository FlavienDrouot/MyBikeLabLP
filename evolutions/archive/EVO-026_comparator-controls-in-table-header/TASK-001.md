# TASK-001 — Add action-button props to ComparisonTable and render header controls

## Objective

Extend `ComparisonTable` to accept the column-selector state and a filters-open callback as props, then render the "Filters" button (mobile only) and the `ColumnSelector` component (all viewports) on the right side of the existing header row.

## Required context

### File to modify

`frontend/src/components/MiniComparator/ComparisonTable.jsx`

### Current header row structure (lines 55–62)

```jsx
<div className="flex items-center justify-between px-5 py-4">
  <h3 className="text-base font-semibold text-ink-11">
    {t('table.heading')}{' '}
    <span className="text-ink-7 font-normal">
      — {wheels.length} {t('table.of')} {total}
    </span>
  </h3>
</div>
<hr className="rule" />
```

The `<div>` already uses `justify-between` but contains only the heading on the left and nothing on the right.

### ColumnSelector component

`frontend/src/components/MiniComparator/ColumnSelector.jsx`

Props: `visibility` (object, column-id → boolean) and `onToggle` (function, receives column id).

Self-contained popover — manages its own open/close state internally. No open/close prop needed from the parent.

The trigger button style currently used in `MiniComparator`:
```jsx
className="inline-flex items-center gap-2 rounded-xs border border-ink-4 bg-paper-0 px-3 py-2 text-sm font-medium text-ink-11 hover:border-brass-8 hover:text-brass-8"
style={{ transition: 'color var(--duration-quick) var(--ease-standard), background-color var(--duration-quick) var(--ease-standard), border-color var(--duration-quick) var(--ease-standard)' }}
```

### Filters trigger button style (from MiniComparator, mobile-only)

```jsx
className="inline-flex items-center gap-2 rounded-xs border border-ink-4 bg-paper-0 px-4 py-2 text-sm font-semibold text-ink-11 hover:border-brass-8 hover:text-brass-8"
```
Icon: `SlidersHorizontal` from `lucide-react`, size 16. Label: `{t('comparator.filtersButton')}`. Aria attributes: `aria-expanded={filtersOpen}` and `aria-controls="filters-drawer"`.

### Translation keys already in use

- `t('comparator.filtersButton')` — label for the Filters button
- `t('table.heading')` — "Wheels" (left part of heading)
- `t('table.of')` — "of"

### Design system tokens

- Tailwind breakpoint: `lg:` is ≥ 1024px (desktop). Below `lg:` is mobile.
- Hide on desktop: `lg:hidden`. Show only on desktop: `hidden lg:flex` (or `hidden lg:block`).
- Button gap: wrap both buttons in a `flex items-center gap-2` container on the right side.
- Transition pattern for buttons: `transition: color var(--duration-quick) var(--ease-standard), background-color var(--duration-quick) var(--ease-standard), border-color var(--duration-quick) var(--ease-standard)`

### UI constraints (from ui-guidelines.md)

- Button contrast: WCAG AA minimum (4.5:1 for body text). The existing button classes already satisfy this — do not alter colors.
- No animation on button entry/exit (these are not occasional/first-time interactions).
- Hover interactions involving color changes are exempt from the `(hover: hover) and (pointer: fine)` gate — only position/movement/transform/scale animations need gating.

## Potentially impacted files

- `frontend/src/components/MiniComparator/ComparisonTable.jsx` (primary change)

## Inputs

- `visibility`: `{ [columnId: string]: boolean }` — forwarded directly to `ColumnSelector`
- `columnOnToggle`: `(id: string) => void` — forwarded directly to `ColumnSelector`
- `onOpenFilters`: `() => void` — called when the mobile Filters button is clicked
- `filtersOpen`: `boolean` — used for `aria-expanded` on the Filters button

## Expected outputs

After this task:

1. `ComparisonTable` accepts four new props: `visibility`, `columnOnToggle`, `onOpenFilters`, `filtersOpen`.
2. The header `<div>` renders:
   - Left: the existing result count heading (unchanged).
   - Right: a `flex items-center gap-2` container containing:
     a. A Filters button (`lg:hidden`) — calls `onOpenFilters` on click, carries `aria-expanded={filtersOpen}` and `aria-controls="filters-drawer"`.
     b. `<ColumnSelector visibility={visibility} onToggle={columnOnToggle} />` (no visibility wrapper — rendered on all viewports).
3. `ColumnSelector` is imported in `ComparisonTable.jsx`.
4. `SlidersHorizontal` and `Icon` are imported in `ComparisonTable.jsx`.

## Constraints

- Do not move column visibility state into `ComparisonTable`. It receives `visibility` and `columnOnToggle` as props only.
- Do not change the result count heading text or its markup.
- Do not change the `ColumnSelector` component itself.
- Button labels and icon choices are identical to those currently in `MiniComparator`.
- The Filters button must have `aria-controls="filters-drawer"` — the drawer `id` is defined in `MiniComparator` and must not change.
- No new CSS files or CSS modules — use Tailwind utility classes.
- Button order in the right container: Filters button first (left), ColumnSelector button second (right). Filters is `lg:hidden` so it disappears on desktop; ColumnSelector remains visible on all viewports.

## Dependencies

none

## Validation criteria

- [ ] On desktop (≥ 1024px): header row shows result count on the left and only the "Columns" button on the right. "Filters" button is not visible.
- [ ] On mobile (< 1024px): header row shows result count on the left and both "Filters" and "Columns" buttons on the right, in that order (Filters left of Columns).
- [ ] Clicking/tapping "Columns" opens the `ColumnSelector` popover. Toggling a column updates the table.
- [ ] Clicking/tapping "Filters" (mobile) calls `onOpenFilters`. When `filtersOpen` is `true`, `aria-expanded="true"` is set on the button.
- [ ] Result count continues to update when filters change (no regression — `wheels` and `total` selectors are unchanged).
- [ ] No TypeScript/ESLint errors introduced.

## Tests to implement

### Unit
- None required for this evolution (PRD §10).

### Integration
- None required for this evolution (PRD §10).
