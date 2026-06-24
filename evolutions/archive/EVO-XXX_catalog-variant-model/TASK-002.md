# TASK-002: Catalog data migration (explode variants, add model groups)

## Objective

Migrate the five brand data files to the variant model: explode Caden's `other_specs`-hidden
variants into first-class sibling configurations, link siblings with `model_group` /
`model_group_label`, remove all comparable variant data from `other_specs`, and audit the
other four brands to confirm they already conform. After this task every buyable configuration
is a distinct comparable unit with its own weight, price and axis values.

## Required context

- Architecture: AD-001 (flat explosion — each configuration is a complete top-level object),
  AD-002 (`model_group` string + `model_group_label`; siblings differ only on spoke material,
  rim width or brake type), AD-003 (canonical axis keys).
- **Caden (`wheelsData_caden.js`, ids 129–137)** is the only brand hiding comparable variants
  in `other_specs`:
  - `carbon_spoke_option: true` + `weight_carbon_spoke_grams: N` on ids 129,130,132,133,134 —
    a carbon-spoke configuration of the same model (different spoke material + weight). The
    base entries use `spokes.material: 'stainless_steel'`; the carbon sibling uses
    `spokes.material: 'carbon'` with `weight_grams` = `weight_carbon_spoke_grams`.
  - id 131 `external_width_options_mm: [{externalWidth_mm:34,weight_grams:1270},
    {37,1310},{40,1370}]` — three rim-width configurations of the same model (the base entry
    already represents the 34mm/1270g one).
  - ids 133/134 are already the "CDA … Carbon Spoke" premium models with captured-carbon
    spokes; treat their `carbon_spoke_option`/`weight_carbon_spoke_grams` per AD-002 (they are
    their own models with a carbon-spoke sibling — confirm against the model-identity rule;
    if the carbon option is the same model at a different spoke material, it is a sibling).
- Each exploded sibling needs: a new unique `id` from **200+** (never in 50–128 or 129–137),
  the same `model` stem plus a distinguishing suffix, its own `weight_grams`, the correct axis
  value (`spokes.material` or `rim.externalWidth_mm`), and shared `model_group` +
  `model_group_label` with its base entry.
- **Pricing rule (resolved with user):**
  - **Spoke-material siblings** (carbon vs steel of the same model) have **distinct prices**.
    Each carries its own `prices[]` (and `affiliateLinks`). The carbon-spoke price is not in
    the current data (only `weight_carbon_spoke_grams` is) and **must be sourced from the
    Caden product page** for that model during migration. If a carbon price genuinely cannot
    be sourced, set it `null` (renders "N/A") — never copy the steel price (FR-001).
  - **Rim-width siblings** (34/37/40mm) **inherit the base model's price** (width does not
    affect price); they differ only on `rim.externalWidth_mm` and `weight_grams`. They may
    share the base `prices[]`/`affiliateLinks` values.
- The base entry of each multi-config model also receives the shared `model_group` /
  `model_group_label`.
- After explosion, delete from `other_specs` (for all migrated entries):
  `carbon_spoke_option`, `weight_carbon_spoke_grams`, `external_width_options_mm`, and any
  other key that encodes spoke material / rim width / brake type / per-variant weight or
  price. Keep only non-comparable notes (bearing_type, nipples, rim_construction, shipping,
  discount, etc.).
- **Mavic/Roval/Zipp/ENVE**: audit only. Confirm spoke material, rim width and brake type are
  already structured fields and that `other_specs` holds no comparable variant data. ENVE's
  `ratchet_options_tooth` is a hub/freehub-style option, NOT one of the three axes — leave it.
  Heritage vs non-Heritage Mavic editions differ on edition, not on an axis — they are
  distinct models, NOT grouped.
- EVO-038 divergent specs (`weight_grams`/`rim.*` as `{front,rear}`, e.g. Caden ids 136/137)
  are not variant axes and must not be exploded or grouped.

## Potentially impacted files

- `frontend/src/data/wheelsData_caden.js` (explosion + grouping + `other_specs` cleanup)
- `frontend/src/data/wheelsData_{mavic,roval,zipp,enve}.js` (audit; edits only if a comparable
  variant is found in `other_specs`)
- `frontend/src/data/__tests__/catalog.integration.test.js` (extend)

## Inputs

- Current brand data files.
- Canonical axis keys and id-allocation rule (≥ 200) from TASK-001.

## Expected outputs

- Caden carbon-spoke and rim-width variants exist as distinct top-level configurations with
  ids ≥ 200, each carrying its own weight/price/axis value and the shared `model_group` /
  `model_group_label`.
- No migrated entry's `other_specs` contains spoke-material, rim-width, brake-type,
  per-variant weight or per-variant price keys.
- Single-configuration models carry no `model_group` (or a unique one) and are unchanged in
  behavior.
- The four non-Caden brands confirmed conformant (no comparable variant data in
  `other_specs`).

## Constraints

- No new id in [50,128] or [129,137]; all new ids unique across the whole catalog.
- A displayed weight/price must map unambiguously to one configuration — never to an
  undocumented "base" (FR-001).
- Do not fabricate siblings for axis values a model does not actually offer (FR-007): e.g. a
  width offered only with steel spokes must not gain a carbon-spoke sibling.
- Do not alter EVO-038 `{front,rear}` entries' divergence behavior.
- Leave the open question on `steel`/`stainless_steel` unresolved (do not merge keys).

## Dependencies

TASK-001

## Validation criteria

- [ ] Every Caden multi-config model renders each buyable configuration as its own object with
      its own weight, price and axis value.
- [ ] No migrated entry has `carbon_spoke_option`, `weight_carbon_spoke_grams` or
      `external_width_options_mm` (or any comparable variant key) in `other_specs`.
- [ ] Sibling configurations share identical `model_group` and `model_group_label`.
- [ ] No catalog id is duplicated and no new id falls in [50,137].
- [ ] All four non-Caden brand files load and render with no comparable variant data in
      `other_specs`.
- [ ] `npm run lint` clean; full Vitest suite green.

## Tests to implement

### Unit
- A test asserting catalog id uniqueness and that every newly introduced id is ≥ 200 and not
  in [50,137] (AC-008).
- A test asserting no migrated entry's `other_specs` contains any key in a forbidden set
  (`carbon_spoke_option`, `weight_carbon_spoke_grams`, `external_width_options_mm`, and a
  guard list for spoke/width/brake/per-variant weight/price) (AC-003).

### Integration
- Extend `catalog.integration.test.js`: for a known Caden multi-config model, assert the
  expected number of sibling configurations exist, share a `model_group`, and expose distinct
  `weight_grams` and `spokes.material` (or `rim.externalWidth_mm`) values (AC-002, AC-006).
