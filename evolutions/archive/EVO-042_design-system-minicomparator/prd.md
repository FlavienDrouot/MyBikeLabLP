# PRD — Product Requirements Document

## 1. General Information

- Evolution ID: EVO-042
- Title: Design system — MiniComparator
- Author: Flavien Drouot
- Date: 2026-06-03
- Version: 1.0
- Needs Assessment reference: `EVO-042_design-system-minicomparator/needs-assessment.md`

---

## 2. Functional Objective

After this evolution, the MiniComparator surface — the product's core interactive feature — must be visually indistinguishable from the reference UI kit defined in `design-system/ui_kits/comparator/`. Every surface token, typographic token, color token, and interaction state must be derived from the EVO-039 design system. No legacy styling (hardcoded hex values, pre-system class names, inline styles) may remain in any of the six migrated files.

User-facing behavior — filtering, sorting, column visibility, Redux state wiring — is unchanged.

---

## 3. Target Behavior

### General description

The MiniComparator renders as a two-column layout: a sticky filter panel on the left and a spec table on the right. The visual target is a precision lab-instrument aesthetic — warm paper surfaces, hairline rules, all-caps micro labels, JetBrains Mono numerals, brass accents used sparingly and only where specified.

All interactive states (hover, focus, active selection, sort indicator, empty state) follow the design system's state rules. Both FR and EN locales render correctly because i18n keys and the data layer are untouched.

---

## 4. Functional Rules

### FR-001 — Filter panel card styling

The filter panel (`FilterPanel.jsx`) uses `paper-0` as its background surface and a `1px solid ink-4` hairline border. It carries no shadow. Padding is 20px. The panel header is separated from filter groups by a `1px solid ink-10` bottom rule.

### FR-002 — Filter group axis labels

Each filter group axis label uses the `.t-label` typography token: all-caps, `0.18em` letter-spacing, `font-size: 10px`, `font-weight: 700`, `color: ink-9`. These labels are not styled as badges.

### FR-003 — Multi-select filter chips

Filter chips in multi-select groups (brand, rim material, hub brand, etc.) render with `paper-1` background and `ink-4` border in their default state. The selected (active) state uses `ink-12` fill with `paper-1` text and `ink-12` border. No brass tokens appear on selection state.

### FR-004 — Active filter chips (removable row)

Active filter chips displayed in the filter row above the table (`FilterChips.jsx`) use `brass-3` background fill, `brass-6` border, and `brass-11` text. The remove control (`×`) renders in `brass-10`. These chips use `border-radius: 2px` (`radius-xs`), not pill shape.

### FR-005 — Range slider styling

Range sliders render with a `2px` track in `ink-3`, a filled segment in `ink-11`, and a circular thumb of `14×14 px` with `paper-0` fill and `1px solid ink-11` border. The focus ring on the thumb input is `2px brass-8` via the global `:focus-visible` rule. Current range values display in JetBrains Mono (`font-mono`).

### FR-006 — Tri-state toggle styling

The hookless tri-state toggle uses `paper-1` background and `ink-4` border in the default state, `ink-12` fill and `paper-1` text in the active state. The container has `border-radius: 2px` with `overflow: hidden`.

### FR-007 — Table wrapper surface

The table area (`ComparisonTable.jsx`) renders inside a container with `paper-0` background and `1px solid ink-10` border.

### FR-008 — Table header row

The table header row (`<thead>`) uses `paper-1` background with a `1px solid ink-10` bottom border. Column header cells (`<th>`) render in the `.t-label` style: all-caps, `0.16–0.18em` letter-spacing, `font-size: 10px`, `font-weight: 600`, `color: ink-7`.

### FR-009 — Numeric table cells

All cells containing numeric data (weight, price, rim depth, external width) render in JetBrains Mono (`font-mono`) with `font-variant-numeric: tabular-nums`. Text alignment is right-aligned for numeric columns.

### FR-010 — Table row hover

When a table row receives hover, all cells in that row apply `brass-1` as background tint. No text color changes occur on hover.

### FR-011 — Sort indicator

