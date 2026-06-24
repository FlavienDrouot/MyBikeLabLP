# Needs Assessment

## 1. General Information

- Evolution ID: EVO-024
- Title: WheelDetailPanel — Peek Carousel
- Author: Flavien Drouot
- Date: 2026-05-28
- Status: Validated
- Priority: Medium

---

## 2. Context

### Current situation

`WheelDetailPanel` is a drawer that opens below a wheel row in the comparator table. It contains two zones:
- A static wheel image (140 × 140 px, `flex-shrink-0`)
- A scrollable column showing affiliate links (manufacturer + retailers sorted by price)

The affiliate links use `justify-between`, spreading the retailer name and the price/link to opposite ends of the container.

### Identified problem

The panel feels disproportionately large relative to the content it displays:
- The image zone occupies a fixed square that cannot grow
- With few links (one retailer, or none), the right column is mostly empty
- The `justify-between` creates a large visual gap between retailer names and prices when the panel is wide

### Business motivation

The wheel comparator is the main interactive feature of the landing page. The detail panel is the entry point to affiliate clicks — its visual quality directly influences trust and click-through. A panel that looks unfinished reduces credibility with both users and potential brand partners.

---

## 3. Business Objective

Replace the static wheel image with a peek carousel that:
- makes the panel feel rich and intentional even with few affiliate links
- creates a natural visual balance between the image zone and the links column
- prepares the data model for multi-image product sheets (Phase A — scraping roadmap)

---

## 4. Scope

### Included

- Replace the single `<img>` in `WheelDetailPanel` with a peek carousel (spec below)
- Constrain the affiliate links column to a max-width of 450 px, centered in the remaining space
- Graceful fallback: if the wheel object has no `images` array, derive the slide list as `[image]`

### Excluded

- Adding wheel specs (weight, rim depth, etc.) to the panel — this was Option A, not chosen
- Changing the affiliate links layout or content beyond the max-width constraint
- Sourcing or adding real multi-image data to `wheelsData.js` — this is a data concern, not UI
- Any change outside `WheelDetailPanel`

---

## 5. Constraints

### Business constraints

- Must not break the existing affiliate links behaviour (URLs, price display, "Buy →" links)

### Known technical constraints

- The wheel data model currently has `image: string` (single URL); the carousel must fall back to `[image]` when `images: string[]` is absent
- No new dependencies — the carousel must be implemented in plain React (no carousel library)

### Regulatory / security constraints

- None

---

## 6. Use Cases

### Nominal case

As a user browsing the wheel comparator,
I click a wheel row to open the detail panel,
so that I can see product photos and find the best purchase option.

With multiple images available, I use the prev/next arrows or dot indicators to browse slides.

### Alternative cases

- **Single image:** the wheel object has only `image` (no `images` array). The carousel renders with one slide; arrows and dots are hidden or disabled.
- **Two images:** carousel with two slides; peek shows one adjacent slide on each side.

### Known error cases

- Image URL returns 404 or fails to load — the `<img>` shows its native broken-image state; no special handling required at this stage.

---

## 7. Acceptance Criteria

### Carousel geometry

- [ ] The carousel viewport is **360 px wide**
- [ ] Each slide is **220 × 220 px** (square, `object-contain`)
- [ ] The gap between slides is **10 px**
- [ ] In the default position (active slide centred), approximately **70 px** of the adjacent slide is visible on each side
- [ ] The translateX formula is: `offset = 70px` (initial), `step = 230px` per slide index

### Visual behaviour

- [ ] The active slide has **opacity 1**; all other slides have **opacity 0.45**
- [ ] Navigating between slides animates `transform` and `opacity` simultaneously, **0.28 s ease**

### Controls

- [ ] Prev and Next arrow buttons are **overlaid inside the viewport**, horizontally positioned within the centre-slide boundaries (`left: 54 px` / `right: 54 px` from viewport edge)
- [ ] **Dot indicators** are rendered below the viewport, one dot per slide, with the active dot highlighted
- [ ] On a single-image wheel the controls (arrows + dots) are **not rendered**

### Affiliate links column

- [ ] The links column has a **max-width of 450 px** and is horizontally centred in the space remaining after the carousel

### Data fallback

- [ ] If the wheel object provides `images: string[]`, the carousel uses that array
- [ ] If `images` is absent, the carousel falls back to `[image]`

---

## 8. Open Questions

- None — spec fully validated during the prototype session.

---

## 9. Assumptions

- `images: string[]` is a future field; no data migration is required before implementation — the fallback covers all current wheels.
- The carousel does not need touch/swipe support for the MVP; keyboard or pointer interaction via the arrow buttons is sufficient.
- The panel height can grow beyond the current `max-h-[140px]` constraint on the links column to accommodate the 220 px slide height.
