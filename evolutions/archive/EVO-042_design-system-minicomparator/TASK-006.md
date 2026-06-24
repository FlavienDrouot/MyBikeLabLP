# TASK-006 — Migrate ComparisonTable.jsx to design system tokens

## Objective

Replace all legacy styling in `ComparisonTable.jsx` with design system token classes. This covers: outer wrapper surface and border, table header row surface and border, column header `<th>` typography, numeric cell `font-mono` application, row hover tint, sort indicator, and the mobile filter-open button. No change to layout logic, column width measurement, expand/collapse behavior, scroll container structure, or Redux selectors.

## Required context

**File location:** `frontend/src/components/MiniComparator/ComparisonTable.jsx`

**Design system references:**
- `design-system/ui_kits/comparator/comparator.css` — `.table-wrap`, `.cmp-table thead`, `.cmp-table th`, `.cmp-table th.sorted`, `.cmp-table th.sorted::after`, `.cmp-table td.num`, `.cmp-table tr:hover td`
- `design-system/colors_and_type.css` — `.t-label` definition

**Token mappings:**

| Element | Old class | New class |
|---|---|---|
| Outer wrapper | `card overflow-hidden` | `bg-paper-0 border border-ink-10 overflow-hidden` |
| thead | (implicit from `bg-paper-2` on th) | `bg-paper-1` on `<thead>` |
| `<th>` sticky background | `bg-paper-2` | `bg-paper-1` |
| `<th>` typography | `text-xs font-medium uppercase tracking-widest text-ink-7` | `text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-7` |
| sorted `<th>` | (not implemented — see below) | add `text-ink-12` class when column is sorted |
| numeric `<td>` | handled by `cellClassFor()` in `columnCells.js` | verify that numeric column cells include `font-mono tabular-nums text-right` |
| Row hover | `hover:bg-paper-2` | `hover:bg-brass-1` |
| Mobile filter button | already token-correct | no change needed |

**Sort indicator:** The current implementation has no sort indicator on the active column header. The design system specifies `th.sorted { color: var(--ink-12) }` and `th.sorted::after { content: ' ↓'; color: var(--brass-8) }`. The sort column is determined by `s.filters.sortBy` from Redux. The implementation must add a sorted state to `<th>` elements. The sort indicator `↓` is appended as a `<span>` inside the `<th>` (since Tailwind cannot target `::after` pseudo-elements), conditionally rendered when the column matches the active sort.

**Sort column detection:** The `sortBy` value in Redux is a sort id like `weight_asc` or `price_desc`. The property id from the column registry (e.g., `weight`, `price`) must be extracted and compared against the column's `p.id`. Read `frontend/src/config/wheelProperties.jsx` to understand the `getAllSorts()` return shape and how sort ids map to property ids. Typically `sortBy.startsWith(p.id + '_')` or similar — confirm by reading the file.

**`cellClassFor` function:** The `cellClassFor(p)` function in `./columnCells` returns className strings for `<td>` elements. Read this file to verify whether numeric columns already receive `font-mono` and `tabular-nums`. If not, the numeric column `<td>` className must be augmented in `ComparisonTable.jsx` or `columnCells.js`. Do not change `columnCells.js` if it would affect behavior; add the classes inline in the `<td>` render if necessary.

**`<hr className="rule" />` separator:** This is already token-correct (`rule` class uses `var(--rule-default)`). Untouched.

**PRD reference:** FR-007 (table wrapper), FR-008 (table header), FR-009 (numeric cells), FR-010 (row hover), FR-011 (sort indicator), AC-001 through AC-007, AC-011.

## Potentially impacted files

- `frontend/src/components/MiniComparator/ComparisonTable.jsx` — targeted edits
- `frontend/src/components/MiniComparator/columnCells.js` (or `.jsx`) — read-only unless numeric cell classes must be added there

## Inputs

- `frontend/src/components/MiniComparator/ComparisonTable.jsx` (read before editing)
- `frontend/src/components/MiniComparator/columnCells.js` (or `.jsx`) — read to understand `cellClassFor`
- `frontend/src/config/wheelProperties.jsx` — read to understand sort id to property id mapping
- `design-system/ui_kits/comparator/comparator.css` — reference for table rules
- `design-system/colors_and_type.css` — `.t-label` reference

## Expected outputs

### Outer wrapper `<div>`

Replace:
```jsx
className="card overflow-hidden w-fit max-w-full lg:flex lg:flex-col lg:max-h-[calc(100vh-var(--navbar-height)-12px)] lg:overflow-hidden snap-start"
```
With:
```jsx
className="bg-paper-0 border border-ink-10 overflow-hidden w-fit max-w-full lg:flex lg:flex-col lg:max-h-[calc(100vh-var(--navbar-height)-12px)] lg:overflow-hidden snap-start"
```

### `<thead>` element

Add `className="bg-paper-1"`:
```jsx
<thead className="bg-paper-1 text-ink-7">
```

### `<th>` elements (column headers)

Replace:
```jsx
className="px-4 py-3 text-xs font-medium uppercase tracking-widest text-ink-7 sticky top-0 z-10 bg-paper-2"
```
With:
```jsx
className={`px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] sticky top-0 z-10 bg-paper-1 border-b border-ink-10 ${
  isSortedColumn(p) ? 'text-ink-12' : 'text-ink-7'
}`}
```

