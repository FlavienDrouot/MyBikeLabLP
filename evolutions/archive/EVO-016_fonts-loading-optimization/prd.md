# PRD — Product Requirements Document

## 1. General Information

- Evolution ID: EVO-016
- Title: Fonts Loading Optimization
- Author: Flavien Drouot
- Date: 2026-05-27
- Version: 1.0
- Needs Assessment reference: `EVO-016_fonts-loading-optimization/needs-assessment.md`

---

## 2. Functional Objective

After this evolution, the application must load the Inter font family using the optimal HTML-level strategy (preconnect + stylesheet link), request only the 6 font weights actually consumed by the design system, and resolve all sticky-offset values from a single `--navbar-height` CSS token defined in the design system.

---

## 3. Target Behavior

### General description

The application declares font dependencies in `index.html` via preconnect hints and a stylesheet link tag — not via a CSS `@import` directive. Only the six weights used in the design system (300, 400, 500, 600, 700, 800) are requested. A CSS custom property `--navbar-height` is defined once in the design system token file and is the sole source of truth for any layout value that depends on the navbar height, including `scroll-padding-top` on `<html>` and sticky top offsets in dependent components.

---

## 4. Functional Rules

### FR-001 — Font requests declared in HTML, not in CSS

The Inter font family must be loaded through `<link>` elements in `index.html`. No `@import` directive for Google Fonts may remain in any CSS file.

### FR-002 — Preconnect hints for Google Fonts origins

`index.html` must include preconnect hints for both `https://fonts.googleapis.com` and `https://fonts.gstatic.com` (with the `crossorigin` attribute on the second) before the font stylesheet link.

### FR-003 — Only the six design-system weights are requested

The Google Fonts URL must request exactly the weights 300, 400, 500, 600, 700, and 800. Weight 900 must not be included.

### FR-004 — `--navbar-height` is the single source of truth for navbar-dependent offsets

The token `--navbar-height` must be defined once in `design-system/colors_and_type.css`. Every layout property that depends on the navbar height — including `scroll-padding-top` and sticky top offsets in components — must consume this token. No hardcoded value equivalent to the navbar height may remain.

### FR-005 — No visual regression

The application must render identically to the current state at every breakpoint. No typographic, layout, or spacing change is permitted as a side effect of this evolution.

---

## 5. Detailed Use Cases

This evolution is a developer-facing technical optimization. There is no end-user use case. One developer-facing use case is defined to capture the maintainability intent.

### UC-001 — Navbar height change propagates automatically

#### Preconditions
- `--navbar-height` is defined in `design-system/colors_and_type.css`.
- `scroll-padding-top` on `<html>` and the sticky top offset in `FilterPanel` both reference `--navbar-height`.

#### Steps
1. A developer updates the value of `--navbar-height` in `design-system/colors_and_type.css`.
2. No other file is modified.

#### Expected result
- `scroll-padding-top` on `<html>` reflects the new height.
- The sticky top offset in `FilterPanel` reflects the new height.
- The page renders correctly with no visual gap or overlap at the navbar boundary.

#### Error cases
- If any component uses a hardcoded value instead of `--navbar-height`, that component does not update and its offset drifts from the actual navbar height — this state must not exist after EVO-016.

---

## 6. Acceptance Criteria

### AC-001
#### Description
The Google Fonts URL in `index.html` requests exactly the weights 300, 400, 500, 600, 700, and 800.
#### Expected verification
The font stylesheet `href` attribute contains `wght@300;400;500;600;700;800` and does not contain `900`.
#### Type
- Manual

---

### AC-002
#### Description
`index.html` contains preconnect hints for both Google Fonts origins.
#### Expected verification
`index.html` contains `<link rel="preconnect" href="https://fonts.googleapis.com">` and `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`, both appearing before the font stylesheet `<link>`.
#### Type
- Manual

---

### AC-003
#### Description
No `@import` for Google Fonts remains in any CSS file.
#### Expected verification
A search across all CSS files finds no `@import` directive referencing `fonts.googleapis.com`.
#### Type
- Manual

