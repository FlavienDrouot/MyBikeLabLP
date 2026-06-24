# TASK-002 — Migrate Navbar.jsx to design system tokens

## Objective

Rewrite `frontend/src/components/Navbar.jsx` so all color, typography, and interactive state classes use only design system tokens. Replace the current `<img src={logoWordmark}>` with the `LogoMark` inline SVG component created in TASK-001. Preserve all existing behavior (sticky positioning, `--navbar-height` ResizeObserver, mobile menu toggle, i18n wiring, language toggle).

## Required context

### Current file: `frontend/src/components/Navbar.jsx`

The current Navbar (reproduced in full below for reference):

```jsx
import { useLayoutEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Icon from './ui/Icon';
import logoWordmark from '../assets/logo-wordmark.svg';

const LANGUAGES = ['en', 'fr'];

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const current = i18n.language?.split('-')[0] ?? 'en';

  return (
    <div className="flex items-center gap-0.5" role="group" aria-label="Language">
      {LANGUAGES.map((lang) => {
        const isActive = current === lang;
        return (
          <button
            key={lang}
            type="button"
            onClick={() => i18n.changeLanguage(lang)}
            aria-pressed={isActive}
            className={`px-2 py-1 rounded-xs text-xs font-semibold uppercase tracking-wide transition-colors ${
              isActive
                ? 'bg-brass-7 text-paper-0'
                : 'text-ink-8 hover:text-ink-11'
            }`}
            style={{
              transition:
                'color var(--duration-quick) var(--ease-standard), background-color var(--duration-quick) var(--ease-standard)',
            }}
          >
            {lang.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
};

const Navbar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef(null);

  const close = () => setIsOpen(false);

  useLayoutEffect(() => {
    const headerEl = headerRef.current;
    if (!headerEl) return undefined;
    const root = document.documentElement;
    const write = () => {
      root.style.setProperty('--navbar-height', `${headerEl.offsetHeight}px`);
    };
    write();
    if (typeof ResizeObserver === 'undefined') {
      return () => { root.style.removeProperty('--navbar-height'); };
    }
    const ro = new ResizeObserver(() => { write(); });
    ro.observe(headerEl);
    return () => { ro.disconnect(); root.style.removeProperty('--navbar-height'); };
  }, []);

  return (
    <header ref={headerRef} className="sticky top-0 z-40 w-full border-b border-ink-3 bg-paper-1/88 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <img src={logoWordmark} alt="MyBikeLab" className="h-8 w-auto" />
        </a>
        <nav className="hidden md:flex items-center gap-1">
          <a href="#tool" className="btn-ghost">{t('nav.tool')}</a>
          <a href="#roadmap" className="btn-ghost">{t('nav.roadmap')}</a>
          <a href="#partnerships" className="btn-ghost">{t('nav.partnerships')}</a>
        </nav>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <a href="#contact" className="btn-primary">{t('nav.contact')}</a>
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            className="md:hidden inline-flex items-center justify-center rounded-xs p-2 text-ink-11 hover:text-brass-8 focus-visible:ring-2 focus-visible:ring-brass-8"
            style={{ transition: 'color var(--duration-quick) var(--ease-standard)' }}
          >
            {isOpen ? <Icon as={X} size={24} aria-hidden="true" /> : <Icon as={Menu} size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-ink-3 bg-paper-1">
          <nav className="container-page flex flex-col py-2">
            <a href="#tool" onClick={close} className="btn-ghost justify-start">{t('nav.tool')}</a>
            <a href="#roadmap" onClick={close} className="btn-ghost justify-start">{t('nav.roadmap')}</a>
            <a href="#partnerships" onClick={close} className="btn-ghost justify-start">{t('nav.partnerships')}</a>
            <div className="px-2 py-2">
              <LanguageToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
```

### Token mapping to apply

These are the changes required. Everything not listed is kept as-is.

**Brand mark (logo area):**
- Remove: `import logoWordmark from '../assets/logo-wordmark.svg'`
- Add: `import LogoMark from './ui/LogoMark'`
- Replace `<img src={logoWordmark} alt="MyBikeLab" className="h-8 w-auto" />` with:
  ```jsx
  <LogoMark size={26} />
  <span className="text-sm font-semibold text-fg-primary">MyBikeLab</span>
  ```
  The `<a href="#top">` wrapper keeps its `className="flex items-center gap-2"`.

