# Spec Notes — EVO-044

Running log of non-obvious decisions made during the Tech Specs phase. Maintained as
decisions were taken, not reconstructed afterward.

---

## PRD interpretations

- **"Configuration of a model" = differs only on the three axes.** The PRD never defines the
  boundary of a "model". I scoped it as: configurations of one model differ **only** on spoke
  material, rim width or brake type; any difference on a non-axis dimension (rim depth, hub,
  category, diameter) is a distinct model. This bounds the explosion and matches the catalog:
  Caden's depth ladder (35/45/50/60/75/105mm) stays as separate ungrouped rows; only
  carbon-vs-steel-spoke pairs and rim-width variants of the *same* model form a group.
- **"Closed, Title Case vocabulary" applies to the categorical axes only.** Rim width is a
  numeric (mm) `range` filter; a Title Case vocabulary is meaningless for it. The
  vocabulary/Title-Case requirement (FR-003, AC-005) is interpreted as covering spoke
  material and brake type.
- **Title Case is satisfied at the display layer.** The existing data stores raw snake_case
  keys (`stainless_steel`, `disc`) and i18n renders them to Title Case (`"Stainless steel"`,
  `"Disc"`). I kept this mechanism rather than rewriting stored values to Title Case strings,
  because the latter would break bilingual FR/EN labels and contradicts the fix-013 precedent
  (which kept i18n for these axes and only used literal Title Case for non-i18n categoricals
  like `disc_standard`/`freehub_options`). See AD-003 and the open question below.
- **Per-configuration price (FR-009)** is already expressible: each configuration is its own
  object with its own `prices[]`. No model-level price aggregation is introduced. The
  "model must be able to express a per-configuration price even though no current brand uses
  it" requirement is met by construction of AD-001.
- **"Five migrated brands" / FR-008.** Only Caden actually hides comparable variant data in
  `other_specs` (`carbon_spoke_option`, `weight_carbon_spoke_grams`,
  `external_width_options_mm`). Mavic/Roval/Zipp/ENVE already carry spoke material, rim width
  and brake type as structured fields; their `other_specs` holds only informational,
  non-comparable notes. For those four, the task is an audit/confirmation, not a rewrite.

## Architecture decision rationale

- **AD-001 (flat explosion over nested configurations).** The whole comparator pipeline —
  registry accessors, `selectFilteredWheels`, `makeSelectOptionsFor`/`...CountsFor`/
  `...RangeBoundsFor`, `MeasuringTable` — assumes one flat object per comparable unit. Flat
  explosion preserves all of it and turns grouping + auto-expansion into a post-filter
  presentation transform (AD-004). A nested model object would have forced a flatten step
  through every selector and broken memoization.
- **AD-002 (`model_group` string key).** Minimal, serializable, scraper-friendly. Storing
  `model_group_label` explicitly avoids fragile prefix derivation from `model`.
- **AD-004 (grouping selector layered on the flat selector).** Auto-expansion is expressed as
  derived data (`survivingCount < siblingCount`) rather than view state, so it is unit
  testable and cannot drift from the filtered result.

## Tradeoffs

- **New id allocation from 200.** Existing ids run 1–49 (Mavic/Roval/Zipp/ENVE) with reserved
  blocks 50–128 (Panda Podium) and 129–137 (Caden). Caden's reserved block is already fully
  used (129–137 = 9 entries), so exploded siblings cannot extend it without collision.
  Allocating from 200 keeps new ids clearly outside every reserved range and is verified by an
  automated test (AC-008). Tradeoff: ids are no longer brand-contiguous, accepted because ids
  are opaque keys, not display values.
- **Representative = lightest surviving configuration.** Chosen because weight is the primary
  comparison axis for this catalog; tie-break lowest min price, then id. Alternative
  (first-in-array) was rejected as arbitrary and order-dependent.

## Resolved questions (user, 2026-06-04)

1. **Merge `steel` and `stainless_steel`?** → **Keep both.** They are treated as physically
   distinct spoke-material keys. No data merge; both keep their own i18n labels (TASK-002,
   TASK-006).
2. **i18n-key interpretation of "Title Case vocabulary" (AD-003)?** → **Confirmed.** Title
   Case is delivered at the display layer by i18n; stored data keeps raw snake_case keys. No
   change to AD-003 / TASK-006.
3. **Carbon-spoke and rim-width options — separate SKUs with their own price?** →
   **Carbon vs steel spokes have different prices; rim width does NOT affect price.**
   Therefore:
   - **Spoke-material siblings** (carbon vs steel of the same model) each carry their **own,
     distinct `prices[]`**. The carbon-spoke price is not all present in the current data
     (only `weight_carbon_spoke_grams` is) and **must be sourced from the Caden product pages
     during migration** (TASK-002). Where a carbon price genuinely cannot be sourced, leave it
     `null` rather than copying the steel price (a null price renders as "N/A", never a wrong
     value — FR-001).
   - **Rim-width siblings** (e.g. 34/37/40mm) **inherit the base model's price** (width does
     not change price); they differ only on `rim.externalWidth_mm` and `weight_grams`.
