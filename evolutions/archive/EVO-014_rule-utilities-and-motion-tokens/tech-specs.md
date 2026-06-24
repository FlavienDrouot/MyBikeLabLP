# Technical Specifications

## 1. General Information

- **Evolution ID:** EVO-014
- **PRD reference:** `MyBikeLab/evolutions/EVO-014_rule-utilities-and-motion-tokens/prd.md`
- **Author:** Flavien Drouot
- **Date:** 2026-05-27

---

## 2. Technical Context

### Technical objective

Replace ad-hoc Tailwind border tokens on visual separators with design system rule utility classes (`.rule`, `.rule-strong`, `.rule-faint`, `.rule-double`); replace Tailwind default transition values on interactive elements with DS motion CSS custom property tokens (`--duration-*`, `--ease-standard`, `--ease-emphasized`); and add a permanently visible italic annotation sub-element (`<span class="t-annotation">`) next to every price value in the ComparisonTable price column and the WheelDetailPanel.

No new components, no new data fields, no logic changes. Six components are affected.

### Affected architecture

- `frontend/src/index.css` — shared button utility classes (`.btn-primary`, `.btn-ghost`, `.btn-outline`) defined with `@layer components` using `@apply transition-colors`. These need motion token override.
- `frontend/src/components/` — five component files directly modified.
- `frontend/src/config/wheelProperties.jsx` — the price column `renderCell` function is the single source of truth for the price cell content; the annotation sub-text is added here.

### Impacted modules

| Module | Nature of change |
|---|---|
| `frontend/src/index.css` | Replace `transition-colors` with DS motion tokens in `.btn-primary`, `.btn-ghost`, `.btn-outline` |
| `frontend/src/components/Navbar.jsx` | Replace `transition-colors` on nav links and mobile menu button with DS motion tokens |
| `frontend/src/components/Footer.jsx` | Replace `border-t border-ink-10` on `<footer>` with `<hr class="rule-strong">` |
| `frontend/src/components/RoadmapSection.jsx` | Add a rule-class divider between section header and the grid |
| `frontend/src/components/MiniComparator/ComparisonTable.jsx` | Replace `border-b border-ink-3` on the table header row container and `divide-y divide-ink-3` on `<tbody>` with rule equivalents; replace `transition-colors` on row hover |
| `frontend/src/config/wheelProperties.jsx` | Update price `renderCell` to return a block with price + annotation sub-text |
| `frontend/src/components/MiniComparator/WheelDetailPanel.jsx` | Add annotation sub-text below each `price_eur` value (manufacturer and each retailer row) |

---

## 3. Technical Constraints

- The `.t-annotation`, `.rule`, `.rule-strong`, `.rule-faint`, `.rule-double` class definitions in `design-system/colors_and_type.css` (mirrored as `frontend/src/design-tokens.css`) must not be modified.
- Motion tokens must be consumed as inline CSS custom properties (`transition: color var(--duration-quick) var(--ease-standard)`), not as new Tailwind config extensions, so that their values remain strictly tied to the DS source and do not diverge if the DS file is updated.
- No component restructuring: only class replacement and sub-element addition are permitted.
- EVO-007 is a prerequisite (DS token wiring already complete). `--duration-*`, `--ease-standard`, `--ease-emphasized`, `--rule-*` CSS custom properties are confirmed available at runtime via `frontend/src/design-tokens.css`.
- Rule classes target `<hr>` elements or elements styled as block-level separators. They must not be applied to elements that carry content or layout responsibilities.
- The annotation must not appear when `price_eur` is `null` or absent.

---

## 4. Architecture Decisions

### AD-001 — Motion tokens applied via `style` prop or `@layer utilities`, not Tailwind config

#### Description
Tailwind's `tailwind.config.js` does not currently register `transitionDuration` or `transitionTimingFunction` extensions that map to the DS tokens. Motion tokens are consumed as inline CSS custom properties using either a `style` prop (`style={{ transition: 'color var(--duration-quick) var(--ease-standard)' }}`) or by defining a custom utility class in `index.css @layer utilities`.

The preferred approach for elements currently using `@apply transition-colors` in `index.css` (`.btn-*` classes) is to add a `@layer utilities` override or to replace the `@apply` with explicit `transition` declarations using the custom properties directly in the `@layer components` block.

