# PRD — Product Requirements Document

## 1. General Information

- **Evolution ID:** EVO-003
- **Title:** Design System Migration — Notebook Direction
- **Author:** Flavien Drouot
- **Date:** 2026-05-26
- **Version:** 1.0
- **Needs Assessment reference:** `EVO-003_design-system-migration/needs-assessment.md`

---

## 2. Functional Objective

After this evolution, the MyBikeLab landing page presents a deliberate premium-minimal visual identity — warm paper backgrounds, deep ink type, brass accent, hairline borders, tabular numerals — consistently applied across all 7 sections. The generic blue-on-white SaaS aesthetic is fully replaced. The Wheel Comparator remains fully functional. No arbitrary design values are introduced.

---

## 3. Target Behavior

### General description

The entire landing page — Navbar, Hero, MiniComparator (FilterPanel, ComparisonTable, ColumnSelector), Roadmap, Benefits, Partnership, and Footer — renders in the Notebook direction defined in `MyBikeLab/design-system/`. All color, typography, shape, and spacing values are expressed as named tokens registered in `tailwind.config.js`. The visual result signals precision and editorial seriousness to both end users and B2B prospects. The Wheel Comparator retains all existing filtering, sorting, and column visibility behavior.

---

## 4. Functional Rules

### FR-001 — New color palette replaces legacy palette

All color usage across the frontend must reference the new design system palette: `paper-*` (warm off-white surfaces), `ink-*` (redesigned warm-neutral scale), `brass-*` (premium accent), and `sage-*` (secondary support). The legacy `brand-*` (blue) tokens are fully retired. The `ink-*` token family is redefined — all prior slate-based `ink-*` values are replaced by the new warm-neutral scale.

### FR-002 — Warm paper backgrounds replace white

Every surface that previously used a white or near-white background must use a paper-scale token. Large surfaces and the hero section use `paper-0`. The default page background uses `paper-1`. Recessed panels (table headers, filter wells) use `paper-2`. The class `bg-white` must not appear in any first-party component after migration.

### FR-003 — Brass is the sole accent color

The brass scale is the only permitted accent color. It is used for: the primary CTA button fill (`brass-7` background, `ink-12` text), focus rings (`brass-8`), key metric values in the comparator (brass text on paper), and text-hover states on links. Blue is not used for any interactive or accent role.

### FR-004 — Focus rings use brass across all interactive elements

Every interactive element (buttons, inputs, links, checkboxes, range sliders, column selector toggles) must show a brass focus ring on keyboard focus. No blue focus ring is permitted.

### FR-005 — Square surfaces; minimal rounding

Cards, panels, and the comparator table use square corners (`radius: 0`). Inputs and buttons use a 2px radius. Pill badges (status tags, filter chips) use a full pill radius (`999px`). No other border-radius values are used on first-party components.

### FR-006 — Hairline borders replace drop shadows on cards and panels

Cards, panels, and the comparator table use a `1px solid ink-4` border. No `box-shadow` drop shadows appear on cards or panels. The elevation model relies entirely on hairline borders and background-color differentiation between paper steps.

### FR-007 — JetBrains Mono applied to all numeric values in the comparator

All numeric data in the ComparisonTable — weight, price, rim depth, rim width, and any other numeric column — is rendered in JetBrains Mono with tabular figures (`font-variant-numeric: tabular-nums`). Inter remains the font for all labels, headings, and UI text.

### FR-008 — All-caps micro labels applied to column headers and axis labels

Column headers in ComparisonTable and filter axis labels in FilterPanel are rendered as all-caps micro labels: uppercase, tight tracking, `ink-7` color, small size. This is the signature MyBikeLab UI device defined in the design system.

### FR-009 — All design values expressed as named tokens

Every color, typography, spacing, and border-radius value introduced or updated during migration must be a named token registered in `tailwind.config.js` under `theme.extend`. No arbitrary Tailwind values (`[...]` syntax) for design properties may be introduced. The three accepted layout exceptions from EVO-002 remain unchanged and are still permitted.

### FR-010 — Design system is the authoritative visual reference

