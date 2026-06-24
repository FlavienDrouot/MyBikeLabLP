# PRD — Product Requirements Document

## 1. General Information

- Evolution ID: EVO-027
- Title: Wheel Specs Data Collection via Public APIs
- Author: Flavien Drouot
- Date: 2026-05-29
- Version: 1.0
- Needs Assessment reference: [needs-assessment.md](needs-assessment.md)

---

## 2. Functional Objective

Provide a local, manually-triggered data collection pipeline that fetches raw wheel product data from external sources (Channel3, Awin, and potentially internal brand endpoints) and stores it as raw JSON files on disk — independently of the current frontend and `wheelsData.js` structure.

---

## 3. Target Behavior

### General description

After this evolution, the product owner can run one or more Node.js scripts from a terminal to pull wheel product data from external sources. Each script targets a single source and writes the raw response to its own JSON file. No data transformation, no frontend changes, no automated scheduling — purely a local ingestion tool.

Three source categories are addressed:

1. **Channel3** — REST API returning product data (title, price, images, merchant URL) in JSON
2. **Awin** — CSV product feeds from cycling retailers, converted to JSON as-is
3. **Internal brand endpoints** (DT Swiss, Zipp, Roval, Fulcrum) — undocumented JSON endpoints identified via browser network inspection; each viable endpoint gets its own script

---

## 4. Functional Rules

### FR-001 — One script per source
Each data source has its own dedicated Node.js script. Scripts are independent and can be run individually.

### FR-002 — Raw output only
Output files contain data exactly as received from the source. No field renaming, no filtering, no mapping to `wheelsData.js`. For Awin (CSV origin), the CSV is converted to JSON structurally but not semantically — column names and values are preserved as-is.

### FR-003 — Output file location
All output JSON files are written to `MyBikeLab/scripts/data/`. Each file is named after its source (e.g., `channel3-raw.json`, `awin-raw.json`, `dt-swiss-raw.json`).

### FR-004 — Credentials never committed
API keys and credentials are passed via environment variables or a `.env` file. The `.env` file is excluded from the repository via `.gitignore`. Scripts fail explicitly if a required credential is missing.

### FR-005 — Graceful error handling
Each script logs errors to the console with a clear message. It does not crash silently. If partial data has been fetched before an error, it is saved to the output file.

### FR-006 — Internal brand endpoint investigation
The investigation of internal JSON endpoints for DT Swiss, Zipp, Roval, and Fulcrum is documented in `api-research-results.md`. For each brand: either a viable endpoint is identified (→ dedicated script produced) or the investigation result is documented (→ no script, reason stated).

---

## 5. Detailed Use Cases

### UC-001 — Run Channel3 ingestion

#### Preconditions
- Channel3 API key available as environment variable `CHANNEL3_API_KEY`
- Internet access

#### Steps
1. User runs `node fetch-channel3.js` in a terminal
2. Script reads `CHANNEL3_API_KEY` from environment
3. Script calls the Channel3 API endpoint for bicycle wheels
4. Raw JSON response is written to `scripts/data/channel3-raw.json`
5. Script logs the number of records fetched and the output path

#### Expected result
- `scripts/data/channel3-raw.json` created or overwritten with raw API response

#### Error cases
- `CHANNEL3_API_KEY` missing → logs "Missing CHANNEL3_API_KEY" and exits with code 1
- API returns HTTP error → logs status code and response body, exits with code 1
- Rate limit exceeded → logs the error, saves partial data if any, exits with code 1

---

### UC-002 — Run Awin ingestion

#### Preconditions
- Awin publisher credentials available as environment variables (`AWIN_PUBLISHER_ID`, `AWIN_API_KEY`)
- Internet access

#### Steps
1. User runs `node fetch-awin.js` in a terminal
2. Script reads credentials from environment
3. Script downloads the CSV product feed for the target cycling retailer(s)
4. CSV is parsed and converted to a JSON array (column names preserved)
5. JSON is written to `scripts/data/awin-raw.json`
6. Script logs the number of records and the output path

#### Expected result
- `scripts/data/awin-raw.json` created or overwritten

#### Error cases
- Missing credentials → logs which variable is absent, exits with code 1
- Auth failure → logs HTTP status, exits with code 1
- Malformed or empty CSV → logs a warning, saves whatever was parsed, exits with code 1

---

### UC-003 — Run internal brand ingestion (if endpoint viable)

#### Preconditions
- Viable internal endpoint identified and documented in `api-research-results.md`
- Internet access (no authentication expected for public-facing product endpoints)

