# PRD — Product Requirements Document

## 1. General Information

- Evolution ID: EVO-007
- Title: Wire design tokens as the single source of truth
- Author: Flavien Drouot
- Date: 2026-05-26
- Version: 1.0
- Needs Assessment reference: `evolutions/EVO-007_wire-design-tokens-source-of-truth/needs-assessment.md`

---

## 2. Functional Objective

After this evolution, `design-system/colors_and_type.css` is the single authoritative source for all design token values (colors, typography, spacing, radii, elevation, motion). The frontend configuration derives all values from this source instead of maintaining independent copies. A change to any token in the source file propagates to the frontend without modifying any other configuration file.

---

## 3. Target Behavior

### General description

The frontend build pipeline reads design token values from a copy of `colors_and_type.css` placed inside the frontend project. Tailwind resolves color palette values, font families, and letter-spacing through CSS variable references rather than hardcoded literals. The DS semantic typography and rule classes (`.t-display-1`, `.t-h1`, `.t-label`, `.t-mono`, `.t-annotation`, `.t-section-index`, `.rule`, `.rule-strong`, `.rule-double`) are available for use in React components. The `brand-*` palette, which was a duplicate with no corresponding DS token, is removed from the Tailwind configuration.

The token file in `frontend/` is a verbatim copy of `design-system/colors_and_type.css`. It is updated manually when the design system evolves.

---

## 4. Functional Rules

### FR-001 — Single location for palette hex values

Each color palette value (paper, ink, brass, sage — all stops) is declared in exactly one location in the repository: the token CSS file. No other file contains raw hex or RGB color values for these palettes.

### FR-002 — Tailwind color utilities reference DS CSS variables

Tailwind color utility classes (e.g. `bg-paper-1`, `text-ink-9`, `border-brass-7`) resolve their values through CSS variable references (`var(--paper-1)`, etc.). The CSS variable values come from the token file at runtime.

### FR-003 — Letter-spacing widest matches DS token

The `tracking-widest` Tailwind utility produces a computed CSS `letter-spacing` value of `0.18em`, matching the DS token `--tracking-widest`. The previous Tailwind default of `0.1em` is no longer used.

### FR-004 — Font family utilities reference DS CSS variables

Tailwind font family utilities for display, sans, and mono resolve through DS CSS variables (`var(--font-display)`, `var(--font-sans)`, `var(--font-mono)`).

### FR-005 — DS semantic classes are usable in React components

The DS semantic typography classes (`.t-display-1`, `.t-h1`, `.t-label`, `.t-mono`, `.t-annotation`, `.t-section-index`) and rule classes (`.rule`, `.rule-strong`, `.rule-double`) can be applied to HTML elements inside React components and render with the intended styles.

### FR-006 — brand-* palette is removed

The `brand-*` palette entries are removed from the Tailwind configuration. No component in the frontend references any `brand-*` utility class at the time of removal.

### FR-007 — Token changes propagate via file copy

When the design system team updates `design-system/colors_and_type.css`, a developer copies the updated file to the designated location inside `frontend/`. No other file needs to be modified for the token change to take effect in the running frontend.

---

## 5. Detailed Use Cases

### UC-001 — Developer updates a color token

#### Preconditions
- The development server is running.
- The token CSS file is in place inside `frontend/` and is included in the build pipeline.

#### Steps
1. Developer opens the token CSS file at its location inside `frontend/`.
2. Developer changes the value of a color variable (e.g. changes `--brass-7` to a different hex value).
3. Developer saves the file.

#### Expected result
- The development server hot-reloads.
- All UI elements that use a Tailwind utility backed by `var(--brass-7)` — including the primary CTA — immediately reflect the new color in the browser without any other file modification.

#### Error cases
- If the developer modifies `design-system/colors_and_type.css` directly instead of the frontend copy, the change has no effect on the running frontend until the file is copied.

---

### UC-002 — Developer applies tracking-widest to a component

#### Preconditions
- The Tailwind configuration correctly maps `letterSpacing.widest` to `0.18em`.

#### Steps
1. Developer adds `class="tracking-widest"` to an element in a React component.

#### Expected result
- The browser computes `letter-spacing: 0.18em` for that element.

#### Error cases
- None identified.

---

### UC-003 — Developer uses a DS semantic class in a React component

#### Preconditions
- The DS semantic classes are exposed and available to the frontend stylesheet.

#### Steps
1. Developer applies a DS class (e.g. `className="t-label"`) to an element in a React component.

#### Expected result
- The element renders with the typographic styles defined for `.t-label` in the DS: correct font family, size, weight, letter-spacing, line-height, and text transform.

#### Error cases
- None identified.

---

### UC-004 — Developer syncs design system update to frontend

#### Preconditions
- The design system has been updated: `design-system/colors_and_type.css` contains a modified or new token.
- The developer knows which file to update in `frontend/`.

#### Steps
1. Developer copies `design-system/colors_and_type.css` to the token file location inside `frontend/`, replacing the existing copy.

#### Expected result
- The updated token values are available to Tailwind and all DS semantic classes on the next build or hot-reload.
- No change to `tailwind.config.js` or any other configuration file is required.

#### Error cases
- None identified.

---

### UC-005 — Build fails due to residual brand-* reference

