# Needs Assessment

## 1. General Information

- **Evolution ID:** EVO-002
- **Title:** Design Token Centralization
- **Author:** Flavien Drouot
- **Date:** 2026-05-25
- **Status:** Draft
- **Priority:** Medium — preparatory, before brand/design overhaul

---

## 2. Context

### Current situation
Design values (colors, typography, spacing) are embedded directly in component JSX as Tailwind utility classes, some using arbitrary values. There is no central source of truth for the app's visual identity.

### Identified problem
When a design or brand change is needed, every file containing hardcoded design values must be located and updated individually. This is error-prone, especially in an AI-managed codebase where consistency is critical.

### Business motivation
MyBikeLab is approaching a brand and design overhaul. All design tokens must be centralized beforehand to make that change efficient and reliable.

---

## 3. Business Objective

Make any future color, typography, or spacing change a single-file operation: editing `tailwind.config.js` must be sufficient to update the visual identity of the entire app.

Establish the token architecture as the standard for all future component development: new components must use named tokens exclusively for colors, typography, and spacing — no arbitrary values.

---

## 4. Scope

### Included
- All **color** values used in first-party components
- All **typography** values (font size, weight, line height, font family) used in first-party components
- All **spacing** values used in first-party components
- All files authored and maintained by the project team
- Documentation of the token naming convention, so future components can be built consistently

### Excluded
- Component logic, layout structure, or behavior — no functional changes
- Component abstractions or reusable class utilities (`@apply`, React wrappers)
- All other Tailwind keys: border-radius, shadows, breakpoints, z-index, transitions
- `node_modules/`, auto-generated files, and any third-party code

---

## 5. Constraints

### Business constraints
- The visual appearance of the app must not change. Minor imperceptible rounding differences (e.g., `0.875rem` vs `14px`) are acceptable; no intentional design change is permitted.
- Tailwind CSS must not be replaced.
- The token architecture is the authoritative standard: no new component may introduce arbitrary color, typography, or spacing values.

### Known technical constraints
- None captured at this stage.

### Regulatory / security constraints
- None.

---

## 6. Use Cases

### Nominal case
As a developer (or AI assistant) maintaining MyBikeLab,
I want to change the app's primary color,
So that the change takes effect everywhere by editing `tailwind.config.js` only — no JSX modifications required.

### Alternative cases
- Changing the typography scale (e.g., base font size) propagates across the app via a single token edit.
- Adjusting spacing (e.g., section padding) propagates across the app via a single token edit.
- Building a new component: the developer consults the token naming convention and uses only named tokens — no arbitrary values are introduced.

### Known error cases
- An arbitrary value remains in JSX after migration → the brand change does not propagate to that location → non-conformant, must be resolved.
- A new component introduces an arbitrary value → the token architecture standard is violated → non-conformant.

---

## 7. Acceptance Criteria

- [ ] All color values in first-party JSX/TSX are defined as named tokens in `tailwind.config.js` — no arbitrary color values remain (e.g., no `text-[#...]`, `bg-[#...]`).
- [ ] All typography values (font size, weight, line height, family) are defined as named tokens — no arbitrary typography values remain.
- [ ] All spacing values are defined as named tokens — no arbitrary spacing values remain.
- [ ] The visual appearance of the app is functionally identical before and after migration (imperceptible rounding differences are acceptable).
- [ ] No component logic, layout structure, or behavior is modified.
- [ ] Third-party and auto-generated files are not modified.
- [ ] The token naming convention is documented (in `tailwind.config.js` comments or a dedicated reference) so that future components can follow it without ambiguity.
- [ ] The token architecture is considered the authoritative standard: no new component may introduce arbitrary color, typography, or spacing values.

---

## 8. Open Questions

- How will compliance of future components be enforced? (linting rule, review checklist, or convention only?)

---

## 9. Assumptions

- The codebase uses Tailwind CSS with a `tailwind.config.js` that can be extended with custom tokens.
- "First-party files" means all files authored by the MyBikeLab project team, excluding `node_modules/` and generated files.
- Minor rounding differences from pixel-to-rem conversion are acceptable as long as the visual output is imperceptibly different.
