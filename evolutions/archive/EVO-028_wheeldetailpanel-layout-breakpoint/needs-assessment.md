# Needs Assessment

> **Status: Validated** — Interview complete, document approved. PRD and Tech Specs must be re-run (see Correction Note below).

---

> **Correction Note (2026-05-29):** A first implementation attempt revealed that the initial technical diagnosis was wrong. The layout switch uses a Tailwind **viewport-width** media query (`max-[Npx]`), but `WheelDetailPanel`'s actual rendered width is narrower than the viewport because the FilterPanel sidebar (320px) consumes space at the `lg` breakpoint. Changing the pixel value alone (900px → 870px) does not fix the gap — the mechanism itself must change. The fix is to use the **actual rendered width** of the panel (already measured by `ComparisonTable`'s `ResizeObserver`) as the layout switch signal, passed as a prop to `WheelDetailPanel`. This correction affects the Tech Specs only — the business need, scope, and acceptance criteria below remain valid and unchanged.

---

## 1. General Information

- Evolution ID: EVO-028
- Title: WheelDetailPanel — Layout Breakpoint Correction
- Author: Flavien Drouot
- Date: 2026-05-29
- Status: Validated
- Priority: Medium

---

## 2. Context

### Current situation

The `WheelDetailPanel` is a drawer component that displays the detailed specifications of a selected wheel. It contains a layout switch mechanism: when the drawer width falls below a certain threshold, the internal elements reorganize into a "mobile" disposition adapted to narrow widths.

### Identified problem

There is a gap range of drawer widths where:
- the desktop layout is still active, but the drawer is too narrow to correctly display all content (overflow or overlap occurs), and
- the mobile layout has not yet been triggered.

This gap causes a degraded visual state with no intermediate handling.

### Business motivation

The comparator is a core product feature. A visual display bug — even in an intermediate state — degrades the perceived quality and professionalism of the tool, and may impact user trust when comparing wheel data.

---

## 3. Business Objective

Eliminate the layout gap in the WheelDetailPanel: at every possible drawer width, either the desktop layout fits correctly, or the mobile layout has already taken over. No intermediate broken state should be reachable.

---

## 4. Scope

### Included

- Adjusting the layout switch threshold in the `WheelDetailPanel` component so the mobile layout activates before content overflows or overlaps

### Excluded

- Redesigning either the desktop or mobile layout themselves
- Creating a new intermediate layout variant
- Changes to any component outside of `WheelDetailPanel` and its direct children

---

## 5. Constraints

### Business constraints

- The fix must not alter the visual appearance of the desktop or mobile layouts when they are correctly active

### Known technical constraints

- None identified at this stage

### Regulatory / security constraints

- None

---

## 6. Use Cases

### Nominal case

As a user browsing wheel specs,  
I want the WheelDetailPanel to always display its content cleanly regardless of the drawer width,  
So that I can read wheel data without layout glitches at any panel size.

### Alternative cases

- User resizes the browser window, causing the drawer width to pass through the previously problematic range → content remains clean throughout

### Known error cases

- None beyond the identified gap (resolved by this evolution)

---

## 7. Acceptance Criteria

- [ ] At no drawer width does content in the WheelDetailPanel overflow its container or overlap other elements
- [ ] The mobile layout activates at or before the width where content would start to overflow in the desktop layout
- [ ] The desktop layout remains unchanged at widths where it correctly fits all content
- [ ] The mobile layout remains unchanged at widths where it is already active

---

## 8. Open Questions

- None — scope is bounded and well-defined

---

## 9. Assumptions

- The existing desktop and mobile layouts are correct at their respective valid widths; only the threshold between them needs adjustment
- ~~The breakpoint is a single value (not a range), and shifting it earlier is sufficient to close the gap~~ — **Invalidated by Correction Note**: shifting the value is not sufficient; the detection mechanism must also change.