`MyBikeLab/design-system/colors_and_type.css` is the authoritative source for all hex values. Any deviation from the Notebook direction spec must be explicitly justified in the evolution's documentation.

### FR-011 — FilterPanel.module.css updated to match new palette

The raw hex values in `FilterPanel.module.css` (range slider track and thumb) must be updated to reflect the new design system palette. Each hex value must remain annotated with its token equivalent, following the convention established in EVO-002.

### FR-012 — Wheel Comparator functionality preserved

Filtering (range, multiSelect, triState), sorting, and column visibility must continue to work identically after migration. No behavioral regression is acceptable.

### FR-013 — Responsive rendering preserved

The landing page must render correctly at desktop (≥ 1024px) and mobile (< 768px) viewports after migration. The migration does not alter layout structure.

---

## 5. Detailed Use Cases

### UC-001 — End user: first impression on the landing page

#### Preconditions
- The user visits the MyBikeLab landing page for the first time on a desktop browser.

#### Steps
1. The page loads and the Hero section renders.
2. The user scrolls through Navbar → Hero → MiniComparator → Roadmap → Benefits → Partnership → Footer.

#### Expected result
- Every section renders in warm paper tones with deep ink text, no blue palette visible.
- The Hero heading uses Inter 800, generous whitespace, and brass accent on key stats.
- The Wheel Comparator numeric data appears in JetBrains Mono, tabular-aligned.
- The CTA button shows a brass fill.
- The overall aesthetic reads as precise, editorial, and data-driven — consistent with the "lab instrument × editorial" positioning.

#### Error cases
- Any section shows legacy blue (`brand-*`) or white background (`bg-white`) → visual inconsistency, non-conformant.

---

### UC-002 — B2B prospect: credibility perception

#### Preconditions
- A manufacturer or retailer visits the landing page as part of a partnership outreach.

#### Steps
1. The prospect lands on the page and reviews the full landing experience.

#### Expected result
- The visual identity communicates premium quality and precision, consistent with the pitch positioning.
- No generic SaaS patterns (blue buttons, white cards, drop shadows) appear.
- The Roadmap and Partnership sections render cleanly in the Notebook direction.

#### Error cases
- Legacy blue or drop shadows present → aesthetic mismatch with pitch claims.

---

### UC-003 — Developer adds a new component

#### Preconditions
- A developer (or AI assistant) needs to build a new component for the landing page after EVO-003 is merged.

#### Steps
1. The developer consults `tailwind.config.js` for available tokens.
2. The developer applies named tokens (`bg-paper-1`, `text-ink-11`, `border-ink-4`, `font-mono`, etc.) without opening the design system files.

#### Expected result
- All tokens needed for standard layout, color, and typography are available in `tailwind.config.js`.
- The resulting component is visually consistent with the Notebook direction without requiring design file consultation.

#### Error cases
- A required token is missing → the developer must add it to `tailwind.config.js` following the EVO-002 convention, and must not use an arbitrary value.

---

### UC-004 — Legacy class detected after migration (error case)

#### Preconditions
- Migration is considered complete and a compliance audit is run.

#### Steps
1. The audit command is run against `src/` for `brand-*` classes and `bg-white` occurrences.
2. A match is found in a component file.

#### Expected result
- The match is identified as a violation.
- The class is replaced with the appropriate new token before merge.

#### Error cases
- The violation is left unresolved → the landing page renders with inconsistent colors; non-conformant for production merge.

---

## 6. Acceptance Criteria

### AC-001 — Legacy brand-* tokens fully retired
#### Description
No first-party component file in `src/` contains a `brand-*` Tailwind class after migration.
#### Expected verification
Run a search for `brand-` across all `.jsx`, `.tsx`, `.css` files in `src/`. Zero matches expected (excluding `tailwind.config.js` where the old tokens may remain until explicitly removed).
#### Type
- Automated

---

### AC-002 — bg-white retired
#### Description
No first-party component file contains `bg-white`.
#### Expected verification
Search for `bg-white` across all `.jsx`, `.tsx`, `.css` files in `src/`. Zero matches expected.
#### Type
- Automated

