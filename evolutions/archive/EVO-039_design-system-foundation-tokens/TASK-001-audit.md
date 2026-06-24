# TASK-001 Audit — Design System Source of Truth vs. Live Frontend

**Audit date:** 2026-06-03
**Auditor:** TASK-001 (read-only, no production files modified)
**Source of truth:** `MyBikeLab/design-system/colors_and_type.css`
**Live token file:** `MyBikeLab/frontend/src/design-tokens.css`
**Other files audited:** `frontend/src/index.css`, `frontend/src/fonts.css`, `frontend/tailwind.config.js`, `frontend/src/**/*.{jsx,js,css}`

---

## 1. Token Parity Check

Every `:root` property in `colors_and_type.css` vs. `design-tokens.css`.

### Result: ONE ADDITION ONLY — all source-of-truth tokens are present and identical

All 114 `:root` custom properties declared in `colors_and_type.css` are present in `design-tokens.css` with identical values. The two files are otherwise byte-for-byte equivalent in their `:root` block, with one exception: `design-tokens.css` contains one **extra** property not in the source of truth (see Section 2).

Full token inventory (all confirmed PRESENT / MATCH):

**Paper (4):** `--paper-0`, `--paper-1`, `--paper-2`, `--paper-3` — MATCH

**Ink (12):** `--ink-1` through `--ink-12` — MATCH

**Brass (12):** `--brass-1` through `--brass-12` — MATCH

**Sage (12):** `--sage-1` through `--sage-12` — MATCH

**Signal (4):** `--signal-up`, `--signal-down`, `--signal-warn`, `--signal-info` — MATCH

**Semantic bg (4):** `--bg-page`, `--bg-elevated`, `--bg-recessed`, `--bg-inverse` — MATCH

**Semantic fg (8):** `--fg-primary`, `--fg-secondary`, `--fg-muted`, `--fg-faint`, `--fg-inverse`, `--fg-accent`, `--fg-link`, `--fg-link-hover` — MATCH

**Rule (3):** `--rule-strong`, `--rule-default`, `--rule-faint` — MATCH

**Border (3):** `--border-default`, `--border-strong`, `--border-focus` — MATCH

**Accent (2):** `--accent`, `--accent-fg-on` — MATCH

**Spacing (15):** `--space-0`, `--space-px`, `--space-1` through `--space-32` (skipping 7, 9, 11, 13–15, 17–19, 21–23, 25–31 per spec) — MATCH

**Radii (4):** `--radius-none`, `--radius-xs`, `--radius-sm`, `--radius-pill` — MATCH

**Shadows (5):** `--shadow-none`, `--shadow-hairline`, `--shadow-keyline`, `--shadow-menu`, `--shadow-focus` — MATCH

**Font families (3):** `--font-display`, `--font-sans`, `--font-mono` — MATCH

**Font sizes (12):** `--text-2xs` through `--text-6xl` — MATCH

**Line heights (4):** `--leading-tight`, `--leading-snug`, `--leading-normal`, `--leading-relaxed` — MATCH

**Tracking (5):** `--tracking-tighter`, `--tracking-tight`, `--tracking-normal`, `--tracking-wide`, `--tracking-widest` — MATCH

**Weights (6):** `--weight-light`, `--weight-regular`, `--weight-medium`, `--weight-semibold`, `--weight-bold`, `--weight-black` — MATCH

**Motion (6):** `--duration-instant`, `--duration-quick`, `--duration-base`, `--duration-slow`, `--ease-standard`, `--ease-emphasized` — MATCH

**Layout (4):** `--container-page`, `--container-narrow`, `--gutter`, `--grid-unit` — MATCH

---

## 2. Stale Declarations Check

`:root` properties in `design-tokens.css` that are NOT present in `colors_and_type.css`.

| Property | Value | Status |
|---|---|---|
| `--navbar-height` | `5rem` | **EXTRA** — added in `design-tokens.css` but absent from the source of truth. Comment states it is a fallback overridden at runtime by `Navbar.jsx` (introduced by EVO-025). |

**Summary:** 1 stale/diverged addition. All 114 source-of-truth properties are present; `design-tokens.css` adds 1 property beyond the declared "verbatim copy" contract.

