# Spec Notes — EVO-033

## PRD Interpretations

### Translation key structure for new properties

The PRD specifies translation keys for property labels and enumerated values but does not prescribe the exact key path. The existing pattern uses:
- `properties.<propertyId>.label` for the column/filter label
- `<propertyId>.<value>` for translatable enum values (as in `rimMaterial.carbon`, `spokeMaterial.stainless_steel`, `hookless.true`)

This convention is followed for all 9 new properties. `brakeType`, `tubelessReady`, and `wheelsetCategory` receive `translatable: true` and their enum values are registered under top-level namespace keys matching their property id.

### `tubelessReady` translatable flag

`tubeless_ready` is a boolean in the data. The `triState` filter already handles boolean matching natively (via `filter.value === null | true | false`). However, the column cell should display a translated string ("Tubeless" / "Not tubeless") rather than `true`/`false`. This requires `translatable: true` and translation keys `tubelessReady.true` / `tubelessReady.false`. The existing `columnCells.jsx` `renderCellFor` function handles this via `t(property.id + '.' + property.accessor(w))` when `translatable === true` — no custom `renderCell` is needed.

### `freehubOptions` column rendering

`freehub_options` is an array of strings. The default `renderCellFor` in `columnCells.jsx` calls `property.accessor(w)` and appends `property.unit`. For an array value, `String(['HG', 'XDR'])` produces `"HG,XDR"` which is readable but not ideal. A custom `renderCell` that joins with ` / ` is specified to make the column readable. This is a display concern only and does not affect filtering.

### `internalWidth` and `maxSystemWeight` column alignment

Both are numeric values with units. The existing pattern for numeric columns uses `text-right tabular-nums`. These properties follow that pattern.

### `wheelsetCategory` sort

The PRD does not request sort options for `wheelsetCategory`. No `sorts` spec is added — it is filter-only (matching `brakeType`, `discStandard`, etc.).

### `internalWidth` sort

UC-004 in the PRD explicitly requires sort ascending/descending for `internalWidth`. Two sort entries (`internalWidth_asc`, `internalWidth_desc`) are added.

### `maxSystemWeight` sort

The PRD does not request sort options for `maxSystemWeight`. No sort is added.

### `freehubOptions` is not `translatable`

Freehub option values like `'HG'`, `'XDR'`, `'N3W'`, `'Microspline'`, `'Campagnolo N3W'` are proper nouns / brand standards. They should not be translated. `translatable: false`.

### `axleFront` and `axleRear` are not `translatable`

Axle standards (`'12x100'`, `'9x130'`, etc.) are technical strings, not enumerated UI labels. `translatable: false`.

### `discStandard` is not `translatable`

`'Center Lock'` and `'6-Bolt'` are product standard names. `translatable: false`.

### `internalWidth` and `maxSystemWeight` are not `translatable`

These are numeric values. `translatable: false`.

### Group assignment for new properties

All 9 new properties belong to the `general` group. This is consistent with `brake_type` and `wheelset_category` being top-level ride characteristics (not rim geometry and not subcomponents). It is also where filtering is most expected by the user (the `general` group is the only one open by default in the filter panel).

### `multiSelectFlat` initial filter state

`filtersSlice.js` `buildInitialFilters` has a `switch` statement over `property.filter.type`. A new `case 'multiSelectFlat'` must be added returning `[]` (empty array, same as `multiSelect`). Without this case, the filter will fall through to `default: value = null`, which is incorrect for a multi-select style filter.

### `makeSelectOptionsFor` null filtering

The current implementation: `[...new Set(items.map(property.accessor))].sort()`. For `multiSelectFlat` properties, `property.accessor(w)` returns an array (or `undefined`). Spreading all values into a Set would produce array references, not individual strings. The function must branch on filter type: if `multiSelectFlat`, flatten all arrays, filter nullish values, then deduplicate.

For non-`multiSelectFlat` properties, the existing logic must also filter out `null` and `undefined` before deduplication — the current implementation does not do this (a `null` slot would appear as the string `"null"` after `new Set`). This is a pre-existing gap that should be fixed in TASK-002 to prevent null options from appearing for the new properties (which have partial data). The fix is backward-compatible.

### `makeSelectContextualCountsFor` for `multiSelectFlat`

The current implementation counts by `String(property.accessor(wheel))`. For array-valued properties this would produce `"HG,XDR,N3W"` as a single key. Instead, for `multiSelectFlat`, each element of the array must be counted individually.

### `MultiSelectFilter` displays translated labels or raw values

