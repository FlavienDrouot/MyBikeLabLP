# PRD — Product Requirements Document

## 1. General Information

- Evolution ID: EVO-033
- Title: Other-specs registry extension
- Author: Flavien Drouot
- Date: 2026-06-02
- Version: 1.0
- Needs Assessment reference: `MyBikeLab/evolutions/EVO-033_other-specs-registry-extension/needs-assessment.md`

---

## 2. Functional Objective

After this evolution, the wheel comparator exposes 9 properties currently stored in the `other_specs` object of each wheel entry as first-class filterable, sortable, and column-displayable axes — within the existing comparator UI and without any new UI components. A data normalization fix is included: the `disc_standard` value `'Centerlock'` in the ENVE dataset is corrected to `'Center Lock'`.

---

## 3. Target Behavior

### General description

A user opening the comparator sees two new columns visible by default (`brakeType`, `wheelsetCategory`) alongside the existing default columns. All 9 new properties appear as optional columns and as filter controls in the filter panel. The 7 remaining new properties (`tubelessReady`, `internalWidth`, `axleFront`, `axleRear`, `discStandard`, `maxSystemWeight`, `freehubOptions`) are hidden by default but can be activated via the column visibility control.

Filtering behavior is consistent with existing properties: wheels with no value for a given property pass all filters that target that property. The `freehubOptions` filter matches any wheel whose `freehub_options` array contains the selected value — it is not a whole-array equality match.

All labels and enumerated values for the 9 new properties are translated in English, French, and the test locale (xx).

---

## 4. Functional Rules

### FR-001 — Registry registration of 9 other_specs properties

The wheel property registry must define the following 9 properties, each with an accessor that reads from `other_specs`, a filter specification, and a column specification:

| Property key | Source field | Filter type | Column visible by default |
|---|---|---|---|
| `brakeType` | `other_specs.brake_type` | multiSelect | Yes |
| `tubelessReady` | `other_specs.tubeless_ready` | triState | No |
| `internalWidth` | `other_specs.internal_width_mm` | range | No |
| `axleFront` | `other_specs.axle_front_mm` | multiSelect | No |
| `axleRear` | `other_specs.axle_rear_mm` | multiSelect | No |
| `freehubOptions` | `other_specs.freehub_options` | multiSelectFlat | No |
| `maxSystemWeight` | `other_specs.max_system_weight_kg` | range | No |
| `wheelsetCategory` | `other_specs.wheelset_category` | multiSelect | Yes |
| `discStandard` | `other_specs.disc_standard` | multiSelect | No |

### FR-002 — multiSelectFlat filter type

A new filter type `multiSelectFlat` must be introduced to support properties whose values are arrays of strings (specifically `freehubOptions`). The matching rule is: a wheel passes the filter if its value array contains at least one of the selected filter values. Wheels with a `null`, `undefined`, or absent value for the property pass the filter regardless of the selected values (consistent with existing null-pass behavior).

### FR-003 — Filter option extraction for multiSelectFlat

For `multiSelectFlat` properties, the system must derive the list of available filter options by flattening all per-wheel arrays and deduplicating the results. Wheels with no value for the property must not contribute entries to the option list.

### FR-004 — Contextual counts for multiSelectFlat

For `multiSelectFlat` properties, contextual counts (number of wheels matching each option given the current active filters) must be computed by treating each element of the array as an individual matchable value. A wheel is counted for a given option if its array contains that option.

### FR-005 — multiSelectFlat rendered as MultiSelect in the filter panel

In the filter panel, the `multiSelectFlat` filter type must be rendered using the same UI component as `multiSelect` (MultiSelectFilter). No new UI component is introduced.

### FR-006 — Null-pass behavior for all new properties

Wheels with `null`, `undefined`, or absent values for any of the 9 new properties must pass all filter types (multiSelect, triState, range, multiSelectFlat) without being excluded. This is consistent with the existing behavior for properties such as rim depth on track wheels.

### FR-007 — disc_standard data normalization

The string `'Centerlock'` in the ENVE dataset must be replaced with `'Center Lock'` so that all wheels using a center-lock standard share a single normalized value. After this fix, a user selecting `'Center Lock'` in the `discStandard` filter must see ENVE disc wheels in the results.

### FR-008 — Translations for all new properties

Translation keys must be added for:
- The label of each of the 9 new properties, in `en.json`, `fr.json`, and `xx.json`
- The enumerated values of `brakeType` (`disc`, `rim`, `track`), `tubelessReady` (`true`, `false`), and `wheelsetCategory` (all distinct values present in the dataset), in `en.json`, `fr.json`, and `xx.json`

In `xx.json`, every new translatable value must resolve to the string `"XX"`.

---

## 5. Detailed Use Cases

### UC-001 — Filter by brake type

#### Preconditions
- The comparator is loaded with the full wheel dataset.
- The `brakeType` filter is visible in the filter panel.

#### Steps
1. User opens the filter panel.
2. User selects `disc` in the `brakeType` multi-select filter.
3. The comparator updates the wheel list.

