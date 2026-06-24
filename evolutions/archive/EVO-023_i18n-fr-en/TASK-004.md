# TASK-004 — Replace label strings in `wheelProperties.jsx` with translation keys

## Objective

Replace every human-readable English string in `src/config/wheelProperties.jsx` with the corresponding translation key string. After this task, the registry contains opaque key identifiers that consuming components resolve using `t()`. No visual change occurs from this task alone — components that consume these labels are updated in TASK-007 and TASK-008.

## Required context

- **File**: `src/config/wheelProperties.jsx`
- **This file is not a React component.** It exports plain objects and functions. It must not import hooks or `useTranslation`. Label fields become opaque translation key strings.
- **Convention**: keys follow the dot-notation pattern `'properties.<propertyId>.label'` for property labels, `'properties.groups.<groupId>'` for group labels, `'sorts.<sortId>'` for sort option labels, and `'filters.hookless.<value>'` for triState labels.
- **The JSDoc `@typedef` comment for `WheelProperty.label`** must be updated to reflect that the field now holds a translation key, not a display string.
- **No other logic changes**: accessors, filter specs, column specs, sort direction — all unchanged. Only string values in `label` and `labels` fields change.

## Potentially impacted files

- `src/config/wheelProperties.jsx`

## Inputs

Current state of `wheelProperties.jsx` (relevant string fields only):

**`COLUMN_GROUPS` labels** (currently human-readable, become keys):
```js
{ id: 'general', label: 'General specs' }   →  { id: 'general', label: 'properties.groups.general' }
{ id: 'rims',    label: 'Rims' }            →  { id: 'rims',    label: 'properties.groups.rims' }
{ id: 'subs',    label: 'Subcomponents' }   →  { id: 'subs',    label: 'properties.groups.subs' }
```

**Property `label` fields** (all 17 properties):
```
'Image'          →  'properties.image.label'
'Model'          →  'properties.model.label'
'Brand'          →  'properties.brand.label'
'Weight'         →  'properties.weight.label'
'Price'          →  'properties.price.label'
'Diameter'       →  'properties.diameter.label'
'Rim material'   →  'properties.rimMaterial.label'
'Hookless'       →  'properties.hookless.label'
'Depth'          →  'properties.depth.label'
'Rim width'      →  'properties.rimWidth.label'
'Hub'            →  'properties.hub.label'
'Hub brand'      →  'properties.hubBrand.label'
'Hub model'      →  'properties.hubModel.label'
'Spokes'         →  'properties.spokes.label'
'Spokes brand'   →  'properties.spokesBrand.label'
'Spokes model'   →  'properties.spokesModel.label'
'Spoke material' →  'properties.spokeMaterial.label'
```

**Sort option `label` fields** (9 sort options across 5 properties):
```
'Name (A → Z)'              →  'sorts.name'
'Weight (light → heavy)'    →  'sorts.weight_asc'
'Weight (heavy → light)'    →  'sorts.weight_desc'
'Price (low → high)'        →  'sorts.price_asc'
'Price (high → low)'        →  'sorts.price_desc'
'Depth (shallow → deep)'    →  'sorts.depth_asc'
'Depth (deep → shallow)'    →  'sorts.depth_desc'
'Rim width (narrow → wide)' →  'sorts.rimWidth_asc'
'Rim width (wide → narrow)' →  'sorts.rimWidth_desc'
```

**TriState `filter.labels` array** (hookless property only):
```js
filter: { type: 'triState', labels: ['All', 'Hookless', 'Hooked'] }
→
filter: { type: 'triState', labels: ['filters.hookless.all', 'filters.hookless.hookless', 'filters.hookless.hooked'] }
```

## Expected outputs

`src/config/wheelProperties.jsx` with the following changes applied:

1. JSDoc `@typedef WheelProperty` — update the `label` comment:
   ```js
   * @property {string} label  Translation key for display label (filter + column + sort).
   ```
   Similarly for `SortSpec.label`:
   ```js
   * @typedef {{id: string, label: string, direction: 'asc' | 'desc' | 'localeCompare', accessor?: (w:any)=>any}} SortSpec
   ```
   Add a comment clarifying `label` is a translation key in `SortSpec` as well:
   ```js
   // label: translation key resolved by consuming components via t()
   ```

2. `COLUMN_GROUPS` array — replace label strings with keys (as listed in Inputs above)

3. All 17 property `label` fields — replace with key strings (as listed in Inputs above)

4. All 9 sort option `label` fields — replace with key strings (as listed in Inputs above)

5. TriState `filter.labels` array for `hookless` — replace with key strings (as listed in Inputs above)

**No other change to this file.** Do not touch accessors, units, filter types, sort directions, column specs, renderCell functions, or helper functions.

## Constraints

- Do not import anything new into `wheelProperties.jsx`
- Do not add React hooks or `useTranslation` to this file
- The key strings must match exactly the keys defined in `en.json` and `fr.json` (TASK-002 and TASK-003)
- The `filter.labels` array for triState must have exactly 3 elements in the same order: `[all, hookless, hooked]`
- The `required` column property on `model` must remain unchanged — do not touch column specs
- `COLUMN_GROUPS` group IDs (`'general'`, `'rims'`, `'subs'`) must remain unchanged — only the `label` field changes
- No property IDs change — only label strings change

## Dependencies

TASK-002

## Validation criteria

- [ ] Every `label` field on every property in `WHEEL_PROPERTIES` is now a translation key string starting with `'properties.'`
- [ ] Every `label` field on every sort option starts with `'sorts.'`
- [ ] The `hookless` property's `filter.labels` array contains `['filters.hookless.all', 'filters.hookless.hookless', 'filters.hookless.hooked']`
- [ ] `COLUMN_GROUPS` labels are `'properties.groups.general'`, `'properties.groups.rims'`, `'properties.groups.subs'`
- [ ] No other logic in the file has changed (accessors, units, filter specs, sort directions, column specs are identical to pre-task state)
- [ ] `npm run build` passes after this change (even without TASK-007/008, since components still use the old label access pattern — the build will not fail, but the UI will display key strings until TASK-007/008 are applied)
- [ ] The JSDoc comment for `WheelProperty.label` reflects that it is now a translation key

## Tests to implement

### Unit
- None for this task in isolation

### Integration
- After TASK-007 and TASK-008 are applied: verify property labels, sort labels, column group labels, and triState labels all display in both English and French correctly
