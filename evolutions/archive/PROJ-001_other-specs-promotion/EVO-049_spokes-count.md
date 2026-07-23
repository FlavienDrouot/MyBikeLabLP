# Light EVO: Spokes count promotion

- **ID:** EVO-049
- **Date:** 2026-06-08
- **Status:** Done
- **Priority:** High
- **Project:** PROJ-001 `other-specs-promotion`

---

## Context & Need

`PROJ-001` promotes recurrent `other_specs` keys into the canonical wheel schema. EVO-049 promotes spoke count data into `spokes.count` after the foundation and hub-bearing pilot validated the shared registry, codemod, data migration, and scraping documentation chain.

Today spoke counts are scattered across `other_specs.spoke_count`, `other_specs.spoke_count_front`, `other_specs.spoke_count_rear`, and occasional text values such as `other_specs.spoke_count_disc`. Keeping them in `other_specs` makes spoke count invisible to filters, sorting, columns, and future scraping rules.

---

## Scope

### Included

- Add `spokes.count` as `{ front: number | null, rear: number | null }` to the canonical schema.
- Add a Spokes-group registry entry for spoke count with a range filter, ascending/descending sorts, and a hidden-by-default column.
- Add English and French labels for the new property and sort options.
- Migrate all `frontend/src/data/wheelsData_*.js` modules so consumed source keys move from `other_specs` into `spokes.count`.
- Extend the PROJ-001 codemod harness with an EVO-049 `spokes-count` concept migration and focused tests.
- Update `workflows/datascraping/wheel-format.json`, `MyBikeLab/scripts/DatascrapingPrompt.md`, and `workflows/datascraping/README.md` so future scrapes write spoke count directly into `spokes.count`.

### Excluded

- Do not promote spoke nipple, type, profile, or lacing fields; those belong to EVO-050.
- Do not infer spoke counts from image inspection or undocumented wheel builds.
- Do not normalize lacing vocabulary from combined values such as `"18/18H, 2:1 lacing"` beyond extracting the front/rear count numbers.
- No new wheel scraping.

---

## Acceptance Criteria

- [x] `spokes.count` is documented in the canonical scraping schema.
- [x] `wheelProperties.jsx` exposes a Spokes-group `spokeCount` property with a range filter, ascending/descending sorts, and an optional column.
- [x] English and French locales contain labels for the new spoke count property and sort options.
- [x] All consumed `other_specs.spoke_count`, `other_specs.spoke_count_front`, `other_specs.spoke_count_rear`, and `other_specs.spoke_count_disc` values are migrated into `spokes.count` across every `wheelsData_*.js` module.
- [x] No migrated wheel keeps the consumed spoke-count source keys in `other_specs`.
- [x] The codemod can dry-run and write the `spokes-count` migration.
- [x] The scraping prompt and datascraping README state that source labels for spoke counts belong in `spokes.count`.
- [x] Baseline and regression Vitest summary runs are recorded.

---

## Functional Decisions

- `spokes.count` stores front/rear spoke counts as an object: `{ front, rear }`.
- A single global `spoke_count` value is duplicated to both `front` and `rear`.
- Explicit `spoke_count_front` and `spoke_count_rear` values take precedence over a global or text-derived value for their side.
- `spoke_count_disc` is parsed only for count data. Text like `"21 front and rear"` becomes `{ front: 21, rear: 21 }`.
- Combined count strings such as `"18/18H, 2:1 lacing"` are parsed as `{ front: 18, rear: 18 }`; lacing details remain outside this EVO.
- If only one side can be confidently parsed, store that side and use `null` for the unknown side.
- The range filter and sort accessor use the maximum available side count so staggered front/rear builds remain discoverable.
- Registry property ID is `spokeCount`.
- The source keys consumed by this EVO are exactly `spoke_count`, `spoke_count_front`, `spoke_count_rear`, and `spoke_count_disc`.

---

## Technical Tasks

### Task 1: Extend the spoke schema and scraping docs

**Files:** `workflows/datascraping/wheel-format.json`, `MyBikeLab/scripts/DatascrapingPrompt.md`, `workflows/datascraping/README.md`

**What to do:** Add `count` under `spokes` in `wheel-format.json` as `{ front, rear }`. Update the scraping prompt and datascraping README so spoke count source labels are emitted under `spokes.count`, not `other_specs`. State that a single count should be duplicated to both sides and front/rear labels should map to the matching side.

