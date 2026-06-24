# PRD - Product Requirements Document

## 1. General Information

- Evolution ID: EVO-044
- Title: Product variants catalog model
- Author: Codex
- Date: 2026-06-04
- Version: 1.0 Draft
- Needs Assessment reference: `needs-assessment.md`

---

## 2. Functional Objective

MyBikeLab must allow users to compare documented purchasable wheelset variants as first-class comparator entries while making their relationship to a shared model family clear.

After this evolution, a user must be able to filter, sort, scan, and compare variant-specific wheelset configurations such as spoke material, rim width, and brake type without confusing them with non-comparable options such as freehub compatibility or front/rear divergent specifications.

---

## 3. Target Behavior

### General description

The catalog must distinguish between a wheelset model family and the documented purchasable variants that belong to it.

Each comparator row or card must represent one documented purchasable front-and-rear wheelset configuration. When a wheelset has multiple documented purchasable variants, each variant must appear as its own comparable entry. Related variants must remain visually and functionally associated with the same model family so users understand they are alternatives within one product family, not unrelated products.

Wheelsets without documented variants must continue to appear as simple single comparator entries with no additional grouping behavior.

---

## 4. Functional Rules

### FR-001 - Wheelset comparator entry

Each comparator entry must represent a complete purchasable road wheelset composed of a front wheel and a rear wheel.

### FR-002 - Variant row eligibility

A variant may appear as its own comparator entry only when the source explicitly documents it as a purchasable configuration.

### FR-003 - No inferred combinations

The catalog must not create variant entries by combining independent options unless the source explicitly documents the resulting combination as purchasable.

### FR-004 - Comparable variant axes

For this evolution, spoke material, rim width, and brake type must be treated as comparable variant axes when they identify documented purchasable wheelset variants.

### FR-005 - Freehub as configuration option

Freehub compatibility must remain a non-comparable configuration option. It must not create duplicate comparator entries by itself.

### FR-006 - Model family grouping

When multiple comparator entries belong to the same wheelset model family, the UI must visibly indicate that relationship.

### FR-007 - Single-entry wheelsets

Wheelsets with no documented purchasable variants must remain single comparator entries and must not show unnecessary grouping markers.

### FR-008 - Variant-level comparison

Filtering, sorting, and displayed values must operate on the comparator entry being shown. For variant entries, this means the variant-specific values must be used.

### FR-009 - Structured field precedence

When a piece of product information has a structured comparable field, it must not be shown only as an unstructured miscellaneous note.

### FR-010 - Miscellaneous notes

Unstructured notes must remain available only for non-comparable information, rare source-specific details, or contextual comments that do not have a structured field.

### FR-011 - Front/rear divergent specifications

Front/rear divergent specifications must remain supported as specifications of one wheelset entry. They must not be modeled as product variants unless the source documents separate purchasable wheelset configurations.

### FR-012 - Incomplete variant data

If a documented variant is missing a comparable value such as price or weight, the entry must remain visible, and the missing value must be clearly represented as unavailable rather than guessed.

### FR-013 - Source coherence

When source information contains conflicting marketing labels and product details, the catalog must use the documented purchasable configuration as the functional reference for comparator entries.

---

## 5. Detailed Use Cases

### UC-001 - Compare variants from the same model family

#### Preconditions

- A wheelset model family has at least two documented purchasable variants.
- The variants differ by at least one supported variant axis.

#### Steps

1. The user opens the wheel comparator.
2. The user sees the related variant entries in the comparator.
3. The user compares their variant-specific values.
4. The user identifies that the entries belong to the same model family.

#### Expected result

- Each documented purchasable variant is available as a separate comparator entry.
- The model family relationship is visible.
- Variant-specific values are shown on the relevant entries.

#### Error cases

- If a value is unavailable for one variant, that value is shown as unavailable.
- If only one purchasable configuration is documented, only one comparator entry appears.

### UC-002 - Filter by variant-specific spoke material

#### Preconditions