**Note on `.t-section-index`:** `design-tokens.css` also contains the `.t-section-index` semantic class, which is absent from `colors_and_type.css`. This is a known divergence documented in the task brief (see Section 7 for usage impact).

---

## 3. `brand-` Token Search

**Search scope:** `frontend/src/index.css`, `frontend/tailwind.config.js`

**Result: ZERO occurrences of `brand-` in both files.**

No legacy `brand-` tokens are present in either file. The codebase is clean of this pattern.

---

## 4. Semantic Class Inventory

Checking which semantic type classes, rule utilities, palette classes, and accent classes from `colors_and_type.css` are present in `index.css`.

### Semantic type classes (from `colors_and_type.css`)

| Class | Present in `index.css` |
|---|---|
| `.t-display-1` | ABSENT |
| `.t-display-2` | ABSENT |
| `.t-display-light` | ABSENT |
| `.t-h1` | ABSENT |
| `.t-h2` | ABSENT |
| `.t-h3` | ABSENT |
| `.t-h4` | ABSENT |
| `.t-lead` | ABSENT |
| `.t-body` | ABSENT |
| `.t-body-sm` | ABSENT |
| `.t-mono` | ABSENT |
| `.t-mono-lg` | ABSENT |
| `.t-numeric` | ABSENT |
| `.t-label` | ABSENT |
| `.t-label-strong` | ABSENT |
| `.t-annotation` | ABSENT |
| `.t-eyebrow` | ABSENT |

**Summary: 0 of 17 semantic type classes are defined in `index.css`.** They live exclusively in `design-tokens.css` (which also contains `.t-section-index` as a stale extra). `index.css` defines its own ad-hoc variants instead (`.hero-title`, `.section-title`, `.section-subtitle`).

### Rule utilities (from `colors_and_type.css`)

| Class | Present in `index.css` |
|---|---|
| `.rule` | ABSENT |
| `.rule-strong` | ABSENT |
| `.rule-faint` | ABSENT |
| `.rule-double` | ABSENT |

**Summary: 0 of 4 rule utilities are defined in `index.css`.** They live in `design-tokens.css` only.

### Palette variation classes (from `colors_and_type.css`)

| Class | Present in `index.css` |
|---|---|
| `.pal-paper` | ABSENT |
| `.pal-mist` | ABSENT |
| `.pal-porcelain` | ABSENT |

**Summary: 0 of 3 palette classes are defined in `index.css`.** Not present anywhere in the live frontend.

### Accent variation classes (from `colors_and_type.css`)

| Class | Present in `index.css` |
|---|---|
| `.acc-brass` | ABSENT |
| `.acc-cobalt` | ABSENT |
| `.acc-oxblood` | ABSENT |
| `.acc-forest` | ABSENT |

**Summary: 0 of 4 accent classes are defined in `index.css`.** Not present anywhere in the live frontend.

### Global baseline rules (from `colors_and_type.css`)

| Rule | Present in `index.css` | Notes |
|---|---|---|
| `html { scroll-behavior: smooth; }` | PRESENT (in `@layer base`) | Extended with `scroll-snap-type`, `scroll-padding-top`, `scrollbar-width`, `scrollbar-color` |
| `body { … }` | PRESENT (in `@layer base`, using `@apply`) | Partial — see Section 8 |
| `::selection` | PRESENT | Identical values |
| `:focus-visible` | PRESENT | Identical values |

---

## 5. Tailwind Config Gap List

`frontend/tailwind.config.js` currently extends Tailwind with:
- Color scales: `paper`, `ink`, `brass`, `sage`, `signal` — PRESENT
- Font families: `display`, `sans`, `mono` — PRESENT
- `letterSpacing.widest` — PRESENT
- `opacity.88`, `opacity.40` — PRESENT
- `borderRadius.xs` — PRESENT
- `boxShadow.menu` — PRESENT

### Missing token categories