For component-level transitions (Navbar links, table rows), the `transition-colors` Tailwind class is removed and replaced by an inline `style` prop carrying the full `transition` declaration.

#### Motivation
Adding Tailwind token extensions for every DS motion value would couple the Tailwind config to the DS token structure. The tokens are already available as CSS custom properties at runtime; consuming them directly keeps the DS as the single source of truth. It also avoids generating unused utility classes.

#### Rejected alternatives
- **Extending `tailwind.config.js`** with `transitionDuration` and `transitionTimingFunction` keys: rejected because it duplicates values that are already authoritatively defined in `design-tokens.css`, creating two potential sources of truth that can drift.
- **Using Tailwind's `duration-*` and `ease-*` utility classes with hardcoded values**: rejected because it does not reference the DS tokens at all.

---

### AD-002 — Rule classes applied via `<hr>` element or class replacement on existing border containers

#### Description
Three distinct situations are present in the codebase:

1. **Footer**: `<footer className="border-t border-ink-10 ...">` — the `border-t border-ink-10` classes are removed from the `<footer>` element. A sibling `<hr className="rule-strong" />` is inserted as the first child of `<footer>`, outside the `container-page` div, to serve as the full-width top separator.

2. **ComparisonTable header row container**: `<div className="... border-b border-ink-3">` — `border-b border-ink-3` are removed. A `<hr className="rule" />` is inserted after the closing `</div>` of the header block (between header and `<table>`).

3. **ComparisonTable tbody row dividers**: `<tbody className="divide-y divide-ink-3">` — `divide-y divide-ink-3` are removed. The visual separation between rows is instead achieved by adding `className="rule-faint"` to a one-pixel-height `<tr>` separator row rendered between each data row, OR by applying a bottom border directly to each `<tr>` using `border-b` pointing to `var(--rule-faint)` via a CSS utility. Given the constraint that rule classes target block-level separator elements, the cleanest approach is to add `border-b` with an inline style on each `<tr>` using `var(--rule-faint)`. See AD-002-note below.

4. **RoadmapSection**: No existing separator is present between the section header block and the grid. The PRD requires at least one rule class to be used. A `<hr className="rule" />` is inserted between the header `<div>` and the `mt-12 grid` `<div>`.

#### Motivation
Using `<hr>` is semantically correct for thematic breaks/dividers and works with the `.rule*` classes (which set `border-top`). Removing `divide-y` from `<tbody>` requires a different approach because `divide-y` applies `border-top` to every child except the first; a block-level `<hr>` cannot be placed inside `<tbody>` between `<tr>` elements in valid HTML. The resolution is to apply a bottom border to each `<tr>` using `style={{ borderBottom: '1px solid var(--rule-faint)' }}` and remove `divide-y divide-ink-3` from the `<tbody>`.

#### Rejected alternatives
- **Leaving `divide-y` on `<tbody>` and marking it as rule-equivalent**: rejected because FR-001 explicitly prohibits coexistence of ad-hoc Tailwind border tokens with rule classes on the same visual separator.
- **Inserting `<tr><td colSpan={n}><hr class="rule-faint" /></td></tr>` separator rows**: rejected because it breaks row index parity (e.g., odd/even logic), changes the DOM structure, and would require adjustments to `colSpan` calculations.

---

### AD-003 — Price annotation rendered as inline `<span>` block inside `renderCell`, conditioned on price existence

#### Description
The price `renderCell` in `wheelProperties.jsx` is updated to return a JSX fragment containing two elements: the existing price string and a new `<span className="t-annotation block">` below it. The annotation text is the static string `"indicative price, sourced 2025-Q2"`.

The `block` utility class is added to `t-annotation` to force the annotation onto its own line beneath the price value without changing the cell's layout model.

In `WheelDetailPanel.jsx`, each `price_eur` display site (manufacturer section and each retailer list item) is wrapped in a `<span className="flex flex-col items-end">` (already `flex-shrink-0`). The annotation `<span className="t-annotation">` is appended within this wrapper. The condition `price_eur != null` already gates the manufacturer price display — the annotation inherits the same gate.

#### Motivation
The annotation is a static UI label with no data dependency. Embedding it in `renderCell` keeps the price column fully self-contained within the registry pattern. The WheelDetailPanel change is minimal: add the annotation span adjacent to each price display site.

