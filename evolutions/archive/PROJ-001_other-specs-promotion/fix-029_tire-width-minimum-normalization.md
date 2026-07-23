# Fix: Tire width minimum normalization

- **ID:** fix-029
- **Date:**
- **Status:** Done

---

## Context & Need

Several tire-width entries were encoded as `min = max` even though the source text only expressed a minimum or an "optimal" recommendation. This makes the comparator display a fixed width where the catalog should communicate an open minimum, or suppress the value entirely when the source is ambiguous.

The affected ENVE and Mavic entries should show open minimums, while the Zipp entries should no longer expose a misleading tire-width recommendation in the canonical schema.

---

## Acceptance Criteria

- [x] ENVE tire-width entries use `{ min: N, max: null }` to express open minimum recommendations.
- [x] Mavic tire-width entries use `{ min: N, max: null }` to express open minimum recommendations.
- [x] Zipp tire-width entries use `{ min: null, max: null }` because the original value was only an inferred "optimal" width.
- [x] The comparator renders ENVE and Mavic tire widths with the open-minimum format and Zipp entries as not available.
- [x] Catalog validation and regression tests pass.
- [x] `PROJ-001` documentation and the master evolution index register `fix-029`.

---

## Technical Tasks

### Task 1: Normalize the tire-width data

**Files:** `frontend/src/data/wheelsData_enve.js`, `frontend/src/data/wheelsData_mavic.js`, `frontend/src/data/wheelsData_zipp.js`

**What to do:** Replace the ENVE and Mavic `tire_width_mm` values that currently use `min = max` with open minimums (`max: null`). Replace the Zipp `tire_width_mm` values with `{ min: null, max: null }`.

**Validation:** The affected wheel entries no longer carry misleading fixed-width recommendations.

---

### Task 2: Add regression coverage for the corrected entries

**Files:** `frontend/src/data/__tests__/catalog.integration.test.js`

**What to do:** Add targeted assertions covering the corrected ENVE, Mavic, and Zipp entries so the dataset cannot regress back to `min = max` for these cases.

**Validation:** The test suite proves the corrected entries keep their intended tire-width semantics.

---

### Task 3: Register the fix in the project and master indexes

**Files:** `evolutions/README.md`, `evolutions/PROJ-001_other-specs-promotion/project.md`

**What to do:** Add `fix-029` to the PROJ-001 child index and to the master Fixes table, then extend the child ID span to include `fix-029`.

**Validation:** The project index and master evolution index both reference the new fix.

---

## Test Summary

### Baseline Vitest

- Command: `npm.cmd run test:summary` from `MyBikeLab/`
- Result: failed
- Failed tests: none
- Notes: The command was invoked from the product root, but `package.json` lives in `frontend/`. The real suite was rerun from the frontend workspace after the code change.

### Regression Vitest

- Command: `npm.cmd run test:summary` from `MyBikeLab/frontend/`
- Result: 25 files passed, 339 tests passed, exit code 0
- Failed tests: none
- Notes: Full frontend suite passed after the tire-width normalization.

---

## Implementation Notes

### Task 1

- Updated the ENVE and Mavic open-minimum recommendations from `min = max` to `max: null`.
- Replaced the Zipp "optimal" widths with `{ min: null, max: null }` so the comparator no longer displays a misleading fixed value.

### Task 2

- Added catalog integration assertions for the corrected ENVE, Mavic, and Zipp entries.

### Task 3

- Registered `fix-029` in the PROJ-001 child index and in the master `evolutions/README.md` fixes table.
