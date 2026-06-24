# Implementation Notes — EVO-032

Date: 2026-06-02

---

## TASK-001 — Remove scalar `image` field from all brand data files

**Files changed:** 5 (4 brand files + `wheelsData.js` legacy block)

- `wheelsData_mavic.js` — removed `import wheelPlaceholderUrl` and `image:` field from all 21 wheel objects
- `wheelsData_roval.js` — removed `import wheelPlaceholderUrl` and `image:` field from all 9 wheel objects
- `wheelsData_zipp.js` — removed `import wheelPlaceholderUrl` and `image:` field from all 13 wheel objects
- `wheelsData_enve.js` — removed `import wheelPlaceholderUrl` and `image:` field from all 6 wheel objects
- `wheelsData.js` — removed `import wheelPlaceholderUrl` and `image:` field from 15 legacy objects in the `const _unused` array; `images:` array values referencing `wheelPlaceholderUrl` in `_unused` were kept intact (runtime values, not import references)

**Deviation:** `wheelsData.js` was not listed in the spec's "Potentially impacted files" but matched the grep scope check. Included per TASK-001 instruction to cover all matching files.

**Validation:** All static criteria passed. Grep for `\bimage\b:` across `src/data/` returns zero matches.

---

## TASK-002 — Fix `wheelProperties.jsx` image accessor and renderCell

**File changed:** `src/config/wheelProperties.jsx`

- Added `import wheelPlaceholderUrl from '../assets/wheel-placeholder.svg'`
- Updated `image` property `accessor`: `(w) => w.images?.[0] ?? wheelPlaceholderUrl`
- Updated `image` property `renderCell` `src`: `{w.images?.[0] ?? wheelPlaceholderUrl}`

**Deviation:** None.

**Validation:** All static/code-review criteria passed. Manual browser criteria (comparator thumbnail with real image; comparator thumbnail with placeholder) require browser verification — pending final validation.

---

## TASK-003 — Fix `WheelImageCarousel.jsx` slide-source fallback logic

**File changed:** `src/components/MiniComparator/WheelImageCarousel.jsx`

- Added `import wheelPlaceholderUrl from '../../assets/wheel-placeholder.svg'`
- Replaced `const slides = wheel.images ?? [wheel.image]` with `const slides = wheel.images?.length > 0 ? wheel.images : [wheelPlaceholderUrl]`

**Deviation:** None.

**Validation:** All static criteria passed. Manual browser criteria (empty `images[]` shows placeholder; multiple images show navigation; single image shows no controls; no console errors) require browser verification — pending final validation.
