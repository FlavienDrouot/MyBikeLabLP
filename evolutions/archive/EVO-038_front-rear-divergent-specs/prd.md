# PRD — Product Requirements Document

## 1. General Information

- Evolution ID: EVO-038
- Title: Front/rear divergent specs for wheelsets
- Author: Flavien Drouot
- Date: 2026-06-03
- Version: 1.0
- Needs Assessment reference: `evolutions/EVO-038_front-rear-divergent-specs/needs-assessment.md`

---

## 2. Functional Objective

Allow a wheelset entry to carry distinct front and rear values for specs that can diverge (rim depth, external width, internal width, weight), and surface that divergence correctly in the comparator — while keeping the common case (front = rear) visually and behaviorally identical to the current implementation.

---

## 3. Target Behavior

### General description

After this evolution, a wheelset entry may express one of two forms for each eligible spec:

- **Single value** (front = rear): the spec carries one scalar. The comparator renders and filters it exactly as today.
- **Front/rear pair** (front ≠ rear): the spec carries two values. Dimensional specs (rim depth, external width, internal width) display both values and apply OR semantics for range filtering. Weight always displays the pair total and filters on the pair total only.

Divergence is the exception; the single-value form is the default and must produce no regression in existing behavior.

---

## 4. Functional Rules

### FR-001 — Eligible specs for divergence

The divergence mechanism applies exclusively to four specs: **rim depth**, **external width**, **internal width**, and **weight**. All other specs remain single-valued per wheelset.

### FR-002 — Single-value form (front = rear)

When a spec is expressed as a single value, the system treats it as front = rear. Display, filtering, and sorting behave identically to the current implementation. No migration of existing entries is required.

### FR-003 — Divergent form for dimensional specs

When rim depth, external width, or internal width is expressed as a front/rear pair:

- The comparator cell displays both values using the format `{front} / {rear} mm` (e.g., `50 / 60 mm`).
- The separator is a forward slash surrounded by spaces.
- The unit suffix (`mm`) appears once, after the rear value.

### FR-004 — Filtering on divergent dimensional specs (OR semantics)

When a range filter is applied to rim depth, external width, or internal width, a wheelset matches the filter if **either** its front value or its rear value falls within the specified range. If the spec is a single value, matching behavior is unchanged.

### FR-005 — Sorting on divergent dimensional specs

When a wheelset has a divergent dimensional spec (front ≠ rear), sorting on that spec uses the **maximum** of the front and rear values. Single-value specs sort on their scalar. This ensures aero combos (which typically carry the larger rear value as the dominant spec) sort consistently with products described by a single depth.

### FR-006 — Weight: pair total as primary value

Weight is always displayed and filtered as the **pair total** (the sum of front and rear when a breakdown is available, or the declared total when a single value is provided). The pair total is the sole value used for range filtering and sorting.

### FR-007 — Weight: front/rear breakdown as detail

When a weight entry carries a front/rear breakdown, the comparator cell shows the pair total as the primary value and the breakdown as secondary detail. The format is: `{total} g` as the main display, with `{front} / {rear} g` shown as a sub-line or tooltip. The exact visual treatment is a UI detail for implementation; functionally the total must be unambiguously dominant.

### FR-008 — Ingestion format: single-value form

For each eligible spec, the ingestion format accepts a plain scalar to express front = rear. Example for rim depth: `"rimDepth": 45`. This form is unchanged from the current format.

### FR-009 — Ingestion format: front/rear pair form

For each eligible spec, the ingestion format accepts an object with `front` and `rear` keys to express a divergent pair. Example: `"rimDepth": { "front": 50, "rear": 60 }`. Both keys are required when this form is used.

### FR-010 — Ingestion validation: incomplete pairs

If only one of `front` or `rear` is provided for a divergent-eligible spec (the other key is absent or null), the entry is normalized to a single value using the available key. The normalization must be explicit (logged or documented in the ingestion rules) — it must not silently produce a half-empty pair.

### FR-011 — Ingestion validation: divergence on ineligible specs

If a front/rear pair form is provided for a spec that is not eligible for divergence, the value is rejected or normalized to a single value during ingestion. A warning is produced. The entry must not be silently accepted with an inconsistent data shape.

### FR-012 — Backward compatibility

All existing wheelset entries, which express all specs as single values, must produce behavior identical to the current implementation after this evolution. No regression is acceptable in display, filtering, or sorting.

---

## 5. Detailed Use Cases

### UC-001 — Viewing a wheelset with divergent rim depth

#### Preconditions
- A wheelset entry has rim depth expressed as a front/rear pair (e.g., front 50 mm / rear 60 mm).
- The comparator is open and the rim depth column is visible.

#### Steps
1. The user opens the comparator.
2. The user locates the row for the wheelset with divergent rim depth.
3. The user reads the rim depth cell.

#### Expected result
- The cell displays `50 / 60 mm`.
- No other wheelset entries are affected.
- Wheelsets with a single rim depth value display a single value (e.g., `45 mm`), unchanged.

#### Error cases
- N/A for display.

