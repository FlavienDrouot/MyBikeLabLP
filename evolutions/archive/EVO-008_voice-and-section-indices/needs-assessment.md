# Needs Assessment

## 1. General Information

- Evolution ID: EVO-008
- Title: Voice alignment and section indices
- Author: Flavien Drouot
- Date: 2026-05-26
- Status: Draft
- Priority: High

---

## 2. Context

### Current situation

The MyBikeLab landing page contains copy that was written before the design system voice was formally defined. The Hero section displays "The Future of Bike Component Intelligence" and a secondary CTA "See the Vision". No section of the landing page uses a section index (`№ NN · LABEL`). The Hero eyebrow uses a `rounded-full` pill style with marketing-style content.

### Identified problem

The landing page copy violates two rules from the design system:

1. **Voice rule**: the design system specifies a "neutral, technical, slightly nerdy" voice (Wirecutter / DPReview style), explicitly prohibiting marketing buzzwords such as "future of", "intelligence", "revolutionary", "game-changer". The current Hero title and secondary CTA break this rule directly.
2. **Section index signature**: the design system prescribes a visual signature — each section opened by a flat index in JetBrains Mono, format `№ NN · LABEL` (`.t-section-index`). This signature is absent from all sections.

### Business motivation

The landing page is partly a B2B credibility tool (outreach to manufacturers and retailers). Copy that relies on marketing clichés undermines the platform's positioning as a neutral, data-driven tool. Credibility is a core product value; the voice must reflect it from first contact.

---

## 3. Business Objective

Align the landing page copy with the design system voice and introduce section indices as a transversal visual signature, making the page credible, consistent, and ready for partner outreach.

---

## 4. Scope

### Included

- Rewrite of all visible copy: Hero (eyebrow, title, lead, CTAs), BenefitsGrid, MiniComparator (section title and subtitle), RoadmapSection, PartnershipSection, Footer.
- Hero eyebrow content replaced with flat text: `№ 01 · MVP v0.1 · Road wheels` (radius/pill style handled in EVO-011).
- Section indices added at the top of each content section:
  - `№ 01 · MVP v0.1 · Road wheels` — Hero eyebrow
  - `№ 02 · COMPARATOR` — MiniComparator
  - `№ 03 · ROADMAP` — RoadmapSection
  - `№ 04 · BENEFITS` — BenefitsGrid
  - `№ 05 · PARTNERSHIP` — PartnershipSection
  - Footer: no section index (utility section)
- Replacement of all marketing phrasing with factual formulations (e.g. "15 wheels, 13 axes" rather than "ultimate comparison").
- Adoption of relevant typographic glyphs in copy (`→` for link CTAs, `·` as separator, `№` for indices).
- `<title>` and `<meta name="description">` in `frontend/index.html` updated to reflect the new voice.
- Review and update of `product-overview.md` if any terms deviate from the new copy.

### Excluded

- Structural typographic changes (weight, tracking) — covered by EVO-009.
- Radius / surface modifications — covered by EVO-011.
- MiniComparator data (only visible copy: section titles, subtitles, labels).
- Glyphs in data fields — covered by EVO-015.

---

## 5. Constraints

### Business constraints

- EVO-015 (hero grid schema) partially depends on this evolution (refined eyebrow). EVO-008 must be completed before EVO-015 starts.

### Known technical constraints

- Hero eyebrow: only content changes; the `rounded-full` CSS class must not be removed (EVO-011 scope).
- Section index rendering must use `.t-section-index` CSS class (or equivalent mono caps) as specified in the design system.

### Regulatory / security constraints

- None.

---

## 6. Use Cases

### Nominal case

As a visitor arriving on the MyBikeLab landing page,  
I want to read copy that is factual and credible, with each section clearly indexed,  
So that I trust the platform's data-driven approach rather than perceiving it as another marketing site.

### Alternative cases

- As a potential brand or retail partner, I want the landing page tone to match the platform's B2B credibility positioning, so that I take the partnership proposal seriously.

### Known error cases

- None identified.

---

## 7. Acceptance Criteria

- [ ] No occurrence of forbidden words in visible copy: "future of", "intelligence", "revolutionary", "game-changer", "blazingly", "ultimate".
- [ ] No emojis anywhere in product-facing surfaces (Hero, Benefits, Roadmap, Partnership, Footer, MiniComparator).
- [ ] No exclamation marks in product surfaces.
- [ ] Each content section opens with a section index `№ NN · LABEL` rendered in `.t-section-index` (or equivalent mono caps), following the validated numbering: 01 Hero eyebrow, 02 COMPARATOR, 03 ROADMAP, 04 BENEFITS, 05 PARTNERSHIP.
- [ ] Hero title aligns with design system model ("Wheels, measured. Not marketed." or a PRD-validated variant).
- [ ] All CTAs carry sentence-case labels ("Open comparator", "See the roadmap").
- [ ] `<title>` and `<meta name="description">` in `index.html` reflect the new voice (no forbidden words, no emojis).
- [ ] `product-overview.md` reviewed and updated where terms deviate from the new copy.

---

## 8. Open Questions

- None remaining after interview.

---

## 9. Assumptions

- The design system voice rules are stable and will not change during EVO-008 implementation.
- The exact Hero title will be validated during the PRD phase; "Wheels, measured. Not marketed." is a starting point, not a final constraint.
- Sentence-case rule applies to all CTAs across all sections, not only the Hero.
