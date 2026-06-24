# PRD — Product Requirements Document

## 1. General Information

- **Evolution ID:** EVO-015
- **Title:** Hero schematic grid and typographic glyphs
- **Author:** Flavien Drouot
- **Date:** 2026-05-27
- **Version:** 1.0
- **Needs Assessment reference:** `evolutions/EVO-015_hero-schematic-grid-and-typographic-glyphs/needs-assessment.md`

---

## 2. Functional Objective

After this evolution, the frontend matches the design system's visual signature on two axes:

1. The Hero section displays a subtle schematic grid as its background, evoking drafting paper and signalling engineering precision to any visitor landing on the page.
2. Typographic glyphs are applied consistently: primary CTAs outside the Hero carry a trailing `→`, and wheel diameter values are prefixed with `Ø` wherever they appear in the comparison interface.

---

## 3. Target Behavior

### General description

**Schematic grid (Hero only)**
The Hero section background shows a 32 px ruled grid rendered in the `ink-2` design token. The grid is a decorative texture — subtle enough not to compete with the Hero copy or stats, but visible to the eye. It is not present on any other section of the page. Its cell size and opacity are the same regardless of viewport width.

**`→` glyph on primary CTAs**
Every primary CTA link that is outside the Hero section appends a trailing `→` to its visible label. This applies to CTAs in BenefitsGrid, RoadmapSection, and any other non-Hero section that carries a primary CTA. Hero CTAs are owned by EVO-008; EVO-015 does not modify them.

**`Ø` prefix on wheel diameter**
Whenever a wheel diameter value is displayed in the UI (ComparisonTable, WheelDetailPanel), it is rendered as `Ø 700C` (or `Ø 650B`, etc.). This formatting is applied at the component or data-accessor level; the underlying data in `wheelsData.js` is not altered. No other measurement type (rim depth, rim width, weight, price) receives the `Ø` prefix.

---

## 4. Functional Rules

### FR-001 — Schematic grid scoped to the Hero section
The schematic grid background is applied exclusively to the Hero section. No other section, panel, card, or page element displays the grid pattern.

### FR-002 — Schematic grid cell size is viewport-independent
The grid cell size is 32 px on all viewport sizes. No responsive override reduces or increases the cell size on mobile or large screens.

### FR-003 — Schematic grid uses the `ink-2` token
The grid lines are rendered using the `ink-2` design token. If `ink-2` is undefined (EVO-007 not yet applied), the grid lines fall back to transparent and the grid is effectively invisible — no error or layout disruption occurs.

### FR-004 — Schematic grid is non-intrusive
The grid is a background texture. It must not introduce layout shift, overflow, or any visual interference with the Hero's foreground content (headline, stats, CTAs).

### FR-005 — `→` appended to all primary non-Hero CTAs
Every primary CTA link outside the Hero section displays a trailing `→` as part of its visible label (e.g., "See the roadmap →"). The glyph is rendered inline with the label text, not as a separate icon component.

### FR-006 — Hero CTAs are out of scope for `→`
The `→` glyph on Hero CTAs is owned by EVO-008. EVO-015 does not add or modify glyphs on Hero CTAs.

### FR-007 — `Ø` prefix applied to wheel diameter display only
Wheel diameter values are displayed as `Ø [value]` (e.g., `Ø 700C`, `Ø 650B`) in ComparisonTable and WheelDetailPanel. The `Ø` prefix is applied at the component or accessor level — `wheelsData.js` data strings remain plain (e.g., `"700C"`).

### FR-008 — `Ø` prefix is exclusive to diameter
Rim depth, rim width, weight, price, and all other measurement types must not receive the `Ø` prefix. Rim depth continues to render as `33 mm`.

### FR-009 — Numeric data style is preserved
Numeric data values that are already styled in `font-mono tabular-nums` must continue to render in that style after EVO-015. No typographic regression is introduced.

---

## 5. Detailed Use Cases

### UC-001 — Visitor lands on the Hero section

#### Preconditions
- The page has loaded successfully.
- EVO-007 is complete and `ink-2` is defined as a CSS custom property.

#### Steps
1. The visitor navigates to the MyBikeLab landing page.
2. The Hero section is displayed.

#### Expected result
- The Hero background shows a 32 px ruled grid rendered in `ink-2`.
- The grid is visible but does not distract from the Hero headline, stats, or CTAs.
- No other section of the page shows a grid background.
- No layout shift occurs on Hero load.

