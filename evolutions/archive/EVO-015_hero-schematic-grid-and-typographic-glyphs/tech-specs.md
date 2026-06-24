# Technical Specifications

## 1. General Information

- **Evolution ID:** EVO-015
- **PRD reference:** `evolutions/EVO-015_hero-schematic-grid-and-typographic-glyphs/prd.md`
- **Author:** Flavien Drouot
- **Date:** 2026-05-27

---

## 2. Technical Context

### Technical objective

Three independent changes, none of which modifies data or global architecture:

1. Apply a CSS-only `32 px` ruled grid background exclusively to the `Hero` section, using the `--ink-2` custom property.
2. Add a trailing `→` Unicode glyph to every primary CTA in non-Hero sections (`RoadmapSection`, `BenefitsGrid`).
3. Render wheel diameter values with a `Ø ` prefix in `ComparisonTable` and `WheelDetailPanel`, applied at the display layer — the underlying data in `wheelsData.js` is not altered.

### Affected architecture

- **CSS layer** (`frontend/src/index.css`) — one new utility class for the Hero grid.
- **Component layer** (`Hero.jsx`, `RoadmapSection.jsx`, `BenefitsGrid.jsx`) — markup changes only.
- **Property registry** (`wheelProperties.jsx`) — `renderCell` override on the `diameter` entry; new `formatDiameter` utility function.
- **No Redux changes. No data changes. No routing changes.**

### Impacted modules

| File | Change type |
|---|---|
| `frontend/src/index.css` | Add `.hero-grid-bg` utility class |
| `frontend/src/components/Hero.jsx` | Add `hero-grid-bg` class to `<section>` |
| `frontend/src/components/RoadmapSection.jsx` | No CTA present — confirmed no action required (see spec-notes) |
| `frontend/src/components/BenefitsGrid.jsx` | No primary CTA present — confirmed no action required (see spec-notes) |
| `frontend/src/config/wheelProperties.jsx` | Add `formatDiameter` helper; add `renderCell` override on `diameter` entry |
| `frontend/src/components/MiniComparator/WheelDetailPanel.jsx` | Add diameter field display with `Ø` prefix |

---

## 3. Technical Constraints

- The Hero grid must be CSS-only — no SVG, no raster image, no JS.
- The grid must use `var(--ink-2)`. If `--ink-2` is undefined (EVO-007 not yet merged), the grid lines must be transparent — no fallback hex value is allowed.
- The grid must not introduce CLS on the Hero. Using `background-image` on an existing element fulfills this constraint by design.
- `background-size: 32px 32px` must not have any responsive override — no media query changes this value.
- The `→` glyph is the literal Unicode character U+2192, rendered inline as text. It is not a Lucide icon or separate `<span>` element.
- The `Ø` prefix is applied at the display layer only. `wheelsData.js` data strings must remain plain numeric values.
- `font-mono tabular-nums` styling on all numeric columns must not be regressed.
- Hero CTAs are out of scope (owned by EVO-008).

---

## 4. Architecture Decisions

### AD-001 — Hero grid via a dedicated CSS utility class, not inline style

#### Description
The Hero grid background is applied by adding a named class (`hero-grid-bg`) defined in `frontend/src/index.css`, not via a Tailwind `style` attribute or arbitrary value.

#### Motivation
- Keeps the `<section>` JSX readable.
- Centralises the design-token reference (`var(--ink-2)`) in the CSS layer, alongside other token usages.
- The class name makes grep-discoverability trivial for future maintainers.
- Arbitrary Tailwind values (`[background-image:...]`) would be verbose, non-standard, and harder to read.

#### Rejected alternatives
- **Inline `style` prop on `<section>`**: works but mixes layout logic with style; harder to override in a design-system context.
- **Tailwind arbitrary value**: syntactically unwieldy for a two-gradient `background-image`; no benefit over a named class.

---

### AD-002 — `Ø` prefix applied via `renderCell` override in the property registry

