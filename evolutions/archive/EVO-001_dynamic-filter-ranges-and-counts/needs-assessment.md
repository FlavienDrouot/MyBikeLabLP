# Needs Assessment

## 1. General Information

- Evolution ID: EVO-001
- Title: Dynamic Filter Ranges and Contextual Counts
- Author: Flavien Drouot
- Date: 2026-05-24
- Status: Draft
- Priority: Medium

---

## 2. Context

### Current situation

The wheel comparator offers range filters (weight, price, rim depth, rim width) with hardcoded min/max bounds, and multi-select / yes-no filters (brand, rim material, hookless, hub brand, etc.) with no indication of how many wheels match each option.

### Identified problem

1. Range filter bounds are hardcoded in the codebase. If a new wheel is added outside the current bounds (e.g., a 1150 g wheel when the minimum is hardcoded at 700 g), the slider would allow values the data cannot reach, creating a misleading UX.
2. Users have no feedback on how many wheels correspond to a filter option before selecting it. They may select an option that yields zero results without knowing in advance.

### Business motivation

A comparator's value depends on users finding relevant wheels quickly. Filters that feel disconnected from the actual dataset reduce trust. Showing counts per option helps users make informed filter choices and reduces dead-end selections.

---

## 3. Business Objective

- Range filter bounds always reflect the actual dataset, requiring no manual update when new wheels are added.
- Users can see, for each filter option (multi-select or yes/no), how many wheels match — factoring in all currently active filters — before making a selection.

---

## 4. Scope

### Included

- Range filters: min/max bounds derived dynamically from the dataset at render time (weight, price, rim depth, rim width)
- Multi-select filters: count per option displayed in parentheses (brand, diameter, rim material, hub brand, hub model, spokes brand, spokes model, spoke material)
- Yes/No filter (Hookless): count per option displayed in parentheses
- Counts reflect the **contextual count**: wheels that match all currently active filters plus the option being evaluated (Option B)

### Excluded

- Range filters: no count display
- Sorting behavior
- Column visibility
- Any change to the dataset itself

---

## 5. Constraints

### Business constraints

- The display must remain readable on both desktop and mobile; adding counts must not break the layout.

### Known technical constraints

- The dataset is currently static (no backend). All computation is done client-side.
- Contextual counts (Option B) require re-computing a filtered subset for each option whenever any active filter changes. Feasibility assessment: **Option B is feasible** for a ~15-wheel static dataset. For each option, the count is: `data.filter(wheel => meetsAllOtherFilters(wheel) && wheel[property] === optionValue).length`. This is a standard faceted search pattern. Performance is not a concern at this dataset size.

### Regulatory / security constraints

- None.

---

## 6. Use Cases

### Nominal case — dynamic range bounds

As a user browsing the comparator,
I want the range sliders to start and end at the actual minimum and maximum values in the dataset,
So that the slider range is always meaningful and never misleads me about what wheels are available.

### Nominal case — contextual counts

As a user with one or more filters already active,
I want to see next to each multi-select option or yes/no option the number of wheels that would remain if I selected that option (keeping all other active filters),
So that I can choose filter options without risking a dead-end (zero results).

### Alternative cases

- A filter option has zero matches given the current filters: the count shows `(0)` and the option remains visible but visually de-emphasized (exact style TBD in PRD).
- All filters are at default / inactive: counts reflect the full dataset size.

### Known error cases

- Dataset is empty: range filters have no bounds to derive; counts are all 0.

---

## 7. Acceptance Criteria

- [ ] Each range filter's minimum bound equals the lowest value present in the dataset for that property; the maximum bound equals the highest value.
- [ ] Adding a new wheel to the dataset with a value outside the previous bounds automatically adjusts the corresponding slider without any code change.
- [ ] Each multi-select option displays a count in parentheses after its label (e.g., `Roval (3)`).
- [ ] The Hookless filter displays a count for each of its options (e.g., `Yes (5)`, `No (7)`, `All (12)`).
- [ ] Counts are contextual: they reflect the number of wheels matching all currently active filters plus the evaluated option.
- [ ] When no other filter is active, counts reflect the full dataset size.
- [ ] Changing any active filter updates all displayed counts in real time.
- [ ] An option with zero contextual matches displays `(0)` and remains selectable.

---

## 8. Open Questions

- Should options with a count of `(0)` be visually de-emphasized (e.g., greyed out) or remain unchanged? To be defined in the PRD.
- For the `All` option of yes/no filters: should it display a count (total wheels matching other active filters) or no count? To be defined in the PRD.

---

## 9. Assumptions

- The dataset remains static and client-side for this evolution. No backend query optimization is needed.
- Option B (contextual counts) is preferred and feasible given the current dataset size (~15 wheels).
- Range filter bounds are computed from the dataset without rounding (e.g., 1250–1800 g, not 1200–1800 g).
