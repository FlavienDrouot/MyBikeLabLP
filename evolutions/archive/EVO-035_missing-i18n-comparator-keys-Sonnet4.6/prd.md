# PRD — Product Requirements Document

## 1. General Information

- Evolution ID: EVO-035
- Title: Fix missing/raw translation keys in the wheel comparator
- Author: Flavien Drouot
- Date: 2026-06-02
- Version: 1.0
- Needs Assessment reference: `needs-assessment.md` (EVO-034/EVO-035, 2026-06-02)

---

## 2. Functional Objective

After this evolution, every cell in the wheel comparator that renders a translatable property must display a clean, human-readable label in the active language — regardless of whether a matching translation entry exists and regardless of whether the underlying data value is present.

No user should ever see a raw translation key such as `spokeMaterial.carbon_composite` or `tubelessReady.undefined` in the comparator.

---

## 3. Target Behavior

### General description

The comparator renders wheel properties in a table. For properties designated as translatable (e.g. `spokeMaterial`, `tubelessReady`, `wheelsetCategory`), the cell value is produced by looking up a translation key built from the property identifier and the data value.

After this evolution the rendering logic must cover two additional situations:

1. **Known value, missing translation** — When the data contains a valid value for a translatable property but no translation entry exists for it, the system must display the value using whatever translation is available. Currently this affects `spokeMaterial` values `carbon`, `carbon_composite`, and `steel`, which have no translation entries.

2. **Missing data value** — When the data contains no value (missing, null, or empty string) for a translatable property, the system must display a localized "not available" label instead of attempting to build and resolve a key. The fallback label must be defined once per locale and reused across all translatable properties.

Both situations must be handled generically so that future additions to the dataset or the list of translatable properties do not require defensive changes to the rendering logic.

---

## 4. Functional Rules

### FR-001 — Complete spokeMaterial translation coverage

The translation system must provide readable labels for all `spokeMaterial` values present in the active dataset. The values `carbon`, `carbon_composite`, and `steel` must be added to the translation map for every supported locale (`en`, `fr`, `xx`). The existing entries for `stainless_steel` and `aluminum` must remain unchanged.

### FR-002 — Generic fallback for missing data values

When the data value for a translatable property is absent (null, undefined, or empty string), the cell must display a localized "not available" label. This label must be a dedicated translation entry (e.g. keyed as `common.notAvailable`) so that it reads appropriately in each locale: "N/A" in English, "Inconnu" in French, and an equivalent in the `xx` locale. The fallback must not be a hardcoded string in the rendering logic.

### FR-003 — Generic fallback scope

The fallback defined in FR-002 must apply to all translatable properties rendered by the comparator's cell renderer, not only to the properties where raw keys have been observed today. Any translatable property that receives a missing value must automatically show the fallback label.

### FR-004 — No modification of wheel data files

No underlying wheel data file (e.g. `wheelsData.js` or equivalent source files) may be modified as part of this evolution. The missing `wheelset_category` and `tubeless_ready` values on the affected wheels are explicitly out of scope.

### FR-005 — No regression on existing translations

Properties that already display correctly (`stainless_steel`, `aluminum`, all non-translatable properties) must continue to display exactly as before.

---

## 5. Detailed Use Cases

### UC-001 — Viewing a wheel with a previously untranslated spoke material

#### Preconditions
- The user has opened the wheel comparator.
- At least one wheel in the active dataset has `spokeMaterial` set to `carbon`, `carbon_composite`, or `steel`.
- The active locale is `en`, `fr`, or `xx`.

#### Steps
1. The user views the comparator table (default or filtered view).
2. The cell for `spokeMaterial` on an affected wheel is rendered.
3. The rendering logic builds the translation key from the property identifier and the data value.
4. The translation system resolves the key to the label defined in FR-001.

#### Expected result
- The cell displays the readable translated label for the spoke material (e.g. "Carbon", "Carbone composite", "Steel" according to locale).
- No raw key (e.g. `spokeMaterial.carbon_composite`) is visible.

#### Error cases
- None within scope — all spoke material values present in the active dataset must have translation entries after this evolution.

---

### UC-002 — Viewing a wheel with a missing translatable property value

#### Preconditions
- The user has opened the wheel comparator.
- At least one wheel in the active dataset has no value (null, undefined, or empty) for a translatable property such as `tubelessReady` or `wheelsetCategory`.
- The active locale is `en`, `fr`, or `xx`.

#### Steps
1. The user views the comparator table (default or filtered view).
2. The cell for the affected translatable property is rendered.
3. The rendering logic detects that the data value is absent.
4. The rendering logic uses the fallback label defined in FR-002.

#### Expected result
- The cell displays the localized "not available" label (e.g. "N/A" in English, "Inconnu" in French).
- No raw key (e.g. `tubelessReady.undefined`, `wheelsetCategory.undefined`) is visible.

#### Error cases
- If the `common.notAvailable` translation entry is itself missing for a locale, this would produce a raw key — the entry must therefore be present in all supported locales as part of this evolution.

---

### UC-003 — Locale switch with missing or untranslated values

#### Preconditions
- The comparator is displaying one or more wheels with missing translatable values or previously untranslated spoke material values.
- The user switches the active locale (e.g. from `en` to `fr`).

