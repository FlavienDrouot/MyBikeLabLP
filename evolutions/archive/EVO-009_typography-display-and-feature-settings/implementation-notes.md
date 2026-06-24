# Implementation Notes — EVO-009

## TASK-001 — font-feature-settings on body

**File modified:** `frontend/src/index.css`

**Design decisions**
- Declaration placed after `@apply` inside the `@layer base body` block — plain CSS property, not `@apply`, because no Tailwind utility covers arbitrary `font-feature-settings` values.
- Single-quote string values (`'ss01'`) are spec-correct CSS; toolchains may normalize to double quotes on build — both are valid.

**Deviations:** None.

**Open questions**
- `design-tokens.css` carries a redundant `font-feature-settings` on `body` that is silently overridden by `@layer base`. If the two files ever diverge (e.g., a tag is added in `design-tokens.css`), the `index.css` value wins without warning. Consider a cleanup pass to remove the redundant declaration from `design-tokens.css` in a future evolution.

---

## TASK-002 — .section-title refactor

**File modified:** `frontend/src/index.css`

**Design decisions**
- `.t-h1` cannot be used with `@apply` (it is a plain CSS class, not a Tailwind utility). The four properties are inlined directly: `font-weight: 500`, `font-size: var(--text-3xl)`, `line-height: var(--leading-tight)`, `letter-spacing: var(--tracking-tighter)`.
- `@apply text-ink-10` is retained for color — `.t-h1` is intentionally color-agnostic.
- Responsive size ramp (`sm:text-4xl`) removed: it would override `.t-h1`'s `font-size` at the `sm` breakpoint via Tailwind's `@layer utilities`, defeating the DS class.
- `BenefitsGrid.jsx`, `RoadmapSection.jsx`, `MiniComparator.jsx` — not modified. All three continue to consume `.section-title` unchanged.

**Tradeoffs**
- Inlining the token variable names creates a light coupling to `design-tokens.css`. If a token is renamed, `.section-title` must be updated manually. No `composes` mechanism is available in plain CSS without a preprocessor.
- Section headings are now fixed at `--text-3xl` (44 px) on all viewports, up from 30 px (base) / 36 px (`sm+`) with the Tailwind ramp. This is the intended DS size.

**Open questions**
- Visual QA should confirm `--text-3xl` resolves correctly in the running app (its definition lives in `design-tokens.css`).

---

## TASK-003 — Hero H1 to .t-display-1

**File modified:** `frontend/src/components/Hero.jsx`

**Change:** `"mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ink-10"` → `"mt-6 t-display-1 text-ink-10"`

**Design decisions**
- `.t-display-1` owns all typographic properties (font-family, font-weight 800, font-size `--text-6xl`, line-height 0.9, letter-spacing -0.045em). No inline utilities duplicate these.
- `text-ink-10` retained — `.t-display-1` deliberately omits color for reusability.
- `mt-6` retained — layout/spacing is outside the typography token's remit.
- The `<span className="text-brass-8">` inside the H1 was not modified.

**Tradeoffs**
- Fixed `--text-6xl` replaces the previous responsive ramp (`text-4xl` → `sm:text-5xl` → `lg:text-6xl`). Any future responsive display variant belongs in `design-tokens.css`, not the component.
- `line-height: 0.9` (from `.t-display-1`) is tighter than Tailwind defaults — intentional per the DS display-heading spec.

**Open questions**
- The `<br className="hidden sm:block" />` inside the H1 was designed for the old multi-size ramp. With a fixed large font, this line-break may produce unexpected layout on narrow viewports. Worth a visual QA pass on mobile.

---

## TASK-004 — PartnershipSection H2 to .t-h1

**File modified:** `frontend/src/components/PartnershipSection.jsx`

**Change:** `"mt-2 text-3xl sm:text-4xl font-bold tracking-tight"` → `"mt-2 t-h1"`

**Design decisions**
- No color class added — H2 correctly inherits `text-paper-1` from the parent `<section bg-ink-12>`. Adding `.t-h1` does not disturb this inheritance.
- `mt-2` retained — layout/spacing.
- `font-weight` changes from 700 (`font-bold`) to 500 (`.t-h1`). Intentional per spec.

**Deviations:** None.

**Tradeoffs**
- Same as TASK-002: responsive size ramp removed to avoid Tailwind utility overriding `.t-h1`'s font-size. Heading now renders at `--text-3xl` on all breakpoints.

---

## Global notes

- All four tasks are independent; none depends on another. They can be rolled back individually via `git checkout -- <file>`.
- No logic change in any task — all changes are CSS class substitutions.
- Static validation: `grep -r "font-bold\|tracking-tight" frontend/src/components/Hero.jsx frontend/src/components/PartnershipSection.jsx` should return zero matches on `<h1>`/`<h2>` elements.
- Remaining manual QA: run `npm run dev`, open the landing page, and verify computed styles in DevTools per the acceptance criteria in `tech-specs.md` section 6.