---

### UC-002 — Filtering on rim depth with a divergent wheelset in the catalog

#### Preconditions
- A wheelset has rim depth front 50 mm / rear 60 mm.
- The user applies a rim depth range filter of 55–70 mm.

#### Steps
1. The user sets the rim depth range filter to 55–70 mm.
2. The system evaluates each wheelset against the filter.

#### Expected result
- The wheelset (front 50 mm / rear 60 mm) **matches** the filter because the rear value (60 mm) falls within 55–70 mm.
- A wheelset with both values outside the range (e.g., front 40 / rear 45) is excluded.
- A wheelset with a single value of 58 mm matches as before.

#### Error cases
- N/A for filtering semantics.

---

### UC-003 — Sorting on rim depth with divergent wheelsets

#### Preconditions
- Multiple wheelsets have varying rim depths; some are single-valued, some are divergent pairs.
- The user sorts the comparator by rim depth descending.

#### Steps
1. The user selects rim depth as the sort criterion, descending.
2. The system sorts all wheelsets.

#### Expected result
- Divergent wheelsets are ranked by the **maximum** of their front and rear values.
- A wheelset with front 50 / rear 60 sorts as if it has depth 60.
- Single-value wheelsets sort on their scalar.
- The sort order is stable and consistent.

#### Error cases
- N/A.

---

### UC-004 — Viewing a wheelset with front/rear weight breakdown

#### Preconditions
- A wheelset entry has weight expressed as a front/rear pair (e.g., front 720 g / rear 850 g).
- The comparator is open and the weight column is visible.

#### Steps
1. The user opens the comparator.
2. The user locates the row for the wheelset.
3. The user reads the weight cell.

#### Expected result
- The primary display shows the pair total: `1570 g`.
- The front/rear breakdown (`720 / 850 g`) is visible as secondary detail.
- The entry is filtered and sorted on `1570`.

#### Error cases
- N/A for display.

---

### UC-005 — Filtering on weight with a breakdown wheelset

#### Preconditions
- A wheelset has front weight 720 g / rear weight 850 g (pair total 1570 g).
- The user applies a weight range filter of 1500–1650 g.

#### Steps
1. The user sets the weight filter to 1500–1650 g.
2. The system evaluates the wheelset.

#### Expected result
- The wheelset matches because its pair total (1570 g) falls within 1500–1650 g.
- The individual per-wheel values (720 g, 850 g) are not used for filtering.

#### Error cases
- N/A.

---

### UC-006 — Ingesting a wheelset with divergent specs

#### Preconditions
- A new wheelset entry is being added with rim depth front 50 / rear 60 and external width front 28 / rear 30.

#### Steps
1. The entry is written in the ingestion format using the front/rear pair form for rim depth and external width.
2. The entry is loaded into the catalog.

#### Expected result
- Both specs are accepted and stored as front/rear pairs.
- Display and filtering behave per FR-003 and FR-004.

#### Error cases
- If only `front` is provided for rim depth (no `rear` key), the value is normalized to a single value equal to the provided front value, and a warning is produced (FR-010).
- If a divergent pair is provided for a non-eligible spec (e.g., brand), it is rejected with a warning (FR-011).

---

### UC-007 — Existing single-value wheelset (no regression)

#### Preconditions
- An existing wheelset entry has all specs as single values.

#### Steps
1. The comparator loads the catalog (including the existing entry).
2. The user filters, sorts, and views the entry.

#### Expected result
- Display, filtering, and sorting are identical to the current behavior.
- No visual change, no behavioral change.

#### Error cases
- N/A.

---

## 6. Acceptance Criteria

### AC-001
#### Description
A wheelset entry can store either a single scalar or a front/rear pair for rim depth, external width, and internal width.
#### Expected verification
Given a catalog containing one entry with `rimDepth: 45` and one with `rimDepth: { front: 50, rear: 60 }`, both entries load without error and are accessible by the comparator.
#### Type
- Automated

---

### AC-002
#### Description
When front and rear differ on a dimensional spec, the comparator cell shows both values. When equal (or single value), it shows one.
#### Expected verification
For a wheelset with `rimDepth: { front: 50, rear: 60 }`, the rim depth cell displays `50 / 60 mm`. For a wheelset with `rimDepth: 45`, the cell displays `45 mm`.
#### Type
- Automated

---

### AC-003
#### Description
A range filter on a dimensional spec matches a wheelset if either its front or rear value falls within the range (OR semantics).
#### Expected verification
With rim depth filter set to 55–70 mm: a wheelset with `rimDepth: { front: 50, rear: 60 }` is included in results (rear value 60 is within range). A wheelset with `rimDepth: { front: 40, rear: 45 }` is excluded (neither value in range).
#### Type
- Automated

---

### AC-004
#### Description
Weight is always displayed as the pair total; when a front/rear breakdown exists, it is shown as additional detail.
#### Expected verification
For a wheelset with `weight: { front: 720, rear: 850 }`, the weight cell primary display is `1570 g` and the breakdown `720 / 850 g` is visible as secondary detail.
#### Type
- Automated

