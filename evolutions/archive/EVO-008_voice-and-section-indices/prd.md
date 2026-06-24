# PRD — Product Requirements Document

## 1. General Information

- Evolution ID: EVO-008
- Title: Voice alignment and section indices
- Author: Flavien Drouot
- Date: 2026-05-26
- Version: 1.0
- Needs Assessment reference: `EVO-008_voice-and-section-indices/needs-assessment.md`

---

## 2. Functional Objective

After this evolution, all visible copy on the landing page complies with the design system voice — neutral, technical, anti-marketing — and every content section opens with a flat section index (`№ NN · LABEL`) rendered in JetBrains Mono via the `.t-section-index` class. The page is credible and consistent for both end users and B2B partners.

---

## 3. Target Behavior

### General description

**Voice.** Every visible string on the landing page — headings, leads, CTA labels, card titles, card descriptions, stat labels, HTML meta — must follow the design system register: neutral, technical, slightly nerdy (Wirecutter / DPReview style). Forbidden words, emojis, and exclamation marks are absent from all product-facing surfaces.

**Section indices.** Each content section opens with a flat monospaced index in the format `№ NN · LABEL`. For sections 02–05, a dedicated `.t-section-index` element is added above the section heading, replacing the current eyebrow `<span>`. For the Hero (01), the existing eyebrow pill receives new content (`№ 01 · MVP v0.1 · Road wheels`) while retaining its current pill styling — shape changes are out of scope (EVO-011).

---

## 4. Functional Rules

### FR-001 — Forbidden words absent
No occurrence of the following strings in any visible product copy surface (Hero, MiniComparator, RoadmapSection, BenefitsGrid, PartnershipSection, Footer, `<title>`, `<meta name="description">`): "future of", "intelligence", "revolutionary", "game-changer", "blazingly", "ultimate".

### FR-002 — No emojis in product surfaces
No emoji character appears in any of the surfaces listed in FR-001.

### FR-003 — No exclamation marks in product surfaces
No exclamation mark appears in any of the surfaces listed in FR-001.

### FR-004 — Sentence case for all CTAs
All CTA labels (links and buttons) are in sentence case: first word capitalised, remaining words lowercase unless proper nouns. Examples: "Open comparator", "See the roadmap".

### FR-005 — Section indices present and correctly numbered
The following section indices are displayed, in order, as the opening element of each respective section:

| Index | Surface |
|---|---|
| `№ 01 · MVP v0.1 · Road wheels` | Hero eyebrow |
| `№ 02 · COMPARATOR` | MiniComparator |
| `№ 03 · ROADMAP` | RoadmapSection |
| `№ 04 · BENEFITS` | BenefitsGrid |
| `№ 05 · PARTNERSHIP` | PartnershipSection |

Footer carries no section index (utility section).

### FR-006 — Section index format
Section index strings follow the format `№ NN · LABEL` where:
- `№` is Unicode U+2116
- `NN` is zero-padded (01, 02 …)
- `·` is Unicode U+00B7
- `LABEL` is uppercase

### FR-007 — Section index rendering for sections 02–05
Section indices for MiniComparator, RoadmapSection, BenefitsGrid, and PartnershipSection are rendered using the `.t-section-index` CSS class defined in `design-tokens.css` (JetBrains Mono, `text-xs`, weight 500, `letter-spacing: 0.06em`, `color: var(--fg-muted)`). They replace the current uppercase eyebrow `<span>` in each section.

### FR-008 — Hero eyebrow constraint
The Hero eyebrow content is replaced with `№ 01 · MVP v0.1 · Road wheels`. The element's current CSS classes (`rounded-full`, pill border, background) are not modified in this evolution. The `.t-section-index` class is not applied to the Hero eyebrow in this evolution.

### FR-009 — Typographic glyphs in CTAs
CTAs with navigation intent carry a `→` suffix (space before arrow). Example: "Open comparator →", "See the roadmap →". The `→` character is Unicode U+2192.

### FR-010 — Factual quantitative claims
Quantitative claims in visible copy use exact figures where the value is known and stable. "15+" is replaced by "15" where the dataset contains exactly 15 wheels. Approximation markers (`+`, `~`) are not used when an exact count is available.

---

## 5. Proposed Copy per Surface

### Hero (`Hero.jsx`)