- The comparator contains variant entries with different spoke materials.

#### Steps

1. The user opens the spoke material filter.
2. The user selects a spoke material.
3. The comparator list updates.

#### Expected result

- Entries matching the selected spoke material remain visible.
- Entries with other spoke materials are excluded.
- The result operates at comparator-entry level, not model-family level.

#### Error cases

- Entries with unavailable spoke material must not be treated as matching a selected material.

### UC-003 - Filter or compare by rim width

#### Preconditions

- The comparator contains documented variants with different rim widths.

#### Steps

1. The user applies a rim width filter or reviews the rim width column.
2. The user compares the resulting entries.

#### Expected result

- Rim width values reflect the comparator entry being displayed.
- Variants with different documented rim widths can be distinguished.

#### Error cases

- If rim width differs between front and rear wheels inside one wheelset, it remains a front/rear divergent specification, not a variant by itself.

### UC-004 - Compare brake type variants

#### Preconditions

- A source documents both disc brake and rim brake purchasable variants for a wheelset model family.

#### Steps

1. The user views the model family in the comparator.
2. The user identifies disc and rim brake entries.
3. The user filters or sorts the comparator.

#### Expected result

- Disc and rim brake variants appear as separate comparator entries only when both are documented purchasable configurations.
- Filtering and sorting use the brake type of each entry.

#### Error cases

- If a brand page mentions compatibility without documenting separate purchasable configurations, no duplicate entries are created.

### UC-005 - Keep freehub options out of variant rows

#### Preconditions

- A wheelset has multiple documented freehub compatibility options.

#### Steps

1. The user views the wheelset in the comparator.
2. The user reviews the wheelset's configuration information.

#### Expected result

- Freehub compatibility is available as configuration information.
- Freehub options do not create separate comparator entries.

#### Error cases

- If a source documents a complete wheelset variant that differs by more than freehub compatibility, only the documented purchasable variant axes define whether a separate comparator entry is needed.

### UC-006 - Preserve non-variant wheel behavior

#### Preconditions

- A wheelset has no documented purchasable variants.

#### Steps

1. The user views the comparator.
2. The user filters, sorts, and compares the wheelset.

#### Expected result

- The wheelset appears once.
- It behaves like existing comparator entries.
- No model-family grouping is shown unless it belongs to a multi-entry family.

#### Error cases

- Miscellaneous notes do not cause a wheelset to be split into variants.

---

## 6. Acceptance Criteria

### AC-001

#### Description
Spoke material, rim width, and brake type are available as comparable/filterable variant axes when they identify documented purchasable wheelset variants.

#### Expected verification
Given catalog entries with documented variants on those axes, each variant can be filtered and compared using its own values.

#### Type
- Automated

### AC-002

#### Description
Freehub compatibility remains a non-comparable option list.

#### Expected verification
Given a wheelset with multiple freehub options and no other documented variant axis, the comparator shows one entry and exposes freehub compatibility as option information.

#### Type
- Automated

### AC-003

#### Description
Each comparator row or card represents only one documented purchasable wheelset configuration.

#### Expected verification
Every variant entry in the catalog can be traced to an explicitly documented purchasable source configuration.

#### Type
- Manual

### AC-004

#### Description
The catalog does not create inferred variant combinations.

#### Expected verification
Given a source that lists independent options without documented combinations, the catalog contains no generated combination entries.

#### Type
- Manual

### AC-005

#### Description
Related variant entries are grouped under a shared model family.

#### Expected verification
Given multiple variants of the same model family, the comparator visibly identifies their relationship.

#### Type
- Manual

### AC-006

#### Description
Wheelsets without documented variants remain single entries.

#### Expected verification
Given a non-variant wheelset, the comparator displays it once and does not add visible grouping behavior.

#### Type
- Automated

### AC-007

#### Description
Filters operate at comparator-entry level.

#### Expected verification
Given two variants in one model family with different filterable values, applying a filter includes only the matching variant entries.

#### Type
- Automated

