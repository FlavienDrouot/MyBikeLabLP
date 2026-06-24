# PRD — Product Requirements Document

## 1. General Information

- Evolution ID: EVO-001
- Title: Dynamic Filter Ranges and Contextual Counts
- Author: Flavien Drouot
- Date: 2026-05-24
- Version: 1.0
- Needs Assessment reference: `needs-assessment.md`

---

## 2. Functional Objective

After this evolution, all filter controls in the wheel comparator reflect the actual dataset at all times:

- Range filter sliders derive their minimum and maximum bounds from the real values in the dataset — no manual update is ever needed.
- Multi-select and yes/no filter options display a contextual count showing how many wheels would remain if that option were selected, given all currently active filters.

---

## 3. Target Behavior

### General description

**Range filters (weight, price, rim depth, rim width)**
The slider for each range filter is initialised with bounds equal to the minimum and maximum values found in the dataset for that property. If a new wheel is added with a value outside the previous bounds, the slider adjusts automatically without any code change.

**Multi-select filters (brand, diameter, rim material, hub brand, hub model, spokes brand, spokes model, spoke material)**
Each selectable option displays a count in parentheses after its label (e.g., `Roval (3)`). The count equals the number of wheels that match all currently active filters **plus** the option being evaluated — the option itself does not need to be currently selected. When no other filter is active, the count equals the total number of wheels in the dataset carrying that option value.

**Yes/No filter (Hookless)**
The `Yes` and `No` options each display a contextual count following the same logic as multi-select options (e.g., `Yes (5)`, `No (7)`). The `All` option displays no count.

**Zero-count options**
An option whose contextual count is 0 is visually de-emphasised (muted/greyed appearance). It remains visible and selectable.

**Real-time updates**
Whenever any active filter changes, all displayed counts update immediately to reflect the new filtering context.

---

## 4. Functional Rules

### FR-001 — Range bounds derived from dataset

For each range filter property (weight, price, rim depth, rim width), the slider minimum equals the lowest value present in the dataset for that property, and the slider maximum equals the highest value. Bounds are exact — no rounding applied.

### FR-002 — Multi-select contextual counts

For each option in a multi-select filter, the system computes and displays a count equal to the number of wheels satisfying all currently active filters (excluding any active selection on the same filter axis) **and** matching this option's value. The count is displayed as `Label (N)`.

### FR-003 — Yes/No contextual counts

For the Hookless filter, the `Yes` option displays a contextual count and the `No` option displays a contextual count. The `All` option displays no count. Count logic is identical to FR-002.

### FR-004 — Counts reflect all active filters

Contextual counts must factor in every currently active filter on other axes. Changing any active filter triggers an immediate recomputation and re-render of all counts.

### FR-005 — Zero-count visual treatment

An option whose contextual count is 0 is rendered in a visually de-emphasised style (lower opacity or muted colour). It remains in the list and remains selectable.

### FR-006 — No counts on range filters

Range filter controls display no count. Only multi-select and yes/no options display counts.

### FR-007 — Empty dataset edge case

If the dataset contains no wheels, range filter bounds are undefined (the slider is not rendered or rendered in a safe default state), and all option counts are 0.

---

## 5. Detailed Use Cases

### UC-001 — User browses with no active filters

#### Preconditions
- The comparator is loaded with the full dataset (~15 wheels).
- No filter is active.

#### Steps
1. User opens the filter panel.
2. User observes the range sliders.
3. User observes the multi-select and yes/no option lists.

#### Expected result
- Each range slider spans from the actual minimum to the actual maximum value present in the dataset for that property.
- Each multi-select option displays a count equal to the number of wheels carrying that option value in the full dataset.
- Hookless `Yes` and `No` options display counts reflecting the full dataset. `All` shows no count.

#### Error cases
- None expected.

---

### UC-002 — User applies a multi-select filter, then reads counts on another axis

#### Preconditions
- No filter is active.

#### Steps
1. User selects `Roval` in the Brand filter.
2. User reads the counts displayed in the Rim material filter.

#### Expected result
- Rim material counts reflect only the wheels that match `Brand = Roval`.
- A material with no Roval wheel shows `(0)` and appears greyed out.

#### Error cases
- None expected.

---

### UC-003 — User encounters a zero-count option

#### Preconditions
- At least one filter is active such that some option on another axis has zero matching wheels.

#### Steps
1. User opens a filter whose options include one with zero contextual matches.

#### Expected result
- The option is visible in the list, displaying `(0)`.
- The option label and count appear visually de-emphasised (greyed).
- The option remains selectable.

#### Error cases
- None expected.

---

### UC-004 — New wheel added outside previous range bounds

#### Preconditions
- A wheel with a weight value below the current minimum (or above the current maximum) is added to the dataset file.

#### Steps
1. Developer adds the new wheel entry to the dataset.
2. The application is rebuilt / the page is refreshed.

#### Expected result
- The weight slider minimum (or maximum) automatically reflects the new extreme value.
- No code change outside the dataset file is required.

