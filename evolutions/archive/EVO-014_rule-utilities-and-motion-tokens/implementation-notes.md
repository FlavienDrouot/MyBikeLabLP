# Implementation Notes — EVO-014

## Summary

All 7 tasks implemented in a single session. 7 files modified. No new files, no new dependencies.

---

## TASK-001 — `frontend/src/index.css`

Removed `transition-colors` from the `@apply` directive in `.btn-primary`, `.btn-ghost`, `.btn-outline`. Added explicit `transition` declaration in each class using `var(--duration-quick)` and `var(--ease-standard)`. The `transition-property` scope (color, background-color, border-color) is preserved.

---

## TASK-002 — `frontend/src/components/Navbar.jsx`

Removed `transition-colors` from the mobile hamburger `<button>` className. Added `style={{ transition: 'color var(--duration-quick) var(--ease-standard)' }}` prop. Navbar links and Contact button inherit the fix from TASK-001 via `btn-ghost` / `btn-primary` classes.

---

## TASK-003 — `frontend/src/components/Footer.jsx`

Removed `border-t border-ink-10` from the `<footer>` element. Inserted `<hr className="rule rule-strong" />` as the first child of `<footer>`, before the `container-page` div, to ensure full-width rendering. `.rule` resets browser `<hr>` default border; `.rule-strong` sets the DS color.

---

## TASK-004 — `frontend/src/components/RoadmapSection.jsx`

Inserted `<hr className="rule mt-8" />` between the closing `</div>` of the `text-center max-w-2xl mx-auto` header block and the `mt-12 grid` div. Placed inside the `container-page` div.

---

## TASK-005 — `frontend/src/components/MiniComparator/ComparisonTable.jsx`

Three changes:
1. Removed `border-b border-ink-3` from the table header container `<div>`. Inserted `<hr className="rule" />` after the closing `</div>` of that header block (before the `wheels.length === 0` conditional).
2. Removed `divide-y divide-ink-3` from `<tbody>`.
3. Removed `transition-colors` from the data `<tr>` className. Added `style={{ borderBottom: '1px solid var(--rule-faint)', transition: 'background-color var(--duration-quick) var(--ease-standard)' }}`. The expansion `<tr>` (WheelDetailPanel host) was left without a bottom border as specified.

---

## TASK-006 — `frontend/src/config/wheelProperties.jsx`

Updated the `price` property's `renderCell` to return a JSX fragment with a price `<span>` and an annotation `<span className="t-annotation block">`. Guarded by `w.prices?.length > 0`; returns `null` for wheels with no price data.

---

## TASK-007 — `frontend/src/components/MiniComparator/WheelDetailPanel.jsx`

Added annotation sub-text at both price display sites:
- **Manufacturer**: wrapped price span and annotation in `<span className="flex flex-col items-end">` inside the existing `flex items-center gap-3 flex-shrink-0` parent. Guard inherited from existing `manufacturer.price_eur != null` conditional.
- **Retailers**: same wrapper pattern for each retailer row's price span. Annotation always rendered (all retailer entries in current data have non-null `price_eur`).

---

## Risks resolved

- `--rule-faint` confirmed defined in `design-tokens.css` before implementing TASK-005.
- `.rule` class resets `<hr>` browser default border before `.rule-strong` applies DS color — class order `rule rule-strong` is intentional.

---

## Manual validation checklist

- [ ] Hover `.btn-primary`, `.btn-ghost`, `.btn-outline` — confirm 140ms transitions
- [ ] Hover Navbar hamburger icon (mobile viewport) — confirm color transition
- [ ] Inspect footer separator in devtools — `<hr class="rule rule-strong">`, `border-top` from `--rule-strong`
- [ ] Inspect RoadmapSection — `<hr class="rule mt-8">` between header and grid
- [ ] Inspect ComparisonTable header/tbody — no `border-ink-*` on header container or tbody; row `<tr>` has `borderBottom: var(--rule-faint)` and `transition: background-color 140ms`
- [ ] Row hover background change visible
- [ ] Expand/collapse row works, chevron transition unchanged
- [ ] Price column shows annotation for all rows with prices; no annotation for wheels without price data
- [ ] WheelDetailPanel shows annotation below manufacturer price (when not null) and below each retailer price
- [ ] Panel does not overflow `max-h-[140px]` for wheels with multiple retailers
- [ ] Full-page non-regression: filters, sort, column visibility, Navbar links
