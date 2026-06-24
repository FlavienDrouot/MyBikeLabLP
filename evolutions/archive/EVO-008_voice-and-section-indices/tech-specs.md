# Technical Specifications — EVO-008

## 1. General Information

- Evolution ID: EVO-008
- Title: Voice alignment and section indices
- PRD reference: `MyBikeLab/evolutions/EVO-008_voice-and-section-indices/prd.md`
- Author: Flavien Drouot
- Date: 2026-05-26

---

## 2. Technical Context

### Technical objective

Replace all non-compliant copy strings across the landing page components with voice-aligned alternatives, and add a `.t-section-index` element to sections 02–05 (replacing the current uppercase eyebrow `<span>`). Update the Hero eyebrow string in place while preserving its pill styling. Update `<title>` and `<meta name="description">` in `index.html`.

No new dependencies, no data model changes, no layout restructuring. This is a pure string and markup task.

### Affected architecture

- React component layer (JSX string literals)
- Static HTML shell (`index.html`)

### Impacted modules

- `frontend/src/components/Hero.jsx`
- `frontend/src/components/MiniComparator/MiniComparator.jsx`
- `frontend/src/components/RoadmapSection.jsx`
- `frontend/src/components/BenefitsGrid.jsx`
- `frontend/src/components/PartnershipSection.jsx`
- `frontend/src/components/Footer.jsx` — reviewed; no changes required
- `frontend/index.html`

---

## 3. Technical Constraints

- The `.t-section-index` CSS class is already defined in `frontend/src/design-tokens.css` (JetBrains Mono, `var(--text-xs)`, weight 500, `letter-spacing: 0.06em`, `color: var(--fg-muted)`). No CSS changes are needed.
- The Hero eyebrow `<span>` retains all existing Tailwind classes (`inline-flex items-center rounded-full border border-brass-4 bg-paper-0 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brass-9`). Only the text content changes. The `.t-section-index` class must not be added to this element.
- Section indices for sections 02–05 must use the `.t-section-index` class exclusively — no inline `style` attributes.
- The existing `<span>` eyebrow elements in MiniComparator, RoadmapSection, BenefitsGrid, and PartnershipSection are replaced by `<p className="t-section-index">` elements.
- Unicode characters must be embedded as literal characters in source files: `№` (U+2116), `·` (U+00B7), `→` (U+2192). Do not use HTML entities or escape sequences inside JSX string literals.
- All anchor IDs (`#tool`, `#roadmap`, `#partnerships`, `#contact`) must remain unchanged — only visible text content changes.

---

## 4. Architecture Decisions

### AD-001 — HTML element for `.t-section-index`

#### Description
Use `<p className="t-section-index">` as the element for section indices in sections 02–05, placed immediately before the `<h2>` element inside the existing header `<div>`.

#### Motivation
The section index is a standalone text node — it is not an inline label within a sentence. A `<p>` is the correct semantic choice. It also participates in normal flow without requiring additional wrapper markup. The existing eyebrow `<span>` carried no semantic role; replacing it with `<p>` is an improvement.

#### Rejected alternatives
- `<span>` — no block-level participation, same as the element being replaced; no semantic gain.
- `<div>` — valid but `<p>` is more precise for a standalone text node.
- `<span className="block t-section-index">` — needlessly verbose; `<p>` achieves the same layout result with less markup.

---

### AD-002 — No `mt-2` margin change on `<h2>` after eyebrow replacement

#### Description
The existing `<h2 className="section-title mt-2">` margin-top class `mt-2` is retained unchanged when the eyebrow `<span>` is replaced by `<p className="t-section-index">`.

#### Motivation
`mt-2` on the `<h2>` expresses spacing between the eyebrow and the heading. This relationship is the same regardless of whether the eyebrow is a `<span>` or a `<p>`. No spacing recalculation is needed. Visual regression is not a concern since the rendered output is equivalent.

#### Rejected alternatives
- Removing `mt-2` and adding `mb-2` to `<p>` — unnecessary churn with identical visual result.

