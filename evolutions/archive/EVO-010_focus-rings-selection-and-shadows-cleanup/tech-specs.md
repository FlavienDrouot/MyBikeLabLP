# Technical Specifications

## 1. General Information

- Evolution ID: EVO-010
- PRD reference: `evolutions/EVO-010_focus-rings-selection-and-shadows-cleanup/prd.md`
- Author: Flavien Drouot
- Date: 2026-05-26

---

## 2. Technical Context

### Technical objective

Bring the application into full visual conformance with the design system for three categories: keyboard focus rings, text selection color, and shadow usage. No state, data, or behavior changes are included — this is exclusively a CSS and JSX className update.

### Affected architecture

- **Global stylesheet layer** (`frontend/src/index.css`): receives `::selection` and `:focus-visible` global rules via a new `@layer base` block.
- **Component CSS module** (`frontend/src/components/MiniComparator/FilterPanel.module.css`): range slider thumb `box-shadow` declarations removed; border added to ensure contrast.
- **JSX components** (`MiniComparator.jsx`, `ColumnSelector.jsx`): Tailwind className strings updated to remove or replace non-conformant shadow utilities and hard-coded focus helpers.

### Impacted modules

- `frontend/src/index.css`
- `frontend/src/components/MiniComparator/MiniComparator.jsx`
- `frontend/src/components/MiniComparator/ColumnSelector.jsx`
- `frontend/src/components/MiniComparator/FilterPanel.module.css`

---

## 3. Technical Constraints

- `var(--brass-8)`, `var(--brass-5)`, `var(--ink-12)`, `var(--shadow-menu)` are defined in `frontend/src/design-tokens.css` (verbatim copy of `design-system/colors_and_type.css`) and are available globally through the Tailwind setup in `index.css`.
- `:focus-visible` is used instead of `:focus`; no polyfill is required.
- The design system already contains the canonical rules at lines 402–412 of `design-system/colors_and_type.css`. These rules must be reproduced in the app's own `index.css`, not imported from the design-system folder directly.
- All shadow changes are limited to the four deviations identified in the PRD and the Needs Assessment. No broader audit is in scope.
- The Tailwind `shadow-*` utility that must be removed from `MiniComparator.jsx` (drawer: `shadow-xl`, reset class: `shadow-none`) requires careful handling: `shadow-none` is the correct reset at `lg:` breakpoint and must be preserved; only `shadow-xl` on the mobile drawer element is removed.
- Firefox uses `::-moz-range-thumb`; Chrome/Safari use `::-webkit-slider-thumb`. Both pseudo-element blocks in `FilterPanel.module.css` must be updated.
- No new component files or abstractions are created. All changes are made inside existing files.

---

## 4. Architecture Decisions

### AD-001 — Global rules placed in `index.css` via `@layer base`, not inline per-component

#### Description
The `::selection` rule and the `:focus-visible` override are placed in a dedicated `@layer base` block inside `frontend/src/index.css`, alongside the existing `html` and `body` rules.

#### Motivation
Global pseudo-element rules (`::selection`, `:focus-visible`) must have application-wide scope. Placing them in `@layer base` puts them below Tailwind's reset layer and above component utilities, which is the correct cascade position. Co-locating them in `index.css` matches the pattern already used for `html` and `body` global rules.

#### Rejected alternatives
- Placing rules in `design-tokens.css`: rejected because that file is a verbatim mirror of the design-system file and must not be modified directly.
- Adding rules per-component (e.g., a CSS module per element type): rejected because `::selection` and `:focus-visible` must be global; per-component scoping would leave gaps.

---

### AD-002 — `focus:outline-none` and `focus:ring-*` helpers removed from JSX; global rule is sufficient

#### Description
Several elements in `MiniComparator.jsx`, `FilterPanel.jsx`, and `ColumnSelector.jsx` carry explicit `focus:outline-none`, `focus:ring-2`, `focus:ring-brass-8`, and `focus:ring-offset-1` Tailwind classes. These are removed. The global `:focus-visible` rule in `index.css` provides the correct behavior for all elements.

