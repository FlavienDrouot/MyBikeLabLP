# Needs Assessment

## 1. General Information

- **Evolution ID:** EVO-011
- **Title:** Radii semantics and surface hierarchy alignment
- **Author:** Flavien Drouot
- **Date:** 2026-05-26
- **Status:** In assessment
- **Priority:** High (P1-4, P1-6, P2-1 from the 2026-05-26 design system audit)

---

## 2. Context

### Current situation

The design system (`design-system/colors_and_type.css`) codifies strict rules for border radii and surface tokens:
- **Radii:** `0` for cards, panels, and tables; `2px` (`radius-xs`) for inputs and buttons; `999px` (`radius-pill`) reserved exclusively for status pill badges.
- **Surfaces:** `--bg-page = paper-1` (page background); `paper-0` reserved for elevated cards; `paper-2` for recessed wells (table headers, filter wells).
- **Navbar:** `paper-1` at 88% opacity with 8px backdrop blur.

### Identified problem

Three categories of deviation from the design system grammar have been identified:

1. **Incorrect pill usage** — `rounded-full` is applied to filter pills (multi-select), the Hero MVP badge, and icon buttons (close drawer). None of these are status badges; the semantic distinction between "status pill" and other rounded elements is lost.
2. **Inverted Hero surface** — The Hero section forces `bg-paper-0`, making the page background appear elevated — the opposite of the intended hierarchy.
3. **Incorrect Navbar surface** — The Navbar uses `bg-paper-0/80` (wrong token, wrong opacity) instead of the specified `paper-1` at 88% opacity.

### Business motivation

Visual inconsistency undermines the perceived quality and professionalism of the product. The inverted surface hierarchy in the Hero is a visible defect on the primary landing page. Restoring the design system grammar ensures visual coherence — critical for a product whose credibility depends on trust signals (used for B2B outreach to manufacturers and retailers).

---

## 3. Business Objective

Restore the design system's radius and surface grammar so that:
- The pill shape is reserved exclusively for status badges.
- The page background is visually flat and consistent (Hero inherits the page surface color).
- The Navbar renders at the correct surface token and opacity.

---

## 4. Scope

### Included

- Audit all `rounded-full` usages in `frontend/src/components/` and classify each:
  - **Preserve:** HookBadge (Hookless / Hooked status badge) and circular avatar/brand logos where the circle is semantically meaningful.
  - **Change to `rounded-xs`:** filter pills (multi-select), Hero MVP badge, icon buttons (close drawer).
- Remove `bg-paper-0` from the Hero — let it inherit `bg-paper-1` from the body.
- Align the Navbar to `paper-1` at 88% opacity with 8px backdrop blur.
- Verify that card components continue to use `bg-paper-0` (correct elevation).

### Excluded

- No palette changes (covered by EVO-007, completed).
- No component redesign beyond radius and surface token corrections.
- No content or layout restyling.
- HookBadge remains a status pill (`rounded-full` preserved).

---

## 5. Constraints

### Business constraints

- Must not break the visual hierarchy between page background and elevated cards.
- Must not reduce accessibility: contrast ratios on filter pills and badges must remain compliant after the change.

### Known technical constraints

- EVO-007 (design token setup) is complete — `radius-xs` and `paper-*` Tailwind tokens are available.
- EVO-008 (Hero content rewrite) is complete — no merge conflict risk.

### Regulatory / security constraints

- None.

---

## 6. Use Cases

### Nominal case

As a visitor to the MyBikeLab landing page,
I want the visual hierarchy to match the intended design (flat page, elevated cards, status badges as pills),
So that the interface feels polished and trustworthy.

### Alternative cases

- An icon button (e.g., close MiniComparator drawer) renders with square corners consistent with other interactive elements.
- A filter pill in multi-select mode renders without the pill shape, consistent with the design system grammar for filters.

### Known error cases

- A status badge (HookBadge) must not be incorrectly changed to `rounded-xs` — it is a legitimate status pill.

---

## 7. Acceptance Criteria

- [ ] All `rounded-full` usages in `frontend/src/components/` are inventoried; each is either retained (status badge or circular avatar) or changed to `rounded-xs`.
- [ ] The Hero section renders on the same background color as the rest of the page (`bg-paper-1`), with no visible elevation difference between the Hero area and the surrounding page.
- [ ] The Navbar renders at `rgba(246,244,239,0.88)` with 8px backdrop blur.
- [ ] Card components continue to render with `bg-paper-0` (elevated, visually distinguishable from the page background) — verified by visual inspection.
- [ ] No accessibility regression: contrast ratios on filter pills and status badges remain compliant after the change.

---

## 8. Open Questions

None. EVO-007 and EVO-008 are confirmed complete.

---

## 9. Assumptions

- `rounded-xs` (2px) is available as a Tailwind utility class via the EVO-007 token setup.
- The HookBadge is a legitimate status pill and must remain `rounded-full`.
- No circular avatar/brand logos currently exist in the components — the audit step will confirm this.
