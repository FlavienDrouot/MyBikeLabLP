# PRD — Product Requirements Document

## 1. General Information

- Evolution ID: EVO-044
- Title: Structured product-variant model in the wheel catalog
- Author: Flavien Drouot (with Claude)
- Date: 2026-06-04
- Version: 1.0 (awaiting validation)
- Needs Assessment reference: `needs-assessment.md` (EVO-044, validated 2026-06-04)

---

## 2. Functional Objective

After this evolution, every buyable configuration of a wheel model is a first-class,
comparable catalog unit. The comparator can filter, sort and compare configurations on
their own weight, price and variant axes — **spoke material, rim width, brake type** —
instead of those axes being hidden in the free-form `other_specs` object or absorbed into
an arbitrary "base" value. Sibling configurations of one model remain recognizable as a
group so the list stays readable at catalog scale (~150–200 wheels).

---

## 3. Target Behavior

### General description

A wheel model that is sold in a single buyable configuration appears as a single
comparable row, exactly as today. A model sold in several buyable configurations exposes
each configuration as its own comparable unit, each carrying its own weight, price and the
three comparable variant axes.

In the list, configurations of the same model are **collapsed by default** into one
representative group row. The user can expand the group manually. When an active filter
matches one or more specific configurations of a collapsed group, the matching
configurations surface automatically (the group auto-expands to reveal them), so a filtered
result never hides the configuration that satisfies the filter.

The three comparable axes are exposed through a closed, cross-brand-uniform, Title Case
vocabulary, so a single generic UI works across every brand. Freehub options remain an
informational, non-exploded list and are not a comparison axis. Front/rear asymmetric SKUs
(EVO-038) keep their current behavior and are never treated as variants.

---

## 4. Functional Rules

### FR-001 — Configuration as the comparable unit
Each buyable configuration of a model is a distinct comparable unit. Its displayed weight
and price correspond unambiguously to that specific configuration. No displayed value may
come from an undocumented "base" choice.

### FR-002 — Comparable variant axes
Exactly three axes are comparable: **spoke material**, **rim width**, **brake type**. Each
is independently filterable and sortable in the comparator, on the same footing as existing
spec axes.

### FR-003 — Closed, uniform vocabulary
Each comparable axis draws its values from a closed, cross-brand vocabulary expressed in
Title Case (consistent with fix-013). The same physical option carries the same value
across all brands, so filter options never duplicate (e.g. "Steel" / "Carbon" for spoke
material, never "steel"/"Carbon spokes").

### FR-004 — Model grouping
Configurations of the same model are linked to a shared model group. The comparator
presents a group as a single collapsed row by default and lets the user expand it to see
the individual configurations.

### FR-005 — Filter-driven auto-expansion
When an active filter matches one or more configurations inside a collapsed group, those
matching configurations are surfaced automatically. Configurations that do not match the
active filters are not shown. A group with no matching configuration is excluded from the
results entirely.

### FR-006 — Single-configuration models unchanged
A model with only one buyable configuration appears as a single row, with no group
affordance and no behavioral change from today.

### FR-007 — No fabricated siblings
A configuration that exists for only one value of an axis must not generate a phantom
sibling for the other values (e.g. a width offered only with steel spokes must not produce
a carbon-spoke sibling).

### FR-008 — No variant data in `other_specs`
For the migrated brands, no comparable variant information (spoke material, rim width,
brake type, per-variant weight or price) remains in `other_specs`. `other_specs` keeps only
genuinely unstructured, non-comparable notes.

### FR-009 — Per-configuration price
Price is carried per configuration. When two configurations of the same model have
different prices, each shows its own price; when they share a price, each shows that shared
price. The model must be able to express a per-configuration price even though no current
brand uses it.

### FR-010 — Preserved adjacent behaviors
Front/rear asymmetry (EVO-038) and the freehub informational option list
(`hub.freehub_options`) are unchanged in behavior. Freehub is not promoted to a comparable
axis.

### FR-011 — ID reservations respected
Any new or expanded catalog identifiers respect the existing reservations: ids 50–128
(Panda Podium, not integrated) and 129–137 (Caden). The exact id allocation scheme is a
technical decision deferred to Tech Specs.

---

## 5. Detailed Use Cases

### UC-001 — Filter on a comparable variant axis

#### Preconditions
- The catalog contains a model with carbon-spoke and steel-spoke configurations.

#### Steps
1. The user opens the comparator.
2. The user sets filters: spoke material = "Carbon" and weight < 1300 g.
3. The user reads the results.

#### Expected result
- Only configurations that are carbon-spoke and under 1300 g are shown.
- For an affected model, its group auto-expands to reveal the matching carbon-spoke
  configuration; the non-matching steel configuration is not shown.
- Each shown configuration displays the weight and price of that exact configuration.

#### Error cases
- A model whose only carbon configuration is over 1300 g is excluded entirely (no group
  row, no phantom row).

### UC-002 — Browse a grouped model without filters

#### Preconditions
- A model is sold in several configurations.

#### Steps
1. The user opens the comparator with no variant filter active.
2. The user sees the model as one collapsed group row.
3. The user expands the group.

#### Expected result
- Collapsed, the group shows one representative row for the model.
- Expanded, every buyable configuration is listed as its own comparable row with its own
  weight, price and axis values.

#### Error cases
- None.

### UC-003 — Single-configuration model

#### Preconditions
- A model is sold in exactly one configuration.

