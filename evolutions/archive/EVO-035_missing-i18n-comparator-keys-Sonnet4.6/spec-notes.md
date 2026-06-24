# Spec Notes — EVO-035

## PRD interpretations

### Interpretation 1 — Scope of the cell renderer patch
The PRD says the fix must be generic (FR-003). The current renderer in `columnCells.jsx` handles all translatable properties through a single code path (`property.translatable && t`). Patching that one path is sufficient to cover all translatable properties now and in the future.

### Interpretation 2 — "Missing value" definition
FR-002 lists null, undefined, and empty string as absent values. The implementation must treat all three identically: `value == null || value === ''` (where `== null` catches both `null` and `undefined`).

### Interpretation 3 — `xx` locale label for `common.notAvailable`
The PRD specifies "N/A" for English and "Inconnu" for French, but is silent on the `xx` locale. The `xx` locale uses placeholder strings "XX" for all keys. Consistent with that convention, `common.notAvailable` in `xx.json` will be `"XX"` (the placeholder sentinel). This preserves the locale's role as a visual test locale.

### Interpretation 4 — `xx` locale labels for new `spokeMaterial` values
Same as above: `carbon`, `carbon_composite`, and `steel` in `xx.json` will use `"XX"` as their values, consistent with all existing `xx.json` entries.

### Interpretation 5 — Placement of `common` section in locale files
No `common` section exists in the locale files yet. It will be added as a new top-level key `"common"` containing a `"notAvailable"` entry. This mirrors the existing structure (e.g. `"nav"`, `"hero"`, `"comparator"`).

### Interpretation 6 — Task for the cell renderer vs. locale files
The two changes (locale files and renderer) are independent: one is pure JSON data, the other is JavaScript logic. They are split into separate tasks so each can be reviewed and merged independently per the TECH-SPECS constraint.

### Interpretation 7 — No changes to `wheelProperties.jsx`
The `translatable: true` flag already exists on `spokeMaterial`, `tubelessReady`, `wheelsetCategory`, `brakeType`, `rimMaterial`, and `hookless`. The registry requires no changes for this evolution.

---

## Architecture decision rationale

### AD-001 — Guard in `columnCells.jsx` rather than in the property accessor
The PRD requires the fallback to be generic and driven by the translation system. The accessor in `wheelProperties.jsx` returns the raw data value; transforming it there would mix data and presentation concerns. The cell renderer in `columnCells.jsx` is the correct boundary: it already owns the `t()` call and is the single code path for all translatable properties.

Rejected alternative: add a default value to each accessor (e.g. return `'unknown'` when null). This would require modifying `wheelProperties.jsx` for every translatable property and would produce untranslated sentinel strings rather than locale-aware labels.

### AD-002 — Key `common.notAvailable` rather than a property-specific fallback
A single shared key is the minimal change that satisfies FR-002 through FR-004. It avoids adding per-property fallback keys, keeps locale files lean, and ensures consistency across all translatable properties now and in the future.

Rejected alternative: property-level fallback keys (e.g. `tubelessReady.unknown`). Rejected because it duplicates the fallback concept N times and requires updates each time a new translatable property is added.

### AD-003 — Three locale files updated in one task (TASK-001)
All three files (`en.json`, `fr.json`, `xx.json`) receive identical structural changes (same keys, locale-appropriate values). Splitting into three tasks would create artificial dependencies and add process overhead without benefit. One task, one PR, three files.

---

## Tradeoffs

### Option not taken — i18next `missingKeyHandler`
i18next provides a global `missingKeyHandler` callback that fires when a key is not found. It could be used to return `t('common.notAvailable')` automatically. Rejected because: (1) it would affect the entire application, not just the comparator; (2) it changes global i18n configuration, which is explicitly out of scope (PRD section 8); (3) it conflates two distinct problems (missing translation entry vs. missing data value) into one handler.

### Option not taken — i18next `defaultValue` per `t()` call
`t('spokeMaterial.carbon', { defaultValue: t('common.notAvailable') })` would handle the missing-translation case at the call site. Rejected because the current architecture calls `t()` generically in `columnCells.jsx` without knowledge of individual property fallbacks. Using `defaultValue` for the missing-data case would also require the value check to happen before calling `t()` anyway, making the explicit guard cleaner.

---

## Open questions

None. All ambiguities have been resolved by the interpretations above or are explicitly out of scope in the PRD.
