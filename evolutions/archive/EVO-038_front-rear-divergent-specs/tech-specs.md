# Technical Specifications

## 1. General Information

- Evolution ID: EVO-038
- PRD reference: `evolutions/EVO-038_front-rear-divergent-specs/prd.md`
- Author: Flavien Drouot
- Date: 2026-06-03

---

## 2. Technical Context

### Technical objective

Extend the wheelset data model to support a polymorphic value form for four specs (rim depth, external width, internal width, weight): a field may hold either a plain scalar (existing form, no change) or a `{ front, rear }` object (new divergent form). Update the filter, sort, and cell rendering pipeline to handle both forms correctly without any regression on existing single-value entries.

### Affected architecture

- **Data layer**: `wheelsData_*.js` files — data format extension. New validation utility.
- **Property registry**: `wheelProperties.jsx` — accessors, filter accessors, sort accessors, and cell renderers updated for four properties.
- **Filter engine**: `wheelsSelectors.js` — range matcher updated to support OR semantics via `filterAccessor`.
- **Filter state initialisation**: `filtersSlice.js` — unchanged in logic; benefits automatically from updated accessors.
- **Display layer**: `wheelProperties.jsx` `renderCell` overrides for depth, externalWidth, internalWidth, weight.

### Impacted modules

- `frontend/src/data/wheelsData_zipp.js` — add first real example of divergent entries (optional, for smoke test)
- `frontend/src/data/wheelValidator.js` — new file
- `frontend/src/store/selectors/wheelsSelectors.js`
- `frontend/src/config/wheelProperties.jsx`
- Test files (new)

---

## 3. Technical Constraints

- The `property.accessor` contract must continue to return a scalar (`number | string | null`) for all downstream consumers that do not know about divergence (sort, initial bounds, `makeSelectRangeBoundsFor`, default cell renderer fallback).
- No change to `filtersSlice.js` slice reducers or state shape. The filter state stores `{ min, max }` scalars as today.
- No change to `rangeMath.js` — clamp helpers operate on scalars and are unaffected.
- No change to `ComparisonTable.jsx` or `columnCells.jsx` — the rendering change is entirely expressed via `renderCell` overrides in the registry.
- The ingestion format change must not break the existing `wheelsData_*.js` files; all existing entries use scalar values and must continue to load and behave identically.
- The `resolveSpec` utility function must be the single canonical point for interpreting a divergent-eligible field — no inline `typeof value === 'object'` checks scattered across the codebase.

---

## 4. Architecture Decisions

### AD-001 — Polymorphic field: `number | { front: number, rear: number }`
#### Description
Divergent specs are stored in the same field as scalar specs. A field may be either a plain number (single-value form) or an object `{ front: number, rear: number }` (pair form). No separate parallel fields are introduced.

#### Motivation
Zero migration cost for existing entries. The field name stays identical (`rim.depth_mm`, `weight_grams`, etc.). The pair form is self-documenting and explicit.

#### Rejected alternatives
Parallel fields (`depth_mm_front`, `depth_mm_rear`): rejected because it fragments the spec, requires multi-field checks to determine divergence, and multiplies the number of keys in the data object.

---

### AD-002 — `resolveSpec` utility centralises type dispatch
#### Description
A helper function `resolveSpec(value)` is introduced in `src/data/wheelUtils.js`. It accepts a scalar or pair and returns `{ front, rear, total, isSingle }`. All code that needs to interpret a divergent field calls `resolveSpec` — no inline `typeof` checks elsewhere.

#### Motivation
Prevents scattered type guards. Makes a future TypeScript migration straightforward (replace the function with a discriminated union guard). Centralises the `front === rear → isSingle` logic (AD-005).

#### Rejected alternatives
Inline `typeof value === 'object'` checks at each use site: rejected because it is fragile, undocumented, and difficult to test in isolation.

---

### AD-003 — `filterAccessor` optional field on WheelProperty for OR semantics
#### Description
An optional `filterAccessor: (w) => number | number[]` field is added to the `WheelProperty` type. For dimensional divergent specs (depth, externalWidth, internalWidth), `filterAccessor` returns `[front, rear]`. The `range` matcher in `wheelsSelectors.js` is updated: when the value is an array, it applies OR semantics (any value in range passes). When absent, existing scalar path is unchanged.

#### Motivation
The existing `accessor` must return a scalar (constraint above). OR semantics require access to both values simultaneously. Separating the concerns keeps the sort/default-display path clean while enabling the new filter behaviour.

#### Rejected alternatives
Making `accessor` return an array and branching inside the matcher: rejected because sort and initial bounds also use `accessor` and expect a scalar.

---

### AD-004 — Weight accessor always returns pair total
#### Description
For the `weight` property, `accessor(w)` always returns a scalar: `front + rear` when the value is a pair, or the scalar directly. No `filterAccessor` is needed for weight (total-only semantics, no OR). No `total` key is stored in the data.

#### Motivation
All downstream consumers (filter, sort, range bounds, default cell fallback) need a single comparable number. Computing on access prevents stored-vs-derived drift.

