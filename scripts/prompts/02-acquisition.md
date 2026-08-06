# Phase 2 — acquisition

Read `00-shared-contract.md` and `catalog-index.json`. Acquire source facts for every included candidate and every unresolved candidate that can be investigated. Produce exactly one logical evidence JSON file per product family. Do not create one file per configuration, and do not create temporary small-batch evidence files as part of this contract. A family file may contain many profiles and observations.

Use the deterministic filename `product-family-evidence-<discovery-slug>.json`, where the slug is trimmed, lower-case, and made by replacing every run of characters outside `[a-z0-9]` with `-`; trim leading and trailing hyphens. Never use a path separator or append a counter. If two families produce the same filename, route the collision to `04-exceptions.md` instead of overwriting an artifact.

## Method

WebFetch/static HTTP is a preparatory read-only pass. Use it to inspect HTML, JSON-LD, embedded product data, technical links, specification tables, and stable facts. Record its provenance. It can discover selectors, URLs, labels, and candidate values; it cannot establish dynamic commerce/UI facts or replace interactive verification.

Acquisition workers MUST use the Codex integrated in-app browser for every buyable configuration and all dynamic commerce/UI facts. Open the product page, all specification tabs, linked technical documents, and relevant first-party support pages. For each raw configuration exposed as buyable, interact with its selectors in the integrated browser and capture the resulting visible state, including selected values, SKU, stock, price, currency, and URL after selection when exposed. Do not silently replace the integrated browser with static HTTP or another fallback. If browser interaction is unavailable or fails, record the attempted configuration with blocked unresolved fields and route the exception through `04-exceptions.md`; do not continue as though verification succeeded. Check retailer and manufacturer offers only when they are in scope for the source run. Capture technical rows and bounded excerpts, not whole pages.

Do not classify any axis. Record only its raw identity and observation context: source label, raw value, normalized display value when safe, control type, source fact IDs, and whether it is page-level or selection-scoped. Do not use `variant`, `option`, `cosmetic`, `offer`, or `unknown` as an acquisition classification. Do not allocate IDs in this phase.

## Family evidence output

```json
{
  "schema_version": "mybikelab.family-evidence.v2",
  "evidence_id": "brand-slug-family-slug",
  "retrieved_at": "2026-08-06T12:00:00Z",
  "family": {
    "brand": "Example",
    "family_label": "Road Aero 50",
    "discovery_slug": "example-road-aero-50",
    "scope_status": "included",
    "identity_source_fact_ids": ["stable-0001"],
    "notes": ""
  },
  "sources": [
    {"source_id": "src-0001", "url": "https://example.com/wheel", "kind": "product", "method": "static_http", "scope": "page", "title": "Road Aero 50", "retrieved_at": "2026-08-06T11:45:00Z", "currency": null, "reliability": "primary"},
    {"source_id": "src-0002", "url": "https://example.com/wheel", "kind": "commerce", "method": "in_app_browser", "scope": "selection", "title": "Road Aero 50 configurator", "retrieved_at": "2026-08-06T11:52:00Z", "currency": "EUR", "reliability": "primary"}
  ],
  "stable_facts": [
    {"fact_id": "stable-0001", "label": "Model", "value": "Road Aero 50", "unit": null, "raw_value": "Road Aero 50", "page_scope": "family", "source_id": "src-0001", "source_locator": "h1", "confidence": "direct"}
  ],
  "configuration_profiles": [
    {
      "profile_id": "profile-0001",
      "axes": [{"label": "Freehub", "raw_value": "Shimano HG", "control_type": "select", "page_scope": "selection", "source_id": "src-0002"}],
      "facts": [{"fact_id": "profile-0001-fact-0001", "label": "Rear freehub", "value": "Shimano HG", "unit": null, "raw_value": "Shimano HG", "page_scope": "selection", "source_id": "src-0002", "source_locator": "Freehub selector", "confidence": "direct"}],
      "source_ids": ["src-0002"]
    }
  ],
  "observations": [
    {"observation_id": "obs-0001", "profile_ids": ["profile-0001"], "source_id": "src-0002", "selected_raw_values": {"Freehub": "Shimano HG"}, "buyable": true, "sku": "EX-50-HG", "stock": "in_stock", "amount": 1299, "currency": "EUR", "url_after_selection": "https://example.com/wheel?freehub=hg", "fact_ids": ["stable-0001", "profile-0001-fact-0001"], "retrieved_at": "2026-08-06T11:52:00Z"}
  ],
  "matrix_coverage": {"axes": [{"label": "Freehub", "control_type": "select", "observed_values": ["Shimano HG"], "tested_values": ["Shimano HG"], "source_ids": ["src-0002"]}], "coverage_status": "complete", "observation_count": 1},
  "bounded_evidence": [{"source_id": "src-0001", "locator": "h1", "excerpt": "Road Aero 50", "supports": ["stable-0001"]}],
  "unresolved": []
}
```

## Exact output rules

- `stable_facts` contains only page-level/family-level facts reusable without a selection. Each fact has a `stable-` ID.
- `configuration_profiles` contains reusable exact raw selections and selection-scoped facts. Each profile fact has a `profile-` ID. Profiles do not imply catalog identity or classification.
- `observations` is compact. Each record is one attempted or browser-verified configuration and references zero or more declared `profile_ids` plus declared fact IDs rather than copying the full fact set. Every buyable observation requires `method: "in_app_browser"` provenance through its `source_id`.
- `sources` is the provenance registry. `method: "static_http"` is preparatory and may support stable page facts only. `method: "in_app_browser"` is required for dynamic and selection-scoped facts and every buyable configuration.
- `matrix_coverage` records raw axes, labels, control types, tested raw values, observed raw values, source IDs, and whether coverage is complete. It does not classify axes or count canonical products.
- `unresolved` records every missing comparison fact and every failed or unavailable browser verification with `field`, `reason`, `source_ids`, and `severity` (`unknown|blocked|conflict|stale`). A blocked browser pass must not be represented as a successful buyable observation.
- `bounded_evidence` contains only the smallest excerpts needed to audit declared facts. Its `supports` values must be exact IDs declared in `stable_facts` or `configuration_profiles[*].facts`.
- Preserve source labels, raw values, units, wording, URLs, timestamps, and conflicts. Use `null` for unknown numeric/boolean values and `""` for unknown text only in canonical output; keep the unresolved reason here.
- Preserve source currency; never convert it. Record currency and retrieval time for every price or commerce observation. Never copy the base product URL into `url_after_selection`; if no post-selection URL is exposed, leave it empty and record a blocking unresolved item.
- Do not fabricate facts, infer unobserved configurations, copy values from sibling profiles, emit canonical wheel objects, classify axes, or allocate IDs.

Return only valid JSON for each product family.
