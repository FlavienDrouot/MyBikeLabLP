# TASK-003: Registry — make the three axes filterable and sortable

## Objective

Ensure all three comparable axes (spoke material, rim width, brake type) are both filterable
and sortable from the central registry (AC-001). Spoke material and brake type are currently
filterable but have no `sorts`; add categorical sorts. Rim width (internal/external) is
already filterable and sortable — confirm only.

## Required context

- `src/config/wheelProperties.jsx` is the single source of truth. A property becomes sortable
  by adding a `sorts: [{ id, label, direction }]` array; `getAllSorts()` flattens them and the
  FilterPanel sort dropdown renders them. Categorical sorts use `direction: 'localeCompare'`
  (see the `model` property, which sorts by name via `localeCompare`).
- The sort comparator in `selectFilteredWheels` already handles `localeCompare` (stringifies
  both sides) and pushes missing values to the end — no selector change required.
- Existing axis properties:
  - `spokeMaterial` — `accessor: (w) => w.spokes.material`, `translatable: true`,
    `filter: { type: 'multiSelect' }`, no `sorts`.
  - `brakeType` — `accessor: (w) => w.brake_type`, `translatable: true`,
    `filter: { type: 'multiSelect' }`, no `sorts`.
  - `internalWidth` / `externalWidth` — `range` filter + `*_asc`/`*_desc` sorts (already
    complete).
- Sort labels are i18n keys resolved by the FilterPanel via `t()`; new keys
  (`sorts.spokeMaterial`, `sorts.brakeType`) are added to locales in TASK-006. Use those key
  strings here; the missing-key fallback is harmless until TASK-006 lands, so this task stays
  independently mergeable.

## Potentially impacted files

- `frontend/src/config/wheelProperties.jsx`
- `frontend/src/config/__tests__/wheelProperties.i18n.test.js` (only if a new assertion is
  added; no required change)
- a registry/sort unit test (existing `wheelsSelectors.test.js` or a registry test)

## Inputs

- The two axis property entries to extend.

## Expected outputs

- `spokeMaterial` gains `sorts: [{ id: 'spokeMaterial', label: 'sorts.spokeMaterial',
  direction: 'localeCompare' }]`.
- `brakeType` gains `sorts: [{ id: 'brakeType', label: 'sorts.brakeType', direction:
  'localeCompare' }]`.
- `getAllSorts()` now includes both new sort ids, each carrying the property accessor.

## Constraints

- Do not change the sort comparator or any selector — categorical `localeCompare` is already
  supported.
- Do not change column visibility or filter behavior of these properties.
- Keep the one-property-one-registry-entry discipline: no axis logic outside the registry.
- Categorical sort orders by the **raw** value (the accessor), consistent with the existing
  `model` sort; localized ordering is out of scope.

## Dependencies

none

## Validation criteria

- [ ] `getAllSorts()` returns entries with ids `spokeMaterial` and `brakeType`, each with a
      working accessor.
- [ ] Sorting the catalog by `spokeMaterial` and by `brakeType` orders configurations by their
      raw axis value (missing values last).
- [ ] Rim width (internal/external) sort + filter confirmed still present and unchanged.
- [ ] Full Vitest suite green; `npm run lint` clean.

## Tests to implement

### Unit
- Assert `getAllSorts()` includes `spokeMaterial` and `brakeType` with a defined accessor.
- Assert applying each new sort via `selectFilteredWheels` produces a `localeCompare`-ordered
  list and places missing/empty axis values at the end.

### Integration
- None beyond the sort assertions above.
