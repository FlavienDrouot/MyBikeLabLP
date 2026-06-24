# Implementation Notes — EVO-027

Date: 2026-05-29

---

## TASK-001 — Initialize scripts/ infrastructure

Implemented directly by the orchestrator (content fully specified in the task file).

### Files created
- `MyBikeLab/scripts/package.json`
- `MyBikeLab/scripts/.env.example`
- `MyBikeLab/scripts/data/.gitkeep`
- `MyBikeLab/.gitignore` — added `scripts/.env` and `scripts/data/*.json`

### Validation
- `npm install` in `scripts/` completed without error — 2 packages installed (`csv-parse`, `dotenv`)
- `git check-ignore` confirms `scripts/.env` is ignored by `.gitignore` line 51

---

## TASK-002 — Implement fetch-channel3.js

### Design decisions

All four open questions from the spec were resolved through live Channel3 documentation:

| Question | Answer |
|---|---|
| Endpoint URL | `POST https://api.trychannel3.com/v1/search` |
| Auth header | `x-api-key: <key>` (not `Authorization: Bearer`) |
| Category/keyword filter | Category ID `3Yx` ("Bicycle Wheel Parts") in `filters.category_ids`; paired with `query: "bicycle wheel"` |
| Pagination | `page_token` in request body; `next_page_token` in response; `null` signals last page |

Category ID `3Yx` was read directly from the curl example on the Channel3 bicycle-wheel-parts product data page. The parent category "Bicycle Parts" (`va0`) is documented as a fallback comment in the code.

### Deviations
None. The spec's scaffold structure was preserved and completed exactly.

### Tradeoffs
- **Keyword + category filter (both)**: Using `query: "bicycle wheel"` alongside `category_ids: ["3Yx"]` gives the highest precision. If `3Yx` is ever restructured, the keyword alone still returns useful results.
- **`RESULTS_PER_PAGE = 30`** (API max): Minimises requests against the 1,000/month free quota.
- **Empty-page safety break**: The pagination loop also breaks if a page returns 0 products even when `next_page_token` is non-null — defensive guard against an infinite loop on a malformed API response.
- **`buildRequestBody` as a pure function**: Keeps the pagination loop readable and the body construction independently inspectable.

### Open questions — must verify before running
1. **Category ID `3Yx`**: Confirm returned products are actually wheel products. If results look wrong, broaden to parent category `va0` or drop the category filter.
2. **Keyword string `"bicycle wheel"`**: May need tuning (e.g., `"bike wheel"`, locale-specific terms). The `config.language`/`config.country` parameters can be added to `buildRequestBody` if locale targeting is needed.
3. **Quota consumption**: With `limit=30` and a narrow category the total page count should be small. Confirm on first real run that the script does not consume a significant portion of the monthly quota.

### Validation
- Syntax: `node --check` passes
- Missing key: `node fetch-channel3.js` with no `.env` → `Missing CHANNEL3_API_KEY`, exit code 1 ✓
- No credential values in source ✓
- HTTP 429 path: writes partial data then exits 1 ✓ (code path present)
- HTTP error path: logs status + body then exits 1 ✓ (code path present)

---

## TASK-003 — Implement fetch-awin.js

### Design decisions

**Feeds list endpoint — deviation from spec**: The spec proposed `GET https://api.awin.com/publishers/{publisherId}/feeds`. This endpoint could not be confirmed from Awin documentation. The confirmed, widely-documented endpoint is:

```
GET https://productdata.awin.com/datafeed/list/apikey/{API_KEY}
```

This returns a CSV where each row describes one accessible product feed, including its download URL. The API key is embedded in the URL path, not in an Authorization header. The `PUBLISHER_ID` env var is still validated at startup (documented as potentially needed for the alternative JSONL path) but is not used in the `productdata.awin.com` URL.

**JSONL alternative documented but not used**: Awin offers a direct enhanced-feed download at `api.awin.com/publishers/{id}/awinfeeds/download/{advertiser}-retail-{locale}.jsonl`. This uses a Bearer token and bypasses the list step, but returns JSONL — incompatible with the `csv-parse` requirement. It is documented in a comment in the source for future reference.

**URL field discovery — self-diagnosing**: The exact column name for the download URL in the feed list CSV is not definitively documented. The script tries `url`, `download_url`, `downloadUrl`, `feed_url`, `feedUrl` in order. If none match, the error message prints the actual column names from the live response, making the script self-diagnosing on first authenticated run.

### Deviations
- Feeds list endpoint changed from `api.awin.com/publishers/{id}/feeds` (unconfirmed) to `productdata.awin.com/datafeed/list/apikey/{key}` (confirmed).
- `Authorization: Bearer` is not sent to `productdata.awin.com` — the API key is embedded in the URL itself.

### Tradeoffs
- **Multi-candidate URL field extraction**: Adds resilience at the cost of slight ambiguity. Self-resolves on first authenticated run via the error log's column name listing.
- **`PUBLISHER_ID` validated but unused in URL**: Retained for forward-compatibility (JSONL path) and as a signal that the account is configured. Adds one env var that the user must set even though it is not used in the current flow.

### Open questions — must verify before running
1. **API key type**: Confirm whether `AWIN_API_KEY` for `productdata.awin.com` is the same OAuth Bearer token as the publisher API, or a separate data-feed API key from the Awin UI under "API Keys".
2. **URL column name**: Will self-resolve on first authenticated run. If it fails, the error message lists the actual column names.
3. **Advertiser ID column**: Script tries `advertiser_id` then `merchant_id`. Self-resolves on first authenticated run.
4. **Advertiser program join**: Publisher account must have joined the target advertiser's program in the Awin UI. If not joined, Step 1 completes but Step 2 fails with "No feed found".

### Validation
- Syntax: `node --check` passes
- Missing `AWIN_PUBLISHER_ID`: exits 1 with `Missing AWIN_PUBLISHER_ID` ✓
- Missing `AWIN_API_KEY` (when PUBLISHER_ID is set): exits 1 with `Missing AWIN_API_KEY` ✓
- Missing `AWIN_ADVERTISER_ID` (when both others are set): exits 1 with `Missing AWIN_ADVERTISER_ID` ✓
- No credential values in source ✓
- Empty CSV path: logs warning, writes empty array, exits 1 ✓ (code path present)
- HTTP error path: logs status + body then exits 1 ✓ (code path present)

---

## Non-regression validation

- No files under `MyBikeLab/frontend/` were modified
- `src/data/wheelsData.js` unchanged
- All new files are under `MyBikeLab/scripts/` (new directory) or `MyBikeLab/.gitignore`
