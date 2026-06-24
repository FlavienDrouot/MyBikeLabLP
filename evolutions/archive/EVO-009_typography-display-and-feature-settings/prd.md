# PRD — Product Requirements Document

## 1. General Information

- Evolution ID: EVO-009
- Title: Display typography and font-feature-settings
- Author: Flavien Drouot
- Date: 2026-05-26
- Version: 1.0
- Needs Assessment reference: `evolutions/EVO-009_typography-display-and-feature-settings/needs-assessment.md`

---

## 2. Functional Objective

After this evolution, the frontend must faithfully render the typographic signature defined in the design system:

- All display headings (Hero H1) must appear at the design system's intended visual weight and density.
- All section headings across the landing page must use a single, uniform heading treatment derived from the design system.
- All body text must activate Inter's stylistic alternate glyphs, which differentiate the product's typographic identity.

No new font assets are loaded. No existing layout, spacing, or sizing changes.

---

## 3. Target Behavior

### General description

The landing page currently falls short of its design system specification in three measurable ways: incorrect font weight on display headings (700 instead of 800), insufficient letter-spacing tightness (−0.025 em instead of −0.045 em), and absent font-feature-settings on the body. After this evolution:

1. The Hero H1 is rendered with font-weight 800 and letter-spacing −0.045 em, matching the `.t-display-1` design system class.
2. Every section heading — in `BenefitsGrid`, `RoadmapSection`, `PartnershipSection`, `MiniComparator`, and `ContactForm` — is rendered using the `.t-h1` design system class, replacing the current `font-bold` + `tracking-tight` Tailwind combination.
3. The `<body>` element carries `font-feature-settings: 'ss01', 'ss02', 'cv11'`, activating Inter's alternate glyphs for all text on the page.
4. No element outside the listed heading roles is affected: comparator table cells, filter controls, form fields, and body copy are visually unchanged.

The treatment is identical on all screen sizes; no responsive variant is applied to weight or tracking.

---

## 4. Functional Rules

### FR-001 — Hero H1 uses the display-1 typographic treatment

The Hero section's primary heading (H1) must be rendered with font-weight 800 and letter-spacing −0.045 em. These values come exclusively from the `.t-display-1` class defined by the design system (made available by EVO-007). No Tailwind utility class may be used to set weight or tracking on this element.

### FR-002 — All section headings use a single uniform typographic class

Every element that plays a section heading role in the components listed in scope must use the `.t-h1` design system class. No component may apply `font-bold` or `tracking-tight` (or any equivalent Tailwind utility) to a section heading role. The treatment is identical across all listed components — there is no per-component variation at this heading level.

### FR-003 — Body carries font-feature-settings for Inter stylistic alternates

The `<body>` element must declare `font-feature-settings: 'ss01', 'ss02', 'cv11'`. This activates Inter's alternate glyphs (stylistic set 1, stylistic set 2, character variant 11) globally for all text on the page. This rule does not apply to any specific component individually — it applies once at the body level.

### FR-004 — Non-heading elements are not affected

Typographic properties of comparator table cells, filter panel labels and controls, form fields, body copy paragraphs, captions, and any element not serving a heading role must remain unchanged. This evolution must not introduce visual regression on these elements.

### FR-005 — Design system classes are the exclusive source of display and section heading styles

Weight and tracking for elements in scope must not be set via Tailwind utility classes or inline styles. The `.t-display-1` and `.t-h1` classes exposed by EVO-007 are the sole mechanism. This ensures that a future design system update propagates automatically.

---

## 5. Detailed Use Cases

### UC-001 — Visitor views the Hero section

#### Preconditions
- The visitor opens the MyBikeLab landing page.
- EVO-007 is complete; `.t-display-1` is available and applied to the Hero H1.

#### Steps
1. The page loads.
2. The browser renders the Hero section.
3. The H1 heading is displayed.

#### Expected result
- The H1 appears in Inter weight 800.
- The letter-spacing on the H1 is −0.045 em.
- The rendering is identical on desktop, tablet, and mobile (no responsive variant).

#### Error cases
- If EVO-007 classes are absent, the H1 falls back to the browser default — this scenario is outside the scope of this PRD and is a dependency failure, not a functional regression of EVO-009.

---

### UC-002 — Visitor scrolls past a section with a section heading

#### Preconditions
- The visitor views any section among: BenefitsGrid, RoadmapSection, PartnershipSection, MiniComparator, ContactForm.
- EVO-007 is complete; `.t-h1` is available and applied to all `.section-title` elements.

#### Steps
1. The visitor scrolls to one of the listed sections.
2. The section heading is rendered.

#### Expected result
- The section heading is rendered using the `.t-h1` design system class.
- The visual treatment is identical across all listed sections — no section heading looks heavier, lighter, tighter, or looser than another.
- No `font-bold` or `tracking-tight` class is applied to any section heading.

#### Error cases
- None identified.

---

### UC-003 — Visitor reads body text with Inter alternate glyphs active

#### Preconditions
- The landing page has loaded.
- The `<body>` element carries `font-feature-settings: 'ss01', 'ss02', 'cv11'`.

#### Steps
1. Any text on the page is rendered.

#### Expected result
- Inter renders using its stylistic alternates (ss01, ss02, cv11) for all text on the page.
- Table cells, filter labels, and form fields are visually unaffected in terms of layout (alternate glyphs may change glyph shape but must not break alignment or overflow).

