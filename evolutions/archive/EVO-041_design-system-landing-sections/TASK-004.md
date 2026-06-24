# TASK-004 — Migrate `RoadmapSection.jsx` to keyline card flavor

## Objective

Update `RoadmapSection.jsx` to use the keyline card layout: no outer border on phase cards, a `1px solid var(--ink-10)` top rule separating the grid from the section header, and `1px solid var(--ink-3)` right-side column separators between phases. Remove the `.card` class from all phase wrappers. Remove the standalone `<hr className="rule mt-8" />` and replace with a `border-bottom` on the section header block. Add two new CSS classes (`.roadmap-grid` and `.roadmap-phase`) to `index.css`. Ensure no numeric section-index label appears in the component (the current `sectionIndex` translation value "ROADMAP" / "ROADMAP" is already compliant — leave unchanged).

## Required context

### Current `RoadmapSection.jsx` structure

```jsx
import { useTranslation } from 'react-i18next';

const RoadmapSection = () => {
  const { t } = useTranslation();
  const phases = t('roadmap.phases', { returnObjects: true });

  return (
    <section id="roadmap" className="section bg-paper-1">
      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto">
          <p className="t-eyebrow">{t('roadmap.sectionIndex')}</p>
          <h2 className="section-title mt-2">{t('roadmap.title')}</h2>
          <p className="section-subtitle mx-auto">
            {t('roadmap.subtitle')}
          </p>
        </div>

        <hr className="rule mt-8" />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {phases.map((p, idx) => (
            <div key={p.tag} className="card p-6 flex flex-col">
              <span
                className={`self-start text-xs px-2 py-0.5 rounded-full font-medium ${
                  idx === 0 ? 'bg-brass-7 text-ink-12' : 'bg-ink-2 text-ink-11'
                }`}
              >
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
```

### Keyline card specification (design system)

From `design-system/ui_kits/landing/landing.css`:
```css
.roadmap-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  border-top: 1px solid var(--ink-10);
}
.phase {
  padding: 32px 28px;
  border-right: 1px solid var(--ink-3);
  display: flex;
  flex-direction: column;
  min-height: 280px;
}
.phase:last-child { border-right: 0; }
```

The section header uses `border-bottom: 1px solid var(--ink-10)` with `padding-bottom: 24px` to provide the structural top rule before the grid. In the current codebase, this is done via `<hr className="rule mt-8" />` — replace this with a structural border on the header container div.

### Status badge specification (design system)

From `landing.css`:
```css
.phase .stamp .status {
  text-transform: uppercase; letter-spacing: 0.16em;
  font-size: 10px; padding: 3px 9px; border-radius: 999px;
  border: 1px solid var(--ink-4); color: var(--ink-8);
  font-family: var(--font-sans); font-weight: 600;
}
.phase.live .stamp .status { background: var(--ink-12); color: var(--paper-1); border-color: var(--ink-12); }
.phase.next .stamp .status { background: var(--brass-3); color: var(--brass-11); border-color: var(--brass-6); }
```

The current codebase uses a conditional className approach for the status pill:
- `idx === 0` (live): `bg-brass-7 text-ink-12` — this uses brass-7 instead of ink-12. The design system uses `ink-12` background for the live phase. **Correct this to `bg-ink-12 text-paper-1`.**
- `idx !== 0` (next/vision): `bg-ink-2 text-ink-11` — acceptable for non-live phases.

### Existing CSS classes to know

- `.section`: `@apply py-16 sm:py-20 lg:py-24;` — vertical section padding.
- `.card`: `@apply rounded-none border border-ink-4 bg-paper-0;` — this class must be **removed** from phase wrappers; it adds an outer border that conflicts with the keyline spec.
- `.rule`: `border: 0; border-top: 1px solid var(--rule-default); margin: 0;` — the `<hr>` using this class is replaced by a structural border on the header block.
- `.t-eyebrow`: uppercase micro label class — already used correctly.
- `.section-title`, `.section-subtitle`: already correct.

### New CSS classes to add to `index.css`

Add to `@layer components` in `frontend/src/index.css`:

```css
.roadmap-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  border-top: 1px solid var(--ink-10);
}

.roadmap-phase {
  padding: 32px 28px;
  border-right: 1px solid var(--ink-3);
  display: flex;
  flex-direction: column;
}

.roadmap-phase:last-child {
  border-right: 0;
}
```

### UI constraints (from `shared-knowledge/ui-guidelines.md`)

- No section-index labels: the current `sectionIndex` values "ROADMAP" (EN and FR) are descriptive label strings — compliant, leave unchanged.
- No em-dash, en-dash, or exclamation mark in prose copy. Scan i18n values:
  - `roadmap.subtitle` EN: "Comparison first. Impact simulation next. Full bike configurator on the horizon." — compliant.
  - `roadmap.subtitle` FR: "La comparaison d'abord. La simulation d'impact ensuite. Le configurateur complet à l'horizon." — compliant.
  - Phase descriptions: all clean in EN and FR.
- Pill radius (`border-radius: 999px`) is permitted for status badges only — the status pill may keep `rounded-full`.
- Phase card containers must have `border-radius: 0` (ensured by removing `.card` and not adding any `rounded-*` class).
- No `box-shadow` on phase card containers.
- The `→` arrow glyph in bullet points is a typographic device, not an emoji — permitted by the design system.

