# Spec Notes - EVO-044 Product Variants Catalog Model

## PRD Interpretations

- The existing comparator already treats each object in `wheelsData` as an independent comparator entry. EVO-044 therefore requires catalog entries to be exploded before they reach selectors, not a runtime variant selector.
- `model_group` and `model_group_label` are optional metadata. They are present only when at least two catalog entries are siblings in the same documented purchasable model family.
- `hub.freehub_options` remains filterable option information because it already exists as a flat option list. It must not drive catalog entry duplication.
- Rim width is already represented through `rim.internalWidth_mm` and `rim.externalWidth_mm`. Variant-specific rim width behavior is achieved by exploding documented variants into distinct entries carrying their own width values.
- Front/rear divergent values from EVO-038 remain scalar-or-pair values on one entry. Pair-form values do not create variant siblings.
- The datascraping prompt, workflow README, and `wheel-format.json` already contain EVO-044 variant rules. This spec keeps them in validation scope but does not create a separate task to rewrite them unless implementation discovers drift.

## Architecture Decision Rationale

- AD-001 uses flat comparator entries with optional model-family metadata because current selectors, filters, sorting, column visibility, and row expansion already operate on flat entries.
- AD-002 keeps `model_group` outside filter/sort behavior because grouping is a presentation affordance, not a comparable axis.
- AD-003 expands Caden data directly into frontend catalog objects because the PRD names Caden as the proving case and current Caden entries still carry variant data in `other_specs`.
- AD-004 extends validation instead of relying on manual review only because the forbidden `other_specs` variant fields are easy to reintroduce during future scraping sessions.
- AD-005 adds focused selector and catalog integration tests because the highest-risk behavior is entry-level filtering, sorting, and missing-value handling after data explosion.

## Tradeoffs

- A nested `variants` array was rejected because it would require selector and UI changes across the comparator, and would make filters operate at model-family level unless additional flattening logic was introduced.
- Group header rows were rejected as the minimum UI approach because they would change table row semantics and filtering behavior. A compact family marker inside the model cell is enough to satisfy visible association while preserving existing row interactions.
- Generating undocumented combinations from independent option lists was rejected by the PRD. The catalog must only include source-documented purchasable configurations.
- A new `variant_axis` field was not required for the minimum scope. The existing comparable fields already identify spoke material, rim width, and brake type values on each entry.

## Open Questions

- The implementation phase should confirm exact Caden variant count and ID allocation after source review. New exploded entries must use IDs 200+ and must not reuse 50-128 or 129-137.
- The UI label copy for grouped entries should be reviewed in the browser for density and readability, especially in the fixed-width model column.

## Implementation Documentation Alignment

- `workflows/datascraping/wheel-format.json` already documents `model_group`, `model_group_label`, flat buyable configurations, canonical variant axes, reserved IDs, and forbidden comparable variant data in `other_specs`.
- `workflows/datascraping/README.md` already documented the EVO-044 transformation rules and EVO-038 divergent field rules. The Caden tracker row and catalog total were updated after implementation to reflect 15 Caden configurations and no comparable variant data in `other_specs`.
- `MyBikeLab/scripts/DatascrapingPrompt.md` already contained the EVO-044 variant section. Its general extraction rule was corrected from "one JSON object per wheel model" to "one JSON object per buyable wheel configuration" to avoid conflicting instructions in future scraping sessions.
