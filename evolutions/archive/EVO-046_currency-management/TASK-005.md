# TASK-005: Navbar currency selector (€ / $) + FR/EN localization

## Objective

Add a currency selector to the navbar that lets the user pick the display currency (€ or $),
defaulting to EUR, and dispatching the `changeDisplayCurrency` thunk so the whole comparator
re-expresses. Localize its labels in FR and EN.

## Required context

- `src/components/Navbar.jsx` already hosts a `LanguageToggle` (EN/FR) built as a segmented
  group of two buttons:
  ```jsx
  <div className="flex items-center gap-0.5" role="group" aria-label="Language"> … </div>
  ```
  with each button using `aria-pressed`, the active style
  `bg-ink-11 text-paper-0`, inactive `text-fg-muted hover:text-fg-primary`, and a
  `transition: color/background-color var(--duration-quick) var(--ease-standard)` inline style.
  Build the currency selector as a sibling segmented group with the **same** visual pattern and
  place it next to `LanguageToggle` in the right-hand cluster (desktop), and inside the mobile
  menu region for small screens, consistent with the existing layout.
- The selector dispatches `changeDisplayCurrency(code)` (thunk from TASK-004) via `useDispatch`,
  and reads the active currency via `useSelector((s) => s.currency.displayCurrency)`.
- Currencies and default come from `src/lib/currency.js` (`SUPPORTED_CURRENCIES`,
  `DEFAULT_CURRENCY`). Render order: EUR then USD. Button content: the symbol (`€`, `$`).
- i18n: resources live in `frontend/public/locales/{en,fr}.json`, loaded via i18next HttpBackend
  (`/MyBikeLabLP/locales/{{lng}}.json`). Existing price-related keys: `sorts.price_asc/_desc`,
  `properties.price.label`, `common.notAvailable`, `wheelDetail.priceAnnotation`.

### UI guideline constraints (embedded — implementation agent does not read the guidelines file)
- **Interactive states**: implement the full cycle for each selector button — hover
  (color/background only, exempt from the `hover:hover` gate), active/selected (`aria-pressed`),
  and focus-visible (keyboard ring consistent with other navbar controls). No disabled state is
  expected (both currencies always available).
- **Accessibility**: wrap the two buttons in a `role="group"` with an `aria-label` ("Currency" /
  localized); each button uses `aria-pressed`; contrast meets WCAG AA (reuse the proven
  `bg-ink-11 text-paper-0` active tokens). Keyboard operable.
- **Animation**: this control is used dozens of times/day → only color/background transitions,
  reuse `var(--duration-quick)` + `var(--ease-standard)`; no movement, no bounce. Respect
  `prefers-reduced-motion` (color/opacity transitions may stay).
- **Forbidden patterns**: no em-dash in the `aria-label` or any visible text; use the bare symbol
  (`€`, `$`) as the button label. No decorative status dots. One corner-radius system — match the
  `rounded-xs` used by `LanguageToggle`.
- Design system: follow `MyBikeLab/design-system/` tokens (`ink-*`, `paper-*`); do not introduce
  new colors or easing curves.

## Inputs

- `changeDisplayCurrency` thunk (TASK-004), `state.currency.displayCurrency` (TASK-002),
  `SUPPORTED_CURRENCIES` / `DEFAULT_CURRENCY` (TASK-001).

## Expected outputs

- A `CurrencyToggle` component (in `Navbar.jsx` alongside `LanguageToggle`, or a small sibling
  file) rendered in the navbar (desktop cluster + mobile menu).
- New i18n keys in `en.json` and `fr.json`, e.g.:
  - `nav.currency` → group aria-label ("Currency" / "Devise").
  - Optionally a tooltip/`aria-label` per button ("Show prices in euros" / "Afficher les prix en
    euros", and USD equivalents). No em-dash.
- Default selection EUR reflected on load.

## Constraints

- No persistence: a reload returns to EUR (do not write the choice to `localStorage`).
- Visual and interaction parity with `LanguageToggle`; do not redesign the navbar.
- Keep the change scoped to the selector + its labels; price formatting/conversion already lives
  in earlier tasks.

## Dependencies

TASK-002, TASK-004

## Validation criteria

- [ ] The navbar shows a € / $ selector; EUR is active on first load.
- [ ] Selecting $ switches the comparator to USD (column, filter bounds, selection, sort); selecting € switches back.
- [ ] After a reload, the selector is back on EUR (AC-008).
- [ ] Buttons expose `aria-pressed`; the group has a localized `aria-label`; focus-visible ring present.
- [ ] FR and EN both show correct selector labels/aria text; switching language updates them (AC-010).
- [ ] No em-dash in any added label.

## Tests to implement

### Unit

- `Navbar` (extend `components/__tests__/Navbar.test.jsx`): renders both currency buttons,
  `aria-pressed` reflects the store, clicking `$` dispatches a currency change, default is EUR.

### Integration

- With a real store, clicking `$` in the navbar updates `state.currency.displayCurrency` and the
  `ComparisonTable` price column re-renders in USD.
</content>
