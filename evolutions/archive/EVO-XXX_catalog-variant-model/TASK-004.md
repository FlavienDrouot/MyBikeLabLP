# TASK-004: Grouping selector `selectGroupedWheels`

## Objective

Add a memoized selector that transforms the flat, filtered, sorted output of
`selectFilteredWheels` into an ordered list of row descriptors: standalone rows and
collapsible model groups, with the data needed for filter-driven auto-expansion. All grouping
logic lives here (AD-004); `selectFilteredWheels` and the filter/sort contract are untouched.

## Required context

- `selectFilteredWheels` (in `src/store/selectors/wheelsSelectors.js`) returns the flat,
  filtered, sorted array of configuration objects. It must NOT change.
- A configuration carries `model_group` (string | absent) and `model_group_label` (string |
  absent) after TASK-002.
- The full catalog is `state.wheels.items` — needed to compute each group's total sibling
  count (`siblingCount`) so auto-expansion can detect that filters pruned siblings.
- Auto-expand rule (FR-005, AD-004): a group renders expanded automatically when
  `survivingCount < siblingCount`. Otherwise it is collapsed (representative shown). A group
  with zero surviving configurations does not appear at all (it is simply absent from the
  filtered list).
- Representative = the lightest surviving configuration: lowest resolved total weight via
  `resolveSpec(w.weight_grams).total`; tie-break lowest min price (`minPrice` helper, exported
  from the registry); final tie-break lowest `id`. Missing weight sorts last for this choice.
- Sort order must be preserved: emit descriptors in the order their representative (for groups)
  or the row itself (for standalone) first appears in the sorted flat list, so the table keeps
  the active sort.

## Potentially impacted files

- `frontend/src/store/selectors/wheelsSelectors.js` (add `selectGroupedWheels`)
- `frontend/src/store/selectors/__tests__/wheelsSelectors.test.js` (extend)

## Inputs

- `selectFilteredWheels` output (filtered + sorted configurations).
- `state.wheels.items` (for `siblingCount`).

## Expected outputs

- `selectGroupedWheels` returns an ordered array of descriptors:
  - standalone: `{ kind: 'single', wheel }` for a configuration with no `model_group`.
  - group: `{ kind: 'group', groupId, label, representative, configurations,
    siblingCount, survivingCount, autoExpanded }` where:
    - `configurations` = surviving siblings, preserving the sorted order,
    - `representative` = lightest surviving configuration (tie-break price, then id),
    - `siblingCount` = total configurations of that `model_group` in `items`,
    - `survivingCount` = `configurations.length`,
    - `autoExpanded` = `survivingCount < siblingCount`.
- Order of descriptors follows the sorted flat list (first appearance of each group/standalone).

## Constraints

- Memoize with `createSelector`; inputs are `state.wheels.items` and the filtered list (or
  recompute the filtered list as an input selector). Avoid recomputation on unrelated state.
- Pure function: no view state, no React, no i18n.
- A single-configuration `model_group` (only one sibling in the whole catalog) should behave
  like a standalone row (no group affordance) — treat `siblingCount === 1` as `kind: 'single'`.
- Do not mutate the input arrays.

## Dependencies

TASK-001

## Validation criteria

- [ ] A model with multiple surviving siblings yields one `group` descriptor with correct
      `representative`, `configurations`, `siblingCount`, `survivingCount`.
- [ ] When a filter prunes some siblings, `autoExpanded` is `true` and `configurations`
      contains only survivors.
- [ ] When all siblings survive (no axis filter pruning), `autoExpanded` is `false`.
- [ ] A `model_group` with one sibling in the catalog is emitted as `kind: 'single'`.
- [ ] A group with zero survivors does not appear.
- [ ] Descriptor order matches the active sort; `selectFilteredWheels` output is unchanged.

## Tests to implement

### Unit
- Bucketing: siblings sharing `model_group` collapse into one descriptor; standalones pass
  through.
- Representative selection: lightest wins; tie broken by price then id; missing-weight sibling
  never chosen as representative when a weighted one exists.
- `siblingCount` vs `survivingCount` and the `autoExpanded` flag under: no filter, partial
  prune, full prune (group absent).
- Single-sibling `model_group` → `kind: 'single'`.
- Order preservation under different active sorts.

### Integration
- With the real catalog + an active spoke-material filter, the affected model's group is
  `autoExpanded` and lists only matching configurations.