**Header background (sticky bar):**
- The `<header>` currently has `bg-paper-1/88 backdrop-blur border-b border-ink-3`.
- Target: the design system specifies `background: rgba(246,244,239,0.88); backdrop-filter: blur(8px)` for the sticky Navbar (from `design-system/README.md` Borders, shadows, transparency section and `IMPLEMENTATION-GUIDE.md` component checklist). `bg-paper-1` resolves to `var(--paper-1)` which is `#f6f4ef`. The `/88` opacity modifier produces the correct rgba value. `backdrop-blur` (Tailwind default) produces `blur(8px)`. The current classes are already correct — confirm and keep them.
- Border: `border-b border-ink-3` is a primitive-scale class. Migrate to semantic token: `border-b border-border-default` (maps to `var(--border-default)`). This satisfies FR-013 and the "no raw primitive scale" intent when semantic tokens exist.

**Navigation links (desktop):**
- Current: `className="btn-ghost"` — this is already a design system component class defined in `index.css` as `text-ink-11 hover:text-brass-8`. This is correct and matches FR-003. Keep as-is.

**Contact CTA:**
- Current: `className="btn-primary"` — already correct per FR-004 (`btn-primary` = brass fill, paper text). Keep as-is.

**Hamburger button:**
- Current: `text-ink-11 hover:text-brass-8 focus-visible:ring-2 focus-visible:ring-brass-8`
- `text-ink-11` is a primitive-scale class. Migrate to: `text-fg-primary` (semantic equivalent).
- `hover:text-brass-8` can remain (brass-8 = `var(--fg-accent)` hover, consistent with design system). Alternatively `hover:text-fg-accent` is the semantic form — use `hover:text-fg-accent` for strict semantic compliance.
- `focus-visible:ring-brass-8` — replace with `focus-visible:ring-border-focus` (semantic token for focus ring).

**Mobile menu panel background:**
- Current: `bg-paper-1` (primitive). Migrate to `bg-bg-elevated` (semantic token for card/elevated surface).
- Current: `border-t border-ink-3` (primitive). Migrate to `border-t border-border-default`.

**LanguageToggle — active state:**
- Current active: `bg-brass-7 text-paper-0` — `bg-brass-7` is the accent fill; use `bg-accent text-accent-fg-on` (semantic). `bg-accent` maps to `var(--accent)` = brass-7. `text-accent-fg-on` maps to `var(--accent-fg-on)`.
- Current inactive: `text-ink-8 hover:text-ink-11` — `text-ink-8` is a primitive mid-tone; migrate to `text-fg-muted hover:text-fg-primary` (semantic equivalent of a muted-to-primary transition).

**Summary of class changes:**

| Location | Before | After |
|---|---|---|
| `<header>` | `border-b border-ink-3` | `border-b border-border-default` |
| Brand mark | `<img src={logoWordmark}...>` | `<LogoMark size={26} /><span...>` |
| Hamburger button | `text-ink-11 hover:text-brass-8 focus-visible:ring-2 focus-visible:ring-brass-8` | `text-fg-primary hover:text-fg-accent focus-visible:ring-2 focus-visible:ring-border-focus` |
| Mobile menu div | `bg-paper-1 border-t border-ink-3` | `bg-bg-elevated border-t border-border-default` |
| LanguageToggle active | `bg-brass-7 text-paper-0` | `bg-accent text-accent-fg-on` |
| LanguageToggle inactive | `text-ink-8 hover:text-ink-11` | `text-fg-muted hover:text-fg-primary` |

### Behavioral logic to preserve unchanged

- `useLayoutEffect` + `ResizeObserver` for `--navbar-height` — **copy verbatim, do not modify**
- `useState(false)` for `isOpen`
- `close` function passed to mobile nav link `onClick` handlers
- `aria-expanded`, `aria-controls`, `aria-label` on hamburger button
- `role="group"` and `aria-label="Language"` on LanguageToggle container

### Design system constraints applicable to this component (from ui-guidelines.md and IMPLEMENTATION-GUIDE.md)

