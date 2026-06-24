# PRD — Product Requirements Document

## 1. General Information

- Evolution ID: EVO-036
- Title: Freehub column — label rename and overflow popup
- Author: Flavien Drouot
- Date: 2026-06-02
- Version: 1.0
- Needs Assessment reference: `EVO-036_freehub-column-label-and-overflow-popup/needs-assessment.md`

---

## 2. Functional Objective

The comparator table's freehub column currently disrupts the table layout when a wheel has several compatible freehub options: the column has no maximum width and expands to fit its full content, making the table disproportionately wide.

After this evolution:
- The column header is renamed to "FREEHUB OPTIONS" to communicate its meaning clearly.
- The column is constrained to a maximum width so it never dominates the table layout.
- When a cell's content exceeds the maximum width, it is visually truncated; clicking (or tapping) that cell opens a popup that lists all freehub options for that wheel.
- When a cell's content fits within the maximum width, it renders normally with no popup.

---

## 3. Target Behavior

### General description

The FREEHUB OPTIONS column behaves like all other columns in the comparator table, except that it has an enforced maximum width. Cells whose content fits within that width display as usual. Cells whose content would exceed it are truncated with a visual overflow indicator; those cells are interactive — activating them opens a modal popup that shows the complete list of freehub options for the corresponding wheel. The popup is dismissed by clicking or tapping outside it.

---

## 4. Functional Rules

### FR-001 — Column header label

The column previously labelled "FREEHUB" must display the label "FREEHUB OPTIONS" in the comparator table header.

### FR-002 — Maximum column width

The FREEHUB OPTIONS column must have a defined maximum width. The column must never render wider than this maximum, regardless of the length of the cell content.

### FR-003 — Overflow truncation indicator

When the content of a FREEHUB OPTIONS cell exceeds the maximum column width, the content must be truncated and a visual indicator (such as an ellipsis "…") must be displayed to signal that the cell contains more content than is visible.

### FR-004 — Click/tap to open popup

A FREEHUB OPTIONS cell that is truncated (per FR-003) must be interactive. Activating it (click on desktop, tap on mobile) must open a popup that displays the complete list of freehub options for that wheel.

### FR-005 — Non-truncated cells are not interactive

A FREEHUB OPTIONS cell whose content fits entirely within the maximum width must not trigger any popup when clicked or tapped.

### FR-006 — Popup content

The popup must display all freehub options for the wheel corresponding to the activated cell. It must not show partial or truncated data.

### FR-007 — Popup dismissal

The popup must be dismissible by clicking or tapping outside of it. No keyboard-only or hover-only dismissal is required, though they are not excluded.

### FR-008 — Mobile compatibility

All interactions (opening and closing the popup) must work correctly on touch devices using tap gestures. No hover-based interaction is used.

---

## 5. Detailed Use Cases

### UC-001 — User reads a truncated freehub cell and opens the popup

#### Preconditions
- The comparator table is visible.
- At least one wheel has enough freehub options that its cell content exceeds the column maximum width.

#### Steps
1. User scans the comparator table and sees the FREEHUB OPTIONS column.
2. User notices a cell is truncated (ellipsis or similar indicator is visible).
3. User clicks or taps the truncated cell.
4. A popup opens, listing all freehub options for that wheel.
5. User reads the full list.
6. User clicks or taps outside the popup.
7. The popup closes.

#### Expected result
- The popup displays the complete freehub options list for the wheel.
- The popup closes cleanly when dismissed.
- The table layout is unchanged before, during, and after the interaction.

#### Error cases
- None identified.

---

### UC-002 — User reads a non-truncated freehub cell

#### Preconditions
- The comparator table is visible.
- At least one wheel has freehub content that fits within the maximum column width.

#### Steps
1. User reads the FREEHUB OPTIONS cell for a wheel whose content fits within the maximum width.
2. User clicks or taps the cell.

#### Expected result
- The full content is visible directly in the cell.
- No popup opens.
- No visual indicator of overflow is shown.

#### Error cases
- None identified.

---

### UC-003 — User views the table on a mobile device

#### Preconditions
- The comparator table is visible on a touch-screen device.
- At least one cell is truncated.