#### Preconditions
- The `brand-*` palette has been removed from Tailwind configuration.
- A component still references a `brand-*` utility class.

#### Steps
1. Developer runs the build.

#### Expected result
- The build produces a warning or missing style that makes the residual reference visible.
- A grep check confirms which component file contains the reference.
- The developer removes or replaces the reference before delivery.

#### Error cases
- This is itself an error case, caught before delivery by verification (see AC-005).

---

## 6. Acceptance Criteria

### AC-001
#### Description
Palette hex values for paper, ink, brass, and sage appear in exactly one location in the repository.
#### Expected verification
Search the entire repository for hex color literals matching the paper / ink / brass / sage palettes. The only file containing these literals is the token CSS file inside `frontend/`. `tailwind.config.js` contains no hex literals for these palettes.
#### Type
- Manual

---

### AC-002
#### Description
Modifying `--brass-7` (or any color variable used by the primary CTA) in the frontend token CSS file changes the CTA color immediately in the running dev server.
#### Expected verification
1. Note the current CTA background color in the browser.
2. Change the value of `--brass-7` in the token CSS file inside `frontend/`.
3. Save the file.
4. Verify the CTA background color in the browser has changed without a full page reload.
#### Type
- Manual

---

### AC-003
#### Description
`class="tracking-widest"` produces a computed `letter-spacing` of `0.18em`.
#### Expected verification
Apply `tracking-widest` to a test element. Use browser DevTools to inspect the computed `letter-spacing`. The value must be `0.18em` (or its pixel equivalent at the current font size, computed from `0.18em`).
#### Type
- Manual

---

### AC-004
#### Description
At least one DS semantic class (`.t-label`) is usable in a React component and renders with correct typographic styles.
#### Expected verification
Apply `className="t-label"` to an element in a React component. Verify in the browser that the element renders with the expected styles from the DS definition of `.t-label` (font family, size, weight, letter-spacing, and text transform).
#### Type
- Manual

---

### AC-005
#### Description
The `brand-*` palette is removed from Tailwind configuration, and no component references any `brand-*` utility class.
#### Expected verification
1. Confirm `tailwind.config.js` contains no `brand-*` entries.
2. Run a grep search across the entire `frontend/src/` directory for `brand-`. The search returns no matches.
#### Type
- Manual

---

### AC-006
#### Description
No perceptible visual regression on the Landing page after the evolution.
#### Expected verification
Take a full-page screenshot of the Landing page before the evolution. Take an equivalent screenshot after the evolution. Compare the two. Micro rendering differences (sub-pixel anti-aliasing) are acceptable; no structural or color change should be visible beyond the intentional fix of `tracking-widest`.
#### Type
- Manual

---

## 7. Functional Impacts

### Impacted components

- All React components that use Tailwind color utility classes backed by the paper / ink / brass / sage palettes — their visual output now derives from the token CSS file at runtime. No JSX or class name changes required.
- Any component using `tracking-widest` will render with corrected letter-spacing (`0.18em` instead of `0.1em`). This is an intentional visual correction.
- Any component that currently uses `brand-*` Tailwind classes must have those references updated or removed before the palette is dropped.

### Impacted data

- None.

### Impacted APIs

- None.

### Impacted permissions / roles

- None.

---

## 8. Out of Scope

- Visual refactor of existing components — no component class names or JSX are changed as part of this evolution (except to remove `brand-*` references).
- Progressive adoption of DS semantic classes across all components — semantic classes are made available but not rolled out.
- Modification of any file inside `design-system/` — that directory is read-only from the frontend.
- Automated sync mechanism between `design-system/colors_and_type.css` and the frontend copy — manual copy is the accepted process for this evolution.
- All EVO-009 through EVO-015 features.

---

## 9. Constraints

- `design-system/` is read-only. The frontend must adapt to the DS, not the other way around.
- The token CSS file in `frontend/` must be a verbatim copy of `design-system/colors_and_type.css` at the time of this evolution and must remain in sync with it manually when the DS evolves.
- EVO-009, EVO-010, EVO-011, EVO-013, EVO-014, and EVO-015 are blocked until this evolution is delivered.
- All palette hex values currently hardcoded in `tailwind.config.js` are assumed to be already declared in `design-system/colors_and_type.css` with matching values.

---

## 10. Test Plan

### Automated tests expected

- None for this evolution. The changes affect styling infrastructure only; no logic or data flow is introduced.

### Manual tests expected

- Verify hex values appear only in the token CSS file (AC-001).
- Verify CTA color changes on token edit with HMR active (AC-002).
- Verify `tracking-widest` computed value via DevTools (AC-003).
- Verify `.t-label` renders correctly in a React component (AC-004).
- Verify `brand-*` removal and grep scan (AC-005).
- Before/after Landing page visual comparison (AC-006).

### Edge cases

- A component currently relying on `brand-*` classes breaks silently (missing styles rather than a build error in some configurations) — must be caught by the grep check before removing the palette.
- The `tracking-widest` correction changes the rendered width of all-caps labels. This is intentional but must be confirmed as not causing layout overflow in narrow containers on the Landing page.

### Non-regression

- The Landing page must have no perceptible visual regression beyond the intentional `tracking-widest` correction. All section layouts, colors, font families, spacing, and interactive states must remain visually equivalent to the pre-evolution state.
