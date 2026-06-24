# PRD — Product Requirements Document

## 1. General Information

- Evolution ID: EVO-026
- Title: Move comparator controls into the table header row
- Author: Flavien Drouot
- Date: 2026-05-29
- Version: 1.0
- Needs Assessment reference: `evolutions/EVO-026_comparator-controls-in-table-header/needs-assessment.md`

---

## 2. Functional Objective

After this evolution, the wheel comparator no longer displays a dedicated toolbar band above the table. All comparator controls (Columns button, Filters button) are integrated directly into the table's first row, which already displays the result count. The result is a single compact header bar combining the count label and the action buttons.

---

## 3. Target Behavior

### General description

The comparator renders a single header row at the top of the table. On the left side of this row, the result count label is displayed ("Wheels — N of N"). On the right side, the available action buttons are aligned. Which buttons are visible depends on the viewport:

- On desktop: the "Columns" button only.
- On mobile: the "Filters" button followed by the "Columns" button.

No separate toolbar exists above or below this row. The toolbar that previously held these buttons is removed entirely. The header row inherits no layout rules from the former toolbar grid.

Both buttons retain their existing behavior: the "Columns" button opens the column selector panel; the "Filters" button opens the filter panel. The result count label continues to update dynamically when active filters change the number of matching wheels.

---

## 4. Functional Rules

### FR-001 — Single header bar

The comparator must display exactly one header area that contains both the result count and the action buttons. No separate toolbar band is permitted.

### FR-002 — Result count placement

The result count label ("Wheels — N of N") must appear on the left side of the header row at all times, regardless of viewport size.

### FR-003 — Columns button always present

The "Columns" button must appear on the right side of the header row on all viewports (desktop and mobile).

### FR-004 — Filters button mobile only

The "Filters" button must appear on the right side of the header row on mobile viewports only. It must not be visible on desktop.

### FR-005 — Button order on mobile

When both buttons are visible (mobile), the "Filters" button must appear before (to the left of) the "Columns" button.

### FR-006 — Button behavior unchanged

The "Columns" button must open the column selector panel exactly as it did before. The "Filters" button must open the filter panel exactly as it did before. Neither button's label, visual style, nor internal behavior changes.

### FR-007 — Dynamic result count

The result count in the header row must update to reflect the current filtered result set whenever filters are applied or cleared ("Wheels — 8 of 15" when 8 of 15 wheels match the active filters).

### FR-008 — Toolbar removal

The separate toolbar component that previously contained the action buttons must be removed. No residual layout rules from the former toolbar (such as a CSS grid defined to position those buttons) may remain in the codebase.

---

## 5. Detailed Use Cases

### UC-001 — Desktop user manages column visibility from the header

#### Preconditions
- The user is on a desktop viewport.
- The comparator is loaded and displaying wheels.

#### Steps
1. The user sees the header row showing "Wheels — N of N" on the left and the "Columns" button on the right. No toolbar band is visible.
2. The user clicks the "Columns" button.
3. The column selector panel opens.
4. The user toggles a column's visibility and confirms.
5. The table updates to reflect the change.

#### Expected result
- The header row layout is unchanged after the panel closes.
- The column selector panel behaves identically to its pre-evolution behavior.

#### Error cases
- None identified.

---

### UC-002 — Mobile user filters and adjusts columns from the header

#### Preconditions
- The user is on a mobile viewport.
- The comparator is loaded and displaying wheels.

#### Steps
1. The user sees the header row showing "Wheels — N of N" on the left and "Filters" then "Columns" buttons on the right. No toolbar band is visible.
2. The user taps "Filters".
3. The filter panel opens.
4. The user applies a filter (e.g., Carbon rim material only).
5. The result count updates in the header row ("Wheels — 8 of 15").
6. The user closes the filter panel.
7. The user taps "Columns" to hide a column.
8. The column selector panel opens and behaves as before.

#### Expected result
- Both buttons function correctly and independently.
- The result count reflects the active filter state at all times.
- The header row layout remains stable throughout.

#### Error cases
- None identified.

---

### UC-003 — Filters active — result count updates in header

#### Preconditions
- The user is on any viewport.
- The comparator is loaded.

#### Steps
1. The user opens the filter panel (via toolbar on desktop, or "Filters" button on mobile — via the new header integration).
2. The user selects one or more filter criteria.
3. The filtered result set is applied.

