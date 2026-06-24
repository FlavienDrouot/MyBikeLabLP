# Needs Assessment

## 1. General Information

- Evolution ID: EVO-032
- Title: Wheel images — display fix and data consolidation
- Author: Flavien Drouot
- Date: 2026-06-02
- Status: Draft
- Priority: High

---

## 2. Context

### Current situation

Wheel data files (`wheelsData_mavic.js`, `wheelsData_roval.js`, `wheelsData_zipp.js`, `wheelsData_enve.js`) contain two coexisting image fields per wheel:
- `image` (string): a single URL — either a real CDN URL or the imported `wheelPlaceholderUrl`
- `images` (array): a list of URLs — either empty `[]` or containing one or more real CDN URLs

These fields are redundant and not synchronized. For example, Roval Rapide C38 has real URLs only in `images[]` while `image` still holds the placeholder.

In `wheelProperties.jsx`, the `image` property accessor reads `w.image` (the scalar field). In `WheelImageCarousel.jsx`, slides are computed as `wheel.images ?? [wheel.image]` — which fails silently when `images` is an empty array (falsy fallback `??` does not trigger on `[]`).

### Identified problem

Two bugs:

1. **Detail panel — both KO**: `WheelImageCarousel` receives `wheel.images = []` for most wheels. Because `[]` is not nullish, the `??` fallback to `[wheel.image]` never triggers. `slides` is empty → no image renders, not even the placeholder.

2. **Comparator — real image KO**: The `wheelProperties.jsx` `renderCell` uses `w.image`. For wheels where real URLs are stored only in `images[]` (not in `image`), the comparator shows the placeholder regardless.

### Business motivation

Image display is a core quality signal of the comparator: it differentiates the product visually and builds trust with users. Broken or missing images degrade credibility, especially during outreach to brands and retailers. Fixing this is a prerequisite for Phase A of the data acquisition strategy.

---

## 3. Business Objective

- Wheels with at least one real image URL display that image in both the comparator thumbnail column and the detail panel carousel.
- Wheels without any real image URL display the placeholder in both locations.
- The data structure is unified: a single `images[]` array is the source of truth; the redundant `image` scalar field is removed from all data files.

---

## 4. Scope

### Included

- Fix `WheelImageCarousel.jsx`: correct the fallback logic so that an empty `images[]` falls back to the placeholder
- Fix `wheelProperties.jsx` `image` property: update accessor and `renderCell` to read `images[0]` with fallback to `wheelPlaceholderUrl`
- Remove the `image` scalar field from all four brand data files (`wheelsData_mavic.js`, `wheelsData_roval.js`, `wheelsData_zipp.js`, `wheelsData_enve.js`)
- No change to the `images[]` array values in the data (URLs remain as-is)

### Excluded

- CDN hotlinking or CORS issues: if an image URL is inaccessible at the network level, that is a data quality problem — no `onError` fallback is added
- Scraping or sourcing new image URLs
- Changes to the WheelDetailPanel layout or carousel visual design
- Changes to any other wheel property in `wheelProperties.jsx`

---

## 5. Constraints

### Business constraints
- The `wheelPlaceholderUrl` SVG asset must remain the fallback for wheels with no images, ensuring the comparator always shows something in the image column.

### Known technical constraints
- `wheelPlaceholderUrl` is currently imported only in data files; after consolidation, `wheelProperties.jsx` and `WheelImageCarousel.jsx` must import it directly from `src/assets/wheel-placeholder.svg`.
- `wheelProperties.jsx` is the central registry: only the `image` property entry needs updating — no downstream files should require changes.

### Regulatory / security constraints
- None.

---

## 6. Use Cases

### Nominal case
As a user viewing the comparator,
I want to see a real product image in the image column for wheels that have one,
So that I can visually identify and compare wheels.

### Alternative cases
- Wheel has no image URL (`images: []`): the placeholder SVG is displayed in both the comparator column and the detail panel carousel.
- Wheel has multiple image URLs (`images: [url1, url2, url3]`): the comparator shows `images[0]`; the carousel shows all images with navigation.

### Known error cases
- Image URL is unreachable (CDN blocks hotlinking, URL has changed): the browser renders a broken image icon. This is treated as a data quality issue, out of scope for this evolution.

---

## 7. Acceptance Criteria

- [ ] A wheel with `images: ['https://...']` displays that image in the comparator thumbnail column
- [ ] A wheel with `images: []` displays the placeholder SVG in the comparator thumbnail column
- [ ] A wheel with `images: []` displays the placeholder SVG in the detail panel carousel (no empty carousel)
- [ ] A wheel with `images: [url1, url2, url3]` displays `url1` as the first slide in the carousel
- [ ] No wheel data file contains an `image` scalar field
- [ ] `wheelProperties.jsx` accessor for the `image` property reads `w.images?.[0] ?? wheelPlaceholderUrl`
- [ ] `WheelImageCarousel.jsx` uses `wheel.images` and falls back to `[wheelPlaceholderUrl]` when the array is empty

---

## 8. Open Questions

- None.

---

## 9. Assumptions

- All four brand data files (`mavic`, `roval`, `zipp`, `enve`) follow the same `image` / `images` structure; no other data file introduces additional image fields.
- The `wheelPlaceholderUrl` SVG is stable and will not be moved or renamed.
