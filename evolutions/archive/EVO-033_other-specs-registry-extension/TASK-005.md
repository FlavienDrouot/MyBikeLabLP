# TASK-005 — Register 9 new `other_specs` properties in `wheelProperties.jsx`

## Objective

Add 9 new property entries to the `WHEEL_PROPERTIES` array in `wheelProperties.jsx`. Each entry defines an accessor reading from `other_specs`, a filter specification, and a column specification.

## Required context

### File to modify

`frontend/src/config/wheelProperties.jsx`

### Registry conventions (from the existing codebase)

- `id`: unique string — used as Redux filter key, column id, and i18n base key
- `label`: translation key in the form `properties.<id>.label`
- `group`: `'general'` | `'rims'` | `'subs'` — all 9 new properties use `'general'`
- `translatable`: `true` if the property's value must be translated before display (via `t(property.id + '.' + value)`)
- `accessor`: always a function — uses optional chaining for nested fields
- `unit`: string suffix appended by the default cell renderer (e.g. `' mm'`, `' kg'`)
- `filter.type`: `'multiSelect'` | `'triState'` | `'range'` | `'multiSelectFlat'` (new — requires TASK-002)
- `column.defaultVisible`: `false` hides the column by default (user must enable it); omitting this field or `true` means visible by default
- `column.hidden`: `true` means permanently hidden (no column, no column selector entry) — not used for the new properties
- `sorts`: optional array of sort descriptors — only added where the PRD requires sorting

### `FilterSpec` typedef update

The `FilterSpec` typedef comment at the top of the file must be extended to include the new type:

```js
* @typedef {{type: 'range', step?: number}
*         | {type: 'multiSelect'}
*         | {type: 'multiSelectFlat'}
*         | {type: 'triState', labels: [string, string, string]}} FilterSpec
```

### Column cell rendering

- For `translatable: true` properties with no custom `renderCell`, the existing `renderCellFor` in `columnCells.jsx` handles translation automatically via `t(property.id + '.' + property.accessor(w))`. No `renderCell` override is needed for `brakeType`, `tubelessReady`, or `wheelsetCategory`.
- For `freehubOptions`, the accessor returns an array. A custom `renderCell` is required to produce a readable string: join the array elements with `' / '`. If the value is absent, render `null`.
- Numeric properties (`internalWidth`, `maxSystemWeight`) follow the existing right-aligned tabular-nums pattern.

## Expected outputs

Add the following 9 entries to `WHEEL_PROPERTIES`, after the existing `price` entry (end of the `general` group, before `diameter`). This placement groups them with other general characteristics.

---

### 1. `brakeType`

```js
{
  id: 'brakeType',
  label: 'properties.brakeType.label',
  group: 'general',
  translatable: true,
  accessor: (w) => w.other_specs?.brake_type,
  filter: { type: 'multiSelect' },
  column: {
    headClassName: 'px-4 py-3 font-semibold',
    cellClassName: 'px-4 py-3 text-ink-11',
  },
},
```

Column visible by default (no `defaultVisible: false`).

---

### 2. `tubelessReady`

```js
{
  id: 'tubelessReady',
  label: 'properties.tubelessReady.label',
  group: 'general',
  translatable: true,
  accessor: (w) => w.other_specs?.tubeless_ready,
  filter: {
    type: 'triState',
    labels: [
      'filters.tubelessReady.all',
      'filters.tubelessReady.true',
      'filters.tubelessReady.false',
    ],
  },
  column: {
    defaultVisible: false,
    headClassName: 'px-4 py-3 font-semibold',
    cellClassName: 'px-4 py-3 text-ink-11',
  },
},
```

---

### 3. `internalWidth`

```js
{
  id: 'internalWidth',
  label: 'properties.internalWidth.label',
  group: 'general',
  translatable: false,
  unit: ' mm',
  accessor: (w) => w.other_specs?.internal_width_mm,
  filter: { type: 'range' },
  sorts: [
    { id: 'internalWidth_asc', label: 'sorts.internalWidth_asc', direction: 'asc' },
    { id: 'internalWidth_desc', label: 'sorts.internalWidth_desc', direction: 'desc' },
  ],
  column: {
    defaultVisible: false,
    headClassName: 'px-4 py-3 font-semibold text-right',
    cellClassName: 'px-4 py-3 text-ink-11 text-right tabular-nums',
  },
},
```

---

### 4. `axleFront`

```js
{
  id: 'axleFront',
  label: 'properties.axleFront.label',
  group: 'general',
  translatable: false,
  accessor: (w) => w.other_specs?.axle_front_mm,
  filter: { type: 'multiSelect' },
  column: {
    defaultVisible: false,
    headClassName: 'px-4 py-3 font-semibold',
    cellClassName: 'px-4 py-3 text-ink-11',
  },
},
```

---

### 5. `axleRear`

```js
{
  id: 'axleRear',
  label: 'properties.axleRear.label',
  group: 'general',
  translatable: false,
  accessor: (w) => w.other_specs?.axle_rear_mm,
  filter: { type: 'multiSelect' },
  column: {
    defaultVisible: false,
    headClassName: 'px-4 py-3 font-semibold',
    cellClassName: 'px-4 py-3 text-ink-11',
  },
},
```

---

