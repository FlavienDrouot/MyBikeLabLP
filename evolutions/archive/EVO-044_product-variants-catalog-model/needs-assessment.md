# Needs Assessment

## 1. General Information

- Evolution ID: EVO-044
- Title: Product variants catalog model
- Author: Codex
- Date: 2026-06-04
- Status: Validated
- Priority: High

---

## 2. Context

### Current situation

MyBikeLab compares road wheelsets as catalog entries. The current catalog model treats one entry as one wheelset pair. Some wheelsets have documented purchasable variants, but those variants are currently flattened into base fields or stored in `other_specs`.

Recent Caden data ingestion exposed several variant cases: steel versus carbon spokes, multiple rim widths for the same model, and disc versus rim brake availability. Freehub compatibility is already represented as an option list and should remain a configuration option rather than a comparable variant.

### Identified problem

Variant-like data stored in base fields or `other_specs` is not consistently comparable, filterable, sortable, or visible across brands. This makes the comparator less reliable for users who need to compare the actual documented purchasable configuration they might buy.

### Business motivation

MyBikeLab's value depends on structured, neutral, comparable wheel data. Product variants affect important decision criteria such as weight, width, brake type, and potentially price. Representing these variants cleanly improves comparison quality and prepares the catalog for broader scraped data.

---

## 3. Business Objective

Enable MyBikeLab users to compare documented purchasable wheelset variants as first-class comparator rows while keeping related variants grouped under the same model family.

---

## 4. Scope

### Included

- Define the product need for comparable wheelset variants.
- Treat spoke material, rim width, and brake type as comparable/filterable variant axes.
- Keep freehub as a non-comparable configuration option.
- Represent each documented purchasable variant as its own comparator row/card.
- Group related variant rows under the same model family.
- Migrate all current brands where variant data is explicitly documented, using Caden as the proving case.
- Keep existing non-variant wheels as single entries with no visible grouping behavior.
- Move variant-like data out of `other_specs` when it has a structured home.
- Keep `other_specs` for non-comparable notes and rare fields.
- Include the full data-to-frontend path in one evolution: schema, catalog migration, scraping transformation rules, filters, sorting, display, and grouping behavior.

### Excluded

- Generating inferred variant combinations not explicitly documented by a source.
- Turning freehub options into separate comparable rows.
- Building a detailed in-row variant selector as a minimum requirement.
- Changing the established wheelset definition: one comparator row still represents a front + rear pair, not an individual wheel.
- Treating front/rear divergent specs as product variants.

---

## 5. Constraints

### Business constraints

- Only documented purchasable variants should become variant rows.
- Caden should be used as the proving case because it exposed the current limitation.
- The catalog must remain coherent across all current brands without inventing unavailable variants.
- The comparator should stay understandable for users when multiple rows belong to the same model family.

### Known technical constraints

- Current wheel data is consumed by the React/Vite frontend from frontend data files.
- The canonical scraping schema is maintained in `workflows/datascraping/wheel-format.json`.
- Data transformation rules are documented in `workflows/datascraping/README.md`.
- Existing front/rear divergent specs from EVO-038 must continue to work and must not be confused with product variants.
- Existing ID reservations must be respected, including Caden IDs 129-137 and Panda Podium reservation 50-128.

### Regulatory / security constraints

- No specific regulatory or security constraints identified.

---

## 6. Use Cases

### Nominal case

As a road cyclist comparing wheel upgrades,
I want each documented purchasable variant to appear as a comparable row,
So that filtering and sorting reflect the actual configuration I could buy.

### Alternative cases

- As a user, I want related variant rows to be visually grouped by model family so that the catalog does not look like unrelated duplicates.
- As a user, I want wheels without documented variants to remain simple single entries.
- As a catalog maintainer, I want non-comparable options such as freehub compatibility to remain as options rather than duplicate rows.
- As a data maintainer, I want variant-like data removed from `other_specs` once a structured field exists.

### Known error cases

- A source documents a variant axis but not the actual purchasable combinations.
- A wheelset has front/rear divergent specs that could be mistaken for variants.
- A brand exposes marketing labels that conflict with product page details.
- A variant has missing price or weight data.

---

## 7. Acceptance Criteria

- [ ] Spoke material, rim width, and brake type are defined as comparable/filterable variant axes for this evolution.
- [ ] Freehub remains represented as a non-comparable option list.
- [ ] Each comparator row/card represents a documented purchasable wheelset variant only.
- [ ] No inferred variant combinations are created when the source does not explicitly document them.
- [ ] Related variants can be grouped under a shared model family.
- [ ] Existing non-variant wheels remain single entries.
- [ ] Filters and sorting operate on variant rows.
- [ ] The UI visually indicates when rows/cards belong to the same model family.
- [ ] `other_specs` no longer carries data that has a structured variant field.
- [ ] Front/rear divergent specs remain supported and are not modeled as variants.

---

## 8. Open Questions

- How should the model family grouping be named and displayed in the comparator?
- What should the frontend show when a documented variant has incomplete weight or price data?
- Should grouped rows have a default ordering within each model family?
- Should variant rows receive new IDs or preserve source IDs with a variant-level identifier?

---

## 9. Assumptions

- A wheelset remains the fundamental catalog unit.
- Product variants are purchasable configurations of a wheelset model family.
- Variant rows should improve comparison behavior without requiring a detailed variant selector in the first release.
- The PRD and technical specifications will decide the exact data model, migration strategy, and UI behavior.