---

### AD-003 — `product-overview.md` is out of scope for TASK decomposition

#### Description
AC-011 requires that `product-overview.md` contains no forbidden words. This file is not a JSX component — it is a Markdown documentation file. Its review and any required patches are handled as a standalone TASK rather than bundled into a JSX task.

#### Motivation
Keeping documentation patching separate from component changes makes each task independently reviewable and mergeable, consistent with the TECH-SPECS constraint that each task is independently testable.

#### Rejected alternatives
- Bundling `product-overview.md` review into TASK-001 (Hero) — mixes concerns; the Hero task agent would need to locate and read an unrelated documentation file.

---

## 5. Task Breakdown

---

# TASK-001 — Update Hero.jsx copy and eyebrow content

## Objective

Replace all non-compliant strings in `Hero.jsx` with the copy defined in PRD section 5. Specifically: update eyebrow text, H1 text, lead paragraph, CTA labels, stat value, and stat labels. Preserve all CSS classes unchanged.

## Required context

- `Hero.jsx` is located at `frontend/src/components/Hero.jsx` relative to the `MyBikeLab/` project root.
- The file imports `getFilterableProperties` from `'../config/wheelProperties'` for stat 2 value — this import and its usage must not be changed.
- The eyebrow element is a `<span>` with classes `inline-flex items-center rounded-full border border-brass-4 bg-paper-0 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brass-9`. These classes must not be modified (FR-008 / EVO-011 constraint).
- The `.t-section-index` class must NOT be added to the Hero eyebrow (FR-008).
- Unicode characters must be written as literal characters in the JSX source, not as HTML entities.

## Potentially impacted files

- `frontend/src/components/Hero.jsx`

## Inputs

Current file: `frontend/src/components/Hero.jsx`

Copy changes (PRD section 5):

| Element | Current value | New value |
|---|---|---|
| Eyebrow text | `MVP v0.1 — Road Bike Wheels` | `№ 01 · MVP v0.1 · Road wheels` |
| H1 inner text | `The Future of <span className="text-brass-8">Bike Component</span><br className="hidden sm:block" /> Intelligence` | `Wheels, measured. Not marketed.` (plain text, no inner span, no `<br>`) |
| Lead paragraph | `Compare, simulate, optimize. Make smarter bike decisions with structured data — starting with road wheels.` | `15 road wheels, 13 filter axes. Compare by weight, rim depth, hookless compatibility, hub brand, and price — structured in a single table.` |
| Primary CTA text | `Try the Comparator` | `Open comparator →` |
| Secondary CTA text | `See the Vision` | `See the roadmap →` |
| Stat 1 value | `15+` | `15` |
| Stat 1 label | `Wheels indexed` | `Road wheels` |
| Stat 3 label | `Phases ahead` | `Phases planned` |

Elements with no change: Stat 2 value (`{getFilterableProperties().length}`), Stat 2 label (`Filter axes`), Stat 3 value (`3`).

## Expected outputs

Updated `frontend/src/components/Hero.jsx` where:
- All eight copy strings above are replaced with their new values.
- The `<h1>` renders as a plain text node (`Wheels, measured. Not marketed.`) — the inner `<span className="text-brass-8">` and `<br className="hidden sm:block" />` are removed.
- All CSS class attributes on all elements are unchanged.
- The `getFilterableProperties` import is unchanged.
- `→` in CTA labels is the literal U+2192 character.
- `№` and `·` in the eyebrow are the literal U+2116 and U+00B7 characters.

## Constraints

- Do not add or remove any CSS class on any element.
- Do not add `.t-section-index` to the eyebrow element.
- Do not change `href` attributes on CTA links.
- Do not touch the stats grid structure or Tailwind classes.
- The `<br>` inside the current H1 must be removed since the new H1 is a short single sentence and does not need a break.

## Dependencies

None — this task is independent.

## Validation criteria

