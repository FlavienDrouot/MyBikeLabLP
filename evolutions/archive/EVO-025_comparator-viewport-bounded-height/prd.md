# PRD — Product Requirements Document

## 1. General Information

- Evolution ID: EVO-025
- Title: Comparator viewport-bounded height
- Author: Flavien Drouot
- Date: 2026-05-29
- Version: 1.0
- Needs Assessment reference: `MyBikeLab/evolutions/EVO-025_comparator-viewport-bounded-height/needs-assessment.md`

---

## 2. Functional Objective

After this evolution, the `MiniComparator` section preserves its side-by-side workbench experience on desktop, regardless of how much content `FilterPanel` or `ComparisonTable` contains. Each panel is bounded by the available viewport height, scrolls its own content internally when it overflows, and stays simultaneously visible with the other panel without forcing the user to scroll the whole page to operate one of them.

---

## 3. Target Behavior

### General description

On desktop, both panels of the `MiniComparator` (`FilterPanel` and `ComparisonTable`) are vertically bounded by the available viewport. The available viewport is the visible window height minus the Navbar height minus a 12 px margin. As long as a panel's content fits within this bound, the panel keeps its natural content height and no internal scrollbar appears. When the content exceeds this bound, the panel content scrolls internally, independently of the other panel and of the page.

The two panels scroll independently: scrolling inside one panel never moves the other panel or the page. The `ComparisonTable` header row stays anchored at the top of its scrollable area so column meaning remains visible while rows scroll beneath it.

The bound is reactive: any change to the viewport height (window resize, devtools opening/closing, browser chrome resizing) recomputes the bound and turns the internal scroll on or off accordingly.

The rule applies only on desktop, i.e. at the existing `MiniComparator` breakpoint where the layout is side-by-side. Below that breakpoint, panels stack vertically and behave as today: the page scrolls normally and no height cap is applied. The `ColumnSelector` is unaffected by the rule on any breakpoint.

---

## 4. Functional Rules

### FR-001 — Viewport-bounded panel height on desktop
On desktop, the maximum rendered height of `FilterPanel` and the maximum rendered height of `ComparisonTable` are each capped to:

`cap = viewport height − Navbar height − 12 px`

This cap applies independently to each of the two panels.

### FR-002 — Natural content height when below cap
When a panel's natural content height is less than or equal to `cap`, the panel renders at its natural content height. No forced minimum is applied; no empty space is added inside the panel to fill the cap.

### FR-003 — Internal scroll on overflow
When a panel's natural content height exceeds `cap`, the panel renders at exactly `cap` and its content becomes scrollable inside the panel. Only the panel's internal content scrolls; the page does not scroll as a result of this overflow.

### FR-004 — Independent scrolling per panel
The `FilterPanel` scroll and the `ComparisonTable` scroll are independent. Scrolling inside one panel must not move the scroll position of the other panel, and must not move the page scroll.

### FR-005 — Sticky table header
The `ComparisonTable` header row stays visible at the top of the scrollable area while rows scroll beneath it. The header does not scroll out of view as long as any row of the table is rendered below it.

### FR-006 — Reactive recompute on viewport change
The cap is recomputed when the viewport height changes (window resize, devtools opening/closing, browser chrome resizing). The panel heights and the activation state of the internal scroll update accordingly without requiring user action such as page reload.

### FR-007 — Desktop scope only
FR-001 to FR-006 apply only on desktop, defined as the existing `MiniComparator` breakpoint at which the layout switches from stacked to side-by-side. Below that breakpoint, no height cap is applied: panels render at their natural content height and the page scrolls as today.

### FR-008 — `ColumnSelector` exclusion
The `ColumnSelector` is not subject to any of the rules above. Its height behavior is unchanged on every breakpoint.

---

## 5. Detailed Use Cases

### UC-001 — Browsing a large filtered list with both panels visible

#### Preconditions
- The user is on the Landing page on a desktop-sized viewport.
- The `MiniComparator` is rendered in side-by-side layout.
- The dataset contains enough wheels that the unfiltered `ComparisonTable` would otherwise be taller than the available viewport.

#### Steps
1. The user scrolls the page down until the `MiniComparator` section is in view.
2. The user looks at `FilterPanel` on one side and `ComparisonTable` on the other.
3. The user scrolls inside `ComparisonTable` to reach a wheel further down the list.
4. The user adjusts a filter in `FilterPanel`.
5. The user reads the updated list in `ComparisonTable`.

