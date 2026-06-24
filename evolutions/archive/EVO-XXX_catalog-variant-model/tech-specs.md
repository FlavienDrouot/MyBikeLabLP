# Technical Specifications

## 1. General Information

- Evolution ID: EVO-044
- PRD reference: `prd.md` (EVO-044, v1.0, validated 2026-06-04)
- Author: Flavien Drouot (with Claude)
- Date: 2026-06-04

---

## 2. Technical Context

### Technical objective

Make every buyable configuration of a wheel model a first-class, comparable unit in the
catalog, while keeping sibling configurations recognizable as a collapsible group. Migrate
variant data that is currently hidden in `other_specs` (Caden) into explicit configuration
objects, expose the three comparable axes (spoke material, rim width, brake type) as
filterable **and** sortable, and add a collapse/expand group view with filter-driven
auto-expansion. No backend exists: the change is a data/code edit to the inline
`wheelsData_*.js` modules plus the comparator front end.

### Affected architecture

- **Data layer** — `src/data/wheelsData_*.js` (configuration objects), `wheel-format.json`
  (schema), `wheelValidator.js` (no structural change expected; verify).
- **Selector layer** — `src/store/selectors/wheelsSelectors.js` (`selectFilteredWheels`
  stays flat; a new grouping selector layers on top).
- **Registry** — `src/config/wheelProperties.jsx` (add sorts to the two categorical axes).
- **View layer** — `MiniComparator/ComparisonTable.jsx` (group rows, collapse/expand),
  `WheelDetailPanel.jsx` (per-configuration surfacing), i18n locale files.

### Impacted modules

- `workflows/datascraping/wheel-format.json`, `workflows/datascraping/README.md`,
  `MyBikeLab/scripts/DatascrapingPrompt.md`, `MyBikeLab/domain-vocabulary.md` (schema +
  vocabulary contract).
- `src/data/wheelsData_caden.js` (real explosion); `wheelsData_{mavic,roval,zipp,enve}.js`
  (audit: confirm no comparable variant data remains in `other_specs`).
- `src/config/wheelProperties.jsx`, `src/store/selectors/wheelsSelectors.js`.
- `src/components/MiniComparator/{ComparisonTable,WheelDetailPanel}.jsx`.
- `frontend/public/locales/{en,fr,xx}.json`.

---

## 3. Technical Constraints

- **Flat catalog invariant**: `state.wheels.items` and `selectFilteredWheels` must remain a
  flat list of comparable units. Grouping is a presentation transform on top, never a change
  to the filter/sort contract.
- **One-property-one-registry-entry**: any new comparable behavior goes through
  `WHEEL_PROPERTIES`; do not hardcode axis logic in components or selectors.
- **i18n preserved**: spoke material and brake type keep the `translatable` + locale-key
  mechanism (bilingual FR/EN). Title Case is delivered at the display layer by i18n, not by
  storing Title Case strings in data (see AD-003).
- **ID reservations**: no new identifier may fall in 50–128 (Panda Podium) or 129–137
  (Caden source block). New exploded configurations use a fresh range starting at **200**.
- **Diameter convention** unchanged (raw 622 / frontend 700).
- **EVO-038 untouched**: front/rear divergent specs (`{ front, rear }` pairs) and the
  `resolveSpec` path keep their current behavior and are never treated as variant axes.
- **Freehub untouched**: `hub.freehub_options` stays an informational `multiSelectFlat`
  list, never promoted to a comparable axis.
- Each task must stay independently mergeable: the data task adds fields with no consumer
  yet; the selector/registry tasks are inert until the view task consumes them.

---

## 4. Architecture Decisions

### AD-001
#### Description
Storage shape = **flat SKU explosion**. Each buyable configuration is a complete top-level
wheel object in the brand arrays / `items`, in exactly the current shape, carrying its own
`weight_grams`, `prices`, `spokes.material`, `rim.internalWidth_mm`/`externalWidth_mm` and
`brake_type`. Variant data currently encoded inside `other_specs` is exploded into new
sibling objects, each with its own `id`. No nested `configurations[]` array is introduced.

#### Motivation
The registry, `selectFilteredWheels`, every accessor/`filterAccessor`, and the memoized
option/count/bounds selectors all assume one flat object per comparable unit. Explosion
keeps that entire machinery untouched: filtering and sorting operate on configurations
directly, and grouping becomes a pure post-filter presentation transform. This also makes
FR-005 (filter-driven auto-expansion) trivial — filtering prunes the flat list first, then
grouping buckets the survivors.