#### Error cases
- None identified.

---

### UC-004 — Visitor interacts with the comparator or a form

#### Preconditions
- The visitor uses the wheel comparator table, the filter panel, or the contact form.

#### Steps
1. The visitor applies filters, sorts columns, or fills the contact form.

#### Expected result
- All table text, labels, inputs, and controls look identical to their pre-EVO-009 state in terms of weight, spacing, and layout.
- Only glyph shapes may differ due to font-feature-settings applied at body level (this is acceptable and expected).

#### Error cases
- None identified.

---

## 6. Acceptance Criteria

### AC-001
#### Description
The Hero H1 renders at font-weight 800.

#### Expected verification
Inspect the computed style of the Hero H1 in browser DevTools. The `font-weight` computed value equals `800`.

#### Type
- Manual

---

### AC-002
#### Description
The Hero H1 renders at letter-spacing −0.045 em.

#### Expected verification
Inspect the computed style of the Hero H1 in browser DevTools. The `letter-spacing` computed value equals `−0.045em` (or its pixel equivalent for the current font-size).

#### Type
- Manual

---

### AC-003
#### Description
The `<body>` element has `font-feature-settings: 'ss01', 'ss02', 'cv11'` applied.

#### Expected verification
Inspect the computed style of the `<body>` element in browser DevTools. The `font-feature-settings` value includes `'ss01'`, `'ss02'`, and `'cv11'`.

#### Type
- Manual

---

### AC-004
#### Description
All section heading elements in the components in scope use the `.t-h1` class and do not use `font-bold` or `tracking-tight`.

#### Expected verification
Inspect the DOM of each section heading in `BenefitsGrid`, `RoadmapSection`, `PartnershipSection`, `MiniComparator`, and `ContactForm`. Each element carries the `.t-h1` class. Neither `font-bold` nor `tracking-tight` appears in the element's class list for any section heading role.

#### Type
- Manual

---

### AC-005
#### Description
No component in scope applies `font-bold` or `tracking-tight` to a display or section heading role.

#### Expected verification
Search the source files of `Hero`, `BenefitsGrid`, `RoadmapSection`, `PartnershipSection`, `MiniComparator`, and `ContactForm` for any heading-level element that carries `font-bold` or `tracking-tight`. Result must be zero occurrences on heading elements.

#### Type
- Automated (static analysis / code search)

---

### AC-006
#### Description
No visual regression on the comparator table, filter panel, or form elements.

#### Expected verification
Visual comparison (manual or snapshot test) of the comparator table, filter panel, and contact form before and after the evolution. No change in layout, alignment, overflow, or spacing is acceptable.

#### Type
- Manual

---

## 7. Functional Impacts

### Impacted components

- `Hero` — H1 class changed from Tailwind utilities to `.t-display-1`
- `BenefitsGrid` — section heading class changed to `.t-h1`
- `RoadmapSection` — section heading class changed to `.t-h1`
- `PartnershipSection` — section heading class changed to `.t-h1`
- `MiniComparator` — section heading class changed to `.t-h1`
- `ContactForm` — section heading class changed to `.t-h1`
- Global body/root stylesheet — `font-feature-settings` added to `<body>`

### Impacted data

- None. This evolution is purely presentational.

### Impacted APIs

- None.

### Impacted permissions / roles

- None.

---

## 8. Out of Scope

- Responsive tracking variants — letter-spacing is fixed at −0.045 em at all screen sizes.
- Typography sizing, line-height, or general scale changes.
- Loading additional font weights (Inter 800 is already loaded).
- Any component not listed in section 4 (Scope → Included) of the Needs Assessment.
- Components inside the comparator table, filter panel, form fields, or body copy paragraphs.
- Mountain bike, gravel, or non-road-wheel sections (not present in current product).

---

## 9. Constraints

- EVO-007 must be complete and its `.t-display-1` and `.t-h1` classes importable from the frontend before EVO-009 can be implemented.
- The tracking value −0.045 em may appear tight on very small screens; this is accepted as-is per product decision and requires no responsive override.
- No new font assets may be loaded as part of this evolution.
- All heading styles must be expressed through design system classes only — no Tailwind utility duplication into `tailwind.config`.

---

## 10. Test Plan

### Automated tests expected

- Static code search (AC-005): confirm zero occurrences of `font-bold` or `tracking-tight` on heading-level elements within the six components in scope.

### Manual tests expected

- AC-001: Verify Hero H1 `font-weight: 800` in DevTools computed styles.
- AC-002: Verify Hero H1 `letter-spacing: −0.045em` in DevTools computed styles.
- AC-003: Verify `<body>` `font-feature-settings: 'ss01', 'ss02', 'cv11'` in DevTools computed styles.
- AC-004: Verify all section headings in the five listed components carry `.t-h1` in the DOM.
- AC-006: Visual spot-check of the comparator table, filter panel, and contact form for layout regression.

### Edge cases

- Mobile viewport (≤ 375 px): confirm H1 and section headings remain legible and correctly classed despite tight tracking.
- Section heading inside `MiniComparator`: confirm the heading is not a table header cell (`<th>`) accidentally affected by unrelated table styles.

### Non-regression

- The comparator table, filter panel, and contact form must be spot-checked visually before and after the change to confirm no layout, alignment, or overflow regression introduced by the body-level `font-feature-settings`.