The sorted column header renders the sort arrow indicator (`↓`) in `brass-8`. The header text of the sorted column shifts to `ink-12`.

### FR-012 — Hookless status badges

Hookless status badges (`badges.jsx`) are pill-shaped using `border-radius: 999px` (`radius-pill`). They render with `brass-2` fill, `brass-6` border, and `brass-10` text. Non-hookless (hooked) badges use `ink-4` border and `ink-9` text with no fill beyond the table cell background.

### FR-013 — Column selector popover

The column selector popover (`ColumnSelector.jsx`) uses `paper-0` background, `1px solid ink-10` border, and `shadow-menu` shadow (`0 1px 0 0 ink-10, 0 8px 24px -12px rgba(14,15,12,0.18)`). It does not use a card shadow. The trigger button uses `paper-0` background, `ink-4` border, and `border-radius: 2px`.

### FR-014 — Wrapper layout and viewport constraint

`MiniComparator.jsx` provides the outer layout binding. The grid is two-column (280px filter panel, 1fr table area) with 24px gap, and the filter panel is sticky. Viewport-bounded height constraint behavior is preserved exactly as before the migration.

### FR-015 — No legacy styling

No legacy blue or brand-prefixed color classes, no hardcoded hex values, and no inline `style` attributes for color, typography, or spacing remain in any of the six migrated files.

---

## 5. Detailed Use Cases

### UC-001 — User views the comparator with no filters applied

#### Preconditions
- The page has loaded.
- No filters are active.
- Default visible columns are shown.

#### Steps
1. User scrolls to or opens the comparator section.
2. All 15 wheels render in the table.
3. The filter panel is visible on the left.

#### Expected result
- Filter panel card displays with `paper-0` surface, `ink-4` hairline border, no shadow.
- Table header row is `paper-1` with `ink-10` bottom border.
- All numeric cells (weight, price, rim depth) render in JetBrains Mono with tabular figures.
- Hookless badges are pill-shaped with `brass-2` fill, `brass-6` border, `brass-10` text.
- No active filter chip row is displayed.

#### Error cases
- None for this scenario.

---

### UC-002 — User applies a multi-select filter

#### Preconditions
- Comparator is displayed.
- Brand filter group is expanded.

#### Steps
1. User clicks a brand chip (e.g., "Roval") in the multi-select group.
2. The chip transitions to selected state.
3. The table updates to show only matching wheels.
4. An active filter chip appears in the filter row above the table.

#### Expected result
- Selected chip: `ink-12` background, `paper-1` text, `ink-12` border.
- Active filter chip in the row: `brass-3` background, `brass-6` border, `brass-11` text, `radius-xs` shape.
- The active filter row is visible with a `brass-10` remove control on each chip.
- Redux filter state is unchanged in structure.

#### Error cases
- No wheels match: empty state is displayed with existing text content; no style regression.

---

### UC-003 — User removes an active filter chip

#### Preconditions
- At least one filter is active and an active chip is visible in the chip row.

#### Steps
1. User clicks the `×` remove control on an active filter chip.
2. The filter is cleared.
3. The active chip disappears from the chip row.
4. The table updates.

#### Expected result
- Active chip row hides when no active filters remain (existing behavior preserved).
- No visual artifact or unstyled chip remnant.

#### Error cases
- None.

---

### UC-004 — User hovers a table row

#### Preconditions
- Comparator is displayed with at least one wheel row visible.

#### Steps
1. User moves the pointer over a table row.

#### Expected result
- All cells in the hovered row receive `brass-1` background tint.
- Text color in the hovered row does not change.
- Transition is smooth (140ms per system motion token).

#### Error cases
- None.

---

### UC-005 — User sorts by a column

#### Preconditions
- Comparator is displayed.

#### Steps
1. User selects a sort criterion from the sort control (e.g., weight ascending).
2. The table reorders.

#### Expected result
- The sort indicator arrow (`↓`) appears in `brass-8` appended to the active column header.
- The sorted column header text shifts to `ink-12`.
- Row order changes; no style regression on other column headers.
- Redux sort state is unchanged in structure.

#### Error cases
- None.

---

### UC-006 — User opens the column selector popover

