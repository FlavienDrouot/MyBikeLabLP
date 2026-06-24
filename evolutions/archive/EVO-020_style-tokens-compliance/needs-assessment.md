# Needs Assessment

## 1. General Information

- Evolution ID: EVO-020
- Title: Style tokens — UI guidelines compliance
- Author: Flavien Drouot
- Date: 2026-05-27
- Status: Draft
- Priority: Medium

---

## 2. Context

### Current situation

Four CSS and token-level issues on the landing page deviate from the UI guidelines:

- `Landing.jsx` uses `min-h-screen` (maps to `100vh`), which does not account for the dynamic viewport height on iOS Safari — the address bar causes a layout jump.
- The multiselect option list in `FilterPanel.jsx` uses `rounded-lg`, breaking the design system's radius convention (panels and lists must be `rounded-none`).
- Disabled filter controls in `FilterPanel.jsx` use Tailwind's `opacity-50` class. The design system and UI guidelines specify `opacity: 0.4` for disabled state.
- No `prefers-reduced-motion` rule exists anywhere in the codebase. Animations and transitions run at full intensity regardless of the operating system accessibility setting.

### Identified problem

1. **`min-h-screen` on the page wrapper** — `100vh` ignores the iOS Safari dynamic viewport unit; `100dvh` corrects this.
2. **`rounded-lg` on filter option list** — Breaks the flat, square aesthetic of the design system; must be `rounded-none`.
3. **`opacity-50` for disabled state** — Tailwind lacks an `opacity-40` class out of the box; one must be added to the config, then applied to the four affected locations in `FilterPanel.jsx`.
4. **No `prefers-reduced-motion` handling** — Violates the accessibility rule; a single global CSS rule in `index.css` is sufficient to cover all current and future animations.

### Business motivation

The iOS viewport bug affects every mobile visitor. The radius and opacity deviations are visible inconsistencies. The missing motion preference rule is an accessibility gap that affects users who have enabled reduced motion in their OS settings.

---

## 3. Business Objective

Fix four CSS and token-level deviations to bring the layout, radius system, disabled state opacity, and motion accessibility into compliance with the UI guidelines.

---

## 4. Scope

### Included

- `Landing.jsx`: `min-h-screen` → `min-h-[100dvh]`.
- `FilterPanel.jsx` line 294: `rounded-lg border-ink-3` → `rounded-none border-ink-4` on the multiselect option list.
- `tailwind.config.js`: add `'40': '0.4'` under `extend.opacity`.
- `FilterPanel.jsx` (4 occurrences at lines 96, 271, 351, 397): `opacity-50` → `opacity-40`.
- `src/index.css`: add a `@media (prefers-reduced-motion: reduce)` rule that sets `transition-duration` and `animation-duration` to `0.01ms` on all elements.

### Excluded

- Changes to any component JSX beyond the class name substitutions listed above.
- Changes to the design token CSS file (`design-tokens.css`).
- New motion tokens or easing variables.
- Any hover behavior changes (addressed in EVO-021 as a documentation-only clarification).

---

## 5. Constraints

### Business constraints

- The `opacity-40` Tailwind extension must not conflict with any existing opacity utility in the config.
- The `prefers-reduced-motion` rule must preserve color and opacity transitions (only position and movement animations are suppressed).

### Known technical constraints

- Tailwind 3 does not include `opacity-40` by default; the `extend.opacity` approach is the correct way to add it without ejecting the config.
- `0.01ms` (not `0`) is used for duration to avoid known issues with certain CSS animation libraries that check for a non-zero duration.

### Regulatory / security constraints

- None.

---

## 6. Use Cases

### Nominal case

As a visitor on a mobile device,
I want the page height to fill the visible viewport correctly without jumping when the browser address bar appears or disappears,
so that the layout feels stable and intentional.

### Alternative cases

- Visitor has `prefers-reduced-motion` enabled: position and movement animations are suppressed; color and opacity transitions continue to work.

### Known error cases

- None.

---

## 7. Acceptance Criteria

- [ ] The page wrapper uses `min-h-[100dvh]` in place of `min-h-screen`.
- [ ] The multiselect option list in `FilterPanel` has no border radius and uses `border-ink-4`.
- [ ] The Tailwind config exposes an `opacity-40` utility.
- [ ] All four disabled state containers in `FilterPanel` use `opacity-40`.
- [ ] A `prefers-reduced-motion: reduce` rule exists in `index.css` that suppresses transition and animation durations.
- [ ] Color and opacity transitions remain active when `prefers-reduced-motion` is enabled.
- [ ] No visual regression is introduced on desktop or in non-reduced-motion environments.

---

## 8. Open Questions

- None.

---

## 9. Assumptions

- The project uses Tailwind CSS v3; `extend.opacity` is the standard extension point.
- `min-h-[100dvh]` is supported by all target browsers (Chrome 108+, Safari 15.4+, Firefox 110+).
- The `prefers-reduced-motion` global rule is additive and does not override any existing targeted motion rules.
