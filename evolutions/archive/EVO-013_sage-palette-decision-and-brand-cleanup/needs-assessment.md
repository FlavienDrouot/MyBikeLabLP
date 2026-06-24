# Needs Assessment

## 1. General Information

- **Evolution ID:** EVO-013
- **Title:** Sage palette decision and brand cleanup
- **Author:** Flavien Drouot
- **Date:** 2026-05-27
- **Status:** Validated
- **Priority:** P2

---

## 2. Context

### Current situation

Two secondary palettes are in a suspended state in the frontend:

1. **`sage-*` declared but unused.** The palette is defined in `tailwind.config.js` and the design system, described as "quiet secondary neutral with a green cast" — intended for dividers, the partnership section, and muted status indicators. No React component currently references it.

2. **`brand-*` retired but still declared.** The original blue palette is marked "do not use" in `tailwind.config.js`. It was removed from all components during EVO-003 and EVO-006 but remains in the config file to "avoid build warnings." It is dead code.

### Identified problem

- `sage-*` has a defined purpose in the design system but no visible application. It exists as intent without expression.
- `brand-*` is explicitly retired but still occupies the config, creating noise and the risk of accidental future use by a contributor unfamiliar with its history.

### Business motivation

Four cleanup evolutions (EVO-002, 003, 005, 006) have progressively aligned the design system tokens with actual usage. EVO-013 closes the remaining gap: one palette needs to be applied, one needs to be deleted. Resolving both puts the design system palette layer in a fully consistent state — every declared color has a visible application, and no retired color remains as a footgun.

---

## 3. Business Objective

- Apply `sage-*` in its intended role as defined by the design system — used, visible, documented.
- Permanently remove the `brand-*` declaration from `tailwind.config.js`, eliminating dead code and any risk of inadvertent use.

---

## 4. Scope

### Included

- **Apply sage-***: targeted usage in PartnershipSection (dividers, muted accents) and muted status badges, as defined by the design system. A concise usage guide is documented in the PRD.
- **Verify brand-***: grep `src/` for any `brand-` class references to confirm no component depends on the palette.
- **Remove brand-***: if grep confirms no references, delete the `brand-*` declaration and its "RETIRED" comment from `tailwind.config.js`.
- If a `brand-*` reference is found: document it and open a dedicated follow-up EVO. Do not handle it within EVO-013.

### Excluded

- No refactoring of components beyond the targeted sage application.
- No changes to `paper-*`, `ink-*`, or `brass-*` palettes.

---

## 5. Constraints

### Business constraints

- No visual regression: all existing sections must look identical after the change except where sage is intentionally applied.
- The build must pass without Tailwind warnings after both changes.

### Known technical constraints

- EVO-007 (source-of-truth strategy for `tailwind.config.js`) is complete. No blocking dependency.

### Regulatory / security constraints

- None.

---

## 6. Use Cases

### Nominal case

As a contributor,
I want `sage-*` applied to its documented use cases and `brand-*` fully removed from the config,
So that every declared palette color has a visible, intentional application and no retired color can be accidentally referenced.

### Alternative cases

- Grep finds a `brand-*` reference in `src/`: the reference is noted, `brand-*` removal is excluded from this evolution, and a follow-up EVO is opened.

### Known error cases

- A `sage-*` class is applied in a component but the token is misconfigured — caught by a build check post-implementation.

---

## 7. Acceptance Criteria

- [ ] `sage-*` is applied in at least one component, consistent with the design system's definition of its role.
- [ ] A usage guide for `sage-*` is documented (in the PRD or an adjacent note).
- [ ] Grep on `src/` confirms zero `brand-50/100/200/500/600/700/900` references.
- [ ] The `brand-*` declaration and its "RETIRED" comment are deleted from `tailwind.config.js`.
- [ ] The build passes without Tailwind warnings.
- [ ] No visual regression in any section outside the intentional sage application.

---

## 8. Open Questions

None.

---

## 9. Assumptions

- The grep on `src/` will confirm no `brand-*` references, consistent with the outcomes of EVO-003 and EVO-006.
- The design system's definition of sage ("quiet secondary neutral with a green cast, for dividers, partnership section, and muted statuses") is the authoritative usage guide — no additional design decision is needed.
