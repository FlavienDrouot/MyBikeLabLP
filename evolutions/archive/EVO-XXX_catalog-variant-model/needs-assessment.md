# Needs Assessment

## 1. General Information

- Evolution ID: EVO-044
- Title: Structured product-variant model in the wheel catalog
- Author: Flavien Drouot (with Claude)
- Date: 2026-06-04
- Status: Needs Assessment — awaiting validation
- Priority: High (blocks consistent multi-brand scraping; surfaced by the Caden integration)

---

## 2. Context

### Current situation
The catalog unit is the wheelset (a front + rear pair, resolved EVO-038). One catalog
entry = one model. When a model is sold in several buyable configurations (e.g. steel vs.
carbon spokes, several rim widths, disc vs. rim brake), those configurations are flattened
into the free-form `other_specs` object or promoted as an arbitrary "base" value:

- Spoke material: one entry with `weight_grams` = steel weight, carbon weight hidden in
  `other_specs.weight_carbon_spoke_grams` + `other_specs.carbon_spoke_option`.
- Rim width: base = narrowest/lightest width, other widths in
  `other_specs.external_width_options_mm` (array of `{externalWidth_mm, weight_grams}`).
- Brake type: scalar `brake_type` + free-text `other_specs.brake_note`.
- Freehub: already cleanly modeled as a closed-vocabulary list `hub.freehub_options`.

### Identified problem
1. **Lost comparability** — variant specs (carbon-spoke weight, alternative widths, rim-brake
   option) never reach the comparator's filters/sort; they are buried in unstructured `other_specs`.
2. **Cross-brand inconsistency** — `other_specs` is a free-form catch-all; each brand names its
   variants differently, so no generic UI can be written over it.
3. **Arbitrary "base" choice** — promoting "steel" or "narrowest width" as the canonical value
   is undocumented and biases the weight/price shown in comparisons.
4. **No price expressivity** — if a variant carries a different price (not the case at Caden, but
   likely for other brands), the current model cannot express it.

### Business motivation
The catalog is scaling from ~15 to ~150–200 wheels via scraping (product-overview Phase A). A
consistent, comparable variant model is a prerequisite for trustworthy cross-brand comparison —
the core value proposition — and for a scraping pipeline that produces uniform data across brands.

---

## 3. Business Objective

Replace the ad-hoc `other_specs` flattening of product variants with a structured,
cross-brand-consistent model in which **each buyable configuration is a first-class catalog
unit** that the comparator can filter, sort and compare on its own specs and price.

---

## 4. Scope

### Included
- A variant data model: each buyable configuration is its own comparable unit (SKU), with
  sibling configurations linked under a shared model group, and visual grouping in the list so
  near-duplicates do not flood the comparator.
- A closed vocabulary for the comparable variant axes: **spoke material**, **rim width**,
  **brake type**.
- `wheel-format.json` schema update.
- Datascraping pipeline rules update (transformation steps in `workflows/datascraping/README.md`).
- Retroactive migration of the 5 existing brand files: Mavic, Roval, Zipp, ENVE, Caden.
- Frontend changes: filters, sort, list view (with grouping), detail panel, price selection.

### Excluded
- **Front/rear asymmetry (Case E)** — a characteristic of a single asymmetric SKU, already
  handled by EVO-038. The variant model must not alter or absorb it.
- **Freehub** — stays an informational, non-exploded option list (`hub.freehub_options`); it is
  not a comparison axis.
- The Panda Podium raw scrape (ids 50–128) remains out of the catalog; this EVO only reserves
  its id range, it does not integrate it.

---

## 5. Constraints

### Business constraints
- Comparisons must stay trustworthy: a displayed weight/price must unambiguously correspond to a
  specific buyable configuration, never to an undocumented "base".

### Known technical constraints
- **ID allocation:** ids 50–128 are reserved by `Datascrapping_PandaPodium.json` (not integrated);
  Caden occupies 129–137. Any new ids or any explosion into SKUs must respect these reservations.
- Diameter convention: raw = 622 (ETRTO), frontend = 700.
- Categorical values are Title Case canonical (resolved fix-013); the new variant vocabulary must
  follow the same casing discipline to avoid duplicate filter options.
- Current data lives in inline `wheelsData_*.js` modules (no backend); migration is a code/data edit.

### Regulatory / security constraints
- None.

---

## 6. Use Cases

### Nominal case
As a cyclist comparing wheels,
I want each buyable configuration (e.g. Caden 50mm carbon-spoke 37mm-wide) to appear as its own
comparable row with its own weight and price,
So that I can filter "weight < 1300 g, carbon spokes" and trust the result.

### Alternative cases
- A model with no variants (single configuration) appears as a single row, unchanged.
- Sibling configurations of one model are visually grouped so the list is not flooded.
- A variant axis with a distinct price (future brand) carries its own price.

### Known error cases
- A configuration that exists on only one axis value (e.g. Caden 75mm: steel only) must not
  fabricate a phantom carbon sibling.
- Front/rear asymmetric SKUs must not be mistaken for variants.

---

## 7. Acceptance Criteria

- [ ] Spoke material, rim width, and brake type are independently filterable and sortable in the
      comparator.
- [ ] Each buyable configuration is a distinct comparable unit matched on its own weight and price.
- [ ] No variant data remains in `other_specs` for the migrated brands.
- [ ] Sibling configurations are linked to a shared model group and visually grouped in the list.
- [ ] Variant axis values use a closed, cross-brand-uniform, Title Case vocabulary.
- [ ] The 5 existing brands (Mavic, Roval, Zipp, ENVE, Caden) conform to the new model.
- [ ] Front/rear asymmetry (EVO-038) and freehub option lists are unchanged in behavior.
- [ ] New/expanded ids respect the 50–128 (Panda Podium) and 129–137 (Caden) reservations.

---

## 8. Open Questions

- Exact model shape: full SKU explosion (one entry per configuration) vs. hybrid (SKUs only for
  comparable axes, options list for the rest). To be decided in the PRD/modeling ADR — the user
  has already fixed that comparable axes = spoke/width/brake and the comparable unit = the
  buyable configuration, which narrows but does not fully determine the shape.
- Model-group linkage mechanism (`model_group_id` vs. nested structure) and how the list groups
  siblings visually.
- ID strategy for exploded SKUs given the reserved ranges (re-number vs. sub-id scheme).
- Whether existing brands (Mavic/Roval/Zipp/ENVE) actually carry such variants, or whether
  migration is mostly a Caden + schema concern. To be confirmed by inspecting their data files.

---

## 9. Assumptions

- Variant comparability is worth the added catalog row count and grouping complexity (validated
  by the user: comparable unit = each buyable configuration).
- Price is naturally per-configuration, so the SKU-oriented model expresses price differences for
  free.
- The scraping pipeline can produce the new shape going forward, so this is the last brand-by-brand
  re-flattening of variants.