#### Rejected alternatives
- **Nested `configurations[]` on a model object**: would force every selector, accessor and
  filter to flatten before operating, breaking memoization and the registry contract — a
  deep rewrite for no product gain.
- **Keeping variants in `other_specs`**: violates FR-001/FR-008; values are not comparable.

### AD-002
#### Description
Model-group linkage = an optional **`model_group`** string key plus an optional
**`model_group_label`** on each configuration. Sibling configurations share an identical
`model_group` slug (e.g. `'caden-decadence-50'`) and an identical `model_group_label` (the
collapsed-row display name, e.g. `'deCADENce 50mm Tubeless'`). A configuration with no
`model_group` renders as a standalone row, identical to today (FR-006).

**Model identity rule (interpretation):** configurations of one model differ **only** on the
three comparable axes (spoke material, rim width, brake type). Any difference on a non-axis
dimension (rim depth, hub, wheelset category, diameter) makes it a **distinct model**, not a
sibling. Consequently Caden depth variants (35/45/50/60/75/105mm) remain separate ungrouped
rows; only same-model carbon-vs-steel-spoke pairs and same-model rim-width variants form a
group.

#### Motivation
A shared string is the minimal, serializable addition; no structural nesting; future
scraping simply emits the same key on siblings. Storing the label explicitly avoids fragile
prefix-derivation from `model`.

#### Rejected alternatives
- **Derive groups by string-prefix matching on `model`**: brand-specific and fragile.
- **A separate `modelGroups` registry/object with join logic**: extra indirection and a new
  lookup table for a relationship a single key already expresses.

### AD-003
#### Description
Closed axis vocabulary = **canonical i18n keys + display-layer Title Case**. The categorical
axes (spoke material, brake type) keep the existing `translatable` locale-key mechanism. A
closed canonical key set is defined per axis and the data is normalized so one physical
option maps to exactly one key across all brands (no casing/format duplicates). Title Case is
produced by the locale labels (already `"Carbon"`, `"Disc"`, `"Stainless steel"`). Rim width
is **numeric** (mm) and stays a `range` filter — the closed-vocabulary requirement does not
apply to it.

Canonical sets:
- **brake type** (`brake_type`): `disc`, `rim`, `track` → "Disc" / "Rim" / "Track".
- **spoke material** (`spokes.material`): `carbon`, `carbon_composite`, `stainless_steel`,
  `steel`, `aluminum`. (See OPEN QUESTION on whether `steel` and `stainless_steel` should be
  merged — default for this spec is to keep both, as they may be physically distinct.)

#### Motivation
Preserves bilingual FR/EN support and every existing i18n test; satisfies FR-003 (uniform,
no duplicate options) through canonical keys. fix-013 already kept i18n for these axes and
reserved literal Title Case storage for non-i18n categoricals (`disc_standard`,
`freehub_options`) — this decision is consistent with that precedent.

#### Rejected alternatives
- **Store Title Case strings in data and drop i18n for these axes**: breaks French labels
  (`"Disque"`, `"Patins"`, `"Acier"`) and rewrites the translatable-field machinery for no
  user-visible gain.

### AD-004
#### Description
Grouping is a **presentation transform** in a new memoized selector,
`selectGroupedWheels`, that consumes the already-filtered, already-sorted flat output of
`selectFilteredWheels` and buckets it by `model_group`. It emits an ordered list of row
descriptors:
- **standalone**: a single configuration with no `model_group` → a plain row (today's
  behavior).
- **group**: a `model_group` with ≥1 surviving configuration → `{ groupId, label,
  representative, configurations[], siblingCount, survivingCount }`.

The representative is the lightest surviving configuration (lowest resolved total weight;
ties broken by lowest min price, then id). `siblingCount` is the group's total configuration
count in the unfiltered catalog; `survivingCount` is how many survived the current filters.

**Auto-expand rule (FR-005):** a group renders expanded automatically when
`survivingCount < siblingCount` (a filter has pruned siblings → reveal the survivors) or when
the user has manually expanded it. Otherwise it renders collapsed, showing the representative
row. Non-matching configurations are already absent from the flat list, so "configurations
that do not match are not shown" and "a group with no matching configuration is excluded
entirely" hold without extra logic.

#### Motivation
Keeps `selectFilteredWheels` and the filter/sort contract intact; isolates all group logic in
one pure, unit-testable selector; expresses auto-expansion as derived data rather than view
state.

