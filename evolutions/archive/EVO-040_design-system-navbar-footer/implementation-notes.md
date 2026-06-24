# Implementation Notes — EVO-040

## TASK-001 — Create shared LogoMark.jsx

**Design decisions:**
- No React import — Vite + React 19 with the automatic JSX runtime does not require it; consistent with existing `Icon.jsx` convention.
- No PropTypes — prop type is inferred from the default value (`size = 28`).
- No CSS classes or inline styles on `<svg>` — callers control color via `currentColor` and size via the `size` prop.
- Stroke widths kept at the ui_kit's prescribed values (1.0 for structural lines, 1.6 for the M-path) — not normalized to Lucide's standard 1.4.

**Validation:** All criteria passed. `npm run build` succeeds.

---

## TASK-002 — Migrate Navbar.jsx

**Token changes applied:**

| Location | Before | After |
|---|---|---|
| Import | `import logoWordmark from '../assets/logo-wordmark.svg'` | `import LogoMark from './ui/LogoMark'` |
| Brand mark | `<img src={logoWordmark} … />` | `<LogoMark size={26} /><span className="text-sm font-semibold text-fg-primary">MyBikeLab</span>` |
| Header border | `border-ink-3` | `border-border-default` |
| Hamburger button | `text-ink-11 hover:text-brass-8 focus-visible:ring-brass-8` | `text-fg-primary hover:text-fg-accent focus-visible:ring-border-focus` |
| Mobile menu panel | `bg-paper-1 border-ink-3` | `bg-bg-elevated border-border-default` |
| LanguageToggle active | `bg-brass-7 text-paper-0` | `bg-accent text-accent-fg-on` |
| LanguageToggle inactive | `text-ink-8 hover:text-ink-11` | `text-fg-muted hover:text-fg-primary` |

**Preserved verbatim:** `useLayoutEffect` + `ResizeObserver` block, all ARIA attributes, `bg-paper-1/88 backdrop-blur`, `container-page`/`btn-ghost`/`btn-primary` shared classes, inline `style` transition values.

**Note:** `transition-colors` on LanguageToggle buttons intentionally left — harmless when overridden by inline `style`; removal would be out of scope.

**Validation:** All static grep checks passed. No forbidden patterns remain.

---

## TASK-003 — Migrate Footer.jsx

**Token changes applied:**
- `import logoMark` removed; `import LogoMark from './ui/LogoMark'` added.
- Root section: `bg-ink-12` → `bg-bg-inverse`.
- Brand mark: `<img brightness-0 invert>` → `<LogoMark size={28} />` inside `text-fg-inverse` container.
- Wordmark: `text-paper-0` → `text-fg-inverse`.
- Copyright: `text-ink-6` → `text-fg-muted`.
- Nav link base: `text-ink-6` → `text-fg-muted`.
- Nav link hover: `hover:text-brass-7` → `hover:text-fg-accent`.

**Design decisions:**
- `bg-bg-inverse` used instead of primitive `bg-ink-11/12` — semantic token survives future theme changes.
- Brand block split into two stacked divs (mark+wordmark row / copyright row) matching the ui_kit reference structure.
- `text-fg-inverse` scoped to the mark+wordmark flex row only, so it does not inadvertently override `text-fg-muted` on the copyright line.
- Nav link hover transition applied via inline `style` prop per task spec — avoids new CSS class.

**Validation:** All static grep checks passed. No forbidden patterns remain.

---

## TASK-004 — Update test assertions

**Changes:** First `it` block in both test files updated.

- Test renamed from `renders logo as an img element (not hardcoded markup)` → `renders the brand mark as an inline SVG with wordmark text` in both files.
- `toContain('<img')` assertion replaced with: `toContain('<svg')`, `toContain('aria-hidden="true"')`, `toContain('MyBikeLab')`, `not.toContain('<img')`.
- All `--navbar-height CSS variable sync` tests (Navbar) and `renders copyright notice` test (Footer) unchanged.

**Test results:** 6 tests pass across both files (4 Navbar + 2 Footer). Zero failures.
