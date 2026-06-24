# PRD — Product Requirements Document

## 1. General Information

- Evolution ID: EVO-017
- Title: UI polish — comparator and navbar fixes
- Author: Flavien Drouot
- Date: 2026-05-27
- Version: 1.0
- Needs Assessment reference: `evolutions/EVO-017_ui-polish-comparator-navbar/needs-assessment.md`

---

## 2. Functional Objective

After this evolution, the landing page must display each piece of content exactly once, present sibling components with consistent vertical alignment, apply uniform hover interaction feedback across interactive elements, clearly delimit the wheel detail drawer from adjacent content, and render both logo placements using the canonical design system SVG assets.

---

## 3. Target Behavior

### General description

The landing page is the sole surface affected. Five discrete visual inconsistencies are corrected:

1. The Hero stat line ("15 road wheels · 13 filter axes") appears exactly once in the Hero section.
2. The FilterPanel and the ComparisonTable share the same top edge within the MiniComparator section — the presence of the ColumnSelector button above the ComparisonTable does not introduce a vertical offset between the two sibling components.
3. The ColumnSelector button responds to hover with a visible transition, consistent with the interaction model applied to other buttons in the design system.
4. When a wheel detail drawer is open, a clear visual separator marks the boundary between the bottom of the drawer and the card of the next wheel below it.
5. The Navbar logo is rendered using `logo-wordmark.svg` from the design system assets. The Footer logo is rendered using `logo-mark.svg` from the design system assets. Neither logo is produced by hardcoded markup.

No other behavior on the page changes.

---

## 4. Functional Rules

### FR-001 — Hero stat line rendered once

The Hero section must contain exactly one instance of the stat line. Any duplicate instance must be absent from the rendered page.

### FR-002 — FilterPanel and ComparisonTable top-edge alignment

Within the MiniComparator section, the top edge of the FilterPanel and the top edge of the ComparisonTable must be vertically aligned. Any element positioned above the ComparisonTable (including the ColumnSelector button) must not shift the ComparisonTable downward relative to the FilterPanel.

### FR-003 — ColumnSelector button hover transition

The ColumnSelector button must display a visible transition when the pointer enters its hover state. The transition must be consistent with the hover behavior of other buttons governed by the design system.

### FR-004 — Wheel detail drawer bottom separator

When a wheel detail drawer is open, a visual separator must be present between the bottom boundary of the drawer and the top of the card of the next wheel in the list. The separator must use existing design system tokens. No new visual pattern is introduced.

### FR-005 — Navbar logo uses logo-wordmark.svg

The Navbar must render the logo by including `logo-wordmark.svg` from `design-system/assets/`. Hardcoded markup must not be used to produce the Navbar logo.

### FR-006 — Footer logo uses logo-mark.svg

The Footer must render the logo by including `logo-mark.svg` from `design-system/assets/`. Hardcoded markup must not be used to produce the Footer logo.

### FR-007 — Design system token compliance

All fixes introduced by this evolution must use existing design system tokens (`paper-*`, `ink-*`, `brass-*`, `sage-*`, `radius-*`) and must not violate any interaction pattern established by the design system.

---

## 5. Detailed Use Cases

### UC-001 — Visitor loads the landing page

#### Preconditions
- The visitor navigates to the landing page.
- No wheel detail drawer is open.

#### Steps
1. The page loads and renders all sections.
2. The visitor scrolls through the Hero section.
3. The visitor scrolls to the MiniComparator section and observes the FilterPanel and ComparisonTable side by side.
4. The visitor observes the Navbar at the top of the page and the Footer at the bottom.

#### Expected result
- The stat line ("15 road wheels · 13 filter axes") appears exactly once in the Hero section.
- The top edge of the FilterPanel and the top edge of the ComparisonTable are visually aligned.
- The Navbar logo is the `logo-wordmark.svg` asset.
- The Footer logo is the `logo-mark.svg` asset.

#### Error cases
- None identified.

---

### UC-002 — Visitor hovers the ColumnSelector button

#### Preconditions
- The visitor is on the landing page.
- The MiniComparator section is visible.
- The pointer is not over the ColumnSelector button.

#### Steps
1. The visitor moves the pointer onto the ColumnSelector button.

#### Expected result
- A visible hover transition is applied to the ColumnSelector button.
- The transition is consistent with the hover behavior of other design system buttons.

#### Error cases
- None identified.

---

### UC-003 — Visitor opens a wheel detail drawer

#### Preconditions
- The visitor is on the landing page.
- The MiniComparator section is visible.
- At least two wheels are listed in the ComparisonTable.

#### Steps
1. The visitor opens the detail drawer for a wheel that is not the last item in the list.
2. The drawer expands below the corresponding wheel card.

#### Expected result
- A clear visual separator is visible between the bottom boundary of the open drawer and the top of the card of the next wheel.
- The separator uses existing design system tokens.

#### Error cases
- If the open drawer belongs to the last wheel in the list, no separator below the drawer is required (no subsequent wheel card exists).

