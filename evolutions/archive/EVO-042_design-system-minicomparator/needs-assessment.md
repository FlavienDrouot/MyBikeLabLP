# Needs Assessment

## 1. General Information

- Evolution ID: EVO-042
- Title: Design system — MiniComparator
- Author: Flavien Drouot
- Date: 2026-06-03
- Status: Draft
- Priority: High

---

## 2. Context

### Current situation

The MiniComparator surface — the product's core interactive feature — is implemented across several components (FilterPanel, ComparisonTable, ColumnSelector, badges, FilterChips, wrapper) using legacy CSS that predates the design system. Styling is ad hoc: colours, typography, spacing, and surface tokens are not derived from the canonical token set defined in EVO-039.

### Identified problem

Visual inconsistency between the MiniComparator and the rest of the product (Navbar, Footer, landing sections already migrated). The comparator surface does not express the lab-instrument aesthetic — warm paper surfaces, hairline rules, tabular numerals, brass accents — defined in the design system.

### Business motivation

The comparator is the primary user-facing feature and the main argument for brand partnerships. A polished, design-system-compliant comparator strengthens the credibility of the product in partner outreach and positions the site as a premium tool rather than a prototype.

---

## 3. Business Objective

Migrate the MiniComparator surface to the design system so that it is visually coherent with the rest of the product and matches the reference UI kit defined in `design-system/ui_kits/comparator/`.

This is a style-only migration. No functional behaviour, data, or Redux state is changed.

---

## 4. Scope

### Included

- `FilterPanel.jsx` + `FilterPanel.module.css` — filter panel card, axis headers, range sliders, multi-select chips, tri-state toggle
- `ComparisonTable.jsx` — table header (recessed), row dividers, numeric cells, row hover, sort indicator
- `ColumnSelector.jsx` — floating column picker popover and its trigger button
- `badges.jsx` — hookless status pill badges
- `FilterChips.jsx` — active filter row (removable brass-tinted chips displayed above the table when filters are applied)
- `MiniComparator.jsx` — wrapper layout and viewport-bounded height constraint

### Excluded

- Redux state, filter logic, sort logic, column visibility logic — untouched
- Data layer (`wheelsData.js`, selectors) — untouched
- i18n translation keys — untouched (existing FR/EN keys are used as-is)
- Any component outside the MiniComparator surface

---

## 5. Constraints

### Business constraints

- Style-only migration: no change to user-facing behaviour, filtering, sorting, or column visibility

### Known technical constraints

- Prerequisite: EVO-039 (foundation tokens) — already completed
- The design system UI kit (`design-system/ui_kits/comparator/`) is the authoritative migration target
- Token corrections confirmed against the UI kit during Needs Assessment (see Assumptions)

### Regulatory / security constraints

- None

---

## 6. Use Cases

### Nominal case

As a cyclist using the wheel comparator,
I want the interface to feel polished and consistent with the rest of the site,
So that I trust the data and the product.

### Alternative cases

- User applies filters: active chips appear in the filter row with brass-tinted styling
- User hovers a table row: row receives brass-1 tint only, no text colour change
- User sorts a column: sorted column header and indicator use brass-8
- User opens the column picker: floating popover uses shadow-menu elevation

### Known error cases

- No wheels match active filters: empty state is displayed (existing behaviour, no style change required beyond token compliance)

---

## 7. Acceptance Criteria

- [ ] All numeric data cells render in JetBrains Mono with `tabular-nums` (`font-variant-numeric`)
- [ ] Selected filter chips (multi-select) use `ink-12` fill with `paper-1` text — no brass on chip selection state
- [ ] Active filter chips (removable row above table) use `brass-3` fill, `brass-6` border, `brass-11` text
- [ ] Range slider thumb uses `paper-0` fill and `ink-11` border; focus ring is `brass-8` via the global `:focus-visible` token
- [ ] Column selector popover uses `shadow-menu` shadow — not a card shadow
- [ ] Table row hover applies `brass-1` background tint only — no text colour shift on hover
- [ ] Sorted column indicator uses `brass-8`
- [ ] Hookless badges are pill-shaped (`border-radius: 999px`) — `radius-pill` token — and styled with `brass-2` fill, `brass-6` border, `brass-10` text
- [ ] Column headers use `.t-label` typography token (all-caps, 0.18em tracking) — not badge styling
- [ ] Filter panel card uses `paper-0` surface with `ink-4` hairline border
- [ ] Table header row uses `paper-1` surface with `ink-10` bottom border (recessed via `bg-recessed`)
- [ ] No legacy blue or brand colour classes remain in any migrated file
- [ ] Redux state wiring (filters, sort, column visibility) is untouched
- [ ] Renders correctly in both FR and EN locales

---

## 8. Open Questions

- None remaining.

---

## 9. Assumptions

- EVO-039 foundation tokens are available and stable in the production codebase.
- The `design-system/ui_kits/comparator/` files are stable and complete as of 2026-06-03.
- Token corrections applied during Needs Assessment (vs. init.md):
  - Selected filter chips → `ink-12` fill (init.md incorrectly stated `brass-1` in scope and `brass-8` in criteria)
  - Range slider thumb → `paper-0` + `ink-11` border (init.md incorrectly stated `brass-8` thumb)
  - `FilterChips.jsx` added to scope (omitted from init.md)
  - "No decorative colored status dots" note removed — no such elements exist in the current codebase
