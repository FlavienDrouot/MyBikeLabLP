# Spec Notes — EVO-026

## PRD interpretations

### Toolbar definition
The PRD says "the separate toolbar component that previously contained the action buttons must be removed" (FR-008). In the actual codebase there is no dedicated toolbar component — the controls are inline JSX blocks inside `MiniComparator.jsx` (one for desktop ColumnSelector above the table, one for the mobile Filters trigger, one for mobile ColumnSelector below the table). The "toolbar" is treated as these three JSX blocks and their associated grid row constraint (`lg:grid-rows-[auto_1fr]`). All three blocks and the grid row are the full scope of FR-008.

### Desktop filter access
The PRD states: "On desktop: the 'Columns' button only." (§3). The desktop filter panel (visible as a sidebar on desktop via the lg:grid) is already present and accessible on desktop — it is not a button that appears in the header. The PRD is not removing desktop filter access; it is only removing a mobile-targeted Filters button from appearing on desktop. This interpretation is consistent with FR-004 ("Filters button mobile only") and UC-001 (no mention of a Filters button on desktop).

### "Header row" boundary
The PRD refers to "the table's first row" and "the header row". In the current implementation, this corresponds to the `<div className="flex items-center justify-between px-5 py-4">` block inside `ComparisonTable` — the card header above the `<hr>` separator and the table itself. The action buttons go into this div, not into the `<thead>` of the HTML table.

### filtersOpen prop direction
The PRD says "the Filters button must open the filter panel exactly as it did before" (FR-006). The filter drawer's open/close state (`filtersOpen`, `setFiltersOpen`) lives in `MiniComparator`. The Filters button moves into `ComparisonTable`, which now needs `onOpenFilters` callback and `filtersOpen` value for `aria-expanded`. Passing these two props is the minimal change — no state lift, no context API needed.

---

## Architecture decision rationale

### AD-001 — Why ColumnSelector renders inside ComparisonTable
The header row belongs to `ComparisonTable`. Placing the `ColumnSelector` there is the most direct path: the header `<div>` already uses `justify-between`, so adding a right-side container is a one-line structural change. The alternative (keeping `ColumnSelector` in `MiniComparator` and absolutely positioning it over the table header) would create fragile cross-component positioning.

### AD-002 — Why the grid loses its row axis
The `lg:grid-rows-[auto_1fr]` only existed to create a space above the table for the ColumnSelector button. Once that button is inside the table card, the top row of the grid is empty and the `row-start` constraints on the sidebar and table become meaningless. Leaving them in would be dead code (AC-007 fails).

### AD-003 — Why Tailwind `lg:hidden` instead of JS media query
`lg:hidden` is already used for the same pattern in the current `MiniComparator`. Consistency is the primary reason. No runtime JavaScript needed for a static layout rule.

---

## Tradeoffs

### Two tasks vs. one task
The work could be done as a single task touching both files at once. It is split into two because:
- TASK-001 (adding props to `ComparisonTable`) is independently testable: you can render `ComparisonTable` with mock props and verify the header visually before touching `MiniComparator`.
- TASK-002 (restructuring `MiniComparator`) depends on the new prop signature being stable — doing it after TASK-001 avoids moving targets.
- If a review requires changes to the prop design, only TASK-001 needs revision.

### Not introducing a new ComparatorHeader component
A new component was considered to isolate the header row logic. Rejected because: the header row has no independent state, its only content is a heading and two buttons, and splitting it out adds a file boundary with no reuse benefit. The two existing components are the right granularity.

---

## Open questions

### OQ-001 — ColumnSelector popover clipping on narrow viewports
`ColumnSelector` uses `absolute right-0` positioning for its dropdown. On very narrow mobile widths, `right-0` anchors to the right edge of the button, and the 16rem (`w-64`) panel may overflow the viewport left edge. This risk existed before this evolution (the mobile ColumnSelector was already present). No change to `ColumnSelector` is in scope. Worth a manual check on a 375px viewport after implementation.

### OQ-002 — FilterPanel sticky top offset after grid simplification
`FilterPanel` has `lg:sticky` with `top: var(--navbar-height)`. After removing `lg:grid-rows-[auto_1fr]`, the grid becomes a single-row layout. Verify that the sticky behavior of the FilterPanel sidebar is not affected by the new grid structure on a desktop viewport with a long filter list.

### OQ-003 — py-4 vs py-3 in the header row
The header row currently uses `px-5 py-4`. The ColumnSelector trigger button uses `py-2` and the Filters button uses `py-2`. The combined row height will be driven by the buttons' height (approximately 36px) plus the `py-4` padding (32px total vertical padding). No layout change is required, but the visual result should be confirmed to feel proportional once both buttons sit next to the heading text.
