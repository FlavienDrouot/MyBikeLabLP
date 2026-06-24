# TASK-003 — Add DS-compliant hover transition to ColumnSelector button

## Objective

Replace the `transition-colors` Tailwind class on the ColumnSelector button with an inline `style` prop that uses the design system motion variables (`--duration-quick`, `--ease-standard`), making the hover transition consistent with all other interactive buttons in the design system.

## Required context

### Current state

File: `frontend/src/components/MiniComparator/ColumnSelector.jsx`

The ColumnSelector trigger button (lines 27–34):
```jsx
<button
  type="button"
  onClick={() => setOpen((v) => !v)}
  className="inline-flex items-center gap-2 rounded-xs border border-ink-4 bg-paper-0 px-3 py-2 text-sm font-medium text-ink-11 hover:bg-ink-2/60 transition-colors"
  aria-haspopup="true"
  aria-expanded={open}
>
```

The `transition-colors` class resolves to:
```css
transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);  /* Tailwind default ease */
transition-duration: 150ms;
```

### Design system standard

All buttons in `frontend/src/index.css` (`.btn-primary`, `.btn-ghost`, `.btn-outline`) use this inline style:
```css
transition: color var(--duration-quick) var(--ease-standard),
            background-color var(--duration-quick) var(--ease-standard),
            border-color var(--duration-quick) var(--ease-standard);
```

Where:
- `--duration-quick` = 140ms
- `--ease-standard` = cubic-bezier(0.2, 0.0, 0.0, 1.0)

### Required change

1. Remove `transition-colors` from the button's `className`.
2. Add a `style` prop to the button with the DS-standard transition value.

The button after the change:
```jsx
<button
  type="button"
  onClick={() => setOpen((v) => !v)}
  className="inline-flex items-center gap-2 rounded-xs border border-ink-4 bg-paper-0 px-3 py-2 text-sm font-medium text-ink-11 hover:bg-ink-2/60"
  style={{ transition: 'color var(--duration-quick) var(--ease-standard), background-color var(--duration-quick) var(--ease-standard), border-color var(--duration-quick) var(--ease-standard)' }}
  aria-haspopup="true"
  aria-expanded={open}
>
```

No other change is made to the button or the component.

## Potentially impacted files

- `frontend/src/components/MiniComparator/ColumnSelector.jsx` — one change to the trigger button element

## Inputs

- `frontend/src/components/MiniComparator/ColumnSelector.jsx` (current source — read before acting)
- `frontend/src/index.css` (reference for the DS-standard transition style)

## Expected outputs

- `ColumnSelector.jsx` modified: `transition-colors` removed from button className; `style` prop added with the DS-standard transition.

## Constraints

- Only modify the trigger button. Do not touch the dropdown panel, the close logic, or any other element.
- Do not apply a different class (e.g., `btn-outline`) to the button; its padding dimensions (`px-3 py-2`) differ from `btn-outline` (`px-5 py-2.5`).
- The `hover:bg-ink-2/60` class must remain in the className — it defines the hover background color target; the `style` prop only governs the transition animation.

## Dependencies

none

## Validation criteria

- [ ] `ColumnSelector.jsx` no longer contains `transition-colors` on the trigger button
- [ ] The trigger button has a `style` prop with `transition` referencing `var(--duration-quick)` and `var(--ease-standard)`
- [ ] Manual hover: moving the pointer onto the ColumnSelector button produces a visible, smooth background-color transition that matches the hover transitions on `btn-primary`, `btn-ghost`, and `btn-outline` buttons
- [ ] The ColumnSelector dropdown continues to open and close correctly
- [ ] `npm run build` and `npm run test` pass without errors

## Tests to implement

### Unit

- None. CSS transition behavior cannot be verified in a Vitest node environment. AC-003 is marked as Manual-only in the PRD.

### Integration

- Manual: open `npm run dev`, hover the ColumnSelector button in the MiniComparator section, confirm a smooth background-color transition occurs.
