# Technical Specifications

## 1. General Information

- Evolution ID: EVO-001
- PRD reference: `prd.md`
- Author: Flavien Drouot
- Date: 2026-05-24

---

## 2. Technical Context

### Technical objective

Extend the wheel comparator so that (1) range filter sliders derive their bounds directly from the dataset, and (2) multi-select and yes/no filter options display contextual counts — the number of wheels that would remain if that option were added to the currently active filters on all other axes.

### Affected architecture

- Property registry (`wheelProperties.jsx`) — range specs lose their static `min`/`max` values
- Filter slice (`filtersSlice.js`) — range initialisation derives bounds from the dataset
- Wheels selectors (`wheelsSelectors.js`) — two new parameterised selectors added
- Filter components (`FilterPanel.jsx`) — `RangeFilter`, `MultiSelectFilter`, `LargeMultiSelectFilter`, `TriStateFilter` updated

### Impacted modules

- `frontend/src/config/wheelProperties.jsx`
- `frontend/src/store/slices/filtersSlice.js`
- `frontend/src/store/selectors/wheelsSelectors.js`
- `frontend/src/components/MiniComparator/FilterPanel.jsx`
- `frontend/vite.config.js` + `frontend/package.json` (Vitest setup — TASK-001)
- New: `frontend/src/__mocks__/fileMock.js`
- New: `frontend/src/store/selectors/__tests__/wheelsSelectors.test.js`

---

## 3. Technical Constraints

- All computation is client-side and synchronous (static dataset)
- `wheelsData.js` structure is not modified
- `DualRangeRow` external signature (`min`, `max`, `valueLow`, `valueHigh`) is preserved
- Zero-count options must remain visible and clickable — no `disabled` attribute, no `pointer-events-none`
- The `All` option in `TriStateFilter` must not display a count
- Mobile layout must not regress after count badges are added to pills and list items
- `Math.min(...values)` / `Math.max(...values)` spread is safe at the current dataset size (~15 items)

---

## 4. Architecture Decisions

### AD-001 — Dataset-derived range bounds; slice bootstrapped from `wheelsData` at load time

#### Description

Remove `min`/`max` from range filter specs in `wheelProperties.jsx`. In `filtersSlice.js`, import `wheelsData` (the same pattern already used by `wheelsSlice.js`) and compute initial range state `{ min: datasetMin, max: datasetMax }` at module load. Add `makeSelectRangeBoundsFor(propertyId)` in `wheelsSelectors.js` so `RangeFilter` reads the slider track limits reactively from Redux state.

#### Motivation

The PRD requires bounds to update automatically when a wheel is added — with no code change beyond `wheelsData.js`. Static constants in `wheelProperties.jsx` block this. `wheelsSlice.js` already imports `wheelsData` for bootstrapping state from the static dataset; applying the same pattern to `filtersSlice.js` is consistent.

#### Rejected alternatives

- **Null sentinel `{ min: null, max: null }`** — requires null guards in `rangeMath.js`, `DualRangeRow`, and the range matcher for no gain given the static dataset.
- **Derive bounds in the registry via a factory** — couples the config layer to the data layer; breaks the registry's role as a pure declarative spec.

---

### AD-002 — Contextual counts via `makeSelectContextualCountsFor` parameterised selector factory

#### Description

Add `makeSelectContextualCountsFor(propertyId)` in `wheelsSelectors.js`. It reuses the existing `matchers` map, applies all active filters except the requested property's own filter, and returns `Record<string, number>` mapping stringified option values to wheel counts. Each filter component creates its own memoised instance via `useMemo`, mirroring the existing `makeSelectOptionsFor` pattern.

#### Motivation

Keeps count logic in the selector layer (independently testable) rather than inside component event handlers. The parameterised factory ensures recomputation only when `state.wheels.items` or `state.filters` changes, not on every render.

#### Rejected alternatives

- **Count computed inside each filter component** — duplicates the filter traversal logic from `wheelsSelectors.js`; not unit-testable in isolation.
- **Single selector returning all counts for all axes** — harder to memoize per-axis; recomputes everything on any filter change.

---

### AD-003 — Muted styling via `muted` prop on `Pill`; opacity-based de-emphasis

#### Description

Add a `muted` prop to the `Pill` component. When `muted` is `true`, apply `opacity-40` Tailwind class. For `LargeMultiSelectFilter` checkboxes, apply `text-ink-400` conditionally on the `<label>`. Muting is only applied when the option is not active.

