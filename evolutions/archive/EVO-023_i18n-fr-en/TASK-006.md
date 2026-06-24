# TASK-006 — Translate `Hero.jsx`

## Objective

Replace all hardcoded strings in `src/components/Hero.jsx` with `useTranslation` calls. The component's structure and logic are unchanged.

## Required context

- **File**: `src/components/Hero.jsx`
- **i18n init**: provided by `src/i18n.js` (TASK-001). Import and use `useTranslation` from `react-i18next`.
- **Note on headline**: the current headline is `Wheels, <em>measured.</em> Not marketed.` — the `<em>` tag is a rendering concern. The translation key `hero.title` holds the plain text `"Wheels, measured. Not marketed."`. In French, `"Des roues mesurées, pas marketées."` The `<em>` emphasis must be re-applied in the component around the corresponding word(s) after translation. Since the emphasized portion differs between languages, the approach is to store the full title as a single string and use i18next's `Trans` component or a split approach. The simplest correct approach: store the full title string in the JSON and render it without the `<em>` tag. Alternatively, store the emphasis word as a separate key (`hero.titleEmphasis`) and compose in JSX. **Recommended**: use two keys — `hero.titleBefore` and `hero.titleEmphasis` — and compose them in JSX, keeping the `<em>` tag in the component.

### Recommended key split for the headline
```json
// en.json
"hero": {
  "titleBefore": "Wheels,",
  "titleEmphasis": "measured.",
  "titleAfter": "Not marketed."
}
// fr.json
"hero": {
  "titleBefore": "Des roues",
  "titleEmphasis": "mesurées,",
  "titleAfter": "pas marketées."
}
```
JSX: `{t('hero.titleBefore')} <em>{t('hero.titleEmphasis')}</em> {t('hero.titleAfter')}`

**Alternative**: if you prefer a single key with HTML markup, use `dangerouslySetInnerHTML` — but this is not recommended as it bypasses React's XSS protection. Use the split approach.

**Important**: if you use the split approach, the `en.json` and `fr.json` files created in TASK-002 and TASK-003 must be updated to add these three sub-keys instead of the single `hero.title` key. Update those files accordingly within this task, or treat the `hero.title` key from TASK-002/003 as the non-emphasized fallback and override in the component. The simplest consistent approach: update `en.json` and `fr.json` to use the three-key split and remove `hero.title`. Do this within TASK-006.

### All strings to translate

| Location | Current hardcoded string | Translation key |
|---|---|---|
| `<h1>` headline | `"Wheels, "` + `<em>measured.</em>` + `" Not marketed."` | `hero.titleBefore`, `hero.titleEmphasis`, `hero.titleAfter` |
| Subtitle `<p>` | `"Compare by weight, rim depth, hookless compatibility, hub brand, price and many more. Structured in a single table."` | `hero.subtitle` |
| Primary CTA | `"Open comparator →"` | `hero.ctaPrimary` |
| Secondary CTA | `"See the roadmap →"` | `hero.ctaSecondary` |
| Stats: wheels label | `"Wheels"` | `hero.stats.wheels` |
| Stats: filter axes label | `"Filter axes"` | `hero.stats.filterAxes` |
| Stats: phases label | `"Phases planned"` | `hero.stats.phasesPlanned` |

The three stat numbers (`15`, dynamic filter count, `3`) are numeric and not translated.

## Potentially impacted files

- `src/components/Hero.jsx`
- `public/locales/en.json` (update headline keys if using split approach)
- `public/locales/fr.json` (update headline keys if using split approach)

## Inputs

