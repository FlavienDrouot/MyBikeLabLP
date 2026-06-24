# Implementation Notes — EVO-024

## TASK-001 — Create WheelImageCarousel.jsx (static skeleton)

**Files created:** `frontend/src/components/MiniComparator/WheelImageCarousel.jsx`

- Slide list derivation (`wheel.images ?? [wheel.image]`) and all geometry constants applied as specified.
- `activeIndex` not introduced yet (TASK-001 scope) — `translateX(70px)` hardcoded as placeholder.
- `opacity: 1` set on slide wrapper as placeholder for TASK-002.
- `flexShrink: 0` placed on both the slide `<div>` and `<img>` — spec only called out `<img>` but the slide wrapper also needs it to prevent flex compression.
- No Tailwind for geometric styling; viewport and strip fully inline-styled.

---

## TASK-002 — Multi-slide layout, translateX, opacity dimming

**Files modified:** `frontend/src/components/MiniComparator/WheelImageCarousel.jsx`

- `activeIndex` state declared (defaults to 0); `setActiveIndex` in scope for TASK-003.
- `translateX` computed as `-(activeIndex * 230 - 70)` — at index 0 produces `translateX(70px)`, matching TASK-001's static value exactly.
- `prefersReducedMotion` evaluated once at module load (outside component) — avoids a `matchMedia` call on every render. Live-listening not required by spec.
- Strip carries `willChange: 'transform'`; slide wrappers do not.
- Fixed: `flexShrink: 0` removed from `<img>` style (images are not flex items here); correctly retained on slide wrapper `<div>`.
- No deviations from spec.

---

## TASK-004 — Wire carousel into WheelDetailPanel, max-width constraint

**Files modified:** `frontend/src/components/MiniComparator/WheelDetailPanel.jsx`

- `import WheelImageCarousel from './WheelImageCarousel'` added.
- Static `<img>` replaced by `<WheelImageCarousel wheel={wheel} />`.
- Destructuring updated to `{ affiliateLinks, brand }` — `image` and `model` only appeared in the removed `<img>` tag.
- Affiliate links column: outer `flex-1 flex items-start justify-center` + inner `w-full max-w-[450px] flex flex-col gap-2 overflow-y-auto py-0.5`. `max-h-[140px]` removed.
- Outer container changed from `items-center` to `items-start`.
- Affiliate links content (URLs, prices, labels) untouched.

---

## TASK-003 — Navigation controls (arrows + dots)

**Files modified:** `frontend/src/components/MiniComparator/WheelImageCarousel.jsx`

- `hasMultipleSlides` guard: both arrows and dots absent from the DOM entirely when `slides.length === 1`.
- Viewport container gained `position: relative` to serve as positioning context for absolute arrows.
- Arrows positioned at `left: 54px` / `right: 54px`, vertically centered via `top: 50%; transform: translateY(-50%)`, `z-index: 10`.
- Navigation is bounded (clamped): `Math.max(0, i - 1)` / `Math.min(slides.length - 1, i + 1)`.
- Disabled state: `disabled` attribute + `opacity: 0.4; cursor: not-allowed` at boundary index.
- Hover: Tailwind `hover:bg-paper-3` — acceptable per spec (no layout/transform hover effect requiring pointer-fine gate).
- Arrow characters: `‹` / `›` (Unicode single angle quotes), 20 px, in a 32×32 `rounded-full` button with `aria-label`.
- Dot indicators: 6 px → 18 px width pill-expansion, `opacity` 0.35 → 1, `width 0.2s ease` transition; `aria-label="Go to image N"`.
- Outer `<div>` wraps viewport + dot row to keep dots outside `overflow: hidden`. Note: if strict dot centering within 360 px viewport is ever required, add `width: 360px` to this wrapper. Spec did not specify it.
