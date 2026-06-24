# scripts/

Local data ingestion scripts — fetch affiliate and product data from external APIs and write results to `data/`.

This folder is gitignored (credentials, generated output).

---

## Scripts

| Script | Source | Output |
|---|---|---|
| `fetch-awin.js` | Awin Publisher API — retrieves affiliate product feed | `data/` |
| `fetch-channel3.js` | Channel3 Product Data API — retrieves bike wheel specs | `data/` |

---

## Setup

```bash
cp .env.example .env
# Fill in credentials in .env
npm install
```

Required environment variables (see `.env.example`):
- `AWIN_PUBLISHER_ID`, `AWIN_API_KEY`, `AWIN_ADVERTISER_ID`
- `CHANNEL3_API_KEY`

---

## Run

```bash
node fetch-awin.js
node fetch-channel3.js
```

Output is written to `data/`. The folder is gitignored — results stay local.

---

## Fetch results log

### `fetch-channel3.js` — 2026-06-05

- **247 products** fetched from the Channel3 "Bicycle Wheel Parts" category → `data/channel3-raw.json` (summary: `data/channel3-summary.csv`).
- All prices in **USD**; ~50% out of stock; price range $1.19–$1,740 (avg ~$253).
- Breakdown: 124 rim-only, 100 generic "wheel parts", rest hubs/spokes/strips. By keyword, ~16 wheelsets/pairs but mostly MTB (29"/Boost/Enduro/DH), BMX, fat-bike or e-bike.
- **Key finding:** only **2 products** match MyBikeLab's scope (road-bike wheel *pairs*):
  - **Industry Nine Solix SL AR25** (alloy, 25mm) — $1,265, in stock
  - **ICAN Alpha 38/52 Disc Pro** (carbon, 38/52mm) — $580, in stock
- These two are curated (with manufacturer-sourced specs) into `frontend/src/data/wheelsData_channel3.js` (not yet wired into the catalog aggregator).
- **Conclusion:** the Channel3 "Bicycle Wheel Parts" feed is a poor fit for the road-wheel-pairs scope (~0.8% relevant). Not worth a recurring pipeline as-is; revisit only with a road-specific query/category.
- **Cross-region check (FR/EUR):** running with `CHANNEL3_COUNTRY=FR CHANNEL3_CURRENCY=EUR CHANNEL3_LANGUAGE=fr` returned a different, smaller catalog — 62 products, all EUR, **0 road pairs**, and the 2 US pairs absent. Changing country switches the available merchants, it does not convert the same products. So neither US nor FR is exploitable for road pairs via this feed.

#### TODO — next iteration (not yet implemented)

- **Loop over multiple countries:** extend `fetch-channel3.js` to iterate a list of countries (e.g. US, GB, DE, FR) in one run and aggregate/compare the catalogs, instead of one fixed region per run.
- **Currency vs country independence:** test whether the *offer set* actually changes when only the **currency** varies for the **same country** (e.g. country=US with currency=EUR vs USD). This tells us whether currency is purely a display conversion or also a merchant filter — informs whether we need per-country runs at all.
