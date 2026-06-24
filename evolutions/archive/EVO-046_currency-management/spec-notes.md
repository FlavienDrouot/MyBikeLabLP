# Spec Notes — EVO-046

Running log of non-obvious decisions made during the Tech Specs phase.

## PRD interpretations

- **Canonical field names (left to Tech Specs by PRD §8).** Chosen shape:
  `{ amount: number | null, currency: 'EUR' | 'USD', url }` for `prices[]`, and
  `{ name, url, amount, currency }` for `affiliateLinks` entries. `amount` (not `price`) avoids
  collision with the existing `price` registry property id and reads naturally with `currency`.
- **`affiliateLinks` are in scope.** The PRD §7 impact list names only the comparator and the
  registry, but the data files carry `price_eur` inside `affiliateLinks` too, and AC-002 requires
  *no* legacy `price_eur` left anywhere in the data files. So `affiliateLinks` is migrated as well
  (TASK-003). This is the reason `WheelDetailPanel` is also touched even though the PRD did not
  list it.
- **USD-only wheels today.** Several brands store the real price in `other_specs.price_usd` with
  `price_eur: null`. The migration folds that USD value into the offer's `amount`/`currency`,
  which is exactly the AC-001 fix (no more silent `N/A` / exclusion).
- **`≈` hint scope.** The hint is decided per *displayed* (selected-minimum) offer: shown only
  when that offer's source currency differs from the display currency (FR-008, UC-003). A wheel
  whose cheapest offer happens to be native shows no hint even if other offers were converted.

## Architecture decision rationale

- **AD-001 (accessor context).** Keeps conversion runtime-only and the registry the single source
  of truth. A `(wheel, ctx)` signature is backward-compatible (existing accessors ignore the
  second arg) and recomputes through memoized selectors on every currency change. Chosen over a
  module-level "current currency" global, which would defeat memoization and testability.
- **AD-002 (one offer shape).** Unifying `prices[]` and `affiliateLinks` on `{ amount, currency }`
  lets the comparator and the detail panel read one field and satisfies AC-002 cleanly.
- **AD-003 (single currency module).** One documented rate constant (AC-006) and one formatter,
  replacing the duplicated `toLocaleString('fr-FR') + ' €'` formatters in `wheelProperties.jsx`
  and `WheelDetailPanel.jsx`.
- **AD-004 (`monetary` flag + thunk).** Currency-switch consistency (FR-011/AC-004) needs the
  stored price-range selection converted, not reset. Driving it from a registry `monetary` flag
  keeps `filtersSlice` generic instead of hardcoding the `'price'` id.

## Tradeoffs

- **TASK-003 EUR baseline then TASK-004 display-currency.** TASK-003's `minPrice` normalizes to
  EUR; TASK-004 generalizes it to the active currency, lightly reworking the same helper. Accepted
  for two clean green checkpoints (schema migration vs currency-awareness) and smaller diffs,
  matching the PRD's separation of FR-014 (migration) from FR-006/007/008 (conversion).
- **Linear task dependencies.** Tasks are independently mergeable in the sense that each leaves the
  app green and shippable, but they form a chain (data + readers must change together; UI selector
  after the conversion plumbing). This is unavoidable for a schema cutover.
- **Float drift on repeated switches.** Converting the stored `{ min, max }` back and forth can
  drift by sub-step amounts. Mitigated by rounding to the filter step on each re-expression and
  by converting from the canonical native amounts for column/sort values (which never drift).

## Open questions

All three pre-implementation questions were confirmed by the user (2026-06-04):

- **Resolved — detail panel follows the display currency.** `WheelDetailPanel` re-expresses in the
  selected currency (TASK-004), for a consistent app-wide experience. Confirmed.
- **Resolved — exchange rate.** Ship `1 EUR = 1.16 USD` (`RATES = { EUR: 1, USD: 1.16 }`), comment
  "as of 2026-06" (TASK-001). Confirmed.
- **Resolved — EUR formatting locale.** EUR prices use `toLocaleString('fr-FR')` (`1 234 €`) even
  when the UI language is EN; USD uses `en-US` (`$1,234`). Confirmed (matches current behaviour).
- **Variant/sibling pricing during migration.** Where a USD price was shared across siblings via a
  factory helper, the migration preserves the existing per-entry value; no re-sourcing of prices is
  done in this evolution.
</content>