#### Rejected alternatives
- **Adding an `annotation` field to `wheelsData.js`**: rejected because the annotation is not wheel-specific data; it applies uniformly to all prices and is a UI labeling concern, not a data concern.
- **Rendering the annotation in a tooltip**: rejected; FR-003 requires it to be always visible without interaction.

---

## 5. Task Breakdown

---

# TASK-001 — Replace button transition tokens in index.css

## Objective
In `frontend/src/index.css`, update the three shared button utility classes (`.btn-primary`, `.btn-ghost`, `.btn-outline`) to replace Tailwind's `transition-colors` with explicit `transition` declarations using DS motion custom properties.

## Required context
- The DS motion tokens are: `--duration-quick: 140ms` and `--ease-standard: cubic-bezier(0.2, 0.0, 0.0, 1.0)`. Both are defined in `frontend/src/design-tokens.css` (verbatim copy of `design-system/colors_and_type.css`).
- Tailwind's `transition-colors` applies `transition-property: color, background-color, border-color, ...; transition-duration: 150ms; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1)`.
- The replacement must preserve the same `transition-property` scope (color, background-color, border-color) but switch duration and easing to DS values.
- In `@layer components`, `@apply` is used for most rules. The transition override must be written as a plain CSS `transition` property, not via `@apply`, because Tailwind has no utility class for DS-token-based durations.

## Potentially impacted files
- `frontend/src/index.css`

## Inputs
- Current `.btn-primary` definition: `@apply inline-flex items-center justify-center rounded-xs bg-brass-7 px-5 py-2.5 text-sm font-semibold text-ink-12 hover:bg-brass-8 transition-colors;`
- Current `.btn-ghost` definition: `@apply inline-flex items-center justify-center rounded-xs px-5 py-2.5 text-sm font-semibold text-ink-11 hover:text-brass-8 transition-colors;`
- Current `.btn-outline` definition: `@apply inline-flex items-center justify-center rounded-xs border border-ink-4 px-5 py-2.5 text-sm font-semibold text-ink-11 hover:border-brass-8 hover:text-brass-8 transition-colors;`

## Expected outputs
In each of the three classes:
- Remove `transition-colors` from the `@apply` directive.
- Add an explicit `transition` property: `transition: color var(--duration-quick) var(--ease-standard), background-color var(--duration-quick) var(--ease-standard), border-color var(--duration-quick) var(--ease-standard);`

## Constraints
- Do not modify any other class in `index.css`.
- Do not add new Tailwind config entries.
- The DS token variable names must be used verbatim: `var(--duration-quick)`, `var(--ease-standard)`.

## Dependencies
none

## Validation criteria
- [ ] `.btn-primary`, `.btn-ghost`, `.btn-outline` no longer contain `transition-colors` in the `@apply` directive.
- [ ] Each button class has an explicit `transition` declaration referencing `var(--duration-quick)` and `var(--ease-standard)`.
- [ ] Browser devtools (Computed > Transitions) on a `.btn-primary` element shows `transition-duration: 140ms` and `transition-timing-function: cubic-bezier(0.2, 0, 0, 1)`.
- [ ] Hover visual behavior on all buttons is unchanged (color/bg/border change on hover, no layout shift).

## Tests to implement
### Unit
- None (visual-only change, no logic).
### Integration
- Manual: hover each button type (Hero CTAs, Navbar Contact button, Navbar outline button) and confirm the transition fires and completes in a perceptibly short time.

---

# TASK-002 — Replace transition tokens in Navbar component

## Objective
In `frontend/src/components/Navbar.jsx`, replace all `transition-colors` occurrences with explicit inline `style` transition declarations using DS motion tokens.

## Required context
- DS motion tokens: `--duration-quick: 140ms`, `--ease-standard: cubic-bezier(0.2, 0.0, 0.0, 1.0)`.
- The Navbar uses `btn-ghost` and `btn-primary` CSS classes (defined in `index.css`) for the main nav links and Contact button. After TASK-001, those classes already use DS tokens — no further change is needed for those elements.
- The mobile hamburger button has an explicit `transition-colors` Tailwind class applied directly on the `<button>` element (line 34): `className="md:hidden inline-flex ... hover:text-brass-8 transition-colors focus-visible:..."`. This inline class must be updated.
- The Navbar `<header>` element has `border-b border-ink-3`. This is the sticky header underline separator, not a standalone section divider. Per FR-001, the PRD lists Navbar only under FR-002 (motion), not FR-001 (rules). The `border-b border-ink-3` on the header element is out of scope for EVO-014.
- The mobile menu drawer `<div>` has `border-t border-ink-3`. Same scoping rule applies — out of scope.

