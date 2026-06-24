# Implementation Notes — EVO-006

## TASK-001 — Replace legacy color tokens in HookBadge

**File modified:** `frontend/src/components/MiniComparator/badges.jsx`

### Design decisions

- Mapped `brand-50` (light tint) → `brass-3` (#f3ead8): lightest usable brass token; warm, elevated background that reads as distinct from neutral ink surfaces.
- Mapped `brand-700` (saturated mid-dark) → `brass-10` (#6b5328): high-contrast brass text tone; legible at `text-xs`.
- Mapped `ink-100` → `ink-2` (#e4e2d6): minimal neutral background; sufficient contrast against card/paper surfaces to define the pill shape.
- Mapped `ink-700` → `ink-8` (#555550): mid-dark neutral; readable at `text-xs` without adding visual weight.

### Deviations

None. Every class and constraint in the specification was applied exactly.

### Tradeoffs

None material. The numbered Tailwind token scale (`-2`, `-3`, `-8`, `-10`) is a direct replacement for the legacy three-digit scale (`-50`, `-100`, `-700`); no contrast or visual hierarchy is lost.

### Open questions

If the design system defines exact contrast ratios, a WCAG AA check for `brass-10 on brass-3` and `ink-8 on ink-2` would confirm accessibility compliance.

### Bug fixes

None — pure token migration with no logic changes.
