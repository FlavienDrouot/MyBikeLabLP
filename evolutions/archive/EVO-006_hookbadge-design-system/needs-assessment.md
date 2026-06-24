# Needs Assessment — EVO-006

## 1. General Information

- **Evolution ID:** EVO-006
- **Title:** Migrate HookBadge to the new design system
- **Author:** Flavien Drouot
- **Date:** 2026-05-26
- **Status:** Draft
- **Priority:** Low

---

## 2. Context

### Current situation

`badges.jsx` contains a single component, `HookBadge`, used in the comparison table to display a pill-shaped label indicating whether a wheel is hookless or hooked. The badge uses two conditional Tailwind class sets depending on the `hookless` boolean prop:

- Hookless: `bg-brand-50 text-brand-700`
- Hooked: `bg-ink-100 text-ink-700`

### Identified problem

Both class sets reference legacy tokens. `brand-50` and `brand-700` belong to the retired `brand-*` family (blue palette, explicitly marked RETIRED in `tailwind.config.js`). `ink-100` and `ink-700` belong to the old slate-based `ink-*` scale, which was fully replaced during EVO-003 — those steps no longer exist in the current token system.

`badges.jsx` was the only component in `MiniComparator/` not included in the EVO-003 migration scope. All other components (`FilterPanel`, `ComparisonTable`, `ColumnSelector`, `MiniComparator`, `WheelDetailPanel`) have been migrated. `HookBadge` is therefore the last remaining source of legacy tokens in the MiniComparator feature.

### Business motivation

The wheel comparator is the core interactive feature of MyBikeLab. The `HookBadge` is visible for every wheel in the comparator table whenever the Hookless column is displayed. Its use of retired tokens makes it the only component still rendering in the old blue/slate color palette, breaking the visual consistency established by EVO-003.

---

## 3. Business Objective

Replace the legacy `brand-*` and `ink-N00` tokens in `HookBadge` with valid tokens from the current design system, so that the badge renders consistently with the rest of the design.

---

## 4. Scope

### Included

- Replace the `bg-brand-50 text-brand-700` class set (hookless state) with current design system tokens
- Replace the `bg-ink-100 text-ink-700` class set (hooked state) with current design system tokens
- The structural and typographic classes (`inline-flex`, `px-2`, `py-0.5`, `rounded-full`, `text-xs`, `font-medium`) are not legacy and remain unchanged

### Excluded

- Changes to the `HookBadge` component interface (props, rendered text)
- Changes to any component that consumes `HookBadge`
- Any other component in `badges.jsx` (there is currently none)
- Changes to `design-system/` (read-only)

---

## 5. Constraints

### Business constraints

- The two badge states (Hookless / Hooked) must remain visually distinguishable from each other
- The Hookless state currently uses blue (brand color) to signal a notable or special attribute; the replacement must convey a similar level of distinction within the new palette

### Known technical constraints

- Only tokens defined in `tailwind.config.js` under `ink-*`, `paper-*`, `brass-*`, or `sage-*` may be used — no arbitrary values, no `brand-*`
- `design-system/` is read-only; only `frontend/` is modifiable

### Regulatory / security constraints

- None

---

## 6. Use Cases

### Nominal case

As a user browsing the wheel comparator,
I want the Hookless / Hooked badge to render in the current design system colors,
So that the comparator table looks visually coherent.

### Alternative cases

- Hookless = false: badge displays "Hooked" — must render with distinct styling from the Hookless state

### Known error cases

- None

---

## 7. Acceptance Criteria

- [ ] The `HookBadge` component contains no `brand-*` token
- [ ] The `HookBadge` component contains no `ink-N00` legacy token (i.e., `ink-100`, `ink-200`, `ink-700`, `ink-900`, etc.)
- [ ] All tokens used belong to the current palette (`ink-1` to `ink-12`, `paper-0` to `paper-3`, `brass-1` to `brass-12`, `sage-1` to `sage-12`)
- [ ] The Hookless state and the Hooked state are visually distinguishable when rendered side by side
- [ ] No change is made to the badge's text content, props, structural classes, or shape
- [ ] No other component file is modified

---

## 8. Open Questions

- None

---

## 9. Assumptions

- The `rounded-full` pill shape is intentional and retained (it is not a legacy class)
- Token selection (exact shades for each state) is a PRD/design decision, not a needs assessment decision
