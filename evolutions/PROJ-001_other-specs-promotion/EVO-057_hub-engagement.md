# Light EVO: Hub engagement promotion

- **ID:** EVO-057
- **Date:** 2026-06-09
- **Status:** Done
- **Priority:** High

---

## Context & Need

PROJ-001 promotes recurring `other_specs` keys into canonical schema fields. Hub engagement data is currently scattered across direct numeric fields and free-text hub technology descriptions, which makes engagement type and points unavailable as comparable wheel properties. This child promotes engagement into `hub.engagement`, preserving the existing project rule that `hub_internals` is consumed only as a parse source and not exposed as its own field.

---

## Scope

### Included

- Add `hub.engagement` as a canonical object with `type` and `points`.
- Consume parseable `other_specs.points_of_engagement`, `other_specs.ratchet_teeth`, `other_specs.ratchet`, and `other_specs.hub_internals`.
- Parse explicit ratchet tooth counts such as `36T` as engagement points.
- Expose hub engagement type and points through `wheelProperties.jsx`.
- Update validation, i18n, tests, scraping schema, scraping prompt, and scraping workflow documentation.

### Excluded

- No standalone `hub_internals` field promotion.
- No inference from hub brand or model alone when no explicit engagement source is present.
- No attempt to model pawl count, phased pawls, or degrees of engagement separately from `points`.
- No parsing of unrelated freehub technology notes unless they explicitly identify the engagement mechanism or point/tooth count.
- No UI redesign beyond adding the new hub engagement property axis.

---

## Acceptance Criteria

- [x] Catalog entries may expose `hub.engagement` as `{ type, points }`, with `type` using only the canonical values `star-ratchet`, `ratchet`, `pawl`, or `other`, and `points` as a number or `null`.
- [x] Parseable source keys `points_of_engagement`, `ratchet_teeth`, `ratchet`, and `hub_internals` are removed from `other_specs` after migration.
- [x] Ambiguous or unparseable source values are preserved in `other_specs` for manual review instead of being silently discarded.
- [x] The comparator offers hub engagement type as a multi-select property and engagement points as a range-sortable numeric property.
- [x] Scraping documentation and `wheel-format.json` describe `hub.engagement`, the closed type vocabulary, source-key normalization, and the rule that ratchet teeth equal points of engagement.
- [x] Baseline and regression Vitest summary runs are recorded.

---

## Functional Decisions

- `hub.engagement` is the canonical shape: `{ type: string | null, points: number | null }`.
- Canonical `type` values are:
  - `star-ratchet`: DT Swiss Ratchet, Ratchet EXP, or explicit star-ratchet systems.
  - `ratchet`: generic ratchet or ratchet-like systems without enough evidence for `star-ratchet`.
  - `pawl`: classic pawl-based systems when explicitly stated.
  - `other`: explicit engagement systems that do not fit the known vocabulary.
- For ratchet systems, tooth count equals points of engagement: `36T` means `points: 36`.
- Numeric `points_of_engagement` has priority for `points` when present; `ratchet_teeth` or a parsed `36T` fills points when the direct field is absent.
- No engagement data is inferred from brand/model names alone; source text must explicitly mention the mechanism or point/tooth count.

---

## Technical Tasks

### Task 1: Extend the codemod for hub engagement

**Files:** `scripts/codemods/other-specs-promote.mjs`, `scripts/codemods/README.md`

**What to do:** Add a `hub-engagement` concept that reads `other_specs.points_of_engagement`, `other_specs.ratchet_teeth`, `other_specs.ratchet`, and `other_specs.hub_internals`, parses a canonical engagement object, writes/merges `hub.engagement`, and removes only source keys whose values were successfully consumed.

**Validation:** Dry-run reports changed data modules; write mode leaves no parseable consumed source keys in data.

### Task 2: Migrate and validate catalog data

**Files:** `frontend/src/data/wheelsData_*.js`, `frontend/src/data/wheelValidator.js`, `frontend/src/data/__tests__/wheelValidator.test.js`

**What to do:** Run the codemod in write mode, add validator coverage for promoted hub engagement source keys, and verify migrated entries use the canonical `hub.engagement` shape.

**Validation:** Catalog integration and validator tests pass; grep confirms parseable engagement source keys are gone or intentionally preserved as unparseable review notes.

### Task 3: Add comparator properties

**Files:** `frontend/src/config/wheelProperties.jsx`, `frontend/src/config/__tests__/*.test.*`, `frontend/src/store/selectors/__tests__/wheelsSelectors.test.js`, `frontend/src/store/slices/__tests__/filtersSlice.test.js`, `frontend/src/components/MiniComparator/__tests__/*.test.*`, `frontend/src/i18n/*.json`

**What to do:** Add hub engagement type and engagement points as registry properties in the Hub group. Use `multiSelect` for type and `range` for points, with translated labels and display values for the closed type vocabulary.

**Validation:** Filter initialization, selector behavior, i18n coverage, and comparator rendering tests cover both new properties.

### Task 4: Update schema and scraping documentation

**Files:** `../workflows/datascraping/wheel-format.json`, `scripts/DatascrapingPrompt.md`, `../workflows/datascraping/README.md`

**What to do:** Document `hub.engagement`, canonical type values, point/tooth parsing rules, and the consumed legacy source keys.

**Validation:** Future scraping instructions no longer direct engagement data into `other_specs`.

### Task 5: Record results and close the EVO

**Files:** `evolutions/README.md`, `evolutions/PROJ-001_other-specs-promotion/project.md`, `evolutions/PROJ-001_other-specs-promotion/EVO-057_hub-engagement.md`

**What to do:** Record baseline/regression results and mark EVO-057 done after validation.

**Validation:** Statuses are synchronized in both evolution indexes and this document.

---

## Test Summary

### Baseline Vitest

- Command:
- Command: `npm.cmd run test:summary` from `frontend/`
- Result: Passed, exit code 0
- Failed tests: None
- Notes: Vitest summary reported 24 passed files and 305 passed tests in 4.71s.

### Regression Vitest

- Command:
- Command: `npm.cmd run test:summary` from `frontend/`
- Result: Passed, exit code 0
- Failed tests: None
- Notes: Vitest summary reported 24 passed files and 312 passed tests in 4.45s. Targeted validator/catalog run also passed: 2 files, 44 tests.

---

## Implementation Notes

### Task 1

- Added the `hub-engagement` codemod concept and README usage commands.
- Dry-run changed 4 data modules: Channel3, Roval, Yoeleo, and Zipp.

### Task 2

- Ran the codemod in write mode.
- Migrated direct parseable source keys into `hub.engagement`.
- Added validator warnings and tests for promoted engagement source keys plus invalid engagement shape/value cases.
- Magene uses helper-level source objects, so its `ratchet` helper input is consumed manually in `splitHubSpecs` before final `other_specs` output.

### Task 3

- Added `hubEngagementType` and `hubEngagementPoints` to `wheelProperties.jsx`.
- Added English/French labels, engagement type translations, sort labels, and registry/accessor tests.

### Task 4

- Updated `workflows/datascraping/wheel-format.json`, `scripts/DatascrapingPrompt.md`, and `workflows/datascraping/README.md` with the canonical schema and ingestion rules.

### Task 5

- Recorded baseline and regression results.
- Synchronized EVO-057 status to `Done` in the project and evolution indexes.
