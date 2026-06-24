# PRD — Product Requirements Document

## 1. General Information

- Evolution ID: EVO-020
- Title: Style tokens — UI guidelines compliance
- Author: Flavien Drouot
- Date: 2026-05-27
- Version: 1.0
- Needs Assessment reference: `evolutions/EVO-020_style-tokens-compliance/needs-assessment.md`

---

## 2. Functional Objective

After this evolution, the landing page fully complies with the UI guidelines on four points: the page height fills the dynamic viewport correctly on mobile browsers, the multiselect option list carries no border radius, all disabled filter controls render at 40% opacity, and motion animations are suppressed for users who have enabled reduced motion in their operating system.

---

## 3. Target Behavior

### General description

The landing page and the filter panel must behave as follows after the evolution:

- **Page height (mobile):** The page wrapper fills the full visible viewport, including when the browser address bar appears or disappears. No layout jump occurs on iOS Safari or any other mobile browser.
- **Option list radius:** The dropdown list of options in every multi-select filter has no border radius. Its appearance is flat and consistent with the design system's square aesthetic.
- **Disabled state opacity:** When a filter control is in a disabled state, it is rendered at 40% opacity — not 50%.
- **Reduced motion:** On any platform where the user has enabled the "reduce motion" or equivalent accessibility setting, position and movement animations are suppressed globally. Color transitions and opacity transitions are not suppressed.

---

## 4. Functional Rules

### FR-001 — Dynamic viewport height on the page wrapper

The outermost height constraint on the landing page must resolve to `100dvh` (dynamic viewport height). The page must not use `100vh` as its minimum height.

### FR-002 — No border radius on multiselect option lists

The container that displays the list of selectable options in multi-select filter controls must have no border radius (`border-radius: 0`). The radius rule `rounded-lg` (or any other positive-radius utility) is not permitted on this element.

### FR-003 — Correct border color on multiselect option lists

The multiselect option list must use the `border-ink-4` color token for its border. The `border-ink-3` token is not permitted on this element.

### FR-004 — Disabled state opacity at 0.4

Any filter control rendered in a disabled state must display at 40% opacity (`opacity: 0.4`). The value 50% (`opacity: 0.5`) must not be used for disabled state.

### FR-005 — Global reduced-motion accessibility rule

A CSS media rule responding to `prefers-reduced-motion: reduce` must exist in the global stylesheet. This rule must reduce transition duration and animation duration to a near-zero value (sufficient to stop perceptible motion) for all elements.

### FR-006 — Color and opacity transitions preserved under reduced motion

The reduced-motion rule must not suppress color or opacity transitions. Only position and movement animations are affected.

---

## 5. Detailed Use Cases

### UC-001 — Mobile visitor on iOS Safari with dynamic address bar

#### Preconditions
- The user opens the landing page on an iPhone or iPad running Safari.
- The browser address bar is visible and may show or hide as the user scrolls.

#### Steps
1. The user loads the landing page.
2. The user scrolls down; the address bar collapses.
3. The user scrolls back up; the address bar reappears.

#### Expected result
- The page wrapper always fills exactly the visible viewport height.
- No layout jump, overflow, or gap appears at the bottom of the page when the address bar changes state.

#### Error cases
- None defined.

---

### UC-002 — User interacts with a multi-select filter

#### Preconditions
- The user is on the landing page with the filter panel visible.
- A multi-select filter (Brand, Diameter, Rim material, Hub brand, Hub model, Spokes brand, Spokes model, or Spoke material) is present.

#### Steps
1. The user opens the option list of a multi-select filter.
2. The option list is displayed.

#### Expected result
- The option list container has no visible border radius (straight corners).
- The border color of the option list matches the `border-ink-4` design token.

#### Error cases
- None defined.

---

### UC-003 — User views a disabled filter control

#### Preconditions
- The user is on the landing page with the filter panel visible.
- At least one filter control is in a disabled state (e.g., a filter that is not applicable to the current dataset view).

#### Steps
1. The user observes the disabled filter control.

#### Expected result
- The disabled control is visually dimmed at 40% opacity.
- It is not dimmed at 50% opacity.

#### Error cases
- None defined.

---

### UC-004 — User with reduced motion enabled visits the landing page

#### Preconditions
- The user's operating system has the "reduce motion" (or equivalent) accessibility setting enabled.
- The user opens the landing page.

#### Steps
1. Any animated element (transition, keyframe animation, scroll animation) would normally play.

#### Expected result
- Position and movement animations do not play or are imperceptible.
- Color changes and opacity changes that are part of interactions (hover, focus, state changes) continue to function normally.

#### Error cases
- None defined.

---

## 6. Acceptance Criteria

