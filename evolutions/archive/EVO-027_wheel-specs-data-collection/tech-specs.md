# Technical Specifications

## 1. General Information

- Evolution ID: EVO-027
- PRD reference: [prd.md](prd.md)
- Author: Flavien Drouot
- Date: 2026-05-29

---

## 2. Technical Context

### Technical objective
Implement a set of standalone Node.js ingestion scripts that pull raw wheel product data from external sources (Channel3 REST API, Awin CSV feeds) and write the results as raw JSON files to `MyBikeLab/scripts/data/`. No frontend changes. No data transformation.

### Affected architecture
- New directory: `MyBikeLab/scripts/` — standalone Node.js scripts, isolated from the React frontend
- New directory: `MyBikeLab/scripts/data/` — raw JSON output files (gitignored)

### Impacted modules
- None in the existing React application
- New: `MyBikeLab/scripts/package.json`
- New: `MyBikeLab/scripts/fetch-channel3.js`
- New: `MyBikeLab/scripts/fetch-awin.js`
- Modified: `MyBikeLab/.gitignore` — add exclusions for `scripts/.env` and `scripts/data/*.json`

---

## 3. Technical Constraints

- Scripts run with Node.js only — no additional runtime, no transpilation, no bundler
- Node.js 18+ required (native `fetch` API)
- No credentials committed to the repository
- Scripts are standalone: each runs independently via `node <script>.js`
- No changes to the React frontend or `wheelsData.js`

---

## 4. Architecture Decisions

### AD-001 — Module system: CommonJS
#### Description
All scripts use CommonJS (`require` / `module.exports`).

#### Motivation
Scripts are standalone local tools, not part of the Vite/React build pipeline. CommonJS requires no configuration and works on all Node.js LTS versions without `.mjs` extensions or `"type": "module"` in `package.json`.

#### Rejected alternatives
ESM (`import`/`export`) — requires either `"type": "module"` in `package.json` or `.mjs` file extension; adds friction without benefit for local scripts with no bundler.

---

### AD-002 — HTTP client: native fetch (Node.js 18+)
#### Description
All HTTP requests use the global `fetch` API available natively since Node.js 18.

#### Motivation
Zero additional dependencies for HTTP. Sufficient for simple GET requests returning JSON or CSV. Avoids importing `axios` or `node-fetch` for functionality the runtime already provides.

#### Rejected alternatives
`axios` — mature but adds a dependency for functionality already in Node.js 18+.
`node-fetch` — redundant with native fetch on Node.js 18+.
Built-in `https` module — lower-level; more verbose for simple GET requests.

---

### AD-003 — CSV parsing: csv-parse
#### Description
Awin CSV feed parsing uses the `csv-parse` npm package.

#### Motivation
`csv-parse` is the standard Node.js CSV parser. Handles quoted fields, mixed line endings, header extraction, and empty lines correctly. Provides a synchronous `parse()` API suitable for one-shot scripts.

#### Rejected alternatives
Manual `split('\n').map(line => line.split(','))` — fragile; breaks on quoted fields containing commas or newlines.
`fast-csv` — streaming-oriented; heavier API for a one-shot ingestion script.

---

### AD-004 — Package structure: dedicated scripts/package.json
#### Description
A `package.json` is created at `MyBikeLab/scripts/` with `csv-parse` and `dotenv` as dependencies.

#### Motivation
Keeps script dependencies isolated from the React frontend build (`MyBikeLab/frontend/`). The implementer runs `npm install` once in `scripts/` before running any script. Produces a lockfile for reproducible installs.

#### Rejected alternatives
Adding to `frontend/package.json` — pollutes the frontend dependency tree; scripts have no relation to the React build.
No `package.json` — requires global npm installs; fragile and non-reproducible.

---

### AD-005 — Environment loading: dotenv
#### Description
All scripts call `require('dotenv').config()` at entry to load variables from `scripts/.env`.

#### Motivation
Standard Node.js pattern. Allows credentials to be stored in a `.env` file without exporting shell variables before each run. `.env.example` documents all required variables.

#### Rejected alternatives
Shell `export` before running — more friction; not portable across sessions.
Hardcoded values — violates FR-004 (credentials never committed).

---

### AD-006 — Generated output excluded from git
#### Description
`scripts/data/*.json` is added to `.gitignore`. A `scripts/data/.gitkeep` tracks the directory.

#### Motivation
Output files are generated artifacts, not source files. Committing them would create noisy diffs on every re-run and risks accidentally committing data from commercial APIs with restrictive terms of use.

#### Rejected alternatives
Committing output files — noisy git history; potential ToS violation for Awin/Channel3 data.

---

### AD-007 — Brand endpoint investigation: no scripts produced
#### Description
The browser devtools investigation of DT Swiss, Zipp, Roval, and Fulcrum (TASK-004) found no viable internal JSON endpoints for any brand. TASK-005 is therefore closed with no output.

#### Motivation
Investigation performed on 2026-05-29 — see updated section 3 of `api-research-results.md`. No accessible JSON endpoint was found on any of the four brand product pages.

---

## 5. Task Breakdown

| Task | File | Summary | Dependencies | Status |
|------|------|---------|--------------|--------|
| TASK-001 | `TASK-001.md` | Initialize `scripts/` infrastructure | none | To do |
| TASK-002 | `TASK-002.md` | Implement `fetch-channel3.js` | TASK-001 | To do |
| TASK-003 | `TASK-003.md` | Implement `fetch-awin.js` | TASK-001 | To do |
| TASK-004 | `TASK-004.md` | Document brand endpoint investigation | none | Done |
| TASK-005 | — | Implement brand scripts (conditional) | TASK-001, TASK-004 | Closed — no viable endpoint found |

---

## 6. Global Validation Strategy

### Unit validation
None — scripts are one-shot local tools; automated tests are out of scope (see PRD section 10).

### Integration validation
Manual: run each script with valid credentials and verify the output file is created with the expected structure.

### Functional validation
- `node fetch-channel3.js` with valid key → `scripts/data/channel3-raw.json` exists, non-empty JSON
- `node fetch-awin.js` with valid credentials → `scripts/data/awin-raw.json` exists, JSON array with column names matching CSV headers
- Each script with missing env vars → exits with code 1, descriptive error logged
- `git grep -i "api_key\|api-key\|password\|secret"` in `scripts/` → no matches

### Non-regression validation
- No files under `MyBikeLab/frontend/` modified
- `src/data/wheelsData.js` unchanged

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Channel3 API endpoint URL unknown at spec time | Blocks TASK-002 implementation | Implementer must check trychannel3.com docs before starting |
| Awin product feed URL format must be confirmed | Blocks TASK-003 implementation | Implementer must check Awin publisher API docs — see spec-notes open questions |
| Channel3 free tier (1,000 req/month) exhausted during testing | Data collection interrupted | Run script sparingly; do not re-run unnecessarily during development |
| Awin publisher account approval required | Blocks TASK-003 | Account must be approved and advertiser program joined before implementation |

---

## 8. Rollback Plan

- All changes are new files under `scripts/` — no existing files modified except `.gitignore`
- Rollback: delete `MyBikeLab/scripts/`; revert `.gitignore` additions
- No impact on the React frontend or the deployed application