#### Description
The `diameter` entry in `WHEEL_PROPERTIES` (`wheelProperties.jsx`) receives a `renderCell` function that formats the value as `Ø [label]`. A new exported helper `formatDiameter(rawMm)` maps numeric mm values to ISO nominal labels (e.g. `700 → "700C"`, `650 → "650B"`) and prepends `Ø `.

#### Motivation
- The property registry is the declared single source of truth for all column rendering (see README conventions).
- Adding `renderCell` to the `diameter` entry requires editing exactly one file and zero component files.
- `ComparisonTable` already dispatches through `renderCellFor`, which reads `property.column.renderCell` — no change to `ComparisonTable` logic is needed.

#### Rejected alternatives
- **Formatting inside `ComparisonTable`**: would require `ComparisonTable` to know that the `diameter` property is special — violates the registry-first convention.
- **Formatting inside `WheelDetailPanel`**: `WheelDetailPanel` currently renders affiliate links, not raw specs. It does not read from `wheelProperties.jsx` at all, so a local guard would be a one-off. The detail panel needs its own display — see AD-003.

---

### AD-003 — `WheelDetailPanel` diameter field rendered with `formatDiameter` directly

#### Description
`WheelDetailPanel` does not use `wheelProperties.jsx` at all — it accesses `wheel` props directly and renders affiliate data. There is no diameter field in the current panel.

The PRD (UC-005, AC-006) requires diameter to be shown in the panel as `Ø [value]`. This means a new diameter display line must be added to `WheelDetailPanel`, using the same `formatDiameter` helper exported from `wheelProperties.jsx`.

#### Motivation
- Reuses `formatDiameter` from a single source — no duplication of the label map.
- Keeps `WheelDetailPanel` consistent with the formatting logic without importing the full registry.

#### Rejected alternatives
- **Adding a diameter row via the registry**: would require a structural change to `WheelDetailPanel` to iterate `wheelProperties` — disproportionate scope.

---

### AD-004 — `formatDiameter` uses a static lookup map, not a computed string

#### Description
`diameter_mm` in the dataset is a raw numeric value (e.g. `700`). ISO nominal labels (e.g. `700C`, `650B`) are not derivable from the mm value by arithmetic — they are conventional designations. A static map `{ 700: '700C', 650: '650B' }` is used. If a value is not in the map, the function falls back to rendering the raw mm value with no ISO suffix (e.g. `Ø 584`).

#### Motivation
- Honest about the limit: there is no algorithm that reliably maps `diameter_mm` to the conventional "700C / 650B / 26in" label.
- The fallback is safe and non-breaking for any future diameter values.
- The map is small and can be extended as new diameter values are added to the dataset.

#### Rejected alternatives
- **Reading ISO label from the data**: would require adding a `diameter_label` field to `wheelsData.js` — this is a data change, which the PRD explicitly prohibits.
- **Computed suffix via rules**: no reliable formula exists.

---

### AD-005 — `→` on non-Hero primary CTAs: text change in component JSX, no new abstraction

#### Description
After auditing `RoadmapSection.jsx` and `BenefitsGrid.jsx`, neither component contains a primary CTA link (i.e. a `<a>` with a `btn-primary` class). `RoadmapSection` uses no `btn-primary` links. `BenefitsGrid` has no CTA links at all. Therefore, **no code change is needed for the `→` glyph in non-Hero sections at this time**.

The `Hero.jsx` secondary CTA already carries `→` ("See the roadmap →") and the primary CTA already carries `→` ("Open comparator →"). These are in-scope Hero CTAs owned by EVO-008 — EVO-015 does not modify them.

If future sections are added with primary CTAs, the convention is: append ` →` to the link text inline.

#### Motivation
- No component contains the target pattern today. Writing dead-code or empty tasks would inflate scope.
- The PRD's FR-005 scopes the requirement to existing primary CTAs in BenefitsGrid and RoadmapSection. Neither has one.

