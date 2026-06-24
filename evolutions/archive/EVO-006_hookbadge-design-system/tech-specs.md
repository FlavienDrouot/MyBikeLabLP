# Technical Specifications

## 1. General Information

- **Evolution ID:** EVO-006
- **PRD reference:** `evolutions/EVO-006_hookbadge-design-system/prd.md`
- **Author:** Flavien Drouot
- **Date:** 2026-05-26

---

## 2. Technical Context

### Technical objective

Replace the two legacy color class pairs in `HookBadge` with equivalent pairs drawn exclusively from the current design-system token palette (`ink-*`, `paper-*`, `brass-*`, `sage-*`). No structural, typographic, or interface change is permitted.

### Affected architecture

- `frontend/src/components/MiniComparator/badges.jsx` — the only modified file
- `frontend/tailwind.config.js` — read-only reference; defines the valid token set

### Impacted modules

- `HookBadge` component (inside `badges.jsx`)
- All components that render `HookBadge` are read-only; the component interface is unchanged so no downstream change is required

---

## 3. Technical Constraints

- Only Tailwind color tokens declared in `tailwind.config.js` under `ink-*` (1–12), `paper-*` (0–3), `brass-*` (1–12), or `sage-*` (1–12) may be used as replacement values. No arbitrary CSS values, no `brand-*` tokens.
- `brand-*` tokens are retired but kept in config to avoid build warnings; they must not appear in any component source.
- Structural classes (`inline-flex`, `px-2`, `py-0.5`, `rounded-full`, `text-xs`, `font-medium`) must not be modified or removed.
- The `hookless` boolean prop and the rendered text strings ("Hookless", "Hooked") must not change.
- No file other than `badges.jsx` may be modified.
- The Hookless state must remain visually more prominent than the Hooked state.
- A flat/identical style for both states is not acceptable.

---

## 4. Architecture Decisions

### AD-001 — Color token selection for the Hookless state

#### Description

Replace `bg-brand-50 text-brand-700` (legacy blue) with `bg-brass-3 text-brass-10`.

`brass-3` (`#f3ead8`) is a warm, light background that reads as distinct and slightly elevated relative to a neutral ink background. `brass-10` (`#6b5328`) provides sufficient contrast on that background for `text-xs` text while remaining within the current palette. The brass family is already established in the codebase as the primary accent/action color (active `Pill`, `FilterToggle`, focus rings, reset button), giving the Hookless badge a consistent semantic weight equivalent to the former `brand-*` blue.

#### Motivation

The PRD requires the Hookless state to convey a "notable or special attribute" with semantic prominence comparable to the former brand blue. The brass scale is the only warm, accentuated family in the current palette and is already used for active/selected states across `FilterPanel.jsx`, making it the natural replacement.

#### Rejected alternatives

- `sage-*` — cool greenish neutral; does not carry sufficient prominence over ink for the Hookless state.
- `paper-*` + dark `ink-*` text — too close to the Hooked state in perceived weight; fails FR-004.
- High-step `brass-7`/`brass-8` as background — too saturated and dark for a badge background; used for interactive elements (toggles, pills) rather than static labels.

---

### AD-002 — Color token selection for the Hooked state

#### Description

Replace `bg-ink-100 text-ink-700` (legacy numeric tokens) with `bg-ink-2 text-ink-8`.

`ink-2` (`#e4e2d6`) is a very light neutral background. `ink-8` (`#555550`) provides readable contrast at `text-xs` on that background. Together they produce a visually neutral, low-prominence badge — clearly subordinate to the Hookless brass badge.

#### Motivation

The Hooked state must be neutral relative to Hookless (FR-003, FR-004). The `ink-*` scale is the natural neutral family. `ink-2` is the lightest non-paper neutral swatch; `ink-8` is a mid-dark neutral that ensures legibility without adding visual weight.

#### Rejected alternatives

- `paper-1`/`paper-2` as background — paper tokens are used for page and card backgrounds; using them for a badge would dissolve the badge shape against the card surface.
- `ink-1` as background — too close to paper, badge loses definition on light table cells.
- `ink-3`/`ink-4` as background — slightly darker, acceptable, but `ink-2` is the cleaner minimal step above the table cell background.

---

## 5. Task Breakdown

---

# TASK-001 — Replace legacy color tokens in HookBadge

## Objective

Edit `frontend/src/components/MiniComparator/badges.jsx` to replace the two legacy color class pairs in `HookBadge` with current design-system tokens, as specified in AD-001 and AD-002.

## Required context

**Current component source** (`frontend/src/components/MiniComparator/badges.jsx`):

```jsx
export const HookBadge = ({ hookless }) => (
  <span
    className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
      hookless
        ? 'bg-brand-50 text-brand-700'
        : 'bg-ink-100 text-ink-700'
    }`}
  >
    {hookless ? 'Hookless' : 'Hooked'}
  </span>
);
```

**Token palette** (from `frontend/tailwind.config.js`):

| Token | Hex |
|---|---|
| `brass-3` | `#f3ead8` |
| `brass-10` | `#6b5328` |
| `ink-2` | `#e4e2d6` |
| `ink-8` | `#555550` |