#### Expected result
- During step 3, `FilterPanel` stays fully visible and at its current scroll position; the page does not scroll.
- During step 4, the table updates without losing the user's reading position relative to the filter being adjusted; both panels remain side by side.
- At step 5, the `ComparisonTable` header row is still visible at the top of the table, even though the user previously scrolled rows.

#### Error cases
- None.

### UC-002 — Few filters and a short list

#### Preconditions
- The user is on the Landing page on a desktop-sized viewport.
- A restrictive set of filters is active so that `ComparisonTable` shows only a few rows.
- `FilterPanel` content also fits within the available viewport.

#### Steps
1. The user views the `MiniComparator`.

#### Expected result
- Neither panel shows an internal scrollbar.
- Each panel is rendered at its natural content height (no forced minimum, no empty padding to reach the cap).

#### Error cases
- None.

### UC-003 — Viewport resize

#### Preconditions
- The user is on the Landing page on a desktop-sized viewport.
- The `MiniComparator` is rendered in side-by-side layout.
- At least one of the two panels currently exceeds the cap and shows an internal scrollbar.

#### Steps
1. The user resizes the browser window vertically (or opens/closes devtools, changing the viewport height).

#### Expected result
- The cap is recomputed using the new viewport height.
- The internal scroll activates or deactivates on each panel according to whether its content still exceeds the new cap.
- No user action (such as reload) is required for the new behavior to take effect.

#### Error cases
- None.

### UC-004 — Mobile / stacked layout

#### Preconditions
- The user is on the Landing page on a viewport below the desktop breakpoint.
- The `MiniComparator` is rendered in stacked layout.

#### Steps
1. The user scrolls the page through the `MiniComparator` section.

#### Expected result
- No height cap is applied to `FilterPanel` or `ComparisonTable`.
- No internal scroll is introduced on either panel.
- The page scrolls normally as today.

#### Error cases
- None.

---

## 6. Acceptance Criteria

### AC-001
#### Description
On desktop, the rendered height of `FilterPanel` never exceeds `viewport height − Navbar height − 12 px`.

#### Expected verification
With a content set large enough to exceed the available viewport, measure `FilterPanel`'s rendered height and confirm it is less than or equal to `viewport height − Navbar height − 12 px`.

#### Type
- Automated

### AC-002
#### Description
On desktop, the rendered height of `ComparisonTable` never exceeds `viewport height − Navbar height − 12 px`.

#### Expected verification
With a dataset large enough to exceed the available viewport, measure `ComparisonTable`'s rendered height and confirm it is less than or equal to `viewport height − Navbar height − 12 px`.

#### Type
- Automated

### AC-003
#### Description
When `FilterPanel` content exceeds the cap, only its internal content scrolls; the rest of the page scroll position is unchanged by that overflow.

#### Expected verification
Scroll inside `FilterPanel` and observe that the page scroll position and `ComparisonTable` scroll position remain unchanged.

#### Type
- Automated

### AC-004
#### Description
When `ComparisonTable` content exceeds the cap, only its internal content scrolls; the rest of the page scroll position is unchanged by that overflow.

#### Expected verification
Scroll inside `ComparisonTable` and observe that the page scroll position and `FilterPanel` scroll position remain unchanged.

#### Type
- Automated

### AC-005
#### Description
When content fits below the cap, the panel renders at its natural content height (no forced minimum height, no empty space added inside the panel).

#### Expected verification
With a short content set, measure each panel's rendered height and confirm it equals the panel's natural content height and is strictly less than the cap.

#### Type
- Automated

### AC-006
#### Description
The `ComparisonTable` header row remains visible at the top of the scrollable area while rows scroll beneath it.

#### Expected verification
Scroll rows inside `ComparisonTable` and confirm the header row is still rendered at the top of the table, with the rows scrolling underneath it.

#### Type
- Automated

### AC-007
#### Description
On mobile (below the existing desktop breakpoint), the cap is not applied and the page scrolls normally.

#### Expected verification
With a viewport below the desktop breakpoint, confirm neither panel has an internal scrollbar and the page scroll is the only scroll affecting the section.

#### Type
- Automated

### AC-008
#### Description
When the viewport height changes (window resize, devtools open/close), the cap recomputes and the internal scroll updates accordingly within a frame or two, without page reload.

#### Expected verification
Trigger a viewport height change and confirm both panels' rendered heights and scroll states update to reflect the new cap.

#### Type
- Manual

### AC-009
#### Description
The `ColumnSelector` is not affected by the viewport-bounded height rule on any breakpoint.

#### Expected verification
Inspect the `ColumnSelector` on desktop and mobile and confirm no max-height cap or internal scroll is applied as a result of this evolution.

