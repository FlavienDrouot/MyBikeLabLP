# PRD — Product Requirements Document

## 1. General Information

- **Evolution ID:** EVO-005
- **Title:** Replace legacy ink-N00 tokens in wheelProperties.jsx
- **Author:** Flavien Drouot
- **Date:** 2026-05-26
- **Version:** 1.0
- **Needs Assessment reference:** `evolutions/EVO-005_fix-legacy-ink-tokens-wheelproperties/needs-assessment.md`

---

## 2. Functional Objective

All `cellClassName` values in `wheelProperties.jsx` must use current design system tokens exclusively. All `headClassName` values must be free of legacy `ink-N00` tokens. After this evolution, no legacy token remains in `wheelProperties.jsx`, and the comparison table renders with visually consistent text color across all properties.

---

## 3. Target Behavior

### General description

`wheelProperties.jsx` is the single source of truth for wheel property definitions. Each property may declare a `cellClassName` controlling the text style applied to data cells in the comparison table.

Currently, ten properties declare a `cellClassName` containing `text-ink-700` or `text-ink-900` — legacy tokens from the pre-EVO-003 vocabulary. These cause the affected cells to render in a stale slate color that does not match the rest of the interface.

After this evolution:

- Every `cellClassName` that previously contained a legacy `ink-N00` token is replaced with the current equivalent token (`text-ink-11`).
- Every `headClassName` that contained a legacy `ink-N00` token is updated to a current token or removed if the resulting value is empty or redundant.
- No other property data, labels, structure, or rendering logic is changed.
- The comparison table displays uniform text color across all previously affected data cells, consistent with the design system established in EVO-003.

---

## 4. Functional Rules

### FR-001 — cellClassName must use current design tokens only

Any `cellClassName` value defined in `wheelProperties.jsx` must exclusively use tokens from the current design system vocabulary (format: `ink-N`, e.g. `text-ink-11`). Legacy `ink-N00` tokens (`text-ink-700`, `text-ink-900`) are not permitted.

The replacement token for body text color is `text-ink-11`.

### FR-002 — headClassName must not contain legacy tokens

Any `headClassName` value defined in `wheelProperties.jsx` must not contain legacy `ink-N00` tokens. If replacing the legacy token would result in an empty or redundant class string, the `headClassName` field may be removed from that property definition.

### FR-003 — No other property data may change

The scope of this evolution is limited to token values within `cellClassName` and `headClassName`. Property identifiers, labels, data structure, ordering, and any other field must remain unchanged.

### FR-004 — No changes to consuming components

The way `cellClassName` and `headClassName` are read and applied by rendering components (`ComparisonTable.jsx` or any other) must not be modified.

---

## 5. Detailed Use Cases

### UC-001 — User views the comparison table after token replacement

#### Preconditions

- The application is running with the updated `wheelProperties.jsx`.
- At least two wheels are loaded in the comparator.
- All ten previously affected properties are visible in the table.

#### Steps

1. The user opens the wheel comparator.
2. The comparison table renders with all wheel properties.
3. The user observes the text color of data cells for the ten previously affected properties.

#### Expected result

- All data cells render with the `text-ink-11` text color.
- No cell displays the legacy slate color associated with `text-ink-700` or `text-ink-900`.
- The visual appearance of column headers is unchanged (since `headClassName` is dead code and headers use hardcoded classes).
- All other properties, values, and layout are unchanged.

#### Error cases

- None identified.

---

## 6. Acceptance Criteria

### AC-001

#### Description
No legacy `ink-N00` token remains in `wheelProperties.jsx`.

#### Expected verification
Search the file `wheelProperties.jsx` for the pattern `ink-[0-9]00`. The search returns zero matches.

#### Type
- Automated

---

### AC-002

#### Description
All `cellClassName` values that previously contained `text-ink-700` or `text-ink-900` now contain `text-ink-11`.

