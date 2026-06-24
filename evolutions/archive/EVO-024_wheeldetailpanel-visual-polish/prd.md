# PRD — Product Requirements Document

## 1. General Information

- Evolution ID: EVO-024
- Title: WheelDetailPanel — Peek Carousel
- Author: Flavien Drouot
- Date: 2026-05-28
- Version: 1.0
- Needs Assessment reference: `MyBikeLab/evolutions/EVO-024_wheeldetailpanel-visual-polish/needs-assessment.md`

---

## 2. Functional Objective

Replace the static wheel image in `WheelDetailPanel` with a peek carousel that allows users to browse multiple product photos within the detail panel. The carousel must feel intentional and visually balanced even when only one image is available. The affiliate links column must be constrained to a maximum width to eliminate the wide gap created by the current `justify-between` layout.

---

## 3. Target Behavior

### General description

When a user opens a wheel detail panel, they see a horizontally scrollable peek carousel on the left side of the panel instead of the current static image. The active slide is centred in a fixed-width viewport, with partial views of the adjacent slides visible on each side, signalling that more images can be browsed.

Navigation controls (prev/next arrows overlaid on the carousel, dot indicators below) let the user move between slides. The active slide is fully opaque; non-active slides are dimmed. Transitions between slides are animated.

When only one image is available (the current data state for all wheels), the carousel renders a single centred slide without any navigation controls.

The affiliate links column, to the right of the carousel, is horizontally centred within its available space and constrained to a maximum width of 450 px, eliminating the visual gap caused by the previous layout.

---

## 4. Functional Rules

### FR-001 — Carousel replaces static image

The `WheelDetailPanel` must no longer display a single static `<img>` element for the wheel photo. In its place, a peek carousel component is rendered.

### FR-002 — Slide list derived from wheel data

The carousel builds its list of slides from the wheel data object:
- If the wheel object provides an `images` field (array of image URLs), the carousel uses that array as its slide list.
- If the `images` field is absent, the carousel derives a one-item slide list from the existing `image` field (single URL).

### FR-003 — Carousel viewport geometry

The carousel displays a fixed viewport of **360 px wide**. Each slide measures **220 × 220 px** (square, image rendered with `object-contain`). The gap between consecutive slides is **10 px**.

### FR-004 — Peek of adjacent slides

In the default position (active slide centred), approximately **70 px** of the adjacent slide is visible on each side of the viewport. The horizontal positioning follows the formula: `offset = 70 px` (initial shift), `step = 230 px` per slide index.

### FR-005 — Active and inactive slide opacity

The active slide is displayed at full opacity (opacity 1). All other slides are displayed at reduced opacity (opacity 0.45).

### FR-006 — Animated navigation transitions

Navigating between slides animates both the horizontal transform and the opacity simultaneously. The transition duration is **0.28 s** with an **ease** timing function.

### FR-007 — Navigation controls: arrows

Prev and Next arrow buttons are overlaid inside the carousel viewport. They are horizontally positioned within the boundaries of the centre slide: the prev arrow is placed **54 px from the left edge** of the viewport; the next arrow is placed **54 px from the right edge** of the viewport.

### FR-008 — Navigation controls: dot indicators

Dot indicators are rendered below the carousel viewport, one dot per slide. The dot corresponding to the active slide is visually highlighted (distinct from inactive dots).

### FR-009 — Controls hidden for single-image wheels

When the slide list contains exactly one item, neither the arrow buttons nor the dot indicators are rendered.

### FR-010 — Affiliate links column max-width

The affiliate links column is constrained to a **maximum width of 450 px** and is horizontally centred within the space remaining after the carousel. The content and behaviour of the affiliate links (URLs, price display, "Buy →" links) are unchanged.

---

## 5. Detailed Use Cases

### UC-001 — Browse images on a multi-image wheel

#### Preconditions
- The user has opened the wheel comparator.
- A wheel row with multiple images (`images: string[]` with at least two entries) is visible in the table.