#### Motivation
The global rule covers every focusable element uniformly, including any added in the future. Keeping per-element overrides creates a second, parallel focus management system that is harder to audit and can conflict with the global rule (e.g., `focus:outline-none` would suppress the global `:focus-visible` outline for mouse-initiated focus events, since both `:focus` and `:focus-visible` match keyboard events but only `:focus` matches mouse clicks — `focus:outline-none` in Tailwind targets `:focus`, not `:focus-visible`, so it would mask the wrong things in certain cascade situations).

#### Rejected alternatives
- Keeping per-element ring classes and removing the global rule: rejected because it requires every future element to remember to add the classes manually, which is error-prone and contradicts the DS's intent of a single definition.

---

### AD-003 — Mobile filter drawer shadow replaced with a left-edge border via inline Tailwind class

#### Description
The `shadow-xl` class on the filter drawer `<div>` in `MiniComparator.jsx` is removed. A `border-l border-ink-4` class is added on the same element, scoped to mobile only (i.e., removed at `lg:` breakpoint via `lg:border-l-0` or by restructuring the mobile-only classes). The existing `lg:shadow-none` reset class is also removed since shadow is no longer applied.

#### Motivation
The PRD requires a keyline on the leading edge (left side for a left-anchored drawer) with a DS border token. `border-ink-4` maps to `var(--ink-4)`, which is the standard hairline/divider token. Tailwind utility classes keep the change co-located with the existing mobile styling in the same className string.

#### Rejected alternatives
- Using `var(--shadow-keyline)` (inset shadow) from the DS as the separator: rejected because the PRD explicitly requires a border, not a shadow. Using an inset shadow would still be a `box-shadow` declaration and would not conform to FR-004's requirement that no drop shadow be used.
- Adding a CSS module class for the drawer separator: rejected because the element already uses Tailwind utilities and the change is a simple class addition/removal.

---

### AD-004 — ColumnSelector floating menu: replace `shadow-sm` with the `shadow-menu` Tailwind alias

#### Description
In `ColumnSelector.jsx`, the floating menu `<div>` currently carries `shadow-sm`. This is replaced with the Tailwind alias for `var(--shadow-menu)`. The project's Tailwind config must expose `shadow-menu` as a named shadow utility for this to work without an inline `style` prop.

#### Motivation
Using a Tailwind utility class keeps the codebase consistent (no mixing of Tailwind class-driven styling and `style` prop overrides). The `shadow-menu` token is already defined in the design system.

#### Rejected alternatives
- Using `style={{ boxShadow: 'var(--shadow-menu)' }}` inline prop: functionally correct but inconsistent with the Tailwind-first pattern used throughout the component. Avoided unless the Tailwind config does not already expose `shadow-menu`.
- Note: if `shadow-menu` is not yet defined as a Tailwind utility in `tailwind.config.js`, TASK-006 adds it. This decision depends on that check (see spec-notes).

---

### AD-005 — Range slider thumbs: remove `box-shadow`, rely on existing border for contrast

#### Description
In `FilterPanel.module.css`, the `box-shadow` declaration is removed from both `::-webkit-slider-thumb` and `::-moz-range-thumb`. The existing `border: 2px solid #fbfaf6` (paper-0) on the webkit thumb already provides the visual contrast ring. The Firefox thumb currently has `border: none` — this is updated to `border: 2px solid var(--paper-0)` to match.

#### Motivation
The webkit thumb already has a 2px paper-0 border that creates a visible ring between the brass thumb and the track background. Removing the shadow is sufficient for webkit; Firefox needs a matching border added. Using the CSS custom property `var(--paper-0)` instead of the hard-coded hex value makes the declaration consistent with the existing DS token convention.

