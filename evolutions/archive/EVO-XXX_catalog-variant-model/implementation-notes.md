# Implementation Notes — EVO-044

## Test Summaries

### Baseline Vitest summary (before implementation)
```
Files: 17 passed, 0 failed
Tests: 205 passed, 0 failed
Duration: 4.02s
Exit code: 0
```
Baseline clean — no pre-existing failures.

### Regression Vitest summary (after implementation)
```
Files: 18 passed, 0 failed
Tests: 237 passed, 0 failed
Duration: 4.55s
Exit code: 0
```
Clean. +32 tests over baseline (205 → 237), +1 file (the new grouping component test).
`npm run lint` clean and `npm run build` succeeds.

---

## Execution batches

- Batch 1: TASK-001 (docs/schema), TASK-003 (registry sorts)
- Batch 2: TASK-002 (data migration), TASK-004 (grouping selector)
- Batch 3: TASK-005 (ComparisonTable grouped rendering)
- Batch 4: TASK-006 (i18n), TASK-007 (WheelDetailPanel)

---

## TASK-001 — Schema, vocabulary & scraping-docs contract

- `wheel-format.json`: added optional `model_group` / `model_group_label` top-level fields;
  documented id-allocation (200+, reserved 50–137); rewrote `other_specs` description to forbid
  comparable variant data; widened `brake_type` to `disc|rim|track` and `spokes.material` to the
  five canonical keys, both flagged as comparable axes.
- `domain-vocabulary.md`: added a "Comparable Variant Axes" section (three axes, canonical key
  sets, model-group definition, model-identity rule, id allocation, not-axes list, open question).
- `datascraping/README.md`: added "Step 4 — Explode Comparable Variants" with the full rule set.
- `scripts/DatascrapingPrompt.md`: added a "Comparable variant configurations" subsection.

**Design decisions:** kept `steel`/`stainless_steel` open question unresolved (both valid keys),
per task constraint.

**Validation:** documentation/schema only; no runtime file changed; suite stayed green.

## TASK-003 — Registry sorts for the two categorical axes

- `wheelProperties.jsx`: added `sorts: [{ id:'spokeMaterial', label:'sorts.spokeMaterial',
  direction:'localeCompare' }]` to `spokeMaterial` and the equivalent `brakeType` sort.
- `wheelsSelectors.test.js`: added unit tests asserting `getAllSorts()` exposes both with a
  working accessor, and that sorting by each orders by `localeCompare` with missing values last.

**Deviation (with rationale):** TASK-003 stated the existing sort comparator "already pushes
missing values to the end" for `localeCompare`. It does **not** — the `localeCompare` branch
returned before the missing-handling block, so `null` was stringified to `"null"` and sorted
mid-list (between `aluminum` and `stainless_steel`). To satisfy the task's own validation
criterion ("missing values last"), the missing-value guard in `selectFilteredWheels` was hoisted
above the `localeCompare` branch and extended to treat `''` as missing. This is the minimal
change needed; numeric sorts behave identically to before. No other selector behavior changed.

**Validation:** `getAllSorts()` includes both ids; both sorts order by raw value with missing
last; rim-width sorts/filters untouched; lint clean; full suite green (208 tests, +3).

## TASK-002 — Catalog data migration (Caden explosion + audit)

Exploded Caden's `other_specs`-hidden variants into first-class sibling configurations:

| Base | New siblings (id ≥ 200) | Axis | model_group |
|---|---|---|---|
| 129 (35mm) | 200 carbon-spoke (1030g) | spoke material | `caden-decadence-35` |
| 130 (45mm) | 201 carbon-spoke (1120g) | spoke material | `caden-decadence-45` |
| 131 (50mm) | 202 (37mm,1310g), 203 (40mm,1370g) | rim width | `caden-decadence-50` |
| 132 (60mm) | 204 carbon-spoke (1285g) | spoke material | `caden-decadence-60` |
| 133 (CDA 55) | 205 carbon-spoke (1205g) | spoke material | `caden-cda-55` |
| 134 (CDA 65) | 206 carbon-spoke (1270g) | spoke material | `caden-cda-65` |

- Stripped forbidden keys from `other_specs` on all migrated entries (`carbon_spoke_option`,
  `weight_carbon_spoke_grams`, `external_width_options_mm`, `weight_pair_grams`).
- ids 135/136/137 stay standalone (no group): 135 had `carbon_spoke_option:false`; 136/137 are
  EVO-038 `{front,rear}` pairs and are never exploded/grouped.
- **Audit**: Mavic/Roval/Zipp/ENVE carry no comparable variant data in `other_specs` (grep for
  forbidden keys returned nothing); Zipp's `spoke_count`/`spoke_length` are non-comparable.

