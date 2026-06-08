# Light EVO: Rim material and construction promotion

- **ID:** EVO-051
- **Date:** 2026-06-08
- **Status:** Done
- **Priority:** High
- **Project:** PROJ-001 `other-specs-promotion`

---

## Context & Need

`PROJ-001` promotes recurring `other_specs` keys into the canonical wheel schema. EVO-051 is the next Rim-group migration after the spoke migrations: it enriches the existing `rim.material` information and promotes technical rim construction details into a new canonical field.

Today, material and construction details are scattered across `other_specs` keys such as `rim_material_name`, `rim_material_detail`, `rim_construction`, `rim_technology`, and `rim_construction_technology`. Keeping them there prevents the comparator, detail panel, and future scraping process from using a stable vocabulary for rim build information.

---

## Scope

### Included

- Enrich the existing canonical `rim.material` value when a source key provides a more specific material name.
- Add `rim.construction` as a canonical schema field for layup, resin, process, welding, laminate, and rim-technology details.
- Add a Rim-group registry entry for rim construction with a multi-select filter and hidden-by-default column.
- Add English and French labels for the new property.
- Migrate all `frontend/src/data/wheelsData_*.js` modules so consumed source keys move from `other_specs` into `rim`.
- Extend the PROJ-001 codemod harness with an EVO-051 `rim-material-construction` concept migration.
- Update `workflows/datascraping/wheel-format.json`, `MyBikeLab/scripts/DatascrapingPrompt.md`, and `workflows/datascraping/README.md` so future scrapes write these values directly into `rim`.

### Excluded

- Do not change the closed, translatable comparator categories for `rim.material` unless the source clearly maps to the existing categories.
- Do not merge construction details into `rim.material`; construction details belong in `rim.construction`.
- Do not promote unrelated rim specs such as max tire pressure, tire width, ETRTO, hookless, tubeless readiness, or rim impact tests.
- Do not infer construction from marketing copy, product images, or undocumented technology names.
- No new wheel scraping.

---

## Acceptance Criteria

- [ ] `rim.construction` is documented in the canonical scraping schema.
- [ ] `wheelProperties.jsx` exposes a Rim-group `rimConstruction` property with a multi-select filter and optional column.
- [ ] English and French locales contain labels for the new property.
- [ ] Existing `rim.material` behavior remains compatible with the current translatable `carbon` / `aluminum` categories.
- [ ] All consumed rim material/construction source keys are migrated into `rim` across every `wheelsData_*.js` module.
- [ ] No migrated wheel keeps the consumed rim material/construction source keys in `other_specs`.
- [ ] The codemod can dry-run and write the `rim-material-construction` migration.
- [ ] The scraping prompt and datascraping README state that source labels for rim material names/details and construction technologies belong in `rim`.
- [ ] Baseline and regression Vitest summary runs are recorded.

---

## Functional Decisions

- `rim.material` remains the filterable, translatable high-level material category already used by the comparator.
- `rim_material_name` may enrich `rim.material` only when it preserves the existing category contract or can be normalized to an existing category without losing correctness.
- `rim_material_detail`, `rim_construction`, `rim_technology`, and `rim_construction_technology` map to `rim.construction`.
- `rim.construction` is a free text value because construction details include brand-specific layups, resin systems, welding processes, laminate names, and technology labels.
- When multiple consumed source keys provide construction-like values for the same wheel, preserve the source information by joining distinct non-empty values with `; ` in source order.
- Empty strings are normalized to `null`.
- Registry property ID is `rimConstruction`.
- The source keys consumed by this EVO are exactly `rim_material_name`, `rim_material_detail`, `rim_construction`, `rim_technology`, and `rim_construction_technology`.
- Implementation should account for the worktree boundary: product files live in `MyBikeLab-EVO-051`, while workspace-level datascraping files still live outside the product worktree.

---

## Technical Tasks

### Task 1: Extend the rim schema and scraping docs

**Files:** `workflows/datascraping/wheel-format.json`, `MyBikeLab/scripts/DatascrapingPrompt.md`, `workflows/datascraping/README.md`

**What to do:** Add `construction` under `rim` in `wheel-format.json`. Update the scraping prompt and datascraping README so rim material names/details and construction/technology source labels are emitted under `rim`, not `other_specs`. State that high-level material remains `rim.material`, while construction technologies and material detail strings belong in `rim.construction`.

