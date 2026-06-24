# spec-notes — EVO-038 Front/Rear Divergent Specs

## PRD interpretations

### INT-001 — Weight field location
The PRD refers generically to a "weight" spec eligible for divergence. In the current data model, weight is stored as `weight_grams` (top-level field on the wheelset object). Several existing Zipp entries already carry `other_specs.weight_front_g` and `other_specs.weight_rear_g` as annotation fields (informational only, not wired to any filter or display logic). EVO-038 introduces a first-class `weight_grams` dual form: `weight_grams` may now be either a scalar or `{ front, rear }`. The pre-existing `other_specs.weight_front_g / weight_rear_g` fields are not migrated automatically; they are separate and must not be read as the canonical divergent form. Decision: implementation must not silently read `other_specs.weight_*` as the pair. Normalization logic applies only to `weight_grams`.

### INT-002 — Rim fields location
`depth_mm`, `externalWidth_mm`, and `internalWidth_mm` live inside the `rim` sub-object (`w.rim.depth_mm`, etc.). The pair form will follow the same nesting: `rim.depth_mm` may be a scalar or `{ front, rear }`. This is consistent — no field is moved.

### INT-003 — "Front = rear identical pair" renders as single value
The PRD edge case (section 10): a wheelset with `{ front: 60, rear: 60 }` must render as `60 mm`, not `60 / 60 mm`. This applies during cell rendering only; the data may legitimately store the pair form. The renderer is responsible for collapsing equal pairs.

### INT-004 — Weight with only front/rear keys (no declared total key)
The PRD requires computing the sum. The ingestion layer normalizes to a canonical pair shape `{ front, rear }`. The pair total is always computed as `front + rear`; no separate `total` key is stored or required. If only a scalar is provided, it is treated as the total directly (not split).

### INT-005 — Ingestion validation scope
The current ingestion layer is the per-brand `wheelsData_*.js` files plus the aggregator `wheelsData.js`. There is no runtime validation today. EVO-038 introduces a validation utility (`wheelValidator.js`) that can be called at data load time and in tests. It does not block the app if invalid data is present — it logs warnings. Full hard rejection is out of scope for this evolution.

### INT-006 — `filtersSlice` initial bounds computation
`buildInitialFilters` currently calls `property.accessor(w)` and expects a number. For divergent-eligible specs, the accessor will now return a number (the sort/filter key — max for dimensional, total for weight). This is the natural adapter point: no change to `filtersSlice` is required, provided the accessors in `wheelProperties.jsx` are updated to always return a scalar. The range bounds computed at startup will therefore reflect the maximum of front/rear for dimensional specs across the catalog, which is correct.

### INT-007 — Sort accessor vs. filter accessor
Currently, both filter and sort use `property.accessor`. For dimensional divergent specs, the scalar returned by `accessor` should be `Math.max(front, rear)` (per FR-005). For filtering, OR semantics require checking both values individually — this cannot be done via the single `accessor` alone. Therefore, a second accessor — `filterAccessor` — is introduced on affected properties. The filter matching logic in `wheelsSelectors.js` must be updated to use `filterAccessor` when present, falling back to `accessor` otherwise.

### INT-008 — Cell rendering: `renderCell` in wheelProperties.jsx vs. columnCells.jsx
The default rendering path in `columnCells.jsx` (`renderCellFor`) already supports a `property.column.renderCell` override. The divergent display for depth, externalWidth, internalWidth, and weight will be implemented as `renderCell` overrides directly in `wheelProperties.jsx`. No change to `columnCells.jsx` is required.

---

## Architecture decision rationale

### AD-001 — Dual-form value type at the data field level, not a separate sub-object
**Decision**: a divergent spec is stored in the same field as the scalar, as a `{ front, rear }` object literal. The field is polymorphic: `number | { front: number, rear: number }`.

**Rationale**: no migration of existing entries is needed; callers that do not handle the pair form degrade gracefully (they see an object where they expect a number, which is detectable). The shape is explicit and self-documenting.

**Alternative rejected**: a separate parallel field (`depth_mm_front`, `depth_mm_rear`) was considered. Rejected because it fragments the spec field, makes "is this spec divergent?" a multi-field check, and multiplies the number of fields in the data object.