- [ ] Eyebrow text is exactly `№ 01 · MVP v0.1 · Road wheels` (verify `№` is U+2116, `·` is U+00B7).
- [ ] H1 text is exactly `Wheels, measured. Not marketed.` with no inner HTML elements.
- [ ] Lead text matches the new string exactly.
- [ ] Primary CTA label is `Open comparator →` (sentence case, `→` is U+2192).
- [ ] Secondary CTA label is `See the roadmap →` (sentence case, `→` is U+2192).
- [ ] Stat 1 value is `15` (not `15+`).
- [ ] Stat 1 label is `Road wheels`.
- [ ] Stat 3 label is `Phases planned`.
- [ ] No forbidden word present: "future of", "intelligence", "revolutionary", "game-changer", "blazingly", "ultimate" (case-insensitive grep on the file).
- [ ] No `!` character in any string literal in the file.
- [ ] All existing CSS classes on all elements are unchanged.
- [ ] `getFilterableProperties` import line is unchanged.

## Tests to implement

### Unit
- Automated grep on `Hero.jsx` for each forbidden word (case-insensitive) — must return zero matches.
- Automated grep on `Hero.jsx` for `!` in string literals — must return zero matches.
- Automated grep on `Hero.jsx` for the literal string `№ 01 · MVP v0.1 · Road wheels` — must return one match.
- Automated grep on `Hero.jsx` for `15+` — must return zero matches.

### Integration
- Visual inspection: render the landing page and verify the Hero section displays the new H1, lead, CTA labels, eyebrow, and stats as specified.
- Verify the eyebrow pill border and background styling are visually intact.

---

# TASK-002 — Update MiniComparator.jsx: replace eyebrow with section index and update copy

## Objective

In `MiniComparator.jsx`, replace the `<span>` eyebrow element with a `<p className="t-section-index">` element containing `№ 02 · COMPARATOR`, update the H2 text, and update the subtitle text.

## Required context

- `MiniComparator.jsx` is located at `frontend/src/components/MiniComparator/MiniComparator.jsx` relative to the `MyBikeLab/` project root.
- The current eyebrow is `<span className="text-sm font-semibold uppercase tracking-wider text-brass-8">Live Demo</span>`. This entire element is replaced by a `<p>` element.
- The `.t-section-index` class is defined in `frontend/src/design-tokens.css` and is already available globally — no import needed.
- The section header lives inside `<div className="text-center max-w-2xl mx-auto">`. The new `<p className="t-section-index">` replaces the `<span>` as the first child of this div.
- The `<h2 className="section-title mt-2">` element retains its existing classes unchanged.
- The functional code of `MiniComparator` (filter panel, comparison table, column selector, mobile drawer) must not be touched.

## Potentially impacted files

- `frontend/src/components/MiniComparator/MiniComparator.jsx`

## Inputs

Current header block in `MiniComparator.jsx` (lines 25–36):
```jsx
<div className="text-center max-w-2xl mx-auto">
  <span className="text-sm font-semibold uppercase tracking-wider text-brass-8">
    Live Demo
  </span>
  <h2 className="section-title mt-2">
    Start with Wheels — Explore Components
  </h2>
  <p className="section-subtitle mx-auto">
    Filter by brand, weight, depth, price and more. Sort to find the
    wheelset that fits your priorities.
  </p>
</div>
```

Copy changes:

| Element | Current value | New value |
|---|---|---|
| Eyebrow element | `<span className="text-sm font-semibold uppercase tracking-wider text-brass-8">Live Demo</span>` | `<p className="t-section-index">№ 02 · COMPARATOR</p>` |
| H2 text | `Start with Wheels — Explore Components` | `Road wheels — filter and compare` |
| Subtitle text | `Filter by brand, weight, depth, price and more. Sort to find the wheelset that fits your priorities.` | `Filter and sort by brand, weight, rim depth, price, and many more.` |

## Expected outputs

