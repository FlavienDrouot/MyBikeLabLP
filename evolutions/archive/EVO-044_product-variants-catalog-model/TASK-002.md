# TASK-002: Migrate Caden Catalog Variants

## Objective

Rewrite Caden catalog entries so documented purchasable variants for spoke material, rim width, and brake type are represented as first-class flat comparator entries.

## Required context

Caden is the proving case for EVO-044. Current Caden data uses IDs 129-137 and contains variant-like information inside `other_specs`, including carbon spoke options, carbon-spoke weights, and 50 mm external-width options. New exploded variant entries must use IDs 200+.

## Potentially impacted files

- `frontend/src/data/wheelsData_caden.js`
- `frontend/src/data/wheelsData.js`
- `frontend/src/data/__tests__/catalog.integration.test.js`
- `frontend/src/data/__tests__/wheelValidator.test.js`

## Inputs

- `prd.md`
- `spec-notes.md`
- Existing `frontend/src/data/wheelsData_caden.js`
- Caden source documentation used during the existing scrape
- Reserved ID rule: 50-128 Panda Podium, 129-137 Caden source block, 200+ new exploded configurations

## Expected outputs

- One catalog object per documented purchasable Caden wheelset configuration.
- Sibling Caden configurations linked by identical `model_group` and `model_group_label`.
- Variant-specific `spokes.material`, `rim.internalWidth_mm`, `rim.externalWidth_mm`, `brake_type`, `weight_grams`, `prices`, and `affiliateLinks.manufacturer.price_eur` values where documented.
- No comparable variant data remains only in `other_specs`.
- Existing single-configuration Caden entries remain one entry with no unnecessary `model_group`.

## Constraints

- Do not infer undocumented combinations. If Caden documents independent options without complete buyable combinations, do not generate every combination.
- Do not split entries by `hub.freehub_options`.
- Do not split entries by front/rear divergent specs.
- If price or weight is unavailable for a documented variant, set the value to `null`; do not copy a sibling value unless the source explicitly documents shared pricing.
- Spoke material must use canonical keys: `carbon`, `carbon_composite`, `stainless_steel`, `steel`, `aluminum`.
- Brake type must use canonical keys: `disc`, `rim`, `track`.
- Rim width values must be numeric millimeters or valid `{ front, rear }` pairs.
- Preserve non-comparable technical notes in `other_specs`.
- Preserve placeholder image behavior for entries without product images.

## Dependencies

TASK-001

## Validation criteria

- [ ] Caden variant entries use IDs 200+ where new exploded configurations are created.
- [ ] No Caden entry stores spoke material variants, rim width variants, brake type variants, per-variant weight, or per-variant price only in `other_specs`.
- [ ] Caden sibling entries share `model_group` and `model_group_label`.
- [ ] Single Caden entries without documented variants do not have grouping metadata.
- [ ] `validateWheelsCatalog(wheelsData)` returns zero warnings.
- [ ] Caden entries remain visible when `price_eur` or `weight_grams` is `null`.

## Tests to implement

### Unit

- Add validator fixtures for migrated Caden-like grouped variants.

### Integration

- Add catalog integration assertions for Caden groups, forbidden `other_specs` cleanup, and reserved ID compliance.
