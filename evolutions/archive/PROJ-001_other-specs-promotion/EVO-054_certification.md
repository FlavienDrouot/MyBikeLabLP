# Light EVO: Certification promotion

- **ID:** EVO-054
- **Date:** 2026-06-08
- **Status:** Done
- **Priority:** High
- **Project:** PROJ-001 `other-specs-promotion`

---

## Context & Need

`PROJ-001` promotes recurrent `other_specs` keys into the canonical wheel schema. EVO-054 promotes wheel certification data so UCI approval, ASTM category, and e-bike approval are no longer scattered across free-form fields.

Today these values appear as source labels such as `uci_approved`, `astm_category`, `e_bike_approved`, and sometimes as free text in `certification`. Keeping them in `other_specs` prevents the comparator, detail panel, and future scraping process from exposing certification status through stable filters and columns.

---

## Scope

### Included

- Add a top-level `certification` canonical object with `uci`, `astm`, and `ebike`.
- Add registry entries for UCI approval, ASTM category, and e-bike approval.
- Add English and French labels for the new properties and tri-state filter labels where needed.
- Migrate all `frontend/src/data/wheelsData_*.js` modules so consumed certification source keys move from `other_specs` into `certification`.
- Extend the PROJ-001 codemod harness with an EVO-054 `certification` concept migration.
- Update `workflows/datascraping/wheel-format.json`, `MyBikeLab/scripts/DatascrapingPrompt.md`, and `workflows/datascraping/README.md` so future scrapes write certification data directly into the canonical schema.

### Excluded

- Do not infer certification from marketing copy unless the text explicitly states UCI, ASTM, or e-bike approval.
- Do not promote unrelated standards, impact tests, warranty terms, or compliance notes.
- Do not change the meaning of existing `wheelset_category`, `brake_type`, hookless, or tubeless fields.
- No new wheel scraping.

---

## Acceptance Criteria

- [x] `certification.uci`, `certification.astm`, and `certification.ebike` are documented in the canonical scraping schema.
- [x] `wheelProperties.jsx` exposes certification properties with filters and optional hidden-by-default columns.
- [x] English and French locales contain labels for the new properties and filters.
- [x] All consumed certification source keys are migrated into `certification` across every `wheelsData_*.js` module.
- [x] No migrated wheel keeps the consumed certification source keys in `other_specs`.
- [x] The codemod can dry-run and write the `certification` migration.
- [x] The scraping prompt and datascraping README state that certification source labels belong in `certification`.
- [x] Baseline and regression Vitest summary runs are recorded.

---

## Functional Decisions

- `certification` is a top-level object because it describes the wheelset as a product approval/compliance status, not a rim, hub, or spoke component.
- `certification.uci` is `boolean | null`.
- `certification.astm` is `number | null`, representing the ASTM F2043 category when sourced.
- `certification.ebike` is `boolean | null`.
- `uci_approved` maps to `certification.uci`.
- `astm_category` maps to `certification.astm`.
- `e_bike_approved` maps to `certification.ebike`.
- Free text `certification` is parsed only for explicit UCI approval, ASTM category, or e-bike approval statements.
- Registry property IDs are `uciApproved`, `astmCategory`, and `ebikeApproved`.
- `uciApproved` and `ebikeApproved` use tri-state filters; `astmCategory` uses a multi-select filter.

---

## Technical Tasks

### Task 1: Extend the certification schema and scraping docs

**Files:** `workflows/datascraping/wheel-format.json`, `MyBikeLab/scripts/DatascrapingPrompt.md`, `workflows/datascraping/README.md`

**What to do:** Add the top-level `certification` object to `wheel-format.json`. Update the scraping prompt and datascraping README so `uci_approved`, `astm_category`, `e_bike_approved`, and explicit free-text certification statements are emitted under `certification`, not `other_specs`.

**Validation:** `rg "uci_approved|astm_category|e_bike_approved|certification" workflows/datascraping MyBikeLab/scripts/DatascrapingPrompt.md` shows canonical destinations and no current guidance asking future scrapes to place consumed certification keys in `other_specs`.

### Task 2: Add registry properties and translations

