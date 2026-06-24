# Spec Notes — EVO-036

## PRD interpretations

### Max-width value (PRD section 9: "determined during technical specification phase")

The PRD explicitly deferred the max-width value to the tech spec phase. Chosen value: **160 px** (`max-w-[160px]`).

Rationale: reviewed observed freehub option strings in the dataset. Short values ("XDR", "HG", "Micro Spline") fit comfortably. Two options joined with ' / ' (e.g. "XDR / HG") fit within ~120 px at the default font size. Three or more options trigger truncation at 160 px, which is the intended UX. Values below 128 px would truncate single options for longer standard names; values above 200 px reduce the benefit of the constraint on wide datasets.

### Visual affordance for truncated cells (PRD FR-003 says "ellipsis or similar indicator")

The PRD specifies an ellipsis as the truncation indicator. The spec adds a secondary affordance (dotted underline + `text-brass-8` on hover) to signal interactivity, since an ellipsis alone does not communicate "this is clickable." This is a reasonable extension consistent with the project's interaction vocabulary and does not conflict with any PRD rule.

### `renderCell` cleanup in `wheelProperties.jsx` (PRD is silent)

The existing `renderCell` for `freehubOptions` (joins array with ' / ') becomes dead code once `FreehubCell` handles rendering. The spec calls for removing it in TASK-005 to avoid confusion. This is a purely internal cleanup decision with no user-visible impact.

### `xx.json` pseudolocale

The PRD does not mention pseudolocale files. The project has `xx.json` alongside `en.json` and `fr.json`. Tasks 001 and 003 include instructions to update `xx.json` for consistency, following the pattern of how other keys are managed. The agent implementing these tasks must read `xx.json` first to understand its convention before editing.

### Popup position (below the cell)

The PRD does not specify popup position. The spec chooses "always below the triggering cell" (`top-full mt-1`) as the default. Viewport-aware flipping (detecting proximity to bottom edge and flipping to `bottom-full`) is noted as a future concern and explicitly excluded from this evolution. A cell at the last row of the table opens the popup below it; if the popup overflows the viewport, the user can scroll the comparator's vertical scroll region to reach it. This is acceptable for the current scope.

### Close button on popup

The PRD only requires dismissal by clicking/tapping outside (FR-007). The spec does not mandate a close button. `FreehubPopup` accepts an `onClose` prop for future extensibility, but rendering a button is left to the implementing agent's judgment. The validation criteria do not require one.

---

## Architecture decision rationale

### AD-001: Per-cell component rather than state in ComparisonTable

`ComparisonTable` already manages `expandedId` (row detail panel) and `colWidths` (measurement state). Adding per-row popup state (`Map<id, boolean>`) and per-row truncation state would make it significantly harder to read and test. A dedicated `FreehubCell` component is the correct React granularity: local state stays local.

The alternative of lifting state into `ComparisonTable` was considered but rejected because it violates single-responsibility and would require `ComparisonTable` to know about freehub-specific interaction semantics.

### AD-002: Max-width via `cellClassName` in registry, not via a prop or inline style

The project's architecture rule is: "New wheel property = one entry in `wheelProperties.jsx` only (no changes elsewhere)." While this evolution is not adding a new property, the same principle guides where constraints live. The `cellClassName` field is already the canonical place for cell-level CSS; extending it with `max-w-[160px]` is the most coherent approach. It also automatically propagates to `MeasuringTable` because both rendering paths consume `cellClassFor(p)`.

The alternative — a new `maxWidth` field on `ColumnSpec` processed by `ComparisonTable` — would extend the registry's type system for a concern that Tailwind already handles via a class.

### AD-003: `document` listener for outside-click, not a backdrop div

A full-screen `<div>` backdrop with an `onClick` to close is visually simple but adds a DOM element that can intercept touch-scroll events in mobile browsers, causing scroll to feel "sticky" when the popup is open. The `document.mousedown` + `document.touchstart` pattern avoids this entirely and is already established in the codebase (`ColumnSelector.jsx` uses the same approach for its dropdown).

### AD-004: `scrollWidth > clientWidth` for truncation detection

Alternatives considered:
- **Canvas text measurement**: accurate but requires a canvas context, adds complexity, and may differ from actual CSS rendering.
- **Intersection Observer**: not designed for text truncation detection.
- **Character count threshold**: fragile across fonts, zoom levels, and Unicode content.

`scrollWidth > clientWidth` is the standard DOM approach, requires no external libraries, and integrates naturally with React's `useEffect`. The main caveat is that it returns 0 in jsdom (test environment, no layout), but since no automated tests are added for this evolution, this is not a concern.

---

## Tradeoffs

### Why not a CSS `title` tooltip instead of a popup

`title` attributes show a browser-native tooltip on hover, which does not work on touch devices at all. The PRD explicitly requires tap-to-open on mobile (FR-008). `title` is not a viable solution.

### Why not a `<dialog>` element (native modal)

A native `<dialog>` element with `dialog.showModal()` creates a full-screen modal with focus trap. That is excessive for a small contextual popup listing a few strings. A full modal would also visually disrupt the table context. The `role="dialog"` non-modal approach is appropriate here.

### Why stop propagation rather than check event target in the row handler

An alternative to `stopPropagation()` in `FreehubCell` is to check `event.target` in the `<tr>` onClick and skip expand if the click originated from a freehub cell. This would require `ComparisonTable` to know about `FreehubCell`'s internal DOM structure — tight coupling. `stopPropagation()` in the child is the standard, less-coupled approach.

### Why not modify `MeasuringTable` to skip `FreehubCell` rendering

`MeasuringTable` uses `renderCellFor` (the registry's `renderCell` function) to measure natural content widths. It does not need interactive behavior. Adding `FreehubCell` to `MeasuringTable` would be over-engineering. The max-width constraint propagates correctly via `cellClassName` without any change to `MeasuringTable`.

---

## Open questions

### OQ-001 — French translation for "Freehub options"

The current French label is "Corps de roue libre" (body of the freewheel). The new label "Options de corps de roue libre" is longer. Confirm with the product owner whether this phrase is idiomatic and fits the column header at the chosen max-width. An abbreviated alternative ("Options freehub" — freehub being commonly used in French cycling vocabulary) may be preferable. This affects TASK-001 and TASK-003 locale values.

### OQ-002 — Popup position when the triggering cell is near the bottom of the table

For this evolution, the popup always opens below the cell. If the comparator table is short (few wheels) and the last row's popup overflows the card's `max-h` boundary, the popup may be clipped by `overflow: hidden` on the card. The card currently uses `overflow-hidden` on its outer wrapper. An `overflow: visible` override or a portal-based popup would solve this. Deferred to a future evolution; flagging here as a known edge case.

### OQ-003 — Keyboard navigation: should Tab reach individual freehub cells

The spec adds `tabIndex={0}` to truncated cells and handles Enter/Space to open the popup. However, the table rows do not currently participate in tab order (they have `cursor-pointer` but no `tabIndex`). Adding `tabIndex={0}` on freehub cells only creates an inconsistent tab experience where only one cell type in the table is focusable. The implementing agent should note this inconsistency and may choose to set `tabIndex={-1}` (not tab-reachable but still focusable programmatically) on the cell, relying on the existing row click affordance. This is not a blocking question for implementation but should be decided before writing the code.
