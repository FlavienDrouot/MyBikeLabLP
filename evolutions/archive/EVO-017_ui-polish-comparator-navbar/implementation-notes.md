# Implementation Notes — EVO-017

## TASK-001 — Hero stat line audit

**Result:** No duplicate found in `Hero.jsx` source. The stat grid block appears exactly once (lines 24–37). No deletion was needed.

**Files:**
- Created: `frontend/src/components/__tests__/Hero.test.jsx`
- Modified: none

**Notes:**
- The test uses a `countOccurrences` helper against `renderToStaticMarkup` output. Searches for capitalized label strings ("Road wheels", "Filter axes", "Phases planned") which appear only in the stat grid — the prose paragraph uses lowercase, so no false positives.
- Fully compatible with the `node` Vitest environment; no `@testing-library/react` used.

---

## TASK-002 — FilterPanel / ComparisonTable top-edge alignment

**Result:** Two className additions to `MiniComparator.jsx`.

**Files:**
- Modified: `frontend/src/components/MiniComparator/MiniComparator.jsx`

**Changes:**
1. `items-start` added to the grid wrapper — prevents stretch alignment, makes each column start at its natural top.
2. `lg:pt-[48px]` added to the FilterPanel content wrapper (`div.px-4.py-4.lg:p-0`) — pushes the FilterPanel card down to align with the ComparisonTable.

**Notes:**
- `items-start` is a prerequisite: without it, `stretch` default would span the FilterPanel column over the full grid row height regardless of padding.
- The `lg:pt-[48px]` correctly overrides the `pt-0` implied by `lg:p-0` (directional utility wins over shorthand at equal specificity when appearing later in the class string).
- **48px was derived analytically** (button: `py-2` 16px + `text-sm` 20px line-height = 36px; + `mb-3` 12px = 48px). Must be confirmed visually in `npm run dev` with DevTools; adjust if rendered `offsetHeight` differs.
- Fix is scoped to `lg:` breakpoint; below `lg` the mobile padding (`px-4 py-4`) is preserved and the FilterPanel is stacked, so the padding has no visual effect.

---

## TASK-003 — ColumnSelector hover transition

**Result:** Single targeted edit to `ColumnSelector.jsx`.

**Files:**
- Modified: `frontend/src/components/MiniComparator/ColumnSelector.jsx`

**Changes:**
- Removed `transition-colors` from the trigger button className.
- Added `style={{ transition: 'color var(--duration-quick) var(--ease-standard), background-color var(--duration-quick) var(--ease-standard), border-color var(--duration-quick) var(--ease-standard)' }}` to the trigger button.

**Notes:**
- The transition value is character-for-character identical to `.btn-primary`, `.btn-ghost`, and `.btn-outline` in `index.css`.
- No other line in the file was touched. Dropdown open/close logic is untouched.

---

## TASK-004 — WheelDetailPanel bottom separator

**Result:** Single className change to `WheelDetailPanel.jsx`.

**Files:**
- Modified: `frontend/src/components/MiniComparator/WheelDetailPanel.jsx`

**Changes:**
- Outer div className updated: `border-t border-ink-3` → `border-t border-t-ink-3 border-b border-b-ink-4`

**Bug found and fixed (deviation from spec):**
The spec prescribed `border-t border-ink-3 border-b border-ink-4`. `border-ink-3` and `border-ink-4` both compile to the `border-color` shorthand (all four sides) — the last token wins, so `border-ink-3` would have been silently overridden and the top border would have rendered in `--ink-4` instead of `--ink-3`. Fixed using Tailwind 3 side-specific color variants: `border-t-ink-3` → `border-top-color: var(--ink-3)` and `border-b-ink-4` → `border-bottom-color: var(--ink-4)`. Both render correctly on their respective sides with no conflict.

---

## TASK-005 — Navbar logo SVG import

**Result:** Import added, hardcoded logo markup replaced.

**Files:**
- Modified: `frontend/src/components/Navbar.jsx`
- Created: `frontend/src/components/__tests__/Navbar.test.jsx`

**Changes:**
- Added `import logoWordmark from '../../../design-system/assets/logo-wordmark.svg'`
- Replaced the `<div>` + `<span>` logo block with `<img src={logoWordmark} alt="MyBikeLab" className="h-8 w-auto" />`
- All other Navbar code (sticky, nav links, mobile menu, backdrop-blur) untouched.

**Notes:**
- Test uses `renderToStaticMarkup` (no DOM, no Redux Provider needed). Asserts: HTML contains `<img`; HTML does not contain `>M<`.
- `h-8` height should be confirmed visually — if the SVG intrinsic aspect ratio differs, the value may need adjustment.

---

## TASK-006 — Footer logo SVG import

**Result:** Import added, hardcoded logo markup replaced.

**Files:**
- Modified: `frontend/src/components/Footer.jsx`
- Created: `frontend/src/components/__tests__/Footer.test.jsx`

**Changes:**
- Added `import logoMark from '../../../design-system/assets/logo-mark.svg'`
- Replaced the `<div>` with letter "M" with `<img src={logoMark} alt="MyBikeLab" className="h-7 w-auto" />`
- Copyright `<span>` and all other layout unchanged.

**Notes:**
- `w-auto` preserves the SVG's natural aspect ratio (the original div was square `h-7 w-7`).
- **Open finding:** `logo-mark.svg` is rendered via `<img>` and will not inherit `currentColor`. If the SVG is designed for light backgrounds only, it may have low contrast on the dark footer (`bg-ink-12`). Requires visual verification during `npm run dev`. Cannot be resolved without modifying the SVG (out of scope).

---

## Manual Validation Required

All task agents were denied shell execution. The following must be run manually:

```
cd MyBikeLab\frontend
npm run test   # new test files: Hero.test.jsx, Navbar.test.jsx, Footer.test.jsx
npm run build  # verify no Vite import path errors
npm run dev    # visual check: alignment (AC-002), hover (AC-003), drawer separator (AC-004), logos (AC-005/AC-006)
```

**Key items to check visually:**
- TASK-002: `lg:pt-[48px]` produces correct alignment — if FilterPanel card top edge doesn't match ComparisonTable, measure the ColumnSelector row's `offsetHeight` in DevTools and adjust the value.
- TASK-006: `logo-mark.svg` contrast on dark footer background.
- TASK-005/006: logo sizes (`h-8` / `h-7`) render correctly at standard viewport widths.
