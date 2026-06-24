# Needs Assessment

## 1. General Information

- Evolution ID: EVO-030
- Title: Comparator layout stability during range filtering
- Author: Flavien Drouot
- Date: 2026-05-29
- Status: Draft
- Priority: Low

---

## 2. Context

### Current situation
In the wheel comparator (desktop layout, `lg+`), the filter panel sits as a sidebar
to the left of the comparison table. The table sizes itself to its current content.
When the user changes a filter, the set of displayed rows changes, the table's width
changes accordingly, and because the whole comparator block is centered as one unit,
this width change shifts the filter panel's position as well.

### Identified problem
While the user is dragging a **range** filter slider, the table width keeps changing
as results update. This moves the filter panel under the cursor, so the slider thumb
"leaks" away from the pointer. This produces a disruptive feedback loop:
move the slider → results change → panel shifts → the thumb is no longer under the
cursor → the targeted value changes → results change again (flicker). The user cannot
comfortably set the value they intend.

### Business motivation
The comparator is the product's single flagship interactive feature (MVP v0.1). Range
filters (weight, price, rim depth, rim width) are a core part of it. An interaction that
fights the user undermines the credibility of the whole "objective, structured comparison"
value proposition.

---

## 3. Business Objective

Make range-filter interaction feel stable and predictable: the user can adjust a range
slider precisely, without the filter controls moving and without the flicker loop, while
keeping the comparison table visually centered on the page.

---

## 4. Scope

### Included
- The **range** filter interaction (weight, price, rim depth, rim width).
- The **desktop (`lg+`)** layout, where the filter panel is a sidebar beside the table.
- Keeping **both the filter panel and the comparison table positionally stable** during a range-slider manipulation — the layout must not move or change width while filtering.
- Preserving the **current centered comparator layout** — no layout redesign.

### Excluded
- Multi-select and tri-state filter interactions (acute symptom is range-specific; see Open Questions — the underlying cause is shared and stays latent for these types).
- Sorting and column show/hide stability.
- Mobile / tablet layout (the filter panel is an off-canvas overlay drawer there and does not exhibit the problem).
- Table width changes triggered by a **dataset refresh** or by **column show/hide** — these remain acceptable; only filtering must not change the width.
- Any change to filter logic, data, or which wheels match.

---

## 5. Constraints

### Business constraints
- Must not degrade the existing centered, balanced visual presentation of the comparator.

### Known technical constraints
- The table content is highly configurable (columns can be shown/hidden) and column content
  is variable in width — the layout cannot rely on fixed assumptions about content size.
- The dataset will move from generated samples to live data feeds, refreshing at most daily.
  Refreshes never occur during a user interaction.

### Regulatory / security constraints
- None.

---

## 6. Use Cases

### Nominal case
As a cyclist comparing wheels,
I want to drag a range slider (e.g. weight or price) without the filter controls jumping,
So that I can set exactly the range I intend, on the first try.

### Alternative cases
- The user drags a range slider that filters results down to very few (or zero) rows: the
  layout stays completely stable — neither the panel nor the table moves or changes width.

### Known error cases
- (Current, to be eliminated) The slider thumb drifts away from the cursor mid-drag because
  the panel shifted, causing the user to land on an unintended value.

---

## 7. Acceptance Criteria

- [ ] On the desktop (`lg+`) layout, while the user drags a range filter slider, neither the filter panel nor the table moves or changes width.
- [ ] During a range-slider drag, the slider thumb stays under the pointer: the value set equals the value the user is pointing at.
- [ ] The flicker feedback loop (value change → panel shift → unintended value change) no longer occurs during range filtering.
- [ ] The current centered comparator layout is preserved (no visual redesign).
- [ ] Table width may still change on a dataset refresh or on column show/hide, but never as a result of filtering.

---

## 8. Open Questions

- Multi-select and tri-state filters share the same underlying cause (table width depends on the filtered result set) and will still shift the table when used. Left out of scope for now; should a follow-up evolution address them once this is done? (Note: the chosen direction — width derived from the full dataset rather than the filtered subset — would naturally fix these too if extended.)

---

## 9. Assumptions

- Data feeds refresh at most daily and never during a user interaction, so a layout adjustment on data refresh is acceptable.
- The mobile/tablet overlay drawer is unaffected and out of scope.
- Sorting and column show/hide are not required to be free of layout shifts in this evolution.
