# PRD — Product Requirements Document

## 1. General Information

- Evolution ID: EVO-031
- Title: Wheel properties i18n flag
- Author: Flavien Drouot
- Date: 2026-05-29
- Version: 1.0
- Needs Assessment reference: `evolutions/EVO-031_wheel-properties-i18n-flag/needs-assessment.md`

---

## 2. Functional Objective

After this evolution, the wheel comparator consistently displays categorical property values (rim material, spoke material, hookless status) in the user's active language. Proper nouns (brand names, model names) are always displayed as literal strings and are never passed through the translation system. The distinction between translatable and non-translatable fields is codified in the central property registry (`wheelProperties.jsx`) and enforced by an automated test suite.

---

## 3. Target Behavior

### General description

Each property entry in `wheelProperties.jsx` carries an explicit `translatable` boolean flag that governs how its values are rendered in the comparator UI:

- When `translatable: true`, the value is looked up in the active locale using the key `[fieldId].[value]` (e.g. `rimMaterial.carbon`). If no key is found, the raw value from the data source is displayed as a fallback.
- When `translatable: false`, the raw value from the data source is displayed directly, with no translation call.

Translation keys for all translatable field values present in the wheel dataset exist in both the `fr` and `en` locale files, following the `[fieldId].[value]` naming convention. The existing `XX` test locale is used by the automated test suite to detect any missing translation keys.

---

## 4. Functional Rules

### FR-001 — Explicit translatability flag on every property

Every entry in `wheelProperties.jsx` must declare a `translatable` boolean field. No property may be left without this field.

### FR-002 — Translatable properties

The following properties are marked `translatable: true`:
- `rimMaterial`
- `spokeMaterial`
- `hookless` (text display form)

### FR-003 — Non-translatable properties

The following properties are marked `translatable: false`:
- `brand`, `model`
- `hubBrand`, `hubModel`
- `spokesBrand`, `spokesModel`
- All numeric and range properties (weight, price, rim depth, rim width, diameter)

### FR-004 — Translation key convention

Translation keys for translatable fields follow the pattern `[fieldId].[value]`. Values use a stable, lowercase snake_case form (e.g. `rimMaterial.carbon`, `spokeMaterial.stainless_steel`, `hookless.true`, `hookless.false`). This convention applies to both `fr` and `en` locale files.

### FR-005 — Rendering of translatable values

In the comparator UI, every value whose field is `translatable: true` must be rendered via `t("[fieldId].[value]")`. The translation call must never be applied to a field with `translatable: false`.

### FR-006 — Fallback for missing translation keys

If a translation key for a `translatable: true` value is absent from the active locale file, the raw value from the data source is displayed as-is. This is the default i18next `fallbackLng` behavior and must not be overridden.

### FR-007 — Live language switch

Switching the active language in the UI must update all translatable categorical values immediately, without requiring a page reload.

### FR-008 — Automated coverage via XX locale

The automated test suite must use the `XX` locale to verify that every value of every `translatable: true` field present in the wheel dataset has a corresponding translation key. A test failure indicates a missing key in the locale files.

---

## 5. Detailed Use Cases

### UC-001 — French user views rim material column

#### Preconditions
- The user's active language is French (`fr`).
- The comparator is loaded with the full wheel dataset.
- Translation keys `rimMaterial.carbon` and `rimMaterial.aluminum` exist in the `fr` locale file.

#### Steps
1. The user opens the comparator.
2. The rim material column is visible (default visible column).
3. The comparator renders each wheel's rim material value.

#### Expected result
- Wheels with `rimMaterial: "carbon"` in the dataset display the French translation of `rimMaterial.carbon`.
- Wheels with `rimMaterial: "aluminum"` display the French translation of `rimMaterial.aluminum`.
- Brand and model names (e.g. `"Roval"`, `"Alpinist CLX"`) are unchanged.

#### Error cases
- None expected in nominal flow.

---

### UC-002 — User switches language from French to English

#### Preconditions
- The user's active language is French (`fr`).
- The comparator is displaying translated categorical values in French.

#### Steps
1. The user activates the language switch control to change to English (`en`).
2. The UI updates reactively.

#### Expected result
- All `translatable: true` field values update to their English form (e.g. rim material renders English labels).
- All `translatable: false` field values (brand, model, hub brand, spoke brand, etc.) remain unchanged — they are identical in both languages.
- No page reload occurs.

#### Error cases
- None expected in nominal flow.

---

### UC-003 — Translatable value with no matching key in active locale

#### Preconditions
- A wheel in the dataset has a `translatable: true` field value (e.g. `spokeMaterial: "stainless_steel"`).
- The active locale file does not contain the key `spokeMaterial.stainless_steel`.

#### Steps
1. The user opens the comparator with the active language set.
2. The comparator attempts to resolve `t("spokeMaterial.stainless_steel")`.
3. The key is not found.

#### Expected result
- The raw value `"stainless_steel"` (or its equivalent from the data source) is displayed as a fallback.
- No error is thrown; the comparator remains functional.

#### Error cases
- The automated test suite (UC-004) catches this condition before it reaches production.

---

### UC-004 — Automated test detects missing translation key

#### Preconditions
- The `XX` locale is configured in the test environment.
- The automated test suite iterates over all `translatable: true` properties in `wheelProperties.jsx` and all their values present in the wheel dataset.

#### Steps
1. The test suite loads the wheel dataset and the `XX` locale.
2. For each `translatable: true` field, it collects all distinct values from the dataset.
3. It checks that each value resolves to `"XX"` (the sentinel translation) when using the `XX` locale.
4. Any value that does not resolve to `"XX"` indicates a missing translation key.

