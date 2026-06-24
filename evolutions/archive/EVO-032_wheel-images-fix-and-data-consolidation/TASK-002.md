# TASK-002 — Fix `wheelProperties.jsx` image accessor and renderCell

## Objective

Update the `image` property entry in `wheelProperties.jsx` so that the comparator thumbnail column reads `images[0]` (with a fallback to the placeholder SVG when `images[]` is empty). Add a direct import of `wheelPlaceholderUrl` to `wheelProperties.jsx`. No other property entries are changed.

## Required context

### Current state of the `image` entry (before this task)

```jsx
{
  id: 'image',
  label: 'properties.image.label',
  group: 'general',
  translatable: false,
  accessor: (w) => w.image,
  column: {
    headClassName: 'px-4 py-3 font-semibold',
    cellClassName: 'px-2 py-2',
    renderCell: (w) => (
      <img src={w.image} alt={w.model} className="w-16 h-16 object-contain rounded" />
    ),
  },
},
```

The scalar `w.image` field has been removed from all data files (TASK-001). Referencing it would return `undefined` and break rendering.

### Why `??` is the correct operator

`w.images?.[0]` returns `undefined` when `images` is absent or when `images` is an empty array and index 0 does not exist. `undefined ?? wheelPlaceholderUrl` correctly falls back to the placeholder. No need for a `.length` check here because `images[0]` on an empty array already returns `undefined`.

### Import path for `wheelPlaceholderUrl`

`wheelProperties.jsx` is located at `src/config/wheelProperties.jsx`. The SVG asset is at `src/assets/wheel-placeholder.svg`. The relative import is:
```js
import wheelPlaceholderUrl from '../assets/wheel-placeholder.svg';
```

### Registry architecture reminder

`wheelProperties.jsx` is the central registry. Every UI component that renders a wheel column (`ComparisonTable`, `ColumnSelector`, etc.) reads from this registry. Updating the `image` entry here is sufficient — no other file needs to be changed for the comparator thumbnail fix.

### UI constraints (applicable to this task)

This task modifies the `image` column cell, which renders an `<img>` element inside the comparator table.

**Empty state**: when `images[]` is empty, the cell must render the placeholder SVG — never a blank space or broken image icon. The fallback `wheelPlaceholderUrl` guarantees this.

**Interactive states**: the `<img>` element is not interactive. No hover, focus, or disabled states apply.

**Existing CSS classes** on the `<img>` element (`w-16 h-16 object-contain rounded`) must be preserved unchanged.

## Potentially impacted files

- `MyBikeLab/frontend/src/config/wheelProperties.jsx`

## Inputs

- Current content of `wheelProperties.jsx` (read before editing).
- `wheelPlaceholderUrl` SVG asset at `src/assets/wheel-placeholder.svg` (path confirmed in TASK-001 context).

## Expected outputs

1. A new import line added near the top of `wheelProperties.jsx`:
   ```js
   import wheelPlaceholderUrl from '../assets/wheel-placeholder.svg';
   ```

2. The `image` property entry updated as follows:
   ```jsx
   {
     id: 'image',
     label: 'properties.image.label',
     group: 'general',
     translatable: false,
     accessor: (w) => w.images?.[0] ?? wheelPlaceholderUrl,
     column: {
       headClassName: 'px-4 py-3 font-semibold',
       cellClassName: 'px-2 py-2',
       renderCell: (w) => (
         <img
           src={w.images?.[0] ?? wheelPlaceholderUrl}
           alt={w.model}
           className="w-16 h-16 object-contain rounded"
         />
       ),
     },
   },
   ```

No other property entry in `WHEEL_PROPERTIES` is modified.

## Constraints

- Only the `image` property entry is updated. No other entry in `WHEEL_PROPERTIES` is modified.
- The existing CSS classes (`w-16 h-16 object-contain rounded`) on the `<img>` element are preserved.
- The `alt` attribute remains `{w.model}`.
- The `wheelPlaceholderUrl` import must be a direct SVG asset import, not a re-export from a data file.
- Do not remove or modify any other import in `wheelProperties.jsx`.
- The `accessor` and the `renderCell` expression must be consistent: both derive the image URL using `w.images?.[0] ?? wheelPlaceholderUrl`.

## Dependencies

TASK-001

## Validation criteria

- [ ] `wheelProperties.jsx` imports `wheelPlaceholderUrl` from `'../assets/wheel-placeholder.svg'`
- [ ] The `image` property `accessor` is `(w) => w.images?.[0] ?? wheelPlaceholderUrl`
- [ ] The `image` property `renderCell` uses `w.images?.[0] ?? wheelPlaceholderUrl` as the `src`
- [ ] The `<img>` element retains `className="w-16 h-16 object-contain rounded"` and `alt={w.model}`
- [ ] No other property entry in `WHEEL_PROPERTIES` has been modified
- [ ] Manual: comparator thumbnail column shows a real image for a wheel with `images: ['https://...']`
- [ ] Manual: comparator thumbnail column shows the placeholder SVG for a wheel with `images: []`

## Tests to implement

### Unit

- Code review: confirm `accessor` expression matches `w.images?.[0] ?? wheelPlaceholderUrl`.
- Code review: confirm `renderCell` `src` matches `w.images?.[0] ?? wheelPlaceholderUrl`.

### Integration

- Load the comparator in the browser (or a local dev server). Verify:
  - A wheel with `images: ['https://cdn.mavic.com/...']` (e.g. Mavic COSMIC SLR 45 DISC 23mm, id=3) shows the real product image in the thumbnail column.
  - A wheel with `images: []` (e.g. Mavic COSMIC ULTIMATE 45 DISC 23mm, id=1) shows the placeholder SVG in the thumbnail column.
  - All other property columns (weight, price, rim depth, etc.) render correctly — no regressions.
