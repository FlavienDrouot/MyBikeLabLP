# TASK-005 — Add `LanguageToggle` to Navbar and translate Navbar strings

## Objective

Add a language toggle (EN / FR) to the Navbar — visible in the desktop nav row and in the mobile drawer. Translate all hardcoded Navbar strings through `useTranslation`. The toggle switches the interface language immediately without a page reload.

## Required context

- **File**: `src/components/Navbar.jsx`
- **i18n init**: provided by `src/i18n.js` (TASK-001). Use `useTranslation` from `react-i18next`.
- **Toggle behavior**: clicking a language option calls `i18next.changeLanguage(lang)`. The selected language is persisted automatically by the browser-languagedetector plugin (localStorage key `'mybikelab_lang'`). No Redux dispatch needed.
- **Active language**: read from `i18next.language` (the resolved language code, e.g. `'en'` or `'fr'`).
- **Toggle labels**: `"EN"` and `"FR"` — these are fixed two-letter labels, language-neutral. They are present in `en.json` as `nav.lang.en` and `nav.lang.fr` but their value is always the same (`"EN"`, `"FR"`) regardless of the active language. Hardcoding them or using the translation key are both acceptable.
- **Active state styling**: the active language button must be visually distinct. Use a styling treatment consistent with the existing design system: brass accent color for the active state, neutral ink for inactive. Do not use `display: none` to hide the inactive option — both must always be visible.
- **Keyboard accessibility**: both toggle buttons must be focusable and activatable via keyboard (Enter/Space). Use `<button type="button">` elements.
- **Layout constraint**: the toggle must remain visible on all viewport sizes (desktop, tablet, mobile) — it is displayed in both the desktop header row and the mobile drawer menu (AC-004).
- **Existing Navbar state**: `isOpen` (boolean) for mobile menu open/close — do not remove or alter.

### Strings to translate (keys from `en.json` / `fr.json`)

| Current hardcoded string | Translation key |
|---|---|
| `"Tool"` (desktop nav link) | `nav.tool` |
| `"Roadmap"` (desktop nav link) | `nav.roadmap` |
| `"Partnerships"` (desktop nav link) | `nav.partnerships` |
| `"Contact"` (CTA button) | `nav.contact` |
| `"Open menu"` (aria-label) | `nav.openMenu` |
| `"Close menu"` (aria-label, was `"Fermer le menu"` — correct to English consistent key) | `nav.closeMenu` |
| `"Tool"` (mobile drawer link) | `nav.tool` |
| `"Roadmap"` (mobile drawer link) | `nav.roadmap` |
| `"Partnerships"` (mobile drawer link) | `nav.partnerships` |

Note: the current aria-label for the mobile button is `'Fermer le menu'` and `'Ouvrir le menu'` (French) — this is a pre-existing inconsistency in the codebase. Replace both with the translation keys `nav.closeMenu` and `nav.openMenu`.

## Potentially impacted files

- `src/components/Navbar.jsx`

## Inputs

Current `Navbar.jsx`:
```jsx
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Icon from './ui/Icon';
import logoWordmark from '../assets/logo-wordmark.svg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-ink-3 bg-paper-1/88 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <img src={logoWordmark} alt="MyBikeLab" className="h-8 w-auto" />
        </a>
        <nav className="hidden md:flex items-center gap-1">
          <a href="#tool" className="btn-ghost">Tool</a>
          <a href="#roadmap" className="btn-ghost">Roadmap</a>
          <a href="#partnerships" className="btn-ghost">Partnerships</a>
        </nav>
        <div className="flex items-center gap-2">
          <a href="#contact" className="btn-primary">Contact</a>
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            className="md:hidden ..."
          >
            {isOpen ? <Icon as={X} size={24} /> : <Icon as={Menu} size={24} />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div id="mobile-menu" className="md:hidden ...">
          <nav className="container-page flex flex-col py-2">
            <a href="#tool" onClick={close} className="btn-ghost justify-start">Tool</a>
            <a href="#roadmap" onClick={close} className="btn-ghost justify-start">Roadmap</a>
            <a href="#partnerships" onClick={close} className="btn-ghost justify-start">Partnerships</a>
          </nav>
        </div>
      )}
    </header>
  );
};
```

