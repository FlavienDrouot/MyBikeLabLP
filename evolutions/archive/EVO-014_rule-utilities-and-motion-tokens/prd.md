# PRD — Product Requirements Document

## 1. General Information

- **Evolution ID:** EVO-014
- **Title:** Rule utilities, motion tokens & annotation style
- **Author:** Flavien Drouot
- **Date:** 2026-05-27
- **Version:** 1.0
- **Needs Assessment reference:** `MyBikeLab/evolutions/EVO-014_rule-utilities-and-motion-tokens/needs-assessment.md`

---

## 2. Functional Objective

After this evolution, the frontend applies the three design system primitives that were defined but unused: rule utility classes for all dividers, DS motion tokens for all hover transitions on interactive elements, and the `.t-annotation` class as always-visible sub-text below indicative prices. The gap between what the design system specifies and what the user sees is closed for these three areas.

---

## 3. Target Behavior

### General description

The page currently expresses visual separators, hover transitions, and price data in an ad-hoc manner that bypasses the design system's own rules. After EVO-014:

- Every hairline separator visible on the page (section dividers, table row dividers, footer separator) is rendered through a design system rule class, not through inline Tailwind border tokens.
- Every hover transition on an interactive element (Navbar links, buttons, table rows) uses the DS-specified duration and easing rather than Tailwind's default 150ms/ease pair.
- Every price displayed in the comparison table and the wheel detail panel carries a permanently visible italic annotation informing the user that the price is indicative and sourced in Q2 2025.

No component changes shape, layout, or behavior. The changes are limited to visual style and data labeling.

---

## 4. Functional Rules

### FR-001 — Rule classes are the single source for divider styling

Wherever the frontend applies a horizontal or vertical hairline separator — whether between page sections, between table rows, or as a footer delimiter — it must use one of the four DS rule utility classes: `.rule`, `.rule-strong`, `.rule-faint`, or `.rule-double`. Ad-hoc Tailwind border tokens (`border-b`, `border-ink-*`, `divide-y`, `divide-ink-*`) must not coexist with rule classes on the same visual separator.

The choice of rule class variant must reflect the intended visual weight of the separator:
- `.rule` — default separator, standard visual weight.
- `.rule-strong` — high-emphasis separator (e.g., primary section boundary).
- `.rule-faint` — low-emphasis separator (e.g., between table rows).
- `.rule-double` — decorative double keyline, reserved for deliberate emphasis.

At least the following three components must be updated: Footer, RoadmapSection, and ComparisonTable header.

### FR-002 — DS motion tokens govern all hover transitions

Hover transitions on interactive elements must use the DS duration tokens (`instant` 80ms, `quick` 140ms, `base` 220ms, `slow` 400ms) and the DS easing tokens (`ease-standard`, `ease-emphasized`) instead of Tailwind's default transition values.

The following elements are in scope at minimum:
- Navbar links
- Primary action buttons
- ComparisonTable rows (hover highlight)

No new animations are introduced. This rule applies exclusively to transitions that already exist today.

### FR-003 — Indicative prices carry a permanent annotation

Any price value displayed in the ComparisonTable or WheelDetailPanel must be accompanied by a permanently visible sub-text annotation styled with the `.t-annotation` class. The annotation text is: *indicative price, sourced 2025-Q2*.

The annotation must be:
- Always visible — not dependent on hover, focus, or any user interaction.
- Positioned as sub-text below or immediately adjacent to the price value.
- Rendered in italic, using the `.t-annotation` style as defined in the design system.

The annotation must appear in both surfaces: the ComparisonTable (price column) and the WheelDetailPanel (price field).

---

## 5. Detailed Use Cases

### UC-001 — User browses the page and observes section separators

#### Preconditions
- The user has loaded the MyBikeLab landing page.
- The page is fully rendered in a desktop or mobile viewport.

#### Steps
1. The user scrolls through the page sections (Hero, Wheel Comparator, Roadmap, Benefits, Partnership, Footer).
2. The user observes the visual separators between sections and within the comparison table.

#### Expected result
- All hairline separators appear visually uniform in weight and color within each semantic category (e.g., all between-row dividers share the same `.rule-faint` appearance).
- No visual inconsistency exists between separators in different components (e.g., the Footer separator does not look heavier or lighter than a comparable separator elsewhere for no design reason).

#### Error cases
- None anticipated — this applies existing CSS classes to existing DOM elements.

---

### UC-002 — User hovers over interactive elements

#### Preconditions
- The user is on the landing page in a device that supports hover (desktop pointer).

#### Steps
1. The user moves their cursor over a Navbar link.
2. The user moves their cursor over a primary button (e.g., a CTA or a sort/filter control).
3. The user moves their cursor over a row in the ComparisonTable.

#### Expected result
- In each case, the hover transition occurs within a duration between 80ms and 400ms.
- The easing of each transition feels crisp and intentional — not sluggish (>400ms), not jarring (<80ms).
- All transitions feel consistent with each other (same perceived quality of motion).

#### Error cases
- None anticipated. If a token is missing or misconfigured, the browser falls back to the element's non-transitioned state rather than breaking the layout.

---

### UC-003 — User reads prices in the comparison table

#### Preconditions
- The user has loaded the page and the Wheel Comparator is visible.
- The Price column is visible (it is a default-visible column).

#### Steps
1. The user looks at any row in the ComparisonTable where a price is displayed.

#### Expected result
- Below or adjacent to the price value, a small italic label is displayed: *indicative price, sourced 2025-Q2*.
- The annotation is visible without any hover or interaction.
- The annotation does not overflow the cell or disrupt the table layout.

#### Error cases
- If a wheel has no price data, no annotation is shown (no price to annotate).

---

### UC-004 — User opens the WheelDetailPanel for a wheel with a price