## Potentially impacted files
- `frontend/src/components/Navbar.jsx`

## Inputs
- Mobile menu `<button>` element at line 34, current classes include `transition-colors`.

## Expected outputs
- On the mobile hamburger `<button>`: remove `transition-colors` from its `className` string. Add `style={{ transition: 'color var(--duration-quick) var(--ease-standard)' }}` prop to the element.
- No other changes to `Navbar.jsx`.

## Constraints
- Do not alter the sticky positioning, backdrop blur, border, or any structural attribute of the Navbar.
- The `btn-ghost` and `btn-primary` nav links do not need changes here — they inherit the fix from TASK-001.
- The mobile menu open/close `transition-transform` animation (`transition-transform duration-200 ease-out` on the filter drawer in `MiniComparator.jsx`) is out of scope. The Navbar mobile drawer does not have a JS-driven transition class; only the hamburger button hover is in scope.

## Dependencies
TASK-001 (because `btn-ghost` / `btn-primary` classes must already use DS tokens before this task is considered complete for the full Navbar scope)

## Validation criteria
- [ ] The mobile hamburger `<button>` no longer has `transition-colors` in its `className`.
- [ ] The mobile hamburger button has a `style` prop with `transition: color var(--duration-quick) var(--ease-standard)`.
- [ ] Browser devtools on the hamburger button shows `transition-duration: 140ms`.
- [ ] Navbar links (using `btn-ghost`) and Contact button (using `btn-primary`) show DS token durations in devtools (inherited from TASK-001).
- [ ] Navbar functionality is fully intact: sticky scroll behavior, mobile menu open/close, backdrop blur.

## Tests to implement
### Unit
- None.
### Integration
- Manual: hover the hamburger icon on mobile viewport, confirm color transition. Hover nav links and Contact button, confirm transition fires correctly.

---

# TASK-003 — Replace divider in Footer component

## Objective
In `frontend/src/components/Footer.jsx`, remove the ad-hoc `border-t border-ink-10` classes from the `<footer>` element and replace the visual separator with a DS rule class element.

## Required context
- Current `<footer>` opening tag: `<footer className="border-t border-ink-10 bg-ink-12">`.
- The rule class `.rule-strong` applies `border-top: 1px solid var(--rule-strong)`. This is the appropriate weight for a primary section boundary (footer is the terminal section boundary of the page).
- The separator must span the full width of the page. The `<hr>` must be placed outside the `container-page` div to achieve this.
- The `.rule-strong` class definition sets only `border-top` — it does not include `border: 0` (only `.rule` and `.rule-double` reset to `border: 0`). The `<hr>` element has a browser default `border` which may conflict. The `<hr>` must carry both `rule` and `rule-strong`, or carry `rule-strong` with an explicit `border: 0; border-top: 1px solid var(--rule-strong)` inline style. The safest approach is: `<hr className="rule rule-strong" />` — applying `.rule` (which resets `border: 0` and sets `border-top`) then `.rule-strong` (which overrides `border-top` color). Because CSS cascade order matters and both classes set `border-top`, `.rule-strong` must come after `.rule` in the class list to override it.

## Potentially impacted files
- `frontend/src/components/Footer.jsx`

## Inputs
- Current Footer JSX (full file, 24 lines).

## Expected outputs
- `<footer>` opening tag becomes: `<footer className="bg-ink-12">` (border classes removed).
- An `<hr className="rule rule-strong" />` element is inserted as the first child of `<footer>`, before the `<div className="container-page ...">`.

## Constraints
- The footer background color (`bg-ink-12`) and all content inside the `container-page` div must remain unchanged.
- The `<hr>` must not be placed inside the `container-page` div (that would constrain its width to the container).
- No other styling attributes on the `<footer>` element may be changed.

## Dependencies
none

## Validation criteria
- [ ] `<footer>` element no longer has `border-t` or `border-ink-10` in its `className`.
- [ ] An `<hr className="rule rule-strong" />` is the first child of `<footer>`.
- [ ] The rendered footer top separator is visually a hairline and matches the `--rule-strong` color.
- [ ] Footer content and layout are visually unchanged.
- [ ] DOM inspection shows no `border-b`, `border-t`, or `border-ink-*` on the separator element.

