# TASK-005: Align Scraping Documentation With Implemented Model

## Objective

Verify that scraping documentation and schema files match the implemented EVO-044 catalog model after the frontend migration.

## Required context

Workspace data-schema conventions require every evolution that changes wheel data schema to include data migration and scraping process updates. The scraping workflow files already contain EVO-044 rules, but they must be checked against the final implementation.

## Potentially impacted files

- `workflows/datascraping/wheel-format.json`
- `workflows/datascraping/README.md`
- `MyBikeLab/scripts/DatascrapingPrompt.md`
- `MyBikeLab/evolutions/EVO-044_product-variants-catalog-model/spec-notes.md`

## Inputs

- `prd.md`
- `tech-specs.md`
- Final implementation choices from TASK-001 through TASK-004
- Current scraping workflow documentation

## Expected outputs

- Scraping schema and prompt remain aligned with implemented fields: `model_group`, `model_group_label`, canonical variant axes, and forbidden `other_specs` usage.
- Any drift found during implementation is corrected.
- `spec-notes.md` records whether scraping docs were already aligned or what changed.

## Constraints

- Do not weaken the no-inferred-combinations rule.
- Do not remove the existing EVO-038 divergent front/rear specification rules.
- Keep all workspace documentation in English.
- Keep canonical freehub values as non-comparable option metadata.
- If no edits are needed, document that conclusion in `spec-notes.md` rather than changing files for churn.

## Dependencies

TASK-001, TASK-002

## Validation criteria

- [ ] `wheel-format.json` documents `model_group` and `model_group_label`.
- [ ] `README.md` documents one object per documented buyable configuration.
- [ ] `DatascrapingPrompt.md` instructs future scraping sessions not to place comparable variant data in `other_specs`.
- [ ] EVO-038 divergent field rules remain present.
- [ ] `spec-notes.md` records the final documentation alignment decision.

## Tests to implement

### Unit

- Not applicable.

### Integration

- Not applicable.
