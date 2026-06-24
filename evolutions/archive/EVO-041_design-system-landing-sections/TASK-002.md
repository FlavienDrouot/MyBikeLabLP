# TASK-002 — Migrate `Hero.jsx` to design system: eyebrow, CTA border, brass italic accent

## Objective

Update `Hero.jsx` to fully comply with the design system. Specifically:
1. Add a `.t-eyebrow` eyebrow label above the headline using `t('hero.eyebrow')`.
2. Ensure the primary CTA button has the correct brass border (`border: 1px solid var(--brass-8)`) and hover behavior (`hover:bg-brass-6`).
3. Confirm the `<em>` span on the headline resolves to `var(--brass-8)` color (verify via existing CSS — `hero-title em` in `index.css` already sets `color: var(--brass-8)`).
4. Ensure no numeric section-index label appears anywhere in the component.
5. Also update `index.css`: fix the `.btn-primary` hover direction from `hover:bg-brass-8` to `hover:bg-brass-6`, and add `border: 1px solid var(--brass-8)` to `.btn-primary`.

## Required context

### Current `Hero.jsx` structure

```jsx
import { useTranslation } from 'react-i18next';
import { getFilterableProperties } from '../config/wheelProperties';
import { wheelsData } from '../data/wheelsData';

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
            <div className="text-2xl font-bold text-brass-8 font-mono tabular-nums">{wheelsData.length}</div>
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

### Existing CSS classes to know

From `frontend/src/index.css` (`@layer components`):
- `.hero-grid-bg`: already applies the 32px schematic grid background in `ink-2` — do not remove.
- `.hero-title`: sets `font-weight: 800`, `letter-spacing: -0.045em`. Already correct.
- `.hero-title em`: sets `font-style: italic`, `font-weight: 300`, `letter-spacing: -0.05em`, `color: var(--brass-8)`. Already correct — no change needed in CSS.
- `.btn-primary`: currently `@apply inline-flex items-center justify-center rounded-xs bg-brass-7 px-5 py-2.5 text-sm font-semibold text-ink-12 hover:bg-brass-8;` — the hover color is wrong (darkens instead of lightens). Needs fixing.
- `.t-eyebrow`: sets `font-family: var(--font-sans)`, `font-size: var(--text-xs)`, `font-weight: 600`, `text-transform: uppercase`, `letter-spacing: var(--tracking-widest)`, `color: var(--fg-muted)`. Use this class for the eyebrow element.

### Design system token reference

- `--brass-7`: `#c9a86a` (CTA background fill)
- `--brass-8`: `#a88846` (CTA border, hover text/icon, em span color)
- `--brass-6`: `#d6bb87` (CTA hover background — lighter than brass-7)
- `--ink-2`: `#e4e2d6` (grid line color — already in `.hero-grid-bg`)

### UI constraints (from `shared-knowledge/ui-guidelines.md`)

- No section-index labels anywhere: the eyebrow must be a descriptive verb-noun string, not a numeric pattern.
- No em-dash, en-dash, or exclamation mark in any copy rendered by this component.
- CTA button text must fit on one line at desktop. Current text is "Open comparator →" (EN) — acceptable length.
- Hover animation on the CTA uses `color/border-color` transition — exempt from the `@media (hover: hover)` gate requirement (only position/transform/scale animations require the gate).
- Accessibility: the primary CTA uses brass fill — ensure contrast meets WCAG AA (brass-7 on ink-12 text: verified sufficient in the design system).

## Potentially impacted files

- `frontend/src/components/Hero.jsx`
- `frontend/src/index.css`

## Inputs

- `hero.eyebrow` translation key (added by TASK-001): `"Compare road wheels"` (EN) / `"Comparez les roues route"` (FR)
- Design system reference: `design-system/ui_kits/landing/Hero.jsx` and `landing.css`

## Expected outputs

### `Hero.jsx` changes