Updated `frontend/src/components/MiniComparator/MiniComparator.jsx` where:
- The `<span>` eyebrow element is replaced by `<p className="t-section-index">№ 02 · COMPARATOR</p>`.
- The H2 text is updated.
- The subtitle text is updated.
- All other code in the file is unchanged.

## Constraints

- The `<h2>` element's existing CSS classes (`section-title mt-2`) must not be modified.
- The `<p className="section-subtitle mx-auto">` element's CSS classes must not be modified.
- Do not touch any JSX below the header `<div>` (filter panel, table, mobile drawer code).
- `№` is U+2116, `·` is U+00B7 — write as literal characters.

## Dependencies

None — this task is independent.

## Validation criteria

- [ ] A `<p className="t-section-index">` element exists in the component with text content `№ 02 · COMPARATOR`.
- [ ] No `<span>` eyebrow with class `text-brass-8` remains in the header block.
- [ ] H2 text is `Road wheels — filter and compare`.
- [ ] Subtitle text matches the new string exactly.
- [ ] No forbidden word present in the file (grep, case-insensitive).
- [ ] No `!` in any string literal in the file.
- [ ] The filter panel, table, and column selector JSX are unchanged.

## Tests to implement

### Unit
- Automated grep on `MiniComparator.jsx` for `t-section-index` — must return at least one match.
- Automated grep on `MiniComparator.jsx` for `№ 02 · COMPARATOR` — must return one match.
- Automated grep on `MiniComparator.jsx` for forbidden words (case-insensitive) — must return zero matches.

### Integration
- Visual inspection: render the landing page and verify the MiniComparator section header shows `№ 02 · COMPARATOR` in monospace muted style above the H2.
- Verify filtering and sorting functionality is unaffected.

---

# TASK-003 — Update RoadmapSection.jsx: replace eyebrow with section index and update header copy

## Objective

In `RoadmapSection.jsx`, replace the `<span>` eyebrow with `<p className="t-section-index">№ 03 · ROADMAP</p>`, and update the H2 and subtitle texts.

## Required context

- `RoadmapSection.jsx` is located at `frontend/src/components/RoadmapSection.jsx` relative to the `MyBikeLab/` project root.
- The current eyebrow is `<span className="text-sm font-semibold uppercase tracking-wider text-brass-8">Roadmap</span>`.
- The section header lives inside `<div className="text-center max-w-2xl mx-auto">`.
- The `phases` array data and the card-rendering JSX below the header div are not modified.
- The H2 currently contains a typographic apostrophe in `What's Coming` — this is removed entirely since the H2 text changes.

## Potentially impacted files

- `frontend/src/components/RoadmapSection.jsx`

## Inputs

Current header block in `RoadmapSection.jsx` (lines 33–41):
```jsx
<div className="text-center max-w-2xl mx-auto">
  <span className="text-sm font-semibold uppercase tracking-wider text-brass-8">
    Roadmap
  </span>
  <h2 className="section-title mt-2">What's Coming</h2>
  <p className="section-subtitle mx-auto">
    From a focused wheel comparator to a full-stack bike intelligence
    platform — here's how we get there.
  </p>
</div>
```

Copy changes:

| Element | Current value | New value |
|---|---|---|
| Eyebrow element | `<span ...>Roadmap</span>` | `<p className="t-section-index">№ 03 · ROADMAP</p>` |
| H2 text | `What's Coming` | `Three phases` |
| Subtitle text | `From a focused wheel comparator to a full-stack bike intelligence platform — here's how we get there.` | `Comparison first. Impact simulation next. Full bike configurator on the horizon.` |

Note: The subtitle currently contains the word "intelligence". Replacing the subtitle as specified removes this forbidden word.

## Expected outputs

Updated `frontend/src/components/RoadmapSection.jsx` where:
- The `<span>` eyebrow is replaced by `<p className="t-section-index">№ 03 · ROADMAP</p>`.
- The H2 text is `Three phases`.
- The subtitle text is updated.
- The `phases` array and all card-rendering JSX are unchanged.

## Constraints

