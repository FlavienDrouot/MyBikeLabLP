# Light EVO: Warranty promotion

- **ID:** EVO-053
- **Date:** 2026-06-08
- **Status:** Done
- **Priority:** High
- **Project:** PROJ-001 `other-specs-promotion`

---

## Context & Need

`PROJ-001` promotes recurring `other_specs` keys into the canonical wheel schema. EVO-053 promotes warranty information, currently stored as `other_specs.warranty` and `other_specs.warranty_years`, into a stable top-level `warranty` object.

Warranty is useful comparison context for cyclists and is already recurrent across the catalog. Keeping it in `other_specs` prevents the registry, filters, columns, detail panel, and future scraping process from relying on a clean schema.

---

## Scope

### Included

- Add top-level `warranty: { text, years }` to the canonical wheel schema.
- Add a `warrantyYears` registry property with a range filter and hidden-by-default optional column.
- Add English and French labels and sort labels for the new property.
- Migrate all `frontend/src/data/wheelsData_*.js` modules so `other_specs.warranty` and `other_specs.warranty_years` move into `warranty`.
- Extend the PROJ-001 codemod harness with an EVO-053 `warranty` concept migration.
- Update scraping guidance so future scrapes write warranty information directly into `warranty`.

### Excluded

- Do not scrape new warranty data.
- Do not infer warranty duration when the source text does not contain a clear year count.
- Do not invent a numeric duration for lifetime warranties; keep `years: null` and preserve the source text.
- Do not promote certification fields; they belong to EVO-054.

---

## Acceptance Criteria

- [ ] `warranty` is documented in the canonical scraping schema.
- [ ] `wheelProperties.jsx` exposes a `warrantyYears` property with a range filter, sorts, and optional column.
- [ ] English and French locales contain labels for the new property and its sorts.
- [ ] All consumed warranty source keys are migrated across every `wheelsData_*.js` module.
- [ ] No migrated wheel keeps `warranty` or `warranty_years` in `other_specs`.
- [ ] The codemod can dry-run and write the `warranty` migration.
- [ ] The scraping prompt and datascraping README state that warranty text/duration belongs in the canonical `warranty` object.
- [ ] Baseline and regression Vitest summary runs are recorded.

---

## Functional Decisions

- `warranty.text` preserves the original source wording, including qualifiers such as registration requirements or limited lifetime wording.
- `warranty.years` stores a numeric year count only when explicitly sourced or parseable from clear text such as `2 years`.
- Lifetime warranty text maps to `years: null`; the original lifetime wording stays in `warranty.text`.
- Empty strings are normalized to `null`.
- Registry property ID is `warrantyYears`.
- The source keys consumed by this EVO are exactly `warranty` and `warranty_years`.
- `warranty` is top-level because it applies to the product/wheelset, not specifically to rim, hub, or spokes.

---

## Technical Tasks

### Task 1: Extend warranty schema and scraping docs

**Files:** `workflows/datascraping/wheel-format.json`, `MyBikeLab_Evo-053/scripts/DatascrapingPrompt.md`, `workflows/datascraping/README.md`

**What to do:** Add top-level `warranty` to `wheel-format.json`. Update scraping guidance so source warranty text and year counts are emitted as `warranty.text` and `warranty.years`, not as `other_specs.warranty` or `other_specs.warranty_years`.

**Validation:** Search confirms future-facing docs mention `warranty.text` / `warranty.years` and no longer show consumed warranty keys as `other_specs` examples.

### Task 2: Add registry property and translations

**Files:** `MyBikeLab_Evo-053/frontend/src/config/wheelProperties.jsx`, `MyBikeLab_Evo-053/frontend/public/locales/en.json`, `MyBikeLab_Evo-053/frontend/public/locales/fr.json`

**What to do:** Add `warrantyYears` with accessor `w.warranty?.years ?? null`, range filter, ascending/descending sorts, and hidden-by-default column rendering `warranty.text` when present. Add EN/FR labels and sort labels.

**Validation:** Registry/i18n tests cover the new property and labels.

### Task 3: Add the warranty codemod

**Files:** `MyBikeLab_Evo-053/scripts/codemods/other-specs-promote.mjs`, `MyBikeLab_Evo-053/scripts/codemods/README.md`

**What to do:** Add a `warranty` migration concept that reads `other_specs.warranty` and `other_specs.warranty_years`, writes top-level `warranty: { text, years }`, parses clear year counts from text, keeps lifetime as `years: null`, and removes consumed source keys.

**Validation:** `node scripts/codemods/other-specs-promote.mjs --concept warranty --dry-run` reports changed files before writing, and `--write` removes consumed keys.

### Task 4: Migrate wheel data

**Files:** `MyBikeLab_Evo-053/frontend/src/data/wheelsData_*.js`

**What to do:** Run the EVO-053 codemod in write mode and inspect the resulting diff. Manually adjust helper-based data if shared constants still emit consumed warranty keys after the codemod.

**Validation:** `rg "warranty_years|warranty:" frontend/src/data` shows canonical `warranty` objects and no consumed source keys inside `other_specs`.

### Task 5: Add regression coverage

**Files:** `MyBikeLab_Evo-053/frontend/src/config/__tests__/wheelProperties.groups.test.js`, `MyBikeLab_Evo-053/frontend/src/data/wheelValidator.js`, `MyBikeLab_Evo-053/frontend/src/data/__tests__/wheelValidator.test.js`

**What to do:** Extend registry tests for `warrantyYears`. Extend data validation so `other_specs.warranty` and `other_specs.warranty_years` are rejected. Add focused validator coverage.

**Validation:** Vitest summary passes after implementation.

---

## Test Summary

### Baseline Vitest

- Command: `npm.cmd run test:summary`
- Result: Passed - 24 files, 293 tests
- Failed tests: None
- Notes: Baseline run after resolving pre-existing EVO-051/EVO-052 merge conflicts in the worktree and creating a local `frontend/node_modules` junction to the existing product dependencies.

### Regression Vitest

- Command: `npm.cmd run test:summary`
- Result: Passed - 24 files, 295 tests
- Failed tests: None
- Notes: Regression run after warranty registry, migration, docs, and validation updates.

---

## Implementation Notes

### Task 1

- Added top-level `warranty` to `workflows/datascraping/wheel-format.json`.
- Updated the scraping prompt and datascraping README to direct warranty text and duration into `warranty.text` / `warranty.years`.

### Task 2

- Added `warrantyYears` to the registry with a range filter, sorts, and hidden-by-default column rendering source warranty text when available.
- Added English and French labels and sort labels.

### Task 3

- Added the `warranty` concept to `scripts/codemods/other-specs-promote.mjs`.
- Documented dry-run and write commands in the codemod README.

### Task 4

- Ran the warranty codemod in write mode.
- Migrated warranty source keys from `other_specs` into top-level `warranty` objects.
- Manually adjusted Arcaris and OVERFAST helper-based data so shared constants no longer emit `other_specs.warranty`.
- Verified the migration is idempotent after writing (`Changed files: 0` on dry-run).

### Task 5

- Extended registry group tests for `warrantyYears`.
- Extended wheel validator coverage so `other_specs.warranty` and `other_specs.warranty_years` are rejected.