#### Error cases
- **`ink-2` undefined:** The grid lines are transparent. The Hero renders as a plain background with no visible grid. No error, no layout change.

---

### UC-002 — Visitor scrolls past the Hero

#### Preconditions
- The page has loaded. The Hero grid is visible.

#### Steps
1. The visitor scrolls down past the Hero into the next section.

#### Expected result
- The grid background stops at the Hero boundary.
- The next section (e.g., Wheel Comparator) shows no grid.

#### Error cases
- None.

---

### UC-003 — Visitor reads a primary CTA outside the Hero

#### Preconditions
- The page contains at least one primary CTA in BenefitsGrid, RoadmapSection, or another non-Hero section.

#### Steps
1. The visitor views the section containing the CTA.
2. The visitor reads the CTA label.

#### Expected result
- The CTA label ends with ` →` (e.g., "See the roadmap →", "Explore benefits →").
- The arrow is inline with the text, rendered in Inter using the Unicode character `→`.

#### Error cases
- None.

---

### UC-004 — User reads wheel diameter in the ComparisonTable

#### Preconditions
- At least one wheel is visible in the ComparisonTable.
- The Diameter column is visible (it is an optional column; must be shown).

#### Steps
1. The user opens the comparator.
2. The user enables the Diameter column if it is hidden.
3. The user reads a diameter cell.

#### Expected result
- The diameter value is rendered as `Ø 700C` (or `Ø 650B`, etc.).
- The `Ø` prefix is followed by a space, then the diameter string.
- Other columns (weight, rim depth, etc.) are not prefixed with `Ø`.

#### Error cases
- None.

---

### UC-005 — User reads wheel diameter in the WheelDetailPanel

#### Preconditions
- The WheelDetailPanel is open for a specific wheel.

#### Steps
1. The user selects a wheel to view its detail panel.
2. The user reads the diameter field.

#### Expected result
- Diameter is displayed as `Ø 700C` (or equivalent).
- Rim depth is displayed as `33 mm` — no `Ø` prefix.

#### Error cases
- None.

---

### UC-006 — Visitor views the page on a narrow mobile viewport

#### Preconditions
- Viewport width is at a typical mobile breakpoint (e.g., 375 px).

#### Steps
1. The visitor loads the page on a mobile device or narrow browser window.
2. The visitor views the Hero section.

#### Expected result
- The Hero grid renders at the same 32 px cell size as on desktop.
- No mobile-specific override changes the grid appearance.
- CTAs and data glyphs (`→`, `Ø`) render identically to desktop.

#### Error cases
- None.

---

## 6. Acceptance Criteria

### AC-001
#### Description
The Hero section displays a 32 px ruled grid background in `ink-2`.
#### Expected verification
Visually inspect the Hero on desktop and mobile. The grid lines are visible. Measure or confirm the 32 px spacing in browser DevTools (background-size).
#### Type
- Manual

---

### AC-002
#### Description
No section other than the Hero displays a grid background.
#### Expected verification
Scroll through all sections (Wheel Comparator, Roadmap, Benefits, Partnership, Footer). None show a grid pattern.
#### Type
- Manual

---

### AC-003
#### Description
The Hero grid cell size is 32 px on all tested viewports (mobile 375 px, tablet 768 px, desktop 1280 px+).
#### Expected verification
Open DevTools at each viewport width. Confirm `background-size` on the Hero element is `32px 32px` (or equivalent) in all cases.
#### Type
- Manual

---

### AC-004
#### Description
All primary CTA links outside the Hero display a trailing `→`.
#### Expected verification
Identify all primary CTAs in BenefitsGrid and RoadmapSection. Confirm each label ends with ` →`. Hero CTAs are excluded from this check.
#### Type
- Manual

---

### AC-005
#### Description
Wheel diameter is rendered as `Ø [value]` in the ComparisonTable Diameter column.
#### Expected verification
Enable the Diameter column in the comparator. Confirm at least two rows show values formatted as `Ø 700C` or `Ø 650B`. Confirm no other column shows a `Ø` prefix.
#### Type
- Manual

---

### AC-006
#### Description
Wheel diameter is rendered as `Ø [value]` in the WheelDetailPanel.
#### Expected verification
Open the detail panel for a wheel. Confirm the diameter field reads `Ø 700C` (or equivalent). Confirm the rim depth field reads `33 mm` with no `Ø`.
#### Type
- Manual

---

### AC-007
#### Description
Rim depth values in ComparisonTable and WheelDetailPanel carry no `Ø` prefix.
#### Expected verification
Inspect rim depth cells and the rim depth field in the detail panel. Values must render as `[number] mm` (e.g., `33 mm`).
#### Type
- Manual