- The `<h2>` element's existing CSS classes (`section-title mt-2`) must not be modified.
- Do not touch the `phases` data array or the `.map()` render below the header.
- `№` is U+2116, `·` is U+00B7 — write as literal characters.

## Dependencies

None — this task is independent.

## Validation criteria

- [ ] A `<p className="t-section-index">` element exists with text content `№ 03 · ROADMAP`.
- [ ] No `<span>` eyebrow with class `text-brass-8` remains in the header block.
- [ ] H2 text is `Three phases`.
- [ ] Subtitle text matches the new string exactly.
- [ ] No forbidden word present in the file — specifically "intelligence" is absent (grep, case-insensitive).
- [ ] No `!` in any string literal.
- [ ] Phase titles, descriptions, and bullet points are unchanged.

## Tests to implement

### Unit
- Automated grep on `RoadmapSection.jsx` for `t-section-index` — must return at least one match.
- Automated grep on `RoadmapSection.jsx` for `№ 03 · ROADMAP` — must return one match.
- Automated grep on `RoadmapSection.jsx` for `intelligence` (case-insensitive) — must return zero matches.
- Automated grep on `RoadmapSection.jsx` for forbidden words list — must return zero matches.

### Integration
- Visual inspection: render the landing page and verify the Roadmap section opens with `№ 03 · ROADMAP` in mono muted style.
- Verify the three phase cards are visually and functionally unchanged.

---

# TASK-004 — Update BenefitsGrid.jsx: replace eyebrow with section index

## Objective

In `BenefitsGrid.jsx`, replace the `<span>` eyebrow with `<p className="t-section-index">№ 04 · BENEFITS</p>`. No other copy changes are required in this component (all other strings are already compliant per PRD section 5).

## Required context

- `BenefitsGrid.jsx` is located at `frontend/src/components/BenefitsGrid.jsx` relative to the `MyBikeLab/` project root.
- The current eyebrow is `<span className="text-sm font-semibold uppercase tracking-wider text-brass-8">Why MyBikeLab</span>`.
- The `<h2>` (`Built for serious cyclists`), card titles, and card descriptions are all PRD-compliant and must not be changed.
- The section header lives inside `<div className="text-center max-w-2xl mx-auto">`.

## Potentially impacted files

- `frontend/src/components/BenefitsGrid.jsx`

## Inputs

Current header block in `BenefitsGrid.jsx` (lines 38–42):
```jsx
<div className="text-center max-w-2xl mx-auto">
  <span className="text-sm font-semibold uppercase tracking-wider text-brass-8">
    Why MyBikeLab
  </span>
  <h2 className="section-title mt-2">Built for serious cyclists</h2>
</div>
```

Copy change:

| Element | Current value | New value |
|---|---|---|
| Eyebrow element | `<span ...>Why MyBikeLab</span>` | `<p className="t-section-index">№ 04 · BENEFITS</p>` |

## Expected outputs

Updated `frontend/src/components/BenefitsGrid.jsx` where:
- The `<span>` eyebrow is replaced by `<p className="t-section-index">№ 04 · BENEFITS</p>`.
- All other JSX (H2, `benefits` array, card rendering) is unchanged.

## Constraints

- The `<h2>` element's CSS classes must not be modified.
- The `benefits` data array and card-rendering code must not be touched.
- `№` is U+2116, `·` is U+00B7 — write as literal characters.

## Dependencies

None — this task is independent.

## Validation criteria

- [ ] A `<p className="t-section-index">` element exists with text content `№ 04 · BENEFITS`.
- [ ] No `<span>` eyebrow with class `text-brass-8` remains in the header block.
- [ ] H2 text is unchanged (`Built for serious cyclists`).
- [ ] Card titles and descriptions are unchanged.
- [ ] No forbidden word present in the file (grep, case-insensitive).

## Tests to implement

### Unit
- Automated grep on `BenefitsGrid.jsx` for `t-section-index` — must return at least one match.
- Automated grep on `BenefitsGrid.jsx` for `№ 04 · BENEFITS` — must return one match.
- Automated grep on `BenefitsGrid.jsx` for forbidden words — must return zero matches.