#### Preconditions
- Comparator is displayed.

#### Steps
1. User clicks the column selector trigger button.
2. The popover opens.

#### Expected result
- Popover renders with `paper-0` background, `ink-10` border, and `shadow-menu` shadow.
- Trigger button uses `paper-0` background, `ink-4` border, `radius-xs` shape.
- Popover closes when clicking outside (existing behavior preserved).

#### Error cases
- None.

---

### UC-007 — User adjusts a range slider (weight or price)

#### Preconditions
- Comparator is displayed.
- A range filter group (e.g., Weight) is expanded.

#### Steps
1. User drags a range slider thumb to adjust the min or max value.

#### Expected result
- Track renders in `ink-3` (2px height); filled segment renders in `ink-11`.
- Thumb is circular, 14×14 px, `paper-0` fill, `1px solid ink-11` border.
- Current range values update in JetBrains Mono display.
- When the thumb receives focus via keyboard, a `2px brass-8` focus ring is visible.
- The table updates to reflect the new filter range.

#### Error cases
- None.

---

## 6. Acceptance Criteria

### AC-001
#### Description
All numeric data cells (weight, price, rim depth, external width) render in JetBrains Mono with `font-variant-numeric: tabular-nums`.
#### Expected verification
Inspect computed styles on numeric `<td>` elements: `font-family` includes JetBrains Mono; `font-variant-numeric` is `tabular-nums`.
#### Type
- Manual

---

### AC-002
#### Description
Selected filter chips (multi-select, active state) use `ink-12` fill with `paper-1` text. No brass token appears on the selection state.
#### Expected verification
Select a brand chip; inspect computed `background-color` and `color` on the `.chip.active` element. Values must resolve to the `ink-12` and `paper-1` design system tokens. No `brass-*` value present.
#### Type
- Manual

---

### AC-003
#### Description
Active filter chips (removable row above table) use `brass-3` fill, `brass-6` border, `brass-11` text.
#### Expected verification
Apply a filter; inspect computed styles on `.active-chip`: `background-color` resolves to `--brass-3`, `border-color` to `--brass-6`, `color` to `--brass-11`.
#### Type
- Manual

---

### AC-004
#### Description
Range slider thumb uses `paper-0` fill and `ink-11` border. Focus ring on thumb input is `brass-8` via `:focus-visible`.
#### Expected verification
Inspect `.range-thumb` computed styles: `background` resolves to `--paper-0`; `border-color` to `--ink-11`. Tab-focus the range input and confirm a `brass-8` outline is visible.
#### Type
- Manual

---

### AC-005
#### Description
Column selector popover uses `shadow-menu` shadow, not a card shadow.
#### Expected verification
Open the column picker; inspect computed `box-shadow` on `.popover`: must be `0 1px 0 0 <ink-10-value>, 0 8px 24px -12px rgba(14,15,12,0.18)`. No other shadow present.
#### Type
- Manual

---

### AC-006
#### Description
Table row hover applies `brass-1` background tint only — no text color shift.
#### Expected verification
Hover a table row; inspect computed `background-color` on a `<td>` in the row: resolves to `--brass-1`. Inspect `color`: value is identical to the non-hovered state.
#### Type
- Manual

---

### AC-007
#### Description
Sorted column indicator uses `brass-8`.
#### Expected verification
Sort by any column; inspect `::after` pseudo-element on the active `<th>`: computed `color` resolves to `--brass-8`.
#### Type
- Manual

---

### AC-008
#### Description
Hookless badges are pill-shaped (`border-radius: 999px`) with `brass-2` fill, `brass-6` border, `brass-10` text.
#### Expected verification
Inspect a `.pill.hookless` element: `border-radius` is `999px`; `background` resolves to `--brass-2`; `border-color` to `--brass-6`; `color` to `--brass-10`.
#### Type
- Manual

---

### AC-009
#### Description
Column headers use `.t-label` typography token (all-caps, `0.16–0.18em` tracking). No badge styling on column headers.
#### Expected verification
Inspect `<th>` elements: `text-transform` is `uppercase`; `letter-spacing` is between `0.16em` and `0.18em`; `border-radius` is `0` or absent (no pill shape).
#### Type
- Manual

