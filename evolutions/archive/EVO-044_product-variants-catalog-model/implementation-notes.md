# Implementation Notes

## Baseline Vitest Summary

- Command: `npm.cmd run test:summary`
- Files: 17 passed, 0 failed
- Tests: 205 passed, 0 failed
- Duration: 4.80s
- Exit code: 0

## TASK-001: Extend Catalog Variant Validation

- Added deterministic warnings for comparable variant data stored in `other_specs`.
- Added `model_group` / `model_group_label` validation at entry and catalog level.
- Preserved EVO-038 pair-form validation for eligible front/rear divergent fields.
- Confirmed `hub.freehub_options` does not trigger variant warnings.

## TASK-002: Migrate Caden Catalog Variants

- Reworked Caden data into flat buyable configurations.
- Preserved source IDs 129-137 where possible and allocated new exploded configurations to IDs 200-205.
- Added `model_group` and `model_group_label` for steel/carbon spoke variants, 50mm width variants, and Tri 3-Spoke brake variants.
- Removed comparable variant data from `other_specs`; retained non-comparable technical notes.
- Set the Tri 3-Spoke rim-brake variant price to `null` because a distinct documented price was not present in the existing source notes.

## TASK-003: Display Model Family Association

- Added a compact model-family marker inside the model table cell for grouped entries only.
- Added model-family context to the expanded wheel detail panel.
- Added English and French translations for the new labels.

## TASK-004: Prove Variant Entry Filter And Sort Behavior

- Added selector tests for spoke material, external width, brake type, width sorting, missing price/weight sort behavior, freehub option behavior, and front/rear divergent dimensions.
- Added catalog integration assertions for Caden groups, reserved ID usage, forbidden `other_specs` cleanup, and missing-price visibility.
- Added comparator and detail-panel render tests for grouped and ungrouped entries.

## TASK-005: Align Scraping Documentation With Implemented Model

- Confirmed `wheel-format.json` already documented `model_group`, `model_group_label`, variant axes, reserved IDs, and forbidden comparable `other_specs` usage.
- Updated `workflows/datascraping/README.md` Caden tracker notes and catalog total.
- Updated `MyBikeLab/scripts/DatascrapingPrompt.md` so the general extraction rule says one object per buyable wheel configuration.
- Recorded the alignment decision in `spec-notes.md`.

## Regression Vitest Summary

- Command: `npm.cmd run test:summary`
- Files: 17 passed, 0 failed
- Tests: 226 passed, 0 failed
- Duration: 3.96s
- Exit code: 0
