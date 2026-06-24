# Technical Specifications

## 1. General Information

- Evolution ID: EVO-026
- PRD reference: `evolutions/EVO-026_comparator-controls-in-table-header/prd.md`
- Author: Flavien Drouot
- Date: 2026-05-29

---

## 2. Technical Context

### Technical objective

Remove the dedicated toolbar band above the comparison table. Relocate the "Columns" button (desktop + mobile) and the "Filters" button (mobile only) into the existing header row of `ComparisonTable`, which already displays the result count. The result is a single header bar: count label on the left, action buttons on the right.

### Affected architecture

- `MiniComparator.jsx` — orchestrator that currently owns both the toolbar layout (ColumnSelector placement, mobile Filters trigger) and the grid layout that positions them above the table. Will be restructured: all control JSX removed, grid simplified.
- `ComparisonTable.jsx` — currently renders only the count heading in its header row. Will receive `onOpenFilters`, `onOpenColumns` callbacks (or will render `ColumnSelector` directly), plus visibility props forwarded from `MiniComparator`.
- Column visibility state stays in `MiniComparator` (existing convention; see README "Column visibility = local state in MiniComparator").

### Impacted modules

- `frontend/src/components/MiniComparator/MiniComparator.jsx`
- `frontend/src/components/MiniComparator/ComparisonTable.jsx`

---

## 3. Technical Constraints

- Column visibility state remains in `MiniComparator` — do not move it into `ComparisonTable` or Redux.
- The mobile Filters drawer (off-canvas, backdrop, `aria-modal`) is defined in `MiniComparator`. It stays there; only the trigger button moves into `ComparisonTable`.
- The `ColumnSelector` popover is a self-contained component; it continues to receive `visibility` and `onToggle` props. It renders inside `ComparisonTable`'s header row.
- Tailwind responsive prefix `lg:` is the breakpoint boundary for desktop vs. mobile (matches existing usage throughout the project).
- No new dependencies, no new files — only the two components listed above are modified.
- All button labels, icon choices, and visual styles are preserved exactly. Buttons are not re-styled.
- The em-dash `—` in the result count ("Wheels — N of N") is a non-prose counter display context — the UI Guidelines em-dash ban does not apply here.
- Transitions on buttons: use the project pattern `transition: color var(--duration-quick) var(--ease-standard), ...` (already applied on both buttons in the current code).

---

## 4. Architecture Decisions

### AD-001 — ComparisonTable receives callbacks, not the ColumnSelector instance

#### Description
`ComparisonTable` receives two callback props: `onOpenFilters` (called on mobile Filters button click) and `onToggleColumn`/`columnVisibility` (forwarded to the embedded `ColumnSelector`). The `ColumnSelector` component is imported and rendered inside `ComparisonTable`'s header row.

#### Motivation
`ComparisonTable` is the natural owner of its own header row. Embedding `ColumnSelector` directly into `ComparisonTable` avoids prop-drilling an open/close flag for the column popover through `MiniComparator`. Filters state and drawer logic stay in `MiniComparator`, so only a callback (`onOpenFilters`) crosses the boundary — keeping the drawer itself (backdrop, `aria-modal`, close button) undisturbed in its current host.

#### Rejected alternatives
- **Keeping buttons in `MiniComparator`, absolutely positioned over the table header**: creates fragile positioning, breaks at variable widths, and still requires two separate DOM regions.
- **Lifting `ColumnSelector` state into Redux**: contradicts the established convention ("Column visibility = local state in MiniComparator") and is out of scope.
- **Creating a new `ComparatorHeader` wrapper component**: adds a file for minimal logic; the header row is already inside `ComparisonTable` and adding props there is simpler.

---

### AD-002 — Grid layout in MiniComparator simplified to sidebar + table only

#### Description
The current `MiniComparator` grid uses `lg:grid-cols-[320px_1fr] lg:grid-rows-[auto_1fr]` with explicit `row-start` and `col-start` to position the ColumnSelector above the table at desktop. After this evolution, the grid reverts to a single-row layout: `lg:grid-cols-[320px_1fr]` with no row tracking. The table column spans the full available area (one row only).

#### Motivation
The toolbar row (`auto`) only existed to host the ColumnSelector above the table on desktop. Once the ColumnSelector moves into `ComparisonTable`'s header row, the `row-start-1` / `row-start-2` constraints have no purpose and must be removed per FR-008 (no dead layout rules).

#### Rejected alternatives
- **Keeping `grid-rows` but leaving the first row empty**: leaves orphaned CSS, violates FR-008 and AC-007.

---

### AD-003 — Filters button mobile-only visibility via Tailwind responsive prefix

#### Description
Inside `ComparisonTable`'s header row, the Filters button is wrapped with `lg:hidden` (identical to the pattern currently used in `MiniComparator` for the mobile trigger). The `ColumnSelector` has no wrapper — it renders on all viewports.

#### Motivation
Reuses the existing responsive convention in the project. No JavaScript media query logic required.

#### Rejected alternatives
- **`useMediaQuery` hook with `window.matchMedia`**: unnecessary complexity; CSS breakpoints already handle this correctly.

---

## 5. Task Breakdown

Each task is described in a dedicated file using `shared-knowledge/templates/TASK-TEMPLATE.md`.

| Task | File | Summary | Dependencies |
|------|------|---------|--------------|
| TASK-001 | `TASK-001.md` | Add action-button props to `ComparisonTable` and render header controls | none |
| TASK-002 | `TASK-002.md` | Restructure `MiniComparator`: remove toolbar JSX, simplify grid, wire callbacks | TASK-001 |

---

## 6. Global Validation Strategy

### Unit validation
- None required (PRD §10: "No automated tests required for this evolution").

### Integration validation
- None required.

### Functional validation (manual — from PRD §10 and AC-001 to AC-007)
- Desktop: single header row with "Columns" button; no toolbar visible.
- Mobile: single header row with "Filters" then "Columns" buttons; no toolbar visible.
- Desktop: "Filters" button absent.
- Both viewports: "Columns" button opens the column selector panel; changes apply to the table.
- Mobile: "Filters" button opens the filter drawer; panel works as before.
- Apply and clear filters; confirm result count in the header row updates.
- Edge case: zero-match filter ("Wheels — 0 of N") — header row layout remains stable.
- Edge case: large N — count label and buttons remain on a single row without hiding buttons.

### Non-regression validation
- "Filters" button is hidden on desktop after the change.
- Column selector and filter panel open and function identically from their new positions.
- No orphaned toolbar markup or CSS remains.

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|---|---|---|
| `ColumnSelector` popover opens to the right on narrow viewports and may clip | Low — same risk existed before; popover already uses `right-0` | Confirm visually on narrow desktop and mobile emulation |
| Removing `lg:grid-rows-[auto_1fr]` may affect FilterPanel sidebar sticky positioning | Low — `lg:sticky` on `FilterPanel` uses `top: var(--navbar-height)`, not grid-row height | Verify sticky behavior in the final layout |

---

## 8. Rollback Plan

- Two files are modified. Both are small and self-contained.
- Rollback = revert `MiniComparator.jsx` and `ComparisonTable.jsx` to their pre-evolution state via git.
- No data migration, no Redux change, no new file to delete.
