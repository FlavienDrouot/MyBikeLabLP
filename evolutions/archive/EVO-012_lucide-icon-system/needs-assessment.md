# Needs Assessment

## 1. General Information

- **Evolution ID:** EVO-012
- **Title:** Lucide as the canonical icon system
- **Author:** Flavien Drouot
- **Date:** 2026-05-27
- **Status:** Draft
- **Priority:** High (P1-5 from design system audit)

---

## 2. Context

### Current situation

The frontend has no shared icon system. Each component defines its own inline SVGs (`<svg>` tags written directly in JSX). The affected components are: `Navbar` (hamburger), `MiniComparator` (close drawer, filter button), `FilterPanel` (accordion chevrons, multi-select check), `ComparisonTable` (expand-row chevron, sort indicator), `ColumnSelector` (toggle chevron), `ContactForm` (success check), and `Footer` (possible social links).

### Identified problem

Inline SVG stroke values, sizes, stroke-linecap, and stroke-linejoin vary from component to component. Changing a visual convention (e.g. adjusting chevron stroke weight) requires editing multiple files. The current state violates the Design System's Iconography rules.

### Business motivation

The Design System prescribes Lucide as the single icon library, with a precise technical style: `stroke-width: 1.4`, `stroke-linecap: square`, `stroke-linejoin: miter`. This aesthetic is intentional — it supports the "drafting / technical" brand voice. Until the frontend implements this system, the product is visually inconsistent with its own design standard.

---

## 3. Business Objective

Establish a single, maintainable icon system across the frontend: one library (Lucide React), one set of visual conventions, applied uniformly to all UI icons. Changing any icon convention in the future should require editing one place, not many.

---

## 4. Scope

### Included

- Install `lucide-react` as a frontend dependency (tree-shaken, not CDN)
- Define a wrapper component or shared convention that enforces DS stroke defaults (`stroke-width: 1.4`, `stroke-linecap: square`, `stroke-linejoin: miter`, `color: currentColor`)
- Inventory all inline SVG icons in `src/components/`
- Replace each ad-hoc inline SVG with its Lucide equivalent:
  - Hamburger / menu (Navbar)
  - Chevron up / down (FilterPanel sections, sort indicator, dropdowns)
  - Check (MultiSelect, ColumnSelector)
  - X / close (mobile drawer)
  - Arrow-right / chevron-right (CTA links)

### Excluded

- `assets/wheel-schematic.svg` and any other schematic illustrations — these are not UI icons
- Brand icons (X/Twitter, GitHub, etc.) — must keep their original stroke
- Layout or structural changes to any component beyond the icon itself

---

## 5. Constraints

### Business constraints

- All UI icons must comply with DS Iconography rules: `stroke-width: 1.4`, `stroke-linecap: square`, `stroke-linejoin: miter`, `currentColor`
- No layout regression is acceptable in any affected component

### Known technical constraints

- Loading mode: tree-shaken imports via `lucide-react` only — CDN is excluded
- Bundle size: the icon addition must remain below 15 KB (tree-shaken total)

### Regulatory / security constraints

- None

---

## 6. Use Cases

### Nominal case

As a developer adding an icon to a component,
I want to use a standard import or wrapper,
So that the icon renders with the correct DS style without any per-use configuration.

### Alternative cases

- A component uses multiple icons of different sizes — all must inherit DS defaults regardless of size

### Known error cases

- An SVG illustration (wheel schematic) is mistakenly treated as a UI icon — excluded by scope

---

## 7. Acceptance Criteria

- [ ] `lucide-react` is installed as a dependency in `frontend/package.json`
- [ ] No ad-hoc inline `<svg>` remains in `src/components/` for UI icons (hamburger, chevron, check, close, arrow)
- [ ] All UI icons render with `stroke-width="1.4"`, `stroke-linecap="square"`, `stroke-linejoin="miter"`
- [ ] All UI icons inherit color via `currentColor`
- [ ] The bundle addition from icons is tree-shaken and verified below 15 KB
- [ ] No layout regression in any affected component (visual check during implementation)

---

## 8. Open Questions

None — all open questions resolved during Needs Assessment.

---

## 9. Assumptions

- Lucide React provides icon equivalents for all current inline SVGs (Menu, ChevronUp, ChevronDown, ChevronRight, Check, X, ArrowRight)
- Visual regression validation is a manual check during implementation — it is not a formal automated criterion
- The wheel schematic in `assets/` is explicitly out of scope and must not be touched
- Confirmed library: **Lucide React** (`lucide-react` via npm) — Phosphor and Tabler were considered and ruled out
