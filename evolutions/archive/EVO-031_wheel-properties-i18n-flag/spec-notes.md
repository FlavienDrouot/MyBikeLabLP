# Spec Notes — EVO-031 Wheel Properties i18n Flag

---

## PRD Interpretations

### wheelsData.js normalization is in scope
The PRD out-of-scope clause states: "no change to `wheelsData.js` beyond normalizing categorical values to stable lowercase snake_case form (if not already done)". The current dataset uses mixed case for categorical values (`'Carbon'`, `'Stainless Steel'`, `'Aluminum'`). These must be normalized to lowercase snake_case (`carbon`, `stainless_steel`, `aluminum`) so that the translation key pattern `[fieldId].[value]` resolves correctly. This normalization is therefore in scope as a prerequisite.

### Exact set of data values
From inspection of `wheelsData.js`:
- `rimMaterial` values: `carbon` (all 15 wheels) and `aluminum` (0 wheels after inspection — Fulcrum wheel 4 has `Aluminum` spokes, not rim — actually all rims are Carbon)
  - Actual values present: `Carbon` (all 15 wheels)
  - Normalized: `carbon`
  - The `en.json` and `fr.json` locale files must contain `rimMaterial.carbon` and `rimMaterial.aluminum` (the latter per AC-004 which lists it; even if not currently in the dataset, adding both is safe and prevents future missing-key failures)
- `spokeMaterial` values present in dataset: `Stainless Steel`, `Aluminum` (wheel 4 Fulcrum has `'Aluminum'` spokes)
  - Normalized: `stainless_steel`, `aluminum`
- `hookless` values: `true` and `false` (both present)
  - Keys: `hookless.true`, `hookless.false`

### hookless is rendered via HookBadge, not via t()
Currently `hookless` has `renderCell: (w) => <HookBadge hookless={w.rim.hookless} />`. The PRD requires that translatable values be rendered via `t("[fieldId].[value]")`. For `hookless`, the boolean must be converted to `hookless.true` or `hookless.false` before the translation lookup. Two approaches:
1. Move translation into `HookBadge` (passes the key to `t()` internally).
2. Change `renderCell` in `wheelProperties.jsx` to call `t('hookless.' + String(w.rim.hookless))`.

Decision (AD-003): Keep `HookBadge` as the display component but make it use `t('hookless.true')` / `t('hookless.false')` internally, replacing its current hardcoded badge strings. The badge currently uses `badges.hookless` and `badges.hooked` keys — these keys remain valid for the badge text, but the `hookless` property column cell must resolve via `t('hookless.true')` / `t('hookless.false')`. The cleanest approach is to add a separate `renderCell` in the `hookless` property entry that calls `t('hookless.' + String(w.rim.hookless))` directly, bypassing the badge (since the badge is already a separate visual component for the tri-state filter UI). Re-reading the code: `renderCell: (w) => <HookBadge hookless={w.rim.hookless} />` is used in the table column. The translation of the hookless *value* in the table cell should go through `t('hookless.true')` or `t('hookless.false')`. The badge is acceptable as long as the badge itself calls `t()` with the correct key. Decision: the `HookBadge` component will be updated to call `t('hookless.true')` and `t('hookless.false')` (replacing the current `t('badges.hookless')` and `t('badges.hooked')`) — or a separate approach can keep both keys coexisting. See AD-003 below.

Revised decision: the `renderCell` for `hookless` in `wheelProperties.jsx` replaces the `<HookBadge>` with a direct `t('hookless.' + String(w.rim.hookless))` call. This is the cleanest implementation and avoids modifying the badge component. The badge component is used elsewhere (FilterPanel triState labels) and should remain unchanged. The comparator table cell for hookless will simply render the translated string, consistent with how rimMaterial and spokeMaterial cells render.

### renderCellFor in columnCells.jsx handles the default case
The `renderCellFor` helper returns `property.column?.renderCell ?? ((w) => ...)`. For `rimMaterial` and `spokeMaterial`, there is no custom `renderCell`, so the default renderer fires: `property.accessor(w) + (property.unit ?? '')`. After this evolution, the default renderer must call `t(property.id + '.' + property.accessor(w))` when the property is `translatable: true`. The default renderer in `columnCells.jsx` needs access to `t()`, but it currently does not use React hooks. Two approaches:
1. Pass `t` as an argument to `renderCellFor`.
2. Move the translation logic into the property's `renderCell` in `wheelProperties.jsx`.

Decision (AD-004): Add `renderCell` entries for `rimMaterial`, `spokeMaterial` and `hookless` directly in `wheelProperties.jsx`. Each `renderCell` calls `t('[fieldId].[value]')`. This keeps `columnCells.jsx` unchanged and avoids the need to thread `t` through `renderCellFor`. It is also the most explicit and auditable approach.

### The `translatable` flag is metadata only
The `translatable` boolean is metadata on each property entry. It is used by:
- Tests (to detect which properties to verify).
- The `renderCell` of each translatable property (which applies `t()` to its value).

The `translatable` flag is NOT consumed at runtime by a generic routing function inside `columnCells.jsx`. This avoids coupling the rendering pipeline to the registry flag.

