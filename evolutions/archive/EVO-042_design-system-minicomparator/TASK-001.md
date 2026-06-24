# TASK-001 — Replace FilterPanel.module.css with token-correct range slider styles

## Objective

Replace the entire content of `FilterPanel.module.css` with corrected pseudo-element rules for the dual-range slider. All hardcoded hex values (`#a88846`, `#c2c0b3`) must be replaced with `var(--*)` CSS custom property references. Thumb size, track height, and fill color must match the design system specification.

## Required context

This file contains pseudo-element rules for `<input type="range">` elements that cannot be expressed with Tailwind utility classes. It is the only CSS module in the MiniComparator surface and the only location where raw `var(--*)` references are permitted.

**Current file location:** `frontend/src/components/MiniComparator/FilterPanel.module.css`

**Current problems:**
- `.thumb::-webkit-slider-thumb` and `:-moz-range-thumb`: `background: #a88846` (hardcoded hex for brass-8) — must become `var(--paper-0)`
- Same thumb rules: `border: 2px solid var(--paper-0)` — must become `border: 1px solid var(--ink-11)`
- `.thumb::-webkit-slider-thumb:hover`: `transform: scale(1.2)` — remove (design system has no scale hover on thumb)
- `.thumb::-moz-range-thumb:hover`: `transform: scale(1.2)` — remove
- `.track`: `height: 6px`, `background: #c2c0b3` (hardcoded ink-4), `border-radius: 3px` — must become `height: 2px`, `background: var(--ink-3)`, no `border-radius`
- `.range` (fill): `height: 6px`, `background: #a88846` (hardcoded brass-8), `border-radius: 3px` — must become `height: 2px`, `background: var(--ink-11)`, no `border-radius`
- Thumb dimensions: `width: 20px; height: 20px` — must become `width: 14px; height: 14px`

**Design system reference:** `design-system/ui_kits/comparator/comparator.css`, rules `.range-track`, `.range-fill`, `.range-thumb`, and `input[type="range"]`

**Token reference:**
- `var(--paper-0)` = `#fbfaf6` — thumb fill
- `var(--ink-11)` = `#1a1a17` — thumb border, fill segment
- `var(--ink-3)` = `#d6d4c7` — track background
- `var(--brass-8)` = `#a88846` — focus ring (kept via `outline: 2px solid var(--brass-8)`)

## Potentially impacted files

- `frontend/src/components/MiniComparator/FilterPanel.module.css` — full replacement

## Inputs

- Current `FilterPanel.module.css` (read before editing)
- `design-system/ui_kits/comparator/comparator.css` — `.range-track`, `.range-fill`, `.range-thumb`, and `input[type="range"]` rules

## Expected outputs

`FilterPanel.module.css` with the following content (replacing the file entirely):

```css
/* Tailwind cannot target pseudo-elements of range inputs */

.thumb {
  position: absolute;
  width: 100%;
  height: 0;
  pointer-events: none;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  outline: none;
}

.thumb::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--paper-0);
  border: 1px solid var(--ink-11);
  pointer-events: all;
  cursor: grab;
}

.thumb:focus-visible::-webkit-slider-thumb {
  outline: 2px solid var(--brass-8);
  outline-offset: 2px;
}

.thumb::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--paper-0);
  border: 1px solid var(--ink-11);
  pointer-events: all;
  cursor: grab;
}

.thumb:focus-visible::-moz-range-thumb {
  outline: 2px solid var(--brass-8);
  outline-offset: 2px;
}

.track {
  position: absolute;
  width: 100%;
  height: 2px;
  background: var(--ink-3);
  z-index: 1;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.range {
  position: absolute;
  height: 2px;
  background: var(--ink-11);
  z-index: 2;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}
```

## Constraints

- No hardcoded hex values (`#...`) in this file — all colors via `var(--*)` only
- No new CSS classes — only the three existing classes (`.thumb`, `.track`, `.range`) are used
- The `position: absolute`, `width: 100%`, `pointer-events: none`, z-index, and `top: 50%/transform` positioning logic on `.track` and `.range` is preserved exactly — only height and color change
- The focus ring rule (`:focus-visible` + `outline: 2px solid var(--brass-8)`) is preserved for both `-webkit-` and `-moz-` variants
- The hover `scale(1.2)` transform is removed — the design system reference has no hover scale on the thumb
- `cursor: grab` replaces `cursor: pointer` on the thumb, matching the design system reference

## Dependencies

none

## Validation criteria

- [ ] No `#` hex color values remain anywhere in `FilterPanel.module.css`
- [ ] Thumb renders as `14px × 14px`, `paper-0` fill, `1px solid ink-11` border
- [ ] Track renders as `2px` height, `ink-3` background
- [ ] Fill segment renders as `2px` height, `ink-11` background
- [ ] Tab-focusing a range input shows a `2px brass-8` outline via `:focus-visible`
- [ ] No hover scale transform on the thumb

## Tests to implement

### Unit
- Static check: `grep -n '#' FilterPanel.module.css` returns zero matches

### Integration
- Visually verify range slider in running app against `design-system/ui_kits/comparator/` — track is a hairline (2px), thumb is small circular dot with paper fill and ink border
