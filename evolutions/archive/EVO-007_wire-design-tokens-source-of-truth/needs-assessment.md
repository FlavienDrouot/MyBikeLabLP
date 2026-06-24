# Needs Assessment

## 1. General Information

- Evolution ID: EVO-007
- Title: Wire design tokens as the single source of truth
- Author: Flavien Drouot
- Date: 2026-05-26
- Status: Draft
- Priority: P0 — blocking foundation for EVO-009 to EVO-015

---

## 2. Context

### Current situation

`design-system/colors_and_type.css` declares ~150 CSS variables (palettes at 12 stops, spacing, radii, elevation, typography, motion) and semantic classes (`.t-display-1`, `.t-h1`, `.t-label`, `.t-mono`, `.t-annotation`, `.t-section-index`, `.rule`, `.rule-strong`, `.rule-double`). However:

- The file is **never imported** by the frontend.
- `frontend/tailwind.config.js` manually re-declares the paper / ink / brass / sage palettes using hardcoded hex values.
- The DS token `--tracking-widest: 0.18em` is not honored — Tailwind's default `tracking-widest` resolves to `0.1em` (45% under-tracking on all caps labels).
- The DS semantic classes are **inaccessible** from React components.

### Identified problem

The design system and the frontend maintain parallel, divergent copies of the same design values. Any change to a token in the design system has no effect on the frontend without a manual update to `tailwind.config.js`. The two sources are already out of sync on `tracking-widest`.

### Business motivation

This creates maintenance risk (permanent divergence between DS and frontend), produces incorrect rendering today, and blocks all subsequent design evolutions (EVO-009 to EVO-015) that rely on a reliable, shared token layer.

---

## 3. Business Objective

Establish `design-system/colors_and_type.css` as the **single authoritative source** of design tokens. Any change to a token in the design system must propagate to the frontend by updating the copy kept in `frontend/`.

---

## 4. Scope

### Included

- Copy `colors_and_type.css` into `frontend/` as the token source imported by the pipeline.
- Refactor `tailwind.config.js` to consume DS CSS variables (`var(--paper-1)`, etc.) instead of hardcoded hex values.
- Fix `letterSpacing.widest` to match the DS token (`0.18em`).
- Expose DS font families (`--font-display`, `--font-sans`, `--font-mono`) through Tailwind config.
- Make semantic classes (`.t-display-1`, `.t-h1`, `.t-label`, `.t-mono`, `.t-annotation`, `.t-section-index`, `.rule`, `.rule-strong`, `.rule-double`) usable in React components.
- Remove the `brand-*` palette from Tailwind config — migrate any remaining component references beforehand.

### Excluded

- Visual refactor of existing components (covered by subsequent EVOs).
- Any modification to files inside `design-system/` (read-only from the frontend).
- Progressive adoption of semantic classes across all components in this evolution.
- Automated sync mechanism between `design-system/colors_and_type.css` and its frontend copy (manual copy is sufficient for now).

---

## 5. Constraints

### Business constraints

- EVO-009, EVO-010, EVO-011, EVO-013, EVO-014, EVO-015 are strictly blocked until this evolution is delivered.

### Known technical constraints

- `design-system/` is read-only — the frontend must adapt, not the design system.
- The copy in `frontend/` must be kept in sync with `design-system/colors_and_type.css` manually when the DS evolves.

### Regulatory / security constraints

- None.

---

## 6. Use Cases

### Nominal case

As a developer,
I want to update a color token in `design-system/colors_and_type.css` and copy the file to `frontend/`,
so that the change is reflected immediately in the running frontend without touching any other file.

### Alternative cases

- A developer applies `class="tracking-widest"` to a component → the CSS computed value is `0.18em`.
- A developer uses `.t-label` in a React component → the class is available and renders correctly.

### Known error cases

- A `brand-*` class is still referenced in a component after the palette is removed → build error or missing style, caught before delivery by grep verification.

---

## 7. Acceptance Criteria

- [ ] Palette hex values (paper / ink / brass / sage) appear only in the token CSS file — not in `tailwind.config.js` or any other file.
- [ ] Modifying the copy of `colors_and_type.css` in `frontend/` and saving changes the primary CTA color immediately in the running dev server (HMR).
- [ ] `class="tracking-widest"` produces `0.18em` in computed CSS.
- [ ] At least one semantic class (e.g. `.t-label`) is usable in a React component and renders correctly.
- [ ] The `brand-*` palette is removed from `tailwind.config.js`; no component references it (verified by grep).
- [ ] No perceptible visual regression on the Landing page — validated by manual before/after comparison (micro rendering differences acceptable).

---

## 8. Open Questions

- None.

---

## 9. Assumptions

- All palette values currently hardcoded in `tailwind.config.js` are already declared in `colors_and_type.css`.
- The copy of `colors_and_type.css` placed in `frontend/` is identical to the source in `design-system/` at the time of this evolution.