#### Error cases
- None expected.

---

### UC-005 — User changes an active filter

#### Preconditions
- Multiple filters are active.

#### Steps
1. User deselects one active filter option.

#### Expected result
- All counts across all filter axes update immediately to reflect the new filtering context.

#### Error cases
- None expected.

---

## 6. Acceptance Criteria

### AC-001
#### Description
Each range filter's slider minimum equals the lowest value in the dataset for that property; the maximum equals the highest value.
#### Expected verification
Inspect the rendered slider bounds for weight, price, rim depth, rim width. Compare against the actual min/max in `wheelsData.js`.
#### Type
- Manual

---

### AC-002
#### Description
Adding a wheel to the dataset with a value outside the previous bounds adjusts the slider without any code change beyond the dataset file.
#### Expected verification
Add a test wheel with an extreme value; reload the app; verify the slider bound has updated.
#### Type
- Manual

---

### AC-003
#### Description
Each multi-select option displays a count in parentheses after its label (e.g., `Roval (3)`).
#### Expected verification
Open the filter panel with no active filters; verify every option on every multi-select filter shows a positive count.
#### Type
- Manual

---

### AC-004
#### Description
Hookless `Yes` and `No` options each display a count. `All` displays no count.
#### Expected verification
Open the Hookless filter with no active filters; verify `Yes (N)`, `No (M)` where N+M equals the dataset size, and `All` has no count.
#### Type
- Manual

---

### AC-005
#### Description
Counts are contextual: they reflect wheels matching all currently active filters on other axes plus the evaluated option.
#### Expected verification
Activate one filter (e.g., Brand = Roval); verify that counts on all other filter axes change to reflect the narrowed dataset.
#### Type
- Manual

---

### AC-006
#### Description
When no filter is active, counts reflect the full dataset size.
#### Expected verification
With no active filters, verify that the sum of counts for a mutually exclusive axis (e.g., `Yes` + `No` in Hookless) equals the total number of wheels in the dataset.
#### Type
- Manual

---

### AC-007
#### Description
Changing any active filter updates all displayed counts immediately.
#### Expected verification
With multiple filters active, toggle one; verify all counts update without page reload.
#### Type
- Manual

---

### AC-008
#### Description
An option with zero contextual matches displays `(0)` and is visually de-emphasised, but remains selectable.
#### Expected verification
Activate filters that produce a zero-count option; verify it appears greyed, shows `(0)`, and can still be clicked.
#### Type
- Manual

---

## 7. Functional Impacts

### Impacted components
- `FilterPanel` (and any sub-components rendering individual filter controls): must receive or compute contextual counts and pass them to option renderers.
- Range slider component(s): must accept dynamically derived `min`/`max` props instead of hardcoded values.
- Multi-select filter option renderer: must render `Label (N)` and apply de-emphasis style when N = 0.
- Hookless / yes-no filter option renderer: same as multi-select for `Yes` and `No`; `All` unchanged.

### Impacted data
- `src/data/wheelsData.js`: no structural change; range bounds and counts are derived from the existing data shape.
- `src/config/wheelProperties.jsx`: range filter definitions may need a flag or convention to indicate that bounds are derived from data rather than hardcoded.

### Impacted APIs
- None (frontend-only, static dataset).

### Impacted permissions / roles
- None.

---

## 8. Out of Scope

- Count display on range filter controls.
- Sorting behavior.
- Column visibility.
- Any change to the wheel dataset content.
- Backend, real-time data fetching, or caching strategies.

---

## 9. Constraints

- The dataset is static and client-side. All computation happens in the browser.
- The UI must remain readable on both desktop and mobile after counts are added; layout must not break.
- Zero-count options must remain visible and selectable — they must not be hidden or disabled.
- The `All` option of the Hookless filter must not display a count.

---

## 10. Test Plan

### Automated tests expected
- Unit test: count computation function returns correct values for a given dataset and active filter state.
- Unit test: range bound derivation returns exact min/max from an array of wheel values.
- Unit test: zero-count detection returns the correct subset of options.

### Manual tests expected
- Verify range slider bounds match dataset min/max for each range property.
- Verify count display format (`Label (N)`) for each multi-select filter with no active filters.
- Verify contextual count update when one or more filters are activated.
- Verify Hookless `Yes` / `No` counts; confirm `All` shows no count.
- Verify zero-count option appearance (greyed, visible, selectable).

### Edge cases
- Dataset contains a single wheel: all counts are 0 or 1; range slider min = max.
- All wheels share the same value on one axis: only one option has a non-zero count on that axis.
- Empty dataset: range sliders have no valid bounds; all counts are 0.

### Non-regression
- Existing filter behavior (selecting, deselecting, resetting) must continue to work correctly.
- Existing range slider interaction (dragging handles, typing values) must not be affected.
- Sorted and filtered table output must be identical to pre-evolution behavior when using the same filter state.
