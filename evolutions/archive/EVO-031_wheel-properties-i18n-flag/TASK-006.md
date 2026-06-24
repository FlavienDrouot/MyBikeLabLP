# TASK-006 — Add automated tests for registry completeness and translation key coverage

## Objective

Create a new test file `src/config/__tests__/wheelProperties.i18n.test.js` that:
1. Verifies every `WHEEL_PROPERTIES` entry has an explicit `translatable` boolean.
2. Verifies `rimMaterial`, `spokeMaterial`, and `hookless` are `translatable: true`.
3. Verifies all other listed properties are `translatable: false`.
4. For each `translatable: true` property, collects all distinct values from `wheelsData.js` and asserts each resolves to `"XX"` under the `xx` locale — detecting any missing translation key.

## Required context

### Test infrastructure

- Test runner: Vitest (configured in `vite.config.js`, `test.environment: 'node'`).
- Setup file: `src/test-setup.js` — already configures i18n with `en` and `xx` locales loaded from static JSON imports. The `xx` locale maps every key to `"XX"`. The `t` function is available via `i18n.t(key, { lng: 'xx' })`.
- After TASK-003, `xx.json` contains: `rimMaterial.carbon`, `rimMaterial.aluminum`, `spokeMaterial.stainless_steel`, `spokeMaterial.aluminum`, `hookless.true`, `hookless.false` — all mapped to `"XX"`.
- After TASK-002, `wheelsData.js` values are normalized: `rim.material` is `'carbon'` or `'aluminum'`; `spokes.material` is `'stainless_steel'` or `'aluminum'`.
- `hookless` is a boolean in the dataset; keys are built as `'hookless.' + String(w.rim.hookless)` → `'hookless.true'` or `'hookless.false'`.

### Key resolution mechanism

Use `i18n.t(key, { lng: 'xx' })` to resolve keys. The i18n instance is imported from `i18n` (aliased in `test-setup.js`). Since `test-setup.js` is a setup file for all tests, i18n is already initialized when this test runs. Do not call `i18n.init()` again.

A key is missing if the resolution returns the key itself (i18next returns the key string as fallback when no translation is found and `saveMissing` is not configured). To detect this: assert that the resolved value equals `"XX"` — if it does not, the key is absent.

### Properties to verify (complete list from WHEEL_PROPERTIES)

Non-translatable (expected `translatable: false`):
`image`, `model`, `brand`, `weight`, `price`, `diameter`, `depth`, `rimWidth`, `hub`, `hubBrand`, `hubModel`, `spokes`, `spokesBrand`, `spokesModel`

Translatable (expected `translatable: true`):
`rimMaterial`, `spokeMaterial`, `hookless`

### Accessor functions for translatable properties

- `rimMaterial`: `(w) => w.rim.material`
- `spokeMaterial`: `(w) => w.spokes.material`
- `hookless`: `(w) => String(w.rim.hookless)` — converts boolean to `'true'` or `'false'`

Do not use the registry's `accessor` directly for `hookless` because the registry accessor returns `w.rim.hookless` (a boolean), and the key requires the string form. Use `String(...)` explicitly in the test.

## Potentially impacted files

- `src/config/__tests__/wheelProperties.i18n.test.js` (new file — create this directory if it does not exist)

## Inputs

- `src/config/wheelProperties.jsx` (TASK-001 merged: every entry has `translatable`).
- `src/data/wheelsData.js` (TASK-002 merged: values are normalized).
- `public/locales/xx.json` (TASK-003 merged: new keys present).
- `src/test-setup.js` (existing — do not modify).

## Expected outputs

A new file `src/config/__tests__/wheelProperties.i18n.test.js` containing the following test suites (implement them as described):

---

### Suite 1: Registry completeness (AC-001, AC-002, AC-003)

```
describe('WHEEL_PROPERTIES registry — translatable field', () => {
  it('every entry has an explicit boolean translatable field')
  it('rimMaterial, spokeMaterial, hookless are translatable: true')
  it('brand, model, hubBrand, hubModel, spokesBrand, spokesModel, weight, price, diameter, depth, rimWidth are translatable: false')
  it('image, hub, spokes are translatable: false')
})
```

Implementation notes:
- Import `WHEEL_PROPERTIES` from `../../config/wheelProperties`.
- Use `WHEEL_PROPERTIES.find(p => p.id === 'rimMaterial')` etc.
- Assert `typeof property.translatable === 'boolean'` for every entry.
- For the third test: check the listed IDs explicitly (do not rely on "all others" logic).

---

### Suite 2: Translation key coverage via XX locale (AC-004, AC-007)

```
describe('XX locale — translatable field value coverage', () => {
  it('all distinct rimMaterial values in the dataset resolve to "XX" under the xx locale')
  it('all distinct spokeMaterial values in the dataset resolve to "XX" under the xx locale')
  it('hookless true and false both resolve to "XX" under the xx locale')
})
```

Implementation notes:
- Import `wheelsData` from `../../data/wheelsData`.
- Import `i18n` from `i18next`.
- For `rimMaterial`: collect `[...new Set(wheelsData.map(w => w.rim.material))]`. For each value, assert `i18n.t('rimMaterial.' + value, { lng: 'xx' }) === 'XX'`. If the assertion fails, the error message should identify the missing key (e.g. `"Missing translation key: rimMaterial.carbon"`).
- For `spokeMaterial`: same pattern with `w.spokes.material` and `'spokeMaterial.' + value`.
- For `hookless`: iterate over `['true', 'false']`. Assert `i18n.t('hookless.' + boolStr, { lng: 'xx' }) === 'XX'`.

Failure message format for a missing key:
```js
expect(resolved, `Missing translation key: ${key}`).toBe('XX');
```

---

### Suite 3: en and fr locale key presence (AC-004)

```
describe('en and fr locales — required categorical keys exist', () => {
  it('en locale contains all required rimMaterial keys')
  it('en locale contains all required spokeMaterial keys')
  it('en locale contains all required hookless keys')
  it('fr locale contains all required rimMaterial keys')
  it('fr locale contains all required spokeMaterial keys')
  it('fr locale contains all required hookless keys')
})
```

Implementation notes:
- Import `enTranslations` from `../../../public/locales/en.json` (static import, same pattern as `test-setup.js`).
- Import `frTranslations` from `../../../public/locales/fr.json`.
- For each required key, assert the nested path exists and is a non-empty string. Example: `expect(enTranslations.rimMaterial?.carbon).toBeTruthy()`.
- Keys to check: `rimMaterial.carbon`, `rimMaterial.aluminum`, `spokeMaterial.stainless_steel`, `spokeMaterial.aluminum`, `hookless.true`, `hookless.false`.

## Constraints

- Do not call `i18n.init()` in the test file — the setup file already initializes it.
- Do not change `test-setup.js`.
- The test file must not import React or any UI component — it is a pure data/config test.
- The file path must be `src/config/__tests__/wheelProperties.i18n.test.js`.

## Dependencies

TASK-001, TASK-002, TASK-003

## Validation criteria

- [ ] All three test suites (registry completeness, XX locale coverage, en/fr key presence) are present.
- [ ] All tests pass when the locale files and registry are correct.
- [ ] Deleting a key from `xx.json` (e.g. removing `rimMaterial.carbon`) causes the XX locale test to fail with a message identifying the missing key.
- [ ] Restoring the deleted key causes the test to pass again.
- [ ] `npm run test` shows this new file and all its tests passing.

## Tests to implement

This task IS the test implementation. No further tests needed.