#### Rejected alternatives
- **Compute groups inline in `ComparisonTable`**: mixes data logic into the view, untestable
  in isolation, and recomputed on every unrelated render.

---

## 5. Task Breakdown

Each task is described in a dedicated file using `shared-knowledge/templates/TASK-TEMPLATE.md`.

| Task | File | Summary | Dependencies |
|------|------|---------|--------------|
| TASK-001 | `TASK-001.md` | Schema, closed-vocabulary & scraping-docs contract (`wheel-format.json`, `domain-vocabulary.md`, datascraping README, `DatascrapingPrompt.md`) | none |
| TASK-002 | `TASK-002.md` | Catalog data migration: explode Caden variants, add `model_group`/`model_group_label`, strip variant data from `other_specs`, audit other four brands | TASK-001 |
| TASK-003 | `TASK-003.md` | Registry: add sorts to `spokeMaterial` and `brakeType`; confirm all three axes filterable + sortable | none |
| TASK-004 | `TASK-004.md` | `selectGroupedWheels` grouping selector with auto-expand survivor model (pure logic) | TASK-001 |
| TASK-005 | `TASK-005.md` | `ComparisonTable` grouped rendering: collapse/expand, filter-driven auto-expand, representative row | TASK-003, TASK-004 |
| TASK-006 | `TASK-006.md` | i18n: grouping UI strings + locale vocabulary keys (`en`/`fr`/`xx`) | TASK-001, TASK-005 |
| TASK-007 | `TASK-007.md` | `WheelDetailPanel`: surface per-configuration axis values + sibling context | TASK-005 |

---

## 6. Global Validation Strategy

### Unit validation
- `selectGroupedWheels`: bucketing, representative selection, `siblingCount`/`survivingCount`,
  auto-expand flag, standalone pass-through, empty-group exclusion (TASK-004).
- Registry: `getAllSorts()` exposes spoke-material and brake-type sorts; categorical sort
  ordering via `localeCompare` (TASK-003).
- Data integrity: every configuration's displayed weight/price belongs to that configuration;
  no `other_specs` key in the migrated set carries spoke-material / rim-width / brake-type /
  per-variant weight / per-variant price (TASK-002, AC-002/AC-003).

### Integration validation
- Filtering on each axis restricts results to matching configurations and a multi-config
  group auto-expands to reveal only the survivors (AC-001, AC-004).
- All five brand files load and render under the updated schema; Caden's flattened variants
  appear as distinct configurations (AC-006).

### Functional validation (manual — see TEST-PROTOCOL)
- Collapse/expand and filter-driven auto-expansion of grouped configurations (AC-004).
- EVO-038 asymmetric SKUs render as before and are not grouped; `hub.freehub_options`
  remains an informational list (AC-007).

### Non-regression validation
- Full Vitest suite green; existing non-variant filters/sort/columns unchanged.
- `npm run lint` clean.
- i18n test suite (`wheelProperties.i18n.test.js`) green: no raw `<id>.<value>` key leaks,
  all axis values resolve in en/fr/xx.

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|---|---|---|
| New exploded IDs collide with a reserved range | Data corruption / AC-008 fail | Allocate from 200+; add an automated test asserting no id ∈ [50,137] is newly introduced and ids are unique |
| Grouping changes the visible row count and breaks column-width measurement (`MeasuringTable` measures `allWheels`) | Layout jitter | `MeasuringTable` keeps measuring the flat `allWheels`; group rows reuse measured column widths; verify width test still green |
| Auto-expand rule misfires when a filter prunes some but the user also collapsed manually | Confusing UX | Auto-expand is derived (`survivingCount < siblingCount`); manual collapse only applies when not pruned; cover both in tests |
| Carbon-spoke sibling price not in current data | Wrong/blank price | Source carbon price from Caden page during migration; if unavailable set `null` ("N/A"), never copy the steel price (FR-001) |
| Representative-weight tie-breaking hides a cheaper sibling in collapsed view | Minor UX | Tie-break lowest weight → lowest price → id; documented and tested |

---

## 8. Rollback Plan

- The change is additive at the data level (`model_group`/`model_group_label` are optional).
  Reverting the view + selector + registry commits restores the flat table while leaving the
  migrated data harmless (extra fields are ignored by the old code path).
- Full rollback = revert the EVO-044 commits on the feature branch; no schema migration or
  persisted state is involved (frontend-only, inline data).
- The Caden data explosion is the only non-additive edit; it is contained to
  `wheelsData_caden.js` and reversible from git history.
