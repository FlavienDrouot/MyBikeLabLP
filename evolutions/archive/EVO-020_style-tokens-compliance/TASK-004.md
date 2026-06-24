# TASK-004 — Fix multiselect option list: remove rounded-lg, replace border-ink-3 with border-ink-4

## Objective

On the scrollable `<ul>` option list inside `LargeMultiSelectFilter` in `FilterPanel.jsx`, remove the `rounded-lg` class and replace `border-ink-3` with `border-ink-4`, so that the option list has straight (square) corners and uses the correct border color token.

## Required context

- The file is `MyBikeLab/frontend/src/components/MiniComparator/FilterPanel.jsx`.
- The `LargeMultiSelectFilter` component renders a `<ul>` element that displays searchable options for multi-select filters with more than 10 options (Brand, Hub brand, Hub model, Spokes brand, Spokes model, Spoke material, etc.).
- The design system uses a square aesthetic — all card borders use `rounded-none`. Adding `rounded-lg` to this list container was a deviation.
- `border-ink-3` is a lighter border token; `border-ink-4` is the correct token for interactive control borders (used on all other inputs and the card `.card` component).
- The change is limited to the `<ul>` element's `className` string. No wrapping elements, no logic, no props are changed.

**Current `<ul>` line in `LargeMultiSelectFilter`:**
```jsx
<ul className="max-h-40 overflow-y-auto rounded-lg border border-ink-3">
```

**The `LargeMultiSelectFilter` component renders when a multiSelect filter has more than 10 options** (gated by `if (options.length > 10)` in `MultiSelectFilter`).

## Potentially impacted files

- `MyBikeLab/frontend/src/components/MiniComparator/FilterPanel.jsx`

## Inputs

Current `<ul>` className:
```
"max-h-40 overflow-y-auto rounded-lg border border-ink-3"
```

## Expected outputs

Updated `<ul>` className:
```
"max-h-40 overflow-y-auto rounded-none border border-ink-4"
```

Changes made:
- `rounded-lg` replaced with `rounded-none`
- `border-ink-3` replaced with `border-ink-4`
- All other classes (`max-h-40`, `overflow-y-auto`, `border`) preserved exactly.

## Constraints

- Only the `<ul>` className is modified. No other element in `FilterPanel.jsx` is changed.
- `rounded-lg` must not remain anywhere on the option list element.
- `border-ink-3` must not remain on the option list element.
- `rounded-none` (not the absence of a class) must be used explicitly to ensure no inherited border radius applies.
- No structural JSX changes — do not add wrapping elements or change the `<ul>` tag.

**UI guideline (Layout):** The design system uses one corner-radius system per page. Cards use `rounded-none`. A `rounded-lg` list inside a square card would mix radius styles without a documented rule — it must be corrected to `rounded-none`.

**UI guideline (Interactive States):** Border color on interactive controls uses the `border-ink-4` token. `border-ink-3` is a lower-contrast token reserved for structural separators.

## Dependencies

none

## Validation criteria

- [ ] The `<ul>` element in `LargeMultiSelectFilter` has the class `rounded-none` and does not have `rounded-lg` (or any other positive-radius class).
- [ ] The `<ul>` element has the class `border-ink-4` and does not have `border-ink-3`.
- [ ] In the browser, the option list has straight corners (computed `border-radius: 0px`).
- [ ] The border of the option list is visually consistent with the border color used on other inputs in the panel.
- [ ] No other `<ul>`, `<li>`, or wrapping element has been modified.
- [ ] The search-and-select functionality of `LargeMultiSelectFilter` works correctly (search input filters options, checkboxes toggle selections, selected tags appear above the search input).

## Tests to implement

### Unit
- None required (no logic change).

### Integration
- Manual: open the landing page and navigate to the filter panel.
- Open a multiSelect filter that has more than 10 options (e.g., Brand or Hub brand — requires the dataset to contain more than 10 distinct values).
- Inspect the option list container in DevTools: `border-radius` must be `0px`, border color must match `var(--ink-4)`.
- Confirm the list is still scrollable when the option count exceeds the `max-h-40` constraint.
- Confirm search input filters the list correctly.
- Confirm checkbox selections work and selected tags appear.
