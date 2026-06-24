# Implementation Notes — EVO-016 Fonts Loading Optimization

## TASK-001 — Update Content Security Policy in `index.html`

**Change:** `frontend/index.html` line 5 — two origins appended to their respective directives:
- `style-src`: added `https://fonts.googleapis.com`
- `font-src`: added `https://fonts.gstatic.com`

All other CSP directives (`default-src`, `script-src`, `img-src`, `connect-src`, `frame-ancestors`, `upgrade-insecure-requests`, `block-all-mixed-content`) are byte-for-byte unchanged.

**Notes:**
- No deviations from spec.
- Both new origins appended at the end of their directive lists (least-surprise position; no ordering constraint was specified).
- TASK-001 and TASK-002 should land in the same commit or TASK-001 must precede TASK-002 in deployment order — the preconnect/stylesheet links added in TASK-002 are blocked by the old CSP.

---

## TASK-002 — Add font preconnect hints and stylesheet link to `index.html`

**Change:** Three lines inserted in `frontend/index.html` immediately before `</head>` (lines 10–12):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap">
```

**Notes:**
- No deviations from spec.
- `crossorigin` is present only on the `fonts.gstatic.com` preconnect (required for woff2 files fetched cross-origin), absent on `fonts.googleapis.com` preconnect — exactly as specified.
- Placement: after `<title>` and before `</head>`. The `<title>` is not a `<meta>` tag but placing links after it is correct practice — preconnect hints benefit from being late in `<head>` so they do not delay parser-critical meta tags.
- TASK-001 prerequisite was confirmed already applied before this task ran.

---

## TASK-003 — Remove `@import` from `design-system/colors_and_type.css` and `design-tokens.css`

**Changes:**
- `design-system/colors_and_type.css`: removed lines 10–14 — the `/* --- Fonts (Google Fonts) ... */` comment block and the `@import url(...)` line (plus trailing blank line).
- `frontend/src/design-tokens.css`: removed identical block (lines 11–15 — one line lower due to verbatim-copy header).

Post-removal grep across all `**/*.css` under `MyBikeLab` for `@import.*fonts\.googleapis\.com` returns zero matches.

**Notes:**
- No deviations from spec. All other custom properties, type token classes, and global baseline rules are intact.
- Trailing blank line between the removed block and `:root {` collapsed naturally — no gap introduced.
- Deployment note (from spec): TASK-003 should land after TASK-002 is deployed so fonts are never absent during partial deployment.

---

## TASK-004 — Add `--navbar-height` token to design system

**Changes:**
- `design-system/colors_and_type.css` line 210 (inserted): `  --navbar-height: 5rem;  /* sticky top offset for scroll anchors and floating panels */`
- `frontend/src/design-tokens.css` line 211 (inserted): identical line.

Both additions are inside `:root`, in the `LAYOUT` section, immediately after `--grid-unit: 8px;`. No other line in either file was touched.

**Notes:**
- Value is `5rem` (not `4rem`) per AD-002: the navbar DOM height is `h-16` (4rem), but all existing scroll and sticky offsets use 5rem for a clearance margin. Changing to 4rem would produce a visible regression on anchor scroll targets and the sticky FilterPanel.
- Comment preserved verbatim from spec: `/* sticky top offset for scroll anchors and floating panels */`.

---

## TASK-005 — Replace `scroll-padding-top` hardcoded value in `index.css`

**Change:** `frontend/src/index.css` line 10:

Before: `scroll-padding-top: 5rem;`
After: `scroll-padding-top: var(--navbar-height);`

`scroll-behavior: smooth` unchanged. No other line modified.

**Notes:**
- No visual change at runtime: `--navbar-height` resolves to `5rem` (80 px), identical to the replaced value.
- `--navbar-height` is available via `design-tokens.css`, already imported on line 1 of `index.css` — no import change needed.

---

## TASK-006 — Replace hardcoded sticky offset in `FilterPanel`

**Change:** `frontend/src/components/MiniComparator/FilterPanel.jsx`, line 446:

Before:
```jsx
<aside className="card p-5 lg:p-6 space-y-6 h-fit lg:sticky lg:top-20">
```
After:
```jsx
<aside
  className="card p-5 lg:p-6 space-y-6 h-fit lg:sticky"
  style={{ top: 'var(--navbar-height)' }}
>
```

No other line in the file was modified.

**Notes:**
- No visual change at runtime: `top-20` = 5rem; `--navbar-height` = 5rem (AD-002).
- The inline `style` attribute has higher CSS specificity than a stylesheet utility class — even if `lg:top-20` had been accidentally left in `className`, the inline style would win. Removed for correctness regardless.
- Runtime dependency: if `--navbar-height` is absent (e.g. `design-tokens.css` not loaded), `top` resolves to `unset` and the sticky panel snaps to the viewport top. TASK-004 must be deployed before this task reaches production.
