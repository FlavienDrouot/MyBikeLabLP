# TASK-003 — Migrate `BenefitsGrid.jsx` to hairline card flavor

## Objective

Update `BenefitsGrid.jsx` so that each benefit card uses the design system hairline card specification: `background: var(--paper-0)`, `border: 1px solid var(--ink-4)`, `border-radius: 0`, no `box-shadow`, `padding: 24px`. Remove the generic `.card p-6` class from the card wrappers and replace with the correct hairline card classes. Ensure the section eyebrow renders via `.t-eyebrow` and is a descriptive label (already correct in the current implementation — verify and leave unchanged if so).

## Required context

### Current `BenefitsGrid.jsx` structure

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
          <p className="t-eyebrow">{t('benefits.sectionIndex')}</p>
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
```

### Existing CSS classes to know

From `frontend/src/index.css` (`@layer components`):
- `.card`: `@apply rounded-none border border-ink-4 bg-paper-0;`
  - This already matches the hairline card spec exactly: `border-radius: 0`, `border: 1px solid var(--ink-4)`, `background: var(--paper-0)`.
  - The `.card` class does NOT set a `box-shadow` — hairline card spec is already fully expressed by `.card`.
- `.section`: `@apply py-16 sm:py-20 lg:py-24;` — this is the standard section vertical padding; do not remove it.

### Hairline card specification (design system)

A hairline card must have:
- `background: var(--paper-0)` — the lightest paper surface
- `border: 1px solid var(--ink-4)` — hairline border
- `border-radius: 0` — square corners, no rounding
- No `box-shadow` — flat surface
- `padding: 24px` — generous internal padding

The current `.card p-6` provides: `.card` (correct bg/border/radius) + `p-6` (= `24px` padding in Tailwind). This is already correct.

### What actually needs to change

After careful inspection, the `.card p-6` combination already satisfies the hairline card spec. However, verify:
1. That no `rounded-*` class (other than `rounded-none`) is applied to the card `<div>`.
2. That no `shadow-*` class is applied to the card `<div>`.
3. That the section eyebrow (`t-eyebrow`) is a descriptive label with no numeric index pattern (currently `"BENEFITS"` / `"AVANTAGES"` — compliant).
4. That the icon wrapper (`rounded-none bg-brass-3`) uses `rounded-none` correctly — it does.

If all four conditions are already met, the only substantive change in this task is **documentation and verification** — the component is already largely compliant. However, the icon wrapper class `text-brass-9` must be verified against the token set.

### Token verification

- `brass-3`: `#f3ead8` — valid system token. OK.
- `brass-9`: `#8c6e35` — valid system token. OK.
- `text-ink-11`: `#1a1a17` — valid system token. OK.
- `text-ink-8`: `#555550` — valid system token. OK.

### UI constraints (from `shared-knowledge/ui-guidelines.md`)

- Cards must use `border-radius: 0` — no rounded corners. Verify no `rounded-*` class on card wrapper.
- No `box-shadow` on cards. Verify no `shadow-*` class on card wrapper.
- The `.card` class uses `border border-ink-4` — this is the correct hairline border.
- No section-index labels: the eyebrow `"BENEFITS"` / `"AVANTAGES"` is a descriptive label, not a numeric index — compliant.
- No em-dash, en-dash, or exclamation mark in any prose copy. The current EN descriptions ("Stop comparing PDFs and forum threads…", "Every spec is sourced and structured…", "Built with riders, manufacturers and resellers…") are clean. FR descriptions are also clean. No changes required.
- Lists of 3 items in a 3-column card grid: this is a card grid, not a plain `<ul>` — compliant.

## Potentially impacted files

- `frontend/src/components/BenefitsGrid.jsx`

## Inputs

- Current `BenefitsGrid.jsx` source (shown above)
- Design system hairline card spec: `background: var(--paper-0)`, `border: 1px solid var(--ink-4)`, `border-radius: 0`, no `box-shadow`, `padding: 24px`

## Expected outputs

The component must be updated so that:
1. Each card `<div>` uses exactly `className="card p-6"` — no `rounded-*` additions, no `shadow-*` additions.
2. The section eyebrow is rendered with `className="t-eyebrow"` (already correct).
3. No legacy `brand-*` or non-system color class names are present anywhere in the component.

If the current source already satisfies all three conditions without change, confirm this via the validation criteria and make no edits. If any condition is not met, apply the minimum necessary fix.

**Expected state after task completion:** `BenefitsGrid.jsx` is either unchanged (if already compliant) or has had any non-compliant class names replaced with their correct equivalents.

## Constraints

- Do not change the section background color (`bg-paper-2`) — it is not specified by the PRD and provides useful contrast for the `paper-0` hairline cards.
- Do not change the icon wrapper styling (`grid h-10 w-10 place-items-center rounded-none bg-brass-3 text-brass-9`) — it is compliant with system tokens and not in conflict with any FR rule.
- Do not modify the translation files or the `benefits.sectionIndex` key — the value "BENEFITS" / "AVANTAGES" is already a compliant descriptive eyebrow label.
- Do not introduce new CSS classes to `index.css` for this task — the existing `.card` class is sufficient.

## Dependencies

none

## Validation criteria

- [ ] Each benefit card `<div>` has `border-radius: 0` (computed style: `border-radius` equals `0px`).
- [ ] Each benefit card has `background: var(--paper-0)` (computed color: `#fbfaf6`).
- [ ] Each benefit card has `border: 1px solid var(--ink-4)` (computed border: `1px solid #c2c0b3`).
- [ ] No `box-shadow` is applied to any benefit card (computed `box-shadow` is `none`).
- [ ] Card padding is `24px` on all sides (computed `padding` is `24px`).
- [ ] The eyebrow reads "BENEFITS" in EN and "AVANTAGES" in FR (uppercase applied by `.t-eyebrow` CSS).
- [ ] No `brand-*`, `blue-*`, or non-system color class names appear in the component source.
- [ ] No em-dash, en-dash, or exclamation mark in any rendered text (EN and FR).

## Tests to implement

### Unit
- None required.

### Integration
- Load the landing page and scroll to the Benefits section.
- Open DevTools → inspect each card element: confirm `border-radius: 0px`, `background-color: rgb(251, 250, 246)`, `border: 1px solid rgb(194, 192, 179)`, `box-shadow: none`.
- Confirm `padding: 24px` on the card element.
- Switch locale to FR and verify eyebrow reads "AVANTAGES" and no layout issues.
