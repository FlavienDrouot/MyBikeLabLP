# TASK-002 — Migrate FilterPanel.jsx to design system tokens

## Objective

Replace all legacy styling in `FilterPanel.jsx` with design system token classes. This covers: the panel card surface, panel header separator, filter group axis labels, multi-select chip (`Pill`) states, `FilterToggle` switch, `DualRangeRow` value display, sort select, section headers, and `LargeMultiSelectFilter` selected-tag badges. No change to Redux dispatch logic, selector calls, filter logic, or i18n keys.

## Required context

**File location:** `frontend/src/components/MiniComparator/FilterPanel.jsx`

**CSS module:** `FilterPanel.module.css` is imported as `styles` and used for `.track`, `.range`, `.thumb` classes on the range slider. This import and those three `className` references are untouched.

**Design system references:**
- `design-system/ui_kits/comparator/comparator.css` — `.filter`, `.filter-head`, `.filter-group-head .name`, `.chip`, `.chip.active`, `.tri`, `.tri button`, `.tri button.active`, `.sort-select`
- `design-system/ui_kits/comparator/FilterPrimitives.jsx` — `FilterGroup`, `MultiChips`, `RangeFilter`, `TriState`
- `design-system/colors_and_type.css` — `.t-label` token definition

**Token mappings (Tailwind class → CSS variable):**
- `bg-paper-0` → `var(--paper-0)` — card background
- `bg-paper-1` → `var(--paper-1)` — chip default background, tri-state button background
- `border-ink-4` → `var(--ink-4)` — default border, chip default border
- `border-ink-10` → `var(--ink-10)` — panel header bottom rule
- `border-ink-3` → `var(--ink-3)` — section dividers
- `bg-ink-12` → `var(--ink-12)` — chip active fill, tri-state active fill
- `text-paper-1` → `var(--paper-1)` — chip active text, tri-state active text
- `border-ink-12` → `var(--ink-12)` — chip active border
- `text-ink-9` → `var(--ink-9)` — axis label color (`.t-label`)
- `text-ink-7` → `var(--ink-7)` — axis label alternative, section chevron
- `text-ink-12` → `var(--ink-12)` — panel heading
- `text-brass-8` → `var(--brass-8)` — reset button, hover states
- `font-mono` → `var(--font-mono)` — range value display
- `rounded-full` → `border-radius: 999px` — chip (multi-select pill shape)
- `rounded-xs` → `border-radius: 2px` — inputs, sort select, toggle

**Duration/ease:**
- Transitions on chips/toggle: `transition-colors` with `duration-[140ms]` and custom ease is acceptable via Tailwind; or use the inline `style` already present on other elements using `var(--duration-quick)` and `var(--ease-standard)`.

## Potentially impacted files

- `frontend/src/components/MiniComparator/FilterPanel.jsx` — targeted edits per component below

## Inputs

- `frontend/src/components/MiniComparator/FilterPanel.jsx` (read before editing)
- `design-system/ui_kits/comparator/comparator.css` (reference, already read)
- `design-system/colors_and_type.css` (reference, already read)

## Expected outputs

### FilterPanel `<aside>` (main panel wrapper)

Replace:
```jsx
className="card p-5 lg:p-6 space-y-6 h-fit lg:max-h-[calc(100vh-var(--navbar-height)-12px)] lg:overflow-y-auto filter-panel-scroll"
```
With:
```jsx
className="bg-paper-0 border border-ink-4 p-5 space-y-6 h-fit lg:max-h-[calc(100vh-var(--navbar-height)-12px)] lg:overflow-y-auto filter-panel-scroll"
```
No shadow. No `lg:p-6` padding variant (fixed 20px matches design system).

### Panel header separator

The `<div className="flex items-center justify-between">` wrapping the heading and reset button must gain a bottom border:
```jsx
className="flex items-center justify-between pb-3 border-b border-ink-10"
```
Adds `pb-3` (12px) and `border-b border-ink-10` — matching `comparator.css` `.filter-head` which has `padding-bottom: 14px; border-bottom: 1px solid var(--ink-10)`.

### Panel heading `<h3>`

Replace `text-base font-semibold text-ink-11` with `text-sm font-semibold text-ink-12 tracking-[-0.01em]` — matching `comparator.css` `.filter-head .title` (`font-size: 14px, font-weight: 600, color: var(--ink-12)`).

### Reset button

Current: `text-xs font-medium text-brass-8 hover:text-brass-9`
Keep as-is — already correct token usage. (Design system uses `color: var(--ink-8)` with `hover: ink-12`, but the PRD does not call out this detail and the current brass-8 style is within acceptable system usage for an accent action.)

### `FilterToggle` component

Current active state: `bg-brass-7 justify-end` — this toggle is used as an enable/disable switch, not a primary CTA fill. The design system does not define a toggle switch primitive. Keep `bg-brass-7` as the active fill (brass-7 is the core accent token, appropriate for an on-state indicator).
Inactive state: `bg-ink-4` — keep.
No change required for `FilterToggle`.

### `DualRangeRow` — range value display

Current:
```jsx
<span className="text-ink-7 tabular-nums font-mono">
```
Replace with:
```jsx
<span className="font-mono text-xs text-ink-8 tabular-nums" style={{ fontVariantNumeric: 'tabular-nums' }}>
```
The `font-mono` class applies JetBrains Mono. `text-xs` (11px) and `text-ink-8` match `comparator.css` `.range-value` (`font-family: var(--font-mono); font-size: 11px; color: var(--ink-8)`).

