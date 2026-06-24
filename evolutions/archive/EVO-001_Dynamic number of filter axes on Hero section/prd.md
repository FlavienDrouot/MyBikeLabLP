# PRD — Product Requirements Document

## 1. General Information

- Evolution ID: EVO-001
- Title: Hero — dynamic filter axes count
- Author: Flavien Drouot
- Date: 2026-05-24
- Version: 1.0
- Needs Assessment reference: `MyBikeLab/evolutions/EVO-001/needs-assessment.md`

---

## 2. Functional Objective

The Hero section must display the exact number of filterable properties offered by the Wheel Comparator. This count must always stay in sync with the actual filter definition — no manual update should ever be required.

---

## 3. Target Behavior

### General description

When a visitor lands on the page, the Hero section shows a key stat reflecting the number of filter axes available in the Wheel Comparator. This number is computed from the single source of truth for filterable properties (the central filter registry), not written manually in the Hero. Any future addition or removal of a filter automatically changes the displayed count.

---

## 4. Functional Rules

### FR-001 — Filter count derived from the registry

The number of filter axes displayed in the Hero must be derived from the same definition that drives the Wheel Comparator filters. It must not be a hardcoded literal.

### FR-002 — Single source of truth

The central filter registry (`wheelProperties`) is the authoritative list of filterable properties. The Hero reads from it; it does not maintain its own count.

### FR-003 — Hero content boundary

Only the filter axes stat is in scope. The wheel count stat ("15+ wheels"), the CTAs, the layout, and the copy of the Hero section must remain unchanged.

---

## 5. Detailed Use Cases

### UC-001 — Visitor sees the correct filter count

#### Preconditions
- The landing page is loaded in a browser.
- The Wheel Comparator exposes 13 filterable properties.

#### Steps
1. The visitor opens the landing page.
2. The Hero section renders.
3. The filter axes stat is displayed.

#### Expected result
- The displayed count equals 13 (the current number of filterable properties).
- No other Hero element is affected.

#### Error cases
- None identified.

---

### UC-002 — Developer adds a filter

#### Preconditions
- A new filterable property is added to the central filter registry.

#### Steps
1. The developer adds one entry to the filter registry.
2. No change is made to the Hero component.
3. The landing page is loaded.

#### Expected result
- The Hero stat automatically displays the updated count (previously 13, now 14).

#### Error cases
- None identified.

---

### UC-003 — Developer removes a filter

#### Preconditions
- An existing filterable property is removed from the central filter registry.

#### Steps
1. The developer removes one entry from the filter registry.
2. No change is made to the Hero component.
3. The landing page is loaded.

#### Expected result
- The Hero stat automatically displays the updated count (previously 13, now 12).

#### Error cases
- None identified.

---

## 6. Acceptance Criteria

### AC-001
#### Description
The Hero section displays a filter axes count equal to the current number of filterable properties (13 at the time of this PRD).
#### Expected verification
Load the landing page and verify that the filter axes stat reads "13".
#### Type
- Manual

---

### AC-002
#### Description
No hardcoded filter count exists in the Hero component or any value it directly receives.
#### Expected verification
Inspect the Hero source: no numeric literal representing the filter count is present.
#### Type
- Manual

---

### AC-003
#### Description
Adding a filterable property to the registry causes the Hero stat to update automatically on next page load, without any change to the Hero component.
#### Expected verification
Add one property to the registry, load the page, verify the Hero displays the incremented count.
#### Type
- Manual

---

### AC-004
#### Description
The wheel count stat, CTAs, layout, and all other Hero content are identical to their pre-evolution state.
#### Expected verification
Visual and source comparison of the Hero section before and after the change.
#### Type
- Manual

---

## 7. Functional Impacts

### Impacted components
- Hero section: reads and displays the filter count instead of a hardcoded value.

### Impacted data
- Central filter registry (`wheelProperties`): acts as the source of truth consumed by the Hero. No structural change to the registry itself.

### Impacted APIs
- None.

### Impacted permissions / roles
- None.

---

## 8. Out of Scope

- Changes to the filters themselves (no filter added or removed as part of this evolution).
- Changes to any other Hero stat or content element.
- Changes to the Roadmap, Benefits, Partnership, or Footer sections.
- Any backend or data pipeline work.

---

## 9. Constraints

- The filter axes count must remain accurate at all times, including after future filter additions or removals.
- No manual update to the Hero should ever be needed when the filter set changes.

---

## 10. Test Plan

### Automated tests expected
- None required for this evolution (no logic, no state — display only).

### Manual tests expected
- Verify the displayed count matches the number of entries in the filter registry.
- Verify no other Hero content has changed.

### Edge cases
- Registry temporarily empty: the Hero would display "0 filter axes" — acceptable, as it reflects reality.

### Non-regression
- All other sections of the landing page render correctly.
- The Wheel Comparator filter behavior is unaffected.

---

## 11. Validation

- Validated by: Flavien Drouot
- Date: 2026-05-24
- Status: Validated
