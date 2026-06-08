# Light EVO: Hub bearing and material promotion

- **ID:** EVO-048
- **Date:** 2026-06-08
- **Status:** Done
- **Priority:** High
- **Project:** PROJ-001 `other-specs-promotion`

---

## Context & Need

`PROJ-001` promotes recurrent `other_specs` keys into the canonical wheel schema. EVO-048 is the first semantic pilot after the foundation work: it promotes hub bearing and hub material data into `hub`, exposes those fields through the registry, and validates the full data + scraping documentation chain on a low-risk concept.

Today these values live mostly in `other_specs.bearing_type`, occasionally in `other_specs.bearing_models`, and for Caden in `other_specs.hub_material`. Keeping them in `other_specs` makes them invisible to filter/column tooling and keeps future scraping sessions on the old vocabulary.

---

## Scope

### Included

- Add `hub.bearing_type`, `hub.bearing_models`, and `hub.material` to the canonical schema.
- Add Hub-group registry entries for hub bearing type and hub material, with multi-select filters and hidden-by-default columns.
- Add English and French labels for the new properties.
- Migrate all `frontend/src/data/wheelsData_*.js` modules so consumed source keys move from `other_specs` into `hub`.
- Extend the PROJ-001 codemod harness with an EVO-048 concept migration and focused tests.
- Update `workflows/datascraping/wheel-format.json`, `MyBikeLab/scripts/DatascrapingPrompt.md`, and `workflows/datascraping/README.md` so future scrapes write these fields directly into `hub`.

### Excluded

- Do not promote `hub_build`; it remains a variant/source note and is redundant with hub model/build tier handling.
- Do not promote `hub_internals`; it is reserved as a source for EVO-057 hub engagement parsing.
- Do not normalize bearing wording into a closed vocabulary in this EVO; preserve sourced text.
- Do not add a dedicated `bearing_models` filter unless a later UX decision needs it; it is displayed as supporting detail.
- No new wheel scraping.

---

## Acceptance Criteria

- [x] `hub.bearing_type`, `hub.bearing_models`, and `hub.material` are documented in the canonical scraping schema.
- [x] `wheelProperties.jsx` exposes Hub-group properties for bearing type and hub material with multi-select filters and optional columns.
- [x] English and French locales contain labels for the new properties.
- [x] All consumed `other_specs.bearing_type`, `other_specs.bearing_models`, and `other_specs.hub_material` values are migrated into `hub` across every `wheelsData_*.js` module.
- [x] No migrated wheel keeps the consumed source keys in `other_specs`; `hub_build` and `hub_internals` remain untouched.
- [x] The codemod can dry-run and write the `hub-bearing-material` migration.
- [x] The scraping prompt and datascraping README state that source labels `bearing_type`, `bearing_models`, and `hub_material` belong in `hub`.
- [x] Baseline and regression Vitest summary runs are recorded.

---

## Functional Decisions

- `hub.bearing_type` is a free text value, preserved from the source after trimming empty strings to `null`.
- `hub.bearing_models` is an array of string references. Existing arrays are preserved; a missing value becomes `[]`.
- `hub.material` is a free text value, preserved from `other_specs.hub_material` after trimming empty strings to `null`.
- The user-facing filterable fields are bearing type and hub material. Bearing models are supporting specs and may appear in detail/column output, but are not a filter axis in this EVO.
- Registry property IDs are `hubBearingType` and `hubMaterial`.
- The source keys consumed by this EVO are exactly `bearing_type`, `bearing_models`, and `hub_material`.

---

## Technical Tasks

### Task 1: Extend the hub schema and scraping docs

**Files:** `workflows/datascraping/wheel-format.json`, `MyBikeLab/scripts/DatascrapingPrompt.md`, `workflows/datascraping/README.md`

**What to do:** Add `bearing_type`, `bearing_models`, and `material` under `hub` in `wheel-format.json`. Update the scraping prompt examples/rules so bearing type, bearing model references, and hub material are emitted under `hub`, not `other_specs`. Add a compact datascraping README rule listing the consumed source labels and the expected canonical destinations.

**Validation:** `rg "bearing_type|bearing_models|hub_material" workflows/datascraping MyBikeLab/scripts/DatascrapingPrompt.md` shows the promoted fields documented under `hub`, not as examples of fields that belong in `other_specs`.

