# TASK-001: Extend Catalog Variant Validation

## Objective

Extend frontend catalog validation so variant-modeling rules are checked automatically before data reaches comparator behavior.

## Required context

EVO-044 requires each documented purchasable variant to be represented as one top-level catalog object. `other_specs` must not carry comparable variant data when structured fields exist. Existing EVO-038 validation in `wheelValidator.js` must remain intact.

## Potentially impacted files

- `frontend/src/data/wheelValidator.js`
- `frontend/src/data/__tests__/wheelValidator.test.js`
- `frontend/src/data/__tests__/catalog.integration.test.js`
- `frontend/src/data/wheelsData_*.js`

## Inputs

- `prd.md`
- `spec-notes.md`
- Existing validator behavior for divergent specs
- Canonical schema in `workflows/datascraping/wheel-format.json`

## Expected outputs

- Validator warnings or failures for forbidden variant-like fields in `other_specs`, including spoke material, rim width options, brake type variants, per-variant weight, and per-variant price.
- Validator checks for `model_group` and `model_group_label` consistency.
- Tests proving existing EVO-038 divergent pair validation still works.
- Tests proving valid freehub option arrays do not trigger variant warnings.

## Constraints

- Do not reject legitimate non-comparable `other_specs` such as bearing type, nipples, rim construction, shipping, discount, usage, warranty, or source notes.
- Do not flag `hub.freehub_options` as variant data.
- Do not flag eligible front/rear pair-form fields: `weight_grams`, `rim.depth_mm`, `rim.externalWidth_mm`, `rim.internalWidth_mm`.
- Validation may warn instead of throwing if that matches the current validator style, but tests must assert the warning output.
- New validation logic must be deterministic and not depend on network access.

## Dependencies

none

## Validation criteria

- [ ] `validateWheelEntry` detects forbidden `other_specs.weight_carbon_spoke_grams`, `other_specs.carbon_spoke_option`, `other_specs.external_width_options_mm`, and comparable brake/rim/spoke variant notes.
- [ ] `validateWheelsCatalog(wheelsData)` returns zero warnings after TASK-002 migration.
- [ ] Entries with `model_group` have a non-empty `model_group_label`.
- [ ] A group with more than one sibling has consistent `brand` and `model_group_label`.
- [ ] Single-entry wheelsets without `model_group` pass validation.
- [ ] Freehub options alone do not create validation warnings.

## Tests to implement

### Unit

- Add validator tests for forbidden `other_specs` keys.
- Add validator tests for valid grouped siblings.
- Add validator tests for invalid grouped siblings.
- Keep or update existing divergent pair validator tests.

### Integration

- Add or update full catalog validation so the migrated catalog has zero warnings.