**Validation:** `rg "rim_material_name|rim_material_detail|rim_construction|rim_technology|rim_construction_technology|rim\\.construction" workflows/datascraping MyBikeLab/scripts/DatascrapingPrompt.md` shows promoted destinations and no current guidance asking future scrapes to place consumed rim material/construction keys in `other_specs`.

### Task 2: Add registry property and translations

**Files:** `MyBikeLab/frontend/src/config/wheelProperties.jsx`, `MyBikeLab/frontend/public/locales/en.json`, `MyBikeLab/frontend/public/locales/fr.json`

**What to do:** Add `rimConstruction` to `WHEEL_PROPERTIES` in group `rims`, with `translatable: false`, `filter: { type: 'multiSelect' }`, and a hidden-by-default optional column. Preserve the existing `rimMaterial` property contract and locale coverage. Add locale labels for the new property.

**Validation:** The filter panel and column selector can discover the new property from the registry without component-specific wiring, and locale keys resolve in EN and FR.

### Task 3: Add the rim-material-construction codemod

**Files:** `MyBikeLab/scripts/codemods/other-specs-promote.mjs`, `MyBikeLab/scripts/codemods/README.md`

**What to do:** Add a `rim-material-construction` migration concept. For each wheel object, read consumed source keys; ensure `rim` exists when possible; enrich `rim.material` only within the existing category contract; write construction-like values into `rim.construction`; remove consumed source keys from `other_specs`; preserve unrelated rim fields.

**Validation:** `node scripts/codemods/other-specs-promote.mjs --concept rim-material-construction --dry-run` reports changed files before writing, and `--write` removes consumed source keys without touching unrelated `other_specs` entries.

### Task 4: Migrate wheel data

**Files:** `MyBikeLab/frontend/src/data/wheelsData_*.js`

**What to do:** Run the EVO-051 codemod in write mode from the product root and inspect the resulting diff. Verify every migrated wheel has promoted rim construction/material information in the existing `rim` object and no consumed source keys left in `other_specs`. Manually adjust helper-based data if shared constants still emit consumed keys after the codemod.

**Validation:** `rg "rim_material_name|rim_material_detail|rim_construction|rim_technology|rim_construction_technology" MyBikeLab/frontend/src/data` finds no remaining consumed source keys in wheel data except intentional validator/test references.

### Task 5: Add regression coverage

**Files:** `MyBikeLab/frontend/src/config/__tests__/wheelProperties.groups.test.js`, `MyBikeLab/frontend/src/data/wheelValidator.js`, `MyBikeLab/frontend/src/data/__tests__/wheelValidator.test.js`, optional codemod test file if practical

**What to do:** Extend registry tests so `rimConstruction` is declared in the Rims group and uses a multi-select filter. Extend data validation so consumed rim material/construction source keys are rejected in `other_specs`. Add focused codemod coverage for material-name preservation, construction detail promotion, multi-key construction joining, empty-string normalization, and consumed-key removal if practical without overbuilding the harness.

**Validation:** The new tests fail before the migration/registry updates and pass after implementation.

---

## Test Summary

### Baseline Vitest

- Command: `npm.cmd run test:summary`
- Result: Passed - 24 files, 289 tests
- Failed tests: None
- Notes: Baseline run before implementation. Initial run failed before executing tests because the worktree had no `frontend/node_modules`; a local junction to the existing product `node_modules` was created, then the baseline passed.

### Regression Vitest

- Command: `npm.cmd run test:summary`
- Result: Passed - 24 files, 291 tests
- Failed tests: None
- Notes: Regression run after implementation.

---

## Implementation Notes

### Task 1

- Added `rim.construction` to `wheel-format.json`.
- Updated the scraping prompt and datascraping README to direct future rim material/construction details into `rim`.

### Task 2

- Added `rimConstruction` to the Rims group with a multi-select filter and hidden-by-default column.
- Added English and French labels for the new property.

### Task 3

- Added the `rim-material-construction` concept to `scripts/codemods/other-specs-promote.mjs`.
- Documented dry-run and write commands in the codemod README.

### Task 4

- Ran the EVO-051 codemod in write mode.
- Migrated wheel data modules so rim construction/material details live under `rim`.
- Manually adjusted helper-based Arcaris, Caden, NO.6, and OVERFAST data so shared constants no longer emit consumed source keys into `other_specs`.
- Verified the migration is idempotent after writing (`Changed files: 0` on dry-run).

### Task 5

- Extended registry group tests for `rimConstruction`.
- Extended wheel validator coverage so consumed rim material/construction source keys are rejected in `other_specs`.