#### Rejected alternatives
- **Adding a CTA to RoadmapSection or BenefitsGrid**: out of scope for EVO-015, which is display-only.
- **Creating a `PrimaryLink` wrapper component**: over-engineering for a Unicode character appended to text.

---

## 5. Task Breakdown

---

# TASK-001 — Add Hero schematic grid background CSS class

## Objective
Define a `.hero-grid-bg` CSS utility class in `frontend/src/index.css` that renders a 32 px ruled grid using `var(--ink-2)` as the line color. This class is the sole CSS change needed for the Hero grid feature.

## Required context
- The design-system reference for this pattern is in `design-system/ui_kits/landing/landing.css`, rule `.dir-blueprint .hero`:
  ```css
  background-image:
    linear-gradient(to right, var(--ink-2) 1px, transparent 1px),
    linear-gradient(to bottom, var(--ink-2) 1px, transparent 1px);
  background-size: 32px 32px;
  ```
- `var(--ink-2)` is defined in `frontend/src/design-tokens.css` as `#e4e2d6`. If the custom property is undefined (e.g. EVO-007 not yet applied), the grid lines will be transparent — this is intentional per FR-003.
- `frontend/src/index.css` is structured with `@layer components { ... }` — new component utilities go inside this layer.
- No media query must vary `background-size` — cell size is viewport-independent (FR-002, FR-003, AC-003).

## Potentially impacted files
- `frontend/src/index.css`

## Inputs
- Design-system reference: `design-system/ui_kits/landing/landing.css`, lines 133–138 (`.dir-blueprint .hero` rule)
- Token value: `--ink-2` defined in `frontend/src/design-tokens.css`, line 39

## Expected outputs
Inside `@layer components { ... }` in `frontend/src/index.css`, add:

```css
.hero-grid-bg {
  background-image:
    linear-gradient(to right, var(--ink-2) 1px, transparent 1px),
    linear-gradient(to bottom, var(--ink-2) 1px, transparent 1px);
  background-size: 32px 32px;
}
```

No other rules. No media queries. No opacity override.

## Constraints
- Class name must be `.hero-grid-bg` (used in TASK-002).
- Must be placed inside the `@layer components` block.
- No media query override for `background-size`.
- No hardcoded hex color — `var(--ink-2)` only.

## Dependencies
None.

## Validation criteria
- [ ] `.hero-grid-bg` class exists in `frontend/src/index.css` inside `@layer components`.
- [ ] The class uses `var(--ink-2)` and no hardcoded color.
- [ ] `background-size` is `32px 32px` with no override at any breakpoint.
- [ ] Removing `--ink-2` from `:root` causes the grid to be invisible (transparent), with no layout impact.

## Tests to implement
### Unit
- None (pure CSS; no JS logic).

### Integration
- Manual: Open DevTools on the landing page, inspect the Hero `<section>`. Confirm `background-size: 32px 32px` is present when `.hero-grid-bg` is applied (verified in TASK-002).

---

# TASK-002 — Apply `hero-grid-bg` class to Hero section

## Objective
Add the `.hero-grid-bg` CSS class to the root `<section>` element in `frontend/src/components/Hero.jsx`. This is the only JSX change needed to display the grid.

## Required context
- `frontend/src/components/Hero.jsx` — the Hero component. The root element is:
  ```jsx
  <section id="top" className="relative overflow-hidden">
  ```
- The class `.hero-grid-bg` is defined in TASK-001.
- `overflow-hidden` is already present and prevents any grid from bleeding past the Hero boundary (FR-001, FR-004).
- Hero CTAs (`btn-primary` and `btn-outline`) must not be modified (FR-006, EVO-008 scope).

## Potentially impacted files
- `frontend/src/components/Hero.jsx`

## Inputs
- `frontend/src/components/Hero.jsx` — current root `<section>` element (line 6–8)
- TASK-001 output: `.hero-grid-bg` class

## Expected outputs
The `<section>` opening tag is updated to:
```jsx
<section id="top" className="relative overflow-hidden hero-grid-bg">
```

No other changes to `Hero.jsx`.

