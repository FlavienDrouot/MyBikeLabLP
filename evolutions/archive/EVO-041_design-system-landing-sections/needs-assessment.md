# Needs Assessment

## 1. General Information

- **Evolution ID:** EVO-041
- **Title:** Design system: Landing page sections
- **Author:** Flavien Drouot
- **Date:** 2026-06-03
- **Status:** Draft
- **Priority:** Medium

---

## 2. Context

### Current situation

The MyBikeLab landing page contains four marketing content sections — Hero, Benefits, Roadmap, and Partnership — each built with legacy styles predating the design system. These sections use an inconsistent visual language: photography, rounded cards with shadows, section-index labels, brand blue classes, and typography that does not follow the editorial rules established in the design system.

The Navbar and Footer will have been migrated to the design system (EVO-040) before this evolution ships. The foundation tokens (EVO-039) are in place.

### Identified problem

The four landing sections are visually inconsistent with the design system. This creates a fragmented experience: the Navbar and Footer speak the design system language while the marketing content between them does not. The landing page is the primary B2B credibility tool for outreach to brands and retailers — visual incoherence undermines trust.

### Business motivation

The design system migration is progressing section by section (EVO-039 → EVO-040 → EVO-041). Completing the landing sections closes the visible gap on the most public-facing surface of the product. A fully coherent landing page is a prerequisite for credible brand outreach.

---

## 3. Business Objective

Bring all four landing page sections into full design system compliance: schematic grid Hero, hairline Benefits cards, keyline Roadmap cards, ink-inverse Partnership section, correct typography and voice throughout — resulting in a visually unified page that matches the design system reference.

---

## 4. Scope

### Included

- **Hero section** — schematic grid background, display typography, brass CTA, no photography
- **Benefits section** — hairline card layout, design system typography
- **Roadmap section** — keyline card layout, no section-index labels, editorial voice
- **Partnership section** — sage/ink-inverse card variant per design system rules
- **Landing.jsx orchestration** — section spacing, max-width, gutters

### Excluded

- No other landing sections exist; the four named sections are the complete scope
- No copy rewrites beyond compliance with voice rules (no em-dash, no exclamation marks)
- Navbar and Footer (covered by EVO-040)
- Wheel Comparator section
- Any backend, data, or routing changes

---

## 5. Constraints

### Business constraints

- EVO-039 (foundation tokens) is complete and must be used — no new token invention
- EVO-040 (Navbar/Footer) is complete by the time this evolution ships — visual context is consistent

### Known technical constraints

- All changes must pass i18n: French and English variants must both comply with voice and visual rules
- No legacy blue/brand CSS classes may remain in any affected component after migration

### Regulatory / security constraints

- None

---

## 6. Use Cases

### Nominal case

As a visitor landing on MyBikeLab for the first time,
I want to see a visually coherent page with a clear schematic aesthetic,
So that I immediately perceive the product as credible and technically serious.

### Alternative cases

- Visitor reads the page in French — all sections display correctly in FR with the same visual rules applied

### Known error cases

- None identified at business level

---

## 7. Acceptance Criteria

- [ ] Hero section uses the schematic grid background (no photography), display typography, and a brass-accented CTA
- [ ] Benefits section cards match the hairline card flavor (`paper-0`, `1px solid ink-4` border, no radius, no shadow)
- [ ] Roadmap section cards match the keyline card flavor (no outer border, `1px solid ink-10` top rule)
- [ ] Partnership section uses the sage or ink-inverse card variant per design system rules
- [ ] No section-index labels appear anywhere on the page (`01 / 03`, `Phase 01`, or equivalent)
- [ ] No em-dash, en-dash, or exclamation mark appears in any prose copy (FR or EN)
- [ ] No legacy blue/brand CSS classes remain in any landing component
- [ ] All sections render correctly in both FR and EN

---

## 8. Open Questions

- None — scope and constraints fully resolved during interview

---

## 9. Assumptions

- EVO-039 foundation tokens are available and stable; no token changes will be required by this evolution
- EVO-040 Navbar/Footer migration is complete before this evolution ships
- The four named sections (Hero, Benefits, Roadmap, Partnership) are the complete set of marketing content sections in Landing.jsx — confirmed during interview
