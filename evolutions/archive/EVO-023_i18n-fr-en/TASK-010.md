# TASK-010 — Translate `RoadmapSection.jsx` using the returnObjects pattern

## Objective

Replace the hardcoded `phases` data array and all static strings in `src/components/RoadmapSection.jsx` with translation lookups. Phase content (title, description, points, status, tag) is stored in the JSON files and retrieved via `t('roadmap.phases', { returnObjects: true })`.

## Required context

- **File**: `src/components/RoadmapSection.jsx`
- **i18n**: TASK-001. Use `useTranslation` from `react-i18next`.
- **returnObjects pattern**: i18next supports returning an array or object from a key using `{ returnObjects: true }`. This is how structured content (arrays of objects) is retrieved from JSON.
  ```js
  const phases = t('roadmap.phases', { returnObjects: true });
  // Returns the array of phase objects from the JSON file
  ```
- **TypeScript safety**: since this project uses JSDoc types (not `.ts` files), no additional typing is needed. The `phases` variable will be typed as `any[]` by inference.
- **Icon mapping**: the current component uses no icons for phases — only tag/status/title/description/points. There is nothing to map separately.
- **CSS class for phase status**: the current component applies a different background class to index 0 (`bg-brass-7`) vs. other phases (`bg-ink-2`). This logic is index-based (`idx === 0`) and is language-neutral — it must be preserved unchanged.

### Strings to translate

| Location | Current hardcoded string | Translation key |
|---|---|---|
| Section index label | `"ROADMAP"` | `roadmap.sectionIndex` |
| Section title `<h2>` | `"Three phases"` | `roadmap.title` |
| Section subtitle `<p>` | `"Comparison first. Impact simulation next. Full bike configurator on the horizon."` | `roadmap.subtitle` |
| Phase data (all phases) | hardcoded `phases` array | `t('roadmap.phases', { returnObjects: true })` |

### Phase data structure (from `en.json` and `fr.json`)

Each phase object has: `tag`, `status`, `title`, `description`, `points` (array of strings). All fields are translated in the JSON files (TASK-002, TASK-003).

## Potentially impacted files

- `src/components/RoadmapSection.jsx`

## Inputs

Current `RoadmapSection.jsx`:
```jsx
const phases = [
  {
    tag: 'Phase 1',
    status: 'In progress',
    title: 'Components comparison',
    description: 'Wheels first, then drivetrains, brakes, tires. Structured specs, side-by-side decisions.',
    points: ['Wheels MVP live', 'Drivetrains coming', 'Brakes & tires next'],
  },
  // ... 2 more phases
];

const RoadmapSection = () => {
  return (
    <section id="roadmap" className="section bg-paper-1">
      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto">
          <p className="t-section-index">ROADMAP</p>
          <h2 className="section-title mt-2">Three phases</h2>
          <p className="section-subtitle mx-auto">
            Comparison first. Impact simulation next. Full bike configurator on the horizon.
          </p>
        </div>
        <hr className="rule mt-8" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {phases.map((p, idx) => (
            <div key={p.tag} className="card p-6 flex flex-col">
              <span className={`... ${idx === 0 ? 'bg-brass-7 text-ink-12' : 'bg-ink-2 text-ink-11'}`}>
                {p.status}
              </span>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <ul>
                {p.points.map((pt) => (
                  <li key={pt}><span>→</span>{pt}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
```

## Expected outputs

Updated `RoadmapSection.jsx`:

```jsx
import { useTranslation } from 'react-i18next';

const RoadmapSection = () => {
  const { t } = useTranslation();
  const phases = t('roadmap.phases', { returnObjects: true });

  return (
    <section id="roadmap" className="section bg-paper-1">
      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto">
          <p className="t-section-index">{t('roadmap.sectionIndex')}</p>
          <h2 className="section-title mt-2">{t('roadmap.title')}</h2>
          <p className="section-subtitle mx-auto">
            {t('roadmap.subtitle')}
          </p>
        </div>
        <hr className="rule mt-8" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {phases.map((p, idx) => (
            <div key={p.tag} className="card p-6 flex flex-col">
              <span className={`self-start text-xs px-2 py-0.5 rounded-full font-medium ${
                idx === 0 ? 'bg-brass-7 text-ink-12' : 'bg-ink-2 text-ink-11'
              }`}>
                {p.status}
              </span>
              <h3 className="mt-3 text-xl font-bold text-ink-11">{p.title}</h3>
              <p className="mt-2 text-ink-8">{p.description}</p>
              <ul className="mt-5 space-y-2 text-sm text-ink-11">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2">
                    <span>→</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
```

The hardcoded `phases` array at the top of the file is removed entirely. The component now derives the phases array from translations.

## Constraints

- The hardcoded `phases` constant must be removed — it is replaced by `t('roadmap.phases', { returnObjects: true })`
- The index-based status class logic (`idx === 0 ? 'bg-brass-7' : 'bg-ink-2'`) must be preserved unchanged
- The `→` arrow before each bullet point is a visual element, not translatable text — leave it hardcoded in the JSX
- The `key={p.tag}` on each phase card is acceptable — `p.tag` values are `"Phase 1"`, `"Phase 2"`, `"Phase 3"` which are language-neutral and stable identifiers. Alternatively use `key={idx}` if preferred.
- Do not change any className, layout, or structural elements

## Dependencies

TASK-001, TASK-002, TASK-003

## Validation criteria

- [ ] In English mode: all roadmap content is identical to the pre-evolution hardcoded content
- [ ] In French mode: section index, title, subtitle, and all three phase blocks (tag, status, title, description, points) display in French
- [ ] The "In progress" / "En cours" status badge on Phase 1 uses `bg-brass-7` in both languages
- [ ] Phase 2 and Phase 3 status badges use `bg-ink-2` in both languages
- [ ] `npm run build` passes

## Tests to implement

### Unit
- None

### Integration
- Switch to French; scroll to the Roadmap section; verify all text is in French
- Switch back to English; verify all text is identical to the pre-evolution content