### AD-002 — `filterAccessor` extension on WheelProperty for OR semantics
**Decision**: introduce an optional `filterAccessor: (w) => number | number[]` on divergent-eligible properties. When an array is returned, the range matcher applies OR semantics (any value in range passes). When absent, the existing scalar path is used.

**Rationale**: the existing `matchers.range` in `wheelsSelectors.js` is generic and shared across all range-filtered properties. Rather than branching inside the matcher on property identity, the property itself advertises its filter shape. This keeps the matcher generic and the property registry self-contained.

**Alternative rejected**: branching inside the range matcher by checking if the value is an array. Rejected because it conflates data shape detection with matching logic, and it would have required changing the matcher interface rather than the property declaration.

### AD-003 — Weight pair total computed on access (not stored)
**Decision**: the `accessor` for weight always returns the pair total as a scalar. When the value is `{ front, rear }`, accessor returns `front + rear`. No `total` key is stored.

**Rationale**: keeping the derived value computed prevents drift between stored total and the sum. It also means all downstream consumers (filter, sort, initial bounds) automatically get the correct scalar with no change.

### AD-004 — Ingestion validation as a standalone utility, not a runtime gate
**Decision**: validation logic lives in `src/data/wheelValidator.js`. It is called in tests and optionally at data load time via a console warning. It does not throw or block app startup.

**Rationale**: the data is currently static JS files, not an untrusted external input. A hard gate would break the app on any single malformed entry — too aggressive for the current scale. The validator serves as a correctness tool during data authoring and testing.

### AD-005 — Equal front/rear pair collapses to single-value display in the renderer
**Decision**: when `front === rear` in a stored pair, the cell renderer displays the scalar value (e.g. `60 mm`), not `60 / 60 mm`.

**Rationale**: avoids visual noise for pairs that happen to be identical. The PRD explicitly calls this out as an edge case (section 10). The comparison is done in the renderer, not at ingestion, so the data is stored faithfully.

---

## Tradeoffs

### TR-001 — Polymorphic field vs. strict schema
Choosing a polymorphic field (`number | object`) over strict typing means TypeScript (if introduced later) will require a discriminated union or a type guard helper. Accepted: the project currently uses JSDoc types and no runtime type enforcement. A utility function `resolveSpec(value)` (returning `{ front, rear, total, isSingle }`) will centralize the type guard, making a future strict typing pass straightforward.

### TR-002 — filterAccessor vs. custom range matcher
Introducing `filterAccessor` adds a new optional field to the WheelProperty shape. This adds a small documentation/convention burden. Accepted because the alternative (array return from `accessor`) would mean the sort and default rendering paths also see an array, requiring changes in more places.

### TR-003 — Not migrating existing other_specs.weight_front_g / weight_rear_g
Several Zipp entries already carry `other_specs.weight_front_g / weight_rear_g`. These are not migrated to the canonical pair form as part of EVO-038 — they remain informational notes. The reason is that `weight_grams` for those entries is already a correct total scalar; migrating would require verifying that `front + rear === weight_grams` for each entry, which is data authoring work beyond EVO-038's scope.

---

## Open questions

### OQ-001 — MeasuringTable and divergent weight cell
`MeasuringTable` uses `renderCellFor` with the same property definitions. The weight cell will now render a two-line block (total + breakdown). This may affect the measured column width if the measuring table renders the cell differently than the visible table. To be verified during TASK-005 implementation: ensure `MeasuringTable` uses the same `renderCell` override path.

### OQ-002 — Weight breakdown detail: sub-line vs. tooltip
The PRD leaves the exact visual treatment open (FR-007: "sub-line or tooltip"). This spec chooses a sub-line (`<div>` stacked below the total, smaller font) because it is always visible without hover — more accessible, simpler to implement, and consistent with the existing model cell which uses stacked text. The implementation agent should confirm this choice does not break the column width measurement (related to OQ-001).

### OQ-003 — Initial filter bounds for divergent specs
When `buildInitialFilters` computes `Math.min / Math.max` over accessor values for depth, externalWidth, and internalWidth, the accessor now returns `Math.max(front, rear)` for divergent entries. This means the upper bound of the filter range is driven by the rear value of deep-dish entries. This is intentional: a user setting a max filter of 60 mm should not be surprised to see a 50/60 wheelset appear (it does appear, per OR semantics). The filter range bounds correspond to the highest individual wheel value in the catalog, which is the most inclusive reasonable default.
