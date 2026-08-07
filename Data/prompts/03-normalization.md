# Phase 3 — normalization

Read `00-shared-contract.md`, `catalog-index.json`, the canonical schema in `../wheel-format.json`, every single-family evidence JSON file, and the orchestrator allocation block. Normalization is the only phase that decides whether an observed axis is a `variant`, `option`, `cosmetic`, `offer`, or `unknown`.

## Evidence contract

Acquisition evidence is one product-family record with three distinct layers:

- `stable_facts`: reusable facts established for the family, such as brand, model, dimensions, material, warranty, or technical specifications. Each fact has a unique `fact_id`, source provenance, raw value, and normalized candidate value.
- `configuration_profiles`: reusable axis-value configurations containing exact raw selections and profile-specific fact references. A profile describes a selectable configuration without becoming a canonical product until normalization classifies its differences. Profile references must use fully qualified fact references in the form `evidence_id#fact_id`.
- `observations`: every browser-observed buyable combination, including selected options, SKU, stock, displayed amount, source currency, source URL, post-selection URL, retrieval timestamp, and the fact references supporting each value. These are observations, not business classifications.

For each new family, require all three layers: declare reusable page/family facts in `stable_facts`; declare reusable exact axis-value selections and their selection-scoped facts in `configuration_profiles`; and make every observation reference the applicable profiles through `profile_ids`. An observation may add only observation-specific provenance and commerce state. Never turn a profile or acquisition hypothesis into a canonical product without the normalization decisions below.

Older evidence may expose equivalent `facts` and `commerce_observations` arrays. Treat them as the same layers only when their provenance and IDs are unambiguous; otherwise route invalid or incomplete evidence to `04-exceptions.md`. Any acquisition `axis_classification` is an observation or hypothesis only. It is not authoritative and cannot be copied into the normalization decision.

## Classification and grouping

1. Resolve stable facts, axis-value profiles, and each observation's `profile_ids` before comparing profiles. For every in-scope pair, resolve the front weight, rear weight, and wheelset total-weight facts independently, including their fully qualified source references. Dereference every reference and retain the original raw observation and provenance in the family evidence; do not copy those values into accounting.
2. Compare the extracted facts and the current canonical frontend schema. Decide every axis centrally:
   - `variant`: changes a comparison-distinct catalog product and receives one canonical object;
   - `option`: selectable compatibility or fit choice represented by an existing canonical field, such as `hub.freehub_options`;
   - `cosmetic`: choice outside the current comparison schema, such as decal color;
   - `offer`: seller, price, stock, currency, SKU, or other offer-only difference;
   - `unknown`: evidence cannot distinguish the preceding cases. This blocks grouping and ID allocation.
3. Group observations into real canonical products after classification. Shared family facts may support several products, but must be dereferenced, not copied as newly captured facts.
4. Assign IDs only after classification and grouping. Use only the exact next IDs in the supplied contiguous allocation block for new canonical products. Never allocate IDs to observations, profiles, options, cosmetics, offers, or unknowns. Preserve historical IDs and reserved ranges.

Keep siblings on one clean `brand` + `model`; use a unique localized snake_case `variant` only for comparison-distinct products. Do not alter the frontend schema. Promote source labels only to the schema field defined by `wheel-format.json`; do not duplicate consumed labels in `other_specs`. Preserve every other technical fact in `other_specs` with its original value and meaningful key. Prices remain offers in `prices` or the schema's affiliate fields; preserve each displayed amount, source currency (`EUR` or `USD`), URL, SKU, stock state, and retrieval timestamp. Never convert currency or copy a sibling value.

For an in-scope pair, normalize weight without fabricating a side or total:

- When directly sourced front and rear weights both exist and no wheelset total exists, set canonical `weight_grams` to the existing schema's `{front, rear}` value shape. Record the derivation as one existing `normalized_mappings` entry with `target_path: "weight_grams"`, both side source fact references, and the canonical IDs; those two references are the derivation record. Do not add a derived total or a new accounting field.
- When only a directly sourced wheelset total exists, preserve it as the canonical scalar `weight_grams` and map its source fact.
- When only one side exists, leave canonical `weight_grams` unresolved/null as required by the existing schema. Preserve the known side fact and provenance in the appropriate terminal accounting bucket; never infer the other side or a total.
- If directly sourced total and both side values coexist, compare the published total with
  `front + rear`. When they agree, prefer the more informative canonical `{front, rear}`
  shape and account all supporting fact references in the same weight mapping. When they
  disagree, preserve every candidate, do not silently select, calculate, or overwrite a
  value, and route the conflict through `04-exceptions.md` for human arbitration.

Normalize stable, profile, and observation image URLs into the existing canonical `images` field. Deduplicate equivalent URLs across all three evidence layers, use the first retained image as primary, preserve variant-specific images, and keep each contributing source fact reference in accounting. Do not copy URLs into accounting rows; `normalized_mappings` records only the target path, canonical IDs, and fully qualified fact references. Conflicting image evidence remains human-gated.

For the Scope Artech 6 golden case, preserve 20 raw commerce observations (5 freehub bodies × 2 bearing choices × 2 decal colors) and emit exactly 2 canonical variants: standard bearings and the CeramicSpeed upgrade. Freehub bodies are options; decal colors are cosmetic. Report the observation count and canonical variant count separately.

## Fact accounting

