# Implementation Notes — EVO-038

## TASK-001 — `resolveSpec` utility and `wheelValidator.js`

### Files created
- `frontend/src/data/wheelUtils.js` — exports `resolveSpec`
- `frontend/src/data/wheelValidator.js` — exports `validateWheelEntry`, `validateWheelsCatalog`
- `frontend/src/data/__tests__/wheelUtils.test.js` — 7 unit tests (all pass)
- `frontend/src/data/__tests__/wheelValidator.test.js` — 8 unit tests (all pass)

### Design decisions
- **`resolveSpec` empty-object fallback**: `{}` (object with neither `front` nor `rear`) is treated as the null case — returns all-null with `isSingle: true`.
- **`isSingle` for equal pairs**: For `{ front: 60, rear: 60 }`, `total` is `120` (sum preserved), `isSingle: true`. Sum semantics and display collapse are independent.
- **Ineligible field detection**: The validator iterates top-level entry keys and skips a known exclusion set (`rim`, `hub`, `spokes`, `prices`, `images`, `affiliateLinks`, `other_specs`) to avoid false positives on intentionally object-shaped nested structures.
- **`other_specs` exclusion**: The entire `other_specs` object is excluded from the ineligible-pair check — future-proof for new annotation fields.

### Tradeoffs
The eligible-field descriptor pattern (`{ path, get }` array) keeps `validateWheelEntry` extensible with no logic changes.

---

## TASK-002 — `wheelProperties.jsx` accessors

### Files changed
- `frontend/src/config/wheelProperties.jsx` — `resolveSpec` import added; `accessor` updated for depth, externalWidth, internalWidth, weight; `filterAccessor` added to three dimensional properties.
- `frontend/src/config/__tests__/wheelProperties.accessor.test.js` — new file, 34 tests (all pass).

### Design decisions
- **`accessor` body style**: Two-line pattern (`resolveSpec` + early-return null guard) rather than one-liner — keeps null guard explicit.
- **`filterAccessor` uses `isSingle`**: The canonical `isSingle` flag from `resolveSpec` drives the branch, not a direct `front === rear` re-comparison.
- **`internalWidth` optional chain preserved**: `w.rim?.internalWidth_mm` was kept in both `accessor` and `filterAccessor` — some entries may have no `rim` object.

### Tradeoffs
Using `resolveSpec` in the weight accessor is slightly more verbose than an inline ternary, but keeps the logic centralized and consistent across all four properties.

---

## TASK-003 — Range matcher OR semantics in `wheelsSelectors.js`

### Files changed
- `frontend/src/store/selectors/wheelsSelectors.js` — `matchers.range` updated; `selectFilteredWheels` and `makeSelectContextualCountsFor` filter loops dispatch through `filterAccessor` when present; `matchers` exported.
- New test file covering OR semantics, scalar path unchanged, and edge cases.

### Design decisions
- **Empty array behavior**: `[].some(...)` returns `false` — an empty pair does not null-pass. Null-pass applies only to `null`/`undefined`/non-finite values.
- **`matchers` export**: Promoted to `export const` to enable direct unit testing, as suggested in the task.
- **`makeSelectContextualCountsFor` updated**: `filterAccessor` dispatch added for consistency — contextual counts also respect OR semantics.
- **`makeSelectRangeBoundsFor` unchanged**: Continues to use `property.accessor` (scalar max), so slider bounds are unaffected.

### Tradeoffs
Exporting `matchers` exposes an internal implementation detail. Accepted as a reasonable tradeoff given the task's own suggestion.

---

## TASK-004 — `renderCell` overrides for divergent display

### Files changed
- `frontend/src/config/wheelProperties.jsx` — `renderCell` overrides added for depth, externalWidth, internalWidth, weight.
- `frontend/src/config/__tests__/wheelProperties.renderCell.test.jsx` — new file, 24 tests (all pass).

### Design decisions
- **Dimensional specs**: `renderCell` calls `resolveSpec` directly on the relevant field (re-reading from the wheel object) rather than reusing `accessor` — avoids the lossy `Math.max`. `isSingle` drives the branch: single → `"{v} mm"`, divergent → `"{front} / {rear} mm"`, null → `t('common.notAvailable')`.
- **Weight**: Scalar and equal-pair return a plain string. True divergent pair returns a React element — wrapping `<div>` with primary `<span>` and `<div className="text-xs text-ink-7 mt-0.5">` sub-line (block element, renders below primary, satisfies `whitespace-nowrap`).
- **`t` guard in weight**: Null guard returns `t('common.notAvailable')`, consistent with the price renderer pattern.

### Open questions resolved
- **MeasuringTable (OQ-001)**: The sub-line `"{front} / {rear} g"` is shorter than the total line — it will not drive column width. No action needed.

---

## TASK-005 — Divergent Zipp entry and catalog integration tests

### Files changed
- `frontend/src/data/wheelsData_zipp.js` — new entry id 50 (Zipp 404/808 combo: `rim.depth_mm: { front: 58, rear: 80 }`, `weight_grams: { front: 740, rear: 895 }`)
- `frontend/src/data/wheelValidator.js` — bug fix (see below)
- `frontend/src/data/__tests__/catalog.integration.test.js` — new file, 4 integration tests (all pass)

### Bug fix — `wheelValidator.js`
The second loop in `validateWheelEntry` was missing `weight_grams` from the eligible-key exclusion set, causing it to flag `weight_grams: { front, rear }` as an ineligible pair. Fix: derive `ELIGIBLE_TOP_LEVEL_KEYS` from `ELIGIBLE_FIELDS` and skip those keys in the ineligible-pair scan. All validator unit tests continue to pass.

### Design decisions
- **Entry id**: The task template specified id 44, but id 44 was already taken (ENVE). Highest id across all catalogs was 49. New entry assigned id 50.

### Validation coverage
- Depth filter 75–85 includes id 50 (rear 80 in range) — OR semantics confirmed
- Depth filter 60–70 excludes id 50 (neither 58 nor 80 in range) — correct exclusion
- Sort by depth descending positions id 50 correctly (max 80)
- `validateWheelsCatalog` returns zero warnings on full catalog

---

## Pre-existing failures (out of scope)

Two tests were already failing before EVO-038 and are unrelated:
- `ComparisonTable > <thead> carries sticky, top-0, z-10`
- `MiniComparator viewport-cap > AC-006 — <thead> resolves to position: sticky`

Both concern `<thead>` sticky positioning from EVO-025 and are not caused by any change in this evolution.
