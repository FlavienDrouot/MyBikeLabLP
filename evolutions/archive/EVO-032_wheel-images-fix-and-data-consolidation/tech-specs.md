# Technical Specifications

## 1. General Information

- Evolution ID: EVO-032
- PRD reference: `EVO-032_wheel-images-fix-and-data-consolidation/prd.md`
- Author: Flavien Drouot
- Date: 2026-06-02

---

## 2. Technical Context

### Technical objective

Fix two image-display bugs in the MyBikeLab comparator by:
1. Removing the legacy scalar `image` field from all four brand data files.
2. Updating `wheelProperties.jsx` to derive the comparator thumbnail from `images[0]` with a placeholder fallback.
3. Updating `WheelImageCarousel.jsx` to treat an empty `images[]` array as a trigger for the placeholder fallback (the current `??` check does not fire on `[]` because `[]` is truthy).

After this evolution, `images[]` is the sole image data source for all UI components.

### Affected architecture

- **Data layer** — four static JS brand files (`wheelsData_mavic.js`, `wheelsData_roval.js`, `wheelsData_zipp.js`, `wheelsData_enve.js`)
- **Property registry** — `src/config/wheelProperties.jsx` (central registry consumed by `ComparisonTable` and all other comparator components)
- **Carousel component** — `src/components/MiniComparator/WheelImageCarousel.jsx`

### Impacted modules

- `src/data/wheelsData_mavic.js`
- `src/data/wheelsData_roval.js`
- `src/data/wheelsData_zipp.js`
- `src/data/wheelsData_enve.js`
- `src/config/wheelProperties.jsx`
- `src/components/MiniComparator/WheelImageCarousel.jsx`

---

## 3. Technical Constraints

- `wheelPlaceholderUrl` is currently imported from `src/assets/wheel-placeholder.svg` only inside data files. After the scalar `image` field is removed, `wheelProperties.jsx` and `WheelImageCarousel.jsx` must each add this import directly.
- Only the `image` property entry in `wheelProperties.jsx` may be modified. No other property entries are touched.
- No URLs stored in any `images[]` array are modified.
- No `onError` fallback is added to image elements — broken remote URLs are out of scope.
- The application has no backend; all data is static local JS files — no API changes required.
- The carousel transition uses `transform` and `opacity` only — no change to animation properties in this evolution.

---

## 4. Architecture Decisions

### AD-001 — Remove `image` scalar field from data files before updating consumers

#### Description
TASK-001 (data cleanup) is defined as a prerequisite for TASK-002 (wheelProperties fix) and TASK-003 (carousel fix). The two consumer tasks can be executed in parallel once the data is clean.

#### Motivation
Both consumer tasks will reference `images[]` exclusively. Running them against data that still exposes the `image` field risks partial regression during review (a reviewer checking AC-005 mid-task would see a false failure). Cleaning the data first also makes each consumer task independently verifiable with the final data shape.

#### Rejected alternatives
- **All three tasks in parallel**: rejected because consumer tasks read data files to construct their test cases; having the scalar field still present during development could confuse the implementer about expected behaviour.
- **Single task for everything**: rejected because it would not be independently mergeable and testable per the spec process rules.

---

### AD-002 — `wheelProperties.jsx` imports `wheelPlaceholderUrl` directly from the SVG asset

#### Description
The `image` property entry in `wheelProperties.jsx` will import `wheelPlaceholderUrl` at the top of the file:
```js
import wheelPlaceholderUrl from '../assets/wheel-placeholder.svg';
```
The `accessor` becomes `(w) => w.images?.[0] ?? wheelPlaceholderUrl` and `renderCell` uses the same expression.

#### Motivation
The PRD (Section 9) and the needs assessment (Section 5) both mandate that `wheelProperties.jsx` imports the placeholder directly after the data-file `image` field is removed. The import path `../assets/wheel-placeholder.svg` is consistent with the pattern already used in the data files.

#### Rejected alternatives
- **Export `wheelPlaceholderUrl` from a data file and import from there**: rejected because data files are not the right layer to re-export UI assets. A direct asset import keeps the dependency graph clean.

---

### AD-003 — `WheelImageCarousel.jsx` uses `images.length > 0` to determine fallback

#### Description
Replace:
```js
const slides = wheel.images ?? [wheel.image];
```
with:
```js
import wheelPlaceholderUrl from '../../../assets/wheel-placeholder.svg';
// ...
const slides = wheel.images?.length > 0 ? wheel.images : [wheelPlaceholderUrl];
```