#### Steps
1. The user clicks the wheel row to open its detail panel.
2. The panel opens. The carousel displays the first image centred in the viewport. Partial views of the second image are visible on the right side. The prev arrow is not active (or absent) on the first slide; the next arrow is visible.
3. The user clicks the Next arrow.
4. The carousel animates: the second image slides into the centre position (opacity 1); the first image moves left and dims (opacity 0.45). If a third image exists, a partial view appears on the right.
5. The user clicks the Prev arrow.
6. The carousel animates back to the first image centred.
7. The user observes the dot indicators below the viewport; the active dot changes to reflect the current slide index.

#### Expected result
- Each click on an arrow advances or retreats by exactly one slide.
- The active slide is always centred, fully opaque.
- Adjacent slides are partially visible and dimmed.
- The active dot indicator matches the current slide index.

#### Error cases
- An image URL fails to load: the `<img>` element displays its native broken-image state. No additional error handling is applied. Navigation continues to work normally.

---

### UC-002 — Open detail panel on a single-image wheel (current default)

#### Preconditions
- The user has opened the wheel comparator.
- The selected wheel has only an `image` field (no `images` array) — this is the current state for all wheels in the dataset.

#### Steps
1. The user clicks the wheel row to open its detail panel.
2. The panel opens. The carousel derives a one-item slide list from `image`.
3. The single slide is displayed centred in the 360 px viewport.

#### Expected result
- No prev/next arrows are rendered.
- No dot indicators are rendered.
- The single image is displayed centred and fully opaque.
- The affiliate links column is visible to the right, constrained to max 450 px.

#### Error cases
- Same as UC-001: broken image shows native fallback, no additional handling.

---

### UC-003 — View affiliate links alongside the carousel

#### Preconditions
- The detail panel is open (any wheel, any number of images).

#### Steps
1. The user observes the right portion of the detail panel.

#### Expected result
- The affiliate links column lists the manufacturer link and retailer links sorted by price, exactly as before.
- The column is horizontally centred within the space to the right of the carousel, with a maximum width of 450 px.
- No content or behaviour of the links themselves is changed.

#### Error cases
- None specific to this use case.

---

## 6. Acceptance Criteria

### AC-001
#### Description
The carousel viewport is exactly 360 px wide.
#### Expected verification
Inspect the rendered carousel container; its computed width is 360 px.
#### Type
- Manual

---

### AC-002
#### Description
Each slide renders at 220 × 220 px with `object-contain` image rendering.
#### Expected verification
Inspect a slide element; computed width and height are both 220 px; the image does not overflow or crop its subject.
#### Type
- Manual

---

### AC-003
#### Description
The gap between consecutive slides is 10 px.
#### Expected verification
Measure the distance between the right edge of one slide and the left edge of the next; it equals 10 px.
#### Type
- Manual

---

### AC-004
#### Description
In the default position (first slide active), approximately 70 px of the second slide is visible on the right side of the viewport.
#### Expected verification
With two or more slides, open the panel; visually confirm that roughly 70 px of the adjacent slide is visible on the right.
#### Type
- Manual

---

### AC-005
#### Description
The active slide has opacity 1; all other slides have opacity 0.45.
#### Expected verification
Inspect the active slide element: `opacity: 1`. Inspect any non-active slide: `opacity: 0.45`.
#### Type
- Manual

---

### AC-006
#### Description
Navigation transitions animate transform and opacity simultaneously over 0.28 s with ease timing.
#### Expected verification
Click the Next arrow; observe a smooth simultaneous slide-and-fade animation. Inspect the CSS transition: `transform 0.28s ease, opacity 0.28s ease`.
#### Type
- Manual

---

### AC-007
#### Description
The Prev arrow is positioned 54 px from the left edge of the viewport; the Next arrow is positioned 54 px from the right edge.
#### Expected verification
Inspect the computed `left` and `right` CSS values of the arrow buttons: `left: 54px` / `right: 54px`.
#### Type
- Manual

