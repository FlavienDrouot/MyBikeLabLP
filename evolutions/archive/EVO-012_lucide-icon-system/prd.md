# PRD — Product Requirements Document

## 1. General Information

- **Evolution ID:** EVO-012
- **Title:** Lucide as the canonical icon system
- **Author:** Flavien Drouot
- **Date:** 2026-05-27
- **Version:** 1.0
- **Needs Assessment reference:** `EVO-012_lucide-icon-system/needs-assessment.md`

---

## 2. Functional Objective

After this evolution, every UI icon in the frontend is served by a single shared icon system. All icons conform to the same visual conventions: consistent stroke weight, cap, join, and color inheritance. Changing any icon convention in the future requires editing one place.

---

## 3. Target Behavior

### General description

The frontend declares a single icon library as its source of UI icons. A shared icon convention (or wrapper) encapsulates the Design System's stroke defaults and is used uniformly wherever a UI icon appears. No component holds its own ad-hoc inline SVG for a UI icon. Icons pick up their color from the surrounding context automatically.

The affected surfaces are: the Navbar (menu/hamburger trigger), the MiniComparator (close drawer, filter button), the FilterPanel (accordion section chevrons, multi-select checkmark), the ComparisonTable (expand-row chevron, sort indicator), the ColumnSelector (toggle chevron), the ContactForm (success checkmark), and the Footer (any navigational or social icon rendered as a UI icon).

Brand icons that must preserve their own stroke style — such as social network logos — are not governed by this system.

---

## 4. Functional Rules

### FR-001 — Single icon source
All UI icons in `src/components/` must originate from the Lucide React library. No ad-hoc inline `<svg>` may remain for any UI icon after this evolution.

### FR-002 — Enforced DS stroke defaults
All UI icons must render with the following visual properties, enforced at the system level rather than per icon use:
- `stroke-width: 1.4`
- `stroke-linecap: square`
- `stroke-linejoin: miter`
- color: `currentColor` (inherits from the surrounding element)

### FR-003 — One configuration point
The DS stroke defaults must be defined in exactly one place. Any future change to a stroke convention must propagate automatically to all icons without requiring individual updates to each component.

### FR-004 — Size flexibility
An icon's rendered size may be specified at the point of use. Applying a custom size must not override or break the DS stroke defaults.

### FR-005 — Illustrations excluded
SVG files that serve as schematic illustrations (e.g. `assets/wheel-schematic.svg`) must not be altered by this evolution. They are not UI icons and must remain unchanged.

### FR-006 — Brand icons excluded
Icons whose visual identity depends on brand-specific styling (e.g. social network logos) are excluded from the shared system. They must retain their original stroke properties.

### FR-007 — No layout regression
Replacing an inline SVG with its Lucide equivalent must not alter the layout or visual bounding of the surrounding component.

---

## 5. Detailed Use Cases

### UC-001 — Developer adds a new icon to a component

#### Preconditions
- The icon system (FR-001 to FR-003) is in place
- The developer needs to display a UI icon in a component

#### Steps
1. The developer identifies the correct Lucide icon name for the intended visual
2. The developer imports or uses the icon through the shared convention
3. The developer optionally specifies a size at the point of use
4. The developer renders the component in the browser

#### Expected result
- The icon displays with the correct DS stroke defaults (stroke-width 1.4, square cap, miter join)
- The icon inherits its color from the surrounding element
- No per-use DS style configuration is required

#### Error cases
- The developer does not use the shared convention: the icon renders without DS defaults — this must be detectable in review

---

### UC-002 — Icon in a multi-icon component with varying sizes

#### Preconditions
- The icon system is in place
- A single component uses two or more icons at different sizes (e.g. a small sort indicator and a larger chevron in ComparisonTable)

#### Steps
1. Each icon is rendered using the shared convention with its respective size
2. The component is displayed in the browser

#### Expected result
- All icons in the component render with identical DS stroke defaults
- Each icon displays at its specified size without visual inconsistency

#### Error cases
- None specific — covered by FR-004

---

### UC-003 — Developer encounters a schematic illustration

#### Preconditions
- The icon system migration is in progress
- The developer is inventorying `src/components/` and `assets/`

#### Steps
1. The developer encounters `assets/wheel-schematic.svg`
2. The developer recognizes it as an illustration, not a UI icon

#### Expected result
- The file is left untouched
- No Lucide replacement is applied

#### Error cases
- The developer mistakenly replaces the illustration — regression in the visual rendering of the schematic