### AC-008

#### Description
Sorting operates at comparator-entry level.

#### Expected verification
Given two variants in one model family with different sortable values, sorting orders them according to their own values.

#### Type
- Automated

### AC-009

#### Description
Variant-like data with a structured field is not carried only in miscellaneous notes.

#### Expected verification
Catalog review confirms spoke material, rim width, and brake type values are represented in structured comparable fields when available.

#### Type
- Manual

### AC-010

#### Description
Front/rear divergent specifications remain separate from product variants.

#### Expected verification
Given a wheelset with different front and rear specs inside the same purchasable pair, the comparator keeps it as one entry unless separate purchasable variants are documented.

#### Type
- Automated

### AC-011

#### Description
Documented variants with missing price or weight remain visible.

#### Expected verification
Given a documented variant missing price or weight, the comparator shows the entry and represents the missing value as unavailable.

#### Type
- Automated

### AC-012

#### Description
Caden data acts as the proving case for variant modeling.

#### Expected verification
Caden variants documented for spoke material, rim width, or brake type appear as comparator entries without using miscellaneous notes as their primary representation.

#### Type
- Manual

---

## 7. Functional Impacts

### Impacted components

- Wheel comparator list and card/table presentation.
- Filter controls for variant-aware fields.
- Sort behavior for variant-aware fields.
- Any UI surface that displays wheel model identity, wheel specifications, or miscellaneous notes.

### Impacted data

- Wheel catalog entries.
- Model family identity.
- Variant-specific product values.
- Freehub compatibility option information.
- Miscellaneous notes.
- Caden catalog data as the proving case.
- Existing current-brand catalog entries where documented variant data is present.

### Impacted APIs

- No user-facing external API is in scope.

### Impacted permissions / roles

- No permissions or user roles are impacted.

---

## 8. Out of Scope

- Inferring undocumented variant combinations.
- Turning freehub options into separate comparable entries.
- Building a detailed in-row variant selector as a minimum requirement.
- Changing the definition of a comparator entry from a front-and-rear wheelset pair to individual wheels.
- Treating front/rear divergent specifications as product variants.
- Adding user accounts, saved comparisons, e-commerce checkout, or backend catalog management.

---

## 9. Constraints

- Only documented purchasable variants may become comparator entries.
- Caden must be used as the proving case.
- The catalog must remain coherent across current brands.
- Existing non-variant wheelsets must preserve their current comparator behavior.
- Existing ID reservations must be respected, including Caden IDs 129-137 and Panda Podium reservation 50-128.
- The full data-to-frontend path must be covered by this evolution: catalog data, scraping transformation rules, filters, sorting, display, and grouping behavior.
- Front/rear divergent specifications from EVO-038 must remain supported and distinct from product variants.

---

## 10. Test Plan

### Automated tests expected

- Filtering includes and excludes variant entries according to variant-specific spoke material, rim width, and brake type values.
- Sorting orders variant entries using variant-specific sortable values.
- Non-variant wheelsets remain single entries.
- Freehub options do not create duplicate comparator entries.
- Front/rear divergent specifications remain one comparator entry unless a documented variant exists.
- Missing price or weight values are represented as unavailable without hiding documented variants.

### Manual tests expected

- Review Caden variants against source documentation.
- Confirm no inferred variant combinations were created.
- Confirm model family grouping is understandable in the comparator UI.
- Confirm structured variant data is not left only in miscellaneous notes.
- Confirm existing current-brand catalog entries remain coherent after migration.

### Edge cases

- Source documents a variant axis but not the purchasable combinations.
- Source lists conflicting marketing labels and product details.
- Variant has missing price.
- Variant has missing weight.
- Wheelset has front and rear divergent dimensions.
- Wheelset has multiple freehub compatibility options only.

### Non-regression

- Existing filters still work for current comparable fields.
- Existing sorting still works for current sortable fields.
- Existing column visibility behavior remains available.
- Existing non-variant wheels still appear and compare correctly.