### Task 2: Add registry properties and translations

**Files:** `MyBikeLab/frontend/src/config/wheelProperties.jsx`, `MyBikeLab/frontend/public/locales/en.json`, `MyBikeLab/frontend/public/locales/fr.json`

**What to do:** Add `hubBearingType` and `hubMaterial` entries to `WHEEL_PROPERTIES`, both in group `hub`, both `translatable: false`, both with `filter: { type: 'multiSelect' }`, and both with hidden-by-default columns. Add locale labels for both properties.

**Validation:** The filter panel can discover the new properties from the registry without custom component changes, and the locale keys resolve in EN and FR.

### Task 3: Add the hub-bearing-material codemod

**Files:** `MyBikeLab/scripts/codemods/other-specs-promote.mjs`, `MyBikeLab/scripts/codemods/README.md`

**What to do:** Add a `hub-bearing-material` migration concept. For each wheel object, read `other_specs.bearing_type`, `other_specs.bearing_models`, and `other_specs.hub_material`; ensure `hub` exists; write non-empty values to `hub.bearing_type`, `hub.bearing_models`, and `hub.material`; remove the consumed keys from `other_specs`; preserve `hub_build` and `hub_internals`. Keep dry-run as the default and support `--write`.

**Validation:** `node scripts/codemods/other-specs-promote.mjs --concept hub-bearing-material --dry-run` reports changed files before writing, and `--write` removes the consumed keys without touching unrelated `other_specs` entries.

### Task 4: Migrate wheel data

**Files:** `MyBikeLab/frontend/src/data/wheelsData_*.js`

**What to do:** Run the EVO-048 codemod in write mode from the product root and inspect the resulting diff. Verify every migrated wheel has the promoted hub fields in the existing `hub` object and no consumed keys left in `other_specs`.

**Validation:** `rg "bearing_type|bearing_models|hub_material" MyBikeLab/frontend/src/data` finds no remaining consumed keys in wheel data except intentional test fixtures if any are updated separately.

### Task 5: Add regression coverage

**Files:** `MyBikeLab/frontend/src/config/__tests__/wheelProperties.groups.test.js`, `MyBikeLab/frontend/src/data/__tests__/wheelValidator.test.js`, optional codemod test file if the local test setup supports Node script unit tests

**What to do:** Extend registry tests so the new properties are declared in the Hub group and use multi-select filters. Extend data validation tests to warn when consumed hub-bearing source keys remain in `other_specs`, while continuing to allow `hub_build` and `hub_internals`. Add codemod-level coverage if practical without overbuilding the harness.

**Validation:** The new tests fail before the migration/registry updates and pass after implementation.

---

## Test Summary

### Baseline Vitest

- Command: `npm.cmd run test:summary`
- Result: Passed - 24 files, 283 tests
- Failed tests: None
- Notes: Baseline run before implementation.

### Regression Vitest

- Command: `npm.cmd run test:summary`
- Result: Passed - 24 files, 285 tests
- Failed tests: None
- Notes: Regression run after implementation. An intermediate run failed because Scom had a malformed helper patch and one validator fixture still treated `other_specs.bearing_type` as allowed; both were fixed before the passing run.

---

## Implementation Notes

### Task 1

- Added `hub.bearing_type`, `hub.bearing_models`, and `hub.material` to `wheel-format.json`.
- Updated the scraping prompt and datascraping README to direct future bearing/material data into `hub`.

### Task 2

- Added `hubBearingType` and `hubMaterial` registry properties in the Hub group.
- Added English and French labels for both properties.

### Task 3

- Added the `hub-bearing-material` concept to `scripts/codemods/other-specs-promote.mjs`.
- Documented dry-run and write commands in the codemod README.
- Verified the migration is idempotent after writing (`Changed files: 0` on dry-run).

### Task 4

- Migrated wheel data modules so bearing type/model references and hub material live under `hub`.
- Preserved `hub_build` and `hub_internals` as non-promoted fields.

### Task 5

- Extended registry group tests for the promoted hub properties.
- Extended wheel validator coverage so consumed hub source keys are rejected in `other_specs`.