---

## 6. Acceptance Criteria

### AC-001
#### Description
The Hero stat line appears exactly once on the rendered page.
#### Expected verification
Inspect the rendered DOM of the Hero section: exactly one element contains the text "15 road wheels · 13 filter axes". No second instance exists anywhere on the page.
#### Type
- Automated

---

### AC-002
#### Description
The top edge of the FilterPanel and the top edge of the ComparisonTable are vertically aligned within the MiniComparator section.
#### Expected verification
Measure the computed `top` position (relative to the MiniComparator section container) of the FilterPanel's top edge and the ComparisonTable's top edge. The two values are equal (within 1 px tolerance).
#### Type
- Manual
- Automated

---

### AC-003
#### Description
The ColumnSelector button displays a visible transition on hover.
#### Expected verification
Hover the pointer over the ColumnSelector button and observe a visual change (e.g., background color shift, opacity change) accompanied by a CSS transition. The transition type and duration match those applied to other design system buttons.
#### Type
- Manual

---

### AC-004
#### Description
A visual separator is present at the bottom of an open wheel detail drawer when a subsequent wheel card exists.
#### Expected verification
Open the detail drawer of any wheel that is not the last in the list. Inspect the boundary between the bottom of the drawer and the top of the next wheel card: a visible separator (border or surface change using DS tokens) is rendered.
#### Type
- Manual

---

### AC-005
#### Description
The Navbar logo is rendered from `logo-wordmark.svg`.
#### Expected verification
Inspect the Navbar DOM: the logo element references or embeds `logo-wordmark.svg` from `design-system/assets/`. No hardcoded SVG path data or text-based markup produces the logo instead.
#### Type
- Automated
- Manual

---

### AC-006
#### Description
The Footer logo is rendered from `logo-mark.svg`.
#### Expected verification
Inspect the Footer DOM: the logo element references or embeds `logo-mark.svg` from `design-system/assets/`. No hardcoded SVG path data or text-based markup produces the logo instead.
#### Type
- Automated
- Manual

---

### AC-007
#### Description
No design system token or interaction pattern is violated by any fix introduced in this evolution.
#### Expected verification
Review all modified components: confirm that only `paper-*`, `ink-*`, `brass-*`, `sage-*`, and `radius-*` tokens are used for new or changed visual properties. Confirm no new interaction pattern is introduced that is absent from the design system.
#### Type
- Manual

---

## 7. Functional Impacts

### Impacted components
- Hero section (stat line duplication fix)
- MiniComparator section — layout of FilterPanel and ComparisonTable (vertical alignment fix)
- ColumnSelector button (hover transition fix)
- Wheel detail drawer (bottom separator fix)
- Navbar (logo asset replacement)
- Footer (logo asset replacement)

### Impacted data
- None. The stat values in the Hero are unchanged. Wheel data is unchanged.

### Impacted APIs
- None.

### Impacted permissions / roles
- None.

---

## 8. Out of Scope

- Changes to the stat values displayed in the Hero section.
- Redesign of the Hero layout beyond removing the duplicate stat line.
- Changes to the content or behavior of the wheel detail drawer.
- Any component or section not listed in Section 7.
- Introduction of new design system tokens or visual patterns.

---

## 9. Constraints

- All visual changes must use existing design system tokens (`paper-*`, `ink-*`, `brass-*`, `sage-*`, `radius-*`).
- The detail drawer separator must not introduce a new visual pattern — it must be expressible with existing DS tokens (border or surface token).
- `logo-wordmark.svg` and `logo-mark.svg` are treated as production-ready and self-contained assets; no modification to the SVG files is in scope.

---

## 10. Test Plan

### Automated tests expected
- Assert that exactly one DOM node in the Hero section contains the stat line text.
- Assert that the Navbar logo element references `logo-wordmark.svg`.
- Assert that the Footer logo element references `logo-mark.svg`.
- Assert that the computed top offset of the FilterPanel equals the computed top offset of the ComparisonTable (within 1 px tolerance).

### Manual tests expected
- Hover the ColumnSelector button and confirm a visible CSS transition occurs, consistent with other DS buttons.
- Open a wheel detail drawer (non-last item) and confirm a visible separator is present between the drawer bottom and the next wheel card.
- Visual inspection of the Navbar and Footer logos at standard viewport widths to confirm correct rendering of SVG assets.

### Edge cases
- Open the detail drawer for the last wheel in the list: no separator below the drawer is expected (no subsequent card exists).
- Verify the Hero stat line is absent from any section other than the Hero.
- Verify the ColumnSelector button hover transition does not trigger on touch devices (no hover state equivalent expected on touch).

### Non-regression
- All existing filter, sort, and column-visibility interactions in the MiniComparator must continue to function correctly after the vertical alignment fix.
- The Navbar scroll behavior and backdrop blur must be unaffected by the logo asset replacement.
- The Footer layout must be unaffected by the logo asset replacement beyond the logo element itself.