---

### AC-008
#### Description
Dot indicators appear below the viewport, with one dot per slide and the active dot visually distinct.
#### Expected verification
With a multi-image wheel, open the panel; count the dots (equals the number of images); the active dot has a different visual state than inactive dots. Navigate to slide 2; the second dot becomes active.
#### Type
- Manual

---

### AC-009
#### Description
No controls (arrows or dots) are rendered when the slide list contains exactly one item.
#### Expected verification
Open the detail panel for a wheel with a single image (or no `images` field); confirm that no arrow buttons and no dot indicators are present in the DOM.
#### Type
- Manual

---

### AC-010
#### Description
The carousel uses the `images` array when present; falls back to `[image]` when absent.
#### Expected verification
(a) A wheel with `images: ["url1", "url2"]` shows two slides. (b) A wheel without `images` but with `image: "url"` shows one slide sourced from `image`.
#### Type
- Manual

---

### AC-011
#### Description
The affiliate links column has a maximum width of 450 px and is horizontally centred in the space to the right of the carousel.
#### Expected verification
Inspect the links column container; `max-width` computes to 450 px; the column is visually centred in its available space.
#### Type
- Manual

---

### AC-012
#### Description
Existing affiliate links (manufacturer + retailer URLs, price display, "Buy →" text) are unchanged in content and behaviour.
#### Expected verification
Open the detail panel; verify that all links open the correct URLs, prices are displayed correctly, and the "Buy →" label is present — identical to the behaviour before this evolution.
#### Type
- Manual

---

## 7. Functional Impacts

### Impacted components
- `WheelDetailPanel` — sole component modified by this evolution. The static `<img>` is replaced by the peek carousel. The links column receives a max-width constraint.

### Impacted data
- Wheel data objects: the carousel reads `images: string[]` if present, or falls back to `image: string`. No data migration is required; no changes to `wheelsData.js` are in scope.

### Impacted APIs
- None.

### Impacted permissions / roles
- None.

---

## 8. Out of Scope

- Adding wheel technical specifications (weight, rim depth, etc.) to the detail panel.
- Changing the affiliate links layout or content beyond the max-width constraint.
- Sourcing or adding real multi-image data to `wheelsData.js`.
- Touch or swipe gesture support on the carousel.
- Any component outside `WheelDetailPanel`.

---

## 9. Constraints

- The existing affiliate links behaviour (URLs, price display, "Buy →" links) must not be broken.
- No new third-party carousel library may be introduced.
- The current wheel data model uses `image: string`; the carousel must remain fully functional in the absence of an `images` array.

---

## 10. Test Plan

### Automated tests expected
- None required for this evolution (pure visual/interactive component with no business logic beyond the data-fallback rule).

### Manual tests expected
- Open the detail panel for a single-image wheel: verify carousel renders one centred slide, no controls.
- Open the detail panel for a wheel with two images: verify peek layout, arrows, dots, and navigation.
- Navigate forward and backward: verify active slide centering, opacity transitions, and dot sync.
- Verify arrow button positions (54 px from each side of the viewport).
- Verify that all affiliate links continue to function correctly (URL, price, label).
- Verify that the links column does not exceed 450 px and is centred.

### Edge cases
- Wheel with zero images: not a valid state per the data model (`image` is always present). No handling required.
- Single image where the URL returns 404: native broken-image placeholder shown, no crash, navigation unaffected.
- Two-image wheel on a narrow panel: carousel geometry remains fixed at 360 px; overflow is clipped by the viewport.

### Non-regression
- All existing affiliate links must open the correct URLs after the evolution.
- No other section of the landing page (Hero, Roadmap, Benefits, Partnership, Footer) must be affected.
- The comparator table rows, filters, sorting, and column visibility features must remain fully functional.
