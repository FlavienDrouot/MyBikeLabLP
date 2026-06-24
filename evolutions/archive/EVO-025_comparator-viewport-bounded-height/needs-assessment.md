# Needs Assessment

## 1. General Information

- Evolution ID: EVO-025
- Title: Comparator viewport-bounded height
- Author: Flavien Drouot
- Date: 2026-05-29
- Status: Draft
- Priority: Normal

---

## 2. Context

### Current situation
On the Landing page, the `MiniComparator` section displays two side-by-side panels on desktop: `FilterPanel` (filter controls) and `ComparisonTable` (filtered wheel list). Both panels currently take their natural content height. As a result, the more filters are exposed or the more wheels appear in the list, the taller the section becomes — and the user must scroll the whole page to reach the bottom of either panel.

### Identified problem
When either panel grows beyond the viewport, the side-by-side anchoring is lost: the user can no longer see filters and the table they are filtering at the same time. They have to scroll the page back and forth, which breaks the comparator's "workbench" feel.

This will get worse with the planned dataset growth from ~15 to ~150–200 wheels (data acquisition Phase A), and as the filter set evolves.

### Business motivation
The comparator is the central interactive feature of the MVP. Preserving the side-by-side filter ↔ table workflow at any dataset size is essential to keep the feature usable as the catalog grows and to maintain a credible demo for B2B outreach.

---

## 3. Business Objective

Keep `FilterPanel` and `ComparisonTable` simultaneously visible and usable on desktop, regardless of how much content they contain, by bounding their height to the available viewport and scrolling their content internally when it overflows.

---

## 4. Scope

### Included
- Apply a maximum height cap to `FilterPanel` on desktop.
- Apply a maximum height cap to `ComparisonTable` on desktop.
- Cap formula: `viewport height − Navbar height − 12 px margin`.
- When content exceeds the cap, scroll happens **inside** the component, independently for each of the two panels.
- When content is below the cap, the component keeps its natural content height (no forced minimum height).
- The `ComparisonTable` header row remains visible (sticky) at the top of its scrollable area.
- Cap recomputes dynamically when the viewport is resized.

### Excluded
- `ColumnSelector` (no max-height rule applied).
- Mobile / stacked single-column layout (rule does not apply below the desktop breakpoint).
- Horizontal overflow, column truncation, or any change to column widths.
- Any change to filter logic, sort logic, or the filter/column inventory.
- Page-level scroll behavior (no scroll snapping, no scroll lock).
- Scrollbar visual styling (left to design defaults).

---

## 5. Constraints

### Business constraints
- Side-by-side filter ↔ table workflow must remain intact on desktop.
- Behavior must scale gracefully when the dataset grows toward 150–200 wheels.

### Known technical constraints
- The Navbar is the sticky header at the top of the page (per `domain-vocabulary.md` — "Navbar surface"). Its rendered height is the reference subtracted from the viewport height.
- The desktop breakpoint is the existing `MiniComparator` breakpoint where layout switches from stacked to side-by-side; no new breakpoint is introduced.

### Regulatory / security constraints
- None.

---

## 6. Use Cases

### Nominal case
As a cyclist comparing many wheels,
I want to scroll the filter list and the wheel table independently while keeping both panels visible,
So that I can adjust a filter and immediately see its effect on the list without losing my place.

### Alternative cases
- Small content: with few filters active and a short wheel list, both panels fit under the cap; no internal scroll appears, panels show their natural height.
- Viewport resize: the user resizes the browser window or opens devtools; the cap recomputes and the internal scroll activates or deactivates accordingly.
- Mobile: on small screens, panels stack vertically and the rule does not apply; the page scrolls as usual.

### Known error cases
- None specific to this evolution.

---

## 7. Acceptance Criteria

- [ ] On desktop, `FilterPanel`'s rendered height never exceeds `viewport height − Navbar height − 12 px`.
- [ ] On desktop, `ComparisonTable`'s rendered height never exceeds `viewport height − Navbar height − 12 px`.
- [ ] When `FilterPanel` content exceeds the cap, only its internal content scrolls; the rest of the page is unaffected by this overflow.
- [ ] When `ComparisonTable` content exceeds the cap, only its internal content scrolls; the rest of the page is unaffected by this overflow.
- [ ] When content fits below the cap, the panel renders at its natural content height (no forced minimum, no empty space added).
- [ ] The `ComparisonTable` header row remains visible at the top of the scrollable area while rows scroll beneath it.
- [ ] On mobile (below the existing desktop breakpoint), the cap is not applied and the page scrolls normally.
- [ ] When the viewport height changes (resize, devtools open/close), the cap recomputes and the internal scroll updates accordingly within a frame or two.

---

## 8. Open Questions

- Visual styling of the internal scrollbar (always visible vs on hover) — deferred to PRD or design polish.
- Behavior of any sticky sub-headers inside `FilterPanel` (e.g., category labels) — not in scope here; default to non-sticky.

---

## 9. Assumptions

- The Navbar remains sticky at the top of the viewport (current behavior).
- "Desktop" refers to the existing breakpoint at which `MiniComparator` switches to side-by-side layout; no new breakpoint is introduced by this evolution.
- The 12 px margin applies between the bottom of the Navbar and the top of each capped panel; no additional bottom margin is required by this rule.
