# Light EVO: Other specs promotion foundation

- **ID:** EVO-047
- **Date:** 2026-06-08
- **Status:** Done
- **Priority:** High
- **Project:** PROJ-001 `other-specs-promotion`

---

## Context & Need

`PROJ-001` promotes recurring `other_specs` fields into the canonical wheel schema across a sequence of small child evolutions. Before promoting semantic fields, the comparator registry needs a cleaner separation between hub and spoke properties, and the data migrations need a repeatable codemod harness so every later child can migrate all wheel data files consistently. This foundation EVO creates that shared structure without changing wheel data semantics yet.

---

## Scope

### Included

- Split the existing `subs` registry group into distinct `hub` and `spokes` groups.
- Move current hub-related properties to the `hub` group and current spoke-related properties to the `spokes` group.
- Add bilingual labels for the new groups and remove the `subs` UI dependency.
- Add a codemod harness for later schema migrations, with no concept migration enabled in this EVO.
- Add documentation for how later data-schema EVOs must update scraping schema and workflow docs.
- Add focused tests proving the registry groups are valid and the codemod harness can run in dry-run mode.

### Excluded

- No promotion of any `other_specs` field.
- No changes to `wheelsData_*.js` schema or values.
- No new filter type, sort behavior, or comparator UI redesign.
- No scraping of new wheel data.

---

## Acceptance Criteria

- [x] `COLUMN_GROUPS` exposes `general`, `rims`, `hub`, and `spokes`; `subs` is no longer used by registry entries.
- [x] Existing hub fields (`hub`, `hubBrand`, `hubModel`, `axle`, `freehubOptions`, `discStandard`) appear under the Hub group in filters/columns where applicable.
- [x] Existing spoke fields (`spokes`, `spokesBrand`, `spokesModel`, `spokeMaterial`) appear under the Spokes group in filters/columns where applicable.
- [x] English and French translations contain labels for `properties.groups.hub` and `properties.groups.spokes`.
- [x] A reusable Node codemod harness exists for later PROJ-001 children and can dry-run against the wheel data modules without modifying files.
- [x] The scraping workflow documents the schema-update protocol inherited by every data-schema child EVO.
- [x] Baseline and regression Vitest summary runs are recorded.

---

## Functional Decisions

- The new group IDs are `hub` and `spokes`, matching the existing canonical sub-object names.
- The group split is presentational/registry-only; it must not change filtering, sorting, column visibility, or table rendering behavior.
- The codemod harness is introduced as infrastructure only. Later children add concept-specific migration modules or rules.
- Because this EVO does not promote a field, `wheel-format.json` should only receive protocol or harness references if useful; new schema fields start in EVO-048+.

---

## Technical Tasks

### Task 1: Split registry groups

**Files:** `MyBikeLab/frontend/src/config/wheelProperties.jsx`

**What to do:** Replace the `subs` group in `COLUMN_GROUPS` with `hub` and `spokes`. Update the hub-related property entries to `group: 'hub'` and the spoke-related entries to `group: 'spokes'`. Update the `WheelProperty.group` typedef comment to include the new group IDs.

**Validation:** Search confirms no `group: 'subs'` remains in `wheelProperties.jsx`; existing `FilterPanel` and `ColumnSelector` consumers still use `COLUMN_GROUPS` and need no behavioral rewrite.

### Task 2: Add group translations

**Files:** `MyBikeLab/frontend/public/locales/en.json`, `MyBikeLab/frontend/public/locales/fr.json`

**What to do:** Add `properties.groups.hub` and `properties.groups.spokes` labels. Remove or leave `properties.groups.subs` only if needed for backward compatibility; no active registry label should reference it.

**Validation:** Translation keys resolve in both locales and no UI path references `properties.groups.subs`.

### Task 3: Add registry group tests

**Files:** `MyBikeLab/frontend/src/config/__tests__/wheelProperties.groups.test.js`

**What to do:** Add tests asserting that every property group is declared in `COLUMN_GROUPS`, that no property uses `subs`, and that current hub/spoke property IDs are assigned to the expected new groups.

**Validation:** The new test fails against the old registry and passes after Task 1.

### Task 4: Create codemod harness

**Files:** `MyBikeLab/scripts/codemods/README.md`, `MyBikeLab/scripts/codemods/other-specs-promote.mjs`

**What to do:** Create a reusable Node script for PROJ-001 migrations. It should discover `frontend/src/data/wheelsData_*.js`, support dry-run mode by default, report files scanned and whether a concept migration changed anything, and expose a clear extension point for later concept-specific transformations. This EVO's default concept should be `foundation` or `noop` and must not write changes.

**Validation:** Running the harness in dry-run mode reports the wheel data modules and exits 0 without changing git diff.

### Task 5: Document scraping update protocol

**Files:** `workflows/datascraping/README.md`, `scripts/DatascrapingPrompt.md`

**What to do:** Add a compact section explaining that every PROJ-001 child promoting a schema field must update `wheel-format.json`, the scraping prompt, and the datascraping README in the same EVO. Document that future scraped data must write promoted fields into canonical sub-objects and remove source synonyms from `other_specs`.

**Validation:** The protocol is discoverable from the datascraping workflow and the prompt, without adding any field-specific schema for later children.

---

## Test Summary

### Baseline Vitest

- Command: `npm.cmd run test:summary`
- Result: Passed - 23 files, 279 tests
- Failed tests: None
- Notes: Baseline run before implementation.

### Regression Vitest

- Command: `npm.cmd run test:summary`
- Result: Passed - 24 files, 283 tests
- Failed tests: None
- Notes: Regression run after implementation. An intermediate run failed because `FilterPanel.test.jsx` still expected three groups; the test was updated to expect the new four-group split.

---

## Implementation Notes

### Task 1

- Replaced the legacy `subs` registry group with `hub` and `spokes`.
- Moved existing hub properties to `group: 'hub'` and existing spoke properties to `group: 'spokes'`.
- Updated the registry group typedef and section comment.

### Task 2

- Added English and French labels for `properties.groups.hub` and `properties.groups.spokes`.
- Removed the locale-level `properties.groups.subs` entries because no active registry label references them.

### Task 3

- Added `wheelProperties.groups.test.js` to verify group declaration coverage, absence of `subs`, and explicit hub/spoke assignment.
- Updated the existing FilterPanel accordion test to expect four non-empty groups instead of three.

### Task 4

- Added `scripts/codemods/other-specs-promote.mjs`.
- Added `scripts/codemods/README.md`.
- Verified `node scripts/codemods/other-specs-promote.mjs --concept foundation --dry-run` scans 19 wheel data modules and reports 0 changed files.

### Task 5

- Added the schema promotion protocol to `workflows/datascraping/README.md`.
- Added the canonical schema promotion rule to `scripts/DatascrapingPrompt.md`.
