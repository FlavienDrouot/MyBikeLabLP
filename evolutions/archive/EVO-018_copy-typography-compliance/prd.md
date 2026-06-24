# PRD — Product Requirements Document

## 1. General Information

- Evolution ID: EVO-018
- Title: Copy and typography — UI guidelines compliance
- Author: Flavien Drouot
- Date: 2026-05-27
- Version: 1.0
- Needs Assessment reference: `EVO-018_copy-typography-compliance/needs-assessment.md`

---

## 2. Functional Objective

All visible copy on the landing page must conform to the punctuation, casing, and label conventions defined in `shared-knowledge/ui-guidelines.md`. After this evolution, no section eyebrow, body text block, card title, or footer note on the landing page may contain a banned pattern (em-dash, section-index label, version label, or title case heading).

---

## 3. Target Behavior

### General description

The landing page presents copy that is fully compliant with the UI guidelines: plain sentence case for headings and card titles, no numbered section eyebrow prefixes, no em-dash in prose, and no version string on any marketing surface. Visitors reading the page encounter consistent, neutral, considered copy throughout all five sections.

---

## 4. Functional Rules

### FR-001 — No em-dash in body copy or subtitles

No text visible to users on the landing page may contain an em-dash character (`—`). Where an em-dash was used to join two clauses, the text must be restructured: either split into two sentences (for body copy) or reworded using a colon or other permitted punctuation (for subtitles and labels).

### FR-002 — Section eyebrows contain label text only

Every section eyebrow element on the landing page must display only its plain label text. The `№ 0N ·` numeric prefix pattern is prohibited. The underlying CSS class (`t-section-index`) is unaffected; only the rendered text content changes.

### FR-003 — No version label on marketing surfaces

The string `MVP v0.1` must not appear anywhere on the landing page. Version identifiers are not permitted on marketing-facing surfaces.

### FR-004 — Sentence case for card and phase titles

All benefit card titles in `BenefitsGrid` and all roadmap phase titles in `RoadmapSection` must use sentence case: only the first word and proper nouns are capitalised. Title case (capitalising every main word) is prohibited for these elements.

### FR-005 — No other copy is modified

Only the text items explicitly enumerated in the Needs Assessment scope are changed. All other copy — Hero headline, stats, CTA labels, table headers, filter labels, footer links — is left unchanged.

---

## 5. Detailed Use Cases

### UC-001 — Visitor reads the Hero section

#### Preconditions
- The landing page is loaded.

#### Steps
1. Visitor reads the Hero body paragraph.

#### Expected result
- The paragraph ends with the sentence `…and many more. Structured in a single table.` — two separate sentences, no em-dash.
- The Hero section eyebrow displays a plain label with no `№` prefix.

#### Error cases
- None applicable (static copy).

---

### UC-002 — Visitor reads the MiniComparator section

#### Preconditions
- The landing page is loaded.

#### Steps
1. Visitor reads the MiniComparator section header area.
2. Visitor reads the footer note below the comparator table.

#### Expected result
- The section subtitle reads `Road wheels: filter and compare` (colon, no em-dash).
- The section eyebrow displays a plain label with no `№` prefix.
- The footer note does not contain `MVP v0.1` or any version string.

#### Error cases
- None applicable (static copy).

---

### UC-003 — Visitor reads the Benefits section

#### Preconditions
- The landing page is loaded.

#### Steps
1. Visitor reads the three benefit card titles in `BenefitsGrid`.

#### Expected result
- Each card title is in sentence case (first word capitalised; no other words capitalised unless proper nouns).
- The section eyebrow displays a plain label with no `№` prefix.

#### Error cases
- None applicable (static copy).

---

### UC-004 — Visitor reads the Roadmap section

#### Preconditions
- The landing page is loaded.

#### Steps
1. Visitor reads the three roadmap phase titles in `RoadmapSection`.

#### Expected result
- Each phase title is in sentence case.
- The section eyebrow displays a plain label with no `№` prefix.

#### Error cases
- None applicable (static copy).

---

### UC-005 — Visitor reads the Partnership section

#### Preconditions
- The landing page is loaded.

#### Steps
1. Visitor reads the Partnership section eyebrow.

#### Expected result
- The eyebrow displays a plain label with no `№` prefix.

#### Error cases
- None applicable (static copy).

---

## 6. Acceptance Criteria

