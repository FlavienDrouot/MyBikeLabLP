# TASK-011 — Translate `BenefitsGrid.jsx` using the returnObjects pattern

## Objective

Replace the hardcoded `benefits` data array and all static strings in `src/components/BenefitsGrid.jsx` with translation lookups. Benefit content (title, description) is stored in JSON and retrieved via `t('benefits.items', { returnObjects: true })`. Icons remain in the component, mapped by index.

## Required context

- **File**: `src/components/BenefitsGrid.jsx`
- **i18n**: TASK-001. Use `useTranslation` from `react-i18next`.
- **returnObjects pattern**: same as TASK-010. `t('benefits.items', { returnObjects: true })` returns the array of benefit objects.
- **Icons are not in JSON**: the `benefits` array currently includes an `icon` field containing JSX (`<Icon as={CheckCircle} />`). JSX cannot live in JSON. The solution: keep the icons in the component, defined as a separate static array or inline, and map them by index to the translated items. The order of items in the JSON must match the icon order in the component.

### Icon order (must be preserved)

```js
const ICONS = [
  <Icon as={CheckCircle} size={24} aria-hidden="true" />, // index 0: Better decisions
  <Icon as={TrendingUp} size={24} aria-hidden="true" />,  // index 1: Data-driven
  <Icon as={Users} size={24} aria-hidden="true" />,       // index 2: Community-focused
];
```

### Strings to translate

| Location | Current hardcoded string | Translation key |
|---|---|---|
| Section index label | `"BENEFITS"` | `benefits.sectionIndex` |
| Section title `<h2>` | `"Built for serious cyclists"` | `benefits.title` |
| Benefits data (all items) | hardcoded `benefits` array | `t('benefits.items', { returnObjects: true })` |

Each item has `title` and `description`. The `icon` field is removed from the JSON schema; icons live in the component only.

## Potentially impacted files

- `src/components/BenefitsGrid.jsx`

## Inputs

Current `BenefitsGrid.jsx`:
```jsx
import { CheckCircle, TrendingUp, Users } from 'lucide-react';
import Icon from './ui/Icon';

const benefits = [
  {
    title: 'Better decisions',
    description: 'Stop comparing PDFs and forum threads. Filter on the specs that actually matter for your ride.',
    icon: <Icon as={CheckCircle} size={24} aria-hidden="true" />,
  },
  {
    title: 'Data-driven',
    description: 'Every spec is sourced and structured. No marketing fluff, just numbers you can cross-check.',
    icon: <Icon as={TrendingUp} size={24} aria-hidden="true" />,
  },
  {
    title: 'Community-focused',
    description: 'Built with riders, manufacturers and resellers. Open data, transparent affiliations.',
    icon: <Icon as={Users} size={24} aria-hidden="true" />,
  },
];

const BenefitsGrid = () => {
  return (
    <section className="section bg-paper-2">
      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto">
          <p className="t-section-index">BENEFITS</p>
          <h2 className="section-title mt-2">Built for serious cyclists</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.title} className="card p-6">
              <div className="grid h-10 w-10 place-items-center rounded-none bg-brass-3 text-brass-9">
                {b.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-ink-11">{b.title}</h3>
              <p className="mt-2 text-ink-8">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
```

## Expected outputs

Updated `BenefitsGrid.jsx`:

```jsx
import { useTranslation } from 'react-i18next';
import { CheckCircle, TrendingUp, Users } from 'lucide-react';
import Icon from './ui/Icon';

const ICONS = [
  <Icon as={CheckCircle} size={24} aria-hidden="true" key="check" />,
  <Icon as={TrendingUp} size={24} aria-hidden="true" key="trend" />,
  <Icon as={Users} size={24} aria-hidden="true" key="users" />,
];

const BenefitsGrid = () => {
  const { t } = useTranslation();
  const items = t('benefits.items', { returnObjects: true });

  return (
    <section className="section bg-paper-2">
      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto">
          <p className="t-section-index">{t('benefits.sectionIndex')}</p>
          <h2 className="section-title mt-2">{t('benefits.title')}</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((b, idx) => (
            <div key={b.title} className="card p-6">
              <div className="grid h-10 w-10 place-items-center rounded-none bg-brass-3 text-brass-9">
                {ICONS[idx]}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-ink-11">{b.title}</h3>
              <p className="mt-2 text-ink-8">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsGrid;
```

The hardcoded `benefits` constant is removed. The `ICONS` constant is a module-level static array (not inside the component, since it is stable and does not depend on state or props).

## Constraints

- The `ICONS` array order must match the `benefits.items` array order in both `en.json` and `fr.json` (index 0 = "Better decisions" / "De meilleures décisions", etc.)
- Do not include icon information in the JSON files — icons are visual component concerns, not content
- The `key` prop on each card uses `b.title` — this is the translated title and is unique per item. This is acceptable. Alternatively use `idx` as key if `b.title` uniqueness across languages is a concern.
- Do not change any className, layout, or structural elements

## Dependencies

TASK-001, TASK-002, TASK-003

## Validation criteria

- [ ] In English mode: all Benefits section content is identical to the pre-evolution hardcoded content
- [ ] In French mode: section index, title, and all three benefit cards (title + description) display in French
- [ ] Icons display correctly and in the correct order in both languages (CheckCircle for first, TrendingUp for second, Users for third)
- [ ] `npm run build` passes

## Tests to implement

### Unit
- None

### Integration
- Switch to French; scroll to the Benefits section; verify all three cards display in French
- Verify icons are in the correct position (index alignment)
