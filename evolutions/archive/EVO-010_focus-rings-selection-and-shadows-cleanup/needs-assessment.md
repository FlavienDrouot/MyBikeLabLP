# Needs Assessment

## 1. General Information

- Evolution ID: EVO-010
- Title: Focus rings, text selection, shadow cleanup
- Author: Flavien Drouot
- Date: 2026-05-26
- Status: Needs Assessment — validated
- Priority: P1–P2

---

## 2. Context

### Current situation

The design system defines precise rules for three visual states:

- **Focus:** `outline: 2px solid var(--brass-8); outline-offset: 2px` — applied globally via `:focus-visible`.
- **Text selection:** `::selection { background: var(--brass-5); color: var(--ink-12); }` — applied globally.
- **Shadows:** reserved exclusively for floating menus (popovers, column selectors). Cards, drawers, and buttons are excluded.

None of these rules are applied in the frontend:
- Interactive elements only have `focus:border-brass-8` (a border color change, not an outline). No `:focus-visible` rule exists.
- No `::selection` rule exists — text selection falls back to the browser's default blue.
- Three components use `box-shadow` or Tailwind shadow utilities outside the DS rules: the mobile filter drawer (`shadow-xl`), the mobile Filters button (`shadow-sm`), and the range slider thumbs (`box-shadow: 0 1px 3px rgba(0,0,0,0.25)`). The ColumnSelector uses a shadow that is permitted (floating menu) but not aligned to the DS value.

### Identified problem

1. Keyboard navigation accessibility is degraded — focused elements are visually indistinct (border change only, no outline ring).
2. Text selection uses the browser default blue instead of the DS brass palette, breaking visual consistency.
3. Four shadow usages deviate from the DS rules: three are non-conformant, one is permitted but uses the wrong value.

### Business motivation

A product that does not follow its own design system is visually inconsistent and undermines credibility with both users and potential brand partners. Keyboard accessibility is a basic expectation for a professional tool and a prerequisite for any future accessibility compliance work.

---

## 3. Business Objective

All interactive elements and text in the application follow the design system's defined visual states for focus, selection, and shadow. The product is keyboard-accessible and visually consistent across all components.

---

## 4. Scope

### Included

- Add a global `:focus-visible` rule following the DS specification (`outline: 2px solid var(--brass-8); outline-offset: 2px`).
- Add a global `::selection` rule following the DS specification (`background: var(--brass-5); color: var(--ink-12)`).
- Remove `shadow-xl` from the mobile filter drawer and replace it with a non-shadow visual separator (border or keyline — functional design deferred to PRD).
- Remove `shadow-sm` from the mobile Filters button.
- Align the ColumnSelector floating menu shadow to `var(--shadow-menu)` (shadow is permitted by DS; only the value is non-conformant).
- Remove `box-shadow` from range slider thumbs and replace it with a non-shadow visual treatment (border or contrast — functional design deferred to PRD).

### Excluded

- Restyling of any component beyond its focus state.
- Mouse focus (`:focus` without `:focus-visible`): only keyboard focus is in scope.
- Any component not listed above. The init.md was produced after a full frontend audit — the shadow occurrences listed are exhaustive.

---

## 5. Constraints

### Business constraints

- Changes must not alter the visual appearance of components outside their interactive states (focus, selection). No side-effect restyling.

### Known technical constraints

- Depends on EVO-007 (design tokens wired as source of truth) — confirmed fully implemented. `var(--brass-8)`, `var(--brass-5)`, `var(--ink-12)`, and `var(--shadow-menu)` are available.
- The three shadow occurrences identified in the audit are exhaustive — no broader scan is required during implementation.

### Regulatory / accessibility constraints

- `:focus-visible` is broadly supported (Chrome 86+, Firefox 85+, Safari 15.4+). No polyfill required.
- Visible keyboard focus indicators are a WCAG 2.1 AA requirement (Success Criterion 2.4.7).

---

## 6. Use Cases

### Nominal case

As a keyboard user navigating the wheel comparator,
I want every focusable element (inputs, buttons, checkboxes, column selector) to show a clear, consistent focus ring,
So that I can track my position in the interface without a mouse.

### Alternative cases

- A user selects text anywhere on the page and sees a brass-colored highlight instead of the browser default.
- A user on mobile opens the filter drawer — the drawer appears visually separated from the background without a drop shadow.

### Known error cases

None. This evolution adds or corrects visual state rules; it does not change interactive behavior.

---

## 7. Acceptance Criteria

- [ ] Keyboard navigation (Tab / Shift+Tab) displays a 2px brass-8 outline with 2px offset around every focusable element across the application.
- [ ] Text selection anywhere on the page produces a brass-5 background and ink-12 foreground text.
- [ ] No occurrence of `shadow-xl`, `shadow-lg`, `shadow-md`, or `shadow-sm` remains in `frontend/src/` except where explicitly justified by the DS (floating menus).
- [ ] The ColumnSelector floating menu uses `var(--shadow-menu)`.
- [ ] Range slider thumbs have no `box-shadow`; they remain visually detectable via border or contrast.
- [ ] No mobile regression on filter drawer open/close behavior.

---

## 8. Open Questions

None. All questions resolved during the Needs Assessment session.

---

## 9. Assumptions

- The three shadow occurrences identified in the audit are exhaustive; no other non-conformant shadows exist in `frontend/src/`.
- EVO-007 is fully implemented; all referenced CSS custom properties are available in the frontend.
- The specific visual replacement for the drawer shadow and slider thumb shadow (border style, keyline approach) is a functional design decision to be resolved in the PRD.
