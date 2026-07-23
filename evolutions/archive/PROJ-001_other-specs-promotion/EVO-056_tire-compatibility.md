# Light EVO: Tire compatibility promotion

- **ID:** EVO-056
- **Date:** 2026-06-09
- **Status:** Done
- **Priority:** High

---

## Context & Need

PROJ-001 promotes recurring `other_specs` keys into canonical schema fields. Tire compatibility is currently split between `rim.tubeless_ready` and free-form source keys such as `tire_type`, `tire_compatibility`, and `compatible_tire_type`, which keeps tire format filtering less expressive than the catalog data allows. This child promotes tire compatibility into `rim.tire_compatibility`, derives tubeless readiness from that set, and replaces the old tubeless-only filter/column with a comparable tire compatibility axis.

---

## Scope

### Included

- Add `rim.tire_compatibility` as a canonical array of tire type keys.
- Consume `other_specs.tire_type`, `other_specs.tire_compatibility`, and `other_specs.compatible_tire_type` during migration.
- Derive `rim.tubeless_ready` from `rim.tire_compatibility` instead of maintaining it as the primary filter field.
- Replace the comparator's `tubelessReady` property with a `tireCompatibility` `multiSelectFlat` filter and column.
- Update validation, i18n, tests, scraping schema, scraping prompt, and scraping workflow documentation.

### Excluded

- No tire width range promotion; `min_tire_width_mm`, `max_tire_width_mm`, ETRTO, and width-range text remain for EVO-058.
- No change to `rim.hookless` behavior.
- No inference from rim width, hookless state, tire pressure, or product category when no compatibility source exists.
- No UI redesign beyond replacing the filter/column axis.

---

## Acceptance Criteria

- [x] Catalog entries expose `rim.tire_compatibility` as an array containing only canonical tire type keys.
- [x] `rim.tubeless_ready` remains available on migrated entries and is consistent with whether `rim.tire_compatibility` contains `tubeless`.
- [x] `other_specs.tire_type`, `other_specs.tire_compatibility`, and `other_specs.compatible_tire_type` are removed from all brand data modules.
- [x] The comparator offers a `Tire compatibility` / `Compatibilite pneus` multi-select filter and column instead of the previous tubeless-ready tri-state axis.
- [x] Filtering uses set containment semantics: a wheel matches when its compatibility set contains at least one selected tire type.
- [x] Scraping documentation and `wheel-format.json` describe the canonical field and consumed source keys.
- [x] Baseline and regression Vitest summary runs are recorded.

---

## Functional Decisions

- `rim.tire_compatibility` is an array of canonical keys: `clincher`, `tubeless`, and `tubular`.
- The old `rim.tubeless_ready` field remains as a derived compatibility convenience field for now; it is `true` when the set contains `tubeless`, `false` when the set is known and lacks `tubeless`, and `null` when the set is unknown.
- Known source strings such as `clincher/tubeless`, `tubeless ready (tubes also possible)`, `Tubeless Tire`, and `tubular` map to the canonical keys.
- Tire width information embedded in compatibility text is not parsed in this EVO and must not be kept under the consumed source keys after migration.
- Width-only tire information remains outside `rim.tire_compatibility` and is preserved under width-oriented keys for EVO-058.

---

## Technical Tasks

### Task 1: Extend the codemod for tire compatibility

**Files:** `scripts/codemods/other-specs-promote.mjs`, `scripts/codemods/README.md`

**What to do:** Add a `tire-compatibility` concept that reads `other_specs.tire_type`, `other_specs.tire_compatibility`, and `other_specs.compatible_tire_type`, extracts canonical tire type keys, writes/merges `rim.tire_compatibility`, derives `rim.tubeless_ready`, and removes only source keys that yielded canonical compatibility data.

**Validation:** Dry-run reports changed data modules; write mode leaves no consumed parseable source keys in data.

### Task 2: Migrate and validate catalog data

**Files:** `frontend/src/data/wheelsData_*.js`, `frontend/src/data/wheelValidator.js`, `frontend/src/data/__tests__/wheelValidator.test.js`

**What to do:** Run the codemod, add validator coverage that forbids promoted tire compatibility source keys when they remain parseable, and verify the full catalog has consistent `rim.tire_compatibility` / `rim.tubeless_ready` values.

**Validation:** Catalog integration and validator tests pass; grep confirms consumed source keys are gone or intentionally unparseable.

### Task 3: Replace the comparator property axis

**Files:** `frontend/src/config/wheelProperties.jsx`, `frontend/src/config/__tests__/*.test.*`, `frontend/src/store/selectors/__tests__/wheelsSelectors.test.js`, `frontend/src/store/slices/__tests__/filtersSlice.test.js`, `frontend/src/components/MiniComparator/__tests__/*.test.*`, `frontend/src/i18n/*.json`

**What to do:** Replace the `tubelessReady` tri-state property with `tireCompatibility`, use `multiSelectFlat`, render translated tire type values in the column, and update affected tests and translation coverage.

**Validation:** Filter initialization, selector behavior, i18n coverage, and comparator rendering tests cover the new property.

### Task 4: Update schema and scraping documentation

**Files:** `../workflows/datascraping/wheel-format.json`, `scripts/DatascrapingPrompt.md`, `../workflows/datascraping/README.md`

**What to do:** Document `rim.tire_compatibility`, the canonical tire type keys, source-key normalization, and the derived `rim.tubeless_ready` rule.

**Validation:** Future scraping instructions no longer direct tire compatibility into `other_specs`.

### Task 5: Record results and close the EVO

**Files:** `evolutions/README.md`, `evolutions/PROJ-001_other-specs-promotion/project.md`, `evolutions/PROJ-001_other-specs-promotion/EVO-056_tire-compatibility.md`

**What to do:** Record baseline/regression results and mark EVO-056 done after validation.

**Validation:** Statuses are synchronized in both evolution indexes and this document.

---

## Test Summary

### Baseline Vitest

- Command: `npm.cmd run test:summary` from `frontend/`
- Result: Passed, exit code 0
- Failed tests: None
- Notes: Vitest summary reported 24 passed files and 298 passed tests in 4.85s.

### Regression Vitest

- Command: `npm.cmd run test:summary` from `frontend/`
- Result: Passed, exit code 0
- Failed tests: None
- Notes: Vitest summary reported 24 passed files and 305 passed tests in 4.78s.

---

## Implementation Notes

### Task 1

- Added the `tire-compatibility` codemod concept.
- The codemod consumes `tire_type`, `tire_compatibility`, and `compatible_tire_type`, writes `rim.tire_compatibility`, and derives `rim.tubeless_ready`.
- Second dry-run after migration scanned 19 data files and reported 0 changes.

### Task 2

- Migrated all 19 brand data modules.
- Adjusted helper-based data modules so canonical tire compatibility is generated by helpers instead of leaking through `other_specs`.
- Added validator coverage for forbidden source keys, allowed tire type keys, and `tubeless_ready` derivation.

### Task 3

- Replaced `tubelessReady` with `tireCompatibility` in the wheel property registry.
- Added translated tire compatibility labels and a dedicated column renderer for tire type arrays.
- Added selector, accessor, group, i18n, and validator tests for the new axis.

### Task 4

- Updated `workflows/datascraping/wheel-format.json`.
- Updated `scripts/DatascrapingPrompt.md`.
- Updated `workflows/datascraping/README.md`.
- Updated product documentation and domain vocabulary for the user-facing filter change.

### Task 5

- Marked EVO-056 `Done` after regression tests passed.