### Integration
- Visual inspection: render the landing page and verify the Benefits section opens with `№ 04 · BENEFITS` in mono muted style.

---

# TASK-005 — Update PartnershipSection.jsx: replace eyebrow with section index and update copy

## Objective

In `PartnershipSection.jsx`, replace the `<span>` eyebrow with `<p className="t-section-index">№ 05 · PARTNERSHIP</p>`, update the H2 text, and update the lead paragraph text.

## Required context

- `PartnershipSection.jsx` is located at `frontend/src/components/PartnershipSection.jsx` relative to the `MyBikeLab/` project root.
- The current eyebrow is `<span className="text-sm font-semibold uppercase tracking-wider text-paper-3">B2B Partnerships</span>`. Note the eyebrow text color class is `text-paper-3` (not `text-brass-8`) because this section has a dark background (`bg-ink-12`).
- The `audiences` array (Manufacturers / Resellers descriptions) is PRD-compliant and must not be changed.
- The `ContactForm` component import and usage must not be changed.
- The section header lives in the left column `<div>` of the two-column grid.

## Potentially impacted files

- `frontend/src/components/PartnershipSection.jsx`

## Inputs

Current header block in `PartnershipSection.jsx` (lines 18–28):
```jsx
<span className="text-sm font-semibold uppercase tracking-wider text-paper-3">
  B2B Partnerships
</span>
<h2 className="mt-2 t-h1">
  Join the Platform
</h2>
<p className="mt-3 text-lg text-paper-2 max-w-xl">
  We're building the trusted layer between cyclists and the components
  they buy. Help shape the dataset and the tools.
</p>
```

Copy changes:

| Element | Current value | New value |
|---|---|---|
| Eyebrow element | `<span className="text-sm font-semibold uppercase tracking-wider text-paper-3">B2B Partnerships</span>` | `<p className="t-section-index">№ 05 · PARTNERSHIP</p>` |
| H2 text | `Join the Platform` | `Work with us` |
| Lead text | `We're building the trusted layer between cyclists and the components they buy. Help shape the dataset and the tools.` | `MyBikeLab connects cyclists with structured component data. If you supply or sell road bike components, your product data belongs here.` |

## Expected outputs

Updated `frontend/src/components/PartnershipSection.jsx` where:
- The `<span>` eyebrow is replaced by `<p className="t-section-index">№ 05 · PARTNERSHIP</p>`.
- The H2 text is `Work with us`.
- The lead paragraph text is updated.
- The `<h2>` retains its existing class `mt-2 t-h1`.
- The `<p>` lead retains its existing classes `mt-3 text-lg text-paper-2 max-w-xl`.
- The `audiences` array and card rendering are unchanged.
- The `ContactForm` import and usage are unchanged.

## Constraints

- The `<h2>` element's CSS classes (`mt-2 t-h1`) must not be modified.
- The lead `<p>` element's CSS classes must not be modified.
- The `audiences` array and its `.map()` render must not be touched.
- `№` is U+2116, `·` is U+00B7 — write as literal characters.

## Dependencies

None — this task is independent.

## Validation criteria

- [ ] A `<p className="t-section-index">` element exists with text content `№ 05 · PARTNERSHIP`.
- [ ] No `<span>` eyebrow with class `text-paper-3` remains at the top of the left column.
- [ ] H2 text is `Work with us`.
- [ ] Lead text matches the new string exactly.
- [ ] No forbidden word present in the file (grep, case-insensitive).
- [ ] No `!` in any string literal.
- [ ] Manufacturers and Resellers descriptions are unchanged.

## Tests to implement

### Unit
- Automated grep on `PartnershipSection.jsx` for `t-section-index` — must return at least one match.
- Automated grep on `PartnershipSection.jsx` for `№ 05 · PARTNERSHIP` — must return one match.
- Automated grep on `PartnershipSection.jsx` for forbidden words — must return zero matches.