#### Rejected alternatives
- Replacing the shadow with a `border` of a different DS color (e.g., `var(--ink-4)`): not necessary — the paper-0 ring already provides clear separation from the brass-8 track range bar.
- Keeping the hard-coded hex `#fbfaf6` for Firefox: functionally equivalent, but inconsistent with the token-first approach. Using `var(--paper-0)` is preferred.

---

## 5. Task Breakdown

---

# TASK-001 — Add global `::selection` and `:focus-visible` rules to `index.css`

## Objective

Add the two global CSS rules — `::selection` and `:focus-visible` — to `frontend/src/index.css` inside an `@layer base` block, so that text selection and keyboard focus rings match the design system across the entire application.

## Required context

- `frontend/src/index.css` currently contains one `@layer base` block (lines 7–16) with `html` and `body` rules. The new rules are appended to this same block.
- The design system already defines the canonical form of these rules at lines 402–412 of `design-system/colors_and_type.css`:
  ```css
  ::selection {
    background: var(--brass-5);
    color: var(--ink-12);
  }
  :focus-visible {
    outline: 2px solid var(--brass-8);
    outline-offset: 2px;
  }
  ```
- `var(--brass-5)`, `var(--ink-12)`, `var(--brass-8)` are available globally via `frontend/src/design-tokens.css`, which is imported at the top of `index.css`.
- Tailwind's `@layer base` is the correct cascade layer for global element defaults. Rules added here are overridable by component utilities if needed.

## Potentially impacted files

- `frontend/src/index.css`

## Inputs

- Existing `@layer base` block in `index.css`.
- CSS token values: `var(--brass-5)`, `var(--ink-12)`, `var(--brass-8)`.

## Expected outputs

- `index.css` `@layer base` block extended with `::selection` and `:focus-visible` rules.
- No other lines in the file are modified.

## Constraints

- Do not add the rules outside of `@layer base` — the cascade layer is significant.
- Do not modify `design-tokens.css` or `design-system/colors_and_type.css`.
- The `::selection` rule must target the standard pseudo-element only (no `-moz-selection` prefix — it is deprecated and unnecessary for the supported browser baseline).
- The `:focus-visible` rule must not include any shadow (`--shadow-focus` from the DS is not used here — the PRD specifies a plain outline only).

## Dependencies

- None.

## Validation criteria

- [ ] `::selection` rule present inside `@layer base` in `index.css` with `background: var(--brass-5)` and `color: var(--ink-12)`.
- [ ] `:focus-visible` rule present inside `@layer base` in `index.css` with `outline: 2px solid var(--brass-8)` and `outline-offset: 2px`.
- [ ] No other lines in `index.css` are modified.
- [ ] Manual test (AC-003): selecting text in at least five locations across the page shows a brass-5 highlight with ink-12 text. No browser blue default visible.
- [ ] Manual test (AC-001): tabbing through all interactive elements shows a 2px brass-8 outline with 2px offset on each focused element.
- [ ] Manual test (AC-002): clicking any element with a mouse does not display the focus ring.

## Tests to implement

### Unit
- None (visual rule, no unit-testable logic).

### Integration
- None.

---

# TASK-002 — Remove per-element focus helpers from `MiniComparator.jsx`

## Objective

Remove the explicit focus-related Tailwind utility classes from the mobile Filters button and the mobile drawer close button in `MiniComparator.jsx`, so that these elements rely exclusively on the global `:focus-visible` rule from TASK-001.

## Required context

- `frontend/src/components/MiniComparator/MiniComparator.jsx`:
  - **Mobile Filters button** (line 43): className contains `focus:outline-none focus:ring-2 focus:ring-brass-8 focus:ring-offset-1`. All four of these classes are removed.
  - **Mobile drawer close button** (line 79): className contains `focus:outline-none focus:ring-2 focus:ring-brass-8`. All three of these classes are removed.
- After removal, both elements receive focus styling from the global `:focus-visible` rule added in TASK-001.
- The Filters button also carries `shadow-sm` — this is addressed in TASK-003, not here.

## Potentially impacted files

- `frontend/src/components/MiniComparator/MiniComparator.jsx`