#### Steps
1. User runs `node fetch-<brand>.js` in a terminal
2. Script calls the identified internal endpoint
3. Raw JSON response is written to `scripts/data/<brand>-raw.json`
4. Script logs the number of records and the output path

#### Expected result
- `scripts/data/<brand>-raw.json` created or overwritten with raw endpoint response

#### Error cases
- Endpoint returns unexpected schema → logs a warning, saves raw response as-is
- Endpoint unreachable → logs the error, exits with code 1

---

## 6. Acceptance Criteria

### AC-001
#### Description
A Node.js script `fetch-channel3.js` exists at `MyBikeLab/scripts/`.
#### Expected verification
File is present and runs without syntax error with `node fetch-channel3.js`.
#### Type
- Manual

### AC-002
#### Description
Running `fetch-channel3.js` with a valid API key produces `scripts/data/channel3-raw.json`.
#### Expected verification
File exists after execution and contains a non-empty JSON structure matching the Channel3 API response schema.
#### Type
- Manual

### AC-003
#### Description
A Node.js script `fetch-awin.js` exists at `MyBikeLab/scripts/`.
#### Expected verification
File is present and runs without syntax error.
#### Type
- Manual

### AC-004
#### Description
Running `fetch-awin.js` with valid credentials produces `scripts/data/awin-raw.json`.
#### Expected verification
File exists after execution and contains a JSON array with column names matching the Awin CSV feed headers.
#### Type
- Manual

### AC-005
#### Description
Each script logs a clear error message and exits with code 1 when a required credential is missing.
#### Expected verification
Run script without env variables set — terminal output shows a descriptive error message; no silent crash; no partial file written.
#### Type
- Manual

### AC-006
#### Description
No API key or credential appears in any committed file.
#### Expected verification
`git grep -i "api_key\|api-key\|password\|secret"` returns no matches in `scripts/`; `.env` is listed in `.gitignore`.
#### Type
- Manual

### AC-007
#### Description
The investigation of internal JSON endpoints for DT Swiss, Zipp, Roval, and Fulcrum is documented in `api-research-results.md`.
#### Expected verification
Each brand has an entry stating either the identified endpoint and its data fields, or the reason no viable endpoint was found.
#### Type
- Manual

### AC-008
#### Description
For each viable internal brand endpoint identified: a dedicated script exists and produces a raw JSON file.
#### Expected verification
Script runs without error; output file present in `scripts/data/`; JSON content matches raw endpoint response.
#### Type
- Manual

---

## 7. Functional Impacts

### Impacted components
- New: `MyBikeLab/scripts/` directory (Node.js ingestion scripts)
- New: `MyBikeLab/scripts/data/` directory (raw JSON output files)

### Impacted data
- `scripts/data/channel3-raw.json` — new file, created on script execution
- `scripts/data/awin-raw.json` — new file, created on script execution
- `scripts/data/<brand>-raw.json` — new files, one per viable internal endpoint

### Impacted APIs
- Channel3 Product Data API (external, read-only)
- Awin Product Feeds API (external, read-only)
- Internal brand endpoints — DT Swiss, Zipp, Roval, Fulcrum (public-facing, read-only if viable)

### Impacted permissions / roles
- No change to application roles or permissions
- `.env` must be added to `.gitignore` if not already present

---

## 8. Out of Scope

- Web scraping of HTML pages
- Mapping raw data to `wheelsData.js` format
- Automated or scheduled execution (manual run only)
- Authentication flows requiring paid plans or commercial agreements
- Any changes to the React frontend or `wheelsData.js`
- Data deduplication or merging across sources

---

## 9. Constraints

- Scripts must run with Node.js (no additional runtime)
- No backend — scripts run locally and produce static files
- APIs must be free or offer a sufficient free tier
- Each API's terms of use must be respected (rate limits, attribution, commercial use clauses)
- No credentials committed to the repository

---

## 10. Test Plan

### Automated tests expected
- None — scripts are one-shot local tools; automated testing is out of scope for this evolution

### Manual tests expected
- Run each script with valid credentials → verify output file created with expected structure
- Run each script with missing credentials → verify error message and exit code 1
- Run each script with simulated API error (wrong endpoint / revoked key) → verify graceful failure

### Edge cases
- Channel3 returns zero results → file written with empty array, no crash
- Awin CSV contains extra/missing columns → raw conversion still produces valid JSON
- Internal brand endpoint returns HTML instead of JSON → script logs warning and saves raw string

### Non-regression
- No frontend files modified → React application unaffected
- `wheelsData.js` unchanged → existing comparator behavior unaffected