### AC-001
#### Description
The page wrapper uses `min-h-[100dvh]` and does not use `min-h-screen`.
#### Expected verification
Inspect the root element of `Landing.jsx`. The class list must include `min-h-[100dvh]` and must not include `min-h-screen`.
#### Type
- Manual

---

### AC-002
#### Description
The multiselect option list in `FilterPanel` has no border radius.
#### Expected verification
Inspect the computed styles of the option list container on any multi-select filter. The `border-radius` must resolve to `0px`. The class `rounded-lg` (or any positive-radius variant) must not be present on the element.
#### Type
- Manual

---

### AC-003
#### Description
The multiselect option list in `FilterPanel` uses `border-ink-4` as its border color.
#### Expected verification
Inspect the class list of the option list container. The class `border-ink-4` must be present. The class `border-ink-3` must not be present.
#### Type
- Manual

---

### AC-004
#### Description
The Tailwind configuration exposes an `opacity-40` utility class.
#### Expected verification
In `tailwind.config.js`, the `extend.opacity` section must include an entry mapping the key `'40'` to the value `'0.4'`. The class `opacity-40` must be applicable in Tailwind's JIT output.
#### Type
- Manual

---

### AC-005
#### Description
All four disabled filter control containers in `FilterPanel` use `opacity-40`.
#### Expected verification
Inspect the four locations in `FilterPanel.jsx` (lines 96, 271, 351, and 397 in the pre-change file). Each must use `opacity-40`. None must use `opacity-50`.
#### Type
- Manual

---

### AC-006
#### Description
A `prefers-reduced-motion: reduce` media query exists in the global stylesheet and suppresses transition and animation durations.
#### Expected verification
Open `src/index.css`. A `@media (prefers-reduced-motion: reduce)` block must be present. Inside that block, all elements (`*`, `*::before`, `*::after`) must have `transition-duration` and `animation-duration` set to `0.01ms` or an equivalent near-zero value.
#### Type
- Manual

---

### AC-007
#### Description
Color and opacity transitions remain functional when reduced motion is enabled.
#### Expected verification
With the OS reduced-motion setting active, interact with hover states and toggle controls on the landing page. Color and opacity changes must still be visible. No purely decorative movement or position animation must be perceptible.
#### Type
- Manual

---

### AC-008
#### Description
No visual regression in non-reduced-motion environments or on desktop.
#### Expected verification
Browse the full landing page on desktop with reduced motion disabled. All sections (Hero, Wheel Comparator, Roadmap, Benefits, Partnership, Footer) must render correctly with no layout or visual anomaly introduced by this evolution.
#### Type
- Manual

---

## 7. Functional Impacts

### Impacted components
- `src/pages/Landing.jsx` — class name change on the page wrapper element.
- `src/components/MiniComparator/FilterPanel.jsx` — class name changes on the multiselect option list container (1 location) and on the four disabled filter control containers.
- `tailwind.config.js` — addition of the `opacity-40` entry under `extend.opacity`.
- `src/index.css` — addition of the global `prefers-reduced-motion` media rule.

### Impacted data
- None.

### Impacted APIs
- None.

### Impacted permissions / roles
- None.

---

## 8. Out of Scope

- Changes to any component JSX beyond the class name substitutions described in this PRD.
- Changes to the design token CSS file (`design-tokens.css`).
- New motion tokens or easing variables.
- Hover behavior changes (deferred to EVO-021).
- Any filter logic, data model, or Redux state changes.

---

## 9. Constraints

- The `opacity-40` Tailwind extension must not conflict with any existing opacity utility already present in `tailwind.config.js`.
- The `prefers-reduced-motion` rule must use `0.01ms` (not `0`) for durations to maintain compatibility with CSS animation libraries that check for a non-zero duration value.
- `min-h-[100dvh]` must be used as a Tailwind arbitrary value; no custom token addition is required.
- The fix is limited to class name substitutions and additive config/CSS entries — no structural JSX changes are permitted.

---

## 10. Test Plan

### Automated tests expected
- None required for this evolution (all changes are CSS-class-level substitutions with no logic change).

### Manual tests expected
- Verify AC-001 through AC-008 as described in Section 6.
- Test on a physical iOS device or iOS Safari simulator to confirm the viewport height fix.
- Test with OS reduced-motion enabled (macOS: System Settings → Accessibility → Display → Reduce Motion; iOS: Settings → Accessibility → Motion → Reduce Motion).

### Edge cases
- Verify the page layout on very small viewports (320 px wide) to confirm `min-h-[100dvh]` does not break narrow layouts.
- Verify that all thirteen filter types render correctly with no opacity regression on enabled controls.

### Non-regression
- All five filter types (multi-select, range, tri-state) must function as before on desktop and mobile.
- The Tailwind build must produce no warnings or errors after the `extend.opacity` addition.
- The landing page must render correctly in all six sections on desktop Chrome, Firefox, and Safari.
