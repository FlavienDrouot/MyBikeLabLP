# PRD — Product Requirements Document

## 1. General Information

- **Evolution ID:** EVO-041
- **Title:** Design system: Landing page sections
- **Author:** Flavien Drouot
- **Date:** 2026-06-03
- **Version:** 1.0
- **Needs Assessment reference:** `EVO-041_design-system-landing-sections/needs-assessment.md`

---

## 2. Functional Objective

After this evolution, the four marketing content sections of the landing page (Hero, Benefits, Roadmap, Partnership) must fully conform to the MyBikeLab design system. Every section must use the correct card flavor, typographic rules, color tokens, voice conventions, and layout constraints defined in the design system. No legacy visual artifacts (photography, rounded shadow cards, section-index labels, brand blue classes, em-dashes, exclamation marks) may remain. The landing page will then present a visually unified experience from Navbar to Footer.

---

## 3. Target Behavior

### General description

A visitor who loads the landing page sees:

- A **Hero section** with the schematic grid background (32 px ruled grid in `ink-2`), no photography, display typography (`font-weight: 800`, `letter-spacing: -0.045em`), a brass-styled primary CTA, and an eyebrow label using `.t-eyebrow` — not a numeric section index.
- A **Benefits section** composed of hairline cards (`paper-0` background, `1px solid ink-4` border, `border-radius: 0`, no shadow, `24px` padding), with typographic content following design system rules.
- A **Roadmap section** composed of keyline cards (no outer border, `1px solid ink-10` top rule separating each phase column), without any `Phase 01 / 03`-style numeric labels.
- A **Partnership section** rendered as an ink-inverse block (`ink-12` background, `paper-1` text) with eyebrow and audience tiles following ink-inverse card rules.
- All prose copy in both French and English free of em-dashes, en-dashes used as separators, and exclamation marks.
- Section spacing, max-width (`1280px`), and gutters (`24px`) consistent across all four sections via the `Landing.jsx` orchestration layer.

---

## 4. Functional Rules

### FR-001 — Hero section uses the schematic grid background

The Hero section background must render the schematic grid pattern: a 32 px ruled grid using `ink-2` as the line color, implemented via CSS `background-image: linear-gradient(...)` in both directions. No photography, no texture overlay, and no noise layer may appear in the Hero section. The schematic grid must not appear on any other section of the page.

### FR-002 — Hero section uses display typography

The Hero headline must be rendered at `font-weight: 800` with `letter-spacing: -0.045em` using the Inter font family. The italic/light variant of the headline (the `<em>` span on "measured.") must render using the `brass-8` token color to signal the brass accent. No other heading style is acceptable for the Hero headline.

### FR-003 — Hero primary CTA uses the brass accent

The primary CTA button in the Hero section must use the brass button style: `background: var(--brass-7)`, `color: var(--ink-12)`, `border: 1px solid var(--brass-8)`. Hover state: `background: var(--brass-6)`. The CTA label must follow the `→` trailing arrow glyph convention (e.g., "Open comparator →").

### FR-004 — Hero eyebrow uses `.t-eyebrow`, not a numeric index

The eyebrow label above the Hero headline must use the `.t-eyebrow` token style (font-family mono or sans uppercase, `letter-spacing: 0.18em`, `color: var(--ink-7)`) and carry a descriptive verb-noun label (e.g., "Compare road wheels"). No numeric index (`01 / 03`, `№ 01`, `Step 01`) may appear in the Hero or any other section.

### FR-005 — Benefits cards use the hairline card flavor

Each Benefits card must use the hairline card specification: `background: var(--paper-0)`, `border: 1px solid var(--ink-4)`, `border-radius: 0`, no box-shadow, `padding: 24px`. No rounded corners, no shadow, no inset/recessed background treatment.

### FR-006 — Roadmap cards use the keyline card flavor

Each Roadmap phase card must use the keyline card specification: no outer border on the card itself, a `1px solid var(--ink-10)` top rule separating phase columns from the section header or from each other. The `.roadmap-grid` layout uses `border-top: 1px solid var(--ink-10)` as the sole structural border; internal column separators use `border-right: 1px solid var(--ink-3)`.

### FR-007 — Partnership section uses the ink-inverse card treatment

The Partnership section must use the ink-inverse surface: `background: var(--ink-12)`, body text in `var(--paper-1)`, eyebrow in `var(--brass-7)`, and audience tile descriptions in `var(--ink-4)`. The contact card within the Partnership section uses `background: var(--paper-1)` on an `ink-12` section background to provide contrast without introducing a new color. No separate color fills (non-system greens, blues, or brand colors) may appear in this section.

### FR-008 — No section-index labels anywhere on the page