#### Expected result
- All expected keys are present; the test suite passes.

#### Error cases
- A value resolves to its raw form instead of `"XX"`: the test fails, identifying the missing key by name.

---

## 6. Acceptance Criteria

### AC-001
#### Description
Every property entry in `wheelProperties.jsx` declares an explicit `translatable` boolean field.
#### Expected verification
Inspect `wheelProperties.jsx`: no property entry is missing the `translatable` field.
#### Type
- Automated

---

### AC-002
#### Description
`rimMaterial`, `spokeMaterial`, and `hookless` are marked `translatable: true`.
#### Expected verification
In `wheelProperties.jsx`, the entries for `rimMaterial`, `spokeMaterial`, and `hookless` have `translatable: true`.
#### Type
- Automated

---

### AC-003
#### Description
`brand`, `model`, `hubBrand`, `hubModel`, `spokesBrand`, `spokesModel`, and all numeric/range properties are marked `translatable: false`.
#### Expected verification
In `wheelProperties.jsx`, each listed entry has `translatable: false`.
#### Type
- Automated

---

### AC-004
#### Description
Translation keys for all `translatable: true` field values present in the wheel dataset exist in both the `fr` and `en` locale files, using the `[fieldId].[value]` convention.
#### Expected verification
The `fr` and `en` locale files each contain keys: `rimMaterial.carbon`, `rimMaterial.aluminum`, `spokeMaterial.stainless_steel`, `spokeMaterial.carbon`, `hookless.true`, `hookless.false`, and any other value present in the dataset for a translatable field.
#### Type
- Automated

---

### AC-005
#### Description
In the comparator UI, `translatable: true` field values are rendered via `t("[fieldId].[value]")`.
#### Expected verification
With the active language set to `fr`, the rim material, spoke material, and hookless columns display translated strings. With the `XX` locale active (test environment), those cells display `"XX"`.
#### Type
- Automated

---

### AC-006
#### Description
`translatable: false` field values are never passed through the translation function.
#### Expected verification
Brand, model, hub brand/model, and spokes brand/model columns display the raw string from the dataset regardless of active language. Inspecting the rendering code confirms no `t()` call is applied to these values.
#### Type
- Manual

---

### AC-007
#### Description
The automated test suite using the `XX` locale fails if any `translatable: true` value from the wheel dataset lacks a corresponding translation key.
#### Expected verification
Remove or rename a translation key (e.g. delete `rimMaterial.carbon` from the locale file); the test suite reports a failure identifying the missing key. Restore the key; the suite passes.
#### Type
- Automated

---

### AC-008
#### Description
Switching the active language updates categorical values in the comparator without a page reload.
#### Expected verification
In the browser, switch language from `fr` to `en` while the comparator is visible: rim material, spoke material, and hookless cells update reactively. Brands and models remain unchanged.
#### Type
- Manual

---

## 7. Functional Impacts

### Impacted components
- `wheelProperties.jsx` — central property registry: each entry gains a `translatable` boolean field
- Comparator value rendering logic — must route `translatable: true` values through `t()` and render `translatable: false` values as literals
- Automated test suite — new tests covering translation key coverage for all `translatable: true` values

### Impacted data
- `fr` locale file — gains translation keys for all translatable categorical values present in the dataset
- `en` locale file — gains the same keys in English
- `XX` test locale file — must include the same keys mapped to `"XX"` to enable coverage detection

### Impacted APIs
- None

### Impacted permissions / roles
- None

---

## 8. Out of Scope

- Translating UI labels, column headers, filter labels, or section headings
- Translating wheel descriptions or any free-text fields
- Adding new languages beyond `fr` and `en`
- Modifying the rendering logic or data model for non-translatable fields
- Any change to `wheelsData.js` beyond normalizing categorical values to stable lowercase snake_case form (if not already done)

---

## 9. Constraints

- The `translatable` flag must live in `wheelProperties.jsx` — not in `wheelsData.js`
- Must not break the existing `fr`/`en` language switch behavior established in EVO-023
- Fallback behavior for missing keys is the i18next `fallbackLng` default — this behavior must not be overridden
- The `XX` test locale is already in place and must be the mechanism for automated key-coverage tests

---

## 10. Test Plan

### Automated tests expected
- Verify that every entry in `wheelProperties.jsx` has an explicit `translatable` boolean field
- Verify that `rimMaterial`, `spokeMaterial`, and `hookless` are `translatable: true`
- Verify that `brand`, `model`, `hubBrand`, `hubModel`, `spokesBrand`, `spokesModel`, and numeric/range properties are `translatable: false`
- For each `translatable: true` field, collect all distinct values from the wheel dataset; assert that each value resolves to `"XX"` when using the `XX` locale (detects missing keys)
- Assert that `fr` and `en` locale files both contain the full set of required keys

### Manual tests expected
- Load the comparator with `fr` active: verify rim material, spoke material, and hookless cells display French labels
- Load the comparator with `en` active: verify the same cells display English labels
- Confirm brand, model, and hub/spokes name cells are identical in both languages
- Switch language while the comparator is open: verify categorical values update without a page reload

### Edge cases
- A `translatable: true` field value is present in the dataset but has no key in any locale: displayed as raw fallback (covered by the `XX` locale automated test)
- `hookless` is stored as a boolean in the dataset and must be converted to `hookless.true` or `hookless.false` before the translation lookup

### Non-regression
- The existing language switch (`fr` ↔ `en`) continues to work as established in EVO-023
- Non-translatable fields (brands, models, numeric values) are unaffected by the changes
- No existing tests introduced in prior evolutions are broken
