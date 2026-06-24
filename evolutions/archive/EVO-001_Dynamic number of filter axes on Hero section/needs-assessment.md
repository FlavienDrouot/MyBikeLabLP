# Needs Assessment

## 1. General Information

- Evolution ID: EVO-001
- Title: Hero — dynamic filter axes count
- Author: Flavien Drouot
- Date: 2026-05-24
- Status: Draft
- Priority: Low

---

## 2. Context

### Current situation

The Hero section of the landing page displays a hardcoded key stat: "7 filter axes". This value was set manually during initial development and does not reflect the actual number of filterable properties available in the Wheel Comparator.

The Wheel Comparator currently exposes 13 filterable properties (Brand, Weight, Price, Diameter, Rim material, Hookless, Rim depth, Rim width, Hub brand, Hub model, Spokes brand, Spokes model, Spoke material).

### Identified problem

The displayed stat ("7 filter axes") is factually incorrect and misleading for users visiting the landing page. It understates the richness of the filtering tool and creates an inconsistency between what the Hero promises and what the Comparator delivers.

Furthermore, as the filter set evolves, a hardcoded value will become stale again without any visible signal that it needs updating.

### Business motivation

The Hero section is a credibility and conversion surface — it must accurately reflect the product's capabilities. An incorrect stat undermines trust and may reduce engagement with the Comparator. Making the count dynamic eliminates a class of content drift bugs as the product evolves.

---

## 3. Business Objective

- Display the correct number of filter axes in the Hero section at all times.
- Eliminate the need for manual updates when filters are added or removed.

---

## 4. Scope

### Included

- Update the Hero stat to reflect the actual number of filterable properties in the Wheel Comparator (currently 13).
- Make the displayed count dynamic — derived from the filter definition, not hardcoded.

### Excluded

- Changes to the filters themselves (no filter added or removed as part of this evolution).
- Changes to any other Hero stats ("15+ wheels", CTAs, etc.).
- Changes to the Roadmap, Benefits, Partnership, or Footer sections.

---

## 5. Constraints

### Business constraints

- The stat must remain accurate at all times — including after future filter additions or removals.

### Known technical constraints

- None identified at this stage.

### Regulatory / security constraints

- None.

---

## 6. Use Cases

### Nominal case

As a visitor landing on the page,
I want to see the correct number of filter axes in the Hero,
So that I have an accurate picture of the Comparator's capabilities before scrolling down.

### Alternative cases

- A developer adds a new filter to the Comparator: the Hero stat updates automatically with no code change required outside the filter definition.
- A developer removes a filter: same as above.

### Known error cases

- None identified.

---

## 7. Acceptance Criteria

- [ ] The Hero section displays "13 filter axes" (or equivalent phrasing) reflecting the current filter count.
- [ ] The displayed count is derived dynamically from the filter definition — no hardcoded number in the Hero component.
- [ ] When a filter is added to or removed from the Wheel Comparator definition, the Hero stat updates automatically without any additional change.
- [ ] No other Hero content is modified (wheel count, CTAs, layout).

---

## 8. Open Questions

- None remaining.

---

## 9. Assumptions

- The 13 filterable properties listed in product-overview.md are the single source of truth for the filter count.
- "Dynamic" means the count is computed from the same data structure that drives the Comparator filters, so both stay in sync by construction.

---

## 10. Business Validation

- Validated by: Flavien Drouot
- Date: 2026-05-24
- Comments: —
