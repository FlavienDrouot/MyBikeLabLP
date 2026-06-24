# Spec Notes — EVO-001

## PRD interpretations

- **"Filter axes" definition**: the PRD says "filterable properties" and references `wheelProperties`. Interpreted as entries in `WHEEL_PROPERTIES` that have a `filter` field — consistent with the existing `getFilterableProperties()` helper and the way `FilterPanel` already uses the registry.
- **Count at spec time**: the registry currently exposes 13 filterable properties (brand, weight, price, diameter, rimMaterial, hookless, depth, rimWidth, hubBrand, hubModel, spokesBrand, spokesModel, spokeMaterial). The PRD's "13" is confirmed.
- **"No hardcoded literal"**: interpreted strictly — no numeric literal anywhere in the Hero component or in any value it receives that encodes the filter count. `getFilterableProperties().length` is evaluated at render time from the live registry.

## Architecture decision rationale

- **AD-001 — Direct import over Redux**: `WHEEL_PROPERTIES` is module-level static configuration. It is never mutated at runtime, never async, never user-dependent. Redux is for runtime state; consuming static config through Redux would add boilerplate (`createSelector`, `useSelector`) with zero benefit. Direct import is the pattern already used by every other component that reads the registry (`FilterPanel`, `ComparisonTable`, `ColumnSelector`).

## Tradeoffs

- **Direct import vs. Redux selector**: Direct import chosen (see AD-001). The only scenario where Redux would be justified is if the registry became async or user-configurable — out of scope for this evolution and not anticipated.
- **`getFilterableProperties().length` inline vs. new exported constant**: Inline call chosen. A standalone exported constant (`FILTERABLE_COUNT`) would be a derived value that must be kept in sync with the function — redundant and error-prone. Calling the function directly is self-documenting and guaranteed to stay in sync.
- **Task count (1 vs. more)**: The change is a single import + one token replacement in one file. Splitting it into multiple tasks would be artificial. One atomic task is appropriate.

## Open questions

- None. The change is fully determined by the existing registry structure and the current Hero markup.
