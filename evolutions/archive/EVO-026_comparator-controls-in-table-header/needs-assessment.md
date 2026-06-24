# Needs Assessment

## 1. General Information

- Evolution ID: EVO-026
- Title: Move comparator controls into the table header row
- Author: Flavien Drouot
- Date: 2026-05-29
- Status: Draft
- Priority: Medium

---

## 2. Context

### Current situation

The wheel comparator displays a toolbar separate from the table. This toolbar contains the "Columns" button (desktop + mobile) and the "Filters" button (mobile only). The first row of the table shows a result count ("Wheels — 15 of 15") with no controls alongside it.

### Identified problem

The toolbar and the table header row form two distinct horizontal bands that both serve as entry points to comparator controls. This creates visual clutter and spreads controls across two zones, making the interface less compact.

### Business motivation

Consolidating the controls into a single row reduces vertical space usage and makes the comparator interface cleaner and more immediately usable.

---

## 3. Business Objective

Reduce the vertical footprint of the comparator controls by merging the existing toolbar buttons into the table's first row ("Wheels — N of N"), creating a single header bar that displays both the result count and the control actions.

---

## 4. Scope

### Included

- The "Columns" button is moved into the first row of the table, aligned to the right, visible on desktop and mobile.
- The "Filters" button is moved into the first row of the table, aligned to the right, visible on mobile only.
- The separate toolbar that previously housed these buttons is removed.
- The CSS grid layout used to position those buttons in the toolbar is cleaned up.

### Excluded

- No change to button functionality (Columns selector panel, Filters panel).
- No change to button labels or visual style.
- No change to the "Filters" button's mobile-only visibility rule.
- No change to any other part of the comparator (filter panel, column selector, table body).

---

## 5. Constraints

### Business constraints

- The "Filters" button must remain hidden on desktop — no regression on this visibility rule.

### Known technical constraints

- None at this stage.

### Regulatory / security constraints

- None.

---

## 6. Use Cases

### Nominal case (desktop)

As a desktop user,  
I want to see "Wheels — N of N" on the left and the "Columns" button on the right in the same row,  
So that I can manage column visibility directly from the table header without an extra toolbar band.

### Nominal case (mobile)

As a mobile user,  
I want to see "Wheels — N of N" on the left and both "Filters" and "Columns" buttons on the right in the same row,  
So that I can open filters and manage columns from a single compact header.

### Alternative cases

- When filters are active, the result count updates ("Wheels — 8 of 15") — the layout of the header row is unaffected.

### Known error cases

- None.

---

## 7. Acceptance Criteria

- [ ] On desktop: the first row of the table displays "Wheels — N of N" on the left and the "Columns" button aligned to the right. No separate toolbar is visible.
- [ ] On mobile: the first row of the table displays "Wheels — N of N" on the left and both "Filters" and "Columns" buttons aligned to the right. No separate toolbar is visible.
- [ ] The "Filters" button is not visible on desktop.
- [ ] The "Columns" button opens the column selector panel as before.
- [ ] The "Filters" button opens the filter panel as before.
- [ ] The result count ("Wheels — N of N") updates correctly when filters are applied.
- [ ] The CSS grid layout previously used to position the toolbar buttons is removed — no dead layout rules remain.

---

## 8. Open Questions

- None.

---

## 9. Assumptions

- The existing toolbar is fully replaced by this integration — no elements from the toolbar are retained elsewhere.
- Button order in the header row (mobile): "Filters" first, then "Columns" — mirrors the logical flow (filter first, then display columns).