#### Motivation
The `??` (nullish coalescing) operator only triggers on `null` or `undefined`. An empty array `[]` is neither, so the fallback to `[wheel.image]` never executes when `images` is `[]`. Checking `.length > 0` correctly handles the empty-array case. Optional chaining (`?.`) guards against a missing `images` property.

#### Rejected alternatives
- `wheel.images?.length ? wheel.images : [wheelPlaceholderUrl]`: functionally identical (0 is falsy); accepted as equivalent. The explicit `> 0` form is preferred for readability and reviewer clarity.
- Re-using `wheel.image` in the fallback: rejected because the `image` scalar field is being removed from data files in this evolution; the carousel must not depend on it.

---

## 5. Task Breakdown

| Task | File | Summary | Dependencies |
|------|------|---------|--------------|
| TASK-001 | `TASK-001.md` | Remove scalar `image` field from all four brand data files | none |
| TASK-002 | `TASK-002.md` | Fix `wheelProperties.jsx` image accessor and renderCell to use `images[0]` with placeholder fallback | TASK-001 |
| TASK-003 | `TASK-003.md` | Fix `WheelImageCarousel.jsx` slide-source logic to fall back to placeholder when `images[]` is empty | TASK-001 |

---

## 6. Global Validation Strategy

### Unit validation
- Static grep check: no wheel object in any of the four brand data files contains an `image:` key after TASK-001.
- Code review of `wheelProperties.jsx` `image` entry: accessor and `renderCell` both read `w.images?.[0] ?? wheelPlaceholderUrl` after TASK-002.
- Code review of `WheelImageCarousel.jsx`: slide-computation expression correctly handles empty `images[]` after TASK-003.

### Integration validation
- `wheelPlaceholderUrl` import resolves correctly in both `wheelProperties.jsx` and `WheelImageCarousel.jsx` (Vite resolves `.svg` imports as URL strings by default).

### Functional validation
- Open the comparator. For a wheel known to have URLs in `images[]` (e.g. Mavic COSMIC SLR 45 DISC 23mm, id=3): verify the real image appears in the thumbnail column.
- Open the comparator. For a wheel with `images: []` (e.g. Mavic COSMIC ULTIMATE 45 DISC 23mm, id=1): verify the placeholder SVG appears in the thumbnail column.
- Open the detail panel for a wheel with `images: []`: verify the carousel renders exactly one slide (the placeholder).
- Open the detail panel for a wheel with multiple image URLs (e.g. Zipp 202 NSW, id=31, 4 URLs): verify `url1` is the first slide and navigation to subsequent slides works.
- Open the detail panel for a wheel with exactly one URL: verify the carousel renders one slide with no navigation controls.

### Non-regression validation
- All other wheel properties (weight, price, rim depth, etc.) continue to render correctly in the comparator after TASK-002.
- The detail panel opens and closes for all wheels without console errors after TASK-003.
- No console errors appear when rendering wheels with empty `images[]`.

---

## 7. Identified Risks

| Risk | Impact | Mitigation |
|---|---|---|
| `wheelPlaceholderUrl` import path differs between files due to different directory depths | Carousel or properties file shows broken image instead of placeholder | Verify relative path from each file: `wheelProperties.jsx` is in `src/config/` (path: `../assets/wheel-placeholder.svg`); `WheelImageCarousel.jsx` is in `src/components/MiniComparator/` (path: `../../../assets/wheel-placeholder.svg`). Confirm at review. |
| A fifth data file (beyond the four listed) also uses the `image` scalar field | Comparator still shows stale data for unlisted brand | TASK-001 instructs the implementer to grep all data files. If additional files are found, they must be included in scope and this spec updated. |
| CDN URLs in `images[]` are already broken (hotlink-blocked) | Real product images do not render even after the fix | Out of scope per PRD Section 8. No `onError` fallback is added. |

---

## 8. Rollback Plan

- TASK-001 (data files): revert via git — restore the `image` scalar field to each wheel object. The UI components will continue to use `w.image` if TASK-002 and TASK-003 are also reverted.
- TASK-002 (wheelProperties): revert the `image` property entry to `accessor: (w) => w.image` and `renderCell: (w) => <img src={w.image} ... />`. Remove the `wheelPlaceholderUrl` import if no other entry uses it.
- TASK-003 (WheelImageCarousel): revert the `slides` line to `const slides = wheel.images ?? [wheel.image]`. Remove the `wheelPlaceholderUrl` import.
- All three tasks can be reverted independently. Reverting only TASK-001 while keeping TASK-002 and TASK-003 is safe as long as the data files still expose `images[]`.
