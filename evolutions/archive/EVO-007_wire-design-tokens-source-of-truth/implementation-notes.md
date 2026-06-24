# Implementation Notes — EVO-007

## TASK-001 — Create `frontend/src/design-tokens.css`

**Status:** Complete

**Design decisions:**
- Drift-warning comment added at line 1: `/* DO NOT EDIT — verbatim copy of design-system/colors_and_type.css. Update by replacing this file entirely. */`
- Google Fonts `@import` retained in the copy (single surviving font import — TASK-002 removes the duplicate from `index.css`).

**Deviations:** None.

**Tradeoffs:** None.

**Open questions:** None.

**Bug fixes:** None.

---

## TASK-002 — Update `frontend/src/index.css`

**Status:** Complete

**Design decisions:**
- Google Fonts `@import url(...)` removed from line 1 of `index.css` — `design-tokens.css` already contains it.
- `@import './design-tokens.css';` inserted as the new first line, before `@tailwind base`.
- A blank line between the import and `@tailwind base` was preserved for readability (no functional impact).

**Deviations:** None.

**Tradeoffs:** None.

**Open questions:** None.

**Bug fixes:** None.

---

## TASK-003 — Refactor `tailwind.config.js`

**Status:** Complete

**Design decisions:**
- All hex values under `colors.paper` (stops 0–3), `colors.ink` (stops 1–12), `colors.brass` (stops 1–12), `colors.sage` (stops 1–12) replaced with `'var(--paper-N)'` etc.
- `colors.brand` block deleted entirely (carried a `RETIRED` comment; zero `brand-*` references confirmed by grep).
- `fontFamily` updated to three DS-variable-backed entries: `display`, `sans`, `mono`. The `display` key is new — it was absent from the original config but matches the `--font-display` token in the DS.
- `letterSpacing.widest` added as `'0.18em'` (was absent from the original config).
- `borderRadius.xs: '2px'` unchanged.

**Deviations:** None.

**Tradeoffs:**
- Font families passed as `['var(--font-display)', 'sans-serif']` arrays — Tailwind 3 wraps each entry; the browser resolves `var(--font-display)` from the `:root` block at runtime. `'sans-serif'` is a Tailwind-level fallback only.

**Open questions:**
- `--font-display` and `--font-sans` currently resolve to the same stack (`'Inter', -apple-system, system-ui, sans-serif`). If a future DS update differentiates them, no config change is needed.

**Bug fixes:** None.

---

## TASK-004 — Manual verification pass

**Status:** Static checks complete — browser checks pending (requires running dev server)

### Static checks (automated)

| Check | Result |
|---|---|
| `design-tokens.css` exists at `frontend/src/design-tokens.css` | ✓ |
| `index.css` line 1 is `@import './design-tokens.css';` | ✓ |
| No Google Fonts `@import` in `index.css` | ✓ |
| No hex literals in `tailwind.config.js` | ✓ (grep: 0 matches) |
| No `brand-` references in `frontend/src/` | ✓ (grep: 0 matches) |
| `letterSpacing.widest: '0.18em'` present in config | ✓ |
| `fontFamily.display/sans/mono` reference DS CSS variables | ✓ |

### Browser checks (to be validated manually)

| AC | Check | How |
|---|---|---|
| AC-002 | Modify `--brass-7` in `design-tokens.css`, save → CTA background updates via HMR | DevTools Elements |
| AC-003 | `class="tracking-widest"` → computed `letter-spacing: 0.18em` | DevTools Computed |
| AC-004 | `className="t-label"` in a component → correct font/size/weight/transform/tracking | DevTools Computed |
| AC-006 | Landing page visual comparison before/after — no perceptible regression | Visual inspection; expect minor diff on any element using `tracking-widest` |