### Integration
- Visual inspection: render the landing page and verify the Partnership section opens with `№ 05 · PARTNERSHIP` in mono muted style, legible against the dark background.

---

# TASK-006 — Update index.html meta tags

## Objective

Update the `<title>` and `<meta name="description">` in `frontend/index.html` to the voice-compliant values specified in the PRD.

## Required context

- `index.html` is located at `frontend/index.html` relative to the `MyBikeLab/` project root.
- No other attributes or elements in `index.html` are modified.
- The Content Security Policy meta tag, viewport meta, charset, favicon link, and script tag must remain unchanged.

## Potentially impacted files

- `frontend/index.html`

## Inputs

Current values:
- `<title>MyBikeLab — Bike Component Intelligence</title>`
- `<meta name="description" content="MyBikeLab — compare, simulate and optimize bike components. MVP: road bike wheels comparator." />`

## Expected outputs

Updated `frontend/index.html` where:
- `<title>` is `MyBikeLab — Road wheel comparator`
- `<meta name="description">` content attribute is `Compare road bike wheels by weight, rim depth, hookless compatibility, hub brand, and price. 15 wheels, 13 filter axes.`
- All other content in the file is unchanged.

## Constraints

- Do not modify the CSP meta tag.
- Do not modify any other meta tags, link tags, or script tags.
- The dash in `<title>` is an em-dash (`—`, U+2014) consistent with the current format.

## Dependencies

None — this task is independent.

## Validation criteria

- [ ] `<title>` value is exactly `MyBikeLab — Road wheel comparator`.
- [ ] `<meta name="description">` content value is exactly `Compare road bike wheels by weight, rim depth, hookless compatibility, hub brand, and price. 15 wheels, 13 filter axes.`
- [ ] No forbidden word present in the file (grep for "intelligence", "future of", etc.).
- [ ] All other attributes and tags in the file are unchanged.

## Tests to implement

### Unit
- Automated grep on `index.html` for `Bike Component Intelligence` — must return zero matches.
- Automated grep on `index.html` for forbidden words (case-insensitive) — must return zero matches.
- Automated grep on `index.html` for `MyBikeLab — Road wheel comparator` — must return one match.

### Integration
- Browser DevTools inspection: open the page and verify `document.title` returns `MyBikeLab — Road wheel comparator`.
- Browser DevTools inspection: verify the meta description content in the `<head>`.

---

# TASK-007 — Review and patch product-overview.md for forbidden words

## Objective

Read `product-overview.md`, identify any occurrence of the forbidden words defined in FR-001, and replace them with voice-compliant alternatives. If no forbidden word is found, document that the file is compliant with no changes needed.

## Required context

- `product-overview.md` is located at `MyBikeLab/product-overview.md` (i.e., directly in the `MyBikeLab/` project root, not inside `frontend/`).
- Forbidden words (case-insensitive): "future of", "intelligence", "revolutionary", "game-changer", "blazingly", "ultimate".
- This is a Markdown documentation file, not a JSX component. Changes are limited to string replacements only — no structural or formatting changes.
- Replacements must preserve the meaning of the surrounding sentence. If a forbidden word cannot be cleanly replaced without rewriting a sentence, rewrite the sentence minimally to remove the forbidden word while retaining the factual content.

## Potentially impacted files

- `MyBikeLab/product-overview.md`

## Inputs

- `MyBikeLab/product-overview.md` (read in full before acting)
- Forbidden word list: "future of", "intelligence", "revolutionary", "game-changer", "blazingly", "ultimate"

## Expected outputs

- `MyBikeLab/product-overview.md` with all forbidden words removed.
- If no forbidden words are found: file is unchanged and a note is added to `spec-notes.md` confirming compliance.

## Constraints

- Do not restructure sections or headings.
- Do not change factual claims, dates, or feature descriptions beyond what is necessary to remove forbidden words.
- Preserve Markdown formatting (headers, lists, emphasis) unchanged.

## Dependencies

None — this task is independent.

