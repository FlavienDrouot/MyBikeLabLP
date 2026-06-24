# TASK-003: Display Model Family Association

## Objective

Make related variant entries visibly associated in the comparator UI without changing entry-level row behavior.

## Required context

The comparator renders model identity through the `model` property in `wheelProperties.jsx` and row markup in `ComparisonTable.jsx`. EVO-044 adds optional `model_group` and `model_group_label` metadata to link siblings.

## Potentially impacted files

- `frontend/src/config/wheelProperties.jsx`
- `frontend/src/components/MiniComparator/ComparisonTable.jsx`
- `frontend/src/components/MiniComparator/columnCells.jsx`
- `frontend/src/components/MiniComparator/WheelDetailPanel.jsx`
- `frontend/src/components/MiniComparator/__tests__/ComparisonTable.test.jsx`
- `frontend/src/components/MiniComparator/__tests__/columnCells.test.jsx`
- `frontend/src/components/MiniComparator/__tests__/WheelDetailPanel.test.jsx`
- `frontend/public/locales/en.json`
- `frontend/public/locales/fr.json`
- `frontend/public/locales/xx.json`

## Inputs

- `prd.md`
- `spec-notes.md`
- `shared-knowledge/ui-guidelines.md`
- `MyBikeLab/design-system/README.md`
- `MyBikeLab/design-system/IMPLEMENTATION-GUIDE.md`

## Expected outputs

- Grouped variant rows show a compact model-family marker or secondary label based on `model_group_label`.
- Single-entry wheelsets show no grouping marker.
- Detail panel shows model-family context for grouped variants where useful.
- Existing row click, expansion, column measurement, and sorting indicators continue to work.

## Constraints

- Keep each variant as its own clickable comparator row.
- Do not add group header rows as the minimum implementation.
- Do not make freehub options look like comparable variants.
- Use existing design-system tokens and Tailwind classes already present in the comparator surface.
- Use square table/panel treatment, hairline borders, restrained brass accent, and `ink-*`/`paper-*` token classes.
- Numeric values must keep mono or tabular styling where applicable.
- Avoid em-dash and en-dash in prose labels. Use a colon, parentheses, or a line break.
- Do not add decorative colored status dots, glows, gradients, emoji, or marketing copy.
- Motion, if any, must be limited to existing color/opacity transitions using project timing tokens.
- The marker text must fit inside the model column at desktop and mobile widths without layout overlap.

## Dependencies

TASK-002

## Validation criteria

- [ ] Rows with `model_group` visibly expose their shared `model_group_label` relationship.
- [ ] Rows without `model_group` do not show grouping UI.
- [ ] Grouping UI does not alter filter, sort, row expansion, or column selector behavior.
- [ ] The model column remains readable and does not overflow incoherently.
- [ ] Locale files include required labels for English, French, and pseudo-locale if new copy is introduced.

## Tests to implement

### Unit

- Add render tests for grouped and ungrouped model cells.
- Add detail panel test if model-family context is displayed there.

### Integration

- Update comparator table tests to cover grouped rows while preserving row expansion behavior.
