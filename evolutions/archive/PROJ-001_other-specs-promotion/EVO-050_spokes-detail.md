# Light EVO: Spokes detail promotion

- **ID:** EVO-050
- **Date:** 2026-06-08
- **Status:** Done
- **Priority:** High
- **Project:** PROJ-001 `other-specs-promotion`

---

## Context & Need

`PROJ-001` promotes recurrent `other_specs` keys into the canonical wheel schema. EVO-050 is the next Spokes-group migration after spoke count: it promotes spoke nipple, spoke type, spoke profile, and front/rear lacing details into `spokes`.

Today these values are scattered across multiple `other_specs` spellings such as `nipples`, `spoke_nipple`, `spoke_lacing_front`, `front_wheel_spoke_lacing`, and generic `lacing`. Keeping them in `other_specs` prevents the comparator from exposing these recurring build details through filters, sorting, columns, and future scraping rules.

---

## Scope

### Included

- Add `spokes.nipple`, `spokes.type`, `spokes.profile`, and `spokes.lacing` as canonical schema fields.
- Add Spokes-group registry entries for spoke nipple, spoke type, spoke profile, and spoke lacing with multi-select filters and hidden-by-default columns.
- Add English and French labels for the new properties.
- Migrate all `frontend/src/data/wheelsData_*.js` modules so consumed source keys move from `other_specs` into `spokes`.
- Extend the PROJ-001 codemod harness with an EVO-050 `spokes-detail` concept migration and focused parsing rules.
- Update `workflows/datascraping/wheel-format.json`, `MyBikeLab/scripts/DatascrapingPrompt.md`, and `workflows/datascraping/README.md` so future scrapes write these values directly into `spokes`.

### Excluded

- Do not change `spokes.material`; spoke type/profile are separate fields and must not be merged into material.
- Do not promote spoke count fields; EVO-049 already handled `spokes.count`.
- Do not parse spoke length, spoke tension, spoke replacement part numbers, or spoke notes.
- Do not infer lacing from images or from undocumented wheel builds.
- No new wheel scraping.

---

## Acceptance Criteria

- [x] `spokes.nipple`, `spokes.type`, `spokes.profile`, and `spokes.lacing` are documented in the canonical scraping schema.
- [x] `wheelProperties.jsx` exposes Spokes-group properties for nipple, type, profile, and lacing with multi-select filters and optional columns.
- [x] English and French locales contain labels for the new properties.
- [x] All consumed spoke-detail source keys are migrated into `spokes` across every `wheelsData_*.js` module.
- [x] No migrated wheel keeps the consumed spoke-detail source keys in `other_specs`.
- [x] The codemod can dry-run and write the `spokes-detail` migration.
- [x] The scraping prompt and datascraping README state that source labels for nipple, type, profile, and lacing belong in `spokes`.
- [x] Baseline and regression Vitest summary runs are recorded.

---

## Functional Decisions

- `spokes.nipple` is a free text value, preserved from the source after trimming empty strings to `null`.
- `spokes.type` is a free text value for spoke architecture or attachment wording such as `straight-pull`, `j-bend`, or source phrases like `straight-pull aero`.
- `spokes.profile` is a free text value for shape/profile wording such as `straight flat tapered` or `aerodynamic double-butted elliptical`.
- `spokes.lacing` stores `{ front: string | null, rear: string | null }`.
- A single global lacing value is duplicated to both front and rear.
- Explicit front/rear lacing values take precedence over a global lacing value for their side.
- Normalize obvious lacing vocabulary only where confidence is high: `2x`, `2X`, and `2X Cross` become `2-cross`; `radial` casing is normalized to `radial`.
- Preserve richer side-specific lacing phrases when they carry more information than the closed shorthand, such as `two-cross/radial (2:1)` or `21H 2:1, brake side x2, non-brake side radial lacing`.
- Registry property IDs are `spokeNipple`, `spokeType`, `spokeProfile`, and `spokeLacing`.
- The source keys consumed by this EVO are exactly `nipples`, `spoke_nipple`, `spoke_nipples`, `spoke_type`, `spoke_profile`, `spoke_lacing`, `spoke_lacing_front`, `spoke_lacing_rear`, `front_wheel_spoke_lacing`, `rear_wheel_spoke_lacing`, `lacing`, and `rear_lacing`.

---

## Technical Tasks

### Task 1: Extend the spoke schema and scraping docs

**Files:** `workflows/datascraping/wheel-format.json`, `MyBikeLab/scripts/DatascrapingPrompt.md`, `workflows/datascraping/README.md`

**What to do:** Add `nipple`, `type`, `profile`, and `lacing` under `spokes` in `wheel-format.json`. Update the scraping prompt and datascraping README so spoke nipple/type/profile/lacing source labels are emitted under `spokes`, not `other_specs`. State that a single lacing value should be duplicated to both sides and front/rear labels should map to the matching side.

