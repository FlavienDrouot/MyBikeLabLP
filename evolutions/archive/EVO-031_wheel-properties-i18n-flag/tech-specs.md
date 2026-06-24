# Technical Specifications

## 1. General Information

- Evolution ID: EVO-031
- PRD reference: `evolutions/EVO-031_wheel-properties-i18n-flag/prd.md`
- Author: Flavien Drouot
- Date: 2026-05-29

---

## 2. Technical Context

### Technical objective

Add a `translatable` boolean field to every entry in `WHEEL_PROPERTIES`. Normalize categorical values in `wheelsData.js` to lowercase snake_case. Add translation keys for all translatable categorical values to the `fr`, `en`, and `xx` locale files. Modify the cell rendering pipeline to route `translatable: true` field values through `t('[fieldId].[value]')`. Add an automated test suite covering registry completeness and translation key coverage.

### Affected architecture

- `wheelProperties.jsx` — central registry: gains `translatable` field on every entry
- `columnCells.jsx` — cell rendering: `renderCellFor` gains a second `t` argument; applies translation when `property.translatable === true`
- `ComparisonTable.jsx` and `MeasuringTable.jsx` — callers of `renderCellFor`: pass `t` as second argument
- `wheelProperties.jsx` — `hookless` entry: `renderCell` updated to call `t('hookless.' + String(w.rim.hookless))`
- `wheelsData.js` — categorical values normalized to lowercase snake_case
- `public/locales/en.json`, `fr.json`, `xx.json` — gain categorical value translation keys

### Impacted modules

- `src/config/wheelProperties.jsx`
- `src/components/MiniComparator/columnCells.jsx`
- `src/components/MiniComparator/ComparisonTable.jsx`
- `src/components/MiniComparator/MeasuringTable.jsx`
- `src/data/wheelsData.js`
- `public/locales/en.json`
- `public/locales/fr.json`
- `public/locales/xx.json`
- `src/config/__tests__/wheelProperties.i18n.test.js` (new file)

---

## 3. Technical Constraints

- The `translatable` flag must live in `wheelProperties.jsx` — not in `wheelsData.js`
- Fallback behavior for missing translation keys is i18next `fallbackLng: 'en'` — must not be overridden
- The `XX` locale (`xx`) is already registered in `test-setup.js` (alongside `en`) and must be used for key-coverage tests
- Must not break the existing `fr`/`en` language switch (EVO-023)
- Non-translatable field values (brands, models, numeric values) must never pass through `t()`
- `wheelsData.js` normalization is the only permitted change to that file

---

## 4. Architecture Decisions

### AD-001 — `translatable` boolean on every WHEEL_PROPERTIES entry
#### Description
Every entry in `WHEEL_PROPERTIES` gains a `translatable: boolean` field. `rimMaterial`, `spokeMaterial`, and `hookless` are `true`; all others are `false`.
#### Motivation
Single source of truth: the registry entry for a property determines whether its values are translated. Tests and the rendering pipeline read this flag from the same place.
#### Rejected alternatives
- Separate exported list of translatable IDs: creates duplication and can drift from the registry.
- Implicit inference from filter type: fragile (a `multiSelect` property is not always translatable).

---

### AD-002 — Locale keys at top level of JSON: `rimMaterial.carbon`, not `properties.rimMaterial.carbon`
#### Description
Translation keys for categorical values follow the `[fieldId].[value]` pattern, placed at the top level of the locale JSON. They are separate from the existing `properties.[fieldId].label` entries.
#### Motivation
The PRD specifies the `[fieldId].[value]` key convention. Nesting under `properties` would break this pattern and conflict with the existing label structure.
#### Rejected alternatives
- Nesting under `properties` (e.g. `properties.rimMaterial.carbon`): deviates from the PRD convention and the existing `label` nesting would become ambiguous.

---

### AD-003 — `hookless` renderCell calls `t('hookless.' + String(w.rim.hookless))`
#### Description
The `hookless` property entry in `WHEEL_PROPERTIES` has a custom `renderCell`. This `renderCell` receives `(w, t)` and returns `t('hookless.' + String(w.rim.hookless))` — mapping the boolean to `hookless.true` or `hookless.false`. The `<HookBadge>` component continues to be used in the FilterPanel tri-state UI and is not changed.
#### Motivation
The comparator table cell for `hookless` must display a translated text value, consistent with FR-005. The badge's existing keys (`badges.hookless`, `badges.hooked`) are independent and serve a different UI context.
#### Rejected alternatives
- Modifying `HookBadge` to use `hookless.true/false` keys: would change the badge's translation keys and potentially break FilterPanel label rendering.

---