| Category | Source tokens | Tailwind config status |
|---|---|---|
| **Spacing scale** | `--space-0` through `--space-32` (15 values) | MISSING — not mapped to `theme.extend.spacing` |
| **Border radius (partial)** | `--radius-none`, `--radius-sm`, `--radius-pill` | MISSING — only `radius-xs` is present; `none`, `sm`, `pill` are absent |
| **Box shadows (partial)** | `--shadow-none`, `--shadow-hairline`, `--shadow-keyline`, `--shadow-focus` | MISSING — only `shadow-menu` is present; 4 of 5 shadows are absent |
| **Font sizes** | `--text-2xs` through `--text-6xl` (12 values) | MISSING — not mapped to `theme.extend.fontSize` |
| **Line heights** | `--leading-tight`, `--leading-snug`, `--leading-normal`, `--leading-relaxed` | MISSING — not mapped to `theme.extend.lineHeight` |
| **Tracking (partial)** | `--tracking-tighter`, `--tracking-tight`, `--tracking-normal`, `--tracking-wide` | MISSING — only `tracking-widest` is present; 4 of 5 tracking values are absent |
| **Font weights** | `--weight-light` through `--weight-black` (6 values) | MISSING — not mapped to `theme.extend.fontWeight` |
| **Motion — durations** | `--duration-instant`, `--duration-quick`, `--duration-base`, `--duration-slow` | MISSING — not mapped to `theme.extend.transitionDuration` |
| **Motion — easing** | `--ease-standard`, `--ease-emphasized` | MISSING — not mapped to `theme.extend.transitionTimingFunction` |
| **Semantic color tokens** | `--bg-page`, `--bg-elevated`, `--bg-recessed`, `--bg-inverse`, `--fg-primary`, `--fg-secondary`, `--fg-muted`, `--fg-faint`, `--fg-inverse`, `--fg-accent`, `--fg-link`, `--fg-link-hover`, `--rule-strong`, `--rule-default`, `--rule-faint`, `--border-default`, `--border-strong`, `--border-focus`, `--accent`, `--accent-fg-on` (20 values) | MISSING — none of the semantic tokens are mapped to Tailwind |
| **Signal colors** | `--signal-up`, `--signal-down`, `--signal-warn`, `--signal-info` | PRESENT in `colors.signal.*` |
| **Layout tokens** | `--container-page`, `--container-narrow`, `--gutter`, `--grid-unit` | MISSING — not mapped to any Tailwind extension |

**Total missing categories: 10 out of 12 token categories are partially or fully absent from the Tailwind config.**

---

## 6. Font File Verification

All four woff2 files declared in `fonts.css` were verified to exist at their declared paths.

| File | Declared path | Status |
|---|---|---|
| `inter-latin.woff2` | `frontend/src/assets/fonts/inter-latin.woff2` | PRESENT |
| `inter-latin-ext.woff2` | `frontend/src/assets/fonts/inter-latin-ext.woff2` | PRESENT |
| `jetbrains-mono-latin.woff2` | `frontend/src/assets/fonts/jetbrains-mono-latin.woff2` | PRESENT |
| `jetbrains-mono-latin-ext.woff2` | `frontend/src/assets/fonts/jetbrains-mono-latin-ext.woff2` | PRESENT |

**Result: all 4 font files are present. No missing font assets.**

---

## 7. Component Usage Search — `.t-section-index`

**Search scope:** `frontend/src/**/*.{jsx,js,css}`

**Result: 4 usages found in production components.**

| File | Line | Context |
|---|---|---|
| `frontend/src/components/BenefitsGrid.jsx` | 19 | `<p className="t-section-index">{t('benefits.sectionIndex')}</p>` |
| `frontend/src/components/PartnershipSection.jsx` | 12 | `<p className="t-section-index">{t('partnership.sectionIndex')}</p>` |
| `frontend/src/components/RoadmapSection.jsx` | 11 | `<p className="t-section-index">{t('roadmap.sectionIndex')}</p>` |
| `frontend/src/components/MiniComparator/MiniComparator.jsx` | 29 | `<p className="t-section-index">{t('comparator.sectionIndex')}</p>` |

**Impact:** `.t-section-index` is actively used in 4 components. It exists only in `design-tokens.css` (not in `colors_and_type.css`). Any cleanup of `design-tokens.css` to strict verbatim parity would break these 4 components unless a migration path is provided (e.g., move to `index.css` under `@layer components`, or replace with `.t-eyebrow` from the source of truth, as the task brief suggests).

---