#### Motivation

Opacity-based de-emphasis preserves the click target, tab stop, and ARIA semantics. The PRD explicitly forbids disabling or hiding zero-count options.

#### Rejected alternatives

- **`pointer-events-none`** — prevents the user from selecting a zero-count option, which the PRD disallows.
- **`disabled` attribute** — disables the element; violates FR-005.

---

## 5. Task Breakdown

---

# TASK-001 — Vitest test infrastructure

## Objective

Install and configure Vitest so that unit tests for selectors and pure functions can be run with `npm test`.

## Required context

- Project uses Vite 8 + React 19 + ESM modules (`"type": "module"` in `package.json`)
- `wheelsData.js` contains `import wheelPlaceholderUrl from '../assets/wheel-placeholder.svg'` — this must be resolved to a stub in the test environment to avoid a module-not-found error
- No test runner is currently configured; `package.json` has no `test` script

## Potentially impacted files

- `frontend/package.json`
- `frontend/vite.config.js`
- New: `frontend/src/__mocks__/fileMock.js`

## Inputs

- Existing `package.json`, `vite.config.js`

## Expected outputs

- `vitest` added to `devDependencies` in `package.json`
- `package.json` gains `"test": "vitest run"` in `scripts`
- `vite.config.js` extended with a `test` block:
  ```js
  test: {
    environment: 'node',
    globals: true,
    moduleNameMapper: { '\\.(svg|png|jpg|jpeg|gif)$': '<rootDir>/src/__mocks__/fileMock.js' },
  }
  ```
- `src/__mocks__/fileMock.js` exports an empty string as its default export

## Constraints

- Test environment is `node` (no DOM needed for selector unit tests)
- Must not break `dev`, `build`, or `lint` scripts

## Dependencies

None.

## Validation criteria

- [ ] `npm test` exits with code 0 on an empty test suite
- [ ] A trivial `expect(1 + 1).toBe(2)` test in any `.test.js` file passes

## Tests to implement

### Unit
- Smoke test confirming the Vitest runner executes successfully

---

# TASK-002 — Dynamic range bounds

## Objective

Remove static `min`/`max` from range filter specs in the property registry; compute initial range state from the dataset in the filter slice; expose `makeSelectRangeBoundsFor(propertyId)`; update `RangeFilter` to use the dynamic bounds.

## Required context

**Current flow for range filters:**
1. `wheelProperties.jsx` declares `filter: { type: 'range', min: 700, max: 2000, step: 10 }` (hardcoded)
2. `filtersSlice.js` reads `property.filter.min` / `property.filter.max` to build initial state `{ min: 700, max: 2000 }`
3. `RangeFilter` destructures `const { min, max, step } = property.filter` and passes them to `DualRangeRow`
4. `DualRangeRow` uses `min` and `max` as hard limits for both the slider track and the numeric inputs

**After this task:**
1. Registry has `filter: { type: 'range', step: 10 }` (no `min`/`max`)
2. `filtersSlice.js` imports `wheelsData` and computes actual dataset bounds for range properties at module load
3. `makeSelectRangeBoundsFor('weight')` returns `{ min, max }` derived from `state.wheels.items`
4. `RangeFilter` creates a memoised selector instance and passes `bounds.min`/`bounds.max` to `DualRangeRow`

`wheelsSlice.js` already imports `wheelsData` using the exact same pattern — this is the established precedent.

Range properties and their accessors (for reference):
- `weight` → `(w) => w.weight_grams`
- `price` → `minPrice(w)` = `Math.min(...w.prices.map(p => p.price_eur))`
- `depth` → `(w) => w.rim.depth_mm`
- `rimWidth` → `(w) => w.rim.externalWidth_mm`

## Potentially impacted files

- `frontend/src/config/wheelProperties.jsx`
- `frontend/src/store/slices/filtersSlice.js`
- `frontend/src/store/selectors/wheelsSelectors.js`
- `frontend/src/components/MiniComparator/FilterPanel.jsx`
- `frontend/src/store/selectors/__tests__/wheelsSelectors.test.js` (new)

## Inputs

- `wheelsData`: ~15 wheel objects, each with numeric fields for all four range properties
- `property.accessor`: already available via `getFilterableProperties()` in the slice

