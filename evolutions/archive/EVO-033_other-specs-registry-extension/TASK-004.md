# TASK-004 — Register `multiSelectFlat` in `FilterPanel.jsx` and add translated option labels

## Objective

Two related changes to `FilterPanel.jsx`:
1. Register `multiSelectFlat` in the `FILTER_ADAPTERS` map, mapping it to the existing `MultiSelectFilter` component.
2. Update `MultiSelectFilter` (and its internal `LargeMultiSelectFilter` delegate) to render translated option labels when `property.translatable === true`.

## Required context

### File to modify

`frontend/src/components/MiniComparator/FilterPanel.jsx`

### Existing `FILTER_ADAPTERS` map

```js
const FILTER_ADAPTERS = {
  range: RangeFilter,
  multiSelect: MultiSelectFilter,
  triState: TriStateFilter,
};
```

### Existing option rendering in `MultiSelectFilter`

```jsx
{options.map((opt) => {
  const count = counts[String(opt)] ?? 0;
  const isActive = filter.value.includes(opt);
  return (
    <Pill
      key={String(opt)}
      active={isActive}
      muted={count === 0 && !isActive}
      onClick={() => toggle(opt)}
    >
      {String(opt)} ({count})
    </Pill>
  );
})}
```

The display label is currently `String(opt)`. For `translatable: true` properties, it must be `t(property.id + '.' + opt)`.

### Existing option rendering in `LargeMultiSelectFilter`

```jsx
{visible.map((opt) => {
  const count = counts[String(opt)] ?? 0;
  const isActive = filter.value.includes(opt);
  const isMuted = count === 0 && !isActive;
  return (
    <li key={String(opt)}>
      <label className={...}>
        <input type="checkbox" ... />
        {String(opt)} ({count})
      </label>
    </li>
  );
})}
```

Same issue — `String(opt)` must become `t(property.id + '.' + opt)` when `property.translatable === true`.

Also in `LargeMultiSelectFilter`, the selected-value pills (shown above the search box) render `String(v)` — this must also be translated when `property.translatable === true`.

### Translation key convention

For translatable properties, the value translation key is `propertyId.value`. Examples:
- `brakeType.disc` → "Disc" (en) / "Frein à disque" (fr) / "XX" (xx)
- `wheelsetCategory.aero` → "Aero" (en) / "Aéro" (fr) / "XX" (xx)

### UI guidelines applicable to this task

- **Disabled state**: the existing `opacity-40 pointer-events-none` pattern on the filter container when `filter.enabled === false` must be preserved unchanged.
- No new animation or transition is introduced.
- No new UI component is introduced.
- Option labels must not wrap to multiple lines inside a pill — if a translated label is long, the pill already handles this via `px-3 py-1 text-xs` sizing; do not change the pill layout.

## Expected outputs

### 1. Add `multiSelectFlat` to `FILTER_ADAPTERS`

```js
const FILTER_ADAPTERS = {
  range: RangeFilter,
  multiSelect: MultiSelectFilter,
  multiSelectFlat: MultiSelectFilter,
  triState: TriStateFilter,
};
```

### 2. Update `MultiSelectFilter` option label rendering

Replace `{String(opt)} ({count})` with a helper that calls `t()` when translatable:

```jsx
const optLabel = property.translatable ? t(`${property.id}.${opt}`) : String(opt);
```

Then render `{optLabel} ({count})` in the `Pill`. The `key` and `isActive` comparison must still use `String(opt)` (raw value), not the translated label.

### 3. Update `LargeMultiSelectFilter` option label rendering

Apply the same `optLabel` computation to both:
- The selected-value pill display (the `filter.value.map((v) => ...)` block above the search box)
- The option list items in the scrollable `<ul>`

For the selected-value pills, the `key` and the `onClick` argument must still use the raw value `v`, not the translated label.

## Constraints

- `key` props and `filter.value` array entries must always use the raw (untranslated) value — the Redux state stores raw values.
- `filter.value.includes(opt)` comparisons must use the raw value.
- The `t()` call must only happen when `property.translatable === true` — fallback to `String(opt)` when `false`.
- Do not modify `RangeFilter`, `TriStateFilter`, `FilterToggle`, `DualRangeRow`, `Section`, or `Pill` components.
- Do not modify `COLUMN_GROUPS`, `FilterPanel`, or any import that is not needed by these changes.
- The `MultiSelectFilter` already auto-delegates to `LargeMultiSelectFilter` when `options.length > 10` — this logic must remain unchanged.

## Dependencies

TASK-002, TASK-003

## Validation criteria

- [ ] `FILTER_ADAPTERS` contains `multiSelectFlat: MultiSelectFilter`
- [ ] A `multiSelectFlat` filter field (e.g. `freehubOptions`) renders via `MultiSelectFilter` without errors
- [ ] `brakeType` filter options display "Disc", "Rim", "Track" (in English) rather than the raw values `disc`, `rim`, `track`
- [ ] `wheelsetCategory` filter options display translated labels (e.g. "All-round", "Aero") rather than raw values
- [ ] Non-translatable properties (`brand`, `diameter`, `axleFront`, etc.) still render raw option values unchanged
- [ ] `rimMaterial` and `spokeMaterial` option labels are now translated (pre-existing translatable multiSelect properties)
- [ ] Selecting a translated option correctly adds the raw value to `filter.value` (Redux state stores `'disc'` not `'Disc'`)
- [ ] Selected-value pills in `LargeMultiSelectFilter` display translated labels
- [ ] The search box in `LargeMultiSelectFilter` still filters by raw value (not translated label) — acceptable behavior since the raw values are short codes like `HG`, `XDR`

## Tests to implement

### Unit

None.

### Integration

Manual: load the comparator in English and French. Confirm:
- `brakeType` filter pills show "Disc" / "Rim" / "Track" (EN) and their French equivalents (FR)
- `wheelsetCategory` filter pills show translated category names in both languages
- `freehubOptions` filter renders as a large scrollable multi-select (options > 10 expected once all brands are loaded)
- All 13 pre-existing filters render correctly and their options are unchanged
