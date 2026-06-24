# Implementation Notes — EVO-020

## TASK-001 — Landing.jsx viewport fix

**Change:** `min-h-screen` → `min-h-[100dvh]` on line 11 of `Landing.jsx`.

**Validation:** Both automated criteria passed. Three criteria (desktop render, iOS Safari address bar, 320 px viewport) require manual browser/device check — no logic was altered, purely a CSS class swap.

---

## TASK-002 — tailwind.config.js opacity-40

**Change:** Added `'40': '0.4'` to `theme.extend.opacity` alongside the existing `'88': '0.88'` entry.

**Validation:** All criteria passed. `npm run build` exited with code 0. Generated CSS contains `.opacity-40` selector and `opacity:.4` declaration confirming JIT emission.

---

## TASK-003 — FilterPanel disabled-state opacity-50 → opacity-40

**Change:** Four substitutions in `FilterPanel.jsx`:
- Line 96 — `DualRangeRow` wrapper: `opacity-50` → `opacity-40` (no `pointer-events-none`)
- Line 271 — `LargeMultiSelectFilter` wrapper: `opacity-50 pointer-events-none` → `opacity-40 pointer-events-none`
- Line 353 — `MultiSelectFilter` wrapper: `opacity-50 pointer-events-none` → `opacity-40 pointer-events-none`
- Line 397 — `TriStateFilter` wrapper: `opacity-50 pointer-events-none` → `opacity-40 pointer-events-none`

**Note:** A pre-existing `opacity-40` on line 193 (`Pill` component `muted` prop) was untouched — it is unrelated to disabled states and was already present before this task.

**Validation:** All criteria passed. `opacity-50` absent from file; `opacity-40` present in exactly four disabled-state conditionals; `pointer-events-none` preserved on three locations and absent on the fourth.

---

## TASK-004 — FilterPanel multiselect option list radius/border fix

**Change:** Line 294 of `FilterPanel.jsx`: `rounded-lg border border-ink-3` → `rounded-none border border-ink-4`.

**Note:** A remaining `border-ink-3` on line 163 is a structural separator `<div>` (`border-t border-ink-3 pt-4`) — intentionally untouched; correct token for a separator, out of scope.

**Validation:** All criteria passed. `rounded-lg` absent from file; `rounded-none` and `border-ink-4` present on the `<ul>`; no other element modified.

---

## TASK-005 — index.css prefers-reduced-motion rule

**Change:** Appended a `@media (prefers-reduced-motion: reduce)` block at root level of `src/index.css`, after the last `@layer components` closing brace.

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

**Validation:** All criteria passed. Block is outside any `@layer` directive; targets `*`, `*::before`, `*::after`; uses `0.01ms` (not `0`) per the constraint. No existing rule modified.