- **Interactive states:** every interactive element must implement the full state cycle. The hamburger button and language toggle buttons already implement hover and focus — keep them. Disabled state is not applicable here (no element is ever disabled in the Navbar).
- **Animation:** color/border transitions use `var(--duration-quick) var(--ease-standard)` — keep existing inline `style` transition values. Do not switch to Tailwind `transition-colors` class which uses default easing.
- **Accessibility:** the hamburger button has `aria-expanded` and `aria-label` — keep these. The `<nav>` elements are present for semantic structure.
- **No bounce, no spring** — existing transitions are CSS color/background transitions (valid per guidelines).
- **Reduced motion:** the `@media (prefers-reduced-motion: reduce)` rule in `index.css` already zeroes all transition durations globally — no per-component handling needed.
- **WCAG contrast:** `btn-primary` (brass-7 on ink-12) must maintain 4.5:1 ratio — this is design-system-guaranteed, no change needed.
- **Backdrop filter:** only permitted on sticky Navbar — correct and unchanged.

## Potentially impacted files

- `frontend/src/components/Navbar.jsx` (primary target)

## Inputs

- `frontend/src/components/ui/LogoMark.jsx` (created in TASK-001)
- `frontend/src/index.css` — defines `.btn-primary`, `.btn-ghost`, `.container-page`
- `frontend/tailwind.config.js` — defines `bg-accent`, `text-accent-fg-on`, `text-fg-primary`, `text-fg-muted`, `text-fg-accent`, `border-border-default`, `border-border-focus`

## Expected outputs

An updated `frontend/src/components/Navbar.jsx` where:
- The `logoWordmark` img import is removed
- `LogoMark` is imported from `./ui/LogoMark`
- The brand mark renders as `<LogoMark size={26} />` + wordmark `<span>`
- All primitive-scale color classes are replaced with semantic token equivalents as specified in the mapping table above
- No `brand-*`, `text-blue-*`, `hover:text-blue-*`, raw hex, `#fff`, or `#000` present
- All behavioral logic is preserved exactly

## Constraints

- Do not modify the `useLayoutEffect` block — copy it verbatim
- Do not rename, remove, or add any i18n keys
- The `container-page`, `btn-ghost`, `btn-primary` class names come from `index.css` and must not be inlined or replaced
- Transitions must use `var(--duration-quick) var(--ease-standard)` — keep inline `style` transition definitions as-is
- `rounded-xs` on buttons is correct (`2px` per design system) — keep as-is
- The `h-16` height on the inner container row is a layout token — keep as-is

## Dependencies

TASK-001

## Validation criteria

- [ ] Static grep of `Navbar.jsx` for `brand-`, `text-blue-`, `hover:text-blue-`, `#[0-9a-fA-F]{3,6}`, `#fff`, `#000` returns zero matches
- [ ] `import logoWordmark` is removed; `import LogoMark from './ui/LogoMark'` is present
- [ ] The `<header>` element renders with `bg-paper-1/88 backdrop-blur` (translucent paper surface confirmed in devtools)
- [ ] `--navbar-height` is set to the correct pixel value after page load (check with `getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')`)
- [ ] Desktop: brand mark (SVG), three nav links, language toggle, and contact CTA render in a single horizontal row
- [ ] Desktop: nav link hover shows brass color transition
- [ ] Desktop: contact CTA shows brass fill
- [ ] Mobile (375px): hamburger icon visible; nav links hidden; hamburger tap opens mobile menu panel
- [ ] Mobile: tapping any nav link closes the panel
- [ ] Mobile: language toggle is visible in the open panel
- [ ] EN/FR language switch updates all Navbar labels correctly
- [ ] Navbar remains sticky at top while scrolling full page length

## Tests to implement

### Unit

No new test logic is introduced in this task. The updated component is covered by the updated tests in TASK-004. The `--navbar-height` behavior tests in `Navbar.test.jsx` will continue to pass as-is because the `useLayoutEffect` + `headerRef` pattern is preserved.

### Integration

- `npm run build` — no build errors
- `vitest run` — all existing `Navbar.test.jsx` tests pass (they will fail on the `<img>` assertion until TASK-004 updates it, so TASK-004 must land before CI is green)