The empty trailing `<th>` (actions column):
```jsx
<th className="px-4 py-3 w-10 sticky top-0 z-10 bg-paper-1 border-b border-ink-10" />
```

### Sort column detection

Add a `sortBy` selector near the top of the component:
```jsx
const sortBy = useSelector((s) => s.filters.sortBy);
```

Define a helper inside the component:
```jsx
const isSortedColumn = (p) => sortBy && sortBy.startsWith(p.id + '_');
```
Verify this pattern against `getAllSorts()` output in `wheelProperties.jsx`. If the sort id pattern is different (e.g., `weight` rather than `weight_asc`), adapt accordingly.

### Sort indicator `<span>` inside `<th>`

Inside the sorted `<th>`, after `{t(p.label)}`, add:
```jsx
{isSortedColumn(p) && (
  <span className="text-brass-8 ml-1" aria-hidden="true">↓</span>
)}
```

### Row hover tint

Replace `hover:bg-paper-2` on the `<tr>` with `hover:bg-brass-1`:
```jsx
className="hover:bg-brass-1 cursor-pointer"
style={{ transition: 'background-color var(--duration-quick) var(--ease-standard)' }}
```
The existing inline `style` transition is preserved as-is.

### Numeric cells

Read `cellClassFor(p)` in `columnCells.js`. If numeric columns already include `font-mono` and `tabular-nums`, no change needed. If not, numeric `<td>` elements must add `font-mono tabular-nums text-right` — do this by augmenting the className inline:
```jsx
<td key={p.id} className={`${cellClassFor(p)} ${p.column?.numeric ? 'font-mono tabular-nums text-right' : ''} whitespace-nowrap overflow-hidden text-ellipsis`}>
```
Confirm whether `p.column?.numeric` (or equivalent property flag) exists in the registry. If the flag name differs, read `wheelProperties.jsx` to find the correct one.

### Table bar toolbar heading

Current: `text-base font-semibold text-ink-11` — already token-correct, no change.

### Mobile filter button

Current: already uses `border-ink-4`, `bg-paper-0`, `rounded-xs`, `hover:border-brass-8`, `hover:text-brass-8` — already token-correct, no change.

## Constraints

- Column width measurement logic (`MeasuringTable`, `setColWidths`, `colWidths`, `getColWidth`, `widthsReady`, `totalWidth`) is untouched
- Expand/collapse `expandedId` state and `WheelDetailPanel` row are untouched
- `selectFilteredWheels` selector and `wheels.length` count are untouched
- `FreehubCell`, `renderCellFor`, `cellClassFor` imports are untouched
- `scrollRef`, `panelRef`, `setPanelRef`, `ResizeObserver` logic — untouched
- `<colgroup>` and `<col>` width-fixing logic is untouched
- The inline `style` transition on `<tr>` is preserved
- `ColumnSelector` import and usage is untouched (TASK-004 handles ColumnSelector separately)
- `FilterChips` import added in this task (or already present from TASK-005)
- `<hr className="rule" />` is untouched

## Dependencies

TASK-003 (badges.jsx), TASK-004 (ColumnSelector.jsx), TASK-005 (FilterChips.jsx — must exist and be importable)

## Validation criteria

- [ ] Outer wrapper uses `paper-0` background, `1px solid ink-10` border, no shadow (FR-007)
- [ ] `<thead>` background resolves to `paper-1` (AC-011)
- [ ] `<th>` elements render all-caps, 10px, `0.16em` tracking (AC-009, FR-008)
- [ ] `<th>` bottom border resolves to `1px solid ink-10` (AC-011)
- [ ] Sorted column header text shifts to `ink-12` (FR-011)
- [ ] Sort indicator `↓` renders in `brass-8` on the sorted column (AC-007)
- [ ] Row hover applies `brass-1` background tint; text color does not change (AC-006, FR-010)
- [ ] Numeric cells (`<td>`) render in JetBrains Mono with `tabular-nums` (AC-001, FR-009)
- [ ] FilterChips chip row renders above the table when filters are active
- [ ] No hardcoded hex values in `ComparisonTable.jsx`
- [ ] Redux sort state behavior is unchanged (AC-013)

## Tests to implement

### Unit
- Static scan: `grep -n '#[0-9a-fA-F]' ComparisonTable.jsx` returns zero matches

### Integration
- Inspect computed `background` on `<thead>` row: resolves to `--paper-1`
- Inspect computed `border-bottom` on any `<th>`: resolves to `1px solid --ink-10`
- Sort by weight; inspect the weight `<th>`: text color resolves to `--ink-12`; `↓` span color resolves to `--brass-8` (AC-007)
- Hover a table row; inspect computed `background-color` on a `<td>`: resolves to `--brass-1`; text `color` is unchanged (AC-006)
- Inspect a numeric `<td>`: `font-family` includes JetBrains Mono; `font-variant-numeric` is `tabular-nums` (AC-001)
- Verify Redux DevTools: sort, filter, and column visibility actions have identical structure to pre-migration (AC-013)
