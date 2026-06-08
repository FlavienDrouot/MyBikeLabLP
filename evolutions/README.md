# evolutions/

Tracks feature evolutions for MyBikeLab, from prototype to implementation.

Each evolution lives in its own folder named `EVO-NNN_slug`. Related evolutions may be grouped under a **Project** (`PROJ-NNN`) — see the Projects table below and `workflows/ai-dev-process/PROJECT.md`.

**Maintenance rule:** This file is the source of truth for all IDs (`PROJ-NNN`, `EVO-NNN`, `fix-NNN`). When a new project, evolution, or fix is created, add its row to the matching table immediately — before writing any other file. The next ID of each kind is the highest of that kind in this file (active + archive) incremented by 1. Evolutions and fixes that belong to a Project still appear in their master tables below, with the Project noted.

## Projects

A Project groups several evolutions sharing one goal and definition of done. Children live in `evolutions/PROJ-NNN_slug/`.

| ID | Slug | Child IDs | Status |
|---|---|---|---|
| PROJ-001 | other-specs-promotion | EVO-047 … EVO-058 | Draft |

## Evolutions

| ID | Slug | Phase | Status | Project |
|---|---|---|---|---|
| EVO-047 | foundation | Light EVO | Done | PROJ-001 |
| EVO-048 | hub-bearing-material | Light EVO | Done | PROJ-001 |
| EVO-049 | spokes-count | Light EVO | Done | PROJ-001 |
| EVO-050 | spokes-detail | Light EVO | Done | PROJ-001 |
| EVO-051 | rim-material-construction | Light EVO | Done | PROJ-001 |
| EVO-052 | rim-max-tire-pressure | Light EVO | Done | PROJ-001 |
| EVO-053 | warranty | Light EVO | Done | PROJ-001 |
| EVO-054 | certification | Light EVO | Done | PROJ-001 |

## Fixes

Small fixes — single condensed document, no subfolder. See `workflows/ai-dev-process/FIX.md`.

| ID | Slug | Status |
|---|---|---|
| fix-001 | hub-spokes-column-max-width | Done |
| fix-002 | rim-width-to-external-width | Done |
| fix-003 | unify-axle-columns | Done |
| fix-004 | multiselect-null-undefined-label | Done |
| fix-005 | canonical-column-order | Done |
| fix-006 | minprice-null-coercion | Done |
| fix-007 | skip-measurement-max-w-columns | Done |
| fix-008 | column-widths-on-language-change | Done |
| fix-009 | sticky-thead-chrome | Done |
| fix-010 | column-selector-popup-overflow | Done |
| fix-011 | mobile-language-toggle-duplicate | Done |
| fix-012 | vitest-summary-script | Done |
| fix-013 | review-2026-06-03-followups | Done |
| fix-014 | arcaris-brand-filter-duplicates | Done |
| fix-015 | unique-wheel-ids-test | Done |
| fix-016 | normalize-spoke-steel-material | Done |
| fix-017 | single-open-filter-group | Done |
| fix-018 | active-filter-chips-wrap | Done |
| fix-019 | column-header-sort | Done |
| fix-020 | filter-panel-double-separator | Done |
| fix-021 | crwworks-image-mojibake | Done |

## Archive

Completed and abandoned evolutions move to `evolutions/archive/`.

| ID | Slug |
|---|---|
| EVO-001 | dynamic-filter-ranges-and-counts |
| EVO-002 | design-token-refactoring |
| EVO-003 | design-system-migration |
| EVO-004 | prototype-affiliate-links |
| EVO-005 | fix-legacy-ink-tokens-wheelproperties |
| EVO-006 | hookbadge-design-system |
| EVO-007 | wire-design-tokens-source-of-truth |
| EVO-008 | voice-and-section-indices |
| EVO-009 | typography-display-and-feature-settings |
| EVO-010 | focus-rings-selection-and-shadows-cleanup |
| EVO-011 | radii-and-surface-hierarchy-alignment |
| EVO-012 | lucide-icon-system |
| EVO-013 | sage-palette-decision-and-brand-cleanup |
| EVO-014 | rule-utilities-and-motion-tokens |
| EVO-015 | hero-schematic-grid-and-typographic-glyphs |
| EVO-016 | fonts-loading-optimization |
| EVO-017 | ui-polish-comparator-navbar |
| EVO-018 | copy-typography-compliance |
| EVO-019 | component-structure-compliance |
| EVO-020 | style-tokens-compliance |
| EVO-021 | ui-guidelines-clarification |
| EVO-022 | landing-ui-polish |
| EVO-023 | i18n-fr-en |
| EVO-024 | wheeldetailpanel-visual-polish |
| EVO-029 | content-voice-audit |
| EVO-025 | comparator-viewport-bounded-height |
| EVO-026 | comparator-controls-in-table-header |
| EVO-027 | wheel-specs-data-collection |
| EVO-028 | wheeldetailpanel-layout-breakpoint |
| EVO-030 | comparator-filter-layout-stability |
| EVO-031 | wheel-properties-i18n-flag |
| EVO-032 | wheel-images-fix-and-data-consolidation |
| EVO-033 | other-specs-registry-extension |
| EVO-035 | missing-i18n-comparator-keys |
| EVO-036 | freehub-column-label-and-overflow-popup |
| EVO-037 | freehub-options-standardization |
| EVO-038 | front-rear-divergent-specs |
| EVO-039 | design-system-foundation-tokens |
| EVO-040 | design-system-navbar-footer |
| EVO-041 | design-system-landing-sections |
| EVO-042 | design-system-minicomparator |
| EVO-043 | design-system-wheeldetailpanel |
| EVO-044 | product-variants-catalog-model |
| EVO-045 | variant-field-per-row |
| EVO-046 | currency-management |