#### Steps
1. The user triggers a locale change.
2. All affected cells re-render using the new active locale.

#### Expected result
- Cells with previously untranslated spoke material values now display the label for the new locale.
- Cells with missing values now display the "not available" label for the new locale.
- No raw key is visible in any cell.

---

## 6. Acceptance Criteria

### AC-001
#### Description
No cell in the wheel comparator displays a raw translation key under any data condition.

#### Expected verification
Inspect the rendered comparator table for all wheels in the active dataset across all supported locales (`en`, `fr`, `xx`). Confirm that no cell content matches the pattern `<propertyId>.<value>` or `<propertyId>.undefined`.

#### Type
- Manual

---

### AC-002
#### Description
The `spokeMaterial` values `carbon`, `carbon_composite`, and `steel` each display a readable label in `en`, `fr`, and `xx`.

#### Expected verification
For each of the three values, verify the displayed text in each locale matches the label defined in the corresponding translation file. The label must be human-readable (not a key, not an empty string).

#### Type
- Manual
- Automated (translation file linting: assert keys `spokeMaterial.carbon`, `spokeMaterial.carbon_composite`, `spokeMaterial.steel` exist and have non-empty values in `en.json`, `fr.json`, `xx.json`)

---

### AC-003
#### Description
A wheel with a missing / null / empty value for any translatable property displays the localized "not available" fallback label, not a raw key.

#### Expected verification
Using the active dataset (where `wheelset_category` is absent on 7 wheels and `tubeless_ready` is absent on 1 wheel), verify that the `wheelsetCategory` and `tubelessReady` cells for those wheels show "N/A" (en) or "Inconnu" (fr) rather than any raw key.

#### Type
- Manual

---

### AC-004
#### Description
The fallback label is driven by a single translation entry per locale (e.g. `common.notAvailable`) and is not a hardcoded string in the rendering logic.

#### Expected verification
Inspect the cell renderer source: confirm that the fallback path resolves through the translation system using a key, not a string literal. Confirm the key exists in `en.json`, `fr.json`, and `xx.json` with appropriate values.

#### Type
- Manual (code review)
- Automated (translation file linting: assert `common.notAvailable` exists and is non-empty in all locale files)

---

### AC-005
#### Description
No underlying wheel data file is modified.

#### Expected verification
Confirm via git diff that no wheel data source file (e.g. `wheelsData.js`) has been changed in this evolution.

#### Type
- Automated (git diff assertion)

---

### AC-006
#### Description
Wheels with correctly translated properties (e.g. `spokeMaterial.stainless_steel`, `spokeMaterial.aluminum`) continue to display exactly as before.

#### Expected verification
Verify that the displayed labels for `stainless_steel` and `aluminum` spoke materials are unchanged in all locales. Verify that non-translatable properties are unaffected.

#### Type
- Manual

---

## 7. Functional Impacts

### Impacted components
- Wheel comparator cell renderer (the component responsible for resolving translatable property values into display strings)

### Impacted data
- Locale translation files: `en.json`, `fr.json`, `xx.json`
  - New keys added: `spokeMaterial.carbon`, `spokeMaterial.carbon_composite`, `spokeMaterial.steel`
  - New key added: `common.notAvailable` (or equivalent shared fallback key)

### Impacted APIs
- None

### Impacted permissions / roles
- None

---

## 8. Out of Scope

- Populating missing data values for `wheelset_category` (7 wheels) and `tubeless_ready` (1 wheel) in the wheel dataset — handled as a separate data task.
- Rendering changes for non-translatable properties.
- Changes to filter or sort behavior.
- Adding new translatable properties.
- Changes to translation infrastructure (e.g. translation loading mechanism, locale detection).

---

## 9. Constraints

- All three locale files (`en.json`, `fr.json`, `xx.json`) must remain in sync: every new key added to one must be added to all.
- The fallback label must be a translated string, not a hardcoded value, so it remains correct if new locales are added in the future.
- No wheel data file may be modified.

---

## 10. Test Plan

### Automated tests expected
- Translation file linting: assert that `spokeMaterial.carbon`, `spokeMaterial.carbon_composite`, and `spokeMaterial.steel` exist and are non-empty in all locale files.
- Translation file linting: assert that `common.notAvailable` (or the chosen key) exists and is non-empty in all locale files.
- Git diff assertion: no wheel data source file has been modified.

### Manual tests expected
- Open the comparator in each locale (`en`, `fr`, `xx`) and scan all rows for raw keys — none should be visible.
- Verify that wheels with missing `wheelsetCategory` or `tubelessReady` values display the "not available" label in each locale.
- Verify that wheels with `spokeMaterial` values `carbon`, `carbon_composite`, or `steel` display a readable label in each locale.
- Switch locale mid-session and confirm all affected cells re-render correctly.

### Edge cases
- A translatable property with an empty string value (not null, not undefined) must also trigger the fallback label.
- A translatable property value that exists in the data but has no translation entry in any locale file — should not occur after this evolution for the known dataset, but the rendering logic must handle it gracefully rather than displaying a raw key.

### Non-regression
- Wheels with `spokeMaterial.stainless_steel` or `spokeMaterial.aluminum` must continue to display the same labels as before in all locales.
- All non-translatable properties (weight, price, rim depth, etc.) must be unaffected.
- Filter and sort functionality must remain unchanged.
