# TASK-006: i18n — grouping UI strings + locale vocabulary keys

## Objective

Add the localized strings the grouping UI needs (group toggle labels, sibling count, sort
option labels for the two new axis sorts) and ensure the closed axis vocabulary resolves to
Title Case labels in every locale, with no duplicate or missing keys.

## Required context

- Locales live in `frontend/public/locales/{en,fr,xx}.json`. `xx` is a pseudo-locale where
  every value is `"XX"`, used by `wheelProperties.i18n.test.js` to prove key coverage.
- Translatable axis values resolve via `t(`${propertyId}.${value}`)`:
  - `spokeMaterial.*`: currently `stainless_steel`, `aluminum`, `carbon`, `carbon_composite`,
    `steel` (en: "Stainless steel"/"Aluminum"/"Carbon"/"Carbon composite"/"Steel";
    fr: "Acier inox"/"Aluminium"/"Carbone"/"Composite carbone"/"Acier").
  - `brakeType.*`: `disc`/`rim`/`track` (en: "Disc"/"Rim"/"Track"; fr:
    "Disque"/"Patins"/"Piste").
- Sort labels are i18n keys; TASK-003 references `sorts.spokeMaterial` and `sorts.brakeType`.
- New UI strings needed for the group rows (TASK-005): an expand label, a collapse label, and
  a sibling-count string (e.g. `"{{count}} configurations"`, with singular form).
- Title Case is satisfied by these label values (AD-003); no data values change here.

## Potentially impacted files

- `frontend/public/locales/en.json`
- `frontend/public/locales/fr.json`
- `frontend/public/locales/xx.json`
- `frontend/src/config/__tests__/wheelProperties.i18n.test.js` (extend coverage if needed)

## Inputs

- The string keys consumed by TASK-003 (sort labels) and TASK-005 (group UI).
- The canonical axis vocabulary from TASK-001.

## Expected outputs

- `sorts.spokeMaterial` and `sorts.brakeType` present in en/fr/xx.
- Group UI keys present in en/fr/xx, e.g. `table.groupExpand`, `table.groupCollapse`,
  `table.groupConfigurations` (with count interpolation + singular/plural).
- Every spoke-material and brake-type value used in the migrated dataset resolves to a
  non-empty, non-raw-key, Title Case label in en and fr, and to `"XX"` in xx.
- No duplicate filter options arise from divergent keys (one physical option = one key).

## Constraints

- Keep the existing i18n mechanism; do not store Title Case strings in data.
- Em-dash banned in editorial strings; group count is non-prose UI (count display) and is
  exempt.
- Do not resolve the `steel`/`stainless_steel` open question by editing data here; only
  provide labels for the keys that exist. If the user confirms a merge, the obsolete key's
  label may be removed in that follow-up.

## Dependencies

TASK-001, TASK-005

## Validation criteria

- [ ] `sorts.spokeMaterial`, `sorts.brakeType` and the group UI keys exist in en/fr/xx.
- [ ] `wheelProperties.i18n.test.js` green: all axis values resolve in en/fr/xx with no raw
      `<id>.<value>` leak.
- [ ] FilterPanel sort dropdown shows localized labels for the two new sorts.
- [ ] Group rows show localized expand/collapse labels and a localized count.
- [ ] Full Vitest suite green.

## Tests to implement

### Unit
- Extend the i18n coverage test (or add one) asserting the new sort and group keys resolve in
  all three locales and that no axis value leaks a raw key.

### Integration
- Render a group row under en and fr; assert the count and toggle labels are localized.
