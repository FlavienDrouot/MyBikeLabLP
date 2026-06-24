# Spec Notes — EVO-027

## PRD interpretations

- **`.env` file location**: placed at `MyBikeLab/scripts/.env` — the PRD says "`.env` file" without specifying where; co-located with the scripts that use it, not at the repo root.
- **`scripts/data/*.json` gitignored**: the PRD does not address whether output files are committed; decision: exclude them. They are generated artifacts, and committing them risks exposing data from commercial APIs with restrictive terms of use (AD-006).
- **Awin advertiser targeting**: the PRD says "target cycling retailer(s)" without naming one. The script accepts `AWIN_ADVERTISER_ID` as an env var — one advertiser per run. The user can run the script multiple times for different advertisers.
- **TASK-005 closed**: the brand endpoint investigation (TASK-004, completed 2026-05-29) found no viable internal JSON endpoints for DT Swiss, Zipp, Roval, or Fulcrum. No brand ingestion scripts are produced in this evolution. This is consistent with the existing conclusion in `api-research-results.md`.

## Architecture decision rationale

- **AD-001 CommonJS**: scripts are local one-shot tools outside the Vite pipeline. CommonJS requires no configuration and runs on all Node.js LTS versions without `.mjs` extensions or `"type": "module"`.
- **AD-002 native fetch**: available as a global since Node.js 18 LTS. No reason to add a dependency for a simple GET request.
- **AD-003 csv-parse**: the only non-trivial parsing concern in this evolution. Manual CSV splitting breaks on quoted fields containing commas or newlines. `csv-parse` handles all edge cases and is the standard choice.
- **AD-004 dedicated package.json**: keeps script dependencies out of `frontend/node_modules`. The two dependency sets have no overlap and different lifecycles.
- **AD-005 dotenv**: standard pattern; removes the need to `export` credentials in the shell before each run. `.env.example` serves as a self-documenting credential inventory.
- **AD-006 data/ gitignored**: output files are regenerated on each run. Committing them produces noisy diffs and risks exposing commercial API data.

## Tradeoffs

- **ESM vs CommonJS**: ESM is the modern standard but requires additional configuration for standalone scripts with no bundler. CommonJS wins on simplicity.
- **fetch vs axios**: axios handles edge cases more gracefully but is unnecessary when native fetch is available on Node.js 18+.
- **Multi-advertiser loop vs single advertiser per run (Awin)**: a loop over multiple advertisers would be more powerful but adds complexity. Single advertiser per run keeps the script simple; the user runs it multiple times if needed.

## Open questions

1. **Channel3 endpoint URL**: the exact URL, authentication header format, and category/keyword parameter for bicycle wheels must be confirmed from trychannel3.com documentation before TASK-002 can be implemented.
2. **Channel3 pagination**: does the API paginate results? If yes, the script must accumulate pages. Check docs.
3. **Awin feeds endpoint**: confirm `GET https://api.awin.com/publishers/{publisherId}/feeds` returns available feeds with download URLs, and that `AWIN_ADVERTISER_ID` maps to the feed's advertiser identifier.
4. **Awin download auth**: confirm whether the `productdata.awin.com` CSV download URL accepts the same `Authorization: Bearer` header, or uses the API key as a query parameter.
5. **Awin advertiser approval**: the publisher account must have joined the target advertiser's program. Confirm this before attempting to run `fetch-awin.js`.