#### Preconditions
- The user has selected a wheel in the comparator that triggers the WheelDetailPanel.
- The selected wheel has a price value in the dataset.

#### Steps
1. The WheelDetailPanel opens and displays the wheel's specifications.
2. The user scrolls to or directly sees the price field in the panel.

#### Expected result
- The price is displayed alongside or below the annotation: *indicative price, sourced 2025-Q2*, in italic `.t-annotation` style.
- The annotation is always visible without any interaction.

#### Error cases
- If the wheel has no price, the annotation does not appear.

---

## 6. Acceptance Criteria

### AC-001
#### Description
At least three components — Footer, RoadmapSection, and ComparisonTable header — use a `.rule*` class for their dividers, and no ad-hoc Tailwind `border-*` or `divide-*` tokens remain on those same separators.
#### Expected verification
Inspect the rendered DOM and the component source for each of the three components. Confirm the presence of a `.rule`, `.rule-strong`, `.rule-faint`, or `.rule-double` class on each divider element, and the absence of inline `border-b`, `border-ink-*`, `divide-y`, or `divide-ink-*` classes on the same element.
#### Type
- Manual

---

### AC-002
#### Description
Hover transitions on Navbar links, primary buttons, and ComparisonTable rows use DS duration and easing tokens, not Tailwind defaults.
#### Expected verification
In the browser devtools (Computed Styles / Transitions panel), verify that the `transition-duration` and `transition-timing-function` values on the affected elements correspond to the DS tokens (`instant` 80ms, `quick` 140ms, `base` 220ms, or `slow` 400ms; `ease-standard` or `ease-emphasized`), and not Tailwind's default 150ms / cubic-bezier(0.4, 0, 0.2, 1).
#### Type
- Manual

---

### AC-003
#### Description
An always-visible italic annotation (*indicative price, sourced 2025-Q2*) is present below or adjacent to every price value in the ComparisonTable price column.
#### Expected verification
Open the comparator with at least one wheel visible. Confirm the annotation text is rendered in the price column for each row that has a price, without hovering. Verify the annotation uses italic styling consistent with `.t-annotation`.
#### Type
- Manual

---

### AC-004
#### Description
An always-visible italic annotation (*indicative price, sourced 2025-Q2*) is present in the WheelDetailPanel for a wheel that has a price.
#### Expected verification
Open the WheelDetailPanel for any wheel with a price. Confirm the annotation text is visible without interaction. Verify italic styling.
#### Type
- Manual

---

### AC-005
#### Description
No component loses any existing functionality after EVO-014.
#### Expected verification
Perform a full-page walkthrough: all filters, column show/hide controls, sort, WheelDetailPanel open/close, Navbar links, and CTAs function identically to before. No layout shift, missing data, or broken interactions.
#### Type
- Manual

---

### AC-006
#### Description
Hover transition durations remain perceptually acceptable — not sluggish and not broken.
#### Expected verification
Hover each in-scope interactive element (Navbar links, buttons, table rows). Confirm each transition completes within a perceptibly short time (no transition should feel stuck or invisible). Duration values confirmed in devtools to remain in the 80–400ms range.
#### Type
- Manual

---

## 7. Functional Impacts

### Impacted components

- **Footer** — divider replaced with rule class.
- **RoadmapSection** — divider(s) replaced with rule class.
- **ComparisonTable** — header divider replaced with rule class; row hover transition updated; price column receives annotation sub-text.
- **Navbar** — link hover transitions updated to DS tokens.
- **Buttons (primary)** — hover transitions updated to DS tokens.
- **WheelDetailPanel** — price field receives annotation sub-text.

### Impacted data

- No changes to the wheel dataset structure.
- The annotation text (*indicative price, sourced 2025-Q2*) is a static UI label, not a data field.

### Impacted APIs

- None. This evolution is purely frontend and does not call any external or internal API.

### Impacted permissions / roles

- None. The page is publicly accessible; no authentication or role gating is involved.

---

## 8. Out of Scope

- Structural or layout refactoring of any component.
- New animations (slide-ins, fades, scroll effects, entrance animations) not present today.
- Changes to the WheelDetailPanel beyond the price annotation.
- Replacing rule classes or motion tokens in components not listed in FR-001 and FR-002.
- Real-time price sourcing or dynamic annotation text.
- Any changes to components not explicitly listed in section 7.

---

## 9. Constraints

- EVO-007 (DS token source-of-truth wiring) is a prerequisite and is fully implemented. All DS tokens are already available to the frontend; no additional token wiring is needed.
- The `.t-annotation` class, rule utility classes, and motion tokens are defined in `design-system/colors_and_type.css` and must be consumed as-is — their definitions must not be modified as part of this evolution.
- No component restructuring is permitted; changes are limited to class replacement and annotation sub-text addition.

---

## 10. Test Plan

### Automated tests expected

- None required for this evolution. The changes are purely visual (class substitution and static label addition) with no new logic, state, or data processing. Visual regression testing, if present in the project, may catch regressions automatically.

### Manual tests expected

- Verify each AC-001 through AC-006 as described in section 6.
- Cross-browser spot check: confirm rule classes render hairlines correctly and transitions fire in Chrome, Firefox, and Safari.
- Responsive spot check: confirm the annotation does not overflow price cells on narrow viewports (mobile breakpoint).

### Edge cases

- A wheel with no price value: confirm no annotation appears and no empty label is rendered.
- A component that already uses a rule class (if any): confirm it is left unchanged and does not regress.

### Non-regression

- All filters, sort, and column visibility controls in the ComparisonTable must function identically before and after.
- The WheelDetailPanel must open, display, and close without changes to any field except the price annotation.
- The Navbar must retain full functionality (scroll-linked behavior, links, backdrop blur) after transition token replacement.
