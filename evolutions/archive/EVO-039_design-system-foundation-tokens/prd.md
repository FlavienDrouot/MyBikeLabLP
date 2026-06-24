# PRD — Product Requirements Document

## 1. General Information

- Evolution ID: EVO-039
- Title: Design system — foundation tokens
- Author: Flavien Drouot
- Date: 2026-06-03
- Version: 1.0
- Needs Assessment reference: `MyBikeLab/evolutions/EVO-039_design-system-foundation-tokens/needs-assessment.md`

---

## 2. Functional Objective

After this evolution, the live codebase fully reflects the design system token source of truth defined in `design-system/colors_and_type.css`. Every CSS custom property, every Tailwind utility mapping, and every global baseline rule in the frontend matches the design system — with no stale, diverged, or legacy values remaining. All subsequent evolutions (EVO-040–043) can apply component styles confidently against a stable, complete token set without any per-evolution token patching.

---

## 3. Target Behavior

### General description

The frontend global stylesheet (`frontend/src/index.css`) exposes the full set of CSS custom properties declared in `design-system/colors_and_type.css` on `:root`. The Tailwind configuration (`frontend/tailwind.config.js`) maps every updated token scale (colors, spacing, radii, shadows, typography) to Tailwind utility classes, so that component authors never need to use raw hex values or hardcoded values in class names.

JetBrains Mono loads correctly from Google Fonts and is accessible both as a Tailwind utility and through the `.t-mono` and `.t-numeric` semantic classes. All global baseline rules — body defaults, selection highlight, focus ring, and rule utilities — match the design system exactly. No `brand-*` blue token declarations exist anywhere in the frontend files.

Intentional visual changes introduced by the token update (new palette, updated accent ramp, revised global baseline) are propagated to the live product and are visible in the browser. No existing component breaks in an unintended or structurally unexpected way.

---

## 4. Functional Rules

### FR-001 — CSS custom properties match the design system source of truth

Every CSS custom property declared in `design-system/colors_and_type.css` under `:root` must be present in `frontend/src/index.css` under `:root` with identical names and identical values. No properties from the design system may be absent or carry diverged values.

### FR-002 — No extra or renamed properties diverging from the design system

`frontend/src/index.css` must not declare CSS custom properties that conflict with, override, or shadow design system properties under `:root`. Any custom property that was present in the live code but has been superseded by the design system update must be removed or replaced.

### FR-003 — Tailwind utilities map to design system tokens for all updated scales

`frontend/tailwind.config.js` must expose the full updated token set as Tailwind utility classes. This covers: color scales (paper, ink, brass, sage, semantic signal colors), spacing scale, radius scale, and shadow scale. No scale entry should reference a raw hex value that is not derived from a design system token.

### FR-004 — JetBrains Mono is correctly wired

The Google Fonts `@import` for JetBrains Mono must be present in the global stylesheet (or an equivalent loading mechanism). The `--font-mono` CSS custom property must resolve to JetBrains Mono as the first font in its stack. The `.t-mono` and `.t-numeric` semantic classes must apply `font-family: var(--font-mono)` and `font-variant-numeric: tabular-nums`. JetBrains Mono must be accessible as a Tailwind `font-mono` utility.

### FR-005 — Global baseline rules match the design system

The global baseline declarations for `body`, `::selection`, and `:focus-visible` in `frontend/src/index.css` must match the values specified in `design-system/colors_and_type.css`. The `.rule`, `.rule-strong`, `.rule-faint`, and `.rule-double` utility classes must be present and match the design system.

### FR-006 — No brand-* blue token declarations remain

No declaration, reference, or assignment involving tokens with the `brand-*` naming prefix (the legacy blue scale) may exist in `frontend/src/index.css` or `frontend/tailwind.config.js`. If any such declarations were already removed in a prior evolution, this rule is satisfied by their absence; no further action is needed.

### FR-007 — Palette variation classes are present

The surface palette classes (`.pal-paper`, `.pal-mist`, `.pal-porcelain`) and accent classes (`.acc-brass`, `.acc-cobalt`, `.acc-oxblood`, `.acc-forest`) defined in `design-system/colors_and_type.css` must be present in `frontend/src/index.css` with matching declarations.

### FR-008 — Semantic type classes are present

The semantic type utility classes defined in `design-system/colors_and_type.css` (`.t-display-1`, `.t-display-2`, `.t-display-light`, `.t-h1` through `.t-h4`, `.t-lead`, `.t-body`, `.t-body-sm`, `.t-mono`, `.t-mono-lg`, `.t-numeric`, `.t-label`, `.t-label-strong`, `.t-annotation`, `.t-eyebrow`) must be present in the global stylesheet with matching declarations.

### FR-009 — No unintended visual regressions on existing components

Existing components may change appearance where those changes are a direct consequence of the token update (intentional). Components must not break structurally: no missing layout, no invisible text, no broken interaction states. Any component that referenced a token that no longer exists after synchronization must surface a visible, identifiable gap — it must not silently fall back to a browser default in a way that is undetectable.

---

## 5. Detailed Use Cases

### UC-001 — Developer applies a component style using a design system token

