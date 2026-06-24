# TASK-013 — Translate `Footer.jsx`

## Objective

Replace all hardcoded strings in `src/components/Footer.jsx` with `useTranslation` calls. Includes the copyright notice (with a dynamic year) and the navigation link labels.

## Required context

- **File**: `src/components/Footer.jsx`
- **i18n**: TASK-001. Use `useTranslation` from `react-i18next`.
- **Copyright year**: currently `{new Date().getFullYear()}`. This is a dynamic numeric value. In the translation key, use i18next interpolation: `"© {{year}} MyBikeLab. All rights reserved."` and pass `year: new Date().getFullYear()` as an option. The full copyright string including the year is translated; the year itself is a language-neutral number.
- **Nav links**: same target anchors as the Navbar (`#tool`, `#roadmap`, `#partnerships`, `#contact`). Only the visible label text is translated; the `href` attributes do not change.

### Strings to translate

| Location | Current hardcoded string | Translation key |
|---|---|---|
| Copyright `<span>` | `© {new Date().getFullYear()} MyBikeLab. All rights reserved.` | `footer.copyright` with `{{year}}` |
| Nav link | `"Tool"` | `footer.nav.tool` |
| Nav link | `"Roadmap"` | `footer.nav.roadmap` |
| Nav link | `"Partnerships"` | `footer.nav.partnerships` |
| Nav link | `"Contact"` | `footer.nav.contact` |

## Potentially impacted files

- `src/components/Footer.jsx`

## Inputs

Current `Footer.jsx`:
```jsx
import logoMark from '../assets/logo-mark.svg';

const Footer = () => {
  return (
    <footer className="bg-ink-11">
      <hr className="rule rule-strong" />
      <div className="container-page py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src={logoMark} alt="MyBikeLab" className="h-7 w-auto brightness-0 invert" />
          <span className="text-sm text-paper-2">
            © {new Date().getFullYear()} MyBikeLab. All rights reserved.
          </span>
        </div>
        <nav className="flex items-center gap-5 text-sm text-paper-2">
          <a href="#tool" className="hover:text-brass-7">Tool</a>
          <a href="#roadmap" className="hover:text-brass-7">Roadmap</a>
          <a href="#partnerships" className="hover:text-brass-7">Partnerships</a>
          <a href="#contact" className="hover:text-brass-7">Contact</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
```

## Expected outputs

Updated `Footer.jsx`:
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

## Constraints

- Do not change any className, layout, or the logo `alt` attribute (`"MyBikeLab"` is a brand name — not translated)
- The `href` anchor values (`#tool`, `#roadmap`, `#partnerships`, `#contact`) are not translated — they are URL fragment identifiers
- The `{{year}}` interpolation must use `new Date().getFullYear()` — do not hardcode the year

## Dependencies

TASK-001, TASK-002, TASK-003

## Validation criteria

- [ ] In French mode: the copyright notice reads "© [year] MyBikeLab. Tous droits réservés."
- [ ] In French mode: footer nav links display as "Outil", "Roadmap", "Partenariats", "Contact"
- [ ] In English mode: footer content is identical to the pre-evolution hardcoded content
- [ ] `npm run build` passes

## Tests to implement

### Unit
- None

### Integration
- Switch to French; scroll to the Footer; verify copyright and nav labels display in French
- Switch back to English; verify the Footer reverts to English immediately