---

### AC-003 — New palette tokens registered in tailwind.config.js
#### Description
`tailwind.config.js` defines `paper-*`, `ink-*` (new scale), `brass-*`, and `sage-*` color scales under `theme.extend.colors`, with hex values matching `design-system/colors_and_type.css`.
#### Expected verification
Open `tailwind.config.js` and verify the presence and correctness of all four color families. Cross-reference hex values against the design system file.
#### Type
- Manual

---

### AC-004 — Square corners on cards, panels, comparator table
#### Description
No `rounded-*` class (other than `rounded-xs` on inputs/buttons or `rounded-full` on badges) appears on card, panel, or table elements.
#### Expected verification
Visual inspection: cards, panels, and the comparator table have square corners. Inputs and buttons show 2px radius. Badges show pill radius.
#### Type
- Manual

---

### AC-005 — Brass CTA button
#### Description
The primary CTA button uses a brass fill (`brass-7` background, `ink-12` text) and no blue.
#### Expected verification
Visual inspection of the Hero CTA button and any other primary action button on the landing page.
#### Type
- Manual

---

### AC-006 — Brass focus rings
#### Description
All interactive elements show a brass focus ring on keyboard navigation.
#### Expected verification
Tab through the landing page and verify that focus rings on buttons, inputs, links, checkboxes, and sliders are brass-colored, not blue.
#### Type
- Manual

---

### AC-007 — Hairline borders, no drop shadows on cards and panels
#### Description
All cards and panels use `1px solid ink-4` borders. No `shadow-*` or `drop-shadow` classes appear on card or panel elements in first-party components.
#### Expected verification
Visual inspection: no visible drop shadows on any card or panel. Search `src/` for `shadow-` on elements identified as cards or panels.
#### Type
- Manual + Automated

---

### AC-008 — JetBrains Mono on numeric comparator values
#### Description
JetBrains Mono is loaded and applied to all numeric data columns in ComparisonTable (weight, price, rim depth, rim width). Tabular figures are active.
#### Expected verification
Visual inspection of the comparator table: numeric values render in monospace with aligned columns. Verify `font-mono` token in `tailwind.config.js` maps to `JetBrains Mono`.
#### Type
- Manual

---

### AC-009 — No arbitrary design values introduced
#### Description
No new arbitrary Tailwind values for color, typography, or spacing are added during migration. The three accepted layout exceptions from EVO-002 remain the only permitted arbitrary values.
#### Expected verification
Run EVO-002 compliance audit commands against `src/`. Any new match (not covered by the three existing exceptions) is a violation.
#### Type
- Automated

---

### AC-010 — FilterPanel.module.css updated to new palette
#### Description
The hex values in `FilterPanel.module.css` for the range slider track and thumb reflect the new design system palette, and each is annotated with its new token equivalent.
#### Expected verification
Open `FilterPanel.module.css` and verify that hex values match the new brass/ink palette, and that each has a comment identifying its token equivalent.
#### Type
- Manual

---

### AC-011 — All 7 sections render in Notebook direction
#### Description
Navbar, Hero, MiniComparator, Roadmap, Benefits, Partnership, and Footer all render with no visual legacy from the blue-on-white palette.
#### Expected verification
Full-page visual inspection on desktop viewport. No blue, no drop shadows on surfaces, no `bg-white` visible.
#### Type
- Manual

---

### AC-012 — Wheel Comparator fully functional
#### Description
Filtering (range sliders, multi-select, tri-state toggles), sorting, and column visibility work identically to pre-migration behavior.
#### Expected verification
Manual testing of all filter types, sort interactions, and column show/hide in the comparator on both desktop and mobile viewports.
#### Type
- Manual

---

### AC-013 — Responsive rendering preserved
#### Description
The landing page renders correctly at desktop (≥ 1024px) and mobile (< 768px) viewports. No layout breaks, overflow, or visual regressions introduced.
#### Expected verification
Visual inspection at both breakpoints in browser devtools.
#### Type
- Manual

---

## 7. Functional Impacts

### Impacted components

