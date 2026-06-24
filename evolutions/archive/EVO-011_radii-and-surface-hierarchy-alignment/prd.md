# PRD — Product Requirements Document

## 1. General Information

- **Evolution ID:** EVO-011
- **Title:** Radii semantics and surface hierarchy alignment
- **Author:** Flavien Drouot
- **Date:** 2026-05-26
- **Version:** 1.0
- **Needs Assessment reference:** `EVO-011_radii-and-surface-hierarchy-alignment/needs-assessment.md`

---

## 2. Functional Objective

After this evolution, the MyBikeLab landing page must conform fully to the design system's radius and surface grammar:

- The pill shape (`radius-pill`) is used exclusively for status badges (HookBadge).
- All other interactive elements — filter pills, icon buttons, decorative badges — use `radius-xs`.
- The page background (Hero included) is visually flat and uniform, with no spurious elevation in the Hero section.
- The Navbar renders at the canonical surface token (`paper-1`) at 88% opacity with 8px backdrop blur.
- Card components remain visually elevated above the page background.

---

## 3. Target Behavior

### General description

The landing page presents a clear, consistent visual hierarchy:

- The **body background** (`--bg-page` = `paper-1`) is the base layer. All full-page sections — including the Hero — render on this layer without override.
- **Cards and elevated panels** render on `paper-0`, visually lifted above the page.
- **Recessed areas** (table headers, filter wells) render on `paper-2`, appearing inset.
- The **Navbar** appears at the correct surface level (`paper-1` at 88% opacity) with 8px backdrop blur, ensuring it reads as a semi-transparent overlay of the page background — not as an elevated card.
- **Status badges** (HookBadge: Hookless / Hooked) are the only elements displaying the pill shape (`radius-pill`).
- **Filter pills** (active multi-select selections), the Hero MVP badge, and icon buttons (e.g., close MiniComparator drawer) display `radius-xs` — consistent with other interactive elements.

---

## 4. Functional Rules

### FR-001 — Exclusive pill shape for status badges

The `radius-pill` shape (fully rounded corners, equivalent to Tailwind `rounded-full`) must be used exclusively for status pill badges. The sole legitimate instance in the current codebase is the HookBadge, which communicates the binary Hookless / Hooked status of a wheel.

No other element type — filter pills, decorative MVP badges, icon buttons — may display `radius-pill`.

### FR-002 — radius-xs for filter pills

Filter pills that appear in multi-select filter controls (e.g., Brand, Diameter, Rim material, Hub brand, Hub model, Spokes brand, Spokes model, Spoke material) must use `radius-xs` (2px corner radius). Their shape must be visually consistent with input elements and buttons.

### FR-003 — radius-xs for the Hero MVP badge

The MVP badge displayed in the Hero section must use `radius-xs`. It is a decorative label, not a status badge, and must not use `radius-pill`.

### FR-004 — radius-xs for icon buttons

Icon buttons — in particular the close button on the MiniComparator drawer — must use `radius-xs`. Icon buttons are interactive controls, not status badges.

### FR-005 — Hero section inherits the page background

The Hero section must not apply a background color override. It must inherit `--bg-page` (`paper-1`) from the body, producing no visible elevation or surface contrast between the Hero area and adjacent page sections.

### FR-006 — Navbar surface and opacity

The Navbar must render with a background of `paper-1` at 88% opacity (`rgba(246,244,239,0.88)`) and a backdrop blur of 8px. No other surface token (e.g., `paper-0`) and no other opacity value is acceptable.

### FR-007 — Card components retain elevated surface

Card components (wheel cards, comparison panels) must continue to use `paper-0` as their background, remaining visually elevated above the page background. This rule must be confirmed unaffected by the changes introduced in FR-005 and FR-006.

---

## 5. Detailed Use Cases

### UC-001 — Visitor loads the landing page

#### Preconditions
- The user navigates to the MyBikeLab landing page (root URL).
- No filters are active.

#### Steps
1. The page loads and renders fully.
2. The user views the Hero section at the top of the page.
3. The user views the Navbar overlaid on the page content.
4. The user views the Wheel Comparator section with the wheel card grid.