## Expected outputs

**`wheelProperties.jsx`:**
- `FilterSpec` typedef updated: `{type: 'range', step?: number}` (remove `min: number, max: number`)
- All four range properties lose `min` and `max` from their `filter` object; `step` retained where it exists

**`filtersSlice.js`:**
```js
import { wheelsData } from '../../data/wheelsData';

// In buildInitialFilters, range case:
case 'range': {
  const values = wheelsData
    .map((w) => property.accessor(w))
    .filter(Number.isFinite);
  value = {
    min: values.length ? Math.min(...values) : 0,
    max: values.length ? Math.max(...values) : 0,
  };
  break;
}
```

**`wheelsSelectors.js`:**
```js
export const makeSelectRangeBoundsFor = (propertyId) =>
  createSelector(
    [(state) => state.wheels.items],
    (items) => {
      const property = getPropertyById(propertyId);
      if (!property) return { min: 0, max: 0 };
      const values = items.map(property.accessor).filter(Number.isFinite);
      return {
        min: values.length ? Math.min(...values) : 0,
        max: values.length ? Math.max(...values) : 0,
      };
    }
  );
```

**`FilterPanel.jsx` — `RangeFilter`:**
```jsx
const RangeFilter = ({ property, filter }) => {
  const dispatch = useDispatch();
  const { step } = property.filter;
  const selectBounds = useMemo(() => makeSelectRangeBoundsFor(property.id), [property.id]);
  const bounds = useSelector(selectBounds);
  const value = filter.value;
  return (
    <DualRangeRow
      label={property.label}
      unit={property.unit ?? ''}
      min={bounds.min}
      max={bounds.max}
      step={step}
      valueLow={value.min}
      valueHigh={value.max}
      onChangeLow={(v) => dispatch(setFilterValue({ id: property.id, value: { min: v, max: value.max } }))}
      onChangeHigh={(v) => dispatch(setFilterValue({ id: property.id, value: { min: value.min, max: v } }))}
      enabled={filter.enabled}
      onToggleEnabled={(v) => dispatch(setFilterEnabled({ id: property.id, enabled: v }))}
    />
  );
};
```

**`FilterPanel.jsx` — `DualRangeRow`:**
- The `pct` helper currently computes `((v - min) / (max - min)) * 100`. Add a division-by-zero guard:
  ```js
  const pct = (v) => (max === min ? 0 : ((v - min) / (max - min)) * 100);
  ```

## Constraints

- `step` is absent from `depth` and `rimWidth` in the current registry — keep it absent
- `wheelsData.js` is not modified
- `DualRangeRow` external interface unchanged

## Dependencies

TASK-001 (Vitest required for unit tests).

## Validation criteria

- [ ] Range sliders for weight, price, depth, rimWidth display bounds matching actual dataset min/max (verify in browser)
- [ ] Adding a wheel with an extreme value to `wheelsData.js` and reloading adjusts the slider without any other code change (AC-002)
- [ ] `resetFilters` button restores slider handles to full dataset bounds
- [ ] Single-wheel dataset: slider renders without NaN positions (pct guard)
- [ ] Empty dataset: slider renders at 0/0 without runtime error

## Tests to implement

### Unit (`wheelsSelectors.test.js`)

```
makeSelectRangeBoundsFor('weight')
  - returns { min: lowestWeight, max: highestWeight } across the mock dataset
  - returns { min: 0, max: 0 } when state.wheels.items is empty
  - returns { min: x, max: x } when all wheels share the same weight value
```

---

# TASK-003 — Contextual count selector

## Objective

Add `makeSelectContextualCountsFor(propertyId)` in `wheelsSelectors.js`. It filters the full dataset using all active filters except the target property's own filter, then counts how many wheels carry each option value.

## Required context

The existing `matchers` object in `wheelsSelectors.js` (module-level const, accessible to the new selector):
```js
const matchers = {
  range:       (value, filter) => value >= filter.value.min && value <= filter.value.max,
  multiSelect: (value, filter) => filter.value.length === 0 || filter.value.includes(value),
  triState:    (value, filter) => filter.value === null || value === filter.value,
};
```

Algorithm for `makeSelectContextualCountsFor(propertyId)`:
1. Get `otherFilterables` = all filterable properties where `p.id !== propertyId`
2. Filter `items` by applying each other property's filter (if enabled and known) using `matchers`
3. For each surviving wheel, call `getPropertyById(propertyId).accessor(wheel)`, stringify the result, increment a counter
4. Return the counter object

