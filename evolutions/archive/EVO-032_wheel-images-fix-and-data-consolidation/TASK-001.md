# TASK-001 — Remove scalar `image` field from all brand data files

## Objective

Delete the `image` key from every wheel object in all four brand data files. After this task, no wheel record exposes a scalar `image` field. The `images[]` array becomes the sole image field in the data layer.

## Required context

### Data file structure

Each brand data file exports an array of wheel objects. Every object currently contains two image-related fields:

```js
image: wheelPlaceholderUrl,   // scalar — being removed
images: [],                   // array — stays, becomes sole source
```

or, for wheels that already have real URLs:

```js
image: 'https://cdn.example.com/wheel.png',  // scalar — being removed
images: ['https://cdn.example.com/wheel.png', ...],  // array — stays
```

**In all cases, remove only the `image:` line. Do not modify any `images:` value.**

### The `wheelPlaceholderUrl` import

Each data file begins with:
```js
import wheelPlaceholderUrl from '../assets/wheel-placeholder.svg';
```

After removing the `image` field from every wheel object, this import will be unused in the data files. **Remove the import line** from each data file to keep the files clean.

### Wheels with `image: wheelPlaceholderUrl` and `images: []`

For these wheels (no real image exists), simply removing `image:` leaves `images: []`, which is the correct final state. The UI components handle empty arrays via their own fallback logic (implemented in TASK-002 and TASK-003).

### Wheels with real URLs

For these wheels (e.g. most Mavic, most Zipp, all ENVE), both fields held the same URL(s). Removing `image:` has no semantic effect — the real URL remains in `images[]`.

### Notable exception — Roval Rapide C 38 (id=27)

This is the wheel that exposed the original bug: `image: wheelPlaceholderUrl` but `images: [url1, url2, url3]`. Removing `image:` is correct — the three real URLs in `images[]` are untouched.

## Potentially impacted files

- `MyBikeLab/frontend/src/data/wheelsData_mavic.js`
- `MyBikeLab/frontend/src/data/wheelsData_roval.js`
- `MyBikeLab/frontend/src/data/wheelsData_zipp.js`
- `MyBikeLab/frontend/src/data/wheelsData_enve.js`

## Inputs

- Current content of all four brand data files (read before editing).
- Grep check: confirm the scope. Run a search for `image:` across `src/data/` to verify that only these four files are affected. If additional data files are found that also use an `image` scalar field, include them in this task and flag the finding.

## Expected outputs

- All four brand data files edited: every `image:` key-value line removed from every wheel object.
- The `import wheelPlaceholderUrl from '../assets/wheel-placeholder.svg';` line removed from each of the four files (it is no longer referenced in those files after the `image` field is removed).
- No change to any `images:` array value in any file.
- No change to any other wheel property.

## Constraints

- Do not modify the `images` field in any wheel object (values, array length, or presence).
- Do not change any property other than `image` in any wheel object.
- Do not touch `wheelProperties.jsx`, `WheelImageCarousel.jsx`, or any file outside `src/data/`.
- After the edits, each data file must parse as valid JavaScript (no trailing commas creating syntax errors, no missing commas from line removal).

## Dependencies

none

## Validation criteria

- [ ] `wheelsData_mavic.js` contains no line matching `image:` (other than inside `images:`)
- [ ] `wheelsData_roval.js` contains no line matching `image:` (other than inside `images:`)
- [ ] `wheelsData_zipp.js` contains no line matching `image:` (other than inside `images:`)
- [ ] `wheelsData_enve.js` contains no line matching `image:` (other than inside `images:`)
- [ ] The `import wheelPlaceholderUrl` line is removed from all four files
- [ ] No `images:` array value has been altered in any file
- [ ] All four files parse without JavaScript syntax errors
- [ ] Grep for `\bimage\b` (word boundary) across `src/data/` returns zero matches on the scalar key (matches on `images` are expected and fine)

## Tests to implement

### Unit

- Static grep / lint check: `grep -n '\bimage\b:' src/data/wheelsData_mavic.js src/data/wheelsData_roval.js src/data/wheelsData_zipp.js src/data/wheelsData_enve.js` must return zero results.

### Integration

- None at this task level. Integration is validated by TASK-002 and TASK-003 consuming the updated files.