---

### AC-008
#### Description
Numeric data values in `font-mono tabular-nums` are not visually regressed.
#### Expected verification
Inspect weight, price, rim depth, and rim width columns after the change. Confirm monospace tabular rendering is unchanged.
#### Type
- Manual

---

### AC-009
#### Description
No CLS regression is introduced on the Hero after the grid is added.
#### Expected verification
Run a Lighthouse audit on the landing page. CLS score must not worsen compared to the pre-EVO-015 baseline.
#### Type
- Manual (Lighthouse audit)

---

### AC-010
#### Description
`wheelsData.js` diameter strings remain plain (e.g., `"700C"`) — no `Ø` in the data file.
#### Expected verification
Inspect `wheelsData.js`. Diameter strings must not contain `Ø`. Formatting is applied only at the component or accessor layer.
#### Type
- Manual (code review)

---

## 7. Functional Impacts

### Impacted components
- `Hero.jsx` — receives the schematic grid background.
- `BenefitsGrid.jsx` (or equivalent) — primary CTAs updated with trailing `→`.
- `RoadmapSection.jsx` (or equivalent) — primary CTAs updated with trailing `→`.
- `ComparisonTable.jsx` (or equivalent) — diameter column display updated with `Ø` prefix.
- `WheelDetailPanel.jsx` (or equivalent) — diameter field display updated with `Ø` prefix.
- Any other non-Hero section containing a primary CTA.

### Impacted data
- No changes to `wheelsData.js` or any data source file. Glyph formatting is applied purely at the display layer.

### Impacted APIs
- None.

### Impacted permissions / roles
- None.

---

## 8. Out of Scope

- `Ø` prefix on rim depth — depth is a linear measurement, rendered as `[number] mm`.
- `±` tolerance formatting — no tolerance data in the current dataset; deferred to the evolution that introduces it.
- Schematic SVG wheel diagram on the Hero — reserved for the wheel-detail page (future evolution).
- Hero layout or structural changes beyond the background.
- Hero CTA copy and `→` glyph on Hero CTAs — owned by EVO-008.
- `№` and `≈` glyphs — no applicable data context in the current product scope.
- Changes to `wheelsData.js` data strings.

---

## 9. Constraints

- The schematic grid must be CSS-only (no SVG asset or raster image) for performance.
- The grid must use the `ink-2` design token. Implementation depends on EVO-007 being complete.
- No CLS regression on the Hero is acceptable. Lighthouse Performance must not worsen.
- Unicode glyphs `→` and `Ø` are rendered in Inter (coverage confirmed); no fallback icon is needed.
- The grid is exclusively a Hero background texture — it must not bleed into adjacent sections.
- The grid opacity and cell size must not vary by viewport.

---

## 10. Test Plan

### Automated tests expected
- Unit test on the diameter accessor/formatter: given input `"700C"`, output must be `"Ø 700C"`. Given input `"650B"`, output must be `"Ø 650B"`.
- Snapshot or render test on ComparisonTable diameter cell: confirms `Ø` prefix is present.
- Snapshot or render test on WheelDetailPanel diameter field: confirms `Ø` prefix; confirms rim depth field has no `Ø`.

### Manual tests expected
- Visual inspection of the Hero grid on desktop (1280 px+), tablet (768 px), and mobile (375 px).
- Scroll verification: confirm the grid is absent on all sections below the Hero.
- CTA label verification in BenefitsGrid and RoadmapSection: confirm trailing `→`.
- WheelDetailPanel walkthrough: diameter shows `Ø [value]`; rim depth shows `[number] mm`.
- ComparisonTable walkthrough with Diameter column enabled: all diameter cells show `Ø [value]`.

### Edge cases
- Hero with `ink-2` undefined (EVO-007 missing): grid falls back to invisible (transparent lines). No layout impact.
- Diameter value for an unusual format (e.g., `650B`): `Ø` prefix is applied the same way as for `700C`.
- Mobile viewport: grid renders at 32 px cell size with no override; glyphs render inline without wrapping issues.

### Non-regression
- Rim depth, rim width, weight, and price columns in ComparisonTable: no `Ø` prefix introduced.
- `font-mono tabular-nums` styling on all numeric data: visually unchanged.
- Lighthouse CLS score on the Hero: equal to or better than pre-EVO-015 baseline.
- Hero CTA labels: unmodified by this evolution (EVO-008 scope).