#### Type
- Manual

---

## 7. Functional Impacts

### Impacted components
- `MiniComparator` — host of the side-by-side layout; responsible for the desktop-only application of the rule.
- `FilterPanel` — receives a viewport-bounded max height and an internal scroll on overflow.
- `ComparisonTable` — receives a viewport-bounded max height, an internal scroll on overflow, and a sticky header row.
- Navbar — its rendered height is the reference value subtracted from the viewport height; no change to its own behavior is required by this evolution.

### Impacted data
- None. No change to wheel data, filter state, sort state, or column visibility state.

### Impacted APIs
- None. The MVP is frontend-only and no API surface is touched by this evolution.

### Impacted permissions / roles
- None.

---

## 8. Out of Scope

- `ColumnSelector` height behavior (explicitly excluded by the Needs Assessment).
- Mobile / stacked single-column layout (rule does not apply below the desktop breakpoint).
- Horizontal overflow, column truncation, and any change to column widths.
- Any change to filter logic, sort logic, or the filter / column inventory.
- Page-level scroll behavior (no scroll snapping, no scroll lock, no page-level scroll intercept).
- Scrollbar visual styling (left to design defaults; not a deliverable of this evolution).
- Sticky sub-headers inside `FilterPanel` (e.g., category labels) — default to non-sticky.

---

## 9. Constraints

- Side-by-side filter ↔ table workflow must remain intact on desktop.
- Behavior must scale gracefully as the dataset grows toward 150–200 wheels (Phase A data acquisition).
- The Navbar is the sticky header at the top of the page (per `domain-vocabulary.md` — "Navbar surface"); its rendered height is the reference subtracted from the viewport height to compute the cap.
- The desktop breakpoint is the existing `MiniComparator` breakpoint where the layout switches from stacked to side-by-side; no new breakpoint is introduced by this evolution.
- The 12 px margin sits between the bottom of the Navbar and the top of each capped panel; no additional bottom margin is mandated by this rule.
- All documents in English.

---

## 10. Test Plan

### Automated tests expected
- Render `MiniComparator` on a desktop-sized viewport with a content set known to exceed the available viewport; assert each panel's rendered height is less than or equal to the cap (AC-001, AC-002).
- Render `MiniComparator` on a desktop-sized viewport with a short content set; assert each panel renders at its natural content height and is strictly below the cap (AC-005).
- Scroll inside `FilterPanel`; assert page scroll and `ComparisonTable` scroll are unchanged (AC-003).
- Scroll inside `ComparisonTable`; assert page scroll and `FilterPanel` scroll are unchanged (AC-004).
- Scroll rows inside `ComparisonTable`; assert the header row remains rendered at the top of the table (AC-006).
- Render `MiniComparator` on a viewport below the desktop breakpoint; assert no cap and no internal scroll on either panel (AC-007).

### Manual tests expected
- On desktop, resize the browser window vertically and confirm the cap recomputes and internal scroll activates / deactivates accordingly (AC-008).
- On desktop, open and close devtools and confirm the same recompute behavior (AC-008).
- On desktop and mobile, confirm the `ColumnSelector` is not capped and shows no new internal scroll (AC-009).
- On desktop, verify visually that both panels stay side by side and simultaneously usable while the user filters and scrolls a large list (UC-001).

### Edge cases
- Very short viewport (e.g., a small laptop in landscape with devtools open): the cap is small but the rule still applies; panels remain side by side and scroll internally.
- Very tall viewport (large external monitor): the cap is large; panels likely render at natural content height with no internal scroll.
- `FilterPanel` and `ComparisonTable` overflowing simultaneously: each must scroll independently without coupling.
- Filter change that suddenly shrinks `ComparisonTable` from overflowing to fitting: the internal scroll on `ComparisonTable` disappears, the panel returns to its natural content height, and `FilterPanel`'s state is not affected.
- Filter change that suddenly grows `ComparisonTable` from fitting to overflowing: the cap activates, the internal scroll appears, and `FilterPanel`'s state is not affected.

### Non-regression
- Filter logic, sort logic, and the filter / column inventory behave exactly as before.
- Column visibility (managed by `ColumnSelector`) behaves exactly as before.
- Column widths and horizontal layout of `ComparisonTable` are unchanged.
- Page-level scroll behavior outside the `MiniComparator` is unchanged (no scroll lock, no scroll snapping).
- Navbar appearance and stickiness are unchanged.
- Behavior on viewports below the desktop breakpoint is unchanged.
