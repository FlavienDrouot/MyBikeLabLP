# PRD — Product Requirements Document

## 1. General Information

- Evolution ID: EVO-028
- Title: WheelDetailPanel — Layout Breakpoint Correction
- Author: Flavien Drouot
- Date: 2026-05-29
- Version: 2.0
- Needs Assessment reference: `evolutions/EVO-028_wheeldetailpanel-layout-breakpoint/needs-assessment.md`

---

## 2. Functional Objective

The `WheelDetailPanel` drawer must display its content cleanly at every possible drawer width. The current gap — a range of widths where the desktop layout is still active but too narrow to render without overflow or overlap, and the mobile layout has not yet activated — must be eliminated.

The root cause of the gap is that the layout switch currently reacts to the viewport width, not to the panel's actual rendered width. Because the FilterPanel sidebar reduces the space available to `WheelDetailPanel`, the viewport-based signal does not accurately represent the panel's real width, making the switch trigger too late.

After this evolution, the layout switch reacts to the panel's actual rendered width. At every reachable drawer width, the component is either in a correctly fitting desktop layout or in the mobile layout; no broken intermediate state exists.

---

## 3. Target Behavior

### General description

The `WheelDetailPanel` contains a layout switch: below a threshold width, the component renders in a mobile disposition; at or above that threshold, it renders in the desktop disposition.

Currently, the switch uses the viewport width as its signal. Because `WheelDetailPanel` does not occupy the full viewport (the FilterPanel sidebar occupies part of it), the signal is inaccurate. The desktop layout breaks before the switch occurs.

After this evolution, the switch uses the panel's actual rendered width as its signal. The threshold value may also be adjusted alongside the mechanism change to ensure that the mobile layout activates at or before the point where any content would start to overflow or overlap in the desktop layout.

Both the desktop and mobile layouts themselves are unchanged; only the detection mechanism — and if necessary the threshold value — is corrected.

---

## 4. Functional Rules

### FR-001 — Continuous layout coverage

At every possible drawer width, the `WheelDetailPanel` must be in exactly one of two states: desktop layout (content fits correctly) or mobile layout (already active). There must be no width at which neither layout produces a clean display.

### FR-002 — Layout switch reacts to actual rendered width

The layout switch must use the panel's actual rendered width as its input signal, not the viewport width. At any given moment, the layout state must correspond to the real physical width of the `WheelDetailPanel` as drawn on screen.

### FR-003 — Mobile layout activates before overflow

The transition from desktop to mobile layout must occur at or before the drawer width at which any content element would overflow its container or overlap another element in the desktop layout.

### FR-004 — Desktop layout is not altered

The visual appearance of the desktop layout at widths where it correctly fits all content must remain exactly as it is before this evolution.

### FR-005 — Mobile layout is not altered

The visual appearance of the mobile layout at widths where it is already active must remain exactly as it is before this evolution.

### FR-006 — No new layout variant introduced

This evolution must not introduce a third intermediate layout disposition. The component continues to operate with exactly two layout states.

---

## 5. Detailed Use Cases

### UC-001 — User opens WheelDetailPanel at a narrow drawer width

#### Preconditions
- The user has selected a wheel from the comparator.
- The `WheelDetailPanel` opens at a width that falls within the previously broken range (too narrow for desktop layout, but mobile had not yet been triggered).

#### Steps
1. The user clicks or taps on a wheel entry in the comparator.
2. The `WheelDetailPanel` drawer opens.
3. The drawer's actual rendered width is within the formerly problematic range.

#### Expected result
- The component renders in the mobile layout.
- All content is fully visible, no element overflows its container, and no elements overlap.

#### Error cases
- None applicable — the broken state this evolution targets is itself the error case being eliminated.

---

### UC-002 — User resizes the browser window, causing the drawer to pass through the formerly problematic width range

#### Preconditions
- The `WheelDetailPanel` is open and visible.
- The user resizes the browser window, causing the drawer's actual rendered width to change.

#### Steps
1. The drawer is open and displaying a wheel's details in the desktop layout.
2. The user reduces the browser window width progressively.
3. The drawer's actual rendered width narrows and reaches the point where the mobile layout should activate.

#### Expected result
- At the moment the threshold is crossed (measured in actual rendered width), the component transitions cleanly from the desktop layout to the mobile layout.
- At no intermediate width does content overflow or overlap.
- The transition is immediate (no broken frame is visible).

#### Error cases
- None — continuous clean display is required throughout the resize.

---

### UC-003 — User views WheelDetailPanel at a wide drawer width (non-regression)

#### Preconditions
- The `WheelDetailPanel` is open at a width well above the layout switch threshold.

#### Steps
1. The user opens the detail panel for any wheel.
2. The drawer renders at a large actual width.

#### Expected result
- The desktop layout is active and displays all content exactly as before this evolution.
- No visual change is observable compared to the pre-evolution state.

#### Error cases
- None.

---

### UC-004 — User views WheelDetailPanel at a narrow width where mobile layout was already active before this evolution (non-regression)

#### Preconditions
- The `WheelDetailPanel` is open at a width clearly below the old threshold (mobile layout was already triggered in the pre-evolution state).

#### Steps
1. The user opens the detail panel for any wheel.
2. The drawer renders at a narrow width.

