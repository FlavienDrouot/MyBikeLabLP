# PRD — Product Requirements Document

## 1. General Information

- Evolution ID: EVO-032
- Title: Wheel images — display fix and data consolidation
- Author: Flavien Drouot
- Date: 2026-06-02
- Version: 1.0
- Needs Assessment reference: `EVO-032_wheel-images-fix-and-data-consolidation/needs-assessment.md`

---

## 2. Functional Objective

After this evolution, wheel images must display correctly in both the comparator thumbnail column and the detail panel carousel. Any wheel that has at least one real image URL must show that image in both locations. Any wheel without a real image URL must show the placeholder SVG in both locations. A single `images[]` array per wheel becomes the sole image data source; the legacy scalar `image` field is removed from all brand data files.

---

## 3. Target Behavior

### General description

The comparator image column reads the first element of the wheel's `images[]` array. If the array is empty, the placeholder SVG is displayed instead. The detail panel carousel reads the full `images[]` array and renders each URL as a slide. If the array is empty, the carousel renders a single slide showing the placeholder SVG. No wheel data file exposes a scalar `image` field — it has been removed. All image access in the UI layer goes through `images[]`.

---

## 4. Functional Rules

### FR-001 — Single image source of truth

The `images[]` array is the sole image field for every wheel. No wheel record exposes a scalar `image` field. All UI components that display wheel images must read from `images[]` exclusively.

### FR-002 — Comparator thumbnail: real image when available

When a wheel has at least one URL in `images[]`, the comparator image column displays the image at `images[0]`.

### FR-003 — Comparator thumbnail: placeholder when no image

When a wheel's `images[]` array is empty, the comparator image column displays the placeholder SVG (`wheelPlaceholderUrl`).

### FR-004 — Detail panel carousel: real images when available

When a wheel has at least one URL in `images[]`, the detail panel carousel renders one slide per URL, starting with `images[0]`. Multi-image navigation remains functional.

### FR-005 — Detail panel carousel: placeholder when no image

When a wheel's `images[]` array is empty, the detail panel carousel renders exactly one slide containing the placeholder SVG. The carousel does not render as empty.

### FR-006 — Placeholder always visible

The placeholder SVG is always shown when `images[]` is empty, ensuring that the comparator image column and the detail panel carousel never render a blank space.

### FR-007 — No scope change to images[] values

The URLs stored inside `images[]` arrays in the data files are not modified by this evolution. Only the scalar `image` field is removed.

---

## 5. Detailed Use Cases

### UC-001 — User views the comparator; wheel has a real image

#### Preconditions
- The comparator is loaded and displaying the wheel list.
- The wheel record has `images: ['https://example.com/wheel.jpg']` (one or more URLs).

#### Steps
1. User opens the comparator page.
2. The wheel list renders with an image column.
3. For this wheel, the UI reads `images[0]`.

#### Expected result
- The comparator image column shows the real product photo at `images[0]`.

#### Error cases
- None within this scope. If the URL is unreachable at the network level, the browser shows a broken image icon — this is a data quality issue, out of scope.

---

### UC-002 — User views the comparator; wheel has no image

#### Preconditions
- The comparator is loaded and displaying the wheel list.
- The wheel record has `images: []`.

#### Steps
1. User opens the comparator page.
2. The wheel list renders with an image column.
3. For this wheel, the UI reads `images[0]`, which is `undefined`.

#### Expected result
- The comparator image column shows the placeholder SVG.

#### Error cases
- None.

---

### UC-003 — User opens the detail panel; wheel has a real image

#### Preconditions
- The comparator is loaded.
- The wheel record has `images: ['https://example.com/wheel.jpg']` (one or more URLs).

#### Steps
1. User clicks a wheel to open its detail panel.
2. The detail panel loads `WheelImageCarousel` with the wheel's `images[]` array.

#### Expected result
- The carousel renders the image at `images[0]` as the first (or only) slide.
- If `images[]` contains more than one URL, carousel navigation controls are available.

#### Error cases
- None within scope.

---

### UC-004 — User opens the detail panel; wheel has no image

#### Preconditions
- The comparator is loaded.
- The wheel record has `images: []`.

#### Steps
1. User clicks a wheel to open its detail panel.
2. The detail panel loads `WheelImageCarousel` with an empty `images[]` array.

#### Expected result
- The carousel renders exactly one slide showing the placeholder SVG.
- No empty carousel is displayed.

#### Error cases
- None.

---

### UC-005 — User views the comparator; wheel has multiple images

#### Preconditions
- The wheel record has `images: [url1, url2, url3]`.

#### Steps
1. User views the comparator.
2. User opens the wheel detail panel.

#### Expected result
- The comparator image column shows `url1`.
- The carousel shows `url1` as the first slide and provides navigation to `url2` and `url3`.

#### Error cases
- None within scope.

---

## 6. Acceptance Criteria

