# TASK-004 — Migrate ColumnSelector.jsx to design system tokens

## Objective

Correct the token values in `ColumnSelector.jsx` for the popover and its trigger button. The popover border must use `ink-10` (currently `ink-4`); the `shadow-menu` shadow must be verified as already applied; the group-name labels inside the popover must use `.t-label` typography. No change to state logic, positioning logic, open/close behavior, or keyboard handling.

## Required context

**File location:** `frontend/src/components/MiniComparator/ColumnSelector.jsx`

**Current trigger button (correct):**
```jsx
className="inline-flex items-center gap-2 rounded-xs border border-ink-4 bg-paper-0 px-3 py-2 text-sm font-medium text-ink-11 hover:border-brass-8 hover:text-brass-8"
```
This matches the design system `cbtn` definition (`border: 1px solid var(--ink-4)`, `background: var(--paper-0)`, `border-radius: 2px`). No change needed to the trigger button token values.

**Current popover (partially incorrect):**
```jsx
className="fixed z-50 max-h-[80vh] overflow-y-auto rounded-none border border-ink-4 bg-paper-0 shadow-menu p-3 flex flex-col gap-3 sm:flex-row sm:gap-4"
```
Problem: `border-ink-4` must be `border-ink-10`.

**Current popover group-name label (partially incorrect):**
```jsx
<div className="text-xs font-semibold uppercase tracking-widest text-ink-7 mb-1.5">
```
Problem: should be `text-[10px] font-bold uppercase tracking-[0.18em] text-ink-7` to match `.t-label` exactly (10px font-size, 700 weight).

**Design system reference** (`comparator.css`, `.popover`):
```css
.popover {
  background: var(--paper-0);
  border: 1px solid var(--ink-10);
  box-shadow: 0 1px 0 0 var(--ink-10), 0 8px 24px -12px rgba(14, 15, 12, 0.18);
}
.popover .group-name {
  font-size: 10px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.18em; color: var(--ink-7);
}
```

The `shadow-menu` Tailwind utility (configured in `tailwind.config.js` after EVO-039) should resolve to `0 1px 0 0 var(--ink-10), 0 8px 24px -12px rgba(14, 15, 12, 0.18)`. Verify this is correct; if `shadow-menu` is already configured, it is used as-is. If not, use an inline style (see Constraints).

**PRD reference:** FR-013, AC-005

## Potentially impacted files

- `frontend/src/components/MiniComparator/ColumnSelector.jsx` — two targeted edits

## Inputs

- `frontend/src/components/MiniComparator/ColumnSelector.jsx` (read before editing)
- `design-system/ui_kits/comparator/comparator.css` — `.popover` and `.group-name` rules
- `design-system/colors_and_type.css` — `.t-label` definition

## Expected outputs

### Popover border correction

Replace `border border-ink-4` with `border border-ink-10` in the popover `<div>`:
```jsx
className="fixed z-50 max-h-[80vh] overflow-y-auto rounded-none border border-ink-10 bg-paper-0 shadow-menu p-3 flex flex-col gap-3 sm:flex-row sm:gap-4"
```

### Popover group-name label correction

Replace:
```jsx
<div className="text-xs font-semibold uppercase tracking-widest text-ink-7 mb-1.5">
```
With:
```jsx
<div className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-7 mb-1.5">
```

### shadow-menu verification

Confirm that `shadow-menu` in `tailwind.config.js` resolves to:
```
0 1px 0 0 var(--ink-10), 0 8px 24px -12px rgba(14, 15, 12, 0.18)
```
If `shadow-menu` is not defined in `tailwind.config.js`, add the shadow as an inline style on the popover:
```jsx
style={{
  ...popupStyle,
  boxShadow: '0 1px 0 0 var(--ink-10), 0 8px 24px -12px rgba(14,15,12,0.18)'
}}
```
Note: the `popupStyle` object (top/right positioning) must remain in the `style` prop. Do not remove it.

## Constraints

- `popupStyle` inline style (top/right dynamic positioning) is untouched
- Open/close state, `useEffect` event listener cleanup, `buttonRef`, `popupRef`, `computePosition()` logic — all untouched
- Trigger button classes are untouched (already token-correct)
- The `rounded-none` on the popover is correct (square corners per design system) — do not change it
- `accent-brass-7` on the checkbox `<input>` inside the popover is acceptable (system-accent color for checkboxes)
- No hardcoded hex values in the JSX

## Dependencies

none

## Validation criteria

- [ ] Popover border resolves to `1px solid --ink-10` (not `--ink-4`) (FR-013)
- [ ] Popover shadow matches `shadow-menu`: `0 1px 0 0 ink-10, 0 8px 24px -12px rgba(14,15,12,0.18)` (AC-005)
- [ ] Trigger button uses `paper-0` background, `ink-4` border, `radius-xs` (FR-013)
- [ ] Group-name labels inside the popover render 10px, 700 weight, all-caps, 0.18em tracking
- [ ] No hardcoded hex values in `ColumnSelector.jsx`

## Tests to implement

### Unit
- Static scan: `grep -n '#[0-9a-fA-F]' ColumnSelector.jsx` returns zero matches (excluding any rgba values — the `rgba(14,15,12,0.18)` in a shadow-menu inline style fallback is acceptable if shadow-menu is not configured)

### Integration
- Open the column picker; inspect computed `box-shadow` on the popover: must be `0 1px 0 0 <ink-10-resolved-value>, 0 8px 24px -12px rgba(14,15,12,0.18)` (AC-005)
- Inspect popover `border-color`: resolves to `--ink-10`
- Inspect trigger button `border-color`: resolves to `--ink-4`
