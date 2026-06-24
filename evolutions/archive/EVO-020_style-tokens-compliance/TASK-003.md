# TASK-003 — Replace 4x opacity-50 with opacity-40 in FilterPanel.jsx disabled states

## Objective

Replace all four occurrences of `opacity-50` that govern the visual appearance of disabled filter control containers in `FilterPanel.jsx` with `opacity-40`, to comply with the UI guideline that disabled controls render at 40% opacity.

## Required context

- The file is `MyBikeLab/frontend/src/components/MiniComparator/FilterPanel.jsx`.
- There are exactly four occurrences of `opacity-50` used as disabled-state styling. Each is inside a conditional class expression of the form `enabled ? '' : 'opacity-50 ...'` or `enabled ? '' : 'opacity-50'`.
- The `opacity-40` Tailwind utility must already exist in the compiled output before this change is applied (see TASK-002).
- The change is a pure class-name substitution. No logic, no props, no component structure is altered.
- `pointer-events-none` appears alongside `opacity-50` in three of the four occurrences. It must be preserved exactly as-is — do not add or remove it.

**The four occurrences (pre-change line numbers are approximate and may shift if TASK-002 is applied first — use the surrounding context to locate them):**

1. **`DualRangeRow` component** — the wrapper `<div>` around the range inputs and slider:
   ```jsx
   <div className={`space-y-3 ${enabled ? '' : 'opacity-50'}`}>
   ```
   Change to:
   ```jsx
   <div className={`space-y-3 ${enabled ? '' : 'opacity-40'}`}>
   ```
   Note: this occurrence does NOT have `pointer-events-none` — do not add it.

2. **`LargeMultiSelectFilter` component** — the wrapper `<div>` around the search input and option list:
   ```jsx
   <div className={filter.enabled ? '' : 'opacity-50 pointer-events-none'}>
   ```
   Change to:
   ```jsx
   <div className={filter.enabled ? '' : 'opacity-40 pointer-events-none'}>
   ```

3. **`MultiSelectFilter` component** — the wrapper `<div>` around the pill buttons:
   ```jsx
   className={`flex flex-wrap gap-1.5 ${
     filter.enabled ? '' : 'opacity-50 pointer-events-none'
   }`}
   ```
   Change to:
   ```jsx
   className={`flex flex-wrap gap-1.5 ${
     filter.enabled ? '' : 'opacity-40 pointer-events-none'
   }`}
   ```

4. **`TriStateFilter` component** — the wrapper `<div>` around the tri-state pill buttons:
   ```jsx
   <div className={`flex flex-wrap gap-1.5 ${filter.enabled ? '' : 'opacity-50 pointer-events-none'}`}>
   ```
   Change to:
   ```jsx
   <div className={`flex flex-wrap gap-1.5 ${filter.enabled ? '' : 'opacity-40 pointer-events-none'}`}>
   ```

## Potentially impacted files

- `MyBikeLab/frontend/src/components/MiniComparator/FilterPanel.jsx`

## Inputs

Four string occurrences to replace:
- `'opacity-50'` (in `DualRangeRow`) → `'opacity-40'`
- `'opacity-50 pointer-events-none'` (in `LargeMultiSelectFilter`, `MultiSelectFilter`, `TriStateFilter`) → `'opacity-40 pointer-events-none'`

## Expected outputs

- Zero occurrences of `opacity-50` remain in `FilterPanel.jsx`.
- Four occurrences of `opacity-40` exist in the disabled-state conditional expressions, in the four components listed above.
- All occurrences of `pointer-events-none` that existed before the change remain in place.
- No other lines in `FilterPanel.jsx` are modified.

## Constraints

- Only the four `opacity-50` → `opacity-40` substitutions are made. No other code is changed.
- `pointer-events-none` must not be added to `DualRangeRow` (it was absent before and is out of scope for this evolution).
- This task requires `opacity-40` to be present in the Tailwind JIT output (TASK-002 must be completed first).

**UI guideline (Interactive States / Disabled):** Disabled controls must render at `opacity: 0.4` (`opacity-40`). The value `opacity-50` does not comply.

## Dependencies

TASK-002

## Validation criteria

- [ ] `opacity-50` does not appear anywhere in `FilterPanel.jsx`.
- [ ] `opacity-40` appears in exactly four places in `FilterPanel.jsx`, each inside a disabled-state conditional class expression.
- [ ] `pointer-events-none` is present in the same three locations where it existed before (LargeMultiSelectFilter, MultiSelectFilter, TriStateFilter).
- [ ] `pointer-events-none` is absent from the DualRangeRow location (unchanged).
- [ ] Toggling a filter off in the UI renders the control at 40% opacity (visually dimmer than before).
- [ ] Toggling a filter on restores full opacity.
- [ ] All filter types (range, multiSelect with ≤10 options, multiSelect with >10 options / LargeMultiSelect, triState) continue to function correctly when enabled.

## Tests to implement

### Unit
- None required (no logic change).

### Integration
- Manual: open the landing page, navigate to the MiniComparator filter panel.
- Disable a range filter (e.g., Weight): confirm the slider and input area renders at clearly lower opacity than before.
- Disable a multiSelect filter (e.g., Diameter): confirm the pill row renders at lower opacity.
- Disable a triState filter (e.g., Tubeless): confirm the pill row renders at lower opacity.
- Re-enable each: confirm full opacity is restored and the filter works.
- Confirm no visual regression on enabled controls (they must remain at full opacity).