### AC-001
#### Description
A wheel with `images: ['https://...']` displays that image in the comparator thumbnail column.
#### Expected verification
Render the comparator with a wheel whose `images[]` contains one URL. Verify the image column renders that URL, not the placeholder.
#### Type
- Manual

---

### AC-002
#### Description
A wheel with `images: []` displays the placeholder SVG in the comparator thumbnail column.
#### Expected verification
Render the comparator with a wheel whose `images[]` is empty. Verify the image column renders the placeholder SVG.
#### Type
- Manual

---

### AC-003
#### Description
A wheel with `images: []` displays the placeholder SVG in the detail panel carousel — the carousel is never empty.
#### Expected verification
Open the detail panel for a wheel with `images: []`. Verify the carousel renders one slide containing the placeholder SVG.
#### Type
- Manual

---

### AC-004
#### Description
A wheel with `images: [url1, url2, url3]` displays `url1` as the first slide in the carousel.
#### Expected verification
Open the detail panel for a wheel with three image URLs. Verify `url1` is the first slide and carousel navigation exposes `url2` and `url3`.
#### Type
- Manual

---

### AC-005
#### Description
No wheel data file contains a scalar `image` field.
#### Expected verification
Inspect `wheelsData_mavic.js`, `wheelsData_roval.js`, `wheelsData_zipp.js`, and `wheelsData_enve.js`. Confirm no wheel object contains an `image` key.
#### Type
- Automated (static analysis / grep)

---

### AC-006
#### Description
The `image` property accessor in `wheelProperties.jsx` reads `w.images?.[0] ?? wheelPlaceholderUrl`.
#### Expected verification
Read the `image` property entry in `wheelProperties.jsx`. Confirm the accessor expression is `w.images?.[0] ?? wheelPlaceholderUrl` (or functionally equivalent).
#### Type
- Manual (code review)

---

### AC-007
#### Description
`WheelImageCarousel.jsx` uses `wheel.images` and falls back to `[wheelPlaceholderUrl]` when the array is empty or absent.
#### Expected verification
Read the slide-computation logic in `WheelImageCarousel.jsx`. Confirm it handles the empty-array case and falls back to `[wheelPlaceholderUrl]`.
#### Type
- Manual (code review)

---

## 7. Functional Impacts

### Impacted components
- `WheelImageCarousel.jsx` — slide-source logic updated to handle empty `images[]`
- `wheelProperties.jsx` — `image` property accessor updated to read `images[0]` with placeholder fallback

### Impacted data
- `wheelsData_mavic.js` — scalar `image` field removed from all wheel objects
- `wheelsData_roval.js` — scalar `image` field removed from all wheel objects
- `wheelsData_zipp.js` — scalar `image` field removed from all wheel objects
- `wheelsData_enve.js` — scalar `image` field removed from all wheel objects

### Impacted APIs
- None. The application has no backend API; all data is local JS files.

### Impacted permissions / roles
- None.

---

## 8. Out of Scope

- CDN hotlinking or CORS issues: unreachable image URLs are a data quality problem; no `onError` fallback is added.
- Sourcing or scraping new image URLs.
- Changes to the WheelDetailPanel layout or carousel visual design.
- Changes to any wheel property in `wheelProperties.jsx` other than the `image` accessor.
- Any data file other than the four brand files listed above.

---

## 9. Constraints

- `wheelPlaceholderUrl` must remain the fallback for wheels with no images; the comparator must always show something in the image column.
- After the scalar `image` field is removed from data files, `wheelProperties.jsx` and `WheelImageCarousel.jsx` must import `wheelPlaceholderUrl` directly from the SVG asset (`src/assets/wheel-placeholder.svg`).
- Only the `image` property entry in `wheelProperties.jsx` is updated; no other property entries are modified.

---

## 10. Test Plan

### Automated tests expected
- Static check (grep / lint rule): confirm no wheel object in any brand data file contains an `image` key.

### Manual tests expected
- Open the comparator. For a wheel known to have URLs in `images[]`: verify the real image appears in the thumbnail column.
- Open the comparator. For a wheel with `images: []`: verify the placeholder SVG appears in the thumbnail column.
- Open the detail panel for a wheel with `images: []`: verify the carousel shows exactly one slide (the placeholder), not an empty carousel.
- Open the detail panel for a wheel with multiple image URLs: verify the first slide matches `images[0]` and navigation works.

### Edge cases
- Wheel with exactly one URL in `images[]`: both comparator and carousel display that single URL correctly; no navigation controls appear in the carousel (or they are non-functional, depending on carousel behavior — not changed by this evolution).
- All wheels in a brand file have `images: []`: every thumbnail in that brand's rows shows the placeholder; no broken renders.

### Non-regression
- All currently working wheel properties (weight, price, rim depth, etc.) continue to display correctly in the comparator after changes to `wheelProperties.jsx`.
- The detail panel continues to open and close correctly for all wheels after changes to `WheelImageCarousel.jsx`.
- No console errors appear when rendering wheels with empty `images[]`.
