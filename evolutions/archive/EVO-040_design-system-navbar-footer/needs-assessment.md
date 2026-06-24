# Needs Assessment — EVO-040

## 1. General Information

- Evolution ID: EVO-040
- Title: Design system — Navbar + Footer
- Author: Flavien Drouot
- Date: 2026-06-03
- Status: Draft
- Priority: —

---

## 2. Context

### Current situation

The Navbar and Footer are transversal shell components visible on every surface of the application. They were built before the design system was formalised and currently use legacy styling values that do not align with the token system.

### Identified problem

EVO-039 introduced the design system foundation tokens. The Navbar and Footer have not been migrated and are now visually out of sync with the rest of the application, which follows the updated token system.

### Business motivation

Migrating the two transversal shell components first gives the whole application a consistent visual frame before tackling content sections. Any user who lands on the site sees the Navbar and Footer immediately — their inconsistency undermines the credibility of the product.

---

## 3. Business Objective

Bring the Navbar and Footer fully in line with the design system (tokens, layout, and structure) so that the application presents a coherent visual identity on every surface and at every breakpoint.

---

## 4. Scope

### Included

- Full Navbar component — token migration, layout, structure, all interactive states (hover, active), sticky behaviour
- Full Footer component — token migration, layout, structure
- Desktop and mobile/responsive breakpoints for both components
- All existing navigation elements and sections within each component (no exclusions)

### Excluded

- All other components and sections of the application
- Any new navigation links or content not currently present in the components

---

## 5. Constraints

### Business constraints

- EVO-039 (foundation tokens) must be complete before this evolution begins (see Open Questions)

### Known technical constraints

- The reference implementation in `design-system/ui_kits/landing/` is the single source of truth for both token usage and layout/structure — the app components must be brought in line with it, not the other way around
- Existing i18n labels (FR/EN) must continue to render correctly after the migration

### Regulatory / security constraints

- None

---

## 6. Use Cases

### Nominal case

As a user visiting the application,
I want the Navbar and Footer to look consistent with the rest of the page,
So that the product feels polished and trustworthy at first glance.

### Alternative cases

- User visits on a mobile device — Navbar and Footer must be correctly styled and structured at small breakpoints
- User switches language (FR/EN) — all labels in Navbar and Footer must render correctly in both languages

### Known error cases

- None identified

---

## 7. Acceptance Criteria

- [ ] Navbar matches the reference implementation in `design-system/ui_kits/landing/Navbar.jsx` — tokens, layout, and structure
- [ ] Footer matches the reference implementation in `design-system/ui_kits/landing/Footer.jsx` — tokens, layout, and structure
- [ ] Navbar is sticky with a translucent paper background and backdrop blur, using design system tokens
- [ ] Nav links use the correct ink token; hover and active states use the brass token — no legacy or Tailwind blue classes remain
- [ ] Footer uses the ink-inverse card surface with correct text token — no legacy `brand-*` or Tailwind blue classes remain
- [ ] Both components are correctly styled and functional on mobile and desktop breakpoints
- [ ] FR and EN labels render correctly in both components after migration

---

## 8. Open Questions

- Is EVO-039 (foundation tokens) complete and merged? This evolution cannot begin until it is.

---

## 9. Assumptions

- The reference implementations in `design-system/ui_kits/landing/` are final and approved — no design changes are expected during this evolution
- The current Navbar and Footer structure diverges from the ui_kit reference and will require structural adjustments, not just token substitution