#### Preconditions
- EVO-039 implementation is complete and deployed to the dev environment
- A developer is working on a component that requires a color, spacing, or typography token

#### Steps
1. The developer opens `design-system/colors_and_type.css` to look up the token name (e.g., `--brass-7`, `--space-6`, `--font-mono`)
2. The developer uses the token directly as a Tailwind utility class or CSS custom property reference in the component
3. The developer inspects the component in the browser

#### Expected result
- The token resolves to the correct value defined in the design system — no `var()` falls back to an empty or undefined value
- The Tailwind utility class maps to the correct token value without needing a raw hex value

#### Error cases
- A token name used by the developer does not exist in the live codebase — this surfaces as an unresolved `var()` (typically rendering as `initial` or blank), making the gap visible rather than silently overriding with a stale value

---

### UC-002 — User views the application in the browser after EVO-039

#### Preconditions
- EVO-039 is complete and the application is running

#### Steps
1. The user opens the application in a browser
2. The user reads body text, views headings, interacts with a CTA button, selects text, and tabs through interactive elements

#### Expected result
- Body text renders in Inter at `--text-base` (15px) with `--ink-11` color on a `--paper-1` background
- Text selection applies a `--brass-5` background with `--ink-12` text (warm brass tint, not browser-default blue)
- Focus ring on interactive elements shows a 2px `--brass-8` outline at 2px offset (not browser-default blue)
- Numeric values (weights, prices, dimensions) render in JetBrains Mono with tabular figures

#### Error cases
- Any of the above renders with browser defaults (blue selection, blue focus ring, system monospace) — indicates a missing token or missing font load

---

### UC-003 — Developer verifies absence of legacy brand-* tokens

#### Preconditions
- EVO-039 is complete

#### Steps
1. The developer searches `frontend/src/index.css` and `frontend/tailwind.config.js` for the string `brand-`

#### Expected result
- No matches are found — the search returns zero results

#### Error cases
- One or more `brand-*` references are found — this is a failing state that must be resolved before EVO-039 is considered complete

---

### UC-004 — Developer confirms full token coverage for EVO-040 through EVO-043

#### Preconditions
- EVO-039 is complete

#### Steps
1. The developer opens a component file from EVO-040, EVO-041, EVO-042, or EVO-043
2. The developer applies a token from the design system (e.g., `--bg-recessed`, `--border-default`, `--accent`, `--shadow-menu`)
3. The developer inspects the rendered output

#### Expected result
- Every semantic token resolves without fallback to a browser default — all semantic tokens (`--bg-page`, `--bg-elevated`, `--bg-recessed`, `--bg-inverse`, `--fg-primary`, `--fg-secondary`, `--fg-muted`, `--fg-faint`, `--fg-inverse`, `--fg-accent`, `--fg-link`, `--fg-link-hover`, `--rule-strong`, `--rule-default`, `--rule-faint`, `--border-default`, `--border-strong`, `--border-focus`, `--accent`, `--accent-fg-on`) are available and resolve correctly

#### Error cases
- A semantic token required by an EVO-040–043 component is missing from `:root` — this indicates an incomplete synchronization

---

## 6. Acceptance Criteria

### AC-001
#### Description
All CSS custom properties from `design-system/colors_and_type.css` are present on `:root` in the production build, with values identical to the design system source.
#### Expected verification
Inspect the computed `:root` styles in browser DevTools. Every property listed in `colors_and_type.css` under `:root` must appear with a matching value. Alternatively, compare the `:root` block in `frontend/src/index.css` against `design-system/colors_and_type.css` line by line — no property may be absent or carry a diverged value.
#### Type
- Manual

---

### AC-002
#### Description
Tailwind utilities map to design system tokens for all updated scales. No raw hex values appear in Tailwind config entries that correspond to design system token scales.
#### Expected verification
Open `frontend/tailwind.config.js`. For each color, spacing, radius, and shadow scale entry, verify the value references a CSS custom property (e.g., `var(--paper-1)`) rather than a raw hex string. Confirm utilities such as `bg-paper-1`, `text-ink-11`, `border-ink-4`, `rounded-xs`, `shadow-menu` generate correct values in the compiled CSS.
#### Type
- Manual

---

### AC-003
#### Description
JetBrains Mono loads correctly and is accessible via the Tailwind `font-mono` utility and `.t-mono` / `.t-numeric` classes.
#### Expected verification
Open the application in a browser. In DevTools, verify the Google Fonts `@import` for JetBrains Mono is present and the font loads (Network tab shows the font file as 200 OK). On an element styled with `.t-mono` or `.t-numeric`, confirm the computed `font-family` resolves to JetBrains Mono. Apply the Tailwind `font-mono` class to an element and confirm the same.
#### Type
- Manual

---

### AC-004
#### Description
Global baseline rules for `body`, `::selection`, and `:focus-visible` match `design-system/colors_and_type.css`.
#### Expected verification
Compare the `body`, `::selection`, and `:focus-visible` declarations in `frontend/src/index.css` against `design-system/colors_and_type.css` — properties and values must match. In a browser, verify: body text is `--ink-11` on `--paper-1`, text selection applies a brass-tinted highlight (not blue), and keyboard focus ring shows a 2px brass outline.
#### Type
- Manual

