# Needs Assessment

## 1. General Information

- Evolution ID: EVO-018
- Title: Copy and typography — UI guidelines compliance
- Author: Flavien Drouot
- Date: 2026-05-27
- Status: Draft
- Priority: Medium

---

## 2. Context

### Current situation

The landing page copy contains several violations of the UI guidelines introduced in `shared-knowledge/ui-guidelines.md`:

- Two text blocks use em-dashes (`—`) in editorial prose, which is a banned punctuation pattern.
- All five section eyebrows use a numbered format (`№ 0N · LABEL`) that the guidelines explicitly ban.
- The version string `MVP v0.1` appears in the MiniComparator footer note, which is a version label on a marketing surface.
- Benefit card titles and roadmap phase titles use title case instead of sentence case.

### Identified problem

The copy violates four distinct rules from the UI guidelines:

1. **Em-dash in text blocks** — `Hero.jsx` and `MiniComparator.jsx` use `—` in body copy and section subtitles.
2. **Section-index labels** — All five section eyebrows follow the banned `№ 0N ·` pattern.
3. **Version label on marketing surface** — `MVP v0.1` is visible in the comparator section footer.
4. **Title case in card headings** — Six card titles across `BenefitsGrid` and `RoadmapSection` use title case.

### Business motivation

These are pure copy violations with no technical risk. Fixing them aligns the product voice with the established standards and removes inconsistencies visible to every visitor.

---

## 3. Business Objective

Bring all visible copy on the landing page into compliance with the punctuation, casing, and label conventions defined in `shared-knowledge/ui-guidelines.md`.

---

## 4. Scope

### Included

- `Hero.jsx` line 16: replace em-dash with a period, splitting into two sentences.
- `MiniComparator.jsx` line 31: replace em-dash with a colon in the section subtitle.
- `MiniComparator.jsx` line 103: remove `MVP v0.1 ·` from the footer note.
- All five section eyebrows (`Hero`, `MiniComparator`, `RoadmapSection`, `BenefitsGrid`, `PartnershipSection`): remove the `№ 0N ·` prefix, keep the label text only.
- `BenefitsGrid.jsx` benefit titles (3 items): convert to sentence case.
- `RoadmapSection.jsx` phase titles (3 items): convert to sentence case.

### Excluded

- Structural changes to any component.
- Changes to CSS, tokens, or Tailwind config.
- Eyebrow label content beyond removing the numeric prefix (the label text itself is not changed here, except as noted above).
- Hero badge (structural suppression handled in EVO-019).

---

## 5. Constraints

### Business constraints

- All copy must remain within the voice defined in `design-system/README.md`: neutral, technical, sentence case.

### Known technical constraints

- None. All changes are text-only.

### Regulatory / security constraints

- None.

---

## 6. Use Cases

### Nominal case

As a visitor reading the landing page,
I want section headings and body copy to be consistent and free of banned patterns,
so that the product feels considered and trustworthy.

### Alternative cases

- None.

### Known error cases

- None.

---

## 7. Acceptance Criteria

- [ ] No em-dash (`—`) appears in any text block on the landing page.
- [ ] No section eyebrow contains a `№` or numeric prefix.
- [ ] The string `MVP v0.1` does not appear on the landing page.
- [ ] All benefit card titles and roadmap phase titles use sentence case.
- [ ] The MiniComparator section subtitle reads `Road wheels: filter and compare`.
- [ ] The Hero body paragraph reads `…and many more. Structured in a single table.`
- [ ] No other copy content is changed beyond the items listed in scope.

---

## 8. Open Questions

- None.

---

## 9. Assumptions

- The `t-section-index` CSS class is retained as-is on eyebrow elements; only the text content changes.
- Sentence case for the roadmap phase titles applies to the `phases` data array in `RoadmapSection.jsx`, not to a shared data source.