#### Expected result
- The Hero background is identical in color to the rest of the page body — no visible separation or elevation difference.
- The Navbar reads as a semi-transparent surface, with `paper-1` at 88% opacity and a visible 8px blur effect over the scrolled content beneath.
- Wheel cards appear visually lifted above the page background (elevated surface).
- The Hero MVP badge displays with `radius-xs` corners (slightly rounded, not pill-shaped).

#### Error cases
- None specific to this use case.

---

### UC-002 — Visitor uses multi-select filters

#### Preconditions
- The user is on the landing page.
- The Wheel Comparator is visible.

#### Steps
1. The user opens a multi-select filter (e.g., Brand).
2. The user selects one or more values.
3. Active filter selections appear as filter pills below or near the filter controls.

#### Expected result
- Filter pills display with `radius-xs` corners — they are visually consistent with buttons and inputs, not pill-shaped.
- The HookBadge on each wheel card remains pill-shaped (`radius-pill`), clearly distinct from filter pills.

#### Error cases
- None specific to this use case.

---

### UC-003 — Visitor opens and closes the MiniComparator drawer

#### Preconditions
- The user has selected one or more wheels for comparison, triggering the MiniComparator drawer.

#### Steps
1. The MiniComparator drawer opens.
2. The user clicks the close icon button to dismiss the drawer.

#### Expected result
- The close icon button displays with `radius-xs` corners — consistent with other interactive controls, not pill-shaped.

#### Error cases
- None specific to this use case.

---

### UC-004 — Visitor inspects a wheel's hookless status

#### Preconditions
- The Wheel Comparator is visible with at least one wheel in the list.

#### Steps
1. The user views the Hookless column for a wheel.
2. The HookBadge (Hookless or Hooked) is visible on the wheel entry.

#### Expected result
- The HookBadge retains its `radius-pill` shape — it is the sole legitimate status pill on the page.
- Its shape is visually distinct from filter pills and icon buttons.

#### Error cases
- The HookBadge must not be changed to `radius-xs` — any such regression is a defect.

---

## 6. Acceptance Criteria

### AC-001
#### Description
All `rounded-full` usages in `frontend/src/components/` are inventoried. Each occurrence is either retained (HookBadge as status badge, or any circular avatar/brand logo where the circular shape is semantically meaningful) or corrected to `rounded-xs`.

#### Expected verification
Audit report listing each `rounded-full` occurrence, its component, and the decision taken (retain / correct). No unreviewed occurrence remains.

#### Type
- Manual

---

### AC-002
#### Description
Filter pills in all multi-select filter controls display `radius-xs` corners, not the pill shape.

#### Expected verification
Visual inspection: activate one or more multi-select filters (e.g., Brand, Rim material) and confirm that active filter pills render with slightly rounded, not fully rounded, corners.

#### Type
- Manual

---

### AC-003
#### Description
The Hero MVP badge displays `radius-xs` corners.

#### Expected verification
Visual inspection of the Hero section: the MVP badge renders with slightly rounded corners, visually consistent with button elements.

#### Type
- Manual

---

### AC-004
#### Description
The close icon button on the MiniComparator drawer displays `radius-xs` corners.

#### Expected verification
Visual inspection: open the MiniComparator drawer and confirm the close button does not render as a circle or pill.

#### Type
- Manual

---

### AC-005
#### Description
The Hero section renders on the same background color as the page body — no visible surface elevation in the Hero area.

#### Expected verification
Visual inspection: the Hero background is indistinguishable in color from the adjacent page sections (no lighter or darker band).

#### Type
- Manual

---

### AC-006
#### Description
The Navbar renders at `rgba(246,244,239,0.88)` (paper-1 at 88% opacity) with 8px backdrop blur.

#### Expected verification
Scroll the page so content passes beneath the Navbar. Confirm: (a) the Navbar background matches the `paper-1` color (not `paper-0`), (b) the blur effect is visible over underlying content, (c) opacity is 88% (not 80%).