Use fully qualified references everywhere: `evidence_id#fact_id`. Maintain one capture ledger per evidence file. Every captured fact must occur exactly once in one terminal accounting bucket: `normalized`, `preserved_in_other_specs`, `unresolved`, `conflicts`, `discarded`, or `classified_non_variant`. A fact referenced by several canonical products is accounted for once by its owner evidence record and listed for each consumer only in `shared_fact_references`; those consumer references never count as additional capture occurrences. A fact must not be both a shared reference and a second terminal bucket entry.

For every raw observation, record exactly one compact observation record containing only its fully qualified observation reference and the canonical IDs it maps to. The classification record must cite the facts supporting each axis decision, including `variant`, `option`, `cosmetic`, `offer`, and `unknown`. Group identical axis/value decisions once and list all affected canonical IDs. Validate that every reference resolves, every captured fact is terminally accounted for once, every observation is preserved once, and every source URL and retrieval timestamp is attributable through the evidence observation and its `source_id`; never repeat source URLs, timestamps, selected values, or fact lists in accounting rows.

## Outputs

Write `canonical-products.json` as a JSON array of schema-valid wheel objects. Validate required types, canonical enum values, historical IDs, allocation-block membership, unique `brand` + `model` + `variant` combinations, no promoted labels in `other_specs`, and grouping/classification coverage. Report `commerce_observation_count` separately from `catalog_variant_count`.

Write `fact-accounting.json`:

```json
{
  "schema_version": "mybikelab.fact-accounting.v2",
  "generated_at": "2026-01-01T00:00:00Z",
  "records": [{
    "evidence_id": "scope-artech-6",
    "capture": {
      "fact_refs": ["scope-artech-6#stable-0001", "scope-artech-6#profile-0001-fact-0001"],
      "terminal": {"normalized": ["scope-artech-6#stable-0001"], "preserved_in_other_specs": [], "unresolved": [], "conflicts": [], "discarded": [], "classified_non_variant": ["scope-artech-6#profile-0001-fact-0001"]}
    },
    "shared_fact_references": [{"fact_ref": "scope-artech-6#stable-0001", "canonical_ids": [101, 102]}],
    "observations": [{
      "observation_ref": "scope-artech-6#obs-0001",
      "canonical_ids": [101]
    }],
    "classification_decisions": [{
      "decision_key": "freehub=Shimano HG",
      "axis": "freehub",
      "value": "Shimano HG",
      "classification": "option",
      "fact_refs": ["scope-artech-6#profile-0001-fact-0001"],
      "target_path": "hub.freehub_options",
      "canonical_ids": [101, 102]
    }],
    "normalized_mappings": [{
      "fact_refs": ["scope-artech-6#stable-0001"],
      "target_path": "brand",
      "canonical_ids": [101, 102]
    }],
    "unresolved": [],
    "conflicts": [],
    "coverage": {"commerce_observation_count": 20, "catalog_variant_count": 2, "matrix_axes_tested": ["freehub", "bearing", "decal_color"]}
  }],
  "global_unresolved": [],
  "validation": {"canonical_schema_valid": true, "all_fact_refs_resolve": true, "all_captured_facts_accounted_once": true, "all_observations_preserved_once": true, "errors": []}
}
```

`observations[*]` is an accounting index, not a copy of evidence. It must contain exactly `observation_ref` and `canonical_ids`; the referenced family observation remains the sole source for URLs, timestamps, selected raw values, offer data, and supporting fact IDs. `classification_decisions[*]` is one record per unique axis/value decision. `normalized_mappings[*]` records the resulting schema mapping with `fact_refs`, `target_path`, and `canonical_ids`. Add compact `unresolved` or `conflicts` entries only when required, using fully qualified `fact_refs` and `observation_refs` rather than copied evidence.

For weight validation, require every canonical weight mapping to preserve its source fact references. Accept only a directly sourced total scalar, a directly sourced front/rear pair, or an unresolved/null value when required source facts are absent or incomplete. For derived front/rear weights, the single existing `normalized_mappings` entry with both side references is the derivation record; do not add an accounting field. For images, verify URL normalization and deduplication, first-image primacy, variant-specific retention, and provenance coverage across stable, profile, and observation facts.

Validate that every `stable_facts` fact and every profile fact is captured exactly once in a terminal bucket, profiles are reusable and referenced by observation `profile_ids`, each raw observation has exactly one accounting index entry, shared facts occur only in `shared_fact_references` for additional consumers, each observation's canonical IDs are complete, and commerce observation count is separate from canonical variant count. Accounting remains reference-only: do not repeat raw URLs, timestamps, selected values, or copied fact payloads. If classification, references, evidence coverage, allocation capacity, weight contradictions, or image contradictions cannot be validated, emit no partial canonical handoff and route the issue through `04-exceptions.md`. Before handoff, the coordinator must run the normalization validator against both output files. A missing classification, weight mapping, fact-accounting flag, or observation/variant count blocks the handoff and requires a revision; do not ask for confirmation to perform that revision. Return the two valid JSON artifacts and no prose.

## Corrections

Front-only and rear-only observations are out of scope for the current catalog. Treat `axis_applicability` as mechanical scope evidence, not business classification. Raw sentinels `None (Front Wheel Only)` and `None (Rear Wheel Only)` identify an individual wheel, not missing data or a missing profile. Preserve each excluded observation and its reason in the accounting, but do not create a canonical product, a null-profile exception, or a cardinality exception for it. Exclude excluded observations from in-scope coverage counts.

Normalize only observations whose purchase unit is a front + rear wheelset sold together. A missing SKU remains non-blocking for an in-scope wheelset when browser-verified identity is otherwise sufficient. Verification must not block merely because an out-of-scope single-wheel observation was encountered; it must report the exclusion and continue with the in-scope pair observations.