| Element | Current | Proposed |
|---|---|---|
| Eyebrow | `MVP v0.1 — Road Bike Wheels` | `№ 01 · MVP v0.1 · Road wheels` |
| H1 | `The Future of Bike Component Intelligence` | `Wheels, measured. Not marketed.` |
| Lead | `Compare, simulate, optimize. Make smarter bike decisions with structured data — starting with road wheels.` | `15 road wheels, 13 filter axes. Compare by weight, rim depth, hookless compatibility, hub brand, and price — structured in a single table.` |
| Primary CTA | `Try the Comparator` | `Open comparator →` |
| Secondary CTA | `See the Vision` | `See the roadmap →` |
| Stat 1 value | `15+` | `15` |
| Stat 1 label | `Wheels indexed` | `Road wheels` |
| Stat 2 value | `{getFilterableProperties().length}` | *(no change — already dynamic)* |
| Stat 2 label | `Filter axes` | *(no change)* |
| Stat 3 value | `3` | *(no change)* |
| Stat 3 label | `Phases ahead` | `Phases planned` |

### MiniComparator (`MiniComparator.jsx`)

| Element | Current | Proposed |
|---|---|---|
| Eyebrow / section index | `Live Demo` (eyebrow span) | `№ 02 · COMPARATOR` (`.t-section-index`) |
| H2 | `Start with Wheels — Explore Components` | `Road wheels — filter and compare` |
| Subtitle | `Filter by brand, weight, depth, price and more. Sort to find the wheelset that fits your priorities.` | `Filter and sort by brand, weight, rim depth, price, and many more.` |

### RoadmapSection (`RoadmapSection.jsx`)

| Element | Current | Proposed |
|---|---|---|
| Eyebrow / section index | `Roadmap` (eyebrow span) | `№ 03 · ROADMAP` (`.t-section-index`) |
| H2 | `What's Coming` | `Three phases` |
| Subtitle | `From a focused wheel comparator to a full-stack bike intelligence platform — here's how we get there.` | `Comparison first. Impact simulation next. Full bike configurator on the horizon.` |
| Phase 1–3 titles | `Components Comparison`, `Impact Simulator`, `Full Bike Configurator` | *(no change — factual, no forbidden words)* |
| Phase 1–3 descriptions | *(see current code)* | *(no change — factual)* |
| Phase 1–3 bullet points | *(see current code)* | *(no change — factual)* |
| Status badges | `In progress`, `Next`, `Vision` | *(no change)* |

### BenefitsGrid (`BenefitsGrid.jsx`)

| Element | Current | Proposed |
|---|---|---|
| Eyebrow / section index | `Why MyBikeLab` (eyebrow span) | `№ 04 · BENEFITS` (`.t-section-index`) |
| H2 | `Built for serious cyclists` | *(no change — compliant)* |
| Card 1 title | `Better Decisions` | *(no change)* |
| Card 1 description | `Stop comparing PDFs and forum threads. Filter on the specs that actually matter for your ride.` | *(no change — compliant)* |
| Card 2 title | `Data-Driven` | *(no change)* |
| Card 2 description | `Every spec is sourced and structured. No marketing fluff, just numbers you can cross-check.` | *(no change — compliant)* |
| Card 3 title | `Community-Focused` | *(no change)* |
| Card 3 description | `Built with riders, manufacturers and resellers. Open data, transparent affiliations.` | *(no change — compliant)* |

### PartnershipSection (`PartnershipSection.jsx`)

| Element | Current | Proposed |
|---|---|---|
| Eyebrow / section index | `B2B Partnerships` (eyebrow span) | `№ 05 · PARTNERSHIP` (`.t-section-index`) |
| H2 | `Join the Platform` | `Work with us` |
| Lead | `We're building the trusted layer between cyclists and the components they buy. Help shape the dataset and the tools.` | `MyBikeLab connects cyclists with structured component data. If you supply or sell road bike components, your product data belongs here.` |
| Manufacturers description | `Showcase your specs in a structured, comparison-ready format.` | *(no change — compliant)* |
| Resellers description | `Plug into a high-intent comparison funnel built for road cyclists.` | *(no change — compliant)* |

### Footer (`Footer.jsx`)

| Element | Current | Proposed |
|---|---|---|
| Nav links | `Tool`, `Roadmap`, `Partnerships`, `Contact` | *(no change — neutral, no violations)* |
| Copyright | `© {year} MyBikeLab. All rights reserved.` | *(no change)* |

### `frontend/index.html`

