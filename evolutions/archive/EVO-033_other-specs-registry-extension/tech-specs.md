# Technical Specifications

## 1. General Information

- Evolution ID: EVO-033
- PRD reference: `MyBikeLab/evolutions/EVO-033_other-specs-registry-extension/prd.md`
- Author: Flavien Drouot
- Date: 2026-06-02

---

## 2. Technical Context

### Technical objective

Register 9 `other_specs` properties as first-class filterable, sortable, and column-displayable axes in the wheel comparator. Introduce a new `multiSelectFlat` filter type to support array-valued properties. Normalize one data inconsistency in the ENVE dataset. Add translations for all new labels and enumerated values.

### Affected architecture

- **Property registry** (`wheelProperties.jsx`): source of truth for all filter/sort/column definitions — the primary extension point
- **Filter state** (`filtersSlice.js`): dynamically generates Redux filter state from the registry — must recognize `multiSelectFlat`
- **Selector layer** (`wheelsSelectors.js`): implements matching, option extraction, and contextual counts — must handle `multiSelectFlat` array semantics
- **Filter panel** (`FilterPanel.jsx`): renders filters via an adapter map — must register `multiSelectFlat`
- **Wheel data** (`wheelsData_enve.js`): static data file — `disc_standard` fix
- **Locale files** (`en.json`, `fr.json`, `xx.json`): i18n — new keys for labels and enum values

### Impacted modules

| Module | File |
|---|---|
| Property registry | `frontend/src/config/wheelProperties.jsx` |
| Filter state slice | `frontend/src/store/slices/filtersSlice.js` |
| Wheel selectors | `frontend/src/store/selectors/wheelsSelectors.js` |
| Filter panel | `frontend/src/components/MiniComparator/FilterPanel.jsx` |
| ENVE data | `frontend/src/data/wheelsData_enve.js` |
| English locale | `frontend/public/locales/en.json` |
| French locale | `frontend/public/locales/fr.json` |
| Test locale | `frontend/public/locales/xx.json` |

---

## 3. Technical Constraints

- `multiSelectFlat` must reuse the existing `MultiSelectFilter` component — no new UI component introduced
- `brakeType` and `wheelsetCategory` must be visible by default in the table; all 7 other new properties must be hidden by default (`defaultVisible: false`)
- Wheels with `null`, `undefined`, or absent values for any new property must pass all filters (null-pass rule) — consistent with existing behavior for rim depth on track wheels
- The `freehubOptions` matcher checks for individual element membership in the array, not whole-array equality
- Optional chaining (`?.`) must be used in all accessors that read from `other_specs`
- No new UI components — the only new UI-visible change is the appearance of new filter controls and columns in the existing layout
- All 13 pre-existing filter axes must continue to behave identically after the evolution

---

## 4. Architecture Decisions

### AD-001 — Introduce `multiSelectFlat` as a first-class filter type

#### Description

A new filter type identifier `'multiSelectFlat'` is added alongside the existing `'multiSelect'`, `'triState'`, and `'range'` types. It appears in: the `FilterSpec` typedef, the `matchers` object in `wheelsSelectors.js`, the `buildInitialFilters` switch in `filtersSlice.js`, the option extraction logic in `makeSelectOptionsFor`, the contextual count logic in `makeSelectContextualCountsFor`, and the `FILTER_ADAPTERS` map in `FilterPanel.jsx`.

#### Motivation

A separate type identifier keeps every dispatch point explicit. Using a flag on `multiSelect` (e.g. `{ type: 'multiSelect', flat: true }`) would require every switch statement to additionally check the flag, obscuring intent and increasing the risk of missing a branch.

#### Rejected alternatives

- Flag-on-multiSelect: rejected for the reason above
- Handling array-valued properties with a special accessor that returns a canonical string: rejected because it would destroy the array structure needed for contextual count computation

---

### AD-002 — `multiSelectFlat` maps to `MultiSelectFilter` in the adapter map

#### Description

`FILTER_ADAPTERS['multiSelectFlat'] = MultiSelectFilter`. The `MultiSelectFilter` component auto-delegates to `LargeMultiSelectFilter` when `options.length > 10`, which covers `freehubOptions` naturally.

#### Motivation

The PRD explicitly prohibits new UI components. The existing component already handles large option lists via its internal delegation logic.

#### Rejected alternatives

- A standalone `MultiSelectFlatFilter` component: rejected (PRD constraint)

---

### AD-003 — All 9 new properties placed in the `general` group

#### Description

The `general` group is the only one that is open by default in the filter panel (index 0). Placing the new properties there maximizes discoverability without requiring user interaction to expand an accordion.

#### Motivation

`brake_type`, `wheelset_category`, `axle_front_mm`, etc. are top-level ride characteristics, not rim geometry (`rims` group) or subcomponent attributes (`subs` group).

#### Rejected alternatives

- Splitting across groups: rejected because `brake_type` and `wheelset_category` do not naturally belong to `rims` or `subs`, and mixing would require a fourth group or arbitrary assignment

---

### AD-004 — Null filtering in `makeSelectOptionsFor` applied globally

#### Description

`makeSelectOptionsFor` is updated to filter out `null` and `undefined` values before deduplication, for all property types. For `multiSelectFlat`, the array values are flattened and deduplicated instead.

#### Motivation