**Design decisions:**
- Hookless state: `bg-brand-50 text-brand-700` → `bg-brass-3 text-brass-10` (AD-001)
- Hooked state: `bg-ink-100 text-ink-700` → `bg-ink-2 text-ink-8` (AD-002)

## Potentially impacted files

- `frontend/src/components/MiniComparator/badges.jsx` — the only file to modify

## Inputs

- Current `badges.jsx` source (shown above)
- AD-001 and AD-002 token selection decisions

## Expected outputs

Updated `badges.jsx` where:
- `bg-brand-50` is replaced by `bg-brass-3`
- `text-brand-700` is replaced by `text-brass-10`
- `bg-ink-100` is replaced by `bg-ink-2`
- `text-ink-700` is replaced by `text-ink-8`
- All other content (text strings, structural classes, prop signature, comments) is identical to the current source

## Constraints

- No file other than `badges.jsx` may be modified (FR-006, AC-009)
- Structural classes (`inline-flex`, `px-2`, `py-0.5`, `rounded-full`, `text-xs`, `font-medium`) must remain exactly as-is (FR-005, AC-007)
- Text content must remain "Hookless" / "Hooked" (FR-005, AC-006)
- Component prop signature `{ hookless }` must remain unchanged (FR-005, AC-008)
- No `brand-*` string may remain in the file after the edit (AC-001)
- No `ink-\d{3}` pattern may remain in the file after the edit (AC-002)

## Dependencies

- None. This is the only task in the evolution.

## Validation criteria

- [ ] Static inspection of `badges.jsx` confirms no occurrence of `brand-` (AC-001)
- [ ] Static inspection of `badges.jsx` confirms no occurrence of the pattern `ink-\d{3}` (AC-002)
- [ ] Every `bg-*` and `text-*` class in the file maps to a key in `tailwind.config.js` under `ink`, `paper`, `brass`, or `sage` (AC-003)
- [ ] Git diff for the evolution branch shows exactly one changed file: `badges.jsx` (AC-009)
- [ ] `badges.jsx` still contains all six structural classes: `inline-flex`, `px-2`, `py-0.5`, `rounded-full`, `text-xs`, `font-medium` (AC-007)
- [ ] `badges.jsx` still renders "Hookless" and "Hooked" as text content (AC-006)
- [ ] Component prop signature is `{ hookless }` — unchanged (AC-008)
- [ ] Visual review in browser: Hookless badge (brass) is more prominent than Hooked badge (ink) when both are visible (AC-004, AC-005)

## Tests to implement

### Unit / static

- String search: `grep -n 'brand-' badges.jsx` — must return zero matches
- String search: `grep -nP 'ink-\d{3}' badges.jsx` — must return zero matches
- Snapshot test (if test suite exists): render `HookBadge` with `hookless={true}` and `hookless={false}`; confirm rendered class strings match the new token values and structural classes are present

### Integration / manual

- Load the app in the browser with a dataset containing both hookless and hooked wheels; confirm both badge variants render and are visually distinguishable
- Confirm Hookless badge (brass) reads as more prominent than Hooked badge (ink) — no jarring contrast against surrounding table cells

---

## 6. Global Validation Strategy

### Unit validation

- Static string search on `badges.jsx` for `brand-` and `ink-\d{3}` patterns (automated, CI-friendly)
- Optional: Jest snapshot of both badge variants

### Integration validation

- Not applicable — no cross-component or state-management changes

### Functional validation

- Manual visual review in browser (Chrome or equivalent): comparator table with both hookless and hooked wheels visible simultaneously
- Confirm visual hierarchy: Hookless (brass) > Hooked (ink-neutral)
- Confirm no regressions in surrounding table cells or other MiniComparator components

### Non-regression validation

- Git diff confirms only `badges.jsx` is modified
- All other components in `MiniComparator/` render correctly (no broken Tailwind classes, no layout shifts)

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Tailwind purge removes new brass/ink classes if they were not previously used in the codebase | Badge renders without background or text color in production build | Both `brass-*` and `ink-*` families are already used extensively in `FilterPanel.jsx` and other components; Tailwind content scan will retain the classes |
| Chosen brass tokens clash visually with surrounding table cell backgrounds (paper tones) | Badge loses definition | `brass-3` is warm and distinct from `paper-0`/`paper-1`; manual review step in validation confirms visual integrity |
| `ink-2` background dissolves against light table cell | Hooked badge loses shape | `ink-2` (`#e4e2d6`) is slightly darker than `paper-0`/`paper-1`; sufficient contrast to define the pill shape |

---

## 8. Rollback Plan

- Revert the single commit that modifies `badges.jsx` — restores `bg-brand-50 text-brand-700` and `bg-ink-100 text-ink-700`
- No other files were changed; no data or state is affected
- `brand-*` tokens remain defined in `tailwind.config.js` so the build will not break on rollback