No section on the landing page may display a numeric index label of any form: `01 / 03`, `Phase 01`, `№ 02`, `Step 1/3`, or any equivalent. Section identifiers must use descriptive eyebrow labels (e.g., "Roadmap", "Partnerships", "Compare road wheels") with the `.t-eyebrow` style.

### FR-009 — No em-dash, en-dash, or exclamation mark in any prose copy

All prose copy in all four sections — in both the French and English variants — must be free of:
- em-dash (—)
- en-dash (–) used as a text separator
- exclamation marks (!)

Permitted punctuation to replace these: period, comma, colon, line break, or parentheses. The hyphen (`-`) is permitted for compound words and numeric ranges.

### FR-010 — No legacy blue / brand CSS classes remain

No component in Hero, Benefits, Roadmap, or Partnership may use legacy `brand-*` blue CSS classes or any color not sourced from the design system token set. All color references must resolve to `ink-*`, `paper-*`, `brass-*`, `sage-*`, or semantic tokens defined in `colors_and_type.css`.

### FR-011 — Both language variants comply with all visual and voice rules

The French and English variants of all four sections must independently satisfy every rule in FR-001 through FR-010. No rule is scoped to a single locale.

### FR-012 — Landing.jsx orchestration enforces consistent spacing

`Landing.jsx` (or its equivalent page-level orchestration file) must apply uniform section spacing (`padding: 96px 0` for standard sections), a page max-width of `1280px`, and gutters of `24px` via the `.page` layout class. No section may override these to produce a narrower or wider container.

---

## 5. Detailed Use Cases

### UC-001 — First-time visitor reads the landing page

#### Preconditions
- EVO-039 foundation tokens are deployed.
- EVO-040 Navbar and Footer migration is complete.
- The visitor loads the landing page for the first time (no localStorage state set).

#### Steps
1. Visitor loads the page. The Navbar renders in its EVO-040 compliant style.
2. Visitor sees the Hero section: schematic grid background, large display headline with brass italic accent, brass primary CTA, descriptive eyebrow ("Compare road wheels"), and the stats trio.
3. Visitor scrolls past the Wheel Comparator section (not in scope for this evolution).
4. Visitor reaches the Roadmap section: three keyline phase cards, no numeric labels, year + status stamps, descriptive phase titles and bullet points.
5. Visitor reaches the Benefits section: hairline cards presenting platform value propositions, no shadows or rounded corners.
6. Visitor reaches the Partnership section: full-width ink-inverse block with audience descriptions for Manufacturers and Resellers, and a contact card in paper-1 on the dark background.
7. Visitor reads the Footer (EVO-040 compliant).

#### Expected result
- Every section renders with design system tokens exclusively.
- No legacy visual artifacts are visible (no photography, no rounded shadow cards, no numeric section labels, no brand blue colors).
- The page reads as a coherent, unified whole in the schematic/editorial aesthetic.

#### Error cases
- None identified at functional level.

---

### UC-002 — French-language visitor reads the page

#### Preconditions
- Same as UC-001.
- The visitor's browser locale triggers the French variant of all copy (or the language toggle is set to FR).

#### Steps
1–7. Same flow as UC-001, but all text content is in French.

#### Expected result
- All sections render identically in visual structure to the EN variant.
- French prose copy contains no em-dashes, en-dashes as separators, or exclamation marks.
- All eyebrow labels, CTA text, card titles, and body copy comply with the voice rules in French.

#### Error cases
- None identified at functional level.

---

## 6. Acceptance Criteria

### AC-001
#### Description
Hero section displays the schematic grid background and no photography.
#### Expected verification
Visual inspection: the Hero background shows a 32 px ruled grid pattern in `ink-2`. No `<img>` tag, `background-image` pointing to a photo file, or any non-grid background pattern is present in the Hero element.
#### Type
- Manual

---

### AC-002
#### Description
Hero section displays display typography and brass italic accent.
#### Expected verification
The `<h1>` element in the Hero renders at `font-weight: 800` with `letter-spacing: -0.045em`. The `<em>` span within the headline resolves to `var(--brass-8)` color. Verified by computed style inspection in browser DevTools.
#### Type
- Manual

---

### AC-003
#### Description
Hero primary CTA uses brass button styling.
#### Expected verification
The primary CTA button in the Hero section has `background: var(--brass-7)` and `border: 1px solid var(--brass-8)` as computed styles. On hover, `background` resolves to `var(--brass-6)`.
#### Type
- Manual

---

### AC-004
#### Description
Benefits section cards match the hairline card flavor.
#### Expected verification
Each Benefits card has: `background: var(--paper-0)`, `border: 1px solid var(--ink-4)`, `border-radius: 0`, no `box-shadow`. Verified by computed style inspection.
#### Type
- Manual