## Tests to implement
### Unit
- None.
### Integration
- Manual: scroll to the footer. Inspect the separator in devtools. Verify it is an `<hr>` element with the `.rule-strong` class and `border-top` set to the DS rule color.

---

# TASK-004 — Add rule divider to RoadmapSection component

## Objective
In `frontend/src/components/RoadmapSection.jsx`, insert an `<hr className="rule" />` element to introduce a DS-rule-class separator between the section header block and the phase cards grid.

## Required context
- The PRD (FR-001) requires at least three components to use rule classes. RoadmapSection is explicitly named.
- The current component has no horizontal divider between the section title block and the `mt-12 grid`. The `<hr>` introduces the DS primitive where none existed.
- `.rule` applies the default separator weight: `border-top: 1px solid var(--rule-default)`. This is appropriate for a within-section structural break.
- The `<hr>` must be placed between the closing `</div>` of the `text-center max-w-2xl mx-auto` header block and the opening `<div className="mt-12 grid ...">` of the phase cards grid, inside the `container-page` div.

## Potentially impacted files
- `frontend/src/components/RoadmapSection.jsx`

## Inputs
- Current RoadmapSection JSX (full file, 75 lines).

## Expected outputs
- An `<hr className="rule mt-8" />` inserted between the closing `</div>` of the header block (line 38 in the current file) and the opening `<div className="mt-12 grid gap-6 md:grid-cols-3">` (line 40). The `mt-8` Tailwind spacing class is added to provide visual breathing room consistent with the existing `mt-12` on the grid below (the `mt-12` margin on the grid can remain as-is to maintain its spacing from the hr).

## Constraints
- No structural or layout change to the section, cards, or header block.
- The `<hr>` must be inside the `container-page` `<div>` (not the outer `<section>`).

## Dependencies
none

## Validation criteria
- [ ] An `<hr>` element with `className="rule mt-8"` is present between the section header and the grid.
- [ ] The rendered separator is a hairline at `--rule-default` color.
- [ ] The phase cards grid and section header are visually unchanged except for the new separator.
- [ ] DOM inspection confirms no `border-*` ad-hoc token on the new separator element.

## Tests to implement
### Unit
- None.
### Integration
- Manual: scroll to the Roadmap section. Inspect the DOM to confirm the `<hr class="rule mt-8">` element. Verify it renders as a hairline.

---

# TASK-005 — Replace dividers and transition in ComparisonTable component

## Objective
In `frontend/src/components/MiniComparator/ComparisonTable.jsx`, perform three changes: (1) replace `border-b border-ink-3` on the table header container with a DS rule element; (2) replace `divide-y divide-ink-3` on `<tbody>` with a per-row border using `var(--rule-faint)`; (3) replace `transition-colors` on the hover `<tr>` with a DS motion token transition.

## Required context
- **Header container separator (line 34):** `<div className="flex items-center justify-between px-5 py-4 border-b border-ink-3">`. The `border-b border-ink-3` must be removed. A `<hr className="rule" />` is inserted between the closing `</div>` of this header block and the opening `<div className="overflow-x-auto">`. This separator is between the "Wheels — N of M" header and the table itself.
- **Row dividers (line 60):** `<tbody className="divide-y divide-ink-3">`. The `divide-y divide-ink-3` classes must be removed. Each data `<tr>` must receive `style={{ borderBottom: '1px solid var(--rule-faint)' }}` to replicate the row separation using the DS faint rule token. This approach is required because `<hr>` elements are invalid inside `<tbody>` in HTML. The last row will also have a bottom border; this is acceptable (it sits against the card boundary and is visually absorbed).
- **Row hover transition (line 64):** `<tr className="hover:bg-paper-2 transition-colors cursor-pointer" ...>`. The `transition-colors` class must be removed. A `style` prop must be added (or merged with the existing inline style): `style={{ borderBottom: '1px solid var(--rule-faint)', transition: 'background-color var(--duration-quick) var(--ease-standard)' }}`.
- The chevron icon transition (line 77): `transition-transform duration-150` — this is a transform-only transition on an icon within the row. Per FR-002, only existing hover transitions on interactive elements are in scope. The chevron is a visual affordance that animates on row expand, not a hover effect. It is out of scope for this evolution and must not be changed.
- DS tokens: `--duration-quick: 140ms`, `--ease-standard: cubic-bezier(0.2, 0.0, 0.0, 1.0)`, `--rule-faint` (defined as `border-top: 1px solid var(--rule-faint)` in the DS `.rule-faint` class).

