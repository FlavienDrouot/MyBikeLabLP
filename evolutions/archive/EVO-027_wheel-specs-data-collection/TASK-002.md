# TASK-002 — Implement fetch-channel3.js

## Objective
Create `MyBikeLab/scripts/fetch-channel3.js` — a Node.js script that fetches bicycle wheel product data from the Channel3 Product Data API and writes the raw JSON response to `MyBikeLab/scripts/data/channel3-raw.json`.

## Required context
- Module system: CommonJS (`require`)
- HTTP: native `fetch` (Node.js 18+, no import needed)
- Env loading: `dotenv` (`require('dotenv').config()` at entry, reads `scripts/.env`)
- Output directory: `MyBikeLab/scripts/data/` (created in TASK-001)
- Credential: `CHANNEL3_API_KEY` environment variable
- Channel3 API: trychannel3.com — REST API returning product data (title, price, images, merchant URL) in JSON; 1,000 free requests/month — run sparingly during development
- **Before implementing**: check trychannel3.com documentation for the exact endpoint URL, authentication header format, and category/keyword parameter for bicycle wheels — see Open questions

## Potentially impacted files
- `MyBikeLab/scripts/fetch-channel3.js` — new

## Inputs
- `CHANNEL3_API_KEY` from `scripts/.env`

## Expected outputs
- `MyBikeLab/scripts/data/channel3-raw.json` — raw JSON response, written exactly as received
- Console: `Fetched {n} records → scripts/data/channel3-raw.json`

## Constraints
- CommonJS only (`require`, not `import`)
- No data transformation — write the API response body as-is
- Fail explicitly if `CHANNEL3_API_KEY` is missing: `console.error('Missing CHANNEL3_API_KEY')` then `process.exit(1)`
- On HTTP error: log status code and response body, then `process.exit(1)`
- On rate limit (HTTP 429): log the error, write any partial data already fetched, then `process.exit(1)`
- If pagination is required: accumulate all pages into a single array before writing

## Script structure

```javascript
'use strict';
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const API_KEY = process.env.CHANNEL3_API_KEY;
if (!API_KEY) {
  console.error('Missing CHANNEL3_API_KEY');
  process.exit(1);
}

const OUTPUT_PATH = path.join(__dirname, 'data', 'channel3-raw.json');

async function main() {
  // TODO: fetch from Channel3 API — confirm endpoint URL, auth header, and
  //       category parameter from trychannel3.com docs before implementing
  // If paginated: loop until all pages fetched, accumulate into `records`
  // On error: log and exit 1; write partial records first if any exist
  const records = /* fetched data */;
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(records, null, 2));
  console.log(`Fetched ${records.length} records → ${OUTPUT_PATH}`);
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
```

## Open questions — resolve before implementing
1. **Endpoint URL**: which path returns bicycle wheel products? (e.g., `/products`, `/search`) — check trychannel3.com/docs
2. **Auth header**: `Authorization: Bearer <key>` or `x-api-key: <key>`?
3. **Category/keyword filter**: what parameter targets bicycle wheels specifically?
4. **Pagination**: does the endpoint paginate? If yes, what is the mechanism (cursor, page+limit, offset)?

## Dependencies
TASK-001

## Validation criteria
- [ ] File exists at `MyBikeLab/scripts/fetch-channel3.js`
- [ ] `node fetch-channel3.js` with no `.env` → logs `Missing CHANNEL3_API_KEY`, exits with code 1
- [ ] `node fetch-channel3.js` with valid key → `scripts/data/channel3-raw.json` created, non-empty JSON
- [ ] Output file content matches the raw API response structure (no field renaming)
- [ ] No API key value appears anywhere in `fetch-channel3.js`

## Tests to implement
### Unit
None.

### Integration
Manual — see validation criteria above.
