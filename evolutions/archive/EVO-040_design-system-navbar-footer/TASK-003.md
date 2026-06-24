# TASK-003 — Migrate Footer.jsx to design system tokens

## Objective

Rewrite `frontend/src/components/Footer.jsx` so all color classes use only design system tokens. Replace the current `<img src={logoMark} className="brightness-0 invert">` with the `LogoMark` inline SVG component from TASK-001. Add a separate brand wordmark `<span>` alongside the mark. Preserve i18n wiring, copyright line, and navigation links. No behavioral logic changes.

## Required context

### Current file: `frontend/src/components/Footer.jsx`

```jsx
import { useTranslation } from 'react-i18next';
import logoMark from '../assets/logo-mark.svg';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-ink-11">
      <hr className="rule rule-strong" />
      <div className="container-page py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src={logoMark} alt="MyBikeLab" className="h-7 w-auto brightness-0 invert" />
          <span className="text-sm text-paper-2">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </span>
        </div>
        <nav className="flex items-center gap-5 text-sm text-paper-2">
          <a href="#tool" className="hover:text-brass-7">{t('footer.nav.tool')}</a>
          <a href="#roadmap" className="hover:text-brass-7">{t('footer.nav.roadmap')}</a>
          <a href="#partnerships" className="hover:text-brass-7">{t('footer.nav.partnerships')}</a>
          <a href="#contact" className="hover:text-brass-7">{t('footer.nav.contact')}</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
```

### Token mapping to apply

**Footer background:**
- Current: `bg-ink-11` (primitive scale)
- Target: `bg-bg-inverse` (semantic token, maps to `var(--bg-inverse)` which resolves to `ink-12` near-black)
- Note: `var(--bg-inverse)` is the correct semantic choice per the IMPLEMENTATION-GUIDE token table ("Dark section (footer, contact) → `var(--bg-inverse)`"). This replaces the primitive `ink-11` with the semantic inverse surface token.

**Top rule:**
- Current: `<hr className="rule rule-strong" />` — this is a design system component class defined in `index.css`. It is correct and already uses token-based colors. Keep as-is.

