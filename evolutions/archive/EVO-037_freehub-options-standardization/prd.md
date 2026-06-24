# PRD — Product Requirements Document

## 1. General Information

- Evolution ID: EVO-037
- Title: Freehub Options Standardization
- Author: Flavien Drouot
- Date: 2026-06-02
- Version: 1.0
- Needs Assessment reference: `needs-assessment.md`

---

## 2. Functional Objective

All `freehub_options` values across the catalog use a closed set of 6 canonical strings. Filtering by any freehub standard returns every compatible wheel, regardless of the brand file it originates from.

---

## 3. Target Behavior

### General description

The `freehub_options` field of every wheel in the catalog contains only values from the canonical set. No alias, abbreviation, or composite string is present. The freehub filter in the comparator produces complete, correct results for all 6 standards.

---

## 4. Functional Rules

### FR-001 — Closed canonical set

The only permitted values for `freehub_options` entries are:

| Canonical value | Absorbed aliases |
|---|---|
| `'Shimano HG'` | `'HG'`, `'Shimano HG 11-speed'`, `'Shimano HG 11/12-speed'`, `'Shimano HG Light'` |
| `'Shimano Micro Spline'` | `'Shimano MS'`, `'Microspline'` |
| `'SRAM XD'` | *(none — already consistent)* |
| `'SRAM XDR'` | `'XDR'`, `'SRAM XD-R'` |
| `'Campagnolo ED'` | `'Campagnolo'` |
| `'Campagnolo N3W'` | `'N3W'` |

No value outside this set is valid.

### FR-002 — No composite values

A single `freehub_options` entry must represent exactly one standard. Composite strings that bundle two standards (e.g. `'SRAM/Shimano Road'`) are prohibited. Such cases must be replaced by two separate entries in the array.

### FR-003 — Normalization documented in the datascraping workflow

The canonical set and alias mapping defined in FR-001, and the no-composite rule from FR-002, must be recorded in the datascraping workflow as a mandatory transformation step applied to all current and future brand files.

---

## 5. Detailed Use Cases

### UC-001 — Filter by Shimano HG

#### Preconditions
- The catalog contains wheels from Mavic, Roval, Zipp, and ENVE.
- At least one wheel from each brand is compatible with Shimano HG.

#### Steps
1. User opens the comparator.
2. User applies the freehub filter with value `'Shimano HG'`.

#### Expected result
- All wheels compatible with Shimano HG — regardless of origin brand — appear in the results.
- No Shimano HG–compatible wheel is absent from the results.

#### Error cases
- None anticipated.

### UC-002 — Filter by SRAM XDR (previously composite in Zipp)

#### Preconditions
- At least one Zipp wheel previously carried `'SRAM/Shimano Road'` in `freehub_options`.

#### Steps
1. User applies the freehub filter with value `'SRAM XDR'`.

#### Expected result
- Zipp wheels previously labeled `'SRAM/Shimano Road'` appear in the results.

#### Error cases
- None anticipated.

### UC-003 — Filter by Campagnolo ED

#### Preconditions
- At least one wheel previously carried the generic `'Campagnolo'` label.

#### Steps
1. User applies the freehub filter with value `'Campagnolo ED'`.

#### Expected result
- All wheels previously labeled `'Campagnolo'` (generic) appear in the results.

#### Error cases
- None anticipated.

---

## 6. Acceptance Criteria

### AC-001
#### Description
No alias value remains in any brand data file.
#### Expected verification
Search for `'HG'`, `'Shimano HG 11-speed'`, `'Shimano HG 11/12-speed'`, `'Shimano HG Light'`, `'Shimano MS'`, `'Microspline'`, `'XDR'`, `'SRAM XD-R'`, `'N3W'`, `'Campagnolo'` (standalone), `'SRAM/Shimano Road'` in `wheelsData_mavic.js`, `wheelsData_roval.js`, `wheelsData_zipp.js`, `wheelsData_enve.js` — none found.
#### Type
- Manual

### AC-002
#### Description
Every `freehub_options` entry in every brand file belongs to the canonical set.
#### Expected verification
All values in `freehub_options` arrays match one of: `'Shimano HG'`, `'Shimano Micro Spline'`, `'SRAM XD'`, `'SRAM XDR'`, `'Campagnolo ED'`, `'Campagnolo N3W'`.
#### Type
- Manual

### AC-003
#### Description
`'SRAM/Shimano Road'` is replaced by two separate entries.
#### Expected verification
Every Zipp wheel that previously carried `'SRAM/Shimano Road'` now carries both `'SRAM XDR'` and `'Shimano HG'` as separate entries in its `freehub_options` array.
#### Type
- Manual

### AC-004
#### Description
The datascraping workflow documents the normalization rule.
#### Expected verification
The canonical set and alias mapping are present in the datascraping workflow as a named transformation step.
#### Type
- Manual

### AC-005
#### Description
Filtering by `'Shimano HG'` returns all previously aliased wheels.
#### Expected verification
Apply the Shimano HG filter in the comparator — confirm all expected wheels are visible with no omission.
#### Type
- Manual

---

## 7. Functional Impacts

### Impacted components
- None — no UI or filter logic change required.

### Impacted data
- `src/data/wheelsData_mavic.js`
- `src/data/wheelsData_roval.js`
- `src/data/wheelsData_zipp.js`
- `src/data/wheelsData_enve.js`

### Impacted APIs
- None.

### Impacted permissions / roles
- None.

---

## 8. Out of Scope

- Filter UI or `wheelProperties.jsx` changes.
- Adding new freehub standards not present in the current catalog.
- Correcting raw scraping output in `scripts/data/`.
- Brands not yet scraped (DT Swiss, Fulcrum, Shimano, Campagnolo).

---

## 9. Constraints

- The 6 canonical values are fixed by this evolution. Introducing a new standard requires a separate evolution.
- The `multiSelectFlat` filter relies on exact string matching — data normalization alone is sufficient, no code change is needed.

---

## 10. Test Plan

### Automated tests expected
- None — this evolution touches only data files.

### Manual tests expected
- Apply each of the 6 freehub filters in the comparator and verify the result set is complete.
- Confirm no alias string remains in any of the 4 brand files.

### Edge cases
- Zipp wheels with the former composite `'SRAM/Shimano Road'` value — verify both `'SRAM XDR'` and `'Shimano HG'` are present and the wheel appears under both filters.

### Non-regression
- Wheels that already used canonical values are unaffected.
- Filter counts for standards that had no aliases (e.g. `'SRAM XD'`) are unchanged.