### XX locale test scope
The PRD requires a test that, for each `translatable: true` field, collects all distinct values from `wheelsData.js` and asserts each resolves to `"XX"` using the `XX` locale. This test is a pure unit test: it imports `WHEEL_PROPERTIES`, `wheelsData`, and calls `i18n.t()` with `lng: 'xx'` after confirming the `XX` locale is loaded. This test lives in a new file: `src/config/__tests__/wheelProperties.i18n.test.js`.

### AC-001/AC-002/AC-003 automated verification
These acceptance criteria can be verified by tests that inspect the `WHEEL_PROPERTIES` array and assert the `translatable` field values. These tests live in the same file as the XX locale test: `src/config/__tests__/wheelProperties.i18n.test.js`.

### fr locale: `fr.json` currently has no categorical value translations
The `fr.json` locale has `properties.rimMaterial.label` etc. but no `rimMaterial.carbon` etc. keys. These need to be added at the top level of the JSON (not nested under `properties`).

---

## Architecture Decision Rationale

### AD-001: `translatable` field on every WHEEL_PROPERTIES entry
The flag must be on the central registry so that tests and any future consumer can inspect translatability from a single source of truth. Alternatives:
- A separate exported constant listing translatable IDs: rejected because it creates duplication and can drift from the registry.
- Implicit (no flag, rely on property type inference): rejected because the PRD explicitly requires the flag.

### AD-002: Locale keys at top level of JSON, not nested under `properties`
The pattern `[fieldId].[value]` (e.g. `rimMaterial.carbon`) produces a top-level namespace per field in the JSON. The existing `properties` namespace is for UI labels (`properties.rimMaterial.label`). These are different concerns and must remain separate. Mixing them would require keys like `properties.rimMaterial.carbon`, which deviates from the PRD convention.

### AD-003: hookless renderCell calls t('hookless.true') / t('hookless.false')
The `hookless` property currently uses `<HookBadge>` to render a styled badge. The badge uses `t('badges.hookless')` and `t('badges.hooked')`. For the comparator table cell to display a translated text value consistent with FR-005 and the `[fieldId].[value]` key convention, the `renderCell` must call `t('hookless.' + String(w.rim.hookless))`. The badge is retained for the FilterPanel tri-state UI only — it is not changed. The table cell rendering is replaced with a plain translated string (no badge styling). This is a deliberate simplification: the PRD covers "text display form" for hookless.

### AD-004: renderCell added in wheelProperties.jsx for rimMaterial and spokeMaterial
Rather than modifying `columnCells.jsx` to accept `t` as a parameter, each translatable property gets its own `renderCell` that calls `t()` directly. This requires importing `useTranslation` at the property entry level — but property entries are plain objects, not React components, so they cannot call hooks directly. Resolution: `renderCell` is a function that receives `(w)` but needs `t`. The `renderCell` in the registry cannot call `useTranslation()` because it is not a React component. Therefore, `t` must be passed into the render pipeline.

Final decision (AD-004): Modify `columnCells.jsx` to accept `(property, t)` and apply `t('[fieldId].[value]')` when `property.translatable === true` and no `renderCell` is defined. For `hookless` (which has a custom `renderCell`), update the `renderCell` in `wheelProperties.jsx` to call `t('hookless.' + String(w.rim.hookless))` — receiving `t` as second argument: `renderCell: (w, t) => t('hookless.' + String(w.rim.hookless))`. Update callers: `ComparisonTable.jsx` and `MeasuringTable.jsx` pass `t` to `renderCellFor`.

---

## Tradeoffs

### Inline renderCell vs. modified columnCells.jsx
- Inline renderCell: simple for each property, but requires JSX imports in wheelProperties.jsx and does not use the `translatable` flag at runtime (the flag only serves tests).
- Modified columnCells.jsx: slightly more complex, but the `translatable` flag becomes operationally meaningful and the translation logic is centralized.
- Chosen: modified columnCells.jsx for consistency between the flag's purpose (flag says "translatable", renderer respects the flag).

### wheelsData.js normalization: in-place vs. computed at read time
- In-place normalization: clean data at the source, simple accessors, matches the PRD convention.
- Computed at read time: wheelsData.js untouched, but adds complexity to accessors or selectors.
- Chosen: in-place normalization (PRD explicitly permits this and says "if not already done").

---

## Open Questions

1. **`rimMaterial.aluminum` in locale files**: Only `carbon` appears in the current dataset. Including `aluminum` keys anyway is safe and the PRD's AC-004 explicitly lists it. No question here — both keys should be included in all locale files, even if no current wheel uses `aluminum` rims.

2. **`HookBadge` in FilterPanel**: The FilterPanel uses `<HookBadge>` for displaying the triState filter options. The badge currently reads `t('badges.hookless')` and `t('badges.hooked')`. These keys remain unchanged — no modification to the badge or filter panel. Confirmed: FilterPanel badge keys are separate from the `hookless.true` / `hookless.false` value keys used in the comparator table.

3. **MeasuringTable.jsx**: This hidden twin table also calls `renderCellFor`. It must also receive `t` so column widths are measured on translated text, not raw values. Confirmed: MeasuringTable must be updated.