## Inputs

- Line 43 className string (Filters button).
- Line 79 className string (drawer close button).

## Expected outputs

- Line 43: `focus:outline-none focus:ring-2 focus:ring-brass-8 focus:ring-offset-1` removed from the className.
- Line 79: `focus:outline-none focus:ring-2 focus:ring-brass-8` removed from the className.
- All other attributes and className tokens on both elements are unchanged.

## Constraints

- Do not touch any other element in the file in this task. Shadow changes to the Filters button and drawer are handled in TASK-003.
- Do not remove non-focus-related classes.

## Dependencies

- TASK-001 must be complete before this task is validated (the global rule must exist before the per-element fallbacks are removed).

## Validation criteria

- [ ] Filters button className does not contain `focus:outline-none`, `focus:ring-2`, `focus:ring-brass-8`, or `focus:ring-offset-1`.
- [ ] Close button className does not contain `focus:outline-none`, `focus:ring-2`, or `focus:ring-brass-8`.
- [ ] Both buttons display the global `:focus-visible` outline when reached via keyboard.
- [ ] No other className tokens on either element are changed.

## Tests to implement

### Unit
- None.

### Integration
- None.

---

# TASK-003 — Remove shadows from the mobile Filters button and filter drawer in `MiniComparator.jsx`

## Objective

Remove the `shadow-sm` class from the mobile Filters button and remove `shadow-xl` / `lg:shadow-none` from the filter drawer `<div>`. Add a left-side border keyline to the drawer for mobile viewports to replace the shadow separator, conforming to FR-004 and FR-005.

## Required context

- `frontend/src/components/MiniComparator/MiniComparator.jsx`:
  - **Mobile Filters button** (line 43): className contains `shadow-sm`. This class is removed entirely.
  - **Filter drawer div** (line 68–70): className contains `shadow-xl` and `lg:shadow-none`. Both are removed. A `border-r border-ink-4 lg:border-r-0` group of classes is added to provide the right-edge keyline separator on mobile while removing the border at the desktop breakpoint (where the drawer becomes a sidebar in normal flow and the border is not needed).
- The drawer div currently has: `fixed inset-y-0 left-0 z-50 flex w-80 max-w-[85vw] flex-col overflow-y-auto bg-paper-2 shadow-xl transition-transform duration-200 ease-out` plus breakpoint resets. The full updated className after this task is shown in the Expected outputs section.

## Potentially impacted files

- `frontend/src/components/MiniComparator/MiniComparator.jsx`

## Inputs

- Filters button className (line 43): remove `shadow-sm`.
- Filter drawer div className (lines 68–70): remove `shadow-xl` and `lg:shadow-none`; add `border-l border-ink-4 lg:border-l-0`.

## Expected outputs

- **Filters button**: `shadow-sm` removed. All other classes unchanged.
- **Filter drawer div**: `shadow-xl` removed. `lg:shadow-none` removed. `border-r border-ink-4 lg:border-r-0` added.
  - Resulting mobile-scoped portion of the className (for reference): `fixed inset-y-0 left-0 z-50 flex w-80 max-w-[85vw] flex-col overflow-y-auto bg-paper-2 border-r border-ink-4 transition-transform duration-200 ease-out`.
  - Resulting lg-reset portion: `lg:relative lg:inset-auto lg:z-auto lg:flex lg:w-auto lg:max-w-none lg:translate-x-0 lg:overflow-visible lg:bg-transparent lg:border-r-0`.

## Constraints

- `lg:border-r-0` must be present to ensure the drawer does not display a spurious right border in the desktop sidebar layout.
- The drawer's translate-x animation and the backdrop overlay logic are not touched.
- The Filters button's other classes (`shadow-sm` removal) must not accidentally remove border-related classes — the button retains `border border-ink-4`.

## Dependencies

- None (independent of TASK-001 and TASK-002).

## Validation criteria

