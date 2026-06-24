# API Research Prompt — Road Bike Wheel Specs

You are a research assistant. Your task is to find formal public APIs that expose road bike wheel specifications.

## What I am looking for

APIs that provide structured data on **road bike wheels** (wheelsets or individual rims/hubs), including any of the following fields:

- Brand and model name
- Weight (grams)
- Rim depth (mm)
- Rim width (internal and/or external, mm)
- Rim material (carbon / aluminum)
- Hookless compatibility
- Diameter (700C / 650B)
- Hub brand and model
- Spoke brand, model, and material
- Price (MSRP or retail)
- Product images

## Scope

- **Formal APIs only** — REST, GraphQL, or structured data feeds. No scraping, no HTML parsing.
- **Free or free tier** — must be accessible without a paid plan or commercial agreement.
- **Road cycling focus** — MTB-only or generic sports APIs are lower priority, but note them if they also cover road wheels.

## For each API found, provide

| Field | Detail |
|---|---|
| Name | API or platform name |
| Base URL | Root endpoint or documentation URL |
| Data available | Which wheel fields are exposed |
| Authentication | None / API key / OAuth |
| Free tier | What is included for free |
| Terms of use | Any restrictions on commercial use, attribution, rate limits |
| Viability assessment | Short verdict: is this usable for a product catalog? Why or why not? |

## Sources to explore

Look across these categories:

- Cycling component databases (e.g. Veloviewer, BikeIndex, VeloBase, Bike Exchange, Bike Component DB)
- Manufacturer developer portals (Shimano, SRAM, DT Swiss, Mavic, Zipp, Roval, Fulcrum, Campagnolo)
- Retailer APIs (Wiggle, Bikester, Alltricks, Canyon, Probikeshop)
- General sports / product APIs that include cycling components
- Open data initiatives in the cycling industry

## Output format

Return a structured table followed by a short summary section:

1. **APIs found and evaluated** — one row per API in the table format above
2. **Most promising options** — top 1–3 APIs with a one-paragraph rationale for each
3. **Dead ends** — APIs that looked relevant but are not usable (and why)
4. **Gaps** — data fields with no known API coverage