---

### AC-005
#### Description
Roadmap section cards match the keyline card flavor.
#### Expected verification
Roadmap phase columns have no outer card border. A `1px solid var(--ink-10)` top rule is present as the section separator. No `border` or `box-shadow` is set on individual phase card elements. Verified by computed style inspection.
#### Type
- Manual

---

### AC-006
#### Description
Partnership section uses the ink-inverse treatment.
#### Expected verification
The Partnership `<section>` element has `background: var(--ink-12)`. Text in the main column resolves to `var(--paper-1)`. The eyebrow label color resolves to `var(--brass-7)`. The contact card has `background: var(--paper-1)`.
#### Type
- Manual

---

### AC-007
#### Description
No section-index labels appear anywhere on the landing page.
#### Expected verification
Text search across all rendered content (EN and FR) finds zero occurrences of patterns matching `01 / 03`, `Phase 0`, `№ 0`, `Step 0`, or any `[digit][digit] /` sequence in section headings or eyebrow labels.
#### Type
- Manual

---

### AC-008
#### Description
No em-dash, en-dash, or exclamation mark in any prose copy (EN and FR).
#### Expected verification
Text content of all four sections, in both language variants, is checked for the characters `—`, `–`, and `!`. Zero occurrences are found in prose copy (headings, leads, body paragraphs, card descriptions, CTA labels, eyebrow labels).
#### Type
- Manual

---

### AC-009
#### Description
No legacy blue / brand CSS classes remain in any landing component.
#### Expected verification
Source code inspection: no `brand-*`, `blue-*`, or non-system color class names appear in any of the four section components or in `Landing.jsx`. All color references in component markup and styles resolve to tokens from `colors_and_type.css`.
#### Type
- Manual

---

### AC-010
#### Description
All four sections render correctly in both FR and EN.
#### Expected verification
The page is rendered in each language variant. All sections display without broken layout, truncated text, or misaligned elements in either locale.
#### Type
- Manual

---

## 7. Functional Impacts

### Impacted components
- `Hero` section component (or equivalent JSX/CSS in the production codebase)
- `Benefits` section component
- `Roadmap` section component
- `Partnership` section component
- `Landing.jsx` — page-level orchestration for section spacing and layout wrapper

### Impacted data
- Copy strings in all four sections (EN and FR variants must be checked and corrected for voice compliance)
- No data schema changes

### Impacted APIs
- None

### Impacted permissions / roles
- None

---

## 8. Out of Scope

- Navbar and Footer (covered by EVO-040)
- Wheel Comparator section
- Any copy rewrites beyond compliance with voice rules (no em-dash, no exclamation marks)
- New token creation — EVO-039 tokens are the stable foundation; no new tokens may be invented
- Backend, data pipeline, routing, or authentication changes
- Mobile-specific responsive layouts (not addressed in this evolution)

---

## 9. Constraints

- EVO-039 foundation tokens must be used as-is; no new token may be introduced by this evolution
- EVO-040 Navbar/Footer migration must be complete before this evolution ships
- All affected components must pass i18n: French and English variants must both comply with visual and voice rules
- No legacy `brand-*` blue CSS classes may remain in any affected component after migration

---

## 10. Test Plan

### Automated tests expected
- None required at this stage; all sections are presentational with no interactive state logic introduced by this evolution

### Manual tests expected
- Load landing page in EN: verify Hero grid background, brass CTA, display typography, no photography
- Load landing page in EN: verify Benefits hairline cards (no shadow, no radius, `ink-4` border)
- Load landing page in EN: verify Roadmap keyline cards (no outer border, top rule only, no phase-index labels)
- Load landing page in EN: verify Partnership ink-inverse section (ink-12 background, paper-1 text, brass eyebrow)
- Load landing page in EN: scan all prose for em-dashes, en-dashes, and exclamation marks
- Repeat all of the above with language set to FR
- Inspect computed styles in DevTools for Hero, Benefits, Roadmap, and Partnership to confirm no `brand-*` or non-system color tokens remain
- Verify page max-width is `1280px` and gutters are `24px` across all four sections

### Edge cases
- Long French copy (French is typically 15–20% longer than English) must not break card or grid layouts
- Verify that the schematic grid background on Hero does not appear on any adjacent section (Comparator or Roadmap)

### Non-regression
- Navbar and Footer appearance must be unchanged after this evolution
- Wheel Comparator section must be unaffected
- The stats trio in the Hero (15 wheels, 13 axes, stats counts) must still render correctly with JetBrains Mono tabular numerals