---

### AC-004
#### Description
`--navbar-height` is defined exactly once, in `design-system/colors_and_type.css`.
#### Expected verification
The token `--navbar-height` appears as a custom property declaration in `design-system/colors_and_type.css` and does not appear as a declaration in any other file.
#### Type
- Manual

---

### AC-005
#### Description
`scroll-padding-top` on `<html>` consumes `--navbar-height`.
#### Expected verification
`index.css` (or equivalent global stylesheet) sets `scroll-padding-top: var(--navbar-height)` on the `html` selector. No hardcoded length value remains for this property.
#### Type
- Manual

---

### AC-006
#### Description
The sticky top offset in `FilterPanel` consumes `--navbar-height`.
#### Expected verification
The sticky positioning of `FilterPanel` references `--navbar-height` rather than a hardcoded Tailwind class such as `top-20`.
#### Type
- Manual

---

### AC-007
#### Description
Lighthouse Performance score is not degraded and LCP is at least equivalent.
#### Expected verification
Run Lighthouse on the production build before and after the change. The Performance score after must be ≥ the score before. LCP after must be ≤ LCP before (lower is better).
#### Type
- Manual

---

### AC-008
#### Description
No visual regression at any breakpoint.
#### Expected verification
Visual review of the full page at mobile, tablet, and desktop breakpoints shows no typographic, layout, or spacing change relative to the current state.
#### Type
- Manual

---

## 7. Functional Impacts

### Impacted components

- `frontend/index.html` — font loading declarations moved here (FR-001, FR-002, FR-003)
- `frontend/src/index.css` — `@import` removed; `scroll-padding-top` updated to consume `--navbar-height` (FR-001, FR-005)
- `frontend/src/design-system/colors_and_type.css` — `--navbar-height` token added (FR-004)
- `FilterPanel` component — sticky top offset updated to consume `--navbar-height` (FR-004)

### Impacted data

None.

### Impacted APIs

None. The Google Fonts CDN URL changes (weight 900 removed), but no application API is affected.

### Impacted permissions / roles

None.

---

## 8. Out of Scope

- Self-hosting fonts (woff2 files in a local `fonts/` directory).
- Reducing or customizing character subsets (latin-only, etc.).
- Any visual or typographic change.
- Backend, data pipeline, or user-facing features of any kind.

---

## 9. Constraints

- No visual regression allowed at any breakpoint.
- Lighthouse Performance score must be ≥ current baseline; LCP must be at least equivalent.
- `--navbar-height` must be added to `design-system/colors_and_type.css` (EVO-007 is complete); it must not be defined locally in a component or page stylesheet.
- The Google Fonts CDN must remain available in the deployment environment (no CSP restrictions on external font origins).

---

## 10. Test Plan

### Automated tests expected

None. This evolution contains no business logic and no stateful behavior. Automated tests are not applicable.

### Manual tests expected

- Inspect `index.html` source: verify preconnect hints are present and correctly ordered, verify the font URL contains only the six required weights.
- Inspect CSS files: confirm no `@import` for Google Fonts remains.
- Inspect `design-system/colors_and_type.css`: confirm `--navbar-height` is declared.
- Inspect `index.css`: confirm `scroll-padding-top` uses `var(--navbar-height)`.
- Inspect `FilterPanel`: confirm sticky offset uses `var(--navbar-height)`.
- Run Lighthouse (Performance audit) on the production build before and after; record scores.
- Visual review at mobile (375 px), tablet (768 px), and desktop (1280 px+): no layout, spacing, or typographic change.

### Edge cases

- If a future evolution changes the navbar height, verify that `scroll-padding-top` and the `FilterPanel` sticky offset both update without any additional change.

### Non-regression

- Full visual review against the current baseline at all breakpoints.
- Lighthouse Performance score and LCP must be at least equivalent to the pre-EVO-016 baseline.