#### Rejected alternatives
Storing a `total` key alongside `front`/`rear`: rejected because it creates a redundant field that can become inconsistent with the sum.

---

### AD-005 — Equal-pair display collapses to single value in cell renderer
#### Description
When `resolveSpec` returns `isSingle: true` (scalar input, or `front === rear`), the cell renderer displays the scalar value only (`60 mm`). The `60 / 60 mm` form is never shown.

#### Motivation
PRD edge case (section 10). Avoids visual noise for pairs that happen to be equal.

#### Rejected alternatives
Always displaying both values of a stored pair: rejected because it would surface `60 / 60 mm` for entries where the pair form is merely an artifact of ingestion.

---

### AD-006 — Ingestion validation as a standalone utility (non-blocking)
#### Description
A new file `src/data/wheelValidator.js` exports `validateWheelEntry(entry)` and `validateWheelsCatalog(entries)`. These functions return an array of warning strings. They are called in unit tests and may be called at startup (logging to console). They do not throw or block the app.

#### Motivation
The catalog is static JS files, not untrusted external input. A hard gate would break the app on any single malformed entry. The validator is primarily a data-authoring and testing tool.

#### Rejected alternatives
Runtime throw on invalid data: rejected because it would cause a full app crash for a single bad entry during the data-ingestion phase.

---

## 5. Task Breakdown

| Task | File | Summary | Dependencies |
|------|------|---------|--------------|
| TASK-001 | `TASK-001.md` | Create `resolveSpec` utility and `wheelValidator.js` with tests | none |
| TASK-002 | `TASK-002.md` | Update `wheelProperties.jsx` accessors for depth, externalWidth, internalWidth, weight | TASK-001 |
| TASK-003 | `TASK-003.md` | Update range matcher in `wheelsSelectors.js` to support OR semantics via `filterAccessor` | TASK-002 |
| TASK-004 | `TASK-004.md` | Add `renderCell` overrides for divergent display of dimensional specs and weight | TASK-002 |
| TASK-005 | `TASK-005.md` | Add a divergent wheelset entry to `wheelsData_zipp.js` and run smoke tests | TASK-001, TASK-002, TASK-003, TASK-004 |

---

## 6. Global Validation Strategy

### Unit validation
- `resolveSpec`: tests for scalar, pair, equal-pair, incomplete-pair, null inputs.
- `wheelValidator`: tests for rejection of incomplete pairs, non-eligible divergence, and acceptance of both valid forms.
- Accessors (depth, externalWidth, internalWidth, weight): tests confirm scalar returned for both scalar input and pair input.
- `filterAccessor` for dimensional specs: tests confirm `[front, rear]` returned for pair, `[scalar]` or `scalar` for single.
- Range matcher: tests confirm OR semantics when value is an array, unchanged behaviour for scalar.
- Cell renderers: tests confirm `50 / 60 mm`, `45 mm`, `1570 g` with breakdown, `1570 g` without breakdown.

### Integration validation
- Selector `selectFilteredWheels`: integration test with mixed catalog (scalar + pair entries), verifying filter and sort output for each FR.
- Initial filter bounds: verify that `buildInitialFilters` computes correct min/max from accessor output (scalar after EVO-038 changes).

### Functional validation
- AC-001 through AC-009 from the PRD, each implemented as a named test.

### Non-regression validation
- Full existing test suite run against a catalog of single-value-only entries. All results must match the pre-EVO-038 baseline (AC-006).

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|---|---|---|
| `MeasuringTable` renders weight cell differently than `ComparisonTable` (two-line block affects column width measurement) | Misaligned column width | TASK-004 must verify that `MeasuringTable` goes through the same `renderCell` override path. See OQ-001 in spec-notes. |
| Existing Zipp entries have `other_specs.weight_front_g / weight_rear_g` which look like the new pair format | Silent data confusion during authoring | `wheelValidator.js` must explicitly document that only `weight_grams` is the canonical field. Add a comment in `wheelsData_zipp.js`. |
| `makeSelectRangeBoundsFor` uses `property.accessor` — if accessor now returns max(front, rear) for depth, the upper bound widens | Filter UI range widens slightly | Intentional and correct (see OQ-003 in spec-notes). No action needed; document in TASK-002. |
| Incoming scraped data that has both a scalar `weight_grams` and `weight_front_g` / `weight_rear_g` in `other_specs` | Ambiguous canonical value | Ingestion rule: `weight_grams` is always the canonical field. `other_specs.*` are annotations only. Document in `wheelValidator.js`. |

---

## 8. Rollback Plan

- All changes are additive to the data schema: existing scalar entries continue to work without modification.
- If the new rendering or filter logic causes regressions, revert `wheelProperties.jsx` (TASK-002 and TASK-004) and `wheelsSelectors.js` (TASK-003) independently — they are designed to be independently mergeable.
- `wheelValidator.js` and `wheelUtils.js` are new files with no dependents beyond tests; they can be removed without side effects.
- The divergent Zipp entry added in TASK-005 can be reverted to a scalar without affecting any other entry.
