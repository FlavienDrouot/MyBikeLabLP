# PRD — Product Requirements Document

## 1. General Information

- Evolution ID: EVO-010
- Title: Focus rings, text selection, and shadow cleanup
- Author: Flavien Drouot
- Date: 2026-05-26
- Version: 1.0
- Needs Assessment reference: `evolutions/EVO-010_focus-rings-selection-and-shadows-cleanup/needs-assessment.md`

---

## 2. Functional Objective

After this evolution, all interactive elements in the application display a consistent brass-colored focus ring during keyboard navigation, text selection produces a brass-colored highlight across the entire application, and every shadow usage conforms to the design system rules — either removed, replaced with a non-shadow treatment, or aligned to the correct DS token.

---

## 3. Target Behavior

### General description

The application currently deviates from its own design system in three distinct visual state categories: focus rings, text selection color, and shadow usage. This evolution brings the application into full conformance for all three.

**Focus:** Every focusable element (buttons, inputs, checkboxes, range sliders, column selector trigger) must display a 2px solid brass-8 outline with a 2px offset when reached via keyboard. This ring must only appear on keyboard interaction, not on mouse click. No element may substitute a border color change for this outline.

**Text selection:** Anywhere on the page — in headings, labels, table cells, or any other text — selecting text must produce a brass-5 background with ink-12 foreground text. No element may fall back to the browser's default blue selection.

**Shadows:** The application must contain no shadow utilities or `box-shadow` declarations outside the design system's permitted usage (floating menus only). Four specific deviations are addressed:
1. The mobile filter drawer must use a non-shadow visual separator instead of a drop shadow.
2. The mobile Filters button must have no shadow.
3. The ColumnSelector floating menu must use the `var(--shadow-menu)` token.
4. Range slider thumbs must use no shadow; they must remain visually detectable through border or contrast.

No other component appearance changes. Components must look identical to their current state outside of focus, selection, and the four listed shadow treatments.

---

## 4. Functional Rules

### FR-001 — Global keyboard focus ring

Every focusable element in the application must display a focus indicator that conforms to the design system specification when it receives keyboard focus. The focus indicator must be a 2px solid outline using the brass-8 color token, with a 2px offset between the outline and the element boundary. This rule applies to all interactive element types without exception: buttons, inputs, checkboxes, dropdowns, range slider thumbs, column selector trigger, and any other focusable element present in the application.

### FR-002 — Keyboard-only focus visibility

The focus ring described in FR-001 must only appear when focus is received via keyboard interaction (Tab, Shift+Tab, arrow keys). It must not appear when an element receives focus via mouse click or touch. No other behavior change is permitted.

### FR-003 — Global text selection styling

Any text selected by the user anywhere on the page must display a brass-5 background color and ink-12 foreground text color. This rule applies globally and uniformly — no element or section of the page is excluded.

### FR-004 — Shadow removal from the mobile filter drawer

The mobile filter drawer must not use any drop shadow to separate itself from the underlying content. It must use a non-shadow visual treatment — a keyline (1px solid border using an appropriate DS border token) on its leading edge — to convey its position above the page content. The drawer's open/close behavior and overlay behavior are not affected.

### FR-005 — Shadow removal from the mobile Filters button

The mobile Filters button must have no shadow of any kind. Its visual appearance is otherwise unchanged.

### FR-006 — ColumnSelector floating menu shadow alignment

The ColumnSelector floating menu (column visibility popover) must use `var(--shadow-menu)` as its box-shadow. Any previously hard-coded shadow value is replaced by this token. The menu's positioning, trigger behavior, and content are not affected.

### FR-007 — Shadow removal from range slider thumbs

Range slider thumbs must have no `box-shadow`. Thumbs must remain clearly visually distinct from the slider track through the use of a border (using an appropriate DS border or color token) or sufficient color contrast. The slider's functional behavior (dragging, value output) is not affected.

### FR-008 — No residual non-conformant shadows

After the evolution, no Tailwind shadow utility class (`shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`) and no `box-shadow` CSS declaration may remain in the frontend source except on floating menu components explicitly permitted by the design system.

---

## 5. Detailed Use Cases

### UC-001 — Keyboard user navigates the comparator

#### Preconditions
- The user has loaded the MyBikeLab application in a browser.
- The user is navigating exclusively with the keyboard (Tab / Shift+Tab / arrow keys).