Without null filtering, a partially-populated property (e.g. `wheelset_category` absent on track wheels) would produce a `"undefined"` option in the filter list. This is a pre-existing gap that the new properties would expose.

#### Rejected alternatives

- Filtering nulls only for new properties: rejected because the same gap exists for any future partially-populated property; the global fix is cleaner and backward-compatible

---

### AD-005 — Translation of option labels within `MultiSelectFilter`

#### Description

`MultiSelectFilter` (and `LargeMultiSelectFilter`) currently renders `String(opt)` as the display label for each option. For properties with `translatable: true`, the label must be `t(propertyId + '.' + opt)`. The component receives `property` as a prop (already), so `property.translatable` and `property.id` are available. The rendering function branches on `property.translatable`.

#### Motivation

`brakeType` and `wheelsetCategory` are `translatable: true` and require translated labels in their filter pills. The fix also benefits existing translatable multiSelect properties (`rimMaterial`, `spokeMaterial`).

#### Rejected alternatives

- Pre-translating in the selector: rejected because `t()` is a React hook and cannot be called in Redux selectors
- Custom `renderCell` per property: rejected because the translation need is uniform across all translatable multiSelect properties

---

## 5. Task Breakdown

Each task is described in a dedicated file using `shared-knowledge/templates/TASK-TEMPLATE.md`.

| Task | File | Summary | Dependencies |
|------|------|---------|--------------|
| TASK-001 | `TASK-001.md` | Normalize `disc_standard` in ENVE dataset (`'Centerlock'` → `'Center Lock'`) | none |
| TASK-002 | `TASK-002.md` | Add `multiSelectFlat` matcher, fix null option filtering, add flat option extraction and contextual counts in `wheelsSelectors.js` | none |
| TASK-003 | `TASK-003.md` | Add `multiSelectFlat` initial state case in `filtersSlice.js` | none |
| TASK-004 | `TASK-004.md` | Register `multiSelectFlat` in `FilterPanel.jsx` adapter map and add translated option label rendering in `MultiSelectFilter` | TASK-002, TASK-003 |
| TASK-005 | `TASK-005.md` | Register 9 new `other_specs` properties in `wheelProperties.jsx` | TASK-002 |
| TASK-006 | `TASK-006.md` | Add all new translation keys to `en.json`, `fr.json`, and `xx.json` | TASK-005 |

Dependency graph:

```
TASK-001  (standalone — data fix)
TASK-002  (standalone — selector layer)
TASK-003  (standalone — slice layer)
  └─ TASK-004 (depends on TASK-002, TASK-003)
TASK-002
  └─ TASK-005 (depends on TASK-002 — registry uses multiSelectFlat type)
      └─ TASK-006 (depends on TASK-005 — keys derived from registry entries)
```

TASK-001, TASK-002, and TASK-003 can be developed in parallel. TASK-004 requires TASK-002 and TASK-003 to be complete (the adapter and slice must recognize `multiSelectFlat`). TASK-005 requires TASK-002 (the selector must support `multiSelectFlat` before the registry declares it). TASK-006 requires TASK-005 (the registry defines which property ids and enum namespaces need translation keys).

---

## 6. Global Validation Strategy

### Unit validation

No automated tests are introduced (the codebase has no current test suite for these modules beyond `wheelProperties.i18n.test.js`). All validation is manual.

### Integration validation

- Load the comparator; confirm no console errors and all pre-existing filters still work
- Confirm the 9 new filter controls are visible in the filter panel under the `general` section
- Confirm `brakeType` and `wheelsetCategory` columns are visible in the table without any user action

### Functional validation

Per the PRD acceptance criteria AC-001 through AC-011 — see `prd.md` section 6.

### Non-regression validation

- Apply each of the 13 pre-existing filters (brand, weight, price, diameter, rim material, hookless, depth, rim width, hub brand, hub model, spokes brand, spokes model, spoke material) and verify results are unchanged
- Verify default column visibility for all pre-existing columns is unchanged
- Verify existing translation keys are unaffected (no key removed or overwritten)

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|---|---|---|
| `makeSelectOptionsFor` change breaks existing multiSelect option lists | Medium — existing filters could produce wrong options or lose options | Fix is backward-compatible: null filtering is additive; the `multiSelectFlat` branch only activates for new properties. Validate brand, rim material, spoke material filter options after the change. |
| `MultiSelectFilter` option label translation breaks non-translatable properties | Medium — raw translation key shown instead of value | Branch on `property.translatable` before calling `t()`; fall back to `String(opt)` when `false`. |
| Missed ENVE entries for `disc_standard` fix | Low — `'Centerlock'` still appears in filter | All 6 ENVE wheel entries are in a single file (`wheelsData_enve.js`); a global replace covers them. |
| New properties in `general` group make the filter panel long | Low — UX degradation | The existing accordion structure already handles this; the `general` section is scrollable. No structural change needed. |

---

## 8. Rollback Plan

- All changes are confined to static files (config, selectors, slice, data, locales). No API or database is affected.
- TASK-001 (data fix) is the only change with a permanent data effect; it is a single-file find-replace, reversible by reverting the file.
- TASK-005 (registry) is additive only — removing the 9 new entries restores the previous behavior exactly.
- TASK-002 and TASK-003 add new branches to existing switch/condition structures; removing them restores prior behavior.
- TASK-006 is additive to locale files; removing added keys has no visible effect on existing translations.