### `DualRangeRow` — axis label

Current:
```jsx
<span className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-ink-7">
```
Replace with:
```jsx
<span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-9">
```
Matches `comparator.css` `.filter-group-head .name` and `.t-label` token: `font-size: 10px, font-weight: 700, text-transform: uppercase, letter-spacing: 0.18em, color: var(--ink-9)`.

### `Section` component — section title `<span>`

Current:
```jsx
<span className="text-xs font-semibold uppercase tracking-widest text-ink-7">
```
Replace with:
```jsx
<span className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-9">
```
Same `.t-label` correction as the axis label.

### `Section` component — section divider

Current:
```jsx
<div className="border-t border-ink-3 pt-4">
```
Replace with:
```jsx
<div className="border-t border-ink-3 pt-3">
```
Reduces top padding slightly to match `comparator.css` `.filter-group { padding: 14px 0 }`. The `border-ink-3` is correct.

### `Pill` component (multi-select filter chip)

Current active state:
```jsx
'bg-brass-7 text-ink-12 border-brass-7'
```
Replace with:
```jsx
'bg-ink-12 text-paper-1 border-ink-12'
```

Current inactive state:
```jsx
'bg-paper-0 text-ink-11 border-ink-4 hover:border-brass-8 hover:text-brass-8'
```
Replace with:
```jsx
'bg-paper-1 text-ink-9 border-ink-4 hover:border-ink-10 hover:text-ink-12'
```

Current shape: `rounded-xs` — replace with `rounded-full` (pill shape per design system `.chip` rule: `border-radius: 999px`).

Updated `Pill` className string:
```jsx
className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors
  ${active
    ? 'bg-ink-12 text-paper-1 border-ink-12'
    : 'bg-paper-1 text-ink-9 border-ink-4 hover:border-ink-10 hover:text-ink-12'
  }
  ${muted ? 'opacity-40' : ''}`}
```

### `LargeMultiSelectFilter` — selected item inline badges

Current:
```jsx
className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-xs font-medium bg-brass-7 text-ink-12 hover:bg-brass-8 transition-colors"
```
Replace with:
```jsx
className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-xs font-medium bg-ink-12 text-paper-1 hover:bg-ink-10 transition-colors"
```
Active selected items use `ink-12` fill with `paper-1` text (per FR-003, AC-002). The `×` remove span inside: change `text-ink-12/60` to `text-paper-1/60`.

### `MultiSelectFilter` and `LargeMultiSelectFilter` — axis labels

Current:
```jsx
<span className="text-xs font-medium uppercase tracking-widest text-ink-7">
```
Replace with:
```jsx
<span className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-9">
```
Same `.t-label` correction.

### `TriStateFilter` — axis label

Same correction as above.

### Sort label

Current:
```jsx
<label className="text-sm font-medium text-ink-11">
```
Replace with:
```jsx
<label className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-9">
```
Matches `comparator.css` `.filter-group-head .name` style applied consistently to all filter group headings.

### Sort select `<select>`

Current:
```jsx
className="w-full rounded-xs border border-ink-4 bg-paper-0 px-3 py-2 text-sm"
```
Replace with:
```jsx
className="w-full rounded-xs border border-ink-4 bg-paper-1 text-ink-11 px-2.5 py-2 text-sm"
```
`bg-paper-1` matches `comparator.css` `.sort-select { background: var(--paper-1) }`.

## Constraints

- Redux dispatch calls, selector calls, useMemo/useState hooks, i18n `t()` calls, and filter logic are untouched
- `styles.thumb`, `styles.track`, `styles.range` CSS module class references are untouched
- `filter-panel-scroll` utility class is untouched
- `lg:max-h-[calc(100vh-var(--navbar-height)-12px)]` and `lg:overflow-y-auto` are untouched
- No inline `style` attributes for color — transition values that cannot be expressed with Tailwind may use `style={{ transition: 'color var(--duration-quick) var(--ease-standard)' }}`
- Accessibility: `aria-checked`, `aria-label`, `aria-expanded` attributes are untouched

## Dependencies

TASK-001 (FilterPanel.module.css must be updated before this task is verified, as the range slider visual depends on both)

## Validation criteria

- [ ] Panel card background is `paper-0` with `ink-4` hairline border, no shadow (AC-010)
- [ ] Panel header has a `1px solid ink-10` bottom separator
- [ ] Axis labels render all-caps, 10px, `ink-9`, `0.18em` tracking (FR-002)
- [ ] Default chip state: `paper-1` background, `ink-4` border, `ink-9` text, pill shape
- [ ] Active chip state: `ink-12` fill, `paper-1` text, `ink-12` border — no brass tokens on selection (AC-002)
- [ ] Range value display uses JetBrains Mono (`font-mono`)
- [ ] Sort select uses `paper-1` background with `ink-4` border
- [ ] No hardcoded hex values in `FilterPanel.jsx`
- [ ] No `brand-*` or `blue-*` class names in `FilterPanel.jsx`

## Tests to implement

### Unit
- Static scan: `grep -n '#[0-9a-fA-F]' FilterPanel.jsx` returns zero matches
- Static scan: `grep -n 'brand-\|blue-' FilterPanel.jsx` returns zero matches

### Integration
- Select a brand chip — inspect computed background: resolves to `ink-12`; text resolves to `paper-1`
- Verify no brass token appears on selected chip state
- Verify range value display font is JetBrains Mono