TriState accessor (`hookless`) returns a boolean → `String(true) === 'true'`, `String(false) === 'false'`.

## Potentially impacted files

- `frontend/src/store/selectors/wheelsSelectors.js`
- `frontend/src/store/selectors/__tests__/wheelsSelectors.test.js`

## Inputs

- `state.wheels.items`: array of wheel objects
- `state.filters`: Redux filter state from `filtersSlice`
- `propertyId`: string matching a filterable property ID

## Expected outputs

```js
export const makeSelectContextualCountsFor = (propertyId) =>
  createSelector(
    [(state) => state.wheels.items, (state) => state.filters],
    (items, filtersState) => {
      const property = getPropertyById(propertyId);
      if (!property) return {};

      const otherFilterables = getFilterableProperties().filter((p) => p.id !== propertyId);

      const filteredItems = items.filter((wheel) =>
        otherFilterables.every((p) => {
          const f = filtersState.filters[p.id];
          if (!f || !f.enabled) return true;
          const matcher = matchers[p.filter.type];
          if (!matcher) return true;
          return matcher(p.accessor(wheel), f);
        })
      );

      const counts = {};
      for (const wheel of filteredItems) {
        const key = String(property.accessor(wheel));
        counts[key] = (counts[key] ?? 0) + 1;
      }
      return counts;
    }
  );
```

## Constraints

- Reuses `matchers` directly — no duplication
- Does not modify `selectFilteredWheels`
- A disabled filter (`enabled: false`) passes all wheels, consistent with `selectFilteredWheels`
- Boolean TriState values intentionally stringify as `'true'` / `'false'`

## Dependencies

TASK-001 (Vitest required for unit tests).

## Validation criteria

- [ ] With no active filters: counts equal total occurrences of each option value in the full dataset
- [ ] With `brand = ['Roval']` active: rim material counts reflect only Roval wheels
- [ ] Counts for the `brand` property are computed as if the brand filter were inactive (own-axis exclusion)
- [ ] Counts update when any active filter changes (selector invalidates on `state.filters` change)
- [ ] Empty dataset → returns `{}`
- [ ] Unknown `propertyId` → returns `{}`

## Tests to implement

### Unit (`wheelsSelectors.test.js`)

```
makeSelectContextualCountsFor('brand')
  - no active filters → counts equal total occurrences of each brand value in the mock dataset
  - with brand = ['Roval'] active → own-axis exclusion: counts still reflect all brands

makeSelectContextualCountsFor('rimMaterial')
  - with brand = ['Roval'] active → only Roval wheels counted → correct rim material distribution
  - changing the brand filter invalidates the memoised result

makeSelectContextualCountsFor('hookless')
  - returns counts keyed by 'true' and 'false'
  - sum of counts['true'] + counts['false'] equals the total number of filtered wheels

makeSelectContextualCountsFor('unknownId')
  - returns {}
```

---

# TASK-004 — Display counts in MultiSelectFilter and LargeMultiSelectFilter

## Objective

Render contextual counts next to each option in both multi-select filter renderers; apply muted styling when the count is 0 and the option is not currently selected.

## Required context

**Current `MultiSelectFilter` pill rendering (line ~353 of `FilterPanel.jsx`):**
```jsx
{options.map((opt) => (
  <Pill key={String(opt)} active={filter.value.includes(opt)} onClick={() => toggle(opt)}>
    {String(opt)}
  </Pill>
))}
```

**Current `LargeMultiSelectFilter` list item rendering (line ~296):**
```jsx
<label className="flex items-center gap-2 px-3 py-1.5 hover:bg-ink-100/60 cursor-pointer text-sm text-ink-700">
  <input type="checkbox" checked={filter.value.includes(opt)} onChange={() => toggle(opt)} className="..." />
  {String(opt)}
</label>
```

**Current `Pill` component (line ~186):**
```jsx
const Pill = ({ active, onClick, children }) => ( ... );
```

The selected chips rendered at the top of `LargeMultiSelectFilter` (for active selections) do not need count badges — only the list items in the scrollable list do.

## Potentially impacted files

- `frontend/src/components/MiniComparator/FilterPanel.jsx`

## Inputs