**Validation:** `rg "spoke_count|spokes.count" workflows/datascraping MyBikeLab/scripts/DatascrapingPrompt.md` shows the promoted destination and no current guidance asking future scrapes to place spoke count in `other_specs`.

### Task 2: Add registry property and translations

**Files:** `MyBikeLab/frontend/src/config/wheelProperties.jsx`, `MyBikeLab/frontend/public/locales/en.json`, `MyBikeLab/frontend/public/locales/fr.json`

**What to do:** Add `spokeCount` to `WHEEL_PROPERTIES` in group `spokes`, `translatable: false`, with `filter: { type: 'range' }`, ascending/descending sorts, and a hidden-by-default column. Render single counts as `"24"` and divergent counts as `"21 / 24"`. Add locale labels for the property and sort options.

**Validation:** The filter panel, sort selector, and column selector can discover the property from the registry without component-specific wiring.

### Task 3: Add the spokes-count codemod

**Files:** `MyBikeLab/scripts/codemods/other-specs-promote.mjs`, `MyBikeLab/scripts/codemods/README.md`

**What to do:** Add a `spokes-count` migration concept. For each wheel object, read `other_specs.spoke_count`, `other_specs.spoke_count_front`, `other_specs.spoke_count_rear`, and `other_specs.spoke_count_disc`; ensure `spokes` exists; write `spokes.count`; remove the consumed keys from `other_specs`; preserve unrelated spoke detail fields for later EVOs.

**Validation:** `node scripts/codemods/other-specs-promote.mjs --concept spokes-count --dry-run` reports changed files before writing, and `--write` removes the consumed keys without touching unrelated `other_specs` entries.

### Task 4: Migrate wheel data

**Files:** `MyBikeLab/frontend/src/data/wheelsData_*.js`

**What to do:** Run the EVO-049 codemod in write mode from the product root and inspect the resulting diff. Verify every migrated wheel has `spokes.count` in the existing `spokes` object and no consumed source keys left in `other_specs`.

**Validation:** `rg "spoke_count|spoke_count_front|spoke_count_rear|spoke_count_disc" MyBikeLab/frontend/src/data` finds no remaining consumed keys in wheel data except intentional test fixtures updated for validator coverage.

### Task 5: Add regression coverage

**Files:** `MyBikeLab/frontend/src/config/__tests__/wheelProperties.groups.test.js`, `MyBikeLab/frontend/src/data/__tests__/wheelValidator.test.js`, optional codemod test file if the local test setup supports Node script unit tests

**What to do:** Extend registry tests so `spokeCount` is declared in the Spokes group and uses a range filter. Extend data validation tests to warn when consumed spoke-count source keys remain in `other_specs`. Add codemod-level coverage for numeric, front/rear, and text-derived count parsing if practical without overbuilding the harness.

**Validation:** The new tests fail before the migration/registry updates and pass after implementation.

---

## Test Summary

### Baseline Vitest

- Command:
- Command: `npm.cmd run test:summary`
- Result: Passed - 24 files, 285 tests
- Failed tests: None
- Notes: Baseline run before implementation.

### Regression Vitest

- Command:
- Command: `npm.cmd run test:summary`
- Result: Passed - 24 files, 287 tests
- Failed tests: None
- Notes: Regression run after implementation. The two added tests cover registry placement/filter type and validator rejection of legacy spoke-count `other_specs` keys.

---

## Implementation Notes

### Task 1

- Added `spokes.count` to `wheel-format.json`.
- Updated the scraping prompt and datascraping README to direct future spoke-count data into `spokes.count`.

### Task 2

- Added the `spokeCount` registry property in the Spokes group with range filtering, ascending/descending sorts, and a hidden-by-default column.
- Added English and French labels for the property and sort options.

### Task 3

- Added the `spokes-count` concept to `scripts/codemods/other-specs-promote.mjs`.
- Extended the codemod to handle both final `other_specs` objects and builder-level `otherSpecs` objects.
- Documented dry-run and write commands in the codemod README.
- Verified the migration is idempotent after writing (`Changed files: 0` on dry-run).

### Task 4

- Migrated wheel data modules so spoke counts live under `spokes.count`.
- Manually adjusted helper-based files whose counts were defined in shared constants or function parameters after the codemod migrated inline/builder object cases.
- Verified `rg "spoke_count|spoke_count_front|spoke_count_rear|spoke_count_disc" frontend/src/data` finds only validator/test references and no wheel data entries.

### Task 5

- Extended registry group tests for the promoted spoke-count property.
- Extended wheel validator coverage so consumed spoke-count source keys are rejected in `other_specs`.
