# Needs Assessment

## 1. General Information

- **Evolution ID:** EVO-003
- **Title:** Design System Migration — Notebook Direction
- **Author:** Flavien Drouot
- **Date:** 2026-05-26
- **Status:** Draft
- **Priority:** High — brand identity overhaul, directly affects user-facing product

---

## 2. Context

### Current situation

The app currently uses a generic Tailwind CSS blue palette (`brand-*` / `ink-*` slate scale) with white backgrounds, rounded corners, and box shadows — a standard SaaS aesthetic. As of EVO-002, all design values are centralized as named tokens in `tailwind.config.js` with no arbitrary values in `src/`.

A full design system has been produced in `MyBikeLab/design-system/` defining a new visual identity: warm paper backgrounds, deep ink, brass accent, tabular mono numerals, and hairline borders. Three visual directions were evaluated (Notebook, Blueprint, Instrument).

### Identified problem

The current visual identity does not reflect MyBikeLab's positioning as a neutral, precision data platform ("Wirecutter meets DPReview"). The generic blue-on-white SaaS look undercuts credibility with a technically-oriented cycling audience who expects a more considered, editorial aesthetic.

### Business motivation

MyBikeLab uses its landing page as a B2B credibility tool for outreach to manufacturers and retailers, in addition to reaching end users. A premium-minimal aesthetic aligned with the "lab instrument × editorial" direction signals precision and seriousness — differentiating the product from generic comparison aggregators.

---

## 3. Business Objective

Apply the **Notebook direction** of the MyBikeLab design system to the entire frontend, replacing the current generic SaaS aesthetic with a deliberate premium-minimal visual identity: warm paper, deep ink, brass accent, hairline borders, tabular numerals.

The full landing page — all 7 sections — must reflect the new system after migration. The visual design system spec in `MyBikeLab/design-system/` becomes the authoritative reference for all future component development.

---

## 4. Scope

### Included

- All **color** values: replace `brand-*` (blue) and `ink-*` (slate) with the new `paper-*`, `ink-*` (redesigned warm neutral), `brass-*`, and `sage-*` scales, as defined in `MyBikeLab/design-system/colors_and_type.css`
- All **typography** values: add JetBrains Mono as the monospace font for all numeric values; preserve Inter as the universal text font; align weights, sizes, and tracking with design system specs
- All **spacing** values: align spacing scale with the design system's 4px base grid
- All **border and radius** values: migrate rounded corners (`rounded-*`) to square surfaces (`radius: 0`) for cards and panels; `2px` for inputs and buttons; `999px` for pill badges only
- All **first-party components** across all 7 landing page sections: Navbar, Hero, MiniComparator (FilterPanel, ComparisonTable, ColumnSelector, badges), Roadmap, Benefits, Partnership, Footer
- `src/index.css` shared utility classes
- `tailwind.config.js` token definitions — the primary output of the migration

### Excluded

- Component logic, layout structure, and user-facing behavior — no functional changes
- Icon library replacement: existing inline SVGs are retained; `stroke-width` may be adjusted to match the design system's `1.4` spec
- The wheel dataset (`src/data/wheelsData.js`) and the property registry (`src/config/wheelProperties.jsx`) — no data changes
- Redux state, selectors, and filter logic — no functional changes
- `node_modules/`, auto-generated files, and third-party code
- Enforcement mechanism for future token compliance (linting rules, CI checks)
- Blueprint and Instrument directions — not implemented in this evolution

---

## 5. Constraints

### Business constraints

- The Wheel Comparator must remain fully functional (filtering, sorting, column visibility) after migration.
- The landing page must render correctly on both desktop and mobile viewports after migration.
- Tailwind CSS must not be replaced or removed.
- The `MyBikeLab/design-system/` spec — specifically the Notebook direction — is the authoritative visual reference. Deviations must be explicitly justified.
- The token architecture established by EVO-002 remains the authoritative standard: no new arbitrary color, typography, or spacing values may be introduced.

### Known technical constraints