### AC-001
#### Description
No em-dash character (`—`) is present in any rendered text on the landing page.
#### Expected verification
Inspect the rendered DOM and all JSX source files in scope; confirm zero occurrences of `—` in user-visible strings.
#### Type
- Manual

---

### AC-002
#### Description
No section eyebrow on the landing page contains a `№` character or a numeric prefix.
#### Expected verification
Inspect all five section eyebrow elements in the rendered DOM (`Hero`, `MiniComparator`, `RoadmapSection`, `BenefitsGrid`, `PartnershipSection`); confirm each contains only a plain label string.
#### Type
- Manual

---

### AC-003
#### Description
The string `MVP v0.1` does not appear anywhere on the rendered landing page.
#### Expected verification
Search the rendered DOM and relevant JSX source files for `MVP v0.1`; confirm zero occurrences.
#### Type
- Manual

---

### AC-004
#### Description
The MiniComparator section subtitle reads exactly `Road wheels: filter and compare`.
#### Expected verification
Inspect the subtitle element in the rendered DOM and in `MiniComparator.jsx`; confirm the exact string.
#### Type
- Manual

---

### AC-005
#### Description
The Hero body paragraph no longer contains an em-dash and ends with two separate sentences (`…and many more. Structured in a single table.`).
#### Expected verification
Inspect the paragraph element in the rendered DOM and in `Hero.jsx`; confirm the exact wording and absence of em-dash.
#### Type
- Manual

---

### AC-006
#### Description
All three benefit card titles in `BenefitsGrid` use sentence case.
#### Expected verification
Read each card title in the rendered DOM; verify that no word beyond the first is capitalised unless it is a proper noun.
#### Type
- Manual

---

### AC-007
#### Description
All three roadmap phase titles in `RoadmapSection` use sentence case.
#### Expected verification
Read each phase title in the rendered DOM; verify that no word beyond the first is capitalised unless it is a proper noun.
#### Type
- Manual

---

### AC-008
#### Description
No copy outside the items listed in the Needs Assessment scope has been modified.
#### Expected verification
Diff the JSX files in scope against the previous version; confirm that only the enumerated strings are changed.
#### Type
- Manual

---

## 7. Functional Impacts

### Impacted components
- `src/components/Hero/Hero.jsx` — body paragraph (line 16) and section eyebrow
- `src/components/MiniComparator/MiniComparator.jsx` — section subtitle (line 31), footer note (line 103), and section eyebrow
- `src/components/RoadmapSection/RoadmapSection.jsx` — section eyebrow and phase titles in the `phases` data array
- `src/components/BenefitsGrid/BenefitsGrid.jsx` — section eyebrow and benefit card titles
- `src/components/PartnershipSection/PartnershipSection.jsx` — section eyebrow

### Impacted data
- None. All changes are inline string literals within JSX components. No shared data source is affected.

### Impacted APIs
- None.

### Impacted permissions / roles
- None.

---

## 8. Out of Scope

- Structural changes to any component (layout, markup, props).
- Changes to CSS, Tailwind tokens, or design-system config.
- Eyebrow label wording beyond removing the `№ 0N ·` prefix (the label text itself is preserved).
- Hero badge element (structural suppression is handled in EVO-019).
- Any copy not explicitly listed in the Needs Assessment scope (Hero headline, stats, CTA labels, filter labels, table headers, footer links, etc.).

---

## 9. Constraints

- All revised copy must remain within the product voice defined in `design-system/README.md`: neutral, technical, sentence case.
- The `t-section-index` CSS class must be retained on all eyebrow elements; only text content changes.
- All changes are text-only; no technical risk is introduced.

---

## 10. Test Plan

### Automated tests expected
- None required. All changes are static string literals with no logic, state, or conditional rendering involved.

### Manual tests expected
- Load the landing page in a browser; visually verify each of AC-001 through AC-008 in sequence.
- Confirm the page renders without visual regressions in all five sections.

### Edge cases
- Verify that removing the `№ 0N ·` prefix does not cause layout overflow or unexpected whitespace in the eyebrow elements.
- Verify that sentence-case titles do not wrap unexpectedly on mobile viewports.

### Non-regression
- All other copy on the page (headline, stats, CTA labels, filter labels, table headers, footer) must remain unchanged.
- No visual regression in layout, spacing, or component structure.
