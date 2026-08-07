# Phase 1 — discovery

Read `00-shared-contract.md`. Discover the complete in-scope road catalog for `[WEBSITE_URL]` without extracting full technical specifications.

## Method

Start at the supplied catalog or category URL. Follow pagination, filters, collection links, sitemap entries, product feeds, and internal search results. Deduplicate URLs that identify the same product. Record likely configuration/SKU links separately when the page exposes selectable buyable variants. Do not treat a retailer listing as a manufacturer product unless the requested source is a retailer.

Use deterministic identity and deduplication in this order: canonical product URL,
first-party source identifier, SKU or material number, then exact observed URL plus
identity fields. Never merge pages because titles are similar. `configuration_urls` may
contain only observed URLs; never recombine values or create hypothetical combinations
from separate pages, feeds, sitemaps, or search results.

Treat a 404, redirect to a generic page, unavailable target, or page without a product as
an unresolved discovery result. Preserve the requested URL, observed URL, status or title,
and reason. An empty product list is not a successful discovery.

Keep visited URLs, pagination progress, and written discovery IDs idempotent. On restart,
resume at the first missing page or source unit. Bound retries for pagination, sitemaps,
feeds, and internal search; after the retry limit, emit an unresolved record instead of
restarting the complete discovery.

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

`scope_status` is one of `candidate`, `included`, `excluded`, or `needs_review`. Use `excluded` only with a concrete reason such as `gravel-only` or `rim-sold-separately`. `configuration_urls` contains only observed URLs; do not enumerate hypothetical combinations. `unresolved` records blocked navigation, unclear category placement, duplicate identity, unavailable targets, or unknown buyability with `{ "field", "reason", "requested_url", "observed_url", "status", "source_urls", "severity" }`.

Return only valid JSON. The next phase receives this file and must process every `candidate` and `needs_review` record.