---

## 6. Acceptance Criteria

### AC-001
#### Description
No ad-hoc inline `<svg>` element remains in `src/components/` for any UI icon (hamburger/menu, chevron up/down/right, check, close/X, arrow-right).
#### Expected verification
Codebase search for inline `<svg>` tags in `src/components/` returns no results attributable to UI icons.
#### Type
- Manual

---

### AC-002
#### Description
All UI icons render with `stroke-width="1.4"`, `stroke-linecap="square"`, and `stroke-linejoin="miter"`.
#### Expected verification
Each icon surface listed in the scope (Navbar, MiniComparator, FilterPanel, ComparisonTable, ColumnSelector, ContactForm, Footer) is visually inspected; the rendered SVG attributes match the required values.
#### Type
- Manual

---

### AC-003
#### Description
All UI icons inherit their color from the surrounding element via `currentColor`.
#### Expected verification
Change the text color of a parent element in the browser DevTools; confirm the icon color updates accordingly across affected components.
#### Type
- Manual

---

### AC-004
#### Description
DS stroke defaults are defined in exactly one location in the codebase.
#### Expected verification
Codebase search confirms that `stroke-width: 1.4`, `stroke-linecap: square`, and `stroke-linejoin: miter` appear in exactly one definition point, not repeated per component or per icon use.
#### Type
- Manual

---

### AC-005
#### Description
No layout regression in any affected component after icon replacement.
#### Expected verification
Each affected component (Navbar, MiniComparator, FilterPanel, ComparisonTable, ColumnSelector, ContactForm, Footer) is reviewed side by side before and after the change; no shift in element position, size, or spacing is observed.
#### Type
- Manual

---

### AC-006
#### Description
The `assets/wheel-schematic.svg` and any other schematic illustration remain unmodified.
#### Expected verification
File content and rendering of `assets/wheel-schematic.svg` are identical before and after the evolution.
#### Type
- Manual

---

### AC-007
#### Description
The total bundle size addition from the icon library is below 15 KB (tree-shaken).
#### Expected verification
A production build is generated before and after the evolution; the diff in bundle size attributable to icon assets is below 15 KB.
#### Type
- Manual

---

## 7. Functional Impacts

### Impacted components
- `Navbar` — hamburger/menu icon
- `MiniComparator` — close drawer icon, filter button icon
- `FilterPanel` — accordion section chevrons (up/down), multi-select checkmark
- `ComparisonTable` — expand-row chevron, sort indicator
- `ColumnSelector` — toggle chevron
- `ContactForm` — success checkmark
- `Footer` — any UI icon (social or navigational, excluding brand icons)
- New shared icon convention (wrapper or configuration point) — new artifact to be introduced

### Impacted data
- None

### Impacted APIs
- None

### Impacted permissions / roles
- None

---

## 8. Out of Scope

- `assets/wheel-schematic.svg` and any other schematic or decorative illustration
- Brand icons (social network logos) that require their own stroke style
- Layout or structural changes to any component beyond the icon itself
- Any component not listed in section 3 (Target Behavior)
- Addition of new icons not currently present in the UI

---

## 9. Constraints

- All UI icons must comply with DS Iconography rules: `stroke-width: 1.4`, `stroke-linecap: square`, `stroke-linejoin: miter`, `currentColor`
- The icon library must be consumed as a tree-shaken dependency — CDN delivery is not acceptable
- Bundle size addition from icons must remain below 15 KB (tree-shaken total)
- No layout regression is acceptable in any affected component

---

## 10. Test Plan

### Automated tests expected
- None specified for this evolution — the DS compliance and layout criteria require visual judgment that is not automatable at this stage

### Manual tests expected
- Render each affected component and verify that all icons display with DS stroke defaults (AC-002)
- Verify color inheritance via `currentColor` on each affected surface (AC-003)
- Confirm absence of inline SVGs for UI icons in `src/components/` (AC-001)
- Confirm DS stroke defaults are defined in exactly one place (AC-004)
- Verify `assets/wheel-schematic.svg` is untouched (AC-006)
- Measure bundle size delta and confirm it is below 15 KB (AC-007)

### Edge cases
- Component with multiple icons at different sizes: all must conform to DS defaults regardless of size (AC-002)
- Brand icon on Footer: must not be altered; must retain its original stroke style

### Non-regression
- All affected components must retain their existing layout after icon replacement (AC-005)
- No other component may be affected by the introduction of the shared icon convention
