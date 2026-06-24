# Technical Specifications

## 1. General Information

- Evolution ID: EVO-044
- PRD reference: `prd.md`
- Author: Codex
- Date: 2026-06-04

---

## 2. Technical Context

### Technical objective

Represent documented purchasable wheelset variants as first-class comparator entries while preserving their shared model-family identity, entry-level filtering and sorting, freehub option behavior, and EVO-038 front/rear divergent specification support.

### Affected architecture

- Static frontend catalog remains the source consumed by Redux.
- Each object in `wheelsData` remains one comparator entry.
- Optional `model_group` and `model_group_label` metadata link sibling entries for presentation.
- The property registry continues to define filter, sort, and column behavior.
- Catalog validation expands from divergent-pair rules to variant-modeling rules.

### Impacted modules

- `frontend/src/data/wheelsData_caden.js`
- `frontend/src/data/wheelsData_*.js`
- `frontend/src/data/wheelsData.js`
- `frontend/src/data/wheelValidator.js`
- `frontend/src/data/__tests__/catalog.integration.test.js`
- `frontend/src/config/wheelProperties.jsx`
- `frontend/src/config/__tests__/wheelProperties.*.test.*`
- `frontend/src/store/selectors/wheelsSelectors.js`
- `frontend/src/store/selectors/__tests__/wheelsSelectors.test.js`
- `frontend/src/components/MiniComparator/ComparisonTable.jsx`
- `frontend/src/components/MiniComparator/columnCells.jsx`
- `frontend/src/components/MiniComparator/WheelDetailPanel.jsx`
- `frontend/src/components/MiniComparator/__tests__/*.test.jsx`
- `frontend/public/locales/en.json`
- `frontend/public/locales/fr.json`
- `frontend/public/locales/xx.json`
- `workflows/datascraping/wheel-format.json`
- `workflows/datascraping/README.md`
- `MyBikeLab/scripts/DatascrapingPrompt.md`

---

## 3. Technical Constraints

- Do not introduce a nested runtime variant model for this evolution. Comparator entries remain flat objects.
- Only documented purchasable configurations may become entries.
- New exploded variant entries must use IDs 200+ and must not reuse reserved ranges 50-128 or 129-137.
- Freehub compatibility must remain `hub.freehub_options` option metadata and must not duplicate entries by itself.
- `other_specs` must not contain spoke material, rim width, brake type, per-variant weight, or per-variant price when a structured field exists.
- Missing price or weight remains `null` and must render as unavailable without excluding the entry.
- Pair-form front/rear values remain supported only for the EVO-038 eligible fields.
- Visible UI work must follow the MyBikeLab design system and the embedded task constraints.

---

## 4. Architecture Decisions

### AD-001
#### Description
Use one flat catalog object per documented purchasable wheelset configuration.

#### Motivation
The existing comparator data path already filters, sorts, renders, and expands one row per object. Keeping this model makes variant behavior entry-level by construction.

#### Rejected alternatives
Nested `variants` arrays were rejected because they would require new flattening or nested selector logic and would make filter semantics harder to reason about.

### AD-002
#### Description
Represent sibling relationships with optional `model_group` and `model_group_label` fields.

#### Motivation
The PRD requires related variants to remain visibly associated without changing the definition of a comparator entry.

#### Rejected alternatives
Group header rows were rejected for the minimum scope because they add table-row behavior and filtering edge cases without being required.

### AD-003
#### Description
Use Caden as the proving catalog migration and preserve current non-Caden entries unless they contain documented variant data that violates the new model.

#### Motivation
The PRD explicitly names Caden as the proving case, and Caden currently stores carbon-spoke and rim-width variant information in `other_specs`.

#### Rejected alternatives
Waiting for a future scraping pass was rejected because acceptance criteria require this evolution to cover the full data-to-frontend path.

### AD-004
#### Description
Extend catalog validation to detect variant-like data stored in `other_specs` and invalid group metadata.

#### Motivation
Manual review is required, but automated validation prevents easy regressions in future catalog ingestion.

#### Rejected alternatives
Relying only on manual source review was rejected because forbidden `other_specs` keys are deterministic enough to validate.

### AD-005
#### Description
Add focused tests for entry-level filter, sort, freehub, divergent-spec, and missing-value behavior.

#### Motivation
These tests directly cover the automated acceptance criteria and protect existing comparator behavior.

#### Rejected alternatives
Only testing the final Caden catalog was rejected because selector-level behavior should be proven with small, explicit fixtures.

---

## 5. Task Breakdown

Each task is described in a dedicated file using `shared-knowledge/templates/TASK-TEMPLATE.md`.

| Task | File | Summary | Dependencies |
|------|------|---------|--------------|
| TASK-001 | `TASK-001.md` | Extend catalog schema validation for variant metadata and forbidden miscellaneous variant fields | none |
| TASK-002 | `TASK-002.md` | Migrate Caden catalog data into flat documented variant entries | TASK-001 |
| TASK-003 | `TASK-003.md` | Add model-family visual association in comparator rows and detail surfaces | TASK-002 |
| TASK-004 | `TASK-004.md` | Add selector and catalog tests for variant entry filtering, sorting, and non-regression rules | TASK-001, TASK-002 |
| TASK-005 | `TASK-005.md` | Verify and align scraping documentation with the implemented catalog model | TASK-001, TASK-002 |

---

## 6. Global Validation Strategy

### Unit validation

- Validate `wheelValidator` warnings for forbidden `other_specs` keys, invalid group metadata, and allowed divergent pairs.
- Validate selector behavior with small variant fixtures for spoke material, rim width, brake type, freehub options, missing price, and missing weight.

### Integration validation

- Validate the full catalog with `validateWheelsCatalog(wheelsData)`.
- Validate Caden entries include grouped sibling variants and no variant-like data remains only in `other_specs`.
- Validate `selectFilteredWheels` includes and excludes sibling variants independently.

### Functional validation

- Manually compare migrated Caden entries against source documentation.
- Open the comparator and confirm sibling entries are visually associated without changing single-entry wheel behavior.
- Confirm unavailable price or weight renders as localized `N/A`.

### Non-regression validation

- Existing filters, sorting, column visibility, freehub display, row expansion, and EVO-038 front/rear divergent specs must keep passing.
- Existing non-variant wheels must remain single rows with no grouping marker.

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Source pages document options without complete purchasable combinations | Inferred invalid variants could enter catalog | Require manual Caden source review and keep no-inferred-combinations rule in task constraints |
| Exploding Caden entries changes catalog counts and tests | Existing brittle tests may fail | Update tests to assert semantic behavior instead of old fixed counts |
| Group labels make the model column too dense | Comparator readability degrades | Use compact secondary text, no header rows, and test table rendering |
| Missing price or weight may be treated as matching range filters | Filtered results could feel too permissive | Preserve current null-pass behavior only where existing range semantics require it, and add explicit tests documenting behavior |
| Scraping documentation may drift from implementation | Future catalog entries may violate schema | TASK-005 performs documentation alignment after implementation details are known |

---

## 8. Rollback Plan

- Revert Caden catalog migration to the previous entries if source validation fails.
- Remove model-family UI rendering while leaving flat entries intact if the visual association causes layout regressions.
- Keep validator additions isolated so they can be relaxed without changing comparator runtime behavior.
