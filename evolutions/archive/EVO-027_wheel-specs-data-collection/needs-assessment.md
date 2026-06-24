# Needs Assessment

## 1. General Information

- Evolution ID: EVO-027
- Title: Wheel Specs Data Collection via Public APIs
- Author: Flavien Drouot
- Date: 2026-05-29
- Status: Draft
- Priority: High

---

## 2. Context

### Current situation

The wheel dataset (`src/data/wheelsData.js`) contains ~15 manually entered road bike wheels. Data is static, incomplete, and maintained by hand. The `product-overview.md` targets 150–200 wheels to make the comparator genuinely useful.

### Identified problem

There is no data pipeline. Adding wheels requires manual research and editing source code. This is not scalable and blocks the growth of the catalog.

### Business motivation

A larger, reliable dataset is a prerequisite for organic traffic (SEO), affiliate monetization (Phase B), and direct partner outreach (Phase C). Phase A of the data acquisition strategy starts here.

---

## 3. Business Objective

Identify whether formal public APIs exist for road bike wheel specs, and if so, build a first ingestion script that feeds a raw JSON file — independently of the current `wheelsData.js` structure.

---

## 4. Scope

### Included

- Research of formal public APIs covering road bike wheel specifications (not scraping)
- A written research document listing APIs found: name, endpoint, data coverage, authentication, terms of use
- Investigation of undocumented internal JSON endpoints from premium brands (DT Swiss, Zipp, Roval, Fulcrum) via browser network inspection
- A Node.js ingestion script (`MyBikeLab/scripts/`) that calls one or more viable APIs — one script per source
- A raw JSON output file storing data exactly as received from the API (no mapping to `wheelsData.js`)
- "Viable" = free or sufficient free tier; data relevance evaluated case by case
- Internal brand endpoints: if exploitable, each gets its own dedicated script; if not, the investigation result is documented

### Excluded

- Web scraping of HTML pages (next evolution)
- Mapping raw data to `wheelsData.js` format (future evolution)
- Automated / scheduled execution (manual run only)
- Authentication flows requiring paid plans or commercial agreements
- Any changes to the frontend

---

## 5. Constraints

### Business constraints

- APIs must be free or offer a free tier sufficient for data collection

### Known technical constraints

- Script language: Node.js (consistent with the existing frontend stack)
- Script location: `MyBikeLab/scripts/`
- Output: raw JSON file, structure dictated by the API response (not by `wheelsData.js`)
- No backend — script is run locally and produces a static file

### Regulatory / security constraints

- Must respect each API's terms of use (rate limits, attribution, commercial use clauses)
- No API keys committed to the repository

---

## 6. Use Cases

### Nominal case

As the product owner,
I want to run a Node.js script that calls a public API and saves the response to a JSON file,
so that I can accumulate raw wheel spec data without manually editing source code.

### Alternative cases

- No viable API found: the evolution produces only the research document; scraping is the fallback (next evolution)
- Multiple viable APIs found: the script handles them as separate sources, each saved to its own raw JSON file

### Known error cases

- API rate limit exceeded: script logs the error and saves partial data
- API returns unexpected schema: script saves raw response as-is and logs a warning

---

## 7. Acceptance Criteria

- [ ] A research document exists listing all evaluated APIs with: name, base URL, data fields available, authentication method, pricing, terms of use assessment
- [ ] At least one API is assessed as viable (free tier, relevant wheel data)
- [ ] A Node.js script exists at `MyBikeLab/scripts/` and can be run with `node <script-name>`
- [ ] Running the script produces a raw JSON file in `MyBikeLab/scripts/data/`
- [ ] The raw JSON file contains wheel data exactly as returned by the API (no transformation)
- [ ] No API key or credential is committed to the repository (`.gitignore` or `.env` pattern)
- [ ] The script handles API errors gracefully (logs error, does not crash silently)
- [ ] A documented investigation of internal JSON endpoints for DT Swiss, Zipp, Roval, and Fulcrum exists (via browser network inspection)
- [ ] For each viable internal endpoint found: a dedicated ingestion script exists at `MyBikeLab/scripts/` and produces its own raw JSON file in `MyBikeLab/scripts/data/`

---

## 8. Open Questions

- ~~Which APIs actually exist for road bike component specs?~~ → Answered in [api-research-results.md](api-research-results.md)
- ~~Do any cycling databases (e.g., component registries, manufacturer feeds) expose a public API?~~ → Answered in [api-research-results.md](api-research-results.md)

---

## 9. Research Output

See [api-research-results.md](api-research-results.md) for the full API research: evaluated sources, retained options (Channel3, Awin Feeds), data field coverage, and next steps.

---

## 10. Assumptions

- At least one public API with road bike wheel data exists and offers a free tier
- The raw data format will differ from `wheelsData.js` — mapping is explicitly out of scope
- The research document is a markdown file stored in `MyBikeLab/evolutions/EVO-027_wheel-specs-data-collection/`
