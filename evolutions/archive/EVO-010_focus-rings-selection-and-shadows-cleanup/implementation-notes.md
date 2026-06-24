# Implementation Notes — EVO-010

## TASK-001 — Global `::selection` and `:focus-visible` rules

**File:** `frontend/src/index.css`

Added `::selection` and `:focus-visible` rules inside the existing `@layer base` block, after the `body` rule. Final block:

```css
@layer base {
  html { ... }
  body { ... }
  ::selection {
    background: var(--brass-5);
    color: var(--ink-12);
  }
  :focus-visible {
    outline: 2px solid var(--brass-8);
    outline-offset: 2px;
  }
}
```

---

## TASK-002 — Per-element focus helpers removed from `MiniComparator.jsx`

**File:** `frontend/src/components/MiniComparator/MiniComparator.jsx`

- **Mobile Filters button (~line 43):** removed `focus:outline-none focus:ring-2 focus:ring-brass-8 focus:ring-offset-1`.
- **Mobile drawer close button (~line 79):** removed `focus:outline-none focus:ring-2 focus:ring-brass-8`.

---

## TASK-003 — Shadow removal from Filters button and filter drawer

**File:** `frontend/src/components/MiniComparator/MiniComparator.jsx`

- **Mobile Filters button:** `shadow-sm` removed. `border border-ink-4` retained.
- **Filter drawer div:** `shadow-xl` and `lg:shadow-none` removed. `border-r border-ink-4 lg:border-r-0` added (right-edge keyline, reset at lg breakpoint).

---

## TASK-004 — ColumnSelector shadow aligned to `var(--shadow-menu)`

**Files:**
- `frontend/src/components/MiniComparator/ColumnSelector.jsx`: floating menu div, `shadow-sm` → `shadow-menu`.
- `frontend/tailwind.config.js`: `shadow-menu` key was not previously defined. Added under `theme.extend.boxShadow`:
  ```js
  menu: '0 1px 0 0 var(--ink-10), 0 8px 24px -12px rgba(14, 15, 12, 0.18)'
  ```

---

## TASK-005 — Focus helpers removed from `FilterPanel.jsx` and `ColumnSelector.jsx`

**Files:** `frontend/src/components/MiniComparator/FilterPanel.jsx`, `frontend/src/components/MiniComparator/ColumnSelector.jsx`

Removed from each element:
- `FilterToggle` button: `focus:outline-none focus:ring-2 focus:ring-brass-8 focus:ring-offset-1`
- Range filter low input: `focus:border-brass-8 focus:outline-none`
- Range filter high input: `focus:border-brass-8 focus:outline-none`
- `LargeMultiSelectFilter` search input: `focus:border-brass-8 focus:outline-none`
- `LargeMultiSelectFilter` checkbox inputs: `focus:ring-brass-8` (`accent-brass-7` preserved)
- Sort `<select>`: `focus:border-brass-8 focus:outline-none`
- `ColumnSelector` checkbox inputs: `focus:ring-brass-8` (`accent-brass-7` and `rounded` preserved)

---

## TASK-006 — `box-shadow` removed from range slider thumbs

**File:** `frontend/src/components/MiniComparator/FilterPanel.module.css`

- `::-webkit-slider-thumb`: `box-shadow` removed. `border: 2px solid #fbfaf6` updated to `border: 2px solid var(--paper-0)`.
- `::-moz-range-thumb`: `box-shadow` removed. `border: none` replaced with `border: 2px solid var(--paper-0)`.

---

## Post-implementation fix — Range slider thumb focus ring

**Issue:** The global `:focus-visible` outline did not appear on range slider thumbs for two reasons: (1) `.thumb { outline: none }` in `FilterPanel.module.css` statically suppresses the global rule (CSS module loads after `index.css`, equal specificity, later rule wins); (2) the `<input type="range">` has `height: 0`, so an outline on the input itself would render around an invisible box rather than the thumb.

**Fix:** Added explicit `:focus-visible` rules scoped to the thumb pseudo-elements in `FilterPanel.module.css`:

```css
.thumb:focus-visible::-webkit-slider-thumb {
  outline: 2px solid var(--brass-8);
  outline-offset: 2px;
}

.thumb:focus-visible::-moz-range-thumb {
  outline: 2px solid var(--brass-8);
  outline-offset: 2px;
}
```

The `outline: none` on `.thumb` is retained — it correctly suppresses any outline on the zero-height input container.

---

## Open questions resolved during implementation

- **OQ-001 (border edge):** confirmed `border-r` (right edge, facing page content) for the left-anchored drawer. Tech-specs corrected accordingly.
- **OQ-002 (`shadow-menu` in config):** not previously defined — added in TASK-004.