## 8. Body Baseline Gap

**`body` in `colors_and_type.css` (source of truth):**
```css
body {
  background: var(--bg-page);
  color: var(--fg-primary);
  font-family: var(--font-sans);
  font-size: var(--text-base);
  font-weight: var(--weight-regular);
  line-height: var(--leading-normal);
  letter-spacing: var(--tracking-tight);
  font-feature-settings: 'ss01', 'ss02', 'cv11';
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
```

**`body` in `index.css` (live):**
```css
body {
  @apply bg-paper-1 text-ink-11 font-sans antialiased;
  font-feature-settings: 'ss01', 'ss02', 'cv11';
}
```

### Gap analysis

| Property | Source of truth | Live `index.css` | Status |
|---|---|---|---|
| `background` | `var(--bg-page)` | `bg-paper-1` (`var(--paper-1)` via Tailwind) | FUNCTIONAL MATCH — `--bg-page` resolves to `var(--paper-1)`, so the rendered value is identical, but the semantic token layer is bypassed |
| `color` | `var(--fg-primary)` | `text-ink-11` (`var(--ink-11)` via Tailwind) | FUNCTIONAL MATCH — `--fg-primary` resolves to `var(--ink-11)`, semantic layer bypassed |
| `font-family` | `var(--font-sans)` | `font-sans` (via Tailwind `var(--font-sans)`) | MATCH |
| `font-size` | `var(--text-base)` | not declared (Tailwind default `text-base` = `1rem` = `16px`) | DIVERGED — source uses `var(--text-base)` = `15px`; live body has no explicit font-size override, so it falls back to browser/Tailwind default `16px` |
| `font-weight` | `var(--weight-regular)` = `400` | not declared | MISSING — not set in body rule |
| `line-height` | `var(--leading-normal)` = `1.45` | not declared | MISSING — Tailwind default `leading-normal` = `1.5`, not set in body rule |
| `letter-spacing` | `var(--tracking-tight)` = `-0.015em` | not declared | MISSING — not set in body rule |
| `font-feature-settings` | `'ss01', 'ss02', 'cv11'` | `'ss01', 'ss02', 'cv11'` | MATCH |
| `-webkit-font-smoothing` | `antialiased` | `antialiased` (via `@apply antialiased`) | MATCH |
| `text-rendering` | `optimizeLegibility` | not declared | MISSING — not set in body rule |

**Summary of body baseline gaps (4 missing / diverged properties):**

1. `font-size`: live body is missing explicit `font-size: var(--text-base)` — falls back to `16px` instead of the intended `15px`
2. `font-weight`: `font-weight: var(--weight-regular)` not set on body
3. `line-height`: `line-height: var(--leading-normal)` not set on body — Tailwind default `1.5` differs from spec `1.45`
4. `letter-spacing`: `letter-spacing: var(--tracking-tight)` not set on body — `-0.015em` tracking is absent
5. `text-rendering`: `text-rendering: optimizeLegibility` not set on body
6. `background` and `color` use raw ramp tokens (`paper-1`, `ink-11`) instead of semantic tokens (`bg-page`, `fg-primary`) — functionally equivalent but bypasses the semantic layer, making palette-switching (`.pal-*`) non-functional on the `body` rule

---

## Summary Table

| Check | Result |
|---|---|
| Token parity (`:root`) | 114/114 tokens match; 1 extra in live file (`--navbar-height`) |
| Stale declarations | 1 extra property in `design-tokens.css`: `--navbar-height` |
| `.t-section-index` in `design-tokens.css` | Present (stale vs. source of truth); 4 active usages in components |
| `brand-` search | 0 occurrences in `index.css` and `tailwind.config.js` |
| Semantic type classes in `index.css` | 0 of 17 present |
| Rule utilities in `index.css` | 0 of 4 present |
| Palette classes in `index.css` | 0 of 3 present |
| Accent classes in `index.css` | 0 of 4 present |
| Tailwind config — missing categories | 10 of 12 categories partially or fully absent |
| Font files | 4 of 4 present |
| Body baseline gaps | 5 missing properties (`font-size`, `font-weight`, `line-height`, `letter-spacing`, `text-rendering`); 2 semantic-layer bypasses |
