# Technical Specifications

## 1. General Information

- Evolution ID: EVO-020
- PRD reference: `evolutions/EVO-020_style-tokens-compliance/prd.md`
- Author: Flavien Drouot
- Date: 2026-05-27

---

## 2. Technical Context

### Technical objective

Bring four UI-guideline violations into compliance through additive config/CSS entries and targeted class-name substitutions. No logic changes, no structural JSX modifications.

1. Replace `min-h-screen` with `min-h-[100dvh]` on the Landing page wrapper.
2. Remove `rounded-lg` and replace `border-ink-3` with `border-ink-4` on the multiselect option list.
3. Replace all four `opacity-50` disabled-state occurrences in FilterPanel with `opacity-40`.
4. Add a global `prefers-reduced-motion` CSS rule suppressing movement animations while preserving color/opacity transitions.

### Affected architecture

- **Presentation layer** — React JSX class names (Landing, FilterPanel)
- **Style configuration** — Tailwind extend.opacity
- **Global CSS** — index.css base layer

### Impacted modules

- `src/pages/Landing.jsx`
- `src/components/MiniComparator/FilterPanel.jsx`
- `frontend/tailwind.config.js`
- `src/index.css`

---

## 3. Technical Constraints

- Only class-name substitutions and additive config/CSS entries — no structural JSX changes.
- `min-h-[100dvh]` used as a Tailwind arbitrary value; no custom token introduced.
- `opacity-40` extension must not conflict with the existing `opacity: { '88': '0.88' }` entry.
- `prefers-reduced-motion` rule must use `0.01ms` (not `0`) for compatibility with CSS animation libraries.
- The `FilterPanel.jsx` opacity change (TASK-003) requires `opacity-40` to exist in the Tailwind config (TASK-002) first.

---

## 4. Architecture Decisions

### AD-001 — One task per impacted file
#### Description
Each of the four impacted files receives its own task.
#### Motivation
Each change is independently reviewable and deployable. Mixing config, stylesheet, and JSX changes in one task creates an oversize diff and blurs the review boundary.
#### Rejected alternatives
Single task for all changes — discarded (too coarse, masks the config→JSX dependency).

---

### AD-002 — tailwind.config.js change precedes FilterPanel.jsx change
#### Description
TASK-002 (add `opacity-40` to Tailwind config) is declared as a dependency of TASK-003 (replace `opacity-50` with `opacity-40` in FilterPanel.jsx).
#### Motivation
`opacity-40` must exist in the Tailwind JIT output before the JSX references it. When shipped in the same PR this is naturally satisfied; when shipped separately, the config must merge first.
#### Rejected alternatives
Inline CSS `style={{ opacity: 0.4 }}` — discarded (bypasses the design system; AC-005 explicitly requires the `opacity-40` utility class).

---

### AD-003 — No custom Tailwind token for 100dvh
#### Description
`min-h-[100dvh]` is applied as a Tailwind arbitrary value directly in JSX, not via a theme extension.
#### Motivation
PRD §9 explicitly forbids adding a custom token. Arbitrary-value syntax is the standard Tailwind approach for one-off viewport units.
#### Rejected alternatives
Adding `minHeight: { screen: '100dvh' }` to the theme — discarded (would silently change the meaning of `min-h-screen` globally, which is a breaking change).

---

### AD-004 — Single blanket 0.01ms rule satisfies FR-005 and FR-006
#### Description
The `prefers-reduced-motion` CSS block sets `transition-duration` and `animation-duration` to `0.01ms` on `*`, `*::before`, `*::after`. No special carve-out for color/opacity is needed.
#### Motivation
At `0.01ms`, motion is imperceptible (FR-005 satisfied). Color and opacity changes are still applied by the browser and remain visible as instant state changes (FR-006 satisfied). The PRD requires that color/opacity transitions "continue to function normally" — instantaneous application qualifies as functional.
#### Rejected alternatives
Targeting only `transform` and positional properties — discarded (overly complex selector, no benefit for a blanket accessibility rule).
Restoring a 150ms `transition-duration` specifically for `color` and `opacity` — discarded (adds complexity and is not required by the PRD).

---

## 5. Task Breakdown

| Task | File | Summary | Dependencies |
|------|------|---------|--------------|
| TASK-001 | `TASK-001.md` | Replace `min-h-screen` with `min-h-[100dvh]` in Landing.jsx | none |
| TASK-002 | `TASK-002.md` | Add `opacity-40` entry to tailwind.config.js extend.opacity | none |
| TASK-003 | `TASK-003.md` | Replace 4x `opacity-50` with `opacity-40` in FilterPanel.jsx disabled states | TASK-002 |
| TASK-004 | `TASK-004.md` | Fix multiselect option list: remove `rounded-lg`, replace `border-ink-3` with `border-ink-4` | none |
| TASK-005 | `TASK-005.md` | Add `prefers-reduced-motion` global rule to index.css | none |

---

## 6. Global Validation Strategy

### Unit validation
- None required (no logic change, no new functions).

### Integration validation
- Tailwind JIT build must produce no warnings or errors after TASK-002 (`npm run build` or `npx tailwindcss --watch`).
- The `opacity-40` class must appear in the generated CSS output.

### Functional validation
- AC-001 through AC-008 as defined in `prd.md §6`.
- Test on physical iOS device or iOS Safari simulator for viewport height fix (AC-001).
- Test with OS reduced-motion enabled for AC-006 and AC-007.

### Non-regression validation
- All thirteen filter types render correctly (no opacity regression on enabled controls).
- All five filter types (multiSelect, range, triState, including LargeMultiSelect) function as before on desktop and mobile.
- Landing page renders correctly across all six sections on desktop Chrome, Firefox, Safari.
- Verify narrow viewport (320px) for no layout breakage from `min-h-[100dvh]`.

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Tailwind v4 may use a different config schema | Medium — `extend.opacity` path may not apply | Confirm Tailwind major version before TASK-002 |
| `0.01ms` duration may still look animated on low-refresh-rate screens | Low | Acceptable per PRD §9; use `0.01ms` not `0` |
| Removing `rounded-lg` from the option list may affect an overriding CSS rule | Low | Inspect computed styles after change; no other rule targets this element |

---

## 8. Rollback Plan

- All changes are confined to four files with no shared dependencies outside this evolution.
- Revert is a direct `git revert` of the evolution commit(s) or manual class-name restoration.
- No database migrations, API changes, or data schema changes — rollback has zero data risk.