#### Steps
1. User taps a truncated FREEHUB OPTIONS cell.
2. Popup opens listing all freehub options for that wheel.
3. User taps outside the popup.
4. Popup closes.

#### Expected result
- Full popup open/close cycle works via tap only.
- No hover interaction is required.

#### Error cases
- None identified.

---

## 6. Acceptance Criteria

### AC-001
#### Description
The FREEHUB OPTIONS column header displays "FREEHUB OPTIONS".
#### Expected verification
Inspect the comparator table header row and confirm the label reads "FREEHUB OPTIONS", not "FREEHUB" or any other text.
#### Type
- Manual

---

### AC-002
#### Description
The FREEHUB OPTIONS column never exceeds its defined maximum width, regardless of cell content length.
#### Expected verification
Load the comparator with a wheel that has many freehub options. Measure the rendered column width and confirm it does not exceed the maximum width value. Verify no horizontal scroll is introduced by this column alone.
#### Type
- Manual

---

### AC-003
#### Description
A cell whose content exceeds the maximum width shows a visual truncation indicator (e.g. "…").
#### Expected verification
Identify a cell with content longer than the maximum width. Confirm that the text is clipped and a truncation indicator is visible.
#### Type
- Manual

---

### AC-004
#### Description
Clicking a truncated cell opens a popup showing all freehub options for that wheel.
#### Expected verification
Click a truncated cell. Confirm a popup appears. Confirm the popup lists all freehub options for that wheel (cross-reference with the source data). Confirm no option is missing.
#### Type
- Manual

---

### AC-005
#### Description
A cell whose content fits within the maximum width does not open a popup when clicked.
#### Expected verification
Identify a cell whose content is not truncated. Click it. Confirm no popup appears.
#### Type
- Manual

---

### AC-006
#### Description
The popup is dismissed by clicking or tapping outside it.
#### Expected verification
Open the popup. Click or tap outside the popup boundary. Confirm the popup closes and the table returns to its normal state.
#### Type
- Manual

---

### AC-007
#### Description
The full open/close interaction works on a touch device (tap to open, tap outside to close).
#### Expected verification
On a mobile device or browser touch emulation, tap a truncated cell, confirm the popup opens; tap outside, confirm it closes.
#### Type
- Manual

---

## 7. Functional Impacts

### Impacted components
- Comparator table — FREEHUB OPTIONS column header
- Comparator table — FREEHUB OPTIONS column cells (truncation behavior)
- New popup component for displaying the full freehub options list

### Impacted data
- No changes to how freehub data is stored or structured. The popup reads the same data already displayed in the cell.

### Impacted APIs
- None. The evolution is purely presentational.

### Impacted permissions / roles
- None. The feature is visible to all users without restriction.

---

## 8. Out of Scope

- Changes to any column other than FREEHUB OPTIONS
- Changes to how freehub data is stored, sourced, or filtered
- Hover-based tooltips (popup is click/tap only)
- Design changes to other table cells or sections
- Changes to the freehub filter behavior

---

## 9. Constraints

- The popup trigger must be click/tap — hover is explicitly excluded for mobile compatibility.
- The maximum width value will be determined during the technical specification phase, based on the design system's spacing scale and observed content lengths.
- The interaction must function correctly on touch devices without any degradation.

---

## 10. Test Plan

### Automated tests expected
- None required for this evolution. All verifiable behavior is visual and interaction-based.

### Manual tests expected
- Verify column header reads "FREEHUB OPTIONS" (AC-001)
- Verify column width does not exceed maximum with long content (AC-002)
- Verify truncation indicator appears on overflowing cells (AC-003)
- Verify popup opens with full content on truncated cell click (AC-004)
- Verify no popup on non-truncated cell click (AC-005)
- Verify popup dismissal by clicking outside (AC-006)
- Verify tap open/close cycle on a touch device or emulator (AC-007)

### Edge cases
- A wheel with exactly one freehub option: content likely fits without truncation; no popup should appear.
- A wheel with a very large number of freehub options: popup must display all of them without clipping.
- A truncated cell that is the last row in the table: popup must still open and be dismissible.

### Non-regression
- All other columns of the comparator table must be unaffected in width, label, and behavior.
- Existing filtering, sorting, and column show/hide features must continue to work as before.
