# TASK-003 — Implement fetch-awin.js

## Objective
Create `MyBikeLab/scripts/fetch-awin.js` — a Node.js script that downloads an Awin CSV product feed for a target cycling retailer, converts it to a JSON array with column names preserved, and writes it to `MyBikeLab/scripts/data/awin-raw.json`.

## Required context
- Module system: CommonJS (`require`)
- HTTP: native `fetch` (Node.js 18+)
- CSV parsing: `csv-parse/sync` npm package (installed in TASK-001)
- Env loading: `dotenv`
- Output directory: `MyBikeLab/scripts/data/`
- Awin publisher API base: `https://api.awin.com`
- Awin product feed download base: `https://productdata.awin.com`
- Auth: `Authorization: Bearer {AWIN_API_KEY}` header
- Environment variables:
  - `AWIN_PUBLISHER_ID` — publisher account ID
  - `AWIN_API_KEY` — API key
  - `AWIN_ADVERTISER_ID` — ID of the target cycling retailer (e.g., Wiggle, Ribble, Cyclestore); one advertiser per run
- **Prerequisite**: the publisher account must have joined the target advertiser's program in the Awin UI before the feed is accessible
- **Before implementing**: confirm the feeds endpoint URL and download URL format from Awin publisher API docs — see Open questions

## Potentially impacted files
- `MyBikeLab/scripts/fetch-awin.js` — new

## Inputs
- `AWIN_PUBLISHER_ID`, `AWIN_API_KEY`, `AWIN_ADVERTISER_ID` from `scripts/.env`

## Expected outputs
- `MyBikeLab/scripts/data/awin-raw.json` — JSON array, one object per product row, column names matching CSV headers exactly
- Console: `Fetched {n} records → scripts/data/awin-raw.json`

## Constraints
- CommonJS only
- No data transformation — CSV column names and values preserved exactly as received
- Check all three env vars at entry individually; log which specific variable is missing; `process.exit(1)`
- On empty or malformed CSV: log a warning, write whatever was parsed, `process.exit(1)`
- On HTTP error: log status and body, `process.exit(1)`

## Script structure

```javascript
'use strict';
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
require('dotenv').config();

const PUBLISHER_ID  = process.env.AWIN_PUBLISHER_ID;
const API_KEY       = process.env.AWIN_API_KEY;
const ADVERTISER_ID = process.env.AWIN_ADVERTISER_ID;

if (!PUBLISHER_ID)  { console.error('Missing AWIN_PUBLISHER_ID');  process.exit(1); }
if (!API_KEY)       { console.error('Missing AWIN_API_KEY');        process.exit(1); }
if (!ADVERTISER_ID) { console.error('Missing AWIN_ADVERTISER_ID'); process.exit(1); }

const OUTPUT_PATH = path.join(__dirname, 'data', 'awin-raw.json');

async function main() {
  // Step 1: GET https://api.awin.com/publishers/{PUBLISHER_ID}/feeds
  //         with Authorization: Bearer {API_KEY}
  //         → find the feed entry matching ADVERTISER_ID, extract its download URL
  //         (confirm field name from Awin docs — see Open questions)

  // Step 2: GET {download URL} (confirm auth mechanism — see Open questions)
  //         → CSV text response

  // Step 3: parse CSV
  const records = parse(csvText, { columns: true, skip_empty_lines: true });
  if (records.length === 0) {
    console.warn('Warning: CSV produced zero records');
  }

  // Step 4: write output
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(records, null, 2));
  console.log(`Fetched ${records.length} records → ${OUTPUT_PATH}`);
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
```

## CSV to JSON conversion
Use `csv-parse/sync` with `{ columns: true, skip_empty_lines: true }`:
- `columns: true` — uses the first row as column names (preserved exactly as-is)
- `skip_empty_lines: true` — tolerates trailing newlines in the feed
- Result type: `Array<{ [columnName: string]: string }>`

## Open questions — resolve before implementing
1. **Feeds list endpoint**: confirm `GET https://api.awin.com/publishers/{publisherId}/feeds` is the correct path and returns available feeds with download URLs
2. **Feed download URL**: confirm the field name in the feed object that contains the download URL (e.g., `url`, `downloadUrl`, `feedUrl`) and whether it points to `productdata.awin.com`
3. **Download auth**: confirm whether the `Authorization: Bearer` header applies to the `productdata.awin.com` download URL, or if the API key is passed as a query parameter
4. **Advertiser join**: confirm the publisher account has joined the target advertiser program before running the script

## Dependencies
TASK-001

## Validation criteria
- [ ] File exists at `MyBikeLab/scripts/fetch-awin.js`
- [ ] Running with each env var missing individually → specific error message per var, exit code 1
- [ ] Running with valid credentials → `scripts/data/awin-raw.json` created
- [ ] Output is a valid JSON array where each object's keys match the CSV header row exactly
- [ ] No credential value appears anywhere in `fetch-awin.js`

## Tests to implement
### Unit
None.

### Integration
Manual — see validation criteria above.
