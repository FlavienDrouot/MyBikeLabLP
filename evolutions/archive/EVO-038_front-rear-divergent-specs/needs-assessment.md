# Needs Assessment

## 1. General Information

- Evolution ID: EVO-038
- Title: Front/rear divergent specs for wheelsets
- Author: Flavien Drouot
- Date: 2026-06-03
- Status: Needs Assessment — awaiting validation
- Priority: Medium (supports the First-Data-Ingestion effort: scraped data routinely carries differing front/rear values)

---

## 2. Context

### Current situation

A catalog entry is treated as a single object with one value per spec (weight, rim
depth, external width, internal width, etc.). The implicit assumption is that the
front and rear wheels are identical. In the comparator, each spec renders as a single
value and feeds filtering and sorting as a single scalar.

The catalog unit has now been made explicit: **one entry represents a wheelset (front +
rear pair sold together)** — see `domain-vocabulary.md`.

### Identified problem

Real road wheelsets frequently differ front vs. rear:

- **Rim depth** differs on aero combos (e.g. front 50 mm / rear 60 mm — Zipp 454,
  404/808 combos).
- **Weight** is published sometimes as a pair total, sometimes split front/rear.
- **External width** and **internal width** occasionally differ between wheels.

The current single-value model cannot represent these cases. During data ingestion,
divergent values must either be flattened (losing information) or forced into one wheel,
which is incorrect.

### Business motivation

The First-Data-Ingestion effort will bring scraped specs where front ≠ rear is common.
The data model and comparator must represent this faithfully, otherwise the catalog
loses accuracy on exactly the high-end aero wheelsets that differentiate the product.
Accurate, comparable specs are the core value proposition (`product-overview.md`).

---

## 3. Business Objective

Allow a wheelset entry to carry **distinct front and rear values for the specs that can
diverge**, and surface that divergence correctly in the comparator — while keeping the
common case (front = rear) as simple as today.

---

## 4. Scope

### Included

- The **divergence mechanism** applied to existing numeric specs that can differ
  front/rear: **rim depth, external width, internal width, weight**.
- **Ingestion**: the data format must accept a single value (front = rear) or a
  front/rear pair for these specs.
- **Display**: dimensional specs show both values when they differ (e.g. `50 / 60 mm`),
  a single value otherwise.
- **Filtering**: dimensional specs match by **OR** — a pair matches a range filter if
  *either* the front or the rear value falls within the range.
- **Weight handling (distinct rule)**: always display the **pair total (sum)**; show the
  front/rear breakdown as detail when available; **filter on the sum only**.
- Backward compatibility: entries where front = rear keep current behavior unchanged.

### Excluded

- **Spoke count (rayonnage)** — does not exist as a comparator field today. Adding it is
  a separate enrichment evolution, deferred.
- Any spec that does not diverge front/rear (brand, rim material, hub, hookless, etc.).
- New filter UI paradigms; this evolution reuses the existing filter/sort surface.

---

## 5. Constraints

### Business constraints

- The common case (front = rear) must stay visually and behaviorally identical to today —
  divergence is the exception, not the new default.
- Weight must remain comparable across the catalog as a single number (the pair total),
  regardless of whether a breakdown exists.

### Known technical constraints

- The catalog is currently maintained as inline data (`wheelsData.js`); the ingestion
  format change must remain compatible with the planned scaling approach
  (`product-overview.md` — Architecture note).
- Filtering and sorting logic for the affected specs will need to handle a value that may
  be a scalar or a front/rear pair.

### Regulatory / security constraints

- None.

---

## 6. Use Cases

### Nominal case

As a road cyclist comparing wheelsets,
I want to see when a wheelset has a different front and rear rim depth (or width, or
per-wheel weight),
So that I can judge aero combos and weight accurately instead of assuming both wheels are
identical.

### Alternative cases

- A wheelset where front = rear: a single value is shown, exactly as today.
- A wheelset with a known pair-total weight but no front/rear breakdown: the total is
  shown and filtered; no breakdown is displayed.
- A wheelset with front/rear weights only: the sum is computed for display and filtering,
  and the breakdown is shown as detail.

### Known error cases

- A divergent value is provided for a spec not eligible for divergence → it must be
  rejected or normalized to a single value during ingestion.
- Only one of front/rear is provided for a dimensional spec → must be handled as a defined
  rule (e.g. treat as single value), not silently produce a half-empty pair.

---

## 7. Acceptance Criteria

- [ ] A wheelset entry can store either a single value or a front/rear pair for rim depth,
      external width, and internal width.
- [ ] When front and rear differ on a dimensional spec, the comparator cell shows both
      values; when equal, it shows one.
- [ ] A range filter on a dimensional spec matches a wheelset if **either** its front or
      rear value falls within the range (OR semantics).
- [ ] Weight is always displayed as the pair total; when a front/rear breakdown exists, it
      is shown as additional detail.
- [ ] Weight filtering operates on the pair total only, never on an individual wheel value.
- [ ] Wheelsets where front = rear behave identically to the current implementation
      (no visual or filtering regression).
- [ ] The ingestion format documents and accepts both the single-value and front/rear-pair
      forms for the eligible specs.

---

## 8. Open Questions

- **Sort semantics on divergent dimensional specs**: when front ≠ rear, which value drives
  sorting (max, min, front, rear)? To be decided in PRD.
- **Cell formatting**: exact rendering of a divergent dimensional value (`50 / 60 mm` vs.
  other notation) — design detail for PRD.
- **Single-side input rule**: precise normalization when only front or only rear is
  provided for a dimensional spec.

---

## 9. Assumptions

- The catalog unit is the wheelset (front + rear pair) — confirmed, recorded in
  `domain-vocabulary.md`.
- Only rim depth, external width, internal width, and weight need divergence support in
  this evolution; all other specs remain single-valued per wheelset.
- Internal width already exists as a spec in the data model (confirmed in the i18n locale
  files); `product-overview.md` is out of date on this point and should be corrected.