## Potentially impacted files
- `frontend/src/components/MiniComparator/ComparisonTable.jsx`

## Inputs
- Full ComparisonTable.jsx file (98 lines).

## Expected outputs
1. In the header container `<div>` (line 34): remove `border-b border-ink-3` from the `className`.
2. Insert `<hr className="rule" />` between the closing `</div>` of the header block and `<div className="overflow-x-auto">`.
3. On `<tbody>` (line 60): remove `divide-y divide-ink-3` from `className`.
4. On each data row `<tr>` (line 64): remove `transition-colors` from `className`. Add (or replace the `style` prop): `style={{ borderBottom: '1px solid var(--rule-faint)', transition: 'background-color var(--duration-quick) var(--ease-standard)' }}`.

## Constraints
- The chevron icon `transition-transform duration-150` is explicitly out of scope — do not modify it.
- The `WheelDetailPanel` expansion row `<tr>` (line 81) must not receive a bottom border style (it is not a data row).
- No changes to column rendering, filtering, sorting, or expand/collapse logic.
- The `card overflow-hidden w-fit max-w-full` wrapper class on the outer div must not change.

## Dependencies
none

## Validation criteria
- [ ] The header container `<div>` no longer has `border-b` or `border-ink-3`.
- [ ] An `<hr className="rule" />` is present between the table header block and the `overflow-x-auto` div.
- [ ] `<tbody>` no longer has `divide-y` or `divide-ink-3`.
- [ ] Each data row `<tr>` has `style` containing `borderBottom: '1px solid var(--rule-faint)'`.
- [ ] Each data row `<tr>` has `style` containing `transition: 'background-color var(--duration-quick) var(--ease-standard)'`.
- [ ] Browser devtools on a table row shows `transition-duration: 140ms` on background-color.
- [ ] Row hover highlight still fires visually (background changes to `paper-2` on hover).
- [ ] Expand/collapse behavior is unchanged.
- [ ] The chevron icon transition is unchanged (`duration-150`).

## Tests to implement
### Unit
- None.
### Integration
- Manual: hover table rows, confirm background transition. Inspect row styles in devtools. Click a row to expand WheelDetailPanel, confirm normal behavior. Confirm no layout shift on separator change.

---

# TASK-006 — Add price annotation to ComparisonTable price column

## Objective
In `frontend/src/config/wheelProperties.jsx`, update the `price` property's `renderCell` function to render the price value with a permanently visible annotation sub-text below it.

## Required context
- The price property is defined at lines 109–125 of `wheelProperties.jsx`. Its `renderCell` currently returns a string: `` `${minPrice(w).toLocaleString('fr-FR')} €` ``.
- The annotation text is the static string: `"indicative price, sourced 2025-Q2"`.
- The `.t-annotation` class is defined in `design-tokens.css` as: italic, 400 weight, `--text-sm` font size, `--fg-muted` color. Adding the Tailwind `block` utility forces it onto its own line below the price value.
- The `renderCell` must return JSX (not a plain string) to include the annotation span. The `price` property's `renderCell` already could return JSX (the registry supports it as `(w: any) => any`).
- The cell's `cellClassName` is `px-4 py-3 text-right font-semibold text-ink-11 tabular-nums`. The annotation inside will be displayed right-aligned (inherits `text-right` from the `<td>`). If the annotation text is too wide for the column at narrow viewports, the cell will wrap — this is acceptable per the PRD's test plan (responsive spot check is manual).
- The `minPrice` helper is already imported/defined at line 35.

## Potentially impacted files
- `frontend/src/config/wheelProperties.jsx`

## Inputs
- Current `renderCell`: `(w) => \`${minPrice(w).toLocaleString('fr-FR')} €\``
- `minPrice` function: `(wheel) => Math.min(...wheel.prices.map((p) => p.price_eur))`
- All wheels in `wheelsData.js` have at least one `prices` entry with a non-null `price_eur`.

## Expected outputs
Replace the `renderCell` in the `price` property with:
```jsx
renderCell: (w) => (
  <>
    <span>{minPrice(w).toLocaleString('fr-FR')} €</span>
    <span className="t-annotation block">indicative price, sourced 2025-Q2</span>
  </>
),
```