#### Expected result
- Only wheels with `other_specs.brake_type === 'disc'` are shown.
- Wheels with no `brake_type` value are not excluded.
- The `brakeType` column (visible by default) shows the value for each wheel.

#### Error cases
- No wheels match: the table shows an empty state (existing behavior).

---

### UC-002 — Filter by freehub compatibility

#### Preconditions
- The comparator is loaded with the full wheel dataset.
- The `freehubOptions` filter is visible in the filter panel.

#### Steps
1. User opens the filter panel.
2. User selects `'Campagnolo N3W'` in the `freehubOptions` multi-select filter.
3. The comparator updates the wheel list.

#### Expected result
- Only wheels whose `other_specs.freehub_options` array contains `'Campagnolo N3W'` are shown.
- Wheels with no `freehub_options` value (e.g. track wheels) are not excluded.
- A wheel compatible with both `'Campagnolo N3W'` and `'Shimano HG'` appears in the results.

#### Error cases
- None specific — existing empty-state behavior applies if no wheels match.

---

### UC-003 — Filter by axle standard (front + rear combined)

#### Preconditions
- The comparator is loaded.
- `axleFront` and `axleRear` filters are accessible.

#### Steps
1. User selects `'12x100'` in `axleFront` filter.
2. User selects `'12x142'` in `axleRear` filter.

#### Expected result
- Only wheels matching both axle standards simultaneously are shown.
- Wheels with undefined axle values are not excluded by either filter.

#### Error cases
- None specific.

---

### UC-004 — Sort and compare by internal rim width

#### Preconditions
- The comparator is loaded.
- `internalWidth` column is made visible by the user via column visibility control.

#### Steps
1. User enables the `internalWidth` column.
2. User clicks the `internalWidth` column header to sort ascending.

#### Expected result
- Wheels are ordered from narrowest to widest internal rim width.
- Wheels with no `internal_width_mm` value appear at the end (or consistently with existing sort behavior for nulls).

#### Error cases
- None specific.

---

### UC-005 — disc_standard filter shows normalized values only

#### Preconditions
- The comparator is loaded with the full dataset including ENVE wheels.

#### Steps
1. User opens the filter panel.
2. User opens the `discStandard` multi-select filter.

#### Expected result
- The option list contains `'Center Lock'` and does not contain `'Centerlock'`.
- Selecting `'Center Lock'` shows ENVE disc wheels in the results.

#### Error cases
- None specific.

---

## 6. Acceptance Criteria

### AC-001
#### Description
`brakeType` filter renders as a multi-select with translated values for `disc`, `rim`, and `track`. Selecting `disc` hides all non-disc wheels from the results.
#### Expected verification
Apply the `disc` filter. Confirm that all visible wheels have `other_specs.brake_type === 'disc'` and no wheel with `rim` or `track` is visible.
#### Type
- Manual

---

### AC-002
#### Description
`tubelessReady` filter renders as a triState control. Selecting `true` shows only tubeless-ready wheels; selecting `false` shows only non-tubeless wheels; selecting the neutral state shows all wheels.
#### Expected verification
Cycle through the three states and verify the wheel list changes accordingly each time.
#### Type
- Manual

---

### AC-003
#### Description
`wheelsetCategory` filter renders as a multi-select. The available options match the distinct category values present in the dataset (e.g. `all-round`, `aero`, `climbing`, `endurance`, `all-road`). Selecting one or more values correctly restricts the list.
#### Expected verification
Open the filter, verify option list, select `aero`, confirm only aero wheels are shown.
#### Type
- Manual

---

### AC-004
#### Description
`internalWidth` filter renders as a dual-range slider. The bounds match the minimum and maximum `internal_width_mm` values in the dataset. Sorting the `internalWidth` column ascending and descending produces correct ordering.
#### Expected verification
Check that the slider lower and upper bounds equal the actual min/max values in the data. Sort the column and verify the sequence.
#### Type
- Manual

---

### AC-005
#### Description
`axleFront` and `axleRear` filters each render as a multi-select. Known values (`'9x100'`, `'12x100'`, `'9x130'`, `'12x142'`, `'9x120'`) appear where present in the data. `undefined` is not listed as an option.
#### Expected verification
Open each filter and inspect the option list. Confirm no `undefined` or `null` entry is present.
#### Type
- Manual

---

### AC-006
#### Description
`discStandard` filter renders as a multi-select. The option `'Centerlock'` does not appear. Only `'Center Lock'` is listed. ENVE disc wheels appear in the results when `'Center Lock'` is selected.
#### Expected verification
Open the filter, verify the option list, select `'Center Lock'`, confirm ENVE disc wheels are visible.
#### Type
- Manual

---

### AC-007
#### Description
`maxSystemWeight` filter renders as a dual-range slider. The bounds match the min/max `max_system_weight_kg` values in the dataset.
#### Expected verification
Check slider bounds against actual data min/max.
#### Type
- Manual

