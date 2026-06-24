# Needs Assessment

## 1. General Information

- **Evolution ID:** EVO-014
- **Title:** Rule utilities, motion tokens & annotation style
- **Author:** Flavien Drouot
- **Date:** 2026-05-27
- **Status:** In Progress
- **Priority:** P2 (design system coherence — non-blocking, no user-facing feature gap)

---

## 2. Context

### Current situation

Three design system primitives are defined in `design-system/colors_and_type.css` but not consumed by the frontend:

1. **Rule utilities** (`.rule`, `.rule-strong`, `.rule-faint`, `.rule-double`) — hairline divider classes that express visual hierarchy through keylines. The frontend currently applies bare Tailwind border tokens (`border-b border-ink-3`, `border-ink-4`, `divide-y divide-ink-3`) component by component, with no shared abstraction.

2. **Motion tokens** — four duration variables (`instant` 80ms, `quick` 140ms, `base` 220ms, `slow` 400ms`) and two easing curves (`ease-standard`, `ease-emphasized`). The frontend uses only Tailwind's default `transition-colors` (150ms, `ease` — a softer cubic-bezier unrelated to the DS standard).

3. **`.t-annotation`** — an italic Inter class for low-emphasis disclaimer text. The wheel dataset contains indicative prices (sourced Q2 2025) that carry no annotation in the UI; users have no way to know prices are approximate.

### Identified problem

The design system defines the rules for keylines, motion, and data annotations, but the frontend ignores all three — creating a coherence gap between what the DS specifies and what ships. Additionally, displaying indicative prices without any label is a data transparency issue for the user.

### Business motivation

- **Design coherence**: the DS principle "keylines do the work" requires rule classes to be the single source for divider styling; ad-hoc border values fragment that contract.
- **Motion quality**: the DS easing curves are tighter and more intentional than Tailwind defaults; adopting them improves perceived UI responsiveness and consistency.
- **User trust**: prices are indicative and sourced from a specific dataset; not labelling them reduces credibility and could mislead users comparing costs.

---

## 3. Business Objective

Expose the three existing DS primitives to the frontend and apply them where they have immediate value — improving visual consistency, interaction quality, and data transparency — without restructuring any component.

---

## 4. Scope

### Included

- **Rule utilities:** make `.rule`, `.rule-strong`, `.rule-faint`, `.rule-double` available in the frontend; replace ad-hoc dividers in at least 3 key components (Footer, RoadmapSection, ComparisonTable header) with the appropriate rule class.
- **Motion tokens:** expose the four duration and two easing tokens to Tailwind; replace default-duration hover transitions on interactive elements (Navbar links, buttons, table rows) with the appropriate token pair.
- **`.t-annotation`:** expose the class and apply it as always-visible sub-text on indicative prices in at least the ComparisonTable and WheelDetailPanel.

### Excluded

- No structural or layout refactoring of any component.
- No new animations (slide-ins, fades, scroll effects) that do not exist today.
- No changes to the WheelDetailPanel beyond the annotation addition.

---

## 5. Constraints

### Business constraints

- EVO-007 (DS token source-of-truth wiring) is a prerequisite and is fully implemented — no blocking dependency.

### Known technical constraints

- None. All three primitives are already defined in the DS; this evolution only exposes and wires them.

### Regulatory / security constraints

- None.

---

## 6. Use Cases

### Nominal cases

**Keylines:**
As a visitor browsing the page, I see visually consistent hairline separators between sections and table rows, without noticing any variation in thickness or color between components.

**Motion:**
As a user hovering over Navbar links, action buttons, or table rows, I perceive transitions that are snappy and consistent — neither sluggish nor jarring.

**Annotation:**
As a user reading prices in the comparison table or wheel detail panel, I see a small italic label below each price indicating it is indicative and sourced from a specific period — without needing to hover or take any action.

### Alternative cases

- A component that already uses a rule class (if any) is left unchanged.
- A component with no dividers or transitions is out of scope.

### Known error cases

- None anticipated — this evolution applies existing classes; no new logic is introduced.

---

## 7. Acceptance Criteria

- [ ] At least 3 components use a `.rule*` class in place of an ad-hoc `border-*` or `divide-*` Tailwind value.
- [ ] Hover transitions on interactive elements (at minimum: Navbar links, primary buttons, table rows) use the DS duration and easing tokens instead of Tailwind defaults.
- [ ] An always-visible italic annotation (e.g. *indicative price, sourced 2025-Q2*) is displayed as sub-text below or adjacent to prices in both the ComparisonTable and the WheelDetailPanel.
- [ ] No component loses any existing functionality.
- [ ] No perceptible regression in transition feel (durations remain in the 80–400ms range; the tighter easing should feel crisper, not broken).

---

## 8. Open Questions

None — resolved during interview:
- **Annotation visibility**: always-visible sub-text (not hover-only).

---

## 9. Assumptions

- The annotation text reads: *indicative price, sourced 2025-Q2*.
- EVO-007 fully exposed DS tokens to the frontend; no additional token wiring is needed as part of this evolution.
- The `.t-annotation` class may appear in both table cells and the detail panel without visual inconsistency, as both surfaces use the same typeface and token palette.