#### Expected verification
For each of the ten affected properties, inspect the `cellClassName` field in `wheelProperties.jsx` and confirm the value contains `text-ink-11` in place of the legacy token. The total count of `cellClassName` fields referencing `text-ink-11` must be greater than or equal to the count of previously affected properties (10).

#### Type
- Automated

---

### AC-003

#### Description
All `headClassName` values are free of legacy `ink-N00` tokens.

#### Expected verification
Search `wheelProperties.jsx` for `headClassName` entries and confirm none contain a value matching `text-ink-[0-9]00`. Fields may have been updated to a current token or removed.

#### Type
- Automated

---

### AC-004

#### Description
The number of property definitions in `wheelProperties.jsx` is unchanged.

#### Expected verification
Count the property objects defined in `wheelProperties.jsx` before and after the change. The count must be identical.

#### Type
- Automated

---

### AC-005

#### Description
No property identifier, label, or non-className field has been modified.

#### Expected verification
Diff `wheelProperties.jsx` against the previous version. The only lines changed are those containing `cellClassName` or `headClassName` values with legacy tokens.

#### Type
- Automated

---

### AC-006

#### Description
The comparison table renders with visually consistent text color across all previously affected properties.

#### Expected verification
Open the wheel comparator in a browser. Visually inspect data cells for the ten previously affected properties. All cells must display in the standard body text color (`ink-11`), matching non-affected cells. No cell should display a noticeably different (lighter or darker) text color.

#### Type
- Manual

---

### AC-007

#### Description
No rendering component has been modified.

#### Expected verification
Diff `ComparisonTable.jsx` and any other rendering component against the previous version. No changes are present.

#### Type
- Automated

---

## 7. Functional Impacts

### Impacted components

- `wheelProperties.jsx` — the only file modified; token values updated in `cellClassName` and `headClassName` fields.

### Impacted data

- The `cellClassName` field of ten property definitions: values change from `text-ink-700` or `text-ink-900` to `text-ink-11`.
- The `headClassName` field of affected property definitions: legacy tokens replaced with current tokens or fields removed.

### Impacted APIs

- None.

### Impacted permissions / roles

- None.

---

## 8. Out of Scope

- Changes to any component that consumes `cellClassName` or `headClassName` (e.g. `ComparisonTable.jsx`).
- Changes to property labels, identifiers, data values, or structure in `wheelProperties.jsx`.
- Any other file in the codebase.
- Introduction of new design tokens not already part of the EVO-003 vocabulary.

---

## 9. Constraints

- Replacement tokens must belong to the current design system token vocabulary (format: `ink-N`) established in EVO-003.
- The standard body text token is `text-ink-11`; this is the designated replacement for `text-ink-700` and `text-ink-900` in `cellClassName`.
- `headClassName` cleanup has no current visual impact; it is included strictly for data hygiene.

---

## 10. Test Plan

### Automated tests expected

- Static file scan: assert zero occurrences of `ink-[0-9]00` in `wheelProperties.jsx`.
- Static file scan: assert the count of property definitions is unchanged.
- Diff guard: assert no changes outside `cellClassName` and `headClassName` value strings.
- Diff guard: assert `ComparisonTable.jsx` and all rendering components are unmodified.

### Manual tests expected

- Open the wheel comparator in a browser.
- Load at least two wheels so all properties are visible.
- Visually verify that all data cells for the ten previously affected properties display text in the standard `ink-11` color.
- Verify that column headers are visually unchanged.
- Verify that all property values, labels, and table layout are unaffected.

### Edge cases

- A property whose `headClassName` consisted solely of a legacy token: confirm the field is either removed or replaced, and that no runtime error is introduced (field absence must be handled gracefully by the consuming component, which it already is per AD-006).

### Non-regression

- The comparison table must behave identically to its pre-change state for all properties that were not affected by legacy tokens (no unintended modifications).
- Filtering, sorting, and side-by-side comparison functionality must be unaffected.