### AD-004 — `renderCellFor` in `columnCells.jsx` accepts `(property, t)` and applies translation when `translatable: true`
#### Description
`renderCellFor(property, t)` returns a function `(w) => cell`. When `property.translatable === true` and `property.column.renderCell` is not defined, the default renderer calls `t(property.id + '.' + property.accessor(w))`. When `renderCell` is defined (custom renderer), it is called as `property.column.renderCell(w, t)`. Callers (`ComparisonTable`, `MeasuringTable`) pass `t` as the second argument.
#### Motivation
Centralizes the translation-routing logic in the designated cell-rendering module. The `translatable` flag becomes operationally meaningful at runtime, not just for tests. No JSX changes required in `wheelProperties.jsx` for `rimMaterial` and `spokeMaterial`.
#### Rejected alternatives
- Inline `renderCell` in each translatable property: requires JSX import in `wheelProperties.jsx` and does not use the `translatable` flag at runtime.
- Passing `t` via React context: over-engineered for this scope.

---

### AD-005 — `wheelsData.js` categorical values normalized to lowercase snake_case in-place
#### Description
`rim.material` values: `'Carbon'` → `'carbon'`, `'Aluminum'` → `'aluminum'`. `spokes.material` values: `'Stainless Steel'` → `'stainless_steel'`, `'Aluminum'` → `'aluminum'`.
#### Motivation
The `[fieldId].[value]` key pattern requires stable lowercase snake_case values as the key suffix. Normalizing at the data source is the cleanest approach and keeps accessors and selectors unchanged.
#### Rejected alternatives
- Runtime lowercasing in the accessor: accessor logic would diverge from the data, and existing tests rely on raw accessor values (e.g. `rimMaterial.Carbon` would appear in filter counts).

---

## 5. Task Breakdown

| Task | File | Summary | Dependencies |
|------|------|---------|--------------|
| TASK-001 | `TASK-001.md` | Add `translatable` boolean to every entry in `WHEEL_PROPERTIES` | none |
| TASK-002 | `TASK-002.md` | Normalize categorical values in `wheelsData.js` to lowercase snake_case | none |
| TASK-003 | `TASK-003.md` | Add categorical translation keys to `en.json`, `fr.json`, and `xx.json` | none |
| TASK-004 | `TASK-004.md` | Update `renderCellFor` in `columnCells.jsx` to accept `t` and apply translation for `translatable: true` properties; update `hookless` renderCell in `wheelProperties.jsx` | TASK-001, TASK-002, TASK-003 |
| TASK-005 | `TASK-005.md` | Update callers of `renderCellFor` (`ComparisonTable.jsx`, `MeasuringTable.jsx`) to pass `t` as second argument | TASK-004 |
| TASK-006 | `TASK-006.md` | Add automated tests for registry completeness and translation key coverage via XX locale | TASK-001, TASK-002, TASK-003 |

---

## 6. Global Validation Strategy

### Unit validation
- Every entry in `WHEEL_PROPERTIES` has `translatable` set to a boolean.
- `rimMaterial`, `spokeMaterial`, `hookless` are `translatable: true`.
- All other properties are `translatable: false`.
- For each `translatable: true` property, all distinct values from `wheelsData.js` resolve to `"XX"` under the `xx` locale.

### Integration validation
- With the `en` locale active, `rimMaterial` cells display `"Carbon"` (English translation).
- With the `fr` locale active, `rimMaterial` cells display the French translation.
- With the `xx` locale active (test environment), `rimMaterial`, `spokeMaterial`, and `hookless` cells display `"XX"`.
- Switching language updates all translatable cells reactively (no page reload).

### Functional validation
- Brand, model, hub brand/model, spokes brand/model cells are identical in `fr` and `en`.
- Numeric/range values (weight, price, depth, rim width) are unaffected.

### Non-regression validation
- Existing test suite passes without modification: `wheelsSelectors.test.js`, `ComparisonTable.test.jsx`, `Navbar.test.jsx`, `Footer.test.jsx`, `FilterPanel.test.jsx`, `Landing.xx.test.jsx`, `MiniComparator.viewport-cap.test.jsx`, `ComparisonTable.column-widths.test.jsx`.
- The `fr`/`en` language switch established in EVO-023 continues to work.

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Normalizing `wheelsData.js` breaks existing tests that assert raw `rimMaterial` or `spokeMaterial` values (e.g. `'Carbon'`) | Medium | Audit all test files for hard-coded categorical strings before TASK-002; update expected values to lowercase snake_case |
| `renderCellFor` signature change breaks callers not yet updated | Medium | TASK-005 updates all callers atomically; `t` is optional with a default no-op guard if needed |
| Missing translation key in `fr` or `en` causes raw value display in production | Low | TASK-006 XX locale test catches this; TASK-003 adds all required keys |
| `hookless` boolean serialization: `String(false)` produces `'false'`, matching key `hookless.false` | Low | Verified in test; `String(true)` → `'true'`, `String(false)` → `'false'` |

---

## 8. Rollback Plan

- `TASK-001` is additive (new field on registry entries) — safe to revert by removing the `translatable` field.
- `TASK-002` modifies data values — rolling back requires reverting to mixed-case strings; existing tests using lowercase strings would also need reverting.
- `TASK-003` is additive (new locale keys) — safe to revert by removing the added keys.
- `TASK-004` and `TASK-005` modify the rendering pipeline — rolling back restores `renderCellFor(p)(w)` call sites and removes the `t` parameter.
- `TASK-006` is additive (new test file) — safe to revert by deleting the file.
