# Implementation Notes — EVO-036

## TASK-001 — Locale label rename

Updated `properties.freehubOptions.label` in all three locale files. In `en.json` the value changed from `"Freehub"` to `"Freehub options"`. In `fr.json` it changed from `"Corps de roue libre"` to `"Options de corps de roue libre"`. In `xx.json` the value was set to `"Freehub options"` to match EN convention. No other keys were touched.

## TASK-002 — Max-width in registry

Added `max-w-[160px]` to the `cellClassName` of the `freehubOptions` column spec in `wheelProperties.jsx`. The `cellClassName` string was updated from `'px-4 py-3 text-ink-11'` to `'px-4 py-3 text-ink-11 max-w-[160px]'`. Combined with the `whitespace-nowrap overflow-hidden text-ellipsis` classes already applied globally to all `<td>` elements in `ComparisonTable.jsx`, this cap ensures the freehub options column never exceeds 160 px and truncates overflowing content with an ellipsis.

## TASK-003 — FreehubPopup component

Created `FreehubPopup.jsx` at `src/components/MiniComparator/`. Presentational component: accepts `options` (string array), `onClose` (optional), and `t` (i18n function). Renders a `role="dialog"` overlay with `absolute z-20 top-full mt-1` positioning, a title using `text-xs text-ink-7 uppercase tracking-widest`, a scrollable option list (`max-h-[200px] overflow-y-auto divide-y divide-ink-2`), and a `transition-opacity duration-150` entry fade. The `popupTitle` i18n key was added to all three locale files.

## TASK-004 — FreehubCell component

Created `FreehubCell.jsx` at `src/components/MiniComparator/`. Derives `displayText` from `wheel.hub?.freehub_options`, renders the text in a `<span ref={textRef}>` with `overflow-hidden text-ellipsis`. Truncation detection runs via `useEffect` comparing `scrollWidth > clientWidth`. When truncated: container gains `cursor-pointer` and hover colour shift (behind `(hover: hover) and (pointer: fine)` media query), text gains a dotted underline in `text-brass-8`. Click calls `e.stopPropagation()` and toggles `FreehubPopup`. Outside-click dismissal uses `document` `mousedown`/`touchstart` listener, cleaned up when popup closes. Non-truncated cells have no click handler and do not suppress row propagation. Keyboard accessible with `role="button"` and `tabIndex={0}` when truncated.

## TASK-005 — Integration into ComparisonTable

Two targeted changes in `ComparisonTable.jsx`: (1) `FreehubCell` import added; (2) the `cols.map` callback in the `<tbody>` row loop gained a conditional branch — when `p.id === 'freehubOptions'`, the cell renders `<FreehubCell wheel={w} t={t} />` inside the existing `<td>` (which retains `cellClassFor(p)` and `whitespace-nowrap overflow-hidden text-ellipsis`); all other columns continue through the unchanged `renderCellFor` path. In `wheelProperties.jsx`, the `renderCell` override on `freehubOptions` was removed as it is superseded by `FreehubCell`. `MeasuringTable` required no changes — it already picks up `max-w-[160px]` via `cellClassFor(p)`.