#### Type
- Manual

---

### AC-007
#### Description
Card components continue to render with `paper-0` as their background, visually elevated above the page background.

#### Expected verification
Visual inspection: wheel cards appear lighter than the page background (`paper-1`), confirming the surface hierarchy is intact after Hero and Navbar changes.

#### Type
- Manual

---

### AC-008
#### Description
The HookBadge retains `radius-pill` on all wheel entries where it appears.

#### Expected verification
Visual inspection: the HookBadge (Hookless / Hooked) remains fully rounded on all wheel cards. It must not have been changed to `radius-xs`.

#### Type
- Manual

---

### AC-009
#### Description
Contrast ratios on filter pills and status badges remain WCAG-compliant after all changes.

#### Expected verification
Run a contrast check (browser DevTools accessibility panel or equivalent tool) on filter pills (active state) and HookBadge. Confirm that text-to-background contrast meets the applicable WCAG AA minimum.

#### Type
- Manual

---

## 7. Functional Impacts

### Impacted components

- **Hero section component** — remove `bg-paper-0` override; surface must inherit from body.
- **Navbar component** — correct surface token from `paper-0` to `paper-1`; correct opacity from 80% to 88%.
- **Multi-select filter pill component(s)** — change `rounded-full` to `rounded-xs`.
- **Hero MVP badge** — change `rounded-full` to `rounded-xs`.
- **MiniComparator close icon button** — change `rounded-full` to `rounded-xs`.
- **HookBadge** — no change; verify it is not inadvertently modified.
- **Wheel card components** — no change; verify `bg-paper-0` is preserved.

### Impacted data

- None.

### Impacted APIs

- None.

### Impacted permissions / roles

- None.

---

## 8. Out of Scope

- Palette changes (covered by EVO-007, completed).
- Component redesign beyond radius and surface token corrections.
- Content or layout restyling.
- HookBadge shape — it must remain `radius-pill`.
- Any surface, radius, or token changes not listed in the Needs Assessment.

---

## 9. Constraints

- EVO-007 (design token setup) is complete — `rounded-xs` and `paper-*` Tailwind utilities are available and must be used directly.
- EVO-008 (Hero content rewrite) is complete — no merge conflict risk.
- Visual hierarchy must be preserved: `paper-2` (recessed) < `paper-1` (page) < `paper-0` (elevated). No change introduced by this evolution may invert or flatten this hierarchy.
- Accessibility: contrast ratios on all modified elements must remain WCAG AA compliant.

---

## 10. Test Plan

### Automated tests expected

- None for this evolution. All correctness criteria are visual and are verified by manual inspection.

### Manual tests expected

- Load the landing page and inspect the Hero background against the body background (AC-005).
- Scroll the page and inspect the Navbar surface, opacity, and blur effect (AC-006).
- Activate multi-select filters and inspect filter pill corner radius (AC-002).
- Inspect the Hero MVP badge corner radius (AC-003).
- Open the MiniComparator drawer and inspect the close button corner radius (AC-004).
- Inspect wheel cards for elevated surface (`paper-0`) after Hero and Navbar changes (AC-007).
- Inspect HookBadge on wheel cards to confirm `radius-pill` is retained (AC-008).
- Run contrast checks on filter pills and HookBadge (AC-009).

### Edge cases

- A wheel entry where both Hookless and Hooked states are tested — confirm HookBadge renders pill-shaped in both states.
- A multi-select filter with a single active selection — confirm the filter pill still renders with `radius-xs`.
- The Navbar when the page is scrolled to the top (content behind it may be the Hero) and when scrolled midway (content behind it is the comparator) — confirm blur and opacity are consistent in both positions.

### Non-regression

- **Surface hierarchy:** `paper-0` cards remain elevated above `paper-1` page background after Hero correction.
- **HookBadge shape:** `radius-pill` must not have been changed.
- **Navbar functionality:** scrolling behavior and sticky positioning must be unaffected.
- **Filter functionality:** multi-select filter pills must remain interactive (clickable to remove selection) after the radius change.