#### Steps
1. The user browses or filters the catalog.

#### Expected result
- The model appears as a single ordinary row, with no group affordance, identical to
  pre-EVO behavior.

#### Error cases
- None.

### UC-004 — Configuration with a distinct price (future brand)

#### Preconditions
- A model has two configurations with different prices.

#### Steps
1. The user expands the group (or filters to one configuration).

#### Expected result
- Each configuration displays its own price; sorting by price orders configurations by
  their individual prices.

#### Error cases
- None.

---

## 6. Acceptance Criteria

### AC-001
#### Description
Spoke material, rim width and brake type are each independently filterable and sortable in
the comparator.
#### Expected verification
For each axis, applying a filter restricts results to matching configurations, and sorting
on the axis orders the configurations accordingly.
#### Type
- Automated

### AC-002
#### Description
Each buyable configuration is a distinct comparable unit whose displayed weight and price
belong to that configuration.
#### Expected verification
For a multi-configuration model, expanded rows show distinct, configuration-specific weight
and price values; no value is sourced from a generic "base".
#### Type
- Automated

### AC-003
#### Description
No comparable variant data remains in `other_specs` for the migrated brands.
#### Expected verification
Inspection of the five migrated brand data files shows no spoke-material, rim-width,
brake-type, per-variant weight or per-variant price keys inside `other_specs`.
#### Type
- Automated

### AC-004
#### Description
Sibling configurations are linked to a shared model group and collapse/expand correctly,
with filter-driven auto-expansion.
#### Expected verification
A multi-configuration model renders as one collapsed group by default; manual expand shows
all configurations; a filter matching a subset auto-surfaces only the matching
configurations.
#### Type
- Manual

### AC-005
#### Description
Variant axis values use a closed, cross-brand-uniform, Title Case vocabulary.
#### Expected verification
All axis values across brands belong to the defined closed vocabulary and are Title Case;
no duplicate filter options appear for the same physical option.
#### Type
- Automated

### AC-006
#### Description
The five existing brands (Mavic, Roval, Zipp, ENVE, Caden) conform to the new model.
#### Expected verification
All five data files load and render under the updated schema without variant data in
`other_specs`; Caden's flattened variants appear as distinct configurations.
#### Type
- Automated

### AC-007
#### Description
Front/rear asymmetry (EVO-038) and freehub option lists are unchanged in behavior.
#### Expected verification
Asymmetric SKUs render as before and are not grouped as variants; `hub.freehub_options`
remains an informational list and is not exposed as a comparable filter.
#### Type
- Manual

### AC-008
#### Description
New or expanded identifiers respect the 50–128 (Panda Podium) and 129–137 (Caden)
reservations.
#### Expected verification
No catalog identifier introduced by the migration falls within a reserved range belonging
to another source.
#### Type
- Automated

---

## 7. Functional Impacts

### Impacted components
- Comparator filters (add/adjust spoke material, rim width, brake type axes).
- Comparator sort.
- List view (collapsed group rows, manual expand, filter-driven auto-expansion).
- Wheel detail panel (per-configuration specs and price).
- Price selection/display (per configuration).

### Impacted data
- `wheel-format.json` schema (variant model, model-group linkage, closed axis vocabulary).
- The five brand data files (Mavic, Roval, Zipp, ENVE, Caden) — migration off `other_specs`.
- Datascraping transformation rules in `workflows/datascraping/README.md` (produce the new
  shape going forward).

### Impacted APIs
- None (no backend; data lives in inline `wheelsData_*.js` modules).

### Impacted permissions / roles
- None.

---

## 8. Out of Scope

- Front/rear asymmetry handling (Case E) — owned by EVO-038; must not be altered or absorbed.
- Freehub as a comparison axis — stays an informational option list.
- Integration of the Panda Podium raw scrape (ids 50–128) — only its id range is reserved.
- The technical storage shape (full SKU explosion vs hybrid), model-group linkage mechanism,
  and id-allocation scheme — deferred to Tech Specs.

---

## 9. Constraints

- A displayed weight or price must unambiguously correspond to one buyable configuration,
  never to an undocumented "base".
- Variant axis values must be Title Case canonical (fix-013 discipline) to avoid duplicate
  filter options.
- Diameter convention: raw = 622 (ETRTO), frontend = 700 — unchanged.
- ID reservations: 50–128 (Panda Podium), 129–137 (Caden) must be respected.
- No backend: migration is a code/data edit to inline `wheelsData_*.js` modules.

---

## 10. Test Plan

### Automated tests expected
- Filter and sort on each comparable axis (AC-001).
- Per-configuration weight/price integrity (AC-002).
- Absence of variant data in `other_specs` for migrated brands (AC-003).
- Closed, Title Case vocabulary with no duplicate options (AC-005).
- All five brand files load/render under the new schema (AC-006).
- No identifier collides with a reserved range (AC-008).

### Manual tests expected
- Collapse/expand and filter-driven auto-expansion of grouped configurations (AC-004).
- EVO-038 asymmetry and freehub list behavior unchanged (AC-007).

### Edge cases
- Configuration existing on only one axis value (no phantom sibling — FR-007).
- Single-configuration model rendered as one ordinary row (FR-006).
- Group with no configuration matching active filters excluded entirely (FR-005).

### Non-regression
- Existing non-variant filters/sort/columns behave as before.
- EVO-038 asymmetric SKUs unaffected.
- Freehub informational lists unaffected.
</content>
</invoke>
