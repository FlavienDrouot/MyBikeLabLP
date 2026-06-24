# Needs Assessment

## 1. General Information

- Evolution ID: EVO-033
- Title: Other-specs registry extension
- Author: Flavien Drouot
- Date: 2026-06-02
- Status: Draft
- Priority: Medium

---

## 2. Context

### Current situation

The wheel registry (`wheelProperties.jsx`) formalizes properties that are filterable, sortable, and displayable in the comparator. It currently covers top-level wheel fields (`weight_grams`, `rim.depth_mm`, etc.) and sub-component fields (`hub.brand`, `spokes.material`, etc.).

Each wheel entry also carries an `other_specs` object with additional technical properties that are currently invisible to the comparator: no filtering, no sorting, no column rendering. These properties are manually populated per brand (Mavic, Zipp, ENVE, Roval) and represent a significant portion of the structured data already in the dataset.

### Identified problem

9 properties appear across enough wheels in `other_specs` to be actionable filter/sort/display axes:

| Key in `other_specs` | Frequency | Note |
|---|---|---|
| `brake_type` | 100% | disc / rim / track |
| `tubeless_ready` | ~95% | boolean |
| `internal_width_mm` | ~95% | number |
| `axle_front_mm` | ~90% | string (e.g. '12x100') |
| `axle_rear_mm` | ~90% | string (e.g. '12x142') |
| `freehub_options` | ~90% | array of strings |
| `max_system_weight_kg` | ~90% | number |
| `wheelset_category` | ~80% | all-round / aero / climbing / endurance / all-road |
| `disc_standard` | all disc wheels | 'Center Lock' (normalized) |

These properties are not exploitable today despite being structured and present in the data.

Additionally, `disc_standard` has a casing inconsistency in the ENVE dataset: `'Centerlock'` instead of `'Center Lock'`. This must be corrected as part of this evolution.

### Business motivation

Exposing these properties as filterable axes directly increases the comparator's decision support value — particularly `brake_type`, `wheelset_category`, and `freehub_options`, which are primary purchase criteria for road cyclists (disc vs. rim, climbing vs. aero, drivetrain compatibility).

---

## 3. Business Objective

Enable users to filter and view road wheels by brake type, tubeless compatibility, wheelset category, axle standard, freehub compatibility, internal rim width, disc standard, and maximum system weight — all within the existing comparator UI, with no new infrastructure.

---

## 4. Scope

### Included

- Register 9 new properties in `wheelProperties.jsx` (accessors, filter specs, column specs)
- Introduce a new filter type `multiSelectFlat` to support array-valued properties (`freehub_options`)
- Update the selector layer (`wheelsSelectors.js`) to support `multiSelectFlat` matching, options extraction, and contextual counts
- Register `multiSelectFlat` in `FilterPanel.jsx`'s adapter map (same UI as `multiSelect`)
- Add translation keys for all 9 properties in `en.json`, `fr.json`, `xx.json`
- Add translatable value keys for `brakeType`, `tubelessReady`, `wheelsetCategory`
- Normalize `disc_standard` from `'Centerlock'` to `'Center Lock'` in `wheelsData_enve.js`

### Excluded

- Adding new `other_specs` properties not listed above
- Modifying existing properties already in the registry
- Data curation beyond the `disc_standard` normalization
- UI redesign of the filter panel or table
- Any backend or data pipeline work

---

## 5. Constraints

### Business constraints

- No new UI component introduced — `multiSelectFlat` reuses the existing `MultiSelectFilter` component
- All 9 properties hidden by default in the table, except `brakeType` and `wheelsetCategory`

### Known technical constraints

- `freehub_options` is an array: the existing `multiSelect` matcher (`filter.value.includes(value)`) cannot match against it — a new `multiSelectFlat` type is required
- `makeSelectOptionsFor` and `makeSelectContextualCountsFor` in `wheelsSelectors.js` must be updated to flatten array values for `multiSelectFlat` properties
- Wheels with `undefined`/`null` for a given property must be excluded from filter option lists; they pass all multiSelect and range filters by default (consistent with existing behavior for null rim depth on track wheels)

### Regulatory / security constraints

None.

---

## 6. Use Cases

### Nominal case

As a road cyclist,
I want to filter wheels by brake type (disc / rim), wheelset category (aero / climbing), and freehub compatibility (Shimano HG / SRAM XDR / Campagnolo N3W),
So that I can quickly narrow the catalog to wheels that are physically compatible with my bike and riding style.

### Alternative cases

- User filters by `axleFront` + `axleRear` to find wheels compatible with a specific frame standard
- User filters by `tubelessReady: true` to exclude non-tubeless wheels
- User sorts by `internalWidth` to find the widest (or narrowest) rims available
- User adds `brakeType` and `wheelsetCategory` columns to the table to compare at a glance

### Known error cases

- A wheel with no `other_specs.freehub_options` field (e.g. track wheels) is not excluded by a freehub filter — it passes by default
- A wheel with `disc_standard: undefined` does not appear in the disc standard filter option list

---

## 7. Acceptance Criteria

- [ ] `brakeType` filter renders as a multi-select with values `disc`, `rim`, `track` (translated); selecting one value correctly hides non-matching wheels
- [ ] `tubelessReady` filter renders as a triState; selecting `true` shows only tubeless-ready wheels, `false` shows only non-tubeless wheels
- [ ] `wheelsetCategory` filter renders as a multi-select; values match the distinct categories present in the dataset
- [ ] `internalWidth` filter renders as a dual range; bounds match the min/max values in the dataset; sort asc/desc works
- [ ] `axleFront` and `axleRear` filters render as multi-selects; values `'9x100'`, `'12x100'`, `'9x130'`, `'12x142'`, `'9x120'` are present (where applicable); `undefined` is not listed
- [ ] `discStandard` filter renders as a multi-select; only `'Center Lock'` appears (not `'Centerlock'`); ENVE wheels pass the filter when `'Center Lock'` is selected
- [ ] `maxSystemWeight` filter renders as a dual range; bounds match dataset values
- [ ] `freehubOptions` filter renders as a large multi-select (search box); selecting `'Campagnolo N3W'` shows only wheels that include that value in their `freehub_options` array; wheels with no `freehub_options` are not excluded by default
- [ ] `brakeType` and `wheelsetCategory` columns are visible by default in the comparison table; all other 7 new properties are hidden by default
- [ ] All new property labels and value translations are present and correct in `en.json` and `fr.json`; `xx.json` resolves all new translatable values to `"XX"`
- [ ] No existing filter, sort, or column is broken by the changes

---

## 8. Open Questions

None — all decisions resolved during the Needs Assessment interview.

---

## 9. Assumptions

- The `other_specs` object is always present on wheels that have values for these properties; optional chaining (`?.`) on access handles the rest
- Track wheels (Mavic IO, COMETE TRACK, ELLIPSE) intentionally have partial `other_specs` — this is valid data, not missing data
- `disc_standard` values beyond `'Center Lock'` (e.g. `'6-Bolt'`) may appear in future data; the multi-select filter handles them automatically without code changes