## Constraints
- Only the root `<section>` element receives the class — no child elements.
- Do not modify Hero CTA text, structure, or classes.
- `overflow-hidden` must remain on the element.

## Dependencies
TASK-001

## Validation criteria
- [ ] The root `<section>` in `Hero.jsx` has `hero-grid-bg` in its `className`.
- [ ] No other element in `Hero.jsx` has `hero-grid-bg`.
- [ ] Hero CTAs are unchanged from their pre-EVO-015 state.
- [ ] Visual: a 32 px grid is visible on the Hero background at desktop (1280 px+), tablet (768 px), and mobile (375 px).
- [ ] Visual: the grid is absent from every section below the Hero (MiniComparator, Roadmap, Benefits, Footer).
- [ ] No layout shift on page load (Lighthouse CLS unchanged).

## Tests to implement
### Unit
- None.

### Integration
- Manual AC-001: inspect Hero background at 1280 px, 768 px, 375 px. Grid is visible.
- Manual AC-002: scroll to MiniComparator, Roadmap, Benefits, Footer. No grid visible.
- Manual AC-003: DevTools confirm `background-size: 32px 32px` at all tested viewports.
- Manual AC-009: Lighthouse audit — CLS score equal to or better than baseline.

---

# TASK-003 — Add `formatDiameter` helper to `wheelProperties.jsx`

## Objective
Export a pure function `formatDiameter(rawMm)` from `frontend/src/config/wheelProperties.jsx`. Given a raw numeric diameter value (as stored in `wheelsData.js`), it returns the formatted display string including the `Ø` prefix and ISO nominal label.

## Required context
- `frontend/src/data/wheelsData.js` — all current wheels have `diameter_mm: 700` (numeric integer, not string). No `650` values exist yet but are anticipated (PRD section 3, UC-004, edge cases).
- ISO nominal mapping: `700 → "700C"`, `650 → "650B"`. No arithmetic formula exists — this must be a lookup map.
- Fallback: if `rawMm` is not in the map, render `Ø ${rawMm}` (no ISO suffix). This handles future diameters gracefully.
- The function will be used in two places: the `renderCell` override for the `diameter` entry (TASK-004) and `WheelDetailPanel` (TASK-005).
- `frontend/src/config/wheelProperties.jsx` already exports several helpers (`minPrice`, `getFilterableProperties`, etc.) — `formatDiameter` follows the same export pattern.

## Potentially impacted files
- `frontend/src/config/wheelProperties.jsx`

## Inputs
- Current content of `frontend/src/config/wheelProperties.jsx`
- PRD FR-007, FR-008, FR-009, AC-005, AC-006, AC-007, AC-010

## Expected outputs
Add the following export near the top of `wheelProperties.jsx`, before `WHEEL_PROPERTIES`:

```js
/** Maps raw numeric diameter_mm values to ISO nominal labels. */
const DIAMETER_LABEL_MAP = {
  700: '700C',
  650: '650B',
};

/**
 * Formats a raw diameter_mm value for display.
 * Returns "Ø 700C", "Ø 650B", or "Ø {rawMm}" for unmapped values.
 * @param {number} rawMm
 * @returns {string}
 */
export const formatDiameter = (rawMm) => {
  const label = DIAMETER_LABEL_MAP[rawMm] ?? String(rawMm);
  return `Ø ${label}`;
};
```

(`Ø` is the Unicode escape for `Ø` — using the escape ensures encoding safety in all environments.)

## Constraints
- `DIAMETER_LABEL_MAP` is module-private (not exported) — only `formatDiameter` is exported.
- The fallback for unmapped values is `Ø ${rawMm}` — no error thrown, no null returned.
- `wheelsData.js` is not modified.
- The function is a pure function with no side effects.

## Dependencies
None.