---

### AC-005
#### Description
`.rule`, `.rule-strong`, `.rule-faint`, and `.rule-double` utility classes are present and match the design system.
#### Expected verification
Search `frontend/src/index.css` for each class name and confirm the declarations match `design-system/colors_and_type.css`. Render an element with `.rule` in the browser and verify it shows a 1px `--rule-default` top border.
#### Type
- Manual

---

### AC-006
#### Description
No `brand-*` blue token declarations remain anywhere in `frontend/src/index.css` or `frontend/tailwind.config.js`.
#### Expected verification
Search both files for the string `brand-`. The search must return zero results.
#### Type
- Automated

---

### AC-007
#### Description
No unintended visual regressions on existing components. Intentional visual changes from the token update are acceptable.
#### Expected verification
Visually review the full rendered application after the token update: landing page (hero, comparator, roadmap, benefits, partnership, footer). For each section, confirm that layout is intact, text is legible, interactive states (hover, focus, disabled) function correctly, and no component renders with invisible text, broken layout, or missing borders. Any visual change must be traceable to an intentional token update.
#### Type
- Manual

---

### AC-008
#### Description
Palette variation classes and accent classes are present in the global stylesheet with correct declarations.
#### Expected verification
Search `frontend/src/index.css` for `.pal-paper`, `.pal-mist`, `.pal-porcelain`, `.acc-brass`, `.acc-cobalt`, `.acc-oxblood`, `.acc-forest`. Each must be present. Apply `.pal-mist` to `<body>` in the browser and verify `--bg-page` resolves to `#eef1f4`. Apply `.acc-cobalt` and verify `--accent` resolves to `#7aa6cf`.
#### Type
- Manual

---

### AC-009
#### Description
Semantic type classes are present in the global stylesheet and correctly reference design system tokens.
#### Expected verification
Search `frontend/src/index.css` for each type class: `.t-display-1`, `.t-display-2`, `.t-display-light`, `.t-h1` through `.t-h4`, `.t-lead`, `.t-body`, `.t-body-sm`, `.t-mono`, `.t-mono-lg`, `.t-numeric`, `.t-label`, `.t-label-strong`, `.t-annotation`, `.t-eyebrow`. Each must be present with declarations that reference design system tokens or match design system values exactly.
#### Type
- Manual

---

## 7. Functional Impacts

### Impacted components
- `frontend/src/index.css` — full replacement of `:root` token block, global baseline rules, type utility classes, rule utilities, palette and accent variation classes
- `frontend/tailwind.config.js` — full update of color, spacing, radius, and shadow scale entries to reference updated CSS custom properties

### Impacted data
- None — this evolution has no impact on wheel data, filter logic, or application state

### Impacted APIs
- None

### Impacted permissions / roles
- None

---

## 8. Out of Scope

- Component-level styling changes (covered by EVO-040–043)
- Any modification to `design-system/colors_and_type.css` — it is read-only for this evolution
- Self-hosting fonts (Google Fonts CDN loading is the current and retained mechanism)
- Adding new tokens not present in `design-system/colors_and_type.css`
- Theming or palette-switching runtime behavior (UI for switching palettes is not in scope; the classes must be present but the switching mechanism is not required for this evolution)

---

## 9. Constraints

- `design-system/colors_and_type.css` is the read-only source of truth — the live code must conform to it, not the other way around
- Intentional visual changes from the token update are acceptable and expected to propagate; only unintended regressions are disallowed
- The legacy `brand-*` tokens may already have been removed in a prior evolution — the task is to verify and clean up any remaining occurrences, not assume they are present

---

## 10. Test Plan

### Automated tests expected
- String search for `brand-` in `frontend/src/index.css` and `frontend/tailwind.config.js` — must return zero matches (AC-006)

### Manual tests expected
- Line-by-line comparison of the `:root` block in `frontend/src/index.css` against `design-system/colors_and_type.css` (AC-001)
- Review of `frontend/tailwind.config.js` to confirm all scale entries use `var(--token-name)` references (AC-002)
- Browser DevTools verification: JetBrains Mono font load, `.t-mono` and `.t-numeric` computed font-family (AC-003)
- Browser visual check: body background, text color, text selection highlight, focus ring appearance (AC-004)
- Browser render check of `.rule` utility (AC-005)
- Full visual review of the rendered application across all landing page sections (AC-007)
- Spot-check of palette and accent class overrides in browser DevTools (AC-008)
- Presence check of all semantic type classes in `frontend/src/index.css` (AC-009)

### Edge cases
- A component currently references a token name that has been renamed in the design system update — the component must surface a visible gap (empty or `initial` value), not silently fall back to an unrelated value
- JetBrains Mono may already be partially loaded — verify the `@import` is present and not duplicated or conflicting with an existing import

### Non-regression
- All existing sections of the landing page (hero, comparator, roadmap, benefits, partnership, footer) must render without structural breakage after the token synchronization
- Interactive states (hover on table rows, focus on filter inputs, CTA button states) must remain functional and visually coherent
