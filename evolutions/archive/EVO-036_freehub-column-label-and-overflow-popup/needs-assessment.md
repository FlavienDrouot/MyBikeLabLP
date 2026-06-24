# Needs Assessment

## 1. General Information

- Evolution ID: EVO-036
- Title: Freehub column — label rename and overflow popup
- Author: Flavien Drouot
- Date: 2026-06-02
- Status: Validated
- Priority: Low

---

## 2. Context

### Current situation

The comparator table includes a column labelled **FREEHUB**. This column can contain multiple values (the compatible freehub options for a wheel), which causes the column to render very wide when several options are listed, degrading the table layout.

### Identified problem

1. The column label "FREEHUB" is ambiguous — it does not communicate that the column lists available compatibility options.
2. The column has no maximum width, so it expands as wide as its content, breaking the overall table proportions.
3. There is no controlled way to see all values without the table stretching.

### Business motivation

A wide, unconstrained column disrupts the comparison experience, the primary value of the product. Users comparing wheels need a dense, readable table; a single column should not dominate the layout.

---

## 3. Business Objective

Improve the readability and visual balance of the comparator table by:
- Clarifying the column label
- Constraining the column to a reasonable fixed maximum width
- Providing a focused, on-demand way to read all freehub options for a wheel

---

## 4. Scope

### Included

- Rename the column header from **FREEHUB** to **FREEHUB OPTIONS**
- Apply a maximum width to the FREEHUB OPTIONS column in the comparator table
- When the content of a cell exceeds the maximum width: truncate with a visual indicator ("…" or similar)
- Clicking a truncated cell opens a popup listing all freehub options for that wheel
- The popup can be dismissed (click outside or close button)

### Excluded

- Changes to other columns
- Changes to how freehub data is stored or filtered
- Hover-based tooltip (click only, for mobile compatibility)
- Design changes to other table cells

---

## 5. Constraints

### Business constraints
- Must remain usable on mobile (touch): popup triggered by tap, not hover

### Known technical constraints
- None identified at this stage

### Regulatory / security constraints
- None

---

## 6. Use Cases

### Nominal case
As a user browsing the comparator table,
I want to see the freehub options for a wheel without the column dominating the layout,
So that I can compare wheels in a readable, balanced table.

### Alternative cases
- The freehub content fits within the maximum width → cell displays normally, no popup trigger
- User opens popup → reads all options → clicks outside to dismiss

### Known error cases
- None identified

---

## 7. Acceptance Criteria

- [ ] The column header reads "FREEHUB OPTIONS" (not "FREEHUB")
- [ ] The FREEHUB OPTIONS column has a defined maximum width; it never exceeds it
- [ ] No horizontal scroll is introduced on the column when content is long
- [ ] When a cell's content is truncated, a visual indicator is shown (e.g. "…")
- [ ] Clicking a truncated cell opens a popup listing all freehub options for that wheel
- [ ] The popup can be closed by clicking outside it
- [ ] The popup does not appear for cells whose content fits within the maximum width
- [ ] The interaction works correctly on mobile (tap to open, tap outside to close)

---

## 8. Open Questions

- None remaining

---

## 9. Assumptions

- The maximum width will be defined during technical specs based on the design system's spacing scale and typical content length
- "FREEHUB OPTIONS" is the final label (confirmed by user)
- Popup trigger is click/tap (not hover), confirmed by user