## Validation criteria
- [ ] `formatDiameter(700)` returns `"Ø 700C"`.
- [ ] `formatDiameter(650)` returns `"Ø 650B"`.
- [ ] `formatDiameter(584)` returns `"Ø 584"` (fallback — no crash).
- [ ] `formatDiameter` is exported and importable from `wheelProperties.jsx`.
- [ ] `wheelsData.js` is unchanged (no `Ø` in diameter fields).

## Tests to implement
### Unit
- Test `formatDiameter(700)` → `"Ø 700C"`.
- Test `formatDiameter(650)` → `"Ø 650B"`.
- Test `formatDiameter(584)` → `"Ø 584"` (unmapped value fallback).
- Test `formatDiameter(0)` → `"Ø 0"` (edge: zero).

### Integration
- None at this stage (covered by TASK-004 and TASK-005 tests).

---

# TASK-004 — Add `renderCell` override for `diameter` in `wheelProperties.jsx`

## Objective
Override the `column.renderCell` function on the `diameter` entry in `WHEEL_PROPERTIES` to display `Ø [ISO label]` using `formatDiameter`. This makes the `ComparisonTable` diameter column display the correctly formatted value automatically, with no change to `ComparisonTable.jsx`.

## Required context
- `frontend/src/config/wheelProperties.jsx` — the `diameter` entry (lines 133–144):
  ```js
  {
    id: 'diameter',
    label: 'Diameter',
    group: 'general',
    unit: ' mm',
    accessor: (w) => w.diameter_mm,
    filter: { type: 'multiSelect' },
    column: {
      defaultVisible: false,
      headClassName: 'px-4 py-3 font-semibold text-right',
      cellClassName: 'px-4 py-3 text-ink-11 text-right tabular-nums',
    },
  }
  ```
- `frontend/src/components/MiniComparator/ComparisonTable.jsx` — `renderCellFor` (lines 9–11):
  ```js
  const renderCellFor = (property) =>
    property.column?.renderCell ??
    ((w) => `${property.accessor(w)}${property.unit ?? ''}`);
  ```
  When `renderCell` is defined, `ComparisonTable` uses it directly — no fallback to `accessor + unit`.
- `formatDiameter` is exported from `wheelProperties.jsx` (TASK-003).
- `unit: ' mm'` on the `diameter` entry is currently unused by `renderCell` once overridden — it can be removed or left in place. Removing it is cleaner (see constraints).

## Potentially impacted files
- `frontend/src/config/wheelProperties.jsx`

## Inputs
- Output of TASK-003: `formatDiameter` helper available in the same file
- Current `diameter` entry in `WHEEL_PROPERTIES`

## Expected outputs
The `diameter` entry in `WHEEL_PROPERTIES` is updated to:

```js
{
  id: 'diameter',
  label: 'Diameter',
  group: 'general',
  accessor: (w) => w.diameter_mm,
  filter: { type: 'multiSelect' },
  column: {
    defaultVisible: false,
    headClassName: 'px-4 py-3 font-semibold text-right',
    cellClassName: 'px-4 py-3 text-ink-11 text-right tabular-nums',
    renderCell: (w) => formatDiameter(w.diameter_mm),
  },
},
```

Note: `unit: ' mm'` is removed because it is superseded by `renderCell`. The `accessor` remains for filter/sort usage (the filter operates on the raw numeric value, not the display string).

## Constraints
- Only the `diameter` entry is modified — no other entry in `WHEEL_PROPERTIES` is touched.
- `accessor` is preserved unchanged — it is used by the filter system (`filtersSlice`, `wheelsSelectors`).
- `unit: ' mm'` is removed to avoid confusion (it is no longer used for rendering).
- No change to `ComparisonTable.jsx`.
- No change to `wheelsData.js`.
- Other columns (depth, rimWidth, weight) must not receive a `renderCell` override — FR-008.

## Dependencies
TASK-003

## Validation criteria
- [ ] `diameter` entry has `column.renderCell` defined.
- [ ] `column.renderCell(w)` where `w.diameter_mm = 700` returns `"Ø 700C"`.
- [ ] `unit` property is removed from the `diameter` entry.
- [ ] `accessor` on the `diameter` entry still returns `w.diameter_mm` (raw numeric).
- [ ] No other `WHEEL_PROPERTIES` entry is modified.
- [ ] `depth`, `rimWidth`, `weight` columns continue to render without `Ø` prefix.

