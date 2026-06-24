# TASK-005 — Add divergent wheelset entry to `wheelsData_zipp.js` and run smoke tests

## Objective

1. Add at least one new wheelset entry to `wheelsData_zipp.js` that uses the divergent pair form for rim depth and weight, demonstrating the full EVO-038 data format.
2. Run the full test suite to confirm no regressions on existing scalar entries (AC-006).
3. Call `validateWheelsCatalog` on the full catalog and confirm zero warnings.

## Required context

### Divergent data format (from TASK-001)

The pair form for eligible specs is:
```js
rim: {
  depth_mm: { front: 50, rear: 60 },         // divergent dimensional spec
  externalWidth_mm: 28,                        // scalar (same front/rear)
  internalWidth_mm: 23,
  // ...
},
weight_grams: { front: 720, rear: 850 },       // divergent weight spec
```

Both `front` and `rear` keys are required when the pair form is used. If only one is known, use the scalar form instead.

### Entry to add

Add a new Zipp entry representing a realistic aero combo wheelset with different front and rear rim depths. Use the following as a template — adjust the id to the next available integer after the last existing Zipp entry (currently id 43 is the last):

```js
{
  id: 44,  // verify and use the correct next id
  model: '404/808 Firecrest Combo',
  brand: 'Zipp',
  weight_grams: { front: 740, rear: 895 },  // pair form — total 1635 g
  diameter_mm: 700,
  brake_type: 'disc',
  wheelset_category: 'aero',
  max_system_weight_kg: 115,
  rim: {
    material: 'carbon',
    hookless: true,
    depth_mm: { front: 58, rear: 80 },      // pair form — 404 front, 808 rear
    externalWidth_mm: 27,                    // scalar — same both wheels
    tubeless_ready: true,
    internalWidth_mm: 23,                    // scalar — same both wheels
  },
  spokes: { model: null, brand: null, material: null },
  hub: {
    model: 'ZR1',
    brand: 'Zipp',
    axle_front_mm: '12x100',
    axle_rear_mm: '12x142',
    freehub_options: ['SRAM XDR', 'Shimano HG'],
    disc_standard: 'Center Lock',
  },
  prices: [{ price_eur: 2150, url: 'https://www.sram.com/en/zipp' }],
  images: [],
  affiliateLinks: {
    manufacturer: { url: 'https://www.sram.com/en/zipp', price_eur: 2150 },
    retailers: [],
  },
  other_specs: {
    weight_note: 'front: 404 Firecrest; rear: 808 Firecrest — lightest configuration',
    bearing_type: 'Cartridge Steel',
    points_of_engagement: 66,
    max_tire_pressure_psi: 73,
    tire_type: 'tubeless',
    warranty: 'Lifetime',
  },
},
```

**Important**: the `weight_grams` pair form here is the canonical EVO-038 format. Do NOT also add `other_specs.weight_front_g / weight_rear_g` — those legacy annotation fields are for existing entries only and should not be added to new entries going forward. Add a comment above the new entry explaining this:
```js
// EVO-038: first entry using the canonical divergent pair form for depth and weight.
// Use weight_grams: { front, rear } — do NOT duplicate into other_specs.weight_front_g/rear.
```

### Existing `other_specs.weight_front_g / weight_rear_g` entries

Several existing Zipp entries (ids 33, 34, 41, 42) have `other_specs.weight_front_g` and `other_specs.weight_rear_g`. These are informational annotations, NOT the new canonical pair format. Do not modify these entries. `wheelValidator.js` explicitly does not flag these fields as errors.

### Smoke tests to run after adding the entry

1. Run all existing unit tests: `npm test` (or the equivalent test runner command in this project). Zero regressions expected.
2. Call `validateWheelsCatalog(wheelsData)` in a test or script and assert the warnings array is empty for the new entry.
3. If there is a dev server, start it and visually verify:
   - The new entry appears in the comparator.
   - The depth column shows `58 / 80 mm`.
   - The weight column shows `1635 g` with sub-line `740 / 850 g`.
   - Applying a depth range filter of 75–85 mm includes the new entry (rear 80 mm is in range).
   - Applying a depth range filter of 60–70 mm excludes the new entry (neither 58 nor 80 is in range).

## Potentially impacted files

- `frontend/src/data/wheelsData_zipp.js` — add new entry
- Test files run as part of the standard suite

## Inputs

- `wheelValidator.js` from TASK-001.
- `wheelsData_zipp.js` current source (read before editing to determine the correct next id).
- All previous tasks must be complete.

## Expected outputs

- One new entry added to `wheelsData_zipp.js`.
- Full test suite passes with zero failures.
- Zero validation warnings for the new entry.

## Constraints

- The new entry id must not collide with any existing id in any `wheelsData_*.js` file. Verify by checking the highest id across all brand files before writing.
- Use realistic values (the Zipp 404/808 combo is a real product category).
- Do not modify any existing entry in any data file.
- Do not add `other_specs.weight_front_g / weight_rear_g` to the new entry.

## Dependencies

TASK-001, TASK-002, TASK-003, TASK-004

## Validation criteria

- [ ] The new entry has `rim.depth_mm: { front: 58, rear: 80 }`.
- [ ] The new entry has `weight_grams: { front: 740, rear: 895 }`.
- [ ] The new entry id does not collide with any existing entry.
- [ ] `validateWheelsCatalog(wheelsData)` returns zero warnings.
- [ ] All existing unit tests pass (zero regressions).
- [ ] The comparator depth cell for the new entry displays `58 / 80 mm`.
- [ ] The comparator weight cell for the new entry displays `1635 g` with sub-line `740 / 895 g`.
- [ ] Depth filter 75–85 mm includes the new entry.
- [ ] Depth filter 60–70 mm excludes the new entry.
- [ ] Sort by depth descending: the new entry is ranked by its rear value (80 mm), placing it between 808 Firecrest (80 mm) and 353 NSW (45 mm).

## Tests to implement

### Unit

No new unit tests required in this task beyond running the existing suite. The validation smoke test below covers the new entry:

```js
// In a test file or inline script:
import { wheelsData } from '../data/wheelsData';
import { validateWheelsCatalog } from '../data/wheelValidator';

test('full catalog has no validation warnings', () => {
  const warnings = validateWheelsCatalog(wheelsData);
  expect(warnings).toHaveLength(0);
});
```

If warnings are present for existing entries (from pre-existing data issues unrelated to EVO-038), they must be documented separately — they do not block this task, but must not be silently ignored.

### Integration

- Run `selectFilteredWheels` with depth filter 75–85 mm on the full catalog: assert the new entry (id 44) is in the result.
- Run `selectFilteredWheels` with depth filter 60–70 mm on the full catalog: assert the new entry is NOT in the result.
- Run `selectFilteredWheels` sorted by depth descending: assert the new entry appears below entries with depth_mm ≥ 80 and above entries with depth_mm ≤ 58.
