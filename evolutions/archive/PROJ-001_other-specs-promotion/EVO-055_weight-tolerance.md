# Light EVO: Weight tolerance promotion

- **ID:** EVO-055
- **Date:** 2026-06-08
- **Status:** Done
- **Priority:** High

---

## Context & Need

PROJ-001 promotes recurring `other_specs` keys into canonical schema fields. Weight tolerance is currently scattered across free-form keys such as `weight_tolerance`, `weight_tolerance_percent`, `weight_tolerance_grams`, and `rim_weight_tolerance_percent`, which prevents consistent validation and future scraping. This child normalizes those values into a single top-level `weight_tolerance_percent` field next to `weight_grams`, without changing the existing weight filter or sort behavior.

This branch is based on `PROJ-001` as requested. It does not integrate the parallel `Evo-054` certification worktree.

---

## Scope

### Included

- Add `weight_tolerance_percent` as the canonical numeric percentage field next to `weight_grams`.
- Migrate all brand data modules by reading the known source keys from `other_specs`, converting gram tolerances from the reference weight when possible, and removing consumed source keys.
- Update validation so promoted weight tolerance keys are forbidden in `other_specs`.
- Update scraping instructions and schema docs so future extractions write the canonical field directly.
- Keep existing weight filtering, sorting, and default column behavior unchanged.

### Excluded

- No new comparator filter for weight tolerance.
- No change to the semantics of `weight_grams`, including scalar and `{ front, rear }` support.
- No certification work from EVO-054.

---

## Acceptance Criteria

- [ ] Catalog entries that expose weight tolerance use top-level `weight_tolerance_percent` as a finite number.
- [ ] `other_specs.weight_tolerance`, `other_specs.weight_tolerance_percent`, `other_specs.weight_tolerance_grams`, and `other_specs.rim_weight_tolerance_percent` are removed from all brand data modules.
- [ ] Gram tolerances are converted to percentages using the resolved total wheelset weight when possible.
- [ ] The weight column/filter/sorts still use `weight_grams` exactly as before.
- [ ] Scraping documentation and `wheel-format.json` describe the canonical field.
- [ ] Baseline and regression Vitest summary runs are recorded.

---

## Functional Decisions

- `weight_tolerance_percent` is top-level because it qualifies the existing top-level `weight_grams` field.
- The value is a number representing percent points, e.g. `5` for `+/- 5%`.
- If both percent and gram tolerance sources exist, the explicit percent wins; gram conversion fills only when no percentage exists.
- `rim_weight_tolerance_percent` is treated as a source synonym for the wheelset weight tolerance field in this catalog pass.
- Entries without a parseable tolerance remain unchanged rather than receiving null placeholders.

---

## Technical Tasks

### Task 1: Extend the codemod for weight tolerance

**Files:** `scripts/codemods/other-specs-promote.mjs`, `scripts/codemods/README.md`

**What to do:** Add a `weight-tolerance` concept that consumes the four source keys, parses percent strings and numeric percent fields, converts gram tolerances using `weight_grams`, writes `weight_tolerance_percent`, and removes consumed keys.

**Validation:** Dry-run reports changed data modules; write mode leaves no source keys in data.

### Task 2: Migrate and validate catalog data

**Files:** `frontend/src/data/wheelsData_*.js`, `frontend/src/data/wheelValidator.js`, `frontend/src/data/__tests__/wheelValidator.test.js`

**What to do:** Run the codemod, add validator coverage for forbidden weight tolerance keys in `other_specs`, and keep `weight_grams` behavior intact.

**Validation:** Tests cover the validator warning and existing weight divergence tests remain green.

### Task 3: Update schema and scraping documentation

**Files:** `../workflows/datascraping/wheel-format.json`, `scripts/DatascrapingPrompt.md`, `../workflows/datascraping/README.md`

**What to do:** Document `weight_tolerance_percent` as the canonical field, with source-key normalization rules and gram-to-percent conversion guidance.

**Validation:** Docs no longer instruct agents to put promoted tolerance keys in `other_specs`.

### Task 4: Record results and close the EVO

**Files:** `evolutions/README.md`, `evolutions/PROJ-001_other-specs-promotion/project.md`, `evolutions/PROJ-001_other-specs-promotion/EVO-055_weight-tolerance.md`

**What to do:** Record baseline/regression results and mark EVO-055 done after validation.

**Validation:** Statuses are synchronized in both evolution indexes and this document.

---

## Test Summary

### Baseline Vitest

- Command: `npm.cmd run test:summary` from `frontend/`
- Result: Blocked, exit code 1 before test execution
- Failed tests: None reported; 0 files / 0 tests executed
- Notes: `tools/vitest-summary.mjs` could not parse Vitest JSON output because `vitest` is not installed/resolved in this worktree. `npm.cmd run test:full` reports `'vitest' n’est pas reconnu`.

### Regression Vitest

- Command: `npm.cmd run test:summary` from `frontend/`
- Result: Passed, exit code 0
- Failed tests: None
- Notes: After installing dependencies in the worktree, Vitest summary reported 24 passed files and 296 passed tests in 9.50s.

---

## Implementation Notes

### Task 1

- Added the `weight-tolerance` codemod concept.
- The codemod consumes `weight_tolerance`, `weight_tolerance_percent`, `weight_tolerance_grams`, and `rim_weight_tolerance_percent`.
- Percent strings and numeric percent fields are normalized directly; gram tolerance is converted through the resolved total `weight_grams`.
- Dry-run after migration scanned 19 data files and reported 0 remaining changes.

### Task 2

- Migrated the current catalog occurrences in FARSPORTS, GOOSYNN, OVERFAST, SCOM, and YOELEO.
- Added validator coverage that forbids promoted weight tolerance keys under `other_specs`.
- Ran `node --check` successfully on the modified data files, `wheelValidator.js`, and the codemod.

### Task 3

- Updated `scripts/DatascrapingPrompt.md`.
- Updated workspace scraping schema/docs: `workflows/datascraping/wheel-format.json` and `workflows/datascraping/README.md`.

### Task 4

- Marked EVO-055 `Done` after regression tests passed.
