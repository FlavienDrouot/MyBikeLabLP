# TASK-004: Prove Variant Entry Filter And Sort Behavior

## Objective

Add automated tests proving that variant entries filter, sort, and remain visible as independent comparator entries.

## Required context

The core selector path is `selectFilteredWheels`, driven by `WHEEL_PROPERTIES`. Brake type, spoke material, external rim width, and internal rim width already exist as filterable fields. This task verifies behavior with explicit variant fixtures and the migrated catalog.

## Potentially impacted files

- `frontend/src/store/selectors/__tests__/wheelsSelectors.test.js`
- `frontend/src/data/__tests__/catalog.integration.test.js`
- `frontend/src/config/__tests__/wheelProperties.accessor.test.js`
- `frontend/src/config/__tests__/wheelProperties.renderCell.test.jsx`

## Inputs

- `prd.md`
- `spec-notes.md`
- Migrated catalog from TASK-002
- Existing selector tests

## Expected outputs

- Tests for spoke material filtering at entry level.
- Tests for rim width filtering and sorting at entry level.
- Tests for brake type filtering at entry level.
- Tests proving freehub options do not duplicate entries.
- Tests proving front/rear divergent specs remain one entry.
- Tests proving missing price or weight does not hide documented variants and renders as unavailable where applicable.

## Constraints

- Use small selector fixtures for behavioral tests, not only the full catalog.
- Do not rely on exact full-catalog row counts except where the assertion is specifically about a known migrated group.
- Keep existing null-pass range semantics unless a separate product decision changes them.
- Preserve current sort behavior where missing values sort to the end.

## Dependencies

TASK-001, TASK-002

## Validation criteria

- [ ] Filtering by `spokeMaterial` includes only matching sibling variants when the filter is active.
- [ ] Filtering by `externalWidth` or `internalWidth` distinguishes sibling variants.
- [ ] Filtering by `brakeType` distinguishes sibling variants.
- [ ] Sorting by rim width orders sibling variants by their own values.
- [ ] Sorting by price or weight places missing values at the end and keeps entries visible before filtering.
- [ ] A fixture with multiple `hub.freehub_options` remains a single comparator entry.
- [ ] A fixture with front/rear divergent dimensions remains a single comparator entry.

## Tests to implement

### Unit

- Add selector fixture tests for all automated PRD acceptance criteria.
- Add property accessor/render tests for unavailable price or weight if not already covered.

### Integration

- Add full-catalog assertions for migrated Caden variant groups and non-regression of existing brands.