**Design decisions / deviations:**
- **Carbon-spoke prices = `null`** (per user decision; could not source the Caden carbon price).
  Each carbon sibling carries `prices:[{price_eur:null}]` and `affiliateLinks.manufacturer.price_eur:null`
  — never the steel sibling's price (FR-001). Renders "N/A".
- **Rim-width siblings (202/203) inherit the base 50mm price** (1459) — width does not affect price.
- **Sibling model names** append ` (Carbon Spokes)` / ` (37mm)` etc. For ids 133/134 the source
  `model` already contains "Carbon Spoke" (yet base `spokes.material` is `stainless_steel`), so the
  carbon sibling name reads redundantly (`…Carbon Spoke Tubeless (Carbon Spokes)`). Kept faithful to
  the source rather than renaming the base (out of scope). **Open question / recommended follow-up:**
  clean up the CDA base naming in a future light fix.
- `model_group_label` for the CDA groups drops "Carbon Spoke" (`deCADENce CDA 55mm Tubeless`) so the
  collapsed label does not imply all siblings are carbon.

**Tests:** id uniqueness + no id in gap (137,200) + exploded ids ≥ 200 (AC-008); no forbidden
`other_specs` key across the catalog (AC-003); 50mm exposes 3 width configs, 35mm exposes
steel+carbon with distinct weights and null carbon price, shared labels per group (AC-002/AC-006).

## TASK-004 — `selectGroupedWheels` grouping selector

Added a memoized selector layered on `selectFilteredWheels` (AD-004). Emits ordered descriptors:
`{kind:'single',wheel}` or `{kind:'group',groupId,label,representative,configurations,siblingCount,
survivingCount,autoExpanded}`. Representative = lightest survivor (tie → lowest price → lowest id).
`siblingCount` from unfiltered `items`; `autoExpanded = survivingCount < siblingCount`. A
`model_group` with a single catalog sibling degrades to `kind:'single'`. Pure, no mutation.

**Tests:** bucketing, representative + tie-break, autoExpanded under no/partial/full prune, group
absent when empty, single-sibling → single, order preservation, no mutation of filtered output.

## TASK-005 — `ComparisonTable` grouped rendering

- Row source switched from the flat list to `selectGroupedWheels`; `MeasuringTable` still measures
  the flat `allWheels` (column widths stay stable — width test green).
- Group rows: representative row carries a real `<button aria-expanded>` group toggle (with sibling
  count) in the model cell; expanding reveals each remaining sibling as its own configuration row.
- Effective expansion = `autoExpanded || manualExpanded[groupId]`. Auto-expanded toggle is
  `disabled` with `opacity-40 cursor-not-allowed` (never `display:none`). Manual state is reset when
  the surviving set changes, via React's adjust-state-during-render pattern (lint forbids setState in
  effects).
- Per-row `WheelDetailPanel` expansion preserved for every configuration row. Header count keeps
  counting configurations (`{filtered} of {total}`).

**Deviation:** the embedded UI-guideline asks for asymmetric expand/collapse row animation. Inserting
table rows cannot animate height with transform/opacity only; the toggle chevron animates
(`transform`, `motion-reduce`-safe) and the detail panel keeps its existing opacity/transform
transition, but revealed sibling rows appear without an entry animation. Noted as a minor tradeoff.

**Tests (new `ComparisonTable.grouping.test.jsx`):** collapsed-by-default, manual expand/collapse,
filter-driven auto-expand + disabled toggle, group absent when no match, standalone unchanged,
per-config weight on each row. Existing ComparisonTable + column-width tests stay green.

## TASK-006 — i18n

- Added `sorts.spokeMaterial` / `sorts.brakeType` and `table.groupExpand` / `table.groupCollapse` /
  `table.groupConfigurations_one|_other` (count interpolation) to `en` and `fr`. `xx` resolves any
  string key to "XX" via the existing pseudo-locale postProcessor, so no `xx.json` edit was needed.
- Brake-type values already had en/fr labels (`disc`/`rim`/`track`); spoke-material values already
  complete. No Title Case stored in data (AD-003).

**Tests:** new sort/group keys resolve in en/fr/xx; singular/plural count in en; every dataset
brakeType value resolves to a non-raw label in all locales.

## TASK-007 — `WheelDetailPanel` per-configuration axes

Added a 3-column axis block (label above value) surfacing the open configuration's spoke material
and brake type (localized via `spokeMaterial.*` / `brakeType.*`) and external rim width (mm, with
`{front,rear}` support). Missing values fall back to `common.notAvailable`. Price ledger, image
carousel and stacked-breakpoint behavior untouched.

**Tests:** axis values render localized for a configuration; two siblings show distinct values;
price-ledger non-regression alongside the axis block.
