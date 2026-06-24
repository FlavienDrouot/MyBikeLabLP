# Needs Assessment

## 1. General Information

- Evolution ID: EVO-009
- Title: Display typography and font-feature-settings
- Author: Flavien Drouot
- Date: 2026-05-26
- Status: Validated
- Priority: P0 (design system consistency)

---

## 2. Context

### Current situation

The design system defines a precise typographic signature for display headings:
- `.t-display-1`: `font-weight: 800` + `letter-spacing: -0.045em` + `line-height: 0.9`
- Body: `font-feature-settings: 'ss01', 'ss02', 'cv11'` (Inter alternate glyphs)

In the frontend, the Hero H1 uses `font-bold` (Tailwind, weight 700) + `tracking-tight` (≈ -0.025em). All section titles across components use the same `.section-title` class, which mirrors this incorrect treatment. The body element has no `font-feature-settings` applied.

### Identified problem

- Inter weight 800 is loaded but never used — the design system's intended visual weight is not rendered.
- The letter-spacing is -0.025em instead of -0.045em — the "considered density, almost Apple" signature is lost.
- Inter's stylistic alternates (ss01, ss02, cv11) are never activated — alternate glyphs that differentiate the product's typographic identity are invisible.

### Business motivation

Typography is the first signal of quality on a landing page. The current gap between the design system spec and its implementation makes the product look like generic SaaS rather than a premium tool for discerning cyclists. Correcting it costs zero network overhead (weight 800 is already loaded) and has an immediate visual impact on brand credibility.

---

## 3. Business Objective

Restore the full typographic signature of the design system as it was intended:
- Activate Inter's stylistic alternates on the body
- Apply the correct weight (800) and tracking (-0.045em) to all display headings

---

## 4. Scope

### Included

- Hero H1: apply `.t-display-1` treatment (font-weight 800, letter-spacing -0.045em)
- All `.section-title` elements across components: apply `.t-h1` treatment from the DS (single uniform level)
- Body: activate `font-feature-settings: 'ss01', 'ss02', 'cv11'`
- Components affected: `Hero`, `BenefitsGrid`, `RoadmapSection`, `PartnershipSection`, `MiniComparator`, `ContactForm`
- Use the `.t-*` semantic classes exposed by EVO-007 — no duplication into Tailwind config

### Excluded

- Responsive tracking variants — tracking is fixed at -0.045em at all screen sizes
- Typography sizing, leading, or general scale changes
- Loading additional font weights (weight 800 is already loaded)
- Any component not listed above

---

## 5. Constraints

### Business constraints

- No visual regression on the comparator table or form elements — only heading-level elements are in scope

### Known technical constraints

- EVO-007 must be complete and its `.t-*` classes available from the frontend (confirmed)
- Tracking -0.045em may appear tight on very small screens but is accepted as-is per product decision

### Regulatory / security constraints

- None

---

## 6. Use Cases

### Nominal case

As a visitor landing on MyBikeLab,
I want to see headings rendered with the full Inter 800 weight and tight tracking,
So that the page communicates premium quality and visual authority from the first glance.

### Alternative cases

- Visitor on mobile: same treatment, no responsive variant

### Known error cases

- None identified

---

## 7. Acceptance Criteria

- [ ] The Hero H1 renders at `font-weight: 800` and `letter-spacing: -0.045em` (verifiable in DevTools)
- [ ] The `body` element has `font-feature-settings: 'ss01', 'ss02', 'cv11'` applied (verifiable in DevTools)
- [ ] All `.section-title` elements use the `.t-h1` DS class (uniform treatment, no component uses `font-bold` for a section heading role)
- [ ] No component in scope remains on `font-bold` + `tracking-tight` for a display or section heading role
- [ ] No visual regression on the comparator table, filter panel, or form elements

---

## 8. Open Questions

- None — all questions resolved during interview

---

## 9. Assumptions

- EVO-007 has been completed and its `.t-*` semantic classes are importable from the frontend
- Inter weight 800 is already present in the loaded font (confirmed in init.md)
- `.t-h1` in the design system maps to weight 500 + tracking-tighter — to be verified against `colors_and_type.css` during Tech Specs