- [ ] `shadow-sm` absent from the Filters button className.
- [ ] `shadow-xl` and `lg:shadow-none` absent from the filter drawer className.
- [ ] `border-r border-ink-4 lg:border-r-0` present in the filter drawer className.
- [ ] Manual test (AC-004): filter drawer on mobile viewport shows a visible left-side border and no shadow.
- [ ] Manual test (AC-005): Filters button has no shadow in resting or pressed state.
- [ ] Manual test (AC-009): drawer opens and closes correctly; overlay and scroll lock behavior unchanged; no layout shift on desktop.

## Tests to implement

### Unit
- None.

### Integration
- None.

---

# TASK-004 — Replace `shadow-sm` with `shadow-menu` on the ColumnSelector floating menu

## Objective

Replace the `shadow-sm` Tailwind utility on the ColumnSelector floating menu `<div>` with `shadow-menu`, so that its `box-shadow` resolves to `var(--shadow-menu)` as required by FR-006.

## Required context

- `frontend/src/components/MiniComparator/ColumnSelector.jsx`: the floating menu `<div>` (line 46) carries `shadow-sm`.
- The DS token `--shadow-menu` is:
  ```
  0 1px 0 0 var(--ink-10),
  0 8px 24px -12px rgba(14, 15, 12, 0.18);
  ```
- `tailwind.config.js` must expose `shadow-menu` as a named box-shadow utility for the class to work. If it is not already present, it must be added under `theme.extend.boxShadow` as:
  ```js
  'menu': '0 1px 0 0 var(--ink-10), 0 8px 24px -12px rgba(14, 15, 12, 0.18)',
  ```
- The ColumnSelector trigger button has no shadow classes — it is not touched in this task.

## Potentially impacted files

- `frontend/src/components/MiniComparator/ColumnSelector.jsx`
- `frontend/tailwind.config.js` (conditional — only if `shadow-menu` is not already defined)

## Inputs

- Floating menu `<div>` className (line 46): currently contains `shadow-sm`.
- `tailwind.config.js`: check whether `boxShadow.menu` or `boxShadow['menu']` is already defined under `theme.extend`.

## Expected outputs

- Floating menu className: `shadow-sm` replaced with `shadow-menu`.
- `tailwind.config.js` (if needed): `'menu'` key added to `theme.extend.boxShadow` with the value above.

## Constraints

- Only the `shadow-sm` → `shadow-menu` substitution is made in `ColumnSelector.jsx`. No other classes are changed.
- If `shadow-menu` is already defined in `tailwind.config.js`, the config file is not modified.
- Do not use an inline `style` prop as a substitute for the Tailwind utility.

## Dependencies

- None.

## Validation criteria

- [ ] `shadow-sm` absent from the floating menu className in `ColumnSelector.jsx`.
- [ ] `shadow-menu` present in the floating menu className.
- [ ] `tailwind.config.js` contains `'menu'` under `theme.extend.boxShadow` with the correct DS token value (or was already present).
- [ ] Manual test (AC-006): ColumnSelector floating menu `box-shadow` in DevTools resolves to `var(--shadow-menu)`. No hard-coded shadow value present.

## Tests to implement

### Unit
- None.

### Integration
- None.

---

# TASK-005 — Remove `focus:ring-*` helpers from `FilterPanel.jsx`

## Objective

Remove explicit `focus:ring-brass-8` (and related `focus:outline-none`) Tailwind classes from interactive elements in `FilterPanel.jsx` — specifically on the `FilterToggle` button and the `LargeMultiSelectFilter` search input — so that these elements rely on the global `:focus-visible` rule from TASK-001.

## Required context