### 6. `freehubOptions`

```js
{
  id: 'freehubOptions',
  label: 'properties.freehubOptions.label',
  group: 'general',
  translatable: false,
  accessor: (w) => w.other_specs?.freehub_options,
  filter: { type: 'multiSelectFlat' },
  column: {
    defaultVisible: false,
    headClassName: 'px-4 py-3 font-semibold',
    cellClassName: 'px-4 py-3 text-ink-11',
    renderCell: (w) => {
      const arr = w.other_specs?.freehub_options;
      return Array.isArray(arr) && arr.length > 0 ? arr.join(' / ') : null;
    },
  },
},
```

---

### 7. `maxSystemWeight`

```js
{
  id: 'maxSystemWeight',
  label: 'properties.maxSystemWeight.label',
  group: 'general',
  translatable: false,
  unit: ' kg',
  accessor: (w) => w.other_specs?.max_system_weight_kg,
  filter: { type: 'range' },
  column: {
    defaultVisible: false,
    headClassName: 'px-4 py-3 font-semibold text-right',
    cellClassName: 'px-4 py-3 text-ink-11 text-right tabular-nums',
  },
},
```

---

### 8. `wheelsetCategory`

```js
{
  id: 'wheelsetCategory',
  label: 'properties.wheelsetCategory.label',
  group: 'general',
  translatable: true,
  accessor: (w) => w.other_specs?.wheelset_category,
  filter: { type: 'multiSelect' },
  column: {
    headClassName: 'px-4 py-3 font-semibold',
    cellClassName: 'px-4 py-3 text-ink-11',
  },
},
```

Column visible by default (no `defaultVisible: false`).

---

### 9. `discStandard`

```js
{
  id: 'discStandard',
  label: 'properties.discStandard.label',
  group: 'general',
  translatable: false,
  accessor: (w) => w.other_specs?.disc_standard,
  filter: { type: 'multiSelect' },
  column: {
    defaultVisible: false,
    headClassName: 'px-4 py-3 font-semibold',
    cellClassName: 'px-4 py-3 text-ink-11',
  },
},
```

---

### `FilterSpec` typedef update

Update the `@typedef` comment block at the top of the file:

```js
* @typedef {{type: 'range', step?: number}
*         | {type: 'multiSelect'}
*         | {type: 'multiSelectFlat'}
*         | {type: 'triState', labels: [string, string, string]}} FilterSpec
```

## Constraints

- All accessors must use optional chaining (`?.`) on `other_specs` to handle wheels where the field or sub-field is absent.
- `brakeType` and `wheelsetCategory` must NOT have `defaultVisible: false` — they are visible by default.
- The 7 other new properties MUST have `defaultVisible: false`.
- `freehubOptions` must use `filter: { type: 'multiSelectFlat' }` — not `multiSelect`.
- `tubelessReady` must use `filter: { type: 'triState', labels: [...] }` — not `multiSelect`.
- `internalWidth` must declare two sort entries (`internalWidth_asc`, `internalWidth_desc`).
- Do not add sorts to any other new property.
- All 9 entries must have an explicit `translatable` boolean field (required by the existing `wheelProperties.i18n.test.js` test).
- Do not modify any existing `WHEEL_PROPERTIES` entry.

## Dependencies

TASK-002 (the selector must recognize `multiSelectFlat` before the registry declares a property using it)

## Validation criteria

- [ ] `WHEEL_PROPERTIES` contains exactly 9 new entries with the ids: `brakeType`, `tubelessReady`, `internalWidth`, `axleFront`, `axleRear`, `freehubOptions`, `maxSystemWeight`, `wheelsetCategory`, `discStandard`
- [ ] Each new entry has an explicit boolean `translatable` field
- [ ] `brakeType` and `wheelsetCategory` have no `defaultVisible: false` (visible by default)
- [ ] All other 7 new entries have `column.defaultVisible: false`
- [ ] `freehubOptions` has `filter: { type: 'multiSelectFlat' }`
- [ ] `tubelessReady` has `filter: { type: 'triState', labels: ['filters.tubelessReady.all', 'filters.tubelessReady.true', 'filters.tubelessReady.false'] }`
- [ ] `internalWidth` has `sorts` with two entries (`internalWidth_asc`, `internalWidth_desc`)
- [ ] `freehubOptions.column.renderCell` returns a joined string for array values and `null` for absent/empty values
- [ ] The `FilterSpec` typedef comment is updated to include `multiSelectFlat`
- [ ] The existing `wheelProperties.i18n.test.js` test passes (every property has an explicit `translatable` boolean)
- [ ] Loading the comparator shows `brakeType` and `wheelsetCategory` columns by default; all other 7 new columns are absent until activated

## Tests to implement

### Unit

The existing `frontend/src/config/__tests__/wheelProperties.i18n.test.js` tests will exercise the new entries automatically (they iterate over all `WHEEL_PROPERTIES`). No new test file is needed for this task.

### Integration

Manual: load the comparator and confirm:
- Filter panel shows 9 new filter controls under the `general` group (General specs section)
- `brakeType` and `wheelsetCategory` columns visible by default in the comparison table
- Column selector shows the 7 other new properties as toggleable options
- Sorting by `internalWidth` ascending/descending produces correct ordering