| Element | Current | Proposed |
|---|---|---|
| `<title>` | `MyBikeLab — Bike Component Intelligence` | `MyBikeLab — Road wheel comparator` |
| `<meta name="description">` | `MyBikeLab — compare, simulate and optimize bike components. MVP: road bike wheels comparator.` | `Compare road bike wheels by weight, rim depth, hookless compatibility, hub brand, and price. 15 wheels, 13 filter axes.` |

---

## 6. Detailed Use Cases

### UC-001 — Visitor reads the landing page top to bottom

#### Preconditions
- User loads the MyBikeLab landing page in a browser.

#### Steps
1. User reads the Hero section (eyebrow, title, lead, CTAs, stats).
2. User scrolls to MiniComparator and reads the section header.
3. User scrolls to RoadmapSection and reads the section header and phase cards.
4. User scrolls to BenefitsGrid and reads the section header and benefit cards.
5. User scrolls to PartnershipSection and reads the section header and lead.
6. User reaches the Footer.

#### Expected result
- No forbidden word encountered at any scroll position.
- Each section (01–05) opens with its section index in mono format.
- No emoji or exclamation mark visible anywhere.
- All CTA labels are in sentence case.

#### Error cases
- None identified.

---

### UC-002 — B2B partner evaluates the platform

#### Preconditions
- A manufacturer or retailer visits the landing page for partner outreach evaluation.

#### Steps
1. Partner lands on the Hero and reads the title and lead.
2. Partner scrolls to PartnershipSection (`№ 05 · PARTNERSHIP`).
3. Partner reads the H2 and lead copy.

#### Expected result
- Hero copy is factual and neutral; no marketing buzzwords.
- PartnershipSection opens with `№ 05 · PARTNERSHIP` in `.t-section-index`.
- H2 and lead copy are credible and professional.

#### Error cases
- None identified.

---

### UC-003 — Search engine indexes the page

#### Preconditions
- A search crawler fetches `frontend/index.html`.

#### Steps
1. Crawler reads `<title>`.
2. Crawler reads `<meta name="description">`.

#### Expected result
- `<title>` is `MyBikeLab — Road wheel comparator` (no forbidden words).
- `<meta name="description">` is factual and contains no forbidden words.

#### Error cases
- None identified.

---

### UC-004 — Developer verifies design system compliance

#### Preconditions
- Developer inspects the landing page DOM after deployment.

#### Steps
1. Developer inspects sections 02–05 for `.t-section-index` elements.
2. Developer checks content of each section index element.
3. Developer searches the rendered DOM for forbidden words.

#### Expected result
- Sections 02–05 each have exactly one `.t-section-index` element with the correct `№ NN · LABEL` content.
- No forbidden words found in the rendered DOM.

#### Error cases
- None identified.

---

## 7. Acceptance Criteria

### AC-001 — No forbidden words in visible copy
#### Description
None of the following strings appear in any rendered text node of the landing page: "future of", "intelligence", "revolutionary", "game-changer", "blazingly", "ultimate" (case-insensitive).
#### Expected verification
Automated grep on `.jsx` source files and `index.html` for the forbidden word list.
#### Type
- Automated

---

### AC-002 — No emojis in product surfaces
#### Description
No emoji character (Unicode range U+1F300–U+1FAFF and common emoji blocks) appears in the rendered text of Hero, MiniComparator, RoadmapSection, BenefitsGrid, PartnershipSection, Footer, or HTML meta.
#### Expected verification
Automated grep on `.jsx` source files and `index.html` for emoji character classes.
#### Type
- Automated

---

### AC-003 — No exclamation marks in product surfaces
#### Description
No exclamation mark (`!`) appears in any rendered string of the surfaces listed in AC-002.
#### Expected verification
Automated grep on `.jsx` source files and `index.html` for `!` in string literals.
#### Type
- Automated

---

### AC-004 — Hero eyebrow content
#### Description
The Hero eyebrow element contains exactly `№ 01 · MVP v0.1 · Road wheels`.
#### Expected verification
Manual DOM inspection or automated snapshot test on `Hero.jsx` render.
#### Type
- Automated / Manual

---

### AC-005 — Hero H1 content
#### Description
The Hero H1 element renders `Wheels, measured. Not marketed.`
#### Expected verification
Manual DOM inspection or automated snapshot test on `Hero.jsx` render.
#### Type
- Automated / Manual

