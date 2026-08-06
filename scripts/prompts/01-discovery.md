# Phase 1 — discovery

Read `00-shared-contract.md`. Discover the complete in-scope road catalog for `[WEBSITE_URL]` without extracting full technical specifications.

## Method

Start at the supplied catalog or category URL. Follow pagination, filters, collection links, sitemap entries, product feeds, and internal search results. Deduplicate URLs that identify the same product. Record likely configuration/SKU links separately when the page exposes selectable buyable variants. Do not treat a retailer listing as a manufacturer product unless the requested source is a retailer.

## Output

Write `catalog-index.json` as one object:

```json
{
  "schema_version": "mybikelab.catalog-index.v1",
  "source": {"url": "https://example.com", "retrieved_at": "2026-01-01T00:00:00Z"},
  "scope": {"category": "road", "include_triathlon_in_road": true},
  "products": [
    {
      "discovery_id": "brand-slug-product-slug",
      "brand": "",
      "model_hint": "",
      "product_url": "",
      "configuration_urls": [],
      "category_path": [],
      "buyable": null,
      "scope_status": "candidate",
      "scope_reason": "",
      "discovered_at": "2026-01-01T00:00:00Z"
    }
  ],
  "unresolved": []
}
```

`scope_status` is one of `candidate`, `included`, `excluded`, or `needs_review`. Use `excluded` only with a concrete reason such as `gravel-only` or `rim-sold-separately`. `configuration_urls` contains only observed URLs; do not enumerate hypothetical combinations. `unresolved` records blocked navigation, unclear category placement, duplicate identity, or unknown buyability with `{ "field", "reason", "source_urls", "severity" }`.

Return only valid JSON. The next phase receives this file and must process every `candidate` and `needs_review` record.