`MultiSelectFilter` (and `LargeMultiSelectFilter`) currently renders `String(opt)` for each option. For `translatable: true` properties (like `brakeType`), the display should be `t(propertyId + '.' + opt)` rather than the raw value string. This is a pre-existing gap for other translatable multiSelect properties (e.g. `rimMaterial` options render raw values today). To keep the scope contained, this translation of option labels within `MultiSelectFilter` is handled in TASK-004 alongside registering `multiSelectFlat` in the adapter. The change must also apply to existing `translatable: true` + `multiSelect` properties (`rimMaterial`, `spokeMaterial`) to maintain consistency, but must not break non-translatable ones.

### `xx.json` freehub values

`freehubOptions` is `translatable: false` — its values (`HG`, `XDR`, etc.) do not appear in any locale file and do not need `"XX"` entries. Only enum values of `translatable: true` properties receive entries in `xx.json`.

### ENVE `disc_standard` — all 6 wheels affected

All 6 ENVE wheel entries in `wheelsData_enve.js` (SES 2.3, SES 3.4, SES 4.5, SES 4.5 Pro, SES 6.7, AR40) carry `disc_standard: 'Centerlock'`. All 6 must be corrected to `'Center Lock'`.

### `wheelset_category` distinct values in the dataset

From scanning all data files, the distinct values present are: `all-round`, `aero`, `climbing`, `endurance`, `all-road`. No `track` value is present (track wheels lack `wheelset_category`). Translation keys are added for all five.

### `brakeType` filter labels for `triState`-style display

`brakeType` uses `multiSelect` (not `triState`). Its values (`disc`, `rim`, `track`) are rendered by `MultiSelectFilter` using the translation keys `brakeType.disc`, `brakeType.rim`, `brakeType.track` once TASK-004 translates option labels.

---

## Architecture Decision Rationale

### AD-001 — `multiSelectFlat` as a new filter type (not a flag on `multiSelect`)

Making it a separate type (`multiSelectFlat`) rather than a boolean flag on `multiSelect` (e.g. `{ type: 'multiSelect', flat: true }`) keeps the branching explicit in every location that switches on filter type: `matchers`, `buildInitialFilters`, `makeSelectOptionsFor`, `makeSelectContextualCountsFor`, and the `FILTER_ADAPTERS` map. A flag would require updating every switch to also check the flag, obscuring the dispatch logic.

### AD-002 — `multiSelectFlat` renders via `MultiSelectFilter` with no new component

The PRD mandates this. The adapter map entry is `multiSelectFlat: MultiSelectFilter`, identical to `multiSelect: MultiSelectFilter`. `MultiSelectFilter` already auto-upgrades to `LargeMultiSelectFilter` when `options.length > 10`. This covers `freehubOptions` naturally since its option list will be long.

### AD-003 — New properties placed in `general` group

Placement in `general` is consistent with how other "bike characteristics" (diameter, brand) are grouped, and ensures the new filters appear in the expanded (default-open) accordion section. Placing them in `rims` or `subs` would require the user to expand those sections to see the new filters.

### AD-004 — Null filtering in `makeSelectOptionsFor`

Filtering out nullish values before deduplication is applied to all properties, not just the new ones. This prevents `undefined` or `null` from appearing as selectable filter options for any partially-populated property.

---

## Tradeoffs

### `freehubOptions` column cell: join vs. custom badge

Option considered: render each freehub value as a pill badge. Rejected — introduces UI complexity not required by the PRD; the join approach (`HG / XDR / N3W`) is readable and consistent with how multi-valued specs are typically shown in a table cell. Badge rendering would also require changes in `columnCells.jsx` beyond what is needed.

### Translating filter option labels: in `MultiSelectFilter` vs. in `makeSelectOptionsFor`

Option considered: store pre-translated labels in the options array (in the selector). Rejected — the selector has no access to `t()` (React hook context). Translation must happen at render time in the component. The cleanest approach is to pass `property.translatable` and `property.id` into the option rendering function so it can call `t(propertyId + '.' + opt)` when appropriate.

---

## Open Questions

None — all design decisions resolved during analysis. The following items are pre-implementation reminders:

1. Confirm the full set of `freehub_options` string values across all brands (Mavic, Zipp, ENVE, Roval) before writing translation guidance. Currently observed from ENVE data: `'HG'`, `'XDR'`, `'N3W'`, `'Microspline'`. These are brand standard names and are not translated.

2. The Roval data file includes at least one wheel without `max_system_weight_kg` (Roval Rapide CLX II). This is expected and handled by null-pass logic.

3. The ENVE SES 3.4, SES 4.5, SES 6.7, and AR40 do not have `wheelset_category`. Track wheels (Mavic IO, COMETE TRACK, ELLIPSE) also have no `wheelset_category`. These are valid null values — they will not appear in the filter option list and will pass all filters.