---

### AC-005
#### Description
Weight filtering operates on the pair total only.
#### Expected verification
With weight filter set to 1500–1650 g: a wheelset with `weight: { front: 720, rear: 850 }` (total 1570) is included. A wheelset with total 1700 g is excluded, regardless of individual wheel values.
#### Type
- Automated

---

### AC-006
#### Description
Wheelsets where front = rear behave identically to the current implementation.
#### Expected verification
Run the full existing test suite (display, filter, sort) against a catalog of single-value-only entries. All results must match the baseline.
#### Type
- Automated (non-regression)

---

### AC-007
#### Description
Sorting on a divergent dimensional spec uses the maximum of front and rear.
#### Expected verification
Given a wheelset with `rimDepth: { front: 50, rear: 60 }` and another with `rimDepth: 55`, sorting descending places the first wheelset above the second (60 > 55).
#### Type
- Automated

---

### AC-008
#### Description
The ingestion format accepts both the single-value and front/rear-pair forms for eligible specs.
#### Expected verification
Two entries — one with `rimDepth: 45` and one with `rimDepth: { front: 50, rear: 60 }` — both load without validation errors. An entry with only `rimDepth: { front: 50 }` (missing `rear`) is normalized to a single value of 50 with a warning.
#### Type
- Automated

---

### AC-009
#### Description
A divergent pair form provided for a non-eligible spec is rejected or normalized, not silently accepted.
#### Expected verification
An entry with `brand: { front: "Zipp", rear: "Zipp" }` produces a warning and the brand is stored as a single value.
#### Type
- Automated

---

## 7. Functional Impacts

### Impacted components
- **Comparator table**: cell rendering for rim depth, external width, internal width, and weight columns must handle both single-value and front/rear-pair forms.
- **Filter logic**: range filter evaluation for rim depth, external width, and internal width must apply OR semantics when a pair is present. Weight filter must evaluate the pair total.
- **Sort logic**: sort key computation for rim depth, external width, and internal width must resolve to the maximum value when a pair is present. Weight sort key is the pair total.
- **Ingestion layer** (currently `wheelsData.js`): the data format for eligible specs is extended. Validation rules for the pair form must be applied at load time.

### Impacted data
- **Wheelset entries**: the four eligible spec fields (rim depth, external width, internal width, weight) gain a dual form (scalar or `{ front, rear }` object).
- **Existing entries**: no migration required; all existing single-value entries remain valid.

### Impacted APIs
- None. There is currently no API layer; data is inline in `wheelsData.js`.

### Impacted permissions / roles
- None.

---

## 8. Out of Scope

- Spoke count (rayonnage) — divergence support deferred to a separate evolution.
- Any spec that does not diverge front/rear (brand, rim material, hub, hookless, diameter, etc.).
- New filter UI paradigms (no new filter controls introduced).
- Visual design of the secondary weight breakdown — the exact layout (sub-line vs. tooltip) is an implementation detail, not specified here beyond the requirement that the pair total is dominant.
- Backend, database, or data pipeline changes — ingestion format change applies to the current `wheelsData.js` structure only.

---

## 9. Constraints

- The common case (front = rear) must stay visually and behaviorally identical to today. Divergence is the exception; it must not alter any existing entry's display or filtering.
- Weight must remain comparable across the full catalog as a single number (the pair total), regardless of whether a per-wheel breakdown exists.
- The ingestion format change must remain compatible with the planned scaling approach described in `product-overview.md` (migration from `wheelsData.js` to external JSON or lightweight backend).

---

## 10. Test Plan

### Automated tests expected
- Cell renderer: verify `50 / 60 mm` output for a pair, `45 mm` for a scalar (per AC-002).
- Filter engine: verify OR semantics for dimensional pairs (per AC-003); verify pair-total semantics for weight (per AC-005).
- Sort engine: verify max-value resolution for dimensional pairs (per AC-007); verify pair-total sort for weight.
- Ingestion validator: verify acceptance of both forms (per AC-008); verify rejection/normalization of incomplete pairs and ineligible divergence (per AC-009).

### Manual tests expected
- Visual review of a divergent rim depth cell in the live comparator (`50 / 60 mm` renders correctly, unit suffix is not duplicated).
- Visual review of a weight cell with breakdown (pair total is dominant, breakdown is legible as detail).
- Spot-check filter results: confirm a wheelset with front 50 / rear 60 appears when the rim depth filter is set to 58–65 mm.

### Edge cases
- Wheelset where both front and rear are identical — must render as a single value, not as `60 / 60 mm`.
- Weight entry with only a pair total (no breakdown) — must display the total with no breakdown detail, no error.
- Weight entry with front/rear only (no declared total) — must compute and display the sum; must not require a declared total key.
- Ingestion entry with only one side of a pair — must normalize to single value with warning, not crash.

### Non-regression
- Full existing test suite run against single-value-only catalog: all display, filter, and sort results must be identical to the pre-EVO-038 baseline (per AC-006).