## Tests to implement
### Unit
- Render test on `ComparisonTable` diameter cell: given a wheel with `diameter_mm: 700`, the rendered cell text is `"Ø 700C"`.
- Confirm `depth` cell renders as `"33 mm"` — no `Ø` prefix.
- Confirm `rimWidth` cell renders as `"25.5 mm"` — no `Ø` prefix.

### Integration
- Manual AC-005: Enable Diameter column in comparator. Confirm cells show `Ø 700C`. Confirm no other column shows `Ø`.
- Manual AC-007: Inspect rim depth column — values render as `[n] mm`.
- Manual AC-008: `font-mono tabular-nums` styling on weight, price, depth unchanged.
- Manual AC-010: Inspect `wheelsData.js` — no `Ø` in any `diameter_mm` field.

---

# TASK-005 — Add diameter display to `WheelDetailPanel`

## Objective
Add a diameter display row to `WheelDetailPanel` that shows `Ø [ISO label]` using `formatDiameter`. This satisfies UC-005 and AC-006: the detail panel must show the formatted diameter value.

## Required context
- `frontend/src/components/MiniComparator/WheelDetailPanel.jsx` — current content. The panel currently renders only affiliate links (manufacturer + retailers). It does not display any raw wheel specs (diameter, depth, weight).
- The `wheel` prop passed to `WheelDetailPanel` has the full wheel object, including `wheel.diameter_mm`.
- `formatDiameter` is exported from `frontend/src/config/wheelProperties.jsx` (TASK-003).
- The panel layout is a flex row: `<div className="flex items-center gap-5 px-5 py-3 bg-paper-2/60 border-t border-ink-3">`. A small spec strip is added above the affiliate links section.
- The diameter row must display the label and value in the panel's existing typographic style:
  - Label: `text-xs font-medium uppercase tracking-widest text-ink-6` (matches existing "Manufacturer" and "Where to buy" labels in the panel).
  - Value: `text-sm font-mono tabular-nums text-ink-11`.
- Rim depth must not receive a `Ø` prefix if it is also displayed (FR-008). However, rim depth is not currently in the panel — do not add it in this task.

## Potentially impacted files
- `frontend/src/components/MiniComparator/WheelDetailPanel.jsx`
- `frontend/src/config/wheelProperties.jsx` (import only)

## Inputs
- Current `WheelDetailPanel.jsx`
- TASK-003 output: `formatDiameter` exportable from `wheelProperties.jsx`
- `wheel.diameter_mm` from the wheel data object

## Expected outputs
1. Add import at the top of `WheelDetailPanel.jsx`:
   ```js
   import { formatDiameter } from '../../config/wheelProperties';
   ```

2. Add a diameter spec row inside the panel, before the affiliate links section. The row renders as a labeled key/value pair:
   ```jsx
   <div className="mb-2">
     <p className="text-xs font-medium uppercase tracking-widest text-ink-6 mb-0.5">
       Diameter
     </p>
     <p className="text-sm font-mono tabular-nums text-ink-11">
       {formatDiameter(wheel.diameter_mm)}
     </p>
   </div>
   ```

The placement is at the top of the scrollable content area (`<div className="flex-1 flex flex-col gap-2 overflow-y-auto max-h-[140px] py-0.5">`), before the `hasNoLinks` conditional block.

## Constraints
- Only `diameter_mm` is shown — no other raw spec (depth, weight, etc.) is added to the panel in this task.
- The `Ø` prefix comes from `formatDiameter`, not from hardcoding `Ø` in JSX.
- If `wheel.diameter_mm` is undefined or null, `formatDiameter` must not crash — the fallback in TASK-003 covers this (`Ø undefined` would be ugly; add a guard: render only if `wheel.diameter_mm != null`).
- Do not modify the affiliate link rendering logic.

