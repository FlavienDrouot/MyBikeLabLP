# Light EVO: Tire width promotion

- **ID:** EVO-058
- **Date:** 2026-06-09
- **Status:** Done
- **Priority:** High

---

## Context & Need

PROJ-001 promotes recurring `other_specs` keys into canonical schema fields. Tire width guidance is currently fragmented across direct min/max fields, text ranges, ETRTO-style markings, and recommendation notes, which keeps useful tire-fit constraints out of comparator filtering and display. This child promotes tire width into `rim.tire_width_mm`, while preserving ambiguous source values for manual review instead of turning uncertain text into false numeric data.

---

## Scope

### Included

- Add `rim.tire_width_mm` as a canonical object with `min` and `max` numeric millimeter values.
- Consume parseable `other_specs` tire-width source keys, including direct min/max fields, text ranges, recommended tire size fields, optimized tire width fields, and ETRTO-derived values.
- Parse simple numeric ranges such as `24-38`, `24 to 38 mm`, and comparable notation into `{ min, max }`.
- Parse ETRTO-style tire-width values when they contain an explicit tire width in millimeters.
- Expose tire width as a range-filterable and sortable rim property through `wheelProperties.jsx`.
- Update validation, i18n, tests, scraping schema, scraping prompt, and scraping workflow documentation.

### Excluded

- No inference from rim internal width alone when no explicit tire-width recommendation or ETRTO value is present.
- No promotion of tire pressure, tire compatibility, or hookless safety rules in this EVO.
- No attempt to model different tire-width recommendations by tire brand, casing, pressure, or use case.
- No UI redesign beyond adding the new rim tire-width property axis.
- No silent removal of ambiguous source values that cannot be parsed confidently.

---

## Acceptance Criteria

- [x] Catalog entries may expose `rim.tire_width_mm` as `{ min, max }`, where each value is a number in millimeters or `null`.
- [x] Parseable tire-width source keys are removed from `other_specs` after migration.
- [x] Ambiguous or unparseable source values are preserved in `other_specs` for manual review instead of being silently discarded.
- [x] The comparator offers tire width as a range-filterable rim property and can sort by tire-width values.
- [x] Displayed tire-width values communicate ranges clearly and show `N/A` when neither bound is available.
- [x] Scraping documentation and `wheel-format.json` describe `rim.tire_width_mm`, accepted min/max semantics, ETRTO parsing expectations, and legacy source-key normalization.
- [x] Baseline and regression Vitest summary runs are recorded.

---

## Functional Decisions

- `rim.tire_width_mm` is the canonical shape: `{ min: number | null, max: number | null }`.
- `min` and `max` represent tire width in millimeters, not rim width.
- A single explicit tire-width value may populate both `min` and `max` only when the source clearly describes one fixed recommended size.
- Numeric min/max source fields have priority over parsed free text when both are present.
- ETRTO parsing is allowed only when the source value clearly contains an explicit tire-width component; otherwise the value remains in `other_specs`.
- No tire width is inferred from rim internal width or external width alone.

---

## Technical Tasks

### Task 1: Extend the codemod for tire width

**Files:** `scripts/codemods/other-specs-promote.mjs`, `scripts/codemods/README.md`

**What to do:** Add a `tire-width-mm` concept that reads tire-width-related `other_specs` keys, parses direct numeric fields, text ranges, and supported ETRTO notation, writes or merges `rim.tire_width_mm`, and removes only source keys whose values were successfully consumed.

**Validation:** Dry-run reports changed data modules; write mode leaves no parseable consumed source keys in data.

### Task 2: Migrate and validate catalog data

**Files:** `frontend/src/data/wheelsData_*.js`, `frontend/src/data/wheelValidator.js`, `frontend/src/data/__tests__/wheelValidator.test.js`

**What to do:** Run the codemod in write mode, add validator coverage for promoted tire-width source keys, and verify migrated entries use the canonical `rim.tire_width_mm` shape.

**Validation:** Catalog integration and validator tests pass; grep confirms parseable tire-width source keys are gone or intentionally preserved as unparseable review notes.

### Task 3: Add comparator property

**Files:** `frontend/src/config/wheelProperties.jsx`, `frontend/src/config/__tests__/*.test.*`, `frontend/src/store/selectors/__tests__/wheelsSelectors.test.js`, `frontend/src/store/slices/__tests__/filtersSlice.test.js`, `frontend/src/components/MiniComparator/__tests__/*.test.*`, `frontend/src/i18n/*.json`

**What to do:** Add tire width as a rim-group registry property using a range filter and numeric sorts. Render `{ min, max }` as a readable millimeter range and handle one-sided or missing values consistently with existing rim measurement fields.

**Validation:** Filter initialization, selector behavior, i18n coverage, sorting, and comparator rendering tests cover the new property.

### Task 4: Update schema and scraping documentation

**Files:** `../workflows/datascraping/wheel-format.json`, `scripts/DatascrapingPrompt.md`, `../workflows/datascraping/README.md`

**What to do:** Document `rim.tire_width_mm`, min/max semantics, accepted source normalizations, and the rule that uncertain tire-width text stays in `other_specs` for review.

**Validation:** Future scraping instructions no longer direct parseable tire-width data into `other_specs`.

### Task 5: Record results and close the EVO

**Files:** `evolutions/README.md`, `evolutions/PROJ-001_other-specs-promotion/project.md`, `evolutions/PROJ-001_other-specs-promotion/EVO-058_tire-width-mm.md`

**What to do:** Record baseline/regression results and mark EVO-058 done after validation.

**Validation:** Statuses are synchronized in both evolution indexes and this document.

---

## Test Summary

### Baseline Vitest

- Command:
- `npm.cmd run test:summary`
- Result: Passed — 24 files passed, 312 tests passed, 0 failed, exit code 0, duration 4.55s.
- Failed tests: None.
- Notes: Baseline taken before EVO-058 implementation.

### Regression Vitest

- Command:
- `npm.cmd run test:summary`
- Result: Passed — 24 files passed, 323 tests passed, 0 failed, exit code 0, duration 4.60s.
- Failed tests: None.
- Notes: Regression includes tire-width codemod, data, validator, registry, selector, rendering, i18n, and scraping documentation updates.

---

## Implementation Notes

### Task 1

- Added the `tire-width-mm` concept to `scripts/codemods/other-specs-promote.mjs` and documented the dry-run/write commands.
- The parser consumes direct min/max fields, numeric ranges, C-size ranges, one-sided minimum wording, ETRTO `25-622 - 32-622`, and ETRTO rim notation such as `622x23TC`.

### Task 2

- Ran the codemod in write mode and migrated direct literal entries.
- Manually promoted factory-driven values in GOOSYNN, Magene, NO.6, and Shimano where the source value was passed through variables rather than stored as a literal `other_specs` property.
- Added validator checks for promoted tire-width source keys and invalid `rim.tire_width_mm` bounds.

### Task 3

- Added the `tireWidth` rim property with range filtering, numeric sorting, localized labels, and custom display for closed ranges, fixed widths, one-sided minimums, and missing values.
- Added tests for accessor behavior, interval-overlap filtering, and render output.

### Task 4

- Updated `workflows/datascraping/wheel-format.json`, `scripts/DatascrapingPrompt.md`, and `workflows/datascraping/README.md` with the canonical `rim.tire_width_mm` schema and consumed source labels.

### Task 5

- Recorded baseline/regression results and synchronized EVO-058 status to `Done` in the master evolution index and PROJ-001 child index.