- All new design tokens (paper, ink redesigned, brass, sage) must be defined in `tailwind.config.js` under `theme.extend` — not in raw CSS variables — to maintain consistency with EVO-002's convention (Option A: Tailwind as single source of truth).
- JetBrains Mono must be loaded via Google Fonts CDN (as in the design system) and registered as a named font token in `tailwind.config.js`.
- The app may be in a visually inconsistent state during migration — no intermediate deployability constraint. A single final merge to production is acceptable.
- The accepted exceptions from EVO-002 remain in force: `lg:grid-cols-[320px_1fr]`, `max-w-[85vw]`, and `max-w-[calc(100vw-1rem)]` in `MiniComparator.jsx` and `ColumnSelector.jsx` are layout values, not design values — they are not in scope.
- The Hero section uses a plain `paper-1` background — the schematic grid decoration is out of scope for the MVP.
- The hex values in `FilterPanel.module.css` (previously an accepted exception from EVO-002) must be updated to match the new design system palette.

### Regulatory / security constraints

- None.

---

## 6. Use Cases

### Nominal case

As a technically-curious road cyclist visiting MyBikeLab,
I want to land on a page that feels precise, considered, and data-driven,
So that I trust the platform's data and engage with the wheel comparator.

### Alternative cases

- A manufacturer or retailer visiting the landing page as a potential partner perceives the product as credible and professional, consistent with the outreach pitch.
- A developer (or AI assistant) building a new component consults `tailwind.config.js` and applies named tokens from the new palette without needing to reference the design system files directly.

### Known error cases

- A component retains a legacy `brand-*` (blue) class after migration → the page renders with inconsistent colors → non-conformant, must be resolved before the final merge.
- A new token is needed for a component but is missing from `tailwind.config.js` → the developer must add it to the config rather than using an arbitrary value.

---

## 7. Acceptance Criteria

- [ ] All `brand-*` color tokens (blue palette) are replaced by the new design system tokens (`paper-*`, `ink-*` redesigned, `brass-*`, `sage-*`) across all first-party components.
- [ ] All `bg-white` occurrences in first-party components are replaced by `bg-paper-0` or `bg-paper-1` as appropriate.
- [ ] All rounded corners on cards, panels, and the comparator table are removed (`rounded-none` or equivalent). Inputs and buttons use `rounded-xs` (2px). Badges use `rounded-full`.
- [ ] JetBrains Mono is loaded and applied to all numeric values in the comparator table (weight, price, rim depth, rim width) via a named Tailwind token.
- [ ] The primary CTA button uses brass (`brass-7` / `brass-8`) as its fill color, not blue.
- [ ] Focus rings use brass (`brass-8`) rather than blue across all interactive elements.
- [ ] Card borders use `1px solid ink-4`, with no drop shadows on cards or panels.
- [ ] The Hero section matches the Notebook direction: Inter 800 display, generous whitespace, centered layout, brass accent on key stats.
- [ ] All 7 sections render correctly in the Notebook visual direction with no visual regressions from legacy blue or white values.
- [ ] The Wheel Comparator (FilterPanel, ComparisonTable, ColumnSelector) remains fully functional: filtering, sorting, and column visibility work as before.
- [ ] The landing page renders correctly on desktop (≥ 1024px) and mobile (< 768px) viewports.
- [ ] No arbitrary color, typography, or spacing values are introduced in the process (`[...]` Tailwind syntax for design values remains absent from `src/`).
- [ ] `tailwind.config.js` contains all new token definitions under `theme.extend`, documented with the naming convention established in EVO-002.

---

## 8. Open Questions

None.

---

## 9. Assumptions

- The Notebook direction is the sole direction implemented in this evolution. The Blueprint and Instrument directions are documented in the design system for future use.
- `MyBikeLab/design-system/colors_and_type.css` is the authoritative hex value source. All token values in `tailwind.config.js` are derived from this file.
- `MyBikeLab/design-system/ui_kits/` components serve as visual reference only — they are not directly transplanted into the React codebase.
- Inter is already loaded from Google Fonts in the existing app. Only JetBrains Mono needs to be added.
- EVO-002 is considered validated and its token convention document (`EVO-002_design-token-refactoring/token-convention.md`) remains the authoritative naming reference, extended by this evolution.