- `frontend/src/components/MiniComparator/FilterPanel.jsx`:
  - **`FilterToggle` button** (line 35): className contains `focus:outline-none focus:ring-2 focus:ring-brass-8 focus:ring-offset-1`. All four classes are removed.
  - **Range filter number inputs** (lines 104 and 117): className contains `focus:border-brass-8 focus:outline-none`. Both classes are removed from both inputs. The border color change on focus (`focus:border-brass-8`) is explicitly replaced by the global outline — mixing border-color focus with outline focus is not permitted per the PRD (FR-001: "No element may substitute a border color change for this outline").
  - **`LargeMultiSelectFilter` text search input** (line 298): className contains `focus:border-brass-8 focus:outline-none`. Both are removed.
  - **Sort `<select>` element** (line 471): className contains `focus:border-brass-8 focus:outline-none`. Both are removed.
  - **`ColumnSelector` checkbox inputs** (line 68 of `ColumnSelector.jsx`): className contains `focus:ring-brass-8`. This class is removed. (Note: `ColumnSelector.jsx` is already touched in TASK-004, but the checkbox change is listed here for grouping by component type; it may be included in TASK-004 if the implementer prefers.)

## Potentially impacted files

- `frontend/src/components/MiniComparator/FilterPanel.jsx`
- `frontend/src/components/MiniComparator/ColumnSelector.jsx` (checkbox inputs, if not already handled in TASK-004)

## Inputs

- `FilterToggle` button className (line 35).
- Range filter number inputs className (lines 104 and 117).
- `LargeMultiSelectFilter` search input className (line 298).
- Sort `<select>` className (line 471).
- Checkbox inputs in `ColumnSelector.jsx` and `FilterPanel.jsx` (lines 68 and 310).

## Expected outputs

- All `focus:outline-none`, `focus:ring-*`, `focus:border-brass-8`, `focus:ring-offset-*` classes removed from the listed elements.
- No other className tokens changed.

## Constraints

- `accent-brass-7` class on checkboxes is not a focus-related class — it controls the checked color. It must be preserved.
- The `rounded` class on checkboxes is also preserved.
- Do not remove hover-related classes (`hover:border-brass-8`, `hover:text-brass-8`).

## Dependencies

- TASK-001 must be complete before this task is validated.

## Validation criteria

- [ ] No `focus:outline-none`, `focus:ring-2`, `focus:ring-brass-8`, `focus:ring-offset-1`, `focus:border-brass-8` classes remain on any interactive element in `FilterPanel.jsx` or on checkbox inputs in `ColumnSelector.jsx`.
- [ ] All listed elements display the global `:focus-visible` outline when reached via keyboard Tab.
- [ ] Hover classes (`hover:border-brass-8`, etc.) are unchanged.
- [ ] `accent-brass-7` class on checkboxes is unchanged.

## Tests to implement

### Unit
- None.

### Integration
- None.

---

# TASK-006 — Remove `box-shadow` from range slider thumbs in `FilterPanel.module.css`

## Objective

Remove the `box-shadow` declarations from both `::-webkit-slider-thumb` and `::-moz-range-thumb` in `FilterPanel.module.css`. Add `border: 2px solid var(--paper-0)` to the Firefox thumb to maintain visual contrast. The webkit thumb already has a border and requires no addition.

## Required context

- `frontend/src/components/MiniComparator/FilterPanel.module.css`:
  - `::-webkit-slider-thumb` (lines 14–25): `box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);` present. Thumb already has `border: 2px solid #fbfaf6`. The `box-shadow` line is removed. The border line is updated to use the CSS custom property: `border: 2px solid var(--paper-0)` (functionally identical, semantically correct).
  - `::-moz-range-thumb` (lines 31–41): `box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);` present. `border: none` present. The `box-shadow` line is removed. `border: none` is replaced with `border: 2px solid var(--paper-0)`.
- The thumbs use a brass-8 fill background (`background: #a88846`). The paper-0 border creates a visible ring between the brass thumb and the brass-8 range bar beneath it, maintaining detectability without any shadow.

## Potentially impacted files

- `frontend/src/components/MiniComparator/FilterPanel.module.css`

## Inputs

- `::-webkit-slider-thumb` rule block (lines 14–25).
- `::-moz-range-thumb` rule block (lines 31–41).

## Expected outputs

