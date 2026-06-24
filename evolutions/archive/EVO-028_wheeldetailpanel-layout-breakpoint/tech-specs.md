# Technical Specifications

## 1. General Information

- Evolution ID: EVO-028
- PRD reference: `evolutions/EVO-028_wheeldetailpanel-layout-breakpoint/prd.md`
- Author: Flavien Drouot
- Date: 2026-05-29

---

## 2. Technical Context

### Technical objective

Replace the viewport-width-based Tailwind breakpoint in `WheelDetailPanel` with a prop-driven conditional class mechanism. `ComparisonTable` already measures the scroll container width via a `ResizeObserver`; that measured value is passed to `WheelDetailPanel` as a numeric prop (`panelWidth`). `WheelDetailPanel` uses this prop to switch between the desktop (side-by-side) and mobile (stacked) layout, eliminating the gap caused by the viewport-width mismatch.

### Affected architecture

- Presentational layer only — no Redux state, no data model, no routing changes.
- The layout switch moves from a static Tailwind `max-[Npx]` utility (evaluated against viewport width) to a runtime conditional `className` expression evaluated against the actual rendered panel width.
- `ComparisonTable` already owns a `ResizeObserver` (`scrollRef` + `panelRef`) and already writes `panelRef.current.style.width`. The existing measurement infrastructure is reused; only the prop passing is added.

### Impacted modules

- `frontend/src/components/MiniComparator/ComparisonTable.jsx` — passes the measured scroll container width as `panelWidth` to `WheelDetailPanel`.
- `frontend/src/components/MiniComparator/WheelDetailPanel.jsx` — accepts `panelWidth`, replaces `max-[870px]:flex-col` / `max-[870px]:items-center` with conditional class logic driven by the prop.

---

## 3. Technical Constraints

- The `@tailwindcss/container-queries` plugin is not installed in this project. Container queries (`@container`, `@lg:`) must not be used.
- No new npm dependency may be introduced.
- The visual appearance of the desktop layout at widths where it correctly fits content must be pixel-identical before and after this evolution.
- The visual appearance of the mobile layout at widths where it is already active must be pixel-identical before and after this evolution.
- No third layout variant may be introduced.
- Changes are strictly scoped to `ComparisonTable.jsx` and `WheelDetailPanel.jsx`.

---

## 4. Architecture Decisions

### AD-001 — Pass measured scroll container width as a numeric prop `panelWidth`

#### Description

`ComparisonTable` already has a `ResizeObserver` that reads `scrollRef.current.clientWidth` on every resize and writes it to `panelRef.current.style.width`. The same measured value is stored in a `ref` (`panelWidthRef`) and passed as the numeric prop `panelWidth` to `WheelDetailPanel` on every render where `expandedId` is set.

Because `style.width` is already being set (causing no re-render by itself), the only addition is:
1. A `useState` in `ComparisonTable` that holds the measured scroll container width so that changes propagate to the `WheelDetailPanel` render.
2. The prop `panelWidth` on the `WheelDetailPanel` call site.

#### Motivation

- The `ResizeObserver` and width measurement are already present in `ComparisonTable` — no new observer or hook is needed.
- Passing a numeric prop is the simplest interface: it is explicit, easily testable, and requires no changes to `WheelDetailPanel`'s data dependencies.
- This approach is idiomatic React: the parent measures, the child renders according to its measured space.

#### Rejected alternatives

- **Keep the Tailwind `max-[Npx]` breakpoint, raise the value to 870px**: Confirmed invalid. The breakpoint evaluates against the viewport width, not the panel's rendered width. When the FilterPanel sidebar (320px at `lg`) is open, the panel is ~320px narrower than the viewport; the switch fires at the wrong moment regardless of the threshold value. This approach was attempted and failed.
- **CSS container queries (`@container`)**: The `@tailwindcss/container-queries` plugin is not installed. Adding it solely for this use case introduces a new dependency and build configuration change for a problem already solved by the existing ResizeObserver.
- **Add a `useResizeObserver` hook inside `WheelDetailPanel`**: Would duplicate measurement logic that already exists in `ComparisonTable`. Two observers on the same DOM subtree for the same purpose is wasteful and harder to maintain.

---

### AD-002 — Layout switch threshold: 870px

#### Description

The layout switch fires when `panelWidth < 870`. The 870px value is derived from the minimum width budget of the desktop layout:

| Element | Width |
|---|---|
| `WheelImageCarousel` (fixed inline style in `WheelImageCarousel.jsx`) | 360 px |
| Flex gap (`gap-5`) | 20 px |
| Container horizontal padding (`px-5` × 2) | 40 px |
| Content column declared width (`w-[450px]`) | 450 px |
| **Total minimum** | **870 px** |

At any panel width below 870px the desktop layout cannot fit without overflow. The threshold is expressed as a strict less-than (`panelWidth < 870`), meaning: at exactly 870px the desktop layout is active (fits exactly); below 870px the mobile layout is active.

#### Motivation

870px is the mathematically exact minimum derived from declared widths in the codebase. Using a higher value would unnecessarily shrink the desktop layout range; using a lower value would allow overflow before the switch.

#### Rejected alternatives

- A higher threshold (e.g. 900px): Conservative, but reduces the desktop layout range without benefit.
- A lower threshold (e.g. 850px): Would leave a gap where desktop layout overflows.

---

## 5. Task Breakdown

Each task is described in a dedicated file using `shared-knowledge/templates/TASK-TEMPLATE.md`.

| Task | File | Summary | Dependencies |
|------|------|---------|--------------|
| TASK-001 | `TASK-001.md` | Add `panelWidth` state to `ComparisonTable` and pass it as a prop to `WheelDetailPanel` | none |
| TASK-002 | `TASK-002.md` | Replace viewport-breakpoint classes in `WheelDetailPanel` with prop-driven conditional className logic | TASK-001 |

---

## 6. Global Validation Strategy

### Unit validation

None required — no business logic, no computed values, no selectors.

### Integration validation

None required — no data flow, no Redux state, no API call is affected.

### Functional validation

Manual visual checks (see PRD section 10 and AC-001 through AC-007):

- Open `WheelDetailPanel` with the FilterPanel sidebar **visible** (lg breakpoint). Resize the browser from maximum to minimum width. At no point should content overflow, be clipped, or have elements overlapping.
- Repeat the above with the FilterPanel sidebar **hidden**.
- At a panel actual rendered width just above 870px: confirm desktop layout (side-by-side) is active and all content fits.
- At a panel actual rendered width just below 870px: confirm mobile layout (stacked) is active.
- At a large panel width (well above 870px): confirm desktop layout is visually identical to the pre-evolution state.
- At a narrow panel width (well below 870px): confirm mobile layout is visually identical to the pre-evolution state.
- Toggle the FilterPanel sidebar open and closed while `WheelDetailPanel` is near the 870px threshold — layout switch must react immediately.
- Resize rapidly and continuously through the threshold — no broken intermediate frame.

### Non-regression validation

- All components outside `ComparisonTable` and `WheelDetailPanel` must be visually unaffected.
- The desktop layout at large widths must be pixel-identical to the pre-evolution state.
- The mobile layout at narrow widths (well below 870px) must be pixel-identical to the pre-evolution state.

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|---|---|---|
| `panelWidth` state in `ComparisonTable` triggers a re-render of the entire table on every resize event. | Low — the ResizeObserver fires at most a few times per animation frame; React batches state updates. The table already re-renders on filter changes. | No throttle needed at this scale; revisit if profiling reveals jank. |
| `panelWidth` is `undefined` or `0` before the `ResizeObserver` fires for the first time (e.g. on first open). | Low — `WheelDetailPanel` uses `panelWidth < 870`; if `panelWidth` is `0` or `undefined`, the condition is truthy and the mobile layout is shown, which is safe (no overflow). | Verify first-render state in manual testing. |
| `WheelDetailPanel` is used in other locations in the codebase with no `panelWidth` prop. | None currently — only one call site exists (`ComparisonTable`). | Confirm with grep before implementation. If other call sites exist, default `panelWidth` to `0` to keep safe fallback. |

---

## 8. Rollback Plan

- In `ComparisonTable.jsx`: remove the `panelWidth` state, remove the state setter call in the `ResizeObserver` callback, and remove the `panelWidth` prop from the `WheelDetailPanel` JSX call.
- In `WheelDetailPanel.jsx`: restore `flex max-[870px]:flex-col items-start max-[870px]:items-center` on the root `<div>` and remove the `panelWidth` prop from the function signature.
- Both files revert to their pre-evolution state; no other files are affected.