- `makeSelectContextualCountsFor` from `wheelsSelectors.js` (TASK-003)
- Existing `options` array from `makeSelectOptionsFor`
- Existing `filter.value` (active selections array)

## Expected outputs

**`Pill` component gains `muted` prop:**
```jsx
const Pill = ({ active, muted, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors
      ${active
        ? 'bg-brand-600 text-white border-brand-600'
        : 'bg-white text-ink-700 border-ink-300 hover:border-brand-600 hover:text-brand-600'
      }
      ${muted ? 'opacity-40' : ''}`}
  >
    {children}
  </button>
);
```

**`MultiSelectFilter` additions:**
```jsx
const selectCounts = useMemo(() => makeSelectContextualCountsFor(property.id), [property.id]);
const counts = useSelector(selectCounts);

// In render, replacing the existing options.map:
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

**`LargeMultiSelectFilter` additions:**
```jsx
const selectCounts = useMemo(() => makeSelectContextualCountsFor(property.id), [property.id]);
const counts = useSelector(selectCounts);

// In the scrollable list, replacing the existing visible.map label:
{visible.map((opt) => {
  const count = counts[String(opt)] ?? 0;
  const isActive = filter.value.includes(opt);
  const isMuted = count === 0 && !isActive;
  return (
    <li key={String(opt)}>
      <label className={`flex items-center gap-2 px-3 py-1.5 hover:bg-ink-100/60 cursor-pointer text-sm ${isMuted ? 'text-ink-400' : 'text-ink-700'}`}>
        <input
          type="checkbox"
          checked={isActive}
          onChange={() => toggle(opt)}
          className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
        />
        {String(opt)} ({count})
      </label>
    </li>
  );
})}
```

## Constraints

- Active (selected) options never receive muted styling regardless of their count
- The search field in `LargeMultiSelectFilter` filters which options are displayed but does not affect count computation — `counts` is computed from all options, not just `visible`
- Count badge format is always `{label} ({N})`, including when N = 0

## Dependencies

TASK-003 (`makeSelectContextualCountsFor`).

## Validation criteria

- [ ] With no active filters: every multi-select option displays a positive count equal to the number of wheels carrying that value (AC-003)
- [ ] Selecting Brand = Roval causes rim material counts to update immediately and reflect only Roval wheels (AC-005, AC-007)
- [ ] An option with count 0 displays `(0)` and appears with reduced opacity (Pill) or grey text (large variant) (AC-008)
- [ ] A zero-count option is still clickable and selectable (AC-008)
- [ ] Active options never appear muted even if their contextual count would be 0
- [ ] Pill wrapping on mobile (375 px viewport) does not overflow its container

## Tests to implement

### Unit
- Covered by TASK-003 (selector layer is tested independently)

### Integration
- Manual verification against AC-003, AC-005, AC-007, AC-008

---

# TASK-005 — Display counts in TriStateFilter

## Objective

Add contextual counts to the `Hookless` (true) and `Hooked` (false) pills in `TriStateFilter`; the `All` pill remains unchanged with no count.

## Required context

`TriStateFilter` uses `property.filter.labels = ['All', 'Hookless', 'Hooked']`:
- `labelAll` = `'All'` → `filter.value === null` → no count
- `labelTrue` = `'Hookless'` → `filter.value === true` → `counts['true']`
- `labelFalse` = `'Hooked'` → `filter.value === false` → `counts['false']`

The hookless accessor `(w) => w.rim.hookless` returns a boolean. `makeSelectContextualCountsFor('hookless')` stringifies these to `'true'`/`'false'`.

After TASK-004, `Pill` already accepts a `muted` prop.

**Current `TriStateFilter` render (line ~367 of `FilterPanel.jsx`):**
```jsx
<Pill active={filter.value === null}  onClick={() => set(null)}>  {labelAll}</Pill>
<Pill active={filter.value === true}  onClick={() => set(true)}>  {labelTrue}</Pill>
<Pill active={filter.value === false} onClick={() => set(false)}> {labelFalse}</Pill>
```

## Potentially impacted files

- `frontend/src/components/MiniComparator/FilterPanel.jsx`

## Inputs

- `makeSelectContextualCountsFor` from `wheelsSelectors.js` (TASK-003)
- `Pill` with `muted` prop (TASK-004)
- `filter.value`: `null | true | false`
- `property.filter.labels`: `[string, string, string]`

