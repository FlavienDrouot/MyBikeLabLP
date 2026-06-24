# Technical Specifications

## 1. General Information

- Evolution ID: EVO-042
- PRD reference: `EVO-042_design-system-minicomparator/prd.md`
- Author: Flavien Drouot
- Date: 2026-06-03

---

## 2. Technical Context

### Technical objective

Migrate all styling in the MiniComparator surface (six components + one CSS module) from legacy ad-hoc CSS to the EVO-039 design system tokens. Every color, typography, spacing, and elevation value must be derived from the token set defined in `design-system/colors_and_type.css`. No change to behavior, Redux state, filter logic, sort logic, or data layer.

### Affected architecture

- React component layer (JSX files only — markup restructuring is allowed where required to apply token classes; logic is untouched)
- CSS module layer (`FilterPanel.module.css` — the range slider pseudo-element styles that cannot be expressed with Tailwind)
- No store, selector, config, or i18n file is touched

### Impacted modules

- `frontend/src/components/MiniComparator/FilterPanel.jsx`
- `frontend/src/components/MiniComparator/FilterPanel.module.css`
- `frontend/src/components/MiniComparator/ComparisonTable.jsx`
- `frontend/src/components/MiniComparator/ColumnSelector.jsx`
- `frontend/src/components/MiniComparator/badges.jsx`
- `frontend/src/components/MiniComparator/FilterChips.jsx` (file does not yet exist in production; must be created as a new component)

---

## 3. Technical Constraints

- Style-only migration: Redux state, filter logic, sort logic, column visibility logic, i18n keys, and the data layer are untouched
- EVO-039 design system tokens are already available in the production codebase (`tailwind.config.js` and `colors_and_type.css`)
- The authoritative visual target is `design-system/ui_kits/comparator/` — all style decisions must trace back to that reference
- `FilterPanel.module.css` is the only CSS module file permitted for pseudo-element range-slider rules that Tailwind cannot reach; no new `.module.css` files are introduced
- Tailwind utility classes are used for all token-mapped styles; raw CSS custom property references (`var(--token)`) are used only in `FilterPanel.module.css` where Tailwind cannot reach
- No inline `style` attributes for color, typography, or spacing — the only permitted inline `style` uses are: dynamic positioning (ColumnSelector popover position), dynamic `width`/`left` for the range-fill element, and `zIndex` for overlapping range thumbs (all three already exist)
- `FilterChips.jsx` does not exist in production today; TASK-005 creates it. The component is wired into `ComparisonTable.jsx` in that same task (or the subsequent TASK-006 if ordering requires it)
- Transition values must use `var(--duration-quick)` (140ms) + `var(--ease-standard)` — never hardcoded `150ms ease` or `200ms`

---

## 4. Architecture Decisions

### AD-001 — FilterChips.jsx: new file, not inline

#### Description
`FilterChips.jsx` does not exist in the production codebase. The active filter chip row must be created as a new standalone component file, then imported into `ComparisonTable.jsx` (which currently renders the table toolbar area where the chip row belongs).

#### Motivation
The design system reference (`FilterChips.jsx` in `ui_kits/comparator/`) defines the chip row as a discrete component. Keeping it separate respects the one-component-per-file convention already in use for the rest of the MiniComparator surface and makes the component independently testable.

#### Rejected alternatives
- Inlining the chip row markup directly into `ComparisonTable.jsx`: rejected because it conflates table layout concerns with filter state display and makes the chip row harder to test or replace independently.

---

### AD-002 — FilterPanel.module.css: replace, do not extend

#### Description
The current `FilterPanel.module.css` contains hardcoded hex values (`#a88846`, `#c2c0b3`) for range slider pseudo-elements. The entire file is replaced with corrected values using `var(--*)` tokens only. No new CSS module files are added.

#### Motivation
Pseudo-element rules for `<input type="range">` cannot be expressed with Tailwind utility classes. The CSS module is the correct location for these rules. Using `var(--*)` tokens removes the last hardcoded hex values from the file.

#### Rejected alternatives
- Adding a new `RangeSlider.module.css`: rejected — introduces unnecessary file proliferation; the existing module is the right home.
- Using a `style` prop to pass colors to a custom range component: rejected — over-engineering for a style-only migration.

---

### AD-003 — No new CSS modules; Tailwind for all other token-mapped styles

#### Description
All token-mapped styles in JSX files are expressed via Tailwind utility classes (e.g., `bg-paper-0`, `border-ink-4`, `text-brass-11`). Raw `var(--*)` references are only used inside `FilterPanel.module.css`.

#### Motivation
The production codebase already maps design system tokens to Tailwind utilities via `tailwind.config.js` (EVO-039). Using Tailwind classes keeps the token→class→rendering chain consistent across the codebase and avoids inline style proliferation.

#### Rejected alternatives
- Using inline `style={{ background: 'var(--paper-0)' }}` in JSX: rejected per PRD constraint (FR-015) and IMPLEMENTATION-GUIDE rule ("Never use raw hex. Never use inline style for color").

---

### AD-004 — Chip shape: pill for multi-select, radius-xs for active chips and tri-state