**Files:** `MyBikeLab/frontend/src/config/wheelProperties.jsx`, `MyBikeLab/frontend/public/locales/en.json`, `MyBikeLab/frontend/public/locales/fr.json`

**What to do:** Add `uciApproved`, `astmCategory`, and `ebikeApproved` to `WHEEL_PROPERTIES`, likely in the General group, with hidden-by-default optional columns. Add tri-state filters for UCI and e-bike approval, and a multi-select filter for ASTM category. Add English and French labels and filter labels.

**Validation:** The filter panel and column selector can discover the new properties from the registry without component-specific wiring, and locale keys resolve in EN and FR.

### Task 3: Add the certification codemod

**Files:** `MyBikeLab/scripts/codemods/other-specs-promote.mjs`, `MyBikeLab/scripts/codemods/README.md`

**What to do:** Add a `certification` migration concept. For each wheel object, read consumed source keys; create or extend the top-level `certification` object; normalize boolean and numeric values; parse explicit free-text certification statements; remove consumed source keys from `other_specs`; preserve unrelated compliance notes.

**Validation:** `node scripts/codemods/other-specs-promote.mjs --concept certification --dry-run` reports changed files before writing, and `--write` removes consumed source keys without touching unrelated `other_specs` entries.

### Task 4: Migrate wheel data

**Files:** `MyBikeLab/frontend/src/data/wheelsData_*.js`

**What to do:** Run the EVO-054 codemod in write mode from the product root and inspect the resulting diff. Verify every migrated wheel has certification information in `certification` and no consumed source keys left in `other_specs`.

**Validation:** `rg "uci_approved|astm_category|e_bike_approved|\\bcertification\\b" MyBikeLab/frontend/src/data` finds no remaining consumed source keys in `other_specs` except intentional validator/test references.

### Task 5: Add regression coverage

**Files:** `MyBikeLab/frontend/src/config/__tests__/wheelProperties.groups.test.js`, `MyBikeLab/frontend/src/data/wheelValidator.js`, `MyBikeLab/frontend/src/data/__tests__/wheelValidator.test.js`, optional codemod test file if practical

**What to do:** Extend registry tests so the new certification properties are declared and filterable. Extend data validation so consumed certification source keys are rejected in `other_specs`. Add focused codemod coverage for direct boolean values, numeric ASTM category, free-text UCI parsing, free-text e-bike parsing, empty value handling, and consumed-key removal if practical without overbuilding the harness.

**Validation:** The new tests fail before the migration/registry updates and pass after implementation.

---

## Test Summary

### Baseline Vitest

- Command: `npm.cmd run test:summary`
- Result: Passed - 24 files, 293 tests
- Failed tests: None
- Notes: Baseline run after resolving pre-existing EVO-051/EVO-052 merge conflicts and creating the EVO-054 draft. A local `frontend/node_modules` junction to the main product dependencies was created so Vitest could run in this worktree.

### Regression Vitest

- Command: `npm.cmd run test:summary`
- Result: Passed - 24 files, 295 tests
- Failed tests: None
- Notes: Regression run after implementation. The certification codemod dry-run is idempotent after writing (Changed files: 0).

---

## Implementation Notes

### Task 1

- Added top-level `certification` to `wheel-format.json` with `uci`, `astm`, and `ebike`.
- Updated the datascraping README and scraping prompt to direct certification source labels into `certification`.

### Task 2

- Added `uciApproved`, `astmCategory`, and `ebikeApproved` registry properties.
- Added English and French labels plus tri-state filter labels for UCI and e-bike approval.

### Task 3

- Added the `certification` concept to `scripts/codemods/other-specs-promote.mjs`.
- Documented the dry-run and write commands in the codemod README.

### Task 4

- Ran the certification codemod in write mode.
- Migrated Farsports, Mavic, and Roval data automatically.
- Manually adjusted Arcaris and NO.6 helper-based data so shared `other_specs` constants no longer emit consumed certification keys.
- Verified the migration is idempotent after writing.

### Task 5

- Extended registry group tests for the promoted certification properties.
- Extended wheel validator coverage so consumed certification source keys are rejected in `other_specs`.
- Rebuilt the XX locale completeness test with token validation robust to UI symbols and option-count suffixes.
