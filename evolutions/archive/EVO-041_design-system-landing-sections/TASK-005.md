# TASK-005 — Migrate `PartnershipSection.jsx` to ink-inverse treatment with audience keyline tiles

## Objective

Update `PartnershipSection.jsx` to fully comply with the design system ink-inverse section specification:
1. Replace legacy sage-based audience tile borders (`border-sage-4/40`, `bg-sage-1/10`) with the keyline tile pattern: `border-top: 1px solid var(--ink-10)`, no background fill on tiles.
2. Remove the `text-ink-11` override from the contact card column wrapper (the `ContactForm`'s `bg-paper-1` card handles its own color context).
3. Remove the mobile separator's legacy sage border (`border-sage-3/30`).
4. Verify the eyebrow renders with `className="t-eyebrow"` and the eyebrow color resolves to `var(--brass-7)` — the `.t-eyebrow` class sets `color: var(--fg-muted)` which resolves to `var(--ink-7)`, not `var(--brass-7)`. The PRD (FR-007, AC-006) requires the eyebrow to be `var(--brass-7)` in the ink-inverse section. Apply a color override for the eyebrow in this dark-background context.
5. Add a `.audience-tile` CSS class to `index.css` for the tile layout.

## Required context

### Current `PartnershipSection.jsx` structure

```jsx
import { useTranslation } from 'react-i18next';
import ContactForm from './ContactForm';

const PartnershipSection = () => {
  const { t } = useTranslation();
  const audiences = t('partnership.audiences', { returnObjects: true });

  return (
    <section id="partnerships" className="section bg-ink-12 text-paper-1">
      <div className="container-page grid gap-10 lg:grid-cols-2 lg:gap-16 items-start">
        <div>
          <p className="t-eyebrow">{t('partnership.sectionIndex')}</p>
          <h2 className="mt-2 t-h1">
            {t('partnership.title')}
          </h2>
          <p className="mt-3 text-lg text-paper-2 max-w-xl">
            {t('partnership.intro')}
          </p>

          <div className="mt-8 space-y-4">
            {audiences.map((a) => (
              <div key={a.title} className="rounded-none border border-sage-4/40 bg-sage-1/10 p-4">
                <h3 className="font-semibold">{a.title}</h3>
                <p className="text-sm text-paper-2/80 mt-1">{a.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div id="contact" className="text-ink-11">
          <div className="lg:hidden border-t border-sage-3/30 mb-8" />
          <ContactForm />
        </div>
      </div>
    </section>
  );
};
```

### Design system ink-inverse section specification

From `design-system/ui_kits/landing/landing.css`:
```css
.partnership { background: var(--ink-12); color: var(--paper-1); }
.partnership .eyebrow { color: var(--brass-7); }
.audience {
  border-top: 1px solid var(--ink-10);
  padding: 24px 0;
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 32px;
}
.audience:last-child { border-bottom: 1px solid var(--ink-10); }
.audience .title { font-family: var(--font-sans); font-weight: 600; font-size: 18px; color: var(--paper-0); }
.audience .desc { font-size: 14px; color: var(--ink-4); line-height: 1.5; }
.contact-card {
  background: var(--paper-1); color: var(--ink-12);
  padding: 28px; border: 1px solid var(--paper-1);
}
```

Key changes relative to the current implementation:
- Audience tiles use `border-top: 1px solid var(--ink-10)` separator — no background fill, no sage-based border.
- Last tile also gets `border-bottom: 1px solid var(--ink-10)`.
- Tile title color is `var(--paper-0)` (lightest paper), not default `paper-1`.
- Tile description color is `var(--ink-4)` — a mid-tone that reads as muted on the dark background.
- Eyebrow color must be `var(--brass-7)` — the `.t-eyebrow` class uses `var(--fg-muted)` = `var(--ink-7)`, which is too dark on `ink-12` background. An explicit color override is required.
- Contact card has `background: var(--paper-1)` — `ContactForm.jsx` already handles this.

### Eyebrow color in ink-inverse context

The `.t-eyebrow` class sets `color: var(--fg-muted)` = `var(--ink-7)` = `#6e6d65`. On an `ink-12` (`#0e0f0c`) background, this provides sufficient contrast but is NOT brass. The PRD (FR-007) explicitly requires `color: var(--brass-7)` for the eyebrow in the partnership section.

Solution: add `text-brass-7` to the eyebrow element in this component. The result is `className="t-eyebrow text-brass-7"` — the `text-brass-7` Tailwind utility overrides the `color` from `.t-eyebrow`.

### Mobile separator

The current implementation has `<div className="lg:hidden border-t border-sage-3/30 mb-8" />`. Replace `border-sage-3/30` with `border-ink-10` to use a design system token.

### `ContactForm.jsx` — do not modify

`ContactForm.jsx` is a stateful component with Zod validation and form submission logic. Its internal layout already uses `bg-paper-1` as the card background. Do not touch this file.

### Existing CSS classes to know

- `.section`: `@apply py-16 sm:py-20 lg:py-24;` — keep.
- `.bg-ink-12`, `.text-paper-1`: valid Tailwind utilities, keep.
- `.t-eyebrow`: valid — but override color with `text-brass-7` in this ink-inverse context.
- `.t-h1`: valid type token — keep.

### New CSS class to add to `index.css`

Add to `@layer components`:

```css
/* Audience tile — used in ink-inverse (partnership) section */
.audience-tile {
  border-top: 1px solid var(--ink-10);
  padding: 24px 0;
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 24px;
}

.audience-tile:last-child {
  border-bottom: 1px solid var(--ink-10);
}

.audience-tile-title {
  font-weight: 600;
  font-size: var(--text-base);
  color: var(--paper-0);
}

.audience-tile-desc {
  font-size: var(--text-sm);
  color: var(--ink-4);
  line-height: 1.5;
}
```

### UI constraints (from `shared-knowledge/ui-guidelines.md`)

- No neon or outer glows — audience tiles use hairline borders only, no shadow. Correct.
- No section-index labels: current `sectionIndex` values "PARTNERSHIP" / "PARTENARIAT" are descriptive — compliant.
- No em-dash, en-dash, or exclamation mark in prose copy. Scan i18n:
  - `partnership.intro` EN: "MyBikeLab connects cyclists with structured component data. If you supply or sell road bike components, your product data belongs here." — compliant.
  - `partnership.intro` FR: "MyBikeLab connecte les cyclistes à des données composants structurées. Si vous fournissez ou vendez des composants vélo route, vos données ont leur place ici." — compliant.
  - Audience descriptions: clean.
- Button contrast: the contact card's submit button (`btn-primary`) lives in `ContactForm.jsx` — on `paper-1` background, `brass-7` button with `ink-12` text meets WCAG AA. No change needed.
- Accessibility: `ContactForm` has `label` elements above each input — compliant as-is.

## Potentially impacted files

- `frontend/src/components/PartnershipSection.jsx`
- `frontend/src/index.css`

## Inputs

- Current `PartnershipSection.jsx` source (shown above)
- Design system ink-inverse reference: `design-system/ui_kits/landing/Partnership.jsx` and `landing.css`

## Expected outputs

### `PartnershipSection.jsx` changes

1. Eyebrow: change `<p className="t-eyebrow">` to `<p className="t-eyebrow text-brass-7">`.

2. Audience tiles: replace the `<div>` wrapper from:
   ```jsx
   <div key={a.title} className="rounded-none border border-sage-4/40 bg-sage-1/10 p-4">
     <h3 className="font-semibold">{a.title}</h3>
     <p className="text-sm text-paper-2/80 mt-1">{a.description}</p>
   </div>
   ```
   to:
   ```jsx
   <div key={a.title} className="audience-tile">
     <div className="audience-tile-title">{a.title}</div>
     <div className="audience-tile-desc">{a.description}</div>
   </div>
   ```
   Remove `space-y-4` from the audience list wrapper (the `.audience-tile` class handles spacing via `border-top`/`padding`).

3. Contact column wrapper: change `<div id="contact" className="text-ink-11">` to `<div id="contact">` — remove `text-ink-11`.

4. Mobile separator: change `border-sage-3/30` to `border-ink-10` in the mobile separator div.

### `index.css` changes

Add to `@layer components` (after the roadmap classes from TASK-004):
```css
/* Audience tile — used in ink-inverse (partnership) section */
.audience-tile {
  border-top: 1px solid var(--ink-10);
  padding: 24px 0;
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 24px;
}

.audience-tile:last-child {
  border-bottom: 1px solid var(--ink-10);
}

.audience-tile-title {
  font-weight: 600;
  font-size: var(--text-base);
  color: var(--paper-0);
}

.audience-tile-desc {
  font-size: var(--text-sm);
  color: var(--ink-4);
  line-height: 1.5;
}
```

## Constraints

- Do not modify `ContactForm.jsx`.
- Do not change the `section` base class or `bg-ink-12 text-paper-1` on the section element.
- Do not change the two-column layout (`lg:grid-cols-2`) of the section's inner container.
- No `rounded-*` class on audience tiles — the design requires square tiles.
- No background fill (`bg-*`) on audience tiles — tiles are borderline-only, no fill.
- No `sage-*` token classes may remain anywhere in this component after the migration.
- The `text-brass-7` override on the eyebrow is intentional and correct for this ink-inverse context. Do not remove it.

## Dependencies

none

## Validation criteria

- [ ] The Partnership `<section>` element has `background: var(--ink-12)` (computed: `#0e0f0c`).
- [ ] Body text (intro paragraph) resolves to `var(--paper-1)` color (from the section's `text-paper-1` class).
- [ ] The eyebrow label color resolves to `var(--brass-7)` = `#c9a86a` (computed style).
- [ ] Each audience tile has `border-top: 1px solid var(--ink-10)` and no background fill.
- [ ] The last audience tile has `border-bottom: 1px solid var(--ink-10)`.
- [ ] Audience tile title color is `var(--paper-0)` = `#fbfaf6`.
- [ ] Audience tile description color is `var(--ink-4)` = `#c2c0b3`.
- [ ] No `sage-*` token class names appear anywhere in the component source.
- [ ] No `rounded-*` class on audience tile elements.
- [ ] No `box-shadow` on audience tiles.
- [ ] The contact card column has no `text-ink-11` class — the `ContactForm` manages its own color context.
- [ ] The mobile separator uses `border-ink-10`, not `border-sage-3/30`.
- [ ] No em-dash, en-dash, or exclamation mark in rendered prose (EN and FR).
- [ ] No numeric section-index label in the section.

## Tests to implement

### Unit
- None required.

### Integration
- Load the landing page and scroll to the Partnership section.
- Open DevTools → inspect the `<section>` element: confirm `background-color: #0e0f0c`.
- Inspect the eyebrow `<p>`: confirm `color: #c9a86a` (brass-7).
- Inspect each audience tile `<div>`: confirm `border-top: 1px solid #2a2a26` (ink-10), no `background-color` fill (transparent or inherited dark), `border-radius: 0`.
- Inspect the last tile: confirm `border-bottom: 1px solid #2a2a26`.
- Inspect the audience tile title: confirm `color: #fbfaf6` (paper-0).
- Inspect the audience tile description: confirm `color: #c2c0b3` (ink-4).
- Source search: grep `PartnershipSection.jsx` for `sage` — must return zero matches.
- Switch locale to FR and verify all audience descriptions render correctly without layout issues.