- **`::-webkit-slider-thumb`**: `box-shadow` line removed. `border: 2px solid #fbfaf6` updated to `border: 2px solid var(--paper-0)`. All other properties unchanged.
- **`::-moz-range-thumb`**: `box-shadow` line removed. `border: none` replaced with `border: 2px solid var(--paper-0)`. All other properties unchanged.

## Constraints

- Do not modify any other rule in `FilterPanel.module.css` (track, range, thumb base `.thumb` class).
- Do not add any new `box-shadow` declaration as a replacement.
- The hover `transform: scale(1.2)` behavior on thumbs is not affected.

## Dependencies

- None (independent of all other tasks).

## Validation criteria

- [ ] `box-shadow` absent from `::-webkit-slider-thumb` rule block.
- [ ] `box-shadow` absent from `::-moz-range-thumb` rule block.
- [ ] `border: 2px solid var(--paper-0)` present in `::-webkit-slider-thumb`.
- [ ] `border: 2px solid var(--paper-0)` present in `::-moz-range-thumb` (replacing `border: none`).
- [ ] Manual test (AC-007): range slider thumbs have no visible shadow in resting or dragging state. Thumb is clearly distinct from the track background.
- [ ] Manual test: slider drag behavior is unchanged.

## Tests to implement

### Unit
- None.

### Integration
- None.

---

## 6. Global Validation Strategy

### Unit validation
- None. All changes are visual CSS rules with no unit-testable logic.

### Integration validation
- None. No data flow, state, or API surface is modified.

### Functional validation

Execute the following manual checks after all tasks are complete:

| Check | Acceptance Criterion | Location |
|---|---|---|
| Tab through all interactive elements | 2px brass-8 outline, 2px offset on every element | AC-001 |
| Mouse click on all interactive elements | No focus ring visible after click | AC-002 |
| Text selection in 5+ locations | Brass-5 background, ink-12 text; no blue default | AC-003 |
| Mobile filter drawer open/close | Visible left border, no shadow; behavior unchanged | AC-004 |
| Mobile Filters button resting and pressed | No shadow | AC-005 |
| ColumnSelector floating menu (DevTools) | `box-shadow` resolves to `var(--shadow-menu)` | AC-006 |
| Range slider thumbs resting and dragging | No shadow; thumb visually distinct from track | AC-007 |
| Code audit: grep `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`, `box-shadow` in `frontend/src/` | Zero results on non-floating-menu components | AC-008 |

### Non-regression validation

After all tasks are complete, run the following smoke test on both desktop and mobile viewports:

1. Filter by at least two criteria using different filter types (range + multiSelect).
2. Sort the table by a different column.
3. Toggle a column off and on via the ColumnSelector.
4. Adjust a range slider (drag both thumbs).
5. Open and close the filter drawer (mobile viewport) at least three times.
6. Select text in at least five distinct regions of the page.

All interactions must behave identically to their pre-evolution behavior. No layout shifts, no broken animations, no missing focus indicators on keyboard navigation.

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|---|---|---|
| `shadow-menu` not defined in `tailwind.config.js` | ColumnSelector floating menu renders with no shadow (invisible class) | TASK-004 explicitly requires checking and conditionally updating `tailwind.config.js` |
| `lg:border-l-0` missing from drawer causes spurious border in desktop layout | Visual regression on desktop — a left border appears on the sticky sidebar | Validation criterion for TASK-003 includes explicit desktop layout check |
| Firefox `::-moz-range-thumb` border not rendering due to browser-specific handling | Thumb not visually distinct on Firefox | Test on Firefox after TASK-006; border is a well-supported property on range thumbs |
| Global `:focus-visible` rule overridden by a more specific Tailwind class not identified in the audit | Some element does not show the expected focus ring | AC-008 code audit identifies any remaining `focus:outline-none` instances |

---

## 8. Rollback Plan

All changes are isolated to CSS and JSX className strings. Rollback is a git revert of the commits for this evolution.

No database migrations, no API changes, and no new files are created — the rollback is instantaneous and risk-free.
