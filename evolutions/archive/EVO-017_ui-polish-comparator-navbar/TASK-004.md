# TASK-004 — Add bottom separator border to WheelDetailPanel drawer

## Objective

Add a visible visual separator at the bottom boundary of the WheelDetailPanel drawer using an existing design system border token, so that when a wheel detail drawer is open, the boundary between the drawer's bottom edge and the next wheel card below it is clearly delimited.

## Required context

### Current state

File: `frontend/src/components/MiniComparator/WheelDetailPanel.jsx`

The outer div (line 12):
```jsx
<div className="flex items-center gap-5 px-5 py-3 bg-paper-2/60 border-t border-ink-3">
```

The panel currently has `border-t border-ink-3` — a top separator between the wheel card row and the drawer. There is no `border-b` on this div. The next wheel card's table row has `borderBottom: '1px solid var(--rule-faint)'` (set via inline style in `ComparisonTable.jsx`), which creates a faint line after each row. This existing row border is insufficient as a clear separator because:
- Its color (`--rule-faint` = `--ink-3` = `#d6d4c7`) is very faint.
- Visually, the boundary between the end of the drawer content and the next row is ambiguous because the drawer background (`bg-paper-2/60`) blends into the table.

### Required change

Add `border-b border-ink-4` to the outer `<div>` of `WheelDetailPanel.jsx`:

```jsx
<div className="flex items-center gap-5 px-5 py-3 bg-paper-2/60 border-t border-ink-3 border-b border-ink-4">
```

`border-ink-4` corresponds to `--ink-4` = `#c2c0b3` = `--border-default` = `--rule-default`. This is the standard divider token used throughout the design system (e.g., table header borders, card borders in `.card`).

### Design system token used

- `border-b` — CSS `border-bottom-width: 1px`
- `border-ink-4` — CSS `border-color: var(--ink-4)` (`#c2c0b3`, the default divider)

No new token is introduced. `border-ink-4` is already used in the same file area (`border-ink-3` is used for the top border; `border-ink-4` is one step stronger, matching the `.card` border definition in `index.css`).

### Behavior for the last wheel in the list

The separator renders unconditionally on all expanded drawers, including the last wheel. For the last wheel, the `.card` wrapper's own border provides the outer container boundary. The additional `border-b` on the WheelDetailPanel is harmless — it sits inside the card's border and adds visual structure. The PRD states that no separator is "required" for the last wheel, which is a permissive statement. Rendering it consistently is acceptable.

## Potentially impacted files

- `frontend/src/components/MiniComparator/WheelDetailPanel.jsx` — one className addition to the outer div

## Inputs

- `frontend/src/components/MiniComparator/WheelDetailPanel.jsx` (current source — read before acting)
- `frontend/src/design-tokens.css` (reference for token values, if needed)

## Expected outputs

- `WheelDetailPanel.jsx` modified: `border-b border-ink-4` added to the outer div className.

## Constraints

- Only modify the outer `<div>` className. Do not change the layout, content, or any other element in the component.
- Use `border-ink-4`, not `border-ink-3` (which is used for the top border and is a step lighter). The bottom separator should be at least as strong as a standard divider.
- Do not add margin or padding to create the visual separation — use a border only.

## Dependencies

none

## Validation criteria

- [ ] `WheelDetailPanel.jsx` outer div has `border-b border-ink-4` in its className
- [ ] When a non-last wheel's drawer is open, a visible horizontal line is rendered at the bottom of the drawer, between the drawer content and the next wheel card
- [ ] The separator uses `border-ink-4` (verifiable via browser DevTools computed styles)
- [ ] Drawer content (image, affiliate links) is unaffected
- [ ] Expanding the last wheel's drawer shows the border-b without visual defect
- [ ] `npm run build` and `npm run test` pass without errors

## Tests to implement

### Unit

- None. Visual border presence cannot be asserted in a Vitest node environment without a DOM renderer. AC-004 is marked as Manual-only in the PRD.

### Integration

- Manual: open `npm run dev`, open the detail drawer for a wheel that is not last in the list, confirm a visible bottom separator is present at the drawer's bottom boundary before the next wheel card.