## Expected outputs

```jsx
const TriStateFilter = ({ property, filter }) => {
  const dispatch = useDispatch();
  const [labelAll, labelTrue, labelFalse] = property.filter.labels;
  const set = (v) => dispatch(setFilterValue({ id: property.id, value: v }));

  const selectCounts = useMemo(() => makeSelectContextualCountsFor(property.id), [property.id]);
  const counts = useSelector(selectCounts);
  const trueCount  = counts['true']  ?? 0;
  const falseCount = counts['false'] ?? 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <FilterToggle
          enabled={filter.enabled}
          onChange={(v) => dispatch(setFilterEnabled({ id: property.id, enabled: v }))}
          ariaLabel={`Enable ${property.label.toLowerCase()} filter`}
        />
        <span className="text-sm font-medium text-ink-700">{property.label}</span>
      </div>
      <div className={`flex flex-wrap gap-1.5 ${filter.enabled ? '' : 'opacity-50 pointer-events-none'}`}>
        <Pill active={filter.value === null} onClick={() => set(null)}>
          {labelAll}
        </Pill>
        <Pill
          active={filter.value === true}
          muted={trueCount === 0 && filter.value !== true}
          onClick={() => set(true)}
        >
          {labelTrue} ({trueCount})
        </Pill>
        <Pill
          active={filter.value === false}
          muted={falseCount === 0 && filter.value !== false}
          onClick={() => set(false)}
        >
          {labelFalse} ({falseCount})
        </Pill>
      </div>
    </div>
  );
};
```

## Constraints

- `All` pill must not display any count — PRD FR-003 and section 9
- Selector key lookup uses string `'true'`/`'false'`, not booleans
- Muted styling never applied to the active pill

## Dependencies

TASK-003 (`makeSelectContextualCountsFor`) + TASK-004 (`Pill` with `muted` prop).

## Validation criteria

- [ ] `Hookless (N)` and `Hooked (M)` are displayed; when no other filter is active, N + M equals the total dataset size (AC-004, AC-006)
- [ ] `All` pill shows no count
- [ ] After applying a brand filter, counts update to reflect only matching wheels (AC-005, AC-007)
- [ ] A zero-count pill appears muted but remains clickable (AC-008)
- [ ] The active pill is never muted

## Tests to implement

### Unit
- Covered by TASK-003 unit tests (`hookless` selector returns `'true'`/`'false'` keys with correct counts)

### Integration
- Manual verification against AC-004, AC-006, AC-007, AC-008

---

## 6. Global Validation Strategy

### Unit validation

- `makeSelectRangeBoundsFor`: bounds from dataset, empty dataset edge case, single-value dataset
- `makeSelectContextualCountsFor`: baseline (no active filters), with one active filter (exclusion logic), own-axis exclusion, boolean keys, unknown ID

### Integration validation

- `resetFilters` restores range slider handles to dataset-derived bounds
- Changing one filter updates all other axes' counts in the same render cycle
- `selectFilteredWheels` output is identical before and after this evolution for equivalent filter states

### Functional validation

- Manual verification against AC-001 through AC-008

### Non-regression validation

- Existing range slider interaction (drag, numeric input, enable/disable toggle) unchanged
- Sorted and filtered table output identical for equivalent filter state
- Mobile layout (375 px viewport): pill wrapping and checkbox list scroll do not regress

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|---|---|---|
| `makeSelectContextualCountsFor` creates one memoised selector instance per filter axis per mounted component | Minor memory overhead | ~10 filter axes at current scale; acceptable. Each selector is a small closure. |
| `DualRangeRow` `pct()` divides by zero when `min === max` (empty or single-wheel dataset) | NaN slider positions (visual artifact) | Guard added in TASK-002: return 0 when `max === min` |
| SVG import in `wheelsData.js` causes module resolution failure in Vitest | All selector tests fail to import | File mock in TASK-001 resolves this |
| Count badges widen pills → layout shift on mobile | Visual regression | `flex-wrap` already in place; verify manually at 375 px |

---

## 8. Rollback Plan

- All changes confined to 4 existing files + 2 new files
- Each task is independently mergeable
- To rollback: restore `min`/`max` to range filter specs in `wheelProperties.jsx`; revert `filtersSlice.js` range initialisation; remove new selectors from `wheelsSelectors.js`; revert `FilterPanel.jsx` adapter changes