## Validation criteria

- [ ] Automated grep on `product-overview.md` for each forbidden word (case-insensitive) returns zero matches.
- [ ] No factual content has been removed — only forbidden words replaced or sentences minimally rewritten.

## Tests to implement

### Unit
- Automated grep on `product-overview.md` for forbidden words list (case-insensitive) — must return zero matches.

### Integration
- Manual review: read the modified paragraphs to confirm meaning is preserved and the voice is neutral and factual.

---

## 6. Global Validation Strategy

### Unit validation
- Run grep for each forbidden word (case-insensitive) across all six component files and `index.html`: `Hero.jsx`, `MiniComparator.jsx`, `RoadmapSection.jsx`, `BenefitsGrid.jsx`, `PartnershipSection.jsx`, `Footer.jsx`, `index.html`, `product-overview.md`.
- Run grep for `!` in string literals across the same file set.
- Run grep for emoji character ranges (U+1F300–U+1FAFF) across the same file set.
- Run grep for `t-section-index` in each of the four section components (02–05) — must return exactly one match per file.
- Run grep for each expected section index string (`№ 01 · MVP v0.1 · Road wheels`, `№ 02 · COMPARATOR`, `№ 03 · ROADMAP`, `№ 04 · BENEFITS`, `№ 05 · PARTNERSHIP`) — must each return exactly one match in the correct file.

### Integration validation
- Render the landing page in a browser and perform a full scroll-through (UC-001).
- Inspect section header elements in DevTools to confirm `.t-section-index` class is present on sections 02–05 and absent from the Hero eyebrow.

### Functional validation
- UC-001: Full scroll-through — no forbidden words, section indices visible, no emojis, no exclamation marks, CTAs in sentence case.
- UC-002: B2B partner evaluation — Partnership section opens with `№ 05 · PARTNERSHIP`, H2 and lead are credible.
- UC-003: Search crawler — `<title>` and `<meta name="description">` are compliant.
- UC-004: Developer DOM inspection — sections 02–05 each have exactly one `.t-section-index` element with correct content.

### Non-regression validation
- MiniComparator: filter, sort, and column selector interactions must function identically to pre-EVO-008 behavior.
- All anchor links (`#tool`, `#roadmap`, `#partnerships`, `#contact`) must resolve correctly.
- Hero eyebrow pill styling (`rounded-full`, border, background) must be visually intact.
- Mobile viewport: `.t-section-index` elements must not overflow their containers.

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Unicode characters `№` (U+2116) and `·` (U+00B7) entered as wrong codepoints or HTML entities | Section index strings fail AC-007 automated check | Specify "write as literal characters" explicitly in each task constraint; use grep to verify code points post-implementation |
| H1 inner `<span className="text-brass-8">` removed but brass styling desired on part of the new H1 | Visual regression on the hero heading | PRD explicitly specifies plain text `Wheels, measured. Not marketed.` with no inner markup — no brass highlight needed; confirm visually after TASK-001 |
| `product-overview.md` contains many occurrences of "intelligence" (product was previously positioned as "bike component intelligence") | TASK-007 requires meaningful rewrites, not just word substitution | TASK-007 allows minimal sentence rewrite; agent must read the full file before acting |
| `.t-section-index` class not visible on dark background in `PartnershipSection` | `color: var(--fg-muted)` resolves to `var(--ink-7)` = `#6e6d65` which may have insufficient contrast on `bg-ink-12` (`#0e0f0c`) | Verify visually after TASK-005; if contrast is insufficient, raise as a design system issue in a follow-up — out of scope for EVO-008 |

---

## 8. Rollback Plan

- All changes are isolated to string literals and one element type swap (`<span>` → `<p>`) in six files.
- Rollback: revert the relevant file(s) via `git revert` or `git checkout` on the affected commits.
- Each TASK is independently mergeable — partial rollback of individual tasks is possible without affecting others.
- No database migrations, no API changes, no dependency version bumps — rollback has zero infrastructure impact.