#### Description
Multi-select filter chips in `FilterPanel.jsx` (the `Pill` component) use `rounded-full` (`border-radius: 999px`, `radius-pill`) — matching the `comparator.css` `.chip` definition. Active filter chips in `FilterChips.jsx` use `rounded-xs` (`border-radius: 2px`). Tri-state toggle container uses `rounded-xs` with `overflow-hidden`.

#### Motivation
The design system reference (`comparator.css`) is explicit: `.chip` uses `border-radius: 999px`, `.active-chip` uses `border-radius: 2px`, `.tri` uses `border-radius: 2px`. These are distinct element types with different semantic roles. The PRD FR-003 and FR-006 match this distinction.

#### Rejected alternatives
- Using `rounded-xs` for all chips for visual consistency: rejected — conflicts with the design system reference and PRD FR-003 which explicitly specifies the pill shape for multi-select chips.

---

### AD-005 — FilterChips.jsx wired into ComparisonTable.jsx above the table scroll area

#### Description
The active filter chip row is rendered inside `ComparisonTable.jsx`, between the toolbar row (heading + column selector) and the scrollable table area. It reads active filter state from Redux directly using `useSelector`.

#### Motivation
The design system reference places the active chip row (`active-row`) as a row above the table. Wiring it inside `ComparisonTable.jsx` keeps the layout ownership clear and requires no changes to `MiniComparator.jsx` or `FilterPanel.jsx`.

#### Rejected alternatives
- Placing the chip row in `MiniComparator.jsx` between the filter drawer and the table column: rejected — requires layout changes to the outer wrapper and complicates the two-column grid arrangement.

---

## 5. Task Breakdown

| Task | File | Summary | Dependencies |
|------|------|---------|--------------|
| TASK-001 | `TASK-001.md` | Replace `FilterPanel.module.css` — remove hardcoded hex, apply token `var()` references for range slider pseudo-elements | none |
| TASK-002 | `TASK-002.md` | Migrate `FilterPanel.jsx` — panel card, axis labels, `Pill` chip states, `DualRangeRow` value display, `FilterToggle`, sort select, section headers | TASK-001 |
| TASK-003 | `TASK-003.md` | Migrate `badges.jsx` — `HookBadge` and `TubelessBadge` to correct token values and pill shape | none |
| TASK-004 | `TASK-004.md` | Migrate `ColumnSelector.jsx` — popover `shadow-menu`, trigger button `radius-xs`, popover border `ink-10` | none |
| TASK-005 | `TASK-005.md` | Create `FilterChips.jsx` and wire into `ComparisonTable.jsx` — active chip row with brass tokens and `radius-xs` | none |
| TASK-006 | `TASK-006.md` | Migrate `ComparisonTable.jsx` — table wrapper border, `thead` surface, `th` `.t-label` style, numeric cells `font-mono`, row hover `brass-1`, sort indicator `brass-8`, outer card border | TASK-003, TASK-004, TASK-005 |
| TASK-007 | `TASK-007.md` | Migrate `MiniComparator.jsx` — wrapper layout tokens (grid gap, filter panel sticky), validate no legacy styling remains across all six files | TASK-002, TASK-006 |

---

## 6. Global Validation Strategy

### Unit validation
- Static scan of all six migrated files for legacy patterns: `brand-`, `blue-`, raw hex (`#[0-9a-fA-F]{3,6}`), and any hardcoded pixel color values not inside `var()`
- Confirms AC-012

### Integration validation
- Visual inspection of each component in the running app against the `design-system/ui_kits/comparator/` reference screenshots
- Covers AC-001 through AC-011

### Functional validation
- Redux DevTools verification: apply a brand filter, change sort, hide a column — state shape and action types identical to pre-migration
- Confirms AC-013

### Non-regression validation
- Locale switch (FR ↔ EN) with visual check for layout integrity and i18n key rendering (AC-014)
- Verify empty state (no wheels match filters) renders without style regression
- Verify column selector with all columns hidden degrades gracefully

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|------|------|---|
| `FilterChips.jsx` does not exist in production — Redux selector for active filters must be identified correctly | Medium — wrong selector would break filter display | TASK-005 specifies the exact Redux selectors to use (`s.filters.filters`) and the chip-building logic pattern derived from the design system reference |
| Range slider thumb size change (20px → 14px in design system) may affect usability on touch | Low — filter panel is desktop-first | Acceptable; the mobile drawer already uses a different layout |
| `Pill` component in `FilterPanel.jsx` currently uses `rounded-xs`; design system uses pill shape for multi-select chips | Low — shape change only | AD-004 documents the decision; TASK-002 specifies the correction |
| ComparisonTable currently uses `bg-paper-2` for `thead` sticky cells; design system specifies `paper-1` | Low — visual difference only | TASK-006 specifies the correction; the sticky `z-10` behaviour is preserved |

---

## 8. Rollback Plan

- All changes are isolated to six component files and one CSS module — no store, config, or i18n files are modified
- Revert is a single git revert of the EVO-042 commits
- No database migrations, no API changes, no environment variable changes
