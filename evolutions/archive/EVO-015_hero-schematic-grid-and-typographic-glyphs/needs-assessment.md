# Needs Assessment — EVO-015

## 1. General Information

- **Evolution ID:** EVO-015
- **Title:** Hero schematic grid and typographic glyphs
- **Author:** Flavien Drouot
- **Date:** 2026-05-27
- **Status:** Validated
- **Priority:** Medium — depends on EVO-007 (tokens) and EVO-008 (copy/CTAs)

---

## 2. Context

### Current situation

The Hero section (`Hero.jsx`) is a flat surface with no background pattern. CTAs are plain text links without directional indicators. Data values in the ComparisonTable and WheelDetailPanel use plain `number + unit` formatting (e.g., `700C`, `1450 g`).

### Identified problem

Two visual signatures specified by the design system are absent from the frontend:

1. **Schematic grid** — the DS spec defines a ruled grid in `ink-2` as the single decorative background element, used exclusively on the Hero to evoke drafting paper / engineering blueprint. It is currently not implemented.
2. **Typographic glyphs** — the DS prefers `→`, `Ø`, `№`, `±`, `≈` over icon-based UI in compact contexts. No CTA carries a trailing `→`; wheel diameters are not prefixed with `Ø`.

### Business motivation

These signatures reinforce the "engineering precision" identity that differentiates MyBikeLab from generic comparison tools. The Hero is the first thing a visitor sees; the grid and glyph consistency signal that the product is technically credible — directly supporting the B2B credibility objective (brand partnership outreach).

---

## 3. Business Objective

Bring the frontend into alignment with the design system's visual signature spec: add the schematic grid to the Hero background and adopt typographic glyphs in CTAs and wheel data display.

---

## 4. Scope

### Included

- **Schematic grid on Hero** — 32 px ruled grid in `ink-2`, CSS-only (`background-image: linear-gradient(...)`), applied to the Hero section only, same rendering on all viewport sizes.
- **`→` on main CTAs** — all primary CTA links display a trailing `→`. Applies to Hero CTAs (partly covered by EVO-008) and extended here to non-Hero CTAs: BenefitsGrid, RoadmapSection, and any other CTA outside the Hero.
- **`Ø` prefix on wheel diameter** — wheel diameter values rendered as `Ø 700C` in ComparisonTable and WheelDetailPanel. Formatting applied at the component/accessor level, not in `wheelsData.js`.

### Excluded

- **`Ø` on rim depth** — depth is a linear measurement, not a diameter. Depth stays as `33 mm`.
- **`±` tolerance formatting** — no tolerance data exists in the current dataset. Formatting rule deferred to the evolution that introduces tolerance data.
- **Schematic SVG wheel diagram on Hero** — reserved for the wheel-detail page (future evolution).
- **Hero layout changes** — no structural changes beyond the background.
- **Copy rewrite** — owned by EVO-008.

---

## 5. Constraints

### Business constraints

- The grid must be subtle and non-distracting — it is a background texture, not a foreground element.
- The grid must appear only on the Hero, not bleed into other sections.

### Known technical constraints

- Grid implementation must be CSS-only (no SVG asset) for performance.
- No CLS (Cumulative Layout Shift) introduced on the Hero — Lighthouse regression not acceptable.
- `ink-2` token must be available (depends on EVO-007).
- Unicode glyphs (`→`, `Ø`) must render correctly in Inter (confirmed: Inter covers these code points).

### Regulatory / security constraints

None.

---

## 6. Use Cases

### Nominal case

As a visitor landing on the page,
I see a subtle 32 px grid in the Hero background evoking drafting paper,
so that the product immediately communicates technical precision.

As a visitor reading the Hero CTAs,
I see "Open comparator →" and "See the roadmap →",
so that the directional intent of each action is visually clear.

As a user reading the wheel comparison table,
I see wheel diameters formatted as "Ø 700C",
so that the data reads as a precise engineering specification.

### Alternative cases

- User visits on a narrow mobile viewport — grid renders at the same 32 px cell size and opacity (no mobile override).

### Known error cases

- `ink-2` token undefined (EVO-007 not complete) — grid falls back to transparent lines (invisible). EVO-007 must be done first.

---

## 7. Acceptance Criteria

- [ ] The Hero renders a 32 px ruled grid in `ink-2`, visible to the eye but non-distracting.
- [ ] The grid appears only on the Hero section; no other section shows a grid background.
- [ ] The grid renders at 32 px on all viewport sizes (no mobile override).
- [ ] All main CTAs outside the Hero (BenefitsGrid, RoadmapSection, etc.) display a trailing `→`.
- [ ] Wheel diameter is rendered as `Ø 700C` (or equivalent) in ComparisonTable and WheelDetailPanel.
- [ ] Rim depth values remain as `33 mm` — no `Ø` prefix.
- [ ] Numeric data values remain in `font-mono tabular-nums` (no regression).
- [ ] Lighthouse audit on the Hero shows no Performance or CLS regression after the grid is added.

---

## 8. Open Questions

None — all ambiguities resolved during Needs Assessment interview (2026-05-27).

---

## 9. Assumptions

- EVO-007 is complete and `ink-2` is correctly wired as a CSS custom property.
- EVO-008 handles Hero CTA copy and `→` on Hero CTAs; EVO-015 extends `→` to non-Hero CTAs only.
- Glyph formatting (`Ø`, `→`) is applied at the component/accessor layer — `wheelsData.js` data values remain plain strings.
