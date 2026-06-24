# TASK-001 — Rename freehub column label in all locale files

## Objective

Update the translation strings for the `freehubOptions` property label in all locale files so the column header reads "FREEHUB OPTIONS" (English) and its equivalent in other languages. This is a pure copy/i18n change with no code modifications.

## Required context

- The app uses `react-i18next` with JSON locale files in `MyBikeLab/frontend/public/locales/`.
- The current locale files are: `en.json`, `fr.json`, `xx.json`.
- The column label displayed in the comparator table header is resolved via `t(p.label)` in `ComparisonTable.jsx`, where `p.label` is `'properties.freehubOptions.label'`.
- The column header is rendered in all-caps uppercase in the UI via the CSS class `uppercase` on the `<th>` element (`text-xs font-medium uppercase tracking-widest text-ink-7`). The value stored in the locale file is therefore the natural-case label; the UI handles the visual transformation.
- Current values:
  - `en.json`: `"freehubOptions": { "label": "Freehub" }`
  - `fr.json`: `"freehubOptions": { "label": "Corps de roue libre" }`
  - `xx.json`: unknown — update to match EN pattern.

## Potentially impacted files

- `MyBikeLab/frontend/public/locales/en.json`
- `MyBikeLab/frontend/public/locales/fr.json`
- `MyBikeLab/frontend/public/locales/xx.json`

## Inputs

- PRD FR-001: "The column previously labelled 'FREEHUB' must display the label 'FREEHUB OPTIONS' in the comparator table header."
- Current locale file values listed above.

## Expected outputs

- `en.json`: `"freehubOptions": { "label": "Freehub options" }` (natural case; the UI uppercases via CSS)
- `fr.json`: `"freehubOptions": { "label": "Options de corps de roue libre" }` (or equivalent idiomatic French)
- `xx.json`: update the same key to `"Freehub options"` (or the pseudolocale equivalent if the file uses a different convention)
- The popup title added in TASK-003 will introduce a new key `properties.freehubOptions.popupTitle`; that key is NOT added in this task.

## Constraints

- Do not change any other keys in the locale files.
- Do not change the key path `properties.freehubOptions.label`; only the string value changes.
- The natural-case value stored in the JSON should reflect the label as a readable noun phrase, not all-caps (the CSS `uppercase` class handles display transformation).
- Read `xx.json` before editing it to understand its convention (it may be a pseudolocale or a copy of EN).

## Dependencies

none

## Validation criteria

- [ ] `en.json` has `"freehubOptions": { "label": "Freehub options" }` (or exact agreed text).
- [ ] `fr.json` has an updated French translation for the same key.
- [ ] `xx.json` has been updated consistently.
- [ ] No other keys in any locale file have been changed.
- [ ] Running the app and enabling the FREEHUB OPTIONS column shows the new label in the header row.

## Tests to implement

### Unit
- None required (PRD section 10: no automated tests for this evolution).

### Integration
- None required.