## Potentially impacted files

- `frontend/src/components/RoadmapSection.jsx`
- `frontend/src/index.css`

## Inputs

- Current `RoadmapSection.jsx` source (shown above)
- Design system keyline card reference: `design-system/ui_kits/landing/landing.css` (`.roadmap-grid`, `.phase` rules)
- Design system landing reference: `design-system/ui_kits/landing/Roadmap.jsx`

## Expected outputs

### `RoadmapSection.jsx` changes

1. Remove `<hr className="rule mt-8" />`.
2. Add `border-b border-ink-10 pb-6` to the section header `<div>` (the centered text block) to provide the structural top rule context for the grid.
3. Change the phases grid `<div>` from `className="mt-12 grid gap-6 md:grid-cols-3"` to `className="roadmap-grid mt-0"`. Remove `mt-12` (the grid's top margin is handled by the `border-top` visual separator).
4. Change each phase wrapper `<div>` from `className="card p-6 flex flex-col"` to `className="roadmap-phase"` (padding and flex layout are defined in the CSS class).
5. Update the status badge:
   - `idx === 0`: change `bg-brass-7 text-ink-12` → `bg-ink-12 text-paper-1 border border-ink-12`
   - Other indices: keep `bg-ink-2 text-ink-11` (no border needed — the CSS class handles it).
   - Both cases keep `self-start text-xs px-2 py-0.5 rounded-full font-medium`.
6. Add a `mt-4` margin-top on the `<h3>` (previously `mt-3` — adjust to `mt-4` to match the design reference's `18px` top margin; Tailwind's `mt-4` = `16px`, close enough).

### `index.css` changes

Add to `@layer components`:
```css
.roadmap-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  border-top: 1px solid var(--ink-10);
}

.roadmap-phase {
  padding: 32px 28px;
  border-right: 1px solid var(--ink-3);
  display: flex;
  flex-direction: column;
}

.roadmap-phase:last-child {
  border-right: 0;
}
```

## Constraints

- Do not modify the `t('roadmap.phases', { returnObjects: true })` data fetch — translation structure is unchanged.
- Do not change the `<ul>` bullet point structure or the `→` glyph.
- Do not remove the `rounded-full` from the status badge pill — pill radius is permitted for status badges by the design system.
- Do not add mobile-specific responsive breakpoints beyond what already exists.
- The `roadmap-grid` CSS class must not set a `gap` value that creates space between phase columns — `gap: 0` is required so the `border-right` acts as the sole separator.
- Do not use `md:grid-cols-3` on the grid element — the `.roadmap-grid` class defines the columns directly. This means on mobile the grid will collapse to a single column by default (the CSS class uses `repeat(3, 1fr)` which on narrow viewports will overflow). Since mobile layout is out of scope for this evolution, this is acceptable. Add a `TODO: mobile — stack roadmap phases vertically at sm breakpoint` comment in the CSS class.
- No `brand-*` or non-system color class names may remain in this component.

## Dependencies

none

## Validation criteria

- [ ] Roadmap phase `<div>` elements have no `border` on any side (other than the `border-right: 1px solid var(--ink-3)` and the grid's `border-top: 1px solid var(--ink-10)`).
- [ ] Roadmap phase containers have `border-radius: 0` (no rounded corners).
- [ ] No `box-shadow` is present on any roadmap phase element.
- [ ] The `.roadmap-grid` has `border-top: 1px solid var(--ink-10)` as computed style.
- [ ] All phase columns except the last have `border-right: 1px solid var(--ink-3)`.
- [ ] The last phase column has no `border-right`.
- [ ] The `<hr>` element is removed — no `<hr>` is present between the section header and the grid.
- [ ] The section header `<div>` has `border-bottom: 1px solid var(--ink-4)` (from `border-b border-ink-10`... wait — see note below).
- [ ] The "Live" phase status badge has `background: var(--ink-12)` and `color: var(--paper-1)`.
- [ ] The eyebrow reads "ROADMAP" in both EN and FR (the translation value is "ROADMAP" in both locales).
- [ ] No numeric section-index label (e.g. "01 / 03", "Phase 01") appears anywhere in the rendered section.
- [ ] No em-dash, en-dash, or exclamation mark in any rendered prose copy.
- [ ] No `brand-*` or non-system color class names in the component source.

**Note on header border class:** The Tailwind class for `border-bottom: 1px solid var(--ink-10)` is `border-b border-ink-10`. Verify that `border-ink-10` maps correctly to `--ink-10` in the Tailwind config — if not, use `style={{ borderBottom: '1px solid var(--ink-10)' }}` on the header div as a fallback.

## Tests to implement

### Unit
- None required.

### Integration
- Load the landing page and scroll to the Roadmap section.
- Open DevTools → inspect the `.roadmap-grid` element: confirm `border-top: 1px solid #2a2a26` (ink-10).
- Inspect each phase element: confirm no `border-top`, no `border-bottom`, no `border-left`; only `border-right: 1px solid #d6d4c7` (ink-3) on non-last phases.
- Inspect the last phase element: confirm `border-right: none`.
- Inspect the "Live" status badge: confirm `background-color: #0e0f0c` (ink-12), `color: #f6f4ef` (paper-1).
- Switch locale to FR and verify all phase titles and descriptions render correctly without overflow.