---

### AC-008
#### Description
`freehubOptions` filter renders as a multi-select (with search box for large lists). Selecting `'Campagnolo N3W'` shows only wheels whose `freehub_options` array contains that value. Wheels with no `freehub_options` are not excluded.
#### Expected verification
Select `'Campagnolo N3W'`. Verify matching wheels are shown. Verify track wheels (no freehub) remain visible.
#### Type
- Manual

---

### AC-009
#### Description
`brakeType` and `wheelsetCategory` columns are visible by default in the comparison table without any user action. All other 7 new properties are hidden by default.
#### Expected verification
Load the comparator without changing any settings. Confirm `brakeType` and `wheelsetCategory` columns are present. Confirm the other 7 are absent until activated.
#### Type
- Manual

---

### AC-010
#### Description
All 9 new property labels and all translatable value keys are present and correct in `en.json`, `fr.json`, and `xx.json`. In `xx.json`, every new key resolves to `"XX"`.
#### Expected verification
Switch the UI language to English, French, and the test locale. Verify labels and filter option labels display correctly in each language with no raw key fallbacks.
#### Type
- Manual

---

### AC-011
#### Description
No existing filter, sort, or column is broken by the changes. The 13 pre-existing filter axes behave identically to before the evolution.
#### Expected verification
Apply a representative set of existing filters (brand, weight, rim depth, hookless, spoke material) and confirm the results are unchanged.
#### Type
- Manual

---

## 7. Functional Impacts

### Impacted components

- `wheelProperties.jsx` — 9 new property definitions added
- `wheelsSelectors.js` — `multiSelectFlat` matching logic, option extraction, and contextual count computation added
- `FilterPanel.jsx` — `multiSelectFlat` registered in the adapter map, mapped to the existing `MultiSelectFilter` component
- `wheelsData_enve.js` — `disc_standard` value corrected from `'Centerlock'` to `'Center Lock'`
- `en.json`, `fr.json`, `xx.json` — new translation keys for property labels and enumerated values

### Impacted data

- All wheel entries that have an `other_specs` object are affected by the addition of the new filter axes; no wheel data is modified except the ENVE `disc_standard` normalization.
- The accessor for each new property reads from `other_specs` using optional chaining; no structural change to the wheel data schema is required.

### Impacted APIs

None — the product has no backend API. All data is static.

### Impacted permissions / roles

None.

---

## 8. Out of Scope

- Adding `other_specs` properties beyond the 9 listed in this evolution
- Modifying any property already registered in the wheel registry
- Data curation beyond the `disc_standard` normalization in the ENVE dataset
- UI redesign of the filter panel, column selector, or comparison table
- Any backend, data pipeline, or real-time data source work
- New UI components (the `multiSelectFlat` type reuses the existing `MultiSelectFilter` component)

---

## 9. Constraints

- `multiSelectFlat` must reuse the existing `MultiSelectFilter` UI component — no new component is introduced.
- `brakeType` and `wheelsetCategory` must be visible by default; all other 7 new properties must be hidden by default.
- Wheels with `null`, `undefined`, or absent values for a given new property must pass all filters targeting that property (null-pass rule, consistent with existing behavior).
- The `freehubOptions` filter matches on individual array element membership, not whole-array equality.
- Track wheels (Mavic IO, COMETE TRACK, ELLIPSE) intentionally carry partial `other_specs`; their missing values are valid data, not errors.

---

## 10. Test Plan

### Automated tests expected

None required for this evolution — the codebase does not currently include automated tests, and the functional rules introduced (registry entries, filter matching, translations) are fully verifiable through manual testing.

### Manual tests expected

- Apply each of the 9 new filters individually and verify the wheel list responds correctly.
- Combine multiple new filters and verify the intersection behavior is correct.
- Toggle `brakeType` and `wheelsetCategory` columns: confirm they appear by default; toggle the other 7: confirm they are hidden by default.
- Switch language to French and verify all new labels and values are translated.
- Switch language to the test locale (xx) and verify all new keys resolve to `"XX"`.
- Verify the ENVE `disc_standard` fix: `'Centerlock'` must not appear anywhere in the UI.

### Edge cases

- Track wheels (no `freehub_options`, partial `other_specs`): must pass all new filters without being excluded.
- Wheels with `disc_standard: undefined` (rim-brake wheels): must not appear in the `discStandard` filter option list, and must pass the filter regardless.
- A wheel with a `freehub_options` array containing a single element: selecting that element in the filter must include the wheel; selecting any other element must not.
- Applying a `range` filter (e.g. `internalWidth`) to a wheel with no value: the wheel must pass the filter.

### Non-regression

- All 13 pre-existing filterable properties (brand, weight, price, diameter, rim material, hookless, rim depth, rim width, hub brand, hub model, spokes brand, spokes model, spoke material) must behave identically before and after the evolution.
- Default column visibility for all pre-existing columns must be unchanged.
- Existing translations must be unaffected — only new keys are added.