- `src/components/Navbar/` — colors, focus rings
- `src/pages/Landing.jsx` — background, section layout colors
- `src/components/Hero/` — background, CTA button, typography, brass accent on stats
- `src/components/MiniComparator/MiniComparator.jsx` — panel backgrounds, borders
- `src/components/MiniComparator/FilterPanel.jsx` + `FilterPanel.module.css` — slider track/thumb, filter chip styles, focus rings
- `src/components/MiniComparator/ComparisonTable.jsx` — table borders, header background, numeric font, cell colors
- `src/components/MiniComparator/ColumnSelector.jsx` — toggle styles, borders, backgrounds
- `src/components/Roadmap/` — card colors, borders, shadows
- `src/components/Benefits/` — card colors, borders, shadows
- `src/components/Partnership/` — section background and text colors
- `src/components/Footer/` — background (dark section: `ink-12`), text colors
- `src/index.css` — shared utility classes updated to new palette
- `tailwind.config.js` — new token definitions added; legacy tokens retired or redefined

### Impacted data

- None. `src/data/wheelsData.js` and `src/config/wheelProperties.jsx` are not modified.

### Impacted APIs

- None. Frontend-only migration.

### Impacted permissions / roles

- None.

---

## 8. Out of Scope

- Component logic, layout structure, user-facing behavior — no functional changes
- Icon library replacement (existing SVGs retained; `stroke-width` adjustment to `1.4` is a visual-only opt-in, not required for this PRD)
- Wheel dataset and property registry
- Redux state, selectors, and filter logic
- Blueprint and Instrument design directions
- Hero schematic grid decoration
- Enforcement linting rules or CI compliance checks for tokens
- `node_modules/`, auto-generated files, and third-party code

---

## 9. Constraints

- Tailwind CSS must not be replaced or removed.
- All new tokens must be defined under `theme.extend` in `tailwind.config.js` — not as raw CSS variables — to maintain EVO-002 Option A convention.
- JetBrains Mono must be loaded via Google Fonts CDN and registered as a named `font-mono` token.
- The three accepted layout arbitrary values from EVO-002 remain in force and are not in scope.
- `MyBikeLab/design-system/colors_and_type.css` is the authoritative hex value source — no deviation without explicit justification.
- The EVO-002 token convention document (`token-convention.md`) is the authoritative naming reference; it must be updated to reflect the new token vocabulary introduced by EVO-003.
- The app may be in a visually inconsistent state during migration. A single final merge to production is acceptable.

---

## 10. Test Plan

### Automated tests expected

- AC-001: search for `brand-` in `src/` (zero matches)
- AC-002: search for `bg-white` in `src/` (zero matches)
- AC-009: run EVO-002 compliance audit commands; verify no new arbitrary values beyond accepted exceptions

### Manual tests expected

- AC-003: verify token definitions in `tailwind.config.js` against design system
- AC-004: visual inspection of corner radius on cards, panels, table, inputs, buttons, badges
- AC-005: visual inspection of CTA button fill (brass)
- AC-006: keyboard tab navigation — verify brass focus rings on all interactive elements
- AC-007: visual inspection for absence of drop shadows on cards and panels
- AC-008: visual inspection of JetBrains Mono on numeric columns in ComparisonTable
- AC-010: review `FilterPanel.module.css` hex values and token annotations
- AC-011: full-page visual inspection at desktop viewport — all 7 sections in Notebook direction
- AC-012: functional testing of all comparator interactions (filter, sort, column visibility)
- AC-013: responsive visual inspection at desktop (≥ 1024px) and mobile (< 768px)

### Edge cases

- Mobile viewport: filter panel, column selector, and CTA button must render correctly in brass/paper palette at < 768px
- Dark section (Footer): `ink-12` background with `paper-1` text must maintain legibility
- Focus ring visibility on `paper-2` recessed backgrounds: brass focus ring must remain clearly visible

### Non-regression

- No `brand-*` class survives in any first-party component
- No `bg-white` survives in any first-party component
- No new arbitrary design value is introduced
- All Wheel Comparator interactions work as before migration
- No layout breaks introduced at desktop or mobile breakpoints
