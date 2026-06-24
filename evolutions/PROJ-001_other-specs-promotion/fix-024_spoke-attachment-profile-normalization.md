# Fix: Spoke attachment and profile normalization

- **ID:** fix-024
- **Date:** 2026-06-09
- **Status:** Done
- **Project:** PROJ-001 `other-specs-promotion`

---

## Context & Need

`spokes.type` and `spokes.profile` were promoted by EVO-050 as distinct spoke detail fields, but current Mavic and Caden data mixes attachment wording with profile wording. Mavic profile values such as `straight flat tapered` and `bent round` encode the spoke attachment, while Caden type values such as `captured carbon straight-pull aero` also include material and profile information. This matters because the comparator exposes these fields as filterable columns, so each field must carry one comparable concept.

---

## Acceptance Criteria

- [x] `spokes.type` only carries spoke attachment values, currently `straight-pull` or `j-bend`, for the affected Mavic, Caden, and ENVE rows.
- [x] Mavic `spokes.profile` values no longer include attachment words (`straight`, `bent`) when those words describe attachment rather than shape.
- [x] Caden carbon spoke rows keep `spokes.material = "carbon"` and use `spokes.type = "straight-pull"`; their captured attachment detail is preserved outside `spokes.type`.
- [x] The UI label for `spokeType` is renamed to Spoke attachment in English and French without renaming the internal field.
- [x] Scraping guidance states that `spokes.type` is the attachment/head type and profile/material words must not be mixed into it.

---

## Technical Tasks

### Task 1: Normalize catalog spoke attachment/profile data

**Files:** `frontend/src/data/wheelsData_caden.js`, `frontend/src/data/wheelsData_mavic.js`

**What to do:** Normalize Caden shared spoke constants so both steel and carbon variants use `type: 'straight-pull'`; keep steel/carbon in `material`; move `aero` to `profile`; preserve Caden captured-spoke attachment detail in `other_specs`. Normalize Mavic spoke profiles by extracting `straight` to `type: 'straight-pull'` and `bent` to `type: 'j-bend'`, leaving cleaned profile text such as `flat tapered`, `aero butted anti-rotation`, or `round`.

**Validation:** A catalog-level analysis shows no filled `spokes.type` values outside `straight-pull` and `j-bend`, and no `spokes.profile` values containing standalone `straight` or `bent`.

### Task 2: Rename the user-facing property label

**Files:** `frontend/public/locales/en.json`, `frontend/public/locales/fr.json`

**What to do:** Rename the `spokeType` display label to Spoke attachment / Attache du rayon while keeping the `spokeType` registry id and `spokes.type` schema field unchanged.

**Validation:** Locale files resolve the existing `properties.spokeType.label` key to the new wording.

### Task 3: Tighten scraping/schema guidance

**Files:** `workflows/datascraping/wheel-format.json`, `workflows/datascraping/README.md`, `MyBikeLab/scripts/DatascrapingPrompt.md`

**What to do:** Clarify that `spokes.type` means spoke attachment/head type and should contain values such as `straight-pull` or `j-bend`; shape/profile terms belong in `spokes.profile`, and material terms belong in `spokes.material`.

**Validation:** The scraping docs no longer describe `spokes.type` as open free text that may include profile or material wording.

---

## Test Summary

### Baseline Vitest

- Command:
- Command: `npm.cmd run test:summary`
- Result: Passed - 24 files, 326 tests
- Failed tests: None
- Notes: Baseline run before implementation.

### Regression Vitest

- Command: `npm.cmd run test:summary`
- Result: Passed - 24 files, 328 tests
- Failed tests: None
- Notes: Regression run after implementation and validation coverage additions.

---

## Implementation Notes

### Task 1

- Normalized Caden shared spoke constants to `type: 'straight-pull'`, `profile: 'aero'`, preserving steel/carbon in `spokes.material`.
- Normalized Mavic `straight ...` profiles into `type: 'straight-pull'` plus cleaned profile text, and `bent round` into `type: 'j-bend'`, `profile: 'round'`.
- Verified the loaded catalog has only `straight-pull` and `j-bend` as non-empty `spokes.type` values, and no profile with standalone `straight` or `bent`.

### Task 2

- Renamed the existing `spokeType` locale label to Spoke attachment / Attache du rayon without changing the internal registry id or schema field.

### Task 3

- Tightened scraping schema and prompt guidance so `spokes.type` is attachment/head type only.
- Added validator coverage for unsupported spoke attachment values and attachment words leaking into `spokes.profile`.