## Constraints
- The annotation must only be rendered when a price exists. The current data has no null-price wheels, but the `minPrice` accessor would return `-Infinity` for a wheel with an empty `prices` array. The guard is: only render the annotation if `w.prices?.length > 0`. This aligns with UC-003 edge case ("If a wheel has no price data, no annotation is shown"). The updated `renderCell` must include this guard.
- The `cellClassName` on the price property must remain unchanged. Do not modify `column.headClassName` or `column.cellClassName`.
- Do not alter the `accessor`, `filter`, `sorts`, or any other property field of the price entry.

## Dependencies
none

## Validation criteria
- [ ] The `price` property's `renderCell` returns a JSX fragment containing both the price value and the annotation span.
- [ ] The annotation span has `className="t-annotation block"`.
- [ ] The annotation text is exactly `"indicative price, sourced 2025-Q2"`.
- [ ] The annotation is visible without hover in the rendered ComparisonTable for every row that has price data.
- [ ] The annotation is styled italic and in `--fg-muted` color (consistent with `.t-annotation`).
- [ ] If `w.prices` is empty or absent, no annotation span is rendered.
- [ ] Table layout is not broken: no overflow of the price cell at desktop viewport.

## Tests to implement
### Unit
- None (visual-only, no extractable logic unit).
### Integration
- Manual: open the comparator, verify the annotation appears below the price in every row.
- Manual: responsive check at 375px viewport width — verify annotation does not overflow outside the card.

---

# TASK-007 — Add price annotation to WheelDetailPanel component

## Objective
In `frontend/src/components/MiniComparator/WheelDetailPanel.jsx`, add the permanent italic annotation sub-text below every `price_eur` value displayed in the panel (manufacturer section and each retailer row).

## Required context
- The WheelDetailPanel has two price display sites:
  1. **Manufacturer price** (lines 32–35): rendered when `manufacturer.price_eur != null`. The price is in a `<span className="font-semibold text-ink-11 font-mono tabular-nums">`.
  2. **Retailer prices** (lines 59–62): each retailer's `r.price_eur` rendered in `<span className="font-semibold text-ink-11 font-mono tabular-nums">`.
- Both price spans sit inside a parent `<span className="flex items-center gap-3 flex-shrink-0">`. To add the annotation below the price (not beside it), the parent flex container's direction must change to `flex-col` and alignment to `items-end` for that group. The Buy link should remain at the same level.
- Revised approach: wrap only the price span and annotation in a `<span className="flex flex-col items-end">`, and keep the Buy link outside that wrapper but still in the parent `<span className="flex items-center gap-3 flex-shrink-0">`.
- The annotation text: `"indicative price, sourced 2025-Q2"`.
- The annotation class: `t-annotation`.
- The annotation must not render when `price_eur` is `null` (the manufacturer section already guards this; retailer entries in the data always have `price_eur` as a number, but the guard should be applied defensively).

## Potentially impacted files
- `frontend/src/components/MiniComparator/WheelDetailPanel.jsx`

## Inputs
- Full WheelDetailPanel.jsx file (84 lines).

## Expected outputs

**Manufacturer price block** (replace lines 31–35):
```jsx
{manufacturer.price_eur != null && (
  <span className="flex flex-col items-end flex-shrink-0">
    <span className="font-semibold text-ink-11 font-mono tabular-nums">
      {manufacturer.price_eur.toLocaleString('fr-FR')} &euro;
    </span>
    <span className="t-annotation">indicative price, sourced 2025-Q2</span>
  </span>
)}
```
The Buy link (`<a href={manufacturer.url} ...>`) remains in the parent flex row alongside this new block.

**Retailer price block** (replace lines 59–62):
```jsx
<span className="flex flex-col items-end flex-shrink-0">
  <span className="font-semibold text-ink-11 font-mono tabular-nums">
    {r.price_eur.toLocaleString('fr-FR')} &euro;
  </span>
  <span className="t-annotation">indicative price, sourced 2025-Q2</span>
</span>
```
The Buy link (`<a href={r.url} ...>`) remains in the parent flex row alongside this new block.

The parent `<span className="flex items-center gap-3 flex-shrink-0">` retains its current structure; only the price+annotation sub-block is wrapped.

