# TASK-003 — Add categorical value translation keys to locale files

## Objective

Add translation keys for all `translatable: true` field values to `en.json`, `fr.json`, and `xx.json`. Keys follow the pattern `[fieldId].[value]` and are placed at the top level of each JSON file (not nested under `properties`).

## Required context

- Locale files are at `frontend/public/locales/en.json`, `fr.json`, `xx.json`.
- The `xx.json` file uses `"XX"` as the value for every key — this is a sentinel for the automated coverage test.
- Key structure: top-level JSON object. New keys are added at the same top level as `"properties"`, `"sorts"`, `"filters"`, etc.
- The three translatable fields and their values in the dataset (after TASK-002 normalization) are:
  - `rimMaterial`: `carbon`, `aluminum`
  - `spokeMaterial`: `stainless_steel`, `aluminum`
  - `hookless`: `true`, `false`

## Keys to add

### `rimMaterial` namespace

```json
"rimMaterial": {
  "carbon": "...",
  "aluminum": "..."
}
```

### `spokeMaterial` namespace

```json
"spokeMaterial": {
  "stainless_steel": "...",
  "aluminum": "..."
}
```

### `hookless` value namespace

```json
"hookless": {
  "true": "...",
  "false": "..."
}
```

Note: the key `"hookless"` at the top level must not conflict with the existing `"filters.hookless"` nested key. Because the locale JSON uses nested namespaces via dot notation in i18next, `"hookless"` at the top level and `"filters.hookless"` inside the `"filters"` object are separate namespaces and do not conflict.

## Exact values per locale

### `en.json`

```json
"rimMaterial": {
  "carbon": "Carbon",
  "aluminum": "Aluminum"
},
"spokeMaterial": {
  "stainless_steel": "Stainless steel",
  "aluminum": "Aluminum"
},
"hookless": {
  "true": "Hookless",
  "false": "Hooked"
}
```

### `fr.json`

```json
"rimMaterial": {
  "carbon": "Carbone",
  "aluminum": "Aluminium"
},
"spokeMaterial": {
  "stainless_steel": "Inox",
  "aluminum": "Aluminium"
},
"hookless": {
  "true": "Hookless",
  "false": "Avec crochet"
}
```

Note: "Hookless" is kept as-is in French (it is the established industry term, already used in the existing French locale).

### `xx.json`

```json
"rimMaterial": {
  "carbon": "XX",
  "aluminum": "XX"
},
"spokeMaterial": {
  "stainless_steel": "XX",
  "aluminum": "XX"
},
"hookless": {
  "true": "XX",
  "false": "XX"
}
```

## Potentially impacted files

- `frontend/public/locales/en.json`
- `frontend/public/locales/fr.json`
- `frontend/public/locales/xx.json`

## Inputs

- Current content of each locale file (read before editing).
- Key and value specifications above.

## Expected outputs

Each locale file gains three top-level namespaces: `rimMaterial`, `spokeMaterial`, `hookless`. All existing keys in each file are unchanged.

## Constraints

- Do not modify any existing key or value in any locale file.
- The `xx.json` file must map every new key to exactly `"XX"` (the sentinel string).
- The new keys must be placed as valid JSON (no trailing commas, valid syntax).
- The `test-setup.js` file imports `en.json` and `xx.json` directly as static JSON for tests — the keys added here will be available immediately in the test environment once this task is merged.
- Do not add keys for `brand`, `model`, `hubBrand`, `hubModel`, `spokesBrand`, `spokesModel`, or any numeric value.

## Dependencies

none

## Validation criteria

- [ ] `en.json` contains `rimMaterial.carbon`, `rimMaterial.aluminum`, `spokeMaterial.stainless_steel`, `spokeMaterial.aluminum`, `hookless.true`, `hookless.false` — all with correct English values.
- [ ] `fr.json` contains the same 6 keys with correct French values.
- [ ] `xx.json` contains the same 6 keys all mapped to `"XX"`.
- [ ] All three files are valid JSON (no syntax errors).
- [ ] No existing key in any file is altered.
- [ ] `npm run test` passes (the existing `Landing.xx.test.jsx` test must not gain any new failures from these additions).

## Tests to implement

### Unit

No new test file in this task. The existing `Landing.xx.test.jsx` will exercise the new `xx.json` keys once TASK-004 and TASK-005 route translatable cell values through `t()`.

### Integration

None in this task.
