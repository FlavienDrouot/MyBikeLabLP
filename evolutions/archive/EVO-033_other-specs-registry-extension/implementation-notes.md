# Implementation Notes — EVO-033

## TASK-001 — Normalize disc_standard in ENVE dataset

**File:** `frontend/src/data/wheelsData_enve.js`
All 6 occurrences of `disc_standard: 'Centerlock'` replaced with `disc_standard: 'Center Lock'` (entries id 44–49). Validation: 0 remaining `'Centerlock'` occurrences.

---

## TASK-002 — multiSelectFlat selector layer

**File:** `frontend/src/store/selectors/wheelsSelectors.js`
- Added `multiSelectFlat` matcher (null-pass + OR semantics on array elements)
- Updated `makeSelectOptionsFor` to flatten arrays for `multiSelectFlat` and filter null/undefined globally for all types
- Updated `makeSelectContextualCountsFor` to count per array element for `multiSelectFlat`

All 8 validation criteria passed. Existing `range`, `multiSelect`, `triState` paths untouched.

---

## TASK-003 — multiSelectFlat initial state in filtersSlice

**File:** `frontend/src/store/slices/filtersSlice.js`
Added `case 'multiSelectFlat': value = []; break;` after `case 'multiSelect'`. `resetFilters` correctly resets `multiSelectFlat` filters to `[]`.

---

## TASK-004 — FilterPanel adapter + translated option labels

**File:** `frontend/src/components/MiniComparator/FilterPanel.jsx`
- Added `multiSelectFlat: MultiSelectFilter` to `FILTER_ADAPTERS`
- Added `optLabel` logic in `MultiSelectFilter` and `LargeMultiSelectFilter`: uses `t(property.id + '.' + opt)` when `property.translatable === true`, falls back to `String(opt)` otherwise. Raw values preserved for state and comparisons.

---

## TASK-005 — Register 9 new properties in wheelProperties.jsx

**File:** `frontend/src/config/wheelProperties.jsx`
- Added `| {type: 'multiSelectFlat'}` to `FilterSpec` typedef
- Registered 9 new properties (in order): `brakeType`, `tubelessReady`, `internalWidth`, `axleFront`, `axleRear`, `freehubOptions`, `maxSystemWeight`, `wheelsetCategory`, `discStandard`
- `brakeType` and `wheelsetCategory` visible by default; all 7 others have `defaultVisible: false`
- `freehubOptions` uses `multiSelectFlat` + custom `renderCell` (array joined with `' / '`)
- `tubelessReady` uses `triState`
- `internalWidth` declares `internalWidth_asc` / `internalWidth_desc` sorts

Pre-existing test failure noted: `spokeMaterial.carbon` missing from `xx.json` — unrelated to this evolution.

---

## TASK-006 — Translation keys (en/fr/xx)

**Files:** `frontend/public/locales/en.json`, `fr.json`, `xx.json`
Added per locale:
- 9 property labels under `properties`
- `internalWidth_asc` / `internalWidth_desc` under `sorts`
- `filters.tubelessReady` (all / true / false)
- Top-level `brakeType`, `tubelessReady`, `wheelsetCategory` enum objects

All `xx.json` new values resolve to `"XX"`. No existing key modified.