---

### AC-006 — Section indices present (02–05)
#### Description
Each of the four sections (MiniComparator, RoadmapSection, BenefitsGrid, PartnershipSection) contains exactly one element with the `.t-section-index` class, and its text content matches the assigned `№ NN · LABEL` string.
#### Expected verification
Automated DOM query or grep for `.t-section-index` in each component file with expected content.
#### Type
- Automated

---

### AC-007 — Section index uses correct Unicode characters
#### Description
The `№` character is U+2116 (not `No.` or `#`). The `·` separator is U+00B7 (not a hyphen `-` or full stop `.`).
#### Expected verification
Automated grep for the exact code points in source files.
#### Type
- Automated

---

### AC-008 — All CTA labels in sentence case
#### Description
CTA labels ("Open comparator →", "See the roadmap →") are sentence case. No CTA label uses title case or all-caps.
#### Expected verification
Manual review of all `<a>` and `<button>` elements with navigational intent.
#### Type
- Manual

---

### AC-009 — `<title>` compliant
#### Description
`index.html` `<title>` is `MyBikeLab — Road wheel comparator` and contains no forbidden words.
#### Expected verification
Automated grep on `index.html`.
#### Type
- Automated

---

### AC-010 — `<meta name="description">` compliant
#### Description
`index.html` `<meta name="description">` contains no forbidden words and describes the product factually.
#### Expected verification
Automated grep on `index.html`.
#### Type
- Automated

---

### AC-011 — `product-overview.md` reviewed
#### Description
`product-overview.md` contains no forbidden words from the FR-001 list.
#### Expected verification
Automated grep on `product-overview.md`.
#### Type
- Automated

---

## 8. Functional Impacts

### Impacted components
- `frontend/src/components/Hero.jsx`
- `frontend/src/components/MiniComparator/MiniComparator.jsx`
- `frontend/src/components/RoadmapSection.jsx`
- `frontend/src/components/BenefitsGrid.jsx`
- `frontend/src/components/PartnershipSection.jsx`
- `frontend/src/components/Footer.jsx` *(review only — no changes expected)*

### Impacted data
- None. No data model or dataset changes.

### Impacted APIs
- None.

### Impacted permissions / roles
- None.

### Impacted static files
- `frontend/index.html` — `<title>` and `<meta name="description">`
- `product-overview.md` — review and patch if forbidden words present

---

## 9. Out of Scope

- CSS class changes on the Hero eyebrow (`rounded-full` removal) — covered by EVO-011.
- Typography settings for `.t-section-index` (font loading, weight) — covered by EVO-009.
- MiniComparator filter data, wheel dataset, or column definitions.
- Typographic glyphs in data fields (`→`, `·`, `№` inside table cells or filter labels) — covered by EVO-015.
- Structural layout changes to any section.

---

## 10. Constraints

- The Hero eyebrow `rounded-full` CSS class must not be removed or modified in this evolution.
- Section indices for sections 02–05 must use the `.t-section-index` CSS class as defined in `design-tokens.css` — no inline styles.
- EVO-008 must be completed and merged before EVO-015 begins (EVO-015 depends on the refined Hero eyebrow content).

---

## 11. Test Plan

### Automated tests expected
- Grep for forbidden words across all `.jsx` files in `src/components/` and `index.html`.
- Grep for emoji characters in the same file set.
- Grep for the exact `.t-section-index` class in MiniComparator, RoadmapSection, BenefitsGrid, PartnershipSection components.
- Grep for `№ 0[1-5]` content strings to verify section index presence.

### Manual tests expected
- Visual scroll-through of the full landing page: verify each section index is visible and legible.
- Verify Hero eyebrow renders `№ 01 · MVP v0.1 · Road wheels` with pill styling intact.
- Verify Hero H1 renders "Wheels, measured. Not marketed."
- Verify all CTA labels are sentence case.
- Verify `<title>` and `<meta name="description">` in browser DevTools.

### Edge cases
- Verify that `.t-section-index` styling renders correctly on mobile viewports (section indices must not overflow or wrap unexpectedly).
- Verify the Hero lead stat "15" (exact count) matches the actual `wheelsData.js` array length.

### Non-regression
- MiniComparator filtering, sorting, and column selector functionality must be unaffected (only the section header changes).
- All existing anchor links (`#tool`, `#roadmap`, `#partnerships`, `#contact`) must remain functional.