## Dependencies
TASK-003

## Validation criteria
- [ ] `WheelDetailPanel` imports `formatDiameter` from `wheelProperties.jsx`.
- [ ] Opening the detail panel for a 700 mm wheel shows `Ø 700C` for the Diameter field.
- [ ] The diameter field is labeled "Diameter" in the panel's micro-label style.
- [ ] Rim depth is not displayed in the panel (not added in this task).
- [ ] Affiliate link section is unchanged.
- [ ] If `wheel.diameter_mm` is null/undefined, no error is thrown and the diameter row is either hidden or gracefully absent.

## Tests to implement
### Unit
- Render test: given `{ diameter_mm: 700, ... }`, the panel contains text `"Ø 700C"`.
- Render test: the panel does not contain text starting with `Ø` for rim depth.

### Integration
- Manual AC-006: Open WheelDetailPanel for any wheel. Diameter shows `Ø 700C`. Rim depth is absent from the panel (not present yet — confirmed correct).
- Manual AC-007: Confirm no `Ø` prefix appears on rim depth if it were to be added in a future task.

---

## 6. Global Validation Strategy

### Unit validation
- `formatDiameter`: 4 unit tests covering `700`, `650`, unmapped value, and zero (TASK-003).
- `diameter` `renderCell` in registry: 1 unit test confirming `"Ø 700C"` output (TASK-004).
- `ComparisonTable` diameter cell: 1 render test (TASK-004).
- `WheelDetailPanel` diameter row: 2 render tests (TASK-005).

### Integration validation
- Manual: open the landing page locally, inspect Hero grid at 3 viewports (TASK-002).
- Manual: scroll through all sections to confirm grid containment (TASK-002).
- Manual: enable Diameter column, confirm all cells show `Ø [value]` (TASK-004).
- Manual: open WheelDetailPanel, confirm diameter row (TASK-005).

### Functional validation
- AC-001 through AC-010 from `prd.md` — all manual, as specified.

### Non-regression validation
- `font-mono tabular-nums` on weight, price, depth, rimWidth columns: visually unchanged (AC-008).
- Hero CTA labels: identical to pre-EVO-015 (FR-006).
- `wheelsData.js` contains no `Ø` character (AC-010).
- Lighthouse CLS on Hero: equal to or better than pre-EVO-015 baseline (AC-009).

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|---|---|---|
| `--ink-2` not defined if EVO-007 is not merged first | Grid is invisible (transparent lines) — no layout impact | FR-003 / AD-001 design: `var(--ink-2)` with no hex fallback; tested explicitly in TASK-001 validation |
| `diameter_mm` values outside the lookup map (future diameters) | Display shows `Ø [raw mm]` — no ISO suffix | AD-004 fallback behavior; update `DIAMETER_LABEL_MAP` when new values are added to dataset |
| `WheelDetailPanel` `diameter_mm` null/undefined for a malformed data entry | Could render `Ø undefined` | TASK-005 constraint: guard `wheel.diameter_mm != null` before rendering the row |
| Hero `overflow-hidden` removed in a future refactor | Grid bleeds into next section | Document that `overflow-hidden` is required for the grid containment in code comment |

---

## 8. Rollback Plan

Each task touches a distinct file and is independently revertable:

- **TASK-001 + TASK-002 (Hero grid)**: Remove `.hero-grid-bg` class from `Hero.jsx` and delete the class from `index.css`. No other files affected.
- **TASK-003 + TASK-004 (diameter registry)**: Remove `formatDiameter` export and the `renderCell` override from `wheelProperties.jsx`. Restore `unit: ' mm'` to the `diameter` entry. `ComparisonTable` immediately falls back to the previous default rendering.
- **TASK-005 (WheelDetailPanel)**: Remove the diameter row and the `formatDiameter` import from `WheelDetailPanel.jsx`.

None of the changes touches `wheelsData.js`, Redux slices, or routing — full rollback requires reverting at most 3 files.