---

### AC-010
#### Description
Filter panel card uses `paper-0` surface with `ink-4` hairline border.
#### Expected verification
Inspect `.filter` container: `background` resolves to `--paper-0`; `border` is `1px solid` resolving to `--ink-4`; no `box-shadow` present.
#### Type
- Manual

---

### AC-011
#### Description
Table header row uses `paper-1` surface with `ink-10` bottom border.
#### Expected verification
Inspect `<thead>` and `<th>` elements: `background` resolves to `--paper-1`; `border-bottom` resolves to `1px solid --ink-10`.
#### Type
- Manual

---

### AC-012
#### Description
No legacy blue or brand-prefixed color classes remain in any of the six migrated files.
#### Expected verification
Search all six files (`FilterPanel.jsx`, `FilterPanel.module.css`, `ComparisonTable.jsx`, `ColumnSelector.jsx`, `badges.jsx`, `FilterChips.jsx`, `MiniComparator.jsx`) for `brand-`, `blue-`, `#`, and any hardcoded hex color values. Zero matches expected (excluding token variable declarations).
#### Type
- Automated

---

### AC-013
#### Description
Redux state wiring (filters, sort, column visibility) is functionally untouched.
#### Expected verification
Apply a brand filter, change the sort, hide a column: Redux DevTools shows state shape and action types identical to pre-migration behavior.
#### Type
- Manual

---

### AC-014
#### Description
Renders correctly in both FR and EN locales.
#### Expected verification
Switch locale to FR; confirm that all visible text uses existing translation keys and that no layout breakage or token regression occurs. Repeat for EN.
#### Type
- Manual

---

## 7. Functional Impacts

### Impacted components

- `FilterPanel.jsx` + `FilterPanel.module.css`
- `ComparisonTable.jsx`
- `ColumnSelector.jsx`
- `badges.jsx`
- `FilterChips.jsx`
- `MiniComparator.jsx`

No component outside the MiniComparator surface is affected.

### Impacted data

None. `wheelsData.js` and all data selectors are untouched.

### Impacted APIs

None.

### Impacted permissions / roles

None.

---

## 8. Out of Scope

- Redux state, filter logic, sort logic, and column visibility logic
- Data layer (`wheelsData.js`, selectors)
- i18n translation keys (existing FR/EN keys used as-is)
- Any component outside the MiniComparator surface (Navbar, Footer, Hero, landing sections)
- Design system token definitions (EVO-039, already completed)
- New filter axes, new columns, or new interaction patterns

---

## 9. Constraints

- Style-only migration: no change to user-facing behavior, filtering, sorting, or column visibility
- Prerequisite: EVO-039 (foundation tokens) is already completed and stable
- The `design-system/ui_kits/comparator/` files are the authoritative visual target for this migration
- Token corrections applied during Needs Assessment (vs. init.md) are definitive:
  - Selected filter chips use `ink-12` fill (not brass)
  - Range slider thumb uses `paper-0` + `ink-11` border (not `brass-8` thumb)
  - `FilterChips.jsx` is in scope

---

## 10. Test Plan

### Automated tests expected

- Static scan of all six migrated files for legacy color class names, `brand-` prefixes, and hardcoded hex values (AC-012)

### Manual tests expected

- Visual inspection of each component against the `design-system/ui_kits/comparator/` reference (AC-001 through AC-011)
- Redux state verification via DevTools after applying filters, changing sort, and toggling column visibility (AC-013)
- Locale switching (FR / EN) with visual check for layout integrity and text rendering (AC-014)

### Edge cases

- No wheels match active filters: empty state renders without style regression; existing message content and layout preserved
- All columns hidden via column selector: table area degrades gracefully with no unstyled fallback elements
- Range slider dragged to min/max boundary: thumb stays within track bounds; value display shows correct JetBrains Mono rendering

### Non-regression

- Filtering, sorting, and column visibility behave identically to the pre-migration state
- No layout shifts or visual regressions on the landing sections outside the MiniComparator surface
- Both locales (FR / EN) render without i18n key errors or style breakage