**Brand block restructuring:**
- The current brand `<div>` contains the logo image and copyright text on the same line. The ui_kit reference `design-system/ui_kits/landing/Footer.jsx` shows a `footer-brand` sub-block (mark + wordmark) and a separate `footer-meta` sub-block (copyright). Follow this structure:

  ```jsx
  <div>
    <div className="flex items-center gap-2 text-fg-inverse">
      <LogoMark size={28} />
      <span className="text-sm font-semibold">MyBikeLab</span>
    </div>
    <div className="mt-1 text-xs text-fg-muted">
      {t('footer.copyright', { year: new Date().getFullYear() })}
    </div>
  </div>
  ```

  Key points:
  - The outer `<div className="text-fg-inverse">` sets `color` on the container so `LogoMark`'s `currentColor` inherits the paper-side foreground token.
  - `text-fg-inverse` maps to `var(--fg-inverse)` (the light foreground for use on dark/inverse surfaces).
  - Copyright text uses `text-fg-muted` (muted label, slightly dimmer than `fg-inverse`).
  - Remove `alt="MyBikeLab"` from the img (it's gone); the `LogoMark` SVG has `aria-hidden="true"` — the wordmark span provides the text label.

**Navigation links:**
- Current: `text-paper-2` base color, `hover:text-brass-7` hover
- `text-paper-2` is a primitive scale class. Migrate to `text-fg-inverse` (the correct foreground for inverse surfaces).
- `hover:text-brass-7` hover — `brass-7` is the accent fill; use `hover:text-fg-accent` (semantic accent foreground, maps to `var(--fg-accent)` = brass-8 hover tone, slightly darker than brass-7 for legibility).
- The `<nav>` inherits base color via the class applied to the link elements — add color per-link or on the `<nav>` container. Add transition for hover per design system motion rules.

**Transition on nav links:**
- The current Footer has no explicit transition on the nav links — they snap between colors. Per design system motion (`IMPLEMENTATION-GUIDE.md`): color hover transitions use `var(--duration-quick) var(--ease-standard)`. Add an inline `style` or use a wrapper with the transition.
- Apply via a shared class or inline style on each `<a>`:
  ```jsx
  style={{ transition: 'color var(--duration-quick) var(--ease-standard)' }}
  ```

**Outer container flex layout (responsive):**
- Current: `flex flex-col sm:flex-row items-center justify-between gap-4`
- Per FR-011: desktop = horizontal row, mobile = column stack. The `sm:flex-row` breakpoint is the `sm` (640px) Tailwind breakpoint. The PRD specifies "mobile breakpoints" for the column stack. The existing `flex-col sm:flex-row` pattern is correct. Keep as-is.

**Summary of class changes:**

| Location | Before | After |
|---|---|---|
| `<footer>` | `bg-ink-11` | `bg-bg-inverse` |
| Logo | `<img ... className="brightness-0 invert">` | `<LogoMark size={28} />` inside `text-fg-inverse` container |
| Copyright text | `text-sm text-paper-2` (inline with logo) | `text-xs text-fg-muted` in separate stacked div |
| Nav link base color | `text-sm text-paper-2` on `<nav>` | `text-sm text-fg-inverse` on `<nav>` |
| Nav link hover | `hover:text-brass-7` | `hover:text-fg-accent` + transition style |
| Nav link transition | (none) | inline `style` with `color var(--duration-quick) var(--ease-standard)` |

### i18n keys (unchanged)

- `footer.copyright` with `{ year: new Date().getFullYear() }` — keep exactly
- `footer.nav.tool`, `footer.nav.roadmap`, `footer.nav.partnerships`, `footer.nav.contact` — keep exactly

### Design system constraints applicable to this component (from ui-guidelines.md and IMPLEMENTATION-GUIDE.md)

- **Inverse surface rule:** dark section uses `var(--bg-inverse)` background. Text on inverse surfaces uses `var(--fg-inverse)` for primary legibility, `var(--fg-muted)` for secondary. This ensures correct contrast without hardcoding light colors.
- **No pure black:** `bg-ink-11` is being replaced with `bg-bg-inverse` (which resolves to `ink-12`, the near-black at `#0e0f0c`). This is correct per the "no pure #000000" rule.
- **No gradient, no shadow on footer:** the footer is a flat inverse card. No shadow, no gradient. The existing `rule-strong` `<hr>` at the top is the correct visual separator.
- **Interactive states on nav links:** hover with brass accent color transition — implemented via `hover:text-fg-accent` + `var(--duration-quick)` transition. Focus: `:focus-visible` is handled globally in `index.css` (`outline: 2px solid var(--brass-8)`), no per-link focus styling needed.
- **Disabled state:** not applicable (no nav link is ever disabled).
- **`currentColor` for LogoMark:** the `<LogoMark>` component must be rendered inside a container that has `text-fg-inverse` (or any explicit `color`) set, so `currentColor` resolves to the paper-side foreground. The `text-fg-inverse` class on the brand block div handles this.
- **No emoji, no em-dash in prose:** the copyright line uses the `©` character (not an emoji) and a period. Keep it.
- **Responsive layout:** `flex-col sm:flex-row` is the correct responsive pattern for the footer outer row. No change.
- **Animation:** only color transitions permitted; keep under 300ms. `var(--duration-quick)` = 140ms. Correct.

## Potentially impacted files

- `frontend/src/components/Footer.jsx` (primary target)

## Inputs

- `frontend/src/components/ui/LogoMark.jsx` (created in TASK-001)
- `design-system/ui_kits/landing/Footer.jsx` — structural reference
- `frontend/src/index.css` — defines `.rule`, `.rule-strong`, `.container-page`
- `frontend/tailwind.config.js` — defines `bg-bg-inverse`, `text-fg-inverse`, `text-fg-muted`, `text-fg-accent`

## Expected outputs

An updated `frontend/src/components/Footer.jsx` where:
- `logoMark` img import is removed
- `LogoMark` is imported from `./ui/LogoMark`
- The footer background uses `bg-bg-inverse`
- The brand block contains `<LogoMark size={28} />` + wordmark `<span>` + copyright in a vertically stacked sub-block
- Navigation links use `text-fg-inverse hover:text-fg-accent` with a `var(--duration-quick)` color transition
- No `brand-*`, `text-blue-*`, `hover:text-blue-*`, `text-paper-*`, `bg-ink-*`, raw hex, `#fff`, or `#000` present
- All i18n keys are preserved exactly

## Constraints

- Do not rename or remove any `t('footer.*')` translation key calls
- The `rule` and `rule-strong` classes on `<hr>` come from `index.css` — keep as-is
- `container-page` comes from `index.css` — keep as-is
- `py-10` and `gap-4` spacing utilities are acceptable (standard Tailwind spacing, no semantic spacing token conflict at these values)
- The `sm:flex-row` breakpoint for responsive reflow is correct per FR-011 — keep as-is

## Dependencies

TASK-001

## Validation criteria

- [ ] Static grep of `Footer.jsx` for `brand-`, `text-blue-`, `hover:text-blue-`, `#[0-9a-fA-F]{3,6}`, `#fff`, `#000`, `brightness-0`, `bg-ink-`, `text-paper-` returns zero matches
- [ ] `import logoMark` is removed; `import LogoMark from './ui/LogoMark'` is present
- [ ] Footer renders on a dark inverse surface (`var(--bg-inverse)` near-black background confirmed in devtools)
- [ ] `LogoMark` SVG mark is visible as a light element on the dark surface (inherits `text-fg-inverse` color via `currentColor`)
- [ ] Wordmark "MyBikeLab" appears in light text beside the mark
- [ ] Copyright line appears below or beside the brand block in muted light text
- [ ] Four nav links render in a horizontal row at desktop; each shows brass accent color on hover
- [ ] Footer reflowes to column layout on 375px viewport (brand block above, nav links below)
- [ ] EN/FR language switch updates all Footer nav link labels and copyright text correctly
- [ ] No raw key string (e.g., `footer.nav.tool`) visible in either language

## Tests to implement

### Unit

No new test logic is introduced in this task. The updated component is covered by the updated tests in TASK-004.

### Integration

- `npm run build` — no build errors
- `vitest run` — the "renders copyright notice" test in `Footer.test.jsx` will continue to pass if the copyright line still renders `{t('footer.copyright', { year: ... })}` (confirmed: i18n key is preserved). The "renders logo as an img element" test will fail until TASK-004 updates it.