#### Steps
1. The user presses Tab to move focus to the first interactive element on the page.
2. The user continues pressing Tab to move through all interactive elements: navigation links (if any), filter inputs, filter checkboxes, range slider thumbs, the Filters button (mobile), the ColumnSelector trigger, and any other focusable element.
3. The user presses Shift+Tab to move focus backward through the same sequence.

#### Expected result
- Each focusable element displays a 2px brass-8 outline with 2px offset at the moment it receives focus.
- The outline disappears cleanly when focus moves to the next element.
- No element shows only a border color change as its focus indicator.
- No element is unreachable or displays a visually absent focus state.

#### Error cases
- None. This use case is purely observational — no data is changed.

---

### UC-002 — User selects text on the page

#### Preconditions
- The user has loaded the MyBikeLab application in a browser.

#### Steps
1. The user clicks and drags to select a portion of text anywhere on the page (heading, label, table cell content, filter name, etc.).

#### Expected result
- The selected text displays a brass-5 background.
- The selected text characters display in ink-12 color.
- No element on the page falls back to the browser's default blue selection highlight.

#### Error cases
- None.

---

### UC-003 — Mobile user opens and closes the filter drawer

#### Preconditions
- The user is accessing the application on a mobile viewport.
- The filter drawer is closed.

#### Steps
1. The user taps the Filters button to open the filter drawer.
2. The user observes the drawer in its open state.
3. The user closes the drawer by tapping the close control or tapping outside.

#### Expected result
- The Filters button has no visible shadow.
- The filter drawer, when open, displays a keyline (border) on its leading edge to separate it from the page content. No drop shadow is visible.
- The drawer opens and closes with its standard animated behavior unchanged.
- Content behind the drawer (overlay, scroll lock) behaves identically to before.

#### Error cases
- None. This evolution does not change interactive behavior.

---

### UC-004 — User opens the ColumnSelector

#### Preconditions
- The user has loaded the application.
- The wheel comparator table is visible.

#### Steps
1. The user clicks or activates the ColumnSelector trigger button.
2. The ColumnSelector floating menu appears.

#### Expected result
- The floating menu displays a shadow that matches the `var(--shadow-menu)` token value.
- The menu's position, content, and behavior are unchanged.

#### Error cases
- None.

---

### UC-005 — User interacts with a range slider

#### Preconditions
- The user has loaded the application.
- At least one range filter (Weight, Price, Rim depth, Rim width) is visible.

#### Steps
1. The user observes a range slider in its resting state.
2. The user clicks or touches a slider thumb and drags it.

#### Expected result
- The slider thumb has no drop shadow in either resting or active state.
- The slider thumb is visually distinct from the track through its border or color contrast.
- Dragging the thumb updates the filter value as expected.

#### Error cases
- None.

---

## 6. Acceptance Criteria

### AC-001
#### Description
Tabbing through all interactive elements on the page displays a 2px solid brass-8 outline with 2px offset on every focused element.
#### Expected verification
Manual test: open the application, press Tab repeatedly to cycle through all interactive elements. Inspect each focused element — the outline must match `2px solid var(--brass-8)` with `outline-offset: 2px`. No element may substitute a border color change.
#### Type
- Manual

---

### AC-002
#### Description
The focus ring does not appear when an element is clicked with a mouse.
#### Expected verification
Manual test: click each interactive element with a mouse. No focus ring outline must be visible after click. The element may still display its standard hover or active styles.
#### Type
- Manual

---

### AC-003
#### Description
Selecting text anywhere on the page produces a brass-5 background and ink-12 text color.
#### Expected verification
Manual test: select text in at least five different locations across the page (heading, filter label, table cell, comparator column header, footer if applicable). All selections must display the brass-5 highlight. No blue browser-default highlight must be visible anywhere.
#### Type
- Manual

---

### AC-004
#### Description
The mobile filter drawer has no drop shadow; it has a keyline border on its leading edge.
#### Expected verification
Manual test (mobile viewport or browser DevTools responsive mode): open the filter drawer. Inspect visually — no shadow must be visible. A 1px border must be present on the leading edge. Open/close the drawer five times to confirm behavior is unaffected.
#### Type
- Manual

---