#### Expected result
- The mobile layout is active and displays all content exactly as before this evolution.
- No visual change is observable compared to the pre-evolution state at this width.

#### Error cases
- None.

---

## 6. Acceptance Criteria

### AC-001
#### Description
At no drawer width does any content element in the `WheelDetailPanel` overflow its container or extend beyond the panel boundary.

#### Expected verification
Manually resize the browser window across the full range of reachable widths while `WheelDetailPanel` is open. At no point should a scrollbar appear unexpectedly, content be clipped, or an element extend outside its container.

#### Type
- Manual

---

### AC-002
#### Description
At no drawer width do two or more content elements within the `WheelDetailPanel` visually overlap each other.

#### Expected verification
Manually resize across the full width range. No two distinct content blocks, labels, values, or icons should occupy the same screen area.

#### Type
- Manual

---

### AC-003
#### Description
The mobile layout activates at or before the drawer width at which any content element would overflow or overlap in the desktop layout.

#### Expected verification
Starting from a wide width in desktop layout, reduce width progressively. The switch to mobile layout must occur before any overflow or overlap becomes visible. There must be no frame or state where desktop layout is active and broken.

#### Type
- Manual

---

### AC-004
#### Description
The layout switch reacts to the panel's actual rendered width, not the viewport width. When the FilterPanel sidebar is visible (narrowing `WheelDetailPanel`), the layout switch triggers at the correct actual panel width.

#### Expected verification
Open `WheelDetailPanel` with the FilterPanel sidebar visible. Resize to a width that would previously have kept the broken desktop layout active (because the viewport was still wide). Confirm that the mobile layout now activates at the correct actual panel width and content is clean.

#### Type
- Manual

---

### AC-005
#### Description
The desktop layout appearance is unchanged at widths where it correctly fits all content.

#### Expected verification
Compare `WheelDetailPanel` in desktop layout at a large width before and after the evolution. No visual difference should be present.

#### Type
- Manual

---

### AC-006
#### Description
The mobile layout appearance is unchanged at widths where it was already active before this evolution.

#### Expected verification
Compare `WheelDetailPanel` in mobile layout at a narrow width (clearly below the old threshold) before and after the evolution. No visual difference should be present.

#### Type
- Manual

---

### AC-007
#### Description
The component continues to operate with exactly two layout states; no new intermediate disposition has been introduced.

#### Expected verification
Resize across the full width range and confirm that the component is in either the desktop or mobile layout at every point — no third intermediate state is ever rendered.

#### Type
- Manual

---

## 7. Functional Impacts

### Impacted components
- `WheelDetailPanel` — the layout switch mechanism changes from viewport-width-based to actual-rendered-width-based; the threshold value may also be adjusted
- `ComparisonTable` (or the component that currently measures `WheelDetailPanel`'s rendered width via `ResizeObserver`) — becomes the source of the width signal passed down to `WheelDetailPanel`; no visual or data behavior change in this component

### Impacted data
- None — this evolution affects only the presentational behavior of a UI component; no data model, state shape, or stored values are affected

### Impacted APIs
- None

### Impacted permissions / roles
- None

---

## 8. Out of Scope

- Redesigning the desktop layout
- Redesigning the mobile layout
- Introducing a new intermediate layout variant
- Changes to any component outside `WheelDetailPanel` and its direct rendering context (the component providing the measured width signal)
- Changes to the comparator table logic, filter panel behavior, or any other part of the application beyond what is strictly necessary to pass the actual rendered width to `WheelDetailPanel`

---

## 9. Constraints

- The fix must not alter the visual appearance of the desktop layout when it is correctly active (widths above the corrected threshold)
- The fix must not alter the visual appearance of the mobile layout when it is correctly active (widths below the corrected threshold)
- The evolution is strictly scoped to correcting the layout switch detection mechanism; no layout redesign is permitted
- The width signal used for the layout switch must reflect the panel's actual rendered width at all times, including when the FilterPanel sidebar is visible

---

## 10. Test Plan

### Automated tests expected
- None required for this evolution — the acceptance criteria are visual in nature and best verified manually

### Manual tests expected
- Open `WheelDetailPanel` with the FilterPanel sidebar visible and resize the browser window from maximum to minimum width; confirm no overflow, overlap, or broken state at any point
- Open `WheelDetailPanel` with the FilterPanel sidebar hidden and repeat the resize test; confirm the same clean behavior
- Open `WheelDetailPanel` at a width just above the corrected threshold (measured as actual rendered width); confirm desktop layout is active and visually correct
- Open `WheelDetailPanel` at a width just below the corrected threshold; confirm mobile layout is active and visually correct
- Compare desktop layout at a large width before and after the evolution to confirm no unintended visual change
- Compare mobile layout at a narrow width (well below old threshold) before and after the evolution to confirm no unintended visual change

### Edge cases
- Drawer actual rendered width exactly at the new threshold — must render in mobile layout (or desktop layout with no overflow), with no broken state
- Rapid continuous resize through the threshold — transition must remain clean with no intermediate broken frame
- FilterPanel sidebar toggled open/closed while `WheelDetailPanel` is at a width near the threshold — layout switch must react immediately to the resulting change in actual rendered width

### Non-regression
- All existing layout states of `WheelDetailPanel` at widths outside the formerly broken range must be visually identical before and after the evolution
- No other component in the application should be affected
