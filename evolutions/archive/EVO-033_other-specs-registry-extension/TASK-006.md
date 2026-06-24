# TASK-006 — Add translation keys for 9 new properties in `en.json`, `fr.json`, and `xx.json`

## Objective

Add all required i18n keys for the 9 new wheel properties to the three locale files. Keys cover: property labels (all 9), tri-state filter labels (`tubelessReady`), and enum value translations (`brakeType`, `tubelessReady`, `wheelsetCategory`).

## Required context

### Files to modify

- `frontend/public/locales/en.json`
- `frontend/public/locales/fr.json`
- `frontend/public/locales/xx.json`

### Key conventions (from existing codebase)

- Property label: `properties.<propertyId>.label` — used in filter panel header, column header, sort dropdown
- Tri-state filter label: `filters.<propertyId>.all|true|false` — displayed as the three pill options
- Enum value translation: `<propertyId>.<rawValue>` — used by `renderCellFor` (column cell) and by `MultiSelectFilter` option rendering (after TASK-004)

### Properties that are `translatable: true` (require enum keys)

- `brakeType` — raw values present in data: `disc`, `rim`, `track`
- `tubelessReady` — raw values: boolean `true` / `false`, translated as `tubelessReady.true` / `tubelessReady.false`
- `wheelsetCategory` — raw values present in data: `all-round`, `aero`, `climbing`, `endurance`, `all-road`

### Properties that are `translatable: false` (label only, no enum keys)

- `internalWidth`, `axleFront`, `axleRear`, `freehubOptions`, `maxSystemWeight`, `discStandard`

### `xx.json` rule

Every new translatable string in `xx.json` must resolve to the string `"XX"`. No exceptions.

### Sort labels

`internalWidth` declares two sort options (`internalWidth_asc`, `internalWidth_desc`). Their translation keys must be added to the `sorts` object.

## Expected outputs

### `en.json` additions

**Under `properties` object** — add alongside existing entries:

```json
"brakeType": { "label": "Brake type" },
"tubelessReady": { "label": "Tubeless ready" },
"internalWidth": { "label": "Internal width" },
"axleFront": { "label": "Front axle" },
"axleRear": { "label": "Rear axle" },
"freehubOptions": { "label": "Freehub" },
"maxSystemWeight": { "label": "Max system weight" },
"wheelsetCategory": { "label": "Category" },
"discStandard": { "label": "Disc standard" }
```

**Under `sorts` object** — add alongside existing entries:

```json
"internalWidth_asc": "Internal width (narrow → wide)",
"internalWidth_desc": "Internal width (wide → narrow)"
```

**Under `filters` object** — add alongside existing `hookless` entry:

```json
"tubelessReady": {
  "all": "All",
  "true": "Tubeless",
  "false": "Not tubeless"
}
```

**New top-level objects** — add at the same level as `rimMaterial`, `spokeMaterial`, `hookless`:

```json
"brakeType": {
  "disc": "Disc",
  "rim": "Rim",
  "track": "Track"
},
"tubelessReady": {
  "true": "Tubeless",
  "false": "Not tubeless"
},
"wheelsetCategory": {
  "all-round": "All-round",
  "aero": "Aero",
  "climbing": "Climbing",
  "endurance": "Endurance",
  "all-road": "All-road"
}
```

---

### `fr.json` additions

**Under `properties` object**:

```json
"brakeType": { "label": "Type de frein" },
"tubelessReady": { "label": "Tubeless" },
"internalWidth": { "label": "Largeur interne" },
"axleFront": { "label": "Axe avant" },
"axleRear": { "label": "Axe arrière" },
"freehubOptions": { "label": "Corps de roue libre" },
"maxSystemWeight": { "label": "Poids système max" },
"wheelsetCategory": { "label": "Catégorie" },
"discStandard": { "label": "Standard disque" }
```

**Under `sorts` object**:

```json
"internalWidth_asc": "Largeur interne (étroite → large)",
"internalWidth_desc": "Largeur interne (large → étroite)"
```

**Under `filters` object**:

```json
"tubelessReady": {
  "all": "Tous",
  "true": "Tubeless",
  "false": "Non tubeless"
}
```