1. Add an eyebrow `<p>` element immediately before the `<h1>`:
   ```jsx
   <p className="t-eyebrow">{t('hero.eyebrow')}</p>
   ```
2. The `<h1>` className changes from `"hero-title text-ink-10"` to `"hero-title text-ink-12"` — the headline should be near-black (`ink-12`), not `ink-10`. (The design system sets `color: var(--ink-12)` on `.hero-title` in the reference `landing.css`; the current `text-ink-10` overrides it with a lighter shade. Correct this.)
3. No other structural changes to `Hero.jsx`.

### `index.css` changes

In the `.btn-primary` rule, within `@layer components`:
- Change `hover:bg-brass-8` → `hover:bg-brass-6`
- Add `border border-brass-8` to the `@apply` list (this adds `border: 1px solid var(--brass-8)`)
- Add the transition for `border-color` if not already present (the existing transition declaration already covers `border-color`)

The updated `.btn-primary` rule should read:
```css
.btn-primary {
  @apply inline-flex items-center justify-center rounded-xs border border-brass-8 bg-brass-7 px-5 py-2.5 text-sm font-semibold text-ink-12 hover:bg-brass-6;
  transition: color var(--duration-quick) var(--ease-standard), background-color var(--duration-quick) var(--ease-standard), border-color var(--duration-quick) var(--ease-standard);
}
```

## Constraints

- Do not remove `hero-grid-bg` from the section — the schematic grid background must remain.
- Do not add photography, background images, or texture overlays to the Hero section.
- Do not modify the stats trio structure (it must continue to render `wheelsData.length`, `getFilterableProperties().length`, and `3` with `font-mono tabular-nums`).
- Do not change the `btn-outline` class — it is not in scope.
- The `section` className on the container div controls vertical padding — do not remove it.
- The eyebrow element must use exactly the class `t-eyebrow` — no additional color override classes.
- No numeric section index may appear in the component (the eyebrow must be a plain descriptive label).

## Dependencies

TASK-001 (the `hero.eyebrow` translation key must exist before `Hero.jsx` can render it)

## Validation criteria

- [ ] The Hero section displays an eyebrow label above the `<h1>` that reads "COMPARE ROAD WHEELS" in EN (uppercase applied by CSS) and "COMPAREZ LES ROUES ROUTE" in FR.
- [ ] The `<h1>` headline renders at `font-weight: 800`, `letter-spacing: -0.045em` (from `.hero-title`).
- [ ] The `<em>` span on the emphasis word renders in `var(--brass-8)` color (computed style inspection).
- [ ] The primary CTA has `background: var(--brass-7)` and `border: 1px solid var(--brass-8)` as computed styles.
- [ ] On hover, the primary CTA background resolves to `var(--brass-6)` (verified in DevTools by hovering the element).
- [ ] The Hero section background renders the 32px schematic grid in `ink-2`. No photography or texture overlay is present.
- [ ] No numeric pattern (`01`, `№`, `Phase 01`) appears in the Hero section.
- [ ] No em-dash, en-dash, or exclamation mark appears in any text rendered by this component (both EN and FR).
- [ ] The stats trio (wheels count, filter axes count, phases planned) renders correctly with JetBrains Mono tabular numerals.

## Tests to implement

### Unit
- None required.

### Integration
- Load the landing page in EN and FR locales and visually inspect the Hero section per the validation criteria above.
- Open DevTools → Computed styles on the Hero `<section>`: confirm `background-image` includes `linear-gradient`.
- Open DevTools → Computed styles on the `<h1>`: confirm `font-weight: 800`, `letter-spacing: -0.045em`.
- Open DevTools → Computed styles on the `<em>`: confirm `color` resolves to `#a88846` (brass-8).
- Open DevTools → Computed styles on the primary CTA `<a>`: confirm `background-color` resolves to `#c9a86a` (brass-7), `border-color` resolves to `#a88846` (brass-8).