**Validation:** `rg "nipples|spoke_nipple|spoke_nipples|spoke_type|spoke_profile|spoke_lacing|front_wheel_spoke_lacing|rear_wheel_spoke_lacing|rear_lacing|spokes.lacing" workflows/datascraping MyBikeLab/scripts/DatascrapingPrompt.md` shows the promoted destinations and no current guidance asking future scrapes to place consumed spoke-detail keys in `other_specs`.

### Task 2: Add registry properties and translations

**Files:** `MyBikeLab/frontend/src/config/wheelProperties.jsx`, `MyBikeLab/frontend/public/locales/en.json`, `MyBikeLab/frontend/public/locales/fr.json`

**What to do:** Add `spokeNipple`, `spokeType`, `spokeProfile`, and `spokeLacing` to `WHEEL_PROPERTIES` in group `spokes`, all `translatable: false`, all with `filter: { type: 'multiSelect' }`, and all hidden by default as optional columns. Render `spokeLacing` as a single value when front and rear match and as `front / rear` when they differ. Add locale labels for the properties.

**Validation:** The filter panel and column selector can discover the new properties from the registry without component-specific wiring, and locale keys resolve in EN and FR.

### Task 3: Add the spokes-detail codemod

**Files:** `MyBikeLab/scripts/codemods/other-specs-promote.mjs`, `MyBikeLab/scripts/codemods/README.md`

**What to do:** Add a `spokes-detail` migration concept. For each wheel object, read the consumed source keys; ensure `spokes` exists; write `spokes.nipple`, `spokes.type`, `spokes.profile`, and `spokes.lacing`; remove consumed source keys from `other_specs`; preserve unrelated spoke detail fields such as spoke length and spoke tension.

**Validation:** `node scripts/codemods/other-specs-promote.mjs --concept spokes-detail --dry-run` reports changed files before writing, and `--write` removes the consumed keys without touching unrelated `other_specs` entries.

### Task 4: Migrate wheel data

**Files:** `MyBikeLab/frontend/src/data/wheelsData_*.js`

**What to do:** Run the EVO-050 codemod in write mode from the product root and inspect the resulting diff. Verify every migrated wheel has promoted spoke detail fields in the existing `spokes` object and no consumed source keys left in `other_specs`.

**Validation:** `rg "nipples|spoke_nipple|spoke_nipples|spoke_type|spoke_profile|spoke_lacing|front_wheel_spoke_lacing|rear_wheel_spoke_lacing|rear_lacing|\\blacing\\b" MyBikeLab/frontend/src/data` finds no remaining consumed source keys in wheel data except intentional validator/test references.

### Task 5: Add regression coverage

**Files:** `MyBikeLab/frontend/src/config/__tests__/wheelProperties.groups.test.js`, `MyBikeLab/frontend/src/data/wheelValidator.js`, `MyBikeLab/frontend/src/data/__tests__/wheelValidator.test.js`, optional codemod test file if practical

**What to do:** Extend registry tests so the new spoke-detail properties are declared in the Spokes group and use multi-select filters. Extend data validation so consumed spoke-detail source keys are rejected in `other_specs`. Add focused codemod coverage for nipple spellings, type/profile preservation, global lacing duplication, side-specific lacing, and basic `2x` to `2-cross` normalization if practical without overbuilding the harness.

**Validation:** The new tests fail before the migration/registry updates and pass after implementation.

---

## Test Summary

### Baseline Vitest

- Command: `npm.cmd run test:summary`
- Result: Passed - 24 files, 287 tests
- Failed tests: None
- Notes: Baseline run before implementation.

### Regression Vitest

- Command: `npm.cmd run test:summary`
- Result: Passed - 24 files, 289 tests
- Failed tests: None
- Notes: Regression run after implementation. An intermediate run failed because the existing spoke-count validator fixture still included `other_specs.nipples`; the fixture was split so EVO-050 now owns that warning.

---

## Implementation Notes

### Task 1

- Added `spokes.nipple`, `spokes.type`, `spokes.profile`, and `spokes.lacing` to `wheel-format.json`.
- Updated the scraping prompt and datascraping README to direct future spoke-detail data into `spokes`.

### Task 2

- Added `spokeNipple`, `spokeType`, `spokeProfile`, and `spokeLacing` registry properties in the Spokes group with multi-select filters and hidden-by-default columns.
- Added English and French labels for the new properties.

### Task 3

- Added the `spokes-detail` concept to `scripts/codemods/other-specs-promote.mjs`.
- Documented dry-run and write commands in the codemod README.
- Verified the migration is idempotent after writing (`Changed files: 0` on dry-run).

### Task 4

- Migrated wheel data modules so spoke nipple, type, profile, and lacing details live under `spokes`.
- Manually adjusted helper-based Caden, GOOSYNN, Magene, NO.6, and OVERFAST data so shared constants no longer emit consumed source keys into `other_specs`.
- Verified no consumed source key remains in wheel data except intentional validator/test references and non-key prose such as `hidden nipples`.

### Task 5

- Extended registry group tests for the promoted spoke-detail properties.
- Extended wheel validator coverage so consumed spoke-detail source keys are rejected in `other_specs`.
