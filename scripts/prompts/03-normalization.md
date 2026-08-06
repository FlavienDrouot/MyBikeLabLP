# Phase 3 — normalization

Read `00-shared-contract.md`, `catalog-index.json`, the canonical schema in `workflows/datascraping/wheel-format.json`, every single-family evidence JSON file, and the orchestrator allocation block. Normalization is the only phase that decides whether an observed axis is a `variant`, `option`, `cosmetic`, `offer`, or `unknown`.

## Evidence contract

Acquisition evidence is one product-family record with three distinct layers:

- `stable_facts`: reusable facts established for the family, such as brand, model, dimensions, material, warranty, or technical specifications. Each fact has a unique `fact_id`, source provenance, raw value, and normalized candidate value.
- `configuration_profiles`: reusable sets of stable-fact references and profile-specific fact references. A profile describes a selectable configuration without becoming a canonical product until normalization classifies its differences. Profile references must use fully qualified fact references in the form `evidence_id#fact_id`.
- `observations`: every browser-observed buyable combination, including selected options, SKU, stock, displayed amount, source currency, source URL, post-selection URL, retrieval timestamp, and the fact references supporting each value. These are observations, not business classifications.

Older evidence may expose equivalent `facts` and `commerce_observations` arrays. Treat them as the same layers only when their provenance and IDs are unambiguous; otherwise route invalid or incomplete evidence to `04-exceptions.md`. Any acquisition `axis_classification` is an observation or hypothesis only. It is not authoritative and cannot be copied into the normalization decision.

## Classification and grouping

1. Resolve stable facts and profile references before comparing profiles. Dereference every reference and retain the original raw observation and provenance.
2. Compare the extracted facts and the current canonical frontend schema. Decide every axis centrally:
   - `variant`: changes a comparison-distinct catalog product and receives one canonical object;
   - `option`: selectable compatibility or fit choice represented by an existing canonical field, such as `hub.freehub_options`;
   - `cosmetic`: choice outside the current comparison schema, such as decal color;
   - `offer`: seller, price, stock, currency, SKU, or other offer-only difference;
   - `unknown`: evidence cannot distinguish the preceding cases. This blocks grouping and ID allocation.
3. Group observations into real canonical products after classification. Shared family facts may support several products, but must be dereferenced, not copied as newly captured facts.
4. Assign IDs only after classification and grouping. Use only the exact next IDs in the supplied contiguous allocation block for new canonical products. Never allocate IDs to observations, profiles, options, cosmetics, offers, or unknowns. Preserve historical IDs and reserved ranges.

Keep siblings on one clean `brand` + `model`; use a unique localized snake_case `variant` only for comparison-distinct products. Do not alter the frontend schema. Promote source labels only to the schema field defined by `wheel-format.json`; do not duplicate consumed labels in `other_specs`. Preserve every other technical fact in `other_specs` with its original value and meaningful key. Prices remain offers in `prices` or the schema's affiliate fields; preserve each displayed amount, source currency (`EUR` or `USD`), URL, SKU, stock state, and retrieval timestamp. Never convert currency or copy a sibling value.

For the Scope Artech 6 golden case, preserve 20 raw commerce observations (5 freehub bodies × 2 bearing choices × 2 decal colors) and emit exactly 2 canonical variants: standard bearings and the CeramicSpeed upgrade. Freehub bodies are options; decal colors are cosmetic. Report the observation count and canonical variant count separately.

## Fact accounting

Use fully qualified references everywhere: `evidence_id#fact_id`. Maintain one capture ledger per evidence file. Every captured fact must occur exactly once in one terminal accounting bucket: `normalized`, `preserved_in_other_specs`, `unresolved`, `conflicts`, `discarded`, or `classified_non_variant`. A fact referenced by several canonical products is accounted for once by its owner evidence record and listed for each consumer only in `shared_fact_references`; those consumer references never count as additional capture occurrences. A fact must not be both a shared reference and a second terminal bucket entry.

For every raw observation, record exactly one observation record with all supporting fact references. The classification record must cite the facts supporting each axis decision, including `variant`, `option`, `cosmetic`, `offer`, and `unknown`. Validate that every reference resolves, every captured fact is terminally accounted for once, every observation is preserved once, and every source URL and retrieval timestamp is attributable.

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
      "fact_refs": ["scope-artech-6#fact-0001", "scope-artech-6#fact-0002"],
      "terminal": {"normalized": ["scope-artech-6#fact-0001"], "preserved_in_other_specs": [], "unresolved": [], "conflicts": [], "discarded": [], "classified_non_variant": ["scope-artech-6#fact-0002"]}
    },
    "shared_fact_references": [{"fact_ref": "scope-artech-6#fact-0001", "canonical_ids": [101, 102], "reason": "stable family fact; accounted for once above"}],
    "observations": [{
      "observation_id": "obs-0001",
      "canonical_id": 101,
      "raw_observation_ref": "scope-artech-6#obs-0001",
      "source_url": "https://example.test/product?freehub=hg",
      "url_after_selection": "https://example.test/product?freehub=hg",
      "retrieved_at": "2026-01-01T00:00:00Z",
      "fact_refs": ["scope-artech-6#fact-0001", "scope-artech-6#fact-0002"],
      "axis_classification": [{"axis": "freehub", "classification": "option", "fact_refs": ["scope-artech-6#fact-0002"], "target": "hub.freehub_options", "reason": "compatibility choice in the current schema"}]
    }],
    "coverage": {"commerce_observation_count": 20, "catalog_variant_count": 2, "matrix_axes_tested": ["freehub", "bearing", "decal_color"]}
  }],
  "global_unresolved": [],
  "validation": {"canonical_schema_valid": true, "all_fact_refs_resolve": true, "all_captured_facts_accounted_once": true, "all_observations_preserved_once": true, "errors": []}
}
```

If classification, references, evidence coverage, or allocation capacity cannot be validated, emit no partial canonical handoff and route the issue through `04-exceptions.md`. Return the two valid JSON artifacts and no prose.
