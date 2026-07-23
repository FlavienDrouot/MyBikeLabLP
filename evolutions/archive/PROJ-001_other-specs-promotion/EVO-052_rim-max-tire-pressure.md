# Light EVO: Rim max tire pressure promotion

- **ID:** EVO-052
- **Date:** 2026-06-08
- **Status:** Done
- **Priority:** High
- **Project:** PROJ-001 `other-specs-promotion`

---

## Context & Need

`PROJ-001` promotes recurrent `other_specs` keys into the canonical wheel schema. EVO-052 promotes maximum tire pressure into `rim.max_tire_pressure` so pressure limits become a structured rim attribute instead of scattered free-form metadata.

Today tire pressure appears under source keys such as `max_tire_pressure_psi`, `max_tire_pressure_bar`, tubeless/tubed variants, 28c variants, and free-text `maximum_tire_pressure`. Keeping these values in `other_specs` blocks consistent filtering, sorting, display, and future scraping guidance for a safety-relevant compatibility spec.

---

## Scope

### Included

- Add `rim.max_tire_pressure` as a canonical schema field with `{ psi, bar, note }`.
- Add a Rims-group registry property for max tire pressure with a range filter, ascending/descending sorts, and a hidden-by-default optional column.
- Add English and French labels and sort labels for the new property.
- Migrate all `frontend/src/data/wheelsData_*.js` modules so consumed source keys move from `other_specs` into `rim.max_tire_pressure`.
- Extend the PROJ-001 codemod harness with an EVO-052 `rim-max-tire-pressure` concept migration.
- Update `workflows/datascraping/wheel-format.json`, `MyBikeLab/scripts/DatascrapingPrompt.md`, and `workflows/datascraping/README.md` so future scrapes write max tire pressure directly into `rim.max_tire_pressure`.
- Add validation so consumed tire-pressure source keys are rejected in `other_specs`.

### Excluded

- Do not migrate minimum tire pressure; this EVO only promotes maximum tire pressure.
- Do not promote tire width fields; EVO-058 owns `rim.tire_width_mm`.
- Do not promote tire type / tubeless compatibility; EVO-056 owns `rim.tire_compatibility`.
- Do not infer pressure limits from hookless/tubeless state when no source pressure is published.
- Do not create per-tire-width structured pressure maps; conditional cases stay in `note`.
- No new wheel scraping.

---

## Acceptance Criteria

- [x] `rim.max_tire_pressure` is documented in the canonical scraping schema with `psi`, `bar`, and `note`.
- [x] `wheelProperties.jsx` exposes a Rims-group `maxTirePressure` property with range filtering, sort options, and a hidden-by-default column.
- [x] English and French locales contain labels for the new property and sort options.
- [x] All consumed max-tire-pressure source keys are migrated into `rim.max_tire_pressure` across every `wheelsData_*.js` module.
- [x] No migrated wheel keeps consumed max-tire-pressure source keys in `other_specs`.
- [x] Conditional pressure information, such as tubeless/tubed or 28c-specific values, is preserved in `rim.max_tire_pressure.note`.
- [x] The codemod can dry-run and write the `rim-max-tire-pressure` migration.
- [x] The scraping prompt and datascraping README state that source labels for maximum tire pressure belong in `rim.max_tire_pressure`.
- [x] Baseline and regression Vitest summary runs are recorded.

---

## Functional Decisions

- `rim.max_tire_pressure` stores `{ psi: number | null, bar: number | null, note: string | null }`.
- The registry accessor returns `psi` as the primary numeric value because existing filtering can use one scalar range and many current source values are already in psi.
- When only `bar` is present, the codemod computes `psi` using `psi = round(bar * 14.5038)`.
- When only `psi` is present, the codemod computes `bar` using `bar = round((psi / 14.5038) * 10) / 10`.
- When both `psi` and `bar` are present, preserve both source values without re-rounding.
- A generic `max_tire_pressure_psi` or `max_tire_pressure_bar` value becomes the canonical numeric limit.
- Conditional source keys, including tubeless/tubed and tire-width-specific variants, are not collapsed into a single unconditional value unless no generic value exists; their original meaning is preserved in `note`.
- Free-text `maximum_tire_pressure` is parsed for obvious psi/bar numbers. The original text is preserved in `note` when it contains conditions or wording beyond a plain value.
- The source keys consumed by this EVO are exactly `max_tire_pressure_psi`, `max_tire_pressure_bar`, `maximum_tire_pressure`, `max_tire_pressure_tubeless_psi`, `max_tire_pressure_tubed_psi`, `max_tire_pressure_psi_28c`, `max_tire_pressure_psi_clincher`, and `max_tire_pressure_psi_tubeless`.

---

## Technical Tasks

### Task 1: Extend the rim schema and scraping docs

**Files:** `workflows/datascraping/wheel-format.json`, `MyBikeLab/scripts/DatascrapingPrompt.md`, `workflows/datascraping/README.md`

