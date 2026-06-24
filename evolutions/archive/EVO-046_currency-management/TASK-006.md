# TASK-006: Scraping pipeline alignment with the per-offer currency schema

## Objective

Update the scraping documentation so future ingestion produces the canonical
`{ amount, currency }` per-offer schema from the start. This is part of the evolution's
definition of done under the project Data Schema Conventions (`MyBikeLab/README.md`) and
PRD FR-014 / AC-009.

## Required context

- The schema reference is `workflows/datascraping/wheel-format.json`. Its current price section:
  ```json
  "prices": [ { "price_eur": "number | null", "url": "string" } ],
  "affiliateLinks": {
    "manufacturer": { "url": "string", "price_eur": "number | null" },
    "retailers": [ { "name": "string", "price_eur": "number | null", "url": "string" } ]
  }
  ```
  and `other_specs` is documented as "non-comparable notes ONLY … MUST NOT contain … per-variant
  price".
- The scraping prompt is `MyBikeLab/scripts/DatascrapingPrompt.md`. Current price guidance
  references euros (`price_eur`) and the pricing/siblings rules around line 25 and 89–96.
- The datascraping playbook is `workflows/datascraping/README.md`. It references `price_eur` in
  the schema and in per-brand notes (e.g. "price_eur absent (USD seulement)" for Roval, Enve,
  GOOSYNN, YOELEO, OVERFAST, EXS).
- Canonical schema (must match TASK-003 / AD-002):
  - `prices: [{ amount, currency, url }]`, `currency ∈ {EUR, USD}`.
  - `affiliateLinks.manufacturer: { url, amount, currency }`,
    `retailers: [{ name, url, amount, currency }]`.
  - No `price_eur`, no `price_usd`; the source currency of each price is captured explicitly.

## Inputs

- The canonical schema decided in AD-002 / TASK-003.

## Expected outputs

- `workflows/datascraping/wheel-format.json`: price section rewritten to the `{ amount, currency }`
  shape for `prices[]`, `manufacturer`, and `retailers[]`; `other_specs` guidance updated to
  explicitly forbid `price_usd` alongside the existing "no per-variant price" rule.
- `MyBikeLab/scripts/DatascrapingPrompt.md`: pricing instructions updated to capture each offer's
  source currency (EUR or USD) into `amount` + `currency`, instead of euros-only; the
  siblings/pricing rules reworded to reference `amount`/`currency`.
- `workflows/datascraping/README.md`: schema description updated; the "price_eur absent (USD
  seulement)" brand notes reworded to reflect that USD prices are now first-class
  (`currency: 'USD'`) rather than missing data.

## Constraints

- Documentation-only task: no application code or data changes here.
- Keep guidance consistent with the validator rules from TASK-003 (supported currencies only;
  no legacy fields; no comparable price data in `other_specs`).
- Preserve the existing structure/tone of each document; change only what the schema requires.

## Dependencies

TASK-003

## Validation criteria

- [ ] `wheel-format.json` shows `amount` + `currency` for every price location and no `price_eur`.
- [ ] `DatascrapingPrompt.md` instructs capturing the per-offer source currency into `amount`/`currency`.
- [ ] `datascraping/README.md` schema + brand notes no longer describe USD prices as missing `price_eur`.
- [ ] No `price_eur` / `price_usd` references remain in the three documents (except, if useful, a one-line migration note explaining the rename).

## Tests to implement

### Unit

- None (documentation).

### Integration

- None. Manual review per AC-009: the three documents reflect the per-offer currency field.
</content>
