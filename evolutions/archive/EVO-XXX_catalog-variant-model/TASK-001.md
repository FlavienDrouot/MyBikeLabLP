# TASK-001: Schema, closed-vocabulary & scraping-docs contract

## Objective

Establish the data contract for the variant model before any data or UI is migrated: extend
the wheel schema with the model-group fields, document the closed axis vocabulary, and update
the scraping documentation so future ingestion produces conformant data from the start. This
task changes documentation/schema only — no runtime code, no `wheelsData_*.js` edits.

## Required context

- The catalog is frontend-only inline data. The canonical schema lives in
  `workflows/datascraping/wheel-format.json` (a self-describing example, not JSON Schema).
- Each wheel object today is one comparable unit with: `id`, `model`, `brand`,
  `weight_grams`, `diameter_mm`, `brake_type`, `wheelset_category`, `max_system_weight_kg`,
  `rim{material,hookless,depth_mm,externalWidth_mm,internalWidth_mm,tubeless_ready}`,
  `spokes{model,brand,material}`, `hub{...,freehub_options,disc_standard}`, `other_specs{}`,
  `prices[]`, `images[]`, `affiliateLinks{}`.
- EVO-044 adds the concept of a **model group**: sibling configurations that differ only on
  spoke material, rim width or brake type share a group key.
- Architecture decisions: AD-001 (flat explosion), AD-002 (`model_group` string +
  `model_group_label`), AD-003 (closed vocabulary via i18n keys + Title Case display).
- `MyBikeLab/domain-vocabulary.md` already documents the Title Case convention for non-i18n
  categoricals (fix-013). The three axes here keep i18n keys.

## Potentially impacted files

- `workflows/datascraping/wheel-format.json`
- `workflows/datascraping/README.md`
- `MyBikeLab/scripts/DatascrapingPrompt.md`
- `MyBikeLab/domain-vocabulary.md`

## Inputs

- The current `wheel-format.json`.
- The closed canonical key sets from AD-003:
  - `brake_type`: `disc` | `rim` | `track`
  - `spokes.material`: `carbon` | `carbon_composite` | `stainless_steel` | `steel` |
    `aluminum`
  - rim width axis = numeric `rim.internalWidth_mm` / `rim.externalWidth_mm` (no vocabulary).

## Expected outputs

- `wheel-format.json` gains two optional top-level fields, documented inline:
  - `"model_group": "string | null — shared slug linking sibling configurations that differ
    only on spoke material, rim width or brake type; null/absent = standalone model"`
  - `"model_group_label": "string | null — display name for the collapsed group row; identical
    across siblings of the same group"`
- The schema notes that `other_specs` must NOT contain any comparable variant data
  (spoke material, rim width, brake type, per-variant weight or per-variant price) — only
  genuinely unstructured, non-comparable notes (restates FR-008).
- `domain-vocabulary.md` gains a "Comparable variant axes" entry listing the three axes, their
  canonical key sets, the model-group definition, and the model-identity rule (siblings differ
  only on the three axes).
- `workflows/datascraping/README.md` and `scripts/DatascrapingPrompt.md` are updated so a
  scraping session emits `model_group`/`model_group_label` on sibling configurations, keeps
  variant data out of `other_specs`, and uses the canonical axis keys.

## Constraints

- Documentation/schema only. Do NOT edit `wheelsData_*.js`, components, selectors or the
  registry in this task.
- Keep the open question on `steel` vs `stainless_steel` (see `spec-notes.md`) unresolved:
  document both keys as currently valid; do not collapse them here.
- New ids introduced by future explosion start at 200; reserved ranges 50–128 and 129–137 are
  restated in the scraping docs.

## Dependencies

none

## Validation criteria

- [ ] `wheel-format.json` documents `model_group` and `model_group_label` as optional fields.
- [ ] The schema explicitly forbids comparable variant data in `other_specs`.
- [ ] `domain-vocabulary.md` documents the three axes, their canonical key sets, the
      model-group definition and the model-identity rule.
- [ ] `datascraping/README.md` and `DatascrapingPrompt.md` instruct emitting model-group
      fields, canonical axis keys, ids from 200+, and no variant data in `other_specs`.
- [ ] No runtime file changed; build and full Vitest suite still green (no behavioral change).

## Tests to implement

### Unit
- None (documentation/schema task). Confirm the existing suite remains green as a no-regression
  check.

### Integration
- None.
