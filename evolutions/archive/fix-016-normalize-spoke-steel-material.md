# Fix: Normalize spoke steel material

- **ID:** fix-016
- **Date:** 2026-06-04
- **Status:** Done

---

## Context & Need

Some spoke material entries currently use `stainless_steel` while others use `steel`. For the comparator, these values represent the same user-facing category and should not create separate filter options or labels. The canonical spoke material value for this category is `steel`.

---

## Acceptance Criteria

- [x] Wheels whose spoke material is `stainless_steel` or `steel` are exposed as a single `steel` category in spoke material filtering and display.
- [x] The spoke material filter no longer shows separate Steel and Stainless steel options for the same category.
- [x] Existing non-steel spoke material values, such as carbon or aluminum, are unchanged.

---

## Technical Tasks

### Task 1: Normalize spoke material data

**Files:** `frontend/src/data/wheelsData_*.js`, `frontend/public/locales/en.json`, `frontend/public/locales/fr.json`

**What to do:** Replace source `spokes.material` values stored as `stainless_steel` with the canonical `steel` value, and remove the obsolete `spokeMaterial.stainless_steel` i18n labels.

**Validation:** Search confirms no `stainless_steel` value remains in the frontend source or locale files.

---

### Task 2: Cover canonical steel source values with selector tests

**Files:** `frontend/src/store/selectors/__tests__/wheelsSelectors.test.js`

**What to do:** Add or update a focused selector test proving that `spokeMaterial` exposes one canonical `steel` option and that filtering by `steel` returns all steel-spoke wheels in the fixture.

**Validation:** The selector test passes with source data using the canonical `steel` value.

---

### Task 3: Document the resolved vocabulary

**Files:** `domain-vocabulary.md`

**What to do:** Add a data convention stating that spoke material values `stainless_steel` and `steel` are equivalent and that `steel` is the canonical comparator value.

**Validation:** The glossary contains the resolved convention for future ingestion and cleanup work.

---

### Task 4: Update datascraping procedure

**Files:** `workflows/datascraping/README.md`, `workflows/datascraping/wheel-format.json`, `scripts/DatascrapingPrompt.md`, `scripts/data/Datascrapping_*.json`

**What to do:** Update the scraping transformation rules and canonical schema so future `spokes.material` values use `steel` as the canonical key and treat scraped stainless steel wording as an alias, not as a separate category. Normalize existing raw scraping JSON files to the same canonical key.

**Validation:** The datascraping workflow, prompt, schema, raw scraping JSON, and frontend files no longer list `stainless_steel` as a canonical spoke material key.

---

## Test Summary

### Baseline Vitest

- Command:
- `npm.cmd run test:summary`
- Result: 17 files passed, 230 tests passed, 0 failed, exit code 0.
- Failed tests: none.
- Notes: Baseline clean before implementation.

### Regression Vitest

- Command:
- `npm.cmd run test:summary`
- Result: 17 files passed, 231 tests passed, 0 failed, exit code 0.
- Failed tests: none.
- Notes: Regression clean after implementation. The suite includes a new selector test covering option collapse and filtering by canonical `steel`.

---

## Implementation Notes

### Task 1

- Replaced frontend data `spokes.material: 'stainless_steel'` / `"stainless_steel"` values with `steel`.
- Removed the obsolete `spokeMaterial.stainless_steel` translation keys from English and French locales.
- Kept the `spokeMaterial` accessor direct, because the data now carries the canonical value.

### Task 2

- Added selector coverage proving `steel` is exposed as a single spoke material option.
- The same test verifies that filtering by `steel` returns all steel-spoke fixture entries.

### Task 3

- Added the resolved `Spoke steel material` convention to `domain-vocabulary.md`.

### Task 4

- Updated the datascraping workflow so `steel` is the only canonical steel spoke material key.
- Documented scraped "stainless steel" wording as an alias of `steel`.
- Updated `wheel-format.json` and `scripts/DatascrapingPrompt.md` so new scraping runs emit `steel`.
- Replaced existing raw scraping JSON `stainless_steel` values with `steel`.
