# Needs Assessment

## 1. General Information

- Evolution ID: EVO-039
- Title: Design system — foundation tokens
- Author: Flavien Drouot
- Date: 2026-06-03
- Status: Draft
- Priority: High (prerequisite for EVO-040–043)

---

## 2. Context

### Current situation

The design system source of truth lives in `design-system/colors_and_type.css`. The live codebase (`frontend/src/index.css` and `frontend/tailwind.config.js`) holds an older copy of the token declarations. Nothing is visually broken — the live code still carries its own token values — but the two are now diverged silently.

### Identified problem

The design system was updated: new tokens were added and some legacy tokens were superseded. The live codebase has not been synchronized. As a result, EVO-040 through EVO-043 cannot reliably target design system tokens — they would be building on a stale foundation.

### Business motivation

EVO-039 is the prerequisite for the entire design system rollout (EVO-040–043). Without a synchronized token layer, each subsequent evolution would risk inconsistency or would need to carry its own token patches. Synchronizing now establishes a single authoritative baseline before component-level work begins.

---

## 3. Business Objective

Bring the live codebase into full alignment with the updated design system, so that all subsequent evolutions (EVO-040–043) can apply component styles confidently against a stable, complete token set — with no per-evolution token patching required.

---

## 4. Scope

### Included

- Synchronize `frontend/src/index.css` with the updated CSS custom properties from `design-system/colors_and_type.css`
- Update `frontend/tailwind.config.js` to expose updated tokens as Tailwind utilities (color scales, spacing, radii, shadows)
- Verify that JetBrains Mono is correctly wired through the Tailwind config and global baseline
- Verify and clean up legacy `brand-*` blue token declarations (likely already removed; confirm and remove any remaining occurrences)
- Apply updated global baseline rules (`body`, `::selection`, `:focus-visible`, `.rule` utilities)
- Propagate intentional visual changes introduced by the design system update

### Excluded

- Component-level styling (covered by EVO-040–043)
- Any changes to `design-system/colors_and_type.css` itself — it is read-only for this evolution

---

## 5. Constraints

### Business constraints

- Must not introduce unintended visual regressions on existing components — intentional visual changes from the token update are expected and welcome, but nothing should break unexpectedly

### Known technical constraints

- `design-system/colors_and_type.css` is the read-only source of truth; the live code must conform to it, not the other way around
- The legacy `brand-*` tokens may already have been removed; the task is to verify and clean up any remaining occurrences, not assume they are present

### Regulatory / security constraints

- None

---

## 6. Use Cases

### Nominal case

As a developer working on EVO-040 through EVO-043,
I want all design system tokens to be available as Tailwind utilities and CSS custom properties in the live codebase,
So that I can apply component styles directly without patching tokens or working around stale values.

### Alternative cases

- A token expected by a component already exists under a different name — the synchronization resolves the naming to match the design system
- JetBrains Mono is already partially applied — the task verifies correct wiring rather than adding it from scratch

### Known error cases

- A live component references a legacy token that no longer exists after synchronization — this should surface as a visible gap and be flagged, not silently ignored

---

## 7. Acceptance Criteria

- [ ] All CSS custom properties from `design-system/colors_and_type.css` are present on `:root` in the production build
- [ ] Tailwind utilities map to design system tokens for all updated scales (colors, spacing, radii, shadows) — no raw hex values needed in component classes
- [ ] JetBrains Mono loads correctly and is accessible via the Tailwind font-family utility and `.t-mono` / `.t-numeric` classes
- [ ] Global baseline rules (`body`, `::selection`, `:focus-visible`, `.rule`) match `design-system/colors_and_type.css`
- [ ] No `brand-*` blue token declarations remain anywhere in the frontend config or global stylesheet
- [ ] No unintended visual regressions on existing components (intentional changes from the token update are expected)

---

## 8. Open Questions

- Are there any `brand-*` token references still present in `frontend/tailwind.config.js` or `frontend/src/index.css`, or were they already cleaned up in an earlier evolution?
- Is JetBrains Mono loading via a Google Fonts `@import` already in `index.css`, or through another mechanism?

---

## 9. Assumptions

- `design-system/colors_and_type.css` reflects the final, validated state of the design system update — no further changes are expected before EVO-039 is implemented
- Intentional visual changes introduced by the token update are acceptable to propagate; the constraint is against *unintended* regressions only
- EVO-040 through EVO-043 will not begin implementation until EVO-039 is complete