Current `Hero.jsx`:
```jsx
import { getFilterableProperties } from '../config/wheelProperties';

const Hero = () => {
  return (
    <section id="top" className="relative overflow-hidden hero-grid-bg">
      <div className="container-page section text-center">
        <h1 className="hero-title text-ink-10">
          Wheels, <em>measured.</em> Not marketed.
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-ink-8 max-w-2xl mx-auto">
          Compare by weight, rim depth, hookless compatibility, hub brand, price and many more. Structured in a single table.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <a href="#tool" className="btn-primary">Open comparator →</a>
          <a href="#roadmap" className="btn-outline">See the roadmap →</a>
        </div>
        <div className="mt-16 grid grid-cols-3 max-w-xl mx-auto gap-6 text-left">
          <div>
            <div className="text-2xl font-bold text-brass-8 font-mono tabular-nums">15</div>
            <div className="text-sm text-ink-7">Wheels</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-brass-8 font-mono tabular-nums">{getFilterableProperties().length}</div>
            <div className="text-sm text-ink-7">Filter axes</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-brass-8 font-mono tabular-nums">3</div>
            <div className="text-sm text-ink-7">Phases planned</div>
          </div>
        </div>
      </div>
    </section>
  );
};
```

## Expected outputs

Updated `Hero.jsx`:
```jsx
import { useTranslation } from 'react-i18next';
import { getFilterableProperties } from '../config/wheelProperties';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section id="top" className="relative overflow-hidden hero-grid-bg">
      <div className="container-page section text-center">
        <h1 className="hero-title text-ink-10">
          {t('hero.titleBefore')} <em>{t('hero.titleEmphasis')}</em> {t('hero.titleAfter')}
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-ink-8 max-w-2xl mx-auto">
          {t('hero.subtitle')}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <a href="#tool" className="btn-primary">{t('hero.ctaPrimary')}</a>
          <a href="#roadmap" className="btn-outline">{t('hero.ctaSecondary')}</a>
        </div>
        <div className="mt-16 grid grid-cols-3 max-w-xl mx-auto gap-6 text-left">
          <div>
            <div className="text-2xl font-bold text-brass-8 font-mono tabular-nums">15</div>
            <div className="text-sm text-ink-7">{t('hero.stats.wheels')}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-brass-8 font-mono tabular-nums">{getFilterableProperties().length}</div>
            <div className="text-sm text-ink-7">{t('hero.stats.filterAxes')}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-brass-8 font-mono tabular-nums">3</div>
            <div className="text-sm text-ink-7">{t('hero.stats.phasesPlanned')}</div>
          </div>
        </div>
      </div>
    </section>
  );
};
```

If using the three-key split for the headline, also update `en.json` to replace `hero.title` with:
```json
"hero": {
  "titleBefore": "Wheels,",
  "titleEmphasis": "measured.",
  "titleAfter": "Not marketed.",
  ...
}
```
And `fr.json`:
```json
"hero": {
  "titleBefore": "Des roues",
  "titleEmphasis": "mesurées,",
  "titleAfter": "pas marketées.",
  ...
}
```

## Constraints (from UI Guidelines — visible surface)

- CTA button text must fit on one line at desktop — `"Open comparator →"` is 4 words; `"Ouvrir le comparateur →"` is 4 words. Verify French CTA does not wrap. If it wraps, reduce to `"Voir le comparateur →"` or widen the button.
- The `<em>` tag on the emphasized headline word must be preserved in both languages — it is an intentional typographic choice
- Do not change any className, layout, or structure — only string content changes
- The `getFilterableProperties().length` stat remains dynamic and is not translated

## Dependencies

TASK-001, TASK-002, TASK-003

## Validation criteria

- [ ] In English mode: all Hero strings are identical to the pre-evolution hardcoded strings
- [ ] In French mode: headline, subtitle, CTAs, and stat labels all display in French
- [ ] The `<em>` emphasis is visible in both English and French headlines
- [ ] CTA buttons do not overflow their container in French
- [ ] `npm run build` passes

## Tests to implement

### Unit
- None

### Integration
- Switch to French; verify the Hero section displays entirely in French with no English strings remaining
- Verify the emphasized word in the headline is rendered in italic in both languages
