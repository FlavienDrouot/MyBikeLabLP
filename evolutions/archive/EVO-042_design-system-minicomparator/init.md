# EVO-042 — Design system: MiniComparator

## Objective

Migrate the MiniComparator surface — the product's core feature — to the design system. This is the most complex migration: it covers the filter panel, comparison table, column selector, and badges.

## Prerequisite

EVO-039 (foundation tokens) must be complete.

## Scope

- `frontend/src/components/MiniComparator/FilterPanel.jsx` + `FilterPanel.module.css` — hairline card wells, `.t-label` axis headers (all-caps, 0.18em tracking), range sliders with brass-8 thumb, multiSelect chips (paper-2 fill, ink-10 border, brass-1 selected)
- `frontend/src/components/MiniComparator/ComparisonTable.jsx` — `bg-recessed` (paper-2) header row, hairline `rule-default` row dividers, `.t-numeric` (JetBrains Mono, tabular-nums) for all data cells, brass-1 row hover, `ink-10` sort indicator
- `frontend/src/components/MiniComparator/ColumnSelector.jsx` — floating menu (`shadow-menu`), paper-0 background, checkboxes with brass-8 focus ring
- `frontend/src/components/MiniComparator/badges.jsx` — pill badges (`radius-pill: 999px`) only for semantic status; `.t-label` token for badge text
- `frontend/src/components/MiniComparator/MiniComparator.jsx` — wrapper layout, viewport-bounded height, no decorative colored status dots

## Key references

| File | Role |
|---|---|
| `design-system/ui_kits/comparator/` | Full comparator recreation — reference for all sub-components |
| `design-system/ui_kits/comparator/comparator.css` | Companion styles |
| `design-system/ui_kits/comparator/FilterPanel.jsx` | Filter panel target |
| `design-system/ui_kits/comparator/WheelTable.jsx` | Table target |
| `design-system/ui_kits/comparator/ColumnPicker.jsx` | Column selector target |
| `design-system/ui_kits/comparator/FilterChips.jsx` + `FilterPrimitives.jsx` | Chip and input primitives |
| `design-system/README.md` — "States" | Hover, focus, disabled states |
| `design-system/README.md` — "Elevation" | `shadow-menu` rule for floating menus |

## Acceptance criteria

- All numeric data cells render in JetBrains Mono with `tabular-nums`
- Filter chips and range sliders use brass-8 for active/selected state
- Column selector uses `shadow-menu` (not a card shadow)
- Row hover is `brass-1` tint only — no background color shift on text
- Badges are pill-shaped only for semantic state; column headers use `.t-label` (not badges)
- No legacy blue/brand classes remain
- Redux state wiring (filters, sort, column visibility) is untouched — style-only migration
- Passes i18n (FR/EN)
