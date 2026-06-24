# TASK-004 — Update `renderCellFor` to apply translation for `translatable: true` properties; update `hookless` renderCell

## Objective

Modify `renderCellFor` in `columnCells.jsx` to accept a second `t` argument and apply `t('[fieldId].[value]')` when the property is `translatable: true`. Also update the `hookless` property entry in `wheelProperties.jsx` to use a `renderCell` that calls `t('hookless.' + String(w.rim.hookless))`.

## Required context

### `columnCells.jsx` — current implementation

Located at `src/components/MiniComparator/columnCells.jsx`.

Current `renderCellFor`:
```js
export const renderCellFor = (property) =>
  property.column?.renderCell ??
  ((w) => `${property.accessor(w)}${property.unit ?? ''}`);
```

### Change to `renderCellFor`

New signature: `renderCellFor(property, t)` — `t` is the i18next translation function.

New behavior:
- If the property has a custom `renderCell` defined: call it as `property.column.renderCell(w, t)` (pass `t` as second argument so custom renderers can use it if needed).
- If no `renderCell` and `property.translatable === true`: return `(w) => t(property.id + '.' + property.accessor(w))`.
- If no `renderCell` and `property.translatable === false` (or `translatable` is absent): return `(w) => \`${property.accessor(w)}${property.unit ?? ''}\`` (unchanged default behavior).

The returned function signature remains `(w) => cell` in all cases.

### `hookless` entry in `wheelProperties.jsx` — current implementation

Located at `src/config/wheelProperties.jsx`, the `hookless` entry currently has:
```jsx
column: {
  headClassName: 'px-4 py-3 font-semibold',
  cellClassName: 'px-4 py-3',
  renderCell: (w) => <HookBadge hookless={w.rim.hookless} />,
},
```

### Change to `hookless` renderCell

Replace the `renderCell` to call `t('hookless.' + String(w.rim.hookless))`:
```js
renderCell: (w, t) => t('hookless.' + String(w.rim.hookless)),
```

This removes the `<HookBadge>` from the comparator table cell. The badge remains in the FilterPanel tri-state UI (it is not used from this entry). The `HookBadge` import in `wheelProperties.jsx` may be removed if it is no longer used elsewhere in that file.

Important: check whether `<HookBadge>` is used anywhere else in `wheelProperties.jsx` before removing the import.

### `cellClassFor` — no change

`cellClassFor` is not modified in this task.

### UI constraints (applicable to this task)

This task touches a visible surface (the comparator table cell for `rimMaterial`, `spokeMaterial`, and `hookless`). The following constraints apply:
- The translated strings (e.g. "Carbon", "Carbone", "Hookless", "Hooked") are plain text nodes inside the existing `<td>` elements. No new markup, no new CSS classes, no new interactive elements.
- The cell's `cellClassName` and layout are unchanged.
- No animation is introduced.

## Potentially impacted files

- `src/components/MiniComparator/columnCells.jsx`
- `src/config/wheelProperties.jsx`

## Inputs

- Current `src/components/MiniComparator/columnCells.jsx` (read before editing).
- Current `src/config/wheelProperties.jsx` (read before editing).
- TASK-001 must be merged (the `translatable` field must exist on WHEEL_PROPERTIES entries).
- TASK-002 must be merged (data values are normalized to lowercase snake_case, so `property.accessor(w)` returns `'carbon'` not `'Carbon'`).
- TASK-003 must be merged (locale files contain the new keys).

## Expected outputs

### `columnCells.jsx`

```js
export const renderCellFor = (property, t) => {
  if (property.column?.renderCell) {
    return (w) => property.column.renderCell(w, t);
  }
  if (property.translatable) {
    return (w) => t(property.id + '.' + property.accessor(w));
  }
  return (w) => `${property.accessor(w)}${property.unit ?? ''}`;
};
```

### `wheelProperties.jsx` — `hookless` entry `renderCell`

```js
renderCell: (w, t) => t('hookless.' + String(w.rim.hookless)),
```

The `HookBadge` import at the top of `wheelProperties.jsx` should be removed if it is no longer used after this change (verify before removing).

## Constraints

- `renderCellFor` must remain backward-compatible: if called with only one argument (legacy callers not yet updated), `t` would be `undefined`. Add a guard: if `t` is not provided and `property.translatable` is true, fall back to the raw accessor value (same as the non-translatable path). This prevents runtime errors before TASK-005 updates all callers.
  - Guard: `if (property.translatable && t) { return (w) => t(...); }`
- The `cellClassFor` function must not be changed.
- Do not modify any other property entry in `wheelProperties.jsx`.

## Dependencies

TASK-001, TASK-002, TASK-003

## Validation criteria

- [ ] `renderCellFor(property, t)(wheel)` for a `rimMaterial` property with a French `t` function returns the French translation of `rimMaterial.carbon` (or other value).
- [ ] `renderCellFor(property, t)(wheel)` for a `brand` property (translatable: false) returns the raw brand string unchanged.
- [ ] `renderCellFor(property, t)(wheel)` for `hookless` calls `t('hookless.true')` or `t('hookless.false')` based on the wheel's boolean value.
- [ ] `renderCellFor(property)(wheel)` (called without `t`) for a `translatable: false` property works unchanged (backward compatibility).
- [ ] The `HookBadge` import is removed from `wheelProperties.jsx` if it is no longer used.
- [ ] No existing `renderCell` in other property entries is broken.
- [ ] `npm run test` passes.

## Tests to implement

### Unit

No new test file in this task. Unit coverage for the translation behavior is provided by TASK-006 (XX locale test) and the existing `Landing.xx.test.jsx` (which will now see `"XX"` in `rimMaterial`, `spokeMaterial`, and `hookless` cells).

### Integration

None in this task.
