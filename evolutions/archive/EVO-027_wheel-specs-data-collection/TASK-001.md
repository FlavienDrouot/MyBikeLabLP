# TASK-001 — Initialize scripts/ infrastructure

## Objective
Create the `MyBikeLab/scripts/` directory structure with `package.json`, `.env.example`, data directory, and `.gitignore` entries. This is the prerequisite for all other implementation tasks in EVO-027.

## Required context
- All scripts live in `MyBikeLab/scripts/`
- Output JSON files live in `MyBikeLab/scripts/data/`
- Credentials are loaded from `MyBikeLab/scripts/.env` (never committed)
- Dependencies: `csv-parse` (Awin CSV parsing), `dotenv` (env loading)
- Node.js 18+ required (native fetch)
- The React frontend is in `MyBikeLab/frontend/` — do not modify it
- The git root for MyBikeLab is `MyBikeLab/` — `.gitignore` is at `MyBikeLab/.gitignore`

## Potentially impacted files
- `MyBikeLab/scripts/package.json` — new
- `MyBikeLab/scripts/.env.example` — new
- `MyBikeLab/scripts/data/.gitkeep` — new
- `MyBikeLab/.gitignore` — add two entries (check for duplicates before adding)

## Inputs
None.

## Expected outputs

### `MyBikeLab/scripts/package.json`
```json
{
  "name": "mybikelab-scripts",
  "version": "1.0.0",
  "description": "Local data ingestion scripts for MyBikeLab",
  "private": true,
  "dependencies": {
    "csv-parse": "^5.5.0",
    "dotenv": "^16.0.0"
  }
}
```

### `MyBikeLab/scripts/.env.example`
```
# Channel3 Product Data API
CHANNEL3_API_KEY=

# Awin Publisher API
AWIN_PUBLISHER_ID=
AWIN_API_KEY=
AWIN_ADVERTISER_ID=
```

### `MyBikeLab/scripts/data/.gitkeep`
Empty file — tracks the data directory in git without committing output files.

### `MyBikeLab/.gitignore` additions
```
scripts/.env
scripts/data/*.json
```

## Constraints
- Do not modify any file under `MyBikeLab/frontend/`
- Do not create `scripts/.env` — only `.env.example`
- `package.json` must be `"private": true`

## Dependencies
none

## Validation criteria
- [ ] `MyBikeLab/scripts/package.json` exists and is valid JSON
- [ ] Running `npm install` in `MyBikeLab/scripts/` completes without error
- [ ] `MyBikeLab/scripts/.env.example` exists and lists all four variables
- [ ] `MyBikeLab/scripts/data/.gitkeep` exists
- [ ] `MyBikeLab/.gitignore` contains `scripts/.env` and `scripts/data/*.json`
- [ ] Creating a `scripts/.env` file and running `git status` shows it as ignored

## Tests to implement
### Unit
None.

### Integration
None.
