# Implementation Notes — EVO-011

## Summary

All 5 tasks completed in 2 batches. Changes are class-level substitutions across 4 files, plus a one-line addition to `tailwind.config.js`. No logic, data model, or component structure was altered.

---

## TASK-001 — Hero section surface and MVP badge radius

**File:** `frontend/src/components/Hero.jsx`

**Changes:**
- `<section>` className: removed `bg-paper-0` → now `"relative overflow-hidden"`
- MVP badge `<span>` (line 10): removed `bg-paper-0`, replaced `rounded-full` with `rounded-xs`

**Notes:**
- Purely mechanical changes. File matched the spec exactly — no surprises.
- No deviations or design decisions required.

---

## TASK-002 — Navbar surface token and opacity

**Files:** `frontend/src/components/Navbar.jsx`, `frontend/tailwind.config.js`

**Changes:**
- Sticky `<header>` className: `bg-paper-0/80` → `bg-paper-1/88`; `backdrop-blur` retained (Tailwind default = 8px, no config override present)
- Mobile menu `<div>` (`md:hidden`): `bg-paper-0` → `bg-paper-1`
- `tailwind.config.js`: added `'88': '0.88'` to `theme.extend.opacity` (the key was absent — `theme.extend` had no `opacity` block at all)

**Design decision — opacity step 88:**
AD-001 anticipated this. The `88` opacity step was confirmed absent and added as a one-line entry in `theme.extend.opacity`. The inline-style fallback was not used, preserving Tailwind convention.

**Design decision — backdrop-blur:**
Verified that Tailwind's bare `backdrop-blur` utility resolves to `blur(8px)` by default, and no override exists in the project config. Class kept as-is.

---

## TASK-003 — Filter pill radius in FilterPanel

**File:** `frontend/src/components/MiniComparator/FilterPanel.jsx`

**Changes:**
- Line 194 — `Pill` component: `rounded-full` → `rounded-xs`
- Line 285 — `LargeMultiSelectFilter` active-selection chip `<button>`: `rounded-full` → `rounded-xs`

**FilterToggle preserved:**
- Line 35 — track element: `rounded-full` kept (per AD-002)
- Line 39 — thumb element: `rounded-full` kept (per AD-002)

**Notes:**
- Exactly 4 `rounded-full` occurrences in the file: 2 changed, 2 preserved. No unexpected occurrences.
- No filter logic, dispatch calls, or FILTER_ADAPTERS map touched.

---

## TASK-004 — Close button radius in MiniComparator drawer

**File:** `frontend/src/components/MiniComparator/MiniComparator.jsx`

**Change:**
- Line 79 — close button: `rounded-full` → `rounded-xs`

**Notes:**
- Single-occurrence change. Click handler (`setFiltersOpen(false)`), `aria-label="Close filters"`, SVG icon, and all drawer/backdrop logic untouched.

---

## TASK-005 — Verification: HookBadge and card surfaces

**Files read (no changes):** `badges.jsx`, `index.css`, `FilterPanel.jsx`

**Results:**

| Criterion | Line | Status |
|---|---|---|
| `HookBadge` uses `rounded-full` | `badges.jsx:7` | PASS |
| `.card` uses `bg-paper-0` | `index.css:62` | PASS |
| `.card` uses `rounded-none` | `index.css:62` | PASS |
| `FilterToggle` track uses `rounded-full` | `FilterPanel.jsx:35` | PASS |
| `FilterToggle` thumb uses `rounded-full` | `FilterPanel.jsx:39` | PASS |

No regressions found. No corrections needed.

---

## Files modified

| File | Nature of change |
|---|---|
| `frontend/src/components/Hero.jsx` | Removed `bg-paper-0` from section and MVP badge; `rounded-full` → `rounded-xs` on badge |
| `frontend/src/components/Navbar.jsx` | `bg-paper-0/80` → `bg-paper-1/88` on header; `bg-paper-0` → `bg-paper-1` on mobile menu |
| `frontend/src/components/MiniComparator/FilterPanel.jsx` | `rounded-full` → `rounded-xs` on Pill and LargeMultiSelectFilter chips |
| `frontend/src/components/MiniComparator/MiniComparator.jsx` | `rounded-full` → `rounded-xs` on close button |
| `frontend/tailwind.config.js` | Added `'88': '0.88'` to `theme.extend.opacity` |

## Files verified unchanged

| File | Verified |
|---|---|
| `frontend/src/components/MiniComparator/badges.jsx` | HookBadge `rounded-full` intact |
| `frontend/src/index.css` | `.card` `bg-paper-0` and `rounded-none` intact |
