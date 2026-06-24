# TASK-002: Currency Redux slice + store wiring

## Objective

Add a `currencySlice` holding the active display currency in global state, defaulting to EUR
and reset on every load (no persistence). Wire it into the store. No UI and no consumer logic
in this task.

## Required context

- The store is configured in `frontend/src/store/index.js`:
  ```js
  export const store = configureStore({
    reducer: { wheels: wheelsReducer, filters: filtersReducer },
  });
  ```
- Existing slices follow Redux Toolkit `createSlice` conventions (see
  `store/slices/filtersSlice.js`).
- Display currency is **not** persisted: default EUR on every session (FR-003, FR-004, AC-008).
  Do NOT add `localStorage` for it (contrast with i18n, which does persist language).
- `DEFAULT_CURRENCY` and `SUPPORTED_CURRENCIES` come from `src/lib/currency.js` (TASK-001) — but
  to keep this task independent of TASK-001's merge, you may inline `'EUR'` as the default and
  validate against a local constant; if TASK-001 is already merged, import from `currency.js`.

## Inputs

- Action `currency/setDisplayCurrency` with payload a currency code.

## Expected outputs

- `frontend/src/store/slices/currencySlice.js`:
  - Initial state: `{ displayCurrency: 'EUR' }`.
  - Reducer `setDisplayCurrency(state, action)` setting `displayCurrency` to the payload only
    if it is a supported currency (ignore unsupported values defensively).
  - Export the action creator and the reducer (default export).
- `frontend/src/store/index.js`: register `currency: currencyReducer`.

## Constraints

- No persistence (no `localStorage`, no `redux-persist`).
- Keep the slice minimal; the `changeDisplayCurrency` thunk and monetary-filter re-expression
  belong to TASK-004, not here.

## Dependencies

none

## Validation criteria

- [ ] `store.getState().currency.displayCurrency` === `'EUR'` on a fresh store.
- [ ] Dispatching `setDisplayCurrency('USD')` updates it to `'USD'`.
- [ ] Dispatching `setDisplayCurrency('GBP')` (unsupported) leaves it unchanged.
- [ ] Existing `wheels` and `filters` slices remain registered and functional.

## Tests to implement

### Unit

- `frontend/src/store/slices/__tests__/currencySlice.test.js`: initial state, valid switch,
  unsupported-value no-op.

### Integration

- A store smoke test asserting all three reducers (`wheels`, `filters`, `currency`) are present.
</content>