**What to do:** Add `max_tire_pressure` under `rim` in `wheel-format.json` with `psi`, `bar`, and `note`. Update the scraping prompt and datascraping README so maximum tire pressure source labels are emitted under `rim.max_tire_pressure`, not `other_specs`. Document unit conversion and conditional cases.

**Validation:** `rg "max_tire_pressure|maximum_tire_pressure|rim.max_tire_pressure" workflows/datascraping MyBikeLab/scripts/DatascrapingPrompt.md` shows the promoted destination and no guidance asking future scrapes to place consumed max-pressure keys in `other_specs`.

### Task 2: Add registry property and translations

**Files:** `MyBikeLab/frontend/src/config/wheelProperties.jsx`, `MyBikeLab/frontend/public/locales/en.json`, `MyBikeLab/frontend/public/locales/fr.json`

**What to do:** Add `maxTirePressure` to `WHEEL_PROPERTIES` in group `rims`, `translatable: false`, `unit: ' psi'`, `filter: { type: 'range' }`, ascending/descending sort options, and a hidden-by-default column. Render both psi and bar when available, with a compact note line only when a note exists. Add locale labels and sort labels.

**Validation:** Registry tests confirm the property belongs to `rims`, is filterable by range, and exposes the expected sort IDs.

### Task 3: Add the rim max tire pressure codemod

**Files:** `MyBikeLab/scripts/codemods/other-specs-promote.mjs`, `MyBikeLab/scripts/codemods/README.md`

**What to do:** Add a `rim-max-tire-pressure` migration concept. For each wheel object, read consumed source keys from `other_specs`; ensure `rim` is an object; write `rim.max_tire_pressure`; remove consumed keys from `other_specs`; preserve unrelated pressure information such as `tire_pressure_monitoring`.

**Validation:** `node scripts/codemods/other-specs-promote.mjs --concept rim-max-tire-pressure --dry-run` reports changed files before writing, and `--write` removes consumed keys without touching unrelated `other_specs` entries.

### Task 4: Migrate wheel data

**Files:** `MyBikeLab/frontend/src/data/wheelsData_*.js`

**What to do:** Run the EVO-052 codemod in write mode from the product root and inspect the resulting diff. Verify migrated wheels have `rim.max_tire_pressure` and no consumed source keys left in `other_specs`.

**Validation:** `rg "max_tire_pressure_psi|max_tire_pressure_bar|maximum_tire_pressure|max_tire_pressure_tubeless_psi|max_tire_pressure_tubed_psi|max_tire_pressure_psi_28c|max_tire_pressure_psi_clincher|max_tire_pressure_psi_tubeless" MyBikeLab/frontend/src/data` finds no remaining consumed source keys in wheel data except intentional validator/test references.

### Task 5: Add regression coverage

**Files:** `MyBikeLab/frontend/src/config/__tests__/wheelProperties.groups.test.js`, `MyBikeLab/frontend/src/data/wheelValidator.js`, `MyBikeLab/frontend/src/data/__tests__/wheelValidator.test.js`, optional codemod test file if practical

**What to do:** Extend registry tests for `maxTirePressure`. Extend data validation so consumed max-pressure source keys are rejected in `other_specs`. Add focused codemod coverage for psi-only conversion, bar-only conversion, both-units preservation, conditional note preservation, and free-text parsing if practical without overbuilding the harness.

**Validation:** The new tests fail before the migration/registry updates and pass after implementation.

---

## Test Summary

### Baseline Vitest

- Command: `npm.cmd run test:summary`
- Result: Passed - 24 files, 289 tests
- Failed tests: None
- Notes: Initial run failed before tests because the new worktree had no `node_modules`; after `npm.cmd ci`, baseline passed.

### Regression Vitest

- Command: `npm.cmd run test:summary`
- Result: Passed - 24 files, 291 tests
- Failed tests: None
- Notes: Regression run after implementation. Codemod dry-run after migration reports `Changed files: 0`.

---

## Implementation Notes

### Task 1

- Added `rim.max_tire_pressure` with `psi`, `bar`, and `note` to `wheel-format.json`.
- Updated the scraping prompt and datascraping README so future max-pressure values go into `rim.max_tire_pressure`.

### Task 2

- Added `maxTirePressure` to the Rims group with range filtering, sorting, and a hidden-by-default column.
- Added English and French labels and sort labels.

### Task 3

- Added the `rim-max-tire-pressure` concept to `scripts/codemods/other-specs-promote.mjs`.
- Documented dry-run and write commands in the codemod README.
- Verified idempotence after data migration (`Changed files: 0` on dry-run).

### Task 4

- Migrated simple per-wheel pressure keys via the codemod.
- Manually migrated helper/shared-constant data in Arcaris, Magene, NO.6, and OVERFAST where source pressure keys were spread into wheel entries.
- Verified no consumed max-pressure source key remains in `frontend/src/data`.

### Task 5

- Extended registry tests for `maxTirePressure`.
- Extended wheel validator coverage so consumed max-pressure source keys are rejected in `other_specs`.
