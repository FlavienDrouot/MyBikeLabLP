# TASK-002 — Patch cell renderer to handle missing data values

## Objective
Modify the translatable-property branch of `renderCellFor` in `columnCells.jsx` so that when the data value for a translatable property is absent (null, undefined, or empty string), the cell displays the localized "not available" label (`t('common.notAvailable')`) instead of attempting to build and resolve a key from the absent value.

## Required context

### Project
MyBikeLab — React frontend. Located at `C:\Users\Flavien\Google Drive\VisualStudioCode\Claude\MyBikeLab\`.

### File to modify
`frontend/src/components/MiniComparator/columnCells.jsx`

### Current implementation
```js
// columnCells.jsx (full current content)

export const renderCellFor = (property, t) => {
  const safeT = t ?? ((key) => key);
  if (property.column?.renderCell) {
    return (w) => property.column.renderCell(w, safeT);
  }
  if (property.translatable && t) {
    return (w) => t(property.id + '.' + property.accessor(w));
  }
  return (w) => `${property.accessor(w)}${property.unit ?? ''}`;
};

export const cellClassFor = (property) => {
  const base = property.column?.cellClassName ?? `px-4 py-3 text-ink-11`;
  return property.unit !== undefined ? `${base} font-mono tabular-nums` : base;
};
```

### What needs to change
The translatable branch (lines 12-14) currently calls `t(property.id + '.' + property.accessor(w))` unconditionally. When `property.accessor(w)` returns `null`, `undefined`, or `""`, this produces keys like `tubelessReady.undefined` or `wheelsetCategory.` which i18next cannot resolve and returns as-is (raw key).

The fix: evaluate the raw value first, and if it is absent (`null`, `undefined`, or `""`), return `t('common.notAvailable')` instead.

### Definition of "absent"
A value `v` is absent when: `v == null || v === ''`
- `v == null` covers both `null` and `undefined` (loose equality).
- `v === ''` covers empty string (strict equality, does not accidentally match `0` or `false`).

### `common.notAvailable` key
This key is added to all locale files in TASK-001. At the time this task is implemented, TASK-001 must already be merged (or both tasks merged together), otherwise the rendered fallback will itself be a raw key.

### Properties that go through this code path
All properties with `translatable: true` in `wheelProperties.jsx`:
- `brakeType` (accessor: `w.brake_type`)
- `tubelessReady` (accessor: `w.rim?.tubeless_ready`)
- `wheelsetCategory` (accessor: `w.wheelset_category`)
- `rimMaterial` (accessor: `w.rim.material`)
- `hookless` (accessor: `w.rim.hookless`) — note: `hookless` has a custom `renderCell`, so it bypasses the translatable branch
- `spokeMaterial` (accessor: `w.spokes.material`)

Of these, `hookless` exits through the `property.column?.renderCell` branch and is unaffected by this change.

### What must not change
- The `property.column?.renderCell` branch (first `if`) is untouched.
- The non-translatable branch (last `return`) is untouched.
- The `safeT` fallback for callers without `t` is untouched.
- `cellClassFor` is untouched.

## Potentially impacted files
- `MyBikeLab/frontend/src/components/MiniComparator/columnCells.jsx` (only file to change)

## Inputs
- Current content of `columnCells.jsx` (read before editing)
- `common.notAvailable` key present in all locale files (TASK-001)

## Expected outputs

### Modified `renderCellFor` function
The translatable branch must be updated as follows:

```js
if (property.translatable && t) {
  return (w) => {
    const value = property.accessor(w);
    if (value == null || value === '') return t('common.notAvailable');
    return t(property.id + '.' + value);
  };
}
```

The full file after the change:

```js
// Shared cell rendering helpers for the comparison table and its hidden
// measuring twin (MeasuringTable). Both must render identical cell content and
// classes so the measured column widths match what the visible table displays.

export const renderCellFor = (property, t) => {
  // Safe fallback for legacy callers that have not yet been updated to pass t
  // (TASK-005 will update them). Returns the translation key as-is rather than
  // crashing when t is undefined.
  const safeT = t ?? ((key) => key);
  if (property.column?.renderCell) {
    return (w) => property.column.renderCell(w, safeT);
  }
  if (property.translatable && t) {
    return (w) => {
      const value = property.accessor(w);
      if (value == null || value === '') return t('common.notAvailable');
      return t(property.id + '.' + value);
    };
  }
  return (w) => `${property.accessor(w)}${property.unit ?? ''}`;
};

export const cellClassFor = (property) => {
  const base = property.column?.cellClassName ?? `px-4 py-3 text-ink-11`;
  return property.unit !== undefined ? `${base} font-mono tabular-nums` : base;
};
```

## Constraints
- The change must be confined to the translatable branch of `renderCellFor`. No other branch is modified.
- The value check must use `value == null || value === ''` exactly — do not use `!value` (which would treat `false` and `0` as absent, incorrectly flagging `hookless: false` if it ever reaches this path).
- `cellClassFor` must remain unchanged.
- No wheel data file may be modified.
- No change to `wheelProperties.jsx`.

## Dependencies
TASK-001 (the `common.notAvailable` key must exist in locale files before or at the same time as this code change is deployed, otherwise the fallback branch returns a raw key)

## Validation criteria
- [ ] When `tubelessReady` is `null` or `undefined` for a wheel, the cell displays "N/A" (en), "Inconnu" (fr), or "XX" (xx) — not `tubelessReady.undefined` or any raw key.
- [ ] When `wheelsetCategory` is `null` or `undefined`, the cell displays the localized "not available" label.
- [ ] When `spokeMaterial` is `carbon`, the cell displays "Carbon" (en), "Carbone" (fr), or "XX" (xx) — not `spokeMaterial.carbon`.
- [ ] When `spokeMaterial` is `carbon_composite`, the cell displays "Carbon composite" (en), "Carbone composite" (fr), or "XX" (xx).
- [ ] When `spokeMaterial` is `steel`, the cell displays "Steel" (en), "Acier" (fr), or "XX" (xx).
- [ ] Wheels with `spokeMaterial` of `stainless_steel` or `aluminum` continue to display exactly the same label as before in all locales.
- [ ] Switching locale mid-session causes all affected cells to re-render with the correct label for the new locale.
- [ ] No cell in the comparator displays a string matching the pattern `<propertyId>.<value>` or `<propertyId>.undefined` across all locales and all wheels in the active dataset.
- [ ] Non-translatable properties (weight, price, depth, etc.) are unaffected.

## Tests to implement
### Unit
- Unit test for `renderCellFor` with a mock `t` function:
  - Given `property = { translatable: true, id: 'tubelessReady', accessor: () => null }`, assert return value equals `t('common.notAvailable')`.
  - Given `property = { translatable: true, id: 'tubelessReady', accessor: () => undefined }`, assert return value equals `t('common.notAvailable')`.
  - Given `property = { translatable: true, id: 'tubelessReady', accessor: () => '' }`, assert return value equals `t('common.notAvailable')`.
  - Given `property = { translatable: true, id: 'spokeMaterial', accessor: () => 'carbon' }`, assert return value equals `t('spokeMaterial.carbon')`.
  - Given `property = { translatable: true, id: 'hookless', accessor: () => false }`, confirm `false` does NOT trigger the notAvailable fallback (value is not absent).
  - Given `property = { translatable: false, id: 'weight', accessor: () => 1500, unit: ' g' }`, assert return value equals `'1500 g'` (non-translatable branch unchanged).

### Integration
- None required beyond the manual validation checks listed above.
