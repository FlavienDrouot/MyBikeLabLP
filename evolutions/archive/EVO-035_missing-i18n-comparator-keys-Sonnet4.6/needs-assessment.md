# Needs Assessment

## 1. General Information

- Evolution ID: EVO-034
- Title: Fix missing/raw translation keys in the wheel comparator
- Author: Flavien Drouot
- Date: 2026-06-02
- Status: Draft
- Priority: Medium

---

## 2. Context

### Current situation
The wheel comparator displays each wheel property in a table cell. For properties
marked as translatable (`spokeMaterial`, `tubelessReady`, `wheelsetCategory`, …),
the cell value is rendered by translating a key built as `<propertyId>.<value>`.

Two conditions currently produce broken display:

1. **Incomplete translation maps.** `spokeMaterial` only has translations for
   `stainless_steel` and `aluminum`, while the active dataset also contains the
   values `carbon`, `carbon_composite`, and `steel`. These appear as raw keys.
2. **Absent data values.** Some wheels have no value for a translatable property,
   so the key becomes `<propertyId>.undefined` (or `.null` / empty). There is no
   fallback, so the raw key is shown.

Observed in the comparator: `tubelessReady.undefined`, `wheelsetCategory.undefined`,
and several untranslated spoke-material values.

### Identified problem
Users see technical keys instead of readable labels. This looks broken and
undermines the credibility of the comparator — which is also a B2B credibility
tool for brand/retailer outreach.

### Business motivation
The comparator is the single interactive feature of the MVP and the centerpiece
of the landing page. Visible raw keys directly damage perceived data quality and
trust.

---

## 3. Business Objective

Every comparator cell must show a clean, human-readable value in the active
language — never a raw translation key — including when the underlying data value
is missing.

---

## 4. Scope

### Included
- Add the missing `spokeMaterial` translations for the values present in the
  active dataset: `carbon`, `carbon_composite`, `steel` (in all locales: en, fr, xx).
- Provide a graceful fallback label ("N/A" / "Inconnu") shown whenever a
  translatable property has no usable value (missing / null / empty), instead of
  rendering a raw key. The fallback must protect against any future missing value,
  not only the cases observed today.

### Excluded
- Filling in or correcting the underlying wheel data (the missing
  `wheelset_category` on 7 wheels and `tubeless_ready` on 1 wheel are NOT
  populated in this evolution — they will be handled as a separate data task).
- Any change to non-translatable properties' rendering.
- Any change to filter/sort behavior.

---

## 5. Constraints

### Business constraints
- The fallback label must be available in every supported language.

### Known technical constraints
- Translatable values are rendered centrally in the comparator's cell renderer,
  which builds the translation key from the raw data value.
- Three locale files must stay in sync: `en.json`, `fr.json`, `xx.json`.

### Regulatory / security constraints
- None.

---

## 6. Use Cases

### Nominal case
As a cyclist browsing the comparator,
I want every property cell to show a readable label,
So that I can trust and understand the data.

### Alternative cases
- A wheel has a spoke material that exists in the data but was not previously
  translated (e.g. `carbon_composite`) → the cell shows the readable translated label.

### Known error cases
- A wheel has no value for a translatable property (missing / null / empty)
  → the cell shows the "N/A" / "Inconnu" fallback label, never a raw key.

---

## 7. Acceptance Criteria

- [ ] No comparator cell ever displays a raw translation key (e.g.
      `tubelessReady.undefined`, `spokeMaterial.steel`).
- [ ] `spokeMaterial` values `carbon`, `carbon_composite`, and `steel` display
      a readable label in en, fr, and xx.
- [ ] A wheel with a missing / null / empty translatable value displays the
      "N/A" / "Inconnu" fallback label in the active language.
- [ ] The fallback applies generically to all translatable properties, not only
      the cases observed today.
- [ ] No underlying wheel data file is modified.

---

## 8. Open Questions

- None blocking. (A follow-up data-completion task for the missing
  `wheelset_category` / `tubeless_ready` values is acknowledged but out of scope.)

---

## 9. Assumptions

- The active dataset is `mavic + roval + zipp + enve` (49 wheels), as aggregated
  in `wheelsData.js`.
- `stainless_steel` and `aluminum` are already correctly translated for
  `spokeMaterial` and require no change.
- The fallback label is a translated string keyed once (e.g. `common.notAvailable`)
  rather than a hardcoded character, so it can read "N/A" / "Inconnu" per locale.