**New top-level objects**:

```json
"brakeType": {
  "disc": "Disque",
  "rim": "Patins",
  "track": "Piste"
},
"tubelessReady": {
  "true": "Tubeless",
  "false": "Non tubeless"
},
"wheelsetCategory": {
  "all-round": "Polyvalent",
  "aero": "Aéro",
  "climbing": "Grimpeur",
  "endurance": "Endurance",
  "all-road": "All-road"
}
```

---

### `xx.json` additions

**Under `properties` object**:

```json
"brakeType": { "label": "XX" },
"tubelessReady": { "label": "XX" },
"internalWidth": { "label": "XX" },
"axleFront": { "label": "XX" },
"axleRear": { "label": "XX" },
"freehubOptions": { "label": "XX" },
"maxSystemWeight": { "label": "XX" },
"wheelsetCategory": { "label": "XX" },
"discStandard": { "label": "XX" }
```

**Under `sorts` object**:

```json
"internalWidth_asc": "XX",
"internalWidth_desc": "XX"
```

**Under `filters` object**:

```json
"tubelessReady": {
  "all": "XX",
  "true": "XX",
  "false": "XX"
}
```

**New top-level objects**:

```json
"brakeType": {
  "disc": "XX",
  "rim": "XX",
  "track": "XX"
},
"tubelessReady": {
  "true": "XX",
  "false": "XX"
},
"wheelsetCategory": {
  "all-round": "XX",
  "aero": "XX",
  "climbing": "XX",
  "endurance": "XX",
  "all-road": "XX"
}
```

---

## Constraints

- Do not modify or remove any existing key in any locale file.
- The `tubelessReady` top-level object uses string keys `"true"` and `"false"` (not booleans) — i18next resolves these via `t('tubelessReady.' + String(value))` where `value` is the boolean from the data.
- The `filters.tubelessReady` object provides labels for the three `TriStateFilter` pills (All / Tubeless / Not tubeless). These are separate from the `tubelessReady.true/false` enum keys used in column cell rendering.
- `freehubOptions` is `translatable: false` — its raw values (`HG`, `XDR`, `N3W`, `Microspline`, etc.) are brand standard names and are NOT translated. No enum keys for `freehubOptions` in any locale file.
- `discStandard`, `axleFront`, `axleRear` are `translatable: false` — no enum keys needed.
- All JSON files must remain valid JSON after editing.

## Dependencies

TASK-005 (the property ids and enum namespaces are derived from the registry entries)

## Validation criteria

- [ ] All 9 property labels are present in `en.json`, `fr.json`, and `xx.json` under `properties.<id>.label`
- [ ] `internalWidth_asc` and `internalWidth_desc` are present in the `sorts` object of all three locale files
- [ ] `filters.tubelessReady.all`, `filters.tubelessReady.true`, `filters.tubelessReady.false` are present in all three locale files
- [ ] Top-level `brakeType`, `tubelessReady`, `wheelsetCategory` objects with all enum values are present in all three locale files
- [ ] All values in `xx.json` for new keys resolve to the string `"XX"`
- [ ] No existing key is modified or removed in any locale file
- [ ] All three locale files are valid JSON
- [ ] Switching to the `xx` locale in the UI shows `"XX"` for all new property labels, filter labels, and enum values — no raw key fallback

## Tests to implement

### Unit

The existing `wheelProperties.i18n.test.js` test suite (under `frontend/src/config/__tests__/`) has a section covering the `xx` locale. Verify it passes after adding the keys — if it iterates `WHEEL_PROPERTIES` and checks that every `translatable: true` property has corresponding `xx.json` entries, the new entries must satisfy it.

### Integration

Manual: load the comparator in each of the three locales (EN, FR, XX) and confirm:
- All 9 new property labels display correctly in the filter panel and column headers
- `brakeType` filter pills show `disc`/`rim`/`track` translated in each locale
- `wheelsetCategory` filter pills show translated category names in each locale
- `tubelessReady` triState pills show the correct translated labels in each locale
- `internalWidth` sort options appear in the sort dropdown with translated labels
- No raw translation key (e.g. `properties.brakeType.label`) is visible anywhere in the UI