## Constraints
- No structural changes to the WheelDetailPanel beyond the price annotation addition.
- The panel dimensions (`max-h-[140px]`, `flex items-center gap-5 px-5 py-3`) must not change.
- Annotation must not appear when `price_eur` is null or absent.
- The Buy links must remain accessible and at the same visual level as before.

## Dependencies
none

## Validation criteria
- [ ] The annotation `<span className="t-annotation">` is present below the manufacturer price (when `price_eur != null`).
- [ ] The annotation is present below each retailer price.
- [ ] The annotation text is exactly `"indicative price, sourced 2025-Q2"` in both locations.
- [ ] The annotation is rendered without hover or interaction.
- [ ] The annotation is styled italic and uses `--fg-muted` color (`.t-annotation` class).
- [ ] Buy links remain functional and visible.
- [ ] The panel does not overflow its `max-h-[140px]` container when annotation is present for wheels with multiple retailer entries (spot-check with a wheel that has 2+ retailers).
- [ ] No annotation is rendered for wheels with `manufacturer.price_eur === null` (e.g., DT Swiss ARC 1100, Shimano Dura-Ace).

## Tests to implement
### Unit
- None.
### Integration
- Manual: click any wheel row to open the WheelDetailPanel. Verify the annotation appears for all visible prices. Scroll inside the panel for wheels with multiple retailers (e.g., Roval Alpinist CLX II: 2 retailers; Bontrager Aeolus: 2 retailers). Click a wheel with `manufacturer.price_eur: null` (e.g., DT Swiss id 3) and confirm no annotation appears for the manufacturer section while retailer annotations still appear.

---

## 6. Global Validation Strategy

### Unit validation
- No unit tests are required or expected for this evolution (per PRD section 10). All changes are class substitution and static label addition with no new logic.

### Integration validation
- All seven tasks include manual integration tests. Execute each task's validation criteria checklist after implementation.

### Functional validation
- AC-001 through AC-006 from the PRD are the acceptance criteria. Map tasks to ACs:
  - AC-001 (rule classes): TASK-003, TASK-004, TASK-005
  - AC-002 (motion tokens): TASK-001, TASK-002, TASK-005
  - AC-003 (price annotation — ComparisonTable): TASK-006
  - AC-004 (price annotation — WheelDetailPanel): TASK-007
  - AC-005 (no functionality regression): all tasks
  - AC-006 (transition durations perceptibly acceptable): TASK-001, TASK-002, TASK-005

### Non-regression validation
- Full-page walkthrough after all tasks are implemented: filters, column show/hide, sort, WheelDetailPanel open/close, Navbar links, CTAs.
- Cross-browser spot check: Chrome, Firefox, Safari — confirm rule class hairlines and transitions render correctly.
- Responsive spot check at 375px: confirm annotation does not overflow price cells or WheelDetailPanel.

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|---|---|---|
| `--rule-faint` CSS variable not defined in `design-tokens.css` | Row separators in ComparisonTable would be invisible or fall back to browser default | Verify `--rule-faint` is defined before implementing TASK-005. If absent, use `--rule-default` instead. |
| `<hr>` element browser default styles conflict with `.rule*` classes | Separator appears as a thicker or differently styled line than expected | The `.rule` class sets `border: 0` which resets the browser default `<hr>` border. Apply `.rule` first in TASK-003. Always use `<hr className="rule rule-strong">` pattern where `.rule` resets and `.rule-strong` sets color. |
| Price annotation overflows `max-h-[140px]` in WheelDetailPanel for wheels with many retailer entries | Panel content clips | The `overflow-y-auto` on the content div (line 19) already handles overflow with scrolling. No additional risk. |
| Annotation in ComparisonTable increases row height, causing table layout shift | Comparator appears taller per row | Expected and acceptable; the annotation adds visual height. No layout constraints require uniform row height. Verify no `overflow: hidden` clips the annotation. |
| `transition: background-color` inline style on `<tr>` conflicts with Tailwind's `hover:bg-paper-2` | Hover state may not animate | No conflict: the Tailwind class sets the hover background value; the inline `style` sets the transition property. Both are needed and work together. |

---

## 8. Rollback Plan

- All changes are class replacements and small JSX additions. Rollback is a simple revert of each changed file individually via `git checkout -- <file>`.
- Task ordering is independent (no task creates a dependency that would break a previous task on rollback). Tasks can be reverted individually without affecting others.
- No database migrations, no API changes, no new dependencies — full rollback is safe at any point.