## Expected outputs

Updated `Navbar.jsx`:

1. Add `import { useTranslation } from 'react-i18next';` and `import i18next from 'i18next';`
2. Inside the component, call `const { t } = useTranslation();`
3. Replace all hardcoded strings with `t('nav.tool')`, `t('nav.roadmap')`, etc.
4. Fix aria-labels: `aria-label={isOpen ? t('nav.closeMenu') : t('nav.openMenu')}`
5. Add a `LanguageToggle` — implement it as a small component defined in the same file (or imported from a new file `src/components/LanguageToggle.jsx`). The toggle renders two `<button>` elements: one for EN, one for FR.

### LanguageToggle implementation guidance

```jsx
const LANGUAGES = ['en', 'fr'];

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const current = i18n.language?.split('-')[0] ?? 'en'; // normalize 'en-US' → 'en'

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
            className={`px-2 py-1 rounded-xs text-xs font-semibold uppercase tracking-wide
              transition-colors
              ${isActive
                ? 'bg-brass-7 text-ink-12'
                : 'text-ink-8 hover:text-ink-11'
              }`}
            style={{ transition: 'color var(--duration-quick) var(--ease-standard), background-color var(--duration-quick) var(--ease-standard)' }}
          >
            {lang.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
};
```

### Placement in the Navbar layout

- **Desktop header row**: add `<LanguageToggle />` inside the `<div className="flex items-center gap-2">` that contains the Contact CTA and the mobile menu button, before `<a href="#contact">`. This places it to the left of the Contact button.
- **Mobile drawer**: add `<LanguageToggle />` inside the mobile drawer nav, below the last nav link, with appropriate padding (e.g., `px-2 py-2`).

## Constraints (from UI Guidelines — visible surface)

- Both EN and FR buttons must always be visible — never `display: none` for the inactive option
- The active button uses `aria-pressed={true}` to communicate state to screen readers
- Both buttons must be keyboard-focusable and activatable via Enter/Space
- Button contrast: active state (`bg-brass-7 text-ink-12`) must meet WCAG AA 4.5:1 for text ≥ 18px; at `text-xs` (12px), the 4.5:1 ratio applies. Verify brass-7 / ink-12 contrast in the existing design system — if below threshold, use `text-paper-0` instead of `text-ink-12`.
- The toggle must not break the Navbar flex layout on any viewport width — `EN` and `FR` are short fixed-width labels, so overflow is not a risk
- Color/opacity transitions are allowed on hover; no position or movement animation needed for a toggle this simple
- Do not add a separator or decorative element between EN and FR — the active state alone communicates the selection

## Dependencies

TASK-001, TASK-002, TASK-003

## Validation criteria

- [ ] The language toggle (EN / FR) is visible in the desktop Navbar row at all viewport widths (AC-004)
- [ ] The language toggle is visible in the mobile drawer menu
- [ ] Clicking EN switches the interface to English (AC-005)
- [ ] Clicking FR switches the interface to French (AC-005)
- [ ] The switch is immediate — no page reload occurs (AC-005)
- [ ] The active language button is visually distinct from the inactive one
- [ ] Both buttons have `aria-pressed` set correctly
- [ ] All Navbar nav links display in the active language (Tool / Outil, Roadmap, Partnerships / Partenariats, Contact)
- [ ] The mobile menu open/close aria-labels are now derived from translation keys (no French hardcoded in English)
- [ ] `npm run build` passes

## Tests to implement

### Unit
- None for this task

### Integration
- Open the site, verify the toggle is visible at desktop (≥768px) and mobile (<768px) widths
- Click FR — verify all Navbar labels update to French immediately, URL does not change
- Click EN — verify all Navbar labels revert to English immediately
- Reload the page after selecting FR — verify FR persists (AC-009)
- Keyboard: tab to the EN/FR buttons, press Enter/Space to switch — verify it works
