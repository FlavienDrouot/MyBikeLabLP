# TASK-003 — Migrate badges.jsx to design system tokens

## Objective

Correct the token values in `badges.jsx` for both `HookBadge` and `TubelessBadge`. The current implementation has the hookless/hooked colors inverted relative to the design system specification. No change to logic, props, i18n keys, or rendering conditions.

## Required context

**File location:** `frontend/src/components/MiniComparator/badges.jsx`

**Current implementation (incorrect):**
```jsx
export const HookBadge = ({ hookless }) => {
  // hookless=true → bg-ink-2 text-ink-8   (WRONG: should be brass-tinted)
  // hookless=false → bg-brass-3 text-brass-10  (WRONG: should be neutral/ink)
  className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
    hookless
      ? 'bg-ink-2 text-ink-8'
      : 'bg-brass-3 text-brass-10'
  }`}
```

**Design system target** (`comparator.css`, `.cmp-table .pill` and `.pill.hookless`):
```css
.cmp-table .pill {
  border: 1px solid var(--ink-4);
  color: var(--ink-9);
  /* no fill */
}
.cmp-table .pill.hookless {
  border-color: var(--brass-6);
  color: var(--brass-10);
  background: var(--brass-2);
}
```

PRD FR-012: hookless badges use `brass-2` fill, `brass-6` border, `brass-10` text, `border-radius: 999px` (pill). Hooked badges use `ink-4` border, `ink-9` text, no fill (transparent background / table cell background).

**Token mappings:**
- Hookless badge: `bg-brass-2 border border-brass-6 text-brass-10`
- Hooked badge: `bg-transparent border border-ink-4 text-ink-9`
- Both: `inline-flex px-2 py-0.5 rounded-full text-xs font-medium` (pill shape preserved)

## Potentially impacted files

- `frontend/src/components/MiniComparator/badges.jsx` — targeted edits to both badge components

## Inputs

- `frontend/src/components/MiniComparator/badges.jsx` (read before editing)
- `design-system/ui_kits/comparator/comparator.css` — `.cmp-table .pill` and `.pill.hookless` rules

## Expected outputs

### HookBadge

Replace:
```jsx
className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
  hookless
    ? 'bg-ink-2 text-ink-8'
    : 'bg-brass-3 text-brass-10'
}`}
```
With:
```jsx
className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${
  hookless
    ? 'bg-brass-2 border-brass-6 text-brass-10'
    : 'bg-transparent border-ink-4 text-ink-9'
}`}
```

### TubelessBadge

Apply the same pattern. Tubeless=true (positive/premium feature) maps to brass-tinted; tubeless=false (clincher) maps to neutral ink:
```jsx
className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${
  tubeless
    ? 'bg-brass-2 border-brass-6 text-brass-10'
    : 'bg-transparent border-ink-4 text-ink-9'
}`}
```

The `null` check guard (`if (tubeless == null)`) and its `text-ink-7 text-xs` fallback span are untouched.

## Constraints

- `useTranslation` hook, `t('badges.hookless')`, `t('badges.hooked')`, `t('badges.tubeless')`, `t('badges.clincher')`, `t('common.notAvailable')` — all i18n keys untouched
- `rounded-full` shape (pill, `border-radius: 999px`) is preserved on both states — do not use `rounded-xs`
- No inline `style` attributes
- No hardcoded hex values

## Dependencies

none

## Validation criteria

- [ ] Hookless badge renders with `brass-2` fill, `brass-6` border, `brass-10` text (AC-008)
- [ ] Hooked badge renders with no fill, `ink-4` border, `ink-9` text
- [ ] Both badges are pill-shaped (`border-radius: 999px`) (AC-008)
- [ ] `TubelessBadge` null guard renders existing `text-ink-7` fallback unchanged
- [ ] No hardcoded hex values in `badges.jsx`

## Tests to implement

### Unit
- Static scan: `grep -n '#[0-9a-fA-F]' badges.jsx` returns zero matches

### Integration
- Inspect a `.pill.hookless` element in the running table: `border-radius` is `999px`; background resolves to `--brass-2`; border resolves to `--brass-6`; color resolves to `--brass-10` (AC-008)
- Inspect a hooked `.pill` element: no background fill; border resolves to `--ink-4`; color resolves to `--ink-9`
