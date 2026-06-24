# TASK-001 — Normalize `disc_standard` in ENVE dataset

## Objective

Replace every occurrence of the string `'Centerlock'` with `'Center Lock'` in `wheelsData_enve.js` so that all ENVE disc wheels share the normalized `disc_standard` value used by the rest of the dataset.

## Required context

- The file `frontend/src/data/wheelsData_enve.js` contains 6 wheel entries, all disc wheels, each with `disc_standard: 'Centerlock'` in their `other_specs` object.
- The correct normalized value used across all other brands is `'Center Lock'` (two words, capital C and capital L).
- This fix is a prerequisite for the `discStandard` filter (registered in TASK-005) to work correctly: selecting `'Center Lock'` must match ENVE wheels.

## Potentially impacted files

- `frontend/src/data/wheelsData_enve.js`

## Inputs

- Current value in all 6 ENVE entries: `disc_standard: 'Centerlock'`
- Target value: `disc_standard: 'Center Lock'`

## Expected outputs

- All 6 occurrences of `disc_standard: 'Centerlock'` in `wheelsData_enve.js` are changed to `disc_standard: 'Center Lock'`.
- No other field in the file is modified.

## Constraints

- Replace all 6 occurrences. The affected wheel entries are: SES 2.3 (id 44), SES 3.4 (id 45), SES 4.5 (id 46), SES 4.5 Pro (id 47), SES 6.7 (id 48), AR40 (id 49).
- Do not change any other string in the file.
- The string `'Centerlock'` (with no space) must not remain anywhere in the file after the change.

## Dependencies

none

## Validation criteria

- [ ] `'Centerlock'` does not appear anywhere in `wheelsData_enve.js`
- [ ] `disc_standard: 'Center Lock'` appears exactly 6 times in `wheelsData_enve.js`
- [ ] All other fields in all 6 ENVE wheel entries are unchanged

## Tests to implement

### Unit

None — the codebase does not have unit tests for data files.

### Integration

Manual: load the comparator, open the `discStandard` filter (once registered in TASK-005), confirm that `'Centerlock'` does not appear in the option list and that selecting `'Center Lock'` shows ENVE disc wheels.
