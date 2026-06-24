# TASK-001 — Add missing translation keys to all locale files

## Objective
Add the five missing translation keys to `en.json`, `fr.json`, and `xx.json` so that every translatable value currently rendered in the comparator has a corresponding entry in all supported locales.

Keys to add:
- `spokeMaterial.carbon` — label for carbon spokes
- `spokeMaterial.carbon_composite` — label for carbon composite spokes
- `spokeMaterial.steel` — label for steel spokes
- `common.notAvailable` — localized "not available" fallback label (used by the cell renderer when data value is absent)

## Required context

### Project
MyBikeLab — React frontend. Located at `C:\Users\Flavien\Google Drive\VisualStudioCode\Claude\MyBikeLab\`.

### Locale file locations
- `frontend/public/locales/en.json`
- `frontend/public/locales/fr.json`
- `frontend/public/locales/xx.json`

### Existing structure of `spokeMaterial` section in each file
`en.json` currently has:
```json
"spokeMaterial": {
  "stainless_steel": "Stainless steel",
  "aluminum": "Aluminum"
}
```
`fr.json` currently has:
```json
"spokeMaterial": {
  "stainless_steel": "Acier inox",
  "aluminum": "Aluminium"
}
```
`xx.json` currently has:
```json
"spokeMaterial": {
  "stainless_steel": "XX",
  "aluminum": "XX"
}
```

### `common` section
No `common` section exists yet in any of the three files. It must be created as a new top-level key.

### `xx` locale convention
The `xx` locale is a visual test locale. Every value is the sentinel string `"XX"`. All new keys in `xx.json` must follow this convention.

## Potentially impacted files
- `MyBikeLab/frontend/public/locales/en.json`
- `MyBikeLab/frontend/public/locales/fr.json`
- `MyBikeLab/frontend/public/locales/xx.json`

## Inputs
- Current contents of `en.json`, `fr.json`, `xx.json` (read before editing)

## Expected outputs

### `en.json` additions
Inside the existing `"spokeMaterial"` object, add:
```json
"carbon": "Carbon",
"carbon_composite": "Carbon composite",
"steel": "Steel"
```
At the top level, add a new `"common"` object:
```json
"common": {
  "notAvailable": "N/A"
}
```

### `fr.json` additions
Inside the existing `"spokeMaterial"` object, add:
```json
"carbon": "Carbone",
"carbon_composite": "Carbone composite",
"steel": "Acier"
```
At the top level, add a new `"common"` object:
```json
"common": {
  "notAvailable": "Inconnu"
}
```

### `xx.json` additions
Inside the existing `"spokeMaterial"` object, add:
```json
"carbon": "XX",
"carbon_composite": "XX",
"steel": "XX"
```
At the top level, add a new `"common"` object:
```json
"common": {
  "notAvailable": "XX"
}
```

## Constraints
- All three locale files must remain valid JSON after editing.
- The three new `spokeMaterial` entries must be added inside the existing `"spokeMaterial"` object, not as a new section.
- The `"common"` key must be a new top-level object. Placement within the file is flexible; by convention add it near the top alongside other shared/utility keys.
- The existing entries `stainless_steel` and `aluminum` in `spokeMaterial` must remain unchanged.
- No other key in any locale file may be modified.
- No wheel data file may be modified.

## Dependencies
none

## Validation criteria
- [ ] `en.json` is valid JSON (no parse errors).
- [ ] `fr.json` is valid JSON (no parse errors).
- [ ] `xx.json` is valid JSON (no parse errors).
- [ ] `en.json` contains `spokeMaterial.carbon`, `spokeMaterial.carbon_composite`, `spokeMaterial.steel`, and `common.notAvailable` — all with non-empty string values.
- [ ] `fr.json` contains `spokeMaterial.carbon`, `spokeMaterial.carbon_composite`, `spokeMaterial.steel`, and `common.notAvailable` — all with non-empty string values.
- [ ] `xx.json` contains `spokeMaterial.carbon`, `spokeMaterial.carbon_composite`, `spokeMaterial.steel`, and `common.notAvailable` — all set to `"XX"`.
- [ ] Existing entries `spokeMaterial.stainless_steel` and `spokeMaterial.aluminum` are unchanged in all three files.
- [ ] No other existing key has been removed or modified.

## Tests to implement
### Unit
- Parse each locale file as JSON and assert that the following keys exist and are non-empty strings:
  - `spokeMaterial.carbon`
  - `spokeMaterial.carbon_composite`
  - `spokeMaterial.steel`
  - `common.notAvailable`
- Assert that `spokeMaterial.stainless_steel` and `spokeMaterial.aluminum` retain their original values in `en.json` and `fr.json`.

### Integration
- None required for this task — locale file correctness is verified by the unit checks above and by manual browser verification in TASK-002's validation.
