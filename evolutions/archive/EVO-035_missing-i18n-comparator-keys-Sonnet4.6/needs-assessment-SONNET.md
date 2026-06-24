# Needs Assessment

## 1. General Information

- Evolution ID: EVO-034
- Title: Fix missing i18n keys in the comparator
- Author: Flavien Drouot
- Date: 2026-06-02
- Status: Draft
- Priority: High (visible UI breakage)

---

## 2. Context

### Current situation

The comparator renders translatable property values using the pattern `t(propertyId + '.' + value)`. Translation keys for the possible values of each translatable property are declared in the locale files (`en.json`, `fr.json`, `xx.json`).

### Identified problem

Three groups of missing translation keys cause raw key strings to be displayed in the comparator:

1. **`tubelessReady.undefined`** — The wheel registry property `tubelessReady` has accessor `(w) => w.rim?.tubeless_ready`. None of the scraped data files (mavic, roval, zipp, enve) populate this field, so the accessor returns `undefined`. The rendered key `t('tubelessReady.undefined')` has no translation.

2. **`wheelsetCategory.undefined`** — Same cause: accessor `(w) => w.wheelset_category` returns `undefined` for all current wheels. The rendered key `t('wheelsetCategory.undefined')` has no translation.

3. **`spokeMaterial` incomplete** — The data contains three values not covered by the locale files: `'carbon'` (Mavic), `'carbon_composite'` (Roval), `'steel'` (Mavic). Additionally, Zipp and Enve wheels have `null` or `''` (empty string) as the material value:
   - `null` → `t('spokeMaterial.null')` → key missing
   - `''` (empty string) → `t('spokeMaterial.')` → structurally invalid, never resolves

### Business motivation

Raw i18n key strings (`tubelessReady.undefined`, `spokeMaterial.carbon_composite`, etc.) displayed in the comparator undermine product credibility. This is a visible UI breakage affecting every user.

---

## 3. Business Objective

Eliminate all raw i18n key strings from the comparator by:
- Adding the missing translation keys across all three locales
- Ensuring empty string values resolve gracefully

---

## 4. Scope

### Included

- Add `tubelessReady.undefined` to `en.json`, `fr.json`, `xx.json`
- Add `wheelsetCategory.undefined` to `en.json`, `fr.json`, `xx.json`
- Add `spokeMaterial.carbon`, `spokeMaterial.carbon_composite`, `spokeMaterial.steel` to `en.json`, `fr.json`, `xx.json`
- Add `spokeMaterial.null` to `en.json`, `fr.json`, `xx.json`
- Normalize empty string `''` to `'null'` before the i18n key lookup in `columnCells.jsx` and `FilterPanel.jsx` (required for `spokeMaterial.null` to cover the empty string case)

### Excluded

- Populating the missing `tubeless_ready` and `wheelset_category` fields in the wheel data files — this is a data collection task, not in scope here
- Changing the logic for how `undefined` values appear as filter options in the `wheelsetCategory` multiSelect filter
- Any visual or layout change

---

## 5. Constraints

### Business constraints

- Translations must be neutral and consistent with existing locale tone (terse, data-focused)
- The `—` dash is the established convention for missing/unknown values in this product

### Known technical constraints

- `t('spokeMaterial.')` (empty string key) will never resolve in i18next regardless of locale files — a code-level normalization is required
- Three locale files must be updated in sync: `en.json`, `fr.json`, `xx.json`
- `xx.json` is the pseudo-locale used for i18n testing: values should follow the `XX` pattern (or the bracketed `[key]` format if the project uses that for debugging)

### Regulatory / security constraints

- None

---

## 6. Use Cases

### Nominal case

As a user browsing the comparator,
I want spoke material, tubeless readiness, and wheel category values to be displayed in readable text,
So that I can compare wheels without seeing raw technical key strings.

### Alternative cases

- Wheel with no `tubeless_ready` data → displays "—" (or locale equivalent)
- Wheel with no `wheelset_category` data → displays "—"
- Wheel with `null` spoke material → displays "—"
- Wheel with empty string spoke material → displays "—" (via normalization)

### Known error cases

- If a new spoke material value is added to the data without a corresponding translation key, the raw key will appear again — this is expected behavior until the key is added.

---

## 7. Acceptance Criteria

- [ ] No raw i18n key string (of the form `propertyId.value`) is visible in the comparator table for any current wheel in the dataset
- [ ] `tubelessReady.undefined` resolves to "—" in EN and FR locales
- [ ] `wheelsetCategory.undefined` resolves to "—" in EN and FR locales
- [ ] `spokeMaterial.carbon` resolves to "Carbon" (EN) and "Carbone" (FR)
- [ ] `spokeMaterial.carbon_composite` resolves to "Carbon composite" (EN) and "Composite carbone" (FR)
- [ ] `spokeMaterial.steel` resolves to "Steel" (EN) and "Acier" (FR)
- [ ] `spokeMaterial.null` resolves to "—" in EN and FR locales
- [ ] Wheels with `spokes.material: ''` display "—", not a raw key or blank
- [ ] The `xx.json` pseudo-locale is updated with the same set of keys

---

## 8. Open Questions

- None — scope is fully defined.

---

## 9. Assumptions

- The existing `—` dash convention for missing values is intentional and should be reused (not "Unknown" or "N/A")
- `carbon_composite` and `steel` are stable canonical values in the data; no normalization of data values is required as part of this evolution
- The empty string normalization in `columnCells.jsx` and `FilterPanel.jsx` is safe to apply broadly (not limited to `spokeMaterial` only), as it cannot introduce regressions for other translatable properties
