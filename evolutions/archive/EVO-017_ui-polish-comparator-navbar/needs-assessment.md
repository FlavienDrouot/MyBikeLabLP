# Needs Assessment

## 1. General Information

- Evolution ID: EVO-017
- Title: UI polish — comparator and navbar fixes
- Author: Flavien Drouot
- Date: 2026-05-27
- Status: Draft
- Priority: Medium

---

## 2. Context

### Current situation

The landing page contains a Hero section, a MiniComparator (FilterPanel + ComparisonTable + ColumnSelector), and a Navbar with a logo. Several small but visible UI issues have accumulated:

- The Hero section stat line ("15 road wheels · 13 filter axes") is rendered twice in the same section.
- The ColumnSelector button sits above the ComparisonTable and pushes it down, while the FilterPanel has no equivalent element above it — causing the two components to start at different vertical positions despite sharing the same section margins.
- The ColumnSelector button has no hover transition, breaking the interaction consistency established by other buttons in the design system.
- When a wheel detail drawer is open, there is no visual separator between the bottom of the drawer and the card of the next wheel below it, making the boundary ambiguous.
- The Navbar logo and the Footer logo are rendered with hardcoded markup instead of the DS SVG assets (`logo-wordmark.svg` and `logo-mark.svg`).

### Identified problem

Five discrete visual inconsistencies degrade the perceived quality and coherence of the interface:

1. **Hero duplicate stat** — the same stat line appears twice, creating visual noise and redundancy.
2. **FilterPanel / ComparisonTable vertical misalignment** — the ColumnSelector button shifts the ComparisonTable downward, breaking the visual alignment between the two sibling components.
3. **ColumnSelector button missing hover transition** — inconsistent with the rest of the interaction model.
4. **Detail drawer bottom boundary undefined** — no demarcation between the open drawer and the next wheel card.
5. **Logo not using DS assets** — Navbar and Footer logos bypass the design system's canonical SVG files.

### Business motivation

These issues are visible to every visitor on the live site. They signal a lack of finish and undermine the credibility that MyBikeLab needs as a B2B outreach tool toward brands and retailers.

---

## 3. Business Objective

Fix the five identified visual inconsistencies to bring the interface to a consistent, polished state aligned with the design system.

---

## 4. Scope

### Included

- Remove the duplicate stat line in the Hero section (keep one instance).
- Align the tops of FilterPanel and ComparisonTable — the ColumnSelector button must not cause a vertical offset between the two.
- Add a hover transition to the ColumnSelector button, consistent with the DS interaction model.
- Add a visual separator at the bottom of the wheel detail drawer to clearly demarcate it from the next wheel card.
- Replace the Navbar logo with `logo-wordmark.svg` from `design-system/assets/`.
- Replace the Footer logo with `logo-mark.svg` from `design-system/assets/`.

### Excluded

- Changes to the stat values themselves (numbers remain as-is).
- Redesign of the Hero layout beyond removing the duplicate.
- Changes to the detail drawer content or behavior.
- Any other component not listed above.

---

## 5. Constraints

### Business constraints

- All fixes must remain consistent with the existing design system tokens (`paper-*`, `ink-*`, `brass-*`, `sage-*`, `radius-*`).

### Known technical constraints

- None identified at this stage.

### Regulatory / security constraints

- None.

---

## 6. Use Cases

### Nominal case

As a visitor browsing the landing page,
I want to see a clean, consistent interface where each component is properly delimited and interactive elements respond visually to my actions,
so that the product feels trustworthy and finished.

### Alternative cases

- None.

### Known error cases

- None.

---

## 7. Acceptance Criteria

- [ ] The Hero section stat line ("15 road wheels · 13 filter axes") appears exactly once.
- [ ] The top edge of the FilterPanel and the top edge of the ComparisonTable are vertically aligned.
- [ ] Hovering the ColumnSelector button produces a visible transition (consistent with other DS buttons).
- [ ] When a detail drawer is open, a clear visual separator is visible between the bottom of the drawer and the card of the next wheel.
- [ ] The Navbar logo renders `logo-wordmark.svg`.
- [ ] The Footer logo renders `logo-mark.svg`.
- [ ] No existing design system tokens or interaction patterns are violated by any of the fixes.

---

## 8. Open Questions

- None.

---

## 9. Assumptions

- The stat line in the Hero is static text; no dynamic rendering is involved.
- `logo-wordmark.svg` and `logo-mark.svg` are production-ready and self-contained (no external dependencies).
- The detail drawer separator should use existing DS tokens (e.g., a border or surface change) rather than introducing a new visual pattern.
