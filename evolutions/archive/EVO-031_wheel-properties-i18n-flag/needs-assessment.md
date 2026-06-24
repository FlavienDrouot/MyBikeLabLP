# Needs Assessment

## 1. General Information

- Evolution ID: EVO-031
- Title: Wheel properties i18n flag
- Author: Flavien Drouot
- Date: 2026-05-29
- Status: Draft
- Priority: Medium

---

## 2. Context

### Current situation

`wheelProperties.jsx` is the central registry for all wheel properties (filters, sorts, columns, accessors). It drives how each property is filtered, displayed, and sorted across the comparator. The i18n system (fr/en) was established in EVO-023.

Some wheel property values stored in `wheelsData.js` are generic categorical terms (`carbon`, `aluminum`, `stainless steel`) that should be displayed in the active language. Others are proper nouns — brand names (`Shimano`, `DT Swiss`), model names (`105`, `Ultegra`) — that must never be translated.

### Identified problem

There is no mechanism in the schema to distinguish translatable values from literal ones. The rendering code has no systematic way to know whether to call `t("field.value")` or display the raw string. This leads to either untranslated categorical values or incorrectly translated proper nouns, with no automated way to detect missing translations.

### Business motivation

The target audience is international and English-speaking (product-overview.md). Displaying categorical values like `"stainless steel"` or `"carbon"` untranslated for French users is an inconsistency that undermines the product's credibility. Fixing this also creates a foundation for adding future languages without guesswork about which values need translating.

---

## 3. Business Objective

Ensure that categorical wheel property values are consistently displayed in the active language, while proper nouns (brands, models) remain literal — with automated test coverage to detect any missing translations.

---

## 4. Scope

### Included

- Add a `translatable: boolean` flag to each property entry in `wheelProperties.jsx`
- Mark as `translatable: true`: `rimMaterial`, `spokeMaterial`, `hookless` (text display)
- Mark as `translatable: false`: `brand`, `model`, `hubBrand`, `hubModel`, `spokesBrand`, `spokesModel`, and all numeric/range properties
- Adopt the key convention `"[fieldId].[value]"` (e.g. `rimMaterial.carbon`, `spokeMaterial.stainless_steel`) in translation files
- Add the corresponding translation keys to the fr and en locale files
- Add automated tests using the existing `XX` test translation set to detect missing translation keys for any `translatable: true` field value present in `wheelsData.js`

### Excluded

- Translating UI labels, column headers, filter labels (out of scope — covered or not by EVO-023)
- Translating wheel descriptions or free-text fields
- Adding new languages beyond fr and en
- Modifying the rendering logic for non-translatable fields

---

## 5. Constraints

### Business constraints

- Must not break the existing fr/en language switch behavior established in EVO-023

### Known technical constraints

- `wheelProperties.jsx` is the single source of truth — the flag must live there, not in `wheelsData.js`
- Fallback behavior: if a translation key is missing, the raw value from `wheelsData.js` is displayed as-is (i18next `fallbackLng` default behavior)
- The `XX` test translation set is already in place and must be used for coverage tests

### Regulatory / security constraints

- None

---

## 6. Use Cases

### Nominal case

As a French-speaking user,
I want categorical wheel values (`carbon`, `aluminum`, `acier inoxydable`) to appear in French,
So that the interface feels consistent with the rest of the localized UI.

### Alternative cases

- User switches from FR to EN: categorical values update to their English form; brand/model names remain unchanged
- A `translatable: true` field value has no matching key in the active locale: the raw value from `wheelsData.js` is displayed as a fallback

### Known error cases

- A `translatable: true` field value is present in `wheelsData.js` but has no key in any locale file: detected by the automated test suite via the `XX` translation set

---

## 7. Acceptance Criteria

- [ ] Each entry in `wheelProperties.jsx` has an explicit `translatable` boolean field
- [ ] `rimMaterial`, `spokeMaterial`, and `hookless` (text display) are marked `translatable: true`
- [ ] Brand, model, hub brand/model, spokes brand/model fields are marked `translatable: false`
- [ ] Translation keys `rimMaterial.carbon`, `rimMaterial.aluminum`, `spokeMaterial.stainless_steel`, `spokeMaterial.carbon` (and any other values present in `wheelsData.js`) exist in both fr and en locale files
- [ ] A `translatable: true` value is rendered via `t("[fieldId].[value]")` in the comparator UI
- [ ] A `translatable: false` value is rendered as a literal string — `t()` is never called on it
- [ ] The automated test suite, using the `XX` locale, fails if any `translatable: true` value from `wheelsData.js` lacks a corresponding translation key
- [ ] Switching language in the UI updates categorical values without a page reload

---

## 8. Open Questions

- None

---

## 9. Assumptions

- The `XX` test locale already maps every defined key to `"XX"` — a missing key would therefore display the raw fallback value, which the test can detect
- `hookless` values are stored as booleans in `wheelsData.js` and converted to a display string before rendering; the translation key convention is `hookless.true` / `hookless.false`
- All categorical values in `wheelsData.js` use a stable, lowercase snake_case form (or will be normalized as part of this evolution)