### AC-005
#### Description
The mobile Filters button has no shadow.
#### Expected verification
Manual test (mobile viewport): observe the Filters button in its resting and pressed states. No shadow must be visible.
#### Type
- Manual

---

### AC-006
#### Description
The ColumnSelector floating menu uses `var(--shadow-menu)`.
#### Expected verification
Manual test: open the ColumnSelector. Inspect the menu element in browser DevTools — `box-shadow` must resolve to the value of `var(--shadow-menu)`. No hard-coded shadow value may be present.
#### Type
- Manual

---

### AC-007
#### Description
Range slider thumbs have no `box-shadow` and remain visually detectable.
#### Expected verification
Manual test: observe range slider thumbs in their resting and active states. No shadow must be visible. The thumb must be clearly distinguishable from the slider track by border or contrast alone.
#### Type
- Manual

---

### AC-008
#### Description
No non-conformant Tailwind shadow utility or `box-shadow` declaration remains in `frontend/src/`.
#### Expected verification
Code audit: search `frontend/src/` for `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`, and `box-shadow`. Any result found must be on a floating menu component and must be intentional per the DS rules. Zero results on non-floating-menu components.
#### Type
- Manual (code review)

---

### AC-009
#### Description
No mobile regression on the filter drawer open/close interaction.
#### Expected verification
Manual test (mobile viewport): open and close the filter drawer multiple times. Verify scroll lock activates/deactivates correctly, the overlay behaves as before, and no layout shift occurs.
#### Type
- Manual

---

## 7. Functional Impacts

### Impacted components

- **Global stylesheet / CSS entry point**: receives the new `:focus-visible` and `::selection` rules.
- **Mobile filter drawer**: shadow removed, border added on leading edge.
- **Mobile Filters button**: shadow removed.
- **ColumnSelector**: shadow value aligned to `var(--shadow-menu)`.
- **Range slider thumbs**: `box-shadow` removed, border or contrast treatment added.

### Impacted data

None. This evolution is purely visual — no data model, state, or filter logic is changed.

### Impacted APIs

None.

### Impacted permissions / roles

None.

---

## 8. Out of Scope

- Restyling of any component beyond its focus state, selection state, or the listed shadow treatments.
- Mouse focus (`:focus` without `:focus-visible`) — only keyboard focus is in scope.
- Any shadow occurrence not listed in the Needs Assessment (the audit is considered exhaustive).
- New interactive behaviors, animations, or transitions.
- Any component not explicitly named in this PRD.
- Accessibility compliance certification or WCAG audit beyond the focus ring improvement.

---

## 9. Constraints

- Changes must not alter the visual appearance of any component outside its focus, selection, or shadow state. No side-effect restyling is permitted.
- `var(--brass-8)`, `var(--brass-5)`, `var(--ink-12)`, and `var(--shadow-menu)` are available as CSS custom properties (confirmed via EVO-007).
- `:focus-visible` is used instead of `:focus` — no polyfill is required for the supported browser baseline.
- The four shadow deviations identified in the Needs Assessment are exhaustive; no broader shadow audit is required.

---

## 10. Test Plan

### Automated tests expected

None for this evolution. All acceptance criteria are visual and require human judgment to verify correctly.

### Manual tests expected

- Keyboard navigation through every interactive element to verify focus ring (AC-001).
- Mouse click on interactive elements to verify absence of mouse focus ring (AC-002).
- Text selection in at least five distinct locations across the page (AC-003).
- Filter drawer open/close on mobile viewport — visual and behavioral (AC-004, AC-009).
- Filters button inspection on mobile viewport (AC-005).
- ColumnSelector shadow inspection in DevTools (AC-006).
- Range slider thumb visual inspection in resting and active states (AC-007).

### Edge cases

- A focusable element that is visually hidden or disabled — verify the focus ring does not break layout in these states.
- Selecting text that spans multiple element types (e.g., a label and a table cell) — verify consistent selection color across the span.
- The filter drawer on a very narrow viewport — verify the keyline border does not affect layout width.

### Non-regression

- Full interaction smoke test of the wheel comparator on both desktop and mobile viewports after the changes: filter by at least two criteria, sort the table, toggle a column via ColumnSelector, adjust a range slider, open and close the filter drawer. All interactions must behave identically to their pre-evolution behavior.