#### Expected result
- The result count in the header row updates immediately to show the filtered count ("Wheels — N of M" where N < M).
- The header row layout (label left, buttons right) is unaffected by the count change.

#### Error cases
- None identified.

---

## 6. Acceptance Criteria

### AC-001
#### Description
On a desktop viewport, the comparator displays a single header row containing "Wheels — N of N" on the left and the "Columns" button on the right. No separate toolbar band is visible anywhere in the comparator.
#### Expected verification
Visually inspect the comparator on a desktop viewport. Confirm the toolbar is absent and the "Columns" button appears in the first row of the table.
#### Type
- Manual

---

### AC-002
#### Description
On a mobile viewport, the comparator displays a single header row containing "Wheels — N of N" on the left and both "Filters" and "Columns" buttons on the right (in that order). No separate toolbar band is visible.
#### Expected verification
Visually inspect the comparator on a mobile viewport (or emulated mobile). Confirm the toolbar is absent and both buttons appear in the first row of the table, "Filters" to the left of "Columns".
#### Type
- Manual

---

### AC-003
#### Description
The "Filters" button is not visible on a desktop viewport.
#### Expected verification
On a desktop viewport, confirm that the "Filters" button does not appear anywhere in the comparator — neither in the header row nor elsewhere.
#### Type
- Manual

---

### AC-004
#### Description
The "Columns" button opens the column selector panel on interaction (click or tap), matching its pre-evolution behavior.
#### Expected verification
Click/tap the "Columns" button in the new header position. The column selector panel opens. Toggle a column and confirm the table reflects the change.
#### Type
- Manual

---

### AC-005
#### Description
The "Filters" button (mobile) opens the filter panel on tap, matching its pre-evolution behavior.
#### Expected verification
On a mobile viewport, tap the "Filters" button in the new header position. The filter panel opens. Apply a filter and confirm the result count updates.
#### Type
- Manual

---

### AC-006
#### Description
The result count label updates dynamically when filters are applied or cleared.
#### Expected verification
Apply at least one filter that reduces the result set. Confirm the header row label changes from "Wheels — N of N" to "Wheels — M of N" (M < N). Clear filters and confirm the label returns to "Wheels — N of N".
#### Type
- Manual

---

### AC-007
#### Description
No dead layout rules from the former toolbar remain in the codebase.
#### Expected verification
Code review confirms that the CSS grid or other layout properties previously used to position buttons within the toolbar are fully removed. No commented-out or orphaned rules targeting the old toolbar remain.
#### Type
- Manual (code review)

---

## 7. Functional Impacts

### Impacted components
- Comparator toolbar component (removed)
- Comparator table header row / first-row component (extended to include action buttons)
- Column selector button (relocated)
- Filters button (relocated)

### Impacted data
- None. The result count and filter state already exist; this evolution only changes where they are displayed.

### Impacted APIs
- None.

### Impacted permissions / roles
- None.

---

## 8. Out of Scope

- No change to button functionality (column selector panel, filter panel).
- No change to button labels or visual style.
- No change to the filter panel itself.
- No change to the column selector panel itself.
- No change to the table body, sorting behavior, or any other part of the comparator.
- No change to the "Filters" button's mobile-only visibility rule (rule is preserved, not altered).
- No addition of new buttons or controls.

---

## 9. Constraints

- The "Filters" button must remain hidden on desktop viewports — no regression on this visibility rule.
- No functionality from the former toolbar may be lost; all buttons must continue to operate identically after relocation.

---

## 10. Test Plan

### Automated tests expected
- None required for this evolution (pure layout relocation with no logic change).

### Manual tests expected
- Desktop: verify single header row with "Columns" button; verify no toolbar is present.
- Mobile: verify single header row with "Filters" then "Columns" buttons; verify no toolbar is present.
- Desktop: confirm "Filters" button is not visible.
- Both viewports: open the column selector panel via the "Columns" button and confirm it works as before.
- Mobile: open the filter panel via the "Filters" button and confirm it works as before.
- Apply and clear filters; confirm the result count in the header row updates correctly.

### Edge cases
- Result count at zero matches ("Wheels — 0 of N"): header row layout must remain stable and the count must display correctly.
- Very long result count string (e.g., large N): the header row must not break layout (label and buttons remain on a single row or wrap gracefully without hiding buttons).

### Non-regression
- The "Filters" button must not appear on desktop after the change.
- The column selector and filter panel must open and function identically to their pre-evolution behavior from their new positions.
- No orphaned toolbar markup or CSS must remain in the codebase.
